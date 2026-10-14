import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto, SupportedPaymentMethod } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';

// COD payment methods — don't need gateway redirect
const COD_METHODS = new Set([SupportedPaymentMethod.CASH_ON_DELIVERY]);

// Online methods — need SSLCommerz gateway
const ONLINE_METHODS = new Set([
  SupportedPaymentMethod.SSLCOMMERZ,
  SupportedPaymentMethod.BKASH,
  SupportedPaymentMethod.NAGAD,
  SupportedPaymentMethod.ROCKET,
  SupportedPaymentMethod.VISA,
  SupportedPaymentMethod.MASTERCARD,
  SupportedPaymentMethod.AMEX,
  SupportedPaymentMethod.DEBIT_CARD,
  SupportedPaymentMethod.CREDIT_CARD,
  SupportedPaymentMethod.INTERNET_BANKING,
  SupportedPaymentMethod.BANK_TRANSFER,
]);

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

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

    // Determine payment method and whether online gateway is needed
    const method   = dto.paymentMethod ?? SupportedPaymentMethod.CASH_ON_DELIVERY;
    const isOnline = ONLINE_METHODS.has(method);

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
          paymentMethod:  method as any,
          paymentStatus:  isOnline ? 'PROCESSING' : 'PENDING',
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

      // Create payment record (COD = PENDING, Online = PROCESSING)
      await tx.payment.create({
        data: {
          orderId:       newOrder.id,
          amount:        totalAmount,
          paymentMethod: method as any,
          paymentStatus: isOnline ? 'PROCESSING' : 'PENDING',
          codStatus:     !isOnline ? 'PENDING' : undefined,
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

    // ── 7. Fetch full order for response ─────────────────
    const fullOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items:   true,
        address: true,
        payment: { select: { id: true, paymentMethod: true, paymentStatus: true, codStatus: true } },
        delivery: { select: { status: true, estimatedDate: true } },
      },
    });

    // ── For online payments — initiate gateway ────────
    if (isOnline) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const gatewayResult = await this.paymentsService.initiateSSLCommerzPayment(userId, {
        orderId:         order.id,
        paymentMethod:   method as any,
        customerName:    user?.name,
        customerEmail:   user?.email,
        customerPhone:   user?.phone,
        customerAddress: dto.deliveryAddress.fullAddress,
      });

      return {
        success:       true,
        requiresGateway: true,
        message:       'পেমেন্ট গেটওয়েতে রিডাইরেক্ট করুন',
        gatewayUrl:    gatewayResult.gatewayUrl,
        transactionId: gatewayResult.transactionId,
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

    // ── 8. COD — return order summary ────────────────────
    return {
      success: true,
      requiresGateway: false,
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
        payment:       { select: { id: true, paymentMethod: true, paymentStatus: true, codStatus: true, paidAt: true, transactionId: true, amount: true } },
        delivery:      true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('অর্ডারটি পাওয়া যায়নি');
    return {
      success: true,
      data: this.serializeOrder(order),
    };
  }

  // ── Cancel order (customer) ───────────────────────────
  async cancelOrder(userId: string, orderId: string, reason?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: { include: { inventory: true } } } } },
    });

    if (!order) throw new NotFoundException('অর্ডারটি পাওয়া যায়নি');

    // Only PENDING orders can be cancelled by customer
    const cancellableStatuses = ['PENDING'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `"${order.status}" অবস্থায় অর্ডার বাতিল করা যাবে না। শুধুমাত্র অপেক্ষারত অর্ডার বাতিল করা যায়।`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // Cancel the order
      await tx.order.update({
        where: { id: orderId },
        data: {
          status:      'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason ?? 'গ্রাহক কর্তৃক বাতিল',
          paymentStatus: order.paymentStatus === 'PENDING' ? 'CANCELLED' : order.paymentStatus,
        },
      });

      // Add to status history
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status:    'CANCELLED',
          note:      reason ?? 'গ্রাহক কর্তৃক বাতিল',
          createdBy: 'CUSTOMER',
        },
      });

      // Cancel delivery record
      await tx.delivery.updateMany({
        where: { orderId },
        data:  { status: 'RETURNED' },
      });

      // Restore stock for all items
      for (const item of order.items) {
        if (!item.product.inventory) continue;
        const inv = item.product.inventory;
        const newAvailable = inv.availableStock + item.quantity;

        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            availableStock: newAvailable,
            soldQuantity:   Math.max(0, inv.soldQuantity - item.quantity),
          },
        });

        await tx.inventoryLog.create({
          data: {
            inventoryId: inv.id,
            changeQty:   +item.quantity,
            type:        'ADJUSTMENT',
            reason:      `Order #${order.orderNumber} cancelled`,
            reference:   orderId,
          },
        });

        // Restore stock status
        if (item.product.stockStatus === 'OUT_OF_STOCK' && newAvailable > 0) {
          await tx.product.update({
            where: { id: item.productId },
            data:  { stockStatus: newAvailable <= 10 ? 'LOW_STOCK' : 'IN_STOCK' },
          });
        }
      }

      // Cancel payment if pending
      await tx.payment.updateMany({
        where: { orderId, paymentStatus: { in: ['PENDING', 'PROCESSING'] } },
        data:  { paymentStatus: 'CANCELLED' },
      });
    });

    return {
      success: true,
      message: 'অর্ডার সফলভাবে বাতিল করা হয়েছে',
    };
  }

  // ── Track order by order number (public) ─────────────
  async trackOrderByNumber(orderNumber: string, phone?: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase() },
      include: {
        items:    { select: { productName: true, productImage: true, quantity: true, totalPrice: true } },
        address:  { select: { fullName: true, phone: true, division: true, district: true, area: true, fullAddress: true } },
        delivery: { select: { status: true, courierName: true, trackingNumber: true, estimatedDate: true, deliveredAt: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
        payment:  { select: { paymentMethod: true, paymentStatus: true, paidAt: true } },
      },
    });

    if (!order) throw new NotFoundException('অর্ডার নম্বরটি পাওয়া যায়নি। সঠিক অর্ডার নম্বর দিন।');

    // Optional phone verification for security
    if (phone) {
      const normalizedPhone = phone.replace(/\D/g, '').slice(-11);
      const orderPhone = order.address.phone.replace(/\D/g, '').slice(-11);
      if (normalizedPhone !== orderPhone) {
        throw new BadRequestException('ফোন নম্বর মেলেনি। সঠিক ফোন নম্বর দিন।');
      }
    }

    return {
      success: true,
      data: {
        orderNumber:      order.orderNumber,
        status:           order.status,
        paymentStatus:    order.paymentStatus,
        paymentMethod:    order.paymentMethod,
        totalAmount:      Number(order.totalAmount),
        deliveryCharge:   Number(order.deliveryCharge),
        estimatedDelivery: order.estimatedDelivery,
        createdAt:        order.createdAt,
        cancelReason:     order.cancelReason,
        items:            order.items.map(i => ({
          ...i,
          totalPrice: Number(i.totalPrice),
        })),
        delivery:      order.delivery,
        statusHistory: order.statusHistory,
        payment:       order.payment,
        // Partial address for privacy
        address: {
          fullName:  order.address.fullName,
          phone:     `${order.address.phone.slice(0, 5)}****${order.address.phone.slice(-2)}`,
          division:  order.address.division,
          district:  order.address.district,
          area:      order.address.area,
          fullAddress: order.address.fullAddress,
        },
      },
    };
  }

  // ── Calculate delivery charge by district ─────────────
  async calculateDeliveryCharge(district: string, orderAmount: number) {
    // Try to find district-specific charge
    const charge = await this.prisma.deliveryCharge.findFirst({
      where: {
        isActive: true,
        district: { equals: district, mode: 'insensitive' },
      },
    });

    let chargeAmount: number;
    let isFree = false;

    if (charge) {
      chargeAmount = Number(charge.charge);
      if (charge.minOrderFree && orderAmount >= Number(charge.minOrderFree)) {
        chargeAmount = 0;
        isFree = true;
      }
    } else {
      // Default rule: free over ৳1000, else ৳60
      chargeAmount = orderAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_CHARGE;
      isFree = chargeAmount === 0;
    }

    return {
      success: true,
      data: {
        district,
        charge: chargeAmount,
        isFree,
        freeDeliveryThreshold: charge?.minOrderFree
          ? Number(charge.minOrderFree)
          : FREE_DELIVERY_THRESHOLD,
      },
    };
  }

  // ── List delivery charges ─────────────────────────────
  async getDeliveryCharges() {
    const charges = await this.prisma.deliveryCharge.findMany({
      where: { isActive: true },
      orderBy: [{ division: 'asc' }, { charge: 'asc' }],
    });
    return { success: true, data: charges };
  }

  // ── Private: serialize order Decimal fields ───────────
  private serializeOrder(order: any) {
    return {
      ...order,
      subtotal:       Number(order.subtotal),
      totalAmount:    Number(order.totalAmount),
      deliveryCharge: Number(order.deliveryCharge),
      discountAmount: Number(order.discountAmount),
      couponDiscount: Number(order.couponDiscount),
    };
  }
}
