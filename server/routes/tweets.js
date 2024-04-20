import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  deleteTweetByScenarioGroup,
  getAgentTweets,
  likeOrDislike,
  getExploreTweetCount,
  getTweetReplies,
  getExplorePageTweets,
  getTimelinePageTweets
} from "../controllers/tweet.js";

const router = express.Router();


router.put("/v2", createTweet);
router.delete("/v2/:id", deleteTweet);
router.delete("/v2/scenarioGroup/:id", deleteTweetByScenarioGroup);
router.put("/v2/:id/like", likeOrDislike);
router.get("/v2/agent/:id/scenarioGroup/:scenarioGroupId/page/:page", getAgentTweets);
router.get("/v2/explore/scenarioGroup/:scenarioGroupId/agentGroup/:agentGroupId", getExploreTweetCount);
router.get("/v2/explore/scenarioGroup/:scenarioGroupId/agentGroup/:agentGroupId/page/:page", getExplorePageTweets);
router.get("/v2/timeline/user/:currentUser/scenarioGroup/:scenarioGroupId/agentGroup/:agentGroupId/page/:page", getTimelinePageTweets);
router.get("/v2/reply/:id", getTweetReplies);

export default router;
