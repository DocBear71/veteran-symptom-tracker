/**
 * serviceConnectionMethods.js
 *
 * The Five Ways to Establish Service Connection for VA Disability Claims
 *
 * This data file contains comprehensive information about how veterans can
 * establish that their current disability is connected to military service.
 *
 * Sources:
 * - 38 U.S.C. § 1110 (Basic entitlement - wartime)
 * - 38 U.S.C. § 1131 (Basic entitlement - peacetime)
 * - 38 U.S.C. § 1151 (Benefits for persons disabled by VA treatment)
 * - 38 C.F.R. § 3.303 (Principles relating to service connection)
 * - 38 C.F.R. § 3.306 (Aggravation of preservice disability)
 * - 38 C.F.R. § 3.307-3.309 (Presumptive service connection)
 * - 38 C.F.R. § 3.310 (Secondary service connection)
 * - 38 C.F.R. § 3.361 (Benefits under 38 U.S.C. 1151)
 */

export const SERVICE_CONNECTION_METHODS = [
  {
    id: 'direct',
    number: 1,
    name: 'Direct Service Connection',
    shortName: 'Direct',
    icon: '🎯',
    color: 'blue',
    description: 'Clear evidence of an incident during service linked to current disability',
    legalBasis: '38 C.F.R. § 3.303',

    requirements: [
      'Current diagnosis of a disability',
      'Evidence of an in-service event, injury, or disease',
      'Medical nexus linking current disability to in-service event'
    ],

    examples: [
      {
        scenario: 'Parachute injury',
        details: 'Veteran broke back during Airborne School landing, now has paralysis. Clear link between service incident and current disability.'
      },
      {
        scenario: 'Hearing loss from weapons fire',
        details: 'Infantry veteran has documented noise exposure from weapons training and combat. Now has bilateral hearing loss.'
      },
      {
        scenario: 'Knee injury from PT',
        details: 'Service member tore ACL during physical training. Medical records show treatment in service. Now has chronic knee instability.'
      }
    ],

    evidenceNeeded: [
      'Service treatment records showing in-service incident',
      'Current medical diagnosis',
      'Nexus letter from physician linking condition to service',
      'Buddy statements from fellow service members who witnessed incident',
      'Any relevant service records (LOD reports, incident reports)'
    ],

    tips: [
      'Request your complete service treatment records from the National Personnel Records Center (NPRC)',
      'If records were lost (e.g., 1973 fire), explain this and provide alternative evidence',
      'Buddy statements can substitute for missing records in some cases',
      'The nexus opinion is often the key - consider getting an independent medical opinion'
    ],

    activedutyNote: 'If you are currently on active duty, all diagnosed conditions are automatically considered direct service connected.'
  },

  {
    id: 'presumptive',
    number: 2,
    name: 'Presumptive Service Connection',
    shortName: 'Presumptive',
    icon: '📋',
    color: 'green',
    description: 'Certain conditions are legally presumed service-connected based on service era or exposure',
    legalBasis: '38 C.F.R. §§ 3.307, 3.309',

    requirements: [
      'Qualifying service (location, dates, or exposure)',
      'Current diagnosis of a presumptive condition',
      'Condition manifested within presumptive period (if applicable)',
      'Disability rated at 10% or more (for most presumptives)'
    ],

    categories: [
      {
        name: 'Agent Orange (Vietnam Era)',
        period: 'Service in Vietnam, Thailand, Korean DMZ, or aboard ships in inland waterways (1962-1975)',
        conditions: ['Parkinson\'s disease', 'Ischemic heart disease', 'Type 2 diabetes', 'Various cancers', 'Peripheral neuropathy', 'Chloracne']
      },
      {
        name: 'Gulf War (Southwest Asia)',
        period: 'Service in Southwest Asia theater (1990-present)',
        conditions: ['Chronic fatigue syndrome', 'Fibromyalgia', 'Functional GI disorders', 'Undiagnosed illnesses']
      },
      {
        name: 'Burn Pit Exposure (PACT Act)',
        period: 'Service in covered locations (post-9/11)',
        conditions: ['Respiratory conditions', 'Various cancers', 'Constrictive bronchiolitis']
      },
      {
        name: 'Camp Lejeune Water Contamination',
        period: 'Service at Camp Lejeune for 30+ days (1953-1987)',
        conditions: ['Various cancers', 'Parkinson\'s disease', 'Kidney disease', 'Liver disease']
      },
      {
        name: 'Radiation Exposure',
        period: 'Atomic veterans, nuclear testing participants',
        conditions: ['Various cancers', 'Leukemia', 'Lymphoma']
      },
      {
        name: 'Former POWs',
        period: 'Any period of captivity as POW',
        conditions: ['Anxiety disorders', 'PTSD', 'Frostbite residuals', 'Malnutrition effects', 'Various conditions based on duration']
      },
      {
        name: 'Chronic Diseases (One Year)',
        period: 'Must manifest to 10%+ within one year of discharge',
        conditions: ['Arthritis', 'Diabetes', 'Cardiovascular disease', 'Hypertension', 'Peptic ulcer', 'Certain nervous system disorders']
      },
      {
        name: 'Tropical Diseases',
        period: 'Service in tropical regions',
        conditions: ['Malaria', 'Various parasitic infections']
      }
    ],

    examples: [
      {
        scenario: 'Vietnam veteran with Parkinson\'s',
        details: 'Veteran served in Vietnam 1968-1969. Diagnosed with Parkinson\'s disease in 2020. No need to prove herbicide exposure - it\'s presumed.'
      },
      {
        scenario: 'Gulf War veteran with IBS',
        details: 'Veteran deployed to Kuwait in 1991. Has chronic IBS. Functional GI disorders are presumptive for Gulf War service.'
      },
      {
        scenario: 'Post-9/11 veteran with respiratory issues',
        details: 'Veteran served in Afghanistan with documented burn pit exposure. Now has chronic bronchitis. PACT Act provides presumptive coverage.'
      }
    ],

    evidenceNeeded: [
      'DD-214 or service records proving qualifying service location/dates',
      'Current medical diagnosis of presumptive condition',
      'Evidence condition manifested within presumptive period (if applicable)'
    ],

    tips: [
      'You do NOT need to prove the exposure caused your condition - the law presumes it',
      'Check if your condition is on the presumptive list for your service era',
      'The PACT Act (2022) added many new presumptive conditions',
      'Some conditions have extended presumptive periods (MS = 7 years, ALS = any time)'
    ],

    appLink: 'See the Presumptive Conditions Guide in this app for a complete list'
  },

  {
    id: 'aggravation',
    number: 3,
    name: 'Pre-Existing Condition Aggravated by Service',
    shortName: 'Aggravation',
    icon: '📈',
    color: 'orange',
    description: 'A condition that existed before service was made permanently worse by military service',
    legalBasis: '38 C.F.R. § 3.306',

    requirements: [
      'Pre-existing condition documented before or at entry to service',
      'Evidence the condition worsened during service',
      'The worsening was beyond natural progression of the disease',
      'Current disability related to the aggravated condition'
    ],

    keyConceptPreemption: {
      title: 'Presumption of Soundness',
      explanation: 'If a condition was NOT noted on your entrance examination, you are presumed to have been in sound condition at entry. The VA must then prove by clear and unmistakable evidence that: (1) the condition existed before service, AND (2) it was not aggravated by service.'
    },

    examples: [
      {
        scenario: 'Asthma worsened by exposure',
        details: 'Veteran had mild childhood asthma noted on entrance exam. Exposure to burn pits and dust in deployment caused severe, chronic asthma requiring daily medication.'
      },
      {
        scenario: 'Back condition worsened by duties',
        details: 'Veteran had minor scoliosis at entry. Years of carrying heavy rucksacks and equipment caused permanent worsening requiring surgery.'
      },
      {
        scenario: 'Skin condition aggravated',
        details: 'Veteran had mild eczema before service. Chemical exposure during MOS duties caused severe, widespread flare-ups that never returned to baseline.'
      }
    ],

    evidenceNeeded: [
      'Entrance examination showing pre-existing condition',
      'Service treatment records documenting worsening during service',
      'Current medical evidence showing permanent worsening',
      'Medical opinion that service aggravated the condition beyond natural progression',
      'Comparison of condition severity before, during, and after service'
    ],

    tips: [
      'The baseline severity at entry is critical - document what your condition was like before service',
      'Temporary flare-ups during service are NOT aggravation - the worsening must be permanent',
      'If condition wasn\'t noted at entry, presumption of soundness may help your claim',
      'Get a medical opinion specifically addressing whether service caused permanent worsening'
    ]
  },

  {
    id: 'secondary',
    number: 4,
    name: 'Secondary Service Connection',
    shortName: 'Secondary',
    icon: '🔗',
    color: 'purple',
    description: 'A new disability caused by or worsened by an already service-connected condition',
    legalBasis: '38 C.F.R. § 3.310',

    requirements: [
      'An already service-connected primary condition',
      'A current secondary condition',
      'Medical evidence showing the secondary condition was caused OR aggravated by the primary condition'
    ],

    twoTypes: [
      {
        type: 'Causation',
        explanation: 'The service-connected condition directly caused the secondary condition',
        example: 'Service-connected diabetes caused peripheral neuropathy'
      },
      {
        type: 'Aggravation',
        explanation: 'The service-connected condition made a non-service-connected condition worse',
        example: 'Service-connected knee injury caused altered gait, which aggravated pre-existing hip arthritis'
      }
    ],

    commonExamples: [
      {
        primary: 'Diabetes Mellitus (DC 7913)',
        secondaries: ['Peripheral neuropathy', 'Erectile dysfunction', 'Diabetic retinopathy', 'Kidney disease', 'Hypertension']
      },
      {
        primary: 'PTSD (DC 9411)',
        secondaries: ['Depression', 'Sleep apnea', 'Hypertension', 'Substance abuse disorders', 'Migraines']
      },
      {
        primary: 'Back Conditions',
        secondaries: ['Radiculopathy', 'Bladder dysfunction', 'Bowel dysfunction', 'Depression', 'Erectile dysfunction']
      },
      {
        primary: 'Knee/Hip Conditions',
        secondaries: ['Opposite limb arthritis (compensatory)', 'Back problems', 'Gait abnormalities']
      },
      {
        primary: 'Tinnitus (DC 6260)',
        secondaries: ['Sleep disturbance', 'Anxiety', 'Depression', 'Migraines']
      }
    ],

    evidenceNeeded: [
      'Rating decision showing primary condition is service-connected',
      'Current diagnosis of secondary condition',
      'Medical nexus opinion linking secondary to primary condition',
      'Treatment records showing relationship between conditions',
      'Medical literature supporting the connection (helpful but not required)'
    ],

    tips: [
      'Review your service-connected conditions for potential secondaries',
      'A nexus letter from your treating physician is crucial',
      'The secondary condition does NOT need to be related to military service itself',
      'You can also claim secondary aggravation if your SC condition made another condition worse',
      'Medications for SC conditions can cause secondary conditions (e.g., hearing loss from TB medication)'
    ],

    appLink: 'See the Secondary Conditions Guide in this app for comprehensive secondary condition mappings'
  },

  {
    id: 'section1151',
    number: 5,
    name: 'Service Connection due to VA Treatment Injury',
    shortName: '38 U.S.C. § 1151',
    icon: '🏥',
    color: 'red',
    description: 'Disability caused by VA hospital care, treatment, or examination',
    legalBasis: '38 U.S.C. § 1151; 38 C.F.R. § 3.361',

    requirements: [
      'Additional disability not present before VA treatment',
      'VA hospital care, medical/surgical treatment, or examination',
      'Proximate cause was VA fault OR an event not reasonably foreseeable',
      'NOT the result of veteran\'s willful misconduct'
    ],

    proximateCauseOptions: [
      {
        type: 'VA Fault',
        elements: [
          'Carelessness',
          'Negligence',
          'Lack of proper skill',
          'Error in judgment',
          'Similar instance of fault',
          'Treatment without informed consent'
        ],
        standard: 'VA failed to exercise the degree of care expected of a reasonable health care provider'
      },
      {
        type: 'Not Reasonably Foreseeable',
        explanation: 'An event that a reasonable health care provider would not have considered an ordinary risk of the treatment',
        note: 'The event need not be completely unforeseeable, just not an ordinary expected risk'
      }
    ],

    examples: [
      {
        scenario: 'Surgical complication',
        details: 'Veteran had routine VA surgery. Surgeon made error causing nerve damage resulting in permanent weakness. This was not a normal risk of the procedure.'
      },
      {
        scenario: 'Medication error',
        details: 'VA prescribed wrong medication or wrong dosage, causing permanent organ damage.'
      },
      {
        scenario: 'Diagnostic failure',
        details: 'VA failed to diagnose condition that was clearly indicated by symptoms and tests, leading to progression and worse outcome.'
      },
      {
        scenario: 'Infection from VA care',
        details: 'Veteran developed serious infection during VA hospitalization due to inadequate sterile procedures.'
      }
    ],

    evidenceNeeded: [
      'VA treatment records before and after the incident',
      'Current diagnosis showing additional disability',
      'Medical expert opinion on standard of care',
      'Evidence of VA fault or unforeseeable event',
      'Documentation that condition was not present before treatment'
    ],

    importantCases: [
      {
        case: 'Viegas v. Shinseki',
        year: 2013,
        citation: '705 F.3d 1374 (Fed. Cir. 2013)',
        holding: 'Established framework for evaluating § 1151 claims and defining proximate cause requirements'
      }
    ],

    tips: [
      'Request complete copies of all VA treatment records related to the incident',
      'File a claim promptly - evidence is easier to gather when recent',
      'Consider consulting with a VA-accredited attorney for these complex claims',
      'Document everything - keep a detailed timeline of events',
      'Informed consent violations can be grounds for § 1151 claims'
    ],

    compensation: 'Benefits are paid "in the same manner as if such additional disability were service-connected"'
  }
];

