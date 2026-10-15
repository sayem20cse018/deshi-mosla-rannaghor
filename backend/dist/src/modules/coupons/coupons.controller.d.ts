import { CouponsService } from './coupons.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    findAll(): Promise<{
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
    validateForUser(userId: string, dto: ValidateCouponDto): Promise<{
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
    myCoupons(userId: string): Promise<{
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
