import AgentGroup from '../models/AgentGroup.js';
import Agent from '../models/Agent.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import axios from 'axios';
export const createAgentGroup = async (req, res, next) => {
  try {
    const agentGroup = new AgentGroup(req.body);
    const savedAgentGroup = await agentGroup.save();
    const user = await User.findById(req.body.userId)
    user.agentGroupIds.push(savedAgentGroup._id);
    await user.save();
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
export const getFormUrl = async (req, res, next) => {
  try {
    const agentGroup = await AgentGroup.findById(req.params.id);
    res.status(200).json(agentGroup.formURL);
  } catch (err) {
    next(err);
  }
};

export const createFormUrl = async (req, res, next) => {
  try {
    const agentGroup = await AgentGroup.findById(req.params.id);
    const targetUrl =
      "https://script.google.com/macros/s/AKfycby5ZPGk9DjrQ5iNrwgtxULZsAgfOdEf6dLjVPz5pwgCD6YVZ8U8sqSjbe_M-eNpDrWQ/exec";
    const body = JSON.stringify(req.body.formData)
    console.log(body)
    const response = await axios.post(targetUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data)
    // agentGroup.formURL = response.formURL;
    // agentGroup.save();

    // res.status(200).json(response.data.formURL);
    res.status(200)
  } catch (err) {
    next(err);
  }
};

export const saveFormData = async (req, res, next) => {
  try {
    const agentGroup = await AgentGroup.findById(req.params.id);
    const formId = req.body.formId;
    const response = await axios.post(
      `https://proxy.cors.sh/https://script.google.com/macros/s/AKfycbyxweMrM8MrhrR--dvYkGLLR3Bo0bCHZ4JB7XcOMS5DXmm7RvLr9uF64JpVc9trL1LqgA/exec`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-cors-api-key": "temp_ee6baa959028542c1924a38f378f2092",
        },
        body: JSON.stringify({
          formId: formId,
        }),
      }
    );
    if (response.status === 200) {
      for (let item of response.data) {
        await axios.post("http://localhost:8080/submit-form", item);
      }
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
export const deleteAgentGroup = async (req, res, next) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    // Retrieve the agent group to be deleted
    const agentGroup = await AgentGroup.findById(req.params.id);

    // Extract the user ID from the agent group
    const userId = agentGroup.userId;

    // Delete the agent group

    const currentUser = await User.findById(userId);
    // console.log(currentUser, req.params.id)
    if (!currentUser) {
      console.log('User not found');
      return; // Exit function or handle appropriately
    }

    const result = await currentUser.updateOne(
      { $pull: { agentGroupIds: mongoose.Types.ObjectId(req.params.id) } }
    );
    // console.log(result);
    if (result.nModified === 0) {
      console.log('ID not found in agentGroupIds array');
      return; // Exit function or handle appropriately
    }
    await Agent.deleteMany({ _id: { $in: agentGroup.agentIds } });
    await agentGroup.remove();
    // Remove the agent group ID from the user's agentGroupIds array

    // await session.commitTransaction();
    // session.endSession();

    res.status(200).json({ message: "Agent group deleted successfully" });
  } catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
};

// export const deleteAgentGroup = async (req, res, next) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         // Retrieve the agent group to be deleted
//         const agentGroup = await AgentGroup.findById(req.params.id).session(session);

//         // Extract the user ID from the agent group
//         const userId = agentGroup.userId;

//         // Delete all agents in the agent group
//         await Agent.deleteMany({ _id: { $in: agentGroup.agentIds } }).session(session);

//         // Delete the agent group
//         await agentGroup.remove({ session });

//         // Remove the agent group ID from the user's agentGroupIds array
//         await User.updateOne(
//             { _id: userId },
//             { $pull: { agentGroupIds: req.params.id } }
//         ).session(session);

//         await session.commitTransaction();
//         session.endSession();

//         res.status(200).json({ message: "Agent group deleted successfully" });
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         next(err);
//     }
// };