/**
 * Key legal standards and definitions for service connection
 */
export const SERVICE_CONNECTION_STANDARDS = {
  benefitOfTheDoubt: {
    name: 'Benefit of the Doubt',
    citation: '38 U.S.C. § 5107(b); 38 C.F.R. § 3.102',
    explanation: 'When there is an approximate balance of positive and negative evidence, the benefit of the doubt is given to the veteran.',
    warning: 'CRITICAL UPDATE: After the Supreme Court\'s Bufkin v. Collins decision (March 2025), this rule only applies if VA admits the evidence is balanced. If VA says one opinion is "more persuasive," courts usually cannot re-weigh it on appeal. VA is finding evidence "balanced" less and less often.',
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
        holding: 'Courts generally cannot re-weigh evidence on appeal if VA determined one medical opinion was "more persuasive" than another.',
        important: true,
        warning: true
      }
    ],
    importance: 'critical'
  },

  threeElements: {
    name: 'Three Elements of Service Connection',
    citation: 'Caluza v. Brown, 7 Vet. App. 498 (1995)',
    elements: [
      'A current disability',
      'In-service incurrence or aggravation of a disease or injury',
      'A nexus between the current disability and the in-service event'
    ]
  },

  competentEvidence: {
    medical: 'Medical evidence requires specialized knowledge, training, or experience (medical professionals)',
    lay: 'Lay evidence is testimony from non-medical witnesses (veterans, family, friends)',
    layCompetency: 'Veterans are competent to describe symptoms they experience (pain, ringing in ears, etc.)'
  },

  nexus: {
    name: 'Medical Nexus',
    explanation: 'A medical opinion connecting the current disability to the in-service event',
    standard: 'Must be stated in terms of "at least as likely as not" (50% or greater probability)',
    who: 'Should come from a qualified medical professional (physician, psychologist, etc.)'
  }
};

