/* eslint-disable no-unused-vars */

// ============================================
// VA RATING CRITERIA - DATA STRUCTURE & ANALYSIS
// ============================================
// Based on 38 CFR Part 4 - Schedule for Rating Disabilities
// This file contains rating criteria definitions and logic to
// analyze logged symptoms against VA evaluation standards.
//
// DISCLAIMER: This is for documentation guidance only.
// The VA makes all final rating determinations.

import {
  getMeasurements,
} from './measurements';

// Import all mental health criteria and functions from the ratingLogic module.
// Additional body systems will be added here as they are extracted.
import {
  MENTAL_HEALTH_CONDITIONS,
  MENTAL_HEALTH_SHARED_CRITERIA,
  PTSD_CRITERIA,
  MAJOR_DEPRESSION_CRITERIA,
  GENERALIZED_ANXIETY_CRITERIA,
  PANIC_DISORDER_CRITERIA,
  BIPOLAR_CRITERIA,
  SOCIAL_ANXIETY_CRITERIA,
  OCD_CRITERIA,
  PERSISTENT_DEPRESSIVE_CRITERIA,
  ADJUSTMENT_DISORDER_CRITERIA,
  UNSPECIFIED_ANXIETY_CRITERIA,
  UNSPECIFIED_DEPRESSIVE_CRITERIA,
  SOMATIC_SYMPTOM_DISORDER_CRITERIA,
  OTHER_SPECIFIED_SOMATIC_CRITERIA,
  UNSPECIFIED_SOMATIC_CRITERIA,
  ILLNESS_ANXIETY_CRITERIA,
  OTHER_SPECIFIED_ANXIETY_CRITERIA,
  DEPERSONALIZATION_DEREALIZATION_CRITERIA,
  CYCLOTHYMIC_CRITERIA,
  ANOREXIA_NERVOSA_CRITERIA,
  BULIMIA_NERVOSA_CRITERIA,
  SCHIZOPHRENIA_CRITERIA,
  SCHIZOAFFECTIVE_DISORDER_CRITERIA,
  DELUSIONAL_DISORDER_CRITERIA,
  PSYCHOTIC_DISORDER_NOS_CRITERIA,
  BRIEF_PSYCHOTIC_DISORDER_CRITERIA,
  BINGE_EATING_DISORDER_CRITERIA,
  DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA,
  DISSOCIATIVE_AMNESIA_CRITERIA,
  ACUTE_STRESS_DISORDER_CRITERIA,
  ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA,
  BORDERLINE_PERSONALITY_DISORDER_CRITERIA,
  NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA,
  AVOIDANT_PERSONALITY_DISORDER_CRITERIA,
  DEMENTIA_CRITERIA,
  // --- Neurological ---
  NEUROLOGICAL_CONDITIONS,
  MIGRAINE_CRITERIA,
  TBI_CRITERIA,
  RADICULOPATHY_CRITERIA,
  CHRONIC_FATIGUE_CRITERIA,
  PERIPHERAL_NEUROPATHY_CRITERIA,
  INSOMNIA_CRITERIA,
  TBI_RESIDUALS_CRITERIA,
  EPILEPSY_MAJOR_CRITERIA,
  EPILEPSY_MINOR_CRITERIA,
  EPILEPSY_JACKSONIAN_CRITERIA,
  EPILEPSY_DIENCEPHALIC_CRITERIA,
  EPILEPSY_PSYCHOMOTOR_CRITERIA,
  TINNITUS_CRITERIA,
  FIBROMYALGIA_CRITERIA,
  MULTIPLE_SCLEROSIS_CRITERIA,
  PARKINSONS_DISEASE_CRITERIA,
  MYASTHENIA_GRAVIS_CRITERIA,
  NARCOLEPSY_CRITERIA,
  ALS_CRITERIA,
  SYRINGOMYELIA_CRITERIA,
  MYELITIS_CRITERIA,
  UPPER_RADICULAR_GROUP_CRITERIA,
  MIDDLE_RADICULAR_GROUP_CRITERIA,
  LOWER_RADICULAR_GROUP_CRITERIA,
  ALL_RADICULAR_GROUPS_CRITERIA,
  RADIAL_NERVE_CRITERIA,
  MEDIAN_NERVE_CRITERIA,
  ULNAR_NERVE_CRITERIA,
  MUSCULOCUTANEOUS_NERVE_CRITERIA,
  CIRCUMFLEX_NERVE_CRITERIA,
  LONG_THORACIC_NERVE_CRITERIA,
  SCIATIC_NERVE_CRITERIA,
  COMMON_PERONEAL_NERVE_CRITERIA,
  SUPERFICIAL_PERONEAL_NERVE_CRITERIA,
  DEEP_PERONEAL_NERVE_CRITERIA,
  TIBIAL_NERVE_CRITERIA,
  POSTERIOR_TIBIAL_NERVE_CRITERIA,
  FEMORAL_NERVE_CRITERIA,
  SAPHENOUS_NERVE_CRITERIA,
  OBTURATOR_NERVE_CRITERIA,
  LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA,
  ILIOINGUINAL_NERVE_CRITERIA,
  LOSS_OF_SMELL_CRITERIA,
  LOSS_OF_TASTE_CRITERIA,
  WEAK_FOOT_CRITERIA,
  CLAW_FOOT_CRITERIA,
  METATARSALGIA_CRITERIA,
  HALLUX_VALGUS_CRITERIA,
  HALLUX_RIGIDUS_CRITERIA,
  MUSCULOSKELETAL_CONDITIONS,
  LUMBOSACRAL_STRAIN_CRITERIA,
  INTERVERTEBRAL_DISC_CRITERIA,
  KNEE_INSTABILITY_CRITERIA,
  PLANTAR_FASCIITIS_CRITERIA,
  SHOULDER_CRITERIA,
  HIP_CRITERIA,
  ANKLE_ACHILLES_CRITERIA,
  HIP_THIGH_CRITERIA,
  ANKLE_CRITERIA,
  WRIST_CRITERIA,
  ELBOW_CRITERIA,
  DEGENERATIVE_ARTHRITIS_CRITERIA,
  GOUT_CRITERIA,
  BURSITIS_CRITERIA,
  TENDINITIS_CRITERIA,
  MYOSITIS_CRITERIA,
  OSTEOMYELITIS_CRITERIA,
  MULTI_JOINT_ARTHRITIS_CRITERIA,
  GENERAL_SPINE_RATING_FORMULA,
  VERTEBRAL_FRACTURE_CRITERIA,
  SACROILIAC_INJURY_CRITERIA,
  SPINAL_STENOSIS_CRITERIA,
  ANKYLOSING_SPONDYLITIS_CRITERIA,
  SPINAL_FUSION_CRITERIA,
  AMPUTATION_CRITERIA,
  // Cardiorespiratory
  CARDIORESPIRATORY_CONDITIONS,
  SLEEP_APNEA_CRITERIA,
  HYPERTENSION_CRITERIA,
  RHINITIS_CRITERIA,
  SINUSITIS_CRITERIA,
  DEVIATED_SEPTUM_CRITERIA,
  CHRONIC_LARYNGITIS_CRITERIA,
  APHONIA_CRITERIA,
  LARYNGEAL_STENOSIS_CRITERIA,
  PHARYNX_INJURY_CRITERIA,
  NOSE_LOSS_CRITERIA,
  ASTHMA_CRITERIA,
  COPD_CRITERIA,
  CHRONIC_BRONCHITIS_CRITERIA,
  EMPHYSEMA_CRITERIA,
  BRONCHIECTASIS_CRITERIA,
  PULMONARY_FIBROSIS_CRITERIA,
  SARCOIDOSIS_CRITERIA,
  RAYNAUDS_CRITERIA,
  VARICOSE_VEINS_CRITERIA,
  CHRONIC_URTICARIA_CRITERIA,
  CARDIOMYOPATHY_CRITERIA,
  SVT_CRITERIA,
  VENTRICULAR_ARRHYTHMIA_CRITERIA,
  PERICARDITIS_CRITERIA,
  POST_PHLEBITIC_CRITERIA,
  CAD_CRITERIA,
  POST_MI_CRITERIA,
  HYPERTENSIVE_HEART_CRITERIA,
  COLD_INJURY_CRITERIA,
  PAD_CRITERIA,
  PERIPHERAL_ARTERIAL_DISEASE_CRITERIA,
  SYPHILITIC_HEART_DISEASE_CRITERIA,
  // --- Digestive ---
  DIGESTIVE_CONDITIONS,
  IBS_CRITERIA,
  GERD_CRITERIA,
  GERD_COMPLICATIONS_CRITERIA,
  ULCERATIVE_COLITIS_CRITERIA,
  PEPTIC_ULCER_CRITERIA,
  HEMORRHOID_CRITERIA,
  DIVERTICULITIS_CRITERIA,
  CIRRHOSIS_CRITERIA,
  GASTRITIS_CRITERIA,
  PANCREATITIS_CRITERIA,
  BILIARY_TRACT_CRITERIA,
  HERNIA_CRITERIA,
  PERITONEAL_ADHESIONS_CRITERIA,
  ESOPHAGEAL_STRICTURE_CRITERIA,
  POSTGASTRECTOMY_CRITERIA,
  INTESTINAL_FISTULA_CRITERIA,
  SPHINCTER_CONTROL_CRITERIA,
  RECTAL_STRICTURE_CRITERIA,
  RECTAL_PROLAPSE_CRITERIA,
  ANAL_FISTULA_CRITERIA,
  HEMORRHOIDS_CRITERIA,
  PRURITUS_ANI_CRITERIA,
  ESOPHAGEAL_SPASM_CRITERIA,
  // Skin & Endocrine
  SKIN_ENDOCRINE_CONDITIONS,
  DIABETES_CRITERIA,
  SCARS_CRITERIA,
  PSORIASIS_CRITERIA,
  ECZEMA_CRITERIA,
  HYPOTHYROIDISM_CRITERIA,
  HYPERTHYROIDISM_CRITERIA,
  THYROIDITIS_CRITERIA,
  HYPERPARATHYROIDISM_CRITERIA,
  HYPOPARATHYROIDISM_CRITERIA,
  ADDISONS_DISEASE_CRITERIA,
  CUSHINGS_SYNDROME_CRITERIA,
  DIABETES_INSIPIDUS_CRITERIA,
  HYPERALDOSTERONISM_CRITERIA,
  ACNE_CRITERIA,
  CHLORACNE_CRITERIA,
  ALOPECIA_AREATA_CRITERIA,
  HYPERHIDROSIS_CRITERIA,
  GENERAL_SKIN_FORMULA_CRITERIA,
  DISCOID_LUPUS_CRITERIA,
  BULLOUS_DISORDERS_CRITERIA,
  CUTANEOUS_VASCULITIS_CRITERIA,
  DERMATOPHYTOSIS_CRITERIA,
  SKIN_INFECTIONS_CRITERIA,
  SYSTEMIC_LUPUS_CRITERIA,
  AVITAMINOSIS_CRITERIA,
  BERIBERI_CRITERIA,
  PELLAGRA_CRITERIA,
  // --- Genitourinary ---
  GENITOURINARY_CONDITIONS,
  KIDNEY_STONES_CRITERIA,
  CHRONIC_RENAL_DISEASE_CRITERIA,
  VOIDING_DYSFUNCTION_CRITERIA,
  ERECTILE_DYSFUNCTION_CRITERIA,
  PENIS_CONDITIONS_CRITERIA,
  ENDOMETRIOSIS_CRITERIA,
  FEMALE_REPRODUCTIVE_ORGANS_CRITERIA,
  PELVIC_PROLAPSE_CRITERIA,
  FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA,
  CHRONIC_CYSTITIS_CRITERIA,
  NEUROGENIC_BLADDER_CRITERIA,
  PROSTATE_CONDITIONS_CRITERIA,
  URETHRAL_STRICTURE_CRITERIA,
  TESTIS_CONDITIONS_CRITERIA,
  SPHINCTER_IMPAIRMENT_CRITERIA,
  VULVA_CLITORIS_DISEASE_CRITERIA,
  VAGINA_DISEASE_CRITERIA,
  CERVIX_DISEASE_CRITERIA,
  UTERUS_DISEASE_CRITERIA,
  FALLOPIAN_TUBE_PID_CRITERIA,
  OVARY_DISEASE_CRITERIA,
  // --- Hemic & Lymphatic ---
  HEMIC_LYMPHATIC_CONDITIONS,
  IRON_DEFICIENCY_ANEMIA_CRITERIA,
  FOLATE_DEFICIENCY_ANEMIA_CRITERIA,
  PERNICIOUS_ANEMIA_CRITERIA,
  HEMOLYTIC_ANEMIA_CRITERIA,
  SICKLE_CELL_ANEMIA_CRITERIA,
  APLASTIC_ANEMIA_CRITERIA,
  POLYCYTHEMIA_VERA_CRITERIA,
  IMMUNE_THROMBOCYTOPENIA_CRITERIA,
  LEUKEMIA_CRITERIA,
  HODGKINS_LYMPHOMA_CRITERIA,
  MULTIPLE_MYELOMA_CRITERIA,
  NON_HODGKINS_LYMPHOMA_CRITERIA,
  MYELOPROLIFERATIVE_7718_CRITERIA,
  CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA,
  SOLITARY_PLASMACYTOMA_CRITERIA,
  MYELODYSPLASTIC_SYNDROMES_CRITERIA,
  // --- Dental, Visual & Ear ---
  DENTAL_VISUAL_CONDITIONS,
  MENIERES_CRITERIA,
  TMJ_CRITERIA,
  TMJ_DISORDER_CRITERIA,
  HEARING_LOSS_CRITERIA,
  VISION_LOSS_CRITERIA,
  GLAUCOMA_CRITERIA,
  DIABETIC_RETINOPATHY_CRITERIA,
  MACULAR_DEGENERATION_CRITERIA,
  TOOTH_LOSS_CRITERIA,
  MANDIBLE_NONUNION_CRITERIA,
  MANDIBLE_MALUNION_CRITERIA,
  MAXILLA_MALUNION_CRITERIA,
  MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA,
  MALIGNANT_ORAL_NEOPLASM_CRITERIA,
  BENIGN_ORAL_NEOPLASM_CRITERIA,
  GENERAL_EYE_FORMULA_CRITERIA,
  UVEITIS_CRITERIA,
  KERATITIS_CRITERIA,
  CHRONIC_CONJUNCTIVITIS_CRITERIA,
  SCLERITIS_CRITERIA,
  PERIPHERAL_VESTIBULAR_CRITERIA,
  CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA,
  CHRONIC_OTITIS_EXTERNA_CRITERIA,
  CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA,
  EYE_CONDITIONS_CRITERIA,
  // --- Infectious Diseases ---
  INFECTIOUS_CONDITIONS,
  HIV_AIDS_CRITERIA,
  HEPATITIS_C_CRITERIA,
  HEPATITIS_B_CRITERIA,
  LYME_DISEASE_CRITERIA,
  MALARIA_CRITERIA,
  BRUCELLOSIS_CRITERIA,
  CAMPYLOBACTER_CRITERIA,
  Q_FEVER_CRITERIA,
  SALMONELLA_CRITERIA,
  SHIGELLA_CRITERIA,
  WEST_NILE_CRITERIA,
  NTM_CRITERIA,
  TUBERCULOSIS_ACTIVE_CRITERIA,
  TUBERCULOSIS_INACTIVE_CRITERIA,
  TUBERCULOSIS_MILIARY_CRITERIA,
  SYPHILIS_CRITERIA,
  CEREBROSPINAL_SYPHILIS_CRITERIA,
  MENINGOVASCULAR_SYPHILIS_CRITERIA,
  TABES_DORSALIS_CRITERIA,
  SYPHILITIC_DEMENTIA_CRITERIA,
} from './ratingLogic/index';

