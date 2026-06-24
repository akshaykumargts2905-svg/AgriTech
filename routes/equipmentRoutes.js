import express from "express";
import { getEquipments } from "../controllers/equipmentsController.js";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";

const router = express.Router();

router.get("/equipments", getAuthenticatedUserId, getEquipments);

export default router;
