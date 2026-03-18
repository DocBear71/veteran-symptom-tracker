/* eslint-disable no-unused-vars */

// ============================================
// NEUROLOGICAL RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: Migraine, TBI, Radiculopathy, Peripheral Neuropathy,
// Chronic Fatigue, Insomnia, Epilepsy (5 types), Tinnitus,
// Fibromyalgia, Multiple Sclerosis, Parkinson's Disease,
// Myasthenia Gravis, Narcolepsy, ALS, Syringomyelia, Myelitis,
// all Peripheral Nerve conditions, Loss of Smell/Taste,
// and Foot/Gait neurological conditions.
//
// Based on 38 CFR Part 4, §§ 4.97, 4.124a
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

// ============================================
// SHARED HELPERS
// ============================================

/**
 * Safely get symptom ID from a log entry.
 * Checks both log.symptomId and log. Symptom for backward compatibility.
 */
const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

/**
 * Check if a timestamp falls within the evaluation period.
 */
const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

// ============================================
// NEUROLOGICAL CONDITIONS (for CONDITIONS object)
// ============================================
export const NEUROLOGICAL_CONDITIONS = {
  MIGRAINE: {
    id: 'migraine',
    name: 'Migraine',
    diagnosticCode: '8100',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['migraine'],
  },
  TBI: {
    id: 'tbi',
    name: 'Traumatic Brain Injury (TBI)',
    diagnosticCode: '8045',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [ 'tbi-memory', 'tbi-concentration', 'tbi-confusion', 'tbi-headache', 'tbi-mood', 'tbi-sleep'],
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
  INSOMNIA: {
    id: 'insomnia',
    name: 'Insomnia (Sleep Disorder)',
    diagnosticCode: '8108',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['insomnia-difficulty-falling-asleep', 'insomnia-difficulty-staying-asleep', 'insomnia-early-waking', 'insomnia-fatigue', 'insomnia-irritability'],
  },
  EPILEPSY_MAJOR: {
    id: 'epilepsy-major',
    name: 'Epilepsy, Grand Mal',
    diagnosticCode: '8910',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [ 'seizure-major', 'seizure-partial', 'seizure-psychomotor', 'aura-pre-seizure'],
  },
  EPILEPSY_MINOR: {
    id: 'epilepsy-minor',
    name: 'Epilepsy, Petit Mal',
    diagnosticCode: '8911',
    cfrReference: '38 CFR 4.124a',
    symptomIds: ['seizure-minor', 'aura-pre-seizure'],
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
    symptomIds: ['fibro-widespread-pain', 'fibro-tender-points', 'fibro-fatigue', 'fibro-sleep', 'fibro-stiffness', 'fibro-cognitive'
    ],
  },
  MULTIPLE_SCLEROSIS: {
    id: 'multiple-sclerosis',
    name: 'Multiple Sclerosis',
    diagnosticCode: '8018',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'ms-fatigue', 'ms-numbness-tingling', 'ms-vision-problems', 'ms-double-vision',
      'ms-muscle-weakness', 'ms-spasticity', 'ms-balance-problems', 'ms-cognitive-fog',
      'ms-bladder-dysfunction', 'ms-bowel-dysfunction', 'ms-heat-sensitivity',
      'ms-lhermittes-sign', 'ms-pain', 'ms-tremor', 'ms-speech-difficulty',
      'ms-swallowing-difficulty', 'ms-relapse', 'ms-vertigo', 'ms-depression',
      'ms-walking-difficulty',
    ],
  },
  PARKINSONS_DISEASE: {
    id: 'parkinsons-disease',
    name: "Parkinson's Disease",
    diagnosticCode: '8004',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'pd-resting-tremor', 'pd-rigidity', 'pd-bradykinesia', 'pd-postural-instability',
      'pd-freezing-gait', 'pd-shuffling-walk', 'pd-masked-face', 'pd-soft-speech',
      'pd-micrographia', 'pd-sleep-disturbance', 'pd-rem-sleep-disorder', 'pd-depression',
      'pd-anxiety', 'pd-cognitive-changes', 'pd-constipation', 'pd-urinary-problems',
      'pd-swallowing-difficulty', 'pd-drooling', 'pd-loss-smell', 'pd-fatigue',
      'pd-pain', 'pd-falls', 'pd-off-episodes', 'pd-dyskinesia',
    ],
  },
  MYASTHENIA_GRAVIS: {
    id: 'myasthenia-gravis',
    name: 'Myasthenia Gravis',
    diagnosticCode: '8025',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'mg-ptosis', 'mg-diplopia', 'mg-facial-weakness', 'mg-difficulty-chewing',
      'mg-difficulty-swallowing', 'mg-slurred-speech', 'mg-limb-weakness',
      'mg-neck-weakness', 'mg-respiratory-weakness', 'mg-fatigue-activity',
      'mg-improvement-rest', 'mg-crisis', 'mg-hospitalization', 'mg-voice-fatigue',
      'mg-arm-elevation-difficulty',
    ],
  },
  NARCOLEPSY: {
    id: 'narcolepsy',
    name: 'Narcolepsy',
    diagnosticCode: '8108',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'narco-sleep-attack', 'narco-excessive-sleepiness', 'narco-cataplexy',
      'narco-sleep-paralysis', 'narco-hypnagogic-hallucination', 'narco-hypnopompic-hallucination',
      'narco-disrupted-sleep', 'narco-automatic-behavior', 'narco-memory-problems',
      'narco-difficulty-concentrating', 'narco-microsleep',
    ],
  },
  ALS: {
    id: 'als',
    name: 'Amyotrophic Lateral Sclerosis (ALS)',
    diagnosticCode: '8017',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'als-muscle-weakness', 'als-fasciculations', 'als-muscle-cramps', 'als-spasticity',
      'als-difficulty-speaking', 'als-difficulty-swallowing', 'als-respiratory-difficulty',
      'als-fatigue', 'als-muscle-atrophy', 'als-hand-weakness', 'als-foot-drop',
      'als-tripping-falling', 'als-emotional-lability', 'als-drooling', 'als-weight-loss',
    ],
  },
  SYRINGOMYELIA: {
    id: 'syringomyelia',
    name: 'Syringomyelia',
    diagnosticCode: '8024',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'syring-pain', 'syring-weakness', 'syring-sensory-loss', 'syring-temp-insensitivity',
      'syring-pain-insensitivity', 'syring-muscle-wasting', 'syring-stiffness',
      'syring-headache', 'syring-numbness-tingling', 'syring-bowel-bladder', 'syring-scoliosis',
    ],
  },
  MYELITIS: {
    id: 'myelitis',
    name: 'Myelitis',
    diagnosticCode: '8010',
    cfrReference: '38 CFR 4.124a',
    symptomIds: [
      'myel-weakness', 'myel-sensory-changes', 'myel-bladder-dysfunction',
      'myel-bowel-dysfunction', 'myel-pain', 'myel-spasticity', 'myel-fatigue',
      'myel-numbness', 'myel-tingling', 'myel-band-sensation', 'myel-sexual-dysfunction',
      'myel-paralysis',
    ],
  },
  RADIAL_NERVE: {
    id: 'radial-nerve',
    name: 'Radial Nerve (Musculospiral)',
    diagnosticCodes: { paralysis: '8514', neuritis: '8614', neuralgia: '8714' },
    symptomIds: [
      'radn-wrist-drop', 'radn-finger-drop', 'radn-extension-weakness',
      'radn-supination-weakness', 'radn-thumb-extension-loss', 'radn-grip-weakness',
      'radn-numbness', 'radn-tingling', 'radn-pain', 'radn-muscle-atrophy'
    ]
  },
  SCIATIC_NERVE: {
    id: 'sciatic-nerve',
    name: 'Sciatic Nerve',
    diagnosticCodes: { paralysis: '8520', neuritis: '8620', neuralgia: '8720' },
    symptomIds: [
      'scin-radiating-pain', 'scin-leg-weakness', 'scin-foot-drop',
      'scin-knee-flexion-weakness', 'scin-numbness', 'scin-tingling', 'scin-burning',
      'scin-muscle-atrophy', 'scin-difficulty-walking', 'scin-sitting-pain'
    ]
  },
  TIBIAL_NERVE: {
    id: 'tibial-nerve',
    name: 'Tibial (Internal Popliteal) Nerve',
    diagnosticCodes: { paralysis: '8524', neuritis: '8624', neuralgia: '8724' },
    symptomIds: [
      'tibn-plantar-flexion-weakness', 'tibn-toe-flexion-weakness',
      'tibn-foot-inversion-weakness', 'tibn-calf-weakness', 'tibn-difficulty-walking-tiptoe',
      'tibn-numbness', 'tibn-tingling', 'tibn-burning', 'tibn-muscle-atrophy'
    ]
  },
  FEMORAL_NERVE: {
    id: 'femoral-nerve',
    name: 'Femoral (Anterior Crural) Nerve',
    diagnosticCodes: { paralysis: '8526', neuritis: '8626', neuralgia: '8726' },
    symptomIds: [
      'femn-quadriceps-weakness', 'femn-knee-extension-weakness', 'femn-knee-buckling',
      'femn-difficulty-stairs', 'femn-difficulty-rising', 'femn-numbness',
      'femn-tingling', 'femn-pain', 'femn-muscle-atrophy'
    ]
  },
  WEAK_FOOT: {
    id: 'weak-foot',
    name: 'Weak Foot (Bilateral)',
    diagnosticCode: '5277',
    cfrReference: '38 CFR 4.71a',
    description: 'Symptomatic condition secondary to constitutional conditions, characterized by atrophy of musculature, disturbed circulation, and weakness',
    symptomIds: [
      'wf-muscle-atrophy', 'wf-weakness', 'wf-circulation-problems', 'wf-numbness',
      'wf-fatigue', 'wf-instability', 'wf-balance-difficulty', 'wf-gait-changes',
      'wf-cramping', 'wf-functional-loss'
    ],
  },
  CLAW_FOOT: {
    id: 'claw-foot',
    name: 'Claw Foot (Pes Cavus)',
    diagnosticCode: '5278',
    cfrReference: '38 CFR 4.71a',
    description: 'Acquired foot deformity with high arch, hammer toes, and structural abnormalities',
    symptomIds: [
      'cf-high-arch', 'cf-hammer-toes', 'cf-toe-dorsiflexion', 'cf-plantar-fascia',
      'cf-dropped-forefoot', 'cf-callosities', 'cf-metatarsal-tenderness', 'cf-varus-deformity',
      'cf-ankle-dorsiflexion-limited', 'cf-shoe-fitting', 'cf-instability', 'cf-functional-loss'
    ],
  },
  LOSS_OF_SMELL: {
    id: 'loss-of-smell',
    name: 'Loss of Smell (Anosmia)',
    diagnosticCode: '6275',
    cfrReference: '38 CFR 4.87a',
    description: 'Complete loss of sense of smell - commonly associated with TBI, COVID-19, nasal conditions, or neurological disorders',
    symptomIds: [
      'smell-complete-loss', 'smell-partial-loss', 'smell-distorted', 'smell-phantom',
      'smell-reduced', 'smell-fluctuating', 'smell-food-taste-affected', 'smell-safety-concern',
      'smell-gas-detection', 'smell-smoke-detection', 'smell-food-spoilage', 'smell-quality-of-life',
      'smell-post-viral', 'smell-post-tbi', 'smell-post-covid', 'smell-chronic',
      'smell-testing-performed', 'smell-treatment-attempted', 'smell-no-improvement'
    ],
  },
  LOSS_OF_TASTE: {
    name: 'Loss of Taste (Ageusia)',
    diagnosticCode: '6276',
    cfrReference: '38 CFR 4.87a',
    description: 'Complete loss of sense of taste - commonly associated with COVID-19, medication side effects, nerve damage, or neurological disorders',
    symptomIds: [
      'taste-complete-loss', 'taste-partial-loss', 'taste-distorted', 'taste-phantom',
      'taste-reduced', 'taste-fluctuating', 'taste-metallic', 'taste-sweet-loss',
      'taste-salty-loss', 'taste-sour-loss', 'taste-bitter-loss', 'taste-umami-loss',
      'taste-quality-of-life', 'taste-appetite-affected', 'taste-weight-change',
      'taste-post-viral', 'taste-post-covid', 'taste-chronic', 'taste-medication-related',
      'taste-testing-performed', 'taste-treatment-attempted', 'taste-no-improvement'
    ],
  },
  UPPER_RADICULAR_GROUP: {
    id: 'upper-radicular-nerve',
    name: 'Upper Radicular Group (C5-C6)',
    diagnosticCodes: { paralysis: '8510', neuritis: '8610', neuralgia: '8710' },
    symptomIds: [
      'uprn-shoulder-weakness', 'uprn-elbow-weakness', 'uprn-shoulder-movement-loss',
      'uprn-elbow-movement-loss', 'uprn-numbness', 'uprn-tingling', 'uprn-pain',
      'uprn-muscle-atrophy', 'uprn-reflex-loss'
    ]
  },
  MIDDLE_RADICULAR_GROUP: {
    id: 'middle-radicular-nerve',
    name: 'Middle Radicular Group (C7)',
    diagnosticCodes: { paralysis: '8511', neuritis: '8611', neuralgia: '8711' },
    symptomIds: [
      'mdrn-arm-weakness', 'mdrn-wrist-extension-weakness', 'mdrn-elbow-extension-weakness',
      'mdrn-finger-extension-weakness', 'mdrn-numbness', 'mdrn-tingling', 'mdrn-pain',
      'mdrn-muscle-atrophy', 'mdrn-reflex-loss'
    ]
  },
  LOWER_RADICULAR_GROUP: {
    id: 'lower-radicular-nerve',
    name: 'Lower Radicular Group (C8-T1)',
    diagnosticCodes: { paralysis: '8512', neuritis: '8612', neuralgia: '8712' },
    symptomIds: [
      'lwrn-hand-weakness', 'lwrn-grip-weakness', 'lwrn-finger-flexion-weakness',
      'lwrn-intrinsic-muscle-weakness', 'lwrn-numbness', 'lwrn-tingling', 'lwrn-pain',
      'lwrn-muscle-atrophy', 'lwrn-clumsiness'
    ]
  },
  ALL_RADICULAR_GROUPS: {
    id: 'all-radicular-nerve',
    name: 'All Radicular Groups (Brachial Plexus)',
    diagnosticCodes: { paralysis: '8513', neuritis: '8613', neuralgia: '8713' },
    symptomIds: [
      'alrn-complete-arm-paralysis', 'alrn-arm-weakness', 'alrn-shoulder-weakness',
      'alrn-elbow-weakness', 'alrn-wrist-weakness', 'alrn-hand-weakness',
      'alrn-numbness', 'alrn-tingling', 'alrn-pain', 'alrn-muscle-atrophy'
    ]
  },
  MEDIAN_NERVE: {
    id: 'median-nerve',
    name: 'Median Nerve (Carpal Tunnel)',
    diagnosticCodes: { paralysis: '8515', neuritis: '8615', neuralgia: '8715' },
    symptomIds: [
      'medn-numbness', 'medn-tingling', 'medn-pain', 'medn-night-symptoms',
      'medn-thenar-weakness', 'medn-thenar-atrophy', 'medn-grip-weakness',
      'medn-dropping-objects', 'medn-opposition-weakness', 'medn-pronation-weakness',
      'medn-ape-hand', 'medn-trophic-changes'
    ]
  },
  ULNAR_NERVE: {
    id: 'ulnar-nerve',
    name: 'Ulnar Nerve (Cubital Tunnel)',
    diagnosticCodes: { paralysis: '8516', neuritis: '8616', neuralgia: '8716' },
    symptomIds: [
      'ulnn-numbness', 'ulnn-tingling', 'ulnn-pain', 'ulnn-elbow-pain',
      'ulnn-grip-weakness', 'ulnn-pinch-weakness', 'ulnn-finger-spread-weakness',
      'ulnn-claw-hand', 'ulnn-interossei-atrophy', 'ulnn-hypothenar-atrophy',
      'ulnn-thumb-adduction-weakness', 'ulnn-wrist-flexion-weakness'
    ]
  },
  MUSCULOCUTANEOUS_NERVE: {
    id: 'musculocutaneous-nerve',
    name: 'Musculocutaneous Nerve',
    diagnosticCodes: { paralysis: '8517', neuritis: '8617', neuralgia: '8717' },
    symptomIds: [
      'mscn-biceps-weakness', 'mscn-elbow-flexion-weakness', 'mscn-supination-weakness',
      'mscn-numbness', 'mscn-tingling', 'mscn-pain', 'mscn-muscle-atrophy'
    ]
  },
  CIRCUMFLEX_NERVE: {
    id: 'circumflex-nerve',
    name: 'Circumflex (Axillary) Nerve',
    diagnosticCodes: { paralysis: '8518', neuritis: '8618', neuralgia: '8718' },
    symptomIds: [
      'crcn-shoulder-abduction-weakness', 'crcn-arm-raise-difficulty',
      'crcn-external-rotation-weakness', 'crcn-deltoid-weakness', 'crcn-deltoid-atrophy',
      'crcn-numbness', 'crcn-tingling', 'crcn-pain'
    ]
  },
  LONG_THORACIC_NERVE: {
    id: 'long-thoracic-nerve',
    name: 'Long Thoracic Nerve',
    diagnosticCodes: { paralysis: '8519', neuritis: '8619', neuralgia: '8719' },
    symptomIds: [
      'ltn-winged-scapula', 'ltn-arm-elevation-difficulty', 'ltn-shoulder-weakness',
      'ltn-pushing-difficulty', 'ltn-serratus-weakness', 'ltn-pain', 'ltn-fatigue'
    ]
  },
  COMMON_PERONEAL_NERVE: {
    id: 'common-peroneal-nerve',
    name: 'Common Peroneal (External Popliteal) Nerve',
    diagnosticCodes: { paralysis: '8521', neuritis: '8621', neuralgia: '8721' },
    symptomIds: [
      'cpn-foot-drop', 'cpn-dorsiflexion-weakness', 'cpn-toe-extension-weakness',
      'cpn-eversion-weakness', 'cpn-steppage-gait', 'cpn-tripping',
      'cpn-numbness', 'cpn-tingling', 'cpn-pain', 'cpn-muscle-atrophy'
    ]
  },
  SUPERFICIAL_PERONEAL_NERVE: {
    id: 'superficial-peroneal-nerve',
    name: 'Superficial Peroneal (Musculocutaneous) Nerve',
    diagnosticCodes: { paralysis: '8522', neuritis: '8622', neuralgia: '8722' },
    symptomIds: [
      'spn-eversion-weakness', 'spn-ankle-instability', 'spn-numbness',
      'spn-tingling', 'spn-pain', 'spn-muscle-atrophy'
    ]
  },
  DEEP_PERONEAL_NERVE: {
    id: 'deep-peroneal-nerve',
    name: 'Deep Peroneal (Anterior Tibial) Nerve',
    diagnosticCodes: { paralysis: '8523', neuritis: '8623', neuralgia: '8723' },
    symptomIds: [
      'dpn-dorsiflexion-loss', 'dpn-toe-extension-weakness', 'dpn-foot-drop',
      'dpn-numbness', 'dpn-tingling', 'dpn-pain', 'dpn-muscle-atrophy'
    ]
  },
  POSTERIOR_TIBIAL_NERVE: {
    id: 'posterior-tibial-nerve',
    name: 'Posterior Tibial Nerve',
    diagnosticCodes: { paralysis: '8525', neuritis: '8625', neuralgia: '8725' },
    symptomIds: [
      'ptn-sole-paralysis', 'ptn-toe-flexion-weakness', 'ptn-foot-adduction-weakness',
      'ptn-numbness', 'ptn-tingling', 'ptn-burning', 'ptn-tarsal-tunnel', 'ptn-muscle-atrophy'
    ]
  },
  SAPHENOUS_NERVE: {
    id: 'saphenous-nerve',
    name: 'Saphenous (Internal Saphenous) Nerve',
    diagnosticCodes: { paralysis: '8527', neuritis: '8627', neuralgia: '8727' },
    symptomIds: [
      'sapn-numbness', 'sapn-tingling', 'sapn-pain', 'sapn-burning', 'sapn-hypersensitivity'
    ]
  },
  OBTURATOR_NERVE: {
    id: 'obturator-nerve',
    name: 'Obturator Nerve',
    diagnosticCodes: { paralysis: '8528', neuritis: '8628', neuralgia: '8728' },
    symptomIds: [
      'obtn-thigh-adduction-weakness', 'obtn-groin-pain', 'obtn-medial-thigh-pain',
      'obtn-numbness', 'obtn-tingling', 'obtn-gait-instability', 'obtn-muscle-atrophy'
    ]
  },
  LATERAL_FEMORAL_CUTANEOUS_NERVE: {
    id: 'lateral-femoral-cutaneous-nerve',
    name: 'Lateral Femoral Cutaneous Nerve (Meralgia Paresthetica)',
    diagnosticCodes: { paralysis: '8529', neuritis: '8629', neuralgia: '8729' },
    symptomIds: [
      'lfcn-numbness', 'lfcn-tingling', 'lfcn-burning', 'lfcn-hypersensitivity',
      'lfcn-pain-standing', 'lfcn-pain-walking'
    ]
  },
  ILIOINGUINAL_NERVE: {
    id: 'ilioinguinal-nerve',
    name: 'Ilio-inguinal Nerve',
    diagnosticCodes: { paralysis: '8530', neuritis: '8630', neuralgia: '8730' },
    symptomIds: [
      'iin-groin-numbness', 'iin-genital-numbness', 'iin-inner-thigh-numbness',
      'iin-groin-pain', 'iin-burning', 'iin-hypersensitivity', 'iin-pain-movement'
    ]
  },
  METATARSALGIA: {
    id: 'metatarsalgia',
    name: "Metatarsalgia (Morton's Disease)",
    diagnosticCode: '5279',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'mt-ball-foot-pain', 'mt-numbness-toes', 'mt-burning', 'mt-shooting-pain',
      'mt-walking-pain', 'mt-standing-pain', 'mt-pebble-feeling', 'mt-relief-rest',
      'mt-swelling', 'mt-functional-loss'
    ],
  },
  HALLUX_VALGUS: {
    id: 'hallux-valgus',
    name: 'Hallux Valgus (Bunion)',
    diagnosticCode: '5280',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'hv-bunion-pain', 'hv-deformity', 'hv-redness', 'hv-callus',
      'hv-shoe-pain', 'hv-limited-motion', 'hv-progressive', 'hv-second-toe',
      'hv-post-surgical', 'hv-functional-loss'
    ],
  },
  HALLUX_RIGIDUS: {
    id: 'hallux-rigidus',
    name: 'Hallux Rigidus',
    diagnosticCode: '5281',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [
      'hr-toe-stiffness', 'hr-toe-pain', 'hr-limited-motion', 'hr-bone-spur',
      'hr-walking-pain', 'hr-swelling', 'hr-grinding', 'hr-cold-weather',
      'hr-shoe-difficulty', 'hr-functional-loss'
    ],
  },
};

