import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryProductDto): Promise<{
        success: boolean;
        data: any[];
        meta: import("../../common/utils/pagination.util").PaginationMeta;
    }>;
    findBySlug(slug: string): Promise<{
        success: boolean;
        data: {
            price: number;
            discountPrice: number | null;
            avgRating: number;
            reviewCount: number;
            ratingDistribution: {
                star: number;
                count: number;
            }[];
            category: {
                parent: {
                    name: string;
                    id: string;
                    slug: string;
                } | null;
            } & {
                description: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameEn: string | null;
                slug: string;
                metaTitle: string | null;
                metaDesc: string | null;
                sortOrder: number;
                image: string | null;
                icon: string | null;
                parentId: string | null;
                showInNav: boolean;
                navOrder: number;
            };
            brand: {
                description: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameEn: string | null;
                slug: string;
                logo: string | null;
                website: string | null;
            } | null;
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                totalStock: number;
                availableStock: number;
                soldQuantity: number;
                reservedStock: number;
                lowStockAlert: number;
            } | null;
            reviews: ({
                user: {
                    name: string;
                    id: string;
                    avatar: string | null;
                };
            } & {
                title: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ReviewStatus;
                userId: string;
                orderId: string | null;
                productId: string;
                rating: number;
                comment: string | null;
                images: string[];
                adminNote: string | null;
            })[];
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                isPrimary: boolean;
                url: string;
                altText: string | null;
                sortOrder: number;
            }[];
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        };
    }>;
    getRelated(slug: string, limit?: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    getFeatured(limit?: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    getBestSellers(limit?: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    getNewArrivals(limit?: number): Promise<{
        success: boolean;
        data: any[];
    }>;
    findById(id: string): Promise<{
        success: boolean;
        data: {
            category: {
                description: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameEn: string | null;
                slug: string;
                metaTitle: string | null;
                metaDesc: string | null;
                sortOrder: number;
                image: string | null;
                icon: string | null;
                parentId: string | null;
                showInNav: boolean;
                navOrder: number;
            };
            brand: {
                description: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameEn: string | null;
                slug: string;
                logo: string | null;
                website: string | null;
            } | null;
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                totalStock: number;
                availableStock: number;
                soldQuantity: number;
                reservedStock: number;
                lowStockAlert: number;
            } | null;
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                isPrimary: boolean;
                url: string;
                altText: string | null;
                sortOrder: number;
            }[];
        } & {
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            discountPrice: Prisma.Decimal | null;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            price: Prisma.Decimal;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            avgRating: number | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        };
    }>;
    create(dto: CreateProductDto): Promise<{
        success: boolean;
        message: string;
        data: {
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            discountPrice: Prisma.Decimal | null;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            price: Prisma.Decimal;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            avgRating: number | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        };
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        success: boolean;
        message: string;
        data: {
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            discountPrice: Prisma.Decimal | null;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            price: Prisma.Decimal;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            avgRating: number | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleFlag(id: string, flag: 'isFeatured' | 'isBestSeller' | 'isNewArrival' | 'isActive'): Promise<{
        success: boolean;
        data: {
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            discountPrice: Prisma.Decimal | null;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            price: Prisma.Decimal;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            avgRating: number | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        };
    }>;
    getFilterMeta(categorySlug?: string): Promise<{
        success: boolean;
        data: {
            brands: {
                name: string;
                id: string;
                slug: string;
            }[];
            priceRange: {
                min: number;
                max: number;
            };
        };
    }>;
    private buildWhere;
    private buildOrderBy;
    adminFindAll(query: QueryProductDto): Promise<{
        success: boolean;
        data: {
            price: number;
            discountPrice: number | null;
            primaryImage: any;
            availableStock: any;
            reviewCount: any;
            orderCount: any;
            images: undefined;
            inventory: undefined;
            category: {
                name: string;
                id: string;
                slug: string;
            };
            brand: {
                name: string;
                id: string;
            } | null;
            _count: {
                reviews: number;
                orderItems: number;
            };
            tags: string[];
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            sku: string;
            categoryId: string;
            brandId: string | null;
            ingredients: string | null;
            usage: string | null;
            storageInfo: string | null;
            origin: string | null;
            weight: string | null;
            size: string | null;
            discountPercent: number | null;
            minOrderQty: number;
            maxOrderQty: number | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            avgRating: number | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            isNewArrival: boolean;
            metaTitle: string | null;
            metaDesc: string | null;
        }[];
        meta: import("../../common/utils/pagination.util").PaginationMeta;
    }>;
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    bulkStatus(ids: string[], isActive: boolean): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    addImage(productId: string, url: string, altText?: string, isPrimary?: boolean): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            productId: string;
            isPrimary: boolean;
            url: string;
            altText: string | null;
            sortOrder: number;
        };
    }>;
    deleteImage(imageId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    setPrimaryImage(productId: string, imageId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
