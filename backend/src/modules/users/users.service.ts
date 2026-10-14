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
  async getMyOrders(userId: string, page: any = 1, limit: any = 10) {
    const safePage  = Math.max(1, parseInt(String(page),  10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 10));
    const skip = (safePage - 1) * safeLimit;
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
        take: safeLimit,
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
        total, page: safePage, limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNext: safePage * safeLimit < total,
        hasPrev: safePage > 1,
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

  // ── Wishlist ──────────────────────────────────────────
  private async ensureWishlist(userId: string) {
    return this.prisma.wishlist.upsert({
      where:  { id: (await this.prisma.wishlist.findFirst({ where: { userId } }))?.id ?? '' },
      update: {},
      create: { userId },
    });
  }

  async getWishlist(userId: string) {
    // Upsert wishlist record
    let wishlist = await this.prisma.wishlist.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true, name: true, slug: true,
                price: true, discountPrice: true, discountPercent: true,
                weight: true, stockStatus: true, isActive: true,
                images: { where: { isPrimary: true }, take: 1, select: { url: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: { items: { include: { product: { select: {
          id: true, name: true, slug: true,
          price: true, discountPrice: true, discountPercent: true,
          weight: true, stockStatus: true, isActive: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        } } } } },
      });
    }

    const items = wishlist.items.map((item) => ({
      id:          item.id,
      productId:   item.productId,
      addedAt:     item.createdAt,
      name:        item.product.name,
      slug:        item.product.slug,
      price:       Number(item.product.price),
      discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
      discountPercent: item.product.discountPercent,
      weight:      item.product.weight,
      stockStatus: item.product.stockStatus,
      isActive:    item.product.isActive,
      primaryImage: item.product.images[0]?.url ?? null,
    }));

    return { success: true, data: items, total: items.length };
  }

  async addToWishlist(userId: string, productId: string) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, isActive: true },
    });
    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');

    // Get or create wishlist
    let wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({ data: { userId } });
    }

    // Check duplicate
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    if (existing) {
      return { success: true, message: 'পণ্যটি ইতিমধ্যে উইশলিস্টে আছে', alreadyExists: true };
    }

    await this.prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return { success: true, message: `"${product.name}" উইশলিস্টে যোগ হয়েছে` };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) throw new NotFoundException('উইশলিস্ট পাওয়া যায়নি');

    const item = await this.prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    if (!item) throw new NotFoundException('পণ্যটি উইশলিস্টে নেই');

    await this.prisma.wishlistItem.delete({ where: { id: item.id } });
    return { success: true, message: 'উইশলিস্ট থেকে সরানো হয়েছে' };
  }

  async clearWishlist(userId: string) {
    const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) return { success: true, message: 'উইশলিস্ট খালি' };
    await this.prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
    return { success: true, message: 'উইশলিস্ট পরিষ্কার হয়েছে' };
  }

  async isInWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
    if (!wishlist) return { success: true, data: { inWishlist: false } };
    const item = await this.prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    return { success: true, data: { inWishlist: !!item } };
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
