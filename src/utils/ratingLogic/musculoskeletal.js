/* eslint-disable no-unused-vars */

// ============================================
// MUSCULOSKELETAL RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: Spine (Lumbosacral, Disc, Stenosis, Fusion, Fracture),
// Major Joints (Shoulder, Hip, Knee, Ankle, Wrist, Elbow),
// Arthritis, Gout, Bursitis, Tendinitis, Myositis, Osteomyelitis,
// Plantar Fasciitis, Amputation, and ADL (Activities of Daily Living).
//
// Based on 38 CFR Part 4, § 4.71a (Musculoskeletal System)
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

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
// MUSCULOSKELETAL CONDITIONS (for CONDITIONS object)
// ============================================
export const MUSCULOSKELETAL_CONDITIONS = {
  LUMBOSACRAL_STRAIN: {
    id: 'lumbosacral-strain',
    name: 'Lumbosacral Strain (Low Back Pain)',
    diagnosticCode: '5237',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [ 'lower-back-pain', 'back-pain', 'back-stiffness', 'back-spasm', 'back-radicular', 'back-numbness'],
  },
  INTERVERTEBRAL_DISC: {
    id: 'intervertebral-disc',
    name: 'Intervertebral Disc Syndrome',
    diagnosticCode: '5243',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [ 'disc-pain', 'back-pain', 'back-radicular', 'lower-back-pain', 'back-numbness'],
  },
  KNEE_INSTABILITY: {
    id: 'knee-instability',
    name: 'Knee Instability',
    diagnosticCode: '5257',
    cfrReference: '38 CFR 4.71a',
    symptomIds: [ 'knee-instability', 'knee-pain', 'knee-swelling', 'knee-stiffness', 'knee-locking'],
  },
  PLANTAR_FASCIITIS: {
    id: 'plantar-fasciitis',
    name: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['pf-heel-pain', 'pf-arch-pain', 'pf-morning-pain', 'pf-stiffness', 'pf-difficulty-walking'],
  },
  SHOULDER: {
    id: 'shoulder',
    name: 'Shoulder Conditions',
    diagnosticCode: '5201-5203',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['shoulder-pain', 'shoulder-limited-rom', 'shoulder-instability', 'shoulder-weakness', 'shoulder-stiffness'],
  },
  HIP: {
    id: 'hip',
    name: 'Hip Conditions',
    diagnosticCode: '5252-5255',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['hip-pain', 'hip-limited-rom', 'hip-stiffness', 'hip-weakness', 'hip-limping'],
  },
  ANKLE: {
    id: 'ankle',
    name: 'Ankle Conditions',
    diagnosticCode: '5270-5271',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['ankle-pain', 'ankle-limited-rom', 'ankle-stiffness', 'ankle-instability', 'ankle-swelling', 'ankle-weakness'],
  },
  WRIST: {
    id: 'wrist',
    name: 'Wrist Conditions',
    diagnosticCode: '5214-5215',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['wrist-pain', 'wrist-limited-rom', 'wrist-stiffness', 'wrist-weakness', 'wrist-numbness', 'wrist-swelling'],
  },
  ELBOW: {
    id: 'elbow',
    name: 'Elbow Conditions',
    diagnosticCode: '5205-5207',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['elbow-pain', 'elbow-limited-flexion', 'elbow-limited-extension', 'elbow-stiffness', 'elbow-weakness', 'elbow-instability'],
  },
  DEGENERATIVE_ARTHRITIS: {
    id: 'degenerative-arthritis',
    name: 'Degenerative Arthritis (Osteoarthritis)',
    diagnosticCode: '5003',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['arthritis-joint-pain', 'arthritis-morning-stiffness', 'arthritis-flare', 'arthritis-reduced-function', 'arthritis-swelling', 'arthritis-crepitus'],
  },
  GOUT: {
    id: 'gout',
    name: 'Gout',
    diagnosticCode: '5017',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['gout-acute-attack', 'gout-joint-pain', 'gout-swelling', 'gout-redness', 'gout-limited-motion', 'gout-tophi', 'gout-tenderness', 'gout-functional-loss'],
  },
  BURSITIS: {
    id: 'bursitis',
    name: 'Bursitis',
    diagnosticCode: '5019',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['bursitis-pain', 'bursitis-swelling', 'bursitis-tenderness', 'bursitis-limited-motion', 'bursitis-stiffness', 'bursitis-warmth', 'bursitis-flare', 'bursitis-functional-loss'],
  },
  TENDINITIS: {
    id: 'tendinitis',
    name: 'Tendinitis/Tenosynovitis',
    diagnosticCode: '5024',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['tendinitis-pain', 'tendinitis-swelling', 'tendinitis-tenderness', 'tendinitis-limited-motion', 'tendinitis-stiffness', 'tendinitis-crepitus', 'tendinitis-weakness', 'tendinitis-flare', 'tendinitis-functional-loss'],
  },
  MYOSITIS: {
    id: 'myositis',
    name: 'Myositis',
    diagnosticCode: '5021',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['myositis-muscle-pain', 'myositis-weakness', 'myositis-tenderness', 'myositis-swelling', 'myositis-stiffness', 'myositis-fatigue', 'myositis-limited-motion', 'myositis-flare', 'myositis-functional-loss'],
  },
  OSTEOMYELITIS: {
    id: 'osteomyelitis',
    name: 'Osteomyelitis',
    diagnosticCode: '5000',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['osteo-bone-pain', 'osteo-fever', 'osteo-swelling', 'osteo-redness', 'osteo-drainage', 'osteo-fatigue', 'osteo-weight-loss', 'osteo-limited-motion', 'osteo-flare', 'osteo-constitutional'],
  },
  MULTI_JOINT_ARTHRITIS: {
    id: 'multi-joint-arthritis',
    name: 'Multi-Joint Arthritis (Active Process)',
    diagnosticCode: '5002',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['mja-joint-pain', 'mja-joint-swelling', 'mja-morning-stiffness', 'mja-fatigue', 'mja-weight-loss', 'mja-anemia', 'mja-fever', 'mja-flare', 'mja-incapacitating', 'mja-functional-loss', 'mja-limited-motion'],
  },
  VERTEBRAL_FRACTURE: {
    id: 'vertebral-fracture',
    name: 'Vertebral Fracture or Dislocation',
    diagnosticCode: '5235',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['vfx-pain', 'vfx-limited-flexion', 'vfx-limited-extension', 'vfx-stiffness', 'vfx-muscle-spasm', 'vfx-radicular', 'vfx-numbness', 'vfx-height-loss', 'vfx-kyphosis', 'vfx-functional-loss'],
  },
  SACROILIAC_INJURY: {
    id: 'sacroiliac-injury',
    name: 'Sacroiliac Injury and Weakness',
    diagnosticCode: '5236',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['si-pain', 'si-buttock-pain', 'si-hip-pain', 'si-groin-pain', 'si-leg-pain', 'si-stiffness', 'si-instability', 'si-difficulty-sitting', 'si-difficulty-standing', 'si-difficulty-walking', 'si-limited-flexion', 'si-functional-loss'],
  },
  SPINAL_STENOSIS: {
    id: 'spinal-stenosis',
    name: 'Spinal Stenosis',
    diagnosticCode: '5238',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['ss-back-pain', 'ss-leg-pain', 'ss-leg-weakness', 'ss-numbness', 'ss-walking-difficulty', 'ss-relief-sitting', 'ss-balance-problems', 'ss-limited-flexion', 'ss-limited-extension', 'ss-bladder-bowel', 'ss-functional-loss'],
  },
  ANKYLOSING_SPONDYLITIS: {
    id: 'ankylosing-spondylitis',
    name: 'Ankylosing Spondylitis',
    diagnosticCode: '5240',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['as-back-pain', 'as-morning-stiffness', 'as-night-pain', 'as-limited-flexion', 'as-limited-extension', 'as-limited-lateral', 'as-chest-expansion', 'as-fatigue', 'as-peripheral-joint', 'as-enthesitis', 'as-flare', 'as-fusion', 'as-functional-loss'],
  },
  SPINAL_FUSION: {
    id: 'spinal-fusion',
    name: 'Spinal Fusion',
    diagnosticCode: '5241',
    cfrReference: '38 CFR 4.71a',
    symptomIds: ['sf-pain', 'sf-adjacent-pain', 'sf-stiffness', 'sf-limited-flexion', 'sf-limited-extension', 'sf-limited-rotation', 'sf-muscle-spasm', 'sf-radicular', 'sf-numbness', 'sf-hardware-pain', 'sf-functional-loss'],
  },
};

// ============================================
// MUSCULOSKELETAL RATING CRITERIA & ANALYZE FUNCTIONS
// ============================================

export const LUMBOSACRAL_STRAIN_CRITERIA = {
  diagnosticCode: '5237',
  condition: 'Lumbosacral Strain (Low Back Pain)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5237',

  ratings: [
    {
      percent: 100,
      summary: 'Unfavorable ankylosis of the entire spine',
      criteriaDescription: [
        'Complete fusion of the spine in an unfavorable position',
        'Extremely severe and disabling condition',
      ],
      evidenceNeeded: [
        'Medical imaging (X-ray, CT, MRI) showing complete spinal fusion',
        'Clinical examination documenting complete loss of spinal motion',
        'Inability to perform basic activities of daily living',
      ],
    },
    {
      percent: 50,
      summary: 'Unfavorable ankylosis of the entire thoracolumbar spine',
      criteriaDescription: [
        'Complete fusion of the low and mid back in unfavorable position',
        'Severe limitation of mobility',
      ],
      evidenceNeeded: [
        'Imaging showing thoracolumbar ankylosis',
        'Clinical ROM measurements showing no motion',
        'Documentation of significant functional impairment',
      ],
    },
    {
      percent: 40,
      summary: 'Forward flexion of thoracolumbar spine 30 degrees or less, OR favorable ankylosis',
      criteriaDescription: [
        'Forward flexion 30° or less (normal is 90°)',
        'OR complete fusion in favorable (functional) position',
        'Significant but manageable limitation',
      ],
      evidenceNeeded: [
        'Range of motion measurements by healthcare provider',
        'Goniometer readings documenting limitation',
        'Consistent documentation over time',
      ],
    },
    {
      percent: 20,
      summary: 'Forward flexion 30-60 degrees, OR muscle spasm/guarding causing abnormal gait/spinal contour',
      criteriaDescription: [
        'Forward flexion between 30-60° (vs normal 90°)',
        'OR combined ROM 120° or less (vs normal 240°)',
        'OR muscle spasm severe enough to cause abnormal gait, scoliosis, or abnormal curvature',
      ],
      evidenceNeeded: [
        'ROM measurements showing limitation',
        'Clinical notes documenting muscle spasm or guarding',
        'Observation of abnormal gait or spinal contour',
        'Functional impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Forward flexion 60-85 degrees, OR localized tenderness not causing abnormal gait',
      criteriaDescription: [
        'Forward flexion between 60-85° (vs normal 90°)',
        'OR combined ROM 120-235° (vs normal 240°)',
        'OR muscle spasm/guarding/tenderness without abnormal gait',
        'OR vertebral fracture with 50%+ height loss',
      ],
      evidenceNeeded: [
        'ROM measurements in the specified range',
        'Clinical examination notes',
        'Documentation of pain and functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'Mild limitation or symptoms controlled',
      criteriaDescription: [
        'Forward flexion greater than 85°',
        'Minimal functional impact',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    forwardFlexion: {
      term: 'Forward Flexion',
      definition: 'Bending forward at the waist. Normal is 90 degrees (touching toes). Measured by healthcare provider using goniometer.',
    },
    ankylosis: {
      term: 'Ankylosis',
      definition: 'Complete fusion or fixation of a joint/spine segment. "Favorable" means in a functional position; "unfavorable" means in a non-functional position.',
    },
    muscleSpasm: {
      term: 'Muscle Spasm/Guarding',
      definition: 'Involuntary muscle contraction or protective muscle tensing. Severe enough to cause abnormal walking pattern or visible spinal curvature.',
    },
  },
};

// ============================================
// INTERVERTEBRAL DISC SYNDROME (DC 5243)
// ============================================

export const INTERVERTEBRAL_DISC_CRITERIA = {
  diagnosticCode: '5243',
  condition: 'Intervertebral Disc Syndrome',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5243',

  note: 'Assigned only when there is disc herniation with compression/irritation of adjacent nerve root. Evaluated either under General Rating Formula for Spine OR based on Incapacitating Episodes, whichever is higher.',

  ratingsIncapacitatingEpisodes: [
    {
      percent: 60,
      summary: '6+ weeks of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration of incapacitating episodes: 6 weeks or more in past year',
        'Episodes require bed rest prescribed by physician',
        'Episodes require treatment by physician',
      ],
      evidenceNeeded: [
        'Medical records documenting each incapacitating episode',
        'Physician notes prescribing bed rest',
        'Treatment records for each episode',
        'Clear documentation of episode duration',
      ],
    },
    {
      percent: 40,
      summary: '4-6 weeks (but less than 6) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 4 weeks to less than 6 weeks in past year',
        'Requires physician-prescribed bed rest and treatment',
      ],
      evidenceNeeded: [
        'Documentation of each episode',
        'Physician orders for bed rest',
        'Treatment records',
      ],
    },
    {
      percent: 20,
      summary: '2-4 weeks (but less than 4) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 2 weeks to less than 4 weeks in past year',
        'Physician-prescribed bed rest and treatment required',
      ],
      evidenceNeeded: [
        'Episode documentation',
        'Bed rest orders',
        'Treatment records',
      ],
    },
    {
      percent: 10,
      summary: '1-2 weeks (but less than 2) of incapacitating episodes in past 12 months',
      criteriaDescription: [
        'Total duration: 1 week to less than 2 weeks in past year',
        'Physician-prescribed bed rest and treatment',
      ],
      evidenceNeeded: [
        'Episode documentation',
        'Physician orders',
        'Treatment records',
      ],
    },
  ],

  // Can also be rated under General Rating Formula for Spine (same as DC 5237)
  ratingsGeneralFormula: LUMBOSACRAL_STRAIN_CRITERIA.ratings,

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode',
      definition: 'A period of acute signs and symptoms due to disc syndrome that requires bed rest prescribed by a physician AND treatment by a physician. Both requirements must be met.',
      emphasis: 'CRITICAL: Episodes are only counted if BOTH bed rest was prescribed AND treatment was provided by a physician.',
    },
    discHerniation: {
      term: 'Disc Herniation',
      definition: 'Bulging or rupture of the intervertebral disc causing compression or irritation of the adjacent nerve root. Must be confirmed by imaging (MRI/CT).',
    },
  },
};

// ============================================
// KNEE INSTABILITY (DC 5257)
// ============================================

export const KNEE_INSTABILITY_CRITERIA = {
  diagnosticCode: '5257',
  condition: 'Knee, Other Impairment (Instability)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5257',

  ratings: [
    {
      percent: 30,
      summary: 'Unrepaired/failed complete ligament tear + medical provider prescribes BOTH assistive device AND bracing',
      criteriaDescription: [
        'Complete ligament tear (unrepaired OR failed repair)',
        'Causing persistent instability',
        'Medical provider prescribes BOTH:',
        '  - Assistive device (cane, crutches, or walker) for ambulation',
        '  - AND knee brace for ambulation',
      ],
      evidenceNeeded: [
        'MRI or surgical records confirming complete ligament tear',
        'Documentation of failed repair (if applicable)',
        'Written prescription for assistive device',
        'Written prescription for knee brace',
        'Clinical notes documenting persistent instability',
      ],
    },
    {
      percent: 20,
      summary: 'Ligament injury + prescribed brace OR assistive device (but not both)',
      criteriaDescription: [
        'Sprain, incomplete tear, OR repaired complete tear causing persistent instability',
        'Medical provider prescribes brace OR assistive device',
        'OR: Unrepaired/failed complete tear + prescribed brace OR device (but not both)',
      ],
      evidenceNeeded: [
        'Imaging/surgical documentation of ligament injury',
        'Prescription for either brace OR assistive device',
        'Clinical documentation of instability',
      ],
    },
    {
      percent: 10,
      summary: 'Ligament injury with persistent instability, no prescription for brace/device required',
      criteriaDescription: [
        'Sprain, incomplete tear, OR complete tear (any repair status)',
        'Causing persistent instability',
        'No requirement for prescribed brace or assistive device',
      ],
      evidenceNeeded: [
        'Documentation of ligament injury',
        'Clinical examination showing instability',
        'Functional limitations documented',
      ],
    },
  ],

  definitions: {
    completeLigamentTear: {
      term: 'Complete Ligament Tear',
      definition: 'Full-thickness rupture of ligament (typically ACL, PCL, MCL, or LCL). Confirmed by MRI or surgical findings.',
    },
    persistentInstability: {
      term: 'Persistent Instability',
      definition: 'Ongoing knee giving way, buckling, or feeling unstable despite treatment. Documented by clinical examination showing positive instability tests (Lachman, drawer, etc.).',
    },
    assistiveDevice: {
      term: 'Assistive Device',
      definition: 'Cane(s), crutch(es), or walker prescribed by medical provider to aid in walking.',
    },
  },
};

// ============================================
// HYPERTENSION (DC 7101)
// ============================================

