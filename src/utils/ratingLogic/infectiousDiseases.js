/* eslint-disable no-unused-vars */

// ============================================
// INFECTIOUS DISEASES RATING LOGIC
// ============================================
// Extracted from ratingCriteria.js — Phase 10 of the modular refactor
// Covers 38 CFR Part 4, §§ 4.88b (Infectious Diseases), 4.124a (Syphilis/Neurological)
//
// Conditions included:
//   DC 6351  — HIV-Related Illness
//   DC 7354  — Hepatitis C
//   DC 7345  — Hepatitis B
//   DC 6319  — Lyme Disease
//   DC 6304  — Malaria
//   DC 6316  — Brucellosis
//   DC 6330  — Campylobacter jejuni
//   DC 6331  — Q Fever
//   DC 6333  — Nontyphoid Salmonella
//   DC 6334  — Shigella
//   DC 6335  — West Nile Virus
//   DC 6312  — Nontuberculous Mycobacterium (NTM)
//   DC 6730  — Tuberculosis, Active
//   DC 6731  — Tuberculosis, Inactive
//   DC 6311  — Tuberculosis, Miliary
//   DC 6310  — Syphilis
//   DC 8013  — Cerebrospinal Syphilis
//   DC 8014  — Meningovascular Syphilis
//   DC 8015  — Tabes Dorsalis
//   DC 9301  — Syphilitic Dementia

// ============================================
// SHARED HELPER
// ============================================

const getLogSymptomId = (log) => log.symptomId || log.symptom || null;

// ============================================
// CONDITION REGISTRY
// ============================================

export const INFECTIOUS_CONDITIONS = {
  HIV_AIDS: {
    id: 'hiv-aids',
    name: 'HIV-Related Illness',
    diagnosticCode: '6351',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'hiv-opportunistic-infection',
      'hiv-night-sweats',
      'hiv-persistent-fever',
      'hiv-weight-loss',
      'hiv-chronic-diarrhea',
      'hiv-oral-thrush',
      'hiv-skin-lesions',
      'hiv-lymphadenopathy',
      'hiv-fatigue',
      'hiv-cognitive-impairment'
    ],
  },
  HEPATITIS_C: {
    id: 'hepatitis-c',
    name: 'Hepatitis C',
    diagnosticCode: '7354',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'hep-fatigue',
      'hep-nausea',
      'hep-abdominal-pain',
      'hep-jaundice',
      'hep-dark-urine'
    ],
  },
  HEPATITIS_B: {
    id: 'hepatitis-b',
    name: 'Hepatitis B',
    diagnosticCode: '7345',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'hep-fatigue',
      'hep-nausea',
      'hep-abdominal-pain',
      'hep-jaundice',
      'hep-dark-urine'
    ],
  },
  LYME_DISEASE: {
    id: 'lyme-disease',
    name: 'Lyme Disease',
    diagnosticCode: '6319',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'lyme-rash',
      'lyme-joint-pain',
      'lyme-muscle-aches',
      'lyme-nerve-pain',
      'lyme-heart-palpitations',
      'lyme-facial-paralysis',
      'lyme-headaches'
    ],
  },
  MALARIA: {
    id: 'malaria',
    name: 'Malaria',
    diagnosticCode: '6304',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'malaria-fever-spike',
      'malaria-chills',
      'malaria-headache',
      'malaria-nausea',
      'malaria-fatigue',
      'malaria-anemia',
    ],
  },
  BRUCELLOSIS: {
    id: 'brucellosis',
    name: 'Brucellosis',
    diagnosticCode: '6316',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'brucellosis-fever',
      'brucellosis-night-sweats',
      'brucellosis-fatigue',
      'brucellosis-joint-pain',
      'brucellosis-muscle-aches',
      'brucellosis-headache',
      'brucellosis-back-pain',
      'brucellosis-weight-loss',
      'brucellosis-depression',
      'brucellosis-liver-spleen'
    ],
  },
  CAMPYLOBACTER: {
    id: 'campylobacter',
    name: 'Campylobacter jejuni Infection',
    diagnosticCode: '6330',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'campylobacter-diarrhea',
      'campylobacter-abdominal-pain',
      'campylobacter-fever',
      'campylobacter-nausea',
      'campylobacter-vomiting',
      'campylobacter-bloody-stool',
      'campylobacter-fatigue',
      'campylobacter-joint-pain',
      'campylobacter-muscle-weakness',
      'campylobacter-nerve-symptoms'
    ],
  },
  Q_FEVER: {
    id: 'q-fever',
    name: 'Q Fever',
    diagnosticCode: '6331',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'q-fever-fever',
      'q-fever-headache',
      'q-fever-fatigue',
      'q-fever-muscle-aches',
      'q-fever-cough',
      'q-fever-chest-pain',
      'q-fever-night-sweats',
      'q-fever-chills',
      'q-fever-shortness-breath',
      'q-fever-joint-pain'
    ],
  },
  SALMONELLA: {
    id: 'salmonella',
    name: 'Nontyphoid Salmonella Infection',
    diagnosticCode: '6333',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'salmonella-diarrhea',
      'salmonella-fever',
      'salmonella-abdominal-cramps',
      'salmonella-nausea',
      'salmonella-vomiting',
      'salmonella-bloody-stool',
      'salmonella-joint-pain',
      'salmonella-bacteremia',
      'salmonella-dehydration',
      'salmonella-fatigue'
    ],
  },
  SHIGELLA: {
    id: 'shigella',
    name: 'Shigella Infection',
    diagnosticCode: '6334',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'shigella-diarrhea',
      'shigella-bloody-stool',
      'shigella-abdominal-cramps',
      'shigella-fever',
      'shigella-tenesmus',
      'shigella-nausea',
      'shigella-vomiting',
      'shigella-dehydration',
      'shigella-reactive-arthritis',
      'shigella-seizures'
    ],
  },
  WEST_NILE: {
    id: 'west-nile',
    name: 'West Nile Virus',
    diagnosticCode: '6335',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'west-nile-fever',
      'west-nile-headache',
      'west-nile-body-aches',
      'west-nile-fatigue',
      'west-nile-weakness',
      'west-nile-cognitive',
      'west-nile-tremors',
      'west-nile-vision-problems',
      'west-nile-numbness',
      'west-nile-paralysis'
    ],
  },
  NTM: {
    id: 'ntm',
    name: 'Nontuberculous Mycobacterium',
    diagnosticCode: '6312',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'ntm-cough',
      'ntm-sputum',
      'ntm-fatigue',
      'ntm-fever',
      'ntm-night-sweats',
      'ntm-weight-loss',
      'ntm-chest-pain',
      'ntm-shortness-breath',
      'ntm-hemoptysis',
      'ntm-lymph-nodes'
    ],
  },
  // Metatarsalgia (Morton's Disease) - DC 5279
  METATARSALGIA: {
    id: 'metatarsalgia',
    name: "Metatarsalgia (Morton's Disease)",
    diagnosticCode: '5279',
    cfrReference: '38 CFR 4.71a',
    description: 'Anterior metatarsalgia with pain in ball of foot, often including Morton neuroma',
    symptomIds: [
      'mt-ball-foot-pain', 'mt-numbness-toes', 'mt-burning', 'mt-shooting-pain',
      'mt-walking-pain', 'mt-standing-pain', 'mt-pebble-feeling', 'mt-relief-rest',
      'mt-swelling', 'mt-functional-loss'
    ],
  },
  TUBERCULOSIS_ACTIVE: {
    id: 'tuberculosis-active',
    name: 'Tuberculosis, Pulmonary, Active',
    diagnosticCode: '6730',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'tb-active-confirmed', 'tb-culture-positive', 'tb-smear-positive',
      'tb-cough-productive', 'tb-cough-blood', 'tb-hemoptysis',
      'tb-fever', 'tb-night-sweats', 'tb-weight-loss', 'tb-fatigue'
    ],
    bodySystem: 'respiratory',
  },
  TUBERCULOSIS_INACTIVE: {
    id: 'tuberculosis-inactive',
    name: 'Tuberculosis, Pulmonary, Inactive',
    diagnosticCode: '6731',
    cfrReference: '38 CFR 4.97',
    symptomIds: [
      'tb-inactive-confirmed', 'tb-treatment-completed', 'tb-residual-scarring'
    ],
    bodySystem: 'respiratory',
  },
  TUBERCULOSIS_MILIARY: {
    id: 'tuberculosis-miliary',
    name: 'Tuberculosis, Miliary (Disseminated)',
    diagnosticCode: '6311',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      'tb-miliary-confirmed', 'tb-disseminated'
    ],
    bodySystem: 'infectious',
  },
  SYPHILIS: {
    id: 'syphilis',
    name: 'Syphilis',
    diagnosticCode: '6310',
    cfrReference: '38 CFR 4.88b',
    symptomIds: ['syphilis-positive-test', 'syphilis-treated', 'syphilis-active'],
  },
  CEREBROSPINAL_SYPHILIS: {
    id: 'cerebrospinal-syphilis',
    name: 'Cerebrospinal Syphilis',
    diagnosticCode: '8013',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['neurosyphilis-headache', 'neurosyphilis-seizures', 'neurosyphilis-vision', 'neurosyphilis-paralysis', 'neurosyphilis-fatigue'],
  },
  MENINGOVASCULAR_SYPHILIS: {
    id: 'meningovascular-syphilis',
    name: 'Meningovascular Syphilis',
    diagnosticCode: '8014',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['neurosyphilis-stroke', 'neurosyphilis-headache', 'neurosyphilis-seizures', 'neurosyphilis-vision', 'neurosyphilis-paralysis'],
  },
  TABES_DORSALIS: {
    id: 'tabes-dorsalis',
    name: 'Tabes Dorsalis',
    diagnosticCode: '8015',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['tabes-lightning-pain', 'tabes-ataxia'],
  },
  SYPHILITIC_DEMENTIA: {
    id: 'syphilitic-dementia',
    name: 'Dementia due to CNS Syphilis',
    diagnosticCode: '9301',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['syphilis-memory-loss', 'syphilis-cognitive-decline'],
  },

};

// ============================================
// CRITERIA BLOCKS
// ============================================

