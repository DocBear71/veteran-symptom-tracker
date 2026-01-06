/**
 * Secondary Conditions Mapping
 *
 * Maps primary service-connected conditions to potential secondary conditions.
 * Based on VA rating criteria and medical nexus relationships.
 *
 * Data structure:
 * - primaryCondition: The condition that's already service-connected
 * - diagnosticCode: VA diagnostic code for primary
 * - secondaryConditions: Array of conditions that can be claimed as secondary
 *
 * Each secondary includes:
 * - name: Condition name
 * - diagnosticCode: VA DC for the secondary
 * - category: Grouping (e.g., 'cardiovascular', 'neurological')
 * - nexusStrength: 'strong' | 'moderate' | 'possible' - how established the connection is
 * - notes: Additional information about the connection
 * - smcPotential: true if this secondary could qualify for SMC
 */

export const SECONDARY_CONDITIONS_MAP = {
  // ============================================
  // DIABETES MELLITUS (DC 7913)
  // ============================================
  'diabetes': {
    primaryCondition: 'Diabetes Mellitus',
    diagnosticCode: '7913',
    category: 'endocrine',
    secondaryConditions: [
      // Kidney
      {
        name: 'Diabetic Nephropathy',
        diagnosticCode: '7541',
        category: 'renal',
        nexusStrength: 'strong',
        notes: 'Kidney damage from diabetes. Common complication.',
      },
      // Nerves
      {
        name: 'Peripheral Neuropathy - Lower Extremities',
        diagnosticCode: '8520',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Nerve damage causing numbness, pain, tingling in feet/legs. Very common in diabetics.',
      },
      {
        name: 'Peripheral Neuropathy - Upper Extremities',
        diagnosticCode: '8515',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Nerve damage in hands/arms. Less common than lower extremity.',
      },
      // Eyes
      {
        name: 'Diabetic Retinopathy',
        diagnosticCode: '6006',
        category: 'vision',
        nexusStrength: 'strong',
        notes: 'Retinal damage from diabetes. Leading cause of blindness in diabetics.',
      },
      {
        name: 'Cataracts',
        diagnosticCode: '6027',
        category: 'vision',
        nexusStrength: 'moderate',
        notes: 'Lens opacity. Diabetics develop cataracts earlier.',
      },
      {
        name: 'Glaucoma',
        diagnosticCode: '6012',
        category: 'vision',
        nexusStrength: 'moderate',
        notes: 'Increased eye pressure. Higher risk in diabetics.',
      },
      // Heart/Circulation
      {
        name: 'Coronary Artery Disease',
        diagnosticCode: '7005',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Heart disease. Diabetes significantly increases risk.',
      },
      {
        name: 'Atherosclerosis',
        diagnosticCode: '7114',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Hardening of arteries. Common in long-term diabetics.',
      },
      {
        name: 'Hypertension',
        diagnosticCode: '7101',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'High blood pressure. Often co-occurs with diabetes.',
      },
      {
        name: 'Stroke/CVA',
        diagnosticCode: '8008',
        category: 'neurological',
        nexusStrength: 'moderate',
        notes: 'Cerebrovascular accident. Increased risk from diabetes.',
      },
      {
        name: 'Peripheral Artery Disease',
        diagnosticCode: '7114',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Poor circulation in extremities. Can lead to amputation.',
      },
      // Skin
      {
        name: 'Diabetic Foot Ulcers',
        diagnosticCode: '7806',
        category: 'skin',
        nexusStrength: 'strong',
        notes: 'Non-healing wounds. May require amputation.',
      },
      {
        name: 'Skin Infections (Bacterial)',
        diagnosticCode: '7820',
        category: 'skin',
        nexusStrength: 'moderate',
        notes: 'Staphylococcal infections - sties, boils, carbuncles.',
      },
      {
        name: 'Skin Infections (Fungal)',
        diagnosticCode: '7813',
        category: 'skin',
        nexusStrength: 'moderate',
        notes: 'Fungal infections - jock itch, yeast, ringworm, athlete\'s foot.',
      },
      // Mental Health
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Higher rates of depression in diabetics due to chronic disease management.',
      },
      // Erectile Dysfunction
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Common complication. May qualify for SMC-K.',
        smcPotential: true,
      },
    ],
  },

  // ============================================
  // HYPERTENSION (DC 7101)
  // ============================================
  'hypertension': {
    primaryCondition: 'Hypertension',
    diagnosticCode: '7101',
    category: 'cardiovascular',
    secondaryConditions: [
      {
        name: 'Hypertensive Heart Disease',
        diagnosticCode: '7007',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Heart damage from chronic high blood pressure.',
      },
      {
        name: 'Coronary Artery Disease',
        diagnosticCode: '7005',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Hypertension is major risk factor for CAD.',
      },
      {
        name: 'Stroke/CVA',
        diagnosticCode: '8008',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Hypertension is leading cause of stroke.',
      },
      {
        name: 'Chronic Kidney Disease',
        diagnosticCode: '7541',
        category: 'renal',
        nexusStrength: 'strong',
        notes: 'Kidney damage from chronic hypertension.',
      },
      {
        name: 'Retinopathy (Hypertensive)',
        diagnosticCode: '6006',
        category: 'vision',
        nexusStrength: 'moderate',
        notes: 'Eye damage from high blood pressure.',
      },
      {
        name: 'Peripheral Artery Disease',
        diagnosticCode: '7114',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'Reduced blood flow to extremities.',
      },
    ],
  },

  // ============================================
  // SLEEP APNEA (DC 6847)
  // ============================================
  'sleepApnea': {
    primaryCondition: 'Sleep Apnea',
    diagnosticCode: '6847',
    category: 'respiratory',
    secondaryConditions: [
      {
        name: 'Hypertension',
        diagnosticCode: '7101',
        category: 'cardiovascular',
        nexusStrength: 'strong',
        notes: 'Sleep apnea is independent risk factor for hypertension.',
      },
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Sleep disruption contributes to depression.',
      },
      {
        name: 'Coronary Artery Disease',
        diagnosticCode: '7005',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'Increased cardiovascular risk from untreated sleep apnea.',
      },
      {
        name: 'Atrial Fibrillation',
        diagnosticCode: '7010',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'Irregular heartbeat associated with sleep apnea.',
      },
      {
        name: 'GERD',
        diagnosticCode: '7346',
        category: 'digestive',
        nexusStrength: 'moderate',
        notes: 'Acid reflux often co-occurs with sleep apnea.',
      },
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'moderate',
        notes: 'Sleep apnea can cause ED. May qualify for SMC-K.',
        smcPotential: true,
      },
    ],
  },

  // ============================================
  // PTSD (DC 9411)
  // ============================================
  'ptsd': {
    primaryCondition: 'PTSD',
    diagnosticCode: '9411',
    category: 'mental-health',
    secondaryConditions: [
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Very commonly co-occurs with PTSD. Usually rated together.',
      },
      {
        name: 'Anxiety Disorder',
        diagnosticCode: '9400',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Often co-occurs. Usually rated together with PTSD.',
      },
      {
        name: 'Sleep Apnea',
        diagnosticCode: '6847',
        category: 'respiratory',
        nexusStrength: 'moderate',
        notes: 'Hypervigilance and sleep disturbance can cause/worsen sleep apnea.',
      },
      {
        name: 'Migraines',
        diagnosticCode: '8100',
        category: 'neurological',
        nexusStrength: 'moderate',
        notes: 'Stress and tension from PTSD can trigger migraines.',
      },
      {
        name: 'IBS',
        diagnosticCode: '7319',
        category: 'digestive',
        nexusStrength: 'moderate',
        notes: 'Gut-brain connection. Stress affects digestive system.',
      },
      {
        name: 'GERD',
        diagnosticCode: '7346',
        category: 'digestive',
        nexusStrength: 'moderate',
        notes: 'Stress can worsen acid reflux.',
      },
      {
        name: 'Hypertension',
        diagnosticCode: '7101',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'Chronic stress contributes to high blood pressure.',
      },
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'moderate',
        notes: 'PTSD medications and psychological factors can cause ED.',
        smcPotential: true,
      },
      {
        name: 'Tinnitus',
        diagnosticCode: '6260',
        category: 'ear',
        nexusStrength: 'moderate',
        notes: 'Can be aggravated by PTSD hypervigilance.',
      },
    ],
  },

  // ============================================
  // TINNITUS (DC 6260)
  // ============================================
  'tinnitus': {
    primaryCondition: 'Tinnitus',
    diagnosticCode: '6260',
    category: 'ear',
    secondaryConditions: [
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Severe tinnitus can lead to depression.',
      },
      {
        name: 'Anxiety',
        diagnosticCode: '9400',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Chronic tinnitus causes anxiety.',
      },
      {
        name: 'Insomnia',
        diagnosticCode: '9410',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Tinnitus interferes with sleep.',
      },
      {
        name: 'Migraines',
        diagnosticCode: '8100',
        category: 'neurological',
        nexusStrength: 'possible',
        notes: 'Some link between tinnitus and migraines.',
      },
    ],
  },

  // ============================================
  // MIGRAINES (DC 8100)
  // ============================================
  'migraines': {
    primaryCondition: 'Migraines',
    diagnosticCode: '8100',
    category: 'neurological',
    secondaryConditions: [
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Chronic pain leads to depression.',
      },
      {
        name: 'Anxiety',
        diagnosticCode: '9400',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Fear of attacks causes anxiety.',
      },
      {
        name: 'Insomnia',
        diagnosticCode: '9410',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Pain disrupts sleep.',
      },
    ],
  },

  // ============================================
  // FIBROMYALGIA (DC 5025)
  // ============================================
  'fibromyalgia': {
    primaryCondition: 'Fibromyalgia',
    diagnosticCode: '5025',
    category: 'musculoskeletal',
    secondaryConditions: [
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Very common comorbidity with fibromyalgia.',
      },
      {
        name: 'Anxiety',
        diagnosticCode: '9400',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Common in fibromyalgia patients.',
      },
      {
        name: 'Migraines',
        diagnosticCode: '8100',
        category: 'neurological',
        nexusStrength: 'moderate',
        notes: 'Headaches common in fibromyalgia.',
      },
      {
        name: 'IBS',
        diagnosticCode: '7319',
        category: 'digestive',
        nexusStrength: 'strong',
        notes: 'Very commonly co-occurs with fibromyalgia.',
      },
      {
        name: 'Chronic Fatigue Syndrome',
        diagnosticCode: '6354',
        category: 'systemic',
        nexusStrength: 'moderate',
        notes: 'Often overlaps with fibromyalgia.',
      },
    ],
  },

  // ============================================
  // PARKINSON'S DISEASE (DC 8004)
  // ============================================
  'parkinsons': {
    primaryCondition: "Parkinson's Disease",
    diagnosticCode: '8004',
    category: 'neurological',
    secondaryConditions: [
      // Movement/Posture
      {
        name: 'Balance Impairment (Vestibular)',
        diagnosticCode: '6204',
        category: 'ear',
        nexusStrength: 'strong',
        notes: 'Peripheral vestibular disorders from Parkinson\'s.',
      },
      // Speech
      {
        name: 'Speech Impairment (Cranial Nerve)',
        diagnosticCode: '8210',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Rate left and right separately.',
      },
      {
        name: 'Aphonia',
        diagnosticCode: '6519',
        category: 'respiratory',
        nexusStrength: 'moderate',
        notes: 'Complete loss of voice. Qualifies for SMC-K at 100%.',
        smcPotential: true,
      },
      // Extremities
      {
        name: 'Upper Extremity Impairment (Radial Nerve)',
        diagnosticCode: '8514',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Tremors, rigidity, stiffness. May qualify for SMC.',
        smcPotential: true,
      },
      {
        name: 'Lower Extremity Impairment (Sciatic Nerve)',
        diagnosticCode: '8520',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Tremors, rigidity, stiffness. May qualify for SMC.',
        smcPotential: true,
      },
      // Autonomic
      {
        name: 'Sleep Apnea',
        diagnosticCode: '6847',
        category: 'respiratory',
        nexusStrength: 'moderate',
        notes: 'Sleep disturbances common in Parkinson\'s.',
      },
      {
        name: 'Neurogenic Bladder',
        diagnosticCode: '7542',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Urinary problems from autonomic dysfunction.',
      },
      {
        name: 'IBS/Constipation',
        diagnosticCode: '7319',
        category: 'digestive',
        nexusStrength: 'strong',
        notes: 'GI dysfunction very common.',
      },
      {
        name: 'Dysphagia (Swallowing Difficulty)',
        diagnosticCode: '7203',
        category: 'digestive',
        nexusStrength: 'strong',
        notes: 'Esophageal stricture from swallowing problems.',
      },
      // Sensory
      {
        name: 'Loss of Smell (Anosmia)',
        diagnosticCode: '6275',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Complete loss of smell. 10% flat rating.',
      },
      // Sexual
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Grant SMC-K when associated with Parkinson\'s.',
        smcPotential: true,
      },
      {
        name: 'Female Sexual Arousal Disorder',
        diagnosticCode: '7632',
        category: 'gynecological',
        nexusStrength: 'strong',
        notes: 'May qualify for SMC-K.',
        smcPotential: true,
      },
      // Mental Health
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Very common in Parkinson\'s patients.',
      },
      {
        name: 'Dementia/Cognitive Impairment',
        diagnosticCode: '9326',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Parkinson\'s dementia.',
      },
      // Cardiovascular
      {
        name: 'Hypertension',
        diagnosticCode: '7101',
        category: 'cardiovascular',
        nexusStrength: 'moderate',
        notes: 'Orthostatic hypotension also common.',
      },
    ],
  },

  // ============================================
  // MULTIPLE SCLEROSIS (DC 8018)
  // ============================================
  'multipleSclerosis': {
    primaryCondition: 'Multiple Sclerosis',
    diagnosticCode: '8018',
    category: 'neurological',
    minimumRating: 30,
    secondaryConditions: [
      // Similar to Parkinson's plus:
      {
        name: 'Visual Disturbances (Diplopia)',
        diagnosticCode: '6090',
        category: 'vision',
        nexusStrength: 'strong',
        notes: 'Double vision common in MS.',
      },
      {
        name: 'Optic Neuritis',
        diagnosticCode: '6026',
        category: 'vision',
        nexusStrength: 'strong',
        notes: 'Inflammation of optic nerve.',
      },
      {
        name: 'Nystagmus',
        diagnosticCode: '6016',
        category: 'vision',
        nexusStrength: 'moderate',
        notes: 'Involuntary eye movements.',
      },
      {
        name: 'Neurogenic Bladder',
        diagnosticCode: '7542',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Voiding dysfunction. Single evaluation even if multiple symptoms.',
      },
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Grant SMC-K when associated with MS.',
        smcPotential: true,
      },
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Very common in MS patients.',
      },
      {
        name: 'Cognitive Impairment',
        diagnosticCode: '9326',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'MS can cause cognitive changes.',
      },
      {
        name: 'Chronic Fatigue',
        diagnosticCode: '6354',
        category: 'systemic',
        nexusStrength: 'strong',
        notes: 'Fatigue is hallmark of MS.',
      },
    ],
  },

  // ============================================
  // ALS (DC 8017)
  // ============================================
  'als': {
    primaryCondition: 'Amyotrophic Lateral Sclerosis (ALS)',
    diagnosticCode: '8017',
    category: 'neurological',
    minimumRating: 100,
    secondaryConditions: [
      {
        name: 'Respiratory Failure',
        diagnosticCode: '6520',
        category: 'respiratory',
        nexusStrength: 'strong',
        notes: 'Stenosis of larynx. May require tracheostomy.',
      },
      {
        name: 'Dysphagia',
        diagnosticCode: '7203',
        category: 'digestive',
        nexusStrength: 'strong',
        notes: 'Swallowing difficulties.',
      },
      {
        name: 'Speech Impairment (Aphonia)',
        diagnosticCode: '6519',
        category: 'respiratory',
        nexusStrength: 'strong',
        notes: 'Loss of voice. SMC-K at 100%.',
        smcPotential: true,
      },
      {
        name: 'Loss of Sphincter Control',
        diagnosticCode: '7332',
        category: 'digestive',
        nexusStrength: 'strong',
        notes: 'Rectum and anus impairment.',
      },
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'strong',
        notes: 'Grant SMC-K when associated with ALS.',
        smcPotential: true,
      },
      {
        name: 'Upper Extremity Impairment',
        diagnosticCode: '5125',
        category: 'musculoskeletal',
        nexusStrength: 'strong',
        notes: 'Loss of use of hand(s). SMC eligible.',
        smcPotential: true,
      },
      {
        name: 'Lower Extremity Impairment',
        diagnosticCode: '5167',
        category: 'musculoskeletal',
        nexusStrength: 'strong',
        notes: 'Loss of use of foot/feet. SMC eligible.',
        smcPotential: true,
      },
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'strong',
        notes: 'Common in terminal illness.',
      },
    ],
  },

  // ============================================
  // BACK CONDITIONS (DC 5235-5243)
  // ============================================
  'backCondition': {
    primaryCondition: 'Back Condition (Spine)',
    diagnosticCode: '5235-5243',
    category: 'musculoskeletal',
    secondaryConditions: [
      {
        name: 'Radiculopathy - Lower Extremity',
        diagnosticCode: '8520',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'Sciatic nerve pain from disc compression.',
      },
      {
        name: 'Radiculopathy - Upper Extremity',
        diagnosticCode: '8515',
        category: 'neurological',
        nexusStrength: 'strong',
        notes: 'For cervical spine conditions.',
      },
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'moderate',
        notes: 'Chronic pain leads to depression.',
      },
      {
        name: 'Erectile Dysfunction',
        diagnosticCode: '7522',
        category: 'genitourinary',
        nexusStrength: 'moderate',
        notes: 'Can result from nerve damage or pain medications.',
        smcPotential: true,
      },
      {
        name: 'Neurogenic Bladder',
        diagnosticCode: '7542',
        category: 'genitourinary',
        nexusStrength: 'moderate',
        notes: 'From cauda equina involvement.',
      },
      {
        name: 'Hip Condition',
        diagnosticCode: '5252',
        category: 'musculoskeletal',
        nexusStrength: 'moderate',
        notes: 'Altered gait from back pain affects hips.',
      },
      {
        name: 'Knee Condition',
        diagnosticCode: '5260',
        category: 'musculoskeletal',
        nexusStrength: 'moderate',
        notes: 'Altered gait from back pain affects knees.',
      },
    ],
  },

  // ============================================
  // KNEE CONDITIONS (DC 5256-5263)
  // ============================================
  'kneeCondition': {
    primaryCondition: 'Knee Condition',
    diagnosticCode: '5256-5263',
    category: 'musculoskeletal',
    secondaryConditions: [
      {
        name: 'Hip Condition (Opposite Side)',
        diagnosticCode: '5252',
        category: 'musculoskeletal',
        nexusStrength: 'moderate',
        notes: 'Compensatory changes from favoring injured knee.',
      },
      {
        name: 'Back Condition',
        diagnosticCode: '5237',
        category: 'musculoskeletal',
        nexusStrength: 'moderate',
        notes: 'Altered gait affects spine.',
      },
      {
        name: 'Ankle Condition (Same Side)',
        diagnosticCode: '5271',
        category: 'musculoskeletal',
        nexusStrength: 'moderate',
        notes: 'Altered gait affects ankle.',
      },
      {
        name: 'Depression',
        diagnosticCode: '9434',
        category: 'mental-health',
        nexusStrength: 'possible',
        notes: 'Chronic pain and limited mobility.',
      },
    ],
  },
};

