"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`Connecting to port ${PORT} complete`);
});
if (process.env.MONGO_URL)
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then(() => {
        console.log(`Mongo connected to port ${PORT}`);
    })
        .catch((e) => {
        console.log(`${e.message} did not connect`);
    });
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
