import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import registerUserValidator from "../validators/auth/register-user-validator.js";
import { TokenService } from "../services/TokenService.js";
import loginUserValidator from "../validators/auth/login-user-validator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router();
// Depedencies
const userService = new UserService();
const tokenService = new TokenService();

const authController = new AuthController(userService, tokenService);

authRouter.post("/register", registerUserValidator, (req, res, next) => {
  authController.register(req, res, next);
});

authRouter.post("/login", loginUserValidator, (req, res, next) => {
  authController.login(req, res, next);
});

authRouter.get("/self", authMiddleware, (req, res, next) => {
  authController.self(req, res, next);
});

export default authRouter;
