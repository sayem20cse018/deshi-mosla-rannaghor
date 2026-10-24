"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const create_variant_dto_1 = require("./dto/create-variant.dto");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats(period, from, to) {
        return this.adminService.getDashboardStats(period ?? '30days', from, to);
    }
    getSalesChart(period, from, to) {
        return this.adminService.getSalesChart(period ?? '30days', from, to);
    }
    getRecentOrders(limit) {
        return this.adminService.getRecentOrders(limit ? Number(limit) : 10);
    }
    getTopProducts(period, limit) {
        return this.adminService.getTopProducts(period ?? '30days', limit ? Number(limit) : 5);
    }
    getRecentCustomers(limit) {
        return this.adminService.getRecentCustomers(limit ? Number(limit) : 6);
    }
    getRecentReviews(limit) {
        return this.adminService.getRecentReviews(limit ? Number(limit) : 5);
    }
    getLowStockProducts(limit) {
        return this.adminService.getLowStockProducts(limit ? Number(limit) : 8);
    }
    adminGetOrders(page, limit, search, status, paymentStatus, paymentMethod, from, to, sortBy, sortOrder) {
        return this.adminService.adminGetOrders({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search, status, paymentStatus, paymentMethod,
            from, to,
            sortBy: sortBy ?? 'createdAt',
            sortOrder: sortOrder ?? 'desc',
        });
    }
    adminGetOrderStatusCounts() {
        return this.adminService.adminGetOrderStatusCounts();
    }
    adminGetOrder(id) {
        return this.adminService.adminGetOrder(id);
    }
    adminUpdateOrderStatus(id, dto) {
        return this.adminService.adminUpdateOrderStatus(id, dto.status, dto.note, dto.courierName, dto.trackingNumber);
    }
    adminBulkUpdateStatus(body) {
        return this.adminService.adminBulkUpdateStatus(body.orderIds, body.status);
    }
    adminRefundOrder(id, body) {
        return this.adminService.adminRefundOrder(id, body.amount, body.reason);
    }
    adminGetCategories(page, limit, search, parentId) {
        return this.adminService.adminGetCategories({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
            search,
            parentId,
        });
    }
    adminGetCategory(id) {
        return this.adminService.adminGetCategory(id);
    }
    adminReorderCategories(body) {
        return this.adminService.adminReorderCategories(body.items);
    }
    adminCreateCategory(dto) {
        return this.adminService.adminCreateCategory(dto);
    }
    adminUpdateCategory(id, dto) {
        return this.adminService.adminUpdateCategory(id, dto);
    }
    adminDeleteCategory(id) {
        return this.adminService.adminDeleteCategory(id);
    }
    adminGetBrands(page, limit, search) {
        return this.adminService.adminGetBrands({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
            search,
        });
    }
    adminGetBrand(id) {
        return this.adminService.adminGetBrand(id);
    }
    adminCreateBrand(dto) {
        return this.adminService.adminCreateBrand(dto);
    }
    adminUpdateBrand(id, dto) {
        return this.adminService.adminUpdateBrand(id, dto);
    }
    adminDeleteBrand(id) {
        return this.adminService.adminDeleteBrand(id);
    }
    adminGetVariants(id) {
        return this.adminService.adminGetVariants(id);
    }
    adminCreateVariant(id, dto) {
        return this.adminService.adminCreateVariant(id, dto);
    }
    adminUpdateVariant(productId, variantId, dto) {
        return this.adminService.adminUpdateVariant(productId, variantId, dto);
    }
    adminDeleteVariant(productId, variantId) {
        return this.adminService.adminDeleteVariant(productId, variantId);
    }
    adminGetHeroSlides() {
        return this.adminService.adminGetHeroSlides();
    }
    adminCreateHeroSlide(dto) {
        return this.adminService.adminCreateHeroSlide(dto);
    }
    adminReorderHeroSlides(body) {
        return this.adminService.adminReorderHeroSlides(body.items);
    }
    adminUpdateHeroSlide(id, dto) {
        return this.adminService.adminUpdateHeroSlide(id, dto);
    }
    adminDeleteHeroSlide(id) {
        return this.adminService.adminDeleteHeroSlide(id);
    }
    adminGetHomepageSections() {
        return this.adminService.adminGetHomepageSections();
    }
    adminReorderHomepageSections(body) {
        return this.adminService.adminReorderHomepageSections(body.items);
    }
    adminToggleHomepageSection(key, body) {
        return this.adminService.adminToggleHomepageSection(key, body.isEnabled);
    }
    adminUpsertHomepageSection(key, dto) {
        return this.adminService.adminUpsertHomepageSection(key, dto);
    }
    adminGetTestimonials(page, limit, search) {
        return this.adminService.adminGetTestimonials({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search,
        });
    }
    adminCreateTestimonial(dto) {
        return this.adminService.adminCreateTestimonial(dto);
    }
    adminUpdateTestimonial(id, dto) {
        return this.adminService.adminUpdateTestimonial(id, dto);
    }
    adminDeleteTestimonial(id) {
        return this.adminService.adminDeleteTestimonial(id);
    }
    adminGetCoupons(page, limit, search) {
        return this.adminService.adminGetCoupons({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20, search });
    }
    adminGetCouponUsages(id) { return this.adminService.adminGetCouponUsages(id); }
    adminCreateCoupon(dto) { return this.adminService.adminCreateCoupon(dto); }
    adminUpdateCoupon(id, dto) { return this.adminService.adminUpdateCoupon(id, dto); }
    adminDeleteCoupon(id) { return this.adminService.adminDeleteCoupon(id); }
    adminGetBanners(page, limit, position) {
        return this.adminService.adminGetBanners({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20, position });
    }
    adminCreateBanner(dto) { return this.adminService.adminCreateBanner(dto); }
    adminUpdateBanner(id, dto) { return this.adminService.adminUpdateBanner(id, dto); }
    adminDeleteBanner(id) { return this.adminService.adminDeleteBanner(id); }
    adminGetOffers(page, limit, search) {
        return this.adminService.adminGetOffers({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20, search });
    }
    adminCreateOffer(dto) { return this.adminService.adminCreateOffer(dto); }
    adminUpdateOffer(id, dto) { return this.adminService.adminUpdateOffer(id, dto); }
    adminDeleteOffer(id) { return this.adminService.adminDeleteOffer(id); }
    adminGetPromotions(page, limit, search) {
        return this.adminService.adminGetPromotions({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20, search });
    }
    adminCreatePromotion(dto) { return this.adminService.adminCreatePromotion(dto); }
    adminUpdatePromotion(id, dto) { return this.adminService.adminUpdatePromotion(id, dto); }
    adminDeletePromotion(id) { return this.adminService.adminDeletePromotion(id); }
    adminGetSubscribers(page, limit, search) {
        return this.adminService.adminGetSubscribers({ page: page ? Number(page) : 1, limit: limit ? Number(limit) : 50, search });
    }
    async adminExportSubscribers() {
        const csv = await this.adminService.adminExportSubscribers();
        return { success: true, data: csv };
    }
    adminDeleteSubscriber(id) { return this.adminService.adminDeleteSubscriber(id); }
    adminBulkDeleteSubscribers(body) { return this.adminService.adminBulkDeleteSubscribers(body.ids); }
    adminGetCustomers(page, limit, search, isActive, isBlocked, sortBy, sortOrder) {
        return this.adminService.adminGetCustomers({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search, isActive, isBlocked,
            sortBy,
            sortOrder: sortOrder ?? 'desc',
        });
    }
    adminGetCustomer(id) {
        return this.adminService.adminGetCustomer(id);
    }
    adminToggleCustomer(id, body) {
        return this.adminService.adminToggleCustomer(id, body.action);
    }
    adminGetReviews(page, limit, search, status, rating, sortOrder) {
        return this.adminService.adminGetReviews({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search, status,
            rating: rating ? Number(rating) : undefined,
            sortOrder: sortOrder ?? 'desc',
        });
    }
    adminUpdateReviewStatus(id, body) {
        return this.adminService.adminUpdateReviewStatus(id, body.status, body.adminNote);
    }
    adminDeleteReview(id) {
        return this.adminService.adminDeleteReview(id);
    }
    adminGetInventory(page, limit, search, stockStatus, categoryId, sortBy, sortOrder) {
        return this.adminService.adminGetInventory({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search, stockStatus, categoryId,
            sortBy,
            sortOrder: sortOrder ?? 'desc',
        });
    }
    adminAdjustStock(productId, dto) {
        return this.adminService.adminAdjustStock(productId, dto);
    }
    adminGetInventoryLogs(page, limit, productId, type, from, to) {
        return this.adminService.adminGetInventoryLogs({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 30,
            productId, type, from, to,
        });
    }
    adminGetFullLowStock() {
        return this.adminService.adminGetFullLowStock();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['today', 'yesterday', '7days', '30days', 'month', 'year', 'custom'] }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('sales-chart'),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSalesChart", null);
