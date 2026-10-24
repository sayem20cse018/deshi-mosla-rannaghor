import { MediaService } from './media.service';
declare class UpdateMediaDto {
    altText?: string;
}
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    getMedia(page?: string, limit?: string, search?: string, folder?: string, format?: string): Promise<{
        success: boolean;
        data: {
            format: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            altText: string | null;
            publicId: string;
            secureUrl: string;
            originalName: string;
            width: number | null;
            height: number | null;
            bytes: number | null;
            folder: string | null;
            resourceType: string;
            uploadedBy: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFolders(): Promise<{
        success: boolean;
        data: (string | null)[];
    }>;
    getSignedUrl(folder?: string): Promise<{
        success: boolean;
        data: {
            signature: string;
            timestamp: number;
            apiKey: any;
            cloudName: any;
            folder: string;
        };
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        data: {
            format: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            altText: string | null;
            publicId: string;
            secureUrl: string;
            originalName: string;
            width: number | null;
            height: number | null;
            bytes: number | null;
            folder: string | null;
            resourceType: string;
            uploadedBy: string | null;
        };
    }>;
    uploadOne(file: Express.Multer.File, folder?: string, email?: string): Promise<{
        success: boolean;
        data: {
            format: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            altText: string | null;
            publicId: string;
            secureUrl: string;
            originalName: string;
            width: number | null;
            height: number | null;
            bytes: number | null;
            folder: string | null;
            resourceType: string;
            uploadedBy: string | null;
        };
    }>;
    uploadBulk(files: Express.Multer.File[], folder?: string, email?: string): Promise<{
        succeeded: any[];
        failed: any[];
        total: number;
    }>;
    updateMedia(id: string, dto: UpdateMediaDto): Promise<{
        success: boolean;
        data: {
            format: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            altText: string | null;
            publicId: string;
            secureUrl: string;
            originalName: string;
            width: number | null;
            height: number | null;
            bytes: number | null;
            folder: string | null;
            resourceType: string;
            uploadedBy: string | null;
        };
    }>;
    deleteMedia(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
