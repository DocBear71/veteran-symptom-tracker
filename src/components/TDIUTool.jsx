import React from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  getServiceConnectedConditions,
  getTDIUStatus,
} from '../utils/profiles';
import { analyzeTDIUEligibility } from '../utils/tdiuEligibility';
import { calculateCombinedRating } from '../utils/vaRatingCalculator';

/**
 * TDIUTool — Comprehensive TDIU eligibility analysis and education.
 *
 * Lives as the 7th card on the C&P Resources hub (CPResources.jsx).
 * Embedded via the same pattern as RatingScenarioCalculator, CPExamPrep, etc.
 *
 * Phase 2 deliverable. Three layers:
 *
 * 1. Live analysis of the user's TDIU situation (reads serviceConnectedConditions
 *    + tdiuStatus, runs analyzeTDIUEligibility, displays state-specific summary)
 *
 * 2. Comprehensive educational content (collapsible sections):
 *    - What is TDIU?
 *    - Schedular vs Employability — the core distinction
 *    - Substantially gainful employment defined
 *    - Marginal employment categories
 *    - §4.16(a) vs §4.16(b) pathways
 *    - When TDIU might apply to you
 *    - What you'll need to file
 *
 * 3. Footer: regulation citations, federal poverty threshold reference,
 *    consistent VSO referral
 *
 * NEVER renders a determination. Every state points to a VSO. The educational
 * content is regulation-grounded with explicit CFR/USC citations.
 *
 * Phase 3 (future) will add the VA Form 21-8940 worksheet form below the
 * educational sections. Phase 4 will add PDF export. Both are intentionally
 * out of scope for Phase 2.
 */

// Federal poverty threshold for a single individual.
// Current as of 2026; HHS publishes updates annually.
// https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
const POVERTY_THRESHOLD_ANNUAL_2026 = 15650;
const POVERTY_THRESHOLD_MONTHLY_2026 = Math.round(POVERTY_THRESHOLD_ANNUAL_2026 / 12);

