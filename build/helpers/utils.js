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
exports.utils = exports.prisma = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.utils = {
    isJSON: (data) => {
        try {
            JSON.parse(data);
        }
        catch (e) {
            return false;
        }
        return true;
    },
    getTime: () => {
        const date = new Date();
        const time = date.getTime();
        return time;
    },
    genSalt: (saltRounds, value) => {
        return new Promise((resolve, reject) => {
            const salt = bcrypt.genSaltSync(saltRounds);
            bcrypt.hash(value, salt, (err, hash) => {
                if (err)
                    reject(err);
                resolve(hash);
            });
        });
    },
    compareHash: (hash, value) => {
        return new Promise((resolve, reject) => {
            console.log('comparing password:', value, 'with hash:', hash);
            bcrypt.compare(value, hash, (err, result) => {
                if (err)
                    reject(err);
                console.log('compare result:', result);
                resolve(result);
            });
        });
    },
    healthCheck: () => {
        return new Promise((resolve, reject) => {
            exports.prisma
                .$queryRaw `SELECT 1`
                .then(() => {
                resolve();
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
};
//# sourceMappingURL=utils.js.map