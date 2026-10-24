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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let CollectionsService = class CollectionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const collections = await this.prisma.collection.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: {
                _count: { select: { products: true } },
            },
        });
        return { success: true, data: collections };
    }
    async findBySlug(slug) {
        const collection = await this.prisma.collection.findUnique({
            where: { slug, isActive: true },
            include: {
                products: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        product: {
                            include: {
                                category: { select: { id: true, name: true, slug: true } },
                                brand: { select: { id: true, name: true } },
                                images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                                inventory: { select: { availableStock: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!collection)
            throw new common_1.NotFoundException('Collection not found');
        return {
            success: true,
            data: {
                ...collection,
                products: collection.products.map((cp) => ({
                    ...cp.product,
                    price: Number(cp.product.price),
                    discountPrice: cp.product.discountPrice ? Number(cp.product.discountPrice) : null,
                    primaryImage: cp.product.images[0]?.url ?? null,
                    availableStock: cp.product.inventory?.availableStock ?? 0,
                    sortOrder: cp.sortOrder,
                    images: undefined,
                    inventory: undefined,
                })),
            },
        };
    }
    async adminFindAll(params) {
        const { page = 1, limit = 20, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { nameEn: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [collections, total] = await Promise.all([
            this.prisma.collection.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                include: { _count: { select: { products: true } } },
            }),
            this.prisma.collection.count({ where: where }),
        ]);
        return {
            success: true,
            data: collections,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminFindOne(id) {
        const collection = await this.prisma.collection.findUnique({
            where: { id },
            include: {
                products: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        product: {
                            select: {
                                id: true, name: true, slug: true, sku: true,
                                price: true, discountPrice: true, stockStatus: true,
                                images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                            },
                        },
                    },
                },
                _count: { select: { products: true } },
            },
        });
        if (!collection)
            throw new common_1.NotFoundException('Collection not found');
        return {
            success: true,
            data: {
                ...collection,
                products: collection.products.map((cp) => ({
                    ...cp.product,
                    price: Number(cp.product.price),
                    discountPrice: cp.product.discountPrice ? Number(cp.product.discountPrice) : null,
                    primaryImage: cp.product.images[0]?.url ?? null,
                    sortOrder: cp.sortOrder,
                    collectionProductId: cp.id,
                    images: undefined,
                })),
            },
        };
    }
    async adminCreate(dto) {
        const collection = await this.prisma.collection.create({
            data: {
                name: dto.name,
                nameEn: dto.nameEn,
                slug: dto.slug,
                description: dto.description,
                image: dto.image,
                banner: dto.banner,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                metaTitle: dto.metaTitle,
                metaDesc: dto.metaDesc,
            },
        });
        return { success: true, message: 'Collection created', data: collection };
    }
    async adminUpdate(id, dto) {
        const existing = await this.prisma.collection.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Collection not found');
        const collection = await this.prisma.collection.update({
            where: { id },
            data: dto,
        });
        return { success: true, message: 'Collection updated', data: collection };
    }
    async adminDelete(id) {
        const existing = await this.prisma.collection.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Collection not found');
        await this.prisma.collection.delete({ where: { id } });
        return { success: true, message: 'Collection deleted' };
    }
    async adminAddProduct(collectionId, productId, sortOrder = 0) {
        const existing = await this.prisma.collectionProduct.findUnique({
            where: { collectionId_productId: { collectionId, productId } },
        });
        if (existing)
            return { success: true, message: 'Product already in collection' };
        await this.prisma.collectionProduct.create({
            data: { collectionId, productId, sortOrder },
        });
        return { success: true, message: 'Product added to collection' };
    }
    async adminRemoveProduct(collectionId, productId) {
        await this.prisma.collectionProduct.deleteMany({
            where: { collectionId, productId },
        });
        return { success: true, message: 'Product removed from collection' };
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map