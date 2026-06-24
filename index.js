import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import snehaRoutes from "./routes/snehaRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import equipmentsRoutes from "./routes/equipmentRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import api from "./prisma/config/prisma.js";
import cropRoutes from "./routes/cropRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", snehaRoutes);

app.use("/", communityRoutes);
app.use("/", rewardRoutes);

app.use("/", loanRoutes);

app.use("/", equipmentsRoutes);

app.use("/", marketplaceRoutes);
app.use("/", cropRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AgriTech API is running",
    owner: "Sneha",
    modules: ["Authentication & Profile", "Weather & Farming", "Notifications"],
  });
});

app.get("/users", async (req, res) => {
  try {
    const users = await api.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
