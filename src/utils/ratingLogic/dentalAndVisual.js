/* eslint-disable no-unused-vars */

// ============================================
// DENTAL, VISUAL, AND EAR RATING LOGIC
// ============================================
// Extracted from ratingCriteria.js — Phase 9 of the modular refactor
// Covers 38 CFR Part 4, §§ 4.75-4.84 (Eye), 4.85-4.87 (Ear), 4.150 (Dental)
//
// Dental/Oral: DC 9900, 9903-9905, 9913, 9916-9918
// Ear:         DC 6100, 6200-6201, 6204-6205, 6210
// Eye/Vision:  DC 6000-6002, 6018, 6062, 6066-6067, 6061-6079, General Eye Formula

// ============================================
// SHARED HELPERS
// ============================================

const getLogSymptomId = (log) => log.symptomId || log.symptom || null;

const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

const countEyeTreatmentVisits = (logs, prefix) => {
  let visitCount = 0;
  const treatmentVisitLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomId === `${prefix}-treatment-visit`;
  });
  visitCount += treatmentVisitLogs.length;
  const hasEpisodes7plus = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-7plus`);
  const hasEpisodes5to6  = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-5to6`);
  const hasEpisodes3to4  = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-3to4`);
  const hasEpisodes1to2  = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-1to2`);
  if (hasEpisodes7plus) return Math.max(visitCount, 7);
  if (hasEpisodes5to6)  return Math.max(visitCount, 5);
  if (hasEpisodes3to4)  return Math.max(visitCount, 3);
  if (hasEpisodes1to2)  return Math.max(visitCount, 1);
  return visitCount;
};

const getEyeRatingFromVisits = (visitCount) => {
  if (visitCount >= 7) return 60;
  if (visitCount >= 5) return 40;
  if (visitCount >= 3) return 20;
  if (visitCount >= 1) return 10;
  return 0;
};

// ============================================
// CONDITION REGISTRY
// ============================================

export const DENTAL_VISUAL_CONDITIONS = {
  MENIERES: {
    id: 'menieres', name: "Meniere's Disease", diagnosticCode: '6205', cfrReference: '38 CFR 4.85',
    symptomIds: ['menieres-vertigo', 'menieres-tinnitus', 'menieres-hearing-loss', 'menieres-nausea'],
  },
  TMJ: {
    id: 'tmj', name: 'TMJ Disorder', diagnosticCode: '9905', cfrReference: '38 CFR 4.150',
    symptomIds: ['tmj-pain', 'tmj-clicking', 'tmj-limited-opening', 'tmj-locking', 'tmj-headache'],
  },
  HEARING_LOSS: {
    id: 'hearing-loss', name: 'Hearing Loss', diagnosticCode: '6100', cfrReference: '38 CFR 4.85',
    symptomIds: ['hearing-loss-noticed'],
  },
  TOOTH_LOSS: {
    id: 'tooth-loss', name: 'Loss of Teeth Due to Bone Loss', diagnosticCode: '9913', cfrReference: '38 CFR 4.150',
    symptomIds: ['tooth-loss-pain', 'tooth-sensitivity', 'jaw-pain', 'jaw-swelling', 'bite-problems'],
  },
  MANDIBLE_NONUNION: {
    id: 'mandible-nonunion', name: 'Mandible Nonunion', diagnosticCode: '9903', cfrReference: '38 CFR 4.150',
    symptomIds: ['jaw-pain', 'jaw-instability', 'jaw-deviation', 'bone-pain-jaw'],
  },
  MALIGNANT_ORAL_NEOPLASM: {
    id: 'malignant-oral-neoplasm', name: 'Malignant Neoplasm of Oral Cavity', diagnosticCode: '9918', cfrReference: '38 CFR 4.150',
    symptomIds: ['oral-mass', 'jaw-infection', 'jaw-drainage', 'bone-pain-jaw'],
  },
  BENIGN_ORAL_NEOPLASM: {
    id: 'benign-oral-neoplasm', name: 'Benign Neoplasm of Oral Cavity', diagnosticCode: '9917', cfrReference: '38 CFR 4.150',
    symptomIds: ['oral-mass', 'jaw-swelling', 'jaw-stiffness'],
  },
  UVEITIS: {
    id: 'uveitis', name: 'Uveitis / Choroidopathy', diagnosticCode: '6000', cfrReference: '38 CFR 4.79',
    symptomIds: [
      'uveitis-eye-pain', 'uveitis-redness', 'uveitis-light-sensitivity', 'uveitis-floaters',
      'uveitis-blurred-vision', 'uveitis-anterior', 'uveitis-intermediate', 'uveitis-posterior',
      'uveitis-panuveitis', 'uveitis-unilateral', 'uveitis-bilateral',
      'uveitis-treatment-visit', 'uveitis-episodes-1to2', 'uveitis-episodes-3to4',
      'uveitis-episodes-5to6', 'uveitis-episodes-7plus',
      'uveitis-steroid-drops', 'uveitis-oral-steroids', 'uveitis-immunosuppressants',
      'uveitis-biologic-agents', 'uveitis-intravitreal-injection', 'uveitis-periocular-injection',
      'uveitis-laser-treatment', 'uveitis-surgery',
      'uveitis-glaucoma', 'uveitis-cataract', 'uveitis-macular-edema', 'uveitis-synechiae',
      'uveitis-chronic', 'uveitis-visual-acuity-decreased', 'uveitis-visual-field-loss',
    ],
  },
  KERATITIS: {
    id: 'keratitis', name: 'Keratitis / Keratopathy', diagnosticCode: '6001', cfrReference: '38 CFR 4.79',
    symptomIds: [
      'keratitis-eye-pain', 'keratitis-redness', 'keratitis-light-sensitivity', 'keratitis-blurred-vision',
      'keratitis-bacterial', 'keratitis-viral', 'keratitis-fungal', 'keratitis-acanthamoeba',
      'keratitis-exposure', 'keratitis-neurotrophic', 'keratitis-unilateral', 'keratitis-bilateral',
      'keratitis-treatment-visit', 'keratitis-episodes-1to2', 'keratitis-episodes-3to4',
      'keratitis-episodes-5to6', 'keratitis-episodes-7plus',
      'keratitis-antibiotic-drops', 'keratitis-antiviral-drops', 'keratitis-antifungal-drops',
      'keratitis-steroid-drops', 'keratitis-oral-antivirals', 'keratitis-bandage-lens',
      'keratitis-corneal-scraping', 'keratitis-corneal-transplant',
      'keratitis-corneal-ulcer', 'keratitis-corneal-scarring', 'keratitis-corneal-perforation',
      'keratitis-chronic-recurrent', 'keratitis-visual-acuity-decreased',
    ],
  },
  CHRONIC_CONJUNCTIVITIS: {
    id: 'chronic-conjunctivitis', name: 'Chronic Conjunctivitis', diagnosticCode: '6018', cfrReference: '38 CFR 4.79',
    symptomIds: [
      'conj-redness', 'conj-discharge', 'conj-itching', 'conj-burning', 'conj-tearing',
      'conj-allergic', 'conj-bacterial', 'conj-viral', 'conj-giant-papillary', 'conj-atopic',
      'conj-active', 'conj-inactive', 'conj-chronic', 'conj-recurrent',
      'conj-unilateral', 'conj-bilateral',
      'conj-treatment-visit', 'conj-episodes-1to2', 'conj-episodes-3to4',
      'conj-episodes-5to6', 'conj-episodes-7plus',
      'conj-artificial-tears', 'conj-antihistamine-drops', 'conj-mast-cell-stabilizer',
      'conj-antibiotic-drops', 'conj-steroid-drops', 'conj-immunomodulator', 'conj-oral-antihistamines',
      'conj-scarring', 'conj-symblepharon', 'conj-dry-eye', 'conj-disfigurement', 'conj-visual-impairment',
    ],
  },
  SCLERITIS: {
    id: 'scleritis', name: 'Scleritis', diagnosticCode: '6002', cfrReference: '38 CFR 4.79',
    symptomIds: [
      'scleritis-deep-pain', 'scleritis-redness', 'scleritis-tenderness', 'scleritis-blurred-vision',
      'scleritis-anterior-diffuse', 'scleritis-anterior-nodular', 'scleritis-necrotizing', 'scleritis-posterior',
      'scleritis-unilateral', 'scleritis-bilateral', 'scleritis-autoimmune', 'scleritis-infectious',
      'scleritis-treatment-visit', 'scleritis-episodes-1to2', 'scleritis-episodes-3to4',
      'scleritis-episodes-5to6', 'scleritis-episodes-7plus',
      'scleritis-nsaid-oral', 'scleritis-oral-steroids', 'scleritis-immunosuppressants',
      'scleritis-biologic-agents', 'scleritis-subconjunctival-injection', 'scleritis-surgery',
      'scleritis-scleral-thinning', 'scleritis-scleromalacia', 'scleritis-uveitis',
      'scleritis-glaucoma', 'scleritis-cataract', 'scleritis-chronic-recurrent',
      'scleritis-visual-acuity-decreased', 'scleritis-vision-loss-permanent',
    ],
  },
};

// ============================================
// CRITERIA BLOCKS
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
// PHASE 2: VISION LOSS CRITERIA (DC 6061-6079)
// ============================================
export const VISION_LOSS_CRITERIA = {
  condition: 'Vision Loss',
  diagnosticCode: '6061-6079',
  ratings: [
    {
      percent: 100,
      summary: 'Blindness in both eyes or near-total vision loss',
      criteriaDescription: [
        'No light perception in both eyes (NLP bilateral), OR',
        'Visual acuity 5/200 or less in better eye with concentric contraction of visual field to 5 degrees or less'
      ],
      evidenceNeeded: [
        'Ophthalmology examination results',
        'Visual acuity measurements',
        'Visual field testing results',
        'Documentation of cause (if service-connected)'
      ]
    },
    {
      percent: 90,
      summary: 'Severe vision impairment',
      criteriaDescription: [
        'Visual acuity 5/200 in better eye, with 5/200 or less in poorer eye'
      ],
      evidenceNeeded: [
        'Bilateral visual acuity measurements',
        'Ophthalmology examination'
      ]
    },
    {
      percent: 70,
      summary: 'Marked vision impairment',
      criteriaDescription: [
        'Visual acuity 10/200 in better eye, OR',
        'Concentric contraction of visual field to 5 degrees in better eye'
      ],
      evidenceNeeded: [
        'Visual acuity testing',
        'Visual field examination (perimetry)',
        'Documentation of better eye measurement'
      ]
    },
    {
      percent: 60,
      summary: 'Moderate to severe vision impairment',
      criteriaDescription: [
        'Visual acuity 15/200 in better eye, OR',
        'Concentric contraction of visual field to 10 degrees in better eye'
      ],
      evidenceNeeded: [
        'Visual acuity measurements',
        'Visual field testing',
        'Ophthalmology reports'
      ]
    },
    {
      percent: 50,
      summary: 'Moderate vision impairment',
      criteriaDescription: [
        'Visual acuity 20/200 in better eye, OR',
        'Concentric contraction of visual field to 15 degrees in better eye'
      ],
      evidenceNeeded: [
        'Corrected visual acuity measurements',
        'Visual field examination results'
      ]
    },
    {
      percent: 40,
      summary: 'Mild to moderate vision impairment',
      criteriaDescription: [
        'Visual acuity 20/100 in better eye'
      ],
      evidenceNeeded: [
        'Visual acuity testing with best correction',
        'Ophthalmology examination'
      ]
    },
    {
      percent: 30,
      summary: 'Mild vision impairment',
      criteriaDescription: [
        'Visual acuity 20/70 in better eye, OR',
        'Marked constriction of visual fields'
      ],
      evidenceNeeded: [
        'Visual acuity measurements',
        'Visual field testing if field loss present'
      ]
    },
    {
      percent: 10,
      summary: 'Minimal vision impairment',
      criteriaDescription: [
        'Visual acuity 20/40 in better eye, OR',
        'Moderate constriction of visual fields'
      ],
      evidenceNeeded: [
        'Visual acuity testing',
        'Documentation of field defects if applicable'
      ]
    }
  ],
  definitions: {
    'visual acuity': 'Clarity or sharpness of vision, measured using Snellen chart (e.g., 20/20, 20/40)',
    'better eye': 'The eye with better visual acuity; VA ratings are based on the better eye',
    'concentric contraction': 'Progressive narrowing of the visual field from the periphery',
    'visual field': 'The entire area that can be seen when the eye is directed forward',
    'CF': 'Count Fingers - ability to count fingers at a specified distance',
    'HM': 'Hand Motion - ability to detect hand movement',
    'LP': 'Light Perception - ability to perceive light only',
    'NLP': 'No Light Perception - complete blindness'
  }
};

// ============================================
// PHASE 2: GLAUCOMA CRITERIA (DC 6067)
// ============================================
export const GLAUCOMA_CRITERIA = {
  condition: 'Glaucoma',
  diagnosticCode: '6067',
  ratings: [
    {
      percent: 100,
      summary: 'Rate based on resulting visual impairment',
      criteriaDescription: [
        'Bilateral glaucoma rated under vision loss criteria (DC 6061-6079)',
        'Use visual acuity and visual field measurements'
      ],
      evidenceNeeded: [
        'Glaucoma diagnosis from ophthalmologist',
        'Visual acuity measurements',
        'Visual field testing results',
        'Intraocular pressure readings',
        'Optic nerve examination findings'
      ]
    },
    {
      percent: 30,
      summary: 'Unilateral glaucoma with field defect and requiring medication',
      criteriaDescription: [
        'Unilateral (one eye) glaucoma with:',
        'Characteristic visual field defect, AND',
        'Either persistent increased intraocular pressure with optic nerve damage, OR',
        'Requires sustained medication to control intraocular pressure'
      ],
      evidenceNeeded: [
        'Diagnosis of glaucoma in one eye',
        'Visual field test showing defect',
        'IOP measurements',
        'Current medication regimen',
        'Optic nerve assessment'
      ]
    },
    {
      percent: 10,
      summary: 'Unilateral glaucoma controlled by medication',
      criteriaDescription: [
        'Unilateral glaucoma controlled by medication',
        'Without visual field defect',
        'Without optic nerve damage'
      ],
      evidenceNeeded: [
        'Glaucoma diagnosis',
        'Current medications',
        'IOP readings showing control',
        'Visual field testing (normal)',
        'Optic nerve examination (stable)'
      ]
    }
  ],
  definitions: {
    'glaucoma': 'Group of eye conditions that damage the optic nerve, often due to increased intraocular pressure',
    'IOP': 'Intraocular Pressure - fluid pressure inside the eye',
    'visual field defect': 'Areas of vision loss or blind spots characteristic of glaucoma',
    'optic nerve damage': 'Damage to the nerve that transmits visual information from the eye to the brain',
    'unilateral': 'Affecting one eye only',
    'bilateral': 'Affecting both eyes'
  }
};

// ============================================
// PHASE 2: DIABETIC RETINOPATHY CRITERIA (DC 6066)
// ============================================
export const DIABETIC_RETINOPATHY_CRITERIA = {
  condition: 'Diabetic Retinopathy',
  diagnosticCode: '6066',
  note: 'Rated based on resulting visual acuity under DC 6061-6079',
  ratings: [
    {
      percent: 'variable',
      summary: 'Rate based on visual acuity',
      criteriaDescription: [
        'Diabetic retinopathy is rated under vision loss criteria',
        'Use visual acuity measurements in better eye',
        'Consider macular edema impact on central vision',
        'Proliferative changes may cause more rapid progression'
      ],
      evidenceNeeded: [
        'Diagnosis of diabetic retinopathy',
        'Type (non-proliferative vs proliferative)',
        'Visual acuity measurements',
        'Dilated fundus examination results',
        'OCT (Optical Coherence Tomography) if available',
        'Fluorescein angiography results if performed',
        'Treatment history (laser photocoagulation, anti-VEGF injections)',
        'Relationship to diabetes control (HbA1c levels)'
      ]
    }
  ],
  definitions: {
    'diabetic retinopathy': 'Diabetes complication affecting blood vessels in the retina',
    'proliferative': 'Advanced stage with abnormal blood vessel growth',
    'non-proliferative': 'Earlier stage with damaged blood vessels but no new growth',
    'macular edema': 'Swelling in the central part of the retina affecting central vision',
    'OCT': 'Optical Coherence Tomography - imaging test showing retinal layers',
    'anti-VEGF': 'Anti-Vascular Endothelial Growth Factor injections to reduce abnormal vessel growth',
    'photocoagulation': 'Laser treatment to seal leaking blood vessels'
  }
};

// ============================================
// PHASE 2: MACULAR DEGENERATION CRITERIA (DC 6062)
// ============================================
export const MACULAR_DEGENERATION_CRITERIA = {
  condition: 'Macular Degeneration',
  diagnosticCode: '6062',
  note: 'Rated based on resulting visual acuity under DC 6061-6079',
  ratings: [
    {
      percent: 'variable',
      summary: 'Rate based on visual acuity',
      criteriaDescription: [
        'Macular degeneration is rated under vision loss criteria',
        'Use visual acuity measurements in better eye',
        'Central scotoma (blind spot) affects reading and detail vision',
        'Peripheral vision typically preserved'
      ],
      evidenceNeeded: [
        'Diagnosis of macular degeneration',
        'Type (dry AMD vs wet AMD)',
        'Visual acuity measurements',
        'Amsler grid test results',
        'OCT imaging',
        'Fluorescein angiography if performed',
        'Central scotoma documentation',
        'Treatment records (anti-VEGF injections for wet AMD)',
        'Progression documentation'
      ]
    }
  ],
  definitions: {
    'macular degeneration': 'Age-related disease affecting the macula (central retina)',
    'AMD': 'Age-Related Macular Degeneration',
    'dry AMD': 'More common form with gradual breakdown of macular tissue',
    'wet AMD': 'Less common but more severe form with abnormal blood vessel growth',
    'macula': 'Central part of retina responsible for sharp, detailed central vision',
    'central scotoma': 'Blind spot or area of vision loss in the center of visual field',
    'Amsler grid': 'Grid pattern test to detect central vision distortions'
  }
};

