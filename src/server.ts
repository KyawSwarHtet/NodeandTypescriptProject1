import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { config } from 'dotenv';
import userRouter from '../src/router/user-route';

const app = express();

config();

app.use(cors({
  credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URL!).then(() => console.log("connected with MONGODB", process.env.MONGO_URL)).catch((err) => {
  console.log(err);
});
app.use(
  "/ProfileImages",
  express.static(path.join(__dirname, "ProfileImages"))
);
console.log("dirname", __dirname);

app.set("view engine", "ejs");
app.set("views", "views");

// api path
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;
console.log("server is running on ", PORT);
app.listen(PORT)

