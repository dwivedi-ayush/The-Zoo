import express from "express";
import {
    createScenarioGroup,
    getScenarioGroupById,
    getDefaultScenarioGroupByUserId,
    deleteScenarioGroup
} from "../controllers/scenarioGroup.js";

const router = express.Router();

router.put("/v2", createScenarioGroup);
router.get("/v2/:id", getScenarioGroupById);
router.get("/v2/userId/:userId", getDefaultScenarioGroupByUserId)
router.delete("/v2/:id", deleteScenarioGroup);

export default router;
