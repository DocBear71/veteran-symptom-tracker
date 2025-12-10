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

  PEAK_FLOW: {
    id: 'peak-flow',
    name: 'Peak Flow',
    shortName: 'Peak Flow',
    icon: '🌬️',
    description: 'Track peak expiratory flow for asthma monitoring',

    fields: [
      {
        key: 'peakFlow',
        label: 'Peak Flow',
        unit: 'L/min',
        type: 'number',
        min: 50,
        max: 800,
        step: 5,
        required: true,
        placeholder: '400',
        help: 'Peak expiratory flow rate',
      },
    ],

    metadata: [
      {
        key: 'timeOfDay',
        label: 'Time of day',
        type: 'select',
        options: [
          { value: 'morning', label: 'Morning' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'evening', label: 'Evening' },
        ],
        default: 'morning',
      },
      {
        key: 'beforeMedication',
        label: 'Before or after medication?',
        type: 'select',
        options: [
          { value: 'before', label: 'Before medication' },
          { value: 'after', label: 'After medication' },
          { value: 'none', label: 'Not applicable' },
        ],
        default: 'before',
      },
    ],

    relatedConditions: ['asthma', 'copd'],

    // Note: Peak flow zones are personalized based on personal best
    // These are general guidelines
    interpretation: {
      red: { percent: [0, 50], label: 'Red Zone - Danger', color: 'red' },
      yellow: { percent: [50, 80], label: 'Yellow Zone - Caution', color: 'yellow' },
      green: { percent: [80, 100], label: 'Green Zone - Good Control', color: 'green' },
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

      // Calculate BMI: (weight in lbs / (height in inches)Â²) Ã— 703
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
      return `${values.peakFlow} L/min`;
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