// ============================================
// VA RATING CRITERIA - DATA STRUCTURE & ANALYSIS
// ============================================
// Based on 38 CFR Part 4 - Schedule for Rating Disabilities
// This file contains rating criteria definitions and logic to
// analyze logged symptoms against VA evaluation standards.
//
// DISCLAIMER: This is for documentation guidance only.
// The VA makes all final rating determinations.


import { getMeasurements, analyzeBloodPressurePredominance, getAverageBloodPressure } from './measurements';


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
    symptomIds: [
      'ptsd-nightmare',
      'ptsd-flashback',
      'ptsd-hypervigilance',
      'ptsd-avoidance',
      'ptsd-panic',
      'nightmares'], // Include old 'nightmares' for backward compatibility
  },
  MAJOR_DEPRESSION: {
    id: 'major-depression',
    name: 'Major Depressive Disorder',
    diagnosticCode: '9434',
    cfrReference: '38 CFR 4.130',
    symptomIds: [
      'depression',
      'mdd-episode',
      'mdd-anhedonia',
      'mdd-hopelessness'],
  },
  GENERALIZED_ANXIETY: {
    id: 'generalized-anxiety',
    name: 'Generalized Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: [
      'anxiety',
      'gad-worry',
      'gad-restlessness',
      'gad-muscle-tension'], // 'anxiety' for backward compatibility
  },
  PANIC_DISORDER: {
    id: 'panic-disorder',
    name: 'Panic Disorder',
    diagnosticCode: '9412',
    cfrReference: '38 CFR 4.130',
    symptomIds: [
      'panic-attack',
      'panic-agoraphobia',
      'panic-anticipatory-anxiety'],
  },
  BIPOLAR: {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    diagnosticCode: '9432',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['bipolar-manic', 'bipolar-depressive', 'bipolar-mixed'],
  },
  LUMBOSACRAL_STRAIN: {
    id: 'lumbosacral-strain',
    name: 'Lumbosacral Strain (Low Back Pain)',
    diagnosticCode: '5237',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'lower-back-pain',
      'back-pain',
      'back-stiffness',
      'back-spasm',
      'back-radicular',
      'back-numbness'],
  },
  INTERVERTEBRAL_DISC: {
    id: 'intervertebral-disc',
    name: 'Intervertebral Disc Syndrome',
    diagnosticCode: '5243',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'disc-pain',
      'back-pain',
      'back-radicular',
      'lower-back-pain',
      'back-numbness'],
  },
  KNEE_INSTABILITY: {
    id: 'knee-instability',
    name: 'Knee Instability',
    diagnosticCode: '5257',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'knee-instability',
      'knee-pain',
      'knee-swelling',
      'knee-stiffness',
      'knee-locking'],
  },
  TBI: {
    id: 'tbi',
    name: 'Traumatic Brain Injury (TBI)',
    diagnosticCode: '8045',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'tbi-memory',
      'tbi-concentration',
      'tbi-confusion',
      'tbi-headache',
      'tbi-mood',
      'tbi-sleep'],
  },
  HYPERTENSION: {
    id: 'hypertension',
    name: 'Hypertension',
    diagnosticCode: '7101',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'high-blood-pressure',
      'hypertension-headache',
      'chest-pressure',
      'palpitations'],
  },
  DIABETES: {
    id: 'diabetes',
    name: 'Diabetes Mellitus',
    diagnosticCode: '7913',
    cfrReference: '38 CFR 4.119',
    symptomIds: ['fatigue', 'dizziness', 'weakness', 'frequent-urination', 'excessive-thirst'],
  },
  TINNITUS: {
    id: 'tinnitus',
    name: 'Tinnitus',
    diagnosticCode: '6260',
    cfrReference: '38 CFR 4.87',
    symptomIds: ['tinnitus'],
  },
  FIBROMYALGIA: {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    diagnosticCode: '5025',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'fibro-widespread-pain',
      'fibro-tender-points',
      'fibro-fatigue',
      'fibro-sleep',
      'fibro-stiffness',
      'fibro-cognitive'],
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
  const prostratingMigraines = relevantLogs.filter(
      log => log.migraineData?.prostrating === true);
  const prostratingCount = prostratingMigraines.length;

  const prolongedDurations = ['4-24h', '1-2d', 'more-than-2d', 'ongoing'];
  const prolongedMigraines = prostratingMigraines.filter(log =>
      prolongedDurations.includes(log.migraineData?.duration),
  );
  const prolongedCount = prolongedMigraines.length;

  const monthsInPeriod = evaluationPeriodDays / 30;
  const totalPerMonth = totalMigraines / monthsInPeriod;
  const prostratingPerMonth = prostratingCount / monthsInPeriod;
  const prolongedProstratingPerMonth = prolongedCount / monthsInPeriod;

  const oldestLog = relevantLogs.reduce((oldest, log) =>
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest,
  );
  const newestLog = relevantLogs.reduce((newest, log) =>
      new Date(log.timestamp) > new Date(newest.timestamp) ? log : newest,
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
      `${prostratingPerMonth.toFixed(
          1)} prostrating attacks per month (â‰¥4 required)`,
      `${prolongedCount} prolonged attacks documented`,
      'Pattern suggests very frequent, prostrating, prolonged attacks',
    ];
    gaps = [
      'Consider documenting work impact (missed days, reduced productivity)',
      'Note any job accommodations needed due to migraines',
    ];
  } else if (prostratingPerMonth >= 1) {
    supportedRating = 30;
    ratingRationale = [
      `${prostratingPerMonth.toFixed(
          1)} prostrating attacks per month (â‰¥1 required)`,
      'Pattern supports characteristic prostrating attacks averaging monthly',
    ];
    gaps = [];
    if (prolongedCount === 0) {
      gaps.push(
          'Document duration of attacks (4+ hours supports higher rating)');
    }
    if (prostratingPerMonth < 4) {
      gaps.push(`Current frequency (${prostratingPerMonth.toFixed(
          1)}/month) - 4+/month may support 50% rating`);
    }
  } else if (prostratingPerMonth >= 0.5) {
    supportedRating = 10;
    ratingRationale = [
      `${prostratingPerMonth.toFixed(1)} prostrating attacks per month`,
      'Pattern supports prostrating attacks averaging once every 2 months',
    ];
    gaps = [
      `Increase documentation frequency - 1+/month may support 30% rating`,
      'Ensure all prostrating episodes are logged',
    ];
  } else {
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
export const analyzeSleepApneaLogs = (
    logs, sleepApneaProfile = {}, options = {}) => {
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
      ?
      logsWithQuality.reduce((sum, log) => sum + log.sleepData.quality, 0) /
      logsWithQuality.length
      :
      null;

  // Count nights feeling unrested
  const unrestedNights = relevantLogs.filter(
      log => log.sleepData?.feelRested === false).length;

  // Average hours slept
  const logsWithHours = relevantLogs.filter(log => log.sleepData?.hoursSlept);
  const avgHoursSlept = logsWithHours.length > 0
      ?
      logsWithHours.reduce(
          (sum, log) => sum + parseFloat(log.sleepData.hoursSlept), 0) /
      logsWithHours.length
      :
      null;

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
  } else if (usesBreathingDevice === true) {
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
      ratingRationale.push(
          `${totalSleepLogs} sleep logs documented in evaluation period`);
    }
  } else if (usesBreathingDevice === false && hasDiagnosis === true) {
    // Has diagnosis but no device - check for daytime sleepiness
    const sleepinessRatio = totalSleepLogs > 0 ?
        daytimeSleepinessCount / totalSleepLogs :
        0;

    if (sleepinessRatio >= 0.5 || unrestedNights >= 10) {
      // Persistent daytime hypersomnolence = 30%
      supportedRating = 30;
      ratingRationale = [
        'Diagnosed sleep apnea without breathing device',
        `${unrestedNights} nights feeling unrested logged`,
        `${(sleepinessRatio * 100).toFixed(
            0)}% of logs indicate daytime sleepiness`,
        'Pattern suggests persistent daytime hypersomnolence',
      ];
      gaps = [
        'Continue documenting daytime sleepiness and fatigue',
        'Note impact on work and daily activities',
        'If sleepiness is severe, discuss CPAP with your doctor (would support 50%)',
      ];
    } else if (totalSleepLogs === 0) {
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
    } else {
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
  } else {
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
const analyzeMentalHealthCondition = (
    logs, conditionId, symptomIds, conditionCriteria, options = {}) => {
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
      id.includes('panic') || id === 'ptsd-panic' || id === 'panic-attack',
  );
  const panicCount = relevantLogs.filter(
      l => panicSymptomIds.includes(l.symptomId)).length;
  const panicPerWeek = panicCount / weeksInPeriod;

  // Count unique symptom types present
  const symptomTypesPresent = Object.entries(symptomCounts).
      filter(([_, count]) => count > 0).
      map(([type, _]) => type);

  // Find oldest and newest logs
  const oldestLog = relevantLogs.reduce((oldest, log) =>
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest,
  );
  const newestLog = relevantLogs.reduce((newest, log) =>
      new Date(log.timestamp) > new Date(newest.timestamp) ? log : newest,
  );

  // Analyze notes for functional impact keywords
  const impactKeywords = {
    work: [
      'work',
      'job',
      'employment',
      'productivity',
      'performance',
      'absent',
      'late',
      'called off'],
    social: [
      'relationship',
      'family',
      'friends',
      'isolated',
      'alone',
      'avoiding',
      'social'],
    daily: ['shower', 'hygiene', 'eat', 'sleep', 'basic', 'daily', 'routine'],
    severe: [
      'suicidal',
      'hospital',
      'emergency',
      'crisis',
      'violent',
      'dangerous'],
  };

  const notesAnalysis = {
    workImpact: 0,
    socialImpact: 0,
    dailyImpact: 0,
    severeSymptoms: 0,
  };

  relevantLogs.forEach(log => {
    const notes = (log.notes || '').toLowerCase();
    if (impactKeywords.work.some(
        kw => notes.includes(kw))) notesAnalysis.workImpact++;
    if (impactKeywords.social.some(
        kw => notes.includes(kw))) notesAnalysis.socialImpact++;
    if (impactKeywords.daily.some(
        kw => notes.includes(kw))) notesAnalysis.dailyImpact++;
    if (impactKeywords.severe.some(
        kw => notes.includes(kw))) notesAnalysis.severeSymptoms++;
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
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(
          1)} months`,
      panicPerWeek > 1 ?
          `Panic attacks: ${panicPerWeek.toFixed(
              1)} per week (>1/week supports 50%+)` :
          '',
      symptomTypesPresent.length >= 3 ? `Multiple symptom types present` : '',
      notesAnalysis.workImpact > 5 ?
          `${notesAnalysis.workImpact} logs mention work impact` :
          '',
      notesAnalysis.socialImpact > 5 ?
          `${notesAnalysis.socialImpact} logs mention social/relationship impact` :
          '',
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
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(
          1)} months`,
      panicPerWeek >= 0.25 ?
          `Panic-related symptoms: ${panicPerWeek.toFixed(
              1)} per week (weekly or less)` :
          '',
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
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(
          1)} months`,
      `Symptom types present: ${symptomTypesPresent.length}`,
      'Current evidence suggests mild or controlled symptoms',
    ];
    gaps = [
      `Ensure you have formal ${conditionCriteria.condition} diagnosis documentation`,
      'Document all treatment and medication',
      'If symptoms worsen, log them immediately with functional impact details',
      'Include notes about work or social impact when relevant',
    ];
  } else {
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
      options,
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
      options,
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
      options,
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
      options,
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
      options,
  );
};

// ============================================
// LUMBOSACRAL STRAIN / LOW BACK PAIN (DC 5237)
// ============================================

export const LUMBOSACRAL_STRAIN_CRITERIA = {
  diagnosticCode: '5237',
  condition: 'Lumbosacral Strain (Low Back Pain)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5237',

  ratings: [
    {
      percent: 100,
      summary: 'Unfavorable ankylosis of the entire spine',
      criteriaDescription: [
        'Complete fusion of the spine in an unfavorable position',
        'Extremely severe and disabling condition',
      ],
      evidenceNeeded: [
        'Medical imaging (X-ray, CT, MRI) showing complete spinal fusion',
        'Clinical examination documenting complete loss of spinal motion',
        'Inability to perform basic activities of daily living',
      ],
    },
    {
      percent: 50,
      summary: 'Unfavorable ankylosis of the entire thoracolumbar spine',
      criteriaDescription: [
        'Complete fusion of the low and mid back in unfavorable position',
        'Severe limitation of mobility',
      ],
      evidenceNeeded: [
        'Imaging showing thoracolumbar ankylosis',
        'Clinical ROM measurements showing no motion',
        'Documentation of significant functional impairment',
      ],
    },
    {
      percent: 40,
      summary: 'Forward flexion of thoracolumbar spine 30 degrees or less, OR favorable ankylosis',
      criteriaDescription: [
        'Forward flexion 30° or less (normal is 90°)',
        'OR complete fusion in favorable (functional) position',
        'Significant but manageable limitation',
      ],
      evidenceNeeded: [
        'Range of motion measurements by healthcare provider',
        'Goniometer readings documenting limitation',
        'Consistent documentation over time',
      ],
    },
    {
      percent: 20,
      summary: 'Forward flexion 30-60 degrees, OR muscle spasm/guarding causing abnormal gait/spinal contour',
      criteriaDescription: [
        'Forward flexion between 30-60° (vs normal 90°)',
        'OR combined ROM 120° or less (vs normal 240°)',
        'OR muscle spasm severe enough to cause abnormal gait, scoliosis, or abnormal curvature',
      ],
      evidenceNeeded: [
        'ROM measurements showing limitation',
        'Clinical notes documenting muscle spasm or guarding',
        'Observation of abnormal gait or spinal contour',
        'Functional impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Forward flexion 60-85 degrees, OR localized tenderness not causing abnormal gait',
      criteriaDescription: [
        'Forward flexion between 60-85° (vs normal 90°)',
        'OR combined ROM 120-235° (vs normal 240°)',
        'OR muscle spasm/guarding/tenderness without abnormal gait',
        'OR vertebral fracture with 50%+ height loss',
      ],
      evidenceNeeded: [
        'ROM measurements in the specified range',
        'Clinical examination notes',
        'Documentation of pain and functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'Mild limitation or symptoms controlled',
      criteriaDescription: [
        'Forward flexion greater than 85°',
        'Minimal functional impact',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    forwardFlexion: {
      term: 'Forward Flexion',
      definition: 'Bending forward at the waist. Normal is 90 degrees (touching toes). Measured by healthcare provider using goniometer.',
    },
    ankylosis: {
      term: 'Ankylosis',
      definition: 'Complete fusion or fixation of a joint/spine segment. "Favorable" means in a functional position; "unfavorable" means in a non-functional position.',
    },
    muscleSpasm: {
      term: 'Muscle Spasm/Guarding',
      definition: 'Involuntary muscle contraction or protective muscle tensing. Severe enough to cause abnormal walking pattern or visible spinal curvature.',
    },
  },
};

// ============================================
// INTERVERTEBRAL DISC SYNDROME (DC 5243)
// ============================================

export const INTERVERTEBRAL_DISC_CRITERIA = {
  diagnosticCode: '5243',
  condition: 'Intervertebral Disc Syndrome',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5243',

  note: 'Assigned only when there is disc herniation with compression/irritation of adjacent nerve root. Evaluated either under General Rating Formula for Spine OR based on Incapacitating Episodes, whichever is higher.',

  ratingsIncapacitatingEpisodes: [
    {
      percent: 60,
      summary: '6+ weeks of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration of incapacitating episodes: 6 weeks or more in past year',
        'Episodes require bed rest prescribed by physician',
        'Episodes require treatment by physician',
      ],
      evidenceNeeded: [
        'Medical records documenting each incapacitating episode',
        'Physician notes prescribing bed rest',
        'Treatment records for each episode',
        'Clear documentation of episode duration',
      ],
    },
    {
      percent: 40,
      summary: '4-6 weeks (but less than 6) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 4 weeks to less than 6 weeks in past year',
        'Requires physician-prescribed bed rest and treatment',
      ],
      evidenceNeeded: [
        'Documentation of each episode',
        'Physician orders for bed rest',
        'Treatment records',
      ],
    },
    {
      percent: 20,
      summary: '2-4 weeks (but less than 4) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 2 weeks to less than 4 weeks in past year',
        'Physician-prescribed bed rest and treatment required',
      ],
      evidenceNeeded: [
        'Episode documentation',
        'Bed rest orders',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: '1-2 weeks (but less than 2) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 1 week to less than 2 weeks in past year',
        'Physician-prescribed bed rest and treatment',
      ],
      evidenceNeeded: [
        'Episode documentation',
        'Physician orders',
        'Treatment records',
      ],
    },
  ],

  // Can also be rated under General Rating Formula for Spine (same as DC 5237)
  ratingsGeneralFormula: LUMBOSACRAL_STRAIN_CRITERIA.ratings,

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode',
      definition: 'A period of acute signs and symptoms due to disc syndrome that requires bed rest prescribed by a physician AND treatment by a physician. Both requirements must be met.',
      emphasis: 'CRITICAL: Episodes are only counted if BOTH bed rest was prescribed AND treatment was provided by a physician.',
    },
    discHerniation: {
      term: 'Disc Herniation',
      definition: 'Bulging or rupture of the intervertebral disc causing compression or irritation of the adjacent nerve root. Must be confirmed by imaging (MRI/CT).',
    },
  },
};

// ============================================
// KNEE INSTABILITY (DC 5257)
// ============================================

export const KNEE_INSTABILITY_CRITERIA = {
  diagnosticCode: '5257',
  condition: 'Knee, Other Impairment (Instability)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5257',

  ratings: [
    {
      percent: 30,
      summary: 'Unrepaired/failed complete ligament tear + medical provider prescribes BOTH assistive device AND bracing',
      criteriaDescription: [
        'Complete ligament tear (unrepaired OR failed repair)',
        'Causing persistent instability',
        'Medical provider prescribes BOTH:',
        '  - Assistive device (cane, crutches, or walker) for ambulation',
        '  - AND knee brace for ambulation',
      ],
      evidenceNeeded: [
        'MRI or surgical records confirming complete ligament tear',
        'Documentation of failed repair (if applicable)',
        'Written prescription for assistive device',
        'Written prescription for knee brace',
        'Clinical notes documenting persistent instability',
      ],
    },
    {
      percent: 20,
      summary: 'Ligament injury + prescribed brace OR assistive device (but not both)',
      criteriaDescription: [
        'Sprain, incomplete tear, OR repaired complete tear causing persistent instability',
        'Medical provider prescribes brace OR assistive device',
        'OR: Unrepaired/failed complete tear + prescribed brace OR device (but not both)',
      ],
      evidenceNeeded: [
        'Imaging/surgical documentation of ligament injury',
        'Prescription for either brace OR assistive device',
        'Clinical documentation of instability',
      ],
    },
    {
      percent: 10,
      summary: 'Ligament injury with persistent instability, no prescription for brace/device required',
      criteriaDescription: [
        'Sprain, incomplete tear, OR complete tear (any repair status)',
        'Causing persistent instability',
        'No requirement for prescribed brace or assistive device',
      ],
      evidenceNeeded: [
        'Documentation of ligament injury',
        'Clinical examination showing instability',
        'Functional limitations documented',
      ],
    },
  ],

  definitions: {
    completeLigamentTear: {
      term: 'Complete Ligament Tear',
      definition: 'Full-thickness rupture of ligament (typically ACL, PCL, MCL, or LCL). Confirmed by MRI or surgical findings.',
    },
    persistentInstability: {
      term: 'Persistent Instability',
      definition: 'Ongoing knee giving way, buckling, or feeling unstable despite treatment. Documented by clinical examination showing positive instability tests (Lachman, drawer, etc.).',
    },
    assistiveDevice: {
      term: 'Assistive Device',
      definition: 'Cane(s), crutch(es), or walker prescribed by medical provider to aid in walking.',
    },
  },
};

// ============================================
// TRAUMATIC BRAIN INJURY (DC 8045)
// ============================================

export const TBI_CRITERIA = {
  diagnosticCode: '8045',
  condition: 'Residuals of Traumatic Brain Injury (TBI)',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8045',

  note: 'TBI is rated based on 3 main areas: (1) Cognitive impairment, (2) Emotional/behavioral (rated under mental disorders), (3) Physical residuals (rated under specific codes). This addresses cognitive impairment and subjective symptoms only.',

  ratings: [
    {
      percent: 100,
      summary: 'Total impairment - ANY facet rated as "Total"',
      criteriaDescription: [
        'If ANY of the 10 facets is rated as "Total," assign 100%',
        'Examples: Total occupational/social inadaptability, requires 24-hour supervision, completely unable to communicate',
      ],
      evidenceNeeded: [
        'Neuropsychological evaluation',
        'Comprehensive cognitive assessment',
        'Functional capacity evaluation',
        'Documentation of total impairment in at least one area',
      ],
    },
    {
      percent: 70,
      summary: 'Severe impairment - Highest facet rated as "3"',
      criteriaDescription: [
        'If highest facet level is "3" (and none are "Total")',
        'Examples: Severe memory impairment, severe difficulty with executive functions, requires supervision for safety',
      ],
      evidenceNeeded: [
        'Neuropsych testing showing severe deficits',
        'Documentation of functional limitations',
        'Clinical notes supporting severity',
      ],
    },
    {
      percent: 40,
      summary: 'Moderate impairment - Highest facet rated as "2"',
      criteriaDescription: [
        'If highest facet level is "2" (and none are "3" or "Total")',
        'Examples: Moderate memory problems, difficulty with complex tasks, some assistance needed',
      ],
      evidenceNeeded: [
        'Neuropsych testing showing moderate deficits',
        'Functional limitations documented',
        'Impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Mild impairment - Highest facet rated as "1"',
      criteriaDescription: [
        'If highest facet level is "1" (and none are higher)',
        'Examples: Mild memory issues, occasional difficulty concentrating, minimal impact',
      ],
      evidenceNeeded: [
        'Clinical documentation of mild symptoms',
        'Some objective findings',
        'Minimal functional impact',
      ],
    },
    {
      percent: 0,
      summary: 'No compensable impairment - All facets rated as "0"',
      criteriaDescription: [
        'Diagnosed TBI but no current impairment in any facet',
        'Or symptoms not attributable to TBI',
      ],
      evidenceNeeded: [],
    },
  ],

  facets: {
    description: 'TBI is evaluated across 10 facets. Each facet is rated 0-3 or "Total". The highest single facet determines the overall rating.',
    list: [
      'Memory, attention, concentration, executive functions',
      'Judgment',
      'Social interaction',
      'Orientation',
      'Motor activity',
      'Visual-spatial orientation',
      'Subjective symptoms',
      'Neurobehavioral effects',
      'Communication',
      'Consciousness',
    ],
  },

  definitions: {
    cognitiveImpairment: {
      term: 'Cognitive Impairment',
      definition: 'Decreased memory, concentration, attention, and executive functions (goal setting, planning, organizing, problem solving, judgment, decision making).',
    },
    executiveFunctions: {
      term: 'Executive Functions',
      definition: 'Higher-level brain functions: goal setting, speed of processing, planning, organizing, prioritizing, self-monitoring, problem solving, judgment, decision making, spontaneity, flexibility.',
    },
    subjectiveSymptoms: {
      term: 'Subjective Symptoms',
      definition: 'Symptoms that may be the only residual of TBI: headaches, dizziness, fatigue, insomnia, mood changes. If these have a distinct diagnosis (e.g., migraine), rate under that specific code instead.',
    },
  },
};

// ============================================
// HYPERTENSION (DC 7101)
// ============================================

export const HYPERTENSION_CRITERIA = {
  diagnosticCode: '7101',
  condition: 'Hypertensive Vascular Disease (Hypertension)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7101',

  note: 'Hypertension must be confirmed by readings taken 2+ times on at least 3 different days. "Predominantly" means more than half the time during the evaluation period.',

  ratings: [
    {
      percent: 60,
      summary: 'Diastolic pressure predominantly 130 or more',
      criteriaDescription: [
        'Diastolic (bottom number) 130+ mmHg',
        'Sustained over evaluation period',
        'More than half of readings show this level',
      ],
      evidenceNeeded: [
        'Multiple BP readings over time',
        'Readings from at least 3 different days',
        'Documentation showing sustained elevation',
        'Treatment records',
      ],
    },
    {
      percent: 40,
      summary: 'Diastolic pressure predominantly 120 or more',
      criteriaDescription: [
        'Diastolic 120+ mmHg',
        'More than half of readings at this level',
      ],
      evidenceNeeded: [
        'Serial BP measurements',
        'Readings from multiple dates',
        'Treatment documentation',
      ],
    },
    {
      percent: 20,
      summary: 'Diastolic predominantly 110+, OR systolic predominantly 200+',
      criteriaDescription: [
        'Diastolic 110+ mmHg, OR',
        'Systolic (top number) 200+ mmHg',
        'Sustained over evaluation period',
      ],
      evidenceNeeded: [
        'Multiple BP readings documenting elevation',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Diastolic predominantly 100+, OR systolic predominantly 160+, OR requires continuous medication',
      criteriaDescription: [
        'Diastolic 100+ mmHg, OR',
        'Systolic 160+ mmHg, OR',
        'History of diastolic 100+ requiring continuous medication for control',
      ],
      evidenceNeeded: [
        'BP readings showing elevation',
        'Prescription records for antihypertensive medication',
        'Documentation of continuous medication requirement',
      ],
    },
    {
      percent: 0,
      summary: 'Controlled or below threshold',
      criteriaDescription: [
        'BP controlled below rating thresholds',
        'May be on medication but BP well-controlled',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    diastolic: {
      term: 'Diastolic Blood Pressure',
      definition: 'The bottom number in a BP reading (e.g., 120/80 - the "80"). Represents pressure when heart is resting between beats. Normal is below 80.',
    },
    systolic: {
      term: 'Systolic Blood Pressure',
      definition: 'The top number in a BP reading (e.g., 120/80 - the "120"). Represents pressure when heart contracts. Normal is below 120.',
    },
    predominantly: {
      term: 'Predominantly',
      definition: 'More than half the time during the evaluation period. For VA purposes, must be confirmed by readings taken 2+ times on at least 3 different days.',
    },
    continuousMedication: {
      term: 'Continuous Medication',
      definition: 'Ongoing daily medication to control blood pressure. Missing doses typically results in elevated readings.',
    },
  },
};

export const DIABETES_CRITERIA = {
  diagnosticCode: '7913',
  condition: 'Diabetes Mellitus',
  cfrReference: '38 CFR 4.119, Diagnostic Code 7913',

  ratings: [
    {
      percent: 100,
      summary: 'Requires more than one daily insulin injection with episodes requiring hospitalizations',
      criteria: {
        requiresInsulin: true,
        dailyInjections: 'multiple',
        restrictedDiet: true,
        ketoacidosisEpisodes: true,
        hospitalizationsPerYear: 3,
        progressiveLoss: true,
      },
      criteriaDescription: [
        'Requires more than one daily insulin injection',
        'Restricted diet required',
        'Episodes of ketoacidosis or hypoglycemic reactions requiring at least three hospitalizations per year OR weekly visits to diabetic care provider',
        'Progressive loss of weight and strength OR complications that would be compensable if separately evaluated',
      ],
      evidenceNeeded: [
        'Documentation of multiple daily insulin injections',
        'Record of hospitalizations for ketoacidosis or hypoglycemia',
        'Evidence of progressive weight loss or strength decline',
        'Glucose logs showing poor control despite treatment',
        'HbA1c consistently >9% indicating poor control',
      ],
    },
    {
      percent: 60,
      summary: 'Requires insulin with regulation of activities and episodes requiring hospitalization',
      criteria: {
        requiresInsulin: true,
        restrictedDiet: true,
        activityRegulation: true,
        ketoacidosisEpisodes: true,
        hospitalizationsPerYear: 1,
        complications: 'non-compensable',
      },
      criteriaDescription: [
        'Requires insulin and restricted diet',
        'Regulation of activities (avoidance of strenuous occupational and recreational activities)',
        'Episodes of ketoacidosis or hypoglycemic reactions requiring one or two hospitalizations per year OR twice monthly visits to diabetic care provider',
        'Plus complications that would not be compensable if separately evaluated',
      ],
      evidenceNeeded: [
        'Documentation of insulin requirement',
        'Record of 1-2 hospitalizations per year for diabetes complications',
        'Evidence of activity restrictions',
        'Glucose logs showing episodes of poor control',
        'HbA1c 7.5-9% indicating suboptimal control',
      ],
    },
    {
      percent: 40,
      summary: 'Requires insulin, restricted diet, and regulation of activities',
      criteria: {
        requiresInsulin: true,
        restrictedDiet: true,
        activityRegulation: true,
      },
      criteriaDescription: [
        'Requires insulin for control',
        'Requires restricted diet',
        'Requires regulation of activities (avoidance of strenuous work/exercise)',
      ],
      evidenceNeeded: [
        'Documentation of daily insulin use',
        'Evidence of dietary restrictions',
        'Documentation of activity limitations',
        'Glucose logs showing need for insulin',
        'HbA1c 7-7.5% with insulin therapy',
      ],
    },
    {
      percent: 20,
      summary: 'Requires insulin and restricted diet, OR oral medication and restricted diet',
      criteria: {
        requiresTreatment: true,
        restrictedDiet: true,
        options: ['insulin', 'oral-medication'],
      },
      criteriaDescription: [
        'Option 1: Requires insulin and restricted diet, OR',
        'Option 2: Requires oral hypoglycemic agent and restricted diet',
      ],
      evidenceNeeded: [
        'Documentation of insulin OR oral medication requirement',
        'Evidence of dietary restrictions',
        'Glucose logs showing medication is necessary',
        'HbA1c 6.5-7% with medication',
      ],
    },
    {
      percent: 10,
      summary: 'Requires restricted diet only',
      criteria: {
        restrictedDiet: true,
        noMedication: true,
      },
      criteriaDescription: [
        'Manageable by restricted diet alone',
        'Does not require medication for control',
      ],
      evidenceNeeded: [
        'Documentation of diabetes diagnosis',
        'Evidence of dietary modifications',
        'Glucose logs showing control with diet alone',
        'HbA1c <6.5% with diet only',
      ],
    },
    {
      percent: 0,
      compensable: true,
      summary: 'Requires evaluation - controlled by diet or medication',
      criteria: {
        diagnosed: true,
        controlled: true,
        requiresEvaluation: true,
      },
      criteriaDescription: [
        'Diabetes controlled by diet alone or diet with oral medication',
        'No documented episodes of hypoglycemia or hyperglycemia requiring medical attention',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'Treatment plan (diet/medication)',
        'Stable glucose control documented',
      ],
    },
    {
      percent: 0,
      compensable: false,
      summary: 'Diagnosed but asymptomatic',
      criteria: {
        diagnosed: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Diabetes diagnosed but currently asymptomatic',
        'May not require treatment or only minimal intervention',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
      ],
    },
  ],

  definitions: {
    insulin: {
      term: 'Insulin Requirement',
      definition: 'Requires regular insulin injections (not oral medication) to control blood glucose. This is typically Type 1 diabetes or advanced Type 2 diabetes where oral medications are insufficient.',
      examples: [
        'Multiple daily injections (basal-bolus regimen)',
        'Single daily long-acting insulin',
        'Insulin pump therapy',
      ],
    },
    restrictedDiet: {
      term: 'Restricted Diet',
      definition: 'Requires adherence to specific dietary guidelines including carbohydrate counting, portion control, meal timing, and avoidance of certain foods to maintain glucose control.',
      examples: [
        'Carbohydrate counting for insulin dosing',
        'Consistent meal timing',
        'Limited simple sugars and refined carbohydrates',
        'Portion control requirements',
      ],
    },
    activityRegulation: {
      term: 'Regulation of Activities',
      definition: 'Must avoid strenuous occupational and recreational activities that could trigger severe hypoglycemia or hyperglycemia. Requires careful planning around physical exertion.',
      examples: [
        'Cannot perform heavy labor or intense exercise without medical supervision',
        'Must check glucose before, during, and after physical activity',
        'Limited ability to participate in strenuous sports',
        'Workplace accommodations needed for physical tasks',
      ],
    },
    ketoacidosis: {
      term: 'Ketoacidosis',
      definition: 'Diabetic ketoacidosis (DKA) is a serious complication where the body produces excess blood acids (ketones). Typically requires hospitalization for treatment with insulin and fluids.',
      examples: [
        'Blood glucose >250 mg/dL with ketones',
        'Symptoms: nausea, vomiting, abdominal pain, confusion',
        'Requires emergency medical treatment',
        'More common in Type 1 diabetes',
      ],
    },
    hypoglycemia: {
      term: 'Hypoglycemic Reactions',
      definition: 'Severe low blood sugar episodes requiring assistance from others or medical intervention. Not just feeling shaky or eating a snack - these are serious events.',
      examples: [
        'Blood glucose <40 mg/dL requiring glucagon injection',
        'Loss of consciousness or seizure from low blood sugar',
        'Requiring emergency room visit or hospitalization',
        'Unable to self-treat, needed assistance',
      ],
    },
    poorControl: {
      term: 'Poor Glycemic Control',
      definition: 'Consistently elevated blood glucose and HbA1c levels despite treatment efforts. HbA1c >9% indicates very poor control, 7.5-9% indicates suboptimal control.',
      examples: [
        'HbA1c >9% (very poor control)',
        'HbA1c 7.5-9% (suboptimal control)',
        'Frequent glucose readings >200 mg/dL',
        'Wide glucose variability (frequent highs and lows)',
      ],
    },
    goodControl: {
      term: 'Good Glycemic Control',
      definition: 'HbA1c <7% with most glucose readings in target range (70-180 mg/dL). Achieved through medication, diet, and lifestyle management.',
      examples: [
        'HbA1c <6.5% (excellent control)',
        'HbA1c 6.5-7% (good control)',
        'Most glucose readings 70-180 mg/dL',
        'Minimal glucose variability',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged glucose and HbA1c measurements. VA diabetes ratings consider insulin requirement, dietary restrictions, activity limitations, hospitalizations, and complications. A formal VA rating requires C&P examination and complete medical records review. Continue regular endocrinology care and glucose monitoring.',
};


// ============================================
// TINNITUS (DC 6260)
// ============================================

export const TINNITUS_CRITERIA = {
  diagnosticCode: '6260',
  condition: 'Tinnitus, Recurrent',
  cfrReference: '38 CFR 4.87, Diagnostic Code 6260',

  note: 'Tinnitus receives a single flat rating. Only one evaluation for recurrent tinnitus regardless of whether sound is in one ear, both ears, or in the head.',

  ratings: [
    {
      percent: 10,
      summary: 'Recurrent tinnitus',
      criteriaDescription: [
        'Ringing, buzzing, hissing, or other sound in ears/head',
        'Occurring repeatedly (recurrent)',
        'No higher rating available - flat 10% for any recurrent tinnitus',
      ],
      evidenceNeeded: [
        'Diagnosis of tinnitus from healthcare provider',
        'Description of symptoms (type of sound, frequency, impact)',
        'Audiological examination (typically)',
        'Clinical documentation',
      ],
    },
    {
      percent: 0,
      summary: 'Non-recurrent or objective tinnitus',
      criteriaDescription: [
        'Tinnitus that is not recurrent, OR',
        'Objective tinnitus (sound audible to others - rate under underlying cause)',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    recurrent: {
      term: 'Recurrent',
      definition: 'Occurring repeatedly or regularly. For tinnitus, this means the ringing/buzzing happens on an ongoing or frequent basis, not just once.',
    },
    subjectiveTinnitus: {
      term: 'Subjective Tinnitus',
      definition: 'Sound only the veteran can hear (most common type). This is what DC 6260 covers.',
    },
    objectiveTinnitus: {
      term: 'Objective Tinnitus',
      definition: 'Sound audible to other people, with definable cause. Not rated under 6260 - instead rate under the condition causing it.',
    },
    flatRating: {
      term: 'Flat Rating',
      definition: 'A single rating percentage that does not vary based on severity. For tinnitus, all cases of recurrent tinnitus receive 10%, whether mild or severe.',
    },
  },
};

// ============================================
// FIBROMYALGIA (DC 5025)
// ============================================

export const FIBROMYALGIA_CRITERIA = {
  diagnosticCode: '5025',
  condition: 'Fibromyalgia (Fibrositis, Primary Fibromyalgia Syndrome)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5025',

  note: 'Widespread pain means pain in both left AND right sides, both above AND below waist, AND affects both axial skeleton (neck/chest/spine/low back) and extremities.',

  ratings: [
    {
      percent: 40,
      summary: 'Constant or nearly constant symptoms, refractory to therapy',
      criteriaDescription: [
        'Widespread musculoskeletal pain and tender points',
        'Symptoms are constant or nearly so',
        'Refractory to therapy (does not respond well to treatment)',
        'May include: fatigue, sleep disturbance, stiffness, headaches, IBS, depression, anxiety',
      ],
      evidenceNeeded: [
        'Diagnosis of fibromyalgia from rheumatologist or qualified provider',
        'Documentation of widespread pain pattern',
        'Tender point examination results',
        'Treatment records showing multiple therapies tried',
        'Documentation that symptoms persist despite treatment',
        'Impact on daily functioning',
      ],
    },
    {
      percent: 20,
      summary: 'Episodic symptoms present more than 1/3 of the time',
      criteriaDescription: [
        'Widespread pain and tender points',
        'Symptoms are episodic (come and go)',
        'Often precipitated by environmental stress, emotional stress, or overexertion',
        'Present more than one-third of the time',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'Pattern of exacerbations documented',
        'Identification of triggers',
        'Frequency of symptom flares',
        'Impact during flares',
      ],
    },
    {
      percent: 10,
      summary: 'Requires continuous medication for control',
      criteriaDescription: [
        'Widespread pain and tender points',
        'Symptoms controlled with continuous medication',
        'Medication required daily',
      ],
      evidenceNeeded: [
        'Diagnosis of fibromyalgia',
        'Prescription records for ongoing medication',
        'Documentation that medication is needed for symptom control',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms well-controlled or minimal',
      criteriaDescription: [
        'Diagnosed but symptoms minimal or well-controlled',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    widespreadPain: {
      term: 'Widespread Pain',
      definition: 'Pain meeting ALL these criteria: (1) Both left AND right sides of body, (2) Both above AND below the waist, (3) Affects both axial skeleton (cervical spine, chest, thoracic spine, OR low back) AND the extremities (arms/legs).',
    },
    tenderPoints: {
      term: 'Tender Points',
      definition: 'Specific locations on the body that are painful when pressure is applied. Healthcare provider tests 18 standardized points. Fibromyalgia diagnosis traditionally required 11+ painful points.',
    },
    refractoryToTherapy: {
      term: 'Refractory to Therapy',
      definition: 'Does not respond well to treatment. Multiple treatments have been tried but symptoms persist. This is different from "untreated" - it means treatment has been attempted but is not effective.',
    },
    episodic: {
      term: 'Episodic',
      definition: 'Symptoms that come and go in flares or exacerbations. May have periods of relative calm followed by periods of increased symptoms.',
    },
  },
};

// ============================================
// ANALYSIS FUNCTIONS - MUSCULOSKELETAL CONDITIONS
// ============================================

/**
 * Analyzes Lumbosacral Strain (Low Back Pain) logs
 * NOTE: This requires clinical ROM measurements - symptom logging alone cannot determine rating
 */
export const analyzeLumbosacralStrainLogs = (logs, options = {}) => {
  const conditionCriteria = LUMBOSACRAL_STRAIN_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CONDITIONS.LUMBOSACRAL_STRAIN.symptomIds;

  // Filter logs for back-related symptoms
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No back pain symptoms logged in evaluation period',
    };
  }

  // Count symptoms
  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => log.symptomId))].length;

  // Check for indicators of functional impact
  const hasRadicularPain = relevantLogs.some(log => log.symptomId === 'back-radicular' || log.symptomId === 'back-numbness');
  const hasMuscleSpasm = relevantLogs.some(log => log.symptomId === 'back-spasm');
  const hasStiffness = relevantLogs.some(log => log.symptomId === 'back-stiffness');

  // Evidence collected
  const evidence = [
    `${totalSymptoms} back pain symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms (severity 4-5)`,
    `Symptom types documented: ${symptomTypesPresent}`,
  ];

  if (hasRadicularPain) evidence.push('Radiating pain/numbness documented');
  if (hasMuscleSpasm) evidence.push('Muscle spasm episodes documented');
  if (hasStiffness) evidence.push('Back stiffness documented');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Measurement',
    ratingRationale: [
      'Back pain conditions require Range of Motion (ROM) measurements by a healthcare provider',
      'Symptom logs document pain patterns but cannot determine ROM limitations',
      'Your symptom documentation shows ongoing back pain that warrants clinical evaluation',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: Schedule ROM evaluation with healthcare provider using goniometer',
      'Request formal documentation of forward flexion measurements',
      'Document any abnormal gait or spinal contour observed by provider',
      'Get imaging if not already done (X-ray, MRI)',
      'Document functional limitations: difficulty bending, lifting, walking',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Musculoskeletal conditions require objective Range of Motion measurements performed by a healthcare provider. Your symptom documentation helps establish the pattern and severity of pain, but clinical examination is essential for rating determination.',
  };
};

/**
 * Analyzes Intervertebral Disc Syndrome logs
 * NOTE: This requires documentation of incapacitating episodes OR ROM measurements
 */
export const analyzeIntervertebralDiscLogs = (logs, options = {}) => {
  const conditionCriteria = INTERVERTEBRAL_DISC_CRITERIA;
  const evaluationPeriodDays = options.days || 365; // Use full year for episode tracking
  const symptomIds = CONDITIONS.INTERVERTEBRAL_DISC.symptomIds;

  // Filter relevant logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No disc-related symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;

  const hasDiscPain = relevantLogs.some(log => log.symptomId === 'disc-pain');
  const hasRadicularPain = relevantLogs.some(log => log.symptomId === 'back-radicular' || log.symptomId === 'back-numbness');

  const evidence = [
    `${totalSymptoms} disc-related symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms`,
  ];

  if (hasDiscPain) evidence.push('Disc pain specifically documented');
  if (hasRadicularPain) evidence.push('Nerve compression symptoms (radiating pain/numbness)');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Documentation',
    ratingRationale: [
      'Disc syndrome can be rated TWO ways: (1) Based on incapacitating episodes, OR (2) Based on ROM measurements',
      'Your symptom logs show ongoing disc-related pain',
      'To use incapacitating episodes method, you need physician-prescribed bed rest for each episode',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: DC 5243 requires confirmed disc herniation with nerve root compression (MRI/CT)',
      'For incapacitating episodes rating: Each episode must have BOTH:',
      '  - Physician prescription for bed rest during episode',
      '  - Treatment by physician during episode',
      'Track total DURATION of incapacitating episodes over 12 months',
      'Alternative: Get ROM measurements for rating under General Formula',
      'Document functional limitations and impact on daily activities',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Disc syndrome diagnosis requires imaging confirmation and can only be rated 5243 when there is disc herniation with nerve root compression/irritation. Otherwise, use DC 5242 for degenerative disc disease. Rating requires either documented incapacitating episodes OR clinical ROM measurements.',
  };
};

/**
 * Analyzes Knee Instability logs
 */
export const analyzeKneeInstabilityLogs = (logs, options = {}) => {
  const conditionCriteria = KNEE_INSTABILITY_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CONDITIONS.KNEE_INSTABILITY.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No knee symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const instabilityEvents = relevantLogs.filter(log => log.symptomId === 'knee-instability' || log.symptomId === 'knee-locking').length;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;

  const hasGivingWay = relevantLogs.some(log => log.symptomId === 'knee-instability');
  const hasSwelling = relevantLogs.some(log => log.symptomId === 'knee-swelling');
  const hasLocking = relevantLogs.some(log => log.symptomId === 'knee-locking');

  const evidence = [
    `${totalSymptoms} knee symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `${instabilityEvents} instability/locking events documented`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
  ];

  if (hasGivingWay) evidence.push('Knee giving way/instability documented');
  if (hasSwelling) evidence.push('Knee swelling documented');
  if (hasLocking) evidence.push('Knee locking/catching documented');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Documentation',
    ratingRationale: [
      'Knee instability ratings depend on ligament injury status and prescribed assistive devices',
      'Your symptom logs document ongoing knee instability',
      'Rating determination requires medical documentation of ligament status',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'Get MRI or surgical records confirming ligament injury type (complete vs incomplete tear)',
      'Document repair status (unrepaired, repaired, or failed repair)',
      'If using assistive devices (cane, crutches, walker) or knee brace, get written prescription',
      'Clinical examination documenting instability tests (Lachman, drawer, pivot shift)',
      'Document functional limitations: stairs, squatting, walking on uneven ground',
      'Track frequency of giving-way episodes',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Knee instability ratings require documentation of ligament injury status and whether medical providers have prescribed braces or assistive devices. Your symptom documentation establishes the ongoing nature of instability.',
  };
};

