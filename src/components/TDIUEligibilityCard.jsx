import React from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  getServiceConnectedConditions,
  getTDIUStatus,
} from '../utils/profiles';
import {
  analyzeTDIUEligibility,
  CURRENT_POVERTY_THRESHOLD,
  CURRENT_POVERTY_THRESHOLD_YEAR,
  CURRENT_POVERTY_THRESHOLD_ALTERNATE,
  checkThresholdStaleness,
} from '../utils/tdiuEligibility';

/**
 * TDIUEligibilityCard
 * Displays a state-specific TDIU analysis below the TDIUStatusCard.
 *
 * Four possible states:
 *   1. 'granted'                  — TDIU already granted; show maintenance/protection content
 *   2. 'eligible-schedular'       — Ratings meet §4.16(a); flag the eligibility
 *   3. 'not-eligible-schedular'   — Ratings don't meet schedular; surface §4.16(b) awareness
 *   4. 'no-conditions'            — No SC conditions yet; show onboarding prompt
 *
 * NEVER renders a determination. Only flags for VSO discussion.
 */
const TDIUEligibilityCard = () => {
  const { profile } = useProfile();

  // Only render for veteran profiles
  if (!profile || !profile.id || profile.type !== 'veteran') {
    return null;
  }

  const conditions = getServiceConnectedConditions(profile.id);
  const tdiuStatus = getTDIUStatus(profile.id);
  const analysis = analyzeTDIUEligibility(conditions, tdiuStatus);

  // ============================================
  // STATE 1: TDIU GRANTED — Maintenance & protection content
  // ============================================
  if (analysis.state === 'granted') {
    return (
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg border-2 border-teal-200 dark:border-teal-700 p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Maintaining Your TDIU Rating
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Key facts about keeping the rating you've been granted
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
              <span>
              <strong className="text-gray-900 dark:text-white">Reduction protection:</strong>{' '}
                TDIU may be reduced if VA finds you have resumed substantially
                gainful employment. See 38 CFR §3.343 for the rules around
                return-to-work and TDIU continuation.
            </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
              <span>
              <strong className="text-gray-900 dark:text-white">Marginal employment is allowed:</strong>{' '}
                Earnings at or below the U.S. Census Bureau poverty threshold for one
                person (${CURRENT_POVERTY_THRESHOLD.toLocaleString()}/year, {CURRENT_POVERTY_THRESHOLD_YEAR} Census
                thresholds) don't count as substantially gainful. This is <strong>earned income only</strong> —
                VA compensation, SSDI, retirement, and investment income don't count, and neither
                does VHA Compensated Work Therapy pay. The figure does not increase with dependents.
                VA uses the Census threshold, not the HHS Poverty Guideline — different agencies,
                different numbers.
                {CURRENT_POVERTY_THRESHOLD_ALTERNATE && (
                    <span className="block mt-2 pl-3 border-l-2 border-gray-400/30 text-xs text-gray-600 dark:text-gray-400">
                      You may see ${CURRENT_POVERTY_THRESHOLD_ALTERNATE.toLocaleString()} quoted elsewhere.
                      The Census table lists three one-person figures — over 65, under 65, and a
                      weighted average. ${CURRENT_POVERTY_THRESHOLD_ALTERNATE.toLocaleString()} is the
                      highest, which is why it gets quoted as a safe harbor: under it, you should
                      qualify whichever figure applies to your circumstances.
                    </span>
                )}
                <span className="block mt-2 pl-3 border-l-2 border-teal-500/40 text-xs text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-700 dark:text-gray-300">Over by a few hundred dollars?</strong>{' '}
                  That gap can be resolved in your favor under 38 CFR §3.102 if the record supports
                  it — unreimbursed medical costs, ongoing supplies, or a local cost of living well
                  above the national average. Cost of living is easiest to show in places like
                  Hawaii, California, DC, or New York City, but it applies within a state too, like
                  Austin or Houston compared to Waco.
                  <span className="block mt-1">
                    You can raise this yourself in a personal statement. A rater can argue this
                    either way, so what's in the record decides which argument is easier to write.
                  </span>
                </span>
                <span className="block mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Reference: M21-1, Part VIII, Subpart iv, 3.A.2.c; 38 CFR §3.102.
                </span>
                {(() => {
                  const staleness = checkThresholdStaleness();
                  if (staleness.level === 'current') return null;
                  return (
                      <span className="block mt-1 text-xs italic text-amber-700 dark:text-amber-400">
                        ⓘ The Census Bureau publishes updated thresholds annually (typically September).
                        Verify the current figure at{' '}
                      <a
                        href="https://www.census.gov/topics/income-poverty/poverty/data/tables.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                          census.gov
                        </a>
                  {' '}before filing.
                </span>
                );
                })()}
            </span>
            </li>
              <li className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
                  <span>
              <strong className="text-gray-900 dark:text-white">You don't have to be employed for this to matter:</strong>{' '}
                      If the evidence shows you're capable only of marginal employment, that supports
                IU even with no job at all, and a rating decision must address it
                (M21-1 VIII.iv.3.A.2.d; Ortiz-Valles v. McDonald, 28 Vet.App. 65 (2016)).
            </span>
              </li>
            <li className="flex gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
              <span>
              <strong className="text-gray-900 dark:text-white">Earning over the threshold isn't automatically disqualifying:</strong>{' '}
                §4.16(a) recognizes a second, <strong>independent</strong> pathway. Employment in a
                protected environment — a family business, a sheltered workshop, or a job with
                accommodations you wouldn't get in the open market — may not count as substantially
                gainful even when earnings exceed the threshold. Failing the income test does not
                close this route. <em>Cantrell v. Shulkin</em>, 28 Vet. App. 382 (2017), requires VA
                to explain its reasoning on protected-environment determinations, so strong evidence
                — employer letter, accommodations documentation, attendance records — is essential.
                See M21-1, Part VIII, Subpart iv, 3.A.2.e.
            </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
              <span>
              <strong className="text-gray-900 dark:text-white">20-year protection:</strong>{' '}
                After 20 years of TDIU, the rating becomes protected from
                severance under 38 CFR §3.951 except in cases of fraud.
            </span>
            </li>
            {!analysis.permanentAndTotal && (
                <li className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0">•</span>
                  <span>
              <strong className="text-gray-900 dark:text-white">Re-evaluation:</strong>{' '}
                    Your TDIU is not marked Permanent & Total in this app, so
                    VA may schedule a periodic future exam. Continue documenting
                    symptoms to support continuation.
            </span>
                </li>
            )}
          </ul>

          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-emerald-900 dark:text-emerald-200">
              🛡️ <strong>Working while on TDIU?</strong> The{' '}
              <strong>Protected Work Environment Tracker</strong> in C&P Resources
              helps you document accommodations, track evidence gaps, and generate
              an employer letter aligned with <em>Cantrell v. Shulkin</em>.
            </p>
          </div>

          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 Talk to your VSO before any major employment changes. The
              rules around resuming work and TDIU continuation are nuanced.
              This card highlights key concepts, not legal advice.
            </p>
          </div>
        </div>
    );
  }

  // ============================================
  // STATE 4: NO CONDITIONS YET — Onboarding prompt
  // ============================================
  if (analysis.state === 'no-conditions') {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧮</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                TDIU Eligibility Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add your service-connected conditions above to see whether your
                ratings meet the schedular requirements for TDIU under 38 CFR
                §4.16(a). The eligibility analysis updates automatically.
              </p>
            </div>
          </div>
        </div>
    );
  }

  // ============================================
  // STATE 2: ELIGIBLE — Ratings meet §4.16(a) thresholds
  // ============================================
  if (analysis.state === 'eligible-schedular') {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your ratings may meet schedular TDIU criteria
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on §4.16(a) rating thresholds — does NOT determine eligibility
              </p>
            </div>
          </div>

          {/* Eligibility math summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Combined rating</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
              {analysis.combinedRating}%
            </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pathway</span>
              <span className="font-medium text-gray-900 dark:text-white">
              {analysis.pathway === 'single-condition'
                  ? 'Single condition ≥ 60%'
                  : 'Combined ≥ 70%, with rating ≥ 40%'}
            </span>
            </div>
          </div>

          {/* Qualifying conditions */}
          {analysis.qualifyingConditions && analysis.qualifyingConditions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Qualifying condition{analysis.qualifyingConditions.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-1">
                  {analysis.qualifyingConditions.map((c, idx) => (
                      <div
                          key={idx}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-900 dark:text-white">{c.conditionName}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                    {c.currentRating}%
                  </span>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* What this means */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              What this means:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Eligibility for TDIU also depends on whether your service-connected
              disabilities prevent you from <em>substantially gainful employment</em>.
              The rating math is one factor; the employment-impact analysis is the
              other. A VSO can evaluate the full picture.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-900 dark:text-yellow-200">
              📌 <strong>Next step:</strong> Discuss with a Veterans Service Officer (VSO)
              before filing. You can find an accredited representative at{' '}
              <span className="underline">va.gov/vso</span>.
            </p>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
            Note: This check applies the basic §4.16(a) thresholds. Edge cases
            like body-system combination, common etiology, and bilateral factor
            are not computed and may affect the analysis. A VSO can address these.
          </p>
        </div>
    );
  }

  // ============================================
  // STATE 3: NOT ELIGIBLE — Schedular thresholds not met
  // ============================================
  if (analysis.state === 'not-eligible-schedular') {
    const { combinedRating, highestSingleRating, shortfall } = analysis;

    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-700 p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedular TDIU thresholds not currently met
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                But extra-schedular TDIU under §4.16(b) may still apply
              </p>
            </div>
          </div>

          {/* Current standing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Combined rating</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
              {combinedRating}%
                {shortfall.needsCombinedAt70 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                  (need 70%+)
                </span>
                )}
            </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Highest single rating</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
              {highestSingleRating}%
                {shortfall.needsSingleAt60 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                  (need 60%+ for single-condition pathway)
                </span>
                )}
            </span>
            </div>
            {shortfall.needsCombinedAt70 === false && shortfall.hasAt40 === false && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic pt-1 border-t border-gray-200 dark:border-gray-700">
                  Note: Combined rating meets the 70% threshold, but the
                  multi-condition pathway also requires at least one individual
                  rating ≥ 40%.
                </div>
            )}
          </div>

          {/* Extra-schedular pathway */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Extra-schedular TDIU (§4.16(b)):
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              When schedular thresholds aren't met, the Director of Compensation
              Service can still grant TDIU if the veteran's service-connected
              disabilities prevent <em>substantially gainful employment</em>. This
              pathway is reviewed individually and is more documentation-heavy
              than the schedular pathway.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-900 dark:text-yellow-200">
              📌 <strong>Next step:</strong> A VSO can evaluate whether
              extra-schedular TDIU is realistic for your situation, and what
              evidence would strengthen the claim. Find one at{' '}
              <span className="underline">va.gov/vso</span>.
            </p>
          </div>
        </div>
    );
  }

  // Defensive fallback
  return null;
};

export default TDIUEligibilityCard;