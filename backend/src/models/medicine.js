const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String },
  dosageForm: { 
    type: String, 
    enum: ["Tablet", "Capsule", "Syrup", "Injection", "Other"], 
    required: true 
  },
  strength: { type: String }, // e.g. "500mg"
  expiryDate: { type: Date, required: true },
  stock: { type: Number, required: true, min: 0 },
  critical: { type: Boolean, default: false },
  lastRestocked: { type: Date, default: Date.now },
  hospital: { type: String, required: true, enum: ["City General Hospital", "Memorial Medical Center", "St. Mary's Hospital", "Regional Health Center", "Community Medical Center", "University Hospital"] }
});

module.exports = mongoose.model("Medicine", medicineSchema);
