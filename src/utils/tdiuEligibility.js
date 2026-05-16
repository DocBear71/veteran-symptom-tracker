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

// =============================================================================
// POVERTY THRESHOLD CONSTANTS
// =============================================================================
// VA marginal employment uses the U.S. Census Bureau Poverty THRESHOLD for one
// person under 65 (NOT the HHS Poverty Guideline — they are different numbers).
// Reference: M21-1 Part IV, Subpart ii, 2.F.32 and 38 CFR §4.16(a).
//
// The Census Bureau publishes finalized thresholds ~one year after the data
// year (e.g., 2024 thresholds published September 2025). When a new threshold
// is published, VBA updates M21-1 — at that point we update this map.
//
// Storing the year-by-year history (not just the current value) lets us
// correctly evaluate retrospective claims — e.g., "was the veteran's 2022
// employment marginal?" requires the 2022 threshold, not the current one.
export const POVERTY_THRESHOLDS = {
  // Source: U.S. Census Bureau, Poverty Thresholds, Table 1.
  // Weighted average threshold, one person under 65 (single individual).
  2019: 13300,
  2020: 13465,
  2021: 14097,
  2022: 14880,
  2023: 15852,
  2024: 16320,
  // 2025: Census Bureau expected to finalize September 2026.
  // When published, add the value here and bump CURRENT_POVERTY_THRESHOLD_YEAR.
};

// The most recent FINAL Census Bureau threshold. Update this constant whenever
// a new year is added to POVERTY_THRESHOLDS above.
export const CURRENT_POVERTY_THRESHOLD_YEAR = 2024;
export const CURRENT_POVERTY_THRESHOLD = POVERTY_THRESHOLDS[CURRENT_POVERTY_THRESHOLD_YEAR];

/**
 * Look up the Census Bureau poverty threshold for a given calendar year.
 * Falls back to the most recent threshold if the requested year is not yet
 * published. Years before 2019 fall back to the earliest stored year.
 *
 * @param {number} year - Calendar year (e.g., 2023)
 * @returns {{ value: number, year: number, isFallback: boolean }}
 */
export const getPovertyThreshold = (year) => {
  if (POVERTY_THRESHOLDS[year] !== undefined) {
    return { value: POVERTY_THRESHOLDS[year], year, isFallback: false };
  }

  // Year not in our map — fall back to closest available
  const availableYears = Object.keys(POVERTY_THRESHOLDS).map(Number).sort();
  if (!availableYears.length) {
    return { value: 0, year: 0, isFallback: true };
  }

  // Future year (not yet published) → use most recent
  if (year > availableYears[availableYears.length - 1]) {
    const latest = availableYears[availableYears.length - 1];
    return { value: POVERTY_THRESHOLDS[latest], year: latest, isFallback: true };
  }

  // Past year before our records → use earliest
  const earliest = availableYears[0];
  return { value: POVERTY_THRESHOLDS[earliest], year: earliest, isFallback: true };
};

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

// =============================================================================
// MARGINAL EMPLOYMENT ANALYSIS
// =============================================================================
// Marginal employment under 38 CFR §4.16(a) exists when either:
//   (a) earned annual income ≤ Census Bureau poverty threshold for one person, OR
//   (b) on a facts-found basis, employment is in a "protected environment"
//       (e.g., family business, sheltered workshop), even when income exceeds
//       the threshold.
//
// This module computes BOTH determinations and returns a structured analysis
// the UI can render. It NEVER renders a determination — that is for the VA
// adjudicator. The output is framed as "flags potential marginal employment
// for VSO/attorney review."

/**
 * Analyze whether employment is "marginal" under §4.16(a).
 *
 * This function performs only the income test. The protected-environment
 * facts-found test is in analyzeProtectedEnvironment() — they are separate
 * pathways and should be evaluated independently.
 *
 * @param {object} employmentStatus - From getEmploymentStatus()
 * @param {object} options
 * @param {number} [options.referenceYear] - Year to evaluate against
 *   (default: current year). Use the year the earnings were earned.
 * @returns {object} Analysis with state-specific fields.
 */
