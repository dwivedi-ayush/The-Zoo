import mongoose from "mongoose";

const ScenarioSchema = new mongoose.Schema(
  {
    userId: {
      type: String,

    },
    title: {
      type: String,

    },
    description: {
      type: String,

      max: 280,
    },
    scenarioGroupId: {
      type: String
    }

  },
  { timestamps: true }
);

export default mongoose.model("Scenario", ScenarioSchema);