/**
 * Analyzes TBI cognitive symptom logs
 * NOTE: TBI ratings require comprehensive neuropsychological evaluation
 */
export const analyzeTBILogs = (logs, options = {}) => {
  const conditionCriteria = TBI_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CONDITIONS.TBI.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No TBI-related cognitive symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => log.symptomId))].length;

  const hasMemoryIssues = relevantLogs.some(log => log.symptomId === 'tbi-memory');
  const hasConcentrationIssues = relevantLogs.some(log => log.symptomId === 'tbi-concentration');
  const hasConfusion = relevantLogs.some(log => log.symptomId === 'tbi-confusion');
  const hasMoodChanges = relevantLogs.some(log => log.symptomId === 'tbi-mood');

  const evidence = [
    `${totalSymptoms} TBI-related cognitive symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Symptom types: ${symptomTypesPresent} different cognitive areas affected`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms documented`,
  ];

  if (hasMemoryIssues) evidence.push('Memory problems documented');
  if (hasConcentrationIssues) evidence.push('Concentration difficulties documented');
  if (hasConfusion) evidence.push('Confusion/disorientation documented');
  if (hasMoodChanges) evidence.push('Mood changes documented');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Neuropsychological Evaluation',
    ratingRationale: [
      'TBI is rated using a complex 10-facet system requiring professional evaluation',
      'Your symptom logs document ongoing cognitive difficulties',
      'Neuropsychological testing is essential to assess the level of impairment in each facet',
    ],
    assessmentLevel: 'Comprehensive Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: Request comprehensive neuropsychological evaluation',
      'Document TBI diagnosis and mechanism of injury',
      'Get functional capacity evaluation',
      'Document impact on: work, school, family relationships, self-care',
      'Track specific examples of cognitive difficulties in daily life',
      'Note: If you have a diagnosed mental health condition from TBI (depression, anxiety), rate that separately under DC 9434, 9400, etc.',
      'If you have physical symptoms (headaches, dizziness), consider rating under migraine (8100) or peripheral vestibular disorder (6204)',
    ],
    criteria: conditionCriteria,
    disclaimer: 'TBI involves complex multi-facet evaluation. Ratings are based on comprehensive neuropsychological testing, not symptom frequency alone. Your documentation helps establish pattern and impact, but professional cognitive assessment is required for rating. TBI may also cause mental health and physical conditions that should be rated separately.',
  };
};

/**
 * Analyze Hypertension logs and BP measurements for VA rating
 * DC 7101 - Hypertension
 *
 * This updated version uses actual blood pressure measurements instead of symptoms
 */
export const analyzeHypertensionLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  // Get blood pressure measurements (not symptom logs)
  const bpMeasurements = getMeasurements({
    type: 'blood-pressure',
    days: evaluationPeriodDays
  });

  // Also get symptom logs for additional context
  const hypertensionSymptoms = logs.filter(log =>
      CONDITIONS.HYPERTENSION.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  const hasData = bpMeasurements.length > 0 || hypertensionSymptoms.length > 0;

  if (!hasData) {
    return {
      condition: 'Hypertension',
      diagnosticCode: '7101',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No blood pressure measurements logged',
        'Log BP readings regularly to establish pattern',
        'Need readings on at least 3 different days',
        'VA requires "predominantly" (>50%) of readings at threshold',
      ],
      criteria: HYPERTENSION_CRITERIA,
      disclaimer: HYPERTENSION_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // ==================================================================
  // PRIMARY ANALYSIS: Blood Pressure Measurements
  // ==================================================================

  if (bpMeasurements.length > 0) {
    // Calculate average BP
    const avgBP = getAverageBloodPressure(evaluationPeriodDays);
    evidence.push(`${bpMeasurements.length} blood pressure readings over ${evaluationPeriodDays} days`);
    evidence.push(`Average BP: ${avgBP.systolic}/${avgBP.diastolic} mmHg`);

    // Check minimum reading requirement
    if (bpMeasurements.length < 3) {
      gaps.push('Need BP readings on at least 3 different days for reliable analysis');
    }

    // Analyze for each VA rating level (check highest first)

    // 60%: Diastolic predominantly 130 or more
    const diastolic130 = analyzeBloodPressurePredominance(evaluationPeriodDays, { diastolic: 130 });
    if (diastolic130.isPredominant) {
      supportedRating = '60';
      ratingRationale.push(
          `${diastolic130.percentage}% of readings show diastolic ≥130 mmHg`,
          `Meets "predominantly" threshold (>50% required)`,
          `${diastolic130.qualifyingReadings} of ${diastolic130.totalReadings} readings qualify`
      );
      evidence.push(`${diastolic130.qualifyingReadings} readings with diastolic ≥130`);
    }

    // 40%: Diastolic predominantly 120 or more
    else {
      const diastolic120 = analyzeBloodPressurePredominance(evaluationPeriodDays, { diastolic: 120 });
      if (diastolic120.isPredominant) {
        supportedRating = '40';
        ratingRationale.push(
            `${diastolic120.percentage}% of readings show diastolic ≥120 mmHg`,
            `Meets "predominantly" threshold (>50% required)`,
            `${diastolic120.qualifyingReadings} of ${diastolic120.totalReadings} readings qualify`
        );
        evidence.push(`${diastolic120.qualifyingReadings} readings with diastolic ≥120`);

        // Check if close to 60%
        if (diastolic130.percentage >= 40) {
          gaps.push(`${diastolic130.percentage}% of readings at 130+ (need >50% for 60% rating)`);
        }
      }

      // 20%: Diastolic predominantly 110 or systolic predominantly 200
      else {
        const diastolic110 = analyzeBloodPressurePredominance(evaluationPeriodDays, { diastolic: 110 });
        const systolic200 = analyzeBloodPressurePredominance(evaluationPeriodDays, { systolic: 200 });

        if (diastolic110.isPredominant || systolic200.isPredominant) {
          supportedRating = '20';
          if (diastolic110.isPredominant) {
            ratingRationale.push(
                `${diastolic110.percentage}% of readings show diastolic ≥110 mmHg`,
                `Meets "predominantly" threshold (>50% required)`,
                `${diastolic110.qualifyingReadings} of ${diastolic110.totalReadings} readings qualify`
            );
            evidence.push(`${diastolic110.qualifyingReadings} readings with diastolic ≥110`);
          }
          if (systolic200.isPredominant) {
            ratingRationale.push(
                `${systolic200.percentage}% of readings show systolic ≥200 mmHg`,
                `Meets "predominantly" threshold (>50% required)`
            );
            evidence.push(`${systolic200.qualifyingReadings} readings with systolic ≥200`);
          }

          // Check if close to 40%
          if (diastolic120.percentage >= 40) {
            gaps.push(`${diastolic120.percentage}% of readings at 120+ (need >50% for 40% rating)`);
          }
        }

        // 10%: Diastolic predominantly 100 OR systolic predominantly 160 OR requires continuous medication
        else {
          const diastolic100 = analyzeBloodPressurePredominance(evaluationPeriodDays, { diastolic: 100 });
          const systolic160 = analyzeBloodPressurePredominance(evaluationPeriodDays, { systolic: 160 });

          // Check if on medication
          const onMedication = bpMeasurements.some(m => m.metadata?.medicationTaken);

          if (diastolic100.isPredominant || systolic160.isPredominant) {
            supportedRating = '10';
            if (diastolic100.isPredominant) {
              ratingRationale.push(
                  `${diastolic100.percentage}% of readings show diastolic ≥100 mmHg`,
                  `Meets "predominantly" threshold (>50% required)`,
                  `${diastolic100.qualifyingReadings} of ${diastolic100.totalReadings} readings qualify`
              );
              evidence.push(`${diastolic100.qualifyingReadings} readings with diastolic ≥100`);
            }
            if (systolic160.isPredominant) {
              ratingRationale.push(
                  `${systolic160.percentage}% of readings show systolic ≥160 mmHg`,
                  `Meets "predominantly" threshold (>50% required)`
              );
              evidence.push(`${systolic160.qualifyingReadings} readings with systolic ≥160`);
            }

            // Check if close to 20%
            if (diastolic110.percentage >= 40) {
              gaps.push(`${diastolic110.percentage}% of readings at 110+ (need >50% for 20% rating)`);
            }
          } else if (onMedication) {
            // Check if there's a history of diastolic 100+
            const historyOf100 = bpMeasurements.some(m => m.values.diastolic >= 100);

            if (historyOf100) {
              supportedRating = '10';
              ratingRationale.push(
                  'On continuous BP medication',
                  'Has documented history of diastolic ≥100 mmHg',
                  'Meets medication + history criteria for 10% rating'
              );
              evidence.push('Taking BP medication regularly');
              evidence.push('History of elevated diastolic readings');
            } else {
              gaps.push('On medication but no documented history of diastolic ≥100');
              gaps.push('Need historical evidence of diastolic ≥100 to support medication-based rating');
            }
          } else {
            // No rating supported
            ratingRationale.push(
                `Current readings don't meet "predominantly" threshold for any rating`,
                `Highest: Diastolic ≥100 in ${diastolic100.percentage}% of readings (need >50%)`
            );
            gaps.push('Continue logging BP to establish pattern');

            if (diastolic100.percentage >= 30) {
              gaps.push(`Close to 10% rating threshold - ${diastolic100.percentage}% at diastolic ≥100`);
            }
          }
        }
      }
    }

    // Additional gaps based on reading count
    if (bpMeasurements.length < 10) {
      gaps.push(`Only ${bpMeasurements.length} readings - more data strengthens claim`);
      gaps.push('Aim for readings on multiple days over 2-3 months');
    }

    // Check for medication documentation
    const medicationDocumented = bpMeasurements.some(m => m.metadata?.medicationTaken !== undefined);
    if (!medicationDocumented) {
      gaps.push('Document whether BP medication was taken with each reading');
    }

    // Check for readings on different days
    const uniqueDays = new Set(
        bpMeasurements.map(m => new Date(m.timestamp).toDateString())
    ).size;

    if (uniqueDays < 3) {
      gaps.push(`Readings from only ${uniqueDays} different days - need at least 3`);
    }

  } else {
    // No measurements, only symptoms
    gaps.push('No blood pressure measurements logged');
    gaps.push('Log BP readings to establish pattern for rating');
    gaps.push('Symptom tracking alone cannot determine hypertension rating');
    gaps.push('VA rating based on actual BP numbers, not symptoms');
  }

  // ==================================================================
  // SECONDARY ANALYSIS: Symptom Impact (for context)
  // ==================================================================

  if (hypertensionSymptoms.length > 0) {
    evidence.push(`${hypertensionSymptoms.length} hypertension-related symptoms logged`);

    // Common symptoms
    const symptomCounts = {};
    hypertensionSymptoms.forEach(log => {
      const symptom = log.symptomName || log.symptomId;
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });

    const topSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

    if (topSymptoms.length > 0) {
      evidence.push(`Most frequent symptoms: ${topSymptoms.map(([s, c]) => `${s} (${c}×)`).join(', ')}`);
    }
  }

  return {
    condition: 'Hypertension',
    diagnosticCode: '7101',
    hasData,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: HYPERTENSION_CRITERIA,
    disclaimer: HYPERTENSION_CRITERIA.disclaimer,
    // Include measurements for chart display
    measurements: bpMeasurements,
  };
};

