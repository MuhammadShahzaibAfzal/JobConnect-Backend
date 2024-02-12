export class AuthController {
  register(req, res, next) {
    res.status(200).send("Register User");
  }

  login(req, res, next) {
    res.send("Login User");
  }
}
