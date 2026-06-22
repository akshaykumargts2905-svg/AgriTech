import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import snehaRoutes from "./routes/snehaRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import api from "./prisma/config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", snehaRoutes);
app.use("/", communityRoutes);
app.use("/", rewardRoutes);
app.use("/", loanRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AgriTech API is running",
    owner: "Sneha",
    modules: ["Authentication & Profile", "Weather & Farming", "Notifications"],
  });
});

// GET ALL CROPS
app.get("/crops", async (req, res) => {
  try {
    const crops = await api.crop.findMany();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crops" });
  }
});

// GET CROP BY ID
app.get("/crop/:id", async (req, res) => {
  try {
    const crop = await api.crop.findUnique({
      where: {
        cropId: req.params.id,
      },
    });

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crop" });
  }
});

// GET CROP RECORDS
app.get("/crop-records", async (req, res) => {
  try {
    const records = await api.crop.findMany();

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crop records" });
  }
});

// GET CROP HISTORY
app.get("/crop-history", async (req, res) => {
  try {
    const history = await api.crop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crop history" });
  }
});

// SEARCH CROP BY NAME
app.get("/crop/name/:cropName", async (req, res) => {
  try {
    const crops = await api.crop.findMany({
      where: {
        cropName: {
          equals: req.params.cropName,
          mode: "insensitive",
        },
      },
    });

    if (crops.length === 0) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Failed to search crop" });
  }
});

// ADD CROP
app.post("/crop/add", async (req, res) => {
  try {
    const { userId, cropName, quantity, price, status } = req.body;

    const crop = await api.crop.create({
      data: {
        userId,
        cropName,
        quantity,
        price,
        status,
      },
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ error: "Failed to add crop" });
  }
});

// UPDATE CROP
app.post("/crop/update", async (req, res) => {
  try {
    const { cropId, cropName, quantity, price, status } = req.body;

    const crop = await api.crop.update({
      where: {
        cropId,
      },
      data: {
        cropName,
        quantity,
        price,
        status,
      },
    });

    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: "Failed to update crop" });
  }
});

// ADD CROP RECORD
app.post("/crop-records/add", async (req, res) => {
  try {
    const { userId, cropName, quantity, price, status } = req.body;

    const record = await api.crop.create({
      data: {
        userId,
        cropName,
        quantity,
        price,
        status,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to add crop record" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
