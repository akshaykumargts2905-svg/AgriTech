import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import snehaRoutes from "./routes/snehaRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import api from "./prisma/config/prisma.js";
import { getAuthenticatedUserId } from "./middleware/authCheck.js";

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

app.get("/equipments", async (req, res) => {
  try {
    const equipments = await api.equipmentRental.findMany();
    res.status(200).json({
      success: true,
      data: equipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipments",
    });
  }
});

app.get("/equipments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await api.equipmentRental.findUnique({
      where: { equipmentId: id },
    });
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipment",
    });
  }
});

app.get("/equipments/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const equipments = await api.equipmentRental.findMany({
      where: {
        equipmentName: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    if (equipments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No equipments found",
      });
    }
    res.status(200).json({
      success: true,
      data: equipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search equipments",
    });
  }
});

app.post("/equipments/add", async (req, res) => {
  try {
    const { ownerId, equipmentName, rentPrice, availability } = req.body;

    if (!ownerId || !equipmentName || !rentPrice) {
      return res.status(400).json({
        success: false,
        error: "ownerId, equipmentName, and rentPrice are required",
      });
    }

    const equipment = await api.equipmentRental.create({
      data: {
        ownerId: Number(ownerId),
        equipmentName,
        rentPrice: parseFloat(rentPrice),
        availability: availability !== undefined ? availability : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Equipment added successfully",
      data: equipment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add equipment",
    });
  }
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
app.get("/crop-history", getAuthenticatedUserId, async (req, res) => {
  const userid = req.id;
  try {
    const history = await api.crop.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userid,
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
        userId: Number(userId),
        cropName,
        quantity: Number(quantity),
        price: Number(price),
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
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        price: price !== undefined ? Number(price) : undefined,
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
        userId: Number(userId),
        cropName,
        quantity: Number(quantity),
        price: Number(price),
        status,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to add crop record" });
  }
});

// function simpleApiFunction(req, res) {
//   res.send("This ismy simple api");
// }

// app.get("/simple-api", simpleApiFunction);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