// =================================================================
// IMMUNE THROMBOCYTOPENIA (DC 7705)
// =================================================================
export const TMJ_DISORDER_CRITERIA = {
  diagnosticCode: '9905',
  condition: 'Temporomandibular Joint (TMJ) Disorder',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9905',

  ratings: [
    {
      percent: 50,
      summary: 'Interincisal range of 0-10mm with liquid diet only',
      criteria: {
        interincisal: '0-10mm',
        diet: 'full-liquid',
        lateralExcursion: '0-4mm',
      },
      criteriaDescription: [
        'Maximum interincisal distance (jaw opening) of 0-10mm',
        'Requires full liquid diet',
        'May also have lateral excursion 0-4mm (additional 10%)',
      ],
      evidenceNeeded: [
        'Clinical measurement of maximum jaw opening (0-10mm)',
        'Documentation that solid foods cannot be chewed',
        'Evidence of liquid diet requirement',
        'Dentist or oral surgeon records',
        'X-rays or MRI showing TMJ damage if available',
      ],
    },
    {
      percent: 40,
      summary: 'Interincisal range of 11-20mm with semi-solid/soft diet',
      criteria: {
        interincisal: '11-20mm',
        diet: 'semi-solid-soft',
        lateralExcursion: '0-4mm',
      },
      criteriaDescription: [
        'Maximum interincisal distance of 11-20mm',
        'Requires semi-solid or soft food diet',
        'May also have lateral excursion 0-4mm (additional 10%)',
      ],
      evidenceNeeded: [
        'Clinical measurement of jaw opening (11-20mm)',
        'Documentation of dietary restrictions to soft foods',
        'Dentist records showing TMJ dysfunction',
        'Evidence that normal foods cause pain or cannot be chewed',
      ],
    },
    {
      percent: 30,
      summary: 'Interincisal range of 21-25mm with dietary restrictions',
      criteria: {
        interincisal: '21-25mm',
        diet: 'some-restrictions',
        lateralExcursion: '0-4mm',
      },
      criteriaDescription: [
        'Maximum interincisal distance of 21-25mm',
        'Some dietary restrictions required',
        'May also have lateral excursion 0-4mm (additional 10%)',
      ],
      evidenceNeeded: [
        'Clinical measurement showing 21-25mm opening',
        'Documentation of difficulty with certain foods (hard, chewy)',
        'TMJ treatment records',
        'Evidence of pain with prolonged chewing',
      ],
    },
    {
      percent: 20,
      summary: 'Interincisal range of 26-30mm',
      criteria: {
        interincisal: '26-30mm',
        lateralExcursion: '0-4mm',
      },
      criteriaDescription: [
        'Maximum interincisal distance of 26-30mm',
        'May also have lateral excursion 0-4mm (additional 10%)',
      ],
      evidenceNeeded: [
        'Clinical measurement of 26-30mm jaw opening',
        'Documentation of TMJ symptoms and treatment',
        'Evidence of functional limitation',
      ],
    },
    {
      percent: 10,
      summary: 'Interincisal range of 31-35mm OR lateral excursion 0-4mm',
      criteria: {
        options: [
          { interincisal: '31-35mm' },
          { lateralExcursion: '0-4mm' },
        ],
      },
      criteriaDescription: [
        'Maximum interincisal distance of 31-35mm, OR',
        'Lateral excursion limited to 0-4mm',
      ],
      evidenceNeeded: [
        'Clinical measurement of jaw opening or lateral movement',
        'TMJ diagnosis and treatment records',
      ],
    },
  ],

  definitions: {
    interincisal: {
      term: 'Interincisal Range',
      definition: 'The maximum distance you can open your mouth, measured between the upper and lower front teeth. Normal range is 35-50mm. This is measured clinically by a dentist or doctor.',
    },
    lateralExcursion: {
      term: 'Lateral Excursion',
      definition: 'Side-to-side movement of the jaw. Normal lateral movement is at least 6mm to each side. Limitation to 0-4mm indicates significant TMJ dysfunction and may warrant an additional 10% rating.',
    },
    dietaryRestrictions: {
      term: 'Dietary Restrictions',
      definition: 'Inability to eat certain consistencies of food due to jaw dysfunction. More severe restrictions result in higher ratings.',
      examples: [
        'Full liquid diet (50%) - can only consume liquids',
        'Semi-solid/soft foods (40%) - no solid foods',
        'Some restrictions (30%) - difficulty with hard or chewy foods',
      ],
    },
  },

  importantNotes: [
    'TMJ ratings are based on maximum jaw opening (interincisal range) and dietary restrictions',
    'Lateral excursion limitation (0-4mm) may add an additional 10% to the rating',
    'Measurements should be taken by a dentist or oral surgeon',
    'Normal interincisal range is 35-50mm',
    'Document pain levels, clicking/popping, and functional limitations',
    'Bilateral TMJ involvement results in a single rating (not combined)',
  ],
};

// ============================================
// TOOTH LOSS CRITERIA (DC 9913)
// ============================================
export const TOOTH_LOSS_CRITERIA = {
  diagnosticCode: '9913',
  condition: 'Loss of Teeth Due to Bone Loss',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9913',

  ratings: [
    {
      percent: 40,
      summary: 'Loss of all teeth (edentulous) - prosthesis does NOT restore masticatory function',
      criteria: {
        teethLost: 'all',
        prosthesis: 'does-not-restore',
      },
      criteriaDescription: [
        'Complete loss of all teeth',
        'Prosthesis (dentures) does NOT satisfactorily restore masticatory function',
      ],
      evidenceNeeded: [
        'Documentation that all teeth are lost',
        'Evidence that dentures do not allow proper chewing',
        'Dental records showing complete edentulism',
        'Statement that prosthesis is ill-fitting or non-functional',
      ],
    },
    {
      percent: 30,
      summary: 'Loss of all upper OR all lower teeth - prosthesis does NOT restore function',
      criteria: {
        options: [
          { teethLost: 'all-upper', prosthesis: 'does-not-restore' },
          { teethLost: 'all-lower', prosthesis: 'does-not-restore' },
        ],
      },
      criteriaDescription: [
        'Complete loss of all upper teeth, OR',
        'Complete loss of all lower teeth',
        'Prosthesis does NOT satisfactorily restore masticatory function',
      ],
      evidenceNeeded: [
        'Documentation of complete tooth loss in upper or lower arch',
        'Evidence that partial denture does not restore function',
        'Dental records',
      ],
    },
    {
      percent: 20,
      summary: 'Loss of all posterior teeth - prosthesis does NOT restore function',
      criteria: {
        options: [
          { teethLost: 'all-upper-lower-posterior', prosthesis: 'does-not-restore' },
        ],
      },
      criteriaDescription: [
        'Complete loss of all posterior teeth (molars and premolars) - upper and lower',
        'Prosthesis does NOT satisfactorily restore masticatory function',
      ],
      evidenceNeeded: [
        'Documentation of posterior tooth loss (both arches)',
        'Evidence that prosthesis does not restore chewing ability',
        'Dental records showing extent of tooth loss',
      ],
    },
    {
      percent: 10,
      summary: 'Loss of all anterior teeth OR all upper/lower posterior teeth - prosthesis does NOT restore',
      criteria: {
        options: [
          { teethLost: 'all-upper-lower-anterior', prosthesis: 'does-not-restore' },
          { teethLost: 'all-upper-posterior', prosthesis: 'does-not-restore' },
          { teethLost: 'all-lower-posterior', prosthesis: 'does-not-restore' },
        ],
      },
      criteriaDescription: [
        'Complete loss of all anterior teeth (front teeth) - upper and lower, OR',
        'Complete loss of all upper posterior teeth, OR',
        'Complete loss of all lower posterior teeth',
        'Prosthesis does NOT satisfactorily restore masticatory function',
      ],
      evidenceNeeded: [
        'Documentation of specific tooth loss pattern',
        'Evidence that prosthesis does not restore function',
        'Dental records',
      ],
    },
    {
      percent: 0,
      compensable: true,
      summary: 'Tooth loss with prosthesis that DOES restore function',
      criteria: {
        teethLost: 'any',
        prosthesis: 'restores',
      },
      criteriaDescription: [
        'Any pattern of tooth loss',
        'Prosthesis (dentures, bridges, implants) DOES satisfactorily restore masticatory function',
      ],
      evidenceNeeded: [
        'Documentation of tooth loss',
        'Evidence that prosthesis allows normal chewing',
      ],
    },
  ],

  definitions: {
    anteriorTeeth: {
      term: 'Anterior Teeth',
      definition: 'The front teeth (incisors and canines). There are 12 anterior teeth total - 6 upper and 6 lower.',
    },
    posteriorTeeth: {
      term: 'Posterior Teeth',
      definition: 'The back teeth used for chewing (premolars and molars). There are 20 posterior teeth total - 10 upper and 10 lower.',
    },
    masticatoryFunction: {
      term: 'Masticatory Function',
      definition: 'The ability to chew food properly. A prosthesis "restores function" if it allows normal chewing of various food types. It "does NOT restore function" if it is ill-fitting, causes pain, or prevents adequate chewing.',
    },
    boneLoss: {
      term: 'Bone Loss',
      definition: 'Tooth loss must be due to loss of bone supporting the teeth from trauma, osteomyelitis, or disease - NOT from periodontal disease alone. The underlying bone/jaw condition must be documented.',
      examples: [
        'Bone loss from jaw trauma or injury',
        'Bone loss from osteomyelitis (bone infection)',
        'Bone loss from radiation therapy',
        'Bone loss from jaw tumor/neoplasm',
      ],
    },
  },

  importantNotes: [
    '⚠️ CRITICAL: Tooth loss is only ratable if due to bone loss from trauma or disease',
    'Tooth loss from periodontal disease alone is NOT compensable by the VA',
    'Prosthesis that "does NOT restore function" means ill-fitting, painful, or inadequate for chewing',
    'If prosthesis DOES restore function, rating is 0% (compensable but not disabling)',
    'Document the cause of tooth loss (trauma, osteomyelitis, radiation, etc.)',
    'Multiple tooth loss patterns combine under a single rating (choose highest applicable)',
  ],
};

// ============================================
// MANDIBLE NONUNION CRITERIA (DC 9903)
// ============================================
export const MANDIBLE_NONUNION_CRITERIA = {
  diagnosticCode: '9903',
  condition: 'Mandible (Lower Jaw) Nonunion or Malunion',
  cfrReference: '38 CFR 4.150, Diagnostic Codes 9903-9904',

  ratings: [
    {
      percent: 30,
      summary: 'Nonunion or severe malunion with marked functional impairment',
      criteria: {
        severity: 'severe',
        functionalImpairment: 'marked',
      },
      criteriaDescription: [
        'Fracture has not healed (nonunion) or healed incorrectly (severe malunion)',
        'Marked impairment of mastication (chewing)',
        'Jaw instability',
        'Facial asymmetry',
      ],
      evidenceNeeded: [
        'X-rays or CT scans showing nonunion or malunion',
        'Documentation of persistent jaw instability',
        'Evidence of severe chewing difficulty',
        'Surgical records if applicable',
        'Measurements of jaw opening limitation',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate malunion with some functional impairment',
      criteria: {
        severity: 'moderate',
        functionalImpairment: 'moderate',
      },
      criteriaDescription: [
        'Fracture healed incorrectly (malunion)',
        'Some impairment of jaw function',
        'May have bite problems or mild facial asymmetry',
      ],
      evidenceNeeded: [
        'X-rays showing malunion',
        'Documentation of functional limitations',
        'Evidence of bite problems',
      ],
    },
  ],

  definitions: {
    nonunion: {
      term: 'Nonunion',
      definition: 'A fracture that has failed to heal. The bone ends remain separate, causing instability and functional impairment.',
    },
    malunion: {
      term: 'Malunion',
      definition: 'A fracture that has healed in an incorrect position, resulting in deformity, bite problems, or functional limitation.',
    },
  },

  importantNotes: [
    'These ratings apply to mandible (lower jaw) fractures that did not heal properly',
    'Document the impact on chewing, speaking, and jaw stability',
    'Imaging studies (X-rays, CT) are critical evidence',
    'May combine with TMJ rating if both conditions are present',
  ],
};

// ============================================
// MALIGNANT ORAL NEOPLASM CRITERIA (DC 9918)
// ============================================
export const MALIGNANT_ORAL_NEOPLASM_CRITERIA = {
  diagnosticCode: '9918',
  condition: 'Malignant Neoplasm of Oral Cavity',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9918',

  ratings: [
    {
      percent: 100,
      summary: 'During active treatment and for 6 months after completion',
      criteria: {
        malignant: true,
        activeTreatment: true,
      },
      criteriaDescription: [
        'Malignant (cancerous) tumor of mouth, tongue, lips, or jaw',
        'During active treatment (surgery, chemotherapy, radiation)',
        'For 6 months following completion of treatment',
      ],
      evidenceNeeded: [
        'Biopsy confirming malignancy',
        'Treatment records (surgery, chemo, radiation)',
        'Oncology records',
        'Dates of treatment start and completion',
      ],
    },
    {
      percent: 'varies',
      summary: 'After 6-month post-treatment period - rate residuals',
      criteria: {
        malignant: true,
        postTreatment: true,
      },
      criteriaDescription: [
        'After the mandatory 6-month 100% period',
        'Rate based on residual effects:',
        '  • Tissue loss (DC 9900-9916)',
        '  • Disfigurement/scarring (DC 7800)',
        '  • Speech impairment (DC 6515)',
        '  • Swallowing difficulty',
        '  • TMJ dysfunction (DC 9905)',
        '  • Dental disability (DC 9913)',
      ],
      evidenceNeeded: [
        'Documentation of cancer-free status or recurrence',
        'Evidence of residual effects',
        'Functional assessments',
        'Imaging showing tissue loss',
      ],
    },
  ],

  definitions: {
    malignantNeoplasm: {
      term: 'Malignant Neoplasm',
      definition: 'Cancer of the oral cavity, including mouth, tongue, lips, jaw bones, or soft tissues. This is distinct from benign (non-cancerous) growths.',
    },
    residuals: {
      term: 'Residuals',
      definition: 'The lasting effects after cancer treatment, such as tissue loss, scarring, difficulty swallowing, speech problems, or jaw dysfunction. These are rated separately after the 6-month period.',
    },
  },

  importantNotes: [
    '⚠️ Malignant oral cancers automatically rate 100% during treatment and for 6 months after',
    'After the 6-month period, rate based on specific residual impairments',
    'Multiple residuals may be combined for a total disability rating',
    'Recurrence restarts the 100% rating period',
    'Document all treatment dates carefully',
  ],
};

// ============================================
// BENIGN ORAL NEOPLASM CRITERIA (DC 9917)
// ============================================
export const BENIGN_ORAL_NEOPLASM_CRITERIA = {
  diagnosticCode: '9917',
  condition: 'Benign (Non-cancerous) Neoplasm of Oral Cavity',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9917',

  ratings: [
    {
      percent: 'varies',
      summary: 'Rate based on loss of supporting structures or functional impairment',
      criteria: {
        benign: true,
        functionalImpairment: true,
      },
      criteriaDescription: [
        'Non-cancerous tumor or growth of mouth, tongue, lips, or jaw',
        'Rate based on:',
        '  • Loss of jaw/bone structure (DC 9900-9916)',
        '  • TMJ dysfunction if present (DC 9905)',
        '  • Dental/tooth loss if applicable (DC 9913)',
        '  • Disfigurement (DC 7800)',
        '  • Functional impairment of speech or swallowing',
      ],
      evidenceNeeded: [
        'Biopsy confirming benign neoplasm',
        'Documentation of size and location',
        'Evidence of functional impairment',
        'Imaging studies',
        'Treatment records if removed surgically',
      ],
    },
  ],

  definitions: {
    benignNeoplasm: {
      term: 'Benign Neoplasm',
      definition: 'A non-cancerous tumor or growth. While not malignant, it can still cause functional problems depending on size and location.',
    },
  },

  importantNotes: [
    'Benign oral neoplasms do not receive the automatic 100% rating',
    'Rate based on functional impairment and residual effects',
    'May require rating under multiple diagnostic codes if causing various impairments',
    'Document impact on chewing, swallowing, speaking, and appearance',
  ],
};

// ============================================
// PHASE 7A: EYE CONDITIONS CRITERIA
// ============================================

// GENERAL RATING FORMULA FOR DISEASES OF THE EYE
// Used by: DC 6000 (Uveitis), DC 6001 (Keratitis), DC 6002 (Scleritis), DC 6018 (Conjunctivitis)
// Per 38 CFR 4.79
export const GENERAL_EYE_FORMULA_CRITERIA = {
  condition: 'General Rating Formula for Diseases of the Eye',
  diagnosticCode: 'Various (6000-6091)',
  cfrReference: '38 CFR 4.79',
  note: 'Evaluate on the basis of either visual impairment due to the particular condition or on incapacitating episodes, whichever results in a higher evaluation. An incapacitating episode is an eye condition severe enough to require a clinic visit to a provider specifically for treatment purposes.',
  ratings: [
    {
      percent: 60,
      summary: '7+ treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring 7 or more treatment visits for an eye condition during the past 12 months'
      ],
      evidenceNeeded: [
        'Medical records documenting 7+ clinic visits specifically for eye condition treatment',
        'Treatment notes showing active disease requiring intervention',
        'Documentation of treatments received (injections, laser, surgery, systemic medications)'
      ]
    },
    {
      percent: 40,
      summary: '5-6 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 5 but less than 7 treatment visits for an eye condition during the past 12 months'
      ],
      evidenceNeeded: [
        'Medical records documenting 5-6 clinic visits specifically for eye condition treatment',
        'Treatment notes showing active disease requiring intervention',
        'Documentation of treatments received'
      ]
    },
    {
      percent: 20,
      summary: '3-4 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 3 but less than 5 treatment visits for an eye condition during the past 12 months'
      ],
      evidenceNeeded: [
        'Medical records documenting 3-4 clinic visits specifically for eye condition treatment',
        'Treatment notes showing disease activity',
        'Documentation of treatments received'
      ]
    },
    {
      percent: 10,
      summary: '1-2 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 1 but less than 3 treatment visits for an eye condition during the past 12 months'
      ],
      evidenceNeeded: [
        'Medical records documenting 1-2 clinic visits specifically for eye condition treatment',
        'Treatment notes',
        'Documentation of diagnosis and treatment'
      ]
    },
    {
      percent: 0,
      summary: 'No treatment visits required',
      criteriaDescription: [
        'Eye condition not requiring treatment visits in past 12 months',
        'Or inactive condition with no residuals'
      ],
      evidenceNeeded: [
        'Documentation of diagnosis',
        'Evidence condition is controlled or resolved'
      ]
    }
  ],
  definitions: {
    'incapacitating episode': 'An eye condition severe enough to require a clinic visit to a provider specifically for treatment purposes. This is different from routine follow-up or monitoring.',
    'treatment visit': 'A clinic visit specifically for treatment of the eye condition, not routine monitoring. Examples include visits for medication adjustments, injections, laser treatments, or surgical interventions.',
    'systemic immunosuppressants': 'Medications that suppress the immune system throughout the body (e.g., methotrexate, azathioprine, mycophenolate, cyclosporine)',
    'biologic agents': 'Targeted immune therapies such as TNF inhibitors (adalimumab, infliximab) or other biologics (rituximab, tocilizumab)',
    'intravitreal injection': 'Injection of medication directly into the vitreous cavity of the eye',
    'periocular injection': 'Injection of medication around the eye (subconjunctival, sub-Tenon, or orbital)',
    'laser treatment': 'Therapeutic laser procedures including photocoagulation, trabeculoplasty, or other laser interventions',
    'visual impairment': 'If visual impairment results in a higher rating than incapacitating episodes, rate under DC 6061-6091 for visual acuity or visual field loss'
  },
  disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations. Visual impairment from the eye condition may be rated separately under DC 6061-6091 if it results in a higher evaluation.'
};

