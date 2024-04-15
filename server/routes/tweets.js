import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  getAgentTweets,
  likeOrDislike,
  getExploreTweets,
  getTweetReplies,
  getExplorePageTweets,
  getTimelinePageTweets
} from "../controllers/tweet.js";

const router = express.Router();


router.put("/v2", createTweet);
router.delete("/v2/:id", deleteTweet);
router.put("/v2/:id/like", likeOrDislike);
router.get("/v2/agent/:id/scenarioGroup/:scenarioGroupId/page/:page", getAgentTweets);
// router.get("/v2/explore/scenarioGroup/:scenarioGroupId", getExploreTweets);
router.get("/v2/explore/scenarioGroup/:scenarioGroupId/agentGroup/:agentGroupId/page/:page", getExplorePageTweets);
router.get("/v2/timeline/user/:currentUser/scenarioGroup/:scenarioGroupId/agentGroup/:agentGroupId/page/:page", getTimelinePageTweets);
router.get("/v2/reply/:id", getTweetReplies);

export default router;
