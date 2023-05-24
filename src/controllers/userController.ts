import jwt from "jsonwebtoken";
import fs from "fs";

import mainPath from "../baseFilepath";
import User from "../model/userModel";
import bcrypt from "bcryptjs";
import path from "path";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

export interface RequestData {
  id: ObjectId;
  username: string;
  email: string;
  password: string;
  login: Boolean;
  gender: string;
  address: string;
  profilePicture: Array<ProfileData | null>;
}

export type ProfileData = {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: string;
};

//Register user
//@route Post/api/users/
const registerUser = async (req: Request, res: Response) => {
  try {
    let { username, email, password }: RequestData = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (!username || !email || !password) {
      return res.status(404).json({
        status: "FAILED",
        message: "Empty input Fields!",
      });
    }

    //checking user name
    if (!/^[a-zA-Z ]*$/.test(username)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid name entered",
      });
    }

    //checking email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid email entered",
      });
    }
    //checking password length
    if (password.length < 8) {
      return res.status(400).json({
        status: "FAILED",
        message: "Password is too short!",
      });
    }

    //find user email from database
    await User.find({ email })
      .then((result) => {
        if (result.length) {
          //A user already exits
          return res.status(400).json({
            status: "FAILED",
            message: "User with the provided email already exists",
          });
        }
        //to create a new user
        //password handling
        const saltRounds = 10;
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => {
            const newUser = new User({
              username,
              email,
              password: hashedPassword,
            });
            newUser
              .save()
              .then((result) => {
                //handle account verification
                console.log("user  post is success");

                res.status(201).json(result);
                //  res.redirect("/register");
              })
              .catch((err) => {
                res.status(400).json({
                  status: "FAILED",
                  message: "An error occurred while saving user account!",
                });
              });
          })
          .catch((err) => {
            res.status(400).json({
              status: "FAILED",
              message: "An error occurred while hashing password!",
            });
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: "FAILED",
          message: "An error occured while checking for existing user!",
        });
      });
  } catch (error) {
    console.log(error);
  }
};

//@route Post/api/users/login
const loginUser = async (req: Request, res: Response) => {
  try {
    let { email, password }: RequestData = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
      return res.status(400).json({
        status: "FAILED",
        message: "Empty credentials supplied",
      });
    }

    /* Check for user email*/
    const user: RequestData | null = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      User.updateOne({ _id: user.id }, { login: true })
        .then(() => {
          res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            login: true,
            token: generateToken(user.id),
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: "FAILED",
            message: "An error occur while updating login data update",
          });
        });
    } else {
      res.status(400).json({
        status: "FAILED",
        message: "Email, Password is something wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/*Generate JWT */
export const generateToken = (id: ObjectId | object) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "30d",
  });
};

//update user information fucntion
const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, address, gender }: RequestData = req.body;
    const { id } = req.params;
    /* Check for user */
    const user = await User.findById(id);
    console.log("user is", user);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "user not found",
      });
    }
    //update user
    await User.updateOne(
      { _id: id },
      {
        $set: {
          username: username,
          login: true,
          gender: gender,
          address: address,
        },
      }
    );
    const updatedData = await User.findById(id);
    res.status(200).json({
      _id: id,
      username: updatedData?.username,
      email: updatedData?.email,
      address: updatedData?.address,
      gender: updatedData?.gender,
      profilePicture: updatedData?.profilePicture,
      login: updatedData?.login,
    });
  } catch (error) {
    console.log(error);
  }
};

//update user profile img fucntion
const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const profilePicture = req.file;
    const { id } = req.params;

    const userDetail: any = await User.findById(id);

    /* Check for user */
    if (!userDetail) {
      return res.status(404).json({
        status: "FAILED",
        message: "user not found",
      });
    }

    let filesArray = [];
    if (profilePicture !== undefined && profilePicture !== null) {
      const file = {
        fileName: profilePicture.filename,
        filePath: profilePicture.path,
        fileType: profilePicture.mimetype,
        fileSize: fileSizeFormatter(profilePicture.size, 2),
      };
      filesArray.push(file);

      if (
        userDetail.profilePicture[0] !== undefined ||
        userDetail.profilePicture.length !== 0
      ) {
        //for Image File to when when we do update picture
        fs.unlink(
          path.join(mainPath, userDetail.profilePicture[0].filePath),
          (err) => {
            if (err) {
              return console.log("error occur", err);
            }
            console.log("file is deleted successully");
          }
        );
      }
      //update user
      await User.updateOne(
        { _id: id },
        {
          $set: {
            profilePicture: filesArray,
          },
        }
      );
    }
    const updatedData: RequestData | null = await User.findById(id);
    res.status(200).json({
      _id: id,
      username: updatedData?.username,
      email: updatedData?.email,
      address: updatedData?.address,
      gender: updatedData?.gender,
      profilePicture: updatedData?.profilePicture,
      login: updatedData?.login,
    });
  } catch (error) {
    console.log(error);
  }
};

//for img file format
const fileSizeFormatter = (bytes: number, decimal: number) => {
  if (bytes === 0) {
    return "0 byte";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + "-" + sizes[index]
  );
};

// for all deletepost
//@route Delete/api/deletepost/:id
const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    // const id = req.params.id;
    const id = req.params.id;
    // console.log("id is",id)
    const userDetail: RequestData | null = await User.findById(id);
    // console.log("user detail id",userDetail)

    /* Check for user */
    if (!userDetail) {
      return res.status(404).json({
        status: "FAILED",
        message: "user not found",
      });
    }
    userDetail.profilePicture[0] === null ||
    userDetail.profilePicture.length <= 0
      ? console.log("file is empty file")
      : fs.unlink(
          path.join(mainPath, userDetail.profilePicture[0].filePath),
          (err) => {
            // return fs.unlink(path.join(data.filePath), (err) => {
            if (err) {
              return console.log("error occur", err);
            }
            console.log("file is deleted successully");
          }
        );

    await User.findByIdAndRemove(id).exec();
    res.status(200).json({
      status: "Success",
      message: "User Account Deleted Successfully",
    });
    // res.send();
  } catch (error) {
    console.log(error);
  }
};

/*get all user without token */
const getAlluser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get user detial
const getUserDetail = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const userdetail: RequestData | null = await User.findById(id);
    res.status(200).send(userdetail);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const userInfo = {
  registerUser,
  loginUser,
  updateUser,
  updateUserProfile,
  deleteUserAccount,
  getAlluser,
  getUserDetail,
};
