import request from "supertest";
import { app } from "../../src/app.js";
import UserModel from "../../src/models/userModel.js";
import { isJWT } from "../../src/utils/index.js";
import "../testSetup.js";
import { cookie } from "express-validator";
import { getCookies } from "../testSetup.js";

describe.skip("POST api/auth/logout", () => {
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
      const { accessToken } = getCookies(response);
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
    
  });
});
