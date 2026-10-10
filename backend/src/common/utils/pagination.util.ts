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

export function paginate(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function getPaginationParams(page = 1, limit = 12) {
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(100, Math.max(1, Number(limit)));
  const skip = (safePage - 1) * safeLimit;
  return { skip, take: safeLimit, page: safePage, limit: safeLimit };
}
