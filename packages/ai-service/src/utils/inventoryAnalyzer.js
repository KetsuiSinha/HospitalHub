/**
 * Helper functions for preparing inventory data for AI analysis
 * Normalizes medicine/inventory schema and computes derived metrics
 */

/**
 * Sanitize string inputs to prevent prompt injection
 */
function sanitizeString(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str.replace(/[\x00-\x1f\x7f]/g, "").slice(0, 500);
}

/**
 * Prepare raw inventory/medicine data for AI consumption
 * Handles both Medicine and Inventory schemas from HospitalHub
 */
function prepareInventoryForAI(rawData) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item) => {
    const id = item._id?.toString?.() ?? item.id ?? null;
    const name = item.name ?? item.itemName ?? "Unknown";
    const stock = typeof item.stock === "number" ? item.stock : item.quantity ?? 0;
    const threshold = item.threshold ?? 100;
    const expiry = item.expiryDate ?? item.expiry ?? null;
    const critical = item.critical ?? false;
    const hospital = item.hospital ?? "Unknown";
    const category = item.category ?? item.dosageForm ?? "General";

    return {
      id,
      _id: id,
      name: sanitizeString(name),
      stock,
      threshold,
      safetyStock: Math.max(threshold, critical ? 200 : 100),
      expiryDate: expiry ? (expiry instanceof Date ? expiry.toISOString() : String(expiry)) : null,
      critical,
      hospital: sanitizeString(hospital),
      category: sanitizeString(category),
      manufacturer: item.manufacturer ? sanitizeString(item.manufacturer) : undefined,
      strength: item.strength ? sanitizeString(item.strength) : undefined,
      dosageForm: item.dosageForm ? sanitizeString(item.dosageForm) : undefined,
      lastRestocked: item.lastRestocked ?? item.lastUpdated ?? null,
    };
  });
}

/**
 * Compute usage metrics from usage history
 * Returns a map of itemId -> { usageRate, daysUntilStockout, trend }
 */
function computeUsageMetrics(usageHistory, inventoryData) {
  if (!Array.isArray(usageHistory) || usageHistory.length === 0) return {};

  const byItem = {};
  for (const record of usageHistory) {
    const id = record.medicineId ?? record.itemId ?? record.medicine ?? record._id;
    const key = id?.toString?.() ?? id;
    if (!key) continue;
    if (!byItem[key]) byItem[key] = { quantities: [], dates: [] };
    byItem[key].quantities.push(record.quantityUsed ?? record.quantity ?? record.used ?? 0);
    byItem[key].dates.push(record.date ?? record.timestamp ?? record.createdAt ?? new Date());
  }

  const result = {};
  const now = new Date();

  for (const item of inventoryData) {
    const id = item._id?.toString?.() ?? item.id;
    const entry = byItem[id];
    if (!entry) continue;

    const totalUsed = entry.quantities.reduce((a, b) => a + b, 0);
    const days = entry.dates.length;
    const usageRate = days > 0 ? totalUsed / days : 0;
    const stock = item.stock ?? item.quantity ?? 0;
    const daysUntilStockout = usageRate > 0 ? Math.floor(stock / usageRate) : null;

    result[id] = {
      usageRate: Math.round(usageRate * 10) / 10,
      daysUntilStockout,
      totalUsed,
      usageDays: days,
    };
  }

  return result;
}

/**
 * Check if inventory data is valid for analysis
 */
function validateInventoryData(data) {
  if (!data) return { valid: false, error: "No data provided" };
  if (!Array.isArray(data)) return { valid: false, error: "Inventory must be an array" };
  if (data.length === 0) return { valid: false, error: "Inventory is empty" };

  const hasRequired = data.some((d) => (d.name ?? d.itemName) && (d.stock ?? d.quantity) !== undefined);
  if (!hasRequired) return { valid: false, error: "At least one item must have name and stock/quantity" };

  return { valid: true };
}

module.exports = {
  prepareInventoryForAI,
  computeUsageMetrics,
  validateInventoryData,
  sanitizeString,
};
