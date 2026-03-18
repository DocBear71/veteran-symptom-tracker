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
  },

  // ============================================
  // TRAUMATIC BRAIN INJURY RESIDUALS - DC 8045
  // ============================================
  '8045': {
    condition: 'Traumatic Brain Injury (TBI) Residuals',
    cfrReference: '38 CFR 4.124a, DC 8045',

    keyDefinitions: {
      residuals: {
        term: 'TBI Residuals',
        definition: 'TBI is rated on its residuals — cognitive, neurological, emotional, and physical symptoms that persist after the injury. Each distinct residual may be rated separately.',
        source: '38 CFR 4.124a',
        important: true
      },
      cognitiveImpairment: {
        term: 'Cognitive Impairment',
        definition: 'Memory, attention, concentration, and executive function deficits. Rated under DC 8045 using a separate subjective and objective criteria table. Ten severity levels from 0–100%.',
        source: '38 CFR 4.124a, Table 20.1',
        important: true
      },
      combatTBI: {
        term: 'Concussion vs. TBI',
        definition: 'VA treats all TBI on a spectrum. Even "mild" concussions from blast exposure can cause severe, permanent residuals. Do not minimize prior concussions.',
        source: '38 CFR 4.124a',
        important: true
      },
      pyramiding: {
        term: 'Anti-Pyramiding Rule',
        definition: 'Each symptom may only be rated once. TBI residuals (headaches, cognitive impairment, sleep disturbance) that are rated separately cannot also be rated under TBI. However, PTSD diagnosed separately may be rated in addition to TBI cognitive residuals.',
        source: '38 CFR 4.14',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Jandreau v. Nicholson',
        citation: '492 F.3d 1372 (Fed. Cir. 2007)',
        year: 2007,
        holding: 'Veterans are competent to testify about observable symptoms, including memory problems and behavioral changes after TBI.',
        practicalApplication: 'Your lay statement about cognitive changes after blast exposure IS competent evidence.',
        important: true
      },
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'A veteran\'s lay testimony about pain and functional limitations is competent and sufficient evidence.',
        practicalApplication: 'Document cognitive and behavioral symptoms in your own words — lay testimony has legal weight.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document EVERY TBI/concussion event during service — blast exposure, vehicle accidents, falls, hand-to-hand combat.',
        priority: 'critical'
      },
      {
        tip: 'Get neuropsychological testing — objective cognitive testing is the strongest evidence for TBI residual ratings.',
        priority: 'critical'
      },
      {
        tip: 'Track all residual symptoms separately: headaches, cognitive issues, sleep, balance, emotional changes, sensory changes.',
        priority: 'high'
      },
      {
        tip: 'Document the link between TBI and subsequent PTSD or depression if both are present — these may both be ratable.',
        priority: 'high'
      },
      {
        tip: 'Buddy statements from fellow service members who witnessed the TBI event are powerful nexus evidence.',
        priority: 'high'
      },
      {
        tip: 'Document occupational impact: job changes, performance declines, inability to handle cognitively demanding work.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report ALL head injuries during service — even those dismissed as "just a headache" at the time',
      'Describe cognitive symptoms specifically: "I forget names of people I\'ve known for years" beats "I have memory problems"',
      'Report emotional and behavioral changes since TBI: irritability, impulsivity, depression',
      'Bring neuropsychological testing results if available',
      'Mention impact on employment — inability to do cognitively demanding work'
    ],

    commonMistakes: [
      'Failing to report all blast exposure events, even without loss of consciousness',
      'Underreporting cognitive symptoms due to minimization or not connecting them to TBI',
      'Not obtaining neuropsychological testing to objectively document deficits',
      'Failing to claim TBI residuals separately from PTSD when both are present'
    ],

    ratingNote: 'TBI residuals are rated on 10 domains using a complex worksheet. Cognitive impairment, emotional/behavioral changes, vestibular, and other residuals are each evaluated. Consider requesting a Disability Benefits Questionnaire (DBQ) for TBI from a knowledgeable examiner.'
  },

  // ============================================
  // RADICULOPATHY - DC 8520 / 8521
  // ============================================
  '8520': {
    condition: 'Radiculopathy',
    cfrReference: '38 CFR 4.124a, DC 8520–8730',

    keyDefinitions: {
      radiculopathy: {
        term: 'Radiculopathy',
        definition: 'Nerve root compression causing pain, numbness, tingling, or weakness radiating along the nerve\'s distribution. Each nerve root (sciatic, femoral, etc.) has its own DC and is separately ratable from the spine.',
        source: '38 CFR 4.124a',
        important: true
      },
      separateRating: {
        term: 'Separate Rating from Spine',
        definition: 'Radiculopathy is rated SEPARATELY from the spinal condition that causes it. A veteran with lumbar disc disease AND sciatic radiculopathy may receive ratings for BOTH.',
        source: '38 CFR 4.71a Note',
        important: true
      },
      bilateralFactor: {
        term: 'Bilateral Factor',
        definition: 'When radiculopathy affects both legs or both arms, an additional 10% bilateral factor is applied to the combined rating before adding other conditions.',
        source: '38 CFR 3.383',
        important: true
      },
      severity: {
        term: 'Severity Levels',
        definition: 'Sciatic nerve (and other peripheral nerves) rated as: mild (10%), moderate (20%), moderately severe (40%), severe (60%), complete paralysis (80%). Level based on motor AND sensory involvement.',
        source: '38 CFR 4.124a'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'VA must consider functional loss due to pain, weakness, fatigability, and incoordination — not just range of motion measurements.',
        practicalApplication: 'If radiculopathy pain limits your function, document it even if your ROM is relatively preserved.',
        important: true
      },
      {
        case: 'Burton v. Shinseki',
        citation: '25 Vet. App. 1 (2011)',
        year: 2011,
        holding: 'VA must consider functional loss during flare-ups when rating musculoskeletal and neurological conditions.',
        practicalApplication: 'Your worst days matter — document flare-up frequency and severity.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Make sure your spine claim ALSO claims radiculopathy — it must be claimed separately to be rated separately.',
        priority: 'critical'
      },
      {
        tip: 'Document weakness specifically: can you carry groceries, climb stairs, grip objects? Weakness supports higher ratings than pain alone.',
        priority: 'high'
      },
      {
        tip: 'Track numbness and sensory loss distribution — dermatomal patterns match specific nerve roots and DCs.',
        priority: 'high'
      },
      {
        tip: 'Get EMG/nerve conduction studies — objective evidence of nerve damage strengthens the claim.',
        priority: 'high'
      },
      {
        tip: 'If bilateral (both legs/arms affected), note this explicitly — bilateral factor adds additional compensation.',
        priority: 'critical'
      },
      {
        tip: 'Document bowel/bladder involvement if present — this signals severe nerve compression and potential SMC.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Describe weakness, not just pain — motor deficits drive higher ratings than sensory symptoms alone',
      'Report the distribution of symptoms: exactly where do you feel numbness, tingling, or weakness?',
      'Mention if symptoms are bilateral — both legs or both arms affected',
      'Report bowel or bladder problems if present — these indicate severe nerve involvement',
      'Describe how radiculopathy limits your daily activities, not just that it hurts'
    ],

    commonMistakes: [
      'Not claiming radiculopathy separately from the spine condition',
      'Describing only pain and not reporting motor weakness or sensory loss',
      'Not mentioning bilateral involvement',
      'Failing to get EMG/NCS to objectively document nerve involvement'
    ]
  },

  // Alias for DC 8521 (peripheral neuropathy uses similar framework)
  '8521': {
    condition: 'Peripheral Neuropathy',
    cfrReference: '38 CFR 4.124a, DC 8521',

    keyDefinitions: {
      peripheralNeuropathy: {
        term: 'Peripheral Neuropathy',
        definition: 'Damage to peripheral nerves causing pain, numbness, weakness, or autonomic dysfunction. May be service-connected directly or as secondary to diabetes, Agent Orange exposure, or other service-connected conditions.',
        source: '38 CFR 4.124a',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: 'Peripheral neuropathy occurring within one year of last exposure to herbicide agents (e.g., Agent Orange) is presumptively service-connected for Vietnam veterans.',
        source: '38 CFR 3.309(e)',
        important: true
      },
      diabeticNeuropathy: {
        term: 'Diabetic Neuropathy',
        definition: 'Peripheral neuropathy secondary to service-connected diabetes is separately ratable under 38 CFR 3.310. Each affected nerve group may be rated under its own DC.',
        source: '38 CFR 3.310 / 4.124a',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain and weakness must be considered in rating.',
        practicalApplication: 'Document how neuropathy weakness and pain limit your daily function.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'If secondary to diabetes, explicitly document the secondary service connection claim.',
        priority: 'critical'
      },
      {
        tip: 'Get EMG/nerve conduction studies — objective evidence of nerve damage is essential.',
        priority: 'critical'
      },
      {
        tip: 'Document weakness separately from pain — motor involvement drives higher ratings.',
        priority: 'high'
      },
      {
        tip: 'Track bilateral involvement — bilateral factor applies if both limbs affected.',
        priority: 'high'
      },
      {
        tip: 'For Vietnam veterans: document dates of service in Vietnam for Agent Orange presumptive.',
        priority: 'critical'
      },
      {
        tip: 'Document autonomic symptoms if present: orthostatic hypotension, gastroparesis, sexual dysfunction.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report motor weakness and coordination problems, not just numbness and pain',
      'Describe the distribution of symptoms — which limbs, which areas',
      'Report if symptoms are worse at night (common in diabetic neuropathy)',
      'Mention balance problems and fall risk from peripheral neuropathy',
      'Report autonomic symptoms if present'
    ]
  },

  // ============================================
  // EPILEPSY / SEIZURE DISORDERS - DC 8910/8911
  // ============================================
  '8910': {
    condition: 'Epilepsy, Grand Mal (Major Seizures)',
    cfrReference: '38 CFR 4.124a, DC 8910',

    keyDefinitions: {
      majorSeizure: {
        term: 'Major (Grand Mal) Seizure',
        definition: 'Generalized tonic-clonic seizure with loss of consciousness, convulsions, and postictal confusion. Must be witnessed or documented in medical records to count for VA rating purposes.',
        source: '38 CFR 4.124a, DC 8910',
        important: true
      },
      frequency: {
        term: 'Seizure Frequency Ratings',
        definition: 'Ratings: 10% (1 per 2 years or less), 20% (1 per year), 40% (1 per 4 months), 60% (1 per 2 months), 80% (1 per month), 100% (weekly or more, or status epilepticus).',
        source: '38 CFR 4.124a, DC 8910',
        important: true
      },
      postIctal: {
        term: 'Postictal State',
        definition: 'The period of confusion, fatigue, or disorientation following a seizure. Severe postictal periods lasting hours increase functional impairment and should be documented.',
        source: '38 CFR 4.124a'
      },
      wellControlled: {
        term: '"Well Controlled" Misapplication',
        definition: 'VA sometimes rates seizures as 0% if "well controlled on medication." This is legally incorrect — the minimum rating for service-connected epilepsy is 10%, and medication compliance does not reduce the rating.',
        source: '38 CFR 4.124a Note',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Caluza v. Brown',
        citation: '7 Vet. App. 498 (1995)',
        year: 1995,
        holding: 'Lay testimony about seizure frequency is competent evidence even without continuous medical observation.',
        practicalApplication: 'Your statement and family witness statements about seizure frequency ARE valid evidence.',
        important: true
      },
      {
        case: 'Fountain v. McDonald',
        citation: '27 Vet. App. 258 (2015)',
        year: 2015,
        holding: 'Epilepsy is a "chronic disease" qualifying for presumptive service connection under 38 CFR 3.309(a).',
        practicalApplication: 'If epilepsy manifested within one year of discharge, it may be presumptively service-connected without a nexus letter.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Keep a seizure diary: date, time, duration, type, triggers, and postictal state for every seizure.',
        priority: 'critical'
      },
      {
        tip: 'Have witnesses document seizures — family member or employer statements describing witnessed events are powerful evidence.',
        priority: 'critical'
      },
      {
        tip: 'Get EEG results — objective brain wave abnormalities confirm the diagnosis and strengthen the claim.',
        priority: 'high'
      },
      {
        tip: 'Document driving restrictions — inability to drive is both a safety concern and a functional limitation affecting employment.',
        priority: 'high'
      },
      {
        tip: 'Track medication history including failed medications — treatment-resistant epilepsy supports higher ratings.',
        priority: 'medium'
      },
      {
        tip: 'Document employment impact: jobs you cannot hold due to seizure risk (heights, machinery, driving).',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring your seizure diary — specific dates and frequencies are essential',
      'Bring a family member or witness who can describe what they observe during your seizures',
      'Report the full duration including postictal recovery time, not just the seizure itself',
      'Describe the impact on driving, employment, and independent living',
      'Report breakthrough seizures even when medicated — these are what get rated'
    ],

    commonMistakes: [
      'Not keeping a documented seizure log — relying on memory alone',
      'Not having witnessed events documented by others',
      'Accepting a 0% rating because seizures are "controlled" — minimum is 10% for service-connected epilepsy',
      'Failing to document postictal functional impairment'
    ]
  },

  '8911': {
    condition: 'Epilepsy, Petit Mal (Minor Seizures)',
    cfrReference: '38 CFR 4.124a, DC 8911',

    keyDefinitions: {
      minorSeizure: {
        term: 'Minor (Petit Mal) Seizure',
        definition: 'Absence seizures, myoclonic jerks, focal aware seizures, or brief lapses in consciousness. Rated on frequency per week, not per year like major seizures.',
        source: '38 CFR 4.124a, DC 8911',
        important: true
      },
      weeklyFrequency: {
        term: 'Weekly Frequency Ratings',
        definition: 'DC 8911 ratings: 10% (at least 1/week), 20% (at least 2/week), 30% (at least 4/week). May be combined with DC 8910 if both major and minor seizures are present.',
        source: '38 CFR 4.124a, DC 8911',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Caluza v. Brown',
        citation: '7 Vet. App. 498 (1995)',
        year: 1995,
        holding: 'Lay testimony about seizure frequency is competent evidence.',
        practicalApplication: 'Witness statements and personal logs are valid for documenting minor seizure frequency.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Track minor seizures weekly — frequency per week drives the rating for DC 8911.',
        priority: 'critical'
      },
      {
        tip: 'Document both major AND minor seizures if both are present — separate ratings may apply.',
        priority: 'high'
      },
      {
        tip: 'Note safety incidents from absence seizures: dropped objects, burns, falls during brief lapses.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report minor seizure frequency per week — this is the key metric for DC 8911',
      'Describe what a minor seizure looks like for you specifically',
      'Report safety incidents resulting from absence or focal seizures',
      'Mention if major and minor seizures both occur — you may qualify for ratings under both DCs'
    ]
  },

  // ============================================
  // MULTIPLE SCLEROSIS - DC 8018
  // ============================================
  '8018': {
    condition: 'Multiple Sclerosis',
    cfrReference: '38 CFR 4.124a, DC 8018',

    keyDefinitions: {
      msRating: {
        term: 'MS Rating Formula',
        definition: 'MS is rated based on the severity of symptom manifestations and functional impairment. Minimum 30% if diagnosed; ratings increase based on symptoms and disability level.',
        source: '38 CFR 4.124a, DC 8018',
        important: true
      },
      presumptive: {
        term: 'MS Presumptive Service Connection',
        definition: 'Multiple sclerosis that becomes manifest to a compensable degree within 7 years of discharge from active duty may be presumptively service-connected.',
        source: '38 CFR 3.309(a)',
        important: true
      },
      relapsing: {
        term: 'Relapsing-Remitting vs. Progressive',
        definition: 'MS course matters for rating. Progressive MS with permanent deficits generally supports higher ratings than relapsing-remitting MS in full remission.',
        source: '38 CFR 4.124a'
      },
      adls: {
        term: 'Activities of Daily Living',
        definition: 'MS often requires aid and attendance as it progresses. Document ADL impairment carefully — this can support Special Monthly Compensation (SMC).',
        source: '38 CFR 3.352'
      }
    },

    caseLaw: [
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'Veterans\' lay testimony about pain and functional limitations is competent evidence.',
        practicalApplication: 'Document your MS symptoms and limitations in your own words — this has legal weight.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get MRI results documenting lesions — objective imaging evidence is essential for MS claims.',
        priority: 'critical'
      },
      {
        tip: 'Document all relapses with dates, symptoms, and recovery completeness.',
        priority: 'high'
      },
      {
        tip: 'Track permanent deficits vs. relapse symptoms — permanent deficits drive the rating.',
        priority: 'high'
      },
      {
        tip: 'Document need for assistive devices: cane, walker, wheelchair, AFO braces.',
        priority: 'high'
      },
      {
        tip: 'Note fatigue specifically — MS fatigue is a distinct, ratable symptom often separate from other residuals.',
        priority: 'high'
      },
      {
        tip: 'If MS requires aid and attendance, document this for potential SMC evaluation.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring MRI reports and neurologist records',
      'Describe your WORST periods (relapses) and what permanent deficits remain',
      'Report ALL symptoms: vision, balance, coordination, bladder, bowel, fatigue, cognitive issues',
      'Describe mobility limitations and need for assistive devices',
      'Report heat sensitivity (Uhthoff\'s phenomenon) — a classic MS symptom'
    ],

    commonMistakes: [
      'Only reporting symptoms during current stable period, not worst relapse periods',
      'Not claiming individual residuals (bladder dysfunction, fatigue) that may be separately ratable',
      'Failing to document progressive functional decline over time',
      'Not requesting SMC evaluation when daily aid is needed'
    ]
  },

  // ============================================
  // PARKINSON'S DISEASE - DC 8004
  // ============================================
  '8004': {
    condition: "Parkinson's Disease",
    cfrReference: '38 CFR 4.124a, DC 8004',

    keyDefinitions: {
      presumptive: {
        term: 'Agent Orange Presumptive',
        definition: "Parkinson's disease is a presumptive service-connected condition for veterans exposed to herbicide agents (Agent Orange, TCDD). No nexus letter required for Vietnam veterans.",
        source: '38 CFR 3.309(e)',
        important: true
      },
      pdRating: {
        term: "Parkinson's Rating Formula",
        definition: "PD is rated based on functional manifestations. Minimum compensable rating is 30% upon diagnosis with parkinsonian signs. Ratings increase to 100% based on severity of motor, cognitive, and autonomic symptoms.",
        source: '38 CFR 4.124a, DC 8004',
        important: true
      },
      smc: {
        term: 'SMC Consideration',
        definition: "Advanced Parkinson's often requires aid and attendance. Document need for daily assistance — this supports Special Monthly Compensation at Level L or higher.",
        source: '38 CFR 3.352',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Nehmer v. VA',
        citation: 'Nehmer litigation (ongoing)',
        year: 1991,
        holding: 'Veterans with Agent Orange exposure who develop presumptive conditions are entitled to retroactive benefits to the date of diagnosis or claim.',
        practicalApplication: "If you developed Parkinson's after a denied claim, you may be entitled to retroactive benefits back to your original claim date.",
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'For Vietnam veterans: document all dates of service in Vietnam for Agent Orange presumptive.',
        priority: 'critical'
      },
      {
        tip: 'Get neurologist records documenting the diagnosis and staging of Parkinson\'s disease.',
        priority: 'critical'
      },
      {
        tip: 'Document tremor severity, gait impairment, freezing episodes, and fall history.',
        priority: 'high'
      },
      {
        tip: 'Track cognitive symptoms — Parkinson\'s dementia is a ratable secondary condition.',
        priority: 'high'
      },
      {
        tip: 'Document autonomic symptoms: orthostatic hypotension, constipation, urinary urgency.',
        priority: 'medium'
      },
      {
        tip: 'Note need for assistive devices: cane, walker, wheelchair — supports higher ratings and SMC.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report the full range of symptoms: motor, non-motor (depression, sleep, cognition), and autonomic',
      'Describe how PD affects your ability to perform ADLs: dressing, eating, bathing',
      'Report falls and fall risk — a key functional impairment',
      'Mention medication on/off fluctuations and how "off" periods affect functioning',
      'Report if daily assistance from another person is needed'
    ],

    ratingNote: "Parkinson's disease is a progressive condition. File for an increase as symptoms worsen — do not wait for the VA to recognize progression."
  },

  // ============================================
  // ALS - DC 8017
  // ============================================
  '8017': {
    condition: 'Amyotrophic Lateral Sclerosis (ALS)',
    cfrReference: '38 CFR 4.124a, DC 8017',

    keyDefinitions: {
      presumptive: {
        term: 'ALS Presumptive Service Connection',
        definition: 'ALS is a presumptive service-connected condition for all veterans who served 90 or more days of continuous active duty. No nexus letter required.',
        source: '38 CFR 3.318',
        important: true
      },
      immediateRating: {
        term: 'Immediate 100% Rating',
        definition: 'ALS is rated at 100% immediately upon service connection due to its progressive, fatal nature. Additional SMC may also apply for required aid and attendance.',
        source: '38 CFR 4.124a, DC 8017',
        important: true
      },
      smc: {
        term: 'Special Monthly Compensation',
        definition: 'Veterans with ALS requiring aid and attendance are entitled to SMC at higher rates as the disease progresses. Document all assistance required.',
        source: '38 CFR 3.350-3.352',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'ALS Presumptive Rule',
        citation: '38 CFR 3.318',
        year: 2008,
        holding: 'All veterans who served at least 90 days of active duty are entitled to presumptive service connection for ALS, regardless of when it develops.',
        practicalApplication: 'File immediately upon diagnosis — service connection is essentially automatic and rating is 100%.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'File for service connection IMMEDIATELY upon diagnosis — rating is 100% and SMC may begin quickly.',
        priority: 'critical'
      },
      {
        tip: 'Document all assistance needed: feeding, dressing, bathing, mobility, ventilator support.',
        priority: 'critical'
      },
      {
        tip: 'File for Aid and Attendance SMC as soon as daily assistance is required.',
        priority: 'critical'
      },
      {
        tip: 'Ensure Dependency and Indemnity Compensation (DIC) paperwork is prepared for surviving family.',
        priority: 'high'
      },
      {
        tip: 'Document all service dates — 90+ days of active duty is all that is required for presumptive.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring neurologist records confirming ALS diagnosis',
      'Report ALL functional limitations — motor, respiratory, speech, swallowing',
      'Document all daily assistance required from caregivers',
      'Ask your VSO about Specially Adapted Housing and automobile grants'
    ],

    ratingNote: 'ALS is rated at 100% immediately. Veterans should also apply for: SMC for Aid and Attendance, Specially Adapted Housing (SAH), Automobile Adaptive Equipment, Caregiver Support Program (PCAFC), and CHAMPVA for dependents.'
  },

  // ============================================
  // CHRONIC FATIGUE SYNDROME - DC 6354
  // ============================================
  '6354': {
    condition: 'Chronic Fatigue Syndrome (Systemic Exertion Intolerance Disease)',
    cfrReference: '38 CFR 4.88b, DC 6354',

    keyDefinitions: {
      pem: {
        term: 'Post-Exertional Malaise (PEM)',
        definition: 'Worsening of symptoms after physical or mental exertion — the hallmark of CFS. PEM distinguishes CFS from ordinary fatigue. Document how activity worsens symptoms for 24–72 hours.',
        source: 'IOM 2015 / 38 CFR 4.88b',
        important: true
      },
      cfsCriteria: {
        term: 'CFS Rating Scale',
        definition: 'Rated 10–100% based on debilitation level. 100%: complete inability to work. 60%: requires 4+ rest periods daily. 40%: requires 2-3 rest periods. 20%: 1 rest period. 10%: signs/symptoms present but no significant debilitation.',
        source: '38 CFR 4.88b, DC 6354',
        important: true
      },
      gulfWar: {
        term: 'Gulf War Illness / Presumptive',
        definition: 'CFS is a presumptive service-connected condition for Gulf War veterans with qualifying service in Southwest Asia. No nexus letter required.',
        source: '38 CFR 3.317',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'Veterans\' lay testimony about pain and functional limitations constitutes competent evidence.',
        practicalApplication: 'Your documented description of fatigue, PEM, and functional limitations is legally competent evidence.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document PEM specifically: what activities trigger it, how long the crash lasts, and what symptoms worsen.',
        priority: 'critical'
      },
      {
        tip: 'Track required rest periods per day — this directly maps to the VA rating scale.',
        priority: 'critical'
      },
      {
        tip: 'For Gulf War veterans: document dates and locations of service in qualifying areas.',
        priority: 'critical'
      },
      {
        tip: 'Keep activity logs showing the difference between active days and crash days.',
        priority: 'high'
      },
      {
        tip: 'Document cognitive symptoms ("brain fog"): difficulty concentrating, word retrieval problems.',
        priority: 'high'
      },
      {
        tip: 'Track sleep dysfunction — unrefreshing sleep despite adequate hours is a core CFS symptom.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Describe PEM in detail — this is what separates CFS from ordinary fatigue',
      'Report how many hours of rest you need per day',
      'Describe the difference between your best days and worst/crash days',
      'Report all associated symptoms: cognitive issues, sleep, pain, orthostatic intolerance',
      'Mention inability to maintain full-time employment or even part-time work'
    ],

    commonMistakes: [
      'Describing CFS as "just being tired" — PEM is the defining feature and must be documented',
      'Not tracking rest requirements per day — this is the direct rating criterion',
      'Gulf War veterans not claiming presumptive service connection',
      'Not documenting cognitive and orthostatic symptoms that contribute to impairment'
    ]
  },

  // ============================================
  // INSOMNIA - No standalone DC in 38 CFR Part 4
  // Rated analogously per § 4.20 — most commonly under a mental health DC
  // or as a secondary condition to a service-connected diagnosis.
  // The app uses a placeholder key for this card.
  // ============================================
  'insomnia': {
    condition: 'Insomnia (Sleep Disorder)',
    cfrReference: '38 CFR 4.20 (Analogous Rating) / 4.130',

    keyDefinitions: {
      noStandaloneDC: {
        term: 'No Standalone Diagnostic Code',
        definition: 'Insomnia does not have its own diagnostic code in 38 CFR Part 4. It is rated either: (1) as a symptom within a service-connected mental health condition (PTSD, depression, anxiety), (2) under DC 6847 if obstructive sleep apnea is the cause, or (3) analogously under § 4.20 using the most closely related code.',
        source: '38 CFR 4.20 / 4.130',
        important: true
      },
      secondary: {
        term: 'Secondary Service Connection',
        definition: 'Insomnia caused by a service-connected condition (PTSD, chronic pain, TBI) is separately service-connectable as a secondary condition under 38 CFR 3.310. File it explicitly as secondary — do not assume VA will rate it automatically.',
        source: '38 CFR 3.310',
        important: true
      },
      functionalImpact: {
        term: 'Daytime Functional Impairment',
        definition: 'The rating is driven by daytime impairment from sleep loss: cognitive dysfunction, mood disturbance, fatigue, inability to work. Document the consequences of poor sleep, not just the sleep itself.',
        source: '38 CFR 4.130'
      }
    },

    caseLaw: [
      {
        case: 'Boggs v. Peake',
        citation: '520 F.3d 1330 (Fed. Cir. 2008)',
        year: 2008,
        holding: 'Secondary conditions caused by service-connected disabilities are themselves service-connected under 38 CFR 3.310.',
        practicalApplication: 'Explicitly file insomnia as secondary to your PTSD, chronic pain, or TBI — VA will not make that connection automatically.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Identify and document the service-connected cause of insomnia — secondary service connection requires an explicit nexus.',
        priority: 'critical'
      },
      {
        tip: 'Keep a sleep diary: bedtime, sleep onset time, number of awakenings, total sleep, and daytime impact.',
        priority: 'high'
      },
      {
        tip: 'Document daytime functional consequences: concentration, mood, reaction time, work performance, safety.',
        priority: 'high'
      },
      {
        tip: 'Get a sleep study if obstructive sleep apnea may be contributing — OSA has its own DC (6847).',
        priority: 'medium'
      },
      {
        tip: 'Document all treatment attempts: CBT-I, sleep hygiene, medications, and their effectiveness.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Explain the direct link between your service-connected condition (PTSD, pain, TBI) and your insomnia',
      'Describe daytime consequences — fatigue, concentration, mood — not just nighttime symptoms',
      'Report all sleep medications tried and whether they work',
      'If nightmares are disrupting sleep, describe them — this strengthens the PTSD nexus',
      'Request a sleep study referral if you suspect sleep apnea in addition to insomnia'
    ],

    ratingNote: 'Insomnia has no standalone VA diagnostic code. The strongest approach is filing it as secondary to a service-connected condition (PTSD, chronic pain, TBI). If rated independently under § 4.20, the rating officer will assign the most analogous mental health code. Ensure the claim explicitly identifies the service-connected cause.'
  },

  // ============================================
  // FIBROMYALGIA - DC 5025
  // ============================================
  '5025': {
    condition: 'Fibromyalgia',
    cfrReference: '38 CFR 4.71a, DC 5025',

    keyDefinitions: {
      fiboRating: {
        term: 'Fibromyalgia Rating Scale',
        definition: 'Rated: 10% (pain controlled by continuous medication), 20% (widespread musculoskeletal pain and tenderness, fatigue, sleep disturbance, stiffness — may be episodic), 40% (constant or nearly constant incapacitating symptoms).',
        source: '38 CFR 4.71a, DC 5025',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Presumptive',
        definition: 'Fibromyalgia is a presumptive service-connected condition for Gulf War veterans (Southwest Asia service) with qualifying undiagnosed illness or medically unexplained chronic multisymptom illness.',
        source: '38 CFR 3.317',
        important: true
      },
      incapacitating: {
        term: 'Incapacitating Symptoms',
        definition: 'For the 40% rating, symptoms must be constant or nearly constant AND incapacitating. Document days when symptoms prevent any productive activity.',
        source: '38 CFR 4.71a, DC 5025',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'Lay testimony about pain and functional limitations is competent evidence.',
        practicalApplication: 'Your detailed description of fibromyalgia symptoms and limitations is legally valid evidence.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Track symptom patterns: good days vs. flare days, triggers, and functional impact on each type of day.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL fibromyalgia symptoms: pain, fatigue, sleep, cognitive (fibro fog), headaches.',
        priority: 'high'
      },
      {
        tip: 'Note days unable to work or perform activities — frequency of incapacitating days drives the 40% rating.',
        priority: 'critical'
      },
      {
        tip: 'Gulf War veterans: document service locations and dates for presumptive consideration.',
        priority: 'critical'
      },
      {
        tip: 'Track medication history: failed medications demonstrate treatment-resistant, more severe disease.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Describe your WORST fibromyalgia days — how often and what you cannot do',
      'Report ALL symptoms, not just pain: fatigue, brain fog, sleep, sensitivity to touch',
      'Quantify incapacitating days: "I have approximately 10 days per month where I cannot get out of bed"',
      'Report impact on employment: inability to maintain full-time work, accommodations needed',
      'Mention if you have had to change careers or reduce work hours due to fibromyalgia'
    ],

    commonMistakes: [
      'Only reporting pain and ignoring fatigue, cognitive symptoms, and sleep disruption',
      'Not documenting the frequency of incapacitating days — this is the 40% threshold',
      'Gulf War veterans not claiming presumptive service connection',
      'Minimizing symptoms due to the stigma that fibromyalgia is "not a real disease"'
    ]
  },

  // ============================================
  // MYASTHENIA GRAVIS - DC 8025
  // ============================================
  '8025': {
    condition: 'Myasthenia Gravis',
    cfrReference: '38 CFR 4.124a, DC 8025',

    keyDefinitions: {
      mgRating: {
        term: 'MG Rating Scale',
        definition: 'Rated: 30% (symptoms controlled with medication), 60% (intermittent weakness, fatigue), 100% (pronounced weakness). The fluctuating nature of MG makes documentation of worst periods critical.',
        source: '38 CFR 4.124a, DC 8025',
        important: true
      },
      myasthenicCrisis: {
        term: 'Myasthenic Crisis',
        definition: 'Life-threatening worsening of MG with respiratory muscle failure requiring mechanical ventilation. Hospitalization for crisis supports 100% rating.',
        source: '38 CFR 4.124a',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document myasthenic crises requiring hospitalization — these support the highest ratings.',
        priority: 'critical'
      },
      {
        tip: 'Track medication regimen: cholinesterase inhibitors, steroids, immunosuppressants, IVIG — complexity reflects severity.',
        priority: 'high'
      },
      {
        tip: 'Document bulbar symptoms: difficulty swallowing, speaking, breathing — these indicate severe disease.',
        priority: 'critical'
      },
      {
        tip: 'Note occupational impact: inability to perform tasks requiring sustained muscle use.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report both good periods AND myasthenic crises — MG is episodic and worst episodes drive the rating',
      'Describe the specific muscle groups affected and how weakness limits your activities',
      'Report respiratory symptoms and any ICU admissions',
      'Mention all medications and their side effects'
    ]
  },

  // ============================================
  // SYRINGOMYELIA - DC 8024
  // ============================================
  '8024': {
    condition: 'Syringomyelia',
    cfrReference: '38 CFR 4.124a, DC 8024',

    keyDefinitions: {
      syrinx: {
        term: 'Syrinx',
        definition: 'A fluid-filled cavity within the spinal cord. Size and location of the syrinx on MRI correlates with symptom severity. Document imaging findings alongside functional symptoms.',
        source: '38 CFR 4.124a, DC 8024',
        important: true
      },
      progressiveNature: {
        term: 'Progressive Condition',
        definition: 'Syringomyelia is often progressive. File for rating increases as symptoms worsen — do not accept a static rating if the condition is deteriorating.',
        source: '38 CFR 4.124a'
      }
    },

    documentationTips: [
      {
        tip: 'Obtain MRI documentation of the syrinx — imaging is essential for establishing the diagnosis.',
        priority: 'critical'
      },
      {
        tip: 'Document all symptoms: pain (cape-like distribution), weakness, temperature insensitivity, bladder dysfunction.',
        priority: 'high'
      },
      {
        tip: 'Track progression — worsening symptoms over time support rating increases.',
        priority: 'high'
      },
      {
        tip: 'Document any surgical intervention (shunt placement) and its outcomes.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Bring MRI reports showing the syrinx location and size',
      'Describe the full symptom picture: pain pattern, sensory loss, weakness, autonomic symptoms',
      'Report if symptoms have changed or worsened over time',
      'Mention any functional limitations from weakness or sensory loss'
    ]
  },

  // ============================================
  // MYELITIS - DC 8010
  // ============================================
  '8010': {
    condition: 'Myelitis (Spinal Cord Inflammation)',
    cfrReference: '38 CFR 4.124a, DC 8010',

    keyDefinitions: {
      myelitisRating: {
        term: 'Myelitis Rating',
        definition: 'Rated based on functional manifestations: paralysis, sensory loss, bladder/bowel dysfunction. May be rated 30–100% depending on severity of motor and autonomic deficits.',
        source: '38 CFR 4.124a, DC 8010',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Obtain MRI documentation of spinal cord lesions or inflammation.',
        priority: 'critical'
      },
      {
        tip: 'Document all deficits: motor weakness, sensory loss, bladder/bowel dysfunction.',
        priority: 'high'
      },
      {
        tip: 'Note level of spinal cord involvement — higher lesions cause more extensive deficits.',
        priority: 'high'
      },
      {
        tip: 'Document need for assistive devices or personal care assistance.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring MRI and neurological examination records',
      'Report ALL deficits: movement, sensation, bladder, bowel, sexual function',
      'Describe how myelitis limits your mobility and daily activities',
      'Report any progression or new deficits since initial injury'
    ]
  },

  // ============================================
  // NARCOLEPSY - DC 8108
  // ============================================
  '8108': {
    condition: 'Narcolepsy',
    cfrReference: '38 CFR 4.124a, DC 8108',

    keyDefinitions: {
      cataplexy: {
        term: 'Cataplexy',
        definition: 'Sudden loss of muscle tone triggered by strong emotion — present in type 1 narcolepsy. Episodes ranging from weakness to complete collapse. Cataplexy significantly increases safety risk and functional impairment.',
        source: 'DSM-5 / 38 CFR 4.124a',
        important: true
      },
      narcolepsyRating: {
        term: 'Narcolepsy Rating Scale',
        definition: 'Rated: 20% (attacks occurring less frequently than daily), 40% (daily attacks), 60% (attacks occurring more than once daily), 100% (cataplexy with attacks multiple times daily).',
        source: '38 CFR 4.124a, DC 8108',
        important: true
      },
      drivingRestriction: {
        term: 'Driving and Safety',
        definition: 'Narcolepsy typically prevents driving and operating heavy machinery. Document driving restrictions and their occupational impact.',
        source: '38 CFR 4.124a'
      }
    },

    documentationTips: [
      {
        tip: 'Document sleep attack frequency per day — this directly drives the rating level.',
        priority: 'critical'
      },
      {
        tip: 'Obtain polysomnography and MSLT (Multiple Sleep Latency Test) results — objective diagnosis is essential.',
        priority: 'critical'
      },
      {
        tip: 'Document cataplexy episodes if present — frequency and triggers are key evidence.',
        priority: 'high'
      },
      {
        tip: 'Note driving restrictions and occupational impact of not being able to drive.',
        priority: 'high'
      },
      {
        tip: 'Track impact on employment: inability to maintain alertness for job duties.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report sleep attack frequency: per day, per week, and circumstances (driving, working)',
      'Describe cataplexy episodes if present — what triggers them and what happens',
      'Bring sleep study results (polysomnography and MSLT)',
      'Report inability to drive and its impact on your employment and independence'
    ]
  },

  // ============================================
  // LOSS OF SMELL - DC 6275 / LOSS OF TASTE - DC 6276
  // ============================================
  '6275': {
    condition: 'Loss of Smell (Anosmia)',
    cfrReference: '38 CFR 4.87a, DC 6275',

    keyDefinitions: {
      anosmia: {
        term: 'Complete vs. Partial Loss',
        definition: 'Complete loss of smell (anosmia) is rated at 10%. Partial loss (hyposmia) may be rated proportionally. VA uses smell identification tests for objective documentation.',
        source: '38 CFR 4.87a, DC 6275',
        important: true
      },
      safetyRisk: {
        term: 'Safety Implications',
        definition: 'Loss of smell creates safety risks: inability to detect gas leaks, smoke, spoiled food. Document safety concerns — these support the disability rating.',
        source: '38 CFR 4.87a'
      }
    },

    documentationTips: [
      {
        tip: 'Get formal smell testing (University of Pennsylvania Smell Identification Test or similar) for objective documentation.',
        priority: 'high'
      },
      {
        tip: 'Document the cause: TBI, sinusitis, COVID-19 — nexus to service is essential.',
        priority: 'critical'
      },
      {
        tip: 'Note safety incidents: near-miss gas leaks, smoke, or food spoilage due to inability to smell.',
        priority: 'high'
      }
    ],

    examTips: [
      'Describe the onset of smell loss and what you believe caused it',
      'Report safety concerns from inability to smell gas, smoke, or spoiled food',
      'Note if partial or complete loss, and whether any odors remain detectable',
      'Mention impact on taste and appetite if applicable'
    ],

    ratingNote: 'Loss of smell is rated at a flat 10% for complete bilateral loss. Loss of taste (DC 6276) is also rated at 10% and may be rated separately if both are present.'
  },

  '6276': {
    condition: 'Loss of Taste (Ageusia)',
    cfrReference: '38 CFR 4.87a, DC 6276',

    keyDefinitions: {
      ageusia: {
        term: 'Ageusia vs. Dysgeusia',
        definition: 'Ageusia is complete loss of taste. Dysgeusia is distorted taste. Both are ratable. Document whether loss is complete or partial and whether taste is distorted.',
        source: '38 CFR 4.87a, DC 6276',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document cause of taste loss: TBI, cranial nerve damage, medication, COVID-19 — establish service nexus.',
        priority: 'critical'
      },
      {
        tip: 'Note impact on nutrition and weight — inability to taste may reduce appetite and affect health.',
        priority: 'medium'
      },
      {
        tip: 'Both DC 6275 (smell) and DC 6276 (taste) may be rated separately if both are affected.',
        priority: 'high'
      }
    ],

    examTips: [
      'Describe whether loss is complete or partial',
      'Report if taste is distorted or absent',
      'Note impact on nutrition, appetite, and quality of life',
      'Document the nexus to your service-connected condition'
    ],

    ratingNote: 'Loss of taste (DC 6276) is rated at 10% for complete bilateral loss. May be rated separately from and in addition to loss of smell (DC 6275).'
  },

  // ============================================
  // LUMBOSACRAL STRAIN / LOW BACK - DC 5237
  // ============================================
  '5237': {
    condition: 'Lumbosacral Strain (Low Back Pain)',
    cfrReference: '38 CFR 4.71a, DC 5237',

    keyDefinitions: {
      forwardFlexion: {
        term: 'Forward Flexion — The Key Metric',
        definition: 'Normal thoracolumbar forward flexion is 90 degrees. The rating thresholds are: 30% for flexion ≤60°, 40% for ≤30°, 50% for ≤30° with neurological involvement, 100% for unfavorable ankylosis. Flexion is measured at its most limited.',
        source: '38 CFR 4.71a, DC 5237',
        important: true
      },
      painOnMovement: {
        term: 'Painful Motion / Functional Loss',
        definition: 'If pain limits motion short of actual measured ROM, VA must note pain on motion and consider that as the functional endpoint of range of motion.',
        source: '38 CFR 4.40, 4.45 / DeLuca v. Brown',
        important: true
      },
      flareUps: {
        term: 'Flare-Up Limitation',
        definition: 'VA must consider ROM limitation during flare-ups, not just at examination. Document your ROM during a bad day/flare — the examiner must account for this.',
        source: 'Mitchell v. Shinseki (2011) / Sharp v. Shulkin (2017)',
        important: true
      },
      incapEpisodes: {
        term: 'Incapacitating Episodes',
        definition: 'Alternative rating pathway for IVDS: periods of bed rest prescribed by a physician. 10% for 1–2 weeks/year, 20% for 2–4 weeks, 40% for 4–6 weeks, 60% for 6+ weeks.',
        source: '38 CFR 4.71a, DC 5243'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'VA must consider functional loss due to pain on movement, not just final range of motion numbers.',
        practicalApplication: 'Tell the examiner when you feel pain during movement — pain that stops motion earlier than the anatomic limit IS functional loss.',
        important: true
      },
      {
        case: 'Mitchell v. Shinseki',
        citation: '25 Vet. App. 32 (2011)',
        year: 2011,
        holding: 'VA must consider functional loss during flare-ups, not just during examination.',
        practicalApplication: 'Bring documentation of your flare-up limitations. The examiner must consider your worst days.',
        important: true
      },
      {
        case: 'Sharp v. Shulkin',
        citation: '29 Vet. App. 26 (2017)',
        year: 2017,
        holding: 'Examiners cannot refuse to estimate flare-up limitations by saying they "cannot speculate." They must estimate based on available evidence.',
        practicalApplication: 'If examiner says they cannot determine flare-up impact — challenge that finding. It is legally required.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Track your forward flexion in degrees on bad days — document "During a flare, I can only bend X degrees."',
        priority: 'critical'
      },
      {
        tip: 'Request that your treating provider document range of motion during a flare, not just during a good day.',
        priority: 'critical'
      },
      {
        tip: 'Claim radiculopathy SEPARATELY if you have leg pain, numbness, or weakness — it is rated additionally.',
        priority: 'critical'
      },
      {
        tip: 'Document incapacitating episodes with physician-prescribed bed rest — these support an alternative higher rating.',
        priority: 'high'
      },
      {
        tip: 'Keep records of all treatments: physical therapy, injections, surgery, chiropractic — shows ongoing disability.',
        priority: 'medium'
      },
      {
        tip: 'Note impact on work: inability to lift, sit/stand for long periods, sedentary vs. active jobs.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report pain on movement during the examination — tell the examiner exactly when you feel pain',
      'Describe your flare-ups: how often, how limited is your ROM, how long do they last',
      'Report all neurological symptoms in your legs: numbness, tingling, weakness',
      'Mention all activities you cannot do: lifting, bending, prolonged sitting or standing',
      'Do not perform movements that cause severe pain just to show the examiner — your limits are your limits'
    ],

    commonMistakes: [
      'Only documenting ROM on a good day — not capturing flare-up limitations',
      'Not claiming radiculopathy as a separate condition',
      'Failing to mention pain on movement during the C&P exam',
      'Not documenting physician-prescribed bed rest episodes for the incapacitating episodes alternative rating'
    ]
  },

  // ============================================
  // INTERVERTEBRAL DISC SYNDROME - DC 5243
  // ============================================
  '5243': {
    condition: 'Intervertebral Disc Syndrome',
    cfrReference: '38 CFR 4.71a, DC 5243',

    keyDefinitions: {
      ivdsDualRating: {
        term: 'Dual Rating Pathway',
        definition: 'IVDS has two rating options: (1) General Rating Formula for spine based on ROM/ankylosis, OR (2) Incapacitating Episodes pathway. VA must assign whichever rating is higher.',
        source: '38 CFR 4.71a, DC 5243',
        important: true
      },
      incapEpisodes: {
        term: 'Incapacitating Episodes (Bed Rest)',
        definition: 'Periods requiring bed rest AND treatment by a physician. Must be prescribed — self-imposed bed rest does not count. Rating: 10% (1-2 wks/yr), 20% (2-4 wks), 40% (4-6 wks), 60% (6+ wks).',
        source: '38 CFR 4.71a, DC 5243',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered.',
        practicalApplication: 'Pain on movement is functional loss — report it during the C&P exam.',
        important: true
      },
      {
        case: 'Sharp v. Shulkin',
        citation: '29 Vet. App. 26 (2017)',
        year: 2017,
        holding: 'Examiner must estimate flare-up limitations.',
        practicalApplication: 'Document your worst-day ROM separately from your best-day ROM.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get physician notes specifically ordering bed rest during flare-ups — this activates the incapacitating episodes pathway.',
        priority: 'critical'
      },
      {
        tip: 'Count total weeks of prescribed bed rest per year — this directly determines the incapacitating episodes rating.',
        priority: 'critical'
      },
      {
        tip: 'Compare both rating methods (ROM vs. incapacitating episodes) and ensure VA uses the higher result.',
        priority: 'high'
      },
      {
        tip: 'Separately claim any associated radiculopathy — it is rated additionally.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report flare frequency and how many days/weeks per year you are incapacitated',
      'Ask your treating doctor to specifically document "prescribed bed rest" in your medical records',
      'Report ROM during a flare, not just your best-day capability',
      'Mention neurological symptoms separately — radiculopathy adds to the rating'
    ]
  },

  // ============================================
  // KNEE CONDITIONS - DC 5257 / 5258 / 5260 / 5261
  // ============================================
  '5257': {
    condition: 'Knee Instability / Knee Conditions',
    cfrReference: '38 CFR 4.71a, DC 5256-5262',

    keyDefinitions: {
      kneeInstability: {
        term: 'Knee Instability (DC 5257)',
        definition: 'Recurrent subluxation or lateral instability of the knee. Rated: 10% mild, 20% moderate, 30% severe — based on degree of instability. Can be rated separately from limitation of flexion/extension.',
        source: '38 CFR 4.71a, DC 5257',
        important: true
      },
      flexionExtension: {
        term: 'Flexion and Extension Ratings',
        definition: 'Normal knee flexion is 140°. Ratings: 10% (≤90°), 20% (≤60°), 30% (≤30°). Extension rated separately: 10% (extension limited at 5°), 20% (10°), 30% (15°), etc. Both may be rated.',
        source: '38 CFR 4.71a, DC 5260/5261',
        important: true
      },
      meniscus: {
        term: 'Meniscus and Cartilage Damage',
        definition: 'Symptomatic post-meniscectomy or meniscal injury may be rated under DC 5258 (dislocated cartilage) or 5259 (removed cartilage). These are separate from flexion/extension limitations.',
        source: '38 CFR 4.71a, DC 5258-5259'
      },
      bilateral: {
        term: 'Bilateral Knee Factor',
        definition: 'When both knees are service-connected, the bilateral factor (10%) applies to the combined rating before combining with other disabilities.',
        source: '38 CFR 3.383'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain on movement must be considered in rating.',
        practicalApplication: 'Report pain during knee flexion and extension — this is functional loss even if you can physically complete the movement.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Claim instability AND ROM limitation separately — they can be rated under different DCs simultaneously.',
        priority: 'critical'
      },
      {
        tip: 'Document locking, buckling, and giving-way episodes specifically — these support instability ratings.',
        priority: 'high'
      },
      {
        tip: 'Get MRI results documenting meniscal tears, cartilage damage, ligament injuries.',
        priority: 'high'
      },
      {
        tip: 'If both knees are affected, claim bilateral factor explicitly.',
        priority: 'high'
      },
      {
        tip: 'Document flare-up ROM limitations — worst days matter, not just exam day.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report instability, locking, and giving-way separately from pain and ROM',
      'Describe how frequently your knee buckles or gives out',
      'Report pain on movement during the exam — tell the examiner when you feel pain',
      'Mention if both knees are affected — bilateral factor applies',
      'Report impact on activities: stairs, kneeling, prolonged standing/walking'
    ]
  },

  // ============================================
  // SHOULDER - DC 5201-5203
  // ============================================
  '5201': {
    condition: 'Shoulder Conditions',
    cfrReference: '38 CFR 4.71a, DC 5200-5203',

    keyDefinitions: {
      abduction: {
        term: 'Arm Abduction — Key Metric',
        definition: 'Normal abduction is 180°. DC 5201 ratings: 20° (highest), 45°, 90° (at shoulder level). The lower the abduction, the higher the rating. Major vs. minor extremity matters — major extremity (dominant arm) rates higher.',
        source: '38 CFR 4.71a, DC 5201',
        important: true
      },
      majorMinor: {
        term: 'Major vs. Minor Extremity',
        definition: 'The dominant arm is the "major" extremity and receives higher ratings than the non-dominant "minor" arm. Confirm which arm is dominant in your records.',
        source: '38 CFR 4.71a',
        important: true
      },
      rotatorCuff: {
        term: 'Rotator Cuff Tears',
        definition: 'Full-thickness rotator cuff tears typically limit abduction and internal/external rotation. Get MRI documentation — imaging findings support the clinical picture.',
        source: '38 CFR 4.71a'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered.',
        practicalApplication: 'If shoulder pain stops your arm before the measured angle, that pain limit IS the functional endpoint.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Measure and document abduction on a BAD day, not just when feeling relatively good.',
        priority: 'critical'
      },
      {
        tip: 'Document which arm is dominant — major extremity gets higher ratings at every level.',
        priority: 'high'
      },
      {
        tip: 'Get MRI of the shoulder — rotator cuff tears, labral tears, and AC joint pathology are objectively documentable.',
        priority: 'high'
      },
      {
        tip: 'Document functional limitations: inability to reach overhead, behind back, carry objects.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report pain on movement — tell the examiner when abduction becomes painful',
      'Confirm your dominant arm is noted in the examination',
      'Describe activities you cannot do: reaching overhead, carrying, throwing',
      'Report flare-up limitations if your shoulder is worse on bad days',
      'Mention any previous surgeries and their outcomes'
    ]
  },

  // ============================================
  // HIP CONDITIONS - DC 5252-5255
  // ============================================
  '5252': {
    condition: 'Hip Conditions',
    cfrReference: '38 CFR 4.71a, DC 5250-5256',

    keyDefinitions: {
      flexion: {
        term: 'Hip Flexion — Key Metric',
        definition: 'Normal hip flexion is 125°. DC 5252 ratings based on flexion: 10% (≤90°, or painful motion), 20% (≤60°), 30% (≤30°). Extension, abduction, and rotation also ratable.',
        source: '38 CFR 4.71a, DC 5252',
        important: true
      },
      hipReplacement: {
        term: 'Hip Replacement Rating',
        definition: 'Following total hip replacement, VA rates at minimum 30% for one year post-surgery, then based on residuals. Document any ongoing limitations after the one-year period.',
        source: '38 CFR 4.71a, DC 5054'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered in rating.',
        practicalApplication: 'Report pain on hip movement during the C&P exam.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document hip ROM during flare-ups and after prolonged activity, not just on examination day.',
        priority: 'critical'
      },
      {
        tip: 'Note impact on gait: limping, use of cane, inability to walk distances.',
        priority: 'high'
      },
      {
        tip: 'Document activities limited: stairs, prolonged walking, rising from seated position.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report pain during hip ROM movements — when does it hurt?',
      'Describe limitations on walking distance and terrain',
      'Report if you need a cane or assistive device',
      'Mention flare-up frequency and severity'
    ]
  },

  // ============================================
  // ANKLE / ACHILLES - DC 5270-5274
  // ============================================
  '5270': {
    condition: 'Ankle Conditions',
    cfrReference: '38 CFR 4.71a, DC 5270-5274',

    keyDefinitions: {
      dorsalFlexion: {
        term: 'Dorsiflexion — Key Metric',
        definition: 'Normal dorsiflexion is 20°. DC 5271 ratings: 10% (motion limited to 20°), 20% (motion limited to 10°). Plantar flexion also rated under DC 5271. Ankylosis rated under DC 5270.',
        source: '38 CFR 4.71a, DC 5270-5271',
        important: true
      },
      achillesRupture: {
        term: 'Achilles Tendon Rupture',
        definition: 'Rated under DC 5254 (chronic residuals). Document plantarflexion strength loss and functional limitations from Achilles injury or repair.',
        source: '38 CFR 4.71a, DC 5254'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered.',
        practicalApplication: 'Pain limiting ankle ROM is ratable functional loss.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document dorsiflexion and plantar flexion ROM — both are separately ratable.',
        priority: 'high'
      },
      {
        tip: 'Note impact on walking, stairs, running, and standing on uneven surfaces.',
        priority: 'high'
      },
      {
        tip: 'Document any instability or giving-way episodes in the ankle.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report pain on ankle movement during the exam',
      'Describe functional limitations: uneven surfaces, stairs, prolonged walking',
      'Report if ankle gives way or is unstable',
      'Mention flare-up severity and frequency'
    ]
  },

  // ============================================
  // PLANTAR FASCIITIS - DC 5276
  // ============================================
  '5276': {
    condition: 'Plantar Fasciitis (Weak Foot)',
    cfrReference: '38 CFR 4.71a, DC 5276',

    keyDefinitions: {
      weakFoot: {
        term: 'Weak Foot Rating',
        definition: 'DC 5276 rates plantar fasciitis/weak foot: 10% (unilateral), 20% (bilateral). Bilateral factor applies if both feet are affected.',
        source: '38 CFR 4.71a, DC 5276',
        important: true
      },
      bilateralFactor: {
        term: 'Bilateral Factor',
        definition: 'Bilateral plantar fasciitis is rated at 20% — not simply 10% + 10%. Confirm bilateral involvement is documented.',
        source: '38 CFR 3.383 / 4.71a'
      }
    },

    documentationTips: [
      {
        tip: 'Document bilateral involvement if both feet are affected — bilateral rating is higher.',
        priority: 'critical'
      },
      {
        tip: 'Get imaging (X-ray for heel spurs, ultrasound or MRI for fascial thickening) to support the diagnosis.',
        priority: 'high'
      },
      {
        tip: 'Track impact on standing and walking: job requirements, activity limitations.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report if both feet are affected — bilateral involvement changes the rating',
      'Describe morning pain and pain after rest periods',
      'Report impact on work, especially jobs requiring prolonged standing or walking',
      'Mention all treatments: orthotics, injections, physical therapy, surgery'
    ]
  },

  // ============================================
  // DEGENERATIVE ARTHRITIS - DC 5003
  // ============================================
  '5003': {
    condition: 'Degenerative Arthritis (Osteoarthritis)',
    cfrReference: '38 CFR 4.71a, DC 5003',

    keyDefinitions: {
      dc5003: {
        term: 'DC 5003 Rating Formula',
        definition: 'Degenerative arthritis is rated: 10% for X-ray evidence in 2 or more major joints, or 2 or more minor joints with occasional incapacitating exacerbations. 20% for X-ray evidence with occasional incapacitating exacerbations. However, if ROM is limited, rate under the applicable joint DC instead.',
        source: '38 CFR 4.71a, DC 5003',
        important: true
      },
      higherRating: {
        term: 'Rating Under Joint-Specific DC',
        definition: 'When degenerative arthritis causes limited ROM, VA must rate under the specific joint DC (knee, hip, shoulder, etc.) if that gives a HIGHER rating than DC 5003.',
        source: '38 CFR 4.71a, DC 5003 Note',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered — not just ROM measurements.',
        practicalApplication: 'Pain on movement is ratable functional loss even when actual ROM is within normal limits.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get X-rays documenting arthritic changes — objective imaging is required for DC 5003.',
        priority: 'critical'
      },
      {
        tip: 'Document incapacitating exacerbations: dates, duration, and functional impact.',
        priority: 'high'
      },
      {
        tip: 'Confirm VA rates under the higher of DC 5003 vs. the applicable joint ROM DC.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring X-ray reports showing arthritic changes in affected joints',
      'Report incapacitating flares: when they occur, how long they last, what you cannot do',
      'Report pain on movement during the exam',
      'Describe impact on all affected joints comprehensively'
    ]
  },

  // ============================================
  // GOUT - DC 5017
  // ============================================
  '5017': {
    condition: 'Gout',
    cfrReference: '38 CFR 4.71a, DC 5017',

    keyDefinitions: {
      goutRating: {
        term: 'Gout Rating Basis',
        definition: 'Gout is rated as degenerative arthritis (DC 5003) when in remission. During acute attacks, rate as active arthritis (DC 5002) for the duration of the episode.',
        source: '38 CFR 4.71a, DC 5017',
        important: true
      },
      chronicTophi: {
        term: 'Tophaceous Gout',
        definition: 'Chronic tophaceous gout with joint deposits represents advanced, poorly controlled gout. Document uric acid levels, tophi locations, and joint damage on imaging.',
        source: '38 CFR 4.71a'
      }
    },

    documentationTips: [
      {
        tip: 'Track acute gout attacks: frequency, affected joints, duration, severity, and treatment required.',
        priority: 'critical'
      },
      {
        tip: 'Document uric acid levels — chronically elevated levels reflect ongoing disease burden.',
        priority: 'high'
      },
      {
        tip: 'Get joint X-rays showing erosions or tophi deposits for objective evidence.',
        priority: 'high'
      },
      {
        tip: 'Note medications and whether urate-lowering therapy is controlling the disease.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report frequency and severity of acute gout attacks over the past year',
      'Describe which joints are affected and functional limitations during attacks',
      'Report any joint damage or tophi that have developed',
      'Mention dietary restrictions and lifestyle impact from managing gout'
    ]
  },

  // ============================================
  // OSTEOMYELITIS - DC 5000
  // ============================================
  '5000': {
    condition: 'Osteomyelitis',
    cfrReference: '38 CFR 4.71a, DC 5000',

    keyDefinitions: {
      active: {
        term: 'Active vs. Inactive Osteomyelitis',
        definition: 'Active osteomyelitis (with drainage, sequestrum, or ongoing infection) is rated higher than inactive. Document whether the condition is active or in remission.',
        source: '38 CFR 4.71a, DC 5000',
        important: true
      },
      drainage: {
        term: 'Chronic Draining Sinus',
        definition: 'A chronically draining sinus tract from osteomyelitis is rated at 20% minimum as long as drainage persists. Document drainage presence, frequency, and treatment.',
        source: '38 CFR 4.71a, DC 5000',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document whether osteomyelitis is active or inactive at each evaluation.',
        priority: 'critical'
      },
      {
        tip: 'Photograph and document any draining sinus tracts — ongoing drainage = minimum 20% rating.',
        priority: 'critical'
      },
      {
        tip: 'Get bone imaging (X-ray, MRI, bone scan) documenting extent of bony involvement.',
        priority: 'high'
      },
      {
        tip: 'Track antibiotic treatment history — chronic infection requiring repeated courses signals severity.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report if there is currently any drainage from the affected area',
      'Describe frequency of acute infections and hospitalizations',
      'Report all surgical procedures: debridement, bone grafts, hardware placement/removal',
      'Note functional limitations from the affected bone/joint'
    ]
  },

  // ============================================
  // BURSITIS - DC 5019
  // ============================================
  '5019': {
    condition: 'Bursitis',
    cfrReference: '38 CFR 4.71a, DC 5019',

    keyDefinitions: {
      ratedAsArthritis: {
        term: 'Rated as Degenerative Arthritis',
        definition: 'Bursitis (DC 5019) is rated analogously to degenerative arthritis (DC 5003) per the Note to DCs 5013-5024. This means X-ray evidence of the underlying joint condition drives the rating.',
        source: '38 CFR 4.71a, DC 5019 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get imaging of the affected joint — X-ray, ultrasound, or MRI documenting the bursa inflammation.',
        priority: 'high'
      },
      {
        tip: 'Document injection history — repeated corticosteroid injections signal persistent, significant bursitis.',
        priority: 'medium'
      },
      {
        tip: 'Track functional limitations of the affected joint.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report the specific bursa location and affected joint',
      'Describe functional limitations from bursitis',
      'Report pain on movement during the ROM examination',
      'Mention all treatments including injections and their temporary effectiveness'
    ]
  },

  // ============================================
  // TENDINITIS - DC 5024
  // ============================================
  '5024': {
    condition: 'Tendinitis/Tenosynovitis',
    cfrReference: '38 CFR 4.71a, DC 5024',

    keyDefinitions: {
      ratedAsArthritis: {
        term: 'Rated as Degenerative Arthritis',
        definition: 'Tendinitis is rated analogously to degenerative arthritis (DC 5003) per the Note to DCs 5013-5024. Functional limitation of the associated joint drives the rating.',
        source: '38 CFR 4.71a, DC 5024 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get ultrasound or MRI documenting tendon involvement — objective imaging strengthens the claim.',
        priority: 'high'
      },
      {
        tip: 'Document functional limitation of the associated joint specifically.',
        priority: 'high'
      },
      {
        tip: 'Track treatment history: PT, injections, bracing, surgery.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report which specific tendon is affected and at which joint',
      'Describe ROM limitation caused by tendinitis pain',
      'Report activities you cannot perform due to tendinitis',
      'Mention flare-ups and their frequency'
    ]
  },

  // ============================================
  // MULTI-JOINT ARTHRITIS (ACTIVE PROCESS) - DC 5002
  // ============================================
  '5002': {
    condition: 'Rheumatoid/Multi-Joint Arthritis (Active Process)',
    cfrReference: '38 CFR 4.71a, DC 5002',

    keyDefinitions: {
      activeProcess: {
        term: 'Active Inflammatory Process',
        definition: 'DC 5002 rates the active inflammatory component (RA, psoriatic arthritis, etc.) with weight loss, anemia, and systemic symptoms. When the active process resolves, residual joint damage is rated under the applicable joint DCs.',
        source: '38 CFR 4.71a, DC 5002',
        important: true
      },
      systemic: {
        term: 'Systemic Manifestations',
        definition: 'RA and similar conditions may have systemic effects (cardiovascular, pulmonary, renal) that are separately ratable as secondary conditions.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Document lab values: ESR, CRP, RF, anti-CCP — objective markers of active disease.',
        priority: 'critical'
      },
      {
        tip: 'Document systemic manifestations: fatigue, weight loss, anemia — all ratable.',
        priority: 'high'
      },
      {
        tip: 'Track medication complexity: DMARDs, biologics signal severe, treatment-requiring disease.',
        priority: 'high'
      },
      {
        tip: 'Document joint damage on X-ray: erosions, joint space narrowing — supports residual ratings.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring lab results showing inflammatory markers',
      'Report ALL affected joints and their functional limitations',
      'Describe systemic symptoms: fatigue, morning stiffness duration, weight loss',
      'Report impact on work and daily activities'
    ]
  },

  // ============================================
  // MYOSITIS - DC 5021
  // ============================================
  '5021': {
    condition: 'Myositis',
    cfrReference: '38 CFR 4.71a, DC 5021',

    keyDefinitions: {
      ratedAsArthritis: {
        term: 'Rated as Degenerative Arthritis',
        definition: 'Myositis is rated analogously to degenerative arthritis per the Note to DCs 5013-5024.',
        source: '38 CFR 4.71a, DC 5021 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document muscle enzyme levels (CK, aldolase, LDH) — elevated enzymes confirm active myositis.',
        priority: 'critical'
      },
      {
        tip: 'Get EMG and muscle biopsy documentation if performed.',
        priority: 'high'
      },
      {
        tip: 'Document functional weakness in affected muscle groups specifically.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report muscle weakness in specific groups: proximal, distal, symmetric',
      'Describe activities limited by muscle weakness',
      'Report treatment history: steroids, immunosuppressants',
      'Mention any associated conditions: rash (dermatomyositis), interstitial lung disease'
    ]
  },

  // ============================================
  // SPINAL STENOSIS - DC 5238
  // ============================================
  '5238': {
    condition: 'Spinal Stenosis',
    cfrReference: '38 CFR 4.71a, DC 5238',

    keyDefinitions: {
      neurogenic: {
        term: 'Neurogenic Claudication',
        definition: 'Leg pain, numbness, or weakness brought on by walking or standing — relieved by sitting. Classic symptom of lumbar spinal stenosis. Document walking distance before symptoms onset.',
        source: '38 CFR 4.71a / Clinical Standards',
        important: true
      },
      radiculopathySeparate: {
        term: 'Radiculopathy Separate Rating',
        definition: 'Spinal stenosis causing radiculopathy may support a separate rating for the affected nerve root (sciatic, femoral, etc.) in addition to the spine rating.',
        source: '38 CFR 4.71a',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'Functional loss from pain must be considered.',
        practicalApplication: 'Document how far you can walk before neurogenic symptoms begin.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document neurogenic claudication: exact walking distance before onset of leg symptoms.',
        priority: 'critical'
      },
      {
        tip: 'Get MRI of spine showing stenosis severity at each level.',
        priority: 'critical'
      },
      {
        tip: 'Claim associated radiculopathy as a separate condition if nerve root compression is present.',
        priority: 'critical'
      },
      {
        tip: 'Document any surgical history: laminectomy, fusion — and post-surgical residuals.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report neurogenic claudication — how far can you walk before your legs go numb/weak?',
      'Bring MRI reports showing stenosis',
      'Report all neurological symptoms: leg numbness, weakness, bowel/bladder changes',
      'Mention if surgery was performed and what residuals remain',
      'Report ROM limitation and pain on movement'
    ]
  },

  // ============================================
  // ANKYLOSING SPONDYLITIS - DC 5240
  // ============================================
  '5240': {
    condition: 'Ankylosing Spondylitis',
    cfrReference: '38 CFR 4.71a, DC 5240',

    keyDefinitions: {
      asRating: {
        term: 'AS Rating Based on Functional Manifestations',
        definition: 'Rated based on spinal ROM using the General Rating Formula for the spine. Ankylosis (complete fusion) in favorable position is rated at 40-50%; unfavorable position at 50-100%.',
        source: '38 CFR 4.71a, DC 5240',
        important: true
      },
      hlaB27: {
        term: 'HLA-B27 Testing',
        definition: 'HLA-B27 positivity supports the AS diagnosis. Sacroiliac joint involvement on X-ray (sacroiliitis) is the radiographic hallmark. Get imaging documentation.',
        source: 'Clinical Standards'
      }
    },

    documentationTips: [
      {
        tip: 'Get sacroiliac joint and spine X-rays/MRI documenting sacroiliitis and spinal changes.',
        priority: 'critical'
      },
      {
        tip: 'Document extraarticular manifestations: uveitis, psoriasis, IBD — these are separately ratable.',
        priority: 'high'
      },
      {
        tip: 'Track ROM limitation: forward flexion most important, but also lateral flexion and rotation.',
        priority: 'critical'
      },
      {
        tip: 'Document medication complexity: NSAIDs, biologics (TNF inhibitors) signal severity.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report morning stiffness duration — a classic AS feature',
      'Bring imaging showing sacroiliitis and spinal involvement',
      'Report all ROM limitations — spine, hips, and other affected joints',
      'Mention extraarticular symptoms: eye pain, skin rashes, bowel symptoms'
    ]
  },

  // ============================================
  // HYPERTENSION - DC 7101
  // ============================================
  '7101': {
    condition: 'Hypertension',
    cfrReference: '38 CFR 4.104, DC 7101',

    keyDefinitions: {
      thresholds: {
        term: 'Diastolic Thresholds — The Key Metric',
        definition: 'Ratings: 10% (diastolic ≥100 OR systolic ≥160 OR history of diastolic ≥100 requiring continuous medication), 20% (diastolic ≥110), 40% (diastolic ≥120), 60% (diastolic ≥130). Readings must be confirmed on two or more readings on at least three different days.',
        source: '38 CFR 4.104, DC 7101',
        important: true
      },
      threeDay: {
        term: 'Three-Day Confirmation Rule',
        definition: 'Blood pressure must be measured on at least three separate days. A single high reading is not sufficient. Keep a home BP log spanning multiple days.',
        source: '38 CFR 4.104, DC 7101 Note',
        important: true
      },
      medication: {
        term: 'Continuous Medication = Minimum 10%',
        definition: 'A veteran with a history of diastolic ≥100 who currently requires continuous medication for control is entitled to a minimum 10% rating — even if current readings are controlled below 100.',
        source: '38 CFR 4.104, DC 7101',
        important: true
      },
      secondary: {
        term: 'Secondary to Other Conditions',
        definition: 'Hypertension is commonly secondary to service-connected PTSD, sleep apnea, kidney disease, or pain conditions. If secondary, it may be separately rated under 38 CFR 3.310.',
        source: '38 CFR 3.310',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Caluza v. Brown',
        citation: '7 Vet. App. 498 (1995)',
        year: 1995,
        holding: 'A veteran\'s lay testimony is competent evidence for conditions observable by a layperson.',
        practicalApplication: 'Home blood pressure logs maintained by the veteran are competent supporting evidence.',
        important: true
      },
      {
        case: 'Boggs v. Peake',
        citation: '520 F.3d 1330 (Fed. Cir. 2008)',
        year: 2008,
        holding: 'Secondary conditions caused by service-connected disabilities are themselves service-connected.',
        practicalApplication: 'If your PTSD or sleep apnea contributes to hypertension, file it as secondary service connection.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Keep a home BP log taken at least twice daily for 2–3 weeks before your C&P exam — multiple readings over multiple days is the required evidentiary standard.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL blood pressure readings, including the highest ones — the VA looks for "predominant" diastolic levels.',
        priority: 'critical'
      },
      {
        tip: 'List all antihypertensive medications — taking continuous medication for BP control entitles you to a minimum 10% rating.',
        priority: 'high'
      },
      {
        tip: 'If secondary to PTSD, sleep apnea, or kidney disease, file for secondary service connection explicitly.',
        priority: 'high'
      },
      {
        tip: 'Document hypertensive heart disease (DC 7007) separately if cardiac enlargement or other cardiac involvement is present.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring your home BP log — multiple readings over multiple days is required for rating',
      'Report ALL medications you take for blood pressure',
      'Tell the examiner about the highest readings you have had at home or at any clinic',
      'Mention if hypertension is related to your PTSD, sleep apnea, or kidney condition',
      'Do not take extra doses of BP medication before the exam — your readings should reflect your typical control'
    ],

    commonMistakes: [
      'Relying on a single elevated reading taken by VA at exam — multiple readings on multiple days required',
      'Not keeping a home BP log prior to the C&P exam',
      'Not claiming secondary service connection when HTN is caused by PTSD or sleep apnea',
      'Accepting 0% when currently medicated — history of diastolic ≥100 + continuous medication = 10%'
    ]
  },

  // ============================================
  // CORONARY ARTERY DISEASE - DC 7005
  // ============================================
  '7005': {
    condition: 'Coronary Artery Disease (Arteriosclerotic Heart Disease)',
    cfrReference: '38 CFR 4.104, DC 7005',

    keyDefinitions: {
      mets: {
        term: 'METs — The Key Rating Metric',
        definition: 'Metabolic Equivalents of Task. The General Rating Formula rates cardiac disease based on the MET level at which symptoms (breathlessness, fatigue, angina, dizziness, syncope) develop. Ratings: 100% (≤3.0 METs), 60% (3.1–5.0 METs), 30% (5.1–7.0 METs or cardiac hypertrophy/dilatation on echo), 10% (7.1–10.0 METs or continuous medication).',
        source: '38 CFR 4.100 / 4.104, DC 7005',
        important: true
      },
      exerciseTesting: {
        term: 'Exercise Stress Test Requirement',
        definition: 'VA requires exercise stress testing (with METs determination) for CAD ratings in most cases. Exception: medical contraindication to testing, or when 100% can be assigned on other basis.',
        source: '38 CFR 4.100(b)',
        important: true
      },
      cardiacHypertrophy: {
        term: 'Cardiac Hypertrophy/Dilatation',
        definition: 'If echocardiogram confirms cardiac enlargement, this independently supports a minimum 30% rating — even without METs testing.',
        source: '38 CFR 4.100',
        important: true
      },
      continuousMedication: {
        term: 'Continuous Medication = 10% Minimum',
        definition: 'Taking continuous medication to control CAD symptoms entitles the veteran to a minimum 10% rating regardless of METs level.',
        source: '38 CFR 4.100'
      }
    },

    caseLaw: [
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'Veterans\' lay testimony about symptoms and functional limitations is competent evidence.',
        practicalApplication: 'Document angina, breathlessness, and activity limitations in your own words — this has legal weight.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get a current stress test with METs determination — this is the primary rating evidence for CAD.',
        priority: 'critical'
      },
      {
        tip: 'Document symptoms at specific exertion levels: can you climb one flight of stairs? Walk a block? These map to METs.',
        priority: 'critical'
      },
      {
        tip: 'Get an echocardiogram — cardiac hypertrophy or dilatation on echo supports a minimum 30% rating independently.',
        priority: 'high'
      },
      {
        tip: 'List all cardiac medications — continuous medication alone supports 10%.',
        priority: 'high'
      },
      {
        tip: 'Document nexus to service: hypertension, smoking during service, stressful occupation.',
        priority: 'high'
      },
      {
        tip: 'If Agent Orange exposure (Vietnam, Korea DMZ, etc.) is in your history — ischemic heart disease is a presumptive condition.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report the specific activities that cause your symptoms — the examiner must translate these to METs',
      'Describe angina, shortness of breath, fatigue, and dizziness at different exertion levels',
      'Bring your most recent echocardiogram and stress test results',
      'For Vietnam/Agent Orange veterans: confirm IHD is being claimed as presumptive',
      'Report ALL cardiac medications'
    ],

    commonMistakes: [
      'Not having a current stress test — without METs data, rating may be underestimated',
      'Vietnam veterans not claiming ischemic heart disease as an Agent Orange presumptive',
      'Not getting an echocardiogram — cardiac enlargement on echo = independent 30% basis',
      'Describing symptoms in vague terms instead of specific activity levels'
    ],

    ratingNote: 'Ischemic heart disease (IHD) is a presumptive service-connected condition for veterans with Agent Orange exposure (Vietnam, Korea DMZ, Thailand, etc.). No nexus letter required — file immediately.'
  },

  // ============================================
  // POST-MI (MYOCARDIAL INFARCTION) - DC 7006
  // ============================================
  '7006': {
    condition: 'Myocardial Infarction (Post-MI)',
    cfrReference: '38 CFR 4.104, DC 7006',

    keyDefinitions: {
      acutePhase: {
        term: 'Acute Phase Rating',
        definition: 'During and for 3 months following an MI confirmed by laboratory tests (troponin, EKG): 100% rating. After 3 months, revert to General Rating Formula (METs-based).',
        source: '38 CFR 4.104, DC 7006',
        important: true
      },
      mets: {
        term: 'Post-Acute Rating: METs-Based',
        definition: 'After the 3-month acute period, rate under the General Rating Formula: 100% (≤3 METs), 60% (3.1–5 METs), 30% (5.1–7 METs or echo showing cardiac enlargement), 10% (7.1–10 METs or continuous medication).',
        source: '38 CFR 4.100',
        important: true
      },
      proposedRating: {
        term: 'Proposed Rating After Acute Period',
        definition: 'VA must reevaluate 3 months after MI. Request a stress test and echocardiogram before that reevaluation — these are required for an accurate rating.',
        source: '38 CFR 4.104, DC 7006'
      }
    },

    caseLaw: [
      {
        case: 'Bradley v. Peake',
        citation: '22 Vet. App. 280 (2008)',
        year: 2008,
        holding: 'VA must consider all evidence in determining the appropriate rating level.',
        practicalApplication: 'Ensure your post-MI stress test and echocardiogram results are submitted before any proposed rating reduction.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get a stress test and echocardiogram at or near the 3-month mark — these drive the post-acute rating.',
        priority: 'critical'
      },
      {
        tip: 'Document ongoing symptoms: angina, dyspnea on exertion, fatigue, palpitations.',
        priority: 'high'
      },
      {
        tip: 'Keep records of all cardiac rehab attendance and progress.',
        priority: 'medium'
      },
      {
        tip: 'List all cardiac medications — continuous medication supports minimum 10%.',
        priority: 'high'
      },
      {
        tip: 'If IHD was caused by Agent Orange exposure, ensure presumptive claim is filed.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report current activity limitations since the MI — what can you no longer do?',
      'Bring stress test results showing METs level at symptom onset',
      'Report any ongoing angina, shortness of breath, or palpitations',
      'Mention if cardiac rehab has helped — document residual limitations despite rehab'
    ]
  },

  // ============================================
  // CARDIOMYOPATHY - DC 7020
  // ============================================
  '7020': {
    condition: 'Cardiomyopathy',
    cfrReference: '38 CFR 4.104, DC 7020',

    keyDefinitions: {
      mets: {
        term: 'METs-Based Rating',
        definition: 'Cardiomyopathy uses the General Rating Formula: 100% (≤3 METs or chronic congestive heart failure), 60% (3.1–5 METs), 30% (5.1–7 METs or echo showing cardiac enlargement), 10% (7.1–10 METs or continuous medication).',
        source: '38 CFR 4.100 / 4.104, DC 7020',
        important: true
      },
      ejectionFraction: {
        term: 'Ejection Fraction',
        definition: 'Echocardiogram showing reduced ejection fraction (EF) is key objective evidence. Severely reduced EF (<35%) often supports 100% rating via heart failure symptoms at low METs.',
        source: '38 CFR 4.100',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get a current echocardiogram documenting ejection fraction and any cardiac enlargement.',
        priority: 'critical'
      },
      {
        tip: 'Get a stress test with METs determination — this directly drives the rating level.',
        priority: 'critical'
      },
      {
        tip: 'Document CHF symptoms if present: dyspnea, orthopnea, edema, fatigue at rest.',
        priority: 'high'
      },
      {
        tip: 'List all cardiac medications including doses — complex regimens reflect severity.',
        priority: 'medium'
      },
      {
        tip: 'Document any implanted devices: ICD, CRT pacemaker — these indicate severe disease.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report activity limitations specifically — what activities cause symptoms at what level of exertion?',
      'Bring echocardiogram showing ejection fraction',
      'Report CHF symptoms: swollen legs, difficulty lying flat, waking up breathless',
      'Mention implanted cardiac devices'
    ]
  },

  // ============================================
  // ARRHYTHMIA - DC 7010 / 7011
  // ============================================
  '7010': {
    condition: 'Cardiac Arrhythmia (SVT / Arrhythmia)',
    cfrReference: '38 CFR 4.104, DC 7010-7011',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula — METs-Based',
        definition: 'Arrhythmias are rated using the General Cardiac Formula based on METs: 100% (≤3 METs), 60% (3.1–5 METs), 30% (5.1–7 METs or cardiac hypertrophy on echo), 10% (7.1–10 METs or continuous medication).',
        source: '38 CFR 4.100 / 4.104',
        important: true
      },
      singleCode: {
        term: 'Single Evaluation for Multiple Arrhythmias',
        definition: 'When multiple arrhythmias (DC 7009, 7010, 7011, 7015) are present, a single rating is assigned under the code that best reflects the predominant disability — they cannot be combined.',
        source: '38 CFR 4.104, Note to DCs 7009-7015',
        important: true
      },
      pacemaker: {
        term: 'Pacemaker/ICD',
        definition: 'DC 7009 (Bradycardia with pacemaker): 100% for one month post-implantation, then General Formula. ICD implantation also requires reevaluation post-procedure.',
        source: '38 CFR 4.104, DC 7009'
      }
    },

    documentationTips: [
      {
        tip: 'Get Holter monitor or event monitor results documenting arrhythmia frequency and type.',
        priority: 'critical'
      },
      {
        tip: 'Get a stress test with METs determination — cardiac formula requires this.',
        priority: 'critical'
      },
      {
        tip: 'Document syncope or near-syncope episodes — these indicate hemodynamic significance and support higher ratings.',
        priority: 'high'
      },
      {
        tip: 'Note impact on driving, employment, and daily activities from arrhythmia episodes.',
        priority: 'high'
      },
      {
        tip: 'If ablation or device implantation was performed, document results and ongoing residuals.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report palpitation frequency, duration, and severity',
      'Describe syncope, presyncope, or dizziness episodes',
      'Report exertion-related symptoms and activity limitations',
      'Mention all antiarrhythmic medications and devices',
      'Bring Holter monitor results and any electrophysiology study reports'
    ]
  },

  // ============================================
  // PERICARDITIS - DC 7002
  // ============================================
  '7002': {
    condition: 'Pericarditis',
    cfrReference: '38 CFR 4.104, DC 7002',

    keyDefinitions: {
      acuteVsChronic: {
        term: 'Acute vs. Chronic Rating',
        definition: 'During active infection with cardiac involvement and for 3 months following cessation of therapy: 100% rating. After 3 months: General Rating Formula (METs-based). Chronic constrictive pericarditis may warrant higher rating based on hemodynamic impairment.',
        source: '38 CFR 4.104, DC 7002',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the service-connected cause of pericarditis: infection, autoimmune, or radiation.',
        priority: 'critical'
      },
      {
        tip: 'Get echocardiogram documenting pericardial effusion, thickening, or constriction.',
        priority: 'high'
      },
      {
        tip: 'Document ongoing symptoms: chest pain on breathing, dyspnea, fatigue.',
        priority: 'high'
      },
      {
        tip: 'Get stress test post-active phase for METs-based rating.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report ongoing chest pain, especially with inspiration',
      'Bring echocardiogram and cardiac imaging results',
      'Describe activity limitations since pericarditis diagnosis',
      'Report any hospitalizations for pericardial effusion drainage'
    ]
  },

  // ============================================
  // HYPERTENSIVE HEART DISEASE - DC 7007
  // ============================================
  '7007': {
    condition: 'Hypertensive Heart Disease',
    cfrReference: '38 CFR 4.104, DC 7007',

    keyDefinitions: {
      combo: {
        term: 'Separate Rating from Hypertension',
        definition: 'Hypertensive heart disease (DC 7007) is rated separately from hypertension (DC 7101). If both are present, both may be service-connected and rated. DC 7007 uses the General Cardiac Formula (METs-based).',
        source: '38 CFR 4.104, DC 7007',
        important: true
      },
      cardiacEnlargement: {
        term: 'Cardiac Enlargement Threshold',
        definition: 'Echocardiogram documenting left ventricular hypertrophy (LVH) or cardiac dilatation independently supports a 30% rating under the General Formula.',
        source: '38 CFR 4.100',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get echocardiogram documenting left ventricular hypertrophy or dilatation from hypertension.',
        priority: 'critical'
      },
      {
        tip: 'Ensure BOTH hypertension (DC 7101) and hypertensive heart disease (DC 7007) are claimed — separate ratings may apply.',
        priority: 'critical'
      },
      {tip: 'Get stress test for METs determination.', priority: 'high'}
    ],

    examTips: [
      'Report both blood pressure readings and cardiac symptoms',
      'Bring echocardiogram showing any cardiac changes from long-standing hypertension',
      'Confirm both conditions are being evaluated separately'
    ]
  },

  // ============================================
  // POST-PHLEBITIC SYNDROME - DC 7121
  // ============================================
  '7121': {
    condition: 'Post-Phlebitic Syndrome / Chronic Venous Insufficiency',
    cfrReference: '38 CFR 4.104, DC 7121',

    keyDefinitions: {
      ratings: {
        term: 'Rating Scale',
        definition: 'Rated: 0% (asymptomatic, no edema), 10% (persistent edema OR skin pigmentation), 20% (persistent edema AND skin pigmentation OR recurrent stasis ulcer), 30% (persistent edema AND skin ulceration or stasis dermatitis with eczematous lesions), 100% (massive chronic edema with persistent ulceration).',
        source: '38 CFR 4.104, DC 7121',
        important: true
      },
      bilateralFactor: {
        term: 'Bilateral Factor',
        definition: 'When both legs are service-connected for post-phlebitic syndrome or varicose veins, the bilateral factor (10%) applies.',
        source: '38 CFR 4.26'
      }
    },

    documentationTips: [
      {
        tip: 'Photograph leg swelling, skin changes, and any ulcerations — visual documentation is powerful evidence.',
        priority: 'critical'
      },
      {
        tip: 'Document skin pigmentation, stasis dermatitis, and scarring from previous ulcers.',
        priority: 'high'
      },
      {
        tip: 'Get venous duplex ultrasound documenting chronic venous insufficiency and reflux.',
        priority: 'high'
      },
      {
        tip: 'Track wound care visits and any wound care specialist involvement.',
        priority: 'medium'
      },
      {
        tip: 'Document if both legs are affected — bilateral factor applies.',
        priority: 'high'
      }
    ],

    examTips: [
      'Show the examiner your legs — swelling, skin changes, and ulcers are visible evidence',
      'Report how frequently swelling occurs and how severe it gets',
      'Describe skin changes: color, texture, hair loss, dermatitis',
      'Report any ulcerations, their frequency, healing time, and need for wound care',
      'Note if both legs are affected'
    ]
  },

  // ============================================
  // PERIPHERAL ARTERIAL DISEASE - DC 7114
  // ============================================
  '7114': {
    condition: 'Peripheral Arterial Disease',
    cfrReference: '38 CFR 4.104, DC 7114',

    keyDefinitions: {
      ratings: {
        term: 'PAD Rating Scale',
        definition: 'Rated: 0% (ankle/brachial index ≥0.9), 10% (ABI 0.7–0.89 or claudication >200 meters), 20% (ABI 0.5–0.69 or claudication 100–200 meters), 40% (ABI 0.4–0.49 or claudication <100 meters or ischemic rest pain), 60% (non-healing ischemic ulcers or gangrene, or ABI <0.4).',
        source: '38 CFR 4.104, DC 7114',
        important: true
      },
      abi: {
        term: 'Ankle-Brachial Index (ABI)',
        definition: 'The ABI is the primary objective test for PAD severity. An ABI below 0.90 is abnormal. The ABI directly determines which rating threshold applies.',
        source: '38 CFR 4.104, DC 7114',
        important: true
      },
      claudication: {
        term: 'Claudication Distance',
        definition: 'The walking distance before leg pain forces the veteran to stop is the second key metric. Document claudication distance precisely.',
        source: '38 CFR 4.104, DC 7114',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get ABI testing — this is the primary objective measure driving the PAD rating.',
        priority: 'critical'
      },
      {
        tip: 'Document claudication distance: exactly how far you can walk before leg pain stops you.',
        priority: 'critical'
      },
      {
        tip: 'Document rest pain if present — rest pain is a higher-severity finding.',
        priority: 'high'
      },
      {
        tip: 'Photograph any ischemic ulcers or skin changes.',
        priority: 'high'
      },
      {
        tip: 'Note bilateral involvement — both legs affected increases the combined rating.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report claudication distance precisely: "I can walk about 50 meters before the pain stops me"',
      'Bring ABI test results',
      'Report rest pain if you have leg pain while not walking',
      'Describe any skin changes, ulcers, or color changes in your feet or legs',
      'Mention if both legs are affected'
    ]
  },

  // ============================================
  // COLD INJURY RESIDUALS - DC 7122
  // ============================================
  '7122': {
    condition: 'Cold Injury Residuals (Frostbite)',
    cfrReference: '38 CFR 4.104, DC 7122',

    keyDefinitions: {
      combinedCriteria: {
        term: 'Cold Injury Rating Criteria',
        definition: 'Rated at 30% if arthralgia/pain/numbness/cold sensitivity PLUS 2+ of: tissue loss, nail abnormalities, color changes, locally impaired sensation, hyperhidrosis, X-ray abnormalities, atrophy/fibrosis, flexion/extension contractures. Lower ratings for fewer findings.',
        source: '38 CFR 4.104, DC 7122',
        important: true
      },
      perPart: {
        term: 'Each Affected Part Rated Separately',
        definition: 'Cold injury residuals are rated separately for each affected body part (each hand, foot, ear, nose). Multiple bilateral ratings may each qualify for the bilateral factor.',
        source: '38 CFR 4.104, DC 7122',
        important: true
      },
      presumptive: {
        term: 'Presumptive Service Connection',
        definition: 'Cold injury residuals are presumptively service-connected for veterans who had documented cold injury during service. Service medical records showing frostbite treatment establish the nexus.',
        source: '38 CFR 3.304(e)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get service records documenting the original cold injury or frostbite treatment.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL affected areas: each foot, each hand, ears, nose — each is separately ratable.',
        priority: 'critical'
      },
      {
        tip: 'Photograph skin changes, nail abnormalities, tissue loss, and color changes.',
        priority: 'high'
      },
      {
        tip: 'Get X-rays of affected bones — osteoporosis and punched-out lesions are objective evidence.',
        priority: 'high'
      },
      {
        tip: 'Track cold sensitivity specifically — worsening of symptoms in cold weather is a hallmark finding.',
        priority: 'high'
      }
    ],

    examTips: [
      'Describe ALL areas affected: both feet, both hands, ears, nose — each is evaluated separately',
      'Report cold sensitivity: how do your symptoms change in cold weather?',
      'Show nail abnormalities, color changes, and skin texture differences',
      'Bring X-ray results of affected areas',
      'Report pain, numbness, and hyperhidrosis or anhydrosis in affected parts'
    ],

    ratingNote: 'Cold injury residuals in both hands and/or both feet qualify for the bilateral factor. File for each affected part separately — having 4 separate cold injury residual ratings (both hands, both feet) is appropriate if all are affected.'
  },

  // ============================================
  // ASTHMA - DC 6602
  // ============================================
  '6602': {
    condition: 'Bronchial Asthma',
    cfrReference: '38 CFR 4.97, DC 6602',

    keyDefinitions: {
      spirometry: {
        term: 'Spirometry — Primary Rating Evidence',
        definition: 'FEV-1 % predicted and FEV-1/FVC ratio are the primary metrics. Ratings: 100% (FEV-1 <40% or >1 attack/week with respiratory failure or daily systemic corticosteroids), 60% (FEV-1 40–55% or monthly physician visits or ≥3 systemic corticosteroid courses/year), 30% (FEV-1 56–70% or daily bronchodilator or daily inhaled anti-inflammatory), 10% (FEV-1 71–80% or intermittent inhaler use).',
        source: '38 CFR 4.97, DC 6602',
        important: true
      },
      corticosteroids: {
        term: 'Systemic Corticosteroid Courses',
        definition: 'Three or more courses of oral/injectable steroids per year independently supports a 60% rating. Track and document every course of prednisone/methylprednisolone.',
        source: '38 CFR 4.97, DC 6602',
        important: true
      },
      occupational: {
        term: 'Occupational Asthma',
        definition: 'Asthma caused or aggravated by occupational exposures during military service (dust, chemicals, burn pits, smoke) is service-connectable. Document specific exposure events.',
        source: '38 CFR 3.304'
      }
    },

    caseLaw: [
      {
        case: 'Polovick v. Shinseki',
        citation: '23 Vet. App. 78 (2009)',
        year: 2009,
        holding: 'VA must consider all evidence of record when evaluating pulmonary conditions.',
        practicalApplication: 'Ensure all spirometry and treatment records are in your file before the C&P exam.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get spirometry (FEV-1/FVC) testing — this is the primary rating evidence. Test when symptomatic if possible.',
        priority: 'critical'
      },
      {
        tip: 'Keep a log of oral/injectable steroid courses taken during the year — three courses = 60% rating.',
        priority: 'critical'
      },
      {
        tip: 'Document ER visits and hospitalizations for asthma — these support the highest ratings.',
        priority: 'high'
      },
      {
        tip: 'Track physician visits for required care of exacerbations — monthly visits = 60%.',
        priority: 'high'
      },
      {
        tip: 'Document burn pit, dust, chemical, or smoke exposure during service for nexus.',
        priority: 'critical'
      },
      {
        tip: 'Note all daily medications: inhalers, biologics, oral steroids — these indicate severity.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Get spirometry BEFORE the C&P exam and bring results — do not rely on exam-day testing alone',
      'Report steroid courses taken in the past 12 months: exact dates and prescriber',
      'Describe ER visits and hospitalizations for asthma',
      'Report daily medication regimen including inhaler types and frequency',
      'Describe exposure during service: burn pits, dust storms, chemical exposure'
    ],

    commonMistakes: [
      'Arriving at C&P well-medicated and symptom-free — bring pre-bronchodilator spirometry',
      'Not documenting oral steroid courses — three courses/year = 60%',
      'Not claiming secondary service connection for obesity-related or GERD-exacerbated asthma',
      'Burn pit/toxic exposure veterans not claiming presumptive service connection'
    ]
  },

  // ============================================
  // COPD - DC 6604
  // ============================================
  '6604': {
    condition: 'Chronic Obstructive Pulmonary Disease (COPD)',
    cfrReference: '38 CFR 4.97, DC 6604',

    keyDefinitions: {
      spirometry: {
        term: 'Spirometry — Required Rating Evidence',
        definition: 'FEV-1 % predicted and FEV-1/FVC ratio drive the rating. Same thresholds as COPD/emphysema: 100% (FEV-1 <40% or DLCO <40% or requires supplemental O2), 60% (FEV-1 40–55%), 30% (FEV-1 56–70%), 10% (FEV-1 71–80%). Note: respiratory DCs cannot be combined — use the highest applicable code.',
        source: '38 CFR 4.97, DC 6604',
        important: true
      },
      noCombo: {
        term: 'No Combining Respiratory Codes',
        definition: 'Ratings under DCs 6600–6817 and 6822–6847 cannot be combined with each other. VA assigns a single rating under the DC that best reflects the predominant respiratory disability.',
        source: '38 CFR 4.96(a)',
        important: true
      },
      burnPit: {
        term: 'Burn Pit / PACT Act Presumptive',
        definition: 'The PACT Act (2022) created presumptive service connection for constrictive bronchiolitis and other respiratory conditions for veterans with qualifying toxic exposure. Check current PACT Act presumptive list for respiratory conditions.',
        source: '38 CFR 3.320 / PACT Act (2022)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get pre- and post-bronchodilator spirometry — the pre-bronchodilator FEV-1 is the rating-relevant value.',
        priority: 'critical'
      },
      {
        tip: 'Get DLCO (diffusion capacity) testing — low DLCO can independently support higher ratings.',
        priority: 'high'
      },
      {
        tip: 'Document supplemental oxygen use — O2 requirement supports 100% rating.',
        priority: 'critical'
      },
      {
        tip: 'For toxic exposure veterans (burn pits, Agent Orange, etc.) explore PACT Act presumptive eligibility.',
        priority: 'critical'
      },
      {
        tip: 'Track exacerbations requiring steroids, ER visits, or hospitalizations.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring spirometry results — do not rely solely on exam-day testing',
      'Report supplemental oxygen use if prescribed',
      'Describe exertion limitations: how far can you walk, how many stairs can you climb?',
      'Report toxic exposures during service: burn pits, Agent Orange, industrial chemicals',
      'Mention all COPD medications including inhalers and oral steroids'
    ]
  },

  // ============================================
  // CHRONIC BRONCHITIS - DC 6600
  // ============================================
  '6600': {
    condition: 'Chronic Bronchitis',
    cfrReference: '38 CFR 4.97, DC 6600',

    keyDefinitions: {
      spirometry: {
        term: 'Spirometry Required',
        definition: 'Rated using the same FEV-1/FVC thresholds as COPD (DC 6604). Pre-bronchodilator spirometry is the primary rating evidence.',
        source: '38 CFR 4.97, DC 6600',
        important: true
      },
      noCombo: {
        term: 'Cannot Combine with Other Respiratory DCs',
        definition: 'Chronic bronchitis cannot be combined with asthma, COPD, or emphysema ratings. VA assigns a single rating under the most applicable code.',
        source: '38 CFR 4.96(a)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get pre-bronchodilator spirometry — this is the required rating evidence.',
        priority: 'critical'
      },
      {
        tip: 'Document cough frequency, sputum production, and exacerbation frequency.',
        priority: 'high'
      },
      {
        tip: 'Track hospitalizations and ER visits for acute exacerbations.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring spirometry results',
      'Report cough duration, frequency, and sputum characteristics',
      'Describe exacerbation frequency and what triggers them',
      'Report all respiratory medications'
    ]
  },

  // ============================================
  // EMPHYSEMA - DC 6603
  // ============================================
  '6603': {
    condition: 'Pulmonary Emphysema',
    cfrReference: '38 CFR 4.97, DC 6603',

    keyDefinitions: {
      dlco: {
        term: 'DLCO — Key Additional Metric',
        definition: 'Emphysema destroys alveoli, reducing diffusion capacity. DLCO % predicted is especially important for emphysema ratings: 100% (<40%), 60% (40–55%), 30% (56–65%), 10% (66–80%).',
        source: '38 CFR 4.97, DC 6603',
        important: true
      },
      hyperinflation: {
        term: 'Hyperinflation on Imaging',
        definition: 'CT chest showing hyperinflation, bullae, and air trapping is objective evidence of emphysema severity. Imaging findings supplement spirometry.',
        source: '38 CFR 4.97'
      }
    },

    documentationTips: [
      {
        tip: 'Get both FEV-1/FVC spirometry AND DLCO testing — DLCO is particularly important for emphysema.',
        priority: 'critical'
      },
      {
        tip: 'Get CT chest documenting emphysematous changes and extent of disease.',
        priority: 'high'
      },
      {
        tip: 'Document supplemental oxygen use — O2 requirement = 100%.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring both spirometry AND diffusion capacity (DLCO) results',
      'Report supplemental oxygen use',
      'Describe exertion limitations specifically',
      'Bring CT chest report documenting emphysema extent'
    ]
  },

  // ============================================
  // BRONCHIECTASIS - DC 6601
  // ============================================
  '6601': {
    condition: 'Bronchiectasis',
    cfrReference: '38 CFR 4.97, DC 6601',

    keyDefinitions: {
      ratings: {
        term: 'Bronchiectasis Rating Scale',
        definition: 'Rated: 30% (moderate — with 3+ episodes of acute infection/year OR continuous antibiotics), 50% (moderately severe — with daily purulent sputum production OR hemoptysis), 60% (severe — involves both lungs or major hemoptysis), 100% (with documented cor pulmonale or respiratory failure).',
        source: '38 CFR 4.97, DC 6601',
        important: true
      },
      imaging: {
        term: 'CT Chest — Required Evidence',
        definition: 'High-resolution CT chest is the gold standard for diagnosing and staging bronchiectasis. VA should accept current HRCT as primary diagnostic evidence.',
        source: '38 CFR 4.97',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get high-resolution CT chest documenting the extent of bronchiectatic changes.',
        priority: 'critical'
      },
      {
        tip: 'Track acute infection episodes requiring antibiotics per year — 3+ = 30% minimum.',
        priority: 'critical'
      },
      {
        tip: 'Document daily sputum production: amount, color, and consistency.',
        priority: 'high'
      },
      {
        tip: 'Note any hemoptysis episodes — blood in sputum escalates the rating.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring CT chest results',
      'Report number of antibiotic courses per year for lung infections',
      'Describe daily sputum production honestly — amount and color matter for rating',
      'Report any blood in sputum (hemoptysis)'
    ]
  },

  // ============================================
  // PULMONARY FIBROSIS - DC 6825
  // ============================================
  '6825': {
    condition: 'Pulmonary Fibrosis (Interstitial Lung Disease)',
    cfrReference: '38 CFR 4.97, DC 6825',

    keyDefinitions: {
      spirometry: {
        term: 'Restrictive Pattern on Spirometry',
        definition: 'Pulmonary fibrosis produces a restrictive pattern (reduced FVC, relatively preserved FEV-1/FVC). FVC % predicted and DLCO % predicted are the key rating metrics.',
        source: '38 CFR 4.97, DC 6825',
        important: true
      },
      o2: {
        term: 'Supplemental Oxygen — 100%',
        definition: 'Requirement for supplemental oxygen supports a 100% rating. Document O2 prescription, flow rate, and hours of daily use.',
        source: '38 CFR 4.97',
        important: true
      },
      burnPit: {
        term: 'Toxic Exposure / PACT Act',
        definition: 'Interstitial lung disease from toxic exposures (burn pits, asbestos, chemical agents) may qualify for PACT Act presumptive service connection. Check current presumptive list.',
        source: 'PACT Act (2022) / 38 CFR 3.320',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get full pulmonary function testing including FVC, FEV-1, and DLCO.',
        priority: 'critical'
      },
      {
        tip: 'Get HRCT chest documenting fibrotic changes and their extent.',
        priority: 'critical'
      },
      {
        tip: 'Document supplemental oxygen use — O2 requirement = 100%.',
        priority: 'critical'
      },
      {
        tip: 'Document service-connected exposure nexus: asbestos, toxic chemicals, burn pits.',
        priority: 'critical'
      },
      {
        tip: 'Track 6-minute walk test results — exertional O2 desaturation is objective severity evidence.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring full PFT results including DLCO',
      'Report supplemental oxygen use — when prescribed, how much, continuous or exertional',
      'Describe exertion limitations specifically',
      'Report all service exposures that may have contributed to lung disease',
      'Bring CT chest and any pulmonologist notes'
    ]
  },

  // ============================================
  // SARCOIDOSIS - DC 6846
  // ============================================
  '6846': {
    condition: 'Sarcoidosis',
    cfrReference: '38 CFR 4.97, DC 6846',

    keyDefinitions: {
      ratings: {
        term: 'Sarcoidosis Rating Scale',
        definition: 'Rated: 100% (with respiratory failure or cor pulmonale or progressive pulmonary disease/symptoms despite treatment), 60% (on immunosuppressive therapy), 30% (symptomatic, with medication required), 10% (asymptomatic, no medication). Non-pulmonary sarcoidosis (cardiac, neurological, ocular) rated under the relevant body system code.',
        source: '38 CFR 4.97, DC 6846',
        important: true
      },
      systemic: {
        term: 'Systemic/Extrapulmonary Sarcoidosis',
        definition: 'Sarcoidosis affecting the heart (DC 7000-7020), nerves (DC 8000s), eyes (DC 6000s), skin (DC 7800s), or other organs is rated under those body system codes — these are separate, additive ratings.',
        source: '38 CFR 4.97, DC 6846 Note'
      }
    },

    documentationTips: [
      {
        tip: 'Document all immunosuppressive medications used — steroid-requiring disease = minimum 30%.',
        priority: 'critical'
      },
      {
        tip: 'Get PFTs and chest imaging documenting pulmonary involvement.',
        priority: 'high'
      },
      {
        tip: 'Separately claim extrapulmonary manifestations (cardiac, neuro, ocular) — they are rated under different DCs.',
        priority: 'high'
      },
      {
        tip: 'Track disease progression or stability over time — progressive disease supports higher ratings.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report ALL organ systems affected by sarcoidosis',
      'List all medications including steroids and immunosuppressants',
      'Describe symptoms in each affected organ system',
      'Bring biopsy results and imaging from initial diagnosis',
      'Note if disease has progressed despite treatment'
    ]
  },

  // ============================================
  // RHINITIS - DC 6522
  // ============================================
  '6522': {
    condition: 'Rhinitis (Allergic or Vasomotor)',
    cfrReference: '38 CFR 4.97, DC 6522',

    keyDefinitions: {
      ratings: {
        term: 'Rhinitis Rating Scale',
        definition: 'Rated: 10% (polyp or enlarged turbinate OR permanent hypertrophic rhinitis without polyp), 30% (granulomatous rhinitis with nasal involvement), 50% (with atrophic rhinitis). Allergic/vasomotor rhinitis rated at 10% if chronic.',
        source: '38 CFR 4.97, DC 6522',
        important: true
      },
      sinusitisLink: {
        term: 'Rhinitis and Sinusitis',
        definition: 'Rhinitis and sinusitis often coexist. If sinusitis has developed secondary to rhinitis, file for sinusitis as a secondary condition — it may be rated separately under DC 6510-6514.',
        source: '38 CFR 3.310',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get nasal endoscopy or CT sinus documenting polyps, turbinate hypertrophy, or granulomas.',
        priority: 'high'
      },
      {
        tip: 'Document service exposure nexus: toxic fumes, chemicals, dust, burn pits.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim any secondary sinusitis — different DCs, additive rating.',
        priority: 'high'
      },
      {
        tip: 'Track medications: daily antihistamines, nasal steroids, decongestants indicate chronic disease.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report nasal symptoms: congestion, discharge, post-nasal drip, sneezing, smell loss',
      'Bring imaging showing nasal polyps or turbinate changes',
      'Describe service exposure that caused or worsened rhinitis',
      'Report any sinusitis that has developed as a consequence of rhinitis'
    ]
  },

  // ============================================
  // SINUSITIS - DC 6510-6514
  // ============================================
  '6513': {
    condition: 'Sinusitis (Chronic)',
    cfrReference: '38 CFR 4.97, DC 6510-6514',

    keyDefinitions: {
      ratings: {
        term: 'Sinusitis Rating Scale',
        definition: 'Ratings per sinus: 10% (1–2 documented incapacitating episodes/year or ≥3 non-incapacitating episodes/year), 30% (3+ incapacitating episodes/year), 50% (6+ incapacitating episodes/year). Pansinusitis (6510): 30–50%. Multiple sinuses may be rated separately.',
        source: '38 CFR 4.97, DC 6510-6514',
        important: true
      },
      incapEpisode: {
        term: 'Incapacitating Episode',
        definition: 'Requires a physician-prescribed course of antibiotics. Self-treated episodes do not count. Document every antibiotic prescription for sinusitis to establish episode count.',
        source: '38 CFR 4.97, DC 6510-6514 Note',
        important: true
      },
      multiSinus: {
        term: 'Multiple Sinuses — Multiple Ratings',
        definition: 'Each affected sinus (frontal 6512, maxillary 6513, ethmoid 6511, sphenoid 6514, pansinusitis 6510) may be rated separately. File for each sinus that is chronically affected.',
        source: '38 CFR 4.97',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document every antibiotic course prescribed for sinusitis with dates — episode count drives the rating.',
        priority: 'critical'
      },
      {
        tip: 'File for each affected sinus separately — maxillary and frontal may both be separately ratable.',
        priority: 'high'
      },
      {
        tip: 'Get CT sinus documenting which sinuses are affected and extent of disease.',
        priority: 'high'
      },
      {
        tip: 'Document service nexus: toxic exposure, facial trauma, recurrent upper respiratory infections.',
        priority: 'high'
      },
      {
        tip: 'Track any surgical history (FESS) and post-surgical recurrence.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report the number of antibiotic courses taken for sinusitis in the past year',
      'Identify which sinuses are affected — each may be rated separately',
      'Bring CT sinus results',
      'Describe symptoms: facial pain, pressure, nasal congestion, post-nasal drip, headaches',
      'Report any surgical history and whether surgery provided lasting relief'
    ],

    commonMistakes: [
      'Not documenting every antibiotic course — self-treated episodes do not count',
      'Only claiming one sinus when multiple are affected',
      'Not requesting a CT sinus for objective documentation',
      'Not claiming secondary service connection when sinusitis is caused by service-connected rhinitis'
    ]
  },

  // ============================================
  // IBS - DC 7319
  // ============================================
  '7319': {
    condition: 'Irritable Bowel Syndrome',
    cfrReference: '38 CFR 4.114, DC 7319',

    keyDefinitions: {
      ratingCriteria: {
        term: 'IBS Rating Criteria — Frequency-Based',
        definition: 'Ratings: 30% (abdominal pain related to defecation at least 1 day/week for 3 months + 2 or more ancillary symptoms), 20% (pain at least 3 days/month for 3 months + 2 or more ancillary symptoms), 10% (pain at least once in 3 months + 2 or more ancillary symptoms). Minimum is now 10% — no longer 0% for diagnosed IBS.',
        source: '38 CFR 4.114, DC 7319 (amended May 2024)',
        important: true
      },
      ancillarySymptoms: {
        term: 'Ancillary Symptoms (must have 2+)',
        definition: 'The six qualifying ancillary symptoms: (1) change in stool frequency, (2) change in stool form, (3) altered stool passage (straining/urgency), (4) mucorrhea, (5) abdominal bloating, (6) subjective distension. Must have 2+ to qualify at any rating level.',
        source: '38 CFR 4.114, DC 7319',
        important: true
      },
      may2024Update: {
        term: 'May 2024 Regulation Update — No More 0%',
        definition: 'Effective May 19, 2024: the 0% rating tier was eliminated from DC 7319. Any veteran with service-connected IBS meeting the diagnostic criteria now receives a minimum 10% rating.',
        source: '89 FR 44139 (May 19, 2024)',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Presumptive',
        definition: 'IBS is a presumptive service-connected condition for Gulf War veterans (Southwest Asia service) as a "functional gastrointestinal disorder" under 38 CFR 3.317. No nexus letter required.',
        source: '38 CFR 3.317',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Saunders v. Wilkie',
        citation: '886 F.3d 1356 (Fed. Cir. 2018)',
        year: 2018,
        holding: 'Veterans\' lay testimony about pain and functional limitations is competent evidence.',
        practicalApplication: 'Your symptom log documenting IBS pain frequency and associated symptoms is legally competent evidence.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Keep a detailed bowel symptom diary: date, pain episodes, defecation-related pain, ancillary symptoms present each day.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL six ancillary symptoms when present — you need 2+ per episode to qualify at each rating level.',
        priority: 'critical'
      },
      {
        tip: 'Count pain episodes per month and per week — frequency directly determines the rating tier.',
        priority: 'critical'
      },
      {
        tip: 'For Gulf War veterans: document service in Southwest Asia — IBS is presumptive, no nexus letter needed.',
        priority: 'critical'
      },
      {
        tip: 'Note impact on work: missed days, inability to travel far from a bathroom, reduced productivity.',
        priority: 'high'
      },
      {
        tip: 'If IBS was previously rated at 0%, file for re-evaluation — the minimum is now 10% since May 2024.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report how many days per week/month your pain is related to defecation',
      'List all ancillary symptoms you experience: urgency, bloating, mucus, altered stool',
      'Bring your symptom diary showing pain frequency over the past 3 months',
      'Gulf War veterans: confirm the examiner is noting Gulf War presumptive service connection',
      'If previously rated 0%, specifically request re-evaluation under the updated May 2024 criteria'
    ],

    commonMistakes: [
      'Not tracking daily symptoms — frequency is the entire basis of the rating',
      'Not documenting the specific ancillary symptoms that accompany pain episodes',
      'Gulf War veterans not claiming presumptive service connection',
      'Veterans still at 0% not requesting re-evaluation under the May 2024 amendment'
    ],

    ratingNote: 'Effective May 19, 2024, the 0% IBS rating was eliminated. Veterans with service-connected IBS now receive a minimum 10% rating. If you are currently rated at 0%, file a claim for increase immediately — this is not automatic and requires a new claim or reopening.'
  },

  // ============================================
  // GERD / HIATAL HERNIA - DC 7346
  // ============================================
  '7346': {
    condition: 'GERD / Hiatal Hernia',
    cfrReference: '38 CFR 4.114, DC 7346 (rates as DC 7203)',

    keyDefinitions: {
      ratesAs7203: {
        term: 'GERD Rates as Esophageal Stricture (DC 7203)',
        definition: 'Per 38 CFR 4.114, DC 7346 (hiatal hernia/GERD) is rated as esophageal stricture (DC 7203). Ratings: 0% (documented history, no daily symptoms/meds), 10% (daily medication required), 30% (dilatation ≤2/year), 50% (dilatation ≥3/year or steroid dilation or stent), 80% (recurrent stricture with aspiration/malnutrition/weight loss + surgical correction or PEG tube).',
        source: '38 CFR 4.114, DC 7346 & 7203',
        important: true
      },
      noCombo: {
        term: 'Cannot Combine with Other Digestive DCs',
        definition: 'GERD (7346) cannot be combined with IBS (7319), peptic ulcer (7304), or other DCs 7301–7329 and 7345–7350. VA assigns the single highest applicable digestive rating.',
        source: '38 CFR 4.114',
        important: true
      },
      dailyMeds: {
        term: 'Daily Medication = Minimum 10%',
        definition: 'Taking a daily PPI, H2 blocker, or other medication for GERD symptom control qualifies for a minimum 10% rating. This is the most common GERD rating tier.',
        source: '38 CFR 4.114, DC 7203',
        important: true
      },
      secondary: {
        term: 'GERD Secondary to Other Conditions',
        definition: 'GERD is commonly secondary to service-connected sleep apnea, obesity from service-connected conditions, or PTSD (which disrupts eating patterns). Secondary service connection may apply.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Document daily medication use — a PPI or H2 blocker prescribed daily = minimum 10%.',
        priority: 'critical'
      },
      {
        tip: 'Get EGD (upper endoscopy) results documenting esophagitis, Barrett\'s esophagus, or stricture — objective evidence strengthens the claim.',
        priority: 'high'
      },
      {
        tip: 'Track esophageal dilation procedures — frequency drives the higher rating tiers.',
        priority: 'high'
      },
      {
        tip: 'Document GERD-related complications: aspiration pneumonia, documented weight loss.',
        priority: 'high'
      },
      {
        tip: 'Note secondary connection to sleep apnea or PTSD if applicable.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Confirm you are taking daily prescription medication for GERD — this is the 10% threshold',
      'Bring endoscopy results documenting esophageal changes',
      'Report if you have needed esophageal dilations and how often',
      'Describe symptoms: heartburn frequency, regurgitation, dysphagia, sleep disruption',
      'Report any weight loss or aspiration episodes'
    ],

    commonMistakes: [
      'Accepting 0% when taking daily GERD medication — daily meds = 10% minimum',
      'Not getting endoscopy to objectively document esophageal damage',
      'Not documenting esophageal dilation procedures if performed'
    ]
  },

  // ============================================
  // PEPTIC ULCER DISEASE - DC 7304
  // ============================================
  '7304': {
    condition: 'Peptic Ulcer Disease',
    cfrReference: '38 CFR 4.114, DC 7304',

    keyDefinitions: {
      ratingScale: {
        term: 'Peptic Ulcer Rating Scale',
        definition: 'Ratings: 0% (history documented by endoscopy/imaging), 20% (episodes of pain/nausea/vomiting ≥3 days duration, ≤3 times/year, managed by daily meds), 40% (same but ≥4 times/year), 60% (continuous abdominal pain with vomiting/bleeding/melena + hospitalization ≥1/year), 100% (post-op for perforation/hemorrhage for 3 months).',
        source: '38 CFR 4.114, DC 7304',
        important: true
      },
      hPylori: {
        term: 'H. pylori Service Connection',
        definition: 'H. pylori infection contracted during military service (contaminated food/water overseas) can be the basis for service-connecting peptic ulcer disease. Document overseas service where H. pylori was endemic.',
        source: '38 CFR 3.304',
        important: true
      },
      nsaids: {
        term: 'NSAID-Induced Ulcer — Secondary SC',
        definition: 'PUD caused by NSAIDs taken for a service-connected musculoskeletal condition may be rated as secondary service connection. Document the NSAID use and the service-connected condition requiring it.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Get endoscopy (EGD) documenting the ulcer — imaging or scope is required for rating.',
        priority: 'critical'
      },
      {
        tip: 'Document episode frequency: how many times per year do you have multi-day pain/nausea episodes?',
        priority: 'critical'
      },
      {
        tip: 'Track hospitalizations for GI bleeding, perforation, or severe pain — these support 60%+.',
        priority: 'high'
      },
      {
        tip: 'If PUD is from NSAIDs taken for a service-connected condition, file secondary SC claim.',
        priority: 'high'
      },
      {
        tip: 'Document H. pylori diagnosis and overseas service locations for primary SC nexus.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring endoscopy results confirming the ulcer diagnosis',
      'Report episode frequency and duration over the past year',
      'Report any hospitalizations for GI bleeding or severe symptoms',
      'Describe which medications you take daily for ulcer management',
      'Mention if ulcer developed after starting NSAIDs for a service-connected condition'
    ]
  },

  // ============================================
  // CIRRHOSIS - DC 7312
  // ============================================
  '7312': {
    condition: 'Cirrhosis of the Liver',
    cfrReference: '38 CFR 4.114, DC 7312',

    keyDefinitions: {
      meld: {
        term: 'MELD Score — Primary Rating Metric',
        definition: 'Model for End-Stage Liver Disease (MELD) score drives the rating: 0% (history only), 10% (MELD >6-9), 30% (MELD 10-11 or portal hypertension with symptoms), 60% (MELD >11-14 or variceal hemorrhage/hepatic encephalopathy), 100% (MELD ≥15 or continuous debilitation with ascites, SBP, encephalopathy, coagulopathy, variceal hemorrhage, or hepatopulmonary/hepatorenal syndrome).',
        source: '38 CFR 4.114, DC 7312',
        important: true
      },
      biochemical: {
        term: 'Lab Evidence Required',
        definition: 'Biochemical studies, imaging, or biopsy must confirm liver dysfunction including hyponatremia, thrombocytopenia, and/or coagulopathy. Current lab results are essential.',
        source: '38 CFR 4.114, DC 7312 Note 2',
        important: true
      },
      secondary: {
        term: 'Secondary Service Connection',
        definition: 'Cirrhosis secondary to service-connected Hepatitis B or C is separately ratable. Alcohol-related cirrhosis is generally not service-connectable unless a service nexus (service-related trauma causing drinking) can be established.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Get current MELD score calculated from labs — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Document all complications: ascites requiring paracentesis, hepatic encephalopathy episodes, variceal bleeds.',
        priority: 'critical'
      },
      {
        tip: 'Get liver biopsy or imaging (ultrasound, CT, MRI) documenting cirrhosis stage.',
        priority: 'high'
      },
      {
        tip: 'If secondary to service-connected Hepatitis B or C, explicitly document secondary SC claim.',
        priority: 'critical'
      },
      {
        tip: 'Track all hospitalizations for liver-related complications.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring current lab results including INR, bilirubin, creatinine, sodium — these calculate MELD',
      'Report all complications: ascites, confusion episodes, bleeding history',
      'Bring liver imaging or biopsy results',
      'Report all daily medications for liver disease management',
      'If secondary to Hepatitis B or C, confirm the examiner is noting the service-connected nexus'
    ],

    ratingNote: 'If cirrhosis is secondary to service-connected hepatitis, ensure both conditions are service-connected. The MELD score is calculated from: serum creatinine, bilirubin, INR, and sodium. Obtain these labs close to your C&P exam date.'
  },

  // ============================================
  // GASTRITIS - DC 7307
  // ============================================
  '7307': {
    condition: 'Chronic Gastritis',
    cfrReference: '38 CFR 4.114, DC 7307 (rates as DC 7304)',

    keyDefinitions: {
      ratesAsPUD: {
        term: 'Gastritis Rates as Peptic Ulcer Disease',
        definition: 'Per 38 CFR 4.114, chronic gastritis (DC 7307) is rated using the peptic ulcer disease criteria (DC 7304). Includes H. pylori infection, drug-induced gastritis, Zollinger-Ellison syndrome, and portal-hypertensive gastropathy.',
        source: '38 CFR 4.114, DC 7307',
        important: true
      },
      hPylori: {
        term: 'H. pylori and Overseas Service',
        definition: 'H. pylori gastritis contracted during overseas service is service-connectable. Document service locations in endemic regions and the date of H. pylori diagnosis.',
        source: '38 CFR 3.304',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get EGD documenting chronic gastritis — objective endoscopic evidence is required.',
        priority: 'critical'
      },
      {
        tip: 'Document H. pylori positive test result if applicable and overseas service nexus.',
        priority: 'high'
      },
      {
        tip: 'Track episode frequency: multi-day pain/nausea episodes per year drives the rating.',
        priority: 'critical'
      },
      {
        tip: 'Document all daily medications used to manage gastritis.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring endoscopy results confirming gastritis',
      'Report episode frequency — how many multi-day symptomatic episodes per year?',
      'Report daily medication use',
      'Describe overseas service where H. pylori may have been contracted'
    ]
  },

  // ============================================
  // PANCREATITIS - DC 7347
  // ============================================
  '7347': {
    condition: 'Chronic Pancreatitis',
    cfrReference: '38 CFR 4.114, DC 7347',

    keyDefinitions: {
      ratingScale: {
        term: 'Pancreatitis Rating Scale — Hospitalization-Driven',
        definition: 'Ratings: 30% (at least 1 episode/year of abdominal/back pain requiring outpatient treatment), 60% (≥3 pain episodes/year + at least 1 hospitalization/year), 100% (daily episodes requiring ≥3 hospitalizations/year + physician pain management + maldigestion requiring dietary restriction and enzyme supplementation).',
        source: '38 CFR 4.114, DC 7347',
        important: true
      },
      hospitalization: {
        term: 'Hospitalizations Drive the Rating',
        definition: 'The number of hospitalizations per year is the key escalation factor for pancreatitis ratings. Document every hospitalization for pain, complications, or tube feeding.',
        source: '38 CFR 4.114, DC 7347',
        important: true
      },
      enzymes: {
        term: 'Pancreatic Enzyme Supplementation',
        definition: 'Malabsorption requiring dietary restriction AND pancreatic enzyme supplements (Creon, Zenpep, etc.) is required for the 100% rating. Document both elements.',
        source: '38 CFR 4.114, DC 7347'
      }
    },

    documentationTips: [
      {
        tip: 'Track hospitalizations for pancreatitis per year — this is the critical escalation factor.',
        priority: 'critical'
      },
      {
        tip: 'Document pancreatic enzyme supplementation and dietary restrictions if present.',
        priority: 'critical'
      },
      {
        tip: 'Get imaging (CT/MRI/MRCP) documenting pancreatic changes: atrophy, calcifications, duct dilation.',
        priority: 'high'
      },
      {
        tip: 'Document pain management: opioid prescriptions for chronic pancreatitis pain support severity.',
        priority: 'high'
      },
      {
        tip: 'Track complications: pseudocysts, intestinal obstruction, ascites — these qualify for the 60% tier.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report exact number of hospitalizations for pancreatitis in the past year',
      'Describe daily pain severity and management',
      'Report pancreatic enzyme use and dietary restrictions',
      'Bring CT or MRI results showing pancreatic changes',
      'Mention complications: pseudocysts, weight loss, diabetes from pancreatic insufficiency'
    ],

    commonMistakes: [
      'Not tracking hospitalization dates and reasons — this is the key rating metric',
      'Not documenting enzyme supplementation which is required for 100%',
      'Not claiming secondary diabetes from pancreatic insufficiency'
    ]
  },

  // ============================================
  // BILIARY TRACT - DC 7314
  // ============================================
  '7314': {
    condition: 'Chronic Biliary Tract Disease',
    cfrReference: '38 CFR 4.114, DC 7314',

    keyDefinitions: {
      ratingScale: {
        term: 'Biliary Tract Rating Scale',
        definition: 'Rated based on attacks and treatment: 10% (symptomatic cholelithiasis or chronic cholecystitis without attacks), 30% (1–2 attacks with right upper quadrant pain, nausea, vomiting in past year OR requiring biliary stricture dilation 1–2 times/year), 50% (≥3 attacks or ≥3 dilations/year or requiring cholecystectomy), 70% (requiring liver transplantation).',
        source: '38 CFR 4.114, DC 7314',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document RUQ attack frequency: each episode of pain, nausea, and vomiting is a qualifying attack.',
        priority: 'critical'
      },
      {
        tip: 'Get ultrasound or HIDA scan documenting gallstones or biliary disease.',
        priority: 'high'
      },
      {
        tip: 'Track biliary dilation procedures if performed — frequency drives higher ratings.',
        priority: 'high'
      },
      {
        tip: 'Document ER visits for biliary colic — objective records of attack severity.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report attack frequency: how many RUQ pain episodes in the past year?',
      'Bring imaging (ultrasound, HIDA scan) results',
      'Report ER visits or hospitalizations for biliary colic',
      'Mention any biliary procedures or surgery'
    ]
  },

  // ============================================
  // HERNIA - DC 7338
  // ============================================
  '7338': {
    condition: 'Hernia (Inguinal, Femoral, Ventral, Umbilical, Incisional)',
    cfrReference: '38 CFR 4.114, DC 7338',

    keyDefinitions: {
      ratingScale: {
        term: 'Hernia Rating Scale (2024 Revised)',
        definition: 'Ratings for irreparable hernia present ≥12 months: 100% (size ≥15 cm + pain with ≥3 of 4 activities: bending, ADLs, walking, stairs), 60% (size ≥15 cm + pain with 2 of 4 activities), 40% (size 5–15 cm + pain with ≥3 activities), 30% (size 5–15 cm + pain with 2 activities), 20% (size <5 cm + pain with ≥3 activities), 10% (size <5 cm + pain with 2 activities). Repaired hernia with no recurrence: 0%.',
        source: '38 CFR 4.114, DC 7338 (revised 2021)',
        important: true
      },
      irreparable: {
        term: '"Irreparable" Hernia',
        definition: 'Hernia that cannot be surgically corrected, OR recurrent hernia after repair. A hernia that could be repaired but the veteran chooses not to repair is NOT irreparable for rating purposes.',
        source: '38 CFR 4.114, DC 7338',
        important: true
      },
      postSurgery: {
        term: 'Post-Surgical Incisional Hernia',
        definition: 'Incisional hernias (DC 7338) from prior surgery are service-connectable as residuals of service-connected surgery or injury. Document the surgical history and service-connected basis.',
        source: '38 CFR 4.114, DC 7338'
      }
    },

    documentationTips: [
      {
        tip: 'Measure hernia size precisely — size category (< 5 cm, 5–15 cm, ≥15 cm) determines the maximum possible rating.',
        priority: 'critical'
      },
      {
        tip: 'Document pain with specific activities: bending, ADLs, walking, and climbing stairs — pain with each is required.',
        priority: 'critical'
      },
      {
        tip: 'Get imaging (CT or ultrasound) documenting hernia size and type.',
        priority: 'high'
      },
      {
        tip: 'Document if hernia is irreparable — surgical consult note stating inoperability is needed.',
        priority: 'high'
      },
      {
        tip: 'Track functional limitations: work restrictions, lifting limits, activities avoided.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report pain with ALL four rated activities: bending over, ADLs, walking, climbing stairs',
      'Bring imaging showing hernia size',
      'If hernia is irreparable, bring the surgical consult confirming inoperability',
      'Describe work and activity restrictions from the hernia',
      'Report if hernia has recurred after previous repair'
    ]
  },

  // ============================================
  // PERITONEAL ADHESIONS - DC 7301
  // ============================================
  '7301': {
    condition: 'Peritoneal Adhesions',
    cfrReference: '38 CFR 4.114, DC 7301',

    keyDefinitions: {
      ratingScale: {
        term: 'Peritoneal Adhesions Rating Scale',
        definition: 'Rated: 10% (occasional episodes of pain with some nausea or vomiting), 20% (frequent episodes of pain with nausea or vomiting requiring prescription medication and/or dietary modification), 30% (severe episodes of pain with nausea or vomiting, weight loss, and impaired health), 50% (obstruction requiring surgery or hospitalization ≥2/year).',
        source: '38 CFR 4.114, DC 7301',
        important: true
      },
      surgicalHistory: {
        term: 'Service-Connected Surgical History',
        definition: 'Peritoneal adhesions are almost always secondary to prior abdominal surgery. If the original surgery was service-connected (appendectomy, trauma repair, etc.), adhesions are secondarily service-connectable.',
        source: '38 CFR 3.310',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the service-connected surgical history that caused the adhesions.',
        priority: 'critical'
      },
      {
        tip: 'Track episode frequency: how many obstructive or severe pain episodes per year?',
        priority: 'critical'
      },
      {
        tip: 'Document any hospitalizations for small bowel obstruction from adhesions.',
        priority: 'high'
      },
      {
        tip: 'Get imaging (CT abdomen) during a symptomatic episode if possible.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report episode frequency and severity',
      'Describe the service-connected surgery that caused the adhesions',
      'Report hospitalizations for bowel obstruction',
      'Mention dietary modifications required to manage adhesion symptoms'
    ]
  },

  // ============================================
  // ESOPHAGEAL CONDITIONS - DC 7203 / 7204
  // ============================================
  '7203': {
    condition: 'Esophageal Stricture / GERD Complications',
    cfrReference: '38 CFR 4.114, DC 7203',

    keyDefinitions: {
      ratingScale: {
        term: 'Esophageal Stricture Rating Scale',
        definition: 'Ratings: 0% (documented history, no daily symptoms), 10% (daily medication required), 30% (dilation ≤2/year), 50% (dilation ≥3/year OR steroid dilation ≥1/year OR stent placement), 80% (recurrent/refractory stricture with aspiration/malnutrition/weight loss + surgery or PEG tube). Endoscopy documentation required.',
        source: '38 CFR 4.114, DC 7203',
        important: true
      },
      barrettsEsophagus: {
        term: "Barrett's Esophagus",
        definition: "Barrett's esophagus (pre-cancerous change from chronic GERD) may be rated under DC 7203 when it causes dysphagia or requires ongoing treatment. Document endoscopy confirming Barrett's.",
        source: '38 CFR 4.114, DC 7203'
      }
    },

    documentationTips: [
      {
        tip: 'Get endoscopy documenting stricture — endoscopic evidence is required for rating.',
        priority: 'critical'
      },
      {
        tip: 'Track dilation procedures: frequency per year drives the rating from 10% to 50%.',
        priority: 'critical'
      },
      {
        tip: 'Document dysphagia: difficulty swallowing solids, liquids, or both.',
        priority: 'high'
      },
      {
        tip: 'Document weight loss if present — substantial weight loss escalates to 80%.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring endoscopy reports confirming stricture',
      'Report number of dilations performed in the past year',
      'Describe dysphagia: which foods/liquids cause problems?',
      'Report any weight loss since onset of esophageal symptoms',
      'Mention daily medications including PPIs'
    ]
  },

  // ============================================
  // POSTGASTRECTOMY SYNDROME - DC 7308
  // ============================================
  '7308': {
    condition: 'Postgastrectomy Syndrome',
    cfrReference: '38 CFR 4.114, DC 7308 (rates as DC 7303)',

    keyDefinitions: {
      ratesAs7303: {
        term: 'Rates as Chronic Complications of Upper GI Surgery (DC 7303)',
        definition: 'Postgastrectomy syndrome rates under DC 7303 for chronic upper GI surgery complications. Symptoms: dumping syndrome, hypoglycemia, diarrhea, malabsorption, weight loss.',
        source: '38 CFR 4.114, DC 7308',
        important: true
      },
      dumpingSyndrome: {
        term: 'Dumping Syndrome',
        definition: 'Rapid gastric emptying after gastrectomy causing early dumping (nausea, diarrhea, palpitations shortly after eating) or late dumping (hypoglycemia 1–3 hours after eating). Both are ratable symptoms.',
        source: '38 CFR 4.114, DC 7308',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document dumping syndrome episodes with specific symptoms: timing, triggers, severity.',
        priority: 'high'
      },
      {
        tip: 'Track weight loss — significant weight loss supports higher ratings.',
        priority: 'high'
      },
      {
        tip: 'Document all dietary restrictions required to manage postgastrectomy symptoms.',
        priority: 'medium'
      },
      {
        tip: 'Note malabsorption lab findings: vitamin deficiencies, anemia.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Describe dumping syndrome symptoms in detail: what happens after eating and when',
      'Report weight since surgery — document any significant unintentional weight loss',
      'List dietary restrictions required to manage symptoms',
      'Report nutritional deficiencies requiring supplementation'
    ]
  },

  // ============================================
  // INTESTINAL FISTULA - DC 7330
  // ============================================
  '7330': {
    condition: 'Intestinal Fistula',
    cfrReference: '38 CFR 4.114, DC 7330',

    keyDefinitions: {
      ratingScale: {
        term: 'Intestinal Fistula Rating Scale',
        definition: 'Rated: 30% (small fistula not involving loss of sphincter control), 60% (large fistula or involving sphincter control), 100% (multiple fistulas or involving complete loss of sphincter control with fecal incontinence).',
        source: '38 CFR 4.114, DC 7330',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get imaging or surgical documentation of fistula type, size, and location.',
        priority: 'critical'
      },
      {
        tip: 'Document sphincter involvement if present — this escalates the rating significantly.',
        priority: 'critical'
      },
      {
        tip: 'Track fistula output and any drainage management requirements.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring imaging or surgical records documenting the fistula',
      'Report sphincter function — does the fistula affect bowel control?',
      'Describe daily impact: output management, odor, social limitations',
      'Report any hospitalizations for fistula management'
    ]
  },

  // ============================================
  // HEMORRHOIDS - DC 7336
  // ============================================
  '7336': {
    condition: 'Hemorrhoids',
    cfrReference: '38 CFR 4.114, DC 7336',

    keyDefinitions: {
      ratingScale: {
        term: 'Hemorrhoid Rating Scale',
        definition: 'Rated: 0% (without bleeding or excoriation), 10% (large or thrombotic, irreducible, with excessive redundant tissue, evidencing frequent recurrence), 20% (with persistent bleeding and with secondary anemia, or with fistula).',
        source: '38 CFR 4.114, DC 7336',
        important: true
      },
      anemia: {
        term: 'Secondary Anemia Escalates Rating',
        definition: 'Hemorrhoids causing persistent bleeding with documented secondary anemia qualifies for a 20% rating. Get CBC labs documenting anemia.',
        source: '38 CFR 4.114, DC 7336',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document hemorrhoid characteristics: size, prolapse, thrombosis, reducibility.',
        priority: 'high'
      },
      {
        tip: 'Get CBC to document anemia if persistent bleeding is present — anemia = 20% rating.',
        priority: 'critical'
      },
      {
        tip: 'Document bleeding episodes: frequency, amount, duration.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report bleeding frequency and amount',
      'Describe hemorrhoid characteristics: do they prolapse? Are they reducible?',
      'Bring CBC results if you have persistent bleeding',
      'Report pain and functional limitations from hemorrhoids'
    ]
  },

  // ============================================
  // ULCERATIVE COLITIS / IBD - DC 7323
  // ============================================
  '7323': {
    condition: 'Ulcerative Colitis / Inflammatory Bowel Disease',
    cfrReference: '38 CFR 4.114, DC 7323',

    keyDefinitions: {
      ratingScale: {
        term: 'UC/IBD Rating Scale',
        definition: 'Rated: 10% (moderate — with infrequent exacerbations), 30% (moderately severe — with frequent exacerbations), 60% (severe — with numerous attacks per year and prolonged remissions OR hospitalization ≥1/year), 100% (pronounced — with constant treatment + malnutrition + anemia + general health impairment).',
        source: '38 CFR 4.114, DC 7323',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Presumptive / Agent Orange',
        definition: 'IBD (Crohn\'s disease, UC) is on the Agent Orange presumptive conditions list and may also qualify as a Gulf War illness for veterans with qualifying service.',
        source: '38 CFR 3.309(e) / 3.317',
        important: true
      },
      extraintestinal: {
        term: 'Extraintestinal Manifestations',
        definition: 'IBD causes extraintestinal complications (arthritis, uveitis, skin conditions, liver disease) that may be rated separately under their own DCs as secondary conditions.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Document exacerbation frequency: how many flares per year and their duration.',
        priority: 'critical'
      },
      {
        tip: 'Get colonoscopy documenting disease extent and activity.',
        priority: 'critical'
      },
      {
        tip: 'Track hospitalizations per year — this is the escalation factor to 60%.',
        priority: 'high'
      },
      {
        tip: 'Document nutritional status: weight, albumin, anemia labs.',
        priority: 'high'
      },
      {
        tip: 'Separately claim extraintestinal manifestations: IBD arthritis, uveitis, PSC.',
        priority: 'high'
      },
      {
        tip: 'Agent Orange veterans: IBD is presumptive — no nexus letter needed.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report flare frequency and severity',
      'Bring colonoscopy results',
      'Report hospitalizations and ER visits for IBD in the past year',
      'Describe nutritional impact: weight loss, dietary restrictions',
      'Report all IBD medications including biologics — biologic therapy signals severe disease',
      'Agent Orange veterans: confirm presumptive SC is being applied'
    ]
  },

  // ============================================
  // DIABETES MELLITUS - DC 7913
  // ============================================
  '7913': {
    condition: 'Diabetes Mellitus',
    cfrReference: '38 CFR 4.119, DC 7913',

    keyDefinitions: {
      ratingScale: {
        term: 'Diabetes Rating Scale',
        definition: 'Ratings: 10% (diet control only), 20% (oral hypoglycemic agent + restricted diet OR insulin + restricted diet), 40% (insulin + restricted diet + activity regulation), 60% (insulin + diet + activity regulation + 1–2 hospitalizations/year for ketoacidosis/hypoglycemia OR twice-monthly provider visits + noncompensable complications), 100% (insulin + diet + activity regulation + ≥3 hospitalizations/year OR weekly provider visits + progressive weight/strength loss OR compensable complications).',
        source: '38 CFR 4.119, DC 7913',
        important: true
      },
      separateComplications: {
        term: 'Compensable Complications — Rate Separately',
        definition: 'Compensable complications of diabetes (peripheral neuropathy, erectile dysfunction, kidney disease, eye disease, CAD) must be rated SEPARATELY from the diabetes rating — unless they are the basis for a 100% evaluation. This is the most commonly missed opportunity in diabetic claims.',
        source: '38 CFR 4.119, DC 7913 Note 1',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: 'Type 2 Diabetes Mellitus is a presumptive service-connected condition for veterans exposed to herbicide agents (Agent Orange, TCDD). No nexus letter required for Vietnam veterans, Korea DMZ veterans, Thailand veterans, and others with qualifying herbicide exposure.',
        source: '38 CFR 3.309(e)',
        important: true
      },
      activityRegulation: {
        term: 'Activity Regulation Requirement',
        definition: 'The 40%–100% tiers require "regulation of activities" — meaning your physician has advised you to avoid strenuous occupational and recreational activities. This must be documented in your medical records to qualify.',
        source: '38 CFR 4.119, DC 7913'
      }
    },

    caseLaw: [
      {
        case: 'Nehmer v. VA',
        citation: 'Nehmer litigation (1991, ongoing)',
        year: 1991,
        holding: 'Veterans with herbicide exposure who develop presumptive conditions are entitled to retroactive benefits to the date of diagnosis or claim.',
        practicalApplication: 'Vietnam veterans diagnosed with Type 2 DM before claiming — retroactive pay may apply to the date of diagnosis.',
        important: true
      },
      {
        case: 'Boggs v. Peake',
        citation: '520 F.3d 1330 (Fed. Cir. 2008)',
        year: 2008,
        holding: 'Secondary conditions caused by service-connected disabilities are themselves service-connected.',
        practicalApplication: 'Peripheral neuropathy, nephropathy, retinopathy, and ED from service-connected diabetes are all separately ratable under 38 CFR 3.310.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'For Agent Orange veterans: document all dates of service in Vietnam, Korea DMZ, Thailand, or other qualifying locations — Type 2 DM is presumptive.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim ALL diabetic complications: peripheral neuropathy (both legs), erectile dysfunction, nephropathy, retinopathy, CAD — each is separately ratable.',
        priority: 'critical'
      },
      {
        tip: 'Get your physician to document activity restrictions in your chart — this is required for the 40%+ tiers.',
        priority: 'critical'
      },
      {
        tip: 'Track hospitalizations for ketoacidosis or hypoglycemia per year — 1–2 = 60%, 3+ = 100%.',
        priority: 'high'
      },
      {
        tip: 'Document insulin regimen: number of daily injections, type of insulin, doses — more injections reflect severity.',
        priority: 'high'
      },
      {
        tip: 'Keep records of all provider visits specifically for diabetic management — twice monthly = 60%, weekly = 100%.',
        priority: 'high'
      }
    ],

    examTips: [
      'List all diabetic medications: insulin type, doses, frequency; oral agents; dietary restrictions',
      'Report hospitalizations for low or high blood sugar in the past year',
      'Confirm your doctor has advised activity restriction — ask for this in writing',
      'Report ALL diabetic complications: feet, eyes, kidneys, heart, sexual function',
      'Vietnam/Agent Orange veterans: confirm examiner is noting the presumptive service connection',
      'Do NOT allow the examiner to bundle complications into the diabetes rating — each must be evaluated separately'
    ],

    commonMistakes: [
      'Not claiming diabetic peripheral neuropathy, nephropathy, retinopathy, and ED as separate secondary conditions',
      'Agent Orange veterans not claiming presumptive service connection for Type 2 DM',
      'Not having activity restriction documented by your treating physician',
      'Accepting a lower rating because complications are bundled instead of rated separately'
    ],

    ratingNote: 'The key to maximizing a diabetes claim is claiming ALL secondary conditions separately. A veteran with diabetes, bilateral peripheral neuropathy, erectile dysfunction, and hypertension may have 5+ separate service-connected ratings from a single primary condition.'
  },

  // ============================================
  // SCARS - DC 7800-7805
  // ============================================
  '7800': {
    condition: 'Scars — Head, Face, or Neck (Disfigurement)',
    cfrReference: '38 CFR 4.118, DC 7800',

    keyDefinitions: {
      dc7800: {
        term: 'DC 7800 — Head, Face, Neck Disfigurement',
        definition: 'Rated on number of disfiguring characteristics: 10% (1 characteristic), 20% (2 characteristics), 30% (3 characteristics), 50% (4 characteristics), 80% (5 characteristics), 100% (6+ characteristics or total area loss of both ears or nose). Characteristics include: tissue loss, gross distortion, asymmetry, skin texture change, color change, visible defect.',
        source: '38 CFR 4.118, DC 7800',
        important: true
      },
      dc7801: {
        term: 'DC 7801 — Body Scars with Soft Tissue Damage',
        definition: 'Scars not on head/face/neck, associated with underlying soft tissue damage: 10% (12–71 sq in), 20% (12–71 sq in per area), 30% (72–143 sq in), 40% (≥144 sq in).',
        source: '38 CFR 4.118, DC 7801',
        important: true
      },
      dc7804: {
        term: 'DC 7804 — Unstable or Painful Scars',
        definition: 'Rated on number of unstable/painful scars regardless of location: 10% (1–2 scars), 20% (3–4 scars), 30% (5+ scars). If any scar is BOTH unstable AND painful, add 10% to the total. Can be rated IN ADDITION to DC 7800/7801/7802.',
        source: '38 CFR 4.118, DC 7804',
        important: true
      },
      additive: {
        term: 'Multiple Scar DCs Are Additive',
        definition: 'Unlike digestive conditions, scar DCs can be combined. A veteran may receive separate ratings under DC 7800 (disfigurement), DC 7801 (soft tissue), AND DC 7804 (unstable/painful) for the same scarring.',
        source: '38 CFR 4.118, DC 7805 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Photograph all scars — color, texture, size, and location. Visual documentation is essential.',
        priority: 'critical'
      },
      {
        tip: 'Measure scar area in square inches for body scars (DC 7801/7802) — area directly drives the rating.',
        priority: 'critical'
      },
      {
        tip: 'Document each disfiguring characteristic for face/neck scars (DC 7800) — count them individually.',
        priority: 'critical'
      },
      {
        tip: 'Document pain and instability (skin breakdown) separately for DC 7804 — these are additive ratings.',
        priority: 'high'
      },
      {
        tip: 'Claim both disfigurement AND unstable/painful ratings if applicable — they are separate, combinable DCs.',
        priority: 'critical'
      },
      {
        tip: 'Get dermatology evaluation if scar characteristics are complex or involve multiple DCs.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Show the examiner every scar from service-connected injuries or surgeries',
      'Point out each disfiguring characteristic for face/neck scars individually',
      'Report which scars are painful — a scar that hurts to touch or in cold weather qualifies',
      'Report which scars lose their skin covering (unstable scars)',
      'Confirm multiple scar DCs are each being evaluated, not just a single code'
    ],

    commonMistakes: [
      'Not claiming DC 7804 (painful/unstable) in addition to DC 7800/7801',
      'Not measuring body scar areas — area in square inches directly determines the rating tier',
      'Not documenting each disfiguring characteristic of face/neck scars individually',
      'Thinking scar ratings are mutually exclusive — they are additive'
    ]
  },

  // ============================================
  // GENERAL SKIN FORMULA — ECZEMA DC 7806,
  // PSORIASIS DC 7816, DISCOID LUPUS DC 7809,
  // SKIN INFECTIONS DC 7820, DERMATOPHYTOSIS DC 7813
  // ============================================
  '7806': {
    condition: 'Eczema / Dermatitis',
    cfrReference: '38 CFR 4.118, DC 7806',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula for the Skin',
        definition: 'DCs 7806, 7809, 7813–7816, 7820–7822, 7824 all use the same General Rating Formula: 0% (<5% body or exposed area affected, topical therapy only), 10% (5–20% body or 5–20% exposed areas, or intermittent systemic therapy <6 weeks/year), 30% (20–40% body or exposed areas, or systemic therapy ≥6 weeks but not constant), 60% (>40% body or exposed areas, or constant/near-constant systemic therapy).',
        source: '38 CFR 4.118, General Rating Formula',
        important: true
      },
      systemicTherapy: {
        term: 'Systemic Therapy — The Key Escalation Factor',
        definition: 'The type and duration of therapy drives the rating independently of body surface area. Constant systemic therapy (steroids, biologics, immunosuppressants, PUVA) = 60% regardless of BSA affected. This is frequently missed.',
        source: '38 CFR 4.118, General Rating Formula',
        important: true
      },
      biologics: {
        term: 'Biologics = Systemic Therapy',
        definition: 'Biologic medications (dupilumab, tralokinumab, etc.) qualify as systemic immunosuppressive therapy for rating purposes. If on a biologic, document it explicitly as systemic therapy.',
        source: '38 CFR 4.118',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document body surface area (BSA) affected using the Rule of Nines or physician estimate — percentage drives the rating.',
        priority: 'critical'
      },
      {
        tip: 'List ALL systemic therapies used: oral steroids, biologics, methotrexate, cyclosporine, PUVA — duration per year is key.',
        priority: 'critical'
      },
      {
        tip: 'Document constant vs. intermittent systemic therapy — constant use = 60% independently of BSA.',
        priority: 'critical'
      },
      {
        tip: 'Track flares and whether they require systemic treatment each time.',
        priority: 'high'
      },
      {
        tip: 'Photograph skin during a flare — exam-day presentation may not reflect typical severity.',
        priority: 'high'
      },
      {
        tip: 'Document service nexus: chemical exposure, occupational contact, stress from service conditions.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report BSA affected during a typical flare, not just on exam day (which may be well-controlled)',
      'List all systemic medications and how many weeks per year you take them',
      'Bring photos of skin during flares if possible',
      'Report all systemic treatments — biologics count as systemic immunosuppressive therapy',
      'Describe the impact on daily activities: sleep disruption, inability to work, social impact'
    ],

    commonMistakes: [
      'Not documenting systemic therapy duration per year — this independently drives the rating',
      'Presenting well-controlled skin at exam without documenting typical flare severity',
      'Not counting biologics as systemic immunosuppressive therapy',
      'Underestimating BSA — get your dermatologist to document percentage in the chart'
    ]
  },

  '7816': {
    condition: 'Psoriasis',
    cfrReference: '38 CFR 4.118, DC 7816',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula — Same as Eczema',
        definition: 'Psoriasis uses the same skin General Rating Formula as DC 7806: 0%/10%/30%/60% based on BSA affected and systemic therapy duration. Psoriatic arthritis and other complications are rated SEPARATELY under the appropriate DC.',
        source: '38 CFR 4.118, DC 7816',
        important: true
      },
      psoriaticArthritis: {
        term: 'Psoriatic Arthritis — Separate Rating',
        definition: 'Psoriatic arthritis is rated separately from the skin condition, under the musculoskeletal system (DC 5002 or applicable joint DCs). File for both the skin condition and the arthritis.',
        source: '38 CFR 4.118, DC 7816 Note',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange / Herbicide Exposure',
        definition: 'Psoriasis is associated with herbicide agent exposure for Vietnam veterans. Document the exposure and diagnosis timing for possible presumptive or nexus-based service connection.',
        source: '38 CFR 3.309'
      }
    },

    documentationTips: [
      {
        tip: 'Document BSA affected by psoriasis — percentage directly drives the rating.',
        priority: 'critical'
      },
      {
        tip: 'List systemic treatments: biologics (adalimumab, secukinumab, etc.), methotrexate, oral steroids, PUVA.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim psoriatic arthritis if present — it is rated under musculoskeletal DCs, not the skin formula.',
        priority: 'critical'
      },
      {
        tip: 'Document nail and scalp involvement — these are separately ratable complications per the DC 7816 note.',
        priority: 'medium'
      },
      {
        tip: 'Photograph skin during flares to document typical disease burden beyond exam-day presentation.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report total BSA affected including scalp, nails, and intertriginous areas',
      'List all biologic and systemic therapies — these are the key rating escalators',
      'Report psoriatic arthritis symptoms separately',
      'Bring photos of skin during flare if well-controlled at exam',
      'Describe impact on daily life: joint pain, inability to work with hands, sleep disruption'
    ]
  },

  '7809': {
    condition: 'Discoid Lupus Erythematosus',
    cfrReference: '38 CFR 4.118, DC 7809',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula — Same as Eczema',
        definition: 'Discoid lupus uses the General Skin Rating Formula: BSA affected and systemic therapy duration. Not to be combined with DC 6350 (SLE).',
        source: '38 CFR 4.118, DC 7809',
        important: true
      },
      notCombinedWithSLE: {
        term: 'Cannot Combine with SLE (DC 6350)',
        definition: 'DC 7809 (discoid lupus) explicitly cannot be combined with DC 6350 (systemic lupus). If SLE is present, rate under DC 6350 — whichever gives the higher rating.',
        source: '38 CFR 4.118, DC 7809',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document BSA affected by discoid lesions including scalp scarring.',
        priority: 'high'
      },
      {
        tip: 'If systemic lupus has developed, ensure a DC 6350 claim is filed — it may produce a higher rating.',
        priority: 'critical'
      },
      {
        tip: 'Document systemic therapy if used: hydroxychloroquine, oral steroids, other immunosuppressants.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report location and extent of discoid lesions — face, scalp, and body',
      'Report all medications including hydroxychloroquine',
      'If symptoms beyond skin are present, report them — may indicate systemic lupus (DC 6350)'
    ]
  },

  // ============================================
  // SYSTEMIC LUPUS ERYTHEMATOSUS - DC 6350
  // ============================================
  '6350': {
    condition: 'Systemic Lupus Erythematosus (SLE)',
    cfrReference: '38 CFR 4.88b, DC 6350',

    keyDefinitions: {
      ratingScale: {
        term: 'SLE Rating Scale',
        definition: 'Ratings: 10% (symptomatic in past 2 years or 1–2 exacerbations/year), 60% (2–3 exacerbations/year lasting a week or more), 100% (acute, frequent exacerbations producing severe health impairment). Alternatively, evaluate by combining ratings for individual organ system residuals — use whichever method is higher.',
        source: '38 CFR 4.88b, DC 6350',
        important: true
      },
      dualRating: {
        term: 'Dual Rating Option — Use the Higher',
        definition: 'VA must rate SLE either under DC 6350 directly OR by combining ratings for all organ system residuals (nephritis, pericarditis, neuropathy, etc.). The veteran receives whichever method produces the higher combined rating.',
        source: '38 CFR 4.88b, DC 6350 Note',
        important: true
      },
      organResiduals: {
        term: 'Organ System Residuals — File Separately',
        definition: 'SLE causes multi-organ damage: lupus nephritis (DC 7531), neuropsychiatric lupus (mental health DCs), serositis (DC 7002), anemia (DC 7700), and skin involvement (DC 7809). Each may be rated separately under the residual system DCs.',
        source: '38 CFR 3.310 / 4.88b'
      }
    },

    documentationTips: [
      {
        tip: 'Document exacerbation frequency and duration — number of flares per year directly drives DC 6350 ratings.',
        priority: 'critical'
      },
      {
        tip: 'File separately for ALL organ system involvement: kidneys, heart, nervous system, blood, skin.',
        priority: 'critical'
      },
      {
        tip: 'Track hospitalizations for lupus flares — these document severe exacerbations.',
        priority: 'high'
      },
      {
        tip: 'Get labs documenting active disease: ANA, anti-dsDNA, complement levels, CBC, urinalysis.',
        priority: 'high'
      },
      {
        tip: 'Document systemic therapy: hydroxychloroquine, steroids, mycophenolate, belimumab — complexity reflects severity.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report exacerbation frequency: how many flares per year and how long each lasts',
      'Report ALL organ systems affected: joints, skin, kidneys, heart, lungs, nervous system, blood',
      'Bring lab results showing active disease markers',
      'List all SLE medications including immunosuppressants',
      'Describe functional impairment during flares and any permanent organ damage'
    ],

    ratingNote: 'SLE is rated under the higher of: (1) DC 6350 directly based on exacerbation frequency, OR (2) combined ratings for all organ system residuals. Ensure VA evaluates both options and applies the higher result.'
  },

  // ============================================
  // HYPOTHYROIDISM - DC 7903
  // ============================================
  '7903': {
    condition: 'Hypothyroidism',
    cfrReference: '38 CFR 4.119, DC 7903',

    keyDefinitions: {
      ratingScale: {
        term: 'Hypothyroidism Rating Scale',
        definition: 'Ratings: 30% (hypothyroidism without myxedema — minimum rating for 6 months after diagnosis, then rate residuals), 100% (myxedema: cold intolerance, muscular weakness, cardiovascular involvement including hypotension/bradycardia/pericardial effusion, and mental disturbance including dementia/depression). 100% continues 6 months after crisis stabilization.',
        source: '38 CFR 4.119, DC 7903',
        important: true
      },
      residuals: {
        term: 'Rate Residuals After Stabilization',
        definition: 'After 6 months, hypothyroidism residuals (cognitive impairment, depression, cardiac involvement, neuropathy) are rated under the appropriate body system DCs. These may produce higher ratings than DC 7903 alone.',
        source: '38 CFR 4.119, DC 7903 Note 2'
      }
    },

    documentationTips: [
      {
        tip: 'Get TSH and free T4 labs documenting the degree of thyroid dysfunction.',
        priority: 'high'
      },
      {
        tip: 'Document all symptoms: fatigue, cold intolerance, weight gain, cognitive slowing, depression, bradycardia.',
        priority: 'high'
      },
      {
        tip: 'If residuals persist after stabilization, file for residual ratings under the applicable body system DCs.',
        priority: 'high'
      },
      {
        tip: 'Document the service connection nexus: Hashimoto\'s thyroiditis, radiation exposure, or service-connected medication effect.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report the full range of hypothyroid symptoms even if partially controlled on medication',
      'Bring TSH and thyroid hormone lab results',
      'Report cognitive symptoms, fatigue, and mood changes',
      'If myxedema has occurred, document it specifically — it qualifies for 100%'
    ]
  },

  // ============================================
  // HYPERTHYROIDISM - DC 7900
  // ============================================
  '7900': {
    condition: "Hyperthyroidism / Graves' Disease",
    cfrReference: '38 CFR 4.119, DC 7900',

    keyDefinitions: {
      ratingScale: {
        term: 'Hyperthyroidism Rating',
        definition: 'Rated at 30% for 6 months after initial diagnosis. After 6 months, rate residuals under the appropriate body system DCs. Graves\' ophthalmopathy (eye involvement) is rated separately under DC 6090 (diplopia) or visual acuity codes.',
        source: '38 CFR 4.119, DC 7900',
        important: true
      },
      gravesEye: {
        term: "Graves' Ophthalmopathy — Separate Rating",
        definition: 'Eye involvement from Graves\' disease (proptosis, diplopia, visual changes) is rated separately under the eye schedule (DC 6090 or visual acuity codes). File for this explicitly.',
        source: '38 CFR 4.119, DC 7900 Note 2',
        important: true
      },
      cardiacInvolvement: {
        term: 'Cardiac Involvement — Separate Rating',
        definition: 'Hyperthyroid heart disease (DC 7008) is rated separately if cardiac involvement (atrial fibrillation, cardiomegaly, heart failure) is present.',
        source: '38 CFR 4.119, DC 7900 Note 1'
      }
    },

    documentationTips: [
      {
        tip: 'Separately claim Graves\' ophthalmopathy — eye involvement is rated under a different DC.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim cardiac involvement (atrial fibrillation, tachycardia) if present.',
        priority: 'high'
      },
      {
        tip: 'Get thyroid function labs: TSH, free T4, free T3, and TSI antibodies.',
        priority: 'high'
      },
      {
        tip: 'Document residual symptoms after treatment: treated Graves\' often results in hypothyroidism.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report eye symptoms: double vision, bulging, tearing, pain — these are separately rated',
      'Report cardiac symptoms: palpitations, rapid heart rate, atrial fibrillation',
      'Note if treatment (radioiodine, thyroidectomy) resulted in hypothyroidism — rate the new condition',
      'Bring thyroid labs and imaging (thyroid ultrasound, nuclear scan) results'
    ]
  },

  // ============================================
  // ADDISON'S DISEASE - DC 7911
  // ============================================
  '7911': {
    condition: "Addison's Disease (Adrenocortical Insufficiency)",
    cfrReference: '38 CFR 4.119, DC 7911',

    keyDefinitions: {
      ratingScale: {
        term: "Addison's Rating Scale",
        definition: 'Ratings: 20% (1–2 crises/year OR 2–4 episodes/year OR weakness/fatigability OR corticosteroid therapy required), 40% (3 crises/year OR 5+ episodes/year), 60% (4+ crises/year). An Addisonian crisis = rapid peripheral vascular collapse with hypotension, shock, vomiting, dehydration.',
        source: '38 CFR 4.119, DC 7911',
        important: true
      },
      crisisVsEpisode: {
        term: 'Crisis vs. Episode',
        definition: 'A "crisis" is acute adrenal insufficiency with vascular collapse requiring emergency treatment. An "episode" is a period of increased symptoms not reaching crisis level. Both are counted separately in the rating scale.',
        source: '38 CFR 4.119, DC 7911 Note 1',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Track adrenal crises with ER documentation — each crisis requiring emergency treatment must be documented.',
        priority: 'critical'
      },
      {
        tip: 'Document episodes (less severe exacerbations) separately from crises — both count in the rating.',
        priority: 'high'
      },
      {
        tip: 'Keep records of steroid stress dosing requirements — signals ongoing vulnerability to crisis.',
        priority: 'medium'
      },
      {
        tip: 'Document service nexus: autoimmune conditions, adrenal trauma, or infection during service.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report crisis and episode counts per year separately',
      'Bring ER records documenting adrenal crises',
      'Describe symptoms during episodes: extreme fatigue, nausea, low blood pressure, confusion',
      'Report all steroid medications and stress dose requirements'
    ]
  },

  // ============================================
  // DIABETES INSIPIDUS - DC 7909
  // ============================================
  '7909': {
    condition: 'Diabetes Insipidus',
    cfrReference: '38 CFR 4.119, DC 7909',

    keyDefinitions: {
      ratingScale: {
        term: 'Diabetes Insipidus Rating Scale',
        definition: 'Ratings: 10% (persistent polyuria OR requiring continuous hormonal therapy). Initial diagnosis: 30% for 3 months. Thereafter, rate residuals under appropriate body system DCs or 10% if persistent polyuria/continuous therapy remains.',
        source: '38 CFR 4.119, DC 7909',
        important: true
      },
      residuals: {
        term: 'Rate Residuals After 3 Months',
        definition: 'After the initial 3-month period, evaluate chronic residuals (electrolyte disorders, dehydration, renal effects) under the appropriate body system DCs in addition to or instead of the flat 10%.',
        source: '38 CFR 4.119, DC 7909 Note'
      }
    },

    documentationTips: [
      {
        tip: 'Document persistent polyuria with urine output measurements if available.',
        priority: 'high'
      },
      {
        tip: 'Document continuous hormonal therapy (desmopressin/DDAVP) requirement.',
        priority: 'critical'
      },
      {
        tip: 'Document the cause and service nexus: TBI, pituitary surgery, autoimmune, or idiopathic with service link.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report daily fluid intake and urine output volume',
      'Confirm you require continuous DDAVP therapy — this is the 10% threshold',
      'Describe functional impact: disrupted sleep from nocturia, difficulty working',
      'Report the underlying cause and any service connection'
    ]
  },

  // ============================================
  // HYPERPARATHYROIDISM - DC 7904
  // ============================================
  '7904': {
    condition: 'Hyperparathyroidism',
    cfrReference: '38 CFR 4.119, DC 7904',

    keyDefinitions: {
      ratingScale: {
        term: 'Hyperparathyroidism Rating Scale',
        definition: 'Ratings: 60% (hypercalcemia: total Ca >12 mg/dL OR ionized Ca >5.6 mg/dL OR creatinine clearance <60 mL/min OR bone T-score <−2.5 OR prior fragility fracture). 100% for 6 months following parathyroid surgery. After 6 months, rate residuals under appropriate body system DCs.',
        source: '38 CFR 4.119, DC 7904',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get calcium, PTH, and creatinine labs — these are the objective evidence for the 60% rating.',
        priority: 'critical'
      },
      {
        tip: 'Get DEXA bone density scan — T-score <−2.5 qualifies independently for 60%.',
        priority: 'high'
      },
      {
        tip: 'After surgery, file for residual ratings at the 6-month mark under appropriate body system DCs.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring calcium, PTH, and creatinine lab results',
      'Report bone density results and any fragility fractures',
      'Report symptoms: fatigue, depression, cognitive slowing, kidney stones, bone pain',
      'After surgery, report residual symptoms for ongoing rating'
    ]
  },

  // ============================================
  // HYPOPARATHYROIDISM - DC 7905
  // ============================================
  '7905': {
    condition: 'Hypoparathyroidism',
    cfrReference: '38 CFR 4.119, DC 7905',

    keyDefinitions: {
      initialRating: {
        term: 'Initial Rating — 100% for 3 Months',
        definition: 'Rated at 100% for 3 months after initial diagnosis. Thereafter, rate chronic residuals (kidney stones, cataracts, decreased renal function, congestive heart failure) under the appropriate body system DCs.',
        source: '38 CFR 4.119, DC 7905',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document all chronic residuals after the 3-month period: nephrolithiasis, cataracts, renal dysfunction.',
        priority: 'critical'
      },
      {
        tip: 'File for each residual under its own DC — kidney stones, cataracts, and cardiac effects are separately ratable.',
        priority: 'critical'
      },
      {
        tip: 'Track calcium and PTH levels and document ongoing calcium/vitamin D supplementation.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report all complications: kidney stones, eye changes, cardiac symptoms',
      'Bring lab results showing calcium and phosphorus levels',
      'Report all supplementation required to maintain normal calcium',
      'Describe any tetany or muscle cramping episodes'
    ]
  },

  // ============================================
  // THYROIDITIS - DC 7906
  // ============================================
  '7906': {
    condition: 'Thyroiditis',
    cfrReference: '38 CFR 4.119, DC 7906',

    keyDefinitions: {
      ratingBasis: {
        term: 'Thyroiditis Rating Basis',
        definition: 'Thyroiditis with normal thyroid function (euthyroid) = 0%. If manifesting as hyperthyroidism: rate as DC 7900. If manifesting as hypothyroidism: rate as DC 7903. The functional consequence — not the diagnosis — drives the rating.',
        source: '38 CFR 4.119, DC 7906',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document current thyroid function: TSH, free T4. The rating follows the functional status.',
        priority: 'critical'
      },
      {
        tip: 'If thyroiditis has caused hypothyroidism, file under DC 7903 for the functional rating.',
        priority: 'critical'
      },
      {
        tip: 'Document thyroid antibodies (TPO-Ab, Tg-Ab) confirming autoimmune thyroiditis.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report current thyroid symptoms — hypo or hyper — not just the diagnosis',
      'Bring TSH and thyroid hormone labs',
      'Report medications including levothyroxine',
      'Confirm the examiner is rating the functional status, not just noting the diagnosis'
    ]
  },

  // ============================================
  // CHLORACNE - DC 7829
  // ============================================
  '7829': {
    condition: 'Chloracne',
    cfrReference: '38 CFR 4.118, DC 7829',

    keyDefinitions: {
      ratingScale: {
        term: 'Chloracne Rating Scale',
        definition: 'Ratings: 0% (superficial acne/comedones/papules of any extent), 10% (deep acne in <40% of face/neck, or non-intertriginous body areas), 20% (deep acne in intertriginous areas: axilla, anogenital, breast folds, between digits), 30% (deep acne in ≥40% of face and neck).',
        source: '38 CFR 4.118, DC 7829',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: 'Chloracne is a presumptive service-connected condition for veterans with herbicide agent (Agent Orange, TCDD) exposure. No nexus letter required. Must manifest within 1 year of last herbicide exposure for presumptive.',
        source: '38 CFR 3.309(e)',
        important: true
      },
      deepVsSuperficial: {
        term: 'Deep vs. Superficial Acne',
        definition: '"Deep acne" means deep inflamed nodules and pus-filled cysts. Comedones, papules, and pustules are "superficial" and are rated at 0%. Only nodules and cysts qualify for a compensable rating.',
        source: '38 CFR 4.118, DC 7829',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document that lesions are deep nodules and cysts — superficial acne = 0%.',
        priority: 'critical'
      },
      {
        tip: 'Document the percentage of face and neck affected by deep lesions.',
        priority: 'critical'
      },
      {
        tip: 'Document intertriginous area involvement: axilla, anogenital, breast folds — this is the 20% tier.',
        priority: 'high'
      },
      {
        tip: 'For Agent Orange veterans: document herbicide exposure dates and locations — chloracne is presumptive.',
        priority: 'critical'
      },
      {
        tip: 'Photograph active lesions — visual evidence is essential for chloracne claims.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Confirm lesions are deep nodules/cysts, not just superficial pimples',
      'Report all affected areas including intertriginous areas (armpits, groin)',
      'Estimate the percentage of your face and neck affected',
      'For Agent Orange veterans: confirm the examiner is applying presumptive service connection',
      'Bring photographs of active lesions if not currently flaring'
    ],

    ratingNote: 'Chloracne is an Agent Orange presumptive condition. However, it must have been manifest within 1 year of last herbicide exposure for the presumptive to apply. If diagnosed later, a nexus opinion from a physician documenting ongoing herbicide effects may be needed.'
  },

  // ============================================
  // ACNE - DC 7828
  // ============================================
  '7828': {
    condition: 'Acne (Vulgaris/Conglobata)',
    cfrReference: '38 CFR 4.118, DC 7828',

    keyDefinitions: {
      ratingScale: {
        term: 'Acne Rating Scale',
        definition: 'Ratings: 0% (comedones or papules/pustules, any extent), 10% (deep acne in ≥40% of face/neck), 30% (deep inflamed nodules/cysts ≥40% of face and neck). Noncompensable unless involving deep inflammatory lesions over significant facial/neck area.',
        source: '38 CFR 4.118, DC 7828',
        important: true
      },
      conglobata: {
        term: 'Acne Conglobata',
        definition: 'Severe nodular acne forming abscesses and draining sinuses. The most severe form of acne vulgaris — document this specific diagnosis as it supports the higher rating tiers.',
        source: '38 CFR 4.118, DC 7828'
      }
    },

    documentationTips: [
      {
        tip: 'Get dermatology documentation confirming deep nodular acne — superficial acne = 0%.',
        priority: 'critical'
      },
      {
        tip: 'Document the percentage of face and neck affected by deep lesions.',
        priority: 'high'
      },
      {
        tip: 'Photograph active lesions and scars from resolved lesions.',
        priority: 'high'
      },
      {
        tip: 'Separately claim scarring from acne under DC 7800 or 7804 — scar ratings are additional.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report deep nodules and cysts specifically, not just surface blemishes',
      'Estimate face and neck coverage percentage',
      'Separately raise scar ratings from acne scarring',
      'Bring photos if lesions fluctuate and may not be active at exam time'
    ]
  },

  // ============================================
  // ALOPECIA AREATA - DC 7831
  // ============================================
  '7831': {
    condition: 'Alopecia Areata',
    cfrReference: '38 CFR 4.118, DC 7831',

    keyDefinitions: {
      ratingScale: {
        term: 'Alopecia Areata Rating Scale',
        definition: 'Ratings: 0% (loss limited to scalp and face), 10% (loss of all body hair — alopecia universalis). The higher rating requires complete loss of ALL body hair, not just scalp.',
        source: '38 CFR 4.118, DC 7831',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document whether hair loss is limited to scalp/face only, or involves all body hair.',
        priority: 'critical'
      },
      {
        tip: 'Get dermatology confirmation of alopecia universalis if all body hair is lost.',
        priority: 'high'
      },
      {
        tip: 'Document treatment history: corticosteroids, immunotherapy, JAK inhibitors.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report whether you have lost eyebrows, eyelashes, and body hair in addition to scalp hair',
      'Alopecia universalis (all body hair lost) is required for the 10% rating',
      'Report all treatments tried',
      'Document emotional/psychological impact for potential secondary mental health claim'
    ]
  },

  // ============================================
  // HYPERHIDROSIS - DC 7832
  // ============================================
  '7832': {
    condition: 'Hyperhidrosis (Excessive Sweating)',
    cfrReference: '38 CFR 4.118, DC 7832',

    keyDefinitions: {
      ratingScale: {
        term: 'Hyperhidrosis Rating Scale',
        definition: 'Ratings: 0% (able to handle paper or tools after therapy), 30% (unable to handle paper or tools because of moisture, AND unresponsive to therapy). The 30% rating requires BOTH functional limitation AND treatment failure.',
        source: '38 CFR 4.118, DC 7832',
        important: true
      },
      treatmentResistance: {
        term: 'Treatment Resistance Required for 30%',
        definition: 'The 30% rating requires that hyperhidrosis is unresponsive to therapy. Document all failed treatments: antiperspirants, iontophoresis, botulinum toxin, and medications.',
        source: '38 CFR 4.118, DC 7832',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document all treatments tried and their failure: prescription antiperspirants, iontophoresis, Botox injections.',
        priority: 'critical'
      },
      {
        tip: 'Document functional limitation: inability to hold paper, use tools, or perform work tasks due to moisture.',
        priority: 'critical'
      },
      {
        tip: 'Note occupational impact: jobs you cannot perform due to hyperhidrosis.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report all treatments tried and that they have failed or provided insufficient relief',
      'Describe specific functional limitations: cannot grip tools, paper slips, cannot write',
      'Report impact on occupation and daily activities',
      'Note if hyperhidrosis is secondary to a service-connected neurological or endocrine condition'
    ]
  },

  // ============================================
  // CHRONIC RENAL DISEASE - DC 7530
  // Rates under Renal Dysfunction Formula
  // ============================================
  '7530': {
    condition: 'Chronic Renal Disease (CKD)',
    cfrReference: '38 CFR 4.115a, DC 7530',

    keyDefinitions: {
      gfrFormula: {
        term: 'GFR-Based Renal Dysfunction Formula',
        definition: 'CKD is rated by GFR (or eGFR): 0% (GFR 60–89 with abnormal casts or structural changes or ACR ≥30), 30% (GFR 45–59), 60% (GFR 30–44), 80% (GFR 15–29), 100% (GFR <15 or dialysis or eligible transplant recipient). Three consecutive months of qualifying GFR required.',
        source: '38 CFR 4.115a Renal Dysfunction',
        important: true
      },
      threeMonths: {
        term: '3-Month Persistence Required',
        definition: 'The GFR must be at the qualifying level for at least 3 consecutive months during the past 12 months. A single low reading is insufficient — document serial labs.',
        source: '38 CFR 4.115a',
        important: true
      },
      secondary: {
        term: 'Secondary to Diabetes or Hypertension',
        definition: 'CKD secondary to service-connected diabetes (DC 7913) or hypertension (DC 7101) is separately ratable under 38 CFR 3.310. This is a commonly missed secondary claim.',
        source: '38 CFR 3.310',
        important: true
      },
      dialysis: {
        term: 'Dialysis = 100%',
        definition: 'Any veteran requiring regular routine dialysis is rated at 100% under the renal dysfunction formula, regardless of GFR.',
        source: '38 CFR 4.115a',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Boggs v. Peake',
        citation: '520 F.3d 1330 (Fed. Cir. 2008)',
        year: 2008,
        holding: 'Secondary conditions caused by service-connected disabilities are service-connected under 38 CFR 3.310.',
        practicalApplication: 'CKD from service-connected diabetes or hypertension is separately ratable — file explicitly as secondary.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get serial GFR/eGFR labs over at least 3 consecutive months — single readings are insufficient.',
        priority: 'critical'
      },
      {
        tip: 'Confirm the service-connected basis: secondary to diabetes, hypertension, or direct service exposure.',
        priority: 'critical'
      },
      {
        tip: 'Document albumin/creatinine ratio (ACR) — ACR ≥30 mg/g supports a rating even with GFR 60–89.',
        priority: 'high'
      },
      {
        tip: 'Document dialysis schedule if applicable — dialysis = automatic 100%.',
        priority: 'critical'
      },
      {
        tip: 'Track all CKD-related complications: anemia, hyperparathyroidism, fluid overload — separately ratable.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring at least 3 months of GFR/creatinine lab results',
      'Confirm the service-connected condition causing your kidney disease',
      'Report dialysis schedule if applicable',
      'Report all CKD complications and medications',
      'Bring urinalysis showing proteinuria or casts if applicable'
    ],

    commonMistakes: [
      'Not filing CKD as secondary to service-connected diabetes or hypertension',
      'Providing only a single GFR reading — three months of persistence required',
      'Not documenting dialysis which automatically qualifies for 100%'
    ]
  },

  // ============================================
  // KIDNEY STONES - DC 7508
  // ============================================
  '7508': {
    condition: 'Kidney Stones (Nephrolithiasis)',
    cfrReference: '38 CFR 4.115b, DC 7508',

    keyDefinitions: {
      ratingBasis: {
        term: 'Kidney Stone Rating Basis',
        definition: 'Nephrolithiasis rates as hydronephrosis (DC 7509), EXCEPT recurrent stone formation requiring invasive or non-invasive procedures more than 2 times/year = 30%. Hydronephrosis ratings: 10% (occasional colic, no infection, no catheter), 20% (frequent colic requiring catheter drainage), 30% (frequent colic with infection and impaired kidney function).',
        source: '38 CFR 4.115b, DC 7508',
        important: true
      },
      procedures: {
        term: 'Procedures Threshold for 30%',
        definition: 'More than 2 invasive or non-invasive procedures per year (lithotripsy, ureteroscopy, nephrostomy, stent placement) independently qualifies for 30% regardless of the hydronephrosis criteria.',
        source: '38 CFR 4.115b, DC 7508',
        important: true
      },
      smc: {
        term: 'Special Monthly Compensation Review',
        definition: 'Kidney conditions may qualify for SMC under 38 CFR 3.350. VA must review all genitourinary claims for potential SMC entitlement.',
        source: '38 CFR 3.350'
      }
    },

    documentationTips: [
      {
        tip: 'Track all stone-related procedures per year: lithotripsy, ureteroscopy, stent placement, nephrostomy — 2+ = 30%.',
        priority: 'critical'
      },
      {
        tip: 'Document each colicky pain episode requiring ER visit or hospitalization.',
        priority: 'high'
      },
      {
        tip: 'Get imaging (CT, ultrasound) documenting stone burden and any hydronephrosis.',
        priority: 'high'
      },
      {
        tip: 'Document recurrent UTIs secondary to stone disease — UTI ratings may additionally apply.',
        priority: 'medium'
      },
      {
        tip: 'Track any kidney function impact (GFR decline) from recurrent obstruction.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report number of procedures performed in the past year',
      'Describe the frequency and severity of colicky pain episodes',
      'Bring imaging showing stone burden and any obstruction or hydronephrosis',
      'Report any recurrent UTIs caused by stone disease',
      'Report impact on kidney function if GFR has been affected'
    ]
  },

  // ============================================
  // VOIDING DYSFUNCTION (CYSTITIS, NEUROGENIC BLADDER,
  // URETHRAL STRICTURE, PROSTATE) - 7512/7542/7518/7527
  // ============================================
  '7542': {
    condition: 'Neurogenic Bladder / Voiding Dysfunction',
    cfrReference: '38 CFR 4.115a, DC 7542',

    keyDefinitions: {
      voidingFormula: {
        term: 'Voiding Dysfunction Formula',
        definition: 'Rated under the predominant symptom: (1) Urine Leakage/Incontinence: 20% (absorbent change <2/day), 40% (change 2–4/day), 60% (change >4/day or appliance required). (2) Urinary Frequency: 10% (void every 2–3 hrs or awaken 2×/night), 20% (every 1–2 hrs or awaken 3–4×/night), 40% (<1hr interval or awaken 5+×/night). (3) Obstructed Voiding: 10% (marked obstruction with post-void residual >150cc or dilatation every 2–3 months), 30% (catheterization required).',
        source: '38 CFR 4.115a',
        important: true
      },
      predominant: {
        term: 'Rate Predominant Symptom Only',
        definition: 'Only the predominant voiding dysfunction is rated — urine leakage, frequency, and obstructed voiding cannot be combined with each other. Use whichever produces the highest single rating.',
        source: '38 CFR 4.115a',
        important: true
      },
      smc: {
        term: 'SMC for Voiding Dysfunction',
        definition: 'Neurogenic bladder requiring catheterization or causing urinary incontinence requiring use of an appliance may qualify for Special Monthly Compensation (SMC) under 38 CFR 3.350.',
        source: '38 CFR 3.350',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Count and document pad/absorbent changes per day — this is the key metric for incontinence rating.',
        priority: 'critical'
      },
      {
        tip: 'Document nocturia frequency: how many times per night do you wake to void?',
        priority: 'critical'
      },
      {
        tip: 'Get urodynamic studies documenting neurogenic bladder dysfunction.',
        priority: 'high'
      },
      {
        tip: 'Document catheterization if used — intermittent or continuous catheterization = 30% obstructed voiding.',
        priority: 'critical'
      },
      {
        tip: 'Document post-void residual volumes from bladder ultrasound — PVR >150cc = 10% obstructed voiding.',
        priority: 'high'
      },
      {
        tip: 'If catheterization or appliance required, request SMC evaluation.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report pad usage: how many per day do you change?',
      'Report nocturia: how many times per night do you wake to void?',
      'Report daytime voiding frequency: hours between voids',
      'If you catheterize, describe the schedule and frequency',
      'Bring urodynamic study results',
      'Request SMC review if you use an appliance or require catheterization'
    ],

    commonMistakes: [
      'Not counting pad changes per day — this is the primary incontinence rating metric',
      'Underreporting nocturia — awakenings per night directly drive the frequency rating',
      'Not requesting SMC when catheterization or appliance is required',
      'Trying to combine leakage + frequency ratings — only the predominant symptom is rated'
    ]
  },

  '7512': {
    condition: 'Chronic Cystitis (Interstitial Cystitis)',
    cfrReference: '38 CFR 4.115a, DC 7512',

    keyDefinitions: {
      rateAsVoiding: {
        term: 'Rates as Voiding Dysfunction',
        definition: 'Chronic cystitis (DC 7512) including interstitial cystitis rates under the Voiding Dysfunction Formula in 38 CFR 4.115a. Apply urine leakage, frequency, or obstructed voiding criteria — whichever is predominant.',
        source: '38 CFR 4.115b, DC 7512',
        important: true
      },
      icSpecific: {
        term: 'Interstitial Cystitis Documentation',
        definition: 'Interstitial cystitis diagnosis should be confirmed by cystoscopy with hydrodistension or biopsy. Symptomatic documentation (pelvic pain, frequency, urgency, nocturia) is essential for rating under voiding dysfunction.',
        source: '38 CFR 4.115a'
      }
    },

    documentationTips: [
      {
        tip: 'Document voiding frequency — daytime hours between voids and nighttime awakenings.',
        priority: 'critical'
      },
      {
        tip: 'Get cystoscopy confirming interstitial cystitis diagnosis.',
        priority: 'high'
      },
      {
        tip: 'Track pelvic pain severity and its relationship to voiding.',
        priority: 'high'
      },
      {
        tip: 'Document all treatments: bladder instillations, medications, nerve blocks.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report voiding frequency in detail: hours between voids during the day, awakenings at night',
      'Describe pelvic pain and its relationship to bladder filling',
      'Bring cystoscopy results confirming the diagnosis',
      'Report all medications and treatments for interstitial cystitis'
    ]
  },

  '7527': {
    condition: 'Prostate Conditions (BPH/Prostatitis)',
    cfrReference: '38 CFR 4.115a, DC 7527',

    keyDefinitions: {
      rateAsVoiding: {
        term: 'Rates as Voiding Dysfunction',
        definition: 'Prostate conditions (DC 7527) including BPH, prostatitis, and post-surgical residuals rate under the Voiding Dysfunction Formula. Obstructed voiding, frequency, or incontinence — whichever is predominant — drives the rating.',
        source: '38 CFR 4.115b, DC 7527',
        important: true
      },
      postSurgical: {
        term: 'Post-Surgical Incontinence',
        definition: 'Post-prostatectomy incontinence rates under the urine leakage/incontinence formula (pads per day). This is frequently severe after radical prostatectomy for prostate cancer.',
        source: '38 CFR 4.115a',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the predominant voiding symptom: obstruction (hesitancy, weak stream, PVR) or frequency or leakage.',
        priority: 'critical'
      },
      {
        tip: 'Get uroflowmetry and post-void residual measurements — objective obstruction evidence.',
        priority: 'high'
      },
      {
        tip: 'For post-prostatectomy: document pad usage per day for incontinence rating.',
        priority: 'critical'
      },
      {
        tip: 'Document erectile dysfunction separately under DC 7522 — it is separately ratable.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report the predominant symptom: obstruction, frequency, or leakage',
      'Report pad usage if post-prostatectomy incontinence is present',
      'Bring uroflowmetry and PVR results',
      'Separately report erectile dysfunction — it rates independently under DC 7522'
    ]
  },

  '7518': {
    condition: 'Urethral Stricture',
    cfrReference: '38 CFR 4.115a, DC 7518',

    keyDefinitions: {
      rateAsVoiding: {
        term: 'Rates as Voiding Dysfunction',
        definition: 'Urethral stricture (DC 7518) rates under the obstructed voiding criteria: 10% (marked obstruction with PVR >150cc, diminished flow <10cc/sec, recurrent UTIs, or dilatation every 2–3 months), 30% (urinary retention requiring catheterization).',
        source: '38 CFR 4.115a, DC 7518',
        important: true
      },
      dilationFrequency: {
        term: 'Dilation Frequency',
        definition: 'Stricture requiring periodic dilatation every 2–3 months qualifies for the 10% obstructed voiding rating. More frequent dilatation (every 2–3 months) is the threshold.',
        source: '38 CFR 4.115a'
      }
    },

    documentationTips: [
      {
        tip: 'Document dilation frequency: how often is urethral dilation required?',
        priority: 'critical'
      },
      {
        tip: 'Get uroflowmetry documenting reduced peak flow rate (<10 cc/sec).',
        priority: 'high'
      },
      {
        tip: 'Get post-void residual measurement — PVR >150cc supports obstructed voiding rating.',
        priority: 'high'
      },
      {
        tip: 'Track UTIs secondary to stricture — recurrent UTIs independently support a rating.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report dilation frequency and who performs it',
      'Describe urinary stream: weak, slow, intermittent, with straining',
      'Report any catheterization required',
      'Bring uroflowmetry results'
    ]
  },

  // ============================================
  // ERECTILE DYSFUNCTION - DC 7522
  // ============================================
  '7522': {
    condition: 'Erectile Dysfunction',
    cfrReference: '38 CFR 4.115b, DC 7522',

    keyDefinitions: {
      zeroPercent: {
        term: 'DC 7522 = 0% Rating',
        definition: 'Erectile dysfunction (DC 7522) is rated at 0% — it is noncompensable on its own. However, service connection still matters because it can entitle a veteran to Special Monthly Compensation (SMC-K) for loss of use of a creative organ.',
        source: '38 CFR 4.115b, DC 7522',
        important: true
      },
      smcK: {
        term: 'SMC-K — The Critical Benefit',
        definition: 'A veteran with service-connected ED is entitled to Special Monthly Compensation at the SMC-K rate for loss of use of a creative organ. SMC-K adds a flat amount to monthly compensation regardless of other ratings. This is the primary financial benefit of an ED claim.',
        source: '38 CFR 3.350(a)',
        important: true
      },
      secondary: {
        term: 'Secondary Service Connection',
        definition: 'ED is commonly secondary to service-connected diabetes, prostate surgery, spinal cord injury, TBI, PTSD medications, or vascular disease. File explicitly as secondary to the primary service-connected condition.',
        source: '38 CFR 3.310',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Boggs v. Peake',
        citation: '520 F.3d 1330 (Fed. Cir. 2008)',
        year: 2008,
        holding: 'Secondary conditions caused by service-connected disabilities are service-connected.',
        practicalApplication: 'ED from service-connected diabetes, prostate disease, spinal injury, or PTSD medications qualifies for secondary service connection and SMC-K.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'File for service connection explicitly — a 0% rating still qualifies for SMC-K, which adds meaningful monthly compensation.',
        priority: 'critical'
      },
      {
        tip: 'Document the service-connected cause: diabetes, prostate surgery, spinal cord injury, TBI, or medication side effect.',
        priority: 'critical'
      },
      {
        tip: 'Get a physician nexus opinion linking ED to the service-connected condition.',
        priority: 'high'
      },
      {
        tip: 'Document all medications for ED — this supports both the diagnosis and the secondary SC nexus.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Confirm you are specifically requesting service connection for ED and SMC-K',
      'Describe the service-connected condition that caused the ED',
      'Report onset timing relative to the causative condition',
      'Report all treatments: PDE5 inhibitors, injections, devices, implants'
    ],

    commonMistakes: [
      'Not filing because "it only rates at 0%" — the 0% SC still qualifies for SMC-K compensation',
      'Not identifying the service-connected condition causing ED',
      'Not requesting SMC-K explicitly — VA may not automatically evaluate it'
    ],

    ratingNote: 'DC 7522 = 0%, but service connection qualifies for SMC-K (Special Monthly Compensation for loss of use of a creative organ). SMC-K adds approximately $120/month (rate varies annually) on top of all other compensation. ALWAYS file for service connection on ED — the 0% rating still pays.'
  },

  // ============================================
  // ENDOMETRIOSIS - DC 7629
  // ============================================
  '7629': {
    condition: 'Endometriosis',
    cfrReference: '38 CFR 4.116, DC 7629',

    keyDefinitions: {
      ratingScale: {
        term: 'Endometriosis Rating Scale',
        definition: 'Ratings: 10% (pelvic pain or heavy/irregular bleeding requiring continuous treatment for control), 30% (pelvic pain or heavy/irregular bleeding NOT controlled by treatment), 50% (lesions involving bowel or bladder confirmed by laparoscopy + pelvic pain or bleeding not controlled by treatment + bowel or bladder symptoms). Diagnosis must be confirmed by laparoscopy.',
        source: '38 CFR 4.116, DC 7629',
        important: true
      },
      laparoscopyRequired: {
        term: 'Laparoscopy Required for Diagnosis',
        definition: 'Per the CFR note, the diagnosis of endometriosis must be confirmed by laparoscopy. Clinical symptoms alone are insufficient for rating purposes. Imaging (ultrasound, MRI) supports but does not substitute for laparoscopic confirmation.',
        source: '38 CFR 4.116, DC 7629 Note',
        important: true
      },
      bowelBladder: {
        term: 'Bowel/Bladder Involvement = 50%',
        definition: 'Endometriosis with confirmed bowel or bladder involvement (by laparoscopy) AND pelvic pain/bleeding not controlled by treatment AND bowel or bladder symptoms qualifies for the 50% rating.',
        source: '38 CFR 4.116, DC 7629',
        important: true
      },
      mst: {
        term: 'MST Secondary Service Connection',
        definition: 'Endometriosis caused or aggravated by military sexual trauma (MST) may be service-connectable as a secondary condition. PTSD from MST and subsequent endometriosis exacerbation has been accepted in some cases.',
        source: '38 CFR 3.304(f)'
      }
    },

    documentationTips: [
      {
        tip: 'Get laparoscopy — this is required for the diagnosis to be ratable. Imaging alone is insufficient.',
        priority: 'critical'
      },
      {
        tip: 'Document whether symptoms are controlled by treatment or not — this is the key 10% vs. 30% distinction.',
        priority: 'critical'
      },
      {
        tip: 'Get cystoscopy or colonoscopy confirming bowel/bladder involvement for the 50% rating.',
        priority: 'high'
      },
      {
        tip: 'Document all treatments tried: hormonal therapy, NSAIDs, surgery — treatment failure supports 30%+.',
        priority: 'high'
      },
      {
        tip: 'Track menstrual cycle disruption, pelvic pain frequency, and bowel/bladder symptoms separately.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring laparoscopy operative report confirming endometriosis',
      'Report whether pelvic pain and bleeding are controlled on current treatment',
      'Report bowel symptoms (painful defecation, rectal bleeding during menses) and bladder symptoms',
      'Describe impact on daily activities and work',
      'Report all treatments and whether they provide adequate control'
    ],

    commonMistakes: [
      'Attempting to claim without laparoscopic confirmation — imaging is insufficient',
      'Not documenting whether symptoms are controlled vs. uncontrolled by treatment',
      'Missing the 50% tier by not reporting bowel and bladder symptoms'
    ]
  },

  // ============================================
  // FEMALE REPRODUCTIVE ORGANS - DC 7610-7615
  // General Rating Formula
  // ============================================
  '7615': {
    condition: 'Female Reproductive Organ Conditions (Ovary, Uterus, Cervix, Vagina, Vulva, Fallopian Tube)',
    cfrReference: '38 CFR 4.116, DC 7610–7615',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula — DC 7610–7615',
        definition: 'All six female reproductive organ DCs (vulva 7610, vagina 7611, cervix 7612, uterus 7613, fallopian tube/PID 7614, ovary 7615) use the same formula: 0% (symptoms not requiring continuous treatment), 10% (symptoms requiring continuous treatment), 30% (symptoms NOT controlled by continuous treatment).',
        source: '38 CFR 4.116, DC 7610–7615',
        important: true
      },
      controlledVsUncontrolled: {
        term: 'Controlled vs. Uncontrolled Symptoms',
        definition: 'The critical distinction: 10% = requires treatment to control, 30% = treatment is ongoing but symptoms are NOT controlled. If you are on continuous treatment but still symptomatic, you qualify for 30%.',
        source: '38 CFR 4.116',
        important: true
      },
      multipleOrgans: {
        term: 'Multiple Organ Conditions',
        definition: 'PID (DC 7614) may involve multiple reproductive organs simultaneously. Each affected organ DC may be rated separately — file for all affected structures.',
        source: '38 CFR 4.116'
      },
      smcCreativeOrgan: {
        term: 'SMC for Creative Organ Loss',
        definition: 'Removal or loss of use of ovaries (reproductive organs) may qualify for SMC under 38 CFR 3.350(a) for loss of a creative organ.',
        source: '38 CFR 3.350(a)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document whether symptoms are controlled or uncontrolled on current treatment — this is the 10% vs. 30% distinction.',
        priority: 'critical'
      },
      {
        tip: 'List all continuous treatments: hormonal therapy, antibiotics, pain management, surgery.',
        priority: 'high'
      },
      {
        tip: 'For PID: document cultures, hospitalizations, and antibiotic courses for each episode.',
        priority: 'high'
      },
      {
        tip: 'If ovaries removed: request SMC evaluation for loss of creative organ.',
        priority: 'critical'
      },
      {
        tip: 'Document all symptoms: pelvic pain, abnormal bleeding, discharge, dyspareunia, infertility.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report whether current treatment controls your symptoms or whether you remain symptomatic',
      'List all medications and treatments including hormonal therapy',
      'Report pelvic pain, abnormal bleeding, and impact on daily activities',
      'If ovaries were removed, request SMC review for creative organ loss',
      'Describe impact on employment and daily functioning'
    ]
  },

  // ============================================
  // PELVIC ORGAN PROLAPSE - DC 7621
  // ============================================
  '7621': {
    condition: 'Pelvic Organ Prolapse',
    cfrReference: '38 CFR 4.116, DC 7621',

    keyDefinitions: {
      ratingAndAdditive: {
        term: 'DC 7621 = 10% Base + Additive for Residuals',
        definition: 'Pelvic organ prolapse rates at 10% flat. Additionally, any genitourinary, digestive, or skin symptoms caused by the prolapse are rated SEPARATELY and combined with the 10% DC 7621 rating. This is explicitly required in the CFR note.',
        source: '38 CFR 4.116, DC 7621 Note',
        important: true
      },
      separateSymptoms: {
        term: 'Separate Rating for All Symptom Systems',
        definition: 'Bladder symptoms (voiding dysfunction), bowel symptoms (rectal prolapse/constipation), and skin symptoms (perineal irritation) from prolapse must each be rated under their applicable DCs and combined with DC 7621.',
        source: '38 CFR 4.116, DC 7621 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document all symptoms caused by prolapse: bladder (leakage, frequency), bowel (constipation, fecal urgency), pain.',
        priority: 'critical'
      },
      {
        tip: 'File separately for voiding dysfunction if bladder symptoms are present.',
        priority: 'critical'
      },
      {
        tip: 'Get pelvic floor exam and imaging (pelvic MRI or ultrasound) documenting prolapse type and stage.',
        priority: 'high'
      },
      {
        tip: 'Document surgical history: vaginal repair, hysterectomy, mesh placement, and any complications.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report ALL symptoms: bladder, bowel, pain, pressure, sexual dysfunction',
      'Confirm examiner is evaluating each symptom system separately and combining with the 10% base',
      'Bring pelvic floor study results',
      'Describe impact on exercise, lifting, sexual activity, and daily functioning'
    ],

    ratingNote: 'DC 7621 = 10% base rate, but the CFR explicitly requires evaluating all associated genitourinary, digestive, and skin symptoms separately under their applicable codes and combining all ratings. The total is often significantly higher than 10%.'
  },

  // ============================================
  // FEMALE SEXUAL AROUSAL DISORDER - DC 7632
  // ============================================
  '7632': {
    condition: 'Female Sexual Arousal Disorder (FSAD)',
    cfrReference: '38 CFR 4.116, DC 7632',

    keyDefinitions: {
      zeroPercent: {
        term: 'DC 7632 = 0% Rating',
        definition: 'Female sexual arousal disorder is rated at 0% — noncompensable on its own. However, service connection qualifies for Special Monthly Compensation (SMC-K) for loss of use of a creative organ, identical to the male ED benefit.',
        source: '38 CFR 4.116, DC 7632',
        important: true
      },
      smcK: {
        term: 'SMC-K for Creative Organ Loss',
        definition: 'Service-connected FSAD qualifies for SMC-K (loss of use of a creative organ) under 38 CFR 3.350(a). This adds meaningful monthly compensation regardless of the 0% rating.',
        source: '38 CFR 3.350(a)',
        important: true
      },
      secondary: {
        term: 'Secondary Service Connection',
        definition: 'FSAD commonly occurs secondary to service-connected PTSD, MST, pelvic conditions, spinal cord injury, or medication side effects. File explicitly as secondary to the causative service-connected condition.',
        source: '38 CFR 3.310',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'File for service connection — the 0% rating still qualifies for SMC-K compensation.',
        priority: 'critical'
      },
      {
        tip: 'Document the service-connected cause: PTSD, MST, pelvic injury, spinal cord injury, or medication side effects.',
        priority: 'critical'
      },
      {
        tip: 'Get a medical nexus opinion connecting FSAD to the service-connected condition.',
        priority: 'high'
      }
    ],

    examTips: [
      'Confirm you are requesting both service connection AND SMC-K evaluation',
      'Describe the service-connected condition that caused FSAD',
      'Report onset timing relative to the causative condition or trauma',
      'Report all treatments sought for FSAD'
    ],

    ratingNote: 'Like DC 7522 (ED), DC 7632 = 0% but service connection qualifies for SMC-K for loss of use of a creative organ. ALWAYS file for service connection — the 0% rating still results in additional monthly compensation through SMC-K.'
  },

  // ============================================
// SYSTEM 8: HEMIC & LYMPHATIC
// ratingEnhancements.js additions
// 38 CFR 4.117
// Add all entries below to the RATING_ENHANCEMENTS object.
// ============================================

  // ============================================
  // LEUKEMIA (except CML) - DC 7703
  // ============================================
  '7703': {
    condition: 'Leukemia (ALL, AML, CLL, other)',
    cfrReference: '38 CFR 4.117, DC 7703',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active Disease or Treatment = 100%',
        definition: 'Leukemia is rated at 100% when there is active disease OR during any treatment phase. The 100% rating continues beyond treatment cessation with a mandatory re-examination 6 months after discontinuance. Exception: asymptomatic CLL at Rai Stage 0 = 0%.',
        source: '38 CFR 4.117, DC 7703',
        important: true
      },
      cllException: {
        term: 'CLL Rai Stage 0 = 0%',
        definition: 'Asymptomatic chronic lymphocytic leukemia at Rai Stage 0 (lymphocytosis only, no organomegaly, no anemia, no thrombocytopenia) is rated at 0%. However, symptomatic CLL at Rai Stage I–IV is rated at 100% like all other leukemias.',
        source: '38 CFR 4.117, DC 7703 Note 2',
        important: true
      },
      sixMonthRule: {
        term: '6-Month Mandatory Re-Examination',
        definition: 'The 100% rating continues for 6 months after treatment ends, then a mandatory VA exam determines the new rating based on residuals. Do not voluntarily reduce the rating before this exam occurs.',
        source: '38 CFR 4.117, DC 7703 Note 1',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange / Radiation Presumptive',
        definition: 'Several leukemias are presumptively service-connected for veterans with herbicide agent exposure (Agent Orange) or ionizing radiation exposure. Includes CLL, AL, and others. No nexus letter required for qualifying veterans.',
        source: '38 CFR 3.309(d)(2) / 3.309(e)',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Nehmer v. VA',
        citation: 'Nehmer litigation (1991, ongoing)',
        year: 1991,
        holding: 'Veterans with Agent Orange exposure who develop presumptive conditions are entitled to retroactive benefits to the date of diagnosis or original claim.',
        practicalApplication: 'Vietnam veterans diagnosed with leukemia who previously had denied claims may be entitled to retroactive pay.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'File immediately upon diagnosis — active disease or any treatment phase = automatic 100%.',
        priority: 'critical'
      },
      {
        tip: 'For Vietnam/radiation exposure veterans: document herbicide or radiation exposure for presumptive service connection.',
        priority: 'critical'
      },
      {
        tip: 'Document the treatment phase completely — chemotherapy, radiation, immunotherapy all qualify for 100%.',
        priority: 'high'
      },
      {
        tip: 'At the 6-month re-examination post-treatment, document ALL residuals: fatigue, immunosuppression, neuropathy, cognitive effects — each rates separately.',
        priority: 'critical'
      },
      {
        tip: 'Track residuals of leukemia therapy: peripheral neuropathy from chemo, cardiac effects, secondary infections.',
        priority: 'high'
      }
    ],

    examTips: [
      'File the claim as soon as diagnosis is confirmed — do not wait',
      'Agent Orange or radiation-exposed veterans: confirm presumptive service connection is being applied',
      'At the post-treatment re-examination, report ALL residual symptoms comprehensively',
      'Bring all treatment records including chemotherapy protocols and radiation records',
      'For CLL: report any symptoms (fatigue, infections, lymphadenopathy) — Rai Stage 0 is 0% only if truly asymptomatic'
    ],

    commonMistakes: [
      'Delaying filing — 100% applies from the date of claim, not date of treatment completion',
      'Not documenting residuals at the 6-month re-exam — this determines the ongoing rating',
      'CLL veterans accepting 0% when symptomatic — Rai Stage I-IV = 100%',
      'Radiation/Agent Orange veterans not claiming presumptive service connection'
    ],

    ratingNote: 'After the 100% active-disease period ends, rate ALL treatment residuals separately: peripheral neuropathy (DC 8521), cardiac effects (DC 7020), cognitive changes (DC 8045 or mental health), secondary endocrine effects (DC 7903), etc. The combined post-treatment rating can be significant.'
  },

  // ============================================
  // HODGKIN'S LYMPHOMA - DC 7709
  // ============================================
  '7709': {
    condition: "Hodgkin's Lymphoma",
    cfrReference: '38 CFR 4.117, DC 7709',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active Disease or Treatment = 100%',
        definition: "Hodgkin's lymphoma is rated at 100% during active disease or any treatment phase. The 100% continues 6 months after treatment ends, then a mandatory re-examination determines rating based on residuals.",
        source: '38 CFR 4.117, DC 7709',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: "Hodgkin's disease is a presumptive service-connected condition for veterans exposed to herbicide agents (Agent Orange, TCDD). No nexus letter required for Vietnam veterans and others with qualifying herbicide exposure.",
        source: '38 CFR 3.309(e)',
        important: true
      },
      residuals: {
        term: 'Post-Treatment Residuals',
        definition: 'Hodgkin\'s lymphoma treatment (particularly ABVD chemotherapy and radiation) causes significant long-term residuals: cardiac disease, pulmonary fibrosis, secondary cancers, hypothyroidism, peripheral neuropathy. Each is separately ratable.',
        source: '38 CFR 4.117, DC 7709 Note'
      }
    },

    documentationTips: [
      {
        tip: 'File immediately upon diagnosis — 100% applies from claim date.',
        priority: 'critical'
      },
      {
        tip: 'Vietnam veterans: document Agent Orange exposure for presumptive service connection.',
        priority: 'critical'
      },
      {
        tip: 'At the 6-month re-exam, document ALL residuals: cardiac (radiation), pulmonary (bleomycin), neuropathy (vincristine), hypothyroid (neck radiation).',
        priority: 'critical'
      },
      {
        tip: 'Secondary cancers (breast, lung, thyroid) from radiation therapy are separately service-connectable as secondary conditions.',
        priority: 'high'
      }
    ],

    examTips: [
      'File the claim immediately at diagnosis',
      'Agent Orange veterans: confirm presumptive service connection is applied',
      'At post-treatment re-exam: report cardiac symptoms, shortness of breath, fatigue, neuropathy, thyroid symptoms',
      'Bring all treatment records — chemo regimen and radiation fields matter for residual claims',
      'If secondary cancer has developed, file separately as secondary to treatment'
    ],

    ratingNote: "Hodgkin's lymphoma treatment causes some of the most significant long-term residuals of any hematologic cancer. Radiation to the chest frequently causes heart disease and pulmonary fibrosis years later — these are separately ratable as secondary conditions even if the lymphoma is in remission."
  },

  // ============================================
  // NON-HODGKIN'S LYMPHOMA - DC 7715
  // ============================================
  '7715': {
    condition: "Non-Hodgkin's Lymphoma",
    cfrReference: '38 CFR 4.117, DC 7715',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active, Treatment, or Indolent Low-Grade = 100%',
        definition: "NHL is rated 100% during active disease, treatment, OR with indolent non-contiguous phase of low-grade NHL. Low-grade (indolent) NHL that is present and non-contiguous qualifies for 100% even without active treatment — a broader standard than other cancers.",
        source: '38 CFR 4.117, DC 7715',
        important: true
      },
      twoYearRule: {
        term: '2-Year Post-Treatment Re-Examination',
        definition: 'Unlike most cancers (6 months), NHL has a 2-year post-treatment period before mandatory re-examination. The 100% rating continues for 2 full years after treatment ends.',
        source: '38 CFR 4.117, DC 7715 Note',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: "Non-Hodgkin's lymphoma is a presumptive service-connected condition for veterans with Agent Orange exposure. Among the most commonly claimed Agent Orange presumptives.",
        source: '38 CFR 3.309(e)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'File immediately upon NHL diagnosis — Agent Orange veterans get presumptive service connection automatically.',
        priority: 'critical'
      },
      {
        tip: 'For low-grade/indolent NHL: document that the lymphoma is present and non-contiguous — this qualifies for 100% without active treatment.',
        priority: 'critical'
      },
      {
        tip: 'Note the 2-year (not 6-month) post-treatment period for re-examination — 100% continues longer than most conditions.',
        priority: 'high'
      },
      {
        tip: 'Document all residuals at the 2-year re-exam: peripheral neuropathy, cardiac effects, pulmonary effects, fatigue.',
        priority: 'high'
      }
    ],

    examTips: [
      'File at diagnosis — presumptive service connection for Agent Orange veterans requires no nexus letter',
      'For indolent NHL: confirm examiner knows the "indolent non-contiguous" standard = 100% even without treatment',
      'At the 2-year re-exam: document all residuals comprehensively',
      'Bring pathology report confirming NHL type (indolent vs. aggressive) — this affects the rating standard'
    ],

    ratingNote: "NHL has the most favorable post-treatment rating period in the rating schedule — 2 years at 100% after treatment ends (vs. 6 months for most other cancers). Low-grade indolent NHL in a non-contiguous phase also qualifies for 100% without requiring active treatment."
  },

  // ============================================
  // MULTIPLE MYELOMA - DC 7712
  // ============================================
  '7712': {
    condition: 'Multiple Myeloma',
    cfrReference: '38 CFR 4.117, DC 7712',

    keyDefinitions: {
      symptomatic: {
        term: 'Symptomatic Myeloma = 100%',
        definition: 'Symptomatic multiple myeloma is rated at 100%. Asymptomatic, smoldering, or MGUS (monoclonal gammopathy of undetermined significance) = 0%. The 100% continues for 5 years after diagnosis of symptomatic MM.',
        source: '38 CFR 4.117, DC 7712',
        important: true
      },
      fiveYearRule: {
        term: '5-Year Post-Diagnosis Period',
        definition: 'The 100% evaluation continues for 5 years after the diagnosis of symptomatic multiple myeloma, then mandatory re-examination. This is the longest fixed post-diagnosis period in the hemic schedule.',
        source: '38 CFR 4.117, DC 7712 Note 2',
        important: true
      },
      agentOrange: {
        term: 'Agent Orange Presumptive',
        definition: 'Multiple myeloma is a presumptive service-connected condition for veterans with Agent Orange (herbicide) exposure. File at diagnosis — no nexus letter required.',
        source: '38 CFR 3.309(e)',
        important: true
      },
      mgusToMyeloma: {
        term: 'MGUS Progression to Myeloma',
        definition: 'MGUS (0%) may progress to smoldering myeloma and then symptomatic myeloma (100%). When MGUS or smoldering myeloma progresses to symptomatic disease, the rating increases to 100% from the date of new claim.',
        source: '38 CFR 4.117, DC 7712 Note 1'
      }
    },

    documentationTips: [
      {
        tip: 'File immediately upon diagnosis of symptomatic myeloma — Agent Orange presumptive, no nexus required.',
        priority: 'critical'
      },
      {
        tip: 'Get hematology records confirming symptomatic disease: bone lesions, hypercalcemia, renal impairment, anemia, or plasmacytoma.',
        priority: 'critical'
      },
      {
        tip: 'If currently rated at 0% for MGUS and disease has progressed, file a new claim for increase to 100%.',
        priority: 'critical'
      },
      {
        tip: 'At the 5-year re-exam, document all myeloma-related organ damage: renal (DC 7530), bone (DC 5235/5003), neuropathy (DC 8521).',
        priority: 'high'
      }
    ],

    examTips: [
      'Confirm symptomatic vs. smoldering status — symptomatic = 100%, smoldering/MGUS = 0%',
      'Agent Orange veterans: confirm presumptive service connection is applied',
      'Bring bone marrow biopsy, SPEP, imaging, and organ damage documentation',
      'At the 5-year re-exam: report all end-organ damage for separate residual ratings'
    ],

    ratingNote: 'Multiple myeloma = 100% for 5 full years after symptomatic diagnosis (longest fixed period in hemic schedule). MGUS is 0% but should be monitored — if it progresses to symptomatic disease, immediately file a claim for increase.'
  },

  // ============================================
  // POLYCYTHEMIA VERA - DC 7704
  // ============================================
  '7704': {
    condition: 'Polycythemia Vera',
    cfrReference: '38 CFR 4.117, DC 7704',

    keyDefinitions: {
      ratingScale: {
        term: 'Polycythemia Vera Rating Scale — Phlebotomy-Driven',
        definition: 'Ratings: 10% (phlebotomy ≤3/year or intermittent biologic/interferon to maintain all values at range), 30% (phlebotomy 4–5/year or continuous biologic/myelosuppressive therapy to maintain platelets <200,000 or WBC <12,000), 60% (phlebotomy ≥6/year or molecularly targeted therapy to control RBC count), 100% (requiring transplant or chemotherapy to ameliorate symptom burden).',
        source: '38 CFR 4.117, DC 7704',
        important: true
      },
      phlebotomyFrequency: {
        term: 'Phlebotomy Frequency — Key Metric',
        definition: 'The number of phlebotomies (therapeutic blood draws) per year is the primary metric for PV ratings. Track exact dates and count per calendar year.',
        source: '38 CFR 4.117, DC 7704',
        important: true
      },
      separateComplications: {
        term: 'Complications Rated Separately',
        definition: 'Hypertension, gout, stroke, and thrombotic disease caused by PV are rated separately under their respective DCs and combined with the PV rating.',
        source: '38 CFR 4.117, DC 7704 Note 1',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Track exact phlebotomy dates and total count per year — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Document all medications: hydroxyurea, ruxolitinib, interferon, aspirin — drug complexity reflects severity.',
        priority: 'high'
      },
      {
        tip: 'Separately claim PV complications: hypertension, gout, DVT/PE, stroke — each is additionally ratable.',
        priority: 'critical'
      },
      {
        tip: 'Document bone marrow biopsy confirming diagnosis and JAK2 mutation status.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report exact phlebotomy frequency: how many times in the past 12 months?',
      'List all medications for PV management',
      'Report all complications: blood clots, strokes, gout, hypertension',
      'Bring hematology records with CBC trends and bone marrow biopsy'
    ]
  },

  // ============================================
  // IMMUNE THROMBOCYTOPENIA (ITP) - DC 7705
  // ============================================
  '7705': {
    condition: 'Immune Thrombocytopenia (ITP)',
    cfrReference: '38 CFR 4.117, DC 7705',

    keyDefinitions: {
      ratingScale: {
        term: 'ITP Rating Scale — Platelet Count Based',
        definition: 'Ratings: 0% (platelet count >50,000 and asymptomatic, or in remission), 10% (platelet 30,001–50,000, no treatment), 30% (platelet 30,001–50,000 with oral steroids or IVIG), 70% (platelet 30,001–50,000 with immunosuppressive therapy OR hospitalization history for severe bleeding), 100% (platelet ≤30,000 despite treatment, OR requiring chemotherapy for chronic refractory ITP).',
        source: '38 CFR 4.117, DC 7705',
        important: true
      },
      splenectomy: {
        term: 'Splenectomy — Separately Rated',
        definition: 'Splenectomy performed for ITP is rated separately under DC 7706 (20%) and combined with the ITP rating. This is explicitly required in the CFR note.',
        source: '38 CFR 4.117, DC 7705 Note 1',
        important: true
      },
      plateletCount: {
        term: 'Platelet Count — Key Metric',
        definition: 'The actual platelet count drives the rating. Keep records of serial platelet counts — the lowest sustained count (not a single nadir) is most relevant.',
        source: '38 CFR 4.117, DC 7705'
      }
    },

    documentationTips: [
      {
        tip: 'Get serial platelet count labs — the sustained count level determines the rating tier.',
        priority: 'critical'
      },
      {
        tip: 'Document hospitalizations for bleeding episodes — these support the 70% rating tier.',
        priority: 'high'
      },
      {
        tip: 'If splenectomy was performed, file separately for DC 7706 (20%) — it is additive.',
        priority: 'critical'
      },
      {
        tip: 'Track all treatments: steroids, IVIG, rituximab, eltrombopag — drug escalation reflects severity.',
        priority: 'high'
      },
      {
        tip: 'Document bleeding episodes: GI bleeds, intracranial bleeding, heavy menstrual bleeding, bruising requiring treatment.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring serial platelet count records — not just the most recent one',
      'Report hospitalizations for severe bleeding',
      'If splenectomy was done for ITP, confirm it is being rated separately under DC 7706',
      'List all medications tried and current treatment regimen',
      'Report bleeding symptoms: easy bruising, petechiae, prolonged bleeding'
    ]
  },

  // ============================================
  // APLASTIC ANEMIA - DC 7716
  // ============================================
  '7716': {
    condition: 'Aplastic Anemia',
    cfrReference: '38 CFR 4.117, DC 7716',

    keyDefinitions: {
      ratingScale: {
        term: 'Aplastic Anemia Rating Scale — Transfusion/Infection Frequency',
        definition: 'Ratings: 30% (transfusion or infection requiring hospitalization avg once/year), 60% (transfusion avg every 3 months OR infections avg every 3 months OR continuous immunosuppressive therapy), 100% (requiring transplant OR transfusion/infection recurring avg every 6 weeks).',
        source: '38 CFR 4.117, DC 7716',
        important: true
      },
      transfusionFrequency: {
        term: 'Transfusion Frequency — Key Metric',
        definition: 'The average frequency of red cell or platelet transfusions per year is the primary rating driver. Track every transfusion with date and type.',
        source: '38 CFR 4.117, DC 7716',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Track every transfusion with date, type (RBC vs. platelets), and facility — frequency is the key rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Document all hospitalizations for infections or transfusion-related complications.',
        priority: 'high'
      },
      {
        tip: 'Get bone marrow biopsy documenting aplastic anemia and cellularity.',
        priority: 'critical'
      },
      {
        tip: 'Document service nexus: toxic chemical exposure, radiation, medication side effects.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report exact transfusion frequency: how many times per year on average?',
      'Bring bone marrow biopsy results',
      'Document hospitalizations for infections',
      'Report current treatment: immunosuppressives, growth factors, or transplant history',
      'Describe the service-connected cause of aplastic anemia'
    ]
  },

  // ============================================
  // ESSENTIAL THROMBOCYTHEMIA / PRIMARY MYELOFIBROSIS - DC 7718
  // ============================================
  '7718': {
    condition: 'Essential Thrombocythemia / Primary Myelofibrosis',
    cfrReference: '38 CFR 4.117, DC 7718',

    keyDefinitions: {
      ratingScale: {
        term: 'ET/PMF Rating Scale',
        definition: 'Ratings: 0% (asymptomatic), 30% (continuous/intermittent myelosuppressive/chemo/interferon to maintain platelets 200,000–400,000 or WBC 4,000–10,000), 70% (continuous/intermittent therapy to maintain platelets <500,000), 100% (requiring continuous myelosuppressive therapy OR 6 months post-transplant/chemotherapy/interferon treatment).',
        source: '38 CFR 4.117, DC 7718',
        important: true
      },
      leukemicTransformation: {
        term: 'Leukemic Transformation',
        definition: 'If ET or PMF transforms to leukemia, re-rate as leukemia under DC 7703 (100% during active disease). File an increase claim immediately upon transformation.',
        source: '38 CFR 4.117, DC 7718 Note 1',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document all medications: hydroxyurea, anagrelide, ruxolitinib, interferon — type and continuity matter.',
        priority: 'critical'
      },
      {
        tip: 'Get serial CBC with platelets and WBC — counts drive the rating tier.',
        priority: 'high'
      },
      {
        tip: 'Document bone marrow biopsy confirming diagnosis and fibrosis grade.',
        priority: 'high'
      },
      {
        tip: 'If leukemic transformation occurs, immediately file for increase under DC 7703.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report current and past medications for ET/PMF management',
      'Bring CBC records showing platelet and WBC trends',
      'Report constitutional symptoms: fatigue, night sweats, weight loss, splenomegaly',
      'Report any thromboembolic or hemorrhagic events'
    ]
  },

  // ============================================
  // CHRONIC MYELOGENOUS LEUKEMIA - DC 7719
  // ============================================
  '7719': {
    condition: 'Chronic Myelogenous Leukemia (CML)',
    cfrReference: '38 CFR 4.117, DC 7719',

    keyDefinitions: {
      ratingScale: {
        term: 'CML Rating Scale — TKI Therapy Based',
        definition: 'Ratings: 30% (in apparent remission on continuous tyrosine kinase inhibitor [TKI] therapy), 60% (requiring intermittent myelosuppressive, molecularly targeted TKI therapy, or interferon when NOT in apparent remission), 100% (requiring transplant OR continuous myelosuppressive/immunosuppressive therapy).',
        source: '38 CFR 4.117, DC 7719',
        important: true
      },
      tkiTherapy: {
        term: 'Tyrosine Kinase Inhibitors (TKIs)',
        definition: 'TKIs (imatinib/Gleevec, dasatinib, nilotinib, bosutinib, ponatinib) are the mainstay of CML treatment. CML in molecular remission on a TKI = 30% minimum. Not in remission on TKI = 60%.',
        source: '38 CFR 4.117, DC 7719',
        important: true
      },
      agentOrange: {
        term: 'Radiation Exposure Presumptive',
        definition: 'CML is associated with ionizing radiation exposure. Veterans with service-related radiation exposure (nuclear testing, Hiroshima/Nagasaki cleanup) may qualify for presumptive service connection.',
        source: '38 CFR 3.309(d)(2)'
      }
    },

    documentationTips: [
      {
        tip: 'Document TKI therapy: which drug, dose, how long, and whether molecular remission has been achieved.',
        priority: 'critical'
      },
      {
        tip: 'Get BCR-ABL PCR testing showing current molecular response level.',
        priority: 'high'
      },
      {
        tip: 'Document radiation exposure during service if applicable.',
        priority: 'high'
      },
      {
        tip: 'If leukemic blast transformation occurs, file for increase under DC 7703.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report TKI medication and whether you are in molecular remission',
      'Bring BCR-ABL PCR results',
      'Report any treatment side effects that affect daily functioning',
      'Radiation-exposed veterans: document exposure events for service connection'
    ]
  },

  // ============================================
  // MYELODYSPLASTIC SYNDROMES - DC 7725
  // ============================================
  '7725': {
    condition: 'Myelodysplastic Syndromes (MDS)',
    cfrReference: '38 CFR 4.117, DC 7725',

    keyDefinitions: {
      ratingScale: {
        term: 'MDS Rating Scale — Transfusion/Hospitalization Driven',
        definition: 'Ratings: 30% (1–3 transfusions/year OR 1–2 hospitalizations for infections/year OR ongoing biologic/ESA therapy ≤12 weeks/year), 60% (≥4 transfusions/year OR ≥3 hospitalizations for infections/year), 100% (requiring transplant or chemotherapy).',
        source: '38 CFR 4.117, DC 7725',
        important: true
      },
      benzeneExposure: {
        term: 'Benzene / Toxic Exposure Nexus',
        definition: 'MDS is associated with prior benzene exposure, chemotherapy, and radiation. Veterans exposed to benzene-containing fuels, solvents, or chemicals during service may have a service nexus. PACT Act toxic exposure may also apply.',
        source: '38 CFR 3.304 / PACT Act (2022)',
        important: true
      },
      transfusionCount: {
        term: 'Transfusion Count — Key Metric',
        definition: 'Track every blood and platelet transfusion with exact dates. The number of transfusions per 12-month period directly drives the rating: 1–3 = 30%, ≥4 = 60%.',
        source: '38 CFR 4.117, DC 7725'
      }
    },

    documentationTips: [
      {
        tip: 'Track every transfusion with date and type — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Document hospitalizations for infections — count per 12-month period for rating tier.',
        priority: 'critical'
      },
      {
        tip: 'Document benzene, solvent, or fuel exposure during service for nexus.',
        priority: 'high'
      },
      {
        tip: 'Get bone marrow biopsy and cytogenetics confirming MDS.',
        priority: 'critical'
      },
      {
        tip: 'If MDS progresses to AML, file for increase under DC 7703 immediately.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Report exact transfusion frequency per year',
      'Report hospitalizations for infections in the past year',
      'Bring bone marrow biopsy and cytogenetics results',
      'Describe service exposure: fuels, solvents, benzene, radiation',
      'Report ESA injections (Procrit/Aranesp) and growth factor treatment history'
    ]
  },

  // ============================================
  // SICKLE CELL ANEMIA - DC 7714
  // ============================================
  '7714': {
    condition: 'Sickle Cell Anemia',
    cfrReference: '38 CFR 4.117, DC 7714',

    keyDefinitions: {
      ratingScale: {
        term: 'Sickle Cell Anemia Rating Scale — Crisis Frequency',
        definition: 'Ratings: 10% (asymptomatic with identifiable organ impairment), 30% (1–2 painful episodes/year), 60% (3 painful episodes/year or symptoms precluding light manual labor), 100% (≥4 painful episodes/year with anemia, thrombosis, infarction, and residual symptoms precluding even light manual labor).',
        source: '38 CFR 4.117, DC 7714',
        important: true
      },
      sickleTraitNote: {
        term: 'Sickle Cell TRAIT — Not Ratable',
        definition: 'Sickle cell trait alone (AS genotype, one copy of the sickle gene) is NOT a ratable disability per the CFR note. Only sickle cell disease (SS, SC, S-beta-thal) with directly attributable pathological findings is ratable.',
        source: '38 CFR 4.117, DC 7714 Note',
        important: true
      },
      organDamage: {
        term: 'Organ Damage — Separately Ratable',
        definition: 'Sickle cell causes chronic organ damage: stroke, retinopathy, avascular necrosis, renal disease, pulmonary hypertension. Each is separately ratable as a secondary condition under 38 CFR 3.310.',
        source: '38 CFR 3.310'
      }
    },

    documentationTips: [
      {
        tip: 'Track painful sickle cell episodes per year with dates, locations, severity, and treatment required.',
        priority: 'critical'
      },
      {
        tip: 'Document hospitalizations for vaso-occlusive crises — these are the most objective evidence of episode frequency.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim organ damage: stroke, AVN of hips/shoulders, retinopathy, nephropathy, pulmonary hypertension.',
        priority: 'critical'
      },
      {
        tip: 'Get hematology documentation confirming sickle cell disease (not just trait): hemoglobin electrophoresis results.',
        priority: 'high'
      },
      {
        tip: 'Document the occupational impact: inability to perform physical labor during and after crises.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report painful episode frequency: how many per year and where — skin, joints, bones, organs',
      'Bring hemoglobin electrophoresis confirming disease (not trait)',
      'Report all hospitalizations for crises in the past year',
      'Describe occupational limitations: can you perform light manual labor?',
      'Report all organ damage from chronic sickling: bone necrosis, vision changes, kidney problems'
    ],

    commonMistakes: [
      'Not claiming secondary conditions from organ damage — stroke, AVN, and retinopathy are separately ratable',
      'Confusing sickle cell disease (ratable) with sickle cell trait (not ratable)',
      'Not counting crisis frequency precisely — this directly drives the rating from 30% to 100%'
    ]
  },

  // ============================================
  // IRON DEFICIENCY ANEMIA - DC 7720
  // ============================================
  '7720': {
    condition: 'Iron Deficiency Anemia',
    cfrReference: '38 CFR 4.117, DC 7720',

    keyDefinitions: {
      ratingScale: {
        term: 'Iron Deficiency Anemia Rating Scale',
        definition: 'Ratings: 0% (asymptomatic or dietary modification only), 10% (requires continuous oral iron supplementation OR at least 1 but <4 IV iron infusions/year), 30% (≥4 IV iron infusions/year). NOTE: Do not rate iron deficiency anemia due to blood loss under this code — rate the condition causing the blood loss instead.',
        source: '38 CFR 4.117, DC 7720',
        important: true
      },
      ivIronThreshold: {
        term: 'IV Iron Infusion Frequency — Key Metric',
        definition: 'Intravenous iron infusions are the key escalation factor: 4+ infusions/year = 30%. Track every infusion with date and facility.',
        source: '38 CFR 4.117, DC 7720',
        important: true
      },
      bloodLossNote: {
        term: 'Blood Loss Anemia — Rate the Cause',
        definition: 'Iron deficiency from blood loss (GI bleed, heavy periods, bleeding disorder) should be rated under the condition causing the blood loss, not DC 7720. File the primary cause (e.g., peptic ulcer, endometriosis) as the service-connected condition.',
        source: '38 CFR 4.117, DC 7720 Note'
      }
    },

    documentationTips: [
      {
        tip: 'Track IV iron infusions per year — ≥4 infusions/year = 30% rating.',
        priority: 'critical'
      },
      {
        tip: 'Identify and document the service-connected cause of iron deficiency.',
        priority: 'critical'
      },
      {
        tip: 'Get ferritin, serum iron, TIBC, and CBC labs confirming iron deficiency anemia.',
        priority: 'high'
      },
      {
        tip: 'If caused by blood loss (GI, gynecological), file separately for the causative condition.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report IV infusion frequency: how many in the past year and why oral iron is insufficient',
      'Identify the cause of iron deficiency: GI absorption problem, blood loss, or other',
      'Bring ferritin and CBC lab results',
      'Report impact on energy, exercise tolerance, and work capacity'
    ]
  },

  // ============================================
  // PERNICIOUS ANEMIA (B12 DEFICIENCY) - DC 7722
  // ============================================
  '7722': {
    condition: 'Pernicious Anemia / B12 Deficiency Anemia',
    cfrReference: '38 CFR 4.117, DC 7722',

    keyDefinitions: {
      ratingScale: {
        term: 'Pernicious Anemia Rating Scale',
        definition: 'Ratings: 10% (requires continuous B12 injections, sublingual, high-dose oral, or nasal B12), 100% (initial diagnosis requiring transfusion for severe anemia OR CNS impairment: encephalopathy, myelopathy, severe peripheral neuropathy requiring parenteral B12 therapy — continues 6 months post-treatment then rate residuals).',
        source: '38 CFR 4.117, DC 7722',
        important: true
      },
      neurologicalResiduals: {
        term: 'Neurological Residuals — Rate Separately',
        definition: 'After the 100%/initial period, neurological residuals from B12 deficiency (peripheral neuropathy, subacute combined degeneration, dementia) are rated separately under their applicable neurological DCs.',
        source: '38 CFR 4.117, DC 7722 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the form of B12 supplementation required: injection vs. oral — injections reflect true pernicious anemia.',
        priority: 'high'
      },
      {
        tip: 'Document neurological complications: peripheral neuropathy, balance problems, cognitive changes.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim neurological residuals under the appropriate neurological DCs.',
        priority: 'critical'
      },
      {
        tip: 'Get intrinsic factor antibody and parietal cell antibody tests to confirm autoimmune pernicious anemia.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report the B12 supplementation method: injections, sublingual, high-dose oral',
      'Report all neurological symptoms: tingling, numbness, balance problems, memory issues',
      'Bring labs: B12 level, CBC, intrinsic factor antibody',
      'Separately report neurological symptoms for additional ratings under neurological DCs'
    ]
  },

  // ============================================
  // HEMOLYTIC ANEMIA - DC 7723
  // ============================================
  '7723': {
    condition: 'Acquired Hemolytic Anemia',
    cfrReference: '38 CFR 4.117, DC 7723',

    keyDefinitions: {
      ratingScale: {
        term: 'Hemolytic Anemia Rating Scale — Immunosuppressive Courses',
        definition: 'Ratings: 0% (asymptomatic), 10% (1 course immunosuppressive therapy/year), 30% (2–3 courses/year), 60% (≥4 courses/year), 100% (requiring bone marrow transplant OR continuous IV/immunosuppressive therapy). Splenectomy rated separately under DC 7706.',
        source: '38 CFR 4.117, DC 7723',
        important: true
      },
      splenectomy: {
        term: 'Splenectomy — Separately Rated',
        definition: 'Splenectomy for hemolytic anemia is separately rated under DC 7706 (20%) and combined with the DC 7723 rating.',
        source: '38 CFR 4.117, DC 7723 Note 2',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Track courses of immunosuppressive therapy per year — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'If splenectomy was performed, file separately for DC 7706 — it is additive.',
        priority: 'critical'
      },
      {
        tip: 'Get labs confirming hemolysis: LDH, haptoglobin, reticulocyte count, direct Coombs test.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report immunosuppressive therapy courses per year',
      'If splenectomy was done, confirm it is being rated separately',
      'Bring labs showing hemolysis markers',
      'Report transfusion history and frequency'
    ]
  },

  // ============================================
  // FOLATE DEFICIENCY ANEMIA - DC 7721
  // ============================================
  '7721': {
    condition: 'Folate Deficiency Anemia',
    cfrReference: '38 CFR 4.117, DC 7721',

    keyDefinitions: {
      ratingScale: {
        term: 'Folate Deficiency Rating Scale',
        definition: 'Ratings: 0% (asymptomatic or dietary modification only), 10% (requires continuous high-dose oral folate supplementation).',
        source: '38 CFR 4.117, DC 7721',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the service-connected cause: malabsorption, alcoholism from service-related PTSD, medication effects.',
        priority: 'critical'
      },
      {
        tip: 'Get folate, B12, and CBC labs confirming diagnosis.',
        priority: 'high'
      },
      {
        tip: 'Document high-dose supplementation requirement — this is the only compensable criterion.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report continuous supplementation requirement and dose',
      'Identify the service-connected cause of folate deficiency',
      'Bring lab results confirming low folate levels and macrocytic anemia'
    ]
  },

  // ============================================
  // SOLITARY PLASMACYTOMA - DC 7724
  // ============================================
  '7724': {
    condition: 'Solitary Plasmacytoma',
    cfrReference: '38 CFR 4.117, DC 7724',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active Disease or Treatment = 100%',
        definition: 'Solitary plasmacytoma is rated 100% during active disease or any treatment phase (surgery, radiation, chemotherapy, stem cell transplant). Continues 6 months post-treatment, then rate residuals.',
        source: '38 CFR 4.117, DC 7724',
        important: true
      },
      progressionToMyeloma: {
        term: 'Progression to Multiple Myeloma',
        definition: 'If solitary plasmacytoma transforms to multiple myeloma, re-rate as symptomatic multiple myeloma under DC 7712 (100%). File an increase claim immediately upon transformation.',
        source: '38 CFR 4.117, DC 7724 Note 2',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'File immediately upon diagnosis — active disease = 100%.',
        priority: 'critical'
      },
      {
        tip: 'If it transforms to multiple myeloma, immediately file for increase under DC 7712.',
        priority: 'critical'
      },
      {
        tip: 'At the 6-month re-exam, document all residuals: bone effects, treatment neuropathy, secondary effects.',
        priority: 'high'
      }
    ],

    examTips: [
      'File at diagnosis — do not wait for treatment to begin',
      'If progression to myeloma occurs, file immediately for increase',
      'At post-treatment re-exam: report all residuals from radiation/surgery/chemotherapy',
      'Bring PET scan, MRI, and bone marrow biopsy results'
    ]
  },

  // ============================================
// SYSTEM 9: DENTAL, VISUAL & EAR
// ratingEnhancements.js additions
// Dental: 38 CFR 4.150 | Eye: 38 CFR 4.79 | Ear: 38 CFR 4.85–4.87
// Add all entries below to the RATING_ENHANCEMENTS object.
// ============================================

  // ============================================
  // TMJ DISORDER - DC 9905
  // ============================================
  '9905': {
    condition: 'Temporomandibular Disorder (TMD/TMJ)',
    cfrReference: '38 CFR 4.150, DC 9905',

    keyDefinitions: {
      verticalOpening: {
        term: 'Maximum Unassisted Vertical Opening — Key Metric',
        definition: 'Normal jaw opening is 35–50 mm. Ratings based on interincisal range: 0–10 mm (40–50%), 11–20 mm (30–40%), 21–29 mm (20–40%), 30–34 mm (10–30%). Within each range, dietary restrictions elevate the rating. Lateral excursion of 0–4 mm = 10% (not combinable with vertical ratings).',
        source: '38 CFR 4.150, DC 9905',
        important: true
      },
      dietaryRestriction: {
        term: 'Dietary Restrictions — Elevate the Rating',
        definition: 'Within each vertical opening range, the presence of physician-verified dietary restrictions to mechanically altered foods (full liquid, puree, soft, semi-solid) elevates the rating. Dietary restriction must be recorded by a physician — patient self-report alone is insufficient.',
        source: '38 CFR 4.150, DC 9905 Note 3',
        important: true
      },
      noCombo: {
        term: 'Lateral Excursion — Cannot Combine with Vertical',
        definition: 'The 10% rating for 0–4 mm lateral excursion cannot be combined with ratings for limited vertical opening. Rate under whichever criterion is higher.',
        source: '38 CFR 4.150, DC 9905 Note 1',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Jandreau v. Nicholson',
        citation: '492 F.3d 1372 (Fed. Cir. 2007)',
        year: 2007,
        holding: 'Veterans are competent to testify about observable symptoms including jaw pain, clicking, and limited opening.',
        practicalApplication: 'Your lay statement about jaw symptoms is competent evidence — but dietary restrictions must be physician-documented.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Measure and document maximum unassisted vertical opening in millimeters — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Get your physician or dentist to document dietary restrictions in the medical record — verbal restrictions do not count.',
        priority: 'critical'
      },
      {
        tip: 'Document both vertical opening AND lateral excursion — rate under whichever is higher.',
        priority: 'high'
      },
      {
        tip: 'Track flare-up measurements if opening is worse on bad days — worst documented measurement matters.',
        priority: 'high'
      },
      {
        tip: 'Document service nexus: facial trauma, blast exposure, parafunctional habits from service stress.',
        priority: 'high'
      },
      {
        tip: 'Get imaging: panoramic X-ray, CT, or MRI of TMJ documenting disc displacement or condylar changes.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Measure jaw opening at the C&P exam and report if the examiner does not measure it',
      'Report your worst-day jaw opening — flare-up limitations matter',
      'Confirm your doctor has documented dietary restrictions in your medical records before the exam',
      'Report both vertical opening limitation AND lateral movement limitation',
      'Describe how TMJ affects eating, speaking, and daily activities'
    ],

    commonMistakes: [
      'Not having dietary restrictions documented by a physician — self-report is insufficient',
      'Not measuring jaw opening in millimeters — vague descriptions of "limited opening" are less persuasive',
      'Not documenting worst-day measurements during flare-ups'
    ]
  },

  // ============================================
  // TOOTH LOSS - DC 9913
  // ============================================
  '9913': {
    condition: 'Loss of Teeth Due to Bone Loss',
    cfrReference: '38 CFR 4.150, DC 9913',

    keyDefinitions: {
      bonelossBasis: {
        term: 'Bone Loss Requirement',
        definition: 'DC 9913 applies ONLY to tooth loss caused by loss of substance of the body of the maxilla or mandible through trauma or disease (e.g., osteomyelitis, cancer, jaw fracture). It does NOT apply to tooth loss from periodontal disease, decay, or normal extraction — those are not ratable.',
        source: '38 CFR 4.150, DC 9913 Note',
        important: true
      },
      ratingScale: {
        term: 'Tooth Loss Rating Scale',
        definition: 'Ratings: 0% (prosthetically restorable), 10% (all upper anterior OR all lower anterior missing, not restorable), 20% (all upper+lower anterior missing OR all upper+lower posterior on one side missing), 30% (all upper OR all lower teeth missing), 40% (all teeth missing, not restorable). Prosthetic replaceability determines 0% vs. compensable.',
        source: '38 CFR 4.150, DC 9913',
        important: true
      },
      prosthesis: {
        term: 'Prosthetic Replaceability — Key Distinction',
        definition: 'If lost teeth CAN be replaced by a suitable prosthesis, the rating is 0%. Rating is only compensable when prosthetic replacement is not possible due to the underlying bone loss.',
        source: '38 CFR 4.150, DC 9913',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document that bone loss is from trauma or disease (osteomyelitis, jaw fracture, cancer) — not periodontal disease.',
        priority: 'critical'
      },
      {
        tip: 'Get dental imaging (panoramic X-ray) documenting the bone loss and its extent.',
        priority: 'critical'
      },
      {
        tip: 'Document whether prosthetic replacement is feasible — inability to wear prosthesis elevates the rating.',
        priority: 'high'
      },
      {
        tip: 'Note which specific tooth groups are missing: anterior, posterior, upper, lower.',
        priority: 'high'
      }
    ],

    examTips: [
      'Confirm the cause of tooth loss is bone loss from trauma or disease — not periodontal disease',
      'Bring dental X-rays showing bone loss',
      'Report whether you can wear a prosthesis or dentures successfully',
      'Identify exactly which teeth are missing: upper anterior, lower anterior, posterior groups'
    ],

    ratingNote: 'Tooth loss from periodontal disease is explicitly NOT ratable under DC 9913. The bone loss must result from trauma (jaw fracture, bullet wound) or bone disease (osteomyelitis, osteoradionecrosis). This distinction is critical to eligibility.'
  },

  // ============================================
  // MANDIBLE NONUNION - DC 9903
  // ============================================
  '9903': {
    condition: 'Mandible Nonunion',
    cfrReference: '38 CFR 4.150, DC 9903',

    keyDefinitions: {
      ratingScale: {
        term: 'Mandible Nonunion Rating Scale',
        definition: 'Ratings: 10% (moderate, without false motion), 30% (severe, with false motion). Diagnosis must be confirmed by diagnostic imaging studies.',
        source: '38 CFR 4.150, DC 9903',
        important: true
      },
      falseMotion: {
        term: 'False Motion — Key Escalation Factor',
        definition: 'False motion means abnormal mobility of jaw fragments at the nonunion site — the mandible moves where it should be rigid. Presence of false motion escalates from 10% to 30%.',
        source: '38 CFR 4.150, DC 9903',
        important: true
      },
      imagingRequired: {
        term: 'Imaging Required',
        definition: 'Nonunion must be confirmed by diagnostic imaging (X-ray, CT). Clinical examination alone is insufficient to establish the diagnosis for rating purposes.',
        source: '38 CFR 4.150, DC 9903'
      }
    },

    documentationTips: [
      {
        tip: 'Get CT or X-ray documenting the nonunion — imaging is required for diagnosis.',
        priority: 'critical'
      },
      {
        tip: 'Document false motion — have the examiner specifically assess and document abnormal fragment mobility.',
        priority: 'critical'
      },
      {
        tip: 'Track functional limitations: jaw pain, difficulty chewing, dietary restrictions.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring imaging (CT or X-ray) confirming the nonunion',
      'Ask the examiner to specifically assess for false motion — this doubles the rating',
      'Report jaw instability, clicking, or abnormal movement at the fracture site',
      'Describe functional impact: chewing difficulty, pain, dietary restrictions'
    ]
  },

  // ============================================
  // MAXILLA MALUNION/NONUNION - DC 9916
  // ============================================
  '9916': {
    condition: 'Maxilla Malunion or Nonunion',
    cfrReference: '38 CFR 4.150, DC 9916',

    keyDefinitions: {
      ratingScale: {
        term: 'Maxilla Nonunion/Malunion Rating Scale',
        definition: 'Nonunion: 10% (without false motion), 30% (with false motion — confirmed by imaging). Malunion: 0% (mild open bite), 10% (moderate open bite), 30% (severe open bite). Nonunion requires imaging confirmation; severity depends on false motion (nonunion) or degree of bite displacement (malunion).',
        source: '38 CFR 4.150, DC 9916',
        important: true
      },
      openBite: {
        term: 'Open Bite Severity',
        definition: 'For malunion: the degree of anterior or posterior open bite (gap when teeth are closed) drives the rating: mild = 0%, moderate = 10%, severe = 30%.',
        source: '38 CFR 4.150, DC 9916',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get CT or panoramic X-ray confirming maxillary nonunion or malunion.',
        priority: 'critical'
      },
      {
        tip: 'Document open bite measurement in millimeters — severity drives the malunion rating.',
        priority: 'high'
      },
      {
        tip: 'Document false motion for nonunion — abnormal fragment mobility escalates to 30%.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring imaging confirming the nonunion or malunion',
      'Report open bite: how far apart are your upper and lower teeth when you bite down?',
      'For nonunion: ask the examiner to check for abnormal maxillary mobility',
      'Describe functional impact: chewing, bite alignment, speech, pain'
    ]
  },

  // ============================================
  // BENIGN ORAL NEOPLASM - DC 9917
  // ============================================
  '9917': {
    condition: 'Benign Neoplasm of Oral Cavity',
    cfrReference: '38 CFR 4.150, DC 9917',

    keyDefinitions: {
      ratesAsResiduals: {
        term: 'Rates as Residuals — Loss of Bone/Teeth and Scarring',
        definition: 'Benign oral neoplasms (DC 9917) are rated based on their residual effects: loss of supporting bone or teeth (rate under DC 9913/9903/9916) and functional impairment from scarring (rate under DC 7800/7804). There is no standalone rating formula for DC 9917.',
        source: '38 CFR 4.150, DC 9917',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document bone loss from the neoplasm or its surgical removal — rate under applicable bone/tooth loss DCs.',
        priority: 'critical'
      },
      {
        tip: 'Document scarring and its functional impact on speech, eating, and mouth opening.',
        priority: 'high'
      },
      {
        tip: 'File for each residual separately: bone loss (9903/9913/9916), scarring (7800/7804), TMJ effects (9905).',
        priority: 'critical'
      }
    ],

    examTips: [
      'Confirm examiner is evaluating ALL residuals: bone loss, tooth loss, scarring, and TMJ dysfunction',
      'Report functional limitations: restricted opening, difficulty eating, speech changes',
      'Bring surgical operative notes documenting extent of resection',
      'Report all affected structures: teeth, bone, soft tissue'
    ]
  },

  // ============================================
  // MALIGNANT ORAL NEOPLASM - DC 9918
  // ============================================
  '9918': {
    condition: 'Malignant Neoplasm of Oral Cavity',
    cfrReference: '38 CFR 4.150, DC 9918',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active Disease or Treatment = 100%',
        definition: 'Malignant oral neoplasm is rated at 100% during active disease or any treatment phase (surgery, radiation, chemotherapy). 100% continues for 6 months after treatment ends, then mandatory re-examination for residual-based rating.',
        source: '38 CFR 4.150, DC 9918',
        important: true
      },
      residualRating: {
        term: 'Post-Treatment Residuals',
        definition: 'After the 6-month period, rate residuals: loss of supporting bone/teeth and scarring-based functional impairment. Osteoradionecrosis from radiation is a significant residual. Rate each under the applicable DC.',
        source: '38 CFR 4.150, DC 9918 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'File immediately upon diagnosis — active malignancy = 100%.',
        priority: 'critical'
      },
      {
        tip: 'At the 6-month re-exam, document ALL residuals: bone loss, tooth loss, trismus, xerostomia, dysphagia, osteoradionecrosis.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim osteoradionecrosis from radiation therapy under DC 9900.',
        priority: 'high'
      },
      {
        tip: 'Document dysphagia, speech changes, and trismus as functional impairments for residual rating.',
        priority: 'high'
      }
    ],

    examTips: [
      'File at diagnosis — do not wait for treatment to begin',
      'At post-treatment re-exam: report all residuals comprehensively',
      'Report trismus (limited opening), dysphagia, xerostomia, and pain',
      'If osteoradionecrosis has developed, report it specifically for separate rating'
    ]
  },

  // ============================================
  // HEARING LOSS - DC 6100
  // ============================================
  '6100': {
    condition: 'Hearing Loss',
    cfrReference: '38 CFR 4.85–4.87, DC 6100',

    keyDefinitions: {
      ratingMethod: {
        term: 'Table-Based Rating Method',
        definition: 'Hearing loss is rated using a two-step process: (1) Convert puretone average (PTA at 1000, 2000, 3000, 4000 Hz) and speech discrimination score into a Roman numeral (I–XI) using Table VI or VIa. (2) Combine Roman numerals for both ears using Table VII to get a percentage rating. Exam must be conducted without hearing aids.',
        source: '38 CFR 4.85',
        important: true
      },
      noHearingAids: {
        term: 'Exam Without Hearing Aids',
        definition: 'VA C&P audiology examinations MUST be conducted without hearing aids. Your rating reflects unaided hearing — a common mistake is testing with aids in place. Confirm this at every exam.',
        source: '38 CFR 4.85(a)',
        important: true
      },
      onesidedSC: {
        term: 'One-Sided Service Connection',
        definition: 'If only one ear is service-connected, the non-SC ear is assigned Roman Numeral I for Table VII calculation. This means unilateral hearing loss typically rates lower than bilateral — document bilateral exposure when applicable.',
        source: '38 CFR 4.85(f)',
        important: true
      },
      noiseDamage: {
        term: 'Acoustic Trauma / Noise-Induced Hearing Loss',
        definition: 'Hearing loss from military noise exposure (weapons, aircraft, machinery, explosions) is the most common VA claim. Document all noise exposure during service. MOS and duty station records are valuable evidence.',
        source: '38 CFR 3.304',
        important: true
      },
      tinnitusSeparate: {
        term: 'Tinnitus — Separately Ratable',
        definition: 'Tinnitus (DC 6260) is rated separately at 10% flat and may be combined with hearing loss ratings. A single 10% evaluation is assigned regardless of whether tinnitus is in one ear, both ears, or in the head.',
        source: '38 CFR 4.87, DC 6260 Note 2',
        important: true
      }
    },

    caseLaw: [
      {
        case: 'Hensley v. Brown',
        citation: '5 Vet. App. 155 (1993)',
        year: 1993,
        holding: 'VA must consider all competent lay evidence, including veterans\' testimony about noise exposure during service.',
        practicalApplication: 'Your own statement about years of noise exposure in service is competent evidence for the nexus between service and hearing loss.',
        important: true
      },
      {
        case: 'Jandreau v. Nicholson',
        citation: '492 F.3d 1372 (Fed. Cir. 2007)',
        year: 2007,
        holding: 'Veterans are competent to testify about observable symptoms and directly witnessed events.',
        practicalApplication: 'You can competently testify about noise exposure and symptoms of hearing loss, even without a physician\'s contemporaneous documentation.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get an audiology evaluation including both puretone audiometry (at 500, 1000, 2000, 3000, 4000 Hz) and Maryland CNC speech discrimination test.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL noise exposure during service: MOS, weapons fired, aircraft, machinery, blast events.',
        priority: 'critical'
      },
      {
        tip: 'Claim tinnitus (DC 6260) as a separate condition — it adds 10% and does not require proving noise nexus separately if hearing loss is SC.',
        priority: 'critical'
      },
      {
        tip: 'If bilateral hearing loss, document bilateral exposure — bilateral SC produces a significantly higher combined rating than unilateral.',
        priority: 'high'
      },
      {
        tip: 'Keep pre-service and separation audiograms if available — threshold shifts from induction to separation establish service-connection.',
        priority: 'high'
      },
      {
        tip: 'Document all functional limitations: difficulty with speech comprehension, phone conversations, group settings.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Confirm the exam is being conducted WITHOUT hearing aids',
      'Report all noise exposure from your military service: MOS, weapons, aircraft, vehicles, blasts',
      'If you have tinnitus, make sure it is being evaluated separately under DC 6260',
      'Report both ears — document all exposures that could have caused bilateral hearing loss',
      'Bring separation audiogram if available — threshold shifts from enlistment to separation are strong evidence',
      'Report functional impact: difficulty understanding speech in noise, TV volume, phone use'
    ],

    commonMistakes: [
      'Not claiming tinnitus separately — it adds 10% and is easy to claim',
      'Allowing testing with hearing aids — always remove them before the exam',
      'Not claiming bilateral service connection when both ears were exposed',
      'Not documenting MOS and duty stations — these establish noise exposure evidence'
    ]
  },

  // ============================================
  // MENIERE'S DISEASE - DC 6205
  // ============================================
  '6205': {
    condition: "Meniere's Disease (Endolymphatic Hydrops)",
    cfrReference: '38 CFR 4.87, DC 6205',

    keyDefinitions: {
      ratingScale: {
        term: "Meniere's Rating Scale — Vertigo Frequency",
        definition: "Ratings: 30% (hearing impairment with vertigo less than once/month), 60% (hearing impairment with attacks of vertigo and cerebellar gait occurring 1–4 times/month), 100% (hearing impairment with attacks of vertigo and cerebellar gait more than once/week). Tinnitus may or may not be present at each tier.",
        source: '38 CFR 4.87, DC 6205',
        important: true
      },
      dualRating: {
        term: 'Dual Rating Option — Use the Higher',
        definition: "Meniere's may be rated EITHER under DC 6205 directly OR by separately evaluating: (1) peripheral vestibular disorder (DC 6204), (2) hearing impairment (DC 6100), and (3) tinnitus (DC 6260), then combining. VA must use whichever method produces the higher result.",
        source: '38 CFR 4.87, DC 6205 Note',
        important: true
      },
      cerebellarGait: {
        term: 'Cerebellar Gait',
        definition: 'Unsteady, staggering gait from vestibular dysfunction. Must be present during vertigo attacks to qualify for the higher rating tiers. Document ataxia, staggering, and inability to walk during attacks.',
        source: '38 CFR 4.87, DC 6205'
      }
    },

    documentationTips: [
      {
        tip: "Track vertigo attack frequency: how many per week or month? This is the primary rating metric.",
        priority: 'critical'
      },
      {
        tip: 'Document cerebellar gait during attacks — staggering, inability to walk straight, falling.',
        priority: 'critical'
      },
      {
        tip: 'Get audiometry and vestibular function testing: ENG/VNG, ECOG documenting the diagnosis.',
        priority: 'high'
      },
      {
        tip: "Evaluate both rating methods: DC 6205 directly vs. separate ratings for vestibular disorder + hearing + tinnitus — use the higher.",
        priority: 'critical'
      },
      {
        tip: "Document driving restrictions from Meniere's — inability to drive is both a safety concern and a functional limitation.",
        priority: 'high'
      }
    ],

    examTips: [
      'Report vertigo attack frequency precisely: how many per week or month',
      'Describe cerebellar gait during attacks: do you stagger, fall, need to hold onto things?',
      'Report hearing loss and tinnitus — both are part of the diagnostic criteria',
      'Request that both rating methods be compared and the higher applied',
      "Report impact on driving, employment, and daily activities"
    ]
  },

  // ============================================
  // EAR CONDITIONS - DC 6200/6204/6210
  // ============================================
  '6204': {
    condition: 'Peripheral Vestibular Disorders',
    cfrReference: '38 CFR 4.87, DC 6204',

    keyDefinitions: {
      ratingScale: {
        term: 'Vestibular Disorder Rating Scale',
        definition: 'Ratings: 10% (occasional dizziness), 30% (dizziness and occasional staggering). Objective findings supporting vestibular disequilibrium are required before any compensable rating. Hearing impairment and tinnitus are rated separately and combined.',
        source: '38 CFR 4.87, DC 6204',
        important: true
      },
      objectiveFindings: {
        term: 'Objective Findings Required',
        definition: 'A compensable rating under DC 6204 requires objective findings supporting vestibular disequilibrium — not subjective dizziness alone. ENG/VNG, caloric testing, or posturography documenting vestibular dysfunction is needed.',
        source: '38 CFR 4.87, DC 6204 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get vestibular function testing: ENG/VNG, caloric testing, or posturography — objective evidence is required.',
        priority: 'critical'
      },
      {
        tip: 'Document staggering specifically — dizziness alone = 10%, dizziness WITH staggering = 30%.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim hearing impairment (DC 6100) and tinnitus (DC 6260) — they combine with DC 6204.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring vestibular function test results — objective evidence is required for any compensable rating',
      'Report staggering, balance problems, and falls — not just dizziness',
      'Confirm hearing loss and tinnitus are being evaluated separately',
      'Describe impact on activities requiring balance: driving, stairs, outdoor surfaces'
    ]
  },

  '6200': {
    condition: 'Chronic Suppurative Otitis Media / Mastoiditis / Cholesteatoma',
    cfrReference: '38 CFR 4.87, DC 6200',

    keyDefinitions: {
      ratingScale: {
        term: 'Suppurative Otitis Media Rating',
        definition: 'Rated at 10% during active suppuration or with aural polyps. Complications (labyrinthitis, tinnitus, facial nerve paralysis, bone loss of skull) are rated separately and combined with DC 6200.',
        source: '38 CFR 4.87, DC 6200',
        important: true
      },
      separateComplications: {
        term: 'Complications Rated Separately',
        definition: 'Hearing impairment, tinnitus, facial nerve paralysis, labyrinthitis, and skull bone loss from chronic otitis media are each rated separately under their own DCs and combined. Do not rate all complications under DC 6200.',
        source: '38 CFR 4.87, DC 6200 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document active suppuration episodes — drainage, polyps, recurring infections.',
        priority: 'high'
      },
      {
        tip: 'Separately claim all complications: hearing loss, tinnitus, facial nerve palsy.',
        priority: 'critical'
      },
      {
        tip: 'Get CT of temporal bone documenting cholesteatoma or mastoid disease if present.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report whether there is currently active drainage or suppuration',
      'Confirm hearing loss, tinnitus, and facial nerve function are being evaluated separately',
      'Bring imaging of the ear and temporal bone if available',
      'Report history of ear surgeries and their outcomes'
    ]
  },

  '6210': {
    condition: 'Chronic Otitis Externa',
    cfrReference: '38 CFR 4.87, DC 6210',

    keyDefinitions: {
      ratingScale: {
        term: 'Otitis Externa Rating',
        definition: 'Rated at 10% when there is swelling, dry and scaly or serous discharge, and itching requiring frequent and prolonged treatment.',
        source: '38 CFR 4.87, DC 6210',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document the need for frequent and prolonged treatment — this is the threshold for the 10% rating.',
        priority: 'critical'
      },
      {
        tip: 'Document service nexus: aquatic training, humid climates, ear canal trauma during service.',
        priority: 'high'
      },
      {
        tip: 'Track treatment frequency: ear drops, debridement visits, antibiotic courses.',
        priority: 'medium'
      }
    ],

    examTips: [
      'Report how frequently you require treatment for ear symptoms',
      'Describe swelling, discharge, and itching specifically',
      'Report service activities that contributed to the condition',
      'Bring records of treatment visits showing chronic nature'
    ]
  },

  // ============================================
  // GENERAL EYE CONDITIONS - DC 6000 / 6001 / 6002 / 6018
  // ============================================
  '6000': {
    condition: 'Eye Conditions (Uveitis, General Eye)',
    cfrReference: '38 CFR 4.79, DC 6000-6091',

    keyDefinitions: {
      generalFormula: {
        term: 'General Rating Formula for Eye Diseases',
        definition: 'Eye conditions are rated based on: (1) visual acuity impairment using a complex table (DCs 6061–6079), (2) visual field loss, (3) specific disease ratings for conditions like uveitis (DC 6000), or (4) functional impairment from treatment/complications. Each eye is evaluated separately.',
        source: '38 CFR 4.79',
        important: true
      },
      uveitis: {
        term: 'Uveitis (DC 6000) Rating',
        definition: 'Uveitis is rated under the General Rating Formula for Diseases of the Eye based on visual acuity, frequency of attacks, and complications. Recurrent attacks causing progressive vision loss support higher ratings.',
        source: '38 CFR 4.79, DC 6000',
        important: true
      },
      visualAcuity: {
        term: 'Visual Acuity — Key Metric',
        definition: 'Corrected visual acuity (with glasses/contacts) is used for VA rating, not uncorrected. Each eye is rated separately. Loss of central visual acuity is rated under DCs 6061–6066 using a complex table based on best corrected vision in each eye.',
        source: '38 CFR 4.75–4.79',
        important: true
      },
      separateEyes: {
        term: 'Each Eye Rated Separately',
        definition: 'The right and left eye are evaluated individually. Blindness in one eye (DC 6061) may be rated as low as 10% with full vision in the other eye, up to 100% with severe bilateral loss.',
        source: '38 CFR 4.79',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get complete ophthalmology examination with best-corrected visual acuity in each eye separately documented.',
        priority: 'critical'
      },
      {
        tip: 'Document visual field testing results — field loss may be separately ratable.',
        priority: 'high'
      },
      {
        tip: 'For uveitis: document attack frequency, severity, and any complications (glaucoma, cataract, synechiae).',
        priority: 'high'
      },
      {
        tip: 'Document service nexus: blast exposure, chemical injury, foreign body, autoimmune from service-connected condition.',
        priority: 'critical'
      },
      {
        tip: 'Complications of eye disease (glaucoma, cataracts) from service-connected uveitis are separately ratable.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring complete ophthalmology records including best-corrected visual acuity for each eye',
      'Report visual field loss if present',
      'For uveitis: report attack frequency, triggers, and complications',
      'Report all medications including eye drops and systemic immunosuppressants',
      'Report impact on activities: driving, reading, work tasks'
    ]
  },

  // ============================================
  // EYE VISION - DC 6061-6079 (Vision Acuity)
  // ============================================
  '6061': {
    condition: 'Visual Acuity Impairment / Vision Loss',
    cfrReference: '38 CFR 4.79, DC 6061–6079',

    keyDefinitions: {
      correctedAcuity: {
        term: 'Best Corrected Visual Acuity',
        definition: 'VA rates vision loss based on BEST CORRECTED acuity (with glasses or contacts). Uncorrected vision does not drive the rating. Each eye must be tested separately for best corrected VA.',
        source: '38 CFR 4.75–4.79',
        important: true
      },
      binocularRating: {
        term: 'Binocular Rating Using Table VII',
        definition: 'Both eyes are evaluated together using Table VII, which combines the acuity designations (DC codes) for each eye into a combined percentage. Better eye drives the row, worse eye drives the column.',
        source: '38 CFR 4.79',
        important: true
      },
      smc: {
        term: 'SMC for Blindness',
        definition: 'Blindness (5/200 or worse in both eyes, or loss of use of both eyes) may qualify for Special Monthly Compensation at the SMC-L or higher rate. VA must review all blindness claims for SMC entitlement.',
        source: '38 CFR 3.350'
      }
    },

    documentationTips: [
      {
        tip: 'Get complete ophthalmology exam with best corrected visual acuity in each eye documented in Snellen notation.',
        priority: 'critical'
      },
      {
        tip: 'Document visual field loss separately — field cuts may support additional compensation.',
        priority: 'high'
      },
      {
        tip: 'For bilateral severe vision loss: request SMC evaluation.',
        priority: 'high'
      },
      {
        tip: 'Document all conditions contributing to vision loss and their service nexus.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring your most recent ophthalmology records with corrected VA for each eye',
      'Report if vision has changed since last VA exam — request updated testing',
      'For severe bilateral loss: ask about SMC entitlement',
      'Report all eye conditions: cataracts, glaucoma, macular degeneration, diabetic retinopathy'
    ]
  },

  // ============================================
// SYSTEM 10: INFECTIOUS DISEASES
// ratingEnhancements.js additions
// 38 CFR 4.88b (infectious diseases)
// General Rating Formula: Active disease = 100%, then 0% + residuals separately
// Add all entries below to the RATING_ENHANCEMENTS object.
// ============================================

  // ============================================
  // HIV-RELATED ILLNESS - DC 6351
  // ============================================
  '6351': {
    condition: 'HIV-Related Illness',
    cfrReference: '38 CFR 4.88b, DC 6351',

    keyDefinitions: {
      ratingScale: {
        term: 'HIV Rating Scale',
        definition: 'Ratings: 0% (asymptomatic, with or without lymphadenopathy or decreased T4 count), 10% (constitutional symptoms + T4 between 200–500 + medications OR depression/memory loss with employment limitations), 30% (recurrent constitutional symptoms + intermittent diarrhea + medications OR T4 count <200), 60% (refractory constitutional symptoms + diarrhea + weight loss OR minimum following AIDS-defining opportunistic infection or neoplasm), 100% (AIDS with recurrent opportunistic infections afflicting multiple systems OR debility and progressive weight loss).',
        source: '38 CFR 4.88b, DC 6351',
        important: true
      },
      t4Count: {
        term: 'T4 (CD4) Cell Count — Key Metric',
        definition: 'CD4 count below 200 independently supports a minimum 30% rating. CD4 between 200–500 supports 10%. Document serial CD4 counts — the lowest sustained count is most relevant.',
        source: '38 CFR 4.88b, DC 6351',
        important: true
      },
      employmentLimitations: {
        term: 'Depression or Memory Loss With Employment Limitations',
        definition: 'HIV-related neuropsychiatric symptoms (depression, memory loss) that cause employment limitations independently support a 10% rating, even with a relatively high CD4 count.',
        source: '38 CFR 4.88b, DC 6351'
      },
      serviceConnection: {
        term: 'Service Connection Methods',
        definition: 'HIV may be service-connected through: (1) direct service nexus (needle stick, sexual assault/MST during service, blood transfusion during service), or (2) secondary to service-connected conditions. Document the in-service exposure event.',
        source: '38 CFR 3.304',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document serial CD4 counts — counts below 200 = 30%, below 500 with symptoms = 10%.',
        priority: 'critical'
      },
      {
        tip: 'Document ALL AIDS-defining opportunistic infections and neoplasms — each episode supports 60%+.',
        priority: 'critical'
      },
      {
        tip: 'Track constitutional symptoms: fever, night sweats, weight loss, diarrhea — frequency and severity.',
        priority: 'high'
      },
      {
        tip: 'Document the service-connected exposure event: needle stick, MST, blood transfusion during service.',
        priority: 'critical'
      },
      {
        tip: 'If HIV causes depression or cognitive impairment affecting employment, document those limitations separately.',
        priority: 'high'
      },
      {
        tip: 'Separately claim neurological residuals of HIV: peripheral neuropathy, HIV encephalopathy.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring serial CD4 count lab results and viral load trends',
      'Report all opportunistic infections or AIDS-defining conditions that have occurred',
      'Report constitutional symptoms: weight loss, fever, night sweats, diarrhea',
      'Report HIV-related cognitive symptoms, depression, and employment impact',
      'Describe the service-connected exposure event that caused HIV infection',
      'Report all antiretroviral medications and any side effects affecting function'
    ],

    commonMistakes: [
      'Not documenting the in-service exposure event — service connection requires a nexus',
      'Not claiming neurological complications separately: neuropathy, cognitive impairment',
      'Accepting 0% when CD4 is below 200 — below 200 = 30% minimum even without symptoms'
    ]
  },

  // ============================================
  // HEPATITIS C - DC 7354
  // (rates as DC 7345 - Chronic Liver Disease Without Cirrhosis)
  // ============================================
  '7354': {
    condition: 'Hepatitis C',
    cfrReference: '38 CFR 4.114, DC 7354 (rates as DC 7345)',

    keyDefinitions: {
      ratesAs7345: {
        term: 'Hep C Rates as Chronic Liver Disease Without Cirrhosis (DC 7345)',
        definition: 'Hepatitis C (DC 7354) is rated using the DC 7345 criteria: 0% (asymptomatic history), 20% (intermittent fatigue, malaise, anorexia, hepatomegaly, or pruritus), 40% (progressive disease + continuous medication + minor weight loss + ≥2 symptoms), 60% (progressive disease + continuous medication + substantial weight loss + ≥2 symptoms), 100% (requiring parenteral antiviral and immunomodulatory therapy, for 6 months post-treatment).',
        source: '38 CFR 4.114, DC 7354/7345',
        important: true
      },
      daaTherapy: {
        term: 'Direct-Acting Antivirals (DAAs) and SVR',
        definition: 'Modern Hep C treatment with direct-acting antivirals (DAAs) achieves sustained virologic response (SVR/cure) in >95% of patients. After achieving SVR, rate on residual liver damage — cirrhosis, fibrosis, and portal hypertension are separately ratable. A "cured" Hep C still warrants rating for liver residuals.',
        source: '38 CFR 4.114, DC 7345',
        important: true
      },
      agentOrange: {
        term: 'Vietnam Era Service / Contaminated Needles',
        definition: 'Hepatitis C contracted through contaminated jet air gun injectors during military service (commonly used in the 1960s–1990s) is a recognized service connection basis. Document all immunization history and injection procedures during service.',
        source: '38 CFR 3.304',
        important: true
      },
      cirrhosisUpgrade: {
        term: 'Upgrade to Cirrhosis if Present',
        definition: 'If Hep C has progressed to cirrhosis, rate under DC 7312 (Cirrhosis of the Liver) using the MELD score criteria. Cirrhosis rating is typically higher than the DC 7345 framework.',
        source: '38 CFR 4.114, DC 7312'
      }
    },

    caseLaw: [
      {
        case: 'Combee v. Brown',
        citation: '34 F.3d 1039 (Fed. Cir. 1994)',
        year: 1994,
        holding: 'A disease diagnosed after service may still be service-connected if evidence shows it was incurred in service.',
        practicalApplication: 'Hep C diagnosed years after service can still be service-connected if jet gun exposure or other in-service risk factor is documented.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Document in-service exposure: jet gun injections (immunizations), needle sticks, transfusions, tattoos.',
        priority: 'critical'
      },
      {
        tip: 'Get liver function tests (ALT, AST, bilirubin), fibrosis staging (FibroScan, FibroTest, or biopsy).',
        priority: 'critical'
      },
      {
        tip: 'Document symptoms: fatigue, malaise, anorexia, hepatomegaly, pruritus, arthralgia — each one matters.',
        priority: 'high'
      },
      {
        tip: 'If cirrhosis has developed, file for upgrade to DC 7312 with MELD score.',
        priority: 'critical'
      },
      {
        tip: 'If SVR achieved, document residual liver damage — fibrosis and portal hypertension are still ratable.',
        priority: 'high'
      },
      {
        tip: 'Separately claim extrahepatic manifestations: cryoglobulinemia, peripheral neuropathy, glomerulonephritis.',
        priority: 'high'
      }
    ],

    examTips: [
      'Document in-service jet gun immunization records or other exposure events',
      'Bring current liver function tests, viral load, and fibrosis stage',
      'Report all symptoms even if mild: fatigue, joint pain, abdominal discomfort, itching',
      'If treated and cured: bring pre- and post-treatment liver assessments showing residual damage',
      'If cirrhosis developed: request rating under DC 7312 and bring MELD score labs',
      'Report extrahepatic conditions that may be secondary to Hep C'
    ],

    ratingNote: 'A "cured" Hepatitis C (SVR achieved) does not eliminate the VA rating. The rating continues based on residual liver damage. File for an evaluation of current liver status with fibrosis staging after treatment — do not assume a cure eliminates the claim.'
  },

  // ============================================
  // HEPATITIS B - DC 7314 (infectious disease)
  // Also rates as DC 7345
  // ============================================
  'hepatitis_b': {
    condition: 'Hepatitis B',
    cfrReference: '38 CFR 4.114, DC 7345 (Note 3)',

    keyDefinitions: {
      noStandaloneDC: {
        term: 'No Standalone Diagnostic Code',
        definition: 'Hepatitis B has no independent diagnostic code in 38 CFR Part 4. Per DC 7345, Note 3, Hepatitis B (confirmed by serologic testing) is rated using the Chronic Liver Disease Without Cirrhosis (DC 7345) criteria. The HepatitisBRatingCard uses DC 7345 for all rating calculations.',
        source: '38 CFR 4.114, DC 7345 Note 3',
        important: true
      },
      ratesAs7345: {
        term: 'Rated Under DC 7345 — Chronic Liver Disease Without Cirrhosis',
        definition: 'Rating scale: 0% (asymptomatic history), 20% (intermittent fatigue, malaise, anorexia, hepatomegaly, or pruritus), 40% (progressive disease + continuous medication + minor weight loss + ≥2 symptoms), 60% (progressive disease + continuous medication + substantial weight loss + ≥2 symptoms), 100% (requiring both parenteral antiviral and immunomodulatory therapy — for 6 months post-treatment).',
        source: '38 CFR 4.114, DC 7345',
        important: true
      },
      renalDisease: {
        term: 'Hep B Renal Disease — DC 7544',
        definition: 'Renal disease caused by Hepatitis B is separately ratable under DC 7544 (Renal disease caused by viral infection such as HIV, Hepatitis B, and Hepatitis C), rated as renal dysfunction under 38 CFR 4.115a. File this as a separate secondary condition.',
        source: '38 CFR 4.115b, DC 7544',
        important: true
      },
      chronicVsAcute: {
        term: 'Chronic vs. Acute Hepatitis B',
        definition: 'Acute Hep B may resolve (surface antigen clearance). Chronic Hep B (HBsAg positive >6 months) is the ratable condition. Rate on current liver function and symptoms.',
        source: '38 CFR 4.114, DC 7345'
      },
      serviceNexus: {
        term: 'Service Connection Basis',
        definition: 'Hep B contracted during service through contaminated needles, jet gun injectors, blood exposure, sexual assault (MST), or combat wounds is service-connectable. Document the in-service exposure event.',
        source: '38 CFR 3.304',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Confirm chronic Hep B with HBsAg positive >6 months — acute resolved infection is not ratable.',
        priority: 'critical'
      },
      {
        tip: 'Get liver function tests (ALT, AST, bilirubin), HBV DNA viral load, and fibrosis staging.',
        priority: 'high'
      },
      {
        tip: 'Document in-service exposure event for service connection nexus: needle sticks, jet gun injectors, blood exposure, MST.',
        priority: 'critical'
      },
      {
        tip: 'If renal disease has developed from Hep B, separately file under DC 7544 rated as renal dysfunction.',
        priority: 'critical'
      },
      {
        tip: 'If cirrhosis has developed, file for upgrade to DC 7312 with MELD score.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring HBsAg, HBeAg, HBV DNA, and liver function test results',
      'Document in-service exposure: needle sticks, jet gun immunizations, blood exposure, MST',
      'Report all symptoms: fatigue, jaundice, abdominal pain, joint pain',
      'If renal disease present: confirm it is being separately rated under DC 7544',
      'If cirrhosis: request DC 7312 rating with MELD score documentation'
    ],

    ratingNote: 'Hepatitis B has no standalone diagnostic code in 38 CFR Part 4. It is rated under DC 7345 (Chronic Liver Disease Without Cirrhosis) per Note 3. Hep B-related renal disease is separately ratable under DC 7544. If cirrhosis develops, upgrade to DC 7312.'
  },

  // ============================================
  // LYME DISEASE - DC 6319
  // ============================================
  '6319': {
    condition: 'Lyme Disease',
    cfrReference: '38 CFR 4.88b, DC 6319',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Rate Residuals',
        definition: 'Lyme disease rates under the General Rating Formula: 100% during active disease, then 0% for the infection itself. Residual disabilities are rated under the appropriate body system DCs. Residuals include arthritis, peripheral neuropathy, Bell\'s palsy, radiculopathy, and cognitive dysfunction.',
        source: '38 CFR 4.88b, DC 6319',
        important: true
      },
      residuals: {
        term: 'Lyme Residuals — Each Separately Ratable',
        definition: 'Per the CFR note, residuals of Lyme disease — arthritis (musculoskeletal DCs), Bell\'s palsy (DC 8207), radiculopathy (DC 8520), ocular conditions (eye DCs), and cognitive dysfunction (mental health DCs) — are each rated separately under the applicable body system.',
        source: '38 CFR 4.88b, DC 6319 Note',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Illness Consideration',
        definition: 'Lyme disease acquired in endemic areas during service in Southwest Asia or other qualifying locations may be considered as part of a Gulf War illness claim under 38 CFR 3.317.',
        source: '38 CFR 3.317'
      }
    },

    documentationTips: [
      {
        tip: 'File for each Lyme residual separately under the appropriate body system DC — do not rely solely on DC 6319.',
        priority: 'critical'
      },
      {
        tip: 'Get documentation of all residual conditions: Lyme arthritis, neuropathy, facial palsy, cognitive effects.',
        priority: 'critical'
      },
      {
        tip: 'Document the in-service exposure: service in tick-endemic areas, outdoor duty assignments.',
        priority: 'high'
      },
      {
        tip: 'Serologic testing (ELISA + Western blot) confirming Lyme diagnosis is essential.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report all persistent symptoms: joint pain, fatigue, neurological symptoms, cognitive issues',
      'Confirm residuals are being evaluated under their own DCs — not just listed under DC 6319',
      'Bring serologic test results confirming Lyme diagnosis',
      'Document all in-service outdoor activities and service locations'
    ],

    ratingNote: 'The highest VA ratings for Lyme disease come from separately claiming all residuals. A veteran with Lyme-related arthritis (musculoskeletal DC), peripheral neuropathy (DC 8521), Bell\'s palsy (DC 8207), and cognitive changes (mental health DC) may have 4+ separately ratable service-connected conditions from a single Lyme infection.'
  },

  // ============================================
  // MALARIA - DC 6304
  // ============================================
  '6304': {
    condition: 'Malaria',
    cfrReference: '38 CFR 4.88b, DC 6304',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Malaria rates under the General Rating Formula: 100% during active disease or confirmed relapse, then 0% for the infection with residuals rated separately. Diagnosis requires identification of malarial parasites in blood smears or confirmatory laboratory testing.',
        source: '38 CFR 4.88b, DC 6304',
        important: true
      },
      residuals: {
        term: 'Malaria Residuals — Rate Separately',
        definition: 'CFR note specifies residuals including liver damage (rate as hepatic disease) and CNS conditions (rate under neurological DCs). Chronic malaria can cause hepatosplenomegaly, anemia, and neurological damage — each separately ratable.',
        source: '38 CFR 4.88b, DC 6304 Note 2',
        important: true
      },
      relapse: {
        term: 'Malaria Relapse',
        definition: 'Plasmodium vivax and P. ovale cause relapses from dormant liver stages (hypnozoites) years after initial infection. Each relapse constitutes active disease and should be documented and rated at 100%.',
        source: '38 CFR 4.88b, DC 6304 Note 1'
      }
    },

    documentationTips: [
      {
        tip: 'Document in-service deployment to malaria-endemic regions: Vietnam, Korea, Southwest Asia, Africa.',
        priority: 'critical'
      },
      {
        tip: 'Get blood smear or PCR confirming malaria diagnosis — laboratory confirmation is required.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim residuals: hepatic damage (liver DCs), neurological effects (brain DCs), anemia (DC 7700s).',
        priority: 'critical'
      },
      {
        tip: 'Document each relapse with laboratory confirmation.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring laboratory results confirming malaria diagnosis or relapse',
      'Report all endemic-area deployments',
      'Report residual symptoms: fatigue, liver enlargement, neurological changes',
      'Confirm residuals are being rated under appropriate body system DCs'
    ]
  },

  // ============================================
  // TUBERCULOSIS - DC 6730 (Active) / 6731 (Inactive)
  // ============================================
  '6730': {
    condition: 'Tuberculosis, Pulmonary, Active',
    cfrReference: '38 CFR 4.88c, DC 6730',

    keyDefinitions: {
      activeTB: {
        term: 'Active Pulmonary TB = 100%',
        definition: 'Active pulmonary tuberculosis (DC 6730) is rated at 100% — considered permanently and totally disabling during active disease. Rating continues until the condition becomes inactive.',
        source: '38 CFR 4.88c, DC 6730',
        important: true
      },
      inactiveTB: {
        term: 'Inactive TB — Rate as Residuals',
        definition: 'When active TB becomes inactive (DC 6731), rate residuals as: interstitial lung disease, restrictive lung disease, or chronic bronchitis (DC 6600) depending on the predominant respiratory residual. Thoracoplasty is rated as rib removal under DC 5297.',
        source: '38 CFR 4.88c, DC 6731',
        important: true
      },
      mandatoryExam: {
        term: 'Mandatory Exam at Inactivation',
        definition: 'When active TB becomes inactive, a mandatory VA examination is required immediately. The examination determines residual ratings. Do not miss this examination — it sets the new rating going forward.',
        source: '38 CFR 4.88c, DC 6731 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document active TB with chest imaging and positive culture/smear results.',
        priority: 'critical'
      },
      {
        tip: 'At inactivation, request the mandatory VA examination promptly.',
        priority: 'critical'
      },
      {
        tip: 'At the inactivation exam, document all pulmonary residuals: fibrosis, restriction, obstruction.',
        priority: 'critical'
      },
      {
        tip: 'Get post-treatment pulmonary function testing (spirometry, DLCO) for residual rating.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring chest X-ray or CT showing TB lesions/cavities',
      'Bring culture and smear results confirming active TB',
      'At the inactivation exam: bring full PFTs documenting respiratory residuals',
      'Report all respiratory symptoms: cough, dyspnea, hemoptysis, fatigue'
    ]
  },

  '6731': {
    condition: 'Tuberculosis, Pulmonary, Inactive',
    cfrReference: '38 CFR 4.88c, DC 6731',

    keyDefinitions: {
      rateAsResiduals: {
        term: 'Inactive TB — Rate Pulmonary Residuals',
        definition: 'Inactive pulmonary TB is rated based on residuals: interstitial lung disease, restrictive lung disease, or chronic bronchitis/COPD. Rate under the most appropriate respiratory DC (DC 6825 for ILD, DC 6604 for COPD, DC 6600 for chronic bronchitis) based on spirometry findings.',
        source: '38 CFR 4.88c, DC 6731',
        important: true
      },
      protectedRatings: {
        term: 'Protected (Pub. L. 90-493) Ratings',
        definition: 'Veterans receiving graduated TB ratings before August 19, 1968 may have "protected" ratings under Pub. L. 90-493. These are preserved and should not be reduced without specific legal authority.',
        source: '38 CFR 4.88c, DC 6731'
      }
    },

    documentationTips: [
      {
        tip: 'Get spirometry and DLCO to document the type and severity of residual lung damage.',
        priority: 'critical'
      },
      {
        tip: 'Get chest CT documenting scarring, fibrosis, or hyperinflation from prior TB.',
        priority: 'high'
      },
      {
        tip: 'File under the most appropriate respiratory DC based on the predominant residual.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring current PFTs showing the type of residual impairment',
      'Bring chest imaging showing post-TB lung changes',
      'Report respiratory symptoms: cough, dyspnea, exercise limitation',
      'Confirm the most appropriate respiratory DC is being applied'
    ]
  },

  // ============================================
  // BRUCELLOSIS - DC 6316
  // ============================================
  '6316': {
    condition: 'Brucellosis',
    cfrReference: '38 CFR 4.88b, DC 6316',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Brucellosis rates under the General Rating Formula: 100% during active disease (confirmed by culture or serology), then 0% for infection with residuals rated under body system DCs.',
        source: '38 CFR 4.88b, DC 6316',
        important: true
      },
      residuals: {
        term: 'Brucellosis Residuals — Musculoskeletal, Liver, CNS',
        definition: 'Chronic brucellosis causes: sacroiliitis and spondylitis (rate under spine DCs), peripheral arthritis (musculoskeletal DCs), hepatosplenomegaly (liver DCs), neurobrucellosis (neurological DCs). Each is rated separately.',
        source: '38 CFR 4.88b, DC 6316 Note 2',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Illness Presumptive',
        definition: 'Brucellosis is specifically listed as a long-term health effect associated with Gulf War service under 38 CFR 3.317(d). Gulf War veterans with brucellosis qualify for presumptive consideration.',
        source: '38 CFR 3.317(d)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get blood culture or serology (Brucella agglutination titer ≥1:160) confirming diagnosis.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim all musculoskeletal and organ residuals.',
        priority: 'critical'
      },
      {
        tip: 'Gulf War veterans: document service for presumptive consideration under 38 CFR 3.317.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring serologic testing confirming brucellosis',
      'Report all joint pain, back pain, fatigue, and hepatic symptoms',
      'Gulf War veterans: confirm presumptive consideration is being evaluated',
      'Confirm residuals are rated under their own DCs'
    ]
  },

  // ============================================
  // Q FEVER - DC 6331
  // ============================================
  '6331': {
    condition: 'Q Fever (Coxiella burnetii)',
    cfrReference: '38 CFR 4.88b, DC 6331',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Q fever rates under the General Rating Formula: 100% active disease, then residuals under body system DCs. CFR-specified residuals: chronic hepatitis (liver DCs), endocarditis (cardiac DCs), osteomyelitis (DC 5000), post-Q-fever chronic fatigue syndrome (DC 6354), and vascular infections.',
        source: '38 CFR 4.88b, DC 6331',
        important: true
      },
      chronicQFever: {
        term: 'Chronic Q Fever / Post-Q Fever CFS',
        definition: 'Chronic Q fever (endocarditis, vascular infection, osteomyelitis) is distinct from post-Q-fever fatigue syndrome. Both are separately ratable residuals. Post-Q-fever fatigue is explicitly ratable under DC 6354 (CFS).',
        source: '38 CFR 4.88b, DC 6331 Note',
        important: true
      },
      gulfWarPresumptive: {
        term: 'Gulf War Illness Presumptive',
        definition: 'Q fever is specifically listed in 38 CFR 3.317(d) as a long-term health effect associated with Gulf War service.',
        source: '38 CFR 3.317(d)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get Phase I and Phase II IgG antibody titers confirming Q fever diagnosis.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim: chronic Q fever endocarditis (cardiac DCs), hepatitis (liver DCs), post-Q-fever CFS (DC 6354).',
        priority: 'critical'
      },
      {
        tip: 'Gulf War veterans: note Q fever as a specifically recognized Gulf War illness.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring serologic results confirming Q fever',
      'Report cardiac symptoms: endocarditis history, valve abnormalities',
      'Report persistent fatigue — post-Q fever CFS is explicitly ratable under DC 6354',
      'Confirm all chronic residuals are evaluated under their own DCs'
    ]
  },

  // ============================================
  // WEST NILE VIRUS - DC 6335
  // ============================================
  '6335': {
    condition: 'West Nile Virus',
    cfrReference: '38 CFR 4.88b, DC 6335',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'West Nile virus rates under the General Rating Formula: 100% active disease, then residuals rated under applicable DCs. CFR-specified residuals include "variable physical, functional, or cognitive disabilities."',
        source: '38 CFR 4.88b, DC 6335',
        important: true
      },
      residuals: {
        term: 'West Nile Neurological Residuals',
        definition: 'West Nile neuroinvasive disease causes: meningitis, encephalitis, acute flaccid paralysis, and chronic neurological deficits. Each is ratable under neurological DCs. Cognitive impairment, fatigue, and motor weakness may persist for years.',
        source: '38 CFR 4.88b, DC 6335 Note'
      }
    },

    documentationTips: [
      {
        tip: 'Document serologic testing (IgM/IgG antibodies) or CSF analysis confirming West Nile.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim neurological residuals: encephalopathy, motor weakness, cognitive impairment.',
        priority: 'critical'
      },
      {
        tip: 'Document in-service exposure: deployment to endemic areas, outdoor duty.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring serologic confirmation of West Nile infection',
      'Report all persistent neurological symptoms: weakness, cognitive changes, fatigue',
      'Confirm neurological residuals are being rated under appropriate neurological DCs',
      'Document in-service exposure circumstances'
    ]
  },

  // ============================================
  // NTM (NONTUBERCULOUS MYCOBACTERIUM) - DC 6312
  // ============================================
  '6312': {
    condition: 'Nontuberculous Mycobacterium (NTM)',
    cfrReference: '38 CFR 4.88b, DC 6312',

    keyDefinitions: {
      activeTreatment: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'NTM infection rates at 100% during active disease (for duration of treatment), then residuals under body system DCs. Mandatory VA exam required 6 months after treatment ends.',
        source: '38 CFR 4.88b, DC 6312',
        important: true
      },
      pulmonaryResiduals: {
        term: 'Pulmonary NTM Residuals',
        definition: 'NTM pulmonary disease (MAC, M. abscessus) often causes permanent lung damage: bronchiectasis, fibrosis, and COPD-like obstruction. Rate residuals under pulmonary DCs (6601 bronchiectasis, 6825 fibrosis, 6604 COPD).',
        source: '38 CFR 4.88b, DC 6312 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Get culture results confirming NTM species and site of infection.',
        priority: 'critical'
      },
      {
        tip: 'Get pulmonary function tests at the 6-month re-exam to document residual lung damage.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim pulmonary residuals: bronchiectasis, fibrosis, obstruction — under appropriate respiratory DCs.',
        priority: 'critical'
      }
    ],

    examTips: [
      'Bring culture results and treatment records',
      'At the 6-month re-exam: bring PFTs and chest imaging showing residual damage',
      'Confirm residuals are rated under appropriate respiratory DCs',
      'Report ongoing symptoms: cough, dyspnea, fatigue'
    ]
  },

  // ============================================
  // CAMPYLOBACTER - DC 6330
  // SALMONELLA - DC 6333
  // SHIGELLA - DC 6334
  // These all use the General Rating Formula with residuals
  // ============================================
  '6330': {
    condition: 'Campylobacter jejuni Infection',
    cfrReference: '38 CFR 4.88b, DC 6330',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Rates under General Rating Formula. CFR-specified residuals: Guillain-Barré syndrome (neurological DC), reactive arthritis (musculoskeletal DC), and uveitis (eye DC). These residuals can be severe — Guillain-Barré in particular warrants full neurological evaluation.',
        source: '38 CFR 4.88b, DC 6330',
        important: true
      },
      gbs: {
        term: 'Guillain-Barré Syndrome — Critical Residual',
        definition: 'Campylobacter is the most common identifiable cause of Guillain-Barré syndrome (GBS) globally. GBS causes ascending paralysis and may result in permanent motor deficits — all separately ratable under peripheral nerve DCs.',
        source: '38 CFR 4.88b, DC 6330 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document stool culture confirming Campylobacter infection during or shortly after service.',
        priority: 'critical'
      },
      {
        tip: 'If Guillain-Barré developed after infection: file separately for GBS residuals under neurological DCs.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim reactive arthritis, uveitis, and other organ complications.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report any weakness, paralysis, or tingling that developed after GI illness — possible GBS',
      'Report joint pain (reactive arthritis) or eye inflammation (uveitis)',
      'Bring stool culture confirming Campylobacter diagnosis',
      'Confirm residuals are evaluated under their own DCs'
    ],

    ratingNote: 'Campylobacter-associated Guillain-Barré syndrome is one of the most underrecognized service-connected conditions. Veterans who developed ascending weakness after foodborne illness during service should specifically claim GBS as a Campylobacter residual.'
  },

  '6333': {
    condition: 'Nontyphoid Salmonella Infection',
    cfrReference: '38 CFR 4.88b, DC 6333',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Rates under General Rating Formula. CFR-specified residual: reactive arthritis (musculoskeletal DCs). Rate separately under appropriate body system.',
        source: '38 CFR 4.88b, DC 6333',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document stool or blood culture confirming Salmonella infection during service.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim reactive arthritis if joint symptoms developed after infection.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring culture results confirming Salmonella diagnosis',
      'Report joint pain that developed after the GI infection — reactive arthritis',
      'Describe in-service exposure: contaminated food in field conditions'
    ]
  },

  '6334': {
    condition: 'Shigella Infection',
    cfrReference: '38 CFR 4.88b, DC 6334',

    keyDefinitions: {
      generalFormula: {
        term: 'Active Disease = 100%; Then Residuals',
        definition: 'Rates under General Rating Formula. CFR-specified residuals: hemolytic-uremic syndrome (HUS — rate under renal DCs) and reactive arthritis (musculoskeletal DCs).',
        source: '38 CFR 4.88b, DC 6334',
        important: true
      },
      hus: {
        term: 'Hemolytic-Uremic Syndrome (HUS)',
        definition: 'HUS from Shigella causes microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury. Chronic kidney disease from HUS is separately ratable under renal DCs.',
        source: '38 CFR 4.88b, DC 6334 Note',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Document stool culture confirming Shigella infection during service.',
        priority: 'critical'
      },
      {
        tip: 'If HUS developed: separately claim chronic kidney disease under DC 7530.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim reactive arthritis if joint symptoms developed.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring culture results confirming Shigella diagnosis',
      'Report kidney problems — HUS can cause permanent renal damage',
      'Report joint pain (reactive arthritis)',
      'Confirm HUS-related CKD is rated under renal DCs'
    ]
  },

  // ============================================
  // SPHINCTER IMPAIRMENT (RECTUM/ANUS) - DC 7332
  // ============================================
  '7332': {
    condition: 'Rectum and Anus, Impairment of Sphincter Control',
    cfrReference: '38 CFR 4.114, DC 7332',

    keyDefinitions: {
      ratingScale: {
        term: 'Sphincter Impairment Rating Scale — Pad Usage and Responsiveness',
        definition: 'Ratings: 0% (history, currently asymptomatic), 10% (incontinence at least once every 6 months requiring pad; OR partially responsive to bowel program with medication or special diet), 30% (incontinence ≥2 times/month requiring pad ≥2 times/month; OR fully responsive to bowel program requiring digital stimulation + medication + special diet), 60% (incontinence ≥2 times/week requiring pad ≥2 times/week; OR partially responsive bowel program requiring surgery or digital stimulation + medication + special diet), 100% (incontinence ≥2 times/day requiring pad change ≥2 times/day; OR not responsive to bowel program requiring surgery or digital stimulation).',
        source: '38 CFR 4.114, DC 7332',
        important: true
      },
      padFrequency: {
        term: 'Pad Change Frequency — Key Metric',
        definition: 'The number of times per day/week/month that absorbent materials must be changed directly drives the rating tier. Track exact pad usage frequency.',
        source: '38 CFR 4.114, DC 7332',
        important: true
      },
      bowelProgram: {
        term: 'Physician-Prescribed Bowel Program',
        definition: 'Responsiveness to a physician-prescribed bowel program (digital stimulation, medication beyond laxatives, special diet) is the second rating axis alongside pad frequency. The combination determines the tier.',
        source: '38 CFR 4.114, DC 7332'
      },
      smc: {
        term: 'SMC Consideration',
        definition: 'Severe fecal incontinence requiring use of an appliance or constant caregiver assistance may qualify for Special Monthly Compensation under 38 CFR 3.350.',
        source: '38 CFR 3.350',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'Track pad/absorbent changes per day, per week, and per month — this is the primary rating metric.',
        priority: 'critical'
      },
      {
        tip: 'Document the physician-prescribed bowel program in detail: what interventions are required and whether they fully or partially control symptoms.',
        priority: 'critical'
      },
      {
        tip: 'Document the service-connected cause: spinal cord injury, surgery, radiation, trauma, neurological condition.',
        priority: 'critical'
      },
      {
        tip: 'Get colorectal or gastroenterology records documenting the sphincter dysfunction diagnosis.',
        priority: 'high'
      },
      {
        tip: 'If an appliance (ostomy bag or similar) is required, request SMC evaluation.',
        priority: 'high'
      }
    ],

    examTips: [
      'Report pad change frequency precisely: per day, per week, or per month',
      'Describe your bowel program: what interventions are required?',
      'Report whether incontinence involves solids, liquids, or both',
      'Describe the service-connected condition that caused sphincter impairment',
      'If an appliance is required, confirm SMC review is being conducted'
    ],

    commonMistakes: [
      'Not tracking pad change frequency — this is the direct rating criterion',
      'Not documenting the physician-prescribed bowel program comprehensively',
      'Not requesting SMC when appliance or daily caregiver assistance is required'
    ]
  },

  // ============================================
  // HYPERALDOSTERONISM - DC 7917
  // ============================================
  '7917': {
    condition: 'Hyperaldosteronism',
    cfrReference: '38 CFR 4.119, DC 7917',

    keyDefinitions: {
      ratingBasis: {
        term: 'Rated as Malignant or Benign Neoplasm',
        definition: 'Per 38 CFR 4.119, hyperaldosteronism (DC 7917) is rated as a malignant or benign neoplasm as appropriate. Malignant adrenal tumors rate at 100% during active disease. Benign adenomas (Conn\'s syndrome) are rated based on residual functional impairment after treatment.',
        source: '38 CFR 4.119, DC 7917',
        important: true
      },
      residuals: {
        term: 'Residual Functional Impairment',
        definition: 'After treatment of a benign adenoma, rate residuals: hypertension (DC 7101), hypokalemia effects, cardiac arrhythmias (DC 7010), muscle weakness. Each separately ratable under its body system DC.',
        source: '38 CFR 4.119, DC 7917',
        important: true
      },
      hypertension: {
        term: 'Hypertension — Separately Ratable',
        definition: 'Hypertension caused by hyperaldosteronism is a ratable residual. If persistent after adrenalectomy, file for hypertension (DC 7101) as a separate secondary condition.',
        source: '38 CFR 3.310 / 4.104, DC 7101'
      }
    },

    documentationTips: [
      {
        tip: 'Get imaging (CT/MRI adrenal) and biochemical testing (aldosterone-to-renin ratio) confirming diagnosis.',
        priority: 'critical'
      },
      {
        tip: 'Document whether benign adenoma or malignant tumor — malignant = 100% during active disease.',
        priority: 'critical'
      },
      {
        tip: 'Separately claim hypertension if present and persistent — DC 7101, separately ratable.',
        priority: 'critical'
      },
      {
        tip: 'Document cardiac effects: arrhythmias from hypokalemia — separately ratable under DC 7010.',
        priority: 'high'
      },
      {
        tip: 'After adrenalectomy, document residual hypertension and electrolyte disorders.',
        priority: 'high'
      }
    ],

    examTips: [
      'Bring adrenal imaging and biochemical test results',
      'Report blood pressure levels and whether hypertension persists after treatment',
      'Report muscle weakness, fatigue, and cardiac symptoms from hypokalemia',
      'If malignant: confirm 100% rating during active disease/treatment',
      'After surgery: report all persistent residuals for separate rating'
    ]
  },

  // ============================================
  // PERIPHERAL NERVE (UPPER EXTREMITY) - DC 8510
  // ============================================
  '8510': {
    condition: 'Peripheral Nerve — Upper Radicular Group (C5-C6)',
    cfrReference: '38 CFR 4.124a, DC 8510',

    keyDefinitions: {
      ratingScale: {
        term: 'Peripheral Nerve Rating Scale — Major vs. Minor',
        definition: 'DC 8510 (upper radicular group — shoulder and elbow movements): Complete paralysis: 70% major / 60% minor. Incomplete: Severe 50%/40%, Moderate 40%/30%, Mild 20%/20%. Major = dominant arm; Minor = non-dominant arm.',
        source: '38 CFR 4.124a, DC 8510',
        important: true
      },
      incompleteDef: {
        term: 'Incomplete Paralysis',
        definition: '"Incomplete paralysis" means a degree of lost or impaired function substantially less than complete paralysis, whether due to varied level of nerve lesion or partial regeneration. Purely sensory involvement rates at mild or at most moderate.',
        source: '38 CFR 4.124a',
        important: true
      },
      majorMinor: {
        term: 'Major vs. Minor Extremity',
        definition: 'Major = dominant arm (higher ratings). Minor = non-dominant arm (lower ratings). Always document which arm is dominant in the claim.',
        source: '38 CFR 4.68 / 4.124a',
        important: true
      },
      bilateral: {
        term: 'Bilateral Peripheral Nerve Involvement',
        definition: 'Ratings for peripheral nerves are for unilateral involvement. When bilateral, combine both ratings with application of the bilateral factor (38 CFR 3.383).',
        source: '38 CFR 4.124a Note'
      },
      neuritisNeuralgia: {
        term: 'Neuritis (8610) and Neuralgia (8710)',
        definition: 'Neuritis (inflammatory) and neuralgia (pain) of the same nerve group are rated under companion codes 8610 and 8710. Neuritis rates same as paralysis scale based on severity; neuralgia rates at mild.',
        source: '38 CFR 4.123-4.124'
      }
    },

    caseLaw: [
      {
        case: 'DeLuca v. Brown',
        citation: '8 Vet. App. 202 (1995)',
        year: 1995,
        holding: 'VA must consider functional loss due to pain, weakness, and fatigability — not just measured ROM or formal paralysis grades.',
        practicalApplication: 'If nerve pain causes functional loss beyond what formal motor testing shows, document it — it must be considered.',
        important: true
      }
    ],

    documentationTips: [
      {
        tip: 'Get EMG and nerve conduction studies documenting the nerve group affected and degree of involvement.',
        priority: 'critical'
      },
      {
        tip: 'Document which arm is dominant — major vs. minor extremity rating affects compensation significantly.',
        priority: 'critical'
      },
      {
        tip: 'Document specific motor deficits: shoulder abduction, elbow flexion strength — these define the radicular group.',
        priority: 'high'
      },
      {
        tip: 'If bilateral involvement: document both arms and request bilateral factor application.',
        priority: 'high'
      },
      {
        tip: 'Document functional limitations: inability to lift, reach overhead, carry objects.',
        priority: 'high'
      }
    ],

    examTips: [
      'Confirm examiner documents which arm is dominant (major vs. minor)',
      'Report motor weakness specifically: shoulder movement and elbow flexion affected?',
      'Report sensory deficits: numbness, tingling in distribution of affected nerve',
      'Bring EMG/NCS results',
      'Report functional limitations from the nerve injury in daily activities and work'
    ]
  },

  // ============================================
  // WEAK FOOT / FOOT CONDITIONS - DC 5277
  // ============================================
  '5277': {
    condition: 'Weak Foot (Bilateral) / Foot Conditions',
    cfrReference: '38 CFR 4.71a, DC 5277',

    keyDefinitions: {
      ratingBasis: {
        term: 'Weak Foot — Rate Underlying Condition, Minimum 10%',
        definition: 'DC 5277 (Weak foot, bilateral) is a symptomatic condition secondary to constitutional conditions. VA rates the underlying condition causing the weak foot, with a minimum rating of 10%. The weak foot itself is the symptom manifestation — identify and claim the primary cause.',
        source: '38 CFR 4.71a, DC 5277',
        important: true
      },
      underlying: {
        term: 'Identify and Rate the Underlying Condition',
        definition: 'Weak foot is secondary to conditions such as peripheral neuropathy, flat foot (pes planus), spastic conditions, or other systemic disease. Rate the underlying condition under its applicable DC and ensure weak foot supports the minimum 10% if the underlying condition alone would rate lower.',
        source: '38 CFR 4.71a, DC 5277'
      },
      functionalImpact: {
        term: 'Functional Impact',
        definition: 'Weak foot causes atrophy of musculature, disturbed circulation, and weakness affecting ambulation. Document impact on walking distance, terrain negotiation, and occupational duties requiring standing or walking.',
        source: '38 CFR 4.71a, DC 5277'
      }
    },

    documentationTips: [
      {
        tip: 'Document and claim the underlying condition causing weak foot — peripheral neuropathy, flat foot, systemic disease.',
        priority: 'critical'
      },
      {
        tip: 'Get EMG/NCS if neuropathy is the cause — objective nerve damage evidence is needed.',
        priority: 'high'
      },
      {
        tip: 'Document bilateral involvement explicitly — DC 5277 specifically covers bilateral weak foot.',
        priority: 'high'
      },
      {
        tip: 'Track functional limitations: walking distance, terrain difficulty, occupational impact.',
        priority: 'high'
      }
    ],

    examTips: [
      'Identify and report the underlying condition causing foot weakness',
      'Report bilateral involvement of both feet',
      'Describe muscle atrophy, circulation problems, and weakness in the feet',
      'Report functional limitations: how far can you walk, what surfaces cause difficulty?',
      'Bring documentation of the underlying service-connected cause'
    ]
  },

  // ============================================
  // AVITAMINOSIS - DC 6313
  // ============================================
  '6313': {
    condition: 'Avitaminosis (Vitamin Deficiency)',
    cfrReference: '38 CFR 4.88b, DC 6313',

    keyDefinitions: {
      ratingScale: {
        term: 'Avitaminosis Rating Scale',
        definition: 'Ratings: 10% (confirmed diagnosis with nonspecific symptoms: decreased appetite, weight loss, abdominal discomfort, weakness, inability to concentrate, irritability), 20% (stomatitis, achlorhydria, or diarrhea), 40% (stomatitis + diarrhea + symmetrical dermatitis), 60% (above symptoms plus mental symptoms and impaired bodily vigor), 100% (marked mental changes, moist dermatitis, inability to retain adequate nourishment, exhaustion, and cachexia).',
        source: '38 CFR 4.88b, DC 6313',
        important: true
      },
      serviceNexus: {
        term: 'Service Connection Basis',
        definition: 'Avitaminosis during or from military service may result from inadequate field rations, prisoner of war conditions, prolonged deployments with limited nutrition, or malabsorptive conditions caused by service-connected disease.',
        source: '38 CFR 3.304',
        important: true
      },
      powPresumptive: {
        term: 'POW Presumptive',
        definition: 'Avitaminosis is a presumptive service-connected condition for former prisoners of war under 38 CFR 3.309(c). No nexus letter required for qualifying POW veterans.',
        source: '38 CFR 3.309(c)',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'For POW veterans: document POW status — avitaminosis is presumptively service-connected.',
        priority: 'critical'
      },
      {
        tip: 'Get lab testing documenting vitamin deficiencies: serum levels of vitamins A, B-complex, C, D.',
        priority: 'critical'
      },
      {
        tip: 'Document all symptoms across the rating tiers: stomatitis, dermatitis, diarrhea, weight loss, mental changes.',
        priority: 'high'
      },
      {
        tip: 'Track nutritional supplementation requirements — documenting ongoing need reflects severity.',
        priority: 'medium'
      }
    ],

    examTips: [
      'POW veterans: confirm presumptive service connection is being applied',
      'Bring vitamin level lab results confirming the deficiency',
      'Report all symptoms: mouth sores, skin rash, diarrhea, weight loss, cognitive symptoms',
      'Report the service circumstances that caused vitamin deficiency',
      'Describe impact on daily activities and work capacity'
    ]
  },

  // ============================================
  // BERIBERI - DC 6314
  // ============================================
  '6314': {
    condition: 'Beriberi (Thiamine/B1 Deficiency)',
    cfrReference: '38 CFR 4.88b, DC 6314',

    keyDefinitions: {
      ratingScale: {
        term: 'Beriberi Rating Scale — Active Disease',
        definition: 'Active disease ratings: 30% (peripheral neuropathy with absent knee/ankle jerks and loss of sensation, or symptoms of weakness, fatigue, anorexia, dizziness, heaviness/stiffness of legs, headache, sleep disturbance), 60% (cardiomegaly OR peripheral neuropathy with footdrop or thigh/calf muscle atrophy), 100% (congestive heart failure, anasarca, or Wernicke-Korsakoff syndrome). After active disease resolves, rate residuals under appropriate body system DCs.',
        source: '38 CFR 4.88b, DC 6314',
        important: true
      },
      wernicke: {
        term: 'Wernicke-Korsakoff Syndrome',
        definition: 'Severe thiamine deficiency can cause Wernicke\'s encephalopathy (acute: confusion, ataxia, eye movement abnormalities) progressing to Korsakoff syndrome (chronic: memory impairment, confabulation). These are ratable neurological residuals.',
        source: '38 CFR 4.88b, DC 6314',
        important: true
      },
      powPresumptive: {
        term: 'POW Presumptive',
        definition: 'Beriberi is a presumptive service-connected condition for former prisoners of war under 38 CFR 3.309(c).',
        source: '38 CFR 3.309(c)',
        important: true
      },
      residuals: {
        term: 'Post-Active Phase Residuals',
        definition: 'After active beriberi resolves, rate residuals under appropriate body system DCs: peripheral neuropathy (DC 8521), cardiac residuals (DC 7020), neurological residuals from Wernicke-Korsakoff (mental health or neurological DCs).',
        source: '38 CFR 4.88b, DC 6314'
      }
    },

    documentationTips: [
      {
        tip: 'For POW veterans: document POW status — beriberi is presumptively service-connected.',
        priority: 'critical'
      },
      {
        tip: 'Get thiamine (B1) blood level testing confirming deficiency.',
        priority: 'critical'
      },
      {
        tip: 'Document cardiac findings: echocardiogram for cardiomegaly, ECG for arrhythmias.',
        priority: 'high'
      },
      {
        tip: 'Document neurological findings: nerve conduction studies for peripheral neuropathy, cognitive testing for Wernicke-Korsakoff.',
        priority: 'high'
      },
      {
        tip: 'After active phase, separately claim all residuals under neurological and cardiac DCs.',
        priority: 'critical'
      }
    ],

    examTips: [
      'POW veterans: confirm presumptive service connection is applied',
      'Report cardiac symptoms: swelling, shortness of breath, palpitations',
      'Report neurological symptoms: leg weakness, foot drop, numbness, memory problems',
      'Bring thiamine level labs, cardiac imaging, and neurological test results',
      'After recovery: confirm residuals are rated separately under their own DCs'
    ]
  },

  // ============================================
  // PELLAGRA - DC 6315
  // ============================================
  '6315': {
    condition: 'Pellagra (Niacin/B3 Deficiency)',
    cfrReference: '38 CFR 4.88b, DC 6315',

    keyDefinitions: {
      ratingScale: {
        term: 'Pellagra Rating Scale — "4 Ds"',
        definition: 'Ratings: 10% (confirmed diagnosis with nonspecific symptoms: decreased appetite, weight loss, abdominal discomfort, weakness, inability to concentrate, irritability), 20% (stomatitis, achlorhydria, or diarrhea), 40% (stomatitis + diarrhea + symmetrical dermatitis — the classic "3 Ds"), 60% (above plus mental symptoms and impaired bodily vigor — the "4th D": dementia), 100% (marked mental changes, moist dermatitis, inability to retain nourishment, exhaustion, cachexia). The four Ds of pellagra: Dermatitis, Diarrhea, Dementia, Death.',
        source: '38 CFR 4.88b, DC 6315',
        important: true
      },
      powPresumptive: {
        term: 'POW Presumptive',
        definition: 'Pellagra is a presumptive service-connected condition for former prisoners of war under 38 CFR 3.309(c). No nexus letter required.',
        source: '38 CFR 3.309(c)',
        important: true
      },
      symmetricalDermatitis: {
        term: 'Symmetrical Dermatitis — Key Feature',
        definition: 'The dermatitis of pellagra is characteristically symmetrical, appearing on sun-exposed skin (neck, hands, forearms). Its presence with diarrhea and stomatitis = 40% rating. Document the symmetrical distribution specifically.',
        source: '38 CFR 4.88b, DC 6315',
        important: true
      }
    },

    documentationTips: [
      {
        tip: 'For POW veterans: document POW status — pellagra is presumptively service-connected.',
        priority: 'critical'
      },
      {
        tip: 'Get niacin/B3 level testing and urine N-methylnicotinamide confirming deficiency.',
        priority: 'critical'
      },
      {
        tip: 'Document all four components: dermatitis (symmetrical, sun-exposed), diarrhea, cognitive/mental symptoms, general debility.',
        priority: 'high'
      },
      {
        tip: 'Photograph the symmetrical dermatitis — visual documentation of the classic skin presentation is persuasive.',
        priority: 'high'
      },
      {
        tip: 'Document mental symptoms separately — they escalate from 40% to 60%.',
        priority: 'high'
      }
    ],

    examTips: [
      'POW veterans: confirm presumptive service connection is applied',
      'Report all symptoms across all four "D" categories: skin, GI, cognitive, general',
      'Describe the symmetrical distribution of any skin rash — sun-exposed areas',
      'Bring lab results confirming niacin deficiency',
      'Report the service circumstances that caused nutritional deficiency'
    ],

    ratingNote: 'Pellagra, avitaminosis (DC 6313), and beriberi (DC 6314) all share the same rating scale structure. All three are POW presumptive conditions. For veterans with multiple nutritional deficiencies, each may be separately service-connected and rated.'
  },
};

  // --- Infectious Disease aliases ---
  // Cards use placeholder DCs that don't match actual CFR codes
    RATING_ENHANCEMENTS['6310'] = RATING_ENHANCEMENTS['6304'];   // MalariaRatingCard → Malaria (6304)
    RATING_ENHANCEMENTS['6311'] = RATING_ENHANCEMENTS['6316'];   // BrucellosisRatingCard → Brucellosis (6316)
    RATING_ENHANCEMENTS['6317'] = RATING_ENHANCEMENTS['6334'];   // ShigellaRatingCard → Shigella (6334)
    RATING_ENHANCEMENTS['6318'] = RATING_ENHANCEMENTS['6333'];   // SalmonellaRatingCard → Salmonella (6333)
    RATING_ENHANCEMENTS['6320'] = RATING_ENHANCEMENTS['6319'];   // LymeDiseaseRatingCard → Lyme Disease (6319)
    RATING_ENHANCEMENTS['6326'] = RATING_ENHANCEMENTS['6312'];   // NTMRatingCard → NTM (6312)

  // --- Conditions with no standalone DC ---
    RATING_ENHANCEMENTS['7199'] = RATING_ENHANCEMENTS['insomnia'];     // InsomniaRatingCard → insomnia key
    RATING_ENHANCEMENTS['7345'] = RATING_ENHANCEMENTS['hepatitis_b'];  // HepatitisBRatingCard → hepatitis_b key

  // --- Hemic & Lymphatic aliases ---
  // Cards use adjacent/wrong DCs
    RATING_ENHANCEMENTS['7531'] = RATING_ENHANCEMENTS['7530'];   // ChronicRenalDiseaseRatingCard (7531=transplant) → CKD (7530)
    RATING_ENHANCEMENTS['7700'] = RATING_ENHANCEMENTS['7720'];   // IronDeficiencyAnemiaRatingCard → Iron Deficiency (7720)
    RATING_ENHANCEMENTS['7702'] = RATING_ENHANCEMENTS['7714'];   // SickleCellAnemiaRatingCard → Sickle Cell (7714)
    RATING_ENHANCEMENTS['7706'] = RATING_ENHANCEMENTS['7709'];   // HodgkinsLymphomaRatingCard (7706=splenectomy) → Hodgkin's (7709)

  // --- GU / Gynecological aliases ---
    RATING_ENHANCEMENTS['7617'] = RATING_ENHANCEMENTS['7621'];   // PelvicProlapseRatingCard (7617=uterus removal) → Prolapse (7621)

  // --- Neurological aliases ---
    RATING_ENHANCEMENTS['8023'] = RATING_ENHANCEMENTS['8010'];   // MyelitisRatingCard → Myelitis (8010)

  // --- Dental aliases ---
    RATING_ENHANCEMENTS['9906'] = RATING_ENHANCEMENTS['9903'];   // MandibleNonunionRatingCard (9906=condyloid) → Nonunion (9903)
    RATING_ENHANCEMENTS['9914'] = RATING_ENHANCEMENTS['9917'];   // BenignOralNeoplasmRatingCard → Benign Neoplasm (9917)
    RATING_ENHANCEMENTS['9915'] = RATING_ENHANCEMENTS['9918'];   // MalignantOralNeoplasmRatingCard → Malignant Neoplasm (9918)



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