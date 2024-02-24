import { body } from "express-validator";

export const jobValidationRules = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("jobNature").notEmpty().withMessage("Job nature is required"),
    body("vacancy")
      .notEmpty()
      .withMessage("Vacancy is required")
      .isInt()
      .withMessage("Vacancy must be an integer"),
    body("salary.min")
      .notEmpty()
      .withMessage("Minimum salary is required")
      .isInt()
      .withMessage("Minimum salary must be an integer"),
    body("salary.max")
      .notEmpty()
      .withMessage("Maximum salary is required")
      .isInt()
      .withMessage("Maximum salary must be an integer"),
    body("salary.currency").notEmpty().withMessage("Currency is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("expirationDate")
      .notEmpty()
      .withMessage("Expiration date is required")
      .isISO8601()
      .withMessage("Invalid expiration date format"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["active", "filled", "expired", "paused"])
      .withMessage("Invalid status"),
    body("companyName").notEmpty().withMessage("Company Name is required"),
    // You can add more validation rules based on your requirements
  ];
};
