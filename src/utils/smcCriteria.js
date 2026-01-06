// ============================================
// SPECIAL MONTHLY COMPENSATION (SMC) CRITERIA
// ============================================
// Based on 38 CFR § 3.350 - Special monthly compensation ratings
// Based on 38 U.S.C. § 1114 - Rates of wartime disability compensation
//
// DISCLAIMER: This is for documentation guidance only.
// The VA makes all final SMC determinations.
// SMC eligibility requires official VA evaluation.
//
// REFERENCE: https://www.ecfr.gov/current/title-38/chapter-I/part-3/subpart-A/section-3.350
// ============================================

// ============================================
// 2026 SMC RATES (Effective December 1, 2025)
// ============================================
// Updated with 2.8% COLA increase
export const SMC_RATES_2026 = {
  K: {
    rate: 139.87,
    maxAwards: 3,
    maxTotal: 419.61, // 3 x $139.87
    description: 'Additive benefit for specific anatomical losses',
    paymentType: 'additive', // Added to other compensation
  },
  L: {
    veteran_alone: 4993.35,
    with_spouse: 5259.35,
    description: 'Aid & Attendance / bilateral losses',
    paymentType: 'replacement', // Replaces standard compensation
  },
  L_HALF: {
    veteran_alone: 5240.83,
    with_spouse: 5506.83,
    description: 'SMC-L + additional 50% toward M',
    paymentType: 'replacement',
  },
  M: {
    veteran_alone: 5505.87,
    with_spouse: 5771.87,
    description: 'More severe combinations',
    paymentType: 'replacement',
  },
  M_HALF: {
    veteran_alone: 5862.18,
    with_spouse: 6128.18,
    description: 'SMC-M + additional 50% toward N',
    paymentType: 'replacement',
  },
  N: {
    veteran_alone: 6218.48,
    with_spouse: 6484.48,
    description: 'Most severe combinations below O',
    paymentType: 'replacement',
  },
  N_HALF: {
    veteran_alone: 6583.49,
    with_spouse: 6849.49,
    description: 'SMC-N + additional 50% toward O',
    paymentType: 'replacement',
  },
  O: {
    veteran_alone: 6948.50,
    with_spouse: 7214.50,
    description: 'Maximum schedular SMC (allows pyramiding)',
    paymentType: 'replacement',
    note: 'SMC-K is NOT paid with SMC-O',
  },
  P: {
    veteran_alone: 6948.50, // Same as O, but specific anatomical losses
    with_spouse: 7214.50,
    description: 'Specific anatomical losses (cannot exceed O)',
    paymentType: 'replacement',
  },
  R1: {
    veteran_alone: 9973.73,
    with_spouse: 10239.73,
    description: 'Higher level Aid & Attendance',
    paymentType: 'replacement',
    note: 'SMC-K is NOT paid with SMC-R',
  },
  R2: {
    veteran_alone: 11438.14,
    with_spouse: 11704.14,
    description: 'Highest level care needs',
    paymentType: 'replacement',
    note: 'SMC-K is NOT paid with SMC-R',
  },
  S: {
    veteran_alone: 4108.37,
    with_spouse: 4374.37,
    description: 'Housebound status',
    paymentType: 'replacement',
  },
  T: {
    veteran_alone: 11438.14,
    with_spouse: 11704.14,
    description: 'Aid & Attendance for TBI residuals',
    paymentType: 'replacement',
    note: 'SMC-K is NOT paid with SMC-T',
  },
};

