// BuddyStatementGenerator.jsx - Generate Lay/Buddy Statements for VA Claims
// v2.1 Feature - Templates and guidance for supporting statements

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

// Storage key for saved statements
const STORAGE_KEY = 'buddy-statements';

const getSavedStatements = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveStatements = (statements) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
  } catch (e) {
    console.error('Error saving statements:', e);
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-left">
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

// Collapsible Category Component (for nested subcategories)
const CollapsibleCategory = ({ title, isExpanded, onToggle, children, count }) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
    >
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-left flex-1">{title}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">({count})</span>
      )}
      <span className={`text-gray-400 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
    </button>
    {isExpanded && (
      <div className="p-3 border-t border-gray-200 dark:border-gray-600">{children}</div>
    )}
  </div>
);

const BuddyStatementGenerator = ({ embedded = false, onClose }) => {
  const [activeView, setActiveView] = useState('new');
  const [savedStatements, setSavedStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [generatedStatement, setGeneratedStatement] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    writerInfo: true,
    veteranInfo: false,
    relationship: false,
    conditions: false,
    observations: false,
    impact: false,
    additional: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      if (prev[section]) return { ...prev, [section]: false };
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      return { ...allClosed, [section]: true };
    });
  };

  // State for collapsible condition categories (in "Conditions Being Addressed")
  const [expandedConditionCategories, setExpandedConditionCategories] = useState({});

  // State for collapsible observation categories (in "Personal Observations")
  const [expandedObservationCategories, setExpandedObservationCategories] = useState({});

  const toggleConditionCategory = (category) => {
    setExpandedConditionCategories(prev => {
      if (prev[category]) return { ...prev, [category]: false };
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      return { ...allClosed, [category]: true };
    });
  };

  const toggleObservationCategory = (category) => {
    setExpandedObservationCategories(prev => {
      if (prev[category]) return { ...prev, [category]: false };
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
      return { ...allClosed, [category]: true };
    });
  };

  const [formData, setFormData] = useState({
    // Writer Info
    writerName: '',
    writerAddress: '',
    writerCity: '',
    writerState: '',
    writerZip: '',
    writerPhone: '',
    writerEmail: '',

    // Veteran Info
    veteranName: '',
    veteranLastFour: '',

    // Relationship
    relationship: '',
    relationshipOther: '',
    yearsKnown: '',
    howMet: '',
    frequencyOfContact: '',

    // Conditions being addressed
    selectedConditions: [],

    // Observations by category
    observations: {
      physical: [],
      mental: [],
      social: [],
      work: [],
    },

    // Custom observations
    customObservations: '',

    // Before/After comparison
    knewBeforeService: false,
    beforeDescription: '',
    afterDescription: '',

    // Specific incidents
    specificIncidents: '',

    // Impact statements
    impactOnVeteran: '',
    impactOnFamily: '',

    // Certification
    willingToTestify: false,
  });

  useEffect(() => {
    setSavedStatements(getSavedStatements());
  }, []);

  // Relationship options
  const relationshipOptions = [
    { id: 'spouse', label: 'Spouse/ Partner' },
    { id: 'parent', label: 'Parent' },
    { id: 'child', label: 'Adult Child' },
    { id: 'sibling', label: 'Sibling' },
    { id: 'friend', label: 'Close Friend' },
    { id: 'coworker', label: 'Coworker/ Colleague' },
    { id: 'neighbor', label: 'Neighbor' },
    { id: 'battle-buddy', label: 'Battle Buddy/ Fellow Service Member' },
    { id: 'supervisor', label: 'Supervisor/ Manager' },
    { id: 'caregiver', label: 'Caregiver' },
    { id: 'other', label: 'Other' },
  ];

  // Condition categories with observable symptoms
  const conditionCategories = {
    'PTSD/Mental Health': {
      id: 'mental-health',
      conditions: ['PTSD', 'Anxiety', 'Depression', 'Bipolar Disorder', 'Adjustment Disorder'],
      observations: [
        'Has nightmares or trouble sleeping',
        'Appears hypervigilant or easily startled',
        'Avoids crowds, public places, or social gatherings',
        'Has mood swings or emotional outbursts',
        'Seems withdrawn or isolates themselves',
        'Has difficulty concentrating or remembering things',
        'Appears anxious or on edge frequently',
        'Has mentioned flashbacks or intrusive thoughts',
        'Shows signs of depression or hopelessness',
        'Has panic attacks or severe anxiety episodes',
        'Avoids talking about military service',
        'Has angry outbursts or irritability',
      ],
    },
    'Back/Spine Conditions': {
      id: 'back',
      conditions: ['Low Back Pain', 'Degenerative Disc Disease', 'Herniated Disc', 'Spinal Stenosis'],
      observations: [
        'Has difficulty standing for long periods',
        'Has difficulty sitting for extended time',
        'Limps or walks with altered gait',
        'Uses assistive devices (cane, walker, brace)',
        'Cannot bend over or pick things up easily',
        'Has to lie down frequently due to pain',
        'Cannot perform household chores',
        'Has visible pain when moving',
        'Takes frequent breaks during activities',
        'Has missed work or events due to back pain',
        'Cannot lift objects without pain',
        'Sleep is affected by pain',
      ],
    },
    'Knee/Joint Conditions': {
      id: 'joint',
      conditions: ['Knee Injury', 'Arthritis', 'Joint Pain', 'Limited Range of Motion'],
      observations: [
        'Has difficulty walking or climbing stairs',
        'Knee gives way or feels unstable',
        'Uses a brace, cane, or other support',
        'Cannot kneel or squat',
        'Has swelling in the joint',
        'Limps noticeably',
        'Cannot stand from seated position easily',
        'Has difficulty getting in/out of vehicles',
        'Cannot participate in physical activities',
        'Joint makes popping or grinding sounds',
        'Has visible pain during movement',
        'Weather changes affect their pain level',
      ],
    },
    'Migraines/Headaches': {
      id: 'migraine',
      conditions: ['Migraine Headaches', 'Tension Headaches', 'Cluster Headaches'],
      observations: [
        'Has to lie down in a dark room during headaches',
        'Cannot function during headache episodes',
        'Has nausea or vomiting with headaches',
        'Is sensitive to light and sound',
        'Has missed work due to headaches',
        'Cancels plans frequently due to headaches',
        'Takes medication that causes drowsiness',
        'Headaches last for hours or days',
        'Has multiple headaches per month',
        'Cannot drive during headache episodes',
        'Has difficulty concentrating due to pain',
        'Appears exhausted after headache episodes',
      ],
    },
    'Sleep Apnea': {
      id: 'sleep-apnea',
      conditions: ['Obstructive Sleep Apnea', 'Sleep Disorders'],
      observations: [
        'Uses a CPAP machine every night',
        'Snores loudly or stops breathing during sleep',
        'Is excessively tired during the day',
        'Falls asleep during activities or conversations',
        'Has difficulty staying awake while driving',
        'Wakes up with headaches frequently',
        'Is irritable due to poor sleep',
        'Has difficulty concentrating due to fatigue',
        'Takes naps during the day frequently',
        'Sleep is not restful despite hours slept',
        'Has gained weight since sleep problems began',
        'Cannot travel easily due to CPAP needs',
      ],
    },
    'Hearing Loss/Tinnitus': {
      id: 'hearing',
      conditions: ['Hearing Loss', 'Tinnitus'],
      observations: [
        'Has difficulty hearing conversations',
        'Asks people to repeat themselves frequently',
        'Turns TV or radio volume very high',
        'Has difficulty hearing in noisy environments',
        'Complains of ringing or buzzing in ears',
        'Cannot hear phone conversations well',
        'Misses doorbells, alarms, or alerts',
        'Has difficulty following group conversations',
        'Seems frustrated by hearing difficulties',
        'Avoids social situations due to hearing',
        'Uses hearing aids',
        'Tinnitus affects their sleep or concentration',
      ],
    },
    'Respiratory Conditions': {
      id: 'respiratory',
      conditions: ['Asthma', 'COPD', 'Respiratory Issues'],
      observations: [
        'Has difficulty breathing during exertion',
        'Uses an inhaler regularly',
        'Cannot walk long distances without stopping',
        'Has frequent coughing episodes',
        'Gets winded easily during normal activities',
        'Cannot participate in physical activities',
        'Has been hospitalized for breathing issues',
        'Breathing is audibly labored',
        'Cannot be around smoke, dust, or allergens',
        'Has to avoid certain environments',
        'Sleep is affected by breathing difficulties',
        'Takes multiple medications for breathing',
      ],
    },
  };

  // Impact areas
  const impactAreas = {
    social: [
      'No longer attends family gatherings',
      'Has lost friendships due to condition',
      'Rarely leaves the house',
      'Cannot maintain relationships',
      'Has become isolated from family',
      'Avoids activities they used to enjoy',
    ],
    work: [
      'Has missed significant work time',
      'Has had to reduce work hours',
      'Has lost jobs due to condition',
      'Cannot perform job duties effectively',
      'Has been passed over for promotions',
      'Had to change careers due to limitations',
    ],
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleObservationToggle = (category, observation) => {
    setFormData(prev => {
      const current = prev.observations[category] || [];
      const updated = current.includes(observation)
          ? current.filter(o => o !== observation)
          : [...current, observation];
      return { ...prev, observations: { ...prev.observations, [category]: updated } };
    });
  };

  const handleConditionToggle = (condition) => {
    setFormData(prev => {
      const current = prev.selectedConditions;
      return {
        ...prev,
        selectedConditions: current.includes(condition)
            ? current.filter(c => c !== condition)
            : [...current, condition]
      };
    });
  };

  // Generate the statement text
  const generateStatement = () => {
    const {
      writerName, writerAddress, writerCity, writerState, writerZip, writerPhone, writerEmail,
      veteranName, veteranLastFour,
      relationship, relationshipOther, yearsKnown, howMet, frequencyOfContact,
      selectedConditions, observations, customObservations,
      knewBeforeService, beforeDescription, afterDescription,
      specificIncidents, impactOnVeteran, impactOnFamily,
      willingToTestify
    } = formData;

    const relationshipLabel = relationship === 'other'
        ? relationshipOther
        : relationshipOptions.find(r => r.id === relationship)?.label || relationship;

    const allObservations = [
      ...observations.physical,
      ...observations.mental,
      ...observations.social,
      ...observations.work,
    ];

    let statement = `BUDDY/LAY STATEMENT IN SUPPORT OF VA DISABILITY CLAIM

DATE: ${new Date().toLocaleDateString()}

STATEMENT OF: ${writerName}
ADDRESS: ${writerAddress}
${writerCity}, ${writerState} ${writerZip}
PHONE: ${writerPhone}
${writerEmail ? `EMAIL: ${writerEmail}` : ''}

IN SUPPORT OF: ${veteranName}
${veteranLastFour ? `LAST 4 SSN: XXX-XX-${veteranLastFour}` : ''}

---

TO WHOM IT MAY CONCERN:

I, ${writerName}, am providing this statement in support of ${veteranName}'s claim for VA disability benefits. I am the veteran's ${relationshipLabel.toLowerCase()}, and I have known ${veteranName} for approximately ${yearsKnown} years.

RELATIONSHIP AND CONTACT:
${howMet ? `I first met ${veteranName} ${howMet}. ` : ''}${frequencyOfContact ? `I ${frequencyOfContact.toLowerCase()} with ${veteranName}.` : ''}

`;

    if (selectedConditions.length > 0) {
      statement += `CONDITIONS ADDRESSED:
This statement addresses my personal observations regarding ${veteranName}'s ${selectedConditions.join(', ')}.

`;
    }

    if (knewBeforeService && beforeDescription) {
      statement += `BEFORE MILITARY SERVICE:
${beforeDescription}

`;
    }

    if (afterDescription) {
      statement += `${knewBeforeService ? 'AFTER MILITARY SERVICE / CURRENT OBSERVATIONS' : 'CURRENT OBSERVATIONS'}:
${afterDescription}

`;
    }

    if (allObservations.length > 0) {
      statement += `SPECIFIC OBSERVATIONS:
I have personally observed the following regarding ${veteranName}'s condition(s):

`;
      allObservations.forEach(obs => {
        statement += `• ${obs}\n`;
      });
      statement += '\n';
    }

    if (customObservations) {
      statement += `ADDITIONAL OBSERVATIONS:
${customObservations}

`;
    }

    if (specificIncidents) {
      statement += `SPECIFIC INCIDENTS:
${specificIncidents}

`;
    }

    if (impactOnVeteran) {
      statement += `IMPACT ON THE VETERAN:
${impactOnVeteran}

`;
    }

    if (impactOnFamily) {
      statement += `IMPACT ON FAMILY/RELATIONSHIPS:
${impactOnFamily}

`;
    }

    statement += `CERTIFICATION:
I certify that the information provided in this statement is true and accurate to the best of my knowledge. I understand that providing false information may be punishable by law.

${willingToTestify ? 'I am willing to provide additional testimony or information if needed to support this claim.\n\n' : ''}
I declare under penalty of perjury that the foregoing is true and correct.

Executed on: ${new Date().toLocaleDateString()}

____________________________________
${writerName}
Signature

____________________________________
Date Signed
`;

    setGeneratedStatement(statement);
    setShowPreview(true);
  };

  const saveStatement = () => {
    const statement = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      writerName: formData.writerName,
      veteranName: formData.veteranName,
      relationship: formData.relationship,
      conditions: formData.selectedConditions,
      generatedText: generatedStatement,
      formData: formData,
    };
    const updated = [statement, ...savedStatements];
    setSavedStatements(updated);
    saveStatements(updated);
    alert('Statement saved successfully!');
  };

  const deleteStatement = (id) => {
    if (confirm('Are you sure you want to delete this statement?')) {
      const updated = savedStatements.filter(s => s.id !== id);
      setSavedStatements(updated);
      saveStatements(updated);
      setSelectedStatement(null);
    }
  };

  const exportToPDF = (text = generatedStatement) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 5;
    let currentY = margin;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));

    lines.forEach(line => {
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      // Check for headers/titles to make bold
      if (line.includes(':') && line === line.toUpperCase() && line.length < 50) {
        doc.setFont(undefined, 'bold');
      } else if (line.startsWith('BUDDY/LAY STATEMENT') || line.startsWith('TO WHOM IT MAY CONCERN')) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }

      doc.text(line, margin, currentY);
      currentY += lineHeight;
    });

    doc.save(`Buddy-Statement-${formData.veteranName.replace(/\s+/g, '-') || 'Draft'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToText = (text = generatedStatement) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Buddy-Statement-${formData.veteranName.replace(/\s+/g, '-') || 'Draft'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStatement);
    alert('Statement copied to clipboard!');
  };

  return (
      <div className={`${embedded ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}`}>
        <div className={`${embedded ? '' : 'max-w-4xl mx-auto p-4'}`}>

          {!embedded && (
              <div className="bg-blue-900 dark:bg-gray-800 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Buddy Statement Generator</h1>
                    <p className="text-blue-200 dark:text-gray-400 mt-1">Create supporting lay statements for VA disability claims</p>
                  </div>
                  {onClose && <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">×</button>}
                </div>
              </div>
          )}

          {/* Info Banner */}
          <div className={`bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 ${embedded ? '' : 'border-x border-gray-200 dark:border-gray-700'}`}>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">What is a Buddy Statement?</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 text-left">
              A buddy/lay statement is a written account from someone who has personally witnessed how a veteran's condition affects their daily life.
              The VA accepts these as valid evidence to support disability claims. Statements should be specific, factual, and based on personal observation.
            </p>
          </div>

          {/* View Toggle */}
          <div className={`bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 ${embedded ? '' : 'border-x'}`}>
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => { setActiveView('new'); setSelectedStatement(null); setShowPreview(false); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  + New Statement
                </button>
                <button onClick={() => { setActiveView('saved'); setShowPreview(false); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'saved' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  Saved ({savedStatements.length})
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`bg-white dark:bg-gray-800 p-4 ${embedded ? '' : 'border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg'}`}>

            {/* New Statement Form */}
            {activeView === 'new' && !showPreview && (
                <div className="space-y-4 text-left">

                  {/* Section 1: Writer Info */}
                  <CollapsibleSection title="Statement Writer Information" number="1" isExpanded={expandedSections.writerInfo} onToggle={() => toggleSection('writerInfo')}>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Information about the person writing this statement (you or the buddy).</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Legal Name *</label>
                        <input type="text" value={formData.writerName} onChange={(e) => handleChange('writerName', e.target.value)}
                               placeholder="John A. Smith"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                        <input type="text" value={formData.writerAddress} onChange={(e) => handleChange('writerAddress', e.target.value)}
                               placeholder="123 Main Street"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                        <input type="text" value={formData.writerCity} onChange={(e) => handleChange('writerCity', e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                          <input type="text" value={formData.writerState} onChange={(e) => handleChange('writerState', e.target.value)}
                                 maxLength={2} placeholder="TX"
                                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP *</label>
                          <input type="text" value={formData.writerZip} onChange={(e) => handleChange('writerZip', e.target.value)}
                                 maxLength={10} placeholder="78701"
                                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                        <input type="tel" value={formData.writerPhone} onChange={(e) => handleChange('writerPhone', e.target.value)}
                               placeholder="(555) 123-4567"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Optional)</label>
                        <input type="email" value={formData.writerEmail} onChange={(e) => handleChange('writerEmail', e.target.value)}
                               placeholder="email@example.com"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Section 2: Veteran Info */}
                  <CollapsibleSection title="Veteran Information" number="2" isExpanded={expandedSections.veteranInfo} onToggle={() => toggleSection('veteranInfo')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Veteran's Full Name *</label>
                        <input type="text" value={formData.veteranName} onChange={(e) => handleChange('veteranName', e.target.value)}
                               placeholder="Jane B. Doe"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last 4 of SSN (Optional)</label>
                        <input type="text" value={formData.veteranLastFour} onChange={(e) => handleChange('veteranLastFour', e.target.value)}
                               maxLength={4} placeholder="1234"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Helps VA match statement to correct file</p>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Section 3: Relationship */}
                  <CollapsibleSection title="Relationship to Veteran" number="3" isExpanded={expandedSections.relationship} onToggle={() => toggleSection('relationship')}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What is your relationship? *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {relationshipOptions.map(rel => (
                              <label key={rel.id} className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
                                  formData.relationship === rel.id
                                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}>
                                <input type="radio" name="relationship" value={rel.id} checked={formData.relationship === rel.id}
                                       onChange={(e) => handleChange('relationship', e.target.value)}
                                       className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{rel.label}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      {formData.relationship === 'other' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Please specify relationship</label>
                            <input type="text" value={formData.relationshipOther} onChange={(e) => handleChange('relationshipOther', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                          </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How long have you known the veteran? *</label>
                          <input type="text" value={formData.yearsKnown} onChange={(e) => handleChange('yearsKnown', e.target.value)}
                                 placeholder="15 years"
                                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How often do you have contact?</label>
                          <select value={formData.frequencyOfContact} onChange={(e) => handleChange('frequencyOfContact', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="">Select frequency</option>
                            <option value="live together">Live together</option>
                            <option value="see each other daily">See each other daily</option>
                            <option value="see each other several times a week">Several times a week</option>
                            <option value="see each other weekly">Weekly</option>
                            <option value="see each other a few times a month">A few times a month</option>
                            <option value="see each other monthly">Monthly</option>
                            <option value="talk regularly by phone">Talk regularly by phone</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How did you meet?</label>
                        <input type="text" value={formData.howMet} onChange={(e) => handleChange('howMet', e.target.value)}
                               placeholder="We served together at Camp Pendleton from 2008-2012"
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </CollapsibleSection>

              {/* Section 4: Conditions */}
              <CollapsibleSection title="Conditions Being Addressed" number="4" isExpanded={expandedSections.conditions} onToggle={() => toggleSection('conditions')}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the condition(s) you are providing observations about:</p>
                <div className="space-y-2">
                  {Object.entries(conditionCategories).map(([categoryName, category]) => {
                    const selectedCount = category.conditions.filter(c => formData.selectedConditions.includes(c)).length;
                    return (
                      <CollapsibleCategory
                        key={category.id}
                        title={categoryName}
                        isExpanded={expandedConditionCategories[category.id] || false}
                        onToggle={() => toggleConditionCategory(category.id)}
                        count={selectedCount > 0 ? `${selectedCount} selected` : undefined}
                      >
                        <div className="flex flex-wrap gap-2">
                          {category.conditions.map(condition => (
                            <label key={condition} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                              formData.selectedConditions.includes(condition)
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                            }`}>
                              <input type="checkbox" checked={formData.selectedConditions.includes(condition)}
                                onChange={() => handleConditionToggle(condition)}
                                className="h-4 w-4 text-blue-600 rounded" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                            </label>
                          ))}
                        </div>
                      </CollapsibleCategory>
                    );
                  })}
                </div>
              </CollapsibleSection>

              {/* Section 5: Observations */}
              <CollapsibleSection title="Personal Observations" number="5" isExpanded={expandedSections.observations} onToggle={() => toggleSection('observations')}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Check all observations you have personally witnessed. Only select what you have actually seen.
                </p>

                {formData.selectedConditions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Please select condition(s) in the previous section to see relevant observations.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(conditionCategories).map(([categoryName, category]) => {
                      const hasSelectedCondition = category.conditions.some(c => formData.selectedConditions.includes(c));
                      if (!hasSelectedCondition) return null;

                      const checkedCount = category.observations.filter(obs =>
                        formData.observations.mental?.includes(obs) || formData.observations.physical?.includes(obs)
                      ).length;

                      return (
                        <CollapsibleCategory
                          key={category.id}
                          title={`${categoryName} Observations`}
                          isExpanded={expandedObservationCategories[category.id] || false}
                          onToggle={() => toggleObservationCategory(category.id)}
                          count={checkedCount > 0 ? `${checkedCount}/${category.observations.length}` : `0/${category.observations.length}`}
                        >
                          <div className="space-y-2">
                            {category.observations.map(obs => (
                              <label key={obs} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input type="checkbox"
                                  checked={formData.observations.mental?.includes(obs) || formData.observations.physical?.includes(obs)}
                                  onChange={() => handleObservationToggle('mental', obs)}
                                  className="h-4 w-4 mt-0.5 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{obs}</span>
                              </label>
                            ))}
                          </div>
                        </CollapsibleCategory>
                      );
                    })}

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Observations (Optional)</label>
                      <textarea value={formData.customObservations} onChange={(e) => handleChange('customObservations', e.target.value)}
                        placeholder="Describe any other specific observations you have personally witnessed..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                )}
              </CollapsibleSection>

                  {/* Section 6: Impact */}
                  <CollapsibleSection title="Before/After & Impact" number="6" isExpanded={expandedSections.impact} onToggle={() => toggleSection('impact')}>
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                        <input type="checkbox" checked={formData.knewBeforeService} onChange={(e) => handleChange('knewBeforeService', e.target.checked)}
                               className="h-4 w-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">I knew the veteran before their military service</span>
                      </label>

                      {formData.knewBeforeService && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Describe the veteran BEFORE military service
                            </label>
                            <textarea value={formData.beforeDescription} onChange={(e) => handleChange('beforeDescription', e.target.value)}
                                      placeholder="Before joining the military, [Veteran] was outgoing, active, and enjoyed..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                          </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Describe the veteran's current condition/behavior
                        </label>
                        <textarea value={formData.afterDescription} onChange={(e) => handleChange('afterDescription', e.target.value)}
                                  placeholder="Now, [Veteran] struggles with... I have noticed significant changes including..."
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Specific Incidents (Optional)
                        </label>
                        <textarea value={formData.specificIncidents} onChange={(e) => handleChange('specificIncidents', e.target.value)}
                                  placeholder="Describe specific incidents you witnessed, including approximate dates if possible..."
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          How has this impacted the veteran's life?
                        </label>
                        <textarea value={formData.impactOnVeteran} onChange={(e) => handleChange('impactOnVeteran', e.target.value)}
                                  placeholder="The condition has affected their ability to work, maintain relationships, participate in activities..."
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          How has this impacted family/relationships? (Optional)
                        </label>
                        <textarea value={formData.impactOnFamily} onChange={(e) => handleChange('impactOnFamily', e.target.value)}
                                  placeholder="The family has had to adjust... Children have been affected by... Our relationship has changed..."
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Section 7: Additional */}
                  <CollapsibleSection title="Certification" number="7" isExpanded={expandedSections.additional} onToggle={() => toggleSection('additional')}>
                    <label className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={formData.willingToTestify} onChange={(e) => handleChange('willingToTestify', e.target.checked)}
                             className="h-4 w-4 mt-0.5 text-blue-600 rounded" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">I am willing to provide additional testimony if needed</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The VA may contact you for additional information or testimony</p>
                      </div>
                    </label>
                  </CollapsibleSection>

                  {/* Generate Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={generateStatement}
                            disabled={!formData.writerName || !formData.veteranName || !formData.relationship}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                      Generate Statement Preview
                    </button>
                    {(!formData.writerName || !formData.veteranName || !formData.relationship) && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-2 text-center">
                          Please fill in writer name, veteran name, and relationship to generate statement.
                        </p>
                    )}
                  </div>
                </div>
            )}

            {/* Statement Preview */}
            {activeView === 'new' && showPreview && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statement Preview</h3>
                    <button onClick={() => setShowPreview(false)} className="text-blue-600 dark:text-blue-400 hover:underline">
                      ← Back to Edit
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {generatedStatement}
                </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={saveStatement} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Save Statement
                    </button>
                    <button onClick={() => exportToPDF()} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Export PDF
                    </button>
                    <button onClick={() => exportToText()} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Export Text
                    </button>
                    <button onClick={copyToClipboard} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Copy to Clipboard
                    </button>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Reminders</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                      <li>• The statement must be signed and dated by the writer</li>
                      <li>• Review the statement carefully for accuracy before signing</li>
                      <li>• Keep a copy for your records</li>
                      <li>• Submit with other claim evidence to the VA</li>
                    </ul>
                  </div>
                </div>
            )}

            {/* Saved Statements List */}
            {activeView === 'saved' && !selectedStatement && (
                <div>
                  {savedStatements.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">No saved statements yet</p>
                        <p className="text-sm">Create a new buddy statement to get started</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {savedStatements.map(statement => (
                            <div key={statement.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                 onClick={() => setSelectedStatement(statement)}>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Statement for {statement.veteranName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  By: {statement.writerName} • {new Date(statement.createdAt).toLocaleDateString()}
                                </p>
                                {statement.conditions?.length > 0 && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                      {statement.conditions.join(', ')}
                                    </p>
                                )}
                              </div>
                              <span className="text-gray-400">→</span>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* Selected Statement Detail */}
            {activeView === 'saved' && selectedStatement && (
                <div>
                  <button onClick={() => setSelectedStatement(null)} className="text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-1">
                    ← Back to list
                  </button>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Statement for {selectedStatement.veteranName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By: {selectedStatement.writerName} • Created: {new Date(selectedStatement.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {selectedStatement.generatedText}
                </pre>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => exportToPDF(selectedStatement.generatedText)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Export PDF
                    </button>
                    <button onClick={() => exportToText(selectedStatement.generatedText)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Export Text
                    </button>
                    <button onClick={() => deleteStatement(selectedStatement.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default BuddyStatementGenerator;