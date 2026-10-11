import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public: validate coupon (guest + authenticated) ────
  async validate(dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (!coupon) throw new NotFoundException('এই কুপন কোডটি বিদ্যমান নেই');
    if (!coupon.isActive) throw new BadRequestException('এই কুপনটি আর সক্রিয় নেই');

    const now = new Date();
    if (now < coupon.startDate) throw new BadRequestException('এই কুপনটি এখনো শুরু হয়নি');
    if (now > coupon.expiryDate) throw new BadRequestException('এই কুপনের মেয়াদ শেষ হয়ে গেছে');

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে');
    }

    if (coupon.minOrderAmount && dto.orderAmount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `এই কুপন ব্যবহার করতে ন্যূনতম ৳${coupon.minOrderAmount} অর্ডার করতে হবে`,
      );
    }

    // Calculate discount amount
    const subtotal = dto.orderAmount;
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = Math.min(Number(coupon.discountValue), subtotal);
    } else if (coupon.discountType === 'FREE_DELIVERY') {
      discountAmount = 60; // default delivery charge
    }

    return {
      success: true,
      message: 'কুপন বৈধ',
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
    };
  }

  // ── Public: list active coupons (for display) ──────────
  async findPublic() {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: { gte: new Date() },
        startDate: { lte: new Date() },
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscount: true,
        expiryDate: true,
      },
      orderBy: { discountValue: 'desc' },
    });
    return { success: true, data: coupons };
  }
}
