import { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  sortedSymptomCategories,
  BODY_SYSTEMS,
  getBodySystemList,
  getBodySystem,
  stripDCCode,
  searchSymptoms,
  getRelatedConditions,
} from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom, getMedications, logMedicationTaken } from '../utils/storage';
import { getProfileType, PROFILE_TYPES } from '../utils/profile';
import { getDefaultMedDetail, getDosageForLog } from '../utils/medicationUtils';
import OccurrenceTimePicker from './OccurrenceTimePicker.jsx';
import QuickLog from './QuickLog';
import AddChronicModal from './AddChronicModal';
import WhyTrackThis from './WhyTrackThis.jsx';
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

const SymptomLogger = ({ onLogSaved, prefillData, onPrefillUsed, onNavigate }) => {
  const [stressLevel, setStressLevel] = useState(5);
  const [weather, setWeather] = useState('');
  // Check if user is a veteran for VA-specific features
  const isVeteran = getProfileType() === PROFILE_TYPES.VETERAN;
  // Body System / Category / Symptom selection state
  const [selectedBodySystem, setSelectedBodySystem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [, setSymptomName] = useState('');
  // Search mode state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Related conditions suggestions
  const [showRelatedConditions, setShowRelatedConditions] = useState(true);
  const searchInputRef = useRef(null);
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString());
  const [showSuccess, setShowSuccess] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState(() => getCustomSymptoms());
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
  const [medications, setMedications] = useState(() => getMedications());
  const [tookMedication, setTookMedication] = useState(false);
  // Object keyed by medication ID: { [medId]: { effectiveness, sideEffects, sideEffectsOther } }
  const [selectedMedications, setSelectedMedications] = useState({});

  // **********************************
  // * Field Area
  // **********************************
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
  const [jointData, setJointData] = useState({ ...INITIAL_JOINT_DATA });
  // ============================================
  // PHASE 4C: SPINE CONDITION-SPECIFIC FIELDS
  // DC 5235, 5236, 5238, 5240, 5241
  // ============================================
  const [spineData, setSpineData] = useState({ ...INITIAL_SPINE_DATA });
  const [seizureData, setSeizureData] = useState({ ...INITIAL_SEIZURE_DATA });
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
  // PHASE 8A EXTENDED: CONDITION-SPECIFIC MENTAL HEALTH FORMS
  // Form 1: Anxiety Disorders — shape owned by AnxietyForm, imported via INITIAL_ANXIETY_DATA
  const [anxietyData, setAnxietyData] = useState({ ...INITIAL_ANXIETY_DATA });

  // ── Mental health conditions — shapes owned by MentalHealthForm.jsx ─────────
  const [eatingDisorderData, setEatingDisorderData] = useState({ ...INITIAL_EATING_DISORDER_DATA });
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

  // Phase 10: Digestive system data (cirrhosis, gastritis, pancreatitis, biliary)
  const [digestiveData, setDigestiveData] = useState({ ...INITIAL_DIGESTIVE_DATA });

  // ── Neurological conditions — shapes owned by NeurologicalForm.jsx ──────────
  // ============================================
  // PHASE 1A: NEUROLOGICAL STATE
  // ============================================
  const [multipleSclerosisData, setMultipleSclerosisData] = useState({ ...INITIAL_MULTIPLE_SCLEROSIS_DATA });
  const [parkinsonsData, setParkinsonsData] = useState({ ...INITIAL_PARKINSONS_DATA });
  const [myastheniaData, setMyastheniaData] = useState({ ...INITIAL_MYASTHENIA_DATA });

  // ============================================
  // PHASE 1B: ADDITIONAL NEUROLOGICAL STATE
  // ============================================
  const [narcolepsyData, setNarcolepsyData] = useState({ ...INITIAL_NARCOLEPSY_DATA });
  const [alsData, setAlsData] = useState({ ...INITIAL_ALS_DATA });
  const [syringomyeliaData, setSyringomyeliaData] = useState({ ...INITIAL_SYRINGOMYELIA_DATA });
  const [myelitisData, setMyelitisData] = useState({ ...INITIAL_MYELITIS_DATA });


  // ============================================
  // PHASE 1C: PERIPHERAL NERVE DATA
  // DC 8510-8530 (Paralysis), 8610-8630 (Neuritis), 8710-8730 (Neuralgia)
  // ============================================
  const [peripheralNerveData, setPeripheralNerveData] = useState({ ...INITIAL_PERIPHERAL_NERVE_DATA });

  // Phase 1H - Track processed prefillData to avoid re-processing
  const processedPrefillId = useRef(null);
  const isPrefilling = useRef(false);

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
        // Set body system first for 3-level dropdown
        const bodySystem = getBodySystem(categoryInfo.name);
        console.log('Setting body system:', bodySystem);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedBodySystem(bodySystem);
        // Use the category ID (not name) for the dropdown
        console.log('Setting category ID:', categoryInfo.id);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCategory(categoryInfo.id);
        setSelectedSymptom(prefillData.symptomId);
        console.log(selectedSymptom)
      } else {
        // Fallback: try to find category by name
        const fallbackCategory = sortedSymptomCategories.find(cat =>
            cat.name === prefillData.category
        );
        if (fallbackCategory) {
          // Set body system first for 3-level dropdown
          const bodySystem = getBodySystem(fallbackCategory.name);
          console.log('Using fallback - setting body system:', bodySystem);
          setSelectedBodySystem(bodySystem);
          console.log('Using fallback - setting category ID:', fallbackCategory.id);
          setSelectedCategory(fallbackCategory.id);
          setSelectedSymptom(prefillData.symptomId);
          console.log(selectedSymptom)
        } else {
          console.warn('Could not find category for symptom:', prefillData.symptomId);
        }
      }
      // Set universal fields
      setSeverity(prefillData.severity || 5);
      setNotes(prefillData.notes || '');
      setIsFlareUp(prefillData.isFlareUp || false);
      setDuration(prefillData.duration || '');
      setTimeOfDay(prefillData.timeOfDay || '');
      // Set condition-specific data
      if (prefillData.migraineData) {
        setMigraineData({ ...prefillData.migraineData });
      }
      if (prefillData.sleepData) {
        setSleepData({ ...prefillData.sleepData });
      }
      if (prefillData.ptsdData) {
        setPtsdData({ ...prefillData.ptsdData });
      }
      if (prefillData.painData) {
        setPainData({ ...prefillData.painData });
      }
      if (prefillData.giData) {
        setGIData({ ...prefillData.giData });
      }
      if (prefillData.respiratoryData) {
        setRespiratoryData({ ...prefillData.respiratoryData });
      }
      if (prefillData.jointData) {
        setJointData({ ...prefillData.jointData });
      }
      if (prefillData.spineData) {
        setSpineData({ ...prefillData.spineData });
      }
      if (prefillData.seizureData) {
        setSeizureData({ ...prefillData.seizureData });
      }
      if (prefillData.eyeData) {
        setEyeData({ ...prefillData.eyeData });
      }
      if (prefillData.genitourinaryData) {
        setGenitourinaryData({ ...prefillData.genitourinaryData });
      }
      if (prefillData.gynecologicalData) {
        setGynecologicalData({ ...prefillData.gynecologicalData });
      }
      // Phase 5: Hemic/Lymphatic prefills
      if (prefillData.anemiaData) {
        setAnemiaData({ ...prefillData.anemiaData });
      }
      if (prefillData.sickleCellData) {
        setSickleCellData({ ...prefillData.sickleCellData });
      }
      if (prefillData.bleedingDisorderData) {
        setBleedingDisorderData({ ...prefillData.bleedingDisorderData });
      }
      if (prefillData.infectionData) {
        setInfectionData({ ...prefillData.infectionData });
      }
      if (prefillData.lymphomaLeukemiaData) {
        setLymphomaLeukemiaData({ ...prefillData.lymphomaLeukemiaData });
      }
      if (prefillData.polycythemiaData) {
        setPolycythemiaData({ ...prefillData.polycythemiaData });
      }
      if (prefillData.treatmentData) {
        setTreatmentData({ ...prefillData.treatmentData });
      }
      if (prefillData.b12DeficiencyData) {
        setB12DeficiencyData({ ...prefillData.b12DeficiencyData });
      }
      if (prefillData.dentalData) {
        setDentalData({...prefillData.dentalData});
      }
      if (prefillData.hivData) {
        setHivData({ ...prefillData.hivData });
      }
      if (prefillData.hepatitisData) {
        setHepatitisData({ ...prefillData.hepatitisData });
      }
      if (prefillData.lymeData) {
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
      // Phase 9: Cardiovascular prefills
      if (prefillData.cardiovascularData) {
        setCardiovascularData(prefillData.cardiovascularData);
      }
      // Phase 10: Digestive prefills
      if (prefillData.digestiveData) {
        setDigestiveData(prefillData.digestiveData);
      }
      // Phase 11:

      // Phase 1A: Include neurological data
      if (prefillData.multipleSclerosisData) {
        setMultipleSclerosisData(prefillData.multipleSclerosisData);
      }
      if (prefillData.parkinsonsData) {
        setParkinsonsData(prefillData.parkinsonsData);
      }
      if (prefillData.myastheniaData) {
        setMyastheniaData(prefillData.myastheniaData);
      }
      // Phase 1B: Include neurological data
      if (prefillData.narcolepsyData) {
        setNarcolepsyData(prefillData.narcolepsyData);
      }
      if (prefillData.alsData) {
        setAlsData(prefillData.alsData);
      }
      if (prefillData.syringomyeliaData) {
        setSyringomyeliaData(prefillData.syringomyeliaData);
      }
      if (prefillData.myelitisData) {
        setMyelitisData(prefillData.myelitisData);
      }
      // Phase 1C: Include peripheral nerve data
      if (prefillData.peripheralNerveData) {
        setPeripheralNerveData(prefillData.peripheralNerveData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillData, onPrefillUsed]);


  // Peripheral nerve prefixes to exclude from generic pain/GU detection
  const peripheralNervePrefixes = ['uprn-', 'mdrn-', 'lwrn-', 'alrn-', 'radn-', 'medn-', 'ulnn-',
    'mscn-', 'crcn-', 'ltn-', 'scin-', 'cpn-', 'spn-', 'dpn-', 'tibn-', 'ptn-', 'femn-',
    'sapn-', 'obtn-', 'lfcn-', 'iin-'];
  const isPeripheralNerveSymptom = peripheralNervePrefixes.some(prefix => selectedSymptom?.startsWith(prefix));

  // Phase 3A: Endocrine prefixes to exclude from generic pain/GU detection
  const endocrinePrefixes = ['hyper-', 'graves-', 'thyroiditis-', 'hpth-', 'hopth-', 'hypo-',
    'addisons-', 'cushings-', 'di-', 'haldo-'];
  const isEndocrineSymptom = endocrinePrefixes.some(prefix => selectedSymptom?.startsWith(prefix));

  // Phase 4D: Exclude foot condition symptoms from pain detection
  const isFootConditionSymptom = (
      selectedSymptom?.startsWith('wf-') ||
      selectedSymptom?.startsWith('cf-') ||
      selectedSymptom?.startsWith('mt-') ||
      selectedSymptom?.startsWith('hv-') ||
      selectedSymptom?.startsWith('hr-')
  );

  // Phase 5A: Exclude hernia and adhesion symptoms from pain detection
  const isHerniaOrAdhesionSymptom = (
      selectedSymptom?.startsWith('hernia-') ||
      selectedSymptom?.startsWith('pa-')
  );
  // Phase 5B: Exclude esophageal and post-surgical digestive symptoms from pain detection
  const isDigestivePhase5BSymptom = (
      selectedSymptom?.startsWith('es-') ||
      selectedSymptom?.startsWith('esp-') ||
      selectedSymptom?.startsWith('pgs-') ||
      selectedSymptom?.startsWith('if-')
  );

  // Phase 6A: Exclude skin condition symptoms from dental/oral detection
  const isSkinConditionSymptom = (
      selectedSymptom?.startsWith('acne-') ||
      selectedSymptom?.startsWith('chloracne-') ||
      selectedSymptom?.startsWith('aa-') ||
      selectedSymptom?.startsWith('hh-') ||
      // Phase 6B additions
      selectedSymptom?.startsWith('dle-') ||
      selectedSymptom?.startsWith('bullous-') ||
      selectedSymptom?.startsWith('cv-') ||
      selectedSymptom?.startsWith('derm-') ||
      selectedSymptom?.startsWith('skinf-')
  );

  // Phase 7A: Eye condition detection (for form exclusions)
  const isEyeConditionSymptom = (
      selectedSymptom?.startsWith('uveitis-') ||
      selectedSymptom?.startsWith('keratitis-') ||
      selectedSymptom?.startsWith('conj-') ||
      selectedSymptom?.startsWith('scleritis-')
  );

  // Phase 7B: Ear condition prefixes for exclusion from Pain Details form
  const isEarConditionSymptom = (
      selectedSymptom?.startsWith('vest-') ||
      selectedSymptom?.startsWith('csom-') ||
      selectedSymptom?.startsWith('coe-') ||
      selectedSymptom?.startsWith('cnsom-')
  );

  // Determine which special form to show - EXPANDED DETECTION
  const isMigraineSelected = selectedSymptom === 'migraine';

  // Sleep: match sleep-related symptoms only
  const isSleepSelected = !isEndocrineSymptom && (
      selectedSymptom === 'sleep-issues' ||
      selectedSymptom === 'sleep-quality' ||
      selectedSymptom?.includes('insomnia')
  );

  const isNightmareSelected = selectedSymptom === 'nightmares' ||
      selectedSymptom === 'ptsd-nightmare';

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

  // Somatic Symptom Disorders
  const isSomaticSymptomRelated = [
    'somatic-pain',
    'somatic-excessive-worry',
    'somatic-multiple-symptoms',
    'somatic-doctor-visits',
    'somatic-functional-impairment',
  ].includes(selectedSymptom);

  const isPainSelected = !isPeripheralNerveSymptom && !isEndocrineSymptom && !isFootConditionSymptom && !isHerniaOrAdhesionSymptom &&
      !isDigestivePhase5BSymptom &&  !isEyeConditionSymptom && !isEarConditionSymptom && !isSomaticSymptomRelated && (
      selectedSymptom?.includes('pain') ||
      selectedSymptom?.includes('-ache') ||
      selectedSymptom?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedSymptom?.includes(term))
  );

  // Phase 1B: GI condition detection - match IBS, GERD, and future GI conditions
  const isGISelected = selectedSymptom?.startsWith('ibs') ||
      selectedSymptom?.startsWith('gerd') ||
      selectedSymptom?.startsWith('uc-') ||
      selectedSymptom?.startsWith('ulcer-') ||
      selectedSymptom?.startsWith('hemorrhoid') ||
      selectedSymptom?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedSymptom);

  // Phase 1C: Respiratory condition detection - asthma, COPD, sleep apnea, etc.
  // Phase 11: Added bronchiectasis, pulmonary fibrosis, sarcoidosis
  const isRespiratorySelected = selectedSymptom?.startsWith('asthma-') ||
      selectedSymptom?.startsWith('copd-') ||
      selectedSymptom?.startsWith('apnea-') ||
      selectedSymptom?.startsWith('emphysema-') ||
      selectedSymptom?.startsWith('bronchitis-') ||
      selectedSymptom?.startsWith('bronchiectasis-') ||
      selectedSymptom?.startsWith('pf-') ||
      selectedSymptom?.startsWith('sarcoid-') ||
      selectedSymptom?.includes('breathing') ||
      selectedSymptom?.includes('wheez') ||
      selectedSymptom?.includes('cough') ||
      ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(selectedSymptom);


  // Phase 1D: Joint/ROM detection - shoulder, knee, hip, ankle, elbow, wrist conditions
  // Phase 4A: Added gout-, bursitis-, tendinitis prefixes
  // Phase 4B: Selective detection - only joint-related symptoms, not systemic ones
  // Systemic symptoms (fatigue, fever, weight-loss, anemia, constitutional) should NOT show Joint & ROM
  const isSystemicSymptom = selectedSymptom?.includes('-fatigue') ||
      selectedSymptom?.includes('-fever') ||
      selectedSymptom?.includes('-weight-loss') ||
      selectedSymptom?.includes('-anemia') ||
      selectedSymptom?.includes('-constitutional') ||
      selectedSymptom?.includes('-malaise');

  // Phase 4C: Exclude spine symptoms from joint detection
  const isSpineSymptom = (
      selectedSymptom?.startsWith('vfx-') ||
      selectedSymptom?.startsWith('si-') ||
      selectedSymptom?.startsWith('ss-') ||
      selectedSymptom?.startsWith('as-') ||
      selectedSymptom?.startsWith('sf-')
  );

  const isJointSelected = !isSystemicSymptom && !isSpineSymptom && (
      selectedSymptom?.startsWith('shoulder-') ||
      selectedSymptom?.startsWith('knee-') ||
      selectedSymptom?.startsWith('hip-') ||
      selectedSymptom?.startsWith('ankle-') ||
      selectedSymptom?.startsWith('elbow-') ||
      selectedSymptom?.startsWith('wrist-') ||
      selectedSymptom?.startsWith('hand-') ||
      selectedSymptom?.startsWith('finger-') ||
      selectedSymptom?.startsWith('foot-') ||
      selectedSymptom?.startsWith('toe-') ||
      selectedSymptom?.startsWith('gout-') ||
      selectedSymptom?.startsWith('bursitis-') ||
      selectedSymptom?.startsWith('tendinitis-') ||
      selectedSymptom?.startsWith('myositis-') ||
      selectedSymptom?.startsWith('osteo-') ||
      selectedSymptom?.startsWith('mja-') ||
      selectedSymptom?.includes('joint') ||
      selectedSymptom?.includes('arthritis') ||
      selectedSymptom?.includes('bursitis') ||
      selectedSymptom?.includes('tendinitis') ||
      selectedSymptom?.includes('gout') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(selectedSymptom)
  );

  // Phase 4C: Spine Expansion - Detection for spine conditions
  // DC 5235 (Vertebral Fracture), 5236 (Sacroiliac), 5238 (Stenosis), 5240 (Ankylosing Spondylitis), 5241 (Spinal Fusion)
  const isSpineConditionSelected = selectedSymptom?.startsWith('vfx-') ||      // Vertebral Fracture
      selectedSymptom?.startsWith('si-') ||       // Sacroiliac
      selectedSymptom?.startsWith('ss-') ||       // Spinal Stenosis
      selectedSymptom?.startsWith('as-') ||       // Ankylosing Spondylitis
      selectedSymptom?.startsWith('sf-') ||       // Spinal Fusion
      selectedSymptom?.includes('vertebral') ||
      selectedSymptom?.includes('sacroiliac') ||
      selectedSymptom?.includes('stenosis') ||
      selectedSymptom?.includes('ankylosing') ||
      selectedSymptom?.includes('spondylitis') ||
      selectedSymptom?.includes('spinal-fusion'
  );

  // Phase 1E: Seizure/Episode detection - epilepsy, seizure disorders
  const isSeizureSelected = selectedSymptom?.includes('seizure') ||
      selectedSymptom?.includes('epilep') ||
      selectedSymptom?.includes('convuls') ||
      selectedSymptom?.startsWith('seizure-') ||
      selectedSymptom?.startsWith('jack-') ||
      selectedSymptom?.startsWith('dien-') ||
      selectedSymptom?.startsWith('psych-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(selectedSymptom);

  // Phase 1D: Specific epilepsy type detection
  const isJacksonianEpilepsy = selectedSymptom?.startsWith('jack-') ||
      selectedSymptom === 'seizure-partial' ||
      selectedSymptom?.includes('focal');

  const isDiencephalicEpilepsy = selectedSymptom?.startsWith('dien-');

  const isPsychomotorEpilepsy = selectedSymptom?.startsWith('psych-') ||
      selectedSymptom === 'seizure-psychomotor';

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
  const isGenitourinaryRelated = !isPeripheralNerveSymptom && !isEndocrineSymptom && !isSkinConditionSymptom && (
      selectedSymptom?.includes('kidney') ||
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
        'foamy-urine', 'urinary-frequency', 'urinary-urgency',
        'painful-urination', 'urinary-incontinence', 'urine-retention', 'weak-stream',
        'hesitancy', 'nocturia', 'bladder-pain', 'recurrent-uti', 'incomplete-emptying',
        'prostate-symptoms', 'prostate-pain', 'erectile-dysfunction', 'testicular-pain',
        'genital-pain', 'fecal-incontinence', 'bowel-urgency', 'bowel-frequency'].includes(selectedSymptom)
  );

  // Phase 4: Gynecological condition detection
  const isGynecologicalRelated = !isEndocrineSymptom && (
      selectedSymptom?.includes('menstrual') ||
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
        'uterine-cramping'].includes(selectedSymptom)
  );

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
    'malaria-fever-spike', 'malaria-chills', 'malaria-sweating', 'malaria-headache',
    'malaria-muscle-pain', 'malaria-nausea', 'malaria-fatigue', 'malaria-jaundice',
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

  // Depersonalization/Derealization
  const isDepersonalizationRelated = [
    'depersonalization-detachment',
    'derealization-unreality',
    'depersonalization-robot',
    'depersonalization-distress',
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
  // Exclude skin conditions that have 'oral' in name (e.g., acne-oral-antibiotics, hh-oral-medication)
  const isDentalOralRelated = !isSkinConditionSymptom && !isEyeConditionSymptom && !isEarConditionSymptom && (
      selectedSymptom?.includes('jaw') ||
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
        'articulation-problems', 'prosthesis-pain', 'prosthesis-fit', 'prosthesis-sores'].includes(selectedSymptom)
);

  // Schizophrenia Spectrum Disorders (use basic mental health logging)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  const isSchizophreniaRelated = [
    'schizophrenia-hallucinations',
    'schizophrenia-delusions',
    'schizophrenia-disorganized-speech',
    'schizophrenia-disorganized-behavior',
    'schizophrenia-negative-symptoms',
  ].includes(selectedSymptom);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  const isSchizoaffectiveRelated = [
    'schizoaffective-mood-episodes',
    'psychotic-episode',
  ].includes(selectedSymptom);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  const isDelusionalDisorderRelated = [
    'psychotic-episode',
  ].includes(selectedSymptom);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  const isPsychoticNOSRelated = [
    'psychotic-episode',
  ].includes(selectedSymptom);

  // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // ============================================
  // PHASE 9: CARDIOVASCULAR CONDITIONS - DETECTION LOGIC
  // ============================================

  // General cardiac symptoms (heart disease, cardiomyopathy, CAD, Post-MI, HHD)
  const isCardiacRelated = selectedSymptom?.startsWith('cardiac-') ||
      selectedSymptom?.startsWith('cardiomyopathy-') ||
      selectedSymptom?.startsWith('cad-') ||
      selectedSymptom?.startsWith('post-mi-') ||
      selectedSymptom?.startsWith('hhd-') ||
      ['cardiac-breathlessness', 'cardiac-fatigue', 'cardiac-angina', 'cardiac-dizziness',
        'cardiac-syncope', 'cardiac-palpitations', 'cardiac-edema', 'cardiac-orthopnea',
        'cardiomyopathy-breathlessness', 'cardiomyopathy-fatigue', 'cardiomyopathy-edema',
        'cardiomyopathy-palpitations', 'cardiomyopathy-chest-pain', 'cardiomyopathy-dizziness',
        'cardiomyopathy-syncope', 'cardiomyopathy-activity-limitation',
        'cad-angina-stable', 'cad-angina-unstable', 'cad-dyspnea-exertion', 'cad-dyspnea-rest',
        'cad-fatigue', 'cad-dizziness', 'cad-syncope', 'cad-palpitations', 'cad-diaphoresis',
        'cad-nausea', 'cad-activity-limitation', 'cad-nitroglycerin-use', 'cad-hospitalization',
        'post-mi-chest-pain', 'post-mi-dyspnea-exertion', 'post-mi-dyspnea-rest', 'post-mi-fatigue',
        'post-mi-weakness', 'post-mi-dizziness', 'post-mi-syncope', 'post-mi-palpitations',
        'post-mi-edema', 'post-mi-activity-limitation', 'post-mi-anxiety', 'post-mi-hospitalization',
        'hhd-dyspnea-exertion', 'hhd-dyspnea-rest', 'hhd-orthopnea', 'hhd-pnd', 'hhd-fatigue',
        'hhd-edema', 'hhd-weight-gain', 'hhd-chest-discomfort', 'hhd-palpitations', 'hhd-dizziness',
        'hhd-syncope', 'hhd-activity-limitation', 'hhd-hospitalization'].includes(selectedSymptom);

  // Arrhythmia symptoms (SVT, ventricular)
  const isArrhythmiaRelated = selectedSymptom?.startsWith('svt-') ||
      selectedSymptom?.startsWith('ventricular-arrhythmia-') ||
      selectedSymptom?.startsWith('arrhythmia-') ||
      selectedSymptom?.startsWith('aicd-') ||
      ['svt-episode', 'svt-treatment-iv', 'svt-treatment-cardioversion', 'svt-treatment-ablation',
       'svt-vagal-maneuver', 'svt-oral-medication', 'ventricular-arrhythmia-episode',
       'ventricular-arrhythmia-hospitalization', 'aicd-implant', 'aicd-shock',
       'arrhythmia-palpitations', 'arrhythmia-racing-heart', 'arrhythmia-skipped-beats',
       'arrhythmia-dizziness', 'arrhythmia-syncope', 'arrhythmia-chest-discomfort'].includes(selectedSymptom);

  // Pericarditis symptoms
  const isPericarditisRelated = selectedSymptom?.startsWith('pericarditis-') ||
      ['pericarditis-chest-pain', 'pericarditis-pain-breathing', 'pericarditis-pain-lying-down',
       'pericarditis-fever', 'pericarditis-palpitations', 'pericarditis-shortness-breath',
       'pericarditis-active-infection', 'pericarditis-effusion'].includes(selectedSymptom);

  // Post-phlebitic syndrome symptoms
  const isPostPhlebiticRelated = selectedSymptom?.startsWith('post-phlebitic-') ||
      ['post-phlebitic-edema', 'post-phlebitic-pain', 'post-phlebitic-aching',
       'post-phlebitic-pigmentation', 'post-phlebitic-eczema', 'post-phlebitic-ulcer',
       'post-phlebitic-induration', 'post-phlebitic-pain-rest'].includes(selectedSymptom);

  // Combined cardiovascular detection (for form display)
  const isCardiovascularRelated = isCardiacRelated || isArrhythmiaRelated ||
      isPericarditisRelated || isPostPhlebiticRelated;
  // Phase 10: Digestive condition detection
  const isCirrhosisRelated = selectedSymptom?.startsWith('cirrhosis-') ||
      ['cirrhosis-fatigue', 'cirrhosis-ascites', 'cirrhosis-edema', 'cirrhosis-jaundice',
        'cirrhosis-encephalopathy', 'cirrhosis-variceal-bleed', 'cirrhosis-sbp', 'cirrhosis-coagulopathy',
        'cirrhosis-splenomegaly', 'cirrhosis-anorexia', 'cirrhosis-malaise', 'cirrhosis-abdominal-pain',
        'cirrhosis-itching', 'cirrhosis-hospitalization'].includes(selectedSymptom);

  const isGastritisRelated = selectedSymptom?.startsWith('gastritis-') ||
      ['gastritis-abdominal-pain', 'gastritis-nausea', 'gastritis-vomiting', 'gastritis-bloating',
        'gastritis-indigestion', 'gastritis-hematemesis', 'gastritis-melena', 'gastritis-hospitalization'].includes(selectedSymptom);

  const isPancreatitisRelated = selectedSymptom?.startsWith('pancreatitis-') ||
      ['pancreatitis-abdominal-pain', 'pancreatitis-back-pain', 'pancreatitis-nausea', 'pancreatitis-vomiting',
        'pancreatitis-maldigestion', 'pancreatitis-weight-loss', 'pancreatitis-enzyme-use',
        'pancreatitis-dietary-restriction', 'pancreatitis-tube-feeding', 'pancreatitis-cyst',
        'pancreatitis-hospitalization'].includes(selectedSymptom);

  const isBiliaryRelated = selectedSymptom?.startsWith('biliary-') ||
      ['biliary-ruq-pain', 'biliary-nausea', 'biliary-vomiting', 'biliary-jaundice',
        'biliary-fever', 'biliary-dilation', 'biliary-attack'].includes(selectedSymptom);

  // Combined Phase 10 digestive detection
  const isDigestivePhase10Related = isCirrhosisRelated || isGastritisRelated ||
      isPancreatitisRelated || isBiliaryRelated;

  // ============================================
  // PHASE 1A: NEUROLOGICAL CONDITION DETECTION
  // ============================================
  const isMultipleSclerosisRelated = selectedSymptom?.startsWith('ms-') ||
      selectedCategory === 'multiple-sclerosis' ||
      ['ms-fatigue', 'ms-numbness-tingling', 'ms-vision-problems', 'ms-double-vision',
        'ms-muscle-weakness', 'ms-spasticity', 'ms-balance-problems', 'ms-cognitive-fog',
        'ms-bladder-dysfunction', 'ms-bowel-dysfunction', 'ms-heat-sensitivity',
        'ms-lhermittes-sign', 'ms-pain', 'ms-tremor', 'ms-speech-difficulty',
        'ms-swallowing-difficulty', 'ms-relapse', 'ms-vertigo', 'ms-depression',
        'ms-walking-difficulty'].includes(selectedSymptom);

  const isParkinsonsRelated = selectedSymptom?.startsWith('pd-') ||
      selectedCategory === 'parkinsons-disease' ||
      ['pd-resting-tremor', 'pd-rigidity', 'pd-bradykinesia', 'pd-postural-instability',
        'pd-freezing-gait', 'pd-shuffling-walk', 'pd-masked-face', 'pd-soft-speech',
        'pd-micrographia', 'pd-sleep-disturbance', 'pd-rem-sleep-disorder', 'pd-depression',
        'pd-anxiety', 'pd-cognitive-changes', 'pd-constipation', 'pd-urinary-problems',
        'pd-swallowing-difficulty', 'pd-drooling', 'pd-loss-smell', 'pd-fatigue',
        'pd-pain', 'pd-falls', 'pd-off-episodes', 'pd-dyskinesia'].includes(selectedSymptom);

  const isMyastheniaRelated = selectedSymptom?.startsWith('mg-') ||
      selectedCategory === 'myasthenia-gravis' ||
      ['mg-ptosis', 'mg-diplopia', 'mg-facial-weakness', 'mg-difficulty-chewing',
        'mg-difficulty-swallowing', 'mg-slurred-speech', 'mg-limb-weakness',
        'mg-neck-weakness', 'mg-respiratory-weakness', 'mg-fatigue-activity',
        'mg-improvement-rest', 'mg-crisis', 'mg-hospitalization', 'mg-voice-fatigue',
        'mg-arm-elevation-difficulty'].includes(selectedSymptom);

  // ============================================
  // PHASE 1B: ADDITIONAL NEUROLOGICAL DETECTION
  // ============================================

  const isNarcolepsyRelated = selectedSymptom?.startsWith('narco-') ||
      selectedCategory === 'narcolepsy' ||
      ['narco-sleep-attack', 'narco-excessive-sleepiness', 'narco-cataplexy',
        'narco-sleep-paralysis', 'narco-hypnagogic-hallucination', 'narco-hypnopompic-hallucination',
        'narco-disrupted-sleep', 'narco-automatic-behavior', 'narco-memory-problems',
        'narco-difficulty-concentrating', 'narco-microsleep'].includes(selectedSymptom);

  const isALSRelated = selectedSymptom?.startsWith('als-') ||
      selectedCategory === 'als' ||
      ['als-muscle-weakness', 'als-fasciculations', 'als-muscle-cramps', 'als-spasticity',
        'als-difficulty-speaking', 'als-difficulty-swallowing', 'als-respiratory-difficulty',
        'als-fatigue', 'als-muscle-atrophy', 'als-hand-weakness', 'als-foot-drop',
        'als-tripping-falling', 'als-emotional-lability', 'als-drooling', 'als-weight-loss'].includes(selectedSymptom);

  const isSyringomyeliaRelated = selectedSymptom?.startsWith('syring-') ||
      selectedCategory === 'syringomyelia' ||
      ['syring-pain', 'syring-weakness', 'syring-sensory-loss', 'syring-temp-insensitivity',
        'syring-pain-insensitivity', 'syring-muscle-wasting', 'syring-stiffness',
        'syring-headache', 'syring-numbness-tingling', 'syring-bowel-bladder', 'syring-scoliosis'].includes(selectedSymptom);

  const isMyelitisRelated = selectedSymptom?.startsWith('myel-') ||
      selectedCategory === 'myelitis' ||
      ['myel-weakness', 'myel-sensory-changes', 'myel-bladder-dysfunction',
        'myel-bowel-dysfunction', 'myel-pain', 'myel-spasticity', 'myel-fatigue',
        'myel-numbness', 'myel-tingling', 'myel-band-sensation', 'myel-sexual-dysfunction',
        'myel-paralysis'].includes(selectedSymptom);

  // ============================================
  // PHASE 1C: PERIPHERAL NERVE DETECTION
  // ============================================

  // Upper Extremity Nerves
  const isUpperRadicularRelated = selectedSymptom?.startsWith('uprn-') ||
      selectedCategory === 'upper-radicular-nerve' ||
      ['uprn-shoulder-weakness', 'uprn-elbow-weakness', 'uprn-shoulder-movement-loss',
        'uprn-elbow-movement-loss', 'uprn-numbness', 'uprn-tingling', 'uprn-pain',
        'uprn-muscle-atrophy', 'uprn-reflex-loss'].includes(selectedSymptom);

  const isMiddleRadicularRelated = selectedSymptom?.startsWith('mdrn-') ||
      selectedCategory === 'middle-radicular-nerve' ||
      ['mdrn-arm-weakness', 'mdrn-wrist-extension-weakness', 'mdrn-elbow-extension-weakness',
        'mdrn-finger-extension-weakness', 'mdrn-numbness', 'mdrn-tingling', 'mdrn-pain',
        'mdrn-muscle-atrophy', 'mdrn-reflex-loss'].includes(selectedSymptom);

  const isLowerRadicularRelated = selectedSymptom?.startsWith('lwrn-') ||
      selectedCategory === 'lower-radicular-nerve' ||
      ['lwrn-hand-weakness', 'lwrn-grip-weakness', 'lwrn-finger-flexion-weakness',
        'lwrn-intrinsic-muscle-weakness', 'lwrn-numbness', 'lwrn-tingling', 'lwrn-pain',
        'lwrn-muscle-atrophy', 'lwrn-clumsiness'].includes(selectedSymptom);

  const isAllRadicularRelated = selectedSymptom?.startsWith('alrn-') ||
      selectedCategory === 'all-radicular-nerve' ||
      ['alrn-complete-arm-paralysis', 'alrn-arm-weakness', 'alrn-shoulder-weakness',
        'alrn-elbow-weakness', 'alrn-wrist-weakness', 'alrn-hand-weakness',
        'alrn-numbness', 'alrn-tingling', 'alrn-pain', 'alrn-muscle-atrophy'].includes(selectedSymptom);

  const isRadialNerveRelated = selectedSymptom?.startsWith('radn-') ||
      selectedCategory === 'radial-nerve' ||
      ['radn-wrist-drop', 'radn-finger-drop', 'radn-extension-weakness',
        'radn-supination-weakness', 'radn-thumb-extension-loss', 'radn-grip-weakness',
        'radn-numbness', 'radn-tingling', 'radn-pain', 'radn-muscle-atrophy'].includes(selectedSymptom);

  const isMedianNerveRelated = selectedSymptom?.startsWith('medn-') ||
      selectedCategory === 'median-nerve' ||
      ['medn-numbness', 'medn-tingling', 'medn-pain', 'medn-night-symptoms',
        'medn-thenar-weakness', 'medn-thenar-atrophy', 'medn-grip-weakness',
        'medn-dropping-objects', 'medn-opposition-weakness', 'medn-pronation-weakness',
        'medn-ape-hand', 'medn-trophic-changes'].includes(selectedSymptom);

  const isUlnarNerveRelated = selectedSymptom?.startsWith('ulnn-') ||
      selectedCategory === 'ulnar-nerve' ||
      ['ulnn-numbness', 'ulnn-tingling', 'ulnn-pain', 'ulnn-elbow-pain',
        'ulnn-grip-weakness', 'ulnn-pinch-weakness', 'ulnn-finger-spread-weakness',
        'ulnn-claw-hand', 'ulnn-interossei-atrophy', 'ulnn-hypothenar-atrophy',
        'ulnn-thumb-adduction-weakness', 'ulnn-wrist-flexion-weakness'].includes(selectedSymptom);

  const isMusculocutaneousNerveRelated = selectedSymptom?.startsWith('mscn-') ||
      selectedCategory === 'musculocutaneous-nerve' ||
      ['mscn-biceps-weakness', 'mscn-elbow-flexion-weakness', 'mscn-supination-weakness',
        'mscn-numbness', 'mscn-tingling', 'mscn-pain', 'mscn-muscle-atrophy'].includes(selectedSymptom);

  const isCircumflexNerveRelated = selectedSymptom?.startsWith('crcn-') ||
      selectedCategory === 'circumflex-nerve' ||
      ['crcn-shoulder-abduction-weakness', 'crcn-arm-raise-difficulty',
        'crcn-external-rotation-weakness', 'crcn-deltoid-weakness', 'crcn-deltoid-atrophy',
        'crcn-numbness', 'crcn-tingling', 'crcn-pain'].includes(selectedSymptom);

  const isLongThoracicNerveRelated = selectedSymptom?.startsWith('ltn-') ||
      selectedCategory === 'long-thoracic-nerve' ||
      ['ltn-winged-scapula', 'ltn-arm-elevation-difficulty', 'ltn-shoulder-weakness',
        'ltn-pushing-difficulty', 'ltn-serratus-weakness', 'ltn-pain', 'ltn-fatigue'].includes(selectedSymptom);

  // Lower Extremity Nerves
  const isSciaticNerveRelated = selectedSymptom?.startsWith('scin-') ||
      selectedCategory === 'sciatic-nerve' ||
      ['scin-radiating-pain', 'scin-leg-weakness', 'scin-foot-drop',
        'scin-knee-flexion-weakness', 'scin-numbness', 'scin-tingling', 'scin-burning',
        'scin-muscle-atrophy', 'scin-difficulty-walking', 'scin-sitting-pain'].includes(selectedSymptom);

  const isCommonPeronealNerveRelated = selectedSymptom?.startsWith('cpn-') ||
      selectedCategory === 'common-peroneal-nerve' ||
      ['cpn-foot-drop', 'cpn-dorsiflexion-weakness', 'cpn-toe-extension-weakness',
        'cpn-eversion-weakness', 'cpn-steppage-gait', 'cpn-tripping',
        'cpn-numbness', 'cpn-tingling', 'cpn-pain', 'cpn-muscle-atrophy'].includes(selectedSymptom);

  const isSuperficialPeronealNerveRelated = selectedSymptom?.startsWith('spn-') ||
      selectedCategory === 'superficial-peroneal-nerve' ||
      ['spn-eversion-weakness', 'spn-ankle-instability', 'spn-numbness',
        'spn-tingling', 'spn-pain', 'spn-muscle-atrophy'].includes(selectedSymptom);

  const isDeepPeronealNerveRelated = selectedSymptom?.startsWith('dpn-') ||
      selectedCategory === 'deep-peroneal-nerve' ||
      ['dpn-dorsiflexion-loss', 'dpn-toe-extension-weakness', 'dpn-foot-drop',
        'dpn-numbness', 'dpn-tingling', 'dpn-pain', 'dpn-muscle-atrophy'].includes(selectedSymptom);

  const isTibialNerveRelated = selectedSymptom?.startsWith('tibn-') ||
      selectedCategory === 'tibial-nerve' ||
      ['tibn-plantar-flexion-weakness', 'tibn-toe-flexion-weakness',
        'tibn-foot-inversion-weakness', 'tibn-calf-weakness', 'tibn-difficulty-walking-tiptoe',
        'tibn-numbness', 'tibn-tingling', 'tibn-burning', 'tibn-muscle-atrophy'].includes(selectedSymptom);

  const isPosteriorTibialNerveRelated = selectedSymptom?.startsWith('ptn-') ||
      selectedCategory === 'posterior-tibial-nerve' ||
      ['ptn-sole-paralysis', 'ptn-toe-flexion-weakness', 'ptn-foot-adduction-weakness',
        'ptn-numbness', 'ptn-tingling', 'ptn-burning', 'ptn-tarsal-tunnel',
        'ptn-muscle-atrophy'].includes(selectedSymptom);

  const isFemoralNerveRelated = selectedSymptom?.startsWith('femn-') ||
      selectedCategory === 'femoral-nerve' ||
      ['femn-quadriceps-weakness', 'femn-knee-extension-weakness', 'femn-knee-buckling',
        'femn-difficulty-stairs', 'femn-difficulty-rising', 'femn-numbness',
        'femn-tingling', 'femn-pain', 'femn-muscle-atrophy'].includes(selectedSymptom);

  const isSaphenousNerveRelated = selectedSymptom?.startsWith('sapn-') ||
      selectedCategory === 'saphenous-nerve' ||
      ['sapn-numbness', 'sapn-tingling', 'sapn-pain', 'sapn-burning',
        'sapn-hypersensitivity'].includes(selectedSymptom);

  const isObturatorNerveRelated = selectedSymptom?.startsWith('obtn-') ||
      selectedCategory === 'obturator-nerve' ||
      ['obtn-thigh-adduction-weakness', 'obtn-groin-pain', 'obtn-medial-thigh-pain',
        'obtn-numbness', 'obtn-tingling', 'obtn-gait-instability', 'obtn-muscle-atrophy'].includes(selectedSymptom);

  const isLateralFemoralCutaneousNerveRelated = selectedSymptom?.startsWith('lfcn-') ||
      selectedCategory === 'lateral-femoral-cutaneous-nerve' ||
      ['lfcn-numbness', 'lfcn-tingling', 'lfcn-burning', 'lfcn-hypersensitivity',
        'lfcn-pain-standing', 'lfcn-pain-walking'].includes(selectedSymptom);

  const isIlioinguinalNerveRelated = selectedSymptom?.startsWith('iin-') ||
      selectedCategory === 'ilioinguinal-nerve' ||
      ['iin-groin-numbness', 'iin-genital-numbness', 'iin-inner-thigh-numbness',
        'iin-groin-pain', 'iin-burning', 'iin-hypersensitivity', 'iin-pain-movement'].includes(selectedSymptom);

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

  // Phase 3A: Endocrine - Thyroid & Parathyroid Detection
  const isHyperthyroidismRelated = selectedSymptom?.startsWith('hyper-') ||
      selectedSymptom?.startsWith('graves-') ||
      selectedCategory === 'hyperthyroidism' ||
      ['hyper-weight-loss', 'hyper-rapid-heartbeat', 'hyper-tremor', 'hyper-heat-intolerance',
        'hyper-sweating', 'hyper-anxiety', 'hyper-irritability', 'hyper-fatigue',
        'hyper-muscle-weakness', 'hyper-sleep-difficulty', 'hyper-appetite-increase',
        'hyper-bowel-changes', 'graves-eye-bulging', 'graves-eye-irritation',
        'graves-double-vision', 'graves-eye-pain', 'graves-light-sensitivity'].includes(selectedSymptom);
  const isThyroiditisRelated = selectedSymptom?.startsWith('thyroiditis-') ||
      selectedCategory === 'thyroiditis' ||
      ['thyroiditis-neck-pain', 'thyroiditis-swelling', 'thyroiditis-difficulty-swallowing',
        'thyroiditis-hyper-phase', 'thyroiditis-hypo-phase', 'thyroiditis-fatigue'].includes(selectedSymptom);
  const isHyperparathyroidismRelated = selectedSymptom?.startsWith('hpth-') ||
      selectedCategory === 'hyperparathyroidism' ||
      ['hpth-fatigue', 'hpth-bone-pain', 'hpth-kidney-stones', 'hpth-abdominal-pain',
        'hpth-nausea', 'hpth-constipation', 'hpth-confusion', 'hpth-depression',
        'hpth-muscle-weakness', 'hpth-excessive-thirst', 'hpth-frequent-urination',
        'hpth-anorexia', 'hpth-fracture'].includes(selectedSymptom);
  const isHypoparathyroidismRelated = selectedSymptom?.startsWith('hopth-') ||
      selectedCategory === 'hypoparathyroidism' ||
      ['hopth-muscle-cramps', 'hopth-tingling', 'hopth-muscle-spasms', 'hopth-fatigue',
        'hopth-dry-skin', 'hopth-brittle-nails', 'hopth-hair-loss', 'hopth-seizures',
        'hopth-depression', 'hopth-anxiety', 'hopth-memory-problems', 'hopth-cataracts'].includes(selectedSymptom);

  // Phase 3B: Adrenal & Pituitary Detection
  const isAddisonsDiseaseRelated = selectedSymptom?.startsWith('addisons-') ||
      selectedCategory === 'addisons-disease';
  const isCushingsSyndromeRelated = selectedSymptom?.startsWith('cushings-') ||
      selectedCategory === 'cushings-syndrome';
  const isDiabetesInsipidusRelated = selectedSymptom?.startsWith('di-') ||
      selectedCategory === 'diabetes-insipidus';
  const isHyperaldosteronismRelated = selectedSymptom?.startsWith('haldo-') ||
      selectedCategory === 'hyperaldosteronism';

  // Reset condition-specific data when symptom changes
  useEffect(() => {
    // Phase 1H: Skip reset during prefill operation
    if (isPrefilling.current) {
      console.log('⏭️ Skipping reset - prefill in progress');
      return;
    }

    if (!isMigraineSelected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMigraineData({ ...INITIAL_MIGRAINE_DATA });
    }

    if (!isSleepSelected && !isNightmareSelected) setSleepData({ ...INITIAL_SLEEP_DATA });

    if (!isPTSDRelated) {
      setPtsdData({ ...INITIAL_PTSD_DATA });
    }
    if (!isPainSelected) {
      setPainData({ ...INITIAL_PAIN_DATA });
    }
    // Phase 1B: Reset GI data
    if (!isGISelected) setGIData({ ...INITIAL_GI_DATA });

    if (!isRespiratorySelected) setRespiratoryData({ ...INITIAL_RESPIRATORY_DATA });

    if (!isJointSelected) {
      setJointData({ ...INITIAL_JOINT_DATA });
    }
    if (!isSpineConditionSelected) {
      setSpineData({ ...INITIAL_SPINE_DATA });
    }
    if (!isSeizureSelected) {
      setSeizureData({ ...INITIAL_SEIZURE_DATA });
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
      setGenitourinaryData({ ...INITIAL_GENITOURINARY_DATA });
    }
    if (!isGynecologicalRelated) {
      setGynecologicalData({ ...INITIAL_GYNECOLOGICAL_DATA });
    }
    // Phase 5: Hemic/Lymphatic resets
    if (!isAnemiaRelated) setAnemiaData({ ...INITIAL_ANEMIA_DATA });
    if (!isSickleCellRelated) setSickleCellData({ ...INITIAL_SICKLE_CELL_DATA });
    if (!isBleedingDisorderRelated) setBleedingDisorderData({ ...INITIAL_BLEEDING_DISORDER_DATA });
    if (!isInfectionRelated) setInfectionData({ ...INITIAL_INFECTION_DATA });
    if (!isLymphomaLeukemiaRelated) setLymphomaLeukemiaData({ ...INITIAL_LYMPHOMA_LEUKEMIA_DATA });
    if (!isPolycythemiaRelated) setPolycythemiaData({ ...INITIAL_POLYCYTHEMIA_DATA });
    if (!isTreatmentRelated) setTreatmentData({ ...INITIAL_TREATMENT_DATA });
    if (!isB12DeficiencyRelated) setB12DeficiencyData({ ...INITIAL_B12_DEFICIENCY_DATA });
    // Phase 6: Reset infectious disease data
    if (!isHIVRelated) setHivData({ ...INITIAL_HIV_DATA });
    if (!isHepatitisRelated) setHepatitisData({ ...INITIAL_HEPATITIS_DATA });
    if (!isLymeRelated) setLymeData({ ...INITIAL_LYME_DATA });
    if (!isMalariaRelated) setMalariaData({ ...INITIAL_MALARIA_DATA });
    if (!isBrucellosisRelated) setBrucellosisData({ ...INITIAL_BRUCELLOSIS_DATA });
    if (!isCampylobacterRelated) setCampylobacterData({ ...INITIAL_CAMPYLOBACTER_DATA });
    if (!isQFeverRelated) setQFeverData({ ...INITIAL_QFEVER_DATA });
    if (!isSalmonellaRelated) setSalmonellaData({ ...INITIAL_SALMONELLA_DATA });
    if (!isShigellaRelated) setShigellaData({ ...INITIAL_SHIGELLA_DATA });
    if (!isWestNileRelated) setWestNileData({ ...INITIAL_WEST_NILE_DATA });
    if (!isNTMRelated) setNtmData({ ...INITIAL_NTM_DATA });
    // Phase 7: Reset dental data
    if (!isDentalOralRelated) {
      setDentalData({ ...INITIAL_DENTAL_DATA });
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
    if (!isBulimiaRelated)                  setEatingDisorderData({ ...INITIAL_EATING_DISORDER_DATA });
    if (!isAnxietyFormRelated)              setAnxietyData({ ...INITIAL_ANXIETY_DATA });
    if (!isDepressionFormRelated)           setDepressionData({ ...INITIAL_DEPRESSION_DATA });
    if (!isBipolarFormRelated)              setBipolarData({ ...INITIAL_BIPOLAR_DATA });
    if (!isOCDFormRelated)                  setOcdData({ ...INITIAL_OCD_DATA });
    if (!isAdjustmentDisorderFormRelated)   setAdjustmentDisorderData({ ...INITIAL_ADJUSTMENT_DISORDER_DATA });
    // Phase 8B resets
    if (!isBingeEatingRelated)             setBingeEatingData({ ...INITIAL_BINGE_EATING_DATA });
    if (!isDissociativeRelated)            setDissociativeData({ ...INITIAL_DISSOCIATIVE_DATA });
    if (!isAcuteStressRelated)             setAcuteStressData({ ...INITIAL_ACUTE_STRESS_DATA });
    if (!isPersonalityDisorderRelated)     setPersonalityData({ ...INITIAL_PERSONALITY_DATA });
    // Phase 8A expansion resets
    if (!isSomaticSymptomRelated)          setSomaticSymptomData({ ...INITIAL_SOMATIC_SYMPTOM_DATA });
    if (!isIllnessAnxietyRelated)          setIllnessAnxietyData({ ...INITIAL_ILLNESS_ANXIETY_DATA });
    if (!isDepersonalizationRelated)       setDepersonalizationData({ ...INITIAL_DEPERSONALIZATION_DATA });
    if (!isCyclothymicRelated)             setCyclothymicData({ ...INITIAL_CYCLOTHYMIC_DATA });

    // Phase 9: Reset cardiovascular data
    if (!isCardiovascularRelated) {
      setCardiovascularData({ ...INITIAL_CARDIOVASCULAR_DATA });
    }
    // Phase 10: Reset digestive data
    if (!isDigestivePhase10Related) {
      setDigestiveData({ ...INITIAL_DIGESTIVE_DATA });
    }
    if (!isMultipleSclerosisRelated) setMultipleSclerosisData({ ...INITIAL_MULTIPLE_SCLEROSIS_DATA });
    if (!isParkinsonsRelated)        setParkinsonsData({ ...INITIAL_PARKINSONS_DATA });
    if (!isMyastheniaRelated)        setMyastheniaData({ ...INITIAL_MYASTHENIA_DATA });
    // Phase 1B resets
    if (!isNarcolepsyRelated)        setNarcolepsyData({ ...INITIAL_NARCOLEPSY_DATA });
    if (!isALSRelated)               setAlsData({ ...INITIAL_ALS_DATA });
    if (!isSyringomyeliaRelated)     setSyringomyeliaData({ ...INITIAL_SYRINGOMYELIA_DATA });
    if (!isMyelitisRelated)          setMyelitisData({ ...INITIAL_MYELITIS_DATA });

    // Phase 1C: Reset peripheral nerve data
    if (!isPeripheralNerveRelated) {
      setPeripheralNerveData({ ...INITIAL_PERIPHERAL_NERVE_DATA });
    }
  }, [selectedSymptom, isMigraineSelected, isSleepSelected, isNightmareSelected, isPTSDRelated, isPainSelected,
    isGISelected, isRespiratorySelected, isJointSelected, isSeizureSelected, isEyeRelated, isGenitourinaryRelated,
    isGynecologicalRelated, isAnemiaRelated, isSickleCellRelated, isBleedingDisorderRelated, isInfectionRelated,
    isLymphomaLeukemiaRelated, isPolycythemiaRelated, isTreatmentRelated, isB12DeficiencyRelated, isDentalOralRelated,
    isHIVRelated, isHepatitisRelated, isLymeRelated, isMalariaRelated, isBrucellosisRelated, isCampylobacterRelated,
    isQFeverRelated, isSalmonellaRelated, isShigellaRelated, isWestNileRelated, isNTMRelated, isAnorexiaRelated,
    isBulimiaRelated, isAnxietyFormRelated, isDepressionFormRelated, isBipolarFormRelated, isOCDFormRelated,
    isAdjustmentDisorderFormRelated, isBingeEatingRelated, isDissociativeRelated, isAcuteStressRelated,
    isPersonalityDisorderRelated, isCardiovascularRelated, isDigestivePhase10Related,
    isNarcolepsyRelated, isALSRelated, isSyringomyeliaRelated, isMyelitisRelated, isPeripheralNerveRelated,
    isCyclothymicRelated, isDepersonalizationRelated, isIllnessAnxietyRelated, isMultipleSclerosisRelated,
    isMyastheniaRelated, isParkinsonsRelated, isSomaticSymptomRelated, isSpineConditionSelected
  ]);


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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGenitourinaryData(prev => ({ ...prev, affectedSystem: system }));
      }
    }
  }, [selectedSymptom, isGenitourinaryRelated, genitourinaryData.affectedSystem]);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGynecologicalData(prev => ({ ...prev, affectedOrgan: organ }));
      }
    }
  }, [selectedSymptom, isGynecologicalRelated, gynecologicalData.affectedOrgan]);

  // Build categories list including custom symptoms
  const getAllCategories = () => {
    const categories = sortedSymptomCategories.map(cat => ({
      ...cat,
      symptoms: [...cat.symptoms],
      displayName: stripDCCode(cat.name)
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
          displayName: stripDCCode(categoryName),
          symptoms: symptoms,
        });
      }
    });

    return categories;
  };

  const allCategories = getAllCategories();

  // Get body systems list for dropdown
  const bodySystemList = useMemo(() => getBodySystemList(), []);

  // Get related conditions based on selected category
  const relatedConditions = useMemo(() => {
    if (!selectedCategory) return [];
    const category = allCategories.find(cat => cat.id === selectedCategory);
    if (!category) return [];
    return getRelatedConditions(category.name);
  }, [selectedCategory, allCategories]);

  // Get categories grouped by body system (including custom symptoms)
  const categoriesByBodySystem = useMemo(() => {
    const grouped = {};

    // Initialize all body systems
    Object.keys(BODY_SYSTEMS).forEach(systemId => {
      grouped[systemId] = [];
    });

    // Group all categories (including those with custom symptoms)
    allCategories.forEach(category => {
      const bodySystem = getBodySystem(category.name);
      const categoryWithDisplay = {
        ...category,
        displayName: stripDCCode(category.name)
      };

      if (grouped[bodySystem]) {
        grouped[bodySystem].push(categoryWithDisplay);
      } else {
        grouped['general'].push(categoryWithDisplay);
      }
    });

    // Sort categories within each body system
    Object.keys(grouped).forEach(systemId => {
      grouped[systemId].sort((a, b) => a.displayName.localeCompare(b.displayName));
    });

    return grouped;
  }, [allCategories]);

  // Get categories for selected body system
  const categoriesForSelectedSystem = useMemo(() => {
    if (!selectedBodySystem) return [];
    if (selectedBodySystem === 'all') return allCategories.map(cat => ({
      ...cat,
      displayName: stripDCCode(cat.name)
    })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    return categoriesByBodySystem[selectedBodySystem] || [];
  }, [selectedBodySystem, categoriesByBodySystem, allCategories]);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      // Include custom symptoms in search
      const customResults = customSymptoms
      .filter(sym => sym.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(sym => ({
        ...sym,
        categoryDisplayName: stripDCCode(sym.category),
        bodySystem: getBodySystem(sym.category),
        bodySystemName: BODY_SYSTEMS[getBodySystem(sym.category)]?.name || 'General',
        matchType: 'symptom',
        isCustom: true
      }));

      const standardResults = searchSymptoms(searchQuery, 20);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([...customResults, ...standardResults].slice(0, 25));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, customSymptoms]);

  // Handle search result selection
  const handleSearchResultSelect = (result) => {
    // Find the category
    const category = allCategories.find(cat =>
        cat.id === result.categoryId || cat.name === result.category
    );

    if (category) {
      const bodySystem = getBodySystem(category.name);
      setSelectedBodySystem(bodySystem);
      setSelectedCategory(category.id);
      setSelectedSymptom(result.id);
      setIsSearchMode(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Get symptoms for the selected category
  const getSymptomsForCategory = () => {
    if (!selectedCategory) return [];
    const category = allCategories.find(cat => cat.id === selectedCategory);
    return category ? category.symptoms : [];
  };

  const availableSymptoms = getSymptomsForCategory();

  // Handle body system change - reset category and symptom
  const handleBodySystemChange = (systemId) => {
    setSelectedBodySystem(systemId);
    setSelectedCategory('');
    setSelectedSymptom('');
  };

  // Handle category change - reset symptom selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSymptom('');
    // Reset timestamp to now when selecting a new category
    setOccurredAt(new Date().toISOString());
  };

  // Toggle between dropdown and search mode
  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      // Entering search mode - clear selections and focus search
      setSearchQuery('');
      setSearchResults([]);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      // Leaving search mode
      setSearchQuery('');
      setSearchResults([]);
    }
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
      weather: weather || null,
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
    // Phase 4C: Add spine data
    if (isSpineConditionSelected) {
      entry.spineData = { ...spineData };
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
    // Phase 9: Add cardiovascular data
    if (isCardiovascularRelated && cardiovascularData) {
      entry.cardiovascularData = { ...cardiovascularData };
    }
    // Phase 10: Include digestive data
    if (isDigestivePhase10Related && digestiveData) {
      entry.digestiveData = { ...digestiveData };
    }
    // Phase 1A: Include neurological data
    if (isMultipleSclerosisRelated && multipleSclerosisData) {
      entry.multipleSclerosisData = { ...multipleSclerosisData };
    }
    if (isParkinsonsRelated && parkinsonsData) {
      entry.parkinsonsData = { ...parkinsonsData };
    }
    if (isMyastheniaRelated && myastheniaData) {
      entry.myastheniaData = { ...myastheniaData };
    }
    // Phase 1B: Include neurological data
    if (isNarcolepsyRelated && narcolepsyData) {
      entry.narcolepsyData = { ...narcolepsyData };
    }
    if (isALSRelated && alsData) {
      entry.alsData = { ...alsData };
    }
    if (isSyringomyeliaRelated && syringomyeliaData) {
      entry.syringomyeliaData = { ...syringomyeliaData };
    }
    if (isMyelitisRelated && myelitisData) {
      entry.myelitisData = { ...myelitisData };
    }
  // Phase 1C: Include peripheral nerve data
    if (isPeripheralNerveRelated && peripheralNerveData) {
      entry.peripheralNerveData = {
        ...peripheralNerveData,
        nerveLocation: isUpperExtremityNerveRelated ? 'upper' : 'lower',
      };
    }


    const savedEntry = saveSymptomLog(entry);

    // Log medications if taken
    // selectedMedications is an object keyed by medId: { [medId]: { effectiveness, sideEffects, ... } }
    const selectedMedIds = Object.keys(selectedMedications);
    if (tookMedication && selectedMedIds.length > 0) {
      // Shared batchId groups all meds from this symptom log into one history card.
      // occurredAt passed through so history shows when meds were taken, not when entered.
      const batchId = `batch_${Date.now()}`;
      selectedMedIds.forEach(medId => {
        const med = medications.find(m => m.id === medId);
        const medDetail = selectedMedications[medId];
        if (med) {
          const allSideEffects = [
            ...(medDetail?.sideEffects || []),
            ...(medDetail?.sideEffectsOther?.trim() ? [medDetail.sideEffectsOther.trim()] : []),
          ];
          logMedicationTaken({
            medicationId: med.id,
            medicationName: med.name,
            dosage: getDosageForLog(med),
            takenFor: entry.symptomName,
            symptomLogId: savedEntry.id,
            effectiveness: medDetail?.effectiveness || null,
            sideEffects: allSideEffects.length > 0 ? allSideEffects : '',
            occurredAt: entry.occurredAt,
            batchId,
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
    setSelectedMedications({});
    // Reset universal fields
    setIsFlareUp(false);
    setDuration('');
    setTimeOfDay('');
    setWeather('');

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

  const weatherOptions = [
    { value: '', label: 'Not specified' },
    { value: 'clear', label: '☀️ Clear/Sunny' },
    { value: 'cloudy', label: '☁️ Cloudy' },
    { value: 'rainy', label: '🌧️ Rainy' },
    { value: 'stormy', label: '⛈️ Stormy' },
    { value: 'hot', label: '🥵 Hot' },
    { value: 'cold', label: '🥶 Cold' },
    { value: 'humid', label: '💧 Humid' },
    { value: 'pressure-change', label: '📊 Barometric Pressure Change' },
  ];

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600 dark:text-green-400' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500 dark:text-red-400' };
    return { label: 'Extreme', color: 'text-red-700 dark:text-red-300' };
  };

  const severityInfo = getSeverityInfo(severity);

  return (
      <div className="pb-1">
          {/* Quick Access Cards - Stack on mobile, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Measurements Quick Access Card */}
              <button
                  onClick={() => onNavigate && onNavigate('measurements')}
                  className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50
                     dark:from-blue-900/20 dark:to-indigo-900/20
                     border border-blue-200 dark:border-blue-800
                     rounded-lg p-4 hover:shadow-md transition-all
                     hover:scale-[1.02] active:scale-[0.98]"
              >
                  <div className="flex items-center gap-3">
                      <span className="text-3xl">📏</span>
                      <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                              Track Measurements
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                              Blood pressure, glucose, weight, vitals
                          </p>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-xl">→</span>
                  </div>
              </button>

              {/* Medications Quick Access Card */}
              <button
                  onClick={() => onNavigate && onNavigate('meds')}
                  className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50
                     dark:from-green-900/20 dark:to-emerald-900/20
                     border border-green-200 dark:border-green-800
                     rounded-lg p-4 hover:shadow-md transition-all
                     hover:scale-[1.02] active:scale-[0.98]"
              >
                  <div className="flex items-center gap-3">
                      <span className="text-3xl">💊</span>
                      <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                              Medications
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                              Log meds, track dosages
                          </p>
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-xl">→</span>
                  </div>
              </button>
          </div>

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
          {/* Symptom Selection - Search or Browse */}
          <div className="space-y-4">
            {/* Mode Toggle: Browse vs Search */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isSearchMode ? 'Search for a symptom' : 'Browse by body system'}
              </span>
              <button
                  type="button"
                  onClick={toggleSearchMode}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {isSearchMode ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Browse Categories
                    </>
                ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search Symptoms
                    </>
                )}
              </button>
            </div>

            {/* Search Mode */}
            {isSearchMode ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search symptoms..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                  </div>

                  {/* Search Results */}
                  {searchQuery.length >= 2 && (
                      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <button
                                    key={`${result.id}-${index}`}
                                    type="button"
                                    onClick={() => handleSearchResultSelect(result)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {result.name}
                                    {result.isCustom && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(custom)</span>}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {result.bodySystemName} → {result.categoryDisplayName}
                                  </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                              No symptoms found matching "{searchQuery}"
                            </div>
                        )}
                      </div>
                  )}

                  {searchQuery.length > 0 && searchQuery.length < 2 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type at least 2 characters to search...
                      </p>
                  )}
                </div>
            ) : (
                /* Browse Mode - 3-Level Dropdowns */
                <div className="space-y-4">
                  {/* Step 1: Body System Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      1. Select Body System
                    </label>
                    <select
                        value={selectedBodySystem}
                        onChange={(e) => handleBodySystemChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a body system...</option>
                      <option value="all">── All Systems ──</option>
                      {bodySystemList.map(system => (
                          <option key={system.id} value={system.id}>
                            {system.name} ({categoriesByBodySystem[system.id]?.length || 0})
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Category Selection */}
                  {selectedBodySystem && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          2. Select Category
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
                          {categoriesForSelectedSystem.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.displayName} ({category.symptoms.length})
                              </option>
                          ))}
                          <option value="ADD_CUSTOM">+ Add Custom Symptom</option>
                        </select>
                      </div>
                  )}

                  {/* Step 3: Symptom Selection */}
                  {selectedCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          3. Select Symptom
                        </label>
                        <select
                            value={selectedSymptom}
                            onChange={(e) => {
                              setSelectedSymptom(e.target.value);
                              // Reset timestamp to now when selecting a new symptom
                              if (e.target.value) {
                                setOccurredAt(new Date().toISOString());
                              }
                              console.log(selectedSymptom)
                            }}
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
                        {isVeteran
                            ? 'Symptom is worse than usual baseline — important for VA flare-up documentation'
                            : 'Symptom is worse than usual baseline'}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      🌤️ Weather (optional)
                    </label>
                    <select
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
               rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {weatherOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      😰 Stress Level: {stressLevel}/10
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none
               cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0 - Calm</span>
                      <span>5 - Moderate</span>
                      <span>10 - Extreme</span>
                    </div>
                  </div>
                </div>
              </div>


          )}

          {/* ============================================ */}
          {/* PHASE 1B: GI CONDITION-SPECIFIC FORM */}
          {/* For IBS, GERD, UC, peptic ulcer, hemorrhoids, diverticulitis */}
          {/* ============================================ */}
          {isGISelected && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="ibs" />
                <GIForm
                    key={selectedSymptom}
                    initialData={giData}
                    onChange={(field, value) =>
                        setGIData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Migraine-Specific Fields */}
          {isMigraineSelected && (
              <>
                <WhyTrackThis condition="migraine" />
                <MigraineForm
                    initialData={migraineData}
                    onChange={(fieldName, value) =>
                        setMigraineData(prev => ({ ...prev, [fieldName]: value }))
                    }
                />
              </>
          )}

          {/* Sleep-Specific Fields */}
          {(isSleepSelected || isNightmareSelected) && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="sleep-disorders" />
                <SleepForm
                    key={selectedSymptom}
                    initialData={sleepData}
                    onChange={(field, value) =>
                        setSleepData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* PTSD-Related Fields */}
          {isPTSDRelated && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="ptsd"
                />
                <PTSDForm
                    initialData={ptsdData}
                    onChange={(fieldName, value) =>
                        setPtsdData(prev => ({ ...prev, [fieldName]: value }))
                    }
                />
              </>
          )}

          {/* PHASE 8A EXTENDED: ANXIETY DISORDERS FORM */}
          {isAnxietyFormRelated && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="anxiety"
                />
                <AnxietyForm
                    initialData={anxietyData}
                    onChange={(fieldName, value) =>
                        setAnxietyData(prev => ({ ...prev, [fieldName]: value }))
                    }
                />
              </>
          )}

          {/* ============================================
              PHASE 8A EXTENDED: DEPRESSION FORM
              ============================================ */}
          {isDepressionFormRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="depression" />
                <DepressionForm
                    key={selectedSymptom}
                    initialData={depressionData}
                    onChange={(field, value) =>
                        setDepressionData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isBipolarFormRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="bipolar" />
                <BipolarForm
                    key={selectedSymptom}
                    initialData={bipolarData}
                    onChange={(field, value) =>
                        setBipolarData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isOCDFormRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="ocd" />
                <OCDForm
                    key={selectedSymptom}
                    initialData={ocdData}
                    onChange={(field, value) =>
                        setOcdData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isAdjustmentDisorderFormRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="adjustment-disorder" />
                <AdjustmentDisorderForm
                    key={selectedSymptom}
                    initialData={adjustmentDisorderData}
                    onChange={(field, value) =>
                        setAdjustmentDisorderData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Phase 1C: Respiratory Form */}
          {isRespiratorySelected && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="respiratory" />
                <RespiratoryForm
                    key={selectedSymptom}
                    initialData={respiratoryData}
                    onChange={(field, value) =>
                        setRespiratoryData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Phase 1D: Joint/ROM Form */}
          {isJointSelected && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="arthritis" />
                <JointForm
                    key={`joint-${selectedSymptom}`}
                    initialData={jointData}
                    onChange={(field, value) =>
                        setJointData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}


          {/* Phase 4C: Spine Condition Fields */}
          {isSpineConditionSelected && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="back-spine" />
                <SpineForm
                    key={`spine-${selectedSymptom}`}
                    initialData={spineData}
                    onChange={(field, value) =>
                        setSpineData(prev => ({ ...prev, [field]: value }))
                    }
                    selectedSymptom={selectedSymptom}
                />
              </>
          )}

          {/* Phase 1E: Seizure/Episode Form */}
          {isSeizureSelected && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="neurological"
                />
                <SeizureForm
                    key={`seizure-${selectedSymptom}`}
                    initialData={seizureData}
                    onChange={(field, value) =>
                        setSeizureData(prev => ({ ...prev, [field]: value }))
                    }
                    selectedSymptom={selectedSymptom}
                    showJacksonian={isJacksonianEpilepsy}
                    showDiencephalic={isDiencephalicEpilepsy}
                    showPsychomotor={isPsychomotorEpilepsy}
                />
              </>
          )}

          {/* Pain-Specific Fields */}
          {isPainSelected && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="pain"
                />
                <PainForm
                    key={`pain-${selectedSymptom}`}
                    initialData={painData}
                    onChange={(field, value) =>
                        setPainData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Phase 3: Genitourinary Details */}
          {isGenitourinaryRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="genitourinary" />
                <GenitourinaryForm
                    key={`gu-${selectedSymptom}`}
                    initialData={genitourinaryData}
                    onChange={(field, value) =>
                        setGenitourinaryData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Phase 4: Gynecological Details */}
          {isGynecologicalRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="gynecological" />
                <GynecologicalForm
                    key={`gyn-${selectedSymptom}`}
                    initialData={gynecologicalData}
                    onChange={(field, value) =>
                        setGynecologicalData(prev => ({ ...prev, [field]: value }))
                    }
                    selectedSymptom={selectedSymptom}
                />
              </>
          )}

          {/* Phase 5: Anemia Form */}
          {isAnemiaRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="hemic-lymphatic" />
                <AnemiaForm
                    key={`anemia-${selectedSymptom}`}
                    initialData={anemiaData}
                    onChange={(field, value) =>
                        setAnemiaData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isSickleCellRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="hemic-lymphatic" />
                <SickleCellForm
                    key={`sickle-${selectedSymptom}`}
                    initialData={sickleCellData}
                    onChange={(field, value) =>
                        setSickleCellData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isBleedingDisorderRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="hemic-lymphatic" />
                <BleedingDisorderForm
                    key={`bleeding-${selectedSymptom}`}
                    initialData={bleedingDisorderData}
                    onChange={(field, value) =>
                        setBleedingDisorderData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {isInfectionRelated && (
                <InfectionForm
                    key={`infection-${selectedSymptom}`}
                    initialData={infectionData}
                    onChange={(field, value) =>
                        setInfectionData(prev => ({ ...prev, [field]: value }))
                    }
                />
          )}

          {isLymphomaLeukemiaRelated && (
                <LymphomaLeukemiaForm
                    key={`lymphoma-${selectedSymptom}`}
                    initialData={lymphomaLeukemiaData}
                    onChange={(field, value) =>
                        setLymphomaLeukemiaData(prev => ({ ...prev, [field]: value }))
                    }
                />
          )}

          {isPolycythemiaRelated && (
                <PolycythemiaForm
                    key={`polycythemia-${selectedSymptom}`}
                    initialData={polycythemiaData}
                    onChange={(field, value) =>
                        setPolycythemiaData(prev => ({ ...prev, [field]: value }))
                    }
                />
          )}

          {isTreatmentRelated && (
                <TreatmentForm
                    key={`treatment-${selectedSymptom}`}
                    initialData={treatmentData}
                    onChange={(field, value) =>
                        setTreatmentData(prev => ({ ...prev, [field]: value }))
                    }
                />
          )}

          {isB12DeficiencyRelated && (
                <B12DeficiencyForm
                    key={`b12-${selectedSymptom}`}
                    initialData={b12DeficiencyData}
                    onChange={(field, value) =>
                        setB12DeficiencyData(prev => ({ ...prev, [field]: value }))
                    }
                />
          )}

          {/* Phase 7: Dental/Oral Conditions Form */}
          {isDentalOralRelated && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="dental"
                />
                <DentalForm
                    key={`dental-${selectedSymptom}`}
                    initialData={dentalData}
                    onChange={(field, value) =>
                        setDentalData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Phase 6: HIV/AIDS Form */}
          {isHIVRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="hiv-aids" />
                <HIVForm
                    key={`hiv-${selectedSymptom}`}
                    initialData={hivData}
                    onChange={(field, value) => setHivData(prev => ({ ...prev, [field]: value }))}
                    selectedSymptom={selectedSymptom}
                />
              </>
          )}

          {/* Phase 6: Hepatitis (B & C) Form */}
          {isHepatitisRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="hepatitis" />
                <HepatitisForm
                    key={`hepatitis-${selectedSymptom}`}
                    initialData={hepatitisData}
                    onChange={(field, value) => setHepatitisData(prev => ({ ...prev, [field]: value }))}
                />
              </>
          )}

          {/* Phase 6: Lyme Disease Form */}
          {isLymeRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="lyme-disease" />
                <LymeForm
                    key={`lyme-${selectedSymptom}`}
                    initialData={lymeData}
                    onChange={(field, value) => setLymeData(prev => ({ ...prev, [field]: value }))}
                    selectedSymptom={selectedSymptom}
                />
              </>
          )}

          {/* Phase 6: Malaria Form */}
          {isMalariaRelated && (
              <MalariaForm
                  key={`malaria-${selectedSymptom}`}
                  initialData={malariaData}
                  onChange={(field, value) => setMalariaData(prev => ({ ...prev, [field]: value }))}
                  selectedSymptom={selectedSymptom}
              />
          )}

          {/* Phase 6: Brucellosis Form */}
          {isBrucellosisRelated && (
              <BrucellosisForm
                  key={`brucellosis-${selectedSymptom}`}
                  initialData={brucellosisData}
                  onChange={(field, value) => setBrucellosisData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: Campylobacter Form */}
          {isCampylobacterRelated && (
              <CampylobacterForm
                  key={`campylobacter-${selectedSymptom}`}
                  initialData={campylobacterData}
                  onChange={(field, value) => setCampylobacterData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: Q Fever Form */}
          {isQFeverRelated && (
              <QFeverForm
                  key={`qfever-${selectedSymptom}`}
                  initialData={qFeverData}
                  onChange={(field, value) => setQFeverData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: Salmonella Form */}
          {isSalmonellaRelated && (
              <SalmonellaForm
                  key={`salmonella-${selectedSymptom}`}
                  initialData={salmonellaData}
                  onChange={(field, value) => setSalmonellaData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: Shigella Form */}
          {isShigellaRelated && (
              <ShigellaForm
                  key={`shigella-${selectedSymptom}`}
                  initialData={shigellaData}
                  onChange={(field, value) => setShigellaData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: West Nile Virus Form */}
          {isWestNileRelated && (
              <WestNileForm
                  key={`westnile-${selectedSymptom}`}
                  initialData={westNileData}
                  onChange={(field, value) => setWestNileData(prev => ({ ...prev, [field]: value }))}
              />
          )}

          {/* Phase 6: NTM Form */}
          {isNTMRelated && (
              <NTMForm
                  key={`ntm-${selectedSymptom}`}
                  initialData={ntmData}
                  onChange={(field, value) => setNtmData(prev => ({ ...prev, [field]: value }))}
              />
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
              <EatingDisorderForm
                  key={selectedSymptom}
                  initialData={eatingDisorderData}
                  isAnorexia={isAnorexiaRelated}
                  isBulimia={isBulimiaRelated}
                  onChange={(field, value) =>
                      setEatingDisorderData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* Phase 8B: Binge Eating Disorder Form */}
          {isBingeEatingRelated && (
              <BingeEatingForm
                  key={selectedSymptom}
                  initialData={bingeEatingData}
                  onChange={(field, value) =>
                      setBingeEatingData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {isDissociativeRelated && (
              <DissociativeForm
                  key={selectedSymptom}
                  initialData={dissociativeData}
                  onChange={(field, value) =>
                      setDissociativeData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* Phase 8B: Acute Stress Disorder Form */}
          {isAcuteStressRelated && (
              <AcuteStressForm
                  key={selectedSymptom}
                  initialData={acuteStressData}
                  onChange={(field, value) =>
                      setAcuteStressData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* Phase 8B: Personality Disorders Form */}
          {isPersonalityDisorderRelated && (
              <PersonalityDisorderForm
                  key={selectedSymptom}
                  initialData={personalityData}
                  onChange={(field, value) =>
                      setPersonalityData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* PHASE 8A: SOMATIC SYMPTOM DISORDER FORM */}
          {isSomaticSymptomRelated && (
              <SomaticSymptomForm
                  key={selectedSymptom}
                  initialData={somaticSymptomData}
                  onChange={(field, value) =>
                      setSomaticSymptomData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* PHASE 8A: ILLNESS ANXIETY DISORDER FORM */}
          {isIllnessAnxietyRelated && (
              <IllnessAnxietyForm
                  key={selectedSymptom}
                  initialData={illnessAnxietyData}
                  onChange={(field, value) =>
                      setIllnessAnxietyData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* PHASE 8A: DEPERSONALIZATION/DEREALIZATION FORM */}
          {isDepersonalizationRelated && (
              <DepersonalizationForm
                  key={selectedSymptom}
                  initialData={depersonalizationData}
                  onChange={(field, value) =>
                      setDepersonalizationData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* PHASE 8A: CYCLOTHYMIC DISORDER FORM */}
          {isCyclothymicRelated && (
              <CyclothymicForm
                  key={selectedSymptom}
                  initialData={cyclothymicData}
                  onChange={(field, value) =>
                      setCyclothymicData(prev => ({ ...prev, [field]: value }))
                  }
              />
          )}

          {/* Phase 9: Cardiovascular Conditions Form */}
          {isCardiovascularRelated && (
              <>
                <WhyTrackThis
                    symptomId={selectedSymptom}
                    category="cardiovascular"
                />
                <CardiovascularForm
                    key={`cardiovascular-${selectedSymptom}`}
                    initialData={cardiovascularData}
                    onChange={(field, value) =>
                        setCardiovascularData(prev => ({ ...prev, [field]: value }))
                    }
                    selectedSymptom={selectedSymptom}
                />
              </>
          )}

          {/* Phase 10: Digestive System Fields */}
          {isDigestivePhase10Related && (
              <DigestiveForm
                  key={`digestive-${selectedSymptom}`}
                  initialData={digestiveData}
                  onChange={(field, value) =>
                      setDigestiveData(prev => ({ ...prev, [field]: value }))
                  }
                  selectedSymptom={selectedSymptom}
              />
          )}

          {/* ============================================ */}
          {/* PHASE 1A: NEUROLOGICAL CONDITION FORMS */}
          {/* ============================================ */}

          {/* Multiple Sclerosis Form */}
          {isMultipleSclerosisRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="multiple-sclerosis" />
                <MultipleSclerosisForm
                    key={selectedSymptom}
                    initialData={multipleSclerosisData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setMultipleSclerosisData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Parkinson's Disease Form */}
          {isParkinsonsRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="parkinsons-disease" />
                <ParkinsonsForm
                    key={selectedSymptom}
                    initialData={parkinsonsData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setParkinsonsData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* Myasthenia Gravis Form */}
          {isMyastheniaRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="myasthenia-gravis" />
                <MyastheniaForm
                    key={selectedSymptom}
                    initialData={myastheniaData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setMyastheniaData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: NARCOLEPSY FORM */}
          {/* ============================================ */}
          {isNarcolepsyRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="narcolepsy" />
                <NarcolepsyForm
                    key={selectedSymptom}
                    initialData={narcolepsyData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setNarcolepsyData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: ALS FORM */}
          {/* ============================================ */}
          {isALSRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="als" />
                <ALSForm
                    key={selectedSymptom}
                    initialData={alsData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setAlsData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: SYRINGOMYELIA FORM */}
          {/* ============================================ */}
          {isSyringomyeliaRelated && (
              <>
                <WhyTrackThis symptomId={selectedSymptom} category="syringomyelia" />
                <SyringomyeliaForm
                    key={selectedSymptom}
                    initialData={syringomyeliaData}
                    selectedSymptom={selectedSymptom}
                    onChange={(field, value) =>
                        setSyringomyeliaData(prev => ({ ...prev, [field]: value }))
                    }
                />
              </>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: MYELITIS FORM */}
          {/* ============================================ */}
          {isMyelitisRelated && (
              <MyelitisForm
                  key={selectedSymptom}
                  initialData={myelitisData}
                  selectedSymptom={selectedSymptom}
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
                  key={`peripheral-${selectedSymptom}`}
                  initialData={peripheralNerveData}
                  onChange={(field, value) =>
                      setPeripheralNerveData(prev => ({ ...prev, [field]: value }))
                  }
                  isUpperExtremityNerveRelated={isUpperExtremityNerveRelated}
              />
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                0-3: Mild (noticeable but manageable) • 4-6: Moderate (affects daily activities) • 7-10: Severe (significantly impairs function)
              </p>
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
                        if (!e.target.checked) setSelectedMedications({});
                      }}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="font-medium text-teal-900 dark:text-teal-200">I took medication for this</span>
                </label>

                {tookMedication && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-teal-700 dark:text-teal-300">Select all that apply:</p>
                      {medications.filter(m => m.isActive).map(med => {
                        const isSelected = !!selectedMedications[med.id];
                        return (
                            <div key={med.id}>
                              <label
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                      isSelected
                                          ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
                                  }`}
                              >
                                <input
                                    type="checkbox"
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
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                {med.name} ({med.dosage})
                              </span>
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
                )}
              </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="What were you doing? What made it better or worse? Did it affect work, sleep, or daily tasks?"
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isVeteran
                  ? '💡 Document triggers, functional impact, and what you couldn\'t do. Specific details strengthen claims.'
                  : '💡 Document triggers and how this affected your day.'}
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

          {/* Related Conditions Suggestions - Veterans Only */}
          {selectedSymptom && relatedConditions.length > 0 && showRelatedConditions && getProfileType() === PROFILE_TYPES.VETERAN && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
                      <span>💡</span> Related Conditions
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Veterans with this condition often also claim:
                    </p>
                  </div>
                  <button
                      type="button"
                      onClick={() => setShowRelatedConditions(false)}
                      className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  {relatedConditions.slice(0, 4).map((condition, index) => (
                      <div
                          key={condition.categoryId || index}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {condition.name}
                          </span>
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                            DC {condition.dcCode}
                          </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {condition.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>

                <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 italic">
                  💡 Tip: Consider adding related conditions to your Chronic Symptoms for easier tracking
                </p>
              </div>
          )}

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