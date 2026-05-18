import React, {useCallback, useEffect, useState} from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  getServiceConnectedConditions,
  getTDIUStatus,
} from '../utils/profiles';
import { analyzeTDIUEligibility } from '../utils/tdiuEligibility';
import { calculateCombinedRating } from '../utils/vaRatingCalculator';
import {
  get8940Worksheet,
  save8940Worksheet,
  clear8940Worksheet } from '../utils/storage';
import { generate8940WorksheetPDF } from '../utils/export';
import {
  CURRENT_POVERTY_THRESHOLD,
  CURRENT_POVERTY_THRESHOLD_YEAR,
  PROTECTED_ENVIRONMENT_INDICATORS,
} from '../utils/tdiuEligibility';
import { getEmploymentStatus } from '../utils/profiles';

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
 * * Phase 3 adds the VA Form 21-8940 worksheet below the educational sections.
 *  * Phase 4 (future) will add PDF export.
 */

// Poverty threshold constants are sourced from tdiuEligibility.js so they
// stay in sync with the analysis functions. Aliased locally for backwards
// compatibility with existing references in this file.
const POVERTY_THRESHOLD_ANNUAL = CURRENT_POVERTY_THRESHOLD;
const POVERTY_THRESHOLD_YEAR = CURRENT_POVERTY_THRESHOLD_YEAR;
const POVERTY_THRESHOLD_MONTHLY = Math.round(POVERTY_THRESHOLD_ANNUAL / 12);

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
        {/* SECTION 3: VA FORM 21-8940 WORKSHEET          */}
        {/* ============================================ */}
        <Form8940Worksheet profileId={profile.id} />


        {/* ============================================ */}
        {/* SECTION 4: VSO REFERRAL                       */}
        {/* ============================================ */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-5">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <span>📌</span> Always Work With a VSO
          </h3>
          <p className="text-sm text-yellow-900 dark:text-yellow-200 mb-3 text-left">
            This tool helps you organize information. <strong>It does not determine
            eligibility.</strong> The rating math is one factor; the employment-impact
            analysis (which this app does not compute) is the other. Both factors
            require professional evaluation.
          </p>
          <p className="text-sm text-yellow-900 dark:text-yellow-200 mb-3 text-left">
            A Veterans Service Officer (VSO) — accredited representative — can:
          </p>
          <ul className="text-sm text-yellow-900 dark:text-yellow-200 space-y-1 ml-5 list-disc mb-3 text-left">
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
  {/* SECTION 5: REGULATORY FOOTER                  */}
  {/* ============================================ */}
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
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
      Federal poverty threshold of ${POVERTY_THRESHOLD_ANNUAL.toLocaleString()}/year
      is current as of 2026. Verify the latest figure at HHS.gov before filing.
    </p>
    <p className="italic">
      Phase 3 deliverable. Phase 4 (future) will add PDF export of the 21-8940 worksheet.
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-left">{summary}</p>
          )}
        </div>
        <span className="text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-5 pb-5 text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed text-left">
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
        <li>${POVERTY_THRESHOLD_ANNUAL.toLocaleString()} per year</li>
        <li>Approximately ${POVERTY_THRESHOLD_MONTHLY.toLocaleString()} per month</li>
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

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1 text-left">
        <p className="font-semibold text-gray-900 dark:text-white">
          1. Earnings below the poverty threshold
        </p>
        <p>
          Employment that produces gross earnings at or below the federal poverty threshold
          for a single individual. For 2026, that's approximately
          ${POVERTY_THRESHOLD_ANNUAL.toLocaleString()}/year.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 text-left">
        <p className="font-semibold text-gray-900 dark:text-white">
          2. Sheltered or protected work environments
        </p>
        <p>
          Employment in a <em>protected environment</em> — even when earnings exceed the
          poverty threshold. VA has not adopted a bright-line definition; these claims
          are highly fact-specific and often litigated (see <em>Cantrell v. Shulkin</em>,
          28 Vet. App. 382 (2017), which required VA to adequately explain its reasoning).
          The core question: would the employer's accommodations be tolerated in
          competitive employment without the relationship/protection?
        </p>

        <p className="font-medium text-gray-900 dark:text-white mt-2">
          Accommodations that MAY support a protected environment finding
        </p>
        <p className="text-xs italic text-gray-600 dark:text-gray-400">
          (all must be tied to service-connected conditions)
        </p>
        <ul className="ml-5 list-disc text-sm">
          <li>Flexible schedule for PTSD, migraines, panic attacks, or similar symptoms</li>
          <li>Excessive absences or lateness routinely excused</li>
          <li>Reduced productivity standards or quotas</li>
          <li>Permission to work at the veteran's own pace</li>
          <li>Extra breaks beyond normal company policy</li>
          <li>Excused from critical duties, deadlines, or meetings</li>
          <li>Family business or friend-owned company making special accommodations</li>
          <li>Behavioral outbursts or interpersonal issues being tolerated</li>
          <li>Reduced workload while maintaining normal pay</li>
          <li>Remote or isolated work assignments beyond what coworkers receive</li>
        </ul>

        <p className="font-medium text-gray-900 dark:text-white mt-2">
          What does NOT automatically qualify
        </p>
        <ul className="ml-5 list-disc text-sm">
          <li>Simply working alone</li>
          <li>Choosing a low-stress job</li>
          <li>Self-employment by itself</li>
          <li>Working from home alone</li>
          <li>Having standard ADA accommodations alone</li>
        </ul>

        <p className="font-medium text-gray-900 dark:text-white mt-2">
          Strong evidence to develop
        </p>
        <ul className="ml-5 list-disc text-sm">
          <li>
            <span className="font-medium">Detailed employer letter</span> explaining: why
            accommodations are made, what duties are excused, what standards are relaxed,
            how the veteran differs from similarly-situated employees, and whether the
            veteran would likely be terminated in a competitive environment
          </li>
          <li>Documentation of missed work, late arrivals, or reduced productivity</li>
          <li>Statements from coworkers or supervisors</li>
          <li>Written job descriptions showing duties excused</li>
          <li>Payroll or attendance records</li>
          <li>Vocational expert opinions</li>
          <li>Medical evidence linking the need for accommodations to service-connected disabilities</li>
        </ul>

        <p className="text-xs italic text-gray-600 dark:text-gray-400 mt-2">
          Note: After roughly 12 months of earnings above the poverty threshold, VA may
          send VA Form 21-4140 (Employment Questionnaire) and review whether the veteran
          remains unemployable. Sustained earnings without supporting protected-environment
          evidence can become evidence against continued unemployability.
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
        💡 The <strong>VA Form 21-8940 Worksheet</strong> below this section lets you
        draft your employment history and impairment narrative before meeting with your VSO.
        All data is saved locally — nothing leaves your device.
      </p>
    </Section>
);

