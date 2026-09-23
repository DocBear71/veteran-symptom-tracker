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
// VA marginal employment uses the U.S. Census Bureau Poverty THRESHOLD for
// "One person (unrelated individual)" — the weighted-average line, NOT the
// "Under 65 years" sub-line beneath it, and NOT the HHS Poverty Guideline.
//
// ⚠️ THIS IS THE EASIEST MISTAKE TO MAKE HERE. In the Census worksheet the
// row reads:
//     One person (unrelated individual):    16,330   ← THIS ONE
//       Under 65 years..............        16,750   16,749
//       65 years and over...........        15,440   15,440
// The under-65 figure is ~$400 higher and is widely quoted in error, including
// by VA practitioners. Using it tells a Veteran they are under the threshold
// when VA would find them over — the dangerous direction.
//
// Authority for the weighted-average line: VA's own Federal Register notices
// announcing this figure for §4.16(a) purposes consistently read "the weighted
// average poverty threshold for one person (unrelated individual)" (e.g. 1996
// $7,995; 1999 $8,501; 2000 $8,794), each matching that Census row.
//
// References: 38 CFR §4.16(a); M21-1, Part VIII, Subpart iv, 3.A.2.b and 2.c.
// (M21-1 Part IV, Subpart ii, 2.F is retired — "Historical" — and has no
// content topics. Do not cite it.)
//
// The Census Bureau publishes finalized thresholds ~one year after the data
// year (e.g., 2024 thresholds published September 2025). When a new threshold
// is published, VBA updates M21-1 — at that point we update this map.
//
// Storing the year-by-year history (not just the current value) lets us
// correctly evaluate retrospective claims — e.g., "was the veteran's 2022
// employment marginal?" requires the 2022 threshold, not the current one.
export const POVERTY_THRESHOLDS = {
  // Source: U.S. Census Bureau, Poverty Thresholds, Table 1,
  // "One person (unrelated individual)" line. Verified 2023/2024/2025 against
  // the published worksheets.
  2019: 13011,
  2020: 13171,
  2021: 13788,
  2022: 14880,
  2023: 15480,
  2024: 15940,
  2025: 16330,
  // Next: 2026 thresholds, expected from Census around September 2027.
  // When published, add the year here, add its "Under 65 years / no related
  // children" figure to POVERTY_THRESHOLD_ALTERNATES below, and bump
  // CURRENT_POVERTY_THRESHOLD_YEAR.
};

// The "Under 65 years" figure — the HIGHEST of the three one-person Census
// lines, and therefore the practical SAFE HARBOR.
//
// The Census table gives three figures for a single person: over 65, under 65,
// and the weighted average. Practitioners quote the under-65 line not because
// it's the operative threshold but because it's the ceiling — a Veteran under
// it qualifies regardless of which line their actual circumstances point to.
// That is general advice given safely, not a different reading of §4.16(a).
//
// This is why sources appear to conflict and don't really:
//   • 38 CFR 4.16(a) and M21-1 VIII.iv.3.A.2.c say "the poverty threshold for
//     one person" and name no line.
//   • VA's Federal Register notices cite the weighted average for one person
//     (unrelated individual) — POVERTY_THRESHOLDS above.
//   • Practitioners quote the under-65 ceiling, because anyone under it is
//     safe without needing a case-specific analysis.
//
// The app uses the weighted average as the threshold and this as the safe
// harbor, and tells the Veteran where they sit relative to both.
export const POVERTY_THRESHOLD_SAFE_HARBOR = {
  2024: 16320,
  2025: 16749,
};

// Kept for backward compatibility with existing imports.
export const POVERTY_THRESHOLD_ALTERNATES = POVERTY_THRESHOLD_SAFE_HARBOR;

