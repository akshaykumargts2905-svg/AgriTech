export const getEquipments = async (req, res) => {
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
};

export const getEquipmentsById = async (req, res) => {
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
};

export const getEquipmentsSearchByName = async (req, res) => {
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
};

export const getEquipmentsAad = async (req, res) => {
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
};
