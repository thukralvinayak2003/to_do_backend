import { Request, Response, NextFunction, RequestHandler } from "express";

// The function for an asynchronous Express route handler
type AsyncExpressFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// catchAsync function; accepts an AsyncExpressFunction and returns a RequestHandler
const catchAsync = (fn: AsyncExpressFunction): RequestHandler => {
  return (req, res, next) => {
    // Call async function; use .catch() to catch and forward any errors
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
