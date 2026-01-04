// ============================================
// SystemicLupusRatingCard.jsx
// Phase 14B: Rating card for Systemic Lupus Erythematosus (SLE)
// DC 6350 - 38 CFR 4.88b
// ============================================

import { ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { SYSTEMIC_LUPUS_CRITERIA } from '../utils/ratingCriteria';

const SystemicLupusRatingCard = ({ analysis, expanded, onToggle }) => {
  if (!analysis?.hasData) {
    return null;
  }

  const {
    supportedRating,
    rationale = [],
    evidenceGaps = [],
    metrics = {},
  } = analysis;

  const criteria = SYSTEMIC_LUPUS_CRITERIA;

  // Color coding based on rating
  const getRatingColor = (rating) => {
    if (rating >= 100) return 'red';
    if (rating >= 60) return 'orange';
    if (rating >= 10) return 'yellow';
    return 'gray';
  };

  const ratingColor = getRatingColor(supportedRating);

  // Check if a rating level is supported
  const isRatingSupported = (ratingPercent) => {
    return supportedRating >= ratingPercent;
  };

  // Get row styling for rating schedule
  const getRatingRowStyle = (percent, isSupported) => {
    if (!isSupported) {
      return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    }
    if (percent === 100) return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
    if (percent === 60) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
    if (percent === 10) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦋</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Systemic Lupus Erythematosus (SLE)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 6350 - 38 CFR 4.88b
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold text-${ratingColor}-600 dark:text-${ratingColor}-400`}>
                {supportedRating}%
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
                  {/* Total Symptoms */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Entries</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Past Year</div>
                  </div>

                  {/* Flare Count */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {metrics.flareCount || 0}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">Flares Logged</div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {metrics.acuteFlares || 0} acute
                    </div>
                  </div>

                  {/* Week-Long Flares */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {metrics.weekLongFlares || 0}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Week+ Flares</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Key for 60%</div>
                  </div>

                  {/* Hospitalizations */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {metrics.hospitalizations || 0}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Hospitalizations</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">For SLE</div>
                  </div>
                </div>

                {/* Second row - Organ involvement */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                      {metrics.kidneySymptoms || 0}
                    </div>
                    <div className="text-xs text-teal-700 dark:text-teal-300">Kidney</div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {metrics.neurologicalSymptoms || 0}
                    </div>
                    <div className="text-xs text-indigo-700 dark:text-indigo-300">Neurological</div>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                      {metrics.skinSymptoms || 0}
                    </div>
                    <div className="text-xs text-pink-700 dark:text-pink-300">Skin</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {metrics.jointSymptoms || 0}
                    </div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Joint</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 dark:text-purple-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - DC 6350
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={rating.percent}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowStyle(rating.percent, isSupported)}`}
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

              {/* Section 4: Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
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

              {/* Section 5: Important Note about Rating Method */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Rating Method Options
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
                  SLE can be rated TWO ways - use whichever gives the <strong>higher</strong> rating:
                </p>
                <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1 ml-4">
                  <li>• <strong>Option 1:</strong> DC 6350 alone (10%, 60%, or 100% based on flare frequency)</li>
                  <li>• <strong>Option 2:</strong> Combine ratings for each affected body system (kidneys, heart, lungs, neuro, etc.)</li>
                </ul>
                <p className="text-sm text-purple-700 dark:text-purple-400 mt-2 italic">
                  Example: Lupus nephritis (40%) + depression (30%) + arthritis (20%) combined may exceed DC 6350 60%
                </p>
              </div>

              {/* Section 6: Secondary Conditions Quick Reference */}
              {criteria.secondaryConditions && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Body Systems to Document Separately
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-300">
                      <div>• Kidneys (Lupus Nephritis)</div>
                      <div>• Heart (Pericarditis)</div>
                      <div>• Lungs (Pleuritis)</div>
                      <div>• Neurological (Seizures, Cognitive)</div>
                      <div>• Blood (Anemia, Low Platelets)</div>
                      <div>• Joints (Arthritis)</div>
                      <div>• Mental Health (Depression)</div>
                      <div>• Skin (if extensive)</div>
                    </div>
                  </div>
              )}

              {/* Section 7: Presumptive Info */}
              {criteria.presumptiveInfo && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <div className="text-sm text-green-800 dark:text-green-300">
                        <strong>Presumptive Condition:</strong> {criteria.presumptiveInfo.description}
                      </div>
                    </div>
                  </div>
              )}

              {/* Section 8: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
};

export default SystemicLupusRatingCard;