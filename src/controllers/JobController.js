import { validationResult } from "express-validator";

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
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    try {
      const job = await this.jobService.createJob({
        ...req.body,
        createdBy: req.userID,
      });
      return res.status(201).json(job);
    } catch (error) {
      return next(error);
    }
  }
}
