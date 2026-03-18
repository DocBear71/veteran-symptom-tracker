/* eslint-disable no-unused-vars */

// ============================================
// CARDIORESPIRATORY RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: Sleep Apnea, Hypertension, Asthma, COPD,
// Chronic Bronchitis, Emphysema, Bronchiectasis,
// Pulmonary Fibrosis, Sarcoidosis, Cardiomyopathy,
// Arrhythmias, CAD, Post-MI, Hypertensive Heart Disease,
// PAD, Cold Injury, Raynaud's, Varicose Veins,
// Rhinitis, Sinusitis, Laryngeal/Pharyngeal conditions,
// Chronic Urticaria, Syphilitic Heart Disease.
//
// Based on 38 CFR Part 4, §§ 4.97, 4.100, 4.104
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

import {
  analyzeBloodPressurePredominance,
  getAverageBloodPressure,
  getMeasurements,
} from '../measurements';

// ============================================
// SHARED HELPERS
// ============================================

const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

// ============================================
// CARDIORESPIRATORY CONDITIONS (for CONDITIONS object)
// ============================================
export const CARDIORESPIRATORY_CONDITIONS = {
  SLEEP_APNEA: {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    diagnosticCode: '6847',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['sleep-issues', 'sleep-apnea'],
  },
  HYPERTENSION: {
    id: 'hypertension',
    name: 'Hypertension',
    diagnosticCode: '7101',
    cfrReference: '38 CFR 4.104',
    symptomIds: [ 'high-blood-pressure', 'hypertension-headache', 'chest-pressure', 'palpitations'],
  },
  RHINITIS: {
    id: 'rhinitis',
    name: 'Rhinitis (Allergic or Vasomotor)',
    diagnosticCode: '6522',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['rhinitis-congestion', 'rhinitis-drainage', 'rhinitis-sneezing', 'rhinitis-breathing'],
  },
  SINUSITIS: {
    id: 'sinusitis',
    name: 'Chronic Sinusitis',
    diagnosticCode: '6510',
    cfrReference: '38 CFR 4.97',
    symptomIds: ['sinusitis-facial-pain', 'sinusitis-pressure', 'sinusitis-congestion', 'sinusitis-headache', 'sinusitis-drainage'],
  },
  ASTHMA: {
    id: 'asthma',
    name: 'Bronchial Asthma',
    diagnosticCode: '6602',
    cfrReference: '38 CFR 4.97',
    symptomIds: [ 'asthma-attack', 'asthma-wheezing', 'asthma-shortness-breath', 'asthma-cough', 'asthma-chest-tightness', 'asthma-rescue-inhaler', 'asthma-er-visit', 'asthma-md-visit',
    ],
  },
  COPD: {
    id: 'copd',
    name: 'Chronic Obstructive Pulmonary Disease',
    diagnosticCode: '6604',
    cfrReference: '38 CFR 4.97',
    symptomIds: [ 'copd-shortness-breath', 'copd-chronic-cough', 'copd-sputum', 'copd-wheezing', 'copd-exacerbation', 'copd-oxygen-use', 'copd-er-visit', 'copd-hospitalization',
    ],
  },
  CHRONIC_BRONCHITIS: {
    id: 'chronic-bronchitis',
    name: 'Chronic Bronchitis',
    diagnosticCode: '6600',
    cfrReference: '38 CFR 4.97',
    symptomIds: [ 'bronchitis-productive-cough', 'bronchitis-sputum', 'bronchitis-shortness-breath', 'bronchitis-chest-discomfort', 'bronchitis-exacerbation', 'bronchitis-oxygen-use',
    ],
  },
  EMPHYSEMA: {
    id: 'emphysema',
    name: 'Pulmonary Emphysema',
    diagnosticCode: '6603',
    cfrReference: '38 CFR 4.97',
    symptomIds: [ 'emphysema-shortness-breath', 'emphysema-barrel-chest', 'emphysema-wheezing', 'emphysema-fatigue', 'emphysema-oxygen-use', 'emphysema-exacerbation',
    ],
  },
  BRONCHIECTASIS: {
    id: 'bronchiectasis',
    name: 'Bronchiectasis',
    diagnosticCode: '6601',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'bronchiectasis-cough', 'bronchiectasis-sputum', 'bronchiectasis-purulent-sputum',
      'bronchiectasis-hemoptysis', 'bronchiectasis-infection', 'bronchiectasis-incapacitating',
      'bronchiectasis-antibiotic', 'bronchiectasis-shortness-breath', 'bronchiectasis-fatigue',
      'bronchiectasis-weight-loss', 'bronchiectasis-anorexia',
    ],
  },
  PULMONARY_FIBROSIS: {
    id: 'pulmonary-fibrosis',
    name: 'Pulmonary Fibrosis (Interstitial Lung Disease)',
    diagnosticCode: '6825',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'pf-shortness-breath', 'pf-dry-cough', 'pf-fatigue', 'pf-exercise-intolerance',
      'pf-oxygen-use', 'pf-clubbing', 'pf-weight-loss', 'pf-chest-discomfort',
      'pf-exacerbation', 'pf-hospitalization',
    ],
  },
  SARCOIDOSIS: {
    id: 'sarcoidosis',
    name: 'Sarcoidosis',
    diagnosticCode: '6846',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'sarcoid-shortness-breath', 'sarcoid-cough', 'sarcoid-chest-pain', 'sarcoid-fatigue',
      'sarcoid-fever', 'sarcoid-night-sweats', 'sarcoid-weight-loss', 'sarcoid-skin-lesions',
      'sarcoid-eye-symptoms', 'sarcoid-joint-pain', 'sarcoid-lymph-nodes', 'sarcoid-cardiac',
      'sarcoid-corticosteroid',
    ],
  },
  RAYNAUDS: {
    id: 'raynauds',
    name: "Raynaud's Syndrome",
    diagnosticCode: '7117',
    cfrReference: '38 CFR 4.104',
    symptomIds: [ 'raynauds-attack', 'raynauds-numbness', 'raynauds-pain', 'raynauds-ulcer', 'raynauds-cold-trigger',
    ],
  },
  VARICOSE_VEINS: {
    id: 'varicose-veins',
    name: 'Varicose Veins',
    diagnosticCode: '7120/7121',
    cfrReference: '38 CFR 4.104',
    symptomIds: [ 'varicose-aching', 'varicose-edema', 'varicose-pigmentation', 'varicose-ulcer', 'varicose-pain',
    ],
  },
  CHRONIC_URTICARIA: {
    id: 'chronic-urticaria',
    name: 'Chronic Urticaria',
    diagnosticCode: '7825',
    cfrReference: '38 CFR 4.118',
    symptomIds: [ 'urticaria-outbreak', 'urticaria-itching', 'urticaria-swelling', 'urticaria-medication',
    ],
  },
  CARDIOMYOPATHY: {
    id: 'cardiomyopathy',
    name: 'Cardiomyopathy',
    diagnosticCode: '7020',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'cardiomyopathy-breathlessness', 'cardiomyopathy-fatigue', 'cardiomyopathy-edema',
      'cardiomyopathy-palpitations', 'cardiomyopathy-chest-pain', 'cardiomyopathy-dizziness',
      'cardiomyopathy-syncope', 'cardiomyopathy-activity-limitation',
      'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
      'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea',
    ],
  },
  SVT: {
    id: 'svt',
    name: 'Supraventricular Tachycardia',
    diagnosticCode: '7010',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'svt-episode', 'svt-treatment-iv', 'svt-treatment-cardioversion', 'svt-treatment-ablation',
      'svt-vagal-maneuver', 'svt-oral-medication',
      'arrhythmia-palpitations', 'arrhythmia-racing-heart', 'arrhythmia-skipped-beats',
      'arrhythmia-dizziness', 'arrhythmia-syncope', 'arrhythmia-chest-discomfort',
    ],
  },
  VENTRICULAR_ARRHYTHMIA: {
    id: 'ventricular-arrhythmia',
    name: 'Ventricular Arrhythmias',
    diagnosticCode: '7011',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'ventricular-arrhythmia-episode', 'ventricular-arrhythmia-hospitalization',
      'aicd-implant', 'aicd-shock',
      'arrhythmia-palpitations', 'arrhythmia-racing-heart', 'arrhythmia-syncope',
    ],
  },
  PERICARDITIS: {
    id: 'pericarditis',
    name: 'Pericarditis',
    diagnosticCode: '7002',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'pericarditis-chest-pain', 'pericarditis-pain-breathing', 'pericarditis-pain-lying-down',
      'pericarditis-fever', 'pericarditis-palpitations', 'pericarditis-shortness-breath',
      'pericarditis-active-infection', 'pericarditis-effusion',
    ],
  },
  POST_PHLEBITIC: {
    id: 'post-phlebitic',
    name: 'Post-Phlebitic Syndrome',
    diagnosticCode: '7121',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'post-phlebitic-edema', 'post-phlebitic-pain', 'post-phlebitic-aching',
      'post-phlebitic-pigmentation', 'post-phlebitic-eczema', 'post-phlebitic-ulcer',
      'post-phlebitic-induration', 'post-phlebitic-pain-rest',
    ],
  },
  CAD: {
    id: 'cad',
    name: 'Coronary Artery Disease',
    diagnosticCode: '7005',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'cad-angina-stable', 'cad-angina-unstable', 'cad-dyspnea-exertion', 'cad-dyspnea-rest',
      'cad-fatigue', 'cad-dizziness', 'cad-syncope', 'cad-palpitations', 'cad-diaphoresis',
      'cad-nausea', 'cad-activity-limitation', 'cad-nitroglycerin-use', 'cad-hospitalization',
      'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
      'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea',
    ],
  },
  POST_MI: {
    id: 'post-mi',
    name: 'Myocardial Infarction (Post-MI)',
    diagnosticCode: '7006',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'post-mi-chest-pain', 'post-mi-dyspnea-exertion', 'post-mi-dyspnea-rest', 'post-mi-fatigue',
      'post-mi-weakness', 'post-mi-dizziness', 'post-mi-syncope', 'post-mi-palpitations',
      'post-mi-edema', 'post-mi-activity-limitation', 'post-mi-anxiety', 'post-mi-hospitalization',
      'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
      'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea',
    ],
  },
  HYPERTENSIVE_HEART: {
    id: 'hypertensive-heart',
    name: 'Hypertensive Heart Disease',
    diagnosticCode: '7007',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'hhd-dyspnea-exertion', 'hhd-dyspnea-rest', 'hhd-orthopnea', 'hhd-pnd', 'hhd-fatigue',
      'hhd-edema', 'hhd-weight-gain', 'hhd-chest-discomfort', 'hhd-palpitations', 'hhd-dizziness',
      'hhd-syncope', 'hhd-activity-limitation', 'hhd-hospitalization',
      'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
      'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea',
    ],
  },
  COLD_INJURY: {
    id: 'cold-injury',
    name: 'Cold Injury Residuals (Frostbite)',
    diagnosticCode: '7122',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'cold-injury-pain', 'cold-injury-numbness', 'cold-injury-cold-sensitivity',
      'cold-injury-tingling', 'cold-injury-color-changes', 'cold-injury-tissue-loss',
      'cold-injury-nail-abnormalities', 'cold-injury-impaired-sensation',
      'cold-injury-hyperhidrosis', 'cold-injury-stiffness', 'cold-injury-swelling',
      'cold-injury-xray-abnormality',
    ],
  },
  PERIPHERAL_ARTERIAL_DISEASE: {
    id: 'peripheral-arterial-disease',
    name: 'Peripheral Arterial Disease (PAD)',
    diagnosticCode: '7114',
    cfrReference: '38 CFR 4.104',
    symptomIds: [
      'pad-claudication-mild', 'pad-claudication-moderate', 'pad-claudication-severe',
      'pad-rest-pain', 'pad-coldness', 'pad-numbness',
      'pad-trophic-thin-skin', 'pad-trophic-hair-loss', 'pad-trophic-nail-changes',
      'pad-diminished-pulses', 'pad-color-changes', 'pad-ulceration',
      'pad-slow-healing', 'pad-gangrene',
    ],
  },
  CHRONIC_LARYNGITIS: {
    id: 'chronic-laryngitis',
    name: 'Chronic Laryngitis',
    diagnosticCode: '6516',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'laryngitis-hoarseness', 'laryngitis-inflammation', 'laryngitis-nodules',
      'laryngitis-premalignant', 'laryngitis-voice-fatigue', 'laryngitis-pain-speaking',
      'laryngitis-throat-clearing', 'laryngitis-reflux-related',
    ],
    bodySystem: 'respiratory',
  },
  APHONIA: {
    id: 'aphonia',
    name: 'Aphonia (Voice Loss)',
    diagnosticCode: '6519',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'aphonia-complete', 'aphonia-whisper-only', 'aphonia-intermittent',
      'aphonia-communication-impaired', 'aphonia-aac-device', 'aphonia-vocal-cord-paralysis',
      'aphonia-post-laryngectomy', 'aphonia-speech-therapy',
    ],
    bodySystem: 'respiratory',
  },
  LARYNGEAL_STENOSIS: {
    id: 'laryngeal-stenosis',
    name: 'Laryngeal Stenosis',
    diagnosticCode: '6520',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'stenosis-breathing-difficulty', 'stenosis-stridor', 'stenosis-tracheostomy',
      'stenosis-dilation-required', 'stenosis-exercise-intolerance', 'stenosis-post-intubation',
      'stenosis-pft-abnormal', 'stenosis-voice-changes',
    ],
    bodySystem: 'respiratory',
  },
  PHARYNX_INJURY: {
    id: 'pharynx-injury',
    name: 'Pharynx Injuries',
    diagnosticCode: '6521',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'pharynx-stricture', 'pharynx-obstruction', 'pharynx-soft-palate-absent',
      'pharynx-soft-palate-paralysis', 'pharynx-nasal-regurgitation', 'pharynx-dysphagia',
      'pharynx-speech-impairment', 'pharynx-aspiration-risk',
    ],
    bodySystem: 'respiratory',
  },
  DEVIATED_SEPTUM: {
    id: 'deviated-septum',
    name: 'Deviated Nasal Septum',
    diagnosticCode: '6502',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'septum-obstruction-bilateral', 'septum-obstruction-complete', 'septum-breathing-difficulty',
      'septum-congestion', 'septum-snoring', 'septum-nosebleeds', 'septum-facial-pain',
      'septum-headaches', 'septum-post-nasal-drip', 'septum-dry-mouth',
      'septum-sleep-disturbance', 'septum-post-surgical',
    ],
    bodySystem: 'respiratory',
  },
  NOSE_LOSS: {
    id: 'nose-loss',
    name: 'Nose Loss or Disfigurement',
    diagnosticCode: '6504',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'nose-loss-total', 'nose-loss-partial-bilateral', 'nose-loss-partial-unilateral',
      'nose-loss-breathing-difficulty', 'nose-loss-prosthesis', 'nose-loss-functional-loss',
    ],
    bodySystem: 'respiratory',
  },
  SYPHILITIC_HEART_DISEASE: {
    id: 'syphilitic-heart-disease',
    name: 'Syphilitic Heart Disease',
    diagnosticCode: '7004',
    cfrReference: '38 CFR 4.104',
    symptomIds: ['syphilitic-heart-chest-pain', 'syphilitic-heart-dyspnea', 'syphilitic-heart-fatigue', 'syphilitic-heart-palpitations', 'syphilitic-heart-chf', 'syphilitic-heart-dizziness'],
  },
};

// ============================================
// CARDIORESPIRATORY RATING CRITERIA & ANALYZE FUNCTIONS
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

  secondaryConditions: {
    description: 'Sleep apnea can cause or aggravate numerous secondary conditions due to chronic oxygen deprivation and sleep disruption.',

    categories: {
      cardiovascular: {
        name: 'Cardiovascular Secondaries',
        conditions: [
          {
            manifestation: 'Hypertension',
            suggestedDCs: ['7101'],
            dcDescriptions: ['Hypertensive vascular disease'],
            nexusStrength: 'strong',
            notes: 'Sleep apnea is a well-established cause of hypertension. Very strong medical connection.',
            documentationTips: ['Blood pressure logs', 'Note improvement with CPAP use', 'Cardiology records'],
          },
          {
            manifestation: 'Coronary Artery Disease',
            suggestedDCs: ['7005'],
            dcDescriptions: ['Arteriosclerotic heart disease'],
            nexusStrength: 'strong',
            notes: 'Chronic hypoxia from sleep apnea accelerates atherosclerosis.',
            documentationTips: ['Cardiac workup', 'Document severity of apnea', 'Medical literature'],
          },
          {
            manifestation: 'Atrial Fibrillation',
            suggestedDCs: ['7010'],
            dcDescriptions: ['Supraventricular arrhythmias'],
            nexusStrength: 'strong',
            notes: 'Sleep apnea significantly increases AFib risk.',
            documentationTips: ['EKG/Holter monitor results', 'Cardiology records'],
          },
          {
            manifestation: 'Heart Failure',
            suggestedDCs: ['7007'],
            dcDescriptions: ['Hypertensive heart disease'],
            nexusStrength: 'moderate',
            notes: 'Chronic strain from apnea can contribute to heart failure.',
            documentationTips: ['Echocardiogram', 'Document LVEF', 'Cardiology evaluation'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health Secondaries',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Chronic fatigue and poor sleep quality commonly cause depression.',
            documentationTips: ['Mental health records', 'Document fatigue impact', 'PHQ-9 scores'],
          },
          {
            manifestation: 'Cognitive Impairment',
            suggestedDCs: ['8045', '9326'],
            dcDescriptions: ['TBI residuals', 'Dementia'],
            nexusStrength: 'moderate',
            notes: 'Chronic hypoxia can cause cognitive changes. Document memory/concentration issues.',
            documentationTips: ['Neuropsychological testing', 'Document cognitive symptoms', 'Brain imaging if performed'],
          },
        ],
      },

      metabolic: {
        name: 'Metabolic Conditions',
        conditions: [
          {
            manifestation: 'Type 2 Diabetes',
            suggestedDCs: ['7913'],
            dcDescriptions: ['Diabetes mellitus'],
            nexusStrength: 'moderate',
            notes: 'Sleep apnea affects insulin resistance and glucose metabolism.',
            documentationTips: ['HbA1c trend', 'Document onset relative to apnea diagnosis', 'Endocrinology records'],
          },
        ],
      },
    },

    canBeSecondaryTo: [
      {
        primaryDC: '9411',
        primaryCondition: 'PTSD',
        nexusStrength: 'moderate',
        notes: 'PTSD medications and weight gain can cause/worsen sleep apnea',
      },
      {
        primaryDC: '5237',
        primaryCondition: 'Cervical Strain',
        nexusStrength: 'moderate',
        notes: 'Neck conditions can affect airway',
      },
      {
        primaryDC: '7913',
        primaryCondition: 'Diabetes Mellitus',
        nexusStrength: 'moderate',
        notes: 'Obesity/metabolic syndrome link',
      },
    ],

    importantNotes: [
      'Sleep apnea is rated based on treatment requirements (CPAP use)',
      'Document compliance with CPAP therapy',
      'Secondary conditions can significantly increase overall rating',
      'Get sleep study results and compliance data',
    ],
  },
};

// ============================================
// LUMBOSACRAL STRAIN / LOW BACK PAIN (DC 5237)
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

  secondaryConditions: {
    description: 'Hypertension causes damage to blood vessels and organs over time, leading to numerous secondary conditions.',

    categories: {
      cardiovascular: {
        name: 'Cardiovascular Secondaries',
        conditions: [
          {
            manifestation: 'Hypertensive Heart Disease',
            suggestedDCs: ['7007'],
            dcDescriptions: ['Hypertensive heart disease'],
            nexusStrength: 'strong',
            notes: 'Direct consequence of uncontrolled hypertension. Document cardiac changes.',
            documentationTips: ['Echocardiogram showing LVH', 'Document EF if reduced', 'Cardiology records'],
          },
          {
            manifestation: 'Coronary Artery Disease',
            suggestedDCs: ['7005'],
            dcDescriptions: ['Arteriosclerotic heart disease'],
            nexusStrength: 'strong',
            notes: 'Hypertension accelerates atherosclerosis.',
            documentationTips: ['Stress test', 'Cardiac catheterization if done', 'Document chest pain symptoms'],
          },
          {
            manifestation: 'Stroke/CVA Residuals',
            suggestedDCs: ['8008'],
            dcDescriptions: ['Cerebral thrombosis'],
            nexusStrength: 'strong',
            notes: 'Hypertension is leading cause of stroke. Rate residuals separately.',
            documentationTips: ['Brain imaging', 'Document all residual deficits', 'Neurology records'],
          },
        ],
      },

      renal: {
        name: 'Kidney Secondaries',
        conditions: [
          {
            manifestation: 'Chronic Kidney Disease',
            suggestedDCs: ['7530'],
            dcDescriptions: ['Chronic renal disease'],
            nexusStrength: 'strong',
            notes: 'Hypertension is second leading cause of kidney disease.',
            documentationTips: ['Track GFR over time', 'Document proteinuria', 'Nephrology records'],
          },
        ],
      },

      eyes: {
        name: 'Eye Secondaries',
        conditions: [
          {
            manifestation: 'Hypertensive Retinopathy',
            suggestedDCs: ['6006'],
            dcDescriptions: ['Retinopathy'],
            nexusStrength: 'strong',
            notes: 'Fundoscopic exam shows retinal changes from hypertension.',
            documentationTips: ['Dilated eye exam', 'Document retinal changes', 'Ophthalmology records'],
          },
        ],
      },
    },

    canBeSecondaryTo: [
      {
        primaryDC: '6847',
        primaryCondition: 'Sleep Apnea',
        nexusStrength: 'strong',
        notes: 'Very well-established medical connection',
      },
      {
        primaryDC: '9411',
        primaryCondition: 'PTSD',
        nexusStrength: 'moderate',
        notes: 'Chronic stress contributes to hypertension',
      },
      {
        primaryDC: '7913',
        primaryCondition: 'Diabetes Mellitus',
        nexusStrength: 'strong',
        notes: 'Commonly co-occur; each can worsen the other',
      },
    ],

    importantNotes: [
      'Hypertension ratings are based on diastolic and systolic readings',
      'Track blood pressure consistently - home readings count',
      'Document medication requirements and side effects',
      'Secondary conditions from hypertension can significantly increase overall rating',
    ],
  },
};

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
// DEVIATED NASAL SEPTUM RATING CRITERIA (DC 6502)
// ============================================

