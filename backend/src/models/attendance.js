const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    hospital: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "On Leave"], required: true },
    clockIn: { type: Date },
    clockOut: { type: Date },
  },
  { timestamps: true }
);

attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);


