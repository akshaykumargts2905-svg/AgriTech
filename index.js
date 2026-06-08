require("dotenv").config();

const express = require("express");
const cors = require("cors");
const api = require("./prisma/config/prisma");
const app = express();

app.use(cors());
app.use(express.json());

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
    const { name, mobile, language, state, role } = req.body;

    if (!name || !mobile || !language || !state || !role) {
      return res.status(400).json({
        error: "name, mobile, language, state, and role are required",
      });
    }

    const user = await api.user.create({
      data: { name, mobile, language, state, role },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
