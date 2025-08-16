const express = require("express");
const router = express.Router();
const {
  createRecommendation,
  getRecommendations,
  updateRecommendation,
  deleteRecommendation,
} = require("../controllers/recommendationController");

router.post("/", createRecommendation);
router.get("/", getRecommendations);
router.put("/:id", updateRecommendation);
router.delete("/:id", deleteRecommendation);

module.exports = router;
