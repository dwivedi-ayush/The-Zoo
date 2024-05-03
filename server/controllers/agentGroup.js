import AgentGroup from '../models/AgentGroup.js';
import Agent from '../models/Agent.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import axios from 'axios';

const app_script_url =
  "https://script.google.com/macros/s/AKfycbxFqTa4QjgsAc1C8wiKcOC_Ana9rL3GbGbXmsIRL7SOnNp1LFz4zJ2b0PuMoeQ7cIQB/exec";
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
    res.status(200).json({ url: agentGroup.formURL });
  } catch (err) {
    next(err);
  }
};

export const createFormUrl = async (req, res, next) => {
  try {
    const agentGroup = await AgentGroup.findById(req.params.id);
    const targetUrl = app_script_url;
    const body = JSON.stringify(req.body.formData)

    const response = await axios.post(targetUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    agentGroup.formURL = response.data.formUrl;
    agentGroup.save();

    res.status(200).json(response.data.formUrl);

  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const saveFormData = async (req, res, next) => {
  try {
    const agentGroup = await AgentGroup.findById(req.params.id);
    const formUrl = req.body.formUrl;
    const body = JSON.stringify({
      formUrl: formUrl,
      type: 0
    })
    const targetUrl = app_script_url;
    // "https://script.google.com/macros/s/AKfycbyDHhzZ4M_HaEgG2rul9fUORKl1MICEztU8HmmNlVAnCahqSuZwFRioejDgZlw0gdF7tw/exec";
    const response = await axios.post(targetUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const itemsAsJSON = response.data.map((item) => {
    //   const data = item.split(";").reduce((acc, pair) => {
    //     const [key, value] = pair.split("-");
    //     acc[key] = value;
    //     return acc;
    //   }, {});
    //   return JSON.stringify(data);
    // });
    console.log(response.data, response.status)
    if (response.status === 200) {



      for (let json of response.data) {
        console.log(json);
        await axios.post(`http://localhost:8080/submitform/userID/${req.params.agentGroupId}/agentGroupID/${req.params.userId}`, json);
      }
      agentGroup.formURL = "";
      agentGroup.save();
    }
    res.status(200).json(response.data);
  } catch (err) {
    // console.log(err);
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