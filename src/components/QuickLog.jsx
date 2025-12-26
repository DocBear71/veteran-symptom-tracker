import { useRef, useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';
import { getChronicSymptoms, removeChronicSymptom, saveSymptomLog, getMedications, logMedicationTaken, getSymptomLogs } from '../utils/storage';
import { useProfile } from '../hooks/useProfile';
import { stripDCCode } from '../data/symptoms';
import OccurrenceTimePicker from './OccurrenceTimePicker';

const QuickLog = ({ onLogSaved, onAddChronic }) => {
  const { isVeteran } = useProfile();
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

  // Phase 4C: Spine condition state
  const [spineData, setSpineData] = useState({
    spineLocation: '',
    fractureType: '',
    fusionLevels: '',
    neurogenicClaudication: false,
    morningStiffnessDuration: '',
  });

  const [seizureData, setSeizureData] = useState({
    episodeType: '',
    duration: '',
    lossOfConsciousness: null,
    auraPresent: null,
    recoveryTime: '',
    witnessPresent: null,
    // Phase 1D: Jacksonian/Focal (DC 8912) specific fields
    focalOnsetLocation: '',
    focalSpread: null,
    spreadPattern: '',
    secondaryGeneralization: null,
    awarenessPreserved: null,
    // Phase 1D: Diencephalic (DC 8913) specific fields
    autonomicSymptoms: [],
    // Phase 1D: Psychomotor (DC 8914) specific fields
    automatisms: [],
    hallucinations: null,
    hallucinationType: '',
    perceptualIllusions: null,
    moodChange: null,
    memoryDisturbance: null,
    automaticState: null,
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

  // Phase 6: HIV/AIDS Data
  const [hivData, setHivData] = useState({
    infectionType: '',
    constitutionalSymptoms: [],
    weightLossPercentage: '',
    onAntiretrovirals: false,
    cd4CountKnown: false,
    cd4Range: '',
    treatmentCompliance: '',
  });

  // Phase 6: Hepatitis Data
  const [hepatitisData, setHepatitisData] = useState({
    weightLossPercentage: '',
    debilitating: false,
    dietaryRestrictions: false,
    symptomFrequency: '',
  });

  // Phase 6: Lyme Disease Data
  const [lymeData, setLymeData] = useState({
    activeTreatment: false,
    treatmentCompleted: false,
    treatmentStartDate: '',
    rashPresent: false,
    rashType: '',
    neurologicalSymptoms: [],
    jointSymptoms: [],
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

  // Phase 7: Dental/Oral Conditions (simplified for QuickLog)
  const [dentalData, setDentalData] = useState({
    jawPainSeverity: 5,
    jawOpening: '',
    toothCount: '',
    prosthesisType: '',
    dietaryRestrictions: '',
    chewingDifficulty: '',
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
  // Form 1: Anxiety Disorders
  const [anxietyData, setAnxietyData] = useState({
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

  // Form 2: Depression
  const [depressionData, setDepressionData] = useState({
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

  // Form 3: Bipolar/Cyclothymic
  const [bipolarData, setBipolarData] = useState({
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

  // Form 4: OCD
  const [ocdData, setOcdData] = useState({
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

  // Form 5: Adjustment Disorder
  const [adjustmentDisorderData, setAdjustmentDisorderData] = useState({
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

  // Phase 8A: Mental Health Expansion - Additional State Variables
  const [somaticSymptomData, setSomaticSymptomData] = useState({
    painPreoccupation: false,
    excessiveHealthWorry: false,
    multipleSymptoms: false,
    frequentDoctorVisits: false,
    functionalImpairment: false,
  });

  const [illnessAnxietyData, setIllnessAnxietyData] = useState({
    fearOfIllness: false,
    bodyChecking: false,
    reassuranceSeeking: false,
    appointmentAvoidance: false,
    healthDistress: false,
  });

  const [depersonalizationData, setDepersonalizationData] = useState({
    detachment: false,
    unreality: false,
    robotAutopilot: false,
    distress: false,
  });

  const [cyclothymicData, setCyclothymicData] = useState({
    hypomanic: false,
    depressive: false,
    moodSwings: false,
    irritability: false,
  });


  // Phase 9: Cardiovascular data
  const [cardiovascularData, setCardiovascularData] = useState({
    activityLevel: '',
    symptomTrigger: '',
    atRest: false,
    withExertion: false,
    episodeType: '',
    treatmentRequired: '',
    hospitalized: false,
    hasAICD: false,
    aicdShockDelivered: false,
    vagalManeuverUsed: false,
    activeInfection: false,
    painWorseWithBreathing: false,
    painReliefLeaningForward: false,
    affectedLeg: '',
    compressionUsed: false,
    elevationHelps: false,
  });
  // Phase 10: Digestive data
  const [digestiveData, setDigestiveData] = useState({
    hasMeldScore: false,
    meldScore: '',
    hasAscites: false,
    ascitesSeverity: '',
    hasEncephalopathy: false,
    encephalopathyGrade: '',
    hasVaricealBleed: false,
    onLactulose: false,
    onDiuretics: false,
    episodeDuration: '',
    onDailyMedication: false,
    medicationType: '',
    hasGIBleeding: false,
    painLocation: '',
    onEnzymes: false,
    hasDietaryRestriction: false,
    dietaryRestrictionType: '',
    hasMaldigestion: false,
    attackWithNausea: false,
    attackWithVomiting: false,
    hadStrictureDilation: false,
    hospitalized: false,
    hospitalizationReason: '',
  });

  // ============================================
  // PHASE 1A: MAJOR NEUROLOGICAL CONDITIONS STATE
  // ============================================
  const [multipleSclerosisData, setMultipleSclerosisData] = useState({
    isRelapse: false,
    relapseDuration: '',
    relapseRecovery: '',
    mobilityAid: '',
    assistanceNeeded: false,
    assistanceType: '',
    onDMT: false,
    dmtType: '',
    recentSteroids: false,
    edssEstimate: '',
    heatTriggered: false,
  });

  const [parkinsonsData, setParkinsonsData] = useState({
    tremorSide: '',
    tremorSeverity: '',
    freezingEpisodes: '',
    fallsToday: '',
    onTime: '',
    medicationState: '',
    mobilityAid: '',
    assistanceNeeded: false,
    speechAffected: false,
    swallowingAffected: false,
    hallucinationsPresent: false,
    confusionPresent: false,
  });

  const [myastheniaData, setMyastheniaData] = useState({
    worseWithActivity: false,
    betterWithRest: false,
    timeOfDayWorst: '',
    ocularOnly: false,
    bulbarInvolved: false,
    limbsInvolved: false,
    respiratoryInvolved: false,
    canRaiseArms: '',
    ptosisPresent: false,
    ptosisSide: '',
    doubleVision: false,
    onPyridostigmine: false,
    dosesTakenToday: '',
    breathingDifficulty: false,
    emergencySigns: false,
  });

  // ============================================
  // PHASE 1B: ADDITIONAL NEUROLOGICAL STATE
  // ============================================

  // Narcolepsy data (DC 8108)
  const [narcolepsyData, setNarcolepsyData] = useState({
    sleepAttackDuration: '',
    sleepAttackTrigger: '',
    cataplexyTrigger: '',
    cataplexyAffected: '',
    fellDuringCataplexy: false,
    hallucinationType: '',
    paralysisAtSleep: false,
    paralysisAtWake: false,
    onStimulants: false,
    onSodiumOxybate: false,
    sleepStudyConfirmed: false,
  });

  // ALS data (DC 8017)
  const [alsData, setAlsData] = useState({
    weaknessLocation: '',
    weaknessSide: '',
    fasciculationLocation: '',
    speechClarity: '',
    swallowingSolids: '',
    swallowingLiquids: '',
    breathingDifficulty: '',
    usesBiPAP: false,
    usesVentilator: false,
    usesFeedingTube: false,
    mobilityStatus: '',
  });

  // Syringomyelia data (DC 8024)
  const [syringomyeliaData, setSyringomyeliaData] = useState({
    painType: '',
    painLocation: '',
    sensoryLossPattern: '',
    tempInsensitivityArea: '',
    hadBurnInjury: false,
    hadCutInjury: false,
    syrinxLocation: '',
  });

  // Myelitis data (DC 8010)
  const [myelitisData, setMyelitisData] = useState({
    weaknessDistribution: '',
    sensoryLevel: '',
    bladderSymptoms: '',
    usesCatheter: false,
    bowelSymptoms: '',
    mobilityStatus: '',
    causeOfMyelitis: '',
  });
  // ============================================
  // PHASE 1C: PERIPHERAL NERVE DATA
  // DC 8510-8530 (Paralysis), 8610-8630 (Neuritis), 8710-8730 (Neuralgia)
  // ============================================
  const [peripheralNerveData, setPeripheralNerveData] = useState({
    affectedSide: '',
    isDominantSide: '',
    nerveConditionType: '',
    severityLevel: '',
    hasMotorInvolvement: false,
    hasSensoryInvolvement: false,
    hasAtrophy: false,
    hasDeformity: false,
    deformityType: '',
    usesAssistiveDevice: false,
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


  // Peripheral nerve prefixes to exclude from generic pain/GU detection
  const peripheralNervePrefixes = ['uprn-', 'mdrn-', 'lwrn-', 'alrn-', 'radn-', 'medn-', 'ulnn-',
    'mscn-', 'crcn-', 'ltn-', 'scin-', 'cpn-', 'spn-', 'dpn-', 'tibn-', 'ptn-', 'femn-',
    'sapn-', 'obtn-', 'lfcn-', 'iin-'];
  const isPeripheralNerveSymptomQL = peripheralNervePrefixes.some(prefix => selectedChronic?.symptomId?.startsWith(prefix));

  // Phase 3A: Endocrine prefixes to exclude from generic pain/GU detection
  const endocrinePrefixes = ['hyper-', 'graves-', 'thyroiditis-', 'hpth-', 'hopth-', 'hypo-',
    'addisons-', 'cushings-', 'di-', 'haldo-'];
  const isEndocrineSymptomQL = endocrinePrefixes.some(prefix => selectedChronic?.symptomId?.startsWith(prefix));

  // Phase 4D: Exclude foot condition symptoms from pain detection
  const isFootConditionSymptomQL = (
      selectedChronic?.symptomId?.startsWith('wf-') ||
      selectedChronic?.symptomId?.startsWith('cf-') ||
      selectedChronic?.symptomId?.startsWith('mt-') ||
      selectedChronic?.symptomId?.startsWith('hv-') ||
      selectedChronic?.symptomId?.startsWith('hr-')
  );
  // Phase 5A: Exclude hernia and adhesion symptoms from pain detection
  const isHerniaOrAdhesionSymptomQL = (
      selectedChronic?.symptomId?.startsWith('hernia-') ||
      selectedChronic?.symptomId?.startsWith('pa-')
  );
  // Phase 5B: Exclude esophageal and post-surgical digestive symptoms from pain detection
  const isDigestivePhase5BSymptomQL = (
      selectedChronic?.symptomId?.startsWith('es-') ||
      selectedChronic?.symptomId?.startsWith('esp-') ||
      selectedChronic?.symptomId?.startsWith('pgs-') ||
      selectedChronic?.symptomId?.startsWith('if-')
  );

  // Phase 6A: Exclude skin condition symptoms from dental/oral detection
  const isSkinConditionSymptomQL = (
      selectedChronic?.symptomId?.startsWith('acne-') ||
      selectedChronic?.symptomId?.startsWith('chloracne-') ||
      selectedChronic?.symptomId?.startsWith('aa-') ||
      selectedChronic?.symptomId?.startsWith('hh-') ||
      // Phase 6B additions
      selectedChronic?.symptomId?.startsWith('dle-') ||
      selectedChronic?.symptomId?.startsWith('bullous-') ||
      selectedChronic?.symptomId?.startsWith('cv-') ||
      selectedChronic?.symptomId?.startsWith('derm-') ||
      selectedChronic?.symptomId?.startsWith('skinf-')
  );

  // Phase 7A: Eye condition prefixes for exclusion from Pain Details form
  const isEyeConditionSymptomQL = (
      selectedChronic?.symptomId?.startsWith('uveitis-') ||
      selectedChronic?.symptomId?.startsWith('keratitis-') ||
      selectedChronic?.symptomId?.startsWith('conj-') ||
      selectedChronic?.symptomId?.startsWith('scleritis-')
  );

  // Phase 7B: Ear condition prefixes for exclusion from Pain Details form
  const isEarConditionSymptomQL = (
      selectedChronic?.symptomId?.startsWith('vest-') ||
      selectedChronic?.symptomId?.startsWith('csom-') ||
      selectedChronic?.symptomId?.startsWith('coe-') ||
      selectedChronic?.symptomId?.startsWith('cnsom-')
  );

  // Determine symptom type - EXPANDED DETECTION
  const isMigraine = selectedChronic?.symptomId === 'migraine';

  // Sleep: match sleep-related symptoms only
  const isSleepRelated = !isEndocrineSymptomQL && (
      selectedChronic?.symptomId === 'sleep-issues' ||
      selectedChronic?.symptomId === 'sleep-quality' ||
      selectedChronic?.symptomId?.includes('insomnia')
  );

  // PTSD - Specific PTSD symptoms only
  const isPTSDRelated = selectedChronic?.symptomId?.includes('ptsd') ||
      ['hypervigilance', 'nightmares', 'flashbacks', 'intrusive-thoughts',
        'avoidance', 'emotional-numbness', 'startle-response'].includes(selectedChronic?.symptomId);

  // Anxiety Disorders Form - excludes Illness Anxiety (has its own form)
  const isAnxietyFormRelated = [
    // Anxiety Symptoms category (actual IDs from symptoms.js)
    'anxiety', 'gad-worry', 'gad-restlessness', 'gad-muscle-tension',
    // Panic Disorder Symptoms category
    'panic-attack', 'panic-agoraphobia', 'panic-anticipatory-anxiety',
    // Social Anxiety Symptoms category
    'social-anxiety-fear', 'social-anxiety-avoidance', 'social-anxiety-performance',
    'social-anxiety-physical', 'social-anxiety-anticipatory',
  ].includes(selectedChronic?.symptomId);

  // Depression Form
  const isDepressionFormRelated = [
    'depression', 'mdd-episode', 'mdd-anhedonia', 'mdd-hopelessness',
    'persistent-depressive-chronic', 'persistent-depressive-low-energy',
    'persistent-depressive-low-self-esteem', 'persistent-depressive-hopelessness'
  ].includes(selectedChronic?.symptomId);

  // Bipolar Form
  const isBipolarFormRelated = [
    // Bipolar Symptoms category (actual IDs: bipolar-manic, bipolar-depressive, bipolar-mixed)
    'bipolar-manic', 'bipolar-depressive', 'bipolar-mixed',
  ].includes(selectedChronic?.symptomId);

  // OCD Form
  const isOCDFormRelated = [
    // Actual OCD symptom IDs from symptoms.js
    'ocd-obsessions', 'ocd-compulsions', 'ocd-checking', 'ocd-contamination', 'ocd-time-spent'
  ].includes(selectedChronic?.symptomId);

  // Adjustment Disorder Form
  const isAdjustmentDisorderFormRelated = [
    'adjustment-depressed-mood', 'adjustment-anxiety', 'adjustment-mixed-emotions',
    'adjustment-disturbance-conduct', 'adjustment-work-difficulty', 'adjustment-relationship-problems',
    'adjustment-unspecified'
  ].includes(selectedChronic?.symptomId);

  // Somatic Symptom Disorders
  const isSomaticSymptomRelated = [
    'somatic-pain',
    'somatic-excessive-worry',
    'somatic-multiple-symptoms',
    'somatic-doctor-visits',
    'somatic-functional-impairment',
  ].includes(selectedChronic?.symptomId);

  // Pain: match ANY pain-related symptom only
  const isPainRelated = !isPeripheralNerveSymptomQL && !isEndocrineSymptomQL && !isFootConditionSymptomQL && !isHerniaOrAdhesionSymptomQL &&
      !isDigestivePhase5BSymptomQL && !isEyeConditionSymptomQL && !isEarConditionSymptomQL && !isSomaticSymptomRelated && (
      selectedChronic?.symptomId?.includes('pain') ||
      selectedChronic?.symptomId?.includes('-ache') ||
      selectedChronic?.symptomId?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedChronic?.symptomId?.includes(term))
  );

  // GI: match GI-related symptoms
  const isGIRelated = selectedChronic?.symptomId?.startsWith('ibs') ||
      selectedChronic?.symptomId?.startsWith('gerd') ||
      selectedChronic?.symptomId?.startsWith('uc-') ||
      selectedChronic?.symptomId?.startsWith('ulcer-') ||
      selectedChronic?.symptomId?.startsWith('hemorrhoid') ||
      selectedChronic?.symptomId?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedChronic?.symptomId);

  // Respiratory: match respiratory symptoms
  // Phase 11: Added bronchiectasis, pulmonary fibrosis, sarcoidosis
  const isRespiratoryRelated = selectedChronic?.symptomId?.startsWith('asthma-') ||
      selectedChronic?.symptomId?.startsWith('copd-') ||
      selectedChronic?.symptomId?.startsWith('apnea-') ||
      selectedChronic?.symptomId?.startsWith('emphysema-') ||
      selectedChronic?.symptomId?.startsWith('bronchitis-') ||
      selectedChronic?.symptomId?.startsWith('bronchiectasis-') ||
      selectedChronic?.symptomId?.startsWith('pf-') ||
      selectedChronic?.symptomId?.startsWith('sarcoid-') ||
      selectedChronic?.symptomId?.includes('breathing') ||
      selectedChronic?.symptomId?.includes('wheez') ||
      selectedChronic?.symptomId?.includes('cough') ||
      ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(selectedChronic?.symptomId);

  // Joint: match joint-related symptoms
  // Phase 4A: Added gout-, bursitis-, tendinitis- prefixes
  // Phase 4B: Selective detection - exclude systemic symptoms
  const isSystemicSymptomQL = selectedChronic?.symptomId?.includes('-fatigue') ||
      selectedChronic?.symptomId?.includes('-fever') ||
      selectedChronic?.symptomId?.includes('-weight-loss') ||
      selectedChronic?.symptomId?.includes('-anemia') ||
      selectedChronic?.symptomId?.includes('-constitutional') ||
      selectedChronic?.symptomId?.includes('-malaise');

  // Phase 4C: Exclude spine symptoms from joint detection
  const isSpineSymptomQL = (
      selectedChronic?.symptomId?.startsWith('vfx-') ||
      selectedChronic?.symptomId?.startsWith('si-') ||
      selectedChronic?.symptomId?.startsWith('ss-') ||
      selectedChronic?.symptomId?.startsWith('as-') ||
      selectedChronic?.symptomId?.startsWith('sf-')
  );

  const isJointRelated = !isSystemicSymptomQL && !isSpineSymptomQL && (
      selectedChronic?.symptomId?.startsWith('shoulder-') ||
      selectedChronic?.symptomId?.startsWith('knee-') ||
      selectedChronic?.symptomId?.startsWith('hip-') ||
      selectedChronic?.symptomId?.startsWith('ankle-') ||
      selectedChronic?.symptomId?.startsWith('elbow-') ||
      selectedChronic?.symptomId?.startsWith('wrist-') ||
      selectedChronic?.symptomId?.startsWith('hand-') ||
      selectedChronic?.symptomId?.startsWith('finger-') ||
      selectedChronic?.symptomId?.startsWith('foot-') ||
      selectedChronic?.symptomId?.startsWith('toe-') ||
      selectedChronic?.symptomId?.startsWith('gout-') ||
      selectedChronic?.symptomId?.startsWith('bursitis-') ||
      selectedChronic?.symptomId?.startsWith('tendinitis-') ||
      selectedChronic?.symptomId?.startsWith('myositis-') ||
      selectedChronic?.symptomId?.startsWith('osteo-') ||
      selectedChronic?.symptomId?.startsWith('mja-') ||
      selectedChronic?.symptomId?.includes('joint') ||
      selectedChronic?.symptomId?.includes('arthritis') ||
      selectedChronic?.symptomId?.includes('bursitis') ||
      selectedChronic?.symptomId?.includes('tendinitis') ||
      selectedChronic?.symptomId?.includes('gout') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(selectedChronic?.symptomId)
  );

// Phase 4C: Spine Condition detection
  const isSpineConditionRelated = (
      selectedChronic?.symptomId?.startsWith('vfx-') ||
      selectedChronic?.symptomId?.startsWith('si-') ||
      selectedChronic?.symptomId?.startsWith('ss-') ||
      selectedChronic?.symptomId?.startsWith('as-') ||
      selectedChronic?.symptomId?.startsWith('sf-') ||
      selectedChronic?.symptomId?.includes('vertebral') ||
      selectedChronic?.symptomId?.includes('sacroiliac') ||
      selectedChronic?.symptomId?.includes('stenosis') ||
      selectedChronic?.symptomId?.includes('ankylosing') ||
      selectedChronic?.symptomId?.includes('spondylitis') ||
      selectedChronic?.symptomId?.includes('spinal-fusion')
  );

  // Seizure: match seizure-related symptoms
  const isSeizureRelated = selectedChronic?.symptomId?.includes('seizure') ||
      selectedChronic?.symptomId?.includes('epilep') ||
      selectedChronic?.symptomId?.includes('convuls') ||
      selectedChronic?.symptomId?.startsWith('seizure-') ||
      selectedChronic?.symptomId?.startsWith('jack-') ||
      selectedChronic?.symptomId?.startsWith('dien-') ||
      selectedChronic?.symptomId?.startsWith('psych-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(selectedChronic?.symptomId);

  // Phase 1D: Specific epilepsy type detection
  const isJacksonianEpilepsyQL = selectedChronic?.symptomId?.startsWith('jack-') ||
      selectedChronic?.symptomId === 'seizure-partial' ||
      selectedChronic?.symptomId?.includes('focal');

  const isDiencephalicEpilepsyQL = selectedChronic?.symptomId?.startsWith('dien-');

  const isPsychomotorEpilepsyQL = selectedChronic?.symptomId?.startsWith('psych-') ||
      selectedChronic?.symptomId === 'seizure-psychomotor';

  // PHASE 2: Eye/Vision detection
  const isEyeRelated = selectedChronic?.symptomId?.includes('vision') ||
      selectedChronic?.symptomId?.includes('eye') ||
      selectedChronic?.symptomId?.includes('glaucoma') ||
      selectedChronic?.symptomId?.includes('retinopathy') ||
      selectedChronic?.symptomId?.includes('macular') ||
      ['floaters', 'diplopia', 'photophobia', 'night-blindness', 'light-sensitivity',
        'double-vision', 'color-vision-changes', 'dry-eyes', 'eye-strain', 'eye-pain',
        'peripheral-vision-loss', 'diabetic-retinopathy', 'glaucoma-symptoms'].includes(selectedChronic?.symptomId);

  // Phase 3: Genitourinary detection
  const isGenitourinaryRelated = !isPeripheralNerveSymptomQL && !isEndocrineSymptomQL && !isSkinConditionSymptomQL && (
      selectedChronic?.symptomId?.includes('kidney') ||
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
       'genital-pain', 'bowel-urgency', 'bowel-frequency'].includes(selectedChronic?.symptomId)
  );

  // Phase 4: Gynecological detection
  const isGynecologicalRelated = !isEndocrineSymptomQL && (
      selectedChronic?.symptomId?.includes('menstrual') ||
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
        'uterine-cramping'].includes(selectedChronic?.symptomId)
  );

  // Phase 5: Hemic/Lymphatic condition detection
  const isAnemiaRelated = [
    'fatigue-blood', 'weakness-blood', 'dizziness-anemia', 'shortness-breath-anemia',
    'pale-skin', 'cold-hands-feet', 'chest-pain-anemia', 'rapid-heartbeat', 'headache-anemia'
  ].includes(selectedChronic?.symptomId);

  const isSickleCellRelated = [
    'sickle-cell-crisis', 'bone-pain-sickle', 'joint-pain-sickle', 'chest-pain-sickle',
    'priapism', 'vision-changes-sickle', 'leg-ulcers'
  ].includes(selectedChronic?.symptomId);

  const isBleedingDisorderRelated = [
    'easy-bruising', 'prolonged-bleeding', 'nosebleeds-frequent', 'bleeding-gums',
    'petechiae', 'heavy-menstrual-bleeding-blood', 'blood-in-urine', 'blood-in-stool'
  ].includes(selectedChronic?.symptomId);

  const isInfectionRelated = [
    'frequent-infections', 'recurring-infections', 'slow-healing-wounds',
    'fever-unexplained', 'night-sweats-blood', 'chills-blood'
  ].includes(selectedChronic?.symptomId);

  const isLymphomaLeukemiaRelated = [
    'swollen-lymph-nodes', 'unexplained-weight-loss', 'loss-appetite',
    'bone-pain-leukemia', 'night-sweats-blood'
  ].includes(selectedChronic?.symptomId);

  const isPolycythemiaRelated = [
    'itching-after-bathing', 'burning-hands-feet', 'redness-skin',
    'blurred-vision-blood', 'headache-polycythemia', 'tinnitus-blood', 'blood-clots'
  ].includes(selectedChronic?.symptomId);

  const isTreatmentRelated = [
    'nausea-chemo', 'vomiting-chemo', 'mouth-sores', 'hair-loss',
    'neuropathy-chemo', 'fatigue-chemo'
  ].includes(selectedChronic?.symptomId);

  const isB12DeficiencyRelated = [
    'numbness-tingling-b12', 'difficulty-walking', 'memory-problems-b12',
    'confusion-b12', 'tongue-problems'
  ].includes(selectedChronic?.symptomId);

  // Phase 6: HIV/AIDS detection
  const isHIVRelated = [
      'hiv-opportunistic-infection', 'hiv-night-sweats', 'hiv-persistent-fever',
      'hiv-weight-loss', 'hiv-chronic-diarrhea', 'hiv-oral-thrush', 'hiv-skin-lesions',
      'hiv-lymphadenopathy', 'hiv-fatigue', 'hiv-cognitive-impairment'
  ].includes(selectedChronic?.symptomId);

  // Phase 6: Hepatitis detection
  const isHepatitisRelated = [
      'hep-fatigue', 'hep-malaise', 'hep-nausea', 'hep-abdominal-pain',
      'hep-jaundice', 'hep-dark-urine', 'hep-appetite-loss', 'hep-joint-pain',
      'hep-cognitive-issues', 'hep-liver-tenderness'
  ].includes(selectedChronic?.symptomId);

  // Phase 6: Lyme Disease detection
  const isLymeRelated = [
      'lyme-rash', 'lyme-fever', 'lyme-headache', 'lyme-fatigue',
      'lyme-joint-pain', 'lyme-muscle-aches', 'lyme-nerve-pain', 'lyme-cognitive',
      'lyme-heart-palpitations', 'lyme-facial-paralysis'
  ].includes(selectedChronic?.symptomId);

  const isMalariaRelated = [
    'malaria-fever', 'malaria-chills', 'malaria-sweats', 'malaria-headache',
    'malaria-muscle-aches', 'malaria-nausea', 'malaria-fatigue', 'malaria-jaundice',
    'malaria-anemia', 'malaria-enlarged-spleen'
  ].includes(selectedChronic?.symptomId);

  const isBrucellosisRelated = [
    'brucellosis-fever', 'brucellosis-night-sweats', 'brucellosis-fatigue',
    'brucellosis-joint-pain', 'brucellosis-muscle-aches', 'brucellosis-headache',
    'brucellosis-back-pain', 'brucellosis-weight-loss', 'brucellosis-depression',
    'brucellosis-liver-spleen'
  ].includes(selectedChronic?.symptomId);

  const isCampylobacterRelated = [
    'campylobacter-diarrhea', 'campylobacter-abdominal-pain', 'campylobacter-fever',
    'campylobacter-nausea', 'campylobacter-vomiting', 'campylobacter-bloody-stool',
    'campylobacter-fatigue', 'campylobacter-joint-pain', 'campylobacter-muscle-weakness',
    'campylobacter-nerve-symptoms'
  ].includes(selectedChronic?.symptomId);

  const isQFeverRelated = [
    'q-fever-fever', 'q-fever-headache', 'q-fever-fatigue', 'q-fever-muscle-aches',
    'q-fever-cough', 'q-fever-chest-pain', 'q-fever-night-sweats', 'q-fever-chills',
    'q-fever-shortness-breath', 'q-fever-joint-pain'
  ].includes(selectedChronic?.symptomId);

  const isSalmonellaRelated = [
    'salmonella-diarrhea', 'salmonella-fever', 'salmonella-abdominal-cramps',
    'salmonella-nausea', 'salmonella-vomiting', 'salmonella-bloody-stool',
    'salmonella-joint-pain', 'salmonella-bacteremia', 'salmonella-dehydration',
    'salmonella-fatigue'
  ].includes(selectedChronic?.symptomId);

  const isShigellaRelated = [
    'shigella-diarrhea', 'shigella-bloody-stool', 'shigella-abdominal-cramps',
    'shigella-fever', 'shigella-tenesmus', 'shigella-nausea', 'shigella-vomiting',
    'shigella-dehydration', 'shigella-reactive-arthritis', 'shigella-seizures'
  ].includes(selectedChronic?.symptomId);

  const isWestNileRelated = [
    'west-nile-fever', 'west-nile-headache', 'west-nile-body-aches',
    'west-nile-fatigue', 'west-nile-weakness', 'west-nile-cognitive',
    'west-nile-tremors', 'west-nile-vision-problems', 'west-nile-numbness',
    'west-nile-paralysis'
  ].includes(selectedChronic?.symptomId);

  const isNTMRelated = [
    'ntm-cough', 'ntm-sputum', 'ntm-fatigue', 'ntm-fever',
    'ntm-night-sweats', 'ntm-weight-loss', 'ntm-chest-pain',
    'ntm-shortness-breath', 'ntm-hemoptysis', 'ntm-lymph-nodes'
  ].includes(selectedChronic?.symptomId);
  // Phase 7: Dental/Oral detection
  // Exclude skin conditions that have 'oral' in name (e.g., acne-oral-antibiotics, hh-oral-medication)
  const isDentalOralRelated = !isSkinConditionSymptomQL && !isEyeConditionSymptomQL && !isEarConditionSymptomQL && (
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
        'prosthesis-pain', 'prosthesis-fit'].includes(selectedChronic?.symptomId)
  );

  // PHASE 8A: MENTAL HEALTH EXPANSION - DETECTION LOGIC
    const isIllnessAnxietyRelated = [
    'illness-anxiety-fear',
    'illness-anxiety-body-checking',
    'illness-anxiety-reassurance',
    'illness-anxiety-avoidance',
    'illness-anxiety-distress',
  ].includes(selectedChronic?.symptomId);

  // Other Anxiety/Mood
  const isOtherSpecifiedAnxietyRelated = [
    'other-anxiety-symptoms',
    'other-anxiety-worry',
    'other-anxiety-avoidance',
    'other-anxiety-physical',
  ].includes(selectedChronic?.symptomId);

  const isDepersonalizationRelated = [
    'depersonalization-detachment',
    'derealization-unreality',
    'depersonalization-robot',
    'depersonalization-distress',
  ].includes(selectedChronic?.symptomId);

  const isCyclothymicRelated = [
    'cyclothymic-hypomanic',
    'cyclothymic-depressive',
    'cyclothymic-mood-swing',
    'cyclothymic-irritability',
  ].includes(selectedChronic?.symptomId);

  // Eating Disorders - Need special forms
  const isAnorexiaRelated = [
    'anorexia-restricted-eating',
    'anorexia-weight-loss',
    'anorexia-fear-weight-gain',
    'anorexia-body-image',
    'anorexia-incapacitating-episode',
    'anorexia-hospitalization',
  ].includes(selectedChronic?.symptomId);

  const isBulimiaRelated = [
    'bulimia-binge-eating',
    'bulimia-purging',
    'bulimia-compensatory',
    'bulimia-body-image',
    'bulimia-incapacitating-episode',
    'bulimia-hospitalization',
  ].includes(selectedChronic?.symptomId);

  // Phase 8B: Mental health detection
  const isBingeEatingRelated = [
    'binge-eating-episode',
    'binge-eating-loss-of-control',
    'binge-eating-distress',
  ].includes(selectedChronic?.symptomId);

  const isDissociativeRelated = [
    'dissociative-identity-switching',
    'dissociative-amnesia-episode',
    'dissociative-fugue',
    'dissociative-time-loss',
  ].includes(selectedChronic?.symptomId);

  const isAcuteStressRelated = [
    'acute-stress-intrusion',
    'acute-stress-avoidance',
    'acute-stress-arousal',
    'acute-stress-dissociation',
  ].includes(selectedChronic?.symptomId);

  const isPersonalityDisorderRelated = [
    'personality-antisocial-behaviors',
    'personality-borderline-instability',
    'personality-borderline-fear-abandonment',
    'personality-borderline-self-harm',
    'personality-narcissistic-grandiosity',
    'personality-narcissistic-lack-empathy',
    'personality-avoidant-social-inhibition',
    'personality-avoidant-fear-rejection',
    'personality-disorder-occupational-impairment',
    'personality-disorder-social-impairment',
  ].includes(selectedChronic?.symptomId);

  // Phase 9: Cardiovascular detection (including Phase 2A METs-based conditions)
  const isCardiacRelated = selectedChronic?.symptomId?.startsWith('cardiac-') ||
      selectedChronic?.symptomId?.startsWith('cardiomyopathy-') ||
      selectedChronic?.symptomId?.startsWith('cad-') ||
      selectedChronic?.symptomId?.startsWith('post-mi-') ||
      selectedChronic?.symptomId?.startsWith('hhd-');

  const isArrhythmiaRelated = selectedChronic?.symptomId?.startsWith('svt-') ||
      selectedChronic?.symptomId?.startsWith('ventricular-arrhythmia-') ||
      selectedChronic?.symptomId?.startsWith('arrhythmia-') ||
      selectedChronic?.symptomId?.startsWith('aicd-');

  const isPericarditisRelated = selectedChronic?.symptomId?.startsWith('pericarditis-');

  const isPostPhlebiticRelated = selectedChronic?.symptomId?.startsWith('post-phlebitic-');

  const isCardiovascularRelated = isCardiacRelated || isArrhythmiaRelated ||
      isPericarditisRelated || isPostPhlebiticRelated;
  // Phase 10: Digestive condition detection
  const isCirrhosisRelated = selectedChronic?.symptomId?.startsWith('cirrhosis-');
  const isGastritisRelated = selectedChronic?.symptomId?.startsWith('gastritis-');
  const isPancreatitisRelated = selectedChronic?.symptomId?.startsWith('pancreatitis-');
  const isBiliaryRelated = selectedChronic?.symptomId?.startsWith('biliary-');
  const isDigestivePhase10Related = isCirrhosisRelated || isGastritisRelated ||
      isPancreatitisRelated || isBiliaryRelated;
  // ============================================
  // PHASE 1A: NEUROLOGICAL CONDITION DETECTION
  // ============================================
  const isMultipleSclerosisRelated = selectedChronic?.symptomId?.startsWith('ms-') ||
      selectedChronic?.category === 'Multiple Sclerosis Symptoms';
  const isParkinsonsRelated = selectedChronic?.symptomId?.startsWith('pd-') ||
      selectedChronic?.category === "Parkinson's Disease Symptoms";
  const isMyastheniaRelated = selectedChronic?.symptomId?.startsWith('mg-') ||
      selectedChronic?.category === 'Myasthenia Gravis Symptoms';
  const isNeurologicalPhase1ARelated = isMultipleSclerosisRelated ||
      isParkinsonsRelated || isMyastheniaRelated;
  // ============================================
  // PHASE 1B: ADDITIONAL NEUROLOGICAL DETECTION
  // ============================================
  const isNarcolepsyRelated = selectedChronic?.symptomId?.startsWith('narco-') ||
      selectedChronic?.category === 'narcolepsy';
  const isALSRelated = selectedChronic?.symptomId?.startsWith('als-') ||
      selectedChronic?.category === 'als';
  const isSyringomyeliaRelated = selectedChronic?.symptomId?.startsWith('syring-') ||
      selectedChronic?.category === 'syringomyelia';
  const isMyelitisRelated = selectedChronic?.symptomId?.startsWith('myel-') ||
      selectedChronic?.category === 'myelitis';
  const isNeurologicalPhase1BRelated = isNarcolepsyRelated || isALSRelated ||
      isSyringomyeliaRelated || isMyelitisRelated;
  // ============================================
  // PHASE 3A: ENDOCRINE - THYROID & PARATHYROID DETECTION
  // ============================================
  const isHyperthyroidismRelated = selectedChronic?.symptomId?.startsWith('hyper-') ||
      selectedChronic?.symptomId?.startsWith('graves-') ||
      selectedChronic?.category === 'hyperthyroidism';
  const isThyroiditisRelated = selectedChronic?.symptomId?.startsWith('thyroiditis-') ||
      selectedChronic?.category === 'thyroiditis';
  const isHyperparathyroidismRelated = selectedChronic?.symptomId?.startsWith('hpth-') ||
      selectedChronic?.category === 'hyperparathyroidism';
  const isHypoparathyroidismRelated = selectedChronic?.symptomId?.startsWith('hopth-') ||
      selectedChronic?.category === 'hypoparathyroidism';
  const isEndocrinePhase3ARelated = isHyperthyroidismRelated || isThyroiditisRelated ||
      isHyperparathyroidismRelated || isHypoparathyroidismRelated;
  // Phase 3B: Adrenal & Pituitary Detection
  const isAddisonsDiseaseRelated = selectedChronic?.symptomId?.startsWith('addisons-') ||
      selectedChronic?.category === 'addisons-disease';
  const isCushingsSyndromeRelated = selectedChronic?.symptomId?.startsWith('cushings-') ||
      selectedChronic?.category === 'cushings-syndrome';
  const isDiabetesInsipidusRelated = selectedChronic?.symptomId?.startsWith('di-') ||
      selectedChronic?.category === 'diabetes-insipidus';
  const isHyperaldosteronismRelated = selectedChronic?.symptomId?.startsWith('haldo-') ||
      selectedChronic?.category === 'hyperaldosteronism';
  const isEndocrinePhase3BRelated = isAddisonsDiseaseRelated || isCushingsSyndromeRelated ||
      isDiabetesInsipidusRelated || isHyperaldosteronismRelated;
  // ============================================
  // PHASE 1C: PERIPHERAL NERVE DETECTION
  // ============================================
  // Upper Extremity Nerves
  const isUpperRadicularRelated = selectedChronic?.symptomId?.startsWith('uprn-') ||
      selectedChronic?.category === 'upper-radicular-nerve';
  const isMiddleRadicularRelated = selectedChronic?.symptomId?.startsWith('mdrn-') ||
      selectedChronic?.category === 'middle-radicular-nerve';
  const isLowerRadicularRelated = selectedChronic?.symptomId?.startsWith('lwrn-') ||
      selectedChronic?.category === 'lower-radicular-nerve';
  const isAllRadicularRelated = selectedChronic?.symptomId?.startsWith('alrn-') ||
      selectedChronic?.category === 'all-radicular-nerve';
  const isRadialNerveRelated = selectedChronic?.symptomId?.startsWith('radn-') ||
      selectedChronic?.category === 'radial-nerve';
  const isMedianNerveRelated = selectedChronic?.symptomId?.startsWith('medn-') ||
      selectedChronic?.category === 'median-nerve';
  const isUlnarNerveRelated = selectedChronic?.symptomId?.startsWith('ulnn-') ||
      selectedChronic?.category === 'ulnar-nerve';
  const isMusculocutaneousNerveRelated = selectedChronic?.symptomId?.startsWith('mscn-') ||
      selectedChronic?.category === 'musculocutaneous-nerve';
  const isCircumflexNerveRelated = selectedChronic?.symptomId?.startsWith('crcn-') ||
      selectedChronic?.category === 'circumflex-nerve';
  const isLongThoracicNerveRelated = selectedChronic?.symptomId?.startsWith('ltn-') ||
      selectedChronic?.category === 'long-thoracic-nerve';

  // Lower Extremity Nerves
  const isSciaticNerveRelated = selectedChronic?.symptomId?.startsWith('scin-') ||
      selectedChronic?.category === 'sciatic-nerve';
  const isCommonPeronealNerveRelated = selectedChronic?.symptomId?.startsWith('cpn-') ||
      selectedChronic?.category === 'common-peroneal-nerve';
  const isSuperficialPeronealNerveRelated = selectedChronic?.symptomId?.startsWith('spn-') ||
      selectedChronic?.category === 'superficial-peroneal-nerve';
  const isDeepPeronealNerveRelated = selectedChronic?.symptomId?.startsWith('dpn-') ||
      selectedChronic?.category === 'deep-peroneal-nerve';
  const isTibialNerveRelated = selectedChronic?.symptomId?.startsWith('tibn-') ||
      selectedChronic?.category === 'tibial-nerve';
  const isPosteriorTibialNerveRelated = selectedChronic?.symptomId?.startsWith('ptn-') ||
      selectedChronic?.category === 'posterior-tibial-nerve';
  const isFemoralNerveRelated = selectedChronic?.symptomId?.startsWith('femn-') ||
      selectedChronic?.category === 'femoral-nerve';
  const isSaphenousNerveRelated = selectedChronic?.symptomId?.startsWith('sapn-') ||
      selectedChronic?.category === 'saphenous-nerve';
  const isObturatorNerveRelated = selectedChronic?.symptomId?.startsWith('obtn-') ||
      selectedChronic?.category === 'obturator-nerve';
  const isLateralFemoralCutaneousNerveRelated = selectedChronic?.symptomId?.startsWith('lfcn-') ||
      selectedChronic?.category === 'lateral-femoral-cutaneous-nerve';
  const isIlioinguinalNerveRelated = selectedChronic?.symptomId?.startsWith('iin-') ||
      selectedChronic?.category === 'ilioinguinal-nerve';

  // Combined detection flags
  const isUpperExtremityNerveRelated = isUpperRadicularRelated || isMiddleRadicularRelated ||
      isLowerRadicularRelated || isAllRadicularRelated || isRadialNerveRelated ||
      isMedianNerveRelated || isUlnarNerveRelated || isMusculocutaneousNerveRelated ||
      isCircumflexNerveRelated || isLongThoracicNerveRelated;

  const isLowerExtremityNerveRelated = isSciaticNerveRelated || isCommonPeronealNerveRelated ||
      isSuperficialPeronealNerveRelated || isDeepPeronealNerveRelated || isTibialNerveRelated ||
      isPosteriorTibialNerveRelated || isFemoralNerveRelated || isSaphenousNerveRelated ||
      isObturatorNerveRelated || isLateralFemoralCutaneousNerveRelated || isIlioinguinalNerveRelated;

  const isPeripheralNerveRelated = isUpperExtremityNerveRelated || isLowerExtremityNerveRelated;

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
    setSpineData({ spineLocation: '', fractureType: '', fusionLevels: '',
      neurogenicClaudication: false, morningStiffnessDuration: '',
    });
    setSeizureData({
      episodeType: '', duration: '', lossOfConsciousness: null,
      auraPresent: null, recoveryTime: '', witnessPresent: null,
      // Phase 1D: Jacksonian fields
      focalOnsetLocation: '', focalSpread: null, spreadPattern: '',
      secondaryGeneralization: null, awarenessPreserved: null,
      // Phase 1D: Diencephalic fields
      autonomicSymptoms: [],
      // Phase 1D: Psychomotor fields
      automatisms: [], hallucinations: null, hallucinationType: '',
      perceptualIllusions: null, moodChange: null, memoryDisturbance: null,
      automaticState: null,
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
    // Phase 6: Reset HIV/AIDS data
    setHivData({
        infectionType: '',
        constitutionalSymptoms: [],
        weightLossPercentage: '',
        onAntiretrovirals: false,
        cd4CountKnown: false,
        cd4Range: '',
        treatmentCompliance: '',
    });
    // Phase 6: Reset Hepatitis data
    setHepatitisData({
        weightLossPercentage: '',
        debilitating: false,
        dietaryRestrictions: false,
        symptomFrequency: '',
    });

    // Phase 6: Reset Lyme data
    setLymeData({
        activeTreatment: false,
        treatmentCompleted: false,
        treatmentStartDate: '',
        rashPresent: false,
        rashType: '',
        neurologicalSymptoms: [],
        jointSymptoms: [],
    });
    setMalariaData({
      relapseEpisode: false,
      hospitalized: false,
      continuousMedication: false,
      severeComplications: false,
      feverTemperature: '',
      cyclicalPattern: false,
    });
    setBrucellosisData({
      relapseEpisode: false,
      multiOrganInvolvement: false,
      chronicArthritis: false,
      neurobrucellosis: false,
      undulantFever: false,
    });
    setCampylobacterData({
      guillainBarre: false,
      reactiveArthritis: false,
      chronicIBS: false,
      weeksSinceInfection: '',
      stoolCultureConfirmed: false,
    });
    setQFeverData({
      chronicQFever: false,
      endocarditis: false,
      fatigueSyndrome: false,
      monthsSinceInfection: '',
      phaseIAntibodies: false,
    });
    setSalmonellaData({
      hospitalized: false,
      bacteremia: false,
      reactiveArthritis: false,
      severeComplications: false,
      stoolCultureConfirmed: false,
    });
    setShigellaData({
      hospitalized: false,
      hus: false,
      reactiveArthritis: false,
      severeComplications: false,
      stoolCultureConfirmed: false,
    });
    setWestNileData({
      neuroinvasive: false,
      encephalitis: false,
      acuteFlaccidParalysis: false,
      permanentImpairment: false,
      serologyConfirmed: false,
    });
    setNtmData({
      activeDisease: false,
      onTreatment: false,
      disseminated: false,
      monthsOnTreatment: '',
      ntmSpecies: '',
    });
    // Phase 7: Reset dental data
    setDentalData({
      jawPainSeverity: 5, jawOpening: '', toothCount: '',
      prosthesisType: '', dietaryRestrictions: '', chewingDifficulty: '',
    });
    // PHASE 8A: MENTAL HEALTH EXPANSION - RESET STATE
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
    // Phase 8B: Reset mental health data

      setBingeEatingData({
        bingeEpisode: false,
        lossOfControl: false,
        distressLevel: 5,
      });

      setDissociativeData({
        memoryGap: false,
        lostTime: false,
        duration: '',
      });
      setAcuteStressData({
        traumaDate: '',
        dissociativeSymptoms: false,
        avoidance: false,
      });
      setPersonalityData({
        occupationalImpact: false,
        socialImpact: false,
      });
    // Phase 8A: Mental Health Expansion - Reset additional state
    setSomaticSymptomData({
      painPreoccupation: false,
      excessiveHealthWorry: false,
      multipleSymptoms: false,
      frequentDoctorVisits: false,
      functionalImpairment: false,
    });
    setIllnessAnxietyData({
      fearOfIllness: false,
      bodyChecking: false,
      reassuranceSeeking: false,
      appointmentAvoidance: false,
      healthDistress: false,
    });
    setDepersonalizationData({
      detachment: false,
      unreality: false,
      robotAutopilot: false,
      distress: false,
    });
    setCyclothymicData({
      hypomanic: false,
      depressive: false,
      moodSwings: false,
      irritability: false,
    });
    // Phase 9: Reset cardiovascular data
    setCardiovascularData({
      activityLevel: '',
      symptomTrigger: '',
      atRest: false,
      withExertion: false,
      episodeType: '',
      treatmentRequired: '',
      hospitalized: false,
      hasAICD: false,
      aicdShockDelivered: false,
      vagalManeuverUsed: false,
      activeInfection: false,
      painWorseWithBreathing: false,
      painReliefLeaningForward: false,
      affectedLeg: '',
      compressionUsed: false,
      elevationHelps: false,
    });
    // Phase 10: Reset digestive data
    setDigestiveData({
      hasMeldScore: false,
      meldScore: '',
      hasAscites: false,
      ascitesSeverity: '',
      hasEncephalopathy: false,
      encephalopathyGrade: '',
      hasVaricealBleed: false,
      onLactulose: false,
      onDiuretics: false,
      episodeDuration: '',
      onDailyMedication: false,
      medicationType: '',
      hasGIBleeding: false,
      painLocation: '',
      onEnzymes: false,
      hasDietaryRestriction: false,
      dietaryRestrictionType: '',
      hasMaldigestion: false,
      attackWithNausea: false,
      attackWithVomiting: false,
      hadStrictureDilation: false,
      hospitalized: false,
      hospitalizationReason: '',
    });
    // Phase 1A: Reset neurological data
    setMultipleSclerosisData({
      isRelapse: false,
      relapseDuration: '',
      relapseRecovery: '',
      mobilityAid: '',
      assistanceNeeded: false,
      assistanceType: '',
      onDMT: false,
      dmtType: '',
      recentSteroids: false,
      edssEstimate: '',
      heatTriggered: false,
    });
    setParkinsonsData({
      tremorSide: '',
      tremorSeverity: '',
      freezingEpisodes: '',
      fallsToday: '',
      onTime: '',
      medicationState: '',
      mobilityAid: '',
      assistanceNeeded: false,
      speechAffected: false,
      swallowingAffected: false,
      hallucinationsPresent: false,
      confusionPresent: false,
    });
    setMyastheniaData({
      worseWithActivity: false,
      betterWithRest: false,
      timeOfDayWorst: '',
      ocularOnly: false,
      bulbarInvolved: false,
      limbsInvolved: false,
      respiratoryInvolved: false,
      canRaiseArms: '',
      ptosisPresent: false,
      ptosisSide: '',
      doubleVision: false,
      onPyridostigmine: false,
      dosesTakenToday: '',
      breathingDifficulty: false,
      emergencySigns: false,
    });
    // Phase 1B: Reset narcolepsy data
    setNarcolepsyData({
      sleepAttackDuration: '',
      sleepAttackTrigger: '',
      cataplexyTrigger: '',
      cataplexyAffected: '',
      fellDuringCataplexy: false,
      hallucinationType: '',
      paralysisAtSleep: false,
      paralysisAtWake: false,
      onStimulants: false,
      onSodiumOxybate: false,
      sleepStudyConfirmed: false,
    });
    // Phase 1B: Reset ALS data
    setAlsData({
      weaknessLocation: '',
      weaknessSide: '',
      fasciculationLocation: '',
      speechClarity: '',
      swallowingSolids: '',
      swallowingLiquids: '',
      breathingDifficulty: '',
      usesBiPAP: false,
      usesVentilator: false,
      usesFeedingTube: false,
      mobilityStatus: '',
    });
    // Phase 1B: Reset syringomyelia data
    setSyringomyeliaData({
      painType: '',
      painLocation: '',
      sensoryLossPattern: '',
      tempInsensitivityArea: '',
      hadBurnInjury: false,
      hadCutInjury: false,
      syrinxLocation: '',
    });
    // Phase 1B: Reset myelitis data
    setMyelitisData({
      weaknessDistribution: '',
      sensoryLevel: '',
      bladderSymptoms: '',
      usesCatheter: false,
      bowelSymptoms: '',
      mobilityStatus: '',
      causeOfMyelitis: '',
    });
    // Phase 1C: Reset peripheral nerve data
    setPeripheralNerveData({
      affectedSide: '',
      isDominantSide: '',
      nerveConditionType: '',
      severityLevel: '',
      hasMotorInvolvement: false,
      hasSensoryInvolvement: false,
      hasAtrophy: false,
      hasDeformity: false,
      deformityType: '',
      usesAssistiveDevice: false,
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
    if (isSpineConditionRelated) {
      entry.spineData = { ...spineData };
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
    // Phase 6: Add HIV/AIDS data
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
    if (isAnorexiaRelated || isBulimiaRelated) {
      entry.eatingDisorderData = { ...eatingDisorderData };
    }
    // Phase 8A: Mental Health Expansion - Save condition-specific data
    if (isSomaticSymptomRelated) {
      entry.somaticData = { ...somaticSymptomData };
    }
    if (isIllnessAnxietyRelated) {
      entry.illnessAnxietyData = { ...illnessAnxietyData };
    }
    if (isDepersonalizationRelated) {
      entry.depersonalizationData = { ...depersonalizationData };
    }
    if (isCyclothymicRelated) {
      entry.cyclothymicData = { ...cyclothymicData };
    }
    if (isAnxietyFormRelated) {
      entry.anxietyData = anxietyData;
    }
    if (isDepressionFormRelated) {
      entry.depressionData = depressionData;
    }
    if (isBipolarFormRelated) {
      entry.bipolarData = bipolarData;
    }
    if (isOCDFormRelated) {
      entry.ocdData = ocdData;
    }
    if (isAdjustmentDisorderFormRelated) {
      entry.adjustmentDisorderData = adjustmentDisorderData;
    }
    // Phase 8B: Add Mental Health Data
    if (isBingeEatingRelated) {
      entry.bingeEatingData = bingeEatingData;
    }
    if (isDissociativeRelated) {
      entry.dissociativeData = dissociativeData;
    }
    if (isAcuteStressRelated) {
      entry.acuteStressData = acuteStressData;
    }
    if (isPersonalityDisorderRelated) {
      entry.personalityData = personalityData;
    }
    // Phase 9: Add cardiovascular data
    if (isCardiovascularRelated) {
      entry.cardiovascularData = cardiovascularData;
    }
    // Phase 10: Add digestive data
    if (isDigestivePhase10Related) {
      entry.digestiveData = digestiveData;
    }
    // Phase 1A: Add neurological data
    if (isMultipleSclerosisRelated) {
      entry.multipleSclerosisData = multipleSclerosisData;
    }
    if (isParkinsonsRelated) {
      entry.parkinsonsData = parkinsonsData;
    }
    if (isMyastheniaRelated) {
      entry.myastheniaData = myastheniaData;
    }
    // Phase 1B: Add neurological data
    if (isNarcolepsyRelated) {
      entry.narcolepsyData = narcolepsyData;
    }
    if (isALSRelated) {
      entry.alsData = alsData;
    }
    if (isSyringomyeliaRelated) {
      entry.syringomyeliaData = syringomyeliaData;
    }
    if (isMyelitisRelated) {
      entry.myelitisData = myelitisData;
    }
    // Phase 1C: Add peripheral nerve data
    if (isPeripheralNerveRelated) {
      entry.peripheralNerveData = {
        ...peripheralNerveData,
        nerveLocation: isUpperExtremityNerveRelated ? 'upper' : 'lower',
      };
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{stripDCCode(chronic.category)}</p>

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
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stripDCCode(selectedChronic.category)}</p>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        0-3: Mild • 4-6: Moderate (affects activities) • 7-10: Severe (impairs function)
                      </p>
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

                  {/* Phase 1D: Jacksonian/Focal (DC 8912) Compact Fields */}
                  {isJacksonianEpilepsyQL && (
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3 space-y-2">
                        <h4 className="text-xs font-medium text-purple-800 dark:text-purple-300">
                          🎯 Focal Details (DC 8912)
                        </h4>

                        <select
                            value={seizureData.focalOnsetLocation || ''}
                            onChange={(e) => setSeizureData(prev => ({ ...prev, focalOnsetLocation: e.target.value }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                        >
                          <option value="">Onset location...</option>
                          <option value="face">Face</option>
                          <option value="hand">Hand</option>
                          <option value="arm">Arm</option>
                          <option value="leg">Leg</option>
                          <option value="sensory">Sensory</option>
                          <option value="visual">Visual</option>
                        </select>

                        <div className="grid grid-cols-2 gap-1">
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, focalSpread: !prev.focalSpread }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.focalSpread
                                      ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Spread (March)</button>
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, secondaryGeneralization: !prev.secondaryGeneralization }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.secondaryGeneralization
                                      ? 'bg-red-100 dark:bg-red-900/50 border-red-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Generalized (Major)</button>
                        </div>
                      </div>
                  )}

                  {/* Phase 1D: Diencephalic (DC 8913) Compact Fields */}
                  {isDiencephalicEpilepsyQL && (
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3 space-y-2">
                        <h4 className="text-xs font-medium text-purple-800 dark:text-purple-300">
                          🌡️ Autonomic (DC 8913)
                        </h4>

                        <div className="grid grid-cols-4 gap-1">
                          {[
                            { id: 'flushing', label: '🔴' },
                            { id: 'sweating', label: '💧' },
                            { id: 'hr-change', label: '💓' },
                            { id: 'gi-symptoms', label: '🤢' },
                          ].map(s => (
                              <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => {
                                    const current = seizureData.autonomicSymptoms || [];
                                    if (current.includes(s.id)) {
                                      setSeizureData(prev => ({ ...prev, autonomicSymptoms: current.filter(x => x !== s.id) }));
                                    } else {
                                      setSeizureData(prev => ({ ...prev, autonomicSymptoms: [...current, s.id] }));
                                    }
                                  }}
                                  className={`p-2 rounded border text-sm ${
                                      seizureData.autonomicSymptoms?.includes(s.id)
                                          ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400'
                                          : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}
                                  title={s.id}
                              >{s.label}</button>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* Phase 1D: Psychomotor (DC 8914) Compact Fields */}
                  {isPsychomotorEpilepsyQL && (
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3 space-y-2">
                        <h4 className="text-xs font-medium text-purple-800 dark:text-purple-300">
                          🧠 Psychomotor (DC 8914)
                        </h4>

                        <div className="grid grid-cols-2 gap-1">
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, automaticState: !prev.automaticState }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.automaticState
                                      ? 'bg-red-100 dark:bg-red-900/50 border-red-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Auto State (Major)</button>
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, hallucinations: !prev.hallucinations }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.hallucinations
                                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Hallucinations</button>
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, perceptualIllusions: !prev.perceptualIllusions }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.perceptualIllusions
                                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Déjà vu</button>
                          <button
                              type="button"
                              onClick={() => setSeizureData(prev => ({ ...prev, moodChange: !prev.moodChange }))}
                              className={`p-2 rounded border text-xs ${
                                  seizureData.moodChange
                                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400'
                                      : 'bg-white dark:bg-gray-800 border-gray-200'
                              }`}
                          >Mood Δ</button>
                        </div>

                        {/* Automatisms row */}
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'lip-smacking', label: 'Lips' },
                            { id: 'hand-movements', label: 'Hands' },
                            { id: 'wandering', label: 'Wander' },
                          ].map(a => (
                              <button
                                  key={a.id}
                                  type="button"
                                  onClick={() => {
                                    const current = seizureData.automatisms || [];
                                    if (current.includes(a.id)) {
                                      setSeizureData(prev => ({ ...prev, automatisms: current.filter(x => x !== a.id) }));
                                    } else {
                                      setSeizureData(prev => ({ ...prev, automatisms: [...current, a.id] }));
                                    }
                                  }}
                                  className={`p-1 rounded border text-xs ${
                                      seizureData.automatisms?.includes(a.id)
                                          ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400'
                                          : 'bg-white dark:bg-gray-800 border-gray-200'
                                  }`}
                              >{a.label}</button>
                          ))}
                        </div>

                        {/* Major/Minor indicator */}
                        {(seizureData.automaticState || seizureData.lossOfConsciousness === 'yes') && (
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                              ⚠️ Major characteristics
                            </div>
                        )}
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

                  {/* Phase 6: HIV/AIDS Form */}
                  {isHIVRelated && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-800 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🦠</span>
                          <h4 className="font-semibold text-red-900 dark:text-red-300">HIV/AIDS Details</h4>
                        </div>

                        {/* Opportunistic Infection */}
                        {selectedChronic === 'hiv-opportunistic-infection' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Infection Type
                              </label>
                              <select
                                  value={hivData.infectionType}
                                  onChange={(e) => setHivData({...hivData, infectionType: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="">Select...</option>
                                <option value="PCP">PCP</option>
                                <option value="CMV">CMV</option>
                                <option value="MAC">MAC</option>
                                <option value="Toxoplasmosis">Toxoplasmosis</option>
                                <option value="TB">TB</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                        )}

                        {/* Constitutional Symptoms */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Constitutional Symptoms
                          </label>
                          <div className="space-y-1">
                            {['Night sweats', 'Persistent fever', 'Chronic diarrhea', 'Fatigue'].map(symptom => (
                                <label key={symptom} className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={hivData.constitutionalSymptoms.includes(symptom)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setHivData({...hivData, constitutionalSymptoms: [...hivData.constitutionalSymptoms, symptom]});
                                        } else {
                                          setHivData({...hivData, constitutionalSymptoms: hivData.constitutionalSymptoms.filter(s => s !== symptom)});
                                        }
                                      }}
                                      className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{symptom}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {/* Weight Loss */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Weight Loss % (if applicable)
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
                        </div>

                        {/* Treatment */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hivData.onAntiretrovirals}
                                onChange={(e) => setHivData({...hivData, onAntiretrovirals: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">On antiretroviral therapy (30%)</span>
                          </label>

                          {hivData.onAntiretrovirals && (
                              <select
                                  value={hivData.treatmentCompliance}
                                  onChange={(e) => setHivData({...hivData, treatmentCompliance: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="">Compliance...</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                              </select>
                          )}
                        </div>

                        {/* CD4 Count */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hivData.cd4CountKnown}
                                onChange={(e) => setHivData({...hivData, cd4CountKnown: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">I know my CD4 count</span>
                          </label>

                          {hivData.cd4CountKnown && (
                              <select
                                  value={hivData.cd4Range}
                                  onChange={(e) => setHivData({...hivData, cd4Range: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="">CD4 range...</option>
                                <option value="<200">&lt;200 (Severe)</option>
                                <option value="200-500">200-500 (Moderate)</option>
                                <option value=">500">&gt;500 (Normal)</option>
                              </select>
                          )}
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Hepatitis (B & C) Form */}
                  {isHepatitisRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-2 border-amber-200 dark:border-amber-800 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🦠</span>
                          <h4 className="font-semibold text-amber-900 dark:text-amber-300">Hepatitis Details</h4>
                        </div>

                        {/* Weight Loss */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Weight Loss % (if applicable)
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
                        </div>

                        {/* Frequency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Symptom Frequency
                          </label>
                          <select
                              value={hepatitisData.symptomFrequency}
                              onChange={(e) => setHepatitisData({...hepatitisData, symptomFrequency: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Select...</option>
                            <option value="daily">Daily</option>
                            <option value="intermittent">Intermittent</option>
                            <option value="rare">Rare</option>
                          </select>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hepatitisData.debilitating}
                                onChange={(e) => setHepatitisData({...hepatitisData, debilitating: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Debilitating symptoms</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hepatitisData.dietaryRestrictions}
                                onChange={(e) => setHepatitisData({...hepatitisData, dietaryRestrictions: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Dietary restrictions</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Lyme Disease Form */}
                  {isLymeRelated && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🦟</span>
                          <h4 className="font-semibold text-green-900 dark:text-green-300">Lyme Disease Details</h4>
                        </div>

                        {/* Treatment Status */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={lymeData.activeTreatment}
                                onChange={(e) => setLymeData({...lymeData, activeTreatment: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Active treatment (100%)</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={lymeData.treatmentCompleted}
                                onChange={(e) => setLymeData({...lymeData, treatmentCompleted: e.target.checked})}
                                className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Treatment completed</span>
                          </label>
                        </div>

                        {/* Treatment Date */}
                        {lymeData.treatmentCompleted && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Treatment Completion Date
                              </label>
                              <input
                                  type="date"
                                  value={lymeData.treatmentStartDate}
                                  onChange={(e) => setLymeData({...lymeData, treatmentStartDate: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                        )}

                        {/* Rash Details (only for lyme-rash symptom) */}
                        {selectedChronic === 'lyme-rash' && (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={lymeData.rashPresent}
                                    onChange={(e) => setLymeData({...lymeData, rashPresent: e.target.checked})}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Rash present</span>
                              </label>

                              {lymeData.rashPresent && (
                                  <select
                                      value={lymeData.rashType}
                                      onChange={(e) => setLymeData({...lymeData, rashType: e.target.value})}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  >
                                    <option value="">Rash type...</option>
                                    <option value="bulls-eye">Bull's-eye</option>
                                    <option value="expanding-red">Expanding red</option>
                                    <option value="other">Other</option>
                                  </select>
                              )}
                            </div>
                        )}
                      </div>
                  )}

                  {/* Phase 6: Malaria Quick Form */}
                  {isMalariaRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦟 Malaria Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track malaria episodes. Document relapses and complications.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={malariaData.relapseEpisode}
                                onChange={(e) => setMalariaData({...malariaData, relapseEpisode: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Relapse episode</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={malariaData.cyclicalPattern}
                                onChange={(e) => setMalariaData({...malariaData, cyclicalPattern: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Cyclical fever pattern</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={malariaData.hospitalized}
                                onChange={(e) => setMalariaData({...malariaData, hospitalized: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Hospitalized for severe malaria</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={malariaData.continuousMedication}
                                onChange={(e) => setMalariaData({...malariaData, continuousMedication: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Continuous antimalarial medication required</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={malariaData.severeComplications}
                                onChange={(e) => setMalariaData({...malariaData, severeComplications: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Severe complications (cerebral malaria, organ failure)</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Parasitic infection common in deployment areas. Relapses can occur months or years after initial infection.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Brucellosis Quick Form */}
                  {isBrucellosisRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦠 Brucellosis Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track brucellosis infection. Document chronic symptoms and relapses.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={brucellosisData.relapseEpisode}
                                onChange={(e) => setBrucellosisData({...brucellosisData, relapseEpisode: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Relapse episode (symptoms returning)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={brucellosisData.chronicArthritis}
                                onChange={(e) => setBrucellosisData({...brucellosisData, chronicArthritis: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Chronic arthritis/joint symptoms</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={brucellosisData.multiOrganInvolvement}
                                onChange={(e) => setBrucellosisData({...brucellosisData, multiOrganInvolvement: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Multi-organ involvement (liver, spleen, heart)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={brucellosisData.neurobrucellosis}
                                onChange={(e) => setBrucellosisData({...brucellosisData, neurobrucellosis: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-bold">Neurobrucellosis (nervous system involvement)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={brucellosisData.undulantFever}
                                onChange={(e) => setBrucellosisData({...brucellosisData, undulantFever: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Undulant fever (recurring wave-like fever pattern)</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Bacterial infection from unpasteurized dairy or animal contact. Can cause chronic debilitating symptoms.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Campylobacter Quick Form */}
                  {isCampylobacterRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦠 Campylobacter jejuni Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track Campylobacter infection. Document long-term complications like Guillain-Barré syndrome.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={campylobacterData.stoolCultureConfirmed}
                                onChange={(e) => setCampylobacterData({...campylobacterData, stoolCultureConfirmed: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Stool culture confirmed Campylobacter</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={campylobacterData.reactiveArthritis}
                                onChange={(e) => setCampylobacterData({...campylobacterData, reactiveArthritis: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Reactive arthritis (post-infectious joint inflammation)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={campylobacterData.chronicIBS}
                                onChange={(e) => setCampylobacterData({...campylobacterData, chronicIBS: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Post-infectious IBS (chronic bowel symptoms)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={campylobacterData.guillainBarre}
                                onChange={(e) => setCampylobacterData({...campylobacterData, guillainBarre: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-bold">Guillain-Barré Syndrome (ascending paralysis)</span>
                          </label>
                        </div>

                        {campylobacterData.weeksSinceInfection && (
                            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded text-xs text-amber-900 dark:text-amber-200">
                              {campylobacterData.weeksSinceInfection} weeks since initial infection
                            </div>
                        )}

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Common foodborne illness. Can trigger serious complications like Guillain-Barré syndrome. Document all symptoms.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Q Fever Quick Form */}
                  {isQFeverRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦠 Q Fever Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track Q Fever infection. Document chronic complications and endocarditis.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={qFeverData.chronicQFever}
                                onChange={(e) => setQFeverData({...qFeverData, chronicQFever: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Chronic Q Fever (&gt;6 months)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={qFeverData.phaseIAntibodies}
                                onChange={(e) => setQFeverData({...qFeverData, phaseIAntibodies: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Phase I antibodies present (indicates chronic infection)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={qFeverData.endocarditis}
                                onChange={(e) => setQFeverData({...qFeverData, endocarditis: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-bold">Endocarditis (heart valve infection)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={qFeverData.fatigueSyndrome}
                                onChange={(e) => setQFeverData({...qFeverData, fatigueSyndrome: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Q Fever Fatigue Syndrome (chronic debilitating fatigue)</span>
                          </label>
                        </div>

                        {qFeverData.monthsSinceInfection && (
                            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded text-xs text-amber-900 dark:text-amber-200">
                              {qFeverData.monthsSinceInfection} months since initial infection
                            </div>
                        )}

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Bacterial infection from livestock/animal exposure. Can become chronic with serious complications. Document all symptoms.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Salmonella Quick Form */}
                  {isSalmonellaRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦠 Nontyphoid Salmonella Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track Salmonella infection symptoms. Document complications like bacteremia and reactive arthritis.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={salmonellaData.stoolCultureConfirmed}
                                onChange={(e) => setSalmonellaData({...salmonellaData, stoolCultureConfirmed: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Stool culture confirmed Salmonella</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={salmonellaData.reactiveArthritis}
                                onChange={(e) => setSalmonellaData({...salmonellaData, reactiveArthritis: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Reactive arthritis (joint inflammation 1-4 weeks post-infection)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={salmonellaData.bacteremia}
                                onChange={(e) => setSalmonellaData({...salmonellaData, bacteremia: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Bacteremia/Sepsis (bacteria in bloodstream)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={salmonellaData.hospitalized}
                                onChange={(e) => setSalmonellaData({...salmonellaData, hospitalized: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Hospitalized for complications</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={salmonellaData.severeComplications}
                                onChange={(e) => setSalmonellaData({...salmonellaData, severeComplications: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Other severe complications</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Common foodborne illness in military deployments. Document all symptoms and complications.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: Shigella Quick Form */}
                  {isShigellaRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦠 Shigella Infection Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track Shigella dysentery symptoms. Document bloody diarrhea, tenesmus, and complications.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={shigellaData.stoolCultureConfirmed}
                                onChange={(e) => setShigellaData({...shigellaData, stoolCultureConfirmed: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Stool culture confirmed Shigella</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={shigellaData.reactiveArthritis}
                                onChange={(e) => setShigellaData({...shigellaData, reactiveArthritis: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Reactive arthritis (Reiter syndrome)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={shigellaData.hus}
                                onChange={(e) => setShigellaData({...shigellaData, hus: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-bold">Hemolytic Uremic Syndrome (HUS) - kidney failure</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={shigellaData.hospitalized}
                                onChange={(e) => setShigellaData({...shigellaData, hospitalized: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Hospitalized for complications</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={shigellaData.severeComplications}
                                onChange={(e) => setShigellaData({...shigellaData, severeComplications: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Other severe complications (seizures, severe dehydration)</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Shigella causes dysentery (bloody diarrhea with painful straining/tenesmus). Common in Gulf War deployments. HUS is rare but serious. Document all symptoms and complications.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: West Nile Quick Form */}
                  {isWestNileRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🦟 West Nile Virus Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track West Nile symptoms. Neuroinvasive disease can cause long-term impairment.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={westNileData.serologyConfirmed}
                                onChange={(e) => setWestNileData({...westNileData, serologyConfirmed: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">West Nile IgM antibodies confirmed</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={westNileData.neuroinvasive}
                                onChange={(e) => setWestNileData({...westNileData, neuroinvasive: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Neuroinvasive disease (nervous system involvement)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={westNileData.encephalitis}
                                onChange={(e) => setWestNileData({...westNileData, encephalitis: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Encephalitis (brain inflammation)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={westNileData.acuteFlaccidParalysis}
                                onChange={(e) => setWestNileData({...westNileData, acuteFlaccidParalysis: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-bold">Acute Flaccid Paralysis (polio-like)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={westNileData.permanentImpairment}
                                onChange={(e) => setWestNileData({...westNileData, permanentImpairment: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Permanent neurological impairment</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Mosquito-borne illness. Neuroinvasive complications require detailed documentation. Acute flaccid paralysis may be permanent.
                        </div>
                      </div>
                  )}

                  {/* Phase 6: NTM Quick Form */}
                  {isNTMRelated && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          🫁 Nontuberculous Mycobacterium Details
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Track NTM lung infection. Requires 12-24 months of multi-drug therapy.
                        </p>

                        <div className="space-y-2">
                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={ntmData.activeDisease}
                                onChange={(e) => setNtmData({...ntmData, activeDisease: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Active NTM disease (positive cultures, CT findings)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={ntmData.onTreatment}
                                onChange={(e) => setNtmData({...ntmData, onTreatment: e.target.checked})}
                                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">On long-term antibiotic therapy (12-24 months)</span>
                          </label>

                          <label className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={ntmData.disseminated}
                                onChange={(e) => setNtmData({...ntmData, disseminated: e.target.checked})}
                                className="mt-1 rounded border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                            />
                            <span className="text-sm text-red-700 dark:text-red-300 font-semibold">Disseminated NTM (spread beyond lungs)</span>
                          </label>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded text-xs text-blue-900 dark:text-blue-200">
                          <strong>For VA Claims:</strong> Related to TB but different organism. Requires prolonged multi-drug therapy (typically 12-24 months). Document treatment duration and response.
                        </div>
                      </div>
                  )}

                  {/* Phase 7: Dental/Oral Quick Log Form (Simplified) */}
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

                  {/* PHASE 8A: SOMATIC SYMPTOM DISORDER FORM */}
                  {isSomaticSymptomRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200">🩺 Somatic Symptom Tracking</h3>
                        <p className="text-xs text-purple-700 dark:text-purple-300">Track physical symptoms and health-related behaviors for VA documentation</p>

                        <div className="space-y-2">
                          {[
                            { key: 'painPreoccupation', label: 'Excessive thoughts about pain/symptoms' },
                            { key: 'excessiveHealthWorry', label: 'Excessive worry about health conditions' },
                            { key: 'multipleSymptoms', label: 'Multiple physical symptoms present' },
                            { key: 'frequentDoctorVisits', label: 'Frequent doctor visits for symptoms' },
                            { key: 'functionalImpairment', label: 'Symptoms interfere with daily functioning' },
                          ].map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={somaticSymptomData[key]}
                                    onChange={(e) => setSomaticSymptomData({
                                      ...somaticSymptomData,
                                      [key]: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                          <strong>For VA Claims:</strong> Document persistent physical symptoms that cause significant distress
                          or functional impairment, even when medical evaluation doesn't fully explain them.
                        </div>
                      </div>
                  )}

                  {/* PHASE 8A: ILLNESS ANXIETY DISORDER FORM */}
                  {isIllnessAnxietyRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200">🏥 Illness Anxiety Tracking</h3>
                        <p className="text-xs text-amber-700 dark:text-amber-300">Track health anxiety symptoms and behaviors</p>

                        <div className="space-y-2">
                          {[
                            { key: 'fearOfIllness', label: 'Preoccupation with having/acquiring serious illness' },
                            { key: 'bodyChecking', label: 'Excessive body checking for signs of illness' },
                            { key: 'reassuranceSeeking', label: 'Seeking reassurance about health from others' },
                            { key: 'appointmentAvoidance', label: 'Avoiding medical appointments due to fear' },
                            { key: 'healthDistress', label: 'High anxiety/distress about health status' },
                          ].map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={illnessAnxietyData[key]}
                                    onChange={(e) => setIllnessAnxietyData({
                                      ...illnessAnxietyData,
                                      [key]: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                          <strong>For VA Claims:</strong> Illness anxiety is rated under somatic symptom disorders.
                          Document the frequency and impact of health-related worries on daily life.
                        </div>
                      </div>
                  )}

                  {/* PHASE 8A: DEPERSONALIZATION/DEREALIZATION FORM */}
                  {isDepersonalizationRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200">🌀 Depersonalization/Derealization Episode</h3>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">Track dissociative symptoms for VA documentation</p>

                        <div className="space-y-2">
                          {[
                            { key: 'detachment', label: 'Feeling detached from yourself (depersonalization)' },
                            { key: 'unreality', label: 'Surroundings feel unreal (derealization)' },
                            { key: 'robotAutopilot', label: 'Feeling like a robot or on autopilot' },
                            { key: 'distress', label: 'Significant distress from these experiences' },
                          ].map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={depersonalizationData[key]}
                                    onChange={(e) => setDepersonalizationData({
                                      ...depersonalizationData,
                                      [key]: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                          <strong>For VA Claims:</strong> Depersonalization/derealization is rated under dissociative disorders.
                          Document frequency, duration, and impact on functioning.
                        </div>
                      </div>
                  )}

                  {/* PHASE 8A: CYCLOTHYMIC DISORDER FORM */}
                  {isCyclothymicRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                        <h3 className="font-medium text-rose-900 dark:text-rose-200">🔄 Cyclothymic Mood Episode</h3>
                        <p className="text-xs text-rose-700 dark:text-rose-300">Track mood fluctuations for VA documentation</p>

                        <div className="space-y-2">
                          {[
                            { key: 'hypomanic', label: 'Hypomanic symptoms (elevated mood, energy, less sleep needed)' },
                            { key: 'depressive', label: 'Depressive symptoms (low mood, low energy, hopelessness)' },
                            { key: 'moodSwings', label: 'Mood swings between states' },
                            { key: 'irritability', label: 'Increased irritability' },
                          ].map(({ key, label }) => (
                              <label key={key} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <input
                                    type="checkbox"
                                    checked={cyclothymicData[key]}
                                    onChange={(e) => setCyclothymicData({
                                      ...cyclothymicData,
                                      [key]: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div className="bg-rose-100 dark:bg-rose-900/40 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
                          <strong>For VA Claims:</strong> Cyclothymic disorder is rated under mood disorders.
                          Document the pattern of mood fluctuations over time (requires 2+ years of symptoms).
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

                  {/* ============================================
              PHASE 8A EXTENDED: OCD FORM
              ============================================ */}
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

                  {/* Phase 8B: Binge Eating Quick Log Form */}
                  {isBingeEatingRelated && (
                      <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Binge Eating Details</h4>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={bingeEatingData.bingeEpisode}
                              onChange={(e) => setBingeEatingData({...bingeEatingData, bingeEpisode: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Binge episode</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={bingeEatingData.lossOfControl}
                              onChange={(e) => setBingeEatingData({...bingeEatingData, lossOfControl: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Loss of control</span>
                        </label>
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

                  {/* Phase 8B: Acute Stress Quick Log Form */}
                  {isAcuteStressRelated && (
                      <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Acute Stress Details</h4>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={acuteStressData.dissociativeSymptoms}
                              onChange={(e) => setAcuteStressData({...acuteStressData, dissociativeSymptoms: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Dissociative symptoms</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={acuteStressData.avoidance}
                              onChange={(e) => setAcuteStressData({...acuteStressData, avoidance: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Avoidance</span>
                        </label>
                      </div>
                  )}

                  {/* Phase 8B: Personality Disorder Quick Log Form */}
                  {isPersonalityDisorderRelated && (
                      <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Functional Impact</h4>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={personalityData.occupationalImpact}
                              onChange={(e) => setPersonalityData({...personalityData, occupationalImpact: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Work/school impact</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={personalityData.socialImpact}
                              onChange={(e) => setPersonalityData({...personalityData, socialImpact: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Relationship impact</span>
                        </label>
                      </div>
                  )}

                  {/* Phase 9: Cardiovascular Form */}
                  {isCardiovascularRelated && (
                      <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">❤️ Cardiovascular Details</h4>

                        {(isCardiacRelated || isPericarditisRelated) && (
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2">
                                <input type="checkbox" checked={cardiovascularData.atRest}
                                       onChange={(e) => setCardiovascularData({...cardiovascularData, atRest: e.target.checked})}
                                       className="rounded" />
                                <span className="text-xs">At rest</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="checkbox" checked={cardiovascularData.withExertion}
                                       onChange={(e) => setCardiovascularData({...cardiovascularData, withExertion: e.target.checked})}
                                       className="rounded" />
                                <span className="text-xs">With exertion</span>
                              </label>
                            </div>
                        )}

                        {isArrhythmiaRelated && (
                            <select value={cardiovascularData.treatmentRequired}
                                    onChange={(e) => setCardiovascularData({...cardiovascularData, treatmentRequired: e.target.value})}
                                    className="w-full p-2 text-sm border rounded dark:bg-gray-700">
                              <option value="">Treatment required...</option>
                              <option value="none">No treatment</option>
                              <option value="vagal">Vagal maneuver</option>
                              <option value="oral">Oral medication</option>
                              <option value="iv">IV medication</option>
                              <option value="cardioversion">Cardioversion</option>
                            </select>
                        )}

                        {isPostPhlebiticRelated && (
                            <select value={cardiovascularData.affectedLeg}
                                    onChange={(e) => setCardiovascularData({...cardiovascularData, affectedLeg: e.target.value})}
                                    className="w-full p-2 text-sm border rounded dark:bg-gray-700">
                              <option value="">Affected leg...</option>
                              <option value="left">Left leg</option>
                              <option value="right">Right leg</option>
                              <option value="both">Both legs</option>
                            </select>
                        )}
                      </div>
                  )}

                  {/* Phase 10: Digestive Quick Log Form */}
                  {isDigestivePhase10Related && (
                      <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">🫁 Digestive Details</h4>

                        {/* Cirrhosis */}
                        {isCirrhosisRelated && (
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hasAscites}
                                    onChange={(e) => setDigestiveData({...digestiveData, hasAscites: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Ascites</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hasEncephalopathy}
                                    onChange={(e) => setDigestiveData({...digestiveData, hasEncephalopathy: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Encephalopathy</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hasVaricealBleed}
                                    onChange={(e) => setDigestiveData({...digestiveData, hasVaricealBleed: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Variceal bleed</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.onLactulose}
                                    onChange={(e) => setDigestiveData({...digestiveData, onLactulose: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">On lactulose</span>
                              </label>
                            </div>
                        )}

                        {/* Gastritis */}
                        {isGastritisRelated && (
                            <div className="space-y-2">
                              <select
                                  value={digestiveData.episodeDuration}
                                  onChange={(e) => setDigestiveData({...digestiveData, episodeDuration: e.target.value})}
                                  className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Episode duration...</option>
                                <option value="1">1 day</option>
                                <option value="2">2 days</option>
                                <option value="3">3+ days</option>
                              </select>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={digestiveData.onDailyMedication}
                                      onChange={(e) => setDigestiveData({...digestiveData, onDailyMedication: e.target.checked})}
                                      className="rounded"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Daily meds</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={digestiveData.hasGIBleeding}
                                      onChange={(e) => setDigestiveData({...digestiveData, hasGIBleeding: e.target.checked})}
                                      className="rounded"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">GI bleeding</span>
                                </label>
                              </div>
                            </div>
                        )}

                        {/* Pancreatitis */}
                        {isPancreatitisRelated && (
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.onEnzymes}
                                    onChange={(e) => setDigestiveData({...digestiveData, onEnzymes: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">On enzymes</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hasMaldigestion}
                                    onChange={(e) => setDigestiveData({...digestiveData, hasMaldigestion: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Maldigestion</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hasDietaryRestriction}
                                    onChange={(e) => setDigestiveData({...digestiveData, hasDietaryRestriction: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Diet restriction</span>
                              </label>
                            </div>
                        )}

                        {/* Biliary */}
                        {isBiliaryRelated && (
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.attackWithNausea}
                                    onChange={(e) => setDigestiveData({...digestiveData, attackWithNausea: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Nausea</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.attackWithVomiting}
                                    onChange={(e) => setDigestiveData({...digestiveData, attackWithVomiting: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Vomiting</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={digestiveData.hadStrictureDilation}
                                    onChange={(e) => setDigestiveData({...digestiveData, hadStrictureDilation: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Stricture dilation</span>
                              </label>
                            </div>
                        )}

                        {/* Common hospitalization */}
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-700">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={digestiveData.hospitalized}
                                onChange={(e) => setDigestiveData({...digestiveData, hospitalized: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Hospitalized</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1A: NEUROLOGICAL COMPACT FORMS */}
                  {/* ============================================ */}

                  {/* Multiple Sclerosis Compact Form */}
                  {isMultipleSclerosisRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2 text-sm">🧠 MS Details</h4>

                        {selectedChronic?.symptomId === 'ms-relapse' && (
                            <div className="space-y-2 mb-3">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={multipleSclerosisData.isRelapse}
                                    onChange={(e) => setMultipleSclerosisData({...multipleSclerosisData, isRelapse: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed relapse</span>
                              </label>
                              {multipleSclerosisData.isRelapse && (
                                  <select
                                      value={multipleSclerosisData.relapseRecovery}
                                      onChange={(e) => setMultipleSclerosisData({...multipleSclerosisData, relapseRecovery: e.target.value})}
                                      className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                                  >
                                    <option value="">Recovery status...</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="full">Full recovery</option>
                                    <option value="partial">Partial recovery</option>
                                    <option value="none">No recovery</option>
                                  </select>
                              )}
                            </div>
                        )}

                        {['ms-walking-difficulty', 'ms-balance-problems', 'ms-muscle-weakness'].includes(selectedChronic?.symptomId) && (
                            <select
                                value={multipleSclerosisData.mobilityAid}
                                onChange={(e) => setMultipleSclerosisData({...multipleSclerosisData, mobilityAid: e.target.value})}
                                className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
                            >
                              <option value="">Mobility aid...</option>
                              <option value="none">None</option>
                              <option value="cane">Cane</option>
                              <option value="walker">Walker</option>
                              <option value="wheelchair">Wheelchair</option>
                            </select>
                        )}

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={multipleSclerosisData.onDMT}
                              onChange={(e) => setMultipleSclerosisData({...multipleSclerosisData, onDMT: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">On disease-modifying therapy</span>
                        </label>
                      </div>
                  )}

                  {/* Parkinson's Disease Compact Form */}
                  {isParkinsonsRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <h4 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2 text-sm">🧠 Parkinson's Details</h4>

                        {selectedChronic?.symptomId === 'pd-resting-tremor' && (
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <select
                                  value={parkinsonsData.tremorSide}
                                  onChange={(e) => setParkinsonsData({...parkinsonsData, tremorSide: e.target.value})}
                                  className="p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Side...</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="both">Both</option>
                              </select>
                              <select
                                  value={parkinsonsData.tremorSeverity}
                                  onChange={(e) => setParkinsonsData({...parkinsonsData, tremorSeverity: e.target.value})}
                                  className="p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Severity...</option>
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                              </select>
                            </div>
                        )}

                        {selectedChronic?.symptomId === 'pd-freezing-gait' && (
                            <input
                                type="number"
                                value={parkinsonsData.freezingEpisodes}
                                onChange={(e) => setParkinsonsData({...parkinsonsData, freezingEpisodes: e.target.value})}
                                className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
                                placeholder="# freezing episodes"
                                min="0"
                            />
                        )}

                        {selectedChronic?.symptomId === 'pd-falls' && (
                            <input
                                type="number"
                                value={parkinsonsData.fallsToday}
                                onChange={(e) => setParkinsonsData({...parkinsonsData, fallsToday: e.target.value})}
                                className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
                                placeholder="# falls"
                                min="0"
                            />
                        )}

                        {['pd-off-episodes', 'pd-dyskinesia'].includes(selectedChronic?.symptomId) && (
                            <select
                                value={parkinsonsData.medicationState}
                                onChange={(e) => setParkinsonsData({...parkinsonsData, medicationState: e.target.value})}
                                className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
                            >
                              <option value="">Medication state...</option>
                              <option value="on">ON</option>
                              <option value="wearing-off">Wearing OFF</option>
                              <option value="off">OFF</option>
                              <option value="dyskinesia">Dyskinesia</option>
                            </select>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={parkinsonsData.speechAffected}
                                onChange={(e) => setParkinsonsData({...parkinsonsData, speechAffected: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Speech affected</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={parkinsonsData.swallowingAffected}
                                onChange={(e) => setParkinsonsData({...parkinsonsData, swallowingAffected: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Swallowing affected</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* Myasthenia Gravis Compact Form */}
                  {isMyastheniaRelated && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-200 dark:border-teal-800">
                        <h4 className="font-medium text-teal-900 dark:text-teal-200 mb-2 text-sm">💪 MG Details</h4>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={myastheniaData.worseWithActivity}
                                onChange={(e) => setMyastheniaData({...myastheniaData, worseWithActivity: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Worse w/ activity</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={myastheniaData.betterWithRest}
                                onChange={(e) => setMyastheniaData({...myastheniaData, betterWithRest: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">Better w/ rest</span>
                          </label>
                        </div>

                        {['mg-ptosis', 'mg-diplopia'].includes(selectedChronic?.symptomId) && (
                            <div className="space-y-2 mb-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={myastheniaData.ptosisPresent}
                                    onChange={(e) => setMyastheniaData({...myastheniaData, ptosisPresent: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">Ptosis present</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={myastheniaData.doubleVision}
                                    onChange={(e) => setMyastheniaData({...myastheniaData, doubleVision: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">Double vision</span>
                              </label>
                            </div>
                        )}

                        {['mg-limb-weakness', 'mg-arm-elevation-difficulty'].includes(selectedChronic?.symptomId) && (
                            <input
                                type="number"
                                value={myastheniaData.canRaiseArms}
                                onChange={(e) => setMyastheniaData({...myastheniaData, canRaiseArms: e.target.value})}
                                className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
                                placeholder="Arm hold (seconds)"
                                min="0"
                            />
                        )}

                        {selectedChronic?.symptomId === 'mg-respiratory-weakness' && (
                            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800 mb-2">
                              <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={myastheniaData.breathingDifficulty}
                                    onChange={(e) => setMyastheniaData({...myastheniaData, breathingDifficulty: e.target.checked})}
                                    className="rounded"
                                />
                                <span className="text-xs text-red-700 dark:text-red-300">⚠️ Breathing difficulty</span>
                              </label>
                            </div>
                        )}

                        <label className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={myastheniaData.onPyridostigmine}
                              onChange={(e) => setMyastheniaData({...myastheniaData, onPyridostigmine: e.target.checked})}
                              className="rounded"
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-300">Taking Mestinon</span>
                        </label>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1B: NARCOLEPSY COMPACT FORM */}
                  {/* ============================================ */}
                  {isNarcolepsyRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <h4 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2 text-sm flex items-center gap-2">
                          <span>😴</span> Narcolepsy Details
                        </h4>
                        <div className="space-y-2">
                          {/* Sleep Attack */}
                          {(selectedChronic?.symptomId === 'narco-sleep-attack' || selectedChronic?.symptomId === 'narco-microsleep') && (
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={narcolepsyData.sleepAttackDuration}
                                    onChange={(e) => setNarcolepsyData({...narcolepsyData, sleepAttackDuration: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Duration</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="1-5-min">1-5 min</option>
                                  <option value="5-15-min">5-15 min</option>
                                  <option value="15-30-min">15-30 min</option>
                                  <option value="30-plus-min">30+ min</option>
                                </select>
                                <select
                                    value={narcolepsyData.sleepAttackTrigger}
                                    onChange={(e) => setNarcolepsyData({...narcolepsyData, sleepAttackTrigger: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Situation</option>
                                  <option value="driving">Driving</option>
                                  <option value="working">Working</option>
                                  <option value="eating">Eating</option>
                                  <option value="conversation">Conversation</option>
                                  <option value="no-trigger">No trigger</option>
                                </select>
                              </div>
                          )}
                          {/* Cataplexy */}
                          {selectedChronic?.symptomId === 'narco-cataplexy' && (
                              <>
                                <div className="grid grid-cols-2 gap-2">
                                  <select
                                      value={narcolepsyData.cataplexyTrigger}
                                      onChange={(e) => setNarcolepsyData({...narcolepsyData, cataplexyTrigger: e.target.value})}
                                      className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                  >
                                    <option value="">Trigger</option>
                                    <option value="laughter">Laughter</option>
                                    <option value="surprise">Surprise</option>
                                    <option value="anger">Anger</option>
                                    <option value="excitement">Excitement</option>
                                  </select>
                                  <select
                                      value={narcolepsyData.cataplexyAffected}
                                      onChange={(e) => setNarcolepsyData({...narcolepsyData, cataplexyAffected: e.target.value})}
                                      className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                  >
                                    <option value="">Muscles</option>
                                    <option value="face">Face</option>
                                    <option value="neck">Neck</option>
                                    <option value="arms">Arms</option>
                                    <option value="legs">Legs</option>
                                    <option value="whole-body">Whole body</option>
                                  </select>
                                </div>
                                <label className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={narcolepsyData.fellDuringCataplexy}
                                      onChange={(e) => setNarcolepsyData({...narcolepsyData, fellDuringCataplexy: e.target.checked})}
                                      className="rounded"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Fell during episode</span>
                                </label>
                              </>
                          )}
                          {/* Treatment */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-200 dark:border-indigo-700">
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={narcolepsyData.onStimulants}
                                  onChange={(e) => setNarcolepsyData({...narcolepsyData, onStimulants: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">On stimulants</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={narcolepsyData.sleepStudyConfirmed}
                                  onChange={(e) => setNarcolepsyData({...narcolepsyData, sleepStudyConfirmed: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">MSLT confirmed</span>
                            </label>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1B: ALS COMPACT FORM */}
                  {/* ============================================ */}
                  {isALSRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                        <h4 className="font-medium text-rose-900 dark:text-rose-200 mb-2 text-sm flex items-center gap-2">
                          <span>💪</span> ALS Details
                        </h4>
                        <div className="space-y-2">
                          {/* Weakness */}
                          {(selectedChronic?.symptomId?.includes('weakness') || selectedChronic?.symptomId?.includes('atrophy')) && (
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={alsData.weaknessLocation}
                                    onChange={(e) => setAlsData({...alsData, weaknessLocation: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Location</option>
                                  <option value="hands">Hands</option>
                                  <option value="arms">Arms</option>
                                  <option value="legs">Legs</option>
                                  <option value="bulbar">Bulbar</option>
                                  <option value="multiple">Multiple</option>
                                </select>
                                <select
                                    value={alsData.weaknessSide}
                                    onChange={(e) => setAlsData({...alsData, weaknessSide: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Side</option>
                                  <option value="left">Left</option>
                                  <option value="right">Right</option>
                                  <option value="both">Both</option>
                                </select>
                              </div>
                          )}
                          {/* Speech */}
                          {selectedChronic?.symptomId === 'als-difficulty-speaking' && (
                              <select
                                  value={alsData.speechClarity}
                                  onChange={(e) => setAlsData({...alsData, speechClarity: e.target.value})}
                                  className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Speech clarity</option>
                                <option value="mild-slurred">Mild slurring</option>
                                <option value="moderate-slurred">Moderate</option>
                                <option value="severe-slurred">Severe</option>
                                <option value="unintelligible">Unintelligible</option>
                              </select>
                          )}
                          {/* Respiratory */}
                          {selectedChronic?.symptomId === 'als-respiratory-difficulty' && (
                              <>
                                <select
                                    value={alsData.breathingDifficulty}
                                    onChange={(e) => setAlsData({...alsData, breathingDifficulty: e.target.value})}
                                    className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Severity</option>
                                  <option value="with-exertion">With exertion</option>
                                  <option value="at-rest">At rest</option>
                                  <option value="severe">Severe</option>
                                </select>
                                <div className="grid grid-cols-2 gap-2">
                                  <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={alsData.usesBiPAP}
                                        onChange={(e) => setAlsData({...alsData, usesBiPAP: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">BiPAP</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={alsData.usesVentilator}
                                        onChange={(e) => setAlsData({...alsData, usesVentilator: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Ventilator</span>
                                  </label>
                                </div>
                              </>
                          )}
                          {/* Mobility */}
                          <select
                              value={alsData.mobilityStatus}
                              onChange={(e) => setAlsData({...alsData, mobilityStatus: e.target.value})}
                              className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Mobility</option>
                            <option value="ambulatory">Ambulatory</option>
                            <option value="cane">Cane</option>
                            <option value="walker">Walker</option>
                            <option value="wheelchair">Wheelchair</option>
                            <option value="bedridden">Bedridden</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1B: SYRINGOMYELIA COMPACT FORM */}
                  {/* ============================================ */}
                  {isSyringomyeliaRelated && (
                      <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg border border-violet-200 dark:border-violet-800">
                        <h4 className="font-medium text-violet-900 dark:text-violet-200 mb-2 text-sm flex items-center gap-2">
                          <span>🔬</span> Syringomyelia
                        </h4>
                        <div className="space-y-2">
                          <select
                              value={syringomyeliaData.sensoryLossPattern}
                              onChange={(e) => setSyringomyeliaData({...syringomyeliaData, sensoryLossPattern: e.target.value})}
                              className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Sensory pattern</option>
                            <option value="cape">Cape distribution</option>
                            <option value="arms">Arms only</option>
                            <option value="hands">Hands only</option>
                            <option value="suspended">Suspended band</option>
                          </select>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={syringomyeliaData.hadBurnInjury}
                                  onChange={(e) => setSyringomyeliaData({...syringomyeliaData, hadBurnInjury: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Burn injury</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={syringomyeliaData.hadCutInjury}
                                  onChange={(e) => setSyringomyeliaData({...syringomyeliaData, hadCutInjury: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Unnoticed cut</span>
                            </label>
                          </div>
                          <select
                              value={syringomyeliaData.syrinxLocation}
                              onChange={(e) => setSyringomyeliaData({...syringomyeliaData, syrinxLocation: e.target.value})}
                              className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Syrinx location</option>
                            <option value="cervical">Cervical</option>
                            <option value="thoracic">Thoracic</option>
                            <option value="both">Both</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1B: MYELITIS COMPACT FORM */}
                  {/* ============================================ */}
                  {isMyelitisRelated && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800">
                        <h4 className="font-medium text-cyan-900 dark:text-cyan-200 mb-2 text-sm flex items-center gap-2">
                          <span>🧬</span> Myelitis
                        </h4>
                        <div className="space-y-2">
                          {/* Weakness/Paralysis */}
                          {(selectedChronic?.symptomId === 'myel-weakness' || selectedChronic?.symptomId === 'myel-paralysis') && (
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={myelitisData.weaknessDistribution}
                                    onChange={(e) => setMyelitisData({...myelitisData, weaknessDistribution: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Distribution</option>
                                  <option value="paraplegia">Paraplegia</option>
                                  <option value="quadriplegia">Quadriplegia</option>
                                  <option value="hemiplegia">Hemiplegia</option>
                                  <option value="monoplegia">Monoplegia</option>
                                </select>
                                <select
                                    value={myelitisData.mobilityStatus}
                                    onChange={(e) => setMyelitisData({...myelitisData, mobilityStatus: e.target.value})}
                                    className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Mobility</option>
                                  <option value="ambulatory">Ambulatory</option>
                                  <option value="cane">Cane</option>
                                  <option value="walker">Walker</option>
                                  <option value="wheelchair">Wheelchair</option>
                                  <option value="bedridden">Bedridden</option>
                                </select>
                              </div>
                          )}
                          {/* Bladder */}
                          {selectedChronic?.symptomId === 'myel-bladder-dysfunction' && (
                              <>
                                <select
                                    value={myelitisData.bladderSymptoms}
                                    onChange={(e) => setMyelitisData({...myelitisData, bladderSymptoms: e.target.value})}
                                    className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                  <option value="">Bladder symptoms</option>
                                  <option value="retention">Retention</option>
                                  <option value="incontinence">Incontinence</option>
                                  <option value="both">Both</option>
                                  <option value="urgency">Urgency</option>
                                </select>
                                <label className="flex items-center gap-2">
                                  <input
                                      type="checkbox"
                                      checked={myelitisData.usesCatheter}
                                      onChange={(e) => setMyelitisData({...myelitisData, usesCatheter: e.target.checked})}
                                      className="rounded"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Uses catheter</span>
                                </label>
                              </>
                          )}
                          {/* Cause */}
                          <select
                              value={myelitisData.causeOfMyelitis}
                              onChange={(e) => setMyelitisData({...myelitisData, causeOfMyelitis: e.target.value})}
                              className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="">Cause</option>
                            <option value="transverse">Transverse myelitis</option>
                            <option value="infectious">Post-infectious</option>
                            <option value="ms-related">MS-related</option>
                            <option value="nmo">NMO spectrum</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1C: PERIPHERAL NERVE COMPACT FORM */}
                  {/* ============================================ */}
                  {isPeripheralNerveRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2 text-sm flex items-center gap-2">
                          <span>🔌</span> Peripheral Nerve
                        </h4>
                        <div className="space-y-2">
                          {/* Affected Side */}
                          <div className="grid grid-cols-2 gap-2">
                            <select
                                value={peripheralNerveData.affectedSide}
                                onChange={(e) => setPeripheralNerveData({...peripheralNerveData, affectedSide: e.target.value})}
                                className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                              <option value="">Affected Side</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="bilateral">Bilateral</option>
                            </select>
                            <select
                                value={peripheralNerveData.severityLevel}
                                onChange={(e) => setPeripheralNerveData({...peripheralNerveData, severityLevel: e.target.value})}
                                className="text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                              <option value="">Severity</option>
                              <option value="complete">Complete</option>
                              <option value="severe">Severe</option>
                              <option value="moderate">Moderate</option>
                              <option value="mild">Mild</option>
                            </select>
                          </div>

                          {/* Dominant Hand - Only for Upper Extremity */}
                          {isUpperExtremityNerveRelated && (
                              <select
                                  value={peripheralNerveData.isDominantSide}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, isDominantSide: e.target.value})}
                                  className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Dominant hand?</option>
                                <option value="yes">Yes - dominant</option>
                                <option value="no">No - non-dominant</option>
                                <option value="unknown">Unknown</option>
                              </select>
                          )}

                          {/* Motor/Sensory Involvement */}
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={peripheralNerveData.hasMotorInvolvement}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, hasMotorInvolvement: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Motor (weakness)</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={peripheralNerveData.hasSensoryInvolvement}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, hasSensoryInvolvement: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Sensory (numbness)</span>
                            </label>
                          </div>

                          {/* Atrophy and Deformity */}
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={peripheralNerveData.hasAtrophy}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, hasAtrophy: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Muscle atrophy</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                  type="checkbox"
                                  checked={peripheralNerveData.hasDeformity}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, hasDeformity: e.target.checked})}
                                  className="rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Deformity</span>
                            </label>
                          </div>

                          {/* Deformity Type - Show if deformity checked */}
                          {peripheralNerveData.hasDeformity && (
                              <select
                                  value={peripheralNerveData.deformityType}
                                  onChange={(e) => setPeripheralNerveData({...peripheralNerveData, deformityType: e.target.value})}
                                  className="w-full text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                <option value="">Deformity type</option>
                                <option value="wrist-drop">Wrist drop</option>
                                <option value="foot-drop">Foot drop</option>
                                <option value="claw-hand">Claw hand</option>
                                <option value="ape-hand">Ape hand</option>
                                <option value="winged-scapula">Winged scapula</option>
                                <option value="other">Other</option>
                              </select>
                          )}

                          {/* Assistive Device */}
                          <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={peripheralNerveData.usesAssistiveDevice}
                                onChange={(e) => setPeripheralNerveData({...peripheralNerveData, usesAssistiveDevice: e.target.checked})}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Uses brace/splint/AFO</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* Phase 4C: Spine Condition compact form */}
                  {isSpineConditionRelated && (
                      <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                        <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                          <span>🦴</span> Spine Details
                        </h4>

                        <select
                            value={spineData.spineLocation}
                            onChange={(e) => setSpineData(prev => ({ ...prev, spineLocation: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select spine region...</option>
                          <option value="cervical">Cervical (Neck)</option>
                          <option value="thoracic">Thoracic (Mid-Back)</option>
                          <option value="lumbar">Lumbar (Low Back)</option>
                          <option value="sacral">Sacral/SI Joint</option>
                          <option value="multiple">Multiple Regions</option>
                        </select>

                        {/* Ankylosing Spondylitis - morning stiffness */}
                        {selectedChronic?.symptomId?.startsWith('as-') && (
                            <select
                                value={spineData.morningStiffnessDuration}
                                onChange={(e) => setSpineData(prev => ({ ...prev, morningStiffnessDuration: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="">Morning stiffness duration...</option>
                              <option value="less-than-30">&lt;30 minutes</option>
                              <option value="30-60">30-60 minutes</option>
                              <option value="1-2-hours">1-2 hours</option>
                              <option value="more-than-2-hours">&gt;2 hours</option>
                            </select>
                        )}

                        {/* Spinal Stenosis - claudication checkbox */}
                        {selectedChronic?.symptomId?.startsWith('ss-') && (
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <input
                                  type="checkbox"
                                  checked={spineData.neurogenicClaudication}
                                  onChange={(e) => setSpineData(prev => ({ ...prev, neurogenicClaudication: e.target.checked }))}
                                  className="w-4 h-4 text-amber-600 rounded"
                              />
                              Neurogenic claudication (leg pain relieved by sitting)
                            </label>
                        )}
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
                        placeholder={isVeteran ? "What were you doing? Any triggers? What couldn't you do?" : "What were you doing? Any triggers?"}
                        rows={2}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {isVeteran
                          ? '💡 Specific details about triggers and functional impact strengthen claims'
                          : '💡 Note any triggers or patterns you notice'}
                    </p>
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