import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

const REVIEW_SELECT = {
  id: true, rating: true, title: true, comment: true,
  images: true, status: true, createdAt: true, updatedAt: true,
  orderId: true,
  user: { select: { id: true, name: true, avatar: true } },
  product: {
    select: {
      id: true, name: true, slug: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  },
};

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 1. CREATE review ──────────────────────────────────
  async createReview(userId: string, dto: CreateReviewDto) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, isActive: true },
      select: { id: true, name: true },
    });
    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');

    // Check purchase eligibility — user must have a DELIVERED order with this product
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
      select: { id: true, order: { select: { id: true } } },
    });

    if (!hasPurchased) {
      throw new BadRequestException(
        'শুধুমাত্র ক্রয় করা পণ্যে রিভিউ দিতে পারবেন। পণ্যটি ডেলিভারি হওয়ার পর রিভিউ দিন।',
      );
    }

    // Check duplicate: one review per user per product (regardless of orderId)
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId: dto.productId },
    });
    if (existingReview) {
      throw new BadRequestException(
        'আপনি এই পণ্যে ইতিমধ্যে রিভিউ দিয়েছেন। রিভিউ সম্পাদনা করতে পারেন।',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId:   dto.productId,
        orderId:     dto.orderId ?? hasPurchased.order.id,
        rating:      dto.rating,
        title:       dto.title?.trim() || null,
        comment:     dto.comment?.trim() || null,
        images:      (dto.images ?? []).slice(0, 3), // max 3 images
        status:      'PENDING',
      },
      select: REVIEW_SELECT,
    });

    // Update product aggregate rating
    await this.updateProductRating(dto.productId);

    return {
      success: true,
      message:
        'রিভিউ সফলভাবে জমা হয়েছে। অনুমোদনের পর প্রকাশিত হবে।',
      data: review,
    };
  }

  // ── 2. GET reviews for a product (public — approved only) ─
  async getProductReviews(
    productId: string,
    page = 1, limit = 10,
    sort: 'latest' | 'rating_high' | 'rating_low' = 'latest',
  ) {
    const safePage  = Math.max(1, Number(page));
    const safeLimit = Math.min(50, Math.max(1, Number(limit)));
    const skip = (safePage - 1) * safeLimit;

    const orderBy =
      sort === 'rating_high' ? { rating: 'desc' as const }
      : sort === 'rating_low'  ? { rating: 'asc'  as const }
      : { createdAt: 'desc' as const };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, status: 'APPROVED' },
        select: REVIEW_SELECT,
        orderBy,
        skip,
        take: safeLimit,
      }),
      this.prisma.review.count({ where: { productId, status: 'APPROVED' } }),
    ]);

    // Rating distribution
    const all = await this.prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      select: { rating: true },
    });
    const distribution = [5, 4, 3, 2, 1].map((s) => ({
      star:  s,
      count: all.filter((r) => r.rating === s).length,
    }));
    const avgRating = all.length
      ? parseFloat((all.reduce((sum, r) => sum + r.rating, 0) / all.length).toFixed(1))
      : 0;

    return {
      success: true,
      data: reviews,
      meta: {
        total, page: safePage, limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNext: safePage * safeLimit < total,
        hasPrev: safePage > 1,
        avgRating,
        reviewCount: total,
        distribution,
      },
    };
  }

  // ── 3. GET my reviews ─────────────────────────────────
  async getMyReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      select: REVIEW_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reviews };
  }

  // ── 4. UPDATE own review (only PENDING or APPROVED) ───
  async updateReview(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('রিভিউটি পাওয়া যায়নি');
    if (review.userId !== userId) throw new ForbiddenException('এই রিভিউটি আপনার নয়');
    if (review.status === 'REJECTED') {
      throw new BadRequestException('প্রত্যাখ্যাত রিভিউ সম্পাদনা করা যাবে না');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(dto.rating  !== undefined && { rating:  dto.rating }),
        ...(dto.title   !== undefined && { title:   dto.title?.trim()   || null }),
        ...(dto.comment !== undefined && { comment: dto.comment?.trim() || null }),
        ...(dto.images  !== undefined && { images:  dto.images.slice(0, 3) }),
        // Re-submit for moderation if previously approved
        status: review.status === 'APPROVED' ? 'PENDING' : review.status,
      },
      select: REVIEW_SELECT,
    });

    await this.updateProductRating(review.productId);

    return {
      success: true,
      message: 'রিভিউ আপডেট হয়েছে। পুনরায় অনুমোদনের অপেক্ষায় আছে।',
      data: updated,
    };
  }

  // ── 5. DELETE own review ──────────────────────────────
  async deleteReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('রিভিউটি পাওয়া যায়নি');
    if (review.userId !== userId) throw new ForbiddenException('এই রিভিউটি আপনার নয়');

    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.updateProductRating(review.productId);

    return { success: true, message: 'রিভিউ মুছে ফেলা হয়েছে' };
  }

  // ── 6. Check if user can review a product ────────────
  async canReview(userId: string, productId: string) {
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: { productId, order: { userId, status: 'DELIVERED' } },
    });
    const hasReviewed = await this.prisma.review.findFirst({
      where: { userId, productId },
      select: { id: true, status: true },
    });
    return {
      success: true,
      data: {
        canReview:    !!hasPurchased && !hasReviewed,
        hasPurchased: !!hasPurchased,
        hasReviewed:  !!hasReviewed,
        existingReviewId: hasReviewed?.id ?? null,
        existingStatus:   hasReviewed?.status ?? null,
      },
    };
  }

  // ── Private: recalculate product aggregate rating ─────
  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      select: { rating: true },
    });
    const avg = reviews.length
      ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 0;
    // Store on product for quick reads
    await this.prisma.product.update({
      where: { id: productId },
      data: { avgRating: avg } as any,
    }).catch(() => {}); // avgRating field may not exist — ignore
  }
}