// DC 6000: UVEITIS / CHOROIDOPATHY CRITERIA
// Includes: uveitis, iritis, cyclitis, choroiditis
export const UVEITIS_CRITERIA = {
  condition: 'Uveitis / Choroidopathy',
  diagnosticCode: '6000',
  cfrReference: '38 CFR 4.79',
  note: 'Choroidopathy, including uveitis, iritis, cyclitis, or choroiditis. Evaluate on the basis of either visual impairment due to the particular condition or on incapacitating episodes, whichever results in a higher evaluation.',
  ratings: [
    {
      percent: 60,
      summary: '7+ treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring 7 or more treatment visits for uveitis during the past 12 months',
        'Severe or refractory uveitis requiring frequent intervention'
      ],
      evidenceNeeded: [
        'Medical records documenting 7+ clinic visits specifically for uveitis treatment',
        'Documentation of treatments (steroid injections, immunosuppressants, biologics, surgery)',
        'Ophthalmology notes showing disease activity and treatment response'
      ]
    },
    {
      percent: 40,
      summary: '5-6 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 5 but less than 7 treatment visits for uveitis during the past 12 months',
        'Moderate to severe uveitis with frequent flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 5-6 clinic visits specifically for uveitis treatment',
        'Treatment records showing active management',
        'Documentation of uveitis type and location (anterior, intermediate, posterior, panuveitis)'
      ]
    },
    {
      percent: 20,
      summary: '3-4 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 3 but less than 5 treatment visits for uveitis during the past 12 months',
        'Moderate uveitis with periodic flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 3-4 clinic visits specifically for uveitis treatment',
        'Documentation of flares and treatment response',
        'Ophthalmology examination records'
      ]
    },
    {
      percent: 10,
      summary: '1-2 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 1 but less than 3 treatment visits for uveitis during the past 12 months',
        'Mild or well-controlled uveitis with occasional flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 1-2 clinic visits specifically for uveitis treatment',
        'Documentation of diagnosis and treatment',
        'Evidence of disease activity requiring intervention'
      ]
    },
    {
      percent: 0,
      summary: 'No treatment visits required or inactive',
      criteriaDescription: [
        'Uveitis not requiring treatment visits in past 12 months',
        'Or condition in remission without active treatment'
      ],
      evidenceNeeded: [
        'Documentation of uveitis diagnosis',
        'Evidence condition is controlled or in remission'
      ]
    }
  ],
  definitions: {
    'uveitis': 'Inflammation of the uveal tract (iris, ciliary body, and/or choroid). Can be infectious or non-infectious (autoimmune).',
    'anterior uveitis': 'Inflammation of the iris (iritis) and/or ciliary body (cyclitis). Most common form. Causes eye pain, redness, and light sensitivity.',
    'intermediate uveitis': 'Inflammation primarily affecting the vitreous and peripheral retina. Also called pars planitis.',
    'posterior uveitis': 'Inflammation of the choroid (choroiditis) and/or retina. Can cause significant vision loss.',
    'panuveitis': 'Inflammation involving all layers of the uvea - anterior, intermediate, and posterior.',
    'iritis': 'Inflammation of the iris, the colored part of the eye. A type of anterior uveitis.',
    'cyclitis': 'Inflammation of the ciliary body. Often occurs with iritis as iridocyclitis.',
    'choroiditis': 'Inflammation of the choroid, the vascular layer between retina and sclera.',
    'synechiae': 'Adhesions between the iris and lens (posterior synechiae) or cornea (anterior synechiae) that can result from uveitis.',
    'hypopyon': 'Accumulation of white blood cells in the anterior chamber, seen in severe anterior uveitis.',
    'macular edema': 'Swelling of the macula (central retina) that can occur as a complication of uveitis, causing decreased central vision.',
    'incapacitating episode': 'A uveitis flare severe enough to require a clinic visit specifically for treatment purposes.'
  },
  disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations. Visual impairment from uveitis complications may be rated separately under DC 6061-6091 if it results in a higher evaluation.'
};

// DC 6001: KERATITIS / KERATOPATHY CRITERIA
// Corneal inflammation and disease
export const KERATITIS_CRITERIA = {
  condition: 'Keratitis / Keratopathy',
  diagnosticCode: '6001',
  cfrReference: '38 CFR 4.79',
  note: 'Keratopathy (corneal disease/inflammation). Evaluate on the basis of either visual impairment due to the particular condition or on incapacitating episodes, whichever results in a higher evaluation.',
  ratings: [
    {
      percent: 60,
      summary: '7+ treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring 7 or more treatment visits for keratitis during the past 12 months',
        'Severe or recurrent keratitis requiring frequent intervention'
      ],
      evidenceNeeded: [
        'Medical records documenting 7+ clinic visits specifically for keratitis treatment',
        'Documentation of treatments (antibiotics, antivirals, corneal procedures)',
        'Ophthalmology notes showing disease activity and complications'
      ]
    },
    {
      percent: 40,
      summary: '5-6 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 5 but less than 7 treatment visits for keratitis during the past 12 months',
        'Moderate to severe keratitis with frequent recurrences'
      ],
      evidenceNeeded: [
        'Medical records documenting 5-6 clinic visits specifically for keratitis treatment',
        'Treatment records showing active management',
        'Documentation of keratitis type (bacterial, viral, fungal, etc.)'
      ]
    },
    {
      percent: 20,
      summary: '3-4 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 3 but less than 5 treatment visits for keratitis during the past 12 months',
        'Moderate keratitis with periodic episodes'
      ],
      evidenceNeeded: [
        'Medical records documenting 3-4 clinic visits specifically for keratitis treatment',
        'Documentation of episodes and treatment response',
        'Ophthalmology examination records'
      ]
    },
    {
      percent: 10,
      summary: '1-2 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 1 but less than 3 treatment visits for keratitis during the past 12 months',
        'Mild or occasional keratitis episodes'
      ],
      evidenceNeeded: [
        'Medical records documenting 1-2 clinic visits specifically for keratitis treatment',
        'Documentation of diagnosis and treatment',
        'Evidence of disease activity requiring intervention'
      ]
    },
    {
      percent: 0,
      summary: 'No treatment visits required or resolved',
      criteriaDescription: [
        'Keratitis not requiring treatment visits in past 12 months',
        'Or condition resolved without active disease'
      ],
      evidenceNeeded: [
        'Documentation of keratitis diagnosis',
        'Evidence condition is controlled or resolved'
      ]
    }
  ],
  definitions: {
    'keratitis': 'Inflammation of the cornea, the clear front surface of the eye. Can be infectious or non-infectious.',
    'keratopathy': 'Any disease or abnormality of the cornea.',
    'bacterial keratitis': 'Corneal infection caused by bacteria. Often associated with contact lens wear. Requires aggressive antibiotic treatment.',
    'viral keratitis': 'Corneal infection caused by viruses, most commonly herpes simplex virus (HSV) or varicella-zoster virus (VZV/shingles).',
    'herpes simplex keratitis': 'HSV infection of the cornea. Can cause recurrent episodes and corneal scarring. Treated with antivirals.',
    'herpes zoster ophthalmicus': 'Shingles affecting the eye, including the cornea. Can cause severe keratitis and chronic problems.',
    'fungal keratitis': 'Corneal infection caused by fungi. Often occurs after plant/organic material injury. Difficult to treat.',
    'acanthamoeba keratitis': 'Parasitic corneal infection associated with contact lens use and water exposure. Very painful and difficult to treat.',
    'exposure keratopathy': 'Corneal damage due to inadequate eyelid closure (lagophthalmos), causing drying and breakdown of the corneal surface.',
    'neurotrophic keratopathy': 'Corneal disease due to decreased corneal sensation, leading to poor healing and breakdown.',
    'corneal ulcer': 'An open sore on the cornea, usually caused by infection. Can lead to permanent scarring and vision loss.',
    'corneal scarring': 'Permanent opacity of the cornea that can result from keratitis, reducing vision.',
    'corneal perforation': 'A hole through the full thickness of the cornea - a serious complication requiring emergency treatment.',
    'incapacitating episode': 'A keratitis episode severe enough to require a clinic visit specifically for treatment purposes.'
  },
  disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations. Visual impairment from corneal scarring may be rated separately under DC 6061-6091 if it results in a higher evaluation.'
};

// DC 6018: CHRONIC CONJUNCTIVITIS CRITERIA
// Nontrachomatous chronic conjunctivitis
// Active: General Rating Formula, minimum 10%
// Inactive: Rate based on residuals
export const CHRONIC_CONJUNCTIVITIS_CRITERIA = {
  condition: 'Chronic Conjunctivitis',
  diagnosticCode: '6018',
  cfrReference: '38 CFR 4.79',
  note: 'Chronic conjunctivitis (nontrachomatous). ACTIVE: Evaluate under the General Rating Formula for Diseases of the Eye, minimum rating 10%. INACTIVE: Evaluate based on residuals, such as visual impairment and disfigurement (DC 7800).',
  ratings: [
    {
      percent: 60,
      summary: '7+ treatment visits in past 12 months (Active)',
      criteriaDescription: [
        'ACTIVE conjunctivitis with documented incapacitating episodes requiring 7 or more treatment visits during the past 12 months',
        'Severe chronic conjunctivitis requiring frequent intervention'
      ],
      evidenceNeeded: [
        'Medical records documenting 7+ clinic visits specifically for conjunctivitis treatment',
        'Documentation of active disease status',
        'Treatment records showing ongoing management'
      ]
    },
    {
      percent: 40,
      summary: '5-6 treatment visits in past 12 months (Active)',
      criteriaDescription: [
        'ACTIVE conjunctivitis with documented incapacitating episodes requiring at least 5 but less than 7 treatment visits during the past 12 months',
        'Moderate to severe chronic conjunctivitis'
      ],
      evidenceNeeded: [
        'Medical records documenting 5-6 clinic visits specifically for conjunctivitis treatment',
        'Documentation of active disease',
        'Treatment records'
      ]
    },
    {
      percent: 20,
      summary: '3-4 treatment visits in past 12 months (Active)',
      criteriaDescription: [
        'ACTIVE conjunctivitis with documented incapacitating episodes requiring at least 3 but less than 5 treatment visits during the past 12 months',
        'Moderate chronic conjunctivitis with periodic flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 3-4 clinic visits specifically for conjunctivitis treatment',
        'Documentation of active disease episodes',
        'Ophthalmology examination records'
      ]
    },
    {
      percent: 10,
      summary: '1-2 treatment visits OR active disease (minimum)',
      criteriaDescription: [
        'ACTIVE conjunctivitis with documented incapacitating episodes requiring at least 1 but less than 3 treatment visits during the past 12 months',
        'OR any active chronic conjunctivitis (minimum rating for active disease)',
        'Mild chronic conjunctivitis with occasional symptoms'
      ],
      evidenceNeeded: [
        'Medical records documenting active conjunctivitis',
        'Documentation of chronic nature (symptoms >4 weeks or recurrent)',
        'Treatment records showing ongoing management needed'
      ]
    },
    {
      percent: 0,
      summary: 'Inactive with no residuals',
      criteriaDescription: [
        'INACTIVE conjunctivitis with no visual impairment or disfigurement',
        'Condition resolved without lasting effects'
      ],
      evidenceNeeded: [
        'Documentation of prior conjunctivitis diagnosis',
        'Evidence condition is inactive/resolved',
        'Documentation of no residual visual impairment or disfigurement'
      ]
    }
  ],
  definitions: {
    'chronic conjunctivitis': 'Inflammation of the conjunctiva (the clear membrane covering the white of the eye and inner eyelids) lasting more than 4 weeks or recurring frequently.',
    'active conjunctivitis': 'Conjunctivitis with current symptoms requiring treatment. Rated under the General Rating Formula with minimum 10%.',
    'inactive conjunctivitis': 'Conjunctivitis that has resolved or is in remission. Rated based on residuals only.',
    'allergic conjunctivitis': 'Conjunctivitis triggered by allergens (pollen, dust, pet dander). Causes itching, redness, and tearing.',
    'bacterial conjunctivitis': 'Conjunctivitis caused by bacterial infection. Causes purulent discharge and crusting.',
    'viral conjunctivitis': 'Conjunctivitis caused by viral infection. Highly contagious. Causes watery discharge.',
    'giant papillary conjunctivitis': 'Conjunctivitis associated with contact lens wear. Causes large bumps under the upper eyelid.',
    'atopic keratoconjunctivitis': 'Severe allergic conjunctivitis associated with atopic dermatitis. Can cause corneal damage.',
    'nontrachomatous': 'Conjunctivitis NOT caused by trachoma (Chlamydia trachomatis infection). Trachomatous conjunctivitis is rated under DC 6017.',
    'residuals': 'Lasting effects after the active disease resolves, including scarring, dry eye, or visual impairment.',
    'symblepharon': 'Adhesion between the conjunctiva of the eyelid and the eyeball, a potential complication of severe conjunctivitis.',
    'disfigurement': 'Visible scarring or changes to the eye/eyelids that may be rated under DC 7800.',
    'incapacitating episode': 'A conjunctivitis flare severe enough to require a clinic visit specifically for treatment purposes.'
  },
  disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations. INACTIVE conjunctivitis is rated based on residuals such as visual impairment (DC 6061-6091) or disfigurement (DC 7800).'
};

// DC 6002: SCLERITIS CRITERIA
// Inflammation of the sclera
export const SCLERITIS_CRITERIA = {
  condition: 'Scleritis',
  diagnosticCode: '6002',
  cfrReference: '38 CFR 4.79',
  note: 'Scleritis (inflammation of the sclera). Evaluate on the basis of either visual impairment due to the particular condition or on incapacitating episodes, whichever results in a higher evaluation. Scleritis is often associated with systemic autoimmune diseases.',
  ratings: [
    {
      percent: 60,
      summary: '7+ treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring 7 or more treatment visits for scleritis during the past 12 months',
        'Severe or refractory scleritis requiring frequent intervention',
        'May include necrotizing scleritis or scleritis with systemic disease'
      ],
      evidenceNeeded: [
        'Medical records documenting 7+ clinic visits specifically for scleritis treatment',
        'Documentation of treatments (systemic steroids, immunosuppressants, biologics)',
        'Ophthalmology and/or rheumatology notes showing disease activity'
      ]
    },
    {
      percent: 40,
      summary: '5-6 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 5 but less than 7 treatment visits for scleritis during the past 12 months',
        'Moderate to severe scleritis with frequent flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 5-6 clinic visits specifically for scleritis treatment',
        'Treatment records showing active management',
        'Documentation of scleritis type (anterior, posterior, necrotizing)'
      ]
    },
    {
      percent: 20,
      summary: '3-4 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 3 but less than 5 treatment visits for scleritis during the past 12 months',
        'Moderate scleritis with periodic flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 3-4 clinic visits specifically for scleritis treatment',
        'Documentation of episodes and treatment response',
        'Ophthalmology examination records'
      ]
    },
    {
      percent: 10,
      summary: '1-2 treatment visits in past 12 months',
      criteriaDescription: [
        'Documented incapacitating episodes requiring at least 1 but less than 3 treatment visits for scleritis during the past 12 months',
        'Mild scleritis or well-controlled with occasional flares'
      ],
      evidenceNeeded: [
        'Medical records documenting 1-2 clinic visits specifically for scleritis treatment',
        'Documentation of diagnosis and treatment',
        'Evidence of disease activity requiring intervention'
      ]
    },
    {
      percent: 0,
      summary: 'No treatment visits required or inactive',
      criteriaDescription: [
        'Scleritis not requiring treatment visits in past 12 months',
        'Or condition in remission without active treatment'
      ],
      evidenceNeeded: [
        'Documentation of scleritis diagnosis',
        'Evidence condition is controlled or in remission'
      ]
    }
  ],
  definitions: {
    'scleritis': 'Inflammation of the sclera, the white outer coat of the eye. Causes severe, deep, boring pain. More serious than episcleritis.',
    'sclera': 'The tough, white outer layer of the eyeball that provides structure and protection.',
    'anterior scleritis': 'Scleritis affecting the front portion of the sclera (visible part). Most common type.',
    'diffuse anterior scleritis': 'Widespread inflammation of the anterior sclera. Most benign form.',
    'nodular anterior scleritis': 'Localized, tender nodule(s) on the sclera.',
    'necrotizing scleritis': 'Most severe form with tissue destruction. High risk of vision loss and perforation. Often associated with systemic disease.',
    'posterior scleritis': 'Inflammation of the back portion of the sclera. Can cause retinal detachment, macular edema, and optic nerve swelling.',
    'scleromalacia perforans': 'Necrotizing scleritis without inflammation, seen in severe rheumatoid arthritis. Risk of perforation.',
    'episcleritis': 'Inflammation of the episclera (layer between conjunctiva and sclera). Less severe than scleritis, usually self-limiting.',
    'autoimmune association': 'Scleritis is often associated with systemic autoimmune diseases including rheumatoid arthritis, granulomatosis with polyangiitis, lupus, and inflammatory bowel disease.',
    'scleral thinning': 'Thinning of the sclera that can result from inflammation, increasing risk of perforation.',
    'incapacitating episode': 'A scleritis episode severe enough to require a clinic visit specifically for treatment purposes.'
  },
  disclaimer: 'This analysis is for documentation purposes only. The VA makes all final rating determinations. Visual impairment from scleritis complications may be rated separately under DC 6061-6091 if it results in a higher evaluation. Associated systemic conditions should be rated separately.'
};

