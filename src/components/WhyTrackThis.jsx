/**
 * WhyTrackThis.jsx
 *
 * Collapsible educational callout component explaining WHY tracking
 * specific symptom details matters for VA ratings.
 *
 * Designed to scale across 960+ symptoms by mapping symptom IDs
 * and categories to educational content.
 *
 * Priority: symptomId > category > body system > default
 *
 * Usage:
 *   <WhyTrackThis symptomId="migraine" />
 *   <WhyTrackThis symptomId={selectedSymptom} category={selectedCategory} />
 *   <WhyTrackThis category="respiratory" />
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { educationalContent, categoryMapping } from '../data/educationalContent';

// ============================================
// MAIN COMPONENT
// ============================================
const WhyTrackThis = ({
                        symptomId,      // Specific symptom ID (highest priority)
                        condition,      // Alias for symptomId
                        category,       // Category ID (fallback)
                        bodySystem,     // Body system (lowest priority fallback)
                        defaultExpanded = false,
                        showDCCode = true,
                        compact = false
                      }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Determine which content to show (priority: symptomId > category > bodySystem > default)
  const id = symptomId || condition;
  let content = null;

  // Try specific symptom ID first
  if (id && educationalContent[id]) {
    content = educationalContent[id];
  }
  // Try category mapping
  else if (category && categoryMapping[category]) {
    content = educationalContent[categoryMapping[category]];
  }
  // Try category directly (with underscore prefix)
  else if (category && educationalContent[`_category_${category}`]) {
    content = educationalContent[`_category_${category}`];
  }
  // Try body system
  else if (bodySystem && educationalContent[`_system_${bodySystem}`]) {
    content = educationalContent[`_system_${bodySystem}`];
  }
  // Default fallback
  else {
    content = educationalContent['_default'];
  }

  if (!content) return null;

  // Compact version - just icon and expandable text
  if (compact) {
    return (
        <details className="text-xs text-blue-700 dark:text-blue-400 mb-3">
          <summary className="cursor-pointer font-medium flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            {content.title}
          </summary>
          <p className="mt-1 pl-4 text-blue-600 dark:text-blue-500">
            {content.text}
          </p>
        </details>
    );
  }

  // Full version with card styling
  return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4 overflow-hidden">
        <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-hidden="true">{content.icon}</span>
            <span className="font-medium text-blue-800 dark:text-blue-300 text-sm">
            {content.title}
          </span>
            {showDCCode && content.dcCode && (
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              {content.dcCode}
            </span>
            )}
          </div>
          {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          ) : (
              <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {content.text}
              </p>

              {content.keyPoint && (
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-2">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                      📌 Key Point: {content.keyPoint}
                    </p>
                  </div>
              )}

              {content.tip && (
                  <p className="text-xs text-blue-600 dark:text-blue-500 italic">
                    💡 Tip: {content.tip}
                  </p>
              )}
            </div>
        )}
      </div>
  );
};

export default WhyTrackThis;

// ============================================
// HELPER: Check if content exists for a symptom
// ============================================
export const hasEducationalContent = (symptomId) => {
  return !!educationalContent[symptomId];
};

// ============================================
// HELPER: Get all symptom IDs with specific content
// ============================================
export const getSymptomIdsWithContent = () => {
  return Object.keys(educationalContent).filter(key => !key.startsWith('_'));
};

// ============================================
// HELPER: Get all category mappings
// ============================================
export const getCategoryMappings = () => {
  return { ...categoryMapping };
};