export const HIV_AIDS_CRITERIA = {
  diagnosticCode: '6351',
  condition: 'HIV-Related Illness',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6351',

  ratings: [
    {
      percent: 100,
      summary: 'Chronic fatigue, diarrhea, recurrent opportunistic infections, or pathological weight loss',
      criteria: {
        opportunisticInfections: 'recurrent',
        constitutionalSymptoms: 'severe',
        weightLoss: 'pathological',
        debilitating: true,
      },
      criteriaDescription: [
        'Active AIDS diagnosis with one or more of:',
        '  • Recurrent opportunistic infections',
        '  • Debilitating fatigue with progressive weight loss',
        '  • Chronic, uncontrolled diarrhea',
        '  • Pathological weight loss (>10% body weight)',
      ],
      evidenceNeeded: [
        'Medical diagnosis of AIDS',
        'Documentation of opportunistic infections (PCP, CMV, MAC, etc.)',
        'Weight tracking showing significant loss',
        'Treatment records for infections',
        'CD4 count typically <200',
      ],
    },
    {
      percent: 60,
      summary: 'Recurrent constitutional symptoms, intermittent diarrhea, pathological weight loss; or minimum rating after opportunistic infection',
      criteria: {
        constitutionalSymptoms: 'recurrent',
        diarrhea: 'intermittent',
        weightLoss: 'significant',
      },
      criteriaDescription: [
        'Refractory constitutional symptoms including:',
        '  • Daily fatigue and malaise',
        '  • Intermittent diarrhea',
        '  • Pathological weight loss',
        'OR minimum rating following documented opportunistic infection',
      ],
      evidenceNeeded: [
        'Consistent documentation of constitutional symptoms',
        'Weight tracking',
        'Treatment records',
        'Lab values (CD4, viral load)',
        'History of opportunistic infection if applicable',
      ],
    },
    {
      percent: 30,
      summary: 'Recurrent constitutional symptoms, intermittent diarrhea, CD4 <200, or use of approved medications',
      criteria: {
        constitutionalSymptoms: 'present',
        medications: 'antiretroviral',
        cd4Count: '<200',
        diarrhea: 'intermittent',
      },
      criteriaDescription: [
        'HIV with one or more of:',
        '  • Recurrent constitutional symptoms (fever, night sweats, fatigue)',
        '  • Intermittent diarrhea',
        '  • CD4 count less than 200',
        '  • Use of FDA-approved antiretroviral medications',
      ],
      evidenceNeeded: [
        'Documentation of constitutional symptoms',
        'CD4 count labs showing <200',
        'Medication list with antiretrovirals',
        'Treatment compliance records',
      ],
    },
    {
      percent: 10,
      summary: 'Constitutional symptoms following initial diagnosis, CD4 200-500, depression/memory loss',
      criteria: {
        constitutionalSymptoms: 'mild',
        cd4Count: '200-500',
        cognitiveImpairment: 'present',
      },
      criteriaDescription: [
        'Following initial diagnosis with:',
        '  • Constitutional symptoms (intermittent)',
        '  • CD4 count 200-500',
        '  • Use of antiretroviral medications',
        '  • Depression or memory loss',
      ],
      evidenceNeeded: [
        'HIV diagnosis documentation',
        'CD4 count in 200-500 range',
        'Documentation of constitutional symptoms',
        'Evidence of cognitive or mood changes',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic following initial diagnosis, with or without lymphadenopathy',
      criteria: {
        symptomatic: false,
        diagnosed: true,
      },
      criteriaDescription: [
        'HIV diagnosis confirmed but:',
        '  • No constitutional symptoms',
        '  • May have generalized lymphadenopathy',
        '  • Stable on antiretroviral therapy',
      ],
      evidenceNeeded: [
        'HIV diagnosis documentation',
        'Current lab values',
        'Treatment records',
      ],
    },
  ],

  definitions: {
    opportunisticInfection: {
      term: 'Opportunistic Infection',
      definition: 'Infections that occur more frequently and are more severe in people with weakened immune systems. Common examples include Pneumocystis jirovecii pneumonia (PCP), Cytomegalovirus (CMV), Mycobacterium avium complex (MAC), toxoplasmosis, and cryptococcosis.',
    },
    constitutionalSymptoms: {
      term: 'Constitutional Symptoms',
      definition: 'General symptoms affecting the whole body, including persistent fever, night sweats, severe fatigue, and unintentional weight loss.',
    },
    cd4Count: {
      term: 'CD4 Count',
      definition: 'CD4 T-cell count measures the number of CD4+ T lymphocytes in a microliter of blood. Normal range is 500-1,500. Below 200 indicates AIDS and severe immunosuppression.',
    },
    pathologicalWeightLoss: {
      term: 'Pathological Weight Loss',
      definition: 'Unintentional loss of 10% or more of baseline body weight, not due to dieting. Indicates wasting syndrome.',
    },
  },

  importantNotes: [
    'VA rates HIV/AIDS based on manifestations and impact on daily functioning',
    'Opportunistic infections may qualify for 100% or minimum 60% rating',
    'CD4 count is important but not the sole determining factor',
    'Constitutional symptoms must be documented consistently',
    'Use of antiretroviral therapy alone supports 30% minimum rating',
    'Depression and cognitive impairment associated with HIV are ratable',
    'Multiple ratings may apply for opportunistic infections affecting specific body systems',
  ],
};
export const HEPATITIS_C_CRITERIA = {
  diagnosticCode: '7354',
  condition: 'Hepatitis C',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7354',

  ratings: [
    {
      percent: 100,
      summary: 'Near-constant debilitating symptoms',
      criteria: {
        symptomatic: 'severe',
        debilitating: true,
        nearConstant: true,
      },
      criteriaDescription: [
        'Near-constant debilitating symptoms such as:',
        '  • Severe fatigue and malaise',
        '  • Anorexia with substantial weight loss',
        '  • Nausea',
        '  • Requires substantial lifestyle modifications',
      ],
      evidenceNeeded: [
        'Daily logging of severe fatigue/malaise',
        'Weight loss documentation',
        'Evidence of work/life impact',
        'Medical treatment records',
        'Liver enzyme lab values',
      ],
    },
    {
      percent: 60,
      summary: 'Daily fatigue, malaise, and anorexia with substantial weight loss',
      criteria: {
        symptomatic: 'moderate-severe',
        dailySymptoms: true,
        weightLoss: true,
      },
      criteriaDescription: [
        'Daily symptoms including:',
        '  • Persistent fatigue',
        '  • General malaise',
        '  • Loss of appetite (anorexia)',
        '  • Substantial weight loss or gain',
      ],
      evidenceNeeded: [
        'Daily symptom logs',
        'Weight tracking over time',
        'Dietary changes documentation',
        'Lab values showing disease activity',
      ],
    },
    {
      percent: 30,
      summary: 'Daily fatigue, malaise, and anorexia with minor weight loss',
      criteria: {
        symptomatic: 'moderate',
        dailySymptoms: true,
        weightLoss: 'minor',
      },
      criteriaDescription: [
        'Daily symptoms with moderate impact:',
        '  • Fatigue and malaise',
        '  • Reduced appetite',
        '  • Minor weight loss (or near normal weight)',
        '  • Dietary restrictions needed',
      ],
      evidenceNeeded: [
        'Regular symptom tracking',
        'Weight monitoring',
        'Dietary restriction documentation',
        'Treatment compliance records',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent fatigue, malaise, and anorexia',
      criteria: {
        symptomatic: 'mild',
        intermittent: true,
      },
      criteriaDescription: [
        'Intermittent symptoms:',
        '  • Occasional fatigue episodes',
        '  • Periodic malaise',
        '  • Mild appetite changes',
      ],
      evidenceNeeded: [
        'Symptom frequency tracking',
        'Pattern documentation',
        'Lab monitoring',
      ],
    },
    {
      percent: 0,
      summary: 'Nonsymptomatic',
      criteria: {
        symptomatic: false,
        diagnosed: true,
      },
      criteriaDescription: [
        'Hepatitis C diagnosed but:',
        '  • No active symptoms',
        '  • Normal daily function',
        '  • May be on treatment',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'Lab values',
        'Treatment records if applicable',
      ],
    },
  ],

  definitions: {
    debilitating: {
      term: 'Debilitating',
      definition: 'Symptoms that substantially interfere with employment and daily activities, requiring significant lifestyle modifications.',
    },
    nearConstant: {
      term: 'Near-Constant',
      definition: 'Symptoms present most days, with minimal symptom-free periods.',
    },
    substantialWeightLoss: {
      term: 'Substantial Weight Loss',
      definition: 'Loss of 10% or more of baseline body weight, or significant weight gain affecting health.',
    },
  },

  importantNotes: [
    'VA rates hepatitis based on symptom severity, not viral load alone',
    'Daily symptoms qualify for higher ratings than intermittent symptoms',
    'Weight changes (loss or gain) are key rating factors',
    'Treatment side effects may be separately ratable',
    'Liver enzyme levels support but do not determine rating',
    'Cirrhosis and other complications rated separately under appropriate codes',
  ],
};
export const HEPATITIS_B_CRITERIA = {
  diagnosticCode: '7345',
  condition: 'Hepatitis B',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7345',

  ratings: [
    {
      percent: 100,
      summary: 'Near-constant debilitating symptoms',
      criteria: {
        symptomatic: 'severe',
        debilitating: true,
        nearConstant: true,
      },
      criteriaDescription: [
        'Near-constant debilitating symptoms such as:',
        '  • Severe fatigue and malaise',
        '  • Anorexia with substantial weight loss',
        '  • Nausea',
        '  • Requires substantial lifestyle modifications',
      ],
      evidenceNeeded: [
        'Daily logging of severe fatigue/malaise',
        'Weight loss documentation',
        'Evidence of work/life impact',
        'Medical treatment records',
        'Liver enzyme lab values',
      ],
    },
    {
      percent: 60,
      summary: 'Daily fatigue, malaise, and anorexia with substantial weight loss',
      criteria: {
        symptomatic: 'moderate-severe',
        dailySymptoms: true,
        weightLoss: true,
      },
      criteriaDescription: [
        'Daily symptoms including:',
        '  • Persistent fatigue',
        '  • General malaise',
        '  • Loss of appetite (anorexia)',
        '  • Substantial weight loss or gain',
      ],
      evidenceNeeded: [
        'Daily symptom logs',
        'Weight tracking over time',
        'Dietary changes documentation',
        'Lab values showing disease activity',
      ],
    },
    {
      percent: 30,
      summary: 'Daily fatigue, malaise, and anorexia with minor weight loss',
      criteria: {
        symptomatic: 'moderate',
        dailySymptoms: true,
        weightLoss: 'minor',
      },
      criteriaDescription: [
        'Daily symptoms with moderate impact:',
        '  • Fatigue and malaise',
        '  • Reduced appetite',
        '  • Minor weight loss (or near normal weight)',
        '  • Dietary restrictions needed',
      ],
      evidenceNeeded: [
        'Regular symptom tracking',
        'Weight monitoring',
        'Dietary restriction documentation',
        'Treatment compliance records',
      ],
    },
    {
      percent: 10,
      summary: 'Intermittent fatigue, malaise, and anorexia',
      criteria: {
        symptomatic: 'mild',
        intermittent: true,
      },
      criteriaDescription: [
        'Intermittent symptoms:',
        '  • Occasional fatigue episodes',
        '  • Periodic malaise',
        '  • Mild appetite changes',
      ],
      evidenceNeeded: [
        'Symptom frequency tracking',
        'Pattern documentation',
        'Lab monitoring',
      ],
    },
    {
      percent: 0,
      summary: 'Nonsymptomatic',
      criteria: {
        symptomatic: false,
        diagnosed: true,
      },
      criteriaDescription: [
        'Hepatitis B diagnosed but:',
        '  • No active symptoms',
        '  • Normal daily function',
        '  • May be on treatment',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'Lab values',
        'Treatment records if applicable',
      ],
    },
  ],

  definitions: {
    debilitating: {
      term: 'Debilitating',
      definition: 'Symptoms that substantially interfere with employment and daily activities, requiring significant lifestyle modifications.',
    },
    nearConstant: {
      term: 'Near-Constant',
      definition: 'Symptoms present most days, with minimal symptom-free periods.',
    },
    substantialWeightLoss: {
      term: 'Substantial Weight Loss',
      definition: 'Loss of 10% or more of baseline body weight, or significant weight gain affecting health.',
    },
  },

  importantNotes: [
    'VA rates hepatitis based on symptom severity, not viral load alone',
    'Daily symptoms qualify for higher ratings than intermittent symptoms',
    'Weight changes (loss or gain) are key rating factors',
    'Treatment side effects may be separately ratable',
    'Liver enzyme levels support but do not determine rating',
    'Cirrhosis and other complications rated separately under appropriate codes',
  ],
};
export const LYME_DISEASE_CRITERIA = {
  diagnosticCode: '6319',
  condition: 'Lyme Disease',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6319',

  ratings: [
    {
      percent: 100,
      summary: 'Active disease requiring treatment (for 6 months minimum)',
      criteria: {
        activeDisease: true,
        treatment: 'required',
        duration: '6months',
      },
      criteriaDescription: [
        'Active Lyme disease requiring treatment:',
        '  • 100% rating during active treatment',
        '  • Minimum 6-month rating period',
        '  • Then rate residuals by affected body system',
      ],
      evidenceNeeded: [
        'Diagnosis of active Lyme disease',
        'Treatment records (antibiotics)',
        'Symptom documentation during treatment',
        'Lab results (Western blot, ELISA)',
      ],
    },
    {
      percent: 'residuals',
      summary: 'After treatment - rate residual symptoms by affected system',
      criteria: {
        postTreatment: true,
        residualSymptoms: true,
      },
      criteriaDescription: [
        'Post-Lyme disease syndrome (PTLDS):',
        '  • Neurological residuals (rate as neuropathy)',
        '  • Arthritis/joint pain (rate as arthritis)',
        '  • Cardiac issues (rate as heart condition)',
        '  • Chronic fatigue (rate as CFS)',
        '  • Cognitive impairment (rate neurologically)',
      ],
      evidenceNeeded: [
        'Documentation of completed treatment',
        'Ongoing symptom tracking',
        'Specialist evaluations for residuals',
        'Evidence of functional impairment',
      ],
    },
  ],

  definitions: {
    activeDisease: {
      term: 'Active Lyme Disease',
      definition: 'Confirmed Lyme disease diagnosis requiring antibiotic treatment. Rates 100% during active treatment phase.',
    },
    ptlds: {
      term: 'Post-Treatment Lyme Disease Syndrome (PTLDS)',
      definition: 'Persistent symptoms after completing Lyme disease treatment, including fatigue, pain, cognitive difficulties.',
    },
    residuals: {
      term: 'Residuals',
      definition: 'Ongoing symptoms after treatment completion, rated under the body system affected (neurological, musculoskeletal, cardiac, etc.).',
    },
  },

  importantNotes: [
    'Active Lyme disease rates 100% during treatment (minimum 6 months)',
    'After treatment, rate residual symptoms under appropriate body system codes',
    'Common residuals: peripheral neuropathy, arthritis, chronic fatigue, cognitive issues',
    'PTLDS may require multiple diagnostic codes for different body systems',
    'Document all persistent symptoms after treatment completion',
    'Neurological residuals often rated under DC 8520 (incomplete paralysis)',
    'Joint residuals rated under appropriate arthritis codes',
  ],
};
export const MALARIA_CRITERIA = {
  diagnosticCode: '6304',
  condition: 'Malaria',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6304',

  ratings: [
    {
      percent: 100,
      summary: 'Active disease requiring hospital treatment or continuous medication',
      criteria: {
        activeDisease: true,
        severe: true,
        hospitalization: true,
      },
      criteriaDescription: [
        'Active malaria requiring treatment:',
        '  • Severe symptoms requiring hospitalization',
        '  • Complications (cerebral malaria, severe anemia, organ failure)',
        '  • Continuous antimalarial medication required',
        '  • Near-constant debilitating symptoms',
      ],
      evidenceNeeded: [
        'Hospital admission records for malaria complications',
        'Lab results showing parasitemia',
        'Daily symptom documentation during acute phase',
        'Medication records (antimalarials)',
        'Blood work showing severe anemia or organ involvement',
      ],
    },
    {
      percent: 60,
      summary: 'Frequent relapses with debilitating symptoms',
      criteria: {
        frequentRelapses: true,
        debilitating: true,
      },
      criteriaDescription: [
        'Relapsing malaria with significant impact:',
        '  • Multiple relapses per year (3+)',
        '  • Debilitating cyclical fever episodes',
        '  • Chronic anemia from recurring parasitemia',
        '  • Substantial impact on daily activities',
      ],
      evidenceNeeded: [
        'Documentation of multiple relapse episodes',
        'Lab confirmation of recurring parasitemia',
        'Symptom logs showing cyclical fever patterns',
        'Evidence of chronic anemia',
        'Impact on work/daily function',
      ],
    },
    {
      percent: 30,
      summary: 'Occasional relapses or chronic residual symptoms',
      criteria: {
        occasionalRelapses: true,
        residualSymptoms: true,
      },
      criteriaDescription: [
        'Chronic malaria symptoms:',
        '  • 1-2 relapses per year',
        '  • Persistent fatigue and weakness',
        '  • Mild chronic anemia',
        '  • Enlarged spleen (splenomegaly)',
      ],
      evidenceNeeded: [
        'Documentation of relapse episodes',
        'Lab work showing mild anemia',
        'Ultrasound/imaging showing splenomegaly if present',
        'Regular symptom tracking',
      ],
    },
    {
      percent: 10,
      summary: 'Residual symptoms or single relapse',
      criteria: {
        residual: true,
        minimal: true,
      },
      criteriaDescription: [
        'Minimal residual effects:',
        '  • History of malaria with occasional symptoms',
        '  • Mild fatigue or weakness',
        '  • Single relapse or no recent relapses',
      ],
      evidenceNeeded: [
        'Medical history confirming past malaria diagnosis',
        'Symptom tracking showing mild impact',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: 'Malaria treated, currently asymptomatic',
      criteria: {
        treated: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Malaria successfully treated:',
        '  • No active parasitemia',
        '  • No current symptoms',
        '  • No relapses',
      ],
      evidenceNeeded: [
        'Treatment completion records',
        'Negative lab tests for parasites',
      ],
    },
  ],

  definitions: {
    relapse: {
      term: 'Relapse',
      definition: 'Recurrence of malaria symptoms after apparent cure, caused by activation of dormant parasites in the liver (P. vivax and P. ovale).',
    },
    cyclicalFever: {
      term: 'Cyclical Fever',
      definition: 'Periodic fever pattern characteristic of malaria, typically occurring every 48-72 hours depending on parasite species.',
    },
    parasitemia: {
      term: 'Parasitemia',
      definition: 'Presence of malaria parasites in the blood, confirmed by microscopy or rapid diagnostic test.',
    },
  },

  importantNotes: [
    'VA rates malaria based on severity and frequency of relapses',
    'P. vivax and P. ovale can cause relapses years after initial infection',
    'Cyclical fever pattern (every 48-72 hours) is characteristic',
    'Document each fever episode with temperature readings',
    'Chronic anemia common with recurring infections',
    'Splenomegaly may persist after treatment',
    'Treatment requires full course of antimalarials plus primaquine for liver stages',
  ],
};
export const BRUCELLOSIS_CRITERIA = {
  diagnosticCode: '6316',
  condition: 'Brucellosis',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6316',

  ratings: [
    {
      percent: 100,
      summary: 'Severe active disease with multiple organ involvement',
      criteria: {
        activeDisease: true,
        severe: true,
        multiOrgan: true,
      },
      criteriaDescription: [
        'Severe active brucellosis:',
        '  • Constant debilitating symptoms',
        '  • Multiple organ involvement (liver, spleen, bones, heart)',
        '  • Neurobrucellosis or endocarditis',
        '  • Requires continuous treatment',
      ],
      evidenceNeeded: [
        'Positive blood cultures or serology',
        'Imaging showing organ involvement',
        'Neurological exam results if CNS involvement',
        'Daily symptom logs showing severity',
        'Treatment records (long-term antibiotics)',
      ],
    },
    {
      percent: 60,
      summary: 'Active disease with relapsing pattern',
      criteria: {
        activeDisease: true,
        relapsing: true,
      },
      criteriaDescription: [
        'Chronic relapsing brucellosis:',
        '  • Frequent relapses (3+ per year)',
        '  • Chronic arthritis or spondylitis',
        '  • Persistent fever and night sweats',
        '  • Significant functional impairment',
      ],
      evidenceNeeded: [
        'Documentation of multiple relapse episodes',
        'Lab confirmation of active infection',
        'Joint imaging showing arthritis',
        'Symptom pattern documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Occasional relapses or chronic symptoms',
      criteria: {
        occasionalRelapses: true,
        chronicSymptoms: true,
      },
      criteriaDescription: [
        'Chronic brucellosis:',
        '  • 1-2 relapses per year',
        '  • Chronic fatigue and weakness',
        '  • Recurrent joint or back pain',
        '  • Depression or mood changes',
      ],
      evidenceNeeded: [
        'Relapse documentation',
        'Lab work during symptomatic periods',
        'Mental health evaluation if depression present',
        'Regular symptom tracking',
      ],
    },
    {
      percent: 10,
      summary: 'Residual symptoms, minimal impact',
      criteria: {
        residual: true,
        minimal: true,
      },
      criteriaDescription: [
        'Post-brucellosis residuals:',
        '  • Chronic fatigue or malaise',
        '  • Occasional joint pain',
        '  • Mood changes',
        '  • No active infection',
      ],
      evidenceNeeded: [
        'History of confirmed brucellosis',
        'Treatment completion records',
        'Symptom logs showing mild impact',
      ],
    },
    {
      percent: 0,
      summary: 'Treated, currently asymptomatic',
      criteria: {
        treated: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Brucellosis successfully treated with no residuals',
      ],
      evidenceNeeded: [
        'Treatment completion records',
        'Negative lab tests',
      ],
    },
  ],

  definitions: {
    relapse: {
      term: 'Relapse',
      definition: 'Recurrence of brucellosis symptoms after apparent cure. Common even after adequate treatment.',
    },
    neurobrucellosis: {
      term: 'Neurobrucellosis',
      definition: 'Central nervous system involvement causing meningitis, encephalitis, or other neurological complications.',
    },
    spondylitis: {
      term: 'Spondylitis',
      definition: 'Inflammation of vertebrae, a common complication of brucellosis causing chronic back pain.',
    },
  },

  importantNotes: [
    'Brucellosis is a zoonotic disease (contracted from animals)',
    'Common in military personnel exposed to livestock in deployment areas',
    'Relapsing pattern is characteristic - symptoms may recur for years',
    'Night sweats and undulant (wave-like) fever are classic symptoms',
    'Chronic depression and fatigue may persist after treatment',
    'Joint and spine involvement can cause permanent damage',
    'Requires prolonged antibiotic treatment (6+ weeks)',
  ],
};
export const CAMPYLOBACTER_CRITERIA = {
  diagnosticCode: '6330',
  condition: 'Campylobacter jejuni Infection',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6330',

  ratings: [
    {
      percent: 100,
      summary: 'Severe complications (Guillain-Barré syndrome or severe reactive arthritis)',
      criteria: {
        severeComplications: true,
        guillainBarre: true,
      },
      criteriaDescription: [
        'Severe post-infectious complications:',
        '  • Guillain-Barré syndrome (GBS)',
        '  • Severe reactive arthritis requiring mobility aids',
        '  • Chronic inflammatory demyelinating polyneuropathy (CIDP)',
        '  • Total functional impairment',
      ],
      evidenceNeeded: [
        'Neurological evaluation confirming GBS or CIDP',
        'EMG/nerve conduction studies',
        'Rheumatology evaluation for reactive arthritis',
        'Functional assessment documentation',
        'Link to prior Campylobacter infection',
      ],
    },
    {
      percent: 60,
      summary: 'Moderate complications with ongoing impairment',
      criteria: {
        moderateComplications: true,
        chronicSymptoms: true,
      },
      criteriaDescription: [
        'Chronic post-infectious sequelae:',
        '  • Reactive arthritis affecting multiple joints',
        '  • Peripheral neuropathy',
        '  • Chronic fatigue post-infection',
        '  • Irritable bowel syndrome (IBS) post-infection',
      ],
      evidenceNeeded: [
        'Joint imaging or exam findings',
        'Neurological exam for neuropathy',
        'GI evaluation for post-infectious IBS',
        'Documentation of functional limitations',
      ],
    },
    {
      percent: 30,
      summary: 'Mild chronic symptoms or occasional relapses',
      criteria: {
        mildChronic: true,
        occasionalSymptoms: true,
      },
      criteriaDescription: [
        'Post-infectious symptoms:',
        '  • Mild reactive arthritis (1-2 joints)',
        '  • Chronic diarrhea or bowel changes',
        '  • Recurrent abdominal pain',
        '  • Mild fatigue',
      ],
      evidenceNeeded: [
        'GI symptom tracking',
        'Stool studies if ongoing diarrhea',
        'Joint exam documentation',
        'Original infection confirmation',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residual symptoms',
      criteria: {
        minimal: true,
        residual: true,
      },
      criteriaDescription: [
        'Mild post-infectious effects:',
        '  • Occasional GI symptoms',
        '  • Mild fatigue',
        '  • Rare joint pain',
      ],
      evidenceNeeded: [
        'History of confirmed Campylobacter infection',
        'Symptom logs',
      ],
    },
    {
      percent: 0,
      summary: 'Fully recovered',
      criteria: {
        recovered: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Complete recovery from Campylobacter infection',
      ],
      evidenceNeeded: [
        'Treatment records',
        'Resolution of symptoms',
      ],
    },
  ],

  definitions: {
    guillainBarre: {
      term: 'Guillain-Barré Syndrome (GBS)',
      definition: 'Rare autoimmune complication where immune system attacks peripheral nerves, causing weakness and paralysis. Can follow Campylobacter infection.',
    },
    reactiveArthritis: {
      term: 'Reactive Arthritis',
      definition: 'Joint inflammation triggered by infection elsewhere in body. Can occur 1-4 weeks after Campylobacter infection.',
    },
    postInfectiousIBS: {
      term: 'Post-Infectious IBS',
      definition: 'Irritable bowel syndrome developing after acute gastroenteritis. Common after Campylobacter.',
    },
  },

  importantNotes: [
    'Campylobacter is a common cause of bacterial gastroenteritis',
    'Associated with Gulf War illness and military deployments',
    'Leading bacterial trigger for Guillain-Barré syndrome',
    'Reactive arthritis can develop 1-4 weeks after infection',
    'Post-infectious IBS may persist for months to years',
    'Acute infection typically lasts 3-7 days',
    'Complications are more important than acute infection for VA rating',
  ],
};
export const Q_FEVER_CRITERIA = {
  diagnosticCode: '6331',
  condition: 'Q Fever',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6331',

  ratings: [
    {
      percent: 100,
      summary: 'Chronic Q fever with endocarditis or multi-organ involvement',
      criteria: {
        chronic: true,
        endocarditis: true,
        severe: true,
      },
      criteriaDescription: [
        'Chronic Q fever (>6 months):',
        '  • Q fever endocarditis (valve infection)',
        '  • Vascular infection (infected aneurysms)',
        '  • Chronic hepatitis with cirrhosis',
        '  • Osteomyelitis',
        '  • Requires long-term antibiotics (18+ months)',
      ],
      evidenceNeeded: [
        'Echocardiogram showing valve vegetation',
        'Positive serology (Phase I antibodies >1:800)',
        'Imaging of affected organs',
        'Treatment records (doxycycline + hydroxychloroquine)',
        'Cardiology/infectious disease notes',
      ],
    },
    {
      percent: 60,
      summary: 'Chronic Q fever fatigue syndrome',
      criteria: {
        chronic: true,
        fatigueSyndrome: true,
      },
      criteriaDescription: [
        'Post-Q fever fatigue syndrome (QFS):',
        '  • Severe chronic fatigue >6 months post-infection',
        '  • Myalgias and arthralgias',
        '  • Night sweats',
        '  • Mood disturbances',
        '  • Substantially impacts daily function',
      ],
      evidenceNeeded: [
        'Original Q fever diagnosis confirmation',
        'Symptom logs showing >6 months of fatigue',
        'Exclusion of other causes',
        'Functional impact documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Mild chronic symptoms or occasional relapses',
      criteria: {
        chronicMild: true,
        residualSymptoms: true,
      },
      criteriaDescription: [
        'Chronic residual symptoms:',
        '  • Persistent fatigue or weakness',
        '  • Recurrent fever or sweats',
        '  • Chronic headaches',
        '  • Joint or muscle pain',
      ],
      evidenceNeeded: [
        'Documentation of original infection',
        'Symptom tracking',
        'Lab work if available',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residual symptoms',
      criteria: {
        minimal: true,
        residual: true,
      },
      criteriaDescription: [
        'Mild post-Q fever effects:',
        '  • Occasional fatigue',
        '  • Rare headaches or muscle aches',
        '  • Minimal functional impact',
      ],
      evidenceNeeded: [
        'History of Q fever',
        'Treatment records',
        'Symptom logs',
      ],
    },
    {
      percent: 0,
      summary: 'Fully recovered from acute Q fever',
      criteria: {
        recovered: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Complete recovery from Q fever',
      ],
      evidenceNeeded: [
        'Treatment completion',
        'Symptom resolution',
      ],
    },
  ],

  definitions: {
    chronicQFever: {
      term: 'Chronic Q Fever',
      definition: 'Persistent infection >6 months, most commonly manifesting as endocarditis. Occurs in ~1-5% of acute infections.',
    },
    qFeverFatigueSyndrome: {
      term: 'Q Fever Fatigue Syndrome (QFS)',
      definition: 'Debilitating fatigue lasting >6 months after acute Q fever, similar to chronic fatigue syndrome.',
    },
    phaseIAntibodies: {
      term: 'Phase I Antibodies',
      definition: 'Antibodies against chronic form of Coxiella burnetii. High titers (>1:800) indicate chronic infection.',
    },
  },

  importantNotes: [
    'Q fever caused by Coxiella burnetii bacteria',
    'Common in military personnel deployed to Iraq, Afghanistan',
    'Transmitted via inhalation of contaminated dust/aerosols from livestock',
    'Acute Q fever: flu-like illness lasting 1-3 weeks',
    'Chronic Q fever develops in 1-5% of cases, usually within 2 years',
    'Q fever endocarditis has high mortality if untreated',
    'Post-Q fever fatigue syndrome can last years',
    'Veterans with valve abnormalities at higher risk for chronic Q fever',
  ],
};
export const SALMONELLA_CRITERIA = {
  diagnosticCode: '6333',
  condition: 'Nontyphoid Salmonella Infection',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6333',

  ratings: [
    {
      percent: 100,
      summary: 'Severe complications (bacteremia, sepsis, or hospitalization)',
      criteria: {
        severeComplications: true,
        hospitalized: true,
      },
      criteriaDescription: [
        'Severe Salmonella infection with complications:',
        '  • Bacteremia/sepsis requiring hospitalization',
        '  • Reactive arthritis requiring mobility aids',
        '  • Chronic post-infectious sequelae',
        '  • Unable to work or perform daily activities',
      ],
      evidenceNeeded: [
        'Hospital admission records',
        'Blood culture results confirming bacteremia',
        'Treatment records (IV antibiotics)',
        'Documentation of complications',
        'Functional impact assessment',
      ],
    },
    {
      percent: 60,
      summary: 'Moderate symptoms with reactive arthritis or chronic complications',
      criteria: {
        reactiveArthritis: true,
        chronicSymptoms: true,
      },
      criteriaDescription: [
        'Post-infectious complications:',
        '  • Reactive arthritis affecting multiple joints',
        '  • Chronic diarrhea persisting weeks to months',
        '  • Recurrent infections',
        '  • Significant functional impairment',
      ],
      evidenceNeeded: [
        'Stool culture confirming Salmonella',
        'Joint imaging for reactive arthritis',
        'GI evaluation for chronic symptoms',
        'Documentation of frequency and severity',
      ],
    },
    {
      percent: 30,
      summary: 'Mild chronic symptoms or occasional relapses',
      criteria: {
        mildChronic: true,
        occasionalSymptoms: true,
      },
      criteriaDescription: [
        'Chronic residual symptoms:',
        '  • Intermittent GI symptoms',
        '  • Mild reactive arthritis (1-2 joints)',
        '  • Chronic fatigue',
      ],
      evidenceNeeded: [
        'Original infection confirmation',
        'Symptom tracking logs',
        'Medical evaluation records',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residual symptoms',
      criteria: {
        minimal: true,
        residual: true,
      },
      criteriaDescription: [
        'Mild post-infection effects',
      ],
      evidenceNeeded: [
        'History of confirmed Salmonella infection',
        'Symptom logs',
      ],
    },
    {
      percent: 0,
      summary: 'Fully recovered',
      criteria: {
        recovered: true,
        asymptomatic: true,
      },
      criteriaDescription: [
        'Complete recovery from Salmonella infection',
      ],
      evidenceNeeded: [
        'Treatment completion records',
      ],
    },
  ],

  definitions: {
    bacteremia: {
      term: 'Bacteremia',
      definition: 'Bacteria in bloodstream. Salmonella bacteremia is more common in immunocompromised individuals.',
    },
    reactiveArthritis: {
      term: 'Reactive Arthritis',
      definition: 'Joint inflammation triggered by infection elsewhere in body. Can occur 1-4 weeks after Salmonella infection.',
    },
  },

  importantNotes: [
    'Salmonella is common cause of foodborne illness',
    'Associated with Gulf War deployments',
    'Reactive arthritis can develop 1-4 weeks post-infection',
    'Bacteremia more common in immunocompromised',
    'Chronic carrier state possible',
    'Document acute symptoms and any long-term complications',
  ],
};
export const SHIGELLA_CRITERIA = {
  diagnosticCode: '6334',
  condition: 'Shigella Infection',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6334',

  ratings: [
    {
      percent: 100,
      summary: 'Severe complications (HUS, seizures, or hospitalization)',
      criteria: {
        severeComplications: true,
        hus: true,
      },
      criteriaDescription: [
        'Severe Shigella infection with complications:',
        '  • Hemolytic uremic syndrome (HUS)',
        '  • Seizures (especially in children)',
        '  • Bacteremia/sepsis',
        '  • Hospitalization required',
        '  • Severe dehydration requiring IV fluids',
      ],
      evidenceNeeded: [
        'Hospital admission records',
        'Lab results showing HUS (low platelets, kidney dysfunction)',
        'Stool culture confirming Shigella',
        'Treatment records',
        'Neurological evaluation if seizures',
      ],
    },
    {
      percent: 60,
      summary: 'Moderate symptoms with reactive arthritis or chronic complications',
      criteria: {
        reactiveArthritis: true,
        chronicSymptoms: true,
      },
      criteriaDescription: [
        'Post-infectious complications:',
        '  • Reactive arthritis (Reiter syndrome)',
        '  • Chronic diarrhea or IBS',
        '  • Recurrent infections',
        '  • Significant impact on daily function',
      ],
      evidenceNeeded: [
        'Stool culture confirming Shigella',
        'Joint evaluation and imaging',
        'GI evaluation for chronic symptoms',
        'Documentation of functional impact',
      ],
    },
    {
      percent: 30,
      summary: 'Mild chronic symptoms',
      criteria: {
        mildChronic: true,
      },
      criteriaDescription: [
        'Chronic residual symptoms:',
        '  • Intermittent GI symptoms',
        '  • Mild joint pain',
        '  • Chronic fatigue',
      ],
      evidenceNeeded: [
        'Original infection documentation',
        'Symptom tracking',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residual symptoms',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Mild post-infection effects',
      ],
      evidenceNeeded: [
        'History of Shigella infection',
      ],
    },
    {
      percent: 0,
      summary: 'Fully recovered',
      criteria: {
        recovered: true,
      },
      criteriaDescription: [
        'Complete recovery',
      ],
      evidenceNeeded: [
        'Treatment completion',
      ],
    },
  ],

  definitions: {
    hus: {
      term: 'Hemolytic Uremic Syndrome (HUS)',
      definition: 'Life-threatening complication causing kidney failure, low platelets, and destruction of red blood cells. Can occur with Shigella dysenteriae.',
    },
    tenesmus: {
      term: 'Tenesmus',
      definition: 'Feeling of incomplete bowel evacuation with painful straining. Common with Shigella dysentery.',
    },
  },

  importantNotes: [
    'Shigella causes dysentery (bloody diarrhea)',
    'Associated with Gulf War deployments',
    'HUS is rare but serious complication',
    'Reactive arthritis can develop weeks after infection',
    'Tenesmus (straining) is characteristic symptom',
    'Document severity and any complications',
  ],
};
export const WEST_NILE_CRITERIA = {
  diagnosticCode: '6335',
  condition: 'West Nile Virus',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6335',

  ratings: [
    {
      percent: 100,
      summary: 'Severe neuroinvasive disease with permanent impairment',
      criteria: {
        neuroinvasive: true,
        permanentImpairment: true,
      },
      criteriaDescription: [
        'Severe West Nile neuroinvasive disease:',
        '  • Encephalitis (brain inflammation)',
        '  • Meningitis',
        '  • Acute flaccid paralysis (polio-like)',
        '  • Permanent muscle weakness',
        '  • Cognitive impairment',
        '  • Unable to work or perform daily activities',
      ],
      evidenceNeeded: [
        'Hospital admission records',
        'CSF (spinal fluid) analysis',
        'Serology confirming West Nile IgM antibodies',
        'MRI/CT showing brain involvement',
        'Neurological exam documenting deficits',
        'Functional assessment',
      ],
    },
    {
      percent: 60,
      summary: 'Moderate neurological symptoms or chronic fatigue',
      criteria: {
        moderateNeuro: true,
        chronicFatigue: true,
      },
      criteriaDescription: [
        'Post-West Nile syndrome:',
        '  • Chronic muscle weakness',
        '  • Persistent fatigue (months to years)',
        '  • Memory/concentration problems',
        '  • Tremors or movement disorders',
        '  • Significant functional limitation',
      ],
      evidenceNeeded: [
        'Original West Nile diagnosis confirmation',
        'Neurological evaluation',
        'Documentation of persistent symptoms >6 months',
        'Functional impact assessment',
        'Treatment records',
      ],
    },
    {
      percent: 30,
      summary: 'Mild chronic symptoms',
      criteria: {
        mildChronic: true,
      },
      criteriaDescription: [
        'Chronic residual symptoms:',
        '  • Mild muscle weakness',
        '  • Fatigue',
        '  • Headaches',
        '  • Mild cognitive issues',
      ],
      evidenceNeeded: [
        'Diagnosis confirmation',
        'Symptom tracking',
        'Medical evaluation',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residual symptoms',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Mild post-infection effects',
      ],
      evidenceNeeded: [
        'History of West Nile infection',
      ],
    },
    {
      percent: 0,
      summary: 'Fully recovered',
      criteria: {
        recovered: true,
      },
      criteriaDescription: [
        'Complete recovery from West Nile',
      ],
      evidenceNeeded: [
        'Recovery documentation',
      ],
    },
  ],

  definitions: {
    neuroinvasive: {
      term: 'Neuroinvasive Disease',
      definition: 'West Nile infection affecting the nervous system, causing encephalitis, meningitis, or acute flaccid paralysis.',
    },
    acuteFlaccidParalysis: {
      term: 'Acute Flaccid Paralysis',
      definition: 'Sudden muscle weakness similar to polio, caused by West Nile attacking spinal cord motor neurons. May be permanent.',
    },
  },

  importantNotes: [
    'West Nile transmitted by mosquitoes',
    'Only ~1% develop neuroinvasive disease, but it can be severe',
    'Post-West Nile syndrome: chronic fatigue and weakness can last years',
    'Acute flaccid paralysis may be permanent',
    'No specific treatment - supportive care',
    'Veterans in endemic areas at higher risk',
    'Document both acute illness and long-term sequelae',
  ],
};
export const NTM_CRITERIA = {
  diagnosticCode: '6312',
  condition: 'Nontuberculous Mycobacterium Infection',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6312',

  ratings: [
    {
      percent: 100,
      summary: 'Active disease requiring continuous treatment',
      criteria: {
        activeDisease: true,
        continuousTreatment: true,
      },
      criteriaDescription: [
        'Active NTM infection:',
        '  • Requires long-term multi-drug antibiotic therapy (12-24 months)',
        '  • Progressive lung disease',
        '  • Disseminated NTM infection',
        '  • Severe respiratory impairment',
        '  • Unable to work or perform daily activities',
      ],
      evidenceNeeded: [
        'Sputum cultures confirming NTM (multiple samples)',
        'CT scan showing cavitary or nodular lung disease',
        'Treatment records (macrolide + ethambutol + rifampin)',
        'Pulmonary function tests showing impairment',
        'Infectious disease specialist notes',
      ],
    },
    {
      percent: 60,
      summary: 'Active disease with moderate symptoms on treatment',
      criteria: {
        activeDisease: true,
        moderateSymptoms: true,
      },
      criteriaDescription: [
        'NTM requiring treatment with moderate impact:',
        '  • On long-term antibiotics',
        '  • Chronic cough with sputum production',
        '  • Fatigue and weight loss',
        '  • Moderate respiratory symptoms',
      ],
      evidenceNeeded: [
        'Positive NTM cultures',
        'CT findings consistent with NTM',
        'Treatment compliance records',
        'Symptom documentation',
        'Pulmonary function tests',
      ],
    },
    {
      percent: 30,
      summary: 'Mild disease or post-treatment monitoring',
      criteria: {
        mildDisease: true,
        postTreatment: true,
      },
      criteriaDescription: [
        'Mild NTM or post-treatment:',
        '  • Completed treatment, monitoring for recurrence',
        '  • Mild chronic cough',
        '  • Minimal respiratory impairment',
      ],
      evidenceNeeded: [
        'Treatment completion records',
        'Follow-up imaging',
        'Negative cultures post-treatment',
      ],
    },
    {
      percent: 10,
      summary: 'Colonization without active disease',
      criteria: {
        colonization: true,
      },
      criteriaDescription: [
        'NTM isolated from cultures but not causing active disease',
      ],
      evidenceNeeded: [
        'Culture results',
        'Documentation of monitoring',
      ],
    },
    {
      percent: 0,
      summary: 'Successfully treated, no residuals',
      criteria: {
        cured: true,
      },
      criteriaDescription: [
        'NTM successfully treated with no ongoing symptoms',
      ],
      evidenceNeeded: [
        'Treatment completion',
        'Negative follow-up cultures',
      ],
    },
  ],

  definitions: {
    ntm: {
      term: 'Nontuberculous Mycobacterium (NTM)',
      definition: 'Bacteria related to TB but not M. tuberculosis. Common species: MAC (M. avium complex), M. abscessus, M. kansasii.',
    },
    mac: {
      term: 'MAC (M. avium Complex)',
      definition: 'Most common NTM causing lung disease. Requires prolonged multi-drug therapy.',
    },
  },

  importantNotes: [
    'NTM different from tuberculosis but related',
    'Common species: MAC, M. abscessus, M. kansasii',
    'Requires prolonged treatment (12-24 months)',
    'Multi-drug regimen: typically macrolide + ethambutol + rifampin',
    'Not contagious person-to-person',
    'More common in immunocompromised',
    'Diagnosis requires clinical + radiographic + microbiologic criteria',
    'Can be difficult to treat and may recur',
  ],
};
export const TUBERCULOSIS_ACTIVE_CRITERIA = {
  diagnosticCode: '6730',
  condition: 'Tuberculosis, Pulmonary, Chronic, Active',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6730',

  note: 'Active pulmonary tuberculosis is rated 100% while active. After becoming inactive, rating changes to DC 6731 and is based on residuals. A mandatory VA examination is required when TB becomes inactive.',

  ratings: [
    {
      percent: 100,
      summary: 'Active pulmonary tuberculosis',
      criteria: {
        activeDisease: true,
        culturePositive: true,
      },
      criteriaDescription: [
        'Active pulmonary tuberculosis confirmed by culture, smear, or clinical findings',
        'On active anti-tuberculosis treatment',
        'Rating continues until disease becomes inactive',
      ],
      evidenceNeeded: [
        'Positive sputum culture for Mycobacterium tuberculosis',
        'Positive AFB smear',
        'Chest X-ray showing active disease (infiltrates, cavities)',
        'Documentation of anti-TB medication regimen',
        'Infectious disease or pulmonology records',
      ],
    },
  ],

  permanentlyTotallyDisabling: {
    description: 'Active pulmonary TB is considered permanently and totally disabling for non-service-connected pension purposes in the following circumstances:',
    conditions: [
      'Associated with active tuberculosis involving other than the respiratory system',
      'With severe associated symptoms or with extensive cavity formation',
      'Reactivated cases, generally',
      'With advancement of lesions on successive examinations or while under treatment',
      'Without retrogression of lesions or other evidence of material improvement at the end of 6 months hospitalization',
      'Without change of diagnosis from "active" at the end of 12 months hospitalization',
    ],
  },

  definitions: {
    activeTB: {
      term: 'Active Tuberculosis',
      definition: 'TB disease where Mycobacterium tuberculosis bacteria are actively multiplying and causing symptoms. Confirmed by positive cultures or clinical evidence.',
    },
    culturePositive: {
      term: 'Culture Positive',
      definition: 'Laboratory confirmation of M. tuberculosis growth from sputum or other specimen. Gold standard for TB diagnosis.',
    },
    afbSmear: {
      term: 'AFB Smear',
      definition: 'Acid-fast bacilli smear - microscopic examination for TB bacteria. Faster but less sensitive than culture.',
    },
    cavitaryDisease: {
      term: 'Cavitary Disease',
      definition: 'TB that has formed cavities (holes) in the lungs. Indicates more advanced disease and higher infectivity.',
    },
    multiDrugResistant: {
      term: 'MDR-TB (Multi-Drug Resistant)',
      definition: 'TB resistant to at least isoniazid and rifampin, the two most potent first-line drugs. Requires longer, more complex treatment.',
    },
    xdrTB: {
      term: 'XDR-TB (Extensively Drug Resistant)',
      definition: 'MDR-TB plus resistance to fluoroquinolones and at least one injectable second-line drug. Very difficult to treat.',
    },
  },

  treatmentInfo: {
    standardRegimen: 'RIPE: Rifampin, Isoniazid, Pyrazinamide, Ethambutol',
    duration: 'Typically 6-9 months for drug-susceptible TB; 18-24+ months for MDR-TB',
    monitoring: 'Monthly sputum cultures until negative; chest X-rays; liver function tests',
  },

  importantNotes: [
    'Active TB is ALWAYS rated 100% while disease is active',
    '100% rating is NOT subject to requirement of precedent hospital treatment',
    'Rating may be reduced to 50% for failure to submit to examination or follow treatment',
    'Mandatory VA examination required when active TB becomes inactive',
    'TB is a 3-year presumptive condition (manifested within 3 years of discharge)',
    'Document all medications, cultures, and imaging',
  ],

  presumptiveInfo: {
    threeYearPresumptive: true,
    description: 'Tuberculosis is presumptively service-connected if manifested to a compensable degree within 3 years of discharge.',
  },

  disclaimer: 'This analysis is based on logged TB symptoms. Active TB rating requires confirmation of active disease by culture, smear, or clinical findings. VA ratings require infectious disease documentation.',
};
export const TUBERCULOSIS_INACTIVE_CRITERIA = {
  diagnosticCode: '6731',
  condition: 'Tuberculosis, Pulmonary, Chronic, Inactive',
  cfrReference: '38 CFR 4.97, Diagnostic Code 6731',

  note: 'Inactive pulmonary TB is rated based on residuals. Rate residuals as interstitial lung disease, restrictive lung disease, or when obstructive lung disease is the major residual, as chronic bronchitis (DC 6600). Rate thoracoplasty as removal of ribs under DC 5297.',

  ratings: [
    {
      percent: 100,
      summary: 'Residuals with FEV-1 <40% predicted or severe impairment',
      criteria: {
        fev1: '<40%',
        severeResiduals: true,
      },
      criteriaDescription: [
        'FEV-1 less than 40% of predicted, OR',
        'FEV-1/FVC less than 40%, OR',
        'DLCO (SB) less than 40% predicted, OR',
        'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption, OR',
        'Cor pulmonale (right heart failure), OR',
        'Pulmonary hypertension, OR',
        'Requires outpatient oxygen therapy',
      ],
      evidenceNeeded: [
        'Pulmonary function tests (PFTs)',
        'DLCO measurement',
        'Echocardiogram if pulmonary hypertension suspected',
        'Documentation of oxygen requirements',
      ],
    },
    {
      percent: 60,
      summary: 'Residuals with FEV-1 40-55% predicted',
      criteria: {
        fev1: '40-55%',
      },
      criteriaDescription: [
        'FEV-1 of 40-55% of predicted, OR',
        'FEV-1/FVC of 40-55%, OR',
        'DLCO (SB) of 40-55% predicted, OR',
        'Maximum oxygen consumption of 15-20 ml/kg/min',
      ],
      evidenceNeeded: [
        'Pulmonary function tests',
        'DLCO measurement',
        'Exercise capacity testing if applicable',
      ],
    },
    {
      percent: 30,
      summary: 'Residuals with FEV-1 56-70% predicted',
      criteria: {
        fev1: '56-70%',
      },
      criteriaDescription: [
        'FEV-1 of 56-70% of predicted, OR',
        'FEV-1/FVC of 56-70%, OR',
        'DLCO (SB) of 56-65% predicted',
      ],
      evidenceNeeded: [
        'Pulmonary function tests',
        'DLCO measurement',
      ],
    },
    {
      percent: 10,
      summary: 'Residuals with FEV-1 71-80% predicted',
      criteria: {
        fev1: '71-80%',
      },
      criteriaDescription: [
        'FEV-1 of 71-80% of predicted, OR',
        'FEV-1/FVC of 71-80%, OR',
        'DLCO (SB) of 66-80% predicted',
      ],
      evidenceNeeded: [
        'Pulmonary function tests',
        'DLCO measurement',
      ],
    },
    {
      percent: 0,
      summary: 'Inactive TB with minimal or no residuals',
      criteria: {
        minimalResiduals: true,
        fev1: '>80%',
      },
      criteriaDescription: [
        'FEV-1 greater than 80% of predicted',
        'No significant pulmonary impairment',
        'Healed lesions on imaging',
      ],
      evidenceNeeded: [
        'Documentation of inactive status',
        'Pulmonary function tests showing minimal impairment',
        'Chest imaging showing healed/stable lesions',
      ],
    },
  ],

  definitions: {
    inactiveTB: {
      term: 'Inactive Tuberculosis',
      definition: 'TB that is no longer active - negative cultures, stable imaging, completed treatment. May have residual lung damage.',
    },
    fev1: {
      term: 'FEV-1 (Forced Expiratory Volume in 1 second)',
      definition: 'The amount of air that can be forcibly exhaled in one second. Key measure of lung function.',
    },
    fvc: {
      term: 'FVC (Forced Vital Capacity)',
      definition: 'The total amount of air that can be forcibly exhaled after taking a deep breath.',
    },
    dlco: {
      term: 'DLCO (Diffusing Capacity)',
      definition: 'Measures how well oxygen passes from lungs into blood. Indicates gas exchange ability.',
    },
    pulmonaryFibrosis: {
      term: 'Pulmonary Fibrosis',
      definition: 'Scarring of lung tissue, a common residual of TB. Causes restrictive lung disease.',
    },
    thoracoplasty: {
      term: 'Thoracoplasty',
      definition: 'Surgical removal of ribs to collapse the lung, historically used for TB treatment. Rate as removal of ribs (DC 5297).',
    },
  },

  residualConditions: [
    { condition: 'Pulmonary Fibrosis/Scarring', rateAs: 'Interstitial lung disease (DC 6825-6833)' },
    { condition: 'Restrictive Lung Disease', rateAs: 'Restrictive lung codes (DC 6840-6845)' },
    { condition: 'Obstructive Lung Disease', rateAs: 'Chronic bronchitis (DC 6600)' },
    { condition: 'Thoracoplasty', rateAs: 'Removal of ribs (DC 5297)' },
    { condition: 'Bronchiectasis', rateAs: 'DC 6601' },
    { condition: 'Emphysema', rateAs: 'DC 6603' },
  ],

  importantNotes: [
    'Rating based on RESIDUALS - primarily pulmonary function tests',
    'Rate as interstitial, restrictive, or obstructive lung disease based on predominant residual',
    'Thoracoplasty rated separately as rib removal (DC 5297)',
    'Mandatory VA exam required when active TB becomes inactive',
    'Document all PFT results including FEV-1, FVC, FEV-1/FVC ratio, and DLCO',
    'May qualify for separate ratings for different residual conditions',
  ],

  disclaimer: 'This analysis is based on logged symptoms. Inactive TB rating requires pulmonary function testing to determine residual impairment. Rate residuals under the most appropriate respiratory code.',
};
export const TUBERCULOSIS_MILIARY_CRITERIA = {
  diagnosticCode: '6311',
  condition: 'Tuberculosis, Miliary (Disseminated)',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6311',

  note: 'Miliary TB is disseminated tuberculosis affecting multiple organ systems. Rate 100% while active. When inactive, rate residuals under the appropriate body system codes.',

  ratings: [
    {
      percent: 100,
      summary: 'Active miliary (disseminated) tuberculosis',
      criteria: {
        activeDisease: true,
        disseminated: true,
      },
      criteriaDescription: [
        'Active disseminated (miliary) tuberculosis',
        'TB spread throughout body via bloodstream',
        'Multiple organ involvement',
        'Confirmed by culture, histopathology, or diagnostic laboratory testing',
      ],
      evidenceNeeded: [
        'Positive cultures from multiple sites',
        'Chest X-ray showing miliary pattern (millet seed appearance)',
        'CT imaging showing disseminated disease',
        'Biopsy results if available',
        'Documentation of organ systems involved',
      ],
    },
    {
      percent: 'Rate residuals',
      summary: 'Inactive miliary TB - rate residuals under appropriate body systems',
      criteria: {
        inactiveDisease: true,
      },
      criteriaDescription: [
        'When miliary TB becomes inactive, rate all residuals under appropriate body system codes',
        'May include: respiratory, CNS, musculoskeletal, ocular, GI, GU, and skin residuals',
      ],
      evidenceNeeded: [
        'Documentation of inactive status',
        'Assessment of each affected organ system',
        'Specialist evaluations as needed',
      ],
    },
  ],

  definitions: {
    miliaryTB: {
      term: 'Miliary Tuberculosis',
      definition: 'Disseminated TB where bacteria spread via bloodstream to multiple organs. Named for millet seed-like appearance on chest X-ray.',
    },
    disseminated: {
      term: 'Disseminated Disease',
      definition: 'TB that has spread beyond the lungs to multiple organ systems throughout the body.',
    },
  },

  possibleOrganInvolvement: [
    { organ: 'CNS/Meninges', description: 'TB meningitis - severe complication', suggestedDC: '8019 (Meningitis)' },
    { organ: 'Bones/Joints', description: 'Skeletal TB, Pott\'s disease (spine)', suggestedDC: '5001 (TB of bones/joints)' },
    { organ: 'Kidneys', description: 'Renal TB', suggestedDC: '7505 (TB kidney)' },
    { organ: 'Lymph Nodes', description: 'TB lymphadenitis', suggestedDC: '7710 (TB adenitis)' },
    { organ: 'Skin', description: 'Cutaneous TB, lupus vulgaris', suggestedDC: '7811 (Tuberculosis luposa)' },
    { organ: 'Eyes', description: 'Ocular TB, uveitis', suggestedDC: '6010 (TB eye)' },
    { organ: 'GI Tract', description: 'Intestinal TB, peritonitis', suggestedDC: 'Appropriate GI code' },
    { organ: 'Liver/Spleen', description: 'Hepatic/splenic involvement', suggestedDC: 'Appropriate code' },
  ],

  importantNotes: [
    'Miliary TB is ALWAYS rated 100% while active',
    'Life-threatening condition requiring aggressive treatment',
    'When inactive, rate EACH affected organ system separately',
    'Combined rating for residuals may exceed single code rating',
    'Confirm recurrence by culture, histopathology, or other diagnostic testing',
    'TB meningitis residuals may include cognitive impairment, seizures, hearing loss',
  ],

  disclaimer: 'This analysis is based on logged symptoms. Miliary TB is a serious disseminated infection requiring specialist care. Rate residuals of each affected organ system when disease becomes inactive.',
};
export const SYPHILIS_CRITERIA = {
  diagnosticCode: '6310',
  condition: 'Syphilis and Other Treponemal Infections',
  cfrReference: '38 CFR § 4.88b, Diagnostic Code 6310',

  note: 'Syphilis itself is rated at 0% when inactive/treated. Compensation is based on complications affecting the nervous system, vascular system, eyes, or ears. Rate under the appropriate diagnostic code for the specific complication.',

  ratings: [
    {
      percent: 0,
      summary: 'Inactive/treated syphilis without complications',
      criteriaDescription: [
        'History of syphilis infection',
        'Successfully treated with antibiotics',
        'No current active disease',
        'No residual complications',
      ],
      evidenceNeeded: [
        'Positive syphilis serology (RPR, VDRL, or treponemal test)',
        'Treatment records showing antibiotic therapy',
        'Follow-up testing showing stable/declining titers',
        'Medical evaluation ruling out complications',
      ],
    },
  ],

  complications: [
    { code: '7004', condition: 'Syphilitic Heart Disease', system: 'Cardiovascular' },
    { code: '8013', condition: 'Cerebrospinal Syphilis', system: 'Neurological' },
    { code: '8014', condition: 'Meningovascular Syphilis', system: 'Neurological' },
    { code: '8015', condition: 'Tabes Dorsalis', system: 'Neurological' },
    { code: '9301', condition: 'Dementia due to CNS Syphilis', system: 'Mental Health' },
    { code: '6010', condition: 'Syphilitic Eye Disease', system: 'Ophthalmologic' },
  ],

  definitions: {
    'Treponemal infection': 'Infection caused by Treponema pallidum bacteria (syphilis) or related organisms',
    'RPR': 'Rapid Plasma Reagin - non-treponemal screening test for syphilis',
    'VDRL': 'Venereal Disease Research Laboratory test - another screening test',
    'Tertiary syphilis': 'Late-stage syphilis that can affect heart, brain, and other organs',
    'Neurosyphilis': 'Syphilis infection of the central nervous system',
  },

  disclaimer: 'Veterans with service-connected syphilis should be evaluated for all potential complications. Even if the base syphilis rating is 0%, secondary conditions affecting the heart, nervous system, eyes, or mental health may be separately rated and service-connected.',
};
export const CEREBROSPINAL_SYPHILIS_CRITERIA = {
  diagnosticCode: '8013',
  condition: 'Cerebrospinal Syphilis (Neurosyphilis)',
  cfrReference: '38 CFR § 4.124a, Diagnostic Code 8013',

  note: 'Rate upon the severity of convulsions, paralysis, visual impairment, or psychotic involvement. Uses the Central Nervous System rating criteria. May involve brain and/or spinal cord infection.',

  ratings: [
    {
      percent: 100,
      summary: 'Severe neurological impairment',
      criteriaDescription: [
        'Severe convulsions/seizures, OR',
        'Complete paralysis of affected areas, OR',
        'Severe visual impairment/blindness, OR',
        'Severe psychotic symptoms',
      ],
      evidenceNeeded: [
        'Neurology evaluation documenting severity',
        'CSF analysis showing infection',
        'MRI/CT showing CNS involvement',
        'Documentation of functional impairment',
      ],
    },
    {
      percent: 60,
      summary: 'Moderately severe neurological symptoms',
      criteriaDescription: [
        'Frequent seizures despite medication, OR',
        'Significant paralysis or weakness, OR',
        'Moderate visual impairment, OR',
        'Moderate cognitive/psychiatric symptoms',
      ],
      evidenceNeeded: [
        'Seizure logs if applicable',
        'Neurology records',
        'Functional assessment',
        'Treatment records',
      ],
    },
    {
      percent: 30,
      summary: 'Moderate neurological symptoms',
      criteriaDescription: [
        'Occasional seizures, OR',
        'Mild to moderate weakness/paralysis, OR',
        'Mild visual changes, OR',
        'Mild cognitive symptoms',
      ],
      evidenceNeeded: [
        'Neurology evaluation',
        'Documentation of symptom frequency',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residuals (minimum rating with ascertainable residuals)',
      criteriaDescription: [
        'Mild residual symptoms',
        'Headaches, dizziness, or fatigue',
        'Subjective complaints consistent with disease',
      ],
      evidenceNeeded: [
        'Documentation of residual symptoms',
        'History of cerebrospinal syphilis',
        'Current symptom diary',
      ],
    },
  ],

  symptoms: [
    'Headaches',
    'Seizures/convulsions',
    'Vision problems (double vision, blindness)',
    'Cognitive impairment',
    'Memory problems',
    'Personality changes',
    'Nerve paralysis',
    'Fatigue',
    'Dementia',
  ],

  definitions: {
    'Cerebrospinal syphilis': 'Syphilis infection affecting the brain and/or spinal cord',
    'CSF': 'Cerebrospinal fluid - tested via lumbar puncture to diagnose neurosyphilis',
    'General paresis': 'Progressive dementia caused by neurosyphilis',
  },

  disclaimer: 'Cerebrospinal syphilis requires documentation of CNS infection. Rate based on the most severe residual symptoms. Separate ratings may apply for distinct manifestations that don\'t overlap.',
};
export const MENINGOVASCULAR_SYPHILIS_CRITERIA = {
  diagnosticCode: '8014',
  condition: 'Meningovascular Syphilis',
  cfrReference: '38 CFR § 4.124a, Diagnostic Code 8014',

  note: 'Infection of the meninges (brain lining) and blood vessels in the brain. Rate upon the severity of convulsions, paralysis, visual impairment, or psychotic involvement.',

  ratings: [
    {
      percent: 100,
      summary: 'Severe neurological impairment',
      criteriaDescription: [
        'Stroke-like episodes with permanent deficits, OR',
        'Severe seizures, OR',
        'Complete paralysis, OR',
        'Severe cognitive impairment',
      ],
      evidenceNeeded: [
        'Neurology evaluation',
        'Imaging showing vascular changes',
        'CSF analysis',
        'Documentation of stroke-like episodes',
      ],
    },
    {
      percent: 60,
      summary: 'Moderately severe symptoms',
      criteriaDescription: [
        'Recurrent stroke-like episodes, OR',
        'Frequent seizures, OR',
        'Significant weakness/paralysis, OR',
        'Moderate cognitive decline',
      ],
      evidenceNeeded: [
        'Neurology records',
        'Imaging studies',
        'Functional assessment',
      ],
    },
    {
      percent: 30,
      summary: 'Moderate symptoms',
      criteriaDescription: [
        'Occasional symptoms, OR',
        'Mild to moderate neurological deficits, OR',
        'Controlled seizures',
      ],
      evidenceNeeded: [
        'Neurology evaluation',
        'Treatment records',
        'Symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal residuals',
      criteriaDescription: [
        'Mild residual symptoms',
        'Headaches, fatigue, mild memory issues',
        'Ascertainable residuals present',
      ],
      evidenceNeeded: [
        'Documentation of residuals',
        'Medical history',
      ],
    },
  ],

  symptoms: [
    'Stroke-like episodes',
    'Headaches',
    'Seizures',
    'Vision changes (double vision)',
    'Memory problems',
    'Fatigue',
    'Nerve paralysis',
    'Dementia',
  ],

  definitions: {
    'Meningovascular': 'Affecting the meninges (brain covering) and blood vessels',
    'Cerebrovascular accident': 'Stroke - can occur from syphilitic vasculitis',
  },

  disclaimer: 'Meningovascular syphilis affects brain blood vessels and can cause stroke-like symptoms. Rate based on residual neurological deficits.',
};
export const TABES_DORSALIS_CRITERIA = {
  diagnosticCode: '8015',
  condition: 'Tabes Dorsalis',
  cfrReference: '38 CFR § 4.124a, Diagnostic Code 8015',

  note: 'A form of neurosyphilis affecting the posterior columns of the spinal cord. Causes progressive degeneration of sensory nerve fibers. Rate upon the severity of symptoms including gait abnormality, pain, and sensory loss.',

  ratings: [
    {
      percent: 100,
      summary: 'Severe impairment',
      criteriaDescription: [
        'Unable to walk without assistance, OR',
        'Severe lightning pains requiring constant medication, OR',
        'Complete sensory loss in lower extremities, OR',
        'Severe bladder/bowel dysfunction',
      ],
      evidenceNeeded: [
        'Neurology evaluation',
        'Gait analysis',
        'Documentation of pain severity',
        'Bladder/bowel function assessment',
      ],
    },
    {
      percent: 60,
      summary: 'Moderately severe symptoms',
      criteriaDescription: [
        'Significant gait disturbance requiring assistive device, OR',
        'Frequent severe lightning pains, OR',
        'Marked sensory loss, OR',
        'Moderate bladder/bowel issues',
      ],
      evidenceNeeded: [
        'Neurology records',
        'Pain diary',
        'Sensory examination',
        'Functional assessment',
      ],
    },
    {
      percent: 30,
      summary: 'Moderate symptoms (minimum rating)',
      criteriaDescription: [
        'Ataxic gait (unsteady walking), OR',
        'Intermittent lightning pains, OR',
        'Decreased sensation, OR',
        'Mild bladder dysfunction',
      ],
      evidenceNeeded: [
        'Neurology evaluation',
        'Symptom documentation',
        'Treatment records',
      ],
    },
  ],

  symptoms: [
    'Lightning pains (sharp, stabbing pains)',
    'Ataxia (unsteady gait)',
    'Loss of reflexes',
    'Sensory loss (especially position sense)',
    'Romberg sign positive',
    'Bladder dysfunction',
    'Bowel dysfunction',
    'Argyll Robertson pupils',
    'Joint damage (Charcot joints)',
    'Vision problems',
  ],

  definitions: {
    'Tabes dorsalis': 'Degeneration of the dorsal columns of spinal cord from syphilis',
    'Lightning pains': 'Brief, severe, stabbing pains characteristic of tabes dorsalis',
    'Ataxia': 'Lack of muscle coordination affecting gait and balance',
    'Romberg sign': 'Swaying/falling when standing with eyes closed - indicates sensory ataxia',
    'Argyll Robertson pupils': 'Pupils that accommodate but don\'t react to light - classic sign',
    'Charcot joint': 'Joint destruction from loss of protective sensation',
  },

  disclaimer: 'Tabes dorsalis is a late manifestation of syphilis affecting the spinal cord. The minimum rating is 30% when ascertainable residuals are present.',
};
export const SYPHILITIC_DEMENTIA_CRITERIA = {
  diagnosticCode: '9301',
  condition: 'Dementia Associated with Central Nervous System Syphilis',
  cfrReference: '38 CFR § 4.130, Diagnostic Code 9301',

  note: 'Also known as General Paresis or Dementia Paralytica. Rated under the General Rating Formula for Mental Disorders. Progressive dementia caused by CNS syphilis infection.',

  ratings: [
    {
      percent: 100,
      summary: 'Total occupational and social impairment',
      criteriaDescription: [
        'Gross impairment in thought processes or communication',
        'Persistent delusions or hallucinations',
        'Grossly inappropriate behavior',
        'Persistent danger of hurting self or others',
        'Intermittent inability to perform activities of daily living',
        'Disorientation to time or place',
        'Memory loss for names of close relatives or own name',
      ],
      evidenceNeeded: [
        'Psychiatric evaluation',
        'Neuropsychological testing',
        'Documentation of functional impairment',
        'CSF analysis confirming neurosyphilis',
      ],
    },
    {
      percent: 70,
      summary: 'Deficiencies in most areas',
      criteriaDescription: [
        'Suicidal ideation',
        'Obsessional rituals interfering with routine activities',
        'Intermittently illogical, obscure, or irrelevant speech',
        'Near-continuous panic or depression',
        'Impaired impulse control',
        'Spatial disorientation',
        'Neglect of personal appearance and hygiene',
        'Difficulty adapting to stressful circumstances',
        'Inability to establish and maintain effective relationships',
      ],
      evidenceNeeded: [
        'Psychiatric evaluation',
        'Documentation of symptoms',
        'Functional assessment',
      ],
    },
    {
      percent: 50,
      summary: 'Reduced reliability and productivity',
      criteriaDescription: [
        'Flattened affect',
        'Circumstantial, circumlocutory, or stereotyped speech',
        'Panic attacks more than once a week',
        'Difficulty understanding complex commands',
        'Impairment of short and long-term memory',
        'Impaired judgment',
        'Impaired abstract thinking',
        'Disturbances of motivation and mood',
        'Difficulty establishing effective work and social relationships',
      ],
      evidenceNeeded: [
        'Psychiatric evaluation',
        'Cognitive testing',
        'Work history documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Occasional decrease in work efficiency',
      criteriaDescription: [
        'Depressed mood, anxiety, suspiciousness',
        'Panic attacks weekly or less',
        'Chronic sleep impairment',
        'Mild memory loss (forgetting names, directions)',
      ],
      evidenceNeeded: [
        'Psychiatric evaluation',
        'Symptom documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Mild symptoms',
      criteriaDescription: [
        'Symptoms controlled by continuous medication',
        'Occupational and social impairment due to mild or transient symptoms',
      ],
      evidenceNeeded: [
        'Treatment records',
        'Medication history',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but asymptomatic',
      criteriaDescription: [
        'Formally diagnosed condition',
        'No symptoms impairing occupational or social functioning',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'Evaluation showing no current impairment',
      ],
    },
  ],

  definitions: {
    'General paresis': 'Progressive dementia from neurosyphilis, also called dementia paralytica',
    'Cognitive decline': 'Progressive loss of memory, reasoning, and other mental functions',
  },

  disclaimer: 'Syphilitic dementia is a serious complication of untreated neurosyphilis. Early treatment can halt progression but may not reverse existing damage.',
};


// ============================================
// ANALYZE FUNCTIONS
// ============================================

export const analyzeHIVLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const hivLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.HIV_AIDS.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('hiv')
    );
  });

  if (hivLogs.length === 0) {
    return {
      condition: 'HIV-Related Illness',
      diagnosticCode: '6351',
      hasData: false,
      message: 'No HIV-related symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging HIV-related symptoms',
        'Document constitutional symptoms (fever, night sweats, fatigue)',
        'Track opportunistic infections',
        'Record weight changes',
        'Note CD4 count and viral load from lab results',
        'Document antiretroviral medications',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    opportunisticInfections: 0,
    nightSweats: 0,
    persistentFever: 0,
    weightLoss: 0,
    chronicDiarrhea: 0,
    oralThrush: 0,
    skinLesions: 0,
    lymphadenopathy: 0,
    fatigue: 0,
    cognitiveImpairment: 0,
  };

  // Check for HIV-specific form data
  let hasOpportunisticInfection = false;
  let infectionType = null;
  let hasConstitutionalSymptoms = false;
  let onAntiretrovirals = false;
  let weightLossPercentage = 0;

  hivLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    // Count symptoms
    if (symptomId === 'hiv-opportunistic-infection') {
      symptomCounts.opportunisticInfections++;
      if (log.hivData?.infectionType) {
        hasOpportunisticInfection = true;
        infectionType = log.hivData.infectionType;
      }
    }
    if (symptomId === 'hiv-night-sweats') symptomCounts.nightSweats++;
    if (symptomId === 'hiv-persistent-fever') symptomCounts.persistentFever++;
    if (symptomId === 'hiv-weight-loss') {
      symptomCounts.weightLoss++;
      if (log.hivData?.weightLossPercentage) {
        weightLossPercentage = Math.max(weightLossPercentage, parseFloat(log.hivData.weightLossPercentage));
      }
    }
    if (symptomId === 'hiv-chronic-diarrhea') symptomCounts.chronicDiarrhea++;
    if (symptomId === 'hiv-oral-thrush') symptomCounts.oralThrush++;
    if (symptomId === 'hiv-skin-lesions') symptomCounts.skinLesions++;
    if (symptomId === 'hiv-lymphadenopathy') symptomCounts.lymphadenopathy++;
    if (symptomId === 'hiv-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'hiv-cognitive-impairment') symptomCounts.cognitiveImpairment++;

    // Check for constitutional symptoms
    if (log.hivData?.constitutionalSymptoms?.length > 0) {
      hasConstitutionalSymptoms = true;
    }

    // Check for antiretroviral treatment
    if (log.hivData?.onAntiretrovirals) {
      onAntiretrovirals = true;
    }
  });

  const totalConstitutionalSymptoms =
      symptomCounts.nightSweats +
      symptomCounts.persistentFever +
      symptomCounts.weightLoss +
      symptomCounts.chronicDiarrhea +
      symptomCounts.fatigue;

  evidence.push(`${hivLogs.length} HIV-related symptoms logged over ${evaluationPeriodDays} days`);

  // Determine rating based on VA criteria

  // 100% Rating: Recurrent opportunistic infections OR debilitating symptoms with pathological weight loss
  if (hasOpportunisticInfection && symptomCounts.opportunisticInfections >= 2) {
    supportedRating = 100;
    ratingRationale.push(
        'Recurrent opportunistic infections documented',
        `${symptomCounts.opportunisticInfections} opportunistic infection episodes logged`,
        'Meets criteria for 100% rating under DC 6351'
    );
    evidence.push(`Opportunistic infection type: ${infectionType}`);
    evidence.push('Recurrent infections indicate severe immunosuppression');
  } else if (
      weightLossPercentage >= 10 &&
      totalConstitutionalSymptoms >= 15 &&
      (symptomCounts.chronicDiarrhea >= 5 || symptomCounts.fatigue >= 10)
  ) {
    supportedRating = 100;
    ratingRationale.push(
        'Pathological weight loss (>=10% body weight) with debilitating constitutional symptoms',
        `Weight loss: ${weightLossPercentage}% documented`,
        `${totalConstitutionalSymptoms} constitutional symptoms over evaluation period`,
        'Chronic diarrhea and/or severe fatigue documented',
        'Meets criteria for 100% rating'
    );
    evidence.push(`Pathological weight loss: ${weightLossPercentage}%`);
  }

  // 60% Rating: Refractory constitutional symptoms OR post-opportunistic infection
  else if (
      (hasOpportunisticInfection && symptomCounts.opportunisticInfections === 1) ||
      (totalConstitutionalSymptoms >= 10 && (symptomCounts.chronicDiarrhea >= 3 || weightLossPercentage >= 5))
  ) {
    supportedRating = 60;
    ratingRationale.push(
        hasOpportunisticInfection
            ? 'Minimum 60% rating following documented opportunistic infection'
            : 'Refractory constitutional symptoms with intermittent diarrhea',
        'Frequent constitutional symptoms documented',
        weightLossPercentage >= 5 ? `Significant weight loss: ${weightLossPercentage}%` : '',
        'Meets criteria for 60% rating'
    ).filter(Boolean);

    if (hasOpportunisticInfection) {
      evidence.push(`Opportunistic infection: ${infectionType}`);
    }
  }

  // 30% Rating: Recurrent constitutional symptoms, intermittent diarrhea, on antiretrovirals
  else if (
      totalConstitutionalSymptoms >= 5 ||
      onAntiretrovirals ||
      (symptomCounts.chronicDiarrhea >= 2 && hasConstitutionalSymptoms)
  ) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Recurrent constitutional symptoms documented',
      onAntiretrovirals ? 'Use of FDA-approved antiretroviral medications' : '',
      symptomCounts.chronicDiarrhea >= 2 ? 'Intermittent diarrhea episodes' : '',
      'Meets criteria for 30% minimum rating'
    ].filter(Boolean));

    if (onAntiretrovirals) {
      evidence.push('On antiretroviral therapy');
    }
  }

  // 10% Rating: Mild constitutional symptoms following diagnosis
  else if (totalConstitutionalSymptoms >= 2 || symptomCounts.cognitiveImpairment > 0) {
    supportedRating = 10;
    ratingRationale.push(
        'Constitutional symptoms following HIV diagnosis',
        symptomCounts.cognitiveImpairment > 0 ? 'Cognitive impairment/memory loss documented' : '',
        'Meets criteria for 10% rating'
    ).filter(Boolean);
  }

  // 0% Rating: Asymptomatic but diagnosed
  else {
    supportedRating = 0;
    ratingRationale.push(
        'HIV diagnosis with minimal symptoms',
        'May have lymphadenopathy but otherwise asymptomatic',
        '0% (asymptomatic) rating'
    );
  }

  // Add symptom evidence
  if (symptomCounts.opportunisticInfections > 0) {
    evidence.push(`${symptomCounts.opportunisticInfections} opportunistic infection(s) logged`);
  }
  if (symptomCounts.nightSweats > 0) {
    evidence.push(`${symptomCounts.nightSweats} night sweats episodes`);
  }
  if (symptomCounts.persistentFever > 0) {
    evidence.push(`${symptomCounts.persistentFever} persistent fever episodes`);
  }
  if (symptomCounts.weightLoss > 0) {
    evidence.push(`${symptomCounts.weightLoss} weight loss episodes (${weightLossPercentage}% max)`);
  }
  if (symptomCounts.chronicDiarrhea > 0) {
    evidence.push(`${symptomCounts.chronicDiarrhea} chronic diarrhea episodes`);
  }
  if (symptomCounts.oralThrush > 0) {
    evidence.push(`${symptomCounts.oralThrush} oral thrush occurrences`);
  }
  if (symptomCounts.skinLesions > 0) {
    evidence.push(`${symptomCounts.skinLesions} skin lesions documented`);
  }
  if (symptomCounts.lymphadenopathy > 0) {
    evidence.push(`${symptomCounts.lymphadenopathy} swollen lymph node episodes`);
  }
  if (symptomCounts.fatigue > 0) {
    evidence.push(`${symptomCounts.fatigue} severe fatigue episodes`);
  }
  if (symptomCounts.cognitiveImpairment > 0) {
    evidence.push(`${symptomCounts.cognitiveImpairment} cognitive impairment episodes`);
  }

  // Evidence gaps
  gaps.push('Track CD4 count and viral load from lab results (use Measurements tab)');
  gaps.push('Document all medications, especially antiretrovirals');

  if (symptomCounts.opportunisticInfections === 0) {
    gaps.push('Document any opportunistic infections (PCP, CMV, MAC, toxoplasmosis, etc.)');
  }

  if (!hasConstitutionalSymptoms && totalConstitutionalSymptoms < 5) {
    gaps.push('Log constitutional symptoms consistently (fever, night sweats, fatigue)');
  }

  if (weightLossPercentage === 0) {
    gaps.push('Track body weight changes over time');
  }

  if (!onAntiretrovirals && supportedRating < 30) {
    gaps.push('Document antiretroviral medication regimen if applicable');
  }

  gaps.push('Medical records documenting HIV diagnosis and treatment history');
  gaps.push('Regular CD4 counts and viral load measurements');

  if (supportedRating >= 60) {
    gaps.push('Document impact on daily activities and work capacity');
    gaps.push('Note any hospitalizations for opportunistic infections');
  }

  return {
    condition: 'HIV-Related Illness',
    diagnosticCode: '6351',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: hivLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      hasOpportunisticInfection,
      onAntiretrovirals,
      weightLossPercentage,
    },
  };
};

export const analyzeHepatitisCLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const hepCLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.HEPATITIS_C.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('hep')
    );
  });

  if (hepCLogs.length === 0) {
    return {
      condition: 'Hepatitis C',
      diagnosticCode: '7354',
      hasData: false,
      message: 'No Hepatitis C symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging hepatitis symptoms',
        'Document fatigue and malaise frequency',
        'Track weight changes over time',
        'Note dietary restrictions and appetite changes',
        'Record liver enzyme values from lab work',
        'Document impact on daily activities',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    fatigue: 0,
    malaise: 0,
    nausea: 0,
    abdominalPain: 0,
    jaundice: 0,
    darkUrine: 0,
    appetiteLoss: 0,
    jointPain: 0,
    cognitiveIssues: 0,
    liverTenderness: 0,
  };

  let weightLossPercentage = 0;
  let debilitating = false;
  let dietaryRestrictions = false;

  hepCLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'hep-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'hep-malaise') symptomCounts.malaise++;
    if (symptomId === 'hep-nausea') symptomCounts.nausea++;
    if (symptomId === 'hep-abdominal-pain') symptomCounts.abdominalPain++;
    if (symptomId === 'hep-jaundice') symptomCounts.jaundice++;
    if (symptomId === 'hep-dark-urine') symptomCounts.darkUrine++;
    if (symptomId === 'hep-appetite-loss') symptomCounts.appetiteLoss++;
    if (symptomId === 'hep-joint-pain') symptomCounts.jointPain++;
    if (symptomId === 'hep-cognitive-issues') symptomCounts.cognitiveIssues++;
    if (symptomId === 'hep-liver-tenderness') symptomCounts.liverTenderness++;

    if (log.hepatitisData?.weightLossPercentage) {
      weightLossPercentage = Math.max(weightLossPercentage, parseFloat(log.hepatitisData.weightLossPercentage));
    }
    if (log.hepatitisData?.debilitating) {
      debilitating = true;
    }
    if (log.hepatitisData?.dietaryRestrictions) {
      dietaryRestrictions = true;
    }
  });

  const totalSymptomCount = Object.values(symptomCounts).reduce((a, b) => a + b, 0);
  const daysWithSymptoms = hepCLogs.length;
  const dailySymptoms = daysWithSymptoms >= evaluationPeriodDays * 0.7; // 70% of days
  const intermittentSymptoms = daysWithSymptoms >= evaluationPeriodDays * 0.2; // 20% of days

  evidence.push(`${hepCLogs.length} Hepatitis C symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (debilitating && dailySymptoms && (symptomCounts.fatigue >= 50 || symptomCounts.malaise >= 50)) {
    supportedRating = 100;
    ratingRationale.push(
        'Near-constant debilitating symptoms documented',
        `Severe fatigue/malaise: ${symptomCounts.fatigue + symptomCounts.malaise} episodes`,
        'Daily symptoms with substantial lifestyle impact',
        'Meets criteria for 100% rating'
    );
  } else if (dailySymptoms && weightLossPercentage >= 10) {
    supportedRating = 60;
    ratingRationale.push(
        'Daily fatigue and malaise with substantial weight loss',
        `Weight loss: ${weightLossPercentage}% documented`,
        `Symptoms present on ${daysWithSymptoms} days`,
        'Meets criteria for 60% rating'
    );
  } else if (dailySymptoms && (weightLossPercentage >= 5 || symptomCounts.appetiteLoss >= 30)) {
    supportedRating = 30;
    ratingRationale.push(
        'Daily fatigue and malaise documented',
        weightLossPercentage > 0 ? `Minor weight loss: ${weightLossPercentage}%` : 'Appetite loss with near-normal weight',
        dietaryRestrictions ? 'Dietary restrictions required' : '',
        'Meets criteria for 30% rating'
    ).filter(Boolean);
  } else if (intermittentSymptoms) {
    supportedRating = 10;
    ratingRationale.push(
        'Intermittent fatigue and malaise',
        `Symptoms on ${daysWithSymptoms} days over ${evaluationPeriodDays} days`,
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Hepatitis C diagnosed but minimal symptoms',
        'Nonsymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.fatigue > 0) evidence.push(`${symptomCounts.fatigue} fatigue episodes`);
  if (symptomCounts.malaise > 0) evidence.push(`${symptomCounts.malaise} malaise episodes`);
  if (symptomCounts.nausea > 0) evidence.push(`${symptomCounts.nausea} nausea episodes`);
  if (symptomCounts.abdominalPain > 0) evidence.push(`${symptomCounts.abdominalPain} abdominal pain episodes`);
  if (symptomCounts.jaundice > 0) evidence.push(`${symptomCounts.jaundice} jaundice occurrences`);
  if (weightLossPercentage > 0) evidence.push(`Weight loss: ${weightLossPercentage}%`);
  if (debilitating) evidence.push('Debilitating symptoms documented');

  // Gaps
  if (symptomCounts.fatigue + symptomCounts.malaise < 20) {
    gaps.push('Log fatigue and malaise more consistently');
  }
  if (weightLossPercentage === 0) {
    gaps.push('Track weight changes over time for rating evidence');
  }
  if (!dietaryRestrictions && symptomCounts.appetiteLoss > 0) {
    gaps.push('Document any dietary restrictions or modifications');
  }
  gaps.push('Track liver enzyme levels (ALT, AST, bilirubin) via Measurements tab');
  gaps.push('Document impact on work and daily activities');
  gaps.push('Note treatment regimen and side effects');

  return {
    condition: 'Hepatitis C',
    diagnosticCode: '7354',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: hepCLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      weightLossPercentage,
      debilitating,
      dailySymptoms,
    },
  };
};

export const analyzeHepatitisBLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const hepBLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.HEPATITIS_B.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('hep')
    );
  });

  if (hepBLogs.length === 0) {
    return {
      condition: 'Hepatitis B',
      diagnosticCode: '7345',
      hasData: false,
      message: 'No Hepatitis B symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging hepatitis symptoms',
        'Document fatigue and malaise frequency',
        'Track weight changes over time',
        'Note dietary restrictions and appetite changes',
        'Record liver enzyme values from lab work',
        'Document impact on daily activities',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    fatigue: 0,
    malaise: 0,
    nausea: 0,
    abdominalPain: 0,
    jaundice: 0,
    darkUrine: 0,
    appetiteLoss: 0,
    jointPain: 0,
    cognitiveIssues: 0,
    liverTenderness: 0,
  };

  let weightLossPercentage = 0;
  let debilitating = false;
  let dietaryRestrictions = false;

  hepBLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'hep-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'hep-malaise') symptomCounts.malaise++;
    if (symptomId === 'hep-nausea') symptomCounts.nausea++;
    if (symptomId === 'hep-abdominal-pain') symptomCounts.abdominalPain++;
    if (symptomId === 'hep-jaundice') symptomCounts.jaundice++;
    if (symptomId === 'hep-dark-urine') symptomCounts.darkUrine++;
    if (symptomId === 'hep-appetite-loss') symptomCounts.appetiteLoss++;
    if (symptomId === 'hep-joint-pain') symptomCounts.jointPain++;
    if (symptomId === 'hep-cognitive-issues') symptomCounts.cognitiveIssues++;
    if (symptomId === 'hep-liver-tenderness') symptomCounts.liverTenderness++;

    if (log.hepatitisData?.weightLossPercentage) {
      weightLossPercentage = Math.max(weightLossPercentage, parseFloat(log.hepatitisData.weightLossPercentage));
    }
    if (log.hepatitisData?.debilitating) {
      debilitating = true;
    }
    if (log.hepatitisData?.dietaryRestrictions) {
      dietaryRestrictions = true;
    }
  });

  const totalSymptomCount = Object.values(symptomCounts).reduce((a, b) => a + b, 0);
  const daysWithSymptoms = hepBLogs.length;
  const dailySymptoms = daysWithSymptoms >= evaluationPeriodDays * 0.7;
  const intermittentSymptoms = daysWithSymptoms >= evaluationPeriodDays * 0.2;

  evidence.push(`${hepBLogs.length} Hepatitis B symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination (same logic as Hep C)
  if (debilitating && dailySymptoms && (symptomCounts.fatigue >= 50 || symptomCounts.malaise >= 50)) {
    supportedRating = 100;
    ratingRationale.push(
        'Near-constant debilitating symptoms documented',
        `Severe fatigue/malaise: ${symptomCounts.fatigue + symptomCounts.malaise} episodes`,
        'Daily symptoms with substantial lifestyle impact',
        'Meets criteria for 100% rating'
    );
  } else if (dailySymptoms && weightLossPercentage >= 10) {
    supportedRating = 60;
    ratingRationale.push(
        'Daily fatigue and malaise with substantial weight loss',
        `Weight loss: ${weightLossPercentage}% documented`,
        `Symptoms present on ${daysWithSymptoms} days`,
        'Meets criteria for 60% rating'
    );
  } else if (dailySymptoms && (weightLossPercentage >= 5 || symptomCounts.appetiteLoss >= 30)) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Daily fatigue and malaise documented',
      weightLossPercentage > 0 ? `Minor weight loss: ${weightLossPercentage}%` : 'Appetite loss with near-normal weight',
      dietaryRestrictions ? 'Dietary restrictions required' : '',
      'Meets criteria for 30% rating'
    ].filter(Boolean));
  } else if (intermittentSymptoms) {
    supportedRating = 10;
    ratingRationale.push(
        'Intermittent fatigue and malaise',
        `Symptoms on ${daysWithSymptoms} days over ${evaluationPeriodDays} days`,
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Hepatitis B diagnosed but minimal symptoms',
        'Nonsymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.fatigue > 0) evidence.push(`${symptomCounts.fatigue} fatigue episodes`);
  if (symptomCounts.malaise > 0) evidence.push(`${symptomCounts.malaise} malaise episodes`);
  if (symptomCounts.nausea > 0) evidence.push(`${symptomCounts.nausea} nausea episodes`);
  if (symptomCounts.jaundice > 0) evidence.push(`${symptomCounts.jaundice} jaundice occurrences`);
  if (weightLossPercentage > 0) evidence.push(`Weight loss: ${weightLossPercentage}%`);
  if (debilitating) evidence.push('Debilitating symptoms documented');

  // Gaps
  if (symptomCounts.fatigue + symptomCounts.malaise < 20) {
    gaps.push('Log fatigue and malaise more consistently');
  }
  if (weightLossPercentage === 0) {
    gaps.push('Track weight changes over time');
  }
  gaps.push('Track liver enzyme levels via Measurements tab');
  gaps.push('Document impact on work and daily activities');
  gaps.push('Note treatment regimen and compliance');

  return {
    condition: 'Hepatitis B',
    diagnosticCode: '7345',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: hepBLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      weightLossPercentage,
      debilitating,
      dailySymptoms,
    },
  };
};

export const analyzeLymeDiseaseLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const lymeLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.LYME_DISEASE.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('lyme')
    );
  });

  if (lymeLogs.length === 0) {
    return {
      condition: 'Lyme Disease',
      diagnosticCode: '6319',
      hasData: false,
      message: 'No Lyme disease symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging Lyme disease symptoms',
        'Document active treatment if currently undergoing',
        'Track residual symptoms after treatment',
        'Note neurological symptoms (numbness, pain, cognitive issues)',
        'Document joint pain and arthritis symptoms',
        'Record any cardiac symptoms',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    rash: 0,
    fever: 0,
    headache: 0,
    fatigue: 0,
    jointPain: 0,
    muscleAches: 0,
    nervePain: 0,
    cognitive: 0,
    heartPalpitations: 0,
    facialParalysis: 0,
  };

  let activeTreatment = false;
  let treatmentCompleted = false;
  let hasNeurologicalSymptoms = false;
  let hasArthritisSymptoms = false;

  lymeLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'lyme-rash') symptomCounts.rash++;
    if (symptomId === 'lyme-fever') symptomCounts.fever++;
    if (symptomId === 'lyme-headache') symptomCounts.headache++;
    if (symptomId === 'lyme-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'lyme-joint-pain') {
      symptomCounts.jointPain++;
      hasArthritisSymptoms = true;
    }
    if (symptomId === 'lyme-muscle-aches') symptomCounts.muscleAches++;
    if (symptomId === 'lyme-nerve-pain') {
      symptomCounts.nervePain++;
      hasNeurologicalSymptoms = true;
    }
    if (symptomId === 'lyme-cognitive') {
      symptomCounts.cognitive++;
      hasNeurologicalSymptoms = true;
    }
    if (symptomId === 'lyme-heart-palpitations') symptomCounts.heartPalpitations++;
    if (symptomId === 'lyme-facial-paralysis') {
      symptomCounts.facialParalysis++;
      hasNeurologicalSymptoms = true;
    }

    if (log.lymeData?.activeTreatment) {
      activeTreatment = true;
    }
    if (log.lymeData?.treatmentCompleted) {
      treatmentCompleted = true;
    }
  });

  evidence.push(`${lymeLogs.length} Lyme disease symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (activeTreatment) {
    supportedRating = 100;
    ratingRationale.push(
        'Active Lyme disease requiring treatment',
        'Minimum 100% rating during active treatment period (6 months)',
        'After treatment, residuals rated by affected body system',
        'Meets criteria for 100% rating'
    );
    evidence.push('Currently undergoing active antibiotic treatment');
  } else if (treatmentCompleted) {
    supportedRating = 'Residuals';
    ratingRationale.push(
        'Treatment for Lyme disease completed',
        'Rate residual symptoms under appropriate body system codes:',
        hasNeurologicalSymptoms ? '  • Neurological symptoms (peripheral neuropathy, cognitive issues)' : '',
        hasArthritisSymptoms ? '  • Joint symptoms (arthritis codes)' : '',
        symptomCounts.fatigue > 30 ? '  • Chronic fatigue syndrome' : '',
        'Consult multiple diagnostic codes for comprehensive rating'
    ).filter(Boolean);
    evidence.push('Post-treatment Lyme disease syndrome (PTLDS)');
  } else {
    supportedRating = 'Requires Evaluation';
    ratingRationale.push(
        'Lyme disease symptoms documented',
        'Determine if currently in active treatment phase',
        'If post-treatment, rate residuals by body system',
        'Active treatment = 100% minimum for 6 months'
    );
  }

  // Evidence
  if (symptomCounts.rash > 0) evidence.push(`${symptomCounts.rash} rash occurrences (bull's-eye)`);
  if (symptomCounts.nervePain > 0) evidence.push(`${symptomCounts.nervePain} nerve pain episodes`);
  if (symptomCounts.cognitive > 0) evidence.push(`${symptomCounts.cognitive} cognitive impairment episodes`);
  if (symptomCounts.jointPain > 0) evidence.push(`${symptomCounts.jointPain} joint pain episodes`);
  if (symptomCounts.fatigue > 0) evidence.push(`${symptomCounts.fatigue} fatigue episodes`);
  if (symptomCounts.facialParalysis > 0) evidence.push(`${symptomCounts.facialParalysis} facial paralysis occurrences`);

  // Gaps
  if (!activeTreatment && !treatmentCompleted) {
    gaps.push('Clarify treatment status: active treatment or post-treatment?');
  }
  if (hasNeurologicalSymptoms) {
    gaps.push('Document neurological residuals for separate rating (DC 8520 or appropriate code)');
  }
  if (hasArthritisSymptoms) {
    gaps.push('Document joint symptoms for arthritis rating (appropriate joint DC)');
  }
  if (symptomCounts.fatigue > 30) {
    gaps.push('Consider chronic fatigue syndrome rating if fatigue persists post-treatment');
  }
  gaps.push('Medical records showing Lyme diagnosis (Western blot, ELISA)');
  gaps.push('Treatment records (antibiotics type, duration, completion date)');
  gaps.push('Specialist evaluations for persistent symptoms');

  return {
    condition: 'Lyme Disease',
    diagnosticCode: '6319',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: lymeLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      activeTreatment,
      treatmentCompleted,
      hasNeurologicalSymptoms,
      hasArthritisSymptoms,
    },
  };
};

