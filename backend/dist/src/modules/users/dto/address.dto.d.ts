export declare class CreateAddressDto {
    label?: string;
    fullName: string;
    phone: string;
    division: string;
    district: string;
    area: string;
    fullAddress: string;
    postalCode?: string;
    isDefault?: boolean;
}
export declare class UpdateAddressDto extends CreateAddressDto {
}
