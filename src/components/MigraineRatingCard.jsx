import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MIGRAINE_CRITERIA } from '../utils/ratingCriteria';

/**
 * Migraine Rating Card Component - Gold Standard Version
 * DC 8100 - 38 CFR 4.124a
 */
export default function MigraineRatingCard({ analysis, expanded, onToggle }) {
  const [showDefinitions, setShowDefinitions] = useState(false);

  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics, evidence } = analysis;
  const criteria = MIGRAINE_CRITERIA;

  const isRatingSupported = (percent) => supportedRating === percent;

  // Standardized color scheme across all rating cards
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600';
  };

  // Extract metrics from either new format or legacy format
  const totalMigraines = metrics?.totalMigraines || evidence?.totalMigraines || 0;
  const prostratingCount = metrics?.prostratingCount || evidence?.prostratingCount || 0;
  const prolongedCount = metrics?.prolongedCount || evidence?.prolongedCount || 0;
  const monthlyRate = metrics?.monthlyRate || evidence?.monthlyRates?.prostrating || 0;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤕</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Migraine Headaches
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {criteria.diagnosticCode} - {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalMigraines}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Migraines</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      prostratingCount > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        prostratingCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {prostratingCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Prostrating</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      prolongedCount > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        prolongedCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {prolongedCount}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Prolonged (4+ hrs)</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      monthlyRate > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        monthlyRate > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {monthlyRate}/mo
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rate</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {rationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={rating.percent}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.summary}
                            </div>
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {evidenceGaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Definitions Toggle */}
              <div>
                <button
                    onClick={() => setShowDefinitions(!showDefinitions)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showDefinitions ? 'Hide' : 'Show'} Key Term Definitions
                </button>

                {showDefinitions && (
                    <div className="mt-3 space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">Prostrating</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          A migraine that causes you to lie down and stop all activity. Renders you unable to perform normal daily activities.
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">Prolonged Attack</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          A prostrating migraine lasting 4 hours or more despite treatment.
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">Economic Inadaptability</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Migraines severe enough to prevent you from maintaining substantially gainful employment.
                        </p>
                      </div>
                    </div>
                )}
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Only prostrating migraines count toward VA rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document severity, duration, and frequency</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Note impact on work and daily activities</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on {criteria.cfrReference}. For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}