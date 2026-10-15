export declare class DeliveryAddressDto {
    fullName: string;
    phone: string;
    division: string;
    district: string;
    area: string;
    fullAddress: string;
    postalCode?: string;
    saveAddress?: boolean;
}
export declare enum SupportedPaymentMethod {
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    SSLCOMMERZ = "SSLCOMMERZ",
    BKASH = "BKASH",
    NAGAD = "NAGAD",
    ROCKET = "ROCKET",
    VISA = "VISA",
    MASTERCARD = "MASTERCARD",
    AMEX = "AMEX",
    DEBIT_CARD = "DEBIT_CARD",
    CREDIT_CARD = "CREDIT_CARD",
    INTERNET_BANKING = "INTERNET_BANKING",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class CreateOrderDto {
    deliveryAddress: DeliveryAddressDto;
    deliveryNote?: string;
    couponCode?: string;
    paymentMethod?: SupportedPaymentMethod;
}
