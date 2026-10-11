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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
function getDateRange(period, from, to) {
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
const PAID = ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'];
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesReport(period = '30days', from, to) {
        const { start, end } = getDateRange(period, from, to);
        const dF = { createdAt: { gte: start, lte: end } };
        const pF = { status: { in: PAID }, ...dF };
        const span = end.getTime() - start.getTime();
        const prevStart = new Date(start.getTime() - span);
        const prevEnd = new Date(start.getTime() - 1);
        const prevPF = { status: { in: PAID }, createdAt: { gte: prevStart, lte: prevEnd } };
        const [total, paid, rev, prevRev, cancelled, avg, byStatus, byMethod, daily] = await Promise.all([
            this.prisma.order.count({ where: dF }),
            this.prisma.order.count({ where: pF }),
            this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: pF }),
            this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: prevPF }),
            this.prisma.order.count({ where: { status: 'CANCELLED', ...dF } }),
            this.prisma.order.aggregate({ _avg: { totalAmount: true }, where: pF }),
            this.prisma.order.groupBy({ by: ['status'], _count: { _all: true }, _sum: { totalAmount: true }, where: dF }),
            this.prisma.order.groupBy({ by: ['paymentMethod'], _count: { _all: true }, _sum: { totalAmount: true }, where: pF }),
            this.prisma.order.findMany({ where: pF, select: { createdAt: true, totalAmount: true }, orderBy: { createdAt: 'asc' } }),
        ]);
        const dayMap = {};
        for (const o of daily) {
            const d = o.createdAt.toISOString().slice(0, 10);
            if (!dayMap[d])
                dayMap[d] = { date: d, revenue: 0, orders: 0 };
            dayMap[d].revenue += Number(o.totalAmount);
            dayMap[d].orders++;
        }
        const revenue = Number(rev._sum.totalAmount ?? 0);
        const prevRevenue = Number(prevRev._sum.totalAmount ?? 0);
        const change = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
        return {
            success: true,
            data: {
                period: { start, end, label: period },
                summary: { totalOrders: total, paidOrders: paid, cancelled, revenue,
                    prevRevenue, revenueChange: Math.round(change * 10) / 10,
                    avgOrderValue: Math.round(Number(avg._avg.totalAmount ?? 0)) },
                byStatus: byStatus.map(s => ({ status: s.status, count: s._count._all, revenue: Number(s._sum.totalAmount ?? 0) })),
                byPaymentMethod: byMethod.map(p => ({ method: p.paymentMethod, count: p._count._all, total: Number(p._sum.totalAmount ?? 0) })),
                chart: Object.values(dayMap),
            },
        };
    }
    async getOrdersReport(period = '30days', from, to) {
        const { start, end } = getDateRange(period, from, to);
        const dF = { createdAt: { gte: start, lte: end } };
        const [byStatus, byMethod, daily, avgCharge, freeCount] = await Promise.all([
            this.prisma.order.groupBy({ by: ['status'], _count: { _all: true }, _sum: { totalAmount: true }, where: dF }),
            this.prisma.order.groupBy({ by: ['paymentMethod'], _count: { _all: true }, where: dF }),
            this.prisma.order.findMany({ where: dF, select: { createdAt: true, status: true }, orderBy: { createdAt: 'asc' } }),
            this.prisma.order.aggregate({ _avg: { deliveryCharge: true }, where: dF }),
            this.prisma.order.count({ where: { deliveryCharge: 0, ...dF } }),
        ]);
        const dayMap = {};
        for (const o of daily) {
            const d = o.createdAt.toISOString().slice(0, 10);
            if (!dayMap[d])
                dayMap[d] = { date: d, orders: 0 };
            dayMap[d].orders++;
        }
        return {
            success: true,
            data: {
                period: { start, end },
                byStatus: byStatus.map(s => ({ status: s.status, count: s._count._all, revenue: Number(s._sum.totalAmount ?? 0) })),
                byPaymentMethod: byMethod.map(p => ({ method: p.paymentMethod, count: p._count._all })),
                avgDeliveryCharge: Math.round(Number(avgCharge._avg.deliveryCharge ?? 0)),
                freeDeliveryCount: freeCount,
                chart: Object.values(dayMap),
            },
        };
    }
    async getProductsReport(period = '30days', limit = 20) {
        const { start, end } = getDateRange(period);
        const dF = { createdAt: { gte: start, lte: end } };
        const [bestSelling, outOfStock, lowStock] = await Promise.all([
            this.prisma.orderItem.groupBy({
                by: ['productId', 'productName'],
                _sum: { quantity: true, totalPrice: true },
                where: { order: { status: { in: PAID }, ...dF } },
                orderBy: { _sum: { quantity: 'desc' } },
                take: limit,
            }),
            this.prisma.product.findMany({
                where: { stockStatus: 'OUT_OF_STOCK', isActive: true },
                select: { id: true, name: true, sku: true, inventory: { select: { availableStock: true } },
                    images: { where: { isPrimary: true }, take: 1, select: { url: true } } },
                take: 50,
            }),
            this.prisma.product.findMany({
                where: { stockStatus: 'LOW_STOCK', isActive: true },
                select: { id: true, name: true, sku: true, inventory: { select: { availableStock: true, lowStockAlert: true } },
                    images: { where: { isPrimary: true }, take: 1, select: { url: true } } },
                take: 50,
            }),
        ]);
        return {
            success: true,
            data: {
                period: { start, end },
                bestSelling: bestSelling.map(p => ({ productId: p.productId, productName: p.productName, totalQty: p._sum.quantity ?? 0, totalRevenue: Number(p._sum.totalPrice ?? 0) })),
                outOfStock,
                lowStock,
                outOfStockCount: outOfStock.length,
                lowStockCount: lowStock.length,
            },
        };
    }
    async getCustomersReport(period = '30days', from, to) {
        const { start, end } = getDateRange(period, from, to);
        const dF = { createdAt: { gte: start, lte: end } };
        const [total, newC, byDay, topSpenders] = await Promise.all([
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            this.prisma.user.count({ where: { role: 'CUSTOMER', ...dF } }),
            this.prisma.user.findMany({ where: { role: 'CUSTOMER', ...dF }, select: { createdAt: true }, orderBy: { createdAt: 'asc' } }),
            this.prisma.order.groupBy({ by: ['userId'], _sum: { totalAmount: true }, _count: { _all: true },
                where: { status: { in: PAID }, userId: { not: null } },
                orderBy: { _sum: { totalAmount: 'desc' } }, take: 10 }),
        ]);
        const dayMap = {};
        for (const c of byDay) {
            const d = c.createdAt.toISOString().slice(0, 10);
            if (!dayMap[d])
                dayMap[d] = { date: d, signups: 0 };
            dayMap[d].signups++;
        }
        const spenderIds = topSpenders.filter(s => s.userId).map(s => s.userId);
        const users = await this.prisma.user.findMany({ where: { id: { in: spenderIds } }, select: { id: true, name: true, email: true } });
        const uMap = Object.fromEntries(users.map(u => [u.id, u]));
        return {
            success: true,
            data: {
                period: { start, end },
                total, newCustomers: newC,
                chart: Object.values(dayMap),
                topSpenders: topSpenders.map(s => ({
                    userId: s.userId, name: s.userId ? uMap[s.userId]?.name ?? 'Unknown' : 'Guest',
                    email: s.userId ? uMap[s.userId]?.email : null,
                    totalOrders: s._count._all, totalSpent: Number(s._sum.totalAmount ?? 0),
                })),
            },
        };
    }
    async getInventoryReport() {
        const [totalProducts, activeProducts, outOfStock, lowStock, topSold, recentAdj] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }),
            this.prisma.product.count({ where: { stockStatus: 'LOW_STOCK' } }),
            this.prisma.inventory.findMany({ orderBy: { soldQuantity: 'desc' }, take: 10,
                include: { product: { select: { id: true, name: true, sku: true, images: { where: { isPrimary: true }, take: 1, select: { url: true } } } } } }),
            this.prisma.inventoryLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20,
                include: { inventory: { select: { product: { select: { name: true, sku: true } } } } } }),
        ]);
        return {
            success: true,
            data: {
                summary: { totalProducts, activeProducts, outOfStock, lowStock },
                topSold: topSold.map(i => ({ productId: i.productId, productName: i.product.name, sku: i.product.sku, image: i.product.images?.[0]?.url ?? null, soldQty: i.soldQuantity, availableStock: i.availableStock })),
                recentAdjustments: recentAdj.map(l => ({ id: l.id, productName: l.inventory.product.name, sku: l.inventory.product.sku, changeQty: l.changeQty, type: l.type, reason: l.reason, createdAt: l.createdAt })),
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map