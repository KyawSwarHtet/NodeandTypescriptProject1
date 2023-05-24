import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { config } from "dotenv";
import userRouter from "../src/router/user-route";
import ServerData from "./serverapp";

const app = ServerData();
config();

const PORT = process.env.PORT || 5000;
console.log("server is running on ", PORT);
app.listen(PORT, async () => {
  await mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => console.log("connected with MONGODB", process.env.MONGO_URL))
    .catch((err) => {
      console.log(err);
    });
});
