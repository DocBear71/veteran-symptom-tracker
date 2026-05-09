/**
 * TDIU ELIGIBILITY ANALYSIS
 *
 * Implements the §4.16(a) schedular TDIU eligibility check based on the
 * user's service-connected ratings. Returns a structured analysis the UI
 * can render.
 *
 * 38 CFR §4.16(a) — Schedular TDIU requirements:
 *   - One single rating ≥ 60%, OR
 *   - Combined rating ≥ 70% with at least one rating ≥ 40%
 *
 * Edge cases NOT computed (intentionally, per scoping):
 *   - Disabilities of one body system combined as one rating
 *   - Disabilities from common etiology combined
 *   - Bilateral factor (10% bonus)
 *   - Extra-schedular TDIU under §4.16(b) — flagged in output but not computed
 *
 * The function NEVER renders a determination. It produces a flag for the
 * user to discuss with a VSO. Even when the math says "yes," the user is
 * always pointed to a VSO for the actual employment-side analysis.
 */

import { calculateCombinedRating } from './vaRatingCalculator';

/**
 * Analyze TDIU eligibility for a profile.
 *
 * @param {Array} serviceConnectedConditions - From getServiceConnectedConditions()
 * @param {object|null} tdiuStatus - From getTDIUStatus(), null if not granted
 * @returns {object} Analysis result with state-specific fields
 */
export const analyzeTDIUEligibility = (serviceConnectedConditions, tdiuStatus) => {
  // ============================================
  // STATE: TDIU already granted
  // ============================================
  // When TDIU is already granted, eligibility analysis is moot. Return a
  // result focused on protection/maintenance education instead.
  if (tdiuStatus?.granted) {
    return {
      state: 'granted',
      tdiuType: tdiuStatus.type || 'schedular',
      permanentAndTotal: tdiuStatus.permanentAndTotal === true,
      effectiveDate: tdiuStatus.effectiveDate || '',
      citation: '38 CFR §4.16',
      // educational content is rendered by the UI; no math fields populated
    };
  }

  // ============================================
  // No conditions yet — caller should render an onboarding prompt
  // ============================================
  if (!serviceConnectedConditions || serviceConnectedConditions.length === 0) {
    return {
      state: 'no-conditions',
      citation: '38 CFR §4.16(a)',
    };
  }

  // ============================================
  // Compute schedular eligibility
  // ============================================
  const ratings = serviceConnectedConditions
  .map(c => c.currentRating)
  .filter(r => r > 0);

  const combinedRating = calculateCombinedRating(ratings);

  // Pathway A — single condition ≥ 60%
  const singleConditionAt60 = serviceConnectedConditions.filter(
      c => c.currentRating >= 60
  );
  const meetsSinglePathway = singleConditionAt60.length > 0;

  // Pathway B — combined ≥ 70% AND at least one rating ≥ 40%
  const conditionsAt40 = serviceConnectedConditions.filter(
      c => c.currentRating >= 40
  );
  const meetsCombinedPathway = combinedRating >= 70 && conditionsAt40.length >= 1;

  // ============================================
  // STATE: Schedular eligibility met
  // ============================================
  if (meetsSinglePathway || meetsCombinedPathway) {
    // Prefer the single-condition pathway when both apply (cleaner narrative).
    const pathway = meetsSinglePathway ? 'single-condition' : 'multi-condition';

    // Identify the qualifying condition(s) for narrative display
    const qualifyingConditions = pathway === 'single-condition'
        ? singleConditionAt60
        : conditionsAt40;

    return {
      state: 'eligible-schedular',
      combinedRating,
      pathway,
      qualifyingConditions: qualifyingConditions.map(c => ({
        conditionName: c.conditionName,
        currentRating: c.currentRating,
      })),
      citation: '38 CFR §4.16(a)',
    };
  }

  // ============================================
  // STATE: Schedular thresholds NOT met
  // ============================================
  // Compute the "shortfall" — how far the user is from each pathway.
  // Used by the UI to show targeted "you'd need X" framing.
  const highestSingle = ratings.length > 0 ? Math.max(...ratings) : 0;

  return {
    state: 'not-eligible-schedular',
    combinedRating,
    highestSingleRating: highestSingle,
    shortfall: {
      // Single-condition pathway gap
      needsSingleAt60: highestSingle < 60,
      singleGap: Math.max(0, 60 - highestSingle),
      // Combined pathway gap
      needsCombinedAt70: combinedRating < 70,
      combinedGap: Math.max(0, 70 - combinedRating),
      // Combined pathway also requires at least one rating ≥ 40%
      hasAt40: conditionsAt40.length >= 1,
    },
    citation: '38 CFR §4.16(a)',
  };
};

/**
 * Helper: returns true if the analysis represents a state where the user
 * should be pointed at the full TDIU tool (Phase 2). All non-granted states
 * benefit from the tool; granted state benefits less.
 */
export const shouldPromptFullTool = (analysis) => {
  return analysis.state === 'eligible-schedular' ||
      analysis.state === 'not-eligible-schedular';
};