import express from "express";
import { PORT } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

const app = express();

// Register Router
app.use("api/auth", authRouter);

const startServer = () => {
  try {
    app.listen(PORT, () => {
      connectDatabase();
      logger.log("info",`Server is listning on port ${PORT}`)
    });
  } catch (error) {
    logger.log("error",`Something went wrong while starting server : ${error}`)
  }
};

startServer();
