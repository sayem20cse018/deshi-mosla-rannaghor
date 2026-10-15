export declare class CreateProductDto {
    name: string;
    nameEn?: string;
    slug: string;
    sku: string;
    categoryId: string;
    brandId?: string;
    description?: string;
    ingredients?: string;
    usage?: string;
    storageInfo?: string;
    origin?: string;
    weight?: string;
    size?: string;
    price: number;
    discountPrice?: number;
    minOrderQty?: number;
    maxOrderQty?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    tags?: string[];
    metaTitle?: string;
    metaDesc?: string;
}
