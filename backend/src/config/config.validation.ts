import Joi from 'joi';
export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','test','production').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().default('15m'),
  JWT_REFRESH_TTL: Joi.string().default('30d'),
  CORS_ORIGINS: Joi.string().allow('').default(''),
});
