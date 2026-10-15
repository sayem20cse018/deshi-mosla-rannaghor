import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, dto: CreateReviewDto): Promise<{
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
    getProductReviews(productId: string, page?: number, limit?: number, sort?: string): Promise<{
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
    myReviews(userId: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateReviewDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
