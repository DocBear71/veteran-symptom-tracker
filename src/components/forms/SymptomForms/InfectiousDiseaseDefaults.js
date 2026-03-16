// src/components/forms/SymptomForms/InfectiousDiseaseDefaults.js
// Initial data constants for all Phase 6 infectious disease forms.
// Separated from InfectiousDiseaseForm.jsx to satisfy Vite Fast Refresh rules
// (a file cannot export both React components and plain values).

export const INITIAL_HIV_DATA = {
  infectionType: '',
  constitutionalSymptoms: [],
  weightLossPercentage: '',
  onAntiretrovirals: false,
  cd4CountKnown: false,
  cd4Range: '',
  treatmentCompliance: '',
};

export const INITIAL_HEPATITIS_DATA = {
  weightLossPercentage: '',
  debilitating: false,
  dietaryRestrictions: false,
  symptomFrequency: '',
};

export const INITIAL_LYME_DATA = {
  activeTreatment: false,
  treatmentCompleted: false,
  treatmentStartDate: '',
  rashPresent: false,
  rashType: '',
  neurologicalSymptoms: [],
  jointSymptoms: [],
};

export const INITIAL_MALARIA_DATA = {
  relapseEpisode: false,
  hospitalized: false,
  continuousMedication: false,
  severeComplications: false,
  feverTemperature: '',
  cyclicalPattern: false,
};

export const INITIAL_BRUCELLOSIS_DATA = {
  relapseEpisode: false,
  multiOrganInvolvement: false,
  chronicArthritis: false,
  neurobrucellosis: false,
  undulantFever: false,
};

export const INITIAL_CAMPYLOBACTER_DATA = {
  guillainBarre: false,
  reactiveArthritis: false,
  chronicIBS: false,
  weeksSinceInfection: '',
  stoolCultureConfirmed: false,
};

export const INITIAL_QFEVER_DATA = {
  chronicQFever: false,
  endocarditis: false,
  fatigueSyndrome: false,
  monthsSinceInfection: '',
  phaseIAntibodies: false,
};

export const INITIAL_SALMONELLA_DATA = {
  hospitalized: false,
  bacteremia: false,
  reactiveArthritis: false,
  severeComplications: false,
  stoolCultureConfirmed: false,
};

export const INITIAL_SHIGELLA_DATA = {
  hospitalized: false,
  hus: false,
  reactiveArthritis: false,
  severeComplications: false,
  stoolCultureConfirmed: false,
};

export const INITIAL_WEST_NILE_DATA = {
  neuroinvasive: false,
  encephalitis: false,
  acuteFlaccidParalysis: false,
  permanentImpairment: false,
  serologyConfirmed: false,
};

export const INITIAL_NTM_DATA = {
  activeDisease: false,
  onTreatment: false,
  disseminated: false,
  monthsOnTreatment: '',
  ntmSpecies: '',
};