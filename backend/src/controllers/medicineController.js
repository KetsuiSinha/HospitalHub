const Medicine = require("../models/medicine");
const Alert = require("../models/alert");

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

    if (medicine) {
      // Low Stock Alert Logic
      if (medicine.stock < 100) {
        // Check if active alert already exists
        const existingAlert = await Alert.findOne({
          message: `Low Stock Alert: ${medicine.name}`,
          status: 'active'
        });

        if (!existingAlert) {
          const newAlert = new Alert({
            message: `Low Stock Alert: ${medicine.name}`,
            priority: 'high',
            timestamp: 'Just now',
            location: 'Pharmacy',
            status: 'active',
            dateTime: new Date().toLocaleString(),
            predictions: 'Stock depletion imminent.',
            affectedPatients: 0,
            estimatedImpact: 'High - Restock immediately',
            recommendedAction: 'Order new stock',
            description: `The stock for ${medicine.name} has fallen below 100 units. Current stock: ${medicine.stock}.`,
            hospital: hospital
          });
          await newAlert.save();
        }
      } else {
        // Resolve any active alerts for this medicine
        await Alert.updateMany(
          {
            message: `Low Stock Alert: ${medicine.name}`,
            status: 'active'
          },
          {
            $set: { status: 'resolved' }
          }
        );
      }
    }
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
