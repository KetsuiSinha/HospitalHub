const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Doctor", "Nurse", "Technician", "Administrator"], required: true },
    department: { type: String, required: true },
    shift: { type: String, enum: ["Morning", "Evening", "Night"], required: true },
    status: { type: String, enum: ["Present", "Absent", "On Leave"], default: "Absent" },
    hospital: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);


