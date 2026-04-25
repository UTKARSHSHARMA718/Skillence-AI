import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),

  PORT: Joi.number().default(5000),

  FRONTEND_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  MAIL_FROM: Joi.string().email().required(),

  MAX_SESSION_COUNT: Joi.number().default(5),

  RATE_LIMIT_TTL: Joi.number().default(60000),
  RATE_LIMIT_COUNT: Joi.number().default(60),

  VAPI_PUBLIC_KEY: Joi.string().required(),

  OPENAI_API_KEY: Joi.string().required(),

  VAPI_WEB_HOOK_URL: Joi.string().uri().required(),
  VAPI_BACKEND_BASE_URL: Joi.string().uri().default('https://api.vapi.ai'),
  VAPI_WEBHOOK_AUTH_TOKEN: Joi.string().required(),
});