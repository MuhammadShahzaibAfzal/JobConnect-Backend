import express from "express";
import { PORT } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

// Register Router
app.use("api/auth", authRouter);
app.listen(PORT, () => {
  console.log(`Server is listning on port ${PORT}`);
});
