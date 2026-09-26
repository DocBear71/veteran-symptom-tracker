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


// ============================================
// TIME-LIMITED RATING HELPER
// ============================================

import { monthsSinceDiagnosis, monthsSinceLinkedSurgery } from '../storage';
import { getTimeLimitInfo } from '../snomedMap';

/**
 * Decide which rating period a Veteran is in for a time-limited condition.
 *
 * Several endocrine conditions carry an initial rating for a fixed window and
 * are rated on residuals after it: hypoparathyroidism 100% for 3 months,
 * hyperthyroidism 30% for 6, and so on.
 *
 * Before the Diagnoses tab existed the app had no way to know the date, so
 * these analyzers returned the INITIAL rating to everyone — a Veteran
 * diagnosed a decade ago got 100% in their claim package, and that number fed
 * straight into the estimated combined rating. Overstating in a document a
 * Veteran hands to a rater is worse than saying nothing.
 *
 * So with no date on file this returns period 'unknown', and the analyzer must
 * decline to report a numeric rating rather than guessing.
 *
 * @param {string} conditionKey - e.g. 'hypoparathyroidism'
 * @param {object} options - pass monthsSinceDiagnosis to override for tests
 * @returns {{period, months, info, initialRating, windowMonths}}
 */
export const getRatingPeriod = (conditionKey, options = {}) => {
    const info = getTimeLimitInfo(conditionKey);
    if (!info) {
        return { period: 'not-time-limited', months: null, info: null };
    }

    // The override keeps this testable without touching storage.
    const months = options.monthsSinceDiagnosis !== undefined
        ? options.monthsSinceDiagnosis
        : monthsSinceDiagnosis(conditionKey);

    if (months === null || months === undefined) {
        return {
            period: 'unknown',
            months: null,
            info,
            initialRating: info.initialRating,
            windowMonths: info.months,
        };
    }

    return {
        period: months <= info.months ? 'initial' : 'residual',
        months,
        info,
        initialRating: info.initialRating,
        windowMonths: info.months,
    };
};

/**
 * The rationale and gap lines for each period. Kept here so all five
 * analyzers say the same thing in the same words.
 */
export const timeLimitedNarrative = (conditionName, ratingPeriod) => {
    const { period, months, initialRating, windowMonths, info } = ratingPeriod;
    const rationale = [];
    const gaps = [];

    if (period === 'unknown') {
        rationale.push(
            `${conditionName} is rated ${initialRating}% for its first ${windowMonths} months ` +
            `after diagnosis (DC ${info.dc}), then on whatever symptoms remain.`
        );
        rationale.push(
            'No diagnosis date is on file, so the app cannot tell which applies and ' +
            'is not estimating a rating for this condition.'
        );
        gaps.push(
            `Add your diagnosis date on the Diagnoses tab. Without it this condition ` +
            `has no rating estimate, and the ${initialRating}% initial rating may apply ` +
            `if you were diagnosed within the last ${windowMonths} months.`
        );
    } else if (period === 'initial') {
        const remaining = Math.max(0, windowMonths - months);
        rationale.push(
            `Diagnosed ${months.toFixed(1)} months ago, within the ${windowMonths}-month ` +
            `initial period for DC ${info.dc}. The ${initialRating}% rating applies.`
        );
        rationale.push(
            `About ${remaining.toFixed(1)} months remain before rating shifts to residuals.`
        );
        gaps.push(
            'Keep logging symptoms now. When the initial period ends, the rating is ' +
            'based on what remains, and that record is what supports it.'
        );
    } else if (period === 'residual') {
        rationale.push(
            `Diagnosed ${months.toFixed(1)} months ago, past the ${windowMonths}-month ` +
            `initial period for DC ${info.dc}. Rating is based on remaining symptoms.`
        );
    } else {
        // 'not-time-limited': an analyzer asked for a key that isn't in
        // TIME_LIMITED_CONDITIONS. That's a setup bug, so say so on the card.
        rationale.push(
            `${conditionName}: time-limit setup is missing (TIME_LIMITED_CONDITIONS ` +
            `in snomedMap.js). No rating is estimated.`
        );
    }

    return { rationale, gaps };
};

// ============================================
// TIME-LIMITED STATUS VALUES
// ============================================

/**
 * What a time-limited analyzer returns as supportedRating when it has no
 * honest number. Rating cards read these through utils/timeLimitedRating.js,
 * which imports this same object, so the strings can't drift apart.
 */
export const RATING_STATUS = {
    RESIDUALS: 'Rate residuals',
    DATE_NEEDED: 'Diagnosis date needed',
    CONFIG_MISSING: 'Time-limit setup missing',
};

/**
 * The supportedRating for a time-limited condition, given its rating period.
 *
 * @param {object} ratingPeriod - from getRatingPeriod()
 * @param {number} initialRating - the rating inside the initial window
 * @returns {number|string} the number, or a RATING_STATUS string
 */
