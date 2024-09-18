import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().default(4000),
  HOST: Joi.string().default('localhost'),

  DATABASE_TYPE: Joi.string().valid('postgres', 'mysql', 'mongodb').required(),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('60m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('30d'),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
