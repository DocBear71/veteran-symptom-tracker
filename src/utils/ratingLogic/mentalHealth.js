/* eslint-disable no-unused-vars */

// ============================================
// MENTAL HEALTH RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: PTSD, Depression, Anxiety, Bipolar, OCD,
// Personality Disorders, Eating Disorders, Psychotic
// Disorders, Dissociative Disorders, Dementia, and more.
//
// Based on 38 CFR Part 4, § 4.130 (Mental Disorders)
// and the General Rating Formula for Mental Disorders.
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

// ============================================
// SHARED HELPER (used by all modules)
// ============================================

/**
 * Safely get symptom ID from a log entry.
 * Checks both log.symptomId and log. Symptom for backward compatibility.
 * @param {Object} log - The log entry
 * @returns {string|null}
 */
const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

/**
 * Check if a timestamp falls within the evaluation period.
 * @param {string} timestamp
 * @param {number} days
 * @returns {boolean}
 */
const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

/**
 * Core mental health condition analyzer.
 * Used by all individual analyze*Logs functions in this module.
 * Evaluates symptom logs against the General Rating Formula for Mental Disorders
 * (38 CFR § 4.130).
 *
 * @param {Array} logs - Symptom log entries
 * @param {string} conditionId - Condition identifier string
 * @param {Array} symptomIds - Symptom IDs relevant to this condition
 * @param {Object} conditionCriteria - The *_CRITERIA object for this condition
 * @param {Object} options - { evaluationPeriodDays }
 * @returns {Object} Analysis result object
 */
const analyzeMentalHealthCondition = (
    logs, conditionId, symptomIds, conditionCriteria, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  // Filter for condition-specific symptoms within the evaluation window
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      message: `No ${conditionCriteria.condition} symptom logs found in the evaluation period`,
      supportedRating: null,
      evidence: [],
      gaps: [
        `Start logging ${conditionCriteria.condition} symptoms`,
        'Include notes about how symptoms affect work and relationships',
        'Document treatment and medication if applicable',
      ],
      metrics: {
        totalLogs: 0,
        avgSeverity: 0,
        severeSymptoms: 0,
        hospitalized: false,
        hospitalizationCount: 0,
        dangerToSelf: false,
        dangerToOthers: false,
      },
    };
  }

  const symptomCounts = {};
  symptomIds.forEach(id => {
    symptomCounts[id] = relevantLogs.filter(l => getLogSymptomId(l) === id).length;
  });

  const totalSymptoms = relevantLogs.length;
  const monthsInPeriod = evaluationPeriodDays / 30;
  const symptomsPerMonth = totalSymptoms / monthsInPeriod;

  const weeksInPeriod = evaluationPeriodDays / 7;
  const panicSymptomIds = symptomIds.filter(id =>
      id.includes('panic') || id === 'ptsd-panic' || id === 'panic-attack',
  );
  const panicCount = relevantLogs.filter(
      l => panicSymptomIds.includes(getLogSymptomId(l))).length;
  const panicPerWeek = panicCount / weeksInPeriod;

  const symptomTypesPresent = Object.entries(symptomCounts).
      filter(([_, count]) => count > 0).
      map(([type, _]) => type);

  const oldestLog = relevantLogs.reduce((oldest, log) =>
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest,
  );
  const newestLog = relevantLogs.reduce((newest, log) =>
      new Date(log.timestamp) > new Date(newest.timestamp) ? log : newest,
  );

  const impactKeywords = {
    work: ['work', 'job', 'employment', 'productivity', 'performance', 'absent', 'late', 'called off'],
    social: ['relationship', 'family', 'friends', 'isolated', 'alone', 'avoiding', 'social'],
    daily: ['shower', 'hygiene', 'eat', 'sleep', 'basic', 'daily', 'routine'],
    severe: ['suicidal', 'hospital', 'emergency', 'crisis', 'violent', 'dangerous'],
  };

  const notesAnalysis = { workImpact: 0, socialImpact: 0, dailyImpact: 0, severeSymptoms: 0 };

  relevantLogs.forEach(log => {
    const notes = (log.notes || '').toLowerCase();
    if (impactKeywords.work.some(kw => notes.includes(kw))) notesAnalysis.workImpact++;
    if (impactKeywords.social.some(kw => notes.includes(kw))) notesAnalysis.socialImpact++;
    if (impactKeywords.daily.some(kw => notes.includes(kw))) notesAnalysis.dailyImpact++;
    if (impactKeywords.severe.some(kw => notes.includes(kw))) notesAnalysis.severeSymptoms++;
  });

  const evidence = {
    evaluationPeriod: {
      startDate: oldestLog.timestamp,
      endDate: newestLog.timestamp,
      days: evaluationPeriodDays,
      months: monthsInPeriod.toFixed(1),
    },
    totalSymptoms,
    symptomsPerMonth: symptomsPerMonth.toFixed(1),
    symptomBreakdown: symptomCounts,
    symptomTypesPresent,
    panicAttacks: { total: panicCount, perWeek: panicPerWeek.toFixed(1) },
    functionalImpact: notesAnalysis,
  };

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];
  let assessmentLevel = 'preliminary';

  if (notesAnalysis.severeSymptoms > 0) {
    supportedRating = '70-100';
    assessmentLevel = 'requires-professional-evaluation';
    ratingRationale = [
      'Logged symptoms indicate severe impairment requiring immediate professional evaluation',
      'Notes reference crisis-level symptoms',
      'CRITICAL: If experiencing suicidal thoughts, call Veterans Crisis Line: 988 then Press 1',
    ];
    gaps = [
      'Seek immediate mental health treatment',
      'Document all treatment and hospitalizations',
      'Request comprehensive functional assessment from mental health provider',
    ];
  } else if (
      panicPerWeek > 1 ||
      (symptomsPerMonth > 12 && symptomTypesPresent.length >= 3) ||
      (notesAnalysis.workImpact > 5 && notesAnalysis.socialImpact > 5)
  ) {
    supportedRating = '50-70';
    assessmentLevel = 'requires-professional-evaluation';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      panicPerWeek > 1 ? `Panic attacks: ${panicPerWeek.toFixed(1)} per week (>1/week supports 50%+)` : '',
      symptomTypesPresent.length >= 3 ? `Multiple symptom types present` : '',
      notesAnalysis.workImpact > 5 ? `${notesAnalysis.workImpact} logs mention work impact` : '',
      notesAnalysis.socialImpact > 5 ? `${notesAnalysis.socialImpact} logs mention social/relationship impact` : '',
      'Pattern suggests significant functional impairment',
    ].filter(Boolean);
    gaps = [
      'Professional evaluation required to assess functional impairment level',
      'Document specific work difficulties (attendance, productivity, relationships)',
      'Document social/relationship difficulties',
      'Maintain continuous mental health treatment records',
      'Request detailed statement from mental health provider about functional limitations',
    ];
  } else if (
      (panicPerWeek >= 0.25 && panicPerWeek <= 1) ||
      (symptomsPerMonth >= 4 && symptomTypesPresent.length >= 2) ||
      (notesAnalysis.workImpact >= 2 || notesAnalysis.socialImpact >= 2)
  ) {
    supportedRating = '30';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      panicPerWeek >= 0.25 ? `Panic-related symptoms: ${panicPerWeek.toFixed(1)} per week (weekly or less)` : '',
      `${symptomTypesPresent.length} symptom types documented`,
      'Pattern suggests occasional decrease in work efficiency',
    ].filter(Boolean);
    gaps = [
      'Continue documenting all symptoms consistently',
      'Include specific details about functional impact in notes',
      'Document any work accommodations or difficulties',
      'Maintain regular mental health treatment',
      'Request provider statement on functional limitations',
    ];
  } else if (totalSymptoms >= 3 || symptomTypesPresent.length >= 1) {
    supportedRating = '10';
    ratingRationale = [
      `${totalSymptoms} symptoms logged over ${monthsInPeriod.toFixed(1)} months`,
      `Symptom types present: ${symptomTypesPresent.length}`,
      'Current evidence suggests mild or controlled symptoms',
    ];
    gaps = [
      `Ensure you have formal ${conditionCriteria.condition} diagnosis documentation`,
      'Document all treatment and medication',
      'If symptoms worsen, log them immediately with functional impact details',
      'Include notes about work or social impact when relevant',
    ];
  } else {
    supportedRating = '0-10';
    ratingRationale = [
      `${totalSymptoms} symptoms logged - limited evidence of ongoing symptoms`,
      'Formal diagnosis documentation required',
    ];
    gaps = [
      `Obtain formal ${conditionCriteria.condition} diagnosis from qualified mental health provider`,
      'Document all symptoms, even if mild',
      'Include treatment/medication records',
      'Log symptoms consistently to establish pattern',
    ];
  }

  const severeSymptoms = relevantLogs.filter(log => log.severity >= 8).length;
  const logsWithSeverity = relevantLogs.filter(log => log.severity && log.severity > 0);
  const avgSeverity = logsWithSeverity.length > 0
      ? logsWithSeverity.reduce((sum, log) => sum + log.severity, 0) / logsWithSeverity.length
      : 0;

  const hospitalizationLogs = relevantLogs.filter(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('hospital') || notes.includes('inpatient') || notes.includes('admitted');
  });
  const hospitalized = hospitalizationLogs.length > 0;
  const hospitalizationCount = hospitalizationLogs.length;

  const dangerToSelf = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('suicidal') || notes.includes('self-harm') || notes.includes('danger to self');
  });
  const dangerToOthers = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('homicidal') || notes.includes('danger to others') || notes.includes('violent');
  });

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    assessmentLevel,
    evidence,
    gaps,
    criteria: conditionCriteria,
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      severeSymptoms,
      hospitalized,
      hospitalizationCount,
      dangerToSelf,
      dangerToOthers,
    },
    disclaimer: 'CRITICAL DISCLAIMER: Mental health ratings are based on professional evaluation of functional impairment in work and social settings, not symptom frequency alone. This analysis helps you understand what your documentation might support, but a comprehensive mental health evaluation is required for any rating determination. All mental health concerns should be discussed with a qualified provider.',
    crisisResources: {
      veteransCrisisLine: '988 then Press 1',
      text: '838255',
      chat: 'https://www.veteranscrisisline.net/get-help-now/chat/',
    },
  };
};

