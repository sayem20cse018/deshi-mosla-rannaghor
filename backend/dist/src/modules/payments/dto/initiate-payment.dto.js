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
exports.InitiatePaymentDto = exports.OnlinePaymentMethod = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var OnlinePaymentMethod;
(function (OnlinePaymentMethod) {
    OnlinePaymentMethod["SSLCOMMERZ"] = "SSLCOMMERZ";
    OnlinePaymentMethod["BKASH"] = "BKASH";
    OnlinePaymentMethod["NAGAD"] = "NAGAD";
    OnlinePaymentMethod["ROCKET"] = "ROCKET";
    OnlinePaymentMethod["VISA"] = "VISA";
    OnlinePaymentMethod["MASTERCARD"] = "MASTERCARD";
    OnlinePaymentMethod["AMEX"] = "AMEX";
    OnlinePaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    OnlinePaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
})(OnlinePaymentMethod || (exports.OnlinePaymentMethod = OnlinePaymentMethod = {}));
class InitiatePaymentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { orderId: { required: true, type: () => String }, paymentMethod: { required: true, enum: require("./initiate-payment.dto").OnlinePaymentMethod }, customerName: { required: false, type: () => String, maxLength: 200 }, customerEmail: { required: false, type: () => String, maxLength: 255 }, customerPhone: { required: false, type: () => String, maxLength: 20 }, customerAddress: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.InitiatePaymentDto = InitiatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID to pay for' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OnlinePaymentMethod }),
    (0, class_validator_1.IsEnum)(OnlinePaymentMethod),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "customerAddress", void 0);
//# sourceMappingURL=initiate-payment.dto.js.map