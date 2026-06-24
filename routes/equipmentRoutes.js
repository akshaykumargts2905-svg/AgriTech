import express from "express";
import {
  getEquipments,
  getEquipmentsById,
  getEquipmentsSearchByName,
  getEquipmentsAad,
} from "../controllers/equipmentsController.js";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";

const router = express.Router();

router.get("/equipments", getAuthenticatedUserId, getEquipments);
router.get("/equipments/:id", getAuthenticatedUserId, getEquipmentsById);
router.get(
  "/equipments/search/:name/",
  getAuthenticatedUserId,
  getEquipmentsSearchByName,
);
router.post("/equipments/add", getAuthenticatedUserId, getEquipmentsAad);

export default router;
