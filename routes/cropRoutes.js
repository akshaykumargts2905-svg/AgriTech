import express from "express";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";
import { getCrop } from "../controllers/cropController.js";
import { getCropById } from "../controllers/cropController.js";
import { getCropRecords } from "../controllers/cropController.js";
import { getCropHistory } from "../controllers/cropController.js";
import { getCropName } from "../controllers/cropController.js";
import { addCrop } from "../controllers/cropController.js";
import { updateCrop } from "../controllers/cropController.js";
import { addCropRecords } from "../controllers/cropController.js";

const router = express.Router();

router.get("/crops", getAuthenticatedUserId, getCrop);
router.get("/crops/:id", getAuthenticatedUserId, getCropById);
router.get("/crop-records", getAuthenticatedUserId, getCropRecords);
router.get("/crop-history", getAuthenticatedUserId, getCropHistory);
router.get("/crop/name/:cropName", getAuthenticatedUserId, getCropName);
router.post("/crop/add", getAuthenticatedUserId, addCrop);
router.post("/crop/update", getAuthenticatedUserId, updateCrop);
router.post("/crop-records/add", getAuthenticatedUserId, addCropRecords);

export default router;
