/* eslint-disable no-unused-vars */

// ============================================
// HEMIC & LYMPHATIC SYSTEM RATING LOGIC
// ============================================
// Extracted from ratingCriteria.js — Phase 8 of the modular refactor
// Covers 38 CFR Part 4, § 4.117 (Diagnostic Code 7700 series)
//
// Conditions included:
//   DC 7703 — Leukemia
//   DC 7704 — Polycythemia Vera
//   DC 7705 — Immune Thrombocytopenia (ITP)
//   DC 7709 — Hodgkin's Lymphoma
//   DC 7712 — Multiple Myeloma
//   DC 7714 — Sickle Cell Anemia
//   DC 7715 — Non-Hodgkin's Lymphoma
//   DC 7716 — Aplastic Anemia
//   DC 7718 — Essential Thrombocythemia / Primary Myelofibrosis
//   DC 7719 — Chronic Myelogenous Leukemia (CML)
//   DC 7720 — Iron Deficiency Anemia
//   DC 7721 — Folate Deficiency Anemia
//   DC 7722 — Pernicious Anemia (B12 Deficiency)
//   DC 7723 — Acquired Hemolytic Anemia
//   DC 7724 — Solitary Plasmacytoma
//   DC 7725 — Myelodysplastic Syndromes (MDS)

// ============================================
// SHARED HELPERS
// ============================================

/**
 * Safely retrieve a symptom ID from a log entry.
 * Supports both current (symptomId) and legacy (symptom) field names.
 * @param {Object} log
 * @returns {string|null}
 */
const getLogSymptomId = (log) => log.symptomId || log.symptom || null;

// ============================================
// CONDITION REGISTRY
// ============================================

export const HEMIC_LYMPHATIC_CONDITIONS = {
  IRON_DEFICIENCY_ANEMIA: {
    id: 'iron-deficiency-anemia',
    name: 'Iron Deficiency Anemia',
    diagnosticCode: '7720',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'shortness-of-breath-anemia', 'pale-skin', 'cold-extremities'],
  },
  FOLATE_DEFICIENCY_ANEMIA: {
    id: 'folate-deficiency-anemia',
    name: 'Folate Deficiency Anemia',
    diagnosticCode: '7721',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'shortness-of-breath-anemia', 'pale-skin'],
  },
  PERNICIOUS_ANEMIA: {
    id: 'pernicious-anemia',
    name: 'Pernicious Anemia (B12 Deficiency)',
    diagnosticCode: '7722',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'pale-skin', 'balance-problems', 'confusion', 'weakness'],
  },
  HEMOLYTIC_ANEMIA: {
    id: 'hemolytic-anemia',
    name: 'Acquired Hemolytic Anemia',
    diagnosticCode: '7723',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'jaundice', 'dark-urine'],
  },
  SICKLE_CELL_ANEMIA: {
    id: 'sickle-cell-anemia',
    name: 'Sickle Cell Anemia',
    diagnosticCode: '7714',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['pain-crisis', 'fatigue-anemia', 'jaundice'],
  },
  APLASTIC_ANEMIA: {
    id: 'aplastic-anemia',
    name: 'Aplastic Anemia',
    diagnosticCode: '7716',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'frequent-infections', 'easy-bruising'],
  },
  POLYCYTHEMIA_VERA: {
    id: 'polycythemia-vera',
    name: 'Polycythemia Vera',
    diagnosticCode: '7704',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['headache-polycythemia', 'itching-after-shower', 'redness-face'],
  },
  IMMUNE_THROMBOCYTOPENIA: {
    id: 'immune-thrombocytopenia',
    name: 'Immune Thrombocytopenia (ITP)',
    diagnosticCode: '7705',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['easy-bruising', 'prolonged-bleeding', 'petechiae'],
  },
  LEUKEMIA: {
    id: 'leukemia',
    name: 'Leukemia',
    diagnosticCode: '7703',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['bone-pain-leukemia', 'night-sweats-blood', 'frequent-infections', 'fatigue-anemia'],
  },
  HODGKINS_LYMPHOMA: {
    id: 'hodgkins-lymphoma',
    name: "Hodgkin's Lymphoma",
    diagnosticCode: '7709',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['swollen-lymph-nodes', 'night-sweats-blood', 'weight-loss-unexplained'],
  },
  MULTIPLE_MYELOMA: {
    id: 'multiple-myeloma',
    name: 'Multiple Myeloma',
    diagnosticCode: '7712',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['bone-pain-leukemia', 'fatigue-anemia', 'kidney-problems'],
  },
  NON_HODGKINS_LYMPHOMA: {
    id: 'non-hodgkins-lymphoma',
    name: "Non-Hodgkin's Lymphoma",
    diagnosticCode: '7715',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['swollen-lymph-nodes', 'night-sweats-blood', 'weight-loss-unexplained'],
  },
  ESSENTIAL_THROMBOCYTHEMIA: {
    id: 'essential-thrombocythemia',
    name: 'Essential Thrombocythemia / Primary Myelofibrosis',
    diagnosticCode: '7718',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['headache-polycythemia', 'abdominal-fullness', 'easy-bruising'],
  },
  CHRONIC_MYELOGENOUS_LEUKEMIA: {
    id: 'chronic-myelogenous-leukemia',
    name: 'Chronic Myelogenous Leukemia (CML)',
    diagnosticCode: '7719',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['bone-pain-leukemia', 'fatigue-anemia', 'weight-loss-unexplained'],
  },
  SOLITARY_PLASMACYTOMA: {
    id: 'solitary-plasmacytoma',
    name: 'Solitary Plasmacytoma',
    diagnosticCode: '7724',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['bone-pain-leukemia'],
  },
  MYELODYSPLASTIC_SYNDROMES: {
    id: 'myelodysplastic-syndromes',
    name: 'Myelodysplastic Syndromes (MDS)',
    diagnosticCode: '7725',
    cfrReference: '38 CFR 4.117',
    symptomIds: ['fatigue-anemia', 'frequent-infections', 'easy-bruising'],
  },
};

// ============================================
// CRITERIA BLOCKS — 38 CFR § 4.117
// ============================================

// -----------------------------------------------------------------
// DC 7720 — IRON DEFICIENCY ANEMIA
// -----------------------------------------------------------------
export const IRON_DEFICIENCY_ANEMIA_CRITERIA = {
  diagnosticCode: '7720',
  condition: 'Iron Deficiency Anemia',
  cfrReference: '38 CFR § 4.117',
  note: 'Do not evaluate iron deficiency anemia due to blood loss under this diagnostic code. Evaluate iron deficiency anemia due to blood loss under the criteria for the condition causing the blood loss.',
  ratings: [
    {
      percent: 30,
      summary: 'IV iron infusions 4+ times per year',
      criteriaDescription: [
        'Requiring intravenous iron infusions 4 or more times per 12-month period',
      ],
      evidenceNeeded: [
        'Medical records documenting IV iron infusion dates (at least 4 within 12 months)',
        'Lab results showing persistent iron deficiency despite treatment',
        'Provider statement regarding treatment frequency and necessity',
        'Documentation of oral iron supplementation failure or intolerance',
      ],
    },
    {
      percent: 10,
      summary: 'IV iron 1-3x/year OR continuous oral supplementation',
      criteriaDescription: [
        'Requiring intravenous iron infusions at least 1 time but less than 4 times per 12-month period, OR',
        'Requiring continuous treatment with oral supplementation',
      ],
      evidenceNeeded: [
        'Medical records of IV iron treatments (if applicable)',
        'Prescription records showing continuous oral iron supplementation',
        'Lab results (hemoglobin, ferritin, iron panel) showing improvement with treatment',
        'Provider statement regarding ongoing treatment requirement',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or dietary modification only',
      criteriaDescription: [
        'Asymptomatic, OR',
        'Requiring treatment only by dietary modification',
      ],
      evidenceNeeded: [
        'Documentation that symptoms resolved with diet changes',
        'Lab results showing normal iron levels with dietary management',
        'No ongoing medication treatment required',
      ],
    },
  ],
  definitions: {
    'Iron Deficiency Anemia': 'A condition where the body lacks sufficient iron to produce adequate hemoglobin',
    'IV Iron Infusion': 'Intravenous administration of iron when oral supplementation is ineffective or not tolerated',
    'Ferritin': 'A blood protein that stores iron; low ferritin indicates iron deficiency',
    'Continuous Oral Supplementation': 'Daily or regular oral iron pills taken on an ongoing basis',
  },
  disclaimer: 'This rating is for iron deficiency anemia not caused by blood loss. If anemia is due to blood loss from another condition, rate under the diagnostic code for the underlying condition.',
};


// -----------------------------------------------------------------
// DC 7721 — FOLATE DEFICIENCY ANEMIA
// -----------------------------------------------------------------
export const FOLATE_DEFICIENCY_ANEMIA_CRITERIA = {
  diagnosticCode: '7721',
  condition: 'Folate Deficiency Anemia',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 30,
      summary: 'Requiring intravenous folate 4+ times per year',
      criteriaDescription: [
        'Requiring intravenous folate infusions 4 or more times per 12-month period',
      ],
      evidenceNeeded: [
        'Medical records documenting IV folate treatment dates',
        'Lab results showing folate levels and RBC indices',
        'Documentation of oral folate failure or malabsorption',
      ],
    },
    {
      percent: 10,
      summary: 'IV folate 1-3x/year OR continuous oral folate',
      criteriaDescription: [
        'Requiring intravenous folate infusions 1-3 times per 12-month period, OR',
        'Requiring continuous treatment with oral folate supplementation',
      ],
      evidenceNeeded: [
        'Medical records of IV folate treatments',
        'Prescription records showing continuous oral folate',
        'Lab results showing improvement with treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or dietary modification only',
      criteriaDescription: [
        'Asymptomatic, OR',
        'Requiring treatment only by dietary modification',
      ],
    },
  ],
  definitions: {
    'Folate': 'Vitamin B9, essential for red blood cell production and DNA synthesis',
    'Malabsorption': "Inability to absorb folate from the diet (seen in celiac disease, Crohn's disease)",
  },
};


