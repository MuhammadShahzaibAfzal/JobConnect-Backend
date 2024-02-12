import { PORT } from "./config/index.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";
import { app } from "./app.js";

const startServer = () => {
  try {
    app.listen(PORT, () => {
      connectDatabase();
      logger.log("info", `Server is listning on port ${PORT}`);
    });
  } catch (error) {
    logger.log(
      "error",
      `Something went wrong while starting server : ${error}`
    );
  }
};

startServer();
