import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  alias: String,
  description: String,
  replyID: String,
  repliedTO: String,
});

const dataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reply_array: [ReplySchema],
});

const DataModel = mongoose.model("Data", dataSchema);

export default mongoose.model("Replies", ReplySchema);
