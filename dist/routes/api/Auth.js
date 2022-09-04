"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//ts
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../../controllers/AuthController");
const NewPasswordController_1 = require("../../controllers/NewPasswordController");
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const verified_1 = __importDefault(require("../../middlewares/verified"));
// routes without middlewares
router.post('/register', AuthController_1.Register);
router.get('/login', AuthController_1.Login);
// forgot password routes
router.get('/forgot-password', NewPasswordController_1.forgotPassword);
router.get('/reset-password/', NewPasswordController_1.resetPassword);
router.get('/update-password/', NewPasswordController_1.updatePassword);
// account verification
router.get('/user/verify/:id/:token', AuthController_1.Verify);
// routes with authentication middleware
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get('/sendVerification', AuthController_1.SendVerification);
// routes with authentication and verified middlewares
router.use(verified_1.default);
router.post('/changePassword', AuthController_1.changePassword);
router.get("/user", (req, res) => {
    res.json({
        data: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            verified_at: req.user.verified_at
        }
    });
});
exports.default = router;
//# sourceMappingURL=Auth.js.map