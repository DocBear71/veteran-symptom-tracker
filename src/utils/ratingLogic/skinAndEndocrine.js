/* eslint-disable no-unused-vars */

// ============================================
// SKIN & ENDOCRINE RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: Diabetes Mellitus, Thyroid conditions,
// Parathyroid conditions, Adrenal conditions
// (Addison's, Cushing's, Hyperaldosteronism),
// Diabetes Insipidus, Scars, Psoriasis, Eczema,
// Acne/Chloracne, Alopecia Areata, Hyperhidrosis,
// General Skin Formula, Discoid/Systemic Lupus,
// Bullous Disorders, Cutaneous Vasculitis,
// Dermatophytosis, Skin Infections, Chronic Urticaria,
// and Nutritional Deficiency conditions.
//
// Based on 38 CFR Part 4, §§ 4.116, 4.119
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

import {
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
// SKIN & ENDOCRINE CONDITIONS (for CONDITIONS object)
// ============================================
export const SKIN_ENDOCRINE_CONDITIONS = {
  DIABETES: {
    id: 'diabetes',
    name: 'Diabetes Mellitus',
    diagnosticCode: '7913',
    cfrReference: '38 CFR 4.119',
    symptomIds: [
      'dm-hypoglycemia-episode', 'dm-hyperglycemia-episode', 'dm-ketoacidosis',
      'dm-insulin-reaction', 'dm-hospitalization', 'dm-er-visit', 'dm-doctor-visit',
      'dm-activity-regulation', 'dm-diet-restricted', 'dm-insulin-daily',
      'dm-insulin-multiple', 'dm-oral-medication', 'dm-weight-loss-progressive',
      'dm-strength-loss', 'dm-fatigue', 'dm-blurred-vision', 'dm-slow-healing',
      'dm-frequent-urination', 'dm-excessive-thirst', 'dm-numbness-tingling',
      // Legacy IDs for backward compatibility
      'fatigue', 'dizziness', 'weakness', 'frequent-urination', 'excessive-thirst',
    ],
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
  HYPOTHYROIDISM: {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    diagnosticCode: '7903',
    cfrReference: '38 CFR 4.119',
    symptomIds: [ 'hypo-fatigue', 'hypo-cold-intolerance', 'hypo-weight-gain', 'hypo-depression', 'hypo-muscle-weakness', 'hypo-constipation', 'hypo-dry-skin',
    ],
  },
  HYPERTHYROIDISM: {
    id: 'hyperthyroidism',
    name: 'Hyperthyroidism/Graves\' Disease',
    diagnosticCode: '7900',
    cfrReference: '38 CFR 4.119',
    symptomIds: [
      'hyper-weight-loss', 'hyper-rapid-heartbeat', 'hyper-tremor', 'hyper-heat-intolerance',
      'hyper-sweating', 'hyper-anxiety', 'hyper-irritability', 'hyper-fatigue', 'hyper-muscle-weakness',
      'hyper-sleep-difficulty', 'hyper-appetite-increase', 'hyper-bowel-changes',
      'graves-eye-bulging', 'graves-eye-irritation', 'graves-double-vision', 'graves-eye-pain', 'graves-light-sensitivity'
    ],
  },
  THYROIDITIS: {
    id: 'thyroiditis',
    name: 'Thyroiditis',
    diagnosticCode: '7906',
    cfrReference: '38 CFR 4.119',
    symptomIds: [
      'thyroiditis-neck-pain', 'thyroiditis-swelling', 'thyroiditis-difficulty-swallowing',
      'thyroiditis-hyper-phase', 'thyroiditis-hypo-phase', 'thyroiditis-fatigue'
    ],
  },
  HYPERPARATHYROIDISM: {
    id: 'hyperparathyroidism',
    name: 'Hyperparathyroidism',
    diagnosticCode: '7904',
    cfrReference: '38 CFR 4.119',
    symptomIds: [
      'hpth-fatigue', 'hpth-bone-pain', 'hpth-kidney-stones', 'hpth-abdominal-pain',
      'hpth-nausea', 'hpth-constipation', 'hpth-confusion', 'hpth-depression',
      'hpth-muscle-weakness', 'hpth-excessive-thirst', 'hpth-frequent-urination',
      'hpth-anorexia', 'hpth-fracture'
    ],
  },
  HYPOPARATHYROIDISM: {
    id: 'hypoparathyroidism',
    name: 'Hypoparathyroidism',
    diagnosticCode: '7905',
    cfrReference: '38 CFR 4.119',
    symptomIds: [
      'hopth-muscle-cramps', 'hopth-tingling', 'hopth-muscle-spasms', 'hopth-fatigue',
      'hopth-dry-skin', 'hopth-brittle-nails', 'hopth-hair-loss', 'hopth-seizures',
      'hopth-depression', 'hopth-anxiety', 'hopth-memory-problems', 'hopth-cataracts'
    ],
  },
  ADDISONS_DISEASE: {
    id: 'addisons-disease',
    name: "Addison's Disease",
    code: 'ADDISONS_DISEASE',
    diagnosticCode: '7911',
    cfrReference: '38 CFR 4.119',
    description: "Adrenocortical insufficiency characterized by inadequate production of cortisol and aldosterone",
    symptomIds: [
      'addisons-crisis', 'addisons-episode', 'addisons-fatigue', 'addisons-weight-loss',
      'addisons-hypotension', 'addisons-hyperpigmentation', 'addisons-salt-craving',
      'addisons-nausea', 'addisons-abdominal-pain', 'addisons-muscle-weakness',
      'addisons-muscle-pain', 'addisons-irritability', 'addisons-dizziness',
      'addisons-hypoglycemia', 'addisons-dehydration'
    ],
  },
  CUSHINGS_SYNDROME: {
    id: 'cushings-syndrome',
    name: "Cushing's Syndrome",
    code: 'CUSHINGS_SYNDROME',
    diagnosticCode: '7907',
    cfrReference: '38 CFR 4.119',
    description: "Condition caused by prolonged exposure to high cortisol levels",
    symptomIds: [
      'cushings-weight-gain', 'cushings-moon-face', 'cushings-buffalo-hump',
      'cushings-striae', 'cushings-thin-skin', 'cushings-bruising',
      'cushings-muscle-weakness', 'cushings-muscle-wasting', 'cushings-fatigue',
      'cushings-hypertension', 'cushings-glucose', 'cushings-osteoporosis',
      'cushings-mood', 'cushings-insomnia', 'cushings-infections',
      'cushings-acne', 'cushings-hirsutism', 'cushings-menstrual', 'cushings-erectile'
    ],
  },
  DIABETES_INSIPIDUS: {
    id: 'diabetes-insipidus',
    name: 'Diabetes Insipidus',
    code: 'DIABETES_INSIPIDUS',
    diagnosticCode: '7909',
    cfrReference: '38 CFR 4.119',
    description: "Condition characterized by excretion of large amounts of dilute urine due to inadequate ADH",
    symptomIds: [
      'di-polyuria', 'di-polydipsia', 'di-nocturia', 'di-dehydration',
      'di-fatigue', 'di-dizziness', 'di-headache', 'di-muscle-cramps',
      'di-constipation', 'di-weight-loss'
    ],
  },
  HYPERALDOSTERONISM: {
    id: 'hyperaldosteronism',
    name: 'Hyperaldosteronism',
    code: 'HYPERALDOSTERONISM',
    diagnosticCode: '7917',
    cfrReference: '38 CFR 4.119',
    description: "Excessive aldosterone production causing hypertension and hypokalemia",
    symptomIds: [
      'haldo-hypertension', 'haldo-muscle-weakness', 'haldo-muscle-cramps',
      'haldo-fatigue', 'haldo-headaches', 'haldo-polyuria', 'haldo-polydipsia',
      'haldo-numbness', 'haldo-palpitations', 'haldo-constipation', 'haldo-mood'
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
  ACNE: {
    id: 'acne',
    name: 'Acne',
    diagnosticCode: '7828',
    cfrReference: '38 CFR 4.118',
    description: 'Deep and superficial acne affecting face, neck, or body',
    symptomIds: [
      'acne-superficial-comedones', 'acne-superficial-papules', 'acne-superficial-pustules',
      'acne-deep-nodules', 'acne-deep-cysts', 'acne-face-neck-under40', 'acne-face-neck-40plus',
      'acne-body-other', 'acne-scarring', 'acne-disfigurement', 'acne-topical-treatment',
      'acne-oral-antibiotics', 'acne-isotretinoin', 'acne-hormonal-therapy', 'acne-flare-frequency'
    ],
  },
  CHLORACNE: {
    id: 'chloracne',
    name: 'Chloracne',
    diagnosticCode: '7829',
    cfrReference: '38 CFR 4.118',
    description: 'Acne-like skin condition caused by exposure to dioxin or Agent Orange',
    symptomIds: [
      'chloracne-comedones', 'chloracne-papules', 'chloracne-pustules',
      'chloracne-deep-nodules', 'chloracne-deep-cysts', 'chloracne-face-neck-under40',
      'chloracne-face-neck-40plus', 'chloracne-intertriginous', 'chloracne-body-other',
      'chloracne-scarring', 'chloracne-disfigurement', 'chloracne-agent-orange',
      'chloracne-dioxin-exposure', 'chloracne-onset-within-year'
    ],
  },
  ALOPECIA_AREATA: {
    id: 'alopecia-areata',
    name: 'Alopecia Areata',
    diagnosticCode: '7831',
    cfrReference: '38 CFR 4.118',
    description: 'Autoimmune hair loss condition affecting scalp, face, or body',
    symptomIds: [
      'aa-patchy-scalp', 'aa-complete-scalp', 'aa-eyebrow-loss', 'aa-eyelash-loss',
      'aa-beard-loss', 'aa-body-hair-loss', 'aa-all-body-hair', 'aa-nail-changes',
      'aa-exclamation-hairs', 'aa-regrowth', 'aa-recurrent', 'aa-steroid-injections',
      'aa-topical-treatment', 'aa-immunotherapy'
    ],
  },
  HYPERHIDROSIS: {
    id: 'hyperhidrosis',
    name: 'Hyperhidrosis',
    diagnosticCode: '7832',
    cfrReference: '38 CFR 4.118',
    description: 'Excessive sweating affecting hands, feet, underarms, or generalized',
    symptomIds: [
      'hh-palmar', 'hh-plantar', 'hh-axillary', 'hh-facial', 'hh-generalized',
      'hh-dripping-sweat', 'hh-paper-handling', 'hh-tool-handling', 'hh-keyboard-difficulty',
      'hh-handshake-avoidance', 'hh-clothing-changes', 'hh-skin-maceration', 'hh-fungal-infections',
      'hh-antiperspirant', 'hh-iontophoresis', 'hh-botox', 'hh-oral-medication', 'hh-surgery',
      'hh-therapy-responsive', 'hh-therapy-unresponsive', 'hh-occupational-impact'
    ],
  },
  DISCOID_LUPUS: {
    id: 'discoid-lupus',
    name: 'Discoid Lupus Erythematosus',
    diagnosticCode: '7809',
    cfrReference: '38 CFR 4.118',
    description: 'Chronic skin condition causing discoid lesions, scarring, and photosensitivity',
    symptomIds: [
      'dle-discoid-lesions', 'dle-erythematous-plaques', 'dle-scarring', 'dle-hyperpigmentation',
      'dle-hypopigmentation', 'dle-scalp-involvement', 'dle-ear-involvement', 'dle-face-involvement',
      'dle-photosensitivity', 'dle-follicular-plugging', 'dle-under5-body', 'dle-5to20-body',
      'dle-20to40-body', 'dle-over40-body', 'dle-topical-only', 'dle-systemic-intermittent',
      'dle-systemic-6weeks', 'dle-systemic-constant'
    ],
  },
  BULLOUS_DISORDERS: {
    id: 'bullous-disorders',
    name: 'Bullous Disorders',
    diagnosticCode: '7815',
    cfrReference: '38 CFR 4.118',
    description: 'Blistering skin conditions including pemphigus, bullous pemphigoid, dermatitis herpetiformis',
    symptomIds: [
      'bullous-blisters', 'bullous-erosions', 'bullous-crusting', 'bullous-nikolsky-sign',
      'bullous-oral-mucosal', 'bullous-ocular', 'bullous-gi-involvement', 'bullous-genital',
      'bullous-itching', 'bullous-burning', 'bullous-scarring', 'bullous-under5-body',
      'bullous-5to20-body', 'bullous-20to40-body', 'bullous-over40-body', 'bullous-topical-only',
      'bullous-systemic-intermittent', 'bullous-systemic-6weeks', 'bullous-systemic-constant'
    ],
  },
  CUTANEOUS_VASCULITIS: {
    id: 'cutaneous-vasculitis',
    name: 'Primary Cutaneous Vasculitis',
    diagnosticCode: '7826',
    cfrReference: '38 CFR 4.118',
    description: 'Inflammation of blood vessels in skin causing purpura, ulcers, and tissue damage',
    symptomIds: [
      'cv-purpura', 'cv-petechiae', 'cv-ulcers', 'cv-nodules', 'cv-livedo-reticularis',
      'cv-necrosis', 'cv-episode-documented', 'cv-episodes-1to3', 'cv-episodes-4plus',
      'cv-no-systemic-med', 'cv-continuous-systemic', 'cv-intermittent-immuno',
      'cv-refractory', 'cv-scarring', 'cv-disfigurement'
    ],
  },
  DERMATOPHYTOSIS: {
    id: 'dermatophytosis',
    name: 'Dermatophytosis',
    diagnosticCode: '7813',
    cfrReference: '38 CFR 4.118',
    description: 'Fungal skin infections including ringworm, athlete\'s foot, jock itch, nail fungus',
    symptomIds: [
      'derm-tinea-corporis', 'derm-tinea-capitis', 'derm-tinea-pedis', 'derm-tinea-cruris',
      'derm-tinea-barbae', 'derm-onychomycosis', 'derm-tinea-versicolor', 'derm-scaling',
      'derm-itching', 'derm-ring-pattern', 'derm-hair-loss', 'derm-nail-thickening',
      'derm-recurrent', 'derm-under5-body', 'derm-5to20-body', 'derm-20to40-body',
      'derm-over40-body', 'derm-topical-only', 'derm-systemic-intermittent',
      'derm-systemic-6weeks', 'derm-systemic-constant'
    ],
  },
  SKIN_INFECTIONS: {
    id: 'skin-infections',
    name: 'Skin Infections',
    diagnosticCode: '7820',
    cfrReference: '38 CFR 4.118',
    description: 'Bacterial, viral, fungal, or parasitic skin infections not listed elsewhere',
    symptomIds: [
      'skinf-bacterial', 'skinf-cellulitis', 'skinf-abscess', 'skinf-impetigo',
      'skinf-folliculitis', 'skinf-viral', 'skinf-herpes-simplex', 'skinf-herpes-zoster',
      'skinf-warts', 'skinf-molluscum', 'skinf-parasitic', 'skinf-recurrent',
      'skinf-under5-body', 'skinf-5to20-body', 'skinf-20to40-body', 'skinf-over40-body',
      'skinf-topical-only', 'skinf-systemic-intermittent', 'skinf-systemic-6weeks',
      'skinf-systemic-constant'
    ],
  },
  SYSTEMIC_LUPUS: {
    id: 'systemic-lupus',
    name: 'Systemic Lupus Erythematosus',
    diagnosticCode: '6350',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      // Core SLE symptoms
      'sle-flare-acute', 'sle-flare-moderate', 'sle-flare-mild',
      'sle-fatigue-severe', 'sle-fatigue-moderate',
      'sle-fever', 'sle-weight-loss', 'sle-malaise',
      // Skin manifestations
      'sle-malar-rash', 'sle-discoid-rash', 'sle-photosensitivity',
      'sle-oral-ulcers', 'sle-skin-lesions', 'sle-hair-loss',
      // Joint involvement
      'sle-joint-pain', 'sle-joint-swelling', 'sle-arthritis',
      // Organ involvement
      'sle-kidney-involvement', 'sle-proteinuria', 'sle-hematuria',
      'sle-chest-pain-pleurisy', 'sle-pericarditis', 'sle-shortness-breath',
      'sle-neurological', 'sle-seizures', 'sle-psychosis', 'sle-cognitive',
      // Hematologic
      'sle-anemia', 'sle-low-platelets', 'sle-low-white-cells',
      // Other
      'sle-raynauds', 'sle-dry-eyes', 'sle-dry-mouth',
      'sle-hospitalization', 'sle-immunosuppressant', 'sle-steroid-use',
    ],
    bodySystem: 'immune',
  },
  AVITAMINOSIS: {
    id: 'avitaminosis',
    name: 'Avitaminosis (Vitamin Deficiency)',
    diagnosticCode: '6313',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      // GI symptoms
      'avitaminosis-stomatitis', 'avitaminosis-diarrhea', 'avitaminosis-achlorhydria',
      'avitaminosis-appetite-loss', 'avitaminosis-abdominal-discomfort', 'avitaminosis-nausea',
      // Dermatologic
      'avitaminosis-dermatitis-moist', 'avitaminosis-dermatitis-symmetrical', 'avitaminosis-dermatitis-dry',
      'avitaminosis-skin-lesions', 'avitaminosis-hair-changes', 'avitaminosis-nail-changes',
      // Neurological/Mental
      'avitaminosis-mental-changes', 'avitaminosis-irritability', 'avitaminosis-concentration-difficulty',
      'avitaminosis-confusion', 'avitaminosis-depression', 'avitaminosis-memory-problems',
      // Constitutional
      'avitaminosis-weakness', 'avitaminosis-fatigue', 'avitaminosis-weight-loss',
      'avitaminosis-exhaustion', 'avitaminosis-cachexia', 'avitaminosis-impaired-vigor',
      // Nutritional status
      'avitaminosis-malnutrition', 'avitaminosis-inability-retain-nourishment',
    ],
    bodySystem: 'infectious', // Rated under 4.88b
  },
  BERIBERI: {
    id: 'beriberi',
    name: 'Beriberi (Thiamine/B1 Deficiency)',
    diagnosticCode: '6314',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      // Cardiac (Wet Beriberi)
      'beriberi-chf', 'beriberi-cardiomegaly', 'beriberi-anasarca', 'beriberi-edema',
      'beriberi-dyspnea', 'beriberi-tachycardia', 'beriberi-palpitations',
      // Neurological (Dry Beriberi)
      'beriberi-neuropathy', 'beriberi-footdrop', 'beriberi-muscle-atrophy-thigh',
      'beriberi-muscle-atrophy-calf', 'beriberi-absent-knee-jerk', 'beriberi-absent-ankle-jerk',
      'beriberi-sensation-loss', 'beriberi-burning-feet', 'beriberi-leg-heaviness',
      'beriberi-leg-stiffness',
      // Wernicke-Korsakoff
      'beriberi-wernicke-korsakoff', 'beriberi-confusion', 'beriberi-ataxia',
      'beriberi-eye-movement-abnormal', 'beriberi-memory-loss',
      // General
      'beriberi-weakness', 'beriberi-fatigue', 'beriberi-anorexia', 'beriberi-dizziness',
      'beriberi-headache', 'beriberi-sleep-disturbance',
    ],
    bodySystem: 'infectious',
  },
  PELLAGRA: {
    id: 'pellagra',
    name: 'Pellagra (Niacin/B3 Deficiency)',
    diagnosticCode: '6315',
    cfrReference: '38 CFR 4.88b',
    symptomIds: [
      // Classic "4 Ds": Dermatitis, Diarrhea, Dementia, Death
      // Dermatologic
      'pellagra-dermatitis-moist', 'pellagra-dermatitis-symmetrical', 'pellagra-dermatitis-photosensitive',
      'pellagra-casal-necklace', 'pellagra-skin-thickening', 'pellagra-skin-scaling',
      // GI
      'pellagra-stomatitis', 'pellagra-glossitis', 'pellagra-diarrhea', 'pellagra-achlorhydria',
      'pellagra-nausea', 'pellagra-vomiting', 'pellagra-abdominal-discomfort',
      // Mental
      'pellagra-mental-changes', 'pellagra-dementia', 'pellagra-confusion',
      'pellagra-depression', 'pellagra-irritability', 'pellagra-concentration-difficulty',
      'pellagra-memory-problems', 'pellagra-psychosis',
      // Constitutional
      'pellagra-weakness', 'pellagra-fatigue', 'pellagra-weight-loss', 'pellagra-appetite-loss',
      'pellagra-exhaustion', 'pellagra-cachexia', 'pellagra-impaired-vigor',
      'pellagra-inability-retain-nourishment',
    ],
    bodySystem: 'infectious',
  },
};

// ============================================
// SKIN & ENDOCRINE RATING CRITERIA & ANALYZE FUNCTIONS
// ============================================

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

  secondaryConditions: {
    description: 'Diabetes Mellitus commonly causes complications that can be rated as separate secondary service-connected conditions. Each secondary condition requires medical documentation showing it is "at least as likely as not" caused or aggravated by diabetes.',

    categories: {
      kidneys: {
        name: 'Kidney Complications',
        conditions: [
          {
            manifestation: 'Diabetic Nephropathy',
            suggestedDCs: ['7541'],
            dcDescriptions: ['Renal involvement in diabetes mellitus'],
            nexusStrength: 'strong',
            notes: 'Very common complication. Document proteinuria, elevated creatinine, GFR decline.',
            documentationTips: ['Request urinalysis showing protein', 'Track GFR over time', 'Get nephrology consult'],
          },
        ],
      },

      nerves: {
        name: 'Nerve Damage (Neuropathy)',
        conditions: [
          {
            manifestation: 'Peripheral Neuropathy - Lower Extremities',
            suggestedDCs: ['8520', '8521'],
            dcDescriptions: ['Sciatic nerve paralysis', 'External popliteal (common peroneal) nerve'],
            nexusStrength: 'strong',
            notes: 'Most common complication. Document numbness, tingling, burning in feet/legs.',
            documentationTips: ['EMG/nerve conduction study', 'Monofilament testing results', 'Document symptom progression'],
          },
          {
            manifestation: 'Peripheral Neuropathy - Upper Extremities',
            suggestedDCs: ['8515', '8516'],
            dcDescriptions: ['Median nerve paralysis', 'Ulnar nerve paralysis'],
            nexusStrength: 'strong',
            notes: 'Document hand numbness, weakness, carpal tunnel symptoms.',
            documentationTips: ['EMG/nerve conduction study', 'Document grip strength changes'],
          },
        ],
      },

      eyes: {
        name: 'Eye Complications',
        conditions: [
          {
            manifestation: 'Diabetic Retinopathy',
            suggestedDCs: ['6006'],
            dcDescriptions: ['Retinopathy'],
            nexusStrength: 'strong',
            notes: 'Regular eye exams essential. Document any laser treatment or injections.',
            documentationTips: ['Annual dilated eye exams', 'Retinal photography', 'Document vision changes'],
          },
          {
            manifestation: 'Cataracts',
            suggestedDCs: ['6027'],
            dcDescriptions: ['Cataract, any type'],
            nexusStrength: 'moderate',
            notes: 'Diabetics develop cataracts earlier. Document surgical history if applicable.',
            documentationTips: ['Ophthalmology records', 'Document onset age vs normal population'],
          },
          {
            manifestation: 'Glaucoma',
            suggestedDCs: ['6012', '6013'],
            dcDescriptions: ['Open-angle glaucoma', 'Angle-closure glaucoma'],
            nexusStrength: 'moderate',
            notes: 'Diabetes increases glaucoma risk. Document intraocular pressure readings.',
            documentationTips: ['Visual field testing', 'Optic nerve imaging', 'IOP measurements'],
          },
        ],
      },

      cardiovascular: {
        name: 'Cardiovascular Complications',
        conditions: [
          {
            manifestation: 'Coronary Artery Disease (CAD)',
            suggestedDCs: ['7005'],
            dcDescriptions: ['Arteriosclerotic heart disease (CAD)'],
            nexusStrength: 'strong',
            notes: 'Diabetes significantly accelerates atherosclerosis. Document cardiac workup.',
            documentationTips: ['Stress test results', 'Cardiac catheterization', 'Echocardiogram'],
          },
          {
            manifestation: 'Myocardial Infarction (Heart Attack)',
            suggestedDCs: ['7006'],
            dcDescriptions: ['Myocardial infarction'],
            nexusStrength: 'strong',
            notes: 'Post-MI ratings depend on METs capacity and ejection fraction.',
            documentationTips: ['Hospital records from MI', 'Follow-up echocardiogram', 'Exercise capacity documentation'],
          },
          {
            manifestation: 'Hypertension',
            suggestedDCs: ['7101'],
            dcDescriptions: ['Hypertensive vascular disease'],
            nexusStrength: 'strong',
            notes: 'Very commonly co-occurs with diabetes. Document blood pressure readings.',
            documentationTips: ['Home BP log', 'Medication history', '24-hour ambulatory BP monitoring'],
          },
          {
            manifestation: 'Atherosclerosis/Peripheral Arterial Disease',
            suggestedDCs: ['7114'],
            dcDescriptions: ['Arteriosclerosis obliterans'],
            nexusStrength: 'strong',
            notes: 'Document claudication symptoms, ABI testing, vascular imaging.',
            documentationTips: ['Ankle-brachial index (ABI)', 'Arterial Doppler studies', 'Document walking limitations'],
          },
          {
            manifestation: 'Stroke/CVA Residuals',
            suggestedDCs: ['8008'],
            dcDescriptions: ['Cerebral thrombosis'],
            nexusStrength: 'strong',
            notes: 'Diabetes increases stroke risk 2-4x. Rate residuals under appropriate codes.',
            documentationTips: ['Brain imaging', 'Neurology evaluation', 'Document all residual deficits'],
          },
        ],
      },

      skin: {
        name: 'Skin Complications',
        conditions: [
          {
            manifestation: 'Bacterial Skin Infections (Recurring)',
            suggestedDCs: ['7820'],
            dcDescriptions: ['Infections of the skin not listed elsewhere'],
            nexusStrength: 'moderate',
            notes: 'Diabetics prone to skin infections. Document frequency and treatment.',
            documentationTips: ['Wound care records', 'Antibiotic prescriptions', 'Photo documentation'],
          },
          {
            manifestation: 'Fungal Skin Infections',
            suggestedDCs: ['7813'],
            dcDescriptions: ['Dermatophytosis'],
            nexusStrength: 'moderate',
            notes: 'Increased susceptibility to fungal infections, especially feet.',
            documentationTips: ['Podiatry records', 'Treatment history', 'Culture results if available'],
          },
          {
            manifestation: 'Diabetic Dermopathy',
            suggestedDCs: ['7806'],
            dcDescriptions: ['Dermatitis or eczema'],
            nexusStrength: 'moderate',
            notes: 'Shin spots, skin changes specific to diabetes.',
            documentationTips: ['Dermatology evaluation', 'Photo documentation', 'Biopsy if performed'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health Complications',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Depression is 2-3x more common in diabetics. Document mental health treatment.',
            documentationTips: ['Mental health treatment records', 'PHQ-9 scores over time', 'Medication history'],
          },
          {
            manifestation: 'Anxiety',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Generalized anxiety disorder'],
            nexusStrength: 'moderate',
            notes: 'Chronic disease management burden can cause anxiety.',
            documentationTips: ['Mental health records', 'GAD-7 scores', 'Document functional impairment'],
          },
        ],
      },

      genitourinary: {
        name: 'Genitourinary Complications',
        conditions: [
          {
            manifestation: 'Erectile Dysfunction',
            suggestedDCs: ['7522'],
            dcDescriptions: ['Penis, deformity, with loss of erectile power'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'May qualify for SMC-K (loss of use of creative organ)',
            notes: 'Very common in diabetic men. Document onset and treatment attempts.',
            documentationTips: ['Urology evaluation', 'Treatment history (medications, devices)', 'Document onset timing'],
          },
          {
            manifestation: 'Neurogenic Bladder',
            suggestedDCs: ['7542'],
            dcDescriptions: ['Neurogenic bladder'],
            nexusStrength: 'moderate',
            notes: 'Autonomic neuropathy can affect bladder function.',
            documentationTips: ['Urodynamic studies', 'Post-void residual measurements', 'Urology records'],
          },
        ],
      },
    },

    importantNotes: [
      'Each complication should be claimed as a SEPARATE secondary condition',
      'VA may combine some conditions under pyramiding rules - but claim them all',
      'Document timeline showing diabetes diagnosis PRECEDED the complication',
      'Get medical opinion stating complication is "at least as likely as not" due to diabetes',
      'Complications can also be aggravated by diabetes even if not directly caused',
    ],

    documentationStrategy: [
      'Maintain glucose log showing chronic condition',
      'Get HbA1c tested every 3 months',
      'Annual comprehensive diabetic exam (eyes, feet, kidneys)',
      'Request written nexus opinion from treating physician',
      'Keep records of all specialist referrals',
    ],
  },

  disclaimer: 'This analysis is based on logged glucose and HbA1c measurements. VA diabetes ratings consider insulin requirement, dietary restrictions, activity limitations, hospitalizations, and complications. A formal VA rating requires C&P examination and complete medical records review. Continue regular endocrinology care and glucose monitoring.',
};

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
// RATING CRITERIA - GERD COMPLICATIONS
// ============================================

export const HYPOTHYROIDISM_CRITERIA = {
  diagnosticCode: '7903',
  condition: 'Hypothyroidism',
  cfrReference: '38 CFR 4.119, Diagnostic Code 7903',

  ratings: [
    {
      percent: 100,
      summary: 'Myxedema: cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance',
      criteria: {
        myxedema: true,
        coldIntolerance: true,
        muscularWeakness: true,
        cardiovascularInvolvement: true,
        mentalDisturbance: true,
      },
      criteriaDescription: [
        'Hypothyroidism manifesting as myxedema with:',
        '- Cold intolerance',
        '- Muscular weakness',
        '- Cardiovascular involvement (hypotension, bradycardia, pericardial effusion)',
        '- Mental disturbance (dementia, slowing of thought, depression)',
      ],
      evidenceNeeded: [
        'Diagnosis of myxedema',
        'Documentation of all four symptom categories',
        'Lab work showing severe hypothyroidism',
        'Cardiology records if cardiovascular involvement',
      ],
    },
    {
      percent: 30,
      summary: 'Hypothyroidism without myxedema',
      criteria: {
        hypothyroidism: true,
        withoutMyxedema: true,
      },
      criteriaDescription: [
        'Hypothyroidism without myxedema',
        'This 30% evaluation continues for six months after initial diagnosis',
        'Thereafter, rate residuals under appropriate diagnostic codes',
      ],
      evidenceNeeded: [
        'Diagnosis of hypothyroidism',
        'Lab work (TSH, T4)',
        'Medication records',
      ],
    },
  ],

  definitions: {
    myxedema: {
      term: 'Myxedema',
      definition: 'Severe, advanced hypothyroidism with skin changes, mental slowing, and life-threatening complications. A medical emergency.',
      examples: [
        'Puffy face and extremities',
        'Severe cold intolerance',
        'Extreme fatigue and mental slowness',
        'Low body temperature, blood pressure, heart rate',
      ],
    },
    hypothyroidism: {
      term: 'Hypothyroidism',
      definition: 'Underactive thyroid gland that doesn\'t produce enough thyroid hormone, causing metabolism to slow.',
      examples: [
        'Fatigue and sluggishness',
        'Weight gain',
        'Cold intolerance',
        'Dry skin and hair',
        'Constipation',
        'Depression',
      ],
    },
  },

  ratingNote: 'The 30% rating continues for 6 months after initial diagnosis. After that period, the VA rates residuals of the disease or medical treatment under the most appropriate diagnostic codes.',

  disclaimer: 'This analysis is based on logged hypothyroidism symptoms. Most Veterans will receive the 30% initial rating, then be rated on residual symptoms. Track all symptoms and medication side effects.',
};

// ============================================
// HYPERTHYROIDISM/GRAVES' DISEASE CRITERIA (DC 7900)
// ============================================

export const HYPERTHYROIDISM_CRITERIA = {
  diagnosticCode: '7900',
  condition: 'Hyperthyroidism/Graves\' Disease',
  cfrReference: '38 CFR 4.119',
  ratings: [
    {
      percent: 30,
      summary: 'For six months after initial diagnosis',
      criteria: {
        initialDiagnosis: true,
      },
      requirements: [
        'Initial diagnosis of hyperthyroidism or Graves\' disease',
        '30% rating continues for six months after initial diagnosis',
        'After six months, rate residuals under appropriate diagnostic codes',
      ],
    },
    {
      percent: 0,
      summary: 'After initial period - rate residuals separately',
      criteria: {
        residualsOnly: true,
      },
      requirements: [
        'After six-month initial period',
        'Rate cardiac involvement under DC 7008 (hyperthyroid heart disease)',
        'Rate eye involvement under appropriate eye DCs (6061-6066, 6090)',
        'Rate other residuals under appropriate body system codes',
      ],
    },
  ],
  definitions: {
    gravesDisease: {
      term: 'Graves\' Disease',
      definition: 'An autoimmune disorder causing hyperthyroidism, often with eye involvement (Graves\' ophthalmopathy).',
    },
    hyperthyroidism: {
      term: 'Hyperthyroidism',
      definition: 'Overactive thyroid producing excess thyroid hormone, causing increased metabolism, rapid heartbeat, and other symptoms.',
    },
    exophthalmos: {
      term: 'Exophthalmos',
      definition: 'Bulging of the eyes, a hallmark of Graves\' disease caused by inflammation of tissues behind the eyes.',
    },
  },
  note: 'Hyperthyroid heart disease (DC 7008) and eye involvement from Graves\' disease should be separately evaluated under their respective diagnostic codes. Track all symptoms including cardiac and eye manifestations.',
  disclaimer: 'This analysis is based on logged hyperthyroidism symptoms. The initial 30% rating applies for six months after diagnosis. After that period, residual symptoms are rated under appropriate body system codes.',
};

// ============================================
// THYROIDITIS CRITERIA (DC 7906)
// ============================================

export const THYROIDITIS_CRITERIA = {
  diagnosticCode: '7906',
  condition: 'Thyroiditis',
  cfrReference: '38 CFR 4.119',
  ratings: [
    {
      percent: 30,
      summary: 'Manifesting as hyperthyroidism - rate as DC 7900',
      criteria: {
        hyperthyroidPhase: true,
      },
      requirements: [
        'Thyroiditis with hyperthyroid symptoms',
        'Evaluate as hyperthyroidism (DC 7900)',
        'Weight loss, rapid heartbeat, heat intolerance, anxiety',
      ],
    },
    {
      percent: 30,
      summary: 'Manifesting as hypothyroidism - rate as DC 7903',
      criteria: {
        hypothyroidPhase: true,
      },
      requirements: [
        'Thyroiditis with hypothyroid symptoms',
        'Evaluate as hypothyroidism (DC 7903)',
        'Fatigue, cold intolerance, weight gain, depression',
      ],
    },
    {
      percent: 0,
      summary: 'With normal thyroid function (euthyroid)',
      criteria: {
        euthyroid: true,
      },
      requirements: [
        'Thyroiditis with normal thyroid function',
        'No hyperthyroid or hypothyroid symptoms',
      ],
    },
  ],
  definitions: {
    thyroiditis: {
      term: 'Thyroiditis',
      definition: 'Inflammation of the thyroid gland that can cause temporary hyperthyroidism followed by hypothyroidism, or may resolve to normal function.',
    },
    hashimotos: {
      term: 'Hashimoto\'s Thyroiditis',
      definition: 'An autoimmune form of thyroiditis that typically leads to hypothyroidism.',
    },
    subacute: {
      term: 'Subacute Thyroiditis',
      definition: 'Painful thyroid inflammation often following viral infection, causing temporary thyroid dysfunction.',
    },
  },
  note: 'Thyroiditis is rated based on its functional manifestation: as hyperthyroidism (DC 7900) if causing excess thyroid hormone, as hypothyroidism (DC 7903) if causing thyroid deficiency, or 0% if thyroid function is normal.',
  disclaimer: 'This analysis is based on logged thyroiditis symptoms. Rating depends on current thyroid function status - track both hyperthyroid and hypothyroid symptoms.',
};

// ============================================
// HYPERPARATHYROIDISM CRITERIA (DC 7904)
// ============================================

export const HYPERPARATHYROIDISM_CRITERIA = {
  diagnosticCode: '7904',
  condition: 'Hyperparathyroidism',
  cfrReference: '38 CFR 4.119',
  ratings: [
    {
      percent: 100,
      summary: 'For six months following surgery',
      criteria: {
        postSurgery: true,
      },
      requirements: [
        'Following parathyroid surgery',
        '100% rating for six months from date of discharge',
        'After six months, rate on residuals based on VA examination',
      ],
    },
    {
      percent: 60,
      summary: 'Hypercalcemia with objective findings',
      criteria: {
        hypercalcemia: true,
        objectiveFindings: true,
      },
      requirements: [
        'Total Ca >12 mg/dL (3-3.5 mmol/L), OR',
        'Ionized Ca >5.6 mg/dL (2-2.5 mmol/L), OR',
        'Creatinine clearance <60 mL/min, OR',
        'Bone mineral density T-score <-2.5 SD at any site, OR',
        'Previous fragility fracture',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms despite surgery or requires continuous medication',
      criteria: {
        persistentSymptoms: true,
      },
      requirements: [
        'Symptoms (fatigue, anorexia, nausea, constipation) despite surgery, OR',
        'Not a surgical candidate but requires continuous medication for control',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic',
      criteria: {
        asymptomatic: true,
      },
      requirements: [
        'No symptoms',
        'Condition controlled without medication',
      ],
    },
  ],
  definitions: {
    hyperparathyroidism: {
      term: 'Hyperparathyroidism',
      definition: 'Overproduction of parathyroid hormone (PTH) causing elevated calcium levels, bone loss, kidney stones, and other complications.',
    },
    hypercalcemia: {
      term: 'Hypercalcemia',
      definition: 'Elevated calcium levels in the blood, causing symptoms like fatigue, confusion, constipation, and bone pain.',
    },
    fragilityFracture: {
      term: 'Fragility Fracture',
      definition: 'A fracture resulting from minimal trauma (such as a fall from standing height) indicating weakened bones.',
    },
  },
  note: 'Chronic residuals such as kidney stones, decreased renal function, fractures, vision problems, and cardiovascular complications should be evaluated under their appropriate diagnostic codes.',
  disclaimer: 'This analysis is based on logged hyperparathyroidism symptoms. Lab values (calcium levels, creatinine clearance) and bone density testing significantly impact the rating.',
};

// ============================================
// HYPOPARATHYROIDISM CRITERIA (DC 7905)
// ============================================

export const HYPOPARATHYROIDISM_CRITERIA = {
  diagnosticCode: '7905',
  condition: 'Hypoparathyroidism',
  cfrReference: '38 CFR 4.119',
  ratings: [
    {
      percent: 100,
      summary: 'For three months after initial diagnosis',
      criteria: {
        initialDiagnosis: true,
      },
      requirements: [
        'Initial diagnosis of hypoparathyroidism',
        '100% rating for three months after initial diagnosis',
        'After three months, rate chronic residuals under appropriate codes',
      ],
    },
    {
      percent: 0,
      summary: 'After initial period - rate residuals separately',
      criteria: {
        residualsOnly: true,
      },
      requirements: [
        'After three-month initial period',
        'Rate kidney stones under DC 7508-7509',
        'Rate cataracts under appropriate eye DC',
        'Rate decreased renal function under DC 7530-7541',
        'Rate congestive heart failure under DC 7006',
      ],
    },
  ],
  definitions: {
    hypoparathyroidism: {
      term: 'Hypoparathyroidism',
      definition: 'Underproduction of parathyroid hormone (PTH) causing low calcium levels, muscle cramps, spasms, and neurological symptoms.',
    },
    tetany: {
      term: 'Tetany',
      definition: 'Involuntary muscle contractions and spasms caused by low calcium levels, a hallmark of hypoparathyroidism.',
    },
    hypocalcemia: {
      term: 'Hypocalcemia',
      definition: 'Low calcium levels in the blood causing numbness, tingling, muscle cramps, and potentially seizures.',
    },
  },
  note: 'Chronic residuals including kidney stones, cataracts, decreased renal function, and congestive heart failure should be evaluated under their respective diagnostic codes after the initial rating period.',
  disclaimer: 'This analysis is based on logged hypoparathyroidism symptoms. The initial 100% rating applies for three months after diagnosis. Track all residual symptoms for separate rating consideration.',
};

// ============================================
// PHASE 3B: ADRENAL & PITUITARY CRITERIA
// ============================================

/**
 * Addison's Disease Rating Criteria - DC 7911
 * 38 CFR 4.119
 */

export const ADDISONS_DISEASE_CRITERIA = {
  diagnosticCode: '7911',
  cfrReference: '38 CFR 4.119',
  condition: "Addison's Disease (Adrenocortical Insufficiency)",
  ratings: [
    {
      percent: 60,
      criteria: 'Four or more crises during the past year',
      summary: 'Four or more adrenal crises per year',
    },
    {
      percent: 40,
      criteria: 'Three crises during the past year, or; five or more episodes during the past year',
      summary: 'Three crises OR five or more episodes per year',
    },
    {
      percent: 20,
      criteria: 'One or two crises during the past year, or; two to four episodes during the past year, or; weakness and fatigability, or; corticosteroid therapy required for control',
      summary: '1-2 crises OR 2-4 episodes OR weakness/fatigue OR requires corticosteroids',
    },
  ],
  notes: [
    'An Addisonian "crisis" consists of rapid onset of peripheral vascular collapse with acute hypotension and shock',
    'Crisis findings may include: anorexia, nausea, vomiting, dehydration, profound weakness, pain in abdomen/legs/back, fever, apathy, depressed mentation with possible progression to coma, renal shutdown, and death',
    'An Addisonian "episode" is less acute and less severe than a crisis',
    'Episode may consist of: anorexia, nausea, vomiting, diarrhea, dehydration, weakness, malaise, orthostatic hypotension, or hypoglycemia, but no peripheral vascular collapse',
    'Tuberculous Addison\'s disease is evaluated as active or inactive tuberculosis',
  ],
  definitions: {
    "Addisonian Crisis": "Rapid onset of peripheral vascular collapse with acute hypotension and shock, potentially life-threatening",
    "Addisonian Episode": "Less severe event without vascular collapse - may include nausea, weakness, orthostatic hypotension, or hypoglycemia",
    "Adrenocortical Insufficiency": "Inadequate production of cortisol and/or aldosterone by the adrenal glands",
    "Hyperpigmentation": "Darkening of skin, especially in creases, scars, and mucous membranes, due to elevated ACTH",
  },
  disclaimer: 'This analysis is for documentation purposes only. VA ratings require official medical evaluation and C&P examination.',
};

/**
 * Cushing's Syndrome Rating Criteria - DC 7907
 * 38 CFR 4.119
 */

export const CUSHINGS_SYNDROME_CRITERIA = {
  diagnosticCode: '7907',
  cfrReference: '38 CFR 4.119',
  condition: "Cushing's Syndrome",
  ratings: [
    {
      percent: 100,
      criteria: 'As active, progressive disease, including areas of osteoporosis, hypertension, and proximal upper and lower extremity muscle wasting that results in inability to rise from squatting position, climb stairs, rise from a deep chair without assistance, or raise arms',
      summary: 'Active progressive disease with osteoporosis, HTN, AND severe proximal muscle wasting',
    },
    {
      percent: 60,
      criteria: 'Proximal upper or lower extremity muscle wasting that results in inability to rise from squatting position, climb stairs, rise from a deep chair without assistance, or raise arms',
      summary: 'Proximal muscle wasting causing functional limitations',
    },
    {
      percent: 30,
      criteria: 'With striae, obesity, moon face, glucose intolerance, and vascular fragility',
      summary: 'Classic Cushingoid features: striae, obesity, moon face, glucose intolerance, vascular fragility',
    },
  ],
  notes: [
    'Evaluations continue for six months following initial diagnosis',
    'After six months, rate on residuals under the appropriate diagnostic codes within the appropriate body systems',
    'Proximal muscle weakness specifically affects ability to rise from squatting, climb stairs, rise from chair, or raise arms',
  ],
  definitions: {
    "Cushing's Syndrome": "Condition resulting from prolonged exposure to elevated cortisol levels",
    "Moon Face": "Rounded, full facial appearance due to fat redistribution",
    "Buffalo Hump": "Fat accumulation between the shoulders (dorsocervical fat pad)",
    "Striae": "Purple or pink stretch marks, typically on abdomen, thighs, breasts, and arms",
    "Proximal Muscle Weakness": "Weakness affecting muscles closest to the trunk - thighs, upper arms, shoulders",
    "Vascular Fragility": "Thin skin and blood vessels that bruise easily",
  },
  disclaimer: 'This analysis is for documentation purposes only. VA ratings require official medical evaluation and C&P examination.',
};

/**
 * Diabetes Insipidus Rating Criteria - DC 7909
 * 38 CFR 4.119
 */

export const DIABETES_INSIPIDUS_CRITERIA = {
  diagnosticCode: '7909',
  cfrReference: '38 CFR 4.119',
  condition: 'Diabetes Insipidus',
  ratings: [
    {
      percent: 30,
      criteria: 'For three months after initial diagnosis',
      summary: 'For three months after initial diagnosis',
    },
    {
      percent: 10,
      criteria: 'With persistent polyuria or requiring continuous hormonal therapy',
      summary: 'Persistent polyuria OR requires continuous hormonal therapy',
    },
  ],
  notes: [
    'Initial 30% rating applies for three months after diagnosis',
    'If diabetes insipidus has subsided after initial period, rate residuals under appropriate diagnostic codes',
    'Hormonal therapy typically involves desmopressin (DDAVP)',
  ],
  definitions: {
    "Diabetes Insipidus": "Condition characterized by excretion of large amounts of severely diluted urine due to inadequate ADH production or kidney response",
    "Polyuria": "Excessive urination, typically >3 liters per day",
    "Polydipsia": "Excessive thirst",
    "ADH (Vasopressin)": "Antidiuretic hormone that regulates water balance",
    "Desmopressin": "Synthetic ADH used to treat diabetes insipidus",
  },
  disclaimer: 'This analysis is for documentation purposes only. VA ratings require official medical evaluation and C&P examination.',
};

/**
 * Hyperaldosteronism Rating Criteria - DC 7917
 * 38 CFR 4.119
 */

export const HYPERALDOSTERONISM_CRITERIA = {
  diagnosticCode: '7917',
  cfrReference: '38 CFR 4.119',
  condition: 'Hyperaldosteronism',
  ratings: [
    {
      percent: 100,
      criteria: 'If malignant neoplasm - 100% during active disease and treatment',
      summary: 'Malignant - rate as malignant neoplasm',
    },
    {
      percent: 0,
      criteria: 'If benign - evaluate residuals under appropriate diagnostic codes',
      summary: 'Benign - rate residuals (hypertension, hypokalemia effects)',
    },
  ],
  notes: [
    'Evaluate as malignant or benign neoplasm as appropriate',
    'Common residuals include hypertension (rate under DC 7101) and hypokalemia-related symptoms',
    'Conn\'s syndrome (aldosterone-producing adenoma) is the most common cause',
    'Symptoms largely driven by hypertension and low potassium',
  ],
  definitions: {
    "Hyperaldosteronism": "Excessive production of aldosterone by the adrenal glands",
    "Conn's Syndrome": "Primary hyperaldosteronism caused by an aldosterone-producing adrenal adenoma",
    "Hypokalemia": "Low potassium levels in the blood, causing muscle weakness, cramps, and cardiac effects",
    "Aldosterone": "Hormone that regulates sodium and potassium balance, affecting blood pressure",
  },
  disclaimer: 'This analysis is for documentation purposes only. VA ratings require official medical evaluation and C&P examination.',
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

export const ACNE_CRITERIA = {
  diagnosticCode: '7828',
  condition: 'Acne',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7828',

  note: 'Acne is rated based on depth (superficial vs deep) and extent of involvement. Deep acne involves inflamed nodules and pus-filled cysts. Alternatively may be rated as disfigurement (DC 7800) or scars (DC 7801-7805) if that provides a higher rating.',

  ratings: [
    {
      percent: 30,
      summary: 'Deep acne affecting 40% or more of face and neck',
      criteriaDescription: [
        'Deep acne (deep inflamed nodules and pus-filled cysts)',
        'Affecting 40 percent or more of the face and neck',
      ],
      evidenceNeeded: [
        'Medical documentation of deep acne with nodules/cysts',
        'Documentation that 40%+ of face and neck is affected',
        'Photographs during active breakouts',
        'Dermatology treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Deep acne affecting less than 40% of face/neck, OR deep acne on body',
      criteriaDescription: [
        'Deep acne (deep inflamed nodules and pus-filled cysts) affecting less than 40% of the face and neck, OR',
        'Deep acne affecting areas other than the face and neck',
      ],
      evidenceNeeded: [
        'Medical documentation of deep acne',
        'Documentation of affected areas',
        'Photographs of lesions',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: 'Superficial acne of any extent',
      criteriaDescription: [
        'Superficial acne (comedones, papules, pustules) of any extent',
        'No deep nodules or pus-filled cysts',
      ],
      evidenceNeeded: [
        'Documentation of acne type',
        'Note: Consider rating as scars if significant scarring present',
      ],
    },
  ],

  definitions: {
    deepAcne: {
      term: 'Deep Acne',
      definition: 'Acne characterized by deep inflamed nodules and pus-filled cysts that extend into deeper skin layers.',
    },
    superficialAcne: {
      term: 'Superficial Acne',
      definition: 'Acne limited to the outer skin layers, including comedones (blackheads/whiteheads), papules, and pustules.',
    },
    comedones: {
      term: 'Comedones',
      definition: 'Non-inflamed clogged pores; blackheads (open) or whiteheads (closed).',
    },
    nodules: {
      term: 'Nodules',
      definition: 'Large, solid, painful lesions lodged deep within the skin.',
    },
    cysts: {
      term: 'Cysts',
      definition: 'Deep, pus-filled lesions that can cause scarring.',
    },
  },

  importantNotes: [
    'Deep acne involves nodules and cysts, not just surface-level breakouts',
    '40% threshold applies specifically to face and neck for highest rating',
    'Body acne (non-face/neck) with deep lesions rates at 10%',
    'Alternative rating as disfigurement or scars may be higher',
    'Document treatment history including topical and systemic medications',
  ],

  disclaimer: 'This analysis is based on logged acne symptoms. VA ratings require medical documentation of acne type, severity, and extent of involvement.',
};

// ============================================
// PHASE 6A: CHLORACNE CRITERIA (DC 7829)
// ============================================

export const CHLORACNE_CRITERIA = {
  diagnosticCode: '7829',
  condition: 'Chloracne',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7829',

  note: 'Chloracne is an Agent Orange presumptive condition. Rating criteria are similar to acne but include additional consideration for intertriginous areas. Must manifest within one year of last herbicide exposure for presumptive service connection.',

  ratings: [
    {
      percent: 30,
      summary: 'Deep chloracne affecting 40% or more of face and neck',
      criteriaDescription: [
        'Deep acne (deep inflamed nodules and pus-filled cysts)',
        'Affecting 40 percent or more of the face and neck',
      ],
      evidenceNeeded: [
        'Documentation of herbicide/dioxin exposure',
        'Medical documentation of deep chloracne',
        'Documentation that 40%+ of face and neck is affected',
        'Evidence of onset within one year of exposure',
      ],
    },
    {
      percent: 20,
      summary: 'Deep chloracne affecting intertriginous areas',
      criteriaDescription: [
        'Deep acne (deep inflamed nodules and pus-filled cysts)',
        'Affecting intertriginous areas: axilla (armpit), anogenital region, skin folds of breasts, or between digits',
      ],
      evidenceNeeded: [
        'Documentation of chloracne in skin fold areas',
        'Medical records identifying intertriginous involvement',
        'Exposure history documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Deep chloracne affecting less than 40% of face/neck OR non-intertriginous body areas',
      criteriaDescription: [
        'Deep acne affecting less than 40% of the face and neck, OR',
        'Deep acne affecting non-intertriginous areas of the body (other than face and neck)',
      ],
      evidenceNeeded: [
        'Documentation of deep chloracne',
        'Documentation of affected areas',
        'Exposure history',
      ],
    },
    {
      percent: 0,
      summary: 'Superficial chloracne of any extent',
      criteriaDescription: [
        'Superficial acne (comedones, papules, pustules) of any extent',
        'No deep nodules or pus-filled cysts',
      ],
      evidenceNeeded: [
        'Documentation of chloracne type',
        'Note: Consider rating as scars or disfigurement',
      ],
    },
  ],

  definitions: {
    chloracne: {
      term: 'Chloracne',
      definition: 'A skin condition caused by exposure to dioxins, chlorinated compounds, or herbicides (including Agent Orange). Characterized by acne-like lesions.',
    },
    intertriginousAreas: {
      term: 'Intertriginous Areas',
      definition: 'Skin fold areas where skin contacts skin: axilla (armpits), anogenital region, skin folds of breasts, or between fingers/toes.',
    },
    agentOrange: {
      term: 'Agent Orange',
      definition: 'An herbicide used during the Vietnam War containing dioxin. Exposure is presumed for veterans who served in Vietnam, Thailand, or certain other locations.',
    },
    presumptiveCondition: {
      term: 'Presumptive Condition',
      definition: 'A condition that VA presumes is related to military service based on scientific/medical evidence, reducing the burden of proof for service connection.',
    },
  },

  importantNotes: [
    'Chloracne is a VA presumptive condition for Agent Orange exposure',
    'Must appear within one year of last herbicide exposure for presumptive service connection',
    'Intertriginous area involvement (20%) is unique to chloracne, not in regular acne criteria',
    'Document exposure history and onset timing',
    'Alternative rating as disfigurement or scars may provide higher rating',
  ],

  disclaimer: 'This analysis is based on logged chloracne symptoms. Chloracne is an Agent Orange presumptive condition. VA ratings require medical documentation and evidence of herbicide exposure.',
};

// ============================================
// PHASE 6A: ALOPECIA AREATA CRITERIA (DC 7831)
// ============================================

export const ALOPECIA_AREATA_CRITERIA = {
  diagnosticCode: '7831',
  condition: 'Alopecia Areata',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7831',

  note: 'Alopecia areata is rated based on extent of hair loss. Only two rating levels exist: 10% for loss of all body hair, and 0% for hair loss limited to scalp and face.',

  ratings: [
    {
      percent: 10,
      summary: 'Loss of all body hair (alopecia universalis)',
      criteriaDescription: [
        'Loss of all body hair',
        'Also known as alopecia universalis',
        'Includes scalp, face, AND all other body areas',
      ],
      evidenceNeeded: [
        'Medical documentation of alopecia areata diagnosis',
        'Documentation of complete body hair loss',
        'Dermatology records confirming extent',
        'Photographs showing hair loss',
      ],
    },
    {
      percent: 0,
      summary: 'Hair loss limited to scalp and face only',
      criteriaDescription: [
        'Hair loss limited to scalp and face',
        'Body hair still present',
        'Includes alopecia totalis (complete scalp loss)',
      ],
      evidenceNeeded: [
        'Documentation of alopecia areata diagnosis',
        'Note extent of hair loss for records',
        'Consider psychological impact for separate rating',
      ],
    },
  ],

  definitions: {
    alopeciaAreata: {
      term: 'Alopecia Areata',
      definition: 'An autoimmune condition causing patchy hair loss on the scalp, face, or body.',
    },
    alopeciaTotalis: {
      term: 'Alopecia Totalis',
      definition: 'Complete loss of all scalp hair (still rates 0% under DC 7831).',
    },
    alopeciaUniversalis: {
      term: 'Alopecia Universalis',
      definition: 'Complete loss of all body hair including scalp, face, eyebrows, eyelashes, and body hair (rates 10%).',
    },
    exclamationPointHairs: {
      term: 'Exclamation Point Hairs',
      definition: 'Short broken hairs that taper at the base, characteristic of active alopecia areata.',
    },
  },

  importantNotes: [
    'Only 10% rating available, and only for complete body hair loss',
    'Scalp-only or face-only hair loss rates 0%',
    'Alopecia totalis (complete scalp loss) still rates 0% without body hair loss',
    'Consider secondary conditions: depression, anxiety for separate ratings',
    'Scarring alopecia (DC 7830) has different criteria based on scalp percentage',
  ],

  disclaimer: 'This analysis is based on logged alopecia symptoms. VA ratings require medical documentation of hair loss extent and diagnosis.',
};

// ============================================
// PHASE 6A: HYPERHIDROSIS CRITERIA (DC 7832)
// ============================================

export const HYPERHIDROSIS_CRITERIA = {
  diagnosticCode: '7832',
  condition: 'Hyperhidrosis',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7832',

  note: 'Hyperhidrosis is rated based on functional impairment and response to therapy. The key criterion is ability to handle paper or tools. Only two rating levels exist: 30% and 0%.',

  ratings: [
    {
      percent: 30,
      summary: 'Unable to handle paper or tools due to moisture, unresponsive to therapy',
      criteriaDescription: [
        'Unable to handle paper or tools because of moisture',
        'Condition is unresponsive to therapy',
        'Both criteria must be met',
      ],
      evidenceNeeded: [
        'Medical documentation of hyperhidrosis diagnosis',
        'Documentation of functional impairment with paper/tools',
        'Treatment records showing therapy attempts',
        'Documentation that condition persists despite treatment',
        'Occupational impact statements',
      ],
    },
    {
      percent: 0,
      summary: 'Able to handle paper or tools after therapy',
      criteriaDescription: [
        'Hyperhidrosis present but controllable with therapy',
        'Able to handle paper or tools after treatment',
      ],
      evidenceNeeded: [
        'Documentation of diagnosis',
        'Treatment records',
        'Note: Document all functional impacts even if controlled',
      ],
    },
  ],

  definitions: {
    hyperhidrosis: {
      term: 'Hyperhidrosis',
      definition: 'A condition characterized by excessive sweating beyond what is needed for thermoregulation.',
    },
    palmarHyperhidrosis: {
      term: 'Palmar Hyperhidrosis',
      definition: 'Excessive sweating of the palms/hands.',
    },
    plantarHyperhidrosis: {
      term: 'Plantar Hyperhidrosis',
      definition: 'Excessive sweating of the soles/feet.',
    },
    axillaryHyperhidrosis: {
      term: 'Axillary Hyperhidrosis',
      definition: 'Excessive sweating of the underarms.',
    },
    iontophoresis: {
      term: 'Iontophoresis',
      definition: 'Treatment using mild electrical current through water to temporarily block sweat glands.',
    },
    sympathectomy: {
      term: 'Sympathectomy',
      definition: 'Surgical procedure to interrupt nerve signals that trigger sweating.',
    },
  },

  importantNotes: [
    'Key criterion is inability to handle paper or tools due to moisture',
    'Must be unresponsive to therapy for 30% rating',
    'Document all treatments tried and their effectiveness',
    'Occupational impact documentation is valuable',
    'Secondary conditions (skin infections, maceration) may warrant separate ratings',
    'Consider impact on daily activities and employment',
  ],

  disclaimer: 'This analysis is based on logged hyperhidrosis symptoms. VA ratings require medical documentation of diagnosis, treatment history, and functional impairment.',
};

// ============================================
// PHASE 6B: GENERAL RATING FORMULA FOR THE SKIN
// Used by DC 7809, 7813, 7815, 7820 (and others)
// ============================================

export const GENERAL_SKIN_FORMULA_CRITERIA = {
  description: 'General Rating Formula for the Skin - applies to multiple skin conditions',
  cfrReference: '38 CFR 4.118',

  ratings: [
    {
      percent: 60,
      summary: '>40% body/exposed areas OR constant systemic therapy',
      criteriaDescription: [
        'Characteristic lesions involving more than 40% of the entire body, OR',
        'More than 40% of exposed areas affected, OR',
        'Constant or near-constant systemic therapy required over past 12 months',
        '(corticosteroids, phototherapy, retinoids, biologics, PUVA, immunosuppressives)',
      ],
      evidenceNeeded: [
        'Medical documentation of body surface area involvement',
        'Prescription records for systemic medications',
        'Treatment duration documentation',
        'Photographs of affected areas',
      ],
    },
    {
      percent: 30,
      summary: '20-40% body/exposed areas OR systemic therapy >=6 weeks',
      criteriaDescription: [
        'Characteristic lesions involving 20-40% of the entire body, OR',
        '20-40% of exposed areas affected, OR',
        'Systemic therapy required >=6 weeks but not constantly over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected body percentage',
        'Treatment records showing systemic therapy duration',
        'Dermatology records',
      ],
    },
    {
      percent: 10,
      summary: '5-20% body/exposed areas OR intermittent systemic therapy <6 weeks',
      criteriaDescription: [
        'Characteristic lesions involving 5-20% of the entire body, OR',
        '5-20% of exposed areas affected, OR',
        'Intermittent systemic therapy <6 weeks over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected areas',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: '<5% body/exposed areas with topical therapy only',
      criteriaDescription: [
        'Characteristic lesions involving less than 5% of entire body, OR',
        'Less than 5% of exposed areas affected',
        'No more than topical therapy required over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of condition presence',
        'Note: May qualify for rating under scars or disfigurement',
      ],
    },
  ],

  definitions: {
    exposedAreas: {
      term: 'Exposed Areas',
      definition: 'Areas normally visible: head, face, neck, hands.',
    },
    systemicTherapy: {
      term: 'Systemic Therapy',
      definition: 'Medications affecting the whole body: oral/injectable corticosteroids, immunosuppressives, biologics, retinoids, phototherapy (PUVA, UVB).',
    },
    topicalTherapy: {
      term: 'Topical Therapy',
      definition: 'Medications applied directly to skin: creams, ointments, lotions.',
    },
    constantTherapy: {
      term: 'Constant/Near-Constant Therapy',
      definition: 'Continuous treatment with minimal breaks over 12-month period.',
    },
  },

  importantNotes: [
    'This formula applies to multiple skin DCs: 7806, 7809, 7813-7816, 7820-7822, 7824',
    'Alternative rating as disfigurement (DC 7800) or scars (DC 7801-7805) may be higher',
    'Document both body surface area AND treatment requirements',
    'Exposed areas and total body are rated the same',
  ],
};

// ============================================
// PHASE 6B: DISCOID LUPUS ERYTHEMATOSUS (DC 7809)
// ============================================

export const DISCOID_LUPUS_CRITERIA = {
  diagnosticCode: '7809',
  condition: 'Discoid Lupus Erythematosus',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7809',

  note: 'Discoid lupus is rated under the General Rating Formula for the Skin. Do NOT combine with ratings under DC 6350 (Systemic Lupus Erythematosus).',

  ratings: [
    {
      percent: 60,
      summary: '>40% body/exposed areas OR constant systemic therapy',
      criteriaDescription: [
        'Discoid lesions involving more than 40% of entire body or exposed areas, OR',
        'Constant or near-constant systemic therapy (corticosteroids, antimalarials, immunosuppressives) over past 12 months',
      ],
      evidenceNeeded: [
        'Dermatology documentation of lesion extent',
        'Body surface area assessment',
        'Prescription records for systemic medications',
        'Photographs documenting involvement',
      ],
    },
    {
      percent: 30,
      summary: '20-40% body/exposed areas OR systemic therapy >=6 weeks',
      criteriaDescription: [
        'Discoid lesions involving 20-40% of entire body or exposed areas, OR',
        'Systemic therapy required >=6 weeks but not constantly over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected percentage',
        'Treatment duration records',
      ],
    },
    {
      percent: 10,
      summary: '5-20% body/exposed areas OR intermittent systemic therapy',
      criteriaDescription: [
        'Discoid lesions involving 5-20% of entire body or exposed areas, OR',
        'Intermittent systemic therapy <6 weeks over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of lesion locations and extent',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: '<5% body/exposed areas with topical therapy only',
      criteriaDescription: [
        'Discoid lesions involving less than 5% of body or exposed areas',
        'Only topical therapy required',
      ],
      evidenceNeeded: [
        'Documentation of diagnosis',
        'Consider scarring/disfigurement for separate rating',
      ],
    },
  ],

  definitions: {
    discoidLupus: {
      term: 'Discoid Lupus Erythematosus',
      definition: 'A chronic autoimmune skin condition causing coin-shaped (discoid) lesions that can cause scarring and pigment changes.',
    },
    discoidLesions: {
      term: 'Discoid Lesions',
      definition: 'Round or oval, scaly, erythematous plaques that may lead to scarring, hyperpigmentation, or hypopigmentation.',
    },
    photosensitivity: {
      term: 'Photosensitivity',
      definition: 'Abnormal skin reaction to sunlight, common in discoid lupus.',
    },
    follicularPlugging: {
      term: 'Follicular Plugging',
      definition: 'Blockage of hair follicles with keratin, seen in discoid lupus lesions.',
    },
  },

  importantNotes: [
    'Do NOT combine with systemic lupus (DC 6350) ratings',
    'Scarring from healed lesions may warrant separate rating under DC 7800-7805',
    'Hair loss from scalp involvement may be rated under DC 7830 (scarring alopecia)',
    'Document photosensitivity and sun protection requirements',
    'Common treatments: hydroxychloroquine, topical steroids, immunosuppressives',
  ],

  disclaimer: 'This analysis is based on logged discoid lupus symptoms. VA ratings require dermatology documentation and assessment of body surface area involvement.',
};

// ============================================
// PHASE 6B: BULLOUS DISORDERS (DC 7815)
// ============================================

export const BULLOUS_DISORDERS_CRITERIA = {
  diagnosticCode: '7815',
  condition: 'Bullous Disorders',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7815',

  note: 'Includes pemphigus vulgaris, pemphigus foliaceous, bullous pemphigoid, dermatitis herpetiformis, epidermolysis bullosa acquisita, Hailey-Hailey, and porphyria cutanea tarda. Rate mucosal complications separately.',

  ratings: [
    {
      percent: 60,
      summary: '>40% body/exposed areas OR constant systemic therapy',
      criteriaDescription: [
        'Bullous lesions involving more than 40% of entire body or exposed areas, OR',
        'Constant or near-constant systemic therapy (corticosteroids, immunosuppressives, biologics) over past 12 months',
      ],
      evidenceNeeded: [
        'Dermatology documentation with biopsy confirmation',
        'Body surface area assessment',
        'Systemic medication records',
        'Photographs of active disease',
      ],
    },
    {
      percent: 30,
      summary: '20-40% body/exposed areas OR systemic therapy >=6 weeks',
      criteriaDescription: [
        'Bullous lesions involving 20-40% of entire body or exposed areas, OR',
        'Systemic therapy required >=6 weeks but not constantly over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of lesion extent',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: '5-20% body/exposed areas OR intermittent systemic therapy',
      criteriaDescription: [
        'Bullous lesions involving 5-20% of entire body or exposed areas, OR',
        'Intermittent systemic therapy <6 weeks over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected areas',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: '<5% body/exposed areas with topical therapy only',
      criteriaDescription: [
        'Bullous lesions involving less than 5% of body or exposed areas',
        'Only topical therapy required',
      ],
      evidenceNeeded: [
        'Documentation of diagnosis',
      ],
    },
  ],

  definitions: {
    bullousDisorders: {
      term: 'Bullous Disorders',
      definition: 'Group of autoimmune conditions causing blistering of skin and/or mucous membranes.',
    },
    pemphigus: {
      term: 'Pemphigus',
      definition: 'Autoimmune blistering where antibodies attack connections between skin cells.',
    },
    bullae: {
      term: 'Bullae',
      definition: 'Large fluid-filled blisters greater than 5mm in diameter.',
    },
    nikolskySign: {
      term: 'Nikolsky Sign',
      definition: 'When slight rubbing causes skin to separate - indicates active pemphigus.',
    },
  },

  importantNotes: [
    'Rate mucosal involvement (ocular, oral, GI, respiratory, GU) SEPARATELY under appropriate DC',
    'Biopsy typically required for definitive diagnosis',
    'These conditions can be life-threatening and require aggressive treatment',
    'Scarring from healed lesions may warrant additional rating',
    'Document infection risks and hospitalizations',
  ],

  disclaimer: 'This analysis is based on logged bullous disorder symptoms. VA ratings require dermatology documentation including biopsy results. Mucosal complications are rated separately.',
};

// ============================================
// PHASE 6B: PRIMARY CUTANEOUS VASCULITIS (DC 7826)
// ============================================

export const CUTANEOUS_VASCULITIS_CRITERIA = {
  diagnosticCode: '7826',
  condition: 'Primary Cutaneous Vasculitis',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7826',

  note: 'Rated by frequency of documented vasculitic episodes and immunosuppressive therapy requirements. Alternative rating as disfigurement or scars may apply.',

  ratings: [
    {
      percent: 60,
      summary: 'Persistent episodes refractory to continuous immunosuppressive therapy',
      criteriaDescription: [
        'Persistent documented vasculitis episodes',
        'Refractory to continuous immunosuppressive therapy',
        'Disease continues despite aggressive treatment',
      ],
      evidenceNeeded: [
        'Medical documentation of persistent vasculitis',
        'Records of continuous immunosuppressive therapy',
        'Documentation of treatment failure/refractory disease',
        'Biopsy results confirming vasculitis',
      ],
    },
    {
      percent: 30,
      summary: '4+ episodes/year requiring intermittent immunosuppressive therapy',
      criteriaDescription: [
        'Recurrent documented vasculitic episodes occurring 4+ times over past 12 months, AND',
        'Requiring intermittent systemic immunosuppressive therapy for control',
      ],
      evidenceNeeded: [
        'Documentation of at least 4 episodes in 12 months',
        'Records of immunosuppressive therapy',
        'Dates and descriptions of each episode',
      ],
    },
    {
      percent: 10,
      summary: '1-3 episodes/year with immunosuppressive OR continuous systemic medication',
      criteriaDescription: [
        '1-3 documented vasculitic episodes over past 12 months requiring intermittent immunosuppressive therapy, OR',
        'No recurrent episodes but requires continuous systemic medication for control',
      ],
      evidenceNeeded: [
        'Documentation of episodes',
        'Medication records',
      ],
    },
  ],

  definitions: {
    cutaneousVasculitis: {
      term: 'Primary Cutaneous Vasculitis',
      definition: 'Inflammation of blood vessels limited to the skin, causing purpura, ulcers, and tissue damage.',
    },
    purpura: {
      term: 'Purpura',
      definition: 'Purple or red discoloration from bleeding under the skin due to vessel inflammation.',
    },
    livedoReticularis: {
      term: 'Livedo Reticularis',
      definition: 'Mottled, net-like purple discoloration of the skin from vascular changes.',
    },
    vasculiticEpisode: {
      term: 'Documented Vasculitic Episode',
      definition: 'A medically documented flare of vasculitis with clinical findings and/or biopsy confirmation.',
    },
  },

  importantNotes: [
    'Episodes must be medically DOCUMENTED for rating purposes',
    'Biopsy confirmation strengthens the claim significantly',
    'Alternative rating as disfigurement (DC 7800) or scars may be higher',
    'Track each episode with dates, symptoms, and treatment',
    'Systemic involvement may warrant additional ratings under other DCs',
  ],

  disclaimer: 'This analysis is based on logged vasculitis symptoms. VA ratings require medical documentation of each vasculitic episode and treatment records.',
};

// ============================================
// PHASE 6B: DERMATOPHYTOSIS (DC 7813)
// ============================================

export const DERMATOPHYTOSIS_CRITERIA = {
  diagnosticCode: '7813',
  condition: 'Dermatophytosis',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7813',

  note: 'Includes ringworm (tinea corporis, capitis, pedis, barbae, cruris), nail fungus (onychomycosis), and tinea versicolor. Rated under General Rating Formula for the Skin.',

  ratings: [
    {
      percent: 60,
      summary: '>40% body/exposed areas OR constant systemic antifungal therapy',
      criteriaDescription: [
        'Fungal infection involving more than 40% of entire body or exposed areas, OR',
        'Constant or near-constant systemic antifungal therapy over past 12 months',
      ],
      evidenceNeeded: [
        'Dermatology documentation of extent',
        'Fungal culture or KOH prep results',
        'Oral antifungal prescription records',
        'Duration of treatment documentation',
      ],
    },
    {
      percent: 30,
      summary: '20-40% body/exposed areas OR systemic therapy >=6 weeks',
      criteriaDescription: [
        'Fungal infection involving 20-40% of entire body or exposed areas, OR',
        'Systemic antifungal therapy >=6 weeks but not constantly over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected areas',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: '5-20% body/exposed areas OR intermittent systemic therapy',
      criteriaDescription: [
        'Fungal infection involving 5-20% of entire body or exposed areas, OR',
        'Intermittent systemic antifungal therapy <6 weeks over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of infection locations',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: '<5% body/exposed areas with topical therapy only',
      criteriaDescription: [
        'Fungal infection involving less than 5% of body or exposed areas',
        'Only topical antifungals required',
      ],
      evidenceNeeded: [
        'Documentation of condition',
      ],
    },
  ],

  definitions: {
    dermatophytosis: {
      term: 'Dermatophytosis',
      definition: 'Fungal infections of skin, hair, or nails caused by dermatophyte fungi.',
    },
    tineaCorporis: {
      term: 'Tinea Corporis',
      definition: 'Ringworm of the body - circular, scaly, itchy patches.',
    },
    tineaPedis: {
      term: 'Tinea Pedis',
      definition: 'Athlete\'s foot - fungal infection between toes and on feet.',
    },
    onychomycosis: {
      term: 'Onychomycosis',
      definition: 'Fungal nail infection causing thickening, discoloration, and crumbling.',
    },
    tineaVersicolor: {
      term: 'Tinea Versicolor',
      definition: 'Yeast overgrowth causing discolored patches on skin.',
    },
  },

  importantNotes: [
    'Nail fungus (onychomycosis) often requires prolonged oral antifungal therapy',
    'Recurrent infections should be documented carefully',
    'Systemic therapy includes oral terbinafine, itraconazole, fluconazole, griseofulvin',
    'Military service in humid environments increases risk',
    'Document treatment failures and recurrences',
  ],

  disclaimer: 'This analysis is based on logged dermatophytosis symptoms. VA ratings require documentation of fungal infection extent and treatment requirements.',
};

// ============================================
// PHASE 6B: SKIN INFECTIONS (DC 7820)
// ============================================

export const SKIN_INFECTIONS_CRITERIA = {
  diagnosticCode: '7820',
  condition: 'Skin Infections',
  cfrReference: '38 CFR 4.118, Diagnostic Code 7820',

  note: 'Covers bacterial, fungal, viral, treponemal, and parasitic skin infections not listed elsewhere. Rated under General Rating Formula for the Skin.',

  ratings: [
    {
      percent: 60,
      summary: '>40% body/exposed areas OR constant systemic therapy',
      criteriaDescription: [
        'Skin infection involving more than 40% of entire body or exposed areas, OR',
        'Constant or near-constant systemic therapy (antibiotics, antivirals, etc.) over past 12 months',
      ],
      evidenceNeeded: [
        'Medical documentation of infection extent',
        'Culture results if available',
        'Systemic medication records',
        'Hospitalization records if applicable',
      ],
    },
    {
      percent: 30,
      summary: '20-40% body/exposed areas OR systemic therapy >=6 weeks',
      criteriaDescription: [
        'Skin infection involving 20-40% of entire body or exposed areas, OR',
        'Systemic therapy >=6 weeks but not constantly over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of affected areas',
        'Treatment duration records',
      ],
    },
    {
      percent: 10,
      summary: '5-20% body/exposed areas OR intermittent systemic therapy',
      criteriaDescription: [
        'Skin infection involving 5-20% of entire body or exposed areas, OR',
        'Intermittent systemic therapy <6 weeks over past 12 months',
      ],
      evidenceNeeded: [
        'Documentation of infections',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: '<5% body/exposed areas with topical therapy only',
      criteriaDescription: [
        'Skin infection involving less than 5% of body or exposed areas',
        'Only topical therapy required',
      ],
      evidenceNeeded: [
        'Documentation of condition',
      ],
    },
  ],

  definitions: {
    cellulitis: {
      term: 'Cellulitis',
      definition: 'Bacterial infection of deep skin layers causing redness, swelling, warmth, and pain.',
    },
    abscess: {
      term: 'Abscess',
      definition: 'Localized collection of pus from bacterial infection.',
    },
    folliculitis: {
      term: 'Folliculitis',
      definition: 'Infection of hair follicles causing red bumps or pustules.',
    },
    herpesZoster: {
      term: 'Herpes Zoster (Shingles)',
      definition: 'Reactivation of varicella-zoster virus causing painful blistering rash.',
    },
    impetigo: {
      term: 'Impetigo',
      definition: 'Contagious bacterial skin infection with honey-colored crusted sores.',
    },
  },

  importantNotes: [
    'Recurrent infections (same site or multiple sites) strengthen claims',
    'Document each infection episode with dates and treatment',
    'Post-herpetic neuralgia from shingles may warrant separate neurological rating',
    'MRSA or resistant infections may require prolonged therapy',
    'Consider underlying immune issues if infections are frequent',
  ],

  disclaimer: 'This analysis is based on logged skin infection symptoms. VA ratings require medical documentation of infection type, extent, and treatment requirements.',
};

// ============================================
// PHASE 7A: EYE CONDITIONS CRITERIA
// ============================================

// GENERAL RATING FORMULA FOR DISEASES OF THE EYE
// Used by: DC 6000 (Uveitis), DC 6001 (Keratitis), DC 6002 (Scleritis), DC 6018 (Conjunctivitis)
// Per 38 CFR 4.79

export const SYSTEMIC_LUPUS_CRITERIA = {
  diagnosticCode: '6350',
  condition: 'Systemic Lupus Erythematosus (SLE)',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6350',

  note: 'Evaluate this condition either by combining the evaluations for residuals under the appropriate body systems, OR by evaluating under DC 6350, whichever method results in a higher evaluation. Do NOT combine with ratings under DC 7809 (Discoid Lupus Erythematosus).',

  ratings: [
    {
      percent: 100,
      summary: 'Acute, with frequent exacerbations, producing severe impairment of health',
      criteria: {
        acuteDisease: true,
        frequentExacerbations: true,
        severeHealthImpairment: true,
      },
      criteriaDescription: [
        'Active, acute disease process',
        'Frequent exacerbations (flares) occurring regularly',
        'Severe impairment of overall health',
        'May include major organ involvement (kidneys, heart, lungs, CNS)',
        'Significant functional limitations',
      ],
      evidenceNeeded: [
        'Rheumatology records documenting frequent flares',
        'Hospitalization records for SLE complications',
        'Lab work showing active disease (complement levels, anti-dsDNA)',
        'Documentation of major organ involvement',
        'Functional capacity assessment',
        'Medication records showing aggressive treatment',
      ],
    },
    {
      percent: 60,
      summary: 'Exacerbations lasting a week or more, 2 or 3 times per year',
      criteria: {
        exacerbationsPerYear: '2-3',
        exacerbationDuration: '>=1 week',
      },
      criteriaDescription: [
        'Exacerbations (flares) occurring 2 to 3 times per year',
        'Each exacerbation lasts at least one week',
        'Flares cause significant symptoms requiring treatment adjustment',
        'May require increased medication or temporary steroid bursts',
      ],
      evidenceNeeded: [
        'Documentation of 2-3 flares per year',
        'Records showing each flare lasted >=1 week',
        'Treatment records during flares',
        'Lab work during active flares vs remission',
        'Symptom diary documenting flare duration',
      ],
    },
    {
      percent: 10,
      summary: 'Exacerbations once or twice a year or symptomatic during the past 2 years',
      criteria: {
        exacerbationsPerYear: '1-2',
        orSymptomaticPast2Years: true,
      },
      criteriaDescription: [
        'Option 1: Exacerbations (flares) once or twice per year, OR',
        'Option 2: Symptomatic (any symptoms) during the past 2 years',
        'Generally controlled with medication',
        'Mild to moderate impact on daily activities',
      ],
      evidenceNeeded: [
        'Documentation of SLE diagnosis',
        'Records of 1-2 flares per year OR ongoing symptoms',
        'Treatment records (hydroxychloroquine, low-dose steroids)',
        'Lab monitoring results',
      ],
    },
  ],

  definitions: {
    exacerbation: {
      term: 'Exacerbation (Flare)',
      definition: 'A period of increased disease activity with worsening symptoms. SLE flares can affect any organ system and typically require increased treatment.',
      examples: [
        'New or worsening rash',
        'Increased joint pain and swelling',
        'Fever and fatigue',
        'New organ involvement',
        'Abnormal lab values (low complement, high anti-dsDNA)',
      ],
    },
    severeHealthImpairment: {
      term: 'Severe Impairment of Health',
      definition: 'Disease activity causing significant impact on overall health and function, often with major organ involvement or frequent hospitalizations.',
      examples: [
        'Lupus nephritis (kidney involvement)',
        'Neuropsychiatric lupus',
        'Severe cytopenias requiring treatment',
        'Pleuritis or pericarditis',
        'Frequent hospitalizations',
      ],
    },
    organInvolvement: {
      term: 'Major Organ Involvement',
      definition: 'SLE affecting vital organs beyond skin and joints.',
      examples: [
        'Kidneys (lupus nephritis) - proteinuria, hematuria, elevated creatinine',
        'Heart (pericarditis, myocarditis, endocarditis)',
        'Lungs (pleuritis, pneumonitis, pulmonary hypertension)',
        'Brain/CNS (seizures, psychosis, cognitive dysfunction)',
        'Blood (hemolytic anemia, thrombocytopenia, leukopenia)',
      ],
    },
    malarRash: {
      term: 'Malar (Butterfly) Rash',
      definition: 'Characteristic facial rash across the cheeks and bridge of nose, sparing the nasolabial folds. A hallmark sign of SLE.',
    },
    photosensitivity: {
      term: 'Photosensitivity',
      definition: 'Abnormal skin reaction to sunlight, causing rash or triggering flares. Common in SLE patients.',
    },
    lupusNephritis: {
      term: 'Lupus Nephritis',
      definition: 'Kidney inflammation caused by SLE. Can lead to kidney failure if untreated. Classified by WHO Class I-VI.',
    },
    antinuclearAntibody: {
      term: 'ANA (Antinuclear Antibody)',
      definition: 'Blood test positive in ~95% of SLE patients. Used for diagnosis but not disease activity.',
    },
    antiDsDNA: {
      term: 'Anti-dsDNA Antibody',
      definition: 'Antibody specific to SLE, often correlates with disease activity, especially kidney involvement.',
    },
    complement: {
      term: 'Complement Levels (C3, C4)',
      definition: 'Blood proteins that decrease during active SLE. Low complement often indicates active disease.',
    },
  },

  importantNotes: [
    'SLE can be rated under DC 6350 OR by combining ratings for affected body systems - use whichever method gives the HIGHER rating',
    'Do NOT combine with Discoid Lupus (DC 7809) ratings',
    'Major organ involvement may warrant separate ratings: kidneys (7500s), heart (7000s), lungs (6600s), neurological (8000s)',
    'Lupus nephritis alone can result in high ratings under renal codes',
    'Document flare frequency, duration, and severity carefully',
    'Maintain lab records showing disease activity (ANA, anti-dsDNA, complement)',
    'SLE is a presumptive condition if manifested within 1 year of discharge at 10%+',
  ],

  presumptiveInfo: {
    oneYearPresumptive: true,
    description: 'Lupus erythematosus is presumptively service-connected if manifested to a compensable degree within one year of discharge.',
  },

  secondaryConditions: {
    description: 'SLE is a systemic autoimmune disease that can affect virtually any organ system. Each affected organ system may be rated separately if it results in a higher combined rating than DC 6350 alone.',

    categories: {
      renal: {
        name: 'Kidney Complications',
        conditions: [
          {
            manifestation: 'Lupus Nephritis',
            suggestedDCs: ['7541', '7530'],
            dcDescriptions: ['Renal involvement in systemic disease', 'Chronic renal disease'],
            nexusStrength: 'strong',
            notes: 'Lupus nephritis is common and can lead to kidney failure. Document proteinuria, GFR, creatinine.',
            documentationTips: ['Kidney biopsy results if done', '24-hour urine protein', 'GFR tracking', 'Nephrology records'],
          },
        ],
      },
      cardiovascular: {
        name: 'Cardiovascular Complications',
        conditions: [
          {
            manifestation: 'Pericarditis',
            suggestedDCs: ['7002'],
            dcDescriptions: ['Pericarditis'],
            nexusStrength: 'strong',
            notes: 'Inflammation of the heart lining. Document chest pain and echocardiogram findings.',
            documentationTips: ['Echocardiogram', 'EKG changes', 'Cardiology evaluation'],
          },
          {
            manifestation: 'Coronary Artery Disease (Accelerated)',
            suggestedDCs: ['7005'],
            dcDescriptions: ['Arteriosclerotic heart disease'],
            nexusStrength: 'moderate',
            notes: 'SLE accelerates atherosclerosis. Document cardiac workup.',
            documentationTips: ['Stress test', 'Cardiac catheterization if done', 'Cardiac imaging'],
          },
          {
            manifestation: 'Raynaud\'s Phenomenon',
            suggestedDCs: ['7117'],
            dcDescriptions: ['Raynaud\'s syndrome'],
            nexusStrength: 'strong',
            notes: 'Common in SLE. Document frequency and severity of attacks.',
            documentationTips: ['Photo documentation', 'Attack frequency log', 'Document digital ulcers if present'],
          },
        ],
      },
      respiratory: {
        name: 'Respiratory Complications',
        conditions: [
          {
            manifestation: 'Pleuritis (Pleurisy)',
            suggestedDCs: ['6845'],
            dcDescriptions: ['Chronic pleural effusion or fibrosis'],
            nexusStrength: 'strong',
            notes: 'Inflammation of lung lining causing chest pain. Document imaging.',
            documentationTips: ['Chest X-ray', 'CT scan', 'Document pleuritic chest pain'],
          },
          {
            manifestation: 'Pulmonary Hypertension',
            suggestedDCs: ['6846'],
            dcDescriptions: ['Pulmonary arterial hypertension'],
            nexusStrength: 'moderate',
            notes: 'Serious complication. Document right heart catheterization if done.',
            documentationTips: ['Echocardiogram', 'Right heart cath', 'PFTs'],
          },
        ],
      },
      neurological: {
        name: 'Neurological Complications',
        conditions: [
          {
            manifestation: 'Neuropsychiatric Lupus (Seizures, Psychosis)',
            suggestedDCs: ['8911', '9210'],
            dcDescriptions: ['Epilepsy/seizures', 'Psychotic disorder'],
            nexusStrength: 'strong',
            notes: 'CNS involvement is serious. Document neurology evaluation.',
            documentationTips: ['Neurology records', 'MRI brain', 'EEG if seizures', 'Psychiatry evaluation'],
          },
          {
            manifestation: 'Cognitive Dysfunction ("Lupus Fog")',
            suggestedDCs: ['9326', '8045'],
            dcDescriptions: ['Dementia', 'TBI residuals'],
            nexusStrength: 'moderate',
            notes: 'Common symptom. Document neuropsychological testing.',
            documentationTips: ['Neuropsych testing', 'Document cognitive complaints', 'Impact on work/daily activities'],
          },
          {
            manifestation: 'Peripheral Neuropathy',
            suggestedDCs: ['8520'],
            dcDescriptions: ['Sciatic nerve / peripheral neuropathy'],
            nexusStrength: 'moderate',
            notes: 'Document EMG/nerve conduction studies.',
            documentationTips: ['EMG results', 'Document numbness/tingling', 'Neurology evaluation'],
          },
        ],
      },
      hematologic: {
        name: 'Blood Disorders',
        conditions: [
          {
            manifestation: 'Hemolytic Anemia',
            suggestedDCs: ['7714'],
            dcDescriptions: ['Hemolytic anemia'],
            nexusStrength: 'strong',
            notes: 'Autoimmune destruction of red blood cells. Document hemoglobin and Coombs test.',
            documentationTips: ['CBC with reticulocyte count', 'Coombs test', 'Haptoglobin, LDH'],
          },
          {
            manifestation: 'Thrombocytopenia (Low Platelets)',
            suggestedDCs: ['7705'],
            dcDescriptions: ['Thrombocytopenia'],
            nexusStrength: 'strong',
            notes: 'Increased bleeding risk. Document platelet counts.',
            documentationTips: ['Serial platelet counts', 'Bleeding episodes', 'Treatment records'],
          },
          {
            manifestation: 'Leukopenia (Low White Blood Cells)',
            suggestedDCs: ['7700'],
            dcDescriptions: ['Agranulocytosis'],
            nexusStrength: 'strong',
            notes: 'Increased infection risk. Document WBC counts.',
            documentationTips: ['CBC with differential', 'Infection history'],
          },
        ],
      },
      musculoskeletal: {
        name: 'Musculoskeletal Complications',
        conditions: [
          {
            manifestation: 'Lupus Arthritis',
            suggestedDCs: ['5002'],
            dcDescriptions: ['Rheumatoid arthritis (analogous)'],
            nexusStrength: 'strong',
            notes: 'Non-erosive arthritis affecting multiple joints.',
            documentationTips: ['Joint examination', 'X-rays', 'Document joint involvement'],
          },
          {
            manifestation: 'Avascular Necrosis (from steroid use)',
            suggestedDCs: ['5250-5255'],
            dcDescriptions: ['Hip/joint codes'],
            nexusStrength: 'moderate',
            notes: 'Bone death from long-term steroid use. Common in hips.',
            documentationTips: ['MRI of affected joint', 'Document steroid history', 'Orthopedic evaluation'],
          },
        ],
      },
      mentalHealth: {
        name: 'Mental Health',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Very common in chronic illness. Document mental health treatment.',
            documentationTips: ['Mental health records', 'PHQ-9 scores', 'Medication records'],
          },
          {
            manifestation: 'Anxiety',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Generalized anxiety disorder'],
            nexusStrength: 'strong',
            notes: 'Common due to chronic unpredictable disease.',
            documentationTips: ['GAD-7 scores', 'Treatment records'],
          },
        ],
      },
      dermatologic: {
        name: 'Skin Manifestations',
        conditions: [
          {
            manifestation: 'Skin Lesions / Rashes (Not Discoid)',
            suggestedDCs: ['7806'],
            dcDescriptions: ['Dermatitis or eczema (general skin formula)'],
            nexusStrength: 'strong',
            notes: 'Rate under general skin formula if not discoid type. Do NOT combine with DC 6350.',
            documentationTips: ['Document body surface area', 'Treatment records', 'Photo documentation'],
          },
          {
            manifestation: 'Alopecia (Hair Loss)',
            suggestedDCs: ['7831'],
            dcDescriptions: ['Alopecia areata'],
            nexusStrength: 'moderate',
            notes: 'Common during flares. Document extent.',
            documentationTips: ['Photo documentation', 'Document scalp involvement percentage'],
          },
        ],
      },
    },

    importantNotes: [
      'Calculate ratings BOTH ways: DC 6350 alone vs. combining all affected systems',
      'Use whichever method gives the HIGHER total rating',
      'Do NOT combine DC 6350 with DC 7809 (Discoid Lupus)',
      'Each affected organ system should be documented separately',
      'Maintain lab records showing disease activity',
      'Document all medications and side effects (especially steroids)',
    ],

    documentationStrategy: [
      'Regular rheumatology follow-ups',
      'Lab monitoring: CBC, CMP, urinalysis, ANA, anti-dsDNA, complement levels',
      'Document EVERY flare with dates, symptoms, and duration',
      'Keep detailed medication records including steroid doses',
      'Specialist evaluations for each affected organ system',
      'Functional capacity documentation',
    ],
  },

  disclaimer: 'This analysis is based on logged SLE symptoms. VA ratings require rheumatology documentation, lab work, and assessment of organ involvement. Consider calculating combined rating for affected body systems vs. DC 6350 alone.',
};

// -----------------------------------------
// ACTIVE PULMONARY TUBERCULOSIS (DC 6730)
// -----------------------------------------

export const AVITAMINOSIS_CRITERIA = {
  diagnosticCode: '6313',
  condition: 'Avitaminosis (Vitamin Deficiency)',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6313',

  note: 'Avitaminosis covers vitamin A, B, C, or D deficiencies. Ocular manifestations (e.g., night blindness) are also rated here. Rate Vitamin E deficiency under neuropathy codes. Rate Vitamin K deficiency under clotting disorders (e.g., DC 7705).',

  ratings: [
    {
      percent: 100,
      summary: 'Marked mental changes, moist dermatitis, inability to retain adequate nourishment, exhaustion, and cachexia',
      criteria: {
        markedMentalChanges: true,
        moistDermatitis: true,
        inabilityRetainNourishment: true,
        exhaustion: true,
        cachexia: true,
      },
      criteriaDescription: [
        'Marked mental changes (confusion, dementia, psychosis)',
        'Moist dermatitis',
        'Inability to retain adequate nourishment',
        'Exhaustion',
        'Cachexia (severe wasting)',
        'ALL symptoms must be present',
      ],
      evidenceNeeded: [
        'Psychiatric or neurological evaluation documenting mental changes',
        'Dermatology evaluation documenting moist dermatitis',
        'Documentation of inability to maintain nutrition',
        'Weight records showing significant wasting',
        'Lab work showing vitamin deficiency levels',
      ],
    },
    {
      percent: 60,
      summary: 'All of stomatitis + diarrhea + dermatitis PLUS mental symptoms AND impaired bodily vigor',
      criteria: {
        stomatitis: true,
        diarrhea: true,
        symmetricalDermatitis: true,
        mentalSymptoms: true,
        impairedBodilyVigor: true,
      },
      criteriaDescription: [
        'All of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Diarrhea',
        '- Symmetrical dermatitis',
        'PLUS mental symptoms',
        'PLUS impaired bodily vigor (weakness, fatigue)',
      ],
      evidenceNeeded: [
        'Documentation of stomatitis',
        'Diarrhea frequency logs',
        'Dermatitis documentation with distribution',
        'Mental health symptoms documented',
        'Functional impairment documentation',
      ],
    },
    {
      percent: 40,
      summary: 'With stomatitis, diarrhea, AND symmetrical dermatitis',
      criteria: {
        stomatitis: true,
        diarrhea: true,
        symmetricalDermatitis: true,
      },
      criteriaDescription: [
        'All three of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Diarrhea',
        '- Symmetrical dermatitis',
      ],
      evidenceNeeded: [
        'Documentation of stomatitis',
        'Diarrhea logs',
        'Dermatitis documentation showing symmetrical distribution',
      ],
    },
    {
      percent: 20,
      summary: 'With stomatitis, OR achlorhydria, OR diarrhea',
      criteria: {
        stomatitisOrAchlorhydriaOrDiarrhea: true,
      },
      criteriaDescription: [
        'Any ONE of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Achlorhydria (lack of stomach acid)',
        '- Diarrhea',
      ],
      evidenceNeeded: [
        'Documentation of any one of the listed symptoms',
        'GI evaluation for achlorhydria if applicable',
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis with nonspecific symptoms',
      criteria: {
        confirmedDiagnosis: true,
        nonspecificSymptoms: true,
      },
      criteriaDescription: [
        'Confirmed diagnosis of vitamin deficiency',
        'With nonspecific symptoms such as:',
        '- Decreased appetite',
        '- Weight loss',
        '- Abdominal discomfort',
        '- Weakness',
        '- Inability to concentrate',
        '- Irritability',
      ],
      evidenceNeeded: [
        'Lab work confirming vitamin deficiency',
        'Documented symptoms',
      ],
    },
  ],

  definitions: {
    avitaminosis: {
      term: 'Avitaminosis',
      definition: 'A condition caused by vitamin deficiency. Can affect multiple body systems depending on which vitamin is deficient.',
    },
    stomatitis: {
      term: 'Stomatitis',
      definition: 'Inflammation of the mouth and lips, often with sores, redness, and pain.',
    },
    achlorhydria: {
      term: 'Achlorhydria',
      definition: 'Absence or severe reduction of hydrochloric acid in gastric secretions, affecting digestion.',
    },
    cachexia: {
      term: 'Cachexia',
      definition: 'Severe weight loss and muscle wasting, often with weakness and loss of appetite. A sign of severe illness.',
    },
    symmetricalDermatitis: {
      term: 'Symmetrical Dermatitis',
      definition: 'Skin inflammation that appears in matching locations on both sides of the body (e.g., both hands, both forearms).',
    },
  },

  vitaminDeficiencyTypes: {
    vitaminA: {
      name: 'Vitamin A Deficiency',
      symptoms: ['Night blindness', 'Dry eyes', 'Skin changes', 'Immune dysfunction'],
      note: 'Ocular manifestations rated under DC 6313. Keratitis/keratomalacia rated under DC 6001.',
    },
    vitaminB: {
      name: 'Vitamin B Complex Deficiencies',
      symptoms: ['Neurological symptoms', 'Anemia', 'Skin changes', 'Fatigue'],
      note: 'B1 (Thiamine) deficiency is Beriberi (DC 6314). B3 (Niacin) deficiency is Pellagra (DC 6315). B12 deficiency rated under DC 7722.',
    },
    vitaminC: {
      name: 'Vitamin C Deficiency (Scurvy)',
      symptoms: ['Bleeding gums', 'Easy bruising', 'Slow wound healing', 'Fatigue', 'Joint pain'],
      note: 'Rated under DC 6313.',
    },
    vitaminD: {
      name: 'Vitamin D Deficiency',
      symptoms: ['Bone pain', 'Muscle weakness', 'Fatigue', 'Depression'],
      note: 'Rated under DC 6313.',
    },
  },

  importantNotes: [
    'This code covers vitamins A, B, C, and D deficiencies',
    'Vitamin E deficiency is rated under peripheral neuropathy codes',
    'Vitamin K deficiency is rated under clotting disorder codes (DC 7705)',
    'B12 deficiency/pernicious anemia has its own code (DC 7722)',
    'Document lab values showing vitamin deficiency',
    'May be secondary to malabsorption, bariatric surgery, or other GI conditions',
  ],

  disclaimer: 'This analysis is based on logged avitaminosis symptoms. VA ratings require confirmed laboratory diagnosis and documentation of symptom severity.',
};


// -----------------------------------------
// DC 6314: BERIBERI (Thiamine/B1 Deficiency)
// -----------------------------------------

export const BERIBERI_CRITERIA = {
  diagnosticCode: '6314',
  condition: 'Beriberi (Thiamine/B1 Deficiency)',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6314',

  note: 'Rate as active disease. Thereafter, rate residuals under the appropriate body system (cardiac for wet beriberi, neurological for dry beriberi).',

  ratings: [
    {
      percent: 100,
      summary: 'Active disease with CHF, anasarca, or Wernicke-Korsakoff syndrome',
      criteria: {
        activeDisease: true,
        chfOrAnasarcaOrWernickeKorsakoff: true,
      },
      criteriaDescription: [
        'Active beriberi with any of:',
        '- Congestive heart failure (wet beriberi)',
        '- Anasarca (severe generalized edema)',
        '- Wernicke-Korsakoff syndrome (neurological emergency)',
      ],
      evidenceNeeded: [
        'Cardiology evaluation for CHF',
        'Documentation of generalized edema',
        'Neurology evaluation for Wernicke-Korsakoff',
        'Lab work showing thiamine deficiency',
        'Hospitalization records if applicable',
      ],
    },
    {
      percent: 60,
      summary: 'Active disease with cardiomegaly OR peripheral neuropathy with footdrop or muscle atrophy',
      criteria: {
        activeDisease: true,
        cardiomegalyOrSevereNeuropathy: true,
      },
      criteriaDescription: [
        'Active beriberi with:',
        '- Cardiomegaly (enlarged heart), OR',
        '- Peripheral neuropathy with footdrop, OR',
        '- Peripheral neuropathy with atrophy of thigh or calf muscles',
      ],
      evidenceNeeded: [
        'Imaging showing cardiomegaly',
        'Neurology evaluation documenting footdrop',
        'Physical exam documenting muscle atrophy',
        'EMG/nerve conduction studies if performed',
      ],
    },
    {
      percent: 30,
      summary: 'Active disease with neuropathy (absent reflexes, sensation loss) OR general symptoms',
      criteria: {
        activeDisease: true,
        moderateNeuropathyOrGeneralSymptoms: true,
      },
      criteriaDescription: [
        'Active beriberi with:',
        '- Peripheral neuropathy with absent knee or ankle jerks AND loss of sensation, OR',
        '- Symptoms such as:',
        '  • Weakness',
        '  • Fatigue',
        '  • Anorexia',
        '  • Dizziness',
        '  • Heaviness and stiffness of legs',
        '  • Headache',
        '  • Sleep disturbance',
      ],
      evidenceNeeded: [
        'Neurological exam showing absent reflexes',
        'Sensory testing documentation',
        'Symptom logs',
        'Lab work confirming thiamine deficiency',
      ],
    },
  ],

  definitions: {
    beriberi: {
      term: 'Beriberi',
      definition: 'Disease caused by thiamine (vitamin B1) deficiency. Affects the cardiovascular system (wet beriberi) and/or nervous system (dry beriberi).',
    },
    wetBeriberi: {
      term: 'Wet Beriberi',
      definition: 'Form affecting the cardiovascular system, causing heart failure, edema, and fluid retention.',
    },
    dryBeriberi: {
      term: 'Dry Beriberi',
      definition: 'Form affecting the nervous system, causing peripheral neuropathy, weakness, and muscle wasting.',
    },
    wernickeKorsakoff: {
      term: 'Wernicke-Korsakoff Syndrome',
      definition: 'Severe thiamine deficiency affecting the brain. Wernicke encephalopathy (acute): confusion, ataxia, eye movement abnormalities. Korsakoff psychosis (chronic): severe memory impairment, confabulation.',
    },
    anasarca: {
      term: 'Anasarca',
      definition: 'Severe generalized edema (swelling) throughout the body due to fluid retention.',
    },
    footdrop: {
      term: 'Footdrop',
      definition: 'Inability to lift the front part of the foot due to nerve or muscle damage, causing dragging while walking.',
    },
  },

  causesOfThiamineDeficiency: [
    'Chronic alcoholism (most common in developed countries)',
    'Malnutrition',
    'Bariatric surgery',
    'Chronic dialysis',
    'HIV/AIDS',
    'Malabsorption syndromes',
    'Hyperemesis gravidarum',
    'Prolonged IV nutrition without thiamine',
  ],

  importantNotes: [
    'After resolution of active disease, rate residuals under appropriate body system',
    'Cardiac residuals rated under cardiovascular codes',
    'Neuropathy residuals rated under peripheral nerve codes',
    'Wernicke-Korsakoff may have permanent cognitive effects',
    'Document thiamine levels before treatment starts',
    'Common in veterans with alcohol use disorder',
  ],

  disclaimer: 'This analysis is based on logged beriberi symptoms. VA ratings require confirmed thiamine deficiency and documentation of cardiac or neurological involvement.',
};


// -----------------------------------------
// DC 6315: PELLAGRA (Niacin/B3 Deficiency)
// -----------------------------------------

export const PELLAGRA_CRITERIA = {
  diagnosticCode: '6315',
  condition: 'Pellagra (Niacin/B3 Deficiency)',
  cfrReference: '38 CFR 4.88b, Diagnostic Code 6315',

  note: 'Pellagra is characterized by the "4 Ds": Dermatitis, Diarrhea, Dementia, and (if untreated) Death. The rating schedule mirrors that of Avitaminosis (DC 6313).',

  ratings: [
    {
      percent: 100,
      summary: 'Marked mental changes, moist dermatitis, inability to retain adequate nourishment, exhaustion, and cachexia',
      criteria: {
        markedMentalChanges: true,
        moistDermatitis: true,
        inabilityRetainNourishment: true,
        exhaustion: true,
        cachexia: true,
      },
      criteriaDescription: [
        'Marked mental changes (dementia, psychosis, confusion)',
        'Moist dermatitis',
        'Inability to retain adequate nourishment',
        'Exhaustion',
        'Cachexia (severe wasting)',
        'ALL symptoms must be present',
      ],
      evidenceNeeded: [
        'Psychiatric or neurological evaluation documenting dementia/mental changes',
        'Dermatology evaluation documenting moist dermatitis',
        'Documentation of inability to maintain nutrition',
        'Weight records showing significant wasting',
        'Lab work showing niacin deficiency',
      ],
    },
    {
      percent: 60,
      summary: 'All of stomatitis + diarrhea + dermatitis PLUS mental symptoms AND impaired bodily vigor',
      criteria: {
        stomatitis: true,
        diarrhea: true,
        symmetricalDermatitis: true,
        mentalSymptoms: true,
        impairedBodilyVigor: true,
      },
      criteriaDescription: [
        'All of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Diarrhea',
        '- Symmetrical dermatitis',
        'PLUS mental symptoms (irritability, depression, confusion)',
        'PLUS impaired bodily vigor (weakness, fatigue)',
      ],
      evidenceNeeded: [
        'Documentation of stomatitis',
        'Diarrhea frequency logs',
        'Dermatitis documentation with distribution',
        'Mental health symptoms documented',
        'Functional impairment documentation',
      ],
    },
    {
      percent: 40,
      summary: 'With stomatitis, diarrhea, AND symmetrical dermatitis',
      criteria: {
        stomatitis: true,
        diarrhea: true,
        symmetricalDermatitis: true,
      },
      criteriaDescription: [
        'All three of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Diarrhea',
        '- Symmetrical dermatitis',
      ],
      evidenceNeeded: [
        'Documentation of stomatitis',
        'Diarrhea logs',
        'Dermatitis documentation showing symmetrical distribution',
      ],
    },
    {
      percent: 20,
      summary: 'With stomatitis, OR achlorhydria, OR diarrhea',
      criteria: {
        stomatitisOrAchlorhydriaOrDiarrhea: true,
      },
      criteriaDescription: [
        'Any ONE of the following:',
        '- Stomatitis (mouth inflammation)',
        '- Achlorhydria (lack of stomach acid)',
        '- Diarrhea',
      ],
      evidenceNeeded: [
        'Documentation of any one of the listed symptoms',
        'GI evaluation for achlorhydria if applicable',
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis with nonspecific symptoms',
      criteria: {
        confirmedDiagnosis: true,
        nonspecificSymptoms: true,
      },
      criteriaDescription: [
        'Confirmed diagnosis of pellagra',
        'With nonspecific symptoms such as:',
        '- Decreased appetite',
        '- Weight loss',
        '- Abdominal discomfort',
        '- Weakness',
        '- Inability to concentrate',
        '- Irritability',
      ],
      evidenceNeeded: [
        'Lab work confirming niacin deficiency',
        'Documented symptoms',
      ],
    },
  ],

  definitions: {
    pellagra: {
      term: 'Pellagra',
      definition: 'Disease caused by niacin (vitamin B3) deficiency. Characterized by the "4 Ds": Dermatitis, Diarrhea, Dementia, and Death (if untreated).',
    },
    casalNecklace: {
      term: 'Casal Necklace',
      definition: 'Classic pellagra skin finding: a ring of scaly, pigmented skin around the neck, resembling a necklace. Pathognomonic (definitive) for pellagra.',
    },
    glossitis: {
      term: 'Glossitis',
      definition: 'Inflammation of the tongue, causing swelling, redness, and a smooth appearance. Common in pellagra.',
    },
    photosensitiveDermatitis: {
      term: 'Photosensitive Dermatitis',
      definition: 'Skin inflammation that occurs or worsens with sun exposure. In pellagra, affects sun-exposed areas (face, neck, hands, arms).',
    },
    stomatitis: {
      term: 'Stomatitis',
      definition: 'Inflammation of the mouth and lips, often with sores, redness, and pain.',
    },
    cachexia: {
      term: 'Cachexia',
      definition: 'Severe weight loss and muscle wasting, often with weakness and loss of appetite.',
    },
  },

  causesOfNiacinDeficiency: [
    'Chronic alcoholism',
    'Malnutrition/inadequate diet',
    'Anorexia nervosa',
    'Malabsorption syndromes (Crohn\'s, celiac)',
    'Carcinoid syndrome (tryptophan diverted from niacin synthesis)',
    'Hartnup disease (genetic disorder)',
    'Isoniazid therapy (TB medication)',
    'Prolonged diarrhea',
  ],

  importantNotes: [
    'Pellagra rating schedule is identical to Avitaminosis (DC 6313)',
    'Classic presentation: Dermatitis + Diarrhea + Dementia',
    'Casal necklace is pathognomonic (diagnostic) for pellagra',
    'Photosensitive dermatitis is key feature - document sun-exposed areas',
    'Mental changes can range from irritability to frank dementia',
    'Common in veterans with alcohol use disorder',
    'May occur secondary to carcinoid syndrome',
  ],

  disclaimer: 'This analysis is based on logged pellagra symptoms. VA ratings require confirmed niacin deficiency and documentation of the classic triad.',
};

// ============================================
// MISSING CRITERIA OBJECTS - PHASE COMPLETION
// Added to synchronize CONDITIONS with CRITERIA
// ============================================

// ============================================
// VULVA/CLITORIS DISEASE CRITERIA (DC 7610)
// Uses General Rating Formula for DC 7610-7615
// ============================================

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
      SKIN_ENDOCRINE_CONDITIONS.DIABETES.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
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

    // Check if this could qualify for higher
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

    // Check if this actually needs insulin
    if (poorControl) {
      gaps.push('Poor control despite oral medication - may need insulin therapy');
      gaps.push('Discuss with healthcare provider if insulin should be started');
    }
  }
  else if (latestHbA1c && latestHbA1c >= 6.5) {
    // Has diabetes diagnosis (HbA1c >=6.5%) but medication not documented
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

export const analyzeHypothyroidismLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'hypo-fatigue', 'hypo-cold-intolerance', 'hypo-weight-gain',
    'hypo-depression', 'hypo-muscle-weakness', 'hypo-constipation', 'hypo-dry-skin'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No hypothyroidism logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging hypothyroidism symptoms including fatigue, cold intolerance, and other symptoms'],
    };
  }

  const fatigueLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hypo-fatigue');
  const coldLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hypo-cold-intolerance');
  const depressionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hypo-depression');
  const weaknessLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hypo-muscle-weakness');

  const evidence = [];
  if (fatigueLogs.length > 0) evidence.push(`${fatigueLogs.length} fatigue episodes logged`);
  if (coldLogs.length > 0) evidence.push(`${coldLogs.length} cold intolerance episodes logged`);
  if (depressionLogs.length > 0) evidence.push(`${depressionLogs.length} depression/mental fog episodes logged`);
  if (weaknessLogs.length > 0) evidence.push(`${weaknessLogs.length} muscle weakness episodes logged`);

  // Check for myxedema criteria (all 4 symptom categories)
  const hasAllMyxedemaSymptoms = coldLogs.length > 0 && weaknessLogs.length > 0 && depressionLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (hasAllMyxedemaSymptoms && relevantLogs.length >= 50) {
    supportedRating = '30-100';
    ratingRationale = [
      'Multiple myxedema symptom categories documented',
      'Severe symptoms may support 100% rating if myxedema diagnosed',
      '30% is standard rating for hypothyroidism without myxedema',
    ];
    gaps.push('Obtain medical documentation if myxedema is present');
  } else {
    supportedRating = 30;
    ratingRationale = [
      'Hypothyroidism symptoms documented',
      '30% is standard rating for hypothyroidism without myxedema',
      'This rating continues for 6 months after diagnosis, then rate residuals',
    ];
  }

  gaps.push('Document cardiovascular effects (low BP, slow heart rate) if present');
  gaps.push('Track lab values (TSH, T4) when available');

  return {
    hasData: true,
    condition: 'Hypothyroidism',
    diagnosticCode: '7903',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: HYPOTHYROIDISM_CRITERIA,
    disclaimer: HYPOTHYROIDISM_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 3A: ENDOCRINE ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze Hyperthyroidism/Graves' Disease symptom logs
 * DC 7900 - 38 CFR 4.119
 */

export const analyzeHyperthyroidismLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPERTHYROIDISM.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hyperthyroidism/Graves\' Disease',
      diagnosticCode: '7900',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging hyperthyroidism symptoms including rapid heartbeat, weight loss, tremor, and heat intolerance'],
      metrics: {},
    };
  }

  // Categorize symptoms
  const cardiacSymptoms = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hyper-rapid-heartbeat'
  );
  const metabolicSymptoms = relevantLogs.filter(log =>
      ['hyper-weight-loss', 'hyper-heat-intolerance', 'hyper-sweating', 'hyper-appetite-increase'].includes(getLogSymptomId(log))
  );
  const neurologicSymptoms = relevantLogs.filter(log =>
      ['hyper-tremor', 'hyper-anxiety', 'hyper-irritability', 'hyper-sleep-difficulty'].includes(getLogSymptomId(log))
  );
  const muscleSymptoms = relevantLogs.filter(log =>
      ['hyper-fatigue', 'hyper-muscle-weakness'].includes(getLogSymptomId(log))
  );
  const eyeSymptoms = relevantLogs.filter(log =>
      ['graves-eye-bulging', 'graves-eye-irritation', 'graves-double-vision', 'graves-eye-pain', 'graves-light-sensitivity'].includes(getLogSymptomId(log))
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Determine rating - Hyperthyroidism gets 30% for 6 months, then rate residuals
  let supportedRating = 30;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push(`${relevantLogs.length} hyperthyroidism symptoms logged in ${days} days`);
  ratingRationale.push('Initial 30% rating applies for 6 months after diagnosis');

  if (cardiacSymptoms.length > 0) {
    ratingRationale.push(`${cardiacSymptoms.length} cardiac symptoms (rapid/irregular heartbeat) - may warrant separate evaluation under DC 7008`);
  }

  if (eyeSymptoms.length > 0) {
    ratingRationale.push(`${eyeSymptoms.length} Graves' eye symptoms documented - may warrant separate evaluation under eye DCs`);
    gaps.push('Obtain ophthalmology evaluation for Graves\' eye disease - separately ratable');
  }

  if (metabolicSymptoms.length > 0) {
    ratingRationale.push(`Metabolic symptoms documented: weight loss, heat intolerance, sweating`);
  }

  if (neurologicSymptoms.length > 0) {
    ratingRationale.push(`Neurological symptoms documented: tremor, anxiety, sleep difficulty`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);
  ratingRationale.push('After 6 months, rate residuals under appropriate diagnostic codes');

  // Documentation gaps
  if (cardiacSymptoms.length === 0) {
    gaps.push('Document cardiac symptoms (rapid heartbeat, palpitations) if present - separately ratable');
  }
  if (eyeSymptoms.length === 0) {
    gaps.push('Document eye symptoms (bulging, double vision, irritation) if present - separately ratable');
  }
  gaps.push('Track thyroid lab values (TSH, T3, T4) when available');
  gaps.push('Document any hospitalizations or thyroid storm episodes');

  return {
    hasData: true,
    condition: 'Hyperthyroidism/Graves\' Disease',
    diagnosticCode: '7900',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      cardiacSymptoms: cardiacSymptoms.length,
      metabolicSymptoms: metabolicSymptoms.length,
      neurologicSymptoms: neurologicSymptoms.length,
      muscleSymptoms: muscleSymptoms.length,
      eyeSymptoms: eyeSymptoms.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      hasGravesEyeDisease: eyeSymptoms.length > 0,
    },
    criteria: HYPERTHYROIDISM_CRITERIA,
  };
};

/**
 * Analyze Thyroiditis symptom logs
 * DC 7906 - 38 CFR 4.119
 */

export const analyzeThyroiditisLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.THYROIDITIS.symptomIds;

  // Also check for hyper/hypo symptoms that indicate thyroid dysfunction phase
  const hyperSymptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPERTHYROIDISM.symptomIds;
  const hypoSymptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPOTHYROIDISM.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Also get hyper/hypo logs to determine phase
  const hyperLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && hyperSymptomIds.includes(symptomId);
  });

  const hypoLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && hypoSymptomIds.includes(symptomId);
  });

  const allRelevantLogs = [...relevantLogs, ...hyperLogs, ...hypoLogs];

  if (relevantLogs.length === 0 && hyperLogs.length === 0 && hypoLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Thyroiditis',
      diagnosticCode: '7906',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging thyroiditis symptoms including neck pain, swelling, and thyroid dysfunction symptoms'],
      metrics: {},
    };
  }

  // Categorize thyroiditis-specific symptoms
  const neckSymptoms = relevantLogs.filter(log =>
      ['thyroiditis-neck-pain', 'thyroiditis-swelling', 'thyroiditis-difficulty-swallowing'].includes(getLogSymptomId(log))
  );
  const hyperPhaseMarkers = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'thyroiditis-hyper-phase'
  );
  const hypoPhaseMarkers = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'thyroiditis-hypo-phase'
  );

  // Calculate average severity
  const severities = allRelevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Determine phase and rating
  let supportedRating = 0;
  let currentPhase = 'euthyroid';
  const ratingRationale = [];
  const gaps = [];

  // Determine predominant phase
  if (hyperPhaseMarkers.length > hypoPhaseMarkers.length || hyperLogs.length > hypoLogs.length) {
    currentPhase = 'hyperthyroid';
    supportedRating = 30;
    ratingRationale.push('Thyroiditis manifesting as hyperthyroidism - rated under DC 7900');
    ratingRationale.push('30% rating for hyperthyroid phase');
  } else if (hypoPhaseMarkers.length > hyperPhaseMarkers.length || hypoLogs.length > hyperLogs.length) {
    currentPhase = 'hypothyroid';
    supportedRating = 30;
    ratingRationale.push('Thyroiditis manifesting as hypothyroidism - rated under DC 7903');
    ratingRationale.push('30% rating for hypothyroid phase (without myxedema)');
  } else {
    currentPhase = 'euthyroid';
    supportedRating = 0;
    ratingRationale.push('Thyroiditis with normal thyroid function (euthyroid)');
    ratingRationale.push('0% rating when thyroid function is normal');
  }

  ratingRationale.push(`${allRelevantLogs.length} total symptoms logged in ${days} days`);

  if (neckSymptoms.length > 0) {
    ratingRationale.push(`${neckSymptoms.length} neck/thyroid symptoms (pain, swelling, difficulty swallowing)`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Documentation gaps
  gaps.push('Document current thyroid function status (hyper, hypo, or normal)');
  gaps.push('Track thyroid lab values (TSH, T3, T4) to establish phase');
  if (currentPhase === 'euthyroid') {
    gaps.push('Log hyperthyroid or hypothyroid symptoms if they develop');
  }

  return {
    hasData: true,
    condition: 'Thyroiditis',
    diagnosticCode: '7906',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: allRelevantLogs.length,
      thyroiditisSpecificLogs: relevantLogs.length,
      hyperLogs: hyperLogs.length,
      hypoLogs: hypoLogs.length,
      neckSymptoms: neckSymptoms.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      currentPhase,
    },
    criteria: THYROIDITIS_CRITERIA,
  };
};

/**
 * Analyze Hyperparathyroidism symptom logs
 * DC 7904 - 38 CFR 4.119
 */

export const analyzeHyperparathyroidismLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPERPARATHYROIDISM.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hyperparathyroidism',
      diagnosticCode: '7904',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging hyperparathyroidism symptoms including fatigue, bone pain, kidney stones, and GI symptoms'],
      metrics: {},
    };
  }

  // Categorize symptoms - "Stones, Bones, Groans, and Moans"
  const kidneySymptoms = relevantLogs.filter(log =>
      ['hpth-kidney-stones', 'hpth-excessive-thirst', 'hpth-frequent-urination'].includes(getLogSymptomId(log))
  );
  const boneSymptoms = relevantLogs.filter(log =>
      ['hpth-bone-pain', 'hpth-fracture', 'hpth-muscle-weakness'].includes(getLogSymptomId(log))
  );
  const giSymptoms = relevantLogs.filter(log =>
      ['hpth-abdominal-pain', 'hpth-nausea', 'hpth-constipation', 'hpth-anorexia'].includes(getLogSymptomId(log))
  );
  const neuroSymptoms = relevantLogs.filter(log =>
      ['hpth-confusion', 'hpth-depression', 'hpth-fatigue'].includes(getLogSymptomId(log))
  );
  const fractureLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hpth-fracture'
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Determine rating based on symptoms
  let supportedRating = 0;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push(`${relevantLogs.length} hyperparathyroidism symptoms logged in ${days} days`);

  // Check for hypercalcemia indicators (60% criteria)
  const hasHypercalcemiaIndicators = fractureLogs.length > 0 ||
      (kidneySymptoms.length >= 3 && boneSymptoms.length >= 2);

  // Check for persistent symptoms (10% criteria)
  const hasPersistentSymptoms = giSymptoms.length > 0 || neuroSymptoms.length > 0;

  if (hasHypercalcemiaIndicators) {
    supportedRating = 60;
    ratingRationale.push('Symptoms suggest significant hypercalcemia');
    if (fractureLogs.length > 0) {
      ratingRationale.push('Fragility fracture documented - supports 60% rating');
    }
    ratingRationale.push('60% rating requires lab confirmation: Ca >12 mg/dL, creatinine clearance <60, or T-score <-2.5');
  } else if (hasPersistentSymptoms) {
    supportedRating = 10;
    ratingRationale.push('Persistent symptoms (fatigue, anorexia, nausea, constipation) documented');
    ratingRationale.push('10% rating for symptoms despite treatment or requiring continuous medication');
  } else {
    supportedRating = 0;
    ratingRationale.push('Minimal symptoms documented - may be asymptomatic');
    ratingRationale.push('0% rating if asymptomatic and controlled');
  }

  // Add symptom category details
  if (kidneySymptoms.length > 0) {
    ratingRationale.push(`Kidney symptoms: ${kidneySymptoms.length} (stones, thirst, urination)`);
  }
  if (boneSymptoms.length > 0) {
    ratingRationale.push(`Bone symptoms: ${boneSymptoms.length} (pain, weakness, fractures)`);
  }
  if (giSymptoms.length > 0) {
    ratingRationale.push(`GI symptoms: ${giSymptoms.length} (abdominal pain, nausea, constipation)`);
  }
  if (neuroSymptoms.length > 0) {
    ratingRationale.push(`Neuropsychiatric symptoms: ${neuroSymptoms.length} (confusion, depression, fatigue)`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Documentation gaps
  gaps.push('Document calcium levels and other lab values when available');
  gaps.push('Obtain bone density (DEXA) scan results - T-score <-2.5 supports higher rating');
  if (kidneySymptoms.length > 0) {
    gaps.push('Document creatinine clearance if kidney involvement present');
  }
  gaps.push('Note if surgery performed or if continuous medication required');

  return {
    hasData: true,
    condition: 'Hyperparathyroidism',
    diagnosticCode: '7904',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      kidneySymptoms: kidneySymptoms.length,
      boneSymptoms: boneSymptoms.length,
      giSymptoms: giSymptoms.length,
      neuroSymptoms: neuroSymptoms.length,
      hasFracture: fractureLogs.length > 0,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
    },
    criteria: HYPERPARATHYROIDISM_CRITERIA,
  };
};

/**
 * Analyze Hypoparathyroidism symptom logs
 * DC 7905 - 38 CFR 4.119
 */

export const analyzeHypoparathyroidismLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPOPARATHYROIDISM.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hypoparathyroidism',
      diagnosticCode: '7905',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging hypoparathyroidism symptoms including muscle cramps, tingling, spasms, and fatigue'],
      metrics: {},
    };
  }

  // Categorize symptoms
  const neuromuscularSymptoms = relevantLogs.filter(log =>
      ['hopth-muscle-cramps', 'hopth-tingling', 'hopth-muscle-spasms'].includes(getLogSymptomId(log))
  );
  const neuropsychSymptoms = relevantLogs.filter(log =>
      ['hopth-seizures', 'hopth-depression', 'hopth-anxiety', 'hopth-memory-problems'].includes(getLogSymptomId(log))
  );
  const integumentarySymptoms = relevantLogs.filter(log =>
      ['hopth-dry-skin', 'hopth-brittle-nails', 'hopth-hair-loss'].includes(getLogSymptomId(log))
  );
  const otherSymptoms = relevantLogs.filter(log =>
      ['hopth-fatigue', 'hopth-cataracts'].includes(getLogSymptomId(log))
  );
  const seizureLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hopth-seizures'
  );
  const cataractLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'hopth-cataracts'
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Hypoparathyroidism gets 100% for 3 months, then rate residuals
  // Since we can't determine diagnosis date, we note both options
  let supportedRating = 100;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push(`${relevantLogs.length} hypoparathyroidism symptoms logged in ${days} days`);
  ratingRationale.push('Initial 100% rating applies for 3 months after diagnosis');
  ratingRationale.push('After 3 months, rate chronic residuals under appropriate codes');

  // Document symptom categories
  if (neuromuscularSymptoms.length > 0) {
    ratingRationale.push(`${neuromuscularSymptoms.length} neuromuscular symptoms (cramps, tingling, spasms/tetany)`);
  }

  if (seizureLogs.length > 0) {
    ratingRationale.push(`${seizureLogs.length} seizure episodes documented - rate separately under DC 8910-8914`);
  }

  if (cataractLogs.length > 0) {
    ratingRationale.push('Cataracts documented - rate separately under eye diagnostic codes');
  }

  if (neuropsychSymptoms.length > 0) {
    ratingRationale.push(`${neuropsychSymptoms.length} neuropsychiatric symptoms (depression, anxiety, memory issues)`);
  }

  if (integumentarySymptoms.length > 0) {
    ratingRationale.push(`${integumentarySymptoms.length} integumentary symptoms (dry skin, brittle nails, hair loss)`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Documentation gaps
  gaps.push('Document diagnosis date to determine if within initial 3-month period');
  gaps.push('Track calcium and PTH lab values when available');
  if (seizureLogs.length > 0) {
    gaps.push('Seizures from hypocalcemia may be separately rated - document all episodes');
  }
  if (cataractLogs.length > 0) {
    gaps.push('Obtain ophthalmology evaluation for cataracts - separately ratable');
  }
  gaps.push('Document any kidney complications (nephrolithiasis)');
  gaps.push('Note if cardiac involvement present (CHF) - separately ratable');

  return {
    hasData: true,
    condition: 'Hypoparathyroidism',
    diagnosticCode: '7905',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      neuromuscularSymptoms: neuromuscularSymptoms.length,
      neuropsychSymptoms: neuropsychSymptoms.length,
      integumentarySymptoms: integumentarySymptoms.length,
      hasSeizures: seizureLogs.length > 0,
      hasCataracts: cataractLogs.length > 0,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
    },
    criteria: HYPOPARATHYROIDISM_CRITERIA,
  };
};

