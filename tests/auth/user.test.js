import request from "supertest";
import { app } from "../../src/app.js";
import UserModel from "../../src/models/userModel.js";
import { isJWT } from "../../src/utils/index.js";
import "../testSetup.js";
import { cookie } from "express-validator";

describe("POST api/auth/self", () => {
  describe("Happy path", () => {
    it("should return user data", async () => {
      // REGISTER USER
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      const response = await request(app).post("/api/auth/register").send(data);
      //   CHECK COOKIE AND SET WITH REQUEST
      const cookies = response.headers["set-cookie"];
      let accessToken = null;
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }
      });
      // REQUEST WITH COOKIES
      const result = await request(app)
        .get("/api/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`]);
      //   ASSERT
      // CHECK IF USER ID MATCHES WITH REGISTERED USE
      const user = result.body;
      expect(user._id).toBe(response.body._id);
    });
  });

  describe("Sad Path", () => {
    it("Should return 401 status code if accessToken is not set to cookie", async () => {
      const response = await request(app).get("/api/auth/self");
      expect(response.statusCode).toBe(401);
    });
  });
});