// ============================================================================
// VA FORM 21-8940 WORKSHEET
// ============================================================================
// A structured form that mirrors VA Form 21-8940 (Veteran's Application for
// Increased Compensation Based on Unemployability). This is a WORKSHEET only —
// it does not submit to VA. All data is saved to localStorage.
//
// Sections:
//   I.   Occupation & Education
//   II.  Last Full-Time Employment
//   III. Employment History (up to 5 prior employers)
//   IV.  How Disabilities Affect Employment
//
// Users are explicitly reminded to review everything with their VSO before filing.
// ============================================================================

/**
 * Blank employer entry template.
 */
const BLANK_EMPLOYER = () => ({
  id: crypto.randomUUID(),
  employer: '',
  city: '',
  state: '',
  fromDate: '',
  toDate: '',
  hoursPerWeek: '',
  grossEarnings: '',
  reasonForLeaving: '',
  conditionsThatAffected: '',
});

/**
 * Build a formatted block of accommodation text from the user's Protected
 * Environment Tracker data, suitable for appending to the 21-8940 Section IV
 * "Special accommodations" textarea.
 *
 * The output is structured as:
 *   - A framing sentence connecting accommodations to SC conditions and
 *     §4.16(a) protected-environment language (what makes them count for
 *     marginal employment analysis)
 *   - A bulleted list of qualifying accommodations the user has checked
 *
 * Returns `null` if the user has no employment data or no qualifying
 * accommodations selected (i.e., nothing to auto-fill from).
 *
 * @param {object|null} employmentStatus - From getEmploymentStatus(profileId)
 * @returns {string|null}
 */