// ============================================
// PHASE 3B: ADRENAL & PITUITARY ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze Addison's Disease symptom logs
 * DC 7911 - 38 CFR 4.119
 */

export const analyzeAddisonsDiseaseLog = (logs, options = {}) => {
  const { days = 365 } = options; // Use 365 days for crisis/episode counting

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.ADDISONS_DISEASE.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: "Addison's Disease",
      diagnosticCode: '7911',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging Addison\'s disease symptoms including crises, episodes, fatigue, and other symptoms'],
      metrics: {},
    };
  }

  // Count crises and episodes (most critical for rating)
  const crisisLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'addisons-crisis'
  );
  const episodeLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'addisons-episode'
  );

  // Other symptom categories
  const fatigueWeaknessLogs = relevantLogs.filter(log =>
      ['addisons-fatigue', 'addisons-muscle-weakness'].includes(getLogSymptomId(log))
  );
  const giSymptomLogs = relevantLogs.filter(log =>
      ['addisons-nausea', 'addisons-abdominal-pain'].includes(getLogSymptomId(log))
  );
  const cardiovascularLogs = relevantLogs.filter(log =>
      ['addisons-hypotension', 'addisons-dizziness'].includes(getLogSymptomId(log))
  );
  const skinLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'addisons-hyperpigmentation'
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  const crisisCount = crisisLogs.length;
  const episodeCount = episodeLogs.length;

  // Determine rating based on crisis/episode frequency
  let supportedRating = 0;
  const ratingRationale = [];
  const gaps = [];

  if (crisisCount >= 4) {
    supportedRating = 60;
    ratingRationale.push(`${crisisCount} adrenal crises documented in past year`);
    ratingRationale.push('4+ crises per year supports 60% rating');
  } else if (crisisCount >= 3 || episodeCount >= 5) {
    supportedRating = 40;
    if (crisisCount >= 3) {
      ratingRationale.push(`${crisisCount} adrenal crises documented in past year`);
    }
    if (episodeCount >= 5) {
      ratingRationale.push(`${episodeCount} adrenal episodes documented in past year`);
    }
    ratingRationale.push('3 crises OR 5+ episodes supports 40% rating');
  } else if (crisisCount >= 1 || episodeCount >= 2 || fatigueWeaknessLogs.length > 0) {
    supportedRating = 20;
    if (crisisCount >= 1) {
      ratingRationale.push(`${crisisCount} adrenal crisis documented in past year`);
    }
    if (episodeCount >= 2) {
      ratingRationale.push(`${episodeCount} adrenal episodes documented in past year`);
    }
    if (fatigueWeaknessLogs.length > 0) {
      ratingRationale.push(`Weakness and fatigability documented (${fatigueWeaknessLogs.length} logs)`);
    }
    ratingRationale.push('1-2 crises OR 2-4 episodes OR weakness/fatigue supports 20% rating');
  } else {
    supportedRating = 20;
    ratingRationale.push('Symptoms documented - minimum 20% if on corticosteroid therapy');
  }

  ratingRationale.push(`${relevantLogs.length} total symptoms logged in past ${days} days`);
  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Add symptom category details
  if (cardiovascularLogs.length > 0) {
    ratingRationale.push(`Cardiovascular symptoms: ${cardiovascularLogs.length} (hypotension, dizziness)`);
  }
  if (giSymptomLogs.length > 0) {
    ratingRationale.push(`GI symptoms: ${giSymptomLogs.length} (nausea, abdominal pain)`);
  }
  if (skinLogs.length > 0) {
    ratingRationale.push('Hyperpigmentation documented');
  }

  // Documentation gaps
  if (crisisCount === 0 && episodeCount === 0) {
    gaps.push('Document any adrenal crises or episodes with detailed descriptions');
  }
  gaps.push('Note if currently on corticosteroid replacement therapy');
  gaps.push('Document any emergency room visits or hospitalizations for adrenal insufficiency');
  if (crisisCount > 0) {
    gaps.push('For crises: document vital signs, treatments required, and recovery time');
  }

  return {
    hasData: true,
    condition: "Addison's Disease",
    diagnosticCode: '7911',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      crisisCount,
      episodeCount,
      fatigueWeaknessLogs: fatigueWeaknessLogs.length,
      giSymptomLogs: giSymptomLogs.length,
      cardiovascularLogs: cardiovascularLogs.length,
      hasHyperpigmentation: skinLogs.length > 0,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      evaluationPeriodDays: days,
    },
    criteria: ADDISONS_DISEASE_CRITERIA,
  };
};

