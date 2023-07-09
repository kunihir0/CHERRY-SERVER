"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const controllers = __importStar(require("../controllers"));
const utils_1 = require("../helpers/utils");
async function userRouter(fastify) {
    fastify.decorateRequest('authUser', '');
    fastify.route({
        method: 'POST',
        url: '/login',
        schema: schema_1.loginSchema,
        handler: controllers.login,
    });
    fastify.route({
        method: 'POST',
        url: '/signup',
        schema: schema_1.signupSchema,
        handler: controllers.signUp,
    });
    fastify.route({
        method: 'GET',
        url: '/all',
        handler: controllers.getAllUsers,
    });
    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: async (request, reply) => {
            const { id } = request.params;
            const user = await utils_1.prisma.user.findUnique({ where: { id: Number(id) } });
            if (!user) {
                reply.code(404).send({ message: 'User not found' });
                return;
            }
            reply.send(user);
        },
    });
}
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map