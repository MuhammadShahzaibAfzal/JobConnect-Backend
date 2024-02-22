import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV}` });

export const {
  PORT,
  DB_URL,
  ACCESS_TOEKN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRY,
  PASSWORD_RESET_TOKEN_SECRET,
  PASSWORD_RESET_TOKEN_EXPIRY,
} = process.env;
