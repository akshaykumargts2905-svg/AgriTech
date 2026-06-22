import api from "../prisma/config/prisma.js";

const calculateCreditScore = async (farmerId) => {
  const rewardAccount = await api.rewardAccount.findUnique({
    where: { farmerId },
  });

  const profitRecords = await api.expenseProfit.findMany({
    where: { farmerId: String(farmerId) },
  });

  const totalProfit = profitRecords.reduce((sum, record) => sum + record.profit, 0);
  const rewardPoints = rewardAccount?.points || 0;
  const rewardScore = Math.min(300, Math.floor(rewardPoints / 2));
  const profitScore = Math.min(250, Math.floor(totalProfit / 1000));

  return Math.max(300, Math.min(850, 300 + rewardScore + profitScore));
};

export const getLoanEligibility = async (req, res) => {
  try {
    const farmerId = Number(req.params.farmerId || req.query.farmerId);

    if (!farmerId) {
      return res.status(400).json({ error: "farmerId is required" });
    }

    const creditScore = await calculateCreditScore(farmerId);

    return res.json({
      farmerId,
      creditScore,
      eligible: creditScore >= 550,
      maxSuggestedAmount: creditScore >= 700 ? 200000 : creditScore >= 550 ? 75000 : 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to check loan eligibility" });
  }
};

export const applyLoan = async (req, res) => {
  try {
    const { farmerId, amount, purpose, durationMonths, documentUrl } = req.body;
    const farmerIdNumber = Number(farmerId);
    const amountNumber = Number(amount);
    const durationNumber = Number(durationMonths);

    if (!farmerIdNumber || !amountNumber || !purpose || !durationNumber) {
      return res.status(400).json({
        error: "farmerId, amount, purpose, and durationMonths are required",
      });
    }

    const creditScore = await calculateCreditScore(farmerIdNumber);

    const loan = await api.loanApplication.create({
      data: {
        farmerId: farmerIdNumber,
        amount: amountNumber,
        purpose,
        durationMonths: durationNumber,
        documentUrl,
        creditScore,
        status: creditScore >= 550 ? "PENDING" : "REJECTED",
        remarks: creditScore >= 550 ? null : "Credit score is below eligibility limit",
      },
    });

    return res.status(201).json({
      message: "Loan application submitted successfully",
      loan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to apply for loan" });
  }
};

export const getLoanStatus = async (req, res) => {
  try {
    const farmerId = Number(req.params.farmerId || req.query.farmerId);

    if (!farmerId) {
      return res.status(400).json({ error: "farmerId is required" });
    }

    const loans = await api.loanApplication.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      include: { repayments: true },
    });

    return res.json(loans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch loan status" });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const loan = await api.loanApplication.update({
      where: { loanId: req.params.loanId },
      data: { status, remarks },
    });

    return res.json({
      message: "Loan status updated successfully",
      loan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update loan status" });
  }
};

export const addRepayment = async (req, res) => {
  try {
    const { farmerId, amount } = req.body;
    const farmerIdNumber = Number(farmerId);
    const amountNumber = Number(amount);

    if (!farmerIdNumber || !amountNumber) {
      return res.status(400).json({ error: "farmerId and amount are required" });
    }

    const repayment = await api.loanRepayment.create({
      data: {
        loanId: req.params.loanId,
        farmerId: farmerIdNumber,
        amount: amountNumber,
      },
    });

    return res.status(201).json({
      message: "Repayment recorded successfully",
      repayment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to record repayment" });
  }
};