/**
 * Resources for veterans seeking help with claims
 */
export const CLAIMS_RESOURCES = {
  representatives: [
    {
      type: 'Veterans Service Organizations (VSOs)',
      description: 'Free representation from organizations like American Legion, VFW, DAV',
      link: 'https://www.va.gov/vso/'
    },
    {
      type: 'VA-Accredited Attorneys',
      description: 'Legal representation, especially for complex claims or appeals',
      link: 'https://www.va.gov/ogc/apps/accreditation/'
    },
    {
      type: 'VA-Accredited Claims Agents',
      description: 'Non-attorney representatives with VA accreditation',
      link: 'https://www.va.gov/ogc/apps/accreditation/'
    },
    {
      type: 'County Veteran Service Officers',
      description: 'Local government representatives who assist with claims',
      link: 'https://www.nacvso.org/'
    }
  ],

  legalResources: [
    {
      name: 'U.S. Court of Appeals for Veterans Claims (CAVC)',
      description: 'Court opinions and decisions',
      link: 'https://www.uscourts.cavc.gov/opinions.php'
    },
    {
      name: 'Veterans Law Library',
      description: 'Searchable case law database',
      link: 'http://www.veteranslawlibrary.com/case_law.htm'
    },
    {
      name: '38 CFR (Code of Federal Regulations)',
      description: 'Official VA regulations',
      link: 'https://www.ecfr.gov/current/title-38'
    },
    {
      name: 'M21-1 Adjudication Procedures Manual',
      description: 'VA internal procedures for processing claims',
      link: 'https://www.knowva.ebenefits.va.gov/'
    }
  ]
};

