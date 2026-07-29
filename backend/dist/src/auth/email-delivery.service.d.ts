import { ConfigService } from '@nestjs/config';
export declare class EmailDeliveryService {
    private readonly config;
    private readonly testVerificationTokens;
    private readonly testPasswordResetTokens;
    constructor(config: ConfigService);
    sendVerification(email: string, token: string): Promise<void>;
    takeTestVerificationToken(email: string): string | undefined;
    sendPasswordReset(email: string, token: string): Promise<void>;
    takeTestPasswordResetToken(email: string): string | undefined;
    private send;
}
