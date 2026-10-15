"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async getProfile(userId) {
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
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { success: true, data: user };
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.avatar && { avatar: dto.avatar }),
                ...(dto.gender && { gender: dto.gender }),
                ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
            },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, avatar: true, gender: true, dateOfBirth: true,
            },
        });
        return { success: true, message: 'প্রোফাইল আপডেট হয়েছে', data: user };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isMatch)
            throw new common_1.BadRequestException('বর্তমান পাসওয়ার্ড ভুল');
        const rounds = this.config.get('BCRYPT_ROUNDS', 12);
        const hashed = await bcrypt.hash(dto.newPassword, rounds);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        return { success: true, message: 'পাসওয়ার্ড পরিবর্তন হয়েছে' };
    }
    async getMyOrders(userId, page = 1, limit = 10) {
        const safePage = Math.max(1, parseInt(String(page), 10) || 1);
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
    async getOrderDetail(userId, orderId) {
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
        if (!order)
            throw new common_1.NotFoundException('অর্ডারটি পাওয়া যায়নি');
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
    async getAddresses(userId) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        return { success: true, data: addresses };
    }
    async createAddress(userId, dto) {
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
                isDefault: dto.isDefault ?? count === 0,
            },
        });
        return { success: true, message: 'ঠিকানা যোগ হয়েছে', data: address };
    }
    async updateAddress(userId, addressId, dto) {
        const existing = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException('ঠিকানাটি পাওয়া যায়নি');
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
    async deleteAddress(userId, addressId) {
        const existing = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException('ঠিকানাটি পাওয়া যায়নি');
        await this.prisma.address.delete({ where: { id: addressId } });
        return { success: true, message: 'ঠিকানা মুছে ফেলা হয়েছে' };
    }
    async setDefaultAddress(userId, addressId) {
        const existing = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException('ঠিকানাটি পাওয়া যায়নি');
        await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        await this.prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
        return { success: true, message: 'ডিফল্ট ঠিকানা সেট হয়েছে' };
    }
    async getPaymentHistory(userId) {
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
    async getMyReviews(userId) {
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
    async getMyCoupons(userId) {
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
    async ensureWishlist(userId) {
        return this.prisma.wishlist.upsert({
            where: { id: (await this.prisma.wishlist.findFirst({ where: { userId } }))?.id ?? '' },
            update: {},
            create: { userId },
        });
    }
    async getWishlist(userId) {
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
            id: item.id,
            productId: item.productId,
            addedAt: item.createdAt,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
            discountPercent: item.product.discountPercent,
            weight: item.product.weight,
            stockStatus: item.product.stockStatus,
            isActive: item.product.isActive,
            primaryImage: item.product.images[0]?.url ?? null,
        }));
        return { success: true, data: items, total: items.length };
    }
    async addToWishlist(userId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, name: true, isActive: true },
        });
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
        let wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({ data: { userId } });
        }
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
    async removeFromWishlist(userId, productId) {
        const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
        if (!wishlist)
            throw new common_1.NotFoundException('উইশলিস্ট পাওয়া যায়নি');
        const item = await this.prisma.wishlistItem.findUnique({
            where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
        });
        if (!item)
            throw new common_1.NotFoundException('পণ্যটি উইশলিস্টে নেই');
        await this.prisma.wishlistItem.delete({ where: { id: item.id } });
        return { success: true, message: 'উইশলিস্ট থেকে সরানো হয়েছে' };
    }
    async clearWishlist(userId) {
        const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
        if (!wishlist)
            return { success: true, message: 'উইশলিস্ট খালি' };
        await this.prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } });
        return { success: true, message: 'উইশলিস্ট পরিষ্কার হয়েছে' };
    }
    async isInWishlist(userId, productId) {
        const wishlist = await this.prisma.wishlist.findFirst({ where: { userId } });
        if (!wishlist)
            return { success: true, data: { inWishlist: false } };
        const item = await this.prisma.wishlistItem.findUnique({
            where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
        });
        return { success: true, data: { inWishlist: !!item } };
    }
    async getNotifications(userId, unreadOnly = false) {
        const notifs = await this.prisma.notification.findMany({
            where: { userId, ...(unreadOnly && { isRead: false }) },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return { success: true, data: notifs };
    }
    async markNotificationsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        return { success: true, message: 'সব নোটিফিকেশন পড়া হয়েছে' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map