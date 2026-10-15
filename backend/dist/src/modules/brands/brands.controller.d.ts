import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
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
