const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

const userRouter = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);
userRouter.route("/verify/:token").get(authController.verifyEmail);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter.route("/:id").get(userController.getUser);

module.exports = userRouter;
