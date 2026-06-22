import "dotenv/config";

import api from "./config/prisma.js";

const seed = async () => {
  const weatherCount = await api.weather.count();
  const tipCount = await api.farmingTip.count();
  const notificationCount = await api.notification.count();

  if (weatherCount === 0) {
    await api.weather.createMany({
      data: [
        {
          location: "Patna",
          temperature: 32,
          condition: "Sunny",
          humidity: 62,
          advice: "Good day for field inspection. Avoid spraying at noon.",
        },
        {
          location: "Delhi",
          temperature: 35,
          condition: "Hot",
          humidity: 40,
          advice: "Water-sensitive crops may need evening irrigation.",
        },
      ],
    });
  }

  if (tipCount === 0) {
    await api.farmingTip.createMany({
      data: [
        {
          title: "Soil moisture check",
          crop: "General",
          tip: "Irrigate early morning or evening to reduce water loss.",
        },
        {
          title: "Wheat care",
          crop: "Wheat",
          tip: "Keep the field weed-free during the first 30 to 40 days.",
        },
        {
          title: "Rice care",
          crop: "Rice",
          tip: "Maintain shallow standing water during active growth.",
        },
      ],
    });
  }

  if (notificationCount === 0) {
    await api.notification.create({
      data: {
        userId: "all",
        title: "Welcome to AgriTech",
        message: "Check weather and farming tips before planning field work.",
      },
    });
  }
};

seed()
  .then(async () => {
    console.log("Seed data added successfully");
    await api.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await api.$disconnect();
    process.exit(1);
  });
