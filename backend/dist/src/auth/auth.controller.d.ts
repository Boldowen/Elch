import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { type RequestUser } from '../common/decorators/current-user.decorator.js';
import { ResendVerificationDto, VerifyEmailDto } from './dto/verify-email.dto.js';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/password-recovery.dto.js';
import { SocialLoginDto } from './dto/social-login.dto.js';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, ua: string, ip: string): Promise<{
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
    login(dto: LoginDto, ua: string, ip: string): Promise<{
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
    socialLogin(dto: SocialLoginDto, ua: string, ip: string): Promise<{
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
    refresh(dto: RefreshDto, ua: string, ip: string): Promise<{
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
    logout(dto: RefreshDto): Promise<{
        success: boolean;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        success: boolean;
        emailVerifiedAt: Date;
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        success: boolean;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    changePassword(user: RequestUser, dto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
    logoutAll(user: RequestUser): Promise<{
        success: boolean;
    }>;
}