const buildAccommodationsBlockFromTracker = (employmentStatus) => {
  if (!employmentStatus?.currentlyEmployed) return null;

  const accommodationIds = Array.isArray(employmentStatus.accommodations)
      ? employmentStatus.accommodations
      : [];
  if (accommodationIds.length === 0) return null;

  // Translate IDs to human-readable labels, filtering for ONLY qualifying
  // indicators. Non-qualifying selections (e.g., "works alone") deliberately
  // excluded — they don't support a protected-environment finding and would
  // weaken the form rather than strengthen it.
  const qualifyingLabels = PROTECTED_ENVIRONMENT_INDICATORS.qualifying
  .filter(q => accommodationIds.includes(q.id))
  .map(q => q.label);

  if (qualifyingLabels.length === 0) return null;

  const framing = 'The following accommodations are made by my current employer specifically because of my service-connected conditions. These accommodations would not be available to a non-disabled employee in a competitive employment setting (38 CFR §4.16(a) protected environment):';

  const bullets = qualifyingLabels.map(label => `  • ${label}`).join('\n');

  return `${framing}\n\n${bullets}`;
};

/**
 * Small labelled input with consistent styling.
 */
const Field = ({ label, hint, children, required = false }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {children}
    </div>
);

const inputCls =
    'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ' +
    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400';

const textareaCls = inputCls + ' resize-y min-h-[80px]';

/**
 * Single employer history row (collapsible card).
 */
const EmployerEntry = ({ entry, index, onChange, onRemove }) => {
  const [expanded, setExpanded] = useState(true);

  const handle = (field) => (e) =>
      onChange(entry.id, { [field]: e.target.value });

  const dateRange = entry.fromDate || entry.toDate
      ? `${entry.fromDate || '?'} → ${entry.toDate || 'present'}`
      : 'New employer';

  return (
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Employer card header */}
        <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(x => !x)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(x => !x); } }}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-left cursor-pointer select-none"
            aria-expanded={expanded}
        >
          <div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {index + 1}. {entry.employer || 'Employer name'}
          </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {dateRange}
          </span>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(entry.id); }}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded"
                aria-label={`Remove employer ${index + 1}`}
            >
              Remove
            </button>
            <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {expanded && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Employer name">
                  <input
                      type="text"
                      value={entry.employer}
                      onChange={handle('employer')}
                      placeholder="Company or individual name"
                      className={inputCls}
                  />
                </Field>
                <Field label="City">
                  <input
                      type="text"
                      value={entry.city}
                      onChange={handle('city')}
                      placeholder="City"
                      className={inputCls}
                  />
                </Field>
                <Field label="State">
                  <input
                      type="text"
                      value={entry.state}
                      onChange={handle('state')}
                      placeholder="State (2-letter)"
                      maxLength={2}
                      className={inputCls}
                  />
                </Field>
                <Field label="Hours per week">
                  <input
                      type="number"
                      value={entry.hoursPerWeek}
                      onChange={handle('hoursPerWeek')}
                      placeholder="e.g. 40"
                      min={0}
                      max={168}
                      className={inputCls}
                  />
                </Field>
                <Field
                    label="From date"
                    hint="Approximate is fine"
                >
                  <input
                      type="date"
                      value={entry.fromDate}
                      onChange={handle('fromDate')}
                      className={inputCls}
                  />
                </Field>
                <Field label="To date (leave blank if current)">
                  <input
                      type="date"
                      value={entry.toDate}
                      onChange={handle('toDate')}
                      className={inputCls}
                  />
                </Field>
              </div>

              <Field
                  label="Gross earnings (annual)"
                  hint="Approximate annual gross earnings in this role"
              >
                <input
                    type="text"
                    value={entry.grossEarnings}
                    onChange={handle('grossEarnings')}
                    placeholder="e.g. $32,000 or hourly rate"
                    className={inputCls}
                />
              </Field>

              <Field
                  label="Reason for leaving"
                  hint="Be specific — VA will ask whether SC conditions contributed"
              >
            <textarea
                value={entry.reasonForLeaving}
                onChange={handle('reasonForLeaving')}
                placeholder="e.g. Terminated due to excessive absences caused by back pain and migraines..."
                className={textareaCls}
            />
              </Field>

              <Field
                  label="Service-connected conditions that affected this job"
                  hint="List which conditions caused problems, and how"
              >
            <textarea
                value={entry.conditionsThatAffected}
                onChange={handle('conditionsThatAffected')}
                placeholder="e.g. PTSD caused inability to work in crowded office; lumbar strain required frequent breaks..."
                className={textareaCls}
            />
              </Field>
            </div>
        )}
      </div>
  );
};

