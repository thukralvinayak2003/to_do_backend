import {
  createTask,
  deleteTask,
  getTask,
  setTourUserId,
  updateTask,
} from "../controllers/taskcontroller";
import * as authController from "../controllers/authController";
import express from "express";

export default (router: express.Router) => {
  router.use(authController.protect);
  router.post("/task/", setTourUserId, createTask);
  router.get("/task/", setTourUserId, getTask);
  router.patch("/task/:id", setTourUserId, updateTask);
  router.delete("/task/:id", deleteTask);
};