export const analyzeMarginalEmployment = (employmentStatus, options = {}) => {
  const referenceYear = options.referenceYear || new Date().getFullYear();
  const threshold = getPovertyThreshold(referenceYear);

  // ============================================
  // STATE: No employment data
  // ============================================
  if (!employmentStatus) {
    return {
      state: 'no-data',
      threshold: threshold.value,
      thresholdYear: threshold.year,
      thresholdIsFallback: threshold.isFallback,
      citation: '38 CFR §4.16(a)',
    };
  }

  // ============================================
  // STATE: Not currently employed
  // ============================================
  if (employmentStatus.currentlyEmployed === false) {
    return {
      state: 'not-employed',
      threshold: threshold.value,
      thresholdYear: threshold.year,
      thresholdIsFallback: threshold.isFallback,
      lastEmployedDate: employmentStatus.lastEmployedDate || '',
      citation: '38 CFR §4.16(a)',
    };
  }

  // ============================================
  // STATE: Employed — evaluate income vs threshold
  // ============================================
  const annualIncome = Number(employmentStatus.annualIncome) || 0;
  const overThreshold = annualIncome > threshold.value;

  // Track how long the veteran has been over threshold — relevant for the
  // ~12-month review window where VA may send VA Form 21-4140.
  let monthsOverThreshold = null;
  if (overThreshold && employmentStatus.overThresholdSince) {
    const since = new Date(employmentStatus.overThresholdSince);
    const now = new Date();
    if (!isNaN(since.getTime())) {
      monthsOverThreshold = Math.floor(
          (now - since) / (1000 * 60 * 60 * 24 * 30.44)
      );
    }
  }

  return {
    state: overThreshold ? 'above-threshold' : 'below-threshold',
    annualIncome,
    threshold: threshold.value,
    thresholdYear: threshold.year,
    thresholdIsFallback: threshold.isFallback,
    overThreshold,
    monthsOverThreshold,
    // Flag the ~12-month review window
    nearReviewWindow: monthsOverThreshold !== null && monthsOverThreshold >= 9,
    pastReviewWindow: monthsOverThreshold !== null && monthsOverThreshold >= 12,
    citation: '38 CFR §4.16(a)',
  };
};

// =============================================================================
// PROTECTED ENVIRONMENT ANALYSIS
// =============================================================================
// Protected/sheltered employment under §4.16(a) is a facts-found determination.
// There is no bright-line rule (see Cantrell v. Shulkin, 28 Vet. App. 382 (2017)),
// so this analysis can only FLAG indicators — it cannot render a determination.

/**
 * Accommodation flags the user can record. Each item maps to a category VA
 * has historically considered when evaluating protected-environment status.
 * Sourced from M21-1 guidance and case law (Cantrell, Faust).
 *
 * The "qualifying" array is examples that MAY support a protected-environment
 * finding. The "nonQualifying" array is examples that DO NOT, by themselves,
 * support such a finding (used to set expectations correctly).
 */
export const PROTECTED_ENVIRONMENT_INDICATORS = {
  qualifying: [
    { id: 'flexible-schedule-sc', label: 'Flexible schedule tied to SC conditions (PTSD, migraines, panic, etc.)' },
    { id: 'excused-absences', label: 'Excessive absences or lateness routinely excused' },
    { id: 'reduced-productivity', label: 'Reduced productivity standards or quotas' },
    { id: 'own-pace', label: 'Permission to work at own pace' },
    { id: 'extra-breaks', label: 'Extra breaks beyond normal company policy' },
    { id: 'excused-duties', label: 'Excused from critical duties, deadlines, or meetings' },
    { id: 'family-friend-employer', label: 'Family/friend-owned employer making special accommodations' },
    { id: 'tolerated-outbursts', label: 'Behavioral or interpersonal issues tolerated' },
    { id: 'reduced-workload-full-pay', label: 'Reduced workload while maintaining normal pay' },
    { id: 'isolation-accommodations', label: 'Remote or isolated work assignments beyond coworker norm' },
  ],
  nonQualifying: [
    { id: 'works-alone', label: 'Simply working alone' },
    { id: 'low-stress-job', label: 'Choosing a low-stress job' },
    { id: 'self-employed-only', label: 'Self-employment by itself' },
    { id: 'wfh-only', label: 'Working from home alone' },
    { id: 'ada-only', label: 'Standard ADA accommodations alone' },
  ],
};

/**
 * Analyze indicators of a protected/sheltered work environment.
 *
 * @param {object} employmentStatus - From getEmploymentStatus()
 * @returns {object} Analysis with indicator counts and evidence gaps.
 */
