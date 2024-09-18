import { config } from 'dotenv';

import { envSchema } from './env.schema';

// Load environment variables from the .env file
config();

// Validate environment variables using the schema
const { error, value: validatedEnv } = envSchema.validate(process.env, {
  allowUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = validatedEnv;