export const DEVIATED_SEPTUM_CRITERIA = {
  diagnosticCode: '6502',
  condition: 'Deviated Nasal Septum',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6502',

  ratingNote: 'Ratings for deviated septum apply only to traumatic deviations. Congenital or developmental deviations without service-connected trauma are not ratable.',

  ratings: [
    {
      percent: 10,
      summary: '50% obstruction both sides OR complete obstruction one side',
      criteria: {
        traumatic: true,
        significantObstruction: true,
      },
      criteriaDescription: [
        'Traumatic deviation (service-connected)',
        '50% or greater obstruction of nasal passage on BOTH sides',
        'OR complete (100%) obstruction on ONE side',
      ],
      evidenceNeeded: [
        'Documentation of traumatic origin (injury, accident, surgery complication)',
        'ENT examination documenting degree of obstruction',
        'CT scan or nasal endoscopy showing deviation',
        'Symptom log: breathing difficulty, congestion, sleep disruption',
      ],
    },
    {
      percent: 0,
      summary: 'Traumatic deviation without significant obstruction',
      criteria: {
        traumatic: true,
        minimalObstruction: true,
      },
      criteriaDescription: [
        'Traumatic deviation present',
        'Less than 50% obstruction bilaterally',
        'No complete obstruction on either side',
      ],
      evidenceNeeded: [
        'Documentation of traumatic origin',
        'ENT exam showing minimal functional impact',
      ],
    },
  ],

  definitions: {
    traumaticDeviation: {
      term: 'Traumatic Deviation',
      definition: 'A deviated septum caused by injury, accident, or surgical complication during military service. Congenital or developmental deviations are not service-connectable unless aggravated by service.',
      examples: [
        'Nasal fracture from combat or training',
        'Sports injury during service',
        'Motor vehicle accident',
        'Surgical complication from service-connected procedure',
      ],
    },
    nasalObstruction: {
      term: 'Nasal Obstruction',
      definition: 'Blockage of the nasal airway measured as percentage of passage blocked. Typically assessed by ENT examination or nasal endoscopy.',
      examples: [
        '50% bilateral = half of each passage blocked',
        '100% unilateral = one side completely blocked',
        'Measured during physical examination',
      ],
    },
    septoplasty: {
      term: 'Septoplasty',
      definition: 'Surgical procedure to straighten the nasal septum. Post-surgical symptoms may still be ratable if obstruction persists.',
      examples: [
        'Surgical correction of deviated septum',
        'May require additional rating if symptoms persist after surgery',
      ],
    },
  },

  secondaryConditions: {
    description: 'Deviated septum can lead to or be associated with other conditions.',
    commonSecondaries: [
      { condition: 'Chronic Sinusitis', diagnosticCode: '6510-6514', relationship: 'Obstruction leads to poor sinus drainage and chronic infections' },
      { condition: 'Sleep Apnea', diagnosticCode: '6847', relationship: 'Nasal obstruction contributes to sleep-disordered breathing' },
      { condition: 'Chronic Rhinitis', diagnosticCode: '6522', relationship: 'Obstruction causes chronic nasal inflammation' },
      { condition: 'Loss of Smell', diagnosticCode: '6275', relationship: 'Obstruction blocks airflow to olfactory receptors' },
    ],
  },

  documentationTips: [
    'Document the traumatic event that caused the deviation',
    'Obtain ENT examination with documented obstruction percentage',
    'Request CT scan or nasal endoscopy for objective evidence',
    'Track breathing difficulties and which side is affected',
    'Log sleep disruption, snoring, and mouth breathing',
    'Document any associated headaches or facial pressure',
    'Note if septoplasty was performed and results',
    'Track frequency of sinus infections if applicable',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6504. Nose loss may also be rated under DC 7800 for disfigurement - evaluate under whichever provides higher rating. For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// CHRONIC LARYNGITIS RATING CRITERIA (DC 6516)
// ============================================

export const CHRONIC_LARYNGITIS_CRITERIA = {
  diagnosticCode: '6516',
  condition: 'Chronic Laryngitis',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6516',

  ratingNote: 'Incomplete aphonia (partial voice loss) is also rated under this code. Complete voice loss is rated under DC 6519.',

  ratings: [
    {
      percent: 30,
      summary: 'Hoarseness with structural changes to vocal cords',
      criteria: {
        structuralChanges: true,
      },
      criteriaDescription: [
        'Hoarseness present AND',
        'Thickening or nodules of cords, OR',
        'Polyps on vocal cords, OR',
        'Submucous infiltration, OR',
        'Pre-malignant changes on biopsy',
      ],
      evidenceNeeded: [
        'Laryngoscopy report documenting structural changes',
        'Biopsy results if pre-malignant changes suspected',
        'ENT evaluation describing vocal cord condition',
        'Symptom log documenting chronic hoarseness',
      ],
    },
    {
      percent: 10,
      summary: 'Hoarseness with inflammation only',
      criteria: {
        inflammationOnly: true,
      },
      criteriaDescription: [
        'Hoarseness present AND',
        'Inflammation of cords or mucous membrane',
        'No structural changes (nodules, polyps, etc.)',
      ],
      evidenceNeeded: [
        'Laryngoscopy showing vocal cord inflammation',
        'ENT evaluation documenting chronic laryngitis',
        'Symptom log of persistent hoarseness',
        'Treatment records (voice rest, therapy, medications)',
      ],
    },
  ],

  definitions: {
    hoarseness: {
      term: 'Hoarseness',
      definition: 'Abnormal voice quality - rough, breathy, strained, or weak voice caused by vocal cord dysfunction.',
    },
    vocalCordNodules: {
      term: 'Vocal Cord Nodules',
      definition: 'Callous-like growths on the vocal cords from vocal abuse or overuse. Also called singer\'s nodes.',
    },
    polyps: {
      term: 'Vocal Cord Polyps',
      definition: 'Soft, blister-like growths on the vocal cords, often from a single traumatic event.',
    },
    submucousInfiltration: {
      term: 'Submucous Infiltration',
      definition: 'Thickening of tissue beneath the mucous membrane of the vocal cords.',
    },
  },

  secondaryConditions: {
    description: 'Chronic laryngitis may be secondary to or associated with other conditions.',
    commonPrimaries: [
      { condition: 'GERD/LPR', diagnosticCode: '7346', relationship: 'Acid reflux damages vocal cords' },
      { condition: 'Chronic Sinusitis', diagnosticCode: '6510-6514', relationship: 'Post-nasal drip irritates larynx' },
      { condition: 'Sleep Apnea', diagnosticCode: '6847', relationship: 'CPAP use can cause laryngeal irritation' },
    ],
  },

  documentationTips: [
    'Obtain laryngoscopy report from ENT documenting vocal cord condition',
    'Track hoarseness episodes - frequency, duration, triggers',
    'Document impact on communication and work',
    'Note voice fatigue patterns throughout the day',
    'Record all treatments tried (voice therapy, medications)',
    'Get biopsy if structural changes suspected',
    'Document any underlying causes (GERD, allergies)',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6516. Rating requires documented laryngoscopy findings. Incomplete aphonia is also rated under this code. For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// APHONIA RATING CRITERIA (DC 6519)
// ============================================

export const APHONIA_CRITERIA = {
  diagnosticCode: '6519',
  condition: 'Complete Organic Aphonia',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6519',

  smcNote: 'Complete inability to communicate by speech (100% rating) requires review for Special Monthly Compensation (SMC) under § 3.350.',

  ratingNote: 'Incomplete aphonia (can still produce some voice) is rated as chronic laryngitis (DC 6516), not under this code.',

  ratings: [
    {
      percent: 100,
      summary: 'Constant inability to communicate by speech',
      criteria: {
        completeInability: true,
      },
      criteriaDescription: [
        'Complete loss of ability to communicate by speech',
        'Cannot produce any voice or whisper',
        'Constant - not intermittent',
        'Requires SMC review',
      ],
      evidenceNeeded: [
        'ENT/Speech pathology evaluation documenting complete voice loss',
        'Laryngoscopy documenting cause of aphonia',
        'Documentation of communication methods used (AAC devices, writing)',
        'Evidence condition is constant, not intermittent',
        'Application for Special Monthly Compensation',
      ],
    },
    {
      percent: 60,
      summary: 'Constant inability to speak above a whisper',
      criteria: {
        whisperOnly: true,
      },
      criteriaDescription: [
        'Cannot produce voice louder than a whisper',
        'Can whisper but cannot phonate normally',
        'Condition is constant, not intermittent',
      ],
      evidenceNeeded: [
        'ENT evaluation documenting whisper-only voice production',
        'Laryngoscopy showing cause of voice impairment',
        'Speech pathology assessment',
        'Symptom log showing constant nature of condition',
      ],
    },
  ],

  definitions: {
    aphonia: {
      term: 'Aphonia',
      definition: 'Complete loss of voice - inability to produce sound from the vocal cords.',
    },
    organicAphonia: {
      term: 'Organic Aphonia',
      definition: 'Voice loss due to physical damage or disease of the vocal apparatus, as opposed to functional (psychological) aphonia.',
    },
    aacDevice: {
      term: 'AAC Device',
      definition: 'Augmentative and Alternative Communication device - technology used to communicate when speech is impaired or absent.',
    },
    laryngectomy: {
      term: 'Laryngectomy',
      definition: 'Surgical removal of the larynx (voice box), resulting in permanent aphonia. Total laryngectomy is rated 100% under DC 6518.',
    },
  },

  secondaryConditions: {
    description: 'Aphonia significantly impacts quality of life and may lead to secondary conditions.',
    commonSecondaries: [
      { condition: 'Depression', diagnosticCode: '9434', relationship: 'Loss of voice causes significant psychological impact' },
      { condition: 'Anxiety', diagnosticCode: '9400', relationship: 'Communication difficulties cause anxiety' },
    ],
  },

  documentationTips: [
    'Obtain comprehensive ENT evaluation documenting cause',
    'Get speech pathology assessment of voice function',
    'Document laryngoscopy findings showing anatomical cause',
    'Track daily communication challenges',
    'Note employment impact - many jobs require voice',
    'Document all communication methods used',
    'If complete loss, apply for SMC review',
    'Note if AAC device is prescribed',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6519. Complete inability to communicate by speech requires SMC review. Incomplete aphonia should be rated as chronic laryngitis (DC 6516). For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// LARYNGEAL STENOSIS RATING CRITERIA (DC 6520)
// ============================================

export const LARYNGEAL_STENOSIS_CRITERIA = {
  diagnosticCode: '6520',
  condition: 'Stenosis of Larynx',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6520',

  ratingNote: 'Ratings require FEV-1 with Flow-Volume Loop compatible with upper airway obstruction. May alternatively be rated as aphonia (DC 6519) if more favorable.',

  ratings: [
    {
      percent: 100,
      summary: 'FEV-1 <40% with upper airway obstruction pattern, OR permanent tracheostomy',
      criteria: {
        severeStenosis: true,
        OR: true,
        tracheostomy: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% predicted AND',
        'Flow-Volume Loop compatible with upper airway obstruction',
        'OR permanent tracheostomy required',
      ],
      evidenceNeeded: [
        'Pulmonary function tests showing FEV-1 <40%',
        'Flow-Volume Loop interpretation showing upper airway obstruction pattern',
        'OR documentation of permanent tracheostomy',
        'Laryngoscopy documenting stenosis',
      ],
    },
    {
      percent: 60,
      summary: 'FEV-1 40-55% with upper airway obstruction pattern',
      criteria: {
        moderateSevereStenosis: true,
      },
      criteriaDescription: [
        'FEV-1 of 40-55% predicted AND',
        'Flow-Volume Loop compatible with upper airway obstruction',
      ],
      evidenceNeeded: [
        'Pulmonary function tests showing FEV-1 40-55%',
        'Flow-Volume Loop showing upper airway obstruction',
        'Laryngoscopy documenting stenosis degree',
      ],
    },
    {
      percent: 30,
      summary: 'FEV-1 56-70% with upper airway obstruction pattern',
      criteria: {
        moderateStenosis: true,
      },
      criteriaDescription: [
        'FEV-1 of 56-70% predicted AND',
        'Flow-Volume Loop compatible with upper airway obstruction',
      ],
      evidenceNeeded: [
        'Pulmonary function tests showing FEV-1 56-70%',
        'Flow-Volume Loop showing upper airway obstruction',
        'ENT documentation of stenosis',
      ],
    },
    {
      percent: 10,
      summary: 'FEV-1 71-80% with upper airway obstruction pattern',
      criteria: {
        mildStenosis: true,
      },
      criteriaDescription: [
        'FEV-1 of 71-80% predicted AND',
        'Flow-Volume Loop compatible with upper airway obstruction',
      ],
      evidenceNeeded: [
        'Pulmonary function tests showing FEV-1 71-80%',
        'Flow-Volume Loop interpretation',
        'Documentation of laryngeal narrowing',
      ],
    },
  ],

  definitions: {
    laryngealStenosis: {
      term: 'Laryngeal Stenosis',
      definition: 'Narrowing of the larynx (voice box) that restricts airflow. Can occur at various levels - supraglottic, glottic, or subglottic.',
    },
    subglotticStenosis: {
      term: 'Subglottic Stenosis',
      definition: 'Narrowing below the vocal cords, often caused by intubation injury or autoimmune conditions.',
    },
    flowVolumeLoop: {
      term: 'Flow-Volume Loop',
      definition: 'A pulmonary function test graph that shows characteristic patterns for upper vs lower airway obstruction.',
    },
    tracheostomy: {
      term: 'Tracheostomy',
      definition: 'Surgical opening in the neck into the trachea to bypass upper airway obstruction.',
    },
    stridor: {
      term: 'Stridor',
      definition: 'High-pitched, noisy breathing caused by turbulent airflow through a narrowed airway.',
    },
  },

  secondaryConditions: {
    description: 'Laryngeal stenosis often results from other conditions or causes secondary issues.',
    commonCauses: [
      { condition: 'Post-Intubation Injury', relationship: 'Prolonged intubation is the most common cause' },
      { condition: 'Trauma', relationship: 'Direct laryngeal trauma can cause stenosis' },
      { condition: 'Autoimmune Disease', relationship: 'Wegener\'s granulomatosis and other conditions' },
    ],
  },

  documentationTips: [
    'Obtain pulmonary function tests with Flow-Volume Loop',
    'Ensure PFT interpretation specifically addresses upper airway obstruction pattern',
    'Get laryngoscopy documenting stenosis location and degree',
    'Track breathing symptoms - stridor, exercise intolerance',
    'Document any dilation procedures performed',
    'Note tracheostomy status if applicable',
    'Record cause of stenosis (intubation, trauma, etc.)',
    'Consider alternative rating under DC 6519 if voice impaired',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6520. Requires PFT with Flow-Volume Loop showing upper airway obstruction pattern. May be rated as aphonia (DC 6519) if more favorable. For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// PHARYNX INJURIES RATING CRITERIA (DC 6521)
// ============================================

export const PHARYNX_INJURY_CRITERIA = {
  diagnosticCode: '6521',
  condition: 'Pharynx Injuries',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6521',

  ratings: [
    {
      percent: 50,
      summary: 'Stricture/obstruction, absent soft palate, or paralysis with swallowing/speech impairment',
      criteria: {
        significantInjury: true,
      },
      criteriaDescription: [
        'Stricture or obstruction of pharynx or nasopharynx, OR',
        'Absence of soft palate secondary to trauma, chemical burn, or granulomatous disease, OR',
        'Paralysis of soft palate with swallowing difficulty (nasal regurgitation) AND speech impairment',
      ],
      evidenceNeeded: [
        'ENT evaluation documenting pharyngeal stricture/obstruction',
        'OR documentation of soft palate absence and cause',
        'OR neurological evaluation showing soft palate paralysis',
        'Modified barium swallow study if swallowing affected',
        'Speech pathology evaluation if speech impaired',
        'Documentation of nasal regurgitation if present',
      ],
    },
  ],

  definitions: {
    pharynx: {
      term: 'Pharynx',
      definition: 'The throat - the muscular tube connecting the nose and mouth to the esophagus and larynx.',
    },
    nasopharynx: {
      term: 'Nasopharynx',
      definition: 'The upper part of the pharynx behind the nose.',
    },
    softPalate: {
      term: 'Soft Palate',
      definition: 'The muscular back part of the roof of the mouth that moves during swallowing and speech to prevent nasal regurgitation.',
    },
    nasalRegurgitation: {
      term: 'Nasal Regurgitation',
      definition: 'Food or liquid coming out through the nose during swallowing due to soft palate dysfunction.',
    },
    dysphagia: {
      term: 'Dysphagia',
      definition: 'Difficulty swallowing - a common symptom of pharyngeal injury.',
    },
  },

  secondaryConditions: {
    description: 'Pharynx injuries often occur secondary to neurological conditions or trauma.',
    commonPrimaries: [
      { condition: 'ALS', diagnosticCode: '8017', relationship: 'Bulbar symptoms cause pharyngeal dysfunction' },
      { condition: 'Multiple Sclerosis', diagnosticCode: '8018', relationship: 'Can cause soft palate paralysis' },
      { condition: 'Stroke', diagnosticCode: '8007-8009', relationship: 'Can cause pharyngeal paralysis' },
      { condition: 'TBI', diagnosticCode: '8045', relationship: 'Cranial nerve injury affects swallowing' },
    ],
  },

  documentationTips: [
    'Obtain ENT evaluation documenting pharyngeal condition',
    'Get modified barium swallow study for swallowing difficulties',
    'Document nasal regurgitation episodes',
    'Obtain speech pathology assessment',
    'Note aspiration risk and any pneumonia history',
    'Document cause of injury (trauma, surgery, disease)',
    'Track weight changes if nutrition affected',
    'Note any dietary modifications required',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6521. Requires documentation of pharyngeal stricture/obstruction, soft palate absence, or paralysis with both swallowing and speech impairment. For documentation purposes only - the VA makes all final rating determinations.',
};


// ============================================
// SHOULDER CONDITIONS RATING CRITERIA (DC 5201-5203)
// ============================================

export const NOSE_LOSS_CRITERIA = {
  diagnosticCode: '6504',
  condition: 'Nose Loss or Disfigurement',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6504',

  ratingNote: 'May also be rated under DC 7800 (Scars/Disfigurement) if that provides a higher rating. Evaluate under the criteria that results in the higher rating but do not combine ratings.',

  ratings: [
    {
      percent: 30,
      summary: 'Loss of part of nose exposing both nasal passages',
      criteria: {
        bothPassagesExposed: true,
      },
      criteriaDescription: [
        'Significant tissue loss',
        'Both nasal passages are exposed/visible',
        'Major structural damage to nose',
      ],
      evidenceNeeded: [
        'Medical documentation of extent of loss',
        'Photographs showing disfigurement',
        'ENT or plastic surgery evaluation',
        'Documentation of cause (trauma, surgery, disease)',
      ],
    },
    {
      percent: 10,
      summary: 'Loss of part of one ala OR other obvious disfigurement',
      criteria: {
        partialLoss: true,
        OR: true,
        obviousDisfigurement: true,
      },
      criteriaDescription: [
        'Partial loss of nasal ala (wing of nose)',
        'OR other obvious visible disfigurement',
        'Noticeable but not exposing both passages',
      ],
      evidenceNeeded: [
        'Medical documentation of loss/disfigurement',
        'Photographs showing visible changes',
        'Documentation of functional impact',
        'Cause documentation (trauma, surgery, cancer treatment)',
      ],
    },
  ],

  definitions: {
    nasalAla: {
      term: 'Nasal Ala',
      definition: 'The wing-like outer portion of the nose on each side, formed by cartilage and skin. Loss of part of the ala creates visible disfigurement.',
      examples: [
        'Lateral portions of the nostrils',
        'The curved, outer parts of the nose',
        'Visible on frontal and profile view',
      ],
    },
    obviousDisfigurement: {
      term: 'Obvious Disfigurement',
      definition: 'Visible alteration to the normal appearance of the nose that is readily noticeable to others.',
      examples: [
        'Asymmetry from tissue loss',
        'Scarring affecting nose contour',
        'Collapsed nasal structure',
        'Post-surgical changes',
      ],
    },
    nasalProsthesis: {
      term: 'Nasal Prosthesis',
      definition: 'An artificial nose or nasal component used to restore appearance after tissue loss.',
      examples: [
        'Silicone prosthetic nose',
        'Adhesive-attached prosthesis',
        'Implant-supported prosthesis',
      ],
    },
  },

  alternativeRating: {
    diagnosticCode: '7800',
    condition: 'Scars - Disfigurement of Head, Face, or Neck',
    note: 'If disfigurement meets criteria under DC 7800, veteran should be evaluated under both and receive the higher rating. DC 7800 ratings range from 10% to 80% based on disfigurement characteristics.',
  },

  documentationTips: [
    'Obtain photographs from multiple angles (front, profile, three-quarter)',
    'Document the cause of tissue loss (trauma, cancer, surgery)',
    'Get ENT or plastic surgery evaluation documenting extent',
    'Note any breathing impairment from structural loss',
    'Document if prosthesis is used and its effectiveness',
    'Track any reconstructive surgeries performed or planned',
    'Note psychological impact of disfigurement',
    'Request evaluation under DC 7800 if scarring is significant',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.97, DC 6504. Nose loss may also be rated under DC 7800 for disfigurement - evaluate under whichever provides higher rating. For documentation purposes only - the VA makes all final rating determinations.',
};


// ============================================
// SHOULDER CONDITIONS RATING CRITERIA (DC 5201-5203)
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
      summary: 'FEV-1 40-55% predicted, OR FEV-1/FVC 40-55%, OR monthly MD visits for exacerbations, OR >=3 systemic steroid courses/year',
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
        'Documentation of >=3 oral steroid courses per year',
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

export const COPD_CRITERIA = {
  diagnosticCode: '6604',
  condition: 'Chronic Obstructive Pulmonary Disease',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6604',

  ratings: [
    {
      percent: 100,
      summary: 'FEV-1 <40%, OR FEV-1/FVC <40%, OR DLCO <40%, OR oxygen therapy, OR respiratory failure, OR cor pulmonale',
      criteria: {
        fev1Percent: [0, 39],
        fev1FvcRatio: [0, 39],
        dlcoPercent: [0, 39],
        oxygenTherapy: true,
        respiratoryFailure: true,
        corPulmonale: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% of predicted value, OR',
        'FEV-1/FVC ratio less than 40%, OR',
        'DLCO (SB) less than 40% predicted, OR',
        'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption, OR',
        'Cor pulmonale (right heart failure), OR',
        'Right ventricular hypertrophy, OR',
        'Pulmonary hypertension (shown by Echo or cardiac catheterization), OR',
        'Episode(s) of acute respiratory failure, OR',
        'Requires outpatient oxygen therapy',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 <40% predicted',
        'DLCO testing showing <40% predicted',
        'Documentation of oxygen therapy prescription',
        'Echocardiogram or cardiac catheterization showing pulmonary hypertension',
        'Medical records of respiratory failure episodes',
      ],
    },
    {
      percent: 60,
      summary: 'FEV-1 40-55%, OR FEV-1/FVC 40-55%, OR DLCO 40-55%, OR max O2 consumption 15-20 ml/kg/min',
      criteria: {
        fev1Percent: [40, 55],
        fev1FvcRatio: [40, 55],
        dlcoPercent: [40, 55],
      },
      criteriaDescription: [
        'FEV-1 of 40- to 55-percent predicted, OR',
        'FEV-1/FVC of 40 to 55 percent, OR',
        'DLCO (SB) of 40- to 55-percent predicted, OR',
        'Maximum oxygen consumption of 15 to 20 ml/kg/min (with cardiorespiratory limit)',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 40-55% predicted',
        'FEV-1/FVC ratio calculation',
        'DLCO testing if available',
        'Exercise capacity testing if available',
      ],
    },
    {
      percent: 30,
      summary: 'FEV-1 56-70%, OR FEV-1/FVC 56-70%, OR DLCO 56-65%',
      criteria: {
        fev1Percent: [56, 70],
        fev1FvcRatio: [56, 70],
        dlcoPercent: [56, 65],
      },
      criteriaDescription: [
        'FEV-1 of 56- to 70-percent predicted, OR',
        'FEV-1/FVC of 56 to 70 percent, OR',
        'DLCO (SB) 56- to 65-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 56-70% predicted',
        'FEV-1/FVC ratio calculation',
        'DLCO testing if available',
      ],
    },
    {
      percent: 10,
      summary: 'FEV-1 71-80%, OR FEV-1/FVC 71-80%, OR DLCO 66-80%',
      criteria: {
        fev1Percent: [71, 80],
        fev1FvcRatio: [71, 80],
        dlcoPercent: [66, 80],
      },
      criteriaDescription: [
        'FEV-1 of 71- to 80-percent predicted, OR',
        'FEV-1/FVC of 71 to 80 percent, OR',
        'DLCO (SB) 66- to 80-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 71-80% predicted',
        'FEV-1/FVC ratio calculation',
        'DLCO testing if available',
      ],
    },
    {
      percent: 0,
      summary: 'FEV-1 >80% predicted without symptoms or only minimal symptoms',
      criteria: {
        fev1Percent: [81, 100],
      },
      criteriaDescription: [
        'FEV-1 greater than 80% of predicted value',
        'No significant pulmonary impairment demonstrated',
      ],
      evidenceNeeded: [
        'Spirometry results',
      ],
    },
  ],

  definitions: {
    fev1: {
      term: 'FEV-1 (Forced Expiratory Volume in 1 Second)',
      definition: 'The amount of air you can forcibly exhale in one second. Measured by spirometry and compared to predicted values based on age, height, and gender.',
      examples: [
        'Your FEV-1 is 2.0L, predicted is 4.0L = 50% predicted',
        'Lower percentages indicate more severe obstruction',
      ],
    },
    fev1fvc: {
      term: 'FEV-1/FVC Ratio',
      definition: 'The ratio of FEV-1 to Forced Vital Capacity. A ratio below 70% typically indicates obstructive lung disease.',
      examples: [
        'Normal ratio is typically >70%',
        'COPD typically shows ratio <70%',
      ],
    },
    dlco: {
      term: 'DLCO (Diffusion Capacity)',
      definition: 'Measures how well oxygen passes from the air sacs of the lungs into the blood. Reduced DLCO indicates impaired gas exchange.',
      examples: [
        'DLCO of 15, predicted 30 = 50% predicted',
        'Emphysema particularly affects DLCO',
      ],
    },
    corPulmonale: {
      term: 'Cor Pulmonale',
      definition: 'Right-sided heart failure caused by lung disease. The right ventricle enlarges due to increased pulmonary pressure.',
      examples: [
        'Swelling in legs and ankles',
        'Shortness of breath at rest',
        'Diagnosed by echocardiogram',
      ],
    },
    oxygenTherapy: {
      term: 'Supplemental Oxygen Therapy',
      definition: 'Medical oxygen prescribed for use at home, during activity, or continuously due to low blood oxygen levels.',
      examples: [
        'Oxygen concentrator at home',
        'Portable oxygen tanks',
        'Continuous vs. as-needed oxygen',
      ],
    },
  },

  pftNote: 'Pulmonary function tests (PFTs) are required to evaluate COPD. Use post-bronchodilator results unless pre-bronchodilator results are worse. When PFT results differ, use the test that most accurately reflects disability.',

  disclaimer: 'This analysis is based on logged symptoms and available measurements. VA rating requires pulmonary function testing (spirometry and DLCO). Ratings cannot be combined with other respiratory conditions under DC 6600-6847.',
};

export const CHRONIC_BRONCHITIS_CRITERIA = {
  diagnosticCode: '6600',
  condition: 'Chronic Bronchitis',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6600',

  ratings: [
    {
      percent: 100,
      summary: 'FEV-1 <40%, OR FEV-1/FVC <40%, OR DLCO <40%, OR oxygen therapy, OR respiratory failure, OR cor pulmonale',
      criteria: {
        fev1Percent: [0, 39],
        fev1FvcRatio: [0, 39],
        dlcoPercent: [0, 39],
        oxygenTherapy: true,
        respiratoryFailure: true,
        corPulmonale: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% of predicted value, OR',
        'FEV-1/FVC ratio less than 40%, OR',
        'DLCO (SB) less than 40% predicted, OR',
        'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption, OR',
        'Cor pulmonale (right heart failure), OR',
        'Right ventricular hypertrophy, OR',
        'Pulmonary hypertension (shown by Echo or cardiac catheterization), OR',
        'Episode(s) of acute respiratory failure, OR',
        'Requires outpatient oxygen therapy',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 <40% predicted',
        'DLCO testing showing <40% predicted',
        'Documentation of oxygen therapy prescription',
        'Medical records of respiratory failure episodes',
      ],
    },
    {
      percent: 60,
      summary: 'FEV-1 40-55%, OR FEV-1/FVC 40-55%, OR DLCO 40-55%',
      criteria: {
        fev1Percent: [40, 55],
        fev1FvcRatio: [40, 55],
        dlcoPercent: [40, 55],
      },
      criteriaDescription: [
        'FEV-1 of 40- to 55-percent predicted, OR',
        'FEV-1/FVC of 40 to 55 percent, OR',
        'DLCO (SB) of 40- to 55-percent predicted, OR',
        'Maximum oxygen consumption of 15 to 20 ml/kg/min (with cardiorespiratory limit)',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 40-55% predicted',
        'DLCO testing if available',
      ],
    },
    {
      percent: 30,
      summary: 'FEV-1 56-70%, OR FEV-1/FVC 56-70%, OR DLCO 56-65%',
      criteria: {
        fev1Percent: [56, 70],
        fev1FvcRatio: [56, 70],
        dlcoPercent: [56, 65],
      },
      criteriaDescription: [
        'FEV-1 of 56- to 70-percent predicted, OR',
        'FEV-1/FVC of 56 to 70 percent, OR',
        'DLCO (SB) 56- to 65-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 56-70% predicted',
        'DLCO testing if available',
      ],
    },
    {
      percent: 10,
      summary: 'FEV-1 71-80%, OR FEV-1/FVC 71-80%, OR DLCO 66-80%',
      criteria: {
        fev1Percent: [71, 80],
        fev1FvcRatio: [71, 80],
        dlcoPercent: [66, 80],
      },
      criteriaDescription: [
        'FEV-1 of 71- to 80-percent predicted, OR',
        'FEV-1/FVC of 71 to 80 percent, OR',
        'DLCO (SB) 66- to 80-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 71-80% predicted',
        'DLCO testing if available',
      ],
    },
    {
      percent: 0,
      summary: 'FEV-1 >80% predicted without significant impairment',
      criteria: {
        fev1Percent: [81, 100],
      },
      criteriaDescription: [
        'FEV-1 greater than 80% of predicted value',
        'No significant pulmonary impairment demonstrated',
      ],
      evidenceNeeded: [
        'Spirometry results',
      ],
    },
  ],

  definitions: {
    chronicBronchitis: {
      term: 'Chronic Bronchitis',
      definition: 'Inflammation of the bronchial tubes with chronic productive cough for at least 3 months per year for 2 consecutive years.',
      examples: [
        'Daily productive cough',
        'Sputum production most days',
        'Recurrent respiratory infections',
      ],
    },
    productiveCough: {
      term: 'Productive Cough',
      definition: 'Cough that produces mucus (sputum). A hallmark of chronic bronchitis.',
      examples: [
        'Morning cough with phlegm',
        'Cough producing clear, white, yellow, or green mucus',
      ],
    },
    fev1: {
      term: 'FEV-1 (Forced Expiratory Volume in 1 Second)',
      definition: 'The amount of air you can forcibly exhale in one second. Key measurement for rating.',
      examples: [
        'Measured by spirometry',
        'Compared to predicted values for your age/height/gender',
      ],
    },
    dlco: {
      term: 'DLCO (Diffusion Capacity)',
      definition: 'Measures how well oxygen passes from lungs into blood.',
      examples: [
        'May be less affected in pure bronchitis vs emphysema',
        'Still important for comprehensive evaluation',
      ],
    },
  },

  pftNote: 'Pulmonary function tests (PFTs) are required. Chronic bronchitis is defined clinically by chronic productive cough but rated based on objective pulmonary function impairment.',

  disclaimer: 'This analysis is based on logged symptoms and available measurements. VA rating requires pulmonary function testing. Ratings cannot be combined with other respiratory conditions under DC 6600-6847.',
};

export const EMPHYSEMA_CRITERIA = {
  diagnosticCode: '6603',
  condition: 'Pulmonary Emphysema',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6603',

  ratings: [
    {
      percent: 100,
      summary: 'FEV-1 <40%, OR FEV-1/FVC <40%, OR DLCO <40%, OR oxygen therapy, OR respiratory failure, OR cor pulmonale',
      criteria: {
        fev1Percent: [0, 39],
        fev1FvcRatio: [0, 39],
        dlcoPercent: [0, 39],
        oxygenTherapy: true,
        respiratoryFailure: true,
        corPulmonale: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% of predicted value, OR',
        'FEV-1/FVC ratio less than 40%, OR',
        'DLCO (SB) less than 40% predicted, OR',
        'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption, OR',
        'Cor pulmonale (right heart failure), OR',
        'Right ventricular hypertrophy, OR',
        'Pulmonary hypertension (shown by Echo or cardiac catheterization), OR',
        'Episode(s) of acute respiratory failure, OR',
        'Requires outpatient oxygen therapy',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 <40% predicted',
        'DLCO testing showing <40% predicted (particularly important for emphysema)',
        'Documentation of oxygen therapy prescription',
        'CT scan showing emphysematous changes',
      ],
    },
    {
      percent: 60,
      summary: 'FEV-1 40-55%, OR FEV-1/FVC 40-55%, OR DLCO 40-55%',
      criteria: {
        fev1Percent: [40, 55],
        fev1FvcRatio: [40, 55],
        dlcoPercent: [40, 55],
      },
      criteriaDescription: [
        'FEV-1 of 40- to 55-percent predicted, OR',
        'FEV-1/FVC of 40 to 55 percent, OR',
        'DLCO (SB) of 40- to 55-percent predicted, OR',
        'Maximum oxygen consumption of 15 to 20 ml/kg/min (with cardiorespiratory limit)',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 40-55% predicted',
        'DLCO testing (emphysema often significantly reduces DLCO)',
      ],
    },
    {
      percent: 30,
      summary: 'FEV-1 56-70%, OR FEV-1/FVC 56-70%, OR DLCO 56-65%',
      criteria: {
        fev1Percent: [56, 70],
        fev1FvcRatio: [56, 70],
        dlcoPercent: [56, 65],
      },
      criteriaDescription: [
        'FEV-1 of 56- to 70-percent predicted, OR',
        'FEV-1/FVC of 56 to 70 percent, OR',
        'DLCO (SB) 56- to 65-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 56-70% predicted',
        'DLCO testing',
      ],
    },
    {
      percent: 10,
      summary: 'FEV-1 71-80%, OR FEV-1/FVC 71-80%, OR DLCO 66-80%',
      criteria: {
        fev1Percent: [71, 80],
        fev1FvcRatio: [71, 80],
        dlcoPercent: [66, 80],
      },
      criteriaDescription: [
        'FEV-1 of 71- to 80-percent predicted, OR',
        'FEV-1/FVC of 71 to 80 percent, OR',
        'DLCO (SB) 66- to 80-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FEV-1 71-80% predicted',
        'DLCO testing',
      ],
    },
    {
      percent: 0,
      summary: 'FEV-1 >80% predicted without significant impairment',
      criteria: {
        fev1Percent: [81, 100],
      },
      criteriaDescription: [
        'FEV-1 greater than 80% of predicted value',
        'No significant pulmonary impairment demonstrated',
      ],
      evidenceNeeded: [
        'Spirometry results',
      ],
    },
  ],

  definitions: {
    emphysema: {
      term: 'Pulmonary Emphysema',
      definition: 'Destruction of the air sacs (alveoli) in the lungs, reducing surface area for gas exchange. Part of the COPD spectrum.',
      examples: [
        'Progressive shortness of breath',
        'Barrel-shaped chest',
        'Reduced exercise tolerance',
      ],
    },
    dlco: {
      term: 'DLCO (Diffusion Capacity)',
      definition: 'Particularly important for emphysema as destroyed alveoli significantly impair gas exchange even when airflow obstruction is mild.',
      examples: [
        'DLCO often reduced more than FEV-1 in emphysema',
        'Better indicator of emphysema severity than spirometry alone',
      ],
    },
    hyperinflation: {
      term: 'Hyperinflation / Barrel Chest',
      definition: 'Air trapping causes the lungs to remain over-inflated, leading to characteristic barrel-shaped chest appearance.',
      examples: [
        'Increased anterior-posterior chest diameter',
        'Flattened diaphragm on imaging',
        'Difficulty fully exhaling',
      ],
    },
    fev1: {
      term: 'FEV-1 (Forced Expiratory Volume in 1 Second)',
      definition: 'Volume of air exhaled in the first second of forced exhalation. May underestimate emphysema severity.',
      examples: [
        'Used in combination with DLCO for emphysema',
        'Air trapping can affect reliability',
      ],
    },
  },

  pftNote: 'Both spirometry and DLCO testing are important for emphysema evaluation. DLCO may be significantly reduced even when FEV-1 is only mildly impaired due to alveolar destruction.',

  disclaimer: 'This analysis is based on logged symptoms and available measurements. VA rating requires pulmonary function testing. DLCO is particularly important for emphysema evaluation. Ratings cannot be combined with other respiratory conditions under DC 6600-6847.',
};

// ============================================
// BRONCHIECTASIS RATING CRITERIA (DC 6601)
// Phase 11 - Rated by incapacitating episodes OR as chronic bronchitis (DC 6600)
// ============================================

export const BRONCHIECTASIS_CRITERIA = {
  diagnosticCode: '6601',
  condition: 'Bronchiectasis',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6601',

  ratings: [
    {
      percent: 100,
      summary: 'Incapacitating episodes of infection totaling 6+ weeks per year',
      criteria: {
        incapacitatingWeeks: [6, 52],
      },
      criteriaDescription: [
        'Incapacitating episodes of infection of at least six weeks total duration per year',
        'An incapacitating episode requires bedrest and treatment by a physician',
      ],
      evidenceNeeded: [
        'Medical records documenting each incapacitating episode',
        'Physician orders for bedrest during episodes',
        'Documentation of total weeks of incapacitating episodes',
        'Treatment records for each infection episode',
      ],
    },
    {
      percent: 60,
      summary: 'Incapacitating episodes 4-6 weeks/year, OR near-constant symptoms with hemoptysis requiring continuous antibiotics',
      criteria: {
        incapacitatingWeeks: [4, 6],
        nearConstantSymptoms: true,
        continuousAntibiotics: true,
      },
      criteriaDescription: [
        'Incapacitating episodes of infection of four to six weeks total duration per year, OR',
        'Near constant findings of cough with purulent sputum associated with anorexia, weight loss, and frank hemoptysis and requiring antibiotic usage almost continuously',
      ],
      evidenceNeeded: [
        'Documentation of incapacitating episodes with bedrest orders',
        'Medical records showing persistent purulent cough',
        'Evidence of weight loss and decreased appetite',
        'Records of hemoptysis (blood in sputum)',
        'Pharmacy records showing continuous/frequent antibiotic courses',
      ],
    },
    {
      percent: 30,
      summary: 'Incapacitating episodes 2-4 weeks/year, OR daily productive cough with prolonged antibiotics >2x/year',
      criteria: {
        incapacitatingWeeks: [2, 4],
        dailyProductiveCough: true,
        prolongedAntibiotics: true,
      },
      criteriaDescription: [
        'Incapacitating episodes of infection of two to four weeks total duration per year, OR',
        'Daily productive cough with sputum that is at times purulent or blood-tinged and that requires prolonged (lasting four to six weeks) antibiotic usage more than twice a year',
      ],
      evidenceNeeded: [
        'Documentation of incapacitating episodes',
        'Daily symptom logs showing productive cough',
        'Records of antibiotic courses lasting 4-6 weeks',
        'Evidence of purulent or blood-tinged sputum',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent productive cough with acute infection requiring antibiotics at least twice a year',
      criteria: {
        intermittentCough: true,
        antibioticCourses: 2,
      },
      criteriaDescription: [
        'Intermittent productive cough with acute infection requiring a course of antibiotics at least twice a year',
      ],
      evidenceNeeded: [
        'Symptom logs showing intermittent productive cough',
        'Medical records of at least 2 infections per year',
        'Documentation of antibiotic prescriptions',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Bronchiectasis diagnosed but symptoms controlled',
        'No significant infections requiring treatment',
      ],
      evidenceNeeded: [
        'Diagnosis confirmation (CT scan)',
      ],
    },
  ],

  alternativeRating: {
    note: 'Or rate according to pulmonary impairment as for chronic bronchitis (DC 6600)',
    reference: 'CHRONIC_BRONCHITIS_CRITERIA',
  },

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode',
      definition: 'An episode of bronchiectasis infection that requires bedrest AND treatment by a physician. Both requirements must be met for VA rating purposes.',
      examples: [
        'Severe respiratory infection requiring bedrest',
        'Physician-ordered rest period during exacerbation',
        'Unable to perform normal activities due to infection',
      ],
    },
    bronchiectasis: {
      term: 'Bronchiectasis',
      definition: 'Permanent dilation (widening) of the bronchi caused by destruction of the muscle and elastic tissue. Usually results from chronic infection or inflammation.',
      examples: [
        'Diagnosed by CT scan showing dilated airways',
        'Chronic productive cough with daily sputum',
        'Recurrent respiratory infections',
      ],
    },
    purulentSputum: {
      term: 'Purulent Sputum',
      definition: 'Mucus/phlegm that contains pus, typically yellow, green, or brown in color, indicating bacterial infection.',
      examples: [
        'Yellow or green mucus production',
        'Thick, discolored sputum',
        'Foul-smelling sputum',
      ],
    },
    hemoptysis: {
      term: 'Hemoptysis',
      definition: 'Coughing up blood or blood-streaked sputum from the respiratory tract.',
      examples: [
        'Bright red blood in sputum',
        'Blood-streaked mucus',
        'Pink-tinged sputum',
      ],
    },
    prolongedAntibiotics: {
      term: 'Prolonged Antibiotic Usage',
      definition: 'Antibiotic courses lasting four to six weeks, significantly longer than standard 7-14 day courses.',
      examples: [
        '4-6 week antibiotic prescription',
        'Extended treatment for persistent infection',
        'Multiple courses per year',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires documentation of incapacitating episodes (bedrest + physician treatment) OR can be rated based on pulmonary function testing as chronic bronchitis (DC 6600). Ratings cannot be combined with other respiratory conditions under DC 6600-6847.',
};

// ============================================
// PULMONARY FIBROSIS / INTERSTITIAL LUNG DISEASE RATING CRITERIA (DC 6825)
// Phase 11 - Uses General Rating Formula for Interstitial Lung Disease (FVC/DLCO based)
// ============================================

export const PULMONARY_FIBROSIS_CRITERIA = {
  diagnosticCode: '6825',
  condition: 'Pulmonary Fibrosis (Diffuse Interstitial Fibrosis)',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6825',

  ratings: [
    {
      percent: 100,
      summary: 'FVC <50%, OR DLCO <40%, OR max exercise <15 ml/kg/min, OR cor pulmonale, OR requires oxygen therapy',
      criteria: {
        fvcPercent: [0, 49],
        dlcoPercent: [0, 39],
        maxExercise: [0, 14],
        corPulmonale: true,
        pulmonaryHypertension: true,
        oxygenTherapy: true,
      },
      criteriaDescription: [
        'Forced Vital Capacity (FVC) less than 50-percent predicted, OR',
        'Diffusion Capacity (DLCO) less than 40-percent predicted, OR',
        'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption with cardiorespiratory limitation, OR',
        'Cor pulmonale (right heart failure), OR',
        'Pulmonary hypertension, OR',
        'Requires outpatient oxygen therapy',
      ],
      evidenceNeeded: [
        'Pulmonary function test showing FVC <50% predicted',
        'DLCO testing showing <40% predicted',
        'Documentation of supplemental oxygen prescription',
        'Echocardiogram showing cor pulmonale or pulmonary hypertension',
        'Exercise testing if available',
      ],
    },
    {
      percent: 60,
      summary: 'FVC 50-64%, OR DLCO 40-55%, OR max exercise 15-20 ml/kg/min',
      criteria: {
        fvcPercent: [50, 64],
        dlcoPercent: [40, 55],
        maxExercise: [15, 20],
      },
      criteriaDescription: [
        'FVC of 50- to 64-percent predicted, OR',
        'DLCO (SB) of 40- to 55-percent predicted, OR',
        'Maximum exercise capacity of 15 to 20 ml/kg/min oxygen consumption with cardiorespiratory limitation',
      ],
      evidenceNeeded: [
        'Spirometry showing FVC 50-64% predicted',
        'DLCO testing showing 40-55% predicted',
        'Cardiopulmonary exercise testing if available',
      ],
    },
    {
      percent: 30,
      summary: 'FVC 65-74%, OR DLCO 56-65%',
      criteria: {
        fvcPercent: [65, 74],
        dlcoPercent: [56, 65],
      },
      criteriaDescription: [
        'FVC of 65- to 74-percent predicted, OR',
        'DLCO (SB) of 56- to 65-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FVC 65-74% predicted',
        'DLCO testing showing 56-65% predicted',
      ],
    },
    {
      percent: 10,
      summary: 'FVC 75-80%, OR DLCO 66-80%',
      criteria: {
        fvcPercent: [75, 80],
        dlcoPercent: [66, 80],
      },
      criteriaDescription: [
        'FVC of 75- to 80-percent predicted, OR',
        'DLCO (SB) of 66- to 80-percent predicted',
      ],
      evidenceNeeded: [
        'Spirometry showing FVC 75-80% predicted',
        'DLCO testing showing 66-80% predicted',
      ],
    },
    {
      percent: 0,
      summary: 'FVC and DLCO >80% predicted',
      criteria: {
        fvcPercent: [81, 100],
        dlcoPercent: [81, 100],
      },
      criteriaDescription: [
        'FVC greater than 80% of predicted value',
        'DLCO greater than 80% of predicted value',
        'No significant pulmonary impairment demonstrated',
      ],
      evidenceNeeded: [
        'Pulmonary function test results',
      ],
    },
  ],

  definitions: {
    interstitialLungDisease: {
      term: 'Interstitial Lung Disease (ILD)',
      definition: 'A group of disorders causing progressive scarring of lung tissue, affecting the ability to breathe and get oxygen to the bloodstream.',
      examples: [
        'Idiopathic pulmonary fibrosis (IPF)',
        'Fibrosing alveolitis',
        'Interstitial pneumonitis',
        'Drug-induced pulmonary fibrosis',
      ],
    },
    fvc: {
      term: 'FVC (Forced Vital Capacity)',
      definition: 'The total amount of air that can be forcibly exhaled after taking the deepest breath possible. Key measurement for restrictive lung diseases like pulmonary fibrosis.',
      examples: [
        'Reduced FVC indicates restricted lung expansion',
        'Expressed as percentage of predicted normal',
        'Lower values indicate more severe restriction',
      ],
    },
    dlco: {
      term: 'DLCO (Diffusion Capacity)',
      definition: 'Measures how well oxygen passes from the lungs into the bloodstream. Particularly important in interstitial lung disease.',
      examples: [
        'Reduced DLCO indicates impaired gas exchange',
        'Often affected early in pulmonary fibrosis',
        'Measured by single-breath carbon monoxide test',
      ],
    },
    corPulmonale: {
      term: 'Cor Pulmonale',
      definition: 'Right-sided heart failure caused by lung disease. The right ventricle enlarges due to chronic high pulmonary pressures.',
      examples: [
        'Complication of severe pulmonary fibrosis',
        'Diagnosed by echocardiogram',
        'Signs include leg swelling, enlarged liver',
      ],
    },
    fingerClubbing: {
      term: 'Finger Clubbing',
      definition: 'Enlargement of the fingertips and nails that curve around the fingertips. Associated with chronic lung disease and low oxygen levels.',
      examples: [
        'Nails curve downward like spoons inverted',
        'Soft tissue at nail base becomes spongy',
        'Common finding in pulmonary fibrosis',
      ],
    },
  },

  pftNote: 'Interstitial lung disease is evaluated using FVC (not FEV-1) as the primary spirometric measure, along with DLCO. FVC reflects the restrictive pattern characteristic of fibrotic lung disease.',

  disclaimer: 'This analysis is based on logged symptoms and available measurements. VA rating requires pulmonary function testing (FVC and DLCO). Ratings cannot be combined with other respiratory conditions under DC 6600-6847.',
};

// ============================================
// SARCOIDOSIS RATING CRITERIA (DC 6846)
// Phase 11 - Has specific rating criteria OR rate as chronic bronchitis (DC 6600)
// ============================================

export const SARCOIDOSIS_CRITERIA = {
  diagnosticCode: '6846',
  condition: 'Sarcoidosis',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6846',

  ratings: [
    {
      percent: 100,
      summary: 'Cor pulmonale, OR cardiac involvement with CHF, OR progressive disease with fever/night sweats/weight loss despite treatment',
      criteria: {
        corPulmonale: true,
        cardiacInvolvement: true,
        congestiveHeartFailure: true,
        progressiveDisease: true,
        systemicSymptoms: true,
      },
      criteriaDescription: [
        'Cor pulmonale (right heart failure from lung involvement), OR',
        'Cardiac involvement with congestive heart failure, OR',
        'Progressive pulmonary disease with fever, night sweats, and weight loss despite treatment',
      ],
      evidenceNeeded: [
        'Echocardiogram showing cor pulmonale or cardiac involvement',
        'Documentation of congestive heart failure',
        'Medical records showing progressive disease despite treatment',
        'Documentation of systemic symptoms (fever, night sweats, weight loss)',
        'Treatment records showing failed response to therapy',
      ],
    },
    {
      percent: 60,
      summary: 'Pulmonary involvement requiring systemic high-dose (therapeutic) corticosteroids for control',
      criteria: {
        pulmonaryInvolvement: true,
        highDoseCorticosteroids: true,
        therapeuticDose: true,
      },
      criteriaDescription: [
        'Pulmonary involvement requiring systemic high dose (therapeutic) corticosteroids for control',
        'High-dose typically means prednisone 20mg+ daily or equivalent',
      ],
      evidenceNeeded: [
        'Documentation of pulmonary sarcoidosis',
        'Prescription records for high-dose systemic corticosteroids',
        'Medical records showing need for therapeutic steroid doses',
        'Evidence that lower doses do not control disease',
      ],
    },
    {
      percent: 30,
      summary: 'Pulmonary involvement with persistent symptoms requiring chronic low-dose or intermittent corticosteroids',
      criteria: {
        pulmonaryInvolvement: true,
        persistentSymptoms: true,
        maintenanceCorticosteroids: true,
      },
      criteriaDescription: [
        'Pulmonary involvement with persistent symptoms requiring chronic low dose (maintenance) or intermittent corticosteroids',
        'Low-dose/maintenance typically means prednisone <20mg daily',
      ],
      evidenceNeeded: [
        'Documentation of pulmonary sarcoidosis with ongoing symptoms',
        'Prescription records for maintenance steroid therapy',
        'Symptom logs showing persistent respiratory symptoms',
        'Medical records of intermittent steroid courses',
      ],
    },
    {
      percent: 0,
      summary: 'Chronic hilar adenopathy or stable lung infiltrates without symptoms or physiologic impairment',
      criteria: {
        asymptomatic: true,
        stableDisease: true,
      },
      criteriaDescription: [
        'Chronic hilar adenopathy or stable lung infiltrates without symptoms or physiologic impairment',
        'Disease present on imaging but not causing functional problems',
      ],
      evidenceNeeded: [
        'Imaging showing hilar adenopathy or lung infiltrates',
        'Documentation that condition is stable',
        'No treatment required',
      ],
    },
  ],

  alternativeRating: {
    note: 'Or rate active disease or residuals as chronic bronchitis (DC 6600) and extra-pulmonary involvement under specific body system involved',
    reference: 'CHRONIC_BRONCHITIS_CRITERIA',
  },

  definitions: {
    sarcoidosis: {
      term: 'Sarcoidosis',
      definition: 'An inflammatory disease that can affect multiple organs, most commonly the lungs and lymph nodes. Characterized by granulomas (clusters of inflammatory cells).',
      examples: [
        'Often discovered on routine chest X-ray',
        'Can affect lungs, skin, eyes, heart, nervous system',
        'Variable course - may resolve or become chronic',
      ],
    },
    hilarAdenopathy: {
      term: 'Hilar Adenopathy',
      definition: 'Enlargement of lymph nodes at the hilum (root) of the lung where blood vessels and bronchi enter. A common finding in sarcoidosis.',
      examples: [
        'Bilateral hilar lymphadenopathy on chest X-ray',
        'May be the only finding in early sarcoidosis',
        'Often asymptomatic',
      ],
    },
    corPulmonale: {
      term: 'Cor Pulmonale',
      definition: 'Right-sided heart failure secondary to lung disease. Occurs when pulmonary sarcoidosis causes pulmonary hypertension.',
      examples: [
        'Severe complication of pulmonary sarcoidosis',
        'Signs include leg edema, enlarged liver',
        'Diagnosed by echocardiogram',
      ],
    },
    systemicCorticosteroids: {
      term: 'Systemic Corticosteroids',
      definition: 'Oral or injectable steroids used throughout the body, as opposed to inhaled steroids which act locally in the lungs.',
      examples: [
        'Prednisone (oral)',
        'Methylprednisolone (oral or IV)',
        'Dexamethasone',
      ],
    },
    highDoseVsLowDose: {
      term: 'High-Dose vs. Low-Dose Corticosteroids',
      definition: 'High-dose (therapeutic): Prednisone 20mg+ daily or equivalent, used to control active disease. Low-dose (maintenance): Prednisone <20mg daily, used to prevent flares.',
      examples: [
        'High-dose: 40-60mg prednisone for acute flares',
        'Low-dose: 5-15mg prednisone for maintenance',
        'Intermittent: Periodic courses during flares',
      ],
    },
    extraPulmonaryInvolvement: {
      term: 'Extra-Pulmonary Involvement',
      definition: 'Sarcoidosis affecting organs other than the lungs, which should be rated separately under the appropriate body system.',
      examples: [
        'Skin lesions (rate under dermatology codes)',
        'Eye involvement/uveitis (rate under eye codes)',
        'Cardiac sarcoidosis (rate under cardiac codes)',
        'Neurological involvement (rate under neuro codes)',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires documentation of pulmonary involvement and treatment requirements. Extra-pulmonary sarcoidosis should be rated separately under the specific body system involved. Active disease may alternatively be rated as chronic bronchitis (DC 6600) based on pulmonary function testing.',
};


// ============================================
// RATING CRITERIA - HEARING LOSS
// ============================================

export const RAYNAUDS_CRITERIA = {
  diagnosticCode: '7117',
  condition: "Raynaud's Syndrome",
  cfrReference: '38 CFR 4.104, Diagnostic Code 7117',

  ratings: [
    {
      percent: 100,
      summary: '2+ digital ulcers plus auto-amputation + history of characteristic attacks',
      criteria: {
        digitalUlcers: 2,
        autoAmputation: true,
        characteristicAttacks: true,
      },
      criteriaDescription: [
        'Two or more digital ulcers',
        'PLUS auto-amputation of one or more digits',
        'AND history of characteristic attacks',
      ],
      evidenceNeeded: [
        'Medical documentation of digital ulcers',
        'Surgical/medical records of auto-amputation',
        'Attack frequency logs',
      ],
    },
    {
      percent: 60,
      summary: '2+ digital ulcers + history of characteristic attacks',
      criteria: {
        digitalUlcers: 2,
        characteristicAttacks: true,
      },
      criteriaDescription: [
        'Two or more digital ulcers',
        'AND history of characteristic attacks',
      ],
      evidenceNeeded: [
        'Medical documentation of digital ulcers',
        'Attack frequency logs',
        'Photos of ulcers if available',
      ],
    },
    {
      percent: 40,
      summary: 'Characteristic attacks occurring at least daily',
      criteria: {
        attackFrequency: 'daily',
      },
      criteriaDescription: [
        'Characteristic attacks occurring at least daily',
      ],
      evidenceNeeded: [
        'Daily attack logs',
        'Description of color changes and symptoms',
      ],
    },
    {
      percent: 20,
      summary: 'Characteristic attacks occurring 4-6 times/week',
      criteria: {
        attacksPerWeek: [4, 6],
      },
      criteriaDescription: [
        'Characteristic attacks occurring four to six times a week',
      ],
      evidenceNeeded: [
        'Attack frequency logs',
        'Description of triggers and symptoms',
      ],
    },
    {
      percent: 10,
      summary: 'Characteristic attacks occurring 1-3 times/week',
      criteria: {
        attacksPerWeek: [1, 3],
      },
      criteriaDescription: [
        'Characteristic attacks occurring one to three times a week',
      ],
      evidenceNeeded: [
        'Attack frequency logs',
        'Description of triggers and symptoms',
      ],
    },
  ],

  definitions: {
    characteristicAttack: {
      term: 'Characteristic Attack',
      definition: 'Sequential color changes of the digits (typically white → blue → red) lasting minutes to hours, sometimes with pain and paresthesias, precipitated by cold exposure or emotional stress.',
      examples: [
        'Fingers turn white, then blue, then red',
        'Numbness or tingling during attack',
        'Pain as blood flow returns',
        'Triggered by cold or stress',
      ],
    },
    digitalUlcer: {
      term: 'Digital Ulcer',
      definition: 'Open sore on the fingers or toes caused by severe, repeated attacks reducing blood flow.',
      examples: [
        'Painful sores on fingertips',
        'Slow-healing wounds',
        'May become infected',
      ],
    },
  },

  primaryVsSecondary: "DC 7117 is for Raynaud's Syndrome (secondary Raynaud's) - caused by underlying condition. DC 7124 is for Raynaud's Disease (primary Raynaud's) - no underlying cause. Secondary is rated higher because it's typically more severe.",

  disclaimer: 'This analysis is based on logged Raynaud\'s symptoms. Attack frequency is the key rating factor. Document each attack with date, duration, triggers, and affected digits.',
};

export const VARICOSE_VEINS_CRITERIA = {
  diagnosticCode: '7120/7121',
  condition: 'Varicose Veins',
  cfrReference: '38 CFR 4.104, Diagnostic Codes 7120/7121',

  ratings: [
    {
      percent: 100,
      summary: 'Massive board-like edema with constant pain at rest',
      criteria: {
        massiveEdema: true,
        constantPainAtRest: true,
      },
      criteriaDescription: [
        'Massive board-like edema',
        'WITH constant pain at rest',
      ],
      evidenceNeeded: [
        'Medical documentation of severe edema',
        'Pain logs showing constant rest pain',
        'Photos of affected extremity',
      ],
    },
    {
      percent: 60,
      summary: 'Persistent edema, stasis pigmentation/eczema, persistent ulceration',
      criteria: {
        persistentEdema: true,
        stasisPigmentation: true,
        persistentUlceration: true,
      },
      criteriaDescription: [
        'Persistent edema or subcutaneous induration',
        'Stasis pigmentation or eczema',
        'AND persistent ulceration',
      ],
      evidenceNeeded: [
        'Medical documentation of all three findings',
        'Photos of pigmentation changes and ulcers',
        'Wound care records',
      ],
    },
    {
      percent: 40,
      summary: 'Persistent edema, stasis pigmentation/eczema, with/without intermittent ulceration',
      criteria: {
        persistentEdema: true,
        stasisPigmentation: true,
        intermittentUlceration: true,
      },
      criteriaDescription: [
        'Persistent edema',
        'AND stasis pigmentation or eczema',
        'With or without intermittent ulceration',
      ],
      evidenceNeeded: [
        'Medical documentation of edema and skin changes',
        'Photos showing pigmentation',
        'Ulcer history if applicable',
      ],
    },
    {
      percent: 20,
      summary: 'Persistent edema incompletely relieved by elevation, with/without beginning stasis pigmentation',
      criteria: {
        persistentEdema: true,
        incompleteReliefByElevation: true,
      },
      criteriaDescription: [
        'Persistent edema incompletely relieved by elevation of extremity',
        'With or without beginning stasis pigmentation or eczema',
      ],
      evidenceNeeded: [
        'Documentation of persistent swelling',
        'Notes on response to elevation',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent edema OR aching/fatigue after standing/walking, relieved by elevation/compression',
      criteria: {
        intermittentEdema: true,
        achingAfterActivity: true,
        relievedByElevation: true,
      },
      criteriaDescription: [
        'Intermittent edema of extremity, OR',
        'Aching and fatigue in leg after prolonged standing or walking',
        'Symptoms relieved by elevation of extremity or compression hosiery',
      ],
      evidenceNeeded: [
        'Symptom logs',
        'Notes on what provides relief',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic palpable or visible varicose veins',
      criteria: {
        asymptomatic: true,
      },
      criteriaDescription: [
        'Asymptomatic palpable or visible varicose veins',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    stasisPigmentation: {
      term: 'Stasis Pigmentation',
      definition: 'Brownish discoloration of the skin, usually around ankles, caused by chronic poor circulation and blood pooling.',
      examples: [
        'Brown or rust-colored skin',
        'Usually around ankles and lower legs',
        'Sign of chronic venous insufficiency',
      ],
    },
    stasisEczema: {
      term: 'Stasis Eczema (Dermatitis)',
      definition: 'Itchy, inflamed skin caused by poor circulation. Also called venous eczema.',
      examples: [
        'Red, scaly, itchy skin',
        'Usually on lower legs',
        'May weep or crust',
      ],
    },
  },

  bilateralNote: 'Rate each extremity separately and combine using the bilateral factor if applicable. Track symptoms for each leg individually.',

  disclaimer: 'This analysis is based on logged varicose vein symptoms. Document symptoms for each affected leg separately. Key factors are edema persistence, skin changes, and ulceration.',
};

export const CHRONIC_URTICARIA_CRITERIA = {
  diagnosticCode: '7825',
  condition: 'Chronic Urticaria',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7825',

  ratings: [
    {
      percent: 60,
      summary: 'Chronic refractory urticaria requiring third-line treatment',
      criteria: {
        thirdLineTreatment: true,
        refractoryToFirstSecondLine: true,
      },
      criteriaDescription: [
        'Chronic refractory urticaria that requires third line treatment for control due to ineffectiveness with first and second line treatments',
        'Third line treatments include: plasmapheresis, immunotherapy, immunosuppressives',
      ],
      evidenceNeeded: [
        'Documentation of failed first-line treatment (antihistamines)',
        'Documentation of failed second-line treatment (steroids, etc.)',
        'Prescription records for third-line treatment',
      ],
    },
    {
      percent: 30,
      summary: 'Chronic urticaria requiring second-line treatment',
      criteria: {
        secondLineTreatment: true,
      },
      criteriaDescription: [
        'Chronic urticaria that requires second line treatment for control',
        'Second line treatments include: corticosteroids, sympathomimetics, leukotriene inhibitors, neutrophil inhibitors, thyroid hormone',
      ],
      evidenceNeeded: [
        'Documentation that antihistamines alone are insufficient',
        'Prescription records for second-line treatment',
        'Outbreak frequency logs',
      ],
    },
    {
      percent: 10,
      summary: 'Chronic urticaria requiring first-line treatment (antihistamines)',
      criteria: {
        firstLineTreatment: true,
      },
      criteriaDescription: [
        'Chronic urticaria that requires first line treatment (antihistamines) for control',
      ],
      evidenceNeeded: [
        'Prescription records for antihistamines',
        'Outbreak frequency logs showing chronic pattern',
      ],
    },
  ],

  definitions: {
    chronicUrticaria: {
      term: 'Chronic Urticaria',
      definition: 'Continuous urticaria (hives) occurring at least twice per week, off treatment, for a period of six weeks or more.',
      examples: [
        'Raised, itchy welts (hives)',
        'Welts may change shape or disappear and reappear',
        'Occurring regularly for 6+ weeks',
      ],
    },
    treatmentLines: {
      term: 'Treatment Lines',
      definition: 'The progression of treatments tried for urticaria, from least to most aggressive.',
      examples: [
        'First line: Antihistamines (Zyrtec, Allegra, Benadryl)',
        'Second line: Steroids, leukotriene inhibitors (Singulair)',
        'Third line: Immunosuppressives, biologics (Xolair)',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged urticaria symptoms. The rating is based on treatment level required for control. Document all outbreaks and medications used.',
};

// ============================================
// PHASE 2: VISION LOSS CRITERIA (DC 6061-6079)
// ============================================

export const CARDIOMYOPATHY_CRITERIA = {
  diagnosticCode: '7020',
  condition: 'Cardiomyopathy',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7020',

  note: 'Cardiomyopathy is rated under the General Rating Formula for Diseases of the Heart. Rating is based on METs (metabolic equivalents) at which symptoms develop, or on documented cardiac hypertrophy/dilatation.',

  ratings: [
    {
      percent: 100,
      summary: 'Workload <=3.0 METs causes heart failure symptoms',
      criteriaDescription: [
        'Workload of 3.0 METs or less results in heart failure symptoms',
        'Heart failure symptoms include: breathlessness, fatigue, angina, dizziness, syncope, palpitations',
        'Severely limited - symptoms with minimal activity (eating, dressing, walking slowly)',
      ],
      evidenceNeeded: [
        'Exercise stress test showing symptoms at <=3.0 METs',
        'OR medical estimate with specific activity examples',
        'Echocardiogram or equivalent showing cardiac impairment',
        'Symptom logs documenting limitations',
      ],
    },
    {
      percent: 60,
      summary: 'Workload 3.1-5.0 METs causes heart failure symptoms',
      criteriaDescription: [
        'Workload of 3.1 to 5.0 METs results in heart failure symptoms',
        'Moderate limitation - symptoms with light housework, walking 2-3 mph',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate',
        'Documentation of symptoms at specified activity level',
        'Echocardiogram showing cardiac changes',
      ],
    },
    {
      percent: 30,
      summary: 'Workload 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'Workload of 5.1 to 7.0 METs results in heart failure symptoms, OR',
        'Evidence of cardiac hypertrophy or dilatation confirmed by echocardiogram or equivalent',
        'Mild-moderate limitation - symptoms with climbing stairs, brisk walking',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate',
        'OR echocardiogram/MRI showing hypertrophy or dilatation',
        'Symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Workload 7.1-10.0 METs causes symptoms OR continuous medication required',
      criteriaDescription: [
        'Workload of 7.1 to 10.0 METs results in heart failure symptoms, OR',
        'Continuous medication required for control',
        'Minimal limitation - symptoms only with moderate exertion',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate',
        'Prescription records showing continuous medication',
        'Symptom logs',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or symptoms only above 10 METs',
      criteriaDescription: [
        'No symptoms at workloads up to 10 METs',
        'OR asymptomatic with normal cardiac function',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    METs: {
      term: 'METs (Metabolic Equivalents)',
      definition: 'One MET is the energy cost of standing quietly at rest (oxygen uptake of 3.5 mL/kg/min). Higher METs indicate greater exertion capacity.',
      examples: [
        '1-3 METs: Eating, dressing, walking slowly around home',
        '3-5 METs: Light housework, walking 2-3 mph',
        '5-7 METs: Climbing one flight of stairs, walking 4 mph',
        '7-10 METs: Heavy housework, moderate cycling',
        '>10 METs: Vigorous exercise, running, competitive sports',
      ],
    },
    heartFailureSymptoms: {
      term: 'Heart Failure Symptoms',
      definition: 'Symptoms that indicate the heart is not pumping effectively.',
      examples: [
        'Breathlessness/dyspnea',
        'Fatigue with exertion',
        'Angina/chest pain',
        'Dizziness',
        'Syncope (fainting)',
        'Palpitations',
        'Arrhythmia',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged cardiomyopathy symptoms and any recorded METs capacity or ejection fraction. Document symptoms at specific activity levels and record any cardiac testing results.',
};

// DC 7010: Supraventricular Tachycardia (SVT)

export const SVT_CRITERIA = {
  diagnosticCode: '7010',
  condition: 'Supraventricular Tachycardia',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7010',

  note: 'SVT includes: atrial fibrillation, atrial flutter, sinus tachycardia, AVNRT, AVRT, atrial tachycardia, junctional tachycardia, and multifocal atrial tachycardia. A treatment intervention is when a symptomatic patient requires IV medication, cardioversion, or ablation.',

  ratings: [
    {
      percent: 30,
      summary: 'ECG-confirmed SVT with 5+ treatment interventions per year',
      criteriaDescription: [
        'Supraventricular tachycardia confirmed by ECG',
        'WITH five or more treatment interventions per year',
        'Treatment interventions: IV pharmacologic adjustment, cardioversion, and/or ablation',
      ],
      evidenceNeeded: [
        'ECG documentation of SVT episodes',
        'Medical records of treatment interventions',
        'Hospital/ER visit records',
        'Procedure records for cardioversion or ablation',
      ],
    },
    {
      percent: 10,
      summary: 'ECG-confirmed SVT with 1-4 interventions/year OR continuous oral meds OR vagal maneuvers',
      criteriaDescription: [
        'Supraventricular tachycardia confirmed by ECG with ONE of:',
        '• 1 to 4 treatment interventions per year',
        '• Continuous use of oral medications to control',
        '• Use of vagal maneuvers to control',
      ],
      evidenceNeeded: [
        'ECG documentation of SVT',
        'Medication records for oral antiarrhythmics',
        'Documentation of vagal maneuver use',
        'Medical records of any interventions',
      ],
    },
    {
      percent: 0,
      summary: 'SVT present but not requiring treatment',
      criteriaDescription: [
        'Documented SVT that does not require medication or interventions',
        'Asymptomatic or self-limiting episodes',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    treatmentIntervention: {
      term: 'Treatment Intervention',
      definition: 'For DC 7010, an intervention is when a symptomatic patient requires IV pharmacologic adjustment, cardioversion, and/or ablation for symptom relief.',
      examples: [
        'IV adenosine administration',
        'IV beta-blocker or calcium channel blocker',
        'Electrical cardioversion',
        'Catheter ablation procedure',
      ],
    },
    vagalManeuver: {
      term: 'Vagal Maneuver',
      definition: 'Physical techniques used to stimulate the vagus nerve to slow heart rate.',
      examples: [
        'Valsalva maneuver (bearing down)',
        'Carotid sinus massage',
        'Cold water face immersion',
        'Coughing',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged SVT episodes and treatments. Document each episode with date, ECG confirmation if available, and any treatment required (IV meds, cardioversion, ablation, vagal maneuvers, or oral medications).',
};

// DC 7011: Ventricular Arrhythmias

export const VENTRICULAR_ARRHYTHMIA_CRITERIA = {
  diagnosticCode: '7011',
  condition: 'Ventricular Arrhythmias (Sustained)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7011',

  note: 'A 100% rating applies during hospitalization for initial therapy or ventricular aneurysmectomy, or with an AICD in place. After stabilization, rate under the General Rating Formula for Diseases of the Heart.',

  ratings: [
    {
      percent: 100,
      summary: 'Hospitalization for ventricular arrhythmia OR AICD in place',
      criteriaDescription: [
        'For indefinite period from date of hospital admission for initial medical therapy for sustained ventricular arrhythmia, OR',
        'For indefinite period from date of hospital admission for ventricular aneurysmectomy, OR',
        'With an automatic implantable cardioverter-defibrillator (AICD) in place',
      ],
      evidenceNeeded: [
        'Hospital admission records for ventricular arrhythmia',
        'OR AICD implantation records',
        'Cardiology follow-up documentation',
      ],
    },
    {
      percent: 60,
      summary: 'Post-stabilization: 3.1-5.0 METs causes symptoms (General Rating Formula)',
      criteriaDescription: [
        'After stabilization, rate under General Rating Formula',
        'Workload of 3.1 to 5.0 METs results in heart failure symptoms',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate post-stabilization',
        'Symptom documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Post-stabilization: 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'After stabilization, rate under General Rating Formula',
        'Workload of 5.1 to 7.0 METs results in symptoms, OR',
        'Cardiac hypertrophy or dilatation on echocardiogram',
      ],
      evidenceNeeded: [
        'Post-stabilization cardiac testing',
        'Echocardiogram results',
      ],
    },
    {
      percent: 10,
      summary: 'Post-stabilization: 7.1-10.0 METs causes symptoms OR continuous medication',
      criteriaDescription: [
        'After stabilization, rate under General Rating Formula',
        'Workload of 7.1 to 10.0 METs results in symptoms, OR',
        'Continuous medication required for control',
      ],
      evidenceNeeded: [
        'Medication records',
        'Symptom documentation',
      ],
    },
  ],

  definitions: {
    AICD: {
      term: 'AICD (Automatic Implantable Cardioverter-Defibrillator)',
      definition: 'A device implanted in the chest that monitors heart rhythm and delivers shocks to correct life-threatening arrhythmias.',
      examples: [
        'Also called ICD (Implantable Cardioverter-Defibrillator)',
        'Monitors for ventricular tachycardia/fibrillation',
        'Delivers shock to restore normal rhythm',
      ],
    },
    sustainedVentricularArrhythmia: {
      term: 'Sustained Ventricular Arrhythmia',
      definition: 'Ventricular tachycardia or fibrillation lasting more than 30 seconds or requiring intervention to terminate.',
    },
  },

  disclaimer: 'This analysis is based on logged ventricular arrhythmia events. If you have an AICD, document the implant date. After stabilization, document METs capacity and symptoms for ongoing rating determination.',
};

// DC 7002: Pericarditis

export const PERICARDITIS_CRITERIA = {
  diagnosticCode: '7002',
  condition: 'Pericarditis',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7002',

  note: 'During active infection with cardiac involvement and for 3 months following cessation of therapy, rate at 100%. Thereafter, rate under the General Rating Formula for Diseases of the Heart with diagnosis confirmed by physical exam and echo/Doppler/catheterization.',

  ratings: [
    {
      percent: 100,
      summary: 'Active infection with cardiac involvement (and 3 months post-treatment)',
      criteriaDescription: [
        'During active infection with cardiac involvement',
        'AND for three months following cessation of therapy for the active infection',
        'Requires confirmed pericarditis with ongoing treatment',
      ],
      evidenceNeeded: [
        'Medical diagnosis of active pericarditis',
        'Treatment records showing therapy dates',
        'Echocardiogram or imaging showing pericardial involvement',
      ],
    },
    {
      percent: 60,
      summary: 'Post-active: 3.1-5.0 METs causes symptoms',
      criteriaDescription: [
        'After active infection resolves (more than 3 months post-treatment)',
        'Workload of 3.1 to 5.0 METs results in heart failure symptoms',
        'Diagnosis confirmed by echo, Doppler, or catheterization',
      ],
      evidenceNeeded: [
        'Post-treatment cardiac evaluation',
        'Exercise stress test or medical estimate',
        'Echo/Doppler confirmation',
      ],
    },
    {
      percent: 30,
      summary: 'Post-active: 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'After active infection resolves',
        'Workload of 5.1 to 7.0 METs results in symptoms, OR',
        'Cardiac hypertrophy or dilatation on echo',
      ],
      evidenceNeeded: [
        'Cardiac testing results',
        'Symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Post-active: 7.1-10.0 METs causes symptoms OR continuous medication',
      criteriaDescription: [
        'After active infection resolves',
        'Workload of 7.1 to 10.0 METs results in symptoms, OR',
        'Continuous medication required for control',
      ],
      evidenceNeeded: [
        'Medication records',
        'Symptom documentation',
      ],
    },
    {
      percent: 0,
      summary: 'Resolved pericarditis with no residual symptoms',
      criteriaDescription: [
        'History of pericarditis, fully resolved',
        'No symptoms at workloads up to 10 METs',
        'No ongoing cardiac impairment',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    pericarditis: {
      term: 'Pericarditis',
      definition: 'Inflammation of the pericardium (the sac surrounding the heart). Can be acute, recurrent, or constrictive.',
      symptoms: [
        'Sharp chest pain (worse with breathing or lying down)',
        'Pain relieved by sitting up and leaning forward',
        'Pericardial friction rub on exam',
        'Fever',
        'Shortness of breath',
      ],
    },
    pericardialEffusion: {
      term: 'Pericardial Effusion',
      definition: 'Accumulation of fluid in the pericardial sac, which can occur with pericarditis.',
    },
  },

  disclaimer: 'This analysis is based on logged pericarditis symptoms. Document active infection periods, treatment dates, and any residual symptoms. After resolution, track symptoms at various activity levels.',
};

// DC 7121: Post-Phlebitic Syndrome

export const POST_PHLEBITIC_CRITERIA = {
  diagnosticCode: '7121',
  condition: 'Post-Phlebitic Syndrome',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7121',

  note: 'Post-phlebitic syndrome results from deep vein thrombosis (DVT) and causes chronic venous insufficiency. Rate each extremity separately and combine using the bilateral factor if applicable.',

  ratings: [
    {
      percent: 100,
      summary: 'Massive board-like edema with constant pain at rest',
      criteriaDescription: [
        'Massive board-like edema',
        'WITH constant pain at rest',
        'Findings attributed to venous disease',
      ],
      evidenceNeeded: [
        'Medical documentation of severe edema',
        'Pain logs showing constant rest pain',
        'Photos of affected extremity',
        'History of DVT',
      ],
    },
    {
      percent: 60,
      summary: 'Persistent edema, stasis pigmentation/eczema, AND persistent ulceration',
      criteriaDescription: [
        'Persistent edema or subcutaneous induration',
        'Stasis pigmentation or eczema',
        'AND persistent ulceration',
        'All findings attributed to venous disease',
      ],
      evidenceNeeded: [
        'Medical documentation of all three findings',
        'Photos of skin changes and ulcers',
        'Wound care records',
      ],
    },
    {
      percent: 40,
      summary: 'Persistent edema AND stasis pigmentation/eczema, with/without intermittent ulceration',
      criteriaDescription: [
        'Persistent edema',
        'AND stasis pigmentation or eczema',
        'With or without intermittent ulceration',
      ],
      evidenceNeeded: [
        'Medical documentation of edema and skin changes',
        'Photos showing pigmentation',
        'Ulcer history if applicable',
      ],
    },
    {
      percent: 20,
      summary: 'Persistent edema incompletely relieved by elevation, with/without beginning stasis pigmentation',
      criteriaDescription: [
        'Persistent edema incompletely relieved by elevation of extremity',
        'With or without beginning stasis pigmentation or eczema',
      ],
      evidenceNeeded: [
        'Documentation of persistent swelling',
        'Notes on response to elevation',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent edema OR aching/fatigue after standing/walking, relieved by elevation/compression',
      criteriaDescription: [
        'Intermittent edema of extremity, OR',
        'Aching and fatigue in leg after prolonged standing or walking',
        'Symptoms relieved by elevation of extremity or compression hosiery',
      ],
      evidenceNeeded: [
        'Symptom logs',
        'Notes on what provides relief',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic post-DVT',
      criteriaDescription: [
        'History of DVT but no current symptoms',
        'No edema, pigmentation changes, or ulceration',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    postPhlebiticSyndrome: {
      term: 'Post-Phlebitic Syndrome',
      definition: 'Chronic venous insufficiency that develops after deep vein thrombosis (DVT). Also called post-thrombotic syndrome.',
      causes: [
        'Prior deep vein thrombosis (DVT)',
        'Damage to venous valves',
        'Chronic venous hypertension',
      ],
    },
    stasisPigmentation: {
      term: 'Stasis Pigmentation',
      definition: 'Brownish discoloration of skin from chronic poor circulation and hemosiderin deposition.',
    },
    venousUlcer: {
      term: 'Venous Ulcer',
      definition: 'Open wound caused by venous insufficiency, typically occurring above the ankle.',
    },
  },

  bilateralNote: 'Rate each extremity separately and combine using the bilateral factor (38 CFR 4.26) if both legs are affected.',

  disclaimer: 'This analysis is based on logged post-phlebitic syndrome symptoms. Document symptoms for each affected leg separately. Key factors are edema persistence, skin changes, and ulceration.',
};


// ============================================
// PHASE 2A: CORONARY ARTERY DISEASE (DC 7005)
// ============================================

export const CAD_CRITERIA = {
  diagnosticCode: '7005',
  condition: 'Coronary Artery Disease (Arteriosclerotic Heart Disease)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7005',

  note: 'CAD is rated under the General Rating Formula for Diseases of the Heart based on METs capacity at which cardiac symptoms develop. Includes conditions such as angina pectoris, atherosclerotic heart disease, and ischemic heart disease.',

  ratings: [
    {
      percent: 100,
      summary: 'Documented CHF OR workload <=3.0 METs causes symptoms',
      criteriaDescription: [
        'Chronic congestive heart failure (CHF) documented, OR',
        'Workload of 3.0 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope',
        'Severely limited - symptoms with minimal activity (eating, dressing, walking slowly)',
      ],
      evidenceNeeded: [
        'Medical diagnosis of CHF with treatment records',
        'OR exercise stress test showing symptoms at <=3.0 METs',
        'OR medical estimate with specific activity limitations',
        'Ejection fraction if available',
        'Symptom logs documenting severe limitations',
      ],
    },
    {
      percent: 60,
      summary: 'More than one MI OR workload 3.1-5.0 METs causes symptoms',
      criteriaDescription: [
        'More than one documented myocardial infarction, OR',
        'Workload of 3.1 to 5.0 METs results in cardiac symptoms',
        'Moderate limitation - symptoms with light housework, walking 2-3 mph',
      ],
      evidenceNeeded: [
        'Medical records documenting multiple MIs',
        'OR exercise stress test results',
        'Cardiac catheterization or imaging results',
        'Symptom documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Workload 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'Workload of 5.1 to 7.0 METs results in cardiac symptoms, OR',
        'Evidence of cardiac hypertrophy or dilatation on echo/imaging',
        'Mild-moderate limitation - symptoms climbing stairs, brisk walking',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate',
        'OR echocardiogram showing hypertrophy/dilatation',
        'Coronary angiography if available',
      ],
    },
    {
      percent: 10,
      summary: 'Workload 7.1-10.0 METs causes symptoms OR continuous medication required',
      criteriaDescription: [
        'Workload of 7.1 to 10.0 METs results in cardiac symptoms, OR',
        'Continuous medication required for control (beta blockers, statins, nitrates, etc.)',
        'Mild limitation - symptoms only with moderate to heavy exertion',
      ],
      evidenceNeeded: [
        'Exercise stress test or medical estimate',
        'Prescription records showing continuous cardiac medications',
        'Symptom logs at various activity levels',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or symptoms only above 10 METs',
      criteriaDescription: [
        'CAD diagnosis but no symptoms at workloads up to 10 METs',
        'Normal exercise capacity despite coronary disease',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    METs: {
      term: 'METs (Metabolic Equivalents)',
      definition: 'One MET is the energy cost of standing quietly at rest. Higher METs indicate greater exertion capacity.',
      examples: [
        '1-3 METs: Eating, dressing, walking slowly around home',
        '3-5 METs: Light housework, walking 2-3 mph',
        '5-7 METs: Climbing one flight of stairs, walking 4 mph',
        '7-10 METs: Heavy housework, moderate cycling',
        '>10 METs: Vigorous exercise, running, competitive sports',
      ],
    },
    angina: {
      term: 'Angina Pectoris',
      definition: 'Chest pain or discomfort caused by reduced blood flow to the heart muscle.',
      types: [
        'Stable angina: Predictable, triggered by exertion, relieved by rest or nitroglycerin',
        'Unstable angina: Unpredictable, may occur at rest, requires urgent evaluation',
      ],
    },
    CHF: {
      term: 'Congestive Heart Failure',
      definition: 'Condition where the heart cannot pump blood efficiently, causing fluid backup in lungs and tissues.',
      symptoms: ['Shortness of breath', 'Fatigue', 'Swelling in legs/ankles', 'Persistent cough'],
    },
  },

  disclaimer: 'This analysis is based on logged CAD symptoms and any recorded METs capacity. Document angina episodes, activity limitations, and medication use. METs testing provides the most accurate rating determination.',
};

// ============================================
// PHASE 2A: MYOCARDIAL INFARCTION (DC 7006)
// ============================================

export const POST_MI_CRITERIA = {
  diagnosticCode: '7006',
  condition: 'Myocardial Infarction (Heart Attack)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7006',

  note: 'During and for 3 months following a myocardial infarction documented by laboratory tests, the rating is 100%. Thereafter, rate under the General Rating Formula for Diseases of the Heart based on METs capacity.',

  ratings: [
    {
      percent: 100,
      summary: 'During MI and for 3 months following',
      criteriaDescription: [
        'During the acute myocardial infarction period',
        'AND for three months following the MI documented by lab tests',
        'This rating is automatic during recovery period',
      ],
      evidenceNeeded: [
        'Medical records confirming MI (troponin levels, EKG changes)',
        'Hospital admission records',
        'Discharge summary with MI diagnosis',
        'Date of MI for calculating 3-month period',
      ],
    },
    {
      percent: 60,
      summary: 'Post-recovery: More than one MI OR 3.1-5.0 METs causes symptoms',
      criteriaDescription: [
        'After 3-month recovery period:',
        'History of more than one documented MI, OR',
        'Workload of 3.1 to 5.0 METs results in cardiac symptoms',
      ],
      evidenceNeeded: [
        'Records of multiple MI events',
        'OR exercise stress test results',
        'Post-MI cardiac evaluation',
      ],
    },
    {
      percent: 30,
      summary: 'Post-recovery: 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'After 3-month recovery period:',
        'Workload of 5.1 to 7.0 METs results in symptoms, OR',
        'Cardiac hypertrophy or dilatation on echocardiogram',
      ],
      evidenceNeeded: [
        'Post-MI stress test',
        'Echocardiogram results',
        'Symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Post-recovery: 7.1-10.0 METs causes symptoms OR continuous medication',
      criteriaDescription: [
        'After 3-month recovery period:',
        'Workload of 7.1 to 10.0 METs results in symptoms, OR',
        'Continuous medication required (aspirin, beta blockers, statins, ACE inhibitors)',
      ],
      evidenceNeeded: [
        'Post-MI medication list',
        'Exercise tolerance documentation',
        'Follow-up cardiac evaluations',
      ],
    },
    {
      percent: 0,
      summary: 'Post-recovery: Asymptomatic with no limitations',
      criteriaDescription: [
        'History of MI, fully recovered',
        'No symptoms at workloads up to 10 METs',
        'Normal cardiac function restored',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    myocardialInfarction: {
      term: 'Myocardial Infarction (MI)',
      definition: 'Death of heart muscle tissue due to blocked blood flow, commonly called a heart attack.',
      labMarkers: [
        'Elevated troponin levels',
        'EKG changes (ST elevation, Q waves)',
        'Imaging showing wall motion abnormalities',
      ],
    },
    recoveryPeriod: {
      term: '3-Month Recovery Period',
      definition: 'The VA provides an automatic 100% rating during the MI and for 3 months following to allow for cardiac rehabilitation and recovery.',
    },
  },

  disclaimer: 'This analysis is based on logged post-MI symptoms. Document the date of your MI, any subsequent cardiac events, and current activity limitations. Keep records of cardiac rehabilitation participation.',
};

// ============================================
// PHASE 2A: HYPERTENSIVE HEART DISEASE (DC 7007)
// ============================================

export const HYPERTENSIVE_HEART_CRITERIA = {
  diagnosticCode: '7007',
  condition: 'Hypertensive Heart Disease',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7007',

  note: 'Hypertensive heart disease requires documented hypertension with cardiac involvement. Rate under the General Rating Formula for Diseases of the Heart. Hypertension alone is rated under DC 7101.',

  ratings: [
    {
      percent: 100,
      summary: 'Documented CHF OR workload <=3.0 METs causes symptoms',
      criteriaDescription: [
        'Chronic congestive heart failure documented, OR',
        'Workload of 3.0 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope',
        'Hypertension must be documented as cause of cardiac impairment',
      ],
      evidenceNeeded: [
        'Diagnosis of CHF secondary to hypertension',
        'History of documented hypertension',
        'Exercise stress test or medical estimate',
        'Echocardiogram showing cardiac changes',
      ],
    },
    {
      percent: 60,
      summary: 'Workload 3.1-5.0 METs causes symptoms',
      criteriaDescription: [
        'Workload of 3.1 to 5.0 METs results in cardiac symptoms',
        'With documented hypertension as underlying cause',
        'Symptoms include dyspnea, fatigue, angina, dizziness',
      ],
      evidenceNeeded: [
        'Blood pressure records showing hypertension',
        'Exercise stress test results',
        'Documentation linking cardiac symptoms to hypertension',
      ],
    },
    {
      percent: 30,
      summary: 'Workload 5.1-7.0 METs causes symptoms OR cardiac hypertrophy/dilatation',
      criteriaDescription: [
        'Workload of 5.1 to 7.0 METs results in symptoms, OR',
        'Left ventricular hypertrophy (LVH) on echocardiogram, OR',
        'Cardiac dilatation documented',
        'With underlying hypertension',
      ],
      evidenceNeeded: [
        'Echocardiogram showing LVH or dilatation',
        'Blood pressure history',
        'Exercise tolerance documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Workload 7.1-10.0 METs causes symptoms OR continuous medication required',
      criteriaDescription: [
        'Workload of 7.1 to 10.0 METs results in symptoms, OR',
        'Continuous medication required for blood pressure AND cardiac control',
        'Minimal cardiac limitation with controlled hypertension',
      ],
      evidenceNeeded: [
        'Medication records',
        'Blood pressure logs',
        'Symptom documentation',
      ],
    },
    {
      percent: 0,
      summary: 'Hypertension without cardiac involvement',
      criteriaDescription: [
        'Hypertension present but no cardiac symptoms or structural changes',
        'Should be rated under DC 7101 (Hypertension) instead',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    hypertensiveHeartDisease: {
      term: 'Hypertensive Heart Disease',
      definition: 'Heart conditions caused by chronically elevated blood pressure, including left ventricular hypertrophy and heart failure.',
      manifestations: [
        'Left ventricular hypertrophy (LVH)',
        'Diastolic dysfunction',
        'Heart failure with preserved or reduced ejection fraction',
        'Coronary artery disease',
      ],
    },
    LVH: {
      term: 'Left Ventricular Hypertrophy (LVH)',
      definition: 'Thickening of the heart\'s main pumping chamber wall, often caused by chronic high blood pressure.',
    },
  },

  disclaimer: 'This analysis is based on logged hypertensive heart disease symptoms. Document both your blood pressure readings AND cardiac symptoms. The key distinction is having cardiac involvement beyond hypertension alone.',
};


// ============================================
// PHASE 2B: COLD INJURY RESIDUALS (DC 7122)
// ============================================

export const COLD_INJURY_CRITERIA = {
  diagnosticCode: '7122',
  condition: 'Cold Injury Residuals (Frostbite)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7122',

  note: 'Cold injury residuals are rated per affected body part (hand, foot, ear, nose). Each part is rated separately and combined. Amputations, peripheral neuropathy, and Raynaud\'s phenomenon are rated separately unless used to support DC 7122 rating.',

  ratings: [
    {
      percent: 30,
      summary: 'Pain/numbness/cold sensitivity PLUS two or more additional findings',
      criteriaDescription: [
        'Arthralgia or other pain, numbness, or cold sensitivity, PLUS',
        'Two or more of the following:',
        '- Tissue loss',
        '- Nail abnormalities',
        '- Color changes',
        '- Locally impaired sensation',
        '- Hyperhidrosis (excessive sweating)',
        '- X-ray abnormalities (osteoporosis, subarticular punched out lesions, or osteoarthritis)',
      ],
      evidenceNeeded: [
        'Documentation of pain, numbness, or cold sensitivity',
        'Medical evidence of at least two additional findings',
        'X-rays if bone changes present',
        'Symptom logs with specific body part identification',
      ],
    },
    {
      percent: 20,
      summary: 'Pain/numbness/cold sensitivity PLUS one additional finding',
      criteriaDescription: [
        'Arthralgia or other pain, numbness, or cold sensitivity, PLUS',
        'One of the following:',
        '- Tissue loss',
        '- Nail abnormalities',
        '- Color changes',
        '- Locally impaired sensation',
        '- Hyperhidrosis',
        '- X-ray abnormalities',
      ],
      evidenceNeeded: [
        'Documentation of primary symptoms',
        'Medical evidence of one additional finding',
        'Body part specific symptom logs',
      ],
    },
    {
      percent: 10,
      summary: 'Pain/numbness/cold sensitivity alone',
      criteriaDescription: [
        'Arthralgia or other pain, numbness, or cold sensitivity',
        'Without additional objective findings',
      ],
      evidenceNeeded: [
        'Symptom logs documenting pain, numbness, or cold sensitivity',
        'History of cold injury exposure',
      ],
    },
  ],

  definitions: {
    coldInjury: {
      term: 'Cold Injury',
      definition: 'Tissue damage from exposure to extreme cold, including frostbite and non-freezing cold injury (trench foot). Long-term effects can persist for decades.',
    },
    hyperhidrosis: {
      term: 'Hyperhidrosis',
      definition: 'Excessive sweating in the affected area, a common long-term sequela of cold injury.',
    },
    trophicChanges: {
      term: 'Trophic Changes',
      definition: 'Changes to skin, nails, and soft tissue resulting from impaired circulation and nerve damage.',
    },
  },

  disclaimer: 'Each affected body part (hand, foot, ear, nose) is rated separately and combined. Document which specific body parts are affected. Raynaud\'s syndrome should be rated separately unless used to support this rating.',
};

// ============================================
// PHASE 2B: PERIPHERAL ARTERIAL DISEASE (DC 7114)
// ============================================

export const PAD_CRITERIA = {
  diagnosticCode: '7114',
  condition: 'Peripheral Arterial Disease (Arteriosclerosis Obliterans)',
  cfrReference: '38 CFR 4.104, Diagnostic Code 7114',

  note: 'PAD is rated based on claudication distance, trophic changes, and ankle-brachial index (ABI). Each affected extremity is rated separately and combined with bilateral factor if applicable.',

  ratings: [
    {
      percent: 100,
      summary: 'Ischemic rest pain AND deep ulcers or ABI <=0.4',
      criteriaDescription: [
        'Ischemic limb pain at rest, AND',
        'Either deep ischemic ulcers OR ankle/brachial index (ABI) of 0.4 or less',
      ],
      evidenceNeeded: [
        'Documentation of rest pain (pain without activity)',
        'Wound care records showing ischemic ulcers, OR',
        'ABI measurement of 0.4 or less',
        'Vascular studies (Doppler ultrasound)',
      ],
    },
    {
      percent: 60,
      summary: 'Claudication <25 yards AND persistent coldness or ABI <=0.5',
      criteriaDescription: [
        'Claudication on walking less than 25 yards on level grade at 2 mph, AND',
        'Either persistent coldness of the extremity OR ABI of 0.5 or less',
      ],
      evidenceNeeded: [
        'Documentation of severe claudication distance',
        'Evidence of persistent coldness OR ABI <=0.5',
        'Symptom logs with walking distance documented',
      ],
    },
    {
      percent: 40,
      summary: 'Claudication 25-100 yards AND trophic changes or ABI <=0.7',
      criteriaDescription: [
        'Claudication on walking between 25 and 100 yards on level grade at 2 mph, AND',
        'Either trophic changes (thin skin, absence of hair, dystrophic nails) OR ABI of 0.7 or less',
      ],
      evidenceNeeded: [
        'Documentation of moderate claudication',
        'Photos or medical records of trophic changes, OR',
        'ABI measurement of 0.7 or less',
      ],
    },
    {
      percent: 20,
      summary: 'Claudication >100 yards AND diminished pulses or ABI <=0.9',
      criteriaDescription: [
        'Claudication on walking more than 100 yards, AND',
        'Either diminished peripheral pulses OR ABI of 0.9 or less',
      ],
      evidenceNeeded: [
        'Documentation of claudication symptoms',
        'Physical exam showing diminished pulses, OR',
        'ABI of 0.9 or less',
      ],
    },
  ],

  definitions: {
    claudication: {
      term: 'Intermittent Claudication',
      definition: 'Cramping leg pain that occurs with walking and is relieved by rest. Caused by inadequate blood flow to muscles.',
    },
    ABI: {
      term: 'Ankle-Brachial Index (ABI)',
      definition: 'Ratio of blood pressure at ankle divided by blood pressure at arm. Normal is 1.0 or greater. Lower values indicate arterial disease.',
      ranges: [
        'Normal: >=1.0',
        'Mild PAD: 0.9-0.99 (20% rating threshold)',
        'Moderate PAD: 0.7-0.89 (40% rating threshold)',
        'Moderate-Severe PAD: 0.5-0.69 (60% rating threshold)',
        'Severe PAD: <=0.4 (100% rating threshold)',
      ],
    },
    trophicChanges: {
      term: 'Trophic Changes',
      definition: 'Skin and tissue changes from poor blood flow including thin/shiny skin, hair loss on legs/feet, and thickened/dystrophic nails.',
    },
  },

  disclaimer: 'Each affected extremity is rated separately and combined. Document ABI measurements when available, as they provide objective evidence. Claudication distance should be documented consistently.',
};

// ============================================
// PHASE 10: CIRRHOSIS (DC 7312)
// ============================================

export const PERIPHERAL_ARTERIAL_DISEASE_CRITERIA = PAD_CRITERIA;

/**
 * Amputation Rating Criteria
 * Based on 38 CFR 4.71a - DC 5120-5173
 */

export const SYPHILITIC_HEART_DISEASE_CRITERIA = {
  diagnosticCode: '7004',
  condition: 'Syphilitic Heart Disease',
  cfrReference: '38 CFR § 4.104, Diagnostic Code 7004',

  note: 'Rate under the General Rating Formula for heart disease based on METs testing, ejection fraction, or symptoms. Syphilis can cause aortitis, aortic regurgitation, or coronary ostial stenosis.',

  ratings: [
    {
      percent: 100,
      summary: 'Chronic congestive heart failure, or severe limitation',
      criteriaDescription: [
        'Chronic congestive heart failure, OR',
        'Workload of 3 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope, OR',
        'Left ventricular ejection fraction less than 30%',
      ],
      evidenceNeeded: [
        'Echocardiogram showing ejection fraction < 30%',
        'Stress test showing workload ≤ 3 METs',
        'Documentation of chronic CHF',
        'Cardiology evaluation linking to syphilis',
      ],
    },
    {
      percent: 60,
      summary: 'More than one episode of CHF in past year, or moderate limitation',
      criteriaDescription: [
        'More than one episode of acute congestive heart failure in past year, OR',
        'Workload greater than 3 METs but not greater than 5 METs results in symptoms, OR',
        'Left ventricular ejection fraction of 30-50%',
      ],
      evidenceNeeded: [
        'Echocardiogram showing ejection fraction 30-50%',
        'Stress test showing workload 3-5 METs',
        'Records of CHF episodes',
        'Cardiology evaluation',
      ],
    },
    {
      percent: 30,
      summary: 'Workload 5-7 METs causes symptoms',
      criteriaDescription: [
        'Workload greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope, OR',
        'Evidence of cardiac hypertrophy or dilatation on electrocardiogram, echocardiogram, or X-ray',
      ],
      evidenceNeeded: [
        'Stress test showing workload 5-7 METs',
        'ECG, echo, or X-ray showing cardiac changes',
        'Documentation of symptoms',
      ],
    },
    {
      percent: 10,
      summary: 'Workload 7-10 METs causes symptoms',
      criteriaDescription: [
        'Workload greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope, OR',
        'Continuous medication required',
      ],
      evidenceNeeded: [
        'Stress test showing workload 7-10 METs',
        'Medication records',
        'Documentation of symptoms',
      ],
    },
  ],

  definitions: {
    'METs': 'Metabolic Equivalent of Task - measure of exercise capacity',
    'Ejection fraction': 'Percentage of blood pumped out of the heart with each beat',
    'Aortitis': 'Inflammation of the aorta, common in tertiary syphilis',
    'Aortic regurgitation': 'Leaky aortic valve allowing backflow',
  },

  disclaimer: 'Syphilitic heart disease is a complication of tertiary syphilis. Service connection requires establishing nexus between heart disease and service-connected syphilis infection.',
};

// =================================================================
// CEREBROSPINAL SYPHILIS - DC 8013
// =================================================================

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
    const isSleepRelated = getLogSymptomId(log) === 'sleep-issues' ||
        getLogSymptomId(log) === 'sleep-apnea' ||
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

  let supportedRating = 0;
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
  // Use helper function for backward compatibility with both log.symptomId and log.symptom
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
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
      // Empty metrics for consistency
      metrics: {
        totalLogs: 0,
        avgSeverity: 0,
        severeSymptoms: 0,
        hospitalized: false,
        hospitalizationCount: 0,
        dangerToSelf: false,
        dangerToOthers: false,
      },
    };
  }

  // Count by symptom type
  const symptomCounts = {};
  symptomIds.forEach(id => {
    symptomCounts[id] = relevantLogs.filter(l => getLogSymptomId(l) === id).length;
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
      l => panicSymptomIds.includes(getLogSymptomId(l))).length;
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

  let supportedRating = 0;
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

  // ===== CALCULATE METRICS FOR RATING CARD DISPLAY =====
  // Count logs with severity 8+ as severe episodes
  const severeSymptoms = relevantLogs.filter(log => log.severity >= 8).length;

  // Calculate average severity
  const logsWithSeverity = relevantLogs.filter(log => log.severity && log.severity > 0);
  const avgSeverity = logsWithSeverity.length > 0
      ? logsWithSeverity.reduce((sum, log) => sum + log.severity, 0) / logsWithSeverity.length
      : 0;

  // Check for hospitalization indicators
  const hospitalizationLogs = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('hospital') || notes.includes('inpatient') || notes.includes('admitted');
  });
  const hospitalized = hospitalizationLogs.length > 0;
  const hospitalizationCount = hospitalizationLogs.length;

  // Check for danger indicators
  const dangerToSelf = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('suicidal') || notes.includes('self-harm') || notes.includes('danger to self');
  });
  const dangerToOthers = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('homicidal') || notes.includes('danger to others') || notes.includes('violent');
  });

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
    // Metrics for rating card display
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      severeSymptoms,
      hospitalized,
      hospitalizationCount,
      dangerToSelf,
      dangerToOthers,
    },
    disclaimer: 'CRITICAL DISCLAIMER: Mental health ratings are based on professional evaluation of functional impairment in work and social settings, not symptom frequency alone. This analysis helps you understand what your documentation might support, but a comprehensive mental health evaluation is required for any rating determination. All mental health concerns should be discussed with a qualified provider.',
    crisisResources: {
      veteransCrisisLine: '988 then Press 1',
      text: '838255',
      chat: 'https://www.veteranscrisisline.net/get-help-now/chat/',
    },
  };
};

// ============================================
// ANALYSIS FUNCTIONS - MUSCULOSKELETAL CONDITIONS
// ============================================

/**
 * Analyzes Lumbosacral Strain (Low Back Pain) logs
 * NOTE: This requires clinical ROM measurements - symptom logging alone cannot determine rating
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
      CARDIORESPIRATORY_CONDITIONS.HYPERTENSION.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
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
          `${diastolic130.percentage}% of readings show diastolic >=130 mmHg`,
          `Meets "predominantly" threshold (>50% required)`,
          `${diastolic130.qualifyingReadings} of ${diastolic130.totalReadings} readings qualify`
      );
      evidence.push(`${diastolic130.qualifyingReadings} readings with diastolic >=130`);
    }

    // 40%: Diastolic predominantly 120 or more
    else {
      const diastolic120 = analyzeBloodPressurePredominance(evaluationPeriodDays, { diastolic: 120 });
      if (diastolic120.isPredominant) {
        supportedRating = '40';
        ratingRationale.push(
            `${diastolic120.percentage}% of readings show diastolic >=120 mmHg`,
            `Meets "predominantly" threshold (>50% required)`,
            `${diastolic120.qualifyingReadings} of ${diastolic120.totalReadings} readings qualify`
        );
        evidence.push(`${diastolic120.qualifyingReadings} readings with diastolic >=120`);

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
                `${diastolic110.percentage}% of readings show diastolic >=110 mmHg`,
                `Meets "predominantly" threshold (>50% required)`,
                `${diastolic110.qualifyingReadings} of ${diastolic110.totalReadings} readings qualify`
            );
            evidence.push(`${diastolic110.qualifyingReadings} readings with diastolic >=110`);
          }
          if (systolic200.isPredominant) {
            ratingRationale.push(
                `${systolic200.percentage}% of readings show systolic >=200 mmHg`,
                `Meets "predominantly" threshold (>50% required)`
            );
            evidence.push(`${systolic200.qualifyingReadings} readings with systolic >=200`);
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
                  `${diastolic100.percentage}% of readings show diastolic >=100 mmHg`,
                  `Meets "predominantly" threshold (>50% required)`,
                  `${diastolic100.qualifyingReadings} of ${diastolic100.totalReadings} readings qualify`
              );
              evidence.push(`${diastolic100.qualifyingReadings} readings with diastolic >=100`);
            }
            if (systolic160.isPredominant) {
              ratingRationale.push(
                  `${systolic160.percentage}% of readings show systolic >=160 mmHg`,
                  `Meets "predominantly" threshold (>50% required)`
              );
              evidence.push(`${systolic160.qualifyingReadings} readings with systolic >=160`);
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
                  'Has documented history of diastolic >=100 mmHg',
                  'Meets medication + history criteria for 10% rating'
              );
              evidence.push('Taking BP medication regularly');
              evidence.push('History of elevated diastolic readings');
            } else {
              gaps.push('On medication but no documented history of diastolic >=100');
              gaps.push('Need historical evidence of diastolic >=100 to support medication-based rating');
            }
          } else {
            // No rating supported
            ratingRationale.push(
                `Current readings don't meet "predominantly" threshold for any rating`,
                `Highest: Diastolic >=100 in ${diastolic100.percentage}% of readings (need >50%)`
            );
            gaps.push('Continue logging BP to establish pattern');

            if (diastolic100.percentage >= 30) {
              gaps.push(`Close to 10% rating threshold - ${diastolic100.percentage}% at diastolic >=100`);
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
    return logDate >= cutoffDate && CARDIORESPIRATORY_CONDITIONS.ASTHMA.symptomIds.includes(getLogSymptomId(log));
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

  const attackLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'asthma-attack');
  const erVisits = relevantLogs.filter(log => getLogSymptomId(log) === 'asthma-er-visit');
  const mdVisits = relevantLogs.filter(log => getLogSymptomId(log) === 'asthma-md-visit');
  const rescueInhalerUse = relevantLogs.filter(log => getLogSymptomId(log) === 'asthma-rescue-inhaler');

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
      `${mdVisitsPerMonth.toFixed(1)} physician visits per month for exacerbations (>=1/month required)`,
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

/**
 * Shared helper function for PFT-based respiratory analysis
 * Used by COPD, Chronic Bronchitis, and Emphysema
 */
const analyzeRespiratoryPFT = (logs, options, conditionConfig) => {
  const {
    evaluationPeriodDays = 90,
    profileId = null,
  } = options;

  const { conditionId, conditionName, diagnosticCode, symptomIds, criteria } = conditionConfig;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter symptom logs for this condition
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get PFT measurements from the past year
  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);

  let fev1Measurements = [];
  let fvcMeasurements = [];
  let dlcoMeasurements = [];

  try {
    fev1Measurements = getMeasurements('fev1', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
    fvcMeasurements = getMeasurements('fvc', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
    dlcoMeasurements = getMeasurements('dlco', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
  } catch (error) {
    // Measurements may not be available
  }

  if (relevantLogs.length === 0 && fev1Measurements.length === 0 && dlcoMeasurements.length === 0) {
    return {
      hasData: false,
      message: `No ${conditionName} logs or PFT measurements found`,
      supportedRating: null,
      evidence: [],
      gaps: [
        `Start logging ${conditionName} symptoms`,
        'Get pulmonary function testing (spirometry + DLCO) to establish rating',
      ],
    };
  }

  // Calculate PFT metrics
  let latestFev1Percent = null;
  let latestFev1FvcRatio = null;
  let latestDlcoPercent = null;

  // FEV-1 analysis
  if (fev1Measurements.length > 0) {
    const latestFev1 = fev1Measurements.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    if (latestFev1.values.fev1 && latestFev1.values.fev1Predicted) {
      latestFev1Percent = (latestFev1.values.fev1 / latestFev1.values.fev1Predicted) * 100;
    }

    // Calculate FEV-1/FVC ratio
    if (fvcMeasurements.length > 0) {
      const matchingFvc = fvcMeasurements.find(fvc => {
        const timeDiff = Math.abs(new Date(fvc.timestamp) - new Date(latestFev1.timestamp));
        return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (matchingFvc && latestFev1.values.fev1) {
        latestFev1FvcRatio = (latestFev1.values.fev1 / matchingFvc.values.fvc) * 100;
      }
    }
  }

  // DLCO analysis
  if (dlcoMeasurements.length > 0) {
    const latestDlco = dlcoMeasurements.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    if (latestDlco.values.dlco && latestDlco.values.dlcoPredicted) {
      latestDlcoPercent = (latestDlco.values.dlco / latestDlco.values.dlcoPredicted) * 100;
    }
  }

  // Analyze symptom patterns
  const oxygenUseLogs = relevantLogs.filter(log => log.symptomId.includes('oxygen-use'));
  const exacerbationLogs = relevantLogs.filter(log => log.symptomId.includes('exacerbation'));
  const erVisitLogs = relevantLogs.filter(log => log.symptomId.includes('er-visit'));
  const hospitalizationLogs = relevantLogs.filter(log => log.symptomId.includes('hospitalization'));

  const hasOxygenUse = oxygenUseLogs.length > 0;

  // Build evidence array
  const evidence = [];

  if (fev1Measurements.length > 0 && latestFev1Percent !== null) {
    evidence.push(`Most recent FEV-1: ${latestFev1Percent.toFixed(0)}% of predicted`);
  }

  if (latestFev1FvcRatio !== null) {
    evidence.push(`FEV-1/FVC ratio: ${latestFev1FvcRatio.toFixed(0)}%`);
  }

  if (dlcoMeasurements.length > 0 && latestDlcoPercent !== null) {
    evidence.push(`Most recent DLCO: ${latestDlcoPercent.toFixed(0)}% of predicted`);
  }

  if (hasOxygenUse) {
    evidence.push(`${oxygenUseLogs.length} supplemental oxygen use entries logged`);
  }

  if (exacerbationLogs.length > 0) {
    evidence.push(`${exacerbationLogs.length} exacerbations logged`);
  }

  if (erVisitLogs.length > 0) {
    evidence.push(`${erVisitLogs.length} ER visits documented`);
  }

  if (hospitalizationLogs.length > 0) {
    evidence.push(`${hospitalizationLogs.length} hospitalizations documented`);
  }

  if (relevantLogs.length > 0) {
    const shortnessLogs = relevantLogs.filter(log => log.symptomId.includes('shortness'));
    const coughLogs = relevantLogs.filter(log => log.symptomId.includes('cough'));
    if (shortnessLogs.length > 0) {
      evidence.push(`${shortnessLogs.length} shortness of breath episodes logged`);
    }
    if (coughLogs.length > 0) {
      evidence.push(`${coughLogs.length} cough episodes logged`);
    }
  }

  // Determine supported rating
  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Check for 100% rating indicators
  if (hasOxygenUse) {
    supportedRating = 100;
    ratingRationale = [
      'Supplemental oxygen therapy documented',
      'Oxygen therapy requirement supports 100% rating',
    ];
  } else if (latestFev1Percent !== null && latestFev1Percent < 40) {
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
  } else if (latestDlcoPercent !== null && latestDlcoPercent < 40) {
    supportedRating = 100;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (<40% required for 100%)`,
      'Diffusion capacity evidence supports 100% rating',
    ];
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
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 40 && latestDlcoPercent <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (40-55% range)`,
      'Diffusion capacity evidence supports 60% rating',
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
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 56 && latestDlcoPercent <= 65) {
    supportedRating = 30;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (56-65% range)`,
      'Diffusion capacity evidence supports 30% rating',
    ];
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
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 66 && latestDlcoPercent <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (66-80% range)`,
      'Diffusion capacity evidence supports 10% rating',
    ];
  } else if (relevantLogs.length > 0) {
    // Has symptoms but no PFT data
    supportedRating = '10-30';
    ratingRationale = [
      `${relevantLogs.length} symptom entries logged`,
      'Symptoms documented but PFT testing needed to confirm rating level',
    ];
    gaps.push('Get pulmonary function testing (FEV-1/FVC + DLCO) - required for VA rating');
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
      gaps.push('Get pulmonary function testing (FEV-1/FVC + DLCO) - required for VA rating');
      gaps.push(`Document all ${conditionName} symptoms and exacerbations`);
    }
  }

  // Add general gaps if rating could be higher
  if (supportedRating !== 100 && typeof supportedRating === 'number') {
    if (fev1Measurements.length === 0) {
      gaps.push('Get spirometry testing (FEV-1/FVC) - this is required for VA rating');
    }
    if (dlcoMeasurements.length === 0) {
      gaps.push('Get DLCO testing - important for comprehensive pulmonary evaluation');
    }
    if (!hasOxygenUse && exacerbationLogs.length > 0) {
      gaps.push('Document if supplemental oxygen is prescribed');
    }
  }

  return {
    hasData: true,
    condition: conditionName,
    diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria,
    disclaimer: criteria.disclaimer,
  };
};

/**
 * Analyze COPD symptom logs against VA rating criteria
 */

export const analyzeCOPDLogs = (logs, options = {}) => {
  return analyzeRespiratoryPFT(logs, options, {
    conditionId: 'copd',
    condition: 'Chronic Obstructive Pulmonary Disease',
    diagnosticCode: '6604',
    symptomIds: [
      'copd-shortness-breath',
      'copd-chronic-cough',
      'copd-sputum',
      'copd-wheezing',
      'copd-exacerbation',
      'copd-oxygen-use',
      'copd-er-visit',
      'copd-hospitalization',
    ],
    criteria: COPD_CRITERIA,
  });
};

/**
 * Analyze Chronic Bronchitis symptom logs against VA rating criteria
 */

export const analyzeChronicBronchitisLogs = (logs, options = {}) => {
  return analyzeRespiratoryPFT(logs, options, {
    conditionId: 'chronic-bronchitis',
    condition: 'Chronic Bronchitis',
    diagnosticCode: '6600',
    symptomIds: [
      'bronchitis-productive-cough',
      'bronchitis-sputum',
      'bronchitis-shortness-breath',
      'bronchitis-chest-discomfort',
      'bronchitis-exacerbation',
      'bronchitis-oxygen-use',
    ],
    criteria: CHRONIC_BRONCHITIS_CRITERIA,
  });
};

/**
 * Analyze Emphysema symptom logs against VA rating criteria
 */

export const analyzeEmphysemaLogs = (logs, options = {}) => {
  return analyzeRespiratoryPFT(logs, options, {
    conditionId: 'emphysema',
    condition: 'Pulmonary Emphysema',
    diagnosticCode: '6603',
    symptomIds: [
      'emphysema-shortness-breath',
      'emphysema-barrel-chest',
      'emphysema-wheezing',
      'emphysema-fatigue',
      'emphysema-oxygen-use',
      'emphysema-exacerbation',
    ],
    criteria: EMPHYSEMA_CRITERIA,
  });
};

// ============================================
// ANALYSIS FUNCTIONS - HEARING LOSS
// ============================================

/**
 * Analyzes hearing loss logs
 * Note: Hearing loss requires audiometry data for accurate rating
 */

export const analyzeBronchiectasisLogs = (logs, options = {}) => {
  const conditionCriteria = BRONCHIECTASIS_CRITERIA;
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = CARDIORESPIRATORY_CONDITIONS.BRONCHIECTASIS.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No bronchiectasis symptoms logged in evaluation period',
    };
  }

  const incapacitatingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-incapacitating');
  const infectionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-infection');
  const antibioticLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-antibiotic');
  const hemoptysisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-hemoptysis');
  const purulentSputumLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-purulent-sputum');
  const dailySputumLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-sputum');
  const weightLossLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-weight-loss');
  const anorexiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bronchiectasis-anorexia');

  const estimatedIncapacitatingWeeks = incapacitatingLogs.length;
  const hasNearConstantSymptoms = purulentSputumLogs.length >= 10 && (hemoptysisLogs.length > 0 || weightLossLogs.length > 0 || anorexiaLogs.length > 0);
  const hasContinuousAntibiotics = antibioticLogs.length >= 6;
  const hasDailyProductiveCough = dailySputumLogs.length >= 20 || purulentSputumLogs.length >= 10;
  const hasProlongedAntibiotics = antibioticLogs.length >= 3;
  const hasIntermittentInfections = infectionLogs.length >= 2 || antibioticLogs.length >= 2;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];
  const evidence = [];

  if (incapacitatingLogs.length > 0) evidence.push(`${incapacitatingLogs.length} incapacitating episodes (~${estimatedIncapacitatingWeeks} weeks)`);
  if (infectionLogs.length > 0) evidence.push(`${infectionLogs.length} respiratory infections documented`);
  if (antibioticLogs.length > 0) evidence.push(`${antibioticLogs.length} antibiotic courses recorded`);
  if (hemoptysisLogs.length > 0) evidence.push(`${hemoptysisLogs.length} hemoptysis episodes`);

  if (estimatedIncapacitatingWeeks >= 6) {
    supportedRating = 100;
    ratingRationale = [`${estimatedIncapacitatingWeeks} weeks incapacitating episodes (6+ weeks criteria)`];
  } else if (estimatedIncapacitatingWeeks >= 4 || (hasNearConstantSymptoms && hasContinuousAntibiotics)) {
    supportedRating = 60;
    ratingRationale = [estimatedIncapacitatingWeeks >= 4 ? `${estimatedIncapacitatingWeeks} weeks incapacitating episodes` : 'Near-constant symptoms with continuous antibiotics'];
  } else if (estimatedIncapacitatingWeeks >= 2 || (hasDailyProductiveCough && hasProlongedAntibiotics)) {
    supportedRating = 30;
    ratingRationale = [estimatedIncapacitatingWeeks >= 2 ? `${estimatedIncapacitatingWeeks} weeks incapacitating episodes` : 'Daily productive cough with prolonged antibiotics'];
  } else if (hasIntermittentInfections) {
    supportedRating = 10;
    ratingRationale = ['Intermittent infections requiring antibiotics 2+ times/year'];
  }

  if (incapacitatingLogs.length === 0) gaps.push('Document incapacitating episodes (requires bedrest + physician treatment)');
  if (antibioticLogs.length < 2) gaps.push('Log all antibiotic courses with duration');
  if (supportedRating < 100) gaps.push('Consider PFTs - can rate as DC 6600 (chronic bronchitis)');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      incapacitatingEpisodes: incapacitatingLogs.length,
      estimatedIncapacitatingWeeks,
      infectionEpisodes: infectionLogs.length,
      antibioticCourses: antibioticLogs.length,
      hemoptysisEpisodes: hemoptysisLogs.length,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - PULMONARY FIBROSIS (DC 6825)
// Phase 11 - Uses Interstitial Lung Disease formula (FVC/DLCO based)
// ============================================

/**
 * Analyze Pulmonary Fibrosis symptom logs against VA rating criteria
 * DC 6825 - Uses General Rating Formula for Interstitial Lung Disease
 */

export const analyzePulmonaryFibrosisLogs = (logs, options = {}) => {
  const conditionCriteria = PULMONARY_FIBROSIS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CARDIORESPIRATORY_CONDITIONS.PULMONARY_FIBROSIS.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  const fvcMeasurements = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.type === 'measurement' && log.measurementType === 'fvc';
  });

  const dlcoMeasurements = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && log.type === 'measurement' && log.measurementType === 'dlco';
  });

  if (relevantLogs.length === 0 && fvcMeasurements.length === 0 && dlcoMeasurements.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No pulmonary fibrosis symptoms or PFT measurements logged',
    };
  }

  const oxygenUseLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pf-oxygen-use');
  const exacerbationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pf-exacerbation');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pf-hospitalization');
  const hasOxygenUse = oxygenUseLogs.length > 0;

  let fvcPercent = null;
  if (fvcMeasurements.length > 0) {
    const latestFVC = fvcMeasurements[fvcMeasurements.length - 1];
    if (latestFVC.values?.fvc && latestFVC.values?.fvcPredicted) {
      fvcPercent = (latestFVC.values.fvc / latestFVC.values.fvcPredicted) * 100;
    }
  }

  let dlcoPercent = null;
  if (dlcoMeasurements.length > 0) {
    const latestDLCO = dlcoMeasurements[dlcoMeasurements.length - 1];
    if (latestDLCO.values?.dlco && latestDLCO.values?.dlcoPredicted) {
      dlcoPercent = (latestDLCO.values.dlco / latestDLCO.values.dlcoPredicted) * 100;
    }
  }

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];
  const evidence = [];

  if (relevantLogs.length > 0) evidence.push(`${relevantLogs.length} symptom logs in ${evaluationPeriodDays} days`);
  if (fvcPercent !== null) evidence.push(`FVC: ${fvcPercent.toFixed(0)}% predicted`);
  if (dlcoPercent !== null) evidence.push(`DLCO: ${dlcoPercent.toFixed(0)}% predicted`);
  if (hasOxygenUse) evidence.push('Supplemental oxygen use documented');

  // Rating determination based on ILD formula (FVC/DLCO)
  if (hasOxygenUse || (fvcPercent !== null && fvcPercent < 50) || (dlcoPercent !== null && dlcoPercent < 40)) {
    supportedRating = 100;
    ratingRationale = [];
    if (hasOxygenUse) ratingRationale.push('Requires supplemental oxygen therapy');
    if (fvcPercent !== null && fvcPercent < 50) ratingRationale.push(`FVC ${fvcPercent.toFixed(0)}% (<50% criteria)`);
    if (dlcoPercent !== null && dlcoPercent < 40) ratingRationale.push(`DLCO ${dlcoPercent.toFixed(0)}% (<40% criteria)`);
  } else if ((fvcPercent !== null && fvcPercent >= 50 && fvcPercent <= 64) || (dlcoPercent !== null && dlcoPercent >= 40 && dlcoPercent <= 55)) {
    supportedRating = 60;
    if (fvcPercent !== null && fvcPercent >= 50 && fvcPercent <= 64) ratingRationale.push(`FVC ${fvcPercent.toFixed(0)}% (50-64% criteria)`);
    if (dlcoPercent !== null && dlcoPercent >= 40 && dlcoPercent <= 55) ratingRationale.push(`DLCO ${dlcoPercent.toFixed(0)}% (40-55% criteria)`);
  } else if ((fvcPercent !== null && fvcPercent >= 65 && fvcPercent <= 74) || (dlcoPercent !== null && dlcoPercent >= 56 && dlcoPercent <= 65)) {
    supportedRating = 30;
    if (fvcPercent !== null && fvcPercent >= 65 && fvcPercent <= 74) ratingRationale.push(`FVC ${fvcPercent.toFixed(0)}% (65-74% criteria)`);
    if (dlcoPercent !== null && dlcoPercent >= 56 && dlcoPercent <= 65) ratingRationale.push(`DLCO ${dlcoPercent.toFixed(0)}% (56-65% criteria)`);
  } else if ((fvcPercent !== null && fvcPercent >= 75 && fvcPercent <= 80) || (dlcoPercent !== null && dlcoPercent >= 66 && dlcoPercent <= 80)) {
    supportedRating = 10;
    if (fvcPercent !== null && fvcPercent >= 75 && fvcPercent <= 80) ratingRationale.push(`FVC ${fvcPercent.toFixed(0)}% (75-80% criteria)`);
    if (dlcoPercent !== null && dlcoPercent >= 66 && dlcoPercent <= 80) ratingRationale.push(`DLCO ${dlcoPercent.toFixed(0)}% (66-80% criteria)`);
  } else if (fvcPercent === null && dlcoPercent === null) {
    supportedRating = 'Requires PFT';
    ratingRationale = ['Pulmonary function tests (FVC and DLCO) required for rating'];
  } else {
    supportedRating = 0;
    ratingRationale = ['PFT values above compensable thresholds'];
  }

  if (fvcMeasurements.length === 0) gaps.push('Get FVC (Forced Vital Capacity) testing - required for ILD rating');
  if (dlcoMeasurements.length === 0) gaps.push('Get DLCO (Diffusion Capacity) testing - important for ILD');
  if (!hasOxygenUse && exacerbationLogs.length > 0) gaps.push('Document if supplemental oxygen is prescribed');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating?.toString() || 'Requires PFT',
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      fvcPercent: fvcPercent ? fvcPercent.toFixed(0) : null,
      dlcoPercent: dlcoPercent ? dlcoPercent.toFixed(0) : null,
      oxygenUseDays: oxygenUseLogs.length,
      exacerbations: exacerbationLogs.length,
      hospitalizations: hospitalizationLogs.length,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - SARCOIDOSIS (DC 6846)
// Phase 11 - Specific criteria OR rate as chronic bronchitis (DC 6600)
// ============================================

/**
 * Analyze Sarcoidosis symptom logs against VA rating criteria
 * DC 6846 - Has specific rating criteria based on treatment requirements
 */

export const analyzeSarcoidosisLogs = (logs, options = {}) => {
  const conditionCriteria = SARCOIDOSIS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = CARDIORESPIRATORY_CONDITIONS.SARCOIDOSIS.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: 'No sarcoidosis symptoms logged in evaluation period',
    };
  }

  const dyspneaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-shortness-breath');
  const feverLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-fever');
  const nightSweatsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-night-sweats');
  const weightLossLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-weight-loss');
  const corticosteroidLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-corticosteroid');
  const cardiacLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-cardiac');
  const skinLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-skin-lesions');
  const eyeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'sarcoid-eye-symptoms');

  const hasSystemicSymptoms = feverLogs.length > 0 && nightSweatsLogs.length > 0 && weightLossLogs.length > 0;
  const hasCardiacInvolvement = cardiacLogs.length > 0;
  const hasPulmonarySymptoms = dyspneaLogs.length > 0;
  const hasCorticosteroidUse = corticosteroidLogs.length > 0;
  const frequentCorticosteroidUse = corticosteroidLogs.length >= 10;
  const hasExtraPulmonary = skinLogs.length > 0 || eyeLogs.length > 0 || cardiacLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];
  const evidence = [];

  if (dyspneaLogs.length > 0) evidence.push(`${dyspneaLogs.length} days with shortness of breath`);
  if (corticosteroidLogs.length > 0) evidence.push(`${corticosteroidLogs.length} days on corticosteroids`);
  if (hasSystemicSymptoms) evidence.push('Systemic symptoms (fever, night sweats, weight loss) documented');
  if (hasCardiacInvolvement) evidence.push('Cardiac involvement documented');
  if (hasExtraPulmonary) evidence.push('Extra-pulmonary involvement documented');

  // Rating determination
  if (hasCardiacInvolvement || hasSystemicSymptoms) {
    supportedRating = 100;
    ratingRationale = [];
    if (hasCardiacInvolvement) ratingRationale.push('Cardiac involvement documented');
    if (hasSystemicSymptoms) ratingRationale.push('Progressive disease with fever, night sweats, and weight loss');
  } else if (frequentCorticosteroidUse && hasPulmonarySymptoms) {
    supportedRating = 60;
    ratingRationale = ['Pulmonary involvement requiring frequent/high-dose corticosteroids'];
  } else if (hasCorticosteroidUse && hasPulmonarySymptoms) {
    supportedRating = 30;
    ratingRationale = ['Pulmonary involvement with persistent symptoms requiring corticosteroids'];
  } else if (hasPulmonarySymptoms) {
    supportedRating = 0;
    ratingRationale = ['Pulmonary symptoms present but no corticosteroid treatment documented'];
    gaps.push('Document corticosteroid use if prescribed');
  }

  if (!hasCorticosteroidUse) gaps.push('Log corticosteroid use (prednisone, etc.) - key rating factor');
  if (!hasPulmonarySymptoms) gaps.push('Document pulmonary symptoms (shortness of breath, cough)');
  if (hasExtraPulmonary) gaps.push('Extra-pulmonary sarcoidosis should be rated separately under specific body system');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      dyspneaDays: dyspneaLogs.length,
      corticosteroidDays: corticosteroidLogs.length,
      hasSystemicSymptoms,
      hasCardiacInvolvement,
      hasExtraPulmonary,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};


// ============================================
// PHASE 1A: MULTIPLE SCLEROSIS ANALYSIS (DC 8018)
// ============================================

/**
 * Analyze Multiple Sclerosis symptom logs against VA rating criteria
 * DC 8018 - Minimum rating 30%, higher ratings based on specific residuals
 */

export const analyzeCardiomyopathyLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'cardiomyopathy-breathlessness', 'cardiomyopathy-fatigue', 'cardiomyopathy-edema',
    'cardiomyopathy-palpitations', 'cardiomyopathy-chest-pain', 'cardiomyopathy-dizziness',
    'cardiomyopathy-syncope', 'cardiomyopathy-activity-limitation',
    'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
    'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const efReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ejection-fraction' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (relevantLogs.length === 0 && metsReadings.length === 0 && efReadings.length === 0) {
    return {
      hasData: false,
      condition: 'Cardiomyopathy',
      diagnosticCode: '7020',
      message: 'No cardiomyopathy logs found',
      supportedRating: null,
      ratingRationale: [],
      evidenceGaps: ['Start logging cardiomyopathy symptoms and record METs capacity from stress tests'],
      metrics: { totalLogs: 0 },
    };
  }

  const breathlessnessLogs = relevantLogs.filter(log =>
      ['cardiomyopathy-breathlessness', 'cardiac-breathlessness'].includes(getLogSymptomId(log))
  );
  const fatigueLogs = relevantLogs.filter(log =>
      ['cardiomyopathy-fatigue', 'cardiac-fatigue'].includes(getLogSymptomId(log))
  );
  const syncopeLogs = relevantLogs.filter(log =>
      ['cardiomyopathy-syncope', 'cardiac-syncope'].includes(getLogSymptomId(log))
  );
  const edemaLogs = relevantLogs.filter(log =>
      ['cardiomyopathy-edema', 'cardiac-edema'].includes(getLogSymptomId(log))
  );

  let lowestMets = null;
  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => parseFloat(m.values?.mets_level || 99)));
  }

  let hasHypertrophyOrDilatation = false;
  let latestEF = null;
  if (efReadings.length > 0) {
    latestEF = efReadings[efReadings.length - 1];
    if (latestEF.values?.hypertrophy || latestEF.values?.dilatation) {
      hasHypertrophyOrDilatation = true;
    }
  }

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (lowestMets !== null) {
    if (lowestMets <= 3.0) {
      supportedRating = 100;
      rationale = [`METs capacity <=3.0 (${lowestMets} METs documented)`, 'Severely limited functional capacity supports 100% rating'];
    } else if (lowestMets <= 5.0) {
      supportedRating = 60;
      rationale = [`METs capacity 3.1-5.0 (${lowestMets} METs documented)`, 'Moderately limited functional capacity supports 60% rating'];
    } else if (lowestMets <= 7.0 || hasHypertrophyOrDilatation) {
      supportedRating = 30;
      rationale = [lowestMets <= 7.0 ? `METs capacity 5.1-7.0 (${lowestMets} METs)` : 'Cardiac hypertrophy/dilatation documented', 'Pattern supports 30% rating'];
    } else if (lowestMets <= 10.0) {
      supportedRating = 10;
      rationale = [`METs capacity 7.1-10.0 (${lowestMets} METs documented)`, 'Mild limitation supports 10% rating'];
    }
  } else if (hasHypertrophyOrDilatation) {
    supportedRating = 30;
    rationale = ['Cardiac hypertrophy or dilatation documented', 'Supports 30% rating even without METs testing'];
  } else if (relevantLogs.length >= 10) {
    supportedRating = 10;
    rationale = ['Cardiac symptoms documented', 'METs testing recommended for accurate rating'];
  }

  if (metsReadings.length === 0) evidenceGaps.push('No METs capacity documented - request exercise stress test');
  if (efReadings.length === 0) evidenceGaps.push('No ejection fraction documented - echocardiogram recommended');

  return {
    hasData: true,
    condition: 'Cardiomyopathy',
    diagnosticCode: '7020',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      breathlessnessCount: breathlessnessLogs.length,
      fatigueCount: fatigueLogs.length,
      syncopeCount: syncopeLogs.length,
      edemaCount: edemaLogs.length,
      metsLevel: lowestMets,
      ejectionFraction: latestEF?.values?.ef_percent || null,
      hasHypertrophyOrDilatation,
    },
    criteria: CARDIOMYOPATHY_CRITERIA,
  };
};

/**
 * Analyze Coronary Artery Disease (CAD) symptom logs (DC 7005)
 * Uses General Rating Formula for Diseases of the Heart (METs-based)
 */

export const analyzeSVTLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'svt-episode', 'svt-treatment-iv', 'svt-treatment-cardioversion', 'svt-treatment-ablation',
    'svt-vagal-maneuver', 'svt-oral-medication',
    'arrhythmia-palpitations', 'arrhythmia-racing-heart', 'arrhythmia-skipped-beats',
    'arrhythmia-dizziness', 'arrhythmia-syncope', 'arrhythmia-chest-discomfort'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Supraventricular Tachycardia',
      diagnosticCode: '7010',
      message: 'No SVT logs found',
      supportedRating: null,
      ratingRationale: [],
      evidenceGaps: ['Start logging SVT episodes and any treatments required'],
      metrics: { totalLogs: 0 },
    };
  }

  const episodeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-episode');
  const ivTreatmentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-treatment-iv');
  const cardioversionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-treatment-cardioversion');
  const ablationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-treatment-ablation');
  const vagalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-vagal-maneuver');
  const oralMedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'svt-oral-medication');

  const treatmentInterventions = ivTreatmentLogs.length + cardioversionLogs.length + ablationLogs.length;

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (treatmentInterventions >= 5) {
    supportedRating = 30;
    rationale = [`${treatmentInterventions} treatment interventions documented`, 'Pattern supports 30% rating (5+ interventions/year)'];
  } else if (treatmentInterventions >= 1 || oralMedLogs.length > 0 || vagalLogs.length > 0) {
    supportedRating = 10;
    rationale = [];
    if (treatmentInterventions >= 1) rationale.push(`${treatmentInterventions} treatment intervention(s) documented`);
    if (oralMedLogs.length > 0) rationale.push('Oral medication use documented');
    if (vagalLogs.length > 0) rationale.push('Vagal maneuver use documented');
    rationale.push('Pattern supports 10% rating');
  }

  if (episodeLogs.length === 0) evidenceGaps.push('Log SVT episodes with ECG confirmation if available');
  if (treatmentInterventions === 0 && oralMedLogs.length === 0) {
    evidenceGaps.push('Document any treatments required (IV meds, cardioversion, ablation, oral meds)');
  }

  return {
    hasData: true,
    condition: 'Supraventricular Tachycardia',
    diagnosticCode: '7010',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      episodeCount: episodeLogs.length,
      treatmentInterventions,
      ivTreatments: ivTreatmentLogs.length,
      cardioversions: cardioversionLogs.length,
      ablations: ablationLogs.length,
      vagalManeuvers: vagalLogs.length,
      oralMedicationLogs: oralMedLogs.length,
    },
    criteria: SVT_CRITERIA,
  };
};

/**
 * Analyze Ventricular Arrhythmia symptom logs (DC 7011)
 */

export const analyzeVentricularArrhythmiaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'ventricular-arrhythmia-episode', 'ventricular-arrhythmia-hospitalization',
    'aicd-implant', 'aicd-shock',
    'arrhythmia-palpitations', 'arrhythmia-racing-heart', 'arrhythmia-syncope'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Ventricular Arrhythmias',
      diagnosticCode: '7011',
      message: 'No ventricular arrhythmia logs found',
      supportedRating: null,
      ratingRationale: [],
      evidenceGaps: ['Start logging ventricular arrhythmia episodes and any AICD events'],
      metrics: { totalLogs: 0 },
    };
  }

  const episodeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ventricular-arrhythmia-episode');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ventricular-arrhythmia-hospitalization');
  const aicdImplantLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aicd-implant');
  const aicdShockLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aicd-shock');

  const hasAICD = aicdImplantLogs.length > 0;

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (hasAICD || hospitalizationLogs.length > 0) {
    supportedRating = 100;
    rationale = [];
    if (hasAICD) rationale.push('AICD (implantable defibrillator) in place');
    if (hospitalizationLogs.length > 0) rationale.push(`${hospitalizationLogs.length} hospitalization(s) for ventricular arrhythmia`);
    rationale.push('100% rating applies with AICD or during/following hospitalization');
  } else if (episodeLogs.length > 0) {
    supportedRating = 10;
    rationale = ['Ventricular arrhythmia episodes documented', 'Rate under General Rating Formula after stabilization'];
  }

  if (!hasAICD && hospitalizationLogs.length === 0) {
    evidenceGaps.push('Document AICD implant or hospitalizations for 100% rating');
  }
  if (aicdShockLogs.length > 0) {
    rationale.push(`${aicdShockLogs.length} AICD shock(s) delivered`);
  }

  return {
    hasData: true,
    condition: 'Ventricular Arrhythmias',
    diagnosticCode: '7011',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      episodeCount: episodeLogs.length,
      hospitalizations: hospitalizationLogs.length,
      hasAICD,
      aicdShocks: aicdShockLogs.length,
    },
    criteria: VENTRICULAR_ARRHYTHMIA_CRITERIA,
  };
};

/**
 * Analyze Pericarditis symptom logs (DC 7002)
 */

export const analyzePericarditisLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'pericarditis-chest-pain', 'pericarditis-pain-breathing', 'pericarditis-pain-lying-down',
    'pericarditis-fever', 'pericarditis-palpitations', 'pericarditis-shortness-breath',
    'pericarditis-active-infection', 'pericarditis-effusion'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Pericarditis',
      diagnosticCode: '7002',
      message: 'No pericarditis logs found',
      supportedRating: null,
      ratingRationale: [],
      evidenceGaps: ['Start logging pericarditis symptoms including chest pain and active infection periods'],
      metrics: { totalLogs: 0 },
    };
  }

  const activeInfectionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pericarditis-active-infection');
  const chestPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pericarditis-chest-pain');
  const effusionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pericarditis-effusion');

  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  let lowestMets = null;
  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => parseFloat(m.values?.mets_level || 99)));
  }

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // Check for active infection (recent logs within 90 days suggest active)
  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - 90);
  const recentActiveInfection = activeInfectionLogs.some(log => new Date(log.timestamp) >= recentCutoff);

  if (recentActiveInfection) {
    supportedRating = 100;
    rationale = ['Active pericarditis infection documented', '100% rating during active infection and 3 months post-treatment'];
  } else if (lowestMets !== null) {
    if (lowestMets <= 5.0) {
      supportedRating = 60;
      rationale = [`Post-active: METs ${lowestMets} (3.1-5.0 range)`, 'Supports 60% rating'];
    } else if (lowestMets <= 7.0) {
      supportedRating = 30;
      rationale = [`Post-active: METs ${lowestMets} (5.1-7.0 range)`, 'Supports 30% rating'];
    } else if (lowestMets <= 10.0) {
      supportedRating = 10;
      rationale = [`Post-active: METs ${lowestMets} (7.1-10.0 range)`, 'Supports 10% rating'];
    }
  } else if (chestPainLogs.length > 0 || effusionLogs.length > 0) {
    supportedRating = 10;
    rationale = ['Pericarditis symptoms documented', 'METs testing needed for accurate post-active rating'];
  }

  if (metsReadings.length === 0 && !recentActiveInfection) {
    evidenceGaps.push('METs capacity needed for post-active pericarditis rating');
  }
  if (activeInfectionLogs.length === 0) {
    evidenceGaps.push('Document active infection periods for 100% rating eligibility');
  }

  return {
    hasData: true,
    condition: 'Pericarditis',
    diagnosticCode: '7002',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      activeInfectionLogs: activeInfectionLogs.length,
      chestPainLogs: chestPainLogs.length,
      effusionLogs: effusionLogs.length,
      metsLevel: lowestMets,
      recentActiveInfection,
    },
    criteria: PERICARDITIS_CRITERIA,
  };
};

/**
 * Analyze Post-Phlebitic Syndrome symptom logs (DC 7121)
 */

export const analyzePostPhlebiticLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'post-phlebitic-edema', 'post-phlebitic-pain', 'post-phlebitic-aching',
    'post-phlebitic-pigmentation', 'post-phlebitic-eczema', 'post-phlebitic-ulcer',
    'post-phlebitic-induration', 'post-phlebitic-pain-rest'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Post-Phlebitic Syndrome',
      diagnosticCode: '7121',
      message: 'No post-phlebitic syndrome logs found',
      supportedRating: null,
      ratingRationale: [],
      evidenceGaps: ['Start logging post-phlebitic symptoms including edema, skin changes, and ulcers'],
      metrics: { totalLogs: 0 },
    };
  }

  const edemaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-edema');
  const pigmentationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-pigmentation');
  const eczemaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-eczema');
  const ulcerLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-ulcer');
  const painRestLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-pain-rest');
  const achingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'post-phlebitic-aching');

  const hasSkinChanges = pigmentationLogs.length > 0 || eczemaLogs.length > 0;

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (painRestLogs.length >= 30 && edemaLogs.length >= 30) {
    supportedRating = 100;
    rationale = ['Constant pain at rest with massive edema documented', 'Pattern supports 100% rating'];
  } else if (ulcerLogs.length >= 5 && edemaLogs.length >= 10 && hasSkinChanges) {
    supportedRating = 60;
    rationale = ['Persistent edema, skin changes, and persistent ulceration', 'Pattern supports 60% rating'];
  } else if (edemaLogs.length >= 10 && hasSkinChanges) {
    supportedRating = 40;
    rationale = ['Persistent edema with stasis pigmentation/eczema', 'Pattern supports 40% rating'];
  } else if (edemaLogs.length >= 5) {
    supportedRating = 20;
    rationale = ['Persistent edema documented', 'Pattern supports 20% rating'];
  } else if (achingLogs.length > 0 || edemaLogs.length > 0) {
    supportedRating = 10;
    rationale = ['Intermittent symptoms documented', 'Pattern supports 10% rating'];
  }

  evidenceGaps.push('Track symptoms separately for each leg if bilateral');
  if (ulcerLogs.length === 0) evidenceGaps.push('Document any venous ulcers - significantly affects rating');
  if (!hasSkinChanges) evidenceGaps.push('Document skin pigmentation changes or stasis eczema');

  return {
    hasData: true,
    condition: 'Post-Phlebitic Syndrome',
    diagnosticCode: '7121',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      edemaCount: edemaLogs.length,
      pigmentationCount: pigmentationLogs.length,
      eczemaCount: eczemaLogs.length,
      ulcerCount: ulcerLogs.length,
      painAtRestCount: painRestLogs.length,
      achingCount: achingLogs.length,
    },
    criteria: POST_PHLEBITIC_CRITERIA,
  };
};


