"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const taskRouter_1 = __importDefault(require("./taskRouter"));
const router = express_1.default.Router();
exports.default = () => {
    (0, userRouter_1.default)(router);
    (0, taskRouter_1.default)(router);
    return router;
};
