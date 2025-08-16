const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Medicine", "Equipment", "Consumable"], 
    required: true 
  },
  quantity: { type: Number, required: true, min: 0 },
  threshold: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", inventorySchema);
