// CPExamPrep.jsx - C&P Exam Preparation Checklist Component
// v2.1 Feature - Helps veterans prepare for Compensation & Pension exams

import React, { useState, useMemo } from 'react';
import { getSymptomLogs } from '../utils/storage';
import { getActiveProfile, getActiveProfileId, getServiceConnectedConditions } from '../utils/profiles.js';
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
const CPExamPrep = ({ embedded = false, onClose, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [expandedCondition, setExpandedCondition] = useState(null);

  // --- Nexus Summary State ---
  // Resolve veteran name from the active profile's .name field
  const resolveVeteranName = () => {
    try {
      const profile = getActiveProfile();
      return profile?.name || '';
    } catch { return ''; }
  };

  // Build the localStorage key scoped to active profile + condition slug
  // e.g. "docbear_nexus_abc123_sleep-apnea"
  // This prevents nexus summaries from leaking across profiles
  const nexusStorageKey = (conditionSlug) => {
    const profileId = getActiveProfileId() || 'default';
    return `docbear_nexus_${profileId}_${conditionSlug || 'default'}`;
  };

  // Load a saved summary for the given condition key
  const loadSavedSummary = (conditionSlug) => {
    try {
      const saved = localStorage.getItem(nexusStorageKey(conditionSlug));
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  };

  // The condition the veteran is currently editing a nexus for
  // Tracks which localStorage slot is active
  const [activeNexusCondition, setActiveNexusCondition] = useState('');

  const defaultSummary = {
    veteranName: resolveVeteranName(), // auto-populated, stays editable
    claimedCondition: '',
    // Element 1 — Current Diagnosis
    diagnosis: '',
    diagnosisDate: '',
    treatingProvider: '',
    // Element 2 — In-Service Events (array supports multiple)
    inServiceEvents: [{ event: '', dateOrTimeframe: '', evidence: '' }],
    // Element 3 — Medical Nexus
    nexusExplanation: '',
    supportingEvidence: '',
    // Functional Impact
    workLimitations: '',
    sleepProblems: '',
    communicationDifficulty: '',
    physicalLimitations: '',
    otherImpact: '',
  };

  const [nexusSummary, setNexusSummary] = useState(() => {
    // On first load, no condition is selected — start with defaults
    return defaultSummary;
  });

  const [nexusSaveStatus, setNexusSaveStatus] = useState(''); // '', 'saved', 'error'

  // Save nexus summary to localStorage under the active condition's key
  const saveNexusSummary = (data, conditionSlug) => {
    const key = nexusStorageKey(conditionSlug ?? activeNexusCondition);
    try {
      localStorage.setItem(key, JSON.stringify(data));
      setNexusSaveStatus('saved');
      setTimeout(() => setNexusSaveStatus(''), 2500);
    } catch {
      setNexusSaveStatus('error');
    }
  };

  // Switch to editing a different condition's nexus summary.
  // Saves current work first, then loads (or initializes) the new condition's data.
  const switchNexusCondition = (conditionSlug) => {
    // Save whatever is currently in state before switching
    if (activeNexusCondition) {
      saveNexusSummary(nexusSummary, activeNexusCondition);
    }
    setActiveNexusCondition(conditionSlug);
    const existing = loadSavedSummary(conditionSlug);
    setNexusSummary(existing || {
      ...defaultSummary,
      claimedCondition: conditionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    });
  };

  // Update a top-level nexus field and auto-save to the active condition key
  const updateNexusField = (field, value) => {
    const updated = { ...nexusSummary, [field]: value };
    setNexusSummary(updated);
    saveNexusSummary(updated);
  };

  // Update a specific in-service event by index
  const updateInServiceEvent = (index, field, value) => {
    const updatedEvents = nexusSummary.inServiceEvents.map((ev, i) =>
        i === index ? { ...ev, [field]: value } : ev
    );
    const updated = { ...nexusSummary, inServiceEvents: updatedEvents };
    setNexusSummary(updated);
    saveNexusSummary(updated);
  };

  // Add a new blank in-service event row
  const addInServiceEvent = () => {
    const updated = {
      ...nexusSummary,
      inServiceEvents: [...nexusSummary.inServiceEvents, { event: '', dateOrTimeframe: '', evidence: '' }]
    };
    setNexusSummary(updated);
    saveNexusSummary(updated);
  };

  // Remove an in-service event row by index
  const removeInServiceEvent = (index) => {
    if (nexusSummary.inServiceEvents.length === 1) return; // always keep at least one
    const updatedEvents = nexusSummary.inServiceEvents.filter((_, i) => i !== index);
    const updated = { ...nexusSummary, inServiceEvents: updatedEvents };
    setNexusSummary(updated);
    saveNexusSummary(updated);
  };

  // Clear only the active condition's nexus summary
  const clearNexusSummary = () => {
    const conditionLabel = activeNexusCondition
        ? `the nexus summary for "${activeNexusCondition.replace(/-/g, ' ')}"`
        : 'this nexus summary';
    if (!window.confirm(`Clear ${conditionLabel}? This cannot be undone.`)) return;
    const fresh = { ...defaultSummary };
    setNexusSummary(fresh);
    if (activeNexusCondition) {
      localStorage.removeItem(nexusStorageKey(activeNexusCondition));
    }
  };

  const serviceConnectedConditions = useMemo(() => {
    const profileId = getActiveProfileId();
    return profileId ? getServiceConnectedConditions(profileId) : [];
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
    // description.evidenceLookingFor contains VA-specific evidence items
    // that map naturally to questions the examiner will probe for
    const evidenceQuestions = description?.evidenceLookingFor
    ?.slice(0, 3)
    .map(item => `Can you describe your ${item.toLowerCase()}?`) || [];

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

    return [...specificQuestions, ...evidenceQuestions, ...baseQuestions].slice(0, 8);
  };

  // Export the nexus one-pager to a clean single-page PDF
  const exportNexusToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const usableWidth = pageWidth - margin * 2;
    let y = 18;

    const addPageIfNeeded = (spaceNeeded = 20) => {
      if (y + spaceNeeded > 275) { doc.addPage(); y = 18; }
    };

    const sectionLabel = (color, label) => {
      doc.setFillColor(...color);
      doc.roundedRect(margin, y, usableWidth, 7, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text(label, margin + 2, y + 5);
      y += 10;
      doc.setTextColor(40);
    };

    const fieldLine = (label, value) => {
      if (!value || !value.trim()) return;
      addPageIfNeeded(12);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, margin + 2, y);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(value, usableWidth - 30);
      doc.text(lines, margin + 40, y);
      y += Math.max(6, lines.length * 4.5) + 2;
    };

    const bodyText = (text) => {
      if (!text || !text.trim()) return;
      addPageIfNeeded(10);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, usableWidth - 4);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4.5 + 3;
    };

    // ── Header ──
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('C&P EXAM NEXUS SUMMARY', pageWidth / 2, 11, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('Submit with your claim and hand a copy to your examiner', pageWidth / 2, 18, { align: 'center' });
    y = 30;

    // ── Veteran Info ──
    doc.setTextColor(40);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    if (nexusSummary.veteranName) {
      doc.text(`Veteran: ${nexusSummary.veteranName}`, margin, y);
      y += 6;
    }
    if (nexusSummary.claimedCondition) {
      doc.text(`Claimed Condition: ${nexusSummary.claimedCondition}`, margin, y);
      y += 6;
    }

    // Horizontal rule
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // ── Element 1 ──
    sectionLabel([30, 58, 138], 'ELEMENT 1 — CURRENT DIAGNOSIS');
    fieldLine('Diagnosis', nexusSummary.diagnosis);
    fieldLine('Date Diagnosed', nexusSummary.diagnosisDate);
    fieldLine('Provider / Facility', nexusSummary.treatingProvider);
    y += 3;

    // ── Element 2 ──
    addPageIfNeeded(15);
    sectionLabel([180, 90, 20], 'ELEMENT 2 — IN-SERVICE EVENT / EXPOSURE');
    nexusSummary.inServiceEvents.forEach((ev, idx) => {
      if (nexusSummary.inServiceEvents.length > 1) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(100);
        doc.text(`Event ${idx + 1}`, margin + 2, y);
        y += 5;
        doc.setTextColor(40);
      }
      fieldLine('Event / Exposure', ev.event);
      fieldLine('Date / Timeframe', ev.dateOrTimeframe);
      fieldLine('Evidence in Records', ev.evidence);
    });
    y += 3;

    // ── Element 3 ──
    addPageIfNeeded(15);
    sectionLabel([22, 101, 52], 'ELEMENT 3 — MEDICAL NEXUS');
    bodyText(nexusSummary.nexusExplanation);
    if (nexusSummary.supportingEvidence) {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(8);
      doc.text('Supporting Evidence:', margin + 2, y);
      y += 5;
      bodyText(nexusSummary.supportingEvidence);
    }
    y += 3;

    // ── Functional Impact ──
    addPageIfNeeded(15);
    sectionLabel([88, 28, 135], 'FUNCTIONAL IMPACT');
    fieldLine('Work Limitations', nexusSummary.workLimitations);
    fieldLine('Sleep Problems', nexusSummary.sleepProblems);
    fieldLine('Communication', nexusSummary.communicationDifficulty);
    fieldLine('Physical Limitations', nexusSummary.physicalLimitations);
    fieldLine('Other Impact', nexusSummary.otherImpact);

    // ── Footer ──
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(160);
      doc.text(
          `Nexus Summary — ${nexusSummary.veteranName || 'Veteran'} — Generated ${new Date().toLocaleDateString()} — Doc Bear's Symptom Vault`,
          pageWidth / 2,
          doc.internal.pageSize.height - 8,
          { align: 'center' }
      );
    }

    const filename = nexusSummary.claimedCondition
        ? `Nexus-Summary-${nexusSummary.claimedCondition.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
        : `Nexus-Summary-${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(filename);
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
        ? serviceConnectedConditions.map(c => c.conditionKey || c.conditionId || c.id)
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
            <div className="grid grid-cols-5 gap-1 p-1">
              {[
                { id: 'checklist', label: 'Checklist', icon: '✅' },
                { id: 'tips', label: 'Tips', icon: '💡' },
                { id: 'terminology', label: 'Terms', icon: '📖' },
                { id: 'conditions', label: 'Conditions', icon: '🎯' },
                { id: 'nexus', label: 'Nexus', icon: '📄' },
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
                                const conditionId = condition.conditionKey || condition.conditionId || condition.id;
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
          {/* ── NEXUS SUMMARY TAB ── */}
          {activeTab === 'nexus' && (
              <div className="space-y-6 text-left">

                {/* Condition selector — determines which localStorage slot is used */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Which condition is this nexus summary for?
                  </h4>

                  {/* Quick-select from service-connected conditions if available */}
                  {serviceConnectedConditions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {serviceConnectedConditions.map((c, idx) => {
                          const slug = c.conditionKey || c.conditionId || c.id;
                          const label = c.conditionName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          const isActive = activeNexusCondition === slug;
                          return (
                              <button
                                  key={idx}
                                  onClick={() => switchNexusCondition(slug)}
                                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                                      isActive
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:border-blue-400'
                                  }`}
                              >
                                {label}
                                {/* Dot indicator if a saved summary exists for this condition */}
                                {loadSavedSummary(slug) && !isActive && (
                                    <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-green-500 rounded-full align-middle" title="Saved summary exists" />
                                )}
                              </button>
                          );
                        })}
                      </div>
                  )}

                  {/* Manual condition entry for conditions not in their profile */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Or type a condition name to start a new summary:
                    </label>
                    <div className="flex gap-2">
                      <input
                          type="text"
                          id="nexus-condition-manual"
                          placeholder="e.g., sleep-apnea, tinnitus, ptsd"
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              switchNexusCondition(e.target.value.trim().toLowerCase().replace(/\s+/g, '-'));
                              e.target.value = '';
                            }
                          }}
                      />
                      <button
                          onClick={() => {
                            const input = document.getElementById('nexus-condition-manual');
                            if (input?.value.trim()) {
                              switchNexusCondition(input.value.trim().toLowerCase().replace(/\s+/g, '-'));
                              input.value = '';
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>

                  {activeNexusCondition && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓ Editing: <strong>{activeNexusCondition.replace(/-/g, ' ')}</strong>
                        {' '}— saves automatically
                      </p>
                  )}
                </div>

                {/* Gate: only show the form once a condition is selected */}
                {!activeNexusCondition && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      Select or type a condition above to begin your nexus summary.
                    </div>
                )}

                {activeNexusCondition && (
                    <>

                    {/* Explainer banner */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                        📄 C&P Exam Nexus Summary
                      </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Fill out this one-page summary covering the three elements required for service connection.
                    Submit it with your claim <strong>and</strong> hand a copy directly to the examiner.
                    Your answers are saved automatically.
                  </p>
                </div>

                {/* Save status indicator */}
                {nexusSaveStatus === 'saved' && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Saved automatically</p>
                )}
                {nexusSaveStatus === 'error' && (
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠ Could not save — storage may be full</p>
                )}

                {/* Veteran Name + Claimed Condition */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base">Veteran Information</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Veteran Name
                    </label>
                    <input
                        type="text"
                        value={nexusSummary.veteranName}
                        onChange={e => updateNexusField('veteranName', e.target.value)}
                        placeholder="Full legal name"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Claimed Condition
                    </label>
                    <input
                        type="text"
                        value={nexusSummary.claimedCondition}
                        onChange={e => updateNexusField('claimedCondition', e.target.value)}
                        placeholder="e.g., Sleep Apnea, PTSD, COPD"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Element 1 — Current Diagnosis */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Element 1</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Current Diagnosis</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Diagnosis
                    </label>
                    <input
                        type="text"
                        value={nexusSummary.diagnosis}
                        onChange={e => updateNexusField('diagnosis', e.target.value)}
                        placeholder="e.g., Obstructive Sleep Apnea (ICD-10: G47.33)"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Diagnosed
                    </label>
                    <input
                        type="text"
                        value={nexusSummary.diagnosisDate}
                        onChange={e => updateNexusField('diagnosisDate', e.target.value)}
                        placeholder="e.g., March 2022"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Treating Provider or Facility
                    </label>
                    <input
                        type="text"
                        value={nexusSummary.treatingProvider}
                        onChange={e => updateNexusField('treatingProvider', e.target.value)}
                        placeholder="e.g., VA Medical Center, Iowa City"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Element 2 — In-Service Event / Exposure */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">Element 2</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">In-Service Event / Exposure</h4>
                  </div>

                  {nexusSummary.inServiceEvents.map((ev, idx) => (
                      <div key={idx} className="border border-gray-200 dark:border-gray-500 rounded-lg p-3 space-y-3 relative">
                        {nexusSummary.inServiceEvents.length > 1 && (
                            <button
                                onClick={() => removeInServiceEvent(idx)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg font-bold leading-none"
                                aria-label="Remove this event"
                            >
                              ×
                            </button>
                        )}

                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          Event {nexusSummary.inServiceEvents.length > 1 ? idx + 1 : ''}
                        </p>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Event, Injury, or Exposure
                          </label>
                          <textarea
                              rows={2}
                              value={ev.event}
                              onChange={e => updateInServiceEvent(idx, 'event', e.target.value)}
                              placeholder="e.g., Continuous exposure to diesel exhaust and burn pit smoke during deployment to Iraq (2004–2005)"
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date or Timeframe
                          </label>
                          <input
                              type="text"
                              value={ev.dateOrTimeframe}
                              onChange={e => updateInServiceEvent(idx, 'dateOrTimeframe', e.target.value)}
                              placeholder="e.g., 2004–2005, Camp Taji, Iraq"
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Evidence in Records
                          </label>
                          <input
                              type="text"
                              value={ev.evidence}
                              onChange={e => updateInServiceEvent(idx, 'evidence', e.target.value)}
                              placeholder="e.g., STRs, DD-214, MOS exposure records, unit deployment orders"
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                  ))}

                  <button
                      onClick={addInServiceEvent}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                  >
                    + Add another event or exposure
                  </button>
                </div>

                {/* Element 3 — Medical Nexus */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Element 3</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Medical Nexus</h4>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 text-xs text-green-800 dark:text-green-300">
                    <strong>Example:</strong> Service-connected COPD worsens breathing mechanics during sleep → contributes to obstructive sleep apnea.
                    Explain the chain of causation clearly — the examiner uses this to write their medical opinion.
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      How the Condition Is Connected to Service
                    </label>
                    <textarea
                        rows={4}
                        value={nexusSummary.nexusExplanation}
                        onChange={e => updateNexusField('nexusExplanation', e.target.value)}
                        placeholder="Describe in plain language how your in-service event caused or aggravated your current diagnosis. Be specific about the causal chain."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Supporting Medical Literature or Opinion (optional)
                    </label>
                    <textarea
                        rows={2}
                        value={nexusSummary.supportingEvidence}
                        onChange={e => updateNexusField('supportingEvidence', e.target.value)}
                        placeholder="e.g., Independent Medical Opinion from Dr. Smith (attached); VA study on burn pit exposure and respiratory conditions"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Functional Impact */}
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Impact</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Functional Impact</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Describe how the condition affects daily life. Leave blank any that don't apply.
                  </p>

                  {[
                    { field: 'workLimitations', label: 'Work Limitations', placeholder: 'e.g., Missed 12 days of work in the past year; unable to work night shifts' },
                    { field: 'sleepProblems', label: 'Sleep Problems', placeholder: 'e.g., Wake 4–5 times per night; daytime fatigue affects concentration' },
                    { field: 'communicationDifficulty', label: 'Communication Difficulty', placeholder: 'e.g., Hearing loss requires repetition in conversations; avoids phone calls' },
                    { field: 'physicalLimitations', label: 'Physical Limitations', placeholder: 'e.g., Cannot walk more than 1 block without stopping; unable to lift over 10 lbs' },
                    { field: 'otherImpact', label: 'Other Daily Life Impact', placeholder: 'e.g., Social isolation, relationship strain, difficulty with self-care tasks' },
                  ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {label}
                        </label>
                        <textarea
                            rows={2}
                            value={nexusSummary[field]}
                            onChange={e => updateNexusField(field, e.target.value)}
                            placeholder={placeholder}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        />
                      </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                      onClick={exportNexusToPDF}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    📄 Print / Export One-Pager PDF
                  </button>
                  <button
                      onClick={clearNexusSummary}
                      className="sm:flex-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors text-sm"
                  >
                    🗑 Clear
                  </button>
                </div>

                    {/* Submission reminder */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300">
                        <strong>⚠ Reminder:</strong> Submit this document to the VA with your claim <em>and</em> bring a printed copy to hand directly to the examiner.
                        You are not arguing — you are making it easy for them to see the connection.
                      </div>

                    </> // closes activeNexusCondition gate
                )}

              </div>
          )}
        </div>
      </div>
  );
};

export default CPExamPrep;