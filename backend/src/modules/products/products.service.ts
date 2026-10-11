import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { getPaginationParams, paginate } from '../../common/utils/pagination.util';
import { QueryProductDto, ProductSortBy } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

// ── Shared select for card/list views ─────────────────────
const CARD_SELECT = {
  id: true, name: true, nameEn: true, slug: true, sku: true,
  price: true, discountPrice: true, discountPercent: true,
  weight: true, size: true, stockStatus: true,
  isFeatured: true, isBestSeller: true, isNewArrival: true,
  tags: true, createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  brand:    { select: { id: true, name: true, slug: true } },
  images:   { where: { isPrimary: true }, select: { url: true, altText: true }, take: 1 },
  reviews:  { where: { status: 'APPROVED' }, select: { rating: true } },
  inventory:{ select: { availableStock: true } },
} satisfies Prisma.ProductSelect;

function formatCard(p: any) {
  const reviews: any[] = p.reviews ?? [];
  const avgRating = reviews.length
    ? parseFloat((reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 0;
  return {
    ...p,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    primaryImage: p.images?.[0]?.url ?? null,
    avgRating,
    reviewCount: reviews.length,
    availableStock: p.inventory?.availableStock ?? 0,
    reviews: undefined,
    inventory: undefined,
    images: undefined,
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public: list with filters ──────────────────────────
  async findAll(query: QueryProductDto) {
    const { skip, take, page, limit } = getPaginationParams(query.page, query.limit);
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query.sortBy);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, select: CARD_SELECT, skip, take, orderBy }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: products.map(formatCard),
      meta: paginate(total, page, limit),
    };
  }

  // ── Public: single product by slug (full detail) ───────
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          include: { parent: { select: { id: true, name: true, slug: true } } },
        },
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        inventory: true,
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');

    const reviews = product.reviews;
    const avgRating = reviews.length
      ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

    // Rating distribution
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));

    return {
      success: true,
      data: {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        avgRating,
        reviewCount: reviews.length,
        ratingDistribution: distribution,
      },
    };
  }

  // ── Public: related products ──────────────────────────
  async getRelated(slug: string, limit = 6) {
    const safeLimit = Math.min(20, Math.max(1, Number(limit) || 6));
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true, categoryId: true },
    });
    if (!product) return { success: true, data: [] };

    const related = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      select: CARD_SELECT,
      take: safeLimit,
      orderBy: { isBestSeller: 'desc' },
    });

    return { success: true, data: related.map(formatCard) };
  }

  // ── Public: featured / best-sellers / new-arrivals ────
  async getFeatured(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: CARD_SELECT, take: safeLimit, orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: products.map(formatCard) };
  }

  async getBestSellers(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      select: CARD_SELECT, take: safeLimit,
    });
    return { success: true, data: products.map(formatCard) };
  }

  async getNewArrivals(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      select: CARD_SELECT, take: safeLimit, orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: products.map(formatCard) };
  }

  // ── Admin: get by id ──────────────────────────────────
  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true, images: true, inventory: true },
    });
    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');
    return { success: true, data: product };
  }

  // ── Admin: create ─────────────────────────────────────
  async create(dto: CreateProductDto) {
    const discountPercent = dto.discountPrice
      ? Math.round(((dto.price - dto.discountPrice) / dto.price) * 100)
      : undefined;

    const product = await this.prisma.product.create({
      data: {
        ...dto,
        price: dto.price,
        discountPrice: dto.discountPrice ?? undefined,
        discountPercent,
        stockStatus: 'IN_STOCK',
        inventory: { create: { totalStock: 0, availableStock: 0 } },
      },
    });
    return { success: true, message: 'পণ্য তৈরি হয়েছে', data: product };
  }

  // ── Admin: update ─────────────────────────────────────
  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);

    const discountPercent =
      dto.discountPrice && dto.price
        ? Math.round(((dto.price - dto.discountPrice) / dto.price) * 100)
        : undefined;

    const product = await this.prisma.product.update({
      where: { id },
      data: { ...dto, discountPercent },
    });
    return { success: true, message: 'পণ্য আপডেট হয়েছে', data: product };
  }

  // ── Admin: delete ─────────────────────────────────────
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true, message: 'পণ্য মুছে ফেলা হয়েছে' };
  }

  // ── Admin: toggle status flags ─────────────────────────
  async toggleFlag(id: string, flag: 'isFeatured' | 'isBestSeller' | 'isNewArrival' | 'isActive') {
    const product = await this.prisma.product.findUnique({ where: { id }, select: { [flag]: true } });
    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');
    const updated = await this.prisma.product.update({
      where: { id },
      data: { [flag]: !(product as any)[flag] },
    });
    return { success: true, data: updated };
  }

  // ── Filter meta: brands & price range for sidebar ─────
  async getFilterMeta(categorySlug?: string) {
    const categoryFilter = categorySlug
      ? { category: { slug: categorySlug } }
      : {};

    const [brands, priceAgg] = await Promise.all([
      this.prisma.brand.findMany({
        where: { isActive: true, products: { some: { isActive: true, ...categoryFilter } } },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.aggregate({
        where: { isActive: true, ...categoryFilter },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return {
      success: true,
      data: {
        brands,
        priceRange: {
          min: Number(priceAgg._min.price ?? 0),
          max: Number(priceAgg._max.price ?? 10000),
        },
      },
    };
  }

  // ── Helpers ───────────────────────────────────────────
  private buildWhere(q: QueryProductDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (q.search) {
      where.OR = [
        { name:   { contains: q.search, mode: 'insensitive' } },
        { nameEn: { contains: q.search, mode: 'insensitive' } },
        { sku:    { contains: q.search, mode: 'insensitive' } },
        { tags:   { has: q.search } },
        { description: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    // Category: match exact slug OR parent slug (include sub-categories)
    if (q.category) {
      where.OR = [
        ...(where.OR as any[] ?? []),
        // handled below via category filter — clear OR for category
      ];
      delete where.OR; // reset; category uses its own AND condition
      if (q.search) {
        where.AND = [
          {
            OR: [
              { name:   { contains: q.search, mode: 'insensitive' } },
              { nameEn: { contains: q.search, mode: 'insensitive' } },
              { sku:    { contains: q.search, mode: 'insensitive' } },
              { tags:   { has: q.search } },
              { description: { contains: q.search, mode: 'insensitive' } },
            ],
          },
          {
            OR: [
              { category: { slug: q.category } },
              { category: { parent: { slug: q.category } } },
            ],
          },
        ];
      } else {
        where.OR = [
          { category: { slug: q.category } },
          { category: { parent: { slug: q.category } } },
        ];
      }
    } else if (q.search) {
      where.OR = [
        { name:   { contains: q.search, mode: 'insensitive' } },
        { nameEn: { contains: q.search, mode: 'insensitive' } },
        { sku:    { contains: q.search, mode: 'insensitive' } },
        { tags:   { has: q.search } },
        { description: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    if (q.brand)      where.brand        = { slug: q.brand };
    if (q.stockStatus) where.stockStatus = q.stockStatus as any;
    if (q.isFeatured)  where.isFeatured  = true;
    if (q.isBestSeller) where.isBestSeller = true;
    if (q.isNewArrival) where.isNewArrival = true;
    if (q.tag)        where.tags         = { has: q.tag };

    if (q.hasDiscount) {
      where.discountPrice = { not: null };
    }

    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      where.price = {};
      if (q.minPrice !== undefined) (where.price as any).gte = q.minPrice;
      if (q.maxPrice !== undefined) (where.price as any).lte = q.maxPrice;
    }

    return where;
  }

  private buildOrderBy(sortBy?: ProductSortBy): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case ProductSortBy.PRICE_ASC:    return { price: 'asc' };
      case ProductSortBy.PRICE_DESC:   return { price: 'desc' };
      case ProductSortBy.BEST_SELLING: return { isBestSeller: 'desc' };
      case ProductSortBy.NEWEST:
      default:                         return { createdAt: 'desc' };
    }
  }
}
