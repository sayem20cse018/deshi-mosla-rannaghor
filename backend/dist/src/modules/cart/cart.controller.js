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
exports.CartController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCount(userId) {
        return this.cartService.getItemCount(userId);
    }
    getCart(userId) {
        return this.cartService.getCart(userId);
    }
    addItem(userId, dto) {
        return this.cartService.addItem(userId, dto);
    }
    updateItem(userId, productId, dto) {
        return this.cartService.updateItem(userId, productId, dto.quantity);
    }
    removeItem(userId, productId) {
        return this.cartService.removeItem(userId, productId);
    }
    clearCart(userId) {
        return this.cartService.clearCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart item count (lightweight)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user cart' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_to_cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('item/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('item/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire cart' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map