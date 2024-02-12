import request from "supertest";
import { app } from "../../src/app.js";
import { connectDatabase } from "../../src/config/database.js";
import mongoose from "mongoose";
import UserModel from "../../src/models/userModel.js";

beforeAll(async () => {
  connectDatabase();
});

beforeEach(async () => {
  await UserModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST api/auth/register", () => {
  describe("Given all fields", () => {
    it("Should return 201 status code", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const result = await request(app).post("/api/auth/register").send(data);
      //   Assert
      expect(result.statusCode).toBe(201);
    });
    it("Should return json response", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const result = await request(app).post("/api/auth/register").send(data);
      //   Assert
      expect(result.headers["content-type"]).toMatch(/application\/json/);
    });

    it("Should persist user data", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const result = await request(app).post("/api/auth/register").send(data);
      const users = await UserModel.find();
      //   Assert
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(data.firstName);
      expect(users[0].lastName).toBe(data.lastName);
      expect(users[0].email).toBe(data.email);
    });
  });
});
