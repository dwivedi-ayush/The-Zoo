import express from "express";
import {
    createScenario,
    getScenario,
    deleteScenario
} from "../controllers/scenario.js";

const router = express.Router();


router.put("/v2/scenarios", createScenario);
router.get("/v2/scenarios/:id", getScenario);
router.delete("/v2/scenarios/:id", deleteScenario);

export default router;
