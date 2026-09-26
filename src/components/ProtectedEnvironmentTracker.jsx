import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  getEmploymentStatus,
  clearEmploymentStatus,
  getTDIUStatus,
} from '../utils/profiles';
import {
  analyzeMarginalEmployment,
  analyzeProtectedEnvironment,
  REASONABLE_DOUBT_EXPENSE_CATEGORIES,
  REASONABLE_DOUBT_STATEMENT_GUIDANCE,
  CURRENT_POVERTY_THRESHOLD,
  CURRENT_POVERTY_THRESHOLD_YEAR,
  CURRENT_POVERTY_THRESHOLD_ALTERNATE,
  PROTECTED_ENVIRONMENT_INDICATORS,
} from '../utils/tdiuEligibility';
import { generateProtectedEnvironmentPDF } from '../utils/export';
import EmploymentStatusModal from './EmploymentStatusModal';
import EmployerLetterGenerator from './EmployerLetterGenerator';

/**
 * ProtectedEnvironmentTracker — standalone resource page for veterans who
 * are working (or who may be in a protected/sheltered environment) to:
 *
 *   1. Record their current employment status
 *   2. Track accommodations against the qualifying/non-qualifying lists
 *   3. Track which evidence they've collected
 *   4. Generate an employer letter
 *
 * Lives as a card on the C&P Resources hub (CPResources.jsx). Embedded via
 * the same {embedded, onClose} contract as TDIUTool.
 *
 * Like TDIUTool, this NEVER renders a determination. The analysis output is
 * framed as flagging potential indicators for VSO/attorney review.
 *
 * Regulatory anchors:
 *   - 38 CFR §4.16(a) (marginal employment, protected environment)
 *   - 38 CFR §3.102 (reasonable doubt resolved in the claimant's favor)
 *   - 38 CFR §4.23 (standard of conduct for VA rating personnel)
 *   - M21-1, Part VIII, Subpart iv, 3.A.2.c (marginal employment definition)
 *     and 3.A.2.e (protected environment). NOTE: M21-1 Part IV, Subpart ii,
 *     2.F is retired — it is a "Historical" shell with no content topics.
 *     Do not cite it.
 *   - Cantrell v. Shulkin, 28 Vet. App. 382 (2017) (Board reasoning requirement)
 *   - Labruzza and McBride v. McDonough, 37 Vet.App. 111 (2024) (defining a
 *     protected environment)
 *   - Faust v. West, 13 Vet. App. 342 (2000) (income not dispositive)
 *   - Ortiz-Valles v. McDonald, 28 Vet.App. 65 (2016) (marginal employment
 *     applies to Veterans who are not currently employed)
 */
