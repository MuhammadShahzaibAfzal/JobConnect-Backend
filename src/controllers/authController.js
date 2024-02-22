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

  async self(req, res, next) {
    try {
      const user = await this.userService.getUser(
        { _id: req.userID },
        "-_id -__v"
      );
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async refreshTokens(req, res, next) {
    const { jti: tokenID, _id: userID } = req.data;
    // CHECK USER EXIST
    try {
      const user = await this.userService.getUser({ _id: userID });
      if (!user) {
        return next(
          ErrorHandlerService.badRequestError(
            "User with the token could not found"
          )
        );
      }

      const payload = {
        _id: user._id,
        role: user.role,
      };
      // PERSIST REFRESH TOKEN INTO DATABASE
      const newRefreshToken = await this.tokenService.persistRefreshToken(
        user._id
      );
      // DELETE PREVIOUS REFRESH TOKEN
      await this.tokenService.deleteRefreshToken(tokenID);
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

      res.status(200).json({ message: "Tokens refresh successfully" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const jti = req.jti;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    try {
      await this.tokenService.deleteRefreshToken(jti);
    } catch (error) {
      next(error);
    }
    res.status(200).json({ isAuth: false });
  }

  async changePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;
    if (currentPassword == newPassword) {
      return next(
        ErrorHandlerService.badRequestError("Current and New password is same")
      );
    }
    // REQUEST VALIDATION
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      // CHECK USER EXISTS OR NOT ?
      const user = await this.userService.getUser({ _id: req.userID });
      if (!user) {
        return next(ErrorHandlerService.notFoundError("User not found."));
      }
      // CHECK CURRENT PASSWORD
      const isMatch = await user.isPasswordCorrect(currentPassword);
      if (!isMatch) {
        return next(
          ErrorHandlerService.badRequestError("Current password is incorrect")
        );
      }
      // CHANGE PASSWORD
      user.password = newPassword;
      await user.save();
      return res
        .status(200)
        .json({ message: "Password Changed successfully." });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req, res, next) {
    const { email } = req.body;
    // VALIDATE REQUEST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // CHECK USER EXIST OF THAT EMAIL
      const user = await this.userService.getUser({ email });
      if (!user) {
        return next(ErrorHandlerService.notFoundError("User not found."));
      }
      // GENERATE PASSWORD RESET TOKEN LINK
      const passwordResetToken =
        await this.tokenService.generatePasswordResetToken({ _id: user._id });
      // SEND MAIL
      console.log("====================================");
      console.log(
        `Your password link is http://localhost:5173/password-reset/${passwordResetToken}`
      );
      console.log("====================================");
      return res.status(200).json({
        message: `Your password link is http://localhost:5173/password-reset/${passwordResetToken}`,
        resetPasswordToken: passwordResetToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    const { resetPasswordToken, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // VERIFY PASSWORAD TOKEN
    let payload;
    try {
      payload = await this.tokenService.verifyPasswordResetToken(
        resetPasswordToken
      );
    } catch (error) {
      return next(
        ErrorHandlerService.badRequestError(
          "Invalid or expire password reset token."
        )
      );
    }
    // CHANGE PASSWORD
    try {
      const user = await this.userService.getUser({ _id: payload._id });
      user.password = newPassword;
      await user.save();
      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
