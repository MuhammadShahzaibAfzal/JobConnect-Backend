import express from "express";
import authRouter from "./routes/authRoutes.js";
import { globalErrorHandlerMiddleware } from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import jobRouter from "./routes/jobRoutes.js";

export const app = express();
app.use(express.json());
app.use(cookieParser());
// Register Router
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);

// Error Handler Middleware
app.use(globalErrorHandlerMiddleware);
