import jwt from "jsonwebtoken";
import {
  ACCESS_TOEKN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config/index.js";

export class TokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOEKN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }
}
