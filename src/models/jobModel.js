import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    jobNature: {
      type: String,
      required: true,
    },
    vacancy: {
      type: Number,
      required: true,
    },
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    skillsRequired: [String],

    requirements: {
      type: String,
    },
    responsibilites: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "filled", "expired", "paused"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
