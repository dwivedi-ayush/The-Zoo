import express from "express";
import {
  getAgent
} from "../controllers/agent.js";

const router = express.Router();
router.get("/find/:alias", getAgent);
export default router;