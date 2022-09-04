"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const LoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().min(6).alphanum().required()
});
exports.LoginSchema = LoginSchema;
//# sourceMappingURL=LoginSchema.js.map