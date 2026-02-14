const express = require("express");
const router = express.Router();
const { getAIRecommendations } = require("../controllers/aiController");

router.post("/recommendations", getAIRecommendations);

module.exports = router;
