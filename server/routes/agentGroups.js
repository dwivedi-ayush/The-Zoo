import express from "express";
import {
  createAgentGroup,
  getAgentGroupById,
  deleteAgentGroup,
  getFormUrl,
  saveFormData,
  createFormUrl,
} from "../controllers/agentGroup.js";

const router = express.Router();

router.put("/v2", createAgentGroup);
router.get("/v2/getFormUrl/:id", getFormUrl);
router.put("/v2/saveFormData/:agentGroupId/:userId", saveFormData);
router.put("/v2/createFormUrl/:id", createFormUrl);
router.get("/v2/:id", getAgentGroupById);
router.delete("/v2/:id", deleteAgentGroup);

export default router;
