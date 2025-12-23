import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  WEAK_FOOT_CRITERIA,
  CLAW_FOOT_CRITERIA,
  METATARSALGIA_CRITERIA,
  HALLUX_VALGUS_CRITERIA,
  HALLUX_RIGIDUS_CRITERIA,
} from '../utils/ratingCriteria';

/**
 * Foot Conditions Rating Card Component - Gold Standard Version
 * Handles 5 foot conditions:
 * DC 5277: Weak Foot (Bilateral)
 * DC 5278: Claw Foot (Pes Cavus)
 * DC 5279: Metatarsalgia (Morton's Disease)
 * DC 5280: Hallux Valgus (Bunion)
 * DC 5281: Hallux Rigidus
 * 38 CFR 4.71a
 */
export default function FootConditionsRatingCard({ analysis, diagnosticCode, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;

  // Get condition-specific configuration based on diagnostic code
  const getConditionConfig = () => {
    switch (diagnosticCode) {
      case '5277':
        return {
          criteria: WEAK_FOOT_CRITERIA,
          emoji: '🦶',
          name: 'Weak Foot (Bilateral)',
          specificLabel: 'Atrophy',
          specificValue: metrics?.atrophyCount || 0,
          impactLabel: 'Circulation',
          impactValue: metrics?.circulationCount || 0,
        };
      case '5278':
        return {
          criteria: CLAW_FOOT_CRITERIA,
          emoji: '🦶',
          name: 'Claw Foot (Pes Cavus)',
          specificLabel: 'Hammer Toes',
          specificValue: metrics?.hammerToesCount || 0,
          impactLabel: 'Callosities',
          impactValue: metrics?.callositiesCount || 0,
        };
      case '5279':
        return {
          criteria: METATARSALGIA_CRITERIA,
          emoji: '🔥',
          name: "Metatarsalgia (Morton's Disease)",
          specificLabel: 'Ball Pain',
          specificValue: metrics?.ballFootPainCount || 0,
          impactLabel: 'Shooting',
          impactValue: metrics?.shootingPainCount || 0,
        };
      case '5280':
        return {
          criteria: HALLUX_VALGUS_CRITERIA,
          emoji: '👣',
          name: 'Hallux Valgus (Bunion)',
          specificLabel: 'Bunion Pain',
          specificValue: metrics?.bunionPainCount || 0,
          impactLabel: 'Post-Surgical',
          impactValue: metrics?.postSurgicalCount || 0,
        };
      case '5281':
        return {
          criteria: HALLUX_RIGIDUS_CRITERIA,
          emoji: '🦴',
          name: 'Hallux Rigidus',
          specificLabel: 'Stiffness',
          specificValue: metrics?.stiffnessCount || 0,
          impactLabel: 'Limited ROM',
          impactValue: metrics?.limitedMotionCount || 0,
        };
      default:
        return null;
    }
  };

  const config = getConditionConfig();
  if (!config) return null;

  const { criteria, emoji, name, specificLabel, specificValue, impactLabel, impactValue } = config;

  // Normalize rating for comparison (handles string vs number)
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Standardized color scheme across all rating cards
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - 38 CFR 4.71a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Supported Rating
              </div>
            </div>
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* === EXPANDED CONTENT === */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Section 1: Evidence Summary (4-box grid) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Box 1: Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Total Logs
                    </div>
                  </div>

                  {/* Box 2: Avg Severity */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.avgSeverity >= 7
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : metrics?.avgSeverity >= 4
                              ? 'bg-orange-50 dark:bg-orange-900/20'
                              : 'bg-purple-50 dark:bg-purple-900/20'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.avgSeverity >= 7
                            ? 'text-red-600 dark:text-red-400'
                            : metrics?.avgSeverity >= 4
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {(metrics?.avgSeverity || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Avg Severity
                    </div>
                  </div>

                  {/* Box 3: Condition-Specific Metric */}
                  <div className={`p-3 rounded-lg text-center ${
                      specificValue > 0
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        specificValue > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                    }`}>
                      {specificValue}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {specificLabel}
                    </div>
                  </div>

                  {/* Box 4: Functional Impact */}
                  <div className={`p-3 rounded-lg text-center ${
                      impactValue > 0
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        impactValue > 0
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {impactValue}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {impactLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((r) => {
                    const s = isRatingSupported(r.percent);
                    return (
                        <div
                            key={r.percent}
                            className={`p-3 rounded-lg border ${s ? 'border-2' : ''} ${getRatingRowColor(r.percent, s)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${
                                s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {r.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${
                                s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {r.summary}
                            </div>
                            {s && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Documentation Gaps */}
              {gaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {gaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 5: Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Foot conditions rated under 38 CFR 4.71a</span>
                  </li>
                  {diagnosticCode === '5277' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>DC 5277 requires bilateral (both feet) involvement</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Underlying constitutional condition should also be rated</span>
                        </li>
                      </>
                  )}
                  {diagnosticCode === '5278' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Higher ratings require hammer toes, callosities, and varus deformity</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Cannot be combined with other claw foot ratings</span>
                        </li>
                      </>
                  )}
                  {diagnosticCode === '5279' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>10% is maximum schedular rating for metatarsalgia</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Same rating whether unilateral or bilateral</span>
                        </li>
                      </>
                  )}
                  {diagnosticCode === '5280' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>10% requires surgery (resection) OR severity equivalent to great toe amputation</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Each foot rated separately if bilateral</span>
                        </li>
                      </>
                  )}
                  {diagnosticCode === '5281' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Severe hallux rigidus rated as severe hallux valgus (10%)</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Cannot be combined with claw foot ratings</span>
                        </li>
                      </>
                  )}
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer || 'Based on 38 CFR 4.71a. VA determines final ratings based on complete medical evidence including podiatric examination. This analysis is for documentation guidance only.'}
              </div>
            </div>
        )}
      </div>
  );
}