// How far above the safe harbor still lands in "VA could reasonably resolve
// this in your favor" territory under 38 CFR 3.102.
//
// ⚠️ THIS IS AN ESTIMATE, NOT A PUBLISHED FIGURE.
//
// A VA claims adjudicator described the practice: a few hundred dollars over
// can be justified away in the decision narrative using utilities, groceries,
// local cost of living against the national average, medications, and ongoing
// supplies. "Hundreds. Yes. Now, a few thousand, no."
//
// Asked for a figure she confirmed: "300-500. Basically the weighted average
// amount difference between one or the other, not the full difference between
// the over 65 and under 65." So the margin is a few hundred dollars, NOT the
// ~$1,300 spread between the highest and lowest one-person Census figures.
//
// $500 is the top of her range. Direction of error matters: too narrow points
// a Veteran toward the facts-found prong, which is sound advice regardless.
// Too wide tells someone a gap is workable when their rater disagrees.
//
// $500 is the ONLY place to change this.
//
// Nothing here adjusts the threshold itself. §4.16(a) uses the one-person
// figure regardless of household size, age, or geography. Those factors belong
// in a reasonable-doubt narrative, which is a matter of evidence rather than
// arithmetic — which is exactly why the app prompts for documentation instead
// of computing an adjusted number.
export const REASONABLE_DOUBT_MARGIN = 500;

/**
 * Expense categories that support a 38 CFR 3.102 reasonable-doubt narrative
 * when earned income sits modestly above the poverty threshold.
 *
 * A rater cannot write "the $400 overage is inconsequential" out of thin air.
 * They need something in the record. A Veteran who documents these hands them
 * the material; a Veteran who documents nothing gives them no basis at all.
 *
 * Sourced from a VA claims adjudicator describing her own practice. This is
 * DISCRETIONARY — another rater may not do it. Copy built on this list must
 * say "this is what gives VA a basis," never "this will work."
 */
export const REASONABLE_DOUBT_EXPENSE_CATEGORIES = [
  {
    id: 'medical-costs',
    label: 'Unreimbursed medical and medication costs',
    note: 'Out-of-pocket amounts not covered by VA or insurance.',
  },
  {
    id: 'ongoing-supplies',
    label: 'Ongoing supplies',
    note: 'Incontinence supplies, wound care, mobility equipment, and similar recurring costs tied to service-connected conditions.',
  },
  {
    id: 'utilities',
    label: 'Utilities',
    note: 'Particularly where a service-connected condition drives usage, such as climate control for temperature intolerance.',
  },
  {
    id: 'groceries',
    label: 'Groceries and required diet costs',
    note: 'Including any medically necessary diet that costs more than an ordinary one.',
  },
  {
    id: 'cost-of-living',
    label: 'Local cost of living vs. the national average',
    note: 'Census poverty thresholds are national and are NOT adjusted for geography. A Veteran in a high-cost area is measured against the same figure as one in a low-cost area. This is easiest to establish where local costs diverge sharply from the national average — Hawaii, California, Washington DC, New York City — but it also applies within a state, such as Austin or Houston compared to Waco. Regional price data from the Bureau of Economic Analysis or a local cost-of-living index supports the point.',
  },
];

/**
 * How a Veteran actually gets a reasonable-doubt argument in front of a rater.
 *
 * This is the part most Veterans don't know: they don't have to wait and hope
 * the rater constructs this themselves. Per a VA adjudicator — "a veteran can
 * write in their statements anything they feel is relevant to their claim,
 * extenuating circumstances and ask for decision makers to carefully consider
 * resolving any doubt in the Veteran's favor."
 *
 * A rater cannot write "the $400 overage is inconsequential" out of nothing.
 * They need something in the record. A personal statement IS something in the
 * record, and it costs the Veteran nothing but the writing.
 */