// ============================================
// SMC-K ELIGIBILITY CRITERIA
// ============================================
// 38 CFR § 3.350(a) - Special monthly compensation under 38 U.S.C. 1114(k)
// SMC-K is ADDITIVE and can be awarded up to 3 times
export const SMC_K_CRITERIA = {
  level: 'K',
  cfrReference: '38 CFR § 3.350(a)',
  uscReference: '38 U.S.C. § 1114(k)',
  maxAwards: 3,
  isAdditive: true, // Key distinction: K is added to other rates

  // Categories that qualify for SMC-K (each is one award)
  categories: {
    CREATIVE_ORGAN: {
      id: 'creative-organ',
      name: 'Loss of Use of Creative Organ',
      description: 'Anatomical loss or loss of use of one or more creative organs',
      maxAwardsInCategory: 1, // Only ONE K award for all creative organ losses combined
      qualifyingConditions: [
        {
          name: 'Erectile Dysfunction',
          diagnosticCodes: ['7522'],
          note: 'When caused by service-connected condition',
          autoGrant: false, // Requires nexus to SC condition
        },
        {
          name: 'Penis Removal - Half or More',
          diagnosticCodes: ['7520'],
          autoGrant: true,
        },
        {
          name: 'Penis Removal - Glans Only',
          diagnosticCodes: ['7521'],
          autoGrant: true,
        },
        {
          name: 'Testis Atrophy - Both',
          diagnosticCodes: ['7523'],
          ratingRequired: 20, // Both testes = 20%
          autoGrant: true,
        },
        {
          name: 'Testis Atrophy - One',
          diagnosticCodes: ['7523'],
          ratingRequired: 0, // One testis = 0% but still qualifies for SMC-K
          autoGrant: true,
        },
        {
          name: 'Testis Removal - Both',
          diagnosticCodes: ['7524'],
          autoGrant: true,
        },
        {
          name: 'Testis Removal - One',
          diagnosticCodes: ['7524'],
          autoGrant: true,
        },
        {
          name: 'Female Sexual Arousal Disorder',
          diagnosticCodes: ['7632'],
          note: 'When caused by service-connected condition',
          autoGrant: false,
        },
        {
          name: 'Ovary Removal - Both',
          diagnosticCodes: ['7619'],
          autoGrant: true,
        },
        {
          name: 'Ovary Removal - One',
          diagnosticCodes: ['7619'],
          autoGrant: true,
        },
        {
          name: 'Uterus/Cervix Removal',
          diagnosticCodes: ['7617', '7618'],
          autoGrant: true,
        },
      ],
      exclusions: [
        'Elective vasectomy does NOT qualify for SMC-K',
        'Elective hysterectomy does NOT qualify for SMC-K',
        'Must be due to service-connected condition or treatment thereof',
      ],
    },

    EXTREMITY_HAND: {
      id: 'hand-loss',
      name: 'Loss of Use of Hand',
      description: 'Anatomical loss or loss of use of one hand',
      maxAwardsInCategory: 2, // Can get one per hand
      perLimb: true,
      qualifyingConditions: [
        {
          name: 'Hand Amputation',
          diagnosticCodes: ['5125'],
          autoGrant: true,
        },
        {
          name: 'Loss of Use of Hand',
          diagnosticCodes: ['5125'],
          criteria: 'No effective function remains other than that which would be equally well served by an amputation stump with suitable prosthesis',
          autoGrant: false, // Requires functional assessment
        },
        {
          name: 'Complete Paralysis - Median Nerve',
          diagnosticCodes: ['8515'],
          ratingRequired: 70, // Major hand
          autoGrant: false,
        },
        {
          name: 'Complete Paralysis - Ulnar Nerve',
          diagnosticCodes: ['8516'],
          ratingRequired: 60, // Major hand
          autoGrant: false,
        },
        {
          name: 'Complete Paralysis - Radial Nerve',
          diagnosticCodes: ['8514'],
          ratingRequired: 70, // Major hand
          autoGrant: false,
        },
      ],
    },

    EXTREMITY_FOOT: {
      id: 'foot-loss',
      name: 'Loss of Use of Foot',
      description: 'Anatomical loss or loss of use of one foot',
      maxAwardsInCategory: 2, // Can get one per foot
      perLimb: true,
      qualifyingConditions: [
        {
          name: 'Foot Amputation',
          diagnosticCodes: ['5167'],
          autoGrant: true,
        },
        {
          name: 'Loss of Use of Foot',
          diagnosticCodes: ['5167'],
          criteria: 'No effective function remains other than that which would be equally well served by an amputation stump with suitable prosthesis',
          autoGrant: false,
        },
        {
          name: 'Complete Paralysis - Sciatic Nerve',
          diagnosticCodes: ['8520'],
          ratingRequired: 80,
          criteria: 'Foot dangles and drops, no active movement possible of muscles below the knee, flexion of knee weakened or lost',
          autoGrant: false,
        },
        {
          name: 'Complete Paralysis - External Popliteal (Common Peroneal)',
          diagnosticCodes: ['8521'],
          ratingRequired: 40,
          criteria: 'Footdrop with characteristic organic changes including trophic and circulatory disturbances',
          autoGrant: false,
        },
      ],
    },

    BUTTOCKS: {
      id: 'buttocks-loss',
      name: 'Loss of Use of Both Buttocks',
      description: 'Severe damage to muscle group XVII, bilateral, preventing rising from seated/stooped position',
      maxAwardsInCategory: 1,
      qualifyingConditions: [
        {
          name: 'Loss of Use of Both Buttocks',
          diagnosticCodes: ['5317'],
          criteria: 'Severe bilateral damage to Muscle Group XVII making it impossible to rise from seated or stooped position without assistance and maintain postural stability',
          autoGrant: false,
        },
      ],
    },

    EYE_BLINDNESS: {
      id: 'eye-blindness',
      name: 'Blindness in One Eye',
      description: 'Blindness in one eye having only light perception',
      maxAwardsInCategory: 2, // Can get one per eye
      perEye: true,
      qualifyingConditions: [
        {
          name: 'Blindness - Light Perception Only',
          diagnosticCodes: ['6063', '6064', '6065', '6066', '6067', '6068', '6069', '6070'],
          criteria: 'Visual acuity of light perception only or no light perception',
          autoGrant: true,
        },
        {
          name: 'Anatomical Loss of Eye',
          diagnosticCodes: ['6063'],
          autoGrant: true,
        },
      ],
    },

    DEAFNESS: {
      id: 'deafness',
      name: 'Deafness - Both Ears',
      description: 'Complete deafness in both ears with absence of air and bone conduction',
      maxAwardsInCategory: 1,
      qualifyingConditions: [
        {
          name: 'Bilateral Deafness - Complete',
          diagnosticCodes: ['6100'],
          criteria: 'Absence of air and bone conduction in both ears',
          autoGrant: true,
        },
      ],
    },

    APHONIA: {
      id: 'aphonia',
      name: 'Complete Organic Aphonia',
      description: 'Complete loss of voice due to organic cause',
      maxAwardsInCategory: 1,
      qualifyingConditions: [
        {
          name: 'Aphonia - Complete Organic',
          diagnosticCodes: ['6519'],
          ratingRequired: 100,
          criteria: 'Constant inability to speak above a whisper due to organic cause',
          autoGrant: true,
        },
        {
          name: 'Laryngectomy',
          diagnosticCodes: ['6518'],
          autoGrant: true,
        },
      ],
    },

    BREAST_LOSS: {
      id: 'breast-loss',
      name: 'Loss of Breast Tissue',
      description: 'Loss of 25% or more breast tissue (female veterans only)',
      maxAwardsInCategory: 2, // One per breast
      femaleOnly: true,
      qualifyingConditions: [
        {
          name: 'Mastectomy - 25% or More Tissue Loss',
          diagnosticCodes: ['7627', '7628'],
          criteria: 'Surgical removal of 25% or more breast tissue, or equivalent loss due to injury or radiation',
          autoGrant: true,
        },
      ],
    },
  },

  // Conditions that commonly co-occur with SMC-K triggers
  commonSecondaryConditions: [
    'Depression secondary to loss of creative organ',
    'Anxiety secondary to loss of limb',
    'PTSD secondary to traumatic injury',
    'Phantom limb pain',
    'Adjustment disorder',
  ],

  // Important exclusions
  exclusions: [
    'SMC-K is NOT paid in addition to SMC-O',
    'SMC-K is NOT paid in addition to SMC-Q (obsolete)',
    'SMC-K is NOT paid in addition to SMC-R',
    'SMC-K is NOT paid in addition to SMC-T',
    'Maximum of 3 SMC-K awards total',
    'Cannot receive duplicate K awards for same body part/category',
  ],
};