/**
 * Get secondary conditions for a primary condition
 * @param {string} conditionKey - Key from SECONDARY_CONDITIONS_MAP
 * @returns {object|null} - Secondary conditions data or null if not found
 */
export const getSecondaryConditions = (conditionKey) => {
  return SECONDARY_CONDITIONS_MAP[conditionKey] || null;
};

/**
 * Find what conditions this could be secondary TO
 * @param {string} diagnosticCode - DC code of condition
 * @returns {Array} - Array of primary conditions this could be secondary to
 */
export const findPrimaryConditions = (diagnosticCode) => {
  const results = [];

  Object.entries(SECONDARY_CONDITIONS_MAP).forEach(([key, primary]) => {
    const matchingSecondary = primary.secondaryConditions.find(
        sec => sec.diagnosticCode === diagnosticCode
    );

    if (matchingSecondary) {
      results.push({
        primaryKey: key,
        primaryCondition: primary.primaryCondition,
        primaryDC: primary.diagnosticCode,
        connection: matchingSecondary,
      });
    }
  });

  return results;
};

/**
 * Get all conditions with SMC potential
 * @returns {Array} - Array of conditions that may qualify for SMC
 */
export const getSMCPotentialConditions = () => {
  const results = [];

  Object.entries(SECONDARY_CONDITIONS_MAP).forEach(([key, primary]) => {
    primary.secondaryConditions
    .filter(sec => sec.smcPotential)
    .forEach(sec => {
      results.push({
        primaryKey: key,
        primaryCondition: primary.primaryCondition,
        secondary: sec,
      });
    });
  });

  return results;
};

export default SECONDARY_CONDITIONS_MAP;