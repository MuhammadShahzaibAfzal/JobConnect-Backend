import mongoose from "mongoose";
import { DB_URL } from "./index.js";

export const connectDatabase = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database connected successfully 🚀🚀");
    })
    .catch((err) => {
      console.log(
        `Something went wrong while connecting to database 😢😢: ${err}`
      );
    });
};