export const REASONABLE_DOUBT_STATEMENT_GUIDANCE = {
  citation: '38 CFR §3.102; 38 CFR §4.23',
  points: [
    'You can submit a personal statement with your claim describing circumstances you believe are relevant. You do not need a representative to do this for you.',
    'State the specific amount your earned income exceeds the poverty threshold, and why that amount does not reflect your actual financial position.',
    'Describe the recurring costs above — medical, supplies, utilities, groceries — with real figures wherever you have them.',
    'If you live somewhere more expensive than the national average, say so. The Census threshold is a national figure and is not adjusted for where you live.',
    'Ask directly that any reasonable doubt be resolved in your favor under 38 CFR §3.102.',
    'Keep it factual. Receipts, statements, and pharmacy printouts carry more weight than estimates.',
  ],
  // 4.23 is worth naming because most Veterans have never heard of it and it
  // answers the unspoken question: will a rater actually bother?
  raterStandardNote:
      'Under 38 CFR §4.23, VA rating personnel are held to a standard of conduct requiring fair and impartial treatment of claimants. Asking for reasonable doubt to be applied is a normal part of the process, not an imposition.',
};

// M21-1, Part VIII, Subpart iv, 3.A.2.c: amounts received from participation in
// the Veterans Health Administration's Compensated Work Therapy Program are NOT
// counted as income for IU purposes. Surface this wherever income is entered —
// a Veteran in CWT who includes that money will read as over the threshold when
// VA would not count it.
export const CWT_INCOME_EXCLUDED = true;

// The most recent FINAL Census Bureau threshold. Update this constant whenever
// a new year is added to POVERTY_THRESHOLDS above.
export const CURRENT_POVERTY_THRESHOLD_YEAR = 2025;
export const CURRENT_POVERTY_THRESHOLD = POVERTY_THRESHOLDS[CURRENT_POVERTY_THRESHOLD_YEAR];
// The under-65 figure for the same year. Not what VA's notices cite, but widely
// quoted, so the UI shows both rather than leaving a Veteran to wonder why the
// app disagrees with something they read elsewhere.
export const CURRENT_POVERTY_THRESHOLD_ALTERNATE =
    POVERTY_THRESHOLD_ALTERNATES[CURRENT_POVERTY_THRESHOLD_YEAR] ?? null;

/**
 * Look up the Census Bureau poverty threshold for a given calendar year.
 * Falls back to the most recent threshold if the requested year is not yet
 * published. Years before 2019 fall back to the earliest stored year.
 *
 * @param {number} year - Calendar year (e.g., 2023)
 * @returns {{ value: number, year: number, isFallback: boolean }}
 */
export const getPovertyThreshold = (year) => {
  // `value`      — the weighted-average one-person threshold VA's notices cite
  // `safeHarbor` — the highest one-person figure (under 65); under it, a
  //                Veteran qualifies regardless of circumstances
  // `alternate`  — same as safeHarbor, kept for existing callers
  const build = (y, isFallback) => {
    const safeHarbor = POVERTY_THRESHOLD_SAFE_HARBOR[y] ?? null;
    return {
      value: POVERTY_THRESHOLDS[y],
      year: y,
      isFallback,
      safeHarbor,
      alternate: safeHarbor,
    };
  };

  if (POVERTY_THRESHOLDS[year] !== undefined) {
    return build(year, false);
  }

  // Year not in our map — fall back to closest available
  // Numeric sort — Array.prototype.sort() without a comparator sorts
  // lexicographically, which breaks the moment a year crosses a digit boundary.
  const availableYears = Object.keys(POVERTY_THRESHOLDS).map(Number).sort((a, b) => a - b);
  if (!availableYears.length) {
    return { value: 0, year: 0, isFallback: true, safeHarbor: null, alternate: null };
  }

  // Future year (not yet published) → use most recent.
  // Census publishes a year's threshold roughly 9 months after that year ends,
  // so the current calendar year always lands here.
  if (year > availableYears[availableYears.length - 1]) {
    return build(availableYears[availableYears.length - 1], true);
  }

  // Past year before our records → use earliest
  return build(availableYears[0], true);
};