// ============================================
// NEUROLOGICAL RATING CRITERIA & ANALYZE FUNCTIONS
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

  secondaryConditions: {
    description: 'Peripheral neuropathy can lead to secondary conditions due to loss of sensation and chronic pain.',

    categories: {
      musculoskeletal: {
        name: 'Musculoskeletal Secondaries',
        conditions: [
          {
            manifestation: 'Foot Deformities/Injuries',
            suggestedDCs: ['5284'],
            dcDescriptions: ['Foot injuries, other'],
            nexusStrength: 'moderate',
            notes: 'Loss of sensation leads to unnoticed injuries and deformities.',
            documentationTips: ['Podiatry records', 'Document any foot ulcers or injuries', 'X-rays if applicable'],
          },
          {
            manifestation: 'Gait Instability/Falls',
            suggestedDCs: ['6204'],
            dcDescriptions: ['Peripheral vestibular disorders'],
            nexusStrength: 'moderate',
            notes: 'Proprioception loss affects balance. Document falls.',
            documentationTips: ['Fall history', 'Physical therapy evaluation', 'Balance testing'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health Secondaries',
        conditions: [
          {
            manifestation: 'Depression from Chronic Pain',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Chronic neuropathic pain commonly causes depression.',
            documentationTips: ['Mental health records', 'Document pain impact on mood', 'PHQ-9 scores'],
          },
        ],
      },
    },

    canBeSecondaryTo: [
      {
        primaryDC: '7913',
        primaryCondition: 'Diabetes Mellitus',
        nexusStrength: 'strong',
        notes: 'Most common cause of peripheral neuropathy',
      },
      {
        primaryDC: '6354',
        primaryCondition: 'Chronic Fatigue Syndrome / Gulf War Illness',
        nexusStrength: 'moderate',
        notes: 'Toxic exposures can cause neuropathy',
      },
    ],

    importantNotes: [
      'Each extremity rated separately (bilateral factor may apply)',
      'EMG/nerve conduction studies provide objective evidence',
      'Document functional limitations in detail',
      'Track progression of symptoms over time',
    ],
  },

  disclaimer: 'This analysis is based on logged neuropathy symptoms. Higher ratings require clinical documentation including EMG/nerve conduction studies and sensory/motor testing. Common causes include diabetes, Agent Orange exposure, and various medications.',
};

// ============================================
// MENIERE'S DISEASE RATING CRITERIA (DC 6205)
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

export const EPILEPSY_MAJOR_CRITERIA = {
  diagnosticCode: '8910',
  condition: 'Epilepsy, Grand Mal (Major Seizures)',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8910',

  note: 'A major seizure is characterized by generalized tonic-clonic convulsion with unconsciousness. Seizures must be witnessed or verified by a physician at some time. Frequency can be established by competent lay testimony. On continuous medication, minimum rating is 10%.',

  ratings: [
    {
      percent: 100,
      summary: 'Averaging at least 1 major seizure per month over the last year',
      criteriaDescription: [
        'At least 12 major seizures in the past year (average >=1/month)',
        'Major seizure = generalized tonic-clonic convulsion with unconsciousness',
        'Frequency documented over ordinary conditions of life (not hospitalized)'
      ],
      evidenceNeeded: [
        'Physician diagnosis of epilepsy',
        'Seizure logs showing dates and witnesses',
        'Medical records documenting seizure frequency',
        'Witness statements for observed seizures',
        'Documentation of tonic-clonic characteristics and loss of consciousness'
      ],
    },
    {
      percent: 80,
      summary: 'Averaging at least 1 major seizure in 3 months over the last year',
      criteriaDescription: [
        'At least 4 major seizures in the past year (average >=1 per 3 months)',
        'OR more than 10 minor seizures weekly (see DC 8911)',
        'Pattern of seizures every 3 months or less'
      ],
      evidenceNeeded: [
        'Physician diagnosis',
        'Seizure logs with dates',
        'Witness statements',
        'Medical records confirming frequency pattern'
      ],
    },
    {
      percent: 60,
      summary: 'Averaging at least 1 major seizure in 4 months over the last year',
      criteriaDescription: [
        'At least 3 major seizures in the past year (average >=1 per 4 months)',
        'OR 9-10 minor seizures per week',
        'Regular pattern of seizures'
      ],
      evidenceNeeded: [
        'Physician diagnosis',
        'Documented seizure frequency',
        'Witness accounts',
        'Medical treatment records'
      ],
    },
    {
      percent: 40,
      summary: 'At least 1 major seizure in the last 6 months or 2 in the last year',
      criteriaDescription: [
        'At least 1 major seizure in the last 6 months',
        'OR at least 2 major seizures in the last year',
        'OR averaging 5-8 minor seizures weekly'
      ],
      evidenceNeeded: [
        'Recent seizure documentation',
        'Medical records',
        'Witness statements',
        'Treatment history'
      ],
    },
    {
      percent: 20,
      summary: 'At least 1 major seizure in the last 2 years',
      criteriaDescription: [
        'At least 1 major seizure in the last 2 years',
        'OR at least 2 minor seizures in the last 6 months',
        'Less frequent but documented seizure activity'
      ],
      evidenceNeeded: [
        'Medical records of seizure(s)',
        'Physician documentation',
        'Witness accounts if available'
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis of epilepsy with history of seizures',
      criteriaDescription: [
        'Confirmed epilepsy diagnosis by physician',
        'History of seizures documented',
        'Currently on continuous medication for seizure control',
        'Minimum rating when on medication'
      ],
      evidenceNeeded: [
        'Epilepsy diagnosis from physician',
        'EEG or other diagnostic tests',
        'Medication list showing anti-epileptic drugs',
        'Medical history documenting past seizures'
      ],
    },
  ],

  definitions: {
    majorSeizure: {
      term: 'Major Seizure',
      definition: 'Generalized tonic-clonic convulsion (grand mal) with unconsciousness. Characterized by violent muscle contractions, loss of consciousness, and post-ictal confusion. Must be witnessed or verified by a physician.'
    },
    continuousMedication: {
      term: 'Continuous Medication',
      definition: 'Ongoing prescription anti-epileptic drugs required for seizure control. When medication is necessary, the minimum rating is 10% even without recent seizures.'
    },
    witnessedSeizure: {
      term: 'Witnessed/Verified Seizure',
      definition: 'Seizure observed by another person (witness statement) or verified by a physician through examination, EEG, or medical records. Required for VA rating.'
    },
  },
};

// ============================================
// EPILEPSY - MINOR SEIZURES (DC 8911)
// ============================================
// Petit Mal (Absence) and Other Minor Seizures
// Rated based on frequency of minor seizures

export const EPILEPSY_MINOR_CRITERIA = {
  diagnosticCode: '8911',
  condition: 'Epilepsy, Petit Mal (Minor Seizures)',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8911',

  note: 'A minor seizure consists of brief interruption in consciousness or conscious control: "pure" petit mal (staring, rhythmic blinking, nodding), myoclonic type (sudden jerking movements), or akinetic type (sudden loss of postural control). Use same rating formula as major seizures.',

  ratings: [
    {
      percent: 100,
      summary: 'Averaging at least 1 major seizure per month (or minor seizure equivalent)',
      criteriaDescription: [
        'More than 10 minor seizures weekly over the last year',
        'Severe frequency of absence or myoclonic seizures',
        'Significantly impairs daily functioning'
      ],
      evidenceNeeded: [
        'Physician diagnosis of petit mal epilepsy',
        'Detailed seizure logs showing frequency',
        'EEG findings consistent with absence seizures',
        'Witness accounts of episodes',
        'Impact on work/social functioning'
      ],
    },
    {
      percent: 80,
      summary: 'More than 10 minor seizures weekly',
      criteriaDescription: [
        'Greater than 10 minor seizures per week',
        'Frequent brief lapses in consciousness',
        'Regular pattern documented'
      ],
      evidenceNeeded: [
        'Physician diagnosis',
        'Seizure frequency logs',
        'EEG documentation',
        'Treatment records'
      ],
    },
    {
      percent: 60,
      summary: '9-10 minor seizures per week',
      criteriaDescription: [
        '9-10 minor seizures weekly on average',
        'Frequent absence or myoclonic episodes',
        'Documented pattern over time'
      ],
      evidenceNeeded: [
        'Detailed seizure logs',
        'Medical documentation',
        'EEG findings',
        'Witness statements'
      ],
    },
    {
      percent: 40,
      summary: 'Averaging 5-8 minor seizures weekly',
      criteriaDescription: [
        '5-8 minor seizures per week on average',
        'Regular episodes of brief consciousness disruption',
        'Documented over extended period'
      ],
      evidenceNeeded: [
        'Seizure frequency documentation',
        'Medical records',
        'EEG results',
        'Treatment history'
      ],
    },
    {
      percent: 20,
      summary: 'At least 2 minor seizures in the last 6 months',
      criteriaDescription: [
        'At least 2 minor seizures in the last 6 months',
        'Less frequent but documented episodes',
        'May be controlled with medication'
      ],
      evidenceNeeded: [
        'Medical documentation of episodes',
        'Physician notes',
        'Medication records'
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis with history of minor seizures',
      criteriaDescription: [
        'Confirmed diagnosis of petit mal epilepsy',
        'History of minor seizures',
        'Currently on continuous medication',
        'Minimum rating when on medication'
      ],
      evidenceNeeded: [
        'Epilepsy diagnosis',
        'EEG showing absence seizure pattern',
        'Medication list',
        'Medical history'
      ],
    },
  ],

  definitions: {
    minorSeizure: {
      term: 'Minor Seizure',
      definition: 'Brief interruption in consciousness or conscious control. Includes: (1) Pure petit mal - staring, rhythmic blinking, nodding; (2) Myoclonic - sudden jerking movements of arms, trunk, or head; (3) Akinetic - sudden loss of postural control.'
    },
    absenceSeizure: {
      term: 'Absence (Petit Mal) Seizure',
      definition: 'Brief lapse in awareness, typically 5-30 seconds. Person may stare blankly, have subtle eye movements, or slight nodding. No memory of the episode. Common in childhood but can persist into adulthood.'
    },
    myoclonicSeizure: {
      term: 'Myoclonic Seizure',
      definition: 'Sudden, brief jerking movements of muscles. Can affect arms, legs, or entire body. Person remains conscious. May occur in clusters.'
    },
  },
};


// ============================================
// PHASE 1D: EPILEPSY EXPANSION CRITERIA
// ============================================

// EPILEPSY - JACKSONIAN/FOCAL (DC 8912)

export const EPILEPSY_JACKSONIAN_CRITERIA = {
  diagnosticCode: '8912',
  condition: 'Epilepsy, Jacksonian and Focal Motor or Sensory',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8912',
  description: 'Focal epilepsy characterized by seizures beginning in one area of the body (motor) or with sensory symptoms, which may spread (Jacksonian march). Rate as minor seizures, except when major seizures predominate.',
  note: 'Per 38 CFR 4.124a: "Rate as minor seizures, except in the presence of major and minor seizures, rate the predominating type." Jacksonian seizures that secondarily generalize to tonic-clonic (grand mal) should be rated as major seizures.',
  disclaimer: 'This analysis is for documentation purposes only. The VA determines final ratings based on complete medical evidence, C&P examination findings, and the predominating seizure type.',
  ratings: [
    {
      percent: 100,
      summary: 'Averaging at least 1 major seizure per month over the last year',
      requirements: [
        'Secondary generalization to tonic-clonic convulsions with unconsciousness',
        'Average of 1+ generalized seizure per month for 12 months',
        'Medical documentation of seizure frequency',
      ],
      note: 'Only applicable when focal seizures predominantly secondarily generalize',
    },
    {
      percent: 80,
      summary: 'At least 1 major seizure in 3 months over the last year; OR more than 10 minor seizures weekly',
      requirements: [
        'Average 1 major (generalized) seizure every 3 months, OR',
        'More than 10 focal seizures per week',
      ],
    },
    {
      percent: 60,
      summary: 'At least 1 major seizure in 4 months over the last year; OR 9-10 minor seizures per week',
      requirements: [
        'Average 1 major seizure every 4 months, OR',
        '9-10 focal seizures per week',
      ],
    },
    {
      percent: 40,
      summary: 'At least 1 major seizure in last 6 months or 2 in last year; OR 5-8 minor seizures weekly',
      requirements: [
        '1+ major seizure in last 6 months OR 2+ in last year, OR',
        '5-8 focal seizures per week',
      ],
    },
    {
      percent: 20,
      summary: 'At least 1 major seizure in last 2 years; OR at least 2 minor seizures in last 6 months',
      requirements: [
        '1+ major seizure in last 2 years, OR',
        '2+ focal seizures in last 6 months',
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis of focal epilepsy with history of seizures',
      requirements: [
        'Confirmed diagnosis by physician',
        'History of focal/Jacksonian seizures',
        'On continuous anti-epileptic medication (minimum 10% if on medication)',
      ],
    },
  ],
  definitions: {
    focalMotorSeizure: 'Seizure beginning with motor activity (jerking, twitching) in one specific body area, typically face, hand, or foot.',
    focalSensorySeizure: 'Seizure beginning with sensory symptoms (tingling, numbness, visual disturbance) in one specific area.',
    jacksonianMarch: 'Progressive spread of motor or sensory seizure activity from initial focus to adjacent body areas, following the motor/sensory cortex representation.',
    secondaryGeneralization: 'When a focal seizure spreads to involve both hemispheres, resulting in tonic-clonic convulsion with loss of consciousness.',
  },
};

// EPILEPSY - DIENCEPHALIC (DC 8913)

export const EPILEPSY_DIENCEPHALIC_CRITERIA = {
  diagnosticCode: '8913',
  condition: 'Epilepsy, Diencephalic',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8913',
  description: 'Epilepsy involving the diencephalon (thalamus/hypothalamus) characterized primarily by autonomic symptoms. Rate as minor seizures, except when major seizures predominate.',
  note: 'Per 38 CFR 4.124a: "Rate as minor seizures, except in the presence of major and minor seizures, rate the predominating type." Diencephalic epilepsy primarily presents with autonomic symptoms and is typically rated under minor seizure criteria.',
  disclaimer: 'This analysis is for documentation purposes only. The VA determines final ratings based on complete medical evidence and C&P examination findings.',
  ratings: [
    {
      percent: 80,
      summary: 'More than 10 minor (autonomic) seizures weekly',
      requirements: [
        'More than 10 autonomic seizure episodes per week',
        'Medical documentation of frequency',
      ],
    },
    {
      percent: 60,
      summary: '9-10 minor (autonomic) seizures per week',
      requirements: [
        '9-10 autonomic seizure episodes per week',
      ],
    },
    {
      percent: 40,
      summary: '5-8 minor (autonomic) seizures weekly',
      requirements: [
        '5-8 autonomic seizure episodes per week',
      ],
    },
    {
      percent: 20,
      summary: 'At least 2 minor seizures in last 6 months',
      requirements: [
        '2+ autonomic seizure episodes in last 6 months',
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis of diencephalic epilepsy with history of seizures',
      requirements: [
        'Confirmed diagnosis by physician/neurologist',
        'History of autonomic seizure episodes',
        'On continuous anti-epileptic medication (minimum 10%)',
      ],
    },
  ],
  definitions: {
    autonomicSeizure: 'Seizure characterized by changes in autonomic nervous system function including flushing, sweating, blood pressure changes, heart rate changes, pupillary changes, temperature dysregulation, GI symptoms.',
    diencephalon: 'Brain region including thalamus and hypothalamus that regulates autonomic functions, sleep-wake cycles, and hormonal release.',
  },
};

// EPILEPSY - PSYCHOMOTOR (DC 8914)

export const EPILEPSY_PSYCHOMOTOR_CRITERIA = {
  diagnosticCode: '8914',
  condition: 'Epilepsy, Psychomotor',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8914',
  description: 'Complex partial seizures originating in temporal lobe. Can be rated as MAJOR or MINOR depending on presentation characteristics.',
  note: 'Per 38 CFR 4.124a: MAJOR seizures - characterized by automatic states AND/OR generalized convulsions with unconsciousness. MINOR seizures - characterized by brief transient episodes of random motor movements, hallucinations, perceptual illusions, abnormalities of thinking, memory or mood, or autonomic disturbances.',
  disclaimer: 'This analysis is for documentation purposes only. The VA determines final ratings based on complete medical evidence. Psychomotor seizure classification (major vs minor) depends on specific episode characteristics.',
  ratings: [
    {
      percent: 100,
      summary: 'Averaging at least 1 major psychomotor seizure per month over the last year',
      requirements: [
        'Episodes with automatic states AND/OR convulsions with unconsciousness',
        'Average 1+ such episode per month for 12 months',
        'Medical documentation of seizure characteristics and frequency',
      ],
      seizureType: 'major',
    },
    {
      percent: 80,
      summary: 'At least 1 major seizure in 3 months over last year; OR more than 10 minor seizures weekly',
      requirements: [
        'Average 1 major psychomotor seizure every 3 months, OR',
        'More than 10 minor psychomotor episodes per week',
      ],
    },
    {
      percent: 60,
      summary: 'At least 1 major seizure in 4 months over last year; OR 9-10 minor seizures per week',
      requirements: [
        'Average 1 major psychomotor seizure every 4 months, OR',
        '9-10 minor psychomotor episodes per week',
      ],
    },
    {
      percent: 40,
      summary: 'At least 1 major seizure in last 6 months or 2 in last year; OR 5-8 minor seizures weekly',
      requirements: [
        '1+ major psychomotor seizure in last 6 months OR 2+ in last year, OR',
        '5-8 minor psychomotor episodes per week',
      ],
    },
    {
      percent: 20,
      summary: 'At least 1 major seizure in last 2 years; OR at least 2 minor seizures in last 6 months',
      requirements: [
        '1+ major psychomotor seizure in last 2 years, OR',
        '2+ minor psychomotor episodes in last 6 months',
      ],
    },
    {
      percent: 10,
      summary: 'Confirmed diagnosis of psychomotor epilepsy with history of seizures',
      requirements: [
        'Confirmed diagnosis by physician/neurologist',
        'History of psychomotor seizures',
        'On continuous anti-epileptic medication (minimum 10%)',
      ],
    },
  ],
  definitions: {
    majorPsychomotor: 'Psychomotor seizures characterized by automatic states (complex automatisms, purposeless wandering, complex behaviors performed without awareness) AND/OR generalized convulsions with unconsciousness.',
    minorPsychomotor: 'Psychomotor seizures characterized by brief transient episodes of: random motor movements, hallucinations, perceptual illusions (déjà vu, jamais vu), abnormalities of thinking, memory disturbance, mood changes, or autonomic disturbances.',
    automaticState: 'Period during which patient performs complex behaviors without conscious awareness or memory of the event.',
    oralAutomatisms: 'Repetitive mouth/lip movements including lip smacking, chewing, swallowing - common in temporal lobe seizures.',
  },
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

  secondaryConditions: {
    description: 'Tinnitus (ringing in the ears) is commonly associated with mental health conditions due to the chronic distress it causes. Per Fountain v. McDonald (2015), tinnitus is an organic disease of the nervous system.',

    categories: {
      mentalHealth: {
        name: 'Mental Health Secondaries',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Chronic tinnitus commonly leads to depression. Well-documented in medical literature.',
            documentationTips: ['Mental health treatment records', 'Document how tinnitus affects mood', 'PHQ-9 scores'],
          },
          {
            manifestation: 'Anxiety',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Generalized anxiety disorder'],
            nexusStrength: 'strong',
            notes: 'Tinnitus causes significant anxiety in many sufferers.',
            documentationTips: ['Document anxiety related to tinnitus', 'GAD-7 scores', 'Treatment records'],
          },
          {
            manifestation: 'Insomnia/Sleep Disturbance',
            suggestedDCs: ['6847', '9400'],
            dcDescriptions: ['Sleep apnea syndromes', 'Or rate under mental health'],
            nexusStrength: 'strong',
            notes: 'Tinnitus frequently disrupts sleep. Document sleep patterns.',
            documentationTips: ['Sleep diary', 'Document difficulty falling asleep due to tinnitus', 'Sleep study if performed'],
          },
        ],
      },

      chronicPain: {
        name: 'Associated Pain Conditions',
        conditions: [
          {
            manifestation: 'Headaches/Migraines',
            suggestedDCs: ['8100'],
            dcDescriptions: ['Migraine'],
            nexusStrength: 'moderate',
            notes: 'Some veterans experience headaches associated with tinnitus.',
            documentationTips: ['Headache diary', 'Document co-occurrence with tinnitus episodes'],
          },
        ],
      },
    },

    caseLawReferences: [
      {
        case: 'Fountain v. McDonald',
        citation: '13-0540 (2015)',
        holding: 'Tinnitus is an organic disease of the nervous system, presumptively service-connected within one year of discharge',
      },
      {
        case: 'Jandreau v. Nicholson',
        citation: '492 F.3d 1372 (Fed. Cir. 2007)',
        holding: 'Veteran is competent to self-diagnose tinnitus as it is observable through the senses',
      },
    ],

    importantNotes: [
      'Tinnitus itself is capped at 10% under DC 6260',
      'Secondary mental health conditions can significantly increase overall rating',
      'Document the specific impact tinnitus has on daily functioning',
      'Get audiologist and mental health provider statements',
    ],
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

  secondaryConditions: {
    description: 'Fibromyalgia commonly causes or co-occurs with several mental health and pain conditions.',

    categories: {
      mentalHealth: {
        name: 'Mental Health Secondaries',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Chronic pain from fibromyalgia frequently causes depression.',
            documentationTips: ['Mental health records', 'Document pain-depression cycle', 'PHQ-9 scores'],
          },
          {
            manifestation: 'Anxiety',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Generalized anxiety disorder'],
            nexusStrength: 'strong',
            notes: 'Chronic unpredictable symptoms cause significant anxiety.',
            documentationTips: ['Document anxiety about symptoms', 'GAD-7 scores', 'Treatment records'],
          },
        ],
      },

      neurological: {
        name: 'Neurological Secondaries',
        conditions: [
          {
            manifestation: 'Migraines/Chronic Headaches',
            suggestedDCs: ['8100'],
            dcDescriptions: ['Migraine'],
            nexusStrength: 'strong',
            notes: 'Central sensitization causes both conditions. Document headache frequency.',
            documentationTips: ['Headache diary', 'Document prostrating episodes', 'Neurology records'],
          },
        ],
      },

      gastrointestinal: {
        name: 'GI Secondaries',
        conditions: [
          {
            manifestation: 'Irritable Bowel Syndrome',
            suggestedDCs: ['7319'],
            dcDescriptions: ['Irritable colon syndrome'],
            nexusStrength: 'strong',
            notes: 'IBS commonly co-occurs with fibromyalgia (central sensitization).',
            documentationTips: ['GI records', 'Document symptom patterns', 'Dietary modifications'],
          },
        ],
      },
    },

    canBeSecondaryTo: [
      {
        primaryDC: '9411',
        primaryCondition: 'PTSD',
        nexusStrength: 'strong',
        notes: 'Stress-related central sensitization well documented',
      },
      {
        primaryDC: '5237',
        primaryCondition: 'Chronic Low Back Pain',
        nexusStrength: 'moderate',
        notes: 'Chronic pain conditions can lead to fibromyalgia',
      },
    ],

    importantNotes: [
      'Fibromyalgia is rated 10%, 20%, or 40% based on symptoms requiring continuous medication',
      'Secondary mental health conditions can be rated separately',
      'Document widespread pain and specific tender points',
      'Keep detailed symptom and flare-up logs',
    ],
  },
};

// ============================================
// PHASE 2: VISION LOSS CRITERIA (DC 6061-6079)
// ============================================

export const MULTIPLE_SCLEROSIS_CRITERIA = {
  diagnosticCode: '8018',
  condition: 'Multiple Sclerosis',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8018',

  minimumRating: 30,
  ratingNote: 'MS has a minimum rating of 30%. Higher ratings are based on specific residuals rated under appropriate diagnostic codes.',

  ratings: [
    {
      percent: 30,
      summary: 'Minimum rating - ascertainable residuals present',
      criteria: {
        residualsPresent: true,
        minimumRating: true,
      },
      criteriaDescription: [
        'Minimum rating assigned when ascertainable residuals are present',
        'Residuals may include fatigue, numbness, weakness, cognitive issues, bladder dysfunction, etc.',
        'Higher ratings require evaluation of specific residuals under appropriate DCs',
      ],
      evidenceNeeded: [
        'MS diagnosis confirmed by neurologist',
        'Documentation of current residual symptoms',
        'Symptom logs showing ongoing functional impact',
      ],
    },
  ],

  additionalRatingGuidance: [
    {
      residual: 'Visual Impairment',
      description: 'Optic neuritis or other visual deficits',
      ratingMethod: 'Rate under DC 6066 (visual impairment) based on corrected visual acuity',
    },
    {
      residual: 'Bladder Dysfunction',
      description: 'Neurogenic bladder, incontinence, or voiding dysfunction',
      ratingMethod: 'Rate under DC 7542 (neurogenic bladder) or voiding dysfunction criteria',
    },
    {
      residual: 'Bowel Dysfunction',
      description: 'Constipation, incontinence, or bowel control issues',
      ratingMethod: 'Rate under DC 7332 (sphincter impairment)',
    },
    {
      residual: 'Extremity Weakness/Paralysis',
      description: 'Weakness or paralysis of upper or lower extremities',
      ratingMethod: 'Rate under peripheral nerve codes (DC 8510-8530) based on affected nerve',
    },
    {
      residual: 'Cognitive Impairment',
      description: 'Memory issues, concentration problems, processing speed',
      ratingMethod: 'May be rated under DC 9326 (dementia) if severe, or as part of minimum rating',
    },
    {
      residual: 'Fatigue',
      description: 'MS-related fatigue (lassitude)',
      ratingMethod: 'Considered in minimum rating; may also support CFS rating if criteria met',
    },
    {
      residual: 'Spasticity',
      description: 'Muscle stiffness, spasms, increased tone',
      ratingMethod: 'Rate based on functional limitation of affected extremity',
    },
    {
      residual: 'Tremor/Ataxia',
      description: 'Intention tremor or coordination problems',
      ratingMethod: 'Rate based on functional impairment of affected extremity',
    },
  ],

  definitions: {
    multipleSclerosis: {
      term: 'Multiple Sclerosis',
      definition: 'A chronic autoimmune disease affecting the central nervous system where the immune system attacks the protective myelin sheath covering nerve fibers, causing communication problems between the brain and body.',
      examples: [
        'Relapsing-remitting MS (RRMS) - most common form with flares and remissions',
        'Secondary progressive MS (SPMS) - follows RRMS with gradual worsening',
        'Primary progressive MS (PPMS) - steady progression from onset',
      ],
    },
    relapse: {
      term: 'Relapse/Exacerbation',
      definition: 'A new neurological symptom or worsening of existing symptoms lasting at least 24 hours, not attributed to fever or infection. Also called flare, attack, or exacerbation.',
      examples: [
        'New numbness or weakness lasting more than 24 hours',
        'Vision problems (optic neuritis)',
        'Increased spasticity or walking difficulty',
        'New bladder dysfunction',
      ],
    },
    uhthoffPhenomenon: {
      term: "Uhthoff's Phenomenon",
      definition: 'Temporary worsening of MS symptoms triggered by increased body temperature (heat, exercise, fever). Symptoms resolve when body temperature returns to normal.',
      examples: [
        'Vision blurring after exercise or hot shower',
        'Increased weakness in warm weather',
        'Worsening fatigue with heat exposure',
      ],
    },
    lhermittesSign: {
      term: "Lhermitte's Sign",
      definition: 'An electric shock-like sensation running down the spine and into the limbs when bending the neck forward. Indicates demyelination in the cervical spinal cord.',
      examples: [
        'Electric shock down spine when looking down',
        'Tingling in arms/legs with neck flexion',
        'Brief, reproducible sensation',
      ],
    },
    spasticity: {
      term: 'Spasticity',
      definition: 'Abnormal muscle stiffness and involuntary spasms due to damage to nerve pathways. Common in MS affecting legs more than arms.',
      examples: [
        'Stiff, heavy-feeling legs',
        'Muscle spasms, especially at night',
        'Difficulty with walking due to stiffness',
        'Clonus (rhythmic contractions)',
      ],
    },
  },

  secondaryConditions: {
    description: "Multiple Sclerosis (DC 8018) has a minimum rating of 30%. MS causes widespread neurological dysfunction affecting multiple body systems. Each manifestation can be rated separately as a secondary condition, often resulting in substantial combined ratings.",

    minimumRating: 30,

    categories: {
      speech: {
        name: 'Speech & Swallowing',
        conditions: [
          {
            manifestation: 'Speech Difficulties / Hoarseness',
            suggestedDCs: ['6519', '6516'],
            dcDescriptions: ['Complete organic Aphonia (constant inability to speak above a whisper)', 'Chronic Laryngitis'],
            nexusStrength: 'strong',
            notes: 'Select the DC that provides the most advantageous rating.',
            documentationTips: ['Speech pathology evaluation', 'Document voice changes', 'Laryngoscopy results if performed'],
          },
          {
            manifestation: 'Paralysis of Soft Palate with Swallowing Difficulty',
            suggestedDCs: ['6521'],
            dcDescriptions: ['Pharynx injuries'],
            nexusStrength: 'strong',
            notes: 'Document swallowing difficulty and speech impairment together.',
            documentationTips: ['Modified barium swallow study', 'ENT evaluation', 'Document aspiration risk'],
          },
          {
            manifestation: 'Swallowing Difficulties (Dysphagia)',
            suggestedDCs: ['7203'],
            dcDescriptions: ['Stricture of the Esophagus'],
            nexusStrength: 'strong',
            notes: 'Document diet modifications and weight changes.',
            documentationTips: ['Swallow study results', 'Dietary log', 'Weight tracking'],
          },
        ],
      },

      respiratory: {
        name: 'Respiratory Conditions',
        conditions: [
          {
            manifestation: 'Respiratory Conditions',
            suggestedDCs: ['6600-6847'],
            dcDescriptions: ['Various respiratory system codes based on symptoms'],
            nexusStrength: 'moderate',
            notes: 'Based on symptoms shown, select the most advantageous respiratory system rating.',
            documentationTips: ['Pulmonary function tests', 'Document breathing difficulties', 'Oxygen requirements if any'],
          },
        ],
      },

      sleep: {
        name: 'Sleep Disorders',
        conditions: [
          {
            manifestation: 'Sleep Disturbances',
            suggestedDCs: ['6847', '9410'],
            dcDescriptions: ['Sleep Apnea if manifested as respiratory disability', 'Insomnia'],
            nexusStrength: 'strong',
            notes: 'If another mental disorder diagnosis is present along with insomnia, evaluate insomnia along with the other mental disorder diagnoses.',
            documentationTips: ['Sleep study', 'Document sleep patterns', 'Fatigue assessment'],
          },
        ],
      },

      bowelBladder: {
        name: 'Bowel & Bladder Dysfunction',
        conditions: [
          {
            manifestation: 'Loss of Sphincter Control (with or without leakage)',
            suggestedDCs: ['7332'],
            dcDescriptions: ['Rectum and anus, impairment of sphincter control'],
            nexusStrength: 'strong',
            notes: 'Very common in MS. Document frequency and severity of incontinence.',
            documentationTips: ['Bowel/bladder diary', 'Document pad usage', 'GI/Urology evaluation'],
          },
          {
            manifestation: 'Chronic Constipation',
            suggestedDCs: ['7319'],
            dcDescriptions: ['Irritable colon syndrome, IBS, spastic colitis, mucous colitis'],
            nexusStrength: 'strong',
            notes: 'Neurogenic bowel dysfunction common in MS.',
            documentationTips: ['Bowel diary', 'Medication log', 'Document interventions needed'],
          },
          {
            manifestation: 'Voiding Dysfunction',
            suggestedDCs: ['7542'],
            dcDescriptions: ['Neurogenic bladder - for leakage, frequency, or obstructed voiding'],
            nexusStrength: 'strong',
            notes: 'Only a single evaluation is warranted even if more than one dysfunction/symptom type is present. May be presented as symptoms only, versus an official diagnosis.',
            documentationTips: ['Urodynamic studies', 'Voiding diary', 'Post-void residual measurements'],
          },
          {
            manifestation: 'Recurrent Urinary Tract Infections',
            suggestedDCs: ['7527'],
            dcDescriptions: ['Voiding dysfunction or urinary tract infection'],
            nexusStrength: 'strong',
            notes: 'Common due to bladder dysfunction. Document frequency and treatment.',
            documentationTips: ['UTI history', 'Urine cultures', 'Prophylactic treatment records'],
          },
        ],
      },

      sexual: {
        name: 'Sexual Dysfunction',
        conditions: [
          {
            manifestation: 'Erectile Dysfunction',
            suggestedDCs: ['7522'],
            dcDescriptions: ['Erectile Dysfunction (Male)'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'When associated to Multiple Sclerosis (MS) diagnosis, grant SMC-K',
            notes: 'Very common in MS. SMC-K is granted when secondary to MS.',
            documentationTips: ['Urology evaluation', 'Document onset relative to MS', 'Treatment records'],
          },
        ],
      },

      visual: {
        name: 'Visual Disturbances',
        conditions: [
          {
            manifestation: 'Diplopia (Double Vision)',
            suggestedDCs: ['6090'],
            dcDescriptions: ['Diplopia or internuclear ophthalmoplegia'],
            nexusStrength: 'strong',
            notes: 'For visual impairment, a single evaluation is warranted either under the general rating formula OR based on visual impairment criteria (visual acuity, visual field, and impairment of muscle function).',
            documentationTips: ['Ophthalmology evaluation', 'Visual field testing', 'Document impact on daily activities'],
          },
          {
            manifestation: 'Decreased Visual Acuity / Blurring',
            suggestedDCs: ['6066'],
            dcDescriptions: ['Decreased visual acuity or blurring of vision'],
            nexusStrength: 'strong',
            notes: 'Optic neuritis is common in MS. Document visual acuity measurements.',
            documentationTips: ['Visual acuity testing', 'OCT imaging', 'Document vision changes over time'],
          },
          {
            manifestation: 'Visual Scotoma (Blind Spots)',
            suggestedDCs: ['6081'],
            dcDescriptions: ['Visual scotoma'],
            nexusStrength: 'strong',
            notes: 'Document visual field defects.',
            documentationTips: ['Visual field testing', 'Humphrey visual field results'],
          },
          {
            manifestation: 'Nystagmus',
            suggestedDCs: ['6016'],
            dcDescriptions: ['Nystagmus'],
            nexusStrength: 'strong',
            notes: 'Document type and severity of nystagmus.',
            documentationTips: ['Neuro-ophthalmology evaluation', 'Document functional impact'],
          },
          {
            manifestation: 'Optic Neuritis',
            suggestedDCs: ['6026'],
            dcDescriptions: ['Optic neuritis'],
            nexusStrength: 'strong',
            notes: 'Often an early symptom of MS. Document history and visual outcomes.',
            documentationTips: ['MRI results', 'Visual evoked potentials', 'Treatment history'],
          },
        ],
      },

      upperExtremity: {
        name: 'Upper Extremity Impairment',
        conditions: [
          {
            manifestation: 'Upper Extremity Impairment',
            suggestedDCs: ['8514', '5125', '5109'],
            dcDescriptions: ['Radial nerve - impairment without loss of use (LOU)', 'LOU of one hand', 'LOU of both hands'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'LOU qualifies for SMC-K (one hand) or higher SMC (both hands)',
            notes: 'Synthesize findings of neurologic exam (gait strength, deep tendon reflexes, sensation, muscle atrophy/weakness) and remaining effective function to assess level of impairment for upper extremity, including whether loss of use is present.',
            documentationTips: ['Comprehensive neurological exam', 'Grip strength testing', 'Fine motor assessment', 'Document ADL limitations'],
          },
        ],
      },

      lowerExtremity: {
        name: 'Lower Extremity Impairment',
        conditions: [
          {
            manifestation: 'Lower Extremity Impairment',
            suggestedDCs: ['8520', '5167', '5110'],
            dcDescriptions: ['Sciatic nerve - impairment without LOU', 'LOU of one foot', 'LOU of both feet'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'LOU qualifies for SMC-K (one foot) or higher SMC (both feet)',
            notes: 'Same approach as upper extremity - assess neurologic findings and effective function.',
            documentationTips: ['Gait analysis', 'Balance testing', 'Document mobility aids', 'Fall risk assessment'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health & Cognitive',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Rated as mental health. See NOTE about combining mental health ratings.',
            documentationTips: ['Mental health treatment records', 'PHQ-9/BDI scores', 'Document functional impact'],
          },
          {
            manifestation: 'Cognitive Impairment / Dementia',
            suggestedDCs: ['9326'],
            dcDescriptions: ['Dementia due to other neurologic or general medical conditions'],
            nexusStrength: 'strong',
            notes: 'MS cognitive impairment is well-documented. Rated as mental health.',
            documentationTips: ['Neuropsychological testing', 'Cognitive screening scores', 'Document decline over time'],
          },
        ],
      },
    },

    importantNotes: [
      'Multiple Sclerosis has a MINIMUM rating of 30%',
      'Each secondary manifestation can be rated SEPARATELY',
      'If another mental disorder diagnosis is present, evaluate along with other mental disorder diagnoses',
      'Visual impairment uses single evaluation - choose most advantageous method',
      'Voiding dysfunction gets single evaluation even with multiple symptom types',
      'SMC-K is granted for ED when secondary to MS',
      'Consider SMC for loss of use of extremities',
    ],

    smcConsiderations: [
      'SMC-K automatic for ED secondary to MS (DC 7522)',
      'SMC-K for loss of use of one hand (DC 5125)',
      'SMC-K for loss of use of one foot (DC 5167)',
      'Higher SMC levels for multiple losses of use',
    ],

    documentationStrategy: [
      'Regular neurology follow-ups with MRI',
      'Document relapses and recovery patterns',
      'Comprehensive neurological exams',
      'Visual function testing',
      'Bladder/bowel function assessment',
      'Neuropsychological evaluation for cognitive changes',
      'Physical/occupational therapy evaluations',
    ],
  },


  disclaimer: 'MS has a minimum rating of 30% when ascertainable residuals are present. Additional ratings may be assigned for specific residuals (vision, bladder, bowel, extremity weakness, etc.) under their respective diagnostic codes. The combined rating uses VA combined ratings table. This analysis tracks symptoms to document residuals and their functional impact.',
};

// ============================================
// PHASE 1A: PARKINSON\'S DISEASE CRITERIA (DC 8004)
// ============================================

export const PARKINSONS_DISEASE_CRITERIA = {
  diagnosticCode: '8004',
  condition: "Parkinson's Disease",
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8004',

  minimumRating: 30,
  ratingNote: "Parkinson's disease (Paralysis Agitans) has a minimum rating of 30%. Higher ratings based on specific residuals under appropriate diagnostic codes.",

  ratings: [
    {
      percent: 30,
      summary: 'Minimum rating - ascertainable residuals present',
      criteria: {
        residualsPresent: true,
        minimumRating: true,
      },
      criteriaDescription: [
        'Minimum rating assigned when ascertainable residuals are present',
        'Cardinal motor symptoms: tremor, rigidity, bradykinesia, postural instability',
        'Non-motor symptoms also considered: sleep, cognitive, autonomic',
        'Higher ratings require evaluation of specific residuals under appropriate DCs',
      ],
      evidenceNeeded: [
        "Parkinson's disease diagnosis confirmed by neurologist",
        'Documentation of motor symptoms (tremor, rigidity, bradykinesia)',
        'Documentation of non-motor symptoms (sleep, cognitive, autonomic)',
        'Symptom logs showing ongoing functional impact',
        'Medication requirements and response',
      ],
    },
  ],

  additionalRatingGuidance: [
    {
      residual: 'Tremor',
      description: 'Resting tremor affecting daily activities',
      ratingMethod: 'Rate based on functional impairment of affected extremity under peripheral nerve codes',
    },
    {
      residual: 'Rigidity/Bradykinesia',
      description: 'Muscle stiffness and slowness of movement',
      ratingMethod: 'Rate based on limitation of motion and functional impairment',
    },
    {
      residual: 'Gait/Balance Impairment',
      description: 'Shuffling gait, freezing, falls, postural instability',
      ratingMethod: 'Consider under minimum rating; severe cases may warrant separate evaluation',
    },
    {
      residual: 'Speech Impairment',
      description: 'Soft speech (hypophonia), slurred speech',
      ratingMethod: 'May be rated under DC 8210 (vagus nerve) if severe',
    },
    {
      residual: 'Swallowing Difficulty',
      description: 'Dysphagia affecting nutrition',
      ratingMethod: 'Rate under digestive system codes if severe',
    },
    {
      residual: 'Cognitive Impairment',
      description: "Parkinson's dementia or cognitive changes",
      ratingMethod: 'Rate under DC 9326 (dementia) if meeting criteria',
    },
    {
      residual: 'Depression/Anxiety',
      description: 'PD-related mood disorders',
      ratingMethod: 'Rate under mental health codes (DC 9434/9400)',
    },
    {
      residual: 'Sleep Disorders',
      description: 'REM sleep behavior disorder, insomnia',
      ratingMethod: 'Consider under minimum rating or rate separately if meeting sleep disorder criteria',
    },
    {
      residual: 'Bladder Dysfunction',
      description: 'Urinary urgency, frequency, incontinence',
      ratingMethod: 'Rate under voiding dysfunction criteria',
    },
    {
      residual: 'Constipation',
      description: 'Autonomic dysfunction affecting bowel',
      ratingMethod: 'Consider under minimum rating',
    },
  ],

  definitions: {
    parkinsonsDisease: {
      term: "Parkinson's Disease",
      definition: 'A progressive neurodegenerative disorder caused by loss of dopamine-producing neurons in the brain. Characterized by motor symptoms (tremor, rigidity, bradykinesia, postural instability) and non-motor symptoms.',
      examples: [
        'Idiopathic PD - most common, cause unknown',
        'Early-onset PD - diagnosed before age 50',
        'Parkinsonism - similar symptoms from other causes',
      ],
    },
    restingTremor: {
      term: 'Resting Tremor',
      definition: 'Involuntary shaking that occurs when muscles are relaxed, characteristic of PD. Often starts on one side, typically in hand ("pill-rolling" tremor). Decreases with intentional movement.',
      examples: [
        'Hand tremor at rest, stops when reaching for object',
        'Jaw or lip tremor',
        'Leg tremor when sitting',
      ],
    },
    bradykinesia: {
      term: 'Bradykinesia',
      definition: 'Slowness of movement and difficulty initiating movement. A cardinal feature of PD affecting daily activities.',
      examples: [
        'Slow to start walking',
        'Decreased arm swing when walking',
        'Difficulty with fine motor tasks (buttons, writing)',
        'Reduced facial expression (masked face)',
      ],
    },
    rigidity: {
      term: 'Rigidity',
      definition: 'Muscle stiffness throughout the range of motion (different from spasticity). Can be "cogwheel" (ratchety) or "lead-pipe" (smooth resistance).',
      examples: [
        'Stiff muscles in arms, legs, trunk',
        'Difficulty turning in bed',
        'Reduced arm swing',
        'Stooped posture',
      ],
    },
    freezingOfGait: {
      term: 'Freezing of Gait',
      definition: 'Sudden, brief inability to move feet forward despite intention to walk. Feet feel "glued to floor." Common trigger of falls.',
      examples: [
        'Freezing when starting to walk',
        'Freezing in doorways or narrow spaces',
        'Freezing when turning',
        'Freezing when approaching destination',
      ],
    },
    offEpisodes: {
      term: 'OFF Episodes',
      definition: 'Periods when PD medication wears off before next dose, causing return of symptoms. More common as disease progresses.',
      examples: [
        'Predictable wearing off before next dose',
        'Sudden unexpected OFF periods',
        'Morning akinesia before first dose',
      ],
    },
    dyskinesia: {
      term: 'Dyskinesia',
      definition: 'Involuntary, uncontrolled movements often caused by long-term levodopa use. Different from tremor - more flowing/writhing.',
      examples: [
        'Choreiform movements (dance-like)',
        'Dystonia (sustained muscle contractions)',
        'Peak-dose dyskinesia',
        'Diphasic dyskinesia (beginning/end of dose)',
      ],
    },
  },

  secondaryConditions: {
    description: "Parkinson's Disease (DC 8004) has a minimum rating of 30%. The condition causes numerous secondary complications that can be rated separately, significantly increasing the combined rating. Each manifestation below can potentially be service-connected secondary to Parkinson's.",

    minimumRating: 30,

    categories: {
      posture: {
        name: 'Posture & Balance',
        conditions: [
          {
            manifestation: 'Stooped Posture',
            suggestedDCs: ['8211'],
            dcDescriptions: ['Diseases of the Cranial Nerves (11th - Spinal Accessory)'],
            nexusStrength: 'strong',
            notes: 'Separate evaluations warranted for left and right side involvement. Bilateral factor does NOT apply to cranial nerves.',
            documentationTips: ['Document degree of postural change', 'Photograph posture changes over time', 'Physical therapy evaluation'],
          },
          {
            manifestation: 'Balance Impairment',
            suggestedDCs: ['6204'],
            dcDescriptions: ['Peripheral vestibular disorders'],
            nexusStrength: 'strong',
            notes: 'Use when balance impairment is present WITHOUT lower extremity impairment. Otherwise, consider as part of extremity evaluation.',
            documentationTips: ['Balance testing results', 'Fall history documentation', 'Vestibular function testing'],
          },
        ],
      },

      movement: {
        name: 'Movement Disorders',
        conditions: [
          {
            manifestation: 'Bradykinesia / Slowed Motion',
            suggestedDCs: ['8514', '8520'],
            dcDescriptions: ['Radial nerve (upper)', 'Sciatic nerve (lower)'],
            nexusStrength: 'strong',
            notes: 'Consider as part of extremity evaluations. Document specific functional limitations.',
            documentationTips: ['Timed movement tests', 'Document activities affected', 'Video documentation of movement'],
          },
          {
            manifestation: 'Loss of Automatic Movements (Face Masking, Drooling)',
            suggestedDCs: ['8207'],
            dcDescriptions: ['Diseases of the Cranial Nerves (7th - Facial)'],
            nexusStrength: 'strong',
            notes: 'Separate evaluations warranted for left and right side involvement. Bilateral factor does NOT apply.',
            documentationTips: ['Neurology evaluation', 'Document facial expression changes', 'Sialorrhea (drooling) frequency'],
          },
        ],
      },

      speech: {
        name: 'Speech & Swallowing',
        conditions: [
          {
            manifestation: 'Speech Changes (Dysarthria)',
            suggestedDCs: ['8210', '6516', '6519'],
            dcDescriptions: ['Cranial Nerves (10th - Vagus) bilaterally', 'Chronic Laryngitis', 'Complete organic Aphonia'],
            nexusStrength: 'strong',
            notes: 'Any of these three DCs can be used. Assign whichever results in the highest evaluation. Cranial nerves are rated bilaterally.',
            documentationTips: ['Speech pathology evaluation', 'Document intelligibility changes', 'Voice recordings over time'],
          },
          {
            manifestation: 'Difficulty Chewing/Swallowing (Dysphagia)',
            suggestedDCs: ['7203', '8205'],
            dcDescriptions: ['Stricture of the esophagus', 'Diseases of the Cranial Nerves (5th - Trigeminal)'],
            nexusStrength: 'strong',
            notes: 'Document modified barium swallow study results if performed.',
            documentationTips: ['Swallow study results', 'Document diet modifications', 'Weight changes from swallowing difficulty'],
          },
        ],
      },

      upperExtremity: {
        name: 'Upper Extremity Impairment',
        conditions: [
          {
            manifestation: 'Upper Extremity - Tremors, Rigidity, Bradykinesia',
            suggestedDCs: ['8514', '5125', '5109'],
            dcDescriptions: ['Radial nerve - impairment without loss of use', 'Loss of use (LOU) of one hand', 'Loss of use of both hands'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'Loss of use is defined in 38 CFR 3.350(a)(2). LOU of one hand qualifies for SMC-K; LOU of both hands qualifies for higher SMC.',
            notes: 'Rate each extremity separately. Determine if there is actual loss of use vs impairment without LOU.',
            documentationTips: ['Neurological exam documenting strength, reflexes, sensation', 'Functional capacity evaluation', 'Document grip strength', 'ADL limitations'],
          },
        ],
      },

      lowerExtremity: {
        name: 'Lower Extremity Impairment',
        conditions: [
          {
            manifestation: 'Lower Extremity - Tremors, Rigidity, Bradykinesia',
            suggestedDCs: ['8520', '5167', '5110'],
            dcDescriptions: ['Sciatic nerve - impairment without loss of use', 'Loss of use (LOU) of one foot', 'Loss of use of both feet'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'Loss of use is defined in 38 CFR 3.350(a)(2). LOU of one foot qualifies for SMC-K; LOU of both feet qualifies for higher SMC.',
            notes: 'Rate each extremity separately. Document gait analysis and mobility limitations.',
            documentationTips: ['Gait analysis', 'Document assistive device use', 'Fall frequency', 'Distance limitations'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health & Cognitive',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Rated as mental health. If another mental disorder diagnosis is present, evaluate along with other mental disorder diagnoses using the General Rating Formula.',
            documentationTips: ['Mental health treatment records', 'PHQ-9 scores', 'Document functional impairment'],
          },
          {
            manifestation: 'Cognitive Impairment / Dementia',
            suggestedDCs: ['9326'],
            dcDescriptions: ['Dementia due to other neurologic or general medical conditions'],
            nexusStrength: 'strong',
            notes: 'Rated as mental health. Parkinson\'s dementia is well-documented. See NOTE about combining mental health ratings.',
            documentationTips: ['Neuropsychological testing', 'MMSE/MoCA scores over time', 'Document cognitive decline progression'],
          },
        ],
      },

      sensory: {
        name: 'Sensory Loss',
        conditions: [
          {
            manifestation: 'Complete Loss of Sense of Smell (Anosmia)',
            suggestedDCs: ['6275'],
            dcDescriptions: ['Complete loss of smell'],
            nexusStrength: 'strong',
            notes: 'Loss of smell often precedes motor symptoms in Parkinson\'s. Rate at 10% for complete loss.',
            documentationTips: ['UPSIT smell testing', 'Document onset relative to Parkinson\'s diagnosis', 'Safety concerns from smell loss'],
          },
        ],
      },

      sleep: {
        name: 'Sleep Disorders',
        conditions: [
          {
            manifestation: 'Sleep Disturbance',
            suggestedDCs: ['6847', '9410'],
            dcDescriptions: ['Sleep Apnea if manifested as respiratory disability', 'Insomnia'],
            nexusStrength: 'strong',
            notes: 'Insomnia is rated as mental health. REM sleep behavior disorder is common in Parkinson\'s.',
            documentationTips: ['Sleep study if applicable', 'Document sleep patterns', 'REM behavior disorder documentation'],
          },
        ],
      },

      autonomic: {
        name: 'Autonomic Dysfunction',
        conditions: [
          {
            manifestation: 'Urinary Problems (Neurogenic Bladder)',
            suggestedDCs: ['7542'],
            dcDescriptions: ['Neurogenic bladder'],
            nexusStrength: 'strong',
            notes: 'Autonomic dysfunction is common in Parkinson\'s. Document voiding dysfunction symptoms.',
            documentationTips: ['Urodynamic studies', 'Voiding diary', 'Document incontinence episodes'],
          },
          {
            manifestation: 'Constipation (Chronic)',
            suggestedDCs: ['7319'],
            dcDescriptions: ['Irritable colon syndrome, IBS, spastic colitis, mucous colitis'],
            nexusStrength: 'strong',
            notes: 'GI autonomic dysfunction very common. Document bowel habits and treatments.',
            documentationTips: ['Bowel movement log', 'Medication history', 'GI specialist evaluation'],
          },
        ],
      },

      sexual: {
        name: 'Sexual Dysfunction',
        conditions: [
          {
            manifestation: 'Erectile Dysfunction (Male)',
            suggestedDCs: ['7522'],
            dcDescriptions: ['Penis, deformity, with loss of erectile power'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'Qualifies for SMC-K (loss of use of creative organ)',
            notes: 'Very common in Parkinson\'s due to autonomic dysfunction.',
            documentationTips: ['Urology evaluation', 'Document onset and treatment', 'SHIM questionnaire'],
          },
          {
            manifestation: 'Female Sexual Arousal Disorder',
            suggestedDCs: ['7632'],
            dcDescriptions: ['Female sexual arousal disorder (FSAD)'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'May qualify for SMC-K',
            notes: 'Document impact on sexual function.',
            documentationTips: ['Gynecology evaluation', 'Document symptoms and impact'],
          },
        ],
      },
    },

    importantNotes: [
      'Parkinson\'s Disease has a MINIMUM rating of 30%',
      'Each secondary manifestation can be rated SEPARATELY',
      'Bilateral factor does NOT apply to cranial nerves',
      'Loss of use (LOU) is defined in 38 CFR 3.350(a)(2)',
      'If another mental disorder diagnosis is present, evaluate along with other mental disorder diagnoses',
      'Consider the need for Special Monthly Compensation (SMC) for loss of use',
      'Document progression of symptoms over time',
    ],

    smcConsiderations: [
      'SMC-K for loss of use of one hand (DC 5125)',
      'SMC-K for loss of use of one foot (DC 5167)',
      'SMC-K for erectile dysfunction / loss of creative organ (DC 7522)',
      'Higher SMC levels for loss of use of both hands or both feet',
    ],

    documentationStrategy: [
      'Regular neurology follow-ups documenting progression',
      'Functional capacity evaluations',
      'Mental health evaluations for depression/cognitive decline',
      'Autonomic function testing',
      'Speech and swallow evaluations',
      'Document all assistive devices used',
    ],
  },

  disclaimer: "Parkinson's disease has a minimum rating of 30% when ascertainable residuals are present. Additional ratings may be assigned for specific residuals under their respective diagnostic codes and combined using VA combined ratings table. This analysis tracks both motor and non-motor symptoms to document disease progression and functional impact.",
};

// ============================================
// PHASE 1A: MYASTHENIA GRAVIS CRITERIA (DC 8025)
// ============================================

export const MYASTHENIA_GRAVIS_CRITERIA = {
  diagnosticCode: '8025',
  condition: 'Myasthenia Gravis',
  cfrReference: '38 CFR 4.124a, Diagnostic Code 8025',

  minimumRating: 30,
  ratingNote: 'Myasthenia Gravis has a minimum rating of 30%. Higher ratings based on specific muscle group involvement and functional impairment.',

  ratings: [
    {
      percent: 30,
      summary: 'Minimum rating - ascertainable residuals present',
      criteria: {
        residualsPresent: true,
        minimumRating: true,
      },
      criteriaDescription: [
        'Minimum rating assigned when ascertainable residuals are present',
        'May include ocular symptoms (ptosis, diplopia) or generalized weakness',
        'Symptoms characteristically worsen with activity and improve with rest',
        'Higher ratings for severe involvement of specific muscle groups',
      ],
      evidenceNeeded: [
        'MG diagnosis confirmed (antibody testing, EMG, response to treatment)',
        'Documentation of affected muscle groups',
        'Pattern of fatigable weakness (worse with activity, better with rest)',
        'Current treatment regimen and response',
        'Symptom logs showing functional impact',
      ],
    },
  ],

  additionalRatingGuidance: [
    {
      residual: 'Ocular Myasthenia',
      description: 'Ptosis (drooping eyelid) and/or diplopia (double vision)',
      ratingMethod: 'Rate under eye codes if vision affected; may be part of minimum rating if mild',
    },
    {
      residual: 'Bulbar Weakness',
      description: 'Difficulty chewing, swallowing, speaking',
      ratingMethod: 'Rate based on functional impairment; severe cases may warrant additional rating',
    },
    {
      residual: 'Limb Weakness',
      description: 'Proximal arm/leg weakness affecting function',
      ratingMethod: 'Rate under appropriate peripheral nerve codes based on affected muscles',
    },
    {
      residual: 'Respiratory Weakness',
      description: 'Weakness of breathing muscles',
      ratingMethod: 'Rate under respiratory codes if FVC affected; myasthenic crisis warrants 100%',
    },
    {
      residual: 'Neck Weakness',
      description: 'Head drop from neck extensor weakness',
      ratingMethod: 'Consider under minimum rating or rate based on functional limitation',
    },
  ],

  mgfaClassification: [
    {
      class: 'I',
      description: 'Ocular MG - weakness limited to eye muscles',
      symptoms: ['Ptosis', 'Diplopia'],
    },
    {
      class: 'II',
      description: 'Mild generalized MG',
      subclasses: [
        { id: 'IIa', description: 'Predominantly limb/axial muscles' },
        { id: 'IIb', description: 'Predominantly bulbar/respiratory muscles' },
      ],
    },
    {
      class: 'III',
      description: 'Moderate generalized MG',
      subclasses: [
        { id: 'IIIa', description: 'Predominantly limb/axial muscles' },
        { id: 'IIIb', description: 'Predominantly bulbar/respiratory muscles' },
      ],
    },
    {
      class: 'IV',
      description: 'Severe generalized MG',
      subclasses: [
        { id: 'IVa', description: 'Predominantly limb/axial muscles' },
        { id: 'IVb', description: 'Predominantly bulbar/respiratory muscles' },
      ],
    },
    {
      class: 'V',
      description: 'Intubation required (with or without mechanical ventilation)',
      symptoms: ['Myasthenic crisis'],
    },
  ],

  definitions: {
    myastheniaGravis: {
      term: 'Myasthenia Gravis',
      definition: 'An autoimmune neuromuscular disorder caused by antibodies blocking acetylcholine receptors at the neuromuscular junction. Characterized by fatigable muscle weakness that worsens with activity and improves with rest.',
      examples: [
        'Ocular MG - affects only eye muscles',
        'Generalized MG - affects multiple muscle groups',
        'MG with thymoma - associated with thymus tumor',
      ],
    },
    fatigableWeakness: {
      term: 'Fatigable Weakness',
      definition: 'The hallmark of MG - muscles become weaker with repeated use and recover strength after rest. Different from fatigue (tiredness).',
      examples: [
        'Voice becomes softer after talking',
        'Chewing difficulty worsens during meal',
        'Arm weakness when holding arms up',
        'Ptosis worsens throughout day',
      ],
    },
    ptosis: {
      term: 'Ptosis',
      definition: 'Drooping of one or both upper eyelids due to weakness of the levator palpebrae muscle. Often the first symptom of MG.',
      examples: [
        'Unilateral or bilateral eyelid drooping',
        'Worse at end of day or with sustained upward gaze',
        'May shift from one eye to other',
        'Ice pack test may temporarily improve',
      ],
    },
    diplopia: {
      term: 'Diplopia',
      definition: 'Double vision caused by weakness of extraocular muscles. Common early symptom of MG.',
      examples: [
        'Horizontal or vertical double vision',
        'Worse with sustained gaze',
        'May be intermittent',
        'Improves with rest or one eye closed',
      ],
    },
    myasthenicCrisis: {
      term: 'Myasthenic Crisis',
      definition: 'Life-threatening worsening of MG with severe weakness of respiratory muscles requiring mechanical ventilation. Medical emergency.',
      examples: [
        'Severe shortness of breath',
        'Inability to clear secretions',
        'Respiratory failure requiring intubation',
        'Triggered by infection, surgery, medication changes',
      ],
    },
    bulbarSymptoms: {
      term: 'Bulbar Symptoms',
      definition: 'Symptoms affecting muscles controlled by cranial nerves from the brainstem - swallowing, speech, and facial muscles.',
      examples: [
        'Difficulty chewing (jaw fatigue)',
        'Difficulty swallowing (dysphagia)',
        'Nasal or slurred speech',
        'Facial weakness (expressionless face)',
      ],
    },
  },

  disclaimer: 'Myasthenia Gravis has a minimum rating of 30% when ascertainable residuals are present. The characteristic pattern of fatigable weakness (worsening with activity, improving with rest) should be documented. Additional ratings may be assigned for specific residuals affecting vision, swallowing, respiration, or limb function. Myasthenic crisis requiring ventilation warrants 100% during the acute period.',
};

// ============================================
// PHASE 1B: ADDITIONAL NEUROLOGICAL - CRITERIA
// ============================================

// Narcolepsy (DC 8108) - 38 CFR 4.124a

export const NARCOLEPSY_CRITERIA = {
  diagnosticCode: '8108',
  condition: 'Narcolepsy',
  cfrReference: '38 CFR 4.124a',

  ratings: [
    {
      percent: 80,
      summary: 'Severe - daily sleep attacks, frequent cataplexy, major occupational impairment',
      criteria: ['Daily or near-daily sleep attacks', 'Frequent cataplexy episodes', 'Unable to maintain employment', 'Symptoms uncontrolled despite treatment'],
    },
    {
      percent: 60,
      summary: 'Moderately severe - frequent sleep attacks, cataplexy present, significant impairment',
      criteria: ['Multiple sleep attacks per week', 'Cataplexy episodes present', 'Significant occupational impairment', 'Partial response to treatment'],
    },
    {
      percent: 40,
      summary: 'Moderate - regular sleep attacks, mild cataplexy, moderate impairment',
      criteria: ['Weekly sleep attacks', 'Mild or infrequent cataplexy', 'Moderate occupational impact', 'Requires medication management'],
    },
    {
      percent: 20,
      summary: 'Mild - occasional sleep attacks, controlled with medication',
      criteria: ['Occasional sleep attacks (less than weekly)', 'No or rare cataplexy', 'Mild occupational impact', 'Well-controlled on medication'],
    },
    {
      percent: 10,
      summary: 'Minimal - rare symptoms, well controlled',
      criteria: ['Rare sleep attacks', 'No cataplexy', 'Minimal functional impairment', 'Excellent response to treatment'],
    },
  ],

  note: 'Narcolepsy is rated based on frequency of sleep attacks, presence and severity of cataplexy, and overall functional impairment. Document sleep study results (MSLT showing sleep latency <8 minutes and 2+ SOREMPs), medication use, and impact on daily activities and employment.',

  definitions: {
    sleepAttack: {
      term: 'Sleep Attack',
      definition: 'Sudden, irresistible episode of sleep occurring at inappropriate times, often without warning. May last seconds to minutes.',
    },
    cataplexy: {
      term: 'Cataplexy',
      definition: 'Sudden loss of muscle tone triggered by strong emotions (laughter, surprise, anger). Pathognomonic for Type 1 narcolepsy. Can range from mild (facial drooping, slurred speech) to complete collapse.',
    },
    hypnagogicHallucination: {
      term: 'Hypnagogic Hallucination',
      definition: 'Vivid, often frightening hallucinations occurring at sleep onset. May be visual, auditory, or tactile.',
    },
    sleepParalysis: {
      term: 'Sleep Paralysis',
      definition: 'Temporary inability to move or speak while falling asleep or waking up. Often accompanied by hallucinations and sense of presence.',
    },
    automaticBehavior: {
      term: 'Automatic Behavior',
      definition: 'Performing routine tasks without conscious awareness during microsleep episodes. May result in errors, memory gaps, or dangerous situations.',
    },
  },

  disclaimer: 'This analysis is for documentation purposes only. VA rating decisions require sleep study confirmation (MSLT) and C&P examination findings.',
};

// ALS - Amyotrophic Lateral Sclerosis (DC 8017) - 38 CFR 4.124a

export const ALS_CRITERIA = {
  diagnosticCode: '8017',
  condition: 'Amyotrophic Lateral Sclerosis (ALS)',
  cfrReference: '38 CFR 4.124a',

  ratings: [
    {
      percent: 100,
      summary: 'Total disability - complete dependence, respiratory failure, or terminal stage',
      criteria: ['Complete dependence for all ADLs', 'Respiratory failure requiring ventilatory support', 'Unable to communicate or swallow', 'Terminal stage of disease'],
    },
    {
      percent: 80,
      summary: 'Severe - marked weakness in multiple regions, significant respiratory/bulbar involvement',
      criteria: ['Marked weakness in 3+ body regions', 'Significant respiratory compromise (FVC <50%)', 'Severe dysphagia requiring modified diet or feeding tube', 'Requires wheelchair or bed-bound'],
    },
    {
      percent: 60,
      summary: 'Moderately severe - progressive weakness, moderate respiratory/bulbar symptoms',
      criteria: ['Progressive weakness in 2+ body regions', 'Moderate respiratory involvement (FVC 50-70%)', 'Moderate dysphagia', 'Requires assistance with ADLs'],
    },
    {
      percent: 40,
      summary: 'Moderate - definite weakness, early bulbar or respiratory involvement',
      criteria: ['Definite weakness affecting function', 'Early respiratory or bulbar symptoms', 'Can perform most ADLs with difficulty', 'Ambulatory with assistance'],
    },
    {
      percent: 30,
      summary: 'Minimum rating - confirmed ALS diagnosis with symptoms',
      criteria: ['Confirmed ALS diagnosis', 'Early motor symptoms present', 'Mild functional impairment', 'Ambulatory and independent'],
    },
  ],

  note: 'ALS is a progressive, fatal motor neuron disease. VA presumes service connection for veterans who develop ALS. Given the progressive nature, ratings should be reviewed regularly. Additional ratings may apply for respiratory failure, dysphagia, speech impairment, and depression.',

  definitions: {
    upperMotorNeuron: {
      term: 'Upper Motor Neuron Signs',
      definition: 'Signs of corticospinal tract involvement: spasticity, hyperreflexia, Babinski sign, clonus.',
    },
    lowerMotorNeuron: {
      term: 'Lower Motor Neuron Signs',
      definition: 'Signs of anterior horn cell involvement: weakness, atrophy, fasciculations, hyporeflexia.',
    },
    bulbarSymptoms: {
      term: 'Bulbar Symptoms',
      definition: 'Symptoms from brainstem motor neuron involvement: dysarthria (slurred speech), dysphagia (difficulty swallowing), sialorrhea (drooling), emotional lability.',
    },
    fasciculations: {
      term: 'Fasciculations',
      definition: 'Visible spontaneous muscle twitches caused by denervation of muscle fibers. Common early sign of ALS.',
    },
    fvc: {
      term: 'Forced Vital Capacity (FVC)',
      definition: 'Measure of respiratory muscle strength. FVC <50% indicates significant respiratory compromise in ALS.',
    },
  },

  secondaryConditions: {
    description: "Amyotrophic Lateral Sclerosis / ALS (DC 8017) has a minimum rating of 100%. Despite the maximum schedular rating, secondary conditions are still important for Special Monthly Compensation (SMC) eligibility, which provides additional compensation beyond the 100% rate.",

    minimumRating: 100,

    categories: {
      speech: {
        name: 'Speech & Swallowing',
        conditions: [
          {
            manifestation: 'Speech Difficulties / Hoarseness',
            suggestedDCs: ['6519', '6516', '8210'],
            dcDescriptions: ['Complete organic Aphonia', 'Chronic Laryngitis', 'Cranial Nerves (10th - Vagus) - two evaluations for left and right'],
            nexusStrength: 'strong',
            notes: 'Select evaluation criteria that provides the most advantageous evaluation.',
            documentationTips: ['Speech pathology evaluation', 'Document communication methods', 'AAC device documentation'],
          },
          {
            manifestation: 'Paralysis of Soft Palate with Swallowing Difficulty',
            suggestedDCs: ['6521'],
            dcDescriptions: ['Pharynx'],
            nexusStrength: 'strong',
            notes: 'Document bulbar symptoms progression.',
            documentationTips: ['Swallow study', 'Document aspiration risk', 'Feeding tube documentation if applicable'],
          },
          {
            manifestation: 'Swallowing Difficulties (Dysphagia)',
            suggestedDCs: ['7203'],
            dcDescriptions: ['Stricture of the Esophagus'],
            nexusStrength: 'strong',
            notes: 'Critical for nutrition and aspiration risk. Document all interventions.',
            documentationTips: ['Modified barium swallow', 'Diet modifications', 'PEG tube if placed'],
          },
        ],
      },

      respiratory: {
        name: 'Respiratory Conditions',
        conditions: [
          {
            manifestation: 'Respiratory Conditions (including tracheostomy)',
            suggestedDCs: ['6520'],
            dcDescriptions: ['Stenosis of Larynx including residuals of laryngeal trauma - unilateral or bilateral'],
            nexusStrength: 'strong',
            notes: 'If present, PFT results should be of record. Respiratory failure is a major concern in ALS.',
            documentationTips: ['Pulmonary function tests', 'Document BiPAP/ventilator use', 'Tracheostomy records if applicable'],
          },
          {
            manifestation: 'Sleep Apnea or Sleep Apnea-like Condition',
            suggestedDCs: ['6847'],
            dcDescriptions: ['Sleep Apnea if manifested as a respiratory disability'],
            nexusStrength: 'strong',
            notes: 'Respiratory muscle weakness causes sleep-disordered breathing.',
            documentationTips: ['Sleep study', 'Document CPAP/BiPAP requirements', 'Oxygen saturation monitoring'],
          },
        ],
      },

      bowelBladder: {
        name: 'Bowel & Bladder Dysfunction',
        conditions: [
          {
            manifestation: 'Loss of Sphincter Control (with or without leakage)',
            suggestedDCs: ['7332'],
            dcDescriptions: ['Rectum and anus, impairment of sphincter control'],
            nexusStrength: 'strong',
            notes: 'Document incontinence frequency and severity.',
            documentationTips: ['Bowel diary', 'Document management needs', 'Caregiver assistance required'],
          },
          {
            manifestation: 'Chronic Constipation',
            suggestedDCs: ['7319'],
            dcDescriptions: ['Irritable colon syndrome, IBS, spastic colitis, mucous colitis'],
            nexusStrength: 'strong',
            notes: 'Autonomic dysfunction and immobility contribute to constipation.',
            documentationTips: ['Bowel management program', 'Medication log'],
          },
          {
            manifestation: 'Voiding Dysfunction',
            suggestedDCs: ['7542'],
            dcDescriptions: ['Neurogenic bladder - for leakage, frequency, or obstructed voiding'],
            nexusStrength: 'strong',
            notes: 'Only a single evaluation is warranted even if more than one dysfunction/symptom type is present.',
            documentationTips: ['Urodynamics if performed', 'Catheter documentation', 'Incontinence supplies needed'],
          },
          {
            manifestation: 'Recurrent Urinary Tract Infections',
            suggestedDCs: ['7527'],
            dcDescriptions: ['Voiding dysfunction or urinary tract infection'],
            nexusStrength: 'strong',
            notes: 'Common with bladder dysfunction and catheter use.',
            documentationTips: ['UTI history', 'Culture results', 'Treatment records'],
          },
        ],
      },

      sexual: {
        name: 'Sexual Dysfunction',
        conditions: [
          {
            manifestation: 'Erectile Dysfunction (Male)',
            suggestedDCs: ['7522'],
            dcDescriptions: ['Erectile Dysfunction (Male)'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'When associated to ALS diagnosis, grant SMC-K',
            notes: 'SMC-K is automatic for ED secondary to ALS.',
            documentationTips: ['Document onset relative to ALS', 'Urology evaluation'],
          },
          {
            manifestation: 'Female Sexual Arousal Disorder',
            suggestedDCs: ['7632'],
            dcDescriptions: ['Female sexual arousal disorder (FSAD)'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'When associated to ALS diagnosis, grant SMC-K',
            notes: 'SMC-K is automatic for FSAD secondary to ALS.',
            documentationTips: ['Document symptoms and impact', 'Gynecology evaluation if applicable'],
          },
        ],
      },

      upperExtremity: {
        name: 'Upper Extremity Impairment',
        conditions: [
          {
            manifestation: 'Upper Extremity Impairment',
            suggestedDCs: ['8514', '5125', '5109'],
            dcDescriptions: ['Radial nerve - impairment without loss of use (LOU)', 'LOU of one hand', 'LOU of both hands'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'LOU qualifies for SMC-K (one hand) or higher SMC (both hands). Critical for SMC calculations.',
            notes: 'Synthesize findings of neurologic exam (gait strength, deep tendon reflexes, sensation, muscle atrophy/weakness) and remaining effective function to assess level of impairment, including whether loss of use is present.',
            documentationTips: ['Serial neurological exams', 'Document progression', 'EMG findings', 'Functional capacity evaluation'],
          },
        ],
      },

      lowerExtremity: {
        name: 'Lower Extremity Impairment',
        conditions: [
          {
            manifestation: 'Lower Extremity Impairment',
            suggestedDCs: ['8520', '5167', '5110'],
            dcDescriptions: ['Sciatic nerve - impairment without LOU', 'LOU of one foot', 'LOU of both feet'],
            nexusStrength: 'strong',
            smcConsideration: true,
            smcNote: 'LOU qualifies for SMC-K (one foot) or higher SMC (both feet). Critical for SMC calculations.',
            notes: 'Same comprehensive assessment as upper extremity.',
            documentationTips: ['Gait analysis', 'Document wheelchair/mobility aid use', 'Fall history', 'Progressive weakness documentation'],
          },
        ],
      },

      mentalHealth: {
        name: 'Mental Health & Cognitive',
        conditions: [
          {
            manifestation: 'Depression',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Rated as mental health. If other mental disorder diagnoses are present, evaluate along with them.',
            documentationTips: ['Mental health treatment records', 'Document adjustment to diagnosis', 'PHQ-9 scores'],
          },
          {
            manifestation: 'Cognitive Impairment / Dementia',
            suggestedDCs: ['9326'],
            dcDescriptions: ['Dementia due to other neurologic or general medical conditions'],
            nexusStrength: 'strong',
            notes: 'ALS-FTD (frontotemporal dementia) occurs in a subset of ALS patients.',
            documentationTips: ['Neuropsychological testing', 'Document cognitive/behavioral changes', 'Caregiver reports'],
          },
        ],
      },
    },

    importantNotes: [
      'ALS has a MINIMUM rating of 100%',
      'Secondary conditions are CRITICAL for Special Monthly Compensation (SMC)',
      'SMC provides additional compensation BEYOND the 100% schedular rating',
      'SMC-K is AUTOMATIC for ED/FSAD when secondary to ALS',
      'If other mental disorder diagnoses are present, evaluate along with other mental disorder diagnoses',
      'Consider the need for Special Monthly Compensation at ALL levels',
      'Document all functional losses carefully for SMC determination',
      'ALS qualifies for presumptive service connection after 90+ days active duty',
    ],

    smcConsiderations: [
      'SMC-K automatic for ED (DC 7522) secondary to ALS',
      'SMC-K automatic for FSAD (DC 7632) secondary to ALS',
      'SMC-K for loss of use of one hand (DC 5125)',
      'SMC-K for loss of use of one foot (DC 5167)',
      'SMC-L for loss of use of both feet, one hand and one foot, or blindness',
      'SMC-R/S for Aid and Attendance or Housebound',
      'Multiple SMC-K awards can combine for higher SMC levels',
    ],

    documentationStrategy: [
      'Regular ALS clinic evaluations (every 3 months typically)',
      'Document ALSFRS-R scores over time',
      'Pulmonary function tests at each visit',
      'Comprehensive neurological exams documenting progression',
      'Document all assistive devices and durable medical equipment',
      'Respiratory support documentation (BiPAP, ventilator)',
      'Feeding support documentation (PEG tube)',
      'Document caregiver assistance needs for SMC-R/S consideration',
    ],

    presumptiveNote: 'ALS is presumptively service-connected for any veteran with 90+ days of continuous active duty. No specific in-service event required.',
  },


  disclaimer: 'This analysis is for documentation purposes only. ALS is presumptively service-connected for veterans. VA rating decisions require neurological examination and EMG/nerve conduction studies.',
};

// Syringomyelia (DC 8024) - 38 CFR 4.124a

export const SYRINGOMYELIA_CRITERIA = {
  diagnosticCode: '8024',
  condition: 'Syringomyelia',
  cfrReference: '38 CFR 4.124a',

  ratings: [
    {
      percent: 100,
      summary: 'Severe - profound sensory/motor deficits, complete dependence',
      criteria: ['Profound sensory loss', 'Severe weakness or paralysis', 'Complete dependence for ADLs', 'Severe pain uncontrolled by treatment'],
    },
    {
      percent: 80,
      summary: 'Marked sensory loss, significant weakness, major functional impairment',
      criteria: ['Marked cape-distribution sensory loss', 'Significant upper extremity weakness', 'Requires assistance for most ADLs', 'Chronic pain with limited control'],
    },
    {
      percent: 60,
      summary: 'Moderate sensory/motor deficits with functional limitations',
      criteria: ['Moderate sensory loss affecting function', 'Moderate weakness', 'Burns/injuries from sensory loss', 'Significant pain requiring treatment'],
    },
    {
      percent: 40,
      summary: 'Definite sensory changes and mild weakness',
      criteria: ['Definite dissociated sensory loss', 'Mild weakness', 'Some functional impairment', 'Intermittent pain'],
    },
    {
      percent: 20,
      summary: 'Mild symptoms with minimal functional impact',
      criteria: ['Mild sensory changes', 'Minimal or no weakness', 'Minor functional impairment', 'Symptoms controlled'],
    },
  ],

  note: 'Syringomyelia is rated based on the extent of sensory loss, motor weakness, pain, and functional impairment. The characteristic "cape-like" or "suspended" sensory loss pattern (loss of pain/temperature sensation with preserved touch) is pathognomonic. Document MRI findings showing syrinx location and size.',

  definitions: {
    syrinx: {
      term: 'Syrinx',
      definition: 'Fluid-filled cavity (cyst) within the spinal cord that damages nerve fibers and causes progressive neurological symptoms.',
    },
    dissociatedSensoryLoss: {
      term: 'Dissociated Sensory Loss',
      definition: 'Loss of pain and temperature sensation with preserved light touch and proprioception. Caused by damage to crossing spinothalamic fibers.',
    },
    capeDistribution: {
      term: 'Cape Distribution',
      definition: 'Pattern of sensory loss affecting shoulders, arms, and upper back in a cape-like pattern, characteristic of cervical syringomyelia.',
    },
    charcotJoint: {
      term: 'Charcot Joint',
      definition: 'Neuropathic arthropathy (joint destruction) resulting from loss of protective pain sensation.',
    },
  },

  disclaimer: 'This analysis is for documentation purposes only. VA rating decisions require MRI confirmation and neurological examination.',
};

// Myelitis (DC 8010) - 38 CFR 4.124a

export const MYELITIS_CRITERIA = {
  diagnosticCode: '8010',
  condition: 'Myelitis',
  cfrReference: '38 CFR 4.124a',

  ratings: [
    {
      percent: 100,
      summary: 'Complete or near-complete paralysis, total dependence',
      criteria: ['Complete or near-complete paralysis below lesion level', 'Total loss of bladder/bowel control', 'Complete dependence for all ADLs', 'Respiratory compromise if cervical'],
    },
    {
      percent: 80,
      summary: 'Severe - marked weakness/paralysis, significant bladder/bowel dysfunction',
      criteria: ['Marked weakness or incomplete paralysis', 'Significant bladder/bowel dysfunction', 'Requires wheelchair or significant assistance', 'Severe sensory loss'],
    },
    {
      percent: 60,
      summary: 'Moderately severe - significant weakness, bladder/bowel involvement',
      criteria: ['Significant weakness affecting ambulation', 'Moderate bladder/bowel dysfunction', 'Requires assistive devices', 'Moderate sensory impairment'],
    },
    {
      percent: 40,
      summary: 'Moderate - definite weakness, some bladder/bowel symptoms',
      criteria: ['Definite weakness', 'Mild bladder/bowel symptoms', 'Ambulatory with difficulty', 'Sensory changes present'],
    },
    {
      percent: 20,
      summary: 'Mild residuals with minimal functional impact',
      criteria: ['Mild weakness', 'Minimal or resolved bladder/bowel symptoms', 'Minor sensory changes', 'Good functional recovery'],
    },
  ],

  note: 'Myelitis (including transverse myelitis) is rated based on residual deficits after acute phase resolves. The level of spinal cord involvement determines affected body regions. Additional ratings may apply for bladder dysfunction (DC 7542), bowel dysfunction (DC 7332), and sexual dysfunction.',

  definitions: {
    transverseMyelitis: {
      term: 'Transverse Myelitis',
      definition: 'Inflammation across the full width of the spinal cord at one or more levels, causing motor, sensory, and autonomic dysfunction below the lesion.',
    },
    sensoryLevel: {
      term: 'Sensory Level',
      definition: 'The highest spinal cord level at which sensation is impaired, indicating the location of the lesion.',
    },
    spasticity: {
      term: 'Spasticity',
      definition: 'Increased muscle tone and stiffness due to upper motor neuron damage, often seen in chronic myelitis.',
    },
    neurogenicBladder: {
      term: 'Neurogenic Bladder',
      definition: 'Bladder dysfunction resulting from spinal cord damage, may cause retention, incontinence, or both.',
    },
  },

  disclaimer: 'This analysis is for documentation purposes only. VA rating decisions require MRI findings, lumbar puncture results (if available), and neurological examination.',
};


// WEAK FOOT RATING CRITERIA (DC 5277)
export const WEAK_FOOT_CRITERIA = {
  diagnosticCode: '5277',
  condition: 'Weak Foot (Bilateral)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5277',

  ratingNote: 'DC 5277 rates bilateral weak foot as a symptomatic condition secondary to many constitutional conditions. The underlying condition should also be rated. Minimum rating is 10%.',

  ratings: [
    {
      percent: 10,
      summary: 'Symptomatic bilateral weak foot with atrophy, disturbed circulation, and weakness',
      criteriaDescription: [
        'Bilateral (both feet) involvement required',
        'Symptomatic condition secondary to constitutional conditions',
        'Characterized by atrophy of the musculature',
        'Disturbed circulation',
        'Weakness affecting foot function',
      ],
      evidenceNeeded: [
        'Documentation of bilateral foot weakness',
        'Evidence of muscle atrophy on examination',
        'Circulation problems (cold feet, color changes)',
        'Underlying condition causing weak feet',
        'Functional limitations from weakness',
      ],
    },
  ],

  definitions: {
    bilateralWeakFoot: {
      term: 'Bilateral Weak Foot',
      definition: 'A symptomatic condition affecting both feet, secondary to constitutional or systemic conditions, characterized by muscle atrophy, circulatory disturbance, and weakness.',
    },
    constitutionalConditions: {
      term: 'Constitutional Conditions',
      definition: 'Systemic diseases that can cause bilateral weak foot include diabetes, peripheral neuropathy, vascular disease, and neuromuscular disorders.',
    },
    muscleAtrophy: {
      term: 'Muscle Atrophy',
      definition: 'Wasting or thinning of foot muscles visible on examination or measurable by comparison with normal.',
    },
    disturbedCirculation: {
      term: 'Disturbed Circulation',
      definition: 'Circulatory problems in the feet including cold feet, color changes, delayed capillary refill, or poor wound healing.',
    },
  },

  disclaimer: 'DC 5277 provides a minimum 10% rating for bilateral weak foot. The underlying constitutional condition causing the weak foot should be separately identified and rated if appropriate.',
};

// CLAW FOOT (PES CAVUS) RATING CRITERIA (DC 5278)
export const CLAW_FOOT_CRITERIA = {
  diagnosticCode: '5278',
  condition: 'Claw Foot (Pes Cavus)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5278',

  ratingNote: 'DC 5278 rates acquired claw foot (pes cavus) based on severity and bilateral/unilateral involvement. Higher ratings require more severe deformity with hammer toes, callosities, and varus deformity.',

  ratings: [
    {
      percent: 50,
      summary: 'Bilateral: Marked plantar fascia contraction, dropped forefoot, all toes hammer, very painful callosities, marked varus',
      criteriaDescription: [
        'BILATERAL involvement (both feet)',
        'Marked contraction of plantar fascia',
        'Dropped forefoot',
        'All toes hammer toes',
        'Very painful callosities',
        'Marked varus deformity',
      ],
      evidenceNeeded: [
        'Bilateral foot examination',
        'Documentation of plantar fascia contraction',
        'X-rays showing deformity',
        'Photos of hammer toes and callosities',
        'Pain documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Unilateral severe (as 50%), OR Bilateral: toes dorsiflexed, ankle dorsiflexion to right angle, shortened plantar fascia, marked metatarsal tenderness',
      criteriaDescription: [
        'UNILATERAL with: marked plantar fascia contraction, dropped forefoot, all toes hammer, very painful callosities, marked varus',
        'OR BILATERAL with: All toes tending to dorsiflexion, limitation of dorsiflexion at ankle to right angle, shortened plantar fascia, marked tenderness under metatarsal heads',
      ],
      evidenceNeeded: [
        'Examination documenting specific findings',
        'Ankle ROM measurements',
        'Documentation of metatarsal head tenderness',
        'Toe position assessment',
      ],
    },
    {
      percent: 20,
      summary: 'Unilateral: toes dorsiflexed, ankle dorsiflexion limited to right angle, shortened plantar fascia, marked metatarsal tenderness',
      criteriaDescription: [
        'UNILATERAL with:',
        'All toes tending to dorsiflexion',
        'Limitation of dorsiflexion at ankle to right angle',
        'Shortened plantar fascia',
        'Marked tenderness under metatarsal heads',
      ],
      evidenceNeeded: [
        'Single foot examination with documented findings',
        'Ankle ROM measurement',
        'Plantar fascia assessment',
        'Metatarsal tenderness documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Bilateral OR Unilateral: Great toe dorsiflexed, some ankle dorsiflexion limitation, definite metatarsal tenderness',
      criteriaDescription: [
        'BILATERAL or UNILATERAL with:',
        'Great toe dorsiflexed',
        'Some limitation of dorsiflexion at ankle',
        'Definite tenderness under metatarsal heads',
      ],
      evidenceNeeded: [
        'Foot examination documenting toe position',
        'Ankle ROM assessment',
        'Metatarsal tenderness on exam',
      ],
    },
  ],

  definitions: {
    pesCavus: {
      term: 'Pes Cavus (Claw Foot)',
      definition: 'A foot deformity characterized by an abnormally high arch that does not flatten with weight bearing. The arch remains rigid and elevated.',
    },
    hammerToes: {
      term: 'Hammer Toes',
      definition: 'Toes bent at the middle joint in a claw-like position, often associated with claw foot deformity.',
    },
    varusDeformity: {
      term: 'Varus Deformity',
      definition: 'Inward tilting of the heel (hindfoot varus), causing weight to shift to the outer edge of the foot.',
    },
    droppedForefoot: {
      term: 'Dropped Forefoot',
      definition: 'Forefoot positioned lower than the hindfoot due to plantar flexion of the metatarsals.',
    },
    callosities: {
      term: 'Callosities',
      definition: 'Thickened areas of skin (calluses) that form from abnormal pressure, often painful in claw foot.',
    },
  },

  disclaimer: 'DC 5278 ratings cannot be combined with claw foot ratings under other foot codes. Congenital pes cavus without aggravation is typically not service-connected.',
};


// METATARSALGIA (MORTON'S DISEASE) RATING CRITERIA (DC 5279)
export const METATARSALGIA_CRITERIA = {
  diagnosticCode: '5279',
  condition: "Metatarsalgia (Morton's Disease)",
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5279',

  ratingNote: 'DC 5279 provides a single 10% rating for anterior metatarsalgia (Morton\'s disease), whether unilateral or bilateral. This is the maximum schedular rating for this condition.',

  ratings: [
    {
      percent: 10,
      summary: 'Anterior metatarsalgia, unilateral or bilateral',
      criteriaDescription: [
        'Anterior metatarsalgia (pain in ball of foot)',
        'May include Morton neuroma',
        'Unilateral OR bilateral (same rating)',
        'Pain and tenderness under metatarsal heads',
      ],
      evidenceNeeded: [
        'Diagnosis of metatarsalgia or Morton neuroma',
        'Pain documentation with location',
        'Physical examination findings',
        'Impact on walking/standing',
      ],
    },
  ],

  definitions: {
    metatarsalgia: {
      term: 'Metatarsalgia',
      definition: 'Pain in the ball of the foot (metatarsal region), typically worse with weight bearing, walking, or standing.',
    },
    mortonNeuroma: {
      term: "Morton's Neuroma",
      definition: 'A thickening of nerve tissue between the metatarsal heads, typically between the 3rd and 4th toes, causing sharp, burning pain and numbness.',
    },
    anteriorMetatarsalgia: {
      term: 'Anterior Metatarsalgia',
      definition: 'Pain specifically in the front (anterior) portion of the metatarsal region, at the ball of the foot.',
    },
  },

  disclaimer: 'DC 5279 provides only a 10% rating regardless of unilateral or bilateral involvement. For higher ratings, consider if other foot codes apply or if extraschedular consideration is warranted.',
};

// HALLUX VALGUS (BUNION) RATING CRITERIA (DC 5280)
export const HALLUX_VALGUS_CRITERIA = {
  diagnosticCode: '5280',
  condition: 'Hallux Valgus (Bunion)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5280',

  ratingNote: 'DC 5280 rates unilateral hallux valgus at 10% for either: (1) operated with resection of metatarsal head, OR (2) severe, equivalent to amputation of great toe. Each foot rated separately.',

  ratings: [
    {
      percent: 10,
      summary: 'Unilateral: Operated with metatarsal head resection, OR severe (equivalent to great toe amputation)',
      criteriaDescription: [
        'UNILATERAL hallux valgus with EITHER:',
        '1. Operated with resection of metatarsal head, OR',
        '2. Severe, if equivalent to amputation of great toe',
        'Rate each foot separately if bilateral',
      ],
      evidenceNeeded: [
        'Surgical records if operated (bunionectomy)',
        'X-rays showing severity of deformity',
        'Functional assessment comparing to toe amputation',
        'Pain and limitation documentation',
      ],
    },
    {
      percent: 0,
      summary: 'Mild to moderate hallux valgus without surgery or severe functional loss',
      criteriaDescription: [
        'Hallux valgus present but not severe',
        'No surgical resection of metatarsal head',
        'Function not equivalent to great toe amputation',
      ],
      evidenceNeeded: [
        'Diagnosis of hallux valgus',
        'Document symptoms for potential future increase',
      ],
    },
  ],

  definitions: {
    halluxValgus: {
      term: 'Hallux Valgus',
      definition: 'A deformity where the big toe angles toward the other toes, creating a prominent bump (bunion) at the base of the big toe.',
    },
    bunion: {
      term: 'Bunion',
      definition: 'The bony bump that forms on the joint at the base of the big toe due to hallux valgus deformity.',
    },
    metatarsalHeadResection: {
      term: 'Metatarsal Head Resection',
      definition: 'Surgical removal of part of the metatarsal head (bunionectomy) to correct hallux valgus deformity.',
    },
    equivalentToAmputation: {
      term: 'Equivalent to Amputation',
      definition: 'Severity causing functional loss comparable to if the great toe were amputated - severely limited motion and function.',
    },
  },

  disclaimer: 'DC 5280 rates each foot separately. Bilateral hallux valgus can result in 10% for each foot if criteria are met. Post-surgical residuals may warrant higher ratings under other codes.',
};

// HALLUX RIGIDUS RATING CRITERIA (DC 5281)
export const HALLUX_RIGIDUS_CRITERIA = {
  diagnosticCode: '5281',
  condition: 'Hallux Rigidus',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5281',

  ratingNote: 'DC 5281 rates unilateral hallux rigidus the same as severe hallux valgus (10%) when severe. Note: Cannot be combined with claw foot ratings.',

  ratings: [
    {
      percent: 10,
      summary: 'Unilateral, severe: Rate as hallux valgus, severe',
      criteriaDescription: [
        'UNILATERAL hallux rigidus',
        'Severe stiffness/rigidity of big toe joint',
        'Rate as severe hallux valgus (10%)',
        'Note: Not to be combined with claw foot ratings',
      ],
      evidenceNeeded: [
        'Diagnosis of hallux rigidus',
        'ROM measurements of big toe (MTP joint)',
        'X-rays showing arthritic changes',
        'Functional limitation documentation',
      ],
    },
    {
      percent: 0,
      summary: 'Mild to moderate hallux rigidus',
      criteriaDescription: [
        'Hallux rigidus present but not severe',
        'Some limitation of big toe motion',
        'May progress to severe over time',
      ],
      evidenceNeeded: [
        'Diagnosis documentation',
        'ROM measurements for baseline',
        'Symptom tracking for future claim',
      ],
    },
  ],

  definitions: {
    halluxRigidus: {
      term: 'Hallux Rigidus',
      definition: 'Stiffness and limited motion of the big toe at the MTP joint, usually due to arthritis. The toe becomes rigid and painful with movement.',
    },
    mtpJoint: {
      term: 'MTP Joint',
      definition: 'Metatarsophalangeal joint - the joint at the base of the big toe where the first metatarsal meets the proximal phalanx.',
    },
    boneSpur: {
      term: 'Bone Spur (Osteophyte)',
      definition: 'Bony projection that can form on top of the big toe joint in hallux rigidus, causing additional pain and limiting shoe wear.',
    },
  },

  disclaimer: 'DC 5281 rates hallux rigidus as severe hallux valgus. Cannot be combined with claw foot (DC 5278) ratings. Each foot rated separately if bilateral.',
};

// ============================================
// PHASE 1C: PERIPHERAL NERVE CRITERIA
// 38 CFR 4.124a - Diseases of the Peripheral Nerves
// ============================================

// UPPER RADICULAR GROUP (C5-C6) - DC 8510/8610/8710

export const UPPER_RADICULAR_GROUP_CRITERIA = {
  diagnosticCodes: { paralysis: '8510', neuritis: '8610', neuralgia: '8710' },
  condition: 'Upper Radicular Group (C5-C6) Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 70,
      summary: 'Complete paralysis (major extremity) - all shoulder and elbow movements lost or severely affected',
      criteria: ['Complete paralysis of upper radicular group', 'All shoulder movements lost or severely affected', 'All elbow movements lost or severely affected', 'Hand and wrist movements not affected'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Complete paralysis (minor extremity) - all shoulder and elbow movements lost or severely affected',
      criteria: ['Complete paralysis of upper radicular group', 'All shoulder movements lost or severely affected', 'All elbow movements lost or severely affected', 'Hand and wrist movements not affected'],
      extremity: 'minor'
    },
    {
      percent: 50,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant loss of shoulder function', 'Significant loss of elbow function', 'Motor and sensory involvement'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (minor) OR Moderate incomplete paralysis (major)',
      criteria: ['Severe incomplete paralysis (minor extremity)', 'OR Moderate incomplete paralysis (major extremity)', 'Moderate functional impairment', 'Mixed motor and sensory symptoms'],
      extremity: 'both'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable weakness', 'Some sensory changes', 'Functional limitations present'],
      extremity: 'minor'
    },
    {
      percent: 20,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The upper radicular group involves C5-C6 nerve roots affecting shoulder and elbow function. Ratings differ based on major (dominant) vs minor (non-dominant) extremity. When involvement is wholly sensory, rate as mild or at most moderate. Neuritis (8610) and neuralgia (8710) are rated using the same criteria.',
  definitions: {
    'complete paralysis': {
      term: 'Complete Paralysis',
      definition: 'Total loss of motor function in muscles supplied by the affected nerve group. For upper radicular group: all shoulder and elbow movements lost or severely affected.'
    },
    'incomplete paralysis': {
      term: 'Incomplete Paralysis',
      definition: 'Degree of lost or impaired function substantially less than complete paralysis. May be due to varied level of nerve lesion or partial regeneration.'
    },
    'major extremity': {
      term: 'Major Extremity',
      definition: 'The dominant arm for upper extremity conditions. Higher ratings apply due to greater functional impact.'
    },
    'minor extremity': {
      term: 'Minor Extremity',
      definition: 'The non-dominant arm for upper extremity conditions. Lower ratings apply compared to major extremity.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Peripheral nerve ratings require neurological examination documenting motor and sensory deficits. VA determines major/minor extremity based on handedness.',
};

// MIDDLE RADICULAR GROUP (C7) - DC 8511/8611/8711

export const MIDDLE_RADICULAR_GROUP_CRITERIA = {
  diagnosticCodes: { paralysis: '8511', neuritis: '8611', neuralgia: '8711' },
  condition: 'Middle Radicular Group (C7) Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 70,
      summary: 'Complete paralysis (major) - arm adduction/abduction/rotation, elbow flexion, wrist extension lost',
      criteria: ['Complete paralysis of middle radicular group', 'Adduction of arm lost or severely affected', 'Abduction and rotation of arm lost or severely affected', 'Flexion of elbow lost or severely affected', 'Extension of wrist lost or severely affected'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Complete paralysis (minor) - arm adduction/abduction/rotation, elbow flexion, wrist extension lost',
      criteria: ['Complete paralysis of middle radicular group', 'Adduction of arm lost or severely affected', 'Abduction and rotation of arm lost or severely affected', 'Flexion of elbow lost or severely affected', 'Extension of wrist lost or severely affected'],
      extremity: 'minor'
    },
    {
      percent: 50,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant loss of arm rotation', 'Significant elbow flexion weakness', 'Significant wrist extension weakness'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (minor) OR Moderate incomplete paralysis (major)',
      criteria: ['Severe incomplete paralysis (minor)', 'OR Moderate incomplete paralysis (major)', 'Moderate functional limitations', 'Mixed motor and sensory deficits'],
      extremity: 'both'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable weakness in C7 distribution', 'Some sensory changes', 'Functional limitations present'],
      extremity: 'minor'
    },
    {
      percent: 20,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The middle radicular group involves the C7 nerve root affecting arm rotation, elbow flexion, and wrist extension. Neuritis (8611) and neuralgia (8711) use the same rating criteria.',
  definitions: {
    'complete paralysis': {
      term: 'Complete Paralysis',
      definition: 'Total loss of motor function. For middle radicular group: arm adduction, abduction, rotation, elbow flexion, and wrist extension all lost or severely affected.'
    },
    'incomplete paralysis': {
      term: 'Incomplete Paralysis',
      definition: 'Partial loss of function substantially less than complete paralysis picture.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Peripheral nerve ratings require neurological examination documenting motor and sensory deficits.',
};

// LOWER RADICULAR GROUP (C8-T1) - DC 8512/8612/8712

export const LOWER_RADICULAR_GROUP_CRITERIA = {
  diagnosticCodes: { paralysis: '8512', neuritis: '8612', neuralgia: '8712' },
  condition: 'Lower Radicular Group (C8-T1) Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 70,
      summary: 'Complete paralysis (major) - all intrinsic hand muscles paralyzed, substantial loss of hand use',
      criteria: ['Complete paralysis of lower radicular group', 'All intrinsic muscles of hand paralyzed', 'Some or all flexors of wrist and fingers paralyzed', 'Substantial loss of use of hand'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Complete paralysis (minor) - all intrinsic hand muscles paralyzed, substantial loss of hand use',
      criteria: ['Complete paralysis of lower radicular group', 'All intrinsic muscles of hand paralyzed', 'Some or all flexors of wrist and fingers paralyzed', 'Substantial loss of use of hand'],
      extremity: 'minor'
    },
    {
      percent: 50,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant intrinsic hand muscle weakness', 'Significant grip impairment', 'Major functional loss'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (minor) OR Moderate incomplete paralysis (major)',
      criteria: ['Severe incomplete paralysis (minor)', 'OR Moderate incomplete paralysis (major)', 'Moderate hand function impairment', 'Mixed motor and sensory deficits'],
      extremity: 'both'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable hand weakness', 'Grip strength reduced', 'Fine motor difficulties'],
      extremity: 'minor'
    },
    {
      percent: 20,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The lower radicular group involves C8-T1 nerve roots affecting hand intrinsic muscles and finger/wrist flexors. Neuritis (8612) and neuralgia (8712) use the same rating criteria.',
  definitions: {
    'complete paralysis': {
      term: 'Complete Paralysis',
      definition: 'Total loss of motor function. For lower radicular group: all intrinsic muscles of hand and some or all flexors of wrist and fingers paralyzed, resulting in substantial loss of use of hand.'
    },
    'intrinsic muscles': {
      term: 'Intrinsic Hand Muscles',
      definition: 'Small muscles within the hand that control fine motor movements, including the lumbricals, interossei, thenar, and hypothenar muscles.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Peripheral nerve ratings require neurological examination documenting motor and sensory deficits.',
};

// ALL RADICULAR GROUPS (BRACHIAL PLEXUS) - DC 8513/8613/8713

export const ALL_RADICULAR_GROUPS_CRITERIA = {
  diagnosticCodes: { paralysis: '8513', neuritis: '8613', neuralgia: '8713' },
  condition: 'All Radicular Groups (Complete Brachial Plexus) Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 90,
      summary: 'Complete paralysis (major extremity) - total loss of arm function',
      criteria: ['Complete paralysis of all radicular groups', 'Total loss of shoulder, elbow, wrist, and hand function', 'Complete brachial plexus injury', 'Arm essentially non-functional'],
      extremity: 'major'
    },
    {
      percent: 80,
      summary: 'Complete paralysis (minor extremity) - total loss of arm function',
      criteria: ['Complete paralysis of all radicular groups', 'Total loss of shoulder, elbow, wrist, and hand function', 'Complete brachial plexus injury', 'Arm essentially non-functional'],
      extremity: 'minor'
    },
    {
      percent: 70,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant loss of function at all levels', 'Multiple radicular group involvement', 'Major functional impairment'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Severe incomplete paralysis (minor extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant loss of function at all levels', 'Multiple radicular group involvement', 'Major functional impairment'],
      extremity: 'minor'
    },
    {
      percent: 40,
      summary: 'Moderate incomplete paralysis (major extremity)',
      criteria: ['Moderate incomplete paralysis', 'Moderate loss at multiple levels', 'Mixed motor and sensory deficits', 'Moderate functional limitations'],
      extremity: 'major'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Moderate loss at multiple levels', 'Mixed motor and sensory deficits', 'Moderate functional limitations'],
      extremity: 'minor'
    },
    {
      percent: 20,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness at multiple levels', 'Primarily sensory symptoms', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'All radicular groups involvement indicates complete brachial plexus injury affecting C5-T1. This is the most severe upper extremity nerve rating. Neuritis (8613) and neuralgia (8713) use the same criteria.',
  definitions: {
    'brachial plexus': {
      term: 'Brachial Plexus',
      definition: 'Network of nerves formed by C5-T1 nerve roots that controls movement and sensation in the shoulder, arm, and hand.'
    },
    'complete paralysis': {
      term: 'Complete Paralysis',
      definition: 'Total loss of motor function throughout the entire arm from shoulder to hand.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Brachial plexus injury ratings require comprehensive neurological examination.',
};

// RADIAL NERVE (MUSCULOSPIRAL) - DC 8514/8614/8714

export const RADIAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8514', neuritis: '8614', neuralgia: '8714' },
  condition: 'Radial Nerve (Musculospiral) Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 70,
      summary: 'Complete paralysis (major) - wrist drop, finger drop, cannot extend hand/fingers/thumb',
      criteria: ['Complete paralysis of radial nerve', 'Drop of hand and fingers', 'Wrist and fingers perpetually flexed', 'Thumb adducted falling within line of outer border of index finger', 'Cannot extend hand at wrist', 'Cannot extend proximal phalanges of fingers', 'Cannot extend thumb', 'Cannot make lateral movement of wrist', 'Supination of hand weakened', 'Extension and flexion of elbow weakened', 'Loss of synergic motion of extensors impairs hand grip seriously'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Complete paralysis (minor) - wrist drop, finger drop, cannot extend hand/fingers/thumb',
      criteria: ['Complete paralysis of radial nerve', 'Drop of hand and fingers', 'Wrist and fingers perpetually flexed', 'Thumb adducted', 'Cannot extend hand, fingers, or thumb', 'Cannot make lateral wrist movement', 'Weakened supination and elbow function'],
      extremity: 'minor'
    },
    {
      percent: 50,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant wrist extension weakness', 'Significant finger extension weakness', 'Marked functional impairment'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (minor extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant wrist extension weakness', 'Significant finger extension weakness', 'Marked functional impairment'],
      extremity: 'minor'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (major extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable extension weakness', 'Some grip impairment', 'Moderate functional limitations'],
      extremity: 'major'
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis (minor) OR Mild incomplete paralysis (major or minor)',
      criteria: ['Moderate incomplete paralysis (minor)', 'OR Mild incomplete paralysis (either extremity)', 'Mild to moderate weakness', 'Some sensory symptoms', 'Minor to moderate functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The radial nerve controls wrist and finger extension. Complete paralysis results in classic "wrist drop." Note: Lesions involving only dissociation of extensor communis digitorum or paralysis below the extensor communis digitorum will not exceed moderate rating. Total paralysis of the triceps occurs only as the greatest rarity.',
  definitions: {
    'wrist drop': {
      term: 'Wrist Drop',
      definition: 'Inability to extend the wrist, causing the hand to hang limply. Classic sign of radial nerve palsy.'
    },
    'synergic motion': {
      term: 'Synergic Motion',
      definition: 'Coordinated movement of multiple muscles working together. Loss impairs complex movements like grip.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Radial nerve ratings require neurological examination documenting motor and sensory deficits.',
};

// MEDIAN NERVE - DC 8515/8615/8715

export const MEDIAN_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8515', neuritis: '8615', neuralgia: '8715' },
  condition: 'Median Nerve Paralysis (Carpal Tunnel Syndrome)',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 70,
      summary: 'Complete paralysis (major) - ape hand deformity, cannot make fist, thumb opposition lost',
      criteria: ['Complete paralysis of median nerve', 'Hand inclined to ulnar side', 'Index and middle fingers more extended than normal', 'Considerable atrophy of thenar eminence muscles', 'Thumb in plane of hand (ape hand)', 'Pronation incomplete and defective', 'Absence of flexion of index finger', 'Feeble flexion of middle finger', 'Cannot make a fist', 'Index and middle fingers remain extended', 'Cannot flex distal phalanx of thumb', 'Defective opposition and abduction of thumb at right angles to palm', 'Flexion of wrist weakened', 'Pain with trophic disturbances'],
      extremity: 'major'
    },
    {
      percent: 60,
      summary: 'Complete paralysis (minor) - ape hand deformity, cannot make fist, thumb opposition lost',
      criteria: ['Complete paralysis of median nerve', 'Ape hand deformity', 'Cannot make a fist', 'Thenar atrophy', 'Lost thumb opposition', 'Pain with trophic disturbances'],
      extremity: 'minor'
    },
    {
      percent: 50,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant thenar weakness/atrophy', 'Marked sensory loss in median distribution', 'Significant functional impairment', 'Difficulty with pinch and grip'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (minor extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant thenar weakness/atrophy', 'Marked sensory loss', 'Significant functional impairment'],
      extremity: 'minor'
    },
    {
      percent: 30,
      summary: 'Moderate incomplete paralysis (major extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable thenar weakness', 'Moderate sensory symptoms', 'Moderate functional limitations', 'Night symptoms common'],
      extremity: 'major'
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable thenar weakness', 'Moderate sensory symptoms', 'Moderate functional limitations'],
      extremity: 'minor'
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Primarily sensory symptoms', 'Numbness and tingling in median distribution', 'Minimal weakness', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The median nerve is most commonly affected at the wrist (carpal tunnel syndrome). It controls thumb opposition, index/middle finger flexion, and sensation to the palmar thumb, index, middle, and half of ring finger. When involvement is wholly sensory, rate as mild or at most moderate.',
  definitions: {
    'ape hand': {
      term: 'Ape Hand Deformity',
      definition: 'Flattening of the thenar eminence with thumb lying in the same plane as the palm, resembling an ape hand. Results from thenar muscle atrophy due to median nerve damage.'
    },
    'thenar eminence': {
      term: 'Thenar Eminence',
      definition: 'The fleshy mound at the base of the thumb formed by the thenar muscles (abductor pollicis brevis, flexor pollicis brevis, opponens pollicis).'
    },
    'carpal tunnel syndrome': {
      term: 'Carpal Tunnel Syndrome',
      definition: 'Compression of the median nerve at the wrist causing numbness, tingling, and weakness in the hand. Most common entrapment neuropathy.'
    },
    'trophic disturbances': {
      term: 'Trophic Disturbances',
      definition: 'Changes in skin, nails, or hair due to nerve damage, including dry/shiny skin, brittle nails, and hair loss in affected areas.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Median nerve/carpal tunnel ratings require nerve conduction studies and clinical examination.',
};

// ULNAR NERVE - DC 8516/8616/8716

export const ULNAR_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8516', neuritis: '8616', neuralgia: '8716' },
  condition: 'Ulnar Nerve Paralysis (Cubital Tunnel Syndrome)',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 60,
      summary: 'Complete paralysis (major) - claw hand deformity, cannot spread fingers, lost thumb adduction',
      criteria: ['Complete paralysis of ulnar nerve', 'Griffin claw deformity due to flexor contraction of ring and little fingers', 'Atrophy very marked in dorsal interspace', 'Atrophy of thenar and hypothenar eminences', 'Loss of extension of ring and little fingers', 'Cannot spread the fingers (or reverse)', 'Cannot adduct the thumb', 'Flexion of wrist weakened'],
      extremity: 'major'
    },
    {
      percent: 50,
      summary: 'Complete paralysis (minor) - claw hand deformity, cannot spread fingers, lost thumb adduction',
      criteria: ['Complete paralysis of ulnar nerve', 'Griffin claw deformity', 'Marked interosseous atrophy', 'Thenar and hypothenar atrophy', 'Cannot spread or adduct fingers', 'Cannot adduct thumb', 'Weakened wrist flexion'],
      extremity: 'minor'
    },
    {
      percent: 40,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant interosseous weakness/atrophy', 'Marked grip weakness', 'Significant sensory loss in ulnar distribution', 'Major functional impairment'],
      extremity: 'major'
    },
    {
      percent: 30,
      summary: 'Severe incomplete paralysis (minor) OR Moderate incomplete paralysis (major)',
      criteria: ['Severe incomplete paralysis (minor)', 'OR Moderate incomplete paralysis (major)', 'Noticeable weakness and atrophy', 'Moderate to significant sensory symptoms', 'Moderate to significant functional limitations'],
      extremity: 'both'
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis (minor extremity)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable weakness', 'Moderate sensory symptoms', 'Moderate functional limitations'],
      extremity: 'minor'
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis (major or minor extremity)',
      criteria: ['Mild incomplete paralysis', 'Primarily sensory symptoms', 'Numbness in ring/little fingers', 'Minimal weakness', 'Minor functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The ulnar nerve is commonly affected at the elbow (cubital tunnel syndrome). It controls finger spreading/adduction, thumb adduction, and sensation to the little finger and half of ring finger. Claw hand deformity is characteristic of complete ulnar nerve palsy.',
  definitions: {
    'claw hand': {
      term: 'Claw Hand (Griffin Claw)',
      definition: 'Deformity with hyperextension at MCP joints and flexion at IP joints of ring and little fingers, due to loss of intrinsic muscle function with intact extrinsic flexors.'
    },
    'interossei muscles': {
      term: 'Interossei Muscles',
      definition: 'Small muscles between the metacarpal bones that spread (dorsal interossei) and adduct (palmar interossei) the fingers.'
    },
    'hypothenar eminence': {
      term: 'Hypothenar Eminence',
      definition: 'The fleshy mound on the ulnar side of the palm at the base of the little finger.'
    },
    'cubital tunnel syndrome': {
      term: 'Cubital Tunnel Syndrome',
      definition: 'Compression of the ulnar nerve at the elbow causing numbness in the ring/little fingers and hand weakness. Second most common entrapment neuropathy.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Ulnar nerve/cubital tunnel ratings require nerve conduction studies and clinical examination.',
};

// MUSCULOCUTANEOUS NERVE - DC 8517/8617/8717

export const MUSCULOCUTANEOUS_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8517', neuritis: '8617', neuralgia: '8717' },
  condition: 'Musculocutaneous Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 30,
      summary: 'Complete paralysis (major) - weakness but not loss of elbow flexion and forearm supination',
      criteria: ['Complete paralysis of musculocutaneous nerve', 'Weakness of elbow flexion', 'Weakness of forearm supination', 'Biceps weakness', 'Note: Not complete loss due to other muscle compensation'],
      extremity: 'major'
    },
    {
      percent: 20,
      summary: 'Complete paralysis (minor) OR Severe incomplete paralysis (major or minor)',
      criteria: ['Complete paralysis (minor extremity)', 'OR Severe incomplete paralysis (either)', 'Significant biceps weakness', 'Elbow flexion impaired', 'Supination weakness'],
      extremity: 'both'
    },
    {
      percent: 10,
      summary: 'Moderate incomplete paralysis (major or minor)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable biceps weakness', 'Some elbow flexion weakness', 'Sensory symptoms in lateral forearm'],
      extremity: 'both'
    },
    {
      percent: 0,
      summary: 'Mild incomplete paralysis (major or minor)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'No significant functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The musculocutaneous nerve innervates the biceps and brachialis muscles (elbow flexion) and provides sensation to the lateral forearm. Complete paralysis does not result in total loss of elbow flexion because other muscles (brachioradialis) can compensate.',
  definitions: {
    'musculocutaneous nerve': {
      term: 'Musculocutaneous Nerve',
      definition: 'Nerve arising from C5-C7 that innervates the biceps, brachialis, and coracobrachialis muscles and provides sensory innervation to the lateral forearm.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Musculocutaneous nerve ratings require neurological examination.',
};

// CIRCUMFLEX (AXILLARY) NERVE - DC 8518/8618/8718

export const CIRCUMFLEX_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8518', neuritis: '8618', neuralgia: '8718' },
  condition: 'Circumflex (Axillary) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 50,
      summary: 'Complete paralysis (major) - arm abduction impossible, outward rotation weakened',
      criteria: ['Complete paralysis of circumflex nerve', 'Abduction of arm is impossible', 'Outward rotation is weakened', 'Deltoid muscle paralyzed', 'Teres minor muscle paralyzed'],
      extremity: 'major'
    },
    {
      percent: 40,
      summary: 'Complete paralysis (minor) - arm abduction impossible, outward rotation weakened',
      criteria: ['Complete paralysis of circumflex nerve', 'Abduction of arm is impossible', 'Outward rotation is weakened', 'Deltoid and teres minor paralyzed'],
      extremity: 'minor'
    },
    {
      percent: 30,
      summary: 'Severe incomplete paralysis (major extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant deltoid weakness', 'Marked difficulty with arm abduction', 'Significant functional impairment'],
      extremity: 'major'
    },
    {
      percent: 20,
      summary: 'Severe incomplete paralysis (minor extremity)',
      criteria: ['Severe incomplete paralysis', 'Significant deltoid weakness', 'Marked difficulty with arm abduction'],
      extremity: 'minor'
    },
    {
      percent: 10,
      summary: 'Moderate incomplete paralysis (major or minor)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable shoulder weakness', 'Some abduction difficulty', 'Sensory loss over lateral shoulder'],
      extremity: 'both'
    },
    {
      percent: 0,
      summary: 'Mild incomplete paralysis (major or minor)',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'No significant functional impact'],
      extremity: 'both'
    },
  ],
  note: 'The circumflex (axillary) nerve innervates the deltoid and teres minor muscles. It is commonly injured with shoulder dislocations. The muscles supplied control arm abduction and external rotation.',
  definitions: {
    'circumflex nerve': {
      term: 'Circumflex (Axillary) Nerve',
      definition: 'Nerve arising from C5-C6 that innervates the deltoid and teres minor muscles and provides sensation to the lateral shoulder ("badge area").'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Circumflex nerve ratings require neurological examination.',
};

// LONG THORACIC NERVE - DC 8519/8619/8719

export const LONG_THORACIC_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8519', neuritis: '8619', neuralgia: '8719' },
  condition: 'Long Thoracic Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'upper',
  ratings: [
    {
      percent: 30,
      summary: 'Complete paralysis (major) - cannot raise arm above shoulder, winged scapula',
      criteria: ['Complete paralysis of long thoracic nerve', 'Inability to raise arm above shoulder level', 'Winged scapula deformity', 'Serratus anterior muscle paralyzed'],
      extremity: 'major'
    },
    {
      percent: 20,
      summary: 'Complete paralysis (minor) OR Severe incomplete paralysis (major or minor)',
      criteria: ['Complete paralysis (minor extremity)', 'OR Severe incomplete paralysis (either)', 'Significant scapular winging', 'Difficulty raising arm above shoulder', 'Serratus anterior weakness'],
      extremity: 'both'
    },
    {
      percent: 10,
      summary: 'Moderate incomplete paralysis (major or minor)',
      criteria: ['Moderate incomplete paralysis', 'Noticeable scapular winging with effort', 'Some difficulty with overhead activities', 'Moderate serratus weakness'],
      extremity: 'both'
    },
    {
      percent: 0,
      summary: 'Mild incomplete paralysis (major or minor)',
      criteria: ['Mild incomplete paralysis', 'Minimal scapular winging', 'Minor functional impact', 'Slight serratus weakness'],
      extremity: 'both'
    },
  ],
  note: 'The long thoracic nerve innervates the serratus anterior muscle which stabilizes the scapula. Paralysis results in "winged scapula" and inability to raise the arm above shoulder level. Note: Not to be combined with lost motion above shoulder level.',
  definitions: {
    'winged scapula': {
      term: 'Winged Scapula',
      definition: 'Prominence of the medial border of the scapula away from the chest wall due to serratus anterior weakness, most visible when pushing against a wall.'
    },
    'serratus anterior': {
      term: 'Serratus Anterior Muscle',
      definition: 'Muscle that anchors the scapula to the chest wall and rotates it upward during arm elevation. Essential for overhead arm movements.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Long thoracic nerve ratings require neurological examination.',
};


// ============================================
// LOWER EXTREMITY PERIPHERAL NERVE CRITERIA
// ============================================

// SCIATIC NERVE - DC 8520/8620/8720

export const SCIATIC_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8520', neuritis: '8620', neuralgia: '8720' },
  condition: 'Sciatic Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 80,
      summary: 'Complete paralysis - foot dangles and drops, no movement below knee, knee flexion weakened or lost',
      criteria: ['Complete paralysis of sciatic nerve', 'Foot dangles and drops', 'No active movement possible of muscles below the knee', 'Flexion of knee weakened or (very rarely) lost'],
    },
    {
      percent: 60,
      summary: 'Severe incomplete paralysis with marked muscular atrophy',
      criteria: ['Severe incomplete paralysis', 'Marked muscular atrophy', 'Significant weakness below knee', 'Significant functional impairment', 'Foot drop may be present'],
    },
    {
      percent: 40,
      summary: 'Moderately severe incomplete paralysis',
      criteria: ['Moderately severe incomplete paralysis', 'Moderate to significant weakness', 'Some muscular atrophy', 'Noticeable gait disturbance', 'Moderate functional limitations'],
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Noticeable weakness', 'Some sensory changes', 'Mild gait disturbance', 'Moderate functional impact'],
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Primarily sensory symptoms', 'Minimal weakness', 'Radiating pain', 'Minor functional impact'],
    },
  ],
  note: 'The sciatic nerve is the largest nerve in the body, controlling most leg and foot muscles. It divides into the tibial and common peroneal nerves. Complete paralysis results in foot drop and loss of all movement below the knee. Lower extremity nerves do not have major/minor distinction.',
  definitions: {
    'sciatic nerve': {
      term: 'Sciatic Nerve',
      definition: 'Largest nerve in the body arising from L4-S3, running from lower back through buttock and down the leg. Controls muscles of posterior thigh, entire leg below knee, and most foot muscles.'
    },
    'foot drop': {
      term: 'Foot Drop',
      definition: 'Inability to dorsiflex the foot, causing the foot to drag during walking. Results from weakness of anterior leg muscles.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Sciatic nerve ratings require neurological examination documenting motor and sensory deficits.',
};

// COMMON PERONEAL (EXTERNAL POPLITEAL) NERVE - DC 8521/8621/8721

export const COMMON_PERONEAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8521', neuritis: '8621', neuralgia: '8721' },
  condition: 'Common Peroneal (External Popliteal) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 40,
      summary: 'Complete paralysis - foot drop, cannot dorsiflex foot, toe extension lost',
      criteria: ['Complete paralysis of common peroneal nerve', 'Foot drop and slight droop of first phalanges of all toes', 'Cannot dorsiflex the foot', 'Extension (dorsal flexion) of proximal phalanges of toes lost', 'Abduction of foot lost', 'Adduction weakened', 'Anesthesia covers entire dorsum of foot and toes'],
    },
    {
      percent: 30,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant foot drop', 'Marked dorsiflexion weakness', 'Significant toe extension weakness', 'Steppage gait', 'Significant sensory loss'],
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Noticeable dorsiflexion weakness', 'Some foot drop tendency', 'Tripping or stumbling', 'Moderate sensory symptoms'],
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Numbness on dorsum of foot', 'Minor functional impact'],
    },
  ],
  note: 'The common peroneal nerve wraps around the fibular head and is vulnerable to compression. It controls foot dorsiflexion and eversion. Complete paralysis results in classic foot drop with steppage gait.',
  definitions: {
    'common peroneal nerve': {
      term: 'Common Peroneal Nerve',
      definition: 'Branch of sciatic nerve that wraps around the fibular head, controlling dorsiflexion and eversion of the foot. Most commonly injured lower extremity nerve.'
    },
    'steppage gait': {
      term: 'Steppage Gait',
      definition: 'High-stepping gait pattern used to compensate for foot drop, lifting the knee high to clear the dragging foot.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Common peroneal nerve ratings require neurological examination.',
};

// SUPERFICIAL PERONEAL NERVE - DC 8522/8622/8722

export const SUPERFICIAL_PERONEAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8522', neuritis: '8622', neuralgia: '8722' },
  condition: 'Superficial Peroneal (Musculocutaneous) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 30,
      summary: 'Complete paralysis - foot eversion weakened',
      criteria: ['Complete paralysis of superficial peroneal nerve', 'Eversion of foot weakened', 'Peroneus longus and brevis paralyzed', 'Ankle instability'],
    },
    {
      percent: 20,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant eversion weakness', 'Noticeable ankle instability', 'Significant sensory loss'],
    },
    {
      percent: 10,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Some eversion weakness', 'Moderate sensory symptoms', 'Numbness on lower leg and dorsum of foot'],
    },
    {
      percent: 0,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Minor functional impact'],
    },
  ],
  note: 'The superficial peroneal nerve controls foot eversion (peroneus longus and brevis) and provides sensation to the lower lateral leg and dorsum of foot (except first web space).',
  definitions: {
    'superficial peroneal nerve': {
      term: 'Superficial Peroneal Nerve',
      definition: 'Branch of common peroneal nerve that innervates the peroneus longus and brevis (foot eversion) and provides sensation to lower lateral leg and most of foot dorsum.'
    },
    'eversion': {
      term: 'Foot Eversion',
      definition: 'Turning the sole of the foot outward. Controlled by the peroneal muscles.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Superficial peroneal nerve ratings require neurological examination.',
};

// DEEP PERONEAL (ANTERIOR TIBIAL) NERVE - DC 8523/8623/8723

export const DEEP_PERONEAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8523', neuritis: '8623', neuralgia: '8723' },
  condition: 'Deep Peroneal (Anterior Tibial) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 30,
      summary: 'Complete paralysis - dorsal flexion of foot lost',
      criteria: ['Complete paralysis of deep peroneal nerve', 'Dorsal flexion of foot lost', 'Tibialis anterior paralyzed', 'Toe extensors paralyzed', 'Foot drop'],
    },
    {
      percent: 20,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant dorsiflexion weakness', 'Marked toe extension weakness', 'Foot drop tendency'],
    },
    {
      percent: 10,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Noticeable dorsiflexion weakness', 'Some toe extension weakness', 'Sensory loss in first web space'],
    },
    {
      percent: 0,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Numbness in first web space', 'Minor functional impact'],
    },
  ],
  note: 'The deep peroneal nerve controls foot dorsiflexion (tibialis anterior) and toe extension. It provides sensation only to the first web space between the great and second toes.',
  definitions: {
    'deep peroneal nerve': {
      term: 'Deep Peroneal Nerve',
      definition: 'Branch of common peroneal nerve that innervates the tibialis anterior (foot dorsiflexion) and toe extensors. Sensory only to first web space.'
    },
    'dorsiflexion': {
      term: 'Dorsiflexion',
      definition: 'Bending the foot upward toward the shin. Essential for clearing the foot during walking.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Deep peroneal nerve ratings require neurological examination.',
};

// TIBIAL (INTERNAL POPLITEAL) NERVE - DC 8524/8624/8724

export const TIBIAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8524', neuritis: '8624', neuralgia: '8724' },
  condition: 'Tibial (Internal Popliteal) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 40,
      summary: 'Complete paralysis - plantar flexion lost, toe flexion/separation abolished, cannot move sole muscles',
      criteria: ['Complete paralysis of tibial nerve', 'Plantar flexion lost', 'Frank adduction of foot impossible', 'Flexion and separation of toes abolished', 'No muscle in sole can move', 'In lesions high in popliteal fossa, plantar flexion of foot is lost'],
    },
    {
      percent: 30,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant plantar flexion weakness', 'Marked toe flexion weakness', 'Cannot walk on tiptoes', 'Significant sensory loss on sole'],
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Noticeable calf weakness', 'Some plantar flexion weakness', 'Difficulty with tiptoe walking', 'Moderate sensory symptoms'],
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Burning or numbness in sole', 'Minor functional impact'],
    },
  ],
  note: 'The tibial nerve controls plantar flexion (calf muscles), toe flexion, and foot inversion. It provides sensation to the sole of the foot. High lesions in the popliteal fossa affect all tibial nerve functions.',
  definitions: {
    'tibial nerve': {
      term: 'Tibial Nerve',
      definition: 'Branch of sciatic nerve that controls the calf muscles (plantar flexion), toe flexors, and provides sensation to the sole of the foot.'
    },
    'plantar flexion': {
      term: 'Plantar Flexion',
      definition: 'Pointing the foot downward, as when standing on tiptoes. Controlled by the gastrocnemius and soleus muscles.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Tibial nerve ratings require neurological examination.',
};

// POSTERIOR TIBIAL NERVE - DC 8525/8625/8725

export const POSTERIOR_TIBIAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8525', neuritis: '8625', neuralgia: '8725' },
  condition: 'Posterior Tibial Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 30,
      summary: 'Complete paralysis - sole paralysis, often with painful paralysis of causalgic nature',
      criteria: ['Complete paralysis of posterior tibial nerve', 'Paralysis of all muscles of sole of foot', 'Frequently with painful paralysis of a causalgic nature', 'Toes cannot be flexed', 'Adduction is weakened', 'Plantar flexion is impaired'],
    },
    {
      percent: 20,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant sole muscle weakness', 'Marked toe flexion weakness', 'Significant sensory loss', 'May have causalgic pain'],
    },
    {
      percent: 10,
      summary: 'Moderate OR Mild incomplete paralysis',
      criteria: ['Moderate or mild incomplete paralysis', 'Some intrinsic foot weakness', 'Sensory symptoms on sole', 'Tarsal tunnel syndrome symptoms', 'Burning or numbness'],
    },
  ],
  note: 'The posterior tibial nerve passes through the tarsal tunnel at the ankle. It controls the intrinsic muscles of the sole and provides sensation to the sole. Tarsal tunnel syndrome is compression at this level. Causalgic (burning) pain is common with this nerve injury.',
  definitions: {
    'posterior tibial nerve': {
      term: 'Posterior Tibial Nerve',
      definition: 'Terminal branch of the tibial nerve that passes behind the medial malleolus through the tarsal tunnel, innervating intrinsic foot muscles and sole sensation.'
    },
    'tarsal tunnel syndrome': {
      term: 'Tarsal Tunnel Syndrome',
      definition: 'Compression of the posterior tibial nerve at the ankle causing burning pain, numbness, and tingling on the sole of the foot.'
    },
    'causalgia': {
      term: 'Causalgia',
      definition: 'Severe burning pain due to nerve injury, often accompanied by skin changes. Now termed Complex Regional Pain Syndrome Type II.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Posterior tibial nerve ratings require neurological examination.',
};

// FEMORAL (ANTERIOR CRURAL) NERVE - DC 8526/8626/8726

export const FEMORAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8526', neuritis: '8626', neuralgia: '8726' },
  condition: 'Femoral (Anterior Crural) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 40,
      summary: 'Complete paralysis - quadriceps extensor muscles paralyzed',
      criteria: ['Complete paralysis of femoral nerve', 'Paralysis of quadriceps extensor muscles', 'Cannot extend knee', 'Knee buckling/giving way', 'Cannot climb stairs', 'Difficulty rising from seated position'],
    },
    {
      percent: 30,
      summary: 'Severe incomplete paralysis',
      criteria: ['Severe incomplete paralysis', 'Significant quadriceps weakness', 'Knee frequently gives way', 'Marked difficulty with stairs', 'Significant functional impairment'],
    },
    {
      percent: 20,
      summary: 'Moderate incomplete paralysis',
      criteria: ['Moderate incomplete paralysis', 'Noticeable quadriceps weakness', 'Some knee instability', 'Difficulty with stairs', 'Sensory loss on anterior thigh'],
    },
    {
      percent: 10,
      summary: 'Mild incomplete paralysis',
      criteria: ['Mild incomplete paralysis', 'Minimal weakness', 'Primarily sensory symptoms', 'Numbness on anterior thigh', 'Minor functional impact'],
    },
  ],
  note: 'The femoral nerve controls the quadriceps muscle (knee extension) and provides sensation to the anterior thigh and medial leg. Complete paralysis results in inability to extend the knee and frequent falls.',
  definitions: {
    'femoral nerve': {
      term: 'Femoral Nerve',
      definition: 'Major nerve of the anterior thigh arising from L2-L4, innervating the quadriceps (knee extension) and providing sensation to anterior thigh and medial leg via saphenous branch.'
    },
    'quadriceps': {
      term: 'Quadriceps Muscle',
      definition: 'Large four-headed muscle of the anterior thigh responsible for knee extension. Essential for walking, climbing stairs, and rising from sitting.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Femoral nerve ratings require neurological examination.',
};

// SAPHENOUS (INTERNAL SAPHENOUS) NERVE - DC 8527/8627/8727

export const SAPHENOUS_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8527', neuritis: '8627', neuralgia: '8727' },
  condition: 'Saphenous (Internal Saphenous) Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 10,
      summary: 'Severe to complete paralysis',
      criteria: ['Severe to complete involvement', 'Significant sensory loss along medial leg', 'Sensory loss from knee to medial ankle', 'No motor component (purely sensory nerve)'],
    },
    {
      percent: 0,
      summary: 'Mild to moderate involvement',
      criteria: ['Mild to moderate involvement', 'Some numbness along medial leg', 'Tingling or burning', 'Minor sensory symptoms'],
    },
  ],
  note: 'The saphenous nerve is a purely sensory branch of the femoral nerve. It has no motor function. It provides sensation to the medial leg from knee to ankle. Maximum rating is 10% even for complete involvement due to sensory-only function.',
  definitions: {
    'saphenous nerve': {
      term: 'Saphenous Nerve',
      definition: 'Purely sensory branch of the femoral nerve providing sensation to the medial leg from knee to ankle. Commonly injured during vein stripping or knee surgery.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Saphenous nerve ratings require sensory examination.',
};

// OBTURATOR NERVE - DC 8528/8628/8728

export const OBTURATOR_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8528', neuritis: '8628', neuralgia: '8728' },
  condition: 'Obturator Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 10,
      summary: 'Severe to complete paralysis',
      criteria: ['Severe to complete paralysis', 'Thigh adduction significantly weakened', 'Gait instability', 'Sensory loss on medial thigh'],
    },
    {
      percent: 0,
      summary: 'Mild to moderate involvement',
      criteria: ['Mild to moderate involvement', 'Some adduction weakness', 'Minor sensory symptoms', 'Minimal functional impact'],
    },
  ],
  note: 'The obturator nerve controls thigh adduction (bringing legs together) and provides sensation to the medial thigh. It is uncommonly injured in isolation. Maximum rating is 10% due to limited functional impact.',
  definitions: {
    'obturator nerve': {
      term: 'Obturator Nerve',
      definition: 'Nerve arising from L2-L4 that innervates the adductor muscles of the thigh and provides sensation to the medial thigh.'
    },
    'adduction': {
      term: 'Thigh Adduction',
      definition: 'Movement of the thigh toward the midline (bringing legs together). Controlled by the adductor muscles.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Obturator nerve ratings require neurological examination.',
};

// LATERAL FEMORAL CUTANEOUS NERVE (MERALGIA PARESTHETICA) - DC 8529/8629/8729

export const LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8529', neuritis: '8629', neuralgia: '8729' },
  condition: 'Lateral Femoral Cutaneous Nerve (Meralgia Paresthetica)',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 10,
      summary: 'Severe to complete involvement',
      criteria: ['Severe to complete involvement', 'Significant numbness on lateral thigh', 'Burning pain (meralgia paresthetica)', 'Hypersensitivity to touch', 'Pain worse with standing/walking'],
    },
    {
      percent: 0,
      summary: 'Mild to moderate involvement',
      criteria: ['Mild to moderate involvement', 'Some numbness or tingling', 'Intermittent symptoms', 'Minor functional impact'],
    },
  ],
  note: 'The lateral femoral cutaneous nerve is purely sensory, providing sensation to the lateral thigh. Meralgia paresthetica is compression of this nerve at the inguinal ligament, causing burning pain and numbness on the outer thigh. Maximum rating is 10% due to sensory-only function.',
  definitions: {
    'lateral femoral cutaneous nerve': {
      term: 'Lateral Femoral Cutaneous Nerve',
      definition: 'Purely sensory nerve arising from L2-L3 that provides sensation to the lateral (outer) thigh.'
    },
    'meralgia paresthetica': {
      term: 'Meralgia Paresthetica',
      definition: 'Condition caused by compression of the lateral femoral cutaneous nerve, typically at the inguinal ligament, causing burning pain, numbness, and tingling on the outer thigh.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Lateral femoral cutaneous nerve ratings require sensory examination.',
};

// ILIO-INGUINAL NERVE - DC 8530/8630/8730

export const ILIOINGUINAL_NERVE_CRITERIA = {
  diagnosticCodes: { paralysis: '8530', neuritis: '8630', neuralgia: '8730' },
  condition: 'Ilio-inguinal Nerve Paralysis',
  cfrReference: '38 CFR 4.124a',
  bodyLocation: 'lower',
  ratings: [
    {
      percent: 10,
      summary: 'Severe to complete involvement',
      criteria: ['Severe to complete involvement', 'Significant groin/genital numbness', 'Pain in inguinal region', 'Hypersensitivity', 'Pain with movement or coughing'],
    },
    {
      percent: 0,
      summary: 'Mild to moderate involvement',
      criteria: ['Mild to moderate involvement', 'Some groin numbness', 'Intermittent symptoms', 'Minor functional impact'],
    },
  ],
  note: 'The ilio-inguinal nerve provides sensation to the groin, upper medial thigh, and genital area. It is commonly injured during inguinal hernia repair or other lower abdominal surgeries. Maximum rating is 10% due to sensory-only function.',
  definitions: {
    'ilio-inguinal nerve': {
      term: 'Ilio-inguinal Nerve',
      definition: 'Sensory nerve arising from L1 that provides sensation to the groin, upper medial thigh, and parts of the external genitalia.'
    },
  },
  disclaimer: 'This analysis is for documentation purposes only. Ilio-inguinal nerve ratings require sensory examination.',
};

// ============================================
// LOSS OF SMELL RATING CRITERIA (DC 6275)
// ============================================

export const LOSS_OF_SMELL_CRITERIA = {
  diagnosticCode: '6275',
  condition: 'Loss of Sense of Smell (Anosmia)',
  cfrReference: '38 CFR 4.87a, Diagnostic Code 6275',

  ratingNote: 'A rating can only be given for the loss of the sense of smell if there is a definite, diagnosed physical or mental cause. Most medical conditions that cause loss of smell are temporary (common cold, hay fever). Permanent loss is rare and typically caused by nasal obstructions (tumors, polyps), diseases of the nasal lining, loss of the tongue, or damage to the brain or nerves (strokes, brain diseases, traumatic brain injuries).',

  ratings: [
    {
      percent: 10,
      summary: 'Complete loss of sense of smell',
      criteriaDescription: [
        'Complete loss of sense of smell (anosmia)',
        'Definite diagnosed physical or mental cause',
        'Permanent condition documented by medical professional',
      ],
      evidenceNeeded: [
        'Medical diagnosis confirming complete anosmia',
        'Documentation of underlying cause (TBI, COVID-19, nasal condition, etc.)',
        'Smell testing results (UPSIT, Sniffin\' Sticks, or similar)',
        'Treatment records showing condition is permanent or chronic',
        'Statement describing functional impact on daily life',
      ],
    },
    {
      percent: 0,
      summary: 'Partial loss or temporary condition',
      criteriaDescription: [
        'Partial loss of smell (hyposmia)',
        'Temporary condition expected to resolve',
        'No definite diagnosed cause',
      ],
      evidenceNeeded: [
        'Document any smell impairment even if partial',
        'Track changes over time',
        'Note any safety concerns (inability to smell gas, smoke, spoiled food)',
      ],
    },
  ],

  definitions: {
    'anosmia': {
      term: 'Anosmia',
      definition: 'Complete loss of the sense of smell. Can be caused by nasal obstruction, damage to olfactory nerves, or brain injury.',
    },
    'hyposmia': {
      term: 'Hyposmia',
      definition: 'Partial loss or reduced sense of smell. May be temporary or permanent depending on the cause.',
    },
    'parosmia': {
      term: 'Parosmia',
      definition: 'Distorted sense of smell where familiar odors smell different or unpleasant. Common after viral infections.',
    },
    'phantosmia': {
      term: 'Phantosmia',
      definition: 'Smelling odors that are not present (olfactory hallucinations). Can indicate neurological issues.',
    },
    'upsit': {
      term: 'UPSIT',
      definition: 'University of Pennsylvania Smell Identification Test - a standardized 40-item scratch-and-sniff test used to diagnose and quantify smell disorders.',
    },
  },

  secondaryConditions: {
    description: 'Loss of smell is often secondary to other service-connected conditions. Document the primary condition relationship.',
    commonPrimaries: [
      { condition: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', relationship: 'Direct damage to olfactory nerves or brain regions' },
      { condition: 'Chronic Sinusitis', diagnosticCode: '6510-6514', relationship: 'Nasal inflammation blocking olfactory receptors' },
      { condition: 'Deviated Septum', diagnosticCode: '6502', relationship: 'Structural obstruction affecting airflow to olfactory area' },
      { condition: 'COVID-19 (Long Haul)', diagnosticCode: '6354', relationship: 'Post-viral olfactory dysfunction' },
      { condition: 'Parkinson\'s Disease', diagnosticCode: '8004', relationship: 'Early neurological symptom of PD' },
    ],
  },

  documentationTips: [
    'Request formal smell testing (UPSIT or equivalent) from ENT or neurologist',
    'Document specific examples of smell-related safety concerns (gas leaks, smoke, spoiled food)',
    'Keep a log noting any fluctuations or changes in smell ability',
    'Obtain buddy/lay statements describing observed functional limitations',
    'If post-COVID, document timeline from infection to persistent symptoms',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.87a, DC 6275. Loss of smell ratings require documented diagnosis of complete anosmia with definite physical or mental cause. For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// LOSS OF TASTE RATING CRITERIA (DC 6276)
// ============================================

export const LOSS_OF_TASTE_CRITERIA = {
  diagnosticCode: '6276',
  condition: 'Loss of Sense of Taste (Ageusia)',
  cfrReference: '38 CFR 4.87a, Diagnostic Code 6276',

  ratingNote: 'A rating can only be given for the loss of the sense of taste if there is a definite, diagnosed physical or mental cause. Taste and smell are closely related - both the tongue and salivary glands participate in tasting, but the salivary glands are stimulated by the sense of smell. Without smell, the sense of taste is diminished. Mental disorders may cause changes in perception rather than complete loss.',

  ratings: [
    {
      percent: 10,
      summary: 'Complete loss of sense of taste',
      criteriaDescription: [
        'Complete loss of sense of taste (ageusia)',
        'Definite diagnosed physical or mental cause',
        'Permanent condition documented by medical professional',
      ],
      evidenceNeeded: [
        'Medical diagnosis confirming complete ageusia',
        'Documentation of underlying cause',
        'Taste testing results (electrogustometry or chemical taste testing)',
        'Treatment records showing condition is permanent or chronic',
        'Statement describing functional impact on daily life and nutrition',
      ],
    },
    {
      percent: 0,
      summary: 'Partial loss or temporary condition',
      criteriaDescription: [
        'Partial loss of taste (hypogeusia)',
        'Temporary condition expected to resolve',
        'No definite diagnosed cause',
      ],
      evidenceNeeded: [
        'Document any taste impairment even if partial',
        'Track changes over time',
        'Note any nutritional or appetite impacts',
      ],
    },
  ],

  definitions: {
    'ageusia': {
      term: 'Ageusia',
      definition: 'Complete loss of the sense of taste. Can be caused by nerve damage, medication side effects, or neurological conditions.',
    },
    'hypogeusia': {
      term: 'Hypogeusia',
      definition: 'Partial loss or reduced sense of taste. May affect one or more of the five basic tastes.',
    },
    'dysgeusia': {
      term: 'Dysgeusia',
      definition: 'Distorted sense of taste where foods taste different than expected. Common side effect of certain medications and chemotherapy.',
    },
    'basic tastes': {
      term: 'Basic Tastes',
      definition: 'The five primary taste sensations: sweet, salty, sour, bitter, and umami (savory). Complete ageusia affects all five.',
    },
    'gustatory nerve': {
      term: 'Gustatory Nerves',
      definition: 'The facial nerve (CN VII), glossopharyngeal nerve (CN IX), and vagus nerve (CN X) carry taste information from the tongue to the brain.',
    },
  },

  secondaryConditions: {
    description: 'Loss of taste is often secondary to other conditions or medications. The relationship to smell loss is particularly important.',
    commonPrimaries: [
      { condition: 'Loss of Smell (Anosmia)', diagnosticCode: '6275', relationship: 'Smell contributes significantly to flavor perception' },
      { condition: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', relationship: 'Damage to gustatory pathways or processing areas' },
      { condition: 'Bell\'s Palsy / Facial Nerve', diagnosticCode: '8207', relationship: 'Facial nerve carries taste from anterior tongue' },
      { condition: 'COVID-19 (Long Haul)', diagnosticCode: '6354', relationship: 'Post-viral gustatory dysfunction' },
      { condition: 'Diabetes Mellitus', diagnosticCode: '7913', relationship: 'Neuropathy affecting gustatory nerves' },
    ],
  },

  importantNote: 'Most medical conditions causing permanent loss of taste or smell would also cause other disabilities. These should be rated separately. The 10% rating for taste or smell loss can be combined with ratings for the underlying condition.',

  documentationTips: [
    'Request formal taste testing from ENT or neurologist',
    'Document which specific tastes are affected (sweet, salty, sour, bitter, umami)',
    'Note any weight changes or nutritional impacts due to appetite loss',
    'If also experiencing smell loss, document both conditions separately',
    'Keep food diary noting inability to taste specific foods',
    'Obtain buddy/lay statements describing observed eating habit changes',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.87a, DC 6276. Loss of taste ratings require documented diagnosis of complete ageusia with definite physical or mental cause. For documentation purposes only - the VA makes all final rating determinations.',
};


export const analyzeMigraineLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
    includeWorkImpact = false,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && getLogSymptomId(log) === 'migraine';
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
          1)} prostrating attacks per month (>=4 required)`,
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
          1)} prostrating attacks per month (>=1 required)`,
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
        'Frequency below threshold for 10% (need >=0.5/month)',
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
 * @param {Object} options - Analysis options
 */

export const analyzeTBILogs = (logs, options = {}) => {
  const conditionCriteria = TBI_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = NEUROLOGICAL_CONDITIONS.TBI.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
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
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => getLogSymptomId(log)))].length;

  const hasMemoryIssues = relevantLogs.some(log => getLogSymptomId(log) === 'tbi-memory');
  const hasConcentrationIssues = relevantLogs.some(log => getLogSymptomId(log) === 'tbi-concentration');
  const hasConfusion = relevantLogs.some(log => getLogSymptomId(log) === 'tbi-confusion');
  const hasMoodChanges = relevantLogs.some(log => getLogSymptomId(log) === 'tbi-mood');

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

export const analyzeRadiculopathyLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const radiculopathySymptoms = logs.filter(log =>
      NEUROLOGICAL_CONDITIONS.RADICULOPATHY.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = radiculopathySymptoms.filter(s => getLogSymptomId(s) === 'radiculopathy-pain').length;
  const numbnessCount = radiculopathySymptoms.filter(s => getLogSymptomId(s) === 'radiculopathy-numbness').length;
  const tinglingCount = radiculopathySymptoms.filter(s => getLogSymptomId(s) === 'radiculopathy-tingling').length;
  const weaknessCount = radiculopathySymptoms.filter(s => getLogSymptomId(s) === 'radiculopathy-weakness').length;
  const burningCount = radiculopathySymptoms.filter(s => getLogSymptomId(s) === 'radiculopathy-burning').length;

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
      NEUROLOGICAL_CONDITIONS.CHRONIC_FATIGUE.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const fatigueCount = cfsSymptoms.filter(s => getLogSymptomId(s) === 'cfs-fatigue').length;
  const cognitiveCount = cfsSymptoms.filter(s => getLogSymptomId(s) === 'cfs-cognitive').length;
  const sleepCount = cfsSymptoms.filter(s => getLogSymptomId(s) === 'cfs-sleep').length;
  const painCount = cfsSymptoms.filter(s => getLogSymptomId(s) === 'cfs-pain').length;
  const headacheCount = cfsSymptoms.filter(s => getLogSymptomId(s) === 'cfs-headache').length;

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
      NEUROLOGICAL_CONDITIONS.PERIPHERAL_NEUROPATHY.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const numbnessCount = pnSymptoms.filter(s => getLogSymptomId(s) === 'pn-numbness').length;
  const tinglingCount = pnSymptoms.filter(s => getLogSymptomId(s) === 'pn-tingling').length;
  const burningCount = pnSymptoms.filter(s => getLogSymptomId(s) === 'pn-burning').length;
  const painCount = pnSymptoms.filter(s => getLogSymptomId(s) === 'pn-pain').length;
  const weaknessCount = pnSymptoms.filter(s => getLogSymptomId(s) === 'pn-weakness').length;

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

export const analyzeInsomniaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const insomniaSymptoms = logs.filter(log =>
      NEUROLOGICAL_CONDITIONS.INSOMNIA.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const difficultyFallingCount = insomniaSymptoms.filter(s => getLogSymptomId(s) === 'insomnia-difficulty-falling-asleep').length;
  const difficultyStayingCount = insomniaSymptoms.filter(s => getLogSymptomId(s) === 'insomnia-difficulty-staying-asleep').length;
  const earlyWakingCount = insomniaSymptoms.filter(s => getLogSymptomId(s) === 'insomnia-early-waking').length;
  const fatigueCount = insomniaSymptoms.filter(s => getLogSymptomId(s) === 'insomnia-fatigue').length;
  const irritabilityCount = insomniaSymptoms.filter(s => getLogSymptomId(s) === 'insomnia-irritability').length;

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
      getLogSymptomId(log) === 'tbi-cognitive'
  ).length;

  const emotionalCount = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'tbi-emotional'
  ).length;

  // Frequency analysis
  const monthsInPeriod = evaluationPeriodDays / 30;
  const symptomsPerMonth = relevantLogs.length / monthsInPeriod;

  let supportedRating = 0;
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

export function analyzeEpilepsyMajorLogs(logs, evaluationDays = 90) {
  // Filter for major seizure symptoms
  const seizureSymptomIds = [
    'seizure-major',
    'seizure-partial',  // Can be rated as major if with LOC
    'seizure-psychomotor', // Can be rated as major if with convulsion/LOC
  ];

  const seizureLogs = logs.filter(log =>
      seizureSymptomIds.includes(log.symptomId)
  );

  if (seizureLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Epilepsy, Grand Mal (Major Seizures)',
      diagnosticCode: '8910',
    };
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Count seizures in different time periods
  const last30Days = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 30;
  }).length;

  const last3Months = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 90;
  }).length;

  const last6Months = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 180;
  }).length;

  const lastYear = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 365;
  }).length;

  const last2Years = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 730;
  }).length;

  // Calculate average per month over last year
  const averagePerMonth = lastYear > 0 ? lastYear / 12 : 0;

  // Determine rating based on VA criteria
  let supportedRating = 0;
  let ratingRationale = [];

  if (averagePerMonth >= 1) {
    supportedRating = '100%';
    ratingRationale.push(`Averaging ${lastYear} major seizures over last year (${averagePerMonth.toFixed(1)} per month)`);
    ratingRationale.push('Meets 100% criteria: >=1 major seizure per month average');
  } else if (lastYear >= 4) {
    supportedRating = '80%';
    ratingRationale.push(`${lastYear} major seizures in last year (average 1 per 3 months)`);
    ratingRationale.push('Meets 80% criteria: >=1 major seizure per 3 months');
  } else if (lastYear >= 3) {
    supportedRating = '60%';
    ratingRationale.push(`${lastYear} major seizures in last year (average 1 per 4 months)`);
    ratingRationale.push('Meets 60% criteria: >=1 major seizure per 4 months');
  } else if (last6Months >= 1 || lastYear >= 2) {
    supportedRating = '40%';
    if (last6Months >= 1) {
      ratingRationale.push(`${last6Months} major seizure(s) in last 6 months`);
    }
    if (lastYear >= 2) {
      ratingRationale.push(`${lastYear} major seizures in last year`);
    }
    ratingRationale.push('Meets 40% criteria: >=1 seizure in last 6 months OR >=2 in last year');
  } else if (last2Years >= 1) {
    supportedRating = '20%';
    ratingRationale.push(`${last2Years} major seizure(s) in last 2 years`);
    ratingRationale.push('Meets 20% criteria: >=1 major seizure in last 2 years');
  } else {
    supportedRating = '10%';
    ratingRationale.push('Documented seizure history with symptom logs');
    ratingRationale.push('If on continuous medication, qualifies for minimum 10% rating');
  }

  // Build evidence list
  const evidence = [];
  evidence.push(`${seizureLogs.length} major seizure episodes logged`);
  if (lastYear > 0) {
    evidence.push(`${lastYear} seizures in last 12 months`);
  }
  if (last6Months > 0) {
    evidence.push(`${last6Months} seizures in last 6 months`);
  }

  // Count witnessed seizures
  const witnessedCount = seizureLogs.filter(log =>
      log.seizureData?.witnessPresent === true
  ).length;
  if (witnessedCount > 0) {
    evidence.push(`${witnessedCount} seizure(s) with witness present`);
  }

  // Count seizures with LOC
  const locCount = seizureLogs.filter(log =>
      log.seizureData?.lossOfConsciousness === 'yes'
  ).length;
  if (locCount > 0) {
    evidence.push(`${locCount} seizure(s) with loss of consciousness`);
  }

  // Build gaps list
  const gaps = [];
  if (witnessedCount === 0) {
    gaps.push('Log witness statements for documented seizures');
  }
  if (seizureLogs.length < 3) {
    gaps.push('Continue logging seizures to establish frequency pattern');
  }
  gaps.push('Obtain physician verification of epilepsy diagnosis');
  gaps.push('Document current anti-epileptic medications if prescribed');
  gaps.push('Request EEG results if available');

  return {
    hasData: true,
    condition: 'Epilepsy, Grand Mal (Major Seizures)',
    diagnosticCode: '8910',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: EPILEPSY_MAJOR_CRITERIA,
    disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations based on medical evidence and C&P examinations.',
    seizureType: 'major',
    frequencyAnalysis: {
      last30Days,
      last6Months,
      lastYear,
      last2Years,
      averagePerMonth,
    },
  };
}

/**
 * Analyze epilepsy - minor seizures (DC 8911)
 * Counts minor seizure frequency
 */

export function analyzeEpilepsyMinorLogs(logs, evaluationDays = 90) {
  const seizureSymptomIds = ['seizure-minor'];

  const seizureLogs = logs.filter(log =>
      seizureSymptomIds.includes(log.symptomId)
  );

  if (seizureLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Epilepsy, Petit Mal (Minor Seizures)',
      diagnosticCode: '8911',
    };
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Count seizures in different time periods
  const last7Days = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 7;
  }).length;

  const last30Days = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 30;
  }).length;

  const last6Months = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 180;
  }).length;

  const lastYear = seizureLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now - logDate) / msPerDay;
    return daysDiff <= 365;
  }).length;

  // Calculate weekly average
  const weeksTracked = 4; // Last 30 days
  const averagePerWeek = last7Days > 0 ? last7Days : (last30Days / weeksTracked);

  // Determine rating based on weekly frequency
  let supportedRating = 0;
  let ratingRationale = [];

  if (averagePerWeek > 10) {
    supportedRating = '80%';
    ratingRationale.push(`Averaging ${averagePerWeek.toFixed(1)} minor seizures per week`);
    ratingRationale.push('Meets 80% criteria: >10 minor seizures weekly');
  } else if (averagePerWeek >= 9) {
    supportedRating = '60%';
    ratingRationale.push(`Averaging ${averagePerWeek.toFixed(1)} minor seizures per week`);
    ratingRationale.push('Meets 60% criteria: 9-10 minor seizures per week');
  } else if (averagePerWeek >= 5) {
    supportedRating = '40%';
    ratingRationale.push(`Averaging ${averagePerWeek.toFixed(1)} minor seizures per week`);
    ratingRationale.push('Meets 40% criteria: 5-8 minor seizures weekly');
  } else if (last6Months >= 2) {
    supportedRating = '20%';
    ratingRationale.push(`${last6Months} minor seizures in last 6 months`);
    ratingRationale.push('Meets 20% criteria: >=2 minor seizures in last 6 months');
  } else {
    supportedRating = '10%';
    ratingRationale.push('Documented minor seizure history');
    ratingRationale.push('If on continuous medication, qualifies for minimum 10% rating');
  }

  // Build evidence list
  const evidence = [];
  evidence.push(`${seizureLogs.length} minor seizure episodes logged`);
  if (last7Days > 0) {
    evidence.push(`${last7Days} seizures in last 7 days (${averagePerWeek.toFixed(1)} per week)`);
  }
  if (last30Days > 0) {
    evidence.push(`${last30Days} seizures in last 30 days`);
  }

  const gaps = [];
  if (seizureLogs.length < 5) {
    gaps.push('Continue logging to establish weekly frequency pattern');
  }
  gaps.push('Obtain physician diagnosis of petit mal epilepsy');
  gaps.push('Request EEG showing absence seizure pattern');
  gaps.push('Document anti-epileptic medications');

  return {
    hasData: true,
    condition: 'Epilepsy, Petit Mal (Minor Seizures)',
    diagnosticCode: '8911',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: EPILEPSY_MINOR_CRITERIA,
    disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations based on medical evidence and C&P examinations.',
    seizureType: 'minor',
    frequencyAnalysis: {
      last7Days,
      last30Days,
      last6Months,
      lastYear,
      averagePerWeek,
    },
  };
}

