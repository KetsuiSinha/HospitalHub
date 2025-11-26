const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    message: { type: String, required: true },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    timestamp: { type: String, default: "Just now" },
    location: { type: String, default: "General" },
    status: { type: String, enum: ["active", "resolved", "dismissed"], default: "active" },
    dateTime: { type: String },
    predictions: { type: String },
    affectedPatients: { type: Number, default: 0 },
    estimatedImpact: { type: String },
    recommendedAction: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);
