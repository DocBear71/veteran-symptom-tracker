
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VOIDING_DYSFUNCTION_CRITERIA } from '../utils/ratingCriteria';

export default function VoidingDysfunctionRatingCard({ analysis, expanded, onToggle, conditionName, diagnosticCode }) {

  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = VOIDING_DYSFUNCTION_CRITERIA;

  // Find rating in any of the three categories
  const incontinenceRating = criteria.ratingsIncontinence.find(r => r.percent === supportedRating);
  const frequencyRating = criteria.ratingsFrequency.find(r => r.percent === supportedRating);
  const obstructionRating = criteria.ratingsObstruction.find(r => r.percent === supportedRating);
  const ratingDetails = incontinenceRating || frequencyRating || obstructionRating;

  // Determine which category applies
  let ratingCategory = '';
  if (incontinenceRating) ratingCategory = 'Incontinence';
  else if (frequencyRating) ratingCategory = 'Frequency';
  else if (obstructionRating) ratingCategory = 'Obstruction';

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {conditionName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - Voiding Dysfunction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {supportedRating}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Supported Rating
              </div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {ratingDetails && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      {supportedRating}% Rating Criteria ({ratingCategory})
                    </h4>
                    <p className="text-blue-800 dark:text-blue-300 mb-3">
                      {ratingDetails.summary}
                    </p>
                    <ul className="space-y-1">
                      {ratingDetails.criteriaDescription.map((item, idx) => (
                          <li key={idx} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  Your Documented Evidence
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                  {rationale.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                  ))}
                </div>
              </div>

              {metrics && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Voiding Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.avgFrequency > 0 && (
                          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                              {metrics.avgFrequency}
                            </div>
                            <div className="text-xs text-cyan-700 dark:text-cyan-300">
                              Avg Frequency/Day
                            </div>
                          </div>
                      )}
                      {metrics.avgNocturia > 0 && (
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                              {metrics.avgNocturia}
                            </div>
                            <div className="text-xs text-indigo-700 dark:text-indigo-300">
                              Avg Nocturia/Night
                            </div>
                          </div>
                      )}
                      {metrics.incontinenceEpisodes > 0 && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {metrics.incontinenceEpisodes}
                            </div>
                            <div className="text-xs text-orange-700 dark:text-orange-300">
                              Incontinence Episodes
                            </div>
                          </div>
                      )}
                      {metrics.avgPadChanges > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {metrics.avgPadChanges}
                            </div>
                            <div className="text-xs text-purple-700 dark:text-purple-300">
                              Avg Pad Changes/Day
                            </div>
                          </div>
                      )}
                      {metrics.catheterUse > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg col-span-2">
                            <div className="text-sm font-medium text-red-700 dark:text-red-300">
                              Catheter Use: {metrics.catheterType || 'Yes'} ({metrics.catheterUse} documented)
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Strengthen Your Claim
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-amber-500 mt-0.5">→</span>
                            <span className="text-amber-800 dark:text-amber-200">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  {criteria.note}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {criteria.disclaimer}
                </p>
              </div>
            </div>
        )}
      </div>
  );
}