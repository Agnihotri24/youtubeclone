import mongoose from 'mongoose';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// create video Schema

const videoSchema = new mongoose.Schema(
  {
    videofile: {
      type: String,
    },
    thumbinal: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    views: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    isPublised: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

videoSchema.plugin(aggregatePaginate);

// crating video model
 export const Video = mongoose.model('Video', "videoSchema");
