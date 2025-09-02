const express = require("express");
const router = express.Router();
const { listByHospital, create, update, remove } = require("../controllers/staffController");
const auth = require("../middleware/authMiddleware");

// All routes require auth
router.get("/", auth, listByHospital);

// Admin-only CRUD
router.post("/", auth, auth.requireAdmin, create);
router.put("/:id", auth, auth.requireAdmin, update);
router.delete("/:id", auth, auth.requireAdmin, remove);

module.exports = router;