// ============================================
// PHASE 10: DIGESTIVE ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze Cirrhosis symptom logs (DC 7312)
 */

export const analyzeCADLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'cad-angina-stable', 'cad-angina-unstable', 'cad-dyspnea-exertion', 'cad-dyspnea-rest',
    'cad-fatigue', 'cad-dizziness', 'cad-syncope', 'cad-palpitations', 'cad-diaphoresis',
    'cad-nausea', 'cad-activity-limitation', 'cad-nitroglycerin-use', 'cad-hospitalization',
    'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
    'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get METs readings from measurements
  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const efReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ejection-fraction' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (relevantLogs.length === 0 && metsReadings.length === 0 && efReadings.length === 0) {
    return {
      hasData: false,
      condition: 'Coronary Artery Disease',
      diagnosticCode: '7005',
      message: 'No CAD symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging CAD symptoms and record METs capacity from stress tests'],
      metrics: { totalLogs: 0 },
    };
  }

  // Categorize symptoms
  const anginaLogs = relevantLogs.filter(log =>
      ['cad-angina-stable', 'cad-angina-unstable', 'cardiac-angina'].includes(getLogSymptomId(log))
  );
  const unstableAnginaLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'cad-angina-unstable'
  );
  const dyspneaLogs = relevantLogs.filter(log =>
      ['cad-dyspnea-exertion', 'cad-dyspnea-rest', 'cardiac-breathlessness'].includes(getLogSymptomId(log))
  );
  const dyspneaRestLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'cad-dyspnea-rest'
  );
  const syncopeLogs = relevantLogs.filter(log =>
      ['cad-syncope', 'cardiac-syncope'].includes(getLogSymptomId(log))
  );
  const nitroLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'cad-nitroglycerin-use'
  );
  const hospitalizationLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'cad-hospitalization'
  );

  // Get lowest METs if available
  let lowestMets = null;
  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => parseFloat(m.values?.mets_level || 99)));
  }

  // Check for hypertrophy/dilatation from EF readings
  let hasHypertrophyOrDilatation = false;
  let latestEF = null;
  if (efReadings.length > 0) {
    latestEF = efReadings[efReadings.length - 1];
    if (latestEF.values?.hypertrophy || latestEF.values?.dilatation) {
      hasHypertrophyOrDilatation = true;
    }
  }

  // Determine rating based on METs and symptoms
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // Check for CHF indicators (supports 100%)
  const hasCHFIndicators = dyspneaRestLogs.length > 0 &&
      (relevantLogs.filter(log => ['cad-fatigue', 'cardiac-fatigue'].includes(getLogSymptomId(log))).length > 5 ||
          relevantLogs.filter(log => ['cardiac-edema', 'hhd-edema'].includes(getLogSymptomId(log))).length > 0);

  if (lowestMets !== null) {
    if (lowestMets <= 3.0 || hasCHFIndicators) {
      supportedRating = 100;
      rationale = [
        lowestMets <= 3.0 ? `METs capacity <=3.0 (${lowestMets} METs documented)` : 'Symptoms consistent with CHF (dyspnea at rest, significant fatigue)',
        'Severely limited functional capacity supports 100% rating'
      ];
    } else if (lowestMets <= 5.0) {
      supportedRating = 60;
      rationale = [`METs capacity 3.1-5.0 (${lowestMets} METs documented)`, 'Moderate limitation supports 60% rating'];
    } else if (lowestMets <= 7.0 || hasHypertrophyOrDilatation) {
      supportedRating = 30;
      rationale = [
        lowestMets <= 7.0 ? `METs capacity 5.1-7.0 (${lowestMets} METs)` : 'Cardiac hypertrophy/dilatation documented',
        'Pattern supports 30% rating'
      ];
    } else if (lowestMets <= 10.0) {
      supportedRating = 10;
      rationale = [`METs capacity 7.1-10.0 (${lowestMets} METs documented)`, 'Mild limitation supports 10% rating'];
    }
  } else if (hasCHFIndicators) {
    supportedRating = 100;
    rationale = ['Symptoms consistent with CHF documented', 'METs testing recommended to confirm rating'];
  } else if (hasHypertrophyOrDilatation) {
    supportedRating = 30;
    rationale = ['Cardiac hypertrophy or dilatation documented', 'Supports 30% rating'];
  } else if (unstableAnginaLogs.length > 0 || hospitalizationLogs.length > 0) {
    supportedRating = 60;
    rationale = [
      unstableAnginaLogs.length > 0 ? `${unstableAnginaLogs.length} unstable angina episodes logged` : '',
      hospitalizationLogs.length > 0 ? `${hospitalizationLogs.length} cardiac hospitalizations` : '',
      'Significant cardiac events suggest at least 60% - METs testing recommended'
    ].filter(Boolean);
  } else if (anginaLogs.length >= 5 || nitroLogs.length >= 3) {
    supportedRating = 30;
    rationale = [
      anginaLogs.length >= 5 ? `${anginaLogs.length} angina episodes documented` : '',
      nitroLogs.length >= 3 ? `Nitroglycerin used ${nitroLogs.length} times` : '',
      'Pattern suggests at least 30% - METs testing recommended'
    ].filter(Boolean);
  } else if (relevantLogs.length >= 10) {
    supportedRating = 10;
    rationale = ['CAD symptoms documented', 'Continuous medication likely required - confirms 10% minimum'];
  }

  // Add evidence gaps
  if (metsReadings.length === 0) evidenceGaps.push('No METs capacity documented - request exercise stress test');
  if (efReadings.length === 0) evidenceGaps.push('No ejection fraction documented - echocardiogram recommended');
  if (anginaLogs.length === 0 && relevantLogs.length > 0) evidenceGaps.push('Document angina episodes specifically for stronger evidence');

  return {
    hasData: true,
    condition: 'Coronary Artery Disease',
    diagnosticCode: '7005',
    cfrReference: '38 CFR 4.104',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      anginaCount: anginaLogs.length,
      unstableAnginaCount: unstableAnginaLogs.length,
      dyspneaCount: dyspneaLogs.length,
      syncopeCount: syncopeLogs.length,
      nitroUseCount: nitroLogs.length,
      hospitalizationCount: hospitalizationLogs.length,
      metsLevel: lowestMets,
      ejectionFraction: latestEF?.values?.ef_percent || null,
      hasHypertrophyOrDilatation,
    },
    criteria: CAD_CRITERIA,
  };
};

