import express from "express";
import {
    createAgentGroup,
    getAgentGroupById,
    deleteAgentGroup
} from "../controllers/agentGroup.js";

const router = express.Router();

router.put("/v2/agentgroups", createAgentGroup);
router.get("/v2/agentgroups/:id", getAgentGroupById);
router.delete("/v2/agentgroups/:id", deleteAgentGroup);

export default router;
