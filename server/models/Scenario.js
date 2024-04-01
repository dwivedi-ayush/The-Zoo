import mongoose from "mongoose";

const ScenarioSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    scenario: {
      type: String,
      required: true,
      max: 280,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Scenario", ScenarioSchema);
