import request from "supertest";
import { app } from "../../src/app.js";
import "../testSetup.js";
import { getCookies } from "../testSetup.js";

describe("POST api/auth/logout", () => {
  describe("Happy path", () => {
    it("Should remove cookies if user is login", async () => {
      // Arragnge
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      const response = await request(app).post("/api/auth/register").send(data);
      const { accessToken } = getCookies(response);
      // ACT
      const result = await request(app)
        .get("/api/auth/logout")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();

      // ASSERT
      const { accessToken: access_token, refreshToken } = getCookies(result);
      expect(access_token).toBe("");
      expect(refreshToken).toBe("");
    });
  });

  describe("Sad Path", () => {
    it("Should return 401 status code if user is not login", async () => {
      const response = await request(app).get("/api/auth/logout").send();
      expect(response.statusCode).toBe(401);
    });
  });
});
