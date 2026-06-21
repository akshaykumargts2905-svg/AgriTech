import api from "../prisma/config/prisma.js";

export const getWeather = async (req, res) => {
  try {
    const { location } = req.query;

    const weather = await api.weather.findMany({
      where: location
        ? {
            location: {
              contains: location,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ weather });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch weather",
    });
  }
};

export const addWeather = async (req, res) => {
  try {
    const { location, temperature, condition, humidity, advice } = req.body;

    if (!location || temperature === undefined || !condition || humidity === undefined || !advice) {
      return res.status(400).json({
        error: "location, temperature, condition, humidity, and advice are required",
      });
    }

    const weather = await api.weather.create({
      data: {
        location,
        temperature: Number(temperature),
        condition,
        humidity: Number(humidity),
        advice,
      },
    });

    return res.status(201).json({
      message: "Weather data added successfully",
      weather,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to add weather data",
    });
  }
};

export const getFarmingTips = async (req, res) => {
  try {
    const { crop } = req.query;

    const tips = await api.farmingTip.findMany({
      where: crop
        ? {
            OR: [
              {
                crop: {
                  contains: crop,
                  mode: "insensitive",
                },
              },
              {
                crop: {
                  equals: "General",
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ tips });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch farming tips",
    });
  }
};

export const addFarmingTip = async (req, res) => {
  try {
    const { title, crop, tip } = req.body;

    if (!title || !crop || !tip) {
      return res.status(400).json({
        error: "title, crop, and tip are required",
      });
    }

    const farmingTip = await api.farmingTip.create({
      data: {
        title,
        crop,
        tip,
      },
    });

    return res.status(201).json({
      message: "Farming tip added successfully",
      tip: farmingTip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to add farming tip",
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    const notifications = await api.notification.findMany({
      where: userId
        ? {
            OR: [{ userId: "all" }, { userId: String(userId) }],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch notifications",
    });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { userId = "all", title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        error: "title and message are required",
      });
    }

    const notification = await api.notification.create({
      data: {
        userId: String(userId),
        title,
        message,
      },
    });

    return res.status(201).json({
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to send notification",
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "id is required",
      });
    }

    const notification = await api.notification.update({
      where: { id: Number(id) },
      data: { read: true },
    });

    return res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to update notification",
    });
  }
};
