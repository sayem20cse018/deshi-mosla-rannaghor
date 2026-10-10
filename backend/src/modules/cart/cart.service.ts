import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
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
        },
      },
    });

    if (!cart) {
      const newCart = await this.prisma.cart.create({ where: { userId }, data: { userId } } as any);
      return { success: true, data: { ...newCart, items: [], itemCount: 0, total: 0 } };
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    return { success: true, data: { ...cart, itemCount, total: parseFloat(total.toFixed(2)) } };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, isActive: true },
      include: { inventory: true },
    });

    if (!product) throw new NotFoundException('পণ্যটি পাওয়া যায়নি');
    if (product.stockStatus === 'OUT_OF_STOCK') throw new BadRequestException('পণ্যটি স্টকে নেই');
    if (product.inventory && product.inventory.availableStock < dto.quantity) {
      throw new BadRequestException(`শুধুমাত্র ${product.inventory.availableStock} টি পাওয়া যাচ্ছে`);
    }

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId } });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (product.maxOrderQty && newQty > product.maxOrderQty) {
        throw new BadRequestException(`সর্বোচ্চ ${product.maxOrderQty} টি অর্ডার করা যাবে`);
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
      });
    }

    return { success: true, message: 'কার্টে পণ্য যোগ হয়েছে' };
  }

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

  async removeItem(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart পাওয়া যায়নি');

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return { success: true, message: 'কার্ট থেকে পণ্য সরানো হয়েছে' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: true, message: 'Cart ইতিমধ্যে খালি' };
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { success: true, message: 'Cart পরিষ্কার হয়েছে' };
  }
}
