/**
 * ratingEnhancements.js
 *
 * Central data file containing key definitions, case law references,
 * documentation tips, and regulation updates for VA disability rating cards.
 *
 * Used to enhance rating cards with educational content that helps
 * veterans understand criteria and build stronger claims.
 *
 * Sources:
 * - U.S. Court of Appeals for Veterans Claims (CAVC)
 * - 38 CFR Part 4 - Schedule for Rating Disabilities
 * - Board of Veterans' Appeals decisions
 * - Veterans Law Library
 */

/**
 * Rating enhancements organized by diagnostic code
 */
export const RATING_ENHANCEMENTS = {
  // ============================================
  // MIGRAINE HEADACHES - DC 8100
  // ============================================
  '8100': {
    condition: 'Migraine Headaches',
    cfrReference: '38 CFR 4.124a',

    keyDefinitions: {
      prostrating: {
        term: 'Prostrating',
        definition: 'BVA defines as "utter physical exhaustion or helplessness." The veteran must stop all activity, seek medical attention or seclude themselves, and be unable to perform occupational or daily activities.',
        source: 'Board of Veterans\' Appeals decisions',
        important: true
      },
      characteristic: {
        term: 'Characteristic',
        definition: 'Means "typical" - referring to the usual symptoms that accompany your migraines.',
        source: '38 CFR 4.124a'
      },
      prolongedAttack: {
        term: 'Prolonged Attack',
        definition: 'Generally interpreted as lasting 4 or more hours.',
        source: 'VA examination guidelines'
      },
      economicInadaptability: {
        term: 'Economic Inadaptability',
        definition: 'Can mean either "producing" OR "capable of producing" economic inadaptability. Being currently employed does NOT preclude a 50% rating.',
        source: 'Pierce v. Principi (2004)',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Pierce v. Principi',
        citation: '18 Vet. App. 440 (2004)',
        year: 2004,
        holding: 'Current employment is irrelevant for determining "economic inadaptability." The standard is whether migraines are CAPABLE of causing economic problems, not whether they currently are.',
        practicalApplication: 'If denied 50% because "you\'re still working," cite this case. You do not need to be unemployed to qualify.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Keep a detailed headache journal for several months noting: date, time of onset, duration, severity (1-10), and whether the attack was prostrating.',
        priority: 'critical'
      },
      {
        tip: 'Document what "prostrating" means for you - did you have to leave work? Go to a dark room? Miss family events?',
        priority: 'high'
      },
      {
        tip: '"I have migraines once or twice a month" reported to an examiner is NOT actionable evidence. Provide specific documentation.',
        priority: 'critical'
      },
      {
        tip: 'Track medication usage and effectiveness - failed medications support severity.',
        priority: 'medium'
      },
      {
        tip: 'Note impact on work: missed days, reduced productivity, accommodations needed.',
        priority: 'high'
      }
    ],

    examTips: [
      'Describe your WORST migraines, not your average ones',
      'Bring your headache journal to the C&P exam',
      'Explain what you cannot do during a prostrating attack',
      'Mention if you\'ve had to leave work or cancel plans due to migraines'
    ],

    commonMistakes: [
      'Underreporting frequency because attacks vary month to month',
      'Not explaining what "prostrating" means in practical terms',
      'Failing to document the economic impact even if still employed'
    ]
  },

  // ============================================
  // SLEEP APNEA - DC 6847
  // ============================================
  '6847': {
    condition: 'Sleep Apnea',
    cfrReference: '38 CFR 4.97',

    keyDefinitions: {
      persistentDaytimeHypersomnolence: {
        term: 'Persistent Daytime Hypersomnolence',
        definition: 'Excessive daytime sleepiness despite adequate nighttime sleep. This is the key criterion for the 50% rating with CPAP use.',
        source: '38 CFR 4.97',
        important: true
      },
      chronicRespiratoryFailure: {
        term: 'Chronic Respiratory Failure',
        definition: 'Requires CO2 retention or cor pulmonale, OR requires tracheostomy. This is the criterion for 100% rating.',
        source: '38 CFR 4.97'
      },
      breathingAssistanceDevice: {
        term: 'Breathing Assistance Device',
        definition: 'Includes CPAP, BiPAP, APAP, and other positive airway pressure devices. Required for 50% rating.',
        source: '38 CFR 4.97'
      }
    },

    caseLaw: [],

    documentationTips: [
      {
        tip: 'Obtain your sleep study report showing AHI (Apnea-Hypopnea Index) score.',
        priority: 'critical'
      },
      {
        tip: 'Document CPAP compliance data - most machines track usage automatically.',
        priority: 'high'
      },
      {
        tip: 'Track daytime sleepiness symptoms: falling asleep at work, while driving, during conversations.',
        priority: 'high'
      },
      {
        tip: 'Note morning headaches, dry mouth, and other symptoms even with CPAP use.',
        priority: 'medium'
      },
      {
        tip: 'Document how sleep apnea affects your work and daily functioning.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Bring your CPAP machine\'s compliance report',
      'Describe daytime sleepiness despite using CPAP',
      'Mention any accidents or near-misses due to sleepiness',
      'Report if you\'ve tried multiple pressure settings or devices'
    ],

    secondaryConditions: [
      'Hypertension (common secondary)',
      'Depression/Anxiety',
      'Cardiac conditions',
      'Cognitive impairment'
    ]
  },

  // ============================================
  // PTSD - DC 9411
  // ============================================
  '9411': {
    condition: 'PTSD',
    cfrReference: '38 CFR 4.130',

    keyDefinitions: {
      occupationalImpairment: {
        term: 'Occupational Impairment',
        definition: 'Impact on your ability to work - includes reduced reliability, productivity, and ability to maintain employment.',
        source: '38 CFR 4.130',
        important: true
      },
      socialImpairment: {
        term: 'Social Impairment',
        definition: 'Impact on relationships and social functioning - includes isolation, difficulty with family, and inability to maintain friendships.',
        source: '38 CFR 4.130',
        important: true
      },
      totalImpairment: {
        term: 'Total Occupational and Social Impairment',
        definition: 'Required for 100% rating. Does not mean you must be hospitalized, but that symptoms prevent all meaningful work and social functioning.',
        source: '38 CFR 4.130'
      }
    },

    caseLaw: [
      {
        case: 'Clemons v. Shinseki',
        citation: '23 Vet. App. 1 (2009)',
        year: 2009,
        holding: 'When a veteran claims PTSD, the VA must consider ALL psychiatric diagnoses shown in the record. You don\'t need to correctly diagnose yourself.',
        practicalApplication: 'If you claimed PTSD but records show depression or anxiety, the VA should still consider those conditions.',
        important: true
      },
      {
        case: 'Mauerhan v. Principi',
        citation: '16 Vet. App. 436 (2002)',
        year: 2002,
        holding: 'The symptoms listed in the rating criteria are EXAMPLES, not requirements. You don\'t need every listed symptom to qualify for a rating.',
        practicalApplication: 'If denied because you "don\'t have symptom X," cite Mauerhan. Focus on overall impairment level.',
        important: true
      },
      {
        case: 'Mittleider v. West',
        citation: '11 Vet. App. 181 (1998)',
        year: 1998,
        holding: 'When symptoms from service-connected and non-service-connected conditions cannot be separated, all symptoms must be attributed to the service-connected condition.',
        practicalApplication: 'If you have PTSD (SC) and depression (not SC), and symptoms overlap, attribute all to PTSD.'
      }
    ],

    documentationTips: [
      {
        tip: 'Track intrusive symptoms: nightmares, flashbacks, intrusive thoughts with dates and severity.',
        priority: 'critical'
      },
      {
        tip: 'Document avoidance behaviors: places, people, or situations you avoid due to PTSD.',
        priority: 'high'
      },
      {
        tip: 'Keep records of relationship problems, social isolation, and missed events.',
        priority: 'high'
      },
      {
        tip: 'Note work problems: missed days, conflicts, disciplinary actions, job changes.',
        priority: 'critical'
      },
      {
        tip: 'Buddy statements from family members describing behavioral changes are powerful evidence.',
        priority: 'high'
      },
      {
        tip: 'Maintain consistent mental health treatment - gaps in treatment can hurt your claim.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Describe your WORST periods, not just how you feel today',
      'Explain how symptoms affect work and relationships specifically',
      'Mention any hospitalizations, ER visits, or crisis calls',
      'Don\'t minimize symptoms - be honest about struggles'
    ],

    commonMistakes: [
      'Minimizing symptoms because of shame or stoicism',
      'Only reporting current symptoms, not historical worst periods',
      'Not connecting symptoms to functional impairment',
      'Gaps in treatment that suggest symptoms aren\'t severe'
    ]
  },

  // ============================================
  // TINNITUS - DC 6260
  // ============================================
  '6260': {
    condition: 'Tinnitus',
    cfrReference: '38 CFR 4.87',

    keyDefinitions: {
      recurrentTinnitus: {
        term: 'Recurrent Tinnitus',
        definition: 'Tinnitus that occurs repeatedly. Does not need to be constant to be rated.',
        source: '38 CFR 4.87'
      },
      tinnitus: {
        term: 'Tinnitus',
        definition: 'Ringing, buzzing, hissing, or other sounds in the ears without external source. Veterans are competent to self-diagnose this condition.',
        source: 'Jandreau v. Nicholson (2007)',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Fountain v. McDonald',
        citation: '27 Vet. App. 258 (2015)',
        year: 2015,
        holding: 'Tinnitus is a "chronic disease" under 38 C.F.R. § 3.309(a) as an organic disease of the nervous system. This means it qualifies for presumptive service connection.',
        practicalApplication: 'If you had noise exposure in service and developed tinnitus within one year of discharge, you may qualify for presumptive service connection without a nexus letter.',
        important: true
      },
      {
        case: 'Jandreau v. Nicholson',
        citation: '492 F.3d 1372 (Fed. Cir. 2007)',
        year: 2007,
        holding: 'Veterans are competent to diagnose tinnitus themselves. No medical diagnosis is required.',
        practicalApplication: 'Your statement that you have ringing in your ears IS competent evidence. The VA cannot require a doctor to diagnose it.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document your MOS and noise exposure during service (weapons, vehicles, aircraft, machinery).',
        priority: 'critical'
      },
      {
        tip: 'Use the MOS Noise Exposure Lookup in this app to find your presumptive noise exposure level.',
        priority: 'high'
      },
      {
        tip: 'Track how tinnitus affects sleep, concentration, and daily activities.',
        priority: 'medium'
      },
      {
        tip: 'Note if tinnitus interferes with hearing conversations or causes headaches.',
        priority: 'medium'
      },
      {
        tip: 'Document when you first noticed tinnitus - especially if within one year of discharge.',
        priority: 'high'
      }
    ],

    examTips: [
      'Describe the sound (ringing, buzzing, hissing) and which ear(s)',
      'Explain your noise exposure in service in detail',
      'Mention if tinnitus is constant or recurrent',
      'Describe functional impact (sleep, concentration, hearing)'
    ],

    ratingNote: 'Tinnitus is rated at a maximum of 10% regardless of whether it affects one or both ears. It is rated separately from hearing loss.',

    secondaryConditions: [
      'Sleep disturbance',
      'Anxiety',
      'Depression',
      'Migraines'
    ]
  },

  // ============================================
  // HEARING LOSS - DC 6100
  // ============================================
  '6100': {
    condition: 'Hearing Loss',
    cfrReference: '38 CFR 4.85-4.86',

    keyDefinitions: {
      puretoneThreshold: {
        term: 'Puretone Threshold',
        definition: 'The softest sound you can hear at specific frequencies (1000, 2000, 3000, 4000 Hz). Measured in decibels.',
        source: '38 CFR 4.85'
      },
      speechDiscrimination: {
        term: 'Speech Discrimination',
        definition: 'Your ability to understand speech, measured using the Maryland CNC word list. Reported as a percentage.',
        source: '38 CFR 4.85'
      },
      exceptionalPatterns: {
        term: 'Exceptional Patterns of Hearing Loss',
        definition: 'Specific patterns (55dB+ at all four frequencies, or 30dB or less at 1000Hz and 70dB+ at 2000Hz) that allow using the higher Roman numeral from either Table VI or VIa.',
        source: '38 CFR 4.86',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Martinak v. Nicholson',
        citation: '21 Vet. App. 447 (2007)',
        year: 2007,
        holding: 'VA examiners must describe the functional effects of hearing loss, not just provide audiometric data.',
        practicalApplication: 'If your exam only has numbers without describing how hearing loss affects your daily life, it may be inadequate.'
      }
    ],

    documentationTips: [
      {
        tip: 'Hearing loss ratings require official VA audiometry - document situations where you have difficulty hearing.',
        priority: 'high'
      },
      {
        tip: 'Track specific situations: trouble hearing conversations, TV volume, phone calls, in crowds.',
        priority: 'high'
      },
      {
        tip: 'Note safety concerns: not hearing alarms, vehicles, people calling your name.',
        priority: 'medium'
      },
      {
        tip: 'Document your MOS and noise exposure during service.',
        priority: 'critical'
      },
      {
        tip: 'Keep records of hearing aid fittings and adjustments.',
        priority: 'medium'
      }
    ],

    examTips: [
      'The Maryland CNC word recognition test is required - prepare for it',
      'Describe functional hearing difficulties in detail',
      'Mention if you use hearing aids and their effectiveness',
      'Report any difficulty understanding speech in various environments'
    ],

    ratingNote: 'Hearing loss is rated on a mechanical formula using Tables VI, VIa, and VII in 38 CFR 4.85. Tinnitus (DC 6260) is rated separately at 10%.'
  },

  // ============================================
  // GENERAL MENTAL HEALTH - SHARED
  // ============================================
  'mentalHealth': {
    condition: 'Mental Health (General Rating Formula)',
    cfrReference: '38 CFR 4.130',

    keyDefinitions: {
      generalRatingFormula: {
        term: 'General Rating Formula for Mental Disorders',
        definition: 'All mental health conditions (depression, anxiety, PTSD, etc.) are rated using the same criteria based on level of occupational and social impairment.',
        source: '38 CFR 4.130',
        important: true
      },
      gaf: {
        term: 'GAF Score (Historical)',
        definition: 'Global Assessment of Functioning - a 1-100 scale previously used by VA. No longer required but may still appear in older records.',
        source: 'DSM-IV (discontinued in DSM-5)'
      }
    },

    caseLaw: [
      {
        case: 'Clemons v. Shinseki',
        citation: '23 Vet. App. 1 (2009)',
        year: 2009,
        holding: 'VA must consider all psychiatric diagnoses when one is claimed.',
        practicalApplication: 'Claim for the symptoms, not just the diagnosis.',
        important: true
      },
      {
        case: 'Mauerhan v. Principi',
        citation: '16 Vet. App. 436 (2002)',
        year: 2002,
        holding: 'Symptoms listed in rating criteria are examples, not requirements.',
        practicalApplication: 'You don\'t need every listed symptom - focus on overall impairment.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document both occupational AND social impairment - both matter for ratings.',
        priority: 'critical'
      },
      {
        tip: 'Track symptom frequency, not just occurrence.',
        priority: 'high'
      },
      {
        tip: 'Note functional impact: missed work, relationship problems, self-care difficulties.',
        priority: 'critical'
      },
      {
        tip: 'Buddy statements from family are powerful evidence of behavioral changes.',
        priority: 'high'
      }
    ]
  },

  // ============================================
  // MUSCULOSKELETAL - SPINE
  // ============================================
  'spine': {
    condition: 'Spine Conditions (General Rating Formula)',
    cfrReference: '38 CFR 4.71a',

    keyDefinitions: {
      forwardFlexion: {
        term: 'Forward Flexion',
        definition: 'Bending forward at the waist. Normal thoracolumbar forward flexion is 90 degrees. Limited flexion is a key rating criterion.',
        source: '38 CFR 4.71a',
        important: true
      },
      combinedROM: {
        term: 'Combined Range of Motion',
        definition: 'Sum of forward flexion + extension + left/right lateral flexion + left/right rotation. Normal thoracolumbar combined ROM is 240 degrees.',
        source: '38 CFR 4.71a'
      },
      ankylosis: {
        term: 'Ankylosis',
        definition: 'Complete immobility of the spine in a fixed position. Favorable ankylosis allows upright position; unfavorable does not.',
        source: '38 CFR 4.71a'
      },
      incapacitatingEpisode: {
        term: 'Incapacitating Episode',
        definition: 'A period of acute signs and symptoms requiring bed rest PRESCRIBED BY A PHYSICIAN and treatment by a physician.',
        source: '38 CFR 4.71a',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'VA must consider functional loss due to pain, weakness, fatigability, and incoordination when rating musculoskeletal disabilities.',
        practicalApplication: 'If your exam only measured ROM without considering pain, it may be inadequate.',
        important: true
      },
      {
        case: 'Mitchell v. Shinseki',
        citation: '25 Vet. App. 32 (2011)',
        year: 2011,
        holding: 'VA must consider functional loss during flare-ups, not just at examination.',
        practicalApplication: 'Document your flare-ups - the examiner must consider your worst days.',
        important: true
      },
      {
        case: 'Sharp v. Shulkin',
        citation: '29 Vet. App. 26 (2017)',
        year: 2017,
        holding: 'Examiners must attempt to estimate functional loss during flare-ups, even if not currently experiencing one.',
        practicalApplication: 'Examiner cannot say "unable to determine without speculation" - they must estimate.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Track flare-ups with dates, duration, severity, and functional impact.',
        priority: 'critical'
      },
      {
        tip: 'Note when you need bed rest during bad episodes.',
        priority: 'high'
      },
      {
        tip: 'Document activities you cannot do during flare-ups vs. good days.',
        priority: 'high'
      },
      {
        tip: 'Keep records of physical therapy, injections, and other treatments.',
        priority: 'medium'
      },
      {
        tip: 'Radiculopathy (nerve pain down legs/arms) is rated separately - document these symptoms.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Describe your WORST days, not the day of the exam',
      'Report pain on movement - not just final ROM numbers',
      'Mention if you have more limitation after repetitive use',
      'Document neurological symptoms (numbness, tingling, weakness)'
    ]
  }
};

/**
 * Critical Legal Standards
 */
export const LEGAL_STANDARDS = {
  benefitOfTheDoubt: {
    name: 'Benefit of the Doubt',
    citation: '38 U.S.C. § 5107(b); 38 C.F.R. § 3.102',
    explanation: 'When evidence is in approximate balance (50/50), VA must decide in the veteran\'s favor.',
    warning: 'HOWEVER: After the Supreme Court\'s Bufkin v. Collins decision (March 2025), this rule only applies if VA admits the evidence is balanced. If VA says one opinion is "more persuasive," courts usually cannot re-weigh it on appeal. VA is finding evidence "balanced" less and less often.',
    practicalTip: 'Build your case so strong from the START that VA cannot reasonably say evidence isn\'t equal. Don\'t aim for "close enough" - the landscape has changed. Strong medical nexus letters, buddy statements, and documented real-world limitations are essential.',
    caseReferences: [
      {
        case: 'Gilbert v. Derwinski',
        citation: '1 Vet. App. 49 (1990)',
        year: 1990,
        holding: 'Established that when evidence is approximately balanced, benefit of the doubt goes to the veteran.'
      },
      {
        case: 'Bufkin v. Collins',
        citation: 'Supreme Court (March 2025)',
        year: 2025,
        holding: 'Courts generally cannot re-weigh evidence on appeal if VA determined one medical opinion was "more persuasive" than another. This significantly limits the practical application of benefit of the doubt.',
        important: true,
        warning: true
      }
    ],
    importance: 'critical'
  }
};

/**
 * Regulation updates - track changes to rating criteria
 */
export const REGULATION_UPDATES = [
  {
    condition: 'IBS',
    diagnosticCode: '7319',
    change: 'IBS no longer has a 0% rating option',
    effectiveDate: 'May 19, 2024',
    details: 'Minimum rating is now 10% for mild symptoms.',
    source: '89 FR 44139'
  },
  {
    condition: 'Mental Health',
    diagnosticCode: '9400-9440',
    change: 'Updated evaluation criteria and guidance',
    effectiveDate: 'November 2021',
    details: 'Clarified occupational and social impairment standards.',
    source: '86 FR 54068'
  },
  {
    condition: 'Cardiovascular',
    diagnosticCode: '7000-7122',
    change: 'Updated cardiac evaluation criteria',
    effectiveDate: 'November 14, 2021',
    details: 'Revised MET requirements and added new diagnostic codes.',
    source: '86 FR 54068'
  }
];

/**
 * Get enhancements for a specific diagnostic code
 */
export const getEnhancementsForDC = (diagnosticCode) => {
  // Direct match
  if (RATING_ENHANCEMENTS[diagnosticCode]) {
    return RATING_ENHANCEMENTS[diagnosticCode];
  }

  // Check for mental health codes (9xxx)
  if (diagnosticCode?.toString().startsWith('9')) {
    return {
      ...RATING_ENHANCEMENTS['mentalHealth'],
      ...RATING_ENHANCEMENTS[diagnosticCode]
    };
  }

  // Check for spine codes (5235-5243)
  const spineCode = parseInt(diagnosticCode);
  if (spineCode >= 5235 && spineCode <= 5243) {
    return RATING_ENHANCEMENTS['spine'];
  }

  return null;
};

/**
 * Get case law for a specific condition type
 */
export const getCaseLawForCondition = (conditionType) => {
  const enhancements = RATING_ENHANCEMENTS[conditionType];
  return enhancements?.caseLaw || [];
};

/**
 * Get regulation updates for a diagnostic code
 */
export const getRegulationUpdates = (diagnosticCode) => {
  return REGULATION_UPDATES.filter(update =>
      update.diagnosticCode === diagnosticCode ||
      update.diagnosticCode.includes(diagnosticCode)
  );
};

export default RATING_ENHANCEMENTS;