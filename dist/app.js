"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config({ path: ".env" });
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // replace with your frontend URL
    credentials: true,
}));
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    max: 10000,
    windowMs: 6 * 60 * 1000,
    message: "Too many requests from this IP . Please try again later",
});
app.use("/api", limiter);
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)({
    whitelist: [],
}));
app.use((0, compression_1.default)());
app.use("/api/", (0, routes_1.default)());
exports.default = app;
