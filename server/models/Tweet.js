import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  alias: String,
  agentId: String,
  description: String,
});

const TweetSchema = new mongoose.Schema(
  {
    alias: {
      type: String,

    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,

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


