import { ChevronDown, ChevronUp } from 'lucide-react';
import { PERITONEAL_ADHESIONS_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * Peritoneal Adhesions Rating Card Component
 * DC 7301 - 38 CFR 4.114
 * Rated by obstruction severity, dietary modification, hospitalization, and GI symptoms
 */
export default function PeritonealAdhesionsRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = PERITONEAL_ADHESIONS_CRITERIA;

  const isRatingSupported = (percent) => parseInt(supportedRating) === percent;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-lime-500">
        {/* Collapsed Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩻</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Peritoneal Adhesions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {criteria.diagnosticCode} - {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
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

        {/* Expanded Content */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Evidence Summary - 4 Box Grid */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.giSymptomsCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.giSymptomsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.giSymptomsCount || 0}/6
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">GI Symptoms</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.hospitalizationLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.hospitalizationLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.hospitalizationLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hospitalizations</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.dietaryModLogs > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.dietaryModLogs > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`}>
                      {metrics?.dietaryModLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Diet Modified</div>
                  </div>
                </div>
                {/* Additional metrics row - GI Symptoms breakdown */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.abdominalPainLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.abdominalPainLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.abdominalPainLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Pain</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.nauseaLogs > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.nauseaLogs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.nauseaLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Nausea</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.vomitingLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.vomitingLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.vomitingLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Vomiting</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.colicLogs > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.colicLogs > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                    }`}>
                      {metrics?.colicLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Colic</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.constipationLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.constipationLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.constipationLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Constip.</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.diarrheaLogs > 0 ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.diarrheaLogs > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                    }`}>
                      {metrics?.diarrheaLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Diarrhea</div>
                  </div>
                </div>
                {/* Obstruction and TPN row */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.partialObstructionLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.partialObstructionLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.partialObstructionLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Partial Obstruction</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.completeObstructionLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.completeObstructionLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.completeObstructionLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Complete Obstruction</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.tpnLogs > 0 ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.tpnLogs > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'
                    }`}>
                      {metrics?.tpnLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">TPN Required</div>
                  </div>
                </div>
              </div>

              {/* GI Symptoms Detail */}
              {metrics?.giSymptoms && metrics.giSymptoms.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                      GI Symptoms Documented:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {metrics.giSymptoms.map((symptom, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-100 dark:bg-amber-800/30 rounded text-xs text-amber-700 dark:text-amber-300">
                    {symptom}
                  </span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      VA considers: pain, nausea, vomiting, colic, constipation, diarrhea
                    </p>
                  </div>
              )}

              {/* Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-lime-600 dark:text-lime-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="7301"
                  currentRating={supportedRating}
              />

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

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Adhesions must be confirmed by healthcare provider</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Dietary modification must be medically-directed (not self-imposed)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document hospitalization records for obstruction episodes</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>May result from surgery, trauma, Crohn's, cholecystitis, or infection</span>
                  </li>
                </ul>
              </div>

              {/* Complete Obstruction Warning */}
              {metrics?.completeObstructionLogs > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                      <span>🚨</span>
                      URGENT WARNING
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Complete bowel obstruction has been logged. This is a medical emergency.
                      Seek immediate medical attention if you experience severe abdominal pain,
                      inability to pass gas or stool, severe bloating, or persistent vomiting.
                    </p>
                  </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
}