/**
 * Analyze Diabetes using glucose/HbA1c measurements for VA rating
 * DC 7913 - Diabetes Mellitus
 */
export const analyzeDiabetesLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  // Get glucose and HbA1c measurements
  const glucoseMeasurements = getMeasurements({
    type: 'blood-glucose',
    days: evaluationPeriodDays
  });

  const hba1cMeasurements = getMeasurements({
    type: 'hba1c',
    days: evaluationPeriodDays
  });

  // Get symptom logs for additional context
  const diabetesSymptoms = logs.filter(log =>
      CONDITIONS.DIABETES.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  const hasData = glucoseMeasurements.length > 0 || hba1cMeasurements.length > 0 || diabetesSymptoms.length > 0;

  if (!hasData) {
    return {
      condition: 'Diabetes Mellitus',
      diagnosticCode: '7913',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No glucose or HbA1c measurements logged',
        'Log blood glucose readings regularly to establish pattern',
        'Log HbA1c test results (every 3 months typical)',
        'Document insulin or oral medication use',
        'Track hypoglycemic episodes if they occur',
      ],
      criteria: DIABETES_CRITERIA,
      disclaimer: DIABETES_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // ==================================================================
  // ANALYZE GLUCOSE CONTROL
  // ==================================================================

  let avgGlucose = null;
  let fastingCount = 0;
  let elevatedCount = 0;
  let hypoglycemicCount = 0;
  let severeHypoglycemicCount = 0;

  if (glucoseMeasurements.length > 0) {
    // Calculate average glucose
    const totalGlucose = glucoseMeasurements.reduce((sum, m) => sum + m.values.glucose, 0);
    avgGlucose = Math.round(totalGlucose / glucoseMeasurements.length);

    // Count fasting vs non-fasting
    fastingCount = glucoseMeasurements.filter(m => m.metadata?.fasting).length;

    // Count elevated readings (>180 mg/dL)
    elevatedCount = glucoseMeasurements.filter(m => m.values.glucose > 180).length;

    // Count hypoglycemic episodes (<70 mg/dL)
    hypoglycemicCount = glucoseMeasurements.filter(m => m.values.glucose < 70).length;

    // Count severe hypoglycemia (<54 mg/dL)
    severeHypoglycemicCount = glucoseMeasurements.filter(m => m.values.glucose < 54).length;

    evidence.push(`${glucoseMeasurements.length} glucose readings over ${evaluationPeriodDays} days`);
    evidence.push(`Average glucose: ${avgGlucose} mg/dL`);

    if (fastingCount > 0) {
      evidence.push(`${fastingCount} fasting readings documented`);
    }

    if (hypoglycemicCount > 0) {
      evidence.push(`${hypoglycemicCount} hypoglycemic episodes (<70 mg/dL)`);
      if (severeHypoglycemicCount > 0) {
        evidence.push(`${severeHypoglycemicCount} severe hypoglycemia (<54 mg/dL)`);
      }
    }

    if (elevatedCount > 0) {
      const percentElevated = Math.round((elevatedCount / glucoseMeasurements.length) * 100);
      evidence.push(`${percentElevated}% of readings >180 mg/dL (${elevatedCount} readings)`);
    }
  }

  // ==================================================================
  // ANALYZE HbA1c (Long-term Control)
  // ==================================================================

  let latestHbA1c = null;
  let avgHbA1c = null;

  if (hba1cMeasurements.length > 0) {
    // Get most recent HbA1c
    const sortedHbA1c = [...hba1cMeasurements].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    latestHbA1c = sortedHbA1c[0].values.hba1c;

    // Calculate average HbA1c
    const totalHbA1c = hba1cMeasurements.reduce((sum, m) => sum + m.values.hba1c, 0);
    avgHbA1c = (totalHbA1c / hba1cMeasurements.length).toFixed(1);

    evidence.push(`${hba1cMeasurements.length} HbA1c test results`);
    evidence.push(`Most recent HbA1c: ${latestHbA1c}%`);
    if (hba1cMeasurements.length > 1) {
      evidence.push(`Average HbA1c: ${avgHbA1c}%`);
    }
  }

  // ==================================================================
  // CHECK FOR INSULIN/MEDICATION REQUIREMENT
  // ==================================================================

  const insulinDocumented = glucoseMeasurements.some(m =>
      m.metadata?.insulinTaken || m.metadata?.medicationTaken
  );

  const oralMedDocumented = glucoseMeasurements.some(m =>
      m.metadata?.medicationTaken && !m.metadata?.insulinTaken
  );

  if (insulinDocumented) {
    evidence.push('Insulin use documented with glucose readings');
  } else if (oralMedDocumented) {
    evidence.push('Oral medication documented with glucose readings');
  }

  // ==================================================================
  // DETERMINE VA RATING
  // ==================================================================

  // Need more detailed info for higher ratings
  // For now, we can support 10-40% based on measurements

  // Check for poor control suggesting higher rating
  const poorControl = (latestHbA1c && latestHbA1c >= 9) ||
      (avgGlucose && avgGlucose >= 250);

  if (poorControl && insulinDocumented && severeHypoglycemicCount >= 3) {
    // Possible 60-100% but needs hospitalization documentation
    supportedRating = 'Requires Clinical Documentation';
    ratingRationale.push(
        'Evidence suggests severe diabetes with poor control',
        `HbA1c ${latestHbA1c}% indicates very poor control`,
        `${severeHypoglycemicCount} severe hypoglycemic episodes documented`,
        'Insulin requirement documented'
    );
    gaps.push('60-100% ratings require documentation of hospitalizations');
    gaps.push('Document emergency room visits or hospital admissions for diabetes');
    gaps.push('Track frequency of severe hypoglycemia requiring assistance');
  }
  else if (insulinDocumented) {
    // 40%: Requires insulin, restricted diet, and regulation of activities
    supportedRating = '40';
    ratingRationale.push(
        'Insulin requirement documented',
        'Meets criteria for 40% rating (insulin + restricted diet + activity regulation)'
    );

    if (latestHbA1c) {
      ratingRationale.push(`HbA1c ${latestHbA1c}% indicates ${
          latestHbA1c >= 9 ? 'poor' :
              latestHbA1c >= 7.5 ? 'suboptimal' :
                  latestHbA1c >= 7 ? 'fair' : 'good'
      } control`);
    }

    // Check if could qualify for higher
    if (latestHbA1c && latestHbA1c >= 7.5) {
      gaps.push('Poor control may support higher rating with hospitalization documentation');
    }
  }
  else if (oralMedDocumented) {
    // 20%: Requires oral medication and restricted diet
    supportedRating = '20';
    ratingRationale.push(
        'Oral hypoglycemic medication documented',
        'Meets criteria for 20% rating (oral medication + restricted diet)'
    );

    if (latestHbA1c) {
      ratingRationale.push(`HbA1c ${latestHbA1c}% with oral medication`);
    }

    // Check if actually needs insulin
    if (poorControl) {
      gaps.push('Poor control despite oral medication - may need insulin therapy');
      gaps.push('Discuss with healthcare provider if insulin should be started');
    }
  }
  else if (latestHbA1c && latestHbA1c >= 6.5) {
    // Has diabetes diagnosis (HbA1c ≥6.5%) but medication not documented
    supportedRating = '10';
    ratingRationale.push(
        `Diabetes diagnosis confirmed (HbA1c ${latestHbA1c}%)`,
        'Manageable with restricted diet',
        'Meets criteria for 10% rating (restricted diet only)'
    );

    gaps.push('Document if taking any diabetes medication');
    gaps.push('If on medication, rating could increase to 20-40%');
  }
  else if (avgGlucose && avgGlucose >= 126) {
    // Elevated fasting glucose suggesting diabetes
    supportedRating = '10';
    ratingRationale.push(
        `Average glucose ${avgGlucose} mg/dL suggests diabetes`,
        'Meets criteria for 10% rating if diagnosis confirmed',
        'Requires dietary management'
    );

    gaps.push('Get HbA1c test to confirm diagnosis');
    gaps.push('Document any diabetes medication use');
  }
  else {
    // Glucose control appears good
    supportedRating = '0 (Compensable)';
    ratingRationale.push(
        'Diabetes controlled by current treatment',
        'May qualify for compensable 0% rating if diagnosis documented'
    );

    if (latestHbA1c) {
      ratingRationale.push(`HbA1c ${latestHbA1c}% indicates good control`);
    }

    gaps.push('Maintain current treatment and monitoring');
    gaps.push('Document any changes in control or treatment needs');
  }

  // ==================================================================
  // ADDITIONAL DOCUMENTATION GAPS
  // ==================================================================

  if (glucoseMeasurements.length < 20) {
    gaps.push(`Only ${glucoseMeasurements.length} glucose readings - aim for 20+ over 90 days`);
  }

  if (!insulinDocumented && !oralMedDocumented && (latestHbA1c && latestHbA1c >= 6.5)) {
    gaps.push('Document medication status with each glucose reading');
  }

  if (hba1cMeasurements.length === 0) {
    gaps.push('Log HbA1c test results (typically done every 3 months)');
  }

  if (hba1cMeasurements.length === 1) {
    gaps.push('Multiple HbA1c values show pattern over time');
  }

  if (fastingCount < 5 && glucoseMeasurements.length >= 10) {
    gaps.push('Include more fasting glucose readings (before breakfast)');
  }

  if (severeHypoglycemicCount > 0) {
    gaps.push('Document any hospitalizations or ER visits for hypoglycemia');
    gaps.push('Track episodes requiring assistance from others');
  }

  // Higher ratings require additional documentation
  if (supportedRating === '40' || supportedRating === 'Requires Clinical Documentation') {
    gaps.push('Document activity restrictions due to diabetes');
    gaps.push('Document dietary restrictions and meal planning requirements');

    if (poorControl) {
      gaps.push('Document visits to endocrinologist or diabetes educator');
    }
  }

  // ==================================================================
  // SYMPTOM ANALYSIS (for context)
  // ==================================================================

  if (diabetesSymptoms.length > 0) {
    evidence.push(`${diabetesSymptoms.length} diabetes-related symptoms logged`);

    const symptomCounts = {};
    diabetesSymptoms.forEach(log => {
      const symptom = log.symptomName || log.symptomId;
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });

    const topSymptoms = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

    if (topSymptoms.length > 0) {
      evidence.push(`Most frequent symptoms: ${topSymptoms.map(([s, c]) => `${s} (${c}×)`).join(', ')}`);
    }
  }

  return {
    condition: 'Diabetes Mellitus',
    diagnosticCode: '7913',
    hasData,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: DIABETES_CRITERIA,
    disclaimer: DIABETES_CRITERIA.disclaimer,
    // Include measurements for chart display
    glucoseMeasurements,
    hba1cMeasurements,
    avgGlucose,
    latestHbA1c,
    avgHbA1c,
  };
};

// Helper function to check if timestamp is within evaluation period
const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

/**
 * Analyzes Tinnitus logs
 */
export const analyzeTinnitusLogs = (logs, options = {}) => {
  const conditionCriteria = TINNITUS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CONDITIONS.TINNITUS.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No tinnitus symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const daysLogged = [...new Set(relevantLogs.map(log => new Date(log.timestamp).toDateString()))].length;

  const evidence = [
    `${totalSymptoms} tinnitus symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Logged on ${daysLogged} different days`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    'Pattern establishes recurrent tinnitus',
  ];

  let supportedRating = '10';
  const ratingRationale = [
    'Tinnitus has a flat 10% rating for all recurrent cases',
    'Your symptom logs document recurrent tinnitus',
    'No higher rating available regardless of severity',
  ];

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    assessmentLevel: 'Well-Documented',
    evidence,
    gaps: [
      'Get formal tinnitus diagnosis from healthcare provider',
      'Audiological examination (hearing test) typically performed',
      'Document characteristics: type of sound (ringing, buzzing, hissing, etc.)',
      'Document which ear(s) affected or if sound is "in head"',
      'Note: Severity does not affect rating - all recurrent tinnitus is 10%',
      'Note: Only ONE 10% rating awarded even if tinnitus in both ears',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Tinnitus receives a flat 10% rating for all recurrent cases - severity does not change the rating. This is a straightforward condition to document. Your symptom logs establish the recurrent nature of the tinnitus.',
  };
};

/**
 * Analyzes Fibromyalgia logs
 */
export const analyzeFibromyalgiaLogs = (logs, options = {}) => {
  const conditionCriteria = FIBROMYALGIA_CRITERIA;
  const evaluationPeriodDays = options.days || 180; // Longer period for fibro
  const symptomIds = CONDITIONS.FIBROMYALGIA.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No fibromyalgia symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => log.symptomId))].length;
  const daysLogged = [...new Set(relevantLogs.map(log => new Date(log.timestamp).toDateString()))].length;

  const hasWidespreadPain = relevantLogs.some(log => log.symptomId === 'fibro-widespread-pain');
  const hasTenderPoints = relevantLogs.some(log => log.symptomId === 'fibro-tender-points');
  const hasFatigue = relevantLogs.some(log => log.symptomId === 'fibro-fatigue');
  const hasSleepIssues = relevantLogs.some(log => log.symptomId === 'fibro-sleep');
  const hasStiffness = relevantLogs.some(log => log.symptomId === 'fibro-stiffness');
  const hasCognitive = relevantLogs.some(log => log.symptomId === 'fibro-cognitive');

  const monthsInPeriod = evaluationPeriodDays / 30;
  const symptomsPerMonth = totalSymptoms / monthsInPeriod;

  const evidence = [
    `${totalSymptoms} fibromyalgia symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
    `Logged on ${daysLogged} different days (${(daysLogged / monthsInPeriod).toFixed(1)} days/month)`,
    `${symptomTypesPresent} different symptom types documented`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms (4-5 severity)`,
  ];

  if (hasWidespreadPain) evidence.push('Widespread pain documented');
  if (hasTenderPoints) evidence.push('Tender point pain documented');
  if (hasFatigue) evidence.push('Fibromyalgia-specific fatigue documented');
  if (hasSleepIssues) evidence.push('Sleep disturbances documented');
  if (hasStiffness) evidence.push('Morning stiffness documented');
  if (hasCognitive) evidence.push('Cognitive issues (fibro fog) documented');

  let supportedRating = '10-20';
  let ratingRationale = [];
  let gaps = [];

  // Assess pattern
  const isConstant = symptomsPerMonth >= 20; // ~5 per week = nearly constant
  const isFrequent = symptomsPerMonth >= 10; // ~2-3 per week = more than 1/3 time
  const severityHigh = avgSeverity >= 3.5;

  if (isConstant && severityHigh && severeSymptoms >= totalSymptoms * 0.4) {
    supportedRating = '40';
    ratingRationale = [
      'Symptoms appear constant or nearly constant',
      `Logged ${symptomsPerMonth.toFixed(1)} times per month on average`,
      `High severity (${avgSeverity.toFixed(1)}/5 average)`,
      `${symptomTypesPresent} different symptom types showing widespread impact`,
    ];
    gaps = [
      'Get formal fibromyalgia diagnosis from rheumatologist',
      'Document that widespread pain meets VA criteria (both sides, above+below waist, axial skeleton+extremities)',
      'Get tender point examination (11+ of 18 points for traditional diagnosis)',
      'Document all treatments tried and their effectiveness',
      'Show that symptoms persist despite treatment (refractory to therapy)',
      'Document functional impact on work and daily activities',
    ];
  } else if (isFrequent || (symptomTypesPresent >= 3 && severeSymptoms > 0)) {
    supportedRating = '20';
    ratingRationale = [
      'Symptoms present more than one-third of the time',
      `Logged ${symptomsPerMonth.toFixed(1)} times per month`,
      'Episodic pattern with exacerbations',
      `${symptomTypesPresent} symptom types documented`,
    ];
    gaps = [
      'Get formal fibromyalgia diagnosis',
      'Document widespread pain pattern',
      'Tender point examination results',
      'Track triggers for exacerbations (stress, overexertion, weather)',
      'Document frequency and duration of flare-ups',
      'Show pattern of episodic symptoms',
    ];
  } else {
    supportedRating = '10';
    ratingRationale = [
      `Symptoms documented but pattern suggests controlled status`,
      `${totalSymptoms} symptoms over ${monthsInPeriod.toFixed(1)} months`,
      'May indicate medication-controlled fibromyalgia',
    ];
    gaps = [
      'Get formal fibromyalgia diagnosis',
      'Document continuous medication requirement',
      'Prescription records for fibromyalgia medications',
      'Document widespread pain and tender points',
      'If symptoms are more frequent than logged, increase documentation frequency',
    ];
  }

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    assessmentLevel: 'Good Documentation',
    evidence,
    gaps,
    criteria: conditionCriteria,
    disclaimer: 'Fibromyalgia ratings are based on symptom pattern (constant vs episodic vs medication-controlled) and response to treatment. Your documentation establishes symptom frequency and types. Formal diagnosis and documentation of widespread pain pattern are essential.',
  };
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
  return MAJOR_DEPRESSION_CRITERIA.ratings.find(r => r.percent === percent) ||
      null;
};

