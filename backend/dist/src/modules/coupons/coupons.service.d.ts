import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
export declare class CouponsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private validateCoupon;
    validate(dto: ValidateCouponDto): Promise<{
        success: boolean;
        message: string;
        data: {
            code: string;
            description: string | null;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            minOrderAmount: number | null;
            maxDiscount: number | null;
            expiryDate: Date;
            discountAmount: number;
            isFreeDelivery: boolean;
        };
    }>;
    validateForUser(dto: ValidateCouponDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            code: string;
            description: string | null;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            minOrderAmount: number | null;
            maxDiscount: number | null;
            expiryDate: Date;
            discountAmount: number;
            isFreeDelivery: boolean;
        };
    }>;
    findPublic(): Promise<{
        success: boolean;
        data: {
            code: string;
            description: string | null;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            minOrderAmount: number | null;
            maxDiscount: number | null;
            expiryDate: Date;
        }[];
    }>;
    getMyCoupons(userId: string): Promise<{
        success: boolean;
        data: {
            coupon: {
                discountValue: number;
                description: string | null;
                isActive: boolean;
                code: string;
                discountType: import(".prisma/client").$Enums.DiscountType;
                expiryDate: Date;
            };
            id: string;
            userId: string;
            couponId: string;
            orderId: string | null;
            usedAt: Date;
        }[];
    }>;
}
