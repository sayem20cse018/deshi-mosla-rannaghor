import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(period?: string, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            orders: {
                total: number;
                pending: number;
                processing: number;
                shipped: number;
                delivered: number;
                cancelled: number;
            };
            customers: {
                total: number;
                new: number;
            };
            products: {
                total: number;
                active: number;
                outOfStock: number;
                lowStock: number;
            };
            revenue: {
                total: number;
                change: number;
                positive: boolean;
            };
            period: {
                start: Date;
                end: Date;
                label: string;
            };
        };
    }>;
    getSalesChart(period?: string, from?: string, to?: string): Promise<{
        success: boolean;
        data: {
            date: string;
            revenue: number;
            orders: number;
        }[];
    }>;
    getRecentOrders(limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            totalAmount: number;
            itemCount: number;
            createdAt: Date;
            customer: {
                name: string;
                email: string;
                phone: string;
            } | null;
            items: {
                name: string;
                image: string;
                quantity: number;
            }[];
        }[];
    }>;
    getTopProducts(period?: string, limit?: number): Promise<{
        success: boolean;
        data: {
            productId: string;
            product: {
                inventory: {
                    availableStock: number;
                } | null;
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                price: import("@prisma/client/runtime/library").Decimal;
                stockStatus: import(".prisma/client").$Enums.StockStatus;
            };
            totalSold: number;
            totalRevenue: number;
        }[];
    }>;
    getRecentCustomers(limit?: number): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            phone: string;
            id: string;
            isActive: boolean;
            isBlocked: boolean;
            createdAt: Date;
            _count: {
                orders: number;
            };
        }[];
    }>;
    getRecentReviews(limit?: number): Promise<{
        success: boolean;
        data: ({
            user: {
                name: string;
                avatar: string | null;
            };
            product: {
                name: string;
                slug: string;
            };
        } & {
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            userId: string;
            orderId: string | null;
            productId: string;
            rating: number;
            comment: string | null;
            images: string[];
            adminNote: string | null;
        })[];
    }>;
    getLowStockProducts(limit?: number): Promise<{
        success: boolean;
        data: {
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
            stockStatus: import(".prisma/client").$Enums.StockStatus;
        }[];
    }>;
    adminGetOrders(params: {
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
    }): Promise<{
        success: boolean;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
            itemCount: number;
            user: {
                name: string;
                email: string;
                phone: string;
                id: string;
                avatar: string | null;
            } | {
                id: string;
                name: string;
                email: string;
                phone: any;
                avatar: null;
            };
            address: {
                phone: string;
                fullName: string;
                division: string;
                district: string;
                area: string;
                fullAddress: string;
            };
            payment: {
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                transactionId: string | null;
                codStatus: import(".prisma/client").$Enums.CodStatus | null;
                paidAt: Date | null;
            } | null;
            delivery: {
                status: import(".prisma/client").$Enums.DeliveryStatus;
                deliveredAt: Date | null;
                courierName: string | null;
                trackingNumber: string | null;
                estimatedDate: Date | null;
            } | null;
            items: {
                productImage: string | null;
                productName: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
            _count: {
                items: number;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            userId: string | null;
            addressId: string;
            couponId: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deliveryNote: string | null;
            estimatedDelivery: Date | null;
            confirmedAt: Date | null;
            packedAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            returnedAt: Date | null;
            returnReason: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminGetOrder(orderId: string): Promise<{
        success: boolean;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
            items: {
                unitPrice: number;
                discountPrice: number | null;
                totalPrice: number;
                productImage: string | null;
                id: string;
                productId: string;
                productName: string;
                productSku: string;
                quantity: number;
            }[];
            user: {
                name: string;
                email: string;
                phone: string;
                id: string;
                avatar: string | null;
            } | null;
            address: {
                phone: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                label: string | null;
                fullName: string;
                division: string;
                district: string;
                area: string;
                fullAddress: string;
                postalCode: string | null;
                isDefault: boolean;
                userId: string | null;
            };
            coupon: {
                code: string;
                discountType: import(".prisma/client").$Enums.DiscountType;
                discountValue: import("@prisma/client/runtime/library").Decimal;
            } | null;
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                orderId: string;
                transactionId: string | null;
                gatewayTxnId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                codStatus: import(".prisma/client").$Enums.CodStatus | null;
                bankName: string | null;
                accountNumber: string | null;
                paymentRef: string | null;
                gatewayResponse: import("@prisma/client/runtime/library").JsonValue | null;
                verifiedAt: Date | null;
                paidAt: Date | null;
                failedAt: Date | null;
                failureReason: string | null;
                refundedAt: Date | null;
                refundAmount: import("@prisma/client/runtime/library").Decimal | null;
                refundReason: string | null;
                refundTxnId: string | null;
            } | null;
            delivery: {
                deliveryCharge: import("@prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.DeliveryStatus;
                deliveryNote: string | null;
                deliveredAt: Date | null;
                orderId: string;
                courierName: string | null;
                trackingNumber: string | null;
                estimatedDate: Date | null;
            } | null;
            statusHistory: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderId: string;
                note: string | null;
                createdBy: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            userId: string | null;
            addressId: string;
            couponId: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deliveryNote: string | null;
            estimatedDelivery: Date | null;
            confirmedAt: Date | null;
            packedAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            cancelReason: string | null;
            returnedAt: Date | null;
            returnReason: string | null;
        };
    }>;
    adminUpdateOrderStatus(orderId: string, status: string, note?: string, courierName?: string, trackingNumber?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminBulkUpdateStatus(orderIds: string[], status: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetOrderStatusCounts(): Promise<{
        success: boolean;
        data: Record<string, number>;
    }>;
    adminRefundOrder(orderId: string, amount?: number, reason?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetCategories(params: {
        page?: number;
        limit?: number;
        search?: string;
        parentId?: string;
    }): Promise<{
        success: boolean;
        data: ({
            _count: {
                children: number;
                products: number;
            };
            parent: {
                name: string;
                id: string;
            } | null;
        } & {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            metaTitle: string | null;
            metaDesc: string | null;
            sortOrder: number;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            showInNav: boolean;
            navOrder: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminGetCategory(id: string): Promise<{
        success: boolean;
        data: {
            _count: {
                products: number;
            };
            parent: {
                name: string;
                id: string;
            } | null;
            children: {
                description: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                nameEn: string | null;
                slug: string;
                metaTitle: string | null;
                metaDesc: string | null;
                sortOrder: number;
                image: string | null;
                icon: string | null;
                parentId: string | null;
                showInNav: boolean;
                navOrder: number;
            }[];
        } & {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            metaTitle: string | null;
            metaDesc: string | null;
            sortOrder: number;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            showInNav: boolean;
            navOrder: number;
        };
    }>;
    adminCreateCategory(dto: {
        name: string;
        nameEn?: string;
        slug: string;
        description?: string;
        image?: string;
        icon?: string;
        parentId?: string;
        isActive?: boolean;
        sortOrder?: number;
        showInNav?: boolean;
        navOrder?: number;
        metaTitle?: string;
        metaDesc?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            metaTitle: string | null;
            metaDesc: string | null;
            sortOrder: number;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            showInNav: boolean;
            navOrder: number;
        };
    }>;
    adminUpdateCategory(id: string, dto: {
        name?: string;
        nameEn?: string;
        slug?: string;
        description?: string;
        image?: string;
        icon?: string;
        parentId?: string;
        isActive?: boolean;
        sortOrder?: number;
        showInNav?: boolean;
        navOrder?: number;
        metaTitle?: string;
        metaDesc?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            metaTitle: string | null;
            metaDesc: string | null;
            sortOrder: number;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            showInNav: boolean;
            navOrder: number;
        };
    }>;
    adminDeleteCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminReorderCategories(items: Array<{
        id: string;
        sortOrder: number;
    }>): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetBrands(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: ({
            _count: {
                products: number;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            logo: string | null;
            website: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminGetBrand(id: string): Promise<{
        success: boolean;
        data: {
            _count: {
                products: number;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            logo: string | null;
            website: string | null;
        };
    }>;
    adminCreateBrand(dto: {
        name: string;
        nameEn?: string;
        slug: string;
        logo?: string;
        description?: string;
        website?: string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            logo: string | null;
            website: string | null;
        };
    }>;
    adminUpdateBrand(id: string, dto: {
        name?: string;
        nameEn?: string;
        slug?: string;
        logo?: string;
        description?: string;
        website?: string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            slug: string;
            logo: string | null;
            website: string | null;
        };
    }>;
    adminDeleteBrand(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetVariants(productId: string): Promise<{
        success: boolean;
        data: {
            price: number;
            salePrice: number | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            weight: string | null;
            sortOrder: number;
            image: string | null;
            stock: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        }[];
    }>;
    adminCreateVariant(productId: string, dto: {
        name: string;
        sku: string;
        price: number;
        salePrice?: number;
        stock?: number;
        weight?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
        attributes?: Record<string, unknown>;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            price: number;
            salePrice: number | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            weight: string | null;
            sortOrder: number;
            image: string | null;
            stock: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    adminUpdateVariant(productId: string, variantId: string, dto: {
        name?: string;
        sku?: string;
        price?: number;
        salePrice?: number;
        stock?: number;
        weight?: string;
        image?: string;
        isActive?: boolean;
        sortOrder?: number;
        attributes?: Record<string, unknown>;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            price: number;
            salePrice: number | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            sku: string;
            weight: string | null;
            sortOrder: number;
            image: string | null;
            stock: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    adminDeleteVariant(productId: string, variantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetHeroSlides(): Promise<{
        success: boolean;
        data: {
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            tag: string | null;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            tagEn: string | null;
            badge: string | null;
            badgeEn: string | null;
            imageMobile: string | null;
            ctaLabel: string | null;
            ctaLabelEn: string | null;
            ctaUrl: string | null;
            cta2Label: string | null;
            cta2LabelEn: string | null;
            cta2Url: string | null;
            bgColor: string | null;
            emoji: string | null;
            endDate: Date | null;
        }[];
    }>;
    adminCreateHeroSlide(dto: {
        title?: string;
        titleEn?: string;
        subtitle?: string;
        subtitleEn?: string;
        tag?: string;
        tagEn?: string;
        badge?: string;
        badgeEn?: string;
        image?: string;
        imageMobile?: string;
        ctaLabel?: string;
        ctaLabelEn?: string;
        ctaUrl?: string;
        cta2Label?: string;
        cta2LabelEn?: string;
        cta2Url?: string;
        bgColor?: string;
        emoji?: string;
        isActive?: boolean;
        sortOrder?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        success: boolean;
        data: {
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            tag: string | null;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            tagEn: string | null;
            badge: string | null;
            badgeEn: string | null;
            imageMobile: string | null;
            ctaLabel: string | null;
            ctaLabelEn: string | null;
            ctaUrl: string | null;
            cta2Label: string | null;
            cta2LabelEn: string | null;
            cta2Url: string | null;
            bgColor: string | null;
            emoji: string | null;
            endDate: Date | null;
        };
    }>;
    adminUpdateHeroSlide(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            tag: string | null;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            tagEn: string | null;
            badge: string | null;
            badgeEn: string | null;
            imageMobile: string | null;
            ctaLabel: string | null;
            ctaLabelEn: string | null;
            ctaUrl: string | null;
            cta2Label: string | null;
            cta2LabelEn: string | null;
            cta2Url: string | null;
            bgColor: string | null;
            emoji: string | null;
            endDate: Date | null;
        };
    }>;
    adminDeleteHeroSlide(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminReorderHeroSlides(items: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        success: boolean;
    }>;
    adminGetHomepageSections(): Promise<{
        success: boolean;
        data: {
            description: string | null;
            title: string | null;
            id: string;
            updatedAt: Date;
            sortOrder: number;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            imageMobile: string | null;
            key: string;
            buttonLabel: string | null;
            buttonLabelEn: string | null;
            buttonUrl: string | null;
            extraData: import("@prisma/client/runtime/library").JsonValue | null;
            isEnabled: boolean;
        }[];
    }>;
    adminUpsertHomepageSection(key: string, dto: {
        title?: string;
        titleEn?: string;
        subtitle?: string;
        subtitleEn?: string;
        description?: string;
        image?: string;
        imageMobile?: string;
        buttonLabel?: string;
        buttonLabelEn?: string;
        buttonUrl?: string;
        extraData?: Record<string, unknown> | null;
        isEnabled?: boolean;
        sortOrder?: number;
    }): Promise<{
        success: boolean;
        data: {
            description: string | null;
            title: string | null;
            id: string;
            updatedAt: Date;
            sortOrder: number;
            image: string | null;
            titleEn: string | null;
            subtitle: string | null;
            subtitleEn: string | null;
            imageMobile: string | null;
            key: string;
            buttonLabel: string | null;
            buttonLabelEn: string | null;
            buttonUrl: string | null;
            extraData: import("@prisma/client/runtime/library").JsonValue | null;
            isEnabled: boolean;
        };
    }>;
    adminReorderHomepageSections(items: {
        key: string;
        sortOrder: number;
    }[]): Promise<{
        success: boolean;
    }>;
    adminToggleHomepageSection(key: string, isEnabled: boolean): Promise<{
        success: boolean;
    }>;
    adminGetTestimonials(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            role: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string;
            sortOrder: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminCreateTestimonial(dto: {
        name: string;
        role?: string;
        avatar?: string;
        rating?: number;
        comment: string;
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            role: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string;
            sortOrder: number;
        };
    }>;
    adminUpdateTestimonial(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            role: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string;
            sortOrder: number;
        };
    }>;
    adminDeleteTestimonial(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetCoupons(p: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        data: {
            discountValue: number;
            minOrderAmount: number | null;
            maxDiscount: number | null;
            usageCount: number;
            _count: {
                usages: number;
            };
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            discountType: import(".prisma/client").$Enums.DiscountType;
            startDate: Date;
            expiryDate: Date;
            usageLimit: number | null;
            userLimit: number;
            usedCount: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminCreateCoupon(dto: {
        code: string;
        description?: string;
        discountType: string;
        discountValue: number;
        minOrderAmount?: number;
        maxDiscount?: number;
        startDate: string;
        expiryDate: string;
        usageLimit?: number;
        userLimit?: number;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            expiryDate: Date;
            usageLimit: number | null;
            userLimit: number;
            usedCount: number;
        };
    }>;
    adminUpdateCoupon(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            expiryDate: Date;
            usageLimit: number | null;
            userLimit: number;
            usedCount: number;
        };
    }>;
    adminDeleteCoupon(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetCouponUsages(couponId: string): Promise<{
        success: boolean;
        data: ({
            user: {
                name: string;
                email: string;
                phone: string;
            };
        } & {
            id: string;
            userId: string;
            couponId: string;
            orderId: string | null;
            usedAt: Date;
        })[];
    }>;
    adminGetBanners(p: {
        page?: number;
        limit?: number;
        position?: string;
    }): Promise<{
        success: boolean;
        data: {
            link: string | null;
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            image: string;
            titleEn: string | null;
            subtitle: string | null;
            endDate: Date | null;
            buttonText: string | null;
            position: import(".prisma/client").$Enums.BannerPosition;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminCreateBanner(dto: {
        title?: string;
        titleEn?: string;
        subtitle?: string;
        image: string;
        imageMobile?: string;
        link?: string;
        buttonText?: string;
        position?: string;
        isActive?: boolean;
        sortOrder?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        success: boolean;
        data: {
            link: string | null;
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            image: string;
            titleEn: string | null;
            subtitle: string | null;
            endDate: Date | null;
            buttonText: string | null;
            position: import(".prisma/client").$Enums.BannerPosition;
        };
    }>;
    adminUpdateBanner(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            link: string | null;
            title: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date | null;
            sortOrder: number;
            image: string;
            titleEn: string | null;
            subtitle: string | null;
            endDate: Date | null;
            buttonText: string | null;
            position: import(".prisma/client").$Enums.BannerPosition;
        };
    }>;
    adminDeleteBanner(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetOffers(p: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: {
            discountValue: number;
            minOrderAmount: number | null;
            maxDiscount: number | null;
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            startDate: Date;
            sortOrder: number;
            image: string | null;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminCreateOffer(dto: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            sortOrder: number;
            image: string | null;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        };
    }>;
    adminUpdateOffer(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            minOrderAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            startDate: Date;
            sortOrder: number;
            image: string | null;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        };
    }>;
    adminDeleteOffer(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetPromotions(p: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        success: boolean;
        data: {
            discountValue: number;
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            startDate: Date;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminCreatePromotion(dto: any): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        };
    }>;
    adminUpdatePromotion(id: string, dto: Record<string, unknown>): Promise<{
        success: boolean;
        data: {
            description: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string | null;
            discountType: string;
            discountValue: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            targetType: string;
            targetIds: string[];
        };
    }>;
    adminDeletePromotion(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetSubscribers(p: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        data: {
            name: string | null;
            email: string;
            id: string;
            isActive: boolean;
            source: string | null;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminDeleteSubscriber(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminBulkDeleteSubscribers(ids: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    adminExportSubscribers(): Promise<string>;
    adminGetCustomers(params: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: string;
        isBlocked?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        success: boolean;
        data: {
            totalOrders: number;
            totalReviews: number;
            totalSpending: any;
            lastOrder: {
                totalAmount: number;
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderNumber: string;
            } | null;
            name: string;
            email: string;
            phone: string;
            id: string;
            avatar: string | null;
            isActive: boolean;
            isBlocked: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            orders: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderNumber: string;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
            }[];
            _count: {
                orders: number;
                reviews: number;
            };
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminGetCustomer(userId: string): Promise<{
        success: boolean;
        data: {
            totalSpending: number;
            orders: {
                totalAmount: number;
                itemCount: number;
                id: string;
                createdAt: Date;
                _count: {
                    items: number;
                };
                status: import(".prisma/client").$Enums.OrderStatus;
                orderNumber: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            }[];
            name: string;
            email: string;
            phone: string;
            id: string;
            avatar: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            isActive: boolean;
            isBlocked: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            addresses: {
                phone: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                label: string | null;
                fullName: string;
                division: string;
                district: string;
                area: string;
                fullAddress: string;
                postalCode: string | null;
                isDefault: boolean;
                userId: string | null;
            }[];
            reviews: {
                product: {
                    name: string;
                    id: string;
                    slug: string;
                };
                title: string | null;
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ReviewStatus;
                rating: number;
            }[];
            _count: {
                wishlists: number;
                orders: number;
                reviews: number;
            };
        };
    }>;
    adminToggleCustomer(userId: string, action: 'activate' | 'deactivate' | 'block' | 'unblock'): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetReviews(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        rating?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        success: boolean;
        data: ({
            user: {
                name: string;
                email: string;
                id: string;
                avatar: string | null;
            };
            product: {
                name: string;
                id: string;
                images: {
                    url: string;
                }[];
                slug: string;
            };
        } & {
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ReviewStatus;
            userId: string;
            orderId: string | null;
            productId: string;
            rating: number;
            comment: string | null;
            images: string[];
            adminNote: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminUpdateReviewStatus(reviewId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', adminNote?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminDeleteReview(reviewId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetInventory(params: {
        page?: number;
        limit?: number;
        search?: string;
        stockStatus?: string;
        categoryId?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        success: boolean;
        data: {
            category: {
                name: string;
            };
            inventory: {
                id: string;
                updatedAt: Date;
                totalStock: number;
                availableStock: number;
                soldQuantity: number;
                reservedStock: number;
                lowStockAlert: number;
            } | null;
            name: string;
            id: string;
            images: {
                url: string;
            }[];
            sku: string;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            variants: {
                name: string;
                id: string;
                sku: string;
                stock: number;
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminAdjustStock(productId: string, dto: {
        adjustment: number;
        type: 'MANUAL_ADD' | 'MANUAL_REMOVE' | 'CORRECTION' | 'DAMAGE' | 'RETURN';
        reason?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    adminGetInventoryLogs(params: {
        page?: number;
        limit?: number;
        productId?: string;
        type?: string;
        from?: string;
        to?: string;
    }): Promise<{
        success: boolean;
        data: ({
            inventory: {
                product: {
                    name: string;
                    id: string;
                    sku: string;
                };
                productId: string;
            };
        } & {
            type: string;
            id: string;
            createdAt: Date;
            changeQty: number;
            reason: string | null;
            reference: string | null;
            inventoryId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    adminGetFullLowStock(): Promise<{
        success: boolean;
        data: {
            category: {
                name: string;
            };
            inventory: {
                totalStock: number;
                availableStock: number;
                lowStockAlert: number;
            } | null;
            name: string;
            id: string;
            images: {
                url: string;
            }[];
            sku: string;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
        }[];
    }>;
}
