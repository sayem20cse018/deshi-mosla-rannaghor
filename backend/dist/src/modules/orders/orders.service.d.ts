import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly paymentsService;
    constructor(prisma: PrismaService, paymentsService: PaymentsService);
    placeOrder(userId: string, dto: CreateOrderDto): Promise<{
        success: boolean;
        requiresGateway: boolean;
        message: string;
        gatewayUrl: any;
        transactionId: string;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
            address?: {
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
            } | undefined;
            payment?: {
                id: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                codStatus: import(".prisma/client").$Enums.CodStatus | null;
            } | null | undefined;
            delivery?: {
                status: import(".prisma/client").$Enums.DeliveryStatus;
                estimatedDate: Date | null;
            } | null | undefined;
            items?: {
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
            }[] | undefined;
            id?: string | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            orderNumber?: string | undefined;
            userId?: string | undefined;
            addressId?: string | undefined;
            couponId?: string | null | undefined;
            status?: import(".prisma/client").$Enums.OrderStatus | undefined;
            paymentMethod?: import(".prisma/client").$Enums.PaymentMethod | undefined;
            paymentStatus?: import(".prisma/client").$Enums.PaymentStatus | undefined;
            deliveryNote?: string | null | undefined;
            estimatedDelivery?: Date | null | undefined;
            confirmedAt?: Date | null | undefined;
            packedAt?: Date | null | undefined;
            shippedAt?: Date | null | undefined;
            deliveredAt?: Date | null | undefined;
            cancelledAt?: Date | null | undefined;
            cancelReason?: string | null | undefined;
            returnedAt?: Date | null | undefined;
            returnReason?: string | null | undefined;
        };
    } | {
        success: boolean;
        requiresGateway: boolean;
        message: string;
        data: {
            subtotal: number;
            totalAmount: number;
            deliveryCharge: number;
            discountAmount: number;
            couponDiscount: number;
            address?: {
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
            } | undefined;
            payment?: {
                id: string;
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                codStatus: import(".prisma/client").$Enums.CodStatus | null;
            } | null | undefined;
            delivery?: {
                status: import(".prisma/client").$Enums.DeliveryStatus;
                estimatedDate: Date | null;
            } | null | undefined;
            items?: {
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
            }[] | undefined;
            id?: string | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            orderNumber?: string | undefined;
            userId?: string | undefined;
            addressId?: string | undefined;
            couponId?: string | null | undefined;
            status?: import(".prisma/client").$Enums.OrderStatus | undefined;
            paymentMethod?: import(".prisma/client").$Enums.PaymentMethod | undefined;
            paymentStatus?: import(".prisma/client").$Enums.PaymentStatus | undefined;
            deliveryNote?: string | null | undefined;
            estimatedDelivery?: Date | null | undefined;
            confirmedAt?: Date | null | undefined;
            packedAt?: Date | null | undefined;
            shippedAt?: Date | null | undefined;
            deliveredAt?: Date | null | undefined;
            cancelledAt?: Date | null | undefined;
            cancelReason?: string | null | undefined;
            returnedAt?: Date | null | undefined;
            returnReason?: string | null | undefined;
        };
        gatewayUrl?: undefined;
        transactionId?: undefined;
    }>;
    getOrder(userId: string, orderId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    cancelOrder(userId: string, orderId: string, reason?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    trackOrderByNumber(orderNumber: string, phone?: string): Promise<{
        success: boolean;
        data: {
            orderNumber: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            totalAmount: number;
            deliveryCharge: number;
            estimatedDelivery: Date | null;
            createdAt: Date;
            cancelReason: string | null;
            items: {
                totalPrice: number;
                productImage: string | null;
                productName: string;
                quantity: number;
            }[];
            delivery: {
                status: import(".prisma/client").$Enums.DeliveryStatus;
                deliveredAt: Date | null;
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
            payment: {
                paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                paidAt: Date | null;
            } | null;
            address: {
                fullName: string;
                phone: string;
                division: string;
                district: string;
                area: string;
                fullAddress: string;
            };
        };
    }>;
    calculateDeliveryCharge(district: string, orderAmount: number): Promise<{
        success: boolean;
        data: {
            district: string;
            charge: number;
            isFree: boolean;
            freeDeliveryThreshold: number;
        };
    }>;
    getDeliveryCharges(): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            division: string | null;
            district: string | null;
            area: string | null;
            charge: import("@prisma/client/runtime/library").Decimal;
            minOrderFree: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    private serializeOrder;
}
