import { REFRESH_TOKEN_SECRET_KEY } from "../config/index.js";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import { ErrorHandlerService } from "../services/ErrorHandlerService.js";
import jwt from "jsonwebtoken";

export const validateRefreshToken = async (req, res, next) => {
  // GET TOKEN FROM COOKIE
  const { refreshToken } = req.cookies;
  // VALIDATE TOKEN
  if (!refreshToken) {
    return next(
      ErrorHandlerService.badRequestError("Refresh Token is required")
    );
  }
  //   Validate Token
  let data;
  try {
    data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    return next(ErrorHandlerService.badRequestError("Invalid refresh token"));
  }
  // CHECK INTO DB
  try {
    const isExist = await RefreshTokenModel.findById(data.jti);
    if (!isExist) {
      return next(ErrorHandlerService.badRequestError("Token is revoked"));
    }
  } catch (error) {
    return next(error);
  }

  req.data = data;
  next();
};
