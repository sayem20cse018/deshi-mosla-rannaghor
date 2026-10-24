import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
export declare class MediaService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    uploadFile(buffer: Buffer, originalName: string, mimetype: string, folder?: string, uploadedBy?: string): Promise<{
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
    }>;
    uploadFiles(files: {
        buffer: Buffer;
        originalName: string;
        mimetype: string;
    }[], folder?: string, uploadedBy?: string): Promise<{
        succeeded: any[];
        failed: any[];
        total: number;
    }>;
    getMedia(params: {
        page?: number;
        limit?: number;
        search?: string;
        folder?: string;
        format?: string;
    }): Promise<{
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
    getMediaById(id: string): Promise<{
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
    updateMedia(id: string, altText: string): Promise<{
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
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    getSignedUploadUrl(folder?: string): Promise<{
        success: boolean;
        data: {
            signature: string;
            timestamp: number;
            apiKey: any;
            cloudName: any;
            folder: string;
        };
    }>;
    getFolders(): Promise<{
        success: boolean;
        data: (string | null)[];
    }>;
}
