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
///change
const router = express.Router();

router.get("/weather", getWeather);
router.get("/farming-tips", getFarmingTips);
router.get("/notifications", getNotifications);

router.post("/weather/add", addWeather);
router.post("/farming-tip/add", addFarmingTip);
router.post("/notification/send", sendNotification);
router.post("/notification/read", markNotificationRead);

export default router;
