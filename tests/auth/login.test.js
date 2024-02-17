import request from "supertest";
import { app } from "../../src/app.js";
import UserModel from "../../src/models/userModel.js";
import { isJWT } from "../../src/utils/index.js";
import RefreshTokenModel from "../../src/models/refreshTokenModel.js";
import "../testSetup.js";

describe.skip("POST api/auth/login", () => {
  describe("Happy path", () => {
    it("Should return 200 status code if email and password is valid", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: data.password,
      });
      //   Assert
      expect(response.statusCode).toBe(200);
    });

    it("Should return json response if email and password is valid", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: data.password,
      });
      //   Assert
      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });

    it("Should return the accessToken and refreshToken inside a cookie", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: data.password,
      });
      //   Assert
      let accessToken = null;
      let refreshToken = null;
      const cookies = response.headers["set-cookie"] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }
        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });
      // HAVE OR NOT TOKENS in COOKIE?
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();
      // CHECK VALID ACCESS AND REFRESH TOKEN ALSO
      expect(isJWT(accessToken)).toBeTruthy();
      expect(isJWT(refreshToken)).toBeTruthy();
    });

    it("Should persist refresh token into database", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: data.password,
      });
      //   Assert
      const tokens = await RefreshTokenModel.find({
        userID: response.body._id,
      });
      expect(tokens).toHaveLength(1);
    });
  });

  describe("Sad Path", () => {
    it("Should return 422 status code if email field is missing", async () => {
      // Arange
      const data = {
        email: "",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/login").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });

    it("Should return 422 status code if password field is missing", async () => {
      // Arange
      const data = {
        email: "john@gmail.com",
        password: "",
      };
      //   Act
      const response = await request(app).post("/api/auth/login").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });

    it("Should return 422 status if email is not valid", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "testemail",
      };
      //   Act
      const response = await request(app).post("/api/auth/login").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });
    it("Should return 404 status if email is not in database", async () => {
      // Arange
      const data = {
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/login").send(data);
      // Asset
      expect(response.statusCode).toBe(404);
    });

    it("Should return 400 status code  password is incorrect", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/login").send({
        email: data.email,
        password: "abc",
      });
      //   Assert
      expect(response.statusCode).toBe(400);
    });
  });
});
