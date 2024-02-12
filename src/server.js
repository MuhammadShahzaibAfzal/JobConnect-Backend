import express from "express";
import { PORT } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";
import { connectDatabase } from "./config/database.js";

const app = express();

// Register Router
app.use("api/auth", authRouter);

const startServer = () => {
  try {
    app.listen(PORT, () => {
      connectDatabase();
      console.log(`Server is listning on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Something went wrong while starting server : ${error}`);
  }
};

startServer();