const TDIUTool = ({ embedded = false, onClose }) => {
  const { profile } = useProfile();

  // Only render for veteran profiles (CPResources may not enforce this)
  if (!profile || profile.type !== 'veteran') {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            The TDIU Tool is only available for Veteran profiles.
          </p>
          {onClose && (
              <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Back
              </button>
          )}
        </div>
    );
  }

  const conditions = getServiceConnectedConditions(profile.id);
  const tdiuStatus = getTDIUStatus(profile.id);
  const analysis = analyzeTDIUEligibility(conditions, tdiuStatus);
  const combinedRating = calculateCombinedRating(
      conditions.map(c => c.currentRating)
  );

  return (
      <div className="space-y-6">
        {/* Header with optional back button */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 TDIU Eligibility & Documentation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Disability based on Individual Unemployability — 38 CFR §4.16
            </p>
          </div>
          {embedded && onClose && (
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
          )}
        </div>

        {/* ============================================ */}
        {/* SECTION 1: YOUR CURRENT SITUATION             */}
        {/* ============================================ */}
        <YourSituationCard
            analysis={analysis}
            combinedRating={combinedRating}
            tdiuStatus={tdiuStatus}
            hasConditions={conditions.length > 0}
        />

        {/* ============================================ */}
        {/* SECTION 2: EDUCATIONAL CONTENT (collapsible)  */}
        {/* ============================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              📚 Understanding TDIU
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Key concepts every veteran considering TDIU should understand
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <WhatIsTDIU />
            <SchedularVsEmployability />
            <SubstantiallyGainfulEmployment />
            <MarginalEmployment />
            <PathwayAvsB />
            <WhenTDIUMightApply />
            <WhatYoullNeedToFile />
          </div>
        </div>

        {/* ============================================ */}
        {/* SECTION 3: VSO REFERRAL                       */}
        {/* ============================================ */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-5">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <span>📌</span> Always Work With a VSO
          </h3>
          <p className="text-sm text-yellow-900 dark:text-yellow-200 mb-3">
            This tool helps you organize information. <strong>It does not determine
            eligibility.</strong> The rating math is one factor; the employment-impact
            analysis (which this app does not compute) is the other. Both factors
            require professional evaluation.
          </p>
          <p className="text-sm text-yellow-900 dark:text-yellow-200 mb-3">
            A Veterans Service Officer (VSO) — accredited representative — can:
          </p>
          <ul className="text-sm text-yellow-900 dark:text-yellow-200 space-y-1 ml-5 list-disc mb-3">
            <li>Evaluate the full eligibility picture, including employment factors</li>
            <li>Address §4.16(a) edge cases (body system combination, common etiology, bilateral factor)</li>
            <li>Help you complete VA Form 21-8940 correctly</li>
            <li>Coordinate buddy statements and employer verification (Form 21-4192)</li>
            <li>Represent you throughout the claim process at no cost to you</li>
          </ul>
          <p className="text-sm text-yellow-900 dark:text-yellow-200">
            Find an accredited representative at{' '}
          <a
            href="https://www.va.gov/vso/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
            >
            va.gov/vso
          </a>
          .
        </p>
      </div>

  {/* ============================================ */}
  {/* SECTION 4: REGULATORY FOOTER                  */}
  {/* ============================================ */}
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
      Regulatory References:
    </p>
    <p>• 38 CFR §4.16 — Total Disability based on Individual Unemployability</p>
    <p>• 38 CFR §4.16(a) — Schedular requirements</p>
    <p>• 38 CFR §4.16(b) — Extra-schedular consideration</p>
    <p>• 38 CFR §3.343 — Continuance of total disability ratings</p>
    <p>• 38 CFR §3.951 — Preservation of disability ratings (20-year protection)</p>
    <p>• VA Form 21-8940 — Veteran's Application for Increased Compensation Based on Unemployability</p>
    <p>• VA Form 21-4192 — Request for Employment Information from Recent Employers</p>
    <p className="italic mt-2">
      Federal poverty threshold of ${POVERTY_THRESHOLD_ANNUAL_2026.toLocaleString()}/year
      is current as of 2026. Verify the latest figure at HHS.gov before filing.
    </p>
    <p className="italic">
      Phase 2 deliverable. Phase 3 will add the VA Form 21-8940 worksheet.
    </p>
  </div>
</div>
);
};

// ============================================================================
// YOUR CURRENT SITUATION CARD — Live state-branching summary
// ============================================================================

const YourSituationCard = ({ analysis, combinedRating, tdiuStatus, hasConditions }) => {
  // ---- State: TDIU granted ----
  if (analysis.state === 'granted') {
    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-700 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">✓</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                You have TDIU granted
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Granted under {analysis.tdiuType === 'schedular' ? '§4.16(a) Schedular' : '§4.16(b) Extra-Schedular'}
                {analysis.permanentAndTotal && ' · Permanent & Total'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            You're paid at the 100% rate. Your schedular combined rating is{' '}
            <strong className="text-gray-900 dark:text-white">{combinedRating}%</strong>.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            The educational sections below cover key concepts for{' '}
            <strong className="text-gray-900 dark:text-white">maintaining your TDIU rating</strong> —
            return-to-work rules, marginal employment, reduction protection, and 20-year severance protection.
          </p>
        </div>
    );
  }

  // ---- State: No conditions yet ----
  if (analysis.state === 'no-conditions') {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-5">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Add your service-connected conditions to see your analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Go to <strong>Settings → My Service-Connected Conditions</strong> to
                record your VA-assigned ratings. The analysis here updates automatically
                as conditions are added.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                The educational sections below are still useful even before you've
                added your ratings.
              </p>
            </div>
          </div>
        </div>
    );
  }

  // ---- State: Eligible-schedular ----
  if (analysis.state === 'eligible-schedular') {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your ratings may meet schedular TDIU criteria
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on §4.16(a) thresholds — does NOT determine eligibility
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 space-y-2 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Combined rating</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{combinedRating}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pathway met</span>
              <span className="font-medium text-gray-900 dark:text-white text-right">
              {analysis.pathway === 'single-condition'
                  ? 'Single condition ≥ 60%'
                  : 'Combined ≥ 70% with rating ≥ 40%'}
            </span>
            </div>
          </div>

          {analysis.qualifyingConditions?.length > 0 && (
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
                        <span className="font-bold text-blue-600 dark:text-blue-400">{c.currentRating}%</span>
                      </div>
                  ))}
                </div>
              </div>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300">
            The educational sections below cover the <strong>employment-impact side</strong>{' '}
            of TDIU — what "substantially gainful employment" means, what marginal
            employment is, and what evidence supports a TDIU claim.
          </p>
        </div>
    );
  }

  // ---- State: Not eligible-schedular ----
  if (analysis.state === 'not-eligible-schedular') {
    const { highestSingleRating, shortfall } = analysis;
    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-700 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">ℹ️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedular TDIU thresholds not currently met
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                But extra-schedular TDIU under §4.16(b) may still apply
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 space-y-2 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Highest single rating</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
              {highestSingleRating}%
                {shortfall.needsSingleAt60 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">
                  (need 60%+)
                </span>
                )}
            </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            The educational sections below cover the <strong>extra-schedular pathway</strong> —
            when the Director of Compensation Service can grant TDIU even when
            schedular thresholds aren't met, and what evidence strengthens such a claim.
          </p>
        </div>
    );
  }

  return null;
};