export const analyzeMalariaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const malariaLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.MALARIA.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('malaria')
    );
  });

  if (malariaLogs.length === 0) {
    return {
      condition: 'Malaria',
      diagnosticCode: '6304',
      hasData: false,
      message: 'No malaria symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging malaria symptoms',
        'Document fever episodes with temperatures',
        'Track cyclical fever pattern (every 48-72 hours typical)',
        'Note any relapse episodes',
        'Record treatment medications',
        'Lab work confirming parasitemia if available',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    fever: 0,
    chills: 0,
    sweats: 0,
    headache: 0,
    muscleAches: 0,
    nausea: 0,
    fatigue: 0,
    jaundice: 0,
    anemia: 0,
    enlargedSpleen: 0,
  };

  let relapseCount = 0;
  let hospitalized = false;
  let continuousMedication = false;
  let severeComplications = false;

  malariaLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'malaria-fever') symptomCounts.fever++;
    if (symptomId === 'malaria-chills') symptomCounts.chills++;
    if (symptomId === 'malaria-sweats') symptomCounts.sweats++;
    if (symptomId === 'malaria-headache') symptomCounts.headache++;
    if (symptomId === 'malaria-muscle-aches') symptomCounts.muscleAches++;
    if (symptomId === 'malaria-nausea') symptomCounts.nausea++;
    if (symptomId === 'malaria-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'malaria-jaundice') {
      symptomCounts.jaundice++;
      severeComplications = true;
    }
    if (symptomId === 'malaria-anemia') symptomCounts.anemia++;
    if (symptomId === 'malaria-enlarged-spleen') symptomCounts.enlargedSpleen++;

    if (log.malariaData?.relapseEpisode) relapseCount++;
    if (log.malariaData?.hospitalized) hospitalized = true;
    if (log.malariaData?.continuousMedication) continuousMedication = true;
    if (log.malariaData?.severeComplications) severeComplications = true;
  });

  const totalSymptoms = Object.values(symptomCounts).reduce((a, b) => a + b, 0);
  const daysWithSymptoms = malariaLogs.length;

  evidence.push(`${malariaLogs.length} malaria symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (hospitalized || severeComplications || (continuousMedication && daysWithSymptoms >= 60)) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Active severe malaria requiring treatment',
      hospitalized ? 'Hospitalization documented' : '',
      severeComplications ? 'Severe complications present (jaundice/organ involvement)' : '',
      continuousMedication ? 'Continuous antimalarial medication required' : '',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (relapseCount >= 3 || (symptomCounts.fever >= 20 && daysWithSymptoms >= 30)) {
    supportedRating = 60;
    ratingRationale.push(...[
      'Frequent relapses with debilitating symptoms',
      `${relapseCount} relapse episodes documented`,
      `Fever episodes: ${symptomCounts.fever}`,
      symptomCounts.anemia > 5 ? 'Chronic anemia documented' : '',
      'Meets criteria for 60% rating'
    ].filter(Boolean));
  } else if (relapseCount >= 1 || daysWithSymptoms >= 15) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Occasional relapses or chronic residual symptoms',
      relapseCount > 0 ? `${relapseCount} relapse episode(s) documented` : '',
      `Symptoms present on ${daysWithSymptoms} days`,
      symptomCounts.enlargedSpleen > 0 ? 'Splenomegaly documented' : '',
      'Meets criteria for 30% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 3) {
    supportedRating = 10;
    ratingRationale.push(
        'Residual symptoms or minimal impact',
        `Symptoms on ${daysWithSymptoms} days`,
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Malaria treated, minimal current symptoms',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.fever > 0) evidence.push(`${symptomCounts.fever} fever episodes`);
  if (symptomCounts.chills > 0) evidence.push(`${symptomCounts.chills} episodes of chills`);
  if (symptomCounts.sweats > 0) evidence.push(`${symptomCounts.sweats} night sweats episodes`);
  if (symptomCounts.jaundice > 0) evidence.push(`${symptomCounts.jaundice} jaundice occurrences (severe complication)`);
  if (symptomCounts.anemia > 0) evidence.push(`${symptomCounts.anemia} anemia episodes`);
  if (relapseCount > 0) evidence.push(`${relapseCount} documented relapses`);

  // Gaps
  if (symptomCounts.fever < 5) {
    gaps.push('Log fever episodes consistently with temperature readings');
  }
  if (relapseCount === 0 && daysWithSymptoms > 10) {
    gaps.push('Document if symptoms represent relapse or initial infection');
  }
  gaps.push('Lab work: blood smear or rapid diagnostic test confirming parasitemia');
  gaps.push('Document antimalarial medications (chloroquine, artemisinin, primaquine)');
  gaps.push('Note cyclical pattern if fever occurs every 48-72 hours');
  if (symptomCounts.anemia > 0 || symptomCounts.jaundice > 0) {
    gaps.push('CBC and liver function tests to document severity');
  }

  return {
    condition: 'Malaria',
    diagnosticCode: '6304',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: malariaLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      relapseCount,
      hospitalized,
      severeComplications,
    },
  };
};

export const analyzeBrucellosisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const brucellosisLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.BRUCELLOSIS.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('brucellosis')
    );
  });

  if (brucellosisLogs.length === 0) {
    return {
      condition: 'Brucellosis',
      diagnosticCode: '6316',
      hasData: false,
      message: 'No brucellosis symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging brucellosis symptoms',
        'Document undulant (wave-like) fever pattern',
        'Track night sweats episodes',
        'Note joint or back pain (spondylitis common)',
        'Record treatment (doxycycline + rifampin typical)',
        'Blood cultures or serology confirming diagnosis',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    fever: 0,
    nightSweats: 0,
    fatigue: 0,
    jointPain: 0,
    muscleAches: 0,
    headache: 0,
    backPain: 0,
    weightLoss: 0,
    depression: 0,
    liverSpleen: 0,
  };

  let relapseCount = 0;
  let multiOrganInvolvement = false;
  let chronicArthritis = false;
  let neurobrucellosis = false;

  brucellosisLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'brucellosis-fever') symptomCounts.fever++;
    if (symptomId === 'brucellosis-night-sweats') symptomCounts.nightSweats++;
    if (symptomId === 'brucellosis-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'brucellosis-joint-pain') symptomCounts.jointPain++;
    if (symptomId === 'brucellosis-muscle-aches') symptomCounts.muscleAches++;
    if (symptomId === 'brucellosis-headache') symptomCounts.headache++;
    if (symptomId === 'brucellosis-back-pain') {
      symptomCounts.backPain++;
      chronicArthritis = true;
    }
    if (symptomId === 'brucellosis-weight-loss') symptomCounts.weightLoss++;
    if (symptomId === 'brucellosis-depression') symptomCounts.depression++;
    if (symptomId === 'brucellosis-liver-spleen') {
      symptomCounts.liverSpleen++;
      multiOrganInvolvement = true;
    }

    if (log.brucellosisData?.relapseEpisode) relapseCount++;
    if (log.brucellosisData?.multiOrganInvolvement) multiOrganInvolvement = true;
    if (log.brucellosisData?.chronicArthritis) chronicArthritis = true;
    if (log.brucellosisData?.neurobrucellosis) neurobrucellosis = true;
  });

  const daysWithSymptoms = brucellosisLogs.length;

  evidence.push(`${brucellosisLogs.length} brucellosis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (neurobrucellosis || (multiOrganInvolvement && daysWithSymptoms >= 60)) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Severe active brucellosis with organ involvement',
      neurobrucellosis ? 'Neurobrucellosis (CNS involvement) documented' : '',
      multiOrganInvolvement ? 'Multiple organ involvement' : '',
      'Constant debilitating symptoms',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (relapseCount >= 3 || (chronicArthritis && daysWithSymptoms >= 30)) {
    supportedRating = 60;
    ratingRationale.push(...[
      'Active disease with relapsing pattern',
      `${relapseCount} relapse episodes documented`,
      chronicArthritis ? 'Chronic arthritis/spondylitis present' : '',
      `Symptoms on ${daysWithSymptoms} days`,
      'Meets criteria for 60% rating'
    ].filter(Boolean));
  } else if (relapseCount >= 1 || daysWithSymptoms >= 15) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Occasional relapses or chronic symptoms',
      relapseCount > 0 ? `${relapseCount} relapse episode(s)` : '',
      symptomCounts.depression > 5 ? 'Chronic depression/mood changes' : '',
      'Meets criteria for 30% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 3) {
    supportedRating = 10;
    ratingRationale.push(
        'Residual symptoms with minimal impact',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Brucellosis treated, minimal symptoms',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.fever > 0) evidence.push(`${symptomCounts.fever} fever episodes`);
  if (symptomCounts.nightSweats > 0) evidence.push(`${symptomCounts.nightSweats} night sweats episodes`);
  if (symptomCounts.backPain > 0) evidence.push(`${symptomCounts.backPain} back pain episodes (spondylitis)`);
  if (symptomCounts.jointPain > 0) evidence.push(`${symptomCounts.jointPain} joint pain episodes`);
  if (symptomCounts.depression > 0) evidence.push(`${symptomCounts.depression} depression/mood episodes`);
  if (relapseCount > 0) evidence.push(`${relapseCount} documented relapses`);

  // Gaps
  gaps.push('Blood cultures or serology (IgG/IgM titers) confirming diagnosis');
  gaps.push('Document treatment (typically doxycycline + rifampin for 6+ weeks)');
  if (symptomCounts.backPain > 5) {
    gaps.push('Spine imaging (X-ray/MRI) to evaluate for spondylitis');
  }
  if (symptomCounts.jointPain > 5) {
    gaps.push('Joint imaging to document arthritis');
  }
  gaps.push('Track relapse pattern - symptoms may recur for years');

  return {
    condition: 'Brucellosis',
    diagnosticCode: '6316',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: brucellosisLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      relapseCount,
      multiOrganInvolvement,
      chronicArthritis,
      neurobrucellosis,
    },
  };
};

