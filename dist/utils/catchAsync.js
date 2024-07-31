"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// catchAsync function; accepts an AsyncExpressFunction and returns a RequestHandler
const catchAsync = (fn) => {
    return (req, res, next) => {
        // Call async function; use .catch() to catch and forward any errors
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
