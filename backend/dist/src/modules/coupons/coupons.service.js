"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const DEFAULT_DELIVERY_CHARGE = 60;
let CouponsService = class CouponsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateCoupon(code, orderAmount, userId) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!coupon)
            throw new common_1.NotFoundException('এই কুপন কোডটি বিদ্যমান নেই');
        if (!coupon.isActive)
            throw new common_1.BadRequestException('এই কুপনটি আর সক্রিয় নেই');
        const now = new Date();
        if (now < coupon.startDate)
            throw new common_1.BadRequestException('এই কুপনটি এখনো শুরু হয়নি');
        if (now > coupon.expiryDate)
            throw new common_1.BadRequestException('এই কুপনের মেয়াদ শেষ হয়ে গেছে');
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে');
        }
        if (userId && coupon.userLimit) {
            const userUsage = await this.prisma.couponUsage.count({
                where: { couponId: coupon.id, userId },
            });
            if (userUsage >= coupon.userLimit) {
                throw new common_1.BadRequestException(`এই কুপনটি আপনি সর্বোচ্চ ${coupon.userLimit} বার ব্যবহার করতে পারবেন। আপনার সীমা শেষ।`);
            }
        }
        if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
            throw new common_1.BadRequestException(`এই কুপন ব্যবহার করতে ন্যূনতম ৳${Number(coupon.minOrderAmount).toLocaleString('bn-BD')} অর্ডার করতে হবে`);
        }
        const subtotal = orderAmount;
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
            }
        }
        else if (coupon.discountType === 'FIXED_AMOUNT') {
            discountAmount = Math.min(Number(coupon.discountValue), subtotal);
        }
        else if (coupon.discountType === 'FREE_DELIVERY') {
            discountAmount = DEFAULT_DELIVERY_CHARGE;
        }
        return {
            coupon,
            result: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: Number(coupon.discountValue),
                minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
                maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
                expiryDate: coupon.expiryDate,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                isFreeDelivery: coupon.discountType === 'FREE_DELIVERY',
            },
        };
    }
    async validate(dto) {
        const { result } = await this.validateCoupon(dto.code, dto.orderAmount);
        return { success: true, message: 'কুপন বৈধ', data: result };
    }
    async validateForUser(dto, userId) {
        const { result } = await this.validateCoupon(dto.code, dto.orderAmount, userId);
        return { success: true, message: 'কুপন বৈধ', data: result };
    }
    async findPublic() {
        const now = new Date();
        const coupons = await this.prisma.coupon.findMany({
            where: {
                isActive: true,
                expiryDate: { gte: now },
                startDate: { lte: now },
                OR: [
                    { usageLimit: null },
                    { usageLimit: { gt: 0 } },
                ],
            },
            select: {
                code: true, description: true,
                discountType: true, discountValue: true,
                minOrderAmount: true, maxDiscount: true,
                expiryDate: true, usageLimit: true, usedCount: true,
                startDate: true,
            },
            orderBy: { discountValue: 'desc' },
        });
        const available = coupons.filter((c) => !c.usageLimit || c.usedCount < c.usageLimit);
        return {
            success: true,
            data: available.map((c) => ({
                code: c.code,
                description: c.description,
                discountType: c.discountType,
                discountValue: Number(c.discountValue),
                minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
                maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
                expiryDate: c.expiryDate,
            })),
        };
    }
    async getMyCoupons(userId) {
        const usages = await this.prisma.couponUsage.findMany({
            where: { userId },
            include: {
                coupon: {
                    select: {
                        code: true, description: true,
                        discountType: true, discountValue: true,
                        expiryDate: true, isActive: true,
                    },
                },
            },
            orderBy: { usedAt: 'desc' },
        });
        return {
            success: true,
            data: usages.map((u) => ({
                ...u,
                coupon: {
                    ...u.coupon,
                    discountValue: Number(u.coupon.discountValue),
                },
            })),
        };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map