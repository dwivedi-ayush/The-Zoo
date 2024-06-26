import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  createScenario,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
  getTweetReplies,
  getExplorePageTweets,
  getTimelinePageTweets
} from "../controllers/tweet.js";

const router = express.Router();

// Create a Tweet
router.post("/", verifyToken, createTweet);
router.post("/scenario", createScenario);

// Delete a Tweet
router.delete("/:id", verifyToken, deleteTweet);

// Like or Dislike a Tweet
router.put("/:id/like", likeOrDislike);

// get all timeline tweets
router.get("/timeline/:id", getAllTweets);

// get user Tweets only
router.get("/user/all/:alias", getUserTweets);

//explore
router.get("/explore", getExploreTweets);

router.get("/explore/page/:page", getExplorePageTweets);

router.get("/timeline/user/:currentUser/page/:page", getTimelinePageTweets);

router.get("/reply/:id", getTweetReplies);
export default router;
