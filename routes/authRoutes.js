import express from "express";
import {
  createProfile,
  forgotPassword,
  getProfile,
  getUserById,
  login,
  resetPassword,
  signup,
  updateProfile,
  verifyOtp,
} from "../controllers/authController.js";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";

const router = express.Router();

router.get("/profile", getAuthenticatedUserId, getProfile);
router.get("/user/:id", getUserById);

router.post("/signup", signup);
router.post("/login", login);

//We need to wire actual forget password logic here.
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/profile/create", getAuthenticatedUserId, createProfile);
router.post("/profile/update", getAuthenticatedUserId, updateProfile);

export default router;
