"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const StrategyJwt = passport_jwt_1.default.Strategy;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
passport_1.default.use(new StrategyJwt({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, function (jwtPayload, done) {
    return prisma.user.findFirst({ where: { id: jwtPayload.id } })
        .then((user) => {
        return done(null, user);
    })
        .catch((err) => {
        return done(err);
    });
}));
//# sourceMappingURL=passport.js.map