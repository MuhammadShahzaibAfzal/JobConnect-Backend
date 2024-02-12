import { ErrorHandlerService } from "../services/ErrorHandlerService.js";

export const globalErrorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      originalMessage: err.message,
    }),
  };

  if (err instanceof ErrorHandlerService) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};
