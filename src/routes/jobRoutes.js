import { Router } from "express";
import { JobController } from "../controllers/JobController.js";
import { jobValidationRules } from "../validators/job/create-job-validator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { JobService } from "../services/JobService.js";

const jobRouter = Router();
const jobService = new JobService();

const jobController = new JobController(jobService);

jobRouter.post("/", authMiddleware, jobValidationRules(), (req, res, next) => {
  jobController.createNewJob(req, res, next);
});

export default jobRouter;
