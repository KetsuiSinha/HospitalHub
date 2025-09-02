const Staff = require("../models/staff");
const Attendance = require("../models/attendance");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

exports.listByHospital = async (req, res) => {
  try {
    const hospital = req.user.hospital;
    const dateParam = req.query.date;
    const baseDate = dateParam ? new Date(dateParam) : new Date();
    const [staff, attendance] = await Promise.all([
      Staff.find({ hospital }).sort({ createdAt: -1 }),
      Attendance.find({ hospital, date: { $gte: startOfDay(baseDate), $lte: endOfDay(baseDate) } }),
    ]);

    const attMap = new Map(attendance.map((a) => [String(a.staff), a]));
    const withToday = staff.map((s) => {
      const sObj = s.toObject();
      const att = attMap.get(String(s._id));
      return {
        ...sObj,
        status: att?.status || "Absent",
        clockIn: att?.clockIn || null,
      };
    });

    res.json(withToday);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, role, department, shift, status } = req.body;
    const staff = await Staff.create({ name, email, role, department, shift, status, hospital: req.user.hospital });
    res.status(201).json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create staff" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const staff = await Staff.findOneAndUpdate({ _id: id, hospital: req.user.hospital }, updates, { new: true });
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update staff" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findOneAndDelete({ _id: id, hospital: req.user.hospital });
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    // Clean today's attendance for removed staff to avoid stale counts
    const today = new Date();
    await Attendance.deleteMany({ staff: staff._id, hospital: req.user.hospital, date: { $gte: startOfDay(today), $lte: endOfDay(today) } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to delete staff" });
  }
};

