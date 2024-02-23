import { Router } from "express";
import { JobController } from "../controllers/JobController.js";
import createJobValidator from "../validators/job/create-job-validator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const jobRouter = Router();
const jobController = new JobController();

jobRouter.post("/", authMiddleware, createJobValidator, (req, res, next) => {
  jobController.createNewJob(req, res, next);
});

export default jobRouter;
