import { body } from "express-validator";

export default [
  body("email", "Email is required")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage("Email should be in proper format"),
  body("firstName", "First Name is required")
    .notEmpty()
    .withMessage("First Name should be contains alphabet only")
    .trim(),
  body("lastName", "Last Name is required")
    .notEmpty()
    .withMessage("Last Name should be contains alphabet only")
    .trim(),
  body("password").notEmpty().withMessage("Password is required").trim(),
];

// export default [body("email").notEmpty().withMessage("Email is required!")];
