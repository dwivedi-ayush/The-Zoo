import mongoose from "mongoose";

const AgentGroupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
        },
        userId: {
            type: String
        },
        agentIds: {
            type: Array,
            defaultValue: [],
        }
    },
    { timestamps: true }
);

export default mongoose.model("AgentGroup", AgentGroupSchema);
