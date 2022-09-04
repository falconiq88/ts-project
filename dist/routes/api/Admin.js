"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const verified_1 = __importDefault(require("../../middlewares/verified"));
const role_1 = __importDefault(require("../../middlewares/role"));
const adminController_1 = require("../../controllers/adminController");
// middlewares
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.use(verified_1.default);
router.use(role_1.default);
// routes
router.post('/admin/newUser', adminController_1.AddNewUser);
router.get("/admin/allUsers", adminController_1.allUsers);
router.get("/admin/user/:id", adminController_1.getUser);
router.put("/admin/editUser/:id/", adminController_1.updateUser);
router.delete("/admin/deleteUser/:id/", adminController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=Admin.js.map