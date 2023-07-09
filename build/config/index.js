"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const env_schema_1 = require("env-schema");
const configSchema = {
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
function loadConfig() {
    const result = require('dotenv').config({
        path: path_1.default.join(__dirname, '..', '..', '.env'),
    });
    if (result.error) {
        throw new Error(result.error);
    }
    const config = (0, env_schema_1.envSchema)({
        data: result.parsed,
        schema: configSchema,
    });
    return config;
}
exports.default = loadConfig;
//# sourceMappingURL=index.js.map