/**
 * Check whether the stored poverty threshold map is stale relative to the
 * current calendar year. The U.S. Census Bureau typically publishes the
 * prior year's official poverty thresholds in September.
 *
 * Returned `level`:
 *   - 'current'  : Gap between current year and CURRENT_POVERTY_THRESHOLD_YEAR
 *                  is ≤2 (e.g., in 2026 with 2024 threshold = current).
 *   - 'warning'  : Gap is exactly 2 AND we're past September of the current
 *                  year, so a new threshold should have been published by now.
 *   - 'critical' : Gap is ≥3 — threshold is more than a full publication
 *                  cycle behind and should be updated.
 *
 * @param {Date} [referenceDate=new Date()] - The "now" for the check; pass
 *   a fixed date in tests for deterministic results.
 * @returns {{
 *   level: 'current' | 'warning' | 'critical',
 *   storedYear: number,
 *   currentYear: number,
 *   yearsBehind: number,
 *   isPastSeptember: boolean,
 *   message: string,
 * }}
 */
export const checkThresholdStaleness = (referenceDate = new Date()) => {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-12
  const yearsBehind = currentYear - CURRENT_POVERTY_THRESHOLD_YEAR;
  const isPastSeptember = currentMonth >= 9;

  let level = 'current';
  let message = '';

  if (yearsBehind >= 3) {
    level = 'critical';
    message = `The stored Census Bureau poverty threshold is from ${CURRENT_POVERTY_THRESHOLD_YEAR} (${yearsBehind} years behind). A new threshold should be published — verify and update.`;
  } else if (yearsBehind === 2 && isPastSeptember) {
    level = 'warning';
    message = `The Census Bureau typically publishes new poverty thresholds in September. The stored threshold is from ${CURRENT_POVERTY_THRESHOLD_YEAR}; a ${currentYear - 1} figure may now be available.`;
  } else {
    message = `Threshold is current (stored: ${CURRENT_POVERTY_THRESHOLD_YEAR}; ${yearsBehind} year${yearsBehind === 1 ? '' : 's'} behind).`;
  }

  return {
    level,
    storedYear: CURRENT_POVERTY_THRESHOLD_YEAR,
    currentYear,
    yearsBehind,
    isPastSeptember,
    message,
  };
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
      thresholdAlternate: threshold.alternate,
      lastEmployedDate: employmentStatus.lastEmployedDate || '',
      // M21-1 VIII.iv.3.A.2.d: §4.16(a) does not limit marginal employment to
      // Veterans who are currently employed. If the evidence shows a Veteran is
      // capable only of marginal employment, that supports IU even with no job
      // at all, and the rating decision must address it. Veterans routinely
      // assume the opposite.
      appliesWhenUnemployed: true,
      citation: '38 CFR §4.16(a); M21-1 VIII.iv.3.A.2.d',
      caseLawAnchors: ['ortiz-valles'],
    };
  }

  // ============================================
  // STATE: Employed — evaluate income vs threshold
  // ============================================
  const annualIncome = Number(employmentStatus.annualIncome) || 0;

  // §4.16(a): marginal when income "does not exceed" the threshold, so
  // income == threshold is still marginal.
  const overThreshold = annualIncome > threshold.value;

  // Four bands, not two. Where a Veteran sits relative to BOTH the weighted
  // average and the safe harbor changes what's useful to tell them:
  //
  //   ≤ weighted average          satisfies the income test under any reading
  //   ≤ safe harbor               under every one-person figure; should qualify
  //                               regardless of age or household composition
  //   ≤ safe harbor + margin      over, but by an amount VA can resolve in the
  //                               Veteran's favor under 3.102 — documentable
  //   beyond that                 income test alone won't carry it; the
  //                               facts-found prong is the better route
  const safeHarbor = threshold.safeHarbor;
  const overSafeHarbor = safeHarbor !== null
      ? annualIncome > safeHarbor
      : overThreshold;

  const amountOverSafeHarbor = overSafeHarbor && safeHarbor !== null
      ? annualIncome - safeHarbor
      : 0;

  const withinReasonableDoubt =
      overSafeHarbor && safeHarbor !== null &&
      amountOverSafeHarbor <= REASONABLE_DOUBT_MARGIN;

  // Kept for existing callers written against the old two-state shape
  const definitelyOverThreshold = overSafeHarbor;
  const inContestedBand = overThreshold && !overSafeHarbor;

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

  // FOUR states. Every consumer that switches on `state` needs a case for
  // 'below-safe-harbor' and 'within-reasonable-doubt' or they fall through to
  // a default branch and render something wrong.
  let state;
  if (!overThreshold) {
    state = 'below-threshold';
  } else if (!overSafeHarbor) {
    state = 'below-safe-harbor';
  } else if (withinReasonableDoubt) {
    state = 'within-reasonable-doubt';
  } else {
    state = 'above-threshold';
  }

  return {
    state,
    annualIncome,
    threshold: threshold.value,
    thresholdYear: threshold.year,
    thresholdIsFallback: threshold.isFallback,
    thresholdSafeHarbor: safeHarbor,
    thresholdAlternate: safeHarbor, // legacy alias
    overThreshold,
    overSafeHarbor,
    amountOverSafeHarbor,
    withinReasonableDoubt,
    reasonableDoubtMargin: REASONABLE_DOUBT_MARGIN,
    definitelyOverThreshold, // legacy alias
    inContestedBand,         // legacy alias
    monthsOverThreshold,
    // Flag the ~12-month review window
    nearReviewWindow: monthsOverThreshold !== null && monthsOverThreshold >= 9,
    pastReviewWindow: monthsOverThreshold !== null && monthsOverThreshold >= 12,
    // 3.102 matters here as much as 4.16 — it's what lets a rater resolve a
    // modest overage in the Veteran's favor. 4.23 is the rater conduct
    // standard that makes asking for it a normal request rather than a favor.
    citation: withinReasonableDoubt
        ? '38 CFR §4.16(a); 38 CFR §3.102; 38 CFR §4.23'
        : overSafeHarbor
            ? '38 CFR §4.16(a); 38 CFR §3.102'
            : '38 CFR §4.16(a)',
  };
};

