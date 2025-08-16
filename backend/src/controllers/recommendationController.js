const Recommendation = require("../models/recommendation");

exports.createRecommendation = async (req, res) => {
  try {
    const recommendation = new Recommendation(req.body);
    await recommendation.save();
    res.status(201).json(recommendation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(recommendation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    await Recommendation.findByIdAndDelete(req.params.id);
    res.json({ message: "Recommendation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
