"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./helpers/utils");
const fastify_1 = __importDefault(require("fastify"));
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("./config"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const config = (0, config_1.default)();
const startServer = async () => {
    try {
        const server = (0, fastify_1.default)({
            logger: (0, pino_1.default)({ level: 'info' }),
        });
        server.setErrorHandler((error, request, reply) => {
            server.log.error(error);
        });
        server.get('/', (request, reply) => {
            reply.send({ name: 'CHERRY SERVER' });
        });
        server.get('/health-check', async (request, reply) => {
            try {
                await utils_1.utils.healthCheck();
                reply.status(200).send();
            }
            catch (e) {
                reply.status(500).send();
            }
        });
        server.register(user_router_1.default, { prefix: '/api/user' });
        if (config.NODE_ENV === 'production') {
            for (const signal of ['SIGINT', 'SIGTERM']) {
                process.on(signal, () => server.close().then((err) => {
                    console.log(`close application on ${signal}`);
                    process.exit(err ? 1 : 0);
                }));
            }
        }
        await server.listen(config.API_PORT);
    }
    catch (e) {
        console.error(e);
    }
};
process.on('unhandledRejection', (e) => {
    console.error(e);
    process.exit(1);
});
startServer();
//# sourceMappingURL=index.js.map