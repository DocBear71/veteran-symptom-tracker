// CPResources.jsx - C&P Exam Resources Hub
// Combines all C&P exam tools in one place
// Designed to be embedded in Trends.jsx as a third tab

import React, { useState } from 'react';
import CPExamPrep from './CPExamPrep';
import AfterActionReport from './AfterActionReport';
import BuddyStatementGenerator from './BuddyStatementGenerator';

const CPResources = () => {
  const [activeResource, setActiveResource] = useState(null);

  // Resource cards configuration
  const resources = [
    {
      id: 'exam-prep',
      title: 'C&P Exam Prep Checklist',
      description: 'Prepare for your Compensation & Pension exam with personalized checklists, tips, and key VA terminology.',
      icon: '📋',
      color: 'blue',
      features: ['Documents checklist', 'Exam tips', 'VA terminology', 'Condition-specific prep'],
    },
    {
      id: 'after-action',
      title: 'Post-Exam After Action Report',
      description: 'Document your exam experience immediately after while details are fresh. Identify potential issues for appeals.',
      icon: '📝',
      color: 'green',
      features: ['Exam details', 'Questions asked', 'Issues identified', 'PDF export'],
    },
    {
      id: 'buddy-statement',
      title: 'Buddy Statement Generator',
      description: 'Create professional lay statements from family, friends, or coworkers to support your VA disability claim.',
      icon: '👥',
      color: 'purple',
      features: ['Guided templates', 'Condition-specific observations', 'Multiple export formats', 'Save drafts'],
    },
  ];

  // Color mapping for cards
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      hoverBorder: 'hover:border-blue-500 dark:hover:border-blue-500',
      icon: 'bg-blue-100 dark:bg-blue-900',
      iconText: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      hoverBorder: 'hover:border-green-500 dark:hover:border-green-500',
      icon: 'bg-green-100 dark:bg-green-900',
      iconText: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-500',
      icon: 'bg-purple-100 dark:bg-purple-900',
      iconText: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    },
  };

  // Render the selected resource component
  const renderActiveResource = () => {
    switch (activeResource) {
      case 'exam-prep':
        return <CPExamPrep embedded={true} onClose={() => setActiveResource(null)} />;
      case 'after-action':
        return <AfterActionReport embedded={true} onClose={() => setActiveResource(null)} />;
      case 'buddy-statement':
        return <BuddyStatementGenerator embedded={true} onClose={() => setActiveResource(null)} />;
      default:
        return null;
    }
  };

  // If a resource is active, show it full-screen style
  if (activeResource) {
    return (
        <div className="space-y-4">
          {/* Back Button */}
          <button
              onClick={() => setActiveResource(null)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <span>←</span>
            <span>Back to C&P Resources</span>
          </button>

          {/* Active Resource Component */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {renderActiveResource()}
          </div>
        </div>
    );
  }

  // Main resource selection view
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🎖️</span>
            C&P Exam Resources
          </h2>
          <p className="text-blue-100 dark:text-gray-300 mt-2 text-left">
            Tools to help you prepare for, document, and support your VA Compensation & Pension claim process.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-left">Tip: Use These Tools Together</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 text-left">
                <strong>Before your exam:</strong> Use the Prep Checklist to prepare.<br/>
                <strong> After your exam:</strong> Complete the After Action Report while details are fresh.<br/>
                <strong> Anytime:</strong> Generate Buddy Statements from family and friends to strengthen your claim.
              </p>
            </div>
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(resource => {
            const colors = colorClasses[resource.color];

            return (
                <button
                    key={resource.id}
                    onClick={() => setActiveResource(resource.id)}
                    className={`text-left p-5 rounded-lg border-2 transition-all ${colors.bg} ${colors.border} ${colors.hoverBorder} hover:shadow-lg`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{resource.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {resource.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {resource.features.map((feature, idx) => (
                        <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}
                        >
                    {feature}
                  </span>
                    ))}
                  </div>

                  {/* Open Indicator */}
                  <div className={`mt-4 text-sm font-medium ${colors.iconText} flex items-center gap-1`}>
                    <span>Open Tool</span>
                    <span>→</span>
                  </div>
                </button>
            );
          })}
        </div>

        {/* Additional Resources Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📚</span>
            Additional C&P Resources
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VA Terms Quick Reference */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">VA Terms & Definitions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Quick reference for VA terminology, acronyms, and frequently asked questions.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Access via footer → "VA Terms & FAQ"
              </p>
            </div>

            {/* MOS Noise Exposure */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">MOS Noise Exposure Lookup</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Find your military occupational specialty's noise exposure probability rating.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Access via footer → "MOS Noise Lookup"
              </p>
            </div>

            {/* Presumptive Conditions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Presumptive Conditions Guide</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Learn about conditions presumed service-connected based on service era or location.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Access via footer → "Presumptive Conditions"
              </p>
            </div>

            {/* Secondary Conditions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Secondary Conditions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Explore conditions that may be secondary to your service-connected disabilities.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Access via Settings → Service-Connected Conditions
              </p>
            </div>
          </div>
        </div>

        {/* C&P Exam Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📅</span>
            C&P Exam Timeline
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"></div>

            {/* Timeline Items */}
            <div className="space-y-6 pl-10">
              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Claim Filed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">VA receives and processes your claim</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Exam Scheduled</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">VA or contractor (QTC, VES, LHI) contacts you to schedule</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">★</div>
                <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Use Exam Prep Checklist</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prepare documents, review tips, know what to expect</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Attend C&P Exam</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Describe your worst days, be specific, don't minimize</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">★</div>
                <h4 className="font-medium text-green-700 dark:text-green-300">Complete After Action Report</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Document exam details immediately while fresh in memory</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Rating Decision</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">VA issues decision letter with rating percentage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CPResources;