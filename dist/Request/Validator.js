"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorFactory = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ allErrors: true, removeAdditional: true });
function validatorFactory(Schema) {
    const validate = ajv.compile(Schema);
    const verify = (data) => {
        const isValid = validate(data);
        if (isValid) {
            return data;
        }
        // const errors=validate.errors;
        // return errors
    };
    return { Schema, verify };
}
exports.validatorFactory = validatorFactory;
//# sourceMappingURL=Validator.js.map