// -----------------------------------------------------------------
// DC 7722 — PERNICIOUS ANEMIA / B12 DEFICIENCY
// -----------------------------------------------------------------
export const PERNICIOUS_ANEMIA_CRITERIA = {
  diagnosticCode: '7722',
  condition: 'Pernicious Anemia or Vitamin B12 Deficiency',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'With central nervous system involvement',
      criteriaDescription: [
        'With central nervous system involvement',
        'Manifested by significant neurological symptoms such as:',
        '- Subacute combined degeneration of the spinal cord',
        '- Peripheral neuropathy',
        '- Cognitive impairment',
        '- Ataxia or gait disturbances',
      ],
      evidenceNeeded: [
        'Neurology evaluation documenting CNS involvement',
        'MRI or neurological testing showing spinal cord or nerve damage',
        'Documentation of neurological symptoms and functional limitations',
        'Lab results showing B12 deficiency and elevated methylmalonic acid',
      ],
    },
    {
      percent: 30,
      summary: 'B12 injections 4+ times per year',
      criteriaDescription: [
        'Requiring B12 injections 4 or more times per 12-month period',
      ],
      evidenceNeeded: [
        'Medical records documenting B12 injection dates',
        'Lab results showing B12 deficiency',
        'Documentation of why oral B12 is ineffective',
      ],
    },
    {
      percent: 10,
      summary: 'B12 injections 1-3x/year OR continuous oral B12',
      criteriaDescription: [
        'Requiring B12 injections 1-3 times per 12-month period, OR',
        'Requiring continuous treatment with oral B12 or sublingual supplementation',
      ],
      evidenceNeeded: [
        'Medical records or prescription records',
        'Lab results showing B12 levels with treatment',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or dietary only',
      criteriaDescription: [
        'Asymptomatic, OR',
        'Requiring treatment only by dietary modification',
      ],
    },
  ],
  definitions: {
    'Pernicious Anemia': 'Autoimmune condition preventing B12 absorption due to lack of intrinsic factor',
    'Intrinsic Factor': 'Protein needed to absorb B12 in the intestines',
    'Subacute Combined Degeneration': 'Spinal cord damage from B12 deficiency causing weakness, numbness, difficulty walking',
    'Methylmalonic Acid': 'Substance elevated in B12 deficiency, used for diagnosis',
  },
  disclaimer: 'CNS involvement (100% rating) requires documented neurological damage, not just symptoms of fatigue or mild memory issues.',
};


// -----------------------------------------------------------------
// DC 7723 — ACQUIRED HEMOLYTIC ANEMIA
// -----------------------------------------------------------------
export const HEMOLYTIC_ANEMIA_CRITERIA = {
  diagnosticCode: '7723',
  condition: 'Acquired Hemolytic Anemia',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant',
      criteriaDescription: [
        'Requiring bone marrow or stem cell transplant',
      ],
      evidenceNeeded: [
        'Medical records documenting bone marrow/stem cell transplant',
        'Transplant procedure reports',
        'Post-transplant care documentation',
      ],
    },
    {
      percent: 70,
      summary: 'Severe — transfusions every 6 weeks',
      criteriaDescription: [
        'Requiring blood transfusions at least once every 6 weeks',
      ],
      evidenceNeeded: [
        'Transfusion records showing frequency',
        'Lab results (hemoglobin, hematocrit, reticulocyte count)',
        'Documentation of ongoing hemolysis',
      ],
    },
    {
      percent: 50,
      summary: 'Moderate — transfusions every 3 months + continuous immunosuppression',
      criteriaDescription: [
        'Requiring blood transfusions at least once every 3 months, AND',
        'Requiring continuous immunosuppressive therapy',
      ],
      evidenceNeeded: [
        'Transfusion records',
        'Prescription records for immunosuppressive medications',
        'Lab monitoring results',
      ],
    },
    {
      percent: 30,
      summary: 'Immunosuppression only OR occasional transfusions',
      criteriaDescription: [
        'Requiring continuous immunosuppressive therapy, OR',
        'Requiring blood transfusions at least once per year but less than once per 3 months',
      ],
      evidenceNeeded: [
        'Prescription records or transfusion records',
        'Lab results showing disease activity',
      ],
    },
    {
      percent: 10,
      summary: 'Managed with oral medication',
      criteriaDescription: [
        'Requiring continuous treatment with oral medication (e.g., corticosteroids, immunosuppressants)',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or no treatment',
      criteriaDescription: [
        'Asymptomatic, OR',
        'Not requiring treatment',
      ],
    },
  ],
  definitions: {
    'Acquired Hemolytic Anemia': 'Condition where red blood cells are destroyed prematurely by the immune system or other causes',
    'Immunosuppressive Therapy': 'Medications that suppress the immune system (e.g., prednisone, azathioprine, rituximab)',
    'Reticulocyte Count': 'Measure of young red blood cells; elevated in hemolytic anemia as body tries to replace destroyed cells',
  },
};


// -----------------------------------------------------------------
// DC 7714 — SICKLE CELL ANEMIA
// -----------------------------------------------------------------
export const SICKLE_CELL_ANEMIA_CRITERIA = {
  diagnosticCode: '7714',
  condition: 'Sickle Cell Anemia',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: '4+ painful crises per year requiring hospitalization OR chronic organ damage',
      criteriaDescription: [
        'With at least 4 or more painful crises per year requiring parenteral (intravenous or intramuscular) opioid analgesics or hospitalization for pain management, OR',
        'With chronic organ damage such as stroke, end-stage renal disease, or severe pulmonary hypertension',
      ],
      evidenceNeeded: [
        'Medical records documenting 4+ hospitalizations or ER visits per year for sickle cell crises',
        'Inpatient or ER records showing IV pain management',
        'If organ damage: imaging studies, organ function tests, specialty consult reports',
        'Hematology consult reports',
      ],
    },
    {
      percent: 60,
      summary: '3 painful crises per year requiring hospitalization',
      criteriaDescription: [
        'With at least 3 painful crises per year requiring parenteral opioid analgesics or hospitalization for pain management',
      ],
      evidenceNeeded: [
        'Medical records documenting 3 hospitalizations or ER visits per year',
        'Documentation of IV pain medication administration',
      ],
    },
    {
      percent: 30,
      summary: '1-2 painful crises per year requiring medical attention',
      criteriaDescription: [
        'With at least 1 or 2 painful crises per year requiring parenteral opioid analgesics or hospitalization for pain management',
      ],
      evidenceNeeded: [
        'Medical records of 1-2 crises per year requiring medical treatment',
        'ER or clinic visit records showing pain crisis management',
      ],
    },
    {
      percent: 10,
      summary: 'Asymptomatic with documented organ impairment',
      criteriaDescription: [
        'Asymptomatic, with at least one of the following:',
        '- Hemoglobin S greater than 40 percent',
        '- Asplenia (absent or non-functioning spleen)',
        '- History of painful crises or acute chest syndrome',
      ],
      evidenceNeeded: [
        'Lab results showing hemoglobin electrophoresis with HbS > 40%',
        'Imaging showing absent/non-functioning spleen',
        'Medical history documentation of previous crises',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic sickle cell trait',
      criteriaDescription: [
        'Sickle cell trait (carrier) without symptoms or complications',
      ],
    },
  ],
  definitions: {
    'Painful Crisis (Vaso-occlusive Crisis)': 'Episode where sickled cells block blood vessels causing severe pain',
    'Parenteral Opioid': 'Pain medication given intravenously (IV) or intramuscularly (IM), not by mouth',
    'Acute Chest Syndrome': 'Life-threatening complication with lung involvement, fever, chest pain',
    'Asplenia': 'Absent or non-functioning spleen (common in sickle cell disease)',
    'Hemoglobin S': 'Abnormal hemoglobin that causes red blood cells to sickle',
  },
  disclaimer: 'Crises must require parenteral (IV/IM) opioids or hospitalization to count toward rating. Home-managed pain episodes do not qualify.',
};


// -----------------------------------------------------------------
// DC 7716 — APLASTIC ANEMIA
// -----------------------------------------------------------------
export const APLASTIC_ANEMIA_CRITERIA = {
  diagnosticCode: '7716',
  condition: 'Aplastic Anemia',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant OR transfusions every 6 weeks',
      criteriaDescription: [
        'Requiring bone marrow or stem cell transplant, OR',
        'Requiring transfusions at least once every 6 weeks with infections recurring at least once every 6 weeks despite prophylactic antibiotic therapy',
      ],
      evidenceNeeded: [
        'Bone marrow transplant records, OR',
        'Transfusion records showing frequency (every 6 weeks)',
        'Infection documentation (cultures, treatment records)',
        'Prescription records for prophylactic antibiotics',
      ],
    },
    {
      percent: 70,
      summary: 'Transfusions every 3 months + immunosuppression',
      criteriaDescription: [
        'Requiring transfusions at least once every 3 months, AND',
        'Requiring continuous immunosuppressive therapy',
      ],
      evidenceNeeded: [
        'Transfusion records',
        'Prescription records for immunosuppressive medications (cyclosporine, ATG, etc.)',
      ],
    },
    {
      percent: 50,
      summary: 'Immunosuppression + growth factors',
      criteriaDescription: [
        'Requiring continuous immunosuppressive therapy, AND',
        'Requiring continuous treatment with myeloid growth factors',
      ],
      evidenceNeeded: [
        'Prescription records for immunosuppressants',
        'Prescription or treatment records for growth factors (G-CSF, GM-CSF, EPO)',
      ],
    },
    {
      percent: 30,
      summary: 'Immunosuppression only',
      criteriaDescription: [
        'Requiring continuous immunosuppressive therapy',
      ],
      evidenceNeeded: [
        'Prescription records for continuous immunosuppressive medications',
      ],
    },
    {
      percent: 10,
      summary: 'Growth factors only',
      criteriaDescription: [
        'Requiring continuous treatment with myeloid growth factors',
      ],
      evidenceNeeded: [
        'Prescription or treatment records for growth factors',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or no treatment',
      criteriaDescription: [
        'Asymptomatic, OR',
        'Not requiring treatment',
      ],
    },
  ],
  definitions: {
    'Aplastic Anemia': 'Bone marrow failure resulting in low production of all blood cells (pancytopenia)',
    'Myeloid Growth Factors': 'Medications that stimulate bone marrow (G-CSF, GM-CSF, erythropoietin)',
    'Immunosuppressive Therapy': 'Treatment to suppress immune system (cyclosporine, ATG, eltrombopag)',
    'Prophylactic Antibiotics': 'Preventive antibiotics taken continuously to prevent infections',
  },
};


