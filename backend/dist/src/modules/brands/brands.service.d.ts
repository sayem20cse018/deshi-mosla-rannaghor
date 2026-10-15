import { PrismaService } from '../../common/prisma/prisma.service';
export declare class BrandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
}