// ============================================
// PHASE 1D: EPILEPSY EXPANSION ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze Jacksonian/Focal Epilepsy (DC 8912)
 * Rates as minor seizures unless major (secondary generalization) predominates
 */

export function analyzeJacksonianEpilepsyLogs(logs, options = {}) {
  const { days = 365 } = options;

  // Jacksonian-specific symptom IDs
  const jacksonianSymptomIds = [
    'jack-focal-motor', 'jack-focal-sensory', 'jack-march',
    'jack-unilateral-jerking', 'jack-tingling-numbness', 'jack-visual-disturbance',
    'jack-secondary-generalization', 'jack-preserved-awareness', 'jack-impaired-awareness',
    'seizure-partial', // Also include generic partial seizure
  ];

  const jacksonianLogs = logs.filter(log =>
      jacksonianSymptomIds.includes(log.symptomId) ||
      log.symptomId?.startsWith('jack-')
  );

  if (jacksonianLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Epilepsy, Jacksonian/Focal',
      diagnosticCodes: '8912',
    };
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Count seizures with secondary generalization (these count as major)
  const majorSeizures = jacksonianLogs.filter(log =>
      log.symptomId === 'jack-secondary-generalization' ||
      log.seizureData?.lossOfConsciousness === 'yes' ||
      log.seizureData?.episodeType === 'generalized'
  );

  // Minor seizures (focal without generalization)
  const minorSeizures = jacksonianLogs.filter(log =>
      !majorSeizures.includes(log)
  );

  // Time-based analysis
  const lastYear = jacksonianLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 365;
  });

  const last6Months = jacksonianLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 180;
  });

  const last2Years = jacksonianLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 730;
  });

  // Calculate weekly frequency for minor seizures (last 4 weeks)
  const last4Weeks = minorSeizures.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 28;
  });
  const weeklyMinorAverage = last4Weeks.length / 4;

  // Determine if major or minor predominates
  const majorPredominates = majorSeizures.length > minorSeizures.length;

  // Calculate rating based on VA criteria
  let supportedRating = 0;
  let ratingRationale = [];

  if (majorPredominates) {
    // Rate as major seizures
    const majorInYear = majorSeizures.filter(log => {
      const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
      return daysDiff <= 365;
    }).length;
    const avgPerMonth = majorInYear / 12;

    if (avgPerMonth >= 1) {
      supportedRating = 100;
      ratingRationale.push(`Major seizures predominate with ${majorInYear} in last year (${avgPerMonth.toFixed(1)}/month)`);
    } else if (majorInYear >= 4) {
      supportedRating = 80;
      ratingRationale.push(`Major seizures predominate: ${majorInYear} in last year (avg 1 per 3 months)`);
    } else if (majorInYear >= 3) {
      supportedRating = 60;
      ratingRationale.push(`Major seizures predominate: ${majorInYear} in last year (avg 1 per 4 months)`);
    } else if (last6Months.filter(l => majorSeizures.includes(l)).length >= 1 || majorInYear >= 2) {
      supportedRating = 40;
      ratingRationale.push('Major seizures predominate: meets 40% criteria');
    } else {
      supportedRating = 20;
      ratingRationale.push('Major seizures predominate with documented history');
    }
  } else {
    // Rate as minor seizures
    if (weeklyMinorAverage > 10) {
      supportedRating = 80;
      ratingRationale.push(`More than 10 focal seizures weekly (avg ${weeklyMinorAverage.toFixed(1)}/week)`);
    } else if (weeklyMinorAverage >= 9) {
      supportedRating = 60;
      ratingRationale.push(`9-10 focal seizures per week (avg ${weeklyMinorAverage.toFixed(1)}/week)`);
    } else if (weeklyMinorAverage >= 5) {
      supportedRating = 40;
      ratingRationale.push(`5-8 focal seizures per week (avg ${weeklyMinorAverage.toFixed(1)}/week)`);
    } else if (last6Months.length >= 2) {
      supportedRating = 20;
      ratingRationale.push(`${last6Months.length} focal seizures in last 6 months`);
    } else {
      supportedRating = 10;
      ratingRationale.push('Confirmed diagnosis with documented focal seizure history');
    }
  }

  // Evidence gaps
  const gaps = [];
  if (majorSeizures.length === 0 && minorSeizures.length > 0) {
    gaps.push('Document if any focal seizures secondarily generalize to tonic-clonic');
  }
  gaps.push('Obtain EEG showing focal epileptiform activity if available');
  gaps.push('Document anti-epileptic medication regimen');
  gaps.push('Record specific body areas affected during focal seizures');

  return {
    hasData: true,
    condition: 'Epilepsy, Jacksonian/Focal',
    diagnosticCodes: '8912',
    cfrReference: '38 CFR 4.124a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: jacksonianLogs.length,
      majorSeizures: majorSeizures.length,
      minorSeizures: minorSeizures.length,
      majorPredominates,
      weeklyMinorAverage,
      lastYearCount: lastYear.length,
    },
    criteria: EPILEPSY_JACKSONIAN_CRITERIA,
  };
}

