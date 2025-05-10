import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// defining the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      require: true,
    },
    fullName: {
      type: String,
      require : true
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      require : true
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refresheToken: {
      type: String,
    },
  },
  { timestamps: true },
);

// setting some middleware

// middleware for convert password into hash password
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// methode for cheaking password
userSchema.methods.cheakPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// middleware for generate token by custom methode
userSchema.methods.AccesTokenGenerate =  function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TIME },
  );
};


// middleware for generate token by custom methode
userSchema.methods.refresheTokenGenerate =  function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TIME },
  );
};

// now creating models
export const User = mongoose.model("User", userSchema);
