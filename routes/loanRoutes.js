import express from "express";
import {
  addRepayment,
  applyLoan,
  getLoanEligibility,
  getLoanStatus,
  updateLoanStatus,
} from "../controllers/loanController.js";
import { getAuthenticatedUserId } from "../middleware/authCheck.js";

const router = express.Router();

router.get("/loan-history", getAuthenticatedUserId, getLoanStatus);
router.get("/loan/eligibility", getAuthenticatedUserId, getLoanEligibility);
router.post("/loan/apply", getAuthenticatedUserId, applyLoan);
router.post("/loan/:loanId/repayment", getAuthenticatedUserId, addRepayment);
router.patch("/loan/:loanId/status", getAuthenticatedUserId, updateLoanStatus);
export default router;
