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
exports.AdminService = void 0;
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
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(period = '30days', from, to) {
        const { start, end } = getDateRange(period, from, to);
        const dateFilter = { createdAt: { gte: start, lte: end } };
        const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, totalCustomers, newCustomers, totalProducts, activeProducts, outOfStock, lowStock, revenueResult, prevRevenueResult,] = await Promise.all([
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
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: {
                    status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'] },
                    ...dateFilter,
                },
            }),
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
    async getSalesChart(period = '30days', from, to) {
        const { start, end } = getDateRange(period, from, to);
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'PACKED'] },
            },
            select: { createdAt: true, totalAmount: true },
            orderBy: { createdAt: 'asc' },
        });
        const map = {};
        orders.forEach((o) => {
            const d = o.createdAt.toISOString().split('T')[0];
            if (!map[d])
                map[d] = { date: d, revenue: 0, orders: 0 };
            map[d].revenue += Number(o.totalAmount);
            map[d].orders += 1;
        });
        return {
            success: true,
            data: Object.values(map),
        };
    }
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
    async getRecentReviews(limit = 5) {
        const reviews = await this.prisma.review.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, avatar: true } },
                product: { select: { name: true, slug: true } },
            },
        });
        return { success: true, data: reviews };
    }
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
    async adminGetOrders(params) {
        const { page = 1, limit = 20, search, status, paymentStatus, paymentMethod, from, to, sortBy = 'createdAt', sortOrder = 'desc', } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
            const dateFilter = {};
            if (from) {
                const d = new Date(from);
                d.setHours(0, 0, 0, 0);
                dateFilter.gte = d;
            }
            if (to) {
                const d = new Date(to);
                d.setHours(23, 59, 59, 999);
                dateFilter.lte = d;
            }
            where.createdAt = dateFilter;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { phone: { contains: search, mode: 'insensitive' } } },
                { address: { phone: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: where,
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
            this.prisma.order.count({ where: where }),
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
                itemCount: o._count.items,
                user: o.user ?? { id: '', name: 'Guest', email: 'guest', phone: o.address?.phone ?? '', avatar: null },
            })),
            meta: {
                page, limit, total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async adminGetOrder(orderId) {
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
                subtotal: Number(order.subtotal),
                totalAmount: Number(order.totalAmount),
                deliveryCharge: Number(order.deliveryCharge),
                discountAmount: Number(order.discountAmount),
                couponDiscount: Number(order.couponDiscount),
                items: order.items.map((i) => ({
                    ...i,
                    unitPrice: Number(i.unitPrice),
                    discountPrice: i.discountPrice ? Number(i.discountPrice) : null,
                    totalPrice: Number(i.totalPrice),
                })),
            },
        };
    }
    async adminUpdateOrderStatus(orderId, status, note, courierName, trackingNumber) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error('Order not found');
        const updateData = { status };
        if (status === 'CONFIRMED')
            updateData.confirmedAt = new Date();
        if (status === 'PACKED')
            updateData.packedAt = new Date();
        if (status === 'SHIPPED')
            updateData.shippedAt = new Date();
        if (status === 'DELIVERED') {
            updateData.deliveredAt = new Date();
            updateData.paymentStatus = 'PAID';
        }
        if (status === 'CANCELLED') {
            updateData.cancelledAt = new Date();
            updateData.cancelReason = note ?? 'Admin cancelled';
        }
        if (status === 'RETURNED') {
            updateData.returnedAt = new Date();
            updateData.returnReason = note ?? 'Admin returned';
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: updateData,
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: status,
                    note: note ?? '',
                    createdBy: 'ADMIN',
                },
            });
            if (status === 'SHIPPED' || status === 'DELIVERED') {
                const deliveryStatus = status === 'SHIPPED' ? 'IN_TRANSIT' : 'DELIVERED';
                await tx.delivery.updateMany({
                    where: { orderId },
                    data: {
                        status: deliveryStatus,
                        ...(courierName ? { courierName } : {}),
                        ...(trackingNumber ? { trackingNumber } : {}),
                        ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
                    },
                });
            }
            if (status === 'DELIVERED') {
                await tx.payment.updateMany({
                    where: { orderId },
                    data: { paymentStatus: 'PAID', paidAt: new Date(), codStatus: 'COLLECTED' },
                });
            }
            if (status === 'CANCELLED' || status === 'RETURNED') {
                const fullOrder = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { items: { include: { product: { include: { inventory: true } } } } },
                });
                if (fullOrder) {
                    for (const item of fullOrder.items) {
                        if (!item.product?.inventory)
                            continue;
                        const inv = item.product.inventory;
                        await tx.inventory.update({
                            where: { productId: item.productId },
                            data: {
                                availableStock: { increment: item.quantity },
                                soldQuantity: { decrement: item.quantity },
                            },
                        });
                        await tx.inventoryLog.create({
                            data: {
                                inventoryId: inv.id,
                                changeQty: +item.quantity,
                                type: 'ADJUSTMENT',
                                reason: `Order #${order.orderNumber} ${status.toLowerCase()} by admin`,
                                reference: orderId,
                            },
                        });
                    }
                }
            }
        });
        return { success: true, message: `Order status updated to ${status}` };
    }
    async adminBulkUpdateStatus(orderIds, status) {
        await this.prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { status: status },
        });
        const historyEntries = orderIds.map((orderId) => ({
            orderId,
            status: status,
            note: 'Bulk status update by admin',
            createdBy: 'ADMIN',
        }));
        await this.prisma.orderStatusHistory.createMany({ data: historyEntries });
        return { success: true, message: `${orderIds.length} orders updated to ${status}` };
    }
    async adminGetOrderStatusCounts() {
        const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'];
        const counts = await Promise.all(statuses.map((s) => this.prisma.order.count({ where: { status: s } })));
        const result = { ALL: 0 };
        statuses.forEach((s, i) => {
            result[s] = counts[i];
            result.ALL += counts[i];
        });
        return { success: true, data: result };
    }
    async adminRefundOrder(orderId, amount, reason) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error('Order not found');
        if (!['RETURNED', 'CANCELLED'].includes(order.status)) {
            throw new Error('Refunds are only allowed on returned or cancelled orders.');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: 'REFUNDED',
                    note: reason ?? 'Refund processed by admin',
                    createdBy: 'ADMIN',
                },
            });
            await tx.payment.updateMany({
                where: { orderId },
                data: {
                    paymentStatus: 'REFUNDED',
                    ...(amount !== undefined ? { refundAmount: amount } : {}),
                    ...(reason ? { refundReason: reason } : {}),
                },
            });
        });
        return { success: true, message: 'Order refunded successfully.' };
    }
    async adminGetCategories(params) {
        const { page = 1, limit = 50, search, parentId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { nameEn: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (parentId === 'null' || parentId === '') {
            where.parentId = null;
        }
        else if (parentId) {
            where.parentId = parentId;
        }
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
                include: {
                    parent: { select: { id: true, name: true } },
                    _count: { select: { products: true, children: true } },
                },
            }),
            this.prisma.category.count({ where: where }),
        ]);
        return {
            success: true,
            data: categories,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminGetCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: { select: { id: true, name: true } },
                children: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { products: true } },
            },
        });
        if (!category)
            throw new Error('Category not found');
        return { success: true, data: category };
    }
    async adminCreateCategory(dto) {
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                nameEn: dto.nameEn,
                slug: dto.slug,
                description: dto.description,
                image: dto.image,
                icon: dto.icon,
                parentId: dto.parentId || null,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                showInNav: dto.showInNav ?? false,
                navOrder: dto.navOrder ?? 0,
                metaTitle: dto.metaTitle,
                metaDesc: dto.metaDesc,
            },
        });
        return { success: true, message: 'Category created', data: category };
    }
    async adminUpdateCategory(id, dto) {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Category not found');
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.nameEn !== undefined)
            updateData.nameEn = dto.nameEn;
        if (dto.slug !== undefined)
            updateData.slug = dto.slug;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.image !== undefined)
            updateData.image = dto.image;
        if (dto.icon !== undefined)
            updateData.icon = dto.icon;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.sortOrder !== undefined)
            updateData.sortOrder = dto.sortOrder;
        if (dto.showInNav !== undefined)
            updateData.showInNav = dto.showInNav;
        if (dto.navOrder !== undefined)
            updateData.navOrder = dto.navOrder;
        if (dto.metaTitle !== undefined)
            updateData.metaTitle = dto.metaTitle;
        if (dto.metaDesc !== undefined)
            updateData.metaDesc = dto.metaDesc;
        if ('parentId' in dto)
            updateData.parentId = dto.parentId || null;
        const category = await this.prisma.category.update({
            where: { id },
            data: updateData,
        });
        return { success: true, message: 'Category updated', data: category };
    }
    async adminDeleteCategory(id) {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Category not found');
        await this.prisma.category.delete({ where: { id } });
        return { success: true, message: 'Category deleted' };
    }
    async adminReorderCategories(items) {
        await Promise.all(items.map((item) => this.prisma.category.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
        })));
        return { success: true, message: 'Categories reordered' };
    }
    async adminGetBrands(params) {
        const { page = 1, limit = 50, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { nameEn: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [brands, total] = await Promise.all([
            this.prisma.brand.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    _count: { select: { products: true } },
                },
            }),
            this.prisma.brand.count({ where: where }),
        ]);
        return {
            success: true,
            data: brands,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminGetBrand(id) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!brand)
            throw new Error('Brand not found');
        return { success: true, data: brand };
    }
    async adminCreateBrand(dto) {
        const brand = await this.prisma.brand.create({
            data: {
                name: dto.name,
                nameEn: dto.nameEn,
                slug: dto.slug,
                logo: dto.logo,
                description: dto.description,
                website: dto.website,
                isActive: dto.isActive ?? true,
            },
        });
        return { success: true, message: 'Brand created', data: brand };
    }
    async adminUpdateBrand(id, dto) {
        const existing = await this.prisma.brand.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Brand not found');
        const brand = await this.prisma.brand.update({
            where: { id },
            data: dto,
        });
        return { success: true, message: 'Brand updated', data: brand };
    }
    async adminDeleteBrand(id) {
        const existing = await this.prisma.brand.findUnique({ where: { id } });
        if (!existing)
            throw new Error('Brand not found');
        await this.prisma.brand.delete({ where: { id } });
        return { success: true, message: 'Brand deleted' };
    }
    async adminGetVariants(productId) {
        const variants = await this.prisma.productVariant.findMany({
            where: { productId },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
        return {
            success: true,
            data: variants.map((v) => ({
                ...v,
                price: Number(v.price),
                salePrice: v.salePrice ? Number(v.salePrice) : null,
            })),
        };
    }
    async adminCreateVariant(productId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        const variant = await this.prisma.productVariant.create({
            data: {
                productId,
                name: dto.name,
                sku: dto.sku,
                price: dto.price,
                salePrice: dto.salePrice,
                stock: dto.stock ?? 0,
                weight: dto.weight,
                image: dto.image,
                isActive: dto.isActive ?? true,
                sortOrder: dto.sortOrder ?? 0,
                attributes: (dto.attributes ?? {}),
            },
        });
        return {
            success: true,
            message: 'Variant created',
            data: { ...variant, price: Number(variant.price), salePrice: variant.salePrice ? Number(variant.salePrice) : null },
        };
    }
    async adminUpdateVariant(productId, variantId, dto) {
        const existing = await this.prisma.productVariant.findFirst({
            where: { id: variantId, productId },
        });
        if (!existing)
            throw new Error('Variant not found');
        const variant = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: dto,
        });
        return {
            success: true,
            message: 'Variant updated',
            data: { ...variant, price: Number(variant.price), salePrice: variant.salePrice ? Number(variant.salePrice) : null },
        };
    }
    async adminDeleteVariant(productId, variantId) {
        const existing = await this.prisma.productVariant.findFirst({
            where: { id: variantId, productId },
        });
        if (!existing)
            throw new Error('Variant not found');
        await this.prisma.productVariant.delete({ where: { id: variantId } });
        return { success: true, message: 'Variant deleted' };
    }
    async adminGetHeroSlides() {
        try {
            const slides = await this.prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } });
            return { success: true, data: slides };
        }
        catch {
            return { success: true, data: [] };
        }
    }
    async adminCreateHeroSlide(dto) {
        const slide = await this.prisma.heroSlide.create({ data: { ...dto, startDate: dto.startDate ? new Date(dto.startDate) : undefined, endDate: dto.endDate ? new Date(dto.endDate) : undefined } });
        return { success: true, data: slide };
    }
    async adminUpdateHeroSlide(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        const slide = await this.prisma.heroSlide.update({ where: { id }, data: data });
        return { success: true, data: slide };
    }
    async adminDeleteHeroSlide(id) {
        await this.prisma.heroSlide.delete({ where: { id } });
        return { success: true, message: 'Slide deleted' };
    }
    async adminReorderHeroSlides(items) {
        await Promise.all(items.map(({ id, sortOrder }) => this.prisma.heroSlide.update({ where: { id }, data: { sortOrder } })));
        return { success: true };
    }
    async adminGetHomepageSections() {
        try {
            const sections = await this.prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
            return { success: true, data: sections };
        }
        catch {
            return { success: true, data: [] };
        }
    }
    async adminUpsertHomepageSection(key, dto) {
        try {
            const section = await this.prisma.homepageSection.upsert({
                where: { key },
                update: { ...dto, extraData: dto.extraData, updatedAt: new Date() },
                create: { key, ...dto, extraData: dto.extraData, updatedAt: new Date() },
            });
            return { success: true, data: section };
        }
        catch (e) {
            throw new Error(e?.message ?? "Failed");
        }
    }
    async adminReorderHomepageSections(items) {
        await Promise.all(items.map(({ key, sortOrder }) => this.prisma.homepageSection.updateMany({ where: { key }, data: { sortOrder, updatedAt: new Date() } })));
        return { success: true };
    }
    async adminToggleHomepageSection(key, isEnabled) {
        await this.prisma.homepageSection.upsert({
            where: { key },
            update: { isEnabled, updatedAt: new Date() },
            create: { key, isEnabled, updatedAt: new Date() },
        });
        return { success: true };
    }
    async adminGetTestimonials(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, params.limit ?? 20);
        const skip = (page - 1) * limit;
        const where = {};
        if (params.search)
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { comment: { contains: params.search, mode: 'insensitive' } },
            ];
        const [data, total] = await Promise.all([
            this.prisma.testimonial.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
            this.prisma.testimonial.count({ where }),
        ]);
        return { success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async adminCreateTestimonial(dto) {
        const t = await this.prisma.testimonial.create({ data: { ...dto } });
        return { success: true, data: t };
    }
    async adminUpdateTestimonial(id, dto) {
        const t = await this.prisma.testimonial.update({ where: { id }, data: dto });
        return { success: true, data: t };
    }
    async adminDeleteTestimonial(id) {
        await this.prisma.testimonial.delete({ where: { id } });
        return { success: true, message: 'Testimonial deleted' };
    }
    async adminGetCoupons(p) {
        const page = Math.max(1, p.page ?? 1), limit = Math.min(100, p.limit ?? 20);
        const where = {};
        if (p.search)
            where.OR = [{ code: { contains: p.search, mode: 'insensitive' } }, { description: { contains: p.search, mode: 'insensitive' } }];
        if (p.isActive !== undefined)
            where.isActive = p.isActive;
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { _count: { select: { usages: true } } } }),
            this.prisma.coupon.count({ where }),
        ]);
        return { success: true, data: data.map(c => ({ ...c, discountValue: Number(c.discountValue), minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null, maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null, usageCount: c._count.usages })), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async adminCreateCoupon(dto) {
        const c = await this.prisma.coupon.create({ data: { code: dto.code.toUpperCase(), description: dto.description, discountType: dto.discountType, discountValue: dto.discountValue, minOrderAmount: dto.minOrderAmount, maxDiscount: dto.maxDiscount, startDate: new Date(dto.startDate), expiryDate: new Date(dto.expiryDate), usageLimit: dto.usageLimit, userLimit: dto.userLimit ?? 1, isActive: dto.isActive ?? true } });
        return { success: true, data: c };
    }
    async adminUpdateCoupon(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.expiryDate)
            data.expiryDate = new Date(dto.expiryDate);
        if (dto.code)
            data.code = dto.code.toUpperCase();
        const c = await this.prisma.coupon.update({ where: { id }, data });
        return { success: true, data: c };
    }
    async adminDeleteCoupon(id) {
        await this.prisma.coupon.delete({ where: { id } });
        return { success: true, message: 'Coupon deleted' };
    }
    async adminGetCouponUsages(couponId) {
        const usages = await this.prisma.couponUsage.findMany({ where: { couponId }, include: { user: { select: { name: true, email: true, phone: true } } }, orderBy: { usedAt: 'desc' } });
        return { success: true, data: usages };
    }
    async adminGetBanners(p) {
        const page = Math.max(1, p.page ?? 1), limit = Math.min(100, p.limit ?? 20);
        const where = {};
        if (p.position)
            where.position = p.position;
        const [data, total] = await Promise.all([
            this.prisma.banner.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }] }),
            this.prisma.banner.count({ where }),
        ]);
        return { success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async adminCreateBanner(dto) {
        const b = await this.prisma.banner.create({ data: { title: dto.title, titleEn: dto.titleEn, subtitle: dto.subtitle, image: dto.image, link: dto.link, buttonText: dto.buttonText, position: (dto.position ?? 'HERO'), isActive: dto.isActive ?? true, sortOrder: dto.sortOrder ?? 0, startDate: dto.startDate ? new Date(dto.startDate) : undefined, endDate: dto.endDate ? new Date(dto.endDate) : undefined } });
        return { success: true, data: b };
    }
    async adminUpdateBanner(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        const b = await this.prisma.banner.update({ where: { id }, data });
        return { success: true, data: b };
    }
    async adminDeleteBanner(id) {
        await this.prisma.banner.delete({ where: { id } });
        return { success: true, message: 'Banner deleted' };
    }
    async adminGetOffers(p) {
        const page = Math.max(1, p.page ?? 1), limit = Math.min(100, p.limit ?? 20);
        const where = {};
        if (p.search)
            where.name = { contains: p.search, mode: 'insensitive' };
        try {
            const [data, total] = await Promise.all([
                this.prisma.offer.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
                this.prisma.offer.count({ where }),
            ]);
            return { success: true, data: data.map(o => ({ ...o, discountValue: Number(o.discountValue), minOrderAmount: o.minOrderAmount ? Number(o.minOrderAmount) : null, maxDiscount: o.maxDiscount ? Number(o.maxDiscount) : null })), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
        }
        catch {
            return { success: true, data: [], meta: { page, limit, total: 0, totalPages: 0 } };
        }
    }
    async adminCreateOffer(dto) {
        const o = await this.prisma.offer.create({ data: { ...dto, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) } });
        return { success: true, data: o };
    }
    async adminUpdateOffer(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        const o = await this.prisma.offer.update({ where: { id }, data });
        return { success: true, data: o };
    }
    async adminDeleteOffer(id) {
        await this.prisma.offer.delete({ where: { id } });
        return { success: true, message: 'Offer deleted' };
    }
    async adminGetPromotions(p) {
        const page = Math.max(1, p.page ?? 1), limit = Math.min(100, p.limit ?? 20);
        const where = {};
        if (p.search)
            where.name = { contains: p.search, mode: 'insensitive' };
        try {
            const [data, total] = await Promise.all([
                this.prisma.promotion.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
                this.prisma.promotion.count({ where }),
            ]);
            return { success: true, data: data.map(p => ({ ...p, discountValue: Number(p.discountValue) })), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
        }
        catch {
            return { success: true, data: [], meta: { page, limit, total: 0, totalPages: 0 } };
        }
    }
    async adminCreatePromotion(dto) {
        const p2 = await this.prisma.promotion.create({ data: { ...dto, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) } });
        return { success: true, data: p2 };
    }
    async adminUpdatePromotion(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        const p2 = await this.prisma.promotion.update({ where: { id }, data });
        return { success: true, data: p2 };
    }
    async adminDeletePromotion(id) {
        await this.prisma.promotion.delete({ where: { id } });
        return { success: true, message: 'Promotion deleted' };
    }
    async adminGetSubscribers(p) {
        const page = Math.max(1, p.page ?? 1), limit = Math.min(500, p.limit ?? 50);
        const where = {};
        if (p.search)
            where.OR = [{ email: { contains: p.search, mode: 'insensitive' } }, { name: { contains: p.search, mode: 'insensitive' } }];
        if (p.isActive !== undefined)
            where.isActive = p.isActive;
        try {
            const [data, total] = await Promise.all([
                this.prisma.newsletterSubscriber.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { subscribedAt: 'desc' } }),
                this.prisma.newsletterSubscriber.count({ where }),
            ]);
            return { success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
        }
        catch {
            return { success: true, data: [], meta: { page, limit, total: 0, totalPages: 0 } };
        }
    }
    async adminDeleteSubscriber(id) {
        try {
            await this.prisma.newsletterSubscriber.delete({ where: { id } });
        }
        catch { }
        return { success: true, message: 'Subscriber deleted' };
    }
    async adminBulkDeleteSubscribers(ids) {
        try {
            await this.prisma.newsletterSubscriber.deleteMany({ where: { id: { in: ids } } });
        }
        catch { }
        return { success: true, message: `${ids.length} subscribers deleted` };
    }
    async adminExportSubscribers() {
        try {
            const subs = await this.prisma.newsletterSubscriber.findMany({ where: { isActive: true }, orderBy: { subscribedAt: 'asc' } });
            const header = 'Email,Name,Source,Subscribed At';
            const rows = subs.map(s => `${s.email},${s.name ?? ''},${s.source ?? ''},${s.subscribedAt.toISOString()}`);
            return [header, ...rows].join('\n');
        }
        catch {
            return 'Email,Name,Source,Subscribed At';
        }
    }
    async adminGetCustomers(params) {
        const { page = 1, limit = 20, search, isActive, isBlocked, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = { role: 'CUSTOMER' };
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        if (isBlocked !== undefined)
            where.isBlocked = isBlocked === 'true';
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [customers, total] = await Promise.all([
            this.prisma.user.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true, name: true, email: true, phone: true,
                    avatar: true, isActive: true, isBlocked: true,
                    lastLoginAt: true, createdAt: true,
                    _count: { select: { orders: true, reviews: true } },
                    orders: {
                        take: 1, orderBy: { createdAt: 'desc' },
                        select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true },
                    },
                },
            }),
            this.prisma.user.count({ where: where }),
        ]);
        const ids = customers.map((c) => c.id);
        const spending = await this.prisma.order.groupBy({
            by: ['userId'],
            where: { userId: { in: ids }, status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED'] } },
            _sum: { totalAmount: true },
        });
        const spendMap = Object.fromEntries(spending.map((s) => [s.userId, Number(s._sum.totalAmount ?? 0)]));
        return {
            success: true,
            data: customers.map((c) => ({
                ...c,
                totalOrders: c._count.orders,
                totalReviews: c._count.reviews,
                totalSpending: spendMap[c.id] ?? 0,
                lastOrder: c.orders[0] ? { ...c.orders[0], totalAmount: Number(c.orders[0].totalAmount) } : null,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminGetCustomer(userId) {
        const customer = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true, avatar: true,
                gender: true, dateOfBirth: true, isActive: true, isBlocked: true,
                lastLoginAt: true, createdAt: true, updatedAt: true,
                isEmailVerified: true, isPhoneVerified: true,
                addresses: true,
                _count: { select: { orders: true, reviews: true, wishlists: true } },
                orders: {
                    take: 5, orderBy: { createdAt: 'desc' },
                    select: {
                        id: true, orderNumber: true, status: true,
                        totalAmount: true, paymentMethod: true, createdAt: true,
                        _count: { select: { items: true } },
                    },
                },
                reviews: {
                    take: 5, orderBy: { createdAt: 'desc' },
                    select: {
                        id: true, rating: true, title: true, status: true, createdAt: true,
                        product: { select: { id: true, name: true, slug: true } },
                    },
                },
            },
        });
        if (!customer)
            throw new Error('Customer not found');
        const spending = await this.prisma.order.aggregate({
            where: { userId, status: { in: ['DELIVERED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED'] } },
            _sum: { totalAmount: true },
        });
        return {
            success: true,
            data: {
                ...customer,
                totalSpending: Number(spending._sum.totalAmount ?? 0),
                orders: customer.orders.map((o) => ({
                    ...o, totalAmount: Number(o.totalAmount), itemCount: o._count.items,
                })),
            },
        };
    }
    async adminToggleCustomer(userId, action) {
        const update = {};
        if (action === 'activate')
            update.isActive = true;
        if (action === 'deactivate')
            update.isActive = false;
        if (action === 'block')
            update.isBlocked = true;
        if (action === 'unblock')
            update.isBlocked = false;
        await this.prisma.user.update({ where: { id: userId }, data: update });
        return { success: true, message: `Customer ${action}d successfully.` };
    }
    async adminGetReviews(params) {
        const { page = 1, limit = 20, search, status, rating, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (rating)
            where.rating = Number(rating);
        if (search) {
            where.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
                { comment: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: { select: { id: true, name: true, email: true, avatar: true } },
                    product: { select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1, select: { url: true } } } },
                },
            }),
            this.prisma.review.count({ where: where }),
        ]);
        return {
            success: true,
            data: reviews,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminUpdateReviewStatus(reviewId, status, adminNote) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new Error('Review not found');
        await this.prisma.review.update({
            where: { id: reviewId },
            data: { status, ...(adminNote ? { adminNote } : {}) },
        });
        if (status === 'APPROVED' || (review.status === 'APPROVED' && status !== 'APPROVED')) {
            const reviews = await this.prisma.review.findMany({
                where: { productId: review.productId, status: 'APPROVED' },
                select: { rating: true },
            });
            const avg = reviews.length
                ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
                : 0;
            await this.prisma.product.update({
                where: { id: review.productId },
                data: { avgRating: avg },
            }).catch(() => { });
        }
        return { success: true, message: `Review ${status.toLowerCase()}.` };
    }
    async adminDeleteReview(reviewId) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new Error('Review not found');
        await this.prisma.review.delete({ where: { id: reviewId } });
        return { success: true, message: 'Review deleted.' };
    }
    async adminGetInventory(params) {
        const { page = 1, limit = 20, search, stockStatus, categoryId, sortBy = 'updatedAt', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (stockStatus)
            where.stockStatus = stockStatus;
        if (categoryId)
            where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: where,
                skip, take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true, name: true, sku: true, stockStatus: true,
                    category: { select: { name: true } },
                    inventory: {
                        select: {
                            id: true, totalStock: true, availableStock: true,
                            soldQuantity: true, reservedStock: true, lowStockAlert: true,
                            updatedAt: true,
                        },
                    },
                    variants: {
                        where: { isActive: true },
                        select: { id: true, name: true, sku: true, stock: true },
                    },
                    images: { where: { isPrimary: true }, take: 1, select: { url: true } },
                },
            }),
            this.prisma.product.count({ where: where }),
        ]);
        return {
            success: true,
            data: products,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminAdjustStock(productId, dto) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: { product: { select: { name: true, stockStatus: true } } },
        });
        if (!inventory)
            throw new Error('Inventory not found for this product.');
        const newAvailable = inventory.availableStock + dto.adjustment;
        if (newAvailable < 0)
            throw new Error(`Cannot reduce stock below 0. Current: ${inventory.availableStock}`);
        const newTotal = inventory.totalStock + (dto.adjustment > 0 ? dto.adjustment : 0);
        await this.prisma.$transaction(async (tx) => {
            const updated = await tx.inventory.update({
                where: { productId },
                data: {
                    availableStock: newAvailable,
                    totalStock: dto.adjustment > 0 ? { increment: dto.adjustment } : inventory.totalStock,
                },
            });
            let newStatus;
            if (updated.availableStock <= 0)
                newStatus = 'OUT_OF_STOCK';
            else if (updated.availableStock <= updated.lowStockAlert)
                newStatus = 'LOW_STOCK';
            else
                newStatus = 'IN_STOCK';
            await tx.product.update({ where: { id: productId }, data: { stockStatus: newStatus } });
            await tx.inventoryLog.create({
                data: {
                    inventoryId: inventory.id,
                    changeQty: dto.adjustment,
                    type: dto.type,
                    reason: dto.reason ?? `Manual adjustment by admin`,
                    reference: `MANUAL_${Date.now()}`,
                },
            });
        });
        return { success: true, message: `Stock adjusted by ${dto.adjustment > 0 ? '+' : ''}${dto.adjustment}.` };
    }
    async adminGetInventoryLogs(params) {
        const { page = 1, limit = 30, productId, type, from, to } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (type)
            where.type = type;
        if (from || to) {
            const dateFilter = {};
            if (from) {
                const d = new Date(from);
                d.setHours(0, 0, 0, 0);
                dateFilter.gte = d;
            }
            if (to) {
                const d = new Date(to);
                d.setHours(23, 59, 59, 999);
                dateFilter.lte = d;
            }
            where.createdAt = dateFilter;
        }
        if (productId) {
            const inv = await this.prisma.inventory.findUnique({ where: { productId }, select: { id: true } });
            if (inv)
                where.inventoryId = inv.id;
            else
                return { success: true, data: [], meta: { page, limit, total: 0, totalPages: 0 } };
        }
        const [logs, total] = await Promise.all([
            this.prisma.inventoryLog.findMany({
                where: where,
                skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    inventory: {
                        select: {
                            productId: true,
                            product: { select: { id: true, name: true, sku: true } },
                        },
                    },
                },
            }),
            this.prisma.inventoryLog.count({ where: where }),
        ]);
        return {
            success: true,
            data: logs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminGetFullLowStock() {
        const products = await this.prisma.product.findMany({
            where: { stockStatus: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] }, isActive: true },
            orderBy: [{ stockStatus: 'asc' }, { updatedAt: 'desc' }],
            select: {
                id: true, name: true, sku: true, stockStatus: true,
                category: { select: { name: true } },
                inventory: { select: { availableStock: true, lowStockAlert: true, totalStock: true } },
                images: { where: { isPrimary: true }, take: 1, select: { url: true } },
            },
        });
        return { success: true, data: products };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map