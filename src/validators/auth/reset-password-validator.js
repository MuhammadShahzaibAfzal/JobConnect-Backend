import { body } from "express-validator";

export default [
  body("resetPasswordToken")
    .notEmpty()
    .withMessage("Reset password token  is required"),
  body("newPassword").notEmpty().withMessage("New Password is required").trim(),
];
