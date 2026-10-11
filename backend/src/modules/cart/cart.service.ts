import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

const FREE_DELIVERY_THRESHOLD = 1000;
const DEFAULT_DELIVERY_CHARGE = 60;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Get cart with all computed totals ─────────────────
  async getCart(userId: string) {
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

    // Auto-create cart if missing
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

  // ── Add item ──────────────────────────────────────────
  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, isActive: true },
      include: { inventory: true },
    });

    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');
    if (product.stockStatus === 'OUT_OF_STOCK') {
      throw new BadRequestException('পণ্যটি স্টকে নেই');
    }
    if (product.inventory && product.inventory.availableStock < dto.quantity) {
      throw new BadRequestException(
        `শুধুমাত্র ${product.inventory.availableStock} টি পাওয়া যাচ্ছে`,
      );
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId } });

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
    });

    if (existing) {
      const newQty = existing.quantity + dto.quantity;
      if (product.maxOrderQty && newQty > product.maxOrderQty) {
        throw new BadRequestException(`সর্বোচ্চ ${product.maxOrderQty} টি অর্ডার করা যাবে`);
      }
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
      });
    }

    return { success: true, message: 'কার্টে পণ্য যোগ হয়েছে' };
  }

  // ── Update quantity ───────────────────────────────────
  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart পাওয়া যায়নি');

    if (quantity <= 0) return this.removeItem(userId, productId);

    await this.prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId },
      data: { quantity },
    });
    return { success: true, message: 'কার্ট আপডেট হয়েছে' };
  }

  // ── Remove item ───────────────────────────────────────
  async removeItem(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart পাওয়া যায়নি');

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return { success: true, message: 'কার্ট থেকে পণ্য সরানো হয়েছে' };
  }

  // ── Clear ─────────────────────────────────────────────
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true, message: 'Cart ইতিমধ্যে খালি' };
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { success: true, message: 'Cart পরিষ্কার হয়েছে' };
  }

  // ── Get item count only (lightweight) ────────────────
  async getItemCount(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true, data: { count: 0 } };
    const count = await this.prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { quantity: true },
    });
    return { success: true, data: { count: count._sum.quantity ?? 0 } };
  }

  // ── Format helper ─────────────────────────────────────
  private formatCart(cart: any) {
    const items = cart.items ?? [];

    let subtotal = 0;
    let itemDiscount = 0;
    let itemCount = 0;

    const formattedItems = items.map((item: any) => {
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
}
