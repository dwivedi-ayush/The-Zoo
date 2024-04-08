import { handleError } from "../error.js";
import User from "../models/User.js";
import Scenario from "../models/Scenario.js";
import ScenarioGroup from '../models/ScenarioGroup.js'
import Agent from "../models/Agent.js";
import AgentGroup from "../models/AgentGroup.js"

export const createUser = async (req, res, next) => {
  try {
    const defaultScenarioGroup = new ScenarioGroup({
      title: "Default Scenario Group",
    });
    const savedScenarioGroup = await defaultScenarioGroup.save();
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      scenarioGroupIds: [savedScenarioGroup._id],
    });
    const savedUser = await newUser.save();
    savedScenarioGroup.scenarioIds.push(savedUser._id);
    await savedScenarioGroup.save();
    res.status(201).json(saveUser);
  } catch (err) {
    next(err);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Scenario.remove({ userId: req.params.id });
      await ScenarioGroup.remove({ userId: req.params.id });
      await AgentGroup.remove({ userId: req.params.id });
      await Agent.remove({ userId: req.params.id });

      res.status(200).json("User delete");
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only update your own account"));
  }
};

export const follow = async (req, res, next) => {
  try {

    const currentUser = await User.findById(req.params.id);

    if (!currentUser.following.includes(req.params.agentId)) {
      await currentUser.updateOne({
        $push: { following: req.params.agentId },
      });
    } else {
      res.status(403).json("you already follow this agent");
    }
    res.status(200).json("following the user");
  } catch (err) {
    next(err);
  }
};
export const unFollow = async (req, res, next) => {
  try {

    const currentUser = await User.findById(req.params.id);

    if (currentUser.following.includes(req.params.agentId)) {
      await currentUser.updateOne({
        $pull: { following: req.params.agentId },
      });
    } else {
      res.status(403).json("you dont follow this agent");
    }
    res.status(200).json("Unfollowed the user");
  } catch (err) {
    next(err);
  }
};