// DC 7332: Rectum and Anus, Impairment of Sphincter Control (Fecal Incontinence)
export const PERIPHERAL_VESTIBULAR_CRITERIA = {
  diagnosticCode: '6204',
  condition: 'Peripheral Vestibular Disorders',
  cfrReference: '38 CFR 4.87, Diagnostic Code 6204',

  ratings: [
    {
      percent: 30,
      summary: 'Dizziness and occasional staggering',
      criteriaDescription: [
        'Dizziness present',
        'Occasional staggering gait documented',
        'Both symptoms must be present for 30% rating',
        'Objective findings supporting vestibular disequilibrium required',
      ],
    },
    {
      percent: 10,
      summary: 'Occasional dizziness',
      criteriaDescription: [
        'Occasional dizziness documented',
        'No staggering gait',
        'Objective findings supporting vestibular disequilibrium required',
      ],
    },
  ],

  definitions: {
    peripheralVestibular: {
      term: 'Peripheral Vestibular Disorder',
      definition: 'Disorder of the vestibular system (inner ear balance organs or vestibular nerve) causing dizziness and balance problems.',
    },
    vertigo: {
      term: 'Vertigo',
      definition: 'False sensation of spinning or movement. Can be triggered by head position changes or occur spontaneously.',
    },
    dizziness: {
      term: 'Dizziness',
      definition: 'General term for sensations of lightheadedness, unsteadiness, or disorientation.',
    },
    staggering: {
      term: 'Staggering',
      definition: 'Unsteady gait with stumbling or weaving. Key criterion distinguishing 30% from 10% rating.',
    },
    vestibularDisequilibrium: {
      term: 'Vestibular Disequilibrium',
      definition: 'Imbalance caused by vestibular system dysfunction. Must have objective findings for compensable rating.',
    },
    objectiveFindings: {
      term: 'Objective Findings',
      definition: 'Clinical signs documented by healthcare provider (e.g., nystagmus, abnormal vestibular testing, positive Dix-Hallpike). Required for compensable rating.',
    },
    nystagmus: {
      term: 'Nystagmus',
      definition: 'Involuntary, rhythmic eye movements. Common objective finding in vestibular disorders.',
    },
    bppv: {
      term: 'BPPV (Benign Paroxysmal Positional Vertigo)',
      definition: 'Common vestibular disorder causing brief vertigo episodes triggered by head position changes.',
    },
    labyrinthitis: {
      term: 'Labyrinthitis',
      definition: 'Inflammation of the inner ear labyrinth, causing vertigo and hearing changes.',
    },
    vestibularNeuritis: {
      term: 'Vestibular Neuritis',
      definition: 'Inflammation of the vestibular nerve causing sudden severe vertigo without hearing loss.',
    },
  },

  note: 'Objective findings supporting vestibular disequilibrium are REQUIRED for compensable rating. Rate hearing impairment and suppuration separately and combine.',

  disclaimer: 'This analysis is based on logged vestibular symptoms. VA rating requires objective clinical findings documented by a healthcare provider.',
};
export const CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA = {
  diagnosticCode: '6200',
  condition: 'Chronic Suppurative Otitis Media',
  cfrReference: '38 CFR 4.87, Diagnostic Code 6200',

  ratings: [
    {
      percent: 10,
      summary: 'During suppuration, or with aural polyps',
      criteriaDescription: [
        'Active suppuration (pus drainage) from ear, OR',
        'Presence of aural polyps',
        'Includes mastoiditis and cholesteatoma',
        'Maximum rating under this code is 10%',
      ],
    },
  ],

  definitions: {
    suppurativeOtitisMedia: {
      term: 'Suppurative Otitis Media',
      definition: 'Middle ear infection with pus formation and drainage, usually through a perforated eardrum.',
    },
    suppuration: {
      term: 'Suppuration',
      definition: 'Formation and discharge of pus. Key criterion for 10% rating.',
    },
    auralPolyp: {
      term: 'Aural Polyp',
      definition: 'Benign growth in the ear canal or middle ear, often from chronic inflammation. Key criterion for 10% rating.',
    },
    cholesteatoma: {
      term: 'Cholesteatoma',
      definition: 'Abnormal skin growth in the middle ear that can erode bone. Requires surgical treatment.',
    },
    mastoiditis: {
      term: 'Mastoiditis',
      definition: 'Infection of the mastoid bone behind the ear, complication of otitis media.',
    },
    tympanicPerforation: {
      term: 'Tympanic Membrane Perforation',
      definition: 'Hole in the eardrum, often from chronic infection or trauma.',
    },
    chronicOtitisMedia: {
      term: 'Chronic Otitis Media',
      definition: 'Middle ear infection lasting more than 3 months or recurring frequently.',
    },
  },

  complications: [
    {
      condition: 'Hearing Impairment',
      note: 'Evaluate separately under DC 6100 and combine',
    },
    {
      condition: 'Labyrinthitis',
      note: 'Evaluate separately and combine',
    },
    {
      condition: 'Tinnitus',
      note: 'Evaluate separately under DC 6260 and combine',
    },
    {
      condition: 'Facial Nerve Paralysis',
      note: 'Evaluate separately under appropriate neurological code',
    },
    {
      condition: 'Bone Loss of Skull',
      note: 'Evaluate separately and combine',
    },
  ],

  note: 'Maximum rating under DC 6200 is 10%. Hearing impairment and complications (labyrinthitis, tinnitus, facial nerve paralysis, bone loss) are rated SEPARATELY and combined.',

  disclaimer: 'This analysis is based on logged otitis media symptoms. VA rating requires ENT examination documenting active suppuration or polyps.',
};
export const CHRONIC_OTITIS_EXTERNA_CRITERIA = {
  diagnosticCode: '6210',
  condition: 'Chronic Otitis Externa',
  cfrReference: '38 CFR 4.87, Diagnostic Code 6210',

  ratings: [
    {
      percent: 10,
      summary: 'Swelling, dry/scaly or serous discharge, and itching requiring frequent and prolonged treatment',
      criteriaDescription: [
        'Swelling of ear canal present, AND',
        'Dry and scaly OR serous discharge present, AND',
        'Itching present, AND',
        'Requires frequent AND prolonged treatment',
        'ALL criteria must be met for 10% rating',
      ],
    },
  ],

  definitions: {
    otitisExterna: {
      term: 'Otitis Externa',
      definition: 'Inflammation of the external ear canal (outer ear infection), also known as swimmer\'s ear.',
    },
    chronicOtitisExterna: {
      term: 'Chronic Otitis Externa',
      definition: 'External ear canal inflammation lasting more than 3 months or recurring frequently.',
    },
    swelling: {
      term: 'Swelling',
      definition: 'Edema or inflammation of the ear canal skin. One of the required symptoms for rating.',
    },
    dryScaly: {
      term: 'Dry and Scaly',
      definition: 'Flaking, scaling skin in the ear canal. One of the discharge/skin criteria.',
    },
    serousDischarge: {
      term: 'Serous Discharge',
      definition: 'Clear, watery drainage from the ear canal. Alternative to dry/scaly for rating.',
    },
    itching: {
      term: 'Itching',
      definition: 'Pruritus of the ear canal. Required symptom for compensable rating.',
    },
    frequentTreatment: {
      term: 'Frequent Treatment',
      definition: 'Treatment needed on a regular, recurring basis.',
    },
    prolongedTreatment: {
      term: 'Prolonged Treatment',
      definition: 'Treatment required for extended periods, not just brief courses.',
    },
    bacterialOtitisExterna: {
      term: 'Bacterial Otitis Externa',
      definition: 'External ear infection caused by bacteria, most commonly Pseudomonas aeruginosa.',
    },
    fungalOtitisExterna: {
      term: 'Fungal Otitis Externa (Otomycosis)',
      definition: 'External ear infection caused by fungi, typically Aspergillus or Candida.',
    },
    eczematousOtitisExterna: {
      term: 'Eczematous Otitis Externa',
      definition: 'External ear inflammation related to eczema or dermatitis.',
    },
  },

  note: 'ALL criteria must be met: swelling + (dry/scaly OR serous discharge) + itching + frequent/prolonged treatment. Maximum rating is 10%.',

  disclaimer: 'This analysis is based on logged otitis externa symptoms. VA rating requires ENT documentation of examination findings and treatment frequency.',
};
export const CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA = {
  diagnosticCode: '6201',
  condition: 'Chronic Nonsuppurative Otitis Media',
  cfrReference: '38 CFR 4.87, Diagnostic Code 6201',

  ratings: [
    {
      percent: 'Variable',
      summary: 'Rate hearing impairment under DC 6100',
      criteriaDescription: [
        'No specific rating percentage under DC 6201',
        'Rate based on resulting hearing impairment',
        'Use audiometric testing results',
        'Apply DC 6100 hearing loss criteria',
      ],
    },
  ],

  definitions: {
    nonsuppurativeOtitisMedia: {
      term: 'Nonsuppurative Otitis Media',
      definition: 'Middle ear inflammation with fluid accumulation but without pus formation or active infection.',
    },
    serousOtitisMedia: {
      term: 'Serous Otitis Media (Otitis Media with Effusion)',
      definition: 'Fluid in the middle ear without signs of acute infection. Common in adults with eustachian tube dysfunction.',
    },
    middleEarEffusion: {
      term: 'Middle Ear Effusion',
      definition: 'Accumulation of fluid in the middle ear space behind the eardrum.',
    },
    eustachianTubeDysfunction: {
      term: 'Eustachian Tube Dysfunction',
      definition: 'Impaired function of the tube connecting middle ear to throat, leading to pressure/fluid problems.',
    },
    conductiveHearingLoss: {
      term: 'Conductive Hearing Loss',
      definition: 'Hearing loss from impaired sound transmission through outer or middle ear. Common result of effusion.',
    },
    tympanostomyTubes: {
      term: 'Tympanostomy Tubes',
      definition: 'Small tubes placed through eardrum to ventilate middle ear and drain fluid.',
    },
    chronicEffusion: {
      term: 'Chronic Effusion',
      definition: 'Middle ear fluid persisting for more than 3 months.',
    },
  },

  note: 'DC 6201 does not have its own rating percentages. Rate based on hearing impairment under DC 6100 using audiometric testing.',

  disclaimer: 'This analysis tracks nonsuppurative otitis media symptoms. VA rating requires audiometric testing to determine hearing impairment level.',
};

// -----------------------------------------
// ACTIVE PULMONARY TUBERCULOSIS (DC 6730)
// -----------------------------------------
export const MANDIBLE_MALUNION_CRITERIA = {
  diagnosticCode: '9904',
  condition: 'Mandible Malunion',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9904',

  note: 'Malunion of mandible is rated based on degree of displacement and functional impairment. Different from nonunion (DC 9903).',

  ratings: [
    {
      percent: 20,
      summary: 'Severe displacement causing marked functional impairment',
      criteriaDescription: [
        'Severe malunion with marked displacement',
        'Significant bite problems (malocclusion)',
        'Severe impairment of mastication',
        'May have facial asymmetry',
      ],
      evidenceNeeded: [
        'X-rays or CT showing malunion with displacement',
        'Dental examination documenting malocclusion',
        'Documentation of chewing difficulty',
        'Measurements of jaw opening',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate displacement causing functional impairment',
      criteriaDescription: [
        'Moderate malunion',
        'Some bite problems',
        'Moderate impairment of jaw function',
      ],
      evidenceNeeded: [
        'Imaging showing malunion',
        'Documentation of functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'Slight displacement with minimal impairment',
      criteriaDescription: [
        'Minimal displacement',
        'No significant functional impact',
      ],
      evidenceNeeded: [
        'Imaging confirming malunion',
      ],
    },
  ],

  definitions: {
    malunion: {
      term: 'Malunion',
      definition: 'A fracture that has healed in an incorrect position, resulting in deformity or functional limitation.',
    },
    malocclusion: {
      term: 'Malocclusion',
      definition: 'Misalignment of teeth/bite caused by jaw position abnormality.',
    },
  },

  disclaimer: 'Rate based on severity of displacement and functional impairment. Combine with TMJ rating if both conditions exist.',
};

// ============================================
// MAXILLA MALUNION CRITERIA (DC 9916)
// ============================================
export const MAXILLA_MALUNION_CRITERIA = {
  diagnosticCode: '9916',
  condition: 'Maxilla Malunion or Nonunion',
  cfrReference: '38 CFR 4.150, Diagnostic Code 9916',

  note: 'Maxilla (upper jaw) malunion or nonunion. Can affect breathing, vision, and eating.',

  ratings: [
    {
      percent: 30,
      summary: 'Nonunion or severe malunion with marked functional impairment',
      criteriaDescription: [
        'Nonunion (fracture not healed) or severe malunion',
        'Marked displacement',
        'Severe mastication impairment',
        'May affect sinus function or facial symmetry',
      ],
      evidenceNeeded: [
        'CT scan showing nonunion or severe malunion',
        'Oral surgery/maxillofacial evaluation',
        'Documentation of functional impairment',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate malunion with some functional impairment',
      criteriaDescription: [
        'Moderate malunion',
        'Some bite problems',
        'Moderate functional impact',
      ],
      evidenceNeeded: [
        'Imaging showing malunion',
        'Documentation of limitations',
      ],
    },
  ],

  definitions: {
    maxilla: {
      term: 'Maxilla',
      definition: 'The upper jaw bone that holds upper teeth and forms floor of nasal cavity and orbits.',
    },
    nonunion: {
      term: 'Nonunion',
      definition: 'A fracture that has failed to heal, with bone ends remaining separate.',
    },
  },

  disclaimer: 'Maxilla malunion can affect breathing, vision, and eating. Document all functional impacts.',
};

// ============================================
// MAXILLA/MANDIBLE BONE DISEASE CRITERIA (DC 9900)
// Rated as Osteomyelitis (DC 5000)
// ============================================
export const MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA = {
  diagnosticCode: '9900',
  condition: 'Maxilla or Mandible Osteomyelitis/Osteonecrosis',
  cfrReference: '38 CFR 4.150 (rates as DC 5000)',

  note: 'Chronic osteomyelitis of the jaw is rated under DC 5000 (Osteomyelitis) criteria.',

  ratings: [
    {
      percent: 60,
      summary: 'Definite involucrum or sequestrum with repeated flare-ups',
      criteriaDescription: [
        'Chronic osteomyelitis with bone death (sequestrum)',
        'New bone formation around dead bone (involucrum)',
        'Repeated episodes of infection/drainage',
      ],
      evidenceNeeded: [
        'CT or MRI showing bone involvement',
        'Surgical records showing debridement',
        'Documentation of flare-ups',
        'Culture results',
      ],
    },
    {
      percent: 30,
      summary: 'Definite involucrum or sequestrum with occasional drainage',
      criteriaDescription: [
        'Chronic osteomyelitis with bone changes',
        'Occasional drainage or fistula',
        'Periodic antibiotic treatment needed',
      ],
      evidenceNeeded: [
        'Imaging showing osteomyelitis',
        'Documentation of drainage episodes',
        'Treatment records',
      ],
    },
    {
      percent: 20,
      summary: 'With discharging sinus or other evidence of active infection',
      criteriaDescription: [
        'Active infection with drainage',
        'Discharging sinus tract',
        'Requires ongoing treatment',
      ],
      evidenceNeeded: [
        'Documentation of active infection',
        'Imaging studies',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Inactive following repeated episodes without evidence of active infection',
      criteriaDescription: [
        'History of osteomyelitis, now inactive',
        'No current drainage or active infection',
        'Residual bone changes on imaging',
      ],
      evidenceNeeded: [
        'History of prior active disease',
        'Current imaging showing resolution',
        'Documentation of inactive status',
      ],
    },
  ],

  definitions: {
    osteomyelitis: {
      term: 'Osteomyelitis',
      definition: 'Infection of bone, usually bacterial, causing inflammation and bone destruction.',
    },
    sequestrum: {
      term: 'Sequestrum',
      definition: 'Dead piece of bone that has separated from healthy bone during osteomyelitis.',
    },
    involucrum: {
      term: 'Involucrum',
      definition: 'New bone formation that surrounds dead bone (sequestrum) during chronic osteomyelitis.',
    },
    osteonecrosis: {
      term: 'Osteonecrosis',
      definition: 'Death of bone tissue from lack of blood supply. In jaw, often associated with bisphosphonate use or radiation.',
    },
  },

  disclaimer: 'Jaw osteomyelitis is rated using the general osteomyelitis criteria under DC 5000.',
};
export const EYE_CONDITIONS_CRITERIA = {
  diagnosticCode: 'Various',
  condition: 'Eye Conditions (General)',
  cfrReference: '38 CFR 4.75-4.84',

  note: 'General eye conditions are rated based on visual impairment (acuity, field loss) or under the General Rating Formula for Diseases of the Eye if incapacitating episodes occur.',

  ratings: [
    {
      percent: 60,
      summary: 'Incapacitating episodes totaling at least 6 weeks during past 12 months',
      criteriaDescription: [
        'Incapacitating episodes (requiring prescribed bed rest) totaling 6+ weeks in past year',
        'Active pathology with significant visual symptoms',
      ],
      evidenceNeeded: [
        'Medical diagnosis of eye condition',
        'Documentation of incapacitating episodes with dates',
        'Physician-prescribed bed rest orders',
        'Visual acuity and field testing',
      ],
    },
    {
      percent: 40,
      summary: 'Incapacitating episodes totaling at least 4 weeks but less than 6 weeks',
      criteriaDescription: [
        'Incapacitating episodes totaling 4-6 weeks in past year',
      ],
      evidenceNeeded: [
        'Documentation of incapacitating episodes',
        'Treatment records',
      ],
    },
    {
      percent: 20,
      summary: 'Incapacitating episodes totaling at least 2 weeks but less than 4 weeks',
      criteriaDescription: [
        'Incapacitating episodes totaling 2-4 weeks in past year',
      ],
      evidenceNeeded: [
        'Documentation of incapacitating episodes',
      ],
    },
    {
      percent: 10,
      summary: 'Incapacitating episodes totaling at least 1 week but less than 2 weeks',
      criteriaDescription: [
        'Incapacitating episodes totaling 1-2 weeks in past year',
      ],
      evidenceNeeded: [
        'Documentation of episodes',
      ],
    },
  ],

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode (Eye)',
      definition: 'A period of acute symptoms severe enough to require prescribed bed rest and treatment by a physician.',
    },
    visualAcuity: {
      term: 'Visual Acuity',
      definition: 'Sharpness of vision, measured on a standardized chart (e.g., 20/20).',
    },
    visualField: {
      term: 'Visual Field',
      definition: 'The total area in which objects can be seen in peripheral vision while focusing on a central point.',
    },
  },

  disclaimer: 'Most eye conditions are rated based on visual impairment (acuity, field loss) rather than incapacitating episodes. See specific DC for your condition.',
};


// ============================================
// ANALYZE FUNCTIONS
// ============================================

export const analyzeMenieresLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const menieresSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.MENIERES.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const vertigoCount = menieresSymptoms.filter(s => getLogSymptomId(s) === 'menieres-vertigo').length;
  const tinnitusCount = menieresSymptoms.filter(s => getLogSymptomId(s) === 'menieres-tinnitus').length;
  const hearingLossCount = menieresSymptoms.filter(s => getLogSymptomId(s) === 'menieres-hearing-loss').length;
  const nauseaCount = menieresSymptoms.filter(s => getLogSymptomId(s) === 'menieres-nausea').length;

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

export const analyzeTMJLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const tmjSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.TMJ.symptomIds.includes(getLogSymptomId(log)) &&
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
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = tmjSymptoms.filter(s => getLogSymptomId(s) === 'tmj-pain').length;
  const clickingCount = tmjSymptoms.filter(s => getLogSymptomId(s) === 'tmj-clicking').length;
  const limitedOpeningCount = tmjSymptoms.filter(s => getLogSymptomId(s) === 'tmj-limited-opening').length;
  const lockingCount = tmjSymptoms.filter(s => getLogSymptomId(s) === 'tmj-locking').length;
  const headacheCount = tmjSymptoms.filter(s => getLogSymptomId(s) === 'tmj-headache').length;

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

export const analyzeHearingLossLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && getLogSymptomId(log) === 'hearing-loss-noticed';
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

export const analyzeVisionLogs = (logs) => {
  const visionLogs = logs.filter(log =>
      log.eyeData ||
      log.symptomId?.includes('vision') ||
      log.symptomId?.includes('eye') ||
      log.symptomId?.includes('glaucoma') ||
      log.symptomId?.includes('retinopathy') ||
      log.symptomId?.includes('macular')
  );

  if (visionLogs.length === 0) {
    return {
      hasData: false,
      message: 'No vision-related symptoms logged'
    };
  }

  // Analyze visual acuity trends
  const acuityTrends = {
    left: [],
    right: [],
    worstLeft: null,
    worstRight: null,
    betterEye: null
  };

  visionLogs.forEach(log => {
    if (log.eyeData?.leftEyeAcuity) {
      acuityTrends.left.push({
        date: log.timestamp,
        acuity: log.eyeData.leftEyeAcuity
      });
    }
    if (log.eyeData?.rightEyeAcuity) {
      acuityTrends.right.push({
        date: log.timestamp,
        acuity: log.eyeData.rightEyeAcuity
      });
    }
  });

  // Determine the worst visual acuity (for rating purposes)
  const acuityRanking = {
    '20/20': 1, '20/25': 2, '20/30': 3, '20/40': 4, '20/50': 5,
    '20/70': 6, '20/100': 7, '20/200': 8, 'CF': 9, 'HM': 10, 'LP': 11, 'NLP': 12
  };

  if (acuityTrends.left.length > 0) {
    acuityTrends.worstLeft = acuityTrends.left.reduce((worst, current) => {
      const currentRank = acuityRanking[current.acuity] || 0;
      const worstRank = acuityRanking[worst.acuity] || 0;
      return currentRank > worstRank ? current : worst;
    });
  }

  if (acuityTrends.right.length > 0) {
    acuityTrends.worstRight = acuityTrends.right.reduce((worst, current) => {
      const currentRank = acuityRanking[current.acuity] || 0;
      const worstRank = acuityRanking[worst.acuity] || 0;
      return currentRank > worstRank ? current : worst;
    });
  }

  // Determine "better eye" for VA rating
  if (acuityTrends.worstLeft && acuityTrends.worstRight) {
    const leftRank = acuityRanking[acuityTrends.worstLeft.acuity] || 0;
    const rightRank = acuityRanking[acuityTrends.worstRight.acuity] || 0;
    acuityTrends.betterEye = leftRank < rightRank ? 'left' : 'right';
  } else if (acuityTrends.worstLeft) {
    acuityTrends.betterEye = 'left';
  } else if (acuityTrends.worstRight) {
    acuityTrends.betterEye = 'right';
  }

  // Frequency analysis
  const last30Days = visionLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return logDate >= thirtyDaysAgo;
  });

  // Impact on activities
  const activityImpacts = {};
  visionLogs.forEach(log => {
    if (log.eyeData?.affectedActivities) {
      log.eyeData.affectedActivities.forEach(activity => {
        activityImpacts[activity] = (activityImpacts[activity] || 0) + 1;
      });
    }
  });

  // Field of vision defects
  const fieldDefects = {};
  visionLogs.forEach(log => {
    if (log.eyeData?.fieldOfVision) {
      log.eyeData.fieldOfVision.forEach(field => {
        fieldDefects[field] = (fieldDefects[field] || 0) + 1;
      });
    }
  });

  // Evidence gaps
  const gaps = [];
  const hasAcuityMeasurements = acuityTrends.left.length > 0 || acuityTrends.right.length > 0;
  const hasFieldDefectDocs = Object.keys(fieldDefects).length > 0;

  if (!hasAcuityMeasurements) {
    gaps.push('Need formal visual acuity measurements from eye exam');
  }
  if (fieldDefects['peripheral'] || fieldDefects['blind-spots']) {
    gaps.push('Field defects noted - need formal visual field testing (perimetry)');
  }
  gaps.push('Need ophthalmology examination records');
  gaps.push('Need diagnosis documentation');

  // Rating guidance
  let ratingGuidance = 'Vision loss is rated based on visual acuity in the better eye. ';
  if (acuityTrends.betterEye && (acuityTrends.worstLeft || acuityTrends.worstRight)) {
    const betterEyeAcuity = acuityTrends.betterEye === 'left'
        ? acuityTrends.worstLeft.acuity
        : acuityTrends.worstRight.acuity;

    ratingGuidance += `Your logged better eye acuity is ${betterEyeAcuity}. `;

    // Provide rating estimate
    if (betterEyeAcuity === '20/40') {
      ratingGuidance += 'This may support a 10% rating.';
    } else if (betterEyeAcuity === '20/70') {
      ratingGuidance += 'This may support a 30% rating.';
    } else if (betterEyeAcuity === '20/100') {
      ratingGuidance += 'This may support a 40% rating.';
    } else if (betterEyeAcuity === '20/200') {
      ratingGuidance += 'This may support a 50% rating.';
    } else if (['CF', 'HM', 'LP', 'NLP'].includes(betterEyeAcuity)) {
      ratingGuidance += 'This indicates severe vision loss - may support 60-100% rating depending on exact measurements.';
    }
  } else {
    ratingGuidance += 'Log visual acuity measurements from eye exams to determine potential rating.';
  }

  // Determine supported rating based on better eye acuity
  let supportedRating = 0;
  if (acuityTrends.betterEye && (acuityTrends.worstLeft || acuityTrends.worstRight)) {
    const betterEyeAcuity = acuityTrends.betterEye === 'left'
        ? acuityTrends.worstLeft.acuity
        : acuityTrends.worstRight.acuity;

    if (betterEyeAcuity === '20/40') supportedRating = 10;
    else if (betterEyeAcuity === '20/70') supportedRating = 30;
    else if (betterEyeAcuity === '20/100') supportedRating = 40;
    else if (betterEyeAcuity === '20/200') supportedRating = 50;
    else if (betterEyeAcuity === '15/200') supportedRating = 60;
    else if (betterEyeAcuity === '10/200') supportedRating = 70;
    else if (betterEyeAcuity === '5/200') supportedRating = 90;
    else if (betterEyeAcuity === 'CF' || betterEyeAcuity === 'HM' || betterEyeAcuity === 'LP' || betterEyeAcuity === 'NLP') supportedRating = 100;
  }


  // Check for SMC-K qualifying blindness
  const hasBlindnessOneEye = visionLogs.some(log =>
      log.symptomId?.includes('blindness-one-eye') ||
      log.symptomId?.includes('eye-enucleation') ||
      log.symptomId?.includes('eye-prosthetic') ||
      log.eyeData?.anatomicalLoss
  );

  const hasBlindnessBothEyes = visionLogs.some(log =>
      log.symptomId?.includes('blindness-both-eyes')
  );

  // Check for NLP (No Light Perception) in acuity data
  const hasNLPOneEye = (acuityTrends.worstLeft?.acuity === 'NLP' && acuityTrends.worstRight?.acuity !== 'NLP') ||
      (acuityTrends.worstRight?.acuity === 'NLP' && acuityTrends.worstLeft?.acuity !== 'NLP');

  const smcKEligible = hasBlindnessOneEye || hasNLPOneEye;

  if (smcKEligible) {
    gaps.push('⭐ SMC-K eligible: Blindness in one eye documented');
  }

  return {
    hasData: true,
    condition: 'Eye & Vision Conditions',
    diagnosticCode: 'DC 6061-6079',
    supportedRating: supportedRating.toString(),
    totalLogs: visionLogs.length,
    last30Days: last30Days.length,
    acuityTrends,
    mostAffectedActivities: Object.entries(activityImpacts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count })),
    fieldDefects: Object.entries(fieldDefects)
    .map(([field, count]) => ({ field, count })),
    gaps: gaps,
    rationale: gaps,
    evidenceGaps: gaps,
    ratingGuidance,
    criteria: VISION_LOSS_CRITERIA,
    // SMC-K Eligibility
    smcEligible: smcKEligible,
    smcData: smcKEligible ? {
      level: 'K',
      category: 'BLINDNESS_ONE_EYE',
      autoGrant: true,
      note: 'Blindness in one eye (anatomical loss or no light perception) qualifies for SMC-K under 38 CFR § 3.350(a).',
    } : null,
  };
};

