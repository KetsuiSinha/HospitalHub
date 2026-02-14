/**
 * Zod schemas for AI recommendation validation and structured output
 * Ensures AI responses conform to expected format
 */
const { z } = require("zod");

/** Medicine reference in a recommendation */
const MedicineRefSchema = z.object({
  name: z.string(),
  id: z.string().nullable(),
});

/** Metadata varies by recommendation type */
const RecommendationMetadataSchema = z.object({
  currentStock: z.number().optional(),
  recommendedQuantity: z.number().optional(),
  estimatedCost: z.number().optional(),
  daysUntilStockout: z.number().optional(),
  expirationDate: z.string().optional(),
  usageRate: z.number().optional(),
  leadTimeDays: z.number().optional(),
}).passthrough();

/** Single recommendation item */
const RecommendationItemSchema = z.object({
  id: z.string(),
  type: z.enum(["RESTOCK", "REMOVE", "ADD"]),
  medicine: MedicineRefSchema,
  action: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
  urgency: z.enum(["HIGH", "MEDIUM", "LOW"]),
  metadata: RecommendationMetadataSchema.optional(),
});

/** Summary of all recommendations */
const RecommendationSummarySchema = z.object({
  totalRecommendations: z.number(),
  highPriority: z.number(),
  estimatedImpact: z.string(),
});

/** Full recommendation response */
const RecommendationResponseSchema = z.object({
  recommendations: z.array(RecommendationItemSchema),
  summary: RecommendationSummarySchema,
});

module.exports = {
  MedicineRefSchema,
  RecommendationMetadataSchema,
  RecommendationItemSchema,
  RecommendationSummarySchema,
  RecommendationResponseSchema,
};