// ============================================
// MENTAL HEALTH CONDITIONS (for CONDITIONS object)
// ============================================
export const MENTAL_HEALTH_CONDITIONS = {
  PTSD: {
    id: 'ptsd',
    name: 'PTSD',
    diagnosticCode: '9411',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['ptsd-nightmare', 'ptsd-flashback', 'ptsd-hypervigilance', 'ptsd-avoidance', 'ptsd-panic', 'nightmares'],
  },
  MAJOR_DEPRESSION: {
    id: 'major-depression',
    name: 'Major Depressive Disorder',
    diagnosticCode: '9434',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['depression', 'mdd-episode', 'mdd-anhedonia', 'mdd-hopelessness'],
  },
  GENERALIZED_ANXIETY: {
    id: 'generalized-anxiety',
    name: 'Generalized Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['anxiety', 'gad-worry', 'gad-restlessness', 'gad-muscle-tension'],
  },
  PANIC_DISORDER: {
    id: 'panic-disorder',
    name: 'Panic Disorder',
    diagnosticCode: '9412',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['panic-attack', 'panic-agoraphobia', 'panic-anticipatory-anxiety'],
  },
  BIPOLAR: {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    diagnosticCode: '9432',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['bipolar-manic', 'bipolar-depressive', 'bipolar-mixed'],
  },
  SOCIAL_ANXIETY: {
    id: 'social-anxiety',
    name: 'Social Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['social-anxiety-avoidance', 'social-anxiety-distress', 'social-anxiety-panic'],
  },
  OCD: {
    id: 'ocd',
    name: 'Obsessive-Compulsive Disorder',
    diagnosticCode: '9404',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['ocd-obsessions', 'ocd-compulsions', 'ocd-distress', 'ocd-interference'],
  },
  PERSISTENT_DEPRESSIVE: {
    id: 'persistent-depressive',
    name: 'Persistent Depressive Disorder (Dysthymia)',
    diagnosticCode: '9433',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['pdd-depressed-mood', 'pdd-low-energy', 'pdd-hopelessness', 'pdd-concentration'],
  },
  ADJUSTMENT_DISORDER: {
    id: 'adjustment-disorder',
    name: 'Adjustment Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['adj-distress', 'adj-functional-impairment', 'adj-mood', 'adj-anxiety'],
  },
  UNSPECIFIED_ANXIETY: {
    id: 'unspecified-anxiety',
    name: 'Unspecified Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['unspec-anxiety-symptoms', 'unspec-anxiety-avoidance', 'unspec-anxiety-distress'],
  },
  UNSPECIFIED_DEPRESSIVE: {
    id: 'unspecified-depressive',
    name: 'Unspecified Depressive Disorder',
    diagnosticCode: '9434',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['unspec-dep-mood', 'unspec-dep-sleep', 'unspec-dep-energy', 'unspec-dep-concentration'],
  },
  SOMATIC_SYMPTOM_DISORDER: {
    id: 'somatic-symptom-disorder',
    name: 'Somatic Symptom Disorder',
    diagnosticCode: '9422',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['somatic-pain', 'somatic-fatigue', 'somatic-anxiety-symptoms', 'somatic-health-preoccupation'],
  },
  OTHER_SPECIFIED_SOMATIC: {
    id: 'other-specified-somatic',
    name: 'Other Specified Somatic Symptom Disorder',
    diagnosticCode: '9422',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['somatic-pain', 'somatic-fatigue'],
  },
  UNSPECIFIED_SOMATIC: {
    id: 'unspecified-somatic',
    name: 'Unspecified Somatic Symptom Disorder',
    diagnosticCode: '9422',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['somatic-pain', 'somatic-fatigue'],
  },
  ILLNESS_ANXIETY: {
    id: 'illness-anxiety',
    name: 'Illness Anxiety Disorder',
    diagnosticCode: '9421',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['illness-anxiety-preoccupation', 'illness-anxiety-checking', 'illness-anxiety-avoidance'],
  },
  OTHER_SPECIFIED_ANXIETY: {
    id: 'other-specified-anxiety',
    name: 'Other Specified Anxiety Disorder',
    diagnosticCode: '9400',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['anxiety', 'unspec-anxiety-symptoms'],
  },
  DEPERSONALIZATION_DEREALIZATION: {
    id: 'depersonalization-derealization',
    name: 'Depersonalization/Derealization Disorder',
    diagnosticCode: '9424',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['deperson-detachment', 'deperson-unreality', 'deperson-distress'],
  },
  CYCLOTHYMIC: {
    id: 'cyclothymic',
    name: 'Cyclothymic Disorder',
    diagnosticCode: '9432',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['cyclo-hypomanic', 'cyclo-depressive', 'cyclo-instability'],
  },
  ANOREXIA_NERVOSA: {
    id: 'anorexia-nervosa',
    name: 'Anorexia Nervosa',
    diagnosticCode: '9520',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['anorexia-restriction', 'anorexia-weight-fear', 'anorexia-body-image'],
  },
  BULIMIA_NERVOSA: {
    id: 'bulimia-nervosa',
    name: 'Bulimia Nervosa',
    diagnosticCode: '9521',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['bulimia-binge', 'bulimia-purge', 'bulimia-self-eval'],
  },
  SCHIZOPHRENIA: {
    id: 'schizophrenia',
    name: 'Schizophrenia',
    diagnosticCode: '9203',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['schizo-hallucinations', 'schizo-delusions', 'schizo-disorganized', 'schizo-negative'],
  },
  SCHIZOAFFECTIVE_DISORDER: {
    id: 'schizoaffective-disorder',
    name: 'Schizoaffective Disorder',
    diagnosticCode: '9211',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['schizo-hallucinations', 'schizo-delusions', 'bipolar-manic', 'bipolar-depressive'],
  },
  DELUSIONAL_DISORDER: {
    id: 'delusional-disorder',
    name: 'Delusional Disorder',
    diagnosticCode: '9210',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['delusional-fixed-beliefs', 'delusional-functioning', 'delusional-distress'],
  },
  PSYCHOTIC_DISORDER_NOS: {
    id: 'psychotic-disorder-nos',
    name: 'Psychotic Disorder, Unspecified',
    diagnosticCode: '9210',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['schizo-hallucinations', 'schizo-delusions', 'schizo-disorganized'],
  },
  BRIEF_PSYCHOTIC_DISORDER: {
    id: 'brief-psychotic-disorder',
    name: 'Brief Psychotic Disorder',
    diagnosticCode: '9210',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['schizo-hallucinations', 'schizo-delusions', 'schizo-disorganized'],
  },
  BINGE_EATING_DISORDER: {
    id: 'binge-eating-disorder',
    name: 'Binge Eating Disorder',
    diagnosticCode: '9522',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['binge-episodes', 'binge-distress', 'binge-no-purge'],
  },
  DISSOCIATIVE_IDENTITY_DISORDER: {
    id: 'dissociative-identity-disorder',
    name: 'Dissociative Identity Disorder',
    diagnosticCode: '9424',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['dissoc-identity-disruption', 'dissoc-amnesia', 'dissoc-distress'],
  },
  DISSOCIATIVE_AMNESIA: {
    id: 'dissociative-amnesia',
    name: 'Dissociative Amnesia',
    diagnosticCode: '9424',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['dissoc-amnesia', 'dissoc-distress', 'dissoc-functioning'],
  },
  ACUTE_STRESS_DISORDER: {
    id: 'acute-stress-disorder',
    name: 'Acute Stress Disorder',
    diagnosticCode: '9411',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['ptsd-flashback', 'ptsd-avoidance', 'dissoc-distress'],
  },
  ANTISOCIAL_PERSONALITY_DISORDER: {
    id: 'antisocial-personality-disorder',
    name: 'Antisocial Personality Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['antisocial-rule-violation', 'antisocial-deceit', 'antisocial-impulsivity'],
  },
  BORDERLINE_PERSONALITY_DISORDER: {
    id: 'borderline-personality-disorder',
    name: 'Borderline Personality Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['bpd-instability', 'bpd-impulsivity', 'bpd-self-harm', 'bpd-identity'],
  },
  NARCISSISTIC_PERSONALITY_DISORDER: {
    id: 'narcissistic-personality-disorder',
    name: 'Narcissistic Personality Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['narcissistic-grandiosity', 'narcissistic-empathy', 'narcissistic-relationships'],
  },
  AVOIDANT_PERSONALITY_DISORDER: {
    id: 'avoidant-personality-disorder',
    name: 'Avoidant Personality Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['avoidant-social-inhibition', 'avoidant-inadequacy', 'avoidant-sensitivity'],
  },
  DEMENTIA: {
    id: 'dementia',
    name: 'Dementia',
    diagnosticCode: '9312',
    cfrReference: '38 CFR 4.130',
    symptomIds: ['dementia-memory', 'dementia-language', 'dementia-judgment', 'dementia-personality'],
  },
};

