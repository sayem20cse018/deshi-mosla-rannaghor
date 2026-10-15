import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReview(userId: string, dto: CreateReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
            product: {
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                slug: string;
            };
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            orderId: string | null;
            rating: number;
            comment: string | null;
            images: string[];
        };
    }>;
    getProductReviews(productId: string, page?: number, limit?: number, sort?: 'latest' | 'rating_high' | 'rating_low'): Promise<{
        success: boolean;
        data: {
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
            product: {
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                slug: string;
            };
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            orderId: string | null;
            rating: number;
            comment: string | null;
            images: string[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
            avgRating: number;
            reviewCount: number;
            distribution: {
                star: number;
                count: number;
            }[];
        };
    }>;
    getMyReviews(userId: string): Promise<{
        success: boolean;
        data: {
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
            product: {
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                slug: string;
            };
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            orderId: string | null;
            rating: number;
            comment: string | null;
            images: string[];
        }[];
    }>;
    updateReview(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
            product: {
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                slug: string;
            };
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            orderId: string | null;
            rating: number;
            comment: string | null;
            images: string[];
        };
    }>;
    deleteReview(userId: string, reviewId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    canReview(userId: string, productId: string): Promise<{
        success: boolean;
        data: {
            canReview: boolean;
            hasPurchased: boolean;
            hasReviewed: boolean;
            existingReviewId: string | null;
            existingStatus: import(".prisma/client").$Enums.ReviewStatus | null;
        };
    }>;
    private updateProductRating;
}
