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
