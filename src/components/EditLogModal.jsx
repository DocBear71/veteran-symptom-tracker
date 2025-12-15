import {useState, useEffect} from 'react';
import {
  updateSymptomLog,
  getMedications,
  logMedicationTaken,
  getMedicationLogsForSymptom,
  deleteMedicationLog,
} from '../utils/storage';

const EditLogModal = ({log, isOpen, onClose, onSaved}) => {
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [existingMedLogs, setExistingMedLogs] = useState([]);

  const [isFlareUp, setIsFlareUp] = useState(false);
  const [duration, setDuration] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Migraine-specific fields
  const [migraineData, setMigraineData] = useState({
    duration: '', prostrating: null, aura: false, nausea: false,
    lightSensitivity: false, soundSensitivity: false, triggers: '',
  });

  // Sleep-specific fields
  const [sleepData, setSleepData] = useState({
    hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
    troubleStayingAsleep: false, nightmares: false, feelRested: null,
  });

  // PTSD-specific fields
  const [ptsdData, setPtsdData] = useState({
    flashbacks: false, avoidance: false, emotionalNumbering: false,
    hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
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

  // ============================================
  // PHASE 1B: GI CONDITION-SPECIFIC FIELDS
  // ============================================
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

  // ============================================
  // PHASE 1C: RESPIRATORY CONDITION-SPECIFIC FIELDS
  // ============================================
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

  // ============================================
  // PHASE 1D: JOINT/ROM CONDITION-SPECIFIC FIELDS
  // ============================================
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

  // ============================================
  // PHASE 1E: SEIZURE/EPISODE CONDITION-SPECIFIC FIELDS
  // ============================================
  const [seizureData, setSeizureData] = useState({
    episodeType: '',
    duration: '',
    lossOfConsciousness: null,
    auraPresent: null,
    recoveryTime: '',
    witnessPresent: null,
  });

// ============================================
// PHASE 2: EYE & VISION CONDITION-SPECIFIC FIELDS
// ============================================
  const [eyeData, setEyeData,] = useState({
    affectedEye: '',
    leftEyeAcuity:'',
    rightEyeAcuity: '',
    symptoms: [],
    fieldOfVision:[],
    affectedActivities:[],
    triggeringFactors:'',
    associatedConditions:[],
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
    painDuration: '',
    endometriosisDiagnosed: false,
    laparoscopyConfirmed: false,
    laparoscopyDate: '',
    lesionLocations: [],
    treatmentType: '',
    treatmentEffectiveness: '',
    bowelSymptoms: false,
    bladderSymptoms: false,
    cycleRegularity: '',
    cycleLength: '',
    flowHeaviness: '',
    flowDuration: '',
    dysmenorrheaSeverity: '',
    intermenstrualBleeding: false,
    pcosDiagnosed: false,
    pcosSymptoms: [],
    rotterdamCriteriaMet: '',
    pidDiagnosed: false,
    pidType: '',
    recurrentInfections: false,
    numberOfEpisodes: '',
    lastEpisodeDate: '',
    prolapseDiagnosed: false,
    prolapseType: '',
    popStage: '',
    prolapseTreatment: '',
    sexualDysfunction: false,
    arousalDifficulty: false,
    libidoDecreased: false,
    interferesDailyActivities: false,
    workMissed: false,
    continuousTreatmentRequired: false,
    treatmentMedications: [],
  });

        useEffect(() => {
          if (isOpen && log) {
            setSeverity(log.severity || 5);
            setNotes(log.notes || '');
            setMedications(getMedications());

            // PHASE 1A: Load universal fields
            setIsFlareUp(log.isFlareUp || false);
            setDuration(log.duration || '');
            setTimeOfDay(log.timeOfDay || '');

            // Get existing medication logs for this symptom
            const existingMeds = getMedicationLogsForSymptom(log.id);
            setExistingMedLogs(existingMeds);
            setSelectedMedications(existingMeds.map(m => m.medicationId));

            // Load condition-specific data
            if (log.migraineData) {
              setMigraineData(log.migraineData);
            } else {
              setMigraineData({
                duration: '', prostrating: null, aura: false, nausea: false,
                lightSensitivity: false, soundSensitivity: false, triggers: '',
              });
            }

            if (log.sleepData) {
              setSleepData(log.sleepData);
            } else {
              setSleepData({
                hoursSlept: '',
                quality: 5,
                wakeUps: '',
                troubleFallingAsleep: false,
                troubleStayingAsleep: false,
                nightmares: false,
                feelRested: null,
              });
            }

            if (log.ptsdData) {
              setPtsdData(log.ptsdData);
            } else {
              setPtsdData({
                flashbacks: false,
                avoidance: false,
                emotionalNumbering: false,
                hypervigilance: false,
                exaggeratedStartle: false,
                intrusiveThoughts: false,
                triggerDescription: '',
              });
            }

            if (log.painData) {
              setPainData(log.painData);
            } else {
              setPainData({
                painLocation: '',
                radiating: false,
                radiatingTo: '',
                limitedRangeOfMotion: false,
                affectedActivities: [],
                painType: '',
                flareUp: false,
              });
            }

            // PHASE 1B: Load GI data
            if (log.giData) {
              setGIData(log.giData);
            } else {
              setGIData({
                bristolScale: null,
                frequencyPerDay: '',
                urgencyLevel: '',
                bloodPresent: null,
                bloatingSeverity: '',
                abdominalPainLocation: '',
                mealRelated: null,
                nighttimeSymptoms: false,
              });
            }
            // PHASE 1C: Load Respiratory data
            if (log.respiratoryData) {
              setRespiratoryData(log.respiratoryData);
            } else {
              setRespiratoryData({
                rescueInhalerUsed: null,
                inhalerPuffs: '',
                peakFlow: '',
                spo2: '',
                activityTrigger: '',
                wheezing: false,
                chestTightness: false,
                coughing: false,
              });
            }
            // PHASE 1D: Load Joint data
            if (log.jointData) {
              setJointData(log.jointData);
            } else {
              setJointData({
                joint: '',
                side: '',
                romEstimate: '',
                morningStiffness: '',
                swelling: false,
                instability: false,
                locking: false,
                grinding: false,
              });
            }
            // PHASE 1E: Load Seizure data
            if (log.seizureData) {
              setSeizureData(log.seizureData);
            } else {
              setSeizureData({
                episodeType: '', duration: '', lossOfConsciousness: null,
                auraPresent: null, recoveryTime: '', witnessPresent: null,
              });
            }

            // PHASE 2: Load Eye data

            if (log.eyeData) {
              setEyeData(log.eyeData);
            } else {
              setEyeData({
                affectedEye: '',
                leftEyeAcuity: '',
                rightEyeAcuity: '',
                symptoms: [],
                fieldOfVision: [],
                affectedActivities: [],
                triggeringFactors: '',
                associatedConditions: [],
              });
            }

            // Phase 3: Load Genitourinary data
            if (log.genitourinaryData) {
              setGenitourinaryData(log.genitourinaryData);
            } else {
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

            // Phase 4: Load Gynecological data
            if (log.gynecologicalData) {
              setGynecologicalData(log.gynecologicalData);
            } else {
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
          }
        }, [isOpen, log]);

        const isMigraine = log?.symptomId === 'migraine';

        // Sleep: match sleep-related symptoms only
        const isSleepRelated = log?.symptomId?.includes('sleep') ||
            log?.symptomId?.includes('insomnia') ||
            ['sleep-issues', 'nightmares'].includes(log?.symptomId) ||
            log?.sleepData; // Also show if log already has sleep data

        // PTSD/Mental Health: broader matching (symptom only)
        const isPTSDRelated = log?.symptomId?.includes('anxiety') ||
            log?.symptomId?.includes('ptsd') ||
            log?.symptomId?.includes('panic') ||
            log?.symptomId?.includes('depression') ||
            log?.symptomId?.includes('mood') ||
            [ 'hypervigilance', 'nightmares', 'irritability', 'flashbacks', 'intrusive-thoughts',
              'avoidance', 'emotional-numbness', 'startle-response', 'concentration-problems',
              'social-withdrawal', 'hopelessness', 'guilt', 'anger-outbursts'].includes(log?.symptomId) ||
            log?.ptsdData; // Also show if log already has PTSD data

        // Pain: match ANY pain-related symptom only
        const isPainRelated = log?.symptomId?.includes('pain') ||
            log?.symptomId?.includes('-ache') ||
            log?.symptomId?.includes('stiff') ||
            [ 'sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
              'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness', 'numbness',
              'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd', 'spondylosis', 'spondylolisthesis',
              'herniated', 'bulging'].some(term => log?.symptomId?.includes(term)) ||
            log?.painData; // Also show if log already has pain data

        // PHASE 1B: GI condition detection
        const isGIRelated = log?.symptomId?.startsWith('ibs') ||
            log?.symptomId?.startsWith('gerd') ||
            log?.symptomId?.startsWith('uc-') ||
            log?.symptomId?.startsWith('ulcer-') ||
            log?.symptomId?.startsWith('hemorrhoid') ||
            log?.symptomId?.startsWith('divertic') ||
            [ 'diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(log?.symptomId) ||
            log?.giData; // Also show if log already has GI data

        // PHASE 1C: Respiratory condition detection
        const isRespiratoryRelated = log?.symptomId?.startsWith('asthma-') ||
            log?.symptomId?.startsWith('copd-') ||
            log?.symptomId?.startsWith('apnea-') ||
            log?.symptomId?.startsWith('emphysema-') ||
            log?.symptomId?.startsWith('bronchitis-') ||
            log?.symptomId?.includes('breathing') ||
            log?.symptomId?.includes('wheez') ||
            log?.symptomId?.includes('cough') ||
            ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(log?.symptomId) ||
            log?.respiratoryData; // Also show if log already has respiratory data

        // PHASE 1D: Joint/ROM condition detection
        const isJointRelated = log?.symptomId?.startsWith('shoulder-') ||
            log?.symptomId?.startsWith('knee-') ||
            log?.symptomId?.startsWith('hip-') ||
            log?.symptomId?.startsWith('ankle-') ||
            log?.symptomId?.startsWith('elbow-') ||
            log?.symptomId?.startsWith('wrist-') ||
            log?.symptomId?.startsWith('hand-') ||
            log?.symptomId?.startsWith('finger-') ||
            log?.symptomId?.startsWith('foot-') ||
            log?.symptomId?.startsWith('toe-') ||
            log?.symptomId?.includes('joint') ||
            log?.symptomId?.includes('arthritis') ||
            log?.symptomId?.includes('bursitis') ||
            log?.symptomId?.includes('tendinitis') ||
            ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(log?.symptomId) ||
            log?.jointData; // Also show if log already has joint data

        // PHASE 1E: Seizure/Episode condition detection
        const isSeizureRelated = log?.symptomId?.includes('seizure') ||
            log?.symptomId?.includes('epilep') ||
            log?.symptomId?.includes('convuls') ||
            log?.symptomId?.startsWith('seizure-') ||
            ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(log?.symptomId) ||
            log?.seizureData; // Also show if log already has seizure data

        // PHASE 2: Eye/Vision detection
        const isEyeRelated = log?.symptomId?.includes('vision') ||
            log?.symptomId?.includes('eye') ||
            log?.symptomId?.includes('glaucoma') ||
            log?.symptomId?.includes('retinopathy') ||
            log?.symptomId?.includes('macular') ||
            ['floaters', 'diplopia', 'photophobia', 'night-blindness', 'light-sensitivity',
              'double-vision', 'color-vision-changes', 'dry-eyes', 'eye-strain', 'eye-pain',
              'peripheral-vision-loss', 'diabetic-retinopathy', 'glaucoma-symptoms'].includes(log?.symptomId) ||
            log?.eyeData;

        // Phase 3: Genitourinary detection
        const isGenitourinaryRelated = log?.symptomId?.includes('kidney') ||
            log?.symptomId?.includes('urinary') ||
            log?.symptomId?.includes('prostate') ||
            log?.symptomId?.includes('bladder') ||
            log?.symptomId?.includes('urine') ||
            log?.symptomId?.includes('renal') ||
            log?.symptomId?.includes('fecal-incontinence') ||
            log?.symptomId?.includes('erectile') ||
            log?.symptomId?.includes('testicular') ||
            log?.symptomId?.includes('genital') ||
            ['kidney-stones', 'kidney-pain', 'blood-in-urine', 'kidney-infection',
             'renal-swelling', 'renal-fatigue', 'renal-nausea', 'decreased-urination',
             'foamy-urine', 'high-blood-pressure', 'urinary-frequency', 'urinary-urgency',
             'painful-urination', 'urinary-incontinence', 'urine-retention', 'weak-stream',
             'hesitancy', 'nocturia', 'bladder-pain', 'recurrent-uti', 'incomplete-emptying',
             'prostate-symptoms', 'prostate-pain', 'erectile-dysfunction', 'testicular-pain',
              'genital-pain', 'bowel-urgency', 'bowel-frequency'].includes(log?.symptomId) ||
            log?.genitourinaryData;

        // Phase 4: Gynecological detection
        const isGynecologicalRelated = log?.symptomId?.includes('menstrual') ||
            log?.symptomId?.includes('pelvic') ||
            log?.symptomId?.includes('endometriosis') ||
            log?.symptomId?.includes('ovarian') ||
            log?.symptomId?.includes('uterine') ||
            log?.symptomId?.includes('vaginal') ||
            log?.symptomId?.includes('cervix') ||
            log?.symptomId?.includes('dyspareunia') ||
            log?.symptomId?.includes('dysmenorrhea') ||
            log?.symptomId?.includes('prolapse') ||
            log?.symptomId?.includes('vulvo') ||
            ['heavy-menstrual-bleeding', 'irregular-periods', 'painful-periods', 'absent-periods',
              'prolonged-bleeding', 'intermenstrual-bleeding', 'premenstrual-syndrome',
              'chronic-pelvic-pain', 'dyspareunia', 'lower-abdominal-pain', 'pain-bowel-movement',
              'pain-urination-gyn', 'endometriosis-pain', 'endometriosis-bowel', 'endometriosis-bladder',
              'ovarian-cysts', 'polycystic-ovaries', 'ovulation-pain', 'anovulation',
              'pid-symptoms', 'abnormal-discharge', 'cervicitis', 'vulvovaginitis', 'vaginal-irritation',
              'pelvic-pressure', 'vaginal-bulge', 'incomplete-bladder-emptying', 'bowel-dysfunction-prolapse',
              'sexual-dysfunction', 'decreased-libido', 'arousal-difficulty', 'infertility',
              'hirsutism', 'hormonal-acne', 'pcos-weight-changes', 'breast-pain', 'nipple-discharge',
              'uterine-cramping'].includes(log?.symptomId) ||
            log?.gynecologicalData;

        const handleSave = () => {
          if (isMigraine && migraineData.prostrating === null) {
            alert('Please indicate if this migraine was prostrating');
            return;
          }

          const updates = {
            severity,
            notes: notes.trim(),
            // PHASE 1A: Universal fields
            isFlareUp,
            duration: duration || null,
            timeOfDay: timeOfDay || null,
          };

          if (isMigraine) updates.migraineData = migraineData;
          if (isSleepRelated) updates.sleepData = sleepData;
          if (isPTSDRelated) updates.ptsdData = ptsdData;
          if (isPainRelated) updates.painData = painData;
          // PHASE 1B: Save GI data
          if (isGIRelated) updates.giData = giData;

          // PHASE 1C: Save Respiratory data
          if (isRespiratoryRelated) updates.respiratoryData = respiratoryData;

          // PHASE 1D: Save Joint data
          if (isJointRelated) updates.jointData = jointData;

          // PHASE 1E: Save Seizure data
          if (isSeizureRelated) updates.seizureData = seizureData;

          // Phase 3: Save genitourinary data
          if (isGenitourinaryRelated) updates.genitourinaryData = genitourinaryData;

          // PHASE 2: Add eye data
          if (isEyeRelated) updates.eyeData = { ...eyeData };

          // Phase 4: Save gynecological data
          if (isGynecologicalRelated) updates.gynecologicalData = gynecologicalData;


          const result = updateSymptomLog(log.id, updates);

          if (result.success) {
            // Handle medication changes
            const existingMedIds = existingMedLogs.map(m => m.medicationId);

            // Delete removed medications
            existingMedLogs.forEach(medLog => {
              if (!selectedMedications.includes(medLog.medicationId)) {
                deleteMedicationLog(medLog.id);
              }
            });

            // Add new medications
            selectedMedications.forEach(medId => {
              if (!existingMedIds.includes(medId)) {
                const med = medications.find(m => m.id === medId);
                if (med) {
                  logMedicationTaken({
                    medicationId: med.id,
                    medicationName: med.name,
                    dosage: med.dosage,
                    takenFor: log.symptomName,
                    symptomLogId: log.id,
                  });
                }
              }
            });

            onSaved();
            onClose();
          } else {
            alert(result.message);
          }
        };

        const toggleActivity = (activity) => {
          setPainData(prev => ({
            ...prev,
            affectedActivities: prev.affectedActivities.includes(activity)
                ? prev.affectedActivities.filter(a => a !== activity)
                : [...prev.affectedActivities, activity],
          }));
        };

        const getSeverityInfo = (value) => {
          if (value <= 2) return {
            label: 'Minimal',
            color: 'text-green-600 dark:text-green-400',
          };
          if (value <= 4) return {
            label: 'Mild',
            color: 'text-yellow-600 dark:text-yellow-400',
          };
          if (value <= 6) return {
            label: 'Moderate',
            color: 'text-orange-500 dark:text-orange-400',
          };
          if (value <= 8) return {
            label: 'Severe',
            color: 'text-red-500 dark:text-red-400',
          };
          return {label: 'Extreme', color: 'text-red-700 dark:text-red-300'};
        };

        // Bristol Scale descriptions
        const bristolDescriptions = {
          1: 'Separate hard lumps (severe constipation)',
          2: 'Lumpy, sausage-shaped (mild constipation)',
          3: 'Sausage with cracks (normal)',
          4: 'Smooth, soft sausage (ideal)',
          5: 'Soft blobs with clear edges (lacking fiber)',
          6: 'Mushy with ragged edges (mild diarrhea)',
          7: 'Watery, no solid pieces (severe diarrhea)',
        };

        if (!isOpen || !log) return null;

        const severityInfo = getSeverityInfo(severity);
        const logDate = new Date(log.timestamp).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div
                  className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div
                    className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit
                        Entry</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{log.symptomName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{logDate}</p>
                    </div>
                    <button onClick={onClose}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* ============================================ */}
                  {/* PHASE 1A: UNIVERSAL ENHANCEMENT FIELDS */}
                  {/* ============================================ */}
                  <div
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span>📋</span> Symptom Details
                    </h3>

                    {/* Flare-Up Toggle */}
                    <div>
                      <label
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isFlareUp
                                  ?
                                  'bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600'
                                  :
                                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                          }`}>
                        <input
                            type="checkbox"
                            checked={isFlareUp}
                            onChange={(e) => setIsFlareUp(e.target.checked)}
                            className="w-5 h-5 text-orange-600 rounded"
                        />
                        <div>
                                    <span
                                        className="font-medium text-gray-900 dark:text-gray-100">
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
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

                  {/* Severity Slider */}
                  <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity
                      Level</label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <input type="range" min="0" max="10" value={severity}
                             onChange={(e) => setSeverity(
                                 Number(e.target.value))} className="w-full"/>
                      <div className="flex justify-between mt-2">
                        <span
                            className="text-xs text-gray-500 dark:text-gray-400">0</span>
                        <span
                            className={`text-lg font-bold ${severityInfo.color}`}>
                                    {severity} - {severityInfo.label}
                                </span>
                        <span
                            className="text-xs text-gray-500 dark:text-gray-400">10</span>
                      </div>
                    </div>
                  </div>

                  {/* ============================================ */}
                  {/* PHASE 1B: GI CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isGIRelated && (
                      <div
                          className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
                          <span>🩺</span> GI Symptom Details
                        </h3>

                        {/* Bristol Stool Scale */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bristol Stool Scale
                          </label>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setGIData(
                                        prev => ({...prev, bristolScale: num}))}
                                    className={`py-2 px-1 rounded-lg border-2 font-bold text-sm transition-all ${
                                        giData.bristolScale === num
                                            ?
                                            num <= 2 ?
                                                'bg-orange-200 dark:bg-orange-900 border-orange-500 text-orange-800 dark:text-orange-200'
                                                :
                                                num <= 4 ?
                                                    'bg-green-200 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200'
                                                    :
                                                    'bg-yellow-200 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200'
                                            :
                                            'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
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
                              onClick={() => setGIData(
                                  prev => ({...prev, bristolScale: null}))}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
                          >
                            Clear selection
                          </button>
                        </div>

                        {/* Frequency and Urgency */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Episodes Today
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={giData.frequencyPerDay}
                                onChange={(e) => setGIData(prev => ({
                                  ...prev,
                                  frequencyPerDay: e.target.value,
                                }))}
                                placeholder="# times"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Urgency Level
                            </label>
                            <select
                                value={giData.urgencyLevel}
                                onChange={(e) => setGIData(prev => ({
                                  ...prev,
                                  urgencyLevel: e.target.value,
                                }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Select...</option>
                              <option value="none">None</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                              <option value="incontinence">Incontinence</option>
                            </select>
                          </div>
                        </div>

                        {/* Blood Present */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Blood Present?
                          </label>
                          <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setGIData(
                                    prev => ({...prev, bloodPresent: true}))}
                                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                    giData.bloodPresent === true
                                        ?
                                        'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setGIData(
                                    prev => ({...prev, bloodPresent: false}))}
                                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                    giData.bloodPresent === false
                                        ?
                                        'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >No
                            </button>
                          </div>
                        </div>

                        {/* Bloating */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bloating Severity
                          </label>
                          <select
                              value={giData.bloatingSeverity}
                              onChange={(e) => setGIData(prev => ({
                                ...prev,
                                bloatingSeverity: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select...</option>
                            <option value="none">None</option>
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                        </div>

                        {/* Pain Location */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pain Location
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              {id: 'upper-left', label: 'UL'},
                              {id: 'upper-center', label: 'UC'},
                              {id: 'upper-right', label: 'UR'},
                              {id: 'lower-left', label: 'LL'},
                              {id: 'lower-center', label: 'LC'},
                              {id: 'lower-right', label: 'LR'},
                            ].map(({id, label}) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setGIData(prev => ({
                                      ...prev,
                                      abdominalPainLocation: prev.abdominalPainLocation ===
                                      id ? '' : id,
                                    }))}
                                    className={`py-2 px-2 rounded-lg border text-xs font-medium ${
                                        giData.abdominalPainLocation === id
                                            ?
                                            'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                                            :
                                            'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                  {label}
                                </button>
                            ))}
                          </div>
                          <button
                              type="button"
                              onClick={() => setGIData(prev => ({
                                ...prev,
                                abdominalPainLocation: 'diffuse',
                              }))}
                              className={`w-full mt-2 py-2 px-4 rounded-lg border text-sm font-medium ${
                                  giData.abdominalPainLocation === 'diffuse'
                                      ?
                                      'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            Diffuse
                          </button>
                        </div>

                        {/* Additional Toggles */}
                        <div className="space-y-2">
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  giData.mealRelated === true
                                      ?
                                      'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={giData.mealRelated === true}
                                onChange={(e) => setGIData(prev => ({
                                  ...prev,
                                  mealRelated: e.target.checked ? true : null,
                                }))}
                                className="w-4 h-4 text-amber-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Worse after eating</span>
                          </label>

                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  giData.nighttimeSymptoms
                                      ?
                                      'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={giData.nighttimeSymptoms}
                                onChange={(e) => setGIData(prev => ({
                                  ...prev,
                                  nighttimeSymptoms: e.target.checked,
                                }))}
                                className="w-4 h-4 text-amber-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Nighttime symptoms</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* Migraine Fields */}
                  {isMigraine && (
                      <div
                          className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200">Migraine
                          Details</h3>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                          <select value={migraineData.duration}
                                  onChange={(e) => setMigraineData(prev => ({
                                    ...prev,
                                    duration: e.target.value,
                                  }))}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="">Select duration...</option>
                            <option value="less-than-1h">Less than 1 hour
                            </option>
                            <option value="1-4h">1-4 hours</option>
                            <option value="4-24h">4-24 hours</option>
                            <option value="1-2d">1-2 days</option>
                            <option value="more-than-2d">More than 2 days
                            </option>
                            <option value="ongoing">Still ongoing</option>
                          </select>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Was this migraine prostrating? <span
                              className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-3">
                            <button type="button"
                                    onClick={() => setMigraineData(
                                        prev => ({...prev, prostrating: true}))}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                        migraineData.prostrating === true
                                            ?
                                            'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                            :
                                            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}>Yes
                            </button>
                            <button type="button"
                                    onClick={() => setMigraineData(prev => ({
                                      ...prev,
                                      prostrating: false,
                                    }))}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                        migraineData.prostrating === false
                                            ?
                                            'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                            :
                                            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}>No
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated
                            Symptoms</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {key: 'aura', label: 'Aura'},
                              {key: 'nausea', label: 'Nausea'},
                              {
                                key: 'lightSensitivity',
                                label: 'Light sensitivity',
                              },
                              {
                                key: 'soundSensitivity',
                                label: 'Sound sensitivity',
                              },
                            ].map(({key, label}) => (
                                <label key={key}
                                       className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                           migraineData[key] ?
                                               'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' :
                                               'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                       }`}>
                                  <input type="checkbox"
                                         checked={migraineData[key]}
                                         onChange={(e) => setMigraineData(
                                             prev => ({
                                               ...prev,
                                               [key]: e.target.checked,
                                             }))}
                                         className="w-4 h-4 text-purple-600 rounded"/>
                                  <span
                                      className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Known
                            Triggers</label>
                          <input type="text" value={migraineData.triggers}
                                 onChange={(e) => setMigraineData(prev => ({
                                   ...prev,
                                   triggers: e.target.value,
                                 }))}
                                 placeholder="e.g., stress, bright lights"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                        </div>
                      </div>
                  )}

                  {/* Sleep Fields */}
                  {isSleepRelated && (
                      <div
                          className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Sleep
                          Details</h3>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours
                              Slept</label>
                            <input type="number" min="0" max="24" step="0.5"
                                   value={sleepData.hoursSlept}
                                   onChange={(e) => setSleepData(prev => ({
                                     ...prev,
                                     hoursSlept: e.target.value,
                                   }))}
                                   placeholder="Hours"
                                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                          </div>
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Times
                              Woken Up</label>
                            <input type="number" min="0" max="20"
                                   value={sleepData.wakeUps}
                                   onChange={(e) => setSleepData(prev => ({
                                     ...prev,
                                     wakeUps: e.target.value,
                                   }))}
                                   placeholder="Times"
                                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                          </div>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sleep Quality: {sleepData.quality}/10
                          </label>
                          <input type="range" min="0" max="10"
                                 value={sleepData.quality}
                                 onChange={(e) => setSleepData(prev => ({
                                   ...prev,
                                   quality: Number(e.target.value),
                                 }))}
                                 className="w-full"/>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sleep
                            Issues</label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              {
                                key: 'troubleFallingAsleep',
                                label: 'Trouble falling asleep',
                              },
                              {
                                key: 'troubleStayingAsleep',
                                label: 'Trouble staying asleep',
                              },
                              {
                                key: 'nightmares',
                                label: 'Nightmares/night terrors',
                              },
                            ].map(({key, label}) => (
                                <label key={key}
                                       className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                           sleepData[key] ?
                                               'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' :
                                               'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                       }`}>
                                  <input type="checkbox"
                                         checked={sleepData[key]}
                                         onChange={(e) => setSleepData(
                                             prev => ({
                                               ...prev,
                                               [key]: e.target.checked,
                                             }))}
                                         className="w-4 h-4 text-indigo-600 rounded"/>
                                  <span
                                      className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feel
                            rested upon waking?</label>
                          <div className="flex gap-3">
                            <button type="button"
                                    onClick={() => setSleepData(
                                        prev => ({...prev, feelRested: true}))}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                        sleepData.feelRested === true
                                            ?
                                            'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                            :
                                            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}>Yes
                            </button>
                            <button type="button"
                                    onClick={() => setSleepData(
                                        prev => ({...prev, feelRested: false}))}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                        sleepData.feelRested === false
                                            ?
                                            'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                            :
                                            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}>No
                            </button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* PTSD Fields */}
                  {isPTSDRelated && (
                      <div
                          className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200">Mental
                          Health Details</h3>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated
                            Experiences</label>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              {key: 'flashbacks', label: 'Flashbacks'},
                              {
                                key: 'intrusiveThoughts',
                                label: 'Intrusive thoughts',
                              },
                              {
                                key: 'avoidance',
                                label: 'Avoidance of triggers/situations',
                              },
                              {
                                key: 'emotionalNumbering',
                                label: 'Emotional numbness',
                              },
                              {key: 'hypervigilance', label: 'Hypervigilance'},
                              {
                                key: 'exaggeratedStartle',
                                label: 'Exaggerated startle response',
                              },
                            ].map(({key, label}) => (
                                <label key={key}
                                       className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                           ptsdData[key] ?
                                               'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700' :
                                               'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                       }`}>
                                  <input type="checkbox" checked={ptsdData[key]}
                                         onChange={(e) => setPtsdData(prev => ({
                                           ...prev,
                                           [key]: e.target.checked,
                                         }))}
                                         className="w-4 h-4 text-amber-600 rounded"/>
                                  <span
                                      className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger
                            (if known)</label>
                          <input type="text" value={ptsdData.triggerDescription}
                                 onChange={(e) => setPtsdData(prev => ({
                                   ...prev,
                                   triggerDescription: e.target.value,
                                 }))}
                                 placeholder="What triggered this episode?"
                                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1C: RESPIRATORY CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isRespiratoryRelated && (
                      <div
                          className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800 space-y-4">
                        <h3 className="font-medium text-sky-900 dark:text-sky-200 flex items-center gap-2">
                          <span>🫁</span> Respiratory Details
                        </h3>

                        {/* Rescue Inhaler */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Did you use a rescue inhaler?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({
                                  ...prev,
                                  rescueInhalerUsed: true,
                                }))}
                                className={`p-2 rounded-lg border transition-colors ${
                                    respiratoryData.rescueInhalerUsed === true
                                        ?
                                        'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({
                                  ...prev,
                                  rescueInhalerUsed: false,
                                  inhalerPuffs: '',
                                }))}
                                className={`p-2 rounded-lg border transition-colors ${
                                    respiratoryData.rescueInhalerUsed === false
                                        ?
                                        'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        {/* Inhaler Puffs (if yes) */}
                        {respiratoryData.rescueInhalerUsed === true && (
                            <div>
                              <label
                                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                How many puffs?
                              </label>
                              <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={respiratoryData.inhalerPuffs}
                                  onChange={(e) => setRespiratoryData(prev => ({
                                    ...prev,
                                    inhalerPuffs: e.target.value,
                                  }))}
                                  placeholder="e.g., 2"
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              />
                            </div>
                        )}

                        {/* Peak Flow & SpO2 */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Peak Flow (L/min)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="800"
                                value={respiratoryData.peakFlow}
                                onChange={(e) => setRespiratoryData(prev => ({
                                  ...prev,
                                  peakFlow: e.target.value,
                                }))}
                                placeholder="Optional"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              SpO2 (%)
                            </label>
                            <input
                                type="number"
                                min="70"
                                max="100"
                                value={respiratoryData.spo2}
                                onChange={(e) => setRespiratoryData(
                                    prev => ({...prev, spo2: e.target.value}))}
                                placeholder="Optional"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Activity Trigger */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            What triggered symptoms?
                          </label>
                          <select
                              value={respiratoryData.activityTrigger}
                              onChange={(e) => setRespiratoryData(prev => ({
                                ...prev,
                                activityTrigger: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select trigger...</option>
                            <option value="rest">At rest</option>
                            <option value="mild">Mild exertion (walking)
                            </option>
                            <option value="moderate">Moderate exertion (stairs,
                              housework)
                            </option>
                            <option value="severe">Severe exertion (running,
                              heavy lifting)
                            </option>
                          </select>
                        </div>

                        {/* Symptom Toggles */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Associated Symptoms
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <label
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                    respiratoryData.wheezing
                                        ?
                                        'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}>
                              <input
                                  type="checkbox"
                                  checked={respiratoryData.wheezing}
                                  onChange={(e) => setRespiratoryData(prev => ({
                                    ...prev,
                                    wheezing: e.target.checked,
                                  }))}
                                  className="w-4 h-4 text-sky-600 rounded"
                              />
                              <span
                                  className="text-sm text-gray-700 dark:text-gray-300">Wheezing</span>
                            </label>
                            <label
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                    respiratoryData.chestTightness
                                        ?
                                        'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}>
                              <input
                                  type="checkbox"
                                  checked={respiratoryData.chestTightness}
                                  onChange={(e) => setRespiratoryData(prev => ({
                                    ...prev,
                                    chestTightness: e.target.checked,
                                  }))}
                                  className="w-4 h-4 text-sky-600 rounded"
                              />
                              <span
                                  className="text-sm text-gray-700 dark:text-gray-300">Chest Tightness</span>
                            </label>
                            <label
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                    respiratoryData.coughing
                                        ?
                                        'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}>
                              <input
                                  type="checkbox"
                                  checked={respiratoryData.coughing}
                                  onChange={(e) => setRespiratoryData(prev => ({
                                    ...prev,
                                    coughing: e.target.checked,
                                  }))}
                                  className="w-4 h-4 text-sky-600 rounded"
                              />
                              <span
                                  className="text-sm text-gray-700 dark:text-gray-300">Coughing</span>
                            </label>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1D: JOINT/ROM CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isJointRelated && (
                      <div
                          className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                          <span>🦴</span> Joint & ROM Details
                        </h3>

                        {/* Joint and Side */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Joint
                            </label>
                            <select
                                value={jointData.joint}
                                onChange={(e) => setJointData(
                                    prev => ({...prev, joint: e.target.value}))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                              <option value="">Select...</option>
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
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Side
                            </label>
                            <select
                                value={jointData.side}
                                onChange={(e) => setJointData(
                                    prev => ({...prev, side: e.target.value}))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                              <option value="">Select...</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="bilateral">Both</option>
                            </select>
                          </div>
                        </div>

                        {/* ROM */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Range of Motion
                          </label>
                          <select
                              value={jointData.romEstimate}
                              onChange={(e) => setJointData(prev => ({
                                ...prev,
                                romEstimate: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select...</option>
                            <option value="full">Full</option>
                            <option value="slightly">Slightly limited</option>
                            <option value="moderately">Moderately limited
                            </option>
                            <option value="severely">Severely limited</option>
                          </select>
                        </div>

                        {/* Morning Stiffness */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Morning Stiffness
                          </label>
                          <select
                              value={jointData.morningStiffness}
                              onChange={(e) => setJointData(prev => ({
                                ...prev,
                                morningStiffness: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select...</option>
                            <option value="none">None</option>
                            <option value="minutes">&lt; 30 min</option>
                            <option value="30-60min">30-60 min</option>
                            <option value="hours">&gt; 1 hour</option>
                          </select>
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-2 gap-2">
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  jointData.swelling
                                      ?
                                      'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={jointData.swelling}
                                onChange={(e) => setJointData(prev => ({
                                  ...prev,
                                  swelling: e.target.checked,
                                }))}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Swelling</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  jointData.instability
                                      ?
                                      'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={jointData.instability}
                                onChange={(e) => setJointData(prev => ({
                                  ...prev,
                                  instability: e.target.checked,
                                }))}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Instability</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  jointData.locking
                                      ?
                                      'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={jointData.locking}
                                onChange={(e) => setJointData(prev => ({
                                  ...prev,
                                  locking: e.target.checked,
                                }))}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Locking</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  jointData.grinding
                                      ?
                                      'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                      :
                                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}>
                            <input
                                type="checkbox"
                                checked={jointData.grinding}
                                onChange={(e) => setJointData(prev => ({
                                  ...prev,
                                  grinding: e.target.checked,
                                }))}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Grinding</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1E: SEIZURE/EPISODE CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isSeizureRelated && (
                      <div
                          className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200 flex items-center gap-2">
                          <span>⚡</span> Seizure/Episode Details
                        </h3>

                        {/* Episode Type */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Episode Type
                          </label>
                          <select
                              value={seizureData.episodeType}
                              onChange={(e) => setSeizureData(prev => ({
                                ...prev,
                                episodeType: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select type...</option>
                            <option value="generalized">Generalized
                              (Tonic-Clonic)
                            </option>
                            <option value="partial">Partial/Focal</option>
                            <option value="absence">Absence (Petit Mal)</option>
                            <option value="psychogenic">Psychogenic</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Duration */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (seconds)
                          </label>
                          <input
                              type="number"
                              min="0"
                              value={seizureData.duration}
                              onChange={(e) => setSeizureData(prev => ({
                                ...prev,
                                duration: e.target.value,
                              }))}
                              placeholder="e.g., 30"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>

                        {/* Loss of Consciousness */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Loss of Consciousness
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({
                                  ...prev,
                                  lossOfConsciousness: 'yes',
                                }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    seizureData.lossOfConsciousness === 'yes'
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({
                                  ...prev,
                                  lossOfConsciousness: 'partial',
                                }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    seizureData.lossOfConsciousness ===
                                    'partial'
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Partial
                            </button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({
                                  ...prev,
                                  lossOfConsciousness: 'no',
                                }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    seizureData.lossOfConsciousness === 'no'
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >No
                            </button>
                          </div>
                        </div>

                        {/* Aura */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Warning Signs (Aura)?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setSeizureData(
                                    prev => ({...prev, auraPresent: true}))}
                                className={`p-2 rounded-lg border ${
                                    seizureData.auraPresent === true
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(
                                    prev => ({...prev, auraPresent: false}))}
                                className={`p-2 rounded-lg border ${
                                    seizureData.auraPresent === false
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >No
                            </button>
                          </div>
                        </div>

                        {/* Recovery Time */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Recovery Time
                          </label>
                          <select
                              value={seizureData.recoveryTime}
                              onChange={(e) => setSeizureData(prev => ({
                                ...prev,
                                recoveryTime: e.target.value,
                              }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select...</option>
                            <option value="immediate">Immediate (&lt; 5 min)
                            </option>
                            <option value="minutes">5-30 minutes</option>
                            <option value="30-60min">30-60 minutes</option>
                            <option value="hours">1-4 hours</option>
                            <option value="prolonged">&gt; 4 hours</option>
                          </select>
                        </div>

                        {/* Witness */}
                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Witness Present?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setSeizureData(
                                    prev => ({...prev, witnessPresent: true}))}
                                className={`p-2 rounded-lg border ${
                                    seizureData.witnessPresent === true
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(
                                    prev => ({...prev, witnessPresent: false}))}
                                className={`p-2 rounded-lg border ${
                                    seizureData.witnessPresent === false
                                        ?
                                        'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        :
                                        'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >No
                            </button>
                          </div>
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
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select eye...</option>
                            <option value="left">Left eye only</option>
                            <option value="right">Right eye only</option>
                            <option value="both">Both eyes</option>
                          </select>
                        </div>

                        {/* Visual Acuity */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Left Eye Acuity
                            </label>
                            <select
                                value={eyeData.leftEyeAcuity}
                                onChange={(e) => setEyeData(prev => ({ ...prev, leftEyeAcuity: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Not tested</option>
                              <option value="20/20">20/20 (Normal)</option>
                              <option value="20/25">20/25</option>
                              <option value="20/30">20/30</option>
                              <option value="20/40">20/40</option>
                              <option value="20/50">20/50</option>
                              <option value="20/70">20/70</option>
                              <option value="20/100">20/100</option>
                              <option value="20/200">20/200</option>
                              <option value="CF">CF (Count Fingers)</option>
                              <option value="HM">HM (Hand Motion)</option>
                              <option value="LP">LP (Light Perception)</option>
                              <option value="NLP">NLP (No Light Perception)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Right Eye Acuity
                            </label>
                            <select
                                value={eyeData.rightEyeAcuity}
                                onChange={(e) => setEyeData(prev => ({ ...prev, rightEyeAcuity: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Not tested</option>
                              <option value="20/20">20/20 (Normal)</option>
                              <option value="20/25">20/25</option>
                              <option value="20/30">20/30</option>
                              <option value="20/40">20/40</option>
                              <option value="20/50">20/50</option>
                              <option value="20/70">20/70</option>
                              <option value="20/100">20/100</option>
                              <option value="20/200">20/200</option>
                              <option value="CF">CF (Count Fingers)</option>
                              <option value="HM">HM (Hand Motion)</option>
                              <option value="LP">LP (Light Perception)</option>
                              <option value="NLP">NLP (No Light Perception)</option>
                            </select>
                          </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symptoms
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['blurriness', 'halos', 'pain', 'redness', 'tearing', 'discharge', 'floaters', 'flashes'].map((symptom) => (
                                <label
                                    key={symptom}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                        eyeData.symptoms.includes(symptom)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
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
                                      className="w-4 h-4 text-cyan-600 rounded"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300 capitalize">{symptom}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {/* Field of Vision */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Field of Vision Affected
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'central', label: 'Central vision' },
                              { id: 'peripheral', label: 'Peripheral vision' },
                              { id: 'blind-spots', label: 'Blind spots' },
                              { id: 'complete-loss', label: 'Complete loss in area' }
                            ].map((field) => (
                                <label
                                    key={field.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                        eyeData.fieldOfVision.includes(field.id)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={eyeData.fieldOfVision.includes(field.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEyeData(prev => ({ ...prev, fieldOfVision: [...prev.fieldOfVision, field.id] }));
                                        } else {
                                          setEyeData(prev => ({ ...prev, fieldOfVision: prev.fieldOfVision.filter(f => f !== field.id) }));
                                        }
                                      }}
                                      className="w-4 h-4 text-cyan-600 rounded"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{field.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {/* Impact on Activities */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Impact on Daily Activities
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'reading', label: 'Reading' },
                              { id: 'driving-day', label: 'Driving (day)' },
                              { id: 'driving-night', label: 'Driving (night)' },
                              { id: 'faces', label: 'Recognizing faces' },
                              { id: 'computer', label: 'Computer/phone use' },
                              { id: 'depth', label: 'Depth perception' },
                              { id: 'balance', label: 'Balance/mobility' },
                              { id: 'work', label: 'Work tasks' }
                            ].map((activity) => (
                                <label
                                    key={activity.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                        eyeData.affectedActivities.includes(activity.id)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
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
                                      className="w-4 h-4 text-cyan-600 rounded"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{activity.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>

                        {/* Triggering Factors */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Triggering/Worsening Factors (optional)
                          </label>
                          <input
                              type="text"
                              value={eyeData.triggeringFactors}
                              onChange={(e) => setEyeData(prev => ({ ...prev, triggeringFactors: e.target.value }))}
                              placeholder="e.g., bright light, screens, reading, fatigue..."
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        {/* Associated Conditions */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Associated Conditions
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'diabetes', label: 'Diabetes' },
                              { id: 'hypertension', label: 'High blood pressure' },
                              { id: 'tbi', label: 'Head injury/TBI' },
                              { id: 'migraine', label: 'Migraine' }
                            ].map((condition) => (
                                <label
                                    key={condition.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                        eyeData.associatedConditions.includes(condition.id)
                                            ? 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-400 dark:border-cyan-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={eyeData.associatedConditions.includes(condition.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEyeData(prev => ({ ...prev, associatedConditions: [...prev.associatedConditions, condition.id] }));
                                        } else {
                                          setEyeData(prev => ({ ...prev, associatedConditions: prev.associatedConditions.filter(c => c !== condition.id) }));
                                        }
                                      }}
                                      className="w-4 h-4 text-cyan-600 rounded"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{condition.label}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Pain Fields */}
                  {isPainRelated && (
                      <div
                          className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                        <h3 className="font-medium text-rose-900 dark:text-rose-200">Pain
                          Details</h3>

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain
                            Type</label>
                          <select value={painData.painType}
                                  onChange={(e) => setPainData(prev => ({
                                    ...prev,
                                    painType: e.target.value,
                                  }))}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  painData.radiating ?
                                      'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' :
                                      'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}>
                            <input type="checkbox" checked={painData.radiating}
                                   onChange={(e) => setPainData(prev => ({
                                     ...prev,
                                     radiating: e.target.checked,
                                   }))}
                                   className="w-4 h-4 text-rose-600 rounded"/>
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Radiating pain</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  painData.limitedRangeOfMotion ?
                                      'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' :
                                      'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}>
                            <input type="checkbox"
                                   checked={painData.limitedRangeOfMotion}
                                   onChange={(e) => setPainData(prev => ({
                                     ...prev,
                                     limitedRangeOfMotion: e.target.checked,
                                   }))}
                                   className="w-4 h-4 text-rose-600 rounded"/>
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300">Limited ROM</span>
                          </label>
                        </div>

                        {painData.radiating && (
                            <div>
                              <label
                                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Radiates
                                to</label>
                              <input type="text" value={painData.radiatingTo}
                                     onChange={(e) => setPainData(prev => ({
                                       ...prev,
                                       radiatingTo: e.target.value,
                                     }))}
                                     placeholder="e.g., down left leg, into shoulder"
                                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                            </div>
                        )}

                        <div>
                          <label
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities
                            Affected</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'Walking',
                              'Standing',
                              'Sitting',
                              'Sleeping',
                              'Lifting',
                              'Bending',
                              'Driving',
                              'Working'].map(activity => (
                                <label key={activity}
                                       className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                           painData.affectedActivities.includes(
                                               activity) ?
                                               'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' :
                                               'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                       }`}>
                                  <input type="checkbox"
                                         checked={painData.affectedActivities.includes(
                                             activity)}
                                         onChange={() => toggleActivity(
                                             activity)}
                                         className="w-4 h-4 text-rose-600 rounded"/>
                                  <span
                                      className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
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

                  {/* Phase 4: Gynecological Conditions Forms */}
                  {isGynecologicalRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🌸</span>
                          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200">Gynecological Details</h3>
                        </div>

                        {/* Affected Organ/System */}
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

                        {/* Pain Assessment */}
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

                        {/* Endometriosis Section */}
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
                                      <option value="controlled">Controlled (50% rating if bowel/bladder lesions)</option>
                                      <option value="partially-controlled">Partially Controlled (30% rating)</option>
                                      <option value="not-controlled">Not Controlled (30% rating)</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                          )}
                        </div>

                        {/* Menstrual & PCOS - Condensed version due to length */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Menstrual Disorders</h4>
                          <div className="grid grid-cols-2 gap-4">
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
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow Heaviness</label>
                              <select value={gynecologicalData.flowHeaviness}
                                      onChange={(e) => setGynecologicalData(prev => ({ ...prev, flowHeaviness: e.target.value }))}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                <option value="">Select flow</option>
                                <option value="light">Light</option>
                                <option value="moderate">Moderate</option>
                                <option value="heavy">Heavy</option>
                                <option value="very-heavy">Very Heavy</option>
                              </select>
                            </div>
                          </div>
                          <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer mt-3 ${
                              gynecologicalData.pcosDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input type="checkbox" checked={gynecologicalData.pcosDiagnosed}
                                   onChange={(e) => setGynecologicalData(prev => ({ ...prev, pcosDiagnosed: e.target.checked }))}
                                   className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PCOS Diagnosed</span>
                          </label>
                        </div>

                        {/* PID, Prolapse, Sexual Function - Simplified */}
                        <div className="grid grid-cols-3 gap-3">
                          <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                              gynecologicalData.pidDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input type="checkbox" checked={gynecologicalData.pidDiagnosed}
                                   onChange={(e) => setGynecologicalData(prev => ({ ...prev, pidDiagnosed: e.target.checked }))}
                                   className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PID</span>
                          </label>
                          <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                              gynecologicalData.prolapseDiagnosed ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300' : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input type="checkbox" checked={gynecologicalData.prolapseDiagnosed}
                                   onChange={(e) => setGynecologicalData(prev => ({ ...prev, prolapseDiagnosed: e.target.checked }))}
                                   className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prolapse</span>
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
                      </div>
                  )}

                  {/* Medications */}
                  {medications.length > 0 && (
                      <div
                          className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                        <h3 className="font-medium text-teal-900 dark:text-teal-200 mb-3">Medications
                          Taken</h3>
                        <div className="space-y-2">
                          {medications.filter(m => m.isActive).map(med => (
                              <label key={med.id}
                                     className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                         selectedMedications.includes(med.id)
                                             ?
                                             'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                             :
                                             'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                     }`}>
                                <input type="checkbox"
                                       checked={selectedMedications.includes(
                                           med.id)}
                                       onChange={(e) => {
                                         if (e.target.checked) {
                                           setSelectedMedications(
                                               prev => [...prev, med.id]);
                                         } else {
                                           setSelectedMedications(
                                               prev => prev.filter(
                                                   id => id !== med.id));
                                         }
                                       }}
                                       className="w-4 h-4 text-teal-600 rounded"/>
                                <span
                                    className="text-sm text-gray-700 dark:text-gray-300">{med.name} ({med.dosage})</span>
                              </label>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                    <textarea value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Additional notes..."
                              rows={3}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>

                <div
                    className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800">
                  <button onClick={onClose}
                          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button onClick={handleSave}
                          className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
        );
      };

  export default EditLogModal;