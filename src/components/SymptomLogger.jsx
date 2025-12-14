import { useState, useEffect, useRef } from 'react';
import { sortedSymptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom, getMedications, logMedicationTaken } from '../utils/storage';
import QuickLog from './QuickLog';
import AddChronicModal from './AddChronicModal';

const SymptomLogger = ({ onLogSaved, prefillData, onPrefillUsed }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [refreshQuickLog, setRefreshQuickLog] = useState(0);

  const [isFlareUp, setIsFlareUp] = useState(false);
  const [duration, setDuration] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Custom symptom form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomCategory, setNewSymptomCategory] = useState('Custom');
  const [customError, setCustomError] = useState('');

  // Chronic symptom modal state
  const [showChronicModal, setShowChronicModal] = useState(false);

  // Medication for symptom
  const [medications, setMedications] = useState([]);
  const [tookMedication, setTookMedication] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);

  // Migraine-specific fields
  const [migraineData, setMigraineData] = useState({
    duration: '',
    prostrating: null,
    aura: false,
    nausea: false,
    lightSensitivity: false,
    soundSensitivity: false,
    triggers: '',
  });

  // Sleep-specific fields
  const [sleepData, setSleepData] = useState({
    hoursSlept: '',
    quality: 5,
    wakeUps: '',
    troubleFallingAsleep: false,
    troubleStayingAsleep: false,
    nightmares: false,
    feelRested: null,
  });

  // PTSD-specific fields
  const [ptsdData, setPtsdData] = useState({
    flashbacks: false,
    avoidance: false,
    emotionalNumbering: false,
    hypervigilance: false,
    exaggeratedStartle: false,
    intrusiveThoughts: false,
    triggerDescription: '',
  });

  // Pain-specific fields
  const [painData, setPainData] = useState({
    painLocation: '',
    radiating: false,
    radiatingTo: '',
    limitedRangeOfMotion: false,
    affectedActivities: [],
    painType: '',
    flareUp: false,
  });

  const [giData, setGIData] = useState({
    bristolScale: null,          // 1-7 Bristol Stool Scale
    frequencyPerDay: '',         // Number of episodes/bowel movements
    urgencyLevel: '',            // none/mild/moderate/severe/incontinence
    bloodPresent: null,          // true/false/null
    bloatingSeverity: '',        // none/mild/moderate/severe
    abdominalPainLocation: '',   // upper-right/upper-left/lower-right/lower-left/central/diffuse
    mealRelated: null,           // true/false - symptoms worse after eating
    nighttimeSymptoms: false,    // woken up by symptoms
  });

  const [respiratoryData, setRespiratoryData] = useState({
    rescueInhalerUsed: null,     // true/false
    inhalerPuffs: '',            // number of puffs
    peakFlow: '',                // L/min reading
    spo2: '',                    // oxygen saturation %
    activityTrigger: '',         // rest/mild/moderate/severe
    wheezing: false,
    chestTightness: false,
    coughing: false,
  });

  const [jointData, setJointData] = useState({
    joint: '',                   // shoulder/knee/hip/ankle/elbow/wrist/finger/toe/other
    side: '',                    // left/right/bilateral
    romEstimate: '',             // full/slightly/moderately/severely limited
    morningStiffness: '',        // none/minutes/hours
    swelling: false,
    instability: false,
    locking: false,
    grinding: false,
  });

  const [seizureData, setSeizureData] = useState({
    episodeType: '',             // generalized/partial/absence/psychogenic/other
    duration: '',                // duration in minutes
    lossOfConsciousness: null,   // yes/no/partial
    auraPresent: null,           // true/false
    recoveryTime: '',            // minutes/hours
    witnessPresent: null,        // true/false
  });

  // Phase 2: Eye & Vision data
  const [eyeData, setEyeData] = useState({
    affectedEye: '',             // left/right/both
    leftEyeAcuity: '',          // 20/20, 20/40, CF, HM, LP, NLP, etc.
    rightEyeAcuity: '',         // 20/20, 20/40, CF, HM, LP, NLP, etc.
    symptoms: [],               // blurriness, halos, pain, etc.
    fieldOfVision: [],          // central, peripheral, blind-spots, complete-loss
    affectedActivities: [],     // reading, driving-day, driving-night, faces, computer, depth, balance
    triggeringFactors: '',      // optional text
    associatedConditions: [],   // diabetes, hypertension, tbi, migraine
  });

  // ============================================
