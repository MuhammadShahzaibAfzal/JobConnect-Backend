import { body } from "express-validator";

export default [
  body("email", "Email is required")
    .notEmpty()
    .isEmail()
    .withMessage("Email should be in proper format"),
  body("firstName", "First Name is required")
    .notEmpty()
    .isAlpha()
    .withMessage("First Name should be contains alphabet only"),
  body("lastName", "Last Name is required")
    .notEmpty()
    .isAlpha()
    .withMessage("Last Name should be contains alphabet only"),
  body("password").notEmpty().withMessage("Password is required"),
];

// export default [body("email").notEmpty().withMessage("Email is required!")];