/**
 * MULTIPLE THEORIES OF SERVICE CONNECTION
 *
 * Source: Doug Haynes — veterans may pursue all supported theories simultaneously.
 * The VA has a duty to consider all reasonably raised theories supported by evidence.
 * Reference: 38 C.F.R. § 3.303; Schroeder v. West, 212 F.3d 1265 (Fed. Cir. 2000)
 */
export const MULTIPLE_THEORIES_GUIDANCE = {
  headline: 'You Can File Under Multiple Theories at Once',
  legalBasis: '38 C.F.R. § 3.303; Schroeder v. West, 212 F.3d 1265 (Fed. Cir. 2000)',

  coreRule:
      'The VA has a duty to consider ALL reasonably raised theories of service connection ' +
      'supported by the evidence. You do not have to pick just one. Submit the evidence ' +
      'and let the VA determine which theory results in the grant.',

  importance: 'critical',

  examples: [
    {
      condition: 'Sleep Apnea',
      theories: [
        { theory: 'Direct', description: 'In-service symptoms documented during service' },
        { theory: 'Secondary to PTSD', description: 'PTSD disrupts sleep architecture and is linked to OSA development' },
        { theory: 'Secondary to orthopedic conditions', description: 'Weight gain caused by limited mobility from service-connected injuries' },
        { theory: 'Secondary to medications', description: 'Medications for service-connected conditions cause or worsen sleep apnea' },
      ],
    },
    {
      condition: 'Migraines',
      theories: [
        { theory: 'Direct', description: 'Specific in-service event (blast exposure, head injury, etc.)' },
        { theory: 'Secondary to tinnitus', description: 'Auditory hypersensitivity and chronic tinnitus trigger migraines' },
        { theory: 'Secondary to PTSD', description: 'Hyperarousal and stress response linked to migraine onset' },
        { theory: 'Secondary to cervical spine', description: 'Cervicogenic headaches from service-connected neck condition' },
      ],
    },
    {
      condition: 'Hypertension',
      theories: [
        { theory: 'Direct', description: 'Directly related to service stressors, physical demands, or exposures' },
        { theory: 'Secondary to PTSD', description: 'Chronic sympathetic nervous system activation elevates blood pressure' },
        { theory: 'Secondary to kidney disease', description: 'Renal disease causes or worsens hypertension' },
        { theory: 'Secondary to sleep apnea', description: 'OSA-related hypoxia drives hypertension' },
      ],
    },
  ],

  keyPrinciple:
      'The strongest claims are supported by more than medical records alone. ' +
      'Medical evidence explains the diagnosis. Lay evidence explains how the ' +
      'disability actually affects your life. The VA needs to hear both.',
};