export const analyzeCampylobacterLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const campylobacterLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.CAMPYLOBACTER.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('campylobacter')
    );
  });

  if (campylobacterLogs.length === 0) {
    return {
      condition: 'Campylobacter jejuni Infection',
      diagnosticCode: '6330',
      hasData: false,
      message: 'No Campylobacter symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging Campylobacter-related symptoms',
        'Document GI symptoms (diarrhea, abdominal pain)',
        'Track any reactive arthritis (joint pain 1-4 weeks post-infection)',
        'Note neurological symptoms (weakness, numbness)',
        'Original stool culture confirming Campylobacter',
        'Monitor for Guillain-Barré syndrome symptoms',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    diarrhea: 0,
    abdominalPain: 0,
    fever: 0,
    nausea: 0,
    vomiting: 0,
    bloodyStool: 0,
    fatigue: 0,
    jointPain: 0,
    muscleWeakness: 0,
    nerveSymptoms: 0,
  };

  let guillainBarre = false;
  let reactiveArthritis = false;
  let chronicIBS = false;
  let peripheralNeuropathy = false;

  campylobacterLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'campylobacter-diarrhea') symptomCounts.diarrhea++;
    if (symptomId === 'campylobacter-abdominal-pain') symptomCounts.abdominalPain++;
    if (symptomId === 'campylobacter-fever') symptomCounts.fever++;
    if (symptomId === 'campylobacter-nausea') symptomCounts.nausea++;
    if (symptomId === 'campylobacter-vomiting') symptomCounts.vomiting++;
    if (symptomId === 'campylobacter-bloody-stool') symptomCounts.bloodyStool++;
    if (symptomId === 'campylobacter-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'campylobacter-joint-pain') {
      symptomCounts.jointPain++;
      reactiveArthritis = true;
    }
    if (symptomId === 'campylobacter-muscle-weakness') {
      symptomCounts.muscleWeakness++;
      if (log.campylobacterData?.guillainBarre) guillainBarre = true;
    }
    if (symptomId === 'campylobacter-nerve-symptoms') {
      symptomCounts.nerveSymptoms++;
      peripheralNeuropathy = true;
    }

    if (log.campylobacterData?.guillainBarre) guillainBarre = true;
    if (log.campylobacterData?.reactiveArthritis) reactiveArthritis = true;
    if (log.campylobacterData?.chronicIBS) chronicIBS = true;
  });

  const daysWithSymptoms = campylobacterLogs.length;

  evidence.push(`${campylobacterLogs.length} Campylobacter-related symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (guillainBarre || (symptomCounts.muscleWeakness >= 20 && symptomCounts.nerveSymptoms >= 10)) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Severe post-infectious complications',
      guillainBarre ? 'Guillain-Barré syndrome (GBS) documented' : '',
      'Severe functional impairment',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (reactiveArthritis && symptomCounts.jointPain >= 15) {
    supportedRating = 60;
    ratingRationale.push(...[
      'Moderate complications with ongoing impairment',
      'Reactive arthritis affecting multiple joints',
      `Joint pain episodes: ${symptomCounts.jointPain}`,
      peripheralNeuropathy ? 'Peripheral neuropathy present' : '',
      'Meets criteria for 60% rating'
    ].filter(Boolean));
  } else if ((reactiveArthritis && symptomCounts.jointPain >= 5) || (chronicIBS && symptomCounts.diarrhea >= 10)) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Mild chronic symptoms or occasional relapses',
      reactiveArthritis ? 'Mild reactive arthritis' : '',
      chronicIBS ? 'Post-infectious IBS' : '',
      'Meets criteria for 30% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Minimal residual symptoms',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Fully recovered from Campylobacter infection',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.diarrhea > 0) evidence.push(`${symptomCounts.diarrhea} diarrhea episodes`);
  if (symptomCounts.jointPain > 0) evidence.push(`${symptomCounts.jointPain} joint pain episodes (reactive arthritis)`);
  if (symptomCounts.muscleWeakness > 0) evidence.push(`${symptomCounts.muscleWeakness} muscle weakness episodes`);
  if (symptomCounts.nerveSymptoms > 0) evidence.push(`${symptomCounts.nerveSymptoms} neurological symptoms`);
  if (guillainBarre) evidence.push('Guillain-Barré syndrome diagnosed');

  // Gaps
  gaps.push('Stool culture confirming Campylobacter jejuni');
  if (symptomCounts.jointPain > 5) {
    gaps.push('Rheumatology evaluation for reactive arthritis');
    gaps.push('Joint imaging if available');
  }
  if (symptomCounts.muscleWeakness > 5 || symptomCounts.nerveSymptoms > 5) {
    gaps.push('Neurological evaluation');
    gaps.push('EMG/nerve conduction studies if GBS suspected');
  }
  if (symptomCounts.diarrhea > 10) {
    gaps.push('GI evaluation for post-infectious IBS');
  }
  gaps.push('Link symptoms to original Campylobacter infection (timeline important)');

  return {
    condition: 'Campylobacter jejuni Infection',
    diagnosticCode: '6330',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: campylobacterLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      guillainBarre,
      reactiveArthritis,
      chronicIBS,
      peripheralNeuropathy,
    },
  };
};

export const analyzeQFeverLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const qFeverLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.Q_FEVER.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('q-fever')
    );
  });

  if (qFeverLogs.length === 0) {
    return {
      condition: 'Q Fever',
      diagnosticCode: '6331',
      hasData: false,
      message: 'No Q fever symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging Q fever symptoms',
        'Document fever, headaches, and fatigue',
        'Track respiratory symptoms (cough, chest pain)',
        'Note night sweats and chills',
        'Record treatment (doxycycline)',
        'Serology (Phase I/II antibodies) confirming diagnosis',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    fever: 0,
    headache: 0,
    fatigue: 0,
    muscleAches: 0,
    cough: 0,
    chestPain: 0,
    nightSweats: 0,
    chills: 0,
    shortnessBreath: 0,
    jointPain: 0,
  };

  let chronicQFever = false;
  let endocarditis = false;
  let fatigueSyndrome = false;
  let monthsSinceInfection = 0;

  qFeverLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'q-fever-fever') symptomCounts.fever++;
    if (symptomId === 'q-fever-headache') symptomCounts.headache++;
    if (symptomId === 'q-fever-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'q-fever-muscle-aches') symptomCounts.muscleAches++;
    if (symptomId === 'q-fever-cough') symptomCounts.cough++;
    if (symptomId === 'q-fever-chest-pain') symptomCounts.chestPain++;
    if (symptomId === 'q-fever-night-sweats') symptomCounts.nightSweats++;
    if (symptomId === 'q-fever-chills') symptomCounts.chills++;
    if (symptomId === 'q-fever-shortness-breath') symptomCounts.shortnessBreath++;
    if (symptomId === 'q-fever-joint-pain') symptomCounts.jointPain++;

    if (log.qFeverData?.chronicQFever) chronicQFever = true;
    if (log.qFeverData?.endocarditis) {
      endocarditis = true;
      chronicQFever = true;
    }
    if (log.qFeverData?.fatigueSyndrome) fatigueSyndrome = true;
    if (log.qFeverData?.monthsSinceInfection) {
      monthsSinceInfection = Math.max(monthsSinceInfection, parseInt(log.qFeverData.monthsSinceInfection));
    }
  });

  const daysWithSymptoms = qFeverLogs.length;

  evidence.push(`${qFeverLogs.length} Q fever symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (endocarditis || (chronicQFever && monthsSinceInfection >= 6)) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Chronic Q fever with serious complications',
      endocarditis ? 'Q fever endocarditis (valve infection) documented' : '',
      chronicQFever ? `Chronic infection (${monthsSinceInfection}+ months)` : '',
      'Requires long-term antibiotics',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (fatigueSyndrome && symptomCounts.fatigue >= 30 && monthsSinceInfection >= 6) {
    supportedRating = 60;
    ratingRationale.push(...[
      'Post-Q fever fatigue syndrome',
      `Severe chronic fatigue: ${symptomCounts.fatigue} episodes`,
      `Duration: ${monthsSinceInfection} months post-infection`,
      'Substantially impacts daily function',
      'Meets criteria for 60% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 20 || (monthsSinceInfection >= 3 && symptomCounts.fatigue >= 10)) {
    supportedRating = 30;
    ratingRationale.push(...[
      'Mild chronic symptoms or persistent fatigue',
      `Symptoms on ${daysWithSymptoms} days`,
      symptomCounts.fatigue > 0 ? `Chronic fatigue: ${symptomCounts.fatigue} episodes` : '',
      'Meets criteria for 30% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Minimal residual symptoms',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Fully recovered from acute Q fever',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.fever > 0) evidence.push(`${symptomCounts.fever} fever episodes`);
  if (symptomCounts.fatigue > 0) evidence.push(`${symptomCounts.fatigue} fatigue episodes`);
  if (symptomCounts.headache > 0) evidence.push(`${symptomCounts.headache} headache episodes`);
  if (symptomCounts.nightSweats > 0) evidence.push(`${symptomCounts.nightSweats} night sweats episodes`);
  if (endocarditis) evidence.push('Endocarditis confirmed (echocardiogram)');
  if (chronicQFever) evidence.push(`Chronic Q fever (${monthsSinceInfection}+ months)`);

  // Gaps
  gaps.push('Serology: Phase I and Phase II antibody titers');
  if (chronicQFever || monthsSinceInfection >= 6) {
    gaps.push('Echocardiogram to evaluate for endocarditis');
    gaps.push('Phase I IgG titer >1:800 indicates chronic infection');
  }
  if (symptomCounts.fatigue > 20) {
    gaps.push('Functional assessment documenting impact on daily activities');
  }
  gaps.push('Document treatment (doxycycline, +hydroxychloroquine if chronic)');
  gaps.push('Timeline: track months since initial infection');

  return {
    condition: 'Q Fever',
    diagnosticCode: '6331',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: qFeverLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      chronicQFever,
      endocarditis,
      fatigueSyndrome,
      monthsSinceInfection,
    },
  };
};

export const analyzeSalmonellaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const salmonellaLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.SALMONELLA.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('salmonella')
    );
  });

  if (salmonellaLogs.length === 0) {
    return {
      condition: 'Nontyphoid Salmonella Infection',
      diagnosticCode: '6333',
      hasData: false,
      message: 'No Salmonella symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging Salmonella symptoms',
        'Document GI symptoms (diarrhea, bloody stool, cramps)',
        'Note any joint pain (reactive arthritis)',
        'Stool culture confirming Salmonella',
        'Track fever and dehydration',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    diarrhea: 0,
    fever: 0,
    abdominalCramps: 0,
    nausea: 0,
    vomiting: 0,
    bloodyStool: 0,
    jointPain: 0,
    bacteremia: 0,
    dehydration: 0,
    fatigue: 0,
  };

  let hospitalized = false;
  let bacteremia = false;
  let reactiveArthritis = false;
  let severeComplications = false;

  salmonellaLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'salmonella-diarrhea') symptomCounts.diarrhea++;
    if (symptomId === 'salmonella-fever') symptomCounts.fever++;
    if (symptomId === 'salmonella-abdominal-cramps') symptomCounts.abdominalCramps++;
    if (symptomId === 'salmonella-nausea') symptomCounts.nausea++;
    if (symptomId === 'salmonella-vomiting') symptomCounts.vomiting++;
    if (symptomId === 'salmonella-bloody-stool') symptomCounts.bloodyStool++;
    if (symptomId === 'salmonella-joint-pain') {
      symptomCounts.jointPain++;
      reactiveArthritis = true;
    }
    if (symptomId === 'salmonella-bacteremia') {
      symptomCounts.bacteremia++;
      bacteremia = true;
      severeComplications = true;
    }
    if (symptomId === 'salmonella-dehydration') symptomCounts.dehydration++;
    if (symptomId === 'salmonella-fatigue') symptomCounts.fatigue++;

    if (log.salmonellaData?.hospitalized) hospitalized = true;
    if (log.salmonellaData?.bacteremia) {
      bacteremia = true;
      severeComplications = true;
    }
    if (log.salmonellaData?.reactiveArthritis) reactiveArthritis = true;
    if (log.salmonellaData?.severeComplications) severeComplications = true;
  });

  const daysWithSymptoms = salmonellaLogs.length;

  evidence.push(`${salmonellaLogs.length} Salmonella symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (bacteremia || hospitalized || severeComplications) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Severe complications requiring hospitalization',
      bacteremia ? 'Bacteremia/sepsis documented' : '',
      hospitalized ? 'Hospitalization required' : '',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (reactiveArthritis && symptomCounts.jointPain >= 10) {
    supportedRating = 60;
    ratingRationale.push(...[
      'Moderate symptoms with reactive arthritis',
      `Joint pain episodes: ${symptomCounts.jointPain}`,
      'Significant functional impact',
      'Meets criteria for 60% rating'
    ].filter(Boolean));
  } else if (daysWithSymptoms >= 15 || (reactiveArthritis && symptomCounts.jointPain >= 5)) {
    supportedRating = 30;
    ratingRationale.push(
        'Mild chronic symptoms',
        `Symptoms on ${daysWithSymptoms} days`,
        'Meets criteria for 30% rating'
    );
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Minimal residual symptoms',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Fully recovered from Salmonella',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.diarrhea > 0) evidence.push(`${symptomCounts.diarrhea} diarrhea episodes`);
  if (symptomCounts.bloodyStool > 0) evidence.push(`${symptomCounts.bloodyStool} bloody stool episodes`);
  if (symptomCounts.jointPain > 0) evidence.push(`${symptomCounts.jointPain} joint pain episodes (reactive arthritis)`);
  if (bacteremia) evidence.push('Bacteremia documented');

  // Gaps
  gaps.push('Stool culture confirming Salmonella species');
  if (symptomCounts.jointPain > 5) {
    gaps.push('Rheumatology evaluation for reactive arthritis');
  }
  if (bacteremia) {
    gaps.push('Blood culture results');
  }
  gaps.push('Document acute symptoms and post-infectious complications');

  return {
    condition: 'Nontyphoid Salmonella Infection',
    diagnosticCode: '6333',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: salmonellaLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      hospitalized,
      bacteremia,
      reactiveArthritis,
    },
  };
};

export const analyzeShigellaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const shigellaLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.SHIGELLA.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('shigella')
    );
  });

  if (shigellaLogs.length === 0) {
    return {
      condition: 'Shigella Infection',
      diagnosticCode: '6334',
      hasData: false,
      message: 'No Shigella symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging Shigella symptoms',
        'Document bloody diarrhea and tenesmus',
        'Track fever and abdominal cramps',
        'Note any joint pain or seizures',
        'Stool culture confirming Shigella',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    diarrhea: 0,
    bloodyStool: 0,
    abdominalCramps: 0,
    fever: 0,
    tenesmus: 0,
    nausea: 0,
    vomiting: 0,
    dehydration: 0,
    reactiveArthritis: 0,
    seizures: 0,
  };

  let hospitalized = false;
  let hus = false;
  let reactiveArthritis = false;
  let severeComplications = false;

  shigellaLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'shigella-diarrhea') symptomCounts.diarrhea++;
    if (symptomId === 'shigella-bloody-stool') symptomCounts.bloodyStool++;
    if (symptomId === 'shigella-abdominal-cramps') symptomCounts.abdominalCramps++;
    if (symptomId === 'shigella-fever') symptomCounts.fever++;
    if (symptomId === 'shigella-tenesmus') symptomCounts.tenesmus++;
    if (symptomId === 'shigella-nausea') symptomCounts.nausea++;
    if (symptomId === 'shigella-vomiting') symptomCounts.vomiting++;
    if (symptomId === 'shigella-dehydration') symptomCounts.dehydration++;
    if (symptomId === 'shigella-reactive-arthritis') {
      symptomCounts.reactiveArthritis++;
      reactiveArthritis = true;
    }
    if (symptomId === 'shigella-seizures') {
      symptomCounts.seizures++;
      severeComplications = true;
    }

    if (log.shigellaData?.hospitalized) hospitalized = true;
    if (log.shigellaData?.hus) {
      hus = true;
      severeComplications = true;
    }
    if (log.shigellaData?.reactiveArthritis) reactiveArthritis = true;
    if (log.shigellaData?.severeComplications) severeComplications = true;
  });

  const daysWithSymptoms = shigellaLogs.length;

  evidence.push(`${shigellaLogs.length} Shigella symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (hus || hospitalized || severeComplications) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Severe complications',
      hus ? 'Hemolytic uremic syndrome (HUS)' : '',
      symptomCounts.seizures > 0 ? 'Seizures documented' : '',
      hospitalized ? 'Hospitalization required' : '',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (reactiveArthritis && symptomCounts.reactiveArthritis >= 10) {
    supportedRating = 60;
    ratingRationale.push(
        'Moderate symptoms with reactive arthritis',
        `Joint pain episodes: ${symptomCounts.reactiveArthritis}`,
        'Meets criteria for 60% rating'
    );
  } else if (daysWithSymptoms >= 15) {
    supportedRating = 30;
    ratingRationale.push(
        'Mild chronic symptoms',
        `Symptoms on ${daysWithSymptoms} days`,
        'Meets criteria for 30% rating'
    );
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Minimal residual symptoms',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Fully recovered from Shigella',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.diarrhea > 0) evidence.push(`${symptomCounts.diarrhea} diarrhea episodes`);
  if (symptomCounts.bloodyStool > 0) evidence.push(`${symptomCounts.bloodyStool} bloody stool episodes (dysentery)`);
  if (symptomCounts.tenesmus > 0) evidence.push(`${symptomCounts.tenesmus} tenesmus episodes`);
  if (symptomCounts.reactiveArthritis > 0) evidence.push(`${symptomCounts.reactiveArthritis} reactive arthritis episodes`);
  if (hus) evidence.push('HUS documented');

  // Gaps
  gaps.push('Stool culture confirming Shigella species');
  if (hus) {
    gaps.push('Lab work: CBC, BMP showing kidney function, platelet count');
  }
  if (reactiveArthritis) {
    gaps.push('Rheumatology evaluation');
  }
  gaps.push('Document severity of dysentery and complications');

  return {
    condition: 'Shigella Infection',
    diagnosticCode: '6334',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: shigellaLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      hospitalized,
      hus,
      reactiveArthritis,
    },
  };
};

