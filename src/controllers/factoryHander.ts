import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { Document, Model as MongooseModel, Query } from "mongoose";

interface ModelType extends MongooseModel<unknown> {}

export const deleteOne = (Model: ModelType) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model: ModelType) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("Not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const createOne = (Model: ModelType) =>
  catchAsync(async (req: Request, res: Response) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc: newDoc,
      },
    });
  });

export const getOne = (Model: ModelType, popOptions?: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query: Query<Document | null, Document> = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const getAll = (Model: ModelType) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query: any = Model.find({}, { _id: 0 });
    const doc = await query;
    if (!doc) {
      return next(new AppError("No found", 404));
    }
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });
