import JobModel from "../models/jobModel.js";

export class JobService {
  async create(data) {
    return await JobModel.create(data);
  }

  async getAll(validatedQuery) {
    const { currentPage, perPage } = validatedQuery;
    const count = await JobModel.countDocuments({});
    const jobs = await JobModel.find({}, "title")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return {
      jobs,
      count,
    };
  }
}
