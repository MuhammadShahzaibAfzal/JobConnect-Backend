import { body } from "express-validator";

export default [
  body("title").notEmpty().withMessage("Title is required").trim().escape(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim()
    .escape(),

  body("jobNature")
    .notEmpty()
    .withMessage("Job nature is required")
    .trim()
    .escape(),

  body("vacancy")
    .notEmpty()
    .withMessage("vacancy is required")
    .isNumeric()
    .trim()
    .escape(),
  body("minSalary")
    .notEmpty()
    .withMessage("Minimum salary is required")
    .isNumeric()
    .trim()
    .escape(),

  body("maxSalary")
    .notEmpty()
    .withMessage("Maximum salary is required")
    .isNumeric()
    .trim()
    .escape(),

  body("currencyType")
    .notEmpty()
    .withMessage("Currency type required")
    .trim()
    .escape(),

  body("description")
    .notEmpty()
    .withMessage("Description is   required")
    .escape(),

  body("location").optional().trim().escape(),
  body("requirements").optional().trim(),
  body("responsibilites").optional().trim(),
  body("skillsRequired")
    .notEmpty()
    .withMessage("Skills are required")
    .isArray()
    .trim(),

  body("expirationDate")
    .notEmpty()
    .withMessage("Description is   required")
    .isDate()
    .escape(),

  body("campanyName")
    .notEmpty()
    .withMessage("Description is   required")
    .escape(),

  body("companyWebsite").optional().trim(),
];