/**
 * Analyze Diencephalic Epilepsy (DC 8913)
 * Rates as minor seizures (autonomic symptoms)
 */

export function analyzeDiencephalicEpilepsyLogs(logs, options = {}) {
  const { days = 365 } = options;

  const diencephalicSymptomIds = [
    'dien-autonomic-seizure', 'dien-flushing', 'dien-sweating',
    'dien-blood-pressure', 'dien-heart-rate', 'dien-pupil-changes',
    'dien-temperature', 'dien-lacrimation', 'dien-gi-symptoms', 'dien-hypothalamic',
  ];

  const diencephalicLogs = logs.filter(log =>
      diencephalicSymptomIds.includes(log.symptomId) ||
      log.symptomId?.startsWith('dien-')
  );

  if (diencephalicLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Epilepsy, Diencephalic',
      diagnosticCodes: '8913',
    };
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Time-based analysis
  const last6Months = diencephalicLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 180;
  });

  // Calculate weekly frequency (last 4 weeks)
  const last4Weeks = diencephalicLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 28;
  });
  const weeklyAverage = last4Weeks.length / 4;

  // Rate as minor seizures per 38 CFR
  let supportedRating = 0;
  let ratingRationale = [];

  if (weeklyAverage > 10) {
    supportedRating = 80;
    ratingRationale.push(`More than 10 autonomic seizures weekly (avg ${weeklyAverage.toFixed(1)}/week)`);
  } else if (weeklyAverage >= 9) {
    supportedRating = 60;
    ratingRationale.push(`9-10 autonomic seizures per week (avg ${weeklyAverage.toFixed(1)}/week)`);
  } else if (weeklyAverage >= 5) {
    supportedRating = 40;
    ratingRationale.push(`5-8 autonomic seizures per week (avg ${weeklyAverage.toFixed(1)}/week)`);
  } else if (last6Months.length >= 2) {
    supportedRating = 20;
    ratingRationale.push(`${last6Months.length} autonomic seizures in last 6 months`);
  } else {
    supportedRating = 10;
    ratingRationale.push('Confirmed diagnosis with documented autonomic seizure history');
  }

  ratingRationale.push('Diencephalic epilepsy rates as minor seizures per 38 CFR 4.124a');

  // Common autonomic symptoms logged
  const symptomCounts = {};
  diencephalicLogs.forEach(log => {
    const symptom = log.symptomId;
    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
  });

  const gaps = [];
  gaps.push('Document autonomic symptoms during each episode');
  gaps.push('Obtain neurologist evaluation confirming diencephalic origin');
  gaps.push('Record episode duration and recovery time');
  gaps.push('Document anti-epileptic medication effectiveness');

  return {
    hasData: true,
    condition: 'Epilepsy, Diencephalic',
    diagnosticCodes: '8913',
    cfrReference: '38 CFR 4.124a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: diencephalicLogs.length,
      weeklyAverage,
      last6MonthsCount: last6Months.length,
      symptomCounts,
    },
    criteria: EPILEPSY_DIENCEPHALIC_CRITERIA,
  };
}

