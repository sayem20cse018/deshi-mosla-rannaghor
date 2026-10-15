import { PrismaService } from '../../common/prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        success: boolean;
        data: ({
            _count: {
                products: number;
            };
            children: {
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
            }[];
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
        })[];
    }>;
    findAllFlat(): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            nameEn: string | null;
            slug: string;
            sortOrder: number;
            icon: string | null;
            parentId: string | null;
        }[];
    }>;
    findForNav(): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            _count: {
                products: number;
            };
            nameEn: string | null;
            slug: string;
            icon: string | null;
            navOrder: number;
        }[];
    }>;
    findBySlug(slug: string): Promise<{
        success: boolean;
        data: {
            _count: {
                products: number;
            };
            parent: {
                name: string;
                id: string;
                nameEn: string | null;
                slug: string;
            } | null;
            children: {
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
            }[];
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
    }>;
}
