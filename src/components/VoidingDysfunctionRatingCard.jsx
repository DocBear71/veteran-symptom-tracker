import { ChevronDown, ChevronUp } from 'lucide-react';
import { VOIDING_DYSFUNCTION_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';

/**
 * Voiding Dysfunction Rating Card Component - Gold Standard Version
 * Displays VA rating analysis for Voiding Dysfunction (DC 7512/7527/7542/7518)
 * Based on 38 CFR 4.115a
 */
export default function VoidingDysfunctionRatingCard({
                                                       analysis,
                                                       expanded,
                                                       onToggle,
                                                       conditionName = 'Voiding Dysfunction',
                                                       diagnosticCode = '7512'
                                                     }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = VOIDING_DYSFUNCTION_CRITERIA;

  // Helper: Check if rating is supported
  // Normalize rating for comparison
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);

  const isRatingSupported = (ratingPercent) => {
    if (numericRating === null) return false;
    return ratingPercent === numericRating;
  };

  // Find which rating category applies
  const incontinenceRating = criteria.ratingsIncontinence.find(r => r.percent === supportedRating);
  const frequencyRating = criteria.ratingsFrequency.find(r => r.percent === supportedRating);
  const obstructionRating = criteria.ratingsObstruction.find(r => r.percent === supportedRating);

  let ratingCategory = '';
  if (incontinenceRating) ratingCategory = 'Incontinence';
  else if (frequencyRating) ratingCategory = 'Frequency';
  else if (obstructionRating) ratingCategory = 'Obstruction';

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-teal-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{conditionName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC {diagnosticCode} - 38 CFR 4.115a</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.avgFrequency > 0 ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.avgFrequency > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}>{metrics?.avgFrequency || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Freq/Day</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.avgNocturia > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.avgNocturia > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>{metrics?.avgNocturia || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Nocturia/Night</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.avgPadChanges > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.avgPadChanges > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>{metrics?.avgPadChanges || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Pad Changes/Day</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale {ratingCategory && `(${ratingCategory})`}
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



              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode={diagnosticCode}
                  currentRating={numericRating}
              />


              {/* VA Rating Schedule - Incontinence */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - Incontinence
                </h4>
                <div className="space-y-2">
                  {criteria.ratingsIncontinence.map(rating => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div key={`inc-${rating.percent}`} className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.percent}%</div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.summary}</div>
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* VA Rating Schedule - Frequency */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - Frequency
                </h4>
                <div className="space-y-2">
                  {criteria.ratingsFrequency.map(rating => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div key={`freq-${rating.percent}`} className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.percent}%</div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.summary}</div>
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* VA Rating Schedule - Obstruction */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - Obstruction
                </h4>
                <div className="space-y-2">
                  {criteria.ratingsObstruction.map(rating => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div key={`obs-${rating.percent}`} className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.percent}%</div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.summary}</div>
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation Gaps</h4>
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

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Rate under highest category: Incontinence, Frequency, or Obstruction</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Keep a voiding diary with times and amounts</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Document pad/protective garment usage</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Record catheter use if applicable</span></li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.115a - Voiding Dysfunction Rating Formula. This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}