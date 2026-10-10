import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { getPaginationParams, paginate } from '../../common/utils/pagination.util';

const PRODUCT_SELECT = {
  id: true, name: true, nameEn: true, slug: true, sku: true,
  price: true, discountPrice: true, discountPercent: true,
  weight: true, size: true, stockStatus: true,
  isFeatured: true, isBestSeller: true, isNewArrival: true,
  tags: true, createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  images: { where: { isPrimary: true }, select: { url: true, altText: true }, take: 1 },
  reviews: { select: { rating: true }, where: { status: 'APPROVED' } },
  inventory: { select: { availableStock: true } },
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { skip, take, page, limit } = getPaginationParams(query.page, query.limit);

    const where: any = { isActive: true };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ];
    }
    if (query.category) where.category = { slug: query.category };
    if (query.brand) where.brand = { slug: query.brand };
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }
    if (query.inStock === 'true') where.stockStatus = 'IN_STOCK';

    const orderBy = this.getSortOrder(query.sortBy);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, select: PRODUCT_SELECT, skip, take, orderBy }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: products.map(this.formatProduct),
      meta: paginate(total, page, limit),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        inventory: true,
      },
    });

    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return {
      success: true,
      data: { ...product, avgRating: parseFloat(avgRating.toFixed(1)), reviewCount: product.reviews.length },
    };
  }

  async getFeatured() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: PRODUCT_SELECT,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: products.map(this.formatProduct) };
  }

  async getBestSellers() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      select: PRODUCT_SELECT,
      take: 10,
    });
    return { success: true, data: products.map(this.formatProduct) };
  }

  async getNewArrivals() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      select: PRODUCT_SELECT,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: products.map(this.formatProduct) };
  }

  private formatProduct(p: any) {
    const reviews = p.reviews || [];
    const avgRating =
      reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;
    return {
      ...p,
      primaryImage: p.images?.[0]?.url || null,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviews.length,
      availableStock: p.inventory?.availableStock ?? 0,
    };
  }

  private getSortOrder(sortBy: string) {
    switch (sortBy) {
      case 'price_asc': return { price: 'asc' as const };
      case 'price_desc': return { price: 'desc' as const };
      case 'newest': return { createdAt: 'desc' as const };
      case 'best_selling': return { isBestSeller: 'desc' as const };
      default: return { createdAt: 'desc' as const };
    }
  }
}
