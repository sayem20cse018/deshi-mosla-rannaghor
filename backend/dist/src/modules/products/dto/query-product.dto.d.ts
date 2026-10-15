export declare enum ProductSortBy {
    NEWEST = "newest",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    BEST_SELLING = "best_selling",
    HIGHEST_RATED = "highest_rated"
}
export declare class QueryProductDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    stockStatus?: string;
    hasDiscount?: boolean;
    weight?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    sortBy?: ProductSortBy;
    tag?: string;
}
