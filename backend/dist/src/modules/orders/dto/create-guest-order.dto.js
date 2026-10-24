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
exports.CreateGuestOrderDto = exports.GuestOrderItemDto = exports.GuestDeliveryAddressDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./create-order.dto");
class GuestDeliveryAddressDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fullName: { required: true, type: () => String, maxLength: 100 }, phone: { required: true, type: () => String, maxLength: 20 }, email: { required: false, type: () => String, maxLength: 100 }, division: { required: true, type: () => String, maxLength: 50 }, district: { required: true, type: () => String, maxLength: 50 }, area: { required: true, type: () => String, maxLength: 100 }, fullAddress: { required: true, type: () => String, maxLength: 500 }, postalCode: { required: false, type: () => String, maxLength: 10 } };
    }
}
exports.GuestDeliveryAddressDto = GuestDeliveryAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "fullAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], GuestDeliveryAddressDto.prototype, "postalCode", void 0);
class GuestOrderItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 } };
    }
}
exports.GuestOrderItemDto = GuestOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GuestOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GuestOrderItemDto.prototype, "quantity", void 0);
class CreateGuestOrderDto {
    constructor() {
        this.paymentMethod = create_order_dto_1.SupportedPaymentMethod.CASH_ON_DELIVERY;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [require("./create-guest-order.dto").GuestOrderItemDto] }, deliveryAddress: { required: true, type: () => require("./create-guest-order.dto").GuestDeliveryAddressDto }, deliveryNote: { required: false, type: () => String, maxLength: 500 }, couponCode: { required: false, type: () => String, maxLength: 50 }, paymentMethod: { required: false, default: create_order_dto_1.SupportedPaymentMethod.CASH_ON_DELIVERY, enum: require("./create-order.dto").SupportedPaymentMethod } };
    }
}
exports.CreateGuestOrderDto = CreateGuestOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GuestOrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => GuestOrderItemDto),
    __metadata("design:type", Array)
], CreateGuestOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GuestDeliveryAddressDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GuestDeliveryAddressDto),
    __metadata("design:type", GuestDeliveryAddressDto)
], CreateGuestOrderDto.prototype, "deliveryAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "deliveryNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "couponCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: create_order_dto_1.SupportedPaymentMethod,
        default: create_order_dto_1.SupportedPaymentMethod.CASH_ON_DELIVERY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_order_dto_1.SupportedPaymentMethod, { message: 'Invalid payment method' }),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-guest-order.dto.js.map