import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

// ── Constants (must match frontend cart.store.ts) ──────────
const FREE_DELIVERY_THRESHOLD = 1000;
const DEFAULT_DELIVERY_CHARGE = 60;

// ── Unique order number ────────────────────────────────────
function generateOrderNumber(): string {
  const date = new Date();
  const yy   = date.getFullYear().toString().slice(-2);
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const dd   = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DMR${yy}${mm}${dd}${rand}`;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Place COD Order (main entry point) ─────────────────
  async placeOrder(userId: string, dto: CreateOrderDto) {

    // ── 1. Load user's cart ──────────────────────────────
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('কার্ট খালি আছে। পণ্য যোগ করুন।');
    }

    // ── 2. Validate stock for every item ─────────────────
    for (const item of cart.items) {
      const { product } = item;
      if (!product.isActive) {
        throw new BadRequestException(`"${product.name}" পণ্যটি এখন পাওয়া যাচ্ছে না।`);
      }
      if (product.stockStatus === 'OUT_OF_STOCK') {
        throw new BadRequestException(`"${product.name}" পণ্যের স্টক শেষ।`);
      }
      const available = product.inventory?.availableStock ?? 0;
      if (available < item.quantity) {
        throw new BadRequestException(
          `"${product.name}" পণ্যে মাত্র ${available} টি পাওয়া যাচ্ছে।`,
        );
      }
    }

    // ── 3. Compute totals ─────────────────────────────────
    let subtotal    = 0;
    let itemDiscount = 0;

    for (const item of cart.items) {
      const p           = item.product;
      const origPrice   = Number(p.price);
      const effPrice    = p.discountPrice ? Number(p.discountPrice) : origPrice;
      subtotal     += effPrice   * item.quantity;
      itemDiscount += (origPrice - effPrice) * item.quantity;
    }

    // ── 4. Apply coupon if provided ───────────────────────
    let couponDiscount = 0;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && new Date() <= coupon.expiryDate) {
        if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
          if (coupon.discountType === 'PERCENTAGE') {
            couponDiscount = (subtotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, Number(coupon.maxDiscount));
          } else if (coupon.discountType === 'FIXED_AMOUNT') {
            couponDiscount = Math.min(Number(coupon.discountValue), subtotal);
          } else if (coupon.discountType === 'FREE_DELIVERY') {
            couponDiscount = DEFAULT_DELIVERY_CHARGE;
          }
          couponId = coupon.id;
        }
      }
    }

    const afterCoupon    = subtotal - couponDiscount;
    const isFreeDelivery = dto.couponCode
      ? (await this.prisma.coupon.findUnique({ where: { code: dto.couponCode.toUpperCase() } }))?.discountType === 'FREE_DELIVERY'
      : false;
    const deliveryCharge =
      (afterCoupon >= FREE_DELIVERY_THRESHOLD || isFreeDelivery) ? 0 : DEFAULT_DELIVERY_CHARGE;
    const totalAmount = afterCoupon + deliveryCharge;

    // ── 5. Create or reuse delivery address ───────────────
    let addressId: string;

    if (dto.deliveryAddress.saveAddress) {
      // Unset other defaults first
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
      const addr = await this.prisma.address.create({
        data: {
          userId,
          fullName:    dto.deliveryAddress.fullName,
          phone:       dto.deliveryAddress.phone,
          division:    dto.deliveryAddress.division,
          district:    dto.deliveryAddress.district,
          area:        dto.deliveryAddress.area,
          fullAddress: dto.deliveryAddress.fullAddress,
          postalCode:  dto.deliveryAddress.postalCode,
          isDefault:   true,
        },
      });
      addressId = addr.id;
    } else {
      // Create a temporary address (not saved to user's address book)
      const addr = await this.prisma.address.create({
        data: {
          userId,
          fullName:    dto.deliveryAddress.fullName,
          phone:       dto.deliveryAddress.phone,
          division:    dto.deliveryAddress.division,
          district:    dto.deliveryAddress.district,
          area:        dto.deliveryAddress.area,
          fullAddress: dto.deliveryAddress.fullAddress,
          postalCode:  dto.deliveryAddress.postalCode,
          isDefault:   false,
        },
      });
      addressId = addr.id;
    }

    // ── 6. Create Order (transaction) ────────────────────
    const order = await this.prisma.$transaction(async (tx) => {

      // Generate unique order number (retry on collision)
      let orderNumber = generateOrderNumber();
      let attempt = 0;
      while (attempt < 5) {
        const exists = await tx.order.findUnique({ where: { orderNumber } });
        if (!exists) break;
        orderNumber = generateOrderNumber();
        attempt++;
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          couponId,
          status:         'PENDING',
          subtotal,
          discountAmount: itemDiscount,
          couponDiscount,
          deliveryCharge,
          totalAmount,
          paymentMethod:  'CASH_ON_DELIVERY',
          paymentStatus:  'PENDING',
          deliveryNote:   dto.deliveryNote,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
          items: {
            create: cart.items.map((item) => {
              const p         = item.product;
              const origPrice = Number(p.price);
              const effPrice  = p.discountPrice ? Number(p.discountPrice) : origPrice;
              return {
                productId:    p.id,
                productName:  p.name,
                productSku:   p.sku,
                productImage: p.images?.[0]?.url ?? null,
                quantity:     item.quantity,
                unitPrice:    effPrice,
                discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                totalPrice:   effPrice * item.quantity,
              };
            }),
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Create initial status history
      await tx.orderStatusHistory.create({
        data: {
          orderId:   newOrder.id,
          status:    'PENDING',
          note:      'অর্ডার সফলভাবে প্রদান করা হয়েছে',
          createdBy: 'CUSTOMER',
        },
      });

      // Create COD payment record
      await tx.payment.create({
        data: {
          orderId:       newOrder.id,
          amount:        totalAmount,
          paymentMethod: 'CASH_ON_DELIVERY',
          paymentStatus: 'PENDING',
          codStatus:     'PENDING',
        },
      });

      // Create delivery record
      await tx.delivery.create({
        data: {
          orderId:       newOrder.id,
          status:        'PENDING',
          deliveryCharge,
          estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      });

      // Update stock: availableStock - qty, soldQuantity + qty
      for (const item of cart.items) {
        if (!item.product.inventory) continue;

        const inv = item.product.inventory;
        const newAvailable = Math.max(0, inv.availableStock - item.quantity);
        const newSold      = inv.soldQuantity + item.quantity;

        await tx.inventory.update({
          where: { productId: item.product.id },
          data: {
            availableStock: newAvailable,
            soldQuantity:   newSold,
          },
        });

        // Inventory log
        await tx.inventoryLog.create({
          data: {
            inventoryId: inv.id,
            changeQty:   -item.quantity,
            type:        'SALE',
            reason:      `Order #${orderNumber}`,
            reference:   newOrder.id,
          },
        });

        // Update stockStatus if needed
        if (newAvailable === 0) {
          await tx.product.update({
            where: { id: item.product.id },
            data:  { stockStatus: 'OUT_OF_STOCK' },
          });
        } else if (newAvailable <= 10) {
          await tx.product.update({
            where: { id: item.product.id },
            data:  { stockStatus: 'LOW_STOCK' },
          });
        }
      }

      // Increment coupon usage count
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.upsert({
          where:  { couponId_userId: { couponId, userId } },
          update: { usedAt: new Date() },
          create: { couponId, userId, orderId: newOrder.id },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // ── 7. Return order summary ───────────────────────────
    const fullOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items:   true,
        address: true,
        payment: { select: { id: true, paymentMethod: true, paymentStatus: true, codStatus: true } },
        delivery: { select: { status: true, estimatedDate: true } },
      },
    });

    return {
      success: true,
      message: 'অর্ডার সফলভাবে প্রদান করা হয়েছে!',
      data: {
        ...fullOrder,
        subtotal:      Number(fullOrder!.subtotal),
        totalAmount:   Number(fullOrder!.totalAmount),
        deliveryCharge: Number(fullOrder!.deliveryCharge),
        discountAmount: Number(fullOrder!.discountAmount),
        couponDiscount: Number(fullOrder!.couponDiscount),
      },
    };
  }

  // ── Get single order (customer) ───────────────────────
  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items:         true,
        address:       true,
        payment:       true,
        delivery:      true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('অর্ডারটি পাওয়া যায়নি');
    return {
      success: true,
      data: {
        ...order,
        subtotal:      Number(order.subtotal),
        totalAmount:   Number(order.totalAmount),
        deliveryCharge: Number(order.deliveryCharge),
        discountAmount: Number(order.discountAmount),
        couponDiscount: Number(order.couponDiscount),
      },
    };
  }

  // ── List delivery charges ─────────────────────────────
  async getDeliveryCharges() {
    const charges = await this.prisma.deliveryCharge.findMany({
      where: { isActive: true },
      orderBy: { charge: 'asc' },
    });
    return { success: true, data: charges };
  }
}
