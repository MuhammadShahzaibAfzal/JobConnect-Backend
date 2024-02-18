import { logger } from "../config/logger.js";
import { ErrorHandlerService } from "../services/ErrorHandlerService.js";

export const globalErrorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction ? "Internal server error" : err.message;

  // logging error
  // logger.log("error", err.message, {
  //   statusCode,
  //   error: err.stack,
  //   path: req.path,
  //   method: req.method,
  // });

  let data = {
    errors: [
      {
        type: err.name,
        msg: message,
        path: req.path,
        method: req.method,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  };

  if (err instanceof ErrorHandlerService) {
    statusCode = err.status;
    data.errors[0].msg = err.message;
  }

  return res.status(statusCode).json(data);
};