/**
 * Analyze Post-Myocardial Infarction symptom logs (DC 7006)
 * 100% rating during MI and 3 months following, then METs-based
 */

export const analyzePostMILogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365, miDate = null } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'post-mi-chest-pain', 'post-mi-dyspnea-exertion', 'post-mi-dyspnea-rest', 'post-mi-fatigue',
    'post-mi-weakness', 'post-mi-dizziness', 'post-mi-syncope', 'post-mi-palpitations',
    'post-mi-edema', 'post-mi-activity-limitation', 'post-mi-anxiety', 'post-mi-hospitalization',
    'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
    'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get METs and EF readings
  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const efReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ejection-fraction' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (relevantLogs.length === 0 && metsReadings.length === 0 && efReadings.length === 0) {
    return {
      hasData: false,
      condition: 'Myocardial Infarction (Post-MI)',
      diagnosticCode: '7006',
      message: 'No post-MI symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging post-MI symptoms and record METs capacity'],
      metrics: { totalLogs: 0 },
    };
  }

  // Check if within 3-month recovery period
  let isInRecoveryPeriod = false;
  if (miDate) {
    const miDateObj = new Date(miDate);
    const threeMonthsAfterMI = new Date(miDateObj);
    threeMonthsAfterMI.setMonth(threeMonthsAfterMI.getMonth() + 3);
    isInRecoveryPeriod = new Date() <= threeMonthsAfterMI;
  }

  // Categorize symptoms
  const chestPainLogs = relevantLogs.filter(log =>
      ['post-mi-chest-pain', 'cardiac-angina'].includes(getLogSymptomId(log))
  );
  const dyspneaLogs = relevantLogs.filter(log =>
      ['post-mi-dyspnea-exertion', 'post-mi-dyspnea-rest', 'cardiac-breathlessness'].includes(getLogSymptomId(log))
  );
  const fatigueLogs = relevantLogs.filter(log =>
      ['post-mi-fatigue', 'cardiac-fatigue'].includes(getLogSymptomId(log))
  );
  const syncopeLogs = relevantLogs.filter(log =>
      ['post-mi-syncope', 'cardiac-syncope'].includes(getLogSymptomId(log))
  );
  const edemaLogs = relevantLogs.filter(log =>
      ['post-mi-edema', 'cardiac-edema'].includes(getLogSymptomId(log))
  );
  const hospitalizationLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'post-mi-hospitalization'
  );

  // Get lowest METs
  let lowestMets = null;
  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => parseFloat(m.values?.mets_level || 99)));
  }

  // Check for hypertrophy/dilatation
  let hasHypertrophyOrDilatation = false;
  let latestEF = null;
  if (efReadings.length > 0) {
    latestEF = efReadings[efReadings.length - 1];
    if (latestEF.values?.hypertrophy || latestEF.values?.dilatation) {
      hasHypertrophyOrDilatation = true;
    }
  }

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // If in recovery period, automatic 100%
  if (isInRecoveryPeriod) {
    supportedRating = 100;
    rationale = ['Within 3-month recovery period following MI', 'Automatic 100% rating per 38 CFR 4.104'];
  } else if (lowestMets !== null) {
    if (lowestMets <= 3.0) {
      supportedRating = 100;
      rationale = [`METs capacity <=3.0 (${lowestMets} METs documented)`, 'Severely limited capacity supports 100% rating'];
    } else if (lowestMets <= 5.0) {
      supportedRating = 60;
      rationale = [`METs capacity 3.1-5.0 (${lowestMets} METs documented)`, 'Moderate limitation supports 60% rating'];
    } else if (lowestMets <= 7.0 || hasHypertrophyOrDilatation) {
      supportedRating = 30;
      rationale = [
        lowestMets <= 7.0 ? `METs capacity 5.1-7.0 (${lowestMets} METs)` : 'Cardiac hypertrophy/dilatation documented',
        'Supports 30% rating'
      ];
    } else if (lowestMets <= 10.0) {
      supportedRating = 10;
      rationale = [`METs capacity 7.1-10.0 (${lowestMets} METs)`, 'Mild limitation supports 10% rating'];
    }
  } else if (hasHypertrophyOrDilatation) {
    supportedRating = 30;
    rationale = ['Cardiac hypertrophy or dilatation documented', 'Supports 30% rating'];
  } else if (hospitalizationLogs.length > 0) {
    supportedRating = 60;
    rationale = [`${hospitalizationLogs.length} post-MI hospitalizations`, 'Significant events suggest at least 60% - METs testing needed'];
  } else if (relevantLogs.length >= 10) {
    supportedRating = 10;
    rationale = ['Post-MI symptoms documented', 'Continuous medication likely - supports minimum 10%'];
  }

  // Evidence gaps
  if (metsReadings.length === 0) evidenceGaps.push('No METs capacity documented - request cardiac stress test');
  if (efReadings.length === 0) evidenceGaps.push('No ejection fraction documented - echocardiogram recommended');
  if (!miDate) evidenceGaps.push('Document MI date for accurate recovery period tracking');

  return {
    hasData: true,
    condition: 'Myocardial Infarction (Post-MI)',
    diagnosticCode: '7006',
    cfrReference: '38 CFR 4.104',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      chestPainCount: chestPainLogs.length,
      dyspneaCount: dyspneaLogs.length,
      fatigueCount: fatigueLogs.length,
      syncopeCount: syncopeLogs.length,
      edemaCount: edemaLogs.length,
      hospitalizationCount: hospitalizationLogs.length,
      metsLevel: lowestMets,
      ejectionFraction: latestEF?.values?.ef_percent || null,
      hasHypertrophyOrDilatation,
      isInRecoveryPeriod,
    },
    criteria: POST_MI_CRITERIA,
  };
};

