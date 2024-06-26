import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";
import Data from "../models/Replies.js"
import Scenario from "../models/Scenario.js";


export const createTweet = async (req, res, next) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};
export const createScenario = async (req, res, next) => {
  const newScenario = new Scenario(req.body);
  try {
    // const savedScenario = await newScenario.save();
    // res.status(200).json(savedScenario);
    const fakeSuccessResponse = {
      success: true,
      message: 'Scenario created successfully.',
      data: newScenario,
    };
    res.status(200).json(fakeSuccessResponse);
  } catch (err) {
    handleError(500, err);
  }
};
export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.id) {
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

export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return Tweet.find({ userId: followerId });
      })
    );

    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getUserTweets = async (req, res, next) => {

  try {
    const userTweets = await Tweet.find({ alias: req.params.alias }).sort({
      createdAt: -1,
    });

    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};
export const getExploreTweets = async (req, res, next) => {
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ createdAt: -1, });
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
export const getExplorePageTweets = async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;
  const perPage = 10;
  const skipCount = (page - 1) * perPage;
  try {
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ createdAt: -1, })
      .skip(skipCount)
      .limit(perPage);
    // const getExploreTweets = await Tweet.find()

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
    const currentUser = await User.findById(req.params.currentUser);
    if (!currentUser) {
      // Handle case where user is not found
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the followed array
    const aliasesArray = currentUser.following;

    const getTimelineTweets = await Tweet.find({
      alias: { $in: aliasesArray }
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
    const getTweetReplies = await Data.findById(req.params.id);
    // const getExploreTweets = await Tweet.find()

    res.status(200).json(getTweetReplies);
  } catch (err) {
    handleError(500, err);
  }
};
