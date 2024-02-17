import { validationResult } from "express-validator";
import { ErrorHandlerService } from "../services/ErrorHandlerService.js";
import UserModel from "../models/userModel.js";

class AuthController {
  constructor(userService, tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  async register(req, res, next) {
    const { email } = req.body;
    // REQUEST VALIDATION
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    try {
      // CHECK EMAIL IS AREADY EXISTS ?
      const isEmailExist = await this.userService.getUser({ email });
      if (isEmailExist) {
        return next(
          ErrorHandlerService.alreadyExistError("Email is already exist.")
        );
      }
      // STORE USER INTO DATABASE
      const user = await this.userService.create(req.body);
      const payload = {
        _id: user._id,
        role: user.role,
      };
      // PERSIST REFRESH TOKEN INTO DATABASE
      const newRefreshToken = await this.tokenService.persistRefreshToken(
        user._id
      );
      // GENERATE ACCESS AND REFRESH TOKEN
      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        newRefreshToken._id
      );

      // SET ACCESS AND REFRESH TOKEN INTO COOKIE
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });
      return res.status(201).json({
        _id: user._id,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    /* REQUEST VALIDATION */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // CHECK USER EXIST INTO DATABASE
      const user = await UserModel.findOne({ email });
      if (!user) {
        return next(ErrorHandlerService.notFoundError("Email does not exist"));
      }
      // MATCH PASSWORD
      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) {
        return next(ErrorHandlerService.badRequestError("Invalid credentials"));
      }
      // GENERATE TOKENS
      const payload = {
        _id: user._id,
        role: user.role,
      };
      // PERSIST REFRESH TOKEN INTO DATABASE
      const newRefreshToken = await this.tokenService.persistRefreshToken(
        user._id
      );
      // GENERATE ACCESS AND REFRESH TOKEN
      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        newRefreshToken._id
      );

      // SET ACCESS AND REFRESH TOKEN INTO COOKIE
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      res
        .status(200)
        .json({ message: "User is login successful", _id: user._id });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
