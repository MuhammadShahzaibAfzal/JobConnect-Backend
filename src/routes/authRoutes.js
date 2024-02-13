import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserService from "../services/UserService.js";
import { logger } from "../config/logger.js";

const authRouter = Router();
const userService = new UserService();
const authController = new AuthController(userService, logger);

authRouter.post("/register", (req, res, next) => {
  authController.register(req, res, next);
});
authRouter.post("/login", authController.login);

export default authRouter;
