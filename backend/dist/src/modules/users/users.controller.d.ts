import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            phone: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            _count: {
                addresses: number;
                orders: number;
                reviews: number;
            };
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            phone: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getOrders(userId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
            items: {
                productImage: string | null;
                productName: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNumber: string;
            userId: string;
            addressId: string;
            couponId: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
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
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getOrderDetail(userId: string, orderId: string): Promise<{
        success: boolean;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
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
                userId: string;
            };
            payment: {
                id: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                transactionId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                paidAt: Date | null;
            } | null;
            delivery: {
                status: import(".prisma/client").$Enums.DeliveryStatus;
                courierName: string | null;
                trackingNumber: string | null;
                estimatedDate: Date | null;
            } | null;
            items: {
                productImage: string | null;
                id: string;
                createdAt: Date;
                orderId: string;
                productId: string;
                productName: string;
                productSku: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                discountPrice: import("@prisma/client/runtime/library").Decimal | null;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
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
            orderNumber: string;
            userId: string;
            addressId: string;
            couponId: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
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
    getAddresses(userId: string): Promise<{
        success: boolean;
        data: {
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
            userId: string;
        }[];
    }>;
    createAddress(userId: string, dto: CreateAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
            userId: string;
        };
    }>;
    updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
            userId: string;
        };
    }>;
    deleteAddress(userId: string, addressId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    setDefault(userId: string, addressId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    paymentHistory(userId: string): Promise<{
        success: boolean;
        data: {
            totalAmount: number;
            payment: {
                transactionId: string | null;
                paidAt: Date | null;
            } | null;
            id: string;
            createdAt: Date;
            orderNumber: string;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }[];
    }>;
    reviews(userId: string): Promise<{
        success: boolean;
        data: ({
            product: {
                name: string;
                id: string;
                images: {
                    id: string;
                    createdAt: Date;
                    productId: string;
                    isPrimary: boolean;
                    url: string;
                    altText: string | null;
                    sortOrder: number;
                }[];
                slug: string;
            };
        } & {
            title: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            orderId: string | null;
            productId: string;
            rating: number;
            comment: string | null;
            images: string[];
            adminNote: string | null;
        })[];
    }>;
    coupons(userId: string): Promise<{
        success: boolean;
        data: ({
            coupon: {
                description: string | null;
                code: string;
                discountType: import(".prisma/client").$Enums.DiscountType;
                discountValue: import("@prisma/client/runtime/library").Decimal;
                expiryDate: Date;
            };
        } & {
            id: string;
            userId: string;
            couponId: string;
            orderId: string | null;
            usedAt: Date;
        })[];
    }>;
    getWishlist(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            productId: string;
            addedAt: Date;
            name: string;
            slug: string;
            price: number;
            discountPrice: number | null;
            discountPercent: number | null;
            weight: string | null;
            stockStatus: import(".prisma/client").$Enums.StockStatus;
            isActive: boolean;
            primaryImage: string;
        }[];
        total: number;
    }>;
    addToWishlist(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
        alreadyExists: boolean;
    } | {
        success: boolean;
        message: string;
        alreadyExists?: undefined;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearWishlist(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkWishlist(userId: string, productId: string): Promise<{
        success: boolean;
        data: {
            inWishlist: boolean;
        };
    }>;
    notifications(userId: string, unread?: string): Promise<{
        success: boolean;
        data: {
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            message: string;
            id: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            isRead: boolean;
            readAt: Date | null;
        }[];
    }>;
    markRead(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
