import ScenarioGroup from "../models/ScenarioGroup.js";

// Create operation
export const createScenarioGroup = async (req, res, next) => {
    try {
        const scenarioGroup = new ScenarioGroup(req.body);
        const savedScenarioGroup = await scenarioGroup.save();
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
    try {
        await ScenarioGroup.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Scenario group deleted successfully" });
    } catch (err) {
        next(err);
    }
};
