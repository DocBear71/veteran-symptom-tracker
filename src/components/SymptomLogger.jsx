import { useRef, useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { symptomCategories, sortedSymptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom, getMedications, logMedicationTaken } from '../utils/storage';
import OccurrenceTimePicker from './OccurrenceTimePicker.jsx';
import QuickLog from './QuickLog';
import AddChronicModal from './AddChronicModal';

const SymptomLogger = ({ onLogSaved, prefillData, onPrefillUsed }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString());
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

  // Phase 4: Gynecological Conditions
  const [gynecologicalData, setGynecologicalData] = useState({
    // General gynecological
    affectedOrgan: '',            // vulva/vagina/cervix/uterus/fallopian-tube/ovary/multiple
    painType: '',                 // chronic-pelvic/dysmenorrhea/dyspareunia/ovulation/other
    painSeverity: 5,
    painLocation: '',
    painDuration: '',
    // Endometriosis
    endometriosisDiagnosed: false,
    laparoscopyConfirmed: false,
    laparoscopyDate: '',
    lesionLocations: [],          // bowel/bladder/ovaries/peritoneum/other
    treatmentType: '',            // hormonal/surgical/pain-management/none
    treatmentEffectiveness: '',   // controlled/partially-controlled/not-controlled
    bowelSymptoms: false,
    bladderSymptoms: false,
    // Menstrual disorders
    cycleRegularity: '',          // regular/irregular/absent
    cycleLength: '',
    flowHeaviness: '',            // light/moderate/heavy/very-heavy
    flowDuration: '',
    dysmenorrheaSeverity: '',     // none/mild/moderate/severe
    intermenstrualBleeding: false,
    // PCOS (rated under DC 7615)
    pcosDiagnosed: false,
    pcosSymptoms: [],             // irregular-periods/hirsutism/acne/weight-gain/ovarian-cysts
    rotterdamCriteriaMet: '',     // 2-of-3/3-of-3/not-assessed
    // PID
    pidDiagnosed: false,
    pidType: '',                  // acute/chronic
    recurrentInfections: false,
    numberOfEpisodes: '',
    lastEpisodeDate: '',
    // Prolapse
    prolapseDiagnosed: false,
    prolapseType: '',             // cystocele/rectocele/uterine/vault/enterocele/multiple
    popStage: '',                 // 0/1/2/3/4
    prolapseTreatment: '',        // none/pessary/pt/surgical
    // Sexual function
    sexualDysfunction: false,
    arousalDifficulty: false,
    libidoDecreased: false,
    // General impact
    interferesDailyActivities: false,
    workMissed: false,
    continuousTreatmentRequired: false,
    treatmentMedications: [],
  });

  // Phase 5: Hemic/Lymphatic Conditions
  const [anemiaData, setAnemiaData] = useState({
    type: '',                     // iron-deficiency, b12-deficiency, folate-deficiency, hemolytic, aplastic, sickle-cell
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
    disorder_type: '',            // thrombocytopenia, hemophilia, von-willebrand, other
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
    diagnosis: '',                // hodgkin, non-hodgkin, cll, cml, all, aml, multiple-myeloma
    stage: '',
    treatment_status: '',         // active-treatment, remission, maintenance, surveillance
    treatment_type: [],
    cycles_completed: '',
    side_effects: [],
    last_treatment_date: ''
  });

  const [polycythemiaData, setPolycythemiaData] = useState({
    diagnosis: '',                // polycythemia-vera, essential-thrombocythemia, primary-myelofibrosis
    treatment: [],
    phlebotomy_frequency: '',
    last_phlebotomy: '',
    medications: [],
    complications: []
  });

  const [treatmentData, setTreatmentData] = useState({
    treatment_type: '',           // chemotherapy, radiation, immunotherapy, targeted-therapy
    regimen: '',
    cycle_number: '',
    side_effects: [],
    severity: '',
    management: []
  });

  const [b12DeficiencyData, setB12DeficiencyData] = useState({
    deficiency_cause: '',         // pernicious-anemia, dietary, malabsorption, other
    neurological_symptoms: [],
    treatment: [],
    injection_frequency: '',
    last_injection: '',
    improvement_noted: ''
  });

  // Phase 6: HIV/AIDS Data
  const [hivData, setHivData] = useState({
    infectionType: '',             // Type of opportunistic infection
    constitutionalSymptoms: [],    // Array of symptoms: night-sweats, fever, diarrhea, fatigue
    weightLossPercentage: '',      // Percentage of weight lost
    onAntiretrovirals: false,      // Currently on antiretroviral therapy
    cd4CountKnown: false,          // Whether CD4 count is known
    cd4Range: '',                  // <200, 200-500, >500
    treatmentCompliance: '',       // excellent/good/fair/poor
  });

  // Phase 6: Hepatitis Data (shared for Hep B and Hep C)
  const [hepatitisData, setHepatitisData] = useState({
    weightLossPercentage: '',
    debilitating: false,
    dietaryRestrictions: false,
    symptomFrequency: '',        // daily, intermittent, rare
  });

  // Phase 6: Lyme Disease Data
  const [lymeData, setLymeData] = useState({
    activeTreatment: false,
    treatmentCompleted: false,
    treatmentStartDate: '',
    rashPresent: false,
    rashType: '',                // bulls-eye, other
    neurologicalSymptoms: [],    // Array of neuro symptoms
    jointSymptoms: [],           // Array of joint symptoms
  });

  const [malariaData, setMalariaData] = useState({
    relapseEpisode: false,
    hospitalized: false,
    continuousMedication: false,
    severeComplications: false,
    feverTemperature: '',
    cyclicalPattern: false,
  });

  const [brucellosisData, setBrucellosisData] = useState({
    relapseEpisode: false,
    multiOrganInvolvement: false,
    chronicArthritis: false,
    neurobrucellosis: false,
    undulantFever: false,
  });

  const [campylobacterData, setCampylobacterData] = useState({
    guillainBarre: false,
    reactiveArthritis: false,
    chronicIBS: false,
    weeksSinceInfection: '',
    stoolCultureConfirmed: false,
  });

  const [qFeverData, setQFeverData] = useState({
    chronicQFever: false,
    endocarditis: false,
    fatigueSyndrome: false,
    monthsSinceInfection: '',
    phaseIAntibodies: false,
  });

  const [salmonellaData, setSalmonellaData] = useState({
    hospitalized: false,
    bacteremia: false,
    reactiveArthritis: false,
    severeComplications: false,
    stoolCultureConfirmed: false,
  });

  const [shigellaData, setShigellaData] = useState({
    hospitalized: false,
    hus: false,
    reactiveArthritis: false,
    severeComplications: false,
    stoolCultureConfirmed: false,
  });

  const [westNileData, setWestNileData] = useState({
    neuroinvasive: false,
    encephalitis: false,
    acuteFlaccidParalysis: false,
    permanentImpairment: false,
    serologyConfirmed: false,
  });

  const [ntmData, setNtmData] = useState({
    activeDisease: false,
    onTreatment: false,
    disseminated: false,
    monthsOnTreatment: '',
    ntmSpecies: '',
  });

  // Phase 7: Dental/Oral Conditions
  const [dentalData, setDentalData] = useState({
    // General dental/oral
    affectedArea: '',              // jaw/teeth/palate/tongue/lips/gums/multiple
    isJawRelated: false,
    isBoneRelated: false,
    isToothRelated: false,
    isProsthesisRelated: false,
    // Jaw/structural
    jawPainSide: '',               // left/right/bilateral
    jawPainSeverity: 5,
    jawOpening: '',                // mm if known
    jawLocking: false,
    jawClicking: false,
    jawDeviation: false,
    boneInfection: false,
    boneExposed: false,
    boneDrainage: false,
    // Tooth/dental
    toothCount: '',                // number of missing teeth
    toothLocation: [],             // upper/lower/anterior/posterior
    toothLossCause: '',            // bone-loss/periodontal/trauma/decay
    prosthesisType: '',            // none/partial/full-upper/full-lower/implants/bridge
    prosthesisFunction: '',        // restores/does-not-restore
    prosthesisPain: false,
    prosthesisFit: '',             // good/poor/ill-fitting
    // Palate
    palatePain: false,
    palateUlcers: false,
    palateInfection: false,
    // Mastication/function
    chewingDifficulty: '',         // none/mild/moderate/severe
    swallowingDifficulty: '',      // none/mild/moderate/severe
    dietaryRestrictions: '',       // none/semi-solid/soft/puree/liquid
    speechDifficulty: false,
    // Neoplasm/tumor
    oralMass: false,
    massLocation: '',
    massBiopsy: '',                // benign/malignant/pending/unknown
    treatmentStatus: '',           // none/active/post-op/radiation/chemo
    // Infection/inflammation
    activeInfection: false,
    infectionType: '',
    antibioticUse: false,
    // Impact
    workMissed: false,
    eatingImpaired: false,
    socialImpact: false,
  });
  // Eating Disorders - Special tracking needed
  const [eatingDisorderData, setEatingDisorderData] = useState({
    currentWeight: '',
    expectedMinimumWeight: '',
    weightPercentage: '',
    incapacitatingEpisode: false,
    episodeDuration: '',
    hospitalized: false,
    hospitalizationReason: '',
    tubeFeeding: false,
    parenteralNutrition: false,
    bingeEpisode: false,
    purgingEpisode: false,
    compensatoryBehaviors: [],
    restrictedIntake: false,
  });
  // PHASE 8A EXTENDED: CONDITION-SPECIFIC MENTAL HEALTH FORMS
  // Form 1: Anxiety Disorders (GAD, Panic, Social Anxiety, Other Specified, Illness Anxiety)
  const [anxietyData, setAnxietyData] = useState({
    // Physical Symptoms
    heartRacing: false,
    sweating: false,
    trembling: false,
    shortnessOfBreath: false,
    chestTightness: false,
    nausea: false,
    dizziness: false,
    hotFlashes: false,
    numbnessTingling: false,

    // Cognitive Symptoms
    racingThoughts: false,
    fearOfLosingControl: false,
    fearOfDying: false,
    feelingDetached: false,
    difficultyConcentrating: false,

    // Avoidance Behaviors
    avoidedSocial: false,
    leftEarly: false,
    calledOut: false,
    cancelledPlans: false,
    neededSafetyPerson: false,

    // Context
    trigger: '',
    episodeDuration: '',
    wasPanicAttack: false,
  });

  // Form 2: Depression (MDD, Persistent Depressive, Unspecified Depressive)
  const [depressionData, setDepressionData] = useState({
    // Mood Symptoms
    depressedMood: false,
    anhedonia: false,
    worthlessness: false,
    excessiveGuilt: false,
    hopelessness: false,
    irritability: false,

    // Physical/Vegetative Symptoms
    insomnia: false,
    hypersomnia: false,
    decreasedAppetite: false,
    increasedAppetite: false,
    fatigue: false,
    psychomotorAgitation: false,
    psychomotorRetardation: false,

    // Cognitive Symptoms
    difficultyConcentrating: false,
    difficultyDeciding: false,
    memoryProblems: false,
    thoughtsOfDeath: false,

    // Functional Impact
    unableToGetUp: false,
    calledOutWork: false,
    neglectedSelfCare: false,
    socialWithdrawal: false,
    unableToCompleteTasks: false,

    // Context
    suicidalIdeation: false,
    trigger: '',
    episodeContext: '',
  });

  // Form 3: Bipolar/Cyclothymic (Bipolar I, Bipolar II, Cyclothymic)
  const [bipolarData, setBipolarData] = useState({
    // Episode Type
    episodeType: '', // 'manic', 'hypomanic', 'depressive', 'mixed'

    // Manic/Hypomanic Symptoms
    elevatedMood: false,
    irritableMood: false,
    increasedEnergy: false,
    decreasedSleep: false,
    moreTalkative: false,
    racingThoughts: false,
    distractibility: false,
    increasedActivity: false,
    riskyBehavior: false,
    grandiosity: false,

    // Depressive Symptoms (reuse depression symptoms)
    depressedMood: false,
    anhedonia: false,
    fatigue: false,
    worthlessness: false,

    // Sleep/Behavior
    sleepHours: '',
    riskyBehaviors: [], // spending, sexual, driving, substance, impulsive

    // Functional Impact
    unableToWork: false,
    relationshipConflicts: false,
    legalProblems: false,
    hospitalizationRequired: false,

    // Context
    episodeDuration: '',
  });

  // Form 4: OCD
  const [ocdData, setOcdData] = useState({
    // Obsession Types
    contaminationFears: false,
    fearOfHarm: false,
    needForSymmetry: false,
    forbiddenThoughts: false,
    religiousObsessions: false,
    hoardingUrges: false,
    otherObsession: '',

    // Compulsion Types
    washingCleaning: false,
    checking: false,
    repeating: false,
    counting: false,
    ordering: false,
    mentalRituals: false,
    reassuranceSeeking: false,
    otherCompulsion: '',

    // Time/Impact
    timeConsumed: '', // <1hr, 1-3hr, 3-8hr, >8hr, constant
    distressLevel: 5,

    // Functional Impact
    lateToAppointments: false,
    avoidedSituations: false,
    interferedRoutines: false,
    relationshipProblems: false,
    unableToComplete: false,

    // Context
    trigger: '',
  });

  // Form 5: Adjustment Disorder
  const [adjustmentDisorderData, setAdjustmentDisorderData] = useState({
    stressor: '',
    stressorDate: '',
    daysSinceStressor: '',
    presentationType: '', // depressed, anxiety, mixed-emotions, conduct, mixed-conduct-emotions, unspecified

    // Emotional/Behavioral Symptoms
    tearfulness: false,
    hopelessness: false,
    worry: false,
    physicalTension: false,
    impulsiveBehaviors: false,
    aggression: false,
    ruleViolations: false,
    recklessBehavior: false,

    // Functional Impact
    workDifficulty: false,
    relationshipProblems: false,
    socialWithdrawal: false,
    selfCareNeglect: false,
    unableToFulfillResponsibilities: false,

    // Duration/Progress
    symptomsImproving: null, // true/false/null
    stillAffectingFunctioning: null, // true/false/null
    context: '',
  });

  // Phase 8B: Additional Mental Health Data
  const [bingeEatingData, setBingeEatingData] = useState({
    bingeEpisode: false,
    lossOfControl: false,
    distressLevel: 5,
  });

  const [dissociativeData, setDissociativeData] = useState({
    memoryGap: false,
    lostTime: false,
    durationAmount: '',
    durationUnit: ''
  });

  const [acuteStressData, setAcuteStressData] = useState({
    traumaDate: '',
    dissociativeSymptoms: false,
    avoidance: false,
  });

  const [personalityData, setPersonalityData] = useState({
    occupationalImpact: false,
    socialImpact: false,
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
      if (prefillData.gynecologicalData) {
        console.log('🌸 Setting gynecological data:', prefillData.gynecologicalData);
        setGynecologicalData({ ...prefillData.gynecologicalData });
      }
      // Phase 5: Hemic/Lymphatic prefills
      if (prefillData.anemiaData) {
        console.log('🩸 Setting anemia data:', prefillData.anemiaData);
        setAnemiaData({ ...prefillData.anemiaData });
      }
      if (prefillData.sickleCellData) {
        console.log('🩸 Setting sickle cell data:', prefillData.sickleCellData);
        setSickleCellData({ ...prefillData.sickleCellData });
      }
      if (prefillData.bleedingDisorderData) {
        console.log('🩸 Setting bleeding disorder data:', prefillData.bleedingDisorderData);
        setBleedingDisorderData({ ...prefillData.bleedingDisorderData });
      }
      if (prefillData.infectionData) {
        console.log('🦠 Setting infection data:', prefillData.infectionData);
        setInfectionData({ ...prefillData.infectionData });
      }
      if (prefillData.lymphomaLeukemiaData) {
        console.log('🎗️ Setting lymphoma/leukemia data:', prefillData.lymphomaLeukemiaData);
        setLymphomaLeukemiaData({ ...prefillData.lymphomaLeukemiaData });
      }
      if (prefillData.polycythemiaData) {
        console.log('🔴 Setting polycythemia data:', prefillData.polycythemiaData);
        setPolycythemiaData({ ...prefillData.polycythemiaData });
      }
      if (prefillData.treatmentData) {
        console.log('💊 Setting treatment data:', prefillData.treatmentData);
        setTreatmentData({ ...prefillData.treatmentData });
      }
      if (prefillData.b12DeficiencyData) {
        console.log('💊 Setting B12 deficiency data:', prefillData.b12DeficiencyData);
        setB12DeficiencyData({ ...prefillData.b12DeficiencyData });
      }
      if (prefillData.dentalData) {
        console.log('🦷 Setting dental data:', prefillData.dentalData);
        setDentalData({...prefillData.dentalData});
      }
      if (prefillData.hivData) {
        console.log('🦠 Setting HIV data:', prefillData.hivData);
        setHivData({ ...prefillData.hivData });
      }
      if (prefillData.hepatitisData) {
        console.log('🦠 Setting Hepatitis data:', prefillData.hepatitisData);
        setHepatitisData({ ...prefillData.hepatitisData });
      }
      if (prefillData.lymeData) {
        console.log('🦟 Setting Lyme data:', prefillData.lymeData);
        setLymeData({ ...prefillData.lymeData });
      }
      if (prefillData.malariaData) {
        setMalariaData(prefillData.malariaData);
      }
      if (prefillData.brucellosisData) {
        setBrucellosisData(prefillData.brucellosisData);
      }
      if (prefillData.campylobacterData) {
        setCampylobacterData(prefillData.campylobacterData);
      }
      if (prefillData.qFeverData) {
        setQFeverData(prefillData.qFeverData);
      }
      if (prefillData.salmonellaData) {
        setSalmonellaData(prefillData.salmonellaData);
      }
      if (prefillData.shigellaData) {
        setShigellaData(prefillData.shigellaData);
      }
      if (prefillData.westNileData) {
        setWestNileData(prefillData.westNileData);
      }
      if (prefillData.ntmData) {
        setNtmData(prefillData.ntmData);
      }
      if (prefillData.eatingDisorderData) {
        setEatingDisorderData(prefillData.eatingDisorderData);
      }
      // Phase 8B: Mental health prefills
      if (prefillData.bingeEatingData) {
        setBingeEatingData(prefillData.bingeEatingData);
      }
      if (prefillData.dissociativeData) {
        setDissociativeData(prefillData.dissociativeData);
      }
      if (prefillData.acuteStressData) {
        setAcuteStressData(prefillData.acuteStressData);
      }
      if (prefillData.personalityData) {
        setPersonalityData(prefillData.personalityData);
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

  // PTSD - All PTSD symptoms (must be specific to avoid catching all mental health)
  const isPTSDRelated = selectedSymptom?.startsWith('ptsd-') ||
      ['hypervigilance', 'flashbacks', 'intrusive-thoughts', 'avoidance',
        'emotional-numbness', 'startle-response'].includes(selectedSymptom);

  // Anxiety Disorders Form
  const isAnxietyFormRelated = [
    // Anxiety Symptoms category (actual IDs from symptoms.js)
    'anxiety', 'gad-worry', 'gad-restlessness', 'gad-muscle-tension',
    // Panic Disorder Symptoms category
    'panic-attack', 'panic-agoraphobia', 'panic-anticipatory-anxiety',
    // Social Anxiety Symptoms category
    'social-anxiety-fear', 'social-anxiety-avoidance', 'social-anxiety-performance',
    'social-anxiety-physical', 'social-anxiety-anticipatory',
    // Illness Anxiety Disorder (Phase 8A)
    'illness-anxiety-fear', 'illness-anxiety-body-checking', 'illness-anxiety-reassurance',
    'illness-anxiety-avoidance', 'illness-anxiety-distress',
    // Other Specified Anxiety (Phase 8A - if you added these)
    'other-anxiety-symptoms', 'other-anxiety-worry', 'other-anxiety-avoidance', 'other-anxiety-physical'
  ].includes(selectedSymptom);

  // Depression Form
  const isDepressionFormRelated = [
    'depression', 'mdd-episode', 'mdd-anhedonia', 'mdd-hopelessness',
    'persistent-depressive-chronic', 'persistent-depressive-low-energy',
    'persistent-depressive-low-self-esteem', 'persistent-depressive-hopelessness'
  ].includes(selectedSymptom);

  // Bipolar Form
  const isBipolarFormRelated = [
    // Bipolar Symptoms category (actual IDs: bipolar-manic, bipolar-depressive, bipolar-mixed)
    'bipolar-manic', 'bipolar-depressive', 'bipolar-mixed',
    // Cyclothymic Disorder (Phase 8A)
    'cyclothymic-hypomanic', 'cyclothymic-depressive', 'cyclothymic-mood-swing', 'cyclothymic-irritability'
  ].includes(selectedSymptom);

  // OCD Form
  const isOCDFormRelated = [
    // Actual OCD symptom IDs from symptoms.js
    'ocd-obsessions', 'ocd-compulsions', 'ocd-checking', 'ocd-contamination', 'ocd-time-spent'
  ].includes(selectedSymptom);



  // Adjustment Disorder Form
  const isAdjustmentDisorderFormRelated = [
    'adjustment-depressed-mood', 'adjustment-anxiety', 'adjustment-mixed-emotions',
    'adjustment-disturbance-conduct', 'adjustment-work-difficulty', 'adjustment-relationship-problems',
    'adjustment-unspecified'
  ].includes(selectedSymptom);

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

  // Phase 4: Gynecological condition detection
  const isGynecologicalRelated = selectedSymptom?.includes('menstrual') ||
      selectedSymptom?.includes('pelvic') ||
      selectedSymptom?.includes('endometriosis') ||
      selectedSymptom?.includes('ovarian') ||
      selectedSymptom?.includes('uterine') ||
      selectedSymptom?.includes('vaginal') ||
      selectedSymptom?.includes('cervix') ||
      selectedSymptom?.includes('dyspareunia') ||
      selectedSymptom?.includes('dysmenorrhea') ||
      selectedSymptom?.includes('prolapse') ||
      selectedSymptom?.includes('vulvo') ||
      ['heavy-menstrual-bleeding', 'irregular-periods', 'painful-periods', 'absent-periods',
        'prolonged-bleeding', 'intermenstrual-bleeding', 'premenstrual-syndrome',
        'chronic-pelvic-pain', 'dyspareunia', 'lower-abdominal-pain', 'pain-bowel-movement',
        'pain-urination-gyn', 'endometriosis-pain', 'endometriosis-bowel', 'endometriosis-bladder',
        'ovarian-cysts', 'polycystic-ovaries', 'ovulation-pain', 'anovulation',
        'pid-symptoms', 'abnormal-discharge', 'cervicitis', 'vulvovaginitis', 'vaginal-irritation',
        'pelvic-pressure', 'vaginal-bulge', 'incomplete-bladder-emptying', 'bowel-dysfunction-prolapse',
        'sexual-dysfunction', 'decreased-libido', 'arousal-difficulty', 'infertility',
        'hirsutism', 'hormonal-acne', 'pcos-weight-changes', 'breast-pain', 'nipple-discharge',
        'uterine-cramping'].includes(selectedSymptom);

  // Phase 5: Hemic/Lymphatic condition detection
  const isAnemiaRelated = [
    'fatigue-blood', 'weakness-blood', 'dizziness-anemia', 'shortness-breath-anemia',
    'pale-skin', 'cold-hands-feet', 'chest-pain-anemia', 'rapid-heartbeat', 'headache-anemia'
  ].includes(selectedSymptom);

  const isSickleCellRelated = [
    'sickle-cell-crisis', 'bone-pain-sickle', 'joint-pain-sickle', 'chest-pain-sickle',
    'priapism', 'vision-changes-sickle', 'leg-ulcers'
  ].includes(selectedSymptom);

  const isBleedingDisorderRelated = [
    'easy-bruising', 'prolonged-bleeding', 'nosebleeds-frequent', 'bleeding-gums',
    'petechiae', 'heavy-menstrual-bleeding-blood', 'blood-in-urine', 'blood-in-stool'
  ].includes(selectedSymptom);

  const isInfectionRelated = [
    'frequent-infections', 'recurring-infections', 'slow-healing-wounds',
    'fever-unexplained', 'night-sweats-blood', 'chills-blood'
  ].includes(selectedSymptom);

  const isLymphomaLeukemiaRelated = [
    'swollen-lymph-nodes', 'unexplained-weight-loss', 'loss-appetite',
    'bone-pain-leukemia', 'night-sweats-blood'
  ].includes(selectedSymptom);

  const isPolycythemiaRelated = [
    'itching-after-bathing', 'burning-hands-feet', 'redness-skin',
    'blurred-vision-blood', 'headache-polycythemia', 'tinnitus-blood', 'blood-clots'
  ].includes(selectedSymptom);

  const isTreatmentRelated = [
    'nausea-chemo', 'vomiting-chemo', 'mouth-sores', 'hair-loss',
    'neuropathy-chemo', 'fatigue-chemo'
  ].includes(selectedSymptom);

  const isB12DeficiencyRelated = [
    'numbness-tingling-b12', 'difficulty-walking', 'memory-problems-b12',
    'confusion-b12', 'tongue-problems'
  ].includes(selectedSymptom);

  // Phase 6: HIV/AIDS condition detection
  const isHIVRelated = [
    'hiv-opportunistic-infection', 'hiv-night-sweats', 'hiv-persistent-fever',
    'hiv-weight-loss', 'hiv-chronic-diarrhea', 'hiv-oral-thrush',
    'hiv-skin-lesions', 'hiv-lymphadenopathy', 'hiv-fatigue',
    'hiv-cognitive-impairment'
  ].includes(selectedSymptom);

  // Phase 6: Hepatitis condition detection (B and C share symptoms)
  const isHepatitisRelated = [
    'hep-fatigue', 'hep-malaise', 'hep-nausea', 'hep-abdominal-pain',
    'hep-jaundice', 'hep-dark-urine', 'hep-appetite-loss', 'hep-joint-pain',
    'hep-cognitive-issues', 'hep-liver-tenderness'
  ].includes(selectedSymptom);

  // Phase 6: Lyme Disease condition detection
  const isLymeRelated = [
    'lyme-rash', 'lyme-fever', 'lyme-headache', 'lyme-fatigue',
    'lyme-joint-pain', 'lyme-muscle-aches', 'lyme-nerve-pain', 'lyme-cognitive',
    'lyme-heart-palpitations', 'lyme-facial-paralysis'
  ].includes(selectedSymptom);

  const isMalariaRelated = [
    'malaria-fever', 'malaria-chills', 'malaria-sweats', 'malaria-headache',
    'malaria-muscle-aches', 'malaria-nausea', 'malaria-fatigue', 'malaria-jaundice',
    'malaria-anemia', 'malaria-enlarged-spleen'
  ].includes(selectedSymptom);

  const isBrucellosisRelated = [
    'brucellosis-fever', 'brucellosis-night-sweats', 'brucellosis-fatigue',
    'brucellosis-joint-pain', 'brucellosis-muscle-aches', 'brucellosis-headache',
    'brucellosis-back-pain', 'brucellosis-weight-loss', 'brucellosis-depression',
    'brucellosis-liver-spleen'
  ].includes(selectedSymptom);

  const isCampylobacterRelated = [
    'campylobacter-diarrhea', 'campylobacter-abdominal-pain', 'campylobacter-fever',
    'campylobacter-nausea', 'campylobacter-vomiting', 'campylobacter-bloody-stool',
    'campylobacter-fatigue', 'campylobacter-joint-pain', 'campylobacter-muscle-weakness',
    'campylobacter-nerve-symptoms'
  ].includes(selectedSymptom);

  const isQFeverRelated = [
    'q-fever-fever', 'q-fever-headache', 'q-fever-fatigue', 'q-fever-muscle-aches',
    'q-fever-cough', 'q-fever-chest-pain', 'q-fever-night-sweats', 'q-fever-chills',
    'q-fever-shortness-breath', 'q-fever-joint-pain'
  ].includes(selectedSymptom);

  const isSalmonellaRelated = [
    'salmonella-diarrhea', 'salmonella-fever', 'salmonella-abdominal-cramps',
    'salmonella-nausea', 'salmonella-vomiting', 'salmonella-bloody-stool',
    'salmonella-joint-pain', 'salmonella-bacteremia', 'salmonella-dehydration',
    'salmonella-fatigue'
  ].includes(selectedSymptom);

  const isShigellaRelated = [
    'shigella-diarrhea', 'shigella-bloody-stool', 'shigella-abdominal-cramps',
    'shigella-fever', 'shigella-tenesmus', 'shigella-nausea', 'shigella-vomiting',
    'shigella-dehydration', 'shigella-reactive-arthritis', 'shigella-seizures'
  ].includes(selectedSymptom);

  const isWestNileRelated = [
    'west-nile-fever', 'west-nile-headache', 'west-nile-body-aches',
    'west-nile-fatigue', 'west-nile-weakness', 'west-nile-cognitive',
    'west-nile-tremors', 'west-nile-vision-problems', 'west-nile-numbness',
    'west-nile-paralysis'
  ].includes(selectedSymptom);

  const isNTMRelated = [
    'ntm-cough', 'ntm-sputum', 'ntm-fatigue', 'ntm-fever',
    'ntm-night-sweats', 'ntm-weight-loss', 'ntm-chest-pain',
    'ntm-shortness-breath', 'ntm-hemoptysis', 'ntm-lymph-nodes'
  ].includes(selectedSymptom);

  // ============================================
  // PHASE 8A: MENTAL HEALTH EXPANSION - DETECTION LOGIC
  // ============================================

  const isIllnessAnxietyRelated = [
    'illness-anxiety-fear',
    'illness-anxiety-body-checking',
    'illness-anxiety-reassurance',
    'illness-anxiety-avoidance',
    'illness-anxiety-distress',
  ].includes(selectedSymptom);

  // Other Anxiety/Mood
  const isOtherSpecifiedAnxietyRelated = [
    'other-anxiety-symptoms',
    'other-anxiety-worry',
    'other-anxiety-avoidance',
    'other-anxiety-physical',
  ].includes(selectedSymptom);

  const isCyclothymicRelated = [
    'cyclothymic-hypomanic',
    'cyclothymic-depressive',
    'cyclothymic-mood-swing',
    'cyclothymic-irritability',
  ].includes(selectedSymptom);

  // Eating Disorders - Need special forms
  const isAnorexiaRelated = [
    'anorexia-restricted-eating',
    'anorexia-weight-loss',
    'anorexia-fear-weight-gain',
    'anorexia-body-image',
    'anorexia-incapacitating-episode',
    'anorexia-hospitalization',
  ].includes(selectedSymptom);

  const isBulimiaRelated = [
    'bulimia-binge-eating',
    'bulimia-purging',
    'bulimia-compensatory',
    'bulimia-body-image',
    'bulimia-incapacitating-episode',
    'bulimia-hospitalization',
  ].includes(selectedSymptom);

  // Phase 7: Dental/Oral condition detection
  const isDentalOralRelated = selectedSymptom?.includes('jaw') ||
      selectedSymptom?.includes('tooth') ||
      selectedSymptom?.includes('teeth') ||
      selectedSymptom?.includes('dental') ||
      selectedSymptom?.includes('oral') ||
      selectedSymptom?.includes('palate') ||
      selectedSymptom?.includes('gum') ||
      selectedSymptom?.includes('tongue') ||
      selectedSymptom?.includes('lip') ||
      selectedSymptom?.includes('mouth') ||
      selectedSymptom?.includes('chewing') ||
      selectedSymptom?.includes('mastication') ||
      selectedSymptom?.includes('swallowing') ||
      selectedSymptom?.includes('prosthesis') ||
      selectedSymptom?.includes('denture') ||
      ['jaw-pain', 'jaw-swelling', 'jaw-stiffness', 'limited-mouth-opening', 'jaw-deviation',
        'bone-pain-jaw', 'jaw-infection', 'osteomyelitis-symptoms', 'bone-exposure', 'jaw-drainage',
        'jaw-instability', 'facial-asymmetry', 'tooth-loss-pain', 'missing-teeth', 'loose-teeth',
        'tooth-sensitivity', 'dental-abscess', 'gum-pain', 'gum-bleeding', 'gum-recession',
        'palate-pain', 'palate-ulcers', 'palate-infection', 'chewing-difficulty', 'chewing-pain',
        'bite-problems', 'food-impaction', 'mastication-fatigue', 'swallowing-difficulty',
        'swallowing-pain', 'tongue-pain', 'tongue-swelling', 'tongue-lesions', 'tongue-movement',
        'mouth-sores', 'oral-bleeding', 'dry-mouth', 'oral-burning', 'oral-tissue-changes',
        'lip-pain', 'lip-swelling', 'lip-lesions', 'oral-mass', 'oral-growth', 'tissue-thickening',
        'oral-infection', 'oral-inflammation', 'bad-taste', 'halitosis', 'speech-difficulty',
        'articulation-problems', 'prosthesis-pain', 'prosthesis-fit', 'prosthesis-sores'].includes(selectedSymptom);

  // Schizophrenia Spectrum Disorders (use basic mental health logging)
  const isSchizophreniaRelated = [
    'schizophrenia-hallucinations',
    'schizophrenia-delusions',
    'schizophrenia-disorganized-speech',
    'schizophrenia-disorganized-behavior',
    'schizophrenia-negative-symptoms',
  ].includes(selectedSymptom);

  const isSchizoaffectiveRelated = [
    'schizoaffective-mood-episodes',
    'psychotic-episode',
  ].includes(selectedSymptom);

  const isDelusionalDisorderRelated = [
    'psychotic-episode',
  ].includes(selectedSymptom);

  const isPsychoticNOSRelated = [
    'psychotic-episode',
  ].includes(selectedSymptom);

  const isBriefPsychoticRelated = [
    'brief-psychotic-episode',
  ].includes(selectedSymptom);

  // Binge Eating Disorder - Needs special form
  const isBingeEatingRelated = [
    'binge-eating-episode',
    'binge-eating-loss-of-control',
    'binge-eating-distress',
  ].includes(selectedSymptom);

  // Dissociative Disorders - Need special form
  const isDissociativeIdentityRelated = [
    'dissociative-identity-switching',
    'dissociative-amnesia-episode',
    'dissociative-fugue',
    'dissociative-time-loss',
  ].includes(selectedSymptom);

  const isDissociativeAmnesiaRelated = [
    'dissociative-amnesia-episode',
    'dissociative-fugue',
    'dissociative-time-loss',
  ].includes(selectedSymptom);

  const isDissociativeRelated = isDissociativeIdentityRelated || isDissociativeAmnesiaRelated;

  // Acute Stress Disorder - Needs special form
  const isAcuteStressRelated = [
    'acute-stress-intrusion',
    'acute-stress-avoidance',
    'acute-stress-arousal',
    'acute-stress-dissociation',
  ].includes(selectedSymptom);

  // Personality Disorders - Need special form
  const isAntisocialPersonalityRelated = [
    'personality-antisocial-behaviors',
    'personality-disorder-occupational-impairment',
    'personality-disorder-social-impairment',
  ].includes(selectedSymptom);

  const isBorderlinePersonalityRelated = [
    'personality-borderline-instability',
    'personality-borderline-fear-abandonment',
    'personality-borderline-self-harm',
    'personality-disorder-occupational-impairment',
    'personality-disorder-social-impairment',
  ].includes(selectedSymptom);

  const isNarcissisticPersonalityRelated = [
    'personality-narcissistic-grandiosity',
    'personality-narcissistic-lack-empathy',
    'personality-disorder-occupational-impairment',
    'personality-disorder-social-impairment',
  ].includes(selectedSymptom);

  const isAvoidantPersonalityRelated = [
    'personality-avoidant-social-inhibition',
    'personality-avoidant-fear-rejection',
    'personality-disorder-occupational-impairment',
    'personality-disorder-social-impairment',
  ].includes(selectedSymptom);

  const isPersonalityDisorderRelated =
      isAntisocialPersonalityRelated ||
      isBorderlinePersonalityRelated ||
      isNarcissisticPersonalityRelated ||
      isAvoidantPersonalityRelated;

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
    if (!isGynecologicalRelated) {
      setGynecologicalData({
        affectedOrgan: '', painType: '', painSeverity: 5, painLocation: '', painDuration: '',
        endometriosisDiagnosed: false, laparoscopyConfirmed: false, laparoscopyDate: '',
        lesionLocations: [], treatmentType: '', treatmentEffectiveness: '',
        bowelSymptoms: false, bladderSymptoms: false, cycleRegularity: '', cycleLength: '',
        flowHeaviness: '', flowDuration: '', dysmenorrheaSeverity: '', intermenstrualBleeding: false,
        pcosDiagnosed: false, pcosSymptoms: [], rotterdamCriteriaMet: '', pidDiagnosed: false,
        pidType: '', recurrentInfections: false, numberOfEpisodes: '', lastEpisodeDate: '',
        prolapseDiagnosed: false, prolapseType: '', popStage: '', prolapseTreatment: '',
        sexualDysfunction: false, arousalDifficulty: false, libidoDecreased: false,
        interferesDailyActivities: false, workMissed: false, continuousTreatmentRequired: false,
        treatmentMedications: [],
      });
    }
    // Phase 5: Hemic/Lymphatic resets
    if (!isAnemiaRelated) {
      setAnemiaData({type: '',severity: '',treatment: [],supplements: [],transfusion_history: '',last_transfusion: ''
      });
    }
    if (!isSickleCellRelated) {
      setSickleCellData({crisis_type: '',crisis_location: [],pain_severity: '',crisis_duration: '',triggers: [],treatment_received: [],hospitalizations_year: ''
      });
    }
    if (!isBleedingDisorderRelated) {
      setBleedingDisorderData({disorder_type: '',bleeding_site: [],bleeding_frequency: '',severity: '',treatment: [],platelet_count: ''
      });
    }
    if (!isInfectionRelated) {
      setInfectionData({infection_type: [],frequency: '',severity: '',requires_hospitalization: '',treatment: [],immune_status: ''
      });
    }
    if (!isLymphomaLeukemiaRelated) {
      setLymphomaLeukemiaData({diagnosis: '',stage: '',treatment_status: '',treatment_type: [],cycles_completed: '',side_effects: [],last_treatment_date: ''
      });
    }
    if (!isPolycythemiaRelated) {
      setPolycythemiaData({diagnosis: '',treatment: [],phlebotomy_frequency: '',last_phlebotomy: '',medications: [],complications: []
      });
    }
    if (!isTreatmentRelated) {
      setTreatmentData({treatment_type: '',regimen: '',cycle_number: '',side_effects: [],severity: '',management: []
      });
    }
    if (!isB12DeficiencyRelated) {
      setB12DeficiencyData({deficiency_cause: '',neurological_symptoms: [],treatment: [],injection_frequency: '',last_injection: '',improvement_noted: ''
      });
    }
    // Phase 6: Reset HIV data
    if (!isHIVRelated) {
      setHivData({
        infectionType: '', constitutionalSymptoms: [], weightLossPercentage: '',
        onAntiretrovirals: false, cd4CountKnown: false, cd4Range: '', treatmentCompliance: '',
      });
    }
    // Phase 6: Reset Hepatitis data
    if (!isHepatitisRelated) {
      setHepatitisData({
        weightLossPercentage: '', debilitating: false, dietaryRestrictions: false,
        symptomFrequency: '',
      });
    }
    // Phase 6: Reset Lyme data
    if (!isLymeRelated) {
      setLymeData({
        activeTreatment: false, treatmentCompleted: false, treatmentStartDate: '',
        rashPresent: false, rashType: '', neurologicalSymptoms: [], jointSymptoms: [],
      });
    }
    // Phase 6: Reset Malaria data
    if (!isMalariaRelated) {
      setMalariaData({
        relapseEpisode: false,
        hospitalized: false,
        continuousMedication: false,
        severeComplications: false,
        feverTemperature: '',
        cyclicalPattern: false,
      });
    }
// Phase 6: Reset Brucellosis data
    if (!isBrucellosisRelated) {
      setBrucellosisData({
        relapseEpisode: false,
        multiOrganInvolvement: false,
        chronicArthritis: false,
        neurobrucellosis: false,
        undulantFever: false,
      });
    }
// Phase 6: Reset Campylobacter data
    if (!isCampylobacterRelated) {
      setCampylobacterData({
        guillainBarre: false,
        reactiveArthritis: false,
        chronicIBS: false,
        weeksSinceInfection: '',
        stoolCultureConfirmed: false,
      });
    }
// Phase 6: Reset Q Fever data
    if (!isQFeverRelated) {
      setQFeverData({
        chronicQFever: false,
        endocarditis: false,
        fatigueSyndrome: false,
        monthsSinceInfection: '',
        phaseIAntibodies: false,
      });
    }
    if (!isSalmonellaRelated) {
      setSalmonellaData({
        hospitalized: false,
        bacteremia: false,
        reactiveArthritis: false,
        severeComplications: false,
        stoolCultureConfirmed: false,
      });
    }
    if (!isShigellaRelated) {
      setShigellaData({
        hospitalized: false,
        hus: false,
        reactiveArthritis: false,
        severeComplications: false,
        stoolCultureConfirmed: false,
      });
    }
    if (!isWestNileRelated) {
      setWestNileData({
        neuroinvasive: false,
        encephalitis: false,
        acuteFlaccidParalysis: false,
        permanentImpairment: false,
        serologyConfirmed: false,
      });
    }
    if (!isNTMRelated) {
      setNtmData({
        activeDisease: false,
        onTreatment: false,
        disseminated: false,
        monthsOnTreatment: '',
        ntmSpecies: '',
      });
    }
    // Phase 7: Reset dental data
    if (!isDentalOralRelated) {
      setDentalData({
        affectedArea: '', isJawRelated: false, isBoneRelated: false, isToothRelated: false,
        isProsthesisRelated: false, jawPainSide: '', jawPainSeverity: 5, jawOpening: '',
        jawLocking: false, jawClicking: false, jawDeviation: false, boneInfection: false,
        boneExposed: false, boneDrainage: false, toothCount: '', toothLocation: [],
        toothLossCause: '', prosthesisType: '', prosthesisFunction: '', prosthesisPain: false,
        prosthesisFit: '', palatePain: false, palateUlcers: false, palateInfection: false,
        chewingDifficulty: '', swallowingDifficulty: '', dietaryRestrictions: '',
        speechDifficulty: false, oralMass: false, massLocation: '', massBiopsy: '',
        treatmentStatus: '', activeInfection: false, infectionType: '', antibioticUse: false,
        workMissed: false, eatingImpaired: false, socialImpact: false,
      });
    }
    // ============================================
    // PHASE 8A: MENTAL HEALTH EXPANSION - RESET STATE
    // ============================================
    if (!isAnorexiaRelated) {
      setEatingDisorderData({
        currentWeight: '',
        expectedMinimumWeight: '',
        weightPercentage: '',
        incapacitatingEpisode: false,
        episodeDuration: '',
        hospitalized: false,
        hospitalizationReason: '',
        tubeFeeding: false,
        parenteralNutrition: false,
        bingeEpisode: false,
        purgingEpisode: false,
        compensatoryBehaviors: [],
        restrictedIntake: false,
      });
    }
    if (!isBulimiaRelated) {
      setEatingDisorderData({
        currentWeight: '',
        expectedMinimumWeight: '',
        weightPercentage: '',
        incapacitatingEpisode: false,
        episodeDuration: '',
        hospitalized: false,
        hospitalizationReason: '',
        tubeFeeding: false,
        parenteralNutrition: false,
        bingeEpisode: false,
        purgingEpisode: false,
        compensatoryBehaviors: [],
        restrictedIntake: false,
      });
    }
    if (!isAnxietyFormRelated) {
      setAnxietyData({
        heartRacing: false,
        sweating: false,
        trembling: false,
        shortnessOfBreath: false,
        chestTightness: false,
        nausea: false,
        dizziness: false,
        hotFlashes: false,
        numbnessTingling: false,
        racingThoughts: false,
        fearOfLosingControl: false,
        fearOfDying: false,
        feelingDetached: false,
        difficultyConcentrating: false,
        avoidedSocial: false,
        leftEarly: false,
        calledOut: false,
        cancelledPlans: false,
        neededSafetyPerson: false,
        trigger: '',
        episodeDuration: '',
        wasPanicAttack: false,
      });
    }
    if (!isDepressionFormRelated) {
      setDepressionData({
        depressedMood: false,
        anhedonia: false,
        worthlessness: false,
        excessiveGuilt: false,
        hopelessness: false,
        irritability: false,
        insomnia: false,
        hypersomnia: false,
        decreasedAppetite: false,
        increasedAppetite: false,
        fatigue: false,
        psychomotorAgitation: false,
        psychomotorRetardation: false,
        difficultyConcentrating: false,
        difficultyDeciding: false,
        memoryProblems: false,
        thoughtsOfDeath: false,
        unableToGetUp: false,
        calledOutWork: false,
        neglectedSelfCare: false,
        socialWithdrawal: false,
        unableToCompleteTasks: false,
        suicidalIdeation: false,
        trigger: '',
        episodeContext: '',
      });
    }
    if (!isBipolarFormRelated) {
      setBipolarData({
        episodeType: '',
        elevatedMood: false,
        irritableMood: false,
        increasedEnergy: false,
        decreasedSleep: false,
        moreTalkative: false,
        racingThoughts: false,
        distractibility: false,
        increasedActivity: false,
        riskyBehavior: false,
        grandiosity: false,
        depressedMood: false,
        anhedonia: false,
        fatigue: false,
        worthlessness: false,
        sleepHours: '',
        riskyBehaviors: [],
        unableToWork: false,
        relationshipConflicts: false,
        legalProblems: false,
        hospitalizationRequired: false,
        episodeDuration: '',
      });
    }
    if (!isOCDFormRelated) {
      setOcdData({
        contaminationFears: false,
        fearOfHarm: false,
        needForSymmetry: false,
        forbiddenThoughts: false,
        religiousObsessions: false,
        hoardingUrges: false,
        otherObsession: '',
        washingCleaning: false,
        checking: false,
        repeating: false,
        counting: false,
        ordering: false,
        mentalRituals: false,
        reassuranceSeeking: false,
        otherCompulsion: '',
        timeConsumed: '',
        distressLevel: 5,
        lateToAppointments: false,
        avoidedSituations: false,
        interferedRoutines: false,
        relationshipProblems: false,
        unableToComplete: false,
        trigger: '',
      });
    }
    if (!isAdjustmentDisorderFormRelated) {
      setAdjustmentDisorderData({
        stressor: '',
        stressorDate: '',
        daysSinceStressor: '',
        presentationType: '',
        tearfulness: false,
        hopelessness: false,
        worry: false,
        physicalTension: false,
        impulsiveBehaviors: false,
        aggression: false,
        ruleViolations: false,
        recklessBehavior: false,
        workDifficulty: false,
        relationshipProblems: false,
        socialWithdrawal: false,
        selfCareNeglect: false,
        unableToFulfillResponsibilities: false,
        symptomsImproving: null,
        stillAffectingFunctioning: null,
        context: '',
      });
    }
    // Phase 8B: Reset mental health data
    if (!isBingeEatingRelated) {
      setBingeEatingData({
        bingeEpisode: false,
        lossOfControl: false,
        distressLevel: 5,
      });
    }
    if (!isDissociativeRelated) {
      setDissociativeData({
        memoryGap: false,
        lostTime: false,
        durationAmount: '',
        durationUnit: '' });
    }
    if (!isAcuteStressRelated) {
      setAcuteStressData({
        traumaDate: '',
        dissociativeSymptoms: false,
        avoidance: false,
      });
    }
    if (!isPersonalityDisorderRelated) {
      setPersonalityData({
        occupationalImpact: false,
        socialImpact: false,
      });
    }
  }, [selectedSymptom, isMigraineSelected, isSleepSelected, isNightmareSelected, isPTSDRelated, isPainSelected,
    isGISelected, isRespiratorySelected, isJointSelected, isSeizureSelected, isEyeRelated, isGenitourinaryRelated,
    isGynecologicalRelated, isAnemiaRelated, isSickleCellRelated, isBleedingDisorderRelated, isInfectionRelated,
    isLymphomaLeukemiaRelated, isPolycythemiaRelated, isTreatmentRelated, isB12DeficiencyRelated, isDentalOralRelated,
    isHIVRelated, isHepatitisRelated, isLymeRelated, isMalariaRelated, isBrucellosisRelated, isCampylobacterRelated,
    isQFeverRelated, isSalmonellaRelated, isShigellaRelated,isWestNileRelated, isNTMRelated, isAnorexiaRelated,
    isBulimiaRelated, isAnxietyFormRelated, isDepressionFormRelated, isBipolarFormRelated, isOCDFormRelated,
    isAdjustmentDisorderFormRelated, isBingeEatingRelated, isDissociativeRelated, isAcuteStressRelated,
    isPersonalityDisorderRelated]);


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

  // Phase 4: Detect gynecological organ/condition based on symptom
  useEffect(() => {
    if (isPrefilling.current) return;

    if (isGynecologicalRelated) {
      const menstrualSymptoms = ['heavy-menstrual-bleeding', 'irregular-periods', 'painful-periods', 'absent-periods', 'prolonged-bleeding', 'intermenstrual-bleeding', 'premenstrual-syndrome'];
      const endometriosisSymptoms = ['endometriosis-pain', 'endometriosis-bowel', 'endometriosis-bladder'];
      const ovarianSymptoms = ['ovarian-cysts', 'polycystic-ovaries', 'ovulation-pain', 'anovulation'];
      const pidSymptoms = ['pid-symptoms', 'abnormal-discharge', 'cervicitis'];
      const prolapseSymptoms = ['pelvic-pressure', 'vaginal-bulge', 'incomplete-bladder-emptying', 'bowel-dysfunction-prolapse'];
      const vulvaVaginaSymptoms = ['vulvovaginitis', 'vaginal-irritation'];
      const uterineSymptoms = ['uterine-cramping'];
      const sexualSymptoms = ['sexual-dysfunction', 'decreased-libido', 'arousal-difficulty', 'dyspareunia'];
      const pcosSymptoms = ['hirsutism', 'hormonal-acne', 'pcos-weight-changes'];

      let organ = '';
      if (menstrualSymptoms.includes(selectedSymptom)) organ = 'uterus';
      else if (endometriosisSymptoms.includes(selectedSymptom)) organ = 'multiple';
      else if (ovarianSymptoms.includes(selectedSymptom)) organ = 'ovary';
      else if (pidSymptoms.includes(selectedSymptom)) organ = 'fallopian-tube';
      else if (prolapseSymptoms.includes(selectedSymptom)) organ = 'multiple';
      else if (vulvaVaginaSymptoms.includes(selectedSymptom)) organ = 'vagina';
      else if (uterineSymptoms.includes(selectedSymptom)) organ = 'uterus';
      else if (sexualSymptoms.includes(selectedSymptom)) organ = 'multiple';
      else if (pcosSymptoms.includes(selectedSymptom)) organ = 'ovary';

      if (organ && gynecologicalData.affectedOrgan !== organ) {
        setGynecologicalData(prev => ({ ...prev, affectedOrgan: organ }));
      }
    }
  }, [selectedSymptom, isGynecologicalRelated]);

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
      occurredAt: occurredAt,
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
    // Phase 4: Add Gynecological Data
    if (isGynecologicalRelated) {
      entry.gynecologicalData = { ...gynecologicalData };
    }
    // Phase 5: Add Hemic/Lymphatic Data
    if (isAnemiaRelated) {
      entry.anemiaData = { ...anemiaData };
    }
    if (isSickleCellRelated) {
      entry.sickleCellData = { ...sickleCellData };
    }
    if (isBleedingDisorderRelated) {
      entry.bleedingDisorderData = { ...bleedingDisorderData };
    }
    if (isInfectionRelated) {
      entry.infectionData = { ...infectionData };
    }
    if (isLymphomaLeukemiaRelated) {
      entry.lymphomaLeukemiaData = { ...lymphomaLeukemiaData };
    }
    if (isPolycythemiaRelated) {
      entry.polycythemiaData = { ...polycythemiaData };
    }
    if (isTreatmentRelated) {
      entry.treatmentData = { ...treatmentData };
    }
    if (isB12DeficiencyRelated) {
      entry.b12DeficiencyData = { ...b12DeficiencyData };
    }
    // Phase 6: Add HIV/AIDS Data
    if (isHIVRelated) {
      entry.hivData = { ...hivData };
    }
    // Phase 6: Add Hepatitis data
    if (isHepatitisRelated) {
      entry.hepatitisData = { ...hepatitisData };
    }
    // Phase 6: Add Lyme Disease data
    if (isLymeRelated) {
      entry.lymeData = { ...lymeData };
    }
    if (isMalariaRelated) {
      entry.malariaData = { ...malariaData };
    }
    if (isBrucellosisRelated) {
      entry.brucellosisData = { ...brucellosisData };
    }
    if (isCampylobacterRelated) {
      entry.campylobacterData = { ...campylobacterData };
    }
    if (isQFeverRelated) {
      entry.qFeverData = { ...qFeverData };
    }
    if (isSalmonellaRelated) {
      entry.salmonellaData = { ...salmonellaData };
    }
    if (isShigellaRelated) {
      entry.shigellaData = { ...shigellaData };
    }
    if (isWestNileRelated) {
      entry.westNileData = { ...westNileData };
    }
    if (isNTMRelated) {
      entry.ntmData = { ...ntmData };
    }
    // Phase 7: Add Dental/Oral Data
    if (isDentalOralRelated) {
      entry.dentalData = { ...dentalData };
    }
    // Phase 8: Mental Health Conditions
    if (isAnorexiaRelated || isBulimiaRelated) {
      entry.eatingDisorderData = { ...eatingDisorderData };
    }
    if (isAnxietyFormRelated) {
      entry.anxietyData = { ...anxietyData };
    }
    if (isDepressionFormRelated) {
      entry.depressionData = { ...depressionData };
    }
    if (isBipolarFormRelated) {
      entry.bipolarData = { ...bipolarData };
    }
    if (isOCDFormRelated) {
      entry.ocdData = { ...ocdData };
    }
    if (isAdjustmentDisorderFormRelated) {
      entry.adjustmentDisorderData = { ...adjustmentDisorderData };
    }
    // Phase 8B: Mental health data
    if (isBingeEatingRelated && bingeEatingData) {
      entry.bingeEatingData = { ...bingeEatingData};
    }
    if (isDissociativeRelated && dissociativeData) {
      // Combine duration amount and unit into single string
      const duration = dissociativeData.durationAmount && dissociativeData.durationUnit
          ? `${dissociativeData.durationAmount} ${dissociativeData.durationUnit.toLowerCase()}`
          : '';

      entry.dissociativeData = {
        ...dissociativeData,
        duration // Keep the combined string for backward compatibility
      };
    }
    if (isAcuteStressRelated && acuteStressData) {
      entry.acuteStressData = { ...acuteStressData};
    }
    if (isPersonalityDisorderRelated && personalityData) {
      entry.personalityData = { ...personalityData};
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

    // Reset form after successful save
    setSelectedCategory('');
    setSelectedSymptom('');
    setSymptomName('');
    setSeverity(5);
    setNotes('');
    setOccurredAt(new Date().toISOString());
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

          {/* PHASE 8A EXTENDED: ANXIETY DISORDERS FORM */}
          {isAnxietyFormRelated && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-200">Anxiety Episode Details</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">Track physical symptoms, triggers, and impact for VA claims evidence</p>

                {/* Physical Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Physical Symptoms</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { key: 'heartRacing', label: 'Heart racing/palpitations' },
                      { key: 'sweating', label: 'Sweating' },
                      { key: 'trembling', label: 'Trembling/shaking' },
                      { key: 'shortnessOfBreath', label: 'Shortness of breath' },
                      { key: 'chestTightness', label: 'Chest tightness' },
                      { key: 'nausea', label: 'Nausea' },
                      { key: 'dizziness', label: 'Dizziness/lightheadedness' },
                      { key: 'hotFlashes', label: 'Hot flashes/chills' },
                      { key: 'numbnessTingling', label: 'Numbness/tingling' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            anxietyData[key] ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={anxietyData[key]}
                                 onChange={(e) => setAnxietyData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-blue-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Cognitive Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cognitive Symptoms</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'racingThoughts', label: 'Racing thoughts' },
                      { key: 'fearOfLosingControl', label: 'Fear of losing control' },
                      { key: 'fearOfDying', label: 'Fear of dying' },
                      { key: 'feelingDetached', label: 'Feeling detached from reality' },
                      { key: 'difficultyConcentrating', label: 'Difficulty concentrating' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            anxietyData[key] ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={anxietyData[key]}
                                 onChange={(e) => setAnxietyData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-blue-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Avoidance Behaviors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avoidance/Impact</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'avoidedSocial', label: 'Avoided social situations' },
                      { key: 'leftEarly', label: 'Left situation early' },
                      { key: 'calledOut', label: 'Called out of work/school' },
                      { key: 'cancelledPlans', label: 'Cancelled plans' },
                      { key: 'neededSafetyPerson', label: 'Required safety person present' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            anxietyData[key] ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={anxietyData[key]}
                                 onChange={(e) => setAnxietyData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-blue-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Episode Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Episode Duration</label>
                  <select value={anxietyData.episodeDuration}
                          onChange={(e) => setAnxietyData(prev => ({ ...prev, episodeDuration: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Select duration...</option>
                    <option value="<5min">Less than 5 minutes</option>
                    <option value="5-15min">5-15 minutes</option>
                    <option value="15-30min">15-30 minutes</option>
                    <option value="30-60min">30-60 minutes</option>
                    <option value=">1hr">More than 1 hour</option>
                  </select>
                </div>

                {/* Panic Attack Toggle */}
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={anxietyData.wasPanicAttack}
                           onChange={(e) => setAnxietyData(prev => ({ ...prev, wasPanicAttack: e.target.checked }))}
                           className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This was a panic attack</span>
                  </label>
                </div>

                {/* Trigger */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger/Situation</label>
                  <input type="text" value={anxietyData.trigger}
                         onChange={(e) => setAnxietyData(prev => ({ ...prev, trigger: e.target.value }))}
                         placeholder="What triggered this anxiety episode?"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> Document physical symptoms, triggers, and functional impact. Panic attacks require 4+ physical symptoms occurring simultaneously.
                </div>
              </div>
          )}

          {/* ============================================
              PHASE 8A EXTENDED: DEPRESSION FORM
              ============================================ */}
          {isDepressionFormRelated && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Depression Episode Details</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">Track mood, physical symptoms, and functional impact for VA claims evidence</p>

                {/* Mood Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mood Symptoms</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'depressedMood', label: 'Depressed mood most of the day' },
                      { key: 'anhedonia', label: 'Loss of interest/pleasure (anhedonia)' },
                      { key: 'worthlessness', label: 'Feelings of worthlessness' },
                      { key: 'excessiveGuilt', label: 'Excessive guilt' },
                      { key: 'hopelessness', label: 'Hopelessness about future' },
                      { key: 'irritability', label: 'Irritability' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            depressionData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={depressionData[key]}
                                 onChange={(e) => setDepressionData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Physical/Vegetative Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Physical/Vegetative Symptoms</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { key: 'insomnia', label: 'Insomnia' },
                      { key: 'hypersomnia', label: 'Hypersomnia (sleeping too much)' },
                      { key: 'decreasedAppetite', label: 'Decreased appetite' },
                      { key: 'increasedAppetite', label: 'Increased appetite' },
                      { key: 'fatigue', label: 'Fatigue/low energy' },
                      { key: 'psychomotorAgitation', label: 'Restlessness/agitation' },
                      { key: 'psychomotorRetardation', label: 'Slowed movements/speech' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            depressionData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={depressionData[key]}
                                 onChange={(e) => setDepressionData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Cognitive Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cognitive Symptoms</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'difficultyConcentrating', label: 'Difficulty concentrating' },
                      { key: 'difficultyDeciding', label: 'Difficulty making decisions' },
                      { key: 'memoryProblems', label: 'Memory problems' },
                      { key: 'thoughtsOfDeath', label: 'Recurrent thoughts of death (not ideation)' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            depressionData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={depressionData[key]}
                                 onChange={(e) => setDepressionData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Functional Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'unableToGetUp', label: 'Unable to get out of bed' },
                      { key: 'calledOutWork', label: 'Called out of work' },
                      { key: 'neglectedSelfCare', label: 'Neglected self-care (hygiene, eating)' },
                      { key: 'socialWithdrawal', label: 'Withdrew from social contact' },
                      { key: 'unableToCompleteTasks', label: 'Unable to complete daily tasks' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            depressionData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={depressionData[key]}
                                 onChange={(e) => setDepressionData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Suicidal Ideation */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={depressionData.suicidalIdeation}
                           onChange={(e) => setDepressionData(prev => ({ ...prev, suicidalIdeation: e.target.checked }))}
                           className="w-4 h-4 text-red-600 rounded" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-200">Suicidal ideation present</span>
                  </label>
                  {depressionData.suicidalIdeation && (
                      <div className="mt-2 text-xs text-red-800 dark:text-red-300">
                        <strong>Crisis Resources:</strong>
                        <div>988 Suicide & Crisis Lifeline: Call/text 988</div>
                        <div>Veterans Crisis Line: Call 988, press 1 | Text 838255</div>
                      </div>
                  )}
                </div>

                {/* Trigger/Stressor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger/Stressor (optional)</label>
                  <input type="text" value={depressionData.trigger}
                         onChange={(e) => setDepressionData(prev => ({ ...prev, trigger: e.target.value }))}
                         placeholder="What may have triggered this episode?"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                {/* Episode Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Episode Context</label>
                  <textarea value={depressionData.episodeContext}
                            onChange={(e) => setDepressionData(prev => ({ ...prev, episodeContext: e.target.value }))}
                            placeholder="Describe how this episode is affecting you..."
                            rows="3"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> MDD diagnosis requires 5+ symptoms including depressed mood or anhedonia, present most of the day, nearly every day for 2+ weeks.
                </div>
              </div>
          )}

          {/* ============================================
              PHASE 8A EXTENDED: BIPOLAR/CYCLOTHYMIC FORM
              ============================================ */}
          {isBipolarFormRelated && (
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                <h3 className="font-medium text-purple-900 dark:text-purple-200">Bipolar Episode Details</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300">Track mood state, symptoms, and functional impact for VA claims evidence</p>

                {/* Episode Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Episode Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'manic', label: 'Manic Episode' },
                      { value: 'hypomanic', label: 'Hypomanic Episode' },
                      { value: 'depressive', label: 'Depressive Episode' },
                      { value: 'mixed', label: 'Mixed Features' },
                    ].map(({ value, label }) => (
                        <button key={value} type="button"
                                onClick={() => setBipolarData(prev => ({ ...prev, episodeType: value }))}
                                className={`p-2 rounded-lg border text-sm font-medium ${
                                    bipolarData.episodeType === value
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                          {label}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Manic/Hypomanic Symptoms */}
                {(bipolarData.episodeType === 'manic' || bipolarData.episodeType === 'hypomanic' || bipolarData.episodeType === 'mixed') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manic/Hypomanic Symptoms</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: 'elevatedMood', label: 'Elevated/euphoric mood' },
                          { key: 'irritableMood', label: 'Irritable mood' },
                          { key: 'increasedEnergy', label: 'Increased energy/activity' },
                          { key: 'decreasedSleep', label: 'Decreased need for sleep' },
                          { key: 'moreTalkative', label: 'More talkative than usual' },
                          { key: 'racingThoughts', label: 'Racing thoughts/flight of ideas' },
                          { key: 'distractibility', label: 'Distractibility' },
                          { key: 'increasedActivity', label: 'Increased goal-directed activity' },
                          { key: 'riskyBehavior', label: 'Engaging in risky behaviors' },
                          { key: 'grandiosity', label: 'Grandiosity/inflated self-esteem' },
                        ].map(({ key, label }) => (
                            <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                bipolarData[key] ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}>
                              <input type="checkbox" checked={bipolarData[key]}
                                     onChange={(e) => setBipolarData(prev => ({ ...prev, [key]: e.target.checked }))}
                                     className="w-4 h-4 text-purple-600 rounded" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                            </label>
                        ))}
                      </div>
                    </div>
                )}

                {/* Depressive Symptoms */}
                {(bipolarData.episodeType === 'depressive' || bipolarData.episodeType === 'mixed') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Depressive Symptoms</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: 'depressedMood', label: 'Depressed mood' },
                          { key: 'anhedonia', label: 'Loss of interest/pleasure' },
                          { key: 'fatigue', label: 'Fatigue/low energy' },
                          { key: 'worthlessness', label: 'Feelings of worthlessness' },
                        ].map(({ key, label }) => (
                            <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                bipolarData[key] ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}>
                              <input type="checkbox" checked={bipolarData[key]}
                                     onChange={(e) => setBipolarData(prev => ({ ...prev, [key]: e.target.checked }))}
                                     className="w-4 h-4 text-purple-600 rounded" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                            </label>
                        ))}
                      </div>
                    </div>
                )}

                {/* Sleep Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sleep Hours Last Night</label>
                  <input type="number" value={bipolarData.sleepHours}
                         onChange={(e) => setBipolarData(prev => ({ ...prev, sleepHours: e.target.value }))}
                         placeholder="Hours of sleep"
                         min="0" max="24" step="0.5"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                {/* Risky Behaviors */}
                {(bipolarData.episodeType === 'manic' || bipolarData.episodeType === 'hypomanic') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risky Behaviors Today</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Excessive spending',
                          'Risky sexual behavior',
                          'Reckless driving',
                          'Substance use',
                          'Impulsive major decisions'
                        ].map(behavior => (
                            <label key={behavior} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                bipolarData.riskyBehaviors?.includes(behavior) ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}>
                              <input type="checkbox"
                                     checked={bipolarData.riskyBehaviors?.includes(behavior)}
                                     onChange={(e) => {
                                       const behaviors = e.target.checked
                                           ? [...(bipolarData.riskyBehaviors || []), behavior]
                                           : bipolarData.riskyBehaviors.filter(b => b !== behavior);
                                       setBipolarData(prev => ({ ...prev, riskyBehaviors: behaviors }));
                                     }}
                                     className="w-4 h-4 text-purple-600 rounded" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{behavior}</span>
                            </label>
                        ))}
                      </div>
                    </div>
                )}

                {/* Functional Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'unableToWork', label: 'Unable to work/attend school' },
                      { key: 'relationshipConflicts', label: 'Relationship conflicts' },
                      { key: 'legalProblems', label: 'Legal problems' },
                      { key: 'hospitalizationRequired', label: 'Hospitalization required' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            bipolarData[key] ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={bipolarData[key]}
                                 onChange={(e) => setBipolarData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-purple-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Episode Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Episode Duration</label>
                  <input type="text" value={bipolarData.episodeDuration}
                         onChange={(e) => setBipolarData(prev => ({ ...prev, episodeDuration: e.target.value }))}
                         placeholder="e.g., '3 days', '2 weeks'"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> Manic episodes last 1+ week, hypomanic 4+ days. Document sleep patterns, risky behaviors, and functional impairment.
                </div>
              </div>
          )}

          {/* PHASE 8A EXTENDED: OCD FORM */}
          {isOCDFormRelated && (
              <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800 space-y-4">
                <h3 className="font-medium text-teal-900 dark:text-teal-200">OCD Episode Details</h3>
                <p className="text-xs text-teal-700 dark:text-teal-300">Track obsessions, compulsions, time consumed, and impact for VA claims evidence</p>

                {/* Obsession Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Obsession Types</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'contaminationFears', label: 'Contamination fears' },
                      { key: 'fearOfHarm', label: 'Fear of harm to self/others' },
                      { key: 'needForSymmetry', label: 'Need for symmetry/exactness' },
                      { key: 'forbiddenThoughts', label: 'Forbidden/taboo thoughts' },
                      { key: 'religiousObsessions', label: 'Religious obsessions' },
                      { key: 'hoardingUrges', label: 'Hoarding urges' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            ocdData[key] ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={ocdData[key]}
                                 onChange={(e) => setOcdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                  <input type="text" value={ocdData.otherObsession}
                         onChange={(e) => setOcdData(prev => ({ ...prev, otherObsession: e.target.value }))}
                         placeholder="Other obsession type..."
                         className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                </div>

                {/* Compulsion Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compulsion Types</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'washingCleaning', label: 'Washing/cleaning' },
                      { key: 'checking', label: 'Checking' },
                      { key: 'repeating', label: 'Repeating actions' },
                      { key: 'counting', label: 'Counting' },
                      { key: 'ordering', label: 'Ordering/arranging' },
                      { key: 'mentalRituals', label: 'Mental rituals' },
                      { key: 'reassuranceSeeking', label: 'Reassurance seeking' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            ocdData[key] ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={ocdData[key]}
                                 onChange={(e) => setOcdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                  <input type="text" value={ocdData.otherCompulsion}
                         onChange={(e) => setOcdData(prev => ({ ...prev, otherCompulsion: e.target.value }))}
                         placeholder="Other compulsion type..."
                         className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                </div>

                {/* Time Consumed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Consumed by Obsessions/Compulsions</label>
                  <select value={ocdData.timeConsumed}
                          onChange={(e) => setOcdData(prev => ({ ...prev, timeConsumed: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="">Select time...</option>
                    <option value="<1hr">Less than 1 hour/day</option>
                    <option value="1-3hr">1-3 hours/day</option>
                    <option value="3-8hr">3-8 hours/day</option>
                    <option value=">8hr">More than 8 hours/day</option>
                    <option value="constant">Nearly constant</option>
                  </select>
                </div>

                {/* Distress Level Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Distress Level: {ocdData.distressLevel}/10
                  </label>
                  <input type="range" min="0" max="10" value={ocdData.distressLevel}
                         onChange={(e) => setOcdData(prev => ({ ...prev, distressLevel: parseInt(e.target.value) }))}
                         className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>No distress</span>
                    <span>Extreme distress</span>
                  </div>
                </div>

                {/* Functional Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'lateToAppointments', label: 'Late to work/appointments' },
                      { key: 'avoidedSituations', label: 'Avoided situations' },
                      { key: 'interferedRoutines', label: 'Interfered with daily routines' },
                      { key: 'relationshipProblems', label: 'Family/relationship problems' },
                      { key: 'unableToComplete', label: 'Unable to complete tasks' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            ocdData[key] ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={ocdData[key]}
                                 onChange={(e) => setOcdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Trigger/Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger/Context</label>
                  <input type="text" value={ocdData.trigger}
                         onChange={(e) => setOcdData(prev => ({ ...prev, trigger: e.target.value }))}
                         placeholder="What triggered these obsessions/compulsions?"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="bg-teal-100 dark:bg-teal-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> OCD diagnosis requires time-consuming obsessions/compulsions (1+ hour/day) causing significant distress or functional impairment.
                </div>
              </div>
          )}

          {/* ADJUSTMENT DISORDER FORM */}
          {isAdjustmentDisorderFormRelated && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 space-y-4">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-200">Adjustment Disorder Episode Details</h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Track stressor, timeline, and response for VA claims evidence</p>

                {/* Stressor Information */}
                <div className="space-y-3 bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-200">Stressor Information</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      What was the stressor/trigger?
                    </label>
                    <textarea
                        value={adjustmentDisorderData.stressor}
                        onChange={(e) => setAdjustmentDisorderData(prev => ({ ...prev, stressor: e.target.value }))}
                        placeholder="Describe the stressor that triggered these symptoms (e.g., job loss, relationship breakup, deployment, relocation)"
                        rows="3"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      When did the stressor occur?
                    </label>
                    <input
                        type="date"
                        value={adjustmentDisorderData.stressorDate}
                        onChange={(e) => {
                          const date = e.target.value;
                          const days = date ? Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) : '';
                          setAdjustmentDisorderData(prev => ({
                            ...prev,
                            stressorDate: date,
                            daysSinceStressor: days.toString()
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {adjustmentDisorderData.daysSinceStressor && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {adjustmentDisorderData.daysSinceStressor} days ago
                          {parseInt(adjustmentDisorderData.daysSinceStressor) > 180 &&
                              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                            (Chronic - 6+ months)
                          </span>
                          }
                        </p>
                    )}
                  </div>
                </div>

                {/* Symptom Presentation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symptom Presentation (Select primary type)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: 'depressed', label: 'With Depressed Mood' },
                      { value: 'anxiety', label: 'With Anxiety' },
                      { value: 'mixed-emotions', label: 'With Mixed Anxiety and Depressed Mood' },
                      { value: 'conduct', label: 'With Disturbance of Conduct' },
                      { value: 'mixed-conduct-emotions', label: 'With Mixed Disturbance of Emotions and Conduct' },
                      { value: 'unspecified', label: 'Unspecified' },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setAdjustmentDisorderData(prev => ({ ...prev, presentationType: value }))}
                            className={`p-2 rounded-lg border text-sm text-left ${
                                adjustmentDisorderData.presentationType === value
                                    ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-200 font-medium'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {label}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Emotional/Behavioral Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emotional/Behavioral Symptoms
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { key: 'tearfulness', label: 'Tearfulness/crying' },
                      { key: 'hopelessness', label: 'Feelings of hopelessness' },
                      { key: 'worry', label: 'Worry/nervousness' },
                      { key: 'physicalTension', label: 'Physical tension' },
                      { key: 'impulsiveBehaviors', label: 'Impulsive behaviors' },
                      { key: 'aggression', label: 'Aggression/acting out' },
                      { key: 'ruleViolations', label: 'Rule violations' },
                      { key: 'recklessBehavior', label: 'Reckless behavior' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            adjustmentDisorderData[key]
                                ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input
                              type="checkbox"
                              checked={adjustmentDisorderData[key]}
                              onChange={(e) => setAdjustmentDisorderData(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="w-4 h-4 text-yellow-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Functional Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Functional Impact
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'workDifficulty', label: 'Difficulty at work/school' },
                      { key: 'relationshipProblems', label: 'Relationship problems' },
                      { key: 'socialWithdrawal', label: 'Social withdrawal' },
                      { key: 'selfCareNeglect', label: 'Self-care neglect' },
                      { key: 'unableToFulfillResponsibilities', label: 'Unable to fulfill responsibilities' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            adjustmentDisorderData[key]
                                ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input
                              type="checkbox"
                              checked={adjustmentDisorderData[key]}
                              onChange={(e) => setAdjustmentDisorderData(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="w-4 h-4 text-yellow-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-3 bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-200">Progress Tracking</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Are symptoms improving?
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                        { value: null, label: 'Unsure' },
                      ].map(({ value, label }) => (
                          <button
                              key={String(value)}
                              type="button"
                              onClick={() => setAdjustmentDisorderData(prev => ({ ...prev, symptomsImproving: value }))}
                              className={`flex-1 p-2 rounded-lg border text-sm ${
                                  adjustmentDisorderData.symptomsImproving === value
                                      ? 'bg-yellow-200 dark:bg-yellow-900/70 border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 font-medium'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            {label}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Still affecting daily functioning?
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                        { value: null, label: 'Somewhat' },
                      ].map(({ value, label }) => (
                          <button
                              key={String(value)}
                              type="button"
                              onClick={() => setAdjustmentDisorderData(prev => ({ ...prev, stillAffectingFunctioning: value }))}
                              className={`flex-1 p-2 rounded-lg border text-sm ${
                                  adjustmentDisorderData.stillAffectingFunctioning === value
                                      ? 'bg-yellow-200 dark:bg-yellow-900/70 border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 font-medium'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            {label}
                          </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Context (optional)
                  </label>
                  <textarea
                      value={adjustmentDisorderData.context}
                      onChange={(e) => setAdjustmentDisorderData(prev => ({ ...prev, context: e.target.value }))}
                      placeholder="Describe how the stressor is affecting you today..."
                      rows="3"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> Adjustment Disorder requires clear documentation of:
                  (1) Identifiable stressor, (2) Symptoms within 3 months of stressor onset, (3) Duration
                  (acute &lt;6 months, chronic ≥6 months), and (4) Functional impairment. Timeline documentation is critical.
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

          {/* Phase 4: Gynecological Details */}
          {isGynecologicalRelated && (
              <div className="space-y-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌸</span>
                  <h3 className="font-medium text-rose-900 dark:text-rose-200">Gynecological Details</h3>
                </div>

                {/* ALWAYS SHOW: Affected Organ Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Affected Organ/System</label>
                  <select value={gynecologicalData.affectedOrgan}
                          onChange={(e) => setGynecologicalData(prev => ({ ...prev, affectedOrgan: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <option value="">Select organ/system</option>
                    <option value="vulva">Vulva/Clitoris</option>
                    <option value="vagina">Vagina</option>
                    <option value="cervix">Cervix</option>
                    <option value="uterus">Uterus</option>
                    <option value="fallopian-tube">Fallopian Tube/PID</option>
                    <option value="ovary">Ovary/PCOS</option>
                    <option value="multiple">Multiple Organs (Endometriosis/Prolapse)</option>
                  </select>
                </div>

                {/* ALWAYS SHOW: General Pain Assessment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Type</label>
                    <select value={gynecologicalData.painType}
                            onChange={(e) => setGynecologicalData(prev => ({ ...prev, painType: e.target.value }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <option value="">Select pain type</option>
                      <option value="chronic-pelvic">Chronic Pelvic Pain</option>
                      <option value="dysmenorrhea">Menstrual Pain (Dysmenorrhea)</option>
                      <option value="dyspareunia">Pain with Intercourse (Dyspareunia)</option>
                      <option value="ovulation">Ovulation Pain (Mittelschmerz)</option>
                      <option value="other">Other Gynecological Pain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Location</label>
                    <select value={gynecologicalData.painLocation}
                            onChange={(e) => setGynecologicalData(prev => ({ ...prev, painLocation: e.target.value }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <option value="">Select location</option>
                      <option value="lower-abdomen">Lower Abdomen</option>
                      <option value="pelvic-center">Central Pelvis</option>
                      <option value="left-side">Left Side</option>
                      <option value="right-side">Right Side</option>
                      <option value="deep-pelvis">Deep Pelvic</option>
                      <option value="vaginal">Vaginal</option>
                    </select>
                  </div>
                </div>

                {/* CONDITIONAL: Endometriosis Section - Show for 'multiple' organs OR endometriosis symptoms */}
                {(gynecologicalData.affectedOrgan === 'multiple' ||
                    selectedSymptom?.includes('endometriosis')) && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Endometriosis</h4>

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                          gynecologicalData.endometriosisDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={gynecologicalData.endometriosisDiagnosed}
                               onChange={(e) => setGynecologicalData(prev => ({ ...prev, endometriosisDiagnosed: e.target.checked }))}
                               className="w-4 h-4 text-rose-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosed Endometriosis</span>
                      </label>

                      {gynecologicalData.endometriosisDiagnosed && (
                          <>
                            <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                                gynecologicalData.laparoscopyConfirmed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                            }`}>
                              <input type="checkbox" checked={gynecologicalData.laparoscopyConfirmed}
                                     onChange={(e) => setGynecologicalData(prev => ({ ...prev, laparoscopyConfirmed: e.target.checked }))}
                                     className="w-4 h-4 text-rose-600 rounded" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmed by Laparoscopy (Required for VA)</span>
                            </label>

                            {gynecologicalData.laparoscopyConfirmed && (
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Laparoscopy Date</label>
                                  <input type="date" value={gynecologicalData.laparoscopyDate}
                                         onChange={(e) => setGynecologicalData(prev => ({ ...prev, laparoscopyDate: e.target.value }))}
                                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                                </div>
                            )}

                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lesion Locations</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['Bowel', 'Bladder', 'Ovaries', 'Peritoneum', 'Uterosacral', 'Other'].map(location => (
                                    <label key={location} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                        gynecologicalData.lesionLocations.includes(location) ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                    }`}>
                                      <input type="checkbox" checked={gynecologicalData.lesionLocations.includes(location)}
                                             onChange={() => {
                                               setGynecologicalData(prev => ({
                                                 ...prev,
                                                 lesionLocations: prev.lesionLocations.includes(location)
                                                     ? prev.lesionLocations.filter(l => l !== location)
                                                     : [...prev.lesionLocations, location]
                                               }));
                                             }}
                                             className="w-4 h-4 text-rose-600 rounded" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{location}</span>
                                    </label>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                                  gynecologicalData.bowelSymptoms ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={gynecologicalData.bowelSymptoms}
                                       onChange={(e) => setGynecologicalData(prev => ({ ...prev, bowelSymptoms: e.target.checked }))}
                                       className="w-4 h-4 text-rose-600 rounded" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bowel Symptoms</span>
                              </label>

                              <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                                  gynecologicalData.bladderSymptoms ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}>
                                <input type="checkbox" checked={gynecologicalData.bladderSymptoms}
                                       onChange={(e) => setGynecologicalData(prev => ({ ...prev, bladderSymptoms: e.target.checked }))}
                                       className="w-4 h-4 text-rose-600 rounded" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bladder Symptoms</span>
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Type</label>
                                <select value={gynecologicalData.treatmentType}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, treatmentType: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select treatment</option>
                                  <option value="hormonal">Hormonal (Birth control, GnRH)</option>
                                  <option value="surgical">Surgical (Excision/Ablation)</option>
                                  <option value="pain-management">Pain Management Only</option>
                                  <option value="none">None</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Effectiveness</label>
                                <select value={gynecologicalData.treatmentEffectiveness}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, treatmentEffectiveness: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select effectiveness</option>
                                  <option value="controlled">Controlled</option>
                                  <option value="partially-controlled">Partially Controlled</option>
                                  <option value="not-controlled">Not Controlled</option>
                                </select>
                              </div>
                            </div>
                          </>
                      )}
                    </div>
                )}

                {/* CONDITIONAL: Menstrual Disorders/PCOS - Show for 'ovary' OR menstrual/pcos symptoms */}
                {(gynecologicalData.affectedOrgan === 'ovary' ||
                    selectedSymptom?.includes('menstrual') ||
                    selectedSymptom?.includes('period') ||
                    selectedSymptom?.includes('pcos') ||
                    selectedSymptom?.includes('ovarian')) && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Menstrual Disorders</h4>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cycle Regularity</label>
                          <select value={gynecologicalData.cycleRegularity}
                                  onChange={(e) => setGynecologicalData(prev => ({ ...prev, cycleRegularity: e.target.value }))}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                            <option value="">Select regularity</option>
                            <option value="regular">Regular (21-35 days)</option>
                            <option value="irregular">Irregular (varies)</option>
                            <option value="absent">Absent (Amenorrhea)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cycle Length (days)</label>
                          <input type="number" min="14" max="90" value={gynecologicalData.cycleLength}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, cycleLength: e.target.value }))}
                                 placeholder="28"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow Duration (days)</label>
                          <input type="number" min="1" max="14" value={gynecologicalData.flowDuration}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, flowDuration: e.target.value }))}
                                 placeholder="5"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow Heaviness</label>
                          <select value={gynecologicalData.flowHeaviness}
                                  onChange={(e) => setGynecologicalData(prev => ({ ...prev, flowHeaviness: e.target.value }))}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                            <option value="">Select flow heaviness</option>
                            <option value="spotting">Spotting Only</option>
                            <option value="light">Light</option>
                            <option value="moderate">Moderate</option>
                            <option value="heavy">Heavy (Menorrhagia)</option>
                            <option value="very-heavy">Very Heavy (Soaking Through)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dysmenorrhea Severity</label>
                          <select value={gynecologicalData.dysmenorrheaSeverity}
                                  onChange={(e) => setGynecologicalData(prev => ({ ...prev, dysmenorrheaSeverity: e.target.value }))}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                            <option value="">Select pain severity</option>
                            <option value="none">None</option>
                            <option value="mild">Mild (manageable)</option>
                            <option value="moderate">Moderate (interferes with activities)</option>
                            <option value="severe">Severe (incapacitating)</option>
                          </select>
                        </div>
                      </div>

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                          gynecologicalData.intermenstrualBleeding ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={gynecologicalData.intermenstrualBleeding}
                               onChange={(e) => setGynecologicalData(prev => ({ ...prev, intermenstrualBleeding: e.target.checked }))}
                               className="w-4 h-4 text-rose-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Intermenstrual Bleeding (Spotting Between Periods)</span>
                      </label>

                      {/* PCOS Subsection */}
                      <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg mt-3">
                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                            gynecologicalData.pcosDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={gynecologicalData.pcosDiagnosed}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, pcosDiagnosed: e.target.checked }))}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PCOS Diagnosed (rated under DC 7615)</span>
                        </label>

                        {gynecologicalData.pcosDiagnosed && (
                            <>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PCOS Symptoms Present</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {['Irregular Periods', 'Hirsutism', 'Acne', 'Weight Gain', 'Ovarian Cysts', 'Insulin Resistance'].map(symptom => (
                                      <label key={symptom} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                          gynecologicalData.pcosSymptoms.includes(symptom) ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                                      }`}>
                                        <input type="checkbox" checked={gynecologicalData.pcosSymptoms.includes(symptom)}
                                               onChange={() => {
                                                 setGynecologicalData(prev => ({
                                                   ...prev,
                                                   pcosSymptoms: prev.pcosSymptoms.includes(symptom)
                                                       ? prev.pcosSymptoms.filter(s => s !== symptom)
                                                       : [...prev.pcosSymptoms, symptom]
                                                 }));
                                               }}
                                               className="w-4 h-4 text-rose-600 rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                                      </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rotterdam Criteria Met</label>
                                <select value={gynecologicalData.rotterdamCriteriaMet}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, rotterdamCriteriaMet: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select criteria</option>
                                  <option value="2-of-3">2 of 3 Criteria (Diagnosis)</option>
                                  <option value="3-of-3">All 3 Criteria</option>
                                  <option value="not-assessed">Not Formally Assessed</option>
                                </select>
                              </div>
                            </>
                        )}
                      </div>
                    </div>
                )}

                {/* CONDITIONAL: PID Section - Show for 'fallopian-tube' OR pid symptoms */}
                {(gynecologicalData.affectedOrgan === 'fallopian-tube' ||
                    selectedSymptom?.includes('pid')) && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pelvic Inflammatory Disease</h4>

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                          gynecologicalData.pidDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={gynecologicalData.pidDiagnosed}
                               onChange={(e) => setGynecologicalData(prev => ({ ...prev, pidDiagnosed: e.target.checked }))}
                               className="w-4 h-4 text-rose-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosed PID</span>
                      </label>

                      {gynecologicalData.pidDiagnosed && (
                          <>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PID Type</label>
                                <select value={gynecologicalData.pidType}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, pidType: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select type</option>
                                  <option value="acute">Acute Episode</option>
                                  <option value="chronic">Chronic PID</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Episode Date</label>
                                <input type="date" value={gynecologicalData.lastEpisodeDate}
                                       onChange={(e) => setGynecologicalData(prev => ({ ...prev, lastEpisodeDate: e.target.value }))}
                                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                              </div>
                            </div>

                            <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                                gynecologicalData.recurrentInfections ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                            }`}>
                              <input type="checkbox" checked={gynecologicalData.recurrentInfections}
                                     onChange={(e) => setGynecologicalData(prev => ({ ...prev, recurrentInfections: e.target.checked }))}
                                     className="w-4 h-4 text-rose-600 rounded" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurrent Infections</span>
                            </label>

                            {gynecologicalData.recurrentInfections && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Episodes (past year)</label>
                                  <input type="number" min="1" max="20" value={gynecologicalData.numberOfEpisodes}
                                         onChange={(e) => setGynecologicalData(prev => ({ ...prev, numberOfEpisodes: e.target.value }))}
                                         placeholder="2"
                                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                                </div>
                            )}
                          </>
                      )}
                    </div>
                )}

                {/* CONDITIONAL: Pelvic Prolapse - Show for 'multiple' OR prolapse symptoms */}
                {(gynecologicalData.affectedOrgan === 'multiple' ||
                    selectedSymptom?.includes('prolapse') ||
                    selectedSymptom?.includes('pelvic-pressure') ||
                    selectedSymptom?.includes('vaginal-bulge')) && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pelvic Organ Prolapse</h4>

                      <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mb-3 ${
                          gynecologicalData.prolapseDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                      }`}>
                        <input type="checkbox" checked={gynecologicalData.prolapseDiagnosed}
                               onChange={(e) => setGynecologicalData(prev => ({ ...prev, prolapseDiagnosed: e.target.checked }))}
                               className="w-4 h-4 text-rose-600 rounded" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pelvic Organ Prolapse Diagnosed</span>
                      </label>

                      {gynecologicalData.prolapseDiagnosed && (
                          <>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prolapse Type</label>
                                <select value={gynecologicalData.prolapseType}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, prolapseType: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select type</option>
                                  <option value="cystocele">Cystocele (Bladder)</option>
                                  <option value="rectocele">Rectocele (Rectum)</option>
                                  <option value="uterine">Uterine Prolapse</option>
                                  <option value="vault">Vaginal Vault Prolapse</option>
                                  <option value="enterocele">Enterocele (Small Bowel)</option>
                                  <option value="multiple">Multiple Types</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">POP-Q Stage</label>
                                <select value={gynecologicalData.popStage}
                                        onChange={(e) => setGynecologicalData(prev => ({ ...prev, popStage: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                  <option value="">Select stage</option>
                                  <option value="0">Stage 0 (No prolapse)</option>
                                  <option value="1">Stage I (Mild - above hymen)</option>
                                  <option value="2">Stage II (Moderate - at hymen)</option>
                                  <option value="3">Stage III (Severe - below hymen)</option>
                                  <option value="4">Stage IV (Complete eversion)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Treatment</label>
                              <select value={gynecologicalData.prolapseTreatment}
                                      onChange={(e) => setGynecologicalData(prev => ({ ...prev, prolapseTreatment: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select treatment</option>
                                <option value="none">None</option>
                                <option value="pessary">Pessary</option>
                                <option value="pt">Pelvic Floor Physical Therapy</option>
                                <option value="surgical">Surgical Repair (Post-op)</option>
                              </select>
                            </div>
                          </>
                      )}
                    </div>
                )}

                {/* CONDITIONAL: Sexual Function - Show for sexual dysfunction symptoms */}
                {(selectedSymptom?.includes('sexual') ||
                    selectedSymptom?.includes('arousal') ||
                    selectedSymptom?.includes('libido') ||
                    selectedSymptom?.includes('dyspareunia')) && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sexual Function</h4>

                      <div className="grid grid-cols-3 gap-3">
                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                            gynecologicalData.sexualDysfunction ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={gynecologicalData.sexualDysfunction}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, sexualDysfunction: e.target.checked }))}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sexual Dysfunction</span>
                        </label>

                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                            gynecologicalData.arousalDifficulty ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={gynecologicalData.arousalDifficulty}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, arousalDifficulty: e.target.checked }))}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Arousal Difficulty</span>
                        </label>

                        <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                            gynecologicalData.libidoDecreased ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                        }`}>
                          <input type="checkbox" checked={gynecologicalData.libidoDecreased}
                                 onChange={(e) => setGynecologicalData(prev => ({ ...prev, libidoDecreased: e.target.checked }))}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Decreased Libido</span>
                        </label>
                      </div>
                    </div>
                )}

                {/* ALWAYS SHOW: Impact & Treatment */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Impact & Treatment</h4>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                        gynecologicalData.interferesDailyActivities ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                    }`}>
                      <input type="checkbox" checked={gynecologicalData.interferesDailyActivities}
                             onChange={(e) => setGynecologicalData(prev => ({ ...prev, interferesDailyActivities: e.target.checked }))}
                             className="w-4 h-4 text-rose-600 rounded" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interferes with Daily Activities</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                        gynecologicalData.workMissed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                    }`}>
                      <input type="checkbox" checked={gynecologicalData.workMissed}
                             onChange={(e) => setGynecologicalData(prev => ({ ...prev, workMissed: e.target.checked }))}
                             className="w-4 h-4 text-rose-600 rounded" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Missed Work</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                        gynecologicalData.continuousTreatmentRequired ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                    }`}>
                      <input type="checkbox" checked={gynecologicalData.continuousTreatmentRequired}
                             onChange={(e) => setGynecologicalData(prev => ({ ...prev, continuousTreatmentRequired: e.target.checked }))}
                             className="w-4 h-4 text-rose-600 rounded" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continuous Treatment Required</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Medications (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Birth Control Pills', 'GnRH Agonist', 'NSAIDs', 'Hormonal IUD', 'Aromatase Inhibitors', 'Pain Medication'].map(med => (
                          <label key={med} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                              gynecologicalData.treatmentMedications.includes(med) ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input type="checkbox" checked={gynecologicalData.treatmentMedications.includes(med)}
                                   onChange={() => {
                                     setGynecologicalData(prev => ({
                                       ...prev,
                                       treatmentMedications: prev.treatmentMedications.includes(med)
                                           ? prev.treatmentMedications.filter(m => m !== med)
                                           : [...prev.treatmentMedications, med]
                                     }));
                                   }}
                                   className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{med}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                </div>
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

          {/* Phase 7: Dental/Oral Conditions Form */}
          {isDentalOralRelated && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">🦷</span>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-lg">
                      Dental & Oral Condition Details
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Document dental/oral symptoms for VA disability ratings (DC 9900 series)
                    </p>
                  </div>
                </div>

                {/* Affected Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Affected Area
                  </label>
                  <select
                      value={dentalData.affectedArea}
                      onChange={(e) => setDentalData({...dentalData, affectedArea: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select affected area...</option>
                    <option value="jaw-mandible">Jaw (Mandible - Lower)</option>
                    <option value="jaw-maxilla">Jaw (Maxilla - Upper)</option>
                    <option value="jaw-bilateral">Jaw (Both Upper & Lower)</option>
                    <option value="jaw-tmj">TMJ (Temporomandibular Joint)</option>
                    <option value="teeth">Teeth</option>
                    <option value="palate">Hard Palate</option>
                    <option value="tongue">Tongue</option>
                    <option value="lips">Lips</option>
                    <option value="gums">Gums/Gingiva</option>
                    <option value="oral-mucosa">Oral Mucosa (Mouth Lining)</option>
                    <option value="multiple">Multiple Areas</option>
                  </select>
                </div>

                {/* Condition Type Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition Type (check all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <input
                          type="checkbox"
                          checked={dentalData.isJawRelated}
                          onChange={(e) => setDentalData({...dentalData, isJawRelated: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Jaw/Bone Issue</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <input
                          type="checkbox"
                          checked={dentalData.isToothRelated}
                          onChange={(e) => setDentalData({...dentalData, isToothRelated: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tooth Loss/Damage</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <input
                          type="checkbox"
                          checked={dentalData.isBoneRelated}
                          onChange={(e) => setDentalData({...dentalData, isBoneRelated: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Bone Infection/Disease</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <input
                          type="checkbox"
                          checked={dentalData.isProsthesisRelated}
                          onChange={(e) => setDentalData({...dentalData, isProsthesisRelated: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Prosthesis/Denture Issue</span>
                    </label>
                  </div>
                </div>

                {/* Jaw-Related Symptoms */}
                {dentalData.isJawRelated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Jaw Symptoms</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Jaw Pain Side
                          </label>
                          <select
                              value={dentalData.jawPainSide}
                              onChange={(e) => setDentalData({...dentalData, jawPainSide: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select side...</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="bilateral">Both Sides (Bilateral)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Maximum Jaw Opening (if known)
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Jaw Pain Severity (0-10)
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
                          <span className="text-xs text-gray-500 dark:text-gray-400">Worst pain</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Jaw Movement Issues
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={dentalData.jawLocking}
                                onChange={(e) => setDentalData({...dentalData, jawLocking: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Jaw Locking/Stuck</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={dentalData.jawClicking}
                                onChange={(e) => setDentalData({...dentalData, jawClicking: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Clicking/Popping Sounds</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={dentalData.jawDeviation}
                                onChange={(e) => setDentalData({...dentalData, jawDeviation: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Jaw Deviation/Misalignment</span>
                          </label>
                        </div>
                      </div>
                    </div>
                )}

                {/* Bone-Related Issues */}
                {dentalData.isBoneRelated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Bone/Structural Issues</h4>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={dentalData.boneInfection}
                              onChange={(e) => setDentalData({...dentalData, boneInfection: e.target.checked})}
                              className="rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Bone Infection (Osteomyelitis)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={dentalData.boneExposed}
                              onChange={(e) => setDentalData({...dentalData, boneExposed: e.target.checked})}
                              className="rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Exposed Bone (Visible/Palpable)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={dentalData.boneDrainage}
                              onChange={(e) => setDentalData({...dentalData, boneDrainage: e.target.checked})}
                              className="rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Drainage from Bone/Jaw</span>
                        </label>
                      </div>

                      {dentalData.boneInfection && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              ⚠️ Osteomyelitis is serious - rated under DC 5000 (bone infection). Document all treatment,
                              antibiotics, and surgical interventions.
                            </p>
                          </div>
                      )}
                    </div>
                )}

                {/* Tooth Loss/Damage */}
                {dentalData.isToothRelated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Tooth Loss Documentation</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number of Missing Teeth
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total count out of 32 adult teeth</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location of Missing Teeth (select all that apply)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'upper', label: 'Upper/Maxilla' },
                            { value: 'lower', label: 'Lower/Mandible' },
                            { value: 'anterior', label: 'Anterior (Front)' },
                            { value: 'posterior', label: 'Posterior (Back)' }
                          ].map(option => (
                              <label key={option.value} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={dentalData.toothLocation.includes(option.value)}
                                    onChange={(e) => {
                                      const newLocations = e.target.checked
                                          ? [...dentalData.toothLocation, option.value]
                                          : dentalData.toothLocation.filter(l => l !== option.value);
                                      setDentalData({...dentalData, toothLocation: newLocations});
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
                          Cause of Tooth Loss ⚠️ IMPORTANT
                        </label>
                        <select
                            value={dentalData.toothLossCause}
                            onChange={(e) => setDentalData({...dentalData, toothLossCause: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select cause...</option>
                          <option value="bone-loss-trauma">Bone Loss from Trauma</option>
                          <option value="bone-loss-osteomyelitis">Bone Loss from Osteomyelitis</option>
                          <option value="bone-loss-disease">Bone Loss from Disease (e.g., cancer, radiation)</option>
                          <option value="periodontal">Periodontal Disease Only</option>
                          <option value="decay">Decay/Cavities Only</option>
                          <option value="unknown">Unknown/Multiple Causes</option>
                        </select>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            💡 VA only rates tooth loss if due to bone loss from trauma or disease (NOT periodontal disease alone).
                            Document the underlying bone/jaw condition causing tooth loss.
                          </p>
                        </div>
                      </div>
                    </div>
                )}

                {/* Prosthesis/Denture Information */}
                {dentalData.isProsthesisRelated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Prosthesis/Denture Details</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type of Prosthesis
                        </label>
                        <select
                            value={dentalData.prosthesisType}
                            onChange={(e) => setDentalData({...dentalData, prosthesisType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select type...</option>
                          <option value="none">No Prosthesis</option>
                          <option value="partial-removable">Partial Denture (Removable)</option>
                          <option value="complete-upper">Complete Upper Denture</option>
                          <option value="complete-lower">Complete Lower Denture</option>
                          <option value="complete-both">Complete Dentures (Both)</option>
                          <option value="implants">Dental Implants</option>
                          <option value="bridge">Fixed Bridge</option>
                        </select>
                      </div>

                      {dentalData.prosthesisType && dentalData.prosthesisType !== 'none' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Does Prosthesis Restore Masticatory Function?
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDentalData({...dentalData, prosthesisFunction: 'restores'})}
                                    className={`p-2 rounded-lg border transition-colors ${
                                        dentalData.prosthesisFunction === 'restores'
                                            ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                  Yes, Restores Function
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDentalData({...dentalData, prosthesisFunction: 'does-not-restore'})}
                                    className={`p-2 rounded-lg border transition-colors ${
                                        dentalData.prosthesisFunction === 'does-not-restore'
                                            ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                  No, Does NOT Restore
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Higher VA rating if prosthesis does NOT restore ability to chew
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prosthesis Fit
                              </label>
                              <select
                                  value={dentalData.prosthesisFit}
                                  onChange={(e) => setDentalData({...dentalData, prosthesisFit: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="">Select fit quality...</option>
                                <option value="good">Good Fit</option>
                                <option value="acceptable">Acceptable Fit</option>
                                <option value="poor">Poor Fit</option>
                                <option value="ill-fitting">Ill-Fitting/Unusable</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={dentalData.prosthesisPain}
                                    onChange={(e) => setDentalData({...dentalData, prosthesisPain: e.target.checked})}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Pain from Prosthesis</span>
                              </label>
                            </div>
                          </>
                      )}
                    </div>
                )}

                {/* Palate Issues */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hard Palate Symptoms
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.palatePain}
                          onChange={(e) => setDentalData({...dentalData, palatePain: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Palate Pain</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.palateUlcers}
                          onChange={(e) => setDentalData({...dentalData, palateUlcers: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Palate Ulcers/Sores</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.palateInfection}
                          onChange={(e) => setDentalData({...dentalData, palateInfection: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Palate Infection</span>
                    </label>
                  </div>
                </div>

                {/* Mastication/Swallowing Function */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Eating/Speaking Function</h4>

                  <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Swallowing Difficulty
                      </label>
                      <select
                          value={dentalData.swallowingDifficulty}
                          onChange={(e) => setDentalData({...dentalData, swallowingDifficulty: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select level...</option>
                        <option value="none">No Difficulty</option>
                        <option value="mild">Mild Difficulty</option>
                        <option value="moderate">Moderate Difficulty</option>
                        <option value="severe">Severe Difficulty</option>
                        <option value="unable">Unable to Swallow Solids</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dietary Restrictions Due to Dental/Oral Condition
                    </label>
                    <select
                        value={dentalData.dietaryRestrictions}
                        onChange={(e) => setDentalData({...dentalData, dietaryRestrictions: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select dietary restrictions...</option>
                      <option value="none">No Restrictions</option>
                      <option value="semi-solid">Semi-solid Foods Required</option>
                      <option value="soft">Soft Foods Required</option>
                      <option value="puree">Pureed Foods Required</option>
                      <option value="full-liquid">Full Liquid Diet Required</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Dietary restrictions increase VA rating for jaw/mouth conditions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.speechDifficulty}
                          onChange={(e) => setDentalData({...dentalData, speechDifficulty: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Speech/Articulation Difficulty</span>
                    </label>
                  </div>
                </div>

                {/* Neoplasm/Tumor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Neoplasm/Tumor/Growth
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={dentalData.oralMass}
                        onChange={(e) => setDentalData({...dentalData, oralMass: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Oral Mass/Lump/Growth Present</span>
                  </label>

                  {dentalData.oralMass && (
                      <div className="mt-3 space-y-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mass Location
                          </label>
                          <input
                              type="text"
                              value={dentalData.massLocation}
                              onChange={(e) => setDentalData({...dentalData, massLocation: e.target.value})}
                              placeholder="e.g., left cheek, floor of mouth, tongue"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Biopsy Result
                          </label>
                          <select
                              value={dentalData.massBiopsy}
                              onChange={(e) => setDentalData({...dentalData, massBiopsy: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select result...</option>
                            <option value="benign">Benign (Non-cancerous)</option>
                            <option value="malignant">Malignant (Cancerous)</option>
                            <option value="pending">Biopsy Pending</option>
                            <option value="not-biopsied">Not Yet Biopsied</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Treatment Status
                          </label>
                          <select
                              value={dentalData.treatmentStatus}
                              onChange={(e) => setDentalData({...dentalData, treatmentStatus: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select status...</option>
                            <option value="none">No Treatment Yet</option>
                            <option value="active-treatment">Active Treatment (Chemo/Radiation)</option>
                            <option value="post-surgical">Post-Surgical</option>
                            <option value="surveillance">Surveillance/Monitoring</option>
                            <option value="recurrent">Recurrent After Treatment</option>
                          </select>
                        </div>

                        {dentalData.massBiopsy === 'malignant' && (
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                              <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                                ⚠️ Malignant oral neoplasms rate 100% during and for 6 months after treatment (DC 9918).
                                Document all treatment dates and ongoing side effects.
                              </p>
                            </div>
                        )}
                      </div>
                  )}
                </div>

                {/* Infection/Inflammation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Infection/Inflammation
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={dentalData.activeInfection}
                        onChange={(e) => setDentalData({...dentalData, activeInfection: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active Infection/Abscess</span>
                  </label>

                  {dentalData.activeInfection && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type of Infection
                          </label>
                          <input
                              type="text"
                              value={dentalData.infectionType}
                              onChange={(e) => setDentalData({...dentalData, infectionType: e.target.value})}
                              placeholder="e.g., dental abscess, gum infection, jaw osteomyelitis"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={dentalData.antibioticUse}
                              onChange={(e) => setDentalData({...dentalData, antibioticUse: e.target.checked})}
                              className="rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Currently on Antibiotics</span>
                        </label>
                      </div>
                  )}
                </div>

                {/* Impact on Daily Life */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Impact on Daily Activities
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.eatingImpaired}
                          onChange={(e) => setDentalData({...dentalData, eatingImpaired: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Interferes with Eating/Nutrition</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.workMissed}
                          onChange={(e) => setDentalData({...dentalData, workMissed: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Caused Missed Work</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={dentalData.socialImpact}
                          onChange={(e) => setDentalData({...dentalData, socialImpact: e.target.checked})}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Affects Social Activities/Appearance</span>
                    </label>
                  </div>
                </div>
              </div>
          )}


          {/* Phase 6: HIV/AIDS Form */}
          {isHIVRelated && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🦠</span>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-300 text-lg">
                      HIV/AIDS Symptom Details
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Document symptoms to support VA rating under DC 6351
                    </p>
                  </div>
                </div>

                {/* Opportunistic Infection */}
                {selectedSymptom === 'hiv-opportunistic-infection' && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700 space-y-3">
                      <h4 className="font-medium text-red-900 dark:text-red-300">Opportunistic Infection Details</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type of Infection *
                        </label>
                        <select
                            value={hivData.infectionType}
                            onChange={(e) => setHivData({...hivData, infectionType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select infection type...</option>
                          <option value="Pneumocystis jirovecii pneumonia (PCP)">Pneumocystis jirovecii pneumonia (PCP)</option>
                          <option value="Cytomegalovirus (CMV)">Cytomegalovirus (CMV)</option>
                          <option value="Mycobacterium avium complex (MAC)">Mycobacterium avium complex (MAC)</option>
                          <option value="Toxoplasmosis">Toxoplasmosis</option>
                          <option value="Cryptococcosis">Cryptococcosis</option>
                          <option value="Histoplasmosis">Histoplasmosis</option>
                          <option value="Tuberculosis (TB)">Tuberculosis (TB)</option>
                          <option value="Candidiasis (esophageal)">Candidiasis (esophageal)</option>
                          <option value="Progressive multifocal leukoencephalopathy (PML)">Progressive multifocal leukoencephalopathy (PML)</option>
                          <option value="Other">Other (specify in notes)</option>
                        </select>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          ⚠️ <strong>Recurrent opportunistic infections may qualify for 100% rating.</strong> Document each episode separately and note treatment/hospitalization.
                        </p>
                      </div>
                    </div>
                )}

                {/* Constitutional Symptoms Checklist */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Constitutional Symptoms</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select all symptoms present (required for 30% minimum rating):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={hivData.constitutionalSymptoms?.includes('night-sweats')}
                          onChange={(e) => {
                            const symptoms = hivData.constitutionalSymptoms || [];
                            if (e.target.checked) {
                              setHivData({...hivData, constitutionalSymptoms: [...symptoms, 'night-sweats']});
                            } else {
                              setHivData({...hivData, constitutionalSymptoms: symptoms.filter(s => s !== 'night-sweats')});
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Night Sweats</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={hivData.constitutionalSymptoms?.includes('persistent-fever')}
                          onChange={(e) => {
                            const symptoms = hivData.constitutionalSymptoms || [];
                            if (e.target.checked) {
                              setHivData({...hivData, constitutionalSymptoms: [...symptoms, 'persistent-fever']});
                            } else {
                              setHivData({...hivData, constitutionalSymptoms: symptoms.filter(s => s !== 'persistent-fever')});
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Persistent Fever</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={hivData.constitutionalSymptoms?.includes('chronic-diarrhea')}
                          onChange={(e) => {
                            const symptoms = hivData.constitutionalSymptoms || [];
                            if (e.target.checked) {
                              setHivData({...hivData, constitutionalSymptoms: [...symptoms, 'chronic-diarrhea']});
                            } else {
                              setHivData({...hivData, constitutionalSymptoms: symptoms.filter(s => s !== 'chronic-diarrhea')});
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Chronic Diarrhea</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={hivData.constitutionalSymptoms?.includes('severe-fatigue')}
                          onChange={(e) => {
                            const symptoms = hivData.constitutionalSymptoms || [];
                            if (e.target.checked) {
                              setHivData({...hivData, constitutionalSymptoms: [...symptoms, 'severe-fatigue']});
                            } else {
                              setHivData({...hivData, constitutionalSymptoms: symptoms.filter(s => s !== 'severe-fatigue')});
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Severe Fatigue</span>
                    </label>
                  </div>
                </div>

                {/* Weight Loss Tracking */}
                {selectedSymptom === 'hiv-weight-loss' && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700 space-y-3">
                      <h4 className="font-medium text-red-900 dark:text-red-300">Weight Loss Documentation</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Percentage of Body Weight Lost *
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={hivData.weightLossPercentage}
                            onChange={(e) => setHivData({...hivData, weightLossPercentage: e.target.value})}
                            placeholder="e.g., 12.5"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ≥10% = Pathological weight loss (may support 100% rating with other symptoms)
                        </p>
                      </div>
                      {parseFloat(hivData.weightLossPercentage) >= 10 && (
                          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              ⚠️ <strong>Pathological weight loss documented.</strong> With debilitating constitutional symptoms, may support 100% rating.
                            </p>
                          </div>
                      )}
                    </div>
                )}

                {/* Treatment Information */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Treatment Information</h4>

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hivData.onAntiretrovirals}
                        onChange={(e) => setHivData({...hivData, onAntiretrovirals: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Currently on Antiretroviral Therapy (ART)
                    </span>
                  </label>

                  {hivData.onAntiretrovirals && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          ℹ️ Use of FDA-approved antiretroviral medications supports <strong>minimum 30% rating</strong> under DC 6351.
                        </p>
                      </div>
                  )}

                  {hivData.onAntiretrovirals && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Treatment Compliance
                        </label>
                        <select
                            value={hivData.treatmentCompliance}
                            onChange={(e) => setHivData({...hivData, treatmentCompliance: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select compliance level...</option>
                          <option value="excellent">Excellent (&gt;95% adherence)</option>
                          <option value="good">Good (85-95% adherence)</option>
                          <option value="fair">Fair (70-85% adherence)</option>
                          <option value="poor">Poor (&lt;70% adherence)</option>
                        </select>
                      </div>
                  )}
                </div>

                {/* CD4 Count Information */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Lab Values (Optional)</h4>

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hivData.cd4CountKnown}
                        onChange={(e) => setHivData({...hivData, cd4CountKnown: e.target.checked, cd4Range: e.target.checked ? hivData.cd4Range : ''})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I know my CD4 count range
                    </span>
                  </label>

                  {hivData.cd4CountKnown && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Most Recent CD4 Count Range
                        </label>
                        <select
                            value={hivData.cd4Range}
                            onChange={(e) => setHivData({...hivData, cd4Range: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Select CD4 range...</option>
                          <option value="<200">&lt;200 (AIDS diagnosis, severe immunosuppression)</option>
                          <option value="200-500">200-500 (Moderate immunosuppression)</option>
                          <option value=">500">&gt;500 (Normal to near-normal)</option>
                        </select>
                        {hivData.cd4Range === '<200' && (
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mt-2">
                              <p className="text-sm text-red-800 dark:text-red-200">
                                ⚠️ CD4 &lt;200 indicates AIDS and supports <strong>minimum 30% rating</strong>.
                              </p>
                            </div>
                        )}
                        {hivData.cd4Range === '200-500' && (
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mt-2">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                ℹ️ CD4 200-500 with constitutional symptoms supports <strong>10% rating</strong>.
                              </p>
                            </div>
                        )}
                      </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 <strong>Tip:</strong> Use the Measurements tab to track CD4 counts and viral load over time for comprehensive evidence.
                    </p>
                  </div>
                </div>

                {/* VA Rating Guidance */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance (DC 6351)</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• <strong>100%:</strong> Recurrent opportunistic infections OR pathological weight loss with debilitating symptoms</li>
                    <li>• <strong>60%:</strong> Refractory constitutional symptoms, intermittent diarrhea, or post-opportunistic infection</li>
                    <li>• <strong>30%:</strong> Constitutional symptoms, CD4 &lt;200, or on antiretroviral medications</li>
                    <li>• <strong>10%:</strong> Mild constitutional symptoms, CD4 200-500, or depression/memory loss</li>
                    <li>• <strong>0%:</strong> Asymptomatic with HIV diagnosis</li>
                  </ul>
                </div>
              </div>
          )}

          {/* Phase 6: Hepatitis (B & C) Form */}
          {isHepatitisRelated && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🦠</span>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-lg">
                      Hepatitis Symptom Details
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Document symptoms to support VA rating under DC 7354 (Hep C) or DC 7314 (Hep B)
                    </p>
                  </div>
                </div>

                {/* Weight Loss */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-amber-300 dark:border-amber-700 space-y-3">
                  <h4 className="font-medium text-amber-900 dark:text-amber-300">Weight Changes</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight Loss Percentage (if applicable)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={hepatitisData.weightLossPercentage}
                        onChange={(e) => setHepatitisData({...hepatitisData, weightLossPercentage: e.target.value})}
                        placeholder="e.g., 10.5"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ≥10% = Substantial weight loss (may support 60% rating)
                    </p>
                  </div>
                </div>

                {/* Symptom Severity */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Symptom Severity</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Symptom Frequency
                    </label>
                    <select
                        value={hepatitisData.symptomFrequency}
                        onChange={(e) => setHepatitisData({...hepatitisData, symptomFrequency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select frequency...</option>
                      <option value="daily">Daily (every day or nearly every day)</option>
                      <option value="intermittent">Intermittent (several times per week)</option>
                      <option value="rare">Rare (occasionally)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hepatitisData.debilitating}
                        onChange={(e) => setHepatitisData({...hepatitisData, debilitating: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Symptoms are debilitating (interfere with work/daily activities)
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={hepatitisData.dietaryRestrictions}
                        onChange={(e) => setHepatitisData({...hepatitisData, dietaryRestrictions: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Dietary restrictions required
                    </span>
                  </label>
                </div>

                {/* VA Rating Guidance */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• <strong>100%:</strong> Near-constant debilitating symptoms</li>
                    <li>• <strong>60%:</strong> Daily fatigue/malaise with substantial weight loss</li>
                    <li>• <strong>30%:</strong> Daily fatigue/malaise with minor weight loss</li>
                    <li>• <strong>10%:</strong> Intermittent fatigue/malaise</li>
                    <li>• <strong>0%:</strong> Nonsymptomatic</li>
                  </ul>
                </div>
              </div>
          )}

          {/* Phase 6: Lyme Disease Form */}
          {isLymeRelated && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🦟</span>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-300 text-lg">
                      Lyme Disease Symptom Details
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Document symptoms to support VA rating under DC 6319
                    </p>
                  </div>
                </div>

                {/* Treatment Status */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-300 dark:border-green-700 space-y-3">
                  <h4 className="font-medium text-green-900 dark:text-green-300">Treatment Status</h4>

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={lymeData.activeTreatment}
                        onChange={(e) => setLymeData({...lymeData, activeTreatment: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Currently undergoing active treatment (antibiotics)
                    </span>
                  </label>

                  {lymeData.activeTreatment && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          ⚠️ <strong>Active treatment rates 100%</strong> for minimum 6 months under DC 6319
                        </p>
                      </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={lymeData.treatmentCompleted}
                        onChange={(e) => setLymeData({...lymeData, treatmentCompleted: e.target.checked})}
                        className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Treatment completed (tracking residual symptoms)
                    </span>
                  </label>

                  {lymeData.treatmentCompleted && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Treatment Completion Date (approximate)
                        </label>
                        <input
                            type="date"
                            value={lymeData.treatmentStartDate}
                            onChange={(e) => setLymeData({...lymeData, treatmentStartDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                  )}
                </div>

                {/* Rash Details */}
                {selectedSymptom === 'lyme-rash' && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-300 dark:border-green-700 space-y-3">
                      <h4 className="font-medium text-green-900 dark:text-green-300">Rash Details</h4>

                      <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={lymeData.rashPresent}
                            onChange={(e) => setLymeData({...lymeData, rashPresent: e.target.checked})}
                            className="rounded border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Rash currently present or documented
                        </span>
                      </label>

                      {lymeData.rashPresent && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Rash Type
                            </label>
                            <select
                                value={lymeData.rashType}
                                onChange={(e) => setLymeData({...lymeData, rashType: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="">Select type...</option>
                              <option value="bulls-eye">Bull's-eye (Erythema migrans)</option>
                              <option value="expanding-red">Expanding red rash (non-bull's-eye)</option>
                              <option value="other">Other type</option>
                            </select>
                          </div>
                      )}
                    </div>
                )}

                {/* Residual Symptoms Tracking */}
                {lymeData.treatmentCompleted && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Post-Treatment Residual Symptoms</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        After treatment, residuals are rated under body system affected:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Nerve pain/numbness → Peripheral neuropathy rating</li>
                        <li>• Joint pain → Arthritis rating for affected joints</li>
                        <li>• Cognitive issues → Neurological rating</li>
                        <li>• Chronic fatigue → Chronic Fatigue Syndrome rating</li>
                        <li>• Cardiac issues → Heart condition rating</li>
                      </ul>
                    </div>
                )}

                {/* VA Rating Guidance */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance (DC 6319)</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• <strong>100%:</strong> Active disease requiring treatment (minimum 6 months)</li>
                    <li>• <strong>After Treatment:</strong> Rate residuals by affected body system</li>
                    <li>• Common residuals may require multiple diagnostic codes</li>
                    <li>• Document all persistent symptoms for proper rating</li>
                  </ul>
                </div>
              </div>
          )}

          {/* Phase 6: Malaria Form */}
          {isMalariaRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🦟 Malaria Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track malaria symptoms and episodes. Document cyclical fever patterns and relapses.
                  </p>

                  <div className="space-y-3">
                    {/* Fever Temperature */}
                    {selectedSymptom === 'malaria-fever' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fever Temperature (°F)
                          </label>
                          <input
                              type="number"
                              step="0.1"
                              value={malariaData.feverTemperature}
                              onChange={(e) => setMalariaData({...malariaData, feverTemperature: e.target.value})}
                              placeholder="e.g., 103.5"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                    )}

                    {/* Checkboxes */}
                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={malariaData.cyclicalPattern}
                          onChange={(e) => setMalariaData({...malariaData, cyclicalPattern: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Cyclical fever pattern (occurs every 48-72 hours)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={malariaData.relapseEpisode}
                          onChange={(e) => setMalariaData({...malariaData, relapseEpisode: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    This is a relapse episode (recurrence after treatment)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={malariaData.hospitalized}
                          onChange={(e) => setMalariaData({...malariaData, hospitalized: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hospitalized for malaria complications
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={malariaData.continuousMedication}
                          onChange={(e) => setMalariaData({...malariaData, continuousMedication: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    On continuous antimalarial medication
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={malariaData.severeComplications}
                          onChange={(e) => setMalariaData({...malariaData, severeComplications: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Severe complications (cerebral malaria, organ failure, severe anemia)
                  </span>
                    </label>
                  </div>

                  {/* VA Guidance */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Document fever patterns with temperature readings.
                      Track relapse episodes (especially common with P. vivax and P. ovale). Lab confirmation
                      of parasitemia strengthens claims. Cyclical fever every 48-72 hours is characteristic.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: Brucellosis Form */}
          {isBrucellosisRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🐄 Brucellosis Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track brucellosis symptoms. This infection can relapse for years and cause chronic arthritis/spondylitis.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={brucellosisData.undulantFever}
                          onChange={(e) => setBrucellosisData({...brucellosisData, undulantFever: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Undulant (wave-like) fever pattern
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={brucellosisData.relapseEpisode}
                          onChange={(e) => setBrucellosisData({...brucellosisData, relapseEpisode: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    This is a relapse episode (recurrence after treatment)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={brucellosisData.chronicArthritis}
                          onChange={(e) => setBrucellosisData({...brucellosisData, chronicArthritis: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Chronic arthritis or spondylitis (spine inflammation)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={brucellosisData.multiOrganInvolvement}
                          onChange={(e) => setBrucellosisData({...brucellosisData, multiOrganInvolvement: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Multiple organ involvement (liver, spleen, bones, joints)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={brucellosisData.neurobrucellosis}
                          onChange={(e) => setBrucellosisData({...brucellosisData, neurobrucellosis: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Neurobrucellosis (CNS involvement: meningitis, encephalitis)
                  </span>
                    </label>
                  </div>

                  {/* VA Guidance */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Brucellosis is common in military personnel exposed to
                      livestock in deployment areas. Document relapsing pattern and night sweats. Spine X-rays/MRI
                      important if back pain present. Blood cultures or serology confirms diagnosis.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: Campylobacter Form */}
          {isCampylobacterRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🦠 Campylobacter jejuni Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track post-infection complications. Campylobacter can trigger Guillain-Barré syndrome and reactive arthritis.
                  </p>

                  <div className="space-y-3">
                    {/* Weeks Since Infection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weeks Since Initial Infection
                      </label>
                      <input
                          type="number"
                          value={campylobacterData.weeksSinceInfection}
                          onChange={(e) => setCampylobacterData({...campylobacterData, weeksSinceInfection: e.target.value})}
                          placeholder="e.g., 2"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Reactive arthritis typically occurs 1-4 weeks after infection
                      </p>
                    </div>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={campylobacterData.stoolCultureConfirmed}
                          onChange={(e) => setCampylobacterData({...campylobacterData, stoolCultureConfirmed: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Stool culture confirmed Campylobacter jejuni
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={campylobacterData.reactiveArthritis}
                          onChange={(e) => setCampylobacterData({...campylobacterData, reactiveArthritis: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Reactive arthritis (joint inflammation post-infection)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={campylobacterData.chronicIBS}
                          onChange={(e) => setCampylobacterData({...campylobacterData, chronicIBS: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Post-infectious IBS (chronic bowel symptoms)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={campylobacterData.guillainBarre}
                          onChange={(e) => setCampylobacterData({...campylobacterData, guillainBarre: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    Guillain-Barré syndrome (GBS) - progressive muscle weakness
                  </span>
                    </label>
                  </div>

                  {/* GBS Warning */}
                  {campylobacterData.guillainBarre && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                        <p className="text-sm text-red-900 dark:text-red-200 font-semibold">
                          ⚠️ Guillain-Barré syndrome is a serious complication requiring immediate neurological evaluation.
                          Seek emergency care for progressive weakness or difficulty breathing.
                        </p>
                      </div>
                  )}

                  {/* VA Guidance */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Associated with Gulf War illness. Campylobacter is the
                      leading bacterial trigger for GBS. Document timeline from infection to complications.
                      EMG/nerve conduction studies important if GBS suspected.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: Q Fever Form */}
          {isQFeverRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🐐 Q Fever Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track Q fever symptoms. Chronic Q fever (&gt;6 months) can cause endocarditis requiring long-term treatment.
                  </p>

                  <div className="space-y-3">
                    {/* Months Since Infection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Months Since Initial Infection
                      </label>
                      <input
                          type="number"
                          value={qFeverData.monthsSinceInfection}
                          onChange={(e) => setQFeverData({...qFeverData, monthsSinceInfection: e.target.value})}
                          placeholder="e.g., 8"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Chronic Q fever defined as symptoms persisting &gt;6 months
                      </p>
                    </div>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={qFeverData.chronicQFever}
                          onChange={(e) => setQFeverData({...qFeverData, chronicQFever: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Chronic Q fever (symptoms &gt;6 months)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={qFeverData.phaseIAntibodies}
                          onChange={(e) => setQFeverData({...qFeverData, phaseIAntibodies: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Phase I antibodies elevated (&gt;1:800 indicates chronic infection)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={qFeverData.fatigueSyndrome}
                          onChange={(e) => setQFeverData({...qFeverData, fatigueSyndrome: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Q fever fatigue syndrome (debilitating fatigue &gt;6 months)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={qFeverData.endocarditis}
                          onChange={(e) => setQFeverData({...qFeverData, endocarditis: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    Q fever endocarditis (heart valve infection)
                  </span>
                    </label>
                  </div>

                  {/* Endocarditis Warning */}
                  {qFeverData.endocarditis && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                        <p className="text-sm text-red-900 dark:text-red-200 font-semibold">
                          ⚠️ Q fever endocarditis requires 18+ months of antibiotic treatment (doxycycline + hydroxychloroquine).
                          Echocardiogram needed for diagnosis.
                        </p>
                      </div>
                  )}

                  {/* VA Guidance */}
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Common in military deployments to Iraq/Afghanistan (livestock exposure).
                      Chronic Q fever develops in 1-5% of cases. Veterans with pre-existing valve abnormalities at higher risk.
                      Serology showing high Phase I titers indicates chronic infection.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: Salmonella Form */}
          {isSalmonellaRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🦠 Nontyphoid Salmonella Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track Salmonella infection symptoms. Document complications like bacteremia and reactive arthritis.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={salmonellaData.stoolCultureConfirmed}
                          onChange={(e) => setSalmonellaData({...salmonellaData, stoolCultureConfirmed: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Stool culture confirmed Salmonella
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={salmonellaData.reactiveArthritis}
                          onChange={(e) => setSalmonellaData({...salmonellaData, reactiveArthritis: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Reactive arthritis (joint inflammation 1-4 weeks post-infection)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={salmonellaData.bacteremia}
                          onChange={(e) => setSalmonellaData({...salmonellaData, bacteremia: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    Bacteremia/Sepsis (bacteria in bloodstream)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={salmonellaData.hospitalized}
                          onChange={(e) => setSalmonellaData({...salmonellaData, hospitalized: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hospitalized for complications
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={salmonellaData.severeComplications}
                          onChange={(e) => setSalmonellaData({...salmonellaData, severeComplications: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Other severe complications
                  </span>
                    </label>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Salmonella is common in military deployments. Document all GI symptoms,
                      dehydration requiring IV fluids, and post-infectious complications. Reactive arthritis typically occurs 1-4 weeks after infection.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: Shigella Form */}
          {isShigellaRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🦠 Shigella Infection Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track Shigella dysentery symptoms. Document bloody diarrhea, tenesmus, and complications.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={shigellaData.stoolCultureConfirmed}
                          onChange={(e) => setShigellaData({...shigellaData, stoolCultureConfirmed: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Stool culture confirmed Shigella
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={shigellaData.reactiveArthritis}
                          onChange={(e) => setShigellaData({...shigellaData, reactiveArthritis: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Reactive arthritis (Reiter syndrome)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={shigellaData.hus}
                          onChange={(e) => setShigellaData({...shigellaData, hus: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-bold">
                    Hemolytic Uremic Syndrome (HUS) - kidney failure
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={shigellaData.hospitalized}
                          onChange={(e) => setShigellaData({...shigellaData, hospitalized: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hospitalized for complications
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={shigellaData.severeComplications}
                          onChange={(e) => setShigellaData({...shigellaData, severeComplications: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Other severe complications (seizures, severe dehydration)
                  </span>
                    </label>
                  </div>

                  {shigellaData.hus && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                        <p className="text-sm text-red-900 dark:text-red-200 font-semibold">
                          ⚠️ HUS is a life-threatening complication requiring immediate medical care. Document all lab work showing
                          kidney dysfunction, low platelets, and hemolysis.
                        </p>
                      </div>
                  )}

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> Shigella causes dysentery (bloody diarrhea with painful straining/tenesmus).
                      Common in Gulf War deployments. HUS is rare but serious. Document all symptoms and complications.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: West Nile Virus Form */}
          {isWestNileRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🦟 West Nile Virus Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track West Nile symptoms. Neuroinvasive disease and post-infection syndrome can cause long-term impairment.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={westNileData.serologyConfirmed}
                          onChange={(e) => setWestNileData({...westNileData, serologyConfirmed: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    West Nile IgM antibodies confirmed
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={westNileData.neuroinvasive}
                          onChange={(e) => setWestNileData({...westNileData, neuroinvasive: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Neuroinvasive disease (nervous system involvement)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={westNileData.encephalitis}
                          onChange={(e) => setWestNileData({...westNileData, encephalitis: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    Encephalitis (brain inflammation)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={westNileData.acuteFlaccidParalysis}
                          onChange={(e) => setWestNileData({...westNileData, acuteFlaccidParalysis: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-bold">
                    Acute Flaccid Paralysis (polio-like paralysis)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={westNileData.permanentImpairment}
                          onChange={(e) => setWestNileData({...westNileData, permanentImpairment: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Permanent neurological impairment
                  </span>
                    </label>
                  </div>

                  {(westNileData.acuteFlaccidParalysis || westNileData.encephalitis) && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                        <p className="text-sm text-red-900 dark:text-red-200 font-semibold">
                          ⚠️ Severe neuroinvasive disease. Document CSF analysis, MRI/CT findings, and neurological exam showing deficits.
                          Paralysis may be permanent.
                        </p>
                      </div>
                  )}

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> West Nile is mosquito-borne. Post-West Nile syndrome causes chronic fatigue
                      and weakness lasting months to years. Acute flaccid paralysis is rare but serious. Document both acute illness
                      and long-term sequelae.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Phase 6: NTM Form */}
          {isNTMRelated && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🫁 Nontuberculous Mycobacterium (NTM) Details
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Track NTM lung infection. Related to TB but different organism. Requires 12-24 months of multi-drug therapy.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        NTM Species (if known)
                      </label>
                      <select
                          value={ntmData.ntmSpecies}
                          onChange={(e) => setNtmData({...ntmData, ntmSpecies: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select species...</option>
                        <option value="mac">MAC (M. avium complex)</option>
                        <option value="abscessus">M. abscessus</option>
                        <option value="kansasii">M. kansasii</option>
                        <option value="other">Other species</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Months on Treatment
                      </label>
                      <input
                          type="number"
                          value={ntmData.monthsOnTreatment}
                          onChange={(e) => setNtmData({...ntmData, monthsOnTreatment: e.target.value})}
                          placeholder="e.g., 6"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={ntmData.activeDisease}
                          onChange={(e) => setNtmData({...ntmData, activeDisease: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    Active NTM disease (positive cultures, CT findings)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={ntmData.onTreatment}
                          onChange={(e) => setNtmData({...ntmData, onTreatment: e.target.checked})}
                          className="mt-1 rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                    On long-term antibiotic therapy (12-24 months)
                  </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                          type="checkbox"
                          checked={ntmData.disseminated}
                          onChange={(e) => setNtmData({...ntmData, disseminated: e.target.checked})}
                          className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      />
                      <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    Disseminated NTM (spread beyond lungs)
                  </span>
                    </label>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>For VA Claims:</strong> NTM requires multiple positive sputum cultures, CT showing nodular/cavitary disease,
                      and prolonged multi-drug therapy. Treatment typically: macrolide + ethambutol + rifampin for 12-24 months.
                      Not contagious person-to-person.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* ============================================
                PHASE 8A: MENTAL HEALTH EXPANSION - FORMS
                ============================================ */}

          {/* Somatic Symptom Disorders - use standard symptom tracking (no custom form) */}

          {/* Illness Anxiety Disorder - use standard symptom tracking (no custom form) */}

          {/* Other Specified Anxiety - use standard symptom tracking (no custom form) */}

          {/* Depersonalization/Derealization - use standard symptom tracking (no custom form) */}

          {/* Cyclothymic Disorder - use standard symptom tracking (no custom form) */}

          {/* Eating Disorders - Special tracking forms */}
          {(isAnorexiaRelated || isBulimiaRelated) && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  🍽️ {isAnorexiaRelated ? 'Anorexia Nervosa' : 'Bulimia Nervosa'} Tracking
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Eating disorders are rated based on weight loss percentage and incapacitating episodes
                  requiring hospitalization. Track your symptoms to document evidence for VA claims.
                </p>

                {/* Weight Tracking */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Weight (lbs)
                  </label>
                  <input
                      type="number"
                      value={eatingDisorderData.currentWeight}
                      onChange={(e) => setEatingDisorderData({
                        ...eatingDisorderData,
                        currentWeight: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Current weight"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expected Minimum Weight (lbs)
                    <span className="text-xs text-gray-500 ml-2">(Based on height/age/sex)</span>
                  </label>
                  <input
                      type="number"
                      value={eatingDisorderData.expectedMinimumWeight}
                      onChange={(e) => setEatingDisorderData({
                        ...eatingDisorderData,
                        expectedMinimumWeight: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Expected minimum weight"
                  />
                </div>

                {/* Incapacitating Episode */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={eatingDisorderData.incapacitatingEpisode}
                        onChange={(e) => setEatingDisorderData({
                          ...eatingDisorderData,
                          incapacitatingEpisode: e.target.checked
                        })}
                        className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Incapacitating Episode (Bed rest and physician treatment required)
                            </span>
                  </label>

                  {eatingDisorderData.incapacitatingEpisode && (
                      <input
                          type="text"
                          value={eatingDisorderData.episodeDuration}
                          onChange={(e) => setEatingDisorderData({
                            ...eatingDisorderData,
                            episodeDuration: e.target.value
                          })}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Duration of episode (e.g., '3 days')"
                      />
                  )}
                </div>

                {/* Hospitalization */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={eatingDisorderData.hospitalized}
                        onChange={(e) => setEatingDisorderData({
                          ...eatingDisorderData,
                          hospitalized: e.target.checked
                        })}
                        className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Hospitalized
                            </span>
                  </label>

                  {eatingDisorderData.hospitalized && (
                      <>
                        <div className="ml-6 space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={eatingDisorderData.tubeFeeding}
                                onChange={(e) => setEatingDisorderData({
                                  ...eatingDisorderData,
                                  tubeFeeding: e.target.checked
                                })}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Tube Feeding
                                        </span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={eatingDisorderData.parenteralNutrition}
                                onChange={(e) => setEatingDisorderData({
                                  ...eatingDisorderData,
                                  parenteralNutrition: e.target.checked
                                })}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Parenteral Nutrition (IV)
                                        </span>
                          </label>
                        </div>
                      </>
                  )}
                </div>

                {/* Bulimia-specific */}
                {isBulimiaRelated && (
                    <>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={eatingDisorderData.bingeEpisode}
                              onChange={(e) => setEatingDisorderData({
                                ...eatingDisorderData,
                                bingeEpisode: e.target.checked
                              })}
                              className="rounded"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Binge Eating Episode
                                    </span>
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={eatingDisorderData.purgingEpisode}
                              onChange={(e) => setEatingDisorderData({
                                ...eatingDisorderData,
                                purgingEpisode: e.target.checked
                              })}
                              className="rounded"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Purging Episode (Self-induced vomiting)
                                    </span>
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Compensatory Behaviors
                        </label>
                        <div className="space-y-1 ml-4">
                          {['Excessive exercise', 'Laxative use', 'Diuretic use', 'Fasting'].map(behavior => (
                              <label key={behavior} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={eatingDisorderData.compensatoryBehaviors.includes(behavior)}
                                    onChange={(e) => {
                                      const behaviors = e.target.checked
                                          ? [...eatingDisorderData.compensatoryBehaviors, behavior]
                                          : eatingDisorderData.compensatoryBehaviors.filter(b => b !== behavior);
                                      setEatingDisorderData({
                                        ...eatingDisorderData,
                                        compensatoryBehaviors: behaviors
                                      });
                                    }}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {behavior}
                                            </span>
                              </label>
                          ))}
                        </div>
                      </div>
                    </>
                )}

                {/* Anorexia-specific */}
                {isAnorexiaRelated && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={eatingDisorderData.restrictedIntake}
                            onChange={(e) => setEatingDisorderData({
                              ...eatingDisorderData,
                              restrictedIntake: e.target.checked
                            })}
                            className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Restricted Food Intake Today
                                </span>
                      </label>
                    </div>
                )}

                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                  <strong>For VA Claims:</strong> Eating disorders require medical records showing weight,
                  BMI calculations, and hospitalization records. Incapacitating episodes must require bed rest
                  and physician treatment (not just therapy).
                </div>
              </div>
          )}

          {/* Phase 8B: Binge Eating Disorder Form */}
          {isBingeEatingRelated && (
              <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Binge Eating Episode Details</h4>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={bingeEatingData.bingeEpisode}
                      onChange={(e) => setBingeEatingData(prev => ({
                        ...prev,
                        bingeEpisode: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Binge eating episode (ate significantly more than normal)
              </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={bingeEatingData.lossOfControl}
                      onChange={(e) => setBingeEatingData(prev => ({
                        ...prev,
                        lossOfControl: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Loss of control - couldn't stop eating
              </span>
                </label>

                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                    Distress level about binge (1-10):
                  </label>
                  <input
                      type="range"
                      min="1"
                      max="10"
                      value={bingeEatingData.distressLevel}
                      onChange={(e) => setBingeEatingData(prev => ({
                        ...prev,
                        distressLevel: parseInt(e.target.value)
                      }))}
                      className="w-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                {bingeEatingData.distressLevel}/10
              </span>
                </div>
              </div>
          )}

          {isDissociativeRelated && (
              <div className="space-y-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Dissociative Episode Details
                </h4>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={dissociativeData.memoryGap}
                      onChange={(e) => setDissociativeData({
                        ...dissociativeData,
                        memoryGap: e.target.checked
                      })}
                      className="rounded text-indigo-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
        Memory gap - can't remember what happened
      </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={dissociativeData.lostTime}
                      onChange={(e) => setDissociativeData({
                        ...dissociativeData,
                        lostTime: e.target.checked
                      })}
                      className="rounded text-indigo-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
        Lost time - found myself somewhere with no memory of how
      </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration of episode:
                  </label>
                  <div className="flex gap-2">
                    <input
                        type="number"
                        min="0"
                        max="999"
                        value={dissociativeData.durationAmount || ''}
                        onChange={(e) => setDissociativeData({
                          ...dissociativeData,
                          durationAmount: e.target.value
                        })}
                        placeholder="0"
                        className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                        value={dissociativeData.durationUnit || ''}
                        onChange={(e) => setDissociativeData({
                          ...dissociativeData,
                          durationUnit: e.target.value
                        })}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select unit...</option>
                      <option value="Minutes">Minutes</option>
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Example: "3" and "Hours" = "3 hours"
                  </p>
                </div>
              </div>
          )}

          {/* Phase 8B: Acute Stress Disorder Form */}
          {isAcuteStressRelated && (
              <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Acute Stress Details</h4>

                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                    Date of traumatic event:
                  </label>
                  <input
                      type="date"
                      value={acuteStressData.traumaDate}
                      onChange={(e) => setAcuteStressData(prev => ({
                        ...prev,
                        traumaDate: e.target.value
                      }))}
                      className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={acuteStressData.dissociativeSymptoms}
                      onChange={(e) => setAcuteStressData(prev => ({
                        ...prev,
                        dissociativeSymptoms: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Dissociative symptoms (feeling detached, derealization)
              </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={acuteStressData.avoidance}
                      onChange={(e) => setAcuteStressData(prev => ({
                        ...prev,
                        avoidance: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Avoiding reminders of trauma
              </span>
                </label>
              </div>
          )}

          {/* Phase 8B: Personality Disorders Form */}
          {isPersonalityDisorderRelated && (
              <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Functional Impact</h4>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={personalityData.occupationalImpact}
                      onChange={(e) => setPersonalityData(prev => ({
                        ...prev,
                        occupationalImpact: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Impact on work/school today
              </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={personalityData.socialImpact}
                      onChange={(e) => setPersonalityData(prev => ({
                        ...prev,
                        socialImpact: e.target.checked
                      }))}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                Impact on relationships today
              </span>
                </label>
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

          {/* Occurrence Time Picker */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <OccurrenceTimePicker
                value={occurredAt}
                onChange={setOccurredAt}
                label="When did this occur?"
            />
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