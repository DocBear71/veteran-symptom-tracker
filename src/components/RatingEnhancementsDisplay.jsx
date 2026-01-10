/**
 * RatingEnhancementsDisplay.jsx
 *
 * Reusable component for displaying rating enhancements including:
 * - Key VA/BVA definitions
 * - Case law references
 * - Documentation tips
 * - Exam preparation tips
 *
 * Used within rating cards to provide educational content that helps
 * veterans understand criteria and build stronger claims.
 */

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Scale,
  FileText,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  Info
} from 'lucide-react';
import { getEnhancementsForDC } from '../data/ratingEnhancements';

/**
 * Single Definition Card
 */
const DefinitionCard = ({ term, definition, source, important }) => (
    <div className={`p-3 rounded-lg ${
        important
            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
            : 'bg-gray-50 dark:bg-gray-700/30'
    }`}>
      <div className="flex items-start gap-2">
        {important && <span className="text-amber-500 mt-0.5">⭐</span>}
        <div className="flex-1">
          <div className={`font-semibold ${
              important ? 'text-amber-900 dark:text-amber-200' : 'text-gray-900 dark:text-white'
          }`}>
            {term}
          </div>
          <p className={`text-sm mt-1 ${
              important ? 'text-amber-800 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {definition}
          </p>
          {source && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                Source: {source}
              </p>
          )}
        </div>
      </div>
    </div>
);

/**
 * Single Case Law Card
 */
const CaseLawCard = ({ caseData }) => (
    <div className={`p-3 rounded-lg border ${
        caseData.important
            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
            : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start gap-2">
        <Scale className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            caseData.important ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
        }`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold ${
              caseData.important ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-900 dark:text-white'
          }`}>
            {caseData.case}
          </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
            ({caseData.year})
          </span>
            {caseData.important && (
                <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded font-medium">
              Key Case
            </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {caseData.citation}
          </p>
          <p className={`text-sm mt-2 ${
              caseData.important ? 'text-indigo-800 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            <strong>Holding:</strong> {caseData.holding}
          </p>
          {caseData.practicalApplication && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>How to use:</strong> {caseData.practicalApplication}
                </p>
              </div>
          )}
        </div>
      </div>
    </div>
);

/**
 * Documentation Tip Item
 */
const DocumentationTip = ({ tip, priority }) => {
  const priorityStyles = {
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-300',
      badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
    },
    high: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      text: 'text-orange-800 dark:text-orange-300',
      badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
    },
    medium: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
    }
  };

  const styles = priorityStyles[priority] || priorityStyles.medium;

  return (
      <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
        <div className="flex items-start gap-2">
          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${styles.icon}`} />
          <div className="flex-1">
            <p className={`text-sm ${styles.text}`}>{tip}</p>
          </div>
          {priority === 'critical' && (
              <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${styles.badge}`}>
            Critical
          </span>
          )}
        </div>
      </div>
  );
};

/**
 * Main Rating Enhancements Display Component
 */
const RatingEnhancementsDisplay = ({
                                     diagnosticCode,
                                     showDefinitions = true,
                                     showCaseLaw = true,
                                     showTips = true,
                                     showExamTips = true,
                                     defaultExpanded = false
                                   }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState('definitions');

  // Get enhancements data
  const enhancements = getEnhancementsForDC(diagnosticCode);

  if (!enhancements) {
    return null;
  }

  const hasDefinitions = enhancements.keyDefinitions && Object.keys(enhancements.keyDefinitions).length > 0;
  const hasCaseLaw = enhancements.caseLaw && enhancements.caseLaw.length > 0;
  const hasTips = enhancements.documentationTips && enhancements.documentationTips.length > 0;
  const hasExamTips = enhancements.examTips && enhancements.examTips.length > 0;

  // If no content available, don't render
  if (!hasDefinitions && !hasCaseLaw && !hasTips && !hasExamTips) {
    return null;
  }

  // Build available tabs
  const tabs = [];
  if (showDefinitions && hasDefinitions) tabs.push({ id: 'definitions', label: 'Definitions', icon: BookOpen });
  if (showCaseLaw && hasCaseLaw) tabs.push({ id: 'caseLaw', label: 'Case Law', icon: Scale });
  if (showTips && hasTips) tabs.push({ id: 'tips', label: 'Documentation', icon: FileText });
  if (showExamTips && hasExamTips) tabs.push({ id: 'examTips', label: 'Exam Tips', icon: Lightbulb });

  if (tabs.length === 0) return null;

  // Set default tab if current not available
  if (!tabs.find(t => t.id === activeTab)) {
    setActiveTab(tabs[0].id);
  }

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-gray-900 dark:text-white">
            Rating Enhancement Information
          </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
            (Definitions, Case Law, Tips)
          </span>
          </div>
          {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              activeTab === tab.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-3">
                {/* Definitions Tab */}
                {activeTab === 'definitions' && hasDefinitions && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Key terms as defined by the VA and BVA. Understanding these definitions is crucial for your claim.
                      </p>
                      {Object.values(enhancements.keyDefinitions).map((def, idx) => (
                          <DefinitionCard key={idx} {...def} />
                      ))}
                    </div>
                )}

                {/* Case Law Tab */}
                {activeTab === 'caseLaw' && hasCaseLaw && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Court decisions that may support your claim. These cases establish legal precedents.
                      </p>
                      {enhancements.caseLaw.map((caseData, idx) => (
                          <CaseLawCard key={idx} caseData={caseData} />
                      ))}
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          <span>
                      Full case opinions available at{' '}
                            <a
                                href="https://www.uscourts.cavc.gov/opinions.php"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                        CAVC Opinions
                      </a>
                    </span>
                        </div>
                      </div>
                    </div>
                )}

                {/* Documentation Tips Tab */}
                {activeTab === 'tips' && hasTips && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Evidence and documentation strategies to strengthen your claim.
                      </p>
                      {enhancements.documentationTips.map((tipData, idx) => (
                          <DocumentationTip
                              key={idx}
                              tip={typeof tipData === 'string' ? tipData : tipData.tip}
                              priority={typeof tipData === 'string' ? 'medium' : tipData.priority}
                          />
                      ))}
                    </div>
                )}

                {/* Exam Tips Tab */}
                {activeTab === 'examTips' && hasExamTips && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Prepare for your C&P exam with these tips.
                      </p>
                      {enhancements.examTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800 dark:text-green-300">{tip}</p>
                          </div>
                      ))}

                      {/* Common Mistakes Warning */}
                      {enhancements.commonMistakes && enhancements.commonMistakes.length > 0 && (
                          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <h5 className="font-medium text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Common Mistakes to Avoid
                            </h5>
                            <ul className="space-y-1">
                              {enhancements.commonMistakes.map((mistake, idx) => (
                                  <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    {mistake}
                                  </li>
                              ))}
                            </ul>
                          </div>
                      )}
                    </div>
                )}
              </div>

              {/* Rating Note (if exists) */}
              {enhancements.ratingNote && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Note:</strong> {enhancements.ratingNote}
                    </p>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default RatingEnhancementsDisplay;