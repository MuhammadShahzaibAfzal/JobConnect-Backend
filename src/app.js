import express from "express";
import authRouter from "./routes/authRoutes.js";
import { globalErrorHandlerMiddleware } from "./middlewares/globalErrorHandler.js";

export const app = express();
app.use(express.json());
// Register Router
app.use("/api/auth", authRouter);

// Error Handler Middleware
app.use(globalErrorHandlerMiddleware);
