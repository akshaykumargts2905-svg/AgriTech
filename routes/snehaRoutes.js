import express from "express";
import {
  addFarmingTip,
  addWeather,
  getFarmingTips,
  getNotifications,
  getWeather,
  markNotificationRead,
  sendNotification,
} from "../controllers/snehaController.js";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";
///change
const router = express.Router();

router.get("/weather", getWeather);
router.get("/farming-tips", getFarmingTips);
router.get("/notifications", getAuthenticatedUserId, getNotifications);

router.post("/weather/add", getAuthenticatedUserId, addWeather);
router.post("/farming-tip/add", getAuthenticatedUserId, addFarmingTip);
router.post("/notification/send", getAuthenticatedUserId, sendNotification);
router.post("/notification/read", getAuthenticatedUserId, markNotificationRead);

export default router;
