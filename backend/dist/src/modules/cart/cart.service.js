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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const FREE_DELIVERY_THRESHOLD = 1000;
const DEFAULT_DELIVERY_CHARGE = 60;
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    where: { isPrimary: true },
                                    select: { url: true, altText: true },
                                    take: 1,
                                },
                                inventory: { select: { availableStock: true } },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    images: { where: { isPrimary: true }, take: 1 },
                                    inventory: { select: { availableStock: true } },
                                },
                            },
                        },
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
        }
        return { success: true, data: this.formatCart(cart) };
    }
    async addItem(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId, isActive: true },
            include: { inventory: true },
        });
        if (!product)
            throw new common_1.NotFoundException('পণ্যটি পাওয়া যায়নি');
        if (product.stockStatus === 'OUT_OF_STOCK') {
            throw new common_1.BadRequestException('পণ্যটি স্টকে নেই');
        }
        if (product.inventory && product.inventory.availableStock < dto.quantity) {
            throw new common_1.BadRequestException(`শুধুমাত্র ${product.inventory.availableStock} টি পাওয়া যাচ্ছে`);
        }
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            cart = await this.prisma.cart.create({ data: { userId } });
        const existing = await this.prisma.cartItem.findUnique({
            where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
        });
        if (existing) {
            const newQty = existing.quantity + dto.quantity;
            if (product.maxOrderQty && newQty > product.maxOrderQty) {
                throw new common_1.BadRequestException(`সর্বোচ্চ ${product.maxOrderQty} টি অর্ডার করা যাবে`);
            }
            await this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: newQty },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
            });
        }
        return { success: true, message: 'কার্টে পণ্য যোগ হয়েছে' };
    }
    async updateItem(userId, productId, quantity) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart পাওয়া যায়নি');
        if (quantity <= 0)
            return this.removeItem(userId, productId);
        await this.prisma.cartItem.updateMany({
            where: { cartId: cart.id, productId },
            data: { quantity },
        });
        return { success: true, message: 'কার্ট আপডেট হয়েছে' };
    }
    async removeItem(userId, productId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart পাওয়া যায়নি');
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
        return { success: true, message: 'কার্ট থেকে পণ্য সরানো হয়েছে' };
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            return { success: true, message: 'Cart ইতিমধ্যে খালি' };
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        return { success: true, message: 'Cart পরিষ্কার হয়েছে' };
    }
    async getItemCount(userId) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            return { success: true, data: { count: 0 } };
        const count = await this.prisma.cartItem.aggregate({
            where: { cartId: cart.id },
            _sum: { quantity: true },
        });
        return { success: true, data: { count: count._sum.quantity ?? 0 } };
    }
    formatCart(cart) {
        const items = cart.items ?? [];
        let subtotal = 0;
        let itemDiscount = 0;
        let itemCount = 0;
        const formattedItems = items.map((item) => {
            const p = item.product;
            const originalPrice = Number(p.price);
            const effectivePrice = p.discountPrice ? Number(p.discountPrice) : originalPrice;
            const lineTotal = effectivePrice * item.quantity;
            subtotal += lineTotal;
            itemDiscount += (originalPrice - effectivePrice) * item.quantity;
            itemCount += item.quantity;
            return {
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                product: {
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: originalPrice,
                    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                    discountPercent: p.discountPercent ?? null,
                    weight: p.weight ?? null,
                    stockStatus: p.stockStatus,
                    primaryImage: p.images?.[0]?.url ?? null,
                    availableStock: p.inventory?.availableStock ?? 0,
                },
                unitPrice: effectivePrice,
                lineTotal: parseFloat(lineTotal.toFixed(2)),
            };
        });
        const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_CHARGE;
        const grandTotal = subtotal + deliveryCharge;
        return {
            id: cart.id,
            items: formattedItems,
            itemCount,
            subtotal: parseFloat(subtotal.toFixed(2)),
            itemDiscount: parseFloat(itemDiscount.toFixed(2)),
            deliveryCharge,
            isFreeDelivery: deliveryCharge === 0,
            total: parseFloat(subtotal.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map