// ============================================
// MENTAL HEALTH RATING CRITERIA & ANALYZE FUNCTIONS
// ============================================
export const MENTAL_HEALTH_SHARED_CRITERIA = {
  ratingFormula: 'General Rating Formula for Mental Disorders',
  cfrReference: '38 CFR 4.130',
  ratingNote: 'All mental health conditions are rated under the General Rating Formula for Mental Disorders. Ratings consider the frequency, severity, and duration of symptoms, along with capacity for adjustment during remissions.',

  ratings: [
    {
      percent: 100,
      summary: 'Total occupational and social impairment',
      criteria: {
        level: 'total',
        functionalImpairment: 'severe',
      },
      criteriaDescription: [
        'Total occupational and social impairment due to symptoms such as:',
        '• Gross impairment in thought processes or communication',
        '• Persistent delusions or hallucinations',
        '• Grossly inappropriate behavior',
        '• Persistent danger of hurting self or others',
        '• Intermittent inability to perform activities of daily living',
        '• Disorientation to time or place',
        '• Memory loss for names of close relatives, own occupation, or own name',
      ],
    },
    {
      percent: 70,
      summary: 'Occupational and social impairment, with deficiencies in most areas',
      criteria: {
        level: 'severe',
        functionalImpairment: 'significant',
      },
      criteriaDescription: [
        'Occupational and social impairment with deficiencies in most areas such as:',
        '• Work, school, family relations, judgment, thinking, or mood',
        'Due to symptoms such as:',
        '• Suicidal ideation',
        '• Obsessional rituals which interfere with routine activities',
        '• Speech intermittently illogical, obscure, or irrelevant',
        '• Near-continuous panic or depression affecting ability to function',
        '• Impaired impulse control (unprovoked irritability with periods of violence)',
        '• Spatial disorientation',
        '• Neglect of personal appearance and hygiene',
        '• Difficulty adapting to stressful circumstances (including work)',
        '• Inability to establish and maintain effective relationships',
      ],
    },
    {
      percent: 50,
      summary: 'Occupational and social impairment with reduced reliability and productivity',
      criteria: {
        level: 'moderate',
        functionalImpairment: 'moderate',
      },
      criteriaDescription: [
        'Occupational and social impairment with reduced reliability and productivity due to symptoms such as:',
        '• Flattened affect',
        '• Circumstantial, circumlocutory, or stereotyped speech',
        '• Panic attacks more than once a week',
        '• Difficulty in understanding complex commands',
        '• Impairment of short- and long-term memory',
        '• Impaired judgment',
        '• Impaired abstract thinking',
        '• Disturbances of motivation and mood',
        '• Difficulty in establishing and maintaining effective work and social relationships',
      ],
    },
    {
      percent: 30,
      summary: 'Occupational and social impairment with occasional decrease in work efficiency',
      criteria: {
        level: 'mild-to-moderate',
        functionalImpairment: 'intermittent',
      },
      criteriaDescription: [
        'Occupational and social impairment with occasional decrease in work efficiency',
        'Intermittent periods of inability to perform occupational tasks',
        '(Generally functioning satisfactorily with routine behavior, self-care, and conversation normal)',
        'Due to symptoms such as:',
        '• Depressed mood, anxiety, suspiciousness',
        '• Panic attacks (weekly or less often)',
        '• Chronic sleep impairment',
        '• Mild memory loss (forgetting names, directions, recent events)',
      ],
    },
    {
      percent: 10,
      summary: 'Occupational and social impairment due to mild or transient symptoms',
      criteria: {
        level: 'mild',
        functionalImpairment: 'minimal',
      },
      criteriaDescription: [
        'Occupational and social impairment due to mild or transient symptoms which:',
        '• Decrease work efficiency and ability to perform tasks only during significant stress',
        'OR',
        '• Symptoms controlled by continuous medication',
      ],
    },
    {
      percent: 0,
      summary: 'Mental condition formally diagnosed, but symptoms not severe enough to interfere',
      criteria: {
        level: 'minimal-none',
        functionalImpairment: 'none',
      },
      criteriaDescription: [
        'A mental condition has been formally diagnosed, but symptoms are not severe enough either to:',
        '• Interfere with occupational and social functioning',
        'OR',
        '• Require continuous medication',
      ],
    },
  ],

  definitions: {
    generalRatingFormula: {
      term: 'General Rating Formula for Mental Disorders',
      definition: 'All mental health conditions are rated based on level of functional impairment in occupational and social settings, not just by counting symptoms. The VA considers frequency, severity, duration of symptoms, and capacity for adjustment.',
    },
    occupationalImpairment: {
      term: 'Occupational Impairment',
      definition: 'Difficulty maintaining employment, reduced productivity, problems with attendance, inability to complete tasks, or difficulty working with others.',
    },
    socialImpairment: {
      term: 'Social Impairment',
      definition: 'Difficulty maintaining relationships, social isolation, problems with family interactions, inability to participate in social activities, or inappropriate social behavior.',
    },
    suicidalIdeation: {
      term: 'Suicidal Ideation',
      definition: 'Thoughts about suicide or self-harm. This is a serious symptom requiring immediate professional attention. If experiencing suicidal thoughts, call the Veterans Crisis Line: 988 then Press 1.',
    },
  },

  importantNotes: [
    'Mental health ratings are based on overall functional impairment, not symptom count',
    'The VA considers how symptoms affect work and social functioning',
    'Higher ratings require persistent symptoms, not just occasional episodes',
    'Medical documentation from mental health providers is critical',
    'Treatment records should demonstrate consistency of symptoms over time',
    'A formal diagnosis from a qualified provider is required',
  ],
};

// ============================================
// PTSD RATING CRITERIA (DC 9411)
// ============================================
// PTSD is rated using the General Rating Formula for Mental Disorders
// Focus is on occupational and social impairment, not just symptom frequency

export const PTSD_CRITERIA = {
  diagnosticCode: '9411',
  condition: 'Posttraumatic Stress Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9411',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,

  // PTSD-specific ratings reference shared criteria
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings.map(rating => ({
    ...rating,
    evidenceNeeded: getPTSDEvidenceNeeded(rating.percent),
    gaps: getPTSDGaps(rating.percent),
  })),

  // PTSD-specific definitions (in addition to shared ones)
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    panicAttack: {
      term: 'Panic Attack',
      definition: 'A discrete period of intense fear or discomfort with physical symptoms such as rapid heartbeat, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, or fear of losing control.',
    },
  },

  secondaryConditions: {
    description: 'PTSD commonly causes or aggravates other conditions. Mental health secondary conditions require nexus showing the condition developed or worsened due to PTSD symptoms.',

    categories: {
      mentalHealth: {
        name: 'Mental Health Secondaries',
        conditions: [
          {
            manifestation: 'Major Depressive Disorder',
            suggestedDCs: ['9434'],
            dcDescriptions: ['Major depressive disorder'],
            nexusStrength: 'strong',
            notes: 'Depression commonly co-occurs with PTSD. May be rated separately or together.',
            documentationTips: ['Mental health records showing both diagnoses', 'PHQ-9 scores', 'Document functional impairment from each'],
          },
          {
            manifestation: 'Generalized Anxiety Disorder',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Generalized anxiety disorder'],
            nexusStrength: 'strong',
            notes: 'Anxiety often develops secondary to PTSD hypervigilance.',
            documentationTips: ['GAD-7 scores', 'Treatment records', 'Document how PTSD symptoms trigger anxiety'],
          },
          {
            manifestation: 'Panic Disorder',
            suggestedDCs: ['9412'],
            dcDescriptions: ['Panic disorder'],
            nexusStrength: 'moderate',
            notes: 'Panic attacks may develop from PTSD triggers.',
            documentationTips: ['Document panic attack frequency', 'Identify PTSD-related triggers', 'Treatment records'],
          },
          {
            manifestation: 'Substance Use Disorder',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Rate based on residuals after treatment'],
            nexusStrength: 'moderate',
            notes: 'Self-medication for PTSD symptoms. Document treatment and any residual conditions.',
            documentationTips: ['Treatment records', 'Document onset relative to PTSD', 'Any residual conditions from substance use'],
          },
        ],
      },

      sleep: {
        name: 'Sleep Disorders',
        conditions: [
          {
            manifestation: 'Insomnia',
            suggestedDCs: ['9400'],
            dcDescriptions: ['Rate under mental health formula or sleep study if applicable'],
            nexusStrength: 'strong',
            notes: 'Sleep disturbance is a core PTSD symptom but can be rated separately if severe.',
            documentationTips: ['Sleep study if performed', 'Document sleep patterns', 'Treatment records'],
          },
          {
            manifestation: 'Sleep Apnea',
            suggestedDCs: ['6847'],
            dcDescriptions: ['Sleep apnea syndromes'],
            nexusStrength: 'moderate',
            notes: 'Studies show PTSD increases sleep apnea risk. Document weight changes, sleep study.',
            documentationTips: ['Sleep study showing OSA', 'Document weight gain from PTSD medications', 'Medical literature supporting connection'],
          },
        ],
      },

      cardiovascular: {
        name: 'Cardiovascular Conditions',
        conditions: [
          {
            manifestation: 'Hypertension',
            suggestedDCs: ['7101'],
            dcDescriptions: ['Hypertensive vascular disease'],
            nexusStrength: 'moderate',
            notes: 'Chronic stress from PTSD can contribute to hypertension.',
            documentationTips: ['Blood pressure logs', 'Document stress response patterns', 'Cardiology evaluation'],
          },
          {
            manifestation: 'Coronary Artery Disease',
            suggestedDCs: ['7005'],
            dcDescriptions: ['Arteriosclerotic heart disease'],
            nexusStrength: 'moderate',
            notes: 'Research shows PTSD increases cardiac disease risk.',
            documentationTips: ['Cardiac workup', 'Medical literature', 'Timeline documentation'],
          },
        ],
      },

      gastrointestinal: {
        name: 'Gastrointestinal Conditions',
        conditions: [
          {
            manifestation: 'Irritable Bowel Syndrome (IBS)',
            suggestedDCs: ['7319'],
            dcDescriptions: ['Irritable colon syndrome'],
            nexusStrength: 'strong',
            notes: 'Strong gut-brain connection. IBS commonly secondary to PTSD.',
            documentationTips: ['GI specialist records', 'Document symptom onset relative to PTSD', 'Food diary'],
          },
          {
            manifestation: 'GERD',
            suggestedDCs: ['7346'],
            dcDescriptions: ['Hiatal hernia'],
            nexusStrength: 'moderate',
            notes: 'Stress-related GI symptoms common with PTSD.',
            documentationTips: ['GI evaluation', 'Endoscopy if performed', 'Medication records'],
          },
        ],
      },

      musculoskeletal: {
        name: 'Musculoskeletal Conditions',
        conditions: [
          {
            manifestation: 'Chronic Pain Syndrome',
            suggestedDCs: ['5025', '5237'],
            dcDescriptions: ['Fibromyalgia', 'Lumbosacral strain'],
            nexusStrength: 'moderate',
            notes: 'Central sensitization from chronic PTSD can cause widespread pain.',
            documentationTips: ['Pain specialist evaluation', 'Document pain patterns', 'Tender point examination'],
          },
          {
            manifestation: 'Tension Headaches/Migraines',
            suggestedDCs: ['8100'],
            dcDescriptions: ['Migraine'],
            nexusStrength: 'moderate',
            notes: 'Stress and tension from PTSD can cause or worsen headaches.',
            documentationTips: ['Headache diary', 'Neurology evaluation', 'Document stress triggers'],
          },
        ],
      },
    },

    importantNotes: [
      'Mental health conditions are often rated together under one rating - discuss with VSO',
      'Some conditions may not get separate rating due to pyramiding rules',
      'Document how PTSD specifically causes or worsens each secondary condition',
      'Get treating mental health provider to write nexus letter',
      'Keep detailed symptom logs showing connections between conditions',
    ],
  },


  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// Helper function for PTSD evidence needed
function getPTSDEvidenceNeeded(percent) {
  const evidenceMap = {
    100: [
      'Medical documentation of severe functional impairment',
      'Treatment records showing persistence of severe symptoms',
      'Evidence of inability to maintain employment',
      'Documentation of impact on self-care and daily activities',
      'Mental health provider statements on level of impairment',
      'Hospitalization records if applicable',
    ],
    70: [
      'Medical records documenting specific symptoms from criteria list',
      'Treatment records showing frequency and severity of symptoms',
      'Documentation of work difficulties or inability to maintain employment',
      'Evidence of relationship problems or social isolation',
      'Mental health provider statements on functional limitations',
      'Logged symptoms showing pattern of severe impairment',
    ],
    50: [
      'Documentation of panic attacks (weekly or more frequent)',
      'Medical records noting memory, judgment, or cognitive issues',
      'Evidence of reduced work productivity',
      'Treatment records showing consistent symptom pattern',
      'Statements from providers about functional limitations',
      'Logged symptoms demonstrating frequency and impact',
    ],
    30: [
      'Medical documentation of PTSD diagnosis',
      'Treatment records showing ongoing symptoms',
      'Documentation of occasional work difficulties',
      'Evidence of panic attacks (up to weekly)',
      'Sleep logs showing chronic impairment',
      'Provider statements on functional impact',
    ],
    10: [
      'Medical documentation of PTSD diagnosis',
      'Treatment records',
      'Medication management records',
      'Documentation that symptoms are mild or medication-controlled',
    ],
    0: ['Formal diagnosis documentation'],
  };
  return evidenceMap[percent] || [];
}