// ============================================
// SMC-L ELIGIBILITY CRITERIA
// ============================================
// 38 CFR § 3.350(b) - Special monthly compensation under 38 U.S.C. 1114(l)
export const SMC_L_CRITERIA = {
  level: 'L',
  cfrReference: '38 CFR § 3.350(b)',
  uscReference: '38 U.S.C. § 1114(l)',
  isAdditive: false, // Replaces standard compensation

  categories: {
    BILATERAL_FEET: {
      id: 'bilateral-feet-loss',
      name: 'Loss of Both Feet',
      description: 'Anatomical loss or loss of use of both feet',
      qualifyingConditions: [
        {
          name: 'Bilateral Foot Amputation',
          diagnosticCodes: ['5167'],
          autoGrant: true,
        },
        {
          name: 'Bilateral Loss of Use of Feet',
          criteria: 'No effective function remains in either foot',
          autoGrant: false,
        },
      ],
    },

    HAND_AND_FOOT: {
      id: 'hand-foot-loss',
      name: 'Loss of One Hand and One Foot',
      description: 'Anatomical loss or loss of use of one hand and one foot',
      qualifyingConditions: [
        {
          name: 'One Hand + One Foot Loss',
          criteria: 'Anatomical loss or loss of use of one hand AND one foot',
          autoGrant: false,
        },
      ],
    },

    BILATERAL_BLINDNESS: {
      id: 'bilateral-blindness',
      name: 'Blindness in Both Eyes',
      description: 'Blindness in both eyes with visual acuity of 5/200 or less',
      qualifyingConditions: [
        {
          name: 'Bilateral Blindness 5/200 or Less',
          diagnosticCodes: ['6064'],
          criteria: 'Visual acuity of 5/200 or less in both eyes (actual, not rounded)',
          autoGrant: true,
        },
        {
          name: 'Concentric Contraction Beyond 5 Degrees',
          criteria: 'Visual field contracted to 5 degrees or less in both eyes',
          autoGrant: true,
        },
      ],
    },

    BEDRIDDEN: {
      id: 'bedridden',
      name: 'Permanently Bedridden',
      description: 'Service-connected disabilities require veteran to remain in bed',
      qualifyingConditions: [
        {
          name: 'Permanently Bedridden',
          criteria: 'Actual requirement to remain in bed due to service-connected disability',
          note: 'Not based solely on prescription for bed rest',
          autoGrant: false,
        },
      ],
    },

    AID_AND_ATTENDANCE: {
      id: 'aid-attendance-l',
      name: 'Need for Regular Aid and Attendance',
      description: 'So helpless as to require regular aid and attendance of another person',
      cfrReference: '38 CFR § 3.352(a)',
      qualifyingConditions: [
        {
          name: 'Aid and Attendance Needed',
          criteria: 'Inability to perform activities of daily living without assistance',
          factors: [
            'Inability to dress or undress self',
            'Inability to keep self clean and presentable',
            'Frequent need for adjustment of prosthetic/orthopedic appliances',
            'Inability to feed self (manual dexterity or physical feeding)',
            'Inability to attend to wants of nature',
            'Physical or mental incapacity requiring protection from hazards of daily environment',
          ],
          autoGrant: false,
        },
      ],
    },
  },
};

