"use strict";
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
exports.logout = exports.protect = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const User_1 = require("../models/User");
const appError_1 = __importDefault(require("../utils/appError"));
const verifyJwt = (token, secretOrPublicKey, options) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretOrPublicKey, options, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded || {});
            }
        });
    });
};
const Secret = process.env.JWT_SECRET;
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        //IN js to specify date we use new Date
        maxage: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        httpOnly: true, // SO the cookie cannot be accessed or modified by the browser
    };
    res.cookie("JWT", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user,
        },
    });
};
exports.signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield User_1.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    // it gives a promise
    createSendToken(newUser, 201, res);
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body; //by using destructing we are taking email and password from the body
    //CHECK if the email or password exists
    if (!email || !password) {
        return next(new appError_1.default("Please provide the email and password", 400));
    }
    //check if the email or password is correct
    const user = yield User_1.User.findOne({ email }).select("+password"); //when we want to select the data which is select : false in Usermodel as default we can to add .select('+<field u want>)
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default("Incorrect password or email", 401));
    }
    // if everything is ok then send token to client
    createSendToken(user, 200, res);
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // the token cannot be declared inside the block as it scope will only remain inside the block
    }
    else if (req.cookies.JWT) {
        token = req.cookies.JWT;
    }
    if (!token) {
        if (req.originalUrl.startsWith("/me")) {
            return res.redirect("/");
        }
        return next(new appError_1.default("You are not logged in, please log in to get access", 401));
    }
    //2- Verify the token
    // { id?: string; iat?: number; exp?: number }
    const decode = yield verifyJwt(token, Secret); //this needs a callback but if u want to return a promise we need to promisify the function
    //decode will have the id
    //3- Check if the user still exists i.e if the user is deleted then the token should also be not valid
    const currentUser = yield User_1.User.findById(decode.id);
    if (!currentUser) {
        return next(new appError_1.default("User does not exist", 401));
    }
    // 4 - Check if the user changed their password after token was issued
    //Grant access to the protected Route
    req.user = currentUser;
    res.locals.user = currentUser; //it will create a user variable avaliable for all pug templates
    next();
}));
const logout = (req, res) => {
    //->#2.Express.js Documentation way - clearing the cookie value via built-in express function
    res.clearCookie("JWT");
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