// ============================================================================
// EDUCATIONAL SECTIONS — Collapsible <details> for clean mobile display
// ============================================================================

const Section = ({ title, summary, children }) => (
    <details className="group">
      <summary className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none">
        <div className="flex-1 pr-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          {summary && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{summary}</p>
          )}
        </div>
        <span className="text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-5 pb-5 text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
        {children}
      </div>
    </details>
);

const WhatIsTDIU = () => (
    <Section
        title="What is TDIU?"
        summary="The basic concept and what TDIU does for a veteran's compensation"
    >
      <p>
        <strong>TDIU</strong> stands for <strong>Total Disability based on Individual
        Unemployability</strong>. It's a status — granted under 38 CFR §4.16 — that allows
        a veteran with a less-than-100% schedular rating to be paid at the 100% compensation
        rate, when their service-connected disabilities prevent them from holding{' '}
        <em>substantially gainful employment</em>.
      </p>
      <p>
        TDIU does not change a veteran's schedular combined rating. A veteran rated 90%
        combined who is granted TDIU still has a 90% schedular rating — they're just paid
        at the 100% rate. The schedular rating remains relevant for re-evaluations,
        secondary claims, and certain ancillary benefits.
      </p>
      <p className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        💡 <strong>The practical effect:</strong> A veteran rated 70% schedular who is
        granted TDIU receives roughly the same monthly payment as a veteran rated 100%
        schedular. As of 2026, that's the difference between approximately $1,750/month
        and approximately $3,800/month — a substantial increase.
      </p>
    </Section>
);

const SchedularVsEmployability = () => (
    <Section
        title="Schedular vs Employability — the core distinction"
        summary="Why two veterans with the same ratings can have different TDIU outcomes"
    >
      <p>
        VA disability ratings are <strong>impairment-based</strong>. A 50% rating for
        Major Depressive Disorder reflects the severity of symptoms — anxiety, sleep
        disruption, motivation deficits, and so on — measured against the rating
        criteria in 38 CFR Part 4.
      </p>
      <p>
        TDIU is <strong>employability-based</strong>. The question isn't "how severe
        are your symptoms?" but "do your service-connected disabilities prevent you
        from holding substantially gainful employment?"
      </p>
      <p>
        These are different questions, and they don't always have the same answer:
      </p>
      <ul className="ml-5 list-disc space-y-1">
        <li>A veteran rated 70% combined may be working full-time — TDIU likely doesn't apply.</li>
        <li>Another veteran rated 70% combined may be unable to hold any job longer than a few months — TDIU may apply.</li>
      </ul>
      <p>
        The schedular thresholds in §4.16(a) are <strong>gateways</strong> to TDIU, not
        guarantees. Meeting them means the rating math allows TDIU consideration. The
        <em> employment-impact analysis</em> is what determines whether TDIU is actually granted.
      </p>
    </Section>
);

