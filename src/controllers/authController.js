import { ErrorHandlerService } from "../services/ErrorHandlerService.js";

class AuthController {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
  }

  async register(req, res, next) {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  login(req, res, next) {
    res.send("Login User");
  }
}

export default AuthController;
