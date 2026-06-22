import express from "express";
import {
  addRepayment,
  applyLoan,
  getLoanEligibility,
  getLoanStatus,
  updateLoanStatus,
} from "../controllers/loanController.js";

const router = express.Router();

router.get("/loan-status", getLoanStatus);
router.get("/loan-status/:farmerId", getLoanStatus);
router.get("/loan-history", getLoanStatus);
router.get("/loan-history/:farmerId", getLoanStatus);
router.get("/loan/eligibility", getLoanEligibility);
router.get("/loan/eligibility/:farmerId", getLoanEligibility);
router.post("/loan/apply", applyLoan);
router.post("/loan/:loanId/repayment", addRepayment);
router.patch("/loan/:loanId/status", updateLoanStatus);

export default router;