// GENITOURINARY DATA STATE STRUCTURE (Phase 3)
// ============================================
// This comprehensive state object tracks all genitourinary conditions:
// DC 7508 (Kidney Stones), DC 7530 (Chronic Renal Disease), DC 7541 (Diabetic Nephropathy)
// DC 7512 (Chronic Cystitis/UTI), DC 7542 (Neurogenic Bladder), DC 7518 (Urethral Stricture)
// DC 7527 (Prostate Conditions), DC 7332 (Sphincter Impairment), DC 7522 (Erectile Dysfunction)

  const [genitourinaryData, setGenitourinaryData] = useState({
    affectedSystem: '',         // kidney/bladder/prostate/reproductive/sphincter
    // Kidney/Renal
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
    // Voiding dysfunction
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
    // Prostate
    prostateSymptoms: [],
    prostateScore: '',
    prostateMedications: [],
    // Sphincter/Bowel
    fecalIncontinenceEpisode: false,
    fecalIncontinenceFrequency: '',
    fecalIncontinenceType: '',
    fecalUrgency: false,
    bowelControlMethods: [],
    // Reproductive
    erectileDysfunction: false,
    edSeverity: '',
    testicular: false,
    testicularSymptoms: [],
    // Impact & Associations
    activitiesAffected: [],
    fluidRestriction: false,
    workMissed: false,
    associatedConditions: [],
    complications: [],
  });

  // Phase 1H - Track processed prefillData to avoid re-processing
  const processedPrefillId = useRef(null);
  const isPrefilling = useRef(false);

  useEffect(() => {
    setCustomSymptoms(getCustomSymptoms());
    setMedications(getMedications());
  }, []);

  // Phase 1H - Handle prefill data from "Log again" button
  useEffect(() => {
    if (prefillData && prefillData.id && processedPrefillId.current !== prefillData.id) {
      // Mark this prefill as processed and set flag to prevent reset
      processedPrefillId.current = prefillData.id;
      isPrefilling.current = true;

      console.log('🔄 Processing prefill data:', prefillData);

      // Find the category and symptom
      const categoryInfo = sortedSymptomCategories.find(cat =>
          cat.symptoms.some(sym => sym.id === prefillData.symptomId)
      );

      console.log('Found category info:', categoryInfo);

      if (categoryInfo) {
        // Use the category ID (not name) for the dropdown
        console.log('Setting category ID:', categoryInfo.id);
        setSelectedCategory(categoryInfo.id);
        setSelectedSymptom(prefillData.symptomId);
      } else {
        // Fallback: try to find category by name
        const fallbackCategory = sortedSymptomCategories.find(cat =>
            cat.name === prefillData.category
        );
        if (fallbackCategory) {
          console.log('Using fallback - setting category ID:', fallbackCategory.id);
          setSelectedCategory(fallbackCategory.id);
          setSelectedSymptom(prefillData.symptomId);
        } else {
          console.warn('Could not find category for symptom:', prefillData.symptomId);
        }
      }

      // Set universal fields
      console.log('📝 Setting universal fields...');
      setSeverity(prefillData.severity || 5);
      setNotes(prefillData.notes || '');
      setIsFlareUp(prefillData.isFlareUp || false);
      setDuration(prefillData.duration || '');
      setTimeOfDay(prefillData.timeOfDay || '');

      // Set condition-specific data
      console.log('🔍 Checking condition-specific data...');

      if (prefillData.migraineData) {
        console.log('💊 Setting migraine data:', prefillData.migraineData);
        setMigraineData({ ...prefillData.migraineData });
      }

      if (prefillData.sleepData) {
        console.log('😴 Setting sleep data:', prefillData.sleepData);
        setSleepData({ ...prefillData.sleepData });
      }

      if (prefillData.ptsdData) {
        console.log('🧠 Setting PTSD data:', prefillData.ptsdData);
        setPtsdData({ ...prefillData.ptsdData });
      }

      if (prefillData.painData) {
        console.log('🩹 Setting pain data:', prefillData.painData);
        setPainData({ ...prefillData.painData });
      }

      if (prefillData.giData) {
        console.log('🫃 Setting GI data:', prefillData.giData);
        setGIData({ ...prefillData.giData });
      }

      if (prefillData.respiratoryData) {
        console.log('🫁 Setting respiratory data:', prefillData.respiratoryData);
        setRespiratoryData({ ...prefillData.respiratoryData });
      }

      if (prefillData.jointData) {
        console.log('🦴 Setting joint data:', prefillData.jointData);
        setJointData({ ...prefillData.jointData });
      }

      if (prefillData.seizureData) {
        console.log('⚡ Setting seizure data:', prefillData.seizureData);
        setSeizureData({ ...prefillData.seizureData });
      }

      if (prefillData.eyeData) {
        console.log('👁️ Setting eye data:', prefillData.eyeData);
        setEyeData({ ...prefillData.eyeData });
      }

      if (prefillData.genitourinaryData) {
        console.log('🫘 Setting genitourinary data:', prefillData.genitourinaryData);
        setGenitourinaryData({ ...prefillData.genitourinaryData });
      }

      console.log('✅ All prefill data set');

      // Clear prefillData AFTER state updates have been queued
      setTimeout(() => {
        if (onPrefillUsed) {
          onPrefillUsed();
        }
        // Clear the prefilling flag after a delay to allow state updates
        setTimeout(() => {
          isPrefilling.current = false;
          console.log('🏁 Prefill complete, reset protection disabled');
        }, 50);
      }, 100);
    }
  }, [prefillData]);

  // Determine which special form to show - EXPANDED DETECTION
  const isMigraineSelected = selectedSymptom === 'migraine';

  // Sleep: match sleep-related symptoms only
  const isSleepSelected = selectedSymptom === 'sleep-issues' ||
      selectedSymptom?.includes('insomnia') ||
      selectedSymptom?.includes('sleep');

  const isNightmareSelected = selectedSymptom === 'nightmares';

  // PTSD/Mental Health: broader matching for mental health symptoms only
  const isPTSDRelated = selectedSymptom?.includes('anxiety') ||
      selectedSymptom?.includes('ptsd') ||
      selectedSymptom?.includes('panic') ||
      selectedSymptom?.includes('depression') ||
      selectedSymptom?.includes('mood') ||
      ['hypervigilance', 'nightmares', 'irritability', 'flashbacks', 'intrusive-thoughts',
        'avoidance', 'emotional-numbness', 'startle-response', 'concentration-problems',
        'social-withdrawal', 'hopelessness', 'guilt', 'anger-outbursts'].includes(selectedSymptom);

  // Pain: match ANY pain-related symptom only
  const isPainSelected = selectedSymptom?.includes('pain') ||
      selectedSymptom?.includes('-ache') ||
      selectedSymptom?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedSymptom?.includes(term));

  // Phase 1B: GI condition detection - match IBS, GERD, and future GI conditions
  const isGISelected = selectedSymptom?.startsWith('ibs') ||
      selectedSymptom?.startsWith('gerd') ||
      selectedSymptom?.startsWith('uc-') ||
      selectedSymptom?.startsWith('ulcer-') ||
      selectedSymptom?.startsWith('hemorrhoid') ||
      selectedSymptom?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedSymptom);

  // Phase 1C: Respiratory condition detection - asthma, COPD, sleep apnea, etc.
  const isRespiratorySelected = selectedSymptom?.startsWith('asthma-') ||
      selectedSymptom?.startsWith('copd-') ||
      selectedSymptom?.startsWith('apnea-') ||
      selectedSymptom?.startsWith('emphysema-') ||
      selectedSymptom?.startsWith('bronchitis-') ||
      selectedSymptom?.includes('breathing') ||
      selectedSymptom?.includes('wheez') ||
      selectedSymptom?.includes('cough') ||
      ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(selectedSymptom);

  // Phase 1D: Joint/ROM detection - shoulder, knee, hip, ankle, elbow, wrist conditions
  const isJointSelected = selectedSymptom?.startsWith('shoulder-') ||
      selectedSymptom?.startsWith('knee-') ||
      selectedSymptom?.startsWith('hip-') ||
      selectedSymptom?.startsWith('ankle-') ||
      selectedSymptom?.startsWith('elbow-') ||
      selectedSymptom?.startsWith('wrist-') ||
      selectedSymptom?.startsWith('hand-') ||
      selectedSymptom?.startsWith('finger-') ||
      selectedSymptom?.startsWith('foot-') ||
      selectedSymptom?.startsWith('toe-') ||
      selectedSymptom?.includes('joint') ||
      selectedSymptom?.includes('arthritis') ||
      selectedSymptom?.includes('bursitis') ||
      selectedSymptom?.includes('tendinitis') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(selectedSymptom);

  // Phase 1E: Seizure/Episode detection - epilepsy, seizure disorders
  const isSeizureSelected = selectedSymptom?.includes('seizure') ||
      selectedSymptom?.includes('epilep') ||
      selectedSymptom?.includes('convuls') ||
      selectedSymptom?.startsWith('seizure-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(selectedSymptom);

  // Phase 2: Eye & Vision detection
  const isEyeRelated = selectedSymptom?.includes('vision') ||
      selectedSymptom?.includes('eye') ||
      selectedSymptom?.includes('glaucoma') ||
      selectedSymptom?.includes('retinopathy') ||
      selectedSymptom?.includes('macular') ||
      ['floaters', 'diplopia', 'photophobia', 'night-blindness', 'light-sensitivity',
       'double-vision', 'color-vision-changes', 'dry-eyes', 'eye-strain', 'eye-pain',
       'peripheral-vision-loss', 'diabetic-retinopathy', 'glaucoma-symptoms'].includes(selectedSymptom);

  // Phase 3: Genitourinary detection
  const isGenitourinaryRelated = selectedSymptom?.includes('kidney') ||
      selectedSymptom?.includes('urinary') ||
      selectedSymptom?.includes('prostate') ||
      selectedSymptom?.includes('bladder') ||
      selectedSymptom?.includes('urine') ||
      selectedSymptom?.includes('renal') ||
      selectedSymptom?.includes('fecal-incontinence') ||
      selectedSymptom?.includes('erectile') ||
      selectedSymptom?.includes('testicular') ||
      selectedSymptom?.includes('genital') ||
      ['kidney-stones', 'kidney-pain', 'blood-in-urine', 'kidney-infection',
       'renal-swelling', 'renal-fatigue', 'renal-nausea', 'decreased-urination',
       'foamy-urine', 'high-blood-pressure', 'urinary-frequency', 'urinary-urgency',
       'painful-urination', 'urinary-incontinence', 'urine-retention', 'weak-stream',
       'hesitancy', 'nocturia', 'bladder-pain', 'recurrent-uti', 'incomplete-emptying',
       'prostate-symptoms', 'prostate-pain', 'erectile-dysfunction', 'testicular-pain',
       'genital-pain', 'fecal-incontinence', 'bowel-urgency', 'bowel-frequency'].includes(selectedSymptom);

  // Reset condition-specific data when symptom changes
  useEffect(() => {
    // Phase 1H: Skip reset during prefill operation
    if (isPrefilling.current) {
      console.log('⏭️ Skipping reset - prefill in progress');
      return;
    }

    if (!isMigraineSelected) {
      setMigraineData({
        duration: '', prostrating: null, aura: false, nausea: false,
        lightSensitivity: false, soundSensitivity: false, triggers: '',
      });
    }
    if (!isSleepSelected && !isNightmareSelected) {
      setSleepData({
        hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
        troubleStayingAsleep: false, nightmares: false, feelRested: null,
      });
    }
    if (!isPTSDRelated) {
      setPtsdData({
        flashbacks: false, avoidance: false, emotionalNumbering: false,
        hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
        triggerDescription: '',
      });
    }
    if (!isPainSelected) {
      setPainData({
        painLocation: '', radiating: false, radiatingTo: '',
        limitedRangeOfMotion: false, affectedActivities: [], painType: '', flareUp: false,
      });
    }
    // Phase 1B: Reset GI data
    if (!isGISelected) {
      setGIData({
        bristolScale: null, frequencyPerDay: '', urgencyLevel: '',
        bloodPresent: null, bloatingSeverity: '', abdominalPainLocation: '',
        mealRelated: null, nighttimeSymptoms: false,
      });
    }
    if (!isRespiratorySelected) {
      setRespiratoryData({
        rescueInhalerUsed: null, inhalerPuffs: '', peakFlow: '', spo2: '',
        activityTrigger: '', wheezing: false, chestTightness: false, coughing: false,
      });
    }
    if (!isJointSelected) {
      setJointData({
        joint: '', side: '', romEstimate: '', morningStiffness: '',
        swelling: false, instability: false, locking: false, grinding: false,
      });
    }
    if (!isSeizureSelected) {
      setSeizureData({
        episodeType: '', duration: '', lossOfConsciousness: null,
        auraPresent: null, recoveryTime: '', witnessPresent: null,
      });
    }
    // Phase 2: Reset eye data
    if (!isEyeRelated) {
      setEyeData({
        affectedEye: '', leftEyeAcuity: '', rightEyeAcuity: '',
        symptoms: [], fieldOfVision: [], affectedActivities: [],
        triggeringFactors: '', associatedConditions: [],
      });
    }
    // Phase 3: Reset genitourinary data
    if (!isGenitourinaryRelated) {
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
    }

  }, [selectedSymptom, isMigraineSelected, isSleepSelected,
            isNightmareSelected, isPTSDRelated, isPainSelected,
            isGISelected, isRespiratorySelected, isJointSelected,
            isSeizureSelected, isEyeRelated, isGenitourinaryRelated]);

  // Phase 3: Detect genitourinary system based on symptom
  useEffect(() => {
    if (isPrefilling.current) return;

    if (isGenitourinaryRelated) {
      const kidneySymptoms = ['kidney-stones', 'kidney-pain', 'blood-in-urine', 'kidney-infection',
                              'renal-swelling', 'renal-fatigue', 'renal-nausea', 'decreased-urination',
                              'foamy-urine', 'high-blood-pressure'];

      const bladderSymptoms = ['urinary-frequency', 'urinary-urgency', 'painful-urination',
                               'urinary-incontinence', 'urine-retention', 'weak-stream',
                               'hesitancy', 'nocturia', 'bladder-pain', 'recurrent-uti',
                               'incomplete-emptying'];

      const prostateSymptoms = ['prostate-symptoms', 'prostate-pain'];
      const reproductiveSymptoms = ['erectile-dysfunction', 'testicular-pain', 'genital-pain'];
      const sphincterSymptoms = ['fecal-incontinence', 'bowel-urgency', 'bowel-frequency'];

      let system = '';
      if (kidneySymptoms.includes(selectedSymptom)) system = 'kidney';
      else if (bladderSymptoms.includes(selectedSymptom)) system = 'bladder';
      else if (prostateSymptoms.includes(selectedSymptom)) system = 'prostate';
      else if (reproductiveSymptoms.includes(selectedSymptom)) system = 'reproductive';
      else if (sphincterSymptoms.includes(selectedSymptom)) system = 'sphincter';

      if (system && genitourinaryData.affectedSystem !== system) {
        setGenitourinaryData(prev => ({ ...prev, affectedSystem: system }));
      }
    }
  }, [selectedSymptom, isGenitourinaryRelated]);

  // Build categories list including custom symptoms
  const getAllCategories = () => {
    const categories = sortedSymptomCategories.map(cat => ({
      ...cat,
      symptoms: [...cat.symptoms]
    }));

    const customByCategory = {};
    customSymptoms.forEach(symptom => {
      if (!customByCategory[symptom.category]) {
        customByCategory[symptom.category] = [];
      }
      customByCategory[symptom.category].push(symptom);
    });

    Object.entries(customByCategory).forEach(([categoryName, symptoms]) => {
      const existingCategory = categories.find(c => c.name === categoryName);
      if (existingCategory) {
        existingCategory.symptoms = [...existingCategory.symptoms, ...symptoms];
      } else {
        categories.push({
          id: `custom-${categoryName.toLowerCase()}`,
          name: categoryName,
          symptoms: symptoms,
        });
      }
    });

    return categories;
  };

  const allCategories = getAllCategories();

  // Get symptoms for the selected category
  const getSymptomsForCategory = () => {
    if (!selectedCategory) return [];
    const category = allCategories.find(cat => cat.id === selectedCategory);
    return category ? category.symptoms : [];
  };

  const availableSymptoms = getSymptomsForCategory();

  // Handle category change - reset symptom selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSymptom('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSymptom) return;

    if (isMigraineSelected && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating (incapacitating)');
      return;
    }

    const symptomData = allCategories
    .flatMap(cat => cat.symptoms.map(s => ({ ...s, category: cat.name })))
    .find(s => s.id === selectedSymptom);

    const entry = {
      symptomId: selectedSymptom,
      symptomName: symptomData?.name || selectedSymptom,
      category: symptomData?.category || 'Other',
      severity,
      notes: notes.trim(),
      isCustomSymptom: symptomData?.isCustom || false,
      // PHASE 1A: Universal fields
      isFlareUp,
      duration: duration || null,
      timeOfDay: timeOfDay || null,
    };

    // Add condition-specific data
    if (isMigraineSelected) {
      entry.migraineData = { ...migraineData };
    }
    if (isSleepSelected || isNightmareSelected) {
      entry.sleepData = { ...sleepData };
    }
    if (isPTSDRelated) {
      entry.ptsdData = { ...ptsdData };
    }
    if (isPainSelected) {
      entry.painData = { ...painData };
    }
    // Phase 1B: Add GI data
    if (isGISelected) {
      entry.giData = { ...giData };
    }
    if (isRespiratorySelected) {
      entry.respiratoryData = { ...respiratoryData };
    }
    if (isJointSelected) {
      entry.jointData = { ...jointData };
    }
    if (isSeizureSelected) {
      entry.seizureData = { ...seizureData };
    }
    // Phase 2: Add eye data
    if (isEyeRelated) {
      entry.eyeData = { ...eyeData };
    }
    // Phase 3: Add Genitourinary Data
    if (isGenitourinaryRelated) {
      entry.genitourinaryData = { ...genitourinaryData };
    }

    const savedEntry = saveSymptomLog(entry);

    // Log medications if taken
    if (tookMedication && selectedMedications.length > 0) {
      selectedMedications.forEach(medId => {
        const med = medications.find(m => m.id === medId);
        if (med) {
          logMedicationTaken({
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            takenFor: entry.symptomName,
            symptomLogId: entry.id,
          });
        }
      });
    }

    // Reset form
    setSelectedCategory('');
    setSelectedSymptom('');
    setSeverity(5);
    setNotes('');
    setTookMedication(false);
    setSelectedMedications([]);
    // Reset universal fields
    setIsFlareUp(false);
    setDuration('');
    setTimeOfDay('');

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (onLogSaved) onLogSaved();
  };

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    setCustomError('');

    if (!newSymptomName.trim()) {
      setCustomError('Please enter a symptom name');
      return;
    }

    const result = addCustomSymptom(newSymptomName, newSymptomCategory);

    if (result.success) {
      setCustomSymptoms(getCustomSymptoms());
      const categoryId = sortedSymptomCategories.find(c => c.name === newSymptomCategory)?.id
          || `custom-${newSymptomCategory.toLowerCase()}`;
      setSelectedCategory(categoryId);
      setSelectedSymptom(result.symptom.id);
      setNewSymptomName('');
      setNewSymptomCategory('Custom');
      setShowCustomForm(false);
    } else {
      setCustomError(result.message);
    }
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600 dark:text-green-400' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500 dark:text-red-400' };
    return { label: 'Extreme', color: 'text-red-700 dark:text-red-300' };
  };

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
  };

  // Bristol Scale descriptions for user reference
  const bristolDescriptions = {
    1: 'Separate hard lumps (severe constipation)',
    2: 'Lumpy, sausage-shaped (mild constipation)',
    3: 'Sausage with cracks (normal)',
    4: 'Smooth, soft sausage (ideal)',
    5: 'Soft blobs with clear edges (lacking fiber)',
    6: 'Mushy with ragged edges (mild diarrhea)',
    7: 'Watery, no solid pieces (severe diarrhea)',
  };

  const severityInfo = getSeverityInfo(severity);

  return (
      <div className="pb-20">
        {/* Quick Log Section */}
        <QuickLog
            key={refreshQuickLog}
            onLogSaved={onLogSaved}
            onAddChronic={() => setShowChronicModal(true)}
        />

        {/* Add Chronic Symptom Modal */}
        <AddChronicModal
            isOpen={showChronicModal}
            onClose={() => setShowChronicModal(false)}
            onAdded={() => setRefreshQuickLog(prev => prev + 1)}
        />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or log with details</span>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center">
              ✓ Symptom logged successfully
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-Step Symptom Selection */}
          <div className="space-y-4">
            {/* Step 1: Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                1. Select Category
              </label>
              <select
                  value={selectedCategory}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_CUSTOM') {
                      setShowCustomForm(true);
                      setSelectedCategory('');
                    } else {
                      handleCategoryChange(e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category...</option>
                {allCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.symptoms.length})
                    </option>
                ))}
                <option value="ADD_CUSTOM">+ Add Custom Symptom</option>
              </select>
            </div>

            {/* Step 2: Symptom Selection */}
            {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    2. Select Symptom
                  </label>
                  <select
                      value={selectedSymptom}
                      onChange={(e) => setSelectedSymptom(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                  >
                    <option value="">Select a symptom...</option>
                    {availableSymptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                          {symptom.name} {symptom.isCustom ? '(custom)' : ''}
                        </option>
                    ))}
                  </select>
                </div>
            )}
          </div>

          {/* Custom Symptom Form */}
          {showCustomForm && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-3">Add Custom Symptom</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Symptom Name</label>
                    <input
                        type="text"
                        value={newSymptomName}
                        onChange={(e) => setNewSymptomName(e.target.value)}
                        placeholder="e.g., Plantar Fasciitis"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                        value={newSymptomCategory}
                        onChange={(e) => setNewSymptomCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {sortedSymptomCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  {customError && <p className="text-red-600 dark:text-red-400 text-sm">{customError}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddCustomSymptom}
                            className="flex-1 py-2 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">
                      Add Symptom
                    </button>
                    <button type="button"
                            onClick={() => { setShowCustomForm(false); setNewSymptomName(''); setCustomError(''); }}
                            className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* ============================================ */}
          {/* PHASE 1A: UNIVERSAL ENHANCEMENT FIELDS */}
          {/* ============================================ */}
          {selectedSymptom && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📋</span> Symptom Details
                </h3>

                {/* Flare-Up Toggle */}
                <div>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isFlareUp
                          ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={isFlareUp}
                        onChange={(e) => setIsFlareUp(e.target.checked)}
                        className="w-5 h-5 text-orange-600 rounded"
                    />
                    <div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        🔥 This is a flare-up
                                    </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Symptom is worse than usual baseline
                      </p>
                    </div>
                  </label>
                </div>

                {/* Duration and Time of Day */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">How long?</option>
                      <option value="just-started">Just started</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months+</option>
                      <option value="ongoing">Ongoing/Chronic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time of Day
                    </label>
                    <select
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">When?</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                      <option value="all-day">All Day</option>
                      <option value="varies">Varies</option>
                    </select>
                  </div>
                </div>
              </div>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: GI CONDITION-SPECIFIC FORM */}
          {/* For IBS, GERD, UC, peptic ulcer, hemorrhoids, diverticulitis */}
          {/* ============================================ */}
          {isGISelected && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                <h3 className="font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>🩺</span> GI Symptom Details
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Track details for VA rating documentation
                </p>

                {/* Bristol Stool Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bristol Stool Scale (if applicable)
                  </label>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setGIData(prev => ({ ...prev, bristolScale: num }))}
                            className={`py-2 px-1 rounded-lg border-2 font-bold text-sm transition-all ${
                                giData.bristolScale === num
                                    ? num <= 2 ? 'bg-orange-200 dark:bg-orange-900 border-orange-500 text-orange-800 dark:text-orange-200'
                                        : num <= 4 ? 'bg-green-200 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200'
                                            : 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                  {giData.bristolScale && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded">
                        Type {giData.bristolScale}: {bristolDescriptions[giData.bristolScale]}
                      </p>
                  )}
                  <button
                      type="button"
                      onClick={() => setGIData(prev => ({ ...prev, bristolScale: null }))}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
                  >
                    Clear selection
                  </button>
                </div>

                {/* Frequency and Urgency Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Episodes Today
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="50"
                        value={giData.frequencyPerDay}
                        onChange={(e) => setGIData(prev => ({ ...prev, frequencyPerDay: e.target.value }))}
                        placeholder="# times"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Urgency Level
                    </label>
                    <select
                        value={giData.urgencyLevel}
                        onChange={(e) => setGIData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="none">None</option>
                      <option value="mild">Mild - Can wait</option>
                      <option value="moderate">Moderate - Need to go soon</option>
                      <option value="severe">Severe - Must go immediately</option>
                      <option value="incontinence">Incontinence</option>
                    </select>
                  </div>
                </div>

                {/* Blood Present */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Present?
                  </label>
                  <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setGIData(prev => ({ ...prev, bloodPresent: true }))}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                            giData.bloodPresent === true
                                ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setGIData(prev => ({ ...prev, bloodPresent: false }))}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                            giData.bloodPresent === false
                                ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Bloating Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bloating Severity
                  </label>
                  <select
                      value={giData.bloatingSeverity}
                      onChange={(e) => setGIData(prev => ({ ...prev, bloatingSeverity: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select...</option>
                    <option value="none">None</option>
                    <option value="mild">Mild - Noticeable but not bothersome</option>
                    <option value="moderate">Moderate - Uncomfortable</option>
                    <option value="severe">Severe - Pants don't fit / visible distension</option>
                  </select>
                </div>

                {/* Abdominal Pain Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pain Location (if applicable)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upper-left', label: 'Upper Left' },
                      { id: 'upper-center', label: 'Upper Center' },
                      { id: 'upper-right', label: 'Upper Right' },
                      { id: 'lower-left', label: 'Lower Left' },
                      { id: 'lower-center', label: 'Lower Center' },
                      { id: 'lower-right', label: 'Lower Right' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setGIData(prev => ({
                              ...prev,
                              abdominalPainLocation: prev.abdominalPainLocation === id ? '' : id
                            }))}
                            className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                                giData.abdominalPainLocation === id
                                    ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {label}
                        </button>
                    ))}
                  </div>
                  <button
                      type="button"
                      onClick={() => setGIData(prev => ({ ...prev, abdominalPainLocation: 'diffuse' }))}
                      className={`w-full mt-2 py-2 px-4 rounded-lg border text-sm font-medium ${
                          giData.abdominalPainLocation === 'diffuse'
                              ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    Diffuse / All Over
                  </button>
                </div>

                {/* Additional Toggles */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      giData.mealRelated === true
                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={giData.mealRelated === true}
                        onChange={(e) => setGIData(prev => ({ ...prev, mealRelated: e.target.checked ? true : null }))}
                        className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Worse after eating</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      giData.nighttimeSymptoms
                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={giData.nighttimeSymptoms}
                        onChange={(e) => setGIData(prev => ({ ...prev, nighttimeSymptoms: e.target.checked }))}
                        className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Woken up by symptoms (nighttime)</span>
                  </label>
                </div>
              </div>
          )}

          {/* Migraine-Specific Fields */}
          {isMigraineSelected && (
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                <h3 className="font-medium text-purple-900 dark:text-purple-200">Migraine Details</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300">These details align with VA rating criteria</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                  <select value={migraineData.duration}
                          onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Select duration...</option>
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
                    Was this migraine prostrating? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Prostrating = unable to perform normal activities</p>
                  <div className="flex gap-3">
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === true
                                    ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                      Yes, prostrating
                    </button>
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === false
                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Symptoms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'aura', label: 'Aura' },
                      { key: 'nausea', label: 'Nausea' },
                      { key: 'lightSensitivity', label: 'Light sensitivity' },
                      { key: 'soundSensitivity', label: 'Sound sensitivity' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            migraineData[key] ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={migraineData[key]}
                                 onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-purple-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Known Triggers</label>
                  <input type="text" value={migraineData.triggers}
                         onChange={(e) => setMigraineData(prev => ({ ...prev, triggers: e.target.value }))}
                         placeholder="e.g., stress, bright lights"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
          )}

          {/* Sleep-Specific Fields */}
          {(isSleepSelected || isNightmareSelected) && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Sleep Details</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">Track sleep patterns for VA claims documentation</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Slept</label>
                    <input type="number" min="0" max="24" step="0.5"
                           value={sleepData.hoursSlept}
                           onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                           placeholder="Hours"
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Times Woken Up</label>
                    <input type="number" min="0" max="20"
                           value={sleepData.wakeUps}
                           onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                           placeholder="Times"
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Quality: {sleepData.quality}/10
                  </label>
                  <input type="range" min="0" max="10" value={sleepData.quality}
                         onChange={(e) => setSleepData(prev => ({ ...prev, quality: Number(e.target.value) }))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sleep Issues</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
                      { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
                      { key: 'nightmares', label: 'Nightmares/night terrors' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            sleepData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={sleepData[key]}
                                 onChange={(e) => setSleepData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feel rested upon waking?</label>
                  <div className="flex gap-3">
                    <button type="button"
                            onClick={() => setSleepData(prev => ({ ...prev, feelRested: true }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                sleepData.feelRested === true
                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>Yes</button>
                    <button type="button"
                            onClick={() => setSleepData(prev => ({ ...prev, feelRested: false }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                sleepData.feelRested === false
                                    ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>No</button>
                  </div>
                </div>
              </div>
          )}

          {/* PTSD-Related Fields */}
          {isPTSDRelated && (
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                <h3 className="font-medium text-amber-900 dark:text-amber-200">Mental Health Details</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">These align with PTSD rating criteria</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Experiences</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'flashbacks', label: 'Flashbacks' },
                      { key: 'intrusiveThoughts', label: 'Intrusive thoughts' },
                      { key: 'avoidance', label: 'Avoidance of triggers/situations' },
                      { key: 'emotionalNumbering', label: 'Emotional numbness' },
                      { key: 'hypervigilance', label: 'Hypervigilance' },
                      { key: 'exaggeratedStartle', label: 'Exaggerated startle response' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            ptsdData[key] ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={ptsdData[key]}
                                 onChange={(e) => setPtsdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-amber-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trigger (if known)
                  </label>
                  <input type="text" value={ptsdData.triggerDescription}
                         onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                         placeholder="What triggered this episode?"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
          )}

          {/* Phase 1C: Respiratory Form */}
          {isRespiratorySelected && (
              <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800 space-y-4">
                <h3 className="font-medium text-sky-900 dark:text-sky-200">Respiratory Details</h3>
                <p className="text-xs text-sky-700 dark:text-sky-300">Track breathing symptoms for VA claims</p>

                {/* Rescue Inhaler */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Did you use a rescue inhaler?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: true }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            respiratoryData.rescueInhalerUsed === true
                                ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: false, inhalerPuffs: '' }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            respiratoryData.rescueInhalerUsed === false
                                ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Inhaler Puffs (if yes) */}
                {respiratoryData.rescueInhalerUsed === true && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        How many puffs?
                      </label>
                      <input
                          type="number"
                          min="1"
                          max="20"
                          value={respiratoryData.inhalerPuffs}
                          onChange={(e) => setRespiratoryData(prev => ({ ...prev, inhalerPuffs: e.target.value }))}
                          placeholder="e.g., 2"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                )}

                {/* Peak Flow & SpO2 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peak Flow (L/min)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="800"
                        value={respiratoryData.peakFlow}
                        onChange={(e) => setRespiratoryData(prev => ({ ...prev, peakFlow: e.target.value }))}
                        placeholder="Optional"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SpO2 (%)
                    </label>
                    <input
                        type="number"
                        min="70"
                        max="100"
                        value={respiratoryData.spo2}
                        onChange={(e) => setRespiratoryData(prev => ({ ...prev, spo2: e.target.value }))}
                        placeholder="Optional"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Activity Trigger */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What triggered symptoms?
                  </label>
                  <select
                      value={respiratoryData.activityTrigger}
                      onChange={(e) => setRespiratoryData(prev => ({ ...prev, activityTrigger: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select trigger...</option>
                    <option value="rest">At rest</option>
                    <option value="mild">Mild exertion (walking)</option>
                    <option value="moderate">Moderate exertion (stairs, housework)</option>
                    <option value="severe">Severe exertion (running, heavy lifting)</option>
                  </select>
                </div>

                {/* Symptom Toggles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Associated Symptoms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        respiratoryData.wheezing
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={respiratoryData.wheezing}
                          onChange={(e) => setRespiratoryData(prev => ({ ...prev, wheezing: e.target.checked }))}
                          className="w-4 h-4 text-sky-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Wheezing</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        respiratoryData.chestTightness
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={respiratoryData.chestTightness}
                          onChange={(e) => setRespiratoryData(prev => ({ ...prev, chestTightness: e.target.checked }))}
                          className="w-4 h-4 text-sky-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Chest Tightness</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        respiratoryData.coughing
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={respiratoryData.coughing}
                          onChange={(e) => setRespiratoryData(prev => ({ ...prev, coughing: e.target.checked }))}
                          className="w-4 h-4 text-sky-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Coughing</span>
                    </label>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 1D: Joint/ROM Form */}
          {isJointSelected && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Joint & ROM Details</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">Document joint limitations for VA claims</p>

                {/* Joint Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Which Joint?
                    </label>
                    <select
                        value={jointData.joint}
                        onChange={(e) => setJointData(prev => ({ ...prev, joint: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select joint...</option>
                      <option value="shoulder">Shoulder</option>
                      <option value="elbow">Elbow</option>
                      <option value="wrist">Wrist</option>
                      <option value="hand">Hand</option>
                      <option value="finger">Finger</option>
                      <option value="hip">Hip</option>
                      <option value="knee">Knee</option>
                      <option value="ankle">Ankle</option>
                      <option value="foot">Foot</option>
                      <option value="toe">Toe</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Side
                    </label>
                    <select
                        value={jointData.side}
                        onChange={(e) => setJointData(prev => ({ ...prev, side: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select side...</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="bilateral">Both (Bilateral)</option>
                    </select>
                  </div>
                </div>

                {/* ROM Estimate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Range of Motion
                  </label>
                  <select
                      value={jointData.romEstimate}
                      onChange={(e) => setJointData(prev => ({ ...prev, romEstimate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select ROM...</option>
                    <option value="full">Full range of motion</option>
                    <option value="slightly">Slightly limited</option>
                    <option value="moderately">Moderately limited</option>
                    <option value="severely">Severely limited</option>
                  </select>
                </div>

                {/* Morning Stiffness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Morning Stiffness
                  </label>
                  <select
                      value={jointData.morningStiffness}
                      onChange={(e) => setJointData(prev => ({ ...prev, morningStiffness: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select duration...</option>
                    <option value="none">None</option>
                    <option value="minutes">Less than 30 minutes</option>
                    <option value="30-60min">30-60 minutes</option>
                    <option value="hours">More than 1 hour</option>
                  </select>
                </div>

                {/* Joint Symptoms Toggles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Associated Symptoms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        jointData.swelling
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={jointData.swelling}
                          onChange={(e) => setJointData(prev => ({ ...prev, swelling: e.target.checked }))}
                          className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Swelling</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        jointData.instability
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={jointData.instability}
                          onChange={(e) => setJointData(prev => ({ ...prev, instability: e.target.checked }))}
                          className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Instability</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        jointData.locking
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={jointData.locking}
                          onChange={(e) => setJointData(prev => ({ ...prev, locking: e.target.checked }))}
                          className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Locking/Catching</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        jointData.grinding
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input
                          type="checkbox"
                          checked={jointData.grinding}
                          onChange={(e) => setJointData(prev => ({ ...prev, grinding: e.target.checked }))}
                          className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Grinding/Crepitus</span>
                    </label>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 1E: Seizure/Episode Form */}
          {isSeizureSelected && (
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                <h3 className="font-medium text-purple-900 dark:text-purple-200">Seizure/Episode Details</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300">Document episode characteristics for VA claims</p>

                {/* Episode Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Episode Type
                  </label>
                  <select
                      value={seizureData.episodeType}
                      onChange={(e) => setSeizureData(prev => ({ ...prev, episodeType: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select type...</option>
                    <option value="generalized">Generalized (Tonic-Clonic/Grand Mal)</option>
                    <option value="partial">Partial/Focal</option>
                    <option value="absence">Absence (Petit Mal)</option>
                    <option value="psychogenic">Psychogenic Non-Epileptic</option>
                    <option value="other">Other/Unknown</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration of Episode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={seizureData.duration}
                        onChange={(e) => setSeizureData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Duration"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <select
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled
                    >
                      <option>seconds</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Approximate duration in seconds</p>
                </div>

                {/* Loss of Consciousness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loss of Consciousness?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'yes' }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.lossOfConsciousness === 'yes'
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'partial' }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.lossOfConsciousness === 'partial'
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Partial
                    </button>
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'no' }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.lossOfConsciousness === 'no'
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Aura/Warning Signs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Did you have warning signs (aura)?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, auraPresent: true }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.auraPresent === true
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, auraPresent: false }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.auraPresent === false
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Recovery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recovery Time
                  </label>
                  <select
                      value={seizureData.recoveryTime}
                      onChange={(e) => setSeizureData(prev => ({ ...prev, recoveryTime: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select recovery time...</option>
                    <option value="immediate">Immediate (&lt; 5 minutes)</option>
                    <option value="minutes">5-30 minutes</option>
                    <option value="30-60min">30-60 minutes</option>
                    <option value="hours">1-4 hours</option>
                    <option value="prolonged">More than 4 hours</option>
                  </select>
                </div>

                {/* Witness Present */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Was there a witness present?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, witnessPresent: true }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.witnessPresent === true
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setSeizureData(prev => ({ ...prev, witnessPresent: false }))}
                        className={`p-2 rounded-lg border transition-colors ${
                            seizureData.witnessPresent === false
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Witness statements strengthen VA claims</p>
                </div>
              </div>
          )}

          {/* Pain-Specific Fields */}
          {isPainSelected && (
              <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                <h3 className="font-medium text-rose-900 dark:text-rose-200">Pain Details</h3>
                <p className="text-xs text-rose-700 dark:text-rose-300">Document impact on daily activities for VA claims</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Type</label>
                  <select value={painData.painType}
                          onChange={(e) => setPainData(prev => ({ ...prev, painType: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Select type...</option>
                    <option value="sharp">Sharp/Stabbing</option>
                    <option value="dull">Dull/Aching</option>
                    <option value="burning">Burning</option>
                    <option value="throbbing">Throbbing</option>
                    <option value="shooting">Shooting</option>
                    <option value="stiff">Stiffness</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      painData.radiating ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input type="checkbox" checked={painData.radiating}
                           onChange={(e) => setPainData(prev => ({ ...prev, radiating: e.target.checked }))}
                           className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Radiating pain</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      painData.limitedRangeOfMotion ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input type="checkbox" checked={painData.limitedRangeOfMotion}
                           onChange={(e) => setPainData(prev => ({ ...prev, limitedRangeOfMotion: e.target.checked }))}
                           className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Limited ROM</span>
                  </label>
                </div>

                {painData.radiating && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Radiates to</label>
                      <input type="text" value={painData.radiatingTo}
                             onChange={(e) => setPainData(prev => ({ ...prev, radiatingTo: e.target.value }))}
                             placeholder="e.g., down left leg, into shoulder"
                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities Affected</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'].map(activity => (
                        <label key={activity} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            painData.affectedActivities.includes(activity) ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={painData.affectedActivities.includes(activity)}
                                 onChange={() => toggleActivity(activity)}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Phase 3: Genitourinary Details */}
          {isGenitourinaryRelated && (
              <div className="space-y-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="font-medium text-teal-900 dark:text-teal-200">Genitourinary Details</h3>

                {/* KIDNEY/RENAL SYSTEM */}
                {genitourinaryData.affectedSystem === 'kidney' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kidney Symptoms</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Flank Pain', 'Hematuria', 'Oliguria', 'Polyuria', 'Nausea', 'Fatigue', 'Edema', 'Fever'].map(symptom => (
                              <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  genitourinaryData.kidneySymptoms.includes(symptom) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.kidneySymptoms.includes(symptom)}
                                       onChange={() => {
                                         setGenitourinaryData(prev => ({
                                           ...prev,
                                           kidneySymptoms: prev.kidneySymptoms.includes(symptom)
                                               ? prev.kidneySymptoms.filter(s => s !== symptom)
                                               : [...prev.kidneySymptoms, symptom]
                                         }));
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      {genitourinaryData.kidneySymptoms.includes('Flank Pain') && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Location</label>
                              <select value={genitourinaryData.kidneyPainLocation}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, kidneyPainLocation: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select location</option>
                                <option value="left-flank">Left Flank</option>
                                <option value="right-flank">Right Flank</option>
                                <option value="bilateral">Both Flanks</option>
                                <option value="lower-back">Lower Back</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pain Severity: {genitourinaryData.kidneyPainSeverity}/10
                              </label>
                              <input type="range" min="1" max="10" value={genitourinaryData.kidneyPainSeverity}
                                     onChange={(e) => setGenitourinaryData(prev => ({ ...prev, kidneyPainSeverity: Number(e.target.value) }))}
                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>
                          </>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                            genitourinaryData.stoneEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={genitourinaryData.stoneEpisode}
                                 onChange={(e) => setGenitourinaryData(prev => ({ ...prev, stoneEpisode: e.target.checked }))}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kidney Stone Episode</span>
                        </label>

                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                            genitourinaryData.stonePassedToday ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={genitourinaryData.stonePassedToday}
                                 onChange={(e) => setGenitourinaryData(prev => ({ ...prev, stonePassedToday: e.target.checked }))}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Passed Stone Today</span>
                        </label>
                      </div>

                      {genitourinaryData.stonePassedToday && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stone Size (mm)</label>
                            <input type="number" value={genitourinaryData.stoneSize}
                                   onChange={(e) => setGenitourinaryData(prev => ({ ...prev, stoneSize: e.target.value }))}
                                   placeholder="e.g., 4"
                                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                          </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Procedure</label>
                        <select value={genitourinaryData.procedureRecent}
                                onChange={(e) => setGenitourinaryData(prev => ({ ...prev, procedureRecent: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                          <option value="">None</option>
                          <option value="lithotripsy">Lithotripsy (ESWL)</option>
                          <option value="ureteroscopy">Ureteroscopy</option>
                          <option value="stent-placed">Ureteral Stent Placed</option>
                          <option value="stent-removed">Stent Removed</option>
                          <option value="nephrostomy">Nephrostomy Tube</option>
                        </select>
                      </div>

                      {genitourinaryData.procedureRecent && genitourinaryData.procedureRecent !== '' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Procedure Date</label>
                            <input type="date" value={genitourinaryData.procedureDate}
                                   onChange={(e) => setGenitourinaryData(prev => ({ ...prev, procedureDate: e.target.value }))}
                                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                          </div>
                      )}

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.dialysis ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.dialysis}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, dialysis: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">On Dialysis</span>
                      </label>

                      {genitourinaryData.dialysis && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dialysis Type</label>
                              <select value={genitourinaryData.dialysisType}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, dialysisType: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select type</option>
                                <option value="hemodialysis">Hemodialysis</option>
                                <option value="peritoneal">Peritoneal Dialysis</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                              <select value={genitourinaryData.dialysisFrequency}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, dialysisFrequency: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select frequency</option>
                                <option value="three-times-week">3 times per week</option>
                                <option value="four-times-week">4 times per week</option>
                                <option value="daily">Daily</option>
                              </select>
                            </div>
                          </>
                      )}
                    </>
                )}

                {/* BLADDER/VOIDING SYSTEM */}
                {genitourinaryData.affectedSystem === 'bladder' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voiding Symptoms</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Frequency', 'Urgency', 'Hesitancy', 'Weak Stream', 'Incomplete Emptying', 'Nocturia', 'Pain', 'Burning'].map(symptom => (
                              <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  genitourinaryData.voidingSymptoms.includes(symptom) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.voidingSymptoms.includes(symptom)}
                                       onChange={() => {
                                         setGenitourinaryData(prev => ({
                                           ...prev,
                                           voidingSymptoms: prev.voidingSymptoms.includes(symptom)
                                               ? prev.voidingSymptoms.filter(s => s !== symptom)
                                               : [...prev.voidingSymptoms, symptom]
                                         }));
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urinary Frequency (24h)</label>
                          <input type="number" value={genitourinaryData.urinaryFrequency24h}
                                 onChange={(e) => setGenitourinaryData(prev => ({ ...prev, urinaryFrequency24h: e.target.value }))}
                                 placeholder="# of times"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nocturia Count</label>
                          <input type="number" value={genitourinaryData.nocturiaCount}
                                 onChange={(e) => setGenitourinaryData(prev => ({ ...prev, nocturiaCount: e.target.value }))}
                                 placeholder="# waking to void"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                        </div>
                      </div>

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.incontinenceEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.incontinenceEpisode}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, incontinenceEpisode: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Incontinence Episode Today</span>
                      </label>

                      {genitourinaryData.incontinenceEpisode && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Incontinence Type</label>
                              <select value={genitourinaryData.incontinenceType}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, incontinenceType: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select type</option>
                                <option value="stress">Stress (coughing, sneezing)</option>
                                <option value="urge">Urge (sudden need)</option>
                                <option value="overflow">Overflow (retention)</option>
                                <option value="mixed">Mixed</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leakage Amount</label>
                              <select value={genitourinaryData.incontinenceLeakageAmount}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, incontinenceLeakageAmount: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select amount</option>
                                <option value="drops">Drops only</option>
                                <option value="small">Small amount</option>
                                <option value="moderate">Moderate amount</option>
                                <option value="large">Large amount (complete voiding)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pad/Diaper Changes Required</label>
                              <input type="number" value={genitourinaryData.padChangesRequired}
                                     onChange={(e) => setGenitourinaryData(prev => ({ ...prev, padChangesRequired: e.target.value }))}
                                     placeholder="# of changes today"
                                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                            </div>
                          </>
                      )}

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.catheterUse ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.catheterUse}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, catheterUse: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Using Catheter</span>
                      </label>

                      {genitourinaryData.catheterUse && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Catheter Type</label>
                              <select value={genitourinaryData.catheterType}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, catheterType: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select type</option>
                                <option value="intermittent">Intermittent (self-cath)</option>
                                <option value="indwelling">Indwelling (Foley)</option>
                                <option value="suprapubic">Suprapubic</option>
                              </select>
                            </div>

                            {genitourinaryData.catheterType === 'intermittent' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catheterizations Per Day</label>
                                  <input type="number" value={genitourinaryData.catheterizationsPerDay}
                                         onChange={(e) => setGenitourinaryData(prev => ({ ...prev, catheterizationsPerDay: e.target.value }))}
                                         placeholder="# of times"
                                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                                </div>
                            )}
                          </>
                      )}

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.uti ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.uti}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, uti: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">UTI Symptoms</span>
                      </label>

                      {genitourinaryData.uti && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UTI Symptoms</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Burning', 'Fever', 'Cloudy Urine', 'Foul Odor', 'Blood', 'Pelvic Pain'].map(symptom => (
                                  <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                      genitourinaryData.utiSymptoms.includes(symptom) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.utiSymptoms.includes(symptom)}
                                           onChange={() => {
                                             setGenitourinaryData(prev => ({
                                               ...prev,
                                               utiSymptoms: prev.utiSymptoms.includes(symptom)
                                                   ? prev.utiSymptoms.filter(s => s !== symptom)
                                                   : [...prev.utiSymptoms, symptom]
                                             }));
                                           }}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                                  </label>
                              ))}
                            </div>
                          </div>
                      )}
                    </>
                )}

                {/* PROSTATE SYSTEM */}
                {genitourinaryData.affectedSystem === 'prostate' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prostate Symptoms</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Weak Stream', 'Hesitancy', 'Frequency', 'Urgency', 'Nocturia', 'Incomplete Emptying', 'Dribbling', 'Pain'].map(symptom => (
                              <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  genitourinaryData.prostateSymptoms.includes(symptom) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.prostateSymptoms.includes(symptom)}
                                       onChange={() => {
                                         setGenitourinaryData(prev => ({
                                           ...prev,
                                           prostateSymptoms: prev.prostateSymptoms.includes(symptom)
                                               ? prev.prostateSymptoms.filter(s => s !== symptom)
                                               : [...prev.prostateSymptoms, symptom]
                                         }));
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          IPSS Score (if known)
                          <span className="text-xs text-gray-500 ml-2">(0-35, higher = worse symptoms)</span>
                        </label>
                        <input type="number" value={genitourinaryData.prostateScore}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, prostateScore: e.target.value }))}
                               min="0" max="35"
                               placeholder="0-35"
                               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nocturia Count (times waking to void)</label>
                        <input type="number" value={genitourinaryData.nocturiaCount}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, nocturiaCount: e.target.value }))}
                               placeholder="# of times"
                               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prostate Medications</label>
                        <div className="space-y-2">
                          {['Alpha Blocker (Flomax, etc.)', '5-Alpha Reductase Inhibitor (Finasteride, etc.)'].map(med => (
                              <label key={med} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  genitourinaryData.prostateMedications.includes(med) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.prostateMedications.includes(med)}
                                       onChange={() => {
                                         setGenitourinaryData(prev => ({
                                           ...prev,
                                           prostateMedications: prev.prostateMedications.includes(med)
                                               ? prev.prostateMedications.filter(m => m !== med)
                                               : [...prev.prostateMedications, med]
                                         }));
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{med}</span>
                              </label>
                          ))}
                        </div>
                      </div>
                    </>
                )}

                {/* SPHINCTER/BOWEL SYSTEM */}
                {genitourinaryData.affectedSystem === 'sphincter' && (
                    <>
                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.fecalIncontinenceEpisode ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.fecalIncontinenceEpisode}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fecalIncontinenceEpisode: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecal Incontinence Episode Today</span>
                      </label>

                      {genitourinaryData.fecalIncontinenceEpisode && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Typical Frequency</label>
                              <select value={genitourinaryData.fecalIncontinenceFrequency}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fecalIncontinenceFrequency: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select frequency</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="rarely">Rarely</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Incontinence Type</label>
                              <select value={genitourinaryData.fecalIncontinenceType}
                                      onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fecalIncontinenceType: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select type</option>
                                <option value="solid">Solid stool</option>
                                <option value="liquid">Liquid stool</option>
                                <option value="gas-only">Gas only</option>
                                <option value="mixed">Mixed</option>
                              </select>
                            </div>
                          </>
                      )}

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.fecalUrgency ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.fecalUrgency}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fecalUrgency: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bowel Urgency</span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bowel Control Methods</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Medications', 'Dietary Changes', 'Scheduled BMs', 'Pads/Briefs'].map(method => (
                              <label key={method} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  genitourinaryData.bowelControlMethods.includes(method) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={genitourinaryData.bowelControlMethods.includes(method)}
                                       onChange={() => {
                                         setGenitourinaryData(prev => ({
                                           ...prev,
                                           bowelControlMethods: prev.bowelControlMethods.includes(method)
                                               ? prev.bowelControlMethods.filter(m => m !== method)
                                               : [...prev.bowelControlMethods, method]
                                         }));
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{method}</span>
                              </label>
                          ))}
                        </div>
                      </div>
                    </>
                )}

                {/* REPRODUCTIVE SYSTEM */}
                {genitourinaryData.affectedSystem === 'reproductive' && (
                    <>
                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.erectileDysfunction ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.erectileDysfunction}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, erectileDysfunction: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Erectile Dysfunction</span>
                      </label>

                      {genitourinaryData.erectileDysfunction && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
                            <select value={genitourinaryData.edSeverity}
                                    onChange={(e) => setGenitourinaryData(prev => ({ ...prev, edSeverity: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                              <option value="">Select severity</option>
                              <option value="mild">Mild (occasional difficulty)</option>
                              <option value="moderate">Moderate (frequent difficulty)</option>
                              <option value="severe">Severe (usually unable)</option>
                              <option value="complete">Complete (always unable)</option>
                            </select>
                          </div>
                      )}

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                          genitourinaryData.testicular ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={genitourinaryData.testicular}
                               onChange={(e) => setGenitourinaryData(prev => ({ ...prev, testicular: e.target.checked }))}
                               className="w-4 h-4 text-teal-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Testicular Symptoms</span>
                      </label>

                      {genitourinaryData.testicular && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Testicular Symptoms</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Pain', 'Swelling', 'Mass/Lump', 'Discomfort', 'Heaviness'].map(symptom => (
                                  <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                      genitourinaryData.testicularSymptoms.includes(symptom) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}>
                                    <input type="checkbox" checked={genitourinaryData.testicularSymptoms.includes(symptom)}
                                           onChange={() => {
                                             setGenitourinaryData(prev => ({
                                               ...prev,
                                               testicularSymptoms: prev.testicularSymptoms.includes(symptom)
                                                   ? prev.testicularSymptoms.filter(s => s !== symptom)
                                                   : [...prev.testicularSymptoms, symptom]
                                             }));
                                           }}
                                           className="w-4 h-4 text-teal-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                                  </label>
                              ))}
                            </div>
                          </div>
                      )}
                    </>
                )}

                {/* COMMON FIELDS FOR ALL SYSTEMS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities Affected</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Work', 'Sleep', 'Exercise', 'Social', 'Intimacy', 'Travel'].map(activity => (
                        <label key={activity} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            genitourinaryData.activitiesAffected.includes(activity) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={genitourinaryData.activitiesAffected.includes(activity)}
                                 onChange={() => {
                                   setGenitourinaryData(prev => ({
                                     ...prev,
                                     activitiesAffected: prev.activitiesAffected.includes(activity)
                                         ? prev.activitiesAffected.filter(a => a !== activity)
                                         : [...prev.activitiesAffected, activity]
                                   }));
                                 }}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      genitourinaryData.fluidRestriction ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                  }`}>
                    <input type="checkbox" checked={genitourinaryData.fluidRestriction}
                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, fluidRestriction: e.target.checked }))}
                           className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Limiting Fluids</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      genitourinaryData.workMissed ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                  }`}>
                    <input type="checkbox" checked={genitourinaryData.workMissed}
                           onChange={(e) => setGenitourinaryData(prev => ({ ...prev, workMissed: e.target.checked }))}
                           className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Missed Work</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Conditions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Diabetes', 'Hypertension', 'BPH', 'Neurogenic', 'Radiation Therapy', 'Spinal Injury'].map(condition => (
                        <label key={condition} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            genitourinaryData.associatedConditions.includes(condition) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={genitourinaryData.associatedConditions.includes(condition)}
                                 onChange={() => {
                                   setGenitourinaryData(prev => ({
                                     ...prev,
                                     associatedConditions: prev.associatedConditions.includes(condition)
                                         ? prev.associatedConditions.filter(c => c !== condition)
                                         : [...prev.associatedConditions, condition]
                                   }));
                                 }}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{condition}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complications</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Recurrent UTIs', 'Hydronephrosis', 'Renal Failure', 'Sepsis', 'Skin Breakdown'].map(complication => (
                        <label key={complication} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            genitourinaryData.complications.includes(complication) ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={genitourinaryData.complications.includes(complication)}
                                 onChange={() => {
                                   setGenitourinaryData(prev => ({
                                     ...prev,
                                     complications: prev.complications.includes(complication)
                                         ? prev.complications.filter(c => c !== complication)
                                         : [...prev.complications, complication]
                                   }));
                                 }}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{complication}</span>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity Level</label>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <input type="range" min="0" max="10" value={severity}
                     onChange={(e) => setSeverity(Number(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                <span className={`text-lg font-bold ${severityInfo.color}`}>
                {severity} - {severityInfo.label}
              </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
              </div>
            </div>
          </div>

          {/* Medication Taken */}
          {medications.length > 0 && selectedSymptom && (
              <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                      type="checkbox"
                      checked={tookMedication}
                      onChange={(e) => {
                        setTookMedication(e.target.checked);
                        if (!e.target.checked) setSelectedMedications([]);
                      }}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="font-medium text-teal-900 dark:text-teal-200">I took medication for this</span>
                </label>

                {tookMedication && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-teal-700 dark:text-teal-300">Select all that apply:</p>
                      {medications.filter(m => m.isActive).map(med => (
                          <label
                              key={med.id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMedications.includes(med.id)
                                      ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
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
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                      {med.name} ({med.dosage})
                    </span>
                          </label>
                      ))}
                    </div>
                )}
              </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="What were you doing? What made it better or worse?"
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detailed notes help build stronger claims</p>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={!selectedSymptom}
                  className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors">
            Log Symptom
          </button>
        </form>
      </div>
  );
};

export default SymptomLogger;