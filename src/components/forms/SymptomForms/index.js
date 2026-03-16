// src/components/forms/SymptomForms/index.js
// Central export for all extracted condition-specific form components.
// Add each new form here as it is extracted from SymptomLogger / EditLogModal.

// ── Pilot Forms (validated) ──────────────────────────────────────────────────
export { default as AnxietyForm, INITIAL_ANXIETY_DATA } from './AnxietyForm.jsx';
export { default as PTSDForm,    INITIAL_PTSD_DATA    } from './PTSDForm.jsx';
export { default as MigraineForm, INITIAL_MIGRAINE_DATA } from './MigraineForm.jsx';

// ── Bulk Extraction (added in order below as extracted) ──────────────────────
export {
  MultipleSclerosisForm, INITIAL_MULTIPLE_SCLEROSIS_DATA,
  ParkinsonsForm,        INITIAL_PARKINSONS_DATA,
  MyastheniaForm,        INITIAL_MYASTHENIA_DATA,
  NarcolepsyForm,        INITIAL_NARCOLEPSY_DATA,
  ALSForm,               INITIAL_ALS_DATA,
  SyringomyeliaForm,     INITIAL_SYRINGOMYELIA_DATA,
  MyelitisForm,          INITIAL_MYELITIS_DATA,
} from './NeurologicalForm.jsx';
export {
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
} from './MentalHealthForm.jsx';
export { default as GIForm, INITIAL_GI_DATA } from './GIForm.jsx';
export { default as RespiratoryForm, INITIAL_RESPIRATORY_DATA } from './RespiratoryForm.jsx';
export { default as SleepForm, INITIAL_SLEEP_DATA } from './SleepForm.jsx';
export { default as CardiovascularForm, INITIAL_CARDIOVASCULAR_DATA } from './CardiovascularForm.jsx';
export { default as PainForm, INITIAL_PAIN_DATA } from './PainForm.jsx';
export { default as SeizureForm,      INITIAL_SEIZURE_DATA      } from './SeizureForm.jsx';
export {
  HIVForm, HepatitisForm, LymeForm, MalariaForm, BrucellosisForm,
  CampylobacterForm, QFeverForm, SalmonellaForm, ShigellaForm,
  WestNileForm, NTMForm,
} from './InfectiousDiseaseForm.jsx';
export {
  INITIAL_HIV_DATA, INITIAL_HEPATITIS_DATA, INITIAL_LYME_DATA,
  INITIAL_MALARIA_DATA, INITIAL_BRUCELLOSIS_DATA, INITIAL_CAMPYLOBACTER_DATA,
  INITIAL_QFEVER_DATA, INITIAL_SALMONELLA_DATA, INITIAL_SHIGELLA_DATA,
  INITIAL_WEST_NILE_DATA, INITIAL_NTM_DATA,
} from './InfectiousDiseaseDefaults.js';
export { default as DentalForm,       INITIAL_DENTAL_DATA       } from './DentalForm.jsx';
export { default as PeripheralNerveForm, INITIAL_PERIPHERAL_NERVE_DATA } from './PeripheralNerveForm.jsx';
export {
  JointForm,  INITIAL_JOINT_DATA,
  SpineForm,  INITIAL_SPINE_DATA,
} from './MusculoskeletalForm.jsx';
export { default as GenitourinaryForm, INITIAL_GENITOURINARY_DATA } from './GenitourinaryForm.jsx';
export { default as GynecologicalForm, INITIAL_GYNECOLOGICAL_DATA } from './GynecologicalForm.jsx';
export {
  AnemiaForm,           BleedingDisorderForm,
  InfectionForm,        LymphomaLeukemiaForm,
  PolycythemiaForm,     SickleCellForm,
  TreatmentForm,        B12DeficiencyForm,
} from './HematologyForm.jsx';
export {
  INITIAL_ANEMIA_DATA,
  INITIAL_SICKLE_CELL_DATA,
  INITIAL_BLEEDING_DISORDER_DATA,
  INITIAL_INFECTION_DATA,
  INITIAL_LYMPHOMA_LEUKEMIA_DATA,
  INITIAL_POLYCYTHEMIA_DATA,
  INITIAL_TREATMENT_DATA,
  INITIAL_B12_DEFICIENCY_DATA,
} from './HematologyDefaults.js';
export { default as DigestiveForm, INITIAL_DIGESTIVE_DATA } from './DigestiveForm.jsx';
