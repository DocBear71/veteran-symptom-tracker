// src/utils/ratingLogic/_shared.js
//
// Shared infrastructure for the body-system rating analyzers.
// Each analyzer file imports the helpers it needs from here rather than
// re-declaring them locally. This is consumed only by sibling files in
// `ratingLogic/` — these helpers are not part of the public ratingLogic
// API and are not re-exported from `ratingLogic/index.js`.
//
// History: extracted in November 2025 (Phase 9) from neurological.js
// and from duplicated declarations in musculoskeletal.js, mentalHealth.js,
// cardiorespiratory.js, digestive.js, and genitourinary.js.

// =============================================================================
// LOG-IDENTITY HELPERS
// =============================================================================

/**
 * Safely get a symptom ID from a log entry.
 *
 * Logs in older formats may use `symptom` (the field name before we
 * standardized on `symptomId`). This wrapper checks both for backward
 * compatibility with historical localStorage data.
 *
 * @param {object} log - A symptom log entry
 * @returns {string|null} The symptom ID, or null if neither field is set
 */
export const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

/**
 * Check whether a log's timestamp falls within the last N days from "now".
 *
 * @param {string|Date|number} timestamp - The log's timestamp (anything Date() accepts)
 * @param {number} days - Length of the evaluation window in days
 * @returns {boolean} True if the timestamp is within the window
 */
export const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

// =============================================================================
// SYMPTOM PATTERN HELPERS
// =============================================================================

/**
 * Count distinct calendar days represented in a set of logs.
 *
 * Multiple logs on the same day count as one. Used for metrics like
 * "Numbness Days" where the question is "how many days were affected?"
 * not "how many times was it logged?"
 *
 * Day keys are computed in local time (YYYY-MM-DD), which matches how
 * users perceive "today" vs. "yesterday" regardless of UTC offset.
 *
 * Example: 3 logs all on 2026-01-15 → returns 1 (one day affected).
 *
 * @param {Array} logs - Logs to count distinct days for
 * @returns {number} The number of distinct calendar days
 */
export const countDistinctDays = (logs) => {
  if (!logs || logs.length === 0) return 0;
  const uniqueDays = new Set(
      logs.map(log => {
        const d = new Date(log.timestamp);
        // YYYY-MM-DD key in local time
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
  );
  return uniqueDays.size;
};

/**
 * Classify a symptom's pattern based on how much of the evaluation window
 * is covered by distinct days of symptoms.
 *
 * Used for chronic conditions (e.g., polyneuropathy, radiculopathy) where
 * "continuous daily symptoms" is regulatorily different from "frequent
 * intermittent episodes" — the analyzer can lead with pattern rather than
 * raw episode counts.
 *
 * @param {number} distinctDays - Output of countDistinctDays() on the relevant logs
 * @param {number} evaluationPeriodDays - Length of the evaluation window
 * @returns {'continuous'|'persistent'|'frequent'|'intermittent'|'sparse'}
 *   - continuous   ≥80% coverage (daily/near-daily — chronic EMG-confirmed picture)
 *   - persistent   ≥50% coverage (most days have symptoms)
 *   - frequent     ≥25% coverage (several times per week)
 *   - intermittent ≥10% coverage (a few times per week)
 *   - sparse       <10% coverage (occasional flares)
 */
export const classifySymptomPattern = (distinctDays, evaluationPeriodDays) => {
  if (distinctDays === 0 || evaluationPeriodDays === 0) return 'sparse';
  const coverage = distinctDays / evaluationPeriodDays;
  if (coverage >= 0.80) return 'continuous';
  if (coverage >= 0.50) return 'persistent';
  if (coverage >= 0.25) return 'frequent';
  if (coverage >= 0.10) return 'intermittent';
  return 'sparse';
};