import express from "express";
import { getEquipments } from "../controllers/equipmentsController";
import { getEquipmentsById } from "../controllers/equipmentsController";
import { getEquipmentsSearchByName } from "../controllers/equipmentsController";
import { getAuthenticatedUserId } from "../middleware/authCheck";
import { getEquipmentsAad } from "../controllers/equipmentsController";

const router = express.Router();

router.get("/equipments", getAuthenticatedUserId, getEquipments);

router.get("/equipments/:id", getAuthenticatedUserId, getEquipmentsById);

router.get(
  "/equipments/search/:name/",
  getAuthenticatedUserId,
  getEquipmentsSearchByName,
);

router.get("/equipments/add", getAuthenticatedUserId, getEquipmentsAad);
export default router();
