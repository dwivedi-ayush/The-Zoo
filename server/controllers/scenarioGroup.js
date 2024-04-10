import ScenarioGroup from "../models/ScenarioGroup.js";
import Scenario from "../models/Scenario.js";
import User from '../models/User.js';
import mongoose from 'mongoose';
// Create operation
export const createScenarioGroup = async (req, res, next) => {
    try {
        const scenarioGroup = new ScenarioGroup(req.body);
        const savedScenarioGroup = await scenarioGroup.save();
        const user = await User.findById(req.body.userId)
        user.scenarioGroupIds.push(savedScenarioGroup._id);
        await user.save();
        res.status(201).json(savedScenarioGroup);
    } catch (err) {
        next(err);
    }
};

// Read operation
export const getScenarioGroupById = async (req, res, next) => {
    try {
        const scenarioGroup = await ScenarioGroup.findById(req.params.id);
        res.status(200).json(scenarioGroup);
    } catch (err) {
        next(err);
    }
};



// Delete operation
export const deleteScenarioGroup = async (req, res, next) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        // Retrieve the scenario group to be deleted
        const scenarioGroup = await ScenarioGroup.findById(req.params.id);

        // Extract the user ID from the scenario group
        const userId = scenarioGroup.userId;

        // Delete the scenario group
        await Scenario.deleteMany({ _id: { $in: ScenarioGroup.ScenarioIds } });
        await scenarioGroup.remove();

        // Remove the scenario group ID from the user's scenarioGroupIds array
        const currentUser = await User.findById(userId);
        currentUser.updateOne(
            { _id: userId },
            { $pull: { scenarioGroupIds: mongoose.Types.ObjectId(req.params.id) } }
        );

        // await session.commitTransaction();
        // session.endSession();

        res.status(200).json({ message: "Scenario group deleted successfully" });
    } catch (err) {
        // await session.abortTransaction();
        // session.endSession();
        next(err);
    }
};