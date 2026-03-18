/* eslint-disable no-unused-vars */

// ============================================
// GENITOURINARY RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: Kidney Stones, Chronic Renal Disease,
// Voiding Dysfunction, Chronic Cystitis, Neurogenic
// Bladder, Prostate Conditions, Urethral Stricture,
// Erectile Dysfunction, Penis Conditions,
// Endometriosis, Female Reproductive Organs,
// Pelvic Prolapse, Female Sexual Arousal Disorder.
//
// Based on 38 CFR Part 4, §§ 4.115a, 4.115b, 4.116
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

// ============================================
// SHARED HELPERS
// ============================================

import {getMeasurements} from '../measurements.js';

const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

// ============================================
// GENITOURINARY CONDITIONS (for CONDITIONS object)
// ============================================
export const GENITOURINARY_CONDITIONS = {
  KIDNEY_STONES: {
    id: 'kidney-stones',
    name: 'Kidney Stones (Nephrolithiasis)',
    diagnosticCode: '7508',
    cfrReference: '38 CFR 4.115b',
    symptomIds: [ 'kidney-stones', 'kidney-pain', 'blood-in-urine',
    ],
  },
  CHRONIC_RENAL_DISEASE: {
    id: 'chronic-renal-disease',
    name: 'Chronic Renal Disease (Chronic Kidney Disease)',
    diagnosticCode: '7530',
    cfrReference: '38 CFR 4.115a',
    symptomIds: [ 'kidney-infection', 'renal-swelling', 'renal-fatigue', 'renal-nausea', 'decreased-urination', 'foamy-urine',
    ],
  },
  CHRONIC_CYSTITIS: {
    id: 'chronic-cystitis',
    name: 'Chronic Cystitis (Bladder Infection/Inflammation)',
    diagnosticCode: '7512',
    cfrReference: '38 CFR 4.115a',
    symptomIds: [ 'bladder-pain', 'recurrent-uti', 'painful-urination', 'urinary-frequency', 'urinary-urgency',
    ],
  },
  NEUROGENIC_BLADDER: {
    id: 'neurogenic-bladder',
    name: 'Neurogenic Bladder',
    diagnosticCode: '7542',
    cfrReference: '38 CFR 4.115a',
    symptomIds: [ 'urinary-incontinence', 'urine-retention', 'incomplete-emptying',
    ],
  },
  PROSTATE_CONDITIONS: {
    id: 'prostate-conditions',
    name: 'Prostate Conditions (BPH, Prostatitis)',
    diagnosticCode: '7527',
    cfrReference: '38 CFR 4.115a',
    symptomIds: [ 'prostate-symptoms', 'prostate-pain', 'weak-stream', 'hesitancy', 'nocturia',
    ],
  },
  URETHRAL_STRICTURE: {
    id: 'urethral-stricture',
    name: 'Urethral Stricture',
    diagnosticCode: '7518',
    cfrReference: '38 CFR 4.115a',
    symptomIds: [ 'weak-stream', 'hesitancy', 'incomplete-emptying',
    ],
  },
  ERECTILE_DYSFUNCTION: {
    id: 'erectile-dysfunction',
    name: 'Erectile Dysfunction',
    diagnosticCode: '7522',
    cfrReference: '38 CFR 4.115b',
    symptomIds: [ 'erectile-dysfunction',
    ],
  },// Phase 4: Gynecological Conditions
  ENDOMETRIOSIS: {
    id: 'endometriosis',
    name: 'Endometriosis',
    diagnosticCode: '7629',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'endometriosis-pain',
      'endometriosis-bowel',
      'endometriosis-bladder',
      'chronic-pelvic-pain',
    ],
  },
  VULVA_CLITORIS_DISEASE: {
    id: 'vulva-clitoris-disease',
    name: 'Vulva or Clitoris Disease/Injury',
    diagnosticCode: '7610',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'vulvovaginitis',
      'vaginal-irritation',
    ],
  },
  VAGINA_DISEASE: {
    id: 'vagina-disease',
    name: 'Vagina Disease/Injury',
    diagnosticCode: '7611',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'vaginal-irritation',
      'abnormal-discharge',
    ],
  },
  CERVIX_DISEASE: {
    id: 'cervix-disease',
    name: 'Cervix Disease/Injury',
    diagnosticCode: '7612',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'cervicitis',
      'abnormal-discharge',
    ],
  },
  UTERUS_DISEASE: {
    id: 'uterus-disease',
    name: 'Uterus Disease/Injury/Adhesions',
    diagnosticCode: '7613',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'uterine-cramping',
      'chronic-pelvic-pain',
      'lower-abdominal-pain',
    ],
  },
  FALLOPIAN_TUBE_PID: {
    id: 'fallopian-tube-pid',
    name: 'Fallopian Tube Disease/PID',
    diagnosticCode: '7614',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'pid-symptoms',
      'abnormal-discharge',
      'chronic-pelvic-pain',
      'lower-abdominal-pain',
    ],
  },
  OVARY_DISEASE: {
    id: 'ovary-disease',
    name: 'Ovary Disease (includes PCOS, Dysmenorrhea)',
    diagnosticCode: '7615',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'ovarian-cysts',
      'polycystic-ovaries',
      'ovulation-pain',
      'anovulation',
      'painful-periods',
      'heavy-menstrual-bleeding',
      'irregular-periods',
      'absent-periods',
      'hirsutism',
      'hormonal-acne',
      'pcos-weight-changes',
    ],
  },
  PELVIC_PROLAPSE: {
    id: 'pelvic-prolapse',
    name: 'Pelvic Organ Prolapse',
    diagnosticCode: '7621',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'pelvic-pressure',
      'vaginal-bulge',
      'incomplete-bladder-emptying',
      'bowel-dysfunction-prolapse',
    ],
  },
  FEMALE_SEXUAL_AROUSAL_DISORDER: {
    id: 'female-sexual-arousal-disorder',
    name: 'Female Sexual Arousal Disorder (FSAD)',
    diagnosticCode: '7632',
    cfrReference: '38 CFR 4.116',
    symptomIds: [
      'sexual-dysfunction',
      'decreased-libido',
      'arousal-difficulty',
      'dyspareunia',
    ],
  },
};

// ============================================
// GENITOURINARY RATING CRITERIA & ANALYZE FUNCTIONS
// ============================================

