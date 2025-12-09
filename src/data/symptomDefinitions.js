// Detailed symptom definitions with custom fields
// These provide the form fields when logging each symptom type

export const symptomDefinitions = {
  // ============================================
  // HEARING LOSS
  // ============================================
  'hearing-loss-noticed': {
    name: 'Hearing Loss - Difficulty Hearing',
    category: 'hearing',
    description: 'Noticed difficulty hearing conversations or sounds',
    fields: [
      {
        name: 'hearingDifficulty',
        label: 'Difficulty Level',
        type: 'select',
        required: true,
        options: [
          { value: 'mild', label: 'Mild - Some difficulty in noisy environments' },
          { value: 'moderate', label: 'Moderate - Difficulty in normal conversation' },
          { value: 'severe', label: 'Severe - Need to read lips or use aids' },
          { value: 'profound', label: 'Profound - Cannot hear most sounds' }
        ]
      },
      {
        name: 'affectedEars',
        label: 'Affected Ear(s)',
        type: 'select',
        required: true,
        options: [
          { value: 'left', label: 'Left Ear Only' },
          { value: 'right', label: 'Right Ear Only' },
          { value: 'both', label: 'Both Ears (Bilateral)' }
        ]
      },
      {
        name: 'situations',
        label: 'Situations Where Noticed',
        type: 'multiselect',
        options: [
          'Phone conversations',
          'TV/Radio',
          'Crowded places',
          'Quiet conversations',
          'Missing alarms/doorbells',
          'Background noise interference'
        ]
      }
    ]
  },

  // ============================================
  // SCARS
  // ============================================
  'scar-pain': {
    name: 'Scar - Pain or Tenderness',
    category: 'skin',
    description: 'Pain, tenderness, or discomfort from scar tissue',
    fields: [
      {
        name: 'scarLocation',
        label: 'Scar Location',
        type: 'text',
        required: true,
        placeholder: 'e.g., Left forearm, Right thigh, Abdomen'
      },
      {
        name: 'scarArea',
        label: 'Approximate Scar Area (square cm)',
        type: 'number',
        placeholder: 'Estimate area if known'
      },
      {
        name: 'painLevel',
        label: 'Pain Level',
        type: 'select',
        options: [
          { value: 'mild', label: 'Mild - Occasional tenderness' },
          { value: 'moderate', label: 'Moderate - Frequent discomfort' },
          { value: 'severe', label: 'Severe - Constant pain' }
        ]
      }
    ]
  },

  'scar-limitation': {
    name: 'Scar - Movement Limitation',
    category: 'skin',
    description: 'Scar tissue causing limited range of motion',
    fields: [
      {
        name: 'scarLocation',
        label: 'Scar Location',
        type: 'text',
        required: true
      },
      {
        name: 'affectedMovement',
        label: 'Movement Affected',
        type: 'text',
        placeholder: 'e.g., Bending elbow, knee flexion'
      }
    ]
  },

  'scar-disfigurement': {
    name: 'Scar - Disfigurement',
    category: 'skin',
    description: 'Visible scarring causing disfigurement',
    fields: [
      {
        name: 'scarLocation',
        label: 'Scar Location',
        type: 'text',
        required: true
      },
      {
        name: 'visibility',
        label: 'Visibility',
        type: 'select',
        options: [
          { value: 'exposed', label: 'Exposed (face, neck, hands)' },
          { value: 'covered', label: 'Usually covered by clothing' }
        ]
      },
      {
        name: 'characteristics',
        label: 'Scar Characteristics',
        type: 'multiselect',
        options: [
          'Raised/hypertrophic',
          'Keloid',
          'Discolored',
          'Irregular texture',
          'Depressed/pitted',
          'Unstable/painful'
        ]
      }
    ]
  },

  // ============================================
  // PSORIASIS
  // ============================================
  'psoriasis-flare': {
    name: 'Psoriasis Flare-Up',
    category: 'skin',
    description: 'Active psoriasis outbreak or flare-up',
    fields: [
      {
        name: 'affectedAreas',
        label: 'Affected Body Areas',
        type: 'multiselect',
        required: true,
        options: [
          'Scalp',
          'Face',
          'Elbows',
          'Knees',
          'Hands',
          'Feet',
          'Trunk',
          'Genitals',
          'Other'
        ]
      },
      {
        name: 'bodyPercentage',
        label: 'Approximate % of Body Covered',
        type: 'select',
        options: [
          { value: '1-5', label: '1-5% (palm-sized areas)' },
          { value: '5-10', label: '5-10%' },
          { value: '10-20', label: '10-20%' },
          { value: '20-40', label: '20-40%' },
          { value: '40+', label: 'More than 40%' }
        ]
      },
      {
        name: 'symptoms',
        label: 'Current Symptoms',
        type: 'multiselect',
        options: [
          'Red patches',
          'Silver/white scales',
          'Dry, cracked skin',
          'Itching',
          'Burning',
          'Bleeding',
          'Thick, ridged nails'
        ]
      }
    ]
  },

  // ============================================
  // ECZEMA/DERMATITIS
  // ============================================
  'eczema-flare': {
    name: 'Eczema/Dermatitis Flare-Up',
    category: 'skin',
    description: 'Active eczema or dermatitis outbreak',
    fields: [
      {
        name: 'dermatitisType',
        label: 'Type (if diagnosed)',
        type: 'select',
        options: [
          { value: 'atopic', label: 'Atopic Dermatitis' },
          { value: 'contact', label: 'Contact Dermatitis' },
          { value: 'seborrheic', label: 'Seborrheic Dermatitis' },
          { value: 'unknown', label: 'Unknown/Unspecified' }
        ]
      },
      {
        name: 'affectedAreas',
        label: 'Affected Areas',
        type: 'multiselect',
        required: true,
        options: [
          'Face',
          'Neck',
          'Hands',
          'Arms',
          'Legs',
          'Trunk',
          'Scalp',
          'Other'
        ]
      },
      {
        name: 'bodyPercentage',
        label: 'Approximate % of Body Affected',
        type: 'select',
        options: [
          { value: '1-5', label: '1-5%' },
          { value: '5-10', label: '5-10%' },
          { value: '10-20', label: '10-20%' },
          { value: '20-40', label: '20-40%' },
          { value: '40+', label: 'More than 40%' }
        ]
      },
      {
        name: 'symptoms',
        label: 'Symptoms',
        type: 'multiselect',
        options: [
          'Intense itching',
          'Red/inflamed skin',
          'Dry, cracked skin',
          'Oozing/crusting',
          'Thickened skin',
          'Raw/sensitive areas'
        ]
      }
    ]
  },

  // ============================================
  // TBI RESIDUALS
  // ============================================
  'tbi-cognitive': {
    name: 'TBI - Cognitive Difficulties',
    category: 'neurological',
    description: 'Cognitive problems resulting from TBI',
    fields: [
      {
        name: 'cognitiveIssues',
        label: 'Cognitive Difficulties',
        type: 'multiselect',
        required: true,
        options: [
          'Memory problems',
          'Difficulty concentrating',
          'Slow processing',
          'Confusion',
          'Difficulty multitasking',
          'Word-finding problems',
          'Disorientation'
        ]
      },
      {
        name: 'functionalImpact',
        label: 'Impact on Daily Function',
        type: 'multiselect',
        options: [
          'Work difficulties',
          'Forgetting appointments',
          'Getting lost',
          'Unable to follow conversations',
          'Difficulty with finances',
          'Trouble learning new things'
        ]
      }
    ]
  },

  'tbi-emotional': {
    name: 'TBI - Emotional/Behavioral Changes',
    category: 'neurological',
    description: 'Mood or behavior changes from TBI',
    fields: [
      {
        name: 'emotionalChanges',
        label: 'Emotional/Behavioral Symptoms',
        type: 'multiselect',
        required: true,
        options: [
          'Irritability',
          'Mood swings',
          'Depression',
          'Anxiety',
          'Impulsivity',
          'Aggression',
          'Social withdrawal',
          'Personality changes'
        ]
      }
    ]
  },

  // ============================================
  // GERD COMPLICATIONS
  // ============================================
  'gerd-complication': {
    name: 'GERD - Complications',
    category: 'gastrointestinal',
    description: 'GERD-related complications (hiatal hernia, Barrett\'s, stricture)',
    fields: [
      {
        name: 'complicationType',
        label: 'Diagnosed Complication',
        type: 'select',
        required: true,
        options: [
          { value: 'hiatal-hernia', label: 'Hiatal Hernia' },
          { value: 'barretts', label: 'Barrett\'s Esophagus' },
          { value: 'stricture', label: 'Esophageal Stricture' },
          { value: 'esophagitis', label: 'Esophagitis' },
          { value: 'other', label: 'Other Complication' }
        ]
      },
      {
        name: 'symptoms',
        label: 'Current Symptoms',
        type: 'multiselect',
        options: [
          'Difficulty swallowing',
          'Food getting stuck',
          'Severe heartburn',
          'Chest pain',
          'Weight loss',
          'Regurgitation',
          'Chronic cough'
        ]
      },
      {
        name: 'treatmentRequired',
        label: 'Treatment',
        type: 'multiselect',
        options: [
          'Daily PPI medication',
          'Dilation procedures',
          'Dietary restrictions',
          'Surgery required',
          'Regular monitoring'
        ]
      }
    ]
  },
};