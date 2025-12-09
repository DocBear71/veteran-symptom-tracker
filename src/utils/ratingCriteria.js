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
  IBS: {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    diagnosticCode: '7319',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['ibs-diarrhea', 'ibs-constipation', 'ibs-pain', 'ibs-bloating', 'ibs-urgency'],
  },
  GERD: {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease (GERD)',
    diagnosticCode: '7346',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['gerd-heartburn', 'gerd-regurgitation', 'gerd-chest-pain', 'gerd-difficulty-swallowing', 'gerd-nausea'],
  },
  RADICULOPATHY: {
    id: 'radiculopathy',
    name: 'Radiculopathy',
    diagnosticCode: '8520',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['radiculopathy-pain', 'radiculopathy-numbness', 'radiculopathy-tingling', 'radiculopathy-weakness', 'radiculopathy-burning'],
  },
  CHRONIC_FATIGUE: {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Syndrome',
    diagnosticCode: '6354',
    cfrReference: '38 CFR 4.88b',
    symptomIds: ['cfs-fatigue', 'cfs-cognitive', 'cfs-sleep', 'cfs-pain', 'cfs-headache'],
  },
  PERIPHERAL_NEUROPATHY: {
    id: 'peripheral-neuropathy',
    name: 'Peripheral Neuropathy',
    diagnosticCode: '8999',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['pn-numbness', 'pn-tingling', 'pn-burning', 'pn-pain', 'pn-weakness'],
  },
  MENIERES: {
    id: 'menieres',
    name: "Meniere's Disease",
    diagnosticCode: '6205',
    cfrReference: '38 CFR 4.85',
    symptomIds: ['menieres-vertigo', 'menieres-tinnitus', 'menieres-hearing-loss', 'menieres-nausea'],
  },
  RHINITIS: {
    id: 'rhinitis',
    name: 'Rhinitis (Allergic or Vasomotor)',
    diagnosticCode: '6522',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['rhinitis-congestion', 'rhinitis-drainage', 'rhinitis-sneezing', 'rhinitis-breathing'],
  },
  TMJ: {
    id: 'tmj',
    name: 'Temporomandibular Joint (TMJ) Disorder',
    diagnosticCode: '9905',
    cfrReference: '38 CFR 4.150',
    symptomIds: ['tmj-pain', 'tmj-clicking', 'tmj-limited-opening', 'tmj-locking', 'tmj-headache'],
  },
  PLANTAR_FASCIITIS: {
    id: 'plantar-fasciitis',
    name: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['pf-heel-pain', 'pf-arch-pain', 'pf-morning-pain', 'pf-stiffness', 'pf-difficulty-walking'],
  },
  INSOMNIA: {
    id: 'insomnia',
    name: 'Insomnia (Sleep Disorder)',
    diagnosticCode: '8108',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['insomnia-difficulty-falling-asleep', 'insomnia-difficulty-staying-asleep', 'insomnia-early-waking', 'insomnia-fatigue', 'insomnia-irritability'],
  },
  SINUSITIS: {
    id: 'sinusitis',
    name: 'Chronic Sinusitis',
    diagnosticCode: '6510',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['sinusitis-facial-pain', 'sinusitis-pressure', 'sinusitis-congestion', 'sinusitis-headache', 'sinusitis-drainage'],
  },
  SHOULDER: {
    id: 'shoulder',
    name: 'Shoulder Conditions',
    diagnosticCode: '5201-5203',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['shoulder-pain', 'shoulder-limited-rom', 'shoulder-instability', 'shoulder-weakness', 'shoulder-stiffness'],
  },
  HIP: {
    id: 'hip',
    name: 'Hip Conditions',
    diagnosticCode: '5252-5255',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['hip-pain', 'hip-limited-rom', 'hip-stiffness', 'hip-weakness', 'hip-limping'],
  },
  ASTHMA: {
    id: 'asthma',
    name: 'Bronchial Asthma',
    diagnosticCode: '6602',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'asthma-attack',
      'asthma-wheezing',
      'asthma-shortness-breath',
      'asthma-cough',
      'asthma-chest-tightness',
      'asthma-rescue-inhaler',
      'asthma-er-visit',
      'asthma-md-visit',
    ],
  },
  HEARING_LOSS: {
    id: 'hearing-loss',
    name: 'Hearing Loss',
    diagnosticCode: '6100',
    cfrReference: '38 CFR 4.85',
    symptomIds: ['hearing-loss-noticed'],
  },
  SCARS: {
    id: 'scars',
    name: 'Scars (Disfiguring)',
    diagnosticCode: '7800-7805',
    cfrReference: '38 CFR 4.118',
    symptomIds: ['scar-pain', 'scar-limitation', 'scar-disfigurement'],
  },
  PSORIASIS: {
    id: 'psoriasis',
    name: 'Psoriasis',
    diagnosticCode: '7816',
    cfrReference: '38 CFR 4.118',
    symptomIds: ['psoriasis-flare'],
  },
  ECZEMA: {
    id: 'eczema',
    name: 'Eczema/Dermatitis',
    diagnosticCode: '7806',
    cfrReference: '38 CFR 4.118',
    symptomIds: ['eczema-flare'],
  },
  TBI_RESIDUALS: {
    id: 'tbi-residuals',
    name: 'Residuals of TBI',
    diagnosticCode: '8045-1',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['tbi-cognitive', 'tbi-emotional'],
  },
  GERD_COMPLICATIONS: {
    id: 'gerd-complications',
    name: 'GERD with Complications',
    diagnosticCode: '7346',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['gerd-complication'],
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

export const IBS_CRITERIA = {
  diagnosticCode: '7319',
  condition: 'Irritable Bowel Syndrome',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7319',

  ratings: [
    {
      percent: 30,
      summary: 'Severe symptoms with diarrhea or alternating diarrhea and constipation, with frequent episodes of bowel disturbance and abdominal distress',
      criteria: {
        frequentEpisodes: true,
        severity: 'severe',
        bowelDisturbance: true,
        abdominalDistress: true,
      },
      criteriaDescription: [
        'Diarrhea, or alternating diarrhea and constipation',
        'Frequent episodes (multiple times per week)',
        'Bowel disturbance is persistent',
        'Associated abdominal distress',
      ],
      evidenceNeeded: [
        'Log diarrhea episodes multiple times per week',
        'Document alternating patterns if applicable',
        'Track abdominal pain/distress frequency',
        'Note impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate symptoms with disturbances of bowel function with occasional episodes',
      criteria: {
        occasionalEpisodes: true,
        severity: 'moderate',
        bowelDisturbance: true,
      },
      criteriaDescription: [
        'Disturbances of bowel function',
        'Occasional episodes (less frequent than severe)',
        'Moderate impact on daily life',
      ],
      evidenceNeeded: [
        'Log bowel disturbance episodes regularly',
        'Document frequency (at least weekly)',
        'Track associated symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Mild symptoms that are diet-controlled',
      criteria: {
        mildSymptoms: true,
        dietControlled: true,
      },
      criteriaDescription: [
        'Symptoms controlled with diet modifications',
        'Minimal impact on daily activities',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    frequentEpisodes: {
      term: 'Frequent Episodes',
      definition: 'Episodes occurring multiple times per week on a regular basis. Not isolated or rare occurrences.',
      examples: [
        '3-4 diarrhea episodes per week',
        'Daily alternating constipation/diarrhea',
        'Multiple bowel disturbances weekly',
      ],
    },
    diarrhea: {
      term: 'Diarrhea',
      definition: 'Loose or watery stools occurring frequently. For IBS rating, this must be a persistent pattern, not isolated incidents.',
      examples: [
        'Loose stools 3+ times daily',
        'Urgent bowel movements',
        'Inability to control bowel movements',
      ],
    },
    abdominalDistress: {
      term: 'Abdominal Distress',
      definition: 'Pain, cramping, bloating, or discomfort in the abdomen associated with bowel disturbances.',
      examples: [
        'Cramping before bowel movements',
        'Persistent bloating',
        'Abdominal pain relieved by bowel movement',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged IBS symptoms. VA rating requires documented diagnosis and pattern of symptoms over time. Continue gastroenterology care and maintain symptom diary for claim support.',
};

// ============================================
// GERD RATING CRITERIA (DC 7346)
// ============================================

export const GERD_CRITERIA = {
  diagnosticCode: '7346',
  condition: 'Gastroesophageal Reflux Disease (GERD)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7346',

  ratings: [
    {
      percent: 60,
      summary: 'Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia; or other symptom combinations productive of severe impairment of health',
      criteria: {
        pain: true,
        vomiting: true,
        weightLoss: true,
        bleeding: true, // hematemesis or melena
        anemia: true,
        severeImpairment: true,
      },
      criteriaDescription: [
        'Persistent pain',
        'Frequent vomiting',
        'Material weight loss documented',
        'Evidence of bleeding (hematemesis or melena)',
        'Moderate anemia present',
        'Severe impairment of overall health',
      ],
      evidenceNeeded: [
        'Medical documentation of weight loss',
        'Evidence of bleeding complications',
        'Lab results showing anemia',
        'Frequent symptom logging',
        'Documentation of treatment failure',
      ],
    },
    {
      percent: 30,
      summary: 'Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation, accompanied by substernal or arm or shoulder pain, productive of considerable impairment of health',
      criteria: {
        persistentSymptoms: true,
        dysphagia: true,
        pyrosis: true,
        regurgitation: true,
        chestPain: true,
        considerableImpairment: true,
      },
      criteriaDescription: [
        'Persistently recurrent epigastric distress',
        'Dysphagia (difficulty swallowing)',
        'Pyrosis (heartburn)',
        'Regurgitation',
        'Substernal, arm, or shoulder pain',
        'Considerable impairment of health',
      ],
      evidenceNeeded: [
        'Frequent heartburn episodes logged',
        'Document difficulty swallowing',
        'Track regurgitation frequency',
        'Note chest/shoulder pain',
        'Show persistent pattern over months',
      ],
    },
    {
      percent: 10,
      summary: 'Two or more of the symptoms for the 30% evaluation of less severity',
      criteria: {
        multipleSymptoms: true,
        lessSevere: true,
        minSymptoms: 2,
      },
      criteriaDescription: [
        'Two or more symptoms present',
        'Less severe than 30% criteria',
        'May include heartburn, regurgitation, dysphagia',
      ],
      evidenceNeeded: [
        'Log at least 2 different GERD symptoms regularly',
        'Document frequency and severity',
        'Show consistent pattern',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms controlled by medication',
      criteria: {
        controlled: true,
        onMedication: true,
      },
      criteriaDescription: [
        'Symptoms managed with medication',
        'Minimal breakthrough symptoms',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    pyrosis: {
      term: 'Pyrosis (Heartburn)',
      definition: 'Burning sensation in the chest or throat caused by stomach acid refluxing into the esophagus. A hallmark symptom of GERD.',
      examples: [
        'Burning sensation behind breastbone',
        'Sour or bitter taste in mouth',
        'Worsens when lying down or bending over',
      ],
    },
    dysphagia: {
      term: 'Dysphagia',
      definition: 'Difficulty swallowing. Can be a symptom of esophageal damage from chronic GERD.',
      examples: [
        'Food feels stuck in throat or chest',
        'Painful swallowing',
        'Difficulty swallowing solids or liquids',
      ],
    },
    regurgitation: {
      term: 'Regurgitation',
      definition: 'Backflow of stomach contents into the throat or mouth. Different from vomiting as it occurs without nausea or retching.',
      examples: [
        'Sour liquid coming up into throat',
        'Undigested food returning to mouth',
        'Occurs especially when lying down',
      ],
    },
    hematemesis: {
      term: 'Hematemesis',
      definition: 'Vomiting blood, indicating bleeding in the upper gastrointestinal tract. This is a serious complication requiring medical attention.',
      examples: [
        'Vomiting bright red blood',
        'Vomiting "coffee ground" material',
        'Requires emergency evaluation',
      ],
    },
    melena: {
      term: 'Melena',
      definition: 'Black, tarry stools indicating upper GI bleeding. Blood has been digested, turning it black.',
      examples: [
        'Black, sticky stools',
        'Tar-like appearance',
        'Indicates significant bleeding',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged GERD symptoms. Higher ratings (30-60%) require medical documentation of complications and examination findings. Continue gastroenterology care and medication compliance.',
};

// ============================================
// RADICULOPATHY RATING CRITERIA (DC 8520)
// ============================================

export const RADICULOPATHY_CRITERIA = {
  diagnosticCode: '8520',
  condition: 'Radiculopathy',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8520',

  ratings: [
    {
      percent: 40,
      summary: 'Severe radiculopathy with pronounced motor loss and significant muscle atrophy',
      criteria: {
        severity: 'severe',
        motorLoss: 'pronounced',
        muscleAtrophy: true,
        functionLoss: 'significant',
      },
      criteriaDescription: [
        'Severe radiculopathy symptoms',
        'Pronounced motor loss (significant weakness)',
        'Visible or measurable muscle atrophy',
        'Significant functional limitation',
      ],
      evidenceNeeded: [
        'Clinical documentation of motor weakness',
        'Evidence of muscle atrophy',
        'EMG/nerve conduction studies showing severe nerve damage',
        'Functional limitation documentation',
      ],
    },
    {
      percent: 20,
      summary: 'Moderate radiculopathy with definite muscle weakness and some muscle atrophy',
      criteria: {
        severity: 'moderate',
        muscleWeakness: 'definite',
        muscleAtrophy: 'some',
        functionLoss: 'moderate',
      },
      criteriaDescription: [
        'Moderate radiculopathy symptoms',
        'Definite muscle weakness present',
        'Some measurable muscle atrophy',
        'Moderate functional impact',
      ],
      evidenceNeeded: [
        'Documentation of weakness',
        'Evidence of some atrophy',
        'Regular symptom logging',
        'Impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Mild radiculopathy with intermittent pain and paresthesia without motor loss',
      criteria: {
        severity: 'mild',
        intermittentPain: true,
        paresthesia: true,
        noMotorLoss: true,
      },
      criteriaDescription: [
        'Mild radiculopathy symptoms',
        'Intermittent pain along nerve pathway',
        'Paresthesia (numbness, tingling, burning)',
        'No significant motor weakness',
      ],
      evidenceNeeded: [
        'Regular logging of pain episodes',
        'Document paresthesia frequency',
        'Track pain location and radiation pattern',
        'Note triggering activities',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or minimal symptoms',
      criteria: {
        severity: 'minimal',
        asymptomatic: true,
      },
      criteriaDescription: [
        'Diagnosis present but minimal symptoms',
        'No functional limitation',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    radiculopathy: {
      term: 'Radiculopathy',
      definition: 'A condition caused by compression, inflammation, or injury to a spinal nerve root. Results in pain, numbness, tingling, or weakness that radiates along the nerve pathway.',
      examples: [
        'Sciatica (lumbar radiculopathy)',
        'Cervical radiculopathy causing arm pain',
        'Pain radiating down leg from compressed nerve',
      ],
    },
    paresthesia: {
      term: 'Paresthesia',
      definition: 'Abnormal sensations such as tingling, numbness, burning, or "pins and needles" along a nerve distribution.',
      examples: [
        'Numbness in specific fingers or toes',
        'Tingling down arm or leg',
        'Burning sensation in hand or foot',
      ],
    },
    motorLoss: {
      term: 'Motor Loss',
      definition: 'Weakness in muscles controlled by the affected nerve. Can range from mild weakness to complete paralysis.',
      examples: [
        'Difficulty lifting arm overhead',
        'Foot drop when walking',
        'Weak grip strength',
        'Difficulty rising from seated position',
      ],
    },
    muscleAtrophy: {
      term: 'Muscle Atrophy',
      definition: 'Visible wasting or shrinking of muscle tissue due to nerve damage preventing proper muscle activation.',
      examples: [
        'Noticeably smaller calf on one side',
        'Wasting of hand muscles',
        'Measurable difference in limb circumference',
      ],
    },
    dermatome: {
      term: 'Dermatome',
      definition: 'Specific area of skin supplied by a single spinal nerve. Radiculopathy symptoms typically follow dermatome patterns.',
      examples: [
        'L5 radiculopathy affects outer calf and top of foot',
        'C6 radiculopathy affects thumb and index finger',
        'S1 radiculopathy affects bottom of foot and little toe',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged radiculopathy symptoms. Higher ratings require clinical documentation of motor weakness and muscle atrophy. Continue orthopedic/neurology care and imaging studies (MRI, EMG) as recommended.',
};

// ============================================
// CHRONIC FATIGUE SYNDROME RATING CRITERIA (DC 6354)
// ============================================

export const CHRONIC_FATIGUE_CRITERIA = {
  diagnosticCode: '6354',
  condition: 'Chronic Fatigue Syndrome',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6354',

  ratings: [
    {
      percent: 100,
      summary: 'Incapacitating fatigue with substantially all of the following: cognitive impairment, sleep disturbance, chronic pain, loss of function',
      criteria: {
        incapacitating: true,
        cognitiveImpairment: true,
        sleepDisturbance: true,
        chronicPain: true,
        lossOfFunction: true,
      },
      criteriaDescription: [
        'Incapacitating fatigue substantially all of the time',
        'Cognitive impairment (memory, concentration)',
        'Sleep disturbance',
        'Chronic pain in multiple areas',
        'Loss of function and productivity',
        'Bed/house-bound most of the time',
      ],
      evidenceNeeded: [
        'Frequent episodes of debilitating fatigue (daily or near-daily)',
        'Document cognitive difficulties',
        'Log sleep problems',
        'Track chronic pain',
        'Show inability to work or perform daily activities',
      ],
    },
    {
      percent: 60,
      summary: 'Near-constant debilitating fatigue with most additional symptoms (cognitive, sleep, pain)',
      criteria: {
        nearConstant: true,
        debilitating: true,
        multipleSymptoms: true,
        significantImpairment: true,
      },
      criteriaDescription: [
        'Near-constant debilitating fatigue',
        'Significant cognitive impairment',
        'Chronic sleep disturbance',
        'Widespread chronic pain',
        'Significant impairment of daily activities',
      ],
      evidenceNeeded: [
        'Log fatigue episodes multiple times per week',
        'Document cognitive fog frequency',
        'Track sleep quality',
        'Show pattern of severe impairment',
      ],
    },
    {
      percent: 40,
      summary: 'Constant fatigue with some additional symptoms affecting daily activities',
      criteria: {
        constant: true,
        additionalSymptoms: true,
        dailyImpairment: true,
      },
      criteriaDescription: [
        'Constant fatigue not relieved by rest',
        'Some cognitive impairment or sleep disturbance',
        'Some chronic pain',
        'Moderate impairment of daily activities',
      ],
      evidenceNeeded: [
        'Log fatigue episodes weekly',
        'Document at least 2 additional symptoms regularly',
        'Show consistent pattern over months',
      ],
    },
    {
      percent: 20,
      summary: 'Frequent fatigue with mild additional symptoms',
      criteria: {
        frequent: true,
        mildAdditional: true,
      },
      criteriaDescription: [
        'Frequent episodes of fatigue',
        'Mild cognitive or sleep issues',
        'Occasional pain',
        'Mild impairment of activities',
      ],
      evidenceNeeded: [
        'Log fatigue episodes regularly',
        'Document frequency and severity',
        'Show pattern of impairment',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent fatigue with minimal additional symptoms',
      criteria: {
        intermittent: true,
        minimalAdditional: true,
      },
      criteriaDescription: [
        'Intermittent episodes of fatigue',
        'Minimal additional symptoms',
        'Slight impairment',
      ],
      evidenceNeeded: [
        'Log fatigue episodes',
        'Document triggers if known',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Diagnosis present but symptoms controlled',
        'No significant functional impairment',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    debilitatingFatigue: {
      term: 'Debilitating Fatigue',
      definition: 'Severe exhaustion that is not relieved by rest and significantly limits ability to perform daily activities. This is beyond normal tiredness.',
      examples: [
        'Unable to complete basic tasks without extended rest',
        'Must spend significant time in bed',
        'Cannot maintain employment due to fatigue',
        'Post-exertional malaise lasting days',
      ],
    },
    cognitiveImpairment: {
      term: 'Cognitive Impairment ("Brain Fog")',
      definition: 'Difficulty with memory, concentration, information processing, or word-finding. Often called "fibro fog" or "CFS brain fog".',
      examples: [
        'Forgetting conversations or appointments',
        'Difficulty reading or following complex information',
        'Trouble finding words mid-sentence',
        'Inability to multitask',
      ],
    },
    postExertionalMalaise: {
      term: 'Post-Exertional Malaise',
      definition: 'Worsening of symptoms following physical or mental exertion, often lasting 24-48 hours or longer.',
      examples: [
        'Severe fatigue after light exercise',
        'Crash after mental tasks',
        'Need for extended recovery after activity',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged CFS symptoms. VA rating requires medical diagnosis of Chronic Fatigue Syndrome and documentation of functional impairment. Continue medical care and document all symptoms comprehensively.',
};

// ============================================
// PERIPHERAL NEUROPATHY RATING CRITERIA (DC 8999)
// ============================================

export const PERIPHERAL_NEUROPATHY_CRITERIA = {
  diagnosticCode: '8999',
  condition: 'Peripheral Neuropathy',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8999',

  ratings: [
    {
      percent: 40,
      summary: 'Severe neuropathy with pronounced sensory loss and significant motor weakness affecting multiple extremities',
      criteria: {
        severity: 'severe',
        sensoryLoss: 'pronounced',
        motorWeakness: 'significant',
        multipleExtremities: true,
      },
      criteriaDescription: [
        'Severe sensory loss in multiple extremities',
        'Significant motor weakness',
        'Marked functional impairment',
        'May include loss of protective sensation',
      ],
      evidenceNeeded: [
        'Clinical documentation of sensory testing',
        'EMG/nerve conduction studies showing severe damage',
        'Documentation of motor weakness',
        'Evidence of functional limitations',
      ],
    },
    {
      percent: 30,
      summary: 'Moderate neuropathy with definite sensory loss and some motor involvement',
      criteria: {
        severity: 'moderate',
        sensoryLoss: 'definite',
        someMotorInvolvement: true,
      },
      criteriaDescription: [
        'Moderate sensory loss affecting daily function',
        'Some motor weakness or atrophy',
        'Moderate functional impairment',
      ],
      evidenceNeeded: [
        'Document numbness/tingling frequency',
        'Log areas affected (feet, hands, etc.)',
        'Note any weakness or balance issues',
        'EMG studies if available',
      ],
    },
    {
      percent: 20,
      summary: 'Mild to moderate neuropathy with sensory symptoms and minimal motor involvement',
      criteria: {
        severity: 'mild-moderate',
        sensorySymptoms: true,
        minimalMotor: true,
      },
      criteriaDescription: [
        'Persistent numbness, tingling, or burning',
        'Minimal motor weakness',
        'Some functional limitation',
      ],
      evidenceNeeded: [
        'Regular logging of paresthesia episodes',
        'Document distribution pattern',
        'Track pain or discomfort',
      ],
    },
    {
      percent: 10,
      summary: 'Mild neuropathy with intermittent sensory symptoms',
      criteria: {
        severity: 'mild',
        intermittent: true,
        sensoryOnly: true,
      },
      criteriaDescription: [
        'Intermittent numbness, tingling, or pain',
        'No motor weakness',
        'Minimal functional impact',
      ],
      evidenceNeeded: [
        'Log paresthesia episodes',
        'Document frequency and triggers',
        'Note affected areas',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Diagnosis present but symptoms mild or controlled',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    paresthesia: {
      term: 'Paresthesia',
      definition: 'Abnormal sensations such as numbness, tingling, burning, or "pins and needles" in the extremities.',
      examples: [
        'Numbness in feet or hands',
        'Tingling in toes or fingers',
        'Burning sensation in soles of feet',
        'Loss of feeling in affected areas',
      ],
    },
    stockingGlove: {
      term: 'Stocking-Glove Distribution',
      definition: 'Classic pattern of peripheral neuropathy where symptoms affect hands and feet in a pattern resembling gloves and stockings.',
      examples: [
        'Numbness in both feet up to ankles',
        'Tingling in both hands',
        'Symmetric involvement',
      ],
    },
    motorWeakness: {
      term: 'Motor Weakness',
      definition: 'Loss of muscle strength due to nerve damage affecting motor function.',
      examples: [
        'Difficulty walking or foot drop',
        'Weak grip strength',
        'Trouble with fine motor tasks (buttoning, writing)',
        'Balance problems',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged neuropathy symptoms. Higher ratings require clinical documentation including EMG/nerve conduction studies and sensory/motor testing. Common causes include diabetes, Agent Orange exposure, and various medications.',
};

// ============================================
// MENIERE'S DISEASE RATING CRITERIA (DC 6205)
// ============================================

export const MENIERES_CRITERIA = {
  diagnosticCode: '6205',
  condition: "Meniere's Disease",
  cfrReference: '38 CFR 4.85, Diagnostic Code 6205',

  ratings: [
    {
      percent: 100,
      summary: 'Hearing impairment with attacks of vertigo and tinnitus so severe and prolonged as to require bed rest most of the time',
      criteria: {
        severeVertigo: true,
        prolongedAttacks: true,
        requiresBedRest: true,
        mostOfTime: true,
        hearingImpairment: true,
        tinnitus: true,
      },
      criteriaDescription: [
        'Severe, prolonged vertigo attacks',
        'Requires bed rest most of the time',
        'Hearing impairment present',
        'Tinnitus present',
        'Essentially incapacitated',
      ],
      evidenceNeeded: [
        'Frequent severe vertigo attacks (multiple times per week)',
        'Document duration of attacks (hours/days)',
        'Audiometry showing hearing loss',
        'Medical documentation of diagnosis',
      ],
    },
    {
      percent: 60,
      summary: 'Hearing impairment with attacks of vertigo and tinnitus so severe as to require bed rest during attacks',
      criteria: {
        severeVertigo: true,
        requiresBedRest: true,
        duringAttacks: true,
        hearingImpairment: true,
        tinnitus: true,
      },
      criteriaDescription: [
        'Severe vertigo attacks requiring bed rest',
        'Attacks are disabling during episodes',
        'Hearing impairment documented',
        'Tinnitus present',
      ],
      evidenceNeeded: [
        'Log vertigo attacks requiring bed rest',
        'Document frequency (weekly or more)',
        'Audiometry results',
        'ENT documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Hearing impairment with vertigo and tinnitus less than severe',
      criteria: {
        hearingImpairment: true,
        vertigoPresent: true,
        tinnitusPresent: true,
        lessThanSevere: true,
      },
      criteriaDescription: [
        'Hearing impairment documented',
        'Vertigo episodes present but not incapacitating',
        'Tinnitus present',
        'Moderate impact on function',
      ],
      evidenceNeeded: [
        'Log vertigo episodes regularly',
        'Audiometry showing hearing loss',
        'Document tinnitus',
        'Show pattern of symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Diagnosis present',
        'Symptoms controlled or minimal',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    vertigo: {
      term: 'Vertigo',
      definition: 'A sensation of spinning or movement when you are stationary. Different from general dizziness - true vertigo feels like the room is spinning.',
      examples: [
        'Room spinning sensation',
        'Feeling like you are rotating',
        'Severe imbalance',
        'Nausea and vomiting with spinning',
      ],
    },
    menieresTornade: {
      term: "Meniere's Attack",
      definition: "Sudden episode of severe vertigo, hearing loss, tinnitus, and ear fullness. Can last from 20 minutes to several hours.",
      examples: [
        'Sudden spinning vertigo',
        'Temporary hearing loss in one ear',
        'Roaring tinnitus',
        'Feeling of pressure in ear',
      ],
    },
    hearingLoss: {
      term: 'Hearing Loss (Meniere\'s)',
      definition: 'Progressive sensorineural hearing loss typically affecting low frequencies first. May fluctuate early but becomes permanent over time.',
      examples: [
        'Difficulty hearing during attacks',
        'Progressive hearing reduction',
        'Documented on audiometry',
      ],
    },
  },

  disclaimer: "This analysis is based on logged Meniere's symptoms. VA rating requires ENT evaluation with audiometry and documentation of attack frequency and severity. Meniere's is a vestibular disorder requiring clinical diagnosis.",
};

// ============================================
// RHINITIS RATING CRITERIA (DC 6522)
// ============================================

export const RHINITIS_CRITERIA = {
  diagnosticCode: '6522',
  condition: 'Rhinitis (Allergic or Vasomotor)',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6522',

  ratings: [
    {
      percent: 30,
      summary: 'With polyps',
      criteria: {
        polyps: true,
      },
      criteriaDescription: [
        'Nasal polyps present',
        'Documented on examination',
      ],
      evidenceNeeded: [
        'ENT documentation of nasal polyps',
        'Nasal endoscopy or imaging showing polyps',
        'Chronic symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Without polyps but with chronic symptoms',
      criteria: {
        chronicSymptoms: true,
        noPolyps: true,
      },
      criteriaDescription: [
        'Chronic nasal congestion or drainage',
        'Frequent sneezing episodes',
        'Post-nasal drip',
        'No polyps present',
      ],
      evidenceNeeded: [
        'Log chronic congestion episodes',
        'Document post-nasal drainage',
        'Track sneezing/rhinorrhea frequency',
        'Show persistent pattern',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Symptoms controlled with medication',
        'Minimal functional impact',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    allergicRhinitis: {
      term: 'Allergic Rhinitis',
      definition: 'Inflammation of nasal passages due to allergic reaction to environmental triggers (pollen, dust, mold, etc.).',
      examples: [
        'Seasonal allergies',
        'Year-round allergies',
        'Sneezing, congestion, runny nose',
        'Itchy nose/eyes',
      ],
    },
    vasomotorRhinitis: {
      term: 'Vasomotor Rhinitis',
      definition: 'Non-allergic rhinitis triggered by environmental irritants, weather changes, or other non-allergic factors.',
      examples: [
        'Congestion from temperature changes',
        'Reaction to strong odors',
        'Exercise-induced symptoms',
        'Humidity-triggered symptoms',
      ],
    },
    nasalPolyps: {
      term: 'Nasal Polyps',
      definition: 'Soft, non-cancerous growths in the nasal passages or sinuses. Can block airflow and drainage.',
      examples: [
        'Feeling of nasal obstruction',
        'Reduced sense of smell',
        'Visible on nasal endoscopy',
        'May require surgical removal',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged rhinitis symptoms. 30% rating requires ENT documentation of nasal polyps. Continue ENT care and document chronic symptoms.',
};

export const TMJ_CRITERIA = {
  diagnosticCode: '9905',
  condition: 'Temporomandibular Joint (TMJ) Disorder',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9905',

  ratings: [
    {
      percent: 30,
      summary: 'Limitation of motion with severe pain on both sides or bilateral ankylosis',
      criteria: {
        bilateral: true,
        severePain: true,
        limitedMotion: true,
      },
      criteriaDescription: [
        'Limitation of motion on both sides',
        'Severe pain with jaw movement',
        'Or bilateral ankylosis (fusion)',
        'Significant functional impairment',
      ],
      evidenceNeeded: [
        'Document pain on both left and right TMJ',
        'Log pain with eating, talking, yawning',
        'Measure jaw opening (should be <35mm for limited motion)',
        'Dental/oral surgery documentation if available',
      ],
    },
    {
      percent: 20,
      summary: 'Limitation of motion with moderate pain on both sides or unilateral ankylosis',
      criteria: {
        bilateral: true,
        moderatePain: true,
        limitedMotion: true,
      },
      criteriaDescription: [
        'Moderate pain with jaw movement',
        'Limited opening on both sides',
        'Or unilateral ankylosis',
      ],
      evidenceNeeded: [
        'Document bilateral symptoms',
        'Track pain frequency and triggers',
        'Note clicking or popping sounds',
        'Jaw locking episodes',
      ],
    },
    {
      percent: 10,
      summary: 'Limitation of motion with mild pain',
      criteria: {
        limitedMotion: true,
        mildPain: true,
      },
      criteriaDescription: [
        'Mild pain with jaw movement',
        'Some limitation of opening',
        'May have clicking or popping',
      ],
      evidenceNeeded: [
        'Log jaw pain episodes',
        'Document clicking/popping',
        'Track difficulty with eating',
        'Note any headaches related to TMJ',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Diagnosis present but well-controlled',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    limitedOpening: {
      term: 'Limited Jaw Opening',
      definition: 'Reduced ability to open mouth measured from upper to lower incisors. Normal is 35-50mm; limited is <35mm.',
      examples: [
        'Difficulty eating large foods (apples, sandwiches)',
        'Trouble with dental work due to limited opening',
        'Cannot fit 2-3 fingers vertically between teeth',
      ],
    },
    clicking: {
      term: 'Clicking or Popping',
      definition: 'Audible sounds when opening or closing jaw due to disc displacement or joint irregularities.',
      examples: [
        'Click sound when opening mouth wide',
        'Pop when chewing',
        'Grinding sensation in jaw',
      ],
    },
    locking: {
      term: 'Jaw Locking',
      definition: 'Jaw becomes stuck in open or closed position temporarily, requiring manipulation to release.',
      examples: [
        'Jaw stuck open after yawning',
        'Cannot open mouth fully without manipulation',
        'Jaw catches or locks during movement',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged TMJ symptoms. VA rating requires dental/oral surgery examination with measurement of jaw opening. Document bilateral (both sides) involvement for higher ratings.',
};

// ============================================
// PLANTAR FASCIITIS RATING CRITERIA (DC 5276)
// ============================================

export const PLANTAR_FASCIITIS_CRITERIA = {
  diagnosticCode: '5276',
  condition: 'Plantar Fasciitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5276',

  ratings: [
    {
      percent: 30,
      summary: 'Bilateral severe plantar fasciitis with marked limitation of weight-bearing',
      criteria: {
        bilateral: true,
        severe: true,
        markedLimitation: true,
      },
      criteriaDescription: [
        'Severe plantar fasciitis affecting both feet',
        'Marked limitation of weight-bearing',
        'Significant functional impairment',
        'Unable to stand or walk for extended periods',
      ],
      evidenceNeeded: [
        'Document pain in both feet',
        'Log episodes affecting ability to walk/stand',
        'Track morning pain (first steps of day)',
        'Podiatry documentation if available',
      ],
    },
    {
      percent: 20,
      summary: 'Unilateral severe or bilateral moderate plantar fasciitis',
      criteria: {
        severe: true,
        functionalImpairment: true,
      },
      criteriaDescription: [
        'Severe plantar fasciitis in one foot, OR',
        'Moderate plantar fasciitis in both feet',
        'Noticeable functional limitation',
      ],
      evidenceNeeded: [
        'Log heel pain frequency',
        'Document impact on walking/standing',
        'Track pain with activity',
        'Note relief with rest',
      ],
    },
    {
      percent: 10,
      summary: 'Unilateral moderate or mild bilateral plantar fasciitis',
      criteria: {
        moderate: true,
        someImpairment: true,
      },
      criteriaDescription: [
        'Moderate pain in one foot, OR',
        'Mild pain in both feet',
        'Some functional limitation',
      ],
      evidenceNeeded: [
        'Regular logging of heel/arch pain',
        'Document morning pain',
        'Track duration of symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Symptoms controlled with orthotics/treatment',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    plantarFasciitis: {
      term: 'Plantar Fasciitis',
      definition: 'Inflammation of the thick band of tissue (plantar fascia) that runs across the bottom of the foot, connecting heel to toes.',
      examples: [
        'Sharp heel pain with first steps in morning',
        'Pain after standing or sitting for long periods',
        'Pain improves with movement but returns after rest',
        'Tenderness on bottom of heel',
      ],
    },
    morningPain: {
      term: 'Morning Pain',
      definition: 'Characteristic sharp pain in heel with first steps of the day. Often the most severe symptom of plantar fasciitis.',
      examples: [
        'Stabbing pain when getting out of bed',
        'Pain improves after walking around',
        'Returns after sitting for extended periods',
      ],
    },
    bilateral: {
      term: 'Bilateral Plantar Fasciitis',
      definition: 'Plantar fasciitis affecting both feet. Higher ratings require bilateral involvement.',
      examples: [
        'Pain in both heels',
        'Morning stiffness in both feet',
        'Difficulty walking due to pain in both feet',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged plantar fasciitis symptoms. VA rating requires podiatry examination and documentation of bilateral involvement and functional limitation. Conservative treatment (orthotics, stretching, NSAIDs) should be documented.',
};

// ============================================
// INSOMNIA RATING CRITERIA (DC 8108)
// ============================================

export const INSOMNIA_CRITERIA = {
  diagnosticCode: '8108',
  condition: 'Insomnia (Sleep Disorder)',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8108',

  ratings: [
    {
      percent: 100,
      summary: 'Total occupational and social impairment due to sleep disorder symptoms',
      criteria: {
        totalImpairment: true,
        occupationalImpact: true,
        socialImpact: true,
      },
      criteriaDescription: [
        'Chronic sleep deprivation causing total impairment',
        'Unable to work or maintain relationships',
        'Persistent inability to sleep despite treatment',
        'Severe daytime dysfunction',
      ],
      evidenceNeeded: [
        'Daily or near-daily sleep disturbance',
        'Document inability to function at work',
        'Track severe daytime fatigue/irritability',
        'Sleep study results if available',
      ],
    },
    {
      percent: 50,
      summary: 'Occupational and social impairment with reduced reliability and productivity',
      criteria: {
        significantImpairment: true,
        reducedProductivity: true,
      },
      criteriaDescription: [
        'Chronic sleep problems affecting work performance',
        'Reduced reliability and productivity',
        'Difficulty maintaining social relationships',
        'Persistent daytime dysfunction',
      ],
      evidenceNeeded: [
        'Frequent sleep disturbance (4-5 nights/week)',
        'Document work performance issues',
        'Track daytime impairment',
      ],
    },
    {
      percent: 30,
      summary: 'Occupational and social impairment with occasional decrease in work efficiency',
      criteria: {
        moderateImpairment: true,
        occasionalImpact: true,
      },
      criteriaDescription: [
        'Regular sleep disturbance',
        'Occasional decrease in work efficiency',
        'Some social impairment',
        'Moderate daytime dysfunction',
      ],
      evidenceNeeded: [
        'Regular sleep problems (3-4 nights/week)',
        'Document impact on daily activities',
        'Track missed work or reduced performance',
      ],
    },
    {
      percent: 10,
      summary: 'Mild sleep impairment with some daytime dysfunction',
      criteria: {
        mild: true,
        someImpairment: true,
      },
      criteriaDescription: [
        'Intermittent sleep problems',
        'Mild daytime fatigue or irritability',
        'Minimal functional impact',
      ],
      evidenceNeeded: [
        'Log sleep disturbance episodes',
        'Document frequency (1-2 nights/week)',
        'Track daytime symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but controlled with treatment',
      criteria: {
        controlled: true,
      },
      criteriaDescription: [
        'Sleep disorder controlled with medication',
        'Minimal functional impact',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    insomnia: {
      term: 'Insomnia',
      definition: 'Persistent difficulty falling asleep, staying asleep, or early morning awakening despite adequate opportunity for sleep.',
      examples: [
        'Taking >30 minutes to fall asleep regularly',
        'Waking up multiple times during night',
        'Waking 2+ hours before desired time',
        'Non-restorative sleep',
      ],
    },
    sleepLatency: {
      term: 'Sleep Onset Latency',
      definition: 'Time it takes to fall asleep. Normal is 10-20 minutes; insomnia often >30 minutes.',
      examples: [
        'Lying awake for 1-2 hours',
        'Mind racing preventing sleep',
        'Anxiety about falling asleep',
      ],
    },
    daytimeDysfunction: {
      term: 'Daytime Dysfunction',
      definition: 'Impairment during waking hours due to poor sleep. Key factor in VA rating.',
      examples: [
        'Severe fatigue affecting work',
        'Irritability or mood changes',
        'Difficulty concentrating',
        'Microsleep episodes',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged insomnia symptoms. VA rating considers functional impairment and occupational/social impact. Sleep studies may be required. Often rated as secondary to PTSD, chronic pain, or other conditions.',
};

// ============================================
// SINUSITIS RATING CRITERIA (DC 6510)
// ============================================

export const SINUSITIS_CRITERIA = {
  diagnosticCode: '6510',
  condition: 'Chronic Sinusitis',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6510',

  ratings: [
    {
      percent: 50,
      summary: 'Following radical surgery with chronic osteomyelitis or marked incapacitating episodes',
      criteria: {
        radicalSurgery: true,
        chronicOsteomyelitis: true,
        markedEpisodes: true,
      },
      criteriaDescription: [
        'Status post radical sinus surgery, OR',
        'Chronic osteomyelitis (bone infection), OR',
        'Marked incapacitating episodes of sinusitis requiring prolonged treatment',
      ],
      evidenceNeeded: [
        'Surgical records if applicable',
        'Frequent severe episodes requiring antibiotics',
        'ENT documentation of chronic infection',
        'CT or MRI showing chronic changes',
      ],
    },
    {
      percent: 30,
      summary: 'Three or more incapacitating episodes per year requiring prolonged antibiotics',
      criteria: {
        frequentEpisodes: true,
        requiresAntibiotics: true,
        incapacitating: true,
      },
      criteriaDescription: [
        '3+ incapacitating episodes per year',
        'Each requiring prolonged antibiotic treatment',
        'Episodes are disabling',
      ],
      evidenceNeeded: [
        'Log severe sinusitis episodes (3+ per year)',
        'Document antibiotic courses',
        'Track duration of each episode',
        'ENT visits and treatments',
      ],
    },
    {
      percent: 10,
      summary: 'One or two incapacitating episodes per year requiring prolonged antibiotics, or chronic symptoms',
      criteria: {
        episodes: true,
        chronicSymptoms: true,
      },
      criteriaDescription: [
        '1-2 incapacitating episodes per year requiring antibiotics, OR',
        'Chronic symptoms (congestion, drainage, facial pain)',
      ],
      evidenceNeeded: [
        'Log acute episodes if any',
        'Document chronic symptoms',
        'Track facial pain/pressure',
        'Post-nasal drainage frequency',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Symptoms controlled with medication',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode',
      definition: 'Acute sinusitis episode severe enough to prevent normal activities and require medical treatment with prolonged antibiotics.',
      examples: [
        'Severe facial pain requiring bed rest',
        'High fever with sinus infection',
        'Unable to work for several days',
        'Requires 10-14 day antibiotic course',
      ],
    },
    chronicSinusitis: {
      term: 'Chronic Sinusitis',
      definition: 'Inflammation of sinuses lasting 12+ weeks despite treatment. Symptoms include facial pain/pressure, nasal congestion, and post-nasal drainage.',
      examples: [
        'Persistent facial pressure for months',
        'Chronic post-nasal drip',
        'Recurring sinus infections',
        'Chronic headaches from sinus pressure',
      ],
    },
    prolongedAntibiotics: {
      term: 'Prolonged Antibiotic Treatment',
      definition: 'Antibiotic course lasting 10-14 days or longer. Short 5-7 day courses do not qualify for VA rating purposes.',
      examples: [
        '10-14 day antibiotic prescription',
        'Multiple courses per year',
        'Resistant infections requiring stronger antibiotics',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged sinusitis symptoms. VA rating requires ENT evaluation and documentation of incapacitating episodes requiring prolonged antibiotics. CT imaging strengthens claim.',
};


// ============================================
// SHOULDER CONDITIONS RATING CRITERIA (DC 5201-5203)
// ============================================

export const SHOULDER_CRITERIA = {
  diagnosticCode: '5201-5203',
  condition: 'Shoulder Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5201-5203',

  ratings: [
    {
      percent: 40,
      summary: 'Shoulder or arm, with severe limitation of motion (frozen shoulder)',
      criteria: {
        severeLimit: true,
        frozenShoulder: true,
      },
      criteriaDescription: [
        'Frozen shoulder or severe limitation',
        'Significant functional impairment',
        'ROM <90 degrees forward elevation or abduction',
      ],
      evidenceNeeded: [
        'Document severe pain limiting movement',
        'Track episodes preventing overhead reach',
        'Note difficulty with daily activities (dressing, reaching)',
        'ROM measurements if available',
      ],
    },
    {
      percent: 30,
      summary: 'Shoulder or arm, with moderate limitation of motion',
      criteria: {
        moderateLimit: true,
      },
      criteriaDescription: [
        'Moderate limitation of shoulder motion',
        'ROM 90-120 degrees forward elevation',
        'Noticeable functional impact',
      ],
      evidenceNeeded: [
        'Log pain with overhead activities',
        'Document limited range episodes',
        'Track impact on work/daily tasks',
      ],
    },
    {
      percent: 20,
      summary: 'Shoulder or arm, with slight to moderate limitation of motion',
      criteria: {
        slightLimit: true,
      },
      criteriaDescription: [
        'Slight to moderate limitation',
        'ROM 120-160 degrees',
        'Some functional limitation',
      ],
      evidenceNeeded: [
        'Regular pain episodes',
        'Document activities causing pain',
        'Track frequency and severity',
      ],
    },
    {
      percent: 10,
      summary: 'Shoulder or arm, with slight impairment or recurrent instability',
      criteria: {
        slightImpairment: true,
        recurrentInstability: true,
      },
      criteriaDescription: [
        'Slight impairment of function',
        'OR recurrent shoulder dislocations/subluxations',
        'Minimal but documented limitation',
      ],
      evidenceNeeded: [
        'Log pain episodes',
        'Document instability if present',
        'Track any giving way or weakness',
      ],
    },
    {
      percent: 0,
      summary: 'No significant limitation',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Full or near-full range of motion',
        'Minimal pain',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    rangeOfMotion: {
      term: 'Shoulder Range of Motion (ROM)',
      definition: 'Measured in degrees of forward elevation and abduction. Normal is 180 degrees; severe limitation is <90 degrees.',
      examples: [
        'Cannot raise arm above shoulder level (<90°)',
        'Difficulty reaching overhead (90-120°)',
        'Some limitation but can reach most areas (120-160°)',
        'Near-normal motion (160-180°)',
      ],
    },
    frozenShoulder: {
      term: 'Frozen Shoulder (Adhesive Capsulitis)',
      definition: 'Severe stiffness and pain in shoulder joint making movement very difficult or impossible.',
      examples: [
        'Cannot lift arm to comb hair',
        'Severe pain prevents reaching',
        'Stiffness limits all directions of movement',
      ],
    },
    instability: {
      term: 'Shoulder Instability',
      definition: 'Shoulder joint slides partially or completely out of position (subluxation or dislocation).',
      examples: [
        'Shoulder "pops out" with certain movements',
        'Feeling of shoulder about to dislocate',
        'History of multiple dislocations',
        'Apprehension with overhead activities',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged shoulder symptoms. VA rating requires orthopedic examination with ROM measurements. Higher ratings require documented ROM limitations in specific planes (forward elevation, abduction, internal/external rotation).',
};

// ============================================
// HIP CONDITIONS RATING CRITERIA (DC 5252-5255)
// ============================================

export const HIP_CRITERIA = {
  diagnosticCode: '5252-5255',
  condition: 'Hip Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5252-5255',

  ratings: [
    {
      percent: 60,
      summary: 'Hip ankylosis (fusion) in favorable position',
      criteria: {
        ankylosis: true,
        favorablePosition: true,
      },
      criteriaDescription: [
        'Complete ankylosis (fusion) of hip joint',
        'In favorable position for function',
      ],
      evidenceNeeded: [
        'Surgical records of hip fusion',
        'X-ray showing fusion',
        'Complete lack of hip motion',
      ],
    },
    {
      percent: 50,
      summary: 'Hip ankylosis in unfavorable position or with muscle atrophy',
      criteria: {
        ankylosis: true,
        unfavorablePosition: true,
      },
      criteriaDescription: [
        'Complete fusion in poor position, OR',
        'Ankylosis with muscle atrophy/weakness',
      ],
      evidenceNeeded: [
        'Imaging showing fusion',
        'Clinical documentation of position',
        'Muscle atrophy if present',
      ],
    },
    {
      percent: 40,
      summary: 'Hip with marked limitation of motion and severe pain',
      criteria: {
        markedLimitation: true,
        severePain: true,
      },
      criteriaDescription: [
        'Marked limitation of hip motion',
        'Severe pain with movement',
        'Significant functional impairment',
      ],
      evidenceNeeded: [
        'Frequent severe pain episodes',
        'Difficulty walking, climbing stairs',
        'Limited ROM measurements',
      ],
    },
    {
      percent: 30,
      summary: 'Hip with moderate limitation of motion',
      criteria: {
        moderateLimitation: true,
      },
      criteriaDescription: [
        'Moderate limitation of motion',
        'Moderate pain',
        'Noticeable functional limitation',
      ],
      evidenceNeeded: [
        'Regular pain with activity',
        'Document walking limitations',
        'Track stiffness and pain frequency',
      ],
    },
    {
      percent: 20,
      summary: 'Hip with slight to moderate limitation of motion',
      criteria: {
        slightLimitation: true,
      },
      criteriaDescription: [
        'Slight to moderate limitation',
        'Some pain with activity',
        'Mild functional impact',
      ],
      evidenceNeeded: [
        'Log hip pain episodes',
        'Document activities causing pain',
        'Track any limping or gait changes',
      ],
    },
    {
      percent: 10,
      summary: 'Hip with slight limitation or mild symptoms',
      criteria: {
        mild: true,
      },
      criteriaDescription: [
        'Slight limitation of motion',
        'Mild intermittent pain',
        'Minimal functional impact',
      ],
      evidenceNeeded: [
        'Document pain episodes',
        'Track frequency and triggers',
      ],
    },
    {
      percent: 0,
      summary: 'No significant limitation',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Normal or near-normal ROM',
        'Minimal pain',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    ankylosis: {
      term: 'Hip Ankylosis',
      definition: 'Complete fusion or immobility of the hip joint, either from disease, injury, or surgical fusion.',
      examples: [
        'Hip joint does not move at all',
        'Surgical hip fusion',
        'Complete stiffness from arthritis',
      ],
    },
    hipROM: {
      term: 'Hip Range of Motion',
      definition: 'Movement of hip in flexion, extension, abduction, adduction, and rotation. Normal flexion is 120-125 degrees.',
      examples: [
        'Difficulty bending forward to tie shoes (flexion)',
        'Cannot spread legs apart (abduction)',
        'Pain with rotation (internal/external rotation)',
        'Stiffness limiting walking stride',
      ],
    },
    functionalImpairment: {
      term: 'Hip Functional Impairment',
      definition: 'Impact on daily activities: walking, climbing stairs, sitting, getting in/out of car, standing from seated position.',
      examples: [
        'Difficulty walking long distances',
        'Pain climbing stairs',
        'Limping or altered gait',
        'Cannot sit for extended periods',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged hip symptoms. VA rating requires orthopedic examination with ROM measurements and functional assessment. X-rays showing degenerative changes strengthen claims.',
};

// ============================================
// ASTHMA RATING CRITERIA (DC 6602)
// ============================================

export const ASTHMA_CRITERIA = {
  diagnosticCode: '6602',
  condition: 'Bronchial Asthma',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6602',

  ratings: [
    {
      percent: 100,
      summary: 'FEV-1 <40% predicted, OR FEV-1/FVC <40%, OR >1 attack/week with respiratory failure, OR daily systemic corticosteroids',
      criteria: {
        fev1Percent: [0, 39],
        fev1FvcRatio: [0, 39],
        attacksPerWeek: 1.1,
        respiratoryFailure: true,
        dailySystemicSteroids: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% of predicted value, OR',
        'FEV-1/FVC ratio less than 40%, OR',
        'More than one attack per week with episodes of respiratory failure, OR',
        'Requires daily use of systemic (oral or parenteral) high dose corticosteroids or immuno-suppressive medications',
      ],
      evidenceNeeded: [
        'Spirometry results showing FEV-1 <40% predicted',
        'FEV-1/FVC ratio calculation',
        'Documentation of frequent attacks with respiratory failure',
        'Medical records of daily systemic steroid use',
      ],
    },
    {
      percent: 60,
      summary: 'FEV-1 40-55% predicted, OR FEV-1/FVC 40-55%, OR monthly MD visits for exacerbations, OR ≥3 systemic steroid courses/year',
      criteria: {
        fev1Percent: [40, 55],
        fev1FvcRatio: [40, 55],
        mdVisitsPerMonth: 1,
        systemicSteroidCourses: 3,
      },
      criteriaDescription: [
        'FEV-1 of 40-55% of predicted value, OR',
        'FEV-1/FVC ratio of 40-55%, OR',
        'At least monthly visits to physician for required care of exacerbations, OR',
        'Intermittent (at least 3 per year) courses of systemic corticosteroids',
      ],
      evidenceNeeded: [
        'Spirometry results showing FEV-1 40-55% predicted',
        'FEV-1/FVC ratio in 40-55% range',
        'Medical records showing monthly physician visits for asthma',
        'Documentation of ≥3 oral steroid courses per year',
      ],
    },
    {
      percent: 30,
      summary: 'FEV-1 56-70% predicted, OR FEV-1/FVC 56-70%, OR daily inhaled bronchodilator, OR inhaled anti-inflammatory medication',
      criteria: {
        fev1Percent: [56, 70],
        fev1FvcRatio: [56, 70],
        dailyInhaledBronchodilator: true,
        inhaledAntiInflammatory: true,
      },
      criteriaDescription: [
        'FEV-1 of 56-70% of predicted value, OR',
        'FEV-1/FVC ratio of 56-70%, OR',
        'Daily inhalational or oral bronchodilator therapy, OR',
        'Inhalational anti-inflammatory medication',
      ],
      evidenceNeeded: [
        'Spirometry results showing FEV-1 56-70% predicted',
        'FEV-1/FVC ratio in 56-70% range',
        'Prescription records for daily inhaled bronchodilators',
        'Prescription records for inhaled corticosteroids or anti-inflammatory meds',
      ],
    },
    {
      percent: 10,
      summary: 'FEV-1 71-80% predicted, OR FEV-1/FVC 71-80%, OR intermittent inhaled bronchodilator therapy',
      criteria: {
        fev1Percent: [71, 80],
        fev1FvcRatio: [71, 80],
        intermittentInhaledBronchodilator: true,
      },
      criteriaDescription: [
        'FEV-1 of 71-80% of predicted value, OR',
        'FEV-1/FVC ratio of 71-80%, OR',
        'Intermittent inhalational or oral bronchodilator therapy',
      ],
      evidenceNeeded: [
        'Spirometry results showing FEV-1 71-80% predicted',
        'FEV-1/FVC ratio in 71-80% range',
        'Prescription records for rescue inhalers',
        'Documentation of intermittent bronchodilator use',
      ],
    },
    {
      percent: 0,
      summary: 'FEV-1 >80% predicted without symptoms or only minimal medication use',
      criteria: {
        fev1Percent: [81, 200],
      },
      criteriaDescription: [
        'FEV-1 greater than 80% of predicted value',
        'Minimal or no symptoms',
        'Minimal or no medication requirements',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    fev1: {
      term: 'FEV-1 (Forced Expiratory Volume in 1 second)',
      definition: 'Amount of air you can forcefully exhale in 1 second. Measured by spirometry. The VA uses this as the primary measure for asthma severity.',
      examples: [
        'Example: If your predicted FEV-1 is 4.0 L and your actual FEV-1 is 2.8 L, your FEV-1 is 70% predicted',
      ],
    },
    fev1FvcRatio: {
      term: 'FEV-1/FVC Ratio',
      definition: 'The ratio of FEV-1 to FVC (Forced Vital Capacity). Normal is typically >70-75%. Lower ratios indicate airway obstruction.',
      examples: [
        'Example: FEV-1 of 2.8 L ÷ FVC of 4.0 L = 70% ratio',
      ],
    },
    systemicCorticosteroids: {
      term: 'Systemic Corticosteroids',
      definition: 'Oral or injectable steroids like prednisone or methylprednisolone. These are different from inhaled steroids - systemic steroids affect the whole body.',
      examples: [
        'Prednisone pills or "steroid packs" for severe exacerbations',
        'Not the same as inhaled corticosteroids like Flovent or Advair',
      ],
    },
    exacerbation: {
      term: 'Exacerbation',
      definition: 'A worsening of asthma symptoms requiring increased treatment. May require physician visit, oral steroids, or ER visit.',
    },
    bronchodilator: {
      term: 'Bronchodilator',
      definition: 'Medication that opens airways. Can be rescue inhalers (albuterol) or long-acting (salmeterol). VA distinguishes between intermittent and daily use.',
      examples: [
        'Rescue inhalers: Albuterol (ProAir, Ventolin) - used as needed',
        'Daily bronchodilators: Salmeterol (Serevent), formoterol (Foradil)',
      ],
    },
    postBronchodilator: {
      term: 'Post-Bronchodilator Testing',
      definition: 'Spirometry performed after using a bronchodilator. VA generally uses post-bronchodilator results unless pre-bronchodilator values are worse.',
    },
  },

  note: 'In the absence of clinical findings of asthma at time of examination, a verified history of asthmatic attacks must be of record.',
};

// ============================================
// RATING CRITERIA - HEARING LOSS
// ============================================

export const HEARING_LOSS_CRITERIA = {
  description: 'Hearing loss rated based on pure-tone audiometry',
  levels: [
    {
      rating: '100%',
      criteria: [
        'Bilateral hearing loss with average of 55 dB or worse at 500, 1000, 2000 Hz',
        'With additional loss at 3000, 4000 Hz'
      ]
    },
    {
      rating: '60%',
      criteria: [
        'Bilateral hearing loss with average of 45-54 dB at 500, 1000, 2000 Hz'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Bilateral hearing loss with average of 35-44 dB at 500, 1000, 2000 Hz'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Bilateral hearing loss with average of 26-34 dB at 500, 1000, 2000 Hz'
      ]
    },
    {
      rating: '0%',
      criteria: ['Hearing loss present but below compensable level']
    }
  ],
  notes: [
    'Requires audiometry testing (pure-tone threshold test)',
    'Rating based on Maryland CNC word test or similar',
    'Unilateral hearing loss may be compensable if severe'
  ]
};

// ============================================
// RATING CRITERIA - SCARS
// ============================================

export const SCARS_CRITERIA = {
  description: 'Scars rated based on location, size, and characteristics',
  levels: [
    {
      rating: '80%',
      criteria: [
        'Head, face, or neck: deep scar(s) that cause gross distortion',
        'Extremely unsightly or disfiguring'
      ]
    },
    {
      rating: '50%',
      criteria: [
        'Head, face, or neck: 144+ square cm of scarring',
        'Unstable or painful scars over large areas'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Head, face, or neck: 72-143 square cm',
        'Or one major characteristic causing moderate disfigurement'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Head, face, or neck: 6-71 square cm',
        'Other body areas: 144+ square cm'
      ]
    },
    {
      rating: '0%',
      criteria: ['Scarring present but below compensable levels']
    }
  ],
  notes: [
    'Measure scars in square centimeters',
    'Head/face/neck scars rated higher due to visibility',
    'Unstable or painful scars may warrant higher rating',
    'Keloid scars rated based on size and characteristics'
  ]
};

// ============================================
// RATING CRITERIA - PSORIASIS
// ============================================

export const PSORIASIS_CRITERIA = {
  description: 'Psoriasis rated based on extent of body coverage and characteristics',
  levels: [
    {
      rating: '60%',
      criteria: [
        'Characteristic lesions of 40% or more of entire body',
        'Or 40% or more of exposed areas affected'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Characteristic lesions of 20-39% of entire body',
        'Or 20-39% of exposed areas affected'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Characteristic lesions of 5-19% of entire body',
        'Or 5-19% of exposed areas affected'
      ]
    },
    {
      rating: '0%',
      criteria: ['Psoriasis present but affects less than 5% of body']
    }
  ],
  notes: [
    'Exposed areas: head, face, neck, hands',
    'Use "rule of nines" or palm method (palm = ~1% body surface)',
    'Active lesions only (not clear/remission areas)',
    'Systemic therapy may indicate severity'
  ]
};

// ============================================
// RATING CRITERIA - ECZEMA/DERMATITIS
// ============================================

export const ECZEMA_CRITERIA = {
  description: 'Eczema/dermatitis rated based on extent and characteristics',
  levels: [
    {
      rating: '60%',
      criteria: [
        'More than 40% of entire body or exposed areas affected',
        'Characteristic lesions with intense itching'
      ]
    },
    {
      rating: '30%',
      criteria: [
        '20-40% of entire body or exposed areas affected'
      ]
    },
    {
      rating: '10%',
      criteria: [
        '5-20% of entire body or exposed areas affected',
        'With frequent flare-ups'
      ]
    },
    {
      rating: '0%',
      criteria: ['Eczema present but affects less than 5% of body']
    }
  ],
  notes: [
    'Exposed areas: head, face, neck, hands (rated same as body)',
    'Consider frequency and duration of flare-ups',
    'Lichenification (thickened skin) indicates chronic condition'
  ]
};

// ============================================
// RATING CRITERIA - TBI RESIDUALS
// ============================================

export const TBI_RESIDUALS_CRITERIA = {
  description: 'Residual effects of TBI rated based on cognitive, emotional, and physical symptoms',
  levels: [
    {
      rating: '100%',
      criteria: [
        'Total occupational and social impairment',
        'Unable to perform activities of daily living'
      ]
    },
    {
      rating: '70%',
      criteria: [
        'Occupational and social impairment with deficiencies in most areas',
        'Memory loss, impaired judgment, severe mood disturbance'
      ]
    },
    {
      rating: '50%',
      criteria: [
        'Occupational and social impairment with reduced reliability',
        'Memory problems, difficulty concentrating, mood issues'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Occupational and social impairment with occasional decrease in efficiency',
        'Mild memory loss, attention difficulties'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Mild residual symptoms',
        'Occasional cognitive or emotional difficulties'
      ]
    },
    {
      rating: '0%',
      criteria: ['TBI history but no current symptoms']
    }
  ],
  notes: [
    'Often rated same as main TBI rating',
    'Consider cognitive, emotional, and physical residuals',
    'Neuropsychological testing may support higher ratings',
    'Pyramidal on top of TBI rating for paralysis/motor issues'
  ]
};

// ============================================
// RATING CRITERIA - GERD COMPLICATIONS
// ============================================

export const GERD_COMPLICATIONS_CRITERIA = {
  description: 'GERD with complications rated based on severity and treatment required',
  levels: [
    {
      rating: '60%',
      criteria: [
        'Severe symptoms with Barrett\'s esophagus',
        'Or stricture requiring dilation every 2-3 months',
        'Significant weight loss, malnutrition'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Persistently recurrent symptoms with documented pathology',
        'Hiatal hernia or stricture with occasional dilation',
        'Daily medication required despite treatment'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Symptoms controlled with continuous medication',
        'Mild to moderate pathology (esophagitis, small hiatal hernia)'
      ]
    },
    {
      rating: '0%',
      criteria: ['GERD complications documented but symptoms controlled']
    }
  ],
  notes: [
    'Requires documentation of complications via endoscopy',
    'Barrett\'s esophagus is pre-cancerous condition',
    'Frequency of dilation procedures indicates severity',
    'Weight loss/malnutrition elevates rating'
  ]
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

/**
 * Analyze IBS logs for VA rating
 * DC 7319 - Irritable Bowel Syndrome
 */
export const analyzeIBSLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const ibsSymptoms = logs.filter(log =>
      CONDITIONS.IBS.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (ibsSymptoms.length === 0) {
    return {
      condition: 'Irritable Bowel Syndrome',
      diagnosticCode: '7319',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No IBS symptoms logged in evaluation period',
        'Log diarrhea, constipation, or bowel disturbance episodes',
        'Document abdominal pain or discomfort',
        'Track frequency and severity of episodes',
      ],
      criteria: IBS_CRITERIA,
      disclaimer: IBS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count episodes by type
  const diarrheaCount = ibsSymptoms.filter(s => s.symptomId === 'ibs-diarrhea').length;
  const constipationCount = ibsSymptoms.filter(s => s.symptomId === 'ibs-constipation').length;
  const painCount = ibsSymptoms.filter(s => s.symptomId === 'ibs-pain').length;
  const bloatingCount = ibsSymptoms.filter(s => s.symptomId === 'ibs-bloating').length;
  const urgencyCount = ibsSymptoms.filter(s => s.symptomId === 'ibs-urgency').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = ibsSymptoms.length / weeksInPeriod;

  evidence.push(`${ibsSymptoms.length} IBS episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (diarrheaCount > 0) evidence.push(`${diarrheaCount} diarrhea episodes`);
  if (constipationCount > 0) evidence.push(`${constipationCount} constipation episodes`);
  if (painCount > 0) evidence.push(`${painCount} abdominal pain episodes`);

  // Check for alternating pattern
  const hasAlternating = diarrheaCount > 0 && constipationCount > 0;
  if (hasAlternating) {
    evidence.push('Alternating diarrhea and constipation pattern documented');
  }

  // Determine rating
  // 30%: Frequent episodes (3+ per week) with diarrhea/alternating + distress
  if (episodesPerWeek >= 3 && (diarrheaCount > 0 || hasAlternating) && painCount > 0) {
    supportedRating = '30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (meets "frequent" threshold)`,
        `${hasAlternating ? 'Alternating diarrhea/constipation' : 'Diarrhea episodes'} documented`,
        `Abdominal distress logged ${painCount} times`,
        'Meets criteria for severe IBS with frequent episodes'
    );
  }
  // 10%: Moderate symptoms, occasional episodes (1+ per week)
  else if (episodesPerWeek >= 1) {
    supportedRating = '10';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Meets criteria for moderate IBS with occasional episodes',
        'Bowel disturbance pattern established'
    );

    if (episodesPerWeek >= 2) {
      gaps.push(`Approaching 30% threshold - log more associated symptoms (pain, urgency)`);
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Less than once weekly - may be diet-controlled',
        'Does not meet frequency for service-connected rating'
    );
  }

  // Documentation gaps
  if (ibsSymptoms.length < 12) {
    gaps.push(`Only ${ibsSymptoms.length} episodes logged - aim for 12+ over 90 days for pattern`);
  }

  if (painCount === 0) {
    gaps.push('No abdominal pain episodes logged - document distress for higher rating');
  }

  if (diarrheaCount === 0 && constipationCount === 0) {
    gaps.push('Log specific diarrhea or constipation episodes, not just pain');
  }

  if (!hasAlternating && constipationCount === 0 && diarrheaCount > 0) {
    gaps.push('Consider logging constipation episodes if alternating pattern present');
  }

  return {
    condition: 'Irritable Bowel Syndrome',
    diagnosticCode: '7319',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: IBS_CRITERIA,
    disclaimer: IBS_CRITERIA.disclaimer,
  };
};


/**
 * Analyze GERD logs for VA rating
 * DC 7346 - Gastroesophageal Reflux Disease
 */
export const analyzeGERDLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const gerdSymptoms = logs.filter(log =>
      CONDITIONS.GERD.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (gerdSymptoms.length === 0) {
    return {
      condition: 'Gastroesophageal Reflux Disease (GERD)',
      diagnosticCode: '7346',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No GERD symptoms logged in evaluation period',
        'Log heartburn (pyrosis) episodes',
        'Document regurgitation frequency',
        'Track chest pain, difficulty swallowing if present',
      ],
      criteria: GERD_CRITERIA,
      disclaimer: GERD_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const heartburnCount = gerdSymptoms.filter(s => s.symptomId === 'gerd-heartburn').length;
  const regurgitationCount = gerdSymptoms.filter(s => s.symptomId === 'gerd-regurgitation').length;
  const chestPainCount = gerdSymptoms.filter(s => s.symptomId === 'gerd-chest-pain').length;
  const dysphagiaCount = gerdSymptoms.filter(s => s.symptomId === 'gerd-difficulty-swallowing').length;
  const nauseaCount = gerdSymptoms.filter(s => s.symptomId === 'gerd-nausea').length;

  // Count unique symptom types
  const uniqueSymptoms = new Set(gerdSymptoms.map(s => s.symptomId)).size;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = gerdSymptoms.length / weeksInPeriod;

  evidence.push(`${gerdSymptoms.length} GERD episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);
  evidence.push(`${uniqueSymptoms} different symptom types documented`);

  if (heartburnCount > 0) evidence.push(`${heartburnCount} heartburn episodes`);
  if (regurgitationCount > 0) evidence.push(`${regurgitationCount} regurgitation episodes`);
  if (chestPainCount > 0) evidence.push(`${chestPainCount} chest pain episodes`);
  if (dysphagiaCount > 0) evidence.push(`${dysphagiaCount} difficulty swallowing episodes`);

  // Determine rating
  // 60%: Requires weight loss, bleeding, anemia documentation
  // (Cannot be determined from symptoms alone)

  // 30%: Persistent recurrent symptoms with dysphagia, pyrosis, regurgitation + chest pain
  if (episodesPerWeek >= 3 && heartburnCount > 0 && regurgitationCount > 0 &&
      (chestPainCount > 0 || dysphagiaCount > 0)) {
    supportedRating = '30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (persistently recurrent)`,
        'Heartburn (pyrosis) documented',
        'Regurgitation documented',
        chestPainCount > 0 ? 'Chest pain episodes logged' : 'Dysphagia (difficulty swallowing) logged',
        'Meets criteria for considerable impairment'
    );
  }
  // 10%: Two or more symptoms, less severe
  else if (uniqueSymptoms >= 2) {
    supportedRating = '10';
    ratingRationale.push(
        `${uniqueSymptoms} different GERD symptoms documented`,
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Meets criteria for 10% (two or more symptoms of less severity)'
    );

    if (episodesPerWeek >= 2 && heartburnCount > 0 && regurgitationCount > 0) {
      gaps.push('Close to 30% - log chest pain or dysphagia if present');
      gaps.push('Document persistence and frequency for higher rating');
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Symptoms appear controlled or minimal',
        'May be managed with medication',
        'Does not meet frequency for higher rating'
    );
  }

  // Documentation gaps
  if (gerdSymptoms.length < 12) {
    gaps.push(`Only ${gerdSymptoms.length} episodes logged - aim for 12+ over 90 days`);
  }

  if (uniqueSymptoms < 2) {
    gaps.push('Log multiple symptom types for higher rating consideration');
  }

  if (heartburnCount === 0) {
    gaps.push('Heartburn (pyrosis) is hallmark GERD symptom - document if present');
  }

  if (dysphagiaCount > 0) {
    gaps.push('Difficulty swallowing documented - get endoscopy results for claim');
  }

  // 60% requires clinical documentation
  gaps.push('60% rating requires medical documentation of weight loss, bleeding, or anemia');

  return {
    condition: 'Gastroesophageal Reflux Disease (GERD)',
    diagnosticCode: '7346',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: GERD_CRITERIA,
    disclaimer: GERD_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Radiculopathy logs for VA rating
 * DC 8520 - Radiculopathy
 */
export const analyzeRadiculopathyLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const radiculopathySymptoms = logs.filter(log =>
      CONDITIONS.RADICULOPATHY.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (radiculopathySymptoms.length === 0) {
    return {
      condition: 'Radiculopathy',
      diagnosticCode: '8520',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No radiculopathy symptoms logged in evaluation period',
        'Log radiating pain episodes',
        'Document numbness, tingling, or burning sensations',
        'Track weakness if present',
        'Note which nerve distribution (e.g., L5, S1, C6)',
      ],
      criteria: RADICULOPATHY_CRITERIA,
      disclaimer: RADICULOPATHY_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = radiculopathySymptoms.filter(s => s.symptomId === 'radiculopathy-pain').length;
  const numbnessCount = radiculopathySymptoms.filter(s => s.symptomId === 'radiculopathy-numbness').length;
  const tinglingCount = radiculopathySymptoms.filter(s => s.symptomId === 'radiculopathy-tingling').length;
  const weaknessCount = radiculopathySymptoms.filter(s => s.symptomId === 'radiculopathy-weakness').length;
  const burningCount = radiculopathySymptoms.filter(s => s.symptomId === 'radiculopathy-burning').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = radiculopathySymptoms.length / weeksInPeriod;

  evidence.push(`${radiculopathySymptoms.length} radiculopathy episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} radiating pain episodes`);
  if (numbnessCount > 0) evidence.push(`${numbnessCount} numbness episodes`);
  if (tinglingCount > 0) evidence.push(`${tinglingCount} tingling episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (burningCount > 0) evidence.push(`${burningCount} burning sensation episodes`);

  // Paresthesia count (numbness + tingling + burning)
  const paresthesiaCount = numbnessCount + tinglingCount + burningCount;

  // Determine rating
  // 40%: Severe with motor loss - requires clinical documentation
  // 20%: Moderate with weakness - requires clinical documentation

  // 10%: Mild with pain and paresthesia, no motor loss
  if (painCount > 0 && paresthesiaCount > 0 && weaknessCount === 0) {
    supportedRating = '10';
    ratingRationale.push(
        'Radiating pain documented',
        'Paresthesia (numbness/tingling/burning) present',
        'No motor weakness logged',
        'Meets criteria for mild radiculopathy (10%)'
    );

    if (weaknessCount > 0) {
      gaps.push('Weakness documented - clinical exam needed to assess motor loss for higher rating');
    }
  }
  else if (weaknessCount > 0) {
    supportedRating = 'Requires Clinical Documentation';
    ratingRationale.push(
        'Muscle weakness documented',
        'Higher ratings (20-40%) require clinical examination',
        'Need documentation of motor strength testing',
        'EMG/nerve conduction studies recommended'
    );
    gaps.push('Get clinical documentation of motor weakness degree');
    gaps.push('Request EMG/nerve conduction studies if not done');
    gaps.push('Document muscle atrophy if visible');
  }
  else if (painCount > 0 || paresthesiaCount > 0) {
    supportedRating = '10';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Radiculopathy symptoms present',
        'Meets criteria for minimal rating'
    );

    if (painCount === 0) {
      gaps.push('Log radiating pain episodes for stronger claim');
    }
    if (paresthesiaCount === 0) {
      gaps.push('Document paresthesia (numbness, tingling) if present');
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Minimal or well-controlled symptoms',
        'Does not meet frequency for service-connected rating'
    );
  }

  // Documentation gaps
  if (radiculopathySymptoms.length < 12) {
    gaps.push(`Only ${radiculopathySymptoms.length} episodes logged - aim for 12+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Radiating pain is key symptom - document pain distribution');
  }

  if (paresthesiaCount === 0) {
    gaps.push('Document paresthesia pattern (which fingers/toes affected)');
  }

  gaps.push('Higher ratings require MRI showing nerve compression');
  gaps.push('EMG/nerve conduction studies strengthen claim');

  return {
    condition: 'Radiculopathy',
    diagnosticCode: '8520',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: RADICULOPATHY_CRITERIA,
    disclaimer: RADICULOPATHY_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Chronic Fatigue logs for VA rating
 * DC 6354 - Chronic Fatigue Syndrome
 */
export const analyzeChronicFatigueLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cfsSymptoms = logs.filter(log =>
      CONDITIONS.CHRONIC_FATIGUE.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (cfsSymptoms.length === 0) {
    return {
      condition: 'Chronic Fatigue Syndrome',
      diagnosticCode: '6354',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No CFS symptoms logged in evaluation period',
        'Log debilitating fatigue episodes',
        'Document cognitive impairment ("brain fog")',
        'Track sleep disturbance',
        'Note chronic pain if present',
      ],
      criteria: CHRONIC_FATIGUE_CRITERIA,
      disclaimer: CHRONIC_FATIGUE_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const fatigueCount = cfsSymptoms.filter(s => s.symptomId === 'cfs-fatigue').length;
  const cognitiveCount = cfsSymptoms.filter(s => s.symptomId === 'cfs-cognitive').length;
  const sleepCount = cfsSymptoms.filter(s => s.symptomId === 'cfs-sleep').length;
  const painCount = cfsSymptoms.filter(s => s.symptomId === 'cfs-pain').length;
  const headacheCount = cfsSymptoms.filter(s => s.symptomId === 'cfs-headache').length;

  // Count unique symptom types
  const uniqueSymptoms = new Set(cfsSymptoms.map(s => s.symptomId)).size;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = cfsSymptoms.length / weeksInPeriod;

  evidence.push(`${cfsSymptoms.length} CFS episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);
  evidence.push(`${uniqueSymptoms} different symptom types documented`);

  if (fatigueCount > 0) evidence.push(`${fatigueCount} debilitating fatigue episodes`);
  if (cognitiveCount > 0) evidence.push(`${cognitiveCount} cognitive impairment episodes`);
  if (sleepCount > 0) evidence.push(`${sleepCount} sleep disturbance episodes`);
  if (painCount > 0) evidence.push(`${painCount} chronic pain episodes`);

  // Check for "substantially all" symptoms (need 4+ of 5 types)
  const hasSubstantiallyAll = uniqueSymptoms >= 4;

  // Determine rating based on frequency and symptom variety
  // 100%: Daily/near-daily + substantially all symptoms
  if (episodesPerWeek >= 5 && hasSubstantiallyAll) {
    supportedRating = '100';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (daily/near-daily)`,
        `${uniqueSymptoms} different symptom types (substantially all)`,
        'Debilitating fatigue documented',
        'Multiple associated symptoms present',
        'Meets criteria for incapacitating CFS'
    );
  }
  // 60%: Near-constant (4+ per week) + multiple symptoms
  else if (episodesPerWeek >= 4 && uniqueSymptoms >= 3) {
    supportedRating = '60';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (near-constant)`,
        `${uniqueSymptoms} different symptom types`,
        'Meets criteria for severe CFS with significant impairment'
    );
  }
  // 40%: Constant (3+ per week) + some additional symptoms
  else if (episodesPerWeek >= 3 && uniqueSymptoms >= 2) {
    supportedRating = '40';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (constant)`,
        `${uniqueSymptoms} different symptom types`,
        'Meets criteria for constant fatigue with additional symptoms'
    );
  }
  // 20%: Frequent (2+ per week)
  else if (episodesPerWeek >= 2) {
    supportedRating = '20';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (frequent)`,
        'Meets criteria for frequent fatigue'
    );

    if (uniqueSymptoms >= 2) {
      gaps.push('Close to 40% - increase logging frequency for higher rating');
    }
  }
  // 10%: Intermittent (1+ per week)
  else if (episodesPerWeek >= 1) {
    supportedRating = '10';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (intermittent)`,
        'Meets criteria for intermittent fatigue'
    );
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Less than weekly episodes',
        'May be well-controlled or minimal'
    );
  }

  // Documentation gaps
  if (cfsSymptoms.length < 20) {
    gaps.push(`Only ${cfsSymptoms.length} episodes logged - aim for 20+ over 90 days`);
  }

  if (fatigueCount === 0) {
    gaps.push('No debilitating fatigue episodes logged - this is the core symptom');
  }

  if (cognitiveCount === 0) {
    gaps.push('Log cognitive impairment ("brain fog") if present');
  }

  if (sleepCount === 0) {
    gaps.push('Document sleep disturbance if present');
  }

  if (uniqueSymptoms < 3) {
    gaps.push('Higher ratings require multiple symptom types - log all CFS symptoms');
  }

  gaps.push('Document inability to work or perform daily activities for higher ratings');
  gaps.push('Post-exertional malaise (crash after activity) supports diagnosis');

  return {
    condition: 'Chronic Fatigue Syndrome',
    diagnosticCode: '6354',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: CHRONIC_FATIGUE_CRITERIA,
    disclaimer: CHRONIC_FATIGUE_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Peripheral Neuropathy logs for VA rating
 * DC 8999 - Peripheral Neuropathy
 */
export const analyzePeripheralNeuropathyLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const pnSymptoms = logs.filter(log =>
      CONDITIONS.PERIPHERAL_NEUROPATHY.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (pnSymptoms.length === 0) {
    return {
      condition: 'Peripheral Neuropathy',
      diagnosticCode: '8999',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No peripheral neuropathy symptoms logged',
        'Log numbness, tingling, or burning in extremities',
        'Document affected areas (feet, hands, etc.)',
        'Track any weakness if present',
      ],
      criteria: PERIPHERAL_NEUROPATHY_CRITERIA,
      disclaimer: PERIPHERAL_NEUROPATHY_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const numbnessCount = pnSymptoms.filter(s => s.symptomId === 'pn-numbness').length;
  const tinglingCount = pnSymptoms.filter(s => s.symptomId === 'pn-tingling').length;
  const burningCount = pnSymptoms.filter(s => s.symptomId === 'pn-burning').length;
  const painCount = pnSymptoms.filter(s => s.symptomId === 'pn-pain').length;
  const weaknessCount = pnSymptoms.filter(s => s.symptomId === 'pn-weakness').length;

  // Paresthesia count (numbness + tingling + burning)
  const paresthesiaCount = numbnessCount + tinglingCount + burningCount;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = pnSymptoms.length / weeksInPeriod;

  evidence.push(`${pnSymptoms.length} neuropathy episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (numbnessCount > 0) evidence.push(`${numbnessCount} numbness episodes`);
  if (tinglingCount > 0) evidence.push(`${tinglingCount} tingling episodes`);
  if (burningCount > 0) evidence.push(`${burningCount} burning sensation episodes`);
  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);

  // Determine rating
  // 40%: Severe with motor weakness - requires clinical documentation
  // 30%: Moderate with some motor
  // 20%: Mild-moderate with sensory
  // 10%: Mild intermittent sensory

  if (weaknessCount > 5 && paresthesiaCount > 10) {
    supportedRating = 'Requires Clinical Documentation';
    ratingRationale.push(
        'Significant weakness documented',
        'Extensive paresthesia',
        '30-40% ratings require clinical examination and EMG studies',
        'Need documentation of sensory/motor testing'
    );
    gaps.push('Get EMG/nerve conduction studies if not done');
    gaps.push('Request clinical sensory testing documentation');
    gaps.push('Document areas of sensory loss on body diagram');
  }
  else if (weaknessCount > 0 || (paresthesiaCount > 15 && episodesPerWeek >= 3)) {
    supportedRating = '20';
    ratingRationale.push(
        `${paresthesiaCount} paresthesia episodes (numbness/tingling/burning)`,
        weaknessCount > 0 ? `${weaknessCount} weakness episodes` : 'Persistent sensory symptoms',
        'Meets criteria for mild-moderate neuropathy'
    );

    if (weaknessCount > 2) {
      gaps.push('Weakness documented - clinical exam may support higher rating');
    }
  }
  else if (paresthesiaCount > 0 || painCount > 0) {
    supportedRating = '10';
    ratingRationale.push(
        `${pnSymptoms.length} neuropathy episodes`,
        'Sensory symptoms documented',
        'Meets criteria for mild peripheral neuropathy'
    );
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Minimal or well-controlled symptoms'
    );
  }

  // Documentation gaps
  if (pnSymptoms.length < 12) {
    gaps.push(`Only ${pnSymptoms.length} episodes logged - aim for 12+ over 90 days`);
  }

  if (paresthesiaCount === 0) {
    gaps.push('Document paresthesia (numbness, tingling, burning) if present');
  }

  if (weaknessCount > 0) {
    gaps.push('Weakness documented - get clinical motor strength testing');
  }

  gaps.push('Document which extremities affected (feet/hands/both)');
  gaps.push('EMG/nerve conduction studies strengthen claim significantly');
  gaps.push('Common causes: diabetes, Agent Orange, medications - document etiology');

  return {
    condition: 'Peripheral Neuropathy',
    diagnosticCode: '8999',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: PERIPHERAL_NEUROPATHY_CRITERIA,
    disclaimer: PERIPHERAL_NEUROPATHY_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Meniere's Disease logs for VA rating
 * DC 6205 - Meniere's Disease
 */
export const analyzeMenieresLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const menieresSymptoms = logs.filter(log =>
      CONDITIONS.MENIERES.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (menieresSymptoms.length === 0) {
    return {
      condition: "Meniere's Disease",
      diagnosticCode: '6205',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        "No Meniere's symptoms logged",
        'Log vertigo episodes (spinning sensation)',
        'Document tinnitus if present',
        'Note hearing loss or ear fullness',
        'Track duration and severity of attacks',
      ],
      criteria: MENIERES_CRITERIA,
      disclaimer: MENIERES_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const vertigoCount = menieresSymptoms.filter(s => s.symptomId === 'menieres-vertigo').length;
  const tinnitusCount = menieresSymptoms.filter(s => s.symptomId === 'menieres-tinnitus').length;
  const hearingLossCount = menieresSymptoms.filter(s => s.symptomId === 'menieres-hearing-loss').length;
  const nauseaCount = menieresSymptoms.filter(s => s.symptomId === 'menieres-nausea').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = menieresSymptoms.length / weeksInPeriod;

  evidence.push(`${menieresSymptoms.length} Meniere's episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (vertigoCount > 0) evidence.push(`${vertigoCount} vertigo attacks`);
  if (tinnitusCount > 0) evidence.push(`${tinnitusCount} tinnitus episodes`);
  if (hearingLossCount > 0) evidence.push(`${hearingLossCount} hearing loss episodes`);
  if (nauseaCount > 0) evidence.push(`${nauseaCount} nausea episodes`);

  // Check for classic triad: vertigo + tinnitus + hearing loss
  const hasTriad = vertigoCount > 0 && tinnitusCount > 0 && hearingLossCount > 0;

  // Determine rating
  // 100%: Multiple attacks per week, bed rest most of time
  if (episodesPerWeek >= 3 && vertigoCount >= 10 && hasTriad) {
    supportedRating = '100';
    ratingRationale.push(
        `${vertigoCount} vertigo attacks (multiple per week)`,
        'Classic triad documented (vertigo + tinnitus + hearing loss)',
        'Meets criteria for severe, prolonged attacks requiring bed rest'
    );
    gaps.push('Document that attacks require bed rest');
    gaps.push('Get audiometry showing hearing loss');
  }
  // 60%: Weekly+ attacks requiring bed rest
  else if (episodesPerWeek >= 1 && vertigoCount >= 4 && hasTriad) {
    supportedRating = '60';
    ratingRationale.push(
        `${vertigoCount} severe vertigo attacks`,
        'Classic triad present',
        'Meets criteria for attacks requiring bed rest'
    );
    gaps.push('Document that vertigo attacks require bed rest during episodes');
    gaps.push('Audiometry required for formal rating');
  }
  // 30%: Regular symptoms, less severe
  else if ((vertigoCount > 0 || tinnitusCount > 0) && episodesPerWeek >= 0.5) {
    supportedRating = '30';
    ratingRationale.push(
        `${menieresSymptoms.length} episodes documented`,
        'Vertigo and/or tinnitus present',
        'Meets criteria for less than severe symptoms'
    );

    if (!hasTriad) {
      gaps.push('30% rating requires hearing impairment + vertigo + tinnitus');
      gaps.push('Get audiometry to document hearing loss');
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Symptoms minimal or well-controlled'
    );
  }

  // Documentation gaps
  if (menieresSymptoms.length < 8) {
    gaps.push(`Only ${menieresSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (vertigoCount === 0) {
    gaps.push('Vertigo is hallmark symptom - log spinning/rotational vertigo attacks');
  }

  if (!hasTriad) {
    gaps.push('Classic Meniere\'s triad: vertigo + tinnitus + hearing loss');
    if (tinnitusCount === 0) gaps.push('Document tinnitus if present');
    if (hearingLossCount === 0) gaps.push('Document hearing loss if present');
  }

  gaps.push('All ratings require ENT evaluation with audiometry');
  gaps.push('Document duration of vertigo attacks (minutes to hours)');
  gaps.push('Note if attacks require bed rest or emergency treatment');

  return {
    condition: "Meniere's Disease",
    diagnosticCode: '6205',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: MENIERES_CRITERIA,
    disclaimer: MENIERES_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Rhinitis logs for VA rating
 * DC 6522 - Rhinitis
 */
export const analyzeRhinitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const rhinitisSymptoms = logs.filter(log =>
      CONDITIONS.RHINITIS.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (rhinitisSymptoms.length === 0) {
    return {
      condition: 'Rhinitis (Allergic or Vasomotor)',
      diagnosticCode: '6522',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No rhinitis symptoms logged',
        'Log chronic congestion episodes',
        'Document post-nasal drainage',
        'Track sneezing or breathing difficulty',
        'Note triggers if known',
      ],
      criteria: RHINITIS_CRITERIA,
      disclaimer: RHINITIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const congestionCount = rhinitisSymptoms.filter(s => s.symptomId === 'rhinitis-congestion').length;
  const drainageCount = rhinitisSymptoms.filter(s => s.symptomId === 'rhinitis-drainage').length;
  const sneezingCount = rhinitisSymptoms.filter(s => s.symptomId === 'rhinitis-sneezing').length;
  const breathingCount = rhinitisSymptoms.filter(s => s.symptomId === 'rhinitis-breathing').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = rhinitisSymptoms.length / weeksInPeriod;

  evidence.push(`${rhinitisSymptoms.length} rhinitis episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (congestionCount > 0) evidence.push(`${congestionCount} congestion episodes`);
  if (drainageCount > 0) evidence.push(`${drainageCount} post-nasal drainage episodes`);
  if (sneezingCount > 0) evidence.push(`${sneezingCount} sneezing episodes`);
  if (breathingCount > 0) evidence.push(`${breathingCount} breathing difficulty episodes`);

  // Determine rating
  // 30%: With polyps (requires ENT documentation)
  // 10%: Chronic symptoms without polyps

  // Can only support 10% from symptom logging alone
  if (episodesPerWeek >= 2 || rhinitisSymptoms.length >= 15) {
    supportedRating = '10';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Chronic symptoms documented',
        'Meets criteria for 10% rating (without polyps)'
    );
  }
  else if (episodesPerWeek >= 1) {
    supportedRating = '10';
    ratingRationale.push(
        `${rhinitisSymptoms.length} episodes over ${evaluationPeriodDays} days`,
        'Regular symptoms documented',
        'Supports 10% rating'
    );
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Symptoms minimal or well-controlled'
    );
  }

  // Documentation gaps
  if (rhinitisSymptoms.length < 10) {
    gaps.push(`Only ${rhinitisSymptoms.length} episodes logged - aim for 10+ over 90 days`);
  }

  if (congestionCount === 0) {
    gaps.push('Chronic nasal congestion is key symptom - document if present');
  }

  gaps.push('30% rating requires ENT documentation of nasal polyps');
  gaps.push('Get nasal endoscopy or imaging if polyps suspected');
  gaps.push('Document if symptoms are seasonal or year-round');
  gaps.push('Note any triggers (allergens, weather, irritants)');

  return {
    condition: 'Rhinitis (Allergic or Vasomotor)',
    diagnosticCode: '6522',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: RHINITIS_CRITERIA,
    disclaimer: RHINITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze TMJ logs for VA rating
 * DC 9905 - TMJ Disorder
 */
export const analyzeTMJLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const tmjSymptoms = logs.filter(log =>
      CONDITIONS.TMJ.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (tmjSymptoms.length === 0) {
    return {
      condition: 'Temporomandibular Joint (TMJ) Disorder',
      diagnosticCode: '9905',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No TMJ symptoms logged',
        'Log jaw pain episodes',
        'Document clicking, popping, or locking',
        'Track difficulty with eating or talking',
        'Note if symptoms are on one or both sides',
      ],
      criteria: TMJ_CRITERIA,
      disclaimer: TMJ_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = tmjSymptoms.filter(s => s.symptomId === 'tmj-pain').length;
  const clickingCount = tmjSymptoms.filter(s => s.symptomId === 'tmj-clicking').length;
  const limitedOpeningCount = tmjSymptoms.filter(s => s.symptomId === 'tmj-limited-opening').length;
  const lockingCount = tmjSymptoms.filter(s => s.symptomId === 'tmj-locking').length;
  const headacheCount = tmjSymptoms.filter(s => s.symptomId === 'tmj-headache').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = tmjSymptoms.length / weeksInPeriod;

  evidence.push(`${tmjSymptoms.length} TMJ episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (clickingCount > 0) evidence.push(`${clickingCount} clicking/popping episodes`);
  if (limitedOpeningCount > 0) evidence.push(`${limitedOpeningCount} limited opening episodes`);
  if (lockingCount > 0) evidence.push(`${lockingCount} jaw locking episodes`);
  if (headacheCount > 0) evidence.push(`${headacheCount} TMJ-related headaches`);

  // Determine rating
  // Need dental/oral surgery exam for formal rating, but can support with symptoms
  // 30%: Bilateral severe pain with limited motion
  // 20%: Bilateral moderate or unilateral severe
  // 10%: Mild symptoms

  if (episodesPerWeek >= 4 && painCount >= 10 && (limitedOpeningCount > 5 || lockingCount > 3)) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (frequent)`,
        `${painCount} pain episodes documented`,
        limitedOpeningCount > 0 ? `${limitedOpeningCount} limited opening episodes` : `${lockingCount} locking episodes`,
        'Symptoms suggest moderate to severe TMJ dysfunction'
    );
    gaps.push('Higher ratings (20-30%) require dental/oral surgery examination');
    gaps.push('Document if symptoms affect BOTH sides of jaw (bilateral)');
    gaps.push('Measure jaw opening: normal is 35-50mm, limited is <35mm');
  }
  else if (episodesPerWeek >= 2 || painCount >= 5) {
    supportedRating = '10';
    ratingRationale.push(
        `${tmjSymptoms.length} TMJ episodes documented`,
        'Regular pain and dysfunction',
        'Meets criteria for 10% rating (mild TMJ disorder)'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'TMJ symptoms documented',
        'Supports 10% rating for mild disorder'
    );
  }

  // Documentation gaps
  if (tmjSymptoms.length < 8) {
    gaps.push(`Only ${tmjSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Pain is primary TMJ symptom - document jaw pain episodes');
  }

  if (clickingCount === 0 && limitedOpeningCount === 0 && lockingCount === 0) {
    gaps.push('Log mechanical symptoms: clicking, limited opening, or locking');
  }

  gaps.push('All TMJ ratings require dental/oral surgery examination');
  gaps.push('Document bilateral (both sides) involvement for higher ratings');
  gaps.push('Track impact on eating, talking, yawning');

  return {
    condition: 'Temporomandibular Joint (TMJ) Disorder',
    diagnosticCode: '9905',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: TMJ_CRITERIA,
    disclaimer: TMJ_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Plantar Fasciitis logs for VA rating
 * DC 5276 - Plantar Fasciitis
 */
export const analyzePlantarFasciitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const pfSymptoms = logs.filter(log =>
      CONDITIONS.PLANTAR_FASCIITIS.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (pfSymptoms.length === 0) {
    return {
      condition: 'Plantar Fasciitis',
      diagnosticCode: '5276',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No plantar fasciitis symptoms logged',
        'Log heel pain episodes',
        'Document morning pain (first steps)',
        'Track arch pain and stiffness',
        'Note if symptoms affect one or both feet',
      ],
      criteria: PLANTAR_FASCIITIS_CRITERIA,
      disclaimer: PLANTAR_FASCIITIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const heelPainCount = pfSymptoms.filter(s => s.symptomId === 'pf-heel-pain').length;
  const archPainCount = pfSymptoms.filter(s => s.symptomId === 'pf-arch-pain').length;
  const morningPainCount = pfSymptoms.filter(s => s.symptomId === 'pf-morning-pain').length;
  const stiffnessCount = pfSymptoms.filter(s => s.symptomId === 'pf-stiffness').length;
  const walkingDifficultyCount = pfSymptoms.filter(s => s.symptomId === 'pf-difficulty-walking').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = pfSymptoms.length / weeksInPeriod;

  evidence.push(`${pfSymptoms.length} plantar fasciitis episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (heelPainCount > 0) evidence.push(`${heelPainCount} heel pain episodes`);
  if (archPainCount > 0) evidence.push(`${archPainCount} arch pain episodes`);
  if (morningPainCount > 0) evidence.push(`${morningPainCount} morning pain episodes (characteristic symptom)`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (walkingDifficultyCount > 0) evidence.push(`${walkingDifficultyCount} walking difficulty episodes`);

  // Determine rating
  // 30%: Bilateral severe with marked limitation
  // 20%: Unilateral severe or bilateral moderate
  // 10%: Unilateral moderate or bilateral mild

  if (episodesPerWeek >= 5 && walkingDifficultyCount >= 8) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (frequent)`,
        `${walkingDifficultyCount} episodes affecting ability to walk`,
        'Symptoms suggest severe functional limitation'
    );
    gaps.push('Higher ratings require podiatry documentation of bilateral involvement');
    gaps.push('Document severity on BOTH feet for 30% rating');
    gaps.push('Track impact on weight-bearing and standing');
  }
  else if (episodesPerWeek >= 3 || walkingDifficultyCount > 0) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${pfSymptoms.length} episodes over ${evaluationPeriodDays} days`,
        walkingDifficultyCount > 0 ? 'Functional impairment documented' : 'Regular symptoms documented',
        'Supports 10-20% rating range'
    );
    gaps.push('Document if symptoms affect one foot (unilateral) or both (bilateral)');
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        `${pfSymptoms.length} plantar fasciitis episodes`,
        'Supports 10% rating for mild to moderate symptoms'
    );
  }

  // Documentation gaps
  if (pfSymptoms.length < 10) {
    gaps.push(`Only ${pfSymptoms.length} episodes logged - aim for 10+ over 90 days`);
  }

  if (morningPainCount === 0) {
    gaps.push('Morning pain (first steps) is characteristic - document if present');
  }

  if (walkingDifficultyCount === 0) {
    gaps.push('Document functional impact: difficulty walking, standing, or weight-bearing');
  }

  gaps.push('Higher ratings require bilateral (both feet) involvement');
  gaps.push('Podiatry examination strengthens claim');
  gaps.push('Document orthotics, injections, or physical therapy tried');

  return {
    condition: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: PLANTAR_FASCIITIS_CRITERIA,
    disclaimer: PLANTAR_FASCIITIS_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Insomnia logs for VA rating
 * DC 8108 - Insomnia
 */
export const analyzeInsomniaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const insomniaSymptoms = logs.filter(log =>
      CONDITIONS.INSOMNIA.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (insomniaSymptoms.length === 0) {
    return {
      condition: 'Insomnia (Sleep Disorder)',
      diagnosticCode: '8108',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No insomnia symptoms logged',
        'Log difficulty falling asleep',
        'Document difficulty staying asleep',
        'Track early morning awakening',
        'Note daytime fatigue and functional impact',
      ],
      criteria: INSOMNIA_CRITERIA,
      disclaimer: INSOMNIA_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const difficultyFallingCount = insomniaSymptoms.filter(s => s.symptomId === 'insomnia-difficulty-falling-asleep').length;
  const difficultyStayingCount = insomniaSymptoms.filter(s => s.symptomId === 'insomnia-difficulty-staying-asleep').length;
  const earlyWakingCount = insomniaSymptoms.filter(s => s.symptomId === 'insomnia-early-waking').length;
  const fatigueCount = insomniaSymptoms.filter(s => s.symptomId === 'insomnia-fatigue').length;
  const irritabilityCount = insomniaSymptoms.filter(s => s.symptomId === 'insomnia-irritability').length;

  // Calculate per-week average (nights with insomnia)
  const weeksInPeriod = evaluationPeriodDays / 7;
  const nightsPerWeek = insomniaSymptoms.length / weeksInPeriod;

  evidence.push(`${insomniaSymptoms.length} insomnia episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${nightsPerWeek.toFixed(1)} nights per week with sleep disturbance`);

  if (difficultyFallingCount > 0) evidence.push(`${difficultyFallingCount} nights with difficulty falling asleep`);
  if (difficultyStayingCount > 0) evidence.push(`${difficultyStayingCount} nights with difficulty staying asleep`);
  if (earlyWakingCount > 0) evidence.push(`${earlyWakingCount} early morning awakenings`);
  if (fatigueCount > 0) evidence.push(`${fatigueCount} daytime fatigue episodes`);
  if (irritabilityCount > 0) evidence.push(`${irritabilityCount} irritability episodes from poor sleep`);

  // Determine rating based on frequency and functional impact
  // 100%: Daily/near-daily with total impairment
  // 50%: 4-5 nights/week with significant work impact
  // 30%: 3-4 nights/week with moderate impact
  // 10%: 1-2 nights/week with mild impact

  if (nightsPerWeek >= 6 && fatigueCount >= 15) {
    supportedRating = '50-100';
    ratingRationale.push(
        `${nightsPerWeek.toFixed(1)} nights per week with insomnia (daily/near-daily)`,
        `${fatigueCount} daytime dysfunction episodes`,
        'Chronic severe sleep deprivation',
        'Likely significant occupational/social impairment'
    );
    gaps.push('50-100% ratings require documentation of occupational impairment');
    gaps.push('Document work performance issues or inability to work');
    gaps.push('Sleep study results strengthen claim');
  }
  else if (nightsPerWeek >= 4 && fatigueCount >= 8) {
    supportedRating = '30-50';
    ratingRationale.push(
        `${nightsPerWeek.toFixed(1)} nights per week with insomnia (frequent)`,
        `${fatigueCount} daytime dysfunction episodes`,
        'Supports 30-50% rating range'
    );
    gaps.push('Document work performance impact for higher rating');
    gaps.push('Track missed work or reduced productivity');
  }
  else if (nightsPerWeek >= 3) {
    supportedRating = '30';
    ratingRationale.push(
        `${nightsPerWeek.toFixed(1)} nights per week with insomnia`,
        'Regular sleep disturbance',
        'Meets criteria for 30% rating'
    );
  }
  else if (nightsPerWeek >= 1) {
    supportedRating = '10';
    ratingRationale.push(
        `${nightsPerWeek.toFixed(1)} nights per week with insomnia`,
        'Intermittent sleep problems',
        'Meets criteria for 10% rating'
    );
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Infrequent sleep disturbance',
        'May be controlled with treatment'
    );
  }

  // Documentation gaps
  if (insomniaSymptoms.length < 12) {
    gaps.push(`Only ${insomniaSymptoms.length} episodes logged - aim for 12+ over 90 days`);
  }

  if (fatigueCount === 0 && irritabilityCount === 0) {
    gaps.push('Document daytime dysfunction (fatigue, irritability, concentration problems)');
  }

  if (difficultyFallingCount === 0 && difficultyStayingCount === 0 && earlyWakingCount === 0) {
    gaps.push('Specify type of insomnia: difficulty falling asleep, staying asleep, or early waking');
  }

  gaps.push('Often rated as secondary to PTSD, chronic pain, or other conditions');
  gaps.push('Sleep study may be required for higher ratings');
  gaps.push('Document treatments tried (medication, CBT-I, sleep hygiene)');

  return {
    condition: 'Insomnia (Sleep Disorder)',
    diagnosticCode: '8108',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: INSOMNIA_CRITERIA,
    disclaimer: INSOMNIA_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Sinusitis logs for VA rating
 * DC 6510 - Chronic Sinusitis
 */
export const analyzeSinusitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const sinusitisSymptoms = logs.filter(log =>
      CONDITIONS.SINUSITIS.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (sinusitisSymptoms.length === 0) {
    return {
      condition: 'Chronic Sinusitis',
      diagnosticCode: '6510',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No sinusitis symptoms logged',
        'Log facial pain/pressure episodes',
        'Document nasal congestion',
        'Track sinus headaches',
        'Note post-nasal drainage',
      ],
      criteria: SINUSITIS_CRITERIA,
      disclaimer: SINUSITIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const facialPainCount = sinusitisSymptoms.filter(s => s.symptomId === 'sinusitis-facial-pain').length;
  const pressureCount = sinusitisSymptoms.filter(s => s.symptomId === 'sinusitis-pressure').length;
  const congestionCount = sinusitisSymptoms.filter(s => s.symptomId === 'sinusitis-congestion').length;
  const headacheCount = sinusitisSymptoms.filter(s => s.symptomId === 'sinusitis-headache').length;
  const drainageCount = sinusitisSymptoms.filter(s => s.symptomId === 'sinusitis-drainage').length;

  // Check if chronic (persistent symptoms) vs episodic (acute attacks)
  const daysWithSymptoms = new Set(sinusitisSymptoms.map(s =>
      new Date(s.timestamp).toDateString()
  )).size;

  const weeksInPeriod = evaluationPeriodDays / 7;

  evidence.push(`${sinusitisSymptoms.length} sinusitis episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`${daysWithSymptoms} different days with symptoms`);

  if (facialPainCount > 0) evidence.push(`${facialPainCount} facial pain episodes`);
  if (pressureCount > 0) evidence.push(`${pressureCount} sinus pressure episodes`);
  if (congestionCount > 0) evidence.push(`${congestionCount} congestion episodes`);
  if (headacheCount > 0) evidence.push(`${headacheCount} sinus headaches`);
  if (drainageCount > 0) evidence.push(`${drainageCount} post-nasal drainage episodes`);

  // Determine rating
  // 50%: Radical surgery or marked incapacitating episodes
  // 30%: 3+ incapacitating episodes/year
  // 10%: 1-2 episodes/year or chronic symptoms

  // Estimate annual episodes
  const estimatedAnnualEpisodes = (daysWithSymptoms / evaluationPeriodDays) * 365;

  if (daysWithSymptoms >= 60 && (facialPainCount >= 15 || headacheCount >= 15)) {
    supportedRating = '10-30';
    ratingRationale.push(
        `${daysWithSymptoms} days with symptoms over ${evaluationPeriodDays} days`,
        'Chronic sinusitis symptoms documented',
        'Likely supports 10-30% rating range'
    );
    gaps.push('30% rating requires 3+ incapacitating episodes per year');
    gaps.push('Document acute episodes requiring prolonged antibiotics (10-14 days)');
    gaps.push('ENT evaluation and CT imaging strengthen claim');
  }
  else if (daysWithSymptoms >= 20 || sinusitisSymptoms.length >= 15) {
    supportedRating = '10';
    ratingRationale.push(
        `${sinusitisSymptoms.length} episodes documented`,
        'Chronic or recurrent sinusitis symptoms',
        'Supports 10% rating'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'Sinusitis symptoms documented',
        'Supports 10% rating for chronic symptoms'
    );
  }

  // Documentation gaps
  if (sinusitisSymptoms.length < 10) {
    gaps.push(`Only ${sinusitisSymptoms.length} episodes logged - aim for 10+ over 90 days`);
  }

  gaps.push('For 30% rating: document 3+ severe episodes per year requiring 10-14 day antibiotics');
  gaps.push('Track each acute episode: date, duration, antibiotic prescribed');
  gaps.push('ENT evaluation with nasal endoscopy strengthens claim');
  gaps.push('CT or MRI showing chronic sinus changes helpful');
  gaps.push('Document if symptoms persist despite treatment (chronic)');

  return {
    condition: 'Chronic Sinusitis',
    diagnosticCode: '6510',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: SINUSITIS_CRITERIA,
    disclaimer: SINUSITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Shoulder logs for VA rating
 * DC 5201-5203 - Shoulder Conditions
 */
export const analyzeShoulderLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const shoulderSymptoms = logs.filter(log =>
      CONDITIONS.SHOULDER.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (shoulderSymptoms.length === 0) {
    return {
      condition: 'Shoulder Conditions',
      diagnosticCode: '5201-5203',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No shoulder symptoms logged',
        'Log shoulder pain episodes',
        'Document limited range of motion',
        'Track instability or weakness',
        'Note impact on daily activities (reaching, lifting)',
      ],
      criteria: SHOULDER_CRITERIA,
      disclaimer: SHOULDER_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = shoulderSymptoms.filter(s => s.symptomId === 'shoulder-pain').length;
  const limitedROMCount = shoulderSymptoms.filter(s => s.symptomId === 'shoulder-limited-rom').length;
  const instabilityCount = shoulderSymptoms.filter(s => s.symptomId === 'shoulder-instability').length;
  const weaknessCount = shoulderSymptoms.filter(s => s.symptomId === 'shoulder-weakness').length;
  const stiffnessCount = shoulderSymptoms.filter(s => s.symptomId === 'shoulder-stiffness').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = shoulderSymptoms.length / weeksInPeriod;

  evidence.push(`${shoulderSymptoms.length} shoulder episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited range of motion episodes`);
  if (instabilityCount > 0) evidence.push(`${instabilityCount} instability episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);

  // Determine rating based on frequency and severity
  // Higher ratings require ROM measurements from orthopedic exam
  // 40%: Severe limitation (<90° forward elevation)
  // 30%: Moderate limitation (90-120°)
  // 20%: Slight-moderate (120-160°)
  // 10%: Slight impairment or recurrent instability

  if (limitedROMCount >= 10 && (painCount >= 10 || stiffnessCount >= 10)) {
    supportedRating = '30-40';
    ratingRationale.push(
        `${limitedROMCount} limited ROM episodes documented`,
        `${painCount} pain episodes`,
        'Suggests moderate to severe limitation of motion',
        'ROM measurements required for formal rating'
    );
    gaps.push('Orthopedic exam with ROM measurements required for 30-40% rating');
    gaps.push('Severe limitation: <90° forward elevation or abduction');
    gaps.push('Moderate limitation: 90-120° forward elevation');
  }
  else if (limitedROMCount >= 5 || (painCount >= 8 && episodesPerWeek >= 2)) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${shoulderSymptoms.length} shoulder episodes`,
        limitedROMCount > 0 ? `${limitedROMCount} limited ROM episodes` : 'Regular pain limiting function',
        'Supports 20-30% rating range'
    );
    gaps.push('ROM measurements strengthen claim: 120-160° = 20%, 90-120° = 30%');
  }
  else if (instabilityCount > 0 || shoulderSymptoms.length >= 8) {
    supportedRating = '10';
    ratingRationale.push(
        `${shoulderSymptoms.length} episodes documented`,
        instabilityCount > 0 ? 'Recurrent instability documented' : 'Regular shoulder symptoms',
        'Supports 10% rating for slight impairment'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'Shoulder symptoms documented',
        'Supports 10% rating'
    );
  }

  // Documentation gaps
  if (shoulderSymptoms.length < 8) {
    gaps.push(`Only ${shoulderSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Pain is primary symptom - log shoulder pain episodes');
  }

  if (limitedROMCount === 0) {
    gaps.push('Document limited range of motion episodes');
  }

  gaps.push('All shoulder ratings require orthopedic examination with ROM measurements');
  gaps.push('Document which shoulder (left/right) or bilateral');
  gaps.push('Track impact on daily activities: reaching overhead, dressing, lifting');
  gaps.push('X-rays showing degenerative changes strengthen claim');

  return {
    condition: 'Shoulder Conditions',
    diagnosticCode: '5201-5203',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: SHOULDER_CRITERIA,
    disclaimer: SHOULDER_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Hip logs for VA rating
 * DC 5252-5255 - Hip Conditions
 */
export const analyzeHipLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const hipSymptoms = logs.filter(log =>
      CONDITIONS.HIP.symptomIds.includes(log.symptomId) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (hipSymptoms.length === 0) {
    return {
      condition: 'Hip Conditions',
      diagnosticCode: '5252-5255',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No hip symptoms logged',
        'Log hip pain episodes',
        'Document limited range of motion',
        'Track stiffness and weakness',
        'Note impact on walking, stairs, sitting',
      ],
      criteria: HIP_CRITERIA,
      disclaimer: HIP_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = null;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = hipSymptoms.filter(s => s.symptomId === 'hip-pain').length;
  const limitedROMCount = hipSymptoms.filter(s => s.symptomId === 'hip-limited-rom').length;
  const stiffnessCount = hipSymptoms.filter(s => s.symptomId === 'hip-stiffness').length;
  const weaknessCount = hipSymptoms.filter(s => s.symptomId === 'hip-weakness').length;
  const limpingCount = hipSymptoms.filter(s => s.symptomId === 'hip-limping').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = hipSymptoms.length / weeksInPeriod;

  evidence.push(`${hipSymptoms.length} hip episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited range of motion episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (limpingCount > 0) evidence.push(`${limpingCount} limping/gait disturbance episodes`);

  // Determine rating based on frequency and severity
  // Higher ratings require ROM measurements and functional assessment
  // 60-50%: Ankylosis (surgical fusion)
  // 40%: Marked limitation + severe pain
  // 30%: Moderate limitation
  // 20%: Slight-moderate limitation
  // 10%: Slight limitation

  if (limitedROMCount >= 10 && painCount >= 12 && (limpingCount >= 5 || weaknessCount >= 5)) {
    supportedRating = '30-40';
    ratingRationale.push(
        `${limitedROMCount} limited ROM episodes`,
        `${painCount} pain episodes (frequent)`,
        limpingCount > 0 ? `${limpingCount} gait disturbances` : `${weaknessCount} weakness episodes`,
        'Suggests moderate to marked functional limitation'
    );
    gaps.push('Orthopedic exam with ROM measurements required for 30-40% rating');
    gaps.push('Document severity: marked limitation = 40%, moderate = 30%');
  }
  else if (limitedROMCount >= 5 || (painCount >= 8 && episodesPerWeek >= 2)) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${hipSymptoms.length} hip episodes`,
        painCount > 0 ? `${painCount} pain episodes` : 'Regular symptoms documented',
        'Supports 20-30% rating range'
    );
    gaps.push('ROM measurements strengthen claim');
  }
  else if (hipSymptoms.length >= 6) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${hipSymptoms.length} episodes documented`,
        'Regular hip symptoms',
        'Supports 10-20% rating range'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'Hip symptoms documented',
        'Supports 10% rating for slight impairment'
    );
  }

  // Documentation gaps
  if (hipSymptoms.length < 8) {
    gaps.push(`Only ${hipSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Pain is primary symptom - log hip pain episodes');
  }

  if (limitedROMCount === 0) {
    gaps.push('Document limited range of motion episodes');
  }

  if (limpingCount === 0) {
    gaps.push('Document gait changes or limping if present');
  }

  gaps.push('All hip ratings require orthopedic examination with ROM measurements');
  gaps.push('Document which hip (left/right) or bilateral');
  gaps.push('Track functional impact: walking distance, stairs, sitting, getting in/out of car');
  gaps.push('X-rays showing arthritis or other pathology strengthen claim');

  return {
    condition: 'Hip Conditions',
    diagnosticCode: '5252-5255',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: HIP_CRITERIA,
    disclaimer: HIP_CRITERIA.disclaimer,
  };
};


// ============================================
// ANALYSIS FUNCTIONS - ASTHMA
// ============================================

/**
 * Analyzes asthma logs and measurements to determine supported rating level
 */
export const analyzeAsthmaLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
    profileId = null,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter asthma symptom logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && CONDITIONS.ASTHMA.symptomIds.includes(log.symptomId);
  });

  // Get FEV-1 measurements from the past year for spirometry analysis
  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);

  let fev1Measurements = [];
  let fvcMeasurements = [];

  try {
    fev1Measurements = getMeasurements('fev1', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
    fvcMeasurements = getMeasurements('fvc', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
  } catch (error) {
    // Measurements may not be available
  }

  if (relevantLogs.length === 0 && fev1Measurements.length === 0) {
    return {
      hasData: false,
      message: 'No asthma logs or FEV-1 measurements found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging asthma symptoms and attacks', 'Get spirometry testing (FEV-1) to establish rating'],
    };
  }

  // Calculate FEV-1 metrics
  let latestFev1Percent = null;
  let latestFev1FvcRatio = null;

  if (fev1Measurements.length > 0) {
    // Use most recent FEV-1 measurement
    const latestFev1 = fev1Measurements.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    if (latestFev1.values.fev1 && latestFev1.values.fev1Predicted) {
      latestFev1Percent = (latestFev1.values.fev1 / latestFev1.values.fev1Predicted) * 100;
    }

    // Calculate FEV-1/FVC ratio if we have matching FVC
    if (fvcMeasurements.length > 0) {
      // Find FVC measurement closest to FEV-1 measurement (within 24 hours)
      const matchingFvc = fvcMeasurements.find(fvc => {
        const timeDiff = Math.abs(new Date(fvc.timestamp) - new Date(latestFev1.timestamp));
        return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (matchingFvc && latestFev1.values.fev1) {
        latestFev1FvcRatio = (latestFev1.values.fev1 / matchingFvc.values.fvc) * 100;
      }
    }
  }

  // Analyze symptom patterns
  const monthsInPeriod = evaluationPeriodDays / 30;

  const attackLogs = relevantLogs.filter(log => log.symptomId === 'asthma-attack');
  const erVisits = relevantLogs.filter(log => log.symptomId === 'asthma-er-visit');
  const mdVisits = relevantLogs.filter(log => log.symptomId === 'asthma-md-visit');
  const rescueInhalerUse = relevantLogs.filter(log => log.symptomId === 'asthma-rescue-inhaler');

  const attacksPerMonth = attackLogs.length / monthsInPeriod;
  const attacksPerWeek = attackLogs.length / (evaluationPeriodDays / 7);
  const mdVisitsPerMonth = mdVisits.length / monthsInPeriod;

  // Build evidence array
  const evidence = [];

  if (fev1Measurements.length > 0 && latestFev1Percent !== null) {
    evidence.push(`Most recent FEV-1: ${latestFev1Percent.toFixed(0)}% of predicted`);
  }

  if (latestFev1FvcRatio !== null) {
    evidence.push(`FEV-1/FVC ratio: ${latestFev1FvcRatio.toFixed(0)}%`);
  }

  if (attackLogs.length > 0) {
    evidence.push(`${attackLogs.length} asthma attacks logged (${attacksPerMonth.toFixed(1)}/month)`);
  }

  if (erVisits.length > 0) {
    evidence.push(`${erVisits.length} ER visits for asthma`);
  }

  if (mdVisits.length > 0) {
    evidence.push(`${mdVisits.length} physician visits for exacerbations (${mdVisitsPerMonth.toFixed(1)}/month)`);
  }

  if (rescueInhalerUse.length > 0) {
    evidence.push(`${rescueInhalerUse.length} rescue inhaler uses documented`);
  }

  // Determine supported rating
  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // 100% Rating
  if (latestFev1Percent !== null && latestFev1Percent < 40) {
    supportedRating = 100;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (<40% required for 100%)`,
      'Spirometry evidence supports 100% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio < 40) {
    supportedRating = 100;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (<40% required for 100%)`,
      'Spirometry evidence supports 100% rating',
    ];
  } else if (attacksPerWeek > 1) {
    supportedRating = 100;
    ratingRationale = [
      `${attacksPerWeek.toFixed(1)} attacks per week (>1/week required for 100%)`,
      'Attack frequency supports 100% rating if episodes include respiratory failure',
    ];
    gaps.push('Document respiratory failure episodes during attacks (requires medical records)');
  }

  // 60% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 40 && latestFev1Percent <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (40-55% range)`,
      'Spirometry evidence supports 60% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 40 && latestFev1FvcRatio <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (40-55% range)`,
      'Spirometry evidence supports 60% rating',
    ];
  } else if (mdVisitsPerMonth >= 1) {
    supportedRating = 60;
    ratingRationale = [
      `${mdVisitsPerMonth.toFixed(1)} physician visits per month for exacerbations (≥1/month required)`,
      'Pattern of monthly medical visits supports 60% rating',
    ];
  }

  // 30% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 56 && latestFev1Percent <= 70) {
    supportedRating = 30;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (56-70% range)`,
      'Spirometry evidence supports 30% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 56 && latestFev1FvcRatio <= 70) {
    supportedRating = 30;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (56-70% range)`,
      'Spirometry evidence supports 30% rating',
    ];
  } else if (rescueInhalerUse.length > 0 && relevantLogs.length > 0) {
    supportedRating = 30;
    ratingRationale = [
      'Evidence of regular bronchodilator use',
      'Daily or frequent inhaled medication supports 30% rating',
    ];
    gaps.push('Get spirometry (FEV-1) testing to confirm rating level');
  }

  // 10% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 71 && latestFev1Percent <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (71-80% range)`,
      'Spirometry evidence supports 10% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 71 && latestFev1FvcRatio <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (71-80% range)`,
      'Spirometry evidence supports 10% rating',
    ];
  } else if (attackLogs.length > 0 || rescueInhalerUse.length > 0) {
    supportedRating = 10;
    ratingRationale = [
      'Evidence of intermittent asthma symptoms and inhaler use',
      'Pattern suggests 10% rating',
    ];
    gaps.push('Get spirometry (FEV-1) testing to confirm or increase rating');
  }

  // 0% or Insufficient Data
  else {
    if (latestFev1Percent !== null && latestFev1Percent > 80) {
      supportedRating = 0;
      ratingRationale = [
        `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (>80% is normal)`,
        'Spirometry shows minimal impairment',
      ];
    } else {
      supportedRating = 0;
      ratingRationale = [
        'Insufficient evidence for compensable rating',
      ];
      gaps.push('Get spirometry (FEV-1) testing - this is the primary evidence for asthma ratings');
      gaps.push('Document all asthma attacks and exacerbations');
      gaps.push('Track medication use (rescue inhalers, daily controllers, oral steroids)');
    }
  }

  // Add general gaps if rating could be higher
  if (supportedRating < 100) {
    if (fev1Measurements.length === 0) {
      gaps.push('Get spirometry testing (FEV-1/FVC) - this is the gold standard for VA asthma ratings');
    } else if (fev1Measurements.length < 2) {
      gaps.push('Consider repeat spirometry testing to establish consistent pattern');
    }

    if (mdVisits.length === 0) {
      gaps.push('Document physician visits for asthma exacerbations');
    }
  }

  return {
    hasData: true,
    condition: 'Bronchial Asthma',
    diagnosticCode: '6602',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: ASTHMA_CRITERIA,
    disclaimer: 'This analysis is for documentation guidance only. The VA makes all final rating determinations based on the complete evidence of record, including spirometry testing.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - HEARING LOSS
// ============================================

/**
 * Analyzes hearing loss logs
 * Note: Hearing loss requires audiometry data for accurate rating
 */
export const analyzeHearingLossLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.symptomId === 'hearing-loss-noticed';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No hearing loss logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging hearing difficulties', 'Get audiometry testing'],
    };
  }

  // Count bilateral vs unilateral
  const bilateralCount = relevantLogs.filter(log =>
      log.hearingData?.affectedEars === 'both'
  ).length;

  const unilateralCount = relevantLogs.length - bilateralCount;

  const supportedRating = 'Requires Clinical Testing';
  const ratingRationale = [
    'Hearing loss requires pure-tone audiometry for accurate rating',
    `${bilateralCount} logs indicate bilateral hearing difficulties`,
    unilateralCount > 0 ? `${unilateralCount} logs indicate unilateral hearing loss` : null,
  ].filter(Boolean);

  const gaps = [
    'CRITICAL: Get pure-tone audiometry test from audiologist',
    'Test must measure thresholds at 500, 1000, 2000, 3000, 4000 Hz',
    'Request Maryland CNC word recognition test if available',
    'Document situations where hearing loss impacts daily function',
  ];

  return {
    hasData: true,
    condition: 'Hearing Loss',
    diagnosticCode: '6100',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      totalLogs: relevantLogs.length,
      bilateralIncidents: bilateralCount,
      unilateralIncidents: unilateralCount,
    },
    gaps,
    criteria: HEARING_LOSS_CRITERIA,
    disclaimer: 'Hearing loss ratings require audiometry testing. This analysis is based on symptom logs only.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - SCARS
// ============================================

export const analyzeScarsLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate &&
        ['scar-pain', 'scar-limitation', 'scar-disfigurement'].includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No scar logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Log scar symptoms with location and size'],
    };
  }

  // Extract scar locations
  const scarLocations = [...new Set(
      relevantLogs
      .map(log => log.scarData?.scarLocation)
      .filter(Boolean)
  )];

  const supportedRating = 'Requires Clinical Measurement';
  const ratingRationale = [
    'Scar ratings require measured area in square centimeters',
    `Documented scars at: ${scarLocations.join(', ')}`,
    'Facial/neck scars may warrant higher ratings',
  ];

  const gaps = [
    'CRITICAL: Have provider measure scar area in square centimeters',
    'Document if scars are on exposed areas (head, face, neck, hands)',
    'Note characteristics: raised, keloid, unstable, painful',
    'Photograph scars for documentation',
  ];

  return {
    hasData: true,
    condition: 'Scars (Disfiguring)',
    diagnosticCode: '7800-7805',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      scarLocations,
      totalLogs: relevantLogs.length,
    },
    gaps,
    criteria: SCARS_CRITERIA,
    disclaimer: 'Scar ratings require clinical measurement of area and assessment of characteristics.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - PSORIASIS
// ============================================

export const analyzePsoriasisLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.symptomId === 'psoriasis-flare';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No psoriasis logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Log psoriasis flare-ups with body coverage percentage'],
    };
  }

  // Get most recent body coverage estimate
  const recentLog = relevantLogs[relevantLogs.length - 1];
  const bodyCoverage = recentLog.psoriasisData?.bodyPercentage;

  let supportedRating = '0%';
  let ratingRationale = [];

  if (bodyCoverage) {
    if (bodyCoverage === '40+') {
      supportedRating = '60%';
      ratingRationale = ['40% or more of body covered (60% criteria)'];
    } else if (bodyCoverage === '20-40') {
      supportedRating = '30%';
      ratingRationale = ['20-40% of body covered (30% criteria)'];
    } else if (['10-20', '5-10'].includes(bodyCoverage)) {
      supportedRating = '10%';
      ratingRationale = ['5-20% of body covered (10% criteria)'];
    } else {
      ratingRationale = ['Less than 5% body coverage'];
    }
  } else {
    supportedRating = 'Insufficient Data';
    ratingRationale = ['Body coverage percentage not documented'];
  }

  const gaps = [
    'Document percentage of body covered during flares',
    'Use "rule of nines" or palm method (palm = 1% body surface)',
    'Note if exposed areas (head, face, neck, hands) are affected',
    'Track frequency and duration of flare-ups',
    'Document treatments used (topical, systemic, phototherapy)',
  ];

  return {
    hasData: true,
    condition: 'Psoriasis',
    diagnosticCode: '7816',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      totalFlares: relevantLogs.length,
      recentCoverage: bodyCoverage || 'Not documented',
    },
    gaps,
    criteria: PSORIASIS_CRITERIA,
    disclaimer: 'This analysis is for documentation guidance only.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - ECZEMA
// ============================================

export const analyzeEczemaLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.symptomId === 'eczema-flare';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No eczema logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Log eczema flare-ups with affected body percentage'],
    };
  }

  // Get most recent body coverage
  const recentLog = relevantLogs[relevantLogs.length - 1];
  const bodyCoverage = recentLog.eczemaData?.bodyPercentage;

  let supportedRating = '0%';
  let ratingRationale = [];

  if (bodyCoverage) {
    if (bodyCoverage === '40+') {
      supportedRating = '60%';
      ratingRationale = ['40% or more of body affected (60% criteria)'];
    } else if (bodyCoverage === '20-40') {
      supportedRating = '30%';
      ratingRationale = ['20-40% of body affected (30% criteria)'];
    } else if (['10-20', '5-10'].includes(bodyCoverage)) {
      supportedRating = '10%';
      ratingRationale = ['5-20% of body affected (10% criteria)'];
    } else {
      ratingRationale = ['Less than 5% body coverage'];
    }
  } else {
    supportedRating = 'Insufficient Data';
    ratingRationale = ['Body coverage percentage not documented'];
  }

  const gaps = [
    'Document percentage of body affected during flares',
    'Track frequency and duration of flare-ups',
    'Note if exposed areas are affected',
    'Document intense itching and impact on sleep/function',
    'Record treatments used and their effectiveness',
  ];

  return {
    hasData: true,
    condition: 'Eczema/Dermatitis',
    diagnosticCode: '7806',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      totalFlares: relevantLogs.length,
      recentCoverage: bodyCoverage || 'Not documented',
    },
    gaps,
    criteria: ECZEMA_CRITERIA,
    disclaimer: 'This analysis is for documentation guidance only.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - TBI RESIDUALS
// ============================================

export const analyzeTBIResidualsLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate &&
        ['tbi-cognitive', 'tbi-emotional'].includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No TBI residual symptoms logged',
      supportedRating: null,
      evidence: [],
      gaps: ['Log cognitive and emotional symptoms from TBI'],
    };
  }

  const cognitiveCount = relevantLogs.filter(log =>
      log.symptomId === 'tbi-cognitive'
  ).length;

  const emotionalCount = relevantLogs.filter(log =>
      log.symptomId === 'tbi-emotional'
  ).length;

  // Frequency analysis
  const monthsInPeriod = evaluationPeriodDays / 30;
  const symptomsPerMonth = relevantLogs.length / monthsInPeriod;

  let supportedRating = '10%';
  let ratingRationale = [];

  if (symptomsPerMonth >= 10) {
    supportedRating = '50%';
    ratingRationale = [
      `${symptomsPerMonth.toFixed(1)} residual symptoms per month`,
      'Frequent cognitive and/or emotional difficulties',
      'Pattern suggests occupational and social impairment',
    ];
  } else if (symptomsPerMonth >= 5) {
    supportedRating = '30%';
    ratingRationale = [
      `${symptomsPerMonth.toFixed(1)} residual symptoms per month`,
      'Regular cognitive and/or emotional difficulties',
    ];
  } else {
    ratingRationale = [
      `${symptomsPerMonth.toFixed(1)} residual symptoms per month`,
      'Mild but documented TBI residuals',
    ];
  }

  const gaps = [
    'Consider neuropsychological testing for objective cognitive assessment',
    'Document specific functional impacts (work, relationships, daily tasks)',
    'Track medication use for residual symptoms',
    'Note if symptoms are separate from diagnosed mental health conditions',
  ];

  return {
    hasData: true,
    condition: 'Residuals of TBI',
    diagnosticCode: '8045-1',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      cognitiveSymptoms: cognitiveCount,
      emotionalSymptoms: emotionalCount,
      totalLogs: relevantLogs.length,
      monthlyRate: symptomsPerMonth.toFixed(1),
    },
    gaps,
    criteria: TBI_RESIDUALS_CRITERIA,
    disclaimer: 'TBI residuals often rated same as main TBI rating. Neuropsych testing may support higher ratings.',
  };
};

// ============================================
// ANALYSIS FUNCTIONS - GERD COMPLICATIONS
// ============================================

export const analyzeGERDComplicationsLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.symptomId === 'gerd-complication';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No GERD complication logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Log GERD complications if diagnosed'],
    };
  }

  // Check for serious complications
  const hasBarretts = relevantLogs.some(log =>
      log.gerdComplicationData?.complicationType === 'barretts'
  );

  const hasStricture = relevantLogs.some(log =>
      log.gerdComplicationData?.complicationType === 'stricture'
  );

  let supportedRating = '10%';
  let ratingRationale = ['Documented GERD complications requiring ongoing treatment'];

  if (hasBarretts) {
    supportedRating = '60%';
    ratingRationale = [
      'Barrett\'s esophagus is serious pre-cancerous complication',
      'Requires regular monitoring and treatment',
    ];
  } else if (hasStricture) {
    supportedRating = '30%';
    ratingRationale = [
      'Esophageal stricture documented',
      'May require periodic dilation procedures',
    ];
  } else {
    supportedRating = '30%';
    ratingRationale = [
      'Documented GERD complications (hiatal hernia, esophagitis)',
      'Persistently recurrent symptoms despite treatment',
    ];
  }

  const gaps = [
    'CRITICAL: Obtain endoscopy reports documenting complications',
    'Document frequency of dilation procedures if applicable',
    'Track daily medication requirements',
    'Note any weight loss or nutritional issues',
    'Request biopsy results if Barrett\'s esophagus suspected',
  ];

  return {
    hasData: true,
    condition: 'GERD with Complications',
    diagnosticCode: '7346',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      totalLogs: relevantLogs.length,
      hasBarretts,
      hasStricture,
    },
    gaps,
    criteria: GERD_COMPLICATIONS_CRITERIA,
    disclaimer: 'GERD complication ratings require endoscopy documentation and medical records.',
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
export const getAsthmaDefinition = (term) => ASTHMA_CRITERIA.definitions[term] || null;
export const getAllAsthmaRatings = () => ASTHMA_CRITERIA.ratings;