// -----------------------------------------------------------------
// DC 7704 — POLYCYTHEMIA VERA
// -----------------------------------------------------------------
export const POLYCYTHEMIA_VERA_CRITERIA = {
  diagnosticCode: '7704',
  condition: 'Polycythemia Vera',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant',
      criteriaDescription: ['Requiring bone marrow or stem cell transplant'],
      evidenceNeeded: ['Bone marrow/stem cell transplant records'],
    },
    {
      percent: 75,
      summary: 'Phlebotomy 6+ times/year AND medication',
      criteriaDescription: [
        'Requiring phlebotomy 6 or more times per year, AND',
        'Requiring continuous myelosuppressive treatment',
      ],
      evidenceNeeded: [
        'Phlebotomy records showing 6+ procedures per year',
        'Prescription records for hydroxyurea, interferon, or JAK inhibitor',
      ],
    },
    {
      percent: 60,
      summary: 'Phlebotomy 4-5 times/year AND medication',
      criteriaDescription: [
        'Requiring phlebotomy 4 or 5 times per year, AND',
        'Requiring continuous myelosuppressive treatment',
      ],
      evidenceNeeded: [
        'Phlebotomy records',
        'Prescription records for myelosuppressive medications',
      ],
    },
    {
      percent: 50,
      summary: 'Phlebotomy 4-5 times/year OR continuous medication',
      criteriaDescription: [
        'Requiring phlebotomy 4 or 5 times per year, OR',
        'Requiring continuous myelosuppressive treatment',
      ],
      evidenceNeeded: ['Phlebotomy records OR prescription records'],
    },
    {
      percent: 40,
      summary: 'Phlebotomy 3 times/year OR continuous medication',
      criteriaDescription: [
        'Requiring phlebotomy at least 3 times per year, OR',
        'Requiring continuous myelosuppressive treatment',
      ],
      evidenceNeeded: ['Phlebotomy records OR prescription records'],
    },
    {
      percent: 20,
      summary: 'Phlebotomy 1-2 times/year',
      criteriaDescription: [
        'Requiring phlebotomy at least 1 time but less than 3 times per year',
      ],
      evidenceNeeded: ['Phlebotomy records'],
    },
    {
      percent: 10,
      summary: 'Managed with aspirin only',
      criteriaDescription: [
        'Requiring continuous treatment with low-dose aspirin or other antiplatelet medication only',
      ],
      evidenceNeeded: ['Prescription records'],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or no treatment',
      criteriaDescription: ['Asymptomatic, OR', 'Not requiring treatment'],
    },
  ],
  definitions: {
    'Polycythemia Vera': 'Myeloproliferative disorder causing overproduction of red blood cells',
    'Phlebotomy': 'Therapeutic bloodletting to reduce red blood cell count and blood viscosity',
    'Myelosuppressive Treatment': 'Medications to reduce blood cell production (hydroxyurea, interferon, ruxolitinib/Jakafi)',
    'JAK Inhibitor': 'Ruxolitinib (Jakafi) — targeted therapy for polycythemia vera',
  },
};


// -----------------------------------------------------------------
// DC 7705 — IMMUNE THROMBOCYTOPENIA (ITP)
// -----------------------------------------------------------------
export const IMMUNE_THROMBOCYTOPENIA_CRITERIA = {
  diagnosticCode: '7705',
  condition: 'Immune Thrombocytopenia (ITP)',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant OR platelet count <20,000',
      criteriaDescription: [
        'Requiring bone marrow or stem cell transplant, OR',
        'With platelet count less than 20,000 AND',
        '- Requiring continuous treatment with immunosuppressive therapy',
        '- Spontaneous bleeding, OR',
        '- Bleeding requiring transfusion',
      ],
      evidenceNeeded: [
        'Bone marrow transplant records, OR',
        'Multiple lab results showing platelet count <20,000',
        'Documentation of bleeding episodes',
        'Prescription records for immunosuppressive medications',
        'Transfusion records if applicable',
      ],
    },
    {
      percent: 70,
      summary: 'Platelet count 20,000-30,000 with bleeding',
      criteriaDescription: [
        'With platelet count of 20,000 to 30,000 AND',
        '- Requiring continuous treatment with immunosuppressive therapy',
        '- With either spontaneous bleeding OR bleeding with minor trauma',
      ],
      evidenceNeeded: [
        'Lab results showing platelet count 20,000-30,000',
        'Prescription records for immunosuppressive therapy',
        'Documentation of bleeding episodes',
      ],
    },
    {
      percent: 50,
      summary: 'Platelet count 30,000-50,000 with treatment',
      criteriaDescription: [
        'With platelet count of 30,000 to 50,000, AND',
        'Requiring continuous treatment with immunosuppressive therapy',
      ],
      evidenceNeeded: [
        'Lab results showing platelet count 30,000-50,000',
        'Prescription records for continuous immunosuppressive medications',
      ],
    },
    {
      percent: 30,
      summary: 'Platelet count 50,000-70,000 with treatment',
      criteriaDescription: [
        'With platelet count of 50,000 to 70,000, AND',
        'Requiring continuous treatment with immunosuppressive therapy',
      ],
      evidenceNeeded: ['Lab results', 'Prescription records'],
    },
    {
      percent: 10,
      summary: 'Platelet count 70,000-100,000',
      criteriaDescription: ['With platelet count of 70,000 to 100,000'],
      evidenceNeeded: ['Lab results showing platelet count'],
    },
    {
      percent: 0,
      summary: 'Platelet count >100,000 or asymptomatic',
      criteriaDescription: [
        'With platelet count greater than 100,000, OR',
        'Asymptomatic',
      ],
    },
  ],
  definitions: {
    'Immune Thrombocytopenia (ITP)': 'Autoimmune disorder causing low platelet count and increased bleeding risk',
    'Platelet Count': 'Normal range is 150,000-400,000 per μL',
    'Immunosuppressive Therapy': 'Corticosteroids, IVIG, rituximab, TPO receptor agonists, immunosuppressants',
    'Spontaneous Bleeding': 'Bleeding without trauma (petechiae, purpura, nosebleeds, gum bleeding)',
  },
  disclaimer: 'Rating is based on the platelet count AND whether immunosuppressive treatment is required. Both factors matter.',
};


// -----------------------------------------------------------------
// DC 7703 — LEUKEMIA
// -----------------------------------------------------------------
export const LEUKEMIA_CRITERIA = {
  diagnosticCode: '7703',
  condition: 'Leukemia (Acute and Chronic)',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'During active treatment OR bone marrow transplant',
      criteriaDescription: [
        'Requiring chemotherapy, bone marrow or stem cell transplant, or other ongoing treatment modality, OR',
        'Status post bone marrow or stem cell transplant with chronic graft versus host disease',
      ],
      evidenceNeeded: [
        'Medical records documenting active treatment (chemotherapy, targeted therapy, etc.)',
        'Treatment schedule and protocols',
        'Bone marrow transplant records if applicable',
        'Documentation of graft versus host disease if post-transplant',
      ],
    },
    {
      percent: 60,
      summary: 'Post-treatment with residual symptoms',
      criteriaDescription: [
        'Following treatment, with residual symptoms such as:',
        '- Chronic fatigue',
        '- Anemia requiring treatment',
        '- Thrombocytopenia',
        '- Neuropathy',
        '- Infections',
        '- Other treatment-related complications',
      ],
      evidenceNeeded: [
        'Documentation that active treatment has ended',
        'Medical records showing residual symptoms and ongoing management',
        'Lab results showing persistent abnormalities',
      ],
    },
    {
      percent: 30,
      summary: 'In remission with surveillance only',
      criteriaDescription: [
        'In complete remission, requiring only surveillance (regular follow-up visits and blood tests)',
      ],
      evidenceNeeded: [
        'Oncology notes documenting complete remission',
        'Follow-up schedule',
        'Recent lab results showing remission',
      ],
    },
  ],
  definitions: {
    'Acute Leukemia': 'Rapidly progressing cancer of blood-forming tissues (ALL, AML)',
    'Chronic Leukemia': 'Slowly progressing blood cancer (CLL, CML)',
    'Complete Remission': 'No evidence of leukemia cells in blood or bone marrow',
    'Graft Versus Host Disease': 'Complication after bone marrow transplant where donor cells attack recipient tissues',
    'Surveillance': 'Regular monitoring without active treatment',
  },
  disclaimer: 'Rating is 100% during all active treatment. After treatment ends, rating decreases based on residual symptoms and remission status.',
};


// -----------------------------------------------------------------
// DC 7709 — HODGKIN'S LYMPHOMA
// -----------------------------------------------------------------
export const HODGKINS_LYMPHOMA_CRITERIA = {
  diagnosticCode: '7709',
  condition: "Hodgkin's Lymphoma (Hodgkin's Disease)",
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'During active treatment',
      criteriaDescription: [
        'Requiring chemotherapy, radiation therapy, bone marrow or stem cell transplant, or other ongoing treatment',
      ],
      evidenceNeeded: [
        'Medical records documenting active treatment',
        'Treatment schedule and protocols',
        'Oncology consultation reports',
      ],
    },
    {
      percent: 60,
      summary: 'Post-treatment with residual symptoms',
      criteriaDescription: [
        'Following treatment, with residual symptoms such as:',
        '- Chronic fatigue',
        '- Residual lymphadenopathy',
        '- Treatment-related complications (neuropathy, cardiac issues, etc.)',
      ],
      evidenceNeeded: [
        'Documentation that treatment has ended',
        'Medical records showing residual symptoms',
        'Imaging showing residual disease or complications',
      ],
    },
    {
      percent: 30,
      summary: 'In remission with surveillance',
      criteriaDescription: [
        'In complete remission, requiring only surveillance',
      ],
      evidenceNeeded: [
        'Oncology notes documenting complete remission',
        'PET/CT scans showing no active disease',
        'Follow-up schedule',
      ],
    },
  ],
  definitions: {
    "Hodgkin's Lymphoma": 'Cancer of the lymphatic system characterized by Reed-Sternberg cells',
    'Lymphadenopathy': 'Enlarged lymph nodes',
    'PET/CT Scan': 'Imaging used to assess for active lymphoma',
  },
  disclaimer: 'Rating is 100% during all active treatment. Reduces after treatment completion based on remission status.',
};


