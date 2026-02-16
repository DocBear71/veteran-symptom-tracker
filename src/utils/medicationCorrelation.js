/**
 * Medication Correlation - Search Term Mappings
 *
 * Maps each VA condition to an array of search terms that match against
 * the medication log "takenFor" field. These are case-insensitive and
 * support partial matching.
 *
 * Two lookup methods:
 * 1. By conditionKey (e.g., 'lumbosacralStrain') — used by GenericRatingCard
 * 2. By diagnosticCode (e.g., '5237') — auto-resolve from any analysis object
 *
 * When a veteran logs a medication "for" a condition (e.g., "Lower Back Pain"),
 * these terms help the MedicationCorrelation component find relevant logs.
 */

export const CONDITION_MED_SEARCH_TERMS = {
  // --- Headaches / Migraines ---
  migraine: ['migraine', 'headache', 'head pain'],

  // --- Mental Health ---
  ptsd: ['ptsd', 'post-traumatic', 'posttraumatic', 'nightmares', 'anxiety', 'hypervigilance'],
  majorDepression: ['depression', 'depressive', 'mood', 'sadness'],
  generalizedAnxiety: ['anxiety', 'anxious', 'worry', 'panic', 'gad'],
  panicDisorder: ['panic', 'panic attack', 'anxiety'],
  bipolar: ['bipolar', 'mania', 'manic', 'mood stabiliz'],
  socialAnxiety: ['social anxiety', 'social phobia'],
  ocd: ['ocd', 'obsessive', 'compulsive'],
  dysthymia: ['dysthymia', 'persistent depressive', 'chronic depression'],
  insomnia: ['insomnia', 'sleep', 'sleeplessness'],

  // --- Musculoskeletal ---
  lumbosacralStrain: ['lower back', 'back pain', 'lumbar', 'lumbosacral', 'low back'],
  intervertebralDisc: ['disc', 'ivds', 'intervertebral', 'herniated', 'bulging disc', 'back pain', 'lower back'],
  kneeInstability: ['knee', 'knee pain', 'knee instability'],
  shoulder: ['shoulder', 'shoulder pain', 'rotator cuff'],
  hip: ['hip', 'hip pain'],
  ankle: ['ankle', 'ankle pain'],
  wrist: ['wrist', 'wrist pain', 'carpal tunnel'],
  elbow: ['elbow', 'elbow pain', 'tennis elbow', 'golfer elbow'],
  degenerativeArthritis: ['arthritis', 'degenerative', 'joint pain', 'osteoarthritis'],
  plantarFasciitis: ['plantar', 'foot pain', 'heel pain', 'plantar fasciitis'],
  fibromyalgia: ['fibromyalgia', 'fibro', 'widespread pain', 'body pain'],
  gout: ['gout', 'gouty', 'uric acid'],
  bursitis: ['bursitis', 'bursa'],
  tendinitis: ['tendinitis', 'tendonitis', 'tendon'],
  myositis: ['myositis', 'muscle inflammation'],
  spine: ['spine', 'spinal', 'cervical', 'thoracic', 'back pain'],

  // --- Neurological ---
  tbi: ['tbi', 'traumatic brain', 'brain injury', 'concussion', 'headache'],
  tbiResiduals: ['tbi', 'brain injury', 'headache', 'cognitive', 'concussion'],
  radiculopathy: ['radiculopathy', 'radiating', 'nerve pain', 'sciatica', 'shooting pain'],
  peripheralNeuropathy: ['neuropathy', 'peripheral nerve', 'numbness', 'tingling'],
  seizures: ['seizure', 'epilepsy', 'convulsion'],
  ms: ['multiple sclerosis', 'ms', 'demyelinating'],
  parkinsons: ['parkinson', 'tremor', 'movement disorder'],
  narcolepsy: ['narcolepsy', 'excessive sleepiness', 'cataplexy'],

  // --- Cardiovascular ---
  hypertension: ['hypertension', 'blood pressure', 'high bp'],
  raynauds: ['raynaud', 'cold hands', 'cold fingers'],
  varicoseVeins: ['varicose', 'vein', 'leg swelling'],
  cad: ['coronary', 'heart disease', 'angina', 'chest pain'],
  arrhythmia: ['arrhythmia', 'irregular heartbeat', 'afib', 'palpitations'],
  cardiomyopathy: ['cardiomyopathy', 'heart failure', 'heart'],
  pad: ['peripheral artery', 'pad', 'claudication', 'leg pain'],

  // --- Respiratory ---
  sleepApnea: ['sleep apnea', 'apnea', 'cpap', 'sleep'],
  asthma: ['asthma', 'inhaler', 'breathing', 'wheezing'],
  sinusitis: ['sinus', 'sinusitis', 'nasal congestion'],
  rhinitis: ['rhinitis', 'allergies', 'nasal', 'runny nose'],
  copd: ['copd', 'chronic obstructive', 'emphysema', 'breathing'],
  bronchitis: ['bronchitis', 'chronic bronchitis', 'cough'],
  pulmonaryFibrosis: ['pulmonary fibrosis', 'lung fibrosis', 'breathing'],

  // --- Gastrointestinal ---
  ibs: ['ibs', 'irritable bowel', 'stomach', 'abdominal', 'bowel'],
  gerd: ['gerd', 'reflux', 'heartburn', 'acid reflux', 'stomach acid'],
  gerdComplications: ['gerd', 'reflux', 'barrett', 'esophageal', 'stricture'],
  ulcerativeColitis: ['colitis', 'ulcerative', 'bowel'],
  pepticUlcer: ['ulcer', 'peptic', 'stomach ulcer'],
  hemorrhoids: ['hemorrhoid', 'rectal'],
  diverticulitis: ['diverticulit', 'diverticular'],
  gastritis: ['gastritis', 'stomach inflammation', 'stomach pain'],
  pancreatitis: ['pancreatitis', 'pancreas'],
  cirrhosis: ['cirrhosis', 'liver', 'hepatic'],

  // --- Endocrine ---
  diabetes: ['diabetes', 'diabetic', 'blood sugar', 'glucose', 'insulin'],
  hypothyroidism: ['thyroid', 'hypothyroid', 'levothyroxine'],
  hyperthyroidism: ['hyperthyroid', 'thyroid', 'overactive thyroid'],
  addisons: ['addison', 'adrenal insufficiency', 'cortisol'],
  cushings: ['cushing', 'cortisol', 'steroid'],

  // --- Sensory ---
  tinnitus: ['tinnitus', 'ringing', 'ear ringing'],
  hearingLoss: ['hearing', 'hearing loss', 'deaf'],
  menieres: ['meniere', 'vertigo', 'dizziness', 'balance'],

  // --- Dermatological ---
  chronicUrticaria: ['urticaria', 'hives', 'skin rash', 'itching'],
  eczema: ['eczema', 'dermatitis', 'skin', 'itching', 'rash'],
  psoriasis: ['psoriasis', 'skin', 'plaque', 'scaling'],
  acne: ['acne', 'chloracne', 'skin'],

  // --- ENT ---
  tmj: ['tmj', 'jaw pain', 'temporomandibular', 'jaw'],
  deviatedSeptum: ['septum', 'deviated', 'nasal obstruction'],
  laryngitis: ['laryngitis', 'voice', 'hoarseness'],

  // --- Genitourinary ---
  kidneyStones: ['kidney stone', 'renal calcul', 'kidney pain'],
  chronicRenal: ['kidney', 'renal', 'kidney disease'],
  prostate: ['prostate', 'bph', 'prostatitis', 'urinary'],
  erectile: ['erectile', 'ed', 'sexual dysfunction'],
  endometriosis: ['endometriosis', 'pelvic pain', 'menstrual'],

  // --- Infectious ---
  hiv: ['hiv', 'antiretroviral', 'immune'],
  hepatitisC: ['hepatitis c', 'hep c', 'hcv', 'liver'],
  hepatitisB: ['hepatitis b', 'hep b', 'hbv', 'liver'],
  lyme: ['lyme', 'tick-borne', 'lyme disease'],

  // --- Hematologic ---
  anemia: ['anemia', 'iron', 'fatigue', 'blood'],
  sickleCell: ['sickle cell', 'sickle', 'blood disorder'],

  // --- Other ---
  chronicFatigue: ['fatigue', 'chronic fatigue', 'tiredness', 'exhaustion', 'cfs'],
  dementia: ['dementia', 'memory loss', 'cognitive'],
};

