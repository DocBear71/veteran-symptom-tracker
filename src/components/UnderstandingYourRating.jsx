import { useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardList, BarChart3, Lightbulb, BookOpen } from 'lucide-react';
import { getConditionDescription, hasConditionDescription } from '../data/conditionDescriptions';
import { getProfileType, PROFILE_TYPES } from '../utils/profile';

/**
 * UnderstandingYourRating Component
 *
 * A reusable, collapsible section for rating cards that provides:
 * - What evidence the VA looks for
 * - What each rating level means in practical terms
 * - Documentation tips specific to the condition
 * - Key term definitions (optional toggle)
 *
 * Only displays for veteran profiles. Non-veterans see a simplified version
 * or nothing at all based on the showForNonVeterans prop.
 *
 * @param {string} diagnosticCode - The VA diagnostic code (e.g., '9411', '8100')
 * @param {number} currentRating - The currently supported rating (to highlight relevant level)
 * @param {boolean} showForNonVeterans - Whether to show simplified content for non-veterans
 * @param {boolean} defaultExpanded - Whether the main section starts expanded
 */
export default function UnderstandingYourRating({
                                                  diagnosticCode,
                                                  currentRating = null,
                                                  showForNonVeterans = false,
                                                  defaultExpanded = false
                                                }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedSections, setExpandedSections] = useState({
    evidence: false,
    meanings: false,
    tips: false,
    terms: false,
  });

  // Check profile type
  const isVeteran = getProfileType() === PROFILE_TYPES.VETERAN;

  // Get condition description data
  const description = getConditionDescription(diagnosticCode);

  // Don't render if no description exists or if non-veteran and not showing for non-veterans
  if (!description) return null;
  if (!isVeteran && !showForNonVeterans) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Simplified content for non-veterans
  if (!isVeteran && showForNonVeterans) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Documentation Tips
          </h4>
          <ul className="space-y-1">
            {description.documentationTips.slice(0, 3).map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
            ))}
          </ul>
        </div>
    );
  }

  return (
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Main Toggle Header */}
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-gray-900 dark:text-white">
            Understanding Your Rating
          </span>
          </div>
          {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
            <div className="p-4 space-y-3 bg-white dark:bg-gray-800">

              {/* Section 1: What Evidence VA Looks For */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('evidence')}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                  What Evidence the VA Looks For
                </span>
                  </div>
                  {expandedSections.evidence ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.evidence && (
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <ul className="space-y-2">
                        {description.evidenceLookingFor.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-0.5 font-bold">✓</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>

              {/* Section 2: What Each Rating Level Means */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('meanings')}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                  What Each Rating Level Means
                </span>
                  </div>
                  {expandedSections.meanings ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.meanings && (
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 space-y-3">
                      {description.ratingLevelMeanings.map((level, idx) => {
                        const isCurrentRating = currentRating === level.percent;
                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border ${
                                    isCurrentRating
                                        ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold ${
                            isCurrentRating
                                ? 'text-green-700 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                        }`}>
                          {level.percent}%
                        </span>
                                {isCurrentRating && (
                                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Your Rating
                          </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                {level.meaning}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                {level.realWorld}
                              </p>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>

              {/* Section 3: Documentation Tips */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('tips')}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                  Documentation Tips
                </span>
                  </div>
                  {expandedSections.tips ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.tips && (
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <ul className="space-y-2">
                        {description.documentationTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-500 dark:text-amber-400 mt-0.5">💡</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>

              {/* Section 4: Key Terms (if available) */}
              {description.keyTerms && Object.keys(description.keyTerms).length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('terms')}
                        className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                    Key VA Terms
                  </span>
                      </div>
                      {expandedSections.terms ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedSections.terms && (
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                          <dl className="space-y-3">
                            {Object.entries(description.keyTerms).map(([term, definition], idx) => (
                                <div key={idx}>
                                  <dt className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {term}
                                  </dt>
                                  <dd className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 ml-4">
                                    {definition}
                                  </dd>
                                </div>
                            ))}
                          </dl>
                        </div>
                    )}
                  </div>
              )}

            </div>
        )}
      </div>
  );
}

/**
 * Compact version for inline use in rating cards
 * Shows just a "Learn More" link that expands to show tips
 */
export function UnderstandingYourRatingCompact({ diagnosticCode }) {
  const [showTips, setShowTips] = useState(false);
  const isVeteran = getProfileType() === PROFILE_TYPES.VETERAN;
  const description = getConditionDescription(diagnosticCode);

  if (!description || !isVeteran) return null;

  return (
      <div>
        <button
            onClick={() => setShowTips(!showTips)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3" />
          {showTips ? 'Hide' : 'Show'} Rating Guide
        </button>

        {showTips && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-sm text-blue-900 dark:text-blue-200 mb-2">
                Quick Documentation Tips
              </h5>
              <ul className="space-y-1">
                {description.documentationTips.slice(0, 4).map((tip, idx) => (
                    <li key={idx} className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-1">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
}