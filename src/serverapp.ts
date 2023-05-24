import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import userRouter from "./router/user-route";

const ServerData = () => {
  const app = express();

  config();

  app.use(
    cors({
      credentials: true,
    })
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    "/ProfileImages",
    express.static(path.join(__dirname, "ProfileImages"))
  );

  app.set("view engine", "ejs");
  app.set("views", "views");

  // api path
  app.use("/user", userRouter);

  return app;
};

export default ServerData;