// Helper function for PTSD documentation gaps
function getPTSDGaps(percent) {
  const gapsMap = {
    100: {
      treatmentRecords: 'Regular mental health treatment records documenting severity',
      functionalAssessment: 'Detailed assessment of work and social functioning limitations',
      persistentSymptoms: 'Documentation showing symptoms are persistent, not episodic',
    },
    70: {
      specificSymptoms: 'Document which specific symptoms from the criteria are present',
      workImpact: 'Evidence of how symptoms affect work performance',
      socialImpact: 'Documentation of relationship and social functioning difficulties',
      continuity: 'Continuous treatment records showing persistent symptoms',
    },
    50: {
      panicFrequency: 'Log panic attacks to show they occur more than once weekly',
      cognitiveIssues: 'Document memory, concentration, or judgment difficulties',
      workReliability: 'Evidence of reduced productivity or attendance issues',
      relationshipImpact: 'Documentation of difficulty maintaining relationships',
    },
    30: {
      diagnosis: 'Formal PTSD diagnosis from qualified mental health provider',
      treatment: 'Regular mental health treatment records',
      sleepImpact: 'Consistent logging of sleep disturbances',
      workImpact: 'Documentation of occasional work performance issues',
    },
    10: {
      diagnosis: 'Formal PTSD diagnosis documentation',
      treatment: 'Ongoing treatment or medication management records',
    },
    0: {},
  };
  return gapsMap[percent] || {};
}

// ============================================
// MAJOR DEPRESSIVE DISORDER CRITERIA (DC 9434)
// ============================================

export const MAJOR_DEPRESSION_CRITERIA = {
  diagnosticCode: '9434',
  condition: 'Major Depressive Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9434',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// GENERALIZED ANXIETY DISORDER CRITERIA (DC 9400)
// ============================================

export const GENERALIZED_ANXIETY_CRITERIA = {
  diagnosticCode: '9400',
  condition: 'Generalized Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9400',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// PANIC DISORDER CRITERIA (DC 9412)
// ============================================

export const PANIC_DISORDER_CRITERIA = {
  diagnosticCode: '9412',
  condition: 'Panic Disorder and/or Agoraphobia',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9412',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    panicAttack: {
      term: 'Panic Attack',
      definition: 'A discrete period of intense fear or discomfort with physical symptoms such as rapid heartbeat, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, or fear of losing control.',
    },
    agoraphobia: {
      term: 'Agoraphobia',
      definition: 'Fear or anxiety about situations where escape might be difficult or help unavailable if panic symptoms occur. Often leads to avoidance of places like crowds, public transportation, or open spaces.',
    },
  },
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// BIPOLAR DISORDER CRITERIA (DC 9432)
// ============================================

export const BIPOLAR_CRITERIA = {
  diagnosticCode: '9432',
  condition: 'Bipolar Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9432',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    manicEpisode: {
      term: 'Manic Episode',
      definition: 'A distinct period of abnormally and persistently elevated, expansive, or irritable mood and increased energy, lasting at least one week, causing significant impairment in functioning.',
    },
    depressiveEpisode: {
      term: 'Depressive Episode',
      definition: 'A period of depressed mood or loss of interest/pleasure in activities, along with other symptoms like sleep changes, energy loss, or concentration difficulties, lasting at least two weeks.',
    },
  },
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// SOCIAL ANXIETY DISORDER CRITERIA (DC 9403)
// ============================================

export const SOCIAL_ANXIETY_CRITERIA = {
  diagnosticCode: '9403',
  condition: 'Social Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9403',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    socialAnxiety: {
      term: 'Social Anxiety',
      definition: 'Marked fear or anxiety about social situations where the individual may be scrutinized by others, leading to avoidance or endured with intense distress.',
    },
    performanceAnxiety: {
      term: 'Performance Anxiety',
      definition: 'Fear specifically related to performing or being observed during activities like public speaking, eating, or writing in front of others.',
    },
  },
  importantNotes: MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
};

// ============================================
// OBSESSIVE-COMPULSIVE DISORDER CRITERIA (DC 9404)
// ============================================

export const OCD_CRITERIA = {
  diagnosticCode: '9404',
  condition: 'Obsessive-Compulsive Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9404',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    obsessions: {
      term: 'Obsessions',
      definition: 'Recurrent, persistent, intrusive thoughts, urges, or images that cause marked anxiety or distress. The individual attempts to ignore, suppress, or neutralize them.',
    },
    compulsions: {
      term: 'Compulsions',
      definition: 'Repetitive behaviors or mental acts performed in response to obsessions or according to rigid rules, aimed at reducing anxiety or preventing a dreaded event.',
    },
    rituals: {
      term: 'Rituals',
      definition: 'Repetitive, stereotyped behaviors that interfere with routine activities. VA criteria specifically note "obsessional rituals which interfere with routine activities" as a 70% criterion.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'OCD rituals that interfere with routine activities are specifically mentioned in the 70% criteria',
    'Time spent on obsessions/compulsions is important documentation',
  ],
};

// ============================================
// PERSISTENT DEPRESSIVE DISORDER (DYSTHYMIA) CRITERIA (DC 9433)
// ============================================

export const PERSISTENT_DEPRESSIVE_CRITERIA = {
  diagnosticCode: '9433',
  condition: 'Persistent Depressive Disorder (Dysthymia)',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9433',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    dysthymia: {
      term: 'Dysthymia/Persistent Depressive Disorder',
      definition: 'Chronic depressed mood occurring more days than not for at least 2 years. Less severe than major depression but more chronic and persistent.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Dysthymia is characterized by chronic, persistent symptoms rather than discrete episodes',
    'Documentation showing consistent symptoms over 2+ years strengthens claims',
  ],
};

// ============================================
// CHRONIC ADJUSTMENT DISORDER CRITERIA (DC 9440)
// ============================================

export const ADJUSTMENT_DISORDER_CRITERIA = {
  diagnosticCode: '9440',
  condition: 'Chronic Adjustment Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9440',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    adjustmentDisorder: {
      term: 'Adjustment Disorder',
      definition: 'Emotional or behavioral symptoms in response to an identifiable stressor, occurring within 3 months of the stressor. Symptoms are clinically significant and out of proportion to the stressor.',
    },
    chronicAdjustment: {
      term: 'Chronic Adjustment Disorder',
      definition: 'Adjustment disorder lasting 6 months or longer after the stressor or its consequences have ended. Often service-connected due to ongoing adjustment to post-military life.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Chronic adjustment disorder persists 6+ months after stressor',
    'Common in Veterans adjusting to civilian life or dealing with service-related changes',
  ],
};

// ============================================
// UNSPECIFIED ANXIETY DISORDER CRITERIA (DC 9413)
// ============================================

export const UNSPECIFIED_ANXIETY_CRITERIA = {
  diagnosticCode: '9413',
  condition: 'Unspecified Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9413',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Used when anxiety symptoms are present but do not meet full criteria for a specific anxiety disorder',
    'Rated using the same General Rating Formula as other anxiety disorders',
  ],
};

// ============================================
// UNSPECIFIED DEPRESSIVE DISORDER CRITERIA (DC 9435)
// ============================================

export const UNSPECIFIED_DEPRESSIVE_CRITERIA = {
  diagnosticCode: '9435',
  condition: 'Unspecified Depressive Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9435',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Used when depressive symptoms are present but do not meet full criteria for a specific depressive disorder',
    'Rated using the same General Rating Formula as other depressive disorders',
  ],
};

// ============================================
// LUMBOSACRAL STRAIN / LOW BACK PAIN (DC 5237)
// ============================================

export const SOMATIC_SYMPTOM_DISORDER_CRITERIA = {
  diagnosticCode: '9421',
  condition: 'Somatic Symptom Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9421',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    somaticSymptomDisorder: {
      term: 'Somatic Symptom Disorder',
      definition: 'One or more somatic symptoms that are distressing or result in significant disruption of daily life, with excessive thoughts, feelings, or behaviors related to the somatic symptoms.',
    },
    healthAnxiety: {
      term: 'Health Anxiety',
      definition: 'Excessive worry and preoccupation with having or acquiring a serious illness, despite medical reassurance.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Focus is on psychological response to physical symptoms, not the physical symptoms themselves',
    'Document frequency of medical visits and how symptoms affect daily functioning',
    'Time spent worrying about health is key evidence',
  ],
};

// ============================================
// OTHER SPECIFIED SOMATIC SYMPTOM DISORDER CRITERIA (DC 9422)
// ============================================

export const OTHER_SPECIFIED_SOMATIC_CRITERIA = {
  diagnosticCode: '9422',
  condition: 'Other Specified Somatic Symptom and Related Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9422',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: SOMATIC_SYMPTOM_DISORDER_CRITERIA.definitions,
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Used when somatic symptoms cause distress but do not meet full criteria for specific somatic disorder',
    'Rated using the same General Rating Formula as other mental disorders',
  ],
};

// ============================================
// UNSPECIFIED SOMATIC SYMPTOM DISORDER CRITERIA (DC 9423)
// ============================================

export const UNSPECIFIED_SOMATIC_CRITERIA = {
  diagnosticCode: '9423',
  condition: 'Unspecified Somatic Symptom and Related Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9423',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: SOMATIC_SYMPTOM_DISORDER_CRITERIA.definitions,
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Used when somatic symptoms are present but do not meet full criteria for a specific disorder',
    'Rated using the same General Rating Formula',
  ],
};

// ============================================
// ILLNESS ANXIETY DISORDER CRITERIA (DC 9425)
// ============================================

export const ILLNESS_ANXIETY_CRITERIA = {
  diagnosticCode: '9425',
  condition: 'Illness Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9425',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    illnessAnxiety: {
      term: 'Illness Anxiety Disorder',
      definition: 'Preoccupation with having or acquiring a serious illness. Somatic symptoms are not present or are only mild. High level of health anxiety and excessive health-related behaviors.',
    },
    bodySurveillance: {
      term: 'Body Surveillance',
      definition: 'Excessive self-examination and monitoring of the body for signs of illness, often leading to increased anxiety.',
    },
    reassuranceSeeking: {
      term: 'Reassurance Seeking',
      definition: 'Repeatedly seeking medical evaluations, diagnostic tests, or reassurance from doctors despite negative results.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Different from Somatic Symptom Disorder - minimal physical symptoms present',
    'Focus is on anxiety about having illness despite medical evidence to contrary',
    'Document frequency of doctor visits, tests requested, and reassurance seeking',
  ],
};

// ============================================
// OTHER SPECIFIED ANXIETY DISORDER CRITERIA (DC 9410)
// ============================================

export const OTHER_SPECIFIED_ANXIETY_CRITERIA = {
  diagnosticCode: '9410',
  condition: 'Other Specified Anxiety Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9410',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: MENTAL_HEALTH_SHARED_CRITERIA.definitions,
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Used when anxiety symptoms cause distress but do not meet full criteria for specific anxiety disorder',
    'Rated using the same General Rating Formula as other anxiety disorders',
  ],
};

