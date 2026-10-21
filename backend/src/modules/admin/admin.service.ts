import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// - Date range helpers -
function getDateRange(period: string, from?: string, to?: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (period === 'custom' && from && to) {
    const s = new Date(from);
    s.setHours(0, 0, 0, 0);
    const e = new Date(to);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }

  const start = new Date(now);

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case '7days':
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case '30days':
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // - Main dashboard stats -
  async getDashboardStats(period = '30days', from?: string, to?: string) {
    const { start, end } = getDateRange(period, from, to);
    const dateFilter = { createdAt: { gte: start, lte: end } };

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      newCustomers,
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      revenueResult,
      prevRevenueResult,
    ] = await Promise.all([
      this.prisma.order.count({ where: { ...dateFilter } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { status: 'SHIPPED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED', ...dateFilter } }),
      this.prisma.order.count({ where: { status: 'CANCELLED', ...dateFilter } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', ...dateFilter } }),
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }),
      this.prisma.product.count({ where: { stockStatus: 'LOW_STOCK' } }),
      // Revenue: sum of totalAmount for DELIVERED/CONFIRMED orders in period
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'] },
          ...dateFilter,
        },
      }),
      // Previous period revenue for comparison
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'] },
          createdAt: {
            gte: new Date(start.getTime() - (end.getTime() - start.getTime())),
            lte: new Date(start.getTime() - 1),
          },
        },
      }),
    ]);

    const revenue = Number(revenueResult._sum.totalAmount ?? 0);
    const prevRevenue = Number(prevRevenueResult._sum.totalAmount ?? 0);
    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      success: true,
      data: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        customers: {
          total: totalCustomers,
          new: newCustomers,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock,
          lowStock,
        },
        revenue: {
          total: revenue,
          change: Math.round(revenueChange * 10) / 10,
          positive: revenueChange >= 0,
        },
        period: { start, end, label: period },
      },
    };
  }

  // - Sales chart (daily breakdown) -
  async getSalesChart(period = '30days', from?: string, to?: string) {
    const { start, end } = getDateRange(period, from, to);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'] },
      },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const map: Record<string, { date: string; revenue: number; orders: number }> = {};
    orders.forEach((o) => {
      const d = o.createdAt.toISOString().split('T')[0];
      if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0 };
      map[d].revenue += Number(o.totalAmount);
      map[d].orders += 1;
    });

    return {
      success: true,
      data: Object.values(map),
    };
  }

  // - Recent orders -
  async getRecentOrders(limit = 10) {
    const orders = await this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          take: 3,
          include: {
            product: {
              select: { name: true, images: { where: { isPrimary: true }, select: { url: true }, take: 1 } },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        totalAmount: Number(o.totalAmount),
        itemCount: o.items.length,
        createdAt: o.createdAt,
        customer: o.user,
        items: o.items.map((i) => ({
          name: i.product.name,
          image: i.product.images[0]?.url ?? null,
          quantity: i.quantity,
        })),
      })),
    };
  }

  // - Top products -
  async getTopProducts(period = '30days', limit = 5) {
    const { start, end } = getDateRange(period);

    const items = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] },
        },
      },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });

    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true, name: true, price: true, stockStatus: true,
        images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
        inventory: { select: { availableStock: true } },
      },
    });

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    return {
      success: true,
      data: items.map((i) => ({
        productId: i.productId,
        product: productMap[i.productId],
        totalSold: i._sum.quantity ?? 0,
        totalRevenue: Number(i._sum.totalPrice ?? 0),
      })).filter((i) => i.product),
    };
  }

  // - Recent customers -
  async getRecentCustomers(limit = 6) {
    const customers = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, phone: true,
        createdAt: true, isActive: true, isBlocked: true,
        _count: { select: { orders: true } },
      },
    });

    return { success: true, data: customers };
  }

  // - Recent reviews -
  async getRecentReviews(limit = 5) {
    const reviews = await this.prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user:    { select: { name: true, avatar: true } },
        product: { select: { name: true, slug: true } },
      },
    });

    return { success: true, data: reviews };
  }

  // - Low stock products -
  async getLowStockProducts(limit = 8) {
    const products = await this.prisma.product.findMany({
      where: { stockStatus: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] }, isActive: true },
      take: limit,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, name: true, sku: true, stockStatus: true,
        images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
        inventory: { select: { availableStock: true, lowStockAlert: true } },
      },
    });

    return { success: true, data: products };
  }


  // -
  // ADMIN ORDER MANAGEMENT
  // -

  // - List all orders with filters -
  async adminGetOrders(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1, limit = 20,
      search, status, paymentStatus, paymentMethod,
      from, to,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }
    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) { const d = new Date(from); d.setHours(0,0,0,0); dateFilter.gte = d; }
      if (to)   { const d = new Date(to);   d.setHours(23,59,59,999); dateFilter.lte = d; }
      where.createdAt = dateFilter;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name:  { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
        { address: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
          address: { select: { fullName: true, phone: true, district: true, division: true, area: true, fullAddress: true } },
          items: {
            take: 3,
            select: {
              productName: true, productImage: true, quantity: true, unitPrice: true, totalPrice: true,
            },
          },
          payment: { select: { paymentStatus: true, paymentMethod: true, codStatus: true, paidAt: true, transactionId: true } },
          delivery: { select: { status: true, courierName: true, trackingNumber: true, estimatedDate: true, deliveredAt: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.order.count({ where: where as any }),
    ]);

    return {
      success: true,
      data: orders.map((o) => ({
        ...o,
        subtotal:       Number(o.subtotal),
        totalAmount:    Number(o.totalAmount),
        deliveryCharge: Number(o.deliveryCharge),
        discountAmount: Number(o.discountAmount),
        couponDiscount: Number(o.couponDiscount),
        itemCount: o._count.items,
      })),
      meta: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // - Get single order detail (admin) -
  async adminGetOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        address: true,
        items: {
          select: {
            id: true, productId: true, productName: true, productImage: true,
            productSku: true, quantity: true, unitPrice: true, discountPrice: true, totalPrice: true,
          },
        },
        payment: true,
        delivery: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        coupon: { select: { code: true, discountType: true, discountValue: true } },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      success: true,
      data: {
        ...order,
        subtotal:       Number(order.subtotal),
        totalAmount:    Number(order.totalAmount),
        deliveryCharge: Number(order.deliveryCharge),
        discountAmount: Number(order.discountAmount),
        couponDiscount: Number(order.couponDiscount),
        items: order.items.map((i) => ({
          ...i,
          unitPrice:     Number(i.unitPrice),
          discountPrice: i.discountPrice ? Number(i.discountPrice) : null,
          totalPrice:    Number(i.totalPrice),
        })),
      },
    };
  }

  // - Update order status (admin) -
  async adminUpdateOrderStatus(
    orderId: string,
    status: string,
    note?: string,
    courierName?: string,
    trackingNumber?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const updateData: Record<string, unknown> = { status };

    // Set timestamp fields based on new status
    if (status === 'CONFIRMED')  updateData.confirmedAt = new Date();
    if (status === 'PACKED')     updateData.packedAt    = new Date();
    if (status === 'SHIPPED')    updateData.shippedAt   = new Date();
    if (status === 'DELIVERED') {
      updateData.deliveredAt   = new Date();
      updateData.paymentStatus = 'PAID';
    }
    if (status === 'CANCELLED') {
      updateData.cancelledAt   = new Date();
      updateData.cancelReason  = note ?? 'Admin cancelled';
    }
    if (status === 'RETURNED') {
      updateData.returnedAt   = new Date();
      updateData.returnReason = note ?? 'Admin returned';
    }

    await this.prisma.$transaction(async (tx) => {
      // Update order
      await tx.order.update({
        where: { id: orderId },
        data: updateData as any,
      });

      // Status history
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: status as any,
          note:   note ?? '',
          createdBy: 'ADMIN',
        },
      });

      // Update delivery record
      if (status === 'SHIPPED' || status === 'DELIVERED') {
        const deliveryStatus = status === 'SHIPPED' ? 'IN_TRANSIT' : 'DELIVERED';
        await tx.delivery.updateMany({
          where: { orderId },
          data: {
            status: deliveryStatus as any,
            ...(courierName    ? { courierName }    : {}),
            ...(trackingNumber ? { trackingNumber } : {}),
            ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
          },
        });
      }

      // Update payment if delivered
      if (status === 'DELIVERED') {
        await tx.payment.updateMany({
          where: { orderId },
          data: { paymentStatus: 'PAID', paidAt: new Date(), codStatus: 'COLLECTED' },
        });
      }

      // Restore stock on cancel/return
      if (status === 'CANCELLED' || status === 'RETURNED') {
        const fullOrder = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: { include: { product: { include: { inventory: true } } } } },
        });
        if (fullOrder) {
          for (const item of fullOrder.items) {
            if (!item.product?.inventory) continue;
            const inv = item.product.inventory;
            await tx.inventory.update({
              where: { productId: item.productId },
              data: {
                availableStock: { increment: item.quantity },
                soldQuantity:   { decrement: item.quantity },
              },
            });
            await tx.inventoryLog.create({
              data: {
                inventoryId: inv.id,
                changeQty:   +item.quantity,
                type:        'ADJUSTMENT',
                reason:      `Order #${order.orderNumber} ${status.toLowerCase()} by admin`,
                reference:   orderId,
              },
            });
          }
        }
      }
    });

    return { success: true, message: `Order status updated to ${status}` };
  }

  // - Bulk update order status -
  async adminBulkUpdateStatus(orderIds: string[], status: string) {
    await this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: status as any },
    });

    const historyEntries = orderIds.map((orderId) => ({
      orderId,
      status: status as any,
      note: 'Bulk status update by admin',
      createdBy: 'ADMIN',
    }));
    await this.prisma.orderStatusHistory.createMany({ data: historyEntries });

    return { success: true, message: `${orderIds.length} orders updated to ${status}` };
  }

  // - Order stats by status -
  async adminGetOrderStatusCounts() {
    const statuses = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','DELIVERED','CANCELLED','RETURNED','REFUNDED'];
    const counts = await Promise.all(
      statuses.map((s) => this.prisma.order.count({ where: { status: s as any } })),
    );
    const result: Record<string, number> = { ALL: 0 };
    statuses.forEach((s, i) => {
      result[s] = counts[i];
      result.ALL += counts[i];
    });
    return { success: true, data: result };
  }
}