/**
 * Safely get symptom ID from a log entry
 * Checks both log.symptomId and log. Symptom for backward compatibility
 * @param {Object} log - The log entry
 * @returns {string|null} - The symptom ID or null
 */
const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

// ============================================
// CONDITION DEFINITIONS
// ============================================
export const CONDITIONS = {
  // Mental health conditions are defined in src/utils/ratingLogic/mentalHealth.js
  // and spread here to keep the master CONDITIONS object complete.
  ...MENTAL_HEALTH_CONDITIONS,
  ...NEUROLOGICAL_CONDITIONS,
  ...MUSCULOSKELETAL_CONDITIONS,
  ...CARDIORESPIRATORY_CONDITIONS,
  ...DIGESTIVE_CONDITIONS,
  ...SKIN_ENDOCRINE_CONDITIONS,
  ...GENITOURINARY_CONDITIONS,
  ...HEMIC_LYMPHATIC_CONDITIONS,
  ...DENTAL_VISUAL_CONDITIONS,
  ...INFECTIOUS_CONDITIONS,

};

/**
 * Shared helper function for PFT-based respiratory analysis
 * Used by COPD, Chronic Bronchitis, and Emphysema
 */
const analyzeRespiratoryPFT = (logs, options, conditionConfig) => {
  const {
    evaluationPeriodDays = 90,
    profileId = null,
  } = options;

  const { conditionId, conditionName, diagnosticCode, symptomIds, criteria } = conditionConfig;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter symptom logs for this condition
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  // Get PFT measurements from the past year
  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);

  let fev1Measurements = [];
  let fvcMeasurements = [];
  let dlcoMeasurements = [];

  try {
    fev1Measurements = getMeasurements('fev1', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
    fvcMeasurements = getMeasurements('fvc', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
    dlcoMeasurements = getMeasurements('dlco', profileId).filter(m =>
        new Date(m.timestamp) >= yearAgo
    );
  } catch (error) {
    // Measurements may not be available
  }

  if (relevantLogs.length === 0 && fev1Measurements.length === 0 && dlcoMeasurements.length === 0) {
    return {
      hasData: false,
      message: `No ${conditionName} logs or PFT measurements found`,
      supportedRating: null,
      evidence: [],
      gaps: [
        `Start logging ${conditionName} symptoms`,
        'Get pulmonary function testing (spirometry + DLCO) to establish rating',
      ],
    };
  }

  // Calculate PFT metrics
  let latestFev1Percent = null;
  let latestFev1FvcRatio = null;
  let latestDlcoPercent = null;

  // FEV-1 analysis
  if (fev1Measurements.length > 0) {
    const latestFev1 = fev1Measurements.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    if (latestFev1.values.fev1 && latestFev1.values.fev1Predicted) {
      latestFev1Percent = (latestFev1.values.fev1 / latestFev1.values.fev1Predicted) * 100;
    }

    // Calculate FEV-1/FVC ratio
    if (fvcMeasurements.length > 0) {
      const matchingFvc = fvcMeasurements.find(fvc => {
        const timeDiff = Math.abs(new Date(fvc.timestamp) - new Date(latestFev1.timestamp));
        return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (matchingFvc && latestFev1.values.fev1) {
        latestFev1FvcRatio = (latestFev1.values.fev1 / matchingFvc.values.fvc) * 100;
      }
    }
  }

  // DLCO analysis
  if (dlcoMeasurements.length > 0) {
    const latestDlco = dlcoMeasurements.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );

    if (latestDlco.values.dlco && latestDlco.values.dlcoPredicted) {
      latestDlcoPercent = (latestDlco.values.dlco / latestDlco.values.dlcoPredicted) * 100;
    }
  }

  // Analyze symptom patterns
  const oxygenUseLogs = relevantLogs.filter(log => log.symptomId.includes('oxygen-use'));
  const exacerbationLogs = relevantLogs.filter(log => log.symptomId.includes('exacerbation'));
  const erVisitLogs = relevantLogs.filter(log => log.symptomId.includes('er-visit'));
  const hospitalizationLogs = relevantLogs.filter(log => log.symptomId.includes('hospitalization'));

  const hasOxygenUse = oxygenUseLogs.length > 0;

  // Build evidence array
  const evidence = [];

  if (fev1Measurements.length > 0 && latestFev1Percent !== null) {
    evidence.push(`Most recent FEV-1: ${latestFev1Percent.toFixed(0)}% of predicted`);
  }

  if (latestFev1FvcRatio !== null) {
    evidence.push(`FEV-1/FVC ratio: ${latestFev1FvcRatio.toFixed(0)}%`);
  }

  if (dlcoMeasurements.length > 0 && latestDlcoPercent !== null) {
    evidence.push(`Most recent DLCO: ${latestDlcoPercent.toFixed(0)}% of predicted`);
  }

  if (hasOxygenUse) {
    evidence.push(`${oxygenUseLogs.length} supplemental oxygen use entries logged`);
  }

  if (exacerbationLogs.length > 0) {
    evidence.push(`${exacerbationLogs.length} exacerbations logged`);
  }

  if (erVisitLogs.length > 0) {
    evidence.push(`${erVisitLogs.length} ER visits documented`);
  }

  if (hospitalizationLogs.length > 0) {
    evidence.push(`${hospitalizationLogs.length} hospitalizations documented`);
  }

  if (relevantLogs.length > 0) {
    const shortnessLogs = relevantLogs.filter(log => log.symptomId.includes('shortness'));
    const coughLogs = relevantLogs.filter(log => log.symptomId.includes('cough'));
    if (shortnessLogs.length > 0) {
      evidence.push(`${shortnessLogs.length} shortness of breath episodes logged`);
    }
    if (coughLogs.length > 0) {
      evidence.push(`${coughLogs.length} cough episodes logged`);
    }
  }

  // Determine supported rating
  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Check for 100% rating indicators
  if (hasOxygenUse) {
    supportedRating = 100;
    ratingRationale = [
      'Supplemental oxygen therapy documented',
      'Oxygen therapy requirement supports 100% rating',
    ];
  } else if (latestFev1Percent !== null && latestFev1Percent < 40) {
    supportedRating = 100;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (<40% required for 100%)`,
      'Spirometry evidence supports 100% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio < 40) {
    supportedRating = 100;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (<40% required for 100%)`,
      'Spirometry evidence supports 100% rating',
    ];
  } else if (latestDlcoPercent !== null && latestDlcoPercent < 40) {
    supportedRating = 100;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (<40% required for 100%)`,
      'Diffusion capacity evidence supports 100% rating',
    ];
  }

  // 60% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 40 && latestFev1Percent <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (40-55% range)`,
      'Spirometry evidence supports 60% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 40 && latestFev1FvcRatio <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (40-55% range)`,
      'Spirometry evidence supports 60% rating',
    ];
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 40 && latestDlcoPercent <= 55) {
    supportedRating = 60;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (40-55% range)`,
      'Diffusion capacity evidence supports 60% rating',
    ];
  }

  // 30% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 56 && latestFev1Percent <= 70) {
    supportedRating = 30;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (56-70% range)`,
      'Spirometry evidence supports 30% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 56 && latestFev1FvcRatio <= 70) {
    supportedRating = 30;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (56-70% range)`,
      'Spirometry evidence supports 30% rating',
    ];
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 56 && latestDlcoPercent <= 65) {
    supportedRating = 30;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (56-65% range)`,
      'Diffusion capacity evidence supports 30% rating',
    ];
  }

  // 10% Rating
  else if (latestFev1Percent !== null && latestFev1Percent >= 71 && latestFev1Percent <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (71-80% range)`,
      'Spirometry evidence supports 10% rating',
    ];
  } else if (latestFev1FvcRatio !== null && latestFev1FvcRatio >= 71 && latestFev1FvcRatio <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `FEV-1/FVC ratio at ${latestFev1FvcRatio.toFixed(0)}% (71-80% range)`,
      'Spirometry evidence supports 10% rating',
    ];
  } else if (latestDlcoPercent !== null && latestDlcoPercent >= 66 && latestDlcoPercent <= 80) {
    supportedRating = 10;
    ratingRationale = [
      `DLCO at ${latestDlcoPercent.toFixed(0)}% of predicted (66-80% range)`,
      'Diffusion capacity evidence supports 10% rating',
    ];
  } else if (relevantLogs.length > 0) {
    // Has symptoms but no PFT data
    supportedRating = '10-30';
    ratingRationale = [
      `${relevantLogs.length} symptom entries logged`,
      'Symptoms documented but PFT testing needed to confirm rating level',
    ];
    gaps.push('Get pulmonary function testing (FEV-1/FVC + DLCO) - required for VA rating');
  }

  // 0% or Insufficient Data
  else {
    if (latestFev1Percent !== null && latestFev1Percent > 80) {
      supportedRating = 0;
      ratingRationale = [
        `FEV-1 at ${latestFev1Percent.toFixed(0)}% of predicted (>80% is normal)`,
        'Spirometry shows minimal impairment',
      ];
    } else {
      supportedRating = 0;
      ratingRationale = [
        'Insufficient evidence for compensable rating',
      ];
      gaps.push('Get pulmonary function testing (FEV-1/FVC + DLCO) - required for VA rating');
      gaps.push(`Document all ${conditionName} symptoms and exacerbations`);
    }
  }

  // Add general gaps if rating could be higher
  if (supportedRating !== 100 && typeof supportedRating === 'number') {
    if (fev1Measurements.length === 0) {
      gaps.push('Get spirometry testing (FEV-1/FVC) - this is required for VA rating');
    }
    if (dlcoMeasurements.length === 0) {
      gaps.push('Get DLCO testing - important for comprehensive pulmonary evaluation');
    }
    if (!hasOxygenUse && exacerbationLogs.length > 0) {
      gaps.push('Document if supplemental oxygen is prescribed');
    }
  }

  return {
    hasData: true,
    condition: conditionName,
    diagnosticCode,
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria,
    disclaimer: criteria.disclaimer,
  };
};
// Helper function to check if timestamp is within evaluation period
const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};
// Helper function to count treatment visits from logged episodes
const countEyeTreatmentVisits = (logs, prefix) => {
  let visitCount = 0;

  // Count individual treatment visit logs
  const treatmentVisitLogs = logs.filter(log => {
    const symptomId = getLogSymptomId(log);
    return symptomId === `${prefix}-treatment-visit`;
  });
  visitCount += treatmentVisitLogs.length;

  // Also check for episode range indicators and add their implied counts
  const hasEpisodes7plus = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-7plus`);
  const hasEpisodes5to6 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-5to6`);
  const hasEpisodes3to4 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-3to4`);
  const hasEpisodes1to2 = logs.some(log => getLogSymptomId(log) === `${prefix}-episodes-1to2`);

  // Return the highest documented episode count if logged
  if (hasEpisodes7plus) return Math.max(visitCount, 7);
  if (hasEpisodes5to6) return Math.max(visitCount, 5);
  if (hasEpisodes3to4) return Math.max(visitCount, 3);
  if (hasEpisodes1to2) return Math.max(visitCount, 1);

  return visitCount;
};
// Helper function to determine rating based on treatment visits
const getEyeRatingFromVisits = (visitCount) => {
  if (visitCount >= 7) return 60;
  if (visitCount >= 5) return 40;
  if (visitCount >= 3) return 20;
  if (visitCount >= 1) return 10;
  return 0;
};
// ============================================
// PHASE 1C: PERIPHERAL NERVE ANALYSIS FUNCTIONS
// 38 CFR 4.124a
// ============================================
/**
 * Helper function to determine severity level for peripheral nerve conditions
 * Based on symptom frequency, motor vs sensory involvement, and functional impact
 */
const determineNerveSeverity = (logs, motorSymptomIds, sensorySymptomIds, functionalSymptomIds = []) => {
  const motorLogs = logs.filter(log => motorSymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));
  const sensoryLogs = logs.filter(log => sensorySymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));
  const functionalLogs = logs.filter(log => functionalSymptomIds.some(id =>
      getLogSymptomId(log).toLowerCase() === id.toLowerCase()
  ));

  const hasMotorInvolvement = motorLogs.length > 0;
  const hasSensoryInvolvement = sensoryLogs.length > 0;
  const hasFunctionalImpact = functionalLogs.length > 0;

  // Calculate average severity from logs
  const allLogs = [...motorLogs, ...sensoryLogs, ...functionalLogs];
  const severityScores = allLogs
  .map(log => log.severity)
  .filter(s => s !== undefined && s !== null);
  const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length
      : 0;

  // Determine paralysis type based on involvement pattern
  // Per 38 CFR 4.124a: "When involvement is wholly sensory, rate as mild or at most moderate"
  const isWholySensory = hasSensoryInvolvement && !hasMotorInvolvement;

  let severityLevel = 'mild';
  if (isWholySensory) {
    // Sensory only - max is moderate per VA regulation
    severityLevel = avgSeverity >= 7 ? 'moderate' : 'mild';
  } else if (hasMotorInvolvement) {
    if (avgSeverity >= 9 || (motorLogs.length >= 10 && hasFunctionalImpact)) {
      severityLevel = 'complete';
    } else if (avgSeverity >= 7 || (motorLogs.length >= 5 && avgSeverity >= 6)) {
      severityLevel = 'severe';
    } else if (avgSeverity >= 5 || motorLogs.length >= 3) {
      severityLevel = 'moderate';
    } else {
      severityLevel = 'mild';
    }
  }

  return {
    severityLevel,
    hasMotorInvolvement,
    hasSensoryInvolvement,
    isWholySensory,
    hasFunctionalImpact,
    motorLogCount: motorLogs.length,
    sensoryLogCount: sensoryLogs.length,
    avgSeverity: avgSeverity.toFixed(1),
    totalLogs: allLogs.length,
  };
};
/**
 * Helper function to determine rating based on severity and extremity for upper extremity nerves
 */
