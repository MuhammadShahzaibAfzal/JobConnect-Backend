class AuthController {
  constructor(userService) {
    this.userService = userService;
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