export const timeLimitedSupportedRating = (ratingPeriod, initialRating) => {
    switch (ratingPeriod.period) {
        case 'initial':
            return initialRating;
        case 'residual':
            return RATING_STATUS.RESIDUALS;
        case 'unknown':
            return RATING_STATUS.DATE_NEEDED;
        default:
            // Fail loud: never guess a period.
            console.error(
                `[timeLimitedSupportedRating] Unexpected period "${ratingPeriod.period}". ` +
                'Check the condition key against TIME_LIMITED_CONDITIONS in snomedMap.js.'
            );
            return RATING_STATUS.CONFIG_MISSING;
    }
};


// ============================================
// SURGERY-LIMITED RATING HELPER
// ============================================

/**
 * Conditions whose initial rating runs from SURGERY, not diagnosis.
 * Kept apart from TIME_LIMITED_CONDITIONS (snomedMap.js) because the clock
 * comes from a linked surgery record, not the Diagnoses tab.
 *
 * DC 7904: "For six months from date of discharge following surgery" - 100%
 */
export const SURGERY_LIMITED_CONDITIONS = {
    'hyperparathyroidism': { months: 6, initialRating: 100, dc: '7904' },
};

/**
 * Which post-surgical period a Veteran is in.
 *
 * Periods:
 *   'post-surgical'  within the window after discharge (initial rating applies)
 *   'after-window'   the window has ended
 *   'scheduled'      linked surgery is dated in the future. Per the DC 7904
 *                    note, the current evaluation continues until the day of
 *                    surgery.
 *   'no-surgery'     no surgery linked to this condition
 */
export const getSurgeryRatingPeriod = (conditionKey) => {
    const info = SURGERY_LIMITED_CONDITIONS[conditionKey];
    if (!info) {
        console.error(
            `[getSurgeryRatingPeriod] "${conditionKey}" is not in SURGERY_LIMITED_CONDITIONS.`
        );
        return { period: 'not-surgery-limited', info: null };
    }

    const linked = monthsSinceLinkedSurgery(conditionKey);
    if (!linked) return { period: 'no-surgery', info };

    let period;
    if (linked.months < 0) period = 'scheduled';
    else if (linked.months <= info.months) period = 'post-surgical';
    else period = 'after-window';

    return { period, info, ...linked };
};

/**
 * Rationale and gap lines for each surgery period, worded the same way
 * wherever they appear.
 */
export const surgeryLimitedNarrative = (conditionName, sp) => {
    const rationale = [];
    const gaps = [];
    const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString();

    if (sp.period === 'not-surgery-limited') {
        rationale.push(
            `${conditionName}: surgery-period setup is missing ` +
            '(SURGERY_LIMITED_CONDITIONS in _shared.js).'
        );
        return { rationale, gaps };
    }

    const { info } = sp;

    if (sp.period === 'no-surgery') {
        gaps.push(
            `If you had surgery for this condition, add it to your surgery records and link it ` +
            `to ${conditionName}. DC ${info.dc} rates ${info.initialRating}% for ${info.months} ` +
            'months from discharge after surgery.'
        );
        return { rationale, gaps };
    }

    const procedure = sp.surgery?.procedureName || 'Linked surgery';
    const dateText = sp.dateSource === 'discharge'
        ? `discharged ${fmt(sp.clockDate)}`
        : `surgery date ${fmt(sp.clockDate)}`;

    if (sp.period === 'post-surgical') {
        const remaining = Math.max(0, info.months - sp.months);
        rationale.push(
            `${procedure} (${dateText}). DC ${info.dc} rates ${info.initialRating}% for ` +
            `${info.months} months from discharge following surgery.`
        );
        rationale.push(`About ${remaining.toFixed(1)} months remain in the post-surgical period.`);
    } else if (sp.period === 'after-window') {
        rationale.push(
            `${procedure} (${dateText}) was more than ${info.months} months ago. The ` +
            `post-surgical ${info.initialRating}% period has ended; the rating is based on ` +
            'current symptoms, and residuals are rated under their own codes.'
        );
    } else if (sp.period === 'scheduled') {
        rationale.push(
            `${procedure} is dated ${fmt(sp.surgery.surgeryDate)}, in the future. Until the day ` +
            `of surgery the current evaluation continues; the ${info.initialRating}% period ` +
            'starts at discharge.'
        );
    }

    // Disclosed fallback: surgery date standing in for a missing discharge date
    if (sp.dateSource === 'surgery' && (sp.period === 'post-surgical' || sp.period === 'after-window')) {
        rationale.push(
            'No discharge date is on the surgery record, so the surgery date is used. ' +
            'Discharge is the same day or later, so this can only end the period early, never late.'
        );
        gaps.push('Add the discharge date to the surgery record for an exact post-surgical period.');
    }

    return { rationale, gaps };
};