/**
 * Analyze Cushing's Syndrome symptom logs
 * DC 7907 - 38 CFR 4.119
 */

export const analyzeCushingsSyndromeLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.CUSHINGS_SYNDROME.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: "Cushing's Syndrome",
      diagnosticCode: '7907',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging Cushing\'s syndrome symptoms including weight changes, skin changes, and muscle weakness'],
      metrics: {},
    };
  }

  // Key symptom categories for rating determination
  const cushingoidFeatures = relevantLogs.filter(log =>
      ['cushings-moon-face', 'cushings-buffalo-hump', 'cushings-striae',
        'cushings-weight-gain', 'cushings-thin-skin', 'cushings-bruising'].includes(getLogSymptomId(log))
  );

  const muscleWastingLogs = relevantLogs.filter(log =>
      ['cushings-muscle-weakness', 'cushings-muscle-wasting'].includes(getLogSymptomId(log))
  );

  const metabolicLogs = relevantLogs.filter(log =>
      ['cushings-hypertension', 'cushings-glucose', 'cushings-osteoporosis'].includes(getLogSymptomId(log))
  );

  const otherLogs = relevantLogs.filter(log =>
      ['cushings-fatigue', 'cushings-mood', 'cushings-insomnia',
        'cushings-infections', 'cushings-acne', 'cushings-hirsutism',
        'cushings-menstrual', 'cushings-erectile'].includes(getLogSymptomId(log))
  );

  // Check for specific 100% criteria components
  const hasOsteoporosis = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-osteoporosis');
  const hasHypertension = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-hypertension');
  const hasSevereMuscleWasting = muscleWastingLogs.length >= 3 ||
      muscleWastingLogs.some(log => (log.severity || 5) >= 8);

  // Check for 30% criteria components
  const hasStriae = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-striae');
  const hasMoonFace = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-moon-face');
  const hasWeightGain = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-weight-gain');
  const hasGlucoseIntolerance = relevantLogs.some(log => getLogSymptomId(log) === 'cushings-glucose');
  const hasVascularFragility = relevantLogs.some(log =>
      ['cushings-thin-skin', 'cushings-bruising'].includes(getLogSymptomId(log))
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Determine rating
  let supportedRating = 0;
  const ratingRationale = [];
  const gaps = [];

  // Check for 100% rating (most severe)
  if (hasOsteoporosis && hasHypertension && hasSevereMuscleWasting) {
    supportedRating = 100;
    ratingRationale.push('Active progressive disease documented with:');
    ratingRationale.push('- Osteoporosis/bone involvement');
    ratingRationale.push('- Hypertension');
    ratingRationale.push('- Severe proximal muscle wasting');
    ratingRationale.push('100% rating for active progressive disease with all three findings');
  }
  // Check for 60% rating
  else if (hasSevereMuscleWasting) {
    supportedRating = 60;
    ratingRationale.push('Proximal muscle wasting documented');
    ratingRationale.push(`${muscleWastingLogs.length} muscle weakness/wasting symptoms logged`);
    ratingRationale.push('60% rating for muscle wasting causing functional limitations');
  }
  // Check for 30% rating (classic Cushingoid features)
  else if (cushingoidFeatures.length >= 2) {
    supportedRating = 30;
    ratingRationale.push('Classic Cushingoid features documented:');
    if (hasStriae) ratingRationale.push('- Striae (stretch marks)');
    if (hasWeightGain) ratingRationale.push('- Central obesity');
    if (hasMoonFace) ratingRationale.push('- Moon face');
    if (hasGlucoseIntolerance) ratingRationale.push('- Glucose intolerance');
    if (hasVascularFragility) ratingRationale.push('- Vascular fragility/easy bruising');
    ratingRationale.push('30% rating for typical Cushingoid presentation');
  } else {
    supportedRating = 30;
    ratingRationale.push('Cushing\'s syndrome symptoms documented');
    ratingRationale.push('Minimum 30% rating applies for 6 months after diagnosis');
  }

  ratingRationale.push(`${relevantLogs.length} total symptoms logged in ${days} days`);
  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);
  ratingRationale.push('Note: Ratings continue for 6 months after diagnosis, then rate residuals');

  // Documentation gaps
  if (!hasSevereMuscleWasting) {
    gaps.push('Document any difficulty rising from chair, climbing stairs, or raising arms');
  }
  if (!hasOsteoporosis) {
    gaps.push('Document any bone density issues or fractures');
  }
  if (!hasHypertension) {
    gaps.push('Track and document blood pressure readings');
  }
  if (!hasGlucoseIntolerance) {
    gaps.push('Document any blood sugar abnormalities');
  }
  gaps.push('Note diagnosis date to determine if within initial 6-month period');

  return {
    hasData: true,
    condition: "Cushing's Syndrome",
    diagnosticCode: '7907',
    cfrReference: '38 CFR 4.119',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      cushingoidFeatures: cushingoidFeatures.length,
      muscleWastingLogs: muscleWastingLogs.length,
      metabolicLogs: metabolicLogs.length,
      hasOsteoporosis,
      hasHypertension,
      hasSevereMuscleWasting,
      hasStriae,
      hasMoonFace,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
    },
    criteria: CUSHINGS_SYNDROME_CRITERIA,
  };
};

