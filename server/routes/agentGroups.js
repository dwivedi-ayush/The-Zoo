import express from "express";
import {
    createAgentGroup,
    getAgentGroupById,
    deleteAgentGroup
} from "../controllers/agentGroup.js";

const router = express.Router();

router.put("/v2", createAgentGroup);
router.get("/v2/:id", getAgentGroupById);
router.delete("/v2/:id", deleteAgentGroup);

export default router;