// ============================================
// DEPERSONALIZATION/DEREALIZATION DISORDER CRITERIA (DC 9417)
// ============================================

export const DEPERSONALIZATION_DEREALIZATION_CRITERIA = {
  diagnosticCode: '9417',
  condition: 'Depersonalization/Derealization Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9417',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    depersonalization: {
      term: 'Depersonalization',
      definition: 'Experiences of unreality, detachment, or being an outside observer with respect to one\'s thoughts, feelings, sensations, body, or actions (e.g., feeling like a robot, in a dream, or on autopilot).',
    },
    derealization: {
      term: 'Derealization',
      definition: 'Experiences of unreality or detachment with respect to surroundings (e.g., individuals or objects are experienced as unreal, dreamlike, foggy, lifeless, or visually distorted).',
    },
    realityTesting: {
      term: 'Reality Testing',
      definition: 'The ability to distinguish reality from fantasy. In depersonalization/derealization, reality testing remains intact - the person knows the feelings are not real.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Reality testing remains intact - person knows experiences are not real',
    'Document frequency and duration of episodes',
    'Track impact on daily functioning and relationships',
    'Different from psychosis - no delusions or hallucinations',
  ],
};

// ============================================
// CYCLOTHYMIC DISORDER CRITERIA (DC 9431)
// ============================================

export const CYCLOTHYMIC_CRITERIA = {
  diagnosticCode: '9431',
  condition: 'Cyclothymic Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9431',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    cyclothymia: {
      term: 'Cyclothymic Disorder',
      definition: 'A chronic fluctuating mood disturbance with numerous periods of hypomanic symptoms and depressive symptoms for at least 2 years. Less severe than bipolar disorder but persistent.',
    },
    hypomanicSymptoms: {
      term: 'Hypomanic Symptoms',
      definition: 'Elevated mood, increased activity or energy that is clearly different from normal but not as severe as full mania. Does not cause marked impairment.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Chronic mood instability for at least 2 years',
    'Less severe than Bipolar Disorder but more persistent',
    'Document pattern of mood swings over time',
    'Track impact on work, relationships, and daily functioning',
  ],
};

// ============================================
// EATING DISORDERS - SPECIAL RATING FORMULA
// Different from General Mental Health Rating Formula
// Based on weight loss and incapacitating episodes
// ============================================

// ============================================
// ANOREXIA NERVOSA CRITERIA (DC 9520)
// ============================================

export const ANOREXIA_NERVOSA_CRITERIA = {
  diagnosticCode: '9520',
  condition: 'Anorexia Nervosa',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9520',
  usesSharedCriteria: false, // SPECIAL RATING FORMULA

  ratingFormula: 'General Rating Formula for Eating Disorders',

  ratings: [
    {
      percent: 100,
      criteria: [
        'Self-induced weight loss to less than 80% of expected minimum weight',
        'Incapacitating episodes of at least 6 weeks total duration per year',
        'Requiring hospitalization more than twice a year for parenteral nutrition or tube feeding',
      ],
      description: 'Severe, life-threatening weight loss with frequent hospitalizations',
    },
    {
      percent: 60,
      criteria: [
        'Self-induced weight loss to less than 85% of expected minimum weight',
        'Incapacitating episodes of 6 or more weeks total duration per year',
      ],
      description: 'Severe weight loss with extended incapacitating episodes',
    },
    {
      percent: 30,
      criteria: [
        'Self-induced weight loss to less than 85% of expected minimum weight',
        'Incapacitating episodes of more than 2 but less than 6 weeks total duration per year',
      ],
      description: 'Significant weight loss with moderate incapacitating episodes',
    },
    {
      percent: 10,
      criteria: [
        'Binge eating followed by self-induced vomiting or other measures to prevent weight gain',
        'OR resistance to weight gain even when below expected minimum weight',
        'With diagnosis of an eating disorder but without incapacitating episodes',
      ],
      description: 'Eating disorder behaviors present but minimal incapacitation',
    },
    {
      percent: 0,
      criteria: [
        'Diagnosed eating disorder in remission with no current symptoms',
      ],
      description: 'Diagnosis established but currently asymptomatic',
    },
  ],

  definitions: {
    incapacitatingEpisode: {
      term: 'Incapacitating Episode',
      definition: 'A period during which bed rest and treatment by a physician are required. This is different from outpatient treatment or counseling.',
    },
    expectedMinimumWeight: {
      term: 'Expected Minimum Weight',
      definition: 'The minimum healthy weight for a person\'s height, age, and sex based on medical standards (typically BMI of 18.5 or above).',
    },
    parenteralNutrition: {
      term: 'Parenteral Nutrition',
      definition: 'Intravenous feeding - nutrition delivered directly into the bloodstream when oral intake is inadequate.',
    },
    tubeFeeding: {
      term: 'Tube Feeding',
      definition: 'Nasogastric or gastric tube feeding when unable or unwilling to consume adequate nutrition orally.',
    },
    selfInducedWeightLoss: {
      term: 'Self-Induced Weight Loss',
      definition: 'Weight loss through deliberate restriction of food intake, purging, excessive exercise, or other compensatory behaviors.',
    },
  },

  importantNotes: [
    'Eating disorders use a DIFFERENT rating formula than other mental health conditions',
    'Focus on weight loss percentage and incapacitating episodes requiring bed rest/hospitalization',
    'An "incapacitating episode" requires bed rest and physician treatment - not just therapy',
    'Document actual weight vs. expected minimum weight for height/age/sex',
    'Track hospitalizations, tube feeding, and parenteral nutrition',
    'Medical records showing weight, treatment, and hospitalizations are critical',
  ],
};

// ============================================
// BULIMIA NERVOSA CRITERIA (DC 9521)
// ============================================

export const BULIMIA_NERVOSA_CRITERIA = {
  diagnosticCode: '9521',
  condition: 'Bulimia Nervosa',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9521',
  usesSharedCriteria: false, // SPECIAL RATING FORMULA

  ratingFormula: 'General Rating Formula for Eating Disorders',

  ratings: ANOREXIA_NERVOSA_CRITERIA.ratings, // Same rating scale as anorexia

  definitions: {
    ...ANOREXIA_NERVOSA_CRITERIA.definitions,
    bingeEating: {
      term: 'Binge Eating',
      definition: 'Eating an abnormally large amount of food in a discrete period of time with a sense of lack of control over eating during the episode.',
    },
    purging: {
      term: 'Purging',
      definition: 'Self-induced vomiting or misuse of laxatives, diuretics, or enemas to prevent weight gain after binge eating.',
    },
    compensatoryBehaviors: {
      term: 'Compensatory Behaviors',
      definition: 'Behaviors used to prevent weight gain from binge eating, including fasting, excessive exercise, or misuse of medications.',
    },
  },

  importantNotes: [
    'Bulimia uses the SAME special rating formula as Anorexia - not the general mental health formula',
    'Focus on binge-purge cycles and weight-control behaviors',
    'Document frequency of binge/purge episodes',
    'Track incapacitating episodes requiring bed rest and physician treatment',
    'Weight may be normal or above normal, unlike anorexia',
    'Medical complications from purging should be documented separately',
  ],
};

// SCHIZOPHRENIA CRITERIA (DC 9201)
// ============================================

export const SCHIZOPHRENIA_CRITERIA = {
  diagnosticCode: '9201',
  condition: 'Schizophrenia',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9201',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    positiveSymptoms: {
      term: 'Positive Symptoms',
      definition: 'Symptoms that represent an excess or distortion of normal functions: hallucinations, delusions, disorganized speech, disorganized/catatonic behavior.',
    },
    negativeSymptoms: {
      term: 'Negative Symptoms',
      definition: 'Symptoms that represent a diminution or loss of normal functions: flat affect, alogia (poverty of speech), avolition (lack of motivation), anhedonia (inability to feel pleasure), social withdrawal.',
    },
    hallucinations: {
      term: 'Hallucinations',
      definition: 'Perception-like experiences without external stimulus. Most common in schizophrenia are auditory (hearing voices), but can also be visual, tactile, olfactory, or gustatory.',
    },
    delusions: {
      term: 'Delusions',
      definition: 'Fixed false beliefs not shared by others in the same culture. Common types: persecutory (being harmed), grandiose (special powers), referential (messages directed at person), somatic (about body).',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Schizophrenia typically requires hospitalization during acute episodes - document all hospitalizations',
    'Persistent hallucinations or delusions are specifically mentioned in 100% criteria',
    'Grossly inappropriate behavior is a 100% indicator',
    'Continuous medication is often necessary - document compliance and side effects',
    'Track both positive symptoms (hallucinations, delusions) and negative symptoms (flat affect, withdrawal)',
  ],
};

// ============================================
// SCHIZOAFFECTIVE DISORDER CRITERIA (DC 9202)
// ============================================

export const SCHIZOAFFECTIVE_DISORDER_CRITERIA = {
  diagnosticCode: '9202',
  condition: 'Schizoaffective Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9202',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    schizoaffective: {
      term: 'Schizoaffective Disorder',
      definition: 'A condition combining symptoms of schizophrenia (hallucinations, delusions) with mood disorder symptoms (depression or mania). Must have psychotic symptoms independent of mood episodes.',
    },
    moodEpisode: {
      term: 'Mood Episode',
      definition: 'Period of major depression, mania, or mixed features that occurs alongside psychotic symptoms in schizoaffective disorder.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Schizoaffective combines features of both schizophrenia and mood disorders',
    'Document both psychotic symptoms AND mood episodes (depression or mania)',
    'Treatment typically requires both antipsychotics and mood stabilizers',
  ],
};

// ============================================
// DELUSIONAL DISORDER CRITERIA (DC 9203)
// ============================================

export const DELUSIONAL_DISORDER_CRITERIA = {
  diagnosticCode: '9203',
  condition: 'Delusional Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9203',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    delusionalDisorder: {
      term: 'Delusional Disorder',
      definition: 'Persistent delusions without other psychotic symptoms. Person functions relatively normally except in areas affected by the delusion.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Characterized by persistent delusions without hallucinations or other schizophrenia symptoms',
    'Functional impairment may be limited to areas directly affected by the delusion',
    'Document how delusions impact occupational and social functioning',
  ],
};

// ============================================
// PSYCHOTIC DISORDER NOS CRITERIA (DC 9204)
// ============================================

export const PSYCHOTIC_DISORDER_NOS_CRITERIA = {
  diagnosticCode: '9204',
  condition: 'Psychotic Disorder NOS',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9204',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    nos: {
      term: 'NOS (Not Otherwise Specified)',
      definition: 'Used when psychotic symptoms are present but don\'t meet full criteria for a specific psychotic disorder.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Catch-all diagnosis for psychotic symptoms that don\'t fit other categories',
    'Document all psychotic symptoms and their functional impact',
  ],
};

// ============================================
// BRIEF PSYCHOTIC DISORDER CRITERIA (DC 9205)
// ============================================

