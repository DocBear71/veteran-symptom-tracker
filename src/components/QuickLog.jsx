import { useRef, useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';
import { getChronicSymptoms, removeChronicSymptom, saveSymptomLog, getMedications, logMedicationTaken, getSymptomLogs } from '../utils/storage';
import { useProfile } from '../hooks/useProfile';
import OccurrenceTimePicker from './OccurrenceTimePicker';

const QuickLog = ({ onLogSaved, onAddChronic }) => {
  const [chronicSymptoms, setChronicSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [showSuccess, setShowSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString());

  // Phase 1G - Recent symptoms & search
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [symptomFrequency, setSymptomFrequency] = useState({});


  // Modal state
  const [selectedChronic, setSelectedChronic] = useState(null);
  const [logSeverity, setLogSeverity] = useState(5);
  const [logNotes, setLogNotes] = useState('');

  // Medication state
  const [selectedMedications, setSelectedMedications] = useState([]);

  // Condition-specific states
  const [migraineData, setMigraineData] = useState({
    duration: '',
    prostrating: null,
    aura: false,
    nausea: false,
    lightSensitivity: false,
    soundSensitivity: false,
    triggers: '',
  });

  const [sleepData, setSleepData] = useState({
    hoursSlept: '',
    quality: 5,
    wakeUps: '',
    troubleFallingAsleep: false,
    troubleStayingAsleep: false,
    nightmares: false,
    feelRested: null,
  });

  const [ptsdData, setPtsdData] = useState({
    flashbacks: false,
    avoidance: false,
    emotionalNumbering: false,
    hypervigilance: false,
    exaggeratedStartle: false,
    intrusiveThoughts: false,
    triggerDescription: '',
  });

  const [painData, setPainData] = useState({
    radiating: false,
    radiatingTo: '',
    limitedRangeOfMotion: false,
    affectedActivities: [],
    painType: '',
    flareUp: false,
  });

  const [giData, setGIData] = useState({
    bristolScale: null,
    frequencyPerDay: '',
    urgencyLevel: '',
    bloodPresent: null,
    bloatingSeverity: '',
    abdominalPainLocation: '',
    mealRelated: null,
    nighttimeSymptoms: false,
  });

  const [respiratoryData, setRespiratoryData] = useState({
    rescueInhalerUsed: null,
    inhalerPuffs: '',
    peakFlow: '',
    spo2: '',
    activityTrigger: '',
    wheezing: false,
    chestTightness: false,
    coughing: false,
  });

  const [jointData, setJointData] = useState({
    joint: '',
    side: '',
    romEstimate: '',
    morningStiffness: '',
    swelling: false,
    instability: false,
    locking: false,
    grinding: false,
  });

  const [seizureData, setSeizureData] = useState({
    episodeType: '',
    duration: '',
    lossOfConsciousness: null,
    auraPresent: null,
    recoveryTime: '',
    witnessPresent: null,
  });

  // PHASE 2: Eye & Vision data
  const [eyeData, setEyeData] = useState({
    affectedEye: '',
    leftEyeAcuity: '',
    rightEyeAcuity: '',
    symptoms: [],
    fieldOfVision: [],
    affectedActivities: [],
    triggeringFactors: '',
    associatedConditions: [],
  });

  // Phase 3: Genitourinary data
  const [genitourinaryData, setGenitourinaryData] = useState({
    affectedSystem: '',
    kidneySymptoms: [],
    kidneyPainLocation: '',
    kidneyPainSeverity: 5,
    stoneEpisode: false,
    stonePassedToday: false,
    stoneSize: '',
    procedureRecent: '',
    procedureDate: '',
    dialysis: false,
    dialysisType: '',
    dialysisFrequency: '',
    voidingSymptoms: [],
    urinaryFrequency24h: '',
    nocturiaCount: '',
    incontinenceEpisode: false,
    incontinenceType: '',
    incontinenceLeakageAmount: '',
    padChangesRequired: '',
    catheterUse: false,
    catheterType: '',
    catheterizationsPerDay: '',
    uti: false,
    utiSymptoms: [],
    prostateSymptoms: [],
    prostateScore: '',
    prostateMedications: [],
    fecalIncontinenceEpisode: false,
    fecalIncontinenceFrequency: '',
    fecalIncontinenceType: '',
    fecalUrgency: false,
    bowelControlMethods: [],
    erectileDysfunction: false,
    edSeverity: '',
    testicular: false,
    testicularSymptoms: [],
    activitiesAffected: [],
    fluidRestriction: false,
    workMissed: false,
    associatedConditions: [],
    complications: [],
  });

  // Phase 4: Gynecological Conditions
  const [gynecologicalData, setGynecologicalData] = useState({
    affectedOrgan: '',
    painType: '',
    painSeverity: 5,
    painLocation: '',
    endometriosisDiagnosed: false,
    laparoscopyConfirmed: false,
    treatmentEffectiveness: '',
    cycleRegularity: '',
    flowHeaviness: '',
    dysmenorrheaSeverity: '',
    pcosDiagnosed: false,
    pidDiagnosed: false,
    prolapseDiagnosed: false,
    continuousTreatmentRequired: false,
  });

  // Phase 5: Hemic/Lymphatic state
  const [anemiaData, setAnemiaData] = useState({
    type: '',
    severity: '',
    treatment: [],
    supplements: [],
    transfusion_history: '',
    last_transfusion: ''
  });

  const [sickleCellData, setSickleCellData] = useState({
    crisis_type: '',
    crisis_location: [],
    pain_severity: '',
    crisis_duration: '',
    triggers: [],
    treatment_received: [],
    hospitalizations_year: ''
  });

  const [bleedingDisorderData, setBleedingDisorderData] = useState({
    disorder_type: '',
    bleeding_site: [],
    bleeding_frequency: '',
    severity: '',
    treatment: [],
    platelet_count: ''
  });

  const [infectionData, setInfectionData] = useState({
    infection_type: [],
    frequency: '',
    severity: '',
    requires_hospitalization: '',
    treatment: [],
    immune_status: ''
  });

  const [lymphomaLeukemiaData, setLymphomaLeukemiaData] = useState({
    diagnosis: '',
    stage: '',
    treatment_status: '',
    treatment_type: [],
    cycles_completed: '',
    side_effects: [],
    last_treatment_date: ''
  });

  const [polycythemiaData, setPolycythemiaData] = useState({
    diagnosis: '',
    treatment: [],
    phlebotomy_frequency: '',
    last_phlebotomy: '',
    medications: [],
    complications: []
  });

  const [treatmentData, setTreatmentData] = useState({
    treatment_type: '',
    regimen: '',
    cycle_number: '',
    side_effects: [],
    severity: '',
    management: []
  });

  const [b12DeficiencyData, setB12DeficiencyData] = useState({
    deficiency_cause: '',
    neurological_symptoms: [],
    treatment: [],
    injection_frequency: '',
    last_injection: '',
    improvement_noted: ''
  });

// Phase 6: Dental/Oral Conditions (simplified for QuickLog)
  const [dentalData, setDentalData] = useState({
    jawPainSeverity: 5,
    jawOpening: '',
    toothCount: '',
    prosthesisType: '',
    dietaryRestrictions: '',
    chewingDifficulty: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChronicSymptoms(getChronicSymptoms());
    setMedications(getMedications());

    // Phase 1G - Load recent symptoms and calculate frequency
    const allLogs = getSymptomLogs();

    // Get last 10 unique symptoms logged
    const uniqueSymptoms = [];
    const seenIds = new Set();
    for (let i = allLogs.length - 1; i >= 0 && uniqueSymptoms.length < 10; i--) {
      const log = allLogs[i];
      if (!seenIds.has(log.symptomId)) {
        uniqueSymptoms.push({
          symptomId: log.symptomId,
          symptomName: log.symptomName,
          category: log.category,
          lastLogged: log.timestamp
        });
        seenIds.add(log.symptomId);
      }
    }
    setRecentSymptoms(uniqueSymptoms);

    // Calculate frequency (how many times each symptom logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const frequency = {};
    allLogs.forEach(log => {
      if (new Date(log.timestamp) >= thirtyDaysAgo) {
        frequency[log.symptomId] = (frequency[log.symptomId] || 0) + 1;
      }
    });
    setSymptomFrequency(frequency);
  };

  // Determine symptom type - EXPANDED DETECTION
  const isMigraine = selectedChronic?.symptomId === 'migraine';

  // Sleep: match sleep-related symptoms only
  const isSleepRelated = selectedChronic?.symptomId?.includes('sleep') ||
      selectedChronic?.symptomId?.includes('insomnia') ||
      ['sleep-issues', 'nightmares'].includes(selectedChronic?.symptomId);

  // PTSD/Mental Health: broader matching (symptom only)
  const isPTSDRelated = selectedChronic?.symptomId?.includes('anxiety') ||
      selectedChronic?.symptomId?.includes('ptsd') ||
      selectedChronic?.symptomId?.includes('panic') ||
      selectedChronic?.symptomId?.includes('depression') ||
      selectedChronic?.symptomId?.includes('mood') ||
      ['hypervigilance', 'nightmares', 'irritability', 'flashbacks', 'intrusive-thoughts',
        'avoidance', 'emotional-numbness', 'startle-response', 'concentration-problems',
        'social-withdrawal', 'hopelessness', 'guilt', 'anger-outbursts'].includes(selectedChronic?.symptomId);

  // Pain: match ANY pain-related symptom only
  const isPainRelated = selectedChronic?.symptomId?.includes('pain') ||
      selectedChronic?.symptomId?.includes('-ache') ||
      selectedChronic?.symptomId?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedChronic?.symptomId?.includes(term));

  // GI: match GI-related symptoms
  const isGIRelated = selectedChronic?.symptomId?.startsWith('ibs') ||
      selectedChronic?.symptomId?.startsWith('gerd') ||
      selectedChronic?.symptomId?.startsWith('uc-') ||
      selectedChronic?.symptomId?.startsWith('ulcer-') ||
      selectedChronic?.symptomId?.startsWith('hemorrhoid') ||
      selectedChronic?.symptomId?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedChronic?.symptomId);

  // Respiratory: match respiratory symptoms
  const isRespiratoryRelated = selectedChronic?.symptomId?.startsWith('asthma-') ||
      selectedChronic?.symptomId?.startsWith('copd-') ||
      selectedChronic?.symptomId?.startsWith('apnea-') ||
      selectedChronic?.symptomId?.startsWith('emphysema-') ||
      selectedChronic?.symptomId?.startsWith('bronchitis-') ||
      selectedChronic?.symptomId?.includes('breathing') ||
      selectedChronic?.symptomId?.includes('wheez') ||
      selectedChronic?.symptomId?.includes('cough') ||
      ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(selectedChronic?.symptomId);

  // Joint: match joint-related symptoms
  const isJointRelated = selectedChronic?.symptomId?.startsWith('shoulder-') ||
      selectedChronic?.symptomId?.startsWith('knee-') ||
      selectedChronic?.symptomId?.startsWith('hip-') ||
      selectedChronic?.symptomId?.startsWith('ankle-') ||
      selectedChronic?.symptomId?.startsWith('elbow-') ||
      selectedChronic?.symptomId?.startsWith('wrist-') ||
      selectedChronic?.symptomId?.startsWith('hand-') ||
      selectedChronic?.symptomId?.startsWith('finger-') ||
      selectedChronic?.symptomId?.startsWith('foot-') ||
      selectedChronic?.symptomId?.startsWith('toe-') ||
      selectedChronic?.symptomId?.includes('joint') ||
      selectedChronic?.symptomId?.includes('arthritis') ||
      selectedChronic?.symptomId?.includes('bursitis') ||
      selectedChronic?.symptomId?.includes('tendinitis') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(selectedChronic?.symptomId);

  // Seizure: match seizure-related symptoms
  const isSeizureRelated = selectedChronic?.symptomId?.includes('seizure') ||
      selectedChronic?.symptomId?.includes('epilep') ||
      selectedChronic?.symptomId?.includes('convuls') ||
      selectedChronic?.symptomId?.startsWith('seizure-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(selectedChronic?.symptomId);

  // PHASE 2: Eye/Vision detection
  const isEyeRelated = selectedChronic?.symptomId?.includes('vision') ||
      selectedChronic?.symptomId?.includes('eye') ||
      selectedChronic?.symptomId?.includes('glaucoma') ||
      selectedChronic?.symptomId?.includes('retinopathy') ||
      selectedChronic?.symptomId?.includes('macular') ||
      ['floaters', 'diplopia', 'photophobia', 'night-blindness', 'light-sensitivity',
        'double-vision', 'color-vision-changes', 'dry-eyes', 'eye-strain', 'eye-pain',
        'peripheral-vision-loss', 'diabetic-retinopathy', 'glaucoma-symptoms'].includes(selectedChronic);

  // Phase 3: Genitourinary detection
  const isGenitourinaryRelated = selectedChronic?.symptomId?.includes('kidney') ||
      selectedChronic?.symptomId?.includes('urinary') ||
      selectedChronic?.symptomId?.includes('prostate') ||
      selectedChronic?.symptomId?.includes('bladder') ||
      selectedChronic?.symptomId?.includes('urine') ||
      selectedChronic?.symptomId?.includes('renal') ||
      selectedChronic?.symptomId?.includes('fecal-incontinence') ||
      selectedChronic?.symptomId?.includes('erectile') ||
      selectedChronic?.symptomId?.includes('testicular') ||
      selectedChronic?.symptomId?.includes('genital') ||
      ['kidney-stones', 'kidney-pain', 'blood-in-urine', 'kidney-infection',
       'renal-swelling', 'renal-fatigue', 'renal-nausea', 'decreased-urination',
       'foamy-urine', 'high-blood-pressure', 'urinary-frequency', 'urinary-urgency',
       'painful-urination', 'urinary-incontinence', 'urine-retention', 'weak-stream',
       'hesitancy', 'nocturia', 'bladder-pain', 'recurrent-uti', 'incomplete-emptying',
       'prostate-symptoms', 'prostate-pain', 'erectile-dysfunction', 'testicular-pain',
       'genital-pain', 'bowel-urgency', 'bowel-frequency'].includes(selectedChronic);

  // Phase 4: Gynecological detection
  const isGynecologicalRelated = selectedChronic?.symptomId?.includes('menstrual') ||
      selectedChronic?.symptomId?.includes('pelvic') ||
      selectedChronic?.symptomId?.includes('endometriosis') ||
      selectedChronic?.symptomId?.includes('ovarian') ||
      selectedChronic?.symptomId?.includes('uterine') ||
      selectedChronic?.symptomId?.includes('vaginal') ||
      selectedChronic?.symptomId?.includes('cervix') ||
      selectedChronic?.symptomId?.includes('dyspareunia') ||
      selectedChronic?.symptomId?.includes('dysmenorrhea') ||
      selectedChronic?.symptomId?.includes('prolapse') ||
      selectedChronic?.symptomId?.includes('vulvo') ||
      ['heavy-menstrual-bleeding', 'irregular-periods', 'painful-periods', 'absent-periods',
        'prolonged-bleeding', 'intermenstrual-bleeding', 'premenstrual-syndrome',
        'chronic-pelvic-pain', 'dyspareunia', 'lower-abdominal-pain', 'pain-bowel-movement',
        'pain-urination-gyn', 'endometriosis-pain', 'endometriosis-bowel', 'endometriosis-bladder',
        'ovarian-cysts', 'polycystic-ovaries', 'ovulation-pain', 'anovulation',
        'pid-symptoms', 'abnormal-discharge', 'cervicitis', 'vulvovaginitis', 'vaginal-irritation',
        'pelvic-pressure', 'vaginal-bulge', 'incomplete-bladder-emptying', 'bowel-dysfunction-prolapse',
        'sexual-dysfunction', 'decreased-libido', 'arousal-difficulty', 'infertility',
        'hirsutism', 'hormonal-acne', 'pcos-weight-changes', 'breast-pain', 'nipple-discharge',
        'uterine-cramping'].includes(selectedChronic);

  // Phase 5: Hemic/Lymphatic condition detection
  const isAnemiaRelated = [
    'fatigue-blood', 'weakness-blood', 'dizziness-anemia', 'shortness-breath-anemia',
    'pale-skin', 'cold-hands-feet', 'chest-pain-anemia', 'rapid-heartbeat', 'headache-anemia'
  ].includes(selectedChronic);

  const isSickleCellRelated = [
    'sickle-cell-crisis', 'bone-pain-sickle', 'joint-pain-sickle', 'chest-pain-sickle',
    'priapism', 'vision-changes-sickle', 'leg-ulcers'
  ].includes(selectedChronic);

  const isBleedingDisorderRelated = [
    'easy-bruising', 'prolonged-bleeding', 'nosebleeds-frequent', 'bleeding-gums',
    'petechiae', 'heavy-menstrual-bleeding-blood', 'blood-in-urine', 'blood-in-stool'
  ].includes(selectedChronic);

  const isInfectionRelated = [
    'frequent-infections', 'recurring-infections', 'slow-healing-wounds',
    'fever-unexplained', 'night-sweats-blood', 'chills-blood'
  ].includes(selectedChronic);

  const isLymphomaLeukemiaRelated = [
    'swollen-lymph-nodes', 'unexplained-weight-loss', 'loss-appetite',
    'bone-pain-leukemia', 'night-sweats-blood'
  ].includes(selectedChronic);

  const isPolycythemiaRelated = [
    'itching-after-bathing', 'burning-hands-feet', 'redness-skin',
    'blurred-vision-blood', 'headache-polycythemia', 'tinnitus-blood', 'blood-clots'
  ].includes(selectedChronic);

  const isTreatmentRelated = [
    'nausea-chemo', 'vomiting-chemo', 'mouth-sores', 'hair-loss',
    'neuropathy-chemo', 'fatigue-chemo'
  ].includes(selectedChronic);

  const isB12DeficiencyRelated = [
    'numbness-tingling-b12', 'difficulty-walking', 'memory-problems-b12',
    'confusion-b12', 'tongue-problems'
  ].includes(selectedChronic);

  // Phase 6: Dental/Oral detection
  const isDentalOralRelated = selectedChronic?.symptomId?.includes('jaw') ||
      selectedChronic?.symptomId?.includes('tooth') ||
      selectedChronic?.symptomId?.includes('teeth') ||
      selectedChronic?.symptomId?.includes('dental') ||
      selectedChronic?.symptomId?.includes('oral') ||
      selectedChronic?.symptomId?.includes('palate') ||
      selectedChronic?.symptomId?.includes('gum') ||
      selectedChronic?.symptomId?.includes('mouth') ||
      selectedChronic?.symptomId?.includes('chewing') ||
      selectedChronic?.symptomId?.includes('swallowing') ||
      ['jaw-pain', 'jaw-swelling', 'jaw-stiffness', 'limited-mouth-opening',
        'tooth-loss-pain', 'missing-teeth', 'chewing-difficulty', 'swallowing-difficulty',
        'prosthesis-pain', 'prosthesis-fit'].includes(selectedChronic);

  const handleOpenLogModal = (chronic) => {
    if (editMode) return;
    setSelectedChronic(chronic);
    setLogSeverity(chronic.defaultSeverity || 5);
    setLogNotes('');
    setOccurredAt(new Date().toISOString());
    setSelectedMedications([]);

    // Reset condition-specific data
    setMigraineData({
      duration: '', prostrating: null, aura: false, nausea: false,
      lightSensitivity: false, soundSensitivity: false, triggers: '',
    });
    setSleepData({
      hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
      troubleStayingAsleep: false, nightmares: false, feelRested: null,
    });
    setPtsdData({
      flashbacks: false, avoidance: false, emotionalNumbering: false,
      hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
      triggerDescription: '',
    });
    setPainData({
      radiating: false, radiatingTo: '', limitedRangeOfMotion: false,
      affectedActivities: [], painType: '', flareUp: false,
    });
    setGIData({
      bristolScale: null, frequencyPerDay: '', urgencyLevel: '', bloodPresent: null,
      bloatingSeverity: '', abdominalPainLocation: '', mealRelated: null, nighttimeSymptoms: false,
    });
    setRespiratoryData({
      rescueInhalerUsed: null, inhalerPuffs: '', peakFlow: '', spo2: '',
      activityTrigger: '', wheezing: false, chestTightness: false, coughing: false,
    });
    setJointData({
      joint: '', side: '', romEstimate: '', morningStiffness: '',
      swelling: false, instability: false, locking: false, grinding: false,
    });
    setSeizureData({
      episodeType: '', duration: '', lossOfConsciousness: null,
      auraPresent: null, recoveryTime: '', witnessPresent: null,
    });
    setEyeData({
      affectedEye: '', leftEyeAcuity: '', rightEyeAcuity: '',
      symptoms: [], fieldOfVision: [], affectedActivities: [],
      triggeringFactors: '', associatedConditions: [],
    });
    setGenitourinaryData({
      affectedSystem: '', kidneySymptoms: [], kidneyPainLocation: '', kidneyPainSeverity: 5,
      stoneEpisode: false, stonePassedToday: false, stoneSize: '', procedureRecent: '', procedureDate: '',
      dialysis: false, dialysisType: '', dialysisFrequency: '', voidingSymptoms: [],
      urinaryFrequency24h: '', nocturiaCount: '', incontinenceEpisode: false, incontinenceType: '',
      incontinenceLeakageAmount: '', padChangesRequired: '', catheterUse: false, catheterType: '',
      catheterizationsPerDay: '', uti: false, utiSymptoms: [], prostateSymptoms: [],
      prostateScore: '', prostateMedications: [], fecalIncontinenceEpisode: false,
      fecalIncontinenceFrequency: '', fecalIncontinenceType: '', fecalUrgency: false,
      bowelControlMethods: [], erectileDysfunction: false, edSeverity: '', testicular: false,
      testicularSymptoms: [], activitiesAffected: [], fluidRestriction: false, workMissed: false,
      associatedConditions: [], complications: [],
    });
    setGynecologicalData({
      affectedOrgan: '', painType: '', painSeverity: 5, painLocation: '',
      endometriosisDiagnosed: false, laparoscopyConfirmed: false, treatmentEffectiveness: '',
      cycleRegularity: '', flowHeaviness: '', dysmenorrheaSeverity: '',
      pcosDiagnosed: false, pidDiagnosed: false, prolapseDiagnosed: false,
      continuousTreatmentRequired: false,
    });
    // Phase 5: Reset hemic/lymphatic data
    setAnemiaData({
      type: '', severity: '', treatment: [], supplements: [],
      transfusion_history: '', last_transfusion: ''
    });
    setSickleCellData({
      crisis_type: '', crisis_location: [], pain_severity: '', crisis_duration: '',
      triggers: [], treatment_received: [], hospitalizations_year: ''
    });
    setBleedingDisorderData({
      disorder_type: '', bleeding_site: [], bleeding_frequency: '', severity: '',
      treatment: [], platelet_count: ''
    });
    setInfectionData({
      infection_type: [], frequency: '', severity: '', requires_hospitalization: '',
      treatment: [], immune_status: ''
    });
    setLymphomaLeukemiaData({
      diagnosis: '', stage: '', treatment_status: '', treatment_type: [],
      cycles_completed: '', side_effects: [], last_treatment_date: ''
    });
    setPolycythemiaData({
      diagnosis: '', treatment: [], phlebotomy_frequency: '', last_phlebotomy: '',
      medications: [], complications: []
    });
    setTreatmentData({
      treatment_type: '', regimen: '', cycle_number: '', side_effects: [],
      severity: '', management: []
    });
    setB12DeficiencyData({
      deficiency_cause: '', neurological_symptoms: [], treatment: [],
      injection_frequency: '', last_injection: '', improvement_noted: ''
    });
    // Phase 6: Reset dental data
    setDentalData({
      jawPainSeverity: 5, jawOpening: '', toothCount: '',
      prosthesisType: '', dietaryRestrictions: '', chewingDifficulty: '',
    });
  };

  const handleCloseModal = () => {
    setSelectedChronic(null);
    setLogSeverity(5);
    setLogNotes('');
    setSelectedMedications([]);
  };

  const handleConfirmLog = () => {
    if (!selectedChronic) return;

    // Validate migraine prostrating field
    if (isMigraine && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating');
      return;
    }

    const entry = {
      symptomId: selectedChronic.symptomId,
      symptomName: selectedChronic.symptomName,
      category: selectedChronic.category,
      severity: logSeverity,
      notes: logNotes.trim(),
      occurredAt: occurredAt,
    };

    // Add condition-specific data
    if (isMigraine) {
      entry.migraineData = { ...migraineData };
    }
    if (isSleepRelated) {
      entry.sleepData = { ...sleepData };
    }
    if (isPTSDRelated) {
      entry.ptsdData = { ...ptsdData };
    }
    if (isPainRelated) {
      entry.painData = { ...painData };
    }
    if (isGIRelated) {
      entry.giData = { ...giData };
    }
    if (isRespiratoryRelated) {
      entry.respiratoryData = { ...respiratoryData };
    }
    if (isJointRelated) {
      entry.jointData = { ...jointData };
    }
    if (isSeizureRelated) {
      entry.seizureData = { ...seizureData };
    }
    if (isEyeRelated) {
      entry.eyeData = { ...eyeData };
    }
    if (isGenitourinaryRelated) {
      entry.genitourinaryData = { ...genitourinaryData };
    }
    if (isGynecologicalRelated) {
      entry.gynecologicalData = { ...gynecologicalData };
    }
    // Phase 6: Add Dental/Oral Data
    if (isDentalOralRelated) {
      entry.dentalData = { ...dentalData };
    }


    const savedEntry = saveSymptomLog(entry);

    // Log medications if selected
    if (selectedMedications.length > 0) {
      selectedMedications.forEach(medId => {
        const med = medications.find(m => m.id === medId);
        if (med) {
          logMedicationTaken({
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            takenFor: entry.symptomName,
            symptomLogId: savedEntry.id,
          });
        }
      });
    }

    // Show success
    setShowSuccess(selectedChronic.symptomId);
    setTimeout(() => setShowSuccess(''), 1500);

    handleCloseModal();
    if (onLogSaved) onLogSaved();
  };

  const handleRemoveChronic = (symptomId) => {
    removeChronicSymptom(symptomId);
    loadData();
  };

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 4) return 'bg-yellow-500';
    if (severity <= 6) return 'bg-orange-500';
    if (severity <= 8) return 'bg-red-500';
    return 'bg-red-700';
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600 dark:text-green-400' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500 dark:text-red-400' };
    return { label: 'Extreme', color: 'text-red-700 dark:text-red-300' };
  };

  if (chronicSymptoms.length === 0) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Log</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Add chronic symptoms for faster logging
          </p>
          <button
              onClick={onAddChronic}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            + Add Your First Chronic Symptom
          </button>
        </div>
    );
  }

  const severityInfo = getSeverityInfo(logSeverity);
  const activeMedications = medications.filter(m => m.isActive);

  // Phase 1G - Filter chronic symptoms by search term
  const filteredChronicSymptoms = chronicSymptoms.filter(symptom =>
      symptom.symptomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Quick Log</h3>
            <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          </div>

          {/* Phase 1G - Search box */}
          {chronicSymptoms.length >= 2 && (
              <div className="mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search chronic symptoms..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
          )}

          {/* Phase 1G - Recent Symptoms */}
          {!editMode && recentSymptoms.length > 0 && searchTerm === '' && (
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">📋 Recently Logged</p>
                <div className="flex flex-wrap gap-1.5">
                  {recentSymptoms.slice(0, 5).map((symptom) => {
                    const frequency = symptomFrequency[symptom.symptomId] || 0;
                    return (
                        <button
                            key={symptom.symptomId}
                            onClick={() => {
                              const chronicMatch = chronicSymptoms.find(c => c.symptomId === symptom.symptomId);
                              if (chronicMatch) {
                                handleOpenLogModal(chronicMatch);
                              }
                            }}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors flex items-center gap-1"
                        >
                          <span>{symptom.symptomName}</span>
                          {frequency > 1 && (
                              <span className="bg-blue-200 dark:bg-blue-800 px-1.5 rounded-full font-semibold">
                                {frequency}
                              </span>
                          )}
                        </button>
                    );
                  })}
                </div>
              </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {filteredChronicSymptoms.map((chronic) => (
                <div key={chronic.symptomId} className="relative">
                  {/* Success overlay */}
                  {showSuccess === chronic.symptomId && (
                      <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center z-10">
                        <span className="text-white font-medium">✓ Logged!</span>
                      </div>
                  )}

                  <div
                      className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 ${
                          editMode ? '' : 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm cursor-pointer'
                      } transition-all`}
                      onClick={() => handleOpenLogModal(chronic)}
                  >
                    {/* Remove button in edit mode */}
                    {editMode && (
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChronic(chronic.symptomId);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 z-10"
                        >
                          ✓
                        </button>
                    )}

                    {/* Phase 1G - Frequency badge */}
                    {!editMode && symptomFrequency[chronic.symptomId] > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                          {symptomFrequency[chronic.symptomId]}
                        </div>
                    )}

                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {chronic.symptomName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{chronic.category}</p>

                    <div className="flex items-center gap-2">
                      <div
                          className={`w-8 h-8 rounded-full ${getSeverityColor(
                              chronic.defaultSeverity || 5
                          )} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {chronic.defaultSeverity || 5}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Tap to log</span>
                    </div>
                  </div>
                </div>
            ))}

            {/* Add more button */}
            {chronicSymptoms.length < 8 && (
                <button
                    onClick={onAddChronic}
                    className="bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 text-gray-400 dark:text-gray-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center min-h-[88px]"
                >
                  <span className="text-2xl">+</span>
                </button>
            )}
          </div>
        </div>

        {/* Enhanced Quick Log Modal */}
        {selectedChronic && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedChronic.symptomName}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChronic.category}</p>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                    >
                      ✓
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Severity Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity Level
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <input
                          type="range"
                          min="0"
                          max="10"
                          value={logSeverity}
                          onChange={(e) => setLogSeverity(Number(e.target.value))}
                          className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                        <span className={`text-lg font-bold ${severityInfo.color}`}>
                      {logSeverity} - {severityInfo.label}
                    </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
                      </div>
                    </div>
                  </div>

                  {/* MIGRAINE-SPECIFIC FIELDS */}
                  {isMigraine && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200 text-sm">Migraine Details</h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                          <select
                              value={migraineData.duration}
                              onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="less-than-1h">Less than 1 hour</option>
                            <option value="1-4h">1-4 hours</option>
                            <option value="4-24h">4-24 hours</option>
                            <option value="1-2d">1-2 days</option>
                            <option value="more-than-2d">More than 2 days</option>
                            <option value="ongoing">Still ongoing</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Prostrating? <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    migraineData.prostrating === true
                                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    migraineData.prostrating === false
                                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'aura', label: 'Aura' },
                            { key: 'nausea', label: 'Nausea' },
                            { key: 'lightSensitivity', label: 'Light' },
                            { key: 'soundSensitivity', label: 'Sound' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      migraineData[key]
                                          ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={migraineData[key]}
                                    onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-purple-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* SLEEP-SPECIFIC FIELDS */}
                  {isSleepRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200 text-sm">Sleep Details</h3>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Slept</label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={sleepData.hoursSlept}
                                onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                                placeholder="Hrs"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Woke Up</label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={sleepData.wakeUps}
                                onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                                placeholder="Times"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
                            { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
                            { key: 'nightmares', label: 'Nightmares' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      sleepData[key]
                                          ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={sleepData[key]}
                                    onChange={(e) => setSleepData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Feel rested?</label>
                          <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setSleepData(prev => ({ ...prev, feelRested: true }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    sleepData.feelRested === true
                                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setSleepData(prev => ({ ...prev, feelRested: false }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    sleepData.feelRested === false
                                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* PTSD-SPECIFIC FIELDS */}
                  {isPTSDRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200 text-sm">Mental Health Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'flashbacks', label: 'Flashbacks' },
                            { key: 'intrusiveThoughts', label: 'Intrusive thoughts' },
                            { key: 'avoidance', label: 'Avoidance' },
                            { key: 'hypervigilance', label: 'Hypervigilance' },
                            { key: 'emotionalNumbering', label: 'Numbness' },
                            { key: 'exaggeratedStartle', label: 'Startle' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      ptsdData[key]
                                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={ptsdData[key]}
                                    onChange={(e) => setPtsdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-amber-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger</label>
                          <input
                              type="text"
                              value={ptsdData.triggerDescription}
                              onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                              placeholder="What triggered this?"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                  )}

                  {/* GI-SPECIFIC FIELDS */}
                  {isGIRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-3">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200 text-sm">GI Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Episodes Today
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={giData.frequencyPerDay}
                                onChange={(e) => setGIData(prev => ({ ...prev, frequencyPerDay: e.target.value }))}
                                placeholder="#"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Urgency
                            </label>
                            <select
                                value={giData.urgencyLevel}
                                onChange={(e) => setGIData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="none">None</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                              <option value="incontinence">Incontinence</option>
                            </select>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* RESPIRATORY-SPECIFIC FIELDS */}
                  {isRespiratoryRelated && (
                      <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800 space-y-3">
                        <h3 className="font-medium text-sky-900 dark:text-sky-200 text-sm">Respiratory Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rescue Inhaler?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: true }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    respiratoryData.rescueInhalerUsed === true
                                        ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 text-sky-900 dark:text-sky-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: false, inhalerPuffs: '' }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    respiratoryData.rescueInhalerUsed === false
                                        ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 text-sky-900 dark:text-sky-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        {respiratoryData.rescueInhalerUsed === true && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                # Puffs
                              </label>
                              <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={respiratoryData.inhalerPuffs}
                                  onChange={(e) => setRespiratoryData(prev => ({ ...prev, inhalerPuffs: e.target.value }))}
                                  placeholder="2"
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                              />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Peak Flow
                            </label>
                            <input
                                type="number"
                                value={respiratoryData.peakFlow}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, peakFlow: e.target.value }))}
                                placeholder="L/min"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              SpO2
                            </label>
                            <input
                                type="number"
                                value={respiratoryData.spo2}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, spo2: e.target.value }))}
                                placeholder="%"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.wheezing
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.wheezing}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, wheezing: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Wheeze</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.chestTightness
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.chestTightness}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, chestTightness: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Tight</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.coughing
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.coughing}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, coughing: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Cough</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* JOINT-SPECIFIC FIELDS */}
                  {isJointRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-3">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200 text-sm">Joint Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Joint
                            </label>
                            <select
                                value={jointData.joint}
                                onChange={(e) => setJointData(prev => ({ ...prev, joint: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="shoulder">Shoulder</option>
                              <option value="elbow">Elbow</option>
                              <option value="wrist">Wrist</option>
                              <option value="hip">Hip</option>
                              <option value="knee">Knee</option>
                              <option value="ankle">Ankle</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Side
                            </label>
                            <select
                                value={jointData.side}
                                onChange={(e) => setJointData(prev => ({ ...prev, side: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="bilateral">Both</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ROM
                          </label>
                          <select
                              value={jointData.romEstimate}
                              onChange={(e) => setJointData(prev => ({ ...prev, romEstimate: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">...</option>
                            <option value="full">Full</option>
                            <option value="slightly">Slightly limited</option>
                            <option value="moderately">Moderate</option>
                            <option value="severely">Severe</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              jointData.swelling
                                  ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={jointData.swelling}
                                onChange={(e) => setJointData(prev => ({ ...prev, swelling: e.target.checked }))}
                                className="w-3 h-3 text-indigo-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Swelling</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              jointData.instability
                                  ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={jointData.instability}
                                onChange={(e) => setJointData(prev => ({ ...prev, instability: e.target.checked }))}
                                className="w-3 h-3 text-indigo-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Unstable</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* SEIZURE-SPECIFIC FIELDS */}
                  {isSeizureRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200 text-sm">Episode Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                              value={seizureData.episodeType}
                              onChange={(e) => setSeizureData(prev => ({ ...prev, episodeType: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">...</option>
                            <option value="generalized">Generalized</option>
                            <option value="partial">Partial</option>
                            <option value="absence">Absence</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (sec)
                          </label>
                          <input
                              type="number"
                              min="0"
                              value={seizureData.duration}
                              onChange={(e) => setSeizureData(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="seconds"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Loss of Consciousness?
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'yes' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'yes'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes</button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'partial' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'partial'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Partial</button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'no' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'no'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >No</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              seizureData.auraPresent === true
                                  ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={seizureData.auraPresent === true}
                                onChange={(e) => setSeizureData(prev => ({ ...prev, auraPresent: e.target.checked }))}
                                className="w-3 h-3 text-purple-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Aura</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              seizureData.witnessPresent === true
                                  ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={seizureData.witnessPresent === true}
                                onChange={(e) => setSeizureData(prev => ({ ...prev, witnessPresent: e.target.checked }))}
                                className="w-3 h-3 text-purple-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Witness</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* PAIN-SPECIFIC FIELDS */}
                  {isPainRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                        <h3 className="font-medium text-rose-900 dark:text-rose-200 text-sm">Pain Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Pain Type</label>
                          <select
                              value={painData.painType}
                              onChange={(e) => setPainData(prev => ({ ...prev, painType: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="sharp">Sharp/Stabbing</option>
                            <option value="dull">Dull/Aching</option>
                            <option value="burning">Burning</option>
                            <option value="throbbing">Throbbing</option>
                            <option value="shooting">Shooting</option>
                            <option value="stiff">Stiffness</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                  painData.radiating
                                      ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={painData.radiating}
                                onChange={(e) => setPainData(prev => ({ ...prev, radiating: e.target.checked }))}
                                className="w-4 h-4 text-rose-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Radiating</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                  painData.flareUp
                                      ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={painData.flareUp}
                                onChange={(e) => setPainData(prev => ({ ...prev, flareUp: e.target.checked }))}
                                className="w-4 h-4 text-rose-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Flare-up</span>
                          </label>
                        </div>

                        {painData.radiating && (
                            <input
                                type="text"
                                value={painData.radiatingTo}
                                onChange={(e) => setPainData(prev => ({ ...prev, radiatingTo: e.target.value }))}
                                placeholder="Radiates to..."
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                        )}

                        <label
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                painData.limitedRangeOfMotion
                                    ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                        >
                          <input
                              type="checkbox"
                              checked={painData.limitedRangeOfMotion}
                              onChange={(e) => setPainData(prev => ({ ...prev, limitedRangeOfMotion: e.target.checked }))}
                              className="w-4 h-4 text-rose-600 rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Limited range of motion</span>
                        </label>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Activities Affected</label>
                          <div className="grid grid-cols-4 gap-1">
                            {['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'].map(activity => (
                                <label
                                    key={activity}
                                    className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer text-xs ${
                                        painData.affectedActivities.includes(activity)
                                            ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={painData.affectedActivities.includes(activity)}
                                      onChange={() => toggleActivity(activity)}
                                      className="sr-only"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Medications */}
                  {activeMedications.length > 0 && (
                      <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                        <h3 className="font-medium text-teal-900 dark:text-teal-200 text-sm mb-3">Medications Taken</h3>
                        <div className="space-y-2">
                          {activeMedications.map(med => (
                              <label
                                  key={med.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      selectedMedications.includes(med.id)
                                          ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={selectedMedications.includes(med.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedMedications(prev => [...prev, med.id]);
                                      } else {
                                        setSelectedMedications(prev => prev.filter(id => id !== med.id));
                                      }
                                    }}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                          {med.name} ({med.dosage})
                        </span>
                              </label>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* Phase 2: Eye & Vision Form */}
                  {isEyeRelated && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800 space-y-4">
                        <h3 className="font-medium text-cyan-900 dark:text-cyan-200">Eye & Vision Details</h3>

                        {/* Affected Eye */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Affected Eye(s)
                          </label>
                          <select
                              value={eyeData.affectedEye}
                              onChange={(e) => setEyeData(prev => ({ ...prev, affectedEye: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">Select eye...</option>
                            <option value="left">Left eye only</option>
                            <option value="right">Right eye only</option>
                            <option value="both">Both eyes</option>
                          </select>
                        </div>

                        {/* Visual Acuity */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Left Eye
                            </label>
                            <select
                                value={eyeData.leftEyeAcuity}
                                onChange={(e) => setEyeData(prev => ({ ...prev, leftEyeAcuity: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                            >
                              <option value="">Not tested</option>
                              <option value="20/20">20/20</option>
                              <option value="20/40">20/40</option>
                              <option value="20/70">20/70</option>
                              <option value="20/100">20/100</option>
                              <option value="20/200">20/200</option>
                              <option value="CF">CF</option>
                              <option value="HM">HM</option>
                              <option value="LP">LP</option>
                              <option value="NLP">NLP</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Right Eye
                            </label>
                            <select
                                value={eyeData.rightEyeAcuity}
                                onChange={(e) => setEyeData(prev => ({ ...prev, rightEyeAcuity: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                            >
                              <option value="">Not tested</option>
                              <option value="20/20">20/20</option>
                              <option value="20/40">20/40</option>
                              <option value="20/70">20/70</option>
                              <option value="20/100">20/100</option>
                              <option value="20/200">20/200</option>
                              <option value="CF">CF</option>
                              <option value="HM">HM</option>
                              <option value="LP">LP</option>
                              <option value="NLP">NLP</option>
                            </select>
                          </div>
                        </div>

                        {/* Symptoms (compact) */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Symptoms
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {['blurriness', 'halos', 'pain', 'floaters'].map((symptom) => (
                                <label
                                    key={symptom}
                                    className={`flex items-center gap-1 p-1.5 rounded border cursor-pointer text-xs ${
                                        eyeData.symptoms.includes(symptom)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400'
                                            : 'bg-white dark:bg-gray-800 border-gray-300'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={eyeData.symptoms.includes(symptom)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEyeData(prev => ({ ...prev, symptoms: [...prev.symptoms, symptom] }));
                                        } else {
                                          setEyeData(prev => ({ ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) }));
                                        }
                                      }}
                                      className="w-3 h-3 text-cyan-600 rounded"
                                  />
                                  <span className="capitalize">{symptom}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {/* Impact (compact) */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Impact on Activities
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {[
                              { id: 'reading', label: 'Reading' },
                              { id: 'driving-day', label: 'Driving' },
                              { id: 'computer', label: 'Computer' },
                              { id: 'work', label: 'Work' }
                            ].map((activity) => (
                                <label
                                    key={activity.id}
                                    className={`flex items-center gap-1 p-1.5 rounded border cursor-pointer text-xs ${
                                        eyeData.affectedActivities.includes(activity.id)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400'
                                            : 'bg-white dark:bg-gray-800 border-gray-300'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={eyeData.affectedActivities.includes(activity.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEyeData(prev => ({ ...prev, affectedActivities: [...prev.affectedActivities, activity.id] }));
                                        } else {
                                          setEyeData(prev => ({ ...prev, affectedActivities: prev.affectedActivities.filter(a => a !== activity.id) }));
                                        }
                                      }}
                                      className="w-3 h-3 text-cyan-600 rounded"
                                  />
                                  <span>{activity.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                    {/* Phase 3: Genitourinary Quick Log */}
                    {isGenitourinaryRelated && (
                        <div className="space-y-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                          <h4 className="font-medium text-teal-900 dark:text-teal-200">Genitourinary Details</h4>

                          {/* Kidney Symptoms */}
                          {(selectedChronic?.symptomId?.includes('kidney') || selectedChronic?.symptomId?.includes('renal')) && (
                              <>
                                <div className="grid grid-cols-2 gap-2">
                                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                      genitourinaryData.stoneEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.stoneEpisode}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, stoneEpisode: e.target.checked }))}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm">Stone Episode</span>
                                  </label>

                                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                      genitourinaryData.dialysis ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.dialysis}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, dialysis: e.target.checked }))}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm">Dialysis Today</span>
                                  </label>
                                </div>
                              </>
                          )}

                          {/* Bladder/Voiding Symptoms */}
                          {(selectedChronic?.symptomId?.includes('bladder') || selectedChronic?.symptomId?.includes('urinary')) && (
                              <>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Frequency (24h)</label>
                                    <input type="number" value={genitourinaryData.urinaryFrequency24h}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, urinaryFrequency24h: e.target.value }))}
                                           placeholder="# times"
                                           className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800" />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">Nocturia</label>
                                    <input type="number" value={genitourinaryData.nocturiaCount}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, nocturiaCount: e.target.value }))}
                                           placeholder="# times"
                                           className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                      genitourinaryData.incontinenceEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.incontinenceEpisode}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, incontinenceEpisode: e.target.checked }))}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm">Incontinence</span>
                                  </label>

                                  <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                      genitourinaryData.catheterUse ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.catheterUse}
                                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, catheterUse: e.target.checked }))}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm">Catheter Use</span>
                                  </label>
                                </div>
                              </>
                          )}

                          {/* Prostate Symptoms */}
                          {selectedChronic?.symptomId?.includes('prostate') && (
                              <div>
                                <label className="block text-sm font-medium mb-1">Nocturia (times waking to void)</label>
                                <input type="number" value={genitourinaryData.nocturiaCount}
                                       onChange={(e) => setGenitourinaryData(prev => ({ ...prev, nocturiaCount: e.target.value }))}
                                       placeholder="# times"
                                       className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800" />
                              </div>
                          )}

                          {/* Sphincter/Bowel */}
                          {selectedChronic?.symptomId?.includes('fecal-incontinence') && (
                              <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                  genitourinaryData.fecalIncontinenceEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.fecalIncontinenceEpisode}
                                       onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fecalIncontinenceEpisode: e.target.checked }))}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm font-medium">Incontinence Episode Today</span>
                              </label>
                          )}

                          {/* Reproductive */}
                          {selectedChronic?.symptomId?.includes('erectile') && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Severity</label>
                                <select value={genitourinaryData.edSeverity}
                                        onChange={(e) => setGenitourinaryData(prev => ({ ...prev, edSeverity: e.target.value }))}
                                        className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                                  <option value="">Select severity</option>
                                  <option value="mild">Mild</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="severe">Severe</option>
                                  <option value="complete">Complete</option>
                                </select>
                              </div>
                          )}
                        </div>
                    )}

                  {/* Phase 4: Gynecological Quick Forms */}
                  {isGynecologicalRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🌸</span>
                          <h4 className="font-semibold text-rose-900 dark:text-rose-200">Gynecological Details</h4>
                        </div>

                        {/* Pain Type */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Pain Type</label>
                          <select value={gynecologicalData.painType}
                                  onChange={(e) => setGynecologicalData(prev => ({ ...prev, painType: e.target.value }))}
                                  className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                            <option value="">Select pain type</option>
                            <option value="chronic-pelvic">Chronic Pelvic Pain</option>
                            <option value="dysmenorrhea">Menstrual Pain</option>
                            <option value="dyspareunia">Pain with Intercourse</option>
                            <option value="ovulation">Ovulation Pain</option>
                          </select>
                        </div>

                        {/* Endometriosis */}
                        {selectedChronic?.symptomId?.includes('endometriosis') && (
                            <>
                              <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                  gynecologicalData.endometriosisDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={gynecologicalData.endometriosisDiagnosed}
                                       onChange={(e) => setGynecologicalData(prev => ({ ...prev, endometriosisDiagnosed: e.target.checked }))}
                                       className="w-4 h-4 text-rose-600 rounded" />
                                <span className="text-sm font-medium">Diagnosed Endometriosis</span>
                              </label>

                              {gynecologicalData.endometriosisDiagnosed && (
                                  <>
                                    <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                        gynecologicalData.laparoscopyConfirmed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                    }`}>
                                      <input type="checkbox" checked={gynecologicalData.laparoscopyConfirmed}
                                             onChange={(e) => setGynecologicalData(prev => ({ ...prev, laparoscopyConfirmed: e.target.checked }))}
                                             className="w-4 h-4 text-rose-600 rounded" />
                                      <span className="text-sm font-medium">Confirmed by Laparoscopy</span>
                                    </label>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Treatment Effectiveness</label>
                                      <select value={gynecologicalData.treatmentEffectiveness}
                                              onChange={(e) => setGynecologicalData(prev => ({ ...prev, treatmentEffectiveness: e.target.value }))}
                                              className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                                        <option value="">Select effectiveness</option>
                                        <option value="controlled">Controlled</option>
                                        <option value="partially-controlled">Partially Controlled</option>
                                        <option value="not-controlled">Not Controlled</option>
                                      </select>
                                    </div>
                                  </>
                              )}
                            </>
                        )}

                        {/* Menstrual Symptoms */}
                        {(selectedChronic?.symptomId?.includes('menstrual') || selectedChronic?.symptomId?.includes('period')) && (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Cycle Regularity</label>
                                  <select value={gynecologicalData.cycleRegularity}
                                          onChange={(e) => setGynecologicalData(prev => ({ ...prev, cycleRegularity: e.target.value }))}
                                          className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                                    <option value="">Select</option>
                                    <option value="regular">Regular</option>
                                    <option value="irregular">Irregular</option>
                                    <option value="absent">Absent</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">Flow Heaviness</label>
                                  <select value={gynecologicalData.flowHeaviness}
                                          onChange={(e) => setGynecologicalData(prev => ({ ...prev, flowHeaviness: e.target.value }))}
                                          className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                                    <option value="">Select</option>
                                    <option value="light">Light</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="heavy">Heavy</option>
                                    <option value="very-heavy">Very Heavy</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Pain Severity</label>
                                <select value={gynecologicalData.dysmenorrheaSeverity}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, dysmenorrheaSeverity: e.target.value }))}
                                        className="w-full p-2 text-sm border rounded bg-white dark:bg-gray-800">
                                  <option value="">Select</option>
                                  <option value="none">None</option>
                                  <option value="mild">Mild</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="severe">Severe</option>
                                </select>
                              </div>
                            </>
                        )}

                        {/* PCOS/Ovarian */}
                        {(selectedChronic?.symptomId?.includes('pcos') || selectedChronic?.symptomId?.includes('ovarian')) && (
                            <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                gynecologicalData.pcosDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                            }`}>
                              <input type="checkbox" checked={gynecologicalData.pcosDiagnosed}
                                     onChange={(e) => setGynecologicalData(prev => ({ ...prev, pcosDiagnosed: e.target.checked }))}
                                     className="w-4 h-4 text-rose-600 rounded" />
                              <span className="text-sm font-medium">PCOS Diagnosed</span>
                            </label>
                        )}

                        {/* PID */}
                        {selectedChronic?.symptomId?.includes('pid') && (
                            <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                gynecologicalData.pidDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                            }`}>
                              <input type="checkbox" checked={gynecologicalData.pidDiagnosed}
                                     onChange={(e) => setGynecologicalData(prev => ({ ...prev, pidDiagnosed: e.target.checked }))}
                                     className="w-4 h-4 text-rose-600 rounded" />
                              <span className="text-sm font-medium">PID Diagnosed</span>
                            </label>
                        )}

                        {/* Prolapse */}
                        {selectedChronic?.symptomId?.includes('prolapse') && (
                            <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                                gynecologicalData.prolapseDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                            }`}>
                              <input type="checkbox" checked={gynecologicalData.prolapseDiagnosed}
                                     onChange={(e) => setGynecologicalData(prev => ({ ...prev, prolapseDiagnosed: e.target.checked }))}
                                     className="w-4 h-4 text-rose-600 rounded" />
                              <span className="text-sm font-medium">Prolapse Diagnosed</span>
                            </label>
                        )}

                        {/* Continuous Treatment */}
                        <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                            gynecologicalData.continuousTreatmentRequired ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={gynecologicalData.continuousTreatmentRequired}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, continuousTreatmentRequired: e.target.checked }))}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm font-medium">Continuous Treatment Required</span>
                        </label>
                      </div>
                  )}

                  {/* Phase 5: Anemia Form */}
                  {isAnemiaRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                          🩸 Anemia Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type of Anemia
                          </label>
                          <select
                              value={anemiaData.type}
                              onChange={(e) => setAnemiaData({...anemiaData, type: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select type...</option>
                            <option value="iron-deficiency">Iron Deficiency Anemia</option>
                            <option value="b12-deficiency">Pernicious Anemia/B12 Deficiency</option>
                            <option value="folate-deficiency">Folate Deficiency</option>
                            <option value="hemolytic">Acquired Hemolytic Anemia</option>
                            <option value="aplastic">Aplastic Anemia</option>
                            <option value="sickle-cell">Sickle Cell Anemia</option>
                            <option value="other">Other/Unknown</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symptom Severity
                          </label>
                          <select
                              value={anemiaData.severity}
                              onChange={(e) => setAnemiaData({...anemiaData, severity: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select severity...</option>
                            <option value="mild">Mild - Minimal functional impact</option>
                            <option value="moderate">Moderate - Limits some activities</option>
                            <option value="severe">Severe - Significantly limits daily activities</option>
                            <option value="incapacitating">Incapacitating - Unable to work/function</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Treatment (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'oral-iron', label: 'Oral Iron Supplements' },
                              { value: 'iv-iron', label: 'IV Iron Infusions' },
                              { value: 'b12-injections', label: 'B12 Injections' },
                              { value: 'b12-oral', label: 'Oral/Sublingual B12' },
                              { value: 'folate-supplements', label: 'Folate Supplements' },
                              { value: 'immunosuppressants', label: 'Immunosuppressive Therapy' },
                              { value: 'growth-factors', label: 'Myeloid Growth Factors (G-CSF/GM-CSF)' },
                              { value: 'dietary-only', label: 'Dietary Modification Only' },
                              { value: 'transfusions', label: 'Blood Transfusions' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={anemiaData.treatment.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...anemiaData.treatment, option.value]
                                            : anemiaData.treatment.filter(t => t !== option.value);
                                        setAnemiaData({...anemiaData, treatment: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {anemiaData.treatment.includes('transfusions') && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Transfusion Frequency
                                </label>
                                <select
                                    value={anemiaData.transfusion_history}
                                    onChange={(e) => setAnemiaData({...anemiaData, transfusion_history: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                  <option value="">Select frequency...</option>
                                  <option value="weekly">Weekly or more</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">Every 3 months</option>
                                  <option value="biannually">Every 6 months</option>
                                  <option value="annually">Once per year</option>
                                  <option value="one-time">One-time transfusion</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Date of Last Transfusion
                                </label>
                                <input
                                    type="date"
                                    value={anemiaData.last_transfusion}
                                    onChange={(e) => setAnemiaData({...anemiaData, last_transfusion: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                            </>
                        )}
                      </div>
                  )}

                  {/* Sickle Cell Crisis Form */}
                  {isSickleCellRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                          🩸 Sickle Cell Crisis Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type of Crisis
                          </label>
                          <select
                              value={sickleCellData.crisis_type}
                              onChange={(e) => setSickleCellData({...sickleCellData, crisis_type: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select crisis type...</option>
                            <option value="vaso-occlusive">Vaso-occlusive (Pain Crisis)</option>
                            <option value="acute-chest">Acute Chest Syndrome</option>
                            <option value="splenic-sequestration">Splenic Sequestration</option>
                            <option value="aplastic">Aplastic Crisis</option>
                            <option value="hemolytic">Hemolytic Crisis</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pain Location (select all that apply)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'bones', label: 'Bones' },
                              { value: 'joints', label: 'Joints' },
                              { value: 'chest', label: 'Chest' },
                              { value: 'abdomen', label: 'Abdomen' },
                              { value: 'back', label: 'Back' },
                              { value: 'extremities', label: 'Arms/Legs' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={sickleCellData.crisis_location.includes(option.value)}
                                      onChange={(e) => {
                                        const newLocation = e.target.checked
                                            ? [...sickleCellData.crisis_location, option.value]
                                            : sickleCellData.crisis_location.filter(l => l !== option.value);
                                        setSickleCellData({...sickleCellData, crisis_location: newLocation});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pain Severity (0-10)
                          </label>
                          <input
                              type="range"
                              min="0"
                              max="10"
                              value={sickleCellData.pain_severity}
                              onChange={(e) => setSickleCellData({...sickleCellData, pain_severity: e.target.value})}
                              className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>0 (No pain)</span>
                            <span className="font-semibold text-lg">{sickleCellData.pain_severity || '0'}</span>
                            <span>10 (Worst)</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Crisis Duration
                          </label>
                          <select
                              value={sickleCellData.crisis_duration}
                              onChange={(e) => setSickleCellData({...sickleCellData, crisis_duration: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select duration...</option>
                            <option value="hours">Less than 24 hours</option>
                            <option value="1-3-days">1-3 days</option>
                            <option value="4-7-days">4-7 days</option>
                            <option value="over-week">Over 1 week</option>
                            <option value="ongoing">Ongoing</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Known Triggers (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'dehydration', label: 'Dehydration' },
                              { value: 'cold', label: 'Cold Temperature' },
                              { value: 'stress', label: 'Physical/Emotional Stress' },
                              { value: 'infection', label: 'Infection' },
                              { value: 'altitude', label: 'High Altitude' },
                              { value: 'alcohol', label: 'Alcohol' },
                              { value: 'unknown', label: 'Unknown Trigger' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={sickleCellData.triggers.includes(option.value)}
                                      onChange={(e) => {
                                        const newTriggers = e.target.checked
                                            ? [...sickleCellData.triggers, option.value]
                                            : sickleCellData.triggers.filter(t => t !== option.value);
                                        setSickleCellData({...sickleCellData, triggers: newTriggers});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment Received (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'home-management', label: 'Home Management' },
                              { value: 'er-visit', label: 'Emergency Room Visit' },
                              { value: 'hospitalized', label: 'Hospitalized' },
                              { value: 'iv-fluids', label: 'IV Fluids' },
                              { value: 'pain-medication', label: 'Pain Medication' },
                              { value: 'oxygen', label: 'Oxygen Therapy' },
                              { value: 'blood-transfusion', label: 'Blood Transfusion' },
                              { value: 'exchange-transfusion', label: 'Exchange Transfusion' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={sickleCellData.treatment_received.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...sickleCellData.treatment_received, option.value]
                                            : sickleCellData.treatment_received.filter(t => t !== option.value);
                                        setSickleCellData({...sickleCellData, treatment_received: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Hospitalizations in Past 12 Months
                          </label>
                          <select
                              value={sickleCellData.hospitalizations_year}
                              onChange={(e) => setSickleCellData({...sickleCellData, hospitalizations_year: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select frequency...</option>
                            <option value="0">0 hospitalizations</option>
                            <option value="1-2">1-2 hospitalizations</option>
                            <option value="3">3 hospitalizations</option>
                            <option value="4-plus">4 or more hospitalizations</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* Bleeding Disorder Form */}
                  {isBleedingDisorderRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                          🩸 Bleeding Disorder Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type of Bleeding Disorder
                          </label>
                          <select
                              value={bleedingDisorderData.disorder_type}
                              onChange={(e) => setBleedingDisorderData({...bleedingDisorderData, disorder_type: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select type...</option>
                            <option value="thrombocytopenia">Immune Thrombocytopenia</option>
                            <option value="hemophilia">Hemophilia</option>
                            <option value="von-willebrand">Von Willebrand Disease</option>
                            <option value="other">Other Bleeding Disorder</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bleeding Sites (select all that apply)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'nose', label: 'Nosebleeds' },
                              { value: 'gums', label: 'Gum Bleeding' },
                              { value: 'skin', label: 'Skin (Bruising/Petechiae)' },
                              { value: 'gi', label: 'GI Bleeding' },
                              { value: 'urinary', label: 'Urinary Tract' },
                              { value: 'menstrual', label: 'Heavy Menstrual' },
                              { value: 'joints', label: 'Joint Bleeding' },
                              { value: 'intracranial', label: 'Intracranial' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={bleedingDisorderData.bleeding_site.includes(option.value)}
                                      onChange={(e) => {
                                        const newSites = e.target.checked
                                            ? [...bleedingDisorderData.bleeding_site, option.value]
                                            : bleedingDisorderData.bleeding_site.filter(s => s !== option.value);
                                        setBleedingDisorderData({...bleedingDisorderData, bleeding_site: newSites});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bleeding Episode Frequency
                          </label>
                          <select
                              value={bleedingDisorderData.bleeding_frequency}
                              onChange={(e) => setBleedingDisorderData({...bleedingDisorderData, bleeding_frequency: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select frequency...</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Every 3 months</option>
                            <option value="rare">Rare/Occasional</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Platelet Count (if known)
                          </label>
                          <input
                              type="number"
                              value={bleedingDisorderData.platelet_count}
                              onChange={(e) => setBleedingDisorderData({...bleedingDisorderData, platelet_count: e.target.value})}
                              placeholder="e.g., 50,000"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 150,000-400,000 per μL</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Treatment (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'steroids', label: 'Corticosteroids' },
                              { value: 'immunoglobulins', label: 'IV Immunoglobulins (IVIG)' },
                              { value: 'immunosuppressants', label: 'Immunosuppressants' },
                              { value: 'tpo-agonists', label: 'TPO Receptor Agonists' },
                              { value: 'platelet-transfusion', label: 'Platelet Transfusions' },
                              { value: 'factor-replacement', label: 'Factor Replacement Therapy' },
                              { value: 'splenectomy', label: 'Previous Splenectomy' },
                              { value: 'monitoring-only', label: 'Monitoring Only' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={bleedingDisorderData.treatment.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...bleedingDisorderData.treatment, option.value]
                                            : bleedingDisorderData.treatment.filter(t => t !== option.value);
                                        setBleedingDisorderData({...bleedingDisorderData, treatment: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Infection-Related Form */}
                  {isInfectionRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                          🦠 Infection Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type of Infection (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'respiratory', label: 'Respiratory (pneumonia, bronchitis)' },
                              { value: 'uti', label: 'Urinary Tract Infection' },
                              { value: 'skin', label: 'Skin/Soft Tissue Infection' },
                              { value: 'oral', label: 'Oral/Dental Infection' },
                              { value: 'sinus', label: 'Sinus Infection' },
                              { value: 'gi', label: 'GI Infection' },
                              { value: 'blood', label: 'Bloodstream Infection (Sepsis)' },
                              { value: 'fungal', label: 'Fungal Infection' },
                              { value: 'viral', label: 'Viral Infection' },
                              { value: 'other', label: 'Other Infection' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={infectionData.infection_type.includes(option.value)}
                                      onChange={(e) => {
                                        const newTypes = e.target.checked
                                            ? [...infectionData.infection_type, option.value]
                                            : infectionData.infection_type.filter(t => t !== option.value);
                                        setInfectionData({...infectionData, infection_type: newTypes});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Infection Frequency
                          </label>
                          <select
                              value={infectionData.frequency}
                              onChange={(e) => setInfectionData({...infectionData, frequency: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select frequency...</option>
                            <option value="weekly">Weekly or more often</option>
                            <option value="every-6-weeks">Every 6 weeks</option>
                            <option value="every-3-months">Every 3 months</option>
                            <option value="every-6-months">Every 6 months</option>
                            <option value="yearly">Once per year</option>
                            <option value="first-time">First time</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Severity
                          </label>
                          <select
                              value={infectionData.severity}
                              onChange={(e) => setInfectionData({...infectionData, severity: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select severity...</option>
                            <option value="mild">Mild - Managed at home</option>
                            <option value="moderate">Moderate - Doctor visit/antibiotics needed</option>
                            <option value="severe">Severe - ER visit required</option>
                            <option value="hospitalized">Required hospitalization</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Requires Hospitalization?
                          </label>
                          <select
                              value={infectionData.requires_hospitalization}
                              onChange={(e) => setInfectionData({...infectionData, requires_hospitalization: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select...</option>
                            <option value="no">No hospitalization needed</option>
                            <option value="yes-current">Currently hospitalized</option>
                            <option value="yes-recent">Recently hospitalized</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'antibiotics-oral', label: 'Oral Antibiotics' },
                              { value: 'antibiotics-iv', label: 'IV Antibiotics' },
                              { value: 'antifungal', label: 'Antifungal Medication' },
                              { value: 'antiviral', label: 'Antiviral Medication' },
                              { value: 'prophylactic', label: 'Prophylactic Antibiotics' },
                              { value: 'growth-factors', label: 'Growth Factors (G-CSF/GM-CSF)' },
                              { value: 'ivig', label: 'IVIG (Immunoglobulin Therapy)' },
                              { value: 'hospitalization', label: 'Hospitalization' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={infectionData.treatment.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...infectionData.treatment, option.value]
                                            : infectionData.treatment.filter(t => t !== option.value);
                                        setInfectionData({...infectionData, treatment: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Immune Status
                          </label>
                          <select
                              value={infectionData.immune_status}
                              onChange={(e) => setInfectionData({...infectionData, immune_status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select status...</option>
                            <option value="normal">Normal immune function</option>
                            <option value="neutropenia">Neutropenia (low white blood cells)</option>
                            <option value="immunosuppressed">Immunosuppressed (medications)</option>
                            <option value="bone-marrow">Post bone marrow/stem cell transplant</option>
                            <option value="chemotherapy">During/after chemotherapy</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* Lymphoma/Leukemia Form */}
                  {isLymphomaLeukemiaRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 space-y-4 border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                          🎗️ Cancer/Lymphoma Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Diagnosis
                          </label>
                          <select
                              value={lymphomaLeukemiaData.diagnosis}
                              onChange={(e) => setLymphomaLeukemiaData({...lymphomaLeukemiaData, diagnosis: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select diagnosis...</option>
                            <option value="hodgkin">Hodgkin's Lymphoma</option>
                            <option value="non-hodgkin">Non-Hodgkin's Lymphoma</option>
                            <option value="cll">Chronic Lymphocytic Leukemia</option>
                            <option value="cml">Chronic Myelogenous Leukemia</option>
                            <option value="all">Acute Lymphoblastic Leukemia</option>
                            <option value="aml">Acute Myeloid Leukemia</option>
                            <option value="multiple-myeloma">Multiple Myeloma</option>
                            <option value="plasmacytoma">Solitary Plasmacytoma</option>
                            <option value="mds">Myelodysplastic Syndrome</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stage (if known)
                          </label>
                          <select
                              value={lymphomaLeukemiaData.stage}
                              onChange={(e) => setLymphomaLeukemiaData({...lymphomaLeukemiaData, stage: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select stage...</option>
                            <option value="stage-1">Stage I (Early/Localized)</option>
                            <option value="stage-2">Stage II (Limited Spread)</option>
                            <option value="stage-3">Stage III (Advanced)</option>
                            <option value="stage-4">Stage IV (Widespread)</option>
                            <option value="early">Early Stage</option>
                            <option value="advanced">Advanced Stage</option>
                            <option value="unknown">Stage Unknown</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment Status
                          </label>
                          <select
                              value={lymphomaLeukemiaData.treatment_status}
                              onChange={(e) => setLymphomaLeukemiaData({...lymphomaLeukemiaData, treatment_status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select status...</option>
                            <option value="active-treatment">Active Treatment (100% rating)</option>
                            <option value="remission">Complete Remission</option>
                            <option value="partial-remission">Partial Remission</option>
                            <option value="maintenance">Maintenance Therapy</option>
                            <option value="surveillance">Surveillance Only</option>
                            <option value="recurrence">Recurrence/Relapse</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment Type (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'chemotherapy', label: 'Chemotherapy' },
                              { value: 'radiation', label: 'Radiation Therapy' },
                              { value: 'immunotherapy', label: 'Immunotherapy' },
                              { value: 'targeted-therapy', label: 'Targeted Therapy' },
                              { value: 'stem-cell', label: 'Stem Cell/Bone Marrow Transplant' },
                              { value: 'car-t', label: 'CAR T-Cell Therapy' },
                              { value: 'watch-wait', label: 'Watch and Wait' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={lymphomaLeukemiaData.treatment_type.includes(option.value)}
                                      onChange={(e) => {
                                        const newTypes = e.target.checked
                                            ? [...lymphomaLeukemiaData.treatment_type, option.value]
                                            : lymphomaLeukemiaData.treatment_type.filter(t => t !== option.value);
                                        setLymphomaLeukemiaData({...lymphomaLeukemiaData, treatment_type: newTypes});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cycles Completed (if applicable)
                          </label>
                          <input
                              type="text"
                              value={lymphomaLeukemiaData.cycles_completed}
                              onChange={(e) => setLymphomaLeukemiaData({...lymphomaLeukemiaData, cycles_completed: e.target.value})}
                              placeholder="e.g., 4 of 6"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Side Effects (select all that apply)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'fatigue', label: 'Fatigue' },
                              { value: 'nausea', label: 'Nausea/Vomiting' },
                              { value: 'neuropathy', label: 'Neuropathy' },
                              { value: 'pain', label: 'Pain' },
                              { value: 'infections', label: 'Frequent Infections' },
                              { value: 'anemia', label: 'Anemia' },
                              { value: 'bleeding', label: 'Bleeding Issues' },
                              { value: 'weight-loss', label: 'Weight Loss' },
                              { value: 'cognitive', label: 'Cognitive Changes' },
                              { value: 'mouth-sores', label: 'Mouth Sores' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={lymphomaLeukemiaData.side_effects.includes(option.value)}
                                      onChange={(e) => {
                                        const newEffects = e.target.checked
                                            ? [...lymphomaLeukemiaData.side_effects, option.value]
                                            : lymphomaLeukemiaData.side_effects.filter(s => s !== option.value);
                                        setLymphomaLeukemiaData({...lymphomaLeukemiaData, side_effects: newEffects});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date of Last Treatment
                          </label>
                          <input
                              type="date"
                              value={lymphomaLeukemiaData.last_treatment_date}
                              onChange={(e) => setLymphomaLeukemiaData({...lymphomaLeukemiaData, last_treatment_date: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                  )}

                  {/* Polycythemia/Myeloproliferative Disorder Form */}
                  {isPolycythemiaRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                          🔴 Myeloproliferative Disorder Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Diagnosis
                          </label>
                          <select
                              value={polycythemiaData.diagnosis}
                              onChange={(e) => setPolycythemiaData({...polycythemiaData, diagnosis: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select diagnosis...</option>
                            <option value="polycythemia-vera">Polycythemia Vera</option>
                            <option value="essential-thrombocythemia">Essential Thrombocythemia</option>
                            <option value="primary-myelofibrosis">Primary Myelofibrosis</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Treatment (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'phlebotomy', label: 'Phlebotomy/Therapeutic Bloodletting' },
                              { value: 'hydroxyurea', label: 'Hydroxyurea (Myelosuppressive)' },
                              { value: 'interferon', label: 'Interferon' },
                              { value: 'jakafi', label: 'Ruxolitinib (Jakafi)' },
                              { value: 'aspirin', label: 'Low-dose Aspirin' },
                              { value: 'anagrelide', label: 'Anagrelide' },
                              { value: 'other-chemo', label: 'Other Chemotherapy' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={polycythemiaData.treatment.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...polycythemiaData.treatment, option.value]
                                            : polycythemiaData.treatment.filter(t => t !== option.value);
                                        setPolycythemiaData({...polycythemiaData, treatment: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {polycythemiaData.treatment.includes('phlebotomy') && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Phlebotomy Frequency
                                </label>
                                <select
                                    value={polycythemiaData.phlebotomy_frequency}
                                    onChange={(e) => setPolycythemiaData({...polycythemiaData, phlebotomy_frequency: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                  <option value="">Select frequency...</option>
                                  <option value="weekly">Weekly or more</option>
                                  <option value="6-plus-year">6 or more times per year</option>
                                  <option value="4-5-year">4-5 times per year</option>
                                  <option value="3-or-less">3 or fewer times per year</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Date of Last Phlebotomy
                                </label>
                                <input
                                    type="date"
                                    value={polycythemiaData.last_phlebotomy}
                                    onChange={(e) => setPolycythemiaData({...polycythemiaData, last_phlebotomy: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                            </>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Medications for Blood Count Control (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'hydroxyurea-continuous', label: 'Continuous Hydroxyurea' },
                              { value: 'interferon-continuous', label: 'Continuous Interferon' },
                              { value: 'jakafi-continuous', label: 'Continuous JAK Inhibitor' },
                              { value: 'intermittent-therapy', label: 'Intermittent Therapy' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={polycythemiaData.medications.includes(option.value)}
                                      onChange={(e) => {
                                        const newMeds = e.target.checked
                                            ? [...polycythemiaData.medications, option.value]
                                            : polycythemiaData.medications.filter(m => m !== option.value);
                                        setPolycythemiaData({...polycythemiaData, medications: newMeds});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Complications (select all that apply)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'blood-clots', label: 'Blood Clots/Thrombosis' },
                              { value: 'stroke', label: 'Stroke' },
                              { value: 'heart-attack', label: 'Heart Attack' },
                              { value: 'bleeding', label: 'Bleeding Episodes' },
                              { value: 'gout', label: 'Gout' },
                              { value: 'enlarged-spleen', label: 'Enlarged Spleen' },
                              { value: 'itching', label: 'Severe Itching' },
                              { value: 'headaches', label: 'Frequent Headaches' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={polycythemiaData.complications.includes(option.value)}
                                      onChange={(e) => {
                                        const newComplications = e.target.checked
                                            ? [...polycythemiaData.complications, option.value]
                                            : polycythemiaData.complications.filter(c => c !== option.value);
                                        setPolycythemiaData({...polycythemiaData, complications: newComplications});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Treatment Side Effects Form */}
                  {isTreatmentRelated && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 space-y-4 border border-orange-200 dark:border-orange-800">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                          💊 Treatment Side Effects
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment Type
                          </label>
                          <select
                              value={treatmentData.treatment_type}
                              onChange={(e) => setTreatmentData({...treatmentData, treatment_type: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select treatment type...</option>
                            <option value="chemotherapy">Chemotherapy</option>
                            <option value="radiation">Radiation Therapy</option>
                            <option value="immunotherapy">Immunotherapy</option>
                            <option value="targeted-therapy">Targeted Therapy</option>
                            <option value="hormone-therapy">Hormone Therapy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Regimen/Protocol (if known)
                          </label>
                          <input
                              type="text"
                              value={treatmentData.regimen}
                              onChange={(e) => setTreatmentData({...treatmentData, regimen: e.target.value})}
                              placeholder="e.g., R-CHOP, ABVD, etc."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Cycle Number
                          </label>
                          <input
                              type="text"
                              value={treatmentData.cycle_number}
                              onChange={(e) => setTreatmentData({...treatmentData, cycle_number: e.target.value})}
                              placeholder="e.g., Cycle 3 of 6"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Side Effects Experiencing (select all that apply)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'nausea', label: 'Nausea' },
                              { value: 'vomiting', label: 'Vomiting' },
                              { value: 'diarrhea', label: 'Diarrhea' },
                              { value: 'constipation', label: 'Constipation' },
                              { value: 'fatigue', label: 'Fatigue' },
                              { value: 'neuropathy', label: 'Neuropathy' },
                              { value: 'mouth-sores', label: 'Mouth Sores/Mucositis' },
                              { value: 'hair-loss', label: 'Hair Loss' },
                              { value: 'skin-changes', label: 'Skin Changes/Rash' },
                              { value: 'appetite-loss', label: 'Loss of Appetite' },
                              { value: 'cognitive', label: 'Cognitive Issues (Chemo Brain)' },
                              { value: 'pain', label: 'Pain' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={treatmentData.side_effects.includes(option.value)}
                                      onChange={(e) => {
                                        const newEffects = e.target.checked
                                            ? [...treatmentData.side_effects, option.value]
                                            : treatmentData.side_effects.filter(s => s !== option.value);
                                        setTreatmentData({...treatmentData, side_effects: newEffects});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Overall Side Effect Severity
                          </label>
                          <select
                              value={treatmentData.severity}
                              onChange={(e) => setTreatmentData({...treatmentData, severity: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select severity...</option>
                            <option value="mild">Mild - Manageable</option>
                            <option value="moderate">Moderate - Interferes with daily activities</option>
                            <option value="severe">Severe - Requires intervention</option>
                            <option value="life-threatening">Life-threatening</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Side Effect Management (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'anti-nausea', label: 'Anti-nausea Medications' },
                              { value: 'pain-meds', label: 'Pain Medications' },
                              { value: 'growth-factors', label: 'Growth Factors' },
                              { value: 'steroids', label: 'Steroids' },
                              { value: 'nutrition-support', label: 'Nutritional Support' },
                              { value: 'hospitalization', label: 'Required Hospitalization' },
                              { value: 'dose-reduction', label: 'Dose Reduction Needed' },
                              { value: 'treatment-delay', label: 'Treatment Delay' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={treatmentData.management.includes(option.value)}
                                      onChange={(e) => {
                                        const newManagement = e.target.checked
                                            ? [...treatmentData.management, option.value]
                                            : treatmentData.management.filter(m => m !== option.value);
                                        setTreatmentData({...treatmentData, management: newManagement});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* B12 Deficiency/Pernicious Anemia Form */}
                  {isB12DeficiencyRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 space-y-4 border border-amber-200 dark:border-amber-800">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                          💊 B12 Deficiency/Pernicious Anemia Details
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cause of Deficiency
                          </label>
                          <select
                              value={b12DeficiencyData.deficiency_cause}
                              onChange={(e) => setB12DeficiencyData({...b12DeficiencyData, deficiency_cause: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select cause...</option>
                            <option value="pernicious-anemia">Pernicious Anemia</option>
                            <option value="dietary">Dietary Deficiency</option>
                            <option value="malabsorption">Malabsorption (Crohn's, celiac, etc.)</option>
                            <option value="gastric-surgery">Post-gastric Surgery</option>
                            <option value="medications">Medication-induced (Metformin, PPIs)</option>
                            <option value="other">Other Cause</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Neurological Symptoms (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'numbness-tingling', label: 'Numbness/Tingling in Hands/Feet' },
                              { value: 'balance-problems', label: 'Balance Problems' },
                              { value: 'difficulty-walking', label: 'Difficulty Walking' },
                              { value: 'weakness', label: 'Muscle Weakness' },
                              { value: 'memory-problems', label: 'Memory Problems' },
                              { value: 'confusion', label: 'Confusion/Disorientation' },
                              { value: 'mood-changes', label: 'Mood Changes/Depression' },
                              { value: 'vision-changes', label: 'Vision Changes' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={b12DeficiencyData.neurological_symptoms.includes(option.value)}
                                      onChange={(e) => {
                                        const newSymptoms = e.target.checked
                                            ? [...b12DeficiencyData.neurological_symptoms, option.value]
                                            : b12DeficiencyData.neurological_symptoms.filter(s => s !== option.value);
                                        setB12DeficiencyData({...b12DeficiencyData, neurological_symptoms: newSymptoms});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Treatment (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'injections-weekly', label: 'B12 Injections (Weekly or more)' },
                              { value: 'injections-monthly', label: 'B12 Injections (Monthly)' },
                              { value: 'sublingual', label: 'Sublingual B12' },
                              { value: 'high-dose-oral', label: 'High-dose Oral B12' },
                              { value: 'nasal-spray', label: 'Nasal Spray/Gel' },
                              { value: 'dietary-only', label: 'Dietary Modification Only' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={b12DeficiencyData.treatment.includes(option.value)}
                                      onChange={(e) => {
                                        const newTreatment = e.target.checked
                                            ? [...b12DeficiencyData.treatment, option.value]
                                            : b12DeficiencyData.treatment.filter(t => t !== option.value);
                                        setB12DeficiencyData({...b12DeficiencyData, treatment: newTreatment});
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {(b12DeficiencyData.treatment.includes('injections-weekly') ||
                            b12DeficiencyData.treatment.includes('injections-monthly')) && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Injection Frequency
                                </label>
                                <select
                                    value={b12DeficiencyData.injection_frequency}
                                    onChange={(e) => setB12DeficiencyData({...b12DeficiencyData, injection_frequency: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                  <option value="">Select frequency...</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="biweekly">Every 2 weeks</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="as-needed">As needed for symptoms</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Date of Last Injection
                                </label>
                                <input
                                    type="date"
                                    value={b12DeficiencyData.last_injection}
                                    onChange={(e) => setB12DeficiencyData({...b12DeficiencyData, last_injection: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                            </>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symptom Improvement with Treatment
                          </label>
                          <select
                              value={b12DeficiencyData.improvement_noted}
                              onChange={(e) => setB12DeficiencyData({...b12DeficiencyData, improvement_noted: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select improvement...</option>
                            <option value="complete">Complete Resolution</option>
                            <option value="significant">Significant Improvement</option>
                            <option value="moderate">Moderate Improvement</option>
                            <option value="minimal">Minimal Improvement</option>
                            <option value="none">No Improvement (Residual Symptoms)</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Dental/Oral Quick Log Form (Simplified) */}
                  {isDentalOralRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 space-y-4 border border-amber-200 dark:border-amber-800">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                          🦷 Dental/Oral Details
                        </h3>

                        {/* Jaw Pain Severity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Jaw Pain Level (0-10)
                          </label>
                          <input
                              type="range"
                              min="0"
                              max="10"
                              value={dentalData.jawPainSeverity}
                              onChange={(e) => setDentalData({...dentalData, jawPainSeverity: Number(e.target.value)})}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">No pain</span>
                            <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                              {dentalData.jawPainSeverity}/10
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Worst</span>
                          </div>
                        </div>

                        {/* Jaw Opening */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Jaw Opening (optional)
                          </label>
                          <div className="flex gap-2">
                            <input
                                type="number"
                                value={dentalData.jawOpening}
                                onChange={(e) => setDentalData({...dentalData, jawOpening: e.target.value})}
                                placeholder="35"
                                min="0"
                                max="60"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">mm</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 35-50mm</p>
                        </div>

                        {/* Chewing Difficulty */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Chewing Difficulty
                          </label>
                          <select
                              value={dentalData.chewingDifficulty}
                              onChange={(e) => setDentalData({...dentalData, chewingDifficulty: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select level...</option>
                            <option value="none">No Difficulty</option>
                            <option value="mild">Mild Difficulty</option>
                            <option value="moderate">Moderate Difficulty</option>
                            <option value="severe">Severe Difficulty</option>
                            <option value="unable">Unable to Chew</option>
                          </select>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Dietary Restrictions
                          </label>
                          <select
                              value={dentalData.dietaryRestrictions}
                              onChange={(e) => setDentalData({...dentalData, dietaryRestrictions: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select restrictions...</option>
                            <option value="none">No Restrictions</option>
                            <option value="semi-solid">Semi-solid Foods Required</option>
                            <option value="soft">Soft Foods Required</option>
                            <option value="puree">Pureed Foods Required</option>
                            <option value="full-liquid">Full Liquid Diet Required</option>
                          </select>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Higher VA rating with dietary restrictions
                          </p>
                        </div>

                        {/* Missing Teeth Count */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Number of Missing Teeth (if applicable)
                          </label>
                          <input
                              type="number"
                              value={dentalData.toothCount}
                              onChange={(e) => setDentalData({...dentalData, toothCount: e.target.value})}
                              min="0"
                              max="32"
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total out of 32 adult teeth</p>
                        </div>

                        {/* Prosthesis Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Prosthesis/Denture Type (if applicable)
                          </label>
                          <select
                              value={dentalData.prosthesisType}
                              onChange={(e) => setDentalData({...dentalData, prosthesisType: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select type...</option>
                            <option value="none">No Prosthesis</option>
                            <option value="partial-removable">Partial Denture</option>
                            <option value="complete-upper">Complete Upper Denture</option>
                            <option value="complete-lower">Complete Lower Denture</option>
                            <option value="complete-both">Complete Dentures (Both)</option>
                            <option value="implants">Dental Implants</option>
                            <option value="bridge">Fixed Bridge</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        placeholder="What were you doing? Any triggers?"
                        rows={2}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Occurrence Time Picker */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <OccurrenceTimePicker
                        value={occurredAt}
                        onChange={setOccurredAt}
                        label="When did this occur?"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800">
                  <button
                      onClick={handleCloseModal}
                      className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmLog}
                      className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
                  >
                    Log Symptom
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default QuickLog;