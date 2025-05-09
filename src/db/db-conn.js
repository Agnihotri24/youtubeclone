import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

dotenv.config();

const connectDB = async () => {
  try {

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );

    console.log(` MongoDB Connected: ${connectionInstance.connection.host}`);

  } catch (error) {
    console.error(" DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
