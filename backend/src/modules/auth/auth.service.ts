import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

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
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.signToken(user.id, user.email, user.role);

    return {
      success: true,
      message: 'নিবন্ধন সফল হয়েছে',
      data: { user, access_token: token },
    };
  }

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
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        access_token: token,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true, message: 'লগআউট সফল হয়েছে' };
  }

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
