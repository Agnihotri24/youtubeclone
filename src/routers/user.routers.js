import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateProfile,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isloggedin } from "../middlewares/isloggedin.js";

const router = Router();

// routes for registered
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

// routes for login user
router.route("/login").post(loginUser);

// protected Routes
// routes for logout user
router.route("/logout").get(isloggedin, logoutUser);

// routes for change password
router.route("/changepassword").post(isloggedin, changePassword);

// routes for change password
router.route("/updateprofile").post(isloggedin, updateProfile);

// routes for change password
router.route("/updateavatar").post(isloggedin, updateAvatar);

// routes for change password
router.route("/updatecoverimage").post(isloggedin, updateCoverImage);
export default router;