export const analyzeWestNileLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const westNileLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.WEST_NILE.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('west-nile')
    );
  });

  if (westNileLogs.length === 0) {
    return {
      condition: 'West Nile Virus',
      diagnosticCode: '6335',
      hasData: false,
      message: 'No West Nile symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging West Nile symptoms',
        'Document neurological symptoms (weakness, tremors, cognitive)',
        'Track chronic fatigue',
        'Serology confirming West Nile IgM antibodies',
        'Neurological evaluation if deficits present',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    fever: 0,
    headache: 0,
    bodyAches: 0,
    fatigue: 0,
    weakness: 0,
    cognitive: 0,
    tremors: 0,
    visionProblems: 0,
    numbness: 0,
    paralysis: 0,
  };

  let neuroinvasive = false;
  let permanentImpairment = false;
  let encephalitis = false;
  let acuteFlaccidParalysis = false;

  westNileLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'west-nile-fever') symptomCounts.fever++;
    if (symptomId === 'west-nile-headache') symptomCounts.headache++;
    if (symptomId === 'west-nile-body-aches') symptomCounts.bodyAches++;
    if (symptomId === 'west-nile-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'west-nile-weakness') symptomCounts.weakness++;
    if (symptomId === 'west-nile-cognitive') symptomCounts.cognitive++;
    if (symptomId === 'west-nile-tremors') symptomCounts.tremors++;
    if (symptomId === 'west-nile-vision-problems') symptomCounts.visionProblems++;
    if (symptomId === 'west-nile-numbness') symptomCounts.numbness++;
    if (symptomId === 'west-nile-paralysis') {
      symptomCounts.paralysis++;
      acuteFlaccidParalysis = true;
      neuroinvasive = true;
      permanentImpairment = true;
    }

    if (log.westNileData?.neuroinvasive) neuroinvasive = true;
    if (log.westNileData?.encephalitis) {
      encephalitis = true;
      neuroinvasive = true;
    }
    if (log.westNileData?.acuteFlaccidParalysis) {
      acuteFlaccidParalysis = true;
      permanentImpairment = true;
    }
    if (log.westNileData?.permanentImpairment) permanentImpairment = true;
  });

  const daysWithSymptoms = westNileLogs.length;

  evidence.push(`${westNileLogs.length} West Nile symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (acuteFlaccidParalysis || encephalitis || (neuroinvasive && permanentImpairment)) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Severe neuroinvasive disease with permanent impairment',
      acuteFlaccidParalysis ? 'Acute flaccid paralysis (polio-like)' : '',
      encephalitis ? 'Encephalitis documented' : '',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (neuroinvasive || (symptomCounts.weakness >= 20 && symptomCounts.fatigue >= 20)) {
    supportedRating = 60;
    ratingRationale.push(
        'Moderate neurological symptoms or chronic fatigue',
        `Muscle weakness: ${symptomCounts.weakness} episodes`,
        `Chronic fatigue: ${symptomCounts.fatigue} episodes`,
        'Meets criteria for 60% rating'
    );
  } else if (daysWithSymptoms >= 20 || symptomCounts.weakness >= 10) {
    supportedRating = 30;
    ratingRationale.push(
        'Mild chronic symptoms',
        'Post-West Nile syndrome',
        'Meets criteria for 30% rating'
    );
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Minimal residual symptoms',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Fully recovered from West Nile',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.weakness > 0) evidence.push(`${symptomCounts.weakness} muscle weakness episodes`);
  if (symptomCounts.fatigue > 0) evidence.push(`${symptomCounts.fatigue} fatigue episodes`);
  if (symptomCounts.cognitive > 0) evidence.push(`${symptomCounts.cognitive} cognitive impairment episodes`);
  if (symptomCounts.paralysis > 0) evidence.push(`${symptomCounts.paralysis} paralysis episodes (AFP)`);
  if (neuroinvasive) evidence.push('Neuroinvasive disease documented');

  // Gaps
  gaps.push('Serology: West Nile IgM antibodies');
  if (neuroinvasive) {
    gaps.push('CSF analysis');
    gaps.push('MRI/CT brain imaging');
    gaps.push('Neurological examination documenting deficits');
  }
  if (symptomCounts.weakness > 10 || symptomCounts.paralysis > 0) {
    gaps.push('EMG/nerve conduction studies');
  }
  gaps.push('Document both acute illness and chronic post-West Nile syndrome');

  return {
    condition: 'West Nile Virus',
    diagnosticCode: '6335',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: westNileLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      neuroinvasive,
      encephalitis,
      acuteFlaccidParalysis,
      permanentImpairment,
    },
  };
};

export const analyzeNTMLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const ntmLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && (
        INFECTIOUS_CONDITIONS.NTM.symptomIds.includes(getLogSymptomId(log)) ||
        getLogSymptomId(log)?.includes('ntm')
    );
  });

  if (ntmLogs.length === 0) {
    return {
      condition: 'Nontuberculous Mycobacterium Infection',
      diagnosticCode: '6312',
      hasData: false,
      message: 'No NTM symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Start logging NTM symptoms',
        'Document chronic cough and sputum production',
        'Track weight loss and fatigue',
        'Sputum cultures (multiple) confirming NTM',
        'CT scan showing lung involvement',
        'Pulmonary function tests',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  const symptomCounts = {
    cough: 0,
    sputum: 0,
    fatigue: 0,
    fever: 0,
    nightSweats: 0,
    weightLoss: 0,
    chestPain: 0,
    shortnessBreath: 0,
    hemoptysis: 0,
    lymphNodes: 0,
  };

  let activeDisease = false;
  let onTreatment = false;
  let disseminated = false;
  let monthsOnTreatment = 0;

  ntmLogs.forEach(log => {
    const symptomId = getLogSymptomId(log);

    if (symptomId === 'ntm-cough') symptomCounts.cough++;
    if (symptomId === 'ntm-sputum') symptomCounts.sputum++;
    if (symptomId === 'ntm-fatigue') symptomCounts.fatigue++;
    if (symptomId === 'ntm-fever') symptomCounts.fever++;
    if (symptomId === 'ntm-night-sweats') symptomCounts.nightSweats++;
    if (symptomId === 'ntm-weight-loss') symptomCounts.weightLoss++;
    if (symptomId === 'ntm-chest-pain') symptomCounts.chestPain++;
    if (symptomId === 'ntm-shortness-breath') symptomCounts.shortnessBreath++;
    if (symptomId === 'ntm-hemoptysis') symptomCounts.hemoptysis++;
    if (symptomId === 'ntm-lymph-nodes') {
      symptomCounts.lymphNodes++;
      disseminated = true;
    }

    if (log.ntmData?.activeDisease) activeDisease = true;
    if (log.ntmData?.onTreatment) onTreatment = true;
    if (log.ntmData?.disseminated) disseminated = true;
    if (log.ntmData?.monthsOnTreatment) {
      monthsOnTreatment = Math.max(monthsOnTreatment, parseInt(log.ntmData.monthsOnTreatment));
    }
  });

  const daysWithSymptoms = ntmLogs.length;

  evidence.push(`${ntmLogs.length} NTM symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if ((activeDisease && onTreatment && monthsOnTreatment >= 6) || disseminated) {
    supportedRating = 100;
    ratingRationale.push(...[
      'Active NTM requiring continuous treatment',
      onTreatment ? `On treatment for ${monthsOnTreatment} months` : '',
      disseminated ? 'Disseminated disease' : '',
      'Meets criteria for 100% rating'
    ].filter(Boolean));
  } else if (activeDisease && onTreatment) {
    supportedRating = 60;
    ratingRationale.push(
        'Active NTM with moderate symptoms on treatment',
        onTreatment ? 'Long-term antibiotic therapy' : '',
        'Meets criteria for 60% rating'
    );
  } else if (daysWithSymptoms >= 20 || symptomCounts.cough >= 30) {
    supportedRating = 30;
    ratingRationale.push(
        'Mild disease or post-treatment monitoring',
        'Chronic respiratory symptoms',
        'Meets criteria for 30% rating'
    );
  } else if (daysWithSymptoms >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'Colonization without active disease',
        'Meets criteria for 10% rating'
    );
  } else {
    supportedRating = 0;
    ratingRationale.push(
        'Successfully treated, no residuals',
        'Asymptomatic rating'
    );
  }

  // Evidence
  if (symptomCounts.cough > 0) evidence.push(`${symptomCounts.cough} chronic cough episodes`);
  if (symptomCounts.sputum > 0) evidence.push(`${symptomCounts.sputum} sputum production episodes`);
  if (symptomCounts.hemoptysis > 0) evidence.push(`${symptomCounts.hemoptysis} hemoptysis episodes (coughing blood)`);
  if (symptomCounts.weightLoss > 0) evidence.push(`${symptomCounts.weightLoss} weight loss documented`);
  if (onTreatment) evidence.push(`On NTM treatment for ${monthsOnTreatment} months`);

  // Gaps
  gaps.push('Multiple sputum cultures confirming NTM species (MAC, M. abscessus, M. kansasii)');
  gaps.push('CT chest showing nodular/cavitary disease');
  gaps.push('Pulmonary function tests');
  if (onTreatment) {
    gaps.push('Treatment compliance documentation (12-24 month regimen)');
    gaps.push('Drug regimen: typically macrolide + ethambutol + rifampin');
  }
  gaps.push('Infectious disease specialist notes');

  return {
    condition: 'Nontuberculous Mycobacterium Infection',
    diagnosticCode: '6312',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: ntmLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      activeDisease,
      onTreatment,
      disseminated,
      monthsOnTreatment,
    },
  };
};