/**
 * Analyze Diabetes Insipidus symptom logs
 * DC 7909 - 38 CFR 4.119
 */

export const analyzeDiabetesInsipidusLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.DIABETES_INSIPIDUS.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Diabetes Insipidus',
      diagnosticCode: '7909',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging diabetes insipidus symptoms including excessive urination and thirst'],
      metrics: {},
    };
  }

  // Key symptom categories
  const polyuriaLogs = relevantLogs.filter(log =>
      ['di-polyuria', 'di-nocturia'].includes(getLogSymptomId(log))
  );
  const polydipsiaLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'di-polydipsia'
  );
  const dehydrationLogs = relevantLogs.filter(log =>
      ['di-dehydration', 'di-dizziness', 'di-headache'].includes(getLogSymptomId(log))
  );
  const otherLogs = relevantLogs.filter(log =>
      ['di-fatigue', 'di-muscle-cramps', 'di-constipation', 'di-weight-loss'].includes(getLogSymptomId(log))
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Check for persistent polyuria (key criterion for 10% after initial period)
  const hasPersistentPolyuria = polyuriaLogs.length >= 5; // Multiple logs suggest persistence

  // Determine rating
  let supportedRating = 30;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push(`${relevantLogs.length} diabetes insipidus symptoms logged in ${days} days`);
  ratingRationale.push('Initial 30% rating applies for 3 months after diagnosis');

  if (hasPersistentPolyuria) {
    ratingRationale.push(`Persistent polyuria documented (${polyuriaLogs.length} polyuria/nocturia logs)`);
    ratingRationale.push('After initial 3 months: 10% for persistent polyuria or continuous therapy');
    supportedRating = '30/10'; // Indicate both possible ratings
  } else {
    ratingRationale.push('After 3 months, if condition subsides, rate residuals under appropriate codes');
  }

  if (polydipsiaLogs.length > 0) {
    ratingRationale.push(`Polydipsia (excessive thirst) documented: ${polydipsiaLogs.length} logs`);
  }

  if (dehydrationLogs.length > 0) {
    ratingRationale.push(`Dehydration-related symptoms: ${dehydrationLogs.length} logs`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Documentation gaps
  gaps.push('Document diagnosis date to determine rating period');
  gaps.push('Note if on continuous hormonal therapy (desmopressin/DDAVP)');
  if (polyuriaLogs.length < 3) {
    gaps.push('Document frequency and volume of urination');
  }
  gaps.push('Track fluid intake and urine output if possible');

  return {
    hasData: true,
    condition: 'Diabetes Insipidus',
    diagnosticCode: '7909',
    cfrReference: '38 CFR 4.119',
    supportedRating: 30, // Default to initial rating
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      polyuriaLogs: polyuriaLogs.length,
      polydipsiaLogs: polydipsiaLogs.length,
      dehydrationLogs: dehydrationLogs.length,
      hasPersistentPolyuria,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
    },
    criteria: DIABETES_INSIPIDUS_CRITERIA,
  };
};

/**
 * Analyze Hyperaldosteronism symptom logs
 * DC 7917 - 38 CFR 4.119
 */

export const analyzeHyperaldosteronismLogs = (logs, options = {}) => {
  const { days = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPERALDOSTERONISM.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date || log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hyperaldosteronism',
      diagnosticCode: '7917',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging hyperaldosteronism symptoms including hypertension, muscle weakness, and fatigue'],
      metrics: {},
    };
  }

  // Key symptom categories
  const hypertensionLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'haldo-hypertension'
  );
  const hypokalemiaLogs = relevantLogs.filter(log =>
      ['haldo-muscle-weakness', 'haldo-muscle-cramps', 'haldo-numbness',
        'haldo-palpitations', 'haldo-constipation'].includes(getLogSymptomId(log))
  );
  const otherLogs = relevantLogs.filter(log =>
      ['haldo-fatigue', 'haldo-headaches', 'haldo-polyuria',
        'haldo-polydipsia', 'haldo-mood'].includes(getLogSymptomId(log))
  );

  // Calculate average severity
  const severities = relevantLogs.map(log => log.severity || 5).filter(s => s > 0);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  // Hyperaldosteronism is rated as neoplasm or by residuals
  // Most common residual is hypertension - guide to rate under DC 7101
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push(`${relevantLogs.length} hyperaldosteronism symptoms logged in ${days} days`);
  ratingRationale.push('Per VA: Evaluate as benign or malignant neoplasm as appropriate');
  ratingRationale.push('For benign cases, rate residuals under appropriate diagnostic codes');

  if (hypertensionLogs.length > 0) {
    ratingRationale.push(`Hypertension documented (${hypertensionLogs.length} logs) - rate under DC 7101`);
  }

  if (hypokalemiaLogs.length > 0) {
    ratingRationale.push(`Hypokalemia symptoms: ${hypokalemiaLogs.length} (weakness, cramps, numbness, palpitations)`);
  }

  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);
  ratingRationale.push('Primary residual (hypertension) rated separately under cardiovascular codes');

  // Documentation gaps
  gaps.push('Document blood pressure readings for hypertension rating');
  gaps.push('Note potassium levels when available');
  gaps.push('Document if benign adenoma (Conn\'s syndrome) or other cause');
  if (hypertensionLogs.length === 0) {
    gaps.push('Track and log blood pressure - primary manifestation for rating');
  }

  return {
    hasData: true,
    condition: 'Hyperaldosteronism',
    diagnosticCode: '7917',
    cfrReference: '38 CFR 4.119',
    supportedRating: 0, // Rated via residuals
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      hypertensionLogs: hypertensionLogs.length,
      hypokalemiaLogs: hypokalemiaLogs.length,
      otherLogs: otherLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
    },
    criteria: HYPERALDOSTERONISM_CRITERIA,
  };
};