const ProtectedEnvironmentTracker = ({ embedded = false, onClose }) => {
  const { profile } = useProfile();

  // ============================================
  // Component state
  // ============================================
  const [employmentStatus, setEmploymentStatusState] = useState(null);
  const [tdiuStatus, setTdiuStatusState] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  // Load fresh data on mount AND whenever the profile-updated event fires
  // (modal saves trigger that event, so the page refreshes automatically).
  useEffect(() => {
    if (!profile?.id) return;
    const load = () => {
      setEmploymentStatusState(getEmploymentStatus(profile.id));
      setTdiuStatusState(getTDIUStatus(profile.id));
    };
    load();

    const handler = (e) => {
      if (e.detail?.profileId === profile.id) load();
    };
    window.addEventListener('profileUpdated', handler);
    return () => window.removeEventListener('profileUpdated', handler);
  }, [profile?.id]);

  // ============================================
  // Gating: veteran-only feature
  // ============================================
  if (!profile || profile.type !== 'veteran') {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            The Protected Work Environment Tracker is only available for Veteran profiles.
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

  // ============================================
  // Run analyses
  // ============================================
  const marginalAnalysis = analyzeMarginalEmployment(employmentStatus);
  // M21-1 VIII.iv.3.A.2.e: protected-environment consideration is only
  // triggered when income exceeds the poverty threshold. Passing the income
  // result through lets the analysis say so rather than implying every Veteran
  // needs this pathway.
  const protectedAnalysis = analyzeProtectedEnvironment(employmentStatus, {
    overThreshold: marginalAnalysis.overThreshold,
  });

  const handleClearEmployment = () => {
    if (!window.confirm('Remove employment status? This will clear all accommodations and evidence tracking.')) return;
    clearEmploymentStatus(profile.id);
  };

  /**
   * Export the full Protected Environment Tracker dataset as a structured PDF.
   * Bundles employment status, accommodations, evidence, and analysis into a
   * single document a VSO or attorney can review.
   */
  const handleDownloadPacket = () => {
    if (!employmentStatus) {
      alert('No employment status to export. Add employment status first.');
      return;
    }
    // Resolve the veteran's display name with the same priority used in the
    // 21-8940 export: legal name (patientName) → display name → fallback.
    let veteranName = profile?.name || 'Veteran';
    if (profile?.metadata?.patientName?.trim()) {
      veteranName = profile.metadata.patientName.trim();
    }

    generateProtectedEnvironmentPDF({
      employmentStatus,
      marginalAnalysis,
      protectedAnalysis,
      qualifyingIndicators: PROTECTED_ENVIRONMENT_INDICATORS.qualifying,
      nonQualifyingIndicators: PROTECTED_ENVIRONMENT_INDICATORS.nonQualifying,
      veteranName,
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🛡️ Protected Work Environment Tracker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Marginal employment and protected environment evidence — 38 CFR §4.16(a)
            </p>
          </div>
          {embedded && onClose && (
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  aria-label="Close"
              >
                ✕
              </button>
          )}
        </div>

        {/* ============================================ */}
        {/* CONTEXT BANNER                               */}
        {/* ============================================ */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
            <strong>When this tool is useful:</strong> You are receiving TDIU (or pursuing it), you are working, and you believe your employment is "marginal" or in a "protected environment" under VA's definitions.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            VA recognizes two <em>independent</em> pathways under §4.16(a): (1) earnings at or below the Census Bureau poverty threshold for one person, OR (2) a facts-found determination — including employment in a protected environment — <strong>even when earnings exceed the threshold</strong>. Failing the income test does not close the second pathway. This tracker addresses both.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-2">
            Marginal employment is also not limited to Veterans who are currently working. If the evidence shows you are capable only of marginal employment, that supports IU even with no job at all (M21-1 VIII.iv.3.A.2.d; Ortiz-Valles v. McDonald).
          </p>
        </div>

        {/* ============================================ */}
        {/* SECTION 1: EMPLOYMENT STATUS                 */}
        {/* ============================================ */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Employment status
            </h3>
            <div className="flex gap-2">
              <button
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1.5 bg-blue-900 dark:bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
              >
                {employmentStatus ? 'Edit' : 'Add'}
              </button>
              {employmentStatus && (
                  <button
                      onClick={handleClearEmployment}
                      className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Clear
                  </button>
              )}
            </div>
          </div>

          {!employmentStatus ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No employment status recorded. Add one to begin tracking accommodations and evidence.
              </p>
          ) : (
              <EmploymentSummary
                  status={employmentStatus}
                  marginal={marginalAnalysis}
              />
          )}
        </section>

        {/* ============================================ */}
        {/* SECTION 2: MARGINAL EMPLOYMENT ANALYSIS      */}
        {/* ============================================ */}
        {employmentStatus && (
            <>
              <MarginalAnalysisCard analysis={marginalAnalysis} />

              {/* Shown once income is over the safe harbor — in the reasonable-
                  doubt band it's the primary action, above it a secondary one. */}
              {marginalAnalysis.overSafeHarbor && (
                  <ReasonableDoubtCard analysis={marginalAnalysis} />
              )}
            </>
        )}

        {/* ============================================ */}
        {/* SECTION 3: PROTECTED ENVIRONMENT ANALYSIS    */}
        {/* ============================================ */}
        {employmentStatus && (
            <ProtectedAnalysisCard analysis={protectedAnalysis} />
        )}

        {/* ============================================ */}
        {/* SECTION 4: EMPLOYER LETTER                   */}
        {/* ============================================ */}
        {employmentStatus?.currentlyEmployed && (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📨 Employer letter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Generate a draft letter your employer can fill in and sign. This is the single most valuable piece of protected-environment evidence per VA case law.
              </p>
              <button
                  onClick={() => setShowLetter(true)}
                  className="px-4 py-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600"
              >
                Generate Employer Letter
              </button>
            </section>
        )}

        {/* ============================================ */}
        {/* SECTION 5: EVIDENCE PACKET PDF EXPORT        */}
        {/* ============================================ */}
        {employmentStatus && (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📄 Evidence packet export
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Bundle your employment status, accommodations, evidence checklist, and analysis into a single PDF for VSO or attorney review. Anchored in 38 CFR §4.16(a) and Cantrell v. Shulkin.
              </p>
              <button
                  onClick={handleDownloadPacket}
                  className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 flex items-center gap-2"
              >
                <span>⬇</span>
                <span>Download Evidence Packet PDF</span>
              </button>
            </section>
        )}

        {/* ============================================ */}
        {/* FOOTER: CITATIONS & DISCLAIMER               */}
        {/* ============================================ */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400 space-y-2 text-left">
            <p>
                <strong>Regulatory anchors:</strong> 38 CFR §4.16(a); 38 CFR §3.102 (reasonable doubt); 38 CFR §4.23 (rating personnel standard of conduct); M21-1, Part VIII, Subpart iv, 3.A.2.c–f.
            </p>
            <p>
                <strong>Case law:</strong> Cantrell v. Shulkin, 28 Vet. App. 382 (2017); Labruzza and McBride v. McDonough, 37 Vet.App. 111 (2024); Faust v. West, 13 Vet. App. 342 (2000); Ortiz-Valles v. McDonald, 28 Vet.App. 65 (2016); Moore v. Derwinski, 1 Vet. App. 83 (1991).
            </p>
            <p>
                <strong>Poverty threshold:</strong> ${CURRENT_POVERTY_THRESHOLD.toLocaleString()}/year — U.S. Census Bureau "one person (unrelated individual)" weighted average, {CURRENT_POVERTY_THRESHOLD_YEAR} thresholds. Census publishes each year's figures the following September. M21-1 VIII.iv.3.A.2.c links to the Census table without naming a specific line; the highest one-person figure ({CURRENT_POVERTY_THRESHOLD_ALTERNATE ? `$${CURRENT_POVERTY_THRESHOLD_ALTERNATE.toLocaleString()}` : 'under 65'}) is widely quoted as a safe harbor.
            </p>
          <p className="italic pt-1 border-t border-gray-200 dark:border-gray-700 mt-2">
            This tool does not render a determination. Protected-environment status is a facts-found determination made by the VA. Work with a Veterans Service Officer (VSO) or attorney to evaluate your specific situation.
          </p>
        </div>

        {/* ============================================ */}
        {/* MODALS                                       */}
        {/* ============================================ */}
        {showModal && (
            <EmploymentStatusModal
                initialStatus={employmentStatus}
                onClose={() => setShowModal(false)}
            />
        )}
        {showLetter && (
            <EmployerLetterGenerator
                employmentStatus={employmentStatus}
                onClose={() => setShowLetter(false)}
            />
        )}
      </div>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Employment summary card — what the user has recorded.
 */
const EmploymentSummary = ({ status, marginal }) => {
  const employerTypeLabels = {
    competitive: 'Competitive employment',
    'family-business': 'Family-owned business',
    'sheltered-workshop': 'Sheltered workshop',
    'self-employed': 'Self-employed',
    other: 'Other',
  };

  if (!status.currentlyEmployed) {
    return (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>Not currently employed.</p>
          {status.lastEmployedDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last employed: {status.lastEmployedDate}
              </p>
          )}
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <SummaryItem label="Status" value="Currently employed" />
        <SummaryItem label="Employer type" value={employerTypeLabels[status.employerType] || status.employerType} />
        {status.startDate && (
            <SummaryItem label="Start date" value={status.startDate} />
        )}
        <SummaryItem
            label="Annual income"
            value={`$${Number(status.annualIncome || 0).toLocaleString()}`}
        />
        <SummaryItem
            label={`vs. ${marginal.thresholdYear} threshold`}
            value={
              marginal.overThreshold
                  ? <span className="text-amber-700 dark:text-amber-400">Above ${marginal.threshold.toLocaleString()}</span>
                  : <span className="text-green-700 dark:text-green-400">At or below ${marginal.threshold.toLocaleString()}</span>
            }
        />
        {marginal.monthsOverThreshold !== null && (
            <SummaryItem
                label="Months above threshold"
                value={`${marginal.monthsOverThreshold} ${marginal.pastReviewWindow ? '⚠ past 12-month review window' : marginal.nearReviewWindow ? '⚠ approaching review' : ''}`}
            />
        )}
      </div>
  );
};

const SummaryItem = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
        {value}
      </p>
    </div>
);

/**
 * Marginal employment analysis card — income pathway under §4.16(a).
 */
const MarginalAnalysisCard = ({ analysis }) => {
  const stateConfig = {
    'no-data': {
      color: 'gray',
      title: 'No data yet',
      body: 'Add your employment status to see marginal-employment analysis.',
    },
    'not-employed': {
      color: 'gray',
      title: 'Not currently employed',
      body: 'The marginal-employment income test only applies when there are earnings to evaluate.',
    },
    'below-threshold': {
      color: 'green',
      title: 'Income suggests marginal employment',
      body: `Earnings of $${analysis.annualIncome?.toLocaleString()} are at or below the ${analysis.thresholdYear} Census Bureau threshold of $${analysis.threshold?.toLocaleString()}. This generally satisfies the income test for marginal employment under §4.16(a).`,
    },
    'above-threshold': {
      color: 'amber',
      title: 'Income above threshold',
      body: `Earnings of $${analysis.annualIncome?.toLocaleString()} exceed the ${analysis.thresholdYear} Census Bureau threshold of $${analysis.threshold?.toLocaleString()}. The income test alone does NOT classify this as marginal — but you may still qualify under the protected-environment pathway (see next section).`,
    },
    // The Census table gives three figures for one person. The highest
    // (under 65) is the practical safe harbor: under it, a Veteran qualifies
    // whichever line their circumstances actually point to. This is the
    // reassuring band, not the worrying one.
    'below-safe-harbor': {
      color: 'green',
      title: 'Income below every one-person poverty figure',
      body: `Earnings of $${analysis.annualIncome?.toLocaleString()} are above the ${analysis.thresholdYear} weighted-average figure ($${analysis.threshold?.toLocaleString()}) but below the highest one-person Census figure ($${analysis.thresholdSafeHarbor?.toLocaleString()}). The Census table lists three figures for a single person — over 65, under 65, and a weighted average — and you are under all of them. This should satisfy the income test regardless of your age or household. Worth confirming with a VSO, but you are not near the edge.`,
    },
    // Over the figures, but by an amount VA can resolve in the Veteran's
    // favor. The useful response is documentation, not a warning.
    'within-reasonable-doubt': {
      color: 'amber',
      title: `Income $${analysis.amountOverSafeHarbor?.toLocaleString()} over — VA can resolve this in your favor`,
      body: `Earnings of $${analysis.annualIncome?.toLocaleString()} exceed the highest ${analysis.thresholdYear} one-person Census figure ($${analysis.thresholdSafeHarbor?.toLocaleString()}) by $${analysis.amountOverSafeHarbor?.toLocaleString()}. A gap this size is the kind VA can resolve in your favor under 38 CFR §3.102, but only if there is something in the record to support it. See the reasonable-doubt section below for what to document and how to submit it.`,
    },
  };

  const config = stateConfig[analysis.state] || stateConfig['no-data'];
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200 text-left',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-left',
    gray: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-left',
  };

  return (
      <section className={`rounded-lg border p-4 ${colorClasses[config.color]}`}>
        <h3 className="text-lg font-semibold mb-2">
          1. Marginal employment (income pathway)
        </h3>
        <p className="text-sm mb-2"><strong>{config.title}</strong></p>
        <p className="text-sm">{config.body}</p>
        {analysis.pastReviewWindow && (
            <p className="text-xs mt-3 pt-3 border-t border-current opacity-90">
              ⚠ You have been above threshold for {analysis.monthsOverThreshold} months. VA typically reviews employment status with VA Form 21-4140 after ~12 months. Consider strengthening your protected-environment evidence (next section).
            </p>
        )}
        <p className="text-xs italic mt-3 opacity-75">
          Citation: {analysis.citation}
        </p>
      </section>
  );
};

/**
 * Reasonable-doubt documentation prompt — 38 CFR §3.102.
 *
 * The point of this card is that the Veteran can act. A rater cannot write
 * "this overage is inconsequential" without something in the record, and the
 * Veteran can put that something there themselves with a personal statement.
 * Most Veterans don't know that.
 *
 * Framing constraint: this reflects one adjudicator's described practice and
 * is discretionary. Copy says what gives VA a basis, never that it will work.
 */
const ReasonableDoubtCard = ({ analysis }) => {
  const inBand = analysis.state === 'within-reasonable-doubt';

  return (
      <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 text-left">
        <h3 className="text-lg font-semibold mb-1 text-blue-900 dark:text-blue-200">
          Reasonable doubt — 38 CFR §3.102
        </h3>
        <p className="text-sm text-blue-900 dark:text-blue-200 mb-3">
          {inBand
              ? `Your earnings are $${analysis.amountOverSafeHarbor?.toLocaleString()} over the highest one-person Census figure. Where the evidence is in approximate balance, VA resolves reasonable doubt in the Veteran's favor. A gap this size can be addressed in a rating decision — but only if the record contains something to address it with.`
              : `Your earnings are well above the one-person Census figures, so the income test alone is unlikely to establish marginal employment. The protected-environment pathway is the stronger route. The documentation below may still help if your actual financial position differs from what the income figure suggests.`}
        </p>

        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
          What to document
        </p>
        <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1 mb-3">
          {REASONABLE_DOUBT_EXPENSE_CATEGORIES.map(category => (
              <li key={category.id} className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>
                  <strong>{category.label}</strong>
                  {category.note && (
                      <span className="block text-xs opacity-80">{category.note}</span>
                  )}
                </span>
              </li>
          ))}
        </ul>

        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
          You can submit this yourself
        </p>
        <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1 mb-3">
          {REASONABLE_DOUBT_STATEMENT_GUIDANCE.points.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{point}</span>
              </li>
          ))}
        </ul>

        <p className="text-xs text-blue-800 dark:text-blue-300 italic">
          {REASONABLE_DOUBT_STATEMENT_GUIDANCE.raterStandardNote}
        </p>
      </section>
  );
};

/**
 * Protected environment analysis card — facts-found pathway.
 */
const ProtectedAnalysisCard = ({ analysis }) => {
  if (analysis.state === 'no-data' || analysis.state === 'not-employed') {
    return null; // already covered by marginal card
  }

  // Look up labels for selected qualifying indicators
  const qualifyingLabels = (analysis.qualifyingIndicators || []).map(id => {
    const found = PROTECTED_ENVIRONMENT_INDICATORS.qualifying.find(q => q.id === id);
    return found ? found.label : id;
  });

  const stateConfig = {
    'potential-protected-env': {
      color: 'amber',
      title: `Potential protected environment (${analysis.indicatorStrength} indicators)`,
      body: `You have selected ${analysis.qualifyingCount} qualifying accommodation${analysis.qualifyingCount === 1 ? '' : 's'}. This may support a protected-environment determination — but VA will require evidence and a facts-specific analysis.`,
    },
    'non-qualifying-only': {
      color: 'gray',
      title: 'Only non-qualifying factors selected',
      body: 'The items you selected do not, by themselves, establish a protected environment. They can provide context but won\'t carry weight without qualifying accommodations.',
    },
    'no-indicators': {
      color: 'gray',
      title: 'No accommodations recorded yet',
      body: 'Edit your employment status and check any accommodations your employer makes that tie to your service-connected conditions.',
    },
  };

  const config = stateConfig[analysis.state];
  const colorClasses = {
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-left',
    gray: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-left',
  };

  return (
      <section className={`rounded-lg border p-4 ${colorClasses[config.color]}`}>
        <h3 className="text-lg font-semibold mb-2">
          2. Protected environment (facts-found pathway)
        </h3>
        <p className="text-sm mb-2"><strong>{config.title}</strong></p>
        <p className="text-sm mb-3">{config.body}</p>

        {/* Qualifying indicators selected */}
        {qualifyingLabels.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                Accommodations recorded
              </p>
              <ul className="text-sm ml-5 list-disc space-y-0.5">
                {qualifyingLabels.map(label => (
                    <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
        )}

        {/* Evidence gaps */}
        {analysis.evidenceGaps && analysis.evidenceGaps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current opacity-90">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                Evidence still to collect
              </p>
              <ul className="text-sm ml-5 list-disc space-y-1">
                {analysis.evidenceGaps.map(gap => (
                    <li key={gap.id}>
                      <span className="font-medium">{gap.label}</span>
                      <span className="text-xs ml-2 italic opacity-75">
                        ({gap.importance})
                      </span>
                      {gap.note && (
                          <p className="text-xs mt-0.5 opacity-80">{gap.note}</p>
                      )}
                    </li>
                ))}
              </ul>
            </div>
        )}

        {analysis.evidenceComplete && (
            <p className="text-sm mt-3 pt-3 border-t border-current font-medium">
              ✓ All evidence categories marked collected. Great work.
            </p>
        )}

        <p className="text-xs italic mt-3 opacity-75">
          Citation: {analysis.citation} · Anchors: Cantrell, Faust
        </p>
      </section>
  );
};

export default ProtectedEnvironmentTracker;