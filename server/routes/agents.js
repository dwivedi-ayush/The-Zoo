import express from "express";
import {
  createAgent,
  getGlobalAgents,
  getAgentsByGroup,
  getAgentByAlias,
  getAgentById,
  deleteAgent
} from "../controllers/agent.js";


const router = express.Router();
router.put("/v2/create", createAgent);
router.get("/v2/getglobal", getGlobalAgents);
router.get("/v2/getbygroup/:agentgroupid", getAgentsByGroup);
// router.get("/v2/find/alias/:alias", getAgentByAlias);
router.get("/v2/find/:id", getAgentById);
router.delete("/v2/delete/:id", deleteAgent);
export default router;