/**
 * Analyze Raynaud's symptom logs
 */

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
    return logDate >= cutoffDate && getLogSymptomId(log) === 'psoriasis-flare';
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
    return logDate >= cutoffDate && getLogSymptomId(log) === 'eczema-flare';
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

export const analyzeAcneLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.ACNE.symptomIds;

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
      condition: 'Acne',
      diagnosticCode: '7828',
      message: 'No acne symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms - Superficial types
  const comedonesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-superficial-comedones');
  const papulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-superficial-papules');
  const pustulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-superficial-pustules');

  // Categorize symptoms - Deep types
  const nodulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-deep-nodules');
  const cystsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-deep-cysts');

  // Location/extent
  const faceNeckUnder40Logs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-face-neck-under40');
  const faceNeck40PlusLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-face-neck-40plus');
  const bodyOtherLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-body-other');

  // Complications
  const scarringLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-scarring');
  const disfigurementLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'acne-disfigurement');

  // Treatment logs
  const treatmentLogs = relevantLogs.filter(log =>
      ['acne-topical-treatment', 'acne-oral-antibiotics', 'acne-isotretinoin', 'acne-hormonal-therapy'].includes(getLogSymptomId(log))
  );

  // Determine key indicators
  const hasDeepAcne = nodulesLogs.length > 0 || cystsLogs.length > 0;
  const hasSuperficialOnly = !hasDeepAcne && (comedonesLogs.length > 0 || papulesLogs.length > 0 || pustulesLogs.length > 0);
  const hasFaceNeck40Plus = faceNeck40PlusLogs.length > 0;
  const hasFaceNeckUnder40 = faceNeckUnder40Logs.length > 0;
  const hasBodyAcne = bodyOtherLogs.length > 0;
  const hasScarring = scarringLogs.length > 0;
  const hasDisfigurement = disfigurementLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  if (hasDeepAcne && hasFaceNeck40Plus) {
    supportedRating = 30;
    ratingRationale = [
      'Deep acne (nodules/cysts) documented',
      'Face and neck involvement >=40% documented',
    ];
  } else if (hasDeepAcne && (hasFaceNeckUnder40 || hasBodyAcne)) {
    supportedRating = 10;
    ratingRationale = [
      'Deep acne (nodules/cysts) documented',
    ];
    if (hasFaceNeckUnder40) {
      ratingRationale.push('Face/neck involvement <40%');
    }
    if (hasBodyAcne) {
      ratingRationale.push('Body involvement (non-face/neck) documented');
    }
  } else if (hasDeepAcne) {
    // Deep acne but no extent documented
    supportedRating = 10;
    ratingRationale = [
      'Deep acne (nodules/cysts) documented',
      'Extent of involvement not specified - document face/neck percentage',
    ];
  } else if (hasSuperficialOnly) {
    supportedRating = 0;
    ratingRationale = [
      'Superficial acne documented (comedones, papules, pustules)',
      'No deep nodules or cysts documented',
      'Superficial acne rates 0% regardless of extent',
    ];
  }

  // Add scarring/disfigurement note
  if (hasScarring || hasDisfigurement) {
    ratingRationale.push('Scarring/disfigurement present - may qualify for alternative rating under DC 7800-7805');
  }

  // Add treatment documentation
  if (treatmentLogs.length > 0) {
    const treatments = [];
    if (relevantLogs.some(log => getLogSymptomId(log) === 'acne-topical-treatment')) treatments.push('topical');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'acne-oral-antibiotics')) treatments.push('oral antibiotics');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'acne-isotretinoin')) treatments.push('isotretinoin');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'acne-hormonal-therapy')) treatments.push('hormonal therapy');
    ratingRationale.push(`Treatment documented: ${treatments.join(', ')}`);
  }

  // Documentation gaps
  if (!hasDeepAcne && relevantLogs.length > 0) {
    gaps.push('Document if nodules or cysts are present (deep acne) for potential 10-30% rating');
  }
  if (hasDeepAcne && !hasFaceNeck40Plus && !hasFaceNeckUnder40 && !hasBodyAcne) {
    gaps.push('Document percentage of face/neck affected for accurate rating');
  }
  if (!hasScarring && supportedRating > 0) {
    gaps.push('Document any scarring - may qualify for additional rating under scar DCs');
  }
  if (treatmentLogs.length === 0) {
    gaps.push('Document all treatments tried (topical, oral, isotretinoin)');
  }

  return {
    hasData: true,
    condition: 'Acne',
    diagnosticCode: '7828',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      comedonesLogs: comedonesLogs.length,
      papulesLogs: papulesLogs.length,
      pustulesLogs: pustulesLogs.length,
      nodulesLogs: nodulesLogs.length,
      cystsLogs: cystsLogs.length,
      faceNeckUnder40: faceNeckUnder40Logs.length,
      faceNeck40Plus: faceNeck40PlusLogs.length,
      bodyOther: bodyOtherLogs.length,
      scarringLogs: scarringLogs.length,
      disfigurementLogs: disfigurementLogs.length,
      treatmentLogs: treatmentLogs.length,
      hasDeepAcne,
      hasSuperficialOnly,
    },
    criteria: ACNE_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - CHLORACNE (DC 7829)
