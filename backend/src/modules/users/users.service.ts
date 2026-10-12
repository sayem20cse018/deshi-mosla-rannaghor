import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ── Profile ───────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, avatar: true, gender: true, dateOfBirth: true,
        isEmailVerified: true, isPhoneVerified: true,
        lastLoginAt: true, createdAt: true,
        _count: { select: { orders: true, reviews: true, addresses: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: user };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatar && { avatar: dto.avatar }),
        ...(dto.gender && { gender: dto.gender as any }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
      },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, avatar: true, gender: true, dateOfBirth: true,
      },
    });
    return { success: true, message: 'প্রোফাইল আপডেট হয়েছে', data: user };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('বর্তমান পাসওয়ার্ড ভুল');

    const rounds = this.config.get<number>('BCRYPT_ROUNDS', 12);
    const hashed = await bcrypt.hash(dto.newPassword, rounds);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { success: true, message: 'পাসওয়ার্ড পরিবর্তন হয়েছে' };
  }

  // ── Orders (read-only for account page) ──────────────
  async getMyOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            select: {
              productName: true, productImage: true,
              quantity: true, unitPrice: true, totalPrice: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        totalAmount: Number(o.totalAmount),
        deliveryCharge: Number(o.deliveryCharge),
        discountAmount: Number(o.discountAmount),
        couponDiscount: Number(o.couponDiscount),
      })),
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: true,
        address: true,
        payment: {
          select: {
            id: true, paymentMethod: true, paymentStatus: true,
            paidAt: true, transactionId: true, amount: true,
          },
        },
        delivery: {
          select: {
            status: true, courierName: true,
            trackingNumber: true, estimatedDate: true,
          },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) throw new NotFoundException('অর্ডারটি পাওয়া যায়নি');

    return {
      success: true,
      data: {
        ...order,
        subtotal: Number(order.subtotal),
        totalAmount: Number(order.totalAmount),
        deliveryCharge: Number(order.deliveryCharge),
        discountAmount: Number(order.discountAmount),
        couponDiscount: Number(order.couponDiscount),
      },
    };
  }

  // ── Addresses ─────────────────────────────────────────
  async getAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return { success: true, data: addresses };
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    // If isDefault, unset all others
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const count = await this.prisma.address.count({ where: { userId } });
    const address = await this.prisma.address.create({
      data: {
        ...dto,
        userId,
        isDefault: dto.isDefault ?? count === 0, // first address is default
      },
    });
    return { success: true, message: 'ঠিকানা যোগ হয়েছে', data: address };
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) throw new NotFoundException('ঠিকানাটি পাওয়া যায়নি');

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
    return { success: true, message: 'ঠিকানা আপডেট হয়েছে', data: address };
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) throw new NotFoundException('ঠিকানাটি পাওয়া যায়নি');
    await this.prisma.address.delete({ where: { id: addressId } });
    return { success: true, message: 'ঠিকানা মুছে ফেলা হয়েছে' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) throw new NotFoundException('ঠিকানাটি পাওয়া যায়নি');

    await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    await this.prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
    return { success: true, message: 'ডিফল্ট ঠিকানা সেট হয়েছে' };
  }

  // ── Payment history ───────────────────────────────────
  async getPaymentHistory(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId, paymentStatus: { in: ['PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'] } },
      select: {
        id: true, orderNumber: true, totalAmount: true,
        paymentMethod: true, paymentStatus: true, createdAt: true,
        payment: {
          select: { transactionId: true, paidAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: orders.map((o) => ({ ...o, totalAmount: Number(o.totalAmount) })),
    };
  }

  // ── My Reviews ────────────────────────────────────────
  async getMyReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reviews };
  }

  // ── My Coupons used ───────────────────────────────────
  async getMyCoupons(userId: string) {
    const usages = await this.prisma.couponUsage.findMany({
      where: { userId },
      include: {
        coupon: {
          select: {
            code: true, description: true, discountType: true,
            discountValue: true, expiryDate: true,
          },
        },
      },
      orderBy: { usedAt: 'desc' },
    });
    return { success: true, data: usages };
  }

  // ── Notifications ─────────────────────────────────────
  async getNotifications(userId: string, unreadOnly = false) {
    const notifs = await this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly && { isRead: false }) },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return { success: true, data: notifs };
  }

  async markNotificationsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true, message: 'সব নোটিফিকেশন পড়া হয়েছে' };
  }
}