const getUpperExtremityNerveRating = (severityLevel, isMajorExtremity, ratingScale) => {
  // ratingScale is an object like: { complete: {major: 70, minor: 60}, severe: {major: 50, minor: 40}, ... }
  const scale = ratingScale[severityLevel];
  if (!scale) return ratingScale.mild?.major || ratingScale.mild?.both || 0;

  if (scale.both !== undefined) return scale.both;
  return isMajorExtremity ? scale.major : scale.minor;
};
// METATARSALGIA ANALYSIS FUNCTION (DC 5279)
export const analyzeMetatarsalgiaLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.date);
    return logDate >= cutoffDate && CONDITIONS.METATARSALGIA.symptomIds.includes(getLogSymptomId(log));
  });

  if (relevantLogs.length === 0) {
    return { hasData: false, condition: "Metatarsalgia (Morton's Disease)", diagnosticCode: '5279' };
  }

  const totalLogs = relevantLogs.length;
  const avgSeverity = relevantLogs.reduce((sum, log) => sum + (log.severity || 5), 0) / totalLogs;

  // Count specific symptoms
  const ballFootPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-ball-foot-pain').length;
  const numbnessCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-numbness-toes').length;
  const burningCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-burning').length;
  const shootingPainCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-shooting-pain').length;
  const functionalLossCount = relevantLogs.filter(l => getLogSymptomId(l) === 'mt-functional-loss').length;

  // DC 5279 only provides 10% rating
  const supportedRating = 10;
  const ratingRationale = [];
  const gaps = [];

  ratingRationale.push('DC 5279 provides 10% rating for metatarsalgia (unilateral or bilateral)');
  ratingRationale.push(`${totalLogs} total symptoms logged over evaluation period`);
  ratingRationale.push(`Average severity: ${avgSeverity.toFixed(1)}/10`);

  if (ballFootPainCount > 0) {
    ratingRationale.push(`Ball of foot pain documented ${ballFootPainCount} time(s)`);
  }
  if (shootingPainCount > 0) {
    ratingRationale.push(`Shooting pain (Morton neuroma indicator) logged ${shootingPainCount} time(s)`);
  }

  if (avgSeverity >= 7) {
    gaps.push('Severe symptoms may warrant extraschedular consideration - discuss with VSO');
  }
  if (functionalLossCount === 0) {
    gaps.push('Document functional limitations (walking, standing restrictions)');
  }

  return {
    hasData: true,
    condition: "Metatarsalgia (Morton's Disease)",
    diagnosticCode: '5279',
    cfrReference: '38 CFR 4.71a',
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs,
      avgSeverity,
      ballFootPainCount,
      numbnessCount,
      burningCount,
      shootingPainCount,
      functionalLossCount,
    },
    criteria: METATARSALGIA_CRITERIA,
  };
};
// ============================================
// HELPER FUNCTIONS
// ============================================
export const formatRating = (percent) => {
  if (percent === null) return 'N/A';
  return `${percent}%`;
};
/**
 * Helper function to identify distinct flare episodes
 * Groups logs within 14 days as same episode
 */
const identifyFlareEpisodes = (flareLogs) => {
  if (flareLogs.length === 0) return [];

  // Sort by date
  const sorted = [...flareLogs].sort((a, b) =>
      new Date(a.timestamp || a.occurredAt) - new Date(b.timestamp || b.occurredAt)
  );

  const episodes = [];
  let currentEpisode = {
    startDate: new Date(sorted[0].timestamp || sorted[0].occurredAt),
    endDate: new Date(sorted[0].timestamp || sorted[0].occurredAt),
    logs: [sorted[0]],
    maxSeverity: sorted[0].severity || 5,
  };

  for (let i = 1; i < sorted.length; i++) {
    const logDate = new Date(sorted[i].timestamp || sorted[i].occurredAt);
    const daysSinceLastLog = (logDate - currentEpisode.endDate) / (1000 * 60 * 60 * 24);

    if (daysSinceLastLog <= 14) {
      // Same episode
      currentEpisode.endDate = logDate;
      currentEpisode.logs.push(sorted[i]);
      currentEpisode.maxSeverity = Math.max(currentEpisode.maxSeverity, sorted[i].severity || 5);
    } else {
      // New episode
      currentEpisode.durationDays = Math.ceil((currentEpisode.endDate - currentEpisode.startDate) / (1000 * 60 * 60 * 24)) + 1;
      episodes.push(currentEpisode);
      currentEpisode = {
        startDate: logDate,
        endDate: logDate,
        logs: [sorted[i]],
        maxSeverity: sorted[i].severity || 5,
      };
    }
  }

  // Don't forget the last episode
  currentEpisode.durationDays = Math.ceil((currentEpisode.endDate - currentEpisode.startDate) / (1000 * 60 * 60 * 24)) + 1;
  episodes.push(currentEpisode);

  return episodes;
};
/**
 * Get badge/pill color classes for rating percentage
 * Granular 10% increments matching the heat map color scheme
 * Used for rating badges in card headers and summaries
 */
