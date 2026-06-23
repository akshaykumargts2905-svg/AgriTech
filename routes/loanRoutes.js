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
router.post("/loan/apply", applyLoan);
router.post("/loan/:loanId/repayment", addRepayment);
router.patch("/loan/:loanId/status", updateLoanStatus);

export default router;
