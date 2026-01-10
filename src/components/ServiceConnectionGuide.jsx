/**
 * ServiceConnectionGuide.jsx
 *
 * Educational component explaining the five ways to establish service connection
 * for VA disability claims. Helps veterans understand how to connect their
 * current disabilities to their military service.
 */

import React, { useState } from 'react';
import {
  Target,
  FileText,
  TrendingUp,
  Link2,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Scale,
  BookOpen
} from 'lucide-react';

// Import data
import {
  SERVICE_CONNECTION_METHODS,
  SERVICE_CONNECTION_STANDARDS,
  CLAIMS_RESOURCES
} from '../data/serviceConnectionMethods';

const ServiceConnectionGuide = () => {
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [showStandards, setShowStandards] = useState(false);
  const [showResources, setShowResources] = useState(false);

  // Icons for each method
  const methodIcons = {
    direct: Target,
    presumptive: FileText,
    aggravation: TrendingUp,
    secondary: Link2,
    section1151: Building2
  };

  // Colors for each method
  const methodColors = {
    direct: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    presumptive: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    },
    aggravation: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      icon: 'text-orange-600 dark:text-orange-400'
    },
    secondary: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    section1151: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400'
    }
  };

  const toggleMethod = (methodId) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Establishing Service Connection</h2>
          </div>
          <p className="text-blue-100 dark:text-blue-200">
            Understanding how to connect your current disability to military service is the first step in any VA claim.
            There are five recognized methods to establish this connection.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {SERVICE_CONNECTION_METHODS.map((method) => {
              const colors = methodColors[method.id];
              return (
                  <button
                      key={method.id}
                      onClick={() => toggleMethod(method.id)}
                      className={`p-3 rounded-lg ${colors.bg} ${colors.border} border text-center hover:opacity-90 transition-opacity`}
                  >
                    <div className={`font-bold text-lg ${colors.text}`}>{method.number}</div>
                    <div className={`text-xs ${colors.text}`}>{method.shortName}</div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* Five Methods - Expandable Cards */}
        <div className="space-y-3">
          {SERVICE_CONNECTION_METHODS.map((method) => {
            const Icon = methodIcons[method.id];
            const colors = methodColors[method.id];
            const isExpanded = expandedMethod === method.id;

            return (
                <div
                    key={method.id}
                    className={`rounded-lg border overflow-hidden ${colors.border} ${isExpanded ? colors.bg : 'bg-white dark:bg-gray-800'}`}
                >
                  {/* Header - Always Visible */}
                  <button
                      onClick={() => toggleMethod(method.id)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${colors.text}`}>#{method.number}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{method.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                      <div className="px-4 pb-4 space-y-4">
                        {/* Legal Basis */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                          Legal Basis: {method.legalBasis}
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Requirements
                          </h4>
                          <ul className="space-y-1">
                            {method.requirements.map((req, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 text-left">
                                  <span className="text-green-600">✓</span>
                                  {req}
                                </li>
                            ))}
                          </ul>
                        </div>

                        {/* Special Content by Method Type */}
                        {method.id === 'presumptive' && method.categories && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Presumptive Categories</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                                {method.categories.slice(0, 6).map((cat, idx) => (
                                    <div key={idx} className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                      <div className="font-medium text-gray-900 dark:text-white">{cat.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{cat.period}</div>
                                    </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                See the Presumptive Conditions Guide for complete lists.
                              </p>
                            </div>
                        )}

                        {method.id === 'secondary' && method.commonExamples && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Common Examples</h4>
                              <div className="space-y-2 text-left">
                                {method.commonExamples.slice(0, 3).map((ex, idx) => (
                                    <div key={idx} className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                      <div className="font-medium text-purple-700 dark:text-purple-300">{ex.primary}</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400">
                                        → {ex.secondaries.slice(0, 3).join(', ')}...
                                      </div>
                                    </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                See the Secondary Conditions Guide for complete mappings.
                              </p>
                            </div>
                        )}

                        {method.id === 'section1151' && method.proximateCauseOptions && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Proximate Cause Options</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                                {method.proximateCauseOptions.map((option, idx) => (
                                    <div key={idx} className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                      <div className="font-medium text-red-700 dark:text-red-300">{option.type}</div>
                                      {option.elements ? (
                                          <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {option.elements.slice(0, 3).map((el, i) => (
                                                <li key={i}>• {el}</li>
                                            ))}
                                          </ul>
                                      ) : (
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option.explanation}</p>
                                      )}
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}

                        {/* Examples */}
                        {method.examples && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Examples</h4>
                              <div className="space-y-2">
                                {method.examples.slice(0, 2).map((ex, idx) => (
                                    <div key={idx} className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                      <div className="font-medium text-gray-900 dark:text-white">{ex.scenario}</div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{ex.details}</p>
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}

                        {/* Evidence Needed */}
                        {method.evidenceNeeded && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Evidence Needed
                              </h4>
                              <ul className="space-y-1">
                                {method.evidenceNeeded.map((evidence, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 text-left">
                                      <span className="text-blue-600">•</span>
                                      {evidence}
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}

                        {/* Tips */}
                        {method.tips && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Pro Tips
                              </h4>
                              <ul className="space-y-1 text-left">
                                {method.tips.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                                      <span>💡</span>
                                      {tip}
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}

                        {/* Active Duty Note */}
                        {method.activedutyNote && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Active Duty Note:</strong> {method.activedutyNote}
                              </p>
                            </div>
                        )}
                      </div>
                  )}
                </div>
            );
          })}
        </div>

        {/* Legal Standards Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
              onClick={() => setShowStandards(!showStandards)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Key Legal Standards</span>
            </div>
            {showStandards ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showStandards && (
              <div className="px-4 pb-4 space-y-4">
                {/* Benefit of the Doubt - WITH WARNING */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {SERVICE_CONNECTION_STANDARDS.benefitOfTheDoubt.name}
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    {SERVICE_CONNECTION_STANDARDS.benefitOfTheDoubt.explanation}
                  </p>

                  {/* Bufkin Warning */}
                  <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      ⚠️ CRITICAL UPDATE - Bufkin v. Collins (Supreme Court, March 2025)
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {SERVICE_CONNECTION_STANDARDS.benefitOfTheDoubt.warning}
                    </p>
                  </div>

                  {/* Practical Tip */}
                  <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>What This Means For You:</strong> {SERVICE_CONNECTION_STANDARDS.benefitOfTheDoubt.practicalTip}
                    </p>
                  </div>

                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    {SERVICE_CONNECTION_STANDARDS.benefitOfTheDoubt.citation}
                  </p>
                </div>

                {/* Three Elements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">{SERVICE_CONNECTION_STANDARDS.threeElements.name}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">{SERVICE_CONNECTION_STANDARDS.threeElements.citation}</p>
                  <ol className="space-y-1 text-left">
                    {SERVICE_CONNECTION_STANDARDS.threeElements.elements.map((el, idx) => (
                        <li key={idx} className="text-sm text-blue-700 dark:text-blue-300">
                          {idx + 1}. {el}
                        </li>
                    ))}
                  </ol>
                </div>

                {/* Nexus */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">{SERVICE_CONNECTION_STANDARDS.nexus.name}</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">{SERVICE_CONNECTION_STANDARDS.nexus.explanation}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    <strong>Standard:</strong> {SERVICE_CONNECTION_STANDARDS.nexus.standard}
                  </p>
                </div>
              </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
              onClick={() => setShowResources(!showResources)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold text-gray-900 dark:text-white">Get Help With Your Claim</span>
            </div>
            {showResources ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showResources && (
              <div className="px-4 pb-4 space-y-4">
                {/* Representatives */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Free Representation</h4>
                  <div className="space-y-2 text-left">
                    {CLAIMS_RESOURCES.representatives.map((rep, idx) => (
                        <a
                            key={idx}
                            href={rep.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{rep.type}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{rep.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </a>
                    ))}
                  </div>
                </div>

                {/* Legal Resources */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Legal Research</h4>
                  <div className="space-y-2 text-left">
                    {CLAIMS_RESOURCES.legalResources.map((res, idx) => (
                        <a
                            key={idx}
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{res.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{res.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </a>
                    ))}
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice.
            Service connection determinations are made by the VA based on the complete evidence of record.
            Consider consulting with a VA-accredited representative for assistance with your specific claim.
          </p>
        </div>
      </div>
  );
};

export default ServiceConnectionGuide;