/**
 * Analyze Hypertensive Heart Disease symptom logs (DC 7007)
 * Requires hypertension WITH cardiac involvement
 */

export const analyzeHypertensiveHeartLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'hhd-dyspnea-exertion', 'hhd-dyspnea-rest', 'hhd-orthopnea', 'hhd-pnd', 'hhd-fatigue',
    'hhd-edema', 'hhd-weight-gain', 'hhd-chest-discomfort', 'hhd-palpitations', 'hhd-dizziness',
    'hhd-syncope', 'hhd-activity-limitation', 'hhd-hospitalization',
    'cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
    'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get METs, EF, and BP readings
  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const efReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ejection-fraction' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const bpReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'blood-pressure' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (relevantLogs.length === 0 && metsReadings.length === 0 && efReadings.length === 0) {
    return {
      hasData: false,
      condition: 'Hypertensive Heart Disease',
      diagnosticCode: '7007',
      message: 'No hypertensive heart disease symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging HHD symptoms and record METs capacity and blood pressure'],
      metrics: { totalLogs: 0 },
    };
  }

  // Categorize symptoms
  const dyspneaLogs = relevantLogs.filter(log =>
      ['hhd-dyspnea-exertion', 'hhd-dyspnea-rest', 'cardiac-breathlessness'].includes(getLogSymptomId(log))
  );
  const dyspneaRestLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hhd-dyspnea-rest'
  );
  const orthopneaLogs = relevantLogs.filter(log =>
      ['hhd-orthopnea', 'hhd-pnd', 'cardiac-orthopnea'].includes(getLogSymptomId(log))
  );
  const edemaLogs = relevantLogs.filter(log =>
      ['hhd-edema', 'cardiac-edema'].includes(getLogSymptomId(log))
  );
  const fatigueLogs = relevantLogs.filter(log =>
      ['hhd-fatigue', 'cardiac-fatigue'].includes(getLogSymptomId(log))
  );
  const syncopeLogs = relevantLogs.filter(log =>
      ['hhd-syncope', 'cardiac-syncope'].includes(getLogSymptomId(log))
  );
  const hospitalizationLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hhd-hospitalization'
  );

  // Get lowest METs
  let lowestMets = null;
  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => parseFloat(m.values?.mets_level || 99)));
  }

  // Check for LVH or dilatation
  let hasHypertrophyOrDilatation = false;
  let latestEF = null;
  if (efReadings.length > 0) {
    latestEF = efReadings[efReadings.length - 1];
    if (latestEF.values?.hypertrophy || latestEF.values?.dilatation) {
      hasHypertrophyOrDilatation = true;
    }
  }

  // Check for documented hypertension
  let hasDocumentedHypertension = bpReadings.length > 0;
  let avgSystolic = 0;
  if (bpReadings.length > 0) {
    avgSystolic = bpReadings.reduce((sum, r) => sum + (r.values?.systolic || 0), 0) / bpReadings.length;
  }

  // Check for CHF indicators
  const hasCHFIndicators = (dyspneaRestLogs.length > 0 || orthopneaLogs.length >= 2) &&
      (edemaLogs.length >= 2 || fatigueLogs.length >= 5);

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (lowestMets !== null) {
    if (lowestMets <= 3.0 || hasCHFIndicators) {
      supportedRating = 100;
      rationale = [
        lowestMets <= 3.0 ? `METs capacity <=3.0 (${lowestMets} METs documented)` : 'CHF symptoms documented (dyspnea at rest, orthopnea, edema)',
        'Severely limited capacity supports 100% rating'
      ];
    } else if (lowestMets <= 5.0) {
      supportedRating = 60;
      rationale = [`METs capacity 3.1-5.0 (${lowestMets} METs documented)`, 'Moderate limitation supports 60% rating'];
    } else if (lowestMets <= 7.0 || hasHypertrophyOrDilatation) {
      supportedRating = 30;
      rationale = [
        lowestMets <= 7.0 ? `METs capacity 5.1-7.0 (${lowestMets} METs)` : 'Left ventricular hypertrophy/dilatation documented',
        'Supports 30% rating'
      ];
    } else if (lowestMets <= 10.0) {
      supportedRating = 10;
      rationale = [`METs capacity 7.1-10.0 (${lowestMets} METs)`, 'Mild limitation supports 10% rating'];
    }
  } else if (hasCHFIndicators) {
    supportedRating = 100;
    rationale = ['CHF symptoms documented', 'METs testing recommended to confirm rating'];
  } else if (hasHypertrophyOrDilatation) {
    supportedRating = 30;
    rationale = ['Left ventricular hypertrophy documented', 'Supports 30% rating'];
  } else if (hospitalizationLogs.length > 0) {
    supportedRating = 60;
    rationale = [`${hospitalizationLogs.length} heart failure hospitalizations`, 'Significant events suggest at least 60%'];
  } else if (relevantLogs.length >= 10) {
    supportedRating = 10;
    rationale = ['HHD symptoms documented', 'Continuous medication likely - supports minimum 10%'];
  }

  // Evidence gaps
  if (metsReadings.length === 0) evidenceGaps.push('No METs capacity documented - request cardiac stress test');
  if (efReadings.length === 0) evidenceGaps.push('No ejection fraction/LVH assessment - echocardiogram recommended');
  if (!hasDocumentedHypertension) evidenceGaps.push('Document blood pressure readings to establish hypertension connection');

  return {
    hasData: true,
    condition: 'Hypertensive Heart Disease',
    diagnosticCode: '7007',
    cfrReference: '38 CFR 4.104',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      dyspneaCount: dyspneaLogs.length,
      orthopneaCount: orthopneaLogs.length,
      edemaCount: edemaLogs.length,
      fatigueCount: fatigueLogs.length,
      syncopeCount: syncopeLogs.length,
      hospitalizationCount: hospitalizationLogs.length,
      metsLevel: lowestMets,
      ejectionFraction: latestEF?.values?.ef_percent || null,
      hasHypertrophyOrDilatation,
      avgSystolicBP: avgSystolic > 0 ? Math.round(avgSystolic) : null,
      bpReadingsCount: bpReadings.length,
    },
    criteria: HYPERTENSIVE_HEART_CRITERIA,
  };
};

