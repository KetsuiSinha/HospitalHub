const Medicine = require("../models/medicine");

// Create
exports.createMedicine = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const medicineData = { ...req.body, hospital };
    const medicine = new Medicine(medicineData);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all (filtered by hospital)
exports.getMedicines = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const medicines = await Medicine.find({ hospital });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateMedicine = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, hospital }, // Only update if medicine belongs to user's hospital
      req.body, 
      { new: true }
    );
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found or access denied" });
    }
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteMedicine = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, hospital });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found or access denied" });
    }
    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
