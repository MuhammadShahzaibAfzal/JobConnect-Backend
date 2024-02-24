import JobModel from "../models/jobModel.js";

export class JobService {
  async createJob(data) {
    return await JobModel.create(data);
  }
}
