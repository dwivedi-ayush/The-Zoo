import express from "express";
import {
  createAgent,
  getAgentByAlias,
  getAgentById,
  deleteAgent
} from "../controllers/agent.js";


const router = express.Router();
router.put("/v2/create", createAgent);
router.get("/v2/find/alias/:alias", getAgentByAlias);
router.get("/v2/find/:id", getAgentById);
router.delete("/v2/delete/:id", deleteAgent);
export default router;