// ============================================
// SMC-S ELIGIBILITY CRITERIA (HOUSEBOUND)
// ============================================
// 38 CFR § 3.350(i) - Special monthly compensation under 38 U.S.C. 1114(s)
export const SMC_S_CRITERIA = {
  level: 'S',
  cfrReference: '38 CFR § 3.350(i)',
  uscReference: '38 U.S.C. § 1114(s)',
  isAdditive: false,

  // Two ways to qualify for SMC-S
  pathways: {
    STATUTORY: {
      id: 'statutory-housebound',
      name: 'Statutory Housebound (100% + 60%)',
      description: 'Single 100% disability plus additional disabilities rated 60% or more',
      requirements: [
        'ONE service-connected disability rated at 100% schedular (or TDIU based on single condition)',
        'PLUS additional service-connected disability(ies) independently ratable at 60% or more',
        'The 100% condition and 60%+ conditions must be SEPARATE disabilities',
      ],
      examples: [
        'PTSD at 100% + Knee conditions combined at 60%',
        'Sleep Apnea at 100% + Back + Radiculopathy combined at 60%',
        'TBI at 100% + Migraines at 50% + Tinnitus at 10% (combines to 60%)',
      ],
      note: 'TDIU counts as 100% only if based on a SINGLE condition, not combined conditions',
    },

    FACTUAL: {
      id: 'factual-housebound',
      name: 'Factual Housebound',
      description: 'Permanently housebound by reason of service-connected disability',
      requirements: [
        'Substantially confined to dwelling and immediate premises',
        'Confinement is reasonably certain to continue throughout lifetime',
        'Confinement is due to service-connected disability(ies)',
      ],
      note: 'Requires medical evidence demonstrating actual housebound status',
    },
  },
};