export const analyzeToothLossLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const toothLossSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.TOOTH_LOSS.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (toothLossSymptoms.length === 0) {
    return {
      condition: 'Loss of Teeth Due to Bone Loss',
      diagnosticCode: '9913',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No tooth loss symptoms logged',
        'Document number of missing teeth',
        'Specify if tooth loss is from bone loss (trauma, osteomyelitis, disease)',
        'Note: Tooth loss from periodontal disease alone is NOT ratable',
        'Track prosthesis type and whether it restores chewing function',
      ],
      criteria: TOOTH_LOSS_CRITERIA,
      disclaimer: TOOTH_LOSS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Check for dentalData with tooth count
  const logsWithToothCount = toothLossSymptoms.filter(log => log.dentalData?.toothCount);
  const logsWithProsthesis = toothLossSymptoms.filter(log => log.dentalData?.prosthesisType);
  const logsWithCause = toothLossSymptoms.filter(log => log.dentalData?.toothLossCause);

  // Get maximum tooth count from logs
  let maxToothCount = 0;
  let prosthesisRestores = null;
  let causedByBoneLoss = false;

  logsWithToothCount.forEach(log => {
    const count = parseInt(log.dentalData.toothCount);
    if (!isNaN(count) && count > maxToothCount) {
      maxToothCount = count;
    }
  });

  // Check prosthesis function
  if (logsWithProsthesis.length > 0) {
    const lastProsthesisLog = logsWithProsthesis[logsWithProsthesis.length - 1];
    prosthesisRestores = lastProsthesisLog.dentalData.prosthesisFunction === 'restores';
  }

  // Check if caused by bone loss
  if (logsWithCause.length > 0) {
    const causes = logsWithCause.map(log => log.dentalData.toothLossCause);
    causedByBoneLoss = causes.some(cause =>
        ['bone-loss-trauma', 'bone-loss-osteomyelitis', 'bone-loss-disease'].includes(cause)
    );
  }

  evidence.push(`${toothLossSymptoms.length} tooth loss symptoms logged over ${evaluationPeriodDays} days`);

  if (maxToothCount > 0) {
    evidence.push(`Maximum ${maxToothCount} missing teeth documented`);
  }

  if (causedByBoneLoss) {
    evidence.push('Tooth loss attributed to bone loss (trauma/osteomyelitis/disease)');
  }

  if (prosthesisRestores !== null) {
    evidence.push(prosthesisRestores ?
        'Prosthesis DOES restore chewing function (0% rating)' :
        'Prosthesis does NOT restore chewing function (higher rating)'
    );
  }

  // Determine rating based on tooth count and prosthesis function
  if (!causedByBoneLoss) {
    supportedRating = 'Not Ratable';
    ratingRationale.push(
        'CRITICAL: Tooth loss must be due to bone loss from trauma, osteomyelitis, or disease',
        'Tooth loss from periodontal disease alone is NOT compensable by the VA',
        'Document the underlying bone/jaw condition causing tooth loss'
    );
  } else if (prosthesisRestores === true) {
    supportedRating = '0';
    ratingRationale.push(
        `${maxToothCount} teeth lost due to bone loss`,
        'Prosthesis DOES restore masticatory function',
        'Compensable at 0% (documented but not disabling)'
    );
  } else if (maxToothCount === 32) {
    supportedRating = prosthesisRestores === false ? '40' : '30-40';
    ratingRationale.push(
        'Complete loss of all teeth',
        prosthesisRestores === false ?
            'Prosthesis does NOT restore function = 40%' :
            'Need to document if prosthesis restores function'
    );
  } else if (maxToothCount >= 16) {
    supportedRating = prosthesisRestores === false ? '30' : '20-30';
    ratingRationale.push(
        `Loss of ${maxToothCount} teeth (all upper OR all lower)`,
        prosthesisRestores === false ?
            'Prosthesis does NOT restore function = 30%' :
            'Need to document if prosthesis restores function'
    );
  } else if (maxToothCount >= 8) {
    supportedRating = prosthesisRestores === false ? '20' : '10-20';
    ratingRationale.push(
        `Loss of ${maxToothCount} teeth`,
        'Likely qualifies for 10-20% depending on location and prosthesis function'
    );
  } else if (maxToothCount > 0) {
    supportedRating = prosthesisRestores === false ? '10' : '0-10';
    ratingRationale.push(
        `Loss of ${maxToothCount} teeth`,
        'May qualify for 10% if prosthesis does not restore function'
    );
  }

  // Documentation gaps
  if (maxToothCount === 0) {
    gaps.push('Document the exact number of missing teeth');
  }

  if (!causedByBoneLoss) {
    gaps.push('⚠️ CRITICAL: Confirm tooth loss is due to bone loss (NOT periodontal disease)');
    gaps.push('Document underlying bone/jaw condition (trauma, osteomyelitis, radiation, tumor)');
  }

  if (prosthesisRestores === null) {
    gaps.push('Document whether prosthesis/denture restores chewing ability');
  }

  gaps.push('Specify tooth locations: anterior (front) vs. posterior (back)');
  gaps.push('Track dietary restrictions caused by tooth loss');
  gaps.push('Dental examination records are essential evidence');

  return {
    condition: 'Loss of Teeth Due to Bone Loss',
    diagnosticCode: '9913',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: TOOTH_LOSS_CRITERIA,
    disclaimer: TOOTH_LOSS_CRITERIA.disclaimer,
  };
};

export const analyzeMandibleNonunionLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const mandibleSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.MANDIBLE_NONUNION.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (mandibleSymptoms.length === 0) {
    return {
      condition: 'Mandible Nonunion or Malunion',
      diagnosticCode: '9903-9904',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No mandible fracture symptoms logged',
        'Document jaw instability or deformity',
        'Track bite problems and chewing difficulty',
        'X-rays or CT scans showing nonunion/malunion are critical',
        'Surgical records from fracture repair',
      ],
      criteria: MANDIBLE_NONUNION_CRITERIA,
      disclaimer: MANDIBLE_NONUNION_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptom types
  const jawPainCount = mandibleSymptoms.filter(s => getLogSymptomId(s) === 'jaw-pain').length;
  const jawInstabilityCount = mandibleSymptoms.filter(s => getLogSymptomId(s) === 'jaw-instability').length;
  const chewingDifficultyCount = mandibleSymptoms.filter(s => getLogSymptomId(s) === 'chewing-difficulty').length;
  const facialAsymmetryCount = mandibleSymptoms.filter(s => getLogSymptomId(s) === 'facial-asymmetry').length;

  evidence.push(`${mandibleSymptoms.length} mandible symptoms logged over ${evaluationPeriodDays} days`);

  if (jawPainCount > 0) evidence.push(`${jawPainCount} jaw pain episodes`);
  if (jawInstabilityCount > 0) evidence.push(`${jawInstabilityCount} jaw instability episodes`);
  if (chewingDifficultyCount > 0) evidence.push(`${chewingDifficultyCount} chewing difficulty episodes`);
  if (facialAsymmetryCount > 0) evidence.push(`${facialAsymmetryCount} facial asymmetry episodes`);

  // Determine rating
  if (jawInstabilityCount >= 5 && chewingDifficultyCount >= 5) {
    supportedRating = '30';
    ratingRationale.push(
        `${jawInstabilityCount} jaw instability episodes indicate nonunion or severe malunion`,
        `${chewingDifficultyCount} episodes of chewing difficulty`,
        'Symptoms suggest marked functional impairment = 30%'
    );
  } else if (mandibleSymptoms.length >= 8 && (jawPainCount >= 5 || chewingDifficultyCount >= 3)) {
    supportedRating = '10';
    ratingRationale.push(
        `${mandibleSymptoms.length} documented symptoms`,
        'Moderate malunion with some functional impairment = 10%'
    );
  } else {
    supportedRating = '10';
    ratingRationale.push(
        'Mandible fracture complications documented',
        'Supports 10% rating for moderate malunion'
    );
  }

  // Documentation gaps
  gaps.push('⚠️ CRITICAL: X-rays or CT scans showing nonunion/malunion are required');
  gaps.push('Document jaw opening limitation if present');
  gaps.push('Track facial deformity and bite problems (malocclusion)');
  gaps.push('Surgical records from fracture treatment');

  if (jawInstabilityCount === 0) {
    gaps.push('Document jaw instability episodes if present');
  }

  if (chewingDifficultyCount < 5) {
    gaps.push('Log more chewing difficulty episodes to support higher rating');
  }

  return {
    condition: 'Mandible Nonunion or Malunion',
    diagnosticCode: '9903-9904',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: MANDIBLE_NONUNION_CRITERIA,
    disclaimer: MANDIBLE_NONUNION_CRITERIA.disclaimer,
  };
};

export const analyzeMalignantOralNeoplasmLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const neoplasmSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.MALIGNANT_ORAL_NEOPLASM.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (neoplasmSymptoms.length === 0) {
    return {
      condition: 'Malignant Neoplasm of Oral Cavity',
      diagnosticCode: '9918',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No oral neoplasm symptoms logged',
        'Document oral masses, growths, or tissue changes',
        'Biopsy results confirming malignancy',
        'All treatment dates (surgery, chemo, radiation)',
        'Track side effects and residual impairments',
      ],
      criteria: MALIGNANT_ORAL_NEOPLASM_CRITERIA,
      disclaimer: MALIGNANT_ORAL_NEOPLASM_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Check for treatment status in dentalData
  let activeTreatment = false;
  let malignant = false;

  const logsWithMassData = neoplasmSymptoms.filter(log => log.dentalData?.oralMass);
  if (logsWithMassData.length > 0) {
    const latestLog = logsWithMassData[logsWithMassData.length - 1];
    malignant = latestLog.dentalData.massBiopsy === 'malignant';
    activeTreatment = ['active-treatment', 'post-surgical'].includes(latestLog.dentalData.treatmentStatus);
  }

  evidence.push(`${neoplasmSymptoms.length} oral neoplasm symptoms logged over ${evaluationPeriodDays} days`);

  if (malignant) {
    evidence.push('Biopsy confirmed malignant (cancerous)');
  }

  if (activeTreatment) {
    evidence.push('Currently in active treatment or recently post-surgical');
  }

  // Determine rating
  if (malignant && activeTreatment) {
    supportedRating = '100';
    ratingRationale.push(
        '⚠️ Malignant oral cancer = AUTOMATIC 100% rating',
        '100% during active treatment AND for 6 months after completion',
        'Document all treatment dates carefully',
        'After 6-month period, rate based on residual effects'
    );
  } else if (malignant) {
    supportedRating = 'Varies';
    ratingRationale.push(
        'Malignant oral cancer confirmed',
        'If in active treatment or within 6 months post-treatment: 100%',
        'If >6 months post-treatment: rate based on residuals',
        'Residuals include: tissue loss, scarring, difficulty swallowing/speaking, TMJ dysfunction'
    );
  } else {
    supportedRating = 'Requires Evaluation';
    ratingRationale.push(
        'Oral mass documented',
        'Biopsy results needed to determine malignancy',
        'Rating depends on whether mass is malignant or benign'
    );
  }

  // Documentation gaps
  if (!malignant) {
    gaps.push('⚠️ CRITICAL: Biopsy results needed to confirm malignancy');
  }

  gaps.push('Document all treatment dates: surgery, chemotherapy, radiation');
  gaps.push('Track side effects: pain, difficulty eating/speaking, weight loss');
  gaps.push('After treatment, document residual effects (tissue loss, scarring, function)');
  gaps.push('Oncology records and treatment summaries are essential');

  if (malignant) {
    gaps.push('If recurrence occurs, this restarts the 100% rating period');
  }

  return {
    condition: 'Malignant Neoplasm of Oral Cavity',
    diagnosticCode: '9918',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: MALIGNANT_ORAL_NEOPLASM_CRITERIA,
    disclaimer: MALIGNANT_ORAL_NEOPLASM_CRITERIA.disclaimer,
  };
};

export const analyzeBenignOralNeoplasmLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const neoplasmSymptoms = logs.filter(log =>
      DENTAL_VISUAL_CONDITIONS.BENIGN_ORAL_NEOPLASM.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (neoplasmSymptoms.length === 0) {
    return {
      condition: 'Benign Neoplasm of Oral Cavity',
      diagnosticCode: '9917',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No oral neoplasm symptoms logged',
        'Document oral masses, growths, or tissue changes',
        'Biopsy results confirming benign status',
        'Track impact on chewing, swallowing, speaking',
        'Document size and location of mass',
      ],
      criteria: BENIGN_ORAL_NEOPLASM_CRITERIA,
      disclaimer: BENIGN_ORAL_NEOPLASM_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Check for mass data
  let benign = false;
  let massLocation = '';

  const logsWithMassData = neoplasmSymptoms.filter(log => log.dentalData?.oralMass);
  if (logsWithMassData.length > 0) {
    const latestLog = logsWithMassData[logsWithMassData.length - 1];
    benign = latestLog.dentalData.massBiopsy === 'benign';
    massLocation = latestLog.dentalData.massLocation || '';
  }

  evidence.push(`${neoplasmSymptoms.length} oral neoplasm symptoms logged over ${evaluationPeriodDays} days`);

  if (benign) {
    evidence.push('Biopsy confirmed benign (non-cancerous)');
  }

  if (massLocation) {
    evidence.push(`Mass location documented: ${massLocation}`);
  }

  // Determine rating
  if (benign) {
    supportedRating = 'Varies';
    ratingRationale.push(
        'Benign oral neoplasm confirmed',
        'No automatic 100% rating (unlike malignant)',
        'Rate based on functional impairment:',
        '  • Tissue loss/bone damage (DC 9900-9916)',
        '  • TMJ dysfunction if present (DC 9905)',
        '  • Tooth loss if applicable (DC 9913)',
        '  • Disfigurement (DC 7800)',
        '  • Speech/swallowing difficulty'
    );
  } else {
    supportedRating = 'Requires Evaluation';
    ratingRationale.push(
        'Oral mass documented',
        'Biopsy results needed to confirm benign status',
        'Rating depends on functional effects of the mass'
    );
  }

  // Documentation gaps
  if (!benign) {
    gaps.push('Biopsy results needed to confirm benign (non-cancerous) status');
  }

  gaps.push('Document impact on eating, speaking, and appearance');
  gaps.push('Imaging studies (CT, MRI) showing size and location');
  gaps.push('Track pain or discomfort from the mass');
  gaps.push('If surgically removed, document residual effects');

  if (benign) {
    gaps.push('Benign tumors rated based on functional impairment, not just presence');
    gaps.push('May need multiple diagnostic codes for various impairments');
  }

  return {
    condition: 'Benign Neoplasm of Oral Cavity',
    diagnosticCode: '9917',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: BENIGN_ORAL_NEOPLASM_CRITERIA,
    disclaimer: BENIGN_ORAL_NEOPLASM_CRITERIA.disclaimer,
  };
};

export const analyzeUveitis = (logs) => {
  const symptomIds = DENTAL_VISUAL_CONDITIONS.UVEITIS.symptomIds;
  const conditionLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomIds.includes(symptomId);
  });

  if (conditionLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = conditionLogs.length;
  const severityLogs = conditionLogs.filter(log => log.severity != null);
  const avgSeverity = severityLogs.length > 0
      ? severityLogs.reduce((sum, log) => sum + log.severity, 0) / severityLogs.length
      : 0;

  // Count treatment visits
  const treatmentVisits = countEyeTreatmentVisits(conditionLogs, 'uveitis');

  // Identify location/type
  const hasAnterior = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-anterior');
  const hasIntermediate = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-intermediate');
  const hasPosterior = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-posterior');
  const hasPanuveitis = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-panuveitis');

  // Identify laterality
  const isBilateral = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-bilateral');
  const isUnilateral = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-unilateral');

  // Check for advanced treatments (indicates severity)
  const hasImmunosuppressants = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-immunosuppressants');
  const hasBiologics = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-biologic-agents');
  const hasIntravitreal = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-intravitreal-injection');
  const hasPeriocular = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-periocular-injection');
  const hasLaser = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-laser-treatment');
  const hasSurgery = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-surgery');

  // Check for complications
  const hasGlaucoma = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-glaucoma');
  const hasCataract = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-cataract');
  const hasMacularEdema = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-macular-edema');
  const hasSynechiae = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-synechiae');
  const isChronic = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-chronic');
  const hasVisualAcuityLoss = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-visual-acuity-decreased');
  const hasVisualFieldLoss = conditionLogs.some(log => getLogSymptomId(log) === 'uveitis-visual-field-loss');

  // Determine rating based on treatment visits
  let supportedRating = getEyeRatingFromVisits(treatmentVisits);

  // Build rationale
  const ratingRationale = [];

  if (treatmentVisits >= 7) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 60% rating`);
  } else if (treatmentVisits >= 5) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 40% rating`);
  } else if (treatmentVisits >= 3) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 20% rating`);
  } else if (treatmentVisits >= 1) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visit(s) in past 12 months, supporting 10% rating`);
  } else {
    ratingRationale.push('No documented treatment visits - log clinic visits for eye condition treatment');
  }

  // Location information
  const locations = [];
  if (hasAnterior) locations.push('anterior (iritis)');
  if (hasIntermediate) locations.push('intermediate (cyclitis)');
  if (hasPosterior) locations.push('posterior (choroiditis)');
  if (hasPanuveitis) locations.push('panuveitis');
  if (locations.length > 0) {
    ratingRationale.push(`Uveitis type: ${locations.join(', ')}`);
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral involvement documented');
  } else if (isUnilateral) {
    ratingRationale.push('Unilateral involvement documented');
  }

  // Advanced treatments
  const advancedTreatments = [];
  if (hasImmunosuppressants) advancedTreatments.push('immunosuppressants');
  if (hasBiologics) advancedTreatments.push('biologic agents');
  if (hasIntravitreal) advancedTreatments.push('intravitreal injections');
  if (hasPeriocular) advancedTreatments.push('periocular injections');
  if (hasLaser) advancedTreatments.push('laser treatment');
  if (hasSurgery) advancedTreatments.push('surgery');
  if (advancedTreatments.length > 0) {
    ratingRationale.push(`Advanced treatments documented: ${advancedTreatments.join(', ')}`);
  }

  // Complications
  const complications = [];
  if (hasGlaucoma) complications.push('secondary glaucoma');
  if (hasCataract) complications.push('cataract');
  if (hasMacularEdema) complications.push('macular edema');
  if (hasSynechiae) complications.push('synechiae');
  if (complications.length > 0) {
    ratingRationale.push(`Complications documented: ${complications.join(', ')} - may warrant separate rating`);
  }

  if (isChronic) {
    ratingRationale.push('Chronic/recurrent uveitis documented');
  }

  if (hasVisualAcuityLoss || hasVisualFieldLoss) {
    ratingRationale.push('Visual impairment documented - consider rating under DC 6061-6091 if higher');
  }

  // Build gaps
  const gaps = [];
  if (treatmentVisits === 0) {
    gaps.push('Log each clinic visit for uveitis treatment as a "Treatment Visit" symptom');
  }
  if (treatmentVisits > 0 && treatmentVisits < 7) {
    gaps.push(`${7 - treatmentVisits} more treatment visits would support 60% rating`);
  }
  if (locations.length === 0) {
    gaps.push('Document uveitis type (anterior, intermediate, posterior, or panuveitis)');
  }
  if (!isBilateral && !isUnilateral) {
    gaps.push('Document whether condition affects one eye (unilateral) or both eyes (bilateral)');
  }
  if (!isChronic && totalLogs > 5) {
    gaps.push('If condition is chronic or recurrent, document this pattern');
  }
  if (hasGlaucoma || hasCataract || hasMacularEdema) {
    gaps.push('Complications may be rated separately - ensure visual acuity is documented');
  }
  if (advancedTreatments.length === 0 && treatmentVisits > 2) {
    gaps.push('Document specific treatments received (injections, immunosuppressants, etc.)');
  }

  return {
    hasData: true,
    condition: 'Uveitis / Choroidopathy',
    diagnosticCode: '6000',
    cfrReference: '38 CFR 4.79',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      treatmentVisits,
      isBilateral,
      isChronic,
      hasComplications: complications.length > 0,
      complicationCount: complications.length,
    },
    criteria: UVEITIS_CRITERIA,
  };
};

