"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verified(req, res, next) {
    if (req.user.verified_at != null) {
        return next();
    }
    else {
        res.status(401).json({ message: 'Please verify your account to access' });
    }
}
exports.default = verified;
//# sourceMappingURL=verified.js.map