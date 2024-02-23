import { validationResult } from "express-validator";

export class JobController {
  async createNewJob(req, res, next) {
    // VALIDATION
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ erros: errors.array() });
    }

    return res.status(201).json({ message: "Job created" });
  }
}