/**
 * Analyze Cold Injury Residuals symptom logs (DC 7122)
 * Rates each affected body part separately
 */

export const analyzeColdInjuryLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'cold-injury-pain', 'cold-injury-numbness', 'cold-injury-cold-sensitivity',
    'cold-injury-tingling', 'cold-injury-color-changes', 'cold-injury-tissue-loss',
    'cold-injury-nail-abnormalities', 'cold-injury-impaired-sensation',
    'cold-injury-hyperhidrosis', 'cold-injury-stiffness', 'cold-injury-swelling',
    'cold-injury-xray-abnormality'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Cold Injury Residuals',
      diagnosticCode: '7122',
      message: 'No cold injury symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging cold injury symptoms - identify which body parts are affected'],
      metrics: { totalLogs: 0 },
    };
  }

  // Primary symptoms (pain, numbness, cold sensitivity)
  const primarySymptomLogs = relevantLogs.filter(log =>
      ['cold-injury-pain', 'cold-injury-numbness', 'cold-injury-cold-sensitivity', 'cold-injury-tingling'].includes(getLogSymptomId(log))
  );

  // Additional findings that increase rating
  const tissueLossLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-tissue-loss');
  const nailAbnormalityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-nail-abnormalities');
  const colorChangeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-color-changes');
  const impairedSensationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-impaired-sensation');
  const hyperhidrosisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-hyperhidrosis');
  const xrayAbnormalityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cold-injury-xray-abnormality');

  // Count additional findings present
  let additionalFindings = 0;
  const findingsList = [];
  if (tissueLossLogs.length > 0) { additionalFindings++; findingsList.push('tissue loss'); }
  if (nailAbnormalityLogs.length > 0) { additionalFindings++; findingsList.push('nail abnormalities'); }
  if (colorChangeLogs.length > 0) { additionalFindings++; findingsList.push('color changes'); }
  if (impairedSensationLogs.length > 0) { additionalFindings++; findingsList.push('impaired sensation'); }
  if (hyperhidrosisLogs.length > 0) { additionalFindings++; findingsList.push('hyperhidrosis'); }
  if (xrayAbnormalityLogs.length > 0) { additionalFindings++; findingsList.push('X-ray abnormalities'); }

  const hasPrimarySymptoms = primarySymptomLogs.length > 0;

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (hasPrimarySymptoms) {
    if (additionalFindings >= 2) {
      supportedRating = 30;
      rationale = [
        'Primary symptoms (pain/numbness/cold sensitivity) documented',
        `${additionalFindings} additional findings: ${findingsList.join(', ')}`,
        'Pattern supports 30% rating per affected body part'
      ];
    } else if (additionalFindings === 1) {
      supportedRating = 20;
      rationale = [
        'Primary symptoms documented',
        `1 additional finding: ${findingsList.join(', ')}`,
        'Pattern supports 20% rating per affected body part'
      ];
    } else {
      supportedRating = 10;
      rationale = [
        'Primary symptoms (pain/numbness/cold sensitivity) documented',
        'No additional objective findings logged',
        'Pattern supports 10% rating per affected body part'
      ];
    }
  } else if (additionalFindings > 0) {
    supportedRating = 10;
    rationale = [
      `Additional findings documented: ${findingsList.join(', ')}`,
      'Document primary symptoms (pain, numbness, cold sensitivity) for higher rating'
    ];
  }

  // Evidence gaps
  if (primarySymptomLogs.length === 0) {
    evidenceGaps.push('Document primary symptoms: pain, numbness, or cold sensitivity');
  }
  if (additionalFindings < 2 && supportedRating < 30) {
    evidenceGaps.push('Document additional findings (tissue loss, nail changes, color changes, impaired sensation, hyperhidrosis, X-ray abnormalities) for higher rating');
  }
  evidenceGaps.push('Note: Each affected body part (hand, foot, ear, nose) should be documented separately');

  return {
    hasData: true,
    condition: 'Cold Injury Residuals',
    diagnosticCode: '7122',
    cfrReference: '38 CFR 4.104',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      primarySymptomCount: primarySymptomLogs.length,
      additionalFindings,
      findingsList,
      tissueLoss: tissueLossLogs.length > 0,
      nailAbnormalities: nailAbnormalityLogs.length > 0,
      colorChanges: colorChangeLogs.length > 0,
      impairedSensation: impairedSensationLogs.length > 0,
      hyperhidrosis: hyperhidrosisLogs.length > 0,
      xrayAbnormalities: xrayAbnormalityLogs.length > 0,
    },
    criteria: COLD_INJURY_CRITERIA,
  };
};

