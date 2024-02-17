import request from "supertest";
import { app } from "../../src/app.js";
import UserModel from "../../src/models/userModel.js";
import { isJWT } from "../../src/utils/index.js";
import RefreshTokenModel from "../../src/models/refreshTokenModel.js";
import "../testSetup.js";

describe("POST api/auth/register", () => {
  describe("Happy path", () => {
    it("Should return 201 status code", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      //   Assert
      expect(response.statusCode).toBe(201);
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
      const response = await request(app).post("/api/auth/register").send(data);
      //   Assert
      expect(response.headers["content-type"]).toMatch(/application\/json/);
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
      await request(app).post("/api/auth/register").send(data);
      const users = await UserModel.find();
      //   Assert
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(data.firstName);
      expect(users[0].lastName).toBe(data.lastName);
      expect(users[0].email).toBe(data.email);
    });

    it("Should trim firstName,lastName,email and password", async () => {
      // Arange
      const data = {
        firstName: " John ",
        lastName: " Doe ",
        email: "  johndoe@gmail.com  ",
        password: "  secret ",
      };
      //   Act
      await request(app).post("/api/auth/register").send(data);
      const users = await UserModel.find();
      const user = users[0];
      //   Assert
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(user.email).toBe("johndoe@gmail.com");
      expect(user.isPasswordCorrect("secret")).toBeTruthy();
    });

    it("Should assign role to users", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      await request(app).post("/api/auth/register").send(data);
      const users = await UserModel.find();
      //   Assert
      expect(users[0].role).toBe("User");
    });
    it("Should hash password before save into database", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      await request(app).post("/api/auth/register").send(data);
      const users = await UserModel.find();
      const isMatch = await users[0].isPasswordCorrect(data.password);
      // $2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
      // 60 charecter hash. $2b-> Algo $10 -> salt round
      //   Assert
      expect(users[0].password).not.toBe(data.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
      expect(isMatch).toBe(true);
    });

    it("Should return the accessToken and refreshToken inside a cookie", async () => {
      // Arrange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      // Assert
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

    it("Should store refreshToken into database", async () => {
      // Arrange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      // Assert
      const tokens = await RefreshTokenModel.find({
        userID: response.body._id,
      });
      expect(tokens).toHaveLength(1);
    });
  });

  describe("Sad Path", () => {
    it("Should return 400 if email is already exists", async () => {
      // Arrange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "secret",
      };
      // save one record to test unique email
      await UserModel.create(data);
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);

      expect(response.statusCode).toBe(409);
    });
    it("Should return 422 status code if email field is missing", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });

    it("Should return 422 status code if firstName field is missing", async () => {
      // Arange
      const data = {
        lastName: "Doe",
        email: "john@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });

    it("Should return 422 status code if lastName field is missing", async () => {
      // Arange
      const data = {
        firstName: "Doe",
        email: "john@gmail.com",
        password: "secret",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });

    it("Should return 422 status code if lastName field is missing", async () => {
      // Arange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
      };
      //   Act
      const response = await request(app).post("/api/auth/register").send(data);
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
      const response = await request(app).post("/api/auth/register").send(data);
      // Asset
      expect(response.statusCode).toBe(422);
    });
  });
});
