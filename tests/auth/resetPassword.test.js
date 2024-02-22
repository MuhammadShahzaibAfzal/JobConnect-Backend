import request from "supertest";
import { app } from "../../src/app.js";
import "../testSetup.js";
import { getCookies } from "../testSetup.js";

describe("POST api/auth/reset-password", () => {
  describe("Happy path", () => {
    it("Should reset password", async () => {
      // Arragnge
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await request(app).post("/api/auth/register").send(data);
      const result = await request(app).post("/api/auth/forget-password").send({
        email: data.email,
      });

      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          newPassword: "newPass",
          resetPasswordToken: result.body.resetPasswordToken,
        });

      // ASSERT
      expect(response.statusCode).toBe(200);
    });
  });

  //   describe("Sad Path", () => {
  //     it("Should return 422 status code if email is missing", async () => {
  //       const response = await request(app)
  //         .post("/api/auth/forget-password")
  //         .send({});
  //       expect(response.statusCode).toBe(422);
  //     });

  //     it("Should return 404 if user does not exist", async () => {
  //       // ACT
  //       const result = await request(app)
  //         .post("/api/auth/forget-password")

  //         .send({
  //           email: "dummy@gmail.com",
  //         });

  //       // ASSERT
  //       expect(result.statusCode).toBe(404);
  //     });

  //     it("Should return 400 if current password and new password is same", async () => {
  //       // Arragnge
  //       const data = {
  //         firstName: "John",
  //         lastName: "Doe",
  //         email: "johndoe@gmail.com",
  //         password: "secret",
  //       };
  //       const response = await request(app).post("/api/auth/register").send(data);
  //       const { accessToken } = getCookies(response);
  //       // ACT
  //       const result = await request(app)
  //         .post("/api/auth/change-password")
  //         .set("Cookie", [`accessToken=${accessToken};`])
  //         .send({
  //           currentPassword: "same",
  //           newPassword: "same",
  //         });

  //       // ASSERT
  //       expect(result.statusCode).toBe(400);
  //     });
  //   });
});