export const BRIEF_PSYCHOTIC_DISORDER_CRITERIA = {
  diagnosticCode: '9205',
  condition: 'Brief Psychotic Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9205',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    briefPsychotic: {
      term: 'Brief Psychotic Disorder',
      definition: 'Psychotic symptoms lasting at least 1 day but less than 1 month, with eventual full return to normal functioning.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Duration is key: symptoms last less than 1 month',
    'If symptoms persist beyond 1 month, diagnosis may change to schizophreniform or schizophrenia',
    'Document episode frequency, duration, and recovery between episodes',
    'Multiple episodes may warrant higher ratings',
  ],
};

// ============================================
// BINGE EATING DISORDER CRITERIA (DC 9520)
// ============================================

export const BINGE_EATING_DISORDER_CRITERIA = {
  diagnosticCode: '9520',
  condition: 'Binge Eating Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9520',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    bingeEating: {
      term: 'Binge Eating',
      definition: 'Eating significantly more food than most people would in a similar period, with a sense of lack of control over eating during the episode.',
    },
    lossOfControl: {
      term: 'Loss of Control',
      definition: 'Feeling unable to stop eating or control what or how much one is eating during a binge episode.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Unlike anorexia/bulimia, binge eating disorder typically involves weight GAIN, not loss',
    'NO compensatory behaviors (purging, excessive exercise) - this distinguishes it from bulimia',
    'Frequency matters: episodes typically occur at least once weekly for 3 months',
    'Document obesity-related health complications (diabetes, hypertension, sleep apnea)',
    'Marked distress about binge eating is a key diagnostic criterion',
  ],
};

// ============================================
// DISSOCIATIVE IDENTITY DISORDER CRITERIA (DC 9416)
// ============================================

export const DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA = {
  diagnosticCode: '9416',
  condition: 'Dissociative Identity Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9416',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    dissociativeIdentity: {
      term: 'Dissociative Identity Disorder (DID)',
      definition: 'Formerly Multiple Personality Disorder. Characterized by two or more distinct personality states with gaps in recall of everyday events, personal information, and/or traumatic events.',
    },
    identitySwitching: {
      term: 'Identity Switching',
      definition: 'Transition from one personality state to another, often accompanied by changes in behavior, voice, mannerisms, and memory.',
    },
    dissociativeAmnesia: {
      term: 'Dissociative Amnesia',
      definition: 'Inability to recall important autobiographical information, usually of a traumatic or stressful nature, inconsistent with ordinary forgetting.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Often co-occurs with PTSD due to trauma history',
    'Document identity switching episodes, amnesia periods, and impact on functioning',
    'Memory gaps for time periods and important events are key evidence',
    'Track number of identities and their characteristics if disclosed in therapy',
  ],
};

// ============================================
// DISSOCIATIVE AMNESIA CRITERIA (DC 9417)
// ============================================

export const DISSOCIATIVE_AMNESIA_CRITERIA = {
  diagnosticCode: '9417',
  condition: 'Dissociative Amnesia',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9417',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    dissociativeAmnesia: {
      term: 'Dissociative Amnesia',
      definition: 'Inability to recall important autobiographical information, usually traumatic or stressful, that is inconsistent with ordinary forgetting.',
    },
    fugueState: {
      term: 'Dissociative Fugue',
      definition: 'A subtype of dissociative amnesia involving sudden, unexpected travel away from home with inability to recall one\'s past and confusion about identity.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Memory loss is for specific events, time periods, or autobiographical information',
    'Not due to substance use, medical condition, or normal forgetting',
    'Fugue states (if present) are particularly impairing - document thoroughly',
    'Document time periods of amnesia and any recovery of memories',
  ],
};

// ============================================
// ACUTE STRESS DISORDER CRITERIA (DC 9413)
// ============================================

export const ACUTE_STRESS_DISORDER_CRITERIA = {
  diagnosticCode: '9413',
  condition: 'Acute Stress Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9413',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    acuteStress: {
      term: 'Acute Stress Disorder',
      definition: 'Similar to PTSD but occurs within 3 days to 1 month after trauma exposure. If symptoms persist beyond 1 month, diagnosis typically changes to PTSD.',
    },
    dissociativeSymptoms: {
      term: 'Dissociative Symptoms in ASD',
      definition: 'Altered sense of reality, detachment, numbing, reduced awareness of surroundings, derealization, or depersonalization that occurs after trauma.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Timing is critical: occurs 3 days to 1 month after trauma',
    'If symptoms persist beyond 1 month, diagnosis becomes PTSD',
    'Document the traumatic stressor, onset of symptoms, and timeline',
    'Dissociative symptoms are prominent in acute stress disorder',
  ],
};

// ============================================
// ANTISOCIAL PERSONALITY DISORDER CRITERIA (DC 9301)
// ============================================

export const ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA = {
  diagnosticCode: '9301',
  condition: 'Antisocial Personality Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9301',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    antisocialPersonality: {
      term: 'Antisocial Personality Disorder',
      definition: 'Pattern of disregard for and violation of the rights of others, occurring since age 15. Characterized by deceitfulness, impulsivity, irritability, lack of remorse.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Document pattern of interpersonal conflicts and legal issues',
    'Employment history often shows frequent job changes or terminations',
    'Track treatment compliance - often poor in antisocial personality',
    'Focus documentation on occupational and social impairment',
  ],
};

// ============================================
// BORDERLINE PERSONALITY DISORDER CRITERIA (DC 9301)
// ============================================

export const BORDERLINE_PERSONALITY_DISORDER_CRITERIA = {
  diagnosticCode: '9301',
  condition: 'Borderline Personality Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9301',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    borderlinePersonality: {
      term: 'Borderline Personality Disorder',
      definition: 'Pattern of instability in interpersonal relationships, self-image, and emotions. Marked impulsivity, fear of abandonment, identity disturbance, and self-harm.',
    },
    fearOfAbandonment: {
      term: 'Fear of Abandonment',
      definition: 'Frantic efforts to avoid real or imagined abandonment, leading to impulsive actions or relationship instability.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Self-harm and suicidal behavior are common - document all incidents',
    'Hospitalization for safety is often necessary - track frequency',
    'Unstable relationships and fear of abandonment cause significant impairment',
    'Document identity disturbance and emotional instability',
    'Dialectical Behavior Therapy (DBT) is evidence-based treatment',
  ],
};

// ============================================
// NARCISSISTIC PERSONALITY DISORDER CRITERIA (DC 9301)
// ============================================

export const NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA = {
  diagnosticCode: '9301',
  condition: 'Narcissistic Personality Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9301',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    narcissisticPersonality: {
      term: 'Narcissistic Personality Disorder',
      definition: 'Pattern of grandiosity, need for admiration, and lack of empathy. Characterized by sense of entitlement, exploitative interpersonal relationships.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Document interpersonal conflicts and relationship failures',
    'Employment issues often stem from conflicts with authority or peers',
    'Lack of empathy causes significant social impairment',
    'Treatment compliance is often poor',
  ],
};

// ============================================
// AVOIDANT PERSONALITY DISORDER CRITERIA (DC 9301)
// ============================================

export const AVOIDANT_PERSONALITY_DISORDER_CRITERIA = {
  diagnosticCode: '9301',
  condition: 'Avoidant Personality Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9301',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,
  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,
  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    avoidantPersonality: {
      term: 'Avoidant Personality Disorder',
      definition: 'Pattern of social inhibition, feelings of inadequacy, and hypersensitivity to negative evaluation. Avoids social situations due to fear of criticism or rejection.',
    },
  },
  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Social avoidance causes significant occupational impairment',
    'May avoid job promotions or opportunities due to fear of increased social demands',
    'Relationship difficulties due to fear of rejection',
    'Document missed opportunities and social avoidance patterns',
  ],
};

// ============================================
// DEMENTIA / NEUROCOGNITIVE DISORDER (DC 9326)
// ============================================

export const DEMENTIA_CRITERIA = {
  diagnosticCode: '9326',
  condition: 'Dementia / Neurocognitive Disorder',
  cfrReference: '38 CFR 4.130, Diagnostic Code 9326',
  usesSharedCriteria: true,
  sharedCriteria: MENTAL_HEALTH_SHARED_CRITERIA,

  ratingNote: 'DC 9326 covers major or mild neurocognitive disorder due to another medical condition (e.g., Parkinson\'s, stroke, TBI) or substance/medication-induced neurocognitive disorder. Uses the General Rating Formula for Mental Disorders.',

  ratings: MENTAL_HEALTH_SHARED_CRITERIA.ratings,

  definitions: {
    ...MENTAL_HEALTH_SHARED_CRITERIA.definitions,
    neurocognitiveDisorder: {
      term: 'Neurocognitive Disorder',
      definition: 'DSM-5 term for conditions causing cognitive decline. "Major" indicates significant impairment affecting independence; "Mild" indicates modest decline not affecting independence.',
    },
    dementia: {
      term: 'Dementia',
      definition: 'Syndrome of progressive cognitive decline affecting memory, thinking, behavior, and ability to perform everyday activities. Multiple causes including Alzheimer\'s, vascular disease, Parkinson\'s, TBI.',
    },
    activitiesOfDailyLiving: {
      term: 'Activities of Daily Living (ADLs)',
      definition: 'Basic self-care tasks: bathing, dressing, eating, toileting, transferring, and continence. Difficulty with ADLs indicates significant impairment.',
    },
    instrumentalADLs: {
      term: 'Instrumental ADLs (IADLs)',
      definition: 'Complex daily activities: managing finances, medications, transportation, shopping, housework, using phone/technology. Often affected earlier than basic ADLs.',
    },
    sundowning: {
      term: 'Sundowning',
      definition: 'Pattern of increased confusion, agitation, or behavioral symptoms in late afternoon/evening, common in dementia.',
    },
  },

  secondaryConditions: {
    description: 'Dementia is often secondary to other service-connected conditions. The primary condition establishes the nexus.',
    commonPrimaries: [
      { condition: 'Parkinson\'s Disease', diagnosticCode: '8004', relationship: 'Parkinson\'s dementia occurs in up to 80% of patients over time' },
      { condition: 'Traumatic Brain Injury', diagnosticCode: '8045', relationship: 'TBI increases dementia risk; may be rated under DC 9304 instead' },
      { condition: 'ALS', diagnosticCode: '8017', relationship: 'ALS-FTD (frontotemporal dementia) occurs in subset of ALS patients' },
      { condition: 'Multiple Sclerosis', diagnosticCode: '8018', relationship: 'MS cognitive impairment can progress to dementia' },
      { condition: 'Stroke', diagnosticCode: '8007-8009', relationship: 'Vascular dementia from stroke damage' },
      { condition: 'PTSD', diagnosticCode: '9411', relationship: 'Chronic PTSD associated with increased dementia risk' },
      { condition: 'Diabetes', diagnosticCode: '7913', relationship: 'Diabetes increases vascular dementia risk' },
      { condition: 'Hypertension', diagnosticCode: '7101', relationship: 'Chronic hypertension increases vascular dementia risk' },
    ],
  },

  documentationTips: [
    'Document cognitive decline progression over time',
    'Track memory lapses, confusion episodes, and disorientation',
    'Note difficulty with daily activities (paying bills, medication management)',
    'Record personality or behavioral changes',
    'Document safety concerns (wandering, leaving stove on)',
    'Note supervision requirements',
    'Obtain neuropsychological testing for objective measures',
    'Document impact on social relationships',
    'Track incidents requiring caregiver intervention',
    'If secondary to another condition, document the relationship',
  ],

  importantNotes: [
    ...MENTAL_HEALTH_SHARED_CRITERIA.importantNotes,
    'Dementia due to TBI may be rated under DC 9304 instead of 9326',
    'If dementia is secondary to service-connected condition, nexus must be established',
    'Consider Aid & Attendance (SMC-L) if unable to perform ADLs',
    'Consider Housebound status (SMC-S) if substantially confined',
    'Multiple mental health conditions are typically rated together, not separately',
    'Caregiver statements are valuable evidence of functional impairment',
  ],

  disclaimer: 'This analysis is based on 38 CFR 4.130, DC 9326, using the General Rating Formula for Mental Disorders. Rating depends on level of occupational and social impairment, not just symptom presence. Dementia secondary to service-connected conditions requires nexus documentation. For documentation purposes only - the VA makes all final rating determinations.',
};

