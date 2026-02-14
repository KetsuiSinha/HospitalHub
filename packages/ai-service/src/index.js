/**
 * @hospitalhub/ai-service
 * LangChain.js AI recommendation engine for HospitalHub inventory
 */
const { generateRecommendations, getFallbackRecommendations } = require("./recommendationEngine");
const {
  prepareInventoryForAI,
  computeUsageMetrics,
  validateInventoryData,
} = require("./utils/inventoryAnalyzer");
const { RecommendationResponseSchema } = require("./schemas");

module.exports = {
  generateRecommendations,
  getFallbackRecommendations,
  prepareInventoryForAI,
  computeUsageMetrics,
  validateInventoryData,
  RecommendationResponseSchema,
};
