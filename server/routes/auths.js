import express from "express";
import { signin, signup } from "../controllers/auth.js";

const router = express.Router();

router.post("/v2/signup", signup);
router.post("/v2/signin", signin);

export default router;
