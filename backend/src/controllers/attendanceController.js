const Attendance = require("../models/attendance");
const Staff = require("../models/staff");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

exports.todaySummary = async (req, res) => {
  try {
    const hospital = req.user.hospital;
    const dateParam = req.query.date;
    const baseDate = dateParam ? new Date(dateParam) : new Date();
    const [total, attendance] = await Promise.all([
      Staff.countDocuments({ hospital }),
      Attendance.find({ hospital, date: { $gte: startOfDay(baseDate), $lte: endOfDay(baseDate) } }).populate("staff"),
    ]);

    // Only count attendance for staff that still exist
    const validAttendance = attendance.filter((a) => !!a.staff);

    const present = validAttendance.filter((a) => a.status === "Present").length;
    const absent = validAttendance.filter((a) => a.status === "Absent").length;
    const onLeave = validAttendance.filter((a) => a.status === "On Leave").length;
    const doctorsPresent = validAttendance.filter((a) => a.status === "Present" && a.staff?.role === "Doctor").length;
    const nursesPresent = validAttendance.filter((a) => a.status === "Present" && a.staff?.role === "Nurse").length;

    res.json({ total, present, absent, onLeave, doctorsPresent, nursesPresent });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance summary" });
  }
};

exports.clockIn = async (req, res) => {
  try {
    const { staffId } = req.body;
    const hospital = req.user.hospital;
    const staff = await Staff.findOne({ _id: staffId, hospital });
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    const now = new Date();
    const record = await Attendance.findOneAndUpdate(
      { staff: staff._id, hospital, date: { $gte: startOfDay(now), $lte: endOfDay(now) } },
      { $setOnInsert: { date: now, status: "Present" }, $set: { clockIn: now } },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to clock in" });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const { staffId } = req.body;
    const hospital = req.user.hospital;
    const staff = await Staff.findOne({ _id: staffId, hospital });
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    const now = new Date();
    const record = await Attendance.findOneAndUpdate(
      { staff: staff._id, hospital, date: { $gte: startOfDay(now), $lte: endOfDay(now) } },
      { $set: { clockOut: now } },
      { new: true }
    );
    if (!record) return res.status(404).json({ error: "No attendance record for today" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to clock out" });
  }
};

// Set today's attendance status with optional time
exports.setTodayStatus = async (req, res) => {
  try {
    const { staffId, status, time, date } = req.body; // status: 'Present' | 'Absent' | 'On Leave'
    const hospital = req.user.hospital;
    if (!staffId || !status) return res.status(400).json({ error: "staffId and status are required" });

    const staff = await Staff.findOne({ _id: staffId, hospital });
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    const targetDate = date ? new Date(date) : new Date();
    // Only allow setting attendance for today
    const today = new Date();
    if (targetDate < startOfDay(today) || targetDate > endOfDay(today)) {
      return res.status(400).json({ error: "Attendance can only be logged for today" });
    }
    const effectiveTime = time ? new Date(time) : targetDate;

    const update = { status };
    if (status === "Present") update.clockIn = effectiveTime;
    if (status === "Absent" || status === "On Leave") {
      update.clockIn = undefined;
      update.clockOut = undefined;
    }

    const record = await Attendance.findOneAndUpdate(
      { staff: staff._id, hospital, date: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) } },
      { $setOnInsert: { date: targetDate }, $set: update },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to set attendance" });
  }
};

