import { ErrorHandlerService } from "../services/ErrorHandlerService.js";

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res, next) {
    const { email } = req.body;
    try {
      // check email is already exists
      const isEmailExist = await this.userService.getUser({ email });
      if (isEmailExist) {
        return next(
          ErrorHandlerService.alreadyExistError("Email is already exist.")
        );
      }
      const user = await this.userService.create(req.body);
      return res.status(201).json({
        _id: user._id,
      });
    } catch (error) {
      next(error);
    }
  }

  login(req, res, next) {
    res.send("Login User");
  }
}

export default AuthController;
