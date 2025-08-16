const express = require("express");
const router = express.Router();
const {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

router.post("/", createMedicine);
router.get("/", getMedicines);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;
