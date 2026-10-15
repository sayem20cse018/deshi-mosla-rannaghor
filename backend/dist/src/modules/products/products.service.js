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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const pagination_util_1 = require("../../common/utils/pagination.util");
const query_product_dto_1 = require("./dto/query-product.dto");
const CARD_SELECT = {
    id: true, name: true, nameEn: true, slug: true, sku: true,
    price: true, discountPrice: true, discountPercent: true,
    weight: true, size: true, stockStatus: true,
    isFeatured: true, isBestSeller: true, isNewArrival: true,
    tags: true, createdAt: true,
    category: { select: { id: true, name: true, slug: true } },
    brand: { select: { id: true, name: true, slug: true } },
    images: { where: { isPrimary: true }, select: { url: true, altText: true }, take: 1 },
    reviews: { where: { status: 'APPROVED' }, select: { rating: true } },
    inventory: { select: { availableStock: true } },
};
function formatCard(p) {
    const reviews = p.reviews ?? [];
    const avgRating = reviews.length
        ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
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
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { skip, take, page, limit } = (0, pagination_util_1.getPaginationParams)(query.page, query.limit);
        const where = this.buildWhere(query);
        const orderBy = this.buildOrderBy(query.sortBy);
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({ where, select: CARD_SELECT, skip, take, orderBy }),
            this.prisma.product.count({ where }),
        ]);
        return {
            success: true,
            data: products.map(formatCard),
            meta: (0, pagination_util_1.paginate)(total, page, limit),
        };
    }
    async findBySlug(slug) {
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
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
        const reviews = product.reviews;
        const avgRating = reviews.length
            ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
            : 0;
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
    async getRelated(slug, limit = 6) {
        const safeLimit = Math.min(20, Math.max(1, Number(limit) || 6));
        const product = await this.prisma.product.findUnique({
            where: { slug },
            select: { id: true, categoryId: true },
        });
        if (!product)
            return { success: true, data: [] };
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
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, brand: true, images: true, inventory: true },
        });
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
        return { success: true, data: product };
    }
    async create(dto) {
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
    async update(id, dto) {
        await this.findById(id);
        const discountPercent = dto.discountPrice && dto.price
            ? Math.round(((dto.price - dto.discountPrice) / dto.price) * 100)
            : undefined;
        const product = await this.prisma.product.update({
            where: { id },
            data: { ...dto, discountPercent },
        });
        return { success: true, message: 'পণ্য আপডেট হয়েছে', data: product };
    }
    async remove(id) {
        await this.findById(id);
        await this.prisma.product.delete({ where: { id } });
        return { success: true, message: 'পণ্য মুছে ফেলা হয়েছে' };
    }
    async toggleFlag(id, flag) {
        const product = await this.prisma.product.findUnique({ where: { id }, select: { [flag]: true } });
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
        const updated = await this.prisma.product.update({
            where: { id },
            data: { [flag]: !product[flag] },
        });
        return { success: true, data: updated };
    }
    async getFilterMeta(categorySlug) {
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
    buildWhere(q) {
        const where = { isActive: true };
        if (q.search) {
            where.OR = [
                { name: { contains: q.search, mode: 'insensitive' } },
                { nameEn: { contains: q.search, mode: 'insensitive' } },
                { sku: { contains: q.search, mode: 'insensitive' } },
                { tags: { has: q.search } },
                { description: { contains: q.search, mode: 'insensitive' } },
            ];
        }
        if (q.category) {
            where.OR = [
                ...(where.OR ?? []),
            ];
            delete where.OR;
            if (q.search) {
                where.AND = [
                    {
                        OR: [
                            { name: { contains: q.search, mode: 'insensitive' } },
                            { nameEn: { contains: q.search, mode: 'insensitive' } },
                            { sku: { contains: q.search, mode: 'insensitive' } },
                            { tags: { has: q.search } },
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
            }
            else {
                where.OR = [
                    { category: { slug: q.category } },
                    { category: { parent: { slug: q.category } } },
                ];
            }
        }
        else if (q.search) {
            where.OR = [
                { name: { contains: q.search, mode: 'insensitive' } },
                { nameEn: { contains: q.search, mode: 'insensitive' } },
                { sku: { contains: q.search, mode: 'insensitive' } },
                { tags: { has: q.search } },
                { description: { contains: q.search, mode: 'insensitive' } },
            ];
        }
        if (q.brand)
            where.brand = { slug: q.brand };
        if (q.stockStatus)
            where.stockStatus = q.stockStatus;
        if (q.isFeatured)
            where.isFeatured = true;
        if (q.isBestSeller)
            where.isBestSeller = true;
        if (q.isNewArrival)
            where.isNewArrival = true;
        if (q.tag)
            where.tags = { has: q.tag };
        if (q.hasDiscount) {
            where.discountPrice = { not: null };
        }
        if (q.minPrice !== undefined || q.maxPrice !== undefined) {
            where.price = {};
            if (q.minPrice !== undefined)
                where.price.gte = q.minPrice;
            if (q.maxPrice !== undefined)
                where.price.lte = q.maxPrice;
        }
        return where;
    }
    buildOrderBy(sortBy) {
        switch (sortBy) {
            case query_product_dto_1.ProductSortBy.PRICE_ASC: return { price: 'asc' };
            case query_product_dto_1.ProductSortBy.PRICE_DESC: return { price: 'desc' };
            case query_product_dto_1.ProductSortBy.BEST_SELLING: return { isBestSeller: 'desc' };
            case query_product_dto_1.ProductSortBy.NEWEST:
            default: return { createdAt: 'desc' };
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map