"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const forgot_password_1 = __importDefault(require("../mailService/forgot-password"));
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                email: email
            }
        }).catch(err => { return res.send(err); });
        //generate 9 digit number for reset password token
        const token = Math.random().toString().slice(2, 11);
        // Generate exipration time for forgot password
        const now = new Date();
        now.setMinutes(5 + now.getMinutes());
        const tokenExpiration = now;
        // update or create
        yield prisma.forgot_password.upsert({
            where: {
                email: email,
            },
            update: {
                token: token,
                expiresAt: tokenExpiration
            },
            create: {
                email: email,
                token: token,
                expiresAt: tokenExpiration
            }
        }).catch((err) => {
            return res.json({ message: err });
        });
        yield (0, forgot_password_1.default)(user.email, "Forgot Password", user.name, token);
        res.send("An Email sent to your email account");
    });
}
exports.forgotPassword = forgotPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const forgot = yield prisma.forgot_password.findFirstOrThrow({ where: { token: token } })
            .catch((err) => {
            return res.json({ message: err });
        });
        //convert date expiresAt to mileSeconds
        const date = new Date(forgot.expiresAt);
        const dateseconds = date.getTime();
        if (dateseconds > Date.now()) {
            return res.json({ message: "success" });
        }
        else {
            return res.json({ message: "your code has been expired" });
        }
    });
}
exports.resetPassword = resetPassword;
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, Newpassword } = req.body;
        const forgot = yield prisma.forgot_password.findFirstOrThrow({ where: { token: token } })
            .catch((err) => {
            return res.json({ message: err });
        });
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(Newpassword, salt);
        yield prisma.user.update({ where: {
                email: forgot.email
            },
            data: {
                password: hashedPassword
            } });
        res.json({ message: "Your password has been reset successfuly" });
    });
}
exports.updatePassword = updatePassword;
//# sourceMappingURL=NewPasswordController.js.map