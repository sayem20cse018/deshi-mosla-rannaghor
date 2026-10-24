import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        success: boolean;
        data: ({
            _count: {
                products: number;
            };
        } & {
            description: string | null;
            banner: string | null;
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
        })[];
    }>;
    findBySlug(slug: string): Promise<{
        success: boolean;
        data: {
            products: {
                price: number;
                discountPrice: number | null;
                primaryImage: string;
                availableStock: number;
                sortOrder: number;
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
            description: string | null;
            banner: string | null;
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
        };
    }>;
    adminFindAll(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: ({
            _count: {
                products: number;
            };
        } & {
            description: string | null;
            banner: string | null;
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminFindOne(id: string): Promise<{
        success: boolean;
        data: {
            products: {
                price: number;
                discountPrice: number | null;
                primaryImage: string;
                sortOrder: number;
                collectionProductId: string;
                images: undefined;
                name: string;
                id: string;
                slug: string;
                sku: string;
                stockStatus: import(".prisma/client").$Enums.StockStatus;
            }[];
            _count: {
                products: number;
            };
            description: string | null;
            banner: string | null;
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
        };
    }>;
    adminCreate(dto: CreateCollectionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            banner: string | null;
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
        };
    }>;
    adminUpdate(id: string, dto: UpdateCollectionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            banner: string | null;
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
        };
    }>;
    adminDelete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminAddProduct(collectionId: string, productId: string, sortOrder?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    adminRemoveProduct(collectionId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
