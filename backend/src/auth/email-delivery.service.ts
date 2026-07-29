import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailDeliveryService {
  private readonly testVerificationTokens = new Map<string, string>();
  private readonly testPasswordResetTokens = new Map<string, string>();

  constructor(private readonly config: ConfigService) {}

  async sendVerification(email: string, token: string) {
    if (this.config.get('NODE_ENV') === 'test') {
      this.testVerificationTokens.set(email, token);
      return;
    }
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    const verificationUrl = this.config.get<string>('EMAIL_VERIFICATION_URL');
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
    if (!response.ok) throw new ServiceUnavailableException('Email delivery failed');
  }

  takeTestVerificationToken(email: string) {
    if (this.config.get('NODE_ENV') !== 'test') return undefined;
    const token = this.testVerificationTokens.get(email);
    this.testVerificationTokens.delete(email);
    return token;
  }

  async sendPasswordReset(email: string, token: string) {
    if (this.config.get('NODE_ENV') === 'test') {
      this.testPasswordResetTokens.set(email, token);
      return;
    }
    const resetUrl = this.config.get<string>('PASSWORD_RESET_URL');
    if (!resetUrl) throw new ServiceUnavailableException('Email delivery is not configured');
    await this.send(email, 'Reset your VenTour password', `<p>Reset your VenTour password:</p><p><a href="${resetUrl}?token=${encodeURIComponent(token)}">Reset password</a></p><p>This link expires in 30 minutes.</p>`);
  }

  takeTestPasswordResetToken(email: string) {
    if (this.config.get('NODE_ENV') !== 'test') return undefined;
    const token = this.testPasswordResetTokens.get(email);
    this.testPasswordResetTokens.delete(email);
    return token;
  }

  private async send(email: string, subject: string, html: string) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    if (!apiKey || !from) throw new ServiceUnavailableException('Email delivery is not configured');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject, html }),
    });
    if (!response.ok) throw new ServiceUnavailableException('Email delivery failed');
  }
}
