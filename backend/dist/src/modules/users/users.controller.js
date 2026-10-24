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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const address_dto_1 = require("./dto/address.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(userId) {
        return this.usersService.getProfile(userId);
    }
    updateProfile(userId, dto) {
        return this.usersService.updateProfile(userId, dto);
    }
    changePassword(userId, dto) {
        return this.usersService.changePassword(userId, dto);
    }
    getOrders(userId, page, limit, status) {
        return this.usersService.getMyOrders(userId, page, limit, status);
    }
    getOrderDetail(userId, orderId) {
        return this.usersService.getOrderDetail(userId, orderId);
    }
    getAddresses(userId) {
        return this.usersService.getAddresses(userId);
    }
    createAddress(userId, dto) {
        return this.usersService.createAddress(userId, dto);
    }
    updateAddress(userId, addressId, dto) {
        return this.usersService.updateAddress(userId, addressId, dto);
    }
    deleteAddress(userId, addressId) {
        return this.usersService.deleteAddress(userId, addressId);
    }
    setDefault(userId, addressId) {
        return this.usersService.setDefaultAddress(userId, addressId);
    }
    paymentHistory(userId) {
        return this.usersService.getPaymentHistory(userId);
    }
    reviews(userId) {
        return this.usersService.getMyReviews(userId);
    }
    coupons(userId) {
        return this.usersService.getMyCoupons(userId);
    }
    getWishlist(userId) {
        return this.usersService.getWishlist(userId);
    }
    addToWishlist(userId, productId) {
        return this.usersService.addToWishlist(userId, productId);
    }
    removeFromWishlist(userId, productId) {
        return this.usersService.removeFromWishlist(userId, productId);
    }
    clearWishlist(userId) {
        return this.usersService.clearWishlist(userId);
    }
    checkWishlist(userId, productId) {
        return this.usersService.isInWishlist(userId, productId);
    }
    notifications(userId, unread) {
        return this.usersService.getNotifications(userId, unread === 'true');
    }
    markRead(userId) {
        return this.usersService.markNotificationsRead(userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my profile' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update my profile' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('me/change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change my password' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('me/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'My order history' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('me/orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'My order detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Get)('me/addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'My saved addresses' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Post)('me/addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add new address' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Put)('me/addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update address' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('me/addresses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete address' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.Patch)('me/addresses/:id/default'),
    (0, swagger_1.ApiOperation)({ summary: 'Set address as default' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Get)('me/payment-history'),
    (0, swagger_1.ApiOperation)({ summary: 'My payment history' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "paymentHistory", null);
__decorate([
    (0, common_1.Get)('me/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'My reviews' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "reviews", null);
__decorate([
    (0, common_1.Get)('me/coupons'),
    (0, swagger_1.ApiOperation)({ summary: 'My used coupons' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "coupons", null);
__decorate([
    (0, common_1.Get)('me/wishlist'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my wishlist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Post)('me/wishlist/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to wishlist' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)('me/wishlist/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from wishlist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Delete)('me/wishlist'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire wishlist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "clearWishlist", null);
__decorate([
    (0, common_1.Get)('me/wishlist/check/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if product is in wishlist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "checkWishlist", null);
__decorate([
    (0, common_1.Get)('me/notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'My notifications' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('unread')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "notifications", null);
__decorate([
    (0, common_1.Post)('me/notifications/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "markRead", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users / Account'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map