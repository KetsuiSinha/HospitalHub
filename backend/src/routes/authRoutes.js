const express = require("express");
const router = express.Router();
const { signup, signin, checkHospitalAdmin, inviteStaff } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/check-hospital-admin/:hospital", checkHospitalAdmin);
router.post("/invite-staff", authMiddleware, inviteStaff);

module.exports = router;
