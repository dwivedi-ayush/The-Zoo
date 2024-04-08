import AgentGroup from '../models/AgentGroup.js';


export const createAgentGroup = async (req, res, next) => {
    try {
        const agentGroup = new AgentGroup(req.body);
        const savedAgentGroup = await agentGroup.save();
        res.status(201).json(savedAgentGroup);
    } catch (err) {
        next(err);
    }
};

export const getAgentGroupById = async (req, res, next) => {
    try {
        const agentGroup = await AgentGroup.findById(req.params.id);
        res.status(200).json(agentGroup);
    } catch (err) {
        next(err);
    }
};

export const deleteAgentGroup = async (req, res, next) => {
    try {
        await AgentGroup.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Agent group deleted successfully" });
    } catch (err) {
        next(err);
    }
};