"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
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
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId, isActive: true },
            select: { id: true, name: true },
        });
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
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
            throw new common_1.BadRequestException('শুধুমাত্র ক্রয় করা পণ্যে রিভিউ দিতে পারবেন। পণ্যটি ডেলিভারি হওয়ার পর রিভিউ দিন।');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: { userId, productId: dto.productId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('আপনি এই পণ্যে ইতিমধ্যে রিভিউ দিয়েছেন। রিভিউ সম্পাদনা করতে পারেন।');
        }
        const review = await this.prisma.review.create({
            data: {
                userId,
                productId: dto.productId,
                orderId: dto.orderId ?? hasPurchased.order.id,
                rating: dto.rating,
                title: dto.title?.trim() || null,
                comment: dto.comment?.trim() || null,
                images: (dto.images ?? []).slice(0, 3),
                status: 'PENDING',
            },
            select: REVIEW_SELECT,
        });
        await this.updateProductRating(dto.productId);
        return {
            success: true,
            message: 'রিভিউ সফলভাবে জমা হয়েছে। অনুমোদনের পর প্রকাশিত হবে।',
            data: review,
        };
    }
    async getProductReviews(productId, page = 1, limit = 10, sort = 'latest') {
        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.min(50, Math.max(1, Number(limit)));
        const skip = (safePage - 1) * safeLimit;
        const orderBy = sort === 'rating_high' ? { rating: 'desc' }
            : sort === 'rating_low' ? { rating: 'asc' }
                : { createdAt: 'desc' };
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
        const all = await this.prisma.review.findMany({
            where: { productId, status: 'APPROVED' },
            select: { rating: true },
        });
        const distribution = [5, 4, 3, 2, 1].map((s) => ({
            star: s,
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
    async getMyReviews(userId) {
        const reviews = await this.prisma.review.findMany({
            where: { userId },
            select: REVIEW_SELECT,
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: reviews };
    }
    async updateReview(userId, reviewId, dto) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('রিভিউটি পাওয়া যায়নি');
        if (review.userId !== userId)
            throw new common_1.ForbiddenException('এই রিভিউটি আপনার নয়');
        if (review.status === 'REJECTED') {
            throw new common_1.BadRequestException('প্রত্যাখ্যাত রিভিউ সম্পাদনা করা যাবে না');
        }
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(dto.rating !== undefined && { rating: dto.rating }),
                ...(dto.title !== undefined && { title: dto.title?.trim() || null }),
                ...(dto.comment !== undefined && { comment: dto.comment?.trim() || null }),
                ...(dto.images !== undefined && { images: dto.images.slice(0, 3) }),
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
    async deleteReview(userId, reviewId) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('রিভিউটি পাওয়া যায়নি');
        if (review.userId !== userId)
            throw new common_1.ForbiddenException('এই রিভিউটি আপনার নয়');
        await this.prisma.review.delete({ where: { id: reviewId } });
        await this.updateProductRating(review.productId);
        return { success: true, message: 'রিভিউ মুছে ফেলা হয়েছে' };
    }
    async canReview(userId, productId) {
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
                canReview: !!hasPurchased && !hasReviewed,
                hasPurchased: !!hasPurchased,
                hasReviewed: !!hasReviewed,
                existingReviewId: hasReviewed?.id ?? null,
                existingStatus: hasReviewed?.status ?? null,
            },
        };
    }
    async updateProductRating(productId) {
        const reviews = await this.prisma.review.findMany({
            where: { productId, status: 'APPROVED' },
            select: { rating: true },
        });
        const avg = reviews.length
            ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
            : 0;
        await this.prisma.product.update({
            where: { id: productId },
            data: { avgRating: avg },
        }).catch(() => { });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map