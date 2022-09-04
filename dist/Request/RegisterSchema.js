"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const RegisterSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().min(6).alphanum().required(),
    bio: joi_1.default.string().max(24).required()
});
exports.RegisterSchema = RegisterSchema;
//# sourceMappingURL=RegisterSchema.js.map