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

const router = express.Router();

//Hey i changed my name

router.get("/profile", getProfile);
router.get("/user/:id", getUserById);

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/profile/create", createProfile);
router.post("/profile/update", updateProfile);

export default router;
