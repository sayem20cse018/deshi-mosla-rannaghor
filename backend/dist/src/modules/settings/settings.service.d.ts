import { PrismaService } from '../../common/prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(group?: string): Promise<{
        success: boolean;
        data: {
            settings: {
                description: string | null;
                id: string;
                updatedAt: Date;
                key: string;
                value: string;
                group: string | null;
            }[];
            grouped: Record<string, Record<string, string>>;
        };
    }>;
    get(key: string): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            key: string;
            value: string;
            group: string | null;
        } | null;
    }>;
    set(key: string, value: string): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            key: string;
            value: string;
            group: string | null;
        };
    }>;
    setBulk(items: {
        key: string;
        value: string;
    }[]): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            key: string;
            value: string;
            group: string | null;
        }[];
        message: string;
    }>;
}
