import { Router } from "express";
import { JobController } from "../controllers/JobController.js";
import { jobValidationRules } from "../validators/job/create-job-validator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { JobService } from "../services/JobService.js";
import { listJobRules } from "../validators/job/list-jobs-validator.js";

const jobRouter = Router();
const jobService = new JobService();

const jobController = new JobController(jobService);

jobRouter.post("/", authMiddleware, jobValidationRules(), (req, res, next) => {
  jobController.createNewJob(req, res, next);
});

jobRouter.get("/", listJobRules(), (req, res, next) => {
  jobController.getJobs(req, res, next);
});

jobRouter.get("/latests", (req, res, next) => {
  jobController.getLatestJobs(req, res, next);
});

export default jobRouter;