// -----------------------------------------------------------------
// DC 7712 — MULTIPLE MYELOMA
// -----------------------------------------------------------------
export const MULTIPLE_MYELOMA_CRITERIA = {
  diagnosticCode: '7712',
  condition: 'Multiple Myeloma',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'During active treatment',
      criteriaDescription: [
        'Requiring chemotherapy, bone marrow or stem cell transplant, or other ongoing treatment modality',
      ],
      evidenceNeeded: [
        'Medical records documenting active treatment',
        'Treatment protocols',
        'Hematology/oncology consultation reports',
      ],
    },
    {
      percent: 60,
      summary: 'Post-treatment with residual symptoms',
      criteriaDescription: [
        'Following treatment, with residual symptoms such as:',
        '- Bone pain requiring narcotic medication',
        '- Pathological fractures',
        '- Anemia',
        '- Renal insufficiency',
        '- Neuropathy',
        '- Infections',
      ],
      evidenceNeeded: [
        'Documentation of residual symptoms and complications',
        'Imaging showing bone lesions or fractures',
        'Lab results showing anemia or kidney dysfunction',
        'Prescription records for pain medications',
      ],
    },
    {
      percent: 30,
      summary: 'In remission with surveillance',
      criteriaDescription: ['In remission, requiring only surveillance'],
      evidenceNeeded: [
        'Oncology notes documenting remission',
        'Lab results (serum protein electrophoresis, free light chains)',
        'Bone marrow biopsy showing remission',
      ],
    },
  ],
  definitions: {
    'Multiple Myeloma': 'Cancer of plasma cells in bone marrow causing bone destruction, anemia, kidney damage',
    'Pathological Fracture': 'Bone fracture caused by disease weakening the bone',
    'Serum Protein Electrophoresis': 'Lab test detecting abnormal proteins (M-protein) in myeloma',
    'Free Light Chains': 'Proteins produced by myeloma cells, measured for monitoring disease',
  },
};


// -----------------------------------------------------------------
// DC 7715 — NON-HODGKIN'S LYMPHOMA
// -----------------------------------------------------------------
export const NON_HODGKINS_LYMPHOMA_CRITERIA = {
  diagnosticCode: '7715',
  condition: "Non-Hodgkin's Lymphoma",
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'During active treatment',
      criteriaDescription: [
        'Requiring chemotherapy, radiation, bone marrow or stem cell transplant, immunotherapy, or other ongoing treatment',
      ],
      evidenceNeeded: [
        'Medical records documenting active treatment',
        'Treatment protocols',
        'Oncology consultation reports',
      ],
    },
    {
      percent: 60,
      summary: 'Post-treatment with residual symptoms',
      criteriaDescription: ['Following treatment, with residual symptoms or complications'],
      evidenceNeeded: [
        'Documentation of residual symptoms',
        'Imaging or lab results showing complications',
      ],
    },
    {
      percent: 30,
      summary: 'In remission with surveillance',
      criteriaDescription: ['In complete remission, requiring only surveillance'],
      evidenceNeeded: [
        'Oncology notes documenting remission',
        'PET/CT scans showing no active disease',
      ],
    },
  ],
  definitions: {
    "Non-Hodgkin's Lymphoma": 'Group of blood cancers arising from lymphocytes (includes many subtypes)',
    'Subtypes': 'Includes diffuse large B-cell lymphoma, follicular lymphoma, mantle cell lymphoma, and many others',
  },
};


// -----------------------------------------------------------------
// DC 7718 — ESSENTIAL THROMBOCYTHEMIA / PRIMARY MYELOFIBROSIS
// -----------------------------------------------------------------
export const MYELOPROLIFERATIVE_7718_CRITERIA = {
  diagnosticCode: '7718',
  condition: 'Essential Thrombocythemia or Primary Myelofibrosis',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant OR symptomatic splenomegaly + cytopenia',
      criteriaDescription: [
        'Requiring bone marrow or stem cell transplant, OR',
        'Symptomatic splenomegaly with cytopenia (anemia, thrombocytopenia, or leukopenia)',
      ],
      evidenceNeeded: [
        'Bone marrow transplant records, OR',
        'Imaging showing splenomegaly',
        'Documentation of symptoms (pain, early satiety)',
        'Lab results showing low blood counts',
      ],
    },
    {
      percent: 60,
      summary: 'Symptomatic splenomegaly OR requiring JAK inhibitor',
      criteriaDescription: [
        'Symptomatic splenomegaly, OR',
        'Requiring continuous treatment with JAK inhibitors (e.g., ruxolitinib)',
      ],
      evidenceNeeded: [
        'Imaging and symptom documentation, OR',
        'Prescription records for JAK inhibitor therapy',
      ],
    },
    {
      percent: 40,
      summary: 'Requiring continuous myelosuppressive treatment',
      criteriaDescription: [
        'Requiring continuous myelosuppressive treatment (hydroxyurea, interferon, anagrelide)',
      ],
      evidenceNeeded: ['Prescription records for continuous myelosuppressive medications'],
    },
    {
      percent: 10,
      summary: 'Requiring aspirin only',
      criteriaDescription: [
        'Requiring continuous treatment with aspirin or antiplatelet therapy only',
      ],
      evidenceNeeded: ['Prescription records'],
    },
    {
      percent: 0,
      summary: 'Asymptomatic',
      criteriaDescription: ['Asymptomatic'],
    },
  ],
  definitions: {
    'Essential Thrombocythemia': 'Myeloproliferative disorder causing elevated platelet count',
    'Primary Myelofibrosis': 'Bone marrow scarring causing enlarged spleen and blood cell problems',
    'Splenomegaly': 'Enlarged spleen',
    'Cytopenia': 'Low blood cell counts',
    'JAK Inhibitor': 'Ruxolitinib (Jakafi) — targeted therapy for myelofibrosis',
  },
};


// -----------------------------------------------------------------
// DC 7719 — CHRONIC MYELOGENOUS LEUKEMIA (CML)
// -----------------------------------------------------------------
export const CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA = {
  diagnosticCode: '7719',
  condition: 'Chronic Myelogenous Leukemia (CML)',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Chronic or accelerated phase OR bone marrow transplant',
      criteriaDescription: [
        'Chronic phase or accelerated phase, OR',
        'Status post bone marrow or stem cell transplant',
      ],
      evidenceNeeded: [
        'Bone marrow biopsy showing disease phase',
        'Molecular testing (BCR-ABL levels)',
        'Transplant records if applicable',
        'Hematology/oncology consultation',
      ],
    },
    {
      percent: 60,
      summary: 'Molecular or cytogenetic response on TKI',
      criteriaDescription: [
        'Molecular or cytogenetic response (less than complete response) on tyrosine kinase inhibitor (TKI) therapy',
      ],
      evidenceNeeded: [
        'Molecular testing showing partial response',
        'Prescription records for TKI (imatinib, dasatinib, nilotinib, etc.)',
      ],
    },
    {
      percent: 10,
      summary: 'Complete molecular response on TKI',
      criteriaDescription: ['Complete molecular response on TKI therapy'],
      evidenceNeeded: [
        'Molecular testing showing undetectable BCR-ABL',
        'Prescription records for TKI',
      ],
    },
  ],
  definitions: {
    'Chronic Myelogenous Leukemia': 'Blood cancer caused by Philadelphia chromosome creating BCR-ABL fusion protein',
    'Tyrosine Kinase Inhibitor (TKI)': 'Targeted therapy for CML (imatinib/Gleevec, dasatinib, nilotinib)',
    'BCR-ABL': 'Abnormal protein causing CML; monitored to assess treatment response',
    'Molecular Response': 'Reduction in BCR-ABL levels measured by PCR testing',
    'Complete Molecular Response': 'BCR-ABL undetectable by sensitive testing',
  },
  disclaimer: 'CML is now often well-controlled with TKI therapy. Rating reflects disease phase and treatment response.',
};


// -----------------------------------------------------------------
// DC 7724 — SOLITARY PLASMACYTOMA
// -----------------------------------------------------------------
export const SOLITARY_PLASMACYTOMA_CRITERIA = {
  diagnosticCode: '7724',
  condition: 'Solitary Plasmacytoma',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'During active treatment',
      criteriaDescription: [
        'Requiring chemotherapy, radiation therapy, or other ongoing treatment',
      ],
      evidenceNeeded: [
        'Medical records documenting active treatment',
        'Treatment protocols',
        'Oncology consultation reports',
      ],
    },
    {
      percent: 30,
      summary: 'Post-treatment with no recurrence',
      criteriaDescription: [
        'Following treatment, with no evidence of recurrence or progression to multiple myeloma',
      ],
      evidenceNeeded: [
        'Follow-up imaging showing no recurrence',
        'Lab results (SPEP, free light chains) showing no progression',
        'Oncology surveillance notes',
      ],
    },
  ],
  definitions: {
    'Solitary Plasmacytoma': 'Single tumor of plasma cells (related to multiple myeloma but localized)',
    'Progression to Multiple Myeloma': 'Many solitary plasmacytomas eventually progress to multiple myeloma',
  },
  disclaimer: 'Requires close monitoring as many cases progress to multiple myeloma over time.',
};


