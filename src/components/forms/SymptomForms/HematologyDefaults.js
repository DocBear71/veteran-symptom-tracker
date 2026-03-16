// src/components/forms/SymptomForms/HematologyDefaults.js
// Default state objects for all 8 hematology forms.
// Kept in a separate file to satisfy Vite Fast Refresh:
// files cannot export both React components and plain values.

export const INITIAL_ANEMIA_DATA = {
  type: '',                    // iron-deficiency | b12-deficiency | folate-deficiency | hemolytic | aplastic | sickle-cell | other
  severity: '',                // mild | moderate | severe | incapacitating
  treatment: [],
  supplements: [],
  transfusion_history: '',     // weekly | monthly | quarterly | biannually | annually | one-time
  last_transfusion: '',
};

export const INITIAL_SICKLE_CELL_DATA = {
  crisis_type: '',             // vaso-occlusive | acute-chest | splenic-sequestration | aplastic | hemolytic
  crisis_location: [],         // bones | joints | chest | abdomen | back | extremities
  pain_severity: '',
  crisis_duration: '',         // hours | 1-3-days | 4-7-days | over-week | ongoing
  triggers: [],                // dehydration | cold | stress | infection | altitude | alcohol | unknown
  treatment_received: [],      // home-management | er-visit | hospitalized | iv-fluids | pain-medication | oxygen | blood-transfusion | exchange-transfusion
  hospitalizations_year: '',   // 0 | 1-2 | 3 | 4-plus
};

export const INITIAL_BLEEDING_DISORDER_DATA = {
  disorder_type: '',           // thrombocytopenia | hemophilia | von-willebrand | other
  bleeding_site: [],           // nose | gums | skin | gi | urinary | menstrual | joints | intracranial
  bleeding_frequency: '',      // daily | weekly | monthly | quarterly | rare
  severity: '',
  treatment: [],               // steroids | immunoglobulins | immunosuppressants | tpo-agonists | platelet-transfusion | factor-replacement | splenectomy | monitoring-only
  platelet_count: '',
};

export const INITIAL_INFECTION_DATA = {
  infection_type: [],          // respiratory | uti | skin | oral | sinus | gi | blood | fungal | viral | other
  frequency: '',               // weekly | every-6-weeks | every-3-months | every-6-months | yearly | first-time
  severity: '',                // mild | moderate | severe | hospitalized
  requires_hospitalization: '', // no | yes-current | yes-recent
  treatment: [],               // antibiotics-oral | antibiotics-iv | antifungal | antiviral | prophylactic | growth-factors | ivig | hospitalization
  immune_status: '',           // normal | neutropenia | immunosuppressed | bone-marrow | chemotherapy
};

export const INITIAL_LYMPHOMA_LEUKEMIA_DATA = {
  diagnosis: '',               // hodgkin | non-hodgkin | cll | cml | all | aml | multiple-myeloma | plasmacytoma | mds
  stage: '',                   // stage-1 | stage-2 | stage-3 | stage-4 | early | advanced | unknown
  treatment_status: '',        // active-treatment | remission | partial-remission | maintenance | surveillance | recurrence
  treatment_type: [],          // chemotherapy | radiation | immunotherapy | targeted-therapy | stem-cell | car-t | watch-wait
  cycles_completed: '',
  side_effects: [],            // fatigue | nausea | neuropathy | pain | infections | anemia | bleeding | weight-loss | cognitive | mouth-sores
  last_treatment_date: '',
};

export const INITIAL_POLYCYTHEMIA_DATA = {
  diagnosis: '',               // polycythemia-vera | essential-thrombocythemia | primary-myelofibrosis
  treatment: [],               // phlebotomy | hydroxyurea | interferon | jakafi | aspirin | anagrelide | other-chemo
  phlebotomy_frequency: '',    // weekly | 6-plus-year | 4-5-year | 3-or-less
  last_phlebotomy: '',
  medications: [],             // hydroxyurea-continuous | interferon-continuous | jakafi-continuous | intermittent-therapy
  complications: [],           // blood-clots | stroke | heart-attack | bleeding | gout | enlarged-spleen | itching | headaches
};

export const INITIAL_TREATMENT_DATA = {
  treatment_type: '',          // chemotherapy | radiation | immunotherapy | targeted-therapy | hormone-therapy
  regimen: '',                 // e.g., R-CHOP, ABVD
  cycle_number: '',            // e.g., Cycle 3 of 6
  side_effects: [],            // nausea | vomiting | diarrhea | constipation | fatigue | neuropathy | mouth-sores | hair-loss | skin-changes | appetite-loss | cognitive | pain
  severity: '',                // mild | moderate | severe | life-threatening
  management: [],              // anti-nausea | pain-meds | growth-factors | steroids | nutrition-support | hospitalization | dose-reduction | treatment-delay
};

export const INITIAL_B12_DEFICIENCY_DATA = {
  deficiency_cause: '',        // pernicious-anemia | dietary | malabsorption | gastric-surgery | medications | other
  neurological_symptoms: [],   // numbness-tingling | balance-problems | difficulty-walking | weakness | memory-problems | confusion | mood-changes | vision-changes
  treatment: [],               // injections-weekly | injections-monthly | sublingual | high-dose-oral | nasal-spray | dietary-only
  injection_frequency: '',     // daily | weekly | biweekly | monthly | as-needed
  last_injection: '',
  improvement_noted: '',       // complete | significant | moderate | minimal | none
};