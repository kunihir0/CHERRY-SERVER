import path from 'path';
import { envSchema, JSONSchemaType } from 'env-schema';

interface Config {
  NODE_ENV: 'development' | 'testing' | 'production';
  API_HOST: string;
  API_PORT: string;
  DATABASE_URL_MONGOD: string;
}

const configSchema: JSONSchemaType<Config> = {
  type: 'object',
  required: ['NODE_ENV', 'API_HOST', 'API_PORT', 'DATABASE_URL_MONGOD'],
  properties: {
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'testing', 'production'],
    },
    API_HOST: { type: 'string' },
    API_PORT: { type: 'string' },
    DATABASE_URL_MONGOD: { type: 'string' },
  },
};

class ConfigLoader {
  private config: Config;

  constructor() {
    const result = require('dotenv').config({
      path: path.join(__dirname, '..', '..', '.env'),
    });

    if (result.error) {
      throw new Error(result.error);
    }

    this.config = envSchema<Config>({
      data: result.parsed,
      schema: configSchema,
    });
  }

  public getConfig(): Config {
    return this.config;
  }
}

const configLoader = new ConfigLoader();
export default configLoader.getConfig.bind(configLoader);
