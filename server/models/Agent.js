import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema(
  {
    alias: {
      type: String,
    },
    personality: {
      type: String
    },
    userId: {
      type: String
    },
    agentGroupId: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Agent", AgentSchema);
