export const getCrop = async (req, res) => {
  try {
    const crops = await api.crop.findMany();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crops" });
  }
};

export const getCropById = async (req, res) => {
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
};

export const getCropRecords = async (req, res) => {
  try {
    const records = await api.expenseProfit.findMany();

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crop records" });
  }
};

export const getCropHistory = async (req, res) => {
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
};

export const getCropName = async (req, res) => {
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
};

export const addCrop = async (req, res) => {
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
};

export const updateCrop = async (req, res) => {
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
};

export const addCropRecords = async (req, res) => {
  try {
    const { farmerId, expense, income, profit } = req.body;

    const record = await api.expenseProfit.create({
      data: {
        farmerId: Number(farmerId),
        expense: Number(expense),
        income: Number(income),
        profit: Number(profit),
      },
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to add crop record" });
  }
};
