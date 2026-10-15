"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
exports.getPaginationParams = getPaginationParams;
function paginate(total, page, limit) {
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
function getPaginationParams(page = 1, limit = 12) {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.min(100, Math.max(1, Number(limit)));
    const skip = (safePage - 1) * safeLimit;
    return { skip, take: safeLimit, page: safePage, limit: safeLimit };
}
//# sourceMappingURL=pagination.util.js.map