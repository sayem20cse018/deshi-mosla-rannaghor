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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const create_guest_order_dto_1 = require("./dto/create-guest-order.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
class CancelOrderDto {
}
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CancelOrderDto.prototype, "reason", void 0);
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    placeOrder(userId, dto) {
        return this.ordersService.placeOrder(userId, dto);
    }
    placeGuestOrder(dto) {
        return this.ordersService.placeGuestOrder(dto);
    }
    trackOrder(orderNumber, phone) {
        return this.ordersService.trackOrderByNumber(orderNumber, phone);
    }
    getDeliveryCharges() {
        return this.ordersService.getDeliveryCharges();
    }
    calculateCharge(district, amount) {
        return this.ordersService.calculateDeliveryCharge(district, Number(amount));
    }
    getOrder(userId, orderId) {
        return this.ordersService.getOrder(userId, orderId);
    }
    cancelOrder(userId, orderId, dto) {
        return this.ordersService.cancelOrder(userId, orderId, dto.reason);
    }
    requestReturn(userId, orderId, dto) {
        return this.ordersService.requestReturn(userId, orderId, dto.reason ?? 'Return requested by customer');
    }
    getInvoice(userId, orderId) {
        return this.ordersService.getInvoice(userId, orderId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Place a new order (requires login)' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "placeOrder", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('guest'),
    (0, swagger_1.ApiOperation)({ summary: 'Place a guest order without authentication' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_order_dto_1.CreateGuestOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "placeGuestOrder", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('track/:orderNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Track order by order number (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'phone', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('orderNumber')),
    __param(1, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "trackOrder", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('meta/delivery-charges'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all delivery charges by area' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getDeliveryCharges", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('meta/delivery-charge-calc'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate delivery charge for district + amount' }),
    (0, swagger_1.ApiQuery)({ name: 'district', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'amount', required: true, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('district')),
    __param(1, (0, common_1.Query)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "calculateCharge", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order detail by ID' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a PENDING order' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CancelOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)(':id/return'),
    (0, swagger_1.ApiOperation)({ summary: 'Request return on a delivered order' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CancelOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "requestReturn", null);
__decorate([
    (0, common_1.Get)(':id/invoice'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice data for an order' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getInvoice", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map