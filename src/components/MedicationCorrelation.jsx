import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getMedicationLogs } from '../utils/storage';
import { formatDosage } from '../utils/medicationUtils';
import { getProfileType, PROFILE_TYPES } from '../utils/profile';
import { getSearchTermsFromAnalysis, CONDITION_MED_SEARCH_TERMS } from '../utils/medicationCorrelation';

/**
 * MedicationCorrelation Component
 *
 * Displays medication effectiveness and side effects data for a specific condition
 * within a VA Rating Card. Supports the 38 CFR §4.10 documentation strategy by
 * showing actual functional impairment levels while medicated.
 *
 * Two usage patterns:
 *
 * 1. Explicit searchTerms (GenericRatingCard with conditionKey):
 *    <MedicationCorrelation
 *      conditionName="Lumbosacral Strain"
 *      searchTerms={CONDITION_MED_SEARCH_TERMS.lumbosacralStrain}
 *    />
 *
 * 2. Auto-resolve from analysis object (standalone rating cards):
 *    <MedicationCorrelation analysis={analysis} />
 *
 * Props:
 *   analysis (object)      - Rating card analysis object (has diagnosticCode + condition)
 *   conditionName (string) - Display name override (defaults to analysis.condition)
 *   searchTerms (string[]) - Explicit search terms override (skips auto-resolve)
 */

// Effectiveness labels and colors - must match Medications.jsx constants
const EFFECTIVENESS_LABELS = {
  none: 'No Relief',
  slight: 'Slight Relief',
  moderate: 'Moderate Relief',
  significant: 'Significant Relief',
  complete: 'Complete Relief',
};

const EFFECTIVENESS_ORDER = ['none', 'slight', 'moderate', 'significant', 'complete'];

const EFFECTIVENESS_COLORS = {
  none: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
  slight: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
  moderate: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
  significant: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
  complete: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
};

const EFFECTIVENESS_BAR_COLORS = {
  none: 'bg-red-500',
  slight: 'bg-orange-500',
  moderate: 'bg-yellow-500',
  significant: 'bg-green-500',
  complete: 'bg-emerald-500',
};

/**
 * Analyze medication logs for a specific condition
 * Matches logs where takenFor contains any of the searchTerms (case-insensitive)
 */
const analyzeMedicationData = (searchTerms) => {
  if (!searchTerms || searchTerms.length === 0) return null;

  const allLogs = getMedicationLogs();
  if (!allLogs || allLogs.length === 0) return null;

  // Normalize search terms for matching
  const normalizedTerms = searchTerms.map(t => t.toLowerCase().trim());

  // Find logs matching this condition
  const matchingLogs = allLogs.filter(log => {
    if (!log.takenFor) return false;
    const takenForLower = log.takenFor.toLowerCase().trim();
    return normalizedTerms.some(term => takenForLower.includes(term) || term.includes(takenForLower));
  });

  if (matchingLogs.length === 0) return null;

  // --- Effectiveness distribution ---
  const effectivenessLogs = matchingLogs.filter(log => log.effectiveness);
  const effectivenessDistribution = {};
  EFFECTIVENESS_ORDER.forEach(level => {
    effectivenessDistribution[level] = effectivenessLogs.filter(l => l.effectiveness === level).length;
  });
  const totalWithEffectiveness = effectivenessLogs.length;

  // --- Side effects frequency ---
  const sideEffectCounts = {};
  matchingLogs.forEach(log => {
    if (log.sideEffects) {
      log.sideEffects.split(',').map(s => s.trim()).filter(Boolean).forEach(effect => {
        sideEffectCounts[effect] = (sideEffectCounts[effect] || 0) + 1;
      });
    }
  });
  // Sort by frequency
  const topSideEffects = Object.entries(sideEffectCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8); // Top 8

  // --- Medication breakdown ---
  const medBreakdown = {};
  matchingLogs.forEach(log => {
    const key = log.medicationName || 'Unknown';
    if (!medBreakdown[key]) {
      medBreakdown[key] = {
        name: key,
        dosage: formatDosage(log),
        count: 0,
        effectiveness: {},
        sideEffectCount: 0,
      };
    }
    medBreakdown[key].count++;
    if (log.effectiveness) {
      medBreakdown[key].effectiveness[log.effectiveness] =
          (medBreakdown[key].effectiveness[log.effectiveness] || 0) + 1;
    }
    if (log.sideEffects) {
      medBreakdown[key].sideEffectCount++;
    }
  });

  // Sort by usage count
  const medications = Object.values(medBreakdown).sort((a, b) => b.count - a.count);

  // --- Most common effectiveness ---
  let mostCommonEffectiveness = null;
  if (totalWithEffectiveness > 0) {
    const maxCount = Math.max(...Object.values(effectivenessDistribution));
    mostCommonEffectiveness = EFFECTIVENESS_ORDER.find(
        level => effectivenessDistribution[level] === maxCount
    );
  }

  return {
    totalLogs: matchingLogs.length,
    totalWithEffectiveness,
    effectivenessDistribution,
    mostCommonEffectiveness,
    topSideEffects,
    medications,
    hasSideEffects: topSideEffects.length > 0,
  };
};

