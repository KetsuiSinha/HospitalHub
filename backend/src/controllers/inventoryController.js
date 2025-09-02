const Inventory = require("../models/inventory");

exports.createInventory = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const inventoryData = { ...req.body, hospital };
    const item = new Inventory(inventoryData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const items = await Inventory.find({ hospital });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, hospital }, // Only update if item belongs to user's hospital
      req.body, 
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found or access denied" });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { hospital } = req.user; // Get hospital from authenticated user
    const item = await Inventory.findOneAndDelete({ _id: req.params.id, hospital });
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found or access denied" });
    }
    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
