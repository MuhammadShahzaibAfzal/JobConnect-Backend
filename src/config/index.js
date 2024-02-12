import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV}` });

export const { PORT, DB_URL } = process.env;