const SubstantiallyGainfulEmployment = () => (
    <Section
        title="What is 'substantially gainful employment'?"
        summary="The federal poverty threshold and how VA defines income that disqualifies TDIU"
    >
      <p>
        VA generally defines <strong>substantially gainful employment</strong> as
        employment that produces earnings <em>above the federal poverty threshold</em>
        for a single individual.
      </p>
      <p>
        As of 2026, that threshold is approximately:
      </p>
      <ul className="ml-5 list-disc space-y-1">
        <li>${POVERTY_THRESHOLD_ANNUAL_2026.toLocaleString()} per year</li>
        <li>Approximately ${POVERTY_THRESHOLD_MONTHLY_2026.toLocaleString()} per month</li>
      </ul>
      <p>
        Employment that produces earnings <em>at or below</em> the threshold is
        considered <strong>marginal employment</strong> (covered in the next section)
        and does not disqualify a veteran from TDIU.
      </p>
      <p className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        ⚠️ The poverty threshold is updated annually by the U.S. Department of Health
        and Human Services. Always verify the current figure at{' '}
      <a
        href="https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
        >
        HHS.gov
      </a>
      {' '}before relying on it for filing decisions.
    </p>
</Section>
);

const MarginalEmployment = () => (
    <Section
        title="Marginal employment categories"
        summary="Two ways a veteran can earn income without disqualifying TDIU"
    >
      <p>
        Under VA's interpretation of §4.16, two categories of work are considered
        marginal and do not count as substantially gainful:
      </p>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          1. Earnings below the poverty threshold
        </p>
        <p>
          Employment that produces gross earnings at or below the federal poverty threshold
          for a single individual. For 2026, that's approximately
          ${POVERTY_THRESHOLD_ANNUAL_2026.toLocaleString()}/year.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          2. Sheltered or protected work environments
        </p>
        <p>
          Employment in a <em>protected environment</em> — even when earnings exceed the
          poverty threshold. Examples include:
        </p>
        <ul className="ml-5 list-disc">
          <li>Family-owned business where the veteran is given accommodations not available to other employees</li>
          <li>Sheltered workshop programs designed for individuals with disabilities</li>
          <li>Employment situations where a third party (often a relative) keeps the veteran on payroll despite limited productive output</li>
        </ul>
        <p>
          Documentation of the sheltered nature is essential. VA will look closely at
          whether the work would survive in a competitive employment setting.
        </p>
      </div>

      <p className="text-xs italic text-gray-600 dark:text-gray-400">
        Marginal employment determinations are nuanced. A VSO can evaluate whether a
        specific employment situation qualifies.
      </p>
    </Section>
);

const PathwayAvsB = () => (
    <Section
        title="§4.16(a) vs §4.16(b) — the two pathways"
        summary="Schedular and extra-schedular TDIU"
    >
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
        <p className="font-semibold text-gray-900 dark:text-white">
          §4.16(a) — Schedular TDIU
        </p>
        <p>
          The veteran's ratings meet defined thresholds. Either:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>One single rating ≥ 60%</strong>, OR</li>
          <li><strong>Combined rating ≥ 70% with at least one individual rating ≥ 40%</strong></li>
        </ul>
        <p>
          When schedular thresholds are met, TDIU is decided by the regional office. The
          rating math is satisfied; only the employment-impact question remains.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
        <p className="font-semibold text-gray-900 dark:text-white">
          §4.16(b) — Extra-Schedular TDIU
        </p>
        <p>
          The veteran's ratings <strong>do not</strong> meet §4.16(a) thresholds, but the
          veteran is nonetheless unable to secure or follow substantially gainful
          employment due to service-connected disabilities.
        </p>
        <p>
          Extra-schedular TDIU is referred to the <strong>Director of Compensation Service</strong>
          for individual review. This pathway is more documentation-heavy than the schedular
          pathway and is typically pursued with VSO support.
        </p>
        <p>
          Common scenarios where §4.16(b) might apply:
        </p>
        <ul className="ml-5 list-disc">
          <li>Veterans with severe symptoms whose individual ratings underrepresent the combined functional impact</li>
          <li>Veterans whose conditions cause unusually high lost-time or unscheduled absences</li>
          <li>Veterans whose employment limitations don't fit cleanly into the schedular criteria</li>
        </ul>
      </div>

      <p className="text-xs italic text-gray-600 dark:text-gray-400">
        §4.16(a) is the more common pathway. Most veterans who pursue TDIU meet the
        schedular thresholds first.
      </p>
    </Section>
);

