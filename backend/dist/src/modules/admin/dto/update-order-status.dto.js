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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderStatusDto = exports.AdminOrderStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AdminOrderStatus;
(function (AdminOrderStatus) {
    AdminOrderStatus["PENDING"] = "PENDING";
    AdminOrderStatus["CONFIRMED"] = "CONFIRMED";
    AdminOrderStatus["PROCESSING"] = "PROCESSING";
    AdminOrderStatus["PACKED"] = "PACKED";
    AdminOrderStatus["SHIPPED"] = "SHIPPED";
    AdminOrderStatus["DELIVERED"] = "DELIVERED";
    AdminOrderStatus["CANCELLED"] = "CANCELLED";
    AdminOrderStatus["RETURNED"] = "RETURNED";
    AdminOrderStatus["REFUNDED"] = "REFUNDED";
})(AdminOrderStatus || (exports.AdminOrderStatus = AdminOrderStatus = {}));
class UpdateOrderStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: require("./update-order-status.dto").AdminOrderStatus }, note: { required: false, type: () => String, maxLength: 500 }, courierName: { required: false, type: () => String, maxLength: 100 }, trackingNumber: { required: false, type: () => String, maxLength: 100 } };
    }
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AdminOrderStatus }),
    (0, class_validator_1.IsEnum)(AdminOrderStatus),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Courier: Pathao, Tracking: PT12345' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pathao' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "courierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PT123456789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "trackingNumber", void 0);
//# sourceMappingURL=update-order-status.dto.js.map