/**
 * Diagnostic Code → conditionKey mapping
 * Maps VA diagnostic codes to CONDITION_MED_SEARCH_TERMS keys
 * Enables auto-resolution from any analysis object's diagnosticCode
 */
const DC_TO_CONDITION_KEY = {
  // Headaches / Migraines
  '8100': 'migraine',

  // Mental Health (General Rating Formula - 38 CFR 4.130)
  '9411': 'ptsd',
  '9434': 'majorDepression',
  '9400': 'generalizedAnxiety',
  '9412': 'panicDisorder',
  '9432': 'bipolar',
  '9403': 'socialAnxiety',
  '9404': 'ocd',
  '9433': 'dysthymia',
  '9413': 'generalizedAnxiety',
  '9435': 'majorDepression',
  '9440': 'ptsd',
  '8108': 'insomnia',

  // Musculoskeletal
  '5237': 'lumbosacralStrain',
  '5243': 'intervertebralDisc',
  '5257': 'kneeInstability',
  '5201': 'shoulder', '5202': 'shoulder', '5203': 'shoulder',
  '5252': 'hip', '5253': 'hip', '5254': 'hip', '5255': 'hip',
  '5270': 'ankle', '5271': 'ankle',
  '5214': 'wrist', '5215': 'wrist',
  '5205': 'elbow', '5206': 'elbow', '5207': 'elbow',
  '5003': 'degenerativeArthritis',
  '5276': 'plantarFasciitis',
  '5025': 'fibromyalgia',
  '5017': 'gout',
  '5019': 'bursitis',
  '5024': 'tendinitis',
  '5021': 'myositis',
  '5235': 'spine', '5236': 'spine', '5238': 'spine', '5240': 'spine', '5242': 'spine',

  // Neurological
  '8045': 'tbi',
  '8520': 'radiculopathy',
  '8999': 'peripheralNeuropathy',
  '8910': 'seizures', '8911': 'seizures', '8912': 'seizures', '8913': 'seizures', '8914': 'seizures',
  '8018': 'ms',
  '8004': 'parkinsons',

  // Cardiovascular
  '7101': 'hypertension',
  '7117': 'raynauds',
  '7120': 'varicoseVeins',
  '7005': 'cad',
  '7010': 'arrhythmia', '7011': 'arrhythmia',
  '7020': 'cardiomyopathy',
  '7114': 'pad',
  '7015': 'cardiomyopathy',
  '7000': 'cardiomyopathy',

  // Respiratory
  '6847': 'sleepApnea',
  '6602': 'asthma',
  '6510': 'sinusitis', '6511': 'sinusitis', '6512': 'sinusitis', '6513': 'sinusitis', '6514': 'sinusitis',
  '6522': 'rhinitis',
  '6604': 'copd',
  '6600': 'bronchitis',
  '6603': 'pulmonaryFibrosis',

  // Gastrointestinal
  '7319': 'ibs',
  '7346': 'gerd',
  '7203': 'gerdComplications',
  '7323': 'ulcerativeColitis',
  '7304': 'pepticUlcer', '7305': 'pepticUlcer', '7306': 'pepticUlcer',
  '7336': 'hemorrhoids',
  '7327': 'diverticulitis',
  '7307': 'gastritis',
  '7347': 'pancreatitis',
  '7312': 'cirrhosis',

  // Endocrine
  '7913': 'diabetes',
  '7903': 'hypothyroidism',
  '7900': 'hyperthyroidism',
  '7911': 'addisons',
  '7907': 'cushings',

  // Sensory
  '6260': 'tinnitus',
  '6100': 'hearingLoss',
  '6205': 'menieres',

  // Dermatological
  '7825': 'chronicUrticaria',
  '7806': 'eczema',
  '7816': 'psoriasis',
  '7828': 'acne', '7829': 'acne',

  // ENT
  '9905': 'tmj',
  '6502': 'deviatedSeptum',
  '6516': 'laryngitis',

  // Genitourinary
  '7508': 'kidneyStones',
  '7500': 'chronicRenal', '7501': 'chronicRenal', '7502': 'chronicRenal',
  '7527': 'prostate',
  '7522': 'erectile',
  '7629': 'endometriosis',

  // Infectious
  '6351': 'hiv',
  '7354': 'hepatitisC',
  '7345': 'hepatitisB',
  '6319': 'lyme',

  // Hematologic
  '7700': 'anemia', '7716': 'anemia',
  '7714': 'sickleCell',

  // Other
  '6354': 'chronicFatigue',
};

