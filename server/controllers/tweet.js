import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";
import AgentGroup from "../models/AgentGroup.js"
import Agent from "../models/Agent.js"


export const createTweet = async (req, res, next) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.agentId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      handleError(500, err);
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};
export const getAgentTweets = async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;
  const perPage = 10;
  const skipCount = (page - 1) * perPage;
  try {
    const getAgentTweets = await Tweet.find({
      agentId: req.params.id,
      scenarioGroupId: req.params.scenarioGroupId
    }).sort({ createdAt: -1, })
      .skip(skipCount)
      .limit(perPage);
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(getAgentTweets);
  } catch (err) {
    handleError(500, err);
  }
};
export const getExploreTweetCount = async (req, res, next) => {
  try {
    const agents = await AgentGroup.findById(req.params.agentGroupId);
    const agentArray = agents.agentIds;
    const count = await Tweet.countDocuments({
      agentId: { $in: agentArray },
      scenarioGroupId: req.params.scenarioGroupId
    })
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(count);
  } catch (err) {
    handleError(500, err);
  }
};
export const getExplorePageTweets = async (req, res, next) => {

  const page = parseInt(req.params.page) || 1;
  const perPage = 10;
  const skipCount = (page - 1) * perPage;
  try {
    // let agentArray;
    const agents = req.params.agentGroupId === "0" ? await Agent.find({ "agentGroupId": "" }) : await AgentGroup.findById(req.params.agentGroupId);
    const agentArray = req.params.agentGroupId === "0" ? agents.map(agent => agent._id) : agents.agentIds;
    const getExploreTweets = await Tweet.find({
      scenarioGroupId: req.params.scenarioGroupId,
      agentId: { $in: agentArray }
    }).sort({ createdAt: -1, })
      .skip(skipCount)
      .limit(perPage);
    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
export const getTimelinePageTweets = async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;
  const perPage = 10;
  const skipCount = (page - 1) * perPage;

  try {
    const agents = req.params.agentGroupId === "0" ? await Agent.find({ "agentGroupId": "" }) : await AgentGroup.findById(req.params.agentGroupId);
    const agentArray = req.params.agentGroupId === "0" ? agents.map(agent => agent._id) : agents.agentIds;
    // if (req.params.agentGroupId === "0") {
    //   const agents = await Agent.find({ "agentGroupId": "" });
    //   agentArray = agents.map(agent => agent._id);

    // } else {
    //   const agents = await AgentGroup.findById(req.params.agentGroupId);
    //   agentArray = agents.agentIds;
    // }
    const currentUser = await User.findById(req.params.currentUser);
    if (!currentUser) {
      // Handle case where user is not found
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the followed array
    const followingArray = currentUser.following;

    const getTimelineTweets = await Tweet.find({
      $and: [
        { agentId: { $in: followingArray } }, // Tweets from agents the user is following
        { agentId: { $in: agentArray } }      // Tweets from the user's own agents
      ],
      scenarioGroupId: req.params.scenarioGroupId
    }).sort({ createdAt: -1, })
      .skip(skipCount)
      .limit(perPage);
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(getTimelineTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getTweetReplies = async (req, res, next) => {
  try {
    const getTweet = await Data.findById(req.params.id);
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(getTweet.replies);
  } catch (err) {
    handleError(500, err);
  }
};
