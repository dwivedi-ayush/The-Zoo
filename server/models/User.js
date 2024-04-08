import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: { type: String },
    password: { type: String },

    agentGroupIds: { type: Array, defaultValue: [] },
    scenarioGroupIds: { type: Array, defaultValue: [] },
    following: { type: Array, defaultValue: [] },


  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