/**
 * Analyze Psychomotor Epilepsy (DC 8914)
 * Can be major OR minor depending on episode characteristics
 */

export function analyzePsychomotorEpilepsyLogs(logs, options = {}) {
  const { days = 365 } = options;

  // Major psychomotor symptoms (automatic states, convulsions with LOC)
  const majorPsychomotorIds = [
    'psych-automatic-state', 'psych-convulsion-loc', 'psych-prolonged-confusion',
    'psych-wandering', 'psych-complex-behavior',
    'seizure-psychomotor', // Existing generic - check seizureData for type
  ];

  // Minor psychomotor symptoms (brief transient episodes)
  const minorPsychomotorIds = [
    'psych-random-motor', 'psych-hallucination', 'psych-perceptual-illusion',
    'psych-deja-vu', 'psych-thinking-abnormality', 'psych-memory-disturbance',
    'psych-mood-change', 'psych-autonomic', 'psych-lip-smacking', 'psych-hand-movements',
  ];

  const allPsychomotorIds = [...majorPsychomotorIds, ...minorPsychomotorIds];

  const psychomotorLogs = logs.filter(log =>
      allPsychomotorIds.includes(log.symptomId) ||
      log.symptomId?.startsWith('psych-')
  );

  if (psychomotorLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Epilepsy, Psychomotor',
      diagnosticCodes: '8914',
    };
  }

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Classify each log as major or minor
  const majorSeizures = psychomotorLogs.filter(log => {
    // Check if symptom ID indicates major type
    if (majorPsychomotorIds.includes(log.symptomId)) {
      // If it's the generic 'seizure-psychomotor', check seizureData
      if (log.symptomId === 'seizure-psychomotor') {
        return log.seizureData?.lossOfConsciousness === 'yes' ||
            log.seizureData?.episodeType === 'automatic-state' ||
            log.seizureData?.episodeType === 'convulsion';
      }
      return true;
    }
    // Also check seizureData for LOC
    return log.seizureData?.lossOfConsciousness === 'yes';
  });

  const minorSeizures = psychomotorLogs.filter(log => !majorSeizures.includes(log));

  // Time-based analysis
  const lastYear = psychomotorLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 365;
  });

  const last6Months = psychomotorLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 180;
  });

  const last2Years = psychomotorLogs.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 730;
  });

  // Weekly frequency for minor seizures
  const last4Weeks = minorSeizures.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 28;
  });
  const weeklyMinorAverage = last4Weeks.length / 4;

  // Major seizure analysis
  const majorInYear = majorSeizures.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 365;
  });
  const majorIn6Months = majorSeizures.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 180;
  });
  const majorIn2Years = majorSeizures.filter(log => {
    const daysDiff = (now - new Date(log.timestamp)) / msPerDay;
    return daysDiff <= 730;
  });

  // Determine rating
  let supportedRating = 0;
  let ratingRationale = [];
  let seizureClassification = 'minor';

  // Check major seizure criteria first
  const avgMajorPerMonth = majorInYear.length / 12;

  if (avgMajorPerMonth >= 1) {
    supportedRating = 100;
    seizureClassification = 'major';
    ratingRationale.push(`Major psychomotor seizures: ${majorInYear.length} in last year (${avgMajorPerMonth.toFixed(1)}/month)`);
    ratingRationale.push('Episodes with automatic states/convulsions with LOC');
  } else if (majorInYear.length >= 4) {
    supportedRating = 80;
    seizureClassification = 'major';
    ratingRationale.push(`Major psychomotor seizures: ${majorInYear.length} in last year (avg 1 per 3 months)`);
  } else if (majorInYear.length >= 3) {
    supportedRating = 60;
    seizureClassification = 'major';
    ratingRationale.push(`Major psychomotor seizures: ${majorInYear.length} in last year (avg 1 per 4 months)`);
  } else if (majorIn6Months.length >= 1 || majorInYear.length >= 2) {
    supportedRating = 40;
    seizureClassification = 'major';
    ratingRationale.push(`Major psychomotor seizures: ${majorIn6Months.length} in 6 months, ${majorInYear.length} in year`);
  } else if (majorIn2Years.length >= 1) {
    // 20% for major, but check if minor gives higher
    if (weeklyMinorAverage > 10) {
      supportedRating = 80;
      seizureClassification = 'minor';
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (>10)`);
    } else if (weeklyMinorAverage >= 9) {
      supportedRating = 60;
      seizureClassification = 'minor';
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (9-10)`);
    } else if (weeklyMinorAverage >= 5) {
      supportedRating = 40;
      seizureClassification = 'minor';
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (5-8)`);
    } else {
      supportedRating = 20;
      seizureClassification = 'major';
      ratingRationale.push(`Major psychomotor seizure within last 2 years`);
    }
  } else {
    // No major seizures in 2 years, rate on minor
    if (weeklyMinorAverage > 10) {
      supportedRating = 80;
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (>10)`);
    } else if (weeklyMinorAverage >= 9) {
      supportedRating = 60;
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (9-10)`);
    } else if (weeklyMinorAverage >= 5) {
      supportedRating = 40;
      ratingRationale.push(`Minor psychomotor seizures: ${weeklyMinorAverage.toFixed(1)}/week (5-8)`);
    } else if (last6Months.length >= 2) {
      supportedRating = 20;
      ratingRationale.push(`${last6Months.length} psychomotor episodes in last 6 months`);
    } else {
      supportedRating = 10;
      ratingRationale.push('Confirmed diagnosis with documented psychomotor seizure history');
    }
  }

  const gaps = [];
  gaps.push('Document specific characteristics of each episode (automatic state vs brief transient)');
  gaps.push('Record loss of consciousness status for each seizure');
  gaps.push('Note presence of hallucinations, perceptual illusions, or automatisms');
  gaps.push('Obtain neurologist confirmation of temporal lobe epilepsy');
  gaps.push('Document anti-epileptic medication regimen and effectiveness');

  return {
    hasData: true,
    condition: 'Epilepsy, Psychomotor',
    diagnosticCodes: '8914',
    cfrReference: '38 CFR 4.124a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: psychomotorLogs.length,
      majorSeizures: majorSeizures.length,
      minorSeizures: minorSeizures.length,
      seizureClassification,
      weeklyMinorAverage,
      majorInYear: majorInYear.length,
      avgMajorPerMonth,
    },
    criteria: EPILEPSY_PSYCHOMOTOR_CRITERIA,
  };
}

// ============================================
// PHASE 2: VISION LOSS ANALYSIS FUNCTION
// ============================================

export const analyzeTinnitusLogs = (logs, options = {}) => {
  const conditionCriteria = TINNITUS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = NEUROLOGICAL_CONDITIONS.TINNITUS.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
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

  let supportedRating = 0;
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
  const symptomIds = NEUROLOGICAL_CONDITIONS.FIBROMYALGIA.symptomIds;

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
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
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => getLogSymptomId(log)))].length;
  const daysLogged = [...new Set(relevantLogs.map(log => new Date(log.timestamp).toDateString()))].length;

  const hasWidespreadPain = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-widespread-pain');
  const hasTenderPoints = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-tender-points');
  const hasFatigue = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-fatigue');
  const hasSleepIssues = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-sleep');
  const hasStiffness = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-stiffness');
  const hasCognitive = relevantLogs.some(log => getLogSymptomId(log) === 'fibro-cognitive');

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

  let supportedRating = 0;
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

/**
 * Analyze Tooth Loss logs for VA rating
 * DC 9913 - Loss of Teeth Due to Bone Loss
 */

export const analyzeMultipleSclerosisLogs = (logs, options = {}) => {
  const conditionCriteria = MULTIPLE_SCLEROSIS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = NEUROLOGICAL_CONDITIONS.MULTIPLE_SCLEROSIS.symptomIds;

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
      message: 'No multiple sclerosis symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms by type for evidence building
  const fatigueLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-fatigue');
  const numbnessLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-numbness-tingling');
  const visionLogs = relevantLogs.filter(log =>
      ['ms-vision-problems', 'ms-double-vision'].includes(getLogSymptomId(log))
  );
  const weaknessLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-muscle-weakness');
  const spasticityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-spasticity');
  const balanceLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-balance-problems');
  const cognitiveLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-cognitive-fog');
  const bladderLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-bladder-dysfunction');
  const bowelLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-bowel-dysfunction');
  const relapseLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-relapse');
  const walkingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-walking-difficulty');
  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-pain');
  const heatSensitivityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ms-heat-sensitivity');

  // Build evidence summary
  const evidence = [];
  evidence.push(`${relevantLogs.length} MS symptom logs in ${evaluationPeriodDays} days`);

  if (fatigueLogs.length > 0) evidence.push(`Fatigue: ${fatigueLogs.length} days`);
  if (numbnessLogs.length > 0) evidence.push(`Numbness/tingling: ${numbnessLogs.length} occurrences`);
  if (visionLogs.length > 0) evidence.push(`Vision problems: ${visionLogs.length} occurrences`);
  if (weaknessLogs.length > 0) evidence.push(`Muscle weakness: ${weaknessLogs.length} occurrences`);
  if (spasticityLogs.length > 0) evidence.push(`Spasticity: ${spasticityLogs.length} occurrences`);
  if (balanceLogs.length > 0) evidence.push(`Balance problems: ${balanceLogs.length} occurrences`);
  if (cognitiveLogs.length > 0) evidence.push(`Cognitive issues: ${cognitiveLogs.length} occurrences`);
  if (bladderLogs.length > 0) evidence.push(`Bladder dysfunction: ${bladderLogs.length} occurrences`);
  if (bowelLogs.length > 0) evidence.push(`Bowel dysfunction: ${bowelLogs.length} occurrences`);
  if (relapseLogs.length > 0) evidence.push(`Relapses: ${relapseLogs.length} documented`);
  if (walkingLogs.length > 0) evidence.push(`Walking difficulty: ${walkingLogs.length} occurrences`);

  // MS has minimum 30% rating when residuals present
  let supportedRating = 30;
  let ratingRationale = [
    'Minimum 30% rating supported - ascertainable MS residuals documented',
  ];

  // Identify which residuals may warrant additional separate ratings
  const additionalRatingPotential = [];

  if (visionLogs.length > 5) {
    additionalRatingPotential.push('Vision impairment may warrant separate rating under eye codes');
  }
  if (bladderLogs.length > 5) {
    additionalRatingPotential.push('Bladder dysfunction may warrant separate rating under DC 7542');
  }
  if (bowelLogs.length > 5) {
    additionalRatingPotential.push('Bowel dysfunction may warrant separate rating under DC 7332');
  }
  if (weaknessLogs.length > 10 || walkingLogs.length > 10) {
    additionalRatingPotential.push('Extremity weakness may warrant separate rating under peripheral nerve codes');
  }
  if (cognitiveLogs.length > 10) {
    additionalRatingPotential.push('Cognitive impairment should be evaluated for potential separate rating');
  }

  // Evidence gaps
  const gaps = [];
  if (relapseLogs.length === 0) {
    gaps.push('Document any relapses/exacerbations with dates and duration');
  }
  if (relevantLogs.length < 10) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  if (bladderLogs.length === 0 && bowelLogs.length === 0) {
    gaps.push('Document any bladder or bowel dysfunction if present');
  }
  if (visionLogs.length === 0) {
    gaps.push('Document any vision problems if present (may warrant separate rating)');
  }

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    additionalRatingPotential,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      fatigueDays: fatigueLogs.length,
      numbnessOccurrences: numbnessLogs.length,
      visionOccurrences: visionLogs.length,
      weaknessOccurrences: weaknessLogs.length,
      spasticityOccurrences: spasticityLogs.length,
      balanceOccurrences: balanceLogs.length,
      cognitiveOccurrences: cognitiveLogs.length,
      bladderOccurrences: bladderLogs.length,
      bowelOccurrences: bowelLogs.length,
      relapseCount: relapseLogs.length,
      walkingOccurrences: walkingLogs.length,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

// ============================================
// PHASE 1A: PARKINSON'S DISEASE ANALYSIS (DC 8004)
// ============================================

/**
 * Analyze Parkinson's Disease symptom logs against VA rating criteria
 * DC 8004 - Minimum rating 30%, higher ratings based on specific residuals
 */

export const analyzeParkinsonsDiseaseLogs = (logs, options = {}) => {
  const conditionCriteria = PARKINSONS_DISEASE_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = NEUROLOGICAL_CONDITIONS.PARKINSONS_DISEASE.symptomIds;

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
      message: "No Parkinson's disease symptoms logged in evaluation period",
    };
  }

  // Categorize motor symptoms (cardinal features)
  const tremorLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-resting-tremor');
  const rigidityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-rigidity');
  const bradykinesiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-bradykinesia');
  const posturalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-postural-instability');
  const freezingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-freezing-gait');
  const shufflingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-shuffling-walk');
  const fallsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-falls');

  // Categorize non-motor symptoms
  const sleepLogs = relevantLogs.filter(log =>
      ['pd-sleep-disturbance', 'pd-rem-sleep-disorder'].includes(getLogSymptomId(log))
  );
  const depressionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-depression');
  const anxietyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-anxiety');
  const cognitiveLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-cognitive-changes');
  const swallowingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-swallowing-difficulty');
  const speechLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-soft-speech');
  const constipationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-constipation');
  const urinaryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-urinary-problems');

  // Medication-related
  const offEpisodeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-off-episodes');
  const dyskinesiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pd-dyskinesia');

  // Build evidence summary
  const evidence = [];
  evidence.push(`${relevantLogs.length} PD symptom logs in ${evaluationPeriodDays} days`);

  // Motor symptoms
  if (tremorLogs.length > 0) evidence.push(`Resting tremor: ${tremorLogs.length} occurrences`);
  if (rigidityLogs.length > 0) evidence.push(`Rigidity: ${rigidityLogs.length} occurrences`);
  if (bradykinesiaLogs.length > 0) evidence.push(`Bradykinesia: ${bradykinesiaLogs.length} occurrences`);
  if (posturalLogs.length > 0) evidence.push(`Postural instability: ${posturalLogs.length} occurrences`);
  if (freezingLogs.length > 0) evidence.push(`Freezing of gait: ${freezingLogs.length} episodes`);
  if (fallsLogs.length > 0) evidence.push(`Falls: ${fallsLogs.length} documented`);

  // Non-motor symptoms
  if (sleepLogs.length > 0) evidence.push(`Sleep disturbances: ${sleepLogs.length} occurrences`);
  if (depressionLogs.length > 0) evidence.push(`Depression symptoms: ${depressionLogs.length} occurrences`);
  if (cognitiveLogs.length > 0) evidence.push(`Cognitive changes: ${cognitiveLogs.length} occurrences`);
  if (swallowingLogs.length > 0) evidence.push(`Swallowing difficulty: ${swallowingLogs.length} occurrences`);

  // Medication effects
  if (offEpisodeLogs.length > 0) evidence.push(`OFF episodes: ${offEpisodeLogs.length} documented`);
  if (dyskinesiaLogs.length > 0) evidence.push(`Dyskinesia: ${dyskinesiaLogs.length} occurrences`);

  // PD has minimum 30% rating when residuals present
  let supportedRating = 30;
  let ratingRationale = [
    "Minimum 30% rating supported - ascertainable Parkinson's residuals documented",
  ];

  // Count cardinal motor symptoms present
  const cardinalSymptomsPresent = [
    tremorLogs.length > 0,
    rigidityLogs.length > 0,
    bradykinesiaLogs.length > 0,
    posturalLogs.length > 0,
  ].filter(Boolean).length;

  if (cardinalSymptomsPresent >= 3) {
    ratingRationale.push(`${cardinalSymptomsPresent} of 4 cardinal motor symptoms documented`);
  }

  // Identify which residuals may warrant additional separate ratings
  const additionalRatingPotential = [];

  if (depressionLogs.length > 5 || anxietyLogs.length > 5) {
    additionalRatingPotential.push('Depression/anxiety may warrant separate rating under mental health codes');
  }
  if (cognitiveLogs.length > 10) {
    additionalRatingPotential.push('Cognitive impairment should be evaluated for dementia rating if severe');
  }
  if (swallowingLogs.length > 5) {
    additionalRatingPotential.push('Dysphagia may warrant evaluation under digestive system codes');
  }
  if (urinaryLogs.length > 5) {
    additionalRatingPotential.push('Urinary dysfunction may warrant separate rating under voiding dysfunction');
  }
  if (tremorLogs.length > 15 || rigidityLogs.length > 15) {
    additionalRatingPotential.push('Severe motor symptoms may warrant evaluation of extremity functional impairment');
  }

  // Evidence gaps
  const gaps = [];
  if (tremorLogs.length === 0 && rigidityLogs.length === 0 && bradykinesiaLogs.length === 0) {
    gaps.push('Document cardinal motor symptoms (tremor, rigidity, bradykinesia)');
  }
  if (relevantLogs.length < 10) {
    gaps.push('Continue logging symptoms regularly to establish pattern and progression');
  }
  if (fallsLogs.length === 0 && posturalLogs.length > 0) {
    gaps.push('Document any falls if occurring - important for safety assessment');
  }
  if (offEpisodeLogs.length === 0) {
    gaps.push('Document medication wearing-off or OFF episodes if occurring');
  }

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    additionalRatingPotential,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      tremorOccurrences: tremorLogs.length,
      rigidityOccurrences: rigidityLogs.length,
      bradykinesiaOccurrences: bradykinesiaLogs.length,
      posturalOccurrences: posturalLogs.length,
      freezingEpisodes: freezingLogs.length,
      fallCount: fallsLogs.length,
      sleepOccurrences: sleepLogs.length,
      depressionOccurrences: depressionLogs.length,
      cognitiveOccurrences: cognitiveLogs.length,
      offEpisodes: offEpisodeLogs.length,
      dyskinesiaOccurrences: dyskinesiaLogs.length,
      cardinalSymptomsPresent,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

// ============================================
// PHASE 1A: MYASTHENIA GRAVIS ANALYSIS (DC 8025)
// ============================================

/**
 * Analyze Myasthenia Gravis symptom logs against VA rating criteria
 * DC 8025 - Minimum rating 30%, higher ratings based on muscle group involvement
 */

export const analyzeMyastheniaGravisLogs = (logs, options = {}) => {
  const conditionCriteria = MYASTHENIA_GRAVIS_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = NEUROLOGICAL_CONDITIONS.MYASTHENIA_GRAVIS.symptomIds;

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
      message: 'No myasthenia gravis symptoms logged in evaluation period',
    };
  }

  // Categorize by muscle group involvement
  // Ocular symptoms
  const ptosisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-ptosis');
  const diplopiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-diplopia');

  // Bulbar symptoms
  const facialLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-facial-weakness');
  const chewingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-difficulty-chewing');
  const swallowingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-difficulty-swallowing');
  const speechLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-slurred-speech');
  const voiceLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-voice-fatigue');

  // Limb/axial symptoms
  const limbLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-limb-weakness');
  const neckLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-neck-weakness');
  const armLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-arm-elevation-difficulty');

  // Respiratory
  const respiratoryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-respiratory-weakness');

  // Crisis/hospitalization
  const crisisLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-crisis');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-hospitalization');

  // Characteristic features
  const fatigueActivityLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-fatigue-activity');
  const improvementRestLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'mg-improvement-rest');

  // Determine involvement pattern
  const hasOcularOnly = (ptosisLogs.length > 0 || diplopiaLogs.length > 0) &&
      limbLogs.length === 0 && respiratoryLogs.length === 0 &&
      chewingLogs.length === 0 && swallowingLogs.length === 0;

  const hasBulbarInvolvement = chewingLogs.length > 0 || swallowingLogs.length > 0 ||
      speechLogs.length > 0 || facialLogs.length > 0;

  const hasGeneralizedWeakness = limbLogs.length > 0 || neckLogs.length > 0 || armLogs.length > 0;

  const hasRespiratoryInvolvement = respiratoryLogs.length > 0;

  const hasCrisis = crisisLogs.length > 0;

  // Build evidence summary
  const evidence = [];
  evidence.push(`${relevantLogs.length} MG symptom logs in ${evaluationPeriodDays} days`);

  // Ocular
  if (ptosisLogs.length > 0) evidence.push(`Ptosis: ${ptosisLogs.length} occurrences`);
  if (diplopiaLogs.length > 0) evidence.push(`Diplopia: ${diplopiaLogs.length} occurrences`);

  // Bulbar
  if (chewingLogs.length > 0) evidence.push(`Difficulty chewing: ${chewingLogs.length} occurrences`);
  if (swallowingLogs.length > 0) evidence.push(`Difficulty swallowing: ${swallowingLogs.length} occurrences`);
  if (speechLogs.length > 0) evidence.push(`Slurred speech: ${speechLogs.length} occurrences`);

  // Limb/axial
  if (limbLogs.length > 0) evidence.push(`Limb weakness: ${limbLogs.length} occurrences`);
  if (neckLogs.length > 0) evidence.push(`Neck weakness: ${neckLogs.length} occurrences`);

  // Respiratory
  if (respiratoryLogs.length > 0) evidence.push(`Respiratory weakness: ${respiratoryLogs.length} occurrences`);

  // Crisis
  if (crisisLogs.length > 0) evidence.push(`Myasthenic crisis: ${crisisLogs.length} episodes`);
  if (hospitalizationLogs.length > 0) evidence.push(`Hospitalizations: ${hospitalizationLogs.length}`);

  // Characteristic pattern
  if (fatigueActivityLogs.length > 0) evidence.push(`Fatigue with activity documented: ${fatigueActivityLogs.length} times`);
  if (improvementRestLogs.length > 0) evidence.push(`Improvement with rest documented: ${improvementRestLogs.length} times`);

  // MG has minimum 30% rating when residuals present
  let supportedRating = 30;
  let ratingRationale = [
    'Minimum 30% rating supported - ascertainable MG residuals documented',
  ];

  // Note severity based on involvement pattern
  if (hasCrisis) {
    supportedRating = 100;
    ratingRationale = [
      'Myasthenic crisis documented - 100% rating during crisis/recovery period',
      'Rate residuals after stabilization',
    ];
  } else if (hasRespiratoryInvolvement) {
    ratingRationale.push('Respiratory involvement present - may warrant higher rating');
    ratingRationale.push('PFT (FVC) testing recommended to document respiratory impairment');
  } else if (hasBulbarInvolvement && hasGeneralizedWeakness) {
    ratingRationale.push('Generalized MG with bulbar involvement documented');
  } else if (hasOcularOnly) {
    ratingRationale.push('Ocular MG pattern - symptoms limited to eye muscles');
  }

  // Identify additional rating potential
  const additionalRatingPotential = [];

  if (ptosisLogs.length > 5 || diplopiaLogs.length > 5) {
    additionalRatingPotential.push('Visual impairment from ptosis/diplopia may warrant separate eye rating');
  }
  if (swallowingLogs.length > 5) {
    additionalRatingPotential.push('Dysphagia may warrant evaluation under digestive codes if affecting nutrition');
  }
  if (respiratoryLogs.length > 0) {
    additionalRatingPotential.push('Respiratory weakness should be evaluated with PFT for potential respiratory rating');
  }
  if (limbLogs.length > 10) {
    additionalRatingPotential.push('Limb weakness may warrant evaluation under peripheral nerve codes');
  }

  // Evidence gaps
  const gaps = [];
  if (fatigueActivityLogs.length === 0 && improvementRestLogs.length === 0) {
    gaps.push('Document characteristic fatigable weakness pattern (worse with activity, better with rest)');
  }
  if (relevantLogs.length < 10) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  if (respiratoryLogs.length > 0) {
    gaps.push('Get pulmonary function testing (FVC) to document respiratory involvement');
  }
  if (crisisLogs.length === 0 && (respiratoryLogs.length > 0 || swallowingLogs.length > 5)) {
    gaps.push('Be aware of crisis warning signs - seek emergency care if breathing/swallowing severely affected');
  }

  // Determine MGFA class approximation based on logged symptoms
  let mgfaClassEstimate = 'I';
  if (hasCrisis) {
    mgfaClassEstimate = 'V';
  } else if (hasRespiratoryInvolvement || (hasBulbarInvolvement && hasGeneralizedWeakness && (swallowingLogs.length > 10 || respiratoryLogs.length > 5))) {
    mgfaClassEstimate = 'IV';
  } else if (hasBulbarInvolvement && hasGeneralizedWeakness) {
    mgfaClassEstimate = 'III';
  } else if (hasGeneralizedWeakness || hasBulbarInvolvement) {
    mgfaClassEstimate = 'II';
  }

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    additionalRatingPotential,
    evidence,
    gaps,
    mgfaClassEstimate,
    metrics: {
      totalLogs: relevantLogs.length,
      ptosisOccurrences: ptosisLogs.length,
      diplopiaOccurrences: diplopiaLogs.length,
      chewingOccurrences: chewingLogs.length,
      swallowingOccurrences: swallowingLogs.length,
      speechOccurrences: speechLogs.length,
      limbOccurrences: limbLogs.length,
      neckOccurrences: neckLogs.length,
      respiratoryOccurrences: respiratoryLogs.length,
      crisisCount: crisisLogs.length,
      hospitalizationCount: hospitalizationLogs.length,
      hasOcularOnly,
      hasBulbarInvolvement,
      hasGeneralizedWeakness,
      hasRespiratoryInvolvement,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};


// ============================================
// PHASE 1B: ADDITIONAL NEUROLOGICAL - ANALYSIS
// ============================================

/**
 * Analyze Narcolepsy symptoms (DC 8108)
 * Rated on frequency of sleep attacks, cataplexy, and functional impairment
 */

export const analyzeNarcolepsyLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const conditionCriteria = NARCOLEPSY_CRITERIA;

  // Filter relevant logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    if (logDate < cutoffDate) return false;
    const symptomId = (log.symptomId || log.symptom || '').toLowerCase();
    const category = (log.category || '').toLowerCase();
    return symptomId.startsWith('narco-') || category.includes('narcolepsy');
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: conditionCriteria.condition };
  }

  // Count specific symptom types
  const sleepAttacks = relevantLogs.filter(l =>
      (l.symptomId || '').includes('sleep-attack') || (l.symptomId || '').includes('microsleep')
  ).length;

  const cataplexyEpisodes = relevantLogs.filter(l =>
      (l.symptomId || '').includes('cataplexy')
  ).length;

  const sleepParalysis = relevantLogs.filter(l =>
      (l.symptomId || '').includes('sleep-paralysis')
  ).length;

  const hallucinations = relevantLogs.filter(l =>
      (l.symptomId || '').includes('hallucination')
  ).length;

  const excessiveSleepiness = relevantLogs.filter(l =>
      (l.symptomId || '').includes('excessive-sleepiness')
  ).length;

  const automaticBehavior = relevantLogs.filter(l =>
      (l.symptomId || '').includes('automatic-behavior')
  ).length;

  // Calculate frequencies
  const weeksInPeriod = evaluationPeriodDays / 7;
  const sleepAttacksPerWeek = sleepAttacks / weeksInPeriod;
  const cataplexyPerWeek = cataplexyEpisodes / weeksInPeriod;

  // Check for narcolepsy-specific data
  const hasCataplexy = cataplexyEpisodes > 0;
  const hasType1Features = hasCataplexy; // Type 1 narcolepsy has cataplexy

  // Determine rating
  let supportedRating = 0;
  let ratingRationale = [];
  const evidence = [];
  const gaps = [];

  // 80%: Severe - daily sleep attacks, frequent cataplexy
  if (sleepAttacksPerWeek >= 7 && cataplexyPerWeek >= 3) {
    supportedRating = 80;
    ratingRationale = [
      'Daily or near-daily sleep attacks documented',
      'Frequent cataplexy episodes',
      'Severe functional impairment indicated',
    ];
  }
  // 60%: Moderately severe - multiple weekly attacks, cataplexy present
  else if (sleepAttacksPerWeek >= 3 && hasCataplexy) {
    supportedRating = 60;
    ratingRationale = [
      'Multiple sleep attacks per week',
      'Cataplexy episodes present',
      'Significant functional impairment',
    ];
  }
  // 40%: Moderate - weekly attacks, mild cataplexy
  else if (sleepAttacksPerWeek >= 1 || (hasCataplexy && cataplexyPerWeek >= 0.5)) {
    supportedRating = 40;
    ratingRationale = [
      'Weekly sleep attacks or cataplexy episodes',
      'Moderate functional impact',
    ];
  }
  // 20%: Mild - occasional attacks
  else if (sleepAttacks >= 2 || hasCataplexy) {
    supportedRating = 20;
    ratingRationale = [
      'Occasional sleep attacks or cataplexy documented',
      'Mild functional impact',
    ];
  }
  // 10%: Minimal symptoms
  else if (relevantLogs.length >= 3) {
    supportedRating = 10;
    ratingRationale = [
      'Narcolepsy symptoms present',
      'Minimal functional impairment documented',
    ];
  }

  // Build evidence
  if (sleepAttacks > 0) evidence.push(`${sleepAttacks} sleep attacks logged (${sleepAttacksPerWeek.toFixed(1)}/week)`);
  if (hasCataplexy) evidence.push(`${cataplexyEpisodes} cataplexy episodes (Type 1 narcolepsy)`);
  if (sleepParalysis > 0) evidence.push(`${sleepParalysis} sleep paralysis episodes`);
  if (hallucinations > 0) evidence.push(`${hallucinations} hypnagogic/hypnopompic hallucinations`);
  if (automaticBehavior > 0) evidence.push(`${automaticBehavior} automatic behavior episodes`);

  // Identify gaps
  if (sleepAttacks < 5) gaps.push('Continue logging sleep attacks to establish frequency pattern');
  if (!hasCataplexy) gaps.push('Document cataplexy episodes if present (indicates Type 1 narcolepsy)');
  if (relevantLogs.length < 10) gaps.push('More symptom logs strengthen claim documentation');
  gaps.push('Obtain sleep study (MSLT) showing sleep latency <8 min and 2+ SOREMPs');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    cfrReference: conditionCriteria.cfrReference,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      sleepAttacks,
      sleepAttacksPerWeek: parseFloat(sleepAttacksPerWeek.toFixed(1)),
      cataplexyEpisodes,
      hasCataplexy,
      hasType1Features,
      sleepParalysis,
      hallucinations,
      automaticBehavior,
      excessiveSleepiness,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

/**
 * Analyze ALS symptoms (DC 8017)
 * Progressive motor neuron disease - rated on extent of weakness and bulbar/respiratory involvement
 */

export const analyzeALSLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const conditionCriteria = ALS_CRITERIA;

  // Filter relevant logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    if (logDate < cutoffDate) return false;
    const symptomId = (log.symptomId || log.symptom || '').toLowerCase();
    const category = (log.category || '').toLowerCase();
    return symptomId.startsWith('als-') || category.includes('als') || category.includes('amyotrophic');
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: conditionCriteria.condition };
  }

  // Count specific symptom types
  const weaknessLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('weakness') || (l.symptomId || '').includes('atrophy')
  ).length;

  const fasciculationLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('fasciculation')
  ).length;

  const bulbarLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('speaking') || (l.symptomId || '').includes('swallowing') || (l.symptomId || '').includes('drooling')
  ).length;

  const respiratoryLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('respiratory')
  ).length;

  const mobilityLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('foot-drop') || (l.symptomId || '').includes('tripping')
  ).length;

  const spasticityLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('spasticity') || (l.symptomId || '').includes('cramp')
  ).length;

  const emotionalLability = relevantLogs.filter(l =>
      (l.symptomId || '').includes('emotional-lability')
  ).length;

  // Determine severity indicators
  const hasBulbarInvolvement = bulbarLogs >= 2;
  const hasRespiratoryInvolvement = respiratoryLogs >= 1;
  const hasSignificantWeakness = weaknessLogs >= 5;
  const hasMobilityIssues = mobilityLogs >= 2;

  // Calculate average severity
  const avgSeverity = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / relevantLogs.length
      : 0;

  // Determine rating - ALS is progressive, minimum 30%
  let supportedRating = 30; // Minimum for confirmed ALS
  let ratingRationale = [];
  const evidence = [];
  const gaps = [];

  // 100%: Total disability
  if (hasRespiratoryInvolvement && hasBulbarInvolvement && avgSeverity >= 8) {
    supportedRating = 100;
    ratingRationale = [
      'Respiratory involvement documented',
      'Severe bulbar symptoms (speech/swallowing)',
      'High symptom severity indicates advanced disease',
    ];
  }
  // 80%: Severe
  else if ((hasRespiratoryInvolvement || hasBulbarInvolvement) && hasSignificantWeakness) {
    supportedRating = 80;
    ratingRationale = [
      hasBulbarInvolvement ? 'Bulbar involvement present' : 'Respiratory symptoms present',
      'Significant weakness documented',
      'Multiple body regions affected',
    ];
  }
  // 60%: Moderately severe
  else if (hasSignificantWeakness && (hasBulbarInvolvement || hasMobilityIssues)) {
    supportedRating = 60;
    ratingRationale = [
      'Progressive weakness in multiple regions',
      hasBulbarInvolvement ? 'Early bulbar involvement' : 'Mobility significantly affected',
    ];
  }
  // 40%: Moderate
  else if (weaknessLogs >= 3 || hasMobilityIssues) {
    supportedRating = 40;
    ratingRationale = [
      'Definite weakness affecting function',
      'Motor symptoms documented',
    ];
  }
  // 30%: Minimum - confirmed ALS
  else {
    ratingRationale = [
      'ALS diagnosis with early motor symptoms',
      'Minimum 30% rating for confirmed ALS',
    ];
  }

  // Build evidence
  evidence.push(`${relevantLogs.length} ALS-related symptoms logged`);
  if (weaknessLogs > 0) evidence.push(`${weaknessLogs} weakness/atrophy episodes`);
  if (fasciculationLogs > 0) evidence.push(`${fasciculationLogs} fasciculation episodes`);
  if (bulbarLogs > 0) evidence.push(`${bulbarLogs} bulbar symptoms (speech/swallowing)`);
  if (respiratoryLogs > 0) evidence.push(`${respiratoryLogs} respiratory difficulty episodes`);
  evidence.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Identify gaps
  if (!hasRespiratoryInvolvement) gaps.push('Document respiratory symptoms if present - key rating factor');
  if (!hasBulbarInvolvement) gaps.push('Log speech/swallowing difficulties if occurring');
  gaps.push('Obtain pulmonary function tests (FVC) for respiratory status');
  gaps.push('EMG/nerve conduction studies document disease progression');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    cfrReference: conditionCriteria.cfrReference,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      weaknessLogs,
      fasciculationLogs,
      bulbarLogs,
      respiratoryLogs,
      mobilityLogs,
      spasticityLogs,
      emotionalLability,
      hasBulbarInvolvement,
      hasRespiratoryInvolvement,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

/**
 * Analyze Syringomyelia symptoms (DC 8024)
 * Rated on sensory loss, motor weakness, and functional impairment
 */

export const analyzeSyringomyeliaLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const conditionCriteria = SYRINGOMYELIA_CRITERIA;

  // Filter relevant logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    if (logDate < cutoffDate) return false;
    const symptomId = (log.symptomId || log.symptom || '').toLowerCase();
    const category = (log.category || '').toLowerCase();
    return symptomId.startsWith('syring-') || category.includes('syringomyelia');
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: conditionCriteria.condition };
  }

  // Count specific symptom types
  const painLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('pain')
  ).length;

  const weaknessLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('weakness') || (l.symptomId || '').includes('muscle-wasting')
  ).length;

  const sensoryLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('sensory') || (l.symptomId || '').includes('numbness') ||
      (l.symptomId || '').includes('tingling') || (l.symptomId || '').includes('insensitivity')
  ).length;

  const tempInsensitivity = relevantLogs.filter(l =>
      (l.symptomId || '').includes('temp-insensitivity')
  ).length;

  const painInsensitivity = relevantLogs.filter(l =>
      (l.symptomId || '').includes('pain-insensitivity')
  ).length;

  const bowelBladderLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('bowel-bladder')
  ).length;

  // Determine severity indicators
  const hasDissociatedSensoryLoss = tempInsensitivity > 0 || painInsensitivity > 0;
  const hasSignificantSensoryLoss = sensoryLogs >= 5;
  const hasWeakness = weaknessLogs >= 2;
  const hasAutonomicInvolvement = bowelBladderLogs > 0;

  // Calculate average severity
  const avgSeverity = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / relevantLogs.length
      : 0;

  // Determine rating
  let supportedRating = 0;
  let ratingRationale = [];
  const evidence = [];
  const gaps = [];

  // 100%: Severe - profound deficits
  if (avgSeverity >= 8 && hasSignificantSensoryLoss && hasWeakness && hasAutonomicInvolvement) {
    supportedRating = 100;
    ratingRationale = [
      'Profound sensory and motor deficits',
      'Bowel/bladder involvement',
      'Severe functional impairment',
    ];
  }
  // 80%: Marked deficits
  else if (avgSeverity >= 7 && hasSignificantSensoryLoss && hasWeakness) {
    supportedRating = 80;
    ratingRationale = [
      'Marked sensory loss documented',
      'Significant weakness present',
      'Major functional impairment',
    ];
  }
  // 60%: Moderate deficits
  else if ((hasSignificantSensoryLoss || hasWeakness) && avgSeverity >= 5) {
    supportedRating = 60;
    ratingRationale = [
      'Moderate sensory or motor deficits',
      'Functional limitations present',
    ];
  }
  // 40%: Definite symptoms
  else if (hasDissociatedSensoryLoss || (sensoryLogs >= 3 && weaknessLogs >= 1)) {
    supportedRating = 40;
    ratingRationale = [
      hasDissociatedSensoryLoss ? 'Characteristic dissociated sensory loss' : 'Definite sensory changes',
      'Mild to moderate functional impairment',
    ];
  }
  // 20%: Mild symptoms
  else if (relevantLogs.length >= 3) {
    supportedRating = 20;
    ratingRationale = [
      'Syringomyelia symptoms present',
      'Mild functional impact',
    ];
  }

  // Build evidence
  evidence.push(`${relevantLogs.length} syringomyelia symptoms logged`);
  if (sensoryLogs > 0) evidence.push(`${sensoryLogs} sensory symptom episodes`);
  if (hasDissociatedSensoryLoss) evidence.push('Dissociated sensory loss (temp/pain insensitivity) - characteristic finding');
  if (weaknessLogs > 0) evidence.push(`${weaknessLogs} weakness/atrophy episodes`);
  if (painLogs > 0) evidence.push(`${painLogs} pain episodes`);
  evidence.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  // Identify gaps
  if (!hasDissociatedSensoryLoss) gaps.push('Document temperature/pain insensitivity if present - characteristic of syringomyelia');
  if (sensoryLogs < 5) gaps.push('Continue logging sensory symptoms to establish pattern');
  gaps.push('MRI showing syrinx size and location strengthens claim');
  if (hasAutonomicInvolvement) gaps.push('Bladder/bowel dysfunction may warrant separate rating');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    cfrReference: conditionCriteria.cfrReference,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      painLogs,
      weaknessLogs,
      sensoryLogs,
      tempInsensitivity,
      painInsensitivity,
      bowelBladderLogs,
      hasDissociatedSensoryLoss,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

/**
 * Analyze Myelitis symptoms (DC 8010)
 * Rated on motor/sensory deficits, bladder/bowel involvement, and functional impairment
 */

export const analyzeMyelitisLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const conditionCriteria = MYELITIS_CRITERIA;

  // Filter relevant logs
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    if (logDate < cutoffDate) return false;
    const symptomId = (log.symptomId || log.symptom || '').toLowerCase();
    const category = (log.category || '').toLowerCase();
    return symptomId.startsWith('myel-') || category.includes('myelitis');
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: conditionCriteria.condition };
  }

  // Count specific symptom types
  const weaknessLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('weakness') || (l.symptomId || '').includes('paralysis')
  ).length;

  const sensoryLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('sensory') || (l.symptomId || '').includes('numbness') ||
      (l.symptomId || '').includes('tingling') || (l.symptomId || '').includes('band-sensation')
  ).length;

  const bladderLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('bladder')
  ).length;

  const bowelLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('bowel')
  ).length;

  const painLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('pain')
  ).length;

  const spasticityLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('spasticity')
  ).length;

  const paralysisLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('paralysis')
  ).length;

  const sexualDysfunctionLogs = relevantLogs.filter(l =>
      (l.symptomId || '').includes('sexual-dysfunction')
  ).length;

  // Determine severity indicators
  const hasParalysis = paralysisLogs > 0;
  const hasBladderInvolvement = bladderLogs >= 2;
  const hasBowelInvolvement = bowelLogs >= 2;
  const hasSignificantWeakness = weaknessLogs >= 5;
  const hasAutonomicInvolvement = hasBladderInvolvement || hasBowelInvolvement;

  // Calculate average severity
  const avgSeverity = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / relevantLogs.length
      : 0;

  // Determine rating
  let supportedRating = 0;
  let ratingRationale = [];
  const evidence = [];
  const gaps = [];

  // 100%: Complete/near-complete paralysis
  if (hasParalysis && avgSeverity >= 8 && hasAutonomicInvolvement) {
    supportedRating = 100;
    ratingRationale = [
      'Paralysis documented',
      'Complete or near-complete loss of function below lesion',
      'Bladder/bowel involvement present',
    ];
  }
  // 80%: Severe - marked weakness, significant autonomic
  else if (hasSignificantWeakness && hasAutonomicInvolvement && avgSeverity >= 7) {
    supportedRating = 80;
    ratingRationale = [
      'Marked weakness documented',
      'Significant bladder/bowel dysfunction',
      'Severe sensory impairment',
    ];
  }
  // 60%: Moderately severe
  else if ((hasSignificantWeakness || hasAutonomicInvolvement) && avgSeverity >= 5) {
    supportedRating = 60;
    ratingRationale = [
      hasSignificantWeakness ? 'Significant weakness affecting ambulation' : 'Autonomic dysfunction present',
      'Moderate functional impairment',
    ];
  }
  // 40%: Moderate
  else if (weaknessLogs >= 3 || (hasBladderInvolvement || hasBowelInvolvement)) {
    supportedRating = 40;
    ratingRationale = [
      'Definite weakness or bladder/bowel symptoms',
      'Ambulatory with difficulty',
    ];
  }
  // 20%: Mild residuals
  else if (relevantLogs.length >= 3) {
    supportedRating = 20;
    ratingRationale = [
      'Myelitis residuals present',
      'Mild functional impairment',
    ];
  }

  // Build evidence
  evidence.push(`${relevantLogs.length} myelitis symptoms logged`);
  if (weaknessLogs > 0) evidence.push(`${weaknessLogs} weakness episodes`);
  if (hasParalysis) evidence.push('Paralysis documented');
  if (sensoryLogs > 0) evidence.push(`${sensoryLogs} sensory symptom episodes`);
  if (bladderLogs > 0) evidence.push(`${bladderLogs} bladder dysfunction episodes`);
  if (bowelLogs > 0) evidence.push(`${bowelLogs} bowel dysfunction episodes`);
  if (spasticityLogs > 0) evidence.push(`${spasticityLogs} spasticity episodes`);
  evidence.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  // Identify gaps
  if (!hasAutonomicInvolvement) gaps.push('Document bladder/bowel symptoms if present - may warrant separate ratings');
  if (weaknessLogs < 5) gaps.push('Continue logging weakness episodes to establish severity');
  gaps.push('MRI documenting spinal cord lesion location and extent');
  if (hasBladderInvolvement) gaps.push('Bladder dysfunction (DC 7542) may be rated separately');
  if (hasBowelInvolvement) gaps.push('Bowel dysfunction (DC 7332) may be rated separately');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    cfrReference: conditionCriteria.cfrReference,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: parseFloat(avgSeverity.toFixed(1)),
      weaknessLogs,
      sensoryLogs,
      bladderLogs,
      bowelLogs,
      painLogs,
      spasticityLogs,
      paralysisLogs,
      sexualDysfunctionLogs,
      hasParalysis,
      hasAutonomicInvolvement,
    },
    criteria: conditionCriteria,
    disclaimer: conditionCriteria.disclaimer,
  };
};

/**
 * Analyze Upper Radicular Group (C5-C6) - DC 8510/8610/8710
 */

// ============================================
// PERIPHERAL NERVE ANALYSIS HELPERS
// ============================================

/**
 * Determines nerve injury severity level from symptom logs.
 * Per 38 CFR 4.124a: wholly sensory involvement is rated mild or moderate maximum.
 */
const determineNerveSeverity = (logs, motorSymptomIds, sensorySymptomIds, functionalSymptomIds = []) => {
  const motorLogs = logs.filter(log => motorSymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));
  const sensoryLogs = logs.filter(log => sensorySymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));
  const functionalLogs = logs.filter(log => functionalSymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));

  const hasMotorInvolvement = motorLogs.length > 0;
  const hasSensoryInvolvement = sensoryLogs.length > 0;
  const hasFunctionalImpact = functionalLogs.length > 0;

  const allLogs = [...motorLogs, ...sensoryLogs, ...functionalLogs];
  const severityScores = allLogs
  .map(log => log.severity)
  .filter(s => s !== undefined && s !== null);
  const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length
      : 0;

  const isWholySensory = hasSensoryInvolvement && !hasMotorInvolvement;

  let severityLevel = 'mild';
  if (isWholySensory) {
    severityLevel = avgSeverity >= 7 ? 'moderate' : 'mild';
  } else if (hasMotorInvolvement) {
    if (avgSeverity >= 9 || (motorLogs.length >= 10 && hasFunctionalImpact)) {
      severityLevel = 'complete';
    } else if (avgSeverity >= 7 || (motorLogs.length >= 5 && avgSeverity >= 6)) {
      severityLevel = 'severe';
    } else if (avgSeverity >= 5 || motorLogs.length >= 3) {
      severityLevel = 'moderate';
    } else {
      severityLevel = 'mild';
    }
  }

  return {
    severityLevel,
    hasMotorInvolvement,
    hasSensoryInvolvement,
    isWholySensory,
    hasFunctionalImpact,
    motorLogCount: motorLogs.length,
    sensoryLogCount: sensoryLogs.length,
    avgSeverity: avgSeverity.toFixed(1),
    totalLogs: allLogs.length,
  };
};

/**
 * Determines final rating based on severity level and major/minor extremity.
 * ratingScale format: { complete: {major: 70, minor: 60}, severe: {major: 50, minor: 40}, ... }
 */
const getUpperExtremityNerveRating = (severityLevel, isMajorExtremity, ratingScale) => {
  const scale = ratingScale[severityLevel];
  if (!scale) return ratingScale.mild?.major || ratingScale.mild?.both || 0;
  if (scale.both !== undefined) return scale.both;
  return isMajorExtremity ? scale.major : scale.minor;
};

export const analyzeUpperRadicularGroupLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.UPPER_RADICULAR_GROUP.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['uprn-shoulder-weakness', 'uprn-elbow-weakness', 'uprn-shoulder-movement-loss', 'uprn-elbow-movement-loss', 'uprn-muscle-atrophy'];
  const sensorySymptoms = ['uprn-numbness', 'uprn-tingling', 'uprn-pain'];
  const functionalSymptoms = ['uprn-reflex-loss'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, functionalSymptoms);

  const ratingScale = {
    complete: { major: 70, minor: 60 },
    severe: { major: 50, minor: 40 },
    moderate: { major: 40, minor: 30 },
    mild: { both: 20 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} upper radicular group symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (weakness, movement loss) if present for higher rating');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'Upper Radicular Group (C5-C6)',
    diagnosticCodes: { paralysis: '8510', neuritis: '8610', neuralgia: '8710' },
  };
};

/**
 * Analyze Middle Radicular Group (C7) - DC 8511/8611/8711
 */

export const analyzeMiddleRadicularGroupLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.MIDDLE_RADICULAR_GROUP.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['mdrn-arm-weakness', 'mdrn-wrist-extension-weakness', 'mdrn-elbow-extension-weakness', 'mdrn-finger-extension-weakness', 'mdrn-muscle-atrophy'];
  const sensorySymptoms = ['mdrn-numbness', 'mdrn-tingling', 'mdrn-pain'];
  const functionalSymptoms = ['mdrn-reflex-loss'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, functionalSymptoms);

  const ratingScale = {
    complete: { major: 70, minor: 60 },
    severe: { major: 50, minor: 40 },
    moderate: { major: 40, minor: 30 },
    mild: { both: 20 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} middle radicular group symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (wrist/elbow/finger extension weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'Middle Radicular Group (C7)',
    diagnosticCodes: { paralysis: '8511', neuritis: '8611', neuralgia: '8711' },
  };
};

/**
 * Analyze Lower Radicular Group (C8-T1) - DC 8512/8612/8712
 */

export const analyzeLowerRadicularGroupLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.LOWER_RADICULAR_GROUP.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['lwrn-hand-weakness', 'lwrn-grip-weakness', 'lwrn-finger-flexion-weakness', 'lwrn-intrinsic-muscle-weakness', 'lwrn-muscle-atrophy'];
  const sensorySymptoms = ['lwrn-numbness', 'lwrn-tingling', 'lwrn-pain'];
  const functionalSymptoms = ['lwrn-clumsiness'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, functionalSymptoms);

  const ratingScale = {
    complete: { major: 70, minor: 60 },
    severe: { major: 50, minor: 40 },
    moderate: { major: 40, minor: 30 },
    mild: { both: 20 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} lower radicular group symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (hand/grip weakness, intrinsic muscle weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'Lower Radicular Group (C8-T1)',
    diagnosticCodes: { paralysis: '8512', neuritis: '8612', neuralgia: '8712' },
  };
};

/**
 * Analyze All Radicular Groups (Brachial Plexus) - DC 8513/8613/8713
 */

export const analyzeAllRadicularGroupsLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.ALL_RADICULAR_GROUPS.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['alrn-complete-arm-paralysis', 'alrn-arm-weakness', 'alrn-shoulder-weakness', 'alrn-elbow-weakness', 'alrn-wrist-weakness', 'alrn-hand-weakness', 'alrn-muscle-atrophy'];
  const sensorySymptoms = ['alrn-numbness', 'alrn-tingling', 'alrn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // All radicular groups has different rating scale - higher ratings
  const ratingScale = {
    complete: { major: 90, minor: 80 },
    severe: { major: 70, minor: 60 },
    moderate: { major: 40, minor: 30 },
    mild: { both: 20 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} brachial plexus symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits at all levels (shoulder, elbow, wrist, hand) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Comprehensive brachial plexus evaluation with EMG/NCS required');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'All Radicular Groups (Brachial Plexus)',
    diagnosticCodes: { paralysis: '8513', neuritis: '8613', neuralgia: '8713' },
  };
};

/**
 * Analyze Radial Nerve (Musculospiral) - DC 8514/8614/8714
 */

export const analyzeRadialNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.RADIAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['radn-wrist-drop', 'radn-finger-drop', 'radn-extension-weakness', 'radn-supination-weakness', 'radn-thumb-extension-loss', 'radn-grip-weakness', 'radn-muscle-atrophy'];
  const sensorySymptoms = ['radn-numbness', 'radn-tingling', 'radn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  const ratingScale = {
    complete: { major: 70, minor: 60 },
    severe: { major: 50, minor: 40 },
    moderate: { major: 30, minor: 20 },
    mild: { both: 20 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} radial nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for wrist drop - hallmark of radial nerve palsy
  const hasWristDrop = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'radn-wrist-drop'
  );
  if (hasWristDrop) {
    ratingRationale.push('Wrist drop documented - hallmark sign of radial nerve palsy');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!hasWristDrop && severity.hasMotorInvolvement) {
    gaps.push('Document presence or absence of wrist drop');
  }
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (wrist drop, extension weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
      hasWristDrop,
    },
    condition: 'Radial Nerve (Musculospiral)',
    diagnosticCodes: { paralysis: '8514', neuritis: '8614', neuralgia: '8714' },
  };
};

/**
 * Analyze Median Nerve (Carpal Tunnel) - DC 8515/8615/8715
 */

export const analyzeMedianNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.MEDIAN_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['medn-thenar-weakness', 'medn-thenar-atrophy', 'medn-grip-weakness', 'medn-dropping-objects', 'medn-opposition-weakness', 'medn-pronation-weakness', 'medn-ape-hand'];
  const sensorySymptoms = ['medn-numbness', 'medn-tingling', 'medn-pain', 'medn-night-symptoms', 'medn-trophic-changes'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  const ratingScale = {
    complete: { major: 70, minor: 60 },
    severe: { major: 50, minor: 40 },
    moderate: { major: 30, minor: 20 },
    mild: { both: 10 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} median nerve/carpal tunnel symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for thenar atrophy - sign of severe/chronic carpal tunnel
  const hasThenarAtrophy = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'medn-thenar-atrophy'
  );
  if (hasThenarAtrophy) {
    ratingRationale.push('Thenar atrophy documented - indicates severe/chronic involvement');
  }

  // Check for night symptoms - classic carpal tunnel presentation
  const hasNightSymptoms = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'medn-night-symptoms'
  );
  if (hasNightSymptoms) {
    ratingRationale.push('Night symptoms documented - classic carpal tunnel presentation');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (thenar weakness, opposition difficulty) if present');
  }
  if (!hasThenarAtrophy && severity.severityLevel === 'severe') {
    gaps.push('Document presence or absence of thenar atrophy');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain nerve conduction study to confirm carpal tunnel diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
      hasThenarAtrophy,
      hasNightSymptoms,
    },
    condition: 'Median Nerve (Carpal Tunnel)',
    diagnosticCodes: { paralysis: '8515', neuritis: '8615', neuralgia: '8715' },
  };
};

/**
 * Analyze Ulnar Nerve (Cubital Tunnel) - DC 8516/8616/8716
 */

export const analyzeUlnarNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.ULNAR_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['ulnn-grip-weakness', 'ulnn-pinch-weakness', 'ulnn-finger-spread-weakness', 'ulnn-claw-hand', 'ulnn-interossei-atrophy', 'ulnn-hypothenar-atrophy', 'ulnn-thumb-adduction-weakness', 'ulnn-wrist-flexion-weakness'];
  const sensorySymptoms = ['ulnn-numbness', 'ulnn-tingling', 'ulnn-pain', 'ulnn-elbow-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  const ratingScale = {
    complete: { major: 60, minor: 50 },
    severe: { major: 40, minor: 30 },
    moderate: { major: 30, minor: 20 },
    mild: { both: 10 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} ulnar nerve/cubital tunnel symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for claw hand - hallmark of severe ulnar palsy
  const hasClawHand = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'ulnn-claw-hand'
  );
  if (hasClawHand) {
    ratingRationale.push('Claw hand deformity documented - hallmark sign of ulnar nerve palsy');
  }

  // Check for interossei atrophy
  const hasInterosseiAtrophy = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'ulnn-interossei-atrophy'
  );
  if (hasInterosseiAtrophy) {
    ratingRationale.push('Interossei muscle atrophy documented');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (grip weakness, finger spread weakness) if present');
  }
  if (!hasClawHand && severity.severityLevel === 'severe') {
    gaps.push('Document presence or absence of claw hand deformity');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain nerve conduction study to confirm cubital tunnel diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
      hasClawHand,
      hasInterosseiAtrophy,
    },
    condition: 'Ulnar Nerve (Cubital Tunnel)',
    diagnosticCodes: { paralysis: '8516', neuritis: '8616', neuralgia: '8716' },
  };
};

/**
 * Analyze Musculocutaneous Nerve - DC 8517/8617/8717
 */

export const analyzeMusculocutaneousNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.MUSCULOCUTANEOUS_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['mscn-biceps-weakness', 'mscn-elbow-flexion-weakness', 'mscn-supination-weakness', 'mscn-muscle-atrophy'];
  const sensorySymptoms = ['mscn-numbness', 'mscn-tingling', 'mscn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Musculocutaneous has lower max ratings
  const ratingScale = {
    complete: { major: 30, minor: 20 },
    severe: { both: 20 },
    moderate: { both: 10 },
    mild: { both: 0 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} musculocutaneous nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);
  ratingRationale.push('Note: Complete paralysis does not result in total loss of elbow flexion due to compensation by other muscles');

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (biceps weakness, elbow flexion weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'Musculocutaneous Nerve',
    diagnosticCodes: { paralysis: '8517', neuritis: '8617', neuralgia: '8717' },
  };
};

/**
 * Analyze Circumflex (Axillary) Nerve - DC 8518/8618/8718
 */

export const analyzeCircumflexNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.CIRCUMFLEX_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['crcn-shoulder-abduction-weakness', 'crcn-arm-raise-difficulty', 'crcn-external-rotation-weakness', 'crcn-deltoid-weakness', 'crcn-deltoid-atrophy'];
  const sensorySymptoms = ['crcn-numbness', 'crcn-tingling', 'crcn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  const ratingScale = {
    complete: { major: 50, minor: 40 },
    severe: { major: 30, minor: 20 },
    moderate: { both: 10 },
    mild: { both: 0 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} circumflex (axillary) nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for deltoid atrophy
  const hasDeltoidAtrophy = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'crcn-deltoid-atrophy'
  );
  if (hasDeltoidAtrophy) {
    ratingRationale.push('Deltoid atrophy documented - indicates chronic/severe involvement');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (shoulder abduction weakness, deltoid weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      isWholySensory: severity.isWholySensory,
      hasDeltoidAtrophy,
    },
    condition: 'Circumflex (Axillary) Nerve',
    diagnosticCodes: { paralysis: '8518', neuritis: '8618', neuralgia: '8718' },
  };
};

/**
 * Analyze Long Thoracic Nerve - DC 8519/8619/8719
 */

export const analyzeLongThoracicNerveLogs = (logs, options = {}) => {
  const { days = 90, isMajorExtremity = true } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.LONG_THORACIC_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['ltn-winged-scapula', 'ltn-arm-elevation-difficulty', 'ltn-shoulder-weakness', 'ltn-pushing-difficulty', 'ltn-serratus-weakness'];
  const sensorySymptoms = ['ltn-pain', 'ltn-fatigue'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Long thoracic has lower max ratings
  const ratingScale = {
    complete: { major: 30, minor: 20 },
    severe: { both: 20 },
    moderate: { both: 10 },
    mild: { both: 0 },
  };

  const supportedRating = getUpperExtremityNerveRating(severity.severityLevel, isMajorExtremity, ratingScale);

  const ratingRationale = [];
  const extremityText = isMajorExtremity ? 'major (dominant)' : 'minor (non-dominant)';

  ratingRationale.push(`${relevantLogs.length} long thoracic nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Affected extremity: ${extremityText}`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for winged scapula - hallmark sign
  const hasWingedScapula = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'ltn-winged-scapula'
  );
  if (hasWingedScapula) {
    ratingRationale.push('Winged scapula documented - hallmark sign of long thoracic nerve palsy');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);
  ratingRationale.push('Note: Not to be combined with lost motion above shoulder level');

  const gaps = [];
  if (!hasWingedScapula) {
    gaps.push('Document presence or absence of winged scapula');
  }
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (difficulty raising arm above shoulder) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain clinical examination documenting scapular winging');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isMajorExtremity,
      hasWingedScapula,
    },
    condition: 'Long Thoracic Nerve',
    diagnosticCodes: { paralysis: '8519', neuritis: '8619', neuralgia: '8719' },
  };
};

// ============================================
// LOWER EXTREMITY NERVE ANALYSIS FUNCTIONS
// Note: Lower extremity nerves do NOT have major/minor distinction
// ============================================

/**
 * Analyze Sciatic Nerve - DC 8520/8620/8720
 */

export const analyzeSciaticNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.SCIATIC_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['scin-leg-weakness', 'scin-foot-drop', 'scin-knee-flexion-weakness', 'scin-muscle-atrophy', 'scin-difficulty-walking'];
  const sensorySymptoms = ['scin-radiating-pain', 'scin-numbness', 'scin-tingling', 'scin-burning', 'scin-sitting-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Sciatic nerve rating scale (no major/minor distinction for lower extremity)
  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 80;
      break;
    case 'severe':
      supportedRating = 60;
      break;
    case 'moderate': {
      // Check for "moderately severe" based on atrophy
      const hasAtrophy = relevantLogs.some(log =>
          getLogSymptomId(log).toLowerCase() === 'scin-muscle-atrophy'
      );
      supportedRating = hasAtrophy ? 40 : 20;
      break;
    }
    default:
      supportedRating = 10;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} sciatic nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for foot drop
  const hasFootDrop = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'scin-foot-drop'
  );
  if (hasFootDrop) {
    ratingRationale.push('Foot drop documented - indicates significant motor involvement');
  }

  // Check for muscle atrophy
  const hasAtrophy = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'scin-muscle-atrophy'
  );
  if (hasAtrophy) {
    ratingRationale.push('Marked muscular atrophy documented - supports higher rating');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (leg weakness, foot drop) if present');
  }
  if (!hasAtrophy && severity.severityLevel === 'severe') {
    gaps.push('Document presence or absence of muscular atrophy');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis and severity');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasFootDrop,
      hasAtrophy,
    },
    condition: 'Sciatic Nerve',
    diagnosticCodes: { paralysis: '8520', neuritis: '8620', neuralgia: '8720' },
  };
};

/**
 * Analyze Common Peroneal (External Popliteal) Nerve - DC 8521/8621/8721
 */

export const analyzeCommonPeronealNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.COMMON_PERONEAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['cpn-foot-drop', 'cpn-dorsiflexion-weakness', 'cpn-toe-extension-weakness', 'cpn-eversion-weakness', 'cpn-steppage-gait', 'cpn-tripping', 'cpn-muscle-atrophy'];
  const sensorySymptoms = ['cpn-numbness', 'cpn-tingling', 'cpn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 40;
      break;
    case 'severe':
      supportedRating = 30;
      break;
    case 'moderate':
      supportedRating = 20;
      break;
    default:
      supportedRating = 10;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} common peroneal nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for foot drop - hallmark sign
  const hasFootDrop = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'cpn-foot-drop'
  );
  if (hasFootDrop) {
    ratingRationale.push('Foot drop documented - hallmark sign of common peroneal nerve palsy');
  }

  // Check for steppage gait
  const hasSteppageGait = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'cpn-steppage-gait'
  );
  if (hasSteppageGait) {
    ratingRationale.push('Steppage gait documented - compensatory gait pattern for foot drop');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!hasFootDrop && severity.hasMotorInvolvement) {
    gaps.push('Document presence or absence of foot drop');
  }
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (foot drop, dorsiflexion weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasFootDrop,
      hasSteppageGait,
    },
    condition: 'Common Peroneal (External Popliteal) Nerve',
    diagnosticCodes: { paralysis: '8521', neuritis: '8621', neuralgia: '8721' },
  };
};

/**
 * Analyze Superficial Peroneal Nerve - DC 8522/8622/8722
 */

export const analyzeSuperficialPeronealNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.SUPERFICIAL_PERONEAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['spn-eversion-weakness', 'spn-ankle-instability', 'spn-muscle-atrophy'];
  const sensorySymptoms = ['spn-numbness', 'spn-tingling', 'spn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Superficial peroneal has lower max ratings
  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 30;
      break;
    case 'severe':
      supportedRating = 20;
      break;
    case 'moderate':
      supportedRating = 10;
      break;
    default:
      supportedRating = 0;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} superficial peroneal nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (eversion weakness, ankle instability) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
    },
    condition: 'Superficial Peroneal Nerve',
    diagnosticCodes: { paralysis: '8522', neuritis: '8622', neuralgia: '8722' },
  };
};

/**
 * Analyze Deep Peroneal (Anterior Tibial) Nerve - DC 8523/8623/8723
 */

export const analyzeDeepPeronealNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.DEEP_PERONEAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['dpn-dorsiflexion-loss', 'dpn-toe-extension-weakness', 'dpn-foot-drop', 'dpn-muscle-atrophy'];
  const sensorySymptoms = ['dpn-numbness', 'dpn-tingling', 'dpn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Deep peroneal has lower max ratings
  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 30;
      break;
    case 'severe':
      supportedRating = 20;
      break;
    case 'moderate':
      supportedRating = 10;
      break;
    default:
      supportedRating = 0;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} deep peroneal nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for dorsiflexion loss
  const hasDorsiflexionLoss = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'dpn-dorsiflexion-loss'
  );
  if (hasDorsiflexionLoss) {
    ratingRationale.push('Dorsiflexion loss documented - indicates significant motor involvement');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (dorsiflexion weakness, foot drop) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasDorsiflexionLoss,
    },
    condition: 'Deep Peroneal (Anterior Tibial) Nerve',
    diagnosticCodes: { paralysis: '8523', neuritis: '8623', neuralgia: '8723' },
  };
};

/**
 * Analyze Tibial (Internal Popliteal) Nerve - DC 8524/8624/8724
 */

export const analyzeTibialNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.TIBIAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['tibn-plantar-flexion-weakness', 'tibn-toe-flexion-weakness', 'tibn-foot-inversion-weakness', 'tibn-calf-weakness', 'tibn-difficulty-walking-tiptoe', 'tibn-muscle-atrophy'];
  const sensorySymptoms = ['tibn-numbness', 'tibn-tingling', 'tibn-burning'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 40;
      break;
    case 'severe':
      supportedRating = 30;
      break;
    case 'moderate':
      supportedRating = 20;
      break;
    default:
      supportedRating = 10;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} tibial nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for plantar flexion weakness
  const hasPlantarFlexionWeakness = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'tibn-plantar-flexion-weakness'
  );
  if (hasPlantarFlexionWeakness) {
    ratingRationale.push('Plantar flexion weakness documented');
  }

  // Check for difficulty walking on tiptoe
  const hasTiptoeWalkingDifficulty = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'tibn-difficulty-walking-tiptoe'
  );
  if (hasTiptoeWalkingDifficulty) {
    ratingRationale.push('Difficulty walking on tiptoe documented - indicates significant calf weakness');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (plantar flexion weakness, calf weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasPlantarFlexionWeakness,
      hasTiptoeWalkingDifficulty,
    },
    condition: 'Tibial (Internal Popliteal) Nerve',
    diagnosticCodes: { paralysis: '8524', neuritis: '8624', neuralgia: '8724' },
  };
};

/**
 * Analyze Posterior Tibial Nerve - DC 8525/8625/8725
 */

export const analyzePosteriorTibialNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.POSTERIOR_TIBIAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['ptn-sole-paralysis', 'ptn-toe-flexion-weakness', 'ptn-foot-adduction-weakness', 'ptn-muscle-atrophy'];
  const sensorySymptoms = ['ptn-numbness', 'ptn-tingling', 'ptn-burning', 'ptn-tarsal-tunnel'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Posterior tibial has lower max ratings
  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 30;
      break;
    case 'severe':
      supportedRating = 20;
      break;
    default:
      supportedRating = 10; // Moderate and mild both rate 10%
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} posterior tibial nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for tarsal tunnel symptoms
  const hasTarsalTunnel = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'ptn-tarsal-tunnel'
  );
  if (hasTarsalTunnel) {
    ratingRationale.push('Tarsal tunnel syndrome symptoms documented');
  }

  // Check for burning pain (causalgic)
  const hasBurningPain = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'ptn-burning'
  );
  if (hasBurningPain) {
    ratingRationale.push('Burning (causalgic) pain documented - common with posterior tibial nerve injury');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (sole weakness, toe flexion weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasTarsalTunnel,
      hasBurningPain,
    },
    condition: 'Posterior Tibial Nerve',
    diagnosticCodes: { paralysis: '8525', neuritis: '8625', neuralgia: '8725' },
  };
};

/**
 * Analyze Femoral (Anterior Crural) Nerve - DC 8526/8626/8726
 */

export const analyzeFemoralNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.FEMORAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['femn-quadriceps-weakness', 'femn-knee-extension-weakness', 'femn-knee-buckling', 'femn-difficulty-stairs', 'femn-difficulty-rising', 'femn-muscle-atrophy'];
  const sensorySymptoms = ['femn-numbness', 'femn-tingling', 'femn-pain'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  let supportedRating = 0;
  switch (severity.severityLevel) {
    case 'complete':
      supportedRating = 40;
      break;
    case 'severe':
      supportedRating = 30;
      break;
    case 'moderate':
      supportedRating = 20;
      break;
    default:
      supportedRating = 10;
  }

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} femoral nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel} incomplete paralysis`);

  // Check for knee buckling
  const hasKneeBuckling = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'femn-knee-buckling'
  );
  if (hasKneeBuckling) {
    ratingRationale.push('Knee buckling/giving way documented - indicates significant quadriceps weakness');
  }

  // Check for difficulty with stairs
  const hasDifficultyStairs = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'femn-difficulty-stairs'
  );
  if (hasDifficultyStairs) {
    ratingRationale.push('Difficulty with stairs documented - functional impact of quadriceps weakness');
  }

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  if (severity.isWholySensory) {
    ratingRationale.push('Involvement is wholly sensory - rating limited to moderate per 38 CFR 4.124a');
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (quadriceps weakness, knee buckling) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
      isWholySensory: severity.isWholySensory,
      hasKneeBuckling,
      hasDifficultyStairs,
    },
    condition: 'Femoral (Anterior Crural) Nerve',
    diagnosticCodes: { paralysis: '8526', neuritis: '8626', neuralgia: '8726' },
  };
};

