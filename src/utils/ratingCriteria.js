// ============================================
// VA RATING CRITERIA - DATA STRUCTURE & ANALYSIS
// ============================================
// Based on 38 CFR Part 4 - Schedule for Rating Disabilities
// This file contains rating criteria definitions and logic to
// analyze logged symptoms against VA evaluation standards.
//
// DISCLAIMER: This is for documentation guidance only.
// The VA makes all final rating determinations.

// ============================================
// CONDITION DEFINITIONS
// ============================================

export const CONDITIONS = {
  MIGRAINE: {
    id: 'migraine',
    name: 'Migraine',
    diagnosticCode: '8100',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['migraine'],
  },
  SLEEP_APNEA: {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    diagnosticCode: '6847',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['sleep-issues', 'sleep-apnea'],
  },
  PTSD: {
    id: 'ptsd',
    name: 'PTSD',
    diagnosticCode: '9411',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['ptsd-nightmare', 'ptsd-flashback', 'ptsd-hypervigilance', 'ptsd-avoidance', 'ptsd-panic', 'nightmares'], // Include old 'nightmares' for backward compatibility
  },
  MAJOR_DEPRESSION: {
    id: 'major-depression',
    name: 'Major Depressive Disorder',
    diagnosticCode: '9434',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['depression', 'mdd-episode', 'mdd-anhedonia', 'mdd-hopelessness'],
  },
  GENERALIZED_ANXIETY: {
    id: 'generalized-anxiety',
    name: 'Generalized Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['anxiety', 'gad-worry', 'gad-restlessness', 'gad-muscle-tension'], // 'anxiety' for backward compatibility
  },
  PANIC_DISORDER: {
    id: 'panic-disorder',
    name: 'Panic Disorder',
    diagnosticCode: '9412',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['panic-attack', 'panic-agoraphobia', 'panic-anticipatory-anxiety'],
  },
  BIPOLAR: {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    diagnosticCode: '9432',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['bipolar-manic', 'bipolar-depressive', 'bipolar-mixed'],
  },
};

// ============================================
// MIGRAINE RATING CRITERIA (DC 8100)
// ============================================

