"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const verifySchema = joi_1.default.object().keys({
    id: joi_1.default.number().required().id(),
    token: joi_1.default.string().token().required()
});
exports.verifySchema = verifySchema;
//# sourceMappingURL=verifySchema.js.map