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

jobRouter.get("/popular-categories", (req, res, next) => {
  jobController.getPopularCategories(req, res, next);
});

jobRouter.get("/:_id", (req, res, next) => {
  jobController.getJob(req, res, next);
});

jobRouter.put("/:_id", authMiddleware, (req, res, next) => {
  jobController.updateJob(req, res, next);
});

jobRouter.get("/my/jobs", authMiddleware, listJobRules(), (req, res, next) => {
  jobController.getMyJobs(req, res, next);
});

export default jobRouter;
