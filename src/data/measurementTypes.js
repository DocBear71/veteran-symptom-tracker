// ============================================
// MEASUREMENT TYPES CONFIGURATION
// ============================================
// Defines all trackable measurements for VA disability documentation
// Each measurement type has fields, metadata, validation, and related conditions

export const MEASUREMENT_TYPES = {
  BLOOD_PRESSURE: {
    id: 'blood-pressure',
    name: 'Blood Pressure',
    shortName: 'BP',
    icon: '❤️',
    description: 'Track blood pressure readings for hypertension documentation',

    fields: [
      {
        key: 'systolic',
        label: 'Systolic (top number)',
        unit: 'mmHg',
        type: 'number',
        min: 70,
        max: 250,
        step: 1,
        required: true,
        placeholder: '120',
        help: 'The higher number - pressure when heart beats',
      },
      {
        key: 'diastolic',
        label: 'Diastolic (bottom number)',
        unit: 'mmHg',
        type: 'number',
        min: 40,
        max: 150,
        step: 1,
        required: true,
        placeholder: '80',
        help: 'The lower number - pressure between beats',
      },
      {
        key: 'heartRate',
        label: 'Heart Rate',
        unit: 'bpm',
        type: 'number',
        min: 40,
        max: 200,
        step: 1,
        required: false,
        placeholder: '72',
        help: 'Pulse rate (optional)',
      },
    ],

    metadata: [
      {
        key: 'medicationTaken',
        label: 'BP medication taken today?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'position',
        label: 'Position during reading',
        type: 'select',
        options: [
          { value: 'sitting', label: 'Sitting' },
          { value: 'standing', label: 'Standing' },
          { value: 'lying', label: 'Lying down' },
        ],
        default: 'sitting',
      },
      {
        key: 'arm',
        label: 'Arm used',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
        default: 'left',
      },
    ],

    relatedConditions: ['hypertension'],

    // Interpretation thresholds (based on AHA guidelines)
    interpretation: {
      normal: { systolic: [0, 120], diastolic: [0, 80], label: 'Normal', color: 'green' },
      elevated: { systolic: [120, 130], diastolic: [0, 80], label: 'Elevated', color: 'yellow' },
      stage1: { systolic: [130, 140], diastolic: [80, 90], label: 'Stage 1 Hypertension', color: 'orange' },
      stage2: { systolic: [140, 180], diastolic: [90, 120], label: 'Stage 2 Hypertension', color: 'red' },
      crisis: { systolic: [180, 999], diastolic: [120, 999], label: 'Hypertensive Crisis', color: 'red' },
    },
  },

  BLOOD_GLUCOSE: {
    id: 'blood-glucose',
    name: 'Blood Glucose',
    shortName: 'Glucose',
    icon: '🩸',
    description: 'Track blood glucose levels for diabetes documentation',

    fields: [
      {
        key: 'glucose',
        label: 'Blood Glucose',
        unit: 'mg/dL',
        type: 'number',
        min: 40,
        max: 600,
        step: 1,
        required: true,
        placeholder: '100',
        help: 'Blood sugar level',
      },
    ],

    metadata: [
      {
        key: 'mealTiming',
        label: 'When was this reading taken?',
        type: 'select',
        options: [
          { value: 'fasting', label: 'Fasting (8+ hours no food)' },
          { value: 'before-breakfast', label: 'Before breakfast' },
          { value: 'after-breakfast', label: '1-2 hours after breakfast' },
          { value: 'before-lunch', label: 'Before lunch' },
          { value: 'after-lunch', label: '1-2 hours after lunch' },
          { value: 'before-dinner', label: 'Before dinner' },
          { value: 'after-dinner', label: '1-2 hours after dinner' },
          { value: 'bedtime', label: 'Bedtime' },
          { value: 'random', label: 'Random (anytime)' },
        ],
        default: 'random',
      },
      {
        key: 'medicationTaken',
        label: 'Diabetes medication taken today?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'insulinDose',
        label: 'Insulin dose (if applicable)',
        type: 'number',
        unit: 'units',
        min: 0,
        max: 200,
        required: false,
        placeholder: '10',
      },
    ],

    relatedConditions: ['diabetes'],

    // Interpretation thresholds (ADA guidelines)
    interpretation: {
      low: { glucose: [0, 70], label: 'Low (Hypoglycemia)', color: 'red' },
      normal_fasting: { glucose: [70, 100], label: 'Normal (Fasting)', color: 'green', condition: 'fasting' },
      prediabetes_fasting: { glucose: [100, 126], label: 'Prediabetes (Fasting)', color: 'yellow', condition: 'fasting' },
      diabetes_fasting: { glucose: [126, 999], label: 'Diabetes Range (Fasting)', color: 'red', condition: 'fasting' },
      normal_random: { glucose: [70, 140], label: 'Normal (Random)', color: 'green', condition: 'random' },
      elevated_random: { glucose: [140, 200], label: 'Elevated (Random)', color: 'orange', condition: 'random' },
      high_random: { glucose: [200, 999], label: 'High (Random)', color: 'red', condition: 'random' },
    },
  },

  HBA1C: {
    id: 'hba1c',
    name: 'HbA1c (A1C)',
    shortName: 'A1C',
    icon: '🩸',
    description: 'Track HbA1c for long-term diabetes control (typically measured quarterly)',

    fields: [
      {
        key: 'hba1c',
        label: 'HbA1c',
        unit: '%',
        type: 'number',
        min: 4.0,
        max: 15.0,
        step: 0.1,
        required: true,
        placeholder: '5.7',
        help: '3-month average blood sugar',
      },
    ],

    metadata: [
      {
        key: 'labOrHome',
        label: 'Test type',
        type: 'select',
        options: [
          { value: 'lab', label: 'Lab test (blood draw)' },
          { value: 'home', label: 'Home test kit' },
        ],
        default: 'lab',
      },
    ],

    relatedConditions: ['diabetes'],

    // Interpretation thresholds
    interpretation: {
      normal: { hba1c: [0, 5.7], label: 'Normal', color: 'green' },
      prediabetes: { hba1c: [5.7, 6.5], label: 'Prediabetes', color: 'yellow' },
      diabetes: { hba1c: [6.5, 8.0], label: 'Diabetes', color: 'orange' },
      uncontrolled: { hba1c: [8.0, 99], label: 'Uncontrolled Diabetes', color: 'red' },
    },
  },

  WEIGHT: {
    id: 'weight',
    name: 'Weight & BMI',
    shortName: 'Weight',
    icon: '⚖️',
    description: 'Track weight and calculate BMI',

    fields: [
      {
        key: 'weight',
        label: 'Weight',
        unit: 'lbs',
        type: 'number',
        min: 50,
        max: 800,
        step: 0.1,
        required: true,
        placeholder: '175',
        help: 'Current weight in pounds',
      },
      {
        key: 'height',
        label: 'Height (if changed)',
        unit: 'inches',
        type: 'number',
        min: 36,
        max: 96,
        step: 0.5,
        required: false,
        placeholder: '70',
        help: 'Only enter if height has changed',
      },
    ],

    metadata: [
      {
        key: 'timeOfDay',
        label: 'Time of day',
        type: 'select',
        options: [
          { value: 'morning', label: 'Morning (before eating)' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'evening', label: 'Evening' },
        ],
        default: 'morning',
      },
      {
        key: 'clothed',
        label: 'With clothes?',
        type: 'boolean',
        default: true,
      },
    ],

    relatedConditions: ['diabetes', 'sleep-apnea', 'fibromyalgia'],

    // BMI interpretation (CDC guidelines)
    interpretation: {
      underweight: { bmi: [0, 18.5], label: 'Underweight', color: 'yellow' },
      normal: { bmi: [18.5, 25], label: 'Normal Weight', color: 'green' },
      overweight: { bmi: [25, 30], label: 'Overweight', color: 'orange' },
      obese1: { bmi: [30, 35], label: 'Obesity Class I', color: 'red' },
      obese2: { bmi: [35, 40], label: 'Obesity Class II', color: 'red' },
      obese3: { bmi: [40, 99], label: 'Obesity Class III', color: 'red' },
    },
  },

  OXYGEN_SATURATION: {
    id: 'oxygen-saturation',
    name: 'Oxygen Saturation',
    shortName: 'SpO2',
    icon: '🫁',
    description: 'Track oxygen levels for respiratory conditions',

    fields: [
      {
        key: 'spo2',
        label: 'Oxygen Saturation',
        unit: '%',
        type: 'number',
        min: 70,
        max: 100,
        step: 1,
        required: true,
        placeholder: '98',
        help: 'Blood oxygen level (SpO2)',
      },
      {
        key: 'heartRate',
        label: 'Heart Rate',
        unit: 'bpm',
        type: 'number',
        min: 40,
        max: 200,
        step: 1,
        required: false,
        placeholder: '72',
        help: 'Pulse rate (optional)',
      },
    ],

    metadata: [
      {
        key: 'activity',
        label: 'Activity level',
        type: 'select',
        options: [
          { value: 'resting', label: 'Resting' },
          { value: 'light-activity', label: 'Light activity' },
          { value: 'walking', label: 'Walking' },
          { value: 'exertion', label: 'After exertion' },
          { value: 'sleeping', label: 'During sleep' },
        ],
        default: 'resting',
      },
      {
        key: 'oxygenUse',
        label: 'Using supplemental oxygen?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'oxygenFlow',
        label: 'Oxygen flow rate (if applicable)',
        type: 'number',
        unit: 'L/min',
        min: 0,
        max: 15,
        required: false,
        placeholder: '2',
      },
    ],

    relatedConditions: ['sleep-apnea', 'copd', 'asthma'],

    // Interpretation thresholds
    interpretation: {
      severe: { spo2: [0, 88], label: 'Severe Hypoxemia', color: 'red' },
      moderate: { spo2: [88, 92], label: 'Moderate Hypoxemia', color: 'orange' },
      mild: { spo2: [92, 95], label: 'Mild Hypoxemia', color: 'yellow' },
      normal: { spo2: [95, 100], label: 'Normal', color: 'green' },
    },
  },

  FEV1: {
    id: 'fev1',
    name: 'FEV-1 (Forced Expiratory Volume)',
    shortName: 'FEV-1',
    icon: '🫁',
    description: 'Forced expiratory volume in 1 second - key measurement for VA asthma ratings',

    fields: [
      {
        key: 'fev1',
        label: 'FEV-1 Value',
        unit: 'L',
        type: 'number',
        min: 0.5,
        max: 8.0,
        step: 0.01,
        required: true,
        placeholder: '3.50',
        help: 'Actual FEV-1 measurement from spirometry',
      },
      {
        key: 'fev1Predicted',
        label: 'FEV-1 Predicted',
        unit: 'L',
        type: 'number',
        min: 0.5,
        max: 8.0,
        step: 0.01,
        required: true,
        placeholder: '4.20',
        help: 'Predicted FEV-1 based on age, height, gender',
      },
    ],

    metadata: [
      {
        key: 'testType',
        label: 'Test type',
        type: 'select',
        options: [
          { value: 'clinical', label: 'Clinical spirometry (doctor\'s office)' },
          { value: 'home', label: 'Home spirometer' },
        ],
        default: 'clinical',
      },
      {
        key: 'medicationTiming',
        label: 'Bronchodilator status',
        type: 'select',
        options: [
          { value: 'pre', label: 'Pre-bronchodilator' },
          { value: 'post', label: 'Post-bronchodilator' },
          { value: 'none', label: 'No bronchodilator' },
        ],
        default: 'post',
      },
    ],

    relatedConditions: ['asthma', 'copd', 'chronic-bronchitis', 'emphysema'],

    // VA Rating thresholds (based on % predicted)
    interpretation: {
      severe: { percent: [0, 40], label: '100% Rating Range (<40% predicted)', color: 'red' },
      moderate: { percent: [40, 55], label: '60% Rating Range (40-55% predicted)', color: 'orange' },
      mild: { percent: [56, 70], label: '30% Rating Range (56-70% predicted)', color: 'yellow' },
      low: { percent: [71, 80], label: '10% Rating Range (71-80% predicted)', color: 'yellow' },
      normal: { percent: [81, 200], label: 'Normal (>80% predicted)', color: 'green' },
    },
  },

  FVC: {
    id: 'fvc',
    name: 'FVC (Forced Vital Capacity)',
    shortName: 'FVC',
    icon: '🫁',
    description: 'Forced vital capacity - used with FEV-1 for FEV-1/FVC ratio',

    fields: [
      {
        key: 'fvc',
        label: 'FVC Value',
        unit: 'L',
        type: 'number',
        min: 0.5,
        max: 10.0,
        step: 0.01,
        required: true,
        placeholder: '4.50',
        help: 'Actual FVC measurement from spirometry',
      },
    ],

    metadata: [
      {
        key: 'testType',
        label: 'Test type',
        type: 'select',
        options: [
          { value: 'clinical', label: 'Clinical spirometry (doctor\'s office)' },
          { value: 'home', label: 'Home spirometer' },
        ],
        default: 'clinical',
      },
    ],

    relatedConditions: ['asthma', 'copd', 'chronic-bronchitis', 'emphysema'],

    interpretation: null, // FVC is typically evaluated as ratio with FEV-1
  },
  // ============================================
  // PHASE 1F: RANGE OF MOTION (ROM)
  // ============================================
  ROM: {
    id: 'rom',
    name: 'Range of Motion (ROM)',
    shortName: 'ROM',
    icon: '🦴',
    description: 'Track joint range of motion in degrees for musculoskeletal claims',

    fields: [
      {
        key: 'measurement',
        label: 'ROM Measurement',
        unit: 'degrees',
        type: 'number',
        min: 0,
        max: 360,
        step: 1,
        required: true,
        placeholder: '90',
        help: 'Measured range of motion in degrees',
      },
    ],

    metadata: [
      {
        key: 'joint',
        label: 'Joint',
        type: 'select',
        options: [
          { value: 'shoulder', label: 'Shoulder' },
          { value: 'elbow', label: 'Elbow' },
          { value: 'wrist', label: 'Wrist' },
          { value: 'hip', label: 'Hip' },
          { value: 'knee', label: 'Knee' },
          { value: 'ankle', label: 'Ankle' },
          { value: 'cervical-spine', label: 'Cervical Spine (Neck)' },
          { value: 'thoracolumbar-spine', label: 'Thoracolumbar Spine (Back)' },
          { value: 'finger', label: 'Finger' },
          { value: 'toe', label: 'Toe' },
        ],
        required: true,
      },
      {
        key: 'movement',
        label: 'Movement type',
        type: 'select',
        options: [
          { value: 'flexion', label: 'Flexion' },
          { value: 'extension', label: 'Extension' },
          { value: 'abduction', label: 'Abduction' },
          { value: 'adduction', label: 'Adduction' },
          { value: 'rotation-internal', label: 'Internal Rotation' },
          { value: 'rotation-external', label: 'External Rotation' },
          { value: 'lateral-flexion', label: 'Lateral Flexion' },
          { value: 'combined', label: 'Combined Movement' },
        ],
        required: true,
      },
      {
        key: 'side',
        label: 'Side',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
          { value: 'bilateral', label: 'Bilateral' },
        ],
        default: 'left',
      },
      {
        key: 'pain',
        label: 'Pain during movement?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'measuredBy',
        label: 'Measured by',
        type: 'select',
        options: [
          { value: 'provider', label: 'Healthcare provider (goniometer)' },
          { value: 'self', label: 'Self-measurement' },
        ],
        default: 'self',
      },
    ],

    relatedConditions: ['shoulder-limited-motion', 'knee-limited-motion', 'hip-limited-motion',
      'ankle-limited-motion', 'elbow-limited-motion', 'wrist-limited-motion',
      'degenerative-arthritis', 'lumbosacral-strain'],

    interpretation: null, // ROM limitations are condition-specific in VA rating schedule
  },

  // ============================================
  // PHASE 1F: PEAK FLOW
  // ============================================
  PEAK_FLOW: {
    id: 'peak-flow',
    name: 'Peak Flow',
    shortName: 'Peak Flow',
    icon: '🫁',
    description: 'Track peak expiratory flow rate for asthma and respiratory conditions',

    fields: [
      {
        key: 'peakFlow',
        label: 'Peak Flow Reading',
        unit: 'L/min',
        type: 'number',
        min: 50,
        max: 900,
        step: 10,
        required: true,
        placeholder: '400',
        help: 'Peak expiratory flow rate',
      },
    ],

    metadata: [
      {
        key: 'personalBest',
        label: 'Your personal best',
        type: 'number',
        unit: 'L/min',
        min: 50,
        max: 900,
        step: 10,
        required: false,
        placeholder: '500',
        help: 'Your highest peak flow when feeling well',
      },
      {
        key: 'beforeAfterMedication',
        label: 'Timing',
        type: 'select',
        options: [
          { value: 'before', label: 'Before rescue inhaler' },
          { value: 'after', label: 'After rescue inhaler' },
          { value: 'no-medication', label: 'No medication used' },
        ],
        default: 'no-medication',
      },
      {
        key: 'symptoms',
        label: 'Current symptoms',
        type: 'select',
        options: [
          { value: 'none', label: 'No symptoms' },
          { value: 'mild', label: 'Mild symptoms' },
          { value: 'moderate', label: 'Moderate symptoms' },
          { value: 'severe', label: 'Severe symptoms' },
        ],
        default: 'none',
      },
    ],

    relatedConditions: ['asthma', 'copd', 'chronic-bronchitis'],

    // Peak flow zones (as percentage of personal best)
    interpretation: {
      green: { percent: [80, 100], label: 'Green Zone (Good)', color: 'green' },
      yellow: { percent: [50, 80], label: 'Yellow Zone (Caution)', color: 'yellow' },
      red: { percent: [0, 50], label: 'Red Zone (Danger)', color: 'red' },
    },
  },

  // ============================================
  // PHASE 1F: BRISTOL STOOL SCALE
  // ============================================
  BRISTOL_SCALE: {
    id: 'bristol-scale',
    name: 'Bristol Stool Scale',
    shortName: 'Bristol',
    icon: '💩',
    description: 'Track stool consistency for GI conditions (IBS, IBD, etc.)',

    fields: [
      {
        key: 'bristolType',
        label: 'Stool Type',
        type: 'select',
        required: true,
        help: 'Bristol Stool Scale type (1-7)',
        options: [
          { value: '', label: 'Select stool type...' },
          { value: 1, label: 'Type 1 - Separate hard lumps (severe constipation)' },
          { value: 2, label: 'Type 2 - Lumpy and sausage-like (mild constipation)' },
          { value: 3, label: 'Type 3 - Sausage with cracks (normal)' },
          { value: 4, label: 'Type 4 - Smooth, soft sausage (ideal)' },
          { value: 5, label: 'Type 5 - Soft blobs with clear edges (lacking fiber)' },
          { value: 6, label: 'Type 6 - Mushy with ragged edges (mild diarrhea)' },
          { value: 7, label: 'Type 7 - Liquid, no solid pieces (severe diarrhea)' },
        ],
      },
    ],

    metadata: [
      {
        key: 'frequency',
        label: 'Bowel movements today',
        type: 'number',
        min: 0,
        max: 20,
        step: 1,
        required: false,
        placeholder: '0',
        help: 'Enter 0 if no bowel movement today',
      },
      {
        key: 'urgency',
        label: 'Urgency level',
        type: 'select',
        options: [
          { value: 'none', label: 'No urgency' },
          { value: 'mild', label: 'Mild urgency' },
          { value: 'moderate', label: 'Moderate urgency' },
          { value: 'severe', label: 'Severe urgency' },
          { value: 'incontinence', label: 'Incontinence' },
        ],
        default: 'none',
      },
      {
        key: 'bloodPresent',
        label: 'Blood present?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'mucusPresent',
        label: 'Mucus present?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'abdominalPain',
        label: 'Abdominal pain with BM?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['ibs', 'ulcerative-colitis', 'crohns-disease', 'diverticulitis'],

    // Bristol scale interpretation
    interpretation: {
      type1: { bristolType: [1, 1], label: 'Type 1: Severe Constipation (hard lumps)', color: 'red' },
      type2: { bristolType: [2, 2], label: 'Type 2: Constipation (lumpy)', color: 'orange' },
      type3: { bristolType: [3, 3], label: 'Type 3: Normal (cracked)', color: 'green' },
      type4: { bristolType: [4, 4], label: 'Type 4: Ideal (smooth snake)', color: 'green' },
      type5: { bristolType: [5, 5], label: 'Type 5: Lacking fiber (soft blobs)', color: 'yellow' },
      type6: { bristolType: [6, 6], label: 'Type 6: Mild diarrhea (mushy)', color: 'orange' },
      type7: { bristolType: [7, 7], label: 'Type 7: Severe diarrhea (liquid)', color: 'red' },
    },
  },

  // ============================================
  // KIDNEY FUNCTION MEASUREMENTS (Phase 3)
  // ============================================

  EGFR: {
    id: 'egfr',
    name: 'eGFR (Kidney Function)',
    shortName: 'eGFR',
    icon: '🫘',
    description: 'Track estimated Glomerular Filtration Rate - primary measure of kidney function',

    fields: [
      {
        key: 'egfr',
        label: 'eGFR',
        unit: 'mL/min/1.73m²',
        type: 'number',
        min: 1,
        max: 200,
        step: 1,
        required: true,
        placeholder: '90',
        help: 'From lab report - measures how well kidneys filter blood',
      },
    ],

    metadata: [
      {
        key: 'labDate',
        label: 'Lab draw date',
        type: 'date',
        help: 'Date blood was drawn (if different from log date)',
      },
      {
        key: 'calculationMethod',
        label: 'Calculation method',
        type: 'select',
        options: [
          { value: 'ckd-epi', label: 'CKD-EPI (most common)' },
          { value: 'mdrd', label: 'MDRD' },
          { value: 'unknown', label: 'Not specified' },
        ],
        default: 'ckd-epi',
      },
    ],

    relatedConditions: ['chronic-renal-disease', 'diabetic-nephropathy', 'kidney-stones', 'hypertension'],

    // CKD Stage thresholds (KDIGO guidelines)
    interpretation: {
      normal: { egfr: [90, 999], label: 'Normal (Stage 1)', color: 'green' },
      mild: { egfr: [60, 90], label: 'Mild CKD (Stage 2)', color: 'yellow' },
      moderate: { egfr: [30, 60], label: 'Moderate CKD (Stage 3)', color: 'orange' },
      severe: { egfr: [15, 30], label: 'Severe CKD (Stage 4)', color: 'red' },
      kidney_failure: { egfr: [0, 15], label: 'Kidney Failure (Stage 5)', color: 'red' },
    },
  },

  CREATININE: {
    id: 'creatinine',
    name: 'Creatinine',
    shortName: 'Creatinine',
    icon: '🫘',
    description: 'Track serum creatinine levels - waste product filtered by kidneys',

    fields: [
      {
        key: 'creatinine',
        label: 'Serum Creatinine',
        unit: 'mg/dL',
        type: 'number',
        min: 0.1,
        max: 20.0,
        step: 0.01,
        required: true,
        placeholder: '1.0',
        help: 'From lab report - higher values indicate worse kidney function',
      },
    ],

    metadata: [
      {
        key: 'labDate',
        label: 'Lab draw date',
        type: 'date',
        help: 'Date blood was drawn (if different from log date)',
      },
      {
        key: 'muscleCondition',
        label: 'Muscle condition note',
        type: 'text',
        placeholder: 'e.g., low muscle mass, bodybuilder',
        help: 'Muscle mass affects creatinine levels',
      },
    ],

    relatedConditions: ['chronic-renal-disease', 'diabetic-nephropathy', 'kidney-stones'],

    // Interpretation (varies by sex/age, these are general guidelines)
    interpretation: {
      low: { creatinine: [0, 0.6], label: 'Low (possible low muscle mass)', color: 'yellow' },
      normal: { creatinine: [0.6, 1.2], label: 'Normal Range', color: 'green' },
      mildly_elevated: { creatinine: [1.2, 2.0], label: 'Mildly Elevated', color: 'yellow' },
      elevated: { creatinine: [2.0, 5.0], label: 'Elevated (Impaired Function)', color: 'orange' },
      severely_elevated: { creatinine: [5.0, 99], label: 'Severely Elevated', color: 'red' },
    },
  },

  BUN: {
    id: 'bun',
    name: 'BUN (Blood Urea Nitrogen)',
    shortName: 'BUN',
    icon: '🫘',
    description: 'Track blood urea nitrogen - waste product filtered by kidneys',

    fields: [
      {
        key: 'bun',
        label: 'BUN',
        unit: 'mg/dL',
        type: 'number',
        min: 1,
        max: 200,
        step: 1,
        required: true,
        placeholder: '15',
        help: 'From lab report - measures urea nitrogen in blood',
      },
    ],

    metadata: [
      {
        key: 'labDate',
        label: 'Lab draw date',
        type: 'date',
        help: 'Date blood was drawn (if different from log date)',
      },
      {
        key: 'hydrationStatus',
        label: 'Hydration status',
        type: 'select',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'dehydrated', label: 'Dehydrated' },
          { value: 'overhydrated', label: 'Overhydrated' },
        ],
        default: 'normal',
        help: 'Hydration affects BUN levels',
      },
      {
        key: 'highProteinDiet',
        label: 'High protein diet?',
        type: 'boolean',
        default: false,
        help: 'High protein intake can elevate BUN',
      },
    ],

    relatedConditions: ['chronic-renal-disease', 'diabetic-nephropathy', 'kidney-stones'],

    // Interpretation thresholds
    interpretation: {
      low: { bun: [0, 7], label: 'Low (possible malnutrition)', color: 'yellow' },
      normal: { bun: [7, 20], label: 'Normal Range', color: 'green' },
      mildly_elevated: { bun: [20, 40], label: 'Mildly Elevated', color: 'yellow' },
      elevated: { bun: [40, 80], label: 'Elevated (Impaired Function)', color: 'orange' },
      severely_elevated: { bun: [80, 999], label: 'Severely Elevated', color: 'red' },
    },
  },
  // Phase 4: Gynecological Measurements
  MENSTRUAL_CYCLE: {
    id: 'menstrual-cycle',
    name: 'Menstrual Cycle Tracking',
    shortName: 'Cycle',
    icon: '📅',
    description: 'Track menstrual cycle characteristics for endometriosis, PCOS, and menstrual disorder documentation',

    fields: [
      {
        key: 'cycleLength',
        label: 'Cycle Length',
        unit: 'days',
        type: 'number',
        min: 14,
        max: 90,
        step: 1,
        required: true,
        placeholder: '28',
        help: 'Days from first day of one period to first day of next',
      },
      {
        key: 'flowDuration',
        label: 'Bleeding Duration',
        unit: 'days',
        type: 'number',
        min: 1,
        max: 14,
        step: 1,
        required: true,
        placeholder: '5',
        help: 'Number of days of bleeding',
      },
      {
        key: 'flowHeaviness',
        label: 'Flow Heaviness',
        type: 'select',
        options: [
          { value: 'spotting', label: 'Spotting only' },
          { value: 'light', label: 'Light' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'heavy', label: 'Heavy' },
          { value: 'very-heavy', label: 'Very Heavy (soaking through)' },
        ],
        required: true,
        help: 'Overall flow intensity',
      },
      {
        key: 'changesPerDay',
        label: 'Pad/Tampon Changes',
        unit: 'per day',
        type: 'number',
        min: 0,
        max: 20,
        step: 1,
        required: false,
        placeholder: '4',
        help: 'Average number of pad/tampon changes per day during heaviest flow',
      },
    ],

    metadata: [
      {
        key: 'painLevel',
        label: 'Dysmenorrhea severity',
        type: 'select',
        options: [
          { value: '0', label: 'None' },
          { value: '1-3', label: 'Mild (1-3)' },
          { value: '4-6', label: 'Moderate (4-6)' },
          { value: '7-10', label: 'Severe (7-10)' },
        ],
        help: 'Pain level during menstruation',
      },
      {
        key: 'clots',
        label: 'Blood clots present?',
        type: 'boolean',
        default: false,
        help: 'Presence of blood clots (common with heavy flow)',
      },
      {
        key: 'flooding',
        label: 'Flooding/soaking through?',
        type: 'boolean',
        default: false,
        help: 'Soaking through pads/tampons requiring frequent changes',
      },
      {
        key: 'interfereWithActivities',
        label: 'Interferes with daily activities?',
        type: 'boolean',
        default: false,
        help: 'Does bleeding interfere with work, exercise, or daily life?',
      },
    ],

    relatedConditions: ['endometriosis', 'pcos', 'menstrual-disorders', 'ovarian-disease'],

    // Interpretation based on VA rating criteria
    interpretation: {
      normal: {
        cycleLength: [21, 35],
        flowDuration: [3, 7],
        label: 'Normal Cycle',
        color: 'green'
      },
      irregular: {
        cycleLength: [14, 21, 35, 90],
        label: 'Irregular Cycle',
        color: 'yellow'
      },
      heavy_flow: {
        flowHeaviness: ['heavy', 'very-heavy'],
        label: 'Heavy Bleeding',
        color: 'orange'
      },
      prolonged: {
        flowDuration: [8, 14],
        label: 'Prolonged Bleeding',
        color: 'orange'
      },
    },
  },

  PELVIC_PAIN_SCALE: {
    id: 'pelvic-pain',
    name: 'Pelvic Pain Assessment',
    shortName: 'Pelvic Pain',
    icon: '⚠️',
    description: 'Track pelvic pain severity for gynecological conditions',

    fields: [
      {
        key: 'painSeverity',
        label: 'Pain Severity',
        unit: '/10',
        type: 'number',
        min: 0,
        max: 10,
        step: 1,
        required: true,
        placeholder: '5',
        help: '0 = no pain, 10 = worst pain imaginable',
      },
      {
        key: 'painType',
        label: 'Pain Type',
        type: 'select',
        options: [
          { value: 'chronic-pelvic', label: 'Chronic pelvic pain' },
          { value: 'dysmenorrhea', label: 'Menstrual pain (dysmenorrhea)' },
          { value: 'dyspareunia', label: 'Pain with intercourse (dyspareunia)' },
          { value: 'ovulation', label: 'Ovulation pain (mittelschmerz)' },
          { value: 'other', label: 'Other gynecological pain' },
        ],
        required: true,
      },
    ],

    metadata: [
      {
        key: 'painLocation',
        label: 'Pain location',
        type: 'select',
        options: [
          { value: 'lower-abdomen', label: 'Lower abdomen' },
          { value: 'pelvic-center', label: 'Central pelvis' },
          { value: 'left-side', label: 'Left side' },
          { value: 'right-side', label: 'Right side' },
          { value: 'deep-pelvis', label: 'Deep pelvic' },
          { value: 'vaginal', label: 'Vaginal' },
        ],
        help: 'Primary location of pain',
      },
      {
        key: 'painDuration',
        label: 'Duration this episode',
        type: 'select',
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
          { value: 'constant', label: 'Constant/ongoing' },
        ],
      },
      {
        key: 'relievedBy',
        label: 'Relieved by',
        type: 'select',
        options: [
          { value: 'nothing', label: 'Nothing helps' },
          { value: 'rest', label: 'Rest' },
          { value: 'heat', label: 'Heat/heating pad' },
          { value: 'medication', label: 'Pain medication' },
          { value: 'position-change', label: 'Position change' },
        ],
      },
      {
        key: 'interfereWithFunction',
        label: 'Interferes with daily function?',
        type: 'boolean',
        default: false,
        help: 'Does pain prevent normal activities or work?',
      },
    ],

    relatedConditions: ['endometriosis', 'pelvic-inflammatory-disease', 'ovarian-disease', 'pelvic-prolapse'],

    // Interpretation
    interpretation: {
      mild: { painSeverity: [1, 3], label: 'Mild Pain', color: 'yellow' },
      moderate: { painSeverity: [4, 6], label: 'Moderate Pain', color: 'orange' },
      severe: { painSeverity: [7, 10], label: 'Severe Pain', color: 'red' },
    },
  },

  PROLAPSE_STAGING: {
    id: 'prolapse-staging',
    name: 'Pelvic Organ Prolapse Staging',
    shortName: 'POP Stage',
    icon: '📊',
    description: 'Track pelvic organ prolapse severity using POP-Q staging system',

    fields: [
      {
        key: 'popStage',
        label: 'POP-Q Stage',
        type: 'select',
        options: [
          { value: '0', label: 'Stage 0 (No prolapse)' },
          { value: '1', label: 'Stage I (Mild - above hymen)' },
          { value: '2', label: 'Stage II (Moderate - at hymen)' },
          { value: '3', label: 'Stage III (Severe - below hymen)' },
          { value: '4', label: 'Stage IV (Complete - total eversion)' },
        ],
        required: true,
        help: 'POP-Q staging from medical exam',
      },
      {
        key: 'prolapseType',
        label: 'Type of Prolapse',
        type: 'select',
        options: [
          { value: 'cystocele', label: 'Cystocele (bladder)' },
          { value: 'rectocele', label: 'Rectocele (rectum)' },
          { value: 'uterine', label: 'Uterine prolapse' },
          { value: 'vault', label: 'Vaginal vault prolapse' },
          { value: 'enterocele', label: 'Enterocele (small bowel)' },
          { value: 'multiple', label: 'Multiple types' },
        ],
        required: true,
      },
    ],

    metadata: [
      {
        key: 'assessedBy',
        label: 'Assessed by',
        type: 'select',
        options: [
          { value: 'gynecologist', label: 'Gynecologist' },
          { value: 'urogynecologist', label: 'Urogynecologist' },
          { value: 'pcp', label: 'Primary care provider' },
          { value: 'self', label: 'Self-assessment (symptoms)' },
        ],
      },
      {
        key: 'treatmentUsed',
        label: 'Treatment currently used',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'pessary', label: 'Pessary' },
          { value: 'pelvic-floor-pt', label: 'Pelvic floor physical therapy' },
          { value: 'surgical', label: 'Surgical repair (post-op)' },
        ],
      },
      {
        key: 'symptoms',
        label: 'Current symptoms',
        type: 'multiselect',
        options: [
          { value: 'bulge', label: 'Vaginal bulge sensation' },
          { value: 'pressure', label: 'Pelvic pressure/heaviness' },
          { value: 'urinary', label: 'Urinary symptoms' },
          { value: 'bowel', label: 'Bowel symptoms' },
          { value: 'pain', label: 'Pain/discomfort' },
        ],
      },
    ],

    relatedConditions: ['pelvic-prolapse'],

    // Interpretation based on staging
    interpretation: {
      none: { popStage: ['0'], label: 'No Prolapse', color: 'green' },
      mild: { popStage: ['1'], label: 'Mild Prolapse', color: 'yellow' },
      moderate: { popStage: ['2'], label: 'Moderate Prolapse', color: 'orange' },
      severe: { popStage: ['3', '4'], label: 'Severe Prolapse', color: 'red' },
    },
  },

  DLCO: {
    id: 'dlco',
    name: 'DLCO (Diffusion Capacity)',
    shortName: 'DLCO',
    icon: '🫁',
    description: 'Diffusion Capacity of the Lung for Carbon Monoxide - measures gas exchange efficiency',

    fields: [
      {
        key: 'dlco',
        label: 'DLCO Value',
        unit: 'mL/min/mmHg',
        type: 'number',
        min: 5,
        max: 50,
        step: 0.1,
        required: true,
        placeholder: '25.0',
        help: 'Actual DLCO measurement from pulmonary function test',
      },
      {
        key: 'dlcoPredicted',
        label: 'DLCO Predicted',
        unit: 'mL/min/mmHg',
        type: 'number',
        min: 10,
        max: 50,
        step: 0.1,
        required: true,
        placeholder: '30.0',
        help: 'Predicted DLCO based on age, height, gender',
      },
    ],

    metadata: [
      {
        key: 'testType',
        label: 'Test type',
        type: 'select',
        options: [
          { value: 'clinical', label: 'Clinical PFT (pulmonary lab)' },
        ],
        default: 'clinical',
      },
      {
        key: 'hemoglobinCorrected',
        label: 'Hemoglobin corrected?',
        type: 'boolean',
        default: true,
        help: 'DLCO values are typically corrected for hemoglobin levels',
      },
    ],

    relatedConditions: ['copd', 'chronic-bronchitis', 'emphysema'],

    // VA Rating thresholds (based on % predicted)
    interpretation: {
      severe: { percent: [0, 40], label: '100% Rating Range (<40% predicted)', color: 'red' },
      moderate: { percent: [40, 55], label: '60% Rating Range (40-55% predicted)', color: 'orange' },
      mild: { percent: [56, 65], label: '30% Rating Range (56-65% predicted)', color: 'yellow' },
      low: { percent: [66, 80], label: '10% Rating Range (66-80% predicted)', color: 'yellow' },
      normal: { percent: [81, 200], label: 'Normal (>80% predicted)', color: 'green' },
    },
  },
  // ============================================
  // PHASE 5: HEMIC/LYMPHATIC MEASUREMENTS
  // ============================================

  COMPLETE_BLOOD_COUNT: {
    id: 'complete-blood-count',
    name: 'Complete Blood Count (CBC)',
    shortName: 'CBC',
    icon: '🩸',
    description: 'Complete blood count for anemia and blood disorder documentation',

    fields: [
      {
        key: 'hemoglobin',
        label: 'Hemoglobin (Hgb)',
        unit: 'g/dL',
        type: 'number',
        min: 3,
        max: 20,
        step: 0.1,
        required: true,
        placeholder: '14.0',
        help: 'Normal: Male 13.5-17.5, Female 12-16 g/dL',
      },
      {
        key: 'hematocrit',
        label: 'Hematocrit (Hct)',
        unit: '%',
        type: 'number',
        min: 15,
        max: 65,
        step: 0.1,
        required: false,
        placeholder: '42',
        help: 'Normal: Male 38-50%, Female 36-44%',
      },
      {
        key: 'rbc',
        label: 'Red Blood Cells (RBC)',
        unit: 'million/μL',
        type: 'number',
        min: 1,
        max: 8,
        step: 0.01,
        required: false,
        placeholder: '5.0',
        help: 'Normal: Male 4.7-6.1, Female 4.2-5.4',
      },
      {
        key: 'wbc',
        label: 'White Blood Cells (WBC)',
        unit: 'thousand/μL',
        type: 'number',
        min: 0.5,
        max: 50,
        step: 0.1,
        required: false,
        placeholder: '7.0',
        help: 'Normal: 4.5-11 thousand/μL',
      },
      {
        key: 'platelets',
        label: 'Platelets',
        unit: 'thousand/μL',
        type: 'number',
        min: 10,
        max: 1000,
        step: 1,
        required: false,
        placeholder: '250',
        help: 'Normal: 150-400 thousand/μL',
      },
      {
        key: 'mcv',
        label: 'MCV (Mean Corpuscular Volume)',
        unit: 'fL',
        type: 'number',
        min: 50,
        max: 130,
        step: 0.1,
        required: false,
        placeholder: '90',
        help: 'Normal: 80-100 fL',
      },
    ],

    metadata: [
      {
        key: 'fasting',
        label: 'Fasting sample?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'labName',
        label: 'Lab/Facility',
        type: 'text',
        placeholder: 'VA Medical Center',
      },
    ],

    relatedConditions: ['iron-deficiency-anemia', 'pernicious-anemia', 'sickle-cell', 'leukemia', 'aplastic-anemia'],

    interpretation: {
      low_hgb: { hemoglobin: [0, 12], label: 'Low Hemoglobin (Anemia)', color: 'red' },
      normal: { hemoglobin: [12, 17.5], label: 'Normal', color: 'green' },
      high_hgb: { hemoglobin: [17.5, 99], label: 'Elevated Hemoglobin', color: 'orange' },
    },
  },

  ABSOLUTE_NEUTROPHIL_COUNT: {
    id: 'absolute-neutrophil-count',
    name: 'Absolute Neutrophil Count (ANC)',
    shortName: 'ANC',
    icon: '⚪',
    description: 'Neutrophil count for infection risk assessment',

    fields: [
      {
        key: 'anc',
        label: 'ANC',
        unit: '/μL',
        type: 'number',
        min: 0,
        max: 20000,
        step: 1,
        required: true,
        placeholder: '4000',
        help: 'Normal: 1500-8000/μL',
      },
    ],

    metadata: [],

    relatedConditions: ['leukemia', 'aplastic-anemia'],

    interpretation: {
      severe: { anc: [0, 500], label: 'Severe Neutropenia (High Infection Risk)', color: 'red' },
      moderate: { anc: [500, 1000], label: 'Moderate Neutropenia', color: 'orange' },
      mild: { anc: [1000, 1500], label: 'Mild Neutropenia', color: 'yellow' },
      normal: { anc: [1500, 99999], label: 'Normal', color: 'green' },
    },
  },

  IRON_PANEL: {
    id: 'iron-panel',
    name: 'Iron Panel',
    shortName: 'Iron',
    icon: '🔬',
    description: 'Iron studies for anemia evaluation',

    fields: [
      {
        key: 'serum_iron',
        label: 'Serum Iron',
        unit: 'μg/dL',
        type: 'number',
        min: 10,
        max: 300,
        step: 1,
        required: false,
        placeholder: '100',
        help: 'Normal: 60-170 μg/dL',
      },
      {
        key: 'ferritin',
        label: 'Ferritin',
        unit: 'ng/mL',
        type: 'number',
        min: 1,
        max: 2000,
        step: 1,
        required: true,
        placeholder: '100',
        help: 'Normal: Male 24-336, Female 11-307 ng/mL',
      },
      {
        key: 'tibc',
        label: 'TIBC (Total Iron Binding Capacity)',
        unit: 'μg/dL',
        type: 'number',
        min: 100,
        max: 600,
        step: 1,
        required: false,
        placeholder: '350',
        help: 'Normal: 240-450 μg/dL',
      },
      {
        key: 'transferrin_saturation',
        label: 'Transferrin Saturation',
        unit: '%',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        required: false,
        placeholder: '30',
        help: 'Normal: 20-50%',
      },
    ],

    metadata: [],

    relatedConditions: ['iron-deficiency-anemia'],

    interpretation: {
      low: { ferritin: [0, 15], label: 'Iron Deficiency', color: 'red' },
      low_normal: { ferritin: [15, 30], label: 'Low-Normal (Consider Supplementation)', color: 'yellow' },
      normal: { ferritin: [30, 300], label: 'Normal', color: 'green' },
      elevated: { ferritin: [300, 9999], label: 'Elevated Ferritin', color: 'orange' },
    },
  },

  VITAMIN_B12_FOLATE: {
    id: 'vitamin-b12-folate',
    name: 'Vitamin B12 & Folate',
    shortName: 'B12/Folate',
    icon: '💊',
    description: 'B12 and folate levels for macrocytic anemia',

    fields: [
      {
        key: 'vitamin_b12',
        label: 'Vitamin B12',
        unit: 'pg/mL',
        type: 'number',
        min: 50,
        max: 2000,
        step: 1,
        required: true,
        placeholder: '500',
        help: 'Normal: 200-900 pg/mL',
      },
      {
        key: 'folate',
        label: 'Folate (Folic Acid)',
        unit: 'ng/mL',
        type: 'number',
        min: 0.5,
        max: 30,
        step: 0.1,
        required: false,
        placeholder: '10',
        help: 'Normal: >3.0 ng/mL',
      },
      {
        key: 'methylmalonic_acid',
        label: 'Methylmalonic Acid (MMA)',
        unit: 'nmol/L',
        type: 'number',
        min: 50,
        max: 2000,
        step: 1,
        required: false,
        placeholder: '150',
        help: 'Normal: <270 nmol/L (elevated in B12 deficiency)',
      },
    ],

    metadata: [],

    relatedConditions: ['pernicious-anemia', 'folate-deficiency-anemia'],

    interpretation: {
      deficient: { vitamin_b12: [0, 200], label: 'B12 Deficiency', color: 'red' },
      low_normal: { vitamin_b12: [200, 300], label: 'Low-Normal B12', color: 'yellow' },
      normal: { vitamin_b12: [300, 9999], label: 'Normal', color: 'green' },
    },
  },

  RETICULOCYTE_COUNT: {
    id: 'reticulocyte-count',
    name: 'Reticulocyte Count',
    shortName: 'Retic',
    icon: '🔴',
    description: 'Immature red blood cell count',

    fields: [
      {
        key: 'reticulocyte_percent',
        label: 'Reticulocyte %',
        unit: '%',
        type: 'number',
        min: 0,
        max: 25,
        step: 0.1,
        required: true,
        placeholder: '1.5',
        help: 'Normal: 0.5-2.5%',
      },
      {
        key: 'reticulocyte_absolute',
        label: 'Absolute Reticulocyte Count',
        unit: 'thousand/μL',
        type: 'number',
        min: 0,
        max: 500,
        step: 1,
        required: false,
        placeholder: '75',
      },
    ],

    metadata: [],

    relatedConditions: ['hemolytic-anemia', 'aplastic-anemia'],

    interpretation: {
      low: { reticulocyte_percent: [0, 0.5], label: 'Low (Bone Marrow Not Responding)', color: 'red' },
      normal: { reticulocyte_percent: [0.5, 2.5], label: 'Normal', color: 'green' },
      high: { reticulocyte_percent: [2.5, 99], label: 'High (Active RBC Production)', color: 'yellow' },
    },
  },

  HEMOGLOBIN_ELECTROPHORESIS: {
    id: 'hemoglobin-electrophoresis',
    name: 'Hemoglobin Electrophoresis',
    shortName: 'Hgb Electro',
    icon: '🧬',
    description: 'Hemoglobin types for sickle cell and thalassemia',

    fields: [
      {
        key: 'hgb_a',
        label: 'Hemoglobin A',
        unit: '%',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        required: false,
        placeholder: '97',
      },
      {
        key: 'hgb_s',
        label: 'Hemoglobin S (Sickle)',
        unit: '%',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        required: true,
        placeholder: '0',
        help: '>50% indicates sickle cell disease',
      },
      {
        key: 'hgb_f',
        label: 'Hemoglobin F (Fetal)',
        unit: '%',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        required: false,
        placeholder: '1',
      },
      {
        key: 'hgb_a2',
        label: 'Hemoglobin A2',
        unit: '%',
        type: 'number',
        min: 0,
        max: 15,
        step: 0.1,
        required: false,
        placeholder: '2.5',
      },
    ],

    metadata: [],

    relatedConditions: ['sickle-cell-anemia'],

    interpretation: {
      sickle_disease: { hgb_s: [50, 100], label: 'Sickle Cell Disease (HbSS)', color: 'red' },
      sickle_trait: { hgb_s: [1, 50], label: 'Sickle Cell Trait or HbSC', color: 'yellow' },
      normal: { hgb_s: [0, 1], label: 'Normal Hemoglobin Pattern', color: 'green' },
    },
  },

  // ============================================
  // PHASE 7: DENTAL/ORAL MEASUREMENTS
  // ============================================

  JAW_OPENING: {
    id: 'jaw-opening',
    name: 'Jaw Opening (Interincisal Range)',
    shortName: 'Jaw ROM',
    icon: '📏',
    description: 'Maximum mouth opening for TMJ documentation',

    fields: [
      {
        key: 'max_opening',
        label: 'Maximum Unassisted Vertical Opening',
        unit: 'mm',
        type: 'number',
        min: 0,
        max: 60,
        step: 1,
        required: true,
        placeholder: '40',
        help: 'Normal: 35-50mm',
      },
      {
        key: 'lateral_excursion',
        label: 'Lateral Excursion Range',
        unit: 'mm',
        type: 'number',
        min: 0,
        max: 20,
        step: 1,
        required: false,
        placeholder: '8',
        help: 'Normal: >4mm',
      },
      {
        key: 'pain_level',
        label: 'Pain with Opening (0-10)',
        unit: '',
        type: 'number',
        min: 0,
        max: 10,
        step: 1,
        required: false,
        placeholder: '0',
      },
    ],

    metadata: [
      {
        key: 'dietary_restrictions',
        label: 'Dietary Restrictions',
        type: 'select',
        options: [
          { value: 'none', label: 'No restrictions' },
          { value: 'semi-solid', label: 'Semi-solid foods required' },
          { value: 'soft', label: 'Soft foods required' },
          { value: 'puree', label: 'Pureed foods required' },
          { value: 'full-liquid', label: 'Full liquid diet required' },
        ],
        default: 'none',
      },
      {
        key: 'clicking_popping',
        label: 'Clicking/Popping present?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'locking_episodes',
        label: 'Locking episodes?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['tmj'],

    interpretation: {
      normal: { max_opening: [35, 99], label: 'Normal Range (35-50mm)', color: 'green' },
      mild: { max_opening: [30, 35], label: 'Mild Limitation (30-34mm)', color: 'yellow' },
      moderate: { max_opening: [21, 30], label: 'Moderate Limitation (21-29mm)', color: 'orange' },
      severe: { max_opening: [11, 21], label: 'Severe Limitation (11-20mm)', color: 'red' },
      very_severe: { max_opening: [0, 11], label: 'Very Severe (0-10mm)', color: 'red' },
    },
  },

  TOOTH_COUNT: {
    id: 'tooth-count',
    name: 'Tooth Loss Documentation',
    shortName: 'Tooth Loss',
    icon: '🦷',
    description: 'Document missing teeth for VA dental claims',

    fields: [
      {
        key: 'total_missing',
        label: 'Total Missing Teeth',
        unit: '',
        type: 'number',
        min: 0,
        max: 32,
        step: 1,
        required: true,
        placeholder: '0',
      },
      {
        key: 'upper_missing',
        label: 'Upper Teeth Missing',
        unit: '',
        type: 'number',
        min: 0,
        max: 16,
        step: 1,
        required: false,
        placeholder: '0',
      },
      {
        key: 'lower_missing',
        label: 'Lower Teeth Missing',
        unit: '',
        type: 'number',
        min: 0,
        max: 16,
        step: 1,
        required: false,
        placeholder: '0',
      },
    ],

    metadata: [
      {
        key: 'prosthesis_type',
        label: 'Prosthesis Type',
        type: 'select',
        options: [
          { value: 'none', label: 'No prosthesis' },
          { value: 'partial-removable', label: 'Partial denture (removable)' },
          { value: 'complete-upper', label: 'Complete upper denture' },
          { value: 'complete-lower', label: 'Complete lower denture' },
          { value: 'complete-both', label: 'Complete dentures (both)' },
          { value: 'implants', label: 'Dental implants' },
          { value: 'bridge', label: 'Fixed bridge' },
        ],
        default: 'none',
      },
      {
        key: 'prosthesis_restores_function',
        label: 'Prosthesis restores masticatory function?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'caused_by_bone_loss',
        label: 'Tooth loss due to bone loss (trauma/disease)?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['tooth-loss'],

    interpretation: {
      none: { total_missing: [0, 0], label: 'No Missing Teeth', color: 'green' },
      partial: { total_missing: [1, 16], label: 'Partial Tooth Loss', color: 'yellow' },
      significant: { total_missing: [17, 31], label: 'Significant Tooth Loss', color: 'orange' },
      complete: { total_missing: [32, 32], label: 'Complete Tooth Loss', color: 'red' },
    },
  },

  // ============================================
  // PHASE 6: INFECTIOUS DISEASE MEASUREMENTS
  // ============================================

  CD4_COUNT: {
    id: 'cd4-count',
    name: 'CD4 T-Cell Count',
    shortName: 'CD4',
    icon: '🔬',
    description: 'Immune system cell count for HIV monitoring',

    fields: [
      {
        key: 'count',
        label: 'CD4 Count',
        unit: 'cells/μL',
        type: 'number',
        min: 0,
        max: 2000,
        step: 1,
        required: true,
        placeholder: '500',
        help: 'Normal: >500 cells/μL',
      },
      {
        key: 'percentage',
        label: 'CD4 Percentage',
        unit: '%',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        required: false,
        placeholder: '30',
      },
    ],

    metadata: [
      {
        key: 'onART',
        label: 'On antiretroviral therapy (ART)?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['hiv'],

    interpretation: {
      normal: { count: [500, 9999], label: 'Normal Immune Function', color: 'green' },
      moderate: { count: [200, 500], label: 'Moderately Compromised', color: 'yellow' },
      severe: { count: [0, 200], label: 'Severely Compromised (AIDS)', color: 'red' },
    },
  },

  VIRAL_LOAD: {
    id: 'viral-load',
    name: 'Viral Load',
    shortName: 'Viral Load',
    icon: '🦠',
    description: 'HIV or Hepatitis viral load measurement',

    fields: [
      {
        key: 'viralLoad',
        label: 'Viral Load',
        unit: 'copies/mL',
        type: 'number',
        min: 0,
        max: 10000000,
        step: 1,
        required: true,
        placeholder: '0',
        help: 'Goal: Undetectable (<50 copies/mL)',
      },
    ],

    metadata: [
      {
        key: 'virusType',
        label: 'Virus Type',
        type: 'select',
        options: [
          { value: 'hiv', label: 'HIV' },
          { value: 'hep-c', label: 'Hepatitis C' },
          { value: 'hep-b', label: 'Hepatitis B' },
        ],
        default: 'hiv',
      },
      {
        key: 'undetectable',
        label: 'Undetectable?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['hiv', 'hepatitis-c', 'hepatitis-b'],

    interpretation: {
      undetectable: { viralLoad: [0, 50], label: 'Undetectable - Treatment Effective', color: 'green' },
      low: { viralLoad: [50, 1000], label: 'Low Viral Load', color: 'yellow' },
      moderate: { viralLoad: [1000, 100000], label: 'Moderate Viral Load', color: 'orange' },
      high: { viralLoad: [100000, 99999999], label: 'High Viral Load', color: 'red' },
    },
  },

  LIVER_ENZYMES: {
    id: 'liver-enzymes',
    name: 'Liver Function Tests',
    shortName: 'LFTs',
    icon: '🧪',
    description: 'Liver enzyme levels for hepatitis monitoring',

    fields: [
      {
        key: 'alt',
        label: 'ALT',
        unit: 'U/L',
        type: 'number',
        min: 0,
        max: 1000,
        step: 1,
        required: false,
        placeholder: '25',
        help: 'Normal: 7-55 U/L',
      },
      {
        key: 'ast',
        label: 'AST',
        unit: 'U/L',
        type: 'number',
        min: 0,
        max: 1000,
        step: 1,
        required: false,
        placeholder: '25',
        help: 'Normal: 8-48 U/L',
      },
      {
        key: 'bilirubin',
        label: 'Total Bilirubin',
        unit: 'mg/dL',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        required: false,
        placeholder: '0.8',
        help: 'Normal: 0.1-1.2 mg/dL',
      },
    ],

    metadata: [],

    relatedConditions: ['hepatitis-c', 'hepatitis-b', 'cirrhosis'],

    interpretation: {
      normal: { alt: [0, 55], label: 'Normal', color: 'green' },
      elevated: { alt: [55, 200], label: 'Elevated', color: 'yellow' },
      high: { alt: [200, 9999], label: 'Significantly Elevated', color: 'red' },
    },
  },

  BODY_TEMPERATURE: {
    id: 'body-temperature',
    name: 'Body Temperature',
    shortName: 'Temp',
    icon: '🌡️',
    description: 'Temperature for fever tracking',

    fields: [
      {
        key: 'temperature',
        label: 'Temperature',
        unit: '°F',
        type: 'number',
        min: 95,
        max: 108,
        step: 0.1,
        required: true,
        placeholder: '98.6',
      },
    ],

    metadata: [
      {
        key: 'location',
        label: 'Measurement Location',
        type: 'select',
        options: [
          { value: 'oral', label: 'Oral' },
          { value: 'ear', label: 'Ear (Tympanic)' },
          { value: 'forehead', label: 'Forehead (Temporal)' },
          { value: 'armpit', label: 'Armpit (Axillary)' },
        ],
        default: 'oral',
      },
    ],

    relatedConditions: [],

    interpretation: {
      normal: { temperature: [97, 99], label: 'Normal', color: 'green' },
      low_grade: { temperature: [99, 100.4], label: 'Low-Grade Fever', color: 'yellow' },
      fever: { temperature: [100.4, 103], label: 'Fever', color: 'orange' },
      high_fever: { temperature: [103, 999], label: 'High Fever - Seek Care', color: 'red' },
    },
  },

  // ============================================
  // PHASE 9: CARDIOVASCULAR MEASUREMENTS
  // ============================================

  EJECTION_FRACTION: {
    id: 'ejection-fraction',
    name: 'Ejection Fraction (EF)',
    shortName: 'EF',
    icon: '❤️',
    description: 'Heart pumping efficiency for cardiac rating',

    fields: [
      {
        key: 'ef_percent',
        label: 'Ejection Fraction',
        unit: '%',
        type: 'number',
        min: 5,
        max: 80,
        step: 1,
        required: true,
        placeholder: '55',
        help: 'Normal: >=55%',
      },
    ],

    metadata: [
      {
        key: 'test_type',
        label: 'Test Type',
        type: 'select',
        options: [
          { value: 'echocardiogram', label: 'Echocardiogram (Echo)' },
          { value: 'muga', label: 'MUGA Scan' },
          { value: 'cardiac-mri', label: 'Cardiac MRI' },
          { value: 'cardiac-ct', label: 'Cardiac CT' },
          { value: 'nuclear', label: 'Nuclear Stress Test' },
        ],
        default: 'echocardiogram',
      },
      {
        key: 'hypertrophy',
        label: 'Cardiac hypertrophy present?',
        type: 'boolean',
        default: false,
      },
      {
        key: 'dilatation',
        label: 'Cardiac dilatation present?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['cardiomyopathy', 'cad', 'post-mi', 'hypertensive-heart'],

    interpretation: {
      normal: { ef_percent: [55, 99], label: 'Normal (>=55%)', color: 'green' },
      mild: { ef_percent: [40, 55], label: 'Mildly Reduced (40-54%)', color: 'yellow' },
      moderate: { ef_percent: [30, 40], label: 'Moderately Reduced (30-39%)', color: 'orange' },
      severe: { ef_percent: [0, 30], label: 'Severely Reduced (<30%)', color: 'red' },
    },
  },

  METS_CAPACITY: {
    id: 'mets-capacity',
    name: 'METs Capacity (Exercise Tolerance)',
    shortName: 'METs',
    icon: '🏃',
    description: 'Metabolic equivalents for cardiac functional capacity',

    fields: [
      {
        key: 'mets_level',
        label: 'METs Level',
        unit: 'METs',
        type: 'number',
        min: 1,
        max: 20,
        step: 0.1,
        required: true,
        placeholder: '7',
        help: '1 MET = resting energy expenditure',
      },
    ],

    metadata: [
      {
        key: 'test_type',
        label: 'Assessment Method',
        type: 'select',
        options: [
          { value: 'exercise-test', label: 'Exercise Stress Test (Measured)' },
          { value: 'estimated', label: 'Estimated by Provider' },
          { value: 'interview', label: 'Based on Activity Interview' },
        ],
        default: 'estimated',
      },
      {
        key: 'symptoms_present',
        label: 'Symptoms at this METs level?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['cardiomyopathy', 'cad', 'post-mi', 'hypertensive-heart', 'pericarditis'],

    interpretation: {
      severe: { mets_level: [0, 3], label: '≤3 METs (100% Rating)', color: 'red' },
      moderate: { mets_level: [3, 5], label: '3.1-5 METs (60% Rating)', color: 'orange' },
      mild_moderate: { mets_level: [5, 7], label: '5.1-7 METs (30% Rating)', color: 'yellow' },
      mild: { mets_level: [7, 10], label: '7.1-10 METs (10% Rating)', color: 'green' },
      normal: { mets_level: [10, 99], label: '>10 METs (Normal)', color: 'green' },
    },
  },


  // ============================================
  // PHASE 2B: VASCULAR MEASUREMENTS
  // ============================================

  ANKLE_BRACHIAL_INDEX: {
    id: 'ankle-brachial-index',
    name: 'Ankle-Brachial Index (ABI)',
    shortName: 'ABI',
    icon: '🦶',
    description: 'Ratio of ankle to arm blood pressure for PAD assessment',

    fields: [
      {
        key: 'ankle_systolic',
        label: 'Ankle Systolic BP',
        unit: 'mmHg',
        type: 'number',
        min: 40,
        max: 250,
        step: 1,
        required: true,
        placeholder: '120',
        help: 'Measured at posterior tibial or dorsalis pedis artery',
      },
      {
        key: 'brachial_systolic',
        label: 'Brachial (Arm) Systolic BP',
        unit: 'mmHg',
        type: 'number',
        min: 60,
        max: 250,
        step: 1,
        required: true,
        placeholder: '120',
        help: 'Measured at brachial artery',
      },
      {
        key: 'abi_calculated',
        label: 'Calculated ABI',
        unit: '',
        type: 'calculated',
        formula: 'ankle_systolic / brachial_systolic',
        precision: 2,
        help: 'Auto-calculated: Ankle BP ÷ Arm BP',
      },
    ],

    metadata: [
      {
        key: 'side',
        label: 'Side Measured',
        type: 'select',
        options: [
          { value: 'left', label: 'Left Leg' },
          { value: 'right', label: 'Right Leg' },
          { value: 'both', label: 'Both Legs' },
        ],
        default: 'left',
      },
      {
        key: 'method',
        label: 'Measurement Method',
        type: 'select',
        options: [
          { value: 'doppler', label: 'Doppler Ultrasound' },
          { value: 'manual', label: 'Manual/Oscillometric' },
        ],
        default: 'doppler',
      },
    ],

    relatedConditions: ['peripheral-arterial-disease'],

    interpretation: {
      severe: { abi_calculated: [0, 0.4], label: 'Severe PAD (100% Rating)', color: 'red' },
      moderate_severe: { abi_calculated: [0.4, 0.5], label: 'Moderate-Severe PAD (60% Rating)', color: 'red' },
      moderate: { abi_calculated: [0.5, 0.7], label: 'Moderate PAD (40% Rating)', color: 'orange' },
      mild: { abi_calculated: [0.7, 0.9], label: 'Mild PAD (20% Rating)', color: 'yellow' },
      borderline: { abi_calculated: [0.9, 1.0], label: 'Borderline', color: 'yellow' },
      normal: { abi_calculated: [1.0, 1.4], label: 'Normal (>=1.0)', color: 'green' },
      calcified: { abi_calculated: [1.4, 9.9], label: 'Non-compressible (Calcified Arteries)', color: 'orange' },
    },
  },

  // ============================================
  // PHASE 10: LIVER FUNCTION - MELD SCORE
  // ============================================

  MELD_SCORE: {
    id: 'meld-score',
    name: 'MELD Score (Liver Function)',
    shortName: 'MELD',
    icon: '🫀',
    description: 'Model for End-Stage Liver Disease score',

    fields: [
      {
        key: 'meld_score',
        label: 'MELD Score',
        unit: '',
        type: 'number',
        min: 6,
        max: 40,
        step: 1,
        required: true,
        placeholder: '10',
        help: 'Calculated score 6-40',
      },
      {
        key: 'bilirubin',
        label: 'Bilirubin',
        unit: 'mg/dL',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.1,
        required: false,
        placeholder: '1.0',
      },
      {
        key: 'inr',
        label: 'INR',
        unit: '',
        type: 'number',
        min: 0.5,
        max: 10,
        step: 0.1,
        required: false,
        placeholder: '1.0',
      },
      {
        key: 'creatinine_liver',
        label: 'Creatinine',
        unit: 'mg/dL',
        type: 'number',
        min: 0,
        max: 15,
        step: 0.1,
        required: false,
        placeholder: '1.0',
      },
    ],

    metadata: [
      {
        key: 'on_dialysis',
        label: 'On dialysis?',
        type: 'boolean',
        default: false,
      },
    ],

    relatedConditions: ['cirrhosis'],

    interpretation: {
      severe: { meld_score: [15, 99], label: 'Severe (>=15) - 100% Rating', color: 'red' },
      moderate_severe: { meld_score: [12, 15], label: 'Moderate-Severe (12-14) - 60% Rating', color: 'orange' },
      moderate: { meld_score: [10, 12], label: 'Moderate (10-11) - 30% Rating', color: 'yellow' },
      mild: { meld_score: [7, 10], label: 'Mild (7-9) - 10% Rating', color: 'green' },
      minimal: { meld_score: [0, 7], label: 'Minimal (≤6) - 0% Rating', color: 'green' },
    },
  },
};


// Helper to get measurement type by ID
export const getMeasurementType = (id) => {
  return Object.values(MEASUREMENT_TYPES).find(type => type.id === id) || null;
};

// Helper to get all measurement types as array
export const getAllMeasurementTypes = () => {
  return Object.values(MEASUREMENT_TYPES);
};

// Helper to get measurement types for a specific condition
export const getMeasurementTypesForCondition = (conditionId) => {
  return Object.values(MEASUREMENT_TYPES).filter(type =>
      type.relatedConditions.includes(conditionId)
  );
};

// Helper to interpret a measurement value
export const interpretMeasurement = (measurementTypeId, values, metadata = {}) => {
  const type = getMeasurementType(measurementTypeId);
  if (!type || !type.interpretation) return null;

  const interpretations = type.interpretation;

  // Special handling for different measurement types
  switch (measurementTypeId) {
    case 'blood-pressure': {
      const { systolic, diastolic } = values;
      // Check each category (order matters - most severe first)
      if (systolic >= 180 || diastolic >= 120) return interpretations.crisis;
      if (systolic >= 140 || diastolic >= 90) return interpretations.stage2;
      if (systolic >= 130 || diastolic >= 80) return interpretations.stage1;
      if (systolic >= 120 && diastolic < 80) return interpretations.elevated;
      return interpretations.normal;
    }
    case 'blood-glucose': {
      const { glucose } = values;
      const timing = metadata.mealTiming || 'random';
      const isFasting = timing === 'fasting' || timing === 'before-breakfast';

      if (glucose < 70) return interpretations.low;

      if (isFasting) {
        if (glucose >= 126) return interpretations.diabetes_fasting;
        if (glucose >= 100) return interpretations.prediabetes_fasting;
        return interpretations.normal_fasting;
      } else {
        if (glucose >= 200) return interpretations.high_random;
        if (glucose >= 140) return interpretations.elevated_random;
        return interpretations.normal_random;
      }
    }
    case 'hba1c': {
      const { hba1c } = values;
      if (hba1c >= 8.0) return interpretations.uncontrolled;
      if (hba1c >= 6.5) return interpretations.diabetes;
      if (hba1c >= 5.7) return interpretations.prediabetes;
      return interpretations.normal;
    }
    case 'weight': {
      const { weight, height } = values;
      if (!height) return null; // Need height to calculate BMI

      // Calculate BMI: (weight in lbs / (height in inches)Ã‚Â²) Ãƒâ€ 703
      const bmi = (weight / (height * height)) * 703;

      if (bmi >= 40) return { ...interpretations.obese3, bmi: bmi.toFixed(1) };
      if (bmi >= 35) return { ...interpretations.obese2, bmi: bmi.toFixed(1) };
      if (bmi >= 30) return { ...interpretations.obese1, bmi: bmi.toFixed(1) };
      if (bmi >= 25) return { ...interpretations.overweight, bmi: bmi.toFixed(1) };
      if (bmi >= 18.5) return { ...interpretations.normal, bmi: bmi.toFixed(1) };
      return { ...interpretations.underweight, bmi: bmi.toFixed(1) };
    }
    case 'oxygen-saturation': {
      const { spo2 } = values;
      if (spo2 >= 95) return interpretations.normal;
      if (spo2 >= 92) return interpretations.mild;
      if (spo2 >= 88) return interpretations.moderate;
      return interpretations.severe;
    }
    case 'dlco': {
      const { dlco, dlcoPredicted } = values;
      if (!dlcoPredicted) return null;

      const percent = (dlco / dlcoPredicted) * 100;
      const interpretations = type.interpretation;

      if (percent < 40) return { ...interpretations.severe, percent: percent.toFixed(0) };
      if (percent < 55) return { ...interpretations.moderate, percent: percent.toFixed(0) };
      if (percent < 65) return { ...interpretations.mild, percent: percent.toFixed(0) };
      if (percent < 80) return { ...interpretations.low, percent: percent.toFixed(0) };
      return { ...interpretations.normal, percent: percent.toFixed(0) };
    }

    case 'peak-flow': {
      const { peakFlow } = values;
      const personalBest = metadata.personalBest;

      if (!personalBest || personalBest === 0) return null;

      const percent = (peakFlow / personalBest) * 100;

      if (percent >= 80) return { ...interpretations.green, percent: percent.toFixed(0) };
      if (percent >= 50) return { ...interpretations.yellow, percent: percent.toFixed(0) };
      return { ...interpretations.red, percent: percent.toFixed(0) };
    }
    case 'bristol-scale': {
      const { bristolType } = values;

      switch (bristolType) {
        case 1: return interpretations.type1;
        case 2: return interpretations.type2;
        case 3: return interpretations.type3;
        case 4: return interpretations.type4;
        case 5: return interpretations.type5;
        case 6: return interpretations.type6;
        case 7: return interpretations.type7;
        default: return null;
      }
    }
    case 'egfr': {
      const { egfr } = values;
      if (egfr >= 90) return interpretations.normal;
      if (egfr >= 60) return interpretations.mild;
      if (egfr >= 30) return interpretations.moderate;
      if (egfr >= 15) return interpretations.severe;
      return interpretations.kidney_failure;
    }
    case 'creatinine': {
      const { creatinine } = values;
      if (creatinine >= 5.0) return interpretations.severely_elevated;
      if (creatinine >= 2.0) return interpretations.elevated;
      if (creatinine >= 1.2) return interpretations.mildly_elevated;
      if (creatinine >= 0.6) return interpretations.normal;
      return interpretations.low;
    }
    case 'bun': {
      const { bun } = values;
      if (bun >= 80) return interpretations.severely_elevated;
      if (bun >= 40) return interpretations.elevated;
      if (bun >= 20) return interpretations.mildly_elevated;
      if (bun >= 7) return interpretations.normal;
      return interpretations.low;
    }
    case 'rom': {
      // ROM interpretation is condition-specific and handled elsewhere
      // No general interpretation thresholds
      return null;
    }
    case 'meld-score': {
      const { meld_score } = values;
      if (meld_score >= 15) return { label: 'Severe (>=15)', color: 'red', rating: '100%' };
      if (meld_score >= 12) return { label: 'Moderate-Severe (12-14)', color: 'orange', rating: '60%' };
      if (meld_score >= 10) return { label: 'Moderate (10-11)', color: 'yellow', rating: '30%' };
      if (meld_score > 6) return { label: 'Mild (7-9)', color: 'green', rating: '10%' };
      return { label: 'Minimal (≤6)', color: 'green', rating: '0%' };
    }

    default:
      return null;
  }
};

// Helper to format measurement value for display
export const formatMeasurementValue = (measurementTypeId, values) => {
  const type = getMeasurementType(measurementTypeId);
  if (!type) return '';

  switch (measurementTypeId) {
    case 'blood-pressure':
      return `${values.systolic}/${values.diastolic} mmHg${values.heartRate ? ` • HR: ${values.heartRate} bpm` : ''}`;
    case 'blood-glucose':
      return `${values.glucose} mg/dL`;
    case 'hba1c':
      return `${values.hba1c}%`;
    case 'weight':
      if (values.height) {
        const bmi = ((values.weight / (values.height * values.height)) * 703).toFixed(1);
        return `${values.weight} lbs • BMI: ${bmi}`;
      }
      return `${values.weight} lbs`;
    case 'oxygen-saturation':
      return `${values.spo2}%${values.heartRate ? ` • HR: ${values.heartRate} bpm` : ''}`;

    case 'peak-flow':
      if (values.peakFlow) {
        let display = `${values.peakFlow} L/min`;
        // Show percentage of personal best if provided
        const metadata = arguments[2]; // Get metadata if passed
        if (metadata?.personalBest && metadata.personalBest > 0) {
          const percent = ((values.peakFlow / metadata.personalBest) * 100).toFixed(0);
          display += ` (${percent}% of best)`;
        }
        return display;
      }
      return '';
    case 'rom':
      const joint = arguments[2]?.joint || '';
      const movement = arguments[2]?.movement || '';
      const side = arguments[2]?.side || '';
      return `${values.measurement}° ${movement ? `(${movement})` : ''} ${joint ? `- ${joint}` : ''} ${side ? `[${side}]` : ''}`.trim();
    case 'bristol-scale':
      const bristolLabels = {
        1: 'Type 1 (Hard lumps)',
        2: 'Type 2 (Lumpy)',
        3: 'Type 3 (Cracked)',
        4: 'Type 4 (Smooth)',
        5: 'Type 5 (Soft blobs)',
        6: 'Type 6 (Mushy)',
        7: 'Type 7 (Liquid)',
      };
      return bristolLabels[values.bristolType] || `Type ${values.bristolType}`;
    case 'fev1':
      if (values.fev1Predicted) {
        const percentPredicted = ((values.fev1 / values.fev1Predicted) * 100).toFixed(0);
        return `${values.fev1} L (${percentPredicted}% predicted)`;
      }
      return `${values.fev1} L`;
    case 'fvc':
      return `${values.fvc} L`;
    case 'dlco':
      if (values.dlcoPredicted) {
        const percentPredicted = ((values.dlco / values.dlcoPredicted) * 100).toFixed(0);
        return `${values.dlco} mL/min/mmHg (${percentPredicted}% predicted)`;
      }
      return `${values.dlco} mL/min/mmHg`;
    case 'egfr':
      return `${values.egfr} mL/min/1.73m²`;
    case 'creatinine':
      return `${values.creatinine} mg/dL`;
    case 'bun':
      return `${values.bun} mg/dL`;
    case 'menstrual-cycle': {
      const flowLabels = {
        'spotting': 'Spotting',
        'light': 'Light',
        'moderate': 'Moderate',
        'heavy': 'Heavy',
        'very-heavy': 'Very Heavy'
      };
      return `${values.cycleLength}d cycle, ${values.flowDuration}d duration, ${flowLabels[values.flowHeaviness] || values.flowHeaviness} flow`;
    }
    case 'pelvic-pain': {
      const painTypes = {
        'chronic-pelvic': 'Chronic pelvic',
        'dysmenorrhea': 'Menstrual',
        'dyspareunia': 'Intercourse',
        'ovulation': 'Ovulation',
        'other': 'Other'
      };
      return `${painTypes[values.painType] || values.painType} pain: ${values.painSeverity}/10`;
    }
    case 'prolapse-staging': {
      const types = {
        'cystocele': 'Cystocele',
        'rectocele': 'Rectocele',
        'uterine': 'Uterine',
        'vault': 'Vault',
        'enterocele': 'Enterocele',
        'multiple': 'Multiple'
      };
      return `POP-Q Stage ${values.popStage} - ${types[values.prolapseType] || values.prolapseType}`;
    }
    case 'jaw-opening': {
      const parts = [`${values.max_opening}mm opening`];

      if (values.lateral_excursion) {
        parts.push(`${values.lateral_excursion}mm lateral`);
      }

      if (values.dietary_restrictions && values.dietary_restrictions !== 'none') {
        const dietLabels = {
          'semi-solid': 'Semi-solid',
          'soft': 'Soft',
          'puree': 'Puree',
          'full-liquid': 'Liquid',
        };
        parts.push(`${dietLabels[values.dietary_restrictions]} diet`);
      }

      return parts.join(' | ');
    }
    case 'tooth-count': {
      const parts = [`${values.total_missing} missing`];

      if (values.prosthesis_type && values.prosthesis_type !== 'none') {
        const prosTypes = {
          'partial-removable': 'Partial',
          'complete-upper': 'Upper denture',
          'complete-lower': 'Lower denture',
          'complete-both': 'Full dentures',
          'implants': 'Implants',
          'bridge': 'Bridge',
        };
        parts.push(prosTypes[values.prosthesis_type]);
      }

      return parts.join(' | ');
    }
    case 'meld-score': {
      let result = `MELD ${values.meld_score}`;
      const components = [];
      if (values.bilirubin) components.push(`Bili: ${values.bilirubin}`);
      if (values.inr) components.push(`INR: ${values.inr}`);
      if (values.creatinine_liver) components.push(`Cr: ${values.creatinine_liver}`);
      if (components.length > 0) {
        result += ` (${components.join(', ')})`;
      }
      return result;
    }
    default:
      return Object.entries(values)
      .map(([key, value]) => {
        const field = type.fields.find(f => f.key === key);
        return field ? `${value} ${field.unit || ''}` : '';
      })
      .filter(Boolean)
      .join(', ');
  }
};