/**
 * Main 21-8940 Worksheet component.
 */
const Form8940Worksheet = ({ profileId }) => {
  const [data, setData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Phase 12: Track Protected Environment Tracker data so we can offer the
  // user a one-click way to populate Section IV's "Special accommodations"
  // field from structured tracker data they've already entered.
  const [employmentStatus, setEmploymentStatusState] = useState(null);

  // Load worksheet from storage on mount
  useEffect(() => {
    const saved = get8940Worksheet(profileId);
    setData(saved);
  }, [profileId]);

  // Load employment status from profile; refresh when profile data changes
  // (e.g., user edits accommodations in the Protected Environment Tracker
  // and returns to this worksheet — they get fresh suggestions immediately).
  useEffect(() => {
    if (!profileId) return;
    const load = () => setEmploymentStatusState(getEmploymentStatus(profileId));
    load();

    const handler = (e) => {
      if (e.detail?.profileId === profileId) load();
    };
    window.addEventListener('profileUpdated', handler);
    return () => window.removeEventListener('profileUpdated', handler);
  }, [profileId]);

  // Compute the auto-fill block once per render — null if there's nothing
  // to pull from. The button only renders when this is non-null.
  const accommodationsBlock = buildAccommodationsBlockFromTracker(employmentStatus);

  // Auto-save with 800ms debounce after any data change
  useEffect(() => {
    if (!data) return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        save8940Worksheet(data, profileId);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [data, profileId]);

  // Generic scalar field updater
  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Employment history updaters
  const addEmployer = useCallback(() => {
    if ((data?.employmentHistory?.length ?? 0) >= 5) return;
    setData(prev => ({
      ...prev,
      employmentHistory: [...(prev.employmentHistory || []), BLANK_EMPLOYER()],
    }));
  }, [data]);

  const updateEmployer = useCallback((id, changes) => {
    setData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map(e =>
          e.id === id ? { ...e, ...changes } : e
      ),
    }));
  }, []);

  const removeEmployer = useCallback((id) => {
    setData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter(e => e.id !== id),
    }));
  }, []);

  const handleClear = () => {
    clear8940Worksheet(profileId);
    const fresh = get8940Worksheet(profileId);
    setData(fresh);
    setShowClearConfirm(false);
    setSaveStatus('idle');
  };

  /**
   * Append the Protected Environment Tracker's accommodation block to the
   * Section IV "Special accommodations" textarea. Existing text is preserved
   * with a clear visual separator so the user can edit or remove either
   * source freely after the merge.
   */
  const handleAutoFillAccommodations = () => {
    if (!accommodationsBlock) return;

    const existing = (data?.specialAccommodations || '').trim();
    const separator = '\n\n--- From Protected Environment Tracker ---\n';
    const merged = existing
        ? `${existing}${separator}${accommodationsBlock}`
        : accommodationsBlock;

    updateField('specialAccommodations', merged);
  };

  const handleExport = () => {
    // Pull a fresh copy from storage to ensure lastSaved is accurate
    const current = get8940Worksheet(profileId);
    // Priority: legal name (patientName) → display name → fallback
    let veteranName = 'Veteran';
    try {
      const profiles = JSON.parse(localStorage.getItem('symptomTracker_profiles') || '[]');
      const match = profiles.find(p => p.id === profileId);
      if (match) {
        veteranName = match.metadata?.patientName?.trim() || match.name || 'Veteran';
      }
    } catch { /* ignore */ }
    generate8940WorksheetPDF(current, veteranName);
  };

  if (!data) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading worksheet…</p>
        </div>
    );
  }

  const employerCount = data.employmentHistory?.length ?? 0;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* === Header === */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                📋 VA Form 21-8940 Worksheet
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Draft your employment history and impairment narrative before meeting with your VSO.
                This is a <strong>personal worksheet only</strong> — it does not submit to VA.
              </p>
            </div>
            {/* Auto-save indicator */}
            <div className="shrink-0 text-xs mt-1">
              {saveStatus === 'saving' && (
                  <span className="text-gray-400">Saving…</span>
              )}
              {saveStatus === 'saved' && (
                  <span className="text-green-600 dark:text-green-400">✓ Saved</span>
              )}
              {saveStatus === 'error' && (
                  <span className="text-red-500">Save error</span>
              )}
            </div>
          </div>

          {/* Disclaimer banner */}
          <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg px-3 py-2 text-xs text-yellow-900 dark:text-yellow-200">
            ⚠️ <strong>Review with your VSO before filing.</strong> This worksheet helps you
            organize your thoughts — the actual Form 21-8940 must be submitted through VA with
            VSO guidance. Data is stored on your device only.
          </div>
        </div>

        <div className="p-5 space-y-8">

          {/* ===================== SECTION I — Occupation & Education ===================== */}
          <section aria-labelledby="ws-section1">
            <h4
                id="ws-section1"
                className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600"
            >
              Section I — Occupation &amp; Education
            </h4>
            <div className="space-y-4">
              <Field
                  label="Usual occupation"
                  hint="What type of work did you do for most of your working life?"
              >
                <input
                    type="text"
                    value={data.usualOccupation}
                    onChange={e => updateField('usualOccupation', e.target.value)}
                    placeholder="e.g. Truck driver, warehouse supervisor, office administrator"
                    className={inputCls}
                />
              </Field>

              <Field
                  label="Highest level of education completed"
              >
                <select
                    value={data.educationLevel}
                    onChange={e => updateField('educationLevel', e.target.value)}
                    className={inputCls}
                >
                  <option value="">— Select —</option>
                  <option value="less-than-hs">Less than high school</option>
                  <option value="hs-diploma">High school diploma / GED</option>
                  <option value="some-college">Some college (no degree)</option>
                  <option value="associates">Associate's degree</option>
                  <option value="bachelors">Bachelor's degree</option>
                  <option value="graduate">Graduate degree (Master's, PhD, etc.)</option>
                  <option value="professional">Professional degree (JD, MD, etc.)</option>
                  <option value="vocational">Vocational / trade certification</option>
                </select>
              </Field>

              <Field
                  label="Vocational training or professional certifications"
                  hint="Include military occupational specialties, trade programs, or professional licenses"
              >
              <textarea
                  value={data.vocationalTraining}
                  onChange={e => updateField('vocationalTraining', e.target.value)}
                  placeholder="e.g. CDL (commercial driver's license), HVAC certification, 11B Infantry MOS..."
                  className={textareaCls}
              />
              </Field>
            </div>
          </section>

          {/* ===================== SECTION II — Last Employment ===================== */}
          <section aria-labelledby="ws-section2">
            <h4
                id="ws-section2"
                className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600"
            >
              Section II — Last Full-Time Employment
            </h4>
            <div className="space-y-4">
              <Field
                  label="Date of last full-time employment"
                  hint="Date you last worked full-time. Full-time is generally 40 hours/week."
              >
                <input
                    type="date"
                    value={data.lastFullTimeDate}
                    onChange={e => updateField('lastFullTimeDate', e.target.value)}
                    className={inputCls}
                />
              </Field>

              <Field
                  label="Why did full-time employment end?"
                  hint="Describe specifically how your service-connected conditions contributed. 'Could not maintain attendance due to chronic pain and PTSD episodes' is more useful than 'medical reasons.'"
              >
              <textarea
                  value={data.lastFullTimeReason}
                  onChange={e => updateField('lastFullTimeReason', e.target.value)}
                  placeholder="e.g. Terminated after multiple attendance warnings. Absences were due to flare-ups of service-connected lumbar strain and PTSD nightmares causing daytime impairment..."
                  className={textareaCls + ' min-h-[100px]'}
              />
              </Field>
            </div>
          </section>

          {/* ===================== SECTION III — Employment History ===================== */}
          <section aria-labelledby="ws-section3">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
              <h4
                  id="ws-section3"
                  className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                Section III — Employment History
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                (last 5 employers, most recent first)
              </span>
              </h4>
              <button
                  onClick={addEmployer}
                  disabled={employerCount >= 5}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      employerCount >= 5
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                + Add Employer
              </button>
            </div>

            {employerCount === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No employers added yet. Use <strong>+ Add Employer</strong> to record up to 5 prior employers.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    VA Form 21-8940 asks for your employment history from the last 5 years.
                  </p>
                </div>
            ) : (
                <div className="space-y-3">
                  {data.employmentHistory.map((entry, idx) => (
                      <EmployerEntry
                          key={entry.id}
                          entry={entry}
                          index={idx}
                          onChange={updateEmployer}
                          onRemove={removeEmployer}
                      />
                  ))}
                  {employerCount >= 5 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Maximum of 5 employers reached. Remove one to add another.
                      </p>
                  )}
                </div>
            )}
          </section>

          {/* ===================== SECTION IV — How Disabilities Affect Employment ===================== */}
          <section aria-labelledby="ws-section4">
            <h4
                id="ws-section4"
                className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600"
            >
              Section IV — How Disabilities Affect Employment
            </h4>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 text-xs text-blue-900 dark:text-blue-200">
              💡 <strong>Tip:</strong> This section is the core of your TDIU argument.
              Be specific about <em>functional</em> limitations — not just diagnoses.
              "PTSD prevents me from working in environments with loud noises or unpredictable people"
              is stronger than "I have PTSD."
            </div>

            <div className="space-y-4">
              <Field
                  label="Service-connected conditions that prevent or limit employment"
                  hint="List each condition and its VA diagnostic code if known"
              >
              <textarea
                  value={data.conditionsPreventingWork}
                  onChange={e => updateField('conditionsPreventingWork', e.target.value)}
                  placeholder="e.g. Lumbar strain (DC 5237, 40%), PTSD (DC 9411, 50%), Migraines (DC 8100, 30%)..."
                  className={textareaCls}
              />
              </Field>

              <Field
                  label="How do these conditions specifically affect your ability to work?"
                  hint="Describe functional impairments: attendance, concentration, physical demands, social interaction, stamina, pain, etc."
              >
              <textarea
                  value={data.howConditionsAffect}
                  onChange={e => updateField('howConditionsAffect', e.target.value)}
                  placeholder={[
                    'e.g. Lumbar strain: cannot sit or stand for more than 20 minutes without severe pain. ',
                    'Requires frequent breaks and positional changes that are not compatible with production jobs.',
                    '\n\nPTSD: hypervigilance causes inability to concentrate in open-office environments. ',
                    'Anger/irritability has led to conflicts with supervisors at prior jobs. ',
                    'Nightmares cause fatigue that impairs daytime function 3–4 days per week.',
                  ].join('')}
                  className={textareaCls + ' min-h-[140px]'}
              />
              </Field>

              <Field
                  label="Special accommodations required or received"
                  hint="Include accommodations from prior employers, or accommodations you would require that are not reasonably available in competitive employment"
              >
                {accommodationsBlock && (
                    <div className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-xs text-emerald-900 dark:text-emerald-200 flex-1 min-w-0">
                        🛡️ You have accommodations recorded in the Protected Work Environment Tracker.
                      </p>
                      <button
                          type="button"
                          onClick={handleAutoFillAccommodations}
                          className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
                      >
                        Auto-fill below
                      </button>
                    </div>
                )}
                <textarea
                    value={data.specialAccommodations}
                    onChange={e => updateField('specialAccommodations', e.target.value)}
                    placeholder="e.g. Required ability to lie down during work hours due to back pain. No employer was able to accommodate this. At family business, was allowed to leave without notice on bad days..."
                    className={textareaCls}
                />
              </Field>

              <Field
                  label="Approximate days per year missed due to service-connected conditions"
                  hint="Estimate based on recent experience. VA looks for patterns of lost time."
              >
                <input
                    type="text"
                    value={data.missedWorkDays}
                    onChange={e => updateField('missedWorkDays', e.target.value)}
                    placeholder="e.g. 60–80 days/year, or 2–3 days/week during flare-ups"
                    className={inputCls}
                />
              </Field>
            </div>
          </section>

          {/* ===================== Footer actions ===================== */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {data.lastSaved
                  ? `Last saved: ${new Date(data.lastSaved).toLocaleString()}`
                  : 'Not yet saved'}
            </div>

            <div className="flex gap-3">
              <button
                  onClick={handleExport}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                ⬇ Export PDF
              </button>
              {!showClearConfirm ? (
                  <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear worksheet
                  </button>
              ) : (
                  <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Clear all data?
                </span>
                    <button
                        onClick={handleClear}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, clear
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
              )}
            </div>
          </div>

        </div>
      </div>
  );
};

export default TDIUTool;