/**
 * Analyze Peripheral Arterial Disease (PAD) symptom logs (DC 7114)
 * Uses ABI measurements when available
 */

export const analyzePADLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'pad-claudication-mild', 'pad-claudication-moderate', 'pad-claudication-severe',
    'pad-rest-pain', 'pad-coldness', 'pad-numbness',
    'pad-trophic-thin-skin', 'pad-trophic-hair-loss', 'pad-trophic-nail-changes',
    'pad-diminished-pulses', 'pad-color-changes', 'pad-ulceration',
    'pad-slow-healing', 'pad-gangrene'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get ABI readings from measurements
  const abiReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ankle-brachial-index' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (relevantLogs.length === 0 && abiReadings.length === 0) {
    return {
      hasData: false,
      condition: 'Peripheral Arterial Disease',
      diagnosticCode: '7114',
      message: 'No PAD symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging PAD symptoms and record ABI measurements'],
      metrics: { totalLogs: 0 },
    };
  }

  // Categorize symptoms
  const claudicationMildLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-claudication-mild');
  const claudicationModerateLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-claudication-moderate');
  const claudicationSevereLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-claudication-severe');
  const restPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-rest-pain');
  const coldnessLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-coldness');
  const ulcerationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-ulceration');
  const gangreneLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-gangrene');
  const diminishedPulsesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pad-diminished-pulses');

  // Trophic changes
  const trophicLogs = relevantLogs.filter(log =>
      ['pad-trophic-thin-skin', 'pad-trophic-hair-loss', 'pad-trophic-nail-changes'].includes(getLogSymptomId(log))
  );
  const hasTrophicChanges = trophicLogs.length > 0;

  // Get lowest ABI if available
  let lowestABI = null;
  if (abiReadings.length > 0) {
    lowestABI = Math.min(...abiReadings.map(m => {
      // Calculate ABI from ankle/brachial values if not pre-calculated
      if (m.values?.abi_calculated) return parseFloat(m.values.abi_calculated);
      if (m.values?.ankle_systolic && m.values?.brachial_systolic) {
        return parseFloat(m.values.ankle_systolic) / parseFloat(m.values.brachial_systolic);
      }
      return 99;
    }));
    if (lowestABI === 99) lowestABI = null;
  }

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // Determine rating based on symptoms and ABI
  const hasRestPain = restPainLogs.length > 0;
  const hasUlceration = ulcerationLogs.length > 0 || gangreneLogs.length > 0;
  const hasSevereClaudication = claudicationSevereLogs.length > 0;
  const hasModerateClaudication = claudicationModerateLogs.length > 0;
  const hasMildClaudication = claudicationMildLogs.length > 0;
  const hasPersistentColdness = coldnessLogs.length >= 3; // Multiple episodes suggest persistent
  const hasDiminishedPulses = diminishedPulsesLogs.length > 0;

  // 100% rating criteria
  if (hasRestPain && (hasUlceration || (lowestABI !== null && lowestABI <= 0.4))) {
    supportedRating = 100;
    rationale = [
      'Ischemic rest pain documented',
      hasUlceration ? 'Ischemic ulceration/gangrene present' : `ABI <=0.4 (${lowestABI?.toFixed(2)})`,
      'Pattern supports 100% rating per extremity'
    ];
  }
  // 60% rating criteria
  else if (hasSevereClaudication && (hasPersistentColdness || (lowestABI !== null && lowestABI <= 0.5))) {
    supportedRating = 60;
    rationale = [
      'Severe claudication (<25 yards) documented',
      hasPersistentColdness ? 'Persistent coldness documented' : `ABI <=0.5 (${lowestABI?.toFixed(2)})`,
      'Pattern supports 60% rating per extremity'
    ];
  }
  // 40% rating criteria
  else if (hasModerateClaudication && (hasTrophicChanges || (lowestABI !== null && lowestABI <= 0.7))) {
    supportedRating = 40;
    rationale = [
      'Moderate claudication (25-100 yards) documented',
      hasTrophicChanges ? 'Trophic changes present' : `ABI <=0.7 (${lowestABI?.toFixed(2)})`,
      'Pattern supports 40% rating per extremity'
    ];
  }
  // 20% rating criteria
  else if ((hasMildClaudication || hasModerateClaudication || hasSevereClaudication) &&
      (hasDiminishedPulses || (lowestABI !== null && lowestABI <= 0.9))) {
    supportedRating = 20;
    rationale = [
      'Claudication documented',
      hasDiminishedPulses ? 'Diminished peripheral pulses documented' : `ABI <=0.9 (${lowestABI?.toFixed(2)})`,
      'Pattern supports 20% rating per extremity'
    ];
  }
  // Has symptoms but doesn't meet full criteria
  else if (relevantLogs.length > 0) {
    supportedRating = 20;
    rationale = [
      'PAD symptoms documented',
      'ABI measurement recommended to confirm rating level'
    ];
  }

  // Evidence gaps
  if (abiReadings.length === 0) {
    evidenceGaps.push('No ABI measurements documented - request vascular studies');
  }
  if (!hasRestPain && !hasSevereClaudication && !hasModerateClaudication && !hasMildClaudication) {
    evidenceGaps.push('Document claudication with specific walking distance');
  }
  if (!hasTrophicChanges && supportedRating < 40) {
    evidenceGaps.push('Document trophic changes if present (thin skin, hair loss, nail changes)');
  }

  return {
    hasData: true,
    condition: 'Peripheral Arterial Disease',
    diagnosticCode: '7114',
    cfrReference: '38 CFR 4.104',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      claudicationMild: claudicationMildLogs.length,
      claudicationModerate: claudicationModerateLogs.length,
      claudicationSevere: claudicationSevereLogs.length,
      restPainCount: restPainLogs.length,
      coldnessCount: coldnessLogs.length,
      ulcerationCount: ulcerationLogs.length,
      trophicChangeCount: trophicLogs.length,
      diminishedPulsesCount: diminishedPulsesLogs.length,
      lowestABI,
      abiReadingsCount: abiReadings.length,
    },
    criteria: PAD_CRITERIA,
  };
};


/**
 * Analyze SVT (Supraventricular Tachycardia) symptom logs (DC 7010)
 */

