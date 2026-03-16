/* eslint-disable no-unused-vars */

// ============================================
// RATING LOGIC AGGREGATOR
// ============================================
// This file re-exports everything from all body-system modules.
// ratingCriteria.js imports from here, so no other file in the
// app needs to change its import paths.
//
// Add each new module here as it is extracted from ratingCriteria.js.
// Phase 1: mentalHealth ✓
// Phase 2: neurological (pending)
// Phase 3: musculoskeletal (pending)
// Phase 4: cardiorespiratory (pending)
// Phase 5: digestive (pending)
// Phase 6: skinAndEndocrine (pending)
// Phase 7: genitourinary (pending)
// Phase 8: hemicAndLymphatic (pending)
// Phase 9: dentalAndVisual (pending)
// Phase 10: infectiousDiseases (pending)

// ============================================
// MODULE IMPORTS
// ============================================

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
  analyzePTSDLogs,
  analyzeMajorDepressionLogs,
  analyzeGeneralizedAnxietyLogs,
  analyzePanicDisorderLogs,
  analyzeBipolarLogs,
  analyzeSocialAnxietyLogs,
  analyzeOCDLogs,
  analyzePersistentDepressiveLogs,
  analyzeAdjustmentDisorderLogs,
  analyzeUnspecifiedAnxietyLogs,
  analyzeUnspecifiedDepressiveLogs,
  analyzeSomaticSymptomDisorderLogs,
  analyzeOtherSpecifiedSomaticLogs,
  analyzeUnspecifiedSomaticLogs,
  analyzeIllnessAnxietyLogs,
  analyzeOtherSpecifiedAnxietyLogs,
  analyzeDepersonalizationLogs,
  analyzeCyclothymicLogs,
  analyzeAnorexiaNervosaLogs,
  analyzeBulimiaNervosaLogs,
  analyzeSchizophreniaLogs,
  analyzeSchizoaffectiveDisorderLogs,
  analyzeDelusionalDisorderLogs,
  analyzePsychoticDisorderNOSLogs,
  analyzeBriefPsychoticDisorderLogs,
  analyzeBingeEatingDisorderLogs,
  analyzeDissociativeIdentityDisorderLogs,
  analyzeDissociativeAmnesiaLogs,
  analyzeAcuteStressDisorderLogs,
  analyzeAntisocialPersonalityDisorderLogs,
  analyzeBorderlinePersonalityDisorderLogs,
  analyzeNarcissisticPersonalityDisorderLogs,
  analyzeAvoidantPersonalityDisorderLogs,
  analyzeDementiaLogs,
} from './mentalHealth';

// ============================================
// RE-EXPORT ALL MODULE EXPORTS
// ============================================
// Each export below allows ratingCriteria.js to pull everything
// through this single aggregator file.

export {
  // --- Mental Health ---
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
  analyzePTSDLogs,
  analyzeMajorDepressionLogs,
  analyzeGeneralizedAnxietyLogs,
  analyzePanicDisorderLogs,
  analyzeBipolarLogs,
  analyzeSocialAnxietyLogs,
  analyzeOCDLogs,
  analyzePersistentDepressiveLogs,
  analyzeAdjustmentDisorderLogs,
  analyzeUnspecifiedAnxietyLogs,
  analyzeUnspecifiedDepressiveLogs,
  analyzeSomaticSymptomDisorderLogs,
  analyzeOtherSpecifiedSomaticLogs,
  analyzeUnspecifiedSomaticLogs,
  analyzeIllnessAnxietyLogs,
  analyzeOtherSpecifiedAnxietyLogs,
  analyzeDepersonalizationLogs,
  analyzeCyclothymicLogs,
  analyzeAnorexiaNervosaLogs,
  analyzeBulimiaNervosaLogs,
  analyzeSchizophreniaLogs,
  analyzeSchizoaffectiveDisorderLogs,
  analyzeDelusionalDisorderLogs,
  analyzePsychoticDisorderNOSLogs,
  analyzeBriefPsychoticDisorderLogs,
  analyzeBingeEatingDisorderLogs,
  analyzeDissociativeIdentityDisorderLogs,
  analyzeDissociativeAmnesiaLogs,
  analyzeAcuteStressDisorderLogs,
  analyzeAntisocialPersonalityDisorderLogs,
  analyzeBorderlinePersonalityDisorderLogs,
  analyzeNarcissisticPersonalityDisorderLogs,
  analyzeAvoidantPersonalityDisorderLogs,
  analyzeDementiaLogs,
};