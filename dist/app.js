"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const errors_js_1 = __importDefault(require("./middlewares/errors.js"));
const Auth_js_1 = __importDefault(require("./routes/api/Auth.js"));
const Admin_js_1 = __importDefault(require("./routes/api/Admin.js"));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
app.use(express_1.default.json());
const dotenv_1 = __importDefault(require("dotenv"));
require("./auth/passport");
dotenv_1.default.config();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// app.set('view engine', 'ejs');
//Routes
app.get('/', (req, res) => {
    res.send('Hello My Boy just enjoy');
});
app.use('/api/v1', Auth_js_1.default);
app.use('/api/v1', Admin_js_1.default);
app.use(errors_js_1.default.notFound);
app.use(errors_js_1.default.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map