export const analyzeRaynaudsLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'raynauds-attack', 'raynauds-numbness', 'raynauds-pain',
    'raynauds-ulcer', 'raynauds-cold-trigger'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: "No Raynaud's logs found",
      supportedRating: null,
      evidence: [],
      gaps: ["Start logging Raynaud's attacks including color changes, triggers, and any ulcers"],
    };
  }

  const attackLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'raynauds-attack' || getLogSymptomId(log) === 'raynauds-cold-trigger'
  );
  const ulcerLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'raynauds-ulcer');

  const weeksInPeriod = evaluationPeriodDays / 7;
  const attacksPerWeek = attackLogs.length / weeksInPeriod;

  const evidence = [];
  evidence.push(`${attackLogs.length} characteristic attacks logged (${attacksPerWeek.toFixed(1)}/week)`);
  if (ulcerLogs.length > 0) evidence.push(`${ulcerLogs.length} digital ulcer episodes logged`);

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (ulcerLogs.length >= 2) {
    supportedRating = 60;
    ratingRationale = [
      '2+ digital ulcers documented',
      'With history of characteristic attacks',
      'Supports 60% rating (100% requires auto-amputation)',
    ];
  } else if (attacksPerWeek >= 7) {
    supportedRating = 40;
    ratingRationale = [
      `Attacks occurring ${attacksPerWeek.toFixed(1)} times per week (daily or more)`,
      'Daily attacks support 40% rating',
    ];
  } else if (attacksPerWeek >= 4) {
    supportedRating = 20;
    ratingRationale = [
      `Attacks occurring ${attacksPerWeek.toFixed(1)} times per week`,
      '4-6 attacks per week supports 20% rating',
    ];
  } else if (attacksPerWeek >= 1) {
    supportedRating = 10;
    ratingRationale = [
      `Attacks occurring ${attacksPerWeek.toFixed(1)} times per week`,
      '1-3 attacks per week supports 10% rating',
    ];
  }

  if (ulcerLogs.length === 0) {
    gaps.push('Document any digital ulcers - these significantly increase rating');
  }
  gaps.push('Log each attack with date, duration, and affected digits');
  gaps.push('Note triggers (cold exposure, stress) for each attack');

  return {
    hasData: true,
    condition: "Raynaud's Syndrome",
    diagnosticCode: '7117',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: RAYNAUDS_CRITERIA,
    disclaimer: RAYNAUDS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Varicose Veins symptom logs
 */

export const analyzeVaricoseVeinsLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'varicose-aching', 'varicose-edema', 'varicose-pigmentation',
    'varicose-ulcer', 'varicose-pain'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No varicose vein logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging varicose vein symptoms including swelling, pain, and any skin changes'],
    };
  }

  const edemaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'varicose-edema');
  const pigmentationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'varicose-pigmentation');
  const ulcerLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'varicose-ulcer');
  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'varicose-pain');
  const achingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'varicose-aching');

  const evidence = [];
  if (edemaLogs.length > 0) evidence.push(`${edemaLogs.length} swelling/edema episodes logged`);
  if (pigmentationLogs.length > 0) evidence.push(`${pigmentationLogs.length} skin discoloration entries logged`);
  if (ulcerLogs.length > 0) evidence.push(`${ulcerLogs.length} skin ulcer entries logged`);
  if (painLogs.length > 0) evidence.push(`${painLogs.length} pain at rest episodes logged`);
  if (achingLogs.length > 0) evidence.push(`${achingLogs.length} aching/fatigue episodes logged`);

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Check for severe symptoms
  if (painLogs.length >= 30 && edemaLogs.length >= 30) {
    supportedRating = 100;
    ratingRationale = [
      'Constant pain at rest with persistent edema documented',
      'Pattern consistent with 100% rating',
    ];
  } else if (ulcerLogs.length >= 5 && edemaLogs.length >= 10 && pigmentationLogs.length > 0) {
    supportedRating = 60;
    ratingRationale = [
      'Persistent edema, skin changes, and ulceration documented',
      'Pattern supports 60% rating',
    ];
  } else if (edemaLogs.length >= 10 && pigmentationLogs.length > 0) {
    supportedRating = 40;
    ratingRationale = [
      'Persistent edema with skin pigmentation changes',
      'Pattern supports 40% rating',
    ];
  } else if (edemaLogs.length >= 5) {
    supportedRating = 20;
    ratingRationale = [
      'Persistent edema documented',
      'Pattern supports 20% rating',
    ];
  } else if (achingLogs.length > 0 || edemaLogs.length > 0) {
    supportedRating = 10;
    ratingRationale = [
      'Intermittent symptoms documented',
      'Relieved by elevation or compression hosiery supports 10% rating',
    ];
  }

  gaps.push('Track symptoms separately for each leg if bilateral');
  gaps.push('Document response to elevation and compression hosiery');
  if (ulcerLogs.length === 0) {
    gaps.push('Document any skin ulcers - these significantly affect rating');
  }

  return {
    hasData: true,
    condition: 'Varicose Veins',
    diagnosticCode: '7120/7121',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: VARICOSE_VEINS_CRITERIA,
    disclaimer: VARICOSE_VEINS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Chronic Urticaria symptom logs
 */

export const analyzeRhinitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const rhinitisSymptoms = logs.filter(log =>
      CARDIORESPIRATORY_CONDITIONS.RHINITIS.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const congestionCount = rhinitisSymptoms.filter(s => getLogSymptomId(s) === 'rhinitis-congestion').length;
  const drainageCount = rhinitisSymptoms.filter(s => getLogSymptomId(s) === 'rhinitis-drainage').length;
  const sneezingCount = rhinitisSymptoms.filter(s => getLogSymptomId(s) === 'rhinitis-sneezing').length;
  const breathingCount = rhinitisSymptoms.filter(s => getLogSymptomId(s) === 'rhinitis-breathing').length;

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

export const analyzeSinusitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const sinusitisSymptoms = logs.filter(log =>
      CARDIORESPIRATORY_CONDITIONS.SINUSITIS.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const facialPainCount = sinusitisSymptoms.filter(s => getLogSymptomId(s) === 'sinusitis-facial-pain').length;
  const pressureCount = sinusitisSymptoms.filter(s => getLogSymptomId(s) === 'sinusitis-pressure').length;
  const congestionCount = sinusitisSymptoms.filter(s => getLogSymptomId(s) === 'sinusitis-congestion').length;
  const headacheCount = sinusitisSymptoms.filter(s => getLogSymptomId(s) === 'sinusitis-headache').length;
  const drainageCount = sinusitisSymptoms.filter(s => getLogSymptomId(s) === 'sinusitis-drainage').length;

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
 * Analyze Deviated Septum logs for VA rating
 * DC 6502 - Deviated Nasal Septum
 */

export const analyzeDeviatedSeptumLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  // Filter for deviated septum symptoms
  const septumSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && (
        symptomId.includes('septum') ||
        symptomId.includes('deviated')
    ) && isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (septumSymptoms.length === 0) {
    return {
      condition: 'Deviated Nasal Septum',
      diagnosticCode: '6502',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No deviated septum symptoms logged',
        'Document nasal obstruction severity',
        'Track breathing difficulties',
        'Note which side(s) affected',
        'Document traumatic origin if applicable',
      ],
      criteria: DEVIATED_SEPTUM_CRITERIA,
      disclaimer: DEVIATED_SEPTUM_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const bilateralObstruction = septumSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'septum-obstruction-bilateral';
  }).length;

  const completeObstruction = septumSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'septum-obstruction-complete';
  }).length;

  const breathingDifficulty = septumSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'septum-breathing-difficulty';
  }).length;

  const congestion = septumSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'septum-congestion';
  }).length;

  const snoring = septumSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'septum-snoring';
  }).length;

  evidence.push(`${septumSymptoms.length} deviated septum symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination based on obstruction documentation
  if (bilateralObstruction > 0 || completeObstruction > 0) {
    supportedRating = 10;
    ratingRationale.push('Significant nasal obstruction documented');

    if (bilateralObstruction > 0) {
      evidence.push(`${bilateralObstruction} bilateral obstruction episodes (50%+ both sides)`);
      ratingRationale.push('Bilateral 50%+ obstruction supports 10% rating');
    }

    if (completeObstruction > 0) {
      evidence.push(`${completeObstruction} complete unilateral obstruction episodes`);
      ratingRationale.push('Complete obstruction one side supports 10% rating');
    }
  }

  // Document other symptoms
  if (breathingDifficulty > 0) {
    evidence.push(`${breathingDifficulty} breathing difficulty episodes`);
  }
  if (congestion > 0) {
    evidence.push(`${congestion} chronic congestion episodes`);
  }
  if (snoring > 0) {
    evidence.push(`${snoring} snoring/sleep disruption episodes`);
  }

  // If no obstruction documented but other symptoms present
  if (supportedRating === 0 && septumSymptoms.length > 0) {
    ratingRationale.push('Symptoms documented but obstruction degree not established');
    gaps.push('Document specific obstruction percentage (50%+ bilateral or complete unilateral for 10%)');
  }

  // Documentation gaps
  gaps.push('Obtain ENT evaluation documenting obstruction percentage');
  gaps.push('Request CT scan or nasal endoscopy for objective evidence');
  gaps.push('Document traumatic origin (required for VA rating)');
  gaps.push('Note if septoplasty performed and results');

  if (bilateralObstruction === 0 && completeObstruction === 0) {
    gaps.push('Log bilateral obstruction (50%+ both sides) or complete unilateral obstruction');
  }

  return {
    condition: 'Deviated Nasal Septum',
    diagnosticCode: '6502',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: DEVIATED_SEPTUM_CRITERIA,
    disclaimer: DEVIATED_SEPTUM_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Nose Loss logs for VA rating
 * DC 6504 - Nose Loss/Disfigurement
 */

export const analyzeNoseLossLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options; // Use longer period for structural conditions

  // Filter for nose loss symptoms
  const noseLossSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && (
        symptomId.includes('nose-loss') ||
        symptomId.includes('nose-obvious') ||
        symptomId.includes('nose-breathing') ||
        symptomId.includes('nose-prosthesis') ||
        symptomId.includes('nose-reconstruction') ||
        symptomId.includes('nose-trauma') ||
        symptomId.includes('nose-surgical')
    ) && isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (noseLossSymptoms.length === 0) {
    return {
      condition: 'Nose Loss/Disfigurement',
      diagnosticCode: '6504',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No nose loss/disfigurement symptoms logged',
        'Document extent of tissue loss',
        'Note visible disfigurement',
        'Track breathing impairment if applicable',
        'Document cause (trauma, surgery, disease)',
      ],
      criteria: NOSE_LOSS_CRITERIA,
      disclaimer: NOSE_LOSS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const bothPassagesExposed = noseLossSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'nose-loss-both-passages';
  }).length;

  const partialAlaLoss = noseLossSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'nose-loss-partial-ala';
  }).length;

  const obviousDisfigurement = noseLossSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'nose-obvious-disfigurement';
  }).length;

  const breathingImpairment = noseLossSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'nose-breathing-impairment';
  }).length;

  const prosthesisUse = noseLossSymptoms.filter(s => {
    const id = s.symptomId || s.symptom;
    return id === 'nose-prosthesis-use';
  }).length;

  evidence.push(`${noseLossSymptoms.length} nose loss/disfigurement entries logged`);

  // Rating determination
  if (bothPassagesExposed > 0) {
    supportedRating = 30;
    ratingRationale.push('Loss exposing both nasal passages documented');
    evidence.push('Significant tissue loss with both passages exposed');
  } else if (partialAlaLoss > 0 || obviousDisfigurement > 0) {
    supportedRating = 10;
    if (partialAlaLoss > 0) {
      ratingRationale.push('Partial ala loss documented');
      evidence.push('Loss of part of nasal ala');
    }
    if (obviousDisfigurement > 0) {
      ratingRationale.push('Obvious disfigurement documented');
      evidence.push('Visible nasal disfigurement present');
    }
  }

  // Document additional symptoms
  if (breathingImpairment > 0) {
    evidence.push(`${breathingImpairment} breathing impairment entries`);
  }
  if (prosthesisUse > 0) {
    evidence.push('Nasal prosthesis required');
    ratingRationale.push('Prosthesis use indicates significant loss');
  }

  // Documentation gaps
  gaps.push('Obtain photographs from multiple angles for documentation');
  gaps.push('Get ENT or plastic surgery evaluation documenting extent');
  gaps.push('Document cause of tissue loss (trauma, surgery, disease)');
  gaps.push('Consider evaluation under DC 7800 (scars) if applicable');

  if (supportedRating < 30) {
    gaps.push('For 30% rating: document loss exposing BOTH nasal passages');
  }

  return {
    condition: 'Nose Loss/Disfigurement',
    diagnosticCode: '6504',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: NOSE_LOSS_CRITERIA,
    disclaimer: NOSE_LOSS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Chronic Laryngitis logs for VA rating
 * DC 6516 - Chronic Laryngitis
 */

export const analyzeChronicLaryngitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const laryngitisSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('laryngitis') &&
        isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (laryngitisSymptoms.length === 0) {
    return {
      condition: 'Chronic Laryngitis',
      diagnosticCode: '6516',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No chronic laryngitis symptoms logged',
        'Document hoarseness episodes',
        'Track voice fatigue and throat symptoms',
        'Note laryngoscopy findings if available',
      ],
      criteria: CHRONIC_LARYNGITIS_CRITERIA,
      disclaimer: CHRONIC_LARYNGITIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const hoarseness = laryngitisSymptoms.filter(s => (s.symptomId || s.symptom) === 'laryngitis-hoarseness').length;
  const inflammation = laryngitisSymptoms.filter(s => (s.symptomId || s.symptom) === 'laryngitis-inflammation').length;
  const nodules = laryngitisSymptoms.filter(s => (s.symptomId || s.symptom) === 'laryngitis-nodules').length;
  const premalignant = laryngitisSymptoms.filter(s => (s.symptomId || s.symptom) === 'laryngitis-premalignant').length;

  evidence.push(`${laryngitisSymptoms.length} laryngitis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (nodules > 0 || premalignant > 0) {
    supportedRating = 30;
    if (nodules > 0) {
      ratingRationale.push('Vocal cord nodules/polyps/thickening documented');
      evidence.push(`${nodules} entries noting vocal cord structural changes`);
    }
    if (premalignant > 0) {
      ratingRationale.push('Pre-malignant changes documented');
      evidence.push('Biopsy showing pre-malignant changes');
    }
  } else if (hoarseness > 0 || inflammation > 0) {
    supportedRating = 10;
    if (hoarseness > 0) {
      ratingRationale.push('Chronic hoarseness documented');
      evidence.push(`${hoarseness} hoarseness episodes logged`);
    }
    if (inflammation > 0) {
      ratingRationale.push('Vocal cord inflammation documented');
      evidence.push(`${inflammation} inflammation entries`);
    }
  }

  // Documentation gaps
  gaps.push('Obtain laryngoscopy report documenting vocal cord condition');
  gaps.push('Get ENT evaluation for official diagnosis');

  if (supportedRating < 30) {
    gaps.push('For 30% rating: document structural changes (nodules, polyps, thickening, or pre-malignant changes)');
  }

  return {
    condition: 'Chronic Laryngitis',
    diagnosticCode: '6516',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: CHRONIC_LARYNGITIS_CRITERIA,
    disclaimer: CHRONIC_LARYNGITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Aphonia logs for VA rating
 * DC 6519 - Complete Organic Aphonia
 */

export const analyzeAphoniaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const aphoniaSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('aphonia') &&
        isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  if (aphoniaSymptoms.length === 0) {
    return {
      condition: 'Aphonia (Voice Loss)',
      diagnosticCode: '6519',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No aphonia symptoms logged',
        'Document voice loss episodes',
        'Note if whisper-only or complete loss',
        'Track communication difficulties',
      ],
      criteria: APHONIA_CRITERIA,
      disclaimer: APHONIA_CRITERIA.disclaimer,
      // SMC Eligibility Data - only at 100% rating
      smcEligible: supportedRating === 100,
      smcData: supportedRating === 100 ? {
        level: 'K',
        category: 'APHONIA',
        autoGrant: true,
        requiredRating: 100,
        note: 'Complete organic aphonia (constant inability to speak above a whisper) at 100% qualifies for SMC-K.',
      } : null,
    };
  }


  // Count symptoms by type
  const completeVoiceLoss = aphoniaSymptoms.filter(s => (s.symptomId || s.symptom) === 'aphonia-complete').length;
  const whisperOnly = aphoniaSymptoms.filter(s => (s.symptomId || s.symptom) === 'aphonia-whisper-only').length;
  const communicationImpaired = aphoniaSymptoms.filter(s => (s.symptomId || s.symptom) === 'aphonia-communication-impaired').length;
  const aacDevice = aphoniaSymptoms.filter(s => (s.symptomId || s.symptom) === 'aphonia-aac-device').length;
  const intermittent = aphoniaSymptoms.filter(s => (s.symptomId || s.symptom) === 'aphonia-intermittent').length;

  evidence.push(`${aphoniaSymptoms.length} aphonia symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (completeVoiceLoss > 0 || communicationImpaired > 0) {
    supportedRating = 100;
    ratingRationale.push('Complete inability to communicate by speech documented');
    if (completeVoiceLoss > 0) evidence.push(`${completeVoiceLoss} complete voice loss entries`);
    if (communicationImpaired > 0) evidence.push('Communication by speech impaired');
    ratingRationale.push('Requires SMC review for complete voice loss');
  } else if (whisperOnly > 0) {
    supportedRating = 60;
    ratingRationale.push('Constant inability to speak above whisper documented');
    evidence.push(`${whisperOnly} whisper-only voice entries`);
  } else if (intermittent > 0) {
    supportedRating = 10;
    ratingRationale.push('Intermittent voice loss documented - rated as chronic laryngitis (DC 6516)');
    evidence.push('Note: Incomplete aphonia is rated under DC 6516');
    gaps.push('Intermittent/incomplete aphonia should be evaluated under DC 6516 (Chronic Laryngitis)');
  }

  if (aacDevice > 0) {
    evidence.push('AAC device required for communication');
    ratingRationale.push('Use of augmentative communication device supports severity');
  }

  // Documentation gaps
  gaps.push('Obtain ENT evaluation documenting cause of voice loss');
  gaps.push('Get speech pathology assessment');

  if (supportedRating === 100) {
    gaps.push('Apply for Special Monthly Compensation (SMC) review');
  }

  return {
    condition: 'Aphonia (Voice Loss)',
    diagnosticCode: '6519',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: APHONIA_CRITERIA,
    disclaimer: APHONIA_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Laryngeal Stenosis logs for VA rating
 * DC 6520 - Stenosis of Larynx
 */

export const analyzeLaryngealStenosisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const stenosisSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('stenosis') &&
        isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (stenosisSymptoms.length === 0) {
    return {
      condition: 'Laryngeal Stenosis',
      diagnosticCode: '6520',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No laryngeal stenosis symptoms logged',
        'Document breathing difficulties',
        'Track stridor or noisy breathing',
        'Note tracheostomy status if applicable',
      ],
      criteria: LARYNGEAL_STENOSIS_CRITERIA,
      disclaimer: LARYNGEAL_STENOSIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const tracheostomy = stenosisSymptoms.filter(s => (s.symptomId || s.symptom) === 'stenosis-tracheostomy').length;
  const breathingDifficulty = stenosisSymptoms.filter(s => (s.symptomId || s.symptom) === 'stenosis-breathing-difficulty').length;
  const stridor = stenosisSymptoms.filter(s => (s.symptomId || s.symptom) === 'stenosis-stridor').length;
  const pftAbnormal = stenosisSymptoms.filter(s => (s.symptomId || s.symptom) === 'stenosis-pft-abnormal').length;
  const dilationRequired = stenosisSymptoms.filter(s => (s.symptomId || s.symptom) === 'stenosis-dilation-required').length;

  evidence.push(`${stenosisSymptoms.length} laryngeal stenosis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination - based on severity indicators
  if (tracheostomy > 0) {
    supportedRating = 100;
    ratingRationale.push('Permanent tracheostomy documented');
    evidence.push('Tracheostomy required - qualifies for 100% rating');
  } else if (pftAbnormal > 0 || dilationRequired > 0) {
    // Without actual FEV-1 values, we note symptoms suggest rating
    supportedRating = 30; // Conservative estimate without PFT data
    ratingRationale.push('Abnormal PFT or dilation requirement suggests significant stenosis');
    if (pftAbnormal > 0) evidence.push('Abnormal pulmonary function documented');
    if (dilationRequired > 0) evidence.push('Airway dilation procedures required');
    gaps.push('Obtain PFT with Flow-Volume Loop to determine specific rating level');
  } else if (breathingDifficulty > 0 || stridor > 0) {
    supportedRating = 10;
    ratingRationale.push('Breathing symptoms documented');
    if (breathingDifficulty > 0) evidence.push(`${breathingDifficulty} breathing difficulty entries`);
    if (stridor > 0) evidence.push(`${stridor} stridor/noisy breathing entries`);
  }

  // Documentation gaps - PFT is critical for this condition
  gaps.push('CRITICAL: Obtain pulmonary function test with Flow-Volume Loop');
  gaps.push('PFT must show upper airway obstruction pattern for rating');
  gaps.push('Get laryngoscopy documenting stenosis degree');

  if (supportedRating < 100 && tracheostomy === 0) {
    gaps.push('Rating depends on FEV-1 percentage: <40%=100%, 40-55%=60%, 56-70%=30%, 71-80%=10%');
  }

  return {
    condition: 'Laryngeal Stenosis',
    diagnosticCode: '6520',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: LARYNGEAL_STENOSIS_CRITERIA,
    disclaimer: LARYNGEAL_STENOSIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Pharynx Injury logs for VA rating
 * DC 6521 - Pharynx Injuries
 */

export const analyzePharynxInjuryLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const pharynxSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('pharynx') &&
        isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (pharynxSymptoms.length === 0) {
    return {
      condition: 'Pharynx Injuries',
      diagnosticCode: '6521',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No pharynx injury symptoms logged',
        'Document swallowing difficulties',
        'Track nasal regurgitation episodes',
        'Note speech impairment if present',
      ],
      criteria: PHARYNX_INJURY_CRITERIA,
      disclaimer: PHARYNX_INJURY_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const stricture = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-stricture').length;
  const obstruction = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-obstruction').length;
  const softPalateAbsent = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-soft-palate-absent').length;
  const softPalateParalysis = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-soft-palate-paralysis').length;
  const nasalRegurgitation = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-nasal-regurgitation').length;
  const dysphagia = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-dysphagia').length;
  const speechImpairment = pharynxSymptoms.filter(s => (s.symptomId || s.symptom) === 'pharynx-speech-impairment').length;

  evidence.push(`${pharynxSymptoms.length} pharynx injury symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination - 50% is the only rating for DC 6521
  if (stricture > 0 || obstruction > 0) {
    supportedRating = 50;
    ratingRationale.push('Pharyngeal stricture or obstruction documented');
    if (stricture > 0) evidence.push(`${stricture} stricture entries`);
    if (obstruction > 0) evidence.push(`${obstruction} obstruction entries`);
  } else if (softPalateAbsent > 0) {
    supportedRating = 50;
    ratingRationale.push('Absence of soft palate documented');
    evidence.push('Soft palate absent from trauma/surgery/disease');
  } else if (softPalateParalysis > 0 && (nasalRegurgitation > 0 || dysphagia > 0) && speechImpairment > 0) {
    supportedRating = 50;
    ratingRationale.push('Soft palate paralysis with swallowing difficulty AND speech impairment');
    evidence.push('Paralysis with both swallowing and speech affected');
    if (nasalRegurgitation > 0) evidence.push(`${nasalRegurgitation} nasal regurgitation episodes`);
  } else if (softPalateParalysis > 0 || dysphagia > 0 || speechImpairment > 0) {
    // Some symptoms but not meeting full criteria
    supportedRating = 0;
    ratingRationale.push('Symptoms documented but may not meet full DC 6521 criteria');
    if (softPalateParalysis > 0) evidence.push('Soft palate paralysis present');
    if (dysphagia > 0) evidence.push(`${dysphagia} swallowing difficulty entries`);
    if (speechImpairment > 0) evidence.push(`${speechImpairment} speech impairment entries`);
    gaps.push('For 50% rating with paralysis: must document BOTH swallowing difficulty AND speech impairment');
  }

  // Documentation gaps
  gaps.push('Obtain ENT evaluation documenting pharyngeal condition');
  gaps.push('Get modified barium swallow study if swallowing affected');
  gaps.push('Obtain speech pathology evaluation if speech impaired');

  if (nasalRegurgitation > 0) {
    evidence.push(`${nasalRegurgitation} nasal regurgitation episodes`);
  }

  return {
    condition: 'Pharynx Injuries',
    diagnosticCode: '6521',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: PHARYNX_INJURY_CRITERIA,
    disclaimer: PHARYNX_INJURY_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Shoulder logs for VA rating
 * DC 5201-5203 - Shoulder Conditions
 */

export const analyzeChronicUrticariaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'urticaria-outbreak', 'urticaria-itching', 'urticaria-swelling', 'urticaria-medication'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No chronic urticaria logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging urticaria outbreaks and medication use'],
    };
  }

  const outbreakLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'urticaria-outbreak');
  const medicationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'urticaria-medication');

  const weeksInPeriod = evaluationPeriodDays / 7;
  const outbreaksPerWeek = outbreakLogs.length / weeksInPeriod;

  const evidence = [];
  evidence.push(`${outbreakLogs.length} hives outbreaks logged (${outbreaksPerWeek.toFixed(1)}/week)`);
  if (medicationLogs.length > 0) evidence.push(`${medicationLogs.length} medication use entries logged`);

  // Chronic urticaria = 2+ outbreaks per week for 6+ weeks
  const isChronicPattern = outbreaksPerWeek >= 2 && evaluationPeriodDays >= 42;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (isChronicPattern) {
    supportedRating = 10;
    ratingRationale = [
      'Chronic urticaria pattern documented (2+/week for 6+ weeks)',
      'Rating based on treatment level required',
    ];
    gaps.push('Document treatment level: first-line (antihistamines), second-line (steroids), or third-line (immunosuppressives)');
    gaps.push('If antihistamines alone are insufficient, document escalation to higher treatment');
  } else {
    supportedRating = '0-10';
    ratingRationale = [
      'Urticaria documented but chronic pattern not yet established',
      'Chronic = 2+ outbreaks per week for 6+ weeks',
    ];
    gaps.push('Continue logging to establish chronic pattern');
  }

  return {
    hasData: true,
    condition: 'Chronic Urticaria',
    diagnosticCode: '7825',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: CHRONIC_URTICARIA_CRITERIA,
    disclaimer: CHRONIC_URTICARIA_CRITERIA.disclaimer,
  };
};

// ============================================
// EPILEPSY ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze epilepsy - major seizures (DC 8910)
 * Counts major seizure frequency over various time periods
 */

export const analyzePeripheralArterialDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'claudication', 'leg-pain-walking', 'calf-pain', 'leg-cramping',
    'cold-extremities', 'numbness-legs', 'leg-weakness', 'rest-pain',
    'leg-ulcer', 'non-healing-wound'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('claudication') ||
        log.notes?.toLowerCase().includes('pad') ||
        log.notes?.toLowerCase().includes('peripheral arterial') ||
        log.notes?.toLowerCase().includes('abi');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Peripheral Arterial Disease',
      diagnosticCode: '7114',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for severity indicators
  const restPain = validLogs.some(log =>
      log.notes?.toLowerCase().includes('rest pain') ||
      log.notes?.toLowerCase().includes('pain at rest')
  );

  const ulcers = validLogs.some(log =>
      log.notes?.toLowerCase().includes('ulcer') ||
      log.notes?.toLowerCase().includes('non-healing') ||
      log.notes?.toLowerCase().includes('gangrene')
  );

  const severeABI = validLogs.some(log =>
      log.notes?.toLowerCase().includes('abi 0.4') ||
      log.notes?.toLowerCase().includes('abi 0.3') ||
      log.notes?.toLowerCase().includes('abi of 0.4')
  );

  const claudicationUnder25 = validLogs.some(log =>
      log.notes?.toLowerCase().includes('less than 25') ||
      log.notes?.toLowerCase().includes('under 25 yard') ||
      log.notes?.toLowerCase().includes('<25')
  );

  const claudication25to100 = validLogs.some(log =>
      log.notes?.toLowerCase().includes('25 to 100') ||
      log.notes?.toLowerCase().includes('25-100') ||
      log.notes?.toLowerCase().includes('50 yard') ||
      log.notes?.toLowerCase().includes('75 yard')
  );

  const trophicChanges = validLogs.some(log =>
      log.notes?.toLowerCase().includes('trophic') ||
      log.notes?.toLowerCase().includes('hair loss') ||
      log.notes?.toLowerCase().includes('shiny skin') ||
      log.notes?.toLowerCase().includes('nail changes')
  );

  let supportedRating = 0;
  let rationale = '';

  if ((restPain && ulcers) || (restPain && severeABI)) {
    supportedRating = 100;
    rationale = 'Evidence suggests ischemic rest pain with deep ulcers or ABI ≤0.4.';
  } else if (claudicationUnder25 || (restPain && !ulcers)) {
    supportedRating = 60;
    rationale = 'Evidence suggests severe claudication (<25 yards) or persistent coldness.';
  } else if (claudication25to100 || trophicChanges) {
    supportedRating = 40;
    rationale = 'Evidence suggests moderate claudication (25-100 yards) with trophic changes.';
  } else if (validLogs.length >= 3) {
    supportedRating = 20;
    rationale = 'Evidence suggests claudication >100 yards with diminished pulses.';
  }

  return {
    condition: 'Peripheral Arterial Disease',
    diagnosticCode: '7114',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: PAD_CRITERIA,
    recommendations: [
      'Document claudication distance precisely (yards walked before pain)',
      'Get ABI (ankle-brachial index) measurements',
      'Photograph any trophic changes or ulcers',
      'Note which extremities are affected (each rated separately)',
      'Get vascular surgery evaluation',
    ],
    note: 'Each affected extremity is rated separately and combined with bilateral factor if applicable.',
  };
};

// ============================================
// DENTAL/ORAL CONDITION ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyzes Mandible Malunion logs (DC 9904)
 */

export const analyzeSyphiliticHeartDiseaseLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for syphilitic heart symptoms
  const heartSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomId.includes('syphilitic-heart');
  });

  // Also check for METs and EF measurements
  const metsReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'mets-capacity' && new Date(m.timestamp) >= cutoffDate
  ) : [];
  const efReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'ejection-fraction' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  if (heartSymptoms.length === 0 && metsReadings.length === 0 && efReadings.length === 0) {
    return {
      condition: 'Syphilitic Heart Disease',
      diagnosticCode: '7004',
      hasData: false,
      message: 'No syphilitic heart disease symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document cardiac symptoms: chest pain, shortness of breath, fatigue',
        'Get echocardiogram to measure ejection fraction',
        'Get stress test with METs capacity measurement',
        'Track CHF episodes if any',
        'Cardiology evaluation establishing nexus to syphilis',
        'Note aortic involvement (aortitis, aortic regurgitation)',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 10;
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    chestPain: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('chest-pain')).length,
    dyspnea: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('dyspnea')).length,
    fatigue: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('fatigue')).length,
    palpitations: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('palpitations')).length,
    chf: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('chf')).length,
    dizziness: heartSymptoms.filter(s => getLogSymptomId(s)?.includes('dizziness')).length,
  };

  // Get METs and EF values
  let lowestMets = null;
  let lowestEF = null;
  let chronicCHF = symptomCounts.chf >= 3; // 3+ CHF episodes suggests chronic

  if (metsReadings.length > 0) {
    lowestMets = Math.min(...metsReadings.map(m => m.value));
  }
  if (efReadings.length > 0) {
    lowestEF = Math.min(...efReadings.map(m => m.value));
  }

  evidence.push(`${heartSymptoms.length} cardiac symptoms logged over ${evaluationPeriodDays} days`);

  // Rating based on General Rating Formula for Heart Disease
  // 100%: Chronic CHF, OR METs ≤3, OR EF <30%
  // 60%: >1 CHF episode/year, OR METs 3-5, OR EF 30-50%
  // 30%: METs 5-7, OR cardiac hypertrophy/dilatation on testing
  // 10%: METs 7-10, OR continuous medication

  if (chronicCHF || (lowestMets !== null && lowestMets <= 3) || (lowestEF !== null && lowestEF < 30)) {
    supportedRating = 100;
    ratingRationale.push('Meets criteria for 100% rating');
    if (chronicCHF) ratingRationale.push('Chronic congestive heart failure documented');
    if (lowestMets !== null && lowestMets <= 3) ratingRationale.push(`METs capacity: ${lowestMets} (≤3 METs)`);
    if (lowestEF !== null && lowestEF < 30) ratingRationale.push(`Ejection fraction: ${lowestEF}% (<30%)`);
  } else if (symptomCounts.chf >= 1 || (lowestMets !== null && lowestMets <= 5) ||
      (lowestEF !== null && lowestEF <= 50)) {
    supportedRating = 60;
    ratingRationale.push('Meets criteria for 60% rating');
    if (symptomCounts.chf >= 1) ratingRationale.push(`${symptomCounts.chf} CHF episode(s) documented`);
    if (lowestMets !== null && lowestMets <= 5) ratingRationale.push(`METs capacity: ${lowestMets} (3-5 METs range)`);
    if (lowestEF !== null && lowestEF <= 50) ratingRationale.push(`Ejection fraction: ${lowestEF}% (30-50% range)`);
  } else if ((lowestMets !== null && lowestMets <= 7) ||
      (symptomCounts.dyspnea >= 5 && symptomCounts.fatigue >= 5)) {
    supportedRating = 30;
    ratingRationale.push('Meets criteria for 30% rating');
    if (lowestMets !== null) ratingRationale.push(`METs capacity: ${lowestMets} (5-7 METs range)`);
    ratingRationale.push('Symptoms with moderate exertion documented');
  } else if (heartSymptoms.length > 0) {
    supportedRating = 10;
    ratingRationale.push('Meets criteria for 10% rating');
    ratingRationale.push('Symptoms with greater than 7 METs OR continuous medication required');
  }

  // Evidence details
  if (symptomCounts.chestPain > 0) evidence.push(`${symptomCounts.chestPain} chest pain episodes`);
  if (symptomCounts.dyspnea > 0) evidence.push(`${symptomCounts.dyspnea} shortness of breath episodes`);
  if (symptomCounts.chf > 0) evidence.push(`${symptomCounts.chf} CHF episodes`);
  if (lowestMets !== null) evidence.push(`Lowest METs: ${lowestMets}`);
  if (lowestEF !== null) evidence.push(`Lowest EF: ${lowestEF}%`);

  // Gaps
  if (metsReadings.length === 0) gaps.push('Get stress test with METs capacity measurement');
  if (efReadings.length === 0) gaps.push('Get echocardiogram with ejection fraction measurement');
  gaps.push('Cardiology evaluation establishing nexus between heart disease and syphilis');
  gaps.push('Document aortitis or aortic regurgitation if present (classic syphilitic findings)');
  if (supportedRating >= 60) gaps.push('Track all hospitalizations for cardiac events');
  if (symptomCounts.chf > 0) gaps.push('Document all CHF episodes with dates');

  return {
    condition: 'Syphilitic Heart Disease',
    diagnosticCode: '7004',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: heartSymptoms.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      lowestMets,
      lowestEF,
      chronicCHF,
      metsReadingsCount: metsReadings.length,
      efReadingsCount: efReadings.length,
    },
  };
};