export const analyzeKeratitis = (logs) => {
  const symptomIds = DENTAL_VISUAL_CONDITIONS.KERATITIS.symptomIds;
  const conditionLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomIds.includes(symptomId);
  });

  if (conditionLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = conditionLogs.length;
  const severityLogs = conditionLogs.filter(log => log.severity != null);
  const avgSeverity = severityLogs.length > 0
      ? severityLogs.reduce((sum, log) => sum + log.severity, 0) / severityLogs.length
      : 0;

  // Count treatment visits
  const treatmentVisits = countEyeTreatmentVisits(conditionLogs, 'keratitis');

  // Identify type/cause
  const isBacterial = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-bacterial');
  const isViral = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-viral');
  const isFungal = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-fungal');
  const isAcanthamoeba = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-acanthamoeba');
  const isExposure = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-exposure');
  const isNeurotrophic = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-neurotrophic');

  // Identify laterality
  const isBilateral = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-bilateral');
  const isUnilateral = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-unilateral');

  // Check for treatments
  const hasAntibiotics = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-antibiotic-drops');
  const hasAntivirals = conditionLogs.some(log =>
      getLogSymptomId(log) === 'keratitis-antiviral-drops' || getLogSymptomId(log) === 'keratitis-oral-antivirals'
  );
  const hasAntifungals = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-antifungal-drops');
  const hasSteroids = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-steroid-drops');
  const hasBandageLens = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-bandage-lens');
  const hasCornealScraping = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-corneal-scraping');
  const hasCornealTransplant = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-corneal-transplant');

  // Check for complications
  const hasCornealUlcer = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-corneal-ulcer');
  const hasCornealScarring = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-corneal-scarring');
  const hasCornealPerforation = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-corneal-perforation');
  const isChronic = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-chronic-recurrent');
  const hasVisualAcuityLoss = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-visual-acuity-decreased');
  const hasGlareSensitivity = conditionLogs.some(log => getLogSymptomId(log) === 'keratitis-glare-sensitivity');

  // Determine rating based on treatment visits
  let supportedRating = getEyeRatingFromVisits(treatmentVisits);

  // Build rationale
  const ratingRationale = [];

  if (treatmentVisits >= 7) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 60% rating`);
  } else if (treatmentVisits >= 5) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 40% rating`);
  } else if (treatmentVisits >= 3) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 20% rating`);
  } else if (treatmentVisits >= 1) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visit(s) in past 12 months, supporting 10% rating`);
  } else {
    ratingRationale.push('No documented treatment visits - log clinic visits for eye condition treatment');
  }

  // Type information
  const types = [];
  if (isBacterial) types.push('bacterial');
  if (isViral) types.push('viral (herpes)');
  if (isFungal) types.push('fungal');
  if (isAcanthamoeba) types.push('acanthamoeba');
  if (isExposure) types.push('exposure keratopathy');
  if (isNeurotrophic) types.push('neurotrophic');
  if (types.length > 0) {
    ratingRationale.push(`Keratitis type: ${types.join(', ')}`);
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral involvement documented');
  } else if (isUnilateral) {
    ratingRationale.push('Unilateral involvement documented');
  }

  // Treatments
  const treatments = [];
  if (hasAntibiotics) treatments.push('antibiotic drops');
  if (hasAntivirals) treatments.push('antiviral medication');
  if (hasAntifungals) treatments.push('antifungal drops');
  if (hasSteroids) treatments.push('steroid drops');
  if (hasBandageLens) treatments.push('bandage contact lens');
  if (hasCornealScraping) treatments.push('corneal scraping/debridement');
  if (hasCornealTransplant) treatments.push('corneal transplant');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatments documented: ${treatments.join(', ')}`);
  }

  // Complications
  const complications = [];
  if (hasCornealUlcer) complications.push('corneal ulcer');
  if (hasCornealScarring) complications.push('corneal scarring');
  if (hasCornealPerforation) complications.push('corneal perforation');
  if (complications.length > 0) {
    ratingRationale.push(`Complications documented: ${complications.join(', ')} - may affect visual acuity rating`);
  }

  if (isChronic) {
    ratingRationale.push('Chronic/recurrent keratitis documented');
  }

  if (hasVisualAcuityLoss) {
    ratingRationale.push('Visual impairment documented - consider rating under DC 6061-6091 if higher');
  }

  // Build gaps
  const gaps = [];
  if (treatmentVisits === 0) {
    gaps.push('Log each clinic visit for keratitis treatment as a "Treatment Visit" symptom');
  }
  if (treatmentVisits > 0 && treatmentVisits < 7) {
    gaps.push(`${7 - treatmentVisits} more treatment visits would support 60% rating`);
  }
  if (types.length === 0) {
    gaps.push('Document keratitis type (bacterial, viral, fungal, etc.)');
  }
  if (!isBilateral && !isUnilateral) {
    gaps.push('Document whether condition affects one eye (unilateral) or both eyes (bilateral)');
  }
  if (!isChronic && totalLogs > 5) {
    gaps.push('If condition is chronic or recurrent, document this pattern');
  }
  if (hasCornealScarring && !hasVisualAcuityLoss) {
    gaps.push('Corneal scarring present - document any visual acuity changes');
  }
  if (treatments.length === 0 && treatmentVisits > 0) {
    gaps.push('Document specific treatments received (antibiotic drops, antivirals, procedures, etc.)');
  }

  return {
    hasData: true,
    condition: 'Keratitis / Keratopathy',
    diagnosticCode: '6001',
    cfrReference: '38 CFR 4.79',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      treatmentVisits,
      isBilateral,
      isChronic,
      hasComplications: complications.length > 0,
      complicationCount: complications.length,
    },
    criteria: KERATITIS_CRITERIA,
  };
};

export const analyzeChronicConjunctivitis = (logs) => {
  const symptomIds = DENTAL_VISUAL_CONDITIONS.CHRONIC_CONJUNCTIVITIS.symptomIds;
  const conditionLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomIds.includes(symptomId);
  });

  if (conditionLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = conditionLogs.length;
  const severityLogs = conditionLogs.filter(log => log.severity != null);
  const avgSeverity = severityLogs.length > 0
      ? severityLogs.reduce((sum, log) => sum + log.severity, 0) / severityLogs.length
      : 0;

  // Count treatment visits
  const treatmentVisits = countEyeTreatmentVisits(conditionLogs, 'conj');

  // Identify type
  const isAllergic = conditionLogs.some(log => getLogSymptomId(log) === 'conj-allergic');
  const isBacterial = conditionLogs.some(log => getLogSymptomId(log) === 'conj-bacterial');
  const isViral = conditionLogs.some(log => getLogSymptomId(log) === 'conj-viral');
  const isGiantPapillary = conditionLogs.some(log => getLogSymptomId(log) === 'conj-giant-papillary');
  const isAtopic = conditionLogs.some(log => getLogSymptomId(log) === 'conj-atopic');

  // Identify status (critical for DC 6018)
  const isActive = conditionLogs.some(log => getLogSymptomId(log) === 'conj-active');
  const isInactive = conditionLogs.some(log => getLogSymptomId(log) === 'conj-inactive');
  const isChronic = conditionLogs.some(log => getLogSymptomId(log) === 'conj-chronic');
  const isRecurrent = conditionLogs.some(log => getLogSymptomId(log) === 'conj-recurrent');

  // Identify laterality
  const isBilateral = conditionLogs.some(log => getLogSymptomId(log) === 'conj-bilateral');
  const isUnilateral = conditionLogs.some(log => getLogSymptomId(log) === 'conj-unilateral');

  // Check for treatments
  const hasArtificialTears = conditionLogs.some(log => getLogSymptomId(log) === 'conj-artificial-tears');
  const hasAntihistamineDrops = conditionLogs.some(log => getLogSymptomId(log) === 'conj-antihistamine-drops');
  const hasMastCellStabilizer = conditionLogs.some(log => getLogSymptomId(log) === 'conj-mast-cell-stabilizer');
  const hasAntibioticDrops = conditionLogs.some(log => getLogSymptomId(log) === 'conj-antibiotic-drops');
  const hasSteroidDrops = conditionLogs.some(log => getLogSymptomId(log) === 'conj-steroid-drops');
  const hasImmunomodulator = conditionLogs.some(log => getLogSymptomId(log) === 'conj-immunomodulator');
  const hasOralAntihistamines = conditionLogs.some(log => getLogSymptomId(log) === 'conj-oral-antihistamines');

  // Check for residuals (for inactive rating)
  const hasScarring = conditionLogs.some(log => getLogSymptomId(log) === 'conj-scarring');
  const hasSymblepharon = conditionLogs.some(log => getLogSymptomId(log) === 'conj-symblepharon');
  const hasDryEye = conditionLogs.some(log => getLogSymptomId(log) === 'conj-dry-eye');
  const hasDisfigurement = conditionLogs.some(log => getLogSymptomId(log) === 'conj-disfigurement');
  const hasVisualImpairment = conditionLogs.some(log => getLogSymptomId(log) === 'conj-visual-impairment');

  // Determine rating based on treatment visits and active/inactive status
  let supportedRating = getEyeRatingFromVisits(treatmentVisits);

  // DC 6018 special rule: Active conjunctivitis has minimum 10% rating
  // If marked as active but no treatment visits logged, still gets minimum 10%
  if (isActive && supportedRating < 10) {
    supportedRating = 10;
  }

  // Build rationale
  const ratingRationale = [];

  // Active vs Inactive status
  if (isActive) {
    ratingRationale.push('ACTIVE chronic conjunctivitis - minimum 10% rating applies');
    if (treatmentVisits >= 7) {
      ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 60% rating`);
    } else if (treatmentVisits >= 5) {
      ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 40% rating`);
    } else if (treatmentVisits >= 3) {
      ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 20% rating`);
    } else if (treatmentVisits >= 1) {
      ratingRationale.push(`Documented ${treatmentVisits} treatment visit(s) in past 12 months, supporting 10% rating`);
    }
  } else if (isInactive) {
    ratingRationale.push('INACTIVE conjunctivitis - rate based on residuals (visual impairment, disfigurement)');
    if (hasVisualImpairment) {
      ratingRationale.push('Visual impairment documented - rate under DC 6061-6091');
    }
    if (hasDisfigurement) {
      ratingRationale.push('Disfigurement documented - may rate under DC 7800');
    }
    if (!hasVisualImpairment && !hasDisfigurement && !hasScarring && !hasSymblepharon) {
      supportedRating = 0;
      ratingRationale.push('No residuals documented - 0% rating for inactive without residuals');
    }
  } else {
    // Status not specified - use treatment visits
    if (treatmentVisits >= 1) {
      ratingRationale.push('Active status not specified - rating based on treatment visits');
      ratingRationale.push(`Documented ${treatmentVisits} treatment visit(s) in past 12 months`);
    } else {
      ratingRationale.push('Document whether conjunctivitis is active or inactive for accurate rating');
    }
  }

  // Type information
  const types = [];
  if (isAllergic) types.push('allergic');
  if (isBacterial) types.push('bacterial');
  if (isViral) types.push('viral');
  if (isGiantPapillary) types.push('giant papillary (contact lens)');
  if (isAtopic) types.push('atopic');
  if (types.length > 0) {
    ratingRationale.push(`Conjunctivitis type: ${types.join(', ')}`);
  }

  // Chronicity
  if (isChronic) {
    ratingRationale.push('Chronic conjunctivitis (>4 weeks duration) documented');
  }
  if (isRecurrent) {
    ratingRationale.push('Recurrent episodes documented');
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral involvement documented');
  } else if (isUnilateral) {
    ratingRationale.push('Unilateral involvement documented');
  }

  // Treatments
  const treatments = [];
  if (hasArtificialTears) treatments.push('artificial tears');
  if (hasAntihistamineDrops) treatments.push('antihistamine drops');
  if (hasMastCellStabilizer) treatments.push('mast cell stabilizer');
  if (hasAntibioticDrops) treatments.push('antibiotic drops');
  if (hasSteroidDrops) treatments.push('steroid drops');
  if (hasImmunomodulator) treatments.push('immunomodulator (cyclosporine)');
  if (hasOralAntihistamines) treatments.push('oral antihistamines');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatments documented: ${treatments.join(', ')}`);
  }

  // Residuals
  const residuals = [];
  if (hasScarring) residuals.push('conjunctival scarring');
  if (hasSymblepharon) residuals.push('symblepharon');
  if (hasDryEye) residuals.push('secondary dry eye');
  if (residuals.length > 0) {
    ratingRationale.push(`Residuals documented: ${residuals.join(', ')}`);
  }

  // Build gaps
  const gaps = [];
  if (!isActive && !isInactive) {
    gaps.push('IMPORTANT: Document whether conjunctivitis is ACTIVE or INACTIVE - this determines rating method');
  }
  if (treatmentVisits === 0 && isActive) {
    gaps.push('Log each clinic visit for conjunctivitis treatment as a "Treatment Visit" symptom');
  }
  if (treatmentVisits > 0 && treatmentVisits < 7 && isActive) {
    gaps.push(`${7 - treatmentVisits} more treatment visits would support 60% rating`);
  }
  if (!isChronic && !isRecurrent) {
    gaps.push('Document chronic nature (>4 weeks) or recurrent pattern');
  }
  if (types.length === 0) {
    gaps.push('Document conjunctivitis type (allergic, bacterial, viral, etc.)');
  }
  if (!isBilateral && !isUnilateral) {
    gaps.push('Document whether condition affects one eye (unilateral) or both eyes (bilateral)');
  }
  if (isInactive && !hasVisualImpairment && !hasDisfigurement) {
    gaps.push('For inactive conjunctivitis, document any residuals (visual impairment, scarring, disfigurement)');
  }

  return {
    hasData: true,
    condition: 'Chronic Conjunctivitis',
    diagnosticCode: '6018',
    cfrReference: '38 CFR 4.79',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      treatmentVisits,
      isActive,
      isInactive,
      isBilateral,
      isChronic: isChronic || isRecurrent,
      hasResiduals: residuals.length > 0,
      residualCount: residuals.length,
    },
    criteria: CHRONIC_CONJUNCTIVITIS_CRITERIA,
  };
};

export const analyzeScleritis = (logs) => {
  const symptomIds = DENTAL_VISUAL_CONDITIONS.SCLERITIS.symptomIds;
  const conditionLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomIds.includes(symptomId);
  });

  if (conditionLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = conditionLogs.length;
  const severityLogs = conditionLogs.filter(log => log.severity != null);
  const avgSeverity = severityLogs.length > 0
      ? severityLogs.reduce((sum, log) => sum + log.severity, 0) / severityLogs.length
      : 0;

  // Count treatment visits
  const treatmentVisits = countEyeTreatmentVisits(conditionLogs, 'scleritis');

  // Identify type
  const isDiffuse = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-anterior-diffuse');
  const isNodular = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-anterior-nodular');
  const isNecrotizing = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-necrotizing');
  const isPosterior = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-posterior');

  // Identify laterality
  const isBilateral = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-bilateral');
  const isUnilateral = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-unilateral');

  // Associated conditions
  const isAutoimmune = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-autoimmune');
  const isInfectious = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-infectious');

  // Check for treatments
  const hasNSAIDs = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-nsaid-oral');
  const hasOralSteroids = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-oral-steroids');
  const hasImmunosuppressants = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-immunosuppressants');
  const hasBiologics = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-biologic-agents');
  const hasSubconjunctivalInjection = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-subconjunctival-injection');
  const hasSurgery = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-surgery');

  // Check for complications
  const hasScleralThinning = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-scleral-thinning');
  const hasScleromalacia = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-scleromalacia');
  const hasUveitis = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-uveitis');
  const hasGlaucoma = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-glaucoma');
  const hasCataract = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-cataract');
  const isChronic = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-chronic-recurrent');
  const hasVisualAcuityLoss = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-visual-acuity-decreased');
  const hasPermanentVisionLoss = conditionLogs.some(log => getLogSymptomId(log) === 'scleritis-vision-loss-permanent');

  // Determine rating based on treatment visits
  let supportedRating = getEyeRatingFromVisits(treatmentVisits);

  // Build rationale
  const ratingRationale = [];

  if (treatmentVisits >= 7) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 60% rating`);
  } else if (treatmentVisits >= 5) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 40% rating`);
  } else if (treatmentVisits >= 3) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visits in past 12 months, supporting 20% rating`);
  } else if (treatmentVisits >= 1) {
    ratingRationale.push(`Documented ${treatmentVisits} treatment visit(s) in past 12 months, supporting 10% rating`);
  } else {
    ratingRationale.push('No documented treatment visits - log clinic visits for eye condition treatment');
  }

  // Type information
  const types = [];
  if (isDiffuse) types.push('anterior diffuse');
  if (isNodular) types.push('anterior nodular');
  if (isNecrotizing) types.push('NECROTIZING (severe)');
  if (isPosterior) types.push('posterior');
  if (types.length > 0) {
    ratingRationale.push(`Scleritis type: ${types.join(', ')}`);
  }

  // Severity indicator for necrotizing
  if (isNecrotizing) {
    ratingRationale.push('⚠️ Necrotizing scleritis is the most severe form - high risk of vision loss');
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral involvement documented');
  } else if (isUnilateral) {
    ratingRationale.push('Unilateral involvement documented');
  }

  // Associated conditions
  if (isAutoimmune) {
    ratingRationale.push('Associated with autoimmune disease - systemic condition may warrant separate rating');
  }
  if (isInfectious) {
    ratingRationale.push('Infectious etiology documented');
  }

  // Treatments
  const treatments = [];
  if (hasNSAIDs) treatments.push('oral NSAIDs');
  if (hasOralSteroids) treatments.push('oral corticosteroids');
  if (hasImmunosuppressants) treatments.push('immunosuppressants');
  if (hasBiologics) treatments.push('biologic agents');
  if (hasSubconjunctivalInjection) treatments.push('subconjunctival injection');
  if (hasSurgery) treatments.push('surgical intervention');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatments documented: ${treatments.join(', ')}`);
  }

  // Complications
  const complications = [];
  if (hasScleralThinning) complications.push('scleral thinning');
  if (hasScleromalacia) complications.push('scleromalacia');
  if (hasUveitis) complications.push('secondary uveitis');
  if (hasGlaucoma) complications.push('secondary glaucoma');
  if (hasCataract) complications.push('cataract');
  if (complications.length > 0) {
    ratingRationale.push(`Complications documented: ${complications.join(', ')} - may warrant separate ratings`);
  }

  if (isChronic) {
    ratingRationale.push('Chronic/recurrent scleritis documented');
  }

  if (hasVisualAcuityLoss || hasPermanentVisionLoss) {
    ratingRationale.push('Visual impairment documented - consider rating under DC 6061-6091 if higher');
  }

  // Build gaps
  const gaps = [];
  if (treatmentVisits === 0) {
    gaps.push('Log each clinic visit for scleritis treatment as a "Treatment Visit" symptom');
  }
  if (treatmentVisits > 0 && treatmentVisits < 7) {
    gaps.push(`${7 - treatmentVisits} more treatment visits would support 60% rating`);
  }
  if (types.length === 0) {
    gaps.push('Document scleritis type (diffuse, nodular, necrotizing, or posterior)');
  }
  if (!isBilateral && !isUnilateral) {
    gaps.push('Document whether condition affects one eye (unilateral) or both eyes (bilateral)');
  }
  if (!isAutoimmune && !isInfectious) {
    gaps.push('Document associated conditions (autoimmune disease, infection) if applicable');
  }
  if (!isChronic && totalLogs > 5) {
    gaps.push('If condition is chronic or recurrent, document this pattern');
  }
  if (isNecrotizing && !hasScleralThinning && !hasScleromalacia) {
    gaps.push('Necrotizing scleritis - document scleral thinning or scleromalacia if present');
  }
  if (hasUveitis) {
    gaps.push('Secondary uveitis present - may be rated separately under DC 6000');
  }
  if (hasGlaucoma) {
    gaps.push('Secondary glaucoma present - may be rated separately under DC 6012/6013');
  }

  return {
    hasData: true,
    condition: 'Scleritis',
    diagnosticCode: '6002',
    cfrReference: '38 CFR 4.79',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      treatmentVisits,
      isBilateral,
      isChronic,
      isNecrotizing,
      hasComplications: complications.length > 0,
      complicationCount: complications.length,
      hasAutoimmune: isAutoimmune,
    },
    criteria: SCLERITIS_CRITERIA,
  };
};

export const analyzePeripheralVestibular = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId?.startsWith('vest-');
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Peripheral Vestibular Disorders',
      diagnosticCode: '6204',
      message: 'No vestibular symptoms logged in evaluation period',
    };
  }

  // Key symptoms for rating
  const hasDizziness = relevantLogs.some(log => {
    const id = log.symptomId || log.symptom;
    return id === 'vest-dizziness' || id === 'vest-vertigo' || id === 'vest-occasional' || id === 'vest-frequent';
  });

  const hasStaggering = relevantLogs.some(log => {
    const id = log.symptomId || log.symptom;
    return id === 'vest-staggering' || id === 'vest-with-staggering';
  });

  const hasOccasionalDizziness = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-occasional');
  const hasDizzinessWithStaggering = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-with-staggering');

  // Other symptoms
  const hasVertigo = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-vertigo');
  const hasImbalance = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-imbalance');
  const hasNausea = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-nausea');
  const hasNystagmus = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-nystagmus');
  const hasFalls = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-fall-risk');

  // Functional impact
  const hasDrivingAffected = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-driving-affected');
  const hasWorkAffected = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-work-affected');
  const hasDailyActivities = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-daily-activities');

  // Triggers
  const hasPositionTrigger = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-position-triggered');
  const hasVisualTrigger = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-visual-trigger');

  // Treatment
  const hasMedication = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-medication');
  const hasPhysicalTherapy = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-physical-therapy');
  const hasProcedure = relevantLogs.some(log => (log.symptomId || log.symptom) === 'vest-procedure');

  // Calculate rating per DC 6204 criteria
  let supportedRating = 0;
  if ((hasDizziness || hasVertigo) && hasStaggering) {
    supportedRating = 30;
  } else if (hasDizzinessWithStaggering) {
    supportedRating = 30;
  } else if (hasDizziness || hasVertigo || hasOccasionalDizziness) {
    supportedRating = 10;
  }

  // Build rationale
  const ratingRationale = [];

  if (supportedRating === 30) {
    ratingRationale.push('Dizziness WITH occasional staggering documented (30% criteria)');
  } else if (supportedRating === 10) {
    ratingRationale.push('Occasional dizziness documented (10% criteria)');
  }

  // Count vertigo episodes
  const vertigoLogs = relevantLogs.filter(log => {
    const id = log.symptomId || log.symptom;
    return id === 'vest-vertigo' || id === 'vest-dizziness';
  });
  if (vertigoLogs.length > 0) {
    ratingRationale.push(`${vertigoLogs.length} vertigo/dizziness episodes logged`);
  }

  if (hasNystagmus) ratingRationale.push('Nystagmus documented (objective finding)');
  if (hasFalls) ratingRationale.push('Falls or near-falls documented');

  // Functional impact
  const impacts = [];
  if (hasDrivingAffected) impacts.push('driving');
  if (hasWorkAffected) impacts.push('work');
  if (hasDailyActivities) impacts.push('daily activities');
  if (impacts.length > 0) {
    ratingRationale.push(`Functional impact: ${impacts.join(', ')} affected`);
  }

  // Triggers
  if (hasPositionTrigger) ratingRationale.push('Symptoms triggered by position changes (suggests BPPV)');

  // Treatments
  const treatments = [];
  if (hasMedication) treatments.push('medication');
  if (hasPhysicalTherapy) treatments.push('vestibular rehabilitation');
  if (hasProcedure) treatments.push('procedure/surgery');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatment: ${treatments.join(', ')}`);
  }

  // Gaps
  const gaps = [];
  if (!hasNystagmus) {
    gaps.push('IMPORTANT: Document objective findings (nystagmus, abnormal testing) - required for compensable rating');
  }
  if (hasDizziness && !hasStaggering && supportedRating === 10) {
    gaps.push('Documenting staggering gait with dizziness would support 30% rating');
  }
  if (!hasDizziness && !hasVertigo) {
    gaps.push('Document dizziness or vertigo episodes');
  }

  // Calculate average severity
  const severities = relevantLogs.filter(log => log.severity).map(log => log.severity);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  return {
    hasData: true,
    condition: 'Peripheral Vestibular Disorders',
    diagnosticCode: '6204',
    cfrReference: '38 CFR 4.87',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      vertigoEpisodes: vertigoLogs.length,
      avgSeverity,
      hasDizziness,
      hasStaggering,
      hasObjectiveFindings: hasNystagmus,
      hasFalls,
    },
    criteria: PERIPHERAL_VESTIBULAR_CRITERIA,
  };
};

