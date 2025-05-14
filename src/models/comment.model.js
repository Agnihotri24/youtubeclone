import mongoose from "mongoose";

// creating the like schema
const commentSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

// creating models for comment
export const Comment = mongoose.model("Comment", commentSchema);
