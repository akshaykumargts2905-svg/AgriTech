import express from "express";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";
import { getEquipments } from "../controllers/equipmentsController.js";

const router = express.Router();

router.get("/equipments", getAuthenticatedUserId, getEquipments);

export default router;