export const analyzeChronicSuppurativeOtitisMedia = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId?.startsWith('csom-');
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Chronic Suppurative Otitis Media',
      diagnosticCode: '6200',
      message: 'No chronic otitis media symptoms logged in evaluation period',
    };
  }

  // Key criteria for 10% rating
  const hasSuppuration = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-suppuration');
  const hasAuralPolyp = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-aural-polyp');
  const hasDrainage = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-ear-drainage');

  // Other symptoms
  const hasEarPain = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-ear-pain');
  const hasHearingChange = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-hearing-change');
  const hasTympanicPerforation = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-tympanic-perforation');
  const hasFoulOdor = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-foul-odor');

  // Laterality
  const isRightEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-right-ear');
  const isLeftEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-left-ear');
  const isBilateral = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-bilateral');

  // Complications (rated separately per Note)
  const hasLabyrinthitis = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-labyrinthitis');
  const hasTinnitus = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-tinnitus');
  const hasFacialParalysis = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-facial-paralysis');
  const hasBoneLoss = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-bone-loss');
  const hasCholesteatoma = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-cholesteatoma');
  const hasMastoiditis = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-mastoiditis');

  // Treatment
  const hasEarDrops = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-ear-drops');
  const hasOralAntibiotics = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-oral-antibiotics');
  const hasEarCleaning = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-ear-cleaning');
  const hasSurgery = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-surgery');
  const hasTubePlacement = relevantLogs.some(log => (log.symptomId || log.symptom) === 'csom-tube-placement');

  // Calculate rating per DC 6200 criteria - max is 10%
  let supportedRating = 0;
  if (hasSuppuration || hasAuralPolyp) {
    supportedRating = 10;
  }

  // Build rationale
  const ratingRationale = [];

  if (hasSuppuration) {
    ratingRationale.push('Active suppuration (pus drainage) documented - meets 10% criteria');
  }
  if (hasAuralPolyp) {
    ratingRationale.push('Aural polyp present - meets 10% criteria');
  }
  if (!hasSuppuration && !hasAuralPolyp && hasDrainage) {
    ratingRationale.push('Ear drainage documented - specify if suppurative (pus) for 10% rating');
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral ear involvement');
  } else if (isRightEar || isLeftEar) {
    ratingRationale.push(`${isRightEar ? 'Right' : 'Left'} ear affected`);
  }

  if (hasCholesteatoma) ratingRationale.push('Cholesteatoma present');
  if (hasMastoiditis) ratingRationale.push('Mastoiditis present');
  if (hasTympanicPerforation) ratingRationale.push('Tympanic membrane perforation');

  // Complications - these get separate ratings
  const complications = [];
  if (hasHearingChange) complications.push('hearing impairment (rate separately under DC 6100)');
  if (hasLabyrinthitis) complications.push('labyrinthitis');
  if (hasTinnitus) complications.push('tinnitus (rate separately under DC 6260)');
  if (hasFacialParalysis) complications.push('facial nerve paralysis');
  if (hasBoneLoss) complications.push('bone loss');
  if (complications.length > 0) {
    ratingRationale.push(`Complications present: ${complications.join(', ')}`);
  }

  // Treatments
  const treatments = [];
  if (hasEarDrops) treatments.push('ear drops');
  if (hasOralAntibiotics) treatments.push('oral antibiotics');
  if (hasEarCleaning) treatments.push('professional cleaning');
  if (hasSurgery) treatments.push('surgery');
  if (hasTubePlacement) treatments.push('tube placement');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatment: ${treatments.join(', ')}`);
  }

  // Gaps
  const gaps = [];
  if (!hasSuppuration && !hasAuralPolyp) {
    gaps.push('Document active suppuration (pus drainage) OR aural polyps for 10% rating');
  }
  if (hasHearingChange) {
    gaps.push('Hearing impairment should be evaluated separately under DC 6100 and combined');
  }
  if (hasTinnitus) {
    gaps.push('Tinnitus should be evaluated separately under DC 6260 (10%) and combined');
  }
  if (hasLabyrinthitis || hasFacialParalysis || hasBoneLoss) {
    gaps.push('Complications should be evaluated separately and combined');
  }

  // Calculate average severity
  const severities = relevantLogs.filter(log => log.severity).map(log => log.severity);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  return {
    hasData: true,
    condition: 'Chronic Suppurative Otitis Media',
    diagnosticCode: '6200',
    cfrReference: '38 CFR 4.87',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      hasSuppuration,
      hasAuralPolyp,
      isBilateral,
      hasComplications: complications.length > 0,
      complicationCount: complications.length,
    },
    criteria: CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA,
  };
};

export const analyzeChronicOtitisExterna = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId?.startsWith('coe-');
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Chronic Otitis Externa',
      diagnosticCode: '6210',
      message: 'No otitis externa symptoms logged in evaluation period',
    };
  }

  // ALL criteria required for 10% rating
  const hasSwelling = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-swelling');
  const hasDryScaly = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-dry-scaly');
  const hasSerousDischarge = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-serous-discharge');
  const hasItching = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-itching');
  const hasFrequentTreatment = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-frequent-treatment');
  const hasProlongedTreatment = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-prolonged-treatment');

  // Check if all criteria met
  const hasSkinChanges = hasDryScaly || hasSerousDischarge;
  const hasTreatmentRequirement = hasFrequentTreatment || hasProlongedTreatment;
  const allCriteriaMet = hasSwelling && hasSkinChanges && hasItching && hasTreatmentRequirement;

  // Other symptoms
  const hasEarPain = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-ear-pain');
  const hasTenderness = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-tenderness');
  const hasRedness = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-redness');
  const hasDebris = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-debris');
  const isChronic = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-chronic');

  // Laterality
  const isRightEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-right-ear');
  const isLeftEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-left-ear');
  const isBilateral = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-bilateral');

  // Type
  const isBacterial = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-bacterial');
  const isFungal = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-fungal');
  const isEczematous = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-eczematous');

  // Treatment
  const hasEarDrops = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-ear-drops');
  const hasOralMedication = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-oral-medication');
  const hasEarCleaning = relevantLogs.some(log => (log.symptomId || log.symptom) === 'coe-ear-cleaning');

  // Calculate rating - ALL criteria must be met for 10%
  let supportedRating = allCriteriaMet ? 10 : 0;

  // Build rationale
  const ratingRationale = [];

  // Check each criterion
  const criteriaStatus = [];
  criteriaStatus.push(`Swelling: ${hasSwelling ? '✓' : '✗'}`);
  criteriaStatus.push(`Dry/scaly OR serous discharge: ${hasSkinChanges ? '✓' : '✗'}`);
  criteriaStatus.push(`Itching: ${hasItching ? '✓' : '✗'}`);
  criteriaStatus.push(`Frequent/prolonged treatment: ${hasTreatmentRequirement ? '✓' : '✗'}`);

  if (allCriteriaMet) {
    ratingRationale.push('ALL criteria met for 10% rating');
  } else {
    ratingRationale.push('Not all criteria met - see gaps below');
  }
  ratingRationale.push(`Criteria status: ${criteriaStatus.join(', ')}`);

  // Type
  const types = [];
  if (isBacterial) types.push('bacterial');
  if (isFungal) types.push('fungal');
  if (isEczematous) types.push('eczematous');
  if (types.length > 0) {
    ratingRationale.push(`Type: ${types.join(', ')}`);
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral ear involvement');
  } else if (isRightEar || isLeftEar) {
    ratingRationale.push(`${isRightEar ? 'Right' : 'Left'} ear affected`);
  }

  if (isChronic) ratingRationale.push('Chronic pattern documented');

  // Treatments
  const treatments = [];
  if (hasEarDrops) treatments.push('ear drops');
  if (hasOralMedication) treatments.push('oral medication');
  if (hasEarCleaning) treatments.push('professional cleaning');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatment: ${treatments.join(', ')}`);
  }

  // Gaps - show missing criteria
  const gaps = [];
  if (!hasSwelling) {
    gaps.push('Document ear canal swelling');
  }
  if (!hasSkinChanges) {
    gaps.push('Document dry/scaly skin OR serous discharge');
  }
  if (!hasItching) {
    gaps.push('Document ear canal itching');
  }
  if (!hasTreatmentRequirement) {
    gaps.push('Document that treatment is FREQUENT and PROLONGED');
  }
  if (!allCriteriaMet) {
    gaps.push('ALL four criteria must be documented for 10% rating');
  }

  // Calculate average severity
  const severities = relevantLogs.filter(log => log.severity).map(log => log.severity);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  return {
    hasData: true,
    condition: 'Chronic Otitis Externa',
    diagnosticCode: '6210',
    cfrReference: '38 CFR 4.87',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      hasSwelling,
      hasSkinChanges,
      hasItching,
      hasTreatmentRequirement,
      allCriteriaMet,
      isBilateral,
    },
    criteria: CHRONIC_OTITIS_EXTERNA_CRITERIA,
  };
};

export const analyzeChronicNonsuppurativeOtitisMedia = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId?.startsWith('cnsom-');
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Chronic Nonsuppurative Otitis Media',
      diagnosticCode: '6201',
      message: 'No serous otitis media symptoms logged in evaluation period',
    };
  }

  // Symptoms
  const hasEarFullness = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-ear-fullness');
  const hasFluidSensation = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-fluid-sensation');
  const hasHearingLoss = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-hearing-loss');
  const hasMuffledHearing = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-muffled-hearing');
  const hasPopping = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-popping-clicking');
  const hasDiscomfort = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-ear-discomfort');
  const hasBalanceIssues = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-balance-issues');
  const hasTinnitus = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-tinnitus');

  // Laterality
  const isRightEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-right-ear');
  const isLeftEar = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-left-ear');
  const isBilateral = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-bilateral');

  // Chronicity
  const isChronic = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-chronic');
  const isRecurrent = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-recurrent');
  const isPersistent = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-persistent');

  // Treatment
  const hasDecongestants = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-decongestants');
  const hasAntihistamines = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-antihistamines');
  const hasNasalSteroids = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-nasal-steroids');
  const hasTubes = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-tubes');
  const hasMonitoring = relevantLogs.some(log => (log.symptomId || log.symptom) === 'cnsom-monitoring');

  // DC 6201 doesn't have its own rating - rate hearing impairment
  const supportedRating = 'Variable - Rate hearing impairment';

  // Build rationale
  const ratingRationale = [];

  ratingRationale.push('DC 6201 rates based on resulting hearing impairment under DC 6100');

  // Symptoms
  const symptoms = [];
  if (hasEarFullness) symptoms.push('ear fullness');
  if (hasFluidSensation) symptoms.push('fluid sensation');
  if (hasHearingLoss || hasMuffledHearing) symptoms.push('hearing changes');
  if (hasPopping) symptoms.push('popping/clicking');
  if (hasBalanceIssues) symptoms.push('balance issues');
  if (hasTinnitus) symptoms.push('tinnitus');
  if (symptoms.length > 0) {
    ratingRationale.push(`Symptoms: ${symptoms.join(', ')}`);
  }

  // Laterality
  if (isBilateral) {
    ratingRationale.push('Bilateral ear involvement');
  } else if (isRightEar || isLeftEar) {
    ratingRationale.push(`${isRightEar ? 'Right' : 'Left'} ear affected`);
  }

  if (isChronic || isRecurrent || isPersistent) {
    ratingRationale.push('Chronic/persistent effusion documented');
  }

  // Treatments
  const treatments = [];
  if (hasDecongestants) treatments.push('decongestants');
  if (hasAntihistamines) treatments.push('antihistamines');
  if (hasNasalSteroids) treatments.push('nasal steroids');
  if (hasTubes) treatments.push('tympanostomy tubes');
  if (hasMonitoring) treatments.push('audiological monitoring');
  if (treatments.length > 0) {
    ratingRationale.push(`Treatment: ${treatments.join(', ')}`);
  }

  // Gaps
  const gaps = [];
  gaps.push('IMPORTANT: Rating requires audiometric testing (hearing test) - DC 6201 rates based on hearing impairment');
  if (!hasHearingLoss && !hasMuffledHearing) {
    gaps.push('Document any hearing changes for evaluation');
  }
  if (!isBilateral && !isRightEar && !isLeftEar) {
    gaps.push('Document which ear(s) affected');
  }

  // Calculate average severity
  const severities = relevantLogs.filter(log => log.severity).map(log => log.severity);
  const avgSeverity = severities.length > 0
      ? severities.reduce((a, b) => a + b, 0) / severities.length
      : 0;

  return {
    hasData: true,
    condition: 'Chronic Nonsuppurative Otitis Media',
    diagnosticCode: '6201',
    cfrReference: '38 CFR 4.87',
    supportedRating: 0, // Display as variable, but use 0 for numeric purposes
    supportedRatingDisplay: supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      hasHearingLoss: hasHearingLoss || hasMuffledHearing,
      hasTinnitus,
      isBilateral,
      isChronic: isChronic || isRecurrent || isPersistent,
    },
    criteria: CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA,
  };
};

export const analyzeEyeConditionsLogs = (logs, _options = {}) => {
  const symptomIds = [
    'eye-pain', 'vision-changes', 'blurred-vision', 'eye-inflammation',
    'photophobia', 'eye-redness', 'eye-discharge', 'double-vision'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('eye') ||
        log.notes?.toLowerCase().includes('vision');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Eye Conditions (General)',
      diagnosticCode: 'Various',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Count incapacitating episodes (bed rest required)
  const incapacitatingLogs = validLogs.filter(log =>
      log.notes?.toLowerCase().includes('bed rest') ||
      log.notes?.toLowerCase().includes('incapacitat') ||
      log.notes?.toLowerCase().includes('unable to work') ||
      log.notes?.toLowerCase().includes('missed work') ||
      log.severity === 'severe'
  );

  // Estimate weeks of incapacitation (rough calculation)
  const incapacitatingDays = incapacitatingLogs.length; // Assume each log = 1 day
  const incapacitatingWeeks = incapacitatingDays / 7;

  let supportedRating = 0;
  let rationale = '';

  if (incapacitatingWeeks >= 6) {
    supportedRating = 60;
    rationale = `Evidence suggests approximately ${Math.round(incapacitatingWeeks)} weeks of incapacitating episodes in evaluation period.`;
  } else if (incapacitatingWeeks >= 4) {
    supportedRating = 40;
    rationale = `Evidence suggests approximately ${Math.round(incapacitatingWeeks)} weeks of incapacitating episodes.`;
  } else if (incapacitatingWeeks >= 2) {
    supportedRating = 20;
    rationale = `Evidence suggests approximately ${Math.round(incapacitatingWeeks)} weeks of incapacitating episodes.`;
  } else if (incapacitatingWeeks >= 1) {
    supportedRating = 10;
    rationale = `Evidence suggests approximately ${Math.round(incapacitatingWeeks)} weeks of incapacitating episodes.`;
  } else {
    supportedRating = 0;
    rationale = 'Insufficient incapacitating episodes documented for compensable rating under general formula.';
  }

  return {
    condition: 'Eye Conditions (General)',
    diagnosticCode: 'Various',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    incapacitatingLogs: incapacitatingLogs.length,
    estimatedIncapacitatingWeeks: Math.round(incapacitatingWeeks * 10) / 10,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: EYE_CONDITIONS_CRITERIA,
    recommendations: [
      'Document incapacitating episodes with physician-prescribed bed rest',
      'Get visual acuity testing (may qualify for higher rating)',
      'Get visual field testing if applicable',
      'Most eye conditions are rated on visual impairment, not incapacitating episodes',
    ],
    note: 'Most eye conditions are rated based on visual acuity or field loss. See specific diagnostic code for your condition.',
  };
};

export const analyzeMandibleMalunionLogs = (logs, _options = {}) => {
  const symptomIds = [
    'jaw-pain', 'jaw-misalignment', 'bite-problems', 'chewing-difficulty',
    'jaw-clicking', 'facial-asymmetry', 'malocclusion'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('mandible') ||
        log.notes?.toLowerCase().includes('jaw') ||
        log.notes?.toLowerCase().includes('malunion') ||
        log.notes?.toLowerCase().includes('bite');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Mandible Malunion',
      diagnosticCode: '9904',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for severity indicators
  const severeDisplacement = validLogs.some(log =>
      log.notes?.toLowerCase().includes('severe') ||
      log.notes?.toLowerCase().includes('marked') ||
      log.notes?.toLowerCase().includes('significant displacement') ||
      log.notes?.toLowerCase().includes('cannot chew') ||
      log.severity === 'severe'
  );

  const moderateDisplacement = validLogs.some(log =>
      log.notes?.toLowerCase().includes('moderate') ||
      log.notes?.toLowerCase().includes('some difficulty') ||
      log.severity === 'moderate'
  );

  const functionalImpairment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('chewing') ||
      log.notes?.toLowerCase().includes('eating') ||
      log.notes?.toLowerCase().includes('speaking') ||
      log.notes?.toLowerCase().includes('functional')
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeDisplacement && functionalImpairment) {
    supportedRating = 20;
    rationale = 'Evidence suggests severe displacement with marked functional impairment.';
  } else if (moderateDisplacement || functionalImpairment) {
    supportedRating = 10;
    rationale = 'Evidence suggests moderate displacement with some functional impairment.';
  } else {
    supportedRating = 0;
    rationale = 'Minimal displacement documented or insufficient functional impact.';
  }

  return {
    condition: 'Mandible Malunion',
    diagnosticCode: '9904',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: MANDIBLE_MALUNION_CRITERIA,
    recommendations: [
      'Get X-rays or CT scan showing malunion',
      'Document chewing difficulty with specific foods',
      'Note any bite problems or malocclusion',
      'Get dental/oral surgery evaluation',
      'Measure jaw opening limitation (mm)',
    ],
  };
};

export const analyzeMaxillaMalunionLogs = (logs, _options = {}) => {
  const symptomIds = [
    'jaw-pain', 'facial-pain', 'bite-problems', 'chewing-difficulty',
    'sinus-problems', 'facial-asymmetry', 'nasal-obstruction'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('maxilla') ||
        log.notes?.toLowerCase().includes('upper jaw') ||
        log.notes?.toLowerCase().includes('malunion') ||
        log.notes?.toLowerCase().includes('midface');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Maxilla Malunion',
      diagnosticCode: '9916',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for severity indicators
  const severeOrNonunion = validLogs.some(log =>
      log.notes?.toLowerCase().includes('nonunion') ||
      log.notes?.toLowerCase().includes('severe') ||
      log.notes?.toLowerCase().includes('marked') ||
      log.notes?.toLowerCase().includes('not healed') ||
      log.severity === 'severe'
  );

  const moderateDisplacement = validLogs.some(log =>
      log.notes?.toLowerCase().includes('moderate') ||
      log.notes?.toLowerCase().includes('some difficulty') ||
      log.severity === 'moderate'
  );

  const functionalImpairment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('chewing') ||
      log.notes?.toLowerCase().includes('breathing') ||
      log.notes?.toLowerCase().includes('sinus') ||
      log.notes?.toLowerCase().includes('functional')
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeOrNonunion && functionalImpairment) {
    supportedRating = 30;
    rationale = 'Evidence suggests nonunion or severe malunion with marked functional impairment.';
  } else if (moderateDisplacement || functionalImpairment) {
    supportedRating = 10;
    rationale = 'Evidence suggests moderate malunion with some functional impairment.';
  } else {
    supportedRating = 0;
    rationale = 'Minimal displacement documented or insufficient functional impact.';
  }

  return {
    condition: 'Maxilla Malunion',
    diagnosticCode: '9916',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: MAXILLA_MALUNION_CRITERIA,
    recommendations: [
      'Get CT scan showing malunion or nonunion',
      'Document chewing difficulty',
      'Note any breathing or sinus issues',
      'Get oral/maxillofacial surgery evaluation',
      'Document facial asymmetry with photos',
    ],
  };
};

export const analyzeMaxillaMandibleBoneDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'jaw-pain', 'jaw-swelling', 'jaw-drainage', 'tooth-loosening',
    'jaw-numbness', 'fistula', 'bone-exposed'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('osteomyelitis') ||
        log.notes?.toLowerCase().includes('osteonecrosis') ||
        log.notes?.toLowerCase().includes('bone infection') ||
        log.notes?.toLowerCase().includes('jaw infection') ||
        log.notes?.toLowerCase().includes('sequestrum');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Maxilla/Mandible Osteomyelitis',
      diagnosticCode: '9900',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for severity indicators
  const hasSequestrum = validLogs.some(log =>
      log.notes?.toLowerCase().includes('sequestrum') ||
      log.notes?.toLowerCase().includes('dead bone') ||
      log.notes?.toLowerCase().includes('involucrum')
  );

  const repeatedFlareups = validLogs.filter(log =>
      log.notes?.toLowerCase().includes('flare') ||
      log.notes?.toLowerCase().includes('recur') ||
      log.notes?.toLowerCase().includes('episode')
  ).length >= 3;

  const hasDrainage = validLogs.some(log =>
      log.notes?.toLowerCase().includes('drainage') ||
      log.notes?.toLowerCase().includes('draining') ||
      log.notes?.toLowerCase().includes('pus') ||
      log.notes?.toLowerCase().includes('fistula') ||
      log.notes?.toLowerCase().includes('sinus tract')
  );

  const activeInfection = validLogs.some(log =>
      log.notes?.toLowerCase().includes('active') ||
      log.notes?.toLowerCase().includes('infected') ||
      log.notes?.toLowerCase().includes('antibiotic')
  );

  const inactiveNow = validLogs.some(log =>
      log.notes?.toLowerCase().includes('inactive') ||
      log.notes?.toLowerCase().includes('resolved') ||
      log.notes?.toLowerCase().includes('healed')
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasSequestrum && repeatedFlareups) {
    supportedRating = 60;
    rationale = 'Evidence suggests definite sequestrum/involucrum with repeated flare-ups.';
  } else if (hasSequestrum && hasDrainage) {
    supportedRating = 30;
    rationale = 'Evidence suggests sequestrum/involucrum with occasional drainage.';
  } else if (hasDrainage || activeInfection) {
    supportedRating = 20;
    rationale = 'Evidence suggests active infection with discharging sinus or drainage.';
  } else if (inactiveNow && validLogs.length >= 3) {
    supportedRating = 10;
    rationale = 'Evidence suggests inactive osteomyelitis following repeated episodes.';
  } else {
    supportedRating = 0;
    rationale = 'Insufficient evidence of chronic osteomyelitis.';
  }

  return {
    condition: 'Maxilla/Mandible Osteomyelitis',
    diagnosticCode: '9900',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA,
    recommendations: [
      'Get CT or MRI showing bone involvement',
      'Document all drainage episodes',
      'Keep records of surgical debridements',
      'Note antibiotic treatments and duration',
      'Get culture results if available',
      'Document any sequestrum removal surgeries',
    ],
  };
};