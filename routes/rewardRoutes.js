import express from "express";
import {
  addPoints,
  claimReward,
  getLeaderboard,
  getRewardHistory,
  getRewardPoints,
} from "../controllers/rewardController.js";

const router = express.Router();

router.get("/reward-points", getRewardPoints);
router.get("/reward-points/:farmerId", getRewardPoints);
router.get("/reward-history", getRewardHistory);
router.get("/reward-history/:farmerId", getRewardHistory);
router.get("/leaderboard", getLeaderboard);

router.post("/points/add", addPoints);
router.post("/reward/claim", claimReward);

export default router;
