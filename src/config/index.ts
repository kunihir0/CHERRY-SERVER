import path from 'path';
import { envSchema, JSONSchemaType } from 'env-schema';

interface Config {
  NODE_ENV: 'development' | 'testing' | 'production';
  API_HOST: string;
  API_PORT: string;
  DATABASE_URL: string;
}

const configSchema: JSONSchemaType<Config> = {
  type: 'object',
  required: ['NODE_ENV', 'API_HOST', 'API_PORT', 'DATABASE_URL'],
  properties: {
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'testing', 'production'],
    },
    API_HOST: { type: 'string' },
    API_PORT: { type: 'string' },
    DATABASE_URL: { type: 'string' },
  },
};

export default function loadConfig(): Config {
  const result = require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env'),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  const config = envSchema<Config>({
    data: result.parsed,
    schema: configSchema,
  });

  return config;
}