// =============================================================================
// PROTECTED ENVIRONMENT ANALYSIS
// =============================================================================
// Protected/sheltered employment under §4.16(a) is a facts-found determination.
// There is no bright-line rule (Cantrell v. Shulkin, 28 Vet.App. 382 (2017);
// Labruzza and McBride v. McDonough, 37 Vet.App. 111 (2024)), so this analysis
// can only FLAG indicators — it cannot render a determination.
//
// M21-1 VIII.iv.3.A.2.e: "Consideration of employment in a protected environment
// is only triggered when a Veteran's income exceeds the poverty level." The
// analysis below still runs regardless, because a Veteran documenting
// accommodations before their income rises is doing the right thing. But the
// result carries `triggeredByIncome` so the UI can frame it correctly rather
// than implying a below-threshold Veteran needs this pathway.
//
// Also from 2.e: income in a protected environment must, while exceeding the
// threshold, remain "relatively low" — §4.16(a) makes earned income the primary
// standard. A Veteran earning well above the threshold should not expect this
// pathway to carry a claim on accommodations alone.

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
export const analyzeProtectedEnvironment = (employmentStatus, options = {}) => {
  // Pass the marginal-employment analysis in to set this. Undefined means
  // "income unknown", and the UI should stay neutral rather than asserting
  // either way.
  const triggeredByIncome = options.overThreshold;
  // ============================================
  // STATE: No employment data
  // ============================================
  if (!employmentStatus) {
    return {
      state: 'no-data',
      citation: '38 CFR §4.16(a)',
      triggeredByIncome,
      caseLawAnchors: ['cantrell', 'labruzza-mcbride', 'faust'],
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