/**
 * Analyze Saphenous (Internal Saphenous) Nerve - DC 8527/8627/8727
 * Note: Purely sensory nerve - max rating is 10%
 */

export const analyzeSaphenousNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.SAPHENOUS_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  // Saphenous is purely sensory
  const sensorySymptoms = ['sapn-numbness', 'sapn-tingling', 'sapn-pain', 'sapn-burning', 'sapn-hypersensitivity'];

  const severityScores = relevantLogs
  .map(log => log.severity)
  .filter(s => s !== undefined && s !== null);
  const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length
      : 0;

  // Max rating is 10% for this purely sensory nerve
  const supportedRating = avgSeverity >= 5 || relevantLogs.length >= 5 ? 10 : 0;

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} saphenous nerve symptoms logged in ${days} days`);
  ratingRationale.push('Saphenous nerve is purely sensory - no motor function');
  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  if (supportedRating === 10) {
    ratingRationale.push('Severe to complete involvement - 10% rating (maximum for this nerve)');
  } else {
    ratingRationale.push('Mild to moderate involvement - 0% rating');
  }

  const gaps = [];
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Document distribution of sensory loss (medial leg from knee to ankle)');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: avgSeverity.toFixed(1),
      isPurelySensory: true,
    },
    condition: 'Saphenous (Internal Saphenous) Nerve',
    diagnosticCodes: { paralysis: '8527', neuritis: '8627', neuralgia: '8727' },
  };
};

/**
 * Analyze Obturator Nerve - DC 8528/8628/8728
 */

export const analyzeObturatorNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.OBTURATOR_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  const motorSymptoms = ['obtn-thigh-adduction-weakness', 'obtn-gait-instability', 'obtn-muscle-atrophy'];
  const sensorySymptoms = ['obtn-groin-pain', 'obtn-medial-thigh-pain', 'obtn-numbness', 'obtn-tingling'];

  const severity = determineNerveSeverity(relevantLogs, motorSymptoms, sensorySymptoms, []);

  // Max rating is 10% for obturator nerve
  const supportedRating = (severity.severityLevel === 'complete' || severity.severityLevel === 'severe') ? 10 : 0;

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} obturator nerve symptoms logged in ${days} days`);
  ratingRationale.push(`Severity level: ${severity.severityLevel}`);

  if (severity.hasMotorInvolvement) {
    ratingRationale.push(`Motor involvement documented (${severity.motorLogCount} motor symptoms)`);
  }
  ratingRationale.push(`Average symptom severity: ${severity.avgSeverity}/10`);

  if (supportedRating === 10) {
    ratingRationale.push('Severe to complete involvement - 10% rating (maximum for this nerve)');
  } else {
    ratingRationale.push('Mild to moderate involvement - 0% rating');
  }

  const gaps = [];
  if (!severity.hasMotorInvolvement) {
    gaps.push('Document motor deficits (thigh adduction weakness) if present');
  }
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Obtain EMG/nerve conduction study to confirm diagnosis');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      motorLogs: severity.motorLogCount,
      sensoryLogs: severity.sensoryLogCount,
      avgSeverity: severity.avgSeverity,
      severityLevel: severity.severityLevel,
    },
    condition: 'Obturator Nerve',
    diagnosticCodes: { paralysis: '8528', neuritis: '8628', neuralgia: '8728' },
  };
};

