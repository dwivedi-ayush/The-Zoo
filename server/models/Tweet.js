import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    alias: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      max: 280,
    },
    likes: {
      type: Array,
      defaultValue: [],
    },
    replies:{
      type:Array,
      defaultValue: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", TweetSchema);
