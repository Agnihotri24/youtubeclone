import { Router } from 'express'
import { registerUser } from '../controllers/user.controllers.js';
import {upload }from '../middlewares/multer.middleware.js'

const router = Router();

// routes for registered
router.route("/registered").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount : 1
    },
  ]),
  registerUser,
);

  
// routes for login user
// router.route("/login").post(loginUser);

// routes for logout user
// router.route("/logout").get(registerUser);

export default router
