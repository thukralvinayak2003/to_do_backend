import express from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";

export default (router: express.Router) => {
  router.post("/auth/signup", authController.signup);
  router.post("/auth/login", authController.login);
  router.get("/auth/logout", authController.logout);

  router.delete("/users/deleteMe", userController.deleteUser);
  router.get("/users/me", userController.getUser, userController.getUser);

  router
    .route("/users/")
    .get(userController.getAllUser)
    .post(userController.createUser);
  router
    .route("/users/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
      // these roles are allowed to access
      userController.deleteUser
    );
};