// -----------------------------------------------------------------
// DC 7725 — MYELODYSPLASTIC SYNDROMES (MDS)
// -----------------------------------------------------------------
export const MYELODYSPLASTIC_SYNDROMES_CRITERIA = {
  diagnosticCode: '7725',
  condition: 'Myelodysplastic Syndromes (MDS)',
  cfrReference: '38 CFR § 4.117',
  ratings: [
    {
      percent: 100,
      summary: 'Bone marrow transplant OR transfusions every 6 weeks',
      criteriaDescription: [
        'Requiring bone marrow or stem cell transplant, OR',
        'Requiring transfusions at least once every 6 weeks with infections recurring at least once every 6 weeks despite prophylactic antibiotic therapy',
      ],
      evidenceNeeded: [
        'Bone marrow transplant records, OR',
        'Transfusion records showing frequency',
        'Infection documentation',
        'Prescription records for prophylactic antibiotics',
      ],
    },
    {
      percent: 70,
      summary: 'Transfusions every 3 months + immunosuppression',
      criteriaDescription: [
        'Requiring transfusions at least once every 3 months, AND',
        'Requiring continuous immunosuppressive therapy or erythropoietin',
      ],
      evidenceNeeded: [
        'Transfusion records',
        'Prescription records for immunosuppressants or ESAs (erythropoietin-stimulating agents)',
      ],
    },
    {
      percent: 50,
      summary: 'Immunosuppression + growth factors',
      criteriaDescription: [
        'Requiring continuous immunosuppressive therapy, AND',
        'Requiring continuous treatment with myeloid growth factors',
      ],
      evidenceNeeded: [
        'Prescription records for immunosuppressants and growth factors',
      ],
    },
    {
      percent: 30,
      summary: 'Immunosuppression only',
      criteriaDescription: [
        'Requiring continuous immunosuppressive therapy or erythropoietin',
      ],
      evidenceNeeded: ['Prescription records'],
    },
    {
      percent: 10,
      summary: 'Growth factors only',
      criteriaDescription: ['Requiring continuous treatment with myeloid growth factors'],
      evidenceNeeded: ['Prescription or treatment records for growth factors'],
    },
    {
      percent: 0,
      summary: 'Asymptomatic',
      criteriaDescription: ['Asymptomatic'],
    },
  ],
  definitions: {
    'Myelodysplastic Syndromes': 'Group of bone marrow disorders causing ineffective blood cell production',
    'Risk Categories': 'Lower-risk MDS vs. higher-risk MDS (affects treatment and prognosis)',
    'Hypomethylating Agents': 'Azacitidine, decitabine — medications for higher-risk MDS',
    'Erythropoietin-Stimulating Agents (ESAs)': 'Medications to stimulate red blood cell production',
  },
  disclaimer: 'MDS has variable severity. Higher-risk MDS often progresses to acute leukemia.',
};


// ============================================
// ANALYZE FUNCTIONS
// ============================================

