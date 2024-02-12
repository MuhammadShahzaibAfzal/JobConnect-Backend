import mongoose from "mongoose";
import { DB_URL } from "./index.js";
import { logger } from "./logger.js";

export const connectDatabase = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      logger.log("info", "Database connected successfully 🚀🚀");
    })
    .catch((err) => {
      logger.log(
        "error",
        `Something went wrong while connecting to database 😢😢: ${err}`
      );
    });
};
