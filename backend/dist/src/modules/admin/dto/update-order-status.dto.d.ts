export declare enum AdminOrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    PACKED = "PACKED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
    REFUNDED = "REFUNDED"
}
export declare class UpdateOrderStatusDto {
    status: AdminOrderStatus;
    note?: string;
    courierName?: string;
    trackingNumber?: string;
}