export const getRatingColorClass = (percent) => {
  if (percent === null || percent === undefined) {
    return 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600';
  }
  if (percent >= 100) return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
  if (percent >= 90) return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700';
  if (percent >= 80) return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
  if (percent >= 70) return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700';
  if (percent >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
  if (percent >= 50) return 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700';
  if (percent >= 40) return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
  if (percent >= 30) return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700';
  if (percent >= 20) return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700';
  if (percent >= 10) return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
  // 0%: Service-connected, non-compensable
  return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700';
};
/**
 * Get background/border color classes for rating rows (inside expanded cards)
 * Granular 10% increments matching the heat map color scheme
 * Handles both numeric ratings (50) and range strings ("10-30")
 */
export const getRatingRowColor = (rating, isSupported) => {
  if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';

  // Normalize rating - handle strings like "10-30" by taking the first number
  let percent = rating;
  if (typeof rating === 'string') {
    const match = rating.match(/(\d+)/);
    percent = match ? parseInt(match[1], 10) : null;
  }

  if (percent === null) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
  if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
  if (percent >= 90) return 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700';
  if (percent >= 80) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
  if (percent >= 70) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
  if (percent >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
  if (percent >= 50) return 'bg-lime-100 dark:bg-lime-900/30 border-lime-300 dark:border-lime-700';
  if (percent >= 40) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
  if (percent >= 30) return 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700';
  if (percent >= 20) return 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700';
  if (percent >= 10) return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
  return 'bg-slate-100 dark:bg-slate-900/30 border-slate-300 dark:border-slate-700';
};
/**
 * Get text color for rating percentage display (collapsed card headers)
 * Matches the row color scheme for visual consistency
 * Handles both numeric ratings (50) and range strings ("10-30")
 */
export const getRatingTextColor = (rating) => {
  if (rating === null || rating === undefined) return 'text-gray-500 dark:text-gray-400';

  // Normalize rating - handle strings like "10-30" by taking the first number
  let percent = rating;
  if (typeof rating === 'string') {
    // Handle range ratings like "10-30" - use the lower bound for color
    const match = rating.match(/(\d+)/);
    percent = match ? parseInt(match[1], 10) : null;
  }

  if (percent === null) return 'text-gray-500 dark:text-gray-400';
  if (percent >= 100) return 'text-red-600 dark:text-red-400';
  if (percent >= 90) return 'text-rose-600 dark:text-rose-400';
  if (percent >= 80) return 'text-orange-600 dark:text-orange-400';
  if (percent >= 70) return 'text-amber-600 dark:text-amber-400';
  if (percent >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (percent >= 50) return 'text-lime-600 dark:text-lime-400';
  if (percent >= 40) return 'text-green-600 dark:text-green-400';
  if (percent >= 30) return 'text-teal-600 dark:text-teal-400';
  if (percent >= 20) return 'text-cyan-600 dark:text-cyan-400';
  if (percent >= 10) return 'text-blue-600 dark:text-blue-400';
  return 'text-slate-600 dark:text-slate-400';
};
export const getEvaluationPeriod = (days = 90) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate,
    endDate,
    days,
    months: (days / 30).toFixed(1),
  };
};


export const getMigraineRatingCriteria = (percent) => MIGRAINE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSleepApneaRatingCriteria = (percent) => SLEEP_APNEA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPTSDRatingCriteria = (percent) => PTSD_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMajorDepressionRatingCriteria = (percent) => MAJOR_DEPRESSION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getGeneralizedAnxietyRatingCriteria = (percent) => GENERALIZED_ANXIETY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPanicDisorderRatingCriteria = (percent) => PANIC_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBipolarRatingCriteria = (percent) => BIPOLAR_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLumbosacralStrainRatingCriteria = (percent) => LUMBOSACRAL_STRAIN_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getIntervertebralDiscRatingCriteria = (percent) => {
  const incapEpisodes = INTERVERTEBRAL_DISC_CRITERIA.ratingsIncapacitatingEpisodes.find(r => r.percent === percent);
  if (incapEpisodes) return incapEpisodes;
  return INTERVERTEBRAL_DISC_CRITERIA.ratingsGeneralFormula.find(r => r.percent === percent) || null;
};
export const getKneeInstabilityRatingCriteria = (percent) => KNEE_INSTABILITY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAnkleAchillesRatingCriteria = (percent) => ANKLE_ACHILLES_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHipThighRatingCriteria = (percent) => HIP_THIGH_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTBIRatingCriteria = (percent) => TBI_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHypertensionRatingCriteria = (percent) => HYPERTENSION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTinnitusRatingCriteria = (percent) => TINNITUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getFibromyalgiaRatingCriteria = (percent) => FIBROMYALGIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSocialAnxietyRatingCriteria = (percent) => SOCIAL_ANXIETY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getOCDRatingCriteria = (percent) => OCD_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPersistentDepressiveRatingCriteria = (percent) => PERSISTENT_DEPRESSIVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAdjustmentDisorderRatingCriteria = (percent) => ADJUSTMENT_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUnspecifiedAnxietyRatingCriteria = (percent) => UNSPECIFIED_ANXIETY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUnspecifiedDepressiveRatingCriteria = (percent) => UNSPECIFIED_DEPRESSIVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getKidneyStonesRatingCriteria = (percent) => KIDNEY_STONES_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicRenalDiseaseRatingCriteria = (percent) => CHRONIC_RENAL_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getVoidingDysfunctionIncontinenceRating = (percent) => VOIDING_DYSFUNCTION_CRITERIA.ratingsIncontinence.find(r => r.percent === percent) || null;
export const getVoidingDysfunctionFrequencyRating = (percent) => VOIDING_DYSFUNCTION_CRITERIA.ratingsFrequency.find(r => r.percent === percent) || null;
export const getVoidingDysfunctionObstructionRating = (percent) => VOIDING_DYSFUNCTION_CRITERIA.ratingsObstruction.find(r => r.percent === percent) || null;
export const getSphincterImpairmentRatingCriteria = (percent) => SPHINCTER_IMPAIRMENT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getErectileDysfunctionRatingCriteria = (percent) => ERECTILE_DYSFUNCTION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getFemaleArousalDisorderRatingCriteria = (percent) => FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getIronDeficiencyAnemiaRatingCriteria = (percent) => IRON_DEFICIENCY_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getFolateDeficiencyAnemiaRatingCriteria = (percent) => FOLATE_DEFICIENCY_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPerniciousAnemiaRatingCriteria = (percent) => PERNICIOUS_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHemolyticAnemiaRatingCriteria = (percent) => HEMOLYTIC_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSickleCellAnemiaRatingCriteria = (percent) => SICKLE_CELL_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAplasticAnemiaRatingCriteria = (percent) => APLASTIC_ANEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPolycythemiaVeraRatingCriteria = (percent) => POLYCYTHEMIA_VERA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getImmuneThrombocytopeniaRatingCriteria = (percent) => IMMUNE_THROMBOCYTOPENIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLeukemiaRatingCriteria = (percent) => LEUKEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHodgkinsLymphomaRatingCriteria = (percent) => HODGKINS_LYMPHOMA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMultipleMyelomaRatingCriteria = (percent) => MULTIPLE_MYELOMA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getNonHodgkinsLymphomaRatingCriteria = (percent) => NON_HODGKINS_LYMPHOMA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMyeloproliferative7718RatingCriteria = (percent) => MYELOPROLIFERATIVE_7718_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicMyelogenousLeukemiaRatingCriteria = (percent) => CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSolitaryPlasmacytomaRatingCriteria = (percent) => SOLITARY_PLASMACYTOMA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMyelodysplasticSyndromesRatingCriteria = (percent) => MYELODYSPLASTIC_SYNDROMES_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTMJDisorderRatingCriteria = (percent) => TMJ_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getToothLossRatingCriteria = (percent) => TOOTH_LOSS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMandibleNonunionRatingCriteria = (percent) => MANDIBLE_NONUNION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMalignantOralNeoplasmRatingCriteria = (percent) => MALIGNANT_ORAL_NEOPLASM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBenignOralNeoplasmRatingCriteria = (percent) => BENIGN_ORAL_NEOPLASM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHIVAIDSRatingCriteria = (percent) => HIV_AIDS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHepatitisCRatingCriteria = (percent) => HEPATITIS_C_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHepatitisBRatingCriteria = (percent) => HEPATITIS_B_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLymeDiseaseRatingCriteria = (percent) => LYME_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMalariaRatingCriteria = (percent) => MALARIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBrucellosisRatingCriteria = (percent) => BRUCELLOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCampylobacterRatingCriteria = (percent) => CAMPYLOBACTER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getQFeverRatingCriteria = (percent) => Q_FEVER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSalmonellaRatingCriteria = (percent) => SALMONELLA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getShigellaRatingCriteria = (percent) => SHIGELLA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getWestNileRatingCriteria = (percent) => WEST_NILE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getNTMRatingCriteria = (percent) => NTM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSchizophreniaRatingCriteria = (percent) => SCHIZOPHRENIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSchizoaffectiveDisorderRatingCriteria = (percent) => SCHIZOAFFECTIVE_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDelusionalDisorderRatingCriteria = (percent) => DELUSIONAL_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPsychoticDisorderNOSRatingCriteria = (percent) => PSYCHOTIC_DISORDER_NOS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBriefPsychoticDisorderRatingCriteria = (percent) => BRIEF_PSYCHOTIC_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBingeEatingDisorderRatingCriteria = (percent) => BINGE_EATING_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDissociativeIdentityDisorderRatingCriteria = (percent) => DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDissociativeAmnesiaRatingCriteria = (percent) => DISSOCIATIVE_AMNESIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAcuteStressDisorderRatingCriteria = (percent) => ACUTE_STRESS_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAntisocialPersonalityDisorderRatingCriteria = (percent) => ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBorderlinePersonalityDisorderRatingCriteria = (percent) => BORDERLINE_PERSONALITY_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getNarcissisticPersonalityDisorderRatingCriteria = (percent) => NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAvoidantPersonalityDisorderRatingCriteria = (percent) => AVOIDANT_PERSONALITY_DISORDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCardiomyopathyRatingCriteria = (percent) => CARDIOMYOPATHY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSVTRatingCriteria = (percent) => SVT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getVentricularArrhythmiaRatingCriteria = (percent) => VENTRICULAR_ARRHYTHMIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPericarditisRatingCriteria = (percent) => PERICARDITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPostPhlebiticRatingCriteria = (percent) => POST_PHLEBITIC_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getColdInjuryRatingCriteria = (percent) => COLD_INJURY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPADRatingCriteria = (percent) => PAD_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHyperthyroidismRatingCriteria = (percent) => HYPERTHYROIDISM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getThyroiditisRatingCriteria = (percent) => THYROIDITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHyperparathyroidismRatingCriteria = (percent) => HYPERPARATHYROIDISM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHypoparathyroidismRatingCriteria = (percent) => HYPOPARATHYROIDISM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAddisonsDiseaseRatingCriteria = (percent) => ADDISONS_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCushingsSyndromeRatingCriteria = (percent) => CUSHINGS_SYNDROME_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDiabetesInsipidusRatingCriteria = (percent) => DIABETES_INSIPIDUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHyperaldosteronismRatingCriteria = (percent) => HYPERALDOSTERONISM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCirrhosisRatingCriteria = (percent) => CIRRHOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getGastritisRatingCriteria = (percent) => GASTRITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPancreatitisRatingCriteria = (percent) => PANCREATITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBiliaryTractRatingCriteria = (percent) => BILIARY_TRACT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBronchiectasisRatingCriteria = (percent) => BRONCHIECTASIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPulmonaryFibrosisRatingCriteria = (percent) => PULMONARY_FIBROSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSarcoidosisRatingCriteria = (percent) => SARCOIDOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMultipleSclerosisRatingCriteria = (percent) => MULTIPLE_SCLEROSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getParkinsonsRatingCriteria = (percent) => PARKINSONS_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMyastheniaGravisRatingCriteria = (percent) => MYASTHENIA_GRAVIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getNarcolepsyRatingCriteria = (percent) => NARCOLEPSY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getALSRatingCriteria = (percent) => ALS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSyringomyeliaRatingCriteria = (percent) => SYRINGOMYELIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMyelitisRatingCriteria = (percent) => MYELITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUpperRadicularGroupRatingCriteria = (percent) => UPPER_RADICULAR_GROUP_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMiddleRadicularGroupRatingCriteria = (percent) => MIDDLE_RADICULAR_GROUP_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLowerRadicularGroupRatingCriteria = (percent) => LOWER_RADICULAR_GROUP_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAllRadicularGroupsRatingCriteria = (percent) => ALL_RADICULAR_GROUPS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getRadialNerveRatingCriteria = (percent) => RADIAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMedianNerveRatingCriteria = (percent) => MEDIAN_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUlnarNerveRatingCriteria = (percent) => ULNAR_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMusculocutaneousNerveRatingCriteria = (percent) => MUSCULOCUTANEOUS_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCircumflexNerveRatingCriteria = (percent) => CIRCUMFLEX_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLongThoracicNerveRatingCriteria = (percent) => LONG_THORACIC_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSciaticNerveRatingCriteria = (percent) => SCIATIC_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCommonPeronealNerveRatingCriteria = (percent) => COMMON_PERONEAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSuperficialPeronealNerveRatingCriteria = (percent) => SUPERFICIAL_PERONEAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDeepPeronealNerveRatingCriteria = (percent) => DEEP_PERONEAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTibialNerveRatingCriteria = (percent) => TIBIAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPosteriorTibialNerveRatingCriteria = (percent) => POSTERIOR_TIBIAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getFemoralNerveRatingCriteria = (percent) => FEMORAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSaphenousNerveRatingCriteria = (percent) => SAPHENOUS_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getObturatorNerveRatingCriteria = (percent) => OBTURATOR_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLateralFemoralCutaneousNerveRatingCriteria = (percent) => LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getIlioinguinalNerveRatingCriteria = (percent) => ILIOINGUINAL_NERVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getJacksonianEpilepsyRatingCriteria = (percent) => EPILEPSY_JACKSONIAN_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDiencephalicEpilepsyRatingCriteria = (percent) => EPILEPSY_DIENCEPHALIC_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPsychomotorEpilepsyRatingCriteria = (percent) => EPILEPSY_PSYCHOMOTOR_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getGoutRatingCriteria = (percent) => GOUT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBursitisRatingCriteria = (percent) => BURSITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTendinitisRatingCriteria = (percent) => TENDINITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMyositisRatingCriteria = (percent) => MYOSITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getOsteomyelitisRatingCriteria = (percent) => OSTEOMYELITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMultiJointArthritisRatingCriteria = (percent) => MULTI_JOINT_ARTHRITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getVertebralFractureRatingCriteria = (percent) => VERTEBRAL_FRACTURE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSacroiliacInjuryRatingCriteria = (percent) => SACROILIAC_INJURY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSpinalStenosisRatingCriteria = (percent) => SPINAL_STENOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAnkylosingSpondylitisRatingCriteria = (percent) => ANKYLOSING_SPONDYLITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSpinalFusionRatingCriteria = (percent) => SPINAL_FUSION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getWeakFootRatingCriteria = (percent) => WEAK_FOOT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getClawFootRatingCriteria = (percent) => CLAW_FOOT_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMetatarsalgiaRatingCriteria = (percent) => METATARSALGIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHalluxValgusRatingCriteria = (percent) => HALLUX_VALGUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHalluxRigidusRatingCriteria = (percent) => HALLUX_RIGIDUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHerniaRatingCriteria = (percent) => HERNIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPeritonealAdhesionsRatingCriteria = (percent) => PERITONEAL_ADHESIONS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getEsophagealStrictureRatingCriteria = (percent) => ESOPHAGEAL_STRICTURE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPostgastrectomyRatingCriteria = (percent) => POSTGASTRECTOMY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getIntestinalFistulaRatingCriteria = (percent) => INTESTINAL_FISTULA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAcneRating = (percent) => ACNE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChloracneRating = (percent) => CHLORACNE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAlopeciaAreataRating = (percent) => ALOPECIA_AREATA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHyperhidrosisRating = (percent) => HYPERHIDROSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDiscoidLupusRating = (percent) => DISCOID_LUPUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBullousDisordersRating = (percent) => BULLOUS_DISORDERS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCutaneousVasculitisRating = (percent) => CUTANEOUS_VASCULITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDermatophytosisRating = (percent) => DERMATOPHYTOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSkinInfectionsRating = (percent) => SKIN_INFECTIONS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getGeneralEyeFormulaRating = (percent) => GENERAL_EYE_FORMULA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUveitisRating = (percent) => UVEITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getKeratitisRating = (percent) => KERATITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicConjunctivitisRating = (percent) => CHRONIC_CONJUNCTIVITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getScleritisRating = (percent) => SCLERITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPeripheralVestibularRating = (percent) => PERIPHERAL_VESTIBULAR_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicSuppurativeOtitisMediaRating = (percent) => CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicOtitisExternaRating = (percent) => CHRONIC_OTITIS_EXTERNA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicNonsuppurativeOtitisMediaRating = (percent) => CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLossOfSmellRating = (percent) => LOSS_OF_SMELL_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLossOfTasteRating = (percent) => LOSS_OF_TASTE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSystemicLupusRating = (percent) => SYSTEMIC_LUPUS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTuberculosisActiveRating = (percent) => TUBERCULOSIS_ACTIVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTuberculosisInactiveRating = (percent) => TUBERCULOSIS_INACTIVE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTuberculosisMilitaryRating = (percent) => TUBERCULOSIS_MILIARY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getSphincterControlRating = (percent) => SPHINCTER_CONTROL_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getRectalStrictureRating = (percent) => RECTAL_STRICTURE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getRectalProlapseRating = (percent) => RECTAL_PROLAPSE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAnalFistulaRating = (percent) => ANAL_FISTULA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getHemorrhoidsRating = (percent) => HEMORRHOIDS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPruritusAniRating = (percent) => PRURITUS_ANI_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAvitaminosisRating = (percent) => AVITAMINOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getBeriberiRating = (percent) => BERIBERI_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPellagraRating = (percent) => PELLAGRA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getVulvaClitorisDiseaseRating = (percent) => VULVA_CLITORIS_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getVaginaDiseaseRating = (percent) => VAGINA_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getCervixDiseaseRating = (percent) => CERVIX_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUterusDiseaseRating = (percent) => UTERUS_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getFallopianTubePIDRating = (percent) => FALLOPIAN_TUBE_PID_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getOvaryDiseaseRating = (percent) => OVARY_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicCystitisRating = (percent) => CHRONIC_CYSTITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getNeurogenicBladderRating = (percent) => NEUROGENIC_BLADDER_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getProstateConditionsRating = (percent) => PROSTATE_CONDITIONS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getUrethralStrictureRating = (percent) => URETHRAL_STRICTURE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMandibleMalunionRating = (percent) => MANDIBLE_MALUNION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMaxillaMalunionRating = (percent) => MAXILLA_MALUNION_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMaxillaMandibleBoneDiseaseRating = (percent) => MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getEsophagealSpasmRating = (percent) => ESOPHAGEAL_SPASM_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getEssentialThrombocythemiaRating = (percent) => MYELOPROLIFERATIVE_7718_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getEyeConditionsRating = (percent) => EYE_CONDITIONS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getChronicLaryngitisRatingCriteria = (percent) => CHRONIC_LARYNGITIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getAphoniaRatingCriteria = (percent) => APHONIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getLaryngealStenosisRatingCriteria = (percent) => LARYNGEAL_STENOSIS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPharynxInjuryRatingCriteria = (percent) => PHARYNX_INJURY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getDementiaRatingCriteria = (percent) => DEMENTIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getPeripheralNeuropathyRatingCriteria = (percent) => PERIPHERAL_NEUROPATHY_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getInsomniaRatingCriteria = (percent) => INSOMNIA_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getTbiResidualsRatingCriteria = (percent) => TBI_RESIDUALS_CRITERIA.ratings.find(r => r.percent === percent) || null;
export const getMentalHealthSharedRatingCriteria = (percent) =>   MENTAL_HEALTH_SHARED_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getPlantarFasciitisRatingCriteria = (percent) =>   PLANTAR_FASCIITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getShoulderRatingCriteria = (percent) =>   SHOULDER_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getHipRatingCriteria = (percent) =>   HIP_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getAnkleRatingCriteria = (percent) =>   ANKLE_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getWristRatingCriteria = (percent) =>   WRIST_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getElbowRatingCriteria = (percent) =>   ELBOW_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getDegenerativeArthritisRatingCriteria = (percent) =>   DEGENERATIVE_ARTHRITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getGeneralSpineRatingCriteria = (percent) =>   GENERAL_SPINE_RATING_FORMULA.ratings.find(r =>r.percent === percent) || null;
export const getRhinitisRatingCriteria = (percent) =>   RHINITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getSinusitisRatingCriteria = (percent) =>   SINUSITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getDeviatedSeptumRatingCriteria = (percent) =>   DEVIATED_SEPTUM_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getNoseLossRatingCriteria = (percent) =>   NOSE_LOSS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getCopdRatingCriteria = (percent) =>   COPD_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getChronicBronchitisRatingCriteria = (percent) =>   CHRONIC_BRONCHITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getEmphysemaRatingCriteria = (percent) =>   EMPHYSEMA_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getRaynaudsRatingCriteria = (percent) =>   RAYNAUDS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getVaricoseVeinsRatingCriteria = (percent) =>   VARICOSE_VEINS_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getChronicUrticariaRatingCriteria = (percent) =>   CHRONIC_URTICARIA_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getCadRatingCriteria = (percent) =>   CAD_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getPostMiRatingCriteria = (percent) =>   POST_MI_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getHypertensiveHeartRatingCriteria = (percent) =>   HYPERTENSIVE_HEART_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getPeripheralArterialDiseaseRatingCriteria = (percent) =>   PERIPHERAL_ARTERIAL_DISEASE_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getSyphiliticHeartDiseaseRatingCriteria = (percent) =>   SYPHILITIC_HEART_DISEASE_CRITERIA.ratings.find(r =>r.percent === percent) || null;
export const getAmputationRatingCriteria = (percent => AMPUTATION_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getIbsRatingCriteria = (percent => IBS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getGerdRatingCriteria = (percent => GERD_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getGerdComplicationsRatingCriteria = (percent => GERD_COMPLICATIONS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getUlcerativeColitisRatingCriteria = (percent => ULCERATIVE_COLITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getPepticUlcerRatingCriteria = (percent => PEPTIC_ULCER_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getHemorrhoidRatingCriteria = (percent => HEMORRHOID_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getDiverticulitisRatingCriteria = (percent => DIVERTICULITIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getDiabetesRatingCriteria = (percent => DIABETES_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getScarsRatingCriteria = (percent => SCARS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getPsoriasisRatingCriteria = (percent => PSORIASIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getEczemaRatingCriteria = (percent => ECZEMA_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getHypothyroidismRatingCriteria = (percent => HYPOTHYROIDISM_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getChronicCystitisRatingCriteria = getVoidingDysfunctionIncontinenceRating;
export const getNeurogenicBladderRatingCriteria = getVoidingDysfunctionIncontinenceRating;
export const getProstateConditionsRatingCriteria = getVoidingDysfunctionFrequencyRating;
export const getUrethralStrictureRatingCriteria = getVoidingDysfunctionObstructionRating;
export const getPenisConditionsRatingCriteria = (percent => PENIS_CONDITIONS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getTestisConditionsRatingCriteria = (percent => TESTIS_CONDITIONS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getEndometriosisRatingCriteria = (percent => ENDOMETRIOSIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getFemaleReproductiveOrgansRatingCriteria = (percent => FEMALE_REPRODUCTIVE_ORGANS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getPelvicProlapseRatingCriteria = (percent => PELVIC_PROLAPSE_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getFemaleSexualArousalDisorderRatingCriteria = (percent => FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getRadiculopathyRatingCriteria = (percent => RADICULOPATHY_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getChronicFatigueRatingCriteria = (percent => CHRONIC_FATIGUE_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getMenieresRatingCriteria = (percent => MENIERES_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getTMJRatingCriteria = (percent => TMJ_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getHearingLossRatingCriteria = (percent => HEARING_LOSS_CRITERIA.ratings.find(r =>r.percent === percent) || null);

export const getSyphilisRatingCriteria = (percent => SYPHILIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getCerebrospinalSyphilisRatingCriteria = (percent => CEREBROSPINAL_SYPHILIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getMeningovascularSyphilisRatingCriteria = (percent => MENINGOVASCULAR_SYPHILIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getTabesDorsalisRatingCriteria = (percent => TABES_DORSALIS_CRITERIA.ratings.find(r =>r.percent === percent) || null);
export const getSyphiliticDementiaRatingCriteria = (percent => SYPHILITIC_DEMENTIA_CRITERIA.ratings.find(r =>r.percent === percent) || null);



export const getAllMigraineRatings = () => MIGRAINE_CRITERIA.ratings;
export const getAllSleepApneaRatings = () => SLEEP_APNEA_CRITERIA.ratings;
export const getAllPTSDRatings = () => PTSD_CRITERIA.ratings;
export const getAllMajorDepressionRatings = () => MAJOR_DEPRESSION_CRITERIA.ratings;
export const getAllGeneralizedAnxietyRatings = () => GENERALIZED_ANXIETY_CRITERIA.ratings;
export const getAllPanicDisorderRatings = () => PANIC_DISORDER_CRITERIA.ratings;
export const getAllBipolarRatings = () => BIPOLAR_CRITERIA.ratings;
export const getAllLumbosacralStrainRatings = () => LUMBOSACRAL_STRAIN_CRITERIA.ratings;
export const getAllIntervertebralDiscRatings = () => INTERVERTEBRAL_DISC_CRITERIA.ratingsIncapacitatingEpisodes;
export const getAllKneeInstabilityRatings = () => KNEE_INSTABILITY_CRITERIA.ratings;
export const getAllAnkleAchillesRatings = () => ANKLE_ACHILLES_CRITERIA.ratings;
export const getAllHipThighRatings = () => HIP_THIGH_CRITERIA.ratings;
export const getAllTBIRatings = () => TBI_CRITERIA.ratings;
export const getAllHypertensionRatings = () => HYPERTENSION_CRITERIA.ratings;
export const getAllTinnitusRatings = () => TINNITUS_CRITERIA.ratings;
export const getAllFibromyalgiaRatings = () => FIBROMYALGIA_CRITERIA.ratings;
export const getAllSocialAnxietyRatings = () => SOCIAL_ANXIETY_CRITERIA.ratings;
export const getAllOCDRatings = () => OCD_CRITERIA.ratings;
export const getAllPersistentDepressiveRatings = () => PERSISTENT_DEPRESSIVE_CRITERIA.ratings;
export const getAllAdjustmentDisorderRatings = () => ADJUSTMENT_DISORDER_CRITERIA.ratings;
export const getAllUnspecifiedAnxietyRatings = () => UNSPECIFIED_ANXIETY_CRITERIA.ratings;
export const getAllUnspecifiedDepressiveRatings = () => UNSPECIFIED_DEPRESSIVE_CRITERIA.ratings;
export const getAllEpilepsyMajorRatings = () => EPILEPSY_MAJOR_CRITERIA.ratings;
export const getAllEpilepsyMinorRatings = () => EPILEPSY_MINOR_CRITERIA.ratings;
export const getAllVisionLossRatings = () => VISION_LOSS_CRITERIA.ratings;
export const getAllGlaucomaRatings = () => GLAUCOMA_CRITERIA.ratings;
export const getAllAsthmaRatings = () => ASTHMA_CRITERIA.ratings;
export const getAllIronDeficiencyAnemiaRatings = () => IRON_DEFICIENCY_ANEMIA_CRITERIA.ratings;
export const getAllFolateDeficiencyAnemiaRatings = () => FOLATE_DEFICIENCY_ANEMIA_CRITERIA.ratings;
export const getAllPerniciousAnemiaRatings = () => PERNICIOUS_ANEMIA_CRITERIA.ratings;
export const getAllHemolyticAnemiaRatings = () => HEMOLYTIC_ANEMIA_CRITERIA.ratings;
export const getAllSickleCellAnemiaRatings = () => SICKLE_CELL_ANEMIA_CRITERIA.ratings;
export const getAllAplasticAnemiaRatings = () => APLASTIC_ANEMIA_CRITERIA.ratings;
export const getAllPolycythemiaVeraRatings = () => POLYCYTHEMIA_VERA_CRITERIA.ratings;
export const getAllImmuneThrombocytopeniaRatings = () => IMMUNE_THROMBOCYTOPENIA_CRITERIA.ratings;
export const getAllLeukemiaRatings = () => LEUKEMIA_CRITERIA.ratings;
export const getAllHodgkinsLymphomaRatings = () => HODGKINS_LYMPHOMA_CRITERIA.ratings;
export const getAllMultipleMyelomaRatings = () => MULTIPLE_MYELOMA_CRITERIA.ratings;
export const getAllNonHodgkinsLymphomaRatings = () => NON_HODGKINS_LYMPHOMA_CRITERIA.ratings;
export const getAllMyeloproliferative7718Ratings = () => MYELOPROLIFERATIVE_7718_CRITERIA.ratings;
export const getAllChronicMyelogenousLeukemiaRatings = () => CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA.ratings;
export const getAllSolitaryPlasmacytomaRatings = () => SOLITARY_PLASMACYTOMA_CRITERIA.ratings;
export const getAllMyelodysplasticSyndromesRatings = () => MYELODYSPLASTIC_SYNDROMES_CRITERIA.ratings;
export const getAllTMJDisorderRatings = () => TMJ_DISORDER_CRITERIA.ratings;
export const getAllToothLossRatings = () => TOOTH_LOSS_CRITERIA.ratings;
export const getAllMandibleNonunionRatings = () => MANDIBLE_NONUNION_CRITERIA.ratings;
export const getAllMalignantOralNeoplasmRatings = () => MALIGNANT_ORAL_NEOPLASM_CRITERIA.ratings;
export const getAllBenignOralNeoplasmRatings = () => BENIGN_ORAL_NEOPLASM_CRITERIA.ratings;
export const getAllHIVAIDSRatings = () => HIV_AIDS_CRITERIA.ratings;
export const getAllHepatitisCRatings = () => HEPATITIS_C_CRITERIA.ratings;
export const getAllHepatitisBRatings = () => HEPATITIS_B_CRITERIA.ratings;
export const getAllLymeDiseaseRatings = () => LYME_DISEASE_CRITERIA.ratings;
export const getAllMalariaRatings = () => MALARIA_CRITERIA.ratings;
export const getAllBrucellosisRatings = () => BRUCELLOSIS_CRITERIA.ratings;
export const getAllCampylobacterRatings = () => CAMPYLOBACTER_CRITERIA.ratings;
export const getAllQFeverRatings = () => Q_FEVER_CRITERIA.ratings;
export const getAllSalmonellaRatings = () => SALMONELLA_CRITERIA.ratings;
export const getAllShigellaRatings = () => SHIGELLA_CRITERIA.ratings;
export const getAllWestNileRatings = () => WEST_NILE_CRITERIA.ratings;
export const getAllNTMRatings = () => NTM_CRITERIA.ratings;
export const getAllSomaticSymptomDisorderRatings = () => SOMATIC_SYMPTOM_DISORDER_CRITERIA.ratings;
export const getAllOtherSpecifiedSomaticRatings = () => OTHER_SPECIFIED_SOMATIC_CRITERIA.ratings;
export const getAllUnspecifiedSomaticRatings = () => UNSPECIFIED_SOMATIC_CRITERIA.ratings;
export const getAllIllnessAnxietyRatings = () => ILLNESS_ANXIETY_CRITERIA.ratings;
export const getAllOtherSpecifiedAnxietyRatings = () => OTHER_SPECIFIED_ANXIETY_CRITERIA.ratings;
export const getAllDepersonalizationRatings = () => DEPERSONALIZATION_DEREALIZATION_CRITERIA.ratings;
export const getAllCyclothymicRatings = () => CYCLOTHYMIC_CRITERIA.ratings;
export const getAllAnorexiaNervosaRatings = () => ANOREXIA_NERVOSA_CRITERIA.ratings;
export const getAllBulimiaNervosaRatings = () => BULIMIA_NERVOSA_CRITERIA.ratings;
export const getAllSchizophreniaRatings = () => SCHIZOPHRENIA_CRITERIA.ratings;
export const getAllSchizoaffectiveDisorderRatings = () => SCHIZOAFFECTIVE_DISORDER_CRITERIA.ratings;
export const getAllDelusionalDisorderRatings = () => DELUSIONAL_DISORDER_CRITERIA.ratings;
export const getAllPsychoticDisorderNOSRatings = () => PSYCHOTIC_DISORDER_NOS_CRITERIA.ratings;
export const getAllBriefPsychoticDisorderRatings = () => BRIEF_PSYCHOTIC_DISORDER_CRITERIA.ratings;
export const getAllBingeEatingDisorderRatings = () => BINGE_EATING_DISORDER_CRITERIA.ratings;
export const getAllDissociativeIdentityDisorderRatings = () => DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA.ratings;
export const getAllDissociativeAmnesiaRatings = () => DISSOCIATIVE_AMNESIA_CRITERIA.ratings;
export const getAllAcuteStressDisorderRatings = () => ACUTE_STRESS_DISORDER_CRITERIA.ratings;
export const getAllAntisocialPersonalityDisorderRatings = () => ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA.ratings;
export const getAllBorderlinePersonalityDisorderRatings = () => BORDERLINE_PERSONALITY_DISORDER_CRITERIA.ratings;
export const getAllNarcissisticPersonalityDisorderRatings = () => NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA.ratings;
export const getAllAvoidantPersonalityDisorderRatings = () => AVOIDANT_PERSONALITY_DISORDER_CRITERIA.ratings;
export const getAllCardiomyopathyRatings = () => CARDIOMYOPATHY_CRITERIA.ratings;
export const getAllSVTRatings = () => SVT_CRITERIA.ratings;
export const getAllVentricularArrhythmiaRatings = () => VENTRICULAR_ARRHYTHMIA_CRITERIA.ratings;
export const getAllPericarditisRatings = () => PERICARDITIS_CRITERIA.ratings;
export const getAllPostPhlebiticRatings = () => POST_PHLEBITIC_CRITERIA.ratings;
export const getAllCirrhosisRatings = () => CIRRHOSIS_CRITERIA.ratings;
export const getAllGastritisRatings = () => GASTRITIS_CRITERIA.ratings;
export const getAllPancreatitisRatings = () => PANCREATITIS_CRITERIA.ratings;
export const getAllBiliaryTractRatings = () => BILIARY_TRACT_CRITERIA.ratings;
export const getAllBronchiectasisRatings = () => BRONCHIECTASIS_CRITERIA.ratings;
export const getAllPulmonaryFibrosisRatings = () => PULMONARY_FIBROSIS_CRITERIA.ratings;
export const getAllSarcoidosisRatings = () => SARCOIDOSIS_CRITERIA.ratings;
export const getAllMultipleSclerosisDefinition = () => MULTIPLE_SCLEROSIS_CRITERIA.ratings;
export const getAllParkinsonsDefinition = () => PARKINSONS_DISEASE_CRITERIA.ratings;
export const getAllMyastheniaGravisDefinition = () => MYASTHENIA_GRAVIS_CRITERIA.ratings;
export const getAllNarcolepsyRatings = () => NARCOLEPSY_CRITERIA.ratings;
export const getAllALSRatings = () => ALS_CRITERIA.ratings;
export const getAllSyringomyeliaRatings = () => SYRINGOMYELIA_CRITERIA.ratings;
export const getAllMyelitisRatings = () => MYELITIS_CRITERIA.ratings;
export const getAllUpperRadicularGroupRatings = () => UPPER_RADICULAR_GROUP_CRITERIA.ratings;
export const getAllMiddleRadicularGroupRatings = () => MIDDLE_RADICULAR_GROUP_CRITERIA.ratings;
export const getAllLowerRadicularGroupRatings = () => LOWER_RADICULAR_GROUP_CRITERIA.ratings;
export const getAllAllRadicularGroupsRatings = () => ALL_RADICULAR_GROUPS_CRITERIA.ratings;
export const getAllRadialNerveRatings = () => RADIAL_NERVE_CRITERIA.ratings;
export const getAllMedianNerveRatings = () => MEDIAN_NERVE_CRITERIA.ratings;
export const getAllUlnarNerveRatings = () => ULNAR_NERVE_CRITERIA.ratings;
export const getAllMusculocutaneousNerveRatings = () => MUSCULOCUTANEOUS_NERVE_CRITERIA.ratings;
export const getAllCircumflexNerveRatings = () => CIRCUMFLEX_NERVE_CRITERIA.ratings;
export const getAllLongThoracicNerveRatings = () => LONG_THORACIC_NERVE_CRITERIA.ratings;
export const getAllSciaticNerveRatings = () => SCIATIC_NERVE_CRITERIA.ratings;
export const getAllCommonPeronealNerveRatings = () => COMMON_PERONEAL_NERVE_CRITERIA.ratings;
export const getAllSuperficialPeronealNerveRatings = () => SUPERFICIAL_PERONEAL_NERVE_CRITERIA.ratings;
export const getAllDeepPeronealNerveRatings = () => DEEP_PERONEAL_NERVE_CRITERIA.ratings;
export const getAllTibialNerveRatings = () => TIBIAL_NERVE_CRITERIA.ratings;
export const getAllPosteriorTibialNerveRatings = () => POSTERIOR_TIBIAL_NERVE_CRITERIA.ratings;
export const getAllFemoralNerveRatings = () => FEMORAL_NERVE_CRITERIA.ratings;
export const getAllSaphenousNerveRatings = () => SAPHENOUS_NERVE_CRITERIA.ratings;
export const getAllObturatorNerveRatings = () => OBTURATOR_NERVE_CRITERIA.ratings;
export const getAllLateralFemoralCutaneousNerveRatings = () => LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA.ratings;
export const getAllIlioinguinalNerveRatings = () => ILIOINGUINAL_NERVE_CRITERIA.ratings;
export const getAllJacksonianEpilepsyRatings = () => EPILEPSY_JACKSONIAN_CRITERIA.ratings;
export const getAllDiencephalicEpilepsyRatings = () => EPILEPSY_DIENCEPHALIC_CRITERIA.ratings;
export const getAllPsychomotorEpilepsyRatings = () => EPILEPSY_PSYCHOMOTOR_CRITERIA.ratings;
export const getAllColdInjuryRatings = () => COLD_INJURY_CRITERIA.ratings;
export const getAllPADRatings = () => PAD_CRITERIA.ratings;
export const getAllHyperthyroidismRatings = () => HYPERTHYROIDISM_CRITERIA.ratings;
export const getAllThyroiditisRatings = () => THYROIDITIS_CRITERIA.ratings;
export const getAllHyperparathyroidismRatings = () => HYPERPARATHYROIDISM_CRITERIA.ratings;
export const getAllHypoparathyroidismRatings = () => HYPOPARATHYROIDISM_CRITERIA.ratings;
export const getAllAddisonsDiseaseRatings = () => ADDISONS_DISEASE_CRITERIA.ratings;
export const getAllCushingsSyndromeRatings = () => CUSHINGS_SYNDROME_CRITERIA.ratings;
export const getAllDiabetesInsipidusRatings = () => DIABETES_INSIPIDUS_CRITERIA.ratings;
export const getAllHyperaldosteronismRatings = () => HYPERALDOSTERONISM_CRITERIA.ratings;
export const getAllGoutRatings = () => GOUT_CRITERIA.ratings;
export const getAllBursitisRatings = () => BURSITIS_CRITERIA.ratings;
export const getAllTendinitisRatings = () => TENDINITIS_CRITERIA.ratings;
export const getAllMyositisRatings = () => MYOSITIS_CRITERIA.ratings;
export const getAllOsteomyelitisRatings = () => OSTEOMYELITIS_CRITERIA.ratings;
export const getAllMultiJointArthritisRatings = () => MULTI_JOINT_ARTHRITIS_CRITERIA.ratings;
export const getAllVertebralFractureRatings = () => VERTEBRAL_FRACTURE_CRITERIA.ratings;
export const getAllSacroiliacInjuryRatings = () => SACROILIAC_INJURY_CRITERIA.ratings;
export const getAllSpinalStenosisRatings = () => SPINAL_STENOSIS_CRITERIA.ratings;
export const getAllAnkylosingSpondylitisRatings = () => ANKYLOSING_SPONDYLITIS_CRITERIA.ratings;
export const getAllSpinalFusionRatings = () => SPINAL_FUSION_CRITERIA.ratings;
export const getAllWeakFootRatings = () => WEAK_FOOT_CRITERIA.ratings;
export const getAllClawFootRatings = () => CLAW_FOOT_CRITERIA.ratings;
export const getAllMetatarsalgiaRatings = () => METATARSALGIA_CRITERIA.ratings;
export const getAllHalluxValgusRatings = () => HALLUX_VALGUS_CRITERIA.ratings;
export const getAllHalluxRigidusRatings = () => HALLUX_RIGIDUS_CRITERIA.ratings;
export const getAllHerniaRatings = () => HERNIA_CRITERIA.ratings;
export const getAllPeritonealAdhesionsRatings = () => PERITONEAL_ADHESIONS_CRITERIA.ratings;
export const getAllEsophagealStrictureRatings = () => ESOPHAGEAL_STRICTURE_CRITERIA.ratings;
export const getAllPostgastrectomyRatings = () => POSTGASTRECTOMY_CRITERIA.ratings;
export const getAllIntestinalFistulaRatings = () => INTESTINAL_FISTULA_CRITERIA.ratings;
export const getAllAcneRatings = () => ACNE_CRITERIA.ratings;
export const getAllChloracneRatings = () => CHLORACNE_CRITERIA.ratings;
export const getAllAlopeciaAreataRatings = () => ALOPECIA_AREATA_CRITERIA.ratings;
export const getAllHyperhidrosisRatings = () => HYPERHIDROSIS_CRITERIA.ratings;
export const getAllDiscoidLupusRatings = () => DISCOID_LUPUS_CRITERIA.ratings;
export const getAllBullousDisordersRatings = () => BULLOUS_DISORDERS_CRITERIA.ratings;
export const getAllCutaneousVasculitisRatings = () => CUTANEOUS_VASCULITIS_CRITERIA.ratings;
export const getAllDermatophytosisRatings = () => DERMATOPHYTOSIS_CRITERIA.ratings;
export const getAllSkinInfectionsRatings = () => SKIN_INFECTIONS_CRITERIA.ratings;
export const getAllGeneralSkinFormulaRatings = () => GENERAL_SKIN_FORMULA_CRITERIA.ratings;
export const getAllGeneralEyeFormulaRatings = () => GENERAL_EYE_FORMULA_CRITERIA.ratings;
export const getAllUveitisRatings = () => UVEITIS_CRITERIA.ratings;
export const getAllKeratitisRatings = () => KERATITIS_CRITERIA.ratings;
export const getAllChronicConjunctivitisRatings = () => CHRONIC_CONJUNCTIVITIS_CRITERIA.ratings;
export const getAllScleritisRatings = () => SCLERITIS_CRITERIA.ratings;
export const getAllPeripheralVestibularRatings = () => PERIPHERAL_VESTIBULAR_CRITERIA.ratings;
export const getAllChronicSuppurativeOtitisMediaRatings = () => CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA.ratings;
export const getAllChronicOtitisExternaRatings = () => CHRONIC_OTITIS_EXTERNA_CRITERIA.ratings;
export const getAllChronicNonsuppurativeOtitisMediaRatings = () => CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA.ratings;
export const getAllLossOfSmellRatings = () => LOSS_OF_SMELL_CRITERIA.ratings;
export const getAllLossOfTasteRatings = () => LOSS_OF_TASTE_CRITERIA.ratings;
export const getAllSystemicLupusRatings = () => SYSTEMIC_LUPUS_CRITERIA.ratings;
export const getAllTuberculosisActiveRatings = () => TUBERCULOSIS_ACTIVE_CRITERIA.ratings;
export const getAllTuberculosisInactiveRatings = () => TUBERCULOSIS_INACTIVE_CRITERIA.ratings;
export const getAllTuberculosisMilitaryRatings = () => TUBERCULOSIS_MILIARY_CRITERIA.ratings;
export const getAllSphincterControlRatings = () => SPHINCTER_CONTROL_CRITERIA.ratings;
export const getAllRectalStrictureRatings = () => RECTAL_STRICTURE_CRITERIA.ratings;
export const getAllRectalProlapseRatings = () => RECTAL_PROLAPSE_CRITERIA.ratings;
export const getAllAnalFistulaRatings = () => ANAL_FISTULA_CRITERIA.ratings;
export const getAllHemorrhoidsRatings = () => HEMORRHOIDS_CRITERIA.ratings;
export const getAllPruritusAniRatings = () => PRURITUS_ANI_CRITERIA.ratings;
export const getAllAvitaminosisRatings = () => AVITAMINOSIS_CRITERIA.ratings;
export const getAllBeriberiRatings = () => BERIBERI_CRITERIA.ratings;
export const getAllPellagraRatings = () => PELLAGRA_CRITERIA.ratings;
export const getAllVulvaClitorisDiseaseRatings = () => VULVA_CLITORIS_DISEASE_CRITERIA.ratings;
export const getAllVaginaDiseaseRatings = () => VAGINA_DISEASE_CRITERIA.ratings;
export const getAllCervixDiseaseRatings = () => CERVIX_DISEASE_CRITERIA.ratings;
export const getAllUterusDiseaseRatings = () => UTERUS_DISEASE_CRITERIA.ratings;
export const getAllFallopianTubePIDRatings = () => FALLOPIAN_TUBE_PID_CRITERIA.ratings;
export const getAllOvaryDiseaseRatings = () => OVARY_DISEASE_CRITERIA.ratings;
export const getAllChronicCystitisRatings = () => CHRONIC_CYSTITIS_CRITERIA.ratings;
export const getAllNeurogenicBladderRatings = () => NEUROGENIC_BLADDER_CRITERIA.ratings;
export const getAllProstateConditionsRatings = () => PROSTATE_CONDITIONS_CRITERIA.ratings;
export const getAllUrethralStrictureRatings = () => URETHRAL_STRICTURE_CRITERIA.ratings;
export const getAllMandibleMalunionRatings = () => MANDIBLE_MALUNION_CRITERIA.ratings;
export const getAllMaxillaMalunionRatings = () => MAXILLA_MALUNION_CRITERIA.ratings;
export const getAllMaxillaMandibleBoneDiseaseRatings = () => MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA.ratings;
export const getAllEsophagealSpasmRatings = () => ESOPHAGEAL_SPASM_CRITERIA.ratings;
export const getAllEssentialThrombocythemiaRatings = () => MYELOPROLIFERATIVE_7718_CRITERIA.ratings;
export const getAllEyeConditionsRatings = () => EYE_CONDITIONS_CRITERIA.ratings;
export const getAllChronicLaryngitisRatings = () => CHRONIC_LARYNGITIS_CRITERIA.ratings;
export const getAllAphoniaRatings = () => APHONIA_CRITERIA.ratings;
export const getAllLaryngealStenosisRatings = () => LARYNGEAL_STENOSIS_CRITERIA.ratings;
export const getAllPharynxInjuryRatings = () => PHARYNX_INJURY_CRITERIA.ratings;
export const getAllDementiaRatings = () => DEMENTIA_CRITERIA.ratings;
export const getAllPeripheralNeuropathyRatingCriteria = () => PERIPHERAL_NEUROPATHY_CRITERIA.ratings;
export const getAllInsomniaRatingCriteria = () => INSOMNIA_CRITERIA.ratings;
export const getAllTbiResidualsRatingCriteria = () => TBI_RESIDUALS_CRITERIA.ratings;
export const getAllMentalHealthSharedRatingCriteria = () =>   MENTAL_HEALTH_SHARED_CRITERIA.ratings;
export const getAllPlantarFasciitisRatingCriteria = () =>   PLANTAR_FASCIITIS_CRITERIA.ratings;
export const getAllShoulderRatingCriteria = () =>   SHOULDER_CRITERIA.ratings;
export const getAllHipRatingCriteria = () =>   HIP_CRITERIA.ratings;
export const getAllAnkleRatingCriteria = () =>   ANKLE_CRITERIA.ratings;
export const getAllWristRatingCriteria = () =>   WRIST_CRITERIA.ratings.ratings;
export const getAllElbowRatingCriteria = () =>   ELBOW_CRITERIA.ratings;
export const getAllDegenerativeArthritisRatingCriteria = () =>   DEGENERATIVE_ARTHRITIS_CRITERIA.ratings;
export const getAllGeneralSpineRatingCriteria = () =>   GENERAL_SPINE_RATING_FORMULA.ratings;
export const getAllRhinitisRatingCriteria = () =>   RHINITIS_CRITERIA.ratings;
export const getAllSinusitisRatingCriteria = (t) =>   SINUSITIS_CRITERIA.ratings;
export const getAllDeviatedSeptumRatingCriteria = () =>   DEVIATED_SEPTUM_CRITERIA.ratings;
export const getAllNoseLossRatingCriteria = () =>   NOSE_LOSS_CRITERIA.ratings;
export const getAllCopdRatingCriteria = () =>   COPD_CRITERIA.ratings;
export const getAllChronicBronchitisRatingCriteria = () =>   CHRONIC_BRONCHITIS_CRITERIA.ratings;
export const getAllEmphysemaRatingCriteria = () =>   EMPHYSEMA_CRITERIA.ratings;
export const getAllRaynaudsRatingCriteria = () =>   RAYNAUDS_CRITERIA.ratings;
export const getAllVaricoseVeinsRatingCriteria = () =>   VARICOSE_VEINS_CRITERIA.ratings;
export const getAllChronicUrticariaRatingCriteria = () =>   CHRONIC_URTICARIA_CRITERIA.ratings;
export const getAllCadRatingCriteria = () =>   CAD_CRITERIA.ratings;
export const getAllPostMiRatingCriteria = () =>   POST_MI_CRITERIA.ratings;
export const getAllHypertensiveHeartRatingCriteria = () =>   HYPERTENSIVE_HEART_CRITERIA.ratings;
export const getAllPeripheralArterialDiseaseRatingCriteria = () =>   PERIPHERAL_ARTERIAL_DISEASE_CRITERIA.ratings;
export const getAllSyphiliticHeartDiseaseRatingCriteria = () =>   SYPHILITIC_HEART_DISEASE_CRITERIA.ratings;
export const getAllAmputationRatingCriteria = () => AMPUTATION_CRITERIA.ratings;
export const getAllIbsRatingCriteria = () => IBS_CRITERIA.ratings;
export const getAllGerdRatingCriteria = () => GERD_CRITERIA.ratings;
export const getAllGerdComplicationsRatingCriteria = () => GERD_COMPLICATIONS_CRITERIA.ratings;
export const getAllUlcerativeColitisRatingCriteria = () => ULCERATIVE_COLITIS_CRITERIA.ratings;
export const getAllPepticUlcerRatingCriteria = () => PEPTIC_ULCER_CRITERIA.ratings;
export const getAllHemorrhoidRatingCriteria = () => HEMORRHOID_CRITERIA.ratings;
export const getAllDiverticulitisRatingCriteria = () => DIVERTICULITIS_CRITERIA.ratings;
export const getAllDiabetesRatingCriteria = () => DIABETES_CRITERIA.ratings;
export const getAllScarsRatingCriteria = () => SCARS_CRITERIA.ratings;
export const getAllPsoriasisRatingCriteria = () => PSORIASIS_CRITERIA.ratings;
export const getAllEczemaRatingCriteria = () => ECZEMA_CRITERIA.ratings;
export const getAllHypothyroidismRatingCriteria = () => HYPOTHYROIDISM_CRITERIA.ratings;
export const getAllPenisConditionsRatingCriteria = () => PENIS_CONDITIONS_CRITERIA.ratings;
export const getAllEndometriosisRatingCriteria = () => ENDOMETRIOSIS_CRITERIA.ratings;
export const getAllFemaleReproductiveOrgansRatingCriteria = () => FEMALE_REPRODUCTIVE_ORGANS_CRITERIA.ratings;
export const getAllPelvicProlapseRatingCriteria = () => PELVIC_PROLAPSE_CRITERIA.ratings;
export const getAllFemaleSexualArousalDisorderRatingCriteria = () => FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA.ratings;
export const getAllChronicCystitisRatingCriteria = () => CHRONIC_CYSTITIS_CRITERIA.ratings;
export const getAllNeurogenicBladderRatingCriteria = () => NEUROGENIC_BLADDER_CRITERIA.ratings;
export const getALLTestisConditionsRatingCriteria = () => TESTIS_CONDITIONS_CRITERIA.ratings;
export const getAllRadiculopathyRatingCriteria = () => RADICULOPATHY_CRITERIA.ratings;
export const getAllChronicFatigueRatingCriteria = () => CHRONIC_FATIGUE_CRITERIA.ratings;
export const getAllMenieresRatingCriteria = () => MENIERES_CRITERIA.ratings;
export const getAllTMJRatingCriteria = () => TMJ_CRITERIA.ratings;
export const getAllHearingLossRatingCriteria = () => HEARING_LOSS_CRITERIA.ratings;
export const getAllSyphilisRatingCriteria = () => SYPHILIS_CRITERIA.ratings;
export const getAllCerebrospinalSyphilisRatingCriteria = () => CEREBROSPINAL_SYPHILIS_CRITERIA.ratings;
export const getAllMeningovascularSyphilisRatingCriteria = () => MENINGOVASCULAR_SYPHILIS_CRITERIA.ratings;
export const getAllTabesDorsalisRatingCriteria = () => TABES_DORSALIS_CRITERIA.ratings;
export const getAllSyphiliticDementiaRatingCriteria = () => SYPHILITIC_DEMENTIA_CRITERIA.ratings;





export const getMigraineDefinition = (term) => MIGRAINE_CRITERIA.definitions[term] || null;
export const getSleepApneaDefinition = (term) => SLEEP_APNEA_CRITERIA.definitions[term] || null;
export const getPTSDDefinition = (term) => PTSD_CRITERIA.definitions[term] || null;
export const getMajorDepressionDefinition = (term) => MAJOR_DEPRESSION_CRITERIA.definitions[term] || null;
export const getGeneralizedAnxietyDefinition = (term) => GENERALIZED_ANXIETY_CRITERIA.definitions[term] || null;
export const getPanicDisorderDefinition = (term) => PANIC_DISORDER_CRITERIA.definitions[term] || null;
export const getBipolarDefinition = (term) => BIPOLAR_CRITERIA.definitions[term] || null;
export const getEpilepsyMajorDefinition = (term) => EPILEPSY_MAJOR_CRITERIA.definitions[term] || null;
export const getEpilepsyMinorDefinition = (term) => EPILEPSY_MINOR_CRITERIA.definitions[term] || null;
export const getLumbosacralStrainDefinition = (term) => LUMBOSACRAL_STRAIN_CRITERIA.definitions[term] || null;
export const getIntervertebralDiscDefinition = (term) => INTERVERTEBRAL_DISC_CRITERIA.definitions[term] || null;
export const getKneeInstabilityDefinition = (term) => KNEE_INSTABILITY_CRITERIA.definitions[term] || null;
export const getAnkleAchillesDefinition = (term) => ANKLE_ACHILLES_CRITERIA.definitions[term] || null;
export const getHipThighDefinition = (term) => HIP_THIGH_CRITERIA.definitions[term] || null;
export const getTBIDefinition = (term) => TBI_CRITERIA.definitions[term] || null;
export const getHypertensionDefinition = (term) => HYPERTENSION_CRITERIA.definitions[term] || null;
export const getTinnitusDefinition = (term) => TINNITUS_CRITERIA.definitions[term] || null;
export const getFibromyalgiaDefinition = (term) => FIBROMYALGIA_CRITERIA.definitions[term] || null;
export const getAsthmaDefinition = (term) => ASTHMA_CRITERIA.definitions[term] || null;
export const getSocialAnxietyDefinition = (term) => SOCIAL_ANXIETY_CRITERIA.definitions[term] || null;
export const getOCDDefinition = (term) => OCD_CRITERIA.definitions[term] || null;
export const getPersistentDepressiveDefinition = (term) => PERSISTENT_DEPRESSIVE_CRITERIA.definitions[term] || null;
export const getAdjustmentDisorderDefinition = (term) => ADJUSTMENT_DISORDER_CRITERIA.definitions[term] || null;
export const getUnspecifiedAnxietyDefinition = (term) => UNSPECIFIED_ANXIETY_CRITERIA.definitions[term] || null;
export const getUnspecifiedDepressiveDefinition = (term) => UNSPECIFIED_DEPRESSIVE_CRITERIA.definitions[term] || null;
export const getVisionLossDefinition = (term) => VISION_LOSS_CRITERIA.definitions[term] || null;
export const getGlaucomaDefinition = (term) => GLAUCOMA_CRITERIA.definitions[term] || null;
export const getDiabeticRetinopathyDefinition = (term) => DIABETIC_RETINOPATHY_CRITERIA.definitions[term] || null;
export const getMacularDegenerationDefinition = (term) => MACULAR_DEGENERATION_CRITERIA.definitions[term] || null;
export const getIronDeficiencyAnemiaDefinition = (term) => IRON_DEFICIENCY_ANEMIA_CRITERIA.definitions[term] || null;
export const getFolateDeficiencyAnemiaDefinition = (term) => FOLATE_DEFICIENCY_ANEMIA_CRITERIA.definitions[term] || null;
export const getPerniciousAnemiaDefinition = (term) => PERNICIOUS_ANEMIA_CRITERIA.definitions[term] || null;
export const getHemolyticAnemiaDefinition = (term) => HEMOLYTIC_ANEMIA_CRITERIA.definitions[term] || null;
export const getSickleCellAnemiaDefinition = (term) => SICKLE_CELL_ANEMIA_CRITERIA.definitions[term] || null;
export const getAplasticAnemiaDefinition = (term) => APLASTIC_ANEMIA_CRITERIA.definitions[term] || null;
export const getPolycythemiaVeraDefinition = (term) => POLYCYTHEMIA_VERA_CRITERIA.definitions[term] || null;
export const getImmuneThrombocytopeniaDefinition = (term) => IMMUNE_THROMBOCYTOPENIA_CRITERIA.definitions[term] || null;
export const getLeukemiaDefinition = (term) => LEUKEMIA_CRITERIA.definitions[term] || null;
export const getHodgkinsLymphomaDefinition = (term) => HODGKINS_LYMPHOMA_CRITERIA.definitions[term] || null;
export const getMultipleMyelomaDefinition = (term) => MULTIPLE_MYELOMA_CRITERIA.definitions[term] || null;
export const getNonHodgkinsLymphomaDefinition = (term) => NON_HODGKINS_LYMPHOMA_CRITERIA.definitions[term] || null;
export const getMyeloproliferative7718Definition = (term) => MYELOPROLIFERATIVE_7718_CRITERIA.definitions[term] || null;
export const getChronicMyelogenousLeukemiaDefinition = (term) => CHRONIC_MYELOGENOUS_LEUKEMIA_CRITERIA.definitions[term] || null;
export const getSolitaryPlasmacytomaDefinition = (term) => SOLITARY_PLASMACYTOMA_CRITERIA.definitions[term] || null;
export const getMyelodysplasticSyndromesDefinition = (term) => MYELODYSPLASTIC_SYNDROMES_CRITERIA.definitions[term] || null;
export const getTMJDisorderDefinition = (term) => TMJ_DISORDER_CRITERIA.definitions[term] || null;
export const getToothLossDefinition = (term) => TOOTH_LOSS_CRITERIA.definitions[term] || null;
export const getMandibleNonunionDefinition = (term) => MANDIBLE_NONUNION_CRITERIA.definitions[term] || null;
export const getMalignantOralNeoplasmDefinition = (term) => MALIGNANT_ORAL_NEOPLASM_CRITERIA.definitions[term] || null;
export const getBenignOralNeoplasmDefinition = (term) => BENIGN_ORAL_NEOPLASM_CRITERIA.definitions[term] || null;
export const getHIVAIDSDefinition = (term) => HIV_AIDS_CRITERIA.definitions[term] || null;
export const getHepatitisCDefinition = (term) => HEPATITIS_C_CRITERIA.definitions[term] || null;
export const getHepatitisBDefinition = (term) => HEPATITIS_B_CRITERIA.definitions[term] || null;
export const getLymeDiseaseDefinition = (term) => LYME_DISEASE_CRITERIA.definitions[term] || null;
export const getMalariaDefinition = (term) => MALARIA_CRITERIA.definitions[term] || null;
export const getBrucellosisDefinition = (term) => BRUCELLOSIS_CRITERIA.definitions[term] || null;
export const getCampylobacterDefinition = (term) => CAMPYLOBACTER_CRITERIA.definitions[term] || null;
export const getQFeverDefinition = (term) => Q_FEVER_CRITERIA.definitions[term] || null;
export const getSalmonellaDefinition = (term) => SALMONELLA_CRITERIA.definitions[term] || null;
export const getShigellaDefinition = (term) => SHIGELLA_CRITERIA.definitions[term] || null;
export const getWestNileDefinition = (term) => WEST_NILE_CRITERIA.definitions[term] || null;
export const getNTMDefinition = (term) => NTM_CRITERIA.definitions[term] || null;
export const getSomaticSymptomDisorderDefinition = (term) => { return SOMATIC_SYMPTOM_DISORDER_CRITERIA.definitions[term] || null; };
export const getOtherSpecifiedSomaticDefinition = (term) => { return OTHER_SPECIFIED_SOMATIC_CRITERIA.definitions[term] || null; };
export const getUnspecifiedSomaticDefinition = (term) => { return UNSPECIFIED_SOMATIC_CRITERIA.definitions[term] || null; };
export const getIllnessAnxietyDefinition = (term) => { return ILLNESS_ANXIETY_CRITERIA.definitions[term] || null; };
export const getOtherSpecifiedAnxietyDefinition = (term) => { return OTHER_SPECIFIED_ANXIETY_CRITERIA.definitions[term] || null; };
export const getDepersonalizationDefinition = (term) => { return DEPERSONALIZATION_DEREALIZATION_CRITERIA.definitions[term] || null; };
export const getCyclothymicDefinition = (term) => { return CYCLOTHYMIC_CRITERIA.definitions[term] || null; };
export const getAnorexiaNervosaDefinition = (term) => { return ANOREXIA_NERVOSA_CRITERIA.definitions[term] || null; };
export const getBulimiaNervosaDefinition = (term) => { return BULIMIA_NERVOSA_CRITERIA.definitions[term] || null; };
export const getSchizophreniaDefinition = (term) => SCHIZOPHRENIA_CRITERIA.definitions[term] || null;
export const getSchizoaffectiveDisorderDefinition = (term) => SCHIZOAFFECTIVE_DISORDER_CRITERIA.definitions[term] || null;
export const getDelusionalDisorderDefinition = (term) => DELUSIONAL_DISORDER_CRITERIA.definitions[term] || null;
export const getPsychoticDisorderNOSDefinition = (term) => PSYCHOTIC_DISORDER_NOS_CRITERIA.definitions[term] || null;
export const getBriefPsychoticDisorderDefinition = (term) => BRIEF_PSYCHOTIC_DISORDER_CRITERIA.definitions[term] || null;
export const getBingeEatingDisorderDefinition = (term) => BINGE_EATING_DISORDER_CRITERIA.definitions[term] || null;
export const getDissociativeIdentityDisorderDefinition = (term) => DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA.definitions[term] || null;
export const getDissociativeAmnesiaDefinition = (term) => DISSOCIATIVE_AMNESIA_CRITERIA.definitions[term] || null;
export const getAcuteStressDisorderDefinition = (term) => ACUTE_STRESS_DISORDER_CRITERIA.definitions[term] || null;
export const getAntisocialPersonalityDisorderDefinition = (term) => ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA.definitions[term] || null;
export const getBorderlinePersonalityDisorderDefinition = (term) => BORDERLINE_PERSONALITY_DISORDER_CRITERIA.definitions[term] || null;
export const getNarcissisticPersonalityDisorderDefinition = (term) => NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA.definitions[term] || null;
export const getAvoidantPersonalityDisorderDefinition = (term) => AVOIDANT_PERSONALITY_DISORDER_CRITERIA.definitions[term] || null;
export const getCardiomyopathyDefinition = (term) => CARDIOMYOPATHY_CRITERIA.definitions[term] || null;
export const getSVTDefinition = (term) => SVT_CRITERIA.definitions[term] || null;
export const getVentricularArrhythmiaDefinition = (term) => VENTRICULAR_ARRHYTHMIA_CRITERIA.definitions[term] || null;
export const getPericarditisDefinition = (term) => PERICARDITIS_CRITERIA.definitions[term] || null;
export const getPostPhlebiticDefinition = (term) => POST_PHLEBITIC_CRITERIA.definitions[term] || null;
export const getCirrhosisDefinition = (term) => CIRRHOSIS_CRITERIA.definitions[term] || null;
export const getGastritisDefinition = (term) => GASTRITIS_CRITERIA.definitions[term] || null;
export const getPancreatitisDefinition = (term) => PANCREATITIS_CRITERIA.definitions[term] || null;
export const getBiliaryTractDefinition = (term) => BILIARY_TRACT_CRITERIA.definitions[term] || null;
export const getBronchiectasisDefinition = (term) => BRONCHIECTASIS_CRITERIA.definitions[term] || null;
export const getPulmonaryFibrosisDefinition = (term) => PULMONARY_FIBROSIS_CRITERIA.definitions[term] || null;
export const getSarcoidosisDefinition = (term) => SARCOIDOSIS_CRITERIA.definitions[term] || null;
export const getMultipleSclerosisDefinition = (term) => MULTIPLE_SCLEROSIS_CRITERIA.definitions[term] || null;
export const getParkinsonsDefinition = (term) => PARKINSONS_DISEASE_CRITERIA.definitions[term] || null;
export const getMyastheniaGravisDefinition = (term) => MYASTHENIA_GRAVIS_CRITERIA.definitions[term] || null;
export const getNarcolepsyDefinition = (term) => NARCOLEPSY_CRITERIA.definitions[term] || null;
export const getALSDefinition = (term) => ALS_CRITERIA.definitions[term] || null;
export const getSyringomyeliaDefinition = (term) => SYRINGOMYELIA_CRITERIA.definitions[term] || null;
export const getMyelitisDefinition = (term) => MYELITIS_CRITERIA.definitions[term] || null;
export const getUpperRadicularGroupDefinition = (term) => UPPER_RADICULAR_GROUP_CRITERIA.definitions?.[term] || null;
export const getMiddleRadicularGroupDefinition = (term) => MIDDLE_RADICULAR_GROUP_CRITERIA.definitions?.[term] || null;
export const getLowerRadicularGroupDefinition = (term) => LOWER_RADICULAR_GROUP_CRITERIA.definitions?.[term] || null;
export const getAllRadicularGroupsDefinition = (term) => ALL_RADICULAR_GROUPS_CRITERIA.definitions?.[term] || null;
export const getRadialNerveDefinition = (term) => RADIAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getMedianNerveDefinition = (term) => MEDIAN_NERVE_CRITERIA.definitions?.[term] || null;
export const getUlnarNerveDefinition = (term) => ULNAR_NERVE_CRITERIA.definitions?.[term] || null;
export const getMusculocutaneousNerveDefinition = (term) => MUSCULOCUTANEOUS_NERVE_CRITERIA.definitions?.[term] || null;
export const getCircumflexNerveDefinition = (term) => CIRCUMFLEX_NERVE_CRITERIA.definitions?.[term] || null;
export const getLongThoracicNerveDefinition = (term) => LONG_THORACIC_NERVE_CRITERIA.definitions?.[term] || null;
export const getSciaticNerveDefinition = (term) => SCIATIC_NERVE_CRITERIA.definitions?.[term] || null;
export const getCommonPeronealNerveDefinition = (term) => COMMON_PERONEAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getSuperficialPeronealNerveDefinition = (term) => SUPERFICIAL_PERONEAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getDeepPeronealNerveDefinition = (term) => DEEP_PERONEAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getTibialNerveDefinition = (term) => TIBIAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getPosteriorTibialNerveDefinition = (term) => POSTERIOR_TIBIAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getFemoralNerveDefinition = (term) => FEMORAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getSaphenousNerveDefinition = (term) => SAPHENOUS_NERVE_CRITERIA.definitions?.[term] || null;
export const getObturatorNerveDefinition = (term) => OBTURATOR_NERVE_CRITERIA.definitions?.[term] || null;
export const getLateralFemoralCutaneousNerveDefinition = (term) => LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA.definitions?.[term] || null;
export const getIlioinguinalNerveDefinition = (term) => ILIOINGUINAL_NERVE_CRITERIA.definitions?.[term] || null;
export const getJacksonianEpilepsyDefinition = (term) => EPILEPSY_JACKSONIAN_CRITERIA.definitions[term] || null;
export const getDiencephalicEpilepsyDefinition = (term) => EPILEPSY_DIENCEPHALIC_CRITERIA.definitions[term] || null;
export const getPsychomotorEpilepsyDefinition = (term) => EPILEPSY_PSYCHOMOTOR_CRITERIA.definitions[term] || null;
export const getColdInjuryDefinition = (term) => COLD_INJURY_CRITERIA.definitions[term] || null;
export const getPADDefinition = (term) => PAD_CRITERIA.definitions[term] || null;
export const getHyperthyroidismDefinition = (term) => HYPERTHYROIDISM_CRITERIA.definitions[term] || null;
export const getThyroiditisDefinition = (term) => THYROIDITIS_CRITERIA.definitions[term] || null;
export const getHyperparathyroidismDefinition = (term) => HYPERPARATHYROIDISM_CRITERIA.definitions[term] || null;
export const getHypoparathyroidismDefinition = (term) => HYPOPARATHYROIDISM_CRITERIA.definitions[term] || null;
export const getAddisonsDiseaseDefinition = (term) => ADDISONS_DISEASE_CRITERIA.definitions[term] || null;
export const getCushingsSyndromeDefinition = (term) => CUSHINGS_SYNDROME_CRITERIA.definitions[term] || null;
export const getDiabetesInsipidusDefinition = (term) => DIABETES_INSIPIDUS_CRITERIA.definitions[term] || null;
export const getHyperaldosteronismDefinition = (term) => HYPERALDOSTERONISM_CRITERIA.definitions[term] || null;
export const getGoutDefinition = (term) => GOUT_CRITERIA.definitions[term] || null;
export const getBursitisDefinition = (term) => BURSITIS_CRITERIA.definitions[term] || null;
export const getTendinitisDefinition = (term) => TENDINITIS_CRITERIA.definitions[term] || null;
export const getMyositisDefinition = (term) => MYOSITIS_CRITERIA.definitions[term] || null;
export const getOsteomyelitisDefinition = (term) => OSTEOMYELITIS_CRITERIA.definitions[term] || null;
export const getMultiJointArthritisDefinition = (term) => MULTI_JOINT_ARTHRITIS_CRITERIA.definitions[term] || null;
export const getVertebralFractureDefinition = (term) => VERTEBRAL_FRACTURE_CRITERIA.definitions[term] || null;
export const getSacroiliacInjuryDefinition = (term) => SACROILIAC_INJURY_CRITERIA.definitions[term] || null;
export const getSpinalStenosisDefinition = (term) => SPINAL_STENOSIS_CRITERIA.definitions[term] || null;
export const getAnkylosingSpondylitisDefinition = (term) => ANKYLOSING_SPONDYLITIS_CRITERIA.definitions[term] || null;
export const getSpinalFusionDefinition = (term) => SPINAL_FUSION_CRITERIA.definitions[term] || null;
export const getWeakFootDefinition = (term) => WEAK_FOOT_CRITERIA.definitions[term] || null;
export const getClawFootDefinition = (term) => CLAW_FOOT_CRITERIA.definitions[term] || null;
export const getMetatarsalgiaDefinition = (term) => METATARSALGIA_CRITERIA.definitions[term] || null;
export const getHalluxValgusDefinition = (term) => HALLUX_VALGUS_CRITERIA.definitions[term] || null;
export const getHalluxRigidusDefinition = (term) => HALLUX_RIGIDUS_CRITERIA.definitions[term] || null;
export const getHerniaDefinition = (term) => HERNIA_CRITERIA.definitions[term] || null;
export const getPeritonealAdhesionsDefinition = (term) => PERITONEAL_ADHESIONS_CRITERIA.definitions[term] || null;
export const getEsophagealStrictureDefinition = (term) => ESOPHAGEAL_STRICTURE_CRITERIA.definitions[term] || null;
export const getPostgastrectomyDefinition = (term) => POSTGASTRECTOMY_CRITERIA.definitions[term] || null;
export const getIntestinalFistulaDefinition = (term) => INTESTINAL_FISTULA_CRITERIA.definitions[term] || null;
export const getAcneDefinition = (term) => ACNE_CRITERIA.definitions[term] || null;
export const getChloracneDefinition = (term) => CHLORACNE_CRITERIA.definitions[term] || null;
export const getAlopeciaAreataDefinition = (term) => ALOPECIA_AREATA_CRITERIA.definitions[term] || null;
export const getHyperhidrosisDefinition = (term) => HYPERHIDROSIS_CRITERIA.definitions[term] || null;
export const getDiscoidLupusDefinition = (term) => DISCOID_LUPUS_CRITERIA.definitions[term] || null;
export const getBullousDisordersDefinition = (term) => BULLOUS_DISORDERS_CRITERIA.definitions[term] || null;
export const getCutaneousVasculitisDefinition = (term) => CUTANEOUS_VASCULITIS_CRITERIA.definitions[term] || null;
export const getDermatophytosisDefinition = (term) => DERMATOPHYTOSIS_CRITERIA.definitions[term] || null;
export const getSkinInfectionsDefinition = (term) => SKIN_INFECTIONS_CRITERIA.definitions[term] || null;
export const getGeneralSkinFormulaDefinition = (term) => GENERAL_SKIN_FORMULA_CRITERIA.definitions[term] || null;
export const getGeneralEyeFormulaDefinition = (term) => GENERAL_EYE_FORMULA_CRITERIA.definitions[term] || null;
export const getUveitisDefinition = (term) => UVEITIS_CRITERIA.definitions[term] || null;
export const getKeratitisDefinition = (term) => KERATITIS_CRITERIA.definitions[term] || null;
export const getChronicConjunctivitisDefinition = (term) => CHRONIC_CONJUNCTIVITIS_CRITERIA.definitions[term] || null;
export const getScleritisDefinition = (term) => SCLERITIS_CRITERIA.definitions[term] || null;
export const getPeripheralVestibularDefinition = (term) => PERIPHERAL_VESTIBULAR_CRITERIA.definitions[term] || null;
export const getChronicSuppurativeOtitisMediaDefinition = (term) => CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA.definitions[term] || null;
export const getChronicOtitisExternaDefinition = (term) => CHRONIC_OTITIS_EXTERNA_CRITERIA.definitions[term] || null;
export const getChronicNonsuppurativeOtitisMediaDefinition = (term) => CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA.definitions[term] || null;
export const getLossOfSmellDefinition = (term) => LOSS_OF_SMELL_CRITERIA.definitions?.[term] || null;
export const getLossOfTasteDefinition = (term) => LOSS_OF_TASTE_CRITERIA.definitions?.[term] || null;
export const getSystemicLupusDefinition = (term) => SYSTEMIC_LUPUS_CRITERIA.definitions?.[term] || null;
export const getTuberculosisActiveDefinition = (term) => TUBERCULOSIS_ACTIVE_CRITERIA.definitions?.[term] || null;
export const getTuberculosisInactiveDefinition = (term) => TUBERCULOSIS_INACTIVE_CRITERIA.definitions?.[term] || null;
export const getTuberculosisMilitaryDefinition = (term) => TUBERCULOSIS_MILIARY_CRITERIA.definitions?.[term] || null;
export const getSphincterControlDefinition = (term) => SPHINCTER_CONTROL_CRITERIA.definitions?.[term] || null;
export const getRectalStrictureDefinition = (term) => RECTAL_STRICTURE_CRITERIA.definitions?.[term] || null;
export const getRectalProlapseDefinition = (term) => RECTAL_PROLAPSE_CRITERIA.definitions?.[term] || null;
export const getAnalFistulaDefinition = (term) => ANAL_FISTULA_CRITERIA.definitions?.[term] || null;
export const getHemorrhoidsDefinition = (term) => HEMORRHOIDS_CRITERIA.definitions?.[term] || null;
export const getPruritusAniDefinition = (term) => PRURITUS_ANI_CRITERIA.definitions?.[term] || null;
export const getAvitaminosisDefinition = (term) => AVITAMINOSIS_CRITERIA.definitions?.[term] || null;
export const getBeriberiDefinition = (term) => BERIBERI_CRITERIA.definitions?.[term] || null;
export const getPellagraDefinition = (term) => PELLAGRA_CRITERIA.definitions?.[term] || null;
export const getVulvaClitorisDiseaseDefinition = (term) => VULVA_CLITORIS_DISEASE_CRITERIA.definitions?.[term] || null;
export const getVaginaDiseaseDefinition = (term) => VAGINA_DISEASE_CRITERIA.definitions?.[term] || null;
export const getCervixDiseaseDefinition = (term) => CERVIX_DISEASE_CRITERIA.definitions?.[term] || null;
export const getUterusDiseaseDefinition = (term) => UTERUS_DISEASE_CRITERIA.definitions?.[term] || null;
export const getFallopianTubePIDDefinition = (term) => FALLOPIAN_TUBE_PID_CRITERIA.definitions?.[term] || null;
export const getOvaryDiseaseDefinition = (term) => OVARY_DISEASE_CRITERIA.definitions?.[term] || null;
export const getChronicCystitisDefinition = (term) => CHRONIC_CYSTITIS_CRITERIA.definitions?.[term] || null;
export const getNeurogenicBladderDefinition = (term) => NEUROGENIC_BLADDER_CRITERIA.definitions?.[term] || null;
export const getProstateConditionsDefinition = (term) => PROSTATE_CONDITIONS_CRITERIA.definitions?.[term] || null;
export const getUrethralStrictureDefinition = (term) => URETHRAL_STRICTURE_CRITERIA.definitions?.[term] || null;
export const getMandibleMalunionDefinition = (term) => MANDIBLE_MALUNION_CRITERIA.definitions?.[term] || null;
export const getMaxillaMalunionDefinition = (term) => MAXILLA_MALUNION_CRITERIA.definitions?.[term] || null;
export const getMaxillaMandibleBoneDiseaseDefinition = (term) => MAXILLA_MANDIBLE_BONE_DISEASE_CRITERIA.definitions?.[term] || null;
export const getEsophagealSpasmDefinition = (term) => ESOPHAGEAL_SPASM_CRITERIA.definitions?.[term] || null;
export const getEssentialThrombocythemiaDefinition = (term) => MYELOPROLIFERATIVE_7718_CRITERIA.definitions?.[term] || null;
export const getEyeConditionsDefinition = (term) => EYE_CONDITIONS_CRITERIA.definitions?.[term] || null;
export const getChronicLaryngitisDefinition = (term) => CHRONIC_LARYNGITIS_CRITERIA.definitions?.[term] || null;
export const getAphoniaDefinition = (term) => APHONIA_CRITERIA.definitions?.[term] || null;
export const getLaryngealStenosisDefinition = (term) => LARYNGEAL_STENOSIS_CRITERIA.definitions?.[term] || null;
export const getPharynxInjuryDefinition = (term) => PHARYNX_INJURY_CRITERIA.definitions?.[term] || null;
export const getDementiaDefinition = (term) => DEMENTIA_CRITERIA.definitions?.[term] || null;
export const getPeripheralNeuropathyDefinition = (term) => PERIPHERAL_NEUROPATHY_CRITERIA.definitions?.[term] || null;
export const getInsomniaDefinition = (term) => INSOMNIA_CRITERIA.definitions?.[term] || null;
export const getTbiResidualsDefinition = (term) => TBI_RESIDUALS_CRITERIA.definitions?.[term] || null;
export const getMentalHealthSharedDefinition = (term) =>   MENTAL_HEALTH_SHARED_CRITERIA.definitions?.[term] || null;
export const getPlantarFasciitisDefinition = (term) =>   PLANTAR_FASCIITIS_CRITERIA.definitions?.[term] || null;
export const getShoulderDefinition = (term) =>   SHOULDER_CRITERIA.definitions?.[term] || null;
export const getHipDefinition = (term) =>   HIP_CRITERIA.definitions?.[term] || null;
export const getAnkleDefinition = (term) =>   ANKLE_CRITERIA.definitions?.[term] || null;
export const getWristDefinition = (term) =>   WRIST_CRITERIA.definitions?.[term] || null;
export const getElbowDefinition = (term) =>   ELBOW_CRITERIA.definitions?.[term] || null;
export const getDegenerativeArthritisDefinition = (term) =>   DEGENERATIVE_ARTHRITIS_CRITERIA.definitions?.[term] || null;
export const getGeneralSpineDefinition = (term) =>   GENERAL_SPINE_RATING_FORMULA.definitions?.[term] || null;
export const getRhinitisDefinition = (term) =>   RHINITIS_CRITERIA.definitions?.[term] || null;
export const getSinusitisDefinition = (term) =>   SINUSITIS_CRITERIA.definitions?.[term] || null;
export const getDeviatedSeptumDefinition = (term) =>   DEVIATED_SEPTUM_CRITERIA.definitions?.[term] || null;
export const getNoseLossDefinition = (term) =>   NOSE_LOSS_CRITERIA.definitions?.[term] || null;
export const getCopdDefinition = (term) =>   COPD_CRITERIA.definitions?.[term] || null;
export const getChronicBronchitisDefinition = (term) =>   CHRONIC_BRONCHITIS_CRITERIA.definitions?.[term] || null;
export const getEmphysemaDefinition = (term) =>   EMPHYSEMA_CRITERIA.definitions?.[term] || null;
export const getRaynaudsDefinition = (term) =>   RAYNAUDS_CRITERIA.definitions?.[term] || null;
export const getVaricoseVeinsDefinition = (term) =>   VARICOSE_VEINS_CRITERIA.definitions?.[term] || null;
export const getChronicUrticariaDefinition = (term) =>   CHRONIC_URTICARIA_CRITERIA.definitions?.[term] || null;
export const getCadDefinition = (term) =>   CAD_CRITERIA.definitions?.[term] || null;
export const getPostMiDefinition = (term) =>   POST_MI_CRITERIA.definitions?.[term] || null;
export const getHypertensiveHeartDefinition = (term) =>   HYPERTENSIVE_HEART_CRITERIA.definitions?.[term] || null;
export const getPeripheralArterialDiseaseDefinition = (term) =>   PERIPHERAL_ARTERIAL_DISEASE_CRITERIA.definitions?.[term] || null;
export const getSyphiliticHeartDiseaseDefinition = (term) =>   SYPHILITIC_HEART_DISEASE_CRITERIA.definitions?.[term] || null;
export const getAmputationRatingCriteriaDefinition = (term) => AMPUTATION_CRITERIA.definitions?.[term] || null;
export const getIbsRatingCriteriaDefinition = (term) => IBS_CRITERIA.definitions?.[term] || null;
export const getGerdRatingCriteriaDefinition = (term) => GERD_CRITERIA.definitions?.[term] || null;
export const getGerdComplicationsRatingCriteriaDefinition = (term) => GERD_COMPLICATIONS_CRITERIA.definitions?.[term] || null;
export const getUlcerativeColitisRatingCriteriaDefinition = (term) => ULCERATIVE_COLITIS_CRITERIA.definitions?.[term] || null;
export const getPepticUlcerRatingCriteriaDefinition = (term) => PEPTIC_ULCER_CRITERIA.definitions?.[term] || null;
export const getHemorrhoidRatingCriteriaDefinition = (term) => HEMORRHOID_CRITERIA.definitions?.[term] || null;
export const getDiverticulitisRatingCriteriaDefinition = (term) => DIVERTICULITIS_CRITERIA.definitions?.[term] || null;
export const getDiabetesDefinition = (term) => DIABETES_CRITERIA.definitions?.[term] || null;
export const getScarsDefinition = (term) => SCARS_CRITERIA.definitions?.[term] || null;
export const getPsoriasisDefinition = (term) => PSORIASIS_CRITERIA.definitions?.[term] || null;
export const getEczemaDefinition = (term) => ECZEMA_CRITERIA.definitions?.[term] || null;
export const getHypothyroidismDefinition = (term) => HYPOTHYROIDISM_CRITERIA.definitions?.[term] || null;
export const getTestisConditionsDefinition = (term) => TESTIS_CONDITIONS_CRITERIA.definitions?.[term] || null;
export const getPenisConditionsDefinition = (term) => PENIS_CONDITIONS_CRITERIA.definitions[term] || null;
export const getEndometriosisDefinition = (term) => ENDOMETRIOSIS_CRITERIA.definitions[term] || null;
export const getFemaleReproductiveOrgansDefinition = (term) => FEMALE_REPRODUCTIVE_ORGANS_CRITERIA.definitions[term] || null;
export const getPelvicProlapseDefinition = (term) => PELVIC_PROLAPSE_CRITERIA.definitions[term] || null;
export const getFemaleSexualArousalDisorderDefinition = (term) => FEMALE_SEXUAL_AROUSAL_DISORDER_CRITERIA.definitions[term] || null;
export const getRadiculopathyDefinition = (term) => RADICULOPATHY_CRITERIA.definitions[term] || null;
export const getChronicFatigueDefinition = (term) => CHRONIC_FATIGUE_CRITERIA.definitions[term] || null;
export const getMenieresRatingDefinition = (term) => MENIERES_CRITERIA.ratings.definitions[term] || null;
export const getTMJDefinition = (term) => TMJ_CRITERIA.ratings.definitions[term] || null;
export const getHearingLossDefinition = (term) => HEARING_LOSS_CRITERIA.definitions[term] || null;
export const getSyphilisDefinition = (term) => SYPHILIS_CRITERIA.definitions?.[term] || null;
export const getCerebrospinalSyphilisDefinition = (term) => CEREBROSPINAL_SYPHILIS_CRITERIA.definitions?.[term] || null;
export const getMeningovascularSyphilisDefinition = (term) => MENINGOVASCULAR_SYPHILIS_CRITERIA.definitions?.[term] || null;
export const getTabesDorsalisDefinition = (term) => TABES_DORSALIS_CRITERIA.definitions?.[term] || null;
export const getSyphiliticDementiaDefinition = (term) => SYPHILITIC_DEMENTIA_CRITERIA.definitions?.[term] || null;

