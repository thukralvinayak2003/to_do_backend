"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Task Schema
const taskSchema = new mongoose_1.default.Schema({
    task_title: {
        type: String,
        required: true,
    },
    task_description: {
        type: String,
    },
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["To-Do", "In Progress", "Under Review", "Completed"],
        default: "In Progress",
    },
    priority: {
        type: String,
        enum: ["Low", "High", "Medium"],
        default: "Low",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
// Create models
taskSchema.pre(/^find/, function (next) {
    this.populate({
        path: "userId",
        select: "-__v ",
    });
    next();
});
exports.Task = mongoose_1.default.model("Task", taskSchema);
