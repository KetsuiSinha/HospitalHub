/**
 * AI Recommendation API controller
 * POST /api/ai/recommendations
 */
const { generateRecommendations, validateInventoryData } = require("@hospitalhub/ai-service");
const Medicine = require("../models/medicine");

// Simple in-memory cache: key -> { data, expiresAt }
const cache = new Map();
const CACHE_TTL_MS = process.env.AI_CACHE_TTL_MS
  ? parseInt(process.env.AI_CACHE_TTL_MS, 10)
  : 60 * 60 * 1000; // 1 hour default

function getCacheKey(inventoryData, filters) {
  const inv = JSON.stringify(inventoryData?.map((i) => ({
    id: i._id ?? i.id,
    stock: i.stock ?? i.quantity,
    expiry: i.expiryDate ?? i.expiry,
  })) ?? []);
  const fil = JSON.stringify(filters ?? {});
  return `ai:${Buffer.from(inv + fil).toString("base64").slice(0, 64)}`;
}

exports.getAIRecommendations = async (req, res) => {
  try {
    const { inventoryData: bodyInventory, usageHistory = [], filters = {} } = req.body || {};
    const { hospital } = req.user || {};

    let inventoryData = bodyInventory;

    if (!inventoryData || inventoryData.length === 0) {
      const medicines = await Medicine.find(
        hospital ? { hospital } : {}
      ).lean();
      inventoryData = medicines.map((m) => ({
        _id: m._id,
        name: m.name,
        stock: m.stock,
        expiryDate: m.expiryDate,
        critical: m.critical,
        hospital: m.hospital,
        dosageForm: m.dosageForm,
        manufacturer: m.manufacturer,
        strength: m.strength,
      }));
    }

    const validation = validateInventoryData(inventoryData);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error,
        recommendations: [],
        summary: {
          totalRecommendations: 0,
          highPriority: 0,
          estimatedImpact: validation.error,
        },
      });
    }

    const cacheKey = getCacheKey(inventoryData, filters);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.data);
    }

    const result = await generateRecommendations({
      inventoryData,
      usageHistory,
      filters,
      options: {
        useAI: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      },
    });

    cache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    res.json(result);
  } catch (err) {
    console.error("[AI Controller]", err);
    res.status(500).json({
      error: "Failed to generate recommendations",
      recommendations: [],
      summary: {
        totalRecommendations: 0,
        highPriority: 0,
        estimatedImpact: "Error occurred. Try again or check logs.",
      },
    });
  }
};
