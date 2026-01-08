// CPExamPrep.jsx - C&P Exam Preparation Checklist Component
// v2.1 Feature - Helps veterans prepare for Compensation & Pension exams

import React, { useState, useMemo } from 'react';
import { getSymptomLogs } from '../utils/storage';
import { getServiceConnectedConditions } from '../utils/profiles.js';
import { getConditionDescription } from '../data/conditionDescriptions';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * C&P Exam Preparation Checklist
 *
 * Generates personalized exam preparation based on:
 * - Service-connected conditions
 * - Logged symptoms
 * - VA rating criteria
 */
const CPExamPrep = ({ embedded = false, onClose }) => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [expandedCondition, setExpandedCondition] = useState(null);

  // Get user's conditions and symptoms
  const serviceConnectedConditions = useMemo(() => {
    return getServiceConnectedConditions() || [];
  }, []);

  const symptomLogs = useMemo(() => {
    return getSymptomLogs() || [];
  }, []);

  // Get unique conditions from logs (last 90 days)
  const recentConditions = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const conditionSet = new Set();
    symptomLogs
    .filter(log => new Date(log.timestamp) >= cutoff)
    .forEach(log => {
      if (log.conditionId) conditionSet.add(log.conditionId);
      if (log.symptomCategory) conditionSet.add(log.symptomCategory);
    });

    return Array.from(conditionSet);
  }, [symptomLogs]);

  // General exam tips that apply to everyone
  const generalTips = [
    {
      title: "Describe Your WORST Days",
      description: "The VA rates based on your worst symptoms, not your average. Don't minimize - describe how bad it gets on your worst days.",
      icon: "⚠️"
    },
    {
      title: "Be Specific with Examples",
      description: "Instead of 'I have trouble sleeping,' say 'I wake up 4-5 times per night with nightmares about 3 times per week.'",
      icon: "📝"
    },
    {
      title: "Don't Say 'I'm Fine'",
      description: "Veterans often minimize symptoms. If the examiner asks how you're doing, describe your actual symptoms, not social pleasantries.",
      icon: "🚫"
    },
    {
      title: "Mention Flare-Ups",
      description: "Tell the examiner about flare-ups even if you're not having one during the exam. Describe frequency, duration, and severity.",
      icon: "🔥"
    },
    {
      title: "Bring Documentation",
      description: "Bring copies of medical records, buddy statements, and your symptom logs. The examiner may not have your full file.",
      icon: "📁"
    },
    {
      title: "Arrive Early, Don't Rush",
      description: "Rushing can cause anxiety and make you forget important symptoms. Arrive 15 minutes early and take your time.",
      icon: "⏰"
    },
    {
      title: "It's Okay to Say 'I Don't Know'",
      description: "If you don't remember something, say so. Don't guess - it can hurt your credibility.",
      icon: "❓"
    },
    {
      title: "Request a Copy of the DBQ",
      description: "Ask for a copy of the Disability Benefits Questionnaire the examiner completes. Review it for accuracy.",
      icon: "📋"
    }
  ];

  // VA terminology glossary for exams
  const vaTerminology = [
    { term: "Prostrating", definition: "So severe you MUST stop all activity and lie down. Key term for migraines.", conditions: ["migraine", "headache"] },
    { term: "Incapacitating Episode", definition: "Requires bed rest prescribed by a physician. Key for back conditions, IBS.", conditions: ["back", "ibs", "spine"] },
    { term: "Flare-Up", definition: "Temporary worsening of symptoms beyond your baseline. Document frequency and duration.", conditions: ["all"] },
    { term: "Functional Impairment", definition: "How your condition limits daily activities - work, chores, self-care, relationships.", conditions: ["all"] },
    { term: "Occupational Impairment", definition: "How your condition affects your ability to work - missed days, reduced hours, job loss.", conditions: ["mental-health", "ptsd"] },
    { term: "Social Impairment", definition: "How your condition affects relationships - isolation, conflicts, inability to maintain friendships.", conditions: ["mental-health", "ptsd"] },
    { term: "Range of Motion", definition: "How far you can move a joint. Examiner will measure in degrees. Note pain during movement.", conditions: ["musculoskeletal", "joint"] },
    { term: "Painful Motion", definition: "Pain that occurs during movement - the VA must consider where pain begins, not just end range.", conditions: ["musculoskeletal"] },
    { term: "METs (Metabolic Equivalents)", definition: "Measure of exercise capacity for heart conditions. Lower METs = more severe.", conditions: ["cardiac", "heart"] },
    { term: "CPAP Compliance", definition: "Using your CPAP machine as prescribed. Bring compliance data to your exam.", conditions: ["sleep-apnea"] },
    { term: "Hypersomnolence", definition: "Excessive daytime sleepiness despite treatment. Key for sleep apnea ratings.", conditions: ["sleep-apnea"] },
    { term: "Analogous Rating", definition: "When your condition doesn't have its own code, VA rates it like a similar condition.", conditions: ["all"] },
  ];

  // Documents checklist
  const documentsTooBring = [
    { item: "Government-issued photo ID", required: true },
    { item: "VA appointment letter", required: true },
    { item: "List of all current medications with dosages", required: false },
    { item: "Copies of relevant medical records", required: false },
    { item: "Buddy/lay statements from family, friends, coworkers", required: false },
    { item: "Symptom log printout or export from this app", required: false },
    { item: "Work attendance records showing missed days", required: false },
    { item: "CPAP compliance data (if applicable)", required: false },
    { item: "List of all treating physicians with contact info", required: false },
    { item: "Service treatment records or DD-214", required: false },
    { item: "Previous C&P exam reports (if available)", required: false },
    { item: "Personal statement describing daily limitations", required: false },
  ];

  // Condition-specific prep based on logged conditions
  const getConditionPrepTips = (conditionId) => {
    const description = getConditionDescription(conditionId);

    // Default tips if no description found
    const defaultTips = {
      keyPoints: [
        "Describe your symptoms on your worst days",
        "Explain how this condition limits your daily activities",
        "Mention any treatments you've tried and their effectiveness",
        "Describe the frequency and duration of symptoms"
      ],
      examinerQuestions: [
        "When did your symptoms start?",
        "How often do you experience symptoms?",
        "What treatments have you tried?",
        "How does this affect your daily life and work?"
      ],
      terminology: []
    };

    if (!description) return defaultTips;

    return {
      keyPoints: description.documentationTips || defaultTips.keyPoints,
      examinerQuestions: generateExaminerQuestions(conditionId, description),
      terminology: description.keyTerms ? Object.entries(description.keyTerms).map(([term, def]) => ({ term, definition: def })) : [],
      evidenceLookingFor: description.evidenceLookingFor || []
    };
  };

  // Generate likely examiner questions based on condition
  const generateExaminerQuestions = (conditionId, description) => {
    const baseQuestions = [
      "When did you first notice these symptoms?",
      "How have your symptoms progressed over time?",
      "What treatments have you tried?",
      "How does this condition affect your daily activities?",
      "How does this condition affect your work?",
    ];

    const conditionSpecific = {
      'ptsd': [
        "Can you describe the traumatic event(s)?",
        "How often do you have nightmares or flashbacks?",
        "Do you avoid certain people, places, or situations?",
        "How are your relationships with family and friends?",
        "Have you had any suicidal thoughts?",
        "Do you have trouble controlling your anger?",
      ],
      'migraine': [
        "How many migraines do you have per month?",
        "How long does a typical migraine last?",
        "Do your migraines force you to lie down and stop activity?",
        "How many work days have you missed due to migraines?",
        "What medications do you take and do they help?",
      ],
      'sleep-apnea': [
        "Do you use a CPAP or BiPAP machine?",
        "How many hours per night do you use your device?",
        "Do you experience daytime sleepiness despite using your device?",
        "Have you ever fallen asleep while driving or at work?",
      ],
      'back': [
        "Can you bend forward and touch your toes?",
        "Do you have pain that radiates down your legs?",
        "How many incapacitating episodes have you had in the past year?",
        "Do you use any assistive devices?",
        "Does your back pain affect your ability to sit, stand, or walk?",
      ],
      'knee': [
        "Does your knee give way or feel unstable?",
        "Can you fully straighten and bend your knee?",
        "Do you have locking or catching in your knee?",
        "How far can you walk before knee pain stops you?",
      ],
      'tinnitus': [
        "Is the ringing constant or intermittent?",
        "Does tinnitus affect your sleep?",
        "Does tinnitus affect your ability to concentrate?",
        "Were you exposed to loud noise during military service?",
      ],
      'hearing-loss': [
        "Do you have difficulty understanding speech?",
        "Do you use hearing aids?",
        "Were you exposed to loud noise during service?",
        "Which ear is worse?",
      ],
      'diabetes': [
        "How do you manage your diabetes?",
        "Do you require insulin injections?",
        "How often do you check your blood sugar?",
        "Have you had to regulate your activities due to diabetes?",
        "Have you had any diabetic complications?",
      ],
      'hypertension': [
        "What is your typical blood pressure reading?",
        "What medications do you take for blood pressure?",
        "Have you had any complications from hypertension?",
      ],
      'ibs': [
        "How many bowel movements do you have per day?",
        "Do you have diarrhea, constipation, or alternating?",
        "How often do you have abdominal pain?",
        "Have you had any episodes severe enough to require bed rest?",
      ],
      'gerd': [
        "How often do you experience heartburn or reflux?",
        "Do you have difficulty swallowing?",
        "Have you had any weight loss due to GERD?",
        "Do you have symptoms at night that affect your sleep?",
      ],
    };

    // Find matching condition-specific questions
    const specificQuestions = [];
    Object.entries(conditionSpecific).forEach(([key, questions]) => {
      if (conditionId.toLowerCase().includes(key) || key.includes(conditionId.toLowerCase())) {
        specificQuestions.push(...questions);
      }
    });

    return [...specificQuestions, ...baseQuestions].slice(0, 8);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('C&P EXAM PREPARATION CHECKLIST', pageWidth / 2, currentY, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    currentY += 8;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
    doc.text('Doc Bear\'s Symptom Vault', pageWidth / 2, currentY + 5, { align: 'center' });

    currentY += 20;

    // General Tips Section
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('GENERAL EXAM TIPS', 14, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);

    generalTips.forEach((tip, index) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${tip.title}`, 14, currentY);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(tip.description, pageWidth - 28);
      doc.text(descLines, 14, currentY + 5);
      currentY += 5 + (descLines.length * 4) + 6;
    });

    // Documents Checklist
    doc.addPage();
    currentY = 20;

    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('DOCUMENTS TO BRING', 14, currentY);
    currentY += 8;

    const docData = documentsTooBring.map(d => [
      d.required ? '[ ] REQUIRED' : '[ ] Optional',
      d.item
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Check', 'Document']],
      body: docData,
      headStyles: { fillColor: [30, 58, 138], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 'auto' }
      },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 14, right: 14 },
      didParseCell: function(data) {
        // Highlight required items
        if (data.column.index === 0 && data.section === 'body') {
          if (data.cell.raw.includes('REQUIRED')) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [185, 28, 28]; // Red for required
          }
        }
      }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // VA Terminology
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('KEY VA TERMINOLOGY', 14, currentY);
    currentY += 8;

    const termData = vaTerminology.slice(0, 10).map(t => [t.term, t.definition]);

    autoTable(doc, {
      startY: currentY,
      head: [['Term', 'Definition']],
      body: termData,
      headStyles: { fillColor: [139, 69, 19], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      },
      alternateRowStyles: { fillColor: [254, 249, 243] },
      margin: { left: 14, right: 14 },
    });

    // Condition-specific pages
    const conditionsToInclude = serviceConnectedConditions.length > 0
        ? serviceConnectedConditions.map(c => c.conditionId || c.id)
        : recentConditions;

    if (conditionsToInclude.length > 0) {
      doc.addPage();
      currentY = 20;

      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138);
      doc.setFont(undefined, 'bold');
      doc.text('CONDITION-SPECIFIC PREPARATION', 14, currentY);
      currentY += 12;

      conditionsToInclude.slice(0, 5).forEach((conditionId, idx) => {
        if (currentY > 220) {
          doc.addPage();
          currentY = 20;
        }

        const prep = getConditionPrepTips(conditionId);
        const conditionName = conditionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');
        doc.text(`${idx + 1}. ${conditionName}`, 14, currentY);
        currentY += 7;

        // Questions examiner may ask
        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.setFont(undefined, 'bold');
        doc.text('Questions the examiner may ask:', 14, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 5;

        prep.examinerQuestions.slice(0, 5).forEach(q => {
          doc.text(`• ${q}`, 18, currentY);
          currentY += 5;
        });

        currentY += 8;
      });
    }

    // Disclaimer
    doc.addPage();
    currentY = 20;

    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(234, 179, 8);
    doc.rect(14, currentY, pageWidth - 28, 35, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(120, 53, 15);
    doc.setFont(undefined, 'bold');
    doc.text('IMPORTANT REMINDER', 20, currentY + 8);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);

    const reminderText = 'The C&P exam is YOUR opportunity to show the VA how your conditions affect your daily life. Be honest, be specific, and describe your WORST days. Don\'t minimize your symptoms - the examiner can only rate what you tell them and what they observe. This checklist is for preparation only and does not constitute legal or medical advice.';
    const reminderLines = doc.splitTextToSize(reminderText, pageWidth - 40);
    doc.text(reminderLines, 20, currentY + 15);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
          `C&P Exam Prep - Page ${i} of ${pageCount} - Doc Bear's Symptom Vault`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
      );
    }

    doc.save(`CP-Exam-Prep-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Render component
  return (
      <div className={`${embedded ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}`}>
        <div className={`${embedded ? '' : 'max-w-4xl mx-auto p-4'}`}>

          {/* Header - only show if not embedded */}
          {!embedded && (
              <div className="bg-blue-900 dark:bg-gray-800 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      📋 C&P Exam Preparation
                    </h1>
                    <p className="text-blue-200 dark:text-gray-400 mt-1">
                      Personalized checklist to help you prepare for your Compensation & Pension exam
                    </p>
                  </div>
                  {onClose && (
                      <button
                          onClick={onClose}
                          className="text-white hover:text-gray-200 text-2xl font-bold"
                      >
                        ×
                      </button>
                  )}
                </div>
              </div>
          )}

          {/* Export Button */}
          <div className={`bg-white dark:bg-gray-800 p-4 ${embedded ? '' : 'border-x border-gray-200 dark:border-gray-700'}`}>
            <button
                onClick={exportToPDF}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              📄 Export Checklist to PDF
            </button>
          </div>

          {/* Tab Navigation - Mobile Optimized */}
          <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${embedded ? '' : 'border-x'}`}>
            <div className="grid grid-cols-4 gap-1 p-1">
              {[
                { id: 'checklist', label: 'Checklist', icon: '✅' },
                { id: 'tips', label: 'Tips', icon: '💡' },
                { id: 'terminology', label: 'Terms', icon: '📖' },
                { id: 'conditions', label: 'Conditions', icon: '🎯' },
              ].map(tab => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                          activeTab === tab.id
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                      }`}
                  >
                    <span className="text-lg mb-0.5">{tab.icon}</span>
                    <span className="truncate w-full text-center">{tab.label}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className={`bg-white dark:bg-gray-800 p-4 ${embedded ? '' : 'border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg'}`}>

            {/* Checklist Tab */}
            {activeTab === 'checklist' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      📁 Documents to Bring
                    </h3>
                    <div className="space-y-2 text-left">
                      {documentsTooBring.map((doc, idx) => (
                          <label key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 rounded" />
                            <div>
                        <span className={`${doc.required ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {doc.item}
                        </span>
                              {doc.required && (
                                  <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                            REQUIRED
                          </span>
                              )}
                            </div>
                          </label>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reminder Box */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Day-Of Reminders</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 text-left">
                      <li>• Arrive 15 minutes early</li>
                      <li>• Describe your WORST days, not average days</li>
                      <li>• Don't minimize - be honest about limitations</li>
                      <li>• Mention flare-ups even if not having one today</li>
                      <li>• Ask for a copy of the completed DBQ</li>
                    </ul>
                  </div>


            {/* After Action Report */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200">After Your Exam</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Document your exam experience immediately after while details are fresh.
              </p>
              <button
              onClick={() => onNavigate && onNavigate('after-action-report')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Create After Action Report
          </button>
        </div>
                </div>
            )}

            {/* Tips Tab */}
            {activeTab === 'tips' && (
                <div className="space-y-4 text-left">
                  {generalTips.map((tip, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="text-xl">{tip.icon}</span>
                          {tip.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{tip.description}</p>
                      </div>
                  ))}
                </div>
            )}

            {/* Terminology Tab */}
            {activeTab === 'terminology' && (
                <div className="space-y-3 text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Using the right VA terminology can help ensure your symptoms are properly documented. Here are key terms to know:
                  </p>
                  {vaTerminology.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300">{item.term}</h4>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{item.definition}</p>
                      </div>
                  ))}
                </div>
            )}

            {/* Conditions Tab */}
            {activeTab === 'conditions' && (
                <div className="space-y-4">
                  {serviceConnectedConditions.length === 0 && recentConditions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No conditions found.</p>
                        <p className="text-sm mt-2">Add service-connected conditions or log symptoms to see personalized prep tips.</p>
                      </div>
                  ) : (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Click on a condition to see exam preparation tips specific to that condition.
                        </p>

                        {/* Service-connected conditions */}
                        {serviceConnectedConditions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                Service-Connected Conditions
                              </h4>
                              {serviceConnectedConditions.map((condition, idx) => {
                                const conditionId = condition.conditionId || condition.id;
                                const prep = getConditionPrepTips(conditionId);
                                const isExpanded = expandedCondition === conditionId;

                                return (
                                    <div key={idx} className="mb-2">
                                      <button
                                          onClick={() => setExpandedCondition(isExpanded ? null : conditionId)}
                                          className="w-full text-left bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg p-4 transition-colors"
                                      >
                                        <div className="flex items-center justify-between">
                                <span className="font-semibold text-blue-900 dark:text-blue-200">
                                  {condition.conditionName || conditionId.replace(/-/g, ' ')}
                                </span>
                                          <span className="text-blue-600 dark:text-blue-400">
                                  {isExpanded ? '▼' : '▶'}
                                </span>
                                        </div>
                                        {condition.currentRating && (
                                            <span className="text-sm text-blue-600 dark:text-blue-400">
                                  Current Rating: {condition.currentRating}%
                                </span>
                                        )}
                                      </button>

                                      {isExpanded && (
                                          <div className="mt-2 ml-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            {/* Examiner Questions */}
                                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                              Questions the Examiner May Ask:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                                              {prep.examinerQuestions.map((q, qIdx) => (
                                                  <li key={qIdx}>{q}</li>
                                              ))}
                                            </ul>

                                            {/* Key Points */}
                                            {prep.keyPoints && prep.keyPoints.length > 0 && (
                                                <>
                                                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Documentation Tips:
                                                  </h5>
                                                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                                                    {prep.keyPoints.slice(0, 5).map((point, pIdx) => (
                                                        <li key={pIdx}>{point}</li>
                                                    ))}
                                                  </ul>
                                                </>
                                            )}

                                            {/* Terminology */}
                                            {prep.terminology && prep.terminology.length > 0 && (
                                                <>
                                                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Key Terms to Use:
                                                  </h5>
                                                  <div className="space-y-2">
                                                    {prep.terminology.map((t, tIdx) => (
                                                        <div key={tIdx} className="text-sm">
                                                          <span className="font-semibold text-blue-700 dark:text-blue-400">{t.term}:</span>
                                                          <span className="text-gray-600 dark:text-gray-400 ml-1">{t.definition}</span>
                                                        </div>
                                                    ))}
                                                  </div>
                                                </>
                                            )}
                                          </div>
                                      )}
                                    </div>
                                );
                              })}
                            </div>
                        )}

                        {/* Recent conditions from logs */}
                        {recentConditions.length > 0 && serviceConnectedConditions.length === 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                Recently Logged Conditions
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Based on your symptom logs from the last 90 days
                              </p>
                              {recentConditions.slice(0, 10).map((conditionId, idx) => (
                                  <div key={idx} className="mb-2">
                                    <button
                                        onClick={() => setExpandedCondition(expandedCondition === conditionId ? null : conditionId)}
                                        className="w-full text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg p-4 transition-colors"
                                    >
                                      <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {conditionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                                        <span className="text-gray-400">
                                {expandedCondition === conditionId ? '▼' : '▶'}
                              </span>
                                      </div>
                                    </button>

                                    {expandedCondition === conditionId && (
                                        <div className="mt-2 ml-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                          {(() => {
                                            const prep = getConditionPrepTips(conditionId);
                                            return (
                                                <>
                                                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Questions the Examiner May Ask:
                                                  </h5>
                                                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                                    {prep.examinerQuestions.map((q, qIdx) => (
                                                        <li key={qIdx}>{q}</li>
                                                    ))}
                                                  </ul>
                                                </>
                                            );
                                          })()}
                                        </div>
                                    )}
                                  </div>
                              ))}
                            </div>
                        )}
                      </>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CPExamPrep;