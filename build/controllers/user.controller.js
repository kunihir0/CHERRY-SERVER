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
exports.signUp = exports.authenticate = exports.getAllUsers = exports.login = void 0;
const utils_1 = require("../helpers/utils");
const errors_1 = require("../helpers/errors");
const JWT = __importStar(require("jsonwebtoken"));
const utils_2 = require("../helpers/utils");
const constants_1 = require("../helpers/constants");
const login = async (request, reply) => {
    console.log('login function called');
    try {
        const { email, password } = request.body;
        console.log('finding user');
        const user = await utils_1.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            console.log('user not found');
            reply.code(constants_1.ERROR400.statusCode).send(errors_1.ERRORS.userNotExists);
            return;
        }
        console.log('checking password');
        const checkPass = await utils_2.utils.compareHash(user.password, password);
        if (!checkPass) {
            console.log('password incorrect');
            reply.code(constants_1.ERROR400.statusCode).send(errors_1.ERRORS.userCredError);
            return;
        }
        console.log('generating token');
        const token = JWT.sign({
            id: user.id,
            email: user.email,
        }, process.env.APP_JWT_SECRET);
        console.log('sending response');
        reply.code(constants_1.STANDARD.SUCCESS).send({
            token,
            user,
        });
    }
    catch (err) {
        console.log('error occurred', err);
        (0, errors_1.handleServerError)(reply, err);
    }
};
exports.login = login;
const getAllUsers = async (request, reply) => {
    console.log('getAllUsers function called');
    try {
        const users = await utils_1.prisma.user.findMany();
        reply.code(constants_1.STANDARD.SUCCESS).send(users);
    }
    catch (err) {
        console.log('error occurred', err);
        (0, errors_1.handleServerError)(reply, err);
    }
};
exports.getAllUsers = getAllUsers;
const authenticate = async (request, reply, done) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.APP_JWT_SECRET);
        request.authUser = decoded;
        done();
    }
    catch (err) {
        reply.code(401).send({ message: 'Unauthorized' });
    }
};
exports.authenticate = authenticate;
const signUp = async (request, reply) => {
    console.log('signUp function called');
    try {
        const { email, password, firstName, lastName } = request.body;
        console.log('finding user');
        const user = await utils_1.prisma.user.findUnique({ where: { email: email } });
        if (user) {
            console.log('user already exists');
            reply.code(409).send(errors_1.ERRORS.userExists);
            return;
        }
        console.log('hashing password');
        const hashPass = await utils_2.utils.genSalt(10, password);
        console.log('creating user');
        const createUser = await utils_1.prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password: String(hashPass),
            },
        });
        console.log('generating token');
        const token = JWT.sign({
            id: createUser.id,
            email: createUser.email,
        }, process.env.APP_JWT_SECRET);
        delete createUser.password;
        console.log('sending response');
        reply.code(constants_1.STANDARD.SUCCESS).send({
            token,
            user: createUser,
        });
    }
    catch (err) {
        console.log('error occurred', err);
        (0, errors_1.handleServerError)(reply, err);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=user.controller.js.map