/**
 * Get search terms for a condition by its key
 * Returns the search terms array or an empty array if not found
 */
export const getConditionSearchTerms = (conditionKey) => {
  return CONDITION_MED_SEARCH_TERMS[conditionKey] || [];
};

/**
 * Auto-resolve search terms from a diagnostic code
 *
 * @param {string} diagnosticCode - VA diagnostic code (e.g., '5237')
 * @returns {string[]} Array of search terms, or empty array if no mapping found
 */
export const getSearchTermsByDiagnosticCode = (diagnosticCode) => {
  if (!diagnosticCode) return [];

  // Handle compound codes like '5201-5203' — try first code
  const primaryCode = String(diagnosticCode).split('-')[0].trim();
  const conditionKey = DC_TO_CONDITION_KEY[primaryCode];
  if (conditionKey) {
    return CONDITION_MED_SEARCH_TERMS[conditionKey] || [];
  }

  return [];
};

/**
 * Auto-resolve search terms from an analysis object
 * Tries diagnosticCode first, then falls back to condition name matching
 *
 * @param {object} analysis - Rating card analysis object
 * @returns {string[]} Array of search terms
 */
export const getSearchTermsFromAnalysis = (analysis) => {
  if (!analysis) return [];

  // Try diagnostic code first (most reliable)
  const dcTerms = getSearchTermsByDiagnosticCode(analysis.diagnosticCode);
  if (dcTerms.length > 0) return dcTerms;

  // Fallback: use condition name itself as a search term
  // This handles conditions not yet in the DC mapping
  if (analysis.condition) {
    return [analysis.condition.toLowerCase()];
  }

  return [];
};