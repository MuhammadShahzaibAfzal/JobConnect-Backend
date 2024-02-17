import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import registerUserValidator from "../validators/auth/register-user-validator.js";
import { TokenService } from "../services/TokenService.js";
import { RefreshTokenService } from "../services/RefreshTokenService.js";

const authRouter = Router();
// Depedencies
const userService = new UserService();
const tokenService = new TokenService();
const refreshTokenService = new RefreshTokenService();

const authController = new AuthController(
  userService,
  tokenService,
  refreshTokenService
);

authRouter.post("/register", registerUserValidator, (req, res, next) => {
  authController.register(req, res, next);
});
authRouter.post("/login", authController.login);

export default authRouter;
