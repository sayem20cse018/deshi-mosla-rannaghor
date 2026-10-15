"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../../common/prisma/prisma.service");
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
        });
        if (existing) {
            throw new common_1.ConflictException(existing.email === dto.email
                ? 'এই ইমেইল ইতিমধ্যে ব্যবহার হচ্ছে'
                : 'এই ফোন নম্বর ইতিমধ্যে ব্যবহার হচ্ছে');
        }
        const rounds = this.config.get('BCRYPT_ROUNDS', 12);
        const hashedPassword = await bcrypt.hash(dto.password, rounds);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                password: hashedPassword,
                cart: { create: {} },
            },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, avatar: true, createdAt: true,
            },
        });
        const token = this.signToken(user.id, user.email, user.role);
        return {
            success: true,
            message: 'নিবন্ধন সফল হয়েছে',
            data: { user, access_token: token },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
        });
        if (!user)
            throw new common_1.UnauthorizedException('ইমেইল/ফোন বা পাসওয়ার্ড ভুল');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('আপনার অ্যাকাউন্ট নিষ্ক্রিয়');
        if (user.isBlocked)
            throw new common_1.UnauthorizedException('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে');
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('ইমেইল/ফোন বা পাসওয়ার্ড ভুল');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const token = this.signToken(user.id, user.email, user.role);
        return {
            success: true,
            message: 'লগইন সফল হয়েছে',
            data: {
                user: {
                    id: user.id, name: user.name, email: user.email,
                    phone: user.phone, role: user.role, avatar: user.avatar,
                    isEmailVerified: user.isEmailVerified,
                    isPhoneVerified: user.isPhoneVerified,
                },
                access_token: token,
            },
        };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { success: true, message: 'লগআউট সফল হয়েছে' };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, avatar: true, gender: true, dateOfBirth: true,
                isEmailVerified: true, isPhoneVerified: true,
                isActive: true, lastLoginAt: true, createdAt: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                        addresses: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return { success: true, data: user };
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, avatar: true, isActive: true, isBlocked: true,
            },
        });
        if (!user || !user.isActive || user.isBlocked)
            return null;
        return user;
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.identifier }, { phone: dto.identifier }],
                isActive: true,
                isBlocked: false,
            },
        });
        if (!user) {
            return {
                success: true,
                message: 'OTP পাঠানো হয়েছে (যদি অ্যাকাউন্ট থাকে)',
            };
        }
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpiry },
        });
        const isDev = this.config.get('NODE_ENV') !== 'production';
        return {
            success: true,
            message: `OTP পাঠানো হয়েছে${isDev ? ' (dev mode)' : ''}`,
            ...(isDev && { dev_otp: otp, dev_hint: 'OTP only shown in development mode' }),
        };
    }
    async verifyOtp(dto) {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
        });
        if (!user)
            throw new common_1.BadRequestException('অ্যাকাউন্ট পাওয়া যায়নি');
        if (!user.otp || !user.otpExpiry)
            throw new common_1.BadRequestException('OTP পাঠানো হয়নি');
        if (new Date() > user.otpExpiry)
            throw new common_1.BadRequestException('OTP মেয়াদ শেষ হয়ে গেছে');
        if (user.otp !== dto.otp)
            throw new common_1.BadRequestException('OTP ভুল হয়েছে');
        return { success: true, message: 'OTP সঠিক' };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
        });
        if (!user)
            throw new common_1.BadRequestException('অ্যাকাউন্ট পাওয়া যায়নি');
        if (!user.otp || !user.otpExpiry)
            throw new common_1.BadRequestException('OTP পাঠানো হয়নি');
        if (new Date() > user.otpExpiry)
            throw new common_1.BadRequestException('OTP মেয়াদ শেষ হয়ে গেছে');
        if (user.otp !== dto.otp)
            throw new common_1.BadRequestException('OTP ভুল হয়েছে');
        const rounds = this.config.get('BCRYPT_ROUNDS', 12);
        const hashedPassword = await bcrypt.hash(dto.newPassword, rounds);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, otp: null, otpExpiry: null },
        });
        return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' };
    }
    signToken(userId, email, role) {
        return this.jwt.sign({ sub: userId, email, role }, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map