/**
 * Analyze Lateral Femoral Cutaneous Nerve (Meralgia Paresthetica) - DC 8529/8629/8729
 * Note: Purely sensory nerve - max rating is 10%
 */

export const analyzeLateralFemoralCutaneousNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.LATERAL_FEMORAL_CUTANEOUS_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  // Purely sensory nerve
  const sensorySymptoms = ['lfcn-numbness', 'lfcn-tingling', 'lfcn-burning', 'lfcn-hypersensitivity', 'lfcn-pain-standing', 'lfcn-pain-walking'];

  const severityScores = relevantLogs
  .map(log => log.severity)
  .filter(s => s !== undefined && s !== null);
  const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length
      : 0;

  // Max rating is 10% for this purely sensory nerve
  const supportedRating = avgSeverity >= 5 || relevantLogs.length >= 5 ? 10 : 0;

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} lateral femoral cutaneous nerve (meralgia paresthetica) symptoms logged in ${days} days`);
  ratingRationale.push('Lateral femoral cutaneous nerve is purely sensory - no motor function');
  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Check for burning pain - classic meralgia paresthetica
  const hasBurningPain = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'lfcn-burning'
  );
  if (hasBurningPain) {
    ratingRationale.push('Burning pain documented - classic meralgia paresthetica presentation');
  }

  if (supportedRating === 10) {
    ratingRationale.push('Severe to complete involvement - 10% rating (maximum for this nerve)');
  } else {
    ratingRationale.push('Mild to moderate involvement - 0% rating');
  }

  const gaps = [];
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Document distribution of sensory loss (lateral/outer thigh)');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: avgSeverity.toFixed(1),
      isPurelySensory: true,
      hasBurningPain,
    },
    condition: 'Lateral Femoral Cutaneous Nerve (Meralgia Paresthetica)',
    diagnosticCodes: { paralysis: '8529', neuritis: '8629', neuralgia: '8729' },
  };
};

/**
 * Analyze Ilio-inguinal Nerve - DC 8530/8630/8730
 * Note: Primarily sensory nerve - max rating is 10%
 */

export const analyzeIlioinguinalNerveLogs = (logs, options = {}) => {
  const { days = 90 } = options;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const symptomIds = NEUROLOGICAL_CONDITIONS.ILIOINGUINAL_NERVE.symptomIds;
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate && symptomIds.some(id =>
        getLogSymptomId(log).toLowerCase() === id.toLowerCase()
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, supportedRating: null, ratingRationale: [], gaps: [], metrics: {} };
  }

  // Primarily sensory nerve
  const sensorySymptoms = ['iin-groin-numbness', 'iin-genital-numbness', 'iin-inner-thigh-numbness', 'iin-groin-pain', 'iin-burning', 'iin-hypersensitivity', 'iin-pain-movement'];

  const severityScores = relevantLogs
  .map(log => log.severity)
  .filter(s => s !== undefined && s !== null);
  const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length
      : 0;

  // Max rating is 10% for this primarily sensory nerve
  const supportedRating = avgSeverity >= 5 || relevantLogs.length >= 5 ? 10 : 0;

  const ratingRationale = [];
  ratingRationale.push(`${relevantLogs.length} ilio-inguinal nerve symptoms logged in ${days} days`);
  ratingRationale.push('Ilio-inguinal nerve is primarily sensory');
  ratingRationale.push(`Average symptom severity: ${avgSeverity.toFixed(1)}/10`);

  // Check for pain with movement
  const hasPainWithMovement = relevantLogs.some(log =>
      getLogSymptomId(log).toLowerCase() === 'iin-pain-movement'
  );
  if (hasPainWithMovement) {
    ratingRationale.push('Pain with movement/coughing documented - common post-surgical finding');
  }

  if (supportedRating === 10) {
    ratingRationale.push('Severe to complete involvement - 10% rating (maximum for this nerve)');
  } else {
    ratingRationale.push('Mild to moderate involvement - 0% rating');
  }

  const gaps = [];
  if (relevantLogs.length < 5) {
    gaps.push('Continue logging symptoms regularly to establish pattern');
  }
  gaps.push('Document distribution of sensory loss (groin, upper medial thigh, genital area)');

  return {
    hasData: true,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity: avgSeverity.toFixed(1),
      isPurelySensory: true,
      hasPainWithMovement,
    },
    condition: 'Ilio-inguinal Nerve',
    diagnosticCodes: { paralysis: '8530', neuritis: '8630', neuralgia: '8730' },
  };
};

// WEAK FOOT ANALYSIS FUNCTION (DC 5277)

export const analyzeWeakFootLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.WEAK_FOOT.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: 'Weak Foot', diagnosticCode: '5277' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const atrophyCount = relevantLogs.filter(l => getLogSymptomId(l) === 'wf-muscle-atrophy').length;
  const circulationCount = relevantLogs.filter(l => getLogSymptomId(l) === 'wf-circulation-problems').length;
  const weaknessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'wf-weakness').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'wf-functional-loss').length;

  // Check for bilateral indicators in notes
  const bilateralMentions = relevantLogs.filter(l =>
      l.notes?.toLowerCase().includes('bilateral') ||
      l.notes?.toLowerCase().includes('both feet') ||
      l.notes?.toLowerCase().includes('both sides')
  ).length;

  // DC 5277 provides 10% for bilateral weak foot
  let supportedRating = 10;
  const ratingRationale = [];
  const gaps = [];

  if (bilateralMentions > 0) {
    ratingRationale.push(`Bilateral involvement documented in ${bilateralMentions} log(s)`);
  } else {
    gaps.push('Document bilateral (both feet) involvement - DC 5277 requires bilateral condition');
  }

  if (atrophyCount > 0) {
    ratingRationale.push(`Muscle atrophy documented ${atrophyCount} time(s)`);
  } else {
    gaps.push('Document muscle atrophy in feet');
  }

  if (circulationCount > 0) {
    ratingRationale.push(`Circulation problems noted ${circulationCount} time(s)`);
  } else {
    gaps.push('Document disturbed circulation (cold feet, color changes)');
  }

  if (weaknessCount > 0) {
    ratingRationale.push(`Foot weakness logged ${weaknessCount} time(s)`);
  }

  if (functionalLossCount > 0) {
    ratingRationale.push(`Functional loss documented ${functionalLossCount} time(s)`);
  }

  ratingRationale.push(`${totalLogs} total symptoms logged over evaluation period`);
  ratingRationale.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  gaps.push('Identify and document underlying constitutional condition');

  return {
    hasData: true,
    condition: 'Weak Foot (Bilateral)',
    diagnosticCode: '5277',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      atrophyCount,
      circulationCount,
      weaknessCount,
      functionalLossCount,
      bilateralMentions,
    },
    criteria: WEAK_FOOT_CRITERIA,
  };
};

// CLAW FOOT (PES CAVUS) ANALYSIS FUNCTION (DC 5278)

export const analyzeClawFootLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.CLAW_FOOT.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: 'Claw Foot (Pes Cavus)', diagnosticCode: '5278' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const hammerToesCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-hammer-toes').length;
  const callositiesCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-callosities').length;
  const varusCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-varus-deformity').length;
  const droppedForefootCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-dropped-forefoot').length;
  const ankleLimitedCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-ankle-dorsiflexion-limited').length;
  const metatarsalTendernessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-metatarsal-tenderness').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'cf-functional-loss').length;

  // Check for bilateral
  const bilateralMentions = relevantLogs.filter(l =>
      l.notes?.toLowerCase().includes('bilateral') ||
      l.notes?.toLowerCase().includes('both feet')
  ).length;
  const isBilateral = bilateralMentions > 0;

  // Determine severity indicators
  const hasSevereFeatures = hammerToesCount > 0 && callositiesCount > 0 && varusCount > 0 && droppedForefootCount > 0;
  const hasModerateFeatures = ankleLimitedCount > 0 && metatarsalTendernessCount > 0;

  // Determine rating
  let supportedRating = 10; // Base rating
  const ratingRationale = [];
  const gaps = [];

  if (hasSevereFeatures && isBilateral) {
    supportedRating = 50;
    ratingRationale.push('Severe bilateral claw foot with hammer toes, callosities, varus deformity, and dropped forefoot');
  } else if (hasSevereFeatures && !isBilateral) {
    supportedRating = 30;
    ratingRationale.push('Severe unilateral claw foot with hammer toes, callosities, varus deformity, and dropped forefoot');
  } else if (hasModerateFeatures && isBilateral) {
    supportedRating = 30;
    ratingRationale.push('Bilateral claw foot with ankle limitation and metatarsal tenderness');
  } else if (hasModerateFeatures && !isBilateral) {
    supportedRating = 20;
    ratingRationale.push('Unilateral claw foot with ankle limitation and metatarsal tenderness');
  } else if (isBilateral) {
    supportedRating = 10;
    ratingRationale.push('Bilateral claw foot with basic findings');
  } else {
    supportedRating = 10;
    ratingRationale.push('Unilateral claw foot with basic findings');
  }

  ratingRationale.push(`${totalLogs} total symptoms logged`);
  ratingRationale.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  if (!isBilateral) {
    gaps.push('Document if condition affects both feet (bilateral = higher rating)');
  }
  if (hammerToesCount === 0) {
    gaps.push('Document hammer toe deformity if present');
  }
  if (callositiesCount === 0) {
    gaps.push('Document painful callosities if present');
  }
  if (varusCount === 0) {
    gaps.push('Document varus (heel inward tilting) if present');
  }

  return {
    hasData: true,
    condition: 'Claw Foot (Pes Cavus)',
    diagnosticCode: '5278',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      hammerToesCount,
      callositiesCount,
      varusCount,
      droppedForefootCount,
      ankleLimitedCount,
      metatarsalTendernessCount,
      functionalLossCount,
      isBilateral,
    },
    criteria: CLAW_FOOT_CRITERIA,
  };
};

// METATARSALGIA ANALYSIS FUNCTION (DC 5279)

export const analyzeMetatarsalgiaLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.METATARSALGIA.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: "Metatarsalgia (Morton's Disease)", diagnosticCode: '5279' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const ballFootPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-ball-foot-pain').length;
  const numbnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-numbness-toes').length;
  const burningCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-burning').length;
  const shootingPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-shooting-pain').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-functional-loss').length;

  // DC 5279 only provides 10% rating
  const supportedRating = 10;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push('DC 5279 provides 10% rating for metatarsalgia (unilateral or bilateral)');
  ratingRationale.push(`${totalLogs} total symptoms logged over evaluation period`);
  ratingRationale.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  if (ballFootPainCount > 0) {
    ratingRationale.push(`Ball of foot pain documented ${ballFootPainCount} time(s)`);
  }
  if (shootingPainCount > 0) {
    ratingRationale.push(`Shooting pain (Morton neuroma indicator) logged ${shootingPainCount} time(s)`);
  }

  if (avgSeverity >= 7) {
    gaps.push('Severe symptoms may warrant extraschedular consideration - discuss with VSO');
  }
  if (functionalLossCount === 0) {
    gaps.push('Document functional limitations (walking, standing restrictions)');
  }

  return {
    hasData: true,
    condition: "Metatarsalgia (Morton's Disease)",
    diagnosticCode: '5279',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      ballFootPainCount,
      numbnessCount,
      burningCount,
      shootingPainCount,
      functionalLossCount,
    },
    criteria: METATARSALGIA_CRITERIA,
  };
};

// HALLUX VALGUS ANALYSIS FUNCTION (DC 5280)

export const analyzeHalluxValgusLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.HALLUX_VALGUS.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: 'Hallux Valgus (Bunion)', diagnosticCode: '5280' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const bunionPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hv-bunion-pain').length;
  const deformityCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hv-deformity').length;
  const postSurgicalCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hv-post-surgical').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hv-functional-loss').length;
  const limitedMotionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hv-limited-motion').length;

  // Check for surgical history or severe functional loss
  const hasSurgery = postSurgicalCount > 0 || relevantLogs.some(l =>
      l.notes?.toLowerCase().includes('surgery') ||
      l.notes?.toLowerCase().includes('bunionectomy') ||
      l.notes?.toLowerCase().includes('resection')
  );
  const isSevere = avgSeverity >= 7 && (functionalLossCount > 0 || limitedMotionCount > 2);

  // Determine rating
  let supportedRating = 0;
  const ratingRationale = [];
  const gaps = [];

  if (hasSurgery) {
    supportedRating = 10;
    ratingRationale.push('Operated hallux valgus with metatarsal head resection');
  } else if (isSevere) {
    supportedRating = 10;
    ratingRationale.push('Severe hallux valgus equivalent to functional amputation of great toe');
    ratingRationale.push(`High average severity: ${avgSeverity.toFixed(1)}/10`);
  } else {
    supportedRating = 0;
    ratingRationale.push('Hallux valgus present but does not meet criteria for 10% rating');
    ratingRationale.push('Requires surgery with resection OR severity equivalent to great toe amputation');
  }

  ratingRationale.push(`${totalLogs} total symptoms logged`);

  if (!hasSurgery && !isSevere) {
    gaps.push('Document surgical history if bunionectomy performed');
    gaps.push('Document severe functional loss equivalent to great toe amputation');
  }
  if (functionalLossCount === 0) {
    gaps.push('Document functional limitations from bunion');
  }

  // Check for bilateral
  const bilateralMentions = relevantLogs.filter(l =>
      l.notes?.toLowerCase().includes('bilateral') ||
      l.notes?.toLowerCase().includes('both feet')
  ).length;
  if (bilateralMentions > 0) {
    ratingRationale.push('Note: Each foot can be rated separately if bilateral');
  }

  return {
    hasData: true,
    condition: 'Hallux Valgus (Bunion)',
    diagnosticCode: '5280',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      bunionPainCount,
      deformityCount,
      postSurgicalCount,
      functionalLossCount,
      limitedMotionCount,
      hasSurgery,
      isSevere,
    },
    criteria: HALLUX_VALGUS_CRITERIA,
  };
};

// HALLUX RIGIDUS ANALYSIS FUNCTION (DC 5281)

export const analyzeHalluxRigidusLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.HALLUX_RIGIDUS.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: 'Hallux Rigidus', diagnosticCode: '5281' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const stiffnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-toe-stiffness').length;
  const painCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-toe-pain').length;
  const limitedMotionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-limited-motion').length;
  const boneSpurCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-bone-spur').length;
  const grindingCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-grinding').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'hr-functional-loss').length;

  // Severe hallux rigidus gets 10%
  const isSevere = avgSeverity >= 6 || limitedMotionCount >= 2 || functionalLossCount > 0;

  let supportedRating = 0;
  const ratingRationale = [];
  const gaps = [];

  if (isSevere) {
    supportedRating = 10;
    ratingRationale.push('Severe hallux rigidus - rated as severe hallux valgus per DC 5281');
    if (limitedMotionCount > 0) {
      ratingRationale.push(`Limited big toe motion documented ${limitedMotionCount} time(s)`);
    }
    if (functionalLossCount > 0) {
      ratingRationale.push(`Functional loss documented ${functionalLossCount} time(s)`);
    }
  } else {
    supportedRating = 0;
    ratingRationale.push('Hallux rigidus present but not meeting severe criteria');
  }

  ratingRationale.push(`${totalLogs} total symptoms logged`);
  ratingRationale.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  if (stiffnessCount > 0) {
    ratingRationale.push(`Big toe stiffness logged ${stiffnessCount} time(s)`);
  }

  if (!isSevere) {
    gaps.push('Document severity of limited motion (requires severe for 10% rating)');
  }
  if (limitedMotionCount === 0) {
    gaps.push('Document limited dorsiflexion of big toe');
  }
  if (boneSpurCount === 0) {
    gaps.push('Document bone spur if present on examination/X-ray');
  }

  return {
    hasData: true,
    condition: 'Hallux Rigidus',
    diagnosticCode: '5281',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      stiffnessCount,
      painCount,
      limitedMotionCount,
      boneSpurCount,
      grindingCount,
      functionalLossCount,
      isSevere,
    },
    criteria: HALLUX_RIGIDUS_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - LOSS OF SMELL (DC 6275)
// ============================================

/**
 * Analyzes loss of smell (anosmia) logs to determine supported rating level
 * DC 6275 - Complete loss of sense of smell = 10%
 */

export const analyzeLossOfSmellLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.LOSS_OF_SMELL.symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Loss of Smell (Anosmia)',
      diagnosticCode: '6275',
      message: 'No smell-related logs found in the evaluation period',
      supportedRating: null,
      rationale: [],
      evidenceGaps: ['Start logging smell-related symptoms to build your evidence'],
    };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const completeLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-complete-loss').length;
  const partialLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-partial-loss').length;
  const distortedCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-distorted').length;
  const phantomCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-phantom').length;
  const safetyCount = relevantLogs.filter(l =>
      ['smell-gas-detection', 'smell-smoke-detection', 'smell-food-spoilage', 'smell-safety-concern'].includes(getLogSymptomId(l))
  ).length;
  const chronicCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-chronic').length;
  const testingCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-testing-performed').length;
  const noImprovementCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-no-improvement').length;

  // Check for underlying causes
  const postCovidCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-post-covid').length;
  const postTbiCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-post-tbi').length;
  const postViralCount = relevantLogs.filter(l => getLogSymptomId(l) === 'smell-post-viral').length;

  // Determine if complete loss is documented
  const hasCompleteLoss = completeLossCount > 0;
  const hasChronicCondition = chronicCount > 0 || noImprovementCount > 0;
  const hasDiagnosedCause = postCovidCount > 0 || postTbiCount > 0 || postViralCount > 0;
  const hasDocumentedTesting = testingCount > 0;

  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // 10% - Complete loss with diagnosed cause
  if (hasCompleteLoss && hasChronicCondition) {
    supportedRating = 10;
    rationale.push('Complete loss of smell (anosmia) documented');
    rationale.push('Chronic/permanent condition documented');

    if (hasDiagnosedCause) {
      if (postCovidCount > 0) rationale.push('Post-COVID anosmia documented');
      if (postTbiCount > 0) rationale.push('Post-TBI anosmia documented');
      if (postViralCount > 0) rationale.push('Post-viral anosmia documented');
    }
  } else if (hasCompleteLoss) {
    supportedRating = 10;
    rationale.push('Complete loss of smell documented');
    rationale.push('Note: Ensure permanence is documented for rating confirmation');
  } else if (partialLossCount > 0 || distortedCount > 0) {
    supportedRating = 0;
    rationale.push('Partial loss or distorted smell documented');
    rationale.push('Complete loss required for 10% rating');
  }

  // Add context
  rationale.push(`${totalLogs} total smell-related symptoms logged over evaluation period`);
  if (avgSeverity >= 7) {
    rationale.push(`Average severity ${avgSeverity.toFixed(1)}/10 indicates significant impairment`);
  }
  if (safetyCount > 0) {
    rationale.push(`${safetyCount} safety-related concerns documented (gas, smoke, spoiled food detection)`);
  }

  // Identify gaps
  if (!hasCompleteLoss && partialLossCount > 0) {
    evidenceGaps.push('Document whether loss is complete (anosmia) vs partial (hyposmia)');
  }
  if (!hasDocumentedTesting) {
    evidenceGaps.push('Request formal smell testing (UPSIT or equivalent) from ENT/neurologist');
  }
  if (!hasDiagnosedCause) {
    evidenceGaps.push('Document underlying cause (TBI, COVID-19, sinusitis, etc.)');
  }
  if (!hasChronicCondition && hasCompleteLoss) {
    evidenceGaps.push('Document that condition is chronic/permanent for rating confirmation');
  }
  if (safetyCount === 0) {
    evidenceGaps.push('Document specific safety impacts (inability to smell gas leaks, smoke, spoiled food)');
  }

  return {
    hasData: true,
    condition: 'Loss of Smell (Anosmia)',
    diagnosticCode: '6275',
    cfrReference: '38 CFR 4.87a',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      avgSeverity,
      completeLossCount,
      partialLossCount,
      distortedCount,
      phantomCount,
      safetyCount,
      chronicCount,
      testingCount,
      noImprovementCount,
      postCovidCount,
      postTbiCount,
      postViralCount,
      hasCompleteLoss,
      hasChronicCondition,
      hasDiagnosedCause,
    },
    criteria: LOSS_OF_SMELL_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - LOSS OF TASTE (DC 6276)
// ============================================

/**
 * Analyzes loss of taste (ageusia) logs to determine supported rating level
 * DC 6276 - Complete loss of sense of taste = 10%
 */

export const analyzeLossOfTasteLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && NEUROLOGICAL_CONDITIONS.LOSS_OF_TASTE.symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Loss of Taste (Ageusia)',
      diagnosticCode: '6276',
      message: 'No taste-related logs found in the evaluation period',
      supportedRating: null,
      rationale: [],
      evidenceGaps: ['Start logging taste-related symptoms to build your evidence'],
    };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const completeLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-complete-loss').length;
  const partialLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-partial-loss').length;
  const distortedCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-distorted').length;
  const metallicCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-metallic').length;
  const phantomCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-phantom').length;

  // Individual taste losses
  const sweetLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-sweet-loss').length;
  const saltyLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-salty-loss').length;
  const sourLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-sour-loss').length;
  const bitterLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-bitter-loss').length;
  const umamiLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-umami-loss').length;

  // Functional impacts
  const appetiteCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-appetite-affected').length;
  const weightChangeCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-weight-change').length;
  const qualityOfLifeCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-quality-of-life').length;

  // Chronicity
  const chronicCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-chronic').length;
  const testingCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-testing-performed').length;
  const noImprovementCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-no-improvement').length;

  // Causes
  const postCovidCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-post-covid').length;
  const postViralCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-post-viral').length;
  const medicationCount = relevantLogs.filter(l => getLogSymptomId(l) === 'taste-medication-related').length;

  // Count all basic tastes affected
  const tastesAffected = [sweetLossCount, saltyLossCount, sourLossCount, bitterLossCount, umamiLossCount].filter(c => c > 0).length;

  // Determine if complete loss is documented
  const hasCompleteLoss = completeLossCount > 0 || tastesAffected >= 4;
  const hasChronicCondition = chronicCount > 0 || noImprovementCount > 0;
  const hasDiagnosedCause = postCovidCount > 0 || postViralCount > 0 || medicationCount > 0;
  const hasDocumentedTesting = testingCount > 0;
  const hasFunctionalImpact = appetiteCount > 0 || weightChangeCount > 0 || qualityOfLifeCount > 0;

  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // 10% - Complete loss with diagnosed cause
  if (hasCompleteLoss && hasChronicCondition) {
    supportedRating = 10;
    rationale.push('Complete loss of taste (ageusia) documented');
    rationale.push('Chronic/permanent condition documented');

    if (hasDiagnosedCause) {
      if (postCovidCount > 0) rationale.push('Post-COVID ageusia documented');
      if (postViralCount > 0) rationale.push('Post-viral ageusia documented');
      if (medicationCount > 0) rationale.push('Medication-related ageusia documented');
    }
  } else if (hasCompleteLoss) {
    supportedRating = 10;
    rationale.push('Complete loss of taste documented');
    rationale.push('Note: Ensure permanence is documented for rating confirmation');
  } else if (tastesAffected >= 3) {
    supportedRating = 0;
    rationale.push(`Loss of ${tastesAffected} of 5 basic tastes documented - approaching complete loss`);
    rationale.push('Complete loss required for 10% rating');
  } else if (partialLossCount > 0 || distortedCount > 0) {
    supportedRating = 0;
    rationale.push('Partial loss or distorted taste documented');
    rationale.push('Complete loss required for 10% rating');
  }

  // Add context
  rationale.push(`${totalLogs} total taste-related symptoms logged over evaluation period`);
  if (avgSeverity >= 7) {
    rationale.push(`Average severity ${avgSeverity.toFixed(1)}/10 indicates significant impairment`);
  }
  if (hasFunctionalImpact) {
    rationale.push('Functional impact documented (appetite, weight, quality of life)');
  }
  if (tastesAffected > 0) {
    rationale.push(`${tastesAffected} of 5 basic tastes affected (sweet, salty, sour, bitter, umami)`);
  }

  // Identify gaps
  if (!hasCompleteLoss && partialLossCount > 0) {
    evidenceGaps.push('Document whether loss is complete (ageusia) vs partial (hypogeusia)');
  }
  if (!hasDocumentedTesting) {
    evidenceGaps.push('Request formal taste testing from ENT/neurologist');
  }
  if (!hasDiagnosedCause) {
    evidenceGaps.push('Document underlying cause (COVID-19, medication, nerve damage, etc.)');
  }
  if (!hasChronicCondition && hasCompleteLoss) {
    evidenceGaps.push('Document that condition is chronic/permanent for rating confirmation');
  }
  if (!hasFunctionalImpact) {
    evidenceGaps.push('Document functional impacts: appetite changes, weight loss, reduced quality of life');
  }
  if (tastesAffected < 5 && tastesAffected > 0) {
    evidenceGaps.push('Document which specific tastes are affected (sweet, salty, sour, bitter, umami)');
  }

  return {
    hasData: true,
    condition: 'Loss of Taste (Ageusia)',
    diagnosticCode: '6276',
    cfrReference: '38 CFR 4.87a',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      avgSeverity,
      completeLossCount,
      partialLossCount,
      distortedCount,
      metallicCount,
      phantomCount,
      tastesAffected,
      sweetLossCount,
      saltyLossCount,
      sourLossCount,
      bitterLossCount,
      umamiLossCount,
      appetiteCount,
      weightChangeCount,
      qualityOfLifeCount,
      chronicCount,
      testingCount,
      noImprovementCount,
      postCovidCount,
      postViralCount,
      medicationCount,
      hasCompleteLoss,
      hasChronicCondition,
      hasDiagnosedCause,
      hasFunctionalImpact,
    },
    criteria: LOSS_OF_TASTE_CRITERIA,
  };
};