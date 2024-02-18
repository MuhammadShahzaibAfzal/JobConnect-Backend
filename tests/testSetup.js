import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";

beforeAll(async () => {
  connectDatabase();
});

beforeEach(async () => {
  if (mongoose.connection) {
    await mongoose.connection.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

export const getCookies = (response) => {
  const cookies = response.headers["set-cookie"] || [];
  let refreshToken = null;
  let accessToken = null;
  cookies.forEach((cookie) => {
    if (cookie.startsWith("refreshToken=")) {
      refreshToken = cookie.split(";")[0].split("=")[1];
    }
    if (cookie.startsWith("accessToken=")) {
      accessToken = cookie.split(";")[0].split("=")[1];
    }
  });
  return {
    refreshToken,
    accessToken,
  };
};