export const PLANTAR_FASCIITIS_CRITERIA = {
  diagnosticCode: '5276',
  condition: 'Plantar Fasciitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5276',

  ratings: [
    {
      percent: 30,
      summary: 'Bilateral severe plantar fasciitis with marked limitation of weight-bearing',
      criteria: {
        bilateral: true,
        severe: true,
        markedLimitation: true,
      },
      criteriaDescription: [
        'Severe plantar fasciitis affecting both feet',
        'Marked limitation of weight-bearing',
        'Significant functional impairment',
        'Unable to stand or walk for extended periods',
      ],
      evidenceNeeded: [
        'Document pain in both feet',
        'Log episodes affecting ability to walk/stand',
        'Track morning pain (first steps of day)',
        'Podiatry documentation if available',
      ],
    },
    {
      percent: 20,
      summary: 'Unilateral severe or bilateral moderate plantar fasciitis',
      criteria: {
        severe: true,
        functionalImpairment: true,
      },
      criteriaDescription: [
        'Severe plantar fasciitis in one foot, OR',
        'Moderate plantar fasciitis in both feet',
        'Noticeable functional limitation',
      ],
      evidenceNeeded: [
        'Log heel pain frequency',
        'Document impact on walking/standing',
        'Track pain with activity',
        'Note relief with rest',
      ],
    },
    {
      percent: 10,
      summary: 'Unilateral moderate or mild bilateral plantar fasciitis',
      criteria: {
        moderate: true,
        someImpairment: true,
      },
      criteriaDescription: [
        'Moderate pain in one foot, OR',
        'Mild pain in both feet',
        'Some functional limitation',
      ],
      evidenceNeeded: [
        'Regular logging of heel/arch pain',
        'Document morning pain',
        'Track duration of symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Diagnosed but minimal symptoms or well-controlled',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Symptoms controlled with orthotics/treatment',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    plantarFasciitis: {
      term: 'Plantar Fasciitis',
      definition: 'Inflammation of the thick band of tissue (plantar fascia) that runs across the bottom of the foot, connecting heel to toes.',
      examples: [
        'Sharp heel pain with first steps in morning',
        'Pain after standing or sitting for long periods',
        'Pain improves with movement but returns after rest',
        'Tenderness on bottom of heel',
      ],
    },
    morningPain: {
      term: 'Morning Pain',
      definition: 'Characteristic sharp pain in heel with first steps of the day. Often the most severe symptom of plantar fasciitis.',
      examples: [
        'Stabbing pain when getting out of bed',
        'Pain improves after walking around',
        'Returns after sitting for extended periods',
      ],
    },
    bilateral: {
      term: 'Bilateral Plantar Fasciitis',
      definition: 'Plantar fasciitis affecting both feet. Higher ratings require bilateral involvement.',
      examples: [
        'Pain in both heels',
        'Morning stiffness in both feet',
        'Difficulty walking due to pain in both feet',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged plantar fasciitis symptoms. VA rating requires podiatry examination and documentation of bilateral involvement and functional limitation. Conservative treatment (orthotics, stretching, NSAIDs) should be documented.',
};

// ============================================
// SINUSITIS RATING CRITERIA (DC 6510)
// ============================================

export const SHOULDER_CRITERIA = {
  diagnosticCode: '5201-5203',
  condition: 'Shoulder Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5201-5203',

  ratings: [
    {
      percent: 40,
      summary: 'Shoulder or arm, with severe limitation of motion (frozen shoulder)',
      criteria: {
        severeLimit: true,
        frozenShoulder: true,
      },
      criteriaDescription: [
        'Frozen shoulder or severe limitation',
        'Significant functional impairment',
        'ROM <90 degrees forward elevation or abduction',
      ],
      evidenceNeeded: [
        'Document severe pain limiting movement',
        'Track episodes preventing overhead reach',
        'Note difficulty with daily activities (dressing, reaching)',
        'ROM measurements if available',
      ],
    },
    {
      percent: 30,
      summary: 'Shoulder or arm, with moderate limitation of motion',
      criteria: {
        moderateLimit: true,
      },
      criteriaDescription: [
        'Moderate limitation of shoulder motion',
        'ROM 90-120 degrees forward elevation',
        'Noticeable functional impact',
      ],
      evidenceNeeded: [
        'Log pain with overhead activities',
        'Document limited range episodes',
        'Track impact on work/daily tasks',
      ],
    },
    {
      percent: 20,
      summary: 'Shoulder or arm, with slight to moderate limitation of motion',
      criteria: {
        slightLimit: true,
      },
      criteriaDescription: [
        'Slight to moderate limitation',
        'ROM 120-160 degrees',
        'Some functional limitation',
      ],
      evidenceNeeded: [
        'Regular pain episodes',
        'Document activities causing pain',
        'Track frequency and severity',
      ],
    },
    {
      percent: 10,
      summary: 'Shoulder or arm, with slight impairment or recurrent instability',
      criteria: {
        slightImpairment: true,
        recurrentInstability: true,
      },
      criteriaDescription: [
        'Slight impairment of function',
        'OR recurrent shoulder dislocations/subluxations',
        'Minimal but documented limitation',
      ],
      evidenceNeeded: [
        'Log pain episodes',
        'Document instability if present',
        'Track any giving way or weakness',
      ],
    },
    {
      percent: 0,
      summary: 'No significant limitation',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Full or near-full range of motion',
        'Minimal pain',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    rangeOfMotion: {
      term: 'Shoulder Range of Motion (ROM)',
      definition: 'Measured in degrees of forward elevation and abduction. Normal is 180 degrees; severe limitation is <90 degrees.',
      examples: [
        'Cannot raise arm above shoulder level (<90°)',
        'Difficulty reaching overhead (90-120°)',
        'Some limitation but can reach most areas (120-160°)',
        'Near-normal motion (160-180°)',
      ],
    },
    frozenShoulder: {
      term: 'Frozen Shoulder (Adhesive Capsulitis)',
      definition: 'Severe stiffness and pain in shoulder joint making movement very difficult or impossible.',
      examples: [
        'Cannot lift arm to comb hair',
        'Severe pain prevents reaching',
        'Stiffness limits all directions of movement',
      ],
    },
    instability: {
      term: 'Shoulder Instability',
      definition: 'Shoulder joint slides partially or completely out of position (subluxation or dislocation).',
      examples: [
        'Shoulder "pops out" with certain movements',
        'Feeling of shoulder about to dislocate',
        'History of multiple dislocations',
        'Apprehension with overhead activities',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged shoulder symptoms. VA rating requires orthopedic examination with ROM measurements. Higher ratings require documented ROM limitations in specific planes (forward elevation, abduction, internal/external rotation).',
};

// ============================================
// HIP CONDITIONS RATING CRITERIA (DC 5252-5255)
// ============================================

export const HIP_CRITERIA = {
  diagnosticCode: '5252-5255',
  condition: 'Hip Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5252-5255',

  ratings: [
    {
      percent: 60,
      summary: 'Hip ankylosis (fusion) in favorable position',
      criteria: {
        ankylosis: true,
        favorablePosition: true,
      },
      criteriaDescription: [
        'Complete ankylosis (fusion) of hip joint',
        'In favorable position for function',
      ],
      evidenceNeeded: [
        'Surgical records of hip fusion',
        'X-ray showing fusion',
        'Complete lack of hip motion',
      ],
    },
    {
      percent: 50,
      summary: 'Hip ankylosis in unfavorable position or with muscle atrophy',
      criteria: {
        ankylosis: true,
        unfavorablePosition: true,
      },
      criteriaDescription: [
        'Complete fusion in poor position, OR',
        'Ankylosis with muscle atrophy/weakness',
      ],
      evidenceNeeded: [
        'Imaging showing fusion',
        'Clinical documentation of position',
        'Muscle atrophy if present',
      ],
    },
    {
      percent: 40,
      summary: 'Hip with marked limitation of motion and severe pain',
      criteria: {
        markedLimitation: true,
        severePain: true,
      },
      criteriaDescription: [
        'Marked limitation of hip motion',
        'Severe pain with movement',
        'Significant functional impairment',
      ],
      evidenceNeeded: [
        'Frequent severe pain episodes',
        'Difficulty walking, climbing stairs',
        'Limited ROM measurements',
      ],
    },
    {
      percent: 30,
      summary: 'Hip with moderate limitation of motion',
      criteria: {
        moderateLimitation: true,
      },
      criteriaDescription: [
        'Moderate limitation of motion',
        'Moderate pain',
        'Noticeable functional limitation',
      ],
      evidenceNeeded: [
        'Regular pain with activity',
        'Document walking limitations',
        'Track stiffness and pain frequency',
      ],
    },
    {
      percent: 20,
      summary: 'Hip with slight to moderate limitation of motion',
      criteria: {
        slightLimitation: true,
      },
      criteriaDescription: [
        'Slight to moderate limitation',
        'Some pain with activity',
        'Mild functional impact',
      ],
      evidenceNeeded: [
        'Log hip pain episodes',
        'Document activities causing pain',
        'Track any limping or gait changes',
      ],
    },
    {
      percent: 10,
      summary: 'Hip with slight limitation or mild symptoms',
      criteria: {
        mild: true,
      },
      criteriaDescription: [
        'Slight limitation of motion',
        'Mild intermittent pain',
        'Minimal functional impact',
      ],
      evidenceNeeded: [
        'Document pain episodes',
        'Track frequency and triggers',
      ],
    },
    {
      percent: 0,
      summary: 'No significant limitation',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Normal or near-normal ROM',
        'Minimal pain',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    ankylosis: {
      term: 'Hip Ankylosis',
      definition: 'Complete fusion or immobility of the hip joint, either from disease, injury, or surgical fusion.',
      examples: [
        'Hip joint does not move at all',
        'Surgical hip fusion',
        'Complete stiffness from arthritis',
      ],
    },
    hipROM: {
      term: 'Hip Range of Motion',
      definition: 'Movement of hip in flexion, extension, abduction, adduction, and rotation. Normal flexion is 120-125 degrees.',
      examples: [
        'Difficulty bending forward to tie shoes (flexion)',
        'Cannot spread legs apart (abduction)',
        'Pain with rotation (internal/external rotation)',
        'Stiffness limiting walking stride',
      ],
    },
    functionalImpairment: {
      term: 'Hip Functional Impairment',
      definition: 'Impact on daily activities: walking, climbing stairs, sitting, getting in/out of car, standing from seated position.',
      examples: [
        'Difficulty walking long distances',
        'Pain climbing stairs',
        'Limping or altered gait',
        'Cannot sit for extended periods',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged hip symptoms. VA rating requires orthopedic examination with ROM measurements and functional assessment. X-rays showing degenerative changes strengthen claims.',
};

// ============================================
// ANKLE AND ACHILLES TENDON CONDITIONS
// DC 5270-5274 - 38 CFR 4.71a
// ============================================


export const ANKLE_ACHILLES_CRITERIA = {
  diagnosticCode: '5270-5274',
  condition: 'Ankle Joint, Tarsal Joint, Talus and Heel Bones, Achilles Tendon',
  cfrReference: '38 CFR 4.71a (Musculoskeletal System)',

  ratings: [
    {
      percent: 40,
      summary: 'Ankle frozen in place and cannot be moved, OR frozen in dorsiflexion >40°, plantar flexion >10°, or inversion/eversion',
      criteria: {
        ankleAnkylosis: true,
        dorsiflexionDegrees: [41, 90],
        plantarFlexionDegrees: [11, 90],
      },
      criteriaDescription: [
        'Ankle joint is frozen in place and cannot be moved (ankylosis), OR',
        'Frozen in dorsiflexion more than 40°, OR',
        'Frozen in plantar flexion more than 10°, OR',
        'Frozen in inversion, eversion, or outward rotation',
      ],
      evidenceNeeded: [
        'Range of motion measurements by healthcare provider',
        'Documentation of ankylosis (frozen joint)',
        'X-ray or imaging showing joint fusion or severe limitation',
      ],
    },
    {
      percent: 30,
      summary: 'Frozen in plantar flexion 30-40° OR dorsiflexion 0-10°',
      criteria: {
        plantarFlexionDegrees: [30, 40],
        dorsiflexionDegrees: [0, 10],
      },
      criteriaDescription: [
        'Frozen in plantar flexion between 30° and 40°, OR',
        'Frozen in dorsiflexion between 0° and 10°',
      ],
      evidenceNeeded: [
        'Goniometer measurements of ankle ROM',
        'Medical documentation of frozen position',
      ],
    },
    {
      percent: 20,
      summary: 'Frozen in plantar flexion <30°, OR limited motion (0-20° dorsiflexion AND 0-30° plantar flexion), OR dorsiflexion <5° or plantar flexion <10°',
      criteria: {
        plantarFlexionDegrees: [0, 29],
        limitedMotion: true,
        dorsiflexionLess5: true,
        plantarFlexionLess10: true,
      },
      criteriaDescription: [
        'Frozen in plantar flexion less than 30°, OR',
        'Limited motion: 0° to 20° dorsiflexion AND 0° to 30° plantar flexion, OR',
        'Dorsiflexion less than 5° or plantar flexion less than 10°',
        'Tarsal joint frozen in poor weight-bearing position (walking difficult)',
      ],
      evidenceNeeded: [
        'Range of motion measurements',
        'Documentation of functional limitations',
        'Statement about impact on walking/weight-bearing',
      ],
    },
    {
      percent: 10,
      summary: 'Dorsiflexion <15° or plantar flexion <30°, OR can straighten to 10°',
      criteria: {
        dorsiflexionDegrees: [0, 14],
        plantarFlexionDegrees: [0, 29],
        straightenTo10: true,
      },
      criteriaDescription: [
        'Dorsiflexion less than 15° or plantar flexion less than 30°, OR',
        'Can straighten to 10°',
        'Tarsal joint frozen in good weight-bearing position (walking still easy)',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'Functional assessment',
      ],
    },
    {
      percent: 0,
      summary: 'Can straighten to 5° or minimal limitation with minimal impact on function',
      criteria: {
        straightenTo5: true,
      },
      criteriaDescription: [
        'Can straighten to 5°',
        'Some limitation but minimal impact on function',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    dorsiflexion: {
      term: 'Dorsiflexion',
      definition: 'Upward movement of the foot (toes pointing toward shin). Normal range is approximately 20°.',
      examples: [
        'Standing and pulling your toes up toward your knee',
      ],
    },
    plantarFlexion: {
      term: 'Plantar Flexion',
      definition: 'Downward movement of the foot (pointing toes). Normal range is approximately 50°.',
      examples: [
        'Standing on your tiptoes or pushing a car pedal',
      ],
    },
    ankylosis: {
      term: 'Ankylosis',
      definition: 'Abnormal stiffening and immobility of a joint due to fusion of the bones. The joint is "frozen" in place.',
      examples: [
        'Complete inability to move the ankle joint in any direction',
      ],
    },
    goniometer: {
      term: 'Goniometer',
      definition: 'Medical device used to measure the range of motion of a joint in degrees. Essential for accurate VA rating.',
      examples: [
        'Healthcare provider uses this tool during C&P exam to measure exact ankle ROM',
      ],
    },
  },

  note: 'Ankle conditions require precise range of motion measurements. Use a goniometer if possible or have measurements taken by a healthcare provider. Document pain levels during weight-bearing activities and any use of assistive devices (ankle braces, crutches, cane).',

  disclaimer: 'Based on 38 CFR 4.71a, Diagnostic Codes 5270-5274 (Ankle Joint, Tarsal Joint, Talus and Heel Bones). For documentation purposes only. The VA makes all final rating determinations.',
};

// ============================================
// HIP AND THIGH CONDITIONS
// §4.71a Musculoskeletal System - 38 CFR Part 4
// ============================================


export const HIP_THIGH_CRITERIA = {
  diagnosticCode: '5250-5255',
  condition: 'Hip and Thigh (Limitation of Motion, Ankylosis, Muscle Injury)',
  cfrReference: '38 CFR Part 4, §4.71a (Musculoskeletal System)',

  ratings: [
    {
      percent: 90,
      summary: 'Hip frozen so foot cannot reach ground, crutches required',
      criteria: {
        hipAnkylosis: true,
        footCannotReachGround: true,
        crutchesRequired: true,
      },
      criteriaDescription: [
        'Hip is frozen in place',
        'Foot cannot reach the ground',
        'Crutches must be used and are prescribed',
      ],
      evidenceNeeded: [
        'Medical documentation of hip ankylosis',
        'Statement that foot cannot reach ground when standing',
        'Prescription for crutches or documentation of required use',
      ],
    },
    {
      percent: 80,
      summary: 'Hip bone completely broken through causing loose/erratic leg motion, OR hip moves too far (unstable/easily dislocated)',
      criteria: {
        femurCompleteFracture: true,
        errlegmotion: true,
        hipInstability: true,
        hipDislocation: true,
      },
      criteriaDescription: [
        'Either hip bone (femur or femoral neck) is completely broken through',
        'Causes loose or erratic leg motion, OR',
        'Hip moves significantly too far in any direction',
        'Hip is unstable or can be easily dislocated',
      ],
      evidenceNeeded: [
        'X-rays showing complete fracture or nonunion',
        'Documentation of abnormal hip motion',
        'Medical records of hip instability or recurrent dislocation',
      ],
    },
    {
      percent: 70,
      summary: 'Hip frozen at >40° but foot can reach ground, crutches not required',
      criteria: {
        hipAnkylosis: true,
        flexionDegrees: [41, 90],
        footCanReachGround: true,
      },
      criteriaDescription: [
        'Hip frozen at more than 40° flexion',
        'Foot can reach the ground',
        'Crutches are not required',
      ],
      evidenceNeeded: [
        'ROM measurements showing hip frozen >40°',
        'Functional assessment showing independent ambulation',
      ],
    },
    {
      percent: 60,
      summary: 'Hip frozen in favorable position (20-40° flexion) with small amount of abduction/adduction, OR hip bone broken but leg motion not loose',
      criteria: {
        hipAnkylosis: true,
        flexionDegrees: [20, 40],
        favorablePosition: true,
        femurFracture: true,
        stableWithSupport: true,
      },
      criteriaDescription: [
        'Frozen in "favorable" position (20°-40° flexion)',
        'Small amount of abduction or adduction possible',
        'This is the best position for frozen hip to support weight, OR',
        'Either bone broken through but leg motion is not loose',
        'Leg can support weight with prescription support and false joint',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'X-rays showing fracture with stable pseudoarthrosis',
        'Documentation of assistive devices used',
      ],
    },
    {
      percent: 40,
      summary: 'Cannot move leg more than 10° (flexion)',
      criteria: {
        hipFlexionDegrees: [0, 10],
      },
      criteriaDescription: [
        'Cannot move the leg more than 10° in flexion (forward)',
      ],
      evidenceNeeded: [
        'Goniometer measurements of hip flexion',
        'Medical documentation of severe limitation',
      ],
    },
    {
      percent: 30,
      summary: 'Cannot raise leg more than 20°',
      criteria: {
        hipFlexionDegrees: [0, 20],
      },
      criteriaDescription: [
        'Cannot raise the leg more than 20°',
      ],
      evidenceNeeded: [
        'Hip flexion ROM measurements',
      ],
    },
    {
      percent: 20,
      summary: 'Cannot raise leg >30°, OR cannot swing leg out (abduction) >10°',
      criteria: {
        hipFlexionDegrees: [0, 30],
        hipAbductionDegrees: [0, 10],
      },
      criteriaDescription: [
        'Cannot raise the leg more than 30°, OR',
        'The hip cannot swing the leg out to the side (abduction) more than 10°',
      ],
      evidenceNeeded: [
        'Hip flexion and abduction ROM measurements',
      ],
    },
    {
      percent: 10,
      summary: 'Cannot raise leg >45°, OR cannot move leg inward (adduction), OR cannot rotate leg outward >15°',
      criteria: {
        hipFlexionDegrees: [0, 45],
        hipAdduction: false,
        hipExternalRotationDegrees: [0, 15],
      },
      criteriaDescription: [
        'Cannot raise the leg more than 45°, OR',
        'Cannot move the leg inward across the other leg (adduction), OR',
        'Cannot rotate the leg outward (free point of the sides) more than 15°',
      ],
      evidenceNeeded: [
        'Comprehensive hip ROM measurements (flexion, adduction, rotation)',
      ],
    },
  ],

  definitions: {
    hipFlexion: {
      term: 'Hip Flexion',
      definition: 'Forward movement of the thigh toward the chest. Normal range is approximately 120°.',
      examples: [
        'Raising your knee toward your chest while standing',
        'Climbing stairs',
      ],
    },
    hipAbduction: {
      term: 'Hip Abduction',
      definition: 'Moving the leg away from the midline of the body (outward). Normal range is approximately 45°.',
      examples: [
        'Spreading your legs apart while standing',
      ],
    },
    hipAdduction: {
      term: 'Hip Adduction',
      definition: 'Moving the leg toward and across the midline of the body (inward). Normal range is approximately 30°.',
      examples: [
        'Crossing your legs while sitting or standing',
      ],
    },
    hipRotation: {
      term: 'Hip Rotation (Internal/External)',
      definition: 'Rotating the leg inward or outward. Normal internal rotation is ~45°, external rotation is ~45°.',
      examples: [
        'Turning your toes inward (internal) or outward (external) while lying down',
      ],
    },
    ankylosis: {
      term: 'Ankylosis',
      definition: 'Abnormal stiffening and immobility of a joint due to fusion of the bones. The joint is "frozen" in position.',
      examples: [
        'Complete inability to move the hip joint',
      ],
    },
  },

  note: 'Hip conditions can be rated THREE times if the hip is limited in flexion, extension AND abduction. Include flare-ups in your claim with date, duration, and other symptoms. Document interference with work, social activities including family, and quality of life. Track impact on daily activities (stairs, walking distance, sitting, standing).',

  disclaimer: 'Based on 38 CFR Part 4, §4.71a Musculoskeletal System. For documentation purposes only. The VA makes all final rating determinations.',
};

// ============================================
// ANKLE CONDITIONS RATING CRITERIA (DC 5270-5271)
// ============================================

export const ANKLE_CRITERIA = {
  diagnosticCode: '5270-5271',
  condition: 'Ankle Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5270-5271',

  ratings: [
    {
      percent: 40,
      summary: 'Ankle ankylosis in plantar flexion >40° or dorsiflexion >10° with deformity',
      criteria: {
        ankylosis: true,
        severePosition: true,
      },
      criteriaDescription: [
        'Complete ankylosis (fusion) of ankle',
        'Plantar flexion at more than 40°, OR',
        'Dorsiflexion at more than 10°, OR',
        'With abduction, adduction, inversion or eversion deformity',
      ],
      evidenceNeeded: [
        'Surgical fusion records',
        'X-ray showing complete fusion',
        'Orthopedic exam documenting position',
      ],
    },
    {
      percent: 30,
      summary: 'Ankle ankylosis in plantar flexion 30-40° or dorsiflexion 0-10°',
      criteria: {
        ankylosis: true,
        moderatePosition: true,
      },
      criteriaDescription: [
        'Complete ankle ankylosis',
        'Plantar flexion between 30° and 40°, OR',
        'Dorsiflexion between 0° and 10°',
      ],
      evidenceNeeded: [
        'Documentation of complete fusion',
        'Position measurement by orthopedist',
      ],
    },
    {
      percent: 20,
      summary: 'Ankle ankylosis in plantar flexion <30° OR marked limited motion',
      criteria: {
        ankylosisOrMarked: true,
      },
      criteriaDescription: [
        'Ankle ankylosis in plantar flexion less than 30°, OR',
        'Marked limitation of motion: less than 5° dorsiflexion or less than 10° plantar flexion',
      ],
      evidenceNeeded: [
        'ROM measurements showing marked limitation',
        'Frequent severe pain episodes',
        'Significant functional limitations',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate limitation of ankle motion',
      criteria: {
        moderateLimitation: true,
      },
      criteriaDescription: [
        'Moderate limitation of motion',
        'Less than 15° dorsiflexion, OR',
        'Less than 30° plantar flexion',
      ],
      evidenceNeeded: [
        'Document ankle pain episodes',
        'Track ROM limitations',
        'Note functional impact (walking, stairs)',
      ],
    },
    {
      percent: 0,
      summary: 'Minimal symptoms or normal motion',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Normal or near-normal ROM',
        'Minimal pain or symptoms',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    ankylosis: {
      term: 'Ankle Ankylosis',
      definition: 'Complete fusion or immobility of the ankle joint, from disease, injury, or surgical fusion.',
      examples: [
        'Ankle joint does not move at all',
        'Surgical ankle fusion (arthrodesis)',
        'Complete stiffness from severe arthritis',
      ],
    },
    ankleROM: {
      term: 'Ankle Range of Motion',
      definition: 'Normal ankle ROM is 0-20° dorsiflexion (foot up) and 0-45° plantar flexion (foot down).',
      examples: [
        'Difficulty pulling foot upward (dorsiflexion)',
        'Cannot point toes down fully (plantar flexion)',
        'Pain with ankle movement in any direction',
      ],
    },
    markedLimitation: {
      term: 'Marked Limitation',
      definition: 'Less than 5° dorsiflexion OR less than 10° plantar flexion - severe restriction of motion.',
    },
    moderateLimitation: {
      term: 'Moderate Limitation',
      definition: 'Less than 15° dorsiflexion OR less than 30° plantar flexion.',
    },
  },

  disclaimer: 'This analysis is based on logged ankle symptoms. VA rating requires orthopedic examination with goniometer ROM measurements. X-rays showing degenerative changes or fusion strengthen claims.',
};

// ============================================
// WRIST CONDITIONS RATING CRITERIA (DC 5214-5215)
// ============================================

export const WRIST_CRITERIA = {
  diagnosticCode: '5214-5215',
  condition: 'Wrist Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5214-5215',

  // Note: Wrist ratings differ for dominant (major) vs non-dominant (minor) hand
  majorMinorNote: 'Ratings shown are for dominant hand. Non-dominant hand ratings are 10% lower for ankylosis ratings (50→40, 40→30, 30→20). Limitation of motion is 10% regardless of hand dominance.',

  ratings: [
    {
      percent: 50,
      summary: 'Unfavorable wrist ankylosis (dominant hand)',
      criteria: {
        ankylosis: true,
        unfavorable: true,
        dominantHand: true,
      },
      criteriaDescription: [
        'Complete ankylosis of wrist',
        'In any degree of palmar flexion, OR',
        'With ulnar or radial deviation',
        '(40% for non-dominant hand)',
      ],
      evidenceNeeded: [
        'Surgical fusion records',
        'X-ray confirming fusion',
        'Orthopedic documentation of position',
        'Document which hand is dominant',
      ],
    },
    {
      percent: 40,
      summary: 'Wrist ankylosis in other unfavorable position (dominant)',
      criteria: {
        ankylosis: true,
        otherPosition: true,
      },
      criteriaDescription: [
        'Complete ankylosis',
        'Any position except favorable',
        '(30% for non-dominant hand)',
      ],
      evidenceNeeded: [
        'Documentation of fusion',
        'Position measurement',
      ],
    },
    {
      percent: 30,
      summary: 'Favorable wrist ankylosis in 20-30° dorsiflexion (dominant)',
      criteria: {
        ankylosis: true,
        favorable: true,
      },
      criteriaDescription: [
        'Complete ankylosis in favorable position',
        '20° to 30° dorsiflexion',
        '(20% for non-dominant hand)',
      ],
      evidenceNeeded: [
        'Documentation of fusion',
        'Position in functional range',
      ],
    },
    {
      percent: 10,
      summary: 'Limited wrist motion: dorsiflexion <15° OR palmar flexion in line with forearm',
      criteria: {
        limitedMotion: true,
      },
      criteriaDescription: [
        'Dorsiflexion less than 15°, OR',
        'Palmar flexion limited in line with forearm',
        '(Same rating for either hand)',
      ],
      evidenceNeeded: [
        'ROM measurements by healthcare provider',
        'Document pain and functional limitations',
        'Track activities affected',
      ],
    },
    {
      percent: 0,
      summary: 'Minimal symptoms or normal motion',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Normal or near-normal ROM',
        'Minimal symptoms',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    ankylosis: {
      term: 'Wrist Ankylosis',
      definition: 'Complete fusion or immobility of the wrist joint.',
      examples: [
        'Wrist does not bend at all',
        'Surgical wrist fusion',
        'Complete fusion from severe arthritis',
      ],
    },
    wristROM: {
      term: 'Wrist Range of Motion',
      definition: 'Normal wrist ROM is about 70° palmar flexion, 70° dorsiflexion (extension), 20° radial deviation, and 45° ulnar deviation.',
      examples: [
        'Cannot bend wrist up (extension)',
        'Cannot bend wrist down (flexion)',
        'Pain with wrist movement',
      ],
    },
    favorablePosition: {
      term: 'Favorable Position',
      definition: 'Wrist fused in 20° to 30° dorsiflexion - the functional position allowing grip.',
    },
    dominance: {
      term: 'Hand Dominance',
      definition: 'The hand you write with. Dominant hand injuries receive higher ratings for ankylosis.',
    },
  },

  disclaimer: 'This analysis is based on logged wrist symptoms. VA rating requires orthopedic examination with ROM measurements. Note whether condition affects dominant or non-dominant hand.',
};

// ============================================
// ELBOW CONDITIONS RATING CRITERIA (DC 5205-5207)
// ============================================

export const ELBOW_CRITERIA = {
  diagnosticCode: '5205-5207',
  condition: 'Elbow Conditions',
  cfrReference: '38 CFR 4.71a, Diagnostic Codes 5205-5207',

  majorMinorNote: 'Ratings shown are for dominant arm (major). Non-dominant (minor) arm ratings are typically 10% lower.',

  ratings: [
    {
      percent: 60,
      summary: 'Unfavorable elbow ankylosis <50° or complete supination/pronation loss (dominant)',
      criteria: {
        ankylosis: true,
        unfavorable: true,
      },
      criteriaDescription: [
        'Complete ankylosis at angle less than 50°, OR',
        'Complete loss of supination or pronation',
        '(50% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'Surgical fusion records',
        'X-ray confirming fusion',
        'Documentation of fixed angle',
      ],
    },
    {
      percent: 50,
      summary: 'Intermediate elbow ankylosis at 50-90° (dominant)',
      criteria: {
        ankylosis: true,
        intermediate: true,
      },
      criteriaDescription: [
        'Complete ankylosis',
        'At angle more than 90°, or between 70° and 50°',
        '(40% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'Documentation of fusion',
        'Position measurement',
      ],
    },
    {
      percent: 50,
      summary: 'Flexion limited to 45° (dominant)',
      criteria: {
        flexionLimited: true,
        to45: true,
      },
      criteriaDescription: [
        'Cannot bend elbow past 45°',
        'Severe limitation of flexion',
        '(40% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'Functional impact documentation',
      ],
    },
    {
      percent: 50,
      summary: 'Extension limited to 110° (dominant)',
      criteria: {
        extensionLimited: true,
        to110: true,
      },
      criteriaDescription: [
        'Cannot extend elbow past 110° (20° from straight)',
        'Severe extension limitation',
        '(40% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'Functional impact documentation',
      ],
    },
    {
      percent: 40,
      summary: 'Favorable elbow ankylosis at 70-90° (dominant) OR flexion to 55°',
      criteria: {
        ankylosis: true,
        favorable: true,
      },
      criteriaDescription: [
        'Complete ankylosis at favorable angle (70-90°), OR',
        'Flexion limited to 55°',
        '(30% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'Documentation of fusion or limitation',
        'Functional assessment',
      ],
    },
    {
      percent: 30,
      summary: 'Flexion limited to 70° OR extension limited to 90° (dominant)',
      criteria: {
        moderateLimitation: true,
      },
      criteriaDescription: [
        'Flexion limited to 70°, OR',
        'Extension limited to 90°',
        '(20% for non-dominant arm)',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'Pain documentation',
        'Functional impact',
      ],
    },
    {
      percent: 20,
      summary: 'Flexion limited to 90° OR extension limited to 75°',
      criteria: {
        mildModerateLimitation: true,
      },
      criteriaDescription: [
        'Flexion limited to 90°, OR',
        'Extension limited to 75°',
        '(Same for either arm)',
      ],
      evidenceNeeded: [
        'ROM measurements',
        'Document pain and limitations',
      ],
    },
    {
      percent: 10,
      summary: 'Flexion limited to 100° OR extension limited to 45-60°',
      criteria: {
        mildLimitation: true,
      },
      criteriaDescription: [
        'Flexion limited to 100°, OR',
        'Extension limited to 45° or 60°',
        '(Same for either arm)',
      ],
      evidenceNeeded: [
        'Log elbow pain episodes',
        'Document ROM limitations',
      ],
    },
    {
      percent: 0,
      summary: 'Minimal symptoms or normal motion',
      criteria: {
        minimal: true,
      },
      criteriaDescription: [
        'Flexion greater than 110°',
        'Extension limited to less than 45°',
        'Normal or near-normal function',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    ankylosis: {
      term: 'Elbow Ankylosis',
      definition: 'Complete fusion or immobility of the elbow joint.',
      examples: [
        'Elbow does not bend or straighten at all',
        'Surgical elbow fusion',
        'Complete stiffness from severe trauma',
      ],
    },
    elbowROM: {
      term: 'Elbow Range of Motion',
      definition: 'Normal elbow ROM is 0° extension (fully straight) to 145° flexion (fully bent). Normal pronation and supination each 80°.',
      examples: [
        'Cannot bend elbow fully (limited flexion)',
        'Cannot straighten elbow (limited extension)',
        'Cannot rotate forearm palm up (supination)',
        'Cannot rotate forearm palm down (pronation)',
      ],
    },
    favorableAngle: {
      term: 'Favorable Angle',
      definition: 'Elbow fused between 70° and 90° - the functional range for daily activities.',
    },
  },

  disclaimer: 'This analysis is based on logged elbow symptoms. VA rating requires orthopedic examination with ROM measurements. Note whether condition affects dominant or non-dominant arm.',
};

// ============================================
// DEGENERATIVE ARTHRITIS RATING CRITERIA (DC 5003)
// ============================================

export const DEGENERATIVE_ARTHRITIS_CRITERIA = {
  diagnosticCode: '5003',
  condition: 'Degenerative Arthritis (Osteoarthritis)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5003',

  ratingNote: 'Degenerative arthritis (DJD/OA) is typically rated based on limitation of motion of the affected joint(s). When limitation is noncompensable, X-ray evidence can support ratings.',

  ratings: [
    {
      percent: 20,
      summary: 'X-ray evidence in 2+ major joints with occasional incapacitating exacerbations',
      criteria: {
        xrayEvidence: true,
        multipleJoints: true,
        incapacitatingExacerbations: true,
      },
      criteriaDescription: [
        'X-ray evidence of arthritis involvement',
        '2 or more major joints OR 2+ minor joint groups',
        'With occasional incapacitating exacerbations',
        'When limitation of motion is noncompensable',
      ],
      evidenceNeeded: [
        'X-rays showing degenerative changes in multiple joints',
        'Document flare-ups requiring rest or unable to work',
        'Track frequency and severity of exacerbations',
        'Medical records of flare-up treatment',
      ],
    },
    {
      percent: 10,
      summary: 'X-ray evidence in 2+ major joints without incapacitating exacerbations',
      criteria: {
        xrayEvidence: true,
        multipleJoints: true,
      },
      criteriaDescription: [
        'X-ray evidence of arthritis involvement',
        '2 or more major joints OR 2+ minor joint groups',
        'Without incapacitating exacerbations',
        'When limitation of motion is noncompensable',
      ],
      evidenceNeeded: [
        'X-rays showing degenerative changes',
        'Document joint pain and stiffness',
        'Track morning stiffness duration',
      ],
    },
    {
      percent: 10,
      summary: 'Single major joint with noncompensable limitation and X-ray evidence',
      criteria: {
        singleJoint: true,
        limitationPresent: true,
      },
      criteriaDescription: [
        'Limitation of motion present but noncompensable',
        'Objectively confirmed (swelling, muscle spasm, or painful motion)',
        'For each major joint or group of minor joints affected',
      ],
      evidenceNeeded: [
        'Document painful motion',
        'X-ray showing degenerative changes',
        'Clinical exam findings',
      ],
    },
    {
      percent: 0,
      summary: 'Rate based on limitation of motion of specific joint',
      criteria: {
        rateUnderJoint: true,
      },
      criteriaDescription: [
        'When limitation of motion is compensable',
        'Rate under the specific joint diagnostic code',
        'E.g., knee (5260-5261), shoulder (5201), etc.',
      ],
      evidenceNeeded: [
        'Track symptoms under specific joint condition',
      ],
    },
  ],

  definitions: {
    majorJoints: {
      term: 'Major Joints',
      definition: 'For rating purposes: shoulder, elbow, wrist, hip, knee, and ankle.',
      examples: [
        'Shoulder joint',
        'Elbow joint',
        'Wrist joint',
        'Hip joint',
        'Knee joint',
        'Ankle joint',
      ],
    },
    minorJointGroups: {
      term: 'Minor Joint Groups',
      definition: 'Multiple small joints rated as groups: interphalangeal, metacarpal, carpal joints of hands; interphalangeal, metatarsal, tarsal joints of feet; cervical, thoracic, lumbar vertebrae.',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'A flare-up of arthritis symptoms severe enough to require rest, limit activities significantly, or seek medical treatment.',
      examples: [
        'Flare-up preventing work for a day or more',
        'Severe pain requiring bed rest',
        'Emergency or urgent care visit for joint pain',
        'Steroid injection or course of steroids for flare',
      ],
    },
    xrayEvidence: {
      term: 'X-Ray Evidence',
      definition: 'Radiographic findings showing degenerative changes: joint space narrowing, osteophytes (bone spurs), subchondral sclerosis, or cyst formation.',
    },
  },

  disclaimer: 'This analysis is based on logged arthritis symptoms. Degenerative arthritis is primarily rated on limitation of motion of specific joints. When ROM limitation is noncompensable, X-ray evidence can support 10-20% ratings. Always document which joints are affected.',
};

// ============================================
// PHASE 4A: GOUT RATING CRITERIA (DC 5017)
// Per 38 CFR 4.71a Note to DCs 5013-5024: Rated as degenerative arthritis
// ============================================

export const GOUT_CRITERIA = {
  diagnosticCode: '5017',
  condition: 'Gout',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5017',

  ratingNote: 'Per 38 CFR 4.71a Note to DCs 5013-5024: Gout is evaluated as degenerative arthritis, based on limitation of motion of affected parts. Gout differs from typical arthritis by having acute inflammatory attacks with periods of remission.',

  ratings: [
    {
      percent: 20,
      summary: 'X-ray evidence in 2+ joints with occasional incapacitating exacerbations (acute gout attacks)',
      criteriaDescription: [
        'Multiple joints affected by gout',
        'X-ray evidence showing gouty changes or tophi',
        'Occasional incapacitating exacerbations (acute gout attacks)',
        'When limitation of motion during attacks is noncompensable',
      ],
      evidenceNeeded: [
        'X-rays showing gouty changes (tophi, erosions)',
        'Document acute gout attacks (frequency, duration, severity)',
        'Track which joints are affected during each attack',
        'Medical records showing elevated uric acid levels',
        'Document flare-ups that limit work or daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'X-ray evidence in 2+ joints without incapacitating exacerbations',
      criteriaDescription: [
        'Multiple joints affected by gout',
        'X-ray evidence of gouty involvement',
        'Without incapacitating exacerbations',
        'Controlled with medication',
      ],
      evidenceNeeded: [
        'X-rays showing gouty changes',
        'Document gout attack history',
        'Uric acid lab values',
        'Medication records (colchicine, allopurinol, etc.)',
      ],
    },
    {
      percent: 10,
      summary: 'Single major joint with limitation of motion and gout diagnosis',
      criteriaDescription: [
        'Single joint (commonly big toe, ankle, or knee) affected',
        'Limitation of motion present but noncompensable',
        'Confirmed gout diagnosis',
      ],
      evidenceNeeded: [
        'Joint aspiration showing urate crystals (gold standard)',
        'Elevated serum uric acid levels',
        'Document attacks and recovery time',
      ],
    },
    {
      percent: 0,
      summary: 'If significant ROM limitation, rate under specific joint code',
      criteriaDescription: [
        'When limitation of motion is compensable',
        'Rate under the specific joint diagnostic code',
        'E.g., ankle (5271), knee (5260-5261), etc.',
      ],
      evidenceNeeded: [
        'Track symptoms under specific affected joint condition',
      ],
    },
  ],

  definitions: {
    acuteGoutAttack: {
      term: 'Acute Gout Attack',
      definition: 'Sudden onset of severe joint pain, swelling, redness, and warmth, typically reaching peak intensity within 12-24 hours. Most commonly affects the first metatarsophalangeal joint (big toe).',
      examples: [
        'Big toe attack (podagra)',
        'Ankle flare with severe swelling',
        'Knee attack preventing walking',
        'Wrist attack limiting hand function',
      ],
    },
    tophi: {
      term: 'Tophi',
      definition: 'Deposits of monosodium urate crystals that form lumps under the skin, typically in chronic gout. Can cause joint damage and deformity.',
    },
    hyperuricemia: {
      term: 'Hyperuricemia',
      definition: 'Elevated uric acid levels in the blood (typically >6.8 mg/dL), which predisposes to gout attacks.',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'Acute gout attack severe enough to prevent normal activity, require bed rest, or seek medical treatment.',
    },
  },

  disclaimer: 'Gout is rated under DC 5017 as degenerative arthritis per 38 CFR 4.71a. Acute attacks should be documented with date, affected joint(s), duration, and severity. Lab values (uric acid) and imaging strengthen claims.',
};

// ============================================
// PHASE 4A: BURSITIS RATING CRITERIA (DC 5019)
// Per 38 CFR 4.71a Note to DCs 5013-5024: Rated as degenerative arthritis
// ============================================

export const BURSITIS_CRITERIA = {
  diagnosticCode: '5019',
  condition: 'Bursitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5019',

  ratingNote: 'Per 38 CFR 4.71a Note to DCs 5013-5024: Bursitis is evaluated as degenerative arthritis, based on limitation of motion of affected parts. Common locations include shoulder (subacromial), elbow (olecranon), hip (trochanteric), knee (prepatellar, infrapatellar), and ankle.',

  ratings: [
    {
      percent: 20,
      summary: 'X-ray/imaging evidence in 2+ joints with occasional incapacitating exacerbations',
      criteriaDescription: [
        'Multiple joints affected by bursitis',
        'Imaging evidence showing bursitis (ultrasound, MRI)',
        'Occasional incapacitating exacerbations',
        'When limitation of motion is noncompensable',
      ],
      evidenceNeeded: [
        'Imaging (ultrasound/MRI) showing bursitis',
        'Document flare-ups that limit work or daily activities',
        'Track which joints/bursae are affected',
        'Medical records showing steroid injections or aspiration',
      ],
    },
    {
      percent: 10,
      summary: 'Imaging evidence in 2+ joints without incapacitating exacerbations',
      criteriaDescription: [
        'Multiple joints affected by bursitis',
        'Imaging evidence of bursitis',
        'Without incapacitating exacerbations',
        'Chronic but manageable symptoms',
      ],
      evidenceNeeded: [
        'Imaging showing bursitis in multiple locations',
        'Document pain patterns and triggers',
        'Physical therapy records',
      ],
    },
    {
      percent: 10,
      summary: 'Single major joint with limitation of motion and bursitis diagnosis',
      criteriaDescription: [
        'Single joint affected (shoulder, hip, knee, elbow, ankle)',
        'Limitation of motion present but noncompensable',
        'Confirmed bursitis diagnosis',
      ],
      evidenceNeeded: [
        'Physical exam findings (tenderness over bursa)',
        'Imaging showing fluid in bursa',
        'Document functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'If significant ROM limitation, rate under specific joint code',
      criteriaDescription: [
        'When limitation of motion is compensable',
        'Rate under the specific joint diagnostic code',
        'E.g., shoulder (5201), hip (5251-5253), knee (5260-5261)',
      ],
      evidenceNeeded: [
        'Track symptoms under specific affected joint condition',
      ],
    },
  ],

  definitions: {
    bursa: {
      term: 'Bursa',
      definition: 'Small fluid-filled sacs that cushion bones, tendons, and muscles near joints. When inflamed, they cause pain and limit motion.',
    },
    commonBursitisLocations: {
      term: 'Common Bursitis Locations',
      definition: 'Shoulder (subacromial/subdeltoid), elbow (olecranon), hip (trochanteric, iliopsoas), knee (prepatellar, infrapatellar, pes anserine), ankle (retrocalcaneal).',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'Bursitis flare-up severe enough to prevent normal activity, require rest, or seek medical treatment.',
    },
  },

  disclaimer: 'Bursitis is rated under DC 5019 as degenerative arthritis per 38 CFR 4.71a. Document which bursa/joint is affected, pain location, and functional limitations. Imaging (ultrasound/MRI) and injection records strengthen claims.',
};

// ============================================
// PHASE 4A: TENDINITIS/TENOSYNOVITIS RATING CRITERIA (DC 5024)
// Per 38 CFR 4.71a Note to DCs 5013-5024: Rated as degenerative arthritis
// ============================================

export const TENDINITIS_CRITERIA = {
  diagnosticCode: '5024',
  condition: 'Tendinitis/Tenosynovitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5024',

  ratingNote: 'Per 38 CFR 4.71a Note to DCs 5013-5024: Tendinitis, tenosynovitis, tendinosis, and tendinopathy are evaluated as degenerative arthritis, based on limitation of motion of affected parts. Common types include rotator cuff tendinitis, tennis elbow (lateral epicondylitis), golfer\'s elbow (medial epicondylitis), patellar tendinitis, and Achilles tendinitis.',

  ratings: [
    {
      percent: 20,
      summary: 'Imaging evidence in 2+ tendons/joints with occasional incapacitating exacerbations',
      criteriaDescription: [
        'Multiple tendons affected by tendinitis',
        'Imaging evidence showing tendon pathology (ultrasound, MRI)',
        'Occasional incapacitating exacerbations',
        'When limitation of motion is noncompensable',
      ],
      evidenceNeeded: [
        'Imaging (ultrasound/MRI) showing tendinitis, tendinosis, or tears',
        'Document flare-ups that limit work or daily activities',
        'Track which tendons are affected',
        'Medical records showing steroid injections or other treatments',
      ],
    },
    {
      percent: 10,
      summary: 'Imaging evidence in 2+ tendons/joints without incapacitating exacerbations',
      criteriaDescription: [
        'Multiple tendons affected by tendinitis',
        'Imaging evidence of tendon pathology',
        'Without incapacitating exacerbations',
        'Chronic but manageable symptoms',
      ],
      evidenceNeeded: [
        'Imaging showing tendinitis in multiple locations',
        'Document pain patterns and aggravating activities',
        'Physical therapy records',
      ],
    },
    {
      percent: 10,
      summary: 'Single major tendon with limitation of motion and tendinitis diagnosis',
      criteriaDescription: [
        'Single tendon/joint affected (shoulder, elbow, wrist, knee, ankle)',
        'Limitation of motion present but noncompensable',
        'Confirmed tendinitis diagnosis',
      ],
      evidenceNeeded: [
        'Physical exam findings (tenderness along tendon)',
        'Imaging showing tendon pathology',
        'Document functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'If significant ROM limitation, rate under specific joint code',
      criteriaDescription: [
        'When limitation of motion is compensable',
        'Rate under the specific joint diagnostic code',
        'E.g., shoulder (5201), elbow (5206-5207), wrist (5215)',
      ],
      evidenceNeeded: [
        'Track symptoms under specific affected joint condition',
      ],
    },
  ],

  definitions: {
    tendinitis: {
      term: 'Tendinitis',
      definition: 'Inflammation of a tendon, typically from overuse. Causes pain, tenderness, and mild swelling near a joint.',
    },
    tenosynovitis: {
      term: 'Tenosynovitis',
      definition: 'Inflammation of the tendon sheath (synovium surrounding the tendon). Common in wrists and fingers (De Quervain\'s tenosynovitis).',
    },
    tendinosis: {
      term: 'Tendinosis',
      definition: 'Chronic tendon degeneration without significant inflammation. Often results from long-term overuse or aging.',
    },
    commonTypes: {
      term: 'Common Types',
      definition: 'Rotator cuff tendinitis (shoulder), lateral epicondylitis (tennis elbow), medial epicondylitis (golfer\'s elbow), patellar tendinitis (jumper\'s knee), Achilles tendinitis.',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'Tendinitis flare-up severe enough to prevent normal activity, require rest, or seek medical treatment.',
    },
  },

  disclaimer: 'Tendinitis/tenosynovitis is rated under DC 5024 as degenerative arthritis per 38 CFR 4.71a. Document which tendon is affected, pain location, aggravating activities, and functional limitations. Imaging and treatment records strengthen claims.',
};

// ============================================
// PHASE 4B: MYOSITIS RATING CRITERIA (DC 5021)
// Per 38 CFR 4.71a Note to DCs 5013-5024: Rated as degenerative arthritis
// ============================================

export const MYOSITIS_CRITERIA = {
  diagnosticCode: '5021',
  condition: 'Myositis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5021',

  ratingNote: 'Per 38 CFR 4.71a Note to DCs 5013-5024: Myositis is evaluated as degenerative arthritis, based on limitation of motion of affected parts. Myositis includes inflammatory conditions affecting skeletal muscles such as polymyositis, dermatomyositis, and inclusion body myositis.',

  ratings: [
    {
      percent: 20,
      summary: 'Multiple muscle groups affected with occasional incapacitating exacerbations',
      criteriaDescription: [
        'Multiple muscle groups affected by myositis',
        'Documented muscle inflammation on biopsy or imaging',
        'Occasional incapacitating exacerbations',
        'When limitation of motion is noncompensable',
      ],
      evidenceNeeded: [
        'Muscle biopsy showing inflammatory changes',
        'MRI showing muscle inflammation/edema',
        'Elevated muscle enzymes (CK, aldolase)',
        'Document flare-ups that limit work or daily activities',
        'Track which muscle groups are affected',
      ],
    },
    {
      percent: 10,
      summary: 'Multiple muscle groups affected without incapacitating exacerbations',
      criteriaDescription: [
        'Multiple muscle groups affected',
        'Documented myositis diagnosis',
        'Without incapacitating exacerbations',
        'Chronic but manageable symptoms',
      ],
      evidenceNeeded: [
        'Medical records confirming myositis diagnosis',
        'Lab values showing muscle involvement',
        'Document muscle pain and weakness patterns',
      ],
    },
    {
      percent: 10,
      summary: 'Single muscle group with limitation of motion',
      criteriaDescription: [
        'Single muscle group affected',
        'Limitation of motion present but noncompensable',
        'Confirmed myositis diagnosis',
      ],
      evidenceNeeded: [
        'Documented diagnosis',
        'Track functional limitations',
      ],
    },
    {
      percent: 0,
      summary: 'If significant limitation, rate under specific joint/muscle code',
      criteriaDescription: [
        'When limitation of motion is compensable',
        'Rate under the specific affected area diagnostic code',
      ],
      evidenceNeeded: [
        'Track symptoms under specific affected area',
      ],
    },
  ],

  definitions: {
    myositis: {
      term: 'Myositis',
      definition: 'Inflammation of skeletal muscles causing weakness, pain, and fatigue. Types include polymyositis (proximal muscle weakness), dermatomyositis (with skin rash), and inclusion body myositis.',
    },
    muscleEnzymes: {
      term: 'Muscle Enzymes',
      definition: 'Blood tests (CK, aldolase, AST, ALT, LDH) that indicate muscle damage when elevated.',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'Myositis flare-up severe enough to prevent normal activity, require rest, or seek medical treatment.',
    },
  },

  disclaimer: 'Myositis (DC 5021) is rated as degenerative arthritis per 38 CFR 4.71a. Lab values (muscle enzymes), biopsy, and imaging strengthen claims. Document muscle groups affected and functional limitations.',
};

// ============================================
// PHASE 4B: OSTEOMYELITIS RATING CRITERIA (DC 5000)
// Has its own unique rating schedule
// ============================================

export const OSTEOMYELITIS_CRITERIA = {
  diagnosticCode: '5000',
  condition: 'Osteomyelitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5000',

  ratingNote: 'Osteomyelitis has its own unique rating schedule based on severity, location, and activity status. A rating will NOT be applied following cure by removal or radical resection of the affected bone.',

  ratings: [
    {
      percent: 100,
      summary: 'Pelvis/vertebrae, major joints, multiple sites, or long history with constitutional symptoms',
      criteriaDescription: [
        'Osteomyelitis of pelvis or vertebrae',
        'Extending into major joints',
        'Multiple localization (multiple bones affected)',
        'Long history of intractability and debility',
        'Anemia, amyloid liver changes, or other continuous constitutional symptoms',
      ],
      evidenceNeeded: [
        'Imaging showing bone involvement (X-ray, MRI, CT, bone scan)',
        'Lab values showing chronic infection markers',
        'Documentation of affected bones/joints',
        'Medical records showing long treatment history',
        'Evidence of constitutional symptoms (anemia, liver changes)',
      ],
    },
    {
      percent: 60,
      summary: 'Frequent episodes with constitutional symptoms',
      criteriaDescription: [
        'Frequent recurrent episodes of active osteomyelitis',
        'Constitutional symptoms present (fever, fatigue, weight loss)',
        'Requiring repeated antibiotic courses',
      ],
      evidenceNeeded: [
        'Documentation of multiple infection episodes',
        'Lab values during active infection',
        'Antibiotic treatment records',
        'Constitutional symptom documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Definite involucrum or sequestrum, with or without discharging sinus',
      criteriaDescription: [
        'Imaging showing involucrum (new bone formation around dead bone)',
        'Imaging showing sequestrum (dead bone fragment)',
        'May have discharging sinus or may not',
      ],
      evidenceNeeded: [
        'Imaging showing involucrum or sequestrum',
        'Surgical or medical records',
        'Document any wound drainage',
      ],
    },
    {
      percent: 20,
      summary: 'Discharging sinus or active infection evidence within past 5 years',
      criteriaDescription: [
        'Discharging sinus present',
        'OR other evidence of active infection within the past 5 years',
        'History of recurrent osteomyelitis required',
      ],
      evidenceNeeded: [
        'Wound/sinus documentation with photos if possible',
        'Culture results showing infection',
        'Treatment records within past 5 years',
      ],
    },
    {
      percent: 10,
      summary: 'Inactive, following repeated episodes, no active infection in past 5 years',
      criteriaDescription: [
        'History of osteomyelitis with repeated episodes',
        'Currently inactive',
        'No evidence of active infection in past 5 years',
        'Requires 2 or more episodes following initial infection',
      ],
      evidenceNeeded: [
        'Documentation of past episodes (at least 2)',
        'Current imaging showing inactive disease',
        'Lab values showing no active infection',
      ],
    },
  ],

  definitions: {
    involucrum: {
      term: 'Involucrum',
      definition: 'New bone formation that surrounds dead bone (sequestrum) in chronic osteomyelitis. Seen on imaging as a shell of new bone.',
    },
    sequestrum: {
      term: 'Sequestrum',
      definition: 'A piece of dead bone that has separated from healthy bone during osteomyelitis. Often requires surgical removal.',
    },
    dischargingSinus: {
      term: 'Discharging Sinus',
      definition: 'An abnormal channel (tract) that drains pus from the infected bone to the skin surface.',
    },
    constitutionalSymptoms: {
      term: 'Constitutional Symptoms',
      definition: 'Systemic symptoms affecting the whole body: fever, fatigue, weight loss, night sweats, anemia.',
    },
  },

  disclaimer: 'Osteomyelitis (DC 5000) has its own rating schedule. Document infection episodes, imaging findings, and any draining wounds. A rating will NOT be applied following cure by removal or resection of affected bone.',
};

// ============================================
// PHASE 4B: MULTI-JOINT ARTHRITIS RATING CRITERIA (DC 5002)
// Active process rating schedule
// ============================================

export const MULTI_JOINT_ARTHRITIS_CRITERIA = {
  diagnosticCode: '5002',
  condition: 'Multi-Joint Arthritis (Active Process)',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5002',

  ratingNote: 'DC 5002 rates multi-joint arthritis as an ACTIVE inflammatory process (rheumatoid arthritis, psoriatic arthritis, spondyloarthropathies). For CHRONIC RESIDUALS after the active process resolves, rate under DC 5003 (degenerative arthritis). Cannot combine active process rating with residual ratings - use the higher evaluation.',

  ratings: [
    {
      percent: 100,
      summary: 'Constitutional manifestations with active joint involvement, totally incapacitating',
      criteriaDescription: [
        'Constitutional manifestations (fever, weight loss, anemia) present',
        'Active joint involvement in multiple joints',
        'Condition is totally incapacitating',
        'Unable to perform daily activities or work',
      ],
      evidenceNeeded: [
        'Rheumatology records showing active disease',
        'Lab values (ESR, CRP, RF, anti-CCP) showing inflammation',
        'Documentation of constitutional symptoms',
        'Functional assessment showing total incapacity',
        'Imaging showing active joint destruction',
      ],
    },
    {
      percent: 60,
      summary: 'Weight loss AND anemia with severe health impairment, OR 4+ severely incapacitating exacerbations/year',
      criteriaDescription: [
        'Less than totally incapacitating but with:',
        'Weight loss AND anemia productive of severe impairment of health',
        'OR severely incapacitating exacerbations occurring 4 or more times per year',
        'OR a lesser number of exacerbations over prolonged periods',
      ],
      evidenceNeeded: [
        'Lab values showing anemia',
        'Weight records showing loss',
        'Document exacerbations requiring bed rest or unable to work',
        'Medical visits for flare-ups',
      ],
    },
    {
      percent: 40,
      summary: 'Definite health impairment with exam findings, OR 3+ incapacitating exacerbations/year',
      criteriaDescription: [
        'Symptom combinations productive of definite impairment of health',
        'Objectively supported by examination findings',
        'OR incapacitating exacerbations occurring 3 or more times per year',
      ],
      evidenceNeeded: [
        'Examination findings documenting joint involvement',
        'Lab markers of inflammation',
        'Document 3+ incapacitating exacerbations per year',
      ],
    },
    {
      percent: 20,
      summary: 'One or two exacerbations per year in a well-established diagnosis',
      criteriaDescription: [
        'Well-established diagnosis of inflammatory arthritis',
        'One or two exacerbations per year',
        'Managed with medication between flares',
      ],
      evidenceNeeded: [
        'Confirmed diagnosis (rheumatoid, psoriatic, etc.)',
        'Document exacerbation episodes',
        'Treatment records',
      ],
    },
  ],

  definitions: {
    activeProcess: {
      term: 'Active Process',
      definition: 'Ongoing inflammatory disease activity with elevated markers (ESR, CRP), joint swelling, warmth, and systemic symptoms. Distinguished from chronic residuals.',
    },
    constitutionalManifestations: {
      term: 'Constitutional Manifestations',
      definition: 'Systemic symptoms: fever, fatigue, weight loss, anemia, malaise that accompany active inflammatory arthritis.',
    },
    incapacitatingExacerbation: {
      term: 'Incapacitating Exacerbation',
      definition: 'Severe flare-up that prevents normal activity and requires medical treatment. Document inability to work or perform daily activities.',
    },
    chronicResiduals: {
      term: 'Chronic Residuals',
      definition: 'After the active inflammatory process resolves, any remaining joint damage (deformity, limited motion) is rated under DC 5003 as degenerative arthritis.',
    },
    examplesOfConditions: {
      term: 'Conditions Rated Under DC 5002',
      definition: 'Rheumatoid arthritis, psoriatic arthritis, spondyloarthropathies (ankylosing spondylitis, reactive arthritis), and other inflammatory multi-joint conditions.',
    },
  },

  disclaimer: 'Multi-joint arthritis (DC 5002) rates the ACTIVE inflammatory process. For chronic residuals after inflammation resolves, rate under DC 5003. Cannot combine active process ratings with residual ratings - assign the higher evaluation.',
};

// ============================================
// PHASE 4C: SPINE EXPANSION RATING CRITERIA
// DC 5235, 5236, 5238, 5240, 5241
// All use General Rating Formula for Diseases and Injuries of the Spine
// ============================================

// Shared General Rating Formula for Spine (DC 5235-5243)
// This is the same formula used by existing spine conditions

export const GENERAL_SPINE_RATING_FORMULA = {
  ratings: [
    {
      percent: 100,
      summary: 'Unfavorable ankylosis of the entire spine',
      criteriaDescription: [
        'Complete fusion of the entire spine in an unfavorable position',
        'Extremely severe and disabling condition',
        'Unable to look forward, severe postural deformity',
      ],
      evidenceNeeded: [
        'Medical imaging (X-ray, CT, MRI) showing complete spinal fusion',
        'Clinical examination documenting complete loss of spinal motion',
        'Documentation of unfavorable position (inability to look straight ahead)',
      ],
    },
    {
      percent: 50,
      summary: 'Unfavorable ankylosis of the entire thoracolumbar spine',
      criteriaDescription: [
        'Complete fusion of the thoracolumbar spine (mid and low back)',
        'In unfavorable position',
        'Severe limitation of mobility and function',
      ],
      evidenceNeeded: [
        'Imaging showing thoracolumbar ankylosis',
        'Clinical ROM measurements showing no motion',
        'Documentation of significant functional impairment',
      ],
    },
    {
      percent: 40,
      summary: 'Forward flexion 30° or less, OR favorable ankylosis of entire thoracolumbar spine',
      criteriaDescription: [
        'Forward flexion of thoracolumbar spine 30° or less (normal is 90°), OR',
        'Favorable ankylosis of the entire thoracolumbar spine',
        'Significant but somewhat functional limitation',
      ],
      evidenceNeeded: [
        'ROM measurements showing forward flexion <=30°',
        'Goniometer readings by healthcare provider',
        'OR imaging showing fusion in functional position',
      ],
    },
    {
      percent: 20,
      summary: 'Forward flexion 30-60°, OR combined ROM <=120°, OR muscle spasm causing abnormal gait/contour',
      criteriaDescription: [
        'Forward flexion greater than 30° but not greater than 60°, OR',
        'Combined ROM of thoracolumbar spine not greater than 120°, OR',
        'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour (scoliosis, reversed lordosis, abnormal kyphosis)',
      ],
      evidenceNeeded: [
        'ROM measurements showing limitation',
        'Clinical notes documenting muscle spasm or guarding',
        'Observation of abnormal gait or spinal contour',
      ],
    },
    {
      percent: 10,
      summary: 'Forward flexion 60-85°, OR combined ROM 120-235°, OR muscle spasm without abnormal gait',
      criteriaDescription: [
        'Forward flexion greater than 60° but not greater than 85°, OR',
        'Combined ROM greater than 120° but not greater than 235°, OR',
        'Muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or abnormal spinal contour, OR',
        'Vertebral body fracture with loss of 50% or more of the height',
      ],
      evidenceNeeded: [
        'ROM measurements in the specified range',
        'Clinical examination notes',
        'Documentation of pain and functional limitations',
        'X-ray showing vertebral height loss if applicable',
      ],
    },
    {
      percent: 0,
      summary: 'Forward flexion greater than 85° with minimal symptoms',
      criteriaDescription: [
        'Forward flexion greater than 85°',
        'Minimal functional impact',
        'Symptoms controlled with treatment',
      ],
      evidenceNeeded: [],
    },
  ],
  notes: [
    'Note 1: Evaluate any associated objective neurologic abnormalities (bowel, bladder, extremities) separately under appropriate diagnostic code.',
    'Note 2: For VA purposes, normal forward flexion of thoracolumbar spine is 90°; extension is 30°; left and right lateral flexion are 30° each; and left and right lateral rotation are 30° each. Combined ROM is sum of these (240° normal).',
    'Note 5: For VA purposes, unfavorable ankylosis is when the entire spine is fixed in flexion or extension. Fixation at 0° (neutral) is favorable ankylosis.',
  ],
};

// VERTEBRAL FRACTURE OR DISLOCATION (DC 5235)

export const VERTEBRAL_FRACTURE_CRITERIA = {
  diagnosticCode: '5235',
  condition: 'Vertebral Fracture or Dislocation',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5235',

  // Uses General Rating Formula for Spine
  ratings: GENERAL_SPINE_RATING_FORMULA.ratings,
  notes: GENERAL_SPINE_RATING_FORMULA.notes,

  definitions: {
    vertebralFracture: {
      term: 'Vertebral Fracture',
      definition: 'Break in one of the vertebral bones of the spine. Can be compression fracture, burst fracture, or fracture-dislocation.',
    },
    compressionFracture: {
      term: 'Compression Fracture',
      definition: 'Vertebra collapses, usually in the front, causing wedge shape. Common in osteoporosis or trauma. 50%+ height loss qualifies for minimum 10% rating.',
    },
    heightLoss: {
      term: 'Vertebral Height Loss',
      definition: 'Reduction in vertebral body height compared to normal. 50% or more height loss specifically noted in 10% criteria.',
    },
  },

  note: 'Vertebral fracture with 50% or more height loss qualifies for minimum 10% rating even without significant ROM limitation. Any associated neurologic abnormalities (radiculopathy, bowel/bladder dysfunction) are rated separately.',

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires orthopedic examination with ROM measurements and imaging (X-ray, CT, MRI) showing fracture. Vertebral height loss should be documented by radiologist.',
};

// SACROILIAC INJURY AND WEAKNESS (DC 5236)

export const SACROILIAC_INJURY_CRITERIA = {
  diagnosticCode: '5236',
  condition: 'Sacroiliac Injury and Weakness',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5236',

  // Uses General Rating Formula for Spine
  ratings: GENERAL_SPINE_RATING_FORMULA.ratings,
  notes: GENERAL_SPINE_RATING_FORMULA.notes,

  definitions: {
    sacroiliacJoint: {
      term: 'Sacroiliac (SI) Joint',
      definition: 'Joint connecting the sacrum (base of spine) to the ilium (pelvis). SI dysfunction causes low back, buttock, and leg pain.',
    },
    siDysfunction: {
      term: 'SI Joint Dysfunction',
      definition: 'Abnormal motion (too much or too little) in the sacroiliac joint causing pain and instability.',
    },
    referredPain: {
      term: 'Referred Pain',
      definition: 'Pain felt in areas away from the actual source. SI dysfunction commonly causes referred pain to buttock, hip, groin, and leg.',
    },
  },

  note: 'SI joint dysfunction is rated under the General Rating Formula for Spine based on limitation of motion of the thoracolumbar spine. Document both SI-specific symptoms AND overall spinal ROM limitations.',

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires orthopedic examination with ROM measurements. Special SI joint provocative tests (FABER, Gaenslen, compression) support diagnosis.',
};

// SPINAL STENOSIS (DC 5238)

export const SPINAL_STENOSIS_CRITERIA = {
  diagnosticCode: '5238',
  condition: 'Spinal Stenosis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5238',

  // Uses General Rating Formula for Spine
  ratings: GENERAL_SPINE_RATING_FORMULA.ratings,
  notes: GENERAL_SPINE_RATING_FORMULA.notes,

  definitions: {
    spinalStenosis: {
      term: 'Spinal Stenosis',
      definition: 'Narrowing of the spinal canal that puts pressure on the spinal cord and nerves. Can be central (spinal cord) or foraminal (nerve roots).',
    },
    neurogenicClaudication: {
      term: 'Neurogenic Claudication',
      definition: 'Leg pain, weakness, or numbness with walking or standing that improves with sitting or bending forward. Classic symptom of lumbar spinal stenosis.',
    },
    shoppingCartSign: {
      term: 'Shopping Cart Sign',
      definition: 'Relief when leaning forward (like pushing a shopping cart) because flexion opens the spinal canal. Classic finding in spinal stenosis.',
    },
  },

  note: 'Spinal stenosis is rated under the General Rating Formula based on ROM limitation. However, associated neurologic symptoms (leg weakness, numbness, bowel/bladder changes) should be rated separately under appropriate neurologic codes (e.g., radiculopathy).',

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires orthopedic examination with ROM measurements and imaging (MRI/CT) showing stenosis. Neurologic symptoms should be separately evaluated.',
};

// ANKYLOSING SPONDYLITIS (DC 5240)

export const ANKYLOSING_SPONDYLITIS_CRITERIA = {
  diagnosticCode: '5240',
  condition: 'Ankylosing Spondylitis',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5240',

  // Uses General Rating Formula for Spine
  ratings: GENERAL_SPINE_RATING_FORMULA.ratings,
  notes: GENERAL_SPINE_RATING_FORMULA.notes,

  definitions: {
    ankylosingSpondylitis: {
      term: 'Ankylosing Spondylitis',
      definition: 'Chronic inflammatory disease primarily affecting the spine and sacroiliac joints. Can cause vertebrae to fuse over time (ankylosis).',
    },
    inflammatoryBackPain: {
      term: 'Inflammatory Back Pain',
      definition: 'Back pain that improves with exercise but not rest, morning stiffness >30 minutes, awakening in second half of night, and alternating buttock pain.',
    },
    enthesitis: {
      term: 'Enthesitis',
      definition: 'Inflammation where tendons and ligaments attach to bone. Common in ankylosing spondylitis at Achilles tendon, plantar fascia, and rib attachments.',
    },
    bambooSpine: {
      term: 'Bamboo Spine',
      definition: 'X-ray appearance of fused vertebrae in advanced ankylosing spondylitis, resembling bamboo.',
    },
  },

  note: 'Ankylosing spondylitis is an inflammatory condition that can progress to spinal fusion (ankylosis). Document morning stiffness duration, night pain, and response to exercise vs rest. HLA-B27 testing and inflammatory markers (ESR, CRP) support diagnosis.',

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires rheumatology evaluation with ROM measurements. Lab tests (HLA-B27, inflammatory markers) and imaging showing sacroiliitis or spinal fusion strengthen claims.',
};

// SPINAL FUSION (DC 5241)

export const SPINAL_FUSION_CRITERIA = {
  diagnosticCode: '5241',
  condition: 'Spinal Fusion',
  cfrReference: '38 CFR 4.71a, Diagnostic Code 5241',

  // Uses General Rating Formula for Spine
  ratings: GENERAL_SPINE_RATING_FORMULA.ratings,
  notes: GENERAL_SPINE_RATING_FORMULA.notes,

  definitions: {
    spinalFusion: {
      term: 'Spinal Fusion',
      definition: 'Surgical procedure joining two or more vertebrae to eliminate motion between them. May include hardware (rods, screws, cages).',
    },
    adjacentSegmentDisease: {
      term: 'Adjacent Segment Disease',
      definition: 'Degeneration of spinal segments above or below a fusion due to increased stress. Can cause pain and may require additional surgery.',
    },
    pseudoarthrosis: {
      term: 'Pseudoarthrosis',
      definition: 'Failed fusion where bone does not completely heal. Causes persistent pain and instability.',
    },
    hardwareFailure: {
      term: 'Hardware Failure',
      definition: 'Broken, loose, or migrated surgical hardware (rods, screws, cages) causing pain or instability.',
    },
  },

  note: 'Spinal fusion eliminates motion at fused segments, permanently limiting ROM. Rating is based on remaining spinal motion. Document levels fused, as multi-level fusions cause greater ROM loss. Adjacent segment disease is common complication.',

  disclaimer: 'This analysis is based on logged symptoms. VA rating requires orthopedic examination with ROM measurements. Surgical records documenting fusion levels and post-operative imaging showing fusion status are essential.',
};

// ============================================
// ASTHMA RATING CRITERIA (DC 6602)
// ============================================

export const AMPUTATION_CRITERIA = {
  condition: 'Amputation / Loss of Extremity',
  cfrReference: '38 CFR 4.71a',
  diagnosticCodes: 'DC 5120-5173',
  ratings: [
    // Upper Extremity - Major (dominant)
    { percent: 90, summary: 'Loss of arm at shoulder (major)', dc: '5120' },
    { percent: 80, summary: 'Loss of arm above elbow (major)', dc: '5121' },
    { percent: 70, summary: 'Loss of arm below elbow (major)', dc: '5124' },
    { percent: 70, summary: 'Loss of hand (major)', dc: '5125' },
    // Upper Extremity - Minor (non-dominant)
    { percent: 80, summary: 'Loss of arm at shoulder (minor)', dc: '5120' },
    { percent: 70, summary: 'Loss of arm above elbow (minor)', dc: '5121' },
    { percent: 60, summary: 'Loss of arm below elbow (minor)', dc: '5124' },
    { percent: 60, summary: 'Loss of hand (minor)', dc: '5125' },
    // Lower Extremity
    { percent: 90, summary: 'Loss of thigh at hip', dc: '5160' },
    { percent: 80, summary: 'Loss of thigh above knee', dc: '5161' },
    { percent: 60, summary: 'Loss of leg below knee', dc: '5165' },
    { percent: 40, summary: 'Loss of foot', dc: '5167' },
  ],
  smcNote: 'Loss of use of hand or foot qualifies for SMC-K ($139.87/month). Multiple losses may qualify for higher SMC levels.',
};


export const analyzeLumbosacralStrainLogs = (logs, options = {}) => {
  const conditionCriteria = LUMBOSACRAL_STRAIN_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = MUSCULOSKELETAL_CONDITIONS.LUMBOSACRAL_STRAIN.symptomIds;

  // Filter logs for back-related symptoms
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
      message: 'No back pain symptoms logged in evaluation period',
    };
  }

  // Count symptoms
  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;
  const symptomTypesPresent = [...new Set(relevantLogs.map(log => getLogSymptomId(log)))].length;

  // Check for indicators of functional impact
  const hasRadicularPain = relevantLogs.some(log => getLogSymptomId(log) === 'back-radicular' || getLogSymptomId(log) === 'back-numbness');
  const hasMuscleSpasm = relevantLogs.some(log => getLogSymptomId(log) === 'back-spasm');
  const hasStiffness = relevantLogs.some(log => getLogSymptomId(log) === 'back-stiffness');

  // Evidence collected
  const evidence = [
    `${totalSymptoms} back pain symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms (severity 4-5)`,
    `Symptom types documented: ${symptomTypesPresent}`,
  ];

  if (hasRadicularPain) evidence.push('Radiating pain/numbness documented');
  if (hasMuscleSpasm) evidence.push('Muscle spasm episodes documented');
  if (hasStiffness) evidence.push('Back stiffness documented');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Measurement',
    ratingRationale: [
      'Back pain conditions require Range of Motion (ROM) measurements by a healthcare provider',
      'Symptom logs document pain patterns but cannot determine ROM limitations',
      'Your symptom documentation shows ongoing back pain that warrants clinical evaluation',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: Schedule ROM evaluation with healthcare provider using goniometer',
      'Request formal documentation of forward flexion measurements',
      'Document any abnormal gait or spinal contour observed by provider',
      'Get imaging if not already done (X-ray, MRI)',
      'Document functional limitations: difficulty bending, lifting, walking',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Musculoskeletal conditions require objective Range of Motion measurements performed by a healthcare provider. Your symptom documentation helps establish the pattern and severity of pain, but clinical examination is essential for rating determination.',
  };
};

/**
 * Analyzes Intervertebral Disc Syndrome logs
 * NOTE: This requires documentation of incapacitating episodes OR ROM measurements
 */

export const analyzeIntervertebralDiscLogs = (logs, options = {}) => {
  const conditionCriteria = INTERVERTEBRAL_DISC_CRITERIA;
  const evaluationPeriodDays = options.days || 365; // Use full year for episode tracking
  const symptomIds = MUSCULOSKELETAL_CONDITIONS.INTERVERTEBRAL_DISC.symptomIds;

  // Filter relevant logs
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
      message: 'No disc-related symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;

  const hasDiscPain = relevantLogs.some(log => getLogSymptomId(log) === 'disc-pain');
  const hasRadicularPain = relevantLogs.some(log => getLogSymptomId(log) === 'back-radicular' || getLogSymptomId(log) === 'back-numbness');

  const evidence = [
    `${totalSymptoms} disc-related symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
    `${severeSymptoms} severe symptoms`,
  ];

  if (hasDiscPain) evidence.push('Disc pain specifically documented');
  if (hasRadicularPain) evidence.push('Nerve compression symptoms (radiating pain/numbness)');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Documentation',
    ratingRationale: [
      'Disc syndrome can be rated TWO ways: (1) Based on incapacitating episodes, OR (2) Based on ROM measurements',
      'Your symptom logs show ongoing disc-related pain',
      'To use incapacitating episodes method, you need physician-prescribed bed rest for each episode',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: DC 5243 requires confirmed disc herniation with nerve root compression (MRI/CT)',
      'For incapacitating episodes rating: Each episode must have BOTH:',
      '  - Physician prescription for bed rest during episode',
      '  - Treatment by physician during episode',
      'Track total DURATION of incapacitating episodes over 12 months',
      'Alternative: Get ROM measurements for rating under General Formula',
      'Document functional limitations and impact on daily activities',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Disc syndrome diagnosis requires imaging confirmation and can only be rated 5243 when there is disc herniation with nerve root compression/irritation. Otherwise, use DC 5242 for degenerative disc disease. Rating requires either documented incapacitating episodes OR clinical ROM measurements.',
  };
};

/**
 * Analyzes Knee Instability logs
 */

export const analyzeKneeInstabilityLogs = (logs, options = {}) => {
  const conditionCriteria = KNEE_INSTABILITY_CRITERIA;
  const evaluationPeriodDays = options.days || 90;
  const symptomIds = MUSCULOSKELETAL_CONDITIONS.KNEE_INSTABILITY.symptomIds;

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
      message: 'No knee symptoms logged in evaluation period',
    };
  }

  const totalSymptoms = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 0), 0) / totalSymptoms;
  const instabilityEvents = relevantLogs.filter(log => getLogSymptomId(log) === 'knee-instability' || getLogSymptomId(log) === 'knee-locking').length;
  const severeSymptoms = relevantLogs.filter(log => (log.severity || 0) >= 4).length;

  const hasGivingWay = relevantLogs.some(log => getLogSymptomId(log) === 'knee-instability');
  const hasSwelling = relevantLogs.some(log => getLogSymptomId(log) === 'knee-swelling');
  const hasLocking = relevantLogs.some(log => getLogSymptomId(log) === 'knee-locking');

  const evidence = [
    `${totalSymptoms} knee symptoms logged over ${(evaluationPeriodDays / 30).toFixed(1)} months`,
    `${instabilityEvents} instability/locking events documented`,
    `Average severity: ${avgSeverity.toFixed(1)}/5`,
  ];

  if (hasGivingWay) evidence.push('Knee giving way/instability documented');
  if (hasSwelling) evidence.push('Knee swelling documented');
  if (hasLocking) evidence.push('Knee locking/catching documented');

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Clinical Documentation',
    ratingRationale: [
      'Knee instability ratings depend on ligament injury status and prescribed assistive devices',
      'Your symptom logs document ongoing knee instability',
      'Rating determination requires medical documentation of ligament status',
    ],
    assessmentLevel: 'Clinical Evaluation Required',
    evidence,
    gaps: [
      'Get MRI or surgical records confirming ligament injury type (complete vs incomplete tear)',
      'Document repair status (unrepaired, repaired, or failed repair)',
      'If using assistive devices (cane, crutches, walker) or knee brace, get written prescription',
      'Clinical examination documenting instability tests (Lachman, drawer, pivot shift)',
      'Document functional limitations: stairs, squatting, walking on uneven ground',
      'Track frequency of giving-way episodes',
    ],
    criteria: conditionCriteria,
    disclaimer: 'Knee instability ratings require documentation of ligament injury status and whether medical providers have prescribed braces or assistive devices. Your symptom documentation establishes the ongoing nature of instability.',
  };
};

/**
 * Analyzes TBI cognitive symptom logs
 * NOTE: TBI ratings require comprehensive neuropsychological evaluation
 */

export const analyzePlantarFasciitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const pfSymptoms = logs.filter(log =>
      MUSCULOSKELETAL_CONDITIONS.PLANTAR_FASCIITIS.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (pfSymptoms.length === 0) {
    return {
      condition: 'Plantar Fasciitis',
      diagnosticCode: '5276',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No plantar fasciitis symptoms logged',
        'Log heel pain episodes',
        'Document morning pain (first steps)',
        'Track arch pain and stiffness',
        'Note if symptoms affect one or both feet',
      ],
      criteria: PLANTAR_FASCIITIS_CRITERIA,
      disclaimer: PLANTAR_FASCIITIS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const heelPainCount = pfSymptoms.filter(s => getLogSymptomId(s) === 'pf-heel-pain').length;
  const archPainCount = pfSymptoms.filter(s => getLogSymptomId(s) === 'pf-arch-pain').length;
  const morningPainCount = pfSymptoms.filter(s => getLogSymptomId(s) === 'pf-morning-pain').length;
  const stiffnessCount = pfSymptoms.filter(s => getLogSymptomId(s) === 'pf-stiffness').length;
  const walkingDifficultyCount = pfSymptoms.filter(s => getLogSymptomId(s) === 'pf-difficulty-walking').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = pfSymptoms.length / weeksInPeriod;

  evidence.push(`${pfSymptoms.length} plantar fasciitis episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (heelPainCount > 0) evidence.push(`${heelPainCount} heel pain episodes`);
  if (archPainCount > 0) evidence.push(`${archPainCount} arch pain episodes`);
  if (morningPainCount > 0) evidence.push(`${morningPainCount} morning pain episodes (characteristic symptom)`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (walkingDifficultyCount > 0) evidence.push(`${walkingDifficultyCount} walking difficulty episodes`);

  // Determine rating
  // 30%: Bilateral severe with marked limitation
  // 20%: Unilateral severe or bilateral moderate
  // 10%: Unilateral moderate or bilateral mild

  if (episodesPerWeek >= 5 && walkingDifficultyCount >= 8) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (frequent)`,
        `${walkingDifficultyCount} episodes affecting ability to walk`,
        'Symptoms suggest severe functional limitation'
    );
    gaps.push('Higher ratings require podiatry documentation of bilateral involvement');
    gaps.push('Document severity on BOTH feet for 30% rating');
    gaps.push('Track impact on weight-bearing and standing');
  }
  else if (episodesPerWeek >= 3 || walkingDifficultyCount > 0) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${pfSymptoms.length} episodes over ${evaluationPeriodDays} days`,
        walkingDifficultyCount > 0 ? 'Functional impairment documented' : 'Regular symptoms documented',
        'Supports 10-20% rating range'
    );
    gaps.push('Document if symptoms affect one foot (unilateral) or both (bilateral)');
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        `${pfSymptoms.length} plantar fasciitis episodes`,
        'Supports 10% rating for mild to moderate symptoms'
    );
  }

  // Documentation gaps
  if (pfSymptoms.length < 10) {
    gaps.push(`Only ${pfSymptoms.length} episodes logged - aim for 10+ over 90 days`);
  }

  if (morningPainCount === 0) {
    gaps.push('Morning pain (first steps) is characteristic - document if present');
  }

  if (walkingDifficultyCount === 0) {
    gaps.push('Document functional impact: difficulty walking, standing, or weight-bearing');
  }

  gaps.push('Higher ratings require bilateral (both feet) involvement');
  gaps.push('Podiatry examination strengthens claim');
  gaps.push('Document orthotics, injections, or physical therapy tried');

  return {
    condition: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: PLANTAR_FASCIITIS_CRITERIA,
    disclaimer: PLANTAR_FASCIITIS_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Insomnia logs for VA rating
 * DC 8108 - Insomnia
 */

export const analyzeShoulderLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const shoulderSymptoms = logs.filter(log =>
      MUSCULOSKELETAL_CONDITIONS.SHOULDER.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (shoulderSymptoms.length === 0) {
    return {
      condition: 'Shoulder Conditions',
      diagnosticCode: '5201-5203',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No shoulder symptoms logged',
        'Log shoulder pain episodes',
        'Document limited range of motion',
        'Track instability or weakness',
        'Note impact on daily activities (reaching, lifting)',
      ],
      criteria: SHOULDER_CRITERIA,
      disclaimer: SHOULDER_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = shoulderSymptoms.filter(s => getLogSymptomId(s) === 'shoulder-pain').length;
  const limitedROMCount = shoulderSymptoms.filter(s => getLogSymptomId(s) === 'shoulder-limited-rom').length;
  const instabilityCount = shoulderSymptoms.filter(s => getLogSymptomId(s) === 'shoulder-instability').length;
  const weaknessCount = shoulderSymptoms.filter(s => getLogSymptomId(s) === 'shoulder-weakness').length;
  const stiffnessCount = shoulderSymptoms.filter(s => getLogSymptomId(s) === 'shoulder-stiffness').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = shoulderSymptoms.length / weeksInPeriod;

  evidence.push(`${shoulderSymptoms.length} shoulder episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited range of motion episodes`);
  if (instabilityCount > 0) evidence.push(`${instabilityCount} instability episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);

  // Determine rating based on frequency and severity
  // Higher ratings require ROM measurements from orthopedic exam
  // 40%: Severe limitation (<90° forward elevation)
  // 30%: Moderate limitation (90-120°)
  // 20%: Slight-moderate (120-160°)
  // 10%: Slight impairment or recurrent instability

  if (limitedROMCount >= 10 && (painCount >= 10 || stiffnessCount >= 10)) {
    supportedRating = '30-40';
    ratingRationale.push(
        `${limitedROMCount} limited ROM episodes documented`,
        `${painCount} pain episodes`,
        'Suggests moderate to severe limitation of motion',
        'ROM measurements required for formal rating'
    );
    gaps.push('Orthopedic exam with ROM measurements required for 30-40% rating');
    gaps.push('Severe limitation: <90° forward elevation or abduction');
    gaps.push('Moderate limitation: 90-120° forward elevation');
  }
  else if (limitedROMCount >= 5 || (painCount >= 8 && episodesPerWeek >= 2)) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${shoulderSymptoms.length} shoulder episodes`,
        limitedROMCount > 0 ? `${limitedROMCount} limited ROM episodes` : 'Regular pain limiting function',
        'Supports 20-30% rating range'
    );
    gaps.push('ROM measurements strengthen claim: 120-160° = 20%, 90-120° = 30%');
  }
  else if (instabilityCount > 0 || shoulderSymptoms.length >= 8) {
    supportedRating = '10';
    ratingRationale.push(
        `${shoulderSymptoms.length} episodes documented`,
        instabilityCount > 0 ? 'Recurrent instability documented' : 'Regular shoulder symptoms',
        'Supports 10% rating for slight impairment'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'Shoulder symptoms documented',
        'Supports 10% rating'
    );
  }

  // Documentation gaps
  if (shoulderSymptoms.length < 8) {
    gaps.push(`Only ${shoulderSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Pain is primary symptom - log shoulder pain episodes');
  }

  if (limitedROMCount === 0) {
    gaps.push('Document limited range of motion episodes');
  }

  gaps.push('All shoulder ratings require orthopedic examination with ROM measurements');
  gaps.push('Document which shoulder (left/right) or bilateral');
  gaps.push('Track impact on daily activities: reaching overhead, dressing, lifting');
  gaps.push('X-rays showing degenerative changes strengthen claim');

  return {
    condition: 'Shoulder Conditions',
    diagnosticCode: '5201-5203',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: SHOULDER_CRITERIA,
    disclaimer: SHOULDER_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Hip logs for VA rating
 * DC 5252-5255 - Hip Conditions
 */

export const analyzeHipLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const hipSymptoms = logs.filter(log =>
      MUSCULOSKELETAL_CONDITIONS.HIP.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (hipSymptoms.length === 0) {
    return {
      condition: 'Hip Conditions',
      diagnosticCode: '5252-5255',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No hip symptoms logged',
        'Log hip pain episodes',
        'Document limited range of motion',
        'Track stiffness and weakness',
        'Note impact on walking, stairs, sitting',
      ],
      criteria: HIP_CRITERIA,
      disclaimer: HIP_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const painCount = hipSymptoms.filter(s => getLogSymptomId(s) === 'hip-pain').length;
  const limitedROMCount = hipSymptoms.filter(s => getLogSymptomId(s) === 'hip-limited-rom').length;
  const stiffnessCount = hipSymptoms.filter(s => getLogSymptomId(s) === 'hip-stiffness').length;
  const weaknessCount = hipSymptoms.filter(s => getLogSymptomId(s) === 'hip-weakness').length;
  const limpingCount = hipSymptoms.filter(s => getLogSymptomId(s) === 'hip-limping').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = hipSymptoms.length / weeksInPeriod;

  evidence.push(`${hipSymptoms.length} hip episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (painCount > 0) evidence.push(`${painCount} pain episodes`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited range of motion episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (limpingCount > 0) evidence.push(`${limpingCount} limping/gait disturbance episodes`);

  // Determine rating based on frequency and severity
  // Higher ratings require ROM measurements and functional assessment
  // 60-50%: Ankylosis (surgical fusion)
  // 40%: Marked limitation + severe pain
  // 30%: Moderate limitation
  // 20%: Slight-moderate limitation
  // 10%: Slight limitation

  if (limitedROMCount >= 10 && painCount >= 12 && (limpingCount >= 5 || weaknessCount >= 5)) {
    supportedRating = '30-40';
    ratingRationale.push(
        `${limitedROMCount} limited ROM episodes`,
        `${painCount} pain episodes (frequent)`,
        limpingCount > 0 ? `${limpingCount} gait disturbances` : `${weaknessCount} weakness episodes`,
        'Suggests moderate to marked functional limitation'
    );
    gaps.push('Orthopedic exam with ROM measurements required for 30-40% rating');
    gaps.push('Document severity: marked limitation = 40%, moderate = 30%');
  }
  else if (limitedROMCount >= 5 || (painCount >= 8 && episodesPerWeek >= 2)) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${hipSymptoms.length} hip episodes`,
        painCount > 0 ? `${painCount} pain episodes` : 'Regular symptoms documented',
        'Supports 20-30% rating range'
    );
    gaps.push('ROM measurements strengthen claim');
  }
  else if (hipSymptoms.length >= 6) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${hipSymptoms.length} episodes documented`,
        'Regular hip symptoms',
        'Supports 10-20% rating range'
    );
  }
  else {
    supportedRating = '10';
    ratingRationale.push(
        'Hip symptoms documented',
        'Supports 10% rating for slight impairment'
    );
  }

  // Documentation gaps
  if (hipSymptoms.length < 8) {
    gaps.push(`Only ${hipSymptoms.length} episodes logged - aim for 8+ over 90 days`);
  }

  if (painCount === 0) {
    gaps.push('Pain is primary symptom - log hip pain episodes');
  }

  if (limitedROMCount === 0) {
    gaps.push('Document limited range of motion episodes');
  }

  if (limpingCount === 0) {
    gaps.push('Document gait changes or limping if present');
  }

  gaps.push('All hip ratings require orthopedic examination with ROM measurements');
  gaps.push('Document which hip (left/right) or bilateral');
  gaps.push('Track functional impact: walking distance, stairs, sitting, getting in/out of car');
  gaps.push('X-rays showing arthritis or other pathology strengthen claim');

  return {
    condition: 'Hip Conditions',
    diagnosticCode: '5252-5255',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: HIP_CRITERIA,
    disclaimer: HIP_CRITERIA.disclaimer,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - ANKLE
// ============================================

/**
 * Analyzes ankle symptom logs to determine supported VA rating level
 */

export const analyzeAnkleLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter ankle symptom logs
  const ankleSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.ANKLE.symptomIds.includes(getLogSymptomId(log));
  });

  if (ankleSymptoms.length === 0) {
    return {
      condition: 'Ankle Conditions',
      diagnosticCode: '5270-5271',
      hasData: false,
      message: 'No ankle symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-pain').length;
  const limitedROMCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-limited-rom').length;
  const stiffnessCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-stiffness').length;
  const instabilityCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-instability').length;
  const swellingCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-swelling').length;
  const weaknessCount = ankleSymptoms.filter(s => getLogSymptomId(s) === 'ankle-weakness').length;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} ankle pain episodes documented`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited ROM episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (instabilityCount > 0) evidence.push(`${instabilityCount} instability episodes`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);

  const totalEpisodes = ankleSymptoms.length;
  const episodesPerWeek = totalEpisodes / (evaluationPeriodDays / 7);

  evidence.push(`${totalEpisodes} total ankle episodes in ${evaluationPeriodDays} days (~${episodesPerWeek.toFixed(1)}/week)`);

  // Determine rating based on symptom patterns
  // 40%: Ankylosis with severe deformity (rare, requires surgical documentation)
  // 30%: Ankylosis in moderate position
  // 20%: Ankylosis <30° plantar flexion OR marked limitation (<5° dorsiflexion, <10° plantar)
  // 10%: Moderate limitation (<15° dorsiflexion, <30° plantar)

  if (limitedROMCount >= 12 && painCount >= 15 && (instabilityCount >= 5 || swellingCount >= 5)) {
    supportedRating = '20';
    ratingRationale.push(
        `${limitedROMCount} limited ROM episodes (frequent)`,
        `${painCount} pain episodes`,
        instabilityCount > 0 ? `${instabilityCount} instability episodes` : `${swellingCount} swelling episodes`,
        'Pattern suggests marked limitation - supports 20%'
    );
    gaps.push('Goniometer ROM measurements needed to confirm marked limitation');
    gaps.push('Marked limitation = <5° dorsiflexion OR <10° plantar flexion');
  }
  else if (limitedROMCount >= 6 || (painCount >= 10 && episodesPerWeek >= 2)) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${totalEpisodes} ankle episodes in ${evaluationPeriodDays} days`,
        painCount > 0 ? `${painCount} pain episodes` : 'Symptoms documented',
        'Supports 10-20% rating range'
    );
    gaps.push('ROM measurements will determine if 10% (moderate) or 20% (marked) limitation');
  }
  else if (totalEpisodes >= 4) {
    supportedRating = '10';
    ratingRationale.push(
        `${totalEpisodes} ankle episodes documented`,
        'Supports 10% rating for moderate limitation'
    );
  }
  else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited ankle symptoms documented',
        'May support 10% if ROM limitation confirmed'
    );
  }

  // Documentation gaps
  if (totalEpisodes < 8) {
    gaps.push(`Only ${totalEpisodes} episodes logged - aim for 8+ over 90 days`);
  }
  if (painCount === 0) {
    gaps.push('Pain is primary symptom - document ankle pain episodes');
  }
  if (limitedROMCount === 0) {
    gaps.push('Document limited ROM episodes for stronger claim');
  }
  gaps.push('Orthopedic exam with goniometer ROM measurements required');
  gaps.push('Document which ankle (left/right) or bilateral');
  gaps.push('Track functional impact: walking, stairs, standing, running');
  gaps.push('X-rays showing arthritis or pathology strengthen claim');

  return {
    condition: 'Ankle Conditions',
    diagnosticCode: '5270-5271',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: ANKLE_CRITERIA,
    disclaimer: ANKLE_CRITERIA.disclaimer,
  };
};


// ============================================
// ANALYSIS FUNCTIONS - WRIST
// ============================================

/**
 * Analyzes wrist symptom logs to determine supported VA rating level
 */

export const analyzeWristLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter wrist symptom logs
  const wristSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.WRIST.symptomIds.includes(getLogSymptomId(log));
  });

  if (wristSymptoms.length === 0) {
    return {
      condition: 'Wrist Conditions',
      diagnosticCode: '5214-5215',
      hasData: false,
      message: 'No wrist symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-pain').length;
  const limitedROMCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-limited-rom').length;
  const stiffnessCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-stiffness').length;
  const weaknessCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-weakness').length;
  const numbnessCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-numbness').length;
  const swellingCount = wristSymptoms.filter(s => getLogSymptomId(s) === 'wrist-swelling').length;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} wrist pain episodes documented`);
  if (limitedROMCount > 0) evidence.push(`${limitedROMCount} limited ROM episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (numbnessCount > 0) evidence.push(`${numbnessCount} numbness/tingling episodes`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);

  const totalEpisodes = wristSymptoms.length;
  const episodesPerWeek = totalEpisodes / (evaluationPeriodDays / 7);

  evidence.push(`${totalEpisodes} total wrist episodes in ${evaluationPeriodDays} days (~${episodesPerWeek.toFixed(1)}/week)`);

  // Determine rating based on symptom patterns
  // Wrist limitation of motion: maximum 10% for limitation
  // Higher ratings (30-50%) require ankylosis (fusion)
  // 10%: Dorsiflexion <15° OR palmar flexion in line with forearm

  if (limitedROMCount >= 10 || (painCount >= 12 && episodesPerWeek >= 3)) {
    supportedRating = '10';
    ratingRationale.push(
        `${totalEpisodes} wrist episodes documented`,
        `${painCount} pain episodes`,
        'Supports 10% rating for limited motion'
    );
    ratingRationale.push('Higher ratings (30-50%) require documented ankylosis (fusion)');
  }
  else if (totalEpisodes >= 6) {
    supportedRating = '10';
    ratingRationale.push(
        `${totalEpisodes} wrist episodes in ${evaluationPeriodDays} days`,
        'Supports 10% for limitation of motion'
    );
  }
  else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited wrist symptoms documented',
        'May support 10% if ROM limitation confirmed'
    );
  }

  // Documentation gaps
  if (totalEpisodes < 8) {
    gaps.push(`Only ${totalEpisodes} episodes logged - aim for 8+ over 90 days`);
  }
  if (painCount === 0) {
    gaps.push('Document wrist pain episodes');
  }
  if (limitedROMCount === 0) {
    gaps.push('Document limited ROM episodes');
  }
  gaps.push('Orthopedic exam with ROM measurements required');
  gaps.push('Document which wrist (dominant/non-dominant) - affects rating');
  gaps.push('Note: Wrist limitation max is 10%. Higher ratings require ankylosis.');
  gaps.push('If numbness present, consider separate peripheral nerve evaluation');
  gaps.push('X-rays showing arthritis or carpal abnormalities strengthen claim');

  return {
    condition: 'Wrist Conditions',
    diagnosticCode: '5214-5215',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: WRIST_CRITERIA,
    disclaimer: WRIST_CRITERIA.disclaimer,
  };
};


// ============================================
// ANALYSIS FUNCTIONS - ELBOW
// ============================================

/**
 * Analyzes elbow symptom logs to determine supported VA rating level
 */

export const analyzeElbowLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter elbow symptom logs
  const elbowSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.ELBOW.symptomIds.includes(getLogSymptomId(log));
  });

  if (elbowSymptoms.length === 0) {
    return {
      condition: 'Elbow Conditions',
      diagnosticCode: '5205-5207',
      hasData: false,
      message: 'No elbow symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-pain').length;
  const limitedFlexionCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-limited-flexion').length;
  const limitedExtensionCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-limited-extension').length;
  const stiffnessCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-stiffness').length;
  const weaknessCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-weakness').length;
  const instabilityCount = elbowSymptoms.filter(s => getLogSymptomId(s) === 'elbow-instability').length;

  const totalLimitedROM = limitedFlexionCount + limitedExtensionCount;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} elbow pain episodes documented`);
  if (limitedFlexionCount > 0) evidence.push(`${limitedFlexionCount} limited flexion episodes`);
  if (limitedExtensionCount > 0) evidence.push(`${limitedExtensionCount} limited extension episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (instabilityCount > 0) evidence.push(`${instabilityCount} instability episodes`);

  const totalEpisodes = elbowSymptoms.length;
  const episodesPerWeek = totalEpisodes / (evaluationPeriodDays / 7);

  evidence.push(`${totalEpisodes} total elbow episodes in ${evaluationPeriodDays} days (~${episodesPerWeek.toFixed(1)}/week)`);

  // Determine rating based on symptom patterns
  // Elbow ratings range from 10% (slight limitation) to 60% (ankylosis)
  // Flexion limited to 100° = 10%
  // Flexion limited to 90° = 20%
  // Flexion limited to 70° = 30%
  // Extension limited to 45-60° = 10%
  // Extension limited to 75° = 20%

  if (totalLimitedROM >= 15 && painCount >= 15) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${totalLimitedROM} limited ROM episodes`,
        `${painCount} pain episodes`,
        'Pattern suggests significant limitation'
    );
    gaps.push('ROM measurements will determine actual rating (20-30%)');
    gaps.push('Flexion to 70° = 30%, to 90° = 20%');
    gaps.push('Extension to 75° = 20%, to 90° = 30%');
  }
  else if (totalLimitedROM >= 8 || (painCount >= 10 && episodesPerWeek >= 2)) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${totalEpisodes} elbow episodes`,
        'Supports 10-20% rating range'
    );
    gaps.push('ROM measurements determine rating level');
  }
  else if (totalEpisodes >= 6) {
    supportedRating = '10';
    ratingRationale.push(
        `${totalEpisodes} elbow episodes documented`,
        'Supports 10% for limitation'
    );
  }
  else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited elbow symptoms documented',
        'May support 10% if limitation confirmed'
    );
  }

  // Documentation gaps
  if (totalEpisodes < 8) {
    gaps.push(`Only ${totalEpisodes} episodes logged - aim for 8+ over 90 days`);
  }
  if (painCount === 0) {
    gaps.push('Document elbow pain episodes');
  }
  if (totalLimitedROM === 0) {
    gaps.push('Document limited flexion and/or extension episodes');
  }
  gaps.push('Orthopedic exam with ROM measurements required');
  gaps.push('Document which arm (dominant/non-dominant) - affects rating');
  gaps.push('Track functional impact: lifting, carrying, reaching');
  gaps.push('X-rays showing arthritis or abnormalities strengthen claim');

  return {
    condition: 'Elbow Conditions',
    diagnosticCode: '5205-5207',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: ELBOW_CRITERIA,
    disclaimer: ELBOW_CRITERIA.disclaimer,
  };
};


// ============================================
// ANALYSIS FUNCTIONS - DEGENERATIVE ARTHRITIS
// ============================================

/**
 * Analyzes degenerative arthritis symptom logs to determine supported VA rating level
 */

export const analyzeDegenerativeArthritisLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter arthritis symptom logs
  const arthritisSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.DEGENERATIVE_ARTHRITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (arthritisSymptoms.length === 0) {
    return {
      condition: 'Degenerative Arthritis (Osteoarthritis)',
      diagnosticCode: '5003',
      hasData: false,
      message: 'No arthritis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const jointPainCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-joint-pain').length;
  const morningStiffnessCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-morning-stiffness').length;
  const flareCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-flare').length;
  const reducedFunctionCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-reduced-function').length;
  const swellingCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-swelling').length;
  const crepitusCount = arthritisSymptoms.filter(s => getLogSymptomId(s) === 'arthritis-crepitus').length;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (jointPainCount > 0) evidence.push(`${jointPainCount} joint pain episodes documented`);
  if (morningStiffnessCount > 0) evidence.push(`${morningStiffnessCount} morning stiffness episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} flare-ups/exacerbations`);
  if (reducedFunctionCount > 0) evidence.push(`${reducedFunctionCount} reduced function episodes`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);
  if (crepitusCount > 0) evidence.push(`${crepitusCount} grinding/crepitus episodes`);

  const totalEpisodes = arthritisSymptoms.length;
  const episodesPerWeek = totalEpisodes / (evaluationPeriodDays / 7);

  evidence.push(`${totalEpisodes} total arthritis episodes in ${evaluationPeriodDays} days (~${episodesPerWeek.toFixed(1)}/week)`);

  // Determine rating based on symptom patterns
  // DC 5003 ratings when ROM limitation is noncompensable:
  // 20%: X-ray evidence in 2+ major joints WITH incapacitating exacerbations
  // 10%: X-ray evidence in 2+ major joints WITHOUT incapacitating exacerbations
  // When ROM limitation IS compensable, rate under specific joint code

  if (flareCount >= 3 && (jointPainCount >= 15 || episodesPerWeek >= 3)) {
    supportedRating = '20';
    ratingRationale.push(
        `${flareCount} flare-ups/exacerbations documented`,
        `${totalEpisodes} total episodes`,
        'Pattern suggests incapacitating exacerbations'
    );
    gaps.push('X-rays of affected joints required for 20% rating');
    gaps.push('Document 2 or more major joints affected');
    gaps.push('Document flare-ups that limit work or daily activities');
  }
  else if (totalEpisodes >= 10 || episodesPerWeek >= 2) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${totalEpisodes} arthritis episodes documented`,
        'Supports 10-20% rating depending on X-ray findings'
    );
    gaps.push('X-rays of affected joints needed');
    gaps.push('20% requires incapacitating exacerbations');
  }
  else if (totalEpisodes >= 5) {
    supportedRating = '10';
    ratingRationale.push(
        `${totalEpisodes} arthritis episodes`,
        'Supports 10% with X-ray evidence of 2+ joints'
    );
  }
  else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited arthritis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (totalEpisodes < 8) {
    gaps.push(`Only ${totalEpisodes} episodes logged - aim for 8+ over 90 days`);
  }
  if (jointPainCount === 0) {
    gaps.push('Joint pain is primary symptom - document pain episodes');
  }
  if (morningStiffnessCount === 0) {
    gaps.push('Morning stiffness is key indicator - document duration');
  }
  if (flareCount === 0) {
    gaps.push('Document flare-ups that limit activities');
  }

  gaps.push('X-ray evidence is REQUIRED for DC 5003 rating');
  gaps.push('Document which joints are affected (name specific joints)');
  gaps.push('Major joints: shoulder, elbow, wrist, hip, knee, ankle');
  gaps.push('If a specific joint has compensable ROM limitation, rate under that joint code instead');

  return {
    condition: 'Degenerative Arthritis (Osteoarthritis)',
    diagnosticCode: '5003',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: DEGENERATIVE_ARTHRITIS_CRITERIA,
    disclaimer: DEGENERATIVE_ARTHRITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4A: ANALYSIS FUNCTIONS - GOUT (DC 5017)
// ============================================

/**
 * Analyzes gout symptom logs to determine supported VA rating level
 * Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
 */

export const analyzeGoutLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter gout symptom logs
  const goutSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.GOUT.symptomIds.includes(getLogSymptomId(log));
  });

  if (goutSymptoms.length === 0) {
    return {
      condition: 'Gout',
      diagnosticCode: '5017',
      hasData: false,
      message: 'No gout symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const acuteAttackCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-acute-attack').length;
  const jointPainCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-joint-pain').length;
  const swellingCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-swelling').length;
  const rednessCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-redness').length;
  const limitedMotionCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-limited-motion').length;
  const tophiCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-tophi').length;
  const functionalLossCount = goutSymptoms.filter(s => getLogSymptomId(s) === 'gout-functional-loss').length;

  // Calculate average severity for pain logs
  const painLogs = goutSymptoms.filter(s =>
      ['gout-acute-attack', 'gout-joint-pain'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (acuteAttackCount > 0) evidence.push(`${acuteAttackCount} acute gout attacks documented`);
  if (jointPainCount > 0) evidence.push(`${jointPainCount} joint pain episodes`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);
  if (rednessCount > 0) evidence.push(`${rednessCount} redness/warmth episodes`);
  if (limitedMotionCount > 0) evidence.push(`${limitedMotionCount} limited motion episodes`);
  if (tophiCount > 0) evidence.push(`${tophiCount} tophi documented`);
  if (functionalLossCount > 0) evidence.push(`${functionalLossCount} functional loss episodes`);

  const totalEpisodes = goutSymptoms.length;
  const attacksPerMonth = (acuteAttackCount / (evaluationPeriodDays / 30)).toFixed(1);

  evidence.push(`${totalEpisodes} total gout episodes in ${evaluationPeriodDays} days`);
  evidence.push(`~${attacksPerMonth} acute attacks per month`);

  // Determine rating based on symptom patterns
  // Rated as degenerative arthritis: 20% with incapacitating exacerbations, 10% without
  if ((acuteAttackCount >= 3 && functionalLossCount >= 2) || (acuteAttackCount >= 4)) {
    supportedRating = 20;
    ratingRationale.push(
        `${acuteAttackCount} acute gout attacks documented`,
        `${functionalLossCount} episodes with functional loss`,
        'Pattern suggests incapacitating exacerbations'
    );
    gaps.push('X-rays or imaging showing gouty changes required for rating');
    gaps.push('Document if multiple joints are affected');
    gaps.push('Lab values (uric acid levels) strengthen the claim');
  } else if (acuteAttackCount >= 2 || totalEpisodes >= 10) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${acuteAttackCount} acute attacks documented`,
        `${totalEpisodes} total gout episodes`,
        'Supports 10-20% rating depending on imaging and functional impact'
    );
    gaps.push('X-rays or imaging needed for rating');
    gaps.push('20% requires incapacitating exacerbations');
  } else if (totalEpisodes >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        `${totalEpisodes} gout episodes documented`,
        'Supports 10% with imaging evidence'
    );
  } else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited gout symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (acuteAttackCount === 0) {
    gaps.push('Document acute gout attacks with date and affected joint');
  }
  if (tophiCount === 0) {
    gaps.push('Document any tophi (urate crystal deposits) if present');
  }
  if (limitedMotionCount === 0) {
    gaps.push('Document limitation of motion during attacks');
  }
  gaps.push('Lab values showing elevated uric acid strengthen the claim');
  gaps.push('X-ray or imaging evidence required for VA rating');
  gaps.push('Document which specific joint(s) are affected');
  gaps.push('If ROM limitation is compensable, rate under specific joint code');

  return {
    condition: 'Gout',
    diagnosticCode: '5017',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      acuteAttacks: acuteAttackCount,
      painDays: jointPainCount + acuteAttackCount,
      avgPain: avgSeverity,
      limitedROM: limitedMotionCount,
      flareUps: acuteAttackCount,
    },
    criteria: GOUT_CRITERIA,
    disclaimer: GOUT_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4A: ANALYSIS FUNCTIONS - BURSITIS (DC 5019)
// ============================================

/**
 * Analyzes bursitis symptom logs to determine supported VA rating level
 * Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
 */

export const analyzeBursitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter bursitis symptom logs
  const bursitisSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.BURSITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (bursitisSymptoms.length === 0) {
    return {
      condition: 'Bursitis',
      diagnosticCode: '5019',
      hasData: false,
      message: 'No bursitis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-pain').length;
  const swellingCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-swelling').length;
  const tendernessCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-tenderness').length;
  const limitedMotionCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-limited-motion').length;
  const stiffnessCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-stiffness').length;
  const flareCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-flare').length;
  const functionalLossCount = bursitisSymptoms.filter(s => getLogSymptomId(s) === 'bursitis-functional-loss').length;

  // Calculate average severity
  const painLogs = bursitisSymptoms.filter(s =>
      ['bursitis-pain', 'bursitis-flare'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} pain episodes documented`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);
  if (tendernessCount > 0) evidence.push(`${tendernessCount} tenderness episodes`);
  if (limitedMotionCount > 0) evidence.push(`${limitedMotionCount} limited motion episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} flare-ups documented`);
  if (functionalLossCount > 0) evidence.push(`${functionalLossCount} functional loss episodes`);

  const totalEpisodes = bursitisSymptoms.length;
  const flaresPerMonth = (flareCount / (evaluationPeriodDays / 30)).toFixed(1);

  evidence.push(`${totalEpisodes} total bursitis episodes in ${evaluationPeriodDays} days`);

  // Determine rating based on symptom patterns
  if ((flareCount >= 3 && functionalLossCount >= 2) || (flareCount >= 4 && limitedMotionCount >= 3)) {
    supportedRating = 20;
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${functionalLossCount} episodes with functional loss`,
        'Pattern suggests incapacitating exacerbations'
    );
    gaps.push('Imaging (ultrasound/MRI) showing bursitis required for rating');
    gaps.push('Document if multiple bursae/joints are affected');
  } else if (flareCount >= 2 || totalEpisodes >= 10) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${totalEpisodes} total bursitis episodes`,
        'Supports 10-20% rating depending on imaging and functional impact'
    );
    gaps.push('Imaging evidence needed for rating');
    gaps.push('20% requires incapacitating exacerbations');
  } else if (totalEpisodes >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        `${totalEpisodes} bursitis episodes documented`,
        'Supports 10% with imaging evidence'
    );
  } else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited bursitis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (painCount === 0) {
    gaps.push('Document pain episodes at affected bursa');
  }
  if (limitedMotionCount === 0) {
    gaps.push('Document limitation of motion');
  }
  if (flareCount === 0) {
    gaps.push('Document flare-ups that limit activities');
  }
  gaps.push('Imaging (ultrasound/MRI) required for VA rating');
  gaps.push('Document which specific bursa/joint is affected');
  gaps.push('Injection records strengthen claims');
  gaps.push('If ROM limitation is compensable, rate under specific joint code');

  return {
    condition: 'Bursitis',
    diagnosticCode: '5019',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      painDays: painCount,
      avgPain: avgSeverity,
      limitedROM: limitedMotionCount,
      flareUps: flareCount,
    },
    criteria: BURSITIS_CRITERIA,
    disclaimer: BURSITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4A: ANALYSIS FUNCTIONS - TENDINITIS (DC 5024)
// ============================================

/**
 * Analyzes tendinitis symptom logs to determine supported VA rating level
 * Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
 */

export const analyzeTendinitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter tendinitis symptom logs
  const tendinitisSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.TENDINITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (tendinitisSymptoms.length === 0) {
    return {
      condition: 'Tendinitis/Tenosynovitis',
      diagnosticCode: '5024',
      hasData: false,
      message: 'No tendinitis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-pain').length;
  const swellingCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-swelling').length;
  const tendernessCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-tenderness').length;
  const limitedMotionCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-limited-motion').length;
  const stiffnessCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-stiffness').length;
  const crepitusCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-crepitus').length;
  const weaknessCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-weakness').length;
  const flareCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-flare').length;
  const functionalLossCount = tendinitisSymptoms.filter(s => getLogSymptomId(s) === 'tendinitis-functional-loss').length;

  // Calculate average severity
  const painLogs = tendinitisSymptoms.filter(s =>
      ['tendinitis-pain', 'tendinitis-flare'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} pain episodes documented`);
  if (swellingCount > 0) evidence.push(`${swellingCount} swelling episodes`);
  if (tendernessCount > 0) evidence.push(`${tendernessCount} tenderness episodes`);
  if (limitedMotionCount > 0) evidence.push(`${limitedMotionCount} limited motion episodes`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (crepitusCount > 0) evidence.push(`${crepitusCount} crepitus/clicking episodes`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} flare-ups documented`);
  if (functionalLossCount > 0) evidence.push(`${functionalLossCount} functional loss episodes`);

  const totalEpisodes = tendinitisSymptoms.length;

  evidence.push(`${totalEpisodes} total tendinitis episodes in ${evaluationPeriodDays} days`);

  // Determine rating based on symptom patterns
  if ((flareCount >= 3 && functionalLossCount >= 2) || (flareCount >= 4 && limitedMotionCount >= 3)) {
    supportedRating = 20;
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${functionalLossCount} episodes with functional loss`,
        'Pattern suggests incapacitating exacerbations'
    );
    gaps.push('Imaging (ultrasound/MRI) showing tendon pathology required for rating');
    gaps.push('Document if multiple tendons are affected');
  } else if (flareCount >= 2 || totalEpisodes >= 10) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${totalEpisodes} total tendinitis episodes`,
        'Supports 10-20% rating depending on imaging and functional impact'
    );
    gaps.push('Imaging evidence needed for rating');
    gaps.push('20% requires incapacitating exacerbations');
  } else if (totalEpisodes >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        `${totalEpisodes} tendinitis episodes documented`,
        'Supports 10% with imaging evidence'
    );
  } else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited tendinitis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (painCount === 0) {
    gaps.push('Document pain along affected tendon');
  }
  if (limitedMotionCount === 0) {
    gaps.push('Document limitation of motion');
  }
  if (flareCount === 0) {
    gaps.push('Document flare-ups that limit activities');
  }
  gaps.push('Imaging (ultrasound/MRI) required for VA rating');
  gaps.push('Document which specific tendon is affected');
  gaps.push('Common types: rotator cuff, tennis/golfer\'s elbow, Achilles, patellar');
  gaps.push('If ROM limitation is compensable, rate under specific joint code');

  return {
    condition: 'Tendinitis/Tenosynovitis',
    diagnosticCode: '5024',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      painDays: painCount,
      avgPain: avgSeverity,
      limitedROM: limitedMotionCount,
      flareUps: flareCount,
    },
    criteria: TENDINITIS_CRITERIA,
    disclaimer: TENDINITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// ANKLE/ACHILLES TENDON ANALYSIS
// ============================================


export function analyzeAnkleAchillesLogs(logs, profileId) {
  if (!logs || logs.length === 0) {
    return { hasData: false };
  }

  // Filter logs for ankle/achilles symptoms
  const relevantLogs = logs.filter(log => {
    if (log.profileId && log.profileId !== profileId) return false;

    const symptomId = getLogSymptomId(log);
    return symptomId && (
        symptomId.includes('ankle') ||
        symptomId.includes('achilles') ||
        symptomId.includes('foot-pain') ||
        symptomId.includes('heel-pain')
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = relevantLogs.length;

  // Count pain episodes
  const painDays = relevantLogs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomId && symptomId.includes('pain');
  }).length;

  // Count limited ROM episodes
  const limitedROM = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('stiff') ||
        notes.includes('limited') ||
        notes.includes('cannot move') ||
        notes.includes('frozen') ||
        notes.includes('rom');
  }).length;

  // Count flare-ups
  const flareUps = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('flare') ||
        notes.includes('swell') ||
        notes.includes('inflammation');
  }).length;

  // Calculate average severity
  const logsWithSeverity = relevantLogs.filter(log => log.severity && log.severity > 0);
  const avgSeverity = logsWithSeverity.length > 0
      ? logsWithSeverity.reduce((sum, log) => sum + log.severity, 0) / logsWithSeverity.length
      : 0;

  // Determine supported rating
  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // Check for ankylosis/frozen ankle (40%)
  const hasAnkylosis = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('frozen') ||
        notes.includes('ankylosis') ||
        notes.includes('cannot move');
  });

  if (hasAnkylosis) {
    supportedRating = 40;
    rationale.push('Documentation shows ankle is frozen or cannot be moved (ankylosis)');
  }
  // Severe limitation (30%)
  else if (limitedROM >= totalLogs * 0.6) {
    supportedRating = 30;
    rationale.push('Frequent severe limitation of motion documented (60%+ of logs)');
  }
  // Moderate limitation (20%)
  else if (limitedROM >= totalLogs * 0.4 || flareUps >= 3) {
    supportedRating = 20;
    rationale.push('Regular limitation of motion or significant flare-ups documented');
  }
  // Mild limitation (10%)
  else if (limitedROM > 0 || avgSeverity >= 5) {
    supportedRating = 10;
    rationale.push('Some limitation of motion and/or moderate pain levels documented');
  }

  // Evidence gaps
  if (totalLogs < 10) {
    evidenceGaps.push('Consider documenting more symptom occurrences (at least 10 entries recommended)');
  }

  const hasRomMeasurements = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('degrees') || notes.includes('°') || notes.includes('rom');
  });

  if (!hasRomMeasurements) {
    evidenceGaps.push('Measure and document range of motion in degrees (use goniometer if available)');
  }

  const hasAssistiveDevice = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('brace') || notes.includes('crutch') || notes.includes('cane');
  });

  if (!hasAssistiveDevice && supportedRating >= 20) {
    evidenceGaps.push('Document any use of ankle braces, crutches, or other assistive devices');
  }

  return {
    hasData: true,
    condition: 'Ankle / Achilles Tendon',
    diagnosticCode: '5270-5274',
    cfrReference: '38 CFR 4.71a (Musculoskeletal)',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      avgSeverity: Number(avgSeverity.toFixed(1)),
      painDays,
      limitedROM,
      flareUps,
    },
    criteria: ANKLE_ACHILLES_CRITERIA,
  };
}

// ============================================
// HIP/THIGH ANALYSIS
// ============================================


export function analyzeHipThighLogs(logs, profileId) {
  if (!logs || logs.length === 0) {
    return { hasData: false };
  }

  // Filter logs for hip/thigh symptoms
  const relevantLogs = logs.filter(log => {
    if (log.profileId && log.profileId !== profileId) return false;

    const symptomId = getLogSymptomId(log);
    return symptomId && (
        symptomId.includes('hip') ||
        symptomId.includes('thigh') ||
        symptomId.includes('groin') ||
        symptomId.includes('trochanteric')
    );
  });

  if (relevantLogs.length === 0) {
    return { hasData: false };
  }

  // Calculate metrics
  const totalLogs = relevantLogs.length;

  // Count pain episodes
  const painDays = relevantLogs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomId && symptomId.includes('pain');
  }).length;

  // Count limited ROM episodes
  const limitedROM = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('stiff') ||
        notes.includes('limited') ||
        notes.includes('cannot') ||
        notes.includes('difficult') ||
        notes.includes('rom');
  }).length;

  // Count assistive device usage
  const assistiveDevice = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('crutch') ||
        notes.includes('cane') ||
        notes.includes('walker');
  }).length;

  // Calculate average severity
  const logsWithSeverity = relevantLogs.filter(log => log.severity && log.severity > 0);
  const avgSeverity = logsWithSeverity.length > 0
      ? logsWithSeverity.reduce((sum, log) => sum + log.severity, 0) / logsWithSeverity.length
      : 0;

  // Determine supported rating
  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // Check for ankylosis/severe limitation requiring assistive devices (70-90%)
  const requiresCrutches = assistiveDevice >= totalLogs * 0.6;
  if (requiresCrutches) {
    supportedRating = 70;
    rationale.push('Frequent use of assistive devices documented (crutches/cane required)');
  }
  // Ankylosis (60%)
  else if (relevantLogs.some(log => (log.notes || '').toLowerCase().includes('frozen'))) {
    supportedRating = 60;
    rationale.push('Documentation shows hip is frozen in position (ankylosis)');
  }
  // Severe limitation (40%)
  else if (limitedROM >= totalLogs * 0.7) {
    supportedRating = 40;
    rationale.push('Severe limitation of motion documented (70%+ of logs)');
  }
  // Moderate limitation (30%)
  else if (limitedROM >= totalLogs * 0.5) {
    supportedRating = 30;
    rationale.push('Moderate limitation of motion documented (50%+ of logs)');
  }
  // Regular limitation (20%)
  else if (limitedROM >= totalLogs * 0.3 || avgSeverity >= 6) {
    supportedRating = 20;
    rationale.push('Regular limitation of motion or significant pain documented');
  }
  // Mild limitation (10%)
  else if (limitedROM > 0 || avgSeverity >= 4) {
    supportedRating = 10;
    rationale.push('Some limitation of motion and/or moderate pain levels documented');
  }

  // Evidence gaps
  if (totalLogs < 10) {
    evidenceGaps.push('Consider documenting more symptom occurrences (at least 10 entries recommended)');
  }

  const hasRomMeasurements = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('degrees') || notes.includes('°') || notes.includes('flexion') || notes.includes('abduction');
  });

  if (!hasRomMeasurements) {
    evidenceGaps.push('Measure and document range of motion in degrees (flexion, extension, abduction, adduction, rotation)');
  }

  const hasFunctionalImpact = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('stairs') || notes.includes('walking') || notes.includes('sitting') || notes.includes('standing');
  });

  if (!hasFunctionalImpact) {
    evidenceGaps.push('Document impact on daily activities (stairs, walking distance, sitting, standing)');
  }

  return {
    hasData: true,
    condition: 'Hip and Thigh',
    diagnosticCode: '5250-5255',
    cfrReference: '38 CFR Part 4, §4.71a',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      avgSeverity: Number(avgSeverity.toFixed(1)),
      painDays,
      limitedROM,
      assistiveDevice,
    },
    criteria: HIP_THIGH_CRITERIA,
  };
}

// ============================================
// PHASE 4B: ANALYSIS FUNCTIONS - MYOSITIS (DC 5021)
// ============================================

/**
 * Analyzes myositis symptom logs to determine supported VA rating level
 * Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
 */

export const analyzeMyositisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter myositis symptom logs
  const myositisSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.MYOSITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (myositisSymptoms.length === 0) {
    return {
      condition: 'Myositis',
      diagnosticCode: '5021',
      hasData: false,
      message: 'No myositis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const painCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-muscle-pain').length;
  const weaknessCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-weakness').length;
  const fatigueCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-fatigue').length;
  const limitedMotionCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-limited-motion').length;
  const flareCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-flare').length;
  const functionalLossCount = myositisSymptoms.filter(s => getLogSymptomId(s) === 'myositis-functional-loss').length;

  // Calculate average severity
  const painLogs = myositisSymptoms.filter(s =>
      ['myositis-muscle-pain', 'myositis-flare'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (painCount > 0) evidence.push(`${painCount} muscle pain episodes documented`);
  if (weaknessCount > 0) evidence.push(`${weaknessCount} weakness episodes`);
  if (fatigueCount > 0) evidence.push(`${fatigueCount} fatigue episodes`);
  if (limitedMotionCount > 0) evidence.push(`${limitedMotionCount} limited motion episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} flare-ups documented`);
  if (functionalLossCount > 0) evidence.push(`${functionalLossCount} functional loss episodes`);

  const totalEpisodes = myositisSymptoms.length;

  evidence.push(`${totalEpisodes} total myositis episodes in ${evaluationPeriodDays} days`);

  // Determine rating based on symptom patterns
  if ((flareCount >= 3 && functionalLossCount >= 2) || (flareCount >= 4 && weaknessCount >= 5)) {
    supportedRating = 20;
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${functionalLossCount} episodes with functional loss`,
        'Pattern suggests incapacitating exacerbations'
    );
    gaps.push('Lab values (CK, aldolase) showing muscle inflammation required');
    gaps.push('Document if multiple muscle groups are affected');
  } else if (flareCount >= 2 || totalEpisodes >= 10) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${flareCount} flare-ups documented`,
        `${totalEpisodes} total myositis episodes`,
        'Supports 10-20% rating depending on clinical findings'
    );
    gaps.push('Lab values and/or muscle biopsy needed for rating');
    gaps.push('20% requires incapacitating exacerbations');
  } else if (totalEpisodes >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        `${totalEpisodes} myositis episodes documented`,
        'Supports 10% with documented diagnosis'
    );
  } else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited myositis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (painCount === 0) {
    gaps.push('Document muscle pain episodes');
  }
  if (weaknessCount === 0) {
    gaps.push('Document muscle weakness - key symptom');
  }
  if (flareCount === 0) {
    gaps.push('Document flare-ups that limit activities');
  }
  gaps.push('Lab values (CK, aldolase) showing elevated muscle enzymes strengthen claim');
  gaps.push('Muscle biopsy or MRI showing inflammation is strong evidence');
  gaps.push('Document which muscle groups are affected');

  return {
    condition: 'Myositis',
    diagnosticCode: '5021',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      painDays: painCount,
      avgPain: avgSeverity,
      limitedROM: limitedMotionCount,
      flareUps: flareCount,
    },
    criteria: MYOSITIS_CRITERIA,
    disclaimer: MYOSITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4B: ANALYSIS FUNCTIONS - OSTEOMYELITIS (DC 5000)
// ============================================

/**
 * Analyzes osteomyelitis symptom logs to determine supported VA rating level
 * Has its own unique rating schedule
 */

export const analyzeOsteomyelitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter osteomyelitis symptom logs
  const osteoSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.OSTEOMYELITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (osteoSymptoms.length === 0) {
    return {
      condition: 'Osteomyelitis',
      diagnosticCode: '5000',
      hasData: false,
      message: 'No osteomyelitis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const bonePainCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-bone-pain').length;
  const feverCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-fever').length;
  const drainageCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-drainage').length;
  const constitutionalCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-constitutional').length;
  const flareCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-flare').length;
  const weightLossCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-weight-loss').length;
  const fatigueCount = osteoSymptoms.filter(s => getLogSymptomId(s) === 'osteo-fatigue').length;

  // Calculate average severity
  const painLogs = osteoSymptoms.filter(s =>
      ['osteo-bone-pain', 'osteo-flare'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (bonePainCount > 0) evidence.push(`${bonePainCount} bone pain episodes documented`);
  if (feverCount > 0) evidence.push(`${feverCount} fever episodes`);
  if (drainageCount > 0) evidence.push(`${drainageCount} draining sinus/wound documented`);
  if (constitutionalCount > 0) evidence.push(`${constitutionalCount} constitutional symptom episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} active infection episodes`);
  if (weightLossCount > 0) evidence.push(`${weightLossCount} weight loss episodes`);
  if (fatigueCount > 0) evidence.push(`${fatigueCount} fatigue episodes`);

  const totalEpisodes = osteoSymptoms.length;

  evidence.push(`${totalEpisodes} total osteomyelitis episodes in ${evaluationPeriodDays} days`);

  // Determine rating based on symptom patterns (DC 5000 specific criteria)
  const hasConstitutionalSymptoms = constitutionalCount > 0 || (feverCount >= 3 && (weightLossCount > 0 || fatigueCount >= 3));
  const hasDrainingSinus = drainageCount > 0;
  const hasFrequentEpisodes = flareCount >= 4;

  if (hasConstitutionalSymptoms && hasFrequentEpisodes) {
    supportedRating = '60-100';
    ratingRationale.push(
        `${flareCount} active infection episodes documented`,
        `${constitutionalCount} constitutional symptom episodes`,
        'Pattern suggests frequent episodes with constitutional symptoms',
        '100% requires pelvis/vertebrae, major joints, or multiple localization'
    );
    gaps.push('Document which bone(s) are affected');
    gaps.push('100% requires pelvis, vertebrae, major joint involvement, or multiple sites');
  } else if (hasDrainingSinus) {
    supportedRating = '20-30';
    ratingRationale.push(
        `${drainageCount} draining sinus/wound episodes documented`,
        '30% requires involucrum or sequestrum on imaging',
        '20% requires active infection evidence within past 5 years'
    );
    gaps.push('Imaging showing involucrum/sequestrum needed for 30%');
  } else if (flareCount >= 2 || (feverCount >= 2 && bonePainCount >= 3)) {
    supportedRating = '10-20';
    ratingRationale.push(
        `${flareCount} active infection episodes`,
        'Supports 10-20% based on infection history',
        '20% requires active infection evidence within past 5 years'
    );
    gaps.push('Document infection episodes and treatment');
    gaps.push('Need evidence of recurrent osteomyelitis (2+ episodes after initial)');
  } else if (totalEpisodes >= 5) {
    supportedRating = 10;
    ratingRationale.push(
        'History of osteomyelitis documented',
        '10% requires inactive disease following repeated episodes'
    );
  } else {
    supportedRating = '0-10';
    ratingRationale.push(
        'Limited osteomyelitis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (drainageCount === 0) {
    gaps.push('Document any draining sinuses or wounds');
  }
  if (constitutionalCount === 0 && feverCount === 0) {
    gaps.push('Document constitutional symptoms (fever, fatigue, weight loss)');
  }
  gaps.push('Imaging (X-ray, MRI, bone scan) showing bone involvement is essential');
  gaps.push('Lab values (WBC, ESR, CRP) during active infection strengthen claim');
  gaps.push('Document which specific bone(s) are affected');
  gaps.push('Antibiotic treatment records strengthen claim');

  return {
    condition: 'Osteomyelitis',
    diagnosticCode: '5000',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      painDays: bonePainCount,
      avgPain: avgSeverity,
      drainingSinus: drainageCount,
      flareUps: flareCount,
    },
    criteria: OSTEOMYELITIS_CRITERIA,
    disclaimer: OSTEOMYELITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4B: ANALYSIS FUNCTIONS - MULTI-JOINT ARTHRITIS (DC 5002)
// ============================================

/**
 * Analyzes multijoint arthritis symptom logs to determine supported VA rating level
 * Has its own unique rating schedule for active inflammatory process
 */

export const analyzeMultiJointArthritisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter multijoint arthritis symptom logs
  const mjaSymptoms = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.MULTI_JOINT_ARTHRITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (mjaSymptoms.length === 0) {
    return {
      condition: 'Multi-Joint Arthritis (Active Process)',
      diagnosticCode: '5002',
      hasData: false,
      message: 'No multi-joint arthritis symptoms logged in the evaluation period',
    };
  }

  // Count symptom types
  const jointPainCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-joint-pain').length;
  const jointSwellingCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-joint-swelling').length;
  const morningStiffnessCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-morning-stiffness').length;
  const fatigueCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-fatigue').length;
  const weightLossCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-weight-loss').length;
  const anemiaCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-anemia').length;
  const feverCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-fever').length;
  const flareCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-flare').length;
  const incapacitatingCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-incapacitating').length;
  const functionalLossCount = mjaSymptoms.filter(s => getLogSymptomId(s) === 'mja-functional-loss').length;

  // Calculate average severity
  const painLogs = mjaSymptoms.filter(s =>
      ['mja-joint-pain', 'mja-flare', 'mja-incapacitating'].includes(getLogSymptomId(s)) && s.severity
  );
  const avgSeverity = painLogs.length > 0
      ? (painLogs.reduce((sum, log) => sum + log.severity, 0) / painLogs.length).toFixed(1)
      : null;

  const evidence = [];
  const gaps = [];
  const ratingRationale = [];
  let supportedRating = 0;

  // Build evidence
  if (jointPainCount > 0) evidence.push(`${jointPainCount} joint pain episodes documented`);
  if (jointSwellingCount > 0) evidence.push(`${jointSwellingCount} joint swelling episodes`);
  if (morningStiffnessCount > 0) evidence.push(`${morningStiffnessCount} morning stiffness episodes`);
  if (fatigueCount > 0) evidence.push(`${fatigueCount} fatigue episodes`);
  if (weightLossCount > 0) evidence.push(`${weightLossCount} weight loss documented`);
  if (anemiaCount > 0) evidence.push(`${anemiaCount} anemia symptom episodes`);
  if (feverCount > 0) evidence.push(`${feverCount} fever episodes`);
  if (flareCount > 0) evidence.push(`${flareCount} flare-ups documented`);
  if (incapacitatingCount > 0) evidence.push(`${incapacitatingCount} incapacitating episodes`);
  if (functionalLossCount > 0) evidence.push(`${functionalLossCount} functional loss episodes`);

  const totalEpisodes = mjaSymptoms.length;
  const totalIncapacitating = incapacitatingCount + Math.floor(flareCount * 0.5); // flares partially count

  evidence.push(`${totalEpisodes} total multi-joint arthritis episodes in ${evaluationPeriodDays} days`);

  // Determine rating based on DC 5002 criteria
  const hasConstitutionalSymptoms = weightLossCount > 0 || anemiaCount > 0 || feverCount >= 2;
  const hasWeightLossAndAnemia = weightLossCount > 0 && anemiaCount > 0;

  if (hasConstitutionalSymptoms && incapacitatingCount >= 4 && functionalLossCount >= 4) {
    supportedRating = '60-100';
    ratingRationale.push(
        `${incapacitatingCount} incapacitating episodes documented`,
        'Constitutional symptoms present (weight loss, anemia, fever)',
        '100% requires totally incapacitating disease'
    );
  } else if (hasWeightLossAndAnemia || incapacitatingCount >= 4) {
    supportedRating = 60;
    ratingRationale.push(
        'Weight loss AND anemia documented, OR',
        `${incapacitatingCount} incapacitating exacerbations`,
        'Supports 60% rating'
    );
  } else if (incapacitatingCount >= 3 || (flareCount >= 4 && functionalLossCount >= 3)) {
    supportedRating = 40;
    ratingRationale.push(
        `${incapacitatingCount} incapacitating exacerbations`,
        `${flareCount} flare-ups with ${functionalLossCount} functional loss episodes`,
        'Supports 40% rating'
    );
  } else if (flareCount >= 1 || incapacitatingCount >= 1) {
    supportedRating = 20;
    ratingRationale.push(
        `${flareCount + incapacitatingCount} exacerbations documented`,
        'Supports 20% for 1-2 exacerbations per year'
    );
  } else if (totalEpisodes >= 5) {
    supportedRating = '0-20';
    ratingRationale.push(
        'Multi-joint arthritis symptoms documented',
        '20% requires documented exacerbations'
    );
  } else {
    supportedRating = '0-20';
    ratingRationale.push(
        'Limited multi-joint arthritis symptoms documented',
        'Continue logging for stronger documentation'
    );
  }

  // Documentation gaps
  if (incapacitatingCount === 0) {
    gaps.push('Document incapacitating episodes (unable to work/perform daily activities)');
  }
  if (weightLossCount === 0) {
    gaps.push('Document any weight loss');
  }
  if (anemiaCount === 0) {
    gaps.push('Document anemia symptoms if present (fatigue, pallor)');
  }
  gaps.push('Lab values (ESR, CRP, RF, anti-CCP) showing active inflammation essential');
  gaps.push('Document which joints are affected (need 2+ joints for DC 5002)');
  gaps.push('Rheumatology records confirming diagnosis strengthen claim');
  gaps.push('For chronic residuals after active process resolves, rate under DC 5003');

  return {
    condition: 'Multi-Joint Arthritis (Active Process)',
    diagnosticCode: '5002',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics: {
      totalLogs: totalEpisodes,
      painDays: jointPainCount,
      avgPain: avgSeverity,
      incapacitatingEpisodes: incapacitatingCount,
      flareUps: flareCount,
    },
    criteria: MULTI_JOINT_ARTHRITIS_CRITERIA,
    disclaimer: MULTI_JOINT_ARTHRITIS_CRITERIA.disclaimer,
  };
};

// ============================================
// PHASE 4C: ANALYSIS FUNCTIONS - SPINE EXPANSION
// DC 5235, 5236, 5238, 5240, 5241
// ============================================

/**
 * Helper function to calculate spine rating based on General Rating Formula
 * Used by all spine condition analysis functions
 */
const calculateSpineRating = (symptoms, metrics) => {
  const {
    limitedFlexionCount = 0,
    limitedExtensionCount = 0,
    muscleSpasmsCount = 0,
    functionalLossCount = 0,
    totalLogs = 0,
    avgSeverity = 0,
  } = metrics;

  let supportedRating = 0;
  const ratingRationale = [];

  // Check for severe limitation indicators (40% rating)
  if (avgSeverity >= 8 && functionalLossCount >= 5) {
    supportedRating = 40;
    ratingRationale.push(`Severe symptoms (avg severity ${avgSeverity.toFixed(1)}/10) suggest significant ROM limitation`);
    ratingRationale.push(`${functionalLossCount} functional loss episodes documented`);
    ratingRationale.push('Pattern consistent with forward flexion <=30° - requires clinical ROM measurement to confirm');
  }
  // Check for moderate-severe indicators (20% rating)
  else if (avgSeverity >= 6 || (limitedFlexionCount >= 3 && muscleSpasmsCount >= 2)) {
    supportedRating = 20;
    ratingRationale.push(`Moderate-severe symptoms documented (avg severity ${avgSeverity.toFixed(1)}/10)`);
    if (limitedFlexionCount >= 3) {
      ratingRationale.push(`${limitedFlexionCount} episodes of limited flexion logged`);
    }
    if (muscleSpasmsCount >= 2) {
      ratingRationale.push(`${muscleSpasmsCount} muscle spasm episodes - may indicate abnormal gait/contour`);
    }
    ratingRationale.push('Pattern suggests forward flexion 30-60° or abnormal gait - requires clinical confirmation');
  }
  // Check for mild-moderate indicators (10% rating)
  else if (totalLogs >= 3 || avgSeverity >= 4) {
    supportedRating = 10;
    ratingRationale.push(`${totalLogs} total symptom logs over evaluation period`);
    ratingRationale.push(`Average severity ${avgSeverity.toFixed(1)}/10`);
    ratingRationale.push('Pattern suggests mild-moderate limitation (forward flexion 60-85°)');
  }
  // Minimal symptoms
  else if (totalLogs > 0) {
    supportedRating = 0;
    ratingRationale.push('Minimal symptoms documented');
    ratingRationale.push('Continue logging to establish pattern if symptoms persist');
  }

  return { supportedRating, ratingRationale };
};

/**
 * Analyze Vertebral Fracture logs for VA rating
 * DC 5235 - Vertebral Fracture or Dislocation
 */

export const analyzeVertebralFractureLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.VERTEBRAL_FRACTURE.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Vertebral Fracture or Dislocation',
      diagnosticCode: '5235',
      cfrReference: '38 CFR 4.71a',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'No vertebral fracture symptoms logged in evaluation period',
        'Log pain at fracture site and severity',
        'Document any height loss or kyphosis',
        'Track limited motion and functional limitations',
        'Note radiating pain or numbness if present',
      ],
      metrics: { totalLogs: 0 },
      criteria: VERTEBRAL_FRACTURE_CRITERIA,
    };
  }

  // Count symptom types
  const painCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-pain').length;
  const limitedFlexionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-limited-flexion').length;
  const limitedExtensionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-limited-extension').length;
  const muscleSpasmsCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-muscle-spasm').length;
  const heightLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-height-loss').length;
  const kyphosisCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-kyphosis').length;
  const radiculopathyCount = relevantLogs.filter(l => ['vfx-radicular', 'vfx-numbness'].includes(getLogSymptomId(l))).length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'vfx-functional-loss').length;

  // Calculate average severity
  const severities = relevantLogs.filter(l => l.severity).map(l => l.severity);
  const avgSeverity = severities.length > 0 ? severities.reduce((a, b) => a + b, 0) / severities.length : 0;

  const metrics = {
    totalLogs: relevantLogs.length,
    painCount,
    limitedFlexionCount,
    limitedExtensionCount,
    muscleSpasmsCount,
    heightLossCount,
    kyphosisCount,
    radiculopathyCount,
    functionalLossCount,
    avgSeverity,
  };

  // Calculate rating using shared function
  let { supportedRating, ratingRationale } = calculateSpineRating(relevantLogs, metrics);

  // Special consideration for vertebral height loss (10% minimum)
  if (heightLossCount > 0 && supportedRating < 10) {
    supportedRating = 10;
    ratingRationale.push('Vertebral height loss documented - qualifies for minimum 10% if >=50% height loss confirmed on imaging');
  }

  // Add fracture-specific rationale
  if (kyphosisCount > 0) {
    ratingRationale.push(`Kyphosis (hunched posture) documented ${kyphosisCount} times - indicates structural change`);
  }

  // Build evidence array
  const evidence = [];
  evidence.push(`${relevantLogs.length} vertebral fracture symptoms logged`);
  if (painCount > 0) evidence.push(`${painCount} pain episodes at fracture site`);
  if (heightLossCount > 0) evidence.push(`Height loss/compression documented`);
  if (radiculopathyCount > 0) evidence.push(`${radiculopathyCount} neurologic symptoms - may warrant separate rating`);

  // Identify gaps
  const gaps = [];
  if (limitedFlexionCount === 0) gaps.push('Document limited forward bending (flexion) when it occurs');
  if (heightLossCount === 0) gaps.push('If vertebral compression exists, log height loss - qualifies for minimum 10%');
  if (radiculopathyCount === 0 && avgSeverity >= 5) gaps.push('Document any radiating pain or numbness for potential separate neurologic rating');
  gaps.push('Obtain current imaging (X-ray/CT) documenting fracture and any height loss');
  gaps.push('Get ROM measurements from healthcare provider using goniometer');

  return {
    hasData: true,
    condition: 'Vertebral Fracture or Dislocation',
    diagnosticCode: '5235',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics,
    criteria: VERTEBRAL_FRACTURE_CRITERIA,
    disclaimer: VERTEBRAL_FRACTURE_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Sacroiliac Injury logs for VA rating
 * DC 5236 - Sacroiliac Injury and Weakness
 */

export const analyzeSacroiliacInjuryLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.SACROILIAC_INJURY.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Sacroiliac Injury and Weakness',
      diagnosticCode: '5236',
      cfrReference: '38 CFR 4.71a',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'No sacroiliac symptoms logged in evaluation period',
        'Log SI joint pain location and severity',
        'Document referred pain to buttock, hip, groin, or leg',
        'Track difficulty with sitting, standing, or walking',
        'Note morning stiffness duration',
      ],
      metrics: { totalLogs: 0 },
      criteria: SACROILIAC_INJURY_CRITERIA,
    };
  }

  // Count symptom types
  const siPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-pain').length;
  const buttockPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-buttock-pain').length;
  const referredPainCount = relevantLogs.filter(l => ['si-hip-pain', 'si-groin-pain', 'si-leg-pain'].includes(getLogSymptomId(l))).length;
  const stiffnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-stiffness').length;
  const instabilityCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-instability').length;
  const functionalDifficultyCount = relevantLogs.filter(l => ['si-difficulty-sitting', 'si-difficulty-standing', 'si-difficulty-walking'].includes(getLogSymptomId(l))).length;
  const limitedFlexionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-limited-flexion').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'si-functional-loss').length;

  // Calculate average severity
  const severities = relevantLogs.filter(l => l.severity).map(l => l.severity);
  const avgSeverity = severities.length > 0 ? severities.reduce((a, b) => a + b, 0) / severities.length : 0;

  const metrics = {
    totalLogs: relevantLogs.length,
    siPainCount,
    buttockPainCount,
    referredPainCount,
    stiffnessCount,
    instabilityCount,
    functionalDifficultyCount,
    limitedFlexionCount,
    functionalLossCount,
    avgSeverity,
  };

  // Calculate rating
  const { supportedRating, ratingRationale } = calculateSpineRating(relevantLogs, {
    ...metrics,
    muscleSpasmsCount: instabilityCount, // SI instability similar to spasm in impact
  });

  // Add SI-specific rationale
  if (referredPainCount > 0) {
    ratingRationale.push(`${referredPainCount} referred pain episodes (hip/groin/leg) - characteristic of SI dysfunction`);
  }
  if (functionalDifficultyCount > 0) {
    ratingRationale.push(`${functionalDifficultyCount} episodes of difficulty sitting/standing/walking`);
  }

  // Build evidence
  const evidence = [];
  evidence.push(`${relevantLogs.length} SI joint symptoms logged`);
  if (siPainCount > 0) evidence.push(`${siPainCount} direct SI joint pain episodes`);
  if (buttockPainCount > 0) evidence.push(`${buttockPainCount} buttock pain episodes`);
  if (instabilityCount > 0) evidence.push(`${instabilityCount} joint instability episodes`);

  // Identify gaps
  const gaps = [];
  if (stiffnessCount === 0) gaps.push('Document morning stiffness and duration');
  if (limitedFlexionCount === 0) gaps.push('Log episodes of limited forward bending');
  if (referredPainCount === 0) gaps.push('Document if pain refers to hip, groin, or leg');
  gaps.push('SI joint provocative tests (FABER, Gaenslen) by examiner support diagnosis');
  gaps.push('ROM measurements of thoracolumbar spine needed for rating');

  return {
    hasData: true,
    condition: 'Sacroiliac Injury and Weakness',
    diagnosticCode: '5236',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics,
    criteria: SACROILIAC_INJURY_CRITERIA,
    disclaimer: SACROILIAC_INJURY_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Spinal Stenosis logs for VA rating
 * DC 5238 - Spinal Stenosis
 */

export const analyzeSpinalStenosisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.SPINAL_STENOSIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Spinal Stenosis',
      diagnosticCode: '5238',
      cfrReference: '38 CFR 4.71a',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'No spinal stenosis symptoms logged in evaluation period',
        'Log back pain episodes and severity',
        'Document leg pain with walking (neurogenic claudication)',
        'Track walking distance limitations',
        'Note if sitting or bending forward provides relief',
      ],
      metrics: { totalLogs: 0 },
      criteria: SPINAL_STENOSIS_CRITERIA,
    };
  }

  // Count symptom types
  const backPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-back-pain').length;
  const legPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-leg-pain').length;
  const legWeaknessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-leg-weakness').length;
  const numbnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-numbness').length;
  const walkingDifficultyCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-walking-difficulty').length;
  const reliefSittingCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-relief-sitting').length;
  const balanceCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-balance-problems').length;
  const limitedFlexionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-limited-flexion').length;
  const limitedExtensionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-limited-extension').length;
  const bladderBowelCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-bladder-bowel').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'ss-functional-loss').length;

  // Calculate average severity
  const severities = relevantLogs.filter(l => l.severity).map(l => l.severity);
  const avgSeverity = severities.length > 0 ? severities.reduce((a, b) => a + b, 0) / severities.length : 0;

  // Neurogenic claudication indicator (leg pain + relief with sitting)
  const neurogenicClaudicationIndicator = legPainCount > 0 && (reliefSittingCount > 0 || walkingDifficultyCount > 0);

  const metrics = {
    totalLogs: relevantLogs.length,
    backPainCount,
    legPainCount,
    legWeaknessCount,
    numbnessCount,
    walkingDifficultyCount,
    reliefSittingCount,
    balanceCount,
    limitedFlexionCount,
    limitedExtensionCount,
    bladderBowelCount,
    functionalLossCount,
    avgSeverity,
    neurogenicClaudicationIndicator,
  };

  // Calculate rating
  const { supportedRating, ratingRationale } = calculateSpineRating(relevantLogs, metrics);

  // Add stenosis-specific rationale
  if (neurogenicClaudicationIndicator) {
    ratingRationale.push('Neurogenic claudication pattern documented (leg symptoms + positional relief)');
  }
  if (walkingDifficultyCount > 0) {
    ratingRationale.push(`${walkingDifficultyCount} episodes of walking difficulty - significant functional impact`);
  }
  if (bladderBowelCount > 0) {
    ratingRationale.push(`Bladder/bowel changes documented - may warrant separate neurologic rating`);
  }

  // Build evidence
  const evidence = [];
  evidence.push(`${relevantLogs.length} spinal stenosis symptoms logged`);
  if (legPainCount > 0) evidence.push(`${legPainCount} neurogenic claudication (leg pain) episodes`);
  if (reliefSittingCount > 0) evidence.push(`Relief with sitting/bending forward documented (classic stenosis sign)`);
  const neurologicCount = legWeaknessCount + numbnessCount + bladderBowelCount;
  if (neurologicCount > 0) evidence.push(`${neurologicCount} neurologic symptoms - consider separate rating`);

  // Identify gaps
  const gaps = [];
  if (reliefSittingCount === 0 && legPainCount > 0) {
    gaps.push('Document if sitting or bending forward relieves leg symptoms (classic stenosis finding)');
  }
  if (walkingDifficultyCount === 0) gaps.push('Track walking distance limitations (e.g., can only walk X blocks)');
  if (bladderBowelCount === 0 && avgSeverity >= 6) {
    gaps.push('Document any bladder/bowel changes - may warrant separate rating');
  }
  gaps.push('MRI showing spinal stenosis is essential for diagnosis');
  gaps.push('ROM measurements needed - stenosis is rated on spine motion limitation');
  gaps.push('Neurologic symptoms (leg weakness, numbness) may warrant separate rating under DC 8520+');

  return {
    hasData: true,
    condition: 'Spinal Stenosis',
    diagnosticCode: '5238',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics,
    criteria: SPINAL_STENOSIS_CRITERIA,
    disclaimer: SPINAL_STENOSIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Ankylosing Spondylitis logs for VA rating
 * DC 5240 - Ankylosing Spondylitis
 */

export const analyzeAnkylosingSpondylitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.ANKYLOSING_SPONDYLITIS.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Ankylosing Spondylitis',
      diagnosticCode: '5240',
      cfrReference: '38 CFR 4.71a',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'No ankylosing spondylitis symptoms logged in evaluation period',
        'Log inflammatory back pain episodes',
        'Document morning stiffness (especially if >30 minutes)',
        'Track night pain and sleep interruption',
        'Note if exercise improves symptoms (characteristic of AS)',
      ],
      metrics: { totalLogs: 0 },
      criteria: ANKYLOSING_SPONDYLITIS_CRITERIA,
    };
  }

  // Count symptom types
  const backPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-back-pain').length;
  const morningStiffnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-morning-stiffness').length;
  const nightPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-night-pain').length;
  const limitedFlexionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-limited-flexion').length;
  const limitedExtensionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-limited-extension').length;
  const limitedLateralCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-limited-lateral').length;
  const chestExpansionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-chest-expansion').length;
  const fatigueCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-fatigue').length;
  const peripheralJointCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-peripheral-joint').length;
  const enthesitisCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-enthesitis').length;
  const flareCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-flare').length;
  const fusionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-fusion').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'as-functional-loss').length;

  // Calculate average severity
  const severities = relevantLogs.filter(l => l.severity).map(l => l.severity);
  const avgSeverity = severities.length > 0 ? severities.reduce((a, b) => a + b, 0) / severities.length : 0;

  // Inflammatory back pain indicators (improves with exercise, worse at rest, morning stiffness >30min)
  const inflammatoryIndicators = morningStiffnessCount + nightPainCount;

  const metrics = {
    totalLogs: relevantLogs.length,
    backPainCount,
    morningStiffnessCount,
    nightPainCount,
    limitedFlexionCount,
    limitedExtensionCount,
    limitedLateralCount,
    chestExpansionCount,
    fatigueCount,
    peripheralJointCount,
    enthesitisCount,
    flareCount,
    fusionCount,
    functionalLossCount,
    avgSeverity,
    inflammatoryIndicators,
  };

  // Calculate rating
  let { supportedRating, ratingRationale } = calculateSpineRating(relevantLogs, {
    ...metrics,
    muscleSpasmsCount: flareCount, // Flares indicate active disease
  });

  // Ankylosis/fusion documented - higher ratings
  if (fusionCount > 0) {
    if (supportedRating < 40) {
      supportedRating = 40;
      ratingRationale.push('Spinal fusion symptoms documented - minimum 40% for favorable thoracolumbar ankylosis');
    }
    ratingRationale.push(`${fusionCount} fusion-related symptom logs - confirm ankylosis on imaging`);
  }

  // Add AS-specific rationale
  if (inflammatoryIndicators >= 3) {
    ratingRationale.push(`Inflammatory back pain pattern: ${morningStiffnessCount} morning stiffness, ${nightPainCount} night pain episodes`);
  }
  if (chestExpansionCount > 0) {
    ratingRationale.push('Reduced chest expansion documented - indicates thoracic involvement');
  }
  if (enthesitisCount > 0) {
    ratingRationale.push(`${enthesitisCount} enthesitis episodes - characteristic AS finding`);
  }

  // Build evidence
  const evidence = [];
  evidence.push(`${relevantLogs.length} ankylosing spondylitis symptoms logged`);
  if (morningStiffnessCount > 0) evidence.push(`${morningStiffnessCount} prolonged morning stiffness episodes`);
  if (nightPainCount > 0) evidence.push(`${nightPainCount} night pain episodes (awakening from sleep)`);
  if (flareCount > 0) evidence.push(`${flareCount} disease flares documented`);
  if (fusionCount > 0) evidence.push('Spinal fusion symptoms reported');

  // Identify gaps
  const gaps = [];
  if (morningStiffnessCount === 0) gaps.push('Document morning stiffness and duration (>30 min characteristic of AS)');
  if (nightPainCount === 0) gaps.push('Log night pain/sleep interruption if occurring');
  if (chestExpansionCount === 0) gaps.push('Track chest expansion limitation if present');
  gaps.push('HLA-B27 test and inflammatory markers (ESR, CRP) support diagnosis');
  gaps.push('X-ray/MRI showing sacroiliitis or spinal fusion confirms diagnosis');
  gaps.push('ROM measurements essential - AS typically causes progressive motion loss');

  return {
    hasData: true,
    condition: 'Ankylosing Spondylitis',
    diagnosticCode: '5240',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics,
    criteria: ANKYLOSING_SPONDYLITIS_CRITERIA,
    disclaimer: ANKYLOSING_SPONDYLITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Spinal Fusion logs for VA rating
 * DC 5241 - Spinal Fusion
 */

export const analyzeSpinalFusionLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && MUSCULOSKELETAL_CONDITIONS.SPINAL_FUSION.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Spinal Fusion',
      diagnosticCode: '5241',
      cfrReference: '38 CFR 4.71a',
      supportedRating: null,
      ratingRationale: [],
      gaps: [
        'No spinal fusion symptoms logged in evaluation period',
        'Log pain at fusion site and severity',
        'Document stiffness and mobility limitations',
        'Track adjacent segment pain if present',
        'Note any hardware-related discomfort',
      ],
      metrics: { totalLogs: 0 },
      criteria: SPINAL_FUSION_CRITERIA,
    };
  }

  // Count symptom types
  const fusionPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-pain').length;
  const adjacentPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-adjacent-pain').length;
  const stiffnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-stiffness').length;
  const limitedFlexionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-limited-flexion').length;
  const limitedExtensionCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-limited-extension').length;
  const limitedRotationCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-limited-rotation').length;
  const muscleSpasmsCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-muscle-spasm').length;
  const radiculopathyCount = relevantLogs.filter(l => ['sf-radicular', 'sf-numbness'].includes(getLogSymptomId(l))).length;
  const hardwarePainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-hardware-pain').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'sf-functional-loss').length;

  // Calculate average severity
  const severities = relevantLogs.filter(l => l.severity).map(l => l.severity);
  const avgSeverity = severities.length > 0 ? severities.reduce((a, b) => a + b, 0) / severities.length : 0;

  // Total ROM limitation indicators
  const totalRomLimitation = limitedFlexionCount + limitedExtensionCount + limitedRotationCount;

  const metrics = {
    totalLogs: relevantLogs.length,
    fusionPainCount,
    adjacentPainCount,
    stiffnessCount,
    limitedFlexionCount,
    limitedExtensionCount,
    limitedRotationCount,
    muscleSpasmsCount,
    radiculopathyCount,
    hardwarePainCount,
    functionalLossCount,
    avgSeverity,
    totalRomLimitation,
  };

  // Calculate rating - spinal fusion inherently limits ROM
  let { supportedRating, ratingRationale } = calculateSpineRating(relevantLogs, metrics);

  // Spinal fusion typically warrants at least 10% due to ROM loss
  if (supportedRating < 10 && relevantLogs.length >= 3) {
    supportedRating = 10;
    ratingRationale.push('Spinal fusion inherently limits ROM - minimum 10% typically appropriate');
  }

  // Multi-segment fusion indicators
  if (stiffnessCount >= 5 && totalRomLimitation >= 5) {
    if (supportedRating < 20) {
      supportedRating = 20;
      ratingRationale.push('Significant stiffness and ROM limitation pattern suggests multi-level or extensive fusion');
    }
  }

  // Add fusion-specific rationale
  if (adjacentPainCount > 0) {
    ratingRationale.push(`${adjacentPainCount} adjacent segment pain episodes - common post-fusion complication`);
  }
  if (hardwarePainCount > 0) {
    ratingRationale.push(`${hardwarePainCount} hardware-related pain episodes documented`);
  }

  // Build evidence
  const evidence = [];
  evidence.push(`${relevantLogs.length} post-fusion symptoms logged`);
  if (fusionPainCount > 0) evidence.push(`${fusionPainCount} pain episodes at fusion site`);
  if (stiffnessCount > 0) evidence.push(`${stiffnessCount} stiffness episodes`);
  if (adjacentPainCount > 0) evidence.push(`Adjacent segment disease symptoms present`);
  if (radiculopathyCount > 0) evidence.push(`${radiculopathyCount} neurologic symptoms - may warrant separate rating`);

  // Identify gaps
  const gaps = [];
  if (limitedFlexionCount === 0) gaps.push('Document limited forward bending (most affected by fusion)');
  if (stiffnessCount === 0) gaps.push('Log stiffness episodes - expected with fusion');
  if (adjacentPainCount === 0 && avgSeverity >= 5) {
    gaps.push('Track if pain occurs above/below fusion (adjacent segment disease)');
  }
  gaps.push('Surgical records documenting fusion levels are essential');
  gaps.push('Post-operative imaging showing fusion status');
  gaps.push('ROM measurements by healthcare provider - rating based on remaining motion');

  return {
    hasData: true,
    condition: 'Spinal Fusion',
    diagnosticCode: '5241',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    metrics,
    criteria: SPINAL_FUSION_CRITERIA,
    disclaimer: SPINAL_FUSION_CRITERIA.disclaimer,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - ASTHMA
// ============================================

/**
 * Analyzes asthma logs and measurements to determine supported rating level
 */

export const analyzeAmputationLogs = (logs) => {
  const amputationLogs = logs.filter(log => {
    const symptomId = log.symptomId || '';
    return symptomId.includes('amputation') ||
        symptomId.includes('loss-of-use') ||
        symptomId.includes('prosthetic-hand') ||
        symptomId.includes('prosthetic-arm') ||
        symptomId.includes('prosthetic-foot') ||
        symptomId.includes('prosthetic-leg');
  });

  if (amputationLogs.length === 0) {
    return {
      hasData: false,
      message: 'No amputation or extremity loss symptoms logged'
    };
  }

  // Detect specific losses
  const losses = {
    // Hands
    rightHand: amputationLogs.some(l =>
        l.symptomId?.includes('hand-right') ||
        l.symptomId?.includes('prosthetic-hand-right')
    ),
    leftHand: amputationLogs.some(l =>
        l.symptomId?.includes('hand-left') ||
        l.symptomId?.includes('prosthetic-hand-left')
    ),
    // Feet
    rightFoot: amputationLogs.some(l =>
        l.symptomId?.includes('foot-right') ||
        l.symptomId?.includes('prosthetic-foot-right')
    ),
    leftFoot: amputationLogs.some(l =>
        l.symptomId?.includes('foot-left') ||
        l.symptomId?.includes('prosthetic-foot-left')
    ),
    // Arms
    rightArm: amputationLogs.some(l =>
        l.symptomId?.includes('arm') && l.symptomId?.includes('right')
    ),
    leftArm: amputationLogs.some(l =>
        l.symptomId?.includes('arm') && l.symptomId?.includes('left')
    ),
    // Legs
    rightLeg: amputationLogs.some(l =>
        l.symptomId?.includes('leg') && l.symptomId?.includes('right')
    ),
    leftLeg: amputationLogs.some(l =>
        l.symptomId?.includes('leg') && l.symptomId?.includes('left')
    ),
  };

  // Count SMC-K qualifying losses (hands and feet)
  let smcKAwards = 0;
  const smcKQualifying = [];

  if (losses.rightHand) {
    smcKAwards++;
    smcKQualifying.push('Right Hand');
  }
  if (losses.leftHand) {
    smcKAwards++;
    smcKQualifying.push('Left Hand');
  }
  if (losses.rightFoot) {
    smcKAwards++;
    smcKQualifying.push('Right Foot');
  }
  if (losses.leftFoot) {
    smcKAwards++;
    smcKQualifying.push('Left Foot');
  }

  // Build rationale
  const rationale = [];
  const evidenceGaps = [];

  if (smcKQualifying.length > 0) {
    rationale.push(`⭐ SMC-K eligible: Loss of ${smcKQualifying.join(', ')} documented`);
    rationale.push(`Qualifies for ${Math.min(smcKAwards, 3)} SMC-K award(s) under 38 CFR § 3.350(a)`);
  }

  // Check for higher SMC levels
  const hasBilateralHands = losses.rightHand && losses.leftHand;
  const hasBilateralFeet = losses.rightFoot && losses.leftFoot;
  const hasArmLoss = losses.rightArm || losses.leftArm;
  const hasLegLoss = losses.rightLeg || losses.leftLeg;

  if (hasBilateralHands || hasBilateralFeet) {
    rationale.push('⭐ May qualify for SMC-L or higher due to bilateral loss');
  }
  if (hasArmLoss) {
    rationale.push('Arm amputation documented - may affect SMC level');
  }
  if (hasLegLoss) {
    rationale.push('Leg amputation documented - may affect SMC level');
  }

  // Determine supported rating (simplified - actual rating depends on specifics)
  let supportedRating = 0;
  if (hasArmLoss || hasLegLoss) {
    supportedRating = 60; // Minimum for major amputation
  } else if (losses.rightHand || losses.leftHand) {
    supportedRating = 60; // Loss of hand
  } else if (losses.rightFoot || losses.leftFoot) {
    supportedRating = 40; // Loss of foot
  }

  // Evidence gaps
  evidenceGaps.push('Obtain VA examination documenting amputation level');
  evidenceGaps.push('Document prosthetic usage and functional limitations');
  evidenceGaps.push('For loss of use claims: Document remaining function vs. amputation stump');

  const smcKEligible = smcKAwards > 0;

  return {
    condition: 'Amputation / Extremity Loss',
    diagnosticCode: 'DC 5120-5173',
    hasData: true,
    totalLogs: amputationLogs.length,
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: amputationLogs.length,
      losses,
      smcKAwards: Math.min(smcKAwards, 3),
      smcKQualifying,
      hasBilateralHands,
      hasBilateralFeet,
    },
    criteriaReference: AMPUTATION_CRITERIA,
    // SMC-K Eligibility
    smcEligible: smcKEligible,
    smcData: smcKEligible ? {
      level: 'K',
      category: 'EXTREMITY_LOSS',
      awards: Math.min(smcKAwards, 3),
      autoGrant: true,
      qualifying: smcKQualifying,
      note: `Loss of use of ${smcKQualifying.join(', ')} qualifies for ${Math.min(smcKAwards, 3)} SMC-K award(s) under 38 CFR § 3.350(a).`,
    } : null,
  };
};

/**
 * Analyze ADL (Activities of Daily Living) logs for Aid & Attendance eligibility
 * Based on 38 CFR § 3.352(a)
 */

export const analyzeADLLogs = (logs) => {
  const adlLogs = logs.filter(log => {
    const symptomId = log.symptomId || '';
    return symptomId.startsWith('adl-');
  });

  if (adlLogs.length === 0) {
    return {
      hasData: false,
      message: 'No ADL limitations logged. Track daily living difficulties to assess A&A eligibility.',
    };
  }

  // Analyze each ADL factor
  const factors = {
    dressing: adlLogs.some(l =>
        l.symptomId?.includes('dress') || l.symptomId?.includes('undress')
    ),
    hygiene: adlLogs.some(l =>
        l.symptomId?.includes('hygiene') || l.symptomId?.includes('bath') ||
        l.symptomId?.includes('groom') || l.symptomId?.includes('shave')
    ),
    feeding: adlLogs.some(l =>
        l.symptomId?.includes('feed') || l.symptomId?.includes('eating') ||
        l.symptomId?.includes('utensil') || l.symptomId?.includes('swallow')
    ),
    toileting: adlLogs.some(l =>
        l.symptomId?.includes('toilet') || l.symptomId?.includes('bowel') ||
        l.symptomId?.includes('bladder') || l.symptomId?.includes('catheter') ||
        l.symptomId?.includes('incontinen')
    ),
    mobility: adlLogs.some(l =>
        l.symptomId?.includes('mobility') || l.symptomId?.includes('bed') ||
        l.symptomId?.includes('wheelchair') || l.symptomId?.includes('walk') ||
        l.symptomId?.includes('transfer') || l.symptomId?.includes('chair')
    ),
    safety: adlLogs.some(l =>
        l.symptomId?.includes('safety') || l.symptomId?.includes('supervision') ||
        l.symptomId?.includes('alone') || l.symptomId?.includes('wander') ||
        l.symptomId?.includes('emergency') || l.symptomId?.includes('fire')
    ),
    cognitive: adlLogs.some(l =>
        l.symptomId?.includes('cognitive') || l.symptomId?.includes('memory') ||
        l.symptomId?.includes('orientation') || l.symptomId?.includes('decision') ||
        l.symptomId?.includes('instruction')
    ),
  };

  const factorsAffected = Object.values(factors).filter(Boolean).length;

  // Check for severe indicators
  const hasBedridden = adlLogs.some(l => l.symptomId?.includes('bedridden'));
  const hasTotalDependence = adlLogs.some(l => l.symptomId?.includes('total-depend'));
  const hasNursingLevel = adlLogs.some(l => l.symptomId?.includes('nursing-level'));
  const hasHousebound = adlLogs.some(l => l.symptomId?.includes('housebound'));
  const hasSevereLimit = adlLogs.some(l => l.symptomId?.includes('severe-limit'));

  // Determine potential SMC level
  let potentialSMC = null;

  if (hasNursingLevel || (hasTotalDependence && factors.safety)) {
    potentialSMC = 'R'; // Higher A&A - nursing home level care
  } else if (factorsAffected >= 3 || hasBedridden || hasTotalDependence || hasSevereLimit) {
    potentialSMC = 'L'; // Basic A&A
  } else if (hasHousebound) {
    potentialSMC = 'S'; // Housebound
  }

  // Build rationale
  const rationale = [];

  if (factorsAffected > 0) {
    rationale.push(`${factorsAffected} of 7 ADL factors documented with limitations`);
  }

  Object.entries(factors).forEach(([key, value]) => {
    if (value) {
      const factorNames = {
        dressing: 'Dressing/Undressing',
        hygiene: 'Personal Hygiene',
        feeding: 'Feeding/Eating',
        toileting: 'Toileting/Continence',
        mobility: 'Mobility/Transfers',
        safety: 'Safety/Protection',
        cognitive: 'Cognitive Function',
      };
      rationale.push(`${factorNames[key]} limitations documented`);
    }
  });

  if (hasBedridden) rationale.push('Bedridden status documented - supports higher SMC level');
  if (hasTotalDependence) rationale.push('Total dependence on caregiver documented');
  if (hasNursingLevel) rationale.push('Nursing home level care need documented - supports SMC-R');
  if (hasHousebound) rationale.push('Housebound status documented - supports SMC-S');

  // Evidence gaps
  const evidenceGaps = [];

  if (factorsAffected < 3) {
    evidenceGaps.push('Document at least 3 ADL factors for stronger A&A claim');
  }

  if (!factors.safety && !factors.cognitive) {
    evidenceGaps.push('Document safety concerns or cognitive limitations if applicable');
  }

  evidenceGaps.push('Obtain VA Form 21-2680 examination from physician');
  evidenceGaps.push('Get buddy statements from family/caregivers documenting assistance provided');

  if (!hasBedridden && !hasTotalDependence) {
    evidenceGaps.push('Document frequency of assistance needed (daily, multiple times daily, etc.)');
  }

  return {
    condition: 'Activities of Daily Living',
    diagnosticCode: 'A&A',
    hasData: true,
    totalLogs: adlLogs.length,
    supportedLevel: potentialSMC,
    factorsAffected,
    factors,
    hasBedridden,
    hasTotalDependence,
    hasNursingLevel,
    hasHousebound,
    potentialSMC,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: adlLogs.length,
      factorsAffected,
      severeIndicators: [hasBedridden, hasTotalDependence, hasNursingLevel, hasHousebound].filter(Boolean).length,
    },
  };
};