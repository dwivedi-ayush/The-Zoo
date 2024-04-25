import express from "express";
import {
    createScenario,
    getScenariosByGroup,
    getScenario,
    deleteScenario, rollbackTillScenario
} from "../controllers/scenario.js";

const router = express.Router();


router.put("/v2/scenarios", createScenario);
router.get("/v2/scenarios/:id", getScenario);
router.get("/v2/getbygroup/:scenariogroupid", getScenariosByGroup);
router.delete("/v2/delete/:id", deleteScenario);
router.delete("/v2/rollback/:scenarioId/agentGroup/:agentGroupId", rollbackTillScenario);

export default router;
