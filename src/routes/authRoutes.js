import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import registerUserValidator from "../validators/auth/register-user-validator.js";
import { TokenService } from "../services/TokenService.js";
import loginUserValidator from "../validators/auth/login-user-validator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRefreshToken } from "../middlewares/validateRefeshToken.js";
import changePasswordValidator from "../validators/auth/change-password-validator.js";
import forgetPasswordValidator from "../validators/auth/forget-password-validator.js";
import resetPasswordValidator from "../validators/auth/reset-password-validator.js";

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

authRouter.get("/refresh-tokens", validateRefreshToken, (req, res, next) => {
  authController.refreshTokens(req, res, next);
});

authRouter.get("/logout", authMiddleware, (req, res, next) => {
  authController.logout(req, res, next);
});

authRouter.post(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  (req, res, next) => {
    authController.changePassword(req, res, next);
  }
);

authRouter.post(
  "/forget-password",
  forgetPasswordValidator,
  (req, res, next) => {
    authController.forgetPassword(req, res, next);
  }
);

authRouter.post("/reset-password", resetPasswordValidator, (req, res, next) => {
  authController.resetPassword(req, res, next);
});

export default authRouter;
