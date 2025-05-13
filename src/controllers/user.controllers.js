import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadfileoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// methode to set refreshToken in database and acesstoken and return
const generateRefreshAndAccessToken = async (userId) => {
  // finding the user
  const user = await User.findById(userId);

  // finding the refresh and accesstoken
  const AccessToken = user.AccesTokenGenerate();
  const RefreshToken = user.refresheTokenGenerate();

  // storing refreshtoken in database
  user.refresheToken = RefreshToken;
  // save the credentails
  user.save();
  ///  return the object

  return { AccessToken, RefreshToken };
};

// registered user controller
const registerUser = asyncHandler(async (req, res) => {
  // first recieveing the data from front end
  const { username, email, fullName, password } = req.body;

  // validating the all details
  // validate username either Null
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
  if (password.length < 8) {
    throw new ApiError(400, "Password must be atleast 8 digit");
  }

  // cheaking the user exist or not
  const isexistuser = await User.findOne({ username });

  if (isexistuser) {
    throw new ApiError(408, "user already exist");
  }

  // now reciveting the path of avater and coverimage
  const avatarlocalpath = req.files?.avatar[0].path;

  // in case coverimage are not upload then it may be give arror so handle it
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
    avatar: avatarupload.url,
    coverImage: coverimageupload?.url || "",
  });

  // now remove cheaking user create or not
  if (!user) throw new ApiError(500, "Some issue while creating user");

  const createduser = await User.findOne({ _id: user._id }).select(
    "-password -refresheToken",
  );

  // console.log(createduser);
  console.log(createduser);

  // now sending the response vis apiResponse
  res.json(new ApiResponse(200, createduser, "User created sucessfully"));
});

// login controller
const loginUser = asyncHandler(async (req, res) => {
  // first recieve the username or email , password from front end
  const { username, email, password } = req.body;

  // validate the username or email
  if (!username && !email)
    throw new ApiError(400, "username and password is requied");

  // finding user in database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  // now cheak userexist ot not
  if (!user) throw new ApiError(402, "User does't exist");

  //  cheaking the password
  const isValidpassword = user.cheakPassword(password);

  // is password correct or not
  if (!isValidpassword) throw new ApiError(404, "Invalid password");

  //  setting the AccessToken and refreshToken
  const { AccessToken, RefreshToken } = await generateRefreshAndAccessToken(
    user._id,
  );

  // finding the user
  const loginuser = await User.findById(user._id).select(
    "-password, -refresheToken",
  );

  // set the cookie into response
  res.cookie("AccessToken", AccessToken, { httpOnly: true, sequre: true });
  res.cookie("RefreshToken", RefreshToken, { httpOnly: true, sequre: true });

  // sending the json Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loginuser, AccessToken, RefreshToken },
        "User login Sucessfully",
      ),
    );
});

// logout controller
const logoutUser = asyncHandler(async (req, res) => {
  // finding the user and update the refreshtoken

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { refresheToken: undefined } },
  );

  // now remove the cookies from user feild
  return res
    .clearCookie("AccessToken", { httpOnly: true, sequre: true })
    .clearCookie("RefreshToken", { httpOnly: true, sequre: true })
    .json(new ApiResponse(200, "user Logout Sucessfully"));
});


// update password controller
const changePassword = asyncHandler(async (req, res) => {
  // finding the currend login user
  const userid = req.user._id;

  // reciving the data from front end
  const { oldpassword, newpassword } = req.body;

  // finding the user
  const user = await User.findById(userid);

  // comapre the old password with database store password
  const isValidpassword = user.cheakPassword(oldpassword);

  if (!isValidpassword) throw ApiError(400, "Incorrect old password");

   user.password = newpassword;
   await user.save({validateBeforeSave : false})

  res.status(200).json(new ApiResponse(200, "Password change sucessfully"));
});


// we can write the controller to change more account details like email, name,

// update password controller
const updateProfile = asyncHandler(async (req, res) => {
  // finding the currend login user
  const userid = req.user._id;

  // reciving the data from front end
  const { email, userName } = req.body;

  const user = await User.findById(userid);

  // comapre the old password with database store password
  if (email === user.email) throw new ApiError(400, "Try different email");

  if (fullName === user.fullName) throw new ApiError(400, "Try different Name");

  user.email = email;
  user.fullName = fullName;

  user.save({ validateBeforeSave: false });


  res.status(200).json(new ApiResponse(200, "Profile update sucessfully"));
});

// update the avater

const updateAvatar = asyncHandler( async (req, res)=>
{
     // recicving the file 
     const avatarlocalpath = req.files?.avatar;

     if(!avatarlocalpath)
       throw (400, "Something issue while updating avatar")

     // finding the user
     const user = await User.findById(req.user._id) ;

     // upload on cloudinary
    const cloudinaryavatarpath = await uploadfileoncloudinary(avatarlocalpath)
     // update the avatar
     user.avatar = cloudinaryavatarpath.url;

    await user.save()

      res.status(200).json(
        new ApiResponse(200, "avatar Image updated")
      )
 
})

// update cover image controller

const updateCoverImage = asyncHandler(async (req, res) => {
  // recicving the file
  const coverImagelocalpath = req.files?.coverImage;

  if (!coverImagelocalpath)
    throw (400, "Something issue while updating coverimage");

  // finding the user
  const user = await User.findById(req.user._id);

  // upload on cloudinary
  const cloudinarycoverImagelocalpath = await uploadfileoncloudinary(coverImagelocalpath);
  // update the avatar
  user.coverImage = cloudinarycoverImagelocalpath.url;

  await user.save();

  res.status(200).json(new ApiResponse(200, "cover Image updated"));
});

// view channel controller
const viewUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully"),
    );
});

// view watch history

const viewWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully",
      ),
    );
});



export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateProfile,
  updateAvatar,
  updateCoverImage,
  viewUserChannelProfile,
  viewWatchHistory,
};
