import Agent from "../models/Agent.js";
import AgentGroup from "../models/AgentGroup.js";
// import { handleError } from "../error.js";


export const createAgent = async (req, res, next) => {
  try {
    const agent = new Agent(req.body);
    const savedAgent = await agent.save();
    const agentGroup = await AgentGroup.findById(req.body.agentGroupId);
    agentGroup.agentIds.push(savedAgent._id);
    await agentGroup.save();
    res.status(201).json(savedAgent);

  } catch (err) {
    next(err);
  }
};

export const getGlobalAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find({ agentGroupId: "" });
    res.status(200).json(agents);
  } catch (err) {
    next(err);
  }
};

export const getAgentsByGroup = async (req, res, next) => {
  try {
    if (req.params.agentgroupid === "0") {
      const agents = await Agent.find({
        agentGroupId: "",
      });
      res.status(200).json(agents);
    }
    else {
      const agents = await Agent.find({
        agentGroupId: req.params.agentgroupid,
      });
      res.status(200).json(agents);
    }
  } catch (err) {
    next(err);
  }
};
export const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ _id: req.params.id });
    res.status(200).json(agent);
  } catch (err) {
    next(err);
  }
};


export const getAgentByAlias = async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ alias: req.params.alias });
    res.status(200).json(agent);

  } catch (err) {
    next(err);
  }
};


export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    const agentGroup = await AgentGroup.findById(agent.agentGroupId)
    const result = await agentGroup.updateOne(
      { $pull: { agentIds: agent._id } }
    );

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    next(err);
  }
};
