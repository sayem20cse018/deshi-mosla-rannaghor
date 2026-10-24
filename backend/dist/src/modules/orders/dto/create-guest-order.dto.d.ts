import { SupportedPaymentMethod } from './create-order.dto';
export declare class GuestDeliveryAddressDto {
    fullName: string;
    phone: string;
    email?: string;
    division: string;
    district: string;
    area: string;
    fullAddress: string;
    postalCode?: string;
}
export declare class GuestOrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateGuestOrderDto {
    items: GuestOrderItemDto[];
    deliveryAddress: GuestDeliveryAddressDto;
    deliveryNote?: string;
    couponCode?: string;
    paymentMethod?: SupportedPaymentMethod;
}
