import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { EmailDeliveryService } from './email-delivery.service.js';
@Module({ imports: [PassportModule, JwtModule.register({})], controllers: [AuthController], providers: [AuthService, EmailDeliveryService, JwtStrategy], exports: [AuthService] })
export class AuthModule {}
