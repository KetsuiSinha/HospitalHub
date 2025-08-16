const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["Staffing", "Supplies", "PatientAdvisory"], 
    required: true 
  },
  message: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  validTill: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  relatedEvent: { type: String }
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
