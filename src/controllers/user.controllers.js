import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadfileoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// registered user controller
const registerUser = asyncHandler(async (req, res) => {
  // first recieveing the data from front end
  const { username, email, fullName, password } = req.body;

  // validating the all details
  // validate username
  if (username.trim() === "") {
    throw new ApiError(400, "username can't empty");
  }

  // validating email
  if (email.trim() === "") {
    throw new ApiError(400, "Email can't empty");
  }
  // validating the full name feild
  if (fullName.trim() === "") {
    throw new ApiError(400, "full name can;t empty");
  }
  // validating the password
  if (password.length() < 8) {
    throw new ApiError(400, "Password must be atleast 8 digit");
  }

  // cheaking the user exist or not
  const isexistuser = User.findOne({ username, email });

  if (isexistuser) {
    throw new ApiError(408, "user already exist");
  }

  // now reciveting the path of avater and coverimage
  const avatarlocalpath = req.files?.avatar[0].path;
  const coverimagelocalpath = req.files?.coverImage[0].path;

  if (!avatarlocalpath) throw new ApiError(400, "Avatar is required ");

  // now we have local path of avatar so we need to upload on clodinary
  const avatarupload = await uploadfileoncloudinary(avatarlocalpath);
  const coverimageupload = await uploadfileoncloudinary(coverimagelocalpath);

  if (!avatarupload) throw new ApiError(400, "Avatar is required ");

  // now creating user

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatarupload.url(),
    coverImage: coverimageupload.url() || "",
  });

  // now remove cheaking user create or not
  if (!user) throw new ApiError(500, "Some issue while creating user");

  const createduser = user
    .findOne({ _id: user._id })
    .select("-password -refresheToken");

  // now sending the response vis apiResponse
  res.json(new ApiResponse(200, createduser, "User created sucessfully"));
});

export { registerUser };