export const MIGRAINE_CRITERIA = {
  diagnosticCode: '8100',
  condition: 'Migraine',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8100',

  ratings: [
    {
      percent: 50,
      summary: 'Very frequent, completely prostrating and prolonged attacks with severe economic inadaptability',
      criteria: {
        prostrating: true,
        prolonged: true,
        frequencyPerMonth: 4,
        economicImpact: 'severe',
      },
      criteriaDescription: [
        'Very frequent attacks (typically 4+ per month)',
        'Completely prostrating (unable to function)',
        'Prolonged duration (4+ hours)',
        'Productive of severe economic inadaptability',
      ],
      evidenceNeeded: [
        'Consistent logging of prostrating migraines',
        'Duration recorded as 4+ hours',
        'Frequency of approximately weekly or more',
        'Documentation of work impact (missed days, reduced productivity)',
      ],
    },
    {
      percent: 30,
      summary: 'Characteristic prostrating attacks averaging once a month',
      criteria: {
        prostrating: true,
        minAttacksPerMonth: 1,
        maxAttacksPerMonth: 3.99,
        evaluationPeriodMonths: 3,
      },
      criteriaDescription: [
        'Characteristic prostrating attacks',
        'Occurring on average once a month',
        'Pattern sustained over several months',
      ],
      evidenceNeeded: [
        'Prostrating migraines logged at least once per month',
        'Consistent pattern over 3+ months',
        'Clear documentation that attacks are incapacitating',
      ],
    },
    {
      percent: 10,
      summary: 'Characteristic prostrating attacks averaging one in 2 months',
      criteria: {
        prostrating: true,
        minAttacksPerMonth: 0.5,
        maxAttacksPerMonth: 0.99,
        evaluationPeriodMonths: 3,
      },
      criteriaDescription: [
        'Characteristic prostrating attacks',
        'Averaging one attack every 2 months',
        'Pattern sustained over several months',
      ],
      evidenceNeeded: [
        'Prostrating migraines logged at least every other month',
        'Consistent pattern over evaluation period',
      ],
    },
    {
      percent: 0,
      summary: 'Less frequent attacks',
      criteria: {
        prostrating: false,
      },
      criteriaDescription: [
        'Non-prostrating migraines, OR',
        'Prostrating attacks less than once every 2 months',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    prostrating: {
      term: 'Prostrating',
      definition: 'An attack severe enough that you cannot perform normal daily activities. You may need to lie down in a dark room, miss work, or be unable to care for yourself or family during the episode.',
      examples: [
        'Unable to go to work',
        'Had to leave work early',
        'Could not care for children',
        'Confined to bed or dark room',
      ],
    },
    prolonged: {
      term: 'Prolonged',
      definition: 'An attack lasting an extended period of time, typically 4 or more hours.',
      threshold: '4+ hours',
    },
    economicInadaptability: {
      term: 'Severe Economic Inadaptability',
      definition: 'The migraines significantly interfere with your ability to work and earn income. This does not require total unemployability, but shows substantial impact on work capacity.',
      examples: [
        'Frequent missed work days',
        'Unable to maintain full-time employment',
        'Required job accommodations',
        'Lost job opportunities due to condition',
        'Reduced hours or income',
      ],
    },
    characteristicAttack: {
      term: 'Characteristic Attack',
      definition: 'A migraine with typical features such as throbbing pain, sensitivity to light/sound, nausea, or aura that is recognizably a migraine episode.',
    },
  },
};

// ============================================
// SLEEP APNEA RATING CRITERIA (DC 6847)
// ============================================

export const SLEEP_APNEA_CRITERIA = {
  diagnosticCode: '6847',
  condition: 'Sleep Apnea Syndromes (Obstructive, Central, Mixed)',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6847',

  ratings: [
    {
      percent: 100,
      summary: 'Chronic respiratory failure with carbon dioxide retention or cor pulmonale, or requires tracheostomy',
      criteria: {
        hasRespiratoryFailure: true,
        // OR
        hasCorPulmonale: true,
        // OR
        requiresTracheostomy: true,
      },
      criteriaDescription: [
        'Chronic respiratory failure with carbon dioxide retention, OR',
        'Cor pulmonale (right heart failure from lung disease), OR',
        'Requires tracheostomy',
      ],
      evidenceNeeded: [
        'Medical diagnosis of chronic respiratory failure',
        'Documentation of carbon dioxide retention',
        'Diagnosis of cor pulmonale',
        'Tracheostomy procedure records',
      ],
    },
    {
      percent: 50,
      summary: 'Requires use of breathing assistance device such as CPAP machine',
      criteria: {
        usesBreathingDevice: true,
      },
      criteriaDescription: [
        'Requires use of breathing assistance device',
        'Examples: CPAP, BiPAP, APAP, or similar',
        'Device prescribed for sleep apnea treatment',
      ],
      evidenceNeeded: [
        'CPAP/BiPAP prescription from physician',
        'Sleep study (polysomnography) results',
        'Documentation of regular device usage',
        'Equipment records from DME provider',
      ],
    },
    {
      percent: 30,
      summary: 'Persistent daytime hypersomnolence',
      criteria: {
        hasDaytimeHypersomnolence: true,
        usesBreathingDevice: false,
      },
      criteriaDescription: [
        'Persistent daytime sleepiness/hypersomnolence',
        'Not currently using breathing assistance device',
        'Sleepiness interferes with daily activities',
      ],
      evidenceNeeded: [
        'Documentation of excessive daytime sleepiness',
        'Sleep study confirming sleep apnea diagnosis',
        'Records showing impact on daily functioning',
        'Epworth Sleepiness Scale scores if available',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic but with documented sleep disorder breathing',
      criteria: {
        hasDiagnosis: true,
        isAsymptomatic: true,
      },
      criteriaDescription: [
        'Sleep apnea diagnosed via sleep study',
        'Currently asymptomatic',
        'No daytime sleepiness',
        'Not requiring breathing device',
      ],
      evidenceNeeded: [
        'Sleep study documenting sleep disorder breathing',
      ],
    },
  ],

  definitions: {
    breathingDevice: {
      term: 'Breathing Assistance Device',
      definition: 'A medical device prescribed to maintain open airways during sleep. The most common is a CPAP (Continuous Positive Airway Pressure) machine.',
      examples: [
        'CPAP (Continuous Positive Airway Pressure)',
        'BiPAP (Bilevel Positive Airway Pressure)',
        'APAP (Automatic Positive Airway Pressure)',
        'ASV (Adaptive Servo-Ventilation)',
        'Inspire implant (hypoglossal nerve stimulator)',
      ],
    },
    hypersomnolence: {
      term: 'Persistent Daytime Hypersomnolence',
      definition: 'Excessive daytime sleepiness that persists despite adequate opportunity for sleep. This goes beyond normal tiredness and significantly impacts daily functioning.',
      examples: [
        'Difficulty staying awake during work or driving',
        'Falling asleep during conversations or meetings',
        'Needing frequent naps to function',
        'Feeling unrefreshed despite sleeping',
        'Difficulty concentrating due to sleepiness',
      ],
    },
    corPulmonale: {
      term: 'Cor Pulmonale',
      definition: 'Right-sided heart failure caused by lung disease or pulmonary hypertension. This is a serious complication that can result from severe, untreated sleep apnea.',
    },
    respiratoryFailure: {
      term: 'Chronic Respiratory Failure',
      definition: 'A condition where the respiratory system cannot maintain adequate gas exchange, resulting in abnormal oxygen or carbon dioxide levels in the blood.',
    },
    sleepStudy: {
      term: 'Sleep Study (Polysomnography)',
      definition: 'An overnight test that records brain activity, eye movements, heart rate, blood pressure, oxygen levels, and breathing patterns to diagnose sleep disorders.',
    },
  },
};


// ============================================
// SHARED MENTAL HEALTH RATING CRITERIA
// ============================================
// All mental health conditions (DC 9201-9440) use the same General Rating Formula
// This shared criteria is referenced by PTSD, Depression, Anxiety, Bipolar, etc.

export const MENTAL_HEALTH_SHARED_CRITERIA = {
  ratingFormula: 'General Rating Formula for Mental Disorders',
  cfrReference: '38 CFR 4.130',
  ratingNote: 'All mental health conditions are rated under the General Rating Formula for Mental Disorders. Ratings consider the frequency, severity, and duration of symptoms, along with capacity for adjustment during remissions.',

  ratings: [
    {
      percent: 100,
      summary: 'Total occupational and social impairment',
      criteria: {
        level: 'total',
        functionalImpairment: 'severe',
      },
      criteriaDescription: [
        'Total occupational and social impairment due to symptoms such as:',
        '• Gross impairment in thought processes or communication',
        '• Persistent delusions or hallucinations',
        '• Grossly inappropriate behavior',
        '• Persistent danger of hurting self or others',
        '• Intermittent inability to perform activities of daily living',
        '• Disorientation to time or place',
        '• Memory loss for names of close relatives, own occupation, or own name',
      ],
    },
    {
      percent: 70,
      summary: 'Occupational and social impairment, with deficiencies in most areas',
      criteria: {
        level: 'severe',
        functionalImpairment: 'significant',
      },
      criteriaDescription: [
        'Occupational and social impairment with deficiencies in most areas such as:',
        '• Work, school, family relations, judgment, thinking, or mood',
        'Due to symptoms such as:',
        '• Suicidal ideation',
        '• Obsessional rituals which interfere with routine activities',
        '• Speech intermittently illogical, obscure, or irrelevant',
        '• Near-continuous panic or depression affecting ability to function',
        '• Impaired impulse control (unprovoked irritability with periods of violence)',
        '• Spatial disorientation',
        '• Neglect of personal appearance and hygiene',
        '• Difficulty adapting to stressful circumstances (including work)',
        '• Inability to establish and maintain effective relationships',
      ],
    },
    {
      percent: 50,
      summary: 'Occupational and social impairment with reduced reliability and productivity',
      criteria: {
        level: 'moderate',
        functionalImpairment: 'moderate',
      },
      criteriaDescription: [
        'Occupational and social impairment with reduced reliability and productivity due to symptoms such as:',
        '• Flattened affect',
        '• Circumstantial, circumlocutory, or stereotyped speech',
        '• Panic attacks more than once a week',
        '• Difficulty in understanding complex commands',
        '• Impairment of short- and long-term memory',
        '• Impaired judgment',
        '• Impaired abstract thinking',
        '• Disturbances of motivation and mood',
        '• Difficulty in establishing and maintaining effective work and social relationships',
      ],
    },
    {
      percent: 30,
      summary: 'Occupational and social impairment with occasional decrease in work efficiency',
      criteria: {
        level: 'mild-to-moderate',
        functionalImpairment: 'intermittent',
      },
      criteriaDescription: [
        'Occupational and social impairment with occasional decrease in work efficiency',
        'Intermittent periods of inability to perform occupational tasks',
        '(Generally functioning satisfactorily with routine behavior, self-care, and conversation normal)',
        'Due to symptoms such as:',
        '• Depressed mood, anxiety, suspiciousness',
        '• Panic attacks (weekly or less often)',
        '• Chronic sleep impairment',
        '• Mild memory loss (forgetting names, directions, recent events)',
      ],
    },
    {
      percent: 10,
      summary: 'Occupational and social impairment due to mild or transient symptoms',
      criteria: {
        level: 'mild',
        functionalImpairment: 'minimal',
      },
      criteriaDescription: [
        'Occupational and social impairment due to mild or transient symptoms which:',
        '• Decrease work efficiency and ability to perform tasks only during significant stress',
        'OR',
        '• Symptoms controlled by continuous medication',
      ],
    },
    {
      percent: 0,
      summary: 'Mental condition formally diagnosed, but symptoms not severe enough to interfere',
      criteria: {
        level: 'minimal-none',
        functionalImpairment: 'none',
      },
      criteriaDescription: [
        'A mental condition has been formally diagnosed, but symptoms are not severe enough either to:',
        '• Interfere with occupational and social functioning',
        'OR',
        '• Require continuous medication',
      ],
    },
  ],

  definitions: {
    generalRatingFormula: {
      term: 'General Rating Formula for Mental Disorders',
      definition: 'All mental health conditions are rated based on level of functional impairment in occupational and social settings, not just by counting symptoms. The VA considers frequency, severity, duration of symptoms, and capacity for adjustment.',
    },
    occupationalImpairment: {
      term: 'Occupational Impairment',
      definition: 'Difficulty maintaining employment, reduced productivity, problems with attendance, inability to complete tasks, or difficulty working with others.',
    },
    socialImpairment: {
      term: 'Social Impairment',
      definition: 'Difficulty maintaining relationships, social isolation, problems with family interactions, inability to participate in social activities, or inappropriate social behavior.',
    },
    suicidalIdeation: {
      term: 'Suicidal Ideation',
      definition: 'Thoughts about suicide or self-harm. This is a serious symptom requiring immediate professional attention. If experiencing suicidal thoughts, call the Veterans Crisis Line: 988 then Press 1.',
    },
  },

  importantNotes: [
    'Mental health ratings are based on overall functional impairment, not symptom count',
    'The VA considers how symptoms affect work and social functioning',
    'Higher ratings require persistent symptoms, not just occasional episodes',
    'Medical documentation from mental health providers is critical',
    'Treatment records should demonstrate consistency of symptoms over time',
    'A formal diagnosis from a qualified provider is required',
  ],
};

// ============================================
// PTSD RATING CRITERIA (DC 9411)
// ============================================
// PTSD is rated using the General Rating Formula for Mental Disorders
// Focus is on occupational and social impairment, not just symptom frequency

export const PTSD_CRITERIA = {
  diagnosticCode: '9411',
  condition: 'Posttraumatic Stress Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9411',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,

  // PTSD-specific ratings reference shared criteria
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings.map(rating => ({
    ...rating,
    evidenceNeeded: getPTSDEvidenceNeeded(rating.percent),
    gaps: getPTSDGaps(rating.percent),
  })),

  // PTSD-specific definitions (in addition to shared ones)
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    panicAttack: {
      term: 'Panic Attack',
      definition: 'A discrete period of intense fear or discomfort with physical symptoms such as rapid heartbeat, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, or fear of losing control.',
    },
  },

  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// Helper function for PTSD evidence needed
function getPTSDEvidenceNeeded(percent) {
  const evidenceMap = {
    100: [
      'Medical documentation of severe functional impairment',
      'Treatment records showing persistence of severe symptoms',
      'Evidence of inability to maintain employment',
      'Documentation of impact on self-care and daily activities',
      'Mental health provider statements on level of impairment',
      'Hospitalization records if applicable',
    ],
    70: [
      'Medical records documenting specific symptoms from criteria list',
      'Treatment records showing frequency and severity of symptoms',
      'Documentation of work difficulties or inability to maintain employment',
      'Evidence of relationship problems or social isolation',
      'Mental health provider statements on functional limitations',
      'Logged symptoms showing pattern of severe impairment',
    ],
    50: [
      'Documentation of panic attacks (weekly or more frequent)',
      'Medical records noting memory, judgment, or cognitive issues',
      'Evidence of reduced work productivity',
      'Treatment records showing consistent symptom pattern',
      'Statements from providers about functional limitations',
      'Logged symptoms demonstrating frequency and impact',
    ],
    30: [
      'Medical documentation of PTSD diagnosis',
      'Treatment records showing ongoing symptoms',
      'Documentation of occasional work difficulties',
      'Evidence of panic attacks (up to weekly)',
      'Sleep logs showing chronic impairment',
      'Provider statements on functional impact',
    ],
    10: [
      'Medical documentation of PTSD diagnosis',
      'Treatment records',
      'Medication management records',
      'Documentation that symptoms are mild or medication-controlled',
    ],
    0: ['Formal diagnosis documentation'],
  };
  return evidenceMap[percent] || [];
}

// Helper function for PTSD documentation gaps
function getPTSDGaps(percent) {
  const gapsMap = {
    100: {
      treatmentRecords: 'Regular mental health treatment records documenting severity',
      functionalAssessment: 'Detailed assessment of work and social functioning limitations',
      persistentSymptoms: 'Documentation showing symptoms are persistent, not episodic',
    },
    70: {
      specificSymptoms: 'Document which specific symptoms from the criteria are present',
      workImpact: 'Evidence of how symptoms affect work performance',
      socialImpact: 'Documentation of relationship and social functioning difficulties',
      continuity: 'Continuous treatment records showing persistent symptoms',
    },
    50: {
      panicFrequency: 'Log panic attacks to show they occur more than once weekly',
      cognitiveIssues: 'Document memory, concentration, or judgment difficulties',
      workReliability: 'Evidence of reduced productivity or attendance issues',
      relationshipImpact: 'Documentation of difficulty maintaining relationships',
    },
    30: {
      diagnosis: 'Formal PTSD diagnosis from qualified mental health provider',
      treatment: 'Regular mental health treatment records',
      sleepImpact: 'Consistent logging of sleep disturbances',
      workImpact: 'Documentation of occasional work performance issues',
    },
    10: {
      diagnosis: 'Formal PTSD diagnosis documentation',
      treatment: 'Ongoing treatment or medication management records',
    },
    0: {},
  };
  return gapsMap[percent] || {};
}

// ============================================
// MAJOR DEPRESSIVE DISORDER CRITERIA (DC 9434)
// ============================================

export const MAJOR_DEPRESSION_CRITERIA = {
  diagnosticCode: '9434',
  condition: 'Major Depressive Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9434',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// GENERALIZED ANXIETY DISORDER CRITERIA (DC 9400)
// ============================================

export const GENERALIZED_ANXIETY_CRITERIA = {
  diagnosticCode: '9400',
  condition: 'Generalized Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9400',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// PANIC DISORDER CRITERIA (DC 9412)
// ============================================

export const PANIC_DISORDER_CRITERIA = {
  diagnosticCode: '9412',
  condition: 'Panic Disorder and/or Agoraphobia',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9412',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    panicAttack: {
      term: 'Panic Attack',
      definition: 'A discrete period of intense fear or discomfort with physical symptoms such as rapid heartbeat, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, or fear of losing control.',
    },
    agoraphobia: {
      term: 'Agoraphobia',
      definition: 'Fear or anxiety about situations where escape might be difficult or help unavailable if panic symptoms occur. Often leads to avoidance of places like crowds, public transportation, or open spaces.',
    },
  },
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// BIPOLAR DISORDER CRITERIA (DC 9432)
// ============================================

export const BIPOLAR_CRITERIA = {
  diagnosticCode: '9432',
  condition: 'Bipolar Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9432',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    manicEpisode: {
      term: 'Manic Episode',
      definition: 'A distinct period of abnormally and persistently elevated, expansive, or irritable mood and increased energy, lasting at least one week, causing significant impairment in functioning.',
    },
    depressiveEpisode: {
      term: 'Depressive Episode',
      definition: 'A period of depressed mood or loss of interest/pleasure in activities, along with other symptoms like sleep changes, energy loss, or concentration difficulties, lasting at least two weeks.',
    },
  },
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// ANALYSIS FUNCTIONS - MIGRAINE
// ============================================

/**
 * Analyzes migraine logs to determine supported rating level
 */
export const analyzeMigraineLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
    includeWorkImpact = false,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.symptomId === 'migraine';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No migraine logs found in the evaluation period',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging migraines to build your evidence'],
    };
  }

  const totalMigraines = relevantLogs.length;
  const prostratingMigraines = relevantLogs.filter(log => log.migraineData?.prostrating === true);
  const prostratingCount = prostratingMigraines.length;

  const prolongedDurations = ['4-24h', '1-2d', 'more-than-2d', 'ongoing'];
  const prolongedMigraines = prostratingMigraines.filter(log =>
      prolongedDurations.includes(log.migraineData?.duration)
  );
  const prolongedCount = prolongedMigraines.length;

  const monthsInPeriod = evaluationPeriodDays / 30;
  const totalPerMonth = totalMigraines / monthsInPeriod;
  const prostratingPerMonth = prostratingCount / monthsInPeriod;
  const prolongedProstratingPerMonth = prolongedCount / monthsInPeriod;

  const oldestLog = relevantLogs.reduce((oldest, log) =>
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest
  );
  const newestLog = relevantLogs.reduce((newest, log) =>
      new Date(log.timestamp) > new Date(newest.timestamp) ? log : newest
  );

  const evidence = {
    evaluationPeriod: {
      startDate: oldestLog.timestamp,
      endDate: newestLog.timestamp,
      days: evaluationPeriodDays,
      months: monthsInPeriod.toFixed(1),
    },
    totalMigraines,
    prostratingCount,
    prolongedCount,
    monthlyRates: {
      total: totalPerMonth.toFixed(1),
      prostrating: prostratingPerMonth.toFixed(1),
      prolongedProstrating: prolongedProstratingPerMonth.toFixed(1),
    },
    severityBreakdown: {
      prostrating: prostratingCount,
      nonProstrating: totalMigraines - prostratingCount,
      prolongedProstrating: prolongedCount,
    },
  };

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (prostratingPerMonth >= 4 && prolongedCount > 0) {
    supportedRating = 50;
    ratingRationale = [
      `${prostratingPerMonth.toFixed(1)} prostrating attacks per month (â‰¥4 required)`,
      `${prolongedCount} prolonged attacks documented`,
      'Pattern suggests very frequent, prostrating, prolonged attacks',
    ];
    gaps = [
      'Consider documenting work impact (missed days, reduced productivity)',
      'Note any job accommodations needed due to migraines',
    ];
  }
  else if (prostratingPerMonth >= 1) {
    supportedRating = 30;
    ratingRationale = [
      `${prostratingPerMonth.toFixed(1)} prostrating attacks per month (â‰¥1 required)`,
      'Pattern supports characteristic prostrating attacks averaging monthly',
    ];
    gaps = [];
    if (prolongedCount === 0) {
      gaps.push('Document duration of attacks (4+ hours supports higher rating)');
    }
    if (prostratingPerMonth < 4) {
      gaps.push(`Current frequency (${prostratingPerMonth.toFixed(1)}/month) - 4+/month may support 50% rating`);
    }
  }
  else if (prostratingPerMonth >= 0.5) {
    supportedRating = 10;
    ratingRationale = [
      `${prostratingPerMonth.toFixed(1)} prostrating attacks per month`,
      'Pattern supports prostrating attacks averaging once every 2 months',
    ];
    gaps = [
      `Increase documentation frequency - 1+/month may support 30% rating`,
      'Ensure all prostrating episodes are logged',
    ];
  }
  else {
    supportedRating = 0;
    if (prostratingCount === 0 && totalMigraines > 0) {
      ratingRationale = [
        `${totalMigraines} migraines logged, but none marked as prostrating`,
        'Non-prostrating migraines support 0% rating',
      ];
      gaps = [
        'If migraines prevent normal activities, mark them as "prostrating"',
        'Document severity accurately - prostrating attacks are key to higher ratings',
      ];
    } else if (prostratingCount > 0) {
      ratingRationale = [
        `${prostratingPerMonth.toFixed(2)} prostrating attacks per month`,
        'Frequency below threshold for 10% (need â‰¥0.5/month)',
      ];
      gaps = [
        'Continue logging all prostrating episodes',
        'Ensure you\'re capturing every migraine that prevents normal activities',
      ];
    } else {
      ratingRationale = ['Insufficient data to determine rating'];
      gaps = ['Begin logging migraine episodes with severity and duration'];
    }
  }

  return {
    hasData: true,
    condition: 'Migraine',
    diagnosticCode: '8100',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: MIGRAINE_CRITERIA,
    disclaimer: 'This analysis is for documentation guidance only. The VA makes all final rating determinations based on the complete evidence of record.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - SLEEP APNEA
// ============================================

/**
 * Analyzes sleep apnea logs to determine supported rating level
 * @param {Array} logs - All symptom logs
 * @param {Object} sleepApneaProfile - User's sleep apnea profile data
 * @param {Object} options - Analysis options
 */
export const analyzeSleepApneaLogs = (logs, sleepApneaProfile = {}, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  // Extract profile data (would come from a separate sleep apnea settings area)
  const {
    usesBreathingDevice = null,  // true/false/null (unknown)
    deviceType = null,           // 'cpap', 'bipap', 'apap', 'inspire', 'other'
    hasDiagnosis = null,         // true/false/null
    diagnosisDate = null,
  } = sleepApneaProfile;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Find sleep-related logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const isSleepRelated = log.symptomId === 'sleep-issues' ||
        log.symptomId === 'sleep-apnea' ||
        log.sleepData;
    return logDate >= cutoffDate && isSleepRelated;
  });

  // Analyze daytime sleepiness from logs
  const sleepinessLogs = relevantLogs.filter(log => {
    // Look for indicators of daytime sleepiness
    return log.sleepData?.feelRested === false ||
        log.sleepData?.quality <= 3 ||
        (log.notes && log.notes.toLowerCase().includes('tired')) ||
        (log.notes && log.notes.toLowerCase().includes('sleepy')) ||
        (log.notes && log.notes.toLowerCase().includes('fatigue'));
  });

  // Calculate metrics
  const totalSleepLogs = relevantLogs.length;
  const daytimeSleepinessCount = sleepinessLogs.length;
  const monthsInPeriod = evaluationPeriodDays / 30;

  // Average sleep quality if available
  const logsWithQuality = relevantLogs.filter(log => log.sleepData?.quality);
  const avgSleepQuality = logsWithQuality.length > 0
      ? logsWithQuality.reduce((sum, log) => sum + log.sleepData.quality, 0) / logsWithQuality.length
      : null;

  // Count nights feeling unrested
  const unrestedNights = relevantLogs.filter(log => log.sleepData?.feelRested === false).length;

  // Average hours slept
  const logsWithHours = relevantLogs.filter(log => log.sleepData?.hoursSlept);
  const avgHoursSlept = logsWithHours.length > 0
      ? logsWithHours.reduce((sum, log) => sum + parseFloat(log.sleepData.hoursSlept), 0) / logsWithHours.length
      : null;

  // Build evidence summary
  const evidence = {
    evaluationPeriod: {
      days: evaluationPeriodDays,
      months: monthsInPeriod.toFixed(1),
    },
    profile: {
      usesBreathingDevice,
      deviceType,
      hasDiagnosis,
    },
    sleepLogs: {
      total: totalSleepLogs,
      withDaytimeSleepiness: daytimeSleepinessCount,
      unrestedNights,
      avgSleepQuality: avgSleepQuality ? avgSleepQuality.toFixed(1) : null,
      avgHoursSlept: avgHoursSlept ? avgHoursSlept.toFixed(1) : null,
    },
  };

  let supportedRating = null;
  let ratingRationale = [];
  let gaps = [];
  let requiresProfileSetup = false;

  // Determine rating based on profile and logs
  if (usesBreathingDevice === null) {
    // Profile not set up - need to collect this info
    requiresProfileSetup = true;
    supportedRating = null;
    ratingRationale = [
      'Sleep apnea profile not configured',
      'Need to know if you use a CPAP or other breathing device',
    ];
    gaps = [
      'Set up your Sleep Apnea profile in Settings',
      'Indicate whether you use a CPAP, BiPAP, or other breathing device',
      'Upload or note your sleep study diagnosis date',
    ];
  }
  else if (usesBreathingDevice === true) {
    // Uses breathing device = 50%
    supportedRating = 50;
    ratingRationale = [
      `Uses breathing assistance device (${deviceType || 'CPAP/BiPAP'})`,
      'Meets criteria for 50% rating under DC 6847',
    ];
    gaps = [
      'Maintain records of device compliance (usage data)',
      'Keep prescription and sleep study on file',
      'Document any issues or adjustments to treatment',
    ];

    // Note: 100% would require respiratory failure/tracheostomy - rare
    if (totalSleepLogs > 0) {
      ratingRationale.push(`${totalSleepLogs} sleep logs documented in evaluation period`);
    }
  }
  else if (usesBreathingDevice === false && hasDiagnosis === true) {
    // Has diagnosis but no device - check for daytime sleepiness
    const sleepinessRatio = totalSleepLogs > 0 ? daytimeSleepinessCount / totalSleepLogs : 0;

    if (sleepinessRatio >= 0.5 || unrestedNights >= 10) {
      // Persistent daytime hypersomnolence = 30%
      supportedRating = 30;
      ratingRationale = [
        'Diagnosed sleep apnea without breathing device',
        `${unrestedNights} nights feeling unrested logged`,
        `${(sleepinessRatio * 100).toFixed(0)}% of logs indicate daytime sleepiness`,
        'Pattern suggests persistent daytime hypersomnolence',
      ];
      gaps = [
        'Continue documenting daytime sleepiness and fatigue',
        'Note impact on work and daily activities',
        'If sleepiness is severe, discuss CPAP with your doctor (would support 50%)',
      ];
    }
    else if (totalSleepLogs === 0) {
      supportedRating = 0;
      ratingRationale = [
        'Diagnosed sleep apnea',
        'No sleep logs in evaluation period',
        'Cannot assess daytime sleepiness without logged data',
      ];
      gaps = [
        'Start logging sleep quality and daytime sleepiness',
        'Document nights where you wake feeling unrested',
        'Note any daytime fatigue or difficulty staying awake',
      ];
    }
    else {
      // Asymptomatic or mild symptoms = 0%
      supportedRating = 0;
      ratingRationale = [
        'Diagnosed sleep apnea without breathing device',
        `${totalSleepLogs} sleep logs, but insufficient daytime sleepiness documented`,
        'Current evidence supports 0% (asymptomatic with documented diagnosis)',
      ];
      gaps = [
        'If you experience daytime sleepiness, document it consistently',
        'Log when you feel unrested after sleeping',
        'Consider whether a CPAP/BiPAP might be beneficial (would support 50%)',
      ];
    }
  }
  else {
    // No diagnosis or incomplete information
    supportedRating = null;
    requiresProfileSetup = true;
    ratingRationale = [
      'Insufficient profile information',
    ];
    gaps = [
      'Confirm whether you have a sleep apnea diagnosis',
      'If diagnosed, indicate whether you use a breathing device',
      'Obtain a sleep study if you suspect sleep apnea',
    ];
  }

  return {
    hasData: totalSleepLogs > 0 || usesBreathingDevice !== null,
    requiresProfileSetup,
    condition: 'Sleep Apnea',
    diagnosticCode: '6847',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: SLEEP_APNEA_CRITERIA,
    disclaimer: 'This analysis is for documentation guidance only. The VA makes all final rating determinations based on the complete evidence of record, including sleep studies and medical examinations.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - PTSD
// ============================================

// ============================================
// ANALYSIS FUNCTIONS - SHARED MENTAL HEALTH
// ============================================

/**
 * Shared analysis function for all mental health conditions
 * All mental health DCs (9201-9440) use the General Rating Formula
 *
 * @param {Array} logs - All symptom logs
 * @param {string} conditionId - Condition ID from CONDITIONS
 * @param {Array} symptomIds - Array of symptom IDs to filter for
 * @param {Object} conditionCriteria - The criteria object for this condition
 * @param {Object} options - Analysis options
 */
const analyzeMentalHealthCondition = (logs, conditionId, symptomIds, conditionCriteria, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for condition-specific symptoms
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: `No ${conditionCriteria.condition} symptom logs found in the evaluation period`,
      supportedRating: null,
      evidence: [],
      gaps: [
        `Start logging ${conditionCriteria.condition} symptoms`,
        'Include notes about how symptoms affect work and relationships',
        'Document treatment and medication if applicable',
      ],
    };
  }

  // Count by symptom type
  const symptomCounts = {};
  symptomIds.forEach(id => {
    symptomCounts[id] = relevantLogs.filter(l => l.symptomId === id).length;
  });

  const totalSymptoms = relevantLogs.length;
  const monthsInPeriod = evaluationPeriodDays / 30;
  const symptomsPerMonth = totalSymptoms / monthsInPeriod;

  // Calculate weekly panic attack frequency (key criterion for 50%)
  const weeksInPeriod = evaluationPeriodDays / 7;
  const panicSymptomIds = symptomIds.filter(id =>
      id.includes('panic') || id === 'ptsd-panic' || id === 'panic-attack'
  );
  const panicCount = relevantLogs.filter(l => panicSymptomIds.includes(l.symptomId)).length;
  const panicPerWeek = panicCount / weeksInPeriod;

  // Count unique symptom types present
  const symptomTypesPresent = Object.entries(symptomCounts)
  .filter(([_, count]) => count > 0)
  .map(([type, _]) => type);

  // Find oldest and newest logs
  const oldestLog = relevantLogs.reduce((oldest, log) =>
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest
  );
  const newestLog = relevantLogs.reduce((newest, log) =>
      new Date(log.timestamp) > new Date(newest.timestamp) ? log : newest
  );

  // Analyze notes for functional impact keywords
  const impactKeywords = {
    work: ['work', 'job', 'employment', 'productivity', 'performance', 'absent', 'late', 'called off'],
    social: ['relationship', 'family', 'friends', 'isolated', 'alone', 'avoiding', 'social'],
    daily: ['shower', 'hygiene', 'eat', 'sleep', 'basic', 'daily', 'routine'],
    severe: ['suicidal', 'hospital', 'emergency', 'crisis', 'violent', 'dangerous'],
  };

  const notesAnalysis = {
    workImpact: 0,
    socialImpact: 0,
    dailyImpact: 0,
    severeSymptoms: 0,
  };

  relevantLogs.forEach(log => {
    const notes = (log.notes || '').toLowerCase();
    if (impactKeywords.work.some(kw => notes.includes(kw))) notesAnalysis.workImpact++;
    if (impactKeywords.social.some(kw => notes.includes(kw))) notesAnalysis.socialImpact++;
    if (impactKeywords.daily.some(kw => notes.includes(kw))) notesAnalysis.dailyImpact++;
    if (impactKeywords.severe.some(kw => notes.includes(kw))) notesAnalysis.severeSymptoms++;
  });

  const evidence = {
    evaluationPeriod: {
      startDate: oldestLog.timestamp,
      endDate: newestLog.timestamp,
      days: evaluationPeriodDays,
      months: monthsInPeriod.toFixed(1),
    },
    totalSymptoms,
    symptomsPerMonth: symptomsPerMonth.toFixed(1),
    symptomBreakdown: symptomCounts,
    symptomTypesPresent,
    panicAttacks: {
      total: panicCount,
      perWeek: panicPerWeek.toFixed(1),
    },
    functionalImpact: notesAnalysis,
  };

  let supportedRating = null;
  let ratingRationale = [];
  let gaps = [];
  let assessmentLevel = 'preliminary';

  // IMPORTANT: Mental health ratings require professional evaluation
  // Symptom logs alone cannot determine ratings. This is guidance only.

  // Check for indicators of severe functional impairment
  if (notesAnalysis.severeSymptoms > 0) {
    supportedRating = '70-100';
    assessmentLevel = 'requires-professional-evaluation';
    ratingRationale = [
      'Logged symptoms indicate severe impairment requiring immediate professional evaluation',
      'Notes reference crisis-level symptoms',
      'CRITICAL: If experiencing suicidal thoughts, call Veterans Crisis Line: 988 then Press 1',
    ];
    gaps = [
      'Seek immediate mental health treatment',
      'Document all treatment and hospitalizations',
      'Request comprehensive functional assessment from mental health provider',
    ];
  }
  // Check for indicators suggesting 50-70% range
  else if (
      panicPerWeek > 1 ||
      (symptomsPerMonth > 12 && symptomTypesPresent.length >= 3) ||
      (notesAnalysis.workImpact > 5 && notesAnalysis.socialImpact > 5)
  ) {
    supportedRating = '50-70';
    assessmentLevel = 'requires-professional-evaluation';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      panicPerWeek > 1 ? `Panic attacks: ${panicPerWeek.toFixed(1)} per week (>1/week supports 50%+)` : '',
      symptomTypesPresent.length >= 3 ? `Multiple symptom types present` : '',
      notesAnalysis.workImpact > 5 ? `${notesAnalysis.workImpact} logs mention work impact` : '',
      notesAnalysis.socialImpact > 5 ? `${notesAnalysis.socialImpact} logs mention social/relationship impact` : '',
      'Pattern suggests significant functional impairment',
    ].filter(Boolean);
    gaps = [
      'Professional evaluation required to assess functional impairment level',
      'Document specific work difficulties (attendance, productivity, relationships)',
      'Document social/relationship difficulties',
      'Maintain continuous mental health treatment records',
      'Request detailed statement from mental health provider about functional limitations',
    ];
  }
  // Check for indicators suggesting 30% range
  else if (
      (panicPerWeek >= 0.25 && panicPerWeek <= 1) ||
      (symptomsPerMonth >= 4 && symptomTypesPresent.length >= 2) ||
      (notesAnalysis.workImpact >= 2 || notesAnalysis.socialImpact >= 2)
  ) {
    supportedRating = '30';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      panicPerWeek >= 0.25 ? `Panic-related symptoms: ${panicPerWeek.toFixed(1)} per week (weekly or less)` : '',
      `${symptomTypesPresent.length} symptom types documented`,
      'Pattern suggests occasional decrease in work efficiency',
    ].filter(Boolean);
    gaps = [
      'Continue documenting all symptoms consistently',
      'Include specific details about functional impact in notes',
      'Document any work accommodations or difficulties',
      'Maintain regular mental health treatment',
      'Request provider statement on functional limitations',
    ];
  }
  // Check for indicators suggesting 10% range
  else if (totalSymptoms >= 3 || symptomTypesPresent.length >= 1) {
    supportedRating = '10';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      `Symptom types present: ${symptomTypesPresent.length}`,
      'Current evidence suggests mild or controlled symptoms',
    ];
    gaps = [
      `Ensure you have formal ${conditionCriteria.condition} diagnosis documentation`,
      'Document all treatment and medication',
      'If symptoms worsen, log them immediately with functional impact details',
      'Include notes about work or social impact when relevant',
    ];
  }
  else {
    supportedRating = '0-10';
    ratingRationale = [
      `${totalSymptoms} symptoms logged - limited evidence of ongoing symptoms`,
      'Formal diagnosis documentation required',
    ];
    gaps = [
      `Obtain formal ${conditionCriteria.condition} diagnosis from qualified mental health provider`,
      'Document all symptoms, even if mild',
      'Include treatment/medication records',
      'Log symptoms consistently to establish pattern',
    ];
  }

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    assessmentLevel,
    evidence,
    gaps,
    criteria: conditionCriteria,
    disclaimer: 'CRITICAL DISCLAIMER: Mental health ratings are based on professional evaluation of functional impairment in work and social settings, not symptom frequency alone. This analysis helps you understand what your documentation might support, but a comprehensive mental health evaluation is required for any rating determination. All mental health concerns should be discussed with a qualified provider.',
    crisisResources: {
      veteransCrisisLine: '988 then Press 1',
      text: '838255',
      chat: 'https://www.veteranscrisisline.net/get-help-now/chat/',
    },
  };
};

