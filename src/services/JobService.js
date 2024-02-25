import JobModel from "../models/jobModel.js";

export class JobService {
  async create(data) {
    return await JobModel.create(data);
  }

  async getAll(validatedQuery, filter) {
    const { currentPage, perPage } = validatedQuery;
    const count = await JobModel.countDocuments(filter);
    const jobs = await JobModel.find(filter, "title")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return {
      jobs,
      count,
    };
  }

  async getLatest() {
    return await JobModel.find().sort({ createdAt: -1 }).limit(8);
  }

  async getPopularCategories() {
    const popularCategories = await JobModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }, // Count the number of documents in each category
        },
      },
      {
        $sort: { count: -1 }, // Sort categories by count in descending order
      },
      {
        $limit: 8, // Limit the result to the top 8 categories
      },
    ]);
    return popularCategories;
  }

  async getJob(filter) {
    return await JobModel.findOne(filter);
  }

  async updateJob(_id, data) {
    return await JobModel.findByIdAndUpdate(_id, data, { new: true });
  }
}
