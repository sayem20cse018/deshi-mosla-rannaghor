export declare class CreateVariantDto {
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
}
export declare class UpdateVariantDto {
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
}
