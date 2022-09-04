"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const updateUserSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().min(6).alphanum().required(),
    role: joi_1.default.string().valid('user', 'admin').required()
});
exports.updateUserSchema = updateUserSchema;
//# sourceMappingURL=updateUserSchema.js.map