export const KIDNEY_STONES_CRITERIA = {
  diagnosticCode: '7508',
  condition: 'Nephrolithiasis/Ureterolithiasis/Nephrocalcinosis (Kidney Stones)',
  cfrReference: '38 CFR 4.115b, Diagnostic Code 7508',

  note: 'Rating based on stone episodes requiring invasive or non-invasive procedures, or rate as hydronephrosis if kidney function is impaired.',

  ratings: [
    {
      percent: 30,
      summary: 'Recurrent stone formation requiring invasive or non-invasive procedures more than 2 times per year',
      criteriaDescription: [
        'Stone formation documented on imaging',
        'Requires procedures (lithotripsy, ureteroscopy, stent placement) more than twice yearly',
        'Recurrent episodes despite treatment',
      ],
      evidenceNeeded: [
        'Imaging reports showing stones (CT, ultrasound, X-ray)',
        'Procedure records (lithotripsy, ureteroscopy, stent placement)',
        'Documentation of frequency (>2 procedures per year)',
        'Emergency room visits for renal colic',
        'Urology treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Recurrent stone formation requiring procedures 1-2 times per year',
      criteriaDescription: [
        'Stone formation requiring 1-2 procedures annually',
        'May include lithotripsy, ureteroscopy, or stent placement',
        'Documented history of kidney stones',
      ],
      evidenceNeeded: [
        'Imaging showing stone formation',
        'Procedure records',
        'Treatment history from urology',
      ],
    },
    {
      percent: 0,
      summary: 'History of stones but no recent procedures, or controlled with conservative management',
      criteriaDescription: [
        'History of kidney stones',
        'Controlled with diet, hydration, medication',
        'No procedures required in past year',
      ],
      evidenceNeeded: [
        'Documentation of stone history',
        'Current management plan',
      ],
    },
  ],

  definitions: {
    'Invasive procedures': 'Ureteroscopy, percutaneous nephrolithotomy, open surgery',
    'Non-invasive procedures': 'ESWL (lithotripsy), shock wave therapy',
    'Recurrent stone formation': 'New stones forming despite preventive measures',
    'Renal colic': 'Severe flank pain from stone passage',
  },

  disclaimer: 'If kidney function is impaired (elevated creatinine, decreased eGFR, hydronephrosis), rate under DC 7530 (Chronic Renal Disease) instead. Service connection requires evidence that stones are related to military service.',
};
// DC 7530: Chronic Renal Disease

export const CHRONIC_RENAL_DISEASE_CRITERIA = {
  diagnosticCode: '7530',
  condition: 'Chronic Renal Disease',
  cfrReference: '38 CFR 4.115a, Diagnostic Code 7530',

  note: 'Rated based on renal dysfunction. Requires regular dialysis for 100% rating.',

  ratings: [
    {
      percent: 100,
      summary: 'Requiring regular dialysis',
      criteriaDescription: [
        'End-stage renal disease (ESRD)',
        'Hemodialysis or peritoneal dialysis required',
        'Typically 3+ times per week for hemodialysis',
        'eGFR typically <15 mL/min/1.73m²',
      ],
      evidenceNeeded: [
        'Dialysis center records showing regular treatment',
        'Vascular access documentation (fistula, graft, catheter)',
        'Lab values showing kidney failure',
        'Nephrology treatment records',
        'Documentation of dialysis frequency and duration',
      ],
    },
    {
      percent: 80,
      summary: 'eGFR 15-20 mL/min/1.73m², stage 4-5 CKD',
      criteriaDescription: [
        'Severe kidney disease',
        'eGFR 15-20 mL/min/1.73m² sustained over time',
        'May be approaching dialysis',
        'Significant metabolic complications',
      ],
      evidenceNeeded: [
        'Serial lab values showing eGFR 15-20',
        'Multiple readings over evaluation period',
        'Nephrology records',
        'Documentation of complications (anemia, bone disease, etc.)',
      ],
    },
    {
      percent: 60,
      summary: 'eGFR 20-30 mL/min/1.73m², stage 4 CKD',
      criteriaDescription: [
        'Severe kidney disease',
        'eGFR 20-30 mL/min/1.73m²',
        'Significant impairment of kidney function',
      ],
      evidenceNeeded: [
        'Lab values showing eGFR in range',
        'Creatinine levels elevated (typically >3.0 mg/dL)',
        'Treatment records',
      ],
    },
    {
      percent: 40,
      summary: 'eGFR 30-40 mL/min/1.73m², stage 3b CKD',
      criteriaDescription: [
        'Moderate to severe kidney disease',
        'eGFR 30-40 mL/min/1.73m²',
        'Persistent kidney impairment',
      ],
      evidenceNeeded: [
        'Serial eGFR measurements',
        'Elevated creatinine',
        'Nephrology evaluation',
      ],
    },
    {
      percent: 20,
      summary: 'eGFR 40-60 mL/min/1.73m², stage 3a CKD',
      criteriaDescription: [
        'Moderate kidney disease',
        'eGFR 40-60 mL/min/1.73m²',
        'Mild to moderate impairment',
      ],
      evidenceNeeded: [
        'Lab values showing reduced kidney function',
        'Multiple readings confirming chronic nature',
      ],
    },
    {
      percent: 0,
      summary: 'eGFR >60 or minimal impairment',
      criteriaDescription: [
        'Kidney function adequate',
        'eGFR >60 mL/min/1.73m²',
        'Stage 1-2 CKD or normal function',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    'eGFR': 'Estimated Glomerular Filtration Rate - measures how well kidneys filter blood',
    'ESRD': 'End-Stage Renal Disease - kidney failure requiring dialysis or transplant',
    'Hemodialysis': 'Blood filtered through external machine, typically 3x/week, 3-4 hours per session',
    'Peritoneal dialysis': 'Dialysis using abdominal lining, can be done at home daily',
    'CKD stages': 'Stage 1-2: eGFR >60, Stage 3a: 45-60, Stage 3b: 30-45, Stage 4: 15-30, Stage 5: <15',
  },

  disclaimer: 'Chronic kidney disease must be documented as service-connected. Ratings based on sustained kidney function measurements over time, not single readings. Kidney transplant recipients rated separately under DC 7531.',
};
// VOIDING DYSFUNCTION CRITERIA (38 CFR 4.115a)
// Used by: DC 7512 (Chronic Cystitis), DC 7527 (Prostate), DC 7542 (Neurogenic Bladder), DC 7518 (Urethral Stricture)

export const VOIDING_DYSFUNCTION_CRITERIA = {
  diagnosticCode: '7512/7527/7542/7518',
  condition: 'Voiding Dysfunction (Urinary Frequency, Incontinence, or Obstruction)',
  cfrReference: '38 CFR 4.115a, Rating Formula for Voiding Dysfunction',

  note: 'Multiple conditions rated under voiding dysfunction. Choose highest rating from: Urine Leakage, Frequency, or Obstructed Voiding.',

  // CONTINUAL URINE LEAKAGE / URINARY INCONTINENCE
  ratingsIncontinence: [
    {
      percent: 60,
      summary: 'Requiring appliance or absorbent materials changed more than 4 times per day',
      criteriaDescription: [
        'Continuous or very frequent urine leakage',
        'Requires protective garments/pads/diapers',
        'Changed more than 4 times daily',
        'May require urinary appliance or catheter system',
      ],
      evidenceNeeded: [
        'Log of pad/diaper changes showing >4 per day',
        'Medical documentation of incontinence severity',
        'Prescription records for incontinence supplies',
        'Urodynamic studies if available',
        'Treatment attempts (medications, procedures)',
      ],
    },
    {
      percent: 40,
      summary: 'Requiring absorbent materials changed 2-4 times per day',
      criteriaDescription: [
        'Frequent urine leakage',
        'Requires protective garments',
        'Changed 2-4 times daily',
      ],
      evidenceNeeded: [
        'Documentation of 2-4 pad changes per day',
        'Medical records confirming incontinence',
        'Prescription for incontinence products',
      ],
    },
    {
      percent: 20,
      summary: 'Requiring absorbent materials changed less than 2 times per day',
      criteriaDescription: [
        'Moderate urine leakage',
        'Requires protective garments',
        'Changed 1-2 times daily',
      ],
      evidenceNeeded: [
        'Documentation of incontinence',
        'Evidence of protective garment use',
      ],
    },
  ],

  // URINARY FREQUENCY
  ratingsFrequency: [
    {
      percent: 40,
      summary: 'Daytime voiding interval less than 1 hour, OR awakening to void 5+ times per night',
      criteriaDescription: [
        'Severe urinary frequency',
        'Voiding more than hourly during day, OR',
        'Waking 5 or more times per night to urinate (nocturia)',
      ],
      evidenceNeeded: [
        'Voiding diary showing frequency patterns',
        'Documentation over multiple days',
        'Medical evaluation confirming frequency',
      ],
    },
    {
      percent: 20,
      summary: 'Daytime voiding interval 1-2 hours, OR awakening 3-4 times per night',
      criteriaDescription: [
        'Frequent urination',
        'Voiding every 1-2 hours during day, OR',
        'Waking 3-4 times nightly',
      ],
      evidenceNeeded: [
        'Voiding diary',
        'Medical documentation of frequency',
      ],
    },
    {
      percent: 10,
      summary: 'Daytime voiding interval 2-3 hours, OR awakening 2 times per night',
      criteriaDescription: [
        'Moderately increased frequency',
        'Voiding every 2-3 hours during day, OR',
        'Waking twice nightly',
      ],
      evidenceNeeded: [
        'Documentation of voiding patterns',
      ],
    },
  ],

  // OBSTRUCTED VOIDING
  ratingsObstruction: [
    {
      percent: 30,
      summary: 'Urinary retention requiring intermittent or continuous catheterization',
      criteriaDescription: [
        'Unable to empty bladder naturally',
        'Requires self-catheterization (intermittent), OR',
        'Indwelling catheter (Foley), OR',
        'Suprapubic catheter',
      ],
      evidenceNeeded: [
        'Catheterization records',
        'Documentation of catheterization frequency (if intermittent)',
        'Post-void residual measurements showing retention',
        'Urology treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Marked obstructive symptoms with complications',
      criteriaDescription: [
        'Hesitancy, weak stream, incomplete emptying',
        'PLUS one or more of:',
        '- Post-void residual >150cc',
        '- Markedly decreased peak flow rate (<10cc/sec)',
        '- Recurrent UTIs secondary to obstruction',
        '- Stricture requiring dilation every 2-3 months',
      ],
      evidenceNeeded: [
        'Post-void residual measurements',
        'Uroflowmetry results',
        'UTI treatment records',
        'Stricture dilation procedure records',
      ],
    },
    {
      percent: 0,
      summary: 'Obstructive symptoms requiring dilation 1-2 times per year',
      criteriaDescription: [
        'Mild obstruction',
        'Occasional stricture dilation needed',
      ],
      evidenceNeeded: [
        'Procedure records for dilations',
      ],
    },
  ],

  definitions: {
    'Voiding dysfunction': 'Difficulty with bladder emptying or storage',
    'Post-void residual': 'Urine remaining in bladder after urination (normal <50cc)',
    'Intermittent catheterization': 'Self-catheterization multiple times daily',
    'Indwelling catheter': 'Foley catheter left in place continuously',
    'Suprapubic catheter': 'Catheter inserted through abdominal wall',
    'Uroflowmetry': 'Test measuring urine flow rate',
    'Nocturia': 'Waking at night to urinate',
  },

  disclaimer: 'Rate under the highest applicable category: incontinence, frequency, or obstruction. Do not pyramid ratings from multiple categories. Service connection must be established.',
};
// DC 7332: Rectum and Anus, Impairment of Sphincter Control (Fecal Incontinence)

export const ERECTILE_DYSFUNCTION_CRITERIA = {
  diagnosticCode: '7522',
  condition: 'Erectile Dysfunction, with or without penile deformity',
  cfrReference: '38 CFR 4.115b, Diagnostic Code 7522',

  note: 'Rated at 0% only. No compensation for impairment itself, but establishes service connection for potential special monthly compensation (SMC) eligibility under certain circumstances.',

  ratings: [
    {
      percent: 0,
      summary: 'Erectile dysfunction present',
      criteriaDescription: [
        'Documented erectile dysfunction',
        'May be mild, moderate, or severe',
        'With or without penile deformity',
      ],
      evidenceNeeded: [
        'Medical diagnosis of erectile dysfunction',
        'Urology evaluation',
        'Documentation of severity and impact',
        'Treatment attempts if any (medications, devices, etc.)',
        'Evidence linking to service-connected condition',
      ],
    },
  ],

  definitions: {
    'Erectile dysfunction': 'Inability to achieve or maintain erection sufficient for sexual intercourse',
    'SMC': 'Special Monthly Compensation - additional compensation for certain severe disabilities',
  },

  disclaimer: 'While rated at 0%, service connection for ED is important for: (1) potential SMC eligibility in specific circumstances, (2) establishing nexus to other service-connected conditions, (3) potential for increased rating if additional conditions develop. ED may be secondary to diabetes, hypertension, PTSD, medications, or other service-connected conditions.',
};

// =================================================================
// PENIS REMOVAL CONDITIONS (DC 7520-7521)
// =================================================================

export const PENIS_CONDITIONS_CRITERIA = {
  diagnosticCode: '7520-7521',
  condition: 'Penis Removal/Loss Conditions',
  cfrReference: '38 CFR 4.115b, Diagnostic Codes 7520-7521',

  smcNote: 'All penis removal conditions require review for Special Monthly Compensation (SMC) under § 3.350 for loss of creative organ.',

  ratings: [
    {
      percent: 30,
      diagnosticCode: '7520',
      summary: 'Penis, removal of half or more',
      criteria: {
        removalHalfOrMore: true,
      },
      criteriaDescription: [
        'Surgical or traumatic removal of 50% or more of the penis',
        'Documented by medical records',
        'Requires SMC review for loss of creative organ',
      ],
      evidenceNeeded: [
        'Surgical/operative reports documenting extent of removal',
        'Medical records describing the condition',
        'Documentation of cause (trauma, cancer treatment, etc.)',
        'Urology evaluation',
        'SMC application for loss of creative organ',
      ],
    },
    {
      percent: 20,
      diagnosticCode: '7521',
      summary: 'Penis, removal of glans',
      criteria: {
        removalGlans: true,
      },
      criteriaDescription: [
        'Surgical or traumatic removal of the glans penis only',
        'Less than half of penis removed',
        'Requires SMC review for loss of creative organ',
      ],
      evidenceNeeded: [
        'Surgical/operative reports documenting glans removal',
        'Medical records describing extent of loss',
        'Documentation of cause',
        'Urology evaluation',
        'SMC application for loss of creative organ',
      ],
    },
    {
      percent: 0,
      diagnosticCode: '7522',
      summary: 'Penile deformity with erectile dysfunction (see DC 7522)',
      criteria: {
        deformityOnly: true,
      },
      criteriaDescription: [
        'Disease or traumatic injury resulting in scarring or deformity',
        'Rated under DC 7522 at 0%',
        'Still qualifies for SMC review',
      ],
      evidenceNeeded: [
        'Medical documentation of deformity',
        'Urology evaluation',
        'Photographs if appropriate',
      ],
    },
  ],

  definitions: {
    glans: {
      term: 'Glans Penis',
      definition: 'The head or tip of the penis, which is removed in a partial penectomy.',
    },
    penectomy: {
      term: 'Penectomy',
      definition: 'Surgical removal of all or part of the penis, typically performed for penile cancer or severe trauma.',
    },
    smcK: {
      term: 'SMC-K (Loss of Creative Organ)',
      definition: 'Special Monthly Compensation paid in addition to regular compensation for anatomical loss or loss of use of a creative organ (penis or testes).',
    },
  },

  secondaryConditions: {
    description: 'Penis removal may result in or be associated with other conditions.',
    commonSecondaries: [
      { condition: 'Erectile Dysfunction', diagnosticCode: '7522', relationship: 'Direct result of anatomical loss' },
      { condition: 'Depression/Adjustment Disorder', diagnosticCode: '9440', relationship: 'Psychological impact of loss' },
      { condition: 'Urinary Dysfunction', diagnosticCode: '7512-7518', relationship: 'May affect urinary function' },
    ],
  },

  documentationTips: [
    'Obtain complete surgical/operative reports',
    'Document the cause of loss (cancer, trauma, infection, etc.)',
    'Get urology evaluation documenting extent of loss',
    'Apply for SMC-K for loss of creative organ',
    'Document any secondary psychological impact',
    'Note any urinary dysfunction if present',
  ],

  disclaimer: 'Penis removal conditions are rated based on extent of tissue loss per 38 CFR 4.115b. All cases require review for Special Monthly Compensation (SMC-K) for loss of creative organ. For documentation purposes only - the VA makes all final rating determinations.',
};


// =================================================================
// TESTIS CONDITIONS (DC 7523-7524)
// =================================================================
export const TESTIS_CONDITIONS_CRITERIA = {
  diagnosticCode: '7523-7524',
  condition: 'Testis Atrophy/Removal Conditions',
  cfrReference: '38 CFR 4.115b, Diagnostic Codes 7523-7524',

  smcNote: 'All testis loss conditions require review for Special Monthly Compensation (SMC) under § 3.350 for loss of creative organ.',

  importantNote: 'Undescended or congenitally undeveloped testis is NOT a ratable disability. Only service-connected loss qualifies.',

  ratings: [
    {
      percent: 30,
      diagnosticCode: '7524',
      summary: 'Testis, removal - Both',
      criteria: {
        removalBoth: true,
      },
      criteriaDescription: [
        'Surgical removal of both testes (bilateral orchiectomy)',
        'Service-connected cause required',
        'Requires SMC review for loss of creative organ',
      ],
      evidenceNeeded: [
        'Surgical/operative reports for bilateral orchiectomy',
        'Documentation of service-connected cause',
        'Urology or oncology records',
        'SMC application for loss of creative organ',
        'Hormone replacement therapy records if applicable',
      ],
    },
    {
      percent: 30,
      diagnosticCode: '7524-special',
      summary: 'Testis, removal - One (with other testis absent/nonfunctioning)',
      criteria: {
        removalOneSpecial: true,
      },
      criteriaDescription: [
        'Service-connected removal of ONE testis',
        'AND other testis absent or nonfunctioning (unrelated to service)',
        'Results in complete loss of testicular function',
        'Special provision per DC 7524 Note',
      ],
      evidenceNeeded: [
        'Surgical report for service-connected testis removal',
        'Medical documentation of other testis status',
        'Evidence other testis condition is unrelated to service',
        'SMC application',
      ],
    },
    {
      percent: 20,
      diagnosticCode: '7523',
      summary: 'Testis, atrophy complete - Both',
      criteria: {
        atrophyBoth: true,
      },
      criteriaDescription: [
        'Complete atrophy of both testes',
        'Documented loss of testicular function',
        'Service-connected cause required',
      ],
      evidenceNeeded: [
        'Urology evaluation documenting bilateral atrophy',
        'Hormone level testing (testosterone, FSH, LH)',
        'Documentation of cause (trauma, infection, etc.)',
        'SMC application for loss of creative organ',
      ],
    },
    {
      percent: 0,
      diagnosticCode: '7524',
      summary: 'Testis, removal - One (other testis normal)',
      criteria: {
        removalOne: true,
      },
      criteriaDescription: [
        'Surgical removal of one testis (unilateral orchiectomy)',
        'Other testis remains functional',
        'Still qualifies for SMC-K review',
      ],
      evidenceNeeded: [
        'Surgical report for unilateral orchiectomy',
        'Documentation of service-connected cause',
        'SMC application for loss of creative organ',
      ],
    },
    {
      percent: 0,
      diagnosticCode: '7523',
      summary: 'Testis, atrophy complete - One',
      criteria: {
        atrophyOne: true,
      },
      criteriaDescription: [
        'Complete atrophy of one testis',
        'Other testis remains functional',
        'Still qualifies for SMC-K review',
      ],
      evidenceNeeded: [
        'Urology evaluation documenting unilateral atrophy',
        'Documentation of cause',
        'SMC application',
      ],
    },
  ],

  definitions: {
    orchiectomy: {
      term: 'Orchiectomy',
      definition: 'Surgical removal of one or both testicles. May be performed for testicular cancer, severe trauma, or other conditions.',
    },
    testisAtrophy: {
      term: 'Testicular Atrophy',
      definition: 'Shrinkage and loss of function of testicular tissue. Can result from trauma, infection, torsion, or other causes.',
    },
    smcK: {
      term: 'SMC-K (Loss of Creative Organ)',
      definition: 'Special Monthly Compensation paid in addition to regular compensation for anatomical loss or loss of use of a creative organ.',
    },
    bilateralOrchiectomy: {
      term: 'Bilateral Orchiectomy',
      definition: 'Removal of both testicles, resulting in surgical castration and requiring hormone replacement therapy.',
    },
  },

  secondaryConditions: {
    description: 'Testicular loss may result in or require treatment for associated conditions.',
    commonSecondaries: [
      { condition: 'Hypogonadism', diagnosticCode: '7903', relationship: 'Hormone deficiency from testicular loss' },
      { condition: 'Erectile Dysfunction', diagnosticCode: '7522', relationship: 'May result from hormone changes' },
      { condition: 'Depression/Adjustment Disorder', diagnosticCode: '9440', relationship: 'Psychological impact' },
      { condition: 'Osteoporosis', diagnosticCode: '5013', relationship: 'Long-term effect of testosterone deficiency' },
    ],
  },

  documentationTips: [
    'Obtain complete surgical/operative reports',
    'Document service-connected cause (cancer, trauma, infection)',
    'Get hormone level testing (testosterone, FSH, LH)',
    'Apply for SMC-K for loss of creative organ',
    'Document hormone replacement therapy if prescribed',
    'Note any secondary psychological impact',
    'Track bone density if long-term testosterone deficiency',
  ],

  disclaimer: 'Testis conditions are rated based on 38 CFR 4.115b. Undescended or congenitally undeveloped testis is NOT ratable. All cases require review for SMC-K. For documentation purposes only - the VA makes all final rating determinations.',
};

// =================================================================
// TESTIS CONDITIONS (DC 7523-7524)
// =================================================================

export const ENDOMETRIOSIS_CRITERIA = {
  diagnosticCode: '7629',
  condition: 'Endometriosis',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7629',

  note: 'Diagnosis must be substantiated by laparoscopy. Ratings based on symptom severity and organ involvement.',

  ratings: [
    {
      percent: 50,
      summary: 'Lesions involving bowel or bladder with uncontrolled symptoms',
      criteriaDescription: [
        'Lesions involving bowel or bladder confirmed by laparoscopy',
        'Pelvic pain or heavy or irregular bleeding not controlled by treatment',
        'Bowel or bladder symptoms present',
      ],
      evidenceNeeded: [
        'Laparoscopy report confirming endometriosis',
        'Documentation of bowel involvement (e.g., painful bowel movements, rectal bleeding)',
        'Documentation of bladder involvement (e.g., painful urination, hematuria)',
        'Treatment records showing ongoing symptoms despite treatment',
        'Gynecology records documenting symptom severity',
        'Evidence that symptoms are not controlled by hormonal therapy, surgery, or pain management',
      ],
    },
    {
      percent: 30,
      summary: 'Pelvic pain or heavy/irregular bleeding not controlled by treatment',
      criteriaDescription: [
        'Pelvic pain or heavy or irregular bleeding',
        'Symptoms not controlled by treatment',
        'May or may not involve bowel/bladder',
      ],
      evidenceNeeded: [
        'Laparoscopy report confirming endometriosis',
        'Documentation of chronic pelvic pain',
        'Documentation of menorrhagia (heavy bleeding) or irregular bleeding',
        'Treatment records showing persistent symptoms',
        'Gynecology records documenting failed treatment attempts',
        'Pain severity documentation (pain scales, interference with daily activities)',
      ],
    },
    {
      percent: 10,
      summary: 'Pelvic pain or heavy/irregular bleeding requiring continuous treatment',
      criteriaDescription: [
        'Pelvic pain or heavy or irregular bleeding',
        'Symptoms require continuous treatment for control',
        'Symptoms are controlled with treatment',
      ],
      evidenceNeeded: [
        'Laparoscopy report confirming endometriosis',
        'Documentation of ongoing treatment (hormonal therapy, pain medication)',
        'Records showing symptoms are controlled with treatment',
        'Prescription records for continuous medications',
        'Gynecology follow-up records',
      ],
    },
  ],

  definitions: {
    'Endometriosis': 'Condition where tissue similar to uterine lining grows outside the uterus, causing pain and bleeding',
    'Laparoscopy': 'Surgical procedure using a camera to visualize inside the abdomen - required for VA diagnosis',
    'Menorrhagia': 'Abnormally heavy or prolonged menstrual bleeding',
    'Dysmenorrhea': 'Painful menstruation',
    'Dyspareunia': 'Painful sexual intercourse',
    'Pelvic adhesions': 'Scar tissue that can form from endometriosis, causing organs to stick together',
  },

  disclaimer: 'Endometriosis must be confirmed by laparoscopy for VA purposes. Ratings are based on symptom control, not extent of disease. Even extensive endometriosis may rate lower if well-controlled by treatment. Bowel/bladder involvement is key for 50% rating. Document all symptoms including pain severity, bleeding patterns, and interference with daily activities.',
};

export const FEMALE_REPRODUCTIVE_ORGANS_CRITERIA = {
  diagnosticCode: '7610-7615',
  condition: 'Disease, Injury, or Adhesions of Female Reproductive Organs',
  cfrReference: '38 CFR 4.116, General Rating Formula for DC 7610-7615',

  note: 'Applies to vulva/clitoris (7610), vagina (7611), cervix (7612), uterus (7613), fallopian tube/PID (7614), and ovary (7615). Ovarian dysfunction affecting menstrual cycle (dysmenorrhea, amenorrhea) rated under DC 7615.',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of persistent symptoms despite treatment',
        'Treatment records showing failed or inadequate symptom control',
        'Gynecology records documenting severity',
        'Evidence of functional impairment',
        'For DC 7615: menstrual cycle documentation showing dysfunction',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
        'Discontinuation of treatment results in symptom recurrence',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment (medications, therapy)',
        'Records showing symptoms are controlled with treatment',
        'Prescription records for ongoing medications',
        'Gynecology follow-up records',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
        'Symptoms resolve without ongoing intervention',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation that symptoms are mild',
        'Records showing no continuous treatment required',
      ],
    },
  ],

  definitions: {
    'Dysmenorrhea': 'Painful menstruation',
    'Amenorrhea': 'Absence of menstruation',
    'PID': 'Pelvic Inflammatory Disease - infection of female reproductive organs',
    'Adhesions': 'Scar tissue causing organs to stick together',
    'Ovarian dysfunction': 'Abnormal ovarian function affecting menstrual cycle',
    'Continuous treatment': 'Ongoing medical treatment required to control symptoms',
  },

  disclaimer: 'This general rating formula applies to multiple diagnostic codes (7610-7615). The key distinction is whether symptoms require continuous treatment and whether that treatment effectively controls symptoms. For ovarian disease (DC 7615), includes conditions like PCOS, ovarian cysts, and dysmenorrhea affecting the menstrual cycle.',
};

export const PELVIC_PROLAPSE_CRITERIA = {
  diagnosticCode: '7621',
  condition: 'Complete or Incomplete Pelvic Organ Prolapse',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7621',

  note: 'Includes uterine/vaginal vault prolapse, cystocele, urethrocele, rectocele, enterocele, or any combination. Rated at flat 10%.',

  ratings: [
    {
      percent: 10,
      summary: 'Pelvic organ prolapse due to injury, disease, or surgical complications',
      criteriaDescription: [
        'Complete or incomplete pelvic organ prolapse',
        'Diagnosed by examination (POP-Q staging)',
        'May include: uterine prolapse, vaginal vault prolapse, cystocele, urethrocele, rectocele, enterocele',
        'Can be any combination of above',
      ],
      evidenceNeeded: [
        'Gynecology or urogynecology examination',
        'POP-Q staging documentation',
        'Description of type of prolapse (cystocele, rectocele, etc.)',
        'Symptom documentation (pelvic pressure, bulge, urinary/bowel symptoms)',
        'Treatment records (pessary use, pelvic floor PT, surgical repair)',
        'Evidence linking to service (injury during service, surgical complications, etc.)',
      ],
    },
  ],

  definitions: {
    'Pelvic organ prolapse': 'Dropping of pelvic organs (bladder, uterus, rectum, etc.) from normal position',
    'POP-Q': 'Pelvic Organ Prolapse Quantification - standardized staging system (0-IV)',
    'Cystocele': 'Prolapse of bladder into vagina',
    'Rectocele': 'Prolapse of rectum into vagina',
    'Uterine prolapse': 'Dropping of uterus into or through vagina',
    'Vaginal vault prolapse': 'Prolapse after hysterectomy where top of vagina descends',
    'Enterocele': 'Small bowel prolapse into vagina',
    'Urethrocele': 'Prolapse of urethra',
    'Pessary': 'Device inserted into vagina to support prolapsed organs',
  },

  disclaimer: 'Pelvic organ prolapse is rated at a flat 10% regardless of severity or type. Multiple types of prolapse (e.g., both cystocele and rectocele) are still rated as a single 10% disability. However, secondary conditions resulting from prolapse (such as urinary incontinence or bowel dysfunction) may be separately ratable under different diagnostic codes.',
};

export const FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA = {
  diagnosticCode: '7632',
  condition: 'Female Sexual Arousal Disorder (FSAD)',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7632',

  note: 'Rated at 0% only. No compensation for impairment itself, but establishes service connection for potential special monthly compensation (SMC) review under § 3.350.',

  ratings: [
    {
      percent: 0,
      summary: 'Female sexual arousal disorder present',
      criteriaDescription: [
        'Documented female sexual arousal disorder',
        'May involve difficulty with arousal, lubrication, or orgasm',
        'Affects sexual function',
      ],
      evidenceNeeded: [
        'Medical diagnosis of FSAD or sexual dysfunction',
        'Gynecology or sexual health specialist evaluation',
        'Documentation of symptoms and impact',
        'Treatment attempts if any',
        'Evidence linking to service-connected condition (PTSD, medications, injury, etc.)',
      ],
    },
  ],

  definitions: {
    'FSAD': 'Female Sexual Arousal Disorder - persistent difficulty with sexual arousal or response',
    'SMC': 'Special Monthly Compensation - additional compensation for certain severe disabilities',
    'Sexual dysfunction': 'Impairment in sexual response or function',
  },

  disclaimer: 'While rated at 0%, service connection for FSAD is important for: (1) review for SMC entitlement under § 3.350, (2) establishing nexus to other service-connected conditions, (3) potential for increased rating if additional related conditions develop. FSAD may be secondary to PTSD, depression, medications, pelvic trauma, or other service-connected conditions.',
};

// =================================================================
// IRON DEFICIENCY ANEMIA (DC 7720)
// =================================================================

export const CHRONIC_CYSTITIS_CRITERIA = {
  diagnosticCode: '7512',
  condition: 'Chronic Cystitis (Bladder Infection/Inflammation)',
  cfrReference: '38 CFR 4.115a, Diagnostic Code 7512',

  note: 'Chronic cystitis is rated as voiding dysfunction. Rate under the highest applicable category: urinary frequency, incontinence, or recurrent UTIs.',

  ratings: [
    {
      percent: 60,
      summary: 'Requiring appliance or absorbent materials changed more than 4 times per day',
      criteriaDescription: [
        'Severe urinary incontinence from cystitis',
        'Requires protective garments changed >4 times daily',
        'May require urinary appliance',
      ],
      evidenceNeeded: [
        'Diagnosis of chronic cystitis',
        'Documentation of incontinence frequency',
        'Prescription for incontinence supplies',
        'Urinalysis and urine cultures',
      ],
    },
    {
      percent: 40,
      summary: 'Daytime voiding interval less than 1 hour, OR absorbent materials 2-4 times/day',
      criteriaDescription: [
        'Severe urinary frequency (voiding more than hourly), OR',
        'Moderate incontinence (2-4 pad changes daily), OR',
        'Awakening 5+ times per night to void',
      ],
      evidenceNeeded: [
        'Voiding diary showing frequency patterns',
        'Documentation of recurrent infections',
        'Treatment records',
      ],
    },
    {
      percent: 20,
      summary: 'Daytime voiding interval 1-2 hours, OR absorbent materials <2 times/day',
      criteriaDescription: [
        'Moderate urinary frequency (every 1-2 hours), OR',
        'Mild incontinence (1-2 pad changes daily), OR',
        'Awakening 3-4 times per night to void',
      ],
      evidenceNeeded: [
        'Documentation of symptoms',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Daytime voiding interval 2-3 hours, OR awakening 2 times per night',
      criteriaDescription: [
        'Mild urinary frequency (every 2-3 hours), OR',
        'Awakening twice nightly',
      ],
      evidenceNeeded: [
        'Documentation of voiding patterns',
      ],
    },
  ],

  definitions: {
    cystitis: {
      term: 'Cystitis',
      definition: 'Inflammation of the bladder, usually caused by bacterial infection (UTI).',
    },
    interstitialCystitis: {
      term: 'Interstitial Cystitis',
      definition: 'Chronic bladder condition causing bladder pressure, pain, and urinary urgency without infection.',
    },
  },

  disclaimer: 'Rate as voiding dysfunction under the highest applicable category. Recurrent UTIs should be documented with culture results.',
};

// ============================================
// NEUROGENIC BLADDER CRITERIA (DC 7542)
// Uses Voiding Dysfunction Rating Formula
// ============================================

export const NEUROGENIC_BLADDER_CRITERIA = {
  diagnosticCode: '7542',
  condition: 'Neurogenic Bladder',
  cfrReference: '38 CFR 4.115a, Diagnostic Code 7542',

  note: 'Neurogenic bladder is rated as voiding dysfunction. Rate under the highest applicable category: incontinence, frequency, or obstruction/retention.',

  ratings: [
    {
      percent: 60,
      summary: 'Requiring appliance or absorbent materials changed more than 4 times per day',
      criteriaDescription: [
        'Severe urinary incontinence',
        'Requires protective garments changed >4 times daily',
        'May require urinary appliance or collection device',
      ],
      evidenceNeeded: [
        'Diagnosis of neurogenic bladder',
        'Urodynamic studies',
        'Documentation of incontinence frequency',
        'Neurological evaluation',
      ],
    },
    {
      percent: 40,
      summary: 'Daytime voiding <1 hour OR absorbent materials 2-4 times/day',
      criteriaDescription: [
        'Severe urinary frequency, OR',
        'Moderate incontinence (2-4 pad changes daily), OR',
        'Awakening 5+ times per night',
      ],
      evidenceNeeded: [
        'Voiding diary',
        'Urodynamic studies',
        'Treatment records',
      ],
    },
    {
      percent: 30,
      summary: 'Urinary retention requiring catheterization',
      criteriaDescription: [
        'Unable to empty bladder naturally',
        'Requires intermittent self-catheterization, OR',
        'Indwelling catheter (Foley or suprapubic)',
      ],
      evidenceNeeded: [
        'Catheterization records',
        'Post-void residual measurements',
        'Urology records',
      ],
    },
    {
      percent: 20,
      summary: 'Daytime voiding interval 1-2 hours, OR absorbent materials <2 times/day',
      criteriaDescription: [
        'Moderate urinary frequency, OR',
        'Mild incontinence, OR',
        'Awakening 3-4 times per night',
      ],
      evidenceNeeded: [
        'Documentation of symptoms',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Daytime voiding interval 2-3 hours, OR marked obstructive symptoms',
      criteriaDescription: [
        'Mild urinary frequency, OR',
        'Awakening twice nightly, OR',
        'Marked obstructive voiding symptoms with complications',
      ],
      evidenceNeeded: [
        'Documentation of voiding patterns',
        'Uroflowmetry if applicable',
      ],
    },
  ],

  definitions: {
    neurogenicBladder: {
      term: 'Neurogenic Bladder',
      definition: 'Bladder dysfunction caused by nerve damage from conditions like spinal cord injury, MS, diabetes, or TBI.',
    },
    detrusorOveractivity: {
      term: 'Detrusor Overactivity',
      definition: 'Involuntary bladder muscle contractions causing urgency and incontinence.',
    },
    detrusorUnderactivity: {
      term: 'Detrusor Underactivity',
      definition: 'Weak bladder muscle contractions causing incomplete emptying and retention.',
    },
  },

  disclaimer: 'Rate as voiding dysfunction. Document underlying neurological condition. Urodynamic studies are key evidence.',
};

// ============================================
// PROSTATE CONDITIONS CRITERIA (DC 7527)
// Uses Voiding Dysfunction Rating Formula
// ============================================

export const PROSTATE_CONDITIONS_CRITERIA = {
  diagnosticCode: '7527',
  condition: 'Prostate Conditions (BPH, Prostatitis)',
  cfrReference: '38 CFR 4.115b, Diagnostic Code 7527',

  note: 'Prostate gland injuries, infections, and hypertrophy are rated as voiding dysfunction OR UTI, whichever is predominant.',

  ratings: [
    {
      percent: 60,
      summary: 'Severe incontinence requiring appliance/absorbent materials >4 times/day',
      criteriaDescription: [
        'Severe urinary incontinence from prostate condition',
        'Requires protective garments changed >4 times daily',
      ],
      evidenceNeeded: [
        'Diagnosis of prostate condition (BPH, prostatitis)',
        'Documentation of incontinence frequency',
        'Urology records',
        'PSA levels if applicable',
      ],
    },
    {
      percent: 40,
      summary: 'Daytime voiding <1 hour OR absorbent materials 2-4 times/day OR 5+ nocturia',
      criteriaDescription: [
        'Severe urinary frequency (voiding more than hourly), OR',
        'Moderate incontinence, OR',
        'Severe nocturia (5+ times per night)',
      ],
      evidenceNeeded: [
        'Voiding diary',
        'Uroflowmetry',
        'Post-void residual measurements',
      ],
    },
    {
      percent: 30,
      summary: 'Urinary retention requiring catheterization',
      criteriaDescription: [
        'Urinary retention from prostatic obstruction',
        'Requires intermittent or continuous catheterization',
      ],
      evidenceNeeded: [
        'Catheterization records',
        'Post-void residual >150cc',
        'Urology evaluation',
      ],
    },
    {
      percent: 20,
      summary: 'Daytime voiding 1-2 hours OR absorbent materials <2 times/day OR 3-4 nocturia',
      criteriaDescription: [
        'Moderate urinary frequency, OR',
        'Mild incontinence, OR',
        'Moderate nocturia (3-4 times nightly)',
      ],
      evidenceNeeded: [
        'Documentation of symptoms',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: 'Daytime voiding 2-3 hours OR 2 nocturia OR marked obstructive symptoms',
      criteriaDescription: [
        'Mild frequency or nocturia, OR',
        'Marked obstructive voiding symptoms (hesitancy, weak stream)',
      ],
      evidenceNeeded: [
        'Documentation of voiding patterns',
        'Uroflowmetry showing decreased flow',
      ],
    },
  ],

  definitions: {
    BPH: {
      term: 'Benign Prostatic Hyperplasia (BPH)',
      definition: 'Non-cancerous enlargement of the prostate causing urinary symptoms.',
    },
    prostatitis: {
      term: 'Prostatitis',
      definition: 'Inflammation of the prostate, can be acute (bacterial) or chronic.',
    },
    LUTS: {
      term: 'Lower Urinary Tract Symptoms (LUTS)',
      definition: 'Collective term for urinary symptoms including frequency, urgency, weak stream, and nocturia.',
    },
  },

  disclaimer: 'Rate as voiding dysfunction (frequency, incontinence, or obstruction). Post-prostatectomy residuals use same criteria.',
};

// ============================================
// URETHRAL STRICTURE CRITERIA (DC 7518)
// Uses Voiding Dysfunction Rating Formula
// ============================================

export const URETHRAL_STRICTURE_CRITERIA = {
  diagnosticCode: '7518',
  condition: 'Urethral Stricture',
  cfrReference: '38 CFR 4.115b, Diagnostic Code 7518',

  note: 'Urethral stricture is rated as voiding dysfunction, specifically under obstructed voiding criteria.',

  ratings: [
    {
      percent: 30,
      summary: 'Urinary retention requiring intermittent or continuous catheterization',
      criteriaDescription: [
        'Severe stricture causing retention',
        'Requires self-catheterization or indwelling catheter',
      ],
      evidenceNeeded: [
        'Diagnosis of urethral stricture',
        'Catheterization records',
        'Cystoscopy or imaging confirming stricture',
        'Post-void residual measurements',
      ],
    },
    {
      percent: 10,
      summary: 'Marked obstructive symptoms with post-void residual >150cc or frequent dilations',
      criteriaDescription: [
        'Hesitancy, weak stream, incomplete emptying, AND',
        'Post-void residual >150cc, OR',
        'Markedly decreased flow rate (<10cc/sec), OR',
        'Recurrent UTIs from obstruction, OR',
        'Stricture requiring dilation every 2-3 months',
      ],
      evidenceNeeded: [
        'Uroflowmetry results',
        'Post-void residual measurements',
        'Dilation procedure records',
        'UTI treatment records',
      ],
    },
    {
      percent: 0,
      summary: 'Obstructive symptoms requiring dilation 1-2 times per year',
      criteriaDescription: [
        'Mild stricture',
        'Occasional dilation needed (1-2 times yearly)',
      ],
      evidenceNeeded: [
        'Dilation procedure records',
      ],
    },
  ],

  definitions: {
    urethralStricture: {
      term: 'Urethral Stricture',
      definition: 'Narrowing of the urethra from scar tissue, causing obstructed urination.',
    },
    dilation: {
      term: 'Urethral Dilation',
      definition: 'Procedure to widen a narrowed urethra using progressively larger instruments.',
    },
  },

  disclaimer: 'Rate under obstructed voiding criteria. Document dilation frequency and post-void residuals.',
};

// ============================================
// MANDIBLE MALUNION CRITERIA (DC 9904)
// ============================================

export const analyzeKidneyStonesLogs = (logs) => {
  const stoneLogs = logs.filter(log =>
      log.genitourinaryData?.affectedSystem === 'kidney' ||
      log.symptomId?.includes('kidney-stone') ||
      log.symptomId?.includes('kidney-pain')
  );

  if (stoneLogs.length === 0) {
    return {
      hasData: false,
      message: 'No kidney stone symptoms logged'
    };
  }

  // Count procedures
  const procedureCounts = {};
  const stoneEpisodes = stoneLogs.filter(log => log.genitourinaryData?.stoneEpisode).length;
  const stonesPassed = stoneLogs.filter(log => log.genitourinaryData?.stonePassedToday).length;

  stoneLogs.forEach(log => {
    const procedure = log.genitourinaryData?.procedureRecent;
    if (procedure && procedure !== '' && procedure !== 'none') {
      procedureCounts[procedure] = (procedureCounts[procedure] || 0) + 1;
    }
  });

  // Calculate procedures in last year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const proceduresLastYear = stoneLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const procedure = log.genitourinaryData?.procedureRecent;
    return logDate >= oneYearAgo && procedure && procedure !== '' && procedure !== 'none';
  }).length;

  // Determine rating
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (proceduresLastYear > 2) {
    supportedRating = 30;
    rationale.push(`${proceduresLastYear} procedures documented in past year (>2 required for 30%)`);
  } else if (proceduresLastYear >= 1) {
    supportedRating = 10;
    rationale.push(`${proceduresLastYear} procedure(s) in past year (1-2 required for 10%)`);
  } else {
    supportedRating = 0;
    rationale.push('No procedures documented in past year');
    evidenceGaps.push('Document any lithotripsy, ureteroscopy, or stent procedures');
  }

  if (stoneEpisodes > 0) {
    rationale.push(`${stoneEpisodes} stone episodes logged`);
  }

  if (stonesPassed > 0) {
    rationale.push(`${stonesPassed} stones documented as passed`);
  }

  // Evidence gaps
  if (!Object.keys(procedureCounts).length) {
    evidenceGaps.push('No procedure records logged - document all stone-related procedures');
  }

  evidenceGaps.push('Obtain imaging reports (CT scans, ultrasounds) showing stone formation');
  evidenceGaps.push('Get urology treatment records documenting recurrent stones');

  return {
    condition: 'Kidney Stones (Nephrolithiasis)',
    diagnosticCode: '7508',

    hasData: true,
    totalLogs: stoneLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      stoneEpisodes,
      stonesPassed,
      proceduresLastYear,
      procedureTypes: Object.keys(procedureCounts),
    },
    criteriaReference: KIDNEY_STONES_CRITERIA,
  };
};

// Analyze Chronic Renal Disease logs (DC 7530)

export const analyzeChronicRenalDiseaseLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options; // 1 year default for kidney function

  const renalLogs = logs.filter(log =>
      log.genitourinaryData?.affectedSystem === 'kidney' ||
      log.symptomId?.includes('renal') ||
      log.symptomId?.includes('kidney')
  );

  // Get eGFR measurements from storage
  const egfrMeasurements = getMeasurements({
    type: 'egfr',
    days: evaluationPeriodDays
  });

  const creatinineMeasurements = getMeasurements({
    type: 'creatinine',
    days: evaluationPeriodDays
  });

  if (renalLogs.length === 0 && egfrMeasurements.length === 0) {
    return {
      hasData: false,
      message: 'No chronic kidney disease symptoms or lab values logged'
    };
  }

  // Count dialysis
  const dialysisLogs = renalLogs.filter(log => log.genitourinaryData?.dialysis);
  const onDialysis = dialysisLogs.length > 0;

  // Analyze eGFR values
  let lowestEGFR = null;
  let averageEGFR = null;

  if (egfrMeasurements.length > 0) {
    const egfrValues = egfrMeasurements.map(m => m.values.egfr);
    lowestEGFR = Math.min(...egfrValues);
    averageEGFR = (egfrValues.reduce((a, b) => a + b, 0) / egfrValues.length).toFixed(1);
  }

  // Determine rating based on eGFR
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (onDialysis) {
    supportedRating = 100;
    rationale.push(`Regular dialysis documented (${dialysisLogs.length} dialysis sessions logged)`);
  } else if (lowestEGFR !== null) {
    if (lowestEGFR >= 15 && lowestEGFR <= 20) {
      supportedRating = 80;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (15-20 range = 80%)`);
    } else if (lowestEGFR >= 20 && lowestEGFR < 30) {
      supportedRating = 60;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (20-30 range = 60%)`);
    } else if (lowestEGFR >= 30 && lowestEGFR < 40) {
      supportedRating = 40;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (30-40 range = 40%)`);
    } else if (lowestEGFR >= 40 && lowestEGFR < 60) {
      supportedRating = 20;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (40-60 range = 20%)`);
    } else if (lowestEGFR >= 60) {
      supportedRating = 0;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (>60 = minimal impairment)`);
    } else {
      supportedRating = 100;
      rationale.push(`Lowest eGFR: ${lowestEGFR} mL/min/1.73m² (<15 = kidney failure)`);
    }

    if (averageEGFR) {
      rationale.push(`Average eGFR: ${averageEGFR} mL/min/1.73m² (${egfrMeasurements.length} measurements)`);
    }
  }

  // Evidence gaps
  if (egfrMeasurements.length < 3) {
    evidenceGaps.push('Track more eGFR measurements - ratings require sustained kidney function decline');
  }

  if (creatinineMeasurements.length === 0) {
    evidenceGaps.push('Log serum creatinine values from lab reports');
  }

  evidenceGaps.push('Obtain nephrology consultation records');
  evidenceGaps.push('Document any complications (anemia, bone disease, metabolic issues)');

  return {
    condition: 'Chronic Kidney Disease',
    diagnosticCode: '7530',

    hasData: true,
    totalLogs: renalLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      egfrMeasurements: egfrMeasurements.length,
      lowestEGFR,
      averageEGFR,
      onDialysis,
      dialysisSessions: dialysisLogs.length,
    },
    criteriaReference: CHRONIC_RENAL_DISEASE_CRITERIA,
  };
};

// Analyze Voiding Dysfunction logs (DC 7512, 7527, 7542, 7518)

export const analyzeVoidingDysfunctionLogs = (logs) => {
  const voidingLogs = logs.filter(log =>
      log.genitourinaryData?.affectedSystem === 'bladder' ||
      log.genitourinaryData?.affectedSystem === 'prostate' ||
      log.symptomId?.includes('urinary') ||
      log.symptomId?.includes('bladder') ||
      log.symptomId?.includes('prostate')
  );

  if (voidingLogs.length === 0) {
    return {
      hasData: false,
      message: 'No voiding dysfunction symptoms logged'
    };
  }

  // Analyze incontinence
  const incontinenceLogs = voidingLogs.filter(log => log.genitourinaryData?.incontinenceEpisode);
  const padChangeCounts = voidingLogs
  .map(log => parseInt(log.genitourinaryData?.padChangesRequired) || 0)
  .filter(count => count > 0);
  const avgPadChanges = padChangeCounts.length > 0
      ? (padChangeCounts.reduce((a, b) => a + b, 0) / padChangeCounts.length).toFixed(1)
      : 0;
  const maxPadChanges = padChangeCounts.length > 0 ? Math.max(...padChangeCounts) : 0;

  // Analyze frequency
  const frequencyCounts = voidingLogs
  .map(log => parseInt(log.genitourinaryData?.urinaryFrequency24h) || 0)
  .filter(count => count > 0);
  const avgFrequency = frequencyCounts.length > 0
      ? (frequencyCounts.reduce((a, b) => a + b, 0) / frequencyCounts.length).toFixed(1)
      : 0;

  const nocturnalCounts = voidingLogs
  .map(log => parseInt(log.genitourinaryData?.nocturiaCount) || 0)
  .filter(count => count > 0);
  const avgNocturia = nocturnalCounts.length > 0
      ? (nocturnalCounts.reduce((a, b) => a + b, 0) / nocturnalCounts.length).toFixed(1)
      : 0;
  const maxNocturia = nocturnalCounts.length > 0 ? Math.max(...nocturnalCounts) : 0;

  // Analyze obstruction
  const catheterLogs = voidingLogs.filter(log => log.genitourinaryData?.catheterUse);
  const catheterType = catheterLogs.length > 0 ? catheterLogs[catheterLogs.length - 1].genitourinaryData?.catheterType : null;

  // Determine rating (highest of incontinence, frequency, or obstruction)
  let incontinenceRating = 0;
  let frequencyRating = 0;
  let obstructionRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // Incontinence rating
  if (maxPadChanges > 4 || avgPadChanges > 4) {
    incontinenceRating = 60;
    rationale.push(`Incontinence: ${avgPadChanges} avg pad changes/day (>4 = 60%)`);
  } else if (maxPadChanges >= 2 || avgPadChanges >= 2) {
    incontinenceRating = 40;
    rationale.push(`Incontinence: ${avgPadChanges} avg pad changes/day (2-4 = 40%)`);
  } else if (incontinenceLogs.length > 0) {
    incontinenceRating = 20;
    rationale.push(`Incontinence: ${avgPadChanges || '<2'} pad changes/day (<2 = 20%)`);
  }

  // Frequency rating
  const hourlyInterval = avgFrequency > 0 ? (24 / avgFrequency).toFixed(1) : 'N/A';
  if (avgFrequency >= 24 || maxNocturia >= 5) {
    frequencyRating = 40;
    rationale.push(`Frequency: ${avgFrequency} times/day (~every ${hourlyInterval}h), or ${maxNocturia} times/night = 40%`);
  } else if ((avgFrequency >= 12 && avgFrequency < 24) || maxNocturia >= 3) {
    frequencyRating = 20;
    rationale.push(`Frequency: ${avgFrequency} times/day, ${avgNocturia} avg nocturia = 20%`);
  } else if ((avgFrequency >= 8 && avgFrequency < 12) || maxNocturia >= 2) {
    frequencyRating = 10;
    rationale.push(`Frequency: ${avgFrequency} times/day, ${avgNocturia} avg nocturia = 10%`);
  }

  // Obstruction rating
  if (catheterLogs.length > 0) {
    obstructionRating = 30;
    rationale.push(`Obstruction: Catheterization required (${catheterType || 'type not specified'}) = 30%`);
  }

  const supportedRating = Math.max(incontinenceRating, frequencyRating, obstructionRating);

  // Evidence gaps
  if (!avgFrequency) {
    evidenceGaps.push('Log urinary frequency (times per day) consistently');
  }
  if (!avgNocturia) {
    evidenceGaps.push('Track nocturia (nighttime awakenings to void)');
  }
  if (incontinenceLogs.length > 0 && !avgPadChanges) {
    evidenceGaps.push('Document pad/diaper changes per day');
  }

  evidenceGaps.push('Obtain voiding diary from healthcare provider');
  evidenceGaps.push('Get post-void residual measurements if available');
  evidenceGaps.push('Document any urodynamic testing results');

  return {
    condition: 'Voiding Dysfunction',
    diagnosticCode: '7542',

    hasData: true,
    totalLogs: voidingLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      incontinenceEpisodes: incontinenceLogs.length,
      avgPadChanges,
      maxPadChanges,
      avgFrequency,
      avgNocturia,
      maxNocturia,
      catheterUse: catheterLogs.length,
      catheterType,
    },
    criteriaReference: VOIDING_DYSFUNCTION_CRITERIA,
  };
};

// Analyze Sphincter Impairment logs (DC 7332)

export const analyzeErectileDysfunctionLogs = (logs) => {
  const edLogs = logs.filter(log =>
      log.genitourinaryData?.affectedSystem === 'reproductive' ||
      log.symptomId?.includes('erectile-dysfunction')
  );

  if (edLogs.length === 0) {
    return {
      hasData: false,
      message: 'No erectile dysfunction symptoms logged'
    };
  }

  const severityCounts = {};
  edLogs.forEach(log => {
    const severity = log.genitourinaryData?.edSeverity;
    if (severity) {
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
    }
  });

  const mostCommonSeverity = Object.keys(severityCounts).reduce((a, b) =>
      severityCounts[a] > severityCounts[b] ? a : b, null
  );

  return {
    condition: 'Erectile Dysfunction',
    diagnosticCode: '7522',
    hasData: true,
    totalLogs: edLogs.length,
    supportedRating: 0,
    ratingRationale: [
      'DC 7522 is rated at 0% only',
      `Severity documented: ${mostCommonSeverity || 'not specified'}`,
      'Service connection establishes potential for SMC in specific circumstances',
    ],
    gaps: [
      'Obtain urology evaluation documenting ED',
      'Document any secondary conditions (diabetes, PTSD, medications)',
      'Get treatment records (medications, devices, procedures attempted)',
    ],
    metrics: {
      mostCommonSeverity,
      severityCounts,
    },
    criteriaReference: ERECTILE_DYSFUNCTION_CRITERIA,
    // SMC Eligibility Data - requires nexus to service-connected condition
    smcEligible: true,
    smcData: {
      level: 'K',
      category: 'CREATIVE_ORGAN',
      autoGrant: false,
      note: 'ED may qualify for SMC-K when secondary to a service-connected condition (diabetes, MS, ALS, prostate cancer treatment, etc.). Requires established nexus.',
    },
  };
};


/**
 * Analyze Penis Conditions logs for VA rating
 * DC 7520-7521 - Penis Removal/Loss
 */
export const analyzePenisConditionsLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  // Filter for penis condition symptoms
  const penisSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('penis');
  });

  if (penisSymptoms.length === 0) {
    return {
      condition: 'Penis Conditions',
      diagnosticCode: '7520-7521',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No penis condition symptoms logged',
        'Document extent of tissue loss if applicable',
        'Note surgical history',
        'Track functional impact',
      ],
      criteria: PENIS_CONDITIONS_CRITERIA,
      disclaimer: PENIS_CONDITIONS_CRITERIA.disclaimer,
      // SMC Eligibility Data
      smcEligible: true,
      smcData: {
        level: 'K',
        category: 'CREATIVE_ORGAN',
        autoGrant: true,
        note: 'All penis removal conditions require SMC-K review under 38 CFR § 3.350(a) for loss of creative organ.',
      },
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const removalHalf = penisSymptoms.filter(s => (s.symptomId || s.symptom) === 'penis-removal-half').length;
  const removalGlans = penisSymptoms.filter(s => (s.symptomId || s.symptom) === 'penis-removal-glans').length;
  const deformity = penisSymptoms.filter(s => (s.symptomId || s.symptom) === 'penis-deformity').length;
  const prosthesis = penisSymptoms.filter(s => (s.symptomId || s.symptom) === 'penis-prosthesis').length;

  evidence.push(`${penisSymptoms.length} penis condition entries logged`);

  // Rating determination - fixed ratings based on extent of loss
  if (removalHalf > 0) {
    supportedRating = 30;
    ratingRationale.push('Removal of half or more of penis documented (DC 7520)');
    evidence.push('Qualifies for 30% rating under DC 7520');
    ratingRationale.push('Requires SMC-K review for loss of creative organ');
  } else if (removalGlans > 0) {
    supportedRating = 20;
    ratingRationale.push('Removal of glans penis documented (DC 7521)');
    evidence.push('Qualifies for 20% rating under DC 7521');
    ratingRationale.push('Requires SMC-K review for loss of creative organ');
  } else if (deformity > 0) {
    supportedRating = 0;
    ratingRationale.push('Penile deformity documented - rated under DC 7522 at 0%');
    evidence.push('Deformity present but rated at 0% per DC 7522');
    ratingRationale.push('Still qualifies for SMC-K review');
  }

  if (prosthesis > 0) {
    evidence.push('Penile prosthesis documented');
  }

  // Documentation gaps
  gaps.push('Obtain surgical/operative reports documenting extent of loss');
  gaps.push('Apply for Special Monthly Compensation (SMC-K) for loss of creative organ');
  gaps.push('Document any secondary psychological impact');
  gaps.push('Get urology evaluation confirming condition');

  return {
    condition: 'Penis Conditions',
    diagnosticCode: '7520-7521',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: PENIS_CONDITIONS_CRITERIA,
    disclaimer: PENIS_CONDITIONS_CRITERIA.disclaimer,
    // SMC Eligibility Data
    smcEligible: true,
    smcData: {
      level: 'K',
      category: 'CREATIVE_ORGAN',
      autoGrant: true,
      note: 'All testis loss/atrophy conditions require SMC-K review under 38 CFR § 3.350(a) for loss of creative organ.',
    },

  };
};


/**
 * Analyze Testis Conditions logs for VA rating
 * DC 7523-7524 - Testis Atrophy/Removal
 */
export const analyzeTestisConditionsLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  // Filter for testis condition symptoms
  const testisSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('testis');
  });

  if (testisSymptoms.length === 0) {
    return {
      condition: 'Testis Conditions',
      diagnosticCode: '7523-7524',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No testis condition symptoms logged',
        'Document extent of loss or atrophy',
        'Note if one or both testes affected',
        'Track hormone therapy if applicable',
      ],
      criteria: TESTIS_CONDITIONS_CRITERIA,
      disclaimer: TESTIS_CONDITIONS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const atrophyBoth = testisSymptoms.filter(s => (s.symptomId || s.symptom) === 'testis-atrophy-both').length;
  const atrophyOne = testisSymptoms.filter(s => (s.symptomId || s.symptom) === 'testis-atrophy-one').length;
  const removalBoth = testisSymptoms.filter(s => (s.symptomId || s.symptom) === 'testis-removal-both').length;
  const removalOne = testisSymptoms.filter(s => (s.symptomId || s.symptom) === 'testis-removal-one').length;
  const hormoneTherapy = testisSymptoms.filter(s => (s.symptomId || s.symptom) === 'testis-hormone-therapy').length;

  evidence.push(`${testisSymptoms.length} testis condition entries logged`);

  // Rating determination - based on bilateral vs unilateral and removal vs atrophy
  if (removalBoth > 0) {
    supportedRating = 30;
    ratingRationale.push('Removal of both testes documented (DC 7524)');
    evidence.push('Qualifies for 30% rating under DC 7524');
    ratingRationale.push('Requires SMC-K review for loss of creative organ');
  } else if (atrophyBoth > 0) {
    supportedRating = 20;
    ratingRationale.push('Complete atrophy of both testes documented (DC 7523)');
    evidence.push('Qualifies for 20% rating under DC 7523');
    ratingRationale.push('Requires SMC-K review for loss of creative organ');
  } else if (removalOne > 0 || atrophyOne > 0) {
    supportedRating = 0;
    if (removalOne > 0) {
      ratingRationale.push('Removal of one testis documented (DC 7524)');
      evidence.push('Unilateral removal rated at 0% per DC 7524');
    }
    if (atrophyOne > 0) {
      ratingRationale.push('Complete atrophy of one testis documented (DC 7523)');
      evidence.push('Unilateral atrophy rated at 0% per DC 7523');
    }
    ratingRationale.push('Still qualifies for SMC-K review');
    gaps.push('Note: If other testis is also absent/nonfunctioning (unrelated to service), may qualify for 30% under special provision');
  }

  if (hormoneTherapy > 0) {
    evidence.push('Hormone replacement therapy documented');
    ratingRationale.push('Testosterone replacement indicates significant loss of function');
  }

  // Documentation gaps
  gaps.push('Obtain surgical/operative reports or urology evaluation');
  gaps.push('Apply for Special Monthly Compensation (SMC-K) for loss of creative organ');
  gaps.push('Document hormone levels and replacement therapy if applicable');
  gaps.push('Note cause of loss (service-connected trauma, cancer, etc.)');

  return {
    condition: 'Testis Conditions',
    diagnosticCode: '7523-7524',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: TESTIS_CONDITIONS_CRITERIA,
    disclaimer: TESTIS_CONDITIONS_CRITERIA.disclaimer,
    // SMC Eligibility Data
    smcEligible: true,
    smcData: {
      level: 'K',
      category: 'CREATIVE_ORGAN',
      autoGrant: true,
      note: 'All testis loss/atrophy conditions require SMC-K review under 38 CFR § 3.350(a) for loss of creative organ.',
    },
  };
};


/**
 * Analyze Penis Conditions logs for VA rating
 * DC 7520-7521 - Penis Removal/Loss
 */

export const analyzeEndometriosisLogs = (logs) => {
  const endoLogs = logs.filter(log =>
      log.gynecologicalData?.endometriosisDiagnosed ||
      log.symptomId?.includes('endometriosis')
  );

  if (endoLogs.length === 0) {
    return {
      hasData: false,
      message: 'No endometriosis symptoms logged'
    };
  }

  // Check laparoscopy confirmation
  const laparoscopyConfirmed = endoLogs.some(log => log.gynecologicalData?.laparoscopyConfirmed);

  // Check bowel/bladder involvement
  const hasBowelBladderLesions = endoLogs.some(log =>
      log.gynecologicalData?.lesionLocations?.includes('Bowel') ||
      log.gynecologicalData?.lesionLocations?.includes('Bladder')
  );

  const hasBowelSymptoms = endoLogs.some(log => log.gynecologicalData?.bowelSymptoms);
  const hasBladderSymptoms = endoLogs.some(log => log.gynecologicalData?.bladderSymptoms);

  // Check treatment effectiveness
  const treatmentEffectiveness = {};
  endoLogs.forEach(log => {
    const effect = log.gynecologicalData?.treatmentEffectiveness;
    if (effect) {
      treatmentEffectiveness[effect] = (treatmentEffectiveness[effect] || 0) + 1;
    }
  });

  const mostCommonEffectiveness = Object.keys(treatmentEffectiveness).reduce((a, b) =>
      treatmentEffectiveness[a] > treatmentEffectiveness[b] ? a : b, null
  );

  // Determine rating
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (!laparoscopyConfirmed) {
    evidenceGaps.push('CRITICAL: Laparoscopy confirmation required for VA endometriosis diagnosis');
    rationale.push('Endometriosis must be confirmed by laparoscopy for VA rating');
  }

  if (laparoscopyConfirmed && hasBowelBladderLesions &&
      (mostCommonEffectiveness === 'not-controlled' || mostCommonEffectiveness === 'partially-controlled') &&
      (hasBowelSymptoms || hasBladderSymptoms)) {
    supportedRating = 50;
    rationale.push('Lesions involving bowel or bladder confirmed by laparoscopy');
    rationale.push('Pelvic pain or bleeding not controlled by treatment');
    rationale.push('Bowel or bladder symptoms documented');
  } else if (laparoscopyConfirmed &&
      (mostCommonEffectiveness === 'not-controlled' || mostCommonEffectiveness === 'partially-controlled')) {
    supportedRating = 30;
    rationale.push('Pelvic pain or heavy/irregular bleeding present');
    rationale.push('Symptoms not controlled by treatment');
  } else if (laparoscopyConfirmed) {
    supportedRating = 10;
    rationale.push('Pelvic pain or heavy/irregular bleeding present');
    rationale.push('Symptoms require continuous treatment for control');
  }

  // Evidence gaps
  if (!hasBowelBladderLesions && supportedRating < 50) {
    evidenceGaps.push('For 50% rating: Document bowel or bladder lesions on laparoscopy report');
  }
  if (!hasBowelSymptoms && !hasBladderSymptoms && hasBowelBladderLesions) {
    evidenceGaps.push('For 50% rating: Document bowel/bladder symptoms in medical records');
  }
  if (mostCommonEffectiveness === 'controlled' || !mostCommonEffectiveness) {
    evidenceGaps.push('Document treatment effectiveness - symptoms must not be controlled for higher ratings');
  }

  evidenceGaps.push('Maintain gynecology records showing treatment attempts and symptom persistence');
  evidenceGaps.push('Document pain severity and interference with daily activities');

  return {
    condition: 'Endometriosis',
    diagnosticCode: '7629',

    hasData: true,
    totalLogs: endoLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      laparoscopyConfirmed,
      hasBowelBladderLesions,
      hasBowelSymptoms,
      hasBladderSymptoms,
      treatmentEffectiveness,
      mostCommonEffectiveness,
    },
    criteriaReference: ENDOMETRIOSIS_CRITERIA,
  };
};

/**
 * Analyzes Female Reproductive Organs logs (DC 7610-7615)
 * Covers vulva, vagina, cervix, uterus, fallopian tube/PID, ovary/PCOS
 */

export const analyzeFemaleReproductiveOrgansLogs = (logs) => {
  const gyneLogs = logs.filter(log =>
      log.gynecologicalData &&
      (log.gynecologicalData.pcosDiagnosed ||
          log.gynecologicalData.pidDiagnosed ||
          log.symptomId?.includes('menstrual') ||
          log.symptomId?.includes('pelvic-pain') ||
          log.symptomId?.includes('dysmenorrhea') ||
          log.symptomId?.includes('pid') ||
          log.symptomId?.includes('ovarian') ||
          log.symptomId?.includes('pcos'))
  );

  if (gyneLogs.length === 0) {
    return {
      hasData: false,
      message: 'No female reproductive organ symptoms logged'
    };
  }

  // Check for continuous treatment requirement
  const requiresContinuousTreatment = gyneLogs.some(log =>
      log.gynecologicalData?.continuousTreatmentRequired
  );

  // Check symptom control
  const hasUncontrolledSymptoms = gyneLogs.some(log =>
      log.severity >= 7 ||
      log.gynecologicalData?.interferesDailyActivities ||
      log.gynecologicalData?.workMissed
  );

  // Specific conditions
  const hasPCOS = gyneLogs.some(log => log.gynecologicalData?.pcosDiagnosed);
  const hasPID = gyneLogs.some(log => log.gynecologicalData?.pidDiagnosed);
  const hasRecurrentPID = gyneLogs.some(log => log.gynecologicalData?.recurrentInfections);

  // Menstrual dysfunction
  const hasIrregularCycles = gyneLogs.some(log =>
      log.gynecologicalData?.cycleRegularity === 'irregular' ||
      log.gynecologicalData?.cycleRegularity === 'absent'
  );
  const hasHeavyBleeding = gyneLogs.some(log =>
      log.gynecologicalData?.flowHeaviness === 'heavy' ||
      log.gynecologicalData?.flowHeaviness === 'very-heavy'
  );
  const hasSevereDysmenorrhea = gyneLogs.some(log =>
      log.gynecologicalData?.dysmenorrheaSeverity === 'severe'
  );

  // Determine rating
  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  if (hasUncontrolledSymptoms && requiresContinuousTreatment) {
    supportedRating = 30;
    rationale.push('Symptoms not controlled by continuous treatment');
    rationale.push('Documented interference with daily activities or work');
  } else if (requiresContinuousTreatment) {
    supportedRating = 10;
    rationale.push('Symptoms require continuous treatment');
    rationale.push('Treatment provides adequate symptom control');
  } else {
    supportedRating = 0;
    rationale.push('Symptoms do not require continuous treatment');
  }

  // Condition-specific notes
  if (hasPCOS) {
    rationale.push('PCOS diagnosed (rated under DC 7615 - Ovary Disease)');
  }
  if (hasPID) {
    rationale.push('PID diagnosed (rated under DC 7614 - Fallopian Tube)');
    if (hasRecurrentPID) {
      rationale.push('Recurrent PID documented');
    }
  }
  if (hasIrregularCycles) {
    rationale.push('Irregular menstrual cycles documented');
  }
  if (hasHeavyBleeding) {
    rationale.push('Heavy menstrual bleeding (menorrhagia) documented');
  }
  if (hasSevereDysmenorrhea) {
    rationale.push('Severe dysmenorrhea (painful periods) documented');
  }

  // Evidence gaps
  evidenceGaps.push('Obtain gynecology examination and diagnosis');
  evidenceGaps.push('Document specific organ affected (vulva/vagina/cervix/uterus/fallopian tube/ovary)');
  evidenceGaps.push('Document treatment regimen (hormonal therapy, pain management, etc.)');
  evidenceGaps.push('Document symptom control with treatment');
  evidenceGaps.push('For higher rating: Document failed treatment attempts or persistent symptoms despite treatment');

  if (hasPCOS) {
    evidenceGaps.push('PCOS: Document Rotterdam criteria (2 of 3: irregular periods, hyperandrogenism, polycystic ovaries)');
  }
  if (hasPID) {
    evidenceGaps.push('PID: Document acute episodes, treatment, and any chronic sequelae');
  }

  // Check for SMC-K qualifying anatomical losses
  const hasHysterectomy = gyneLogs.some(log =>
      log.symptomId?.includes('hysterectomy') ||
      log.gynecologicalData?.hysterectomy
  );
  const hasOophorectomy = gyneLogs.some(log =>
      log.symptomId?.includes('oophorectomy') ||
      log.symptomId?.includes('salpingo-oophorectomy') ||
      log.gynecologicalData?.oophorectomy
  );
  const hasCervixRemoval = gyneLogs.some(log =>
      log.symptomId?.includes('cervix-removal') ||
      log.gynecologicalData?.cervixRemoval
  );

  // SMC-K eligibility for loss of creative organ
  const smcKEligible = hasHysterectomy || hasOophorectomy || hasCervixRemoval;

  if (smcKEligible) {
    rationale.push('⭐ SMC-K eligible: Loss of creative organ documented');
    if (hasHysterectomy) rationale.push('Hysterectomy (uterus removal) qualifies for SMC-K under 38 CFR § 3.350(a)');
    if (hasOophorectomy) rationale.push('Oophorectomy (ovary removal) qualifies for SMC-K under 38 CFR § 3.350(a)');
    if (hasCervixRemoval) rationale.push('Cervix removal qualifies for SMC-K under 38 CFR § 3.350(a)');
  }

  return {
    condition: 'Diseases of Female Reproductive Organs',
    diagnosticCode: '7610-7629',
    hasData: true,
    totalLogs: gyneLogs.length,
    supportedRating,
    rationale,
    ratingRationale: rationale,
    evidenceGaps,
    gaps: evidenceGaps,
    metrics: {
      requiresContinuousTreatment,
      hasUncontrolledSymptoms,
      hasPCOS,
      hasPID,
      hasRecurrentPID,
      hasIrregularCycles,
      hasHeavyBleeding,
      hasSevereDysmenorrhea,
      hasHysterectomy,
      hasOophorectomy,
      hasCervixRemoval,
    },
    criteriaReference: FEMALE_REPRODUCTIVE_ORGANS_CRITERIA,
    // SMC-K Eligibility
    smcEligible: smcKEligible,
    smcData: smcKEligible ? {
      level: 'K',
      category: 'CREATIVE_ORGAN',
      autoGrant: true,
      note: 'Loss of uterus, ovary, or cervix qualifies for SMC-K under 38 CFR § 3.350(a) for loss of creative organ.',
    } : null,
  };
};

/**
 * Analyzes Pelvic Organ Prolapse logs (DC 7621)
 */

export const analyzePelvicProlapseLogs = (logs) => {
  const prolapseLogs = logs.filter(log =>
      log.gynecologicalData?.prolapseDiagnosed ||
      log.symptomId?.includes('prolapse')
  );

  if (prolapseLogs.length === 0) {
    return {
      hasData: false,
      message: 'No pelvic organ prolapse symptoms logged'
    };
  }

  // Get prolapse types
  const prolapseTypes = {};
  prolapseLogs.forEach(log => {
    const type = log.gynecologicalData?.prolapseType;
    if (type) {
      prolapseTypes[type] = (prolapseTypes[type] || 0) + 1;
    }
  });

  // Get POP-Q stages
  const popStages = {};
  prolapseLogs.forEach(log => {
    const stage = log.gynecologicalData?.popStage;
    if (stage) {
      popStages[stage] = (popStages[stage] || 0) + 1;
    }
  });

  const mostCommonType = Object.keys(prolapseTypes).reduce((a, b) =>
      prolapseTypes[a] > prolapseTypes[b] ? a : b, null
  );

  const mostCommonStage = Object.keys(popStages).reduce((a, b) =>
      popStages[a] > popStages[b] ? a : b, null
  );

  // DC 7621 is flat 10%
  const supportedRating = 10;
  const rationale = [
    'DC 7621 provides flat 10% rating for pelvic organ prolapse',
    `Type of prolapse: ${mostCommonType || 'not specified'}`,
    `POP-Q Stage: ${mostCommonStage || 'not specified'}`,
    'Rating is same regardless of severity or stage',
  ];

  const evidenceGaps = [
    'Obtain gynecology or urogynecology examination',
    'Get POP-Q staging documentation',
    'Document type of prolapse (cystocele, rectocele, uterine, etc.)',
    'Document symptoms (pelvic pressure, bulge, urinary/bowel issues)',
    'Document treatment (pessary, pelvic floor PT, surgery)',
    'Note: Secondary conditions (urinary incontinence, bowel dysfunction) may be separately ratable',
  ];

  return {
    condition: 'Pelvic Organ Prolapse',
    diagnosticCode: '7628',

    hasData: true,
    totalLogs: prolapseLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      prolapseTypes,
      popStages,
      mostCommonType,
      mostCommonStage,
    },
    criteriaReference: PELVIC_PROLAPSE_CRITERIA,
  };
};

/**
 * Analyzes Female Sexual Arousal Disorder logs (DC 7632)
 */

export const analyzeFemaleArousalDisorderLogs = (logs) => {
  const fsadLogs = logs.filter(log =>
      log.gynecologicalData?.sexualDysfunction ||
      log.gynecologicalData?.arousalDifficulty ||
      log.gynecologicalData?.libidoDecreased ||
      log.symptomId?.includes('sexual-dysfunction') ||
      log.symptomId?.includes('arousal') ||
      log.symptomId?.includes('libido')
  );

  if (fsadLogs.length === 0) {
    return {
      hasData: false,
      message: 'No female sexual arousal disorder symptoms logged'
    };
  }

  const hasArousalDifficulty = fsadLogs.some(log => log.gynecologicalData?.arousalDifficulty);
  const hasDecreasedLibido = fsadLogs.some(log => log.gynecologicalData?.libidoDecreased);

  return {
    condition: 'Female Sexual Arousal Disorder (FSAD)',
    diagnosticCode: '7632',

    hasData: true,
    totalLogs: fsadLogs.length,
    supportedRating: 0,
    ratingRationale: [
      'DC 7632 is rated at 0% only',
      'Service connection establishes potential for SMC review',
      hasArousalDifficulty ? 'Arousal difficulty documented' : '',
      hasDecreasedLibido ? 'Decreased libido documented' : '',
    ].filter(Boolean),
    gaps: [
      'Obtain gynecology or sexual health specialist evaluation',
      'Document FSAD diagnosis and symptoms',
      'Document any secondary conditions (PTSD, depression, medications, endometriosis, dyspareunia)',
      'Get treatment records if any (therapy, medications, etc.)',
      'Service connection establishes review for SMC under § 3.350',
    ],
    metrics: {
      hasArousalDifficulty,
      hasDecreasedLibido,
    },
    criteriaReference: FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA,
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

export const analyzeChronicCystitisLogs = (logs, _options = {}) => {
  const symptomIds = [
    'urinary-frequency', 'urinary-urgency', 'dysuria', 'bladder-pain',
    'urinary-incontinence', 'nocturia', 'recurrent-uti'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('cystitis') ||
        log.notes?.toLowerCase().includes('bladder') ||
        log.notes?.toLowerCase().includes('uti');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Chronic Cystitis',
      diagnosticCode: '7512',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Evaluate voiding dysfunction criteria
  const severeIncontinence = validLogs.some(log =>
      log.notes?.toLowerCase().includes('pad') &&
      (log.notes?.toLowerCase().includes('4') || log.notes?.toLowerCase().includes('five') ||
          log.notes?.toLowerCase().includes('5') || log.notes?.toLowerCase().includes('more than 4'))
  );

  const moderateIncontinence = validLogs.some(log =>
      log.notes?.toLowerCase().includes('pad') &&
      (log.notes?.toLowerCase().includes('2') || log.notes?.toLowerCase().includes('3') ||
          log.notes?.toLowerCase().includes('4'))
  );

  const severeFrequency = validLogs.some(log =>
      log.notes?.toLowerCase().includes('hourly') ||
      log.notes?.toLowerCase().includes('every hour') ||
      log.notes?.toLowerCase().includes('less than 1 hour') ||
      log.notes?.toLowerCase().includes('5 times') ||
      log.notes?.toLowerCase().includes('nocturia 5')
  );

  const moderateFrequency = validLogs.some(log =>
      log.notes?.toLowerCase().includes('every 1-2 hour') ||
      log.notes?.toLowerCase().includes('3-4 times') ||
      log.notes?.toLowerCase().includes('nocturia 3') ||
      log.notes?.toLowerCase().includes('nocturia 4')
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeIncontinence) {
    supportedRating = 60;
    rationale = 'Evidence suggests severe incontinence requiring frequent pad changes (>4/day).';
  } else if (severeFrequency || moderateIncontinence) {
    supportedRating = 40;
    rationale = 'Evidence suggests severe urinary frequency or moderate incontinence.';
  } else if (moderateFrequency) {
    supportedRating = 20;
    rationale = 'Evidence suggests moderate urinary frequency or mild incontinence.';
  } else if (validLogs.length > 0) {
    supportedRating = 10;
    rationale = 'Evidence suggests mild urinary symptoms.';
  }

  return {
    condition: 'Chronic Cystitis',
    diagnosticCode: '7512',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: CHRONIC_CYSTITIS_CRITERIA,
    recommendations: [
      'Keep a voiding diary (frequency, volume)',
      'Document pad/absorbent usage if applicable',
      'Track UTI episodes with culture results',
      'Note nocturia frequency',
    ],
  };
};

// ============================================
// EYE/VISION CONDITION ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyzes general Eye Conditions logs
 * Uses General Rating Formula for Diseases of the Eye (incapacitating episodes)
 */

export const analyzeNeurogenicBladderLogs = (logs, _options = {}) => {
  const symptomIds = [
    'urinary-frequency', 'urinary-urgency', 'urinary-incontinence',
    'urinary-retention', 'nocturia', 'catheterization', 'bladder-spasms'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('neurogenic') ||
        log.notes?.toLowerCase().includes('bladder') ||
        log.notes?.toLowerCase().includes('catheter');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Neurogenic Bladder',
      diagnosticCode: '7542',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for catheterization
  const requiresCatheter = validLogs.some(log =>
      log.notes?.toLowerCase().includes('catheter') ||
      log.notes?.toLowerCase().includes('self-cath') ||
      log.notes?.toLowerCase().includes('foley') ||
      log.notes?.toLowerCase().includes('suprapubic')
  );

  // Check for severe incontinence
  const severeIncontinence = validLogs.some(log =>
      log.notes?.toLowerCase().includes('pad') &&
      (log.notes?.toLowerCase().includes('>4') || log.notes?.toLowerCase().includes('more than 4') ||
          log.notes?.toLowerCase().includes('5') || log.notes?.toLowerCase().includes('6'))
  );

  const moderateIncontinence = validLogs.some(log =>
      log.notes?.toLowerCase().includes('pad') &&
      (log.notes?.toLowerCase().includes('2') || log.notes?.toLowerCase().includes('3') ||
          log.notes?.toLowerCase().includes('4'))
  );

  // Check for frequency
  const severeFrequency = validLogs.some(log =>
      log.notes?.toLowerCase().includes('hourly') ||
      log.notes?.toLowerCase().includes('every hour') ||
      log.notes?.toLowerCase().includes('nocturia 5') ||
      log.notes?.toLowerCase().includes('5 times')
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeIncontinence) {
    supportedRating = 60;
    rationale = 'Evidence suggests severe incontinence requiring frequent pad changes (>4/day).';
  } else if (severeFrequency || moderateIncontinence) {
    supportedRating = 40;
    rationale = 'Evidence suggests severe frequency or moderate incontinence.';
  } else if (requiresCatheter) {
    supportedRating = 30;
    rationale = 'Evidence suggests urinary retention requiring catheterization.';
  } else if (validLogs.length >= 5) {
    supportedRating = 20;
    rationale = 'Evidence suggests moderate voiding dysfunction.';
  } else {
    supportedRating = 10;
    rationale = 'Evidence suggests mild voiding dysfunction.';
  }

  return {
    condition: 'Neurogenic Bladder',
    diagnosticCode: '7542',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: NEUROGENIC_BLADDER_CRITERIA,
    recommendations: [
      'Keep a voiding diary (frequency, volume, accidents)',
      'Document pad/absorbent usage per day',
      'Note catheterization frequency if applicable',
      'Get urodynamic study results',
      'Document underlying neurological condition',
    ],
  };
};

/**
 * Analyzes Prostate Conditions logs (DC 7527)
 */

export const analyzeProstateConditionsLogs = (logs, _options = {}) => {
  const symptomIds = [
    'urinary-frequency', 'urinary-urgency', 'weak-stream', 'hesitancy',
    'nocturia', 'incomplete-emptying', 'urinary-retention', 'dysuria'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('prostate') ||
        log.notes?.toLowerCase().includes('bph') ||
        log.notes?.toLowerCase().includes('prostatitis');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Prostate Conditions',
      diagnosticCode: '7527',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for catheterization requirement
  const requiresCatheter = validLogs.some(log =>
      log.notes?.toLowerCase().includes('catheter') ||
      log.notes?.toLowerCase().includes('retention')
  );

  // Check for severe symptoms
  const severeFrequency = validLogs.some(log =>
      log.notes?.toLowerCase().includes('hourly') ||
      log.notes?.toLowerCase().includes('nocturia 5') ||
      log.notes?.toLowerCase().includes('>4 times')
  );

  const moderateFrequency = validLogs.some(log =>
      log.notes?.toLowerCase().includes('nocturia 3') ||
      log.notes?.toLowerCase().includes('nocturia 4') ||
      log.notes?.toLowerCase().includes('every 1-2')
  );

  const obstructiveSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('weak stream') ||
      log.notes?.toLowerCase().includes('hesitancy') ||
      log.notes?.toLowerCase().includes('straining')
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeFrequency) {
    supportedRating = 40;
    rationale = 'Evidence suggests severe urinary frequency or nocturia (5+/night).';
  } else if (requiresCatheter) {
    supportedRating = 30;
    rationale = 'Evidence suggests urinary retention requiring catheterization.';
  } else if (moderateFrequency) {
    supportedRating = 20;
    rationale = 'Evidence suggests moderate frequency (voiding every 1-2 hours or nocturia 3-4).';
  } else if (obstructiveSymptoms || validLogs.length >= 5) {
    supportedRating = 10;
    rationale = 'Evidence suggests obstructive voiding symptoms or mild frequency.';
  }

  return {
    condition: 'Prostate Conditions',
    diagnosticCode: '7527',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: PROSTATE_CONDITIONS_CRITERIA,
    recommendations: [
      'Keep a voiding diary with frequency and volume',
      'Document nocturia (times awakened to void)',
      'Get uroflowmetry and post-void residual measurements',
      'Note PSA levels and prostate exam findings',
      'Document any catheterization requirements',
    ],
  };
};

/**
 * Analyzes Urethral Stricture logs (DC 7518)
 */

export const analyzeUrethralStrictureLogs = (logs, _options = {}) => {
  const symptomIds = [
    'weak-stream', 'hesitancy', 'straining', 'incomplete-emptying',
    'urinary-retention', 'dysuria', 'uti-recurrent'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('stricture') ||
        log.notes?.toLowerCase().includes('dilation') ||
        log.notes?.toLowerCase().includes('urethra');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Urethral Stricture',
      diagnosticCode: '7518',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for catheterization
  const requiresCatheter = validLogs.some(log =>
      log.notes?.toLowerCase().includes('catheter') ||
      log.notes?.toLowerCase().includes('retention')
  );

  // Check for dilation frequency
  const frequentDilations = validLogs.filter(log =>
      log.notes?.toLowerCase().includes('dilation')
  ).length >= 4; // Every 2-3 months = 4-6/year

  const occasionalDilations = validLogs.some(log =>
      log.notes?.toLowerCase().includes('dilation')
  );

  // Check for complications
  const hasComplications = validLogs.some(log =>
      log.notes?.toLowerCase().includes('uti') ||
      log.notes?.toLowerCase().includes('infection') ||
      log.notes?.toLowerCase().includes('residual >150')
  );

  let supportedRating = 0;
  let rationale = '';

  if (requiresCatheter) {
    supportedRating = 30;
    rationale = 'Evidence suggests urinary retention requiring catheterization.';
  } else if (frequentDilations || hasComplications) {
    supportedRating = 10;
    rationale = 'Evidence suggests marked obstructive symptoms requiring frequent dilations or with complications.';
  } else if (occasionalDilations) {
    supportedRating = 0;
    rationale = 'Occasional dilations (1-2/year) documented - 0% rating.';
  }

  return {
    condition: 'Urethral Stricture',
    diagnosticCode: '7518',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: URETHRAL_STRICTURE_CRITERIA,
    recommendations: [
      'Document all dilation procedures with dates',
      'Get post-void residual measurements',
      'Keep uroflowmetry results',
      'Document any UTIs related to obstruction',
      'Note catheterization if required',
    ],
  };
};

// ============================================
// GYNECOLOGICAL CRITERIA
// Extracted from ratingCriteria.js — Phase 9B
// DC 7332 Sphincter Impairment, DC 7610-7615 Female Reproductive Organs
// ============================================

export const SPHINCTER_IMPAIRMENT_CRITERIA = {
  diagnosticCode: '7332',
  condition: 'Rectum and Anus, Impairment of Sphincter Control (Fecal Incontinence)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7332',

  note: 'Rating based on frequency and severity of fecal incontinence episodes.',

  ratings: [
    {
      percent: 100,
      summary: 'Complete loss of sphincter control',
      criteriaDescription: [
        'Continuous fecal incontinence',
        'Unable to control bowel movements',
        'Constant soiling',
        'Requires protective garments at all times',
      ],
      evidenceNeeded: [
        'Medical documentation of complete incontinence',
        'Gastroenterology/colorectal surgery evaluation',
        'Anorectal manometry if performed',
        'Treatment records',
        'Documentation of protective garment use',
      ],
    },
    {
      percent: 60,
      summary: 'Frequent and essentially complete loss of control',
      criteriaDescription: [
        'Multiple daily episodes of fecal incontinence',
        'Inability to delay defecation',
        'Significant impairment of sphincter function',
      ],
      evidenceNeeded: [
        'Incontinence diary showing daily episodes',
        'Medical evaluation confirming severity',
        'Treatment attempts documented',
      ],
    },
    {
      percent: 30,
      summary: 'Occasional loss of sphincter control',
      criteriaDescription: [
        'Periodic fecal incontinence episodes',
        'May occur weekly or monthly',
        'Some sphincter control maintained',
      ],
      evidenceNeeded: [
        'Documentation of incontinence frequency',
        'Medical records',
        'Evidence of impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Mild impairment',
      criteriaDescription: [
        'Rare loss of bowel control',
        'Gas incontinence or occasional soiling',
        'Minimal functional impairment',
      ],
      evidenceNeeded: [
        'Medical documentation',
        'Description of symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'No significant impairment',
      criteriaDescription: [
        'Normal sphincter control',
        'No episodes of incontinence',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    'Fecal incontinence': 'Involuntary loss of bowel control',
    'Sphincter': 'Muscle ring controlling bowel movements',
    'Anorectal manometry': 'Test measuring sphincter muscle strength',
    'Urgency': 'Sudden, strong urge to defecate with limited time to reach toilet',
  },

  disclaimer: 'Service connection must be established. May result from trauma, surgery, neurological conditions, or other service-connected causes. Rate as diarrhea (DC 7319) if episodes are due to IBS and not sphincter impairment.',
};
export const VULVA_CLITORIS_DISEASE_CRITERIA = {
  diagnosticCode: '7610',
  condition: 'Vulva or Clitoris Disease/Injury',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7610',

  note: 'Uses General Rating Formula for Disease, Injury, or Adhesions of Female Reproductive Organs (DC 7610-7615).',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of vulvar/clitoral condition',
        'Documentation of persistent symptoms despite treatment',
        'Treatment records showing failed or inadequate symptom control',
        'Gynecology records documenting severity',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
        'Discontinuation of treatment results in symptom recurrence',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
        'Records showing symptoms are controlled with treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    vulvovaginitis: {
      term: 'Vulvovaginitis',
      definition: 'Inflammation of the vulva and vagina, often causing itching, discharge, and irritation.',
    },
    vulvodynia: {
      term: 'Vulvodynia',
      definition: 'Chronic vulvar pain without an identifiable cause, lasting 3+ months.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615. Rate based on whether symptoms require continuous treatment and treatment effectiveness.',
};
export const VAGINA_DISEASE_CRITERIA = {
  diagnosticCode: '7611',
  condition: 'Vagina Disease/Injury',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7611',

  note: 'Uses General Rating Formula for Disease, Injury, or Adhesions of Female Reproductive Organs (DC 7610-7615).',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of vaginal condition',
        'Documentation of persistent symptoms despite treatment',
        'Treatment records showing failed or inadequate symptom control',
        'Gynecology records documenting severity',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
        'Records showing symptoms are controlled with treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    vaginitis: {
      term: 'Vaginitis',
      definition: 'Inflammation of the vagina that can result in discharge, itching and pain.',
    },
    vaginalAtrophy: {
      term: 'Vaginal Atrophy',
      definition: 'Thinning, drying and inflammation of vaginal walls due to decreased estrogen.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615.',
};
export const CERVIX_DISEASE_CRITERIA = {
  diagnosticCode: '7612',
  condition: 'Cervix Disease/Injury',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7612',

  note: 'Uses General Rating Formula for Disease, Injury, or Adhesions of Female Reproductive Organs (DC 7610-7615).',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of cervical condition',
        'Documentation of persistent symptoms despite treatment',
        'Treatment records showing failed or inadequate symptom control',
        'Gynecology records documenting severity',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    cervicitis: {
      term: 'Cervicitis',
      definition: 'Inflammation of the cervix, often causing discharge, pain, or bleeding.',
    },
    cervicalEctropion: {
      term: 'Cervical Ectropion',
      definition: 'Condition where cells from inside the cervical canal extend to the outer surface.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615.',
};
export const UTERUS_DISEASE_CRITERIA = {
  diagnosticCode: '7613',
  condition: 'Uterus Disease/Injury/Adhesions',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7613',

  note: 'Uses General Rating Formula for Disease, Injury, or Adhesions of Female Reproductive Organs (DC 7610-7615).',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of uterine condition',
        'Documentation of persistent symptoms despite treatment',
        'Gynecology records documenting severity',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    uterineAdhesions: {
      term: 'Uterine Adhesions (Asherman Syndrome)',
      definition: 'Scar tissue within the uterine cavity, often following surgery or infection.',
    },
    uterineFibroids: {
      term: 'Uterine Fibroids',
      definition: 'Non-cancerous growths in the uterus that can cause pain, heavy bleeding, and pressure symptoms.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615.',
};
export const FALLOPIAN_TUBE_PID_CRITERIA = {
  diagnosticCode: '7614',
  condition: 'Fallopian Tube Disease/Pelvic Inflammatory Disease',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7614',

  note: 'Uses General Rating Formula for Disease, Injury, or Adhesions of Female Reproductive Organs (DC 7610-7615). Includes PID residuals.',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Chronic pelvic pain from PID residuals',
        'Treatment does not provide adequate control',
      ],
      evidenceNeeded: [
        'Medical diagnosis of fallopian tube disease or PID',
        'Documentation of persistent symptoms despite treatment',
        'Gynecology records documenting severity',
        'Evidence of chronic pelvic pain',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    PID: {
      term: 'Pelvic Inflammatory Disease (PID)',
      definition: 'Infection of the female reproductive organs, usually caused by STIs. Can cause chronic pelvic pain and scarring.',
    },
    hydrosalpinx: {
      term: 'Hydrosalpinx',
      definition: 'Blocked fallopian tube filled with fluid, often from previous infection or surgery.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615.',
};
export const OVARY_DISEASE_CRITERIA = {
  diagnosticCode: '7615',
  condition: 'Ovary Disease (includes PCOS, Dysmenorrhea)',
  cfrReference: '38 CFR 4.116, Diagnostic Code 7615',

  note: 'Uses General Rating Formula for DC 7610-7615. Includes ovarian cysts, PCOS, and ovarian dysfunction affecting menstrual cycle.',

  ratings: [
    {
      percent: 30,
      summary: 'Symptoms not controlled by continuous treatment',
      criteriaDescription: [
        'Ongoing symptoms despite treatment',
        'Symptoms interfere with daily activities',
        'Treatment does not provide adequate control',
        'May include severe dysmenorrhea, PCOS symptoms, or chronic ovarian pain',
      ],
      evidenceNeeded: [
        'Medical diagnosis of ovarian condition',
        'Documentation of persistent symptoms despite treatment',
        'Gynecology/endocrinology records',
        'For PCOS: hormone levels, imaging',
      ],
    },
    {
      percent: 10,
      summary: 'Symptoms that require continuous treatment',
      criteriaDescription: [
        'Symptoms require ongoing treatment for control',
        'Treatment is effective in controlling symptoms',
        'May include hormonal therapy for PCOS, birth control for cycle regulation',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
        'Documentation of continuous treatment',
        'Prescription records',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms that do not require continuous treatment',
      criteriaDescription: [
        'Symptoms are mild or intermittent',
        'No continuous treatment needed',
      ],
      evidenceNeeded: [
        'Medical diagnosis of condition',
      ],
    },
  ],

  definitions: {
    PCOS: {
      term: 'Polycystic Ovary Syndrome (PCOS)',
      definition: 'Hormonal disorder causing enlarged ovaries with small cysts, irregular periods, excess androgen, and often metabolic issues.',
    },
    dysmenorrhea: {
      term: 'Dysmenorrhea',
      definition: 'Painful menstruation severe enough to interfere with daily activities.',
    },
    ovarianCyst: {
      term: 'Ovarian Cyst',
      definition: 'Fluid-filled sac on or within an ovary. Can cause pain, bloating, or pressure.',
    },
  },

  disclaimer: 'This condition uses the General Rating Formula for DC 7610-7615. PCOS and dysmenorrhea affecting menstrual cycle are rated under DC 7615.',
};


// ============================================
// GYNECOLOGICAL ANALYZE FUNCTIONS
// ============================================

export const analyzeSphincterImpairmentLogs = (logs) => {
  const sphincterLogs = logs.filter(log =>
      log.genitourinaryData?.affectedSystem === 'sphincter' ||
      log.symptomId?.includes('fecal-incontinence')
  );

  if (sphincterLogs.length === 0) {
    return {
      hasData: false,
      message: 'No fecal incontinence symptoms logged'
    };
  }

  const episodes = sphincterLogs.filter(log => log.genitourinaryData?.fecalIncontinenceEpisode).length;
  const totalDaysLogged = sphincterLogs.length;
  const episodeRate = (episodes / totalDaysLogged * 100).toFixed(1);

  // Get frequency descriptions
  const frequencyDescriptions = {};
  sphincterLogs.forEach(log => {
    const freq = log.genitourinaryData?.fecalIncontinenceFrequency;
    if (freq) {
      frequencyDescriptions[freq] = (frequencyDescriptions[freq] || 0) + 1;
    }
  });

  const mostCommonFrequency = Object.keys(frequencyDescriptions).reduce((a, b) =>
      frequencyDescriptions[a] > frequencyDescriptions[b] ? a : b, null
  );

  // Determine rating
  let supportedRating = 0;
  let rationale = [];

  if (mostCommonFrequency === 'daily' || episodeRate > 50) {
    supportedRating = 60;
    rationale.push(`Daily or frequent episodes documented (${episodes} episodes in ${totalDaysLogged} days = ${episodeRate}%)`);
  } else if (mostCommonFrequency === 'weekly' || episodeRate > 10) {
    supportedRating = 30;
    rationale.push(`Weekly episodes documented (${episodes} episodes over ${totalDaysLogged} days)`);
  } else if (mostCommonFrequency === 'monthly' || episodes > 0) {
    supportedRating = 10;
    rationale.push(`Occasional episodes documented (${episodes} episodes)`);
  }

  const evidenceGaps = [
    'Obtain gastroenterology or colorectal surgery evaluation',
    'Document anorectal manometry results if performed',
    'Get treatment records (medications, biofeedback, surgery)',
  ];

  return {
    condition: 'Sphincter Control Impairment',
    diagnosticCode: '7332',

    hasData: true,
    totalLogs: sphincterLogs.length,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics: {
      episodes,
      totalDaysLogged,
      episodeRate: `${episodeRate}%`,
      mostCommonFrequency,
    },
    criteriaReference: SPHINCTER_IMPAIRMENT_CRITERIA,
  };
};

export const analyzeVulvaClitorisDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'vulvovaginitis', 'vaginal-irritation'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Vulva or Clitoris Disease/Injury',
      diagnosticCode: '7610',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for treatment-related notes
  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('medication') ||
      log.notes?.toLowerCase().includes('prescription')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.notes?.toLowerCase().includes('failed') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Vulva or Clitoris Disease/Injury',
    diagnosticCode: '7610',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: VULVA_CLITORIS_DISEASE_CRITERIA,
    recommendations: [
      'Document all treatment attempts and their effectiveness',
      'Note when symptoms interfere with daily activities',
      'Keep records of all gynecology visits',
    ],
  };
};

export const analyzeVaginaDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'vaginal-irritation', 'abnormal-discharge'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Vagina Disease/Injury',
      diagnosticCode: '7611',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('medication')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Vagina Disease/Injury',
    diagnosticCode: '7611',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: VAGINA_DISEASE_CRITERIA,
    recommendations: [
      'Document all treatment attempts and their effectiveness',
      'Note frequency and severity of symptoms',
      'Keep records of all gynecology visits',
    ],
  };
};

export const analyzeCervixDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'cervicitis', 'abnormal-discharge'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Cervix Disease/Injury',
      diagnosticCode: '7612',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('medication')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Cervix Disease/Injury',
    diagnosticCode: '7612',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: CERVIX_DISEASE_CRITERIA,
    recommendations: [
      'Document all treatment attempts and their effectiveness',
      'Keep records of Pap smears and gynecology visits',
    ],
  };
};

export const analyzeUterusDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'uterine-cramping', 'chronic-pelvic-pain', 'lower-abdominal-pain'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Uterus Disease/Injury/Adhesions',
      diagnosticCode: '7613',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('medication')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Uterus Disease/Injury/Adhesions',
    diagnosticCode: '7613',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: UTERUS_DISEASE_CRITERIA,
    recommendations: [
      'Document all treatment attempts and their effectiveness',
      'Note impact on daily activities',
      'Keep records of imaging studies (ultrasound, MRI)',
    ],
  };
};

export const analyzeFallopianTubePIDLogs = (logs, _options = {}) => {
  const symptomIds = [
    'pid-symptoms', 'abnormal-discharge', 'chronic-pelvic-pain', 'lower-abdominal-pain'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Fallopian Tube Disease/PID',
      diagnosticCode: '7614',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('antibiotic') ||
      log.notes?.toLowerCase().includes('medication')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('chronic') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests chronic symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Fallopian Tube Disease/PID',
    diagnosticCode: '7614',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: FALLOPIAN_TUBE_PID_CRITERIA,
    recommendations: [
      'Document all PID episodes and treatments',
      'Note chronic pelvic pain frequency and severity',
      'Keep records of all gynecology visits and imaging',
    ],
  };
};

export const analyzeOvaryDiseaseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'ovarian-cysts', 'polycystic-ovaries', 'ovulation-pain', 'anovulation',
    'painful-periods', 'heavy-menstrual-bleeding', 'irregular-periods',
    'absent-periods', 'hirsutism', 'hormonal-acne', 'pcos-weight-changes'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId);
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Ovary Disease (includes PCOS, Dysmenorrhea)',
      diagnosticCode: '7615',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  const hasContinuousTreatment = validLogs.some(log =>
      log.notes?.toLowerCase().includes('treatment') ||
      log.notes?.toLowerCase().includes('birth control') ||
      log.notes?.toLowerCase().includes('metformin') ||
      log.notes?.toLowerCase().includes('hormone') ||
      log.notes?.toLowerCase().includes('medication')
  );

  const hasUncontrolledSymptoms = validLogs.some(log =>
      log.notes?.toLowerCase().includes('not controlled') ||
      log.notes?.toLowerCase().includes('despite treatment') ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (hasUncontrolledSymptoms && hasContinuousTreatment) {
    supportedRating = 30;
    rationale = 'Evidence suggests symptoms not controlled by continuous treatment.';
  } else if (hasContinuousTreatment) {
    supportedRating = 10;
    rationale = 'Evidence suggests symptoms require continuous treatment.';
  } else {
    supportedRating = 0;
    rationale = 'Symptoms do not appear to require continuous treatment.';
  }

  return {
    condition: 'Ovary Disease (includes PCOS, Dysmenorrhea)',
    diagnosticCode: '7615',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: OVARY_DISEASE_CRITERIA,
    recommendations: [
      'Document menstrual cycle patterns',
      'Track PCOS symptoms (if applicable)',
      'Note all hormonal treatments and effectiveness',
      'Keep records of ultrasounds and hormone levels',
    ],
  };
};