// ============================================
// PHASE 9: CARDIOVASCULAR CONDITIONS
// ============================================

// DC 7020: Cardiomyopathy

export const analyzePTSDLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'ptsd',
      MENTAL_HEALTH_CONDITIONS.PTSD.symptomIds,
      PTSD_CRITERIA,
      options,
  );
};

/**
 * Analyzes Major Depression symptom logs
 */

export const analyzeMajorDepressionLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'major-depression',
      MENTAL_HEALTH_CONDITIONS.MAJOR_DEPRESSION.symptomIds,
      MAJOR_DEPRESSION_CRITERIA,
      options,
  );
};

/**
 * Analyzes Generalized Anxiety Disorder symptom logs
 */

export const analyzeGeneralizedAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'generalized-anxiety',
      MENTAL_HEALTH_CONDITIONS.GENERALIZED_ANXIETY.symptomIds,
      GENERALIZED_ANXIETY_CRITERIA,
      options,
  );
};

/**
 * Analyzes Panic Disorder symptom logs
 */

export const analyzePanicDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'panic-disorder',
      MENTAL_HEALTH_CONDITIONS.PANIC_DISORDER.symptomIds,
      PANIC_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Bipolar Disorder symptom logs
 */

export const analyzeBipolarLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'bipolar',
      MENTAL_HEALTH_CONDITIONS.BIPOLAR.symptomIds,
      BIPOLAR_CRITERIA,
      options,
  );
};

/**
 * Analyzes Social Anxiety Disorder symptom logs
 */

export const analyzeSocialAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'social-anxiety',
      MENTAL_HEALTH_CONDITIONS.SOCIAL_ANXIETY.symptomIds,
      SOCIAL_ANXIETY_CRITERIA,
      options,
  );
};

/**
 * Analyzes OCD symptom logs
 */

export const analyzeOCDLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'ocd',
      MENTAL_HEALTH_CONDITIONS.OCD.symptomIds,
      OCD_CRITERIA,
      options,
  );
};

/**
 * Analyzes Persistent Depressive Disorder (Dysthymia) symptom logs
 */

export const analyzePersistentDepressiveLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'persistent-depressive',
      MENTAL_HEALTH_CONDITIONS.PERSISTENT_DEPRESSIVE.symptomIds,
      PERSISTENT_DEPRESSIVE_CRITERIA,
      options,
  );
};

/**
 * Analyzes Chronic Adjustment Disorder symptom logs
 */

export const analyzeAdjustmentDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'adjustment-disorder',
      MENTAL_HEALTH_CONDITIONS.ADJUSTMENT_DISORDER.symptomIds,
      ADJUSTMENT_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Unspecified Anxiety Disorder symptom logs
 */

export const analyzeUnspecifiedAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'unspecified-anxiety',
      MENTAL_HEALTH_CONDITIONS.UNSPECIFIED_ANXIETY.symptomIds,
      UNSPECIFIED_ANXIETY_CRITERIA,
      options,
  );
};

/**
 * Analyzes Unspecified Depressive Disorder symptom logs
 */

export const analyzeUnspecifiedDepressiveLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'unspecified-depressive',
      MENTAL_HEALTH_CONDITIONS.UNSPECIFIED_DEPRESSIVE.symptomIds,
      UNSPECIFIED_DEPRESSIVE_CRITERIA,
      options,
  );
};


// ============================================
// ANALYSIS FUNCTIONS - MUSCULOSKELETAL CONDITIONS
// ============================================

/**
 * Analyzes Lumbosacral Strain (Low Back Pain) logs
 * NOTE: This requires clinical ROM measurements - symptom logging alone cannot determine rating
 */

export const analyzeSomaticSymptomDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'somatic-symptom-disorder',
      MENTAL_HEALTH_CONDITIONS.SOMATIC_SYMPTOM_DISORDER.symptomIds,
      SOMATIC_SYMPTOM_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Other Specified Somatic Symptom Disorder logs
 */

export const analyzeOtherSpecifiedSomaticLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'other-specified-somatic',
      MENTAL_HEALTH_CONDITIONS.OTHER_SPECIFIED_SOMATIC.symptomIds,
      OTHER_SPECIFIED_SOMATIC_CRITERIA,
      options,
  );
};

/**
 * Analyzes Unspecified Somatic Symptom Disorder logs
 */

export const analyzeUnspecifiedSomaticLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'unspecified-somatic',
      MENTAL_HEALTH_CONDITIONS.UNSPECIFIED_SOMATIC.symptomIds,
      UNSPECIFIED_SOMATIC_CRITERIA,
      options,
  );
};

/**
 * Analyzes Illness Anxiety Disorder symptom logs
 */

export const analyzeIllnessAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'illness-anxiety',
      MENTAL_HEALTH_CONDITIONS.ILLNESS_ANXIETY.symptomIds,
      ILLNESS_ANXIETY_CRITERIA,
      options,
  );
};

/**
 * Analyzes Other Specified Anxiety Disorder logs
 */

export const analyzeOtherSpecifiedAnxietyLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'other-specified-anxiety',
      MENTAL_HEALTH_CONDITIONS.OTHER_SPECIFIED_ANXIETY.symptomIds,
      OTHER_SPECIFIED_ANXIETY_CRITERIA,
      options,
  );
};

/**
 * Analyzes Depersonalization/Derealization Disorder logs
 */

export const analyzeDepersonalizationLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'depersonalization-derealization',
      MENTAL_HEALTH_CONDITIONS.DEPERSONALIZATION_DEREALIZATION.symptomIds,
      DEPERSONALIZATION_DEREALIZATION_CRITERIA,
      options,
  );
};

/**
 * Analyzes Cyclothymic Disorder symptom logs
 */

export const analyzeCyclothymicLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'cyclothymic',
      MENTAL_HEALTH_CONDITIONS.CYCLOTHYMIC.symptomIds,
      CYCLOTHYMIC_CRITERIA,
      options,
  );
};

/**
 * Helper function to analyze eating disorder conditions
 * Uses SPECIAL RATING FORMULA based on weight loss and incapacitating episodes
 * Different from general mental health analysis
 */
const analyzeEatingDisorderCondition = (logs, conditionKey, symptomIds, criteria, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const conditionCriteria = criteria;

  // Filter logs for this condition's symptoms within evaluation period
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && symptomIds.includes(log.symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: conditionCriteria.condition,
      diagnosticCode: conditionCriteria.diagnosticCode,
      // Empty metrics for consistency
      metrics: {
        totalLogs: 0,
        avgSeverity: 0,
        severeSymptoms: 0,
        hospitalized: false,
        hospitalizationCount: 0,
        dangerToSelf: false,
        dangerToOthers: false,
      },
    };
  }

  // Eating disorder specific tracking
  const incapacitatingEpisodes = relevantLogs.filter(log =>
      log.symptomId.includes('incapacitating-episode')
  ).length;

  const hospitalizations = relevantLogs.filter(log =>
      log.symptomId.includes('hospitalization')
  ).length;

  const weightLossLogs = relevantLogs.filter(log =>
      log.symptomId.includes('weight-loss')
  );

  const bingeEpisodes = relevantLogs.filter(log =>
      log.symptomId.includes('binge-eating')
  ).length;

  const purgingEpisodes = relevantLogs.filter(log =>
      log.symptomId.includes('purging')
  ).length;

  // Build evidence array
  const evidence = [];
  if (incapacitatingEpisodes > 0) {
    evidence.push(`${incapacitatingEpisodes} incapacitating episode(s) documented`);
  }
  if (hospitalizations > 0) {
    evidence.push(`${hospitalizations} hospitalization(s) for tube/parenteral feeding`);
  }
  if (weightLossLogs.length > 0) {
    evidence.push(`Weight loss documented ${weightLossLogs.length} time(s)`);
  }
  if (bingeEpisodes > 0) {
    evidence.push(`${bingeEpisodes} binge eating episode(s) documented`);
  }
  if (purgingEpisodes > 0) {
    evidence.push(`${purgingEpisodes} purging episode(s) documented`);
  }

  evidence.push(`${relevantLogs.length} total eating disorder symptoms logged over ${evaluationPeriodDays} days`);

  // ===== CALCULATE METRICS FOR RATING CARD DISPLAY =====
  // Count logs with severity 8+ as severe episodes
  const severeSymptoms = relevantLogs.filter(log => log.severity >= 8).length;

  // Calculate average severity
  const logsWithSeverity = relevantLogs.filter(log => log.severity && log.severity > 0);
  const avgSeverity = logsWithSeverity.length > 0
      ? logsWithSeverity.reduce((sum, log) => sum + log.severity, 0) / logsWithSeverity.length
      : 0;

  // Check for hospitalization (eating disorders track this via symptom ID)
  const hospitalized = hospitalizations > 0;
  const hospitalizationCount = hospitalizations;

  // Check for danger indicators in notes
  const dangerToSelf = relevantLogs.some(log => {
    const notes = (log.notes || '').toLowerCase();
    return notes.includes('suicidal') || notes.includes('self-harm') || notes.includes('danger to self');
  });
  const dangerToOthers = false; // Less common in eating disorders

  return {
    hasData: true,
    condition: conditionCriteria.condition,
    diagnosticCode: conditionCriteria.diagnosticCode,
    evaluationPeriodDays,
    supportedRating: 'Requires Medical Evaluation',
    ratingRationale: [
      'Eating disorders are rated based on weight loss percentage and incapacitating episodes',
      'Medical records showing actual weight vs. expected minimum weight are required',
      'Hospitalizations for tube feeding or parenteral nutrition significantly impact rating',
      'Your symptom logs document eating disorder behaviors and episodes',
    ],
    assessmentLevel: 'Medical Evaluation Required',
    evidence,
    gaps: [
      'CRITICAL: Medical records showing current weight and height',
      'Calculate percentage of expected minimum weight (BMI charts)',
      'Document incapacitating episodes requiring bed rest and physician treatment',
      'Track hospitalization frequency for tube feeding or parenteral nutrition',
      'Medical treatment records showing eating disorder diagnosis',
      'Note: Incapacitating episodes must require bed rest and physician treatment, not just therapy',
    ],
    criteria: conditionCriteria,
    // Metrics for rating card display
    metrics: {
      totalLogs: relevantLogs.length,
      avgSeverity,
      severeSymptoms,
      hospitalized,
      hospitalizationCount,
      dangerToSelf,
      dangerToOthers,
    },
    disclaimer: 'Eating disorders require objective medical evidence of weight loss and incapacitating episodes. Your documentation helps establish pattern, but medical records with actual weights, BMI calculations, and hospitalization records are essential for rating determination.',
    crisisResources: {
      veteransCrisisLine: '988 then Press 1',
      text: '838255',
      chat: 'https://www.veteranscrisisline.net/get-help-now/chat/',
      neda: 'National Eating Disorders Association Hotline: 1-800-931-2237',
    },
  };
};

