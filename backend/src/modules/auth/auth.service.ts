import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Helper: generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ── Register ──────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });

    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? 'এই ইমেইল ইতিমধ্যে ব্যবহার হচ্ছে'
          : 'এই ফোন নম্বর ইতিমধ্যে ব্যবহার হচ্ছে',
      );
    }

    const rounds = this.config.get<number>('BCRYPT_ROUNDS', 12);
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

  // ── Login ─────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
    });

    if (!user) throw new UnauthorizedException('ইমেইল/ফোন বা পাসওয়ার্ড ভুল');
    if (!user.isActive) throw new UnauthorizedException('আপনার অ্যাকাউন্ট নিষ্ক্রিয়');
    if (user.isBlocked) throw new UnauthorizedException('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('ইমেইল/ফোন বা পাসওয়ার্ড ভুল');

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

  // ── Logout ────────────────────────────────────────────
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true, message: 'লগআউট সফল হয়েছে' };
  }

  // ── Get Me ────────────────────────────────────────────
  async getMe(userId: string) {
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
    if (!user) throw new UnauthorizedException('User not found');
    return { success: true, data: user };
  }

  // ── Validate for JWT strategy ─────────────────────────
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, avatar: true, isActive: true, isBlocked: true,
      },
    });
    if (!user || !user.isActive || user.isBlocked) return null;
    return user;
  }

  // ── Forgot Password — send OTP ────────────────────────
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
        isActive: true,
        isBlocked: false,
      },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return {
        success: true,
        message: 'OTP পাঠানো হয়েছে (যদি অ্যাকাউন্ট থাকে)',
      };
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // In production: send via SMS/Email
    // For development: return OTP in response
    const isDev = this.config.get('NODE_ENV') !== 'production';

    return {
      success: true,
      message: `OTP পাঠানো হয়েছে${isDev ? ' (dev mode)' : ''}`,
      ...(isDev && { dev_otp: otp, dev_hint: 'OTP only shown in development mode' }),
    };
  }

  // ── Verify OTP ────────────────────────────────────────
  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
    });

    if (!user) throw new BadRequestException('অ্যাকাউন্ট পাওয়া যায়নি');
    if (!user.otp || !user.otpExpiry) throw new BadRequestException('OTP পাঠানো হয়নি');
    if (new Date() > user.otpExpiry) throw new BadRequestException('OTP মেয়াদ শেষ হয়ে গেছে');
    if (user.otp !== dto.otp) throw new BadRequestException('OTP ভুল হয়েছে');

    return { success: true, message: 'OTP সঠিক' };
  }

  // ── Reset Password ────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] },
    });

    if (!user) throw new BadRequestException('অ্যাকাউন্ট পাওয়া যায়নি');
    if (!user.otp || !user.otpExpiry) throw new BadRequestException('OTP পাঠানো হয়নি');
    if (new Date() > user.otpExpiry) throw new BadRequestException('OTP মেয়াদ শেষ হয়ে গেছে');
    if (user.otp !== dto.otp) throw new BadRequestException('OTP ভুল হয়েছে');

    const rounds = this.config.get<number>('BCRYPT_ROUNDS', 12);
    const hashedPassword = await bcrypt.hash(dto.newPassword, rounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, otp: null, otpExpiry: null },
    });

    return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' };
  }

  // ── Sign JWT ─────────────────────────────────────────
  private signToken(userId: string, email: string, role: string): string {
    return this.jwt.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '7d'),
      },
    );
  }
}
