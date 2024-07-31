import * as jwt from "jsonwebtoken";
import express, { Request } from "express";
import catchAsync from "../utils/catchAsync";
import { User, userType } from "../models/User";
import { Types } from "mongoose";
import appError from "../utils/appError";
import * as crypto from "crypto";
import { getUser } from "./userController";

export interface GetUserAuthInfoRequest extends Request {
  user?: userType; // or any other type
}

const verifyJwt = (
  token: string,
  secretOrPublicKey: jwt.Secret,
  options?: jwt.VerifyOptions
): Promise<object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      secretOrPublicKey,
      options,
      (err: jwt.VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded || {});
        }
      }
    );
  });
};

const signToken = (id: Types.ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: userType,
  statusCode: number,
  res: express.Response
) => {
  const token = signToken(user._id as Types.ObjectId);
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

export const signup = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    // it gives a promise
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body; //by using destructing we are taking email and password from the body
    //CHECK if the email or password exists
    if (!email || !password) {
      return next(new appError("Please provide the email and password", 400));
    }
    //check if the email or password is correct
    const user = await User.findOne({ email }).select("+password"); //when we want to select the data which is select : false in Usermodel as default we can to add .select('+<field u want>)

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new appError("Incorrect password or email", 401));
    }
    // if everything is ok then send token to client
    createSendToken(user, 200, res);
  }
);

export const protect = catchAsync(
  async (
    req: GetUserAuthInfoRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // the token cannot be declared inside the block as it scope will only remain inside the block
    } else if (req.cookies.JWT) {
      token = req.cookies.JWT;
    }

    if (!token) {
      if (req.originalUrl.startsWith("/me")) {
        return res.redirect("/");
      }
      return next(
        new appError("You are not logged in, please log in to get access", 401)
      );
    }
    //2- Verify the token

    const decode: { id?: string; iat?: number; exp?: number } = await verifyJwt(
      token,
      process.env.JWT_SECRET
    ); //this needs a callback but if u want to return a promise we need to promisify the function
    //decode will have the id
    //3- Check if the user still exists i.e if the user is deleted then the token should also be not valid
    const currentUser = await User.findById((decode as { id?: string }).id);
    if (!currentUser) {
      return next(new appError("User does not exist", 401));
    }

    // 4 - Check if the user changed their password after token was issued

    //Grant access to the protected Route
    req.user = currentUser;
    res.locals.user = currentUser; //it will create a user variable avaliable for all pug templates

    next();
  }
);

export const logout = (req: GetUserAuthInfoRequest, res: express.Response) => {
  //->#2.Express.js Documentation way - clearing the cookie value via built-in express function
  res.clearCookie("JWT");
  res.status(200).json({ status: "success" });
};
