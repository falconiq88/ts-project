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
exports.SendVerification = exports.Verify = exports.changePassword = exports.Login = exports.Register = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RegisterSchema_1 = require("../Request/RegisterSchema");
const LoginSchema_1 = require("../Request/LoginSchema");
const verifySchema_1 = require("../Request/verifySchema");
const email_1 = __importDefault(require("../mailService/email"));
const crypto_1 = __importDefault(require("crypto"));
//For Register Page
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const { body } = req;
        const result = RegisterSchema_1.RegisterSchema.validate(body);
        const { value, error } = result;
        const valid = error == null;
        if (!valid) {
            return res.status(422).json(error['details']);
        }
        //end validation
        const alreadyExist = yield prisma.user.findFirst({ where: { email: value['email'] } }).catch(err => { return res.send(err); });
        if (alreadyExist) {
            return res.json({ message: "User already exist" });
        }
        // hashing password
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hashSync(value['password'], salt);
        //create user
        yield prisma.user.create({
            data: {
                name: value['name'],
                email: value['email'],
                password: hashedPassword,
                profile: {
                    create: {
                        bio: value['bio']
                    }
                }
            },
        }).catch(() => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            return res.json({ message: 'error try again later' });
        })).then(() => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            return res.json({ message: 'user has been registered' });
        }));
    });
}
exports.Register = Register;
// For Login
function Login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const { body } = req;
        const result = yield LoginSchema_1.LoginSchema.validate(body);
        const { value, error } = yield result;
        const valid = error == null;
        if (!valid) {
            return res.status(422).json(error['details']);
        }
        //end validation
        yield prisma.user.findFirstOrThrow({ where: { email: value['email'] } }).catch((err) => {
            return next(err);
        })
            .then((User) => __awaiter(this, void 0, void 0, function* () {
            const cmp = yield bcryptjs_1.default.compare(value['password'], User.password);
            console.log(cmp);
            if (!cmp) {
                return res.json("Wrong username or password.");
            }
            const jwtToken = yield jsonwebtoken_1.default.sign({ id: User.id, email: User.email }, process.env.JWT_SECRET, {
                expiresIn: '24h' // expires in 1 day
            });
            res.json({ message: "Welcome Back!", token: "Bearer " + jwtToken });
        }));
    });
}
exports.Login = Login;
// change password for authenticated user
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { oldPassword, newPassword } = req.body;
        const cmp = yield bcryptjs_1.default.compare(oldPassword, req.user.password);
        if (cmp) {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hashedPassword = bcryptjs_1.default.hashSync(newPassword, salt);
            yield prisma.user.update({ where: { id: req.user.id }, data: { password: hashedPassword } }).catch((err) => {
                return res.status(500).json({ message: "error :" + err });
            });
            return res.status(200).json({ message: "Success" });
        }
        return res.json({ message: "The old password not correct" });
    });
}
exports.changePassword = changePassword;
// send verificatin link to user email
function SendVerification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate exipration time for verification token
        const now = new Date();
        now.setMinutes(20 + now.getMinutes());
        const tokenExpiration = now;
        // update or create token
        const token = yield prisma.token.upsert({
            where: {
                userId: req.user.id
            },
            update: {
                token: crypto_1.default.randomBytes(32).toString("hex"),
                expiresAt: tokenExpiration
            },
            create: {
                userId: req.user.id,
                token: crypto_1.default.randomBytes(32).toString("hex"),
                expiresAt: tokenExpiration
            }
        }).catch((err) => {
            return res.json({ message: err });
        });
        const VerificationUrl = `${process.env.BASE_URL}/api/v1/user/verify/${req.user.id}/${token.token}`;
        yield (0, email_1.default)(req.user.email, "Verify Email", VerificationUrl, req.user.name);
        return res.send("An Email sent to your account please verify");
    });
}
exports.SendVerification = SendVerification;
function Verify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const { params } = req;
        const result = verifySchema_1.verifySchema.validate(params);
        const { value, error } = result;
        const valid = error == null;
        if (!valid) {
            return res.status(422).json(error['details']);
        }
        //end validation
        const id = value['id'];
        const token = value['token'];
        const User = yield prisma.user.findFirst({ where: { id: id }, include: {
                token: true,
            }, });
        if (checkTokenexist(req, res, User, token) == true) {
            const dateNow = new Date(Date.now());
            yield prisma.user.update({ where: {
                    id: User.id,
                },
                data: {
                    verified_at: dateNow
                } }).catch(err => { return res.send(err); });
            yield prisma.token.delete({ where: { id: User.token.id } }).catch((err) => {
                return res.json({ message: err });
            });
            return res.json({ message: "user has been verified" });
        }
    });
}
exports.Verify = Verify;
// function to validate user and token if its expired
function checkTokenexist(req, res, User, token) {
    //
    if (User && User.token) {
        //convert date expiresAt to mileSeconds
        const date = new Date(User.token.expiresAt);
        const dateseconds = date.getTime();
        // checking user token if its valid
        if (User.token.token == token && dateseconds > Date.now()) {
            return true;
        }
        else {
            return res.json({ message: "invalid credantials" });
        }
    }
    else {
        return res.json({ message: "not found" });
    }
}
//# sourceMappingURL=AuthController.js.map