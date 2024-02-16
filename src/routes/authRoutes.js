import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import { body } from "express-validator";
import registerUserValidator from "../validators/auth/register-user-validator.js";
import { TokenService } from "../services/TokenService.js";

const authRouter = Router();
const userService = new UserService();
const tokenService = new TokenService();
const authController = new AuthController(userService, tokenService);

authRouter.post("/register", registerUserValidator, (req, res, next) => {
  authController.register(req, res, next);
});
authRouter.post("/login", authController.login);

export default authRouter;
