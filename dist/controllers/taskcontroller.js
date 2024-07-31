"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.setTourUserId = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const factory = __importStar(require("./factoryHander"));
const Task_1 = require("../models/Task");
const appError_1 = __importDefault(require("../utils/appError"));
const setTourUserId = (req, res, next) => {
    var _a;
    // Allow nested Routes
    if (!req.body.tour)
        req.body.tour = req.params.tourId;
    if (!req.body.user)
        req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
};
exports.setTourUserId = setTourUserId;
exports.getTask = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let doc = yield Task_1.Task.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    if (!doc) {
        return next(new appError_1.default("No found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
}));
exports.createTask = factory.createOne(Task_1.Task);
//Do not change passwords with this
exports.updateTask = factory.updateOne(Task_1.Task);
exports.deleteTask = factory.deleteOne(Task_1.Task);
