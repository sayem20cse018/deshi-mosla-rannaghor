import { PrismaService } from '../../common/prisma/prisma.service';
export declare class BannersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHeroSlides(): Promise<{
        success: boolean;
        data: {
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            tag: string | null;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            tagEn: string | null;
            badge: string | null;
            badgeEn: string | null;
            imageMobile: string | null;
            ctaLabel: string | null;
            ctaLabelEn: string | null;
            ctaUrl: string | null;
            cta2Label: string | null;
            cta2LabelEn: string | null;
            cta2Url: string | null;
            bgColor: string | null;
            emoji: string | null;
            endDate: Date | null;
        }[];
    }>;
    getHomepageSections(): Promise<{
        success: boolean;
        data: {
            description: string | null;
            title: string | null;
            id: string;
            updatedAt: Date;
            sortOrder: number;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            imageMobile: string | null;
            key: string;
            buttonLabel: string | null;
            buttonLabelEn: string | null;
            buttonUrl: string | null;
            extraData: import("@prisma/client/runtime/library").JsonValue | null;
            isEnabled: boolean;
        }[];
    }>;
    getHomepageSection(key: string): Promise<{
        success: boolean;
        data: {
            description: string | null;
            title: string | null;
            id: string;
            updatedAt: Date;
            sortOrder: number;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            imageMobile: string | null;
            key: string;
            buttonLabel: string | null;
            buttonLabelEn: string | null;
            buttonUrl: string | null;
            extraData: import("@prisma/client/runtime/library").JsonValue | null;
            isEnabled: boolean;
        } | null;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: {
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            tag: string | null;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            tagEn: string | null;
            badge: string | null;
            badgeEn: string | null;
            imageMobile: string | null;
            ctaLabel: string | null;
            ctaLabelEn: string | null;
            ctaUrl: string | null;
            cta2Label: string | null;
            cta2LabelEn: string | null;
            cta2Url: string | null;
            bgColor: string | null;
            emoji: string | null;
            endDate: Date | null;
        }[];
    }>;
}
