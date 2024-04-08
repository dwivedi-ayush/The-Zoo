import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  alias: String,
  description: String,
  replyID: String,
  repliedTO: String,
});

const TweetSchema = new mongoose.Schema(
  {
    alias: {
      type: String,

    },
    agentId: {
      type: String,

    },
    scenarioGroupId: {
      type: String,

    },
    description: {
      type: String,

      max: 280,
    },
    likes: {
      type: Array,
      defaultValue: [],
    },
    replies: {
      type: [ReplySchema], // Define array of replies referencing ReplySchema
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", TweetSchema);


