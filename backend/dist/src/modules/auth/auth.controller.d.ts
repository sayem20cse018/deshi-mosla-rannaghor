import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                name: string;
                email: string;
                phone: string;
                id: string;
                role: import(".prisma/client").$Enums.Role;
                avatar: string | null;
                createdAt: Date;
            };
            access_token: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                name: string;
                email: string;
                phone: string;
                role: import(".prisma/client").$Enums.Role;
                avatar: string | null;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
            };
            access_token: string;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        dev_otp?: string | undefined;
        dev_hint?: string | undefined;
        success: boolean;
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(userId: string): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            phone: string;
            id: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            _count: {
                addresses: number;
                orders: number;
                reviews: number;
            };
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
