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
exports.ResetPasswordDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ResetPasswordDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { identifier: { required: true, type: () => String }, otp: { required: true, type: () => String, minLength: 6, maxLength: 6 }, newPassword: { required: true, type: () => String, minLength: 8 } };
    }
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rahim@example.com' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP অবশ্যই ৬ সংখ্যার হতে হবে' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NewPass@123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=reset-password.dto.js.map