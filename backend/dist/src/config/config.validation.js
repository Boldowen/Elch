import Joi from 'joi';
export const configValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_ACCESS_TTL: Joi.string().default('15m'),
    JWT_REFRESH_TTL: Joi.string().default('30d'),
    CORS_ORIGINS: Joi.string().allow('').default(''),
    EMAIL_VERIFICATION_URL: Joi.string().uri().default('ventour://verify-email'),
    EMAIL_FROM: Joi.string().email().allow('').default(''),
    RESEND_API_KEY: Joi.string().allow('').default(''),
    EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS: Joi.number().integer().min(1).default(60),
    PASSWORD_RESET_URL: Joi.string().uri().default('ventour://reset-password'),
    PASSWORD_RESET_COOLDOWN_SECONDS: Joi.number().integer().min(1).default(60),
});
//# sourceMappingURL=config.validation.js.map