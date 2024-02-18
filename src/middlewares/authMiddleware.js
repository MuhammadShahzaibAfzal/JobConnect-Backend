import { ACCESS_TOEKN_SECRET_KEY } from "../config/index.js";
import { ErrorHandlerService } from "../services/ErrorHandlerService.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next(
      ErrorHandlerService.unAuthorizedError("Access token is required")
    );
  }
  try {
    const { _id, jti } = jwt.verify(accessToken, ACCESS_TOEKN_SECRET_KEY);
    req.userID = _id;
    req.jti = jti;
    next();
  } catch (error) {
    next(
      ErrorHandlerService.unAuthorizedError("Invalid or expire access token")
    );
  }
};