// Phase 6A - Agent Orange presumptive condition
// ============================================

/**
 * Analyze Chloracne symptom logs against VA rating criteria
 * DC 7829 - Agent Orange presumptive condition, rated like acne with intertriginous consideration
 */

export const analyzeChloracneLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.CHLORACNE.symptomIds;

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
      condition: 'Chloracne',
      diagnosticCode: '7829',
      message: 'No chloracne symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms - Superficial types
  const comedonesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-comedones');
  const papulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-papules');
  const pustulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-pustules');

  // Deep types
  const nodulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-deep-nodules');
  const cystsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-deep-cysts');

  // Location/extent
  const faceNeckUnder40Logs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-face-neck-under40');
  const faceNeck40PlusLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-face-neck-40plus');
  const intertriginousLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-intertriginous');
  const bodyOtherLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-body-other');

  // Complications
  const scarringLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-scarring');
  const disfigurementLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-disfigurement');

  // Exposure documentation
  const agentOrangeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-agent-orange');
  const dioxinLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-dioxin-exposure');
  const onsetWithinYearLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'chloracne-onset-within-year');

  // Determine key indicators
  const hasDeepChloracne = nodulesLogs.length > 0 || cystsLogs.length > 0;
  const hasSuperficialOnly = !hasDeepChloracne && (comedonesLogs.length > 0 || papulesLogs.length > 0 || pustulesLogs.length > 0);
  const hasFaceNeck40Plus = faceNeck40PlusLogs.length > 0;
  const hasFaceNeckUnder40 = faceNeckUnder40Logs.length > 0;
  const hasIntertriginous = intertriginousLogs.length > 0;
  const hasBodyOther = bodyOtherLogs.length > 0;
  const hasScarring = scarringLogs.length > 0;
  const hasDisfigurement = disfigurementLogs.length > 0;
  const hasExposureDocumented = agentOrangeLogs.length > 0 || dioxinLogs.length > 0;
  const hasOnsetDocumented = onsetWithinYearLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  if (hasDeepChloracne && hasFaceNeck40Plus) {
    supportedRating = 30;
    ratingRationale = [
      'Deep chloracne (nodules/cysts) documented',
      'Face and neck involvement >=40% documented',
    ];
  } else if (hasDeepChloracne && hasIntertriginous) {
    supportedRating = 20;
    ratingRationale = [
      'Deep chloracne (nodules/cysts) documented',
      'Intertriginous area involvement documented (axilla, anogenital, breast folds, or between digits)',
    ];
  } else if (hasDeepChloracne && (hasFaceNeckUnder40 || hasBodyOther)) {
    supportedRating = 10;
    ratingRationale = [
      'Deep chloracne (nodules/cysts) documented',
    ];
    if (hasFaceNeckUnder40) {
      ratingRationale.push('Face/neck involvement <40%');
    }
    if (hasBodyOther) {
      ratingRationale.push('Non-intertriginous body involvement');
    }
  } else if (hasDeepChloracne) {
    supportedRating = 10;
    ratingRationale = [
      'Deep chloracne (nodules/cysts) documented',
      'Extent/location not fully documented - may qualify for higher rating',
    ];
  } else if (hasSuperficialOnly) {
    supportedRating = 0;
    ratingRationale = [
      'Superficial chloracne documented',
      'No deep nodules or cysts documented',
      'Superficial chloracne rates 0%',
    ];
  }

  // Add exposure documentation to rationale
  if (hasExposureDocumented) {
    if (agentOrangeLogs.length > 0) {
      ratingRationale.push('Agent Orange exposure documented - presumptive service connection may apply');
    } else if (dioxinLogs.length > 0) {
      ratingRationale.push('Dioxin/chemical exposure documented');
    }
  }

  if (hasOnsetDocumented && supportedRating > 0) {
    ratingRationale.push('Onset within one year of exposure documented');
  }

  // Add scarring/disfigurement note
  if (hasScarring || hasDisfigurement) {
    ratingRationale.push('Scarring/disfigurement present - may qualify for alternative rating under DC 7800-7805');
  }

  // Documentation gaps
  if (!hasDeepChloracne && relevantLogs.length > 0) {
    gaps.push('Document if nodules or cysts are present (deep chloracne) for potential rating');
  }
  if (hasDeepChloracne && !hasFaceNeck40Plus && !hasIntertriginous && !hasFaceNeckUnder40 && !hasBodyOther) {
    gaps.push('Document specific areas affected (face/neck %, intertriginous, or body)');
  }
  if (!hasExposureDocumented) {
    gaps.push('Document herbicide/dioxin exposure history for presumptive service connection');
  }
  if (!hasOnsetDocumented && hasExposureDocumented) {
    gaps.push('Document that onset was within one year of last exposure');
  }
  if (!hasScarring && supportedRating > 0) {
    gaps.push('Document any scarring - may qualify for additional rating');
  }

  return {
    hasData: true,
    condition: 'Chloracne',
    diagnosticCode: '7829',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      comedonesLogs: comedonesLogs.length,
      papulesLogs: papulesLogs.length,
      pustulesLogs: pustulesLogs.length,
      nodulesLogs: nodulesLogs.length,
      cystsLogs: cystsLogs.length,
      faceNeckUnder40: faceNeckUnder40Logs.length,
      faceNeck40Plus: faceNeck40PlusLogs.length,
      intertriginousLogs: intertriginousLogs.length,
      bodyOther: bodyOtherLogs.length,
      scarringLogs: scarringLogs.length,
      disfigurementLogs: disfigurementLogs.length,
      agentOrangeLogs: agentOrangeLogs.length,
      dioxinLogs: dioxinLogs.length,
      onsetWithinYearLogs: onsetWithinYearLogs.length,
      hasDeepChloracne,
      hasSuperficialOnly,
      hasIntertriginous,
    },
    criteria: CHLORACNE_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - ALOPECIA AREATA (DC 7831)
// Phase 6A - Rated by extent of hair loss
// ============================================

/**
 * Analyze Alopecia Areata symptom logs against VA rating criteria
 * DC 7831 - Rated based on extent of hair loss (all body hair = 10%, scalp/face only = 0%)
 */

export const analyzeAlopeciaAreataLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.ALOPECIA_AREATA.symptomIds;

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
      condition: 'Alopecia Areata',
      diagnosticCode: '7831',
      message: 'No alopecia areata symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms - Scalp/Face
  const patchyScalpLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-patchy-scalp');
  const completeScalpLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-complete-scalp');
  const eyebrowLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-eyebrow-loss');
  const eyelashLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-eyelash-loss');
  const beardLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-beard-loss');

  // Body hair loss
  const bodyHairLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-body-hair-loss');
  const allBodyHairLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-all-body-hair');

  // Associated symptoms
  const nailChangesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-nail-changes');
  const exclamationHairsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-exclamation-hairs');
  const regrowthLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-regrowth');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'aa-recurrent');

  // Treatment
  const treatmentLogs = relevantLogs.filter(log =>
      ['aa-steroid-injections', 'aa-topical-treatment', 'aa-immunotherapy'].includes(getLogSymptomId(log))
  );

  // Determine key indicators
  const hasAllBodyHairLoss = allBodyHairLogs.length > 0;
  const hasBodyHairLoss = bodyHairLogs.length > 0;
  const hasScalpLoss = patchyScalpLogs.length > 0 || completeScalpLogs.length > 0;
  const hasFacialLoss = eyebrowLogs.length > 0 || eyelashLogs.length > 0 || beardLogs.length > 0;
  const hasNailChanges = nailChangesLogs.length > 0;
  const hasActiveDisease = exclamationHairsLogs.length > 0;
  const hasRegrowth = regrowthLogs.length > 0;
  const isRecurrent = recurrentLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  // Key criterion: 10% ONLY if ALL body hair is lost (alopecia universalis)
  if (hasAllBodyHairLoss) {
    supportedRating = 10;
    ratingRationale = [
      'Loss of ALL body hair documented (alopecia universalis)',
      'This is the maximum rating under DC 7831',
    ];
  } else {
    supportedRating = 0;
    ratingRationale = [];

    if (hasScalpLoss || hasFacialLoss) {
      ratingRationale.push('Hair loss limited to scalp and/or face');
    }
    if (hasBodyHairLoss && !hasAllBodyHairLoss) {
      ratingRationale.push('Partial body hair loss documented - not complete');
    }
    if (hasScalpLoss && completeScalpLogs.length > 0) {
      ratingRationale.push('Complete scalp hair loss (alopecia totalis) - still rates 0% without complete body hair loss');
    }
    if (ratingRationale.length === 0) {
      ratingRationale.push('Alopecia areata documented but does not meet criteria for 10% rating');
    }
    ratingRationale.push('10% rating requires loss of ALL body hair (alopecia universalis)');
  }

  // Add additional relevant information
  if (hasNailChanges) {
    ratingRationale.push('Nail changes present - associated with more severe disease');
  }
  if (hasActiveDisease) {
    ratingRationale.push('Active disease indicators present (exclamation point hairs)');
  }
  if (isRecurrent) {
    ratingRationale.push('Recurrent episodes documented');
  }
  if (hasRegrowth) {
    ratingRationale.push('Regrowth documented in some areas');
  }

  // Treatment documentation
  if (treatmentLogs.length > 0) {
    const treatments = [];
    if (relevantLogs.some(log => getLogSymptomId(log) === 'aa-steroid-injections')) treatments.push('steroid injections');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'aa-topical-treatment')) treatments.push('topical therapy');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'aa-immunotherapy')) treatments.push('immunotherapy');
    ratingRationale.push(`Treatment: ${treatments.join(', ')}`);
  }

  // Documentation gaps
  if (!hasAllBodyHairLoss && (hasScalpLoss || hasFacialLoss)) {
    gaps.push('Document if body hair (arms, legs, chest, etc.) is also lost for potential 10% rating');
  }
  if (!hasAllBodyHairLoss && hasBodyHairLoss) {
    gaps.push('Document if ALL body hair is lost (including arms, legs, chest, pubic) for 10% rating');
  }
  if (supportedRating === 0) {
    gaps.push('Consider documenting psychological impact for potential secondary mental health rating');
  }
  if (treatmentLogs.length === 0) {
    gaps.push('Document treatment history (injections, topical, immunotherapy)');
  }

  return {
    hasData: true,
    condition: 'Alopecia Areata',
    diagnosticCode: '7831',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      patchyScalpLogs: patchyScalpLogs.length,
      completeScalpLogs: completeScalpLogs.length,
      eyebrowLogs: eyebrowLogs.length,
      eyelashLogs: eyelashLogs.length,
      beardLogs: beardLogs.length,
      bodyHairLogs: bodyHairLogs.length,
      allBodyHairLogs: allBodyHairLogs.length,
      nailChangesLogs: nailChangesLogs.length,
      exclamationHairsLogs: exclamationHairsLogs.length,
      regrowthLogs: regrowthLogs.length,
      recurrentLogs: recurrentLogs.length,
      treatmentLogs: treatmentLogs.length,
      hasAllBodyHairLoss,
      hasScalpLoss,
      hasFacialLoss,
      hasBodyHairLoss,
    },
    criteria: ALOPECIA_AREATA_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - HYPERHIDROSIS (DC 7832)
// Phase 6A - Rated by functional impairment and therapy response
// ============================================

/**
 * Analyze Hyperhidrosis symptom logs against VA rating criteria
 * DC 7832 - Rated based on ability to handle paper/tools and response to therapy
 */

export const analyzeHyperhidrosisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.HYPERHIDROSIS.symptomIds;

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
      condition: 'Hyperhidrosis',
      diagnosticCode: '7832',
      message: 'No hyperhidrosis symptoms logged in evaluation period',
    };
  }

  // Categorize by location
  const palmarLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-palmar');
  const plantarLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-plantar');
  const axillaryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-axillary');
  const facialLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-facial');
  const generalizedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-generalized');

  // Severity indicators
  const drippingSweatLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-dripping-sweat');

  // Functional impairment - KEY CRITERIA
  const paperHandlingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-paper-handling');
  const toolHandlingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-tool-handling');
  const keyboardLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-keyboard-difficulty');
  const handshakeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-handshake-avoidance');
  const clothingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-clothing-changes');
  const occupationalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-occupational-impact');

  // Complications
  const macerationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-skin-maceration');
  const infectionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-fungal-infections');

  // Treatment
  const antiperspirantLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-antiperspirant');
  const iontophoresisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-iontophoresis');
  const botoxLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-botox');
  const oralMedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-oral-medication');
  const surgeryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-surgery');

  // Therapy response - KEY CRITERIA
  const therapyResponsiveLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-therapy-responsive');
  const therapyUnresponsiveLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hh-therapy-unresponsive');

  // Determine key indicators
  const hasAnyTreatment = antiperspirantLogs.length > 0 || iontophoresisLogs.length > 0 ||
      botoxLogs.length > 0 || oralMedLogs.length > 0 || surgeryLogs.length > 0;
  const cannotHandlePaperTools = paperHandlingLogs.length > 0 || toolHandlingLogs.length > 0;
  const isTherapyUnresponsive = therapyUnresponsiveLogs.length > 0;
  const isTherapyResponsive = therapyResponsiveLogs.length > 0;
  const hasOccupationalImpact = occupationalLogs.length > 0;
  const hasComplications = macerationLogs.length > 0 || infectionLogs.length > 0;

  // Determine affected areas
  const affectedAreas = [];
  if (palmarLogs.length > 0) affectedAreas.push('palms/hands');
  if (plantarLogs.length > 0) affectedAreas.push('soles/feet');
  if (axillaryLogs.length > 0) affectedAreas.push('underarms');
  if (facialLogs.length > 0) affectedAreas.push('face');
  if (generalizedLogs.length > 0) affectedAreas.push('generalized');

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  // 30% requires: (1) Unable to handle paper OR tools due to moisture AND (2) Unresponsive to therapy
  if (cannotHandlePaperTools && isTherapyUnresponsive) {
    supportedRating = 30;
    ratingRationale = [
      'Unable to handle paper or tools due to moisture documented',
      'Condition unresponsive to therapy documented',
      'Both criteria met for 30% rating',
    ];
  } else if (cannotHandlePaperTools && !isTherapyUnresponsive && !isTherapyResponsive && hasAnyTreatment) {
    // Has functional impairment and treatment, but therapy response not documented
    supportedRating = 0;
    ratingRationale = [
      'Unable to handle paper or tools documented',
      'Treatment attempted but therapy response not documented',
      '30% requires BOTH functional impairment AND unresponsive to therapy',
    ];
  } else if (cannotHandlePaperTools && isTherapyResponsive) {
    supportedRating = 0;
    ratingRationale = [
      'Functional impairment documented but condition responsive to therapy',
      '30% rating requires condition to be unresponsive to therapy',
    ];
  } else if (isTherapyResponsive || (hasAnyTreatment && !cannotHandlePaperTools)) {
    supportedRating = 0;
    ratingRationale = [
      'Hyperhidrosis present and treatment documented',
      'Able to handle paper or tools after therapy',
    ];
  } else {
    supportedRating = 0;
    ratingRationale = [
      'Hyperhidrosis symptoms documented',
      '30% rating requires inability to handle paper/tools AND unresponsive to therapy',
    ];
  }

  // Add location information
  if (affectedAreas.length > 0) {
    ratingRationale.push(`Affected areas: ${affectedAreas.join(', ')}`);
  }

  // Add treatment history
  if (hasAnyTreatment) {
    const treatments = [];
    if (antiperspirantLogs.length > 0) treatments.push('clinical antiperspirant');
    if (iontophoresisLogs.length > 0) treatments.push('iontophoresis');
    if (botoxLogs.length > 0) treatments.push('Botox');
    if (oralMedLogs.length > 0) treatments.push('oral medication');
    if (surgeryLogs.length > 0) treatments.push('surgery');
    ratingRationale.push(`Treatments tried: ${treatments.join(', ')}`);
  }

  // Add occupational impact
  if (hasOccupationalImpact) {
    ratingRationale.push('Occupational impact documented');
  }

  // Add complications
  if (hasComplications) {
    const complications = [];
    if (macerationLogs.length > 0) complications.push('skin maceration');
    if (infectionLogs.length > 0) complications.push('secondary infections');
    ratingRationale.push(`Complications: ${complications.join(', ')} - may warrant separate rating`);
  }

  // Documentation gaps
  if (!cannotHandlePaperTools) {
    gaps.push('Document if unable to handle paper or tools due to sweating (key criterion for 30%)');
  }
  if (cannotHandlePaperTools && !isTherapyUnresponsive && !isTherapyResponsive) {
    gaps.push('Document whether condition responds to therapy (required for rating determination)');
  }
  if (!hasAnyTreatment) {
    gaps.push('Document all treatments tried (antiperspirant, iontophoresis, Botox, oral meds, surgery)');
  }
  if (!hasOccupationalImpact && cannotHandlePaperTools) {
    gaps.push('Document specific occupational impact for claim support');
  }
  if (infectionLogs.length > 0) {
    gaps.push('Secondary infections documented - ensure appropriate medical treatment');
  }

  return {
    hasData: true,
    condition: 'Hyperhidrosis',
    diagnosticCode: '7832',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      palmarLogs: palmarLogs.length,
      plantarLogs: plantarLogs.length,
      axillaryLogs: axillaryLogs.length,
      facialLogs: facialLogs.length,
      generalizedLogs: generalizedLogs.length,
      drippingSweatLogs: drippingSweatLogs.length,
      paperHandlingLogs: paperHandlingLogs.length,
      toolHandlingLogs: toolHandlingLogs.length,
      keyboardLogs: keyboardLogs.length,
      occupationalLogs: occupationalLogs.length,
      macerationLogs: macerationLogs.length,
      infectionLogs: infectionLogs.length,
      therapyResponsiveLogs: therapyResponsiveLogs.length,
      therapyUnresponsiveLogs: therapyUnresponsiveLogs.length,
      treatmentLogs: hasAnyTreatment ? 1 : 0,
      affectedAreas,
      cannotHandlePaperTools,
      isTherapyUnresponsive,
      isTherapyResponsive,
    },
    criteria: HYPERHIDROSIS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - GENERAL SKIN FORMULA CONDITIONS
