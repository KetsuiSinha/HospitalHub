const express = require("express");
const router = express.Router();
const { todaySummary, clockIn, clockOut, setTodayStatus, deleteAttendance } = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");

router.get("/today", auth, todaySummary);
router.post("/clock-in", auth, clockIn);
router.post("/clock-out", auth, clockOut);
router.post("/set-status", auth, setTodayStatus);
router.delete("/:id", auth, deleteAttendance);

module.exports = router;


