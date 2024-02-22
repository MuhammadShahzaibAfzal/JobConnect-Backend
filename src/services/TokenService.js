import jwt from "jsonwebtoken";
import {
  ACCESS_TOEKN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRY,
  PASSWORD_RESET_TOKEN_EXPIRY,
  PASSWORD_RESET_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config/index.js";
import RefreshTokenModel from "../models/refreshTokenModel.js";

export class TokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOEKN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(payload, jwtid) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      jwtid: String(jwtid),
    });
  }

  async persistRefreshToken(userID) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // leap year not considered

    return await RefreshTokenModel.create({
      userID,
      expiresAt: Date.now() + MS_IN_YEAR,
    });
  }

  async deleteRefreshToken(tokenID) {
    await RefreshTokenModel.findByIdAndDelete(tokenID);
  }

  async generatePasswordResetToken(payload) {
    return jwt.sign(payload, PASSWORD_RESET_TOKEN_SECRET, {
      expiresIn: PASSWORD_RESET_TOKEN_EXPIRY,
    });
  }

  async verifyPasswordResetToken(token) {
    return jwt.verify(token, PASSWORD_RESET_TOKEN_SECRET);
  }
}
