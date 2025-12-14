
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ERECTILE_DYSFUNCTION_CRITERIA } from '../utils/ratingCriteria';

export default function ErectileDysfunctionRatingCard({ analysis, expanded, onToggle }) {

  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = ERECTILE_DYSFUNCTION_CRITERIA;
  const ratingDetails = criteria.ratings[0]; // Always 0%

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-gray-400">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩺</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Erectile Dysfunction
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7522 - 38 CFR 4.115b
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                0%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Standard Rating
              </div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {ratingDetails && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      0% Rating - Service Connection Important
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {ratingDetails.summary}
                    </p>
                    <ul className="space-y-1">
                      {ratingDetails.criteriaDescription.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-gray-500 mt-0.5">•</span>
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

              {metrics && metrics.mostCommonSeverity && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Documented Severity
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-lg font-medium text-blue-700 dark:text-blue-300 capitalize">
                        {metrics.mostCommonSeverity} severity
                      </div>
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

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Why Service Connection Matters
                </h4>
                <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                  While rated at 0%, service connection for erectile dysfunction is important because:
                </p>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Potential eligibility for Special Monthly Compensation (SMC) in specific circumstances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Establishes nexus to other service-connected conditions (PTSD, diabetes, hypertension, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>May support secondary claims if additional conditions develop</span>
                  </li>
                </ul>
              </div>

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