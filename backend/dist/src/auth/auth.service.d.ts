import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { EmailDeliveryService } from './email-delivery.service.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly emailDelivery;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, emailDelivery: EmailDeliveryService);
    register(dto: RegisterDto, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
        verificationEmailSent: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            avatarUrl: string | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    verifyEmail(token: string): Promise<{
        success: boolean;
        emailVerifiedAt: Date;
    }>;
    resendVerification(email: string): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    login(dto: LoginDto, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            avatarUrl: string | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    refresh(refreshToken: string, meta: {
        userAgent?: string;
        ip?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            avatarUrl: string | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
    }>;
    private issueSession;
    private createAndSendVerification;
    private hashToken;
    private ensureAccountActive;
}
