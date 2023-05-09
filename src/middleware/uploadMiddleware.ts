"use strict";

import multer from 'multer'
import { Request,Response } from 'express';
import path from 'path'

type FileData = {
    originalname: string,
    mimetype : string
}

// const DIR = "../client/public/images/";
const profileImg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/ProfileImages");
  },
    filename: (req, file, cb) => {
      // console.log("file are",file)
    cb(
      null,file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check File Type
const filefilter = (req:Request,file: FileData, cb : any) => {
 //Allow ext
    const filetypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    //Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null,true)
    } else {
        cb("Error: Image Only and Check File type!")
    }
};

const profileImgs = multer({ storage: profileImg, limits:{fileSize:5000000}, fileFilter: filefilter }).single("profilePicture");
// module.exports = { profileImgs };
export const ProfileData = {profileImgs}
