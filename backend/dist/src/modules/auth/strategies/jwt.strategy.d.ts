import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        name: string;
        email: string;
        phone: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        isActive: boolean;
        isBlocked: boolean;
    }>;
}
export {};
