import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import { body } from "express-validator";
import registerUserValidator from "../validators/auth/register-user-validator.js";

const authRouter = Router();
const userService = new UserService();
const authController = new AuthController(userService);

authRouter.post("/register", registerUserValidator, (req, res, next) => {
  authController.register(req, res, next);
});
authRouter.post("/login", authController.login);

export default authRouter;
