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
exports.deleteUser = exports.updateUser = exports.getUser = exports.allUsers = exports.AddNewUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const RegisterSchema_1 = require("../Request/RegisterSchema");
const updateUserSchema_1 = require("../Request/updateUserSchema");
// add new user 
function AddNewUser(req, res) {
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
        const alreadyExist = yield prisma.user.findFirst({ where: { email: value["email"] } }).catch(err => { return res.send("error is :" + err); });
        if (alreadyExist) {
            return res.json({ message: "User already exist" });
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(value['password'], salt);
        const dateNow = new Date(Date.now());
        yield prisma.user.create({
            data: {
                name: value['name'],
                email: value['email'],
                password: hashedPassword,
                verified_at: dateNow,
                profile: {
                    create: {
                        bio: value['bio']
                    }
                }
            },
        }).catch(() => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            return res.status(500).json({ message: 'error try again later' });
        })).then(() => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            res.json({ message: 'user has been registered' });
        }));
    });
}
exports.AddNewUser = AddNewUser;
// all users 
function allUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //hide password from the query
        const users = yield prisma.user.findMany({ select: {
                password: false,
                id: true,
                name: true,
                email: true,
                verified_at: true,
                role: true
            } }).catch(() => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            return res.json({ message: 'error try again later' });
        }));
        res.json({ data: users });
    });
}
exports.allUsers = allUsers;
// get specific user
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        if (Number.isInteger(id)) {
            const user = yield prisma.user.findFirstOrThrow({
                where: {
                    id: id
                },
                select: {
                    password: false,
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    verified_at: true
                }
            }).catch(() => { return res.send("user not found"); });
            return res.json({ data: user });
        }
        else
            return res.json({ message: "integer required" });
    });
}
exports.getUser = getUser;
// update user
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const { body } = req;
        const result = updateUserSchema_1.updateUserSchema.validate(body);
        const { value, error } = result;
        const valid = error == null;
        if (!valid) {
            return res.status(422).json(error['details']);
        }
        //end validation
        const id = parseInt(req.params.id);
        if (Number.isInteger(id)) {
            const updateUser = yield prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: value['name'],
                    email: value['email'],
                    role: value['role'],
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }).catch(() => { res.send("not found"); });
            return res.json({ message: "success", data: updateUser });
        }
        else {
            return res.json({ message: "id integer required" });
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        if (Number.isInteger(id)) {
            yield prisma.user.delete({
                where: {
                    id: id,
                }
            }).catch((err) => {
                return res.json({ message: "not valid : " + err });
            });
            return res.json({ message: "user has been deleted successfully" });
        }
        else {
            return res.json({ message: "id integer required" });
        }
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=adminController.js.map