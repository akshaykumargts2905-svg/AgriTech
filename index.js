import "dotenv/config";

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import authRoutes from "./routes/authRoutes.js";
import api from "./prisma/config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);

// GET api

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

// POST api

// POST /users endpoint moved to authController (use /signup instead)
// This endpoint is kept for backwards compatibility
app.post("/users", async (req, res) => {
  try {
    const { name, phone, state, country, email, password } = req.body;

    if (!name || !phone || !state || !country || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "name, phone, state, country, email, and password are required",
      });
    }

    const existingUser = await api.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await api.user.create({
      data: {
        name,
        phone,
        state,
        country,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        state: true,
        country: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
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
        ownerId,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
