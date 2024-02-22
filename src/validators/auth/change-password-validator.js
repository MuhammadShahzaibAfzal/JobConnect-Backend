import { body } from "express-validator";

export default [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .trim(),
  body("newPassword").notEmpty().withMessage("New Password is required").trim(),
];
