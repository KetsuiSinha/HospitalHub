/**
 * Core LangChain.js recommendation engine
 * Uses structured output and chain-of-thought for transparent AI recommendations
 */
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { RecommendationResponseSchema } = require("./schemas");
const { SYSTEM_PROMPT, buildAnalysisPrompt } = require("./prompts");
const { prepareInventoryForAI, computeUsageMetrics } = require("./utils/inventoryAnalyzer");

/** Default fallback when AI is unavailable */
function getFallbackRecommendations(inventoryData) {
  const recommendations = [];
  const now = new Date();

  for (let i = 0; i < Math.min(inventoryData.length, 5); i++) {
    const m = inventoryData[i];
    const stock = m.stock ?? m.quantity ?? 0;
    const threshold = m.threshold ?? 100;
    const expiry = m.expiryDate ? new Date(m.expiryDate) : null;
    const critical = m.critical ?? false;

    if (stock < threshold && stock > 0) {
      recommendations.push({
        id: `fallback-restock-${i + 1}`,
        type: "RESTOCK",
        medicine: { name: m.name ?? m.itemName ?? "Unknown", id: m._id ?? m.id ?? null },
        action: `Reorder ${m.name ?? m.itemName} - stock at ${stock} (below ${threshold})`,
        reasoning: `Rule-based: Stock is below threshold. ${critical ? "Critical medicine - prioritize." : ""}`,
        confidence: 0.6,
        urgency: critical || stock < threshold / 2 ? "HIGH" : "MEDIUM",
        metadata: { currentStock: stock, recommendedQuantity: Math.max(threshold * 2, 100) },
      });
    } else if (expiry && expiry < now) {
      recommendations.push({
        id: `fallback-remove-${i + 1}`,
        type: "REMOVE",
        medicine: { name: m.name ?? m.itemName ?? "Unknown", id: m._id ?? m.id ?? null },
        action: `Remove expired ${m.name ?? m.itemName}`,
        reasoning: "Rule-based: Medicine has passed expiration date. Dispose per protocol.",
        confidence: 1,
        urgency: "HIGH",
        metadata: { expirationDate: expiry.toISOString().split("T")[0] },
      });
    }
  }

  return {
    recommendations,
    summary: {
      totalRecommendations: recommendations.length,
      highPriority: recommendations.filter((r) => r.urgency === "HIGH").length,
      estimatedImpact: `Fallback rules: ${recommendations.length} items need attention. Enable AI for full analysis.`,
    },
  };
}

/**
 * Generate AI recommendations from inventory and usage data
 * @param {Object} params
 * @param {Array} params.inventoryData - Raw medicine/inventory data
 * @param {Array} params.usageHistory - Optional usage history
 * @param {Object} params.filters - Optional { category, urgencyOnly }
 * @param {Object} params.options - { useAI: boolean, model: string }
 */
async function generateRecommendations({
  inventoryData = [],
  usageHistory = [],
  filters = {},
  options = {},
}) {
  const { useAI = true, model = "gpt-4o-mini" } = options;

  if (!inventoryData || inventoryData.length === 0) {
    return {
      recommendations: [],
      summary: {
        totalRecommendations: 0,
        highPriority: 0,
        estimatedImpact: "No inventory data to analyze.",
      },
    };
  }

  const prepared = prepareInventoryForAI(inventoryData);
  const metrics = usageHistory?.length
    ? computeUsageMetrics(usageHistory, inventoryData)
    : null;

  const enrichedInventory = prepared.map((item) => ({
    ...item,
    ...(metrics?.[item.id || item._id] || {}),
  }));

  if (!useAI || !process.env.OPENAI_API_KEY) {
    return getFallbackRecommendations(enrichedInventory);
  }

  try {
    const llm = new ChatOpenAI({
      modelName: model,
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const userPrompt = buildAnalysisPrompt({
      inventoryData: enrichedInventory,
      usageHistory: usageHistory || [],
      filters,
    });

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `${userPrompt}\n\nRespond with valid JSON matching this structure: { "recommendations": [...], "summary": { "totalRecommendations": number, "highPriority": number, "estimatedImpact": string } }`
      ),
    ];

    const response = await llm.invoke(messages);
    const text = typeof response.content === "string" ? response.content : response.content?.[0]?.text || "";

    const parsed = parseAIResponse(text);
    const validated = RecommendationResponseSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }

    return getFallbackRecommendations(enrichedInventory);
  } catch (err) {
    console.error("[AI Recommendation Engine] Error:", err.message);
    return getFallbackRecommendations(enrichedInventory);
  }
}

function parseAIResponse(text) {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }
  return JSON.parse(jsonMatch[0]);
}

module.exports = {
  generateRecommendations,
  getFallbackRecommendations,
};