// ============================================
// SMC-M THROUGH SMC-O CRITERIA
// ============================================
// More severe combinations - 38 CFR § 3.350(c)-(e)
export const SMC_M_CRITERIA = {
  level: 'M',
  cfrReference: '38 CFR § 3.350(c)',
  uscReference: '38 U.S.C. § 1114(m)',

  qualifyingConditions: [
    {
      name: 'Both Hands Loss',
      description: 'Anatomical loss or loss of use of both hands',
    },
    {
      name: 'One Hand + One Leg (Near Hip)',
      description: 'Loss of use of one hand and anatomical loss of one leg near hip preventing prosthesis',
    },
    {
      name: 'One Foot + One Leg (Near Hip)',
      description: 'Anatomical loss of one foot and loss of other leg near hip preventing prosthesis',
    },
    {
      name: 'Blindness + Deafness',
      description: 'Blindness in both eyes (5/200 or less) AND deafness (both ears, air/bone conduction absent)',
    },
    {
      name: 'Blindness + Loss of Hand or Foot',
      description: 'Blindness in both eyes (5/200 or less) AND anatomical loss or loss of use of one hand or foot',
    },
  ],
};

export const SMC_N_CRITERIA = {
  level: 'N',
  cfrReference: '38 CFR § 3.350(d)',
  uscReference: '38 U.S.C. § 1114(n)',

  qualifyingConditions: [
    {
      name: 'Both Arms + Elbows Lost',
      description: 'Anatomical loss or loss of use of both arms at level preventing natural elbow action',
    },
    {
      name: 'Both Legs + Knees Lost',
      description: 'Anatomical loss or loss of use of both legs at level preventing natural knee action',
    },
    {
      name: 'One Arm + One Leg (Preventing Prosthesis)',
      description: 'Anatomical loss of one arm and one leg with complications preventing prosthesis use',
    },
    {
      name: 'Blindness + Hand + Foot Lost',
      description: 'Blindness in both eyes (light perception only) AND anatomical loss of one hand and one foot',
    },
  ],
};

export const SMC_O_CRITERIA = {
  level: 'O',
  cfrReference: '38 CFR § 3.350(e)',
  uscReference: '38 U.S.C. § 1114(o)',

  qualifyingConditions: [
    {
      name: 'Paraplegia',
      description: 'Paralysis of both lower extremities with loss of anal and bladder sphincter control',
    },
    {
      name: 'Blindness + Bilateral Arm/Hand Loss',
      description: 'Blindness (light perception only, both eyes) with bilateral arm loss above elbows',
    },
    {
      name: 'Multiple Severe Combinations',
      description: 'Combinations of disabilities meeting criteria for two or more L/M/N levels',
    },
  ],
  note: 'SMC-O allows pyramiding (counting same disability twice) - only place in VA regulations where this is permitted',
};

// ============================================
// SMC-R CRITERIA (HIGHER LEVEL AID & ATTENDANCE)
// ============================================
export const SMC_R_CRITERIA = {
  levels: {
    R1: {
      cfrReference: '38 CFR § 3.350(h)(1)',
      uscReference: '38 U.S.C. § 1114(r)(1)',
      requirements: [
        'Entitled to SMC-O or SMC-P',
        'PLUS needs regular aid and attendance',
        'A&A need must be based on disability SEPARATE from the O/P qualifying condition',
      ],
    },
    R2: {
      cfrReference: '38 CFR § 3.350(h)(2)',
      uscReference: '38 U.S.C. § 1114(r)(2)',
      requirements: [
        'Entitled to SMC-R1',
        'PLUS needs HIGHER level of care',
        'Healthcare needs are so severe that without personal healthcare services, would require hospitalization, nursing home, or other institutional care',
      ],
    },
  },
};

