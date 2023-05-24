import express from "express";
import { ProfileData } from "../middleware/uploadMiddleware";
import { userInfo } from "../controllers/userController";
import protect from "../middleware/authMiddleware";
const router = express.Router();

// router.post("/login", loginUser);
router.post("/register", userInfo.registerUser);

router.post("/login", userInfo.loginUser);
//get all user information
router.get("/alluser", userInfo.getAlluser);
//get user detail information
router.get("/detail/:id", userInfo.getUserDetail);

router.put(
  "/profileupdate/:id",
  protect,
  ProfileData.profileImgs,
  userInfo.updateUserProfile
);
router.put("/update/:id", protect, userInfo.updateUser);
router.delete("/delete/:id", protect, userInfo.deleteUserAccount);
// router.get("/detail/:id", getDetail);
// router.put("/update/:id", protect, uploadprofile, updateUser);

export default router;
