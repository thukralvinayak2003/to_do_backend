import catchAsync from "../utils/catchAsync";
import * as factory from "./factoryHander";
import { NextFunction, Request, Response } from "express";
import { userType } from "models/User";
import { Task } from "../models/Task";
import AppError from "../utils/appError";

export interface GetUserAuthInfoRequest extends Request {
  user?: userType; // or any other type
}

export const setTourUserId = (
  req: GetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  // Allow nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.userId = req.user?.id;
  next();
};

export const getTask = catchAsync(
  async (req: GetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    let doc = await Task.find({ userId: req.user?.id });
    if (!doc) {
      return next(new AppError("No found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);

export const createTask = factory.createOne(Task);

//Do not change passwords with this
export const updateTask = factory.updateOne(Task);

export const deleteTask = factory.deleteOne(Task);
