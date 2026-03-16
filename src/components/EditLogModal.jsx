import {useState, useEffect} from 'react';
import {
  updateSymptomLog,
  getMedications,
  logMedicationTaken,
  getMedicationLogsForSymptom,
  deleteMedicationLog,
} from '../utils/storage';
import {
  formatDosage,
  getDefaultMedDetail,
  getDosageForLog,
} from '../utils/medicationUtils';
import OccurrenceTimePicker from './OccurrenceTimePicker';
import {
  AnxietyForm,              INITIAL_ANXIETY_DATA,
  PTSDForm,                 INITIAL_PTSD_DATA,
  MigraineForm,             INITIAL_MIGRAINE_DATA,
  MultipleSclerosisForm,    INITIAL_MULTIPLE_SCLEROSIS_DATA,
  ParkinsonsForm,           INITIAL_PARKINSONS_DATA,
  MyastheniaForm,           INITIAL_MYASTHENIA_DATA,
  NarcolepsyForm,           INITIAL_NARCOLEPSY_DATA,
  ALSForm,                  INITIAL_ALS_DATA,
  SyringomyeliaForm,        INITIAL_SYRINGOMYELIA_DATA,
  MyelitisForm,             INITIAL_MYELITIS_DATA,
  DepressionForm,           INITIAL_DEPRESSION_DATA,
  BipolarForm,              INITIAL_BIPOLAR_DATA,
  OCDForm,                  INITIAL_OCD_DATA,
  AdjustmentDisorderForm,   INITIAL_ADJUSTMENT_DISORDER_DATA,
  EatingDisorderForm,       INITIAL_EATING_DISORDER_DATA,
  BingeEatingForm,          INITIAL_BINGE_EATING_DATA,
  DissociativeForm,         INITIAL_DISSOCIATIVE_DATA,
  AcuteStressForm,          INITIAL_ACUTE_STRESS_DATA,
  PersonalityDisorderForm,  INITIAL_PERSONALITY_DATA,
  SomaticSymptomForm,       INITIAL_SOMATIC_SYMPTOM_DATA,
  IllnessAnxietyForm,       INITIAL_ILLNESS_ANXIETY_DATA,
  DepersonalizationForm,    INITIAL_DEPERSONALIZATION_DATA,
  CyclothymicForm,          INITIAL_CYCLOTHYMIC_DATA,
  GIForm,                   INITIAL_GI_DATA,
  RespiratoryForm,          INITIAL_RESPIRATORY_DATA,
  SleepForm,                INITIAL_SLEEP_DATA,
  CardiovascularForm,       INITIAL_CARDIOVASCULAR_DATA,
  PainForm,                 INITIAL_PAIN_DATA,
  SeizureForm,              INITIAL_SEIZURE_DATA,
  HIVForm,                  INITIAL_HIV_DATA,
  HepatitisForm,            INITIAL_HEPATITIS_DATA,
  LymeForm,                 INITIAL_LYME_DATA,
  MalariaForm,              INITIAL_MALARIA_DATA,
  BrucellosisForm,          INITIAL_BRUCELLOSIS_DATA,
  CampylobacterForm,        INITIAL_CAMPYLOBACTER_DATA,
  QFeverForm,               INITIAL_QFEVER_DATA,
  SalmonellaForm,           INITIAL_SALMONELLA_DATA,
  ShigellaForm,             INITIAL_SHIGELLA_DATA,
  WestNileForm,             INITIAL_WEST_NILE_DATA,
  NTMForm,                  INITIAL_NTM_DATA,
  DentalForm,               INITIAL_DENTAL_DATA,
  PeripheralNerveForm,      INITIAL_PERIPHERAL_NERVE_DATA,
  JointForm,                INITIAL_JOINT_DATA,
  SpineForm,                INITIAL_SPINE_DATA,
  GenitourinaryForm,        INITIAL_GENITOURINARY_DATA,
  GynecologicalForm,        INITIAL_GYNECOLOGICAL_DATA,
  AnemiaForm,               INITIAL_ANEMIA_DATA,
  BleedingDisorderForm,     INITIAL_BLEEDING_DISORDER_DATA,
  InfectionForm,            INITIAL_INFECTION_DATA,
  LymphomaLeukemiaForm,     INITIAL_LYMPHOMA_LEUKEMIA_DATA,
  PolycythemiaForm,         INITIAL_POLYCYTHEMIA_DATA,
  SickleCellForm,           INITIAL_SICKLE_CELL_DATA,
  TreatmentForm,            INITIAL_TREATMENT_DATA,
  B12DeficiencyForm,        INITIAL_B12_DEFICIENCY_DATA,
  DigestiveForm,            INITIAL_DIGESTIVE_DATA,
} from './forms/SymptomForms/index.js';
import MedicationEffectivenessInline from './MedicationEffectivenessInline';
import WhyTrackThis from './WhyTrackThis.jsx';

