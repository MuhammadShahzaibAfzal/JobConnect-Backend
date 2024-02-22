import { body } from "express-validator";

export default [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be in valid format")
    .trim(),
];
