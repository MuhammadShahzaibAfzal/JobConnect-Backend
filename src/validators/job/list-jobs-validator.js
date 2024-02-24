import { query } from "express-validator";

export const listJobRules = () => {
  return [
    query("currentPage").customSanitizer((value) => {
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? 1 : parsedValue;
    }),
    query("perPage").customSanitizer((value) => {
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? 2 : parsedValue;
    }),
  ];
};
