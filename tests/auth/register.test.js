import request from "supertest";
import { app } from "../../src/app.js";

describe("POST api/auth/register", () => {
  describe("Happy Path", () => {
    it("Should return 200 status code", async () => {
      // AAA
      const result = await request(app).post("/api/auth/register").send({});
      expect(result.statusCode).toBe(200);
    });
  });
});
