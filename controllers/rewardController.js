import api from "../prisma/config/prisma.js";

export const addRewardPoints = async ({
  farmerId,
  points,
  reason,
  referenceType,
  referenceId,
}) => {
  const farmerIdNumber = Number(farmerId);
  const pointsNumber = Number(points);

  if (!farmerIdNumber || !pointsNumber || pointsNumber <= 0 || !reason) {
    throw new Error("farmerId, positive points, and reason are required");
  }

  return api.$transaction(async (tx) => {
    const account = await tx.rewardAccount.upsert({
      where: { farmerId: farmerIdNumber },
      update: { points: { increment: pointsNumber } },
      create: { farmerId: farmerIdNumber, points: pointsNumber },
    });

    const transaction = await tx.rewardTransaction.create({
      data: {
        farmerId: farmerIdNumber,
        points: pointsNumber,
        reason,
        referenceType,
        referenceId,
      },
    });

    return { account, transaction };
  });
};

export const addPoints = async (req, res) => {
  try {
    const result = await addRewardPoints(req.body);

    return res.status(201).json({
      message: "Reward points added successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const getRewardPoints = async (req, res) => {
  try {
    const farmerId = Number(req.params.farmerId || req.query.farmerId);

    if (!farmerId) {
      return res.status(400).json({ error: "farmerId is required" });
    }

    const account = await api.rewardAccount.findUnique({
      where: { farmerId },
    });

    return res.json({
      farmerId,
      points: account?.points || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch reward points" });
  }
};

export const getRewardHistory = async (req, res) => {
  try {
    const farmerId = Number(req.params.farmerId || req.query.farmerId);

    if (!farmerId) {
      return res.status(400).json({ error: "farmerId is required" });
    }

    const history = await api.rewardTransaction.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch reward history" });
  }
};

export const getLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await api.rewardAccount.findMany({
      orderBy: { points: "desc" },
      take: 20,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            state: true,
            country: true,
          },
        },
      },
    });

    return res.json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

export const claimReward = async (req, res) => {
  try {
    const { farmerId, points, rewardName } = req.body;
    const farmerIdNumber = Number(farmerId);
    const pointsNumber = Number(points);

    if (!farmerIdNumber || !pointsNumber || pointsNumber <= 0 || !rewardName) {
      return res.status(400).json({
        error: "farmerId, positive points, and rewardName are required",
      });
    }

    const account = await api.rewardAccount.findUnique({
      where: { farmerId: farmerIdNumber },
    });

    if (!account || account.points < pointsNumber) {
      return res.status(400).json({ error: "Not enough reward points" });
    }

    const result = await api.$transaction(async (tx) => {
      const updatedAccount = await tx.rewardAccount.update({
        where: { farmerId: farmerIdNumber },
        data: { points: { decrement: pointsNumber } },
      });

      const transaction = await tx.rewardTransaction.create({
        data: {
          farmerId: farmerIdNumber,
          points: -pointsNumber,
          reason: `Claimed reward: ${rewardName}`,
          referenceType: "REWARD_CLAIM",
        },
      });

      return { account: updatedAccount, transaction };
    });

    return res.json({
      message: "Reward claimed successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to claim reward" });
  }
};