export const analyzeProtectedEnvironment = (employmentStatus) => {
  // ============================================
  // STATE: No employment data
  // ============================================
  if (!employmentStatus) {
    return {
      state: 'no-data',
      citation: '38 CFR §4.16(a)',
      caseLawAnchors: ['cantrell', 'faust'],
    };
  }

  // ============================================
  // STATE: Not currently employed
  // ============================================
  if (employmentStatus.currentlyEmployed === false) {
    return {
      state: 'not-employed',
      citation: '38 CFR §4.16(a)',
      caseLawAnchors: ['cantrell', 'faust'],
    };
  }

  // ============================================
  // Count selected indicators
  // ============================================
  const selectedQualifying = Array.isArray(employmentStatus.accommodations)
      ? employmentStatus.accommodations.filter(id =>
          PROTECTED_ENVIRONMENT_INDICATORS.qualifying.some(q => q.id === id)
      )
      : [];

  const selectedNonQualifying = Array.isArray(employmentStatus.accommodations)
      ? employmentStatus.accommodations.filter(id =>
          PROTECTED_ENVIRONMENT_INDICATORS.nonQualifying.some(n => n.id === id)
      )
      : [];

  // ============================================
  // Evidence gap analysis — Cantrell requires the Board explain its reasoning,
  // so the veteran's job is to make sure the record contains explainable evidence.
  // These are the categories M21-1 and case law cite as relevant.
  // ============================================
  const evidenceCollected = employmentStatus.evidence || {};
  const evidenceGaps = [];

  if (!evidenceCollected.employerLetter) {
    evidenceGaps.push({
      id: 'employer-letter',
      label: 'Detailed employer letter',
      importance: 'critical',
      note: 'Most important single piece of evidence. Should describe accommodations, excused duties, relaxed standards, and whether veteran would survive in a competitive environment.',
    });
  }
  if (!evidenceCollected.attendanceRecords) {
    evidenceGaps.push({
      id: 'attendance-records',
      label: 'Attendance or payroll records showing missed work / reduced hours',
      importance: 'high',
    });
  }
  if (!evidenceCollected.coworkerStatements) {
    evidenceGaps.push({
      id: 'coworker-statements',
      label: 'Statements from coworkers or supervisors',
      importance: 'medium',
    });
  }
  if (!evidenceCollected.jobDescription) {
    evidenceGaps.push({
      id: 'job-description',
      label: 'Written job description showing duties excused',
      importance: 'medium',
    });
  }
  if (!evidenceCollected.vocationalOpinion) {
    evidenceGaps.push({
      id: 'vocational-opinion',
      label: 'Vocational expert opinion',
      importance: 'medium',
      note: 'Particularly valuable when challenging a denial.',
    });
  }
  if (!evidenceCollected.medicalNexus) {
    evidenceGaps.push({
      id: 'medical-nexus',
      label: 'Medical evidence linking accommodations to service-connected conditions',
      importance: 'high',
    });
  }

  // ============================================
  // STATE: Has at least one qualifying indicator → potential protected env
  // ============================================
  if (selectedQualifying.length > 0) {
    return {
      state: 'potential-protected-env',
      qualifyingIndicators: selectedQualifying,
      qualifyingCount: selectedQualifying.length,
      nonQualifyingIndicators: selectedNonQualifying,
      evidenceGaps,
      evidenceComplete: evidenceGaps.length === 0,
      // The "strength" heuristic is rough — used only to suggest where to focus
      // documentation effort. The actual determination is VA's.
      indicatorStrength: selectedQualifying.length >= 4 ? 'strong'
          : selectedQualifying.length >= 2 ? 'moderate'
              : 'limited',
      citation: '38 CFR §4.16(a)',
      caseLawAnchors: ['cantrell', 'faust'],
    };
  }

  // ============================================
  // STATE: Only non-qualifying indicators selected
  // ============================================
  if (selectedNonQualifying.length > 0) {
    return {
      state: 'non-qualifying-only',
      nonQualifyingIndicators: selectedNonQualifying,
      evidenceGaps,
      citation: '38 CFR §4.16(a)',
      caseLawAnchors: ['cantrell', 'faust'],
    };
  }

  // ============================================
  // STATE: Employed, no indicators selected
  // ============================================
  return {
    state: 'no-indicators',
    evidenceGaps,
    citation: '38 CFR §4.16(a)',
    caseLawAnchors: ['cantrell', 'faust'],
  };
};