// -----------------------------------------------------------------
// analyzeIronDeficiencyAnemiaLogs
// -----------------------------------------------------------------
export const analyzeIronDeficiencyAnemiaLogs = (logs, _options = {}) => {
  if (!logs || logs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: [],
      gaps: ['No symptom logs found for iron deficiency anemia'],
      metrics: {},
      criteriaReference: IRON_DEFICIENCY_ANEMIA_CRITERIA,
    };
  }

  const anemiaLogs = logs.filter(
      (log) =>
          log.anemiaData?.type === 'iron-deficiency' ||
          ['fatigue-blood', 'weakness-blood', 'dizziness-anemia', 'pale-skin'].includes(log.symptomId)
  );

  if (anemiaLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No iron deficiency anemia symptom logs found'],
      gaps: ['Log symptoms related to iron deficiency anemia'],
      metrics: {},
      criteriaReference: IRON_DEFICIENCY_ANEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];
  const metrics = {
    totalLogs: anemiaLogs.length,
    dateRange: `${new Date(anemiaLogs[0].timestamp).toLocaleDateString()} to ${new Date(anemiaLogs[anemiaLogs.length - 1].timestamp).toLocaleDateString()}`,
    treatmentTypes: new Set(),
    ivInfusionCount: 0,
    continuousOralSupplementation: false,
  };

  anemiaLogs.forEach((log) => {
    if (log.anemiaData?.treatment) {
      log.anemiaData.treatment.forEach((t) => {
        metrics.treatmentTypes.add(t);
        if (t === 'iv-iron') metrics.ivInfusionCount++;
        if (t === 'oral-iron') metrics.continuousOralSupplementation = true;
      });
    }
  });

  if (metrics.ivInfusionCount >= 4) {
    supportedRating = 30;
    rationale.push(`Documented ${metrics.ivInfusionCount} IV iron infusion episodes (qualifies for 30% when 4+ per year)`);
    rationale.push('Treatment frequency indicates severe iron deficiency requiring aggressive intervention');
  } else if (metrics.ivInfusionCount >= 1 || metrics.continuousOralSupplementation) {
    supportedRating = 10;
    if (metrics.ivInfusionCount > 0) {
      rationale.push(`Documented ${metrics.ivInfusionCount} IV iron infusion episodes (requires 1-3 per year for 10%)`);
    }
    if (metrics.continuousOralSupplementation) {
      rationale.push('Requiring continuous oral iron supplementation');
    }
  } else {
    supportedRating = 0;
    rationale.push('Symptoms managed with dietary modification only or asymptomatic');
  }

  evidenceGaps.push('Upload medical records documenting IV iron infusion dates');
  evidenceGaps.push('Upload lab results (CBC, iron panel, ferritin levels)');
  evidenceGaps.push('Upload prescription records for iron supplementation');
  evidenceGaps.push('Obtain provider statement regarding treatment frequency and necessity');

  return {
    condition: 'Iron Deficiency Anemia',
    diagnosticCode: '7720',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics,
    criteriaReference: IRON_DEFICIENCY_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeFolateDeficiencyAnemiaLogs
// -----------------------------------------------------------------
export const analyzeFolateDeficiencyAnemiaLogs = (logs, _options = {}) => {
  const anemiaLogs = logs.filter((log) => log.anemiaData?.type === 'folate-deficiency');

  if (anemiaLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No folate deficiency anemia logs found'],
      gaps: ['Log folate deficiency anemia symptoms and treatment'],
      metrics: {},
      criteriaReference: FOLATE_DEFICIENCY_ANEMIA_CRITERIA,
    };
  }

  let ivCount = 0;
  let continuousOral = false;

  anemiaLogs.forEach((log) => {
    if (log.anemiaData?.treatment?.includes('iv-folate')) ivCount++;
    if (log.anemiaData?.treatment?.includes('oral-folate')) continuousOral = true;
  });

  let supportedRating = 0;
  const rationale = [];

  if (ivCount >= 4) {
    supportedRating = 30;
    rationale.push(`${ivCount} IV folate infusions documented (30% when 4+ per year)`);
  } else if (ivCount >= 1 || continuousOral) {
    supportedRating = 10;
    if (ivCount > 0) rationale.push(`${ivCount} IV folate infusions (10% for 1-3 per year)`);
    if (continuousOral) rationale.push('Continuous oral folate supplementation required');
  }

  return {
    condition: 'Folic Acid Deficiency Anemia',
    diagnosticCode: '7721',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: ['Upload medical records and lab results documenting folate levels'],
    metrics: { totalLogs: anemiaLogs.length, ivCount, continuousOral },
    criteriaReference: FOLATE_DEFICIENCY_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzePerniciousAnemiaLogs
// -----------------------------------------------------------------
export const analyzePerniciousAnemiaLogs = (logs, _options = {}) => {
  const b12Logs = logs.filter(
      (log) =>
          log.anemiaData?.type === 'b12-deficiency' ||
          log.b12DeficiencyData?.deficiency_cause === 'pernicious-anemia' ||
          ['numbness-tingling-b12', 'difficulty-walking', 'memory-problems-b12'].includes(log.symptomId)
  );

  if (b12Logs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No B12 deficiency/pernicious anemia logs found'],
      gaps: ['Log B12 deficiency symptoms and treatment'],
      metrics: {},
      criteriaReference: PERNICIOUS_ANEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: b12Logs.length,
    injectionCount: 0,
    continuousOral: false,
    neurologicalSymptoms: new Set(),
    hasCNSInvolvement: false,
  };

  b12Logs.forEach((log) => {
    if (log.anemiaData?.treatment?.includes('b12-injections')) metrics.injectionCount++;
    if (
        log.b12DeficiencyData?.treatment?.includes('injections-weekly') ||
        log.b12DeficiencyData?.treatment?.includes('injections-monthly')
    ) {
      metrics.injectionCount++;
    }
    if (
        log.b12DeficiencyData?.treatment?.includes('high-dose-oral') ||
        log.b12DeficiencyData?.treatment?.includes('sublingual')
    ) {
      metrics.continuousOral = true;
    }
    if (log.b12DeficiencyData?.neurological_symptoms) {
      log.b12DeficiencyData.neurological_symptoms.forEach((s) => metrics.neurologicalSymptoms.add(s));
    }
  });

  // CNS involvement requires multiple documented severe neurological symptoms
  const severeNeuroSymptoms = ['balance-problems', 'difficulty-walking', 'weakness', 'confusion'];
  metrics.hasCNSInvolvement = severeNeuroSymptoms.some((s) => metrics.neurologicalSymptoms.has(s));

  if (metrics.hasCNSInvolvement && metrics.neurologicalSymptoms.size >= 3) {
    supportedRating = 100;
    rationale.push('Central nervous system involvement documented with neurological symptoms:');
    rationale.push(`- ${Array.from(metrics.neurologicalSymptoms).join(', ')}`);
    rationale.push('CRITICAL: Requires neurology evaluation and documentation of CNS damage for 100% rating');
  } else if (metrics.injectionCount >= 4) {
    supportedRating = 30;
    rationale.push(`${metrics.injectionCount} B12 injection episodes documented (30% when 4+ per year)`);
  } else if (metrics.injectionCount >= 1 || metrics.continuousOral) {
    supportedRating = 10;
    if (metrics.injectionCount > 0) rationale.push(`${metrics.injectionCount} B12 injections (10% for 1-3 per year)`);
    if (metrics.continuousOral) rationale.push('Continuous oral/sublingual B12 supplementation required');
  }

  const evidenceGaps = [
    'Upload lab results (B12 level, methylmalonic acid, homocysteine)',
    'Upload treatment records showing injection frequency',
  ];

  if (metrics.hasCNSInvolvement) {
    evidenceGaps.push('CRITICAL: Obtain neurology evaluation documenting CNS involvement');
    evidenceGaps.push('CRITICAL: Upload MRI or EMG/NCV studies showing nerve or spinal cord damage');
  }

  return {
    condition: 'Pernicious Anemia (B12 Deficiency)',
    diagnosticCode: '7722',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics,
    criteriaReference: PERNICIOUS_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeHemolyticAnemiaLogs
// -----------------------------------------------------------------
export const analyzeHemolyticAnemiaLogs = (logs, _options = {}) => {
  const hemolyticLogs = logs.filter((log) => log.anemiaData?.type === 'hemolytic');

  if (hemolyticLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No hemolytic anemia logs found'],
      gaps: ['Log hemolytic anemia symptoms and treatment'],
      metrics: {},
      criteriaReference: HEMOLYTIC_ANEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: hemolyticLogs.length,
    transfusionCount: 0,
    hasImmunosuppression: false,
    hasBoneMarrowTransplant: false,
  };

  hemolyticLogs.forEach((log) => {
    if (log.anemiaData?.treatment?.includes('transfusions')) metrics.transfusionCount++;
    if (log.anemiaData?.treatment?.includes('immunosuppressants')) metrics.hasImmunosuppression = true;
    if (log.anemiaData?.treatment?.includes('bone-marrow-transplant')) metrics.hasBoneMarrowTransplant = true;
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed (100% rating)');
  } else if (metrics.transfusionCount >= 8) {
    // 8-9+ per year ≈ every 6 weeks
    supportedRating = 70;
    rationale.push(`${metrics.transfusionCount} transfusions documented (70% when every 6 weeks = 8-9+ per year)`);
  } else if (metrics.transfusionCount >= 4 && metrics.hasImmunosuppression) {
    // 4+ per year ≈ every 3 months
    supportedRating = 50;
    rationale.push(`${metrics.transfusionCount} transfusions + continuous immunosuppressive therapy (50%)`);
  } else if (metrics.hasImmunosuppression || metrics.transfusionCount >= 1) {
    supportedRating = 30;
    if (metrics.hasImmunosuppression) rationale.push('Continuous immunosuppressive therapy required');
    if (metrics.transfusionCount > 0) rationale.push(`${metrics.transfusionCount} transfusions per year`);
  } else {
    supportedRating = 10;
    rationale.push('Continuous oral medication required');
  }

  return {
    condition: 'Acquired Hemolytic Anemia',
    diagnosticCode: '7723',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload transfusion records showing dates and frequency',
      'Upload lab results (CBC, reticulocyte count, LDH, haptoglobin, direct Coombs test)',
      'Upload prescription records for immunosuppressive medications',
    ],
    metrics,
    criteriaReference: HEMOLYTIC_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeSickleCellAnemiaLogs
// -----------------------------------------------------------------
export const analyzeSickleCellAnemiaLogs = (logs, _options = {}) => {
  const sickleLogs = logs.filter(
      (log) =>
          log.anemiaData?.type === 'sickle-cell' ||
          log.sickleCellData ||
          getLogSymptomId(log) === 'sickle-cell-crisis'
  );

  if (sickleLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No sickle cell disease logs found'],
      gaps: ['Log sickle cell crises and symptoms'],
      metrics: {},
      criteriaReference: SICKLE_CELL_ANEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: sickleLogs.length,
    hospitalizationCount: 0,
    erVisitCount: 0,
    homeManagedCount: 0,
    organDamage: false,
  };

  sickleLogs.forEach((log) => {
    if (log.sickleCellData?.treatment_received?.includes('hospitalized')) {
      metrics.hospitalizationCount++;
    } else if (log.sickleCellData?.treatment_received?.includes('er-visit')) {
      metrics.erVisitCount++;
    } else if (log.sickleCellData?.treatment_received?.includes('home-management')) {
      metrics.homeManagedCount++;
    }
  });

  const totalMedicalCrises = metrics.hospitalizationCount + metrics.erVisitCount;

  if (totalMedicalCrises >= 4) {
    supportedRating = 100;
    rationale.push(`${totalMedicalCrises} painful crises requiring medical intervention (4+ per year = 100%)`);
    rationale.push(`Breakdown: ${metrics.hospitalizationCount} hospitalizations, ${metrics.erVisitCount} ER visits`);
  } else if (totalMedicalCrises === 3) {
    supportedRating = 60;
    rationale.push('3 painful crises requiring medical intervention (60% rating)');
  } else if (totalMedicalCrises >= 1) {
    supportedRating = 30;
    rationale.push(`${totalMedicalCrises} painful crisis(es) requiring medical intervention (30% for 1-2 per year)`);
  } else if (sickleLogs.length > 0) {
    supportedRating = 10;
    rationale.push('Documented sickle cell disease with history of symptoms');
    rationale.push('NOTE: Home-managed crises do not count toward higher ratings');
  }

  const evidenceGaps = [
    'Upload medical records of all ER visits and hospitalizations for sickle cell crises',
    'Upload documentation showing IV pain medication administration',
    'Upload hemoglobin electrophoresis results',
    'Upload imaging studies if organ damage present',
  ];

  if (metrics.homeManagedCount > 0) {
    evidenceGaps.push(
        `IMPORTANT: ${metrics.homeManagedCount} home-managed crises logged but these do not count for rating — only crises requiring parenteral opioids or hospitalization qualify`
    );
  }

  return {
    condition: 'Sickle Cell Anemia',
    diagnosticCode: '7714',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: evidenceGaps,
    metrics,
    criteriaReference: SICKLE_CELL_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeAplasticAnemiaLogs
// -----------------------------------------------------------------
export const analyzeAplasticAnemiaLogs = (logs, _options = {}) => {
  const aplasticLogs = logs.filter((log) => log.anemiaData?.type === 'aplastic');

  if (aplasticLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No aplastic anemia logs found'],
      gaps: ['Log aplastic anemia symptoms and treatment'],
      metrics: {},
      criteriaReference: APLASTIC_ANEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: aplasticLogs.length,
    transfusionCount: 0,
    hasImmunosuppression: false,
    hasGrowthFactors: false,
    hasBoneMarrowTransplant: false,
    frequentInfections: 0,
  };

  aplasticLogs.forEach((log) => {
    if (log.anemiaData?.treatment?.includes('transfusions')) metrics.transfusionCount++;
    if (log.anemiaData?.treatment?.includes('immunosuppressants')) metrics.hasImmunosuppression = true;
    if (log.anemiaData?.treatment?.includes('growth-factors')) metrics.hasGrowthFactors = true;
    if (log.anemiaData?.treatment?.includes('bone-marrow-transplant')) metrics.hasBoneMarrowTransplant = true;
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed (100% rating)');
  } else if (metrics.transfusionCount >= 8 && metrics.frequentInfections >= 8) {
    // Transfusions every 6 weeks + infections every 6 weeks
    supportedRating = 100;
    rationale.push('Transfusions every 6 weeks (8-9+ per year) AND recurring infections despite prophylactic antibiotics');
  } else if (metrics.transfusionCount >= 4 && metrics.hasImmunosuppression) {
    supportedRating = 70;
    rationale.push('Transfusions every 3 months (4+ per year) AND continuous immunosuppressive therapy');
  } else if (metrics.hasImmunosuppression && metrics.hasGrowthFactors) {
    supportedRating = 50;
    rationale.push('Continuous immunosuppressive therapy AND myeloid growth factors');
  } else if (metrics.hasImmunosuppression) {
    supportedRating = 30;
    rationale.push('Continuous immunosuppressive therapy required');
  } else if (metrics.hasGrowthFactors) {
    supportedRating = 10;
    rationale.push('Continuous myeloid growth factor treatment required');
  }

  return {
    condition: 'Aplastic Anemia',
    diagnosticCode: '7716',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload bone marrow biopsy report confirming diagnosis',
      'Upload transfusion records showing frequency',
      'Upload prescription records for immunosuppressive medications',
      'Upload prescription/treatment records for growth factors (G-CSF, EPO)',
      'Upload infection records if frequent infections present',
    ],
    metrics,
    criteriaReference: APLASTIC_ANEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzePolycythemiaVeraLogs
// -----------------------------------------------------------------
export const analyzePolycythemiaVeraLogs = (logs, _options = {}) => {
  const polyLogs = logs.filter(
      (log) =>
          log.polycythemiaData?.diagnosis === 'polycythemia-vera' ||
          ['itching-after-bathing', 'burning-hands-feet', 'redness-skin'].includes(log.symptomId)
  );

  if (polyLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No polycythemia vera logs found'],
      gaps: ['Log polycythemia vera symptoms and treatment'],
      metrics: {},
      criteriaReference: POLYCYTHEMIA_VERA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: polyLogs.length,
    phlebotomyCount: 0,
    hasMyelosuppression: false,
    hasAspirinOnly: false,
    hasBoneMarrowTransplant: false,
  };

  polyLogs.forEach((log) => {
    if (log.polycythemiaData?.treatment?.includes('phlebotomy')) metrics.phlebotomyCount++;
    if (
        log.polycythemiaData?.medications?.some((m) =>
            ['hydroxyurea-continuous', 'interferon-continuous', 'jakafi-continuous'].includes(m)
        )
    ) {
      metrics.hasMyelosuppression = true;
    }
    if (log.polycythemiaData?.treatment?.includes('aspirin')) metrics.hasAspirinOnly = true;
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed');
  } else if (metrics.phlebotomyCount >= 6 && metrics.hasMyelosuppression) {
    supportedRating = 75;
    rationale.push(`${metrics.phlebotomyCount} phlebotomies per year AND continuous myelosuppressive treatment`);
  } else if (metrics.phlebotomyCount >= 4 && metrics.hasMyelosuppression) {
    supportedRating = 60;
    rationale.push(`${metrics.phlebotomyCount} phlebotomies per year AND continuous myelosuppressive treatment`);
  } else if (metrics.phlebotomyCount >= 4 || metrics.hasMyelosuppression) {
    supportedRating = 50;
    if (metrics.phlebotomyCount >= 4) rationale.push(`${metrics.phlebotomyCount} phlebotomies per year`);
    if (metrics.hasMyelosuppression) rationale.push('Continuous myelosuppressive medication');
  } else if (metrics.phlebotomyCount === 3 || metrics.hasMyelosuppression) {
    supportedRating = 40;
    rationale.push(metrics.phlebotomyCount === 3 ? '3 phlebotomies per year' : 'Continuous myelosuppressive medication');
  } else if (metrics.phlebotomyCount >= 1) {
    supportedRating = 20;
    rationale.push(`${metrics.phlebotomyCount} phlebotomies per year`);
  } else if (metrics.hasAspirinOnly) {
    supportedRating = 10;
    rationale.push('Managed with low-dose aspirin only');
  }

  return {
    condition: 'Polycythemia Vera',
    diagnosticCode: '7704',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload phlebotomy records showing dates and frequency',
      'Upload prescription records for myelosuppressive medications',
      'Upload lab results (CBC, JAK2 mutation testing)',
      'Upload hematology consultation reports',
    ],
    metrics,
    criteriaReference: POLYCYTHEMIA_VERA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeImmuneThrombocytopeniaLogs
// -----------------------------------------------------------------
export const analyzeImmuneThrombocytopeniaLogs = (logs, _options = {}) => {
  const itpLogs = logs.filter(
      (log) =>
          log.bleedingDisorderData?.disorder_type === 'thrombocytopenia' ||
          ['easy-bruising', 'prolonged-bleeding', 'petechiae'].includes(log.symptomId)
  );

  if (itpLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No immune thrombocytopenia logs found'],
      gaps: ['Log ITP symptoms and treatment'],
      metrics: {},
      criteriaReference: IMMUNE_THROMBOCYTOPENIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: itpLogs.length,
    lowestPlateletCount: null,
    hasImmunosuppression: false,
    hasBleedingEpisodes: false,
    hasBoneMarrowTransplant: false,
  };

  itpLogs.forEach((log) => {
    if (log.bleedingDisorderData?.platelet_count) {
      const count = parseInt(log.bleedingDisorderData.platelet_count);
      if (!metrics.lowestPlateletCount || count < metrics.lowestPlateletCount) {
        metrics.lowestPlateletCount = count;
      }
    }
    if (
        log.bleedingDisorderData?.treatment?.some((t) =>
            ['steroids', 'immunoglobulins', 'immunosuppressants', 'tpo-agonists'].includes(t)
        )
    ) {
      metrics.hasImmunosuppression = true;
    }
    if (log.bleedingDisorderData?.bleeding_site?.length > 0) {
      metrics.hasBleedingEpisodes = true;
    }
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed');
  } else if (
      metrics.lowestPlateletCount &&
      metrics.lowestPlateletCount < 20000 &&
      metrics.hasImmunosuppression &&
      metrics.hasBleedingEpisodes
  ) {
    supportedRating = 100;
    rationale.push(
        `Platelet count <20,000 (lowest: ${metrics.lowestPlateletCount.toLocaleString()}) with continuous immunosuppressive treatment and bleeding episodes`
    );
  } else if (
      metrics.lowestPlateletCount &&
      metrics.lowestPlateletCount >= 20000 &&
      metrics.lowestPlateletCount <= 30000 &&
      metrics.hasImmunosuppression &&
      metrics.hasBleedingEpisodes
  ) {
    supportedRating = 70;
    rationale.push(
        `Platelet count 20,000-30,000 (${metrics.lowestPlateletCount.toLocaleString()}) with immunosuppressive treatment and bleeding`
    );
  } else if (
      metrics.lowestPlateletCount &&
      metrics.lowestPlateletCount >= 30000 &&
      metrics.lowestPlateletCount <= 50000 &&
      metrics.hasImmunosuppression
  ) {
    supportedRating = 50;
    rationale.push(
        `Platelet count 30,000-50,000 (${metrics.lowestPlateletCount.toLocaleString()}) requiring continuous immunosuppressive treatment`
    );
  } else if (
      metrics.lowestPlateletCount &&
      metrics.lowestPlateletCount >= 50000 &&
      metrics.lowestPlateletCount <= 70000 &&
      metrics.hasImmunosuppression
  ) {
    supportedRating = 30;
    rationale.push(
        `Platelet count 50,000-70,000 (${metrics.lowestPlateletCount.toLocaleString()}) requiring continuous immunosuppressive treatment`
    );
  } else if (
      metrics.lowestPlateletCount &&
      metrics.lowestPlateletCount >= 70000 &&
      metrics.lowestPlateletCount <= 100000
  ) {
    supportedRating = 10;
    rationale.push(`Platelet count 70,000-100,000 (${metrics.lowestPlateletCount.toLocaleString()})`);
  } else {
    supportedRating = 0;
    rationale.push('Platelet count >100,000 or asymptomatic');
  }

  return {
    condition: 'Immune Thrombocytopenia (ITP)',
    diagnosticCode: '7705',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload multiple CBC lab results showing platelet counts',
      'Upload prescription records for immunosuppressive medications',
      'Upload documentation of bleeding episodes',
      'Upload hematology consultation reports',
    ],
    metrics,
    criteriaReference: IMMUNE_THROMBOCYTOPENIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeLeukemiaLogs
// -----------------------------------------------------------------
export const analyzeLeukemiaLogs = (logs, _options = {}) => {
  const leukemiaLogs = logs.filter(
      (log) =>
          ['cll', 'cml', 'all', 'aml'].includes(log.lymphomaLeukemiaData?.diagnosis) ||
          ['bone-pain-leukemia', 'night-sweats-blood', 'frequent-infections'].includes(log.symptomId)
  );

  if (leukemiaLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No leukemia logs found'],
      gaps: ['Log leukemia symptoms and treatment'],
      metrics: {},
      criteriaReference: LEUKEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: leukemiaLogs.length,
    activeTreatment: false,
    inRemission: false,
    hasResidualSymptoms: false,
    treatmentTypes: new Set(),
    sideEffects: new Set(),
  };

  leukemiaLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') metrics.activeTreatment = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'remission') metrics.inRemission = true;
    if (log.lymphomaLeukemiaData?.side_effects?.length > 0) {
      metrics.hasResidualSymptoms = true;
      log.lymphomaLeukemiaData.side_effects.forEach((e) => metrics.sideEffects.add(e));
    }
    if (log.lymphomaLeukemiaData?.treatment_type) {
      log.lymphomaLeukemiaData.treatment_type.forEach((t) => metrics.treatmentTypes.add(t));
    }
  });

  if (metrics.activeTreatment) {
    supportedRating = 100;
    rationale.push('Currently receiving active treatment for leukemia (100% rating during treatment)');
    if (metrics.treatmentTypes.size > 0) {
      rationale.push(`Treatment types: ${Array.from(metrics.treatmentTypes).join(', ')}`);
    }
  } else if (metrics.inRemission && metrics.hasResidualSymptoms) {
    supportedRating = 60;
    rationale.push('Post-treatment with residual symptoms');
    rationale.push(`Ongoing symptoms: ${Array.from(metrics.sideEffects).join(', ')}`);
  } else if (metrics.inRemission) {
    supportedRating = 30;
    rationale.push('In complete remission with surveillance only');
  } else {
    // No remission documented — assume active
    supportedRating = 100;
    rationale.push('Active leukemia — assume 100% rating until remission documented');
  }

  return {
    condition: 'Leukemia',
    diagnosticCode: '7703',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload oncology consultation reports',
      'Upload bone marrow biopsy results',
      'Upload treatment records and protocols',
      'Upload lab results (CBC, flow cytometry, molecular studies)',
      'Upload documentation of treatment status (active vs. remission)',
    ],
    metrics,
    criteriaReference: LEUKEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeHodgkinsLymphomaLogs
// -----------------------------------------------------------------
export const analyzeHodgkinsLymphomaLogs = (logs, _options = {}) => {
  const hodgkinsLogs = logs.filter(
      (log) =>
          log.lymphomaLeukemiaData?.diagnosis === 'hodgkin' ||
          ['swollen-lymph-nodes', 'night-sweats-blood'].includes(log.symptomId)
  );

  if (hodgkinsLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ["No Hodgkin's lymphoma logs found"],
      gaps: ["Log Hodgkin's lymphoma symptoms and treatment"],
      metrics: {},
      criteriaReference: HODGKINS_LYMPHOMA_CRITERIA,
    };
  }

  let activeTreatment = false;
  let inRemission = false;
  let hasResidualSymptoms = false;

  hodgkinsLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') activeTreatment = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'remission') inRemission = true;
    if (log.lymphomaLeukemiaData?.side_effects?.length > 0) hasResidualSymptoms = true;
  });

  let supportedRating = 0;
  const rationale = [];

  if (activeTreatment) {
    supportedRating = 100;
    rationale.push("Active treatment for Hodgkin's lymphoma (100% during treatment)");
  } else if (inRemission && hasResidualSymptoms) {
    supportedRating = 60;
    rationale.push('Post-treatment with residual symptoms');
  } else if (inRemission) {
    supportedRating = 30;
    rationale.push('Complete remission with surveillance');
  } else {
    supportedRating = 100;
    rationale.push("Active Hodgkin's lymphoma — 100% until remission");
  }

  return {
    condition: "Hodgkin's Lymphoma",
    diagnosticCode: '7709',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload oncology consultation reports',
      'Upload pathology report confirming diagnosis',
      'Upload PET/CT scan results',
      'Upload treatment records',
    ],
    metrics: { totalLogs: hodgkinsLogs.length },
    criteriaReference: HODGKINS_LYMPHOMA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeMultipleMyelomaLogs
// -----------------------------------------------------------------
export const analyzeMultipleMyelomaLogs = (logs, _options = {}) => {
  const myelomaLogs = logs.filter(
      (log) =>
          log.lymphomaLeukemiaData?.diagnosis === 'multiple-myeloma' ||
          getLogSymptomId(log) === 'bone-pain-leukemia'
  );

  if (myelomaLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No multiple myeloma logs found'],
      gaps: ['Log multiple myeloma symptoms and treatment'],
      metrics: {},
      criteriaReference: MULTIPLE_MYELOMA_CRITERIA,
    };
  }

  let activeTreatment = false;
  let inRemission = false;
  let hasResidualSymptoms = false;

  myelomaLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') activeTreatment = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'remission') inRemission = true;
    if (log.lymphomaLeukemiaData?.side_effects?.length > 0) hasResidualSymptoms = true;
  });

  let supportedRating = 0;
  const rationale = [];

  if (activeTreatment) {
    supportedRating = 100;
    rationale.push('Active treatment for multiple myeloma (100% during treatment)');
  } else if (inRemission && hasResidualSymptoms) {
    supportedRating = 60;
    rationale.push('Post-treatment with residual symptoms');
  } else if (inRemission) {
    supportedRating = 30;
    rationale.push('In remission with surveillance');
  } else {
    supportedRating = 100;
    rationale.push('Active multiple myeloma — 100% until remission');
  }

  return {
    condition: 'Multiple Myeloma',
    diagnosticCode: '7712',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload oncology consultation reports',
      'Upload bone marrow biopsy results',
      'Upload lab results (SPEP, free light chains, complete metabolic panel)',
      'Upload skeletal survey or PET/CT showing bone lesions',
      'Upload treatment records',
    ],
    metrics: { totalLogs: myelomaLogs.length },
    criteriaReference: MULTIPLE_MYELOMA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeNonHodgkinsLymphomaLogs
// -----------------------------------------------------------------
export const analyzeNonHodgkinsLymphomaLogs = (logs, _options = {}) => {
  const nhlLogs = logs.filter((log) => log.lymphomaLeukemiaData?.diagnosis === 'non-hodgkin');

  if (nhlLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ["No Non-Hodgkin's lymphoma logs found"],
      gaps: ["Log Non-Hodgkin's lymphoma symptoms and treatment"],
      metrics: {},
      criteriaReference: NON_HODGKINS_LYMPHOMA_CRITERIA,
    };
  }

  let activeTreatment = false;
  let inRemission = false;
  let hasResidualSymptoms = false;

  nhlLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') activeTreatment = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'remission') inRemission = true;
    if (log.lymphomaLeukemiaData?.side_effects?.length > 0) hasResidualSymptoms = true;
  });

  let supportedRating = 0;
  const rationale = [];

  if (activeTreatment) {
    supportedRating = 100;
    rationale.push("Active treatment for Non-Hodgkin's lymphoma (100% during treatment)");
  } else if (inRemission && hasResidualSymptoms) {
    supportedRating = 60;
    rationale.push('Post-treatment with residual symptoms');
  } else if (inRemission) {
    supportedRating = 30;
    rationale.push('Complete remission with surveillance');
  } else {
    supportedRating = 100;
    rationale.push("Active Non-Hodgkin's lymphoma — 100% until remission");
  }

  return {
    condition: "Non-Hodgkin's Lymphoma",
    diagnosticCode: '7715',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload oncology consultation reports',
      'Upload pathology report with lymphoma subtype',
      'Upload PET/CT scan results',
      'Upload treatment records',
    ],
    metrics: { totalLogs: nhlLogs.length },
    criteriaReference: NON_HODGKINS_LYMPHOMA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeMyeloproliferative7718Logs
// -----------------------------------------------------------------
export const analyzeMyeloproliferative7718Logs = (logs, _options = {}) => {
  const mpnLogs = logs.filter((log) =>
      ['essential-thrombocythemia', 'primary-myelofibrosis'].includes(log.polycythemiaData?.diagnosis)
  );

  if (mpnLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No essential thrombocythemia or myelofibrosis logs found'],
      gaps: ['Log symptoms and treatment for ET or PMF'],
      metrics: {},
      criteriaReference: MYELOPROLIFERATIVE_7718_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: mpnLogs.length,
    hasJAKInhibitor: false,
    hasMyelosuppression: false,
    hasSplenomegaly: false,
    hasBoneMarrowTransplant: false,
  };

  mpnLogs.forEach((log) => {
    if (log.polycythemiaData?.medications?.includes('jakafi-continuous')) metrics.hasJAKInhibitor = true;
    if (
        log.polycythemiaData?.medications?.some((m) =>
            ['hydroxyurea-continuous', 'interferon-continuous'].includes(m)
        )
    ) {
      metrics.hasMyelosuppression = true;
    }
    if (log.polycythemiaData?.complications?.includes('enlarged-spleen')) metrics.hasSplenomegaly = true;
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed');
  } else if (metrics.hasSplenomegaly) {
    // Splenomegaly with cytopenia is 100%
    supportedRating = 100;
    rationale.push('Symptomatic splenomegaly with complications');
  } else if (metrics.hasJAKInhibitor) {
    supportedRating = 60;
    rationale.push('Requiring continuous JAK inhibitor therapy');
  } else if (metrics.hasMyelosuppression) {
    supportedRating = 40;
    rationale.push('Requiring continuous myelosuppressive treatment');
  } else {
    supportedRating = 10;
    rationale.push('Managed with aspirin or antiplatelet therapy');
  }

  return {
    condition: 'Essential Thrombocythemia',
    diagnosticCode: '7718',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload bone marrow biopsy results',
      'Upload JAK2 mutation testing',
      'Upload imaging showing spleen size (ultrasound or CT)',
      'Upload prescription records for medications',
      'Upload lab results (CBC with differential, LDH)',
    ],
    metrics,
    criteriaReference: MYELOPROLIFERATIVE_7718_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeChronicMyelogenousLeukemiaLogs
// -----------------------------------------------------------------
export const analyzeChronicMyelogenousLeukemiaLogs = (logs, _options = {}) => {
  const cmlLogs = logs.filter((log) => log.lymphomaLeukemiaData?.diagnosis === 'cml');

  if (cmlLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No CML logs found'],
      gaps: ['Log CML symptoms and treatment'],
      metrics: {},
      criteriaReference: CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: cmlLogs.length,
    onTKI: false,
    inRemission: false,
    activeTreatment: false,
  };

  cmlLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_type?.includes('targeted-therapy')) metrics.onTKI = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'remission') metrics.inRemission = true;
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') metrics.activeTreatment = true;
  });

  if (metrics.activeTreatment && !metrics.inRemission) {
    supportedRating = 100;
    rationale.push('Chronic or accelerated phase CML (100% rating)');
  } else if (metrics.onTKI && !metrics.inRemission) {
    supportedRating = 60;
    rationale.push('Partial molecular/cytogenetic response on TKI therapy');
  } else if (metrics.inRemission && metrics.onTKI) {
    supportedRating = 10;
    rationale.push('Complete molecular response on TKI therapy');
  } else {
    supportedRating = 100;
    rationale.push('Active CML — 100% until molecular response documented');
  }

  return {
    condition: 'Chronic Myelogenous Leukemia',
    diagnosticCode: '7703',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload bone marrow biopsy results',
      'Upload BCR-ABL PCR molecular testing results',
      'Upload prescription records for TKI medications',
      'Upload hematology/oncology consultation reports',
      'Upload cytogenetic testing (Philadelphia chromosome)',
    ],
    metrics,
    criteriaReference: CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeSolitaryPlasmacytomaLogs
// -----------------------------------------------------------------
export const analyzeSolitaryPlasmacytomaLogs = (logs, _options = {}) => {
  const plasmacytomaLogs = logs.filter(
      (log) => log.lymphomaLeukemiaData?.diagnosis === 'plasmacytoma'
  );

  if (plasmacytomaLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No solitary plasmacytoma logs found'],
      gaps: ['Log plasmacytoma symptoms and treatment'],
      metrics: {},
      criteriaReference: SOLITARY_PLASMACYTOMA_CRITERIA,
    };
  }

  let activeTreatment = false;

  plasmacytomaLogs.forEach((log) => {
    if (log.lymphomaLeukemiaData?.treatment_status === 'active-treatment') activeTreatment = true;
  });

  let supportedRating = 0;
  const rationale = [];

  if (activeTreatment) {
    supportedRating = 100;
    rationale.push('Active treatment for solitary plasmacytoma (100% during treatment)');
  } else {
    supportedRating = 30;
    rationale.push('Post-treatment surveillance for plasmacytoma');
  }

  return {
    condition: 'Solitary Plasmacytoma',
    diagnosticCode: '7724',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload pathology report confirming diagnosis',
      'Upload imaging (MRI, PET/CT) showing tumor location and size',
      'Upload treatment records (radiation, surgery, etc.)',
      'Upload follow-up lab results (SPEP, free light chains)',
      'Upload bone marrow biopsy ruling out multiple myeloma',
    ],
    metrics: { totalLogs: plasmacytomaLogs.length },
    criteriaReference: SOLITARY_PLASMACYTOMA_CRITERIA,
  };
};


// -----------------------------------------------------------------
// analyzeMyelodysplasticSyndromesLogs
// -----------------------------------------------------------------
export const analyzeMyelodysplasticSyndromesLogs = (logs, _options = {}) => {
  const mdsLogs = logs.filter((log) => log.lymphomaLeukemiaData?.diagnosis === 'mds');

  if (mdsLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: 0,
      ratingRationale: ['No myelodysplastic syndrome logs found'],
      gaps: ['Log MDS symptoms and treatment'],
      metrics: {},
      criteriaReference: MYELODYSPLASTIC_SYNDROMES_CRITERIA,
    };
  }

  let supportedRating = 0;
  const rationale = [];
  const metrics = {
    totalLogs: mdsLogs.length,
    transfusionCount: 0,
    hasImmunosuppression: false,
    hasGrowthFactors: false,
    hasBoneMarrowTransplant: false,
  };

  mdsLogs.forEach((log) => {
    if (log.anemiaData?.treatment?.includes('transfusions')) metrics.transfusionCount++;
    if (log.anemiaData?.treatment?.includes('immunosuppressants')) metrics.hasImmunosuppression = true;
    if (log.anemiaData?.treatment?.includes('growth-factors')) metrics.hasGrowthFactors = true;
  });

  if (metrics.hasBoneMarrowTransplant) {
    supportedRating = 100;
    rationale.push('Bone marrow/stem cell transplant performed');
  } else if (metrics.transfusionCount >= 8) {
    supportedRating = 100;
    rationale.push('Transfusions every 6 weeks (8-9+ per year) with frequent infections');
  } else if (metrics.transfusionCount >= 4 && metrics.hasImmunosuppression) {
    supportedRating = 70;
    rationale.push('Transfusions every 3 months AND continuous immunosuppressive therapy');
  } else if (metrics.hasImmunosuppression && metrics.hasGrowthFactors) {
    supportedRating = 50;
    rationale.push('Continuous immunosuppressive therapy AND growth factors');
  } else if (metrics.hasImmunosuppression) {
    supportedRating = 30;
    rationale.push('Continuous immunosuppressive therapy or erythropoietin');
  } else if (metrics.hasGrowthFactors) {
    supportedRating = 10;
    rationale.push('Continuous myeloid growth factor treatment');
  }

  return {
    condition: 'Myelodysplastic Syndromes',
    diagnosticCode: '7725',
    hasData: true,
    supportedRating,
    ratingRationale: rationale,
    gaps: [
      'Upload bone marrow biopsy with cytogenetic analysis',
      'Upload transfusion records showing frequency',
      'Upload prescription records for immunosuppressants or growth factors',
      'Upload lab results (CBC with differential)',
      'Upload MDS risk stratification (IPSS or IPSS-R score)',
    ],
    metrics,
    criteriaReference: MYELODYSPLASTIC_SYNDROMES_CRITERIA,
  };
};