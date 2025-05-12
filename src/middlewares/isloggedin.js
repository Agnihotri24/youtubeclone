import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const isloggedin = asyncHandler(async (req, res, next) => {
try {
  // Get token from cookies
  const token = req.cookies?.AccessToken;
    
  if (!token) {
    throw new ApiError(401, "Access token missing. Please login.");
  }

  // Verify and decode the token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // Attach decoded user info to request
  req.user = decoded;
 
  next();
} 
catch (error) {
    throw new ApiError('400', "invalid Access token")
}

});

export { isloggedin };
