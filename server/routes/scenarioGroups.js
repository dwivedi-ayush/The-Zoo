import express from "express";
import {
    createScenarioGroup,
    getScenarioGroupById,
    deleteScenarioGroup
} from "../controllers/scenarioGroup.js";

const router = express.Router();

router.post("/v2/scenariogroups", createScenarioGroup);
router.get("/v2/scenariogroups/:id", getScenarioGroupById);
router.delete("/v2/scenariogroups/:id", deleteScenarioGroup);

export default router;