const WhenTDIUMightApply = () => (
    <Section
        title="When TDIU might apply to you"
        summary="Common scenarios where filing makes sense"
    >
      <p>
        TDIU is most often pursued when one or more of the following are true:
      </p>
      <ul className="ml-5 list-disc space-y-2">
        <li>
          <strong>Recent job loss tied to service-connected disabilities.</strong> The veteran
          was let go, asked to leave, or quit due to symptoms that prevent reliable work.
        </li>
        <li>
          <strong>Pattern of short-term jobs.</strong> Multiple jobs in recent years, each
          ended within months due to symptom-related issues — attendance, productivity, conflict
          with supervisors, inability to maintain pace.
        </li>
        <li>
          <strong>Medical advice against working.</strong> A treating physician has
          documented that the veteran's service-connected conditions make employment medically inadvisable.
        </li>
        <li>
          <strong>Substantially reduced work capacity.</strong> The veteran is working but
          earning below the poverty threshold (marginal employment) due to symptom-related limitations.
        </li>
        <li>
          <strong>Sheltered employment situation.</strong> The veteran is working in a family
          business, sheltered workshop, or protected environment that wouldn't replicate in
          a competitive job market.
        </li>
      </ul>
      <p>
        TDIU is <em>not</em> typically pursued when:
      </p>
      <ul className="ml-5 list-disc space-y-1">
        <li>The veteran is working full-time at substantially gainful employment</li>
        <li>The veteran's inability to work is due to non-service-connected conditions</li>
        <li>The veteran has voluntarily withdrawn from the labor force for unrelated reasons (retirement, family choices, etc.)</li>
      </ul>
      <p className="text-xs italic text-gray-600 dark:text-gray-400">
        These scenarios are illustrative, not exhaustive. A VSO can evaluate a specific situation.
      </p>
    </Section>
);

const WhatYoullNeedToFile = () => (
    <Section
        title="What you'll need to file"
        summary="Forms, evidence, and supporting documentation"
    >
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">Required forms</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>VA Form 21-8940</strong> — Veteran's Application for Increased Compensation
            Based on Unemployability. The primary TDIU application.
          </li>
          <li>
            <strong>VA Form 21-4192</strong> — Request for Employment Information. Completed
            by recent employers (last 12 months). VA may request these directly from employers.
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">Supporting evidence</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Employment history for the last 5 years (employers, dates, hours, gross earnings)</li>
          <li>Education and training history</li>
          <li>Date of last full-time employment</li>
          <li>Reasons each job ended (resignation, termination, leave, layoff, etc.)</li>
          <li>Medical documentation linking service-connected conditions to work limitations</li>
          <li>Treating physician statements about employability (where available)</li>
          <li>Buddy statements from family, former coworkers, or supervisors describing functional impact</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">Helpful for marginal employment claims</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Pay stubs or tax returns showing gross earnings below poverty threshold</li>
          <li>Documentation of accommodations not available to other employees (for sheltered employment)</li>
          <li>Description of the work environment and supervisor relationships</li>
        </ul>
      </div>

      <p className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs">
        💡 <strong>Phase 3 will add a 21-8940 worksheet</strong> to this tool — a structured
        form that mirrors the actual VA form and produces a printable summary you can take
        to your VSO. It is not yet implemented in this version.
      </p>
    </Section>
);

export default TDIUTool;