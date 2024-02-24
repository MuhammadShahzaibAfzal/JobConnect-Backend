import { matchedData, validationResult } from "express-validator";

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
        count,
      });
    } catch (error) {
      return next(error);
    }
  }
}