__decorate([
    (0, common_1.Get)('recent-orders'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentOrders", null);
__decorate([
    (0, common_1.Get)('top-products'),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTopProducts", null);
__decorate([
    (0, common_1.Get)('recent-customers'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentCustomers", null);
__decorate([
    (0, common_1.Get)('recent-reviews'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentReviews", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLowStockProducts", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'paymentStatus', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'paymentMethod', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('paymentStatus')),
    __param(5, (0, common_1.Query)('paymentMethod')),
    __param(6, (0, common_1.Query)('from')),
    __param(7, (0, common_1.Query)('to')),
    __param(8, (0, common_1.Query)('sortBy')),
    __param(9, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetOrders", null);
__decorate([
    (0, common_1.Get)('orders/status-counts'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetOrderStatusCounts", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateOrderStatus", null);
__decorate([
    (0, common_1.Post)('orders/bulk-status'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminBulkUpdateStatus", null);
__decorate([
    (0, common_1.Post)('orders/:id/refund'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminRefundOrder", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'parentId', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCategory", null);
__decorate([
    (0, common_1.Post)('categories/reorder'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminReorderCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteCategory", null);
__decorate([
    (0, common_1.Get)('brands'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetBrands", null);
__decorate([
    (0, common_1.Get)('brands/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetBrand", null);
__decorate([
    (0, common_1.Post)('brands'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateBrand", null);
__decorate([
    (0, common_1.Patch)('brands/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateBrand", null);
__decorate([
    (0, common_1.Delete)('brands/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteBrand", null);
__decorate([
    (0, common_1.Get)('products/:id/variants'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetVariants", null);
__decorate([
    (0, common_1.Post)('products/:id/variants'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_variant_dto_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateVariant", null);
__decorate([
    (0, common_1.Patch)('products/:productId/variants/:variantId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_variant_dto_1.UpdateVariantDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateVariant", null);
__decorate([
    (0, common_1.Delete)('products/:productId/variants/:variantId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteVariant", null);
__decorate([
    (0, common_1.Get)('homepage/slides'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetHeroSlides", null);
__decorate([
    (0, common_1.Post)('homepage/slides'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateHeroSlide", null);
__decorate([
    (0, common_1.Patch)('homepage/slides/reorder'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminReorderHeroSlides", null);
__decorate([
    (0, common_1.Patch)('homepage/slides/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateHeroSlide", null);
__decorate([
    (0, common_1.Delete)('homepage/slides/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteHeroSlide", null);
__decorate([
    (0, common_1.Get)('homepage/sections'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetHomepageSections", null);
__decorate([
    (0, common_1.Post)('homepage/sections/reorder'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminReorderHomepageSections", null);
__decorate([
    (0, common_1.Post)('homepage/sections/:key/toggle'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminToggleHomepageSection", null);
__decorate([
    (0, common_1.Post)('homepage/sections/:key'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpsertHomepageSection", null);
__decorate([
    (0, common_1.Get)('testimonials'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetTestimonials", null);
__decorate([
    (0, common_1.Post)('testimonials'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateTestimonial", null);
__decorate([
    (0, common_1.Patch)('testimonials/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateTestimonial", null);
__decorate([
    (0, common_1.Delete)('testimonials/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteTestimonial", null);
__decorate([
    (0, common_1.Get)('coupons'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCoupons", null);
__decorate([
    (0, common_1.Get)('coupons/:id/usages'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCouponUsages", null);
__decorate([
    (0, common_1.Post)('coupons'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateCoupon", null);
__decorate([
    (0, common_1.Patch)('coupons/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateCoupon", null);
__decorate([
    (0, common_1.Delete)('coupons/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteCoupon", null);
__decorate([
    (0, common_1.Get)('banners'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetBanners", null);
__decorate([
    (0, common_1.Post)('banners'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateBanner", null);
__decorate([
    (0, common_1.Patch)('banners/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateBanner", null);
__decorate([
    (0, common_1.Delete)('banners/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteBanner", null);
__decorate([
    (0, common_1.Get)('offers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetOffers", null);
__decorate([
    (0, common_1.Post)('offers'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreateOffer", null);
__decorate([
    (0, common_1.Patch)('offers/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateOffer", null);
__decorate([
    (0, common_1.Delete)('offers/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteOffer", null);
__decorate([
    (0, common_1.Get)('promotions'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetPromotions", null);
__decorate([
    (0, common_1.Post)('promotions'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminCreatePromotion", null);
__decorate([
    (0, common_1.Patch)('promotions/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdatePromotion", null);
__decorate([
    (0, common_1.Delete)('promotions/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeletePromotion", null);
__decorate([
    (0, common_1.Get)('newsletter/subscribers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetSubscribers", null);
__decorate([
    (0, common_1.Get)('newsletter/export'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "adminExportSubscribers", null);
__decorate([
    (0, common_1.Delete)('newsletter/subscribers/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteSubscriber", null);
__decorate([
    (0, common_1.Post)('newsletter/subscribers/bulk-delete'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminBulkDeleteSubscribers", null);
__decorate([
    (0, common_1.Get)('customers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('isBlocked')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCustomers", null);
__decorate([
    (0, common_1.Get)('customers/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetCustomer", null);
__decorate([
    (0, common_1.Patch)('customers/:id/toggle'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminToggleCustomer", null);
__decorate([
    (0, common_1.Get)('reviews'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('rating')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetReviews", null);
__decorate([
    (0, common_1.Patch)('reviews/:id/status'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminUpdateReviewStatus", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminDeleteReview", null);
__decorate([
    (0, common_1.Get)('inventory'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('stockStatus')),
    __param(4, (0, common_1.Query)('categoryId')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetInventory", null);
__decorate([
    (0, common_1.Post)('inventory/:productId/adjust'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminAdjustStock", null);
__decorate([
    (0, common_1.Get)('inventory/logs'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('from')),
    __param(5, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetInventoryLogs", null);
__decorate([
    (0, common_1.Get)('inventory/low-stock-full'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "adminGetFullLowStock", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map