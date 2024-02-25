import { matchedData, validationResult } from "express-validator";
import { ErrorHandlerService } from "../services/ErrorHandlerService.js";

export class JobController {
  constructor(jobService) {
    this.jobService = jobService;
  }
  async createNewJob(req, res, next) {
    // VALIDATION
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ erros: errors.array() });
    }
    try {
      const job = await this.jobService.create({
        ...req.body,
        createdBy: req.userID,
      });
      return res.status(201).json(job);
    } catch (error) {
      return next(error);
    }
  }

  async getJobs(req, res, next) {
    // ONLY QUERIES WHICH IS REQUIRED. NOT OTHER QUERY ALLOWED
    const validatedQuery = matchedData(req, { onlyValidData: true });
    try {
      const { jobs, count } = await this.jobService.getAll(validatedQuery);
      return res.status(200).json({
        data: jobs,
        currentPage: validatedQuery.currentPage,
        perPage: validatedQuery.perPage,
        total: count,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getLatestJobs(req, res, next) {
    try {
      const latestJobs = await this.jobService.getLatest();
      res.status(200).json({ latestJobs });
    } catch (error) {
      next(error);
    }
  }

  async getPopularCategories(req, res, next) {
    try {
      const popularCategories = await this.jobService.getPopularCategories();
      return res.status(200).json({ popularCategories });
    } catch (error) {
      next(error);
    }
  }

  async getJob(req, res, next) {
    const { _id } = req.params;
    try {
      const job = await this.jobService.getJob({ _id });
      if (!job) {
        return next(ErrorHandlerService.notFoundError("Job not found"));
      }
      return res.status(200).json({ job });
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req, res, next) {
    const { _id } = req.params;
    try {
      // FIND JOB
      const job = await this.jobService.getJob({ _id });
      if (!job) {
        return next(ErrorHandlerService.notFoundError("Job not found"));
      }
      // CHECK WHO CREATED THIS JOB
      if (!(job.createdBy == req.userID)) {
        return next(
          ErrorHandlerService.forbiddenError("Not allowed to update")
        );
      }
      const updatedJob = await this.jobService.updateJob(_id, req.body);
      return res.status(200).json({ job: updatedJob });
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(req, res, next) {
    // ONLY QUERIES WHICH IS REQUIRED. NOT OTHER QUERY ALLOWED
    const validatedQuery = matchedData(req, { onlyValidData: true });
    try {
      const { jobs, count } = await this.jobService.getAll(validatedQuery, {
        createdBy: req.userID,
      });
      console.log("====================================");
      console.log(jobs);
      console.log("====================================");
      return res.status(200).json({
        data: jobs,
        currentPage: validatedQuery.currentPage,
        perPage: validatedQuery.perPage,
        total: count,
      });
    } catch (error) {
      return next(error);
    }
  }
}
