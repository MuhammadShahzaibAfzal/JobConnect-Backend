import request from "supertest";
import { app } from "../../src/app.js";
import "../testSetup.js";
import { getCookies } from "../testSetup.js";
import UserModel from "../../src/models/userModel.js";

describe("POST api/auth/change-password", () => {
  describe("Happy path", () => {
    it("Should change password", async () => {
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
        .post("/api/auth/change-password")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send({
          currentPassword: "secret",
          newPassword: "newPass",
        });

      // ASSERT
      const user = await UserModel.findOne({ email: data.email });
      const isMatch = await user.isPasswordCorrect("newPass");
      expect(result.statusCode).toBe(200);
      expect(isMatch).toBeTruthy();
    });
  });

  describe("Sad Path", () => {
    it("Should return 401 status code if user is not login", async () => {
      const response = await request(app)
        .post("/api/auth/change-password")
        .send({ newPassword: "new", currentPassword: "old" });
      expect(response.statusCode).toBe(401);
    });

    it("Should return 400 if current password is invalid", async () => {
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
        .post("/api/auth/change-password")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send({
          currentPassword: "invalidpass",
          newPassword: "newPass",
        });

      // ASSERT
      expect(result.statusCode).toBe(400);
    });

    it("Should return 400 if current password and new password is same", async () => {
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
        .post("/api/auth/change-password")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send({
          currentPassword: "same",
          newPassword: "same",
        });

      // ASSERT
      expect(result.statusCode).toBe(400);
    });
  });
});