// ============================================
// SMC-T CRITERIA (TBI-SPECIFIC A&A)
// ============================================
export const SMC_T_CRITERIA = {
  level: 'T',
  cfrReference: '38 CFR § 3.350(j)',
  uscReference: '38 U.S.C. § 1114(t)',

  requirements: [
    'Service-connected Traumatic Brain Injury (TBI)',
    'TBI rated at 100% disability',
    'Needs regular aid and attendance for TBI residuals',
    'A&A need is based on TBI-related cognitive, behavioral, or physical impairments',
  ],

  qualifyingTBIResiduals: [
    'Cognitive impairment requiring supervision for safety',
    'Memory impairment preventing independent living',
    'Behavioral dyscontrol requiring constant supervision',
    'Physical impairments from TBI preventing self-care',
    'Communication deficits preventing independent functioning',
  ],
};

// ============================================
// CONDITIONS MAPPING TO SMC ELIGIBILITY
// ============================================
// Maps existing tracked conditions to potential SMC eligibility
export const SMC_CONDITION_TRIGGERS = {
  // SMC-K Triggers
  'erectile-dysfunction': {
    smcLevel: 'K',
    category: 'CREATIVE_ORGAN',
    autoCheck: false,
    requiresNexus: true,
    note: 'Requires nexus to service-connected condition (diabetes, MS, ALS, Parkinson\'s, prostate cancer treatment, etc.)',
  },
  'penis-conditions': {
    smcLevel: 'K',
    category: 'CREATIVE_ORGAN',
    autoCheck: true,
    diagnosticCodes: ['7520', '7521'],
  },
  'testis-conditions': {
    smcLevel: 'K',
    category: 'CREATIVE_ORGAN',
    autoCheck: true,
    diagnosticCodes: ['7523', '7524'],
  },
  'aphonia': {
    smcLevel: 'K',
    category: 'APHONIA',
    autoCheck: true,
    requiresRating: 100,
    diagnosticCodes: ['6519'],
  },

  // Conditions that may indicate SMC-L eligibility
  'dementia': {
    smcLevel: 'L',
    category: 'AID_AND_ATTENDANCE',
    autoCheck: false,
    triggerRatings: [100],
    note: 'Severe dementia often requires Aid & Attendance',
    diagnosticCodes: ['9326'],
  },
  'als': {
    smcLevel: 'L', // Often progresses to R
    category: 'AID_AND_ATTENDANCE',
    autoCheck: false,
    note: 'ALS typically qualifies for A&A and often SMC-R',
    diagnosticCodes: ['8017'],
  },
  'parkinsons': {
    smcLevel: 'L',
    category: 'AID_AND_ATTENDANCE',
    autoCheck: false,
    triggerRatings: [100],
    note: 'Advanced Parkinson\'s often requires A&A',
    diagnosticCodes: ['8004'],
  },
  'multiple-sclerosis': {
    smcLevel: 'K', // For ED, potentially L for severe cases
    category: 'CREATIVE_ORGAN',
    autoCheck: false,
    note: 'MS with ED qualifies for SMC-K; severe MS may qualify for SMC-L',
    diagnosticCodes: ['8018'],
  },

  // SMC-S triggers (housebound)
  'ptsd': {
    smcLevel: 'S',
    pathway: 'STATUTORY',
    triggerRatings: [100],
    note: 'PTSD at 100% with additional 60%+ disabilities = SMC-S',
    diagnosticCodes: ['9411'],
  },
  'tbi': {
    smcLevel: 'T', // TBI-specific
    autoCheck: false,
    triggerRatings: [100],
    note: 'TBI at 100% requiring A&A may qualify for SMC-T',
    diagnosticCodes: ['8045'],
  },
};

