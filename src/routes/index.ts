import express from "express";
import userRouter from "./userRouter";
import taskRouter from "./taskRouter";

const router = express.Router();

export default (): express.Router => {
  userRouter(router);
  taskRouter(router);

  return router;
};
