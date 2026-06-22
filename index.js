import "dotenv/config";

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import snehaRoutes from "./routes/snehaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", snehaRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AgriTech API is running",
    owner: "Sneha",
    modules: ["Authentication & Profile", "Weather & Farming", "Notifications"],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server on http://localhost:${PORT}`));