// Phase 6B - DC 7809, 7813, 7815, 7820
// All use body % and systemic therapy criteria
// ============================================

/**
 * Helper function for General Rating Formula for the Skin
 * Used by multiple skin conditions: DC 7809, 7813, 7815, 7820
 */
const analyzeGeneralSkinFormula = (relevantLogs, getLogSymptomId, prefix) => {
  // Body percentage affected
  const under5Logs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-under5-body`);
  const fiveTo20Logs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-5to20-body`);
  const twentyTo40Logs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-20to40-body`);
  const over40Logs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-over40-body`);

  // Treatment level
  const topicalOnlyLogs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-topical-only`);
  const systemicIntermittentLogs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-systemic-intermittent`);
  const systemic6WeeksLogs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-systemic-6weeks`);
  const systemicConstantLogs = relevantLogs.filter(log => getLogSymptomId(log) === `${prefix}-systemic-constant`);

  // Determine the highest body percentage documented
  let bodyPercentage = null;
  if (over40Logs.length > 0) bodyPercentage = '>40%';
  else if (twentyTo40Logs.length > 0) bodyPercentage = '20-40%';
  else if (fiveTo20Logs.length > 0) bodyPercentage = '5-20%';
  else if (under5Logs.length > 0) bodyPercentage = '<5%';

  // Determine the highest treatment level documented
  let treatmentLevel = null;
  if (systemicConstantLogs.length > 0) treatmentLevel = 'constant';
  else if (systemic6WeeksLogs.length > 0) treatmentLevel = '6weeks';
  else if (systemicIntermittentLogs.length > 0) treatmentLevel = 'intermittent';
  else if (topicalOnlyLogs.length > 0) treatmentLevel = 'topical';

  return {
    bodyPercentage,
    treatmentLevel,
    metrics: {
      under5Logs: under5Logs.length,
      fiveTo20Logs: fiveTo20Logs.length,
      twentyTo40Logs: twentyTo40Logs.length,
      over40Logs: over40Logs.length,
      topicalOnlyLogs: topicalOnlyLogs.length,
      systemicIntermittentLogs: systemicIntermittentLogs.length,
      systemic6WeeksLogs: systemic6WeeksLogs.length,
      systemicConstantLogs: systemicConstantLogs.length,
    },
  };
};

/**
 * Determine rating based on General Skin Formula
 */
const determineGeneralSkinRating = (bodyPercentage, treatmentLevel) => {
  // 60%: >40% body OR constant systemic
  if (bodyPercentage === '>40%' || treatmentLevel === 'constant') {
    return 60;
  }
  // 30%: 20-40% body OR systemic >=6 weeks
  if (bodyPercentage === '20-40%' || treatmentLevel === '6weeks') {
    return 30;
  }
  // 10%: 5-20% body OR intermittent systemic
  if (bodyPercentage === '5-20%' || treatmentLevel === 'intermittent') {
    return 10;
  }
  // 0%: <5% body with topical only
  if (bodyPercentage === '<5%' || treatmentLevel === 'topical') {
    return 0;
  }
  return null;
};

// ============================================
// ANALYSIS FUNCTIONS - DISCOID LUPUS (DC 7809)
// Phase 6B - Uses General Rating Formula for the Skin
// ============================================

/**
 * Analyze Discoid Lupus Erythematosus symptom logs against VA rating criteria
 * DC 7809 - Uses General Rating Formula for the Skin
 */

export const analyzeDiscoidLupusLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.DISCOID_LUPUS.symptomIds;

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
      condition: 'Discoid Lupus Erythematosus',
      diagnosticCode: '7809',
      message: 'No discoid lupus symptoms logged in evaluation period',
    };
  }

  // Condition-specific symptoms
  const discoidLesionsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-discoid-lesions');
  const erythematousPlaquesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-erythematous-plaques');
  const scarringLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-scarring');
  const hyperpigmentationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-hyperpigmentation');
  const hypopigmentationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-hypopigmentation');
  const scalpLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-scalp-involvement');
  const earLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-ear-involvement');
  const faceLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-face-involvement');
  const photosensitivityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-photosensitivity');
  const follicularPluggingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'dle-follicular-plugging');

  // Use general skin formula helper
  const skinFormula = analyzeGeneralSkinFormula(relevantLogs, getLogSymptomId, 'dle');
  const { bodyPercentage, treatmentLevel, metrics: formulaMetrics } = skinFormula;

  let supportedRating = determineGeneralSkinRating(bodyPercentage, treatmentLevel);
  let ratingRationale = [];
  const gaps = [];

  // Build rationale
  if (supportedRating === 60) {
    if (bodyPercentage === '>40%') {
      ratingRationale.push('More than 40% of body or exposed areas affected');
    }
    if (treatmentLevel === 'constant') {
      ratingRationale.push('Constant/near-constant systemic therapy required');
    }
  } else if (supportedRating === 30) {
    if (bodyPercentage === '20-40%') {
      ratingRationale.push('20-40% of body or exposed areas affected');
    }
    if (treatmentLevel === '6weeks') {
      ratingRationale.push('Systemic therapy >=6 weeks over past 12 months');
    }
  } else if (supportedRating === 10) {
    if (bodyPercentage === '5-20%') {
      ratingRationale.push('5-20% of body or exposed areas affected');
    }
    if (treatmentLevel === 'intermittent') {
      ratingRationale.push('Intermittent systemic therapy <6 weeks');
    }
  } else if (supportedRating === 0) {
    ratingRationale.push('Less than 5% of body affected with topical therapy only');
  } else {
    ratingRationale.push('Discoid lupus documented - document body % and treatment for rating');
  }

  // Add symptom details
  if (discoidLesionsLogs.length > 0 || erythematousPlaquesLogs.length > 0) {
    ratingRationale.push('Characteristic discoid lesions documented');
  }
  if (scarringLogs.length > 0) {
    ratingRationale.push('Scarring documented - may qualify for additional rating under DC 7800-7805');
  }
  if (faceLogs.length > 0 || earLogs.length > 0 || scalpLogs.length > 0) {
    const locations = [];
    if (faceLogs.length > 0) locations.push('face');
    if (earLogs.length > 0) locations.push('ears');
    if (scalpLogs.length > 0) locations.push('scalp');
    ratingRationale.push(`Exposed area involvement: ${locations.join(', ')}`);
  }
  if (photosensitivityLogs.length > 0) {
    ratingRationale.push('Photosensitivity documented');
  }

  // Documentation gaps
  if (!bodyPercentage) {
    gaps.push('Document percentage of body/exposed areas affected (key rating criterion)');
  }
  if (!treatmentLevel) {
    gaps.push('Document treatment type: topical only vs systemic therapy');
  }
  if (treatmentLevel && treatmentLevel !== 'topical' && treatmentLevel !== 'constant') {
    gaps.push('Document duration of systemic therapy (<6 weeks vs >=6 weeks vs constant)');
  }
  if (scarringLogs.length === 0 && (discoidLesionsLogs.length > 0 || erythematousPlaquesLogs.length > 0)) {
    gaps.push('Document any scarring - may qualify for separate rating');
  }

  return {
    hasData: true,
    condition: 'Discoid Lupus Erythematosus',
    diagnosticCode: '7809',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      discoidLesionsLogs: discoidLesionsLogs.length,
      erythematousPlaquesLogs: erythematousPlaquesLogs.length,
      scarringLogs: scarringLogs.length,
      hyperpigmentationLogs: hyperpigmentationLogs.length,
      hypopigmentationLogs: hypopigmentationLogs.length,
      scalpLogs: scalpLogs.length,
      earLogs: earLogs.length,
      faceLogs: faceLogs.length,
      photosensitivityLogs: photosensitivityLogs.length,
      follicularPluggingLogs: follicularPluggingLogs.length,
      bodyPercentage,
      treatmentLevel,
      ...formulaMetrics,
    },
    criteria: DISCOID_LUPUS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - BULLOUS DISORDERS (DC 7815)
// Phase 6B - Uses General Rating Formula for the Skin
// ============================================

/**
 * Analyze Bullous Disorders symptom logs against VA rating criteria
 * DC 7815 - Uses General Rating Formula for the Skin
 */

export const analyzeBullousDisordersLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.BULLOUS_DISORDERS.symptomIds;

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
      condition: 'Bullous Disorders',
      diagnosticCode: '7815',
      message: 'No bullous disorder symptoms logged in evaluation period',
    };
  }

  // Condition-specific symptoms
  const blistersLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-blisters');
  const erosionsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-erosions');
  const crustingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-crusting');
  const nikolskyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-nikolsky-sign');
  const oralMucosalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-oral-mucosal');
  const ocularLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-ocular');
  const giLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-gi-involvement');
  const genitalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-genital');
  const itchingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-itching');
  const burningLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-burning');
  const scarringLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'bullous-scarring');

  // Use general skin formula helper
  const skinFormula = analyzeGeneralSkinFormula(relevantLogs, getLogSymptomId, 'bullous');
  const { bodyPercentage, treatmentLevel, metrics: formulaMetrics } = skinFormula;

  let supportedRating = determineGeneralSkinRating(bodyPercentage, treatmentLevel);
  let ratingRationale = [];
  const gaps = [];

  // Build rationale
  if (supportedRating === 60) {
    if (bodyPercentage === '>40%') {
      ratingRationale.push('More than 40% of body or exposed areas affected');
    }
    if (treatmentLevel === 'constant') {
      ratingRationale.push('Constant/near-constant systemic therapy required');
    }
  } else if (supportedRating === 30) {
    if (bodyPercentage === '20-40%') {
      ratingRationale.push('20-40% of body or exposed areas affected');
    }
    if (treatmentLevel === '6weeks') {
      ratingRationale.push('Systemic therapy >=6 weeks over past 12 months');
    }
  } else if (supportedRating === 10) {
    if (bodyPercentage === '5-20%') {
      ratingRationale.push('5-20% of body or exposed areas affected');
    }
    if (treatmentLevel === 'intermittent') {
      ratingRationale.push('Intermittent systemic therapy <6 weeks');
    }
  } else if (supportedRating === 0) {
    ratingRationale.push('Less than 5% of body affected with topical therapy only');
  } else {
    ratingRationale.push('Bullous disorder documented - document body % and treatment for rating');
  }

  // Add symptom details
  if (blistersLogs.length > 0 || erosionsLogs.length > 0) {
    ratingRationale.push('Characteristic blisters/erosions documented');
  }
  if (nikolskyLogs.length > 0) {
    ratingRationale.push('Positive Nikolsky sign documented (indicates active pemphigus)');
  }

  // Mucosal involvement - rate separately
  const hasMucosalInvolvement = oralMucosalLogs.length > 0 || ocularLogs.length > 0 ||
      giLogs.length > 0 || genitalLogs.length > 0;
  if (hasMucosalInvolvement) {
    const mucosalAreas = [];
    if (oralMucosalLogs.length > 0) mucosalAreas.push('oral');
    if (ocularLogs.length > 0) mucosalAreas.push('ocular');
    if (giLogs.length > 0) mucosalAreas.push('GI');
    if (genitalLogs.length > 0) mucosalAreas.push('genital');
    ratingRationale.push(`Mucosal involvement (${mucosalAreas.join(', ')}) - rate SEPARATELY under appropriate DC`);
  }

  if (scarringLogs.length > 0) {
    ratingRationale.push('Scarring documented - may qualify for additional rating');
  }

  // Documentation gaps
  if (!bodyPercentage) {
    gaps.push('Document percentage of body/exposed areas affected');
  }
  if (!treatmentLevel) {
    gaps.push('Document treatment type: topical only vs systemic therapy');
  }
  if (hasMucosalInvolvement) {
    gaps.push('Mucosal complications should be evaluated separately - document impact on function');
  }

  return {
    hasData: true,
    condition: 'Bullous Disorders',
    diagnosticCode: '7815',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      blistersLogs: blistersLogs.length,
      erosionsLogs: erosionsLogs.length,
      crustingLogs: crustingLogs.length,
      nikolskyLogs: nikolskyLogs.length,
      oralMucosalLogs: oralMucosalLogs.length,
      ocularLogs: ocularLogs.length,
      giLogs: giLogs.length,
      genitalLogs: genitalLogs.length,
      itchingLogs: itchingLogs.length,
      burningLogs: burningLogs.length,
      scarringLogs: scarringLogs.length,
      hasMucosalInvolvement,
      bodyPercentage,
      treatmentLevel,
      ...formulaMetrics,
    },
    criteria: BULLOUS_DISORDERS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - CUTANEOUS VASCULITIS (DC 7826)
// Phase 6B - Rated by episodes and immunosuppressive therapy
// ============================================

/**
 * Analyze Primary Cutaneous Vasculitis symptom logs against VA rating criteria
 * DC 7826 - Rated by documented episodes and immunosuppressive requirements
 */

export const analyzeCutaneousVasculitisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.CUTANEOUS_VASCULITIS.symptomIds;

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
      condition: 'Primary Cutaneous Vasculitis',
      diagnosticCode: '7826',
      message: 'No cutaneous vasculitis symptoms logged in evaluation period',
    };
  }

  // Symptom categorization
  const purpuraLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-purpura');
  const petechiaeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-petechiae');
  const ulcersLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-ulcers');
  const nodulesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-nodules');
  const livedoLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-livedo-reticularis');
  const necrosisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-necrosis');
  const scarringLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-scarring');
  const disfigurementLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-disfigurement');

  // Episode frequency
  const episodeDocumentedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-episode-documented');
  const episodes1to3Logs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-episodes-1to3');
  const episodes4PlusLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-episodes-4plus');

  // Treatment
  const noSystemicLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-no-systemic-med');
  const continuousSystemicLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-continuous-systemic');
  const intermittentImmunoLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-intermittent-immuno');
  const refractoryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cv-refractory');

  // Determine episode frequency
  let episodeFrequency = null;
  if (episodes4PlusLogs.length > 0) episodeFrequency = '4+';
  else if (episodes1to3Logs.length > 0) episodeFrequency = '1-3';
  else if (episodeDocumentedLogs.length > 0) episodeFrequency = 'documented';

  // Determine treatment level
  let treatmentLevel = null;
  const isRefractory = refractoryLogs.length > 0;
  const hasContinuousSystemic = continuousSystemicLogs.length > 0;
  const hasIntermittentImmuno = intermittentImmunoLogs.length > 0;
  const hasNoSystemic = noSystemicLogs.length > 0;

  if (isRefractory) treatmentLevel = 'refractory';
  else if (hasContinuousSystemic) treatmentLevel = 'continuous';
  else if (hasIntermittentImmuno) treatmentLevel = 'intermittent';
  else if (hasNoSystemic) treatmentLevel = 'none';

  let supportedRating = null;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on DC 7826 criteria
  // 60%: Persistent episodes refractory to continuous immunosuppressive therapy
  if (isRefractory) {
    supportedRating = 60;
    ratingRationale.push('Persistent vasculitis refractory to continuous immunosuppressive therapy');
  }
  // 30%: 4+ episodes/year requiring intermittent immunosuppressive therapy
  else if (episodeFrequency === '4+' && hasIntermittentImmuno) {
    supportedRating = 30;
    ratingRationale.push('4+ documented episodes in past 12 months');
    ratingRationale.push('Requiring intermittent immunosuppressive therapy');
  }
  // 10%: 1-3 episodes with intermittent immunosuppressive OR continuous systemic for control
  else if ((episodeFrequency === '1-3' && hasIntermittentImmuno) || (hasContinuousSystemic && !isRefractory)) {
    supportedRating = 10;
    if (episodeFrequency === '1-3' && hasIntermittentImmuno) {
      ratingRationale.push('1-3 documented episodes requiring intermittent immunosuppressive therapy');
    }
    if (hasContinuousSystemic) {
      ratingRationale.push('Requires continuous systemic medication for control');
    }
  }
  // Has symptoms but doesn't meet specific criteria
  else if (relevantLogs.length > 0) {
    supportedRating = 10;
    ratingRationale.push('Cutaneous vasculitis documented');
    ratingRationale.push('Document episode frequency and treatment for accurate rating');
  }

  // Add symptom details
  const manifestations = [];
  if (purpuraLogs.length > 0) manifestations.push('purpura');
  if (petechiaeLogs.length > 0) manifestations.push('petechiae');
  if (ulcersLogs.length > 0) manifestations.push('ulcers');
  if (nodulesLogs.length > 0) manifestations.push('nodules');
  if (livedoLogs.length > 0) manifestations.push('livedo reticularis');
  if (necrosisLogs.length > 0) manifestations.push('necrosis');
  if (manifestations.length > 0) {
    ratingRationale.push(`Manifestations: ${manifestations.join(', ')}`);
  }

  if (scarringLogs.length > 0 || disfigurementLogs.length > 0) {
    ratingRationale.push('Scarring/disfigurement documented - may qualify for alternative rating under DC 7800-7805');
  }

  // Documentation gaps
  if (!episodeFrequency) {
    gaps.push('Document frequency of vasculitic episodes (1-3/year vs 4+/year)');
  }
  if (!treatmentLevel) {
    gaps.push('Document treatment: no systemic, intermittent immunosuppressive, continuous, or refractory');
  }
  if (episodeFrequency === '4+' && !hasIntermittentImmuno) {
    gaps.push('Document if intermittent immunosuppressive therapy is required for 30% rating');
  }

  return {
    hasData: true,
    condition: 'Primary Cutaneous Vasculitis',
    diagnosticCode: '7826',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      purpuraLogs: purpuraLogs.length,
      petechiaeLogs: petechiaeLogs.length,
      ulcersLogs: ulcersLogs.length,
      nodulesLogs: nodulesLogs.length,
      livedoLogs: livedoLogs.length,
      necrosisLogs: necrosisLogs.length,
      scarringLogs: scarringLogs.length,
      disfigurementLogs: disfigurementLogs.length,
      episodeDocumentedLogs: episodeDocumentedLogs.length,
      episodes1to3Logs: episodes1to3Logs.length,
      episodes4PlusLogs: episodes4PlusLogs.length,
      noSystemicLogs: noSystemicLogs.length,
      continuousSystemicLogs: continuousSystemicLogs.length,
      intermittentImmunoLogs: intermittentImmunoLogs.length,
      refractoryLogs: refractoryLogs.length,
      episodeFrequency,
      treatmentLevel,
      isRefractory,
    },
    criteria: CUTANEOUS_VASCULITIS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - DERMATOPHYTOSIS (DC 7813)
// Phase 6B - Uses General Rating Formula for the Skin
// ============================================

/**
 * Analyze Dermatophytosis symptom logs against VA rating criteria
 * DC 7813 - Uses General Rating Formula for the Skin
 */

export const analyzeDermatophytosisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.DERMATOPHYTOSIS.symptomIds;

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
      condition: 'Dermatophytosis',
      diagnosticCode: '7813',
      message: 'No dermatophytosis symptoms logged in evaluation period',
    };
  }

  // Condition-specific symptoms - types of fungal infection
  const tineaCorporisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-corporis');
  const tineaCapitisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-capitis');
  const tineaPedisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-pedis');
  const tineaCrurisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-cruris');
  const tineaBarbaeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-barbae');
  const onychomycosisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-onychomycosis');
  const tineaVersicolorLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-tinea-versicolor');

  // Other symptoms
  const scalingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-scaling');
  const itchingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-itching');
  const ringPatternLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-ring-pattern');
  const hairLossLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-hair-loss');
  const nailThickeningLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-nail-thickening');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'derm-recurrent');

  // Use general skin formula helper
  const skinFormula = analyzeGeneralSkinFormula(relevantLogs, getLogSymptomId, 'derm');
  const { bodyPercentage, treatmentLevel, metrics: formulaMetrics } = skinFormula;

  let supportedRating = determineGeneralSkinRating(bodyPercentage, treatmentLevel);
  let ratingRationale = [];
  const gaps = [];

  // Build rationale
  if (supportedRating === 60) {
    if (bodyPercentage === '>40%') {
      ratingRationale.push('More than 40% of body or exposed areas affected');
    }
    if (treatmentLevel === 'constant') {
      ratingRationale.push('Constant/near-constant systemic antifungal therapy required');
    }
  } else if (supportedRating === 30) {
    if (bodyPercentage === '20-40%') {
      ratingRationale.push('20-40% of body or exposed areas affected');
    }
    if (treatmentLevel === '6weeks') {
      ratingRationale.push('Systemic antifungal therapy >=6 weeks over past 12 months');
    }
  } else if (supportedRating === 10) {
    if (bodyPercentage === '5-20%') {
      ratingRationale.push('5-20% of body or exposed areas affected');
    }
    if (treatmentLevel === 'intermittent') {
      ratingRationale.push('Intermittent systemic antifungal therapy <6 weeks');
    }
  } else if (supportedRating === 0) {
    ratingRationale.push('Less than 5% of body affected with topical therapy only');
  } else {
    ratingRationale.push('Dermatophytosis documented - document body % and treatment for rating');
  }

  // Add infection type details
  const infectionTypes = [];
  if (tineaCorporisLogs.length > 0) infectionTypes.push('body ringworm');
  if (tineaCapitisLogs.length > 0) infectionTypes.push('scalp ringworm');
  if (tineaPedisLogs.length > 0) infectionTypes.push('athlete\'s foot');
  if (tineaCrurisLogs.length > 0) infectionTypes.push('jock itch');
  if (tineaBarbaeLogs.length > 0) infectionTypes.push('beard ringworm');
  if (onychomycosisLogs.length > 0) infectionTypes.push('nail fungus');
  if (tineaVersicolorLogs.length > 0) infectionTypes.push('tinea versicolor');

  if (infectionTypes.length > 0) {
    ratingRationale.push(`Fungal infection types: ${infectionTypes.join(', ')}`);
  }

  if (recurrentLogs.length > 0) {
    ratingRationale.push('Recurrent infections documented');
  }

  if (onychomycosisLogs.length > 0 && treatmentLevel !== 'constant' && treatmentLevel !== '6weeks') {
    ratingRationale.push('Note: Nail fungus typically requires prolonged oral antifungal therapy');
  }

  // Documentation gaps
  if (!bodyPercentage) {
    gaps.push('Document percentage of body/exposed areas affected');
  }
  if (!treatmentLevel) {
    gaps.push('Document treatment type: topical only vs oral antifungals');
  }
  if (onychomycosisLogs.length > 0) {
    gaps.push('Nail fungus often requires 3-6 months oral therapy - document duration');
  }

  return {
    hasData: true,
    condition: 'Dermatophytosis',
    diagnosticCode: '7813',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      tineaCorporisLogs: tineaCorporisLogs.length,
      tineaCapitisLogs: tineaCapitisLogs.length,
      tineaPedisLogs: tineaPedisLogs.length,
      tineaCrurisLogs: tineaCrurisLogs.length,
      tineaBarbaeLogs: tineaBarbaeLogs.length,
      onychomycosisLogs: onychomycosisLogs.length,
      tineaVersicolorLogs: tineaVersicolorLogs.length,
      scalingLogs: scalingLogs.length,
      itchingLogs: itchingLogs.length,
      ringPatternLogs: ringPatternLogs.length,
      hairLossLogs: hairLossLogs.length,
      nailThickeningLogs: nailThickeningLogs.length,
      recurrentLogs: recurrentLogs.length,
      bodyPercentage,
      treatmentLevel,
      ...formulaMetrics,
    },
    criteria: DERMATOPHYTOSIS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - SKIN INFECTIONS (DC 7820)
// Phase 6B - Uses General Rating Formula for the Skin
// ============================================

/**
 * Analyze Skin Infections symptom logs against VA rating criteria
 * DC 7820 - Uses General Rating Formula for the Skin
 */

export const analyzeSkinInfectionsLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.SKIN_INFECTIONS.symptomIds;

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
      condition: 'Skin Infections',
      diagnosticCode: '7820',
      message: 'No skin infection symptoms logged in evaluation period',
    };
  }

  // Infection types
  const bacterialLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-bacterial');
  const cellulitisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-cellulitis');
  const abscessLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-abscess');
  const impetigoLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-impetigo');
  const folliculitisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-folliculitis');
  const viralLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-viral');
  const herpesSimplexLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-herpes-simplex');
  const herpesZosterLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-herpes-zoster');
  const wartsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-warts');
  const molluscumLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-molluscum');
  const parasiticLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-parasitic');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'skinf-recurrent');

  // Use general skin formula helper
  const skinFormula = analyzeGeneralSkinFormula(relevantLogs, getLogSymptomId, 'skinf');
  const { bodyPercentage, treatmentLevel, metrics: formulaMetrics } = skinFormula;

  let supportedRating = determineGeneralSkinRating(bodyPercentage, treatmentLevel);
  let ratingRationale = [];
  const gaps = [];

  // Build rationale
  if (supportedRating === 60) {
    if (bodyPercentage === '>40%') {
      ratingRationale.push('More than 40% of body or exposed areas affected');
    }
    if (treatmentLevel === 'constant') {
      ratingRationale.push('Constant/near-constant systemic therapy required');
    }
  } else if (supportedRating === 30) {
    if (bodyPercentage === '20-40%') {
      ratingRationale.push('20-40% of body or exposed areas affected');
    }
    if (treatmentLevel === '6weeks') {
      ratingRationale.push('Systemic therapy >=6 weeks over past 12 months');
    }
  } else if (supportedRating === 10) {
    if (bodyPercentage === '5-20%') {
      ratingRationale.push('5-20% of body or exposed areas affected');
    }
    if (treatmentLevel === 'intermittent') {
      ratingRationale.push('Intermittent systemic therapy <6 weeks');
    }
  } else if (supportedRating === 0) {
    ratingRationale.push('Less than 5% of body affected with topical therapy only');
  } else {
    ratingRationale.push('Skin infection documented - document body % and treatment for rating');
  }

  // Add infection type details
  const infectionTypes = [];
  if (bacterialLogs.length > 0) infectionTypes.push('bacterial');
  if (cellulitisLogs.length > 0) infectionTypes.push('cellulitis');
  if (abscessLogs.length > 0) infectionTypes.push('abscess');
  if (impetigoLogs.length > 0) infectionTypes.push('impetigo');
  if (folliculitisLogs.length > 0) infectionTypes.push('folliculitis');
  if (viralLogs.length > 0) infectionTypes.push('viral');
  if (herpesSimplexLogs.length > 0) infectionTypes.push('herpes simplex');
  if (herpesZosterLogs.length > 0) infectionTypes.push('shingles');
  if (wartsLogs.length > 0) infectionTypes.push('warts');
  if (molluscumLogs.length > 0) infectionTypes.push('molluscum');
  if (parasiticLogs.length > 0) infectionTypes.push('parasitic');

  if (infectionTypes.length > 0) {
    ratingRationale.push(`Infection types: ${infectionTypes.join(', ')}`);
  }

  if (recurrentLogs.length > 0) {
    ratingRationale.push('Recurrent infections documented');
  }

  if (herpesZosterLogs.length > 0) {
    ratingRationale.push('Note: Post-herpetic neuralgia from shingles may warrant separate neurological rating');
  }

  // Documentation gaps
  if (!bodyPercentage) {
    gaps.push('Document percentage of body/exposed areas affected');
  }
  if (!treatmentLevel) {
    gaps.push('Document treatment type: topical only vs systemic antibiotics/antivirals');
  }
  if (recurrentLogs.length > 0) {
    gaps.push('Document each infection episode with dates and treatment');
  }

  return {
    hasData: true,
    condition: 'Skin Infections',
    diagnosticCode: '7820',
    cfrReference: '38 CFR 4.118',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      bacterialLogs: bacterialLogs.length,
      cellulitisLogs: cellulitisLogs.length,
      abscessLogs: abscessLogs.length,
      impetigoLogs: impetigoLogs.length,
      folliculitisLogs: folliculitisLogs.length,
      viralLogs: viralLogs.length,
      herpesSimplexLogs: herpesSimplexLogs.length,
      herpesZosterLogs: herpesZosterLogs.length,
      wartsLogs: wartsLogs.length,
      molluscumLogs: molluscumLogs.length,
      parasiticLogs: parasiticLogs.length,
      recurrentLogs: recurrentLogs.length,
      bodyPercentage,
      treatmentLevel,
      ...formulaMetrics,
    },
    criteria: SKIN_INFECTIONS_CRITERIA,
  };
};

// ============================================
// PHASE 7A: EYE CONDITIONS ANALYSIS FUNCTIONS
// ============================================

// Helper function to count treatment visits from logged episodes
const countEyeTreatmentVisits = (logs, prefix) => {
  let visitCount = 0;

  // Count individual treatment visit logs
  const treatmentVisitLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomId === `${prefix}-treatment-visit`;
  });
  visitCount += treatmentVisitLogs.length;

  // Also check for episode range indicators and add their implied counts
  const hasEpisodes7plus = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-7plus`);
  const hasEpisodes5to6 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-5to6`);
  const hasEpisodes3to4 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-3to4`);
  const hasEpisodes1to2 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-1to2`);

  // Return the highest documented episode count if logged
  if (hasEpisodes7plus) return Math.max(visitCount, 7);
  if (hasEpisodes5to6) return Math.max(visitCount, 5);
  if (hasEpisodes3to4) return Math.max(visitCount, 3);
  if (hasEpisodes1to2) return Math.max(visitCount, 1);

  return visitCount;
};

// Helper function to determine rating based on treatment visits
const getEyeRatingFromVisits = (visitCount) => {
  if (visitCount >= 7) return 60;
  if (visitCount >= 5) return 40;
  if (visitCount >= 3) return 20;
  if (visitCount >= 1) return 10;
  return 0;
};

// DC 6000: UVEITIS / CHOROIDOPATHY ANALYSIS

export const analyzeSystemicLupusLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomIds = SKIN_ENDOCRINE_CONDITIONS.SYSTEMIC_LUPUS.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Two-year lookback for 10% rating criteria
  const twoYearCutoff = new Date();
  twoYearCutoff.setDate(twoYearCutoff.getDate() - 730);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  const twoYearLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= twoYearCutoff && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0 && twoYearLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Systemic Lupus Erythematosus (SLE)',
      diagnosticCode: '6350',
      cfrReference: '38 CFR 4.88b',
      message: 'No SLE symptoms logged in evaluation period',
      criteria: SYSTEMIC_LUPUS_CRITERIA,
    };
  }

  // Categorize logs
  const acuteFlares = relevantLogs.filter(log => log.symptomId === 'sle-flare-acute');
  const moderateFlares = relevantLogs.filter(log => log.symptomId === 'sle-flare-moderate');
  const mildFlares = relevantLogs.filter(log => log.symptomId === 'sle-flare-mild');
  const allFlares = [...acuteFlares, ...moderateFlares, ...mildFlares];

  // Severe symptoms
  const hospitalizations = relevantLogs.filter(log => log.symptomId === 'sle-hospitalization');
  const erVisits = relevantLogs.filter(log => log.symptomId === 'sle-er-visit');
  const seizures = relevantLogs.filter(log => log.symptomId === 'sle-seizures');
  const psychosis = relevantLogs.filter(log => log.symptomId === 'sle-psychosis');

  // Organ involvement
  const kidneySymptoms = relevantLogs.filter(log =>
      ['sle-kidney-involvement', 'sle-proteinuria', 'sle-hematuria', 'sle-edema'].includes(log.symptomId)
  );
  const cardiopulmonary = relevantLogs.filter(log =>
      ['sle-chest-pain-pleurisy', 'sle-pericarditis', 'sle-shortness-breath'].includes(log.symptomId)
  );
  const neurological = relevantLogs.filter(log =>
      ['sle-neurological', 'sle-seizures', 'sle-psychosis', 'sle-cognitive', 'sle-headache-severe'].includes(log.symptomId)
  );
  const hematologic = relevantLogs.filter(log =>
      ['sle-anemia', 'sle-low-platelets', 'sle-low-white-cells', 'sle-bruising'].includes(log.symptomId)
  );

  // Constitutional symptoms
  const fatigue = relevantLogs.filter(log =>
      ['sle-fatigue-severe', 'sle-fatigue-moderate'].includes(log.symptomId)
  );
  const severeFatigue = relevantLogs.filter(log => log.symptomId === 'sle-fatigue-severe');

  // Skin manifestations
  const skinSymptoms = relevantLogs.filter(log =>
      ['sle-malar-rash', 'sle-discoid-rash', 'sle-photosensitivity', 'sle-oral-ulcers', 'sle-skin-lesions', 'sle-hair-loss'].includes(log.symptomId)
  );

  // Joint symptoms
  const jointSymptoms = relevantLogs.filter(log =>
      ['sle-joint-pain', 'sle-joint-swelling', 'sle-arthritis'].includes(log.symptomId)
  );

  // Treatment intensity
  const steroidBursts = relevantLogs.filter(log => log.symptomId === 'sle-steroid-use');
  const immunosuppressants = relevantLogs.filter(log => log.symptomId === 'sle-immunosuppressant');

  // Calculate average severity
  const avgSeverity = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / relevantLogs.length
      : 0;

  // Determine flare characteristics
  // Group flares by approximate time to identify distinct episodes
  const flareEpisodes = identifyFlareEpisodes(allFlares);
  const weekLongFlares = flareEpisodes.filter(ep => ep.durationDays >= 7);

  // Determine rating
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 100% criteria: Acute with frequent exacerbations, severe health impairment
  const hasFrequentSevereFlares = acuteFlares.length >= 4 || (acuteFlares.length >= 2 && hospitalizations.length >= 2);
  const hasMajorOrganInvolvement = kidneySymptoms.length >= 3 || neurological.length >= 3 || cardiopulmonary.length >= 3;
  const hasSevereHealthImpairment = hospitalizations.length >= 2 || (acuteFlares.length >= 3 && severeFatigue.length >= 5);

  if (hasFrequentSevereFlares && hasSevereHealthImpairment) {
    supportedRating = 100;
    rationale.push('Frequent severe exacerbations documented');
    if (hospitalizations.length > 0) {
      rationale.push(`${hospitalizations.length} hospitalization(s) for SLE`);
    }
    if (hasMajorOrganInvolvement) {
      rationale.push('Major organ involvement documented');
    }
    rationale.push('Severe impairment of overall health indicated');
  }
  // 60% criteria: Exacerbations lasting >=1 week, 2-3 times per year
  else if (weekLongFlares.length >= 2 || (allFlares.length >= 2 && steroidBursts.length >= 2)) {
    supportedRating = 60;
    rationale.push(`${weekLongFlares.length >= 2 ? weekLongFlares.length : allFlares.length} significant flare episodes documented`);
    if (weekLongFlares.length >= 2) {
      rationale.push('Flares lasting a week or more documented');
    }
    if (steroidBursts.length > 0) {
      rationale.push(`${steroidBursts.length} steroid burst(s) required`);
    }
    rationale.push('Meets criteria for 2-3 exacerbations per year');
  }
  // 10% criteria: 1-2 exacerbations per year OR symptomatic in past 2 years
  else if (allFlares.length >= 1 || twoYearLogs.length > 0) {
    supportedRating = 10;
    if (allFlares.length >= 1) {
      rationale.push(`${allFlares.length} flare(s) documented in past year`);
    } else {
      rationale.push('Symptomatic during the past 2 years');
    }
    rationale.push('SLE diagnosis with ongoing symptoms/periodic flares');
  }

  // Add symptom details to rationale
  if (kidneySymptoms.length > 0) {
    rationale.push(`Kidney involvement documented (${kidneySymptoms.length} entries) - consider separate rating`);
  }
  if (neurological.length > 0) {
    rationale.push(`Neurological symptoms documented (${neurological.length} entries)`);
  }
  if (skinSymptoms.length > 0) {
    rationale.push(`Skin manifestations documented (${skinSymptoms.length} entries)`);
  }
  if (jointSymptoms.length > 0) {
    rationale.push(`Joint involvement documented (${jointSymptoms.length} entries)`);
  }

  // Evidence gaps
  if (allFlares.length === 0) {
    evidenceGaps.push('Log flare episodes with start dates and duration to establish exacerbation pattern');
  }
  if (weekLongFlares.length < 2 && supportedRating < 60) {
    evidenceGaps.push('Document flare duration (>=1 week flares support 60% rating)');
  }
  if (hospitalizations.length === 0 && erVisits.length === 0 && supportedRating < 100) {
    evidenceGaps.push('Document any hospitalizations or ER visits for SLE');
  }
  if (kidneySymptoms.length === 0) {
    evidenceGaps.push('If you have kidney involvement, document proteinuria/hematuria for potential separate rating');
  }
  if (immunosuppressants.length === 0) {
    evidenceGaps.push('Document immunosuppressive therapy if prescribed');
  }
  evidenceGaps.push('Consider calculating combined rating for all affected body systems vs. DC 6350 alone');

  return {
    hasData: true,
    condition: 'Systemic Lupus Erythematosus (SLE)',
    diagnosticCode: '6350',
    cfrReference: '38 CFR 4.88b',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      flareCount: allFlares.length,
      acuteFlares: acuteFlares.length,
      moderateFlares: moderateFlares.length,
      weekLongFlares: weekLongFlares.length,
      hospitalizations: hospitalizations.length,
      kidneySymptoms: kidneySymptoms.length,
      neurologicalSymptoms: neurological.length,
      cardiopulmonarySymptoms: cardiopulmonary.length,
      skinSymptoms: skinSymptoms.length,
      jointSymptoms: jointSymptoms.length,
      steroidBursts: steroidBursts.length,
      twoYearSymptomCount: twoYearLogs.length,
    },
    criteria: SYSTEMIC_LUPUS_CRITERIA,
  };
};

/**
 * Analyze Tuberculosis symptom logs against VA rating criteria
 * Handles Active (DC 6730), Inactive (DC 6731), and Miliary (DC 6311)
 */

export const analyzeAvitaminosisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomPrefix = 'avitaminosis-';

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomId.startsWith(symptomPrefix);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Avitaminosis',
      diagnosticCode: '6313',
      message: 'No avitaminosis symptoms logged',
      criteria: AVITAMINOSIS_CRITERIA,
    };
  }

  // Check for symptoms
  const hasStomatitis = relevantLogs.some(log => log.symptomId === 'avitaminosis-stomatitis');
  const hasDiarrhea = relevantLogs.some(log => log.symptomId === 'avitaminosis-diarrhea');
  const hasAchlorhydria = relevantLogs.some(log => log.symptomId === 'avitaminosis-achlorhydria');
  const hasSymmetricalDermatitis = relevantLogs.some(log => log.symptomId === 'avitaminosis-dermatitis-symmetrical');
  const hasMoistDermatitis = relevantLogs.some(log => log.symptomId === 'avitaminosis-dermatitis-moist');
  const hasMentalChanges = relevantLogs.some(log =>
      ['avitaminosis-mental-changes', 'avitaminosis-confusion', 'avitaminosis-depression',
        'avitaminosis-memory-problems', 'avitaminosis-irritability', 'avitaminosis-concentration-difficulty'].includes(log.symptomId)
  );
  const hasExhaustion = relevantLogs.some(log => log.symptomId === 'avitaminosis-exhaustion');
  const hasCachexia = relevantLogs.some(log => log.symptomId === 'avitaminosis-cachexia');
  const hasInabilityRetain = relevantLogs.some(log => log.symptomId === 'avitaminosis-inability-retain-nourishment');
  const hasImpairedVigor = relevantLogs.some(log =>
      ['avitaminosis-impaired-vigor', 'avitaminosis-weakness', 'avitaminosis-fatigue'].includes(log.symptomId)
  );
  const hasNonspecific = relevantLogs.some(log =>
      ['avitaminosis-appetite-loss', 'avitaminosis-weight-loss', 'avitaminosis-abdominal-discomfort',
        'avitaminosis-weakness', 'avitaminosis-concentration-difficulty', 'avitaminosis-irritability'].includes(log.symptomId)
  );

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 100%: All severe symptoms
  if (hasMentalChanges && hasMoistDermatitis && hasInabilityRetain && hasExhaustion && hasCachexia) {
    supportedRating = 100;
    rationale.push('Marked mental changes documented');
    rationale.push('Moist dermatitis documented');
    rationale.push('Inability to retain adequate nourishment');
    rationale.push('Exhaustion documented');
    rationale.push('Cachexia (severe wasting) documented');
  }
  // 60%: Stomatitis + diarrhea + dermatitis + mental + impaired vigor
  else if (hasStomatitis && hasDiarrhea && hasSymmetricalDermatitis && hasMentalChanges && hasImpairedVigor) {
    supportedRating = 60;
    rationale.push('Stomatitis, diarrhea, and symmetrical dermatitis present');
    rationale.push('Mental symptoms documented');
    rationale.push('Impaired bodily vigor documented');
  }
  // 40%: Stomatitis + diarrhea + dermatitis
  else if (hasStomatitis && hasDiarrhea && hasSymmetricalDermatitis) {
    supportedRating = 40;
    rationale.push('Stomatitis documented');
    rationale.push('Diarrhea documented');
    rationale.push('Symmetrical dermatitis documented');
    if (!hasMentalChanges) evidenceGaps.push('Document mental symptoms if present for higher rating');
  }
  // 20%: Stomatitis OR achlorhydria OR diarrhea
  else if (hasStomatitis || hasAchlorhydria || hasDiarrhea) {
    supportedRating = 20;
    if (hasStomatitis) rationale.push('Stomatitis documented');
    if (hasAchlorhydria) rationale.push('Achlorhydria documented');
    if (hasDiarrhea) rationale.push('Diarrhea documented');
    evidenceGaps.push('Document all three (stomatitis, diarrhea, dermatitis) for 40% rating');
  }
  // 10%: Nonspecific symptoms
  else if (hasNonspecific) {
    supportedRating = 10;
    rationale.push('Nonspecific vitamin deficiency symptoms present');
    evidenceGaps.push('Document specific symptoms (stomatitis, diarrhea, achlorhydria) for higher rating');
  }

  // General evidence gaps
  if (!hasMoistDermatitis && !hasSymmetricalDermatitis) {
    evidenceGaps.push('Document dermatitis type and distribution');
  }

  return {
    hasData: true,
    condition: 'Avitaminosis',
    diagnosticCode: '6313',
    cfrReference: '38 CFR 4.88b',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      hasStomatitis,
      hasDiarrhea,
      hasDermatitis: hasSymmetricalDermatitis || hasMoistDermatitis,
      hasMentalChanges,
      hasCachexia,
    },
    criteria: AVITAMINOSIS_CRITERIA,
  };
};

/**
 * Analyze Beriberi symptoms against VA rating criteria
 * DC 6314
 */

export const analyzeBeriberiLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomPrefix = 'beriberi-';

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomId.startsWith(symptomPrefix);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Beriberi',
      diagnosticCode: '6314',
      message: 'No beriberi symptoms logged',
      criteria: BERIBERI_CRITERIA,
    };
  }

  // 100% criteria
  const hasCHF = relevantLogs.some(log => log.symptomId === 'beriberi-chf');
  const hasAnasarca = relevantLogs.some(log => log.symptomId === 'beriberi-anasarca');
  const hasWernickeKorsakoff = relevantLogs.some(log => log.symptomId === 'beriberi-wernicke-korsakoff');

  // 60% criteria
  const hasCardiomegaly = relevantLogs.some(log => log.symptomId === 'beriberi-cardiomegaly');
  const hasFootdrop = relevantLogs.some(log => log.symptomId === 'beriberi-footdrop');
  const hasThighAtrophy = relevantLogs.some(log => log.symptomId === 'beriberi-muscle-atrophy-thigh');
  const hasCalfAtrophy = relevantLogs.some(log => log.symptomId === 'beriberi-muscle-atrophy-calf');

  // 30% criteria
  const hasAbsentKneeJerk = relevantLogs.some(log => log.symptomId === 'beriberi-absent-knee-jerk');
  const hasAbsentAnkleJerk = relevantLogs.some(log => log.symptomId === 'beriberi-absent-ankle-jerk');
  const hasSensationLoss = relevantLogs.some(log => log.symptomId === 'beriberi-sensation-loss');
  const hasGeneralSymptoms = relevantLogs.some(log =>
      ['beriberi-weakness', 'beriberi-fatigue', 'beriberi-anorexia', 'beriberi-dizziness',
        'beriberi-leg-heaviness', 'beriberi-leg-stiffness', 'beriberi-headache', 'beriberi-sleep-disturbance'].includes(log.symptomId)
  );
  const hasNeuropathy = relevantLogs.some(log => log.symptomId === 'beriberi-neuropathy');

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 100%: CHF, anasarca, or Wernicke-Korsakoff
  if (hasCHF || hasAnasarca || hasWernickeKorsakoff) {
    supportedRating = 100;
    if (hasCHF) rationale.push('Congestive heart failure documented (wet beriberi)');
    if (hasAnasarca) rationale.push('Anasarca (severe generalized edema) documented');
    if (hasWernickeKorsakoff) rationale.push('Wernicke-Korsakoff syndrome documented');
  }
  // 60%: Cardiomegaly OR footdrop OR muscle atrophy
  else if (hasCardiomegaly || hasFootdrop || hasThighAtrophy || hasCalfAtrophy) {
    supportedRating = 60;
    if (hasCardiomegaly) rationale.push('Cardiomegaly documented');
    if (hasFootdrop) rationale.push('Footdrop documented');
    if (hasThighAtrophy) rationale.push('Thigh muscle atrophy documented');
    if (hasCalfAtrophy) rationale.push('Calf muscle atrophy documented');
  }
  // 30%: Absent reflexes with sensation loss OR general symptoms
  else if ((hasAbsentKneeJerk || hasAbsentAnkleJerk) && hasSensationLoss) {
    supportedRating = 30;
    rationale.push('Absent reflexes with loss of sensation documented');
    if (hasNeuropathy) rationale.push('Peripheral neuropathy documented');
  }
  else if (hasGeneralSymptoms || hasNeuropathy) {
    supportedRating = 30;
    rationale.push('General beriberi symptoms documented');
    if (hasNeuropathy) rationale.push('Peripheral neuropathy documented');
    evidenceGaps.push('Document reflex testing and sensation examination');
  }

  // Evidence gaps
  if (supportedRating < 60 && !hasFootdrop && !hasThighAtrophy && !hasCalfAtrophy) {
    evidenceGaps.push('Document footdrop or muscle atrophy if present for higher rating');
  }
  if (supportedRating < 100 && !hasCHF && !hasWernickeKorsakoff) {
    evidenceGaps.push('Document cardiac involvement or Wernicke-Korsakoff if present');
  }

  return {
    hasData: true,
    condition: 'Beriberi',
    diagnosticCode: '6314',
    cfrReference: '38 CFR 4.88b',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      wetBeriberi: hasCHF || hasCardiomegaly || hasAnasarca,
      dryBeriberi: hasNeuropathy || hasFootdrop || hasThighAtrophy || hasCalfAtrophy,
      wernickeKorsakoff: hasWernickeKorsakoff,
      hasCardiacInvolvement: hasCHF || hasCardiomegaly,
      hasNeurologicalInvolvement: hasNeuropathy || hasFootdrop || hasSensationLoss,
    },
    criteria: BERIBERI_CRITERIA,
  };
};

/**
 * Analyze Pellagra symptoms against VA rating criteria
 * DC 6315 - identical criteria to Avitaminosis
 */

export const analyzePellagraLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomPrefix = 'pellagra-';

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomId.startsWith(symptomPrefix);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Pellagra',
      diagnosticCode: '6315',
      message: 'No pellagra symptoms logged',
      criteria: PELLAGRA_CRITERIA,
    };
  }

  // Check for symptoms
  const hasStomatitis = relevantLogs.some(log => log.symptomId === 'pellagra-stomatitis');
  const hasDiarrhea = relevantLogs.some(log => log.symptomId === 'pellagra-diarrhea');
  const hasAchlorhydria = relevantLogs.some(log => log.symptomId === 'pellagra-achlorhydria');
  const hasSymmetricalDermatitis = relevantLogs.some(log => log.symptomId === 'pellagra-dermatitis-symmetrical');
  const hasMoistDermatitis = relevantLogs.some(log => log.symptomId === 'pellagra-dermatitis-moist');
  const hasPhotosensitive = relevantLogs.some(log => log.symptomId === 'pellagra-dermatitis-photosensitive');
  const hasCasalNecklace = relevantLogs.some(log => log.symptomId === 'pellagra-casal-necklace');
  const hasMentalChanges = relevantLogs.some(log =>
      ['pellagra-mental-changes', 'pellagra-dementia', 'pellagra-confusion',
        'pellagra-depression', 'pellagra-psychosis', 'pellagra-irritability',
        'pellagra-memory-problems'].includes(log.symptomId)
  );
  const hasExhaustion = relevantLogs.some(log => log.symptomId === 'pellagra-exhaustion');
  const hasCachexia = relevantLogs.some(log => log.symptomId === 'pellagra-cachexia');
  const hasInabilityRetain = relevantLogs.some(log => log.symptomId === 'pellagra-inability-retain-nourishment');
  const hasImpairedVigor = relevantLogs.some(log =>
      ['pellagra-impaired-vigor', 'pellagra-weakness', 'pellagra-fatigue'].includes(log.symptomId)
  );
  const hasNonspecific = relevantLogs.some(log =>
      ['pellagra-appetite-loss', 'pellagra-weight-loss', 'pellagra-abdominal-discomfort',
        'pellagra-weakness', 'pellagra-concentration-difficulty', 'pellagra-irritability'].includes(log.symptomId)
  );

  // Any dermatitis counts
  const hasDermatitis = hasSymmetricalDermatitis || hasMoistDermatitis || hasPhotosensitive || hasCasalNecklace;

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 100%: All severe symptoms
  if (hasMentalChanges && hasMoistDermatitis && hasInabilityRetain && hasExhaustion && hasCachexia) {
    supportedRating = 100;
    rationale.push('Marked mental changes documented (dementia)');
    rationale.push('Moist dermatitis documented');
    rationale.push('Inability to retain adequate nourishment');
    rationale.push('Exhaustion documented');
    rationale.push('Cachexia (severe wasting) documented');
  }
  // 60%: Stomatitis + diarrhea + dermatitis + mental + impaired vigor
  else if (hasStomatitis && hasDiarrhea && hasDermatitis && hasMentalChanges && hasImpairedVigor) {
    supportedRating = 60;
    rationale.push('Classic pellagra triad present (dermatitis, diarrhea, +stomatitis)');
    rationale.push('Mental symptoms documented');
    rationale.push('Impaired bodily vigor documented');
  }
  // 40%: Stomatitis + diarrhea + dermatitis
  else if (hasStomatitis && hasDiarrhea && hasDermatitis) {
    supportedRating = 40;
    rationale.push('Stomatitis documented');
    rationale.push('Diarrhea documented');
    rationale.push('Dermatitis documented');
    if (hasCasalNecklace) rationale.push('Casal\'s necklace present (pathognomonic)');
    if (!hasMentalChanges) evidenceGaps.push('Document mental symptoms if present for higher rating');
  }
  // 20%: Stomatitis OR achlorhydria OR diarrhea
  else if (hasStomatitis || hasAchlorhydria || hasDiarrhea) {
    supportedRating = 20;
    if (hasStomatitis) rationale.push('Stomatitis documented');
    if (hasAchlorhydria) rationale.push('Achlorhydria documented');
    if (hasDiarrhea) rationale.push('Diarrhea documented');
    evidenceGaps.push('Document complete triad (stomatitis, diarrhea, dermatitis) for 40% rating');
  }
  // 10%: Nonspecific symptoms
  else if (hasNonspecific || hasDermatitis) {
    supportedRating = 10;
    rationale.push('Pellagra symptoms present');
    if (hasPhotosensitive) rationale.push('Photosensitive dermatitis documented');
    evidenceGaps.push('Document specific symptoms (stomatitis, diarrhea) for higher rating');
  }

  // Special note for Casal's necklace
  if (hasCasalNecklace) {
    rationale.push('Casal\'s necklace is pathognomonic (diagnostic) for pellagra');
  }

  return {
    hasData: true,
    condition: 'Pellagra',
    diagnosticCode: '6315',
    cfrReference: '38 CFR 4.88b',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      hasStomatitis,
      hasDiarrhea,
      hasDermatitis,
      hasCasalNecklace,
      hasMentalChanges,
      hasCachexia,
      classicTriad: hasDermatitis && hasDiarrhea && hasMentalChanges,
    },
    criteria: PELLAGRA_CRITERIA,
  };
};

// ============================================
// GYNECOLOGICAL CONDITION ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyzes Vulva/Clitoris Disease logs (DC 7610)
 * Uses General Rating Formula for DC 7610-7615
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