export const analyzeTuberculosisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;

  // Combine all TB symptom IDs
  const activeSymptomIds = INFECTIOUS_CONDITIONS.TUBERCULOSIS_ACTIVE.symptomIds;
  const inactiveSymptomIds = INFECTIOUS_CONDITIONS.TUBERCULOSIS_INACTIVE.symptomIds;
  const miliarySymptomIds = INFECTIOUS_CONDITIONS.TUBERCULOSIS_MILIARY.symptomIds;
  const allTBSymptomIds = [...new Set([...activeSymptomIds, ...inactiveSymptomIds, ...miliarySymptomIds])];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && allTBSymptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Tuberculosis',
      diagnosticCode: '6730/6731/6311',
      cfrReference: '38 CFR 4.97/4.88b',
      message: 'No tuberculosis symptoms logged in evaluation period',
      criteria: TUBERCULOSIS_ACTIVE_CRITERIA,
    };
  }

  // Categorize logs by TB type
  const activeTBLogs = relevantLogs.filter(log => activeSymptomIds.includes(log.symptomId));
  const inactiveTBLogs = relevantLogs.filter(log => inactiveSymptomIds.includes(log.symptomId));
  const miliaryTBLogs = relevantLogs.filter(log => miliarySymptomIds.includes(log.symptomId));

  // Check for active disease indicators
  const activeConfirmed = relevantLogs.some(log => log.symptomId === 'tb-active-confirmed');
  const culturePositive = relevantLogs.some(log => log.symptomId === 'tb-culture-positive');
  const smearPositive = relevantLogs.some(log => log.symptomId === 'tb-smear-positive');
  const onActiveTreatment = relevantLogs.some(log => log.symptomId === 'tb-treatment-active');
  const miliaryConfirmed = relevantLogs.some(log => log.symptomId === 'tb-miliary-confirmed');
  const disseminated = relevantLogs.some(log => log.symptomId === 'tb-disseminated');

  // Check for inactive status
  const inactiveConfirmed = relevantLogs.some(log => log.symptomId === 'tb-inactive-confirmed');
  const treatmentCompleted = relevantLogs.some(log => log.symptomId === 'tb-treatment-completed');
  const cultureNegative = relevantLogs.some(log => log.symptomId === 'tb-culture-negative');

  // Constitutional symptoms
  const feverLogs = relevantLogs.filter(log => log.symptomId === 'tb-fever');
  const nightSweatsLogs = relevantLogs.filter(log => log.symptomId === 'tb-night-sweats');
  const weightLossLogs = relevantLogs.filter(log => log.symptomId === 'tb-weight-loss');
  const fatigueLogs = relevantLogs.filter(log => ['tb-fatigue', 'tb-weakness'].includes(log.symptomId));

  // Respiratory symptoms
  const coughLogs = relevantLogs.filter(log => ['tb-cough-productive', 'tb-cough-blood', 'tb-hemoptysis'].includes(log.symptomId));
  const hemoptysisLogs = relevantLogs.filter(log => ['tb-cough-blood', 'tb-hemoptysis'].includes(log.symptomId));

  // Severe indicators
  const cavityLogs = relevantLogs.filter(log => log.symptomId === 'tb-cavity-formation');
  const hospitalizationLogs = relevantLogs.filter(log => log.symptomId === 'tb-hospitalization');
  const drugResistantLogs = relevantLogs.filter(log => ['tb-drug-resistant', 'tb-mdr', 'tb-xdr'].includes(log.symptomId));

  // Residual symptoms
  const residualLogs = relevantLogs.filter(log =>
      ['tb-residual-scarring', 'tb-residual-fibrosis', 'tb-residual-dyspnea',
        'tb-residual-cough', 'tb-residual-decreased-capacity', 'tb-pulmonary-function-reduced',
        'tb-emphysema', 'tb-bronchiectasis'].includes(log.symptomId)
  );
  const surgicalHistoryLogs = relevantLogs.filter(log =>
      ['tb-thoracoplasty-history', 'tb-lobectomy-history', 'tb-pneumonectomy-history'].includes(log.symptomId)
  );

  // Determine disease status and rating
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];
  let diagnosticCode = '6731'; // Default to inactive
  let criteria = TUBERCULOSIS_INACTIVE_CRITERIA;

  // Check for MILIARY TB (highest priority - most severe)
  if (miliaryConfirmed || disseminated || miliaryTBLogs.length >= 3) {
    supportedRating = 100;
    diagnosticCode = '6311';
    criteria = TUBERCULOSIS_MILIARY_CRITERIA;
    rationale.push('Miliary (disseminated) tuberculosis documented');
    if (miliaryConfirmed) rationale.push('Miliary TB diagnosis confirmed');
    if (disseminated) rationale.push('Disseminated disease documented');

    // Check for organ involvement
    const organInvolvement = [];
    if (relevantLogs.some(log => log.symptomId === 'tb-meningitis')) organInvolvement.push('CNS/meningitis');
    if (relevantLogs.some(log => log.symptomId === 'tb-bone-joint')) organInvolvement.push('bone/joint');
    if (relevantLogs.some(log => log.symptomId === 'tb-kidney')) organInvolvement.push('kidney');
    if (relevantLogs.some(log => log.symptomId === 'tb-lymph-nodes')) organInvolvement.push('lymph nodes');
    if (relevantLogs.some(log => log.symptomId === 'tb-eye-involvement')) organInvolvement.push('eyes');

    if (organInvolvement.length > 0) {
      rationale.push(`Organ involvement: ${organInvolvement.join(', ')}`);
    }
    rationale.push('Miliary TB rated 100% while active');
  }
  // Check for ACTIVE PULMONARY TB
  else if (activeConfirmed || culturePositive || smearPositive || (onActiveTreatment && !inactiveConfirmed)) {
    supportedRating = 100;
    diagnosticCode = '6730';
    criteria = TUBERCULOSIS_ACTIVE_CRITERIA;
    rationale.push('Active pulmonary tuberculosis documented');

    if (culturePositive) rationale.push('Culture-positive TB confirmed');
    if (smearPositive) rationale.push('AFB smear positive');
    if (onActiveTreatment) rationale.push('On active anti-TB treatment');
    if (cavityLogs.length > 0) rationale.push('Cavitary disease documented - indicates advanced TB');
    if (drugResistantLogs.length > 0) rationale.push('Drug-resistant TB documented - requires extended treatment');
    if (hospitalizationLogs.length > 0) rationale.push(`${hospitalizationLogs.length} hospitalization(s) for TB`);

    rationale.push('Active pulmonary TB rated 100% while active');
  }
  // INACTIVE TB - rate based on residuals
  else if (inactiveConfirmed || treatmentCompleted || cultureNegative || residualLogs.length > 0) {
    diagnosticCode = '6731';
    criteria = TUBERCULOSIS_INACTIVE_CRITERIA;

    if (inactiveConfirmed) rationale.push('TB declared inactive');
    if (treatmentCompleted) rationale.push('TB treatment completed');
    if (cultureNegative) rationale.push('Sputum cultures negative');

    // Rate based on residuals - need PFT data
    if (residualLogs.length > 0) {
      rationale.push(`Residual symptoms documented: ${residualLogs.length} entries`);

      const hasScarring = residualLogs.some(log => log.symptomId === 'tb-residual-scarring');
      const hasFibrosis = residualLogs.some(log => log.symptomId === 'tb-residual-fibrosis');
      const hasDyspnea = residualLogs.some(log => log.symptomId === 'tb-residual-dyspnea');
      const hasReducedPFT = residualLogs.some(log => log.symptomId === 'tb-pulmonary-function-reduced');
      const hasEmphysema = residualLogs.some(log => log.symptomId === 'tb-emphysema');
      const hasBronchiectasis = residualLogs.some(log => log.symptomId === 'tb-bronchiectasis');

      if (hasScarring) rationale.push('Pulmonary scarring documented');
      if (hasFibrosis) rationale.push('Pulmonary fibrosis documented');
      if (hasEmphysema) rationale.push('Post-TB emphysema documented');
      if (hasBronchiectasis) rationale.push('Post-TB bronchiectasis documented');

      // Estimate rating based on symptom severity (actual rating requires PFTs)
      if (hasEmphysema || hasBronchiectasis || (hasFibrosis && hasDyspnea)) {
        supportedRating = 30; // Moderate residuals - needs PFT confirmation
        rationale.push('Moderate residuals suggest 30%+ rating - PFTs required for exact rating');
      } else if (hasScarring || hasDyspnea || hasReducedPFT) {
        supportedRating = 10; // Mild residuals - needs PFT confirmation
        rationale.push('Residual changes documented - PFTs required for exact rating');
      } else {
        supportedRating = 0;
        rationale.push('Minimal residuals documented');
      }
    }

    if (surgicalHistoryLogs.length > 0) {
      rationale.push('Surgical history for TB - may warrant separate rating (DC 5297 for rib removal)');
    }

    evidenceGaps.push('Pulmonary function tests (PFTs) required to determine exact residual rating');
    evidenceGaps.push('Document FEV-1, FVC, FEV-1/FVC ratio, and DLCO');
  }
  // Some TB symptoms but status unclear
  else {
    supportedRating = 0;
    rationale.push('TB-related symptoms logged but disease status unclear');
    evidenceGaps.push('Document whether TB is active or inactive');
    evidenceGaps.push('If active: obtain culture or smear results');
    evidenceGaps.push('If inactive: document treatment completion and obtain PFTs');
  }

  // Add common documentation gaps
  if (coughLogs.length > 0 || fatigueLogs.length > 0) {
    if (feverLogs.length === 0 && nightSweatsLogs.length === 0) {
      evidenceGaps.push('Document constitutional symptoms (fever, night sweats) if present');
    }
  }

  if (diagnosticCode === '6731' && residualLogs.length === 0) {
    evidenceGaps.push('Document any residual symptoms (dyspnea, cough, decreased capacity)');
  }

  // Calculate metrics
  const avgSeverity = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / relevantLogs.length
      : 0;

  return {
    hasData: true,
    condition: diagnosticCode === '6311' ? 'Tuberculosis, Miliary' :
        diagnosticCode === '6730' ? 'Tuberculosis, Pulmonary, Active' :
            'Tuberculosis, Pulmonary, Inactive',
    diagnosticCode,
    cfrReference: diagnosticCode === '6311' ? '38 CFR 4.88b' : '38 CFR 4.97',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      activeTBLogs: activeTBLogs.length,
      inactiveTBLogs: inactiveTBLogs.length,
      miliaryTBLogs: miliaryTBLogs.length,
      constitutionalSymptoms: feverLogs.length + nightSweatsLogs.length + weightLossLogs.length,
      respiratorySymptoms: coughLogs.length,
      hemoptysisLogs: hemoptysisLogs.length,
      residualLogs: residualLogs.length,
      hospitalizations: hospitalizationLogs.length,
      hasCavitaryDisease: cavityLogs.length > 0,
      hasDrugResistance: drugResistantLogs.length > 0,
    },
    criteria,
    diseaseStatus: diagnosticCode === '6730' ? 'active' :
        diagnosticCode === '6311' ? 'miliary-active' : 'inactive',
  };
};

export const analyzeActiveTuberculosisLogs = (logs, _options = {}) => {
  const symptomIds = [
    'cough', 'hemoptysis', 'night-sweats', 'fever', 'weight-loss',
    'fatigue', 'chest-pain', 'shortness-of-breath'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('tuberculosis') ||
        log.notes?.toLowerCase().includes('tb ') ||
        log.notes?.toLowerCase().includes('mycobacterium');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Tuberculosis, Active',
      diagnosticCode: '6730',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for active disease indicators
  const isActive = validLogs.some(log =>
      log.notes?.toLowerCase().includes('active') ||
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('medication') ||
      log.notes?.toLowerCase().includes('isoniazid') ||
      log.notes?.toLowerCase().includes('rifampin')
  );

  const advancedLesions = validLogs.some(log =>
      log.notes?.toLowerCase().includes('advanced') ||
      log.notes?.toLowerCase().includes('cavitary') ||
      log.notes?.toLowerCase().includes('extensive')
  );

  const miliary = validLogs.some(log =>
      log.notes?.toLowerCase().includes('miliary') ||
      log.notes?.toLowerCase().includes('disseminated')
  );

  let supportedRating = 0;
  let rationale = '';

  if (isActive) {
    supportedRating = 100;
    rationale = 'Active pulmonary tuberculosis is rated 100% during active disease.';
    if (advancedLesions) {
      rationale += ' Advanced lesions documented.';
    }
    if (miliary) {
      rationale += ' Miliary/disseminated TB documented - see DC 6724.';
    }
  } else {
    supportedRating = 0;
    rationale = 'No evidence of active TB. Rate residuals under appropriate DC after treatment.';
  }

  return {
    condition: 'Tuberculosis, Active',
    diagnosticCode: '6730',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: TUBERCULOSIS_ACTIVE_CRITERIA,
    recommendations: [
      'Document all TB treatment medications',
      'Keep sputum culture results',
      'Get chest X-rays showing disease progression/resolution',
      'Note any extrapulmonary involvement',
      'After treatment, document any residual lung impairment',
    ],
    note: 'Active TB is rated 100%. After becoming inactive, rate residuals (usually under respiratory codes).',
  };
};

export const analyzeInactiveTuberculosisLogs = (logs, _options = {}) => {
  const symptomIds = [
    'cough', 'shortness-of-breath', 'fatigue', 'chest-pain',
    'reduced-lung-function', 'scarring'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('tuberculosis') ||
        log.notes?.toLowerCase().includes('tb ') ||
        log.notes?.toLowerCase().includes('inactive') ||
        log.notes?.toLowerCase().includes('residual');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Tuberculosis, Inactive',
      diagnosticCode: '6731',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check time since active disease
  const recentlyInactive = validLogs.some(log =>
      log.notes?.toLowerCase().includes('recently inactive') ||
      log.notes?.toLowerCase().includes('just completed treatment')
  );

  const hasResiduals = validLogs.some(log =>
      log.notes?.toLowerCase().includes('residual') ||
      log.notes?.toLowerCase().includes('scarring') ||
      log.notes?.toLowerCase().includes('fibrosis') ||
      log.notes?.toLowerCase().includes('reduced lung')
  );

  const advancedLesions = validLogs.some(log =>
      log.notes?.toLowerCase().includes('advanced') ||
      log.notes?.toLowerCase().includes('far advanced') ||
      log.notes?.toLowerCase().includes('extensive')
  );

  const moderatelyAdvanced = validLogs.some(log =>
      log.notes?.toLowerCase().includes('moderately advanced')
  );

  let supportedRating = 0;
  let rationale = '';

  // Inactive TB has graduated ratings based on lesion advancement and time
  if (advancedLesions) {
    supportedRating = 100;
    rationale = 'Far advanced lesions - 100% for 2 years after date of inactivity, then evaluate residuals.';
  } else if (moderatelyAdvanced) {
    supportedRating = 50;
    rationale = 'Moderately advanced lesions - 50% for 4 years after inactivity, then evaluate residuals.';
  } else if (recentlyInactive) {
    supportedRating = 30;
    rationale = 'Recently inactive minimal TB - 30% for 2 years, then evaluate residuals.';
  } else if (hasResiduals) {
    supportedRating = 0;
    rationale = 'Inactive TB with residuals - rate residuals under appropriate respiratory DC (6600, 6604, etc.).';
  } else {
    supportedRating = 0;
    rationale = 'Inactive TB without significant residuals documented.';
  }

  return {
    condition: 'Tuberculosis, Inactive',
    diagnosticCode: '6731',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: TUBERCULOSIS_INACTIVE_CRITERIA,
    recommendations: [
      'Document date TB became inactive',
      'Get PFTs to evaluate residual lung impairment',
      'Keep chest X-rays showing lesion status',
      'Document any ongoing symptoms',
      'After graduated rating period, get C&P exam for residuals',
    ],
    note: 'Inactive TB has time-limited ratings. After the specified period, rate any residual impairment.',
  };
};

export const analyzeSyphilisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for base syphilis symptoms
  const syphilisLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && (
        symptomId.includes('syphilis-positive') ||
        symptomId.includes('syphilis-treated') ||
        symptomId.includes('syphilis-active') ||
        symptomId === 'syphilis'
    );
  });

  if (syphilisLogs.length === 0) {
    return {
      condition: 'Syphilis',
      diagnosticCode: '6310',
      hasData: false,
      message: 'No syphilis status logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document syphilis diagnosis with positive serology (RPR, VDRL, or treponemal test)',
        'Record treatment history (antibiotic therapy)',
        'Note any neurological symptoms (headaches, vision changes, gait problems)',
        'Note any cardiac symptoms (chest pain, shortness of breath)',
        'Track cognitive changes if present',
        'Get evaluated for complications affecting nervous system, heart, eyes, or ears',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];

  // Count status types
  const positiveTests = syphilisLogs.filter(s => getLogSymptomId(s)?.includes('positive')).length;
  const treated = syphilisLogs.filter(s => getLogSymptomId(s)?.includes('treated')).length;
  const active = syphilisLogs.filter(s => getLogSymptomId(s)?.includes('active')).length;

  evidence.push(`${syphilisLogs.length} syphilis-related entries logged`);
  if (positiveTests > 0) evidence.push('Positive syphilis serology documented');
  if (treated > 0) evidence.push('Treatment completion documented');
  if (active > 0) evidence.push('Active infection documented');

  // Base syphilis is always 0% - rated by complications
  const supportedRating = 0;
  ratingRationale.push('DC 6310: Syphilis itself is rated at 0%');
  ratingRationale.push('Compensation is based on complications affecting specific body systems');
  ratingRationale.push('Rate complications under appropriate diagnostic codes:');
  ratingRationale.push('• DC 7004 - Syphilitic Heart Disease');
  ratingRationale.push('• DC 8013 - Cerebrospinal Syphilis');
  ratingRationale.push('• DC 8014 - Meningovascular Syphilis');
  ratingRationale.push('• DC 8015 - Tabes Dorsalis');
  ratingRationale.push('• DC 9301 - Syphilitic Dementia');

  // Gaps - focus on identifying complications
  gaps.push('Get neurology evaluation if ANY neurological symptoms present');
  gaps.push('Get cardiology evaluation if ANY cardiac symptoms present');
  gaps.push('Request CSF analysis if neurosyphilis suspected');
  gaps.push('Document all residual symptoms for appropriate complication ratings');
  gaps.push('Even at 0%, service connection is important for future complications');

  return {
    condition: 'Syphilis',
    diagnosticCode: '6310',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: syphilisLogs.length,
      evaluationPeriod: evaluationPeriodDays,
      positiveTests,
      treated,
      active,
    },
    note: 'Syphilis is rated at 0% when inactive. Seek separate ratings for complications under DC 7004, 8013, 8014, 8015, or 9301.',
  };
};

export const analyzeCerebrospinalSyphilisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for cerebrospinal/neurosyphilis symptoms
  const csSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && (
        symptomId.includes('neurosyphilis') ||
        symptomId.includes('cerebrospinal-syphilis') ||
        (symptomId.includes('syphilis') && (
            symptomId.includes('headache') ||
            symptomId.includes('seizure') ||
            symptomId.includes('vision') ||
            symptomId.includes('paralysis') ||
            symptomId.includes('fatigue')
        ))
    );
  });

  if (csSymptoms.length === 0) {
    return {
      condition: 'Cerebrospinal Syphilis',
      diagnosticCode: '8013',
      hasData: false,
      message: 'No cerebrospinal syphilis symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document neurological symptoms: headaches, seizures, vision changes',
        'Note any paralysis or weakness',
        'Track cognitive symptoms if present',
        'Get lumbar puncture (CSF analysis) to confirm CNS involvement',
        'Obtain neurology evaluation',
        'Document impact on daily activities',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 10; // Minimum rating with ascertainable residuals
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    headaches: csSymptoms.filter(s => getLogSymptomId(s)?.includes('headache')).length,
    seizures: csSymptoms.filter(s => getLogSymptomId(s)?.includes('seizure')).length,
    visionChanges: csSymptoms.filter(s => getLogSymptomId(s)?.includes('vision')).length,
    paralysis: csSymptoms.filter(s => getLogSymptomId(s)?.includes('paralysis')).length,
    fatigue: csSymptoms.filter(s => getLogSymptomId(s)?.includes('fatigue')).length,
  };

  // Check severity from log data
  let severeSeizures = false;
  let severeParalysis = false;
  let severeVision = false;

  csSymptoms.forEach(log => {
    const severity = log.severity || log.functionalImpact;
    const symptomId = getLogSymptomId(log);

    if (symptomId?.includes('seizure') && severity >= 4) severeSeizures = true;
    if (symptomId?.includes('paralysis') && severity >= 3) severeParalysis = true;
    if (symptomId?.includes('vision') && severity >= 3) severeVision = true;
  });

  evidence.push(`${csSymptoms.length} cerebrospinal syphilis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination based on neurological severity
  if (severeSeizures || severeParalysis || severeVision ||
      (symptomCounts.seizures >= 10 && symptomCounts.paralysis > 0)) {
    supportedRating = 100;
    ratingRationale.push('Severe neurological impairment documented');
    if (severeSeizures) ratingRationale.push('Severe/uncontrolled seizures');
    if (severeParalysis) ratingRationale.push('Significant paralysis documented');
    if (severeVision) ratingRationale.push('Severe visual impairment');
  } else if (symptomCounts.seizures >= 5 ||
      (symptomCounts.paralysis >= 3 && symptomCounts.visionChanges >= 3)) {
    supportedRating = 60;
    ratingRationale.push('Moderately severe neurological symptoms');
    ratingRationale.push('Frequent seizures or significant deficits documented');
  } else if (symptomCounts.headaches >= 5 || symptomCounts.seizures >= 2 ||
      symptomCounts.paralysis >= 1 || symptomCounts.visionChanges >= 2) {
    supportedRating = 30;
    ratingRationale.push('Moderate neurological symptoms');
    ratingRationale.push('Regular symptoms affecting daily functioning');
  } else {
    supportedRating = 10;
    ratingRationale.push('Minimum rating with ascertainable residuals');
    ratingRationale.push('Mild residual symptoms consistent with cerebrospinal syphilis');
  }

  // Evidence details
  if (symptomCounts.headaches > 0) evidence.push(`${symptomCounts.headaches} headache episodes`);
  if (symptomCounts.seizures > 0) evidence.push(`${symptomCounts.seizures} seizure episodes`);
  if (symptomCounts.visionChanges > 0) evidence.push(`${symptomCounts.visionChanges} vision change episodes`);
  if (symptomCounts.paralysis > 0) evidence.push(`${symptomCounts.paralysis} paralysis/weakness episodes`);

  // Gaps
  gaps.push('Obtain CSF analysis (lumbar puncture) confirming CNS infection');
  gaps.push('Get MRI/CT imaging of brain/spinal cord');
  gaps.push('Document all neurological deficits in detail');
  if (symptomCounts.seizures > 0) gaps.push('Maintain seizure diary with frequency and type');
  if (supportedRating >= 70) gaps.push('Consider evaluation for SMC if supervision required');

  return {
    condition: 'Cerebrospinal Syphilis',
    diagnosticCode: '8013',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: csSymptoms.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      severeSeizures,
      severeParalysis,
      severeVision,
    },
  };
};

export const analyzeMeningovascularSyphilisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for meningovascular symptoms (stroke-like, vascular)
  const mvSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && (
        symptomId.includes('meningovascular') ||
        symptomId.includes('neurosyphilis-stroke') ||
        (symptomId.includes('neurosyphilis') && (
            symptomId.includes('headache') ||
            symptomId.includes('seizure') ||
            symptomId.includes('paralysis')
        ))
    );
  });

  if (mvSymptoms.length === 0) {
    return {
      condition: 'Meningovascular Syphilis',
      diagnosticCode: '8014',
      hasData: false,
      message: 'No meningovascular syphilis symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document stroke-like episodes (TIA or stroke symptoms)',
        'Track headaches and neurological symptoms',
        'Note any paralysis or weakness',
        'Get brain MRI/CT showing vascular changes',
        'CSF analysis confirming neurosyphilis',
        'Neurology evaluation documenting deficits',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 10;
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    strokeEpisodes: mvSymptoms.filter(s => getLogSymptomId(s)?.includes('stroke')).length,
    headaches: mvSymptoms.filter(s => getLogSymptomId(s)?.includes('headache')).length,
    seizures: mvSymptoms.filter(s => getLogSymptomId(s)?.includes('seizure')).length,
    paralysis: mvSymptoms.filter(s => getLogSymptomId(s)?.includes('paralysis')).length,
  };

  // Check for severe strokes with permanent deficits
  let permanentDeficits = false;
  let recurrentStrokes = symptomCounts.strokeEpisodes >= 2;

  mvSymptoms.forEach(log => {
    const severity = log.severity || log.functionalImpact;
    const symptomId = getLogSymptomId(log);

    if (symptomId?.includes('stroke') && severity >= 3) permanentDeficits = true;
  });

  evidence.push(`${mvSymptoms.length} meningovascular syphilis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination
  if (permanentDeficits && symptomCounts.paralysis > 0) {
    supportedRating = 100;
    ratingRationale.push('Severe stroke with permanent neurological deficits');
    ratingRationale.push('Significant paralysis or cognitive impairment documented');
  } else if (recurrentStrokes || (symptomCounts.strokeEpisodes > 0 && symptomCounts.paralysis > 0)) {
    supportedRating = 60;
    ratingRationale.push('Recurrent stroke-like episodes documented');
    ratingRationale.push('Significant neurological deficits present');
  } else if (symptomCounts.strokeEpisodes > 0 || symptomCounts.headaches >= 5) {
    supportedRating = 30;
    ratingRationale.push('Moderate symptoms documented');
    ratingRationale.push('History of vascular events or frequent symptoms');
  } else {
    supportedRating = 10;
    ratingRationale.push('Minimum rating with ascertainable residuals');
  }

  // Evidence details
  if (symptomCounts.strokeEpisodes > 0) evidence.push(`${symptomCounts.strokeEpisodes} stroke-like episodes`);
  if (symptomCounts.headaches > 0) evidence.push(`${symptomCounts.headaches} headache episodes`);
  if (symptomCounts.paralysis > 0) evidence.push(`${symptomCounts.paralysis} paralysis/weakness episodes`);

  // Gaps
  gaps.push('Brain MRI/CT showing vascular changes or stroke');
  gaps.push('CSF analysis confirming neurosyphilis');
  gaps.push('Neurology evaluation documenting all deficits');
  gaps.push('Document any permanent deficits from stroke events');
  if (supportedRating >= 70) gaps.push('Consider evaluation for SMC');

  return {
    condition: 'Meningovascular Syphilis',
    diagnosticCode: '8014',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: mvSymptoms.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      permanentDeficits,
      recurrentStrokes,
    },
  };
};

export const analyzeTabesDorsalisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for tabes dorsalis symptoms
  const tabesSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomId.includes('tabes');
  });

  if (tabesSymptoms.length === 0) {
    return {
      condition: 'Tabes Dorsalis',
      diagnosticCode: '8015',
      hasData: false,
      message: 'No tabes dorsalis symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document "lightning pains" (brief, severe, stabbing pains) - KEY VA TERM',
        'Track gait disturbance/ataxia severity',
        'Note Romberg sign if positive (unsteady with eyes closed)',
        'Document loss of position sense (proprioception)',
        'Record any bladder or bowel dysfunction',
        'Note Charcot joints if present (joint destruction)',
        'Get neurology evaluation documenting characteristic findings',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 30; // Minimum rating for tabes dorsalis
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    lightningPains: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('lightning')).length,
    ataxia: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('ataxia')).length,
    romberg: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('romberg')).length,
    positionSenseLoss: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('position-sense')).length,
    absentReflexes: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('absent-reflex')).length,
    charcotJoint: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('charcot')).length,
    argyllRobertson: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('argyll')).length,
    bladderDysfunction: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('bladder')).length,
    bowelDysfunction: tabesSymptoms.filter(s => getLogSymptomId(s)?.includes('bowel')).length,
  };

  // Check for severe symptoms
  let requiresAssistance = false;
  let severePain = false;
  let completeSensoryLoss = false;
  let severeBladderBowel = false;

  tabesSymptoms.forEach(log => {
    const severity = log.severity || log.functionalImpact;
    const symptomId = getLogSymptomId(log);

    if (symptomId?.includes('ataxia') && severity >= 4) requiresAssistance = true;
    if (symptomId?.includes('lightning') && severity >= 4) severePain = true;
    if (symptomId?.includes('position-sense') && severity >= 3) completeSensoryLoss = true;
    if ((symptomId?.includes('bladder') || symptomId?.includes('bowel')) && severity >= 3) severeBladderBowel = true;
  });

  evidence.push(`${tabesSymptoms.length} tabes dorsalis symptoms logged over ${evaluationPeriodDays} days`);

  // Rating determination - Note: Minimum is 30% for tabes dorsalis
  if (requiresAssistance || (severePain && severeBladderBowel) ||
      (completeSensoryLoss && symptomCounts.charcotJoint > 0)) {
    supportedRating = 100;
    ratingRationale.push('Severe impairment documented');
    if (requiresAssistance) ratingRationale.push('Cannot walk without assistance');
    if (severePain) ratingRationale.push('Severe lightning pains requiring constant medication');
    if (completeSensoryLoss) ratingRationale.push('Complete sensory loss in lower extremities');
    if (severeBladderBowel) ratingRationale.push('Severe bladder/bowel dysfunction');
    if (symptomCounts.charcotJoint > 0) ratingRationale.push('Charcot joint (neuropathic arthropathy) documented');
  } else if ((symptomCounts.lightningPains >= 5 && symptomCounts.ataxia >= 3) ||
      (symptomCounts.bladderDysfunction > 0 && symptomCounts.ataxia > 0) ||
      symptomCounts.charcotJoint > 0) {
    supportedRating = 60;
    ratingRationale.push('Moderately severe symptoms documented');
    ratingRationale.push('Significant gait disturbance and/or frequent severe pain');
    if (symptomCounts.bladderDysfunction > 0) ratingRationale.push('Bladder dysfunction present');
  } else {
    supportedRating = 30;
    ratingRationale.push('Minimum rating (30%) for tabes dorsalis with ascertainable residuals');
    ratingRationale.push('Documented symptoms consistent with tabes dorsalis');
  }

  // Evidence details
  if (symptomCounts.lightningPains > 0) evidence.push(`${symptomCounts.lightningPains} lightning pain episodes (KEY finding)`);
  if (symptomCounts.ataxia > 0) evidence.push(`${symptomCounts.ataxia} ataxia/gait disturbance entries`);
  if (symptomCounts.romberg > 0) evidence.push('Positive Romberg sign documented');
  if (symptomCounts.positionSenseLoss > 0) evidence.push('Loss of position sense documented');
  if (symptomCounts.charcotJoint > 0) evidence.push('Charcot joint documented');
  if (symptomCounts.bladderDysfunction > 0) evidence.push(`${symptomCounts.bladderDysfunction} bladder dysfunction entries`);

  // Gaps
  gaps.push('Use term "lightning pains" in documentation - recognized VA terminology');
  gaps.push('Get formal gait analysis documenting ataxia severity');
  gaps.push('Neurology evaluation with sensory examination');
  if (symptomCounts.bladderDysfunction > 0 || symptomCounts.bowelDysfunction > 0) {
    gaps.push('Urology evaluation for bladder dysfunction');
    gaps.push('Consider separate rating under DC 7542 (neurogenic bladder) if applicable');
  }
  if (supportedRating >= 60) gaps.push('Document assistive device requirements (cane, walker)');
  if (supportedRating >= 100) gaps.push('Consider Aid & Attendance (SMC-L) evaluation');

  return {
    condition: 'Tabes Dorsalis',
    diagnosticCode: '8015',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: tabesSymptoms.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      requiresAssistance,
      severePain,
      completeSensoryLoss,
      severeBladderBowel,
    },
    note: 'Tabes dorsalis has a MINIMUM rating of 30% when ascertainable residuals are present.',
  };
};

export const analyzeSyphiliticDementiaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for syphilitic dementia symptoms
  const dementiaSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && (
        symptomId.includes('syphilis-memory') ||
        symptomId.includes('syphilis-cognitive') ||
        symptomId.includes('syphilis-personality') ||
        symptomId.includes('syphilis-confusion') ||
        symptomId.includes('syphilis-psychotic') ||
        symptomId.includes('syphilis-judgment') ||
        symptomId.includes('syphilitic-dementia')
    );
  });

  if (dementiaSymptoms.length === 0) {
    return {
      condition: 'Dementia due to CNS Syphilis',
      diagnosticCode: '9301',
      hasData: false,
      message: 'No syphilitic dementia symptoms logged',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'Document memory problems with specific examples',
        'Track confusion and disorientation episodes',
        'Note personality or behavioral changes',
        'Record impact on daily activities and independence',
        'Get neuropsychological testing for objective cognitive measures',
        'CSF analysis confirming neurosyphilis if not already done',
      ],
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 10;
  const ratingRationale = [];

  // Count symptom types
  const symptomCounts = {
    memoryLoss: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('memory')).length,
    cognitivDecline: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('cognitive')).length,
    personalityChange: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('personality')).length,
    confusion: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('confusion')).length,
    psychotic: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('psychotic')).length,
    judgmentImpaired: dementiaSymptoms.filter(s => getLogSymptomId(s)?.includes('judgment')).length,
  };

  // Check for severe indicators
  let cannotRecognizeFamily = false;
  let cannotCareForSelf = false;
  let persistentPsychosis = false;

  dementiaSymptoms.forEach(log => {
    const severity = log.severity || log.functionalImpact;
    const symptomId = getLogSymptomId(log);

    if (symptomId?.includes('memory') && severity >= 4) cannotRecognizeFamily = true;
    if (symptomId?.includes('cognitive') && severity >= 4) cannotCareForSelf = true;
    if (symptomId?.includes('psychotic') && severity >= 3) persistentPsychosis = true;
  });

  evidence.push(`${dementiaSymptoms.length} syphilitic dementia symptoms logged over ${evaluationPeriodDays} days`);

  // Calculate severity indicators
  const severeIndicators = symptomCounts.psychotic + (cannotRecognizeFamily ? 2 : 0) + (cannotCareForSelf ? 2 : 0);
  const moderateIndicators = symptomCounts.confusion + symptomCounts.judgmentImpaired + symptomCounts.personalityChange;
  const mildIndicators = symptomCounts.memoryLoss + symptomCounts.cognitivDecline;

  // Rating based on General Rating Formula for Mental Disorders
  if (cannotCareForSelf || cannotRecognizeFamily || (persistentPsychosis && severeIndicators >= 3)) {
    supportedRating = 100;
    ratingRationale.push('Total occupational and social impairment');
    if (cannotCareForSelf) ratingRationale.push('Unable to perform activities of daily living');
    if (cannotRecognizeFamily) ratingRationale.push('Memory loss for names of close relatives');
    if (persistentPsychosis) ratingRationale.push('Persistent delusions or hallucinations');
    gaps.push('Apply for Aid & Attendance (SMC-L) - NO 100% requirement needed');
  } else if (severeIndicators > 0 || (moderateIndicators >= 3 && symptomCounts.confusion > 0)) {
    supportedRating = 70;
    ratingRationale.push('Deficiencies in most areas');
    ratingRationale.push('Spatial disorientation or neglect of personal hygiene likely');
    ratingRationale.push('Inability to establish and maintain effective relationships');
  } else if (moderateIndicators >= 2 || (mildIndicators >= 3 && moderateIndicators >= 1)) {
    supportedRating = 50;
    ratingRationale.push('Reduced reliability and productivity');
    ratingRationale.push('Difficulty understanding complex commands');
    ratingRationale.push('Impairment of short and long-term memory');
  } else if (mildIndicators >= 2 || moderateIndicators >= 1) {
    supportedRating = 30;
    ratingRationale.push('Occasional decrease in work efficiency');
    ratingRationale.push('Mild memory loss (forgetting names, directions)');
  } else {
    supportedRating = 10;
    ratingRationale.push('Mild or transient symptoms');
    ratingRationale.push('Symptoms controlled by continuous medication');
  }

  // Evidence details
  if (symptomCounts.memoryLoss > 0) evidence.push(`${symptomCounts.memoryLoss} memory loss episodes`);
  if (symptomCounts.confusion > 0) evidence.push(`${symptomCounts.confusion} confusion/disorientation episodes`);
  if (symptomCounts.personalityChange > 0) evidence.push(`${symptomCounts.personalityChange} personality change entries`);
  if (symptomCounts.psychotic > 0) evidence.push(`${symptomCounts.psychotic} psychotic symptom episodes`);

  // Gaps
  gaps.push('Neuropsychological testing for objective cognitive assessment');
  gaps.push('Buddy statements from family documenting changes noticed');
  gaps.push('Document impact on ability to work');
  gaps.push('Track ability to handle finances, medications, daily tasks');
  if (supportedRating >= 70) {
    gaps.push('Document caregiver requirements');
    gaps.push('Consider SMC-L (Aid & Attendance) - NEEDS-BASED, no % requirement');
  }

  return {
    condition: 'Dementia due to CNS Syphilis',
    diagnosticCode: '9301',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: dementiaSymptoms.length,
      evaluationPeriod: evaluationPeriodDays,
      symptomCounts,
      cannotRecognizeFamily,
      cannotCareForSelf,
      persistentPsychosis,
    },
  };
};