// ============================================
// ADL (ACTIVITIES OF DAILY LIVING) CRITERIA
// ============================================
// Used for Aid & Attendance determinations
export const ADL_CRITERIA = {
  cfrReference: '38 CFR § 3.352(a)',
  description: 'Factors for determining need for Aid and Attendance',

  factors: {
    DRESSING: {
      id: 'adl-dressing',
      name: 'Dressing/Undressing',
      description: 'Inability to dress or undress self without assistance',
      questions: [
        'Can you put on and remove clothing without help?',
        'Can you fasten buttons, zippers, or ties?',
        'Can you put on shoes and socks?',
      ],
    },
    HYGIENE: {
      id: 'adl-hygiene',
      name: 'Personal Hygiene',
      description: 'Inability to keep self ordinarily clean and presentable',
      questions: [
        'Can you bathe/shower without assistance?',
        'Can you brush teeth and comb hair?',
        'Can you shave or apply makeup?',
      ],
    },
    PROSTHETICS: {
      id: 'adl-prosthetics',
      name: 'Prosthetic/Orthopedic Appliances',
      description: 'Frequent need for adjustment of prosthetic or orthopedic appliances',
      questions: [
        'Do you wear prosthetic limbs or orthopedic devices?',
        'How often do you need help adjusting them?',
        'Can you put them on/remove them independently?',
      ],
    },
    FEEDING: {
      id: 'adl-feeding',
      name: 'Feeding',
      description: 'Inability to feed self through loss of coordination or extreme weakness',
      questions: [
        'Can you prepare simple meals?',
        'Can you use utensils to eat?',
        'Can you cut your own food?',
      ],
    },
    TOILETING: {
      id: 'adl-toileting',
      name: 'Attending to Wants of Nature',
      description: 'Inability to attend to the wants of nature',
      questions: [
        'Can you use the toilet without assistance?',
        'Can you manage clothing when using toilet?',
        'Do you have bowel or bladder incontinence?',
      ],
    },
    SAFETY: {
      id: 'adl-safety',
      name: 'Protection from Hazards',
      description: 'Physical or mental incapacity requiring care/assistance on regular basis to protect from hazards',
      questions: [
        'Can you be left alone safely for extended periods?',
        'Do you need reminders for medication or appointments?',
        'Are you at risk of falls or wandering?',
        'Can you respond appropriately to emergencies?',
      ],
    },
  },

  // Conditions that commonly require A&A
  commonConditions: [
    'Dementia/Neurocognitive disorders',
    'ALS (Amyotrophic Lateral Sclerosis)',
    'Advanced Parkinson\'s Disease',
    'Severe TBI residuals',
    'Paralysis (paraplegia, quadriplegia)',
    'Blindness (both eyes)',
    'Multiple severe disabilities combined',
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate total SMC-K awards based on qualifying conditions
 * @param {Array} serviceConnectedConditions - Array of SC conditions
 * @returns {Object} SMC-K eligibility analysis
 */
export const calculateSMCKEligibility = (serviceConnectedConditions) => {
  const kAwards = [];
  const categoryAwards = {}; // Track awards per category

  for (const condition of serviceConnectedConditions) {
    const trigger = SMC_CONDITION_TRIGGERS[condition.conditionKey];

    if (trigger && trigger.smcLevel === 'K') {
      const category = trigger.category;
      const categoryDef = SMC_K_CRITERIA.categories[category];

      if (!categoryDef) continue;

      // Check if we've already awarded for this category
      const currentCategoryAwards = categoryAwards[category] || 0;
      const maxInCategory = categoryDef.maxAwardsInCategory || 1;

      if (currentCategoryAwards < maxInCategory) {
        // Check if auto-grant or needs nexus
        if (trigger.autoCheck || (trigger.requiresRating && condition.currentRating >= trigger.requiresRating)) {
          kAwards.push({
            condition: condition.conditionName,
            category: category,
            categoryName: categoryDef.name,
            autoGrant: trigger.autoCheck,
            note: trigger.note || null,
          });
          categoryAwards[category] = currentCategoryAwards + 1;
        }
      }
    }

    // Stop at 3 awards (max)
    if (kAwards.length >= 3) break;
  }

  return {
    totalAwards: Math.min(kAwards.length, 3),
    monthlyAmount: Math.min(kAwards.length, 3) * SMC_RATES_2026.K.rate,
    awards: kAwards.slice(0, 3),
    maxReached: kAwards.length >= 3,
  };
};

/**
 * Check SMC-S (Housebound) eligibility
 * @param {Array} serviceConnectedConditions - Array of SC conditions
 * @returns {Object} SMC-S eligibility analysis
 */
export const calculateSMCSEligibility = (serviceConnectedConditions) => {
  // Find conditions rated at 100%
  const hundredPercentConditions = serviceConnectedConditions.filter(c => c.currentRating === 100);

  if (hundredPercentConditions.length === 0) {
    return {
      eligible: false,
      pathway: null,
      reason: 'No condition rated at 100% schedular',
      recommendation: 'SMC-S requires at least one condition rated at 100%',
    };
  }

  // Calculate remaining conditions' combined rating (excluding 100% conditions)
  const otherConditions = serviceConnectedConditions.filter(c => c.currentRating < 100 && c.currentRating > 0);

  if (otherConditions.length === 0) {
    return {
      eligible: false,
      pathway: null,
      reason: 'No additional disabilities besides 100% condition(s)',
      recommendation: 'SMC-S statutory path requires additional disabilities independently ratable at 60% or more',
    };
  }

  // Calculate combined rating of other conditions using VA math
  // (This is a simplified version - actual implementation should use proper VA combined rating formula)
  const otherRatings = otherConditions.map(c => c.currentRating).sort((a, b) => b - a);
  let combinedOther = 0;
  let efficiency = 100;

  for (const rating of otherRatings) {
    combinedOther += (efficiency * rating) / 100;
    efficiency = 100 - combinedOther;
  }

  const roundedCombined = Math.round(combinedOther / 10) * 10;

  return {
    eligible: roundedCombined >= 60,
    pathway: 'STATUTORY',
    hundredPercentCondition: hundredPercentConditions[0]?.conditionName,
    additionalConditionsCombined: roundedCombined,
    additionalConditions: otherConditions.map(c => ({
      name: c.conditionName,
      rating: c.currentRating,
    })),
    monthlyAmount: roundedCombined >= 60 ? SMC_RATES_2026.S.veteran_alone : 0,
    reason: roundedCombined >= 60
        ? `100% for ${hundredPercentConditions[0]?.conditionName} + ${roundedCombined}% additional disabilities`
        : `Additional disabilities only combine to ${roundedCombined}% (need 60%+)`,
    recommendation: roundedCombined < 60
        ? `Need ${60 - roundedCombined}% more in additional disabilities for SMC-S eligibility`
        : 'Consider filing for SMC-S Housebound status',
  };
};

/**
 * Get all SMC eligibility for a veteran
 * @param {Array} serviceConnectedConditions - Array of SC conditions
 * @returns {Object} Complete SMC eligibility analysis
 */
export const getCompleteSMCAnalysis = (serviceConnectedConditions) => {
  const smcK = calculateSMCKEligibility(serviceConnectedConditions);
  const smcS = calculateSMCSEligibility(serviceConnectedConditions);

  // Check for conditions that might indicate A&A needs
  const potentialAAConditions = serviceConnectedConditions.filter(c => {
    const trigger = SMC_CONDITION_TRIGGERS[c.conditionKey];
    return trigger && (trigger.smcLevel === 'L' || trigger.smcLevel === 'T');
  });

  return {
    smcK,
    smcS,
    potentialAidAndAttendance: potentialAAConditions.length > 0 ? {
      conditions: potentialAAConditions.map(c => c.conditionName),
      recommendation: 'These conditions may qualify for Aid & Attendance (SMC-L or higher). Consider evaluation.',
    } : null,
    totalMonthlyBenefit: {
      smcK: smcK.monthlyAmount,
      smcS: smcS.eligible ? smcS.monthlyAmount : 0,
      note: 'SMC-K is additive; SMC-S/L/etc. are standalone and replace standard compensation',
    },
  };
};

// Export all criteria for use in other components
export const SMC_CRITERIA = {
  K: SMC_K_CRITERIA,
  L: SMC_L_CRITERIA,
  S: SMC_S_CRITERIA,
  M: SMC_M_CRITERIA,
  N: SMC_N_CRITERIA,
  O: SMC_O_CRITERIA,
  R: SMC_R_CRITERIA,
  T: SMC_T_CRITERIA,
  ADL: ADL_CRITERIA,
  RATES: SMC_RATES_2026,
  TRIGGERS: SMC_CONDITION_TRIGGERS,
};

export default SMC_CRITERIA;