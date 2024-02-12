import express from "express";
import { PORT } from "./config/index.js";

const app = express();

app.listen(PORT, () => {
  console.log(`Server is listning on port ${PORT}`);
});