/**
 * LAY EVIDENCE PACKAGE
 *
 * Source: Doug Haynes — comprehensive lay evidence strategy.
 * Covers personal statements, buddy statements, and flare-up journals.
 * These can establish observable symptoms, functional limitations, and
 * real-world impact that medical records alone often fail to capture.
 */
export const LAY_EVIDENCE_PACKAGE = {
  headline: 'Build Your Lay Evidence Package',
  subtitle: 'Medical evidence explains the diagnosis. Lay evidence explains how the disability affects your life.',

  importance: 'critical',

  // ── Personal Statement (VA Form 21-4138) ─────────────────────────────────
  personalStatement: {
    name: 'Personal Statement',
    vaForm: 'VBA Form 21-4138',
    formName: 'Statement in Support of Claim',
    who: 'The veteran themselves',
    purpose: 'Describe your condition in your own words — your lived experience that medical records miss.',

    whatToInclude: [
      'When symptoms started (date, context, what was happening)',
      'How symptoms have progressed over time',
      'Frequency and severity of symptoms',
      'Functional limitations in daily life',
      'Impact on employment (missed work, reduced performance, job loss)',
      'Impact on daily activities and quality of life',
    ],

    tips: [
      'Be specific — include dates, frequencies, and concrete examples',
      'Describe your WORST periods, not just average days',
      'Connect symptoms directly to how they limit what you can do',
      'Be honest — do not minimize, but do not exaggerate',
    ],
  },

  // ── Buddy / Lay Statements (VA Form 21-10210) ─────────────────────────────
  buddyStatements: {
    name: 'Buddy / Lay Statements',
    vaForm: 'VBA Form 21-10210',
    formName: 'Lay/Witness Statement',
    who: 'Spouse, family members, friends, co-workers, supervisors',
    purpose: 'Third-party corroboration of observable symptoms and functional impact.',

    whatTheyCanEstablish: [
      'Observable symptoms (limping, shaking, crying, nightmares, etc.)',
      'Changes in behavior or personality since service',
      'Missed work or reduced productivity',
      'Physical limitations witnessed firsthand',
      'Social withdrawal and relationship impact',
      'Sleep problems observed by a partner or family member',
      'Overall impact on quality of life',
    ],

    whoShouldWrite: [
      { relationship: 'Spouse / Partner', value: 'highest', note: 'Observes daily symptoms including sleep, mood, and functional limits' },
      { relationship: 'Family members', value: 'high', note: 'Can describe behavioral changes over time and social impact' },
      { relationship: 'Friends', value: 'medium', note: 'Can describe social withdrawal and activity limitations' },
      { relationship: 'Co-workers', value: 'high', note: 'Can describe missed work, performance decline, and physical limitations on the job' },
      { relationship: 'Supervisors', value: 'high', note: 'Can confirm accommodations made, missed time, or job performance issues' },
    ],

    tips: [
      'The more specific the statement, the more useful it is',
      'Include dates, frequencies, and concrete examples of what was observed',
      'Statements do not need to be long — focused and factual is best',
      'Multiple statements from different perspectives are stronger than one',
    ],
  },

  // ── Flare-Up Journal (VA Form 21-4138) ───────────────────────────────────
  flareUpJournal: {
    name: 'Flare-Up Journal',
    vaForm: 'VBA Form 21-4138',
    formName: 'Statement in Support of Claim (used to submit journal)',
    purpose:
        'Extremely valuable for conditions that are not always severe on the day of a C&P exam. ' +
        'Demonstrates the episodic nature and real-world impact of your condition.',

    whatToDocument: [
      'Date of each flare-up',
      'Duration (hours, days)',
      'Severity (scale of 1–10 or descriptive)',
      'Activities affected or cancelled',
      'Work missed',
      'Medications used',
      'Need for assistance from others',
    ],

    tips: [
      'The more specific the journal, the more useful it becomes',
      'Daily entries are stronger than weekly summaries',
      'Note what triggered the flare-up if known',
      'Doc Bear\'s Symptom Vault symptom logs serve as your flare-up journal',
    ],

    appNote:
        'Your symptom logs in this app are your flare-up journal. ' +
        'Export them as evidence packages to submit with your claim.',
  },

  // ── When and How to Submit ────────────────────────────────────────────────
  submissionStrategy: {
    headline: 'Submit This Evidence WITH Your Claim Whenever Possible',

    ifClaimPending: {
      label: 'Claim Still in Progress?',
      action: 'Upload evidence immediately — do not wait for a decision.',
      methods: [
        { method: 'VA.gov', description: 'Upload directly to your pending claim' },
        { method: 'QuickSubmit', description: 'VA\'s fax-to-digital upload tool' },
        { method: 'Fax', description: 'Fax to your regional office with claim number on cover sheet' },
        { method: 'Mail', description: 'Certified mail to your VA regional office' },
        { method: 'VSO / Agent / Attorney', description: 'Have your representative submit on your behalf' },
      ],
      important: 'Make sure the evidence is associated with the PENDING claim, not filed as a separate submission.',
    },

    ifClaimDenied: {
      label: 'Claim Denied?',
      action: 'File a Supplemental Claim with new and relevant evidence.',
      vaForm: 'VA Form 20-0995',
      formName: 'Decision Review Request: Supplemental Claim',
      details:
          'Personal statements, buddy statements, and flare-up journals can address gaps that ' +
          'contributed to the denial. This evidence must be new and relevant. You can also ' +
          'request a new C&P exam based on the submitted lay evidence.',
      important:
          'The evidence must be "new and relevant" — evidence not previously considered ' +
          'that could change the outcome of the claim.',
    },
  },

  // ── Core Principle from Doug Haynes ──────────────────────────────────────
  coreMessage:
      'The veteran lives with the condition every day. ' +
      'Make sure the VA hears that part of the story too, so the VA is looking at the whole person.',
};

/**
 * Get a specific service connection method by ID
 */
export const getServiceConnectionMethod = (methodId) => {
  return SERVICE_CONNECTION_METHODS.find(method => method.id === methodId);
};

/**
 * Get methods applicable to a specific situation
 */
export const getApplicableMethods = (situation) => {
  const applicable = [];

  if (situation.hasInServiceEvent) {
    applicable.push('direct');
  }
  if (situation.hasPresumptiveService) {
    applicable.push('presumptive');
  }
  if (situation.hasPreExistingCondition) {
    applicable.push('aggravation');
  }
  if (situation.hasServiceConnectedCondition) {
    applicable.push('secondary');
  }
  if (situation.hasVATreatmentIssue) {
    applicable.push('section1151');
  }

  return SERVICE_CONNECTION_METHODS.filter(method => applicable.includes(method.id));
};

export default SERVICE_CONNECTION_METHODS;