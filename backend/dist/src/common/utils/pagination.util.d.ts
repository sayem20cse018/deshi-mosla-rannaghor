export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare function paginate(total: number, page: number, limit: number): PaginationMeta;
export declare function getPaginationParams(page?: number, limit?: number): {
    skip: number;
    take: number;
    page: number;
    limit: number;
};