// ============================================
// ANALYSIS FUNCTIONS - SPECIFIC MENTAL HEALTH CONDITIONS
// ============================================

/**
 * Analyzes PTSD symptom logs
 */
export const analyzePTSDLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'ptsd',
      CONDITIONS.PTSD.symptomIds,
      PTSD_CRITERIA,
      options
  );
};

/**
 * Analyzes Major Depression symptom logs
 */
export const analyzeMajorDepressionLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'major-depression',
      CONDITIONS.MAJOR_DEPRESSION.symptomIds,
      MAJOR_DEPRESSION_CRITERIA,
      options
  );
};

/**
 * Analyzes Generalized Anxiety Disorder symptom logs
 */
export const analyzeGeneralizedAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'generalized-anxiety',
      CONDITIONS.GENERALIZED_ANXIETY.symptomIds,
      GENERALIZED_ANXIETY_CRITERIA,
      options
  );
};

/**
 * Analyzes Panic Disorder symptom logs
 */
export const analyzePanicDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'panic-disorder',
      CONDITIONS.PANIC_DISORDER.symptomIds,
      PANIC_DISORDER_CRITERIA,
      options
  );
};

/**
 * Analyzes Bipolar Disorder symptom logs
 */
export const analyzeBipolarLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'bipolar',
      CONDITIONS.BIPOLAR.symptomIds,
      BIPOLAR_CRITERIA,
      options
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMigraineRatingCriteria = (percent) => {
  return MIGRAINE_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getSleepApneaRatingCriteria = (percent) => {
  return SLEEP_APNEA_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllMigraineRatings = () => {
  return MIGRAINE_CRITERIA.ratings;
};

export const getAllSleepApneaRatings = () => {
  return SLEEP_APNEA_CRITERIA.ratings;
};

export const getMigraineDefinition = (term) => {
  return MIGRAINE_CRITERIA.definitions[term] || null;
};

export const getSleepApneaDefinition = (term) => {
  return SLEEP_APNEA_CRITERIA.definitions[term] || null;
};

export const getPTSDRatingCriteria = (percent) => {
  return PTSD_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllPTSDRatings = () => {
  return PTSD_CRITERIA.ratings;
};

export const getPTSDDefinition = (term) => {
  return PTSD_CRITERIA.definitions[term] || null;
};

export const getMajorDepressionRatingCriteria = (percent) => {
  return MAJOR_DEPRESSION_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllMajorDepressionRatings = () => {
  return MAJOR_DEPRESSION_CRITERIA.ratings;
};

export const getMajorDepressionDefinition = (term) => {
  return MAJOR_DEPRESSION_CRITERIA.definitions[term] || null;
};

export const getGeneralizedAnxietyRatingCriteria = (percent) => {
  return GENERALIZED_ANXIETY_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllGeneralizedAnxietyRatings = () => {
  return GENERALIZED_ANXIETY_CRITERIA.ratings;
};

export const getGeneralizedAnxietyDefinition = (term) => {
  return GENERALIZED_ANXIETY_CRITERIA.definitions[term] || null;
};

export const getPanicDisorderRatingCriteria = (percent) => {
  return PANIC_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllPanicDisorderRatings = () => {
  return PANIC_DISORDER_CRITERIA.ratings;
};

export const getPanicDisorderDefinition = (term) => {
  return PANIC_DISORDER_CRITERIA.definitions[term] || null;
};

export const getBipolarRatingCriteria = (percent) => {
  return BIPOLAR_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllBipolarRatings = () => {
  return BIPOLAR_CRITERIA.ratings;
};

export const getBipolarDefinition = (term) => {
  return BIPOLAR_CRITERIA.definitions[term] || null;
};

export const formatRating = (percent) => {
  if (percent === null) return 'N/A';
  return `${percent}%`;
};

export const getRatingColorClass = (percent) => {
  switch (percent) {
    case 100:
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
    case 50:
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
    case 30:
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
    case 10:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
    case 0:
      return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600';
  }
};

export const getEvaluationPeriod = (days = 90) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate,
    endDate,
    days,
    months: (days / 30).toFixed(1),
  };
};