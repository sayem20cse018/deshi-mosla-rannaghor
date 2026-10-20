import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// ── Date range helpers ────────────────────────────────────────────────────
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

  // ── Main dashboard stats ─────────────────────────────────────────────────
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

  // ── Sales chart (daily breakdown) ────────────────────────────────────────
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

  // ── Recent orders ─────────────────────────────────────────────────────────
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

  // ── Top products ──────────────────────────────────────────────────────────
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

  // ── Recent customers ─────────────────────────────────────────────────────
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

  // ── Recent reviews ────────────────────────────────────────────────────────
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

  // ── Low stock products ────────────────────────────────────────────────────
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
}
