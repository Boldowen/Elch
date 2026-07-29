var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let EmailDeliveryService = class EmailDeliveryService {
    config;
    testVerificationTokens = new Map();
    testPasswordResetTokens = new Map();
    constructor(config) {
        this.config = config;
    }
    async sendVerification(email, token) {
        if (this.config.get('NODE_ENV') === 'test') {
            this.testVerificationTokens.set(email, token);
            return;
        }
        const apiKey = this.config.get('RESEND_API_KEY');
        const from = this.config.get('EMAIL_FROM');
        const verificationUrl = this.config.get('EMAIL_VERIFICATION_URL');
        if (!apiKey || !from || !verificationUrl) {
            throw new ServiceUnavailableException('Email delivery is not configured');
        }
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from,
                to: [email],
                subject: 'Verify your VenTour email',
                html: `<p>Verify your VenTour email:</p><p><a href="${verificationUrl}?token=${encodeURIComponent(token)}">Verify email</a></p><p>This link expires in 30 minutes.</p>`,
            }),
        });
        if (!response.ok)
            throw new ServiceUnavailableException('Email delivery failed');
    }
    takeTestVerificationToken(email) {
        if (this.config.get('NODE_ENV') !== 'test')
            return undefined;
        const token = this.testVerificationTokens.get(email);
        this.testVerificationTokens.delete(email);
        return token;
    }
    async sendPasswordReset(email, token) {
        if (this.config.get('NODE_ENV') === 'test') {
            this.testPasswordResetTokens.set(email, token);
            return;
        }
        const resetUrl = this.config.get('PASSWORD_RESET_URL');
        if (!resetUrl)
            throw new ServiceUnavailableException('Email delivery is not configured');
        await this.send(email, 'Reset your VenTour password', `<p>Reset your VenTour password:</p><p><a href="${resetUrl}?token=${encodeURIComponent(token)}">Reset password</a></p><p>This link expires in 30 minutes.</p>`);
    }
    takeTestPasswordResetToken(email) {
        if (this.config.get('NODE_ENV') !== 'test')
            return undefined;
        const token = this.testPasswordResetTokens.get(email);
        this.testPasswordResetTokens.delete(email);
        return token;
    }
    async send(email, subject, html) {
        const apiKey = this.config.get('RESEND_API_KEY');
        const from = this.config.get('EMAIL_FROM');
        if (!apiKey || !from)
            throw new ServiceUnavailableException('Email delivery is not configured');
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to: [email], subject, html }),
        });
        if (!response.ok)
            throw new ServiceUnavailableException('Email delivery failed');
    }
};
EmailDeliveryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], EmailDeliveryService);
export { EmailDeliveryService };
//# sourceMappingURL=email-delivery.service.js.map