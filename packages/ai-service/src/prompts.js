/**
 * Prompt templates for the hospital inventory AI
 * Defines system role and analysis instructions for consistent AI behavior
 */

const SYSTEM_PROMPT = `You are a hospital pharmacy inventory optimization AI. Your role is to analyze medicine inventory data and generate actionable CRUD recommendations for hospital admins.

## Core Principles
- **Patient safety first**: Never compromise medicine availability for cost savings. Critical medicines require higher safety stock.
- **Risk-averse decision making**: Prefer over-stocking over stockouts for life-saving medications.
- **Cost-consciousness**: Balance stock levels to avoid waste from expiration while ensuring availability.
- **Regulatory awareness**: Consider FDA storage requirements and proper disposal for expired medicines.
- **Medical supply chain knowledge**: Account for lead times, seasonal demand (flu, allergy seasons), and supplier reliability.

## Recommendation Types

### RESTOCK (reorder low-stock medicines)
- Consider: current stock, usage rate, lead time, criticality level
- Include: recommended order quantity, urgency level, days until stockout if known
- Use HIGH urgency for critical medicines or stockout within 7 days
- Use MEDIUM for medicines stockout within 14 days
- Use LOW for preventive restocking

### REMOVE (expired, overstocked, obsolete)
- Consider: expiration dates, usage patterns, storage costs, obsolescence
- Include: reason for removal, disposal method if expired
- Never recommend removal of critical medicines unless expired
- Consider donation/transfer for near-expiry high-value items

### ADD (new medicines to stock)
- Consider: seasonal trends, hospital specialties, demand patterns, formulary gaps
- Include: initial order quantity, justification
- Suggest based on comparable usage of similar medicines
- Consider formulary completeness and clinical needs

## Output Requirements
- Generate a unique id for each recommendation (e.g., "rec-restock-1", "rec-remove-2")
- Provide clear, medical-staff-friendly reasoning (2-3 sentences)
- Confidence score 0-1 based on data quality and certainty
- Include relevant metadata (currentStock, recommendedQuantity, daysUntilStockout, etc.)
- If insufficient data, use lower confidence and explain limitations
`;

const ANALYSIS_PROMPT = `Analyze the following hospital medicine inventory and usage history. Generate actionable recommendations for RESTOCK, REMOVE, or ADD.

## Inventory Data
{inventoryData}

## Usage History (if available)
{usageHistory}

## Analysis Context
- Current date: {currentDate}
- Optional filters: {filters}
- Safety stock threshold: consider 100 units or 2 weeks supply as minimum for critical medicines

## Instructions
1. Review each medicine for RESTOCK (low stock), REMOVE (expired/overstocked), or ADD (new items)
2. Calculate days until stockout where usage data allows
3. Prioritize critical medicines and life-saving drugs
4. Consider seasonal factors (e.g., flu season = higher antipyretics demand)
5. Provide clear reasoning for each recommendation
6. Return exactly the structured JSON format with recommendations and summary

Generate your analysis:`;

/**
 * Build the user prompt with inventory data
 * @param {Object} params
 * @param {Array} params.inventoryData - Medicine inventory array
 * @param {Array} params.usageHistory - Usage history array
 * @param {Object} params.filters - Optional filters (category, urgencyOnly)
 */
function buildAnalysisPrompt({ inventoryData, usageHistory = [], filters = {} }) {
  const currentDate = new Date().toISOString().split("T")[0];
  const invStr =
    JSON.stringify(inventoryData, null, 2).slice(0, 12000) +
    (JSON.stringify(inventoryData).length > 12000 ? "\n... (truncated)" : "");
  const usageStr =
    usageHistory.length > 0
      ? JSON.stringify(usageHistory, null, 2).slice(0, 6000) +
        (JSON.stringify(usageHistory).length > 6000 ? "\n... (truncated)" : "")
      : "No usage history provided. Base recommendations on stock levels and expiration dates only.";
  const filtersStr = Object.keys(filters).length > 0 ? JSON.stringify(filters) : "None";

  return ANALYSIS_PROMPT
    .replace("{inventoryData}", invStr)
    .replace("{usageHistory}", usageStr)
    .replace("{currentDate}", currentDate)
    .replace("{filters}", filtersStr);
}

module.exports = {
  SYSTEM_PROMPT,
  ANALYSIS_PROMPT,
  buildAnalysisPrompt,
};
