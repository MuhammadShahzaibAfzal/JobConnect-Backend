import request from "supertest";
import { app } from "../../src/app.js";
import UserModel from "../../src/models/userModel.js";
import { isJWT } from "../../src/utils/index.js";
import "../testSetup.js";
import { cookie } from "express-validator";
import RefreshTokenModel from "../../src/models/refreshTokenModel.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET_KEY } from "../../src/config/index.js";
import { getCookies } from "../testSetup.js";

describe("POST api/auth/refresh-tokens", () => {
  describe("Happy path", () => {
    it("Should return new access token and refresh tokens", async () => {
      // ARRAGE
      // USER REGISTER
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      const response = await request(app).post("/api/auth/register").send(data);
      // GET REFRESH TOKEN AND ACCESS TOKEN FROM RESPONSE
      const { refreshToken: oldRefreshToken, accessToken: oldAccessToken } =
        getCookies(response);
      // ACTION
      // MAKE REQUEST WITH COOKIE
      const result = await request(app)
        .get("/api/auth/refresh-tokens")
        .set("Cookie", [`refreshToken=${oldRefreshToken};`])
        .send();
      // GET NEW REFRESH TOKEN AND ACCESS TOKEN
      const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
        getCookies(result);
      // ASSERT
      expect(newRefreshToken).not.toEqual(oldRefreshToken);
      // expect(newAccessToken).not.toEqual(oldAccessToken);
    });
  });

  describe("Sad Path", () => {
    it("Should return 400 status code if refresh token is not in cookies", async () => {
      const response = await request(app)
        .get("/api/auth/refresh-tokens")
        .send();
      expect(response.statusCode).toBe(400);
    });

    it("Should return 400 status code if refresh token is not valid", async () => {
      const response = await request(app)
        .get("/api/auth/refresh-tokens")
        .set("Cookie", ["refreshToken=jdjsdjsdjasdfjajksdjksdd;"])
        .send();
      expect(response.statusCode).toBe(400);
    });

    it("Should return 400 status code if refresh token is revoked", async () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      const response = await request(app).post("/api/auth/register").send(data);
      // GET REFRESH TOKEN FROM RESPONSE
      const { refreshToken } = getCookies(response);
      //   DELETE TOKEN FROM DATABASE
      const { jti } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
      await RefreshTokenModel.findByIdAndDelete(jti);
      //   AFTER DELETE TOKEN NOW CALL REFRESH TOKEN
      const result = await request(app)
        .get("/api/auth/refresh-tokens")
        .set("Cookie", [`refreshToken=${refreshToken};`])
        .send();
      expect(result.statusCode).toBe(400);
    });

    it("Should return 400 status code if user not found", async () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      const response = await request(app).post("/api/auth/register").send(data);
      // GET REFRESH TOKEN FROM RESPONSE
      const { refreshToken } = getCookies(response);
      //   DELETE REGISTERD USER
      await UserModel.findByIdAndDelete(response.body._id);
      //   AFTER DELETE USER NOW CALL REFRESH TOKEN
      const result = await request(app)
        .get("/api/auth/refresh-tokens")
        .set("Cookie", [`refreshToken=${refreshToken};`])
        .send();
      expect(result.statusCode).toBe(400);
    });
  });
});
