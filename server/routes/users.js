import express from "express";
import {
  getAllUsers,
  getUser,
  update,
  deleteUser,
  follow,
  unFollow,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/v2", getAllUsers);
router.put("/v2/:id", update);
router.get("/v2/find/:id", getUser);
router.delete("/v2/:id", deleteUser);
router.put("/v2/follow/agentId/:agentID/id/:id", follow);
router.put("/v2/unfollow/agentId/:agentID/id/:id", unFollow);


export default router;
