import express from "express";
import { getEquipments } from "../controllers/equipmentsController";

const router = express.Router();

router.get("/equipments", getAuthenticatedUserId, getEquipments);

export default router;
