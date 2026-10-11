import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSales(period?: string, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start: Date;
                end: Date;
                label: string;
            };
            summary: {
                totalOrders: number;
                paidOrders: number;
                cancelled: number;
                revenue: number;
                prevRevenue: number;
                revenueChange: number;
                avgOrderValue: number;
            };
            byStatus: {
                status: import(".prisma/client").$Enums.OrderStatus;
                count: number;
                revenue: number;
            }[];
            byPaymentMethod: {
                method: import(".prisma/client").$Enums.PaymentMethod;
                count: number;
                total: number;
            }[];
            chart: {
                date: string;
                revenue: number;
                orders: number;
            }[];
        };
    }>;
    getOrders(period?: string, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start: Date;
                end: Date;
            };
            byStatus: {
                status: import(".prisma/client").$Enums.OrderStatus;
                count: number;
                revenue: number;
            }[];
            byPaymentMethod: {
                method: import(".prisma/client").$Enums.PaymentMethod;
                count: number;
            }[];
            avgDeliveryCharge: number;
            freeDeliveryCount: number;
            chart: {
                date: string;
                orders: number;
            }[];
        };
    }>;
    getProducts(period?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start: Date;
                end: Date;
            };
            bestSelling: {
                productId: string;
                productName: string;
                totalQty: number;
                totalRevenue: number;
            }[];
            outOfStock: {
                inventory: {
                    availableStock: number;
                } | null;
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                sku: string;
            }[];
            lowStock: {
                inventory: {
                    availableStock: number;
                    lowStockAlert: number;
                } | null;
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                sku: string;
            }[];
            outOfStockCount: number;
            lowStockCount: number;
        };
    }>;
    getCustomers(period?: string, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start: Date;
                end: Date;
            };
            total: number;
            newCustomers: number;
            chart: {
                date: string;
                signups: number;
            }[];
            topSpenders: {
                userId: string | null;
                name: string;
                email: string | null;
                totalOrders: number;
                totalSpent: number;
            }[];
        };
    }>;
    getInventory(): Promise<{
        success: boolean;
        data: {
            summary: {
                totalProducts: number;
                activeProducts: number;
                outOfStock: number;
                lowStock: number;
            };
            topSold: {
                productId: string;
                productName: string;
                sku: string;
                image: string;
                soldQty: number;
                availableStock: number;
            }[];
            recentAdjustments: {
                id: string;
                productName: string;
                sku: string;
                changeQty: number;
                type: string;
                reason: string | null;
                createdAt: Date;
            }[];
        };
    }>;
}
