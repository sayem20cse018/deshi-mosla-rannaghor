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
exports.CreateOrderDto = exports.SupportedPaymentMethod = exports.DeliveryAddressDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class DeliveryAddressDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fullName: { required: true, type: () => String, maxLength: 100 }, phone: { required: true, type: () => String, maxLength: 20 }, division: { required: true, type: () => String, maxLength: 50 }, district: { required: true, type: () => String, maxLength: 50 }, area: { required: true, type: () => String, maxLength: 100 }, fullAddress: { required: true, type: () => String, maxLength: 500 }, postalCode: { required: false, type: () => String, maxLength: 10 }, saveAddress: { required: false, type: () => Boolean } };
    }
}
exports.DeliveryAddressDto = DeliveryAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "fullAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], DeliveryAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeliveryAddressDto.prototype, "saveAddress", void 0);
var SupportedPaymentMethod;
(function (SupportedPaymentMethod) {
    SupportedPaymentMethod["CASH_ON_DELIVERY"] = "CASH_ON_DELIVERY";
    SupportedPaymentMethod["SSLCOMMERZ"] = "SSLCOMMERZ";
    SupportedPaymentMethod["BKASH"] = "BKASH";
    SupportedPaymentMethod["NAGAD"] = "NAGAD";
    SupportedPaymentMethod["ROCKET"] = "ROCKET";
    SupportedPaymentMethod["VISA"] = "VISA";
    SupportedPaymentMethod["MASTERCARD"] = "MASTERCARD";
    SupportedPaymentMethod["AMEX"] = "AMEX";
    SupportedPaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    SupportedPaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    SupportedPaymentMethod["INTERNET_BANKING"] = "INTERNET_BANKING";
    SupportedPaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(SupportedPaymentMethod || (exports.SupportedPaymentMethod = SupportedPaymentMethod = {}));
class CreateOrderDto {
    constructor() {
        this.paymentMethod = SupportedPaymentMethod.CASH_ON_DELIVERY;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { deliveryAddress: { required: true, type: () => require("./create-order.dto").DeliveryAddressDto }, deliveryNote: { required: false, type: () => String, maxLength: 500 }, couponCode: { required: false, type: () => String, maxLength: 50 }, paymentMethod: { required: false, default: SupportedPaymentMethod.CASH_ON_DELIVERY, enum: require("./create-order.dto").SupportedPaymentMethod } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: DeliveryAddressDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DeliveryAddressDto),
    __metadata("design:type", DeliveryAddressDto)
], CreateOrderDto.prototype, "deliveryAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'দ্রুত ডেলিভারি দিলে ভালো হয়' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'WELCOME10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "couponCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: SupportedPaymentMethod,
        default: SupportedPaymentMethod.CASH_ON_DELIVERY,
        description: 'Payment method. Online methods (SSLCOMMERZ/BKASH etc.) return a gatewayUrl for redirect.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SupportedPaymentMethod, { message: 'অবৈধ পেমেন্ট পদ্ধতি' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-order.dto.js.map