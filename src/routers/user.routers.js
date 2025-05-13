import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateProfile,
  updateAvatar,
  updateCoverImage,
  viewUserChannelProfile,
  viewWatchHistory,
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
router.route("/changepassword").patch(isloggedin, changePassword);

// routes for change password
router.route("/updateprofile").patch(isloggedin, updateProfile);

// routes for change password
router.route("/updateavatar").patch(isloggedin, updateAvatar);

// routes for change password
router.route("/updatecoverimage").patch(isloggedin, updateCoverImage);

// routes for view channel
router.route("/viewchannel/:id").get(isloggedin, viewUserChannelProfile);

// route for watch history
router.route("/watchhistory/:id").get(isloggedin, viewWatchHistory);
export default router;
