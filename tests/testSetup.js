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
