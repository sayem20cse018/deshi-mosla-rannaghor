import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

const DEFAULT_DELIVERY_CHARGE = 60;

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Core validation logic (shared) ────────────────────
  private async validateCoupon(code: string, orderAmount: number, userId?: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon)     throw new NotFoundException('এই কুপন কোডটি বিদ্যমান নেই');
    if (!coupon.isActive) throw new BadRequestException('এই কুপনটি আর সক্রিয় নেই');

    const now = new Date();
    if (now < coupon.startDate)  throw new BadRequestException('এই কুপনটি এখনো শুরু হয়নি');
    if (now > coupon.expiryDate) throw new BadRequestException('এই কুপনের মেয়াদ শেষ হয়ে গেছে');

    // Global usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে');
    }

    // Per-user limit (requires userId)
    if (userId && coupon.userLimit) {
      const userUsage = await this.prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });
      if (userUsage >= coupon.userLimit) {
        throw new BadRequestException(
          `এই কুপনটি আপনি সর্বোচ্চ ${coupon.userLimit} বার ব্যবহার করতে পারবেন। আপনার সীমা শেষ।`,
        );
      }
    }

    // Minimum order
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `এই কুপন ব্যবহার করতে ন্যূনতম ৳${Number(coupon.minOrderAmount).toLocaleString('bn-BD')} অর্ডার করতে হবে`,
      );
    }

    // Calculate discount
    const subtotal = orderAmount;
    let discountAmount = 0;

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = Math.min(Number(coupon.discountValue), subtotal);
    } else if (coupon.discountType === 'FREE_DELIVERY') {
      discountAmount = DEFAULT_DELIVERY_CHARGE;
    }

    return {
      coupon,
      result: {
        code:           coupon.code,
        description:    coupon.description,
        discountType:   coupon.discountType,
        discountValue:  Number(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
        maxDiscount:    coupon.maxDiscount     ? Number(coupon.maxDiscount)    : null,
        expiryDate:     coupon.expiryDate,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        isFreeDelivery: coupon.discountType === 'FREE_DELIVERY',
      },
    };
  }

  // ── Public validate (guest / unauthenticated) ──────────
  async validate(dto: ValidateCouponDto) {
    const { result } = await this.validateCoupon(dto.code, dto.orderAmount);
    return { success: true, message: 'কুপন বৈধ', data: result };
  }

  // ── Authenticated validate (checks user-limit) ─────────
  async validateForUser(dto: ValidateCouponDto, userId: string) {
    const { result } = await this.validateCoupon(dto.code, dto.orderAmount, userId);
    return { success: true, message: 'কুপন বৈধ', data: result };
  }

  // ── Public: list active coupons ────────────────────────
  async findPublic() {
    const now = new Date();
    const coupons = await this.prisma.coupon.findMany({
      where: {
        isActive:  true,
        expiryDate: { gte: now },
        startDate:  { lte: now },
        OR: [
          { usageLimit: null },
          { usageLimit: { gt: 0 } }, // still has uses left filter done below
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

    // Filter out fully-used coupons
    const available = coupons.filter(
      (c) => !c.usageLimit || c.usedCount < c.usageLimit,
    );

    return {
      success: true,
      data: available.map((c) => ({
        code:           c.code,
        description:    c.description,
        discountType:   c.discountType,
        discountValue:  Number(c.discountValue),
        minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
        maxDiscount:    c.maxDiscount    ? Number(c.maxDiscount)    : null,
        expiryDate:     c.expiryDate,
      })),
    };
  }

  // ── My used coupons (authenticated) ───────────────────
  async getMyCoupons(userId: string) {
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
}
