import Scenario from '../models/Scenario.js';

export const createScenario = async (req, res, next) => {
    try {
        const scenario = new Scenario(req.body);
        const savedScenario = await scenario.save();
        res.status(201).json(savedScenario);
    } catch (err) {
        next(err);
    }
};


export const getScenario = async (req, res, next) => {
    try {
        const scenario = await Scenario.findById(req.params.id);
        res.status(200).json(scenario);
    } catch (err) {
        next(err);
    }
};


export const deleteScenario = async (req, res, next) => {
    try {
        await Scenario.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Scenario deleted successfully" });
    } catch (err) {
        next(err);
    }
};