export default function MedicationCorrelation({ analysis, conditionName, searchTerms }) {
  const [expanded, setExpanded] = useState(false);
  const profileType = getProfileType();
  const isVeteran = profileType === PROFILE_TYPES.VETERAN;

  // Resolve search terms: explicit prop > auto-resolve from analysis
  const resolvedTerms = useMemo(() => {
    if (searchTerms && searchTerms.length > 0) return searchTerms;
    return getSearchTermsFromAnalysis(analysis);
  }, [searchTerms, analysis]);

  // Resolve display name
  const displayName = conditionName || analysis?.condition || 'this condition';

  // Memoize analysis to avoid recalculating on every render
  const data = useMemo(() => analyzeMedicationData(resolvedTerms), [resolvedTerms]);

  // Don't render if no matching medication data
  if (!data) return null;

  const { totalLogs, totalWithEffectiveness, effectivenessDistribution,
    mostCommonEffectiveness, topSideEffects, medications, hasSideEffects } = data;

  return (
      <div className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
        {/* Collapsible Header */}
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💊</span>
            <div className="text-left">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Medication Effectiveness
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalLogs} log{totalLogs !== 1 ? 's' : ''} · {medications.length} medication{medications.length !== 1 ? 's' : ''}
                {mostCommonEffectiveness && (
                    <span className="ml-1">
                  · Most common: {EFFECTIVENESS_LABELS[mostCommonEffectiveness]}
                </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini effectiveness indicator */}
            {mostCommonEffectiveness && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${EFFECTIVENESS_COLORS[mostCommonEffectiveness]}`}>
              {EFFECTIVENESS_LABELS[mostCommonEffectiveness]}
            </span>
            )}
            {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="px-4 py-4 space-y-4 bg-white dark:bg-gray-800">

              {/* Effectiveness Distribution */}
              {totalWithEffectiveness > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Effectiveness Distribution
                    </h5>
                    <div className="space-y-1.5">
                      {EFFECTIVENESS_ORDER.map(level => {
                        const count = effectivenessDistribution[level] || 0;
                        const percent = totalWithEffectiveness > 0 ? (count / totalWithEffectiveness) * 100 : 0;
                        return (
                            <div key={level} className="flex items-center gap-2">
                              <div className="w-24 text-xs text-gray-600 dark:text-gray-400 text-right shrink-0">
                                {EFFECTIVENESS_LABELS[level]}
                              </div>
                              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${EFFECTIVENESS_BAR_COLORS[level]}`}
                                    style={{ width: `${Math.max(count > 0 ? 4 : 0, percent)}%` }}
                                />
                              </div>
                              <div className="w-12 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                {count} ({percent.toFixed(0)}%)
                              </div>
                            </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Based on {totalWithEffectiveness} of {totalLogs} logs with effectiveness recorded
                    </p>
                  </div>
              )}

              {/* Medication Breakdown */}
              {medications.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medications Used
                    </h5>
                    <div className="space-y-2">
                      {medications.map((med, idx) => {
                        // Find most common effectiveness for this med
                        const medBestLevel = Object.entries(med.effectiveness)
                        .sort(([, a], [, b]) => b - a)[0];

                        return (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {med.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {med.dosage} · {med.count} log{med.count !== 1 ? 's' : ''}
                                  {med.sideEffectCount > 0 && (
                                      <span className="text-amber-600 dark:text-amber-400">
                              {' '}· {med.sideEffectCount} with side effects
                            </span>
                                  )}
                                </p>
                              </div>
                              {medBestLevel && (
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${EFFECTIVENESS_COLORS[medBestLevel[0]]}`}>
                          {EFFECTIVENESS_LABELS[medBestLevel[0]]}
                        </span>
                              )}
                            </div>
                        );
                      })}
                    </div>
                  </div>
              )}

              {/* Side Effects */}
              {hasSideEffects && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reported Side Effects
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {topSideEffects.map(([effect, count]) => (
                          <span
                              key={effect}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          >
                    ⚠️ {effect}
                            {count > 1 && (
                                <span className="text-amber-500 dark:text-amber-400">×{count}</span>
                            )}
                  </span>
                      ))}
                    </div>
                    {isVeteran && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          Side effects may support secondary service-connection claims.
                          Document all side effects consistently.
                        </p>
                    )}
                  </div>
              )}

              {/* §4.10 Context Note */}
              {isVeteran && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>38 CFR §4.10 — Functional Impairment:</strong> VA rates based on your
                      actual functional impairment level while on medication. This data documents
                      how effective your medications are at controlling {displayName.toLowerCase()} symptoms,
                      which directly affects your rating evaluation.
                    </p>
                  </div>
              )}

              {/* No effectiveness data recorded yet */}
              {totalWithEffectiveness === 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      <strong>Tip:</strong> You have {totalLogs} medication log{totalLogs !== 1 ? 's' : ''} for
                      this condition but none include effectiveness ratings. When logging medications,
                      tap an effectiveness level to build stronger evidence.
                    </p>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}