/**
 * Analyzes Anorexia Nervosa symptom logs
 * Note: Uses special eating disorder rating formula
 */

export const analyzeAnorexiaNervosaLogs = (logs, options = {}) => {
  return analyzeEatingDisorderCondition(
      logs,
      'anorexia-nervosa',
      MENTAL_HEALTH_CONDITIONS.ANOREXIA_NERVOSA.symptomIds,
      ANOREXIA_NERVOSA_CRITERIA,
      options,
  );
};

/**
 * Analyzes Bulimia Nervosa symptom logs
 * Note: Uses special eating disorder rating formula
 */

export const analyzeBulimiaNervosaLogs = (logs, options = {}) => {
  return analyzeEatingDisorderCondition(
      logs,
      'bulimia-nervosa',
      MENTAL_HEALTH_CONDITIONS.BULIMIA_NERVOSA.symptomIds,
      BULIMIA_NERVOSA_CRITERIA,
      options,
  );
};

/**
 * Analyzes Schizophrenia symptom logs
 */

export const analyzeSchizophreniaLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'schizophrenia',
      MENTAL_HEALTH_CONDITIONS.SCHIZOPHRENIA.symptomIds,
      SCHIZOPHRENIA_CRITERIA,
      options,
  );
};

/**
 * Analyzes Schizoaffective Disorder symptom logs
 */

export const analyzeSchizoaffectiveDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'schizoaffective-disorder',
      MENTAL_HEALTH_CONDITIONS.SCHIZOAFFECTIVE_DISORDER.symptomIds,
      SCHIZOAFFECTIVE_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Delusional Disorder symptom logs
 */

export const analyzeDelusionalDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'delusional-disorder',
      MENTAL_HEALTH_CONDITIONS.DELUSIONAL_DISORDER.symptomIds,
      DELUSIONAL_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Psychotic Disorder NOS symptom logs
 */

export const analyzePsychoticDisorderNOSLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'psychotic-disorder-nos',
      MENTAL_HEALTH_CONDITIONS.PSYCHOTIC_DISORDER_NOS.symptomIds,
      PSYCHOTIC_DISORDER_NOS_CRITERIA,
      options,
  );
};

/**
 * Analyzes Brief Psychotic Disorder symptom logs
 */

export const analyzeBriefPsychoticDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'brief-psychotic-disorder',
      MENTAL_HEALTH_CONDITIONS.BRIEF_PSYCHOTIC_DISORDER.symptomIds,
      BRIEF_PSYCHOTIC_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Binge Eating Disorder symptom logs
 */

export const analyzeBingeEatingDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'binge-eating-disorder',
      MENTAL_HEALTH_CONDITIONS.BINGE_EATING_DISORDER.symptomIds,
      BINGE_EATING_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Dissociative Identity Disorder symptom logs
 */

export const analyzeDissociativeIdentityDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'dissociative-identity-disorder',
      MENTAL_HEALTH_CONDITIONS.DISSOCIATIVE_IDENTITY_DISORDER.symptomIds,
      DISSOCIATIVE_IDENTITY_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Dissociative Amnesia symptom logs
 */

export const analyzeDissociativeAmnesiaLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'dissociative-amnesia',
      MENTAL_HEALTH_CONDITIONS.DISSOCIATIVE_AMNESIA.symptomIds,
      DISSOCIATIVE_AMNESIA_CRITERIA,
      options,
  );
};

/**
 * Analyzes Acute Stress Disorder symptom logs
 */

export const analyzeAcuteStressDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'acute-stress-disorder',
      MENTAL_HEALTH_CONDITIONS.ACUTE_STRESS_DISORDER.symptomIds,
      ACUTE_STRESS_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Antisocial Personality Disorder symptom logs
 */

export const analyzeAntisocialPersonalityDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'antisocial-personality-disorder',
      MENTAL_HEALTH_CONDITIONS.ANTISOCIAL_PERSONALITY_DISORDER.symptomIds,
      ANTISOCIAL_PERSONALITY_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Borderline Personality Disorder symptom logs
 */

export const analyzeBorderlinePersonalityDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'borderline-personality-disorder',
      MENTAL_HEALTH_CONDITIONS.BORDERLINE_PERSONALITY_DISORDER.symptomIds,
      BORDERLINE_PERSONALITY_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Narcissistic Personality Disorder symptom logs
 */

export const analyzeNarcissisticPersonalityDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'narcissistic-personality-disorder',
      MENTAL_HEALTH_CONDITIONS.NARCISSISTIC_PERSONALITY_DISORDER.symptomIds,
      NARCISSISTIC_PERSONALITY_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyzes Avoidant Personality Disorder symptom logs
 */

export const analyzeAvoidantPersonalityDisorderLogs = (logs, options = {}) => {
  return analyzeMentalHealthCondition(
      logs,
      'avoidant-personality-disorder',
      MENTAL_HEALTH_CONDITIONS.AVOIDANT_PERSONALITY_DISORDER.symptomIds,
      AVOIDANT_PERSONALITY_DISORDER_CRITERIA,
      options,
  );
};

/**
 * Analyze Dementia / Neurocognitive Disorder logs (DC 9326)
 * Uses General Rating Formula for Mental Disorders
 */

export const analyzeDementiaLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const dementiaSymptoms = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomId && symptomId.includes('dementia') &&
        isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays);
  });

  if (dementiaSymptoms.length === 0) {
    return {
      condition: 'Dementia / Neurocognitive Disorder',
      diagnosticCode: '9326',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No dementia/neurocognitive symptoms logged',
        'Document memory loss episodes',
        'Track confusion and disorientation',
        'Note difficulty with daily activities',
        'Record personality or behavioral changes',
      ],
      criteria: DEMENTIA_CRITERIA,
      disclaimer: DEMENTIA_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const memoryLoss = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-memory-loss').length;
  const disorientation = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-disorientation').length;
  const communication = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-communication').length;
  const judgment = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-judgment').length;
  const adlDifficulty = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-adl-difficulty').length;
  const personalityChange = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-personality-change').length;
  const wandering = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-wandering').length;
  const delusions = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-delusions').length;
  const agitation = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-agitation').length;
  const supervisionNeeded = dementiaSymptoms.filter(s => (s.symptomId || s.symptom) === 'dementia-supervision-needed').length;

  evidence.push(`${dementiaSymptoms.length} dementia symptoms logged over ${evaluationPeriodDays} days`);

  // Calculate severity indicators
  const severeIndicators = delusions + supervisionNeeded + wandering;
  const moderateIndicators = disorientation + adlDifficulty + judgment + agitation;
  const mildIndicators = memoryLoss + communication + personalityChange;

  // Rating determination based on General Rating Formula for Mental Disorders
  if (supervisionNeeded > 0 && adlDifficulty > 0 && (disorientation > 0 || delusions > 0)) {
    supportedRating = 100;
    ratingRationale.push('Total occupational and social impairment');
    ratingRationale.push('Unable to perform activities of daily living independently');
    if (supervisionNeeded > 0) evidence.push(`${supervisionNeeded} entries requiring supervision`);
    if (disorientation > 0) evidence.push(`${disorientation} disorientation episodes`);
    if (delusions > 0) evidence.push(`${delusions} delusion/hallucination episodes`);
    gaps.push('Consider Aid & Attendance (SMC-L) application');
  } else if (severeIndicators > 0 || (moderateIndicators >= 3 && adlDifficulty > 0)) {
    supportedRating = 70;
    ratingRationale.push('Deficiencies in most areas (work, family, judgment, thinking, mood)');
    if (wandering > 0) evidence.push(`${wandering} wandering/getting lost episodes`);
    if (agitation > 0) evidence.push(`${agitation} agitation/aggression episodes`);
    if (judgment > 0) evidence.push(`${judgment} impaired judgment entries`);
  } else if (moderateIndicators >= 2 || (mildIndicators >= 3 && moderateIndicators >= 1)) {
    supportedRating = 50;
    ratingRationale.push('Reduced reliability and productivity');
    ratingRationale.push('Difficulty in establishing and maintaining effective relationships');
    if (memoryLoss > 0) evidence.push(`${memoryLoss} memory loss episodes`);
    if (communication > 0) evidence.push(`${communication} communication difficulty entries`);
  } else if (mildIndicators >= 2) {
    supportedRating = 30;
    ratingRationale.push('Occasional decrease in work efficiency');
    ratingRationale.push('Mild memory loss and cognitive symptoms');
    if (memoryLoss > 0) evidence.push(`${memoryLoss} memory loss episodes`);
    if (personalityChange > 0) evidence.push(`${personalityChange} personality change entries`);
  } else if (dementiaSymptoms.length > 0) {
    supportedRating = 10;
    ratingRationale.push('Mild or transient symptoms documented');
    evidence.push('Cognitive symptoms present but mild');
  }

  // Documentation gaps
  gaps.push('Obtain neuropsychological testing for objective cognitive measures');
  gaps.push('Document impact on daily activities and independence');
  gaps.push('Track safety concerns and supervision requirements');

  if (supportedRating >= 70) {
    gaps.push('Document caregiver burden and assistance requirements');
    gaps.push('Consider evaluation for Aid & Attendance or Housebound SMC');
  }

  // Note if appears secondary
  gaps.push('If secondary to another condition (Parkinson\'s, TBI, stroke), document nexus relationship');

  return {
    condition: 'Dementia / Neurocognitive Disorder',
    diagnosticCode: '9326',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: DEMENTIA_CRITERIA,
    disclaimer: DEMENTIA_CRITERIA.disclaimer,
  };
};