import "dotenv/config";

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import api from "./prisma/config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", communityRoutes);
app.use("/", rewardRoutes);
app.use("/", loanRoutes);

app.get("/users", async (req, res) => {
  try {
    const users = await api.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, phone, state, country, email, password } = req.body;

    if (!name || !phone || !state || !country || !email || !password) {
      return res.status(400).json({
        error: "name, phone, state, country, email, and password are required",
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
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
