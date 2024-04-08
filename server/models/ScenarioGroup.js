import mongoose from "mongoose";

const ScenarioGroupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },

        userId: {
            type: String
        },
        scenarioIds: {
            type: Array,
            defaultValue: [],
        }
    },
    { timestamps: true }
);

export default mongoose.model("ScenarioGroup", ScenarioGroupSchema);