export const getAllMajorDepressionRatings = () => {
  return MAJOR_DEPRESSION_CRITERIA.ratings;
};

export const getMajorDepressionDefinition = (term) => {
  return MAJOR_DEPRESSION_CRITERIA.definitions[term] || null;
};

export const getGeneralizedAnxietyRatingCriteria = (percent) => {
  return GENERALIZED_ANXIETY_CRITERIA.ratings.find(
      r => r.percent === percent) || null;
};

export const getAllGeneralizedAnxietyRatings = () => {
  return GENERALIZED_ANXIETY_CRITERIA.ratings;
};

export const getGeneralizedAnxietyDefinition = (term) => {
  return GENERALIZED_ANXIETY_CRITERIA.definitions[term] || null;
};

export const getPanicDisorderRatingCriteria = (percent) => {
  return PANIC_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) ||
      null;
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

// Helper functions for new conditions
export const getLumbosacralStrainRatingCriteria = (percent) => {
  return LUMBOSACRAL_STRAIN_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getIntervertebralDiscRatingCriteria = (percent) => {
  const incapEpisodes = INTERVERTEBRAL_DISC_CRITERIA.ratingsIncapacitatingEpisodes.find(r => r.percent === percent);
  if (incapEpisodes) return incapEpisodes;
  return INTERVERTEBRAL_DISC_CRITERIA.ratingsGeneralFormula.find(r => r.percent === percent) || null;
};

export const getKneeInstabilityRatingCriteria = (percent) => {
  return KNEE_INSTABILITY_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getTBIRatingCriteria = (percent) => {
  return TBI_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getHypertensionRatingCriteria = (percent) => {
  return HYPERTENSION_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getTinnitusRatingCriteria = (percent) => {
  return TINNITUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getFibromyalgiaRatingCriteria = (percent) => {
  return FIBROMYALGIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
};

export const getAllLumbosacralStrainRatings = () => LUMBOSACRAL_STRAIN_CRITERIA.ratings;
export const getAllIntervertebralDiscRatings = () => INTERVERTEBRAL_DISC_CRITERIA.ratingsIncapacitatingEpisodes;
export const getAllKneeInstabilityRatings = () => KNEE_INSTABILITY_CRITERIA.ratings;
export const getAllTBIRatings = () => TBI_CRITERIA.ratings;
export const getAllHypertensionRatings = () => HYPERTENSION_CRITERIA.ratings;
export const getAllTinnitusRatings = () => TINNITUS_CRITERIA.ratings;
export const getAllFibromyalgiaRatings = () => FIBROMYALGIA_CRITERIA.ratings;

export const getLumbosacralStrainDefinition = (term) => LUMBOSACRAL_STRAIN_CRITERIA.definitions[term] || null;
export const getIntervertebralDiscDefinition = (term) => INTERVERTEBRAL_DISC_CRITERIA.definitions[term] || null;
export const getKneeInstabilityDefinition = (term) => KNEE_INSTABILITY_CRITERIA.definitions[term] || null;
export const getTBIDefinition = (term) => TBI_CRITERIA.definitions[term] || null;
export const getHypertensionDefinition = (term) => HYPERTENSION_CRITERIA.definitions[term] || null;
export const getTinnitusDefinition = (term) => TINNITUS_CRITERIA.definitions[term] || null;
export const getFibromyalgiaDefinition = (term) => FIBROMYALGIA_CRITERIA.definitions[term] || null;