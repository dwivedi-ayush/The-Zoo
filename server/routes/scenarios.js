import express from "express";
import {
    createScenario,
    getScenario,
    updateScenario,
    deleteScenario
} from "../controllers/scenario.js";

const router = express.Router();


router.put("/v2/scenarios", createScenario);
router.get("/v2/scenarios/:id", getScenario);
router.put("/v2/scenarios/:id", updateScenario);
router.delete("/v2/scenarios/:id", deleteScenario);

export default router;
