export declare enum OnlinePaymentMethod {
    SSLCOMMERZ = "SSLCOMMERZ",
    BKASH = "BKASH",
    NAGAD = "NAGAD",
    ROCKET = "ROCKET",
    VISA = "VISA",
    MASTERCARD = "MASTERCARD",
    AMEX = "AMEX",
    DEBIT_CARD = "DEBIT_CARD",
    CREDIT_CARD = "CREDIT_CARD"
}
export declare class InitiatePaymentDto {
    orderId: string;
    paymentMethod: OnlinePaymentMethod;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
}