const EditLogModal = ({log, isOpen, onClose, onSaved}) => {
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [occurredAt, setOccurredAt] = useState(log?.occurredAt || log?.timestamp || new Date().toISOString());
  const [medications, setMedications] = useState([]);
  // Object keyed by medication ID: { [medId]: { effectiveness, sideEffects, sideEffectsOther } }
  const [selectedMedications, setSelectedMedications] = useState({});
  const [existingMedLogs, setExistingMedLogs] = useState([]);

  const [isFlareUp, setIsFlareUp] = useState(false);
  const [duration, setDuration] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Migraine-specific fields — shape owned by MigraineForm, imported via INITIAL_MIGRAINE_DATA
  const [migraineData, setMigraineData] = useState({ ...INITIAL_MIGRAINE_DATA });

  // Sleep data — shape owned by SleepForm.jsx
  const [sleepData, setSleepData] = useState({ ...INITIAL_SLEEP_DATA });

  // PTSD-specific fields — shape owned by PTSDForm, imported via INITIAL_PTSD_DATA
  const [ptsdData, setPtsdData] = useState({ ...INITIAL_PTSD_DATA });

  // Pain-specific fields
  const [painData, setPainData] = useState({ ...INITIAL_PAIN_DATA });

  // GI data — shape owned by GIForm.jsx
  const [giData, setGIData] = useState({ ...INITIAL_GI_DATA });

  // Respiratory data — shape owned by RespiratoryForm.jsx
  const [respiratoryData, setRespiratoryData] = useState({ ...INITIAL_RESPIRATORY_DATA });

  // Joint data — shape owned by MusculoskeletalForm.jsx
  const [jointData, setJointData] = useState({ ...INITIAL_JOINT_DATA });

  // Spine data — shape owned by MusculoskeletalForm.jsx
  const [spineData, setSpineData] = useState({ ...INITIAL_SPINE_DATA });

  // Seizure data — shape owned by SeizureForm.jsx
  const [seizureData, setSeizureData] = useState({ ...INITIAL_SEIZURE_DATA });

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
  const [genitourinaryData, setGenitourinaryData] = useState({ ...INITIAL_GENITOURINARY_DATA });

  // Phase 4: Gynecological Conditions
  const [gynecologicalData, setGynecologicalData] = useState({ ...INITIAL_GYNECOLOGICAL_DATA });

  // Phase 5: Hemic/Lymphatic Conditions
  const [anemiaData, setAnemiaData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [sickleCellData, setSickleCellData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [bleedingDisorderData, setBleedingDisorderData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [lymphomaLeukemiaData, setLymphomaLeukemiaData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [polycythemiaData, setPolycythemiaData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [infectionData, setInfectionData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [treatmentData, setTreatmentData] = useState({ ...INITIAL_ANEMIA_DATA });
  const [b12DeficiencyData, setB12DeficiencyData] = useState({ ...INITIAL_ANEMIA_DATA });

  // Phase 6: Infectious Disease Data
  const [hivData, setHivData] = useState({ ...INITIAL_HIV_DATA });
  const [hepatitisData, setHepatitisData] = useState({ ...INITIAL_HEPATITIS_DATA });
  const [lymeData, setLymeData] = useState({ ...INITIAL_LYME_DATA });
  const [malariaData, setMalariaData] = useState({ ...INITIAL_MALARIA_DATA });
  const [brucellosisData, setBrucellosisData] = useState({ ...INITIAL_BRUCELLOSIS_DATA });
  const [campylobacterData, setCampylobacterData] = useState({ ...INITIAL_CAMPYLOBACTER_DATA });
  const [qFeverData, setQFeverData] = useState({ ...INITIAL_QFEVER_DATA });
  const [salmonellaData, setSalmonellaData] = useState({ ...INITIAL_SALMONELLA_DATA });
  const [shigellaData, setShigellaData] = useState({ ...INITIAL_SHIGELLA_DATA });
  const [westNileData, setWestNileData] = useState({ ...INITIAL_WEST_NILE_DATA });
  const [ntmData, setNtmData] = useState({ ...INITIAL_NTM_DATA });

  // Phase 7: Dental/Oral Conditions
  const [dentalData, setDentalData] = useState({ ...INITIAL_DENTAL_DATA });

  // PHASE 8A: MENTAL HEALTH EXPANSION - STATE VARIABLES
  // Form 1: Anxiety Disorders — shape owned by AnxietyForm, imported via INITIAL_ANXIETY_DATA
  const [anxietyData, setAnxietyData] = useState({ ...INITIAL_ANXIETY_DATA });

  // ── Mental health conditions — shapes owned by MentalHealthForm.jsx ─────────
  const [eatingDisorderData, setEatingDisorderData]           = useState({ ...INITIAL_EATING_DISORDER_DATA });
  const [depressionData, setDepressionData]                   = useState({ ...INITIAL_DEPRESSION_DATA });
  const [bipolarData, setBipolarData]                         = useState({ ...INITIAL_BIPOLAR_DATA });
  const [ocdData, setOcdData]                                 = useState({ ...INITIAL_OCD_DATA });
  const [adjustmentDisorderData, setAdjustmentDisorderData]   = useState({ ...INITIAL_ADJUSTMENT_DISORDER_DATA });
  const [bingeEatingData, setBingeEatingData]                 = useState({ ...INITIAL_BINGE_EATING_DATA });
  const [dissociativeData, setDissociativeData]               = useState({ ...INITIAL_DISSOCIATIVE_DATA });
  const [acuteStressData, setAcuteStressData]                 = useState({ ...INITIAL_ACUTE_STRESS_DATA });
  const [personalityData, setPersonalityData]                 = useState({ ...INITIAL_PERSONALITY_DATA });
  const [somaticSymptomData, setSomaticSymptomData]           = useState({ ...INITIAL_SOMATIC_SYMPTOM_DATA });
  const [illnessAnxietyData, setIllnessAnxietyData]           = useState({ ...INITIAL_ILLNESS_ANXIETY_DATA });
  const [depersonalizationData, setDepersonalizationData]     = useState({ ...INITIAL_DEPERSONALIZATION_DATA });
  const [cyclothymicData, setCyclothymicData]                 = useState({ ...INITIAL_CYCLOTHYMIC_DATA });
  // Phase 9: Cardiovascular data
  const [cardiovascularData, setCardiovascularData] = useState({ ...INITIAL_CARDIOVASCULAR_DATA });
  // Phase 10: Digestive data
  const [digestiveData, setDigestiveData] = useState({ ...INITIAL_DIGESTIVE_DATA });
  // Neurological data — shape owned by NeurologicalForm.jsx
  const [multipleSclerosisData, setMultipleSclerosisData] = useState({ ...INITIAL_MULTIPLE_SCLEROSIS_DATA });
  const [parkinsonsData, setParkinsonsData] = useState({ ...INITIAL_PARKINSONS_DATA });
  const [myastheniaData, setMyastheniaData] = useState({ ...INITIAL_MYASTHENIA_DATA });
  const [narcolepsyData, setNarcolepsyData] = useState({ ...INITIAL_NARCOLEPSY_DATA });
  const [alsData, setAlsData] = useState({ ...INITIAL_ALS_DATA });
  const [syringomyeliaData, setSyringomyeliaData] = useState({ ...INITIAL_SYRINGOMYELIA_DATA });
  const [myelitisData, setMyelitisData] = useState({ ...INITIAL_MYELITIS_DATA });
  // DC 8510-8530 (Paralysis), 8610-8630 (Neuritis), 8710-8730 (Neuralgia)
  // Peripheral Nerve data — shape owned by PeripheralNerveForm.jsx
  const [peripheralNerveData, setPeripheralNerveData] = useState({ ...INITIAL_PERIPHERAL_NERVE_DATA });


  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
          if (isOpen && log) {
            setSeverity(log.severity || 5);
            setNotes(log.notes || '');
            setOccurredAt(log.occurredAt || log.timestamp || new Date().toISOString());
            setMedications(getMedications());

            // PHASE 1A: Load universal fields
            setIsFlareUp(log.isFlareUp || false);
            setDuration(log.duration || '');
            setTimeOfDay(log.timeOfDay || '');

            // Get existing medication logs for this symptom
            const existingMeds = getMedicationLogsForSymptom(log.id);
            setExistingMedLogs(existingMeds);
            // Build selectedMedications object with existing effectiveness/sideEffects data
            const medObj = {};
            existingMeds.forEach(m => {
              medObj[m.medicationId] = {
                effectiveness: m.effectiveness || '',
                sideEffects: Array.isArray(m.sideEffects) ? m.sideEffects : [],
                sideEffectsOther: '',
              };
            });
            setSelectedMedications(medObj);

            // Load condition-specific data
            if (log.migraineData) {
              setMigraineData(log.migraineData);
            } else {
              setMigraineData({ ...INITIAL_MIGRAINE_DATA });
            }

            setSleepData(log.sleepData ?? { ...INITIAL_SLEEP_DATA });

            if (log.ptsdData) {
              setPtsdData(log.ptsdData);
            } else {
              setPtsdData({ ...INITIAL_PTSD_DATA });
            }

            setPainData(log.painData ?? { ...INITIAL_PAIN_DATA });

            // PHASE 1B: Load GI data
            setGIData(log.giData ?? { ...INITIAL_GI_DATA });

            // PHASE 1C: Load Respiratory data
            setRespiratoryData(log.respiratoryData ?? { ...INITIAL_RESPIRATORY_DATA });

            // PHASE 1D: Load Joint data and Spine data
            setJointData(log.jointData ?? { ...INITIAL_JOINT_DATA });
            setSpineData(log.spineData ?? { ...INITIAL_SPINE_DATA });

            // PHASE 1E: Load Seizure data
            setSeizureData(log.seizureData ?? { ...INITIAL_SEIZURE_DATA });

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
            setGenitourinaryData(log.genitourinaryData ?? { ...INITIAL_GENITOURINARY_DATA });

            // Phase 4: Load Gynecological data
            setGynecologicalData(log.gynecologicalData ?? { ...INITIAL_GYNECOLOGICAL_DATA });
            // Phase 5: Load Hemic/Lymphatic data
            setAnemiaData(log.anemiaData ?? { ...INITIAL_ANEMIA_DATA });
            setSickleCellData(log.sickleCellData ?? { ...INITIAL_SICKLE_CELL_DATA });
            setBleedingDisorderData(log.bleedingDisorderData ?? { ...INITIAL_BLEEDING_DISORDER_DATA });
            setInfectionData(log.infectionData ?? { ...INITIAL_INFECTION_DATA });
            setLymphomaLeukemiaData(log.lymphomaLeukemiaData ?? { ...INITIAL_LYMPHOMA_LEUKEMIA_DATA });
            setPolycythemiaData(log.polycythemiaData ?? { ...INITIAL_POLYCYTHEMIA_DATA });
            setTreatmentData(log.treatmentData ?? { ...INITIAL_TREATMENT_DATA });
            setB12DeficiencyData(log.b12DeficiencyData ?? { ...INITIAL_B12_DEFICIENCY_DATA });

            // Phase 6: Infectious disease data
            setHivData(log.hivData ?? { ...INITIAL_HIV_DATA });
            setHepatitisData(log.hepatitisData ?? { ...INITIAL_HEPATITIS_DATA });
            setLymeData(log.lymeData ?? { ...INITIAL_LYME_DATA });
            setMalariaData(log.malariaData ?? { ...INITIAL_MALARIA_DATA });
            setBrucellosisData(log.brucellosisData ?? { ...INITIAL_BRUCELLOSIS_DATA });
            setCampylobacterData(log.campylobacterData ?? { ...INITIAL_CAMPYLOBACTER_DATA });
            setQFeverData(log.qFeverData ?? { ...INITIAL_QFEVER_DATA });
            setSalmonellaData(log.salmonellaData ?? { ...INITIAL_SALMONELLA_DATA });
            setShigellaData(log.shigellaData ?? { ...INITIAL_SHIGELLA_DATA });
            setWestNileData(log.westNileData ?? { ...INITIAL_WEST_NILE_DATA });
            setNtmData(log.ntmData ?? { ...INITIAL_NTM_DATA });

            // Phase 7: Load dental data
            setDentalData(log.dentalData ?? { ...INITIAL_DENTAL_DATA });
            setEatingDisorderData(log.eatingDisorderData ?? { ...INITIAL_EATING_DISORDER_DATA });
            setAnxietyData(log.anxietyData ?? { ...INITIAL_ANXIETY_DATA });
            setDepressionData(log.depressionData ?? { ...INITIAL_DEPRESSION_DATA });
            setBipolarData(log.bipolarData ?? { ...INITIAL_BIPOLAR_DATA });
            setOcdData(log.ocdData ?? { ...INITIAL_OCD_DATA });
            setAdjustmentDisorderData(log.adjustmentDisorderData ?? { ...INITIAL_ADJUSTMENT_DISORDER_DATA });
            setBingeEatingData(log.bingeEatingData ?? { ...INITIAL_BINGE_EATING_DATA });
            setDissociativeData(log.dissociativeData ?? { ...INITIAL_DISSOCIATIVE_DATA });
            setAcuteStressData(log.acuteStressData ?? { ...INITIAL_ACUTE_STRESS_DATA });
            setPersonalityData(log.personalityData ?? { ...INITIAL_PERSONALITY_DATA });
            setSomaticSymptomData(log.somaticData ?? { ...INITIAL_SOMATIC_SYMPTOM_DATA });
            setIllnessAnxietyData(log.illnessAnxietyData ?? { ...INITIAL_ILLNESS_ANXIETY_DATA });
            setDepersonalizationData(log.depersonalizationData ?? { ...INITIAL_DEPERSONALIZATION_DATA });
            setCyclothymicData(log.cyclothymicData ?? { ...INITIAL_CYCLOTHYMIC_DATA });

            // Phase 9: Load cardiovascular data
            setCardiovascularData(log.cardiovascularData ?? { ...INITIAL_CARDIOVASCULAR_DATA });

            // Phase 10: Load digestive data
            setDigestiveData(log.digestiveData ?? { ...INITIAL_DIGESTIVE_DATA });
            // Phase 1A: Load neurological data
            setMultipleSclerosisData(log.multipleSclerosisData
                ? log.multipleSclerosisData
                : { ...INITIAL_MULTIPLE_SCLEROSIS_DATA });
            setParkinsonsData(log.parkinsonsData
                ? log.parkinsonsData
                : { ...INITIAL_PARKINSONS_DATA });
            setMyastheniaData(log.myastheniaData
                ? log.myastheniaData
                : { ...INITIAL_MYASTHENIA_DATA });
            // Phase 1B: Load additional neurological data
            setNarcolepsyData(log.narcolepsyData
                ? log.narcolepsyData
                : { ...INITIAL_NARCOLEPSY_DATA });
            setAlsData(log.alsData
                ? log.alsData
                : { ...INITIAL_ALS_DATA });
            setSyringomyeliaData(log.syringomyeliaData
                ? log.syringomyeliaData
                : { ...INITIAL_SYRINGOMYELIA_DATA });
            setMyelitisData(log.myelitisData
                ? log.myelitisData
                : { ...INITIAL_MYELITIS_DATA });
            // Phase 1C: Load peripheral nerve data
            setPeripheralNerveData(log.peripheralNerveData ?? { ...INITIAL_PERIPHERAL_NERVE_DATA });
          }
  }, [isOpen, log]);

        // Peripheral nerve prefixes to exclude from generic pain/GU detection
        const peripheralNervePrefixes = ['uprn-', 'mdrn-', 'lwrn-', 'alrn-', 'radn-', 'medn-', 'ulnn-',
          'mscn-', 'crcn-', 'ltn-', 'scin-', 'cpn-', 'spn-', 'dpn-', 'tibn-', 'ptn-', 'femn-',
          'sapn-', 'obtn-', 'lfcn-', 'iin-'];
        const isPeripheralNerveSymptomELM = peripheralNervePrefixes.some(prefix => log?.symptomId?.startsWith(prefix));

        // Phase 3A: Endocrine prefixes to exclude from generic pain/GU detection
        const endocrinePrefixes = ['hyper-', 'graves-', 'thyroiditis-', 'hpth-', 'hopth-', 'hypo-',
          'addisons-', 'cushings-', 'di-', 'haldo-'];
        const isEndocrineSymptomELM = endocrinePrefixes.some(prefix => log?.symptomId?.startsWith(prefix));

        // Phase 4D: Exclude foot condition symptoms from pain detection
        const isFootConditionSymptomELM = (
            log?.symptomId?.startsWith('wf-') ||
            log?.symptomId?.startsWith('cf-') ||
            log?.symptomId?.startsWith('mt-') ||
            log?.symptomId?.startsWith('hv-') ||
            log?.symptomId?.startsWith('hr-')
        );
        // Phase 5A: Exclude hernia and adhesion symptoms from pain detection
        const isHerniaOrAdhesionSymptomELM = (
            log?.symptomId?.startsWith('hernia-') ||
            log?.symptomId?.startsWith('pa-')
        );
        // Phase 5B: Exclude esophageal and post-surgical digestive symptoms from pain detection
        const isDigestivePhase5BSymptomELM = (
            log?.symptomId?.startsWith('es-') ||
            log?.symptomId?.startsWith('esp-') ||
            log?.symptomId?.startsWith('pgs-') ||
            log?.symptomId?.startsWith('if-')
        );

        // Phase 6A: Exclude skin condition symptoms from dental/oral detection
        const isSkinConditionSymptomELM = (
            log?.symptomId?.startsWith('acne-') ||
            log?.symptomId?.startsWith('chloracne-') ||
            log?.symptomId?.startsWith('aa-') ||
            log?.symptomId?.startsWith('hh-') ||
            // Phase 6B additions
            log?.symptomId?.startsWith('dle-') ||
            log?.symptomId?.startsWith('bullous-') ||
            log?.symptomId?.startsWith('cv-') ||
            log?.symptomId?.startsWith('derm-') ||
            log?.symptomId?.startsWith('skinf-')
        );

        // Phase 7A: Eye condition prefixes for exclusion from Pain Details form
        const isEyeConditionSymptomELM = (
            log?.symptomId?.startsWith('uveitis-') ||
            log?.symptomId?.startsWith('keratitis-') ||
            log?.symptomId?.startsWith('conj-') ||
            log?.symptomId?.startsWith('scleritis-')
        );

        // Phase 7B: Ear condition prefixes for exclusion from Pain Details form
        const isEarConditionSymptomELM = (
            log?.symptomId?.startsWith('vest-') ||
            log?.symptomId?.startsWith('csom-') ||
            log?.symptomId?.startsWith('coe-') ||
            log?.symptomId?.startsWith('cnsom-')
        );


  const isMigraine = log?.symptomId === 'migraine';

  const isSleepRelated = !isEndocrineSymptomELM && (
      log?.symptomId === 'sleep-issues' ||
      log?.symptomId === 'sleep-quality' ||
      log?.symptomId?.includes('insomnia') ||
      log?.symptomId === 'nightmares' ||
      log?.symptomId === 'ptsd-nightmare' ||
      log?.sleepData  // backward compat: show if log has sleep data saved
  );


        // PTSD - All PTSD symptoms (must be specific to avoid catching all mental health)
        const isPTSDRelated = log?.symptomId?.includes('ptsd-') ||
            ['hypervigilance', 'flashbacks', 'intrusive-thoughts', 'avoidance',
              'emotional-numbness', 'startle-response'].includes(log?.symptomId) ||
            log?.ptsdData;

        // Anxiety Disorders Form
        const isAnxietyFormRelated = [
          // Anxiety Symptoms category (actual IDs from symptoms.js)
          'anxiety', 'gad-worry', 'gad-restlessness', 'gad-muscle-tension',
          // Panic Disorder Symptoms category
          'panic-attack', 'panic-agoraphobia', 'panic-anticipatory-anxiety',
          // Social Anxiety Symptoms category
          'social-anxiety-fear', 'social-anxiety-avoidance', 'social-anxiety-performance',
          'social-anxiety-physical', 'social-anxiety-anticipatory',
        ].includes(log?.symptomId);

        // Depression Form
        const isDepressionFormRelated = [
          'depression', 'mdd-episode', 'mdd-anhedonia', 'mdd-hopelessness',
          'persistent-depressive-chronic', 'persistent-depressive-low-energy',
          'persistent-depressive-low-self-esteem', 'persistent-depressive-hopelessness'
        ].includes(log?.symptomId);

        // Bipolar Form
        const isBipolarFormRelated = [
          // Bipolar Symptoms category (actual IDs: bipolar-manic, bipolar-depressive, bipolar-mixed)
          'bipolar-manic', 'bipolar-depressive', 'bipolar-mixed',
          // Cyclothymic Disorder (Phase 8A)
          'cyclothymic-hypomanic', 'cyclothymic-depressive', 'cyclothymic-mood-swing', 'cyclothymic-irritability'
        ].includes(log?.symptomId);

        // OCD Form
        const isOCDFormRelated = [
          // Actual OCD symptom IDs from symptoms.js
          'ocd-obsessions', 'ocd-compulsions', 'ocd-checking', 'ocd-contamination', 'ocd-time-spent'
        ].includes(log?.symptomId);
        // Adjustment Disorder Form
        const isAdjustmentDisorderFormRelated = [
          'adjustment-depressed-mood', 'adjustment-anxiety', 'adjustment-mixed-emotions',
          'adjustment-disturbance-conduct', 'adjustment-work-difficulty', 'adjustment-relationship-problems',
          'adjustment-unspecified'
        ].includes(log?.symptomId);

        // Somatic Symptom Disorders
        const isSomaticSymptomRelated = [
          'somatic-pain',
          'somatic-excessive-worry',
          'somatic-multiple-symptoms',
          'somatic-doctor-visits',
          'somatic-functional-impairment',
        ].includes(log?.symptomId)

        // Pain: match ANY pain-related symptom only
        const isPainRelated = !isPeripheralNerveSymptomELM && !isEndocrineSymptomELM && !isFootConditionSymptomELM && !isHerniaOrAdhesionSymptomELM &&
            !isDigestivePhase5BSymptomELM && !isEyeConditionSymptomELM && !isSomaticSymptomRelated && (
            log?.symptomId?.includes('pain') ||
            log?.symptomId?.includes('-ache') ||
            log?.symptomId?.includes('stiff') ||
            [ 'sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
              'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness', 'numbness',
              'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd', 'spondylosis', 'spondylolisthesis',
              'herniated', 'bulging'].some(term => log?.symptomId?.includes(term)) ||
            log?.painData
        ); // Also show if log already has pain data

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
        // Phase 11: Added bronchiectasis, pulmonary fibrosis, sarcoidosis
        const isRespiratoryRelated = log?.symptomId?.startsWith('asthma-') ||
            log?.symptomId?.startsWith('copd-') ||
            log?.symptomId?.startsWith('apnea-') ||
            log?.symptomId?.startsWith('emphysema-') ||
            log?.symptomId?.startsWith('bronchitis-') ||
            log?.symptomId?.startsWith('bronchiectasis-') ||
            log?.symptomId?.startsWith('pf-') ||
            log?.symptomId?.startsWith('sarcoid-') ||
            log?.symptomId?.includes('breathing') ||
            log?.symptomId?.includes('wheez') ||
            log?.symptomId?.includes('cough') ||
            ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(log?.symptomId) ||
            log?.respiratoryData; // Also show if log already has respiratory data

  // PHASE 1D: Joint/ROM condition detection
  // Phase 4A: Added gout-, bursitis-, tendinitis- prefixes
  // Phase 4B: Selective detection - exclude systemic symptoms
  const isSystemicSymptomELM = log?.symptomId?.includes('-fatigue') ||
      log?.symptomId?.includes('-fever') ||
      log?.symptomId?.includes('-weight-loss') ||
      log?.symptomId?.includes('-anemia') ||
      log?.symptomId?.includes('-constitutional') ||
      log?.symptomId?.includes('-malaise');

  // Phase 4C: Exclude spine symptoms from joint detection
  const isSpineSymptomELM = (
      log?.symptomId?.startsWith('vfx-') ||
      log?.symptomId?.startsWith('si-') ||
      log?.symptomId?.startsWith('ss-') ||
      log?.symptomId?.startsWith('as-') ||
      log?.symptomId?.startsWith('sf-')
  );

  const isJointRelated = log?.jointData || (!isSystemicSymptomELM && !isSpineSymptomELM && (
      log?.symptomId?.startsWith('shoulder-') ||
      log?.symptomId?.startsWith('knee-') ||
      log?.symptomId?.startsWith('hip-') ||
      log?.symptomId?.startsWith('ankle-') ||
      log?.symptomId?.startsWith('elbow-') ||
      log?.symptomId?.startsWith('wrist-') ||
      log?.symptomId?.startsWith('hand-') ||
      log?.symptomId?.startsWith('finger-') ||
      log?.symptomId?.startsWith('foot-') ||
      log?.symptomId?.startsWith('toe-') ||
      log?.symptomId?.startsWith('gout-') ||
      log?.symptomId?.startsWith('bursitis-') ||
      log?.symptomId?.startsWith('tendinitis-') ||
      log?.symptomId?.startsWith('myositis-') ||
      log?.symptomId?.startsWith('osteo-') ||
      log?.symptomId?.startsWith('mja-') ||
      log?.symptomId?.includes('joint') ||
      log?.symptomId?.includes('arthritis') ||
      log?.symptomId?.includes('bursitis') ||
      log?.symptomId?.includes('tendinitis') ||
      log?.symptomId?.includes('gout') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(log?.symptomId)
  ));

  // PHASE 4C: Spine Condition detection
  // DC 5235 (Vertebral Fracture), 5236 (Sacroiliac), 5238 (Stenosis), 5240 (Ankylosing Spondylitis), 5241 (Spinal Fusion)
  const isSpineConditionRelated = (
      log?.symptomId?.startsWith('vfx-') ||      // Vertebral Fracture
      log?.symptomId?.startsWith('si-') ||       // Sacroiliac
      log?.symptomId?.startsWith('ss-') ||       // Spinal Stenosis
      log?.symptomId?.startsWith('as-') ||       // Ankylosing Spondylitis
      log?.symptomId?.startsWith('sf-') ||       // Spinal Fusion
      log?.symptomId?.includes('vertebral') ||
      log?.symptomId?.includes('sacroiliac') ||
      log?.symptomId?.includes('stenosis') ||
      log?.symptomId?.includes('ankylosing') ||
      log?.symptomId?.includes('spondylitis') ||
      log?.symptomId?.includes('spinal-fusion') ||
      log?.spineData  // Also show if log already has spine data
  );

  // PHASE 1E: Seizure/Episode condition detection
  const isSeizureRelated = log?.symptomId?.includes('seizure') ||
      log?.symptomId?.includes('epilep') ||
      log?.symptomId?.includes('convuls') ||
      log?.symptomId?.startsWith('seizure-') ||
      log?.symptomId?.startsWith('jack-') ||
      log?.symptomId?.startsWith('dien-') ||
      log?.symptomId?.startsWith('psych-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(log?.symptomId) ||
      log?.seizureData; // Also show if log already has seizure data

  // Phase 1D: Specific epilepsy type detection
  const isJacksonianEpilepsyELM = log?.symptomId?.startsWith('jack-') ||
      log?.symptomId === 'seizure-partial' ||
      log?.symptomId?.includes('focal') ||
      log?.seizureData?.focalOnsetLocation; // Show if editing existing focal data

  const isDiencephalicEpilepsyELM = log?.symptomId?.startsWith('dien-') ||
      (log?.seizureData?.autonomicSymptoms && log?.seizureData?.autonomicSymptoms.length > 0);

  const isPsychomotorEpilepsyELM = log?.symptomId?.startsWith('psych-') ||
      log?.symptomId === 'seizure-psychomotor' ||
      (log?.seizureData?.automaticState !== null && log?.seizureData?.automaticState !== undefined) ||
      (log?.seizureData?.automatisms && log?.seizureData?.automatisms.length > 0);

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
        const isGenitourinaryRelated = !isPeripheralNerveSymptomELM && !isEndocrineSymptomELM && !isSkinConditionSymptomELM && (
            log?.symptomId?.includes('kidney') ||
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
            log?.genitourinaryData
        );

        // Phase 4: Gynecological detection
        const isGynecologicalRelated = !isEndocrineSymptomELM && (
            log?.symptomId?.includes('menstrual') ||
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
              'uterine-cramping'].includes(log?.symptomId)) ||
            log?.gynecologicalData;

        // Phase 5: Hemic/Lymphatic condition detection
        const isAnemiaRelated = [
              'fatigue-blood', 'weakness-blood', 'dizziness-anemia', 'shortness-breath-anemia',
              'pale-skin', 'cold-hands-feet', 'chest-pain-anemia', 'rapid-heartbeat', 'headache-anemia'
            ].includes(log?.symptomId) ||
            log?.anemiaData;

        const isSickleCellRelated = [
              'sickle-cell-crisis', 'bone-pain-sickle', 'joint-pain-sickle', 'chest-pain-sickle',
              'priapism', 'vision-changes-sickle', 'leg-ulcers'
            ].includes(log?.symptomId) ||
            log?.sickleCellData;

        const isBleedingDisorderRelated = [
              'easy-bruising', 'prolonged-bleeding', 'nosebleeds-frequent', 'bleeding-gums',
              'petechiae', 'heavy-menstrual-bleeding-blood', 'blood-in-urine', 'blood-in-stool'
            ].includes(log?.symptomId) ||
            log?.bleedingDisorderData;

        const isInfectionRelated = [
              'frequent-infections', 'recurring-infections', 'slow-healing-wounds',
              'fever-unexplained', 'night-sweats-blood', 'chills-blood'
            ].includes(log?.symptomId) ||
            log?.infectionData;

        const isLymphomaLeukemiaRelated = [
              'swollen-lymph-nodes', 'unexplained-weight-loss', 'loss-appetite',
              'bone-pain-leukemia', 'night-sweats-blood'
            ].includes(log?.symptomId) ||
            log?.lymphomaLeukemiaData;

        const isPolycythemiaRelated = [
              'itching-after-bathing', 'burning-hands-feet', 'redness-skin',
              'blurred-vision-blood', 'headache-polycythemia', 'tinnitus-blood', 'blood-clots'
            ].includes(log?.symptomId) ||
            log?.polycythemiaData;

        const isTreatmentRelated = [
              'nausea-chemo', 'vomiting-chemo', 'mouth-sores', 'hair-loss',
              'neuropathy-chemo', 'fatigue-chemo'
            ].includes(log?.symptomId) ||
            log?.treatmentData;

        const isB12DeficiencyRelated = [
              'numbness-tingling-b12', 'difficulty-walking', 'memory-problems-b12',
              'confusion-b12', 'tongue-problems'
            ].includes(log?.symptomId) ||
            log?.b12DeficiencyData;

        // Phase 6: HIV/AIDS detection
        const isHIVRelated = [
            'hiv-opportunistic-infection', 'hiv-night-sweats', 'hiv-persistent-fever',
            'hiv-weight-loss', 'hiv-chronic-diarrhea', 'hiv-oral-thrush', 'hiv-skin-lesions',
            'hiv-lymphadenopathy', 'hiv-fatigue', 'hiv-cognitive-impairment'
        ].includes(log?.symptomId) ||
        log?.hivData;

        // Phase 6: Hepatitis detection
        const isHepatitisRelated = [
            'hep-fatigue', 'hep-malaise', 'hep-nausea', 'hep-abdominal-pain',
            'hep-jaundice', 'hep-dark-urine', 'hep-appetite-loss', 'hep-joint-pain',
            'hep-cognitive-issues', 'hep-liver-tenderness'
        ].includes(log?.symptomId) ||
            log?.hepatitisData;

        // Phase 6: Lyme Disease detection
        const isLymeRelated = [
            'lyme-rash', 'lyme-fever', 'lyme-headache', 'lyme-fatigue',
            'lyme-joint-pain', 'lyme-muscle-aches', 'lyme-nerve-pain', 'lyme-cognitive',
            'lyme-heart-palpitations', 'lyme-facial-paralysis'
        ].includes(log?.symptomId) ||
            log?.lymeData;

        const isMalariaRelated = [
          'malaria-fever-spike', 'malaria-chills', 'malaria-sweating', 'malaria-headache',
          'malaria-muscle-pain', 'malaria-nausea', 'malaria-fatigue', 'malaria-jaundice',
          'malaria-anemia', 'malaria-enlarged-spleen'
        ].includes(log?.symptomId) ||
            log?.malariaData;

        const isBrucellosisRelated = [
          'brucellosis-fever', 'brucellosis-night-sweats', 'brucellosis-fatigue',
          'brucellosis-joint-pain', 'brucellosis-muscle-aches', 'brucellosis-headache',
          'brucellosis-back-pain', 'brucellosis-weight-loss', 'brucellosis-depression',
          'brucellosis-liver-spleen'
        ].includes(log?.symptomId) ||
            log?.brucellosisData;

        const isCampylobacterRelated = [
          'campylobacter-diarrhea', 'campylobacter-abdominal-pain', 'campylobacter-fever',
          'campylobacter-nausea', 'campylobacter-vomiting', 'campylobacter-bloody-stool',
          'campylobacter-fatigue', 'campylobacter-joint-pain', 'campylobacter-muscle-weakness',
          'campylobacter-nerve-symptoms'
        ].includes(log?.symptomId) ||
            log?.campylobacterData;

        const isQFeverRelated = [
          'q-fever-fever', 'q-fever-headache', 'q-fever-fatigue', 'q-fever-muscle-aches',
          'q-fever-cough', 'q-fever-chest-pain', 'q-fever-night-sweats', 'q-fever-chills',
          'q-fever-shortness-breath', 'q-fever-joint-pain'
        ].includes(log?.symptomId) ||
            log?.qFeverData;

        const isSalmonellaRelated = [
          'salmonella-diarrhea', 'salmonella-fever', 'salmonella-abdominal-cramps',
          'salmonella-nausea', 'salmonella-vomiting', 'salmonella-bloody-stool',
          'salmonella-joint-pain', 'salmonella-bacteremia', 'salmonella-dehydration',
          'salmonella-fatigue'
        ].includes(log?.symptomId) ||
            log?.salmonellaData;

        const isShigellaRelated = [
          'shigella-diarrhea', 'shigella-bloody-stool', 'shigella-abdominal-cramps',
          'shigella-fever', 'shigella-tenesmus', 'shigella-nausea', 'shigella-vomiting',
          'shigella-dehydration', 'shigella-reactive-arthritis', 'shigella-seizures'
        ].includes(log?.symptomId) ||
            log?.shigellaData;

        const isWestNileRelated = [
          'west-nile-fever', 'west-nile-headache', 'west-nile-body-aches',
          'west-nile-fatigue', 'west-nile-weakness', 'west-nile-cognitive',
          'west-nile-tremors', 'west-nile-vision-problems', 'west-nile-numbness',
          'west-nile-paralysis'
        ].includes(log?.symptomId) ||
            log?.westNileData;

        const isNTMRelated = [
          'ntm-cough', 'ntm-sputum', 'ntm-fatigue', 'ntm-fever',
          'ntm-night-sweats', 'ntm-weight-loss', 'ntm-chest-pain',
          'ntm-shortness-breath', 'ntm-hemoptysis', 'ntm-lymph-nodes'
        ].includes(log?.symptomId) ||
            log?.ntmData;

        // Phase 7: Dental/Oral detection
        // Exclude skin conditions that have 'oral' in name (e.g., acne-oral-antibiotics, hh-oral-medication)
        const isDentalOralRelated = !isSkinConditionSymptomELM && !isEyeConditionSymptomELM && !isEarConditionSymptomELM && (
            log?.symptomId?.includes('jaw') ||
            log?.symptomId?.includes('tooth') ||
            log?.symptomId?.includes('teeth') ||
            log?.symptomId?.includes('dental') ||
            log?.symptomId?.includes('oral') ||
            log?.symptomId?.includes('palate') ||
            log?.symptomId?.includes('gum') ||
            log?.symptomId?.includes('tongue') ||
            log?.symptomId?.includes('lip') ||
            log?.symptomId?.includes('mouth') ||
            log?.symptomId?.includes('chewing') ||
            log?.symptomId?.includes('mastication') ||
            log?.symptomId?.includes('swallowing') ||
            log?.symptomId?.includes('prosthesis') ||
            log?.symptomId?.includes('denture') ||
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
              'articulation-problems', 'prosthesis-pain', 'prosthesis-fit', 'prosthesis-sores'
            ].includes(log?.symptomId) ||
            log?.dentalData
        );


        // PHASE 8A: MENTAL HEALTH EXPANSION - DETECTION LOGIC
        const isIllnessAnxietyRelated = [
          'illness-anxiety-fear',
          'illness-anxiety-body-checking',
          'illness-anxiety-reassurance',
          'illness-anxiety-avoidance',
          'illness-anxiety-distress',
        ].includes(log?.symptomId);

        const isDepersonalizationRelated = [
          'depersonalization-detachment',
          'derealization-unreality',
          'depersonalization-robot',
          'depersonalization-distress',
        ].includes(log?.symptomId);

        const isCyclothymicRelated = [
          'cyclothymic-hypomanic',
          'cyclothymic-depressive',
          'cyclothymic-mood-swing',
          'cyclothymic-irritability',
        ].includes(log?.symptomId);

        // Eating Disorders - Need special forms
        const isAnorexiaRelated = [
          'anorexia-restricted-eating',
          'anorexia-weight-loss',
          'anorexia-fear-weight-gain',
          'anorexia-body-image',
          'anorexia-incapacitating-episode',
          'anorexia-hospitalization',
        ].includes(log?.symptomId);

        const isBulimiaRelated = [
          'bulimia-binge-eating',
          'bulimia-purging',
          'bulimia-compensatory',
          'bulimia-body-image',
          'bulimia-incapacitating-episode',
          'bulimia-hospitalization',
        ].includes(log?.symptomId);

  // PHASE 8B: ADDITIONAL MENTAL HEALTH CONDITIONS - DETECTION LOGIC

      // Schizophrenia Spectrum Disorders
        const _isSchizophreniaRelated = [
          'schizophrenia-hallucinations',
          'schizophrenia-delusions',
          'schizophrenia-disorganized-speech',
          'schizophrenia-disorganized-behavior',
          'schizophrenia-negative-symptoms',
        ].includes(log?.symptomId);

        const _isSchizoaffectiveRelated = [
          'schizophrenia-hallucinations',
          'schizophrenia-delusions',
          'schizoaffective-mood-episodes',
          'psychotic-episode',
        ].includes(log?.symptomId);

        const _isDelusionalDisorderRelated = [
          'schizophrenia-delusions',
          'psychotic-episode',
        ].includes(log?.symptomId);

        const _isPsychoticNOSRelated = [
          'psychotic-episode',
          'schizophrenia-hallucinations',
          'schizophrenia-delusions',
        ].includes(log?.symptomId);

        const _isBriefPsychoticRelated = [
          'brief-psychotic-episode',
          'schizophrenia-hallucinations',
          'schizophrenia-delusions',
        ].includes(log?.symptomId);

      // Binge Eating Disorder - Needs special form
        const isBingeEatingRelated = [
          'binge-eating-episode',
          'binge-eating-loss-of-control',
          'binge-eating-distress',
        ].includes(log?.symptomId);

      // Dissociative Disorders - Need special form
        const isDissociativeIdentityRelated = [
          'dissociative-identity-switching',
          'dissociative-amnesia-episode',
          'dissociative-fugue',
          'dissociative-time-loss',
        ].includes(log?.symptomId);

        const isDissociativeAmnesiaRelated = [
          'dissociative-amnesia-episode',
          'dissociative-fugue',
          'dissociative-time-loss',
        ].includes(log?.symptomId);

        const isDissociativeRelated = isDissociativeIdentityRelated || isDissociativeAmnesiaRelated;

      // Acute Stress Disorder - Needs special form
        const isAcuteStressRelated = [
          'acute-stress-intrusion',
          'acute-stress-avoidance',
          'acute-stress-arousal',
          'acute-stress-dissociation',
        ].includes(log?.symptomId);

      // Personality Disorders - Need special form
        const isAntisocialPersonalityRelated = [
          'personality-antisocial-behaviors',
          'personality-disorder-occupational-impairment',
          'personality-disorder-social-impairment',
        ].includes(log?.symptomId);

        const isBorderlinePersonalityRelated = [
          'personality-borderline-instability',
          'personality-borderline-fear-abandonment',
          'personality-borderline-self-harm',
          'personality-disorder-occupational-impairment',
          'personality-disorder-social-impairment',
        ].includes(log?.symptomId);

        const isNarcissisticPersonalityRelated = [
          'personality-narcissistic-grandiosity',
          'personality-narcissistic-lack-empathy',
          'personality-disorder-occupational-impairment',
          'personality-disorder-social-impairment',
        ].includes(log?.symptomId);

        const isAvoidantPersonalityRelated = [
          'personality-avoidant-social-inhibition',
          'personality-avoidant-fear-rejection',
          'personality-disorder-occupational-impairment',
          'personality-disorder-social-impairment',
        ].includes(log?.symptomId);

        const isPersonalityDisorderRelated =
            isAntisocialPersonalityRelated ||
            isBorderlinePersonalityRelated ||
            isNarcissisticPersonalityRelated ||
            isAvoidantPersonalityRelated;

        // Phase 9: Cardiovascular detection (including Phase 2A METs-based conditions)
        const isCardiacRelated = log?.symptomId?.startsWith('cardiac-') ||
            log?.symptomId?.startsWith('cardiomyopathy-') ||
            log?.symptomId?.startsWith('cad-') ||
            log?.symptomId?.startsWith('post-mi-') ||
            log?.symptomId?.startsWith('hhd-');

        const isArrhythmiaRelated = log?.symptomId?.startsWith('svt-') ||
            log?.symptomId?.startsWith('ventricular-arrhythmia-') ||
            log?.symptomId?.startsWith('arrhythmia-') ||
            log?.symptomId?.startsWith('aicd-');

        const isPericarditisRelated = log?.symptomId?.startsWith('pericarditis-');

        const isPostPhlebiticRelated = log?.symptomId?.startsWith('post-phlebitic-');

        const isCardiovascularRelated = isCardiacRelated || isArrhythmiaRelated ||
            isPericarditisRelated || isPostPhlebiticRelated;
        // Phase 10: Digestive condition detection
        const isCirrhosisRelated = log?.symptomId?.startsWith('cirrhosis-');
        const isGastritisRelated = log?.symptomId?.startsWith('gastritis-');
        const isPancreatitisRelated = log?.symptomId?.startsWith('pancreatitis-');
        const isBiliaryRelated = log?.symptomId?.startsWith('biliary-');
        const isDigestivePhase10Related = isCirrhosisRelated || isGastritisRelated ||
            isPancreatitisRelated || isBiliaryRelated;

        // ============================================
        // PHASE 1A: NEUROLOGICAL CONDITION DETECTION
        // ============================================
        const isMultipleSclerosisRelated = log?.symptomId?.startsWith('ms-') ||
            log?.category === 'Multiple Sclerosis Symptoms' ||
            log?.multipleSclerosisData;

        const isParkinsonsRelated = log?.symptomId?.startsWith('pd-') ||
            log?.category === "Parkinson's Disease Symptoms" ||
            log?.parkinsonsData;

        const isMyastheniaRelated = log?.symptomId?.startsWith('mg-') ||
            log?.category === 'Myasthenia Gravis Symptoms' ||
            log?.myastheniaData;

        const _isNeurologicalPhase1ARelated = isMultipleSclerosisRelated ||
            isParkinsonsRelated || isMyastheniaRelated;

        // ============================================
        // PHASE 1B: ADDITIONAL NEUROLOGICAL DETECTION
        // ============================================

        const isNarcolepsyRelated = log?.symptomId?.startsWith('narco-') ||
            log?.category === 'narcolepsy' ||
            log?.narcolepsyData;

        const isALSRelated = log?.symptomId?.startsWith('als-') ||
            log?.category === 'als' ||
            log?.alsData;

        const isSyringomyeliaRelated = log?.symptomId?.startsWith('syring-') ||
            log?.category === 'syringomyelia' ||
            log?.syringomyeliaData;

        const isMyelitisRelated = log?.symptomId?.startsWith('myel-') ||
            log?.category === 'myelitis' ||
            log?.myelitisData;

        const _isNeurologicalPhase1BRelated = isNarcolepsyRelated || isALSRelated ||
            isSyringomyeliaRelated || isMyelitisRelated;
        // ============================================
        // PHASE 3A: ENDOCRINE - THYROID & PARATHYROID DETECTION
        // ============================================
        const isHyperthyroidismRelated = log?.symptomId?.startsWith('hyper-') ||
            log?.symptomId?.startsWith('graves-') ||
            log?.category === 'hyperthyroidism';
        const isThyroiditisRelated = log?.symptomId?.startsWith('thyroiditis-') ||
            log?.category === 'thyroiditis';
        const isHyperparathyroidismRelated = log?.symptomId?.startsWith('hpth-') ||
            log?.category === 'hyperparathyroidism';
        const isHypoparathyroidismRelated = log?.symptomId?.startsWith('hopth-') ||
            log?.category === 'hypoparathyroidism';
        const _isEndocrinePhase3ARelated = isHyperthyroidismRelated || isThyroiditisRelated ||
            isHyperparathyroidismRelated || isHypoparathyroidismRelated;
        // Phase 3B: Adrenal & Pituitary Detection
        const isAddisonsDiseaseRelated = log?.symptomId?.startsWith('addisons-') ||
            log?.category === 'addisons-disease';
        const isCushingsSyndromeRelated = log?.symptomId?.startsWith('cushings-') ||
            log?.category === 'cushings-syndrome';
        const isDiabetesInsipidusRelated = log?.symptomId?.startsWith('di-') ||
            log?.category === 'diabetes-insipidus';
        const isHyperaldosteronismRelated = log?.symptomId?.startsWith('haldo-') ||
            log?.category === 'hyperaldosteronism';
        const _isEndocrinePhase3BRelated = isAddisonsDiseaseRelated || isCushingsSyndromeRelated ||
            isDiabetesInsipidusRelated || isHyperaldosteronismRelated;

        // ============================================
        // PHASE 1C: PERIPHERAL NERVE DETECTION
        // ============================================

        // Upper Extremity Nerves
        const isUpperRadicularRelated = log?.symptomId?.startsWith('uprn-') ||
            log?.category === 'upper-radicular-nerve';

        const isMiddleRadicularRelated = log?.symptomId?.startsWith('mdrn-') ||
            log?.category === 'middle-radicular-nerve';

        const isLowerRadicularRelated = log?.symptomId?.startsWith('lwrn-') ||
            log?.category === 'lower-radicular-nerve';

        const isAllRadicularRelated = log?.symptomId?.startsWith('alrn-') ||
            log?.category === 'all-radicular-nerve';

        const isRadialNerveRelated = log?.symptomId?.startsWith('radn-') ||
            log?.category === 'radial-nerve';

        const isMedianNerveRelated = log?.symptomId?.startsWith('medn-') ||
            log?.category === 'median-nerve';

        const isUlnarNerveRelated = log?.symptomId?.startsWith('ulnn-') ||
            log?.category === 'ulnar-nerve';

        const isMusculocutaneousNerveRelated = log?.symptomId?.startsWith('mscn-') ||
            log?.category === 'musculocutaneous-nerve';

        const isCircumflexNerveRelated = log?.symptomId?.startsWith('crcn-') ||
            log?.category === 'circumflex-nerve';

        const isLongThoracicNerveRelated = log?.symptomId?.startsWith('ltn-') ||
            log?.category === 'long-thoracic-nerve';

        // Lower Extremity Nerves
        const isSciaticNerveRelated = log?.symptomId?.startsWith('scin-') ||
            log?.category === 'sciatic-nerve';

        const isCommonPeronealNerveRelated = log?.symptomId?.startsWith('cpn-') ||
            log?.category === 'common-peroneal-nerve';

        const isSuperficialPeronealNerveRelated = log?.symptomId?.startsWith('spn-') ||
            log?.category === 'superficial-peroneal-nerve';

        const isDeepPeronealNerveRelated = log?.symptomId?.startsWith('dpn-') ||
            log?.category === 'deep-peroneal-nerve';

        const isTibialNerveRelated = log?.symptomId?.startsWith('tibn-') ||
            log?.category === 'tibial-nerve';

        const isPosteriorTibialNerveRelated = log?.symptomId?.startsWith('ptn-') ||
            log?.category === 'posterior-tibial-nerve';

        const isFemoralNerveRelated = log?.symptomId?.startsWith('femn-') ||
            log?.category === 'femoral-nerve';

        const isSaphenousNerveRelated = log?.symptomId?.startsWith('sapn-') ||
            log?.category === 'saphenous-nerve';

        const isObturatorNerveRelated = log?.symptomId?.startsWith('obtn-') ||
            log?.category === 'obturator-nerve';

        const isLateralFemoralCutaneousNerveRelated = log?.symptomId?.startsWith('lfcn-') ||
            log?.category === 'lateral-femoral-cutaneous-nerve';

        const isIlioinguinalNerveRelated = log?.symptomId?.startsWith('iin-') ||
            log?.category === 'ilioinguinal-nerve';

        // Combined detection flags
        const isUpperExtremityNerveRelated = isUpperRadicularRelated || isMiddleRadicularRelated ||
            isLowerRadicularRelated || isAllRadicularRelated || isRadialNerveRelated ||
            isMedianNerveRelated || isUlnarNerveRelated || isMusculocutaneousNerveRelated ||
            isCircumflexNerveRelated || isLongThoracicNerveRelated;

        const isLowerExtremityNerveRelated = isSciaticNerveRelated || isCommonPeronealNerveRelated ||
            isSuperficialPeronealNerveRelated || isDeepPeronealNerveRelated || isTibialNerveRelated ||
            isPosteriorTibialNerveRelated || isFemoralNerveRelated || isSaphenousNerveRelated ||
            isObturatorNerveRelated || isLateralFemoralCutaneousNerveRelated || isIlioinguinalNerveRelated;

        const isPeripheralNerveRelated = isUpperExtremityNerveRelated || isLowerExtremityNerveRelated ||
            log?.peripheralNerveData;


        const handleSave = () => {
          if (isMigraine && migraineData.prostrating === null) {
            alert('Please indicate if this migraine was prostrating');
            return;
          }

          const updates = {
            severity,
            notes: notes.trim(),
            occurredAt: occurredAt,
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
          // Phase 4C: Spine Data
          if (isSpineConditionRelated) updates.spineData = spineData;
          // PHASE 1E: Save Seizure data
          if (isSeizureRelated) updates.seizureData = seizureData;
          // Phase 3: Save genitourinary data
          if (isGenitourinaryRelated) updates.genitourinaryData = genitourinaryData;
          // PHASE 2: Add eye data
          if (isEyeRelated) updates.eyeData = { ...eyeData };
          // Phase 4: Save gynecological data
          if (isGynecologicalRelated) updates.gynecologicalData = gynecologicalData;
          // Phase 5: Add Hemic/Lymphatic Data
          if (isAnemiaRelated) updates.anemiaData = { ...anemiaData };
          if (isSickleCellRelated) updates.sickleCellData = { ...sickleCellData };
          if (isBleedingDisorderRelated) updates.bleedingDisorderData = { ...bleedingDisorderData };
          if (isInfectionRelated) updates.infectionData = { ...infectionData };
          if (isLymphomaLeukemiaRelated) updates.lymphomaLeukemiaData = { ...lymphomaLeukemiaData };
          if (isPolycythemiaRelated) updates.polycythemiaData = { ...polycythemiaData };
          if (isTreatmentRelated) updates.treatmentData = { ...treatmentData };
          if (isB12DeficiencyRelated) updates.b12DeficiencyData = { ...b12DeficiencyData };
          // Phase 6: Add HIV/AIDS data
          if (isHIVRelated) updates.hivData = { ...hivData };
          if (isHepatitisRelated) updates.hepatitisData = hepatitisData;
          if (isLymeRelated) updates.lymeData = { ...lymeData };
          if (isMalariaRelated) updates.malariaData = { ...malariaData };
          if (isBrucellosisRelated) updates.brucellosisData = { ...brucellosisData };
          if (isCampylobacterRelated) updates.campylobacterData = { ...campylobacterData };
          if (isQFeverRelated) updates.qFeverData = { ...qFeverData };
          if (isSalmonellaRelated) updates.salmonellaData = { ...salmonellaData };
          if (isShigellaRelated) updates.shigellaData = { ...shigellaData };
          if (isWestNileRelated) updates.westNileData = { ...westNileData };
          if (isNTMRelated) updates.ntmData = { ...ntmData };
          // Phase 7: Add Dental/Oral Data
          if (isDentalOralRelated) updates.dentalData = { ...dentalData };
          // PHASE 8A: MENTAL HEALTH EXPANSION - SAVE DATA
          if (isAnorexiaRelated || isBulimiaRelated) updates.eatingDisorderData = { ...eatingDisorderData };
          if (isAnxietyFormRelated) updates.anxietyFormData = { ...anxietyData };
          if (isDepressionFormRelated) updates.depressionFormData = { ...depressionData };
          if (isBipolarFormRelated) updates.bipolarFormData = { ...bipolarData };
          if (isOCDFormRelated) updates.ocdFormData = { ...ocdData };
          if (isAdjustmentDisorderFormRelated) updates.adjustmentDisorderData = { ...adjustmentDisorderData };
          // Phase 8B: Mental health data
          if (isBingeEatingRelated) updates.bingeEatingData = { ...bingeEatingData };
          if (isDissociativeRelated) {
            // Combine duration amount and unit into single string
            const duration = dissociativeData.durationAmount && dissociativeData.durationUnit
                ? `${dissociativeData.durationAmount} ${dissociativeData.durationUnit.toLowerCase()}`
                : '';
            updates.dissociativeData = {
              ...dissociativeData,
              duration // Keep the combined string for backward compatibility
            };
          }
          if (isAcuteStressRelated) updates.acuteStressData = { ...acuteStressData };
          if (isPersonalityDisorderRelated) updates.personalityData = { ...personalityData };
          // Phase 8A: Mental Health Expansion - Save additional data
          if (isSomaticSymptomRelated) updates.somaticData = { ...somaticSymptomData };
          if (isIllnessAnxietyRelated) updates.illnessAnxietyData = { ...illnessAnxietyData };
          if (isDepersonalizationRelated) updates.depersonalizationData = { ...depersonalizationData };
          if (isCyclothymicRelated) updates.cyclothymicData = { ...cyclothymicData };
          // Phase 9: Save cardiovascular data
          if (isCardiovascularRelated) {
            updates.cardiovascularData = { ...cardiovascularData };
          }
          // Phase 10: Save digestive data
          if (isDigestivePhase10Related) {
            updates.digestiveData = { ...digestiveData };
          }
          // Phase 1A: Save neurological data
          if (isMultipleSclerosisRelated) {
            updates.multipleSclerosisData = { ...multipleSclerosisData };
          }
          if (isParkinsonsRelated) {
            updates.parkinsonsData = { ...parkinsonsData };
          }
          if (isMyastheniaRelated) {
            updates.myastheniaData = { ...myastheniaData };
          }
          // Phase 1B: Save neurological data
          if (isNarcolepsyRelated) {
            updates.narcolepsyData = { ...narcolepsyData };
          }
          if (isALSRelated) {
            updates.alsData = { ...alsData };
          }
          if (isSyringomyeliaRelated) {
            updates.syringomyeliaData = { ...syringomyeliaData };
          }
          if (isMyelitisRelated) {
            updates.myelitisData = { ...myelitisData };
          }
          // Phase 1C: Save peripheral nerve data
          if (isPeripheralNerveRelated) {
            updates.peripheralNerveData = {
              ...peripheralNerveData,
              nerveLocation: isUpperExtremityNerveRelated ? 'upper' : 'lower',
            };
          }

          const result = updateSymptomLog(log.id, updates);

          if (result.success) {
            // Handle medication changes
            const existingMedIds = existingMedLogs.map(m => m.medicationId);
            const selectedMedIds = Object.keys(selectedMedications);

            // Delete removed medications
            existingMedLogs.forEach(medLog => {
              if (!selectedMedIds.includes(medLog.medicationId)) {
                deleteMedicationLog(medLog.id);
              }
            });

              // Add new medications (not previously logged)
// Single batchId for all meds in this edit so they group into one history card
              const batchId = `batch_${Date.now()}`;
              selectedMedIds.forEach(medId => {
                  if (!existingMedIds.includes(medId)) {
                      const med = medications.find(m => m.id === medId);
                      const medDetail = selectedMedications[medId];
                      if (med) {
                          const allSideEffects = [
                              ...(medDetail.sideEffects || []),
                              ...(medDetail.sideEffectsOther?.trim() ? [medDetail.sideEffectsOther.trim()] : []),
                          ];
                          logMedicationTaken({
                              medicationId: med.id,
                              medicationName: med.name,
                              dosage: getDosageForLog(med),
                              takenFor: log.symptomName,
                              symptomLogId: log.id,
                              effectiveness: medDetail.effectiveness || null,
                              sideEffects: allSideEffects.length > 0 ? allSideEffects : '',
                              occurredAt: occurredAt,
                              batchId,
                          });
                      }
                  } else {
                      // Update existing medication log with new effectiveness/sideEffects
                      const existingLog = existingMedLogs.find(m => m.medicationId === medId);
                      const medDetail = selectedMedications[medId];
                      if (existingLog && medDetail) {
                          const allSideEffects = [
                              ...(medDetail.sideEffects || []),
                              ...(medDetail.sideEffectsOther?.trim() ? [medDetail.sideEffectsOther.trim()] : []),
                          ];
                          // Delete and re-create to update effectiveness/sideEffects
                          deleteMedicationLog(existingLog.id);
                          const med = medications.find(m => m.id === medId);
                          if (med) {
                              logMedicationTaken({
                                  medicationId: med.id,
                                  medicationName: med.name,
                                  dosage: getDosageForLog(med),
                                  takenFor: log.symptomName,
                                  symptomLogId: log.id,
                                  effectiveness: medDetail.effectiveness || null,
                                  sideEffects: allSideEffects.length > 0 ? allSideEffects : '',
                                  occurredAt: occurredAt,
                                  batchId,
                              });
                          }
                      }
                  }
              });

            onSaved();
            onClose();
          } else {
            alert(result.message);
          }
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
                      <GIForm
                          key={log?.id}
                          initialData={giData}
                          onChange={(field, value) =>
                              setGIData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* Migraine Fields */}
                  {isMigraine && (
                      <MigraineForm
                          key={log?.id}
                          initialData={migraineData}
                          onChange={(fieldName, value) =>
                              setMigraineData(prev => ({ ...prev, [fieldName]: value }))
                          }
                      />
                  )}

                  {/* Sleep Fields */}
                  {isSleepRelated && (
                      <SleepForm
                          key={`sleep-${log?.id}`}
                          initialData={sleepData}
                          onChange={(field, value) =>
                              setSleepData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PTSD Fields */}
                  {isPTSDRelated && (
                      <PTSDForm
                          key={`ptsd-${log?.id}`}
                          initialData={ptsdData}
                          onChange={(fieldName, value) =>
                              setPtsdData(prev => ({ ...prev, [fieldName]: value }))
                          }
                      />
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1C: RESPIRATORY CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isRespiratoryRelated && (
                      <RespiratoryForm
                          key={log?.id}
                          initialData={respiratoryData}
                          onChange={(field, value) =>
                              setRespiratoryData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1D: JOINT/ROM CONDITION FIELDS */}
                  {/* ============================================ */}
                  {/* PHASE 1D: JOINT/ROM CONDITION FIELDS */}
                  {isJointRelated && (
                      <JointForm
                          key={`joint-${log?.id}`}
                          initialData={jointData}
                          onChange={(field, value) =>
                              setJointData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* Phase 4C: Spine Condition Form */}
                  {isSpineConditionRelated && (
                      <SpineForm
                          key={`spine-${log?.id}`}
                          initialData={spineData}
                          onChange={(field, value) =>
                              setSpineData(prev => ({ ...prev, [field]: value }))
                          }
                          selectedSymptom={log?.symptomId}
                      />
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1E: SEIZURE/EPISODE CONDITION FIELDS */}
                  {/* ============================================ */}
                  {isSeizureRelated && (
                      <SeizureForm
                          key={`seizure-${log?.id}`}
                          initialData={seizureData}
                          onChange={(field, value) =>
                              setSeizureData(prev => ({ ...prev, [field]: value }))
                          }
                          selectedSymptom={log?.symptomId}
                          showJacksonian={isJacksonianEpilepsyELM}
                          showDiencephalic={isDiencephalicEpilepsyELM}
                          showPsychomotor={isPsychomotorEpilepsyELM}
                      />
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
                      <PainForm
                          key={`pain-${log?.id}`}
                          initialData={painData}
                          onChange={(field, value) =>
                              setPainData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}


                  {/* Phase 3: Genitourinary Details */}
                  {isGenitourinaryRelated && (
                      <GenitourinaryForm
                          key={`gu-${log?.id}`}
                          initialData={genitourinaryData}
                          onChange={(field, value) =>
                              setGenitourinaryData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* Phase 4: Gynecological Conditions Forms */}
                  {isGynecologicalRelated && (
                      <GynecologicalForm
                          key={`gyn-${log?.id}`}
                          initialData={gynecologicalData}
                          onChange={(field, value) =>
                              setGynecologicalData(prev => ({ ...prev, [field]: value }))
                          }
                          selectedSymptom={log?.symptomId}
                      />
                  )}

                  {/* Phase 5: Anemia Form */}
                  {isAnemiaRelated && (
                        <AnemiaForm
                            key={`anemia-${log?.id}`}
                            initialData={anemiaData}
                            onChange={(field, value) =>
                                setAnemiaData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isSickleCellRelated && (
                        <SickleCellForm
                            key={`sickle-${log?.id}`}
                            initialData={sickleCellData}
                            onChange={(field, value) =>
                                setSickleCellData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isBleedingDisorderRelated && (
                        <BleedingDisorderForm
                            key={`bleeding-${log?.id}`}
                            initialData={bleedingDisorderData}
                            onChange={(field, value) =>
                                setBleedingDisorderData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isInfectionRelated && (
                      <InfectionForm
                          key={`infection-${log?.id}`}
                          initialData={infectionData}
                          onChange={(field, value) =>
                              setInfectionData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isLymphomaLeukemiaRelated && (
                      <LymphomaLeukemiaForm
                          key={`lymphoma-${log?.id}`}
                          initialData={lymphomaLeukemiaData}
                          onChange={(field, value) =>
                              setLymphomaLeukemiaData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isPolycythemiaRelated && (
                      <PolycythemiaForm
                          key={`polycythemia-${log?.id}`}
                          initialData={polycythemiaData}
                          onChange={(field, value) =>
                              setPolycythemiaData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isTreatmentRelated && (
                      <TreatmentForm
                          key={`treatment--${log?.id}`}
                          initialData={treatmentData}
                          onChange={(field, value) =>
                              setTreatmentData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isB12DeficiencyRelated && (
                      <B12DeficiencyForm
                          key={`b12-${log?.id}`}
                          initialData={b12DeficiencyData}
                          onChange={(field, value) =>
                              setB12DeficiencyData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isHIVRelated && (
                      <>
                        <WhyTrackThis symptomId={log?.symptomId} category="hiv-aids" />
                        <HIVForm
                            key={`hiv-${log?.id}`}
                            initialData={hivData}
                            onChange={(field, value) => setHivData(prev => ({ ...prev, [field]: value }))}
                            selectedSymptom={log?.symptomId}
                        />
                      </>
                  )}
                  {isHepatitisRelated && (
                      <>
                        <WhyTrackThis symptomId={log?.symptomId} category="hepatitis" />
                        <HepatitisForm
                            key={`hepatitis-${log?.id}`}
                            initialData={hepatitisData}
                            onChange={(field, value) => setHepatitisData(prev => ({ ...prev, [field]: value }))}
                        />
                      </>
                  )}
                  {isLymeRelated && (
                      <>
                        <WhyTrackThis symptomId={log?.symptomId} category="lyme-disease" />
                        <LymeForm
                            key={`lyme-${log?.id}`}
                            initialData={lymeData}
                            onChange={(field, value) => setLymeData(prev => ({ ...prev, [field]: value }))}
                            selectedSymptom={log?.symptomId}
                        />
                      </>
                  )}
                  {isMalariaRelated && (<MalariaForm key={`malaria-${log?.id}`} initialData={malariaData} onChange={(field, value) => setMalariaData(prev => ({ ...prev, [field]: value }))} selectedSymptom={log?.symptomId} />)}
                  {isBrucellosisRelated && (<BrucellosisForm key={`brucellosis-${log?.id}`} initialData={brucellosisData} onChange={(field, value) => setBrucellosisData(prev => ({ ...prev, [field]: value }))} />)}
                  {isCampylobacterRelated && (<CampylobacterForm key={`campylobacter-${log?.id}`} initialData={campylobacterData} onChange={(field, value) => setCampylobacterData(prev => ({ ...prev, [field]: value }))} />)}
                  {isQFeverRelated && (<QFeverForm key={`qfever-${log?.id}`} initialData={qFeverData} onChange={(field, value) => setQFeverData(prev => ({ ...prev, [field]: value }))} />)}
                  {isSalmonellaRelated && (<SalmonellaForm key={`salmonella-${log?.id}`} initialData={salmonellaData} onChange={(field, value) => setSalmonellaData(prev => ({ ...prev, [field]: value }))} />)}
                  {isShigellaRelated && (<ShigellaForm key={`shigella-${log?.id}`} initialData={shigellaData} onChange={(field, value) => setShigellaData(prev => ({ ...prev, [field]: value }))} />)}
                  {isWestNileRelated && (<WestNileForm key={`westnile-${log?.id}`} initialData={westNileData} onChange={(field, value) => setWestNileData(prev => ({ ...prev, [field]: value }))} />)}
                  {isNTMRelated && (<NTMForm key={`ntm-${log?.id}`} initialData={ntmData} onChange={(field, value) => setNtmData(prev => ({ ...prev, [field]: value }))} />)}

                  {/* Phase 7: Dental/Oral Conditions Form */}
                  {isDentalOralRelated && (
                      <DentalForm
                          key={`dental-${log?.id}`}
                          initialData={dentalData}
                          onChange={(field, value) =>
                              setDentalData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PHASE 8A EXTENDED: ANXIETY DISORDERS FORM */}
                  {isAnxietyFormRelated && (
                      <AnxietyForm
                          key={log?.id}
                          initialData={anxietyData}
                          onChange={(fieldName, value) =>
                              setAnxietyData(prev => ({ ...prev, [fieldName]: value }))
                          }
                      />
                  )}

                  {/* ============================================
                  PHASE 8A EXTENDED: DEPRESSION FORM
                  ============================================ */}
                  {(isAnorexiaRelated || isBulimiaRelated) && (
                      <EatingDisorderForm
                          key={log?.id}
                          initialData={eatingDisorderData}
                          isAnorexia={isAnorexiaRelated}
                          isBulimia={isBulimiaRelated}
                          onChange={(field, value) =>
                              setEatingDisorderData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                    {isDepressionFormRelated && (
                        <DepressionForm
                            key={log?.id}
                            initialData={depressionData}
                            onChange={(field, value) =>
                                setDepressionData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                    )}

                  {isBipolarFormRelated && (
                        <BipolarForm
                            key={log?.id}
                            initialData={bipolarData}
                            onChange={(field, value) =>
                                setBipolarData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isOCDFormRelated && (
                        <OCDForm
                            key={log?.id}
                            initialData={ocdData}
                            onChange={(field, value) =>
                                setOcdData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isAdjustmentDisorderFormRelated && (
                        <AdjustmentDisorderForm
                            key={log?.id}
                            initialData={adjustmentDisorderData}
                            onChange={(field, value) =>
                                setAdjustmentDisorderData(prev => ({ ...prev, [field]: value }))
                            }
                        />
                  )}

                  {isBingeEatingRelated && (
                      <BingeEatingForm
                          key={log?.id}
                          initialData={bingeEatingData}
                          onChange={(field, value) =>
                              setBingeEatingData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {isDissociativeRelated && (
                      <DissociativeForm
                          key={log?.id}
                          initialData={dissociativeData}
                          onChange={(field, value) =>
                              setDissociativeData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* Phase 8B: Acute Stress Disorder Form */}
                  {isAcuteStressRelated && (
                      <AcuteStressForm
                          key={log?.id}
                          initialData={acuteStressData}
                          onChange={(field, value) =>
                              setAcuteStressData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* Phase 8B: Personality Disorders Form */}
                  {isPersonalityDisorderRelated && (
                      <PersonalityDisorderForm
                          key={log?.id}
                          initialData={personalityData}
                          onChange={(field, value) =>
                              setPersonalityData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PHASE 8A: SOMATIC SYMPTOM DISORDER FORM */}
                  {isSomaticSymptomRelated && (
                      <SomaticSymptomForm
                          key={log?.id}
                          initialData={somaticSymptomData}
                          onChange={(field, value) =>
                              setSomaticSymptomData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PHASE 8A: ILLNESS ANXIETY DISORDER FORM */}
                  {isIllnessAnxietyRelated && (
                      <IllnessAnxietyForm
                          key={log?.id}
                          initialData={illnessAnxietyData}
                          onChange={(field, value) =>
                              setIllnessAnxietyData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PHASE 8A: DEPERSONALIZATION/DEREALIZATION FORM */}
                  {isDepersonalizationRelated && (
                      <DepersonalizationForm
                          key={log?.id}
                          initialData={depersonalizationData}
                          onChange={(field, value) =>
                              setDepersonalizationData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                  {/* PHASE 8A: CYCLOTHYMIC DISORDER FORM */}
                  {isCyclothymicRelated && (
                      <CyclothymicForm
                          key={log?.id}
                          initialData={cyclothymicData}
                          onChange={(field, value) =>
                              setCyclothymicData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}


                  {/* Phase 9: Cardiovascular Form */}
                  {isCardiovascularRelated && (
                      <CardiovascularForm
                          key={`cardiovascular-${log?.id}`}
                          initialData={cardiovascularData}
                          onChange={(field, value) =>
                              setCardiovascularData(prev => ({ ...prev, [field]: value }))
                          }
                          selectedSymptom={log?.symptomId}
                      />
                  )}

                  {/* Phase 10: Digestive Form */}
                  {isDigestivePhase10Related && (
                      <DigestiveForm
                          key={`digestive-${log?.id}`}
                          initialData={digestiveData}
                          onChange={(field, value) =>
                              setDigestiveData(prev => ({ ...prev, [field]: value }))
                          }
                          selectedSymptom={log?.symptomId}
                      />
                  )}

                  {/* ============================================ */}
                  {/* PHASE 1A: NEUROLOGICAL CONDITION FORMS */}
                  {/* ============================================ */}
                  {isMultipleSclerosisRelated && (
                      <MultipleSclerosisForm
                          key={log?.id}
                          initialData={multipleSclerosisData}
                          selectedSymptom={log?.symptomId}
                          onChange={(field, value) =>
                              setMultipleSclerosisData(prev => ({ ...prev, [field]: value }))
                          }
                      />
                  )}

                {isParkinsonsRelated && (
                  <ParkinsonsForm
                  key={log?.id}
                  initialData={parkinsonsData}
                  selectedSymptom={log?.symptomId}
                  onChange={(field, value) =>
                      setParkinsonsData(prev => ({ ...prev, [field]: value }))
                  }
                />
                )}

                {isMyastheniaRelated && (
                <MyastheniaForm
                    key={log?.id}
                    initialData={myastheniaData}
                    selectedSymptom={log?.symptomId}
                    onChange={(field, value) =>
                        setMyastheniaData(prev => ({ ...prev, [field]: value }))
                    }
                />
                )}

                {isNarcolepsyRelated && (
                <NarcolepsyForm
                    key={log?.id}
                    initialData={narcolepsyData}
                    selectedSymptom={log?.symptomId}
                    onChange={(field, value) =>
                        setNarcolepsyData(prev => ({ ...prev, [field]: value }))
                    }
                />
                )}

                {isALSRelated && (
                <ALSForm
                    key={log?.id}
                    initialData={alsData}
                    selectedSymptom={log?.symptomId}
                    onChange={(field, value) =>
                        setAlsData(prev => ({ ...prev, [field]: value }))
                    }
                />
                )}

                {isSyringomyeliaRelated && (
                <SyringomyeliaForm
                    key={log?.id}
                    initialData={syringomyeliaData}
                    selectedSymptom={log?.symptomId}
                    onChange={(field, value) =>
                        setSyringomyeliaData(prev => ({ ...prev, [field]: value }))
                    }
                />
                )}

                {isMyelitisRelated && (
                <MyelitisForm
                    key={log?.id}
                    initialData={myelitisData}
                    selectedSymptom={log?.symptomId}
                    onChange={(field, value) =>
                        setMyelitisData(prev => ({ ...prev, [field]: value }))
                    }
                />
                )}

                  {/* ============================================ */}
                  {/* PHASE 1C: PERIPHERAL NERVE FORM */}
                  {/* ============================================ */}
                  {isPeripheralNerveRelated && (
                      <PeripheralNerveForm
                          key={`peripheral-${log?.id}`}
                          initialData={peripheralNerveData}
                          onChange={(field, value) =>
                              setPeripheralNerveData(prev => ({ ...prev, [field]: value }))
                          }
                          isUpperExtremityNerveRelated={isUpperExtremityNerveRelated}
                      />
                  )}

                  {/* Medications */}
                  {medications.length > 0 && (
                      <div
                          className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                        <h3 className="font-medium text-teal-900 dark:text-teal-200 mb-3">Medications
                          Taken</h3>
                        <div className="space-y-2">
                          {medications.filter(m => m.isActive).map(med => {
                            const isSelected = !!selectedMedications[med.id];
                            return (
                                <div key={med.id}>
                                  <label
                                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                          isSelected
                                              ?
                                              'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                              :
                                              'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                      }`}>
                                    <input type="checkbox"
                                           checked={isSelected}
                                           onChange={(e) => {
                                             if (e.target.checked) {
                                               setSelectedMedications(prev => ({ ...prev, [med.id]: getDefaultMedDetail() }));
                                             } else {
                                               setSelectedMedications(prev => {
                                                 const next = { ...prev };
                                                 delete next[med.id];
                                                 return next;
                                               });
                                             }
                                           }}
                                           className="w-4 h-4 text-teal-600 rounded"/>
                                    <span
                                        className="text-sm text-gray-700 dark:text-gray-300">{med.name} ({formatDosage(med)})</span>
                                  </label>
                                  {/* Inline effectiveness & side effects for this medication */}
                                  {isSelected && (
                                      <MedicationEffectivenessInline
                                          medDetail={selectedMedications[med.id]}
                                          onChange={(updated) => setSelectedMedications(prev => ({ ...prev, [med.id]: updated }))}
                                      />
                                  )}
                                </div>
                            );
                          })}
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

                {/* Occurrence Time Picker */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <OccurrenceTimePicker
                      value={occurredAt}
                      onChange={setOccurredAt}
                      label="When did this occur?"
                  />
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