import supertest from "supertest";
import ServerData from "../serverapp";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../model/userModel";
import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv";
import { generateToken } from "../controllers/userController";
import path from "path";
const app = ServerData();
dotenv.config();

const user_Id = new mongoose.Types.ObjectId();
let UserToken: string = ""; //testing token

let token: string | any = ""; // take user token when user login
let userId: string | ObjectId; //take user id from user login

const testing_image = path.resolve(__dirname, `./test_images/hair5.jpg`);

console.log("testingimage ", testing_image);

export const userPayload = {
  email: "kyawswar1@gmail.com",
  username: "kyaw swar",
  password: "helloKyaw",
};

export const emptyuserPayload = {
  email: "",
  username: "",
  password: "",
};

export const InvaliduserPayload = {
  email: "kyawswar",
  username: "J",
  password: "12ks",
};

export const successLoginPayload = {
  email: "kyawswar1@gmail.com",
  password: "helloKyaw",
};

describe("product", () => {
  /* Connecting to the database before each test. */
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URL!);
    await User.deleteMany();
  });

  /* Closing database connection after each test. */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // beforeAll(async () => {
  //   const mongoServer = await MongoMemoryServer.create();
  //   await mongoose.connect(mongoServer.getUri());
  // });

  // afterAll(async () => {
  //   await mongoose.disconnect();
  //   await mongoose.connection.close();
  // });

  //Register data testing
  describe("Register route Testing", () => {
    describe("create new user", () => {
      it("should return 201 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .post("/user/register")
          .send(userPayload);

        expect(statusCode).toBe(201);
        expect(header["content-type"]).toMatch(/application\/json/);
        expect(body).toBeDefined();
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          address: expect.any(String),
          createdAt: expect.any(String),
          email: expect.any(String),
          gender: expect.any(String),
          login: false,
          password: expect.any(String),
          profilePicture: expect.any(Array),
          updatedAt: expect.any(String),
          username: expect.any(String),
        });
      });
    });

    describe("Empty username, email or password", () => {
      it("should return 404 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .post("/user/register")
          .send(emptyuserPayload);
        expect(header["content-type"]).toMatch(/application\/json/);
        expect(statusCode).toBe(404);
        expect(body.status).toEqual("FAILED");
      });
    });

    describe("Invalid username, email or password", () => {
      it("should return 400 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .post("/user/register")
          .send(InvaliduserPayload);

        expect(header["content-type"]).toMatch(/application\/json/);
        expect(statusCode).toBe(400);
        expect(body.status).toEqual("FAILED");
      });
    });
  });

  //Login data testing
  describe("Login route Testing", () => {
    describe("login successful user", () => {
      it("should return 200 status code", async () => {
        //generate new token for testing
        UserToken = generateToken(user_Id);

        const { statusCode, body, header } = await supertest(app)
          .post("/user/login")
          .send(successLoginPayload);

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);
        expect(body).toBeDefined();
        token = body.token;
        userId = body._id;
        expect(body).toEqual({
          _id: expect.any(String),
          email: "kyawswar1@gmail.com", // expect.any(String),
          login: true,
          token: expect.any(String),
          username: expect.any(String),
        });
      });
    });
  });

  //get all user testing
  describe("GET product route", () => {
    describe("given the product does exits", () => {
      it("should return 200 status and product", async () => {
        const { body, statusCode, header } = await supertest(app).get(
          "/user/alluser"
        );
        // const res = await supertest(app).get("/user/alluser");

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);
        // expect(body).toBeInstanceOf(Array);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
    });
  });

  //detail user data testing
  describe("GET Detail user Testing", () => {
    describe("get user detail successful", () => {
      it("should return 200 status code", async () => {
        const { statusCode, body, header } = await supertest(app).get(
          `/user/detail/${userId}`
        );

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);
        expect(body).toBeDefined();
        expect(body._id).toBe(`${userId}`);
      });
    });
  });

  //update user data testing
  describe("PUT update user Testing and user should already Loggedin ", () => {
    describe("update user data successful", () => {
      it("should return 200 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .put(`/user/update/${userId}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ address: "hlaing region" });

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);

        expect(body).toBeDefined();

        expect(body._id).toBe(`${userId}`);
      });
    });

    //testing for Forbidden user response
    describe("Forbidden User, should not allow to Different user with difference token", () => {
      it("should return 403 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .put(`/user/update/${userId}`)
          .set("Authorization", `Bearer ${UserToken}`)
          .send({ address: "hlaing region" });

        expect(statusCode).toBe(403);
      });
    });
  });

  //update user profile testing
  describe("PUT update userProfile Picture Testing and user should already Loggedin ", () => {
    describe("update userProfile data successful", () => {
      it("should return 200 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .put(`/user/profileupdate/${userId}`)
          .set("Authorization", `Bearer ${token}`)
          .attach("profilePicture", testing_image);

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);

        expect(body).toBeDefined();
        console.log("body is", body);
        expect(body.profilePicture.length).toBeGreaterThan(0);
      });
    });
  });

  //update user profile testing
  describe("Delete user data Testing and user should already Loggedin ", () => {
    describe("delete user data successful", () => {
      it("should return 200 status code", async () => {
        const { statusCode, body, header } = await supertest(app)
          .delete(`/user/delete/${userId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(200);
        expect(header["content-type"]).toMatch(/application\/json/);

        expect(body).toBeDefined();

        expect(body.status).toEqual("Success");
      });
    });
  });
});
