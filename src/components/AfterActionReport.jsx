// AfterActionReport.jsx - Post C&P Exam After Action Report
// v2.1 Feature - Document exam details immediately after for records/appeals
// Updated with collapsible sections

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Storage key for saved reports
const STORAGE_KEY = 'cp-exam-reports';

const getSavedReports = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveReports = (reports) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Error saving reports:', e);
  }
};

// Collapsible Section Component
const CollapsibleSection = ({ title, number, isExpanded, onToggle, children, variant = 'default' }) => {
  const bgColor = variant === 'warning' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900';
  const textColor = variant === 'warning' ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300';

  return (
      <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className={`${bgColor} ${textColor} px-2 py-1 rounded text-sm`}>{number}</span>
            {title}
          </h3>
          <span className={`text-gray-500 dark:text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isExpanded && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">{children}</div>
        )}
      </section>
  );
};

// Collapsible Category Component
const CollapsibleCategory = ({ title, isExpanded, onToggle, children }) => (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden mb-2">
      <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        <span className={`text-gray-400 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isExpanded && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-600">{children}</div>
      )}
    </div>
);

const AfterActionReport = ({ embedded = false, onClose }) => {
  const [activeView, setActiveView] = useState('new');
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [expandedSections, setExpandedSections] = useState({
    examDetails: true,
    testsPerformed: false,
    questionsAsked: false,
    examinerBehavior: false,
    potentialIssues: false,
    topicsNotCovered: false,
    dutyToAssist: false,
    personalNotes: false,
    followUp: false,
  });

  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      // If clicking on already open section, just close it
      if (prev[section]) {
        return { ...prev, [section]: false };
      }
      // Otherwise, close all sections and open the clicked one
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      return { ...allClosed, [section]: true };
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      // If clicking on already open category, just close it
      if (prev[category]) {
        return { ...prev, [category]: false };
      }
      // Otherwise, close all categories and open the clicked one
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      return { ...allClosed, [category]: true };
    });
  };
  const expandAllSections = () => setExpandedSections(Object.fromEntries(Object.keys(expandedSections).map(k => [k, true])));
  const collapseAllSections = () => setExpandedSections(Object.fromEntries(Object.keys(expandedSections).map(k => [k, false])));

  const [formData, setFormData] = useState({
    examDate: new Date().toISOString().split('T')[0],
    examTime: '',
    examDuration: '',
    examLocation: '',
    examType: 'in-person',
    examinerName: '',
    examinerTitle: '',
    conditionsExamined: '',
    questionsAsked: [],
    testsPerformed: [],
    topicsNotCovered: '',
    examinerBehavior: {
      professional: null,
      thorough: null,
      rushedFeeling: null,
      listenedCarefully: null,
      reviewedRecords: null,
      askedAboutWorstDays: null,
    },
    potentialIssues: [],
    dutyToAssistConcerns: '',
    personalNotes: '',
    requestedDBQCopy: false,
    examinerProvidedInfo: false,
  });

  useEffect(() => { setSavedReports(getSavedReports()); }, []);

  const commonQuestions = {
    'Mental Health': [
      'When did symptoms start?', 'Describe your worst days', 'How do symptoms affect work?',
      'How do symptoms affect relationships?', 'Any suicidal thoughts?', 'Current medications and effectiveness?',
      'Frequency of therapy/treatment?', 'Sleep quality and nightmares?', 'Anger or irritability issues?', 'Avoidance behaviors?',
    ],
    'Musculoskeletal': [
      'Range of motion measured?', 'Pain level during movement?', 'Flare-up frequency and severity?',
      'Use of assistive devices?', 'Impact on daily activities?', 'Incapacitating episodes?',
      'Repetitive motion testing?', 'Pain on weight bearing?', 'Muscle strength testing?', 'Joint stability testing?',
    ],
    'Respiratory': [
      'Breathing tests performed (PFT/spirometry)?', 'CPAP/BiPAP usage discussed?', 'Daytime sleepiness level?',
      'Frequency of attacks/episodes?', 'Medication requirements?', 'Impact on physical activity?',
      'Oxygen requirements?', 'Sleep study results reviewed?',
    ],
    'Cardiovascular': [
      'Blood pressure taken?', 'METs level discussed?', 'Exercise tolerance?', 'Chest pain frequency?',
      'Shortness of breath triggers?', 'Medication review?', 'Recent cardiac testing reviewed?', 'Edema or swelling noted?',
    ],
    'Neurological': [
      'Sensory testing performed?', 'Motor function tested?', 'Reflex testing?', 'Coordination assessment?',
      'Headache frequency/severity?', 'Seizure history discussed?', 'Cognitive testing?', 'Balance testing?',
    ],
    'General': [
      'Service connection discussed?', 'Current treatment reviewed?', 'Medication list reviewed?',
      'Daily limitations discussed?', 'Work impact discussed?', 'Flare-ups mentioned?',
      'Worst day description requested?', 'Medical records reviewed?',
    ],
  };

  const possibleTests = [
    { id: 'rom', label: 'Range of Motion Measurement' },
    { id: 'xray', label: 'X-Ray Ordered/Reviewed' },
    { id: 'mri', label: 'MRI Ordered/Reviewed' },
    { id: 'blood-pressure', label: 'Blood Pressure Taken' },
    { id: 'pft', label: 'Pulmonary Function Test (PFT)' },
    { id: 'strength', label: 'Muscle Strength Testing' },
    { id: 'sensory', label: 'Sensory/Nerve Testing' },
    { id: 'reflex', label: 'Reflex Testing' },
    { id: 'cognitive', label: 'Cognitive/Memory Testing' },
    { id: 'psychological', label: 'Psychological Questionnaire' },
    { id: 'hearing', label: 'Hearing Test (Audiogram)' },
    { id: 'vision', label: 'Vision Testing' },
    { id: 'gait', label: 'Gait/Walking Assessment' },
    { id: 'balance', label: 'Balance Testing' },
    { id: 'skin', label: 'Skin Examination' },
    { id: 'none', label: 'No Physical Tests Performed' },
  ];

  const potentialIssueOptions = [
    { id: 'too-short', label: 'Exam felt too short/rushed' },
    { id: 'no-records', label: "Examiner didn't review my records" },
    { id: 'no-worst-day', label: 'Never asked about my worst days' },
    { id: 'no-flareups', label: "Didn't ask about flare-ups" },
    { id: 'incomplete-rom', label: 'Incomplete range of motion testing' },
    { id: 'no-repetitive', label: 'No repetitive motion testing (required for joints)' },
    { id: 'wrong-condition', label: 'Examiner confused about which condition' },
    { id: 'dismissive', label: 'Examiner was dismissive of symptoms' },
    { id: 'no-secondary', label: "Didn't discuss secondary conditions" },
    { id: 'telehealth-physical', label: 'Telehealth for condition requiring physical exam' },
    { id: 'different-examiner', label: 'Different examiner than specialty required' },
    { id: 'no-questions', label: 'Examiner asked very few questions' },
  ];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleBehaviorChange = (field, value) => setFormData(prev => ({
    ...prev, examinerBehavior: { ...prev.examinerBehavior, [field]: value }
  }));
  const handleCheckboxArray = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      return { ...prev, [field]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  const saveReport = () => {
    const report = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...formData };
    const updated = [report, ...savedReports];
    setSavedReports(updated);
    saveReports(updated);
    alert('Report saved successfully!');
    setActiveView('saved');
  };

  const deleteReport = (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      const updated = savedReports.filter(r => r.id !== id);
      setSavedReports(updated);
      saveReports(updated);
      setSelectedReport(null);
    }
  };

  const exportToPDF = (report = formData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('C&P EXAM AFTER ACTION REPORT', pageWidth / 2, currentY, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    currentY += 7;
    doc.text('CONFIDENTIAL - For Personal Records', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('EXAM DETAILS', 14, currentY);
    currentY += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);

    const examDetails = [
      ['Date:', report.examDate || 'Not specified'],
      ['Time:', report.examTime || 'Not specified'],
      ['Duration:', report.examDuration || 'Not specified'],
      ['Location:', report.examLocation || 'Not specified'],
      ['Type:', report.examType === 'in-person' ? 'In-Person' : report.examType === 'telehealth' ? 'Telehealth' : 'ACE Review'],
      ['Examiner:', report.examinerName || 'Not specified'],
      ['Title:', report.examinerTitle || 'Not specified'],
      ['Conditions:', report.conditionsExamined || 'Not specified'],
    ];

    examDetails.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 14, currentY);
      doc.setFont(undefined, 'normal');
      doc.text(value, 50, currentY);
      currentY += 6;
    });
    currentY += 8;

    if (report.testsPerformed?.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.setFont(undefined, 'bold');
      doc.text('TESTS PERFORMED', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      report.testsPerformed.forEach(testId => {
        const test = possibleTests.find(t => t.id === testId);
        if (test) { doc.text(`[X] ${test.label}`, 14, currentY); currentY += 5; }
      });
      currentY += 8;
    }

    if (report.questionsAsked?.length > 0) {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.setFont(undefined, 'bold');
      doc.text('QUESTIONS ASKED BY EXAMINER', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      report.questionsAsked.forEach(q => {
        if (currentY > 270) { doc.addPage(); currentY = 20; }
        const lines = doc.splitTextToSize(`[X] ${q}`, pageWidth - 28);
        doc.text(lines, 14, currentY);
        currentY += lines.length * 4 + 2;
      });
      currentY += 8;
    }

    doc.addPage();
    currentY = 20;
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('EXAMINER BEHAVIOR ASSESSMENT', 14, currentY);
    currentY += 8;

    const behaviorLabels = {
      professional: 'Professional and courteous',
      thorough: 'Thorough examination',
      rushedFeeling: 'Felt rushed',
      listenedCarefully: 'Listened carefully',
      reviewedRecords: 'Reviewed my medical records',
      askedAboutWorstDays: 'Asked about my worst days',
    };

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    Object.entries(report.examinerBehavior || {}).forEach(([key, value]) => {
      const label = behaviorLabels[key] || key;
      const answer = value === true ? 'Yes' : value === false ? 'No' : 'Not answered';
      doc.text(`${label}: ${answer}`, 14, currentY);
      currentY += 6;
    });
    currentY += 10;

    if (report.potentialIssues?.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(185, 28, 28);
      doc.setFont(undefined, 'bold');
      doc.text('POTENTIAL ISSUES IDENTIFIED', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      report.potentialIssues.forEach(issueId => {
        const issue = potentialIssueOptions.find(i => i.id === issueId);
        if (issue) { doc.text(`[!] ${issue.label}`, 14, currentY); currentY += 5; }
      });
      currentY += 8;
    }

    if (report.topicsNotCovered) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.setFont(undefined, 'bold');
      doc.text('TOPICS NOT COVERED', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(report.topicsNotCovered, pageWidth - 28);
      doc.text(lines, 14, currentY);
      currentY += lines.length * 4 + 8;
    }

    if (report.dutyToAssistConcerns) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(185, 28, 28);
      doc.setFont(undefined, 'bold');
      doc.text('DUTY TO ASSIST CONCERNS', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(report.dutyToAssistConcerns, pageWidth - 28);
      doc.text(lines, 14, currentY);
      currentY += lines.length * 4 + 8;
    }

    if (report.personalNotes) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.setFont(undefined, 'bold');
      doc.text('PERSONAL NOTES', 14, currentY);
      currentY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(report.personalNotes, pageWidth - 28);
      doc.text(lines, 14, currentY);
    }

    doc.addPage();
    currentY = 20;
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(234, 179, 8);
    doc.rect(14, currentY, pageWidth - 28, 40, 'FD');
    doc.setFontSize(10);
    doc.setTextColor(120, 53, 15);
    doc.setFont(undefined, 'bold');
    doc.text('IMPORTANT', 20, currentY + 8);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    const disclaimer = 'This After Action Report is for your personal records. If you believe your exam was inadequate or that duty-to-assist requirements were not met, consider: (1) Requesting a copy of the DBQ from VA, (2) Filing a Notice of Disagreement if you receive an unfavorable decision, (3) Consulting with a Veterans Service Organization (VSO) or VA-accredited attorney.';
    const lines = doc.splitTextToSize(disclaimer, pageWidth - 40);
    doc.text(lines, 20, currentY + 15);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`C&P Exam Report - Page ${i} of ${pageCount} - ${new Date().toLocaleDateString()}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`CP-Exam-Report-${report.examDate || new Date().toISOString().split('T')[0]}.pdf`);
  };

  const YesNoButtons = ({ field, value }) => (
      <div className="flex gap-2">
        <button type="button" onClick={() => handleBehaviorChange(field, true)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${value === true ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100'}`}>Yes</button>
        <button type="button" onClick={() => handleBehaviorChange(field, false)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${value === false ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100'}`}>No</button>
      </div>
  );

  return (
      <div className={`${embedded ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}`}>
        <div className={`${embedded ? '' : 'max-w-4xl mx-auto p-4'}`}>

          {!embedded && (
              <div className="bg-blue-900 dark:bg-gray-800 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">C&P Exam After Action Report</h1>
                    <p className="text-blue-200 dark:text-gray-400 mt-1">Document your exam experience while details are fresh</p>
                  </div>
                  {onClose && <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">×</button>}
                </div>
              </div>
          )}

          <div className={`bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 ${embedded ? '' : 'border-x'}`}>
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => { setActiveView('new'); setSelectedReport(null); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>+ New Report</button>
                <button onClick={() => setActiveView('saved')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'saved' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Saved ({savedReports.length})</button>
              </div>
              {activeView === 'new' && (
                  <div className="flex gap-2 text-sm">
                    <button onClick={expandAllSections} className="text-blue-600 dark:text-blue-400 hover:underline">Expand All</button>
                    <span className="text-gray-400">|</span>
                    <button onClick={collapseAllSections} className="text-blue-600 dark:text-blue-400 hover:underline">Collapse All</button>
                  </div>
              )}
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-800 p-4 ${embedded ? '' : 'border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg'}`}>

            {activeView === 'new' && (
                <div className="space-y-4">

                  <CollapsibleSection title="Exam Details" number="1" isExpanded={expandedSections.examDetails} onToggle={() => toggleSection('examDetails')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Date *</label>
                        <input type="date" value={formData.examDate} onChange={(e) => handleChange('examDate', e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Time</label>
                        <input type="time" value={formData.examTime} onChange={(e) => handleChange('examTime', e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                        <select value={formData.examDuration} onChange={(e) => handleChange('examDuration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Select duration</option>
                          <option value="less-than-15">Less than 15 minutes</option>
                          <option value="15-30">15-30 minutes</option>
                          <option value="30-45">30-45 minutes</option>
                          <option value="45-60">45-60 minutes</option>
                          <option value="60-90">1-1.5 hours</option>
                          <option value="over-90">Over 1.5 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Type</label>
                        <select value={formData.examType} onChange={(e) => handleChange('examType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="in-person">In-Person</option>
                          <option value="telehealth">Telehealth/Video</option>
                          <option value="ace-review">ACE Review (Records Only)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input type="text" value={formData.examLocation} onChange={(e) => handleChange('examLocation', e.target.value)}
                               placeholder="VA Medical Center, QTC Office, etc."
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Examiner Name</label>
                        <input type="text" value={formData.examinerName} onChange={(e) => handleChange('examinerName', e.target.value)}
                               placeholder="Dr. Smith"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Examiner Title</label>
                        <input type="text" value={formData.examinerTitle} onChange={(e) => handleChange('examinerTitle', e.target.value)}
                               placeholder="Physician, Psychologist, PA, NP"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition(s) Examined</label>
                        <input type="text" value={formData.conditionsExamined} onChange={(e) => handleChange('conditionsExamined', e.target.value)}
                               placeholder="PTSD, Back condition, Knee, etc."
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Tests Performed" number="2" isExpanded={expandedSections.testsPerformed} onToggle={() => toggleSection('testsPerformed')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {possibleTests.map(test => (
                          <label key={test.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input type="checkbox" checked={formData.testsPerformed.includes(test.id)} onChange={() => handleCheckboxArray('testsPerformed', test.id)} className="h-4 w-4 text-blue-600 rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{test.label}</span>
                          </label>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Questions Asked by Examiner" number="3" isExpanded={expandedSections.questionsAsked} onToggle={() => toggleSection('questionsAsked')}>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Check all questions the examiner asked you:</p>
                    {Object.entries(commonQuestions).map(([category, questions]) => (
                        <CollapsibleCategory key={category}
                                             title={`${category} (${formData.questionsAsked.filter(q => questions.includes(q)).length}/${questions.length})`}
                                             isExpanded={expandedCategories[category] || false}
                                             onToggle={() => toggleCategory(category)}>
                          <div className="space-y-1">
                            {questions.map(q => (
                                <label key={q} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                  <input type="checkbox" checked={formData.questionsAsked.includes(q)} onChange={() => handleCheckboxArray('questionsAsked', q)} className="h-4 w-4 text-blue-600 rounded" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{q}</span>
                                </label>
                            ))}
                          </div>
                        </CollapsibleCategory>
                    ))}
                  </CollapsibleSection>

                  <CollapsibleSection title="Examiner Behavior" number="4" isExpanded={expandedSections.examinerBehavior} onToggle={() => toggleSection('examinerBehavior')}>
                    <div className="space-y-3 text-left">
                      {[
                        { field: 'professional', label: 'Was the examiner professional and courteous?' },
                        { field: 'thorough', label: 'Did the exam feel thorough?' },
                        { field: 'rushedFeeling', label: 'Did you feel rushed?' },
                        { field: 'listenedCarefully', label: 'Did the examiner listen carefully?' },
                        { field: 'reviewedRecords', label: 'Did the examiner review your records?' },
                        { field: 'askedAboutWorstDays', label: 'Did they ask about your worst days?' },
                      ].map(({ field, label }) => (
                          <div key={field} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                            <YesNoButtons field={field} value={formData.examinerBehavior[field]} />
                          </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Potential Issues" number="5" isExpanded={expandedSections.potentialIssues} onToggle={() => toggleSection('potentialIssues')} variant="warning">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Check any issues you noticed:</p>
                    <div className="grid grid-cols-1 gap-2 text-left">
                      {potentialIssueOptions.map(issue => (
                          <label key={issue.id} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800">
                            <input type="checkbox" checked={formData.potentialIssues.includes(issue.id)} onChange={() => handleCheckboxArray('potentialIssues', issue.id)} className="h-4 w-4 text-red-600 rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{issue.label}</span>
                          </label>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Topics Not Covered" number="6" isExpanded={expandedSections.topicsNotCovered} onToggle={() => toggleSection('topicsNotCovered')}>
                <textarea value={formData.topicsNotCovered} onChange={(e) => handleChange('topicsNotCovered', e.target.value)}
                          placeholder="List any symptoms or topics the examiner did NOT ask about..." rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Duty to Assist Concerns" number="7" isExpanded={expandedSections.dutyToAssist} onToggle={() => toggleSection('dutyToAssist')} variant="warning">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">The VA has a "duty to assist" in developing your claim. Note any concerns:</p>
                    <textarea value={formData.dutyToAssistConcerns} onChange={(e) => handleChange('dutyToAssistConcerns', e.target.value)}
                              placeholder="Did the examiner have your records? Was the exam appropriate?" rows={4}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Personal Notes" number="8" isExpanded={expandedSections.personalNotes} onToggle={() => toggleSection('personalNotes')}>
                <textarea value={formData.personalNotes} onChange={(e) => handleChange('personalNotes', e.target.value)}
                          placeholder="Any other observations or things you want to remember..." rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </CollapsibleSection>

                  <CollapsibleSection title="Follow-up Actions" number="9" isExpanded={expandedSections.followUp} onToggle={() => toggleSection('followUp')}>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer">
                        <input type="checkbox" checked={formData.requestedDBQCopy} onChange={(e) => handleChange('requestedDBQCopy', e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">I requested a copy of the DBQ</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer">
                        <input type="checkbox" checked={formData.examinerProvidedInfo} onChange={(e) => handleChange('examinerProvidedInfo', e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Examiner provided contact information</span>
                      </label>
                    </div>
                  </CollapsibleSection>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={saveReport} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">Save Report</button>
                    <button onClick={() => exportToPDF()} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">Export to PDF</button>
                  </div>
                </div>
            )}

            {activeView === 'saved' && !selectedReport && (
                <div>
                  {savedReports.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">No saved reports yet</p>
                        <p className="text-sm">Create a new report after your C&P exam</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {savedReports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                 onClick={() => setSelectedReport(report)}>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{report.examDate} - {report.conditionsExamined || 'C&P Exam'}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{report.examLocation || 'Location not specified'} • {report.examinerName || 'Examiner not specified'}</p>
                                {report.potentialIssues?.length > 0 && <span className="text-xs text-red-600 dark:text-red-400">{report.potentialIssues.length} issue(s) flagged</span>}
                              </div>
                              <span className="text-gray-400">→</span>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {activeView === 'saved' && selectedReport && (
                <div>
                  <button onClick={() => setSelectedReport(null)} className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-1">← Back to list</button>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedReport.examDate} - {selectedReport.conditionsExamined || 'C&P Exam'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReport.examLocation} • {selectedReport.examinerName}</p>
                    {selectedReport.potentialIssues?.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                          <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm mb-1">Issues Identified:</h4>
                          <ul className="text-sm text-red-600 dark:text-red-400">
                            {selectedReport.potentialIssues.map(issueId => {
                              const issue = potentialIssueOptions.find(i => i.id === issueId);
                              return issue ? <li key={issueId}>• {issue.label}</li> : null;
                            })}
                          </ul>
                        </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => exportToPDF(selectedReport)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Export to PDF</button>
                    <button onClick={() => deleteReport(selectedReport.id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AfterActionReport;