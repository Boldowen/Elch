import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RequestUser } from '../common/decorators/current-user.decorator.js';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto, ua: string, ip: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            avatarUrl: string | null;
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
        };
    }>;
    logout(dto: RefreshDto): Promise<{
        success: boolean;
    }>;
    logoutAll(user: RequestUser): Promise<{
        success: boolean;
    }>;
}
