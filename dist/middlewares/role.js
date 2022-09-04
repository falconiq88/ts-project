"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function admin(req, res, next) {
    if (req.user.role == "admin") {
        return next();
    }
    else {
        res.status(401).json({ message: 'This route for admins only' });
    }
}
exports.default = admin;
//# sourceMappingURL=role.js.map