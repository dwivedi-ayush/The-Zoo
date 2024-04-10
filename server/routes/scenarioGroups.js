import express from "express";
import {
    createScenarioGroup,
    getScenarioGroupById,
    deleteScenarioGroup
} from "../controllers/scenarioGroup.js";

const router = express.Router();

router.put("/v2", createScenarioGroup);
router.get("/v2/:id", getScenarioGroupById);
router.delete("/v2/:id", deleteScenarioGroup);

export default router;
