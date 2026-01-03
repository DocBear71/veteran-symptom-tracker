/**
 * Ankle/Achilles and Hip/Thigh Rating Analysis
 * Based on 38 CFR Part 4, §4.71a
 */

/**
 * Analyze ankle/achilles symptoms and determine VA rating
 */
export const analyzeAnkleAchilles = (logs, profileId) => {
  if (!logs || logs.length === 0) {
    return {
      hasData: false,
      supportedRating: null,
      rationale: [],
      evidenceGaps: [],
      metrics: {}
    };
  }

  // Filter logs for this profile and ankle-related symptoms
  const relevantLogs = logs.filter(log =>
      log.profileId === profileId &&
      (log.symptoms?.some(s =>
          s.toLowerCase().includes('ankle') ||
          s.toLowerCase().includes('achilles') ||
          s.toLowerCase().includes('foot pain') ||
          s.toLowerCase().includes('heel')
      ) || log.linkedConditions?.includes('ankle') || log.linkedConditions?.includes('achilles'))
  );

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: null,
      rationale: [],
      evidenceGaps: ['No ankle or achilles-related symptom logs found'],
      metrics: {}
    };
  }

  // Calculate metrics
  const totalLogs = relevantLogs.length;
  const painDays = relevantLogs.filter(log =>
      log.symptoms?.some(s => s.toLowerCase().includes('pain'))
  ).length;

  const limitedROM = relevantLogs.filter(log =>
      log.symptoms?.some(s =>
          s.toLowerCase().includes('stiff') ||
          s.toLowerCase().includes('limited') ||
          s.toLowerCase().includes('cannot move') ||
          s.toLowerCase().includes('frozen')
      )
  ).length;

  const flareUps = relevantLogs.filter(log =>
      log.symptoms?.some(s =>
          s.toLowerCase().includes('flare') ||
          s.toLowerCase().includes('swelling') ||
          s.toLowerCase().includes('inflammation')
      )
  ).length;

  // Determine rating based on documented symptoms
  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // Check for frozen ankle (40%)
  const frozenAnkle = relevantLogs.some(log =>
      log.symptoms?.some(s =>
          s.toLowerCase().includes('frozen') ||
          s.toLowerCase().includes('cannot move')
      )
  );

  if (frozenAnkle) {
    supportedRating = 40;
    rationale.push('Documentation shows ankle is frozen or cannot be moved');
  }
  // Check for severe limitation (30%)
  else if (limitedROM >= totalLogs * 0.5) {
    supportedRating = 30;
    rationale.push('Frequent limitation of motion documented (50%+ of logs)');
  }
  // Check for moderate limitation (20%)
  else if (limitedROM >= totalLogs * 0.3 || flareUps >= 3) {
    supportedRating = 20;
    rationale.push('Regular limitation of motion or significant flare-ups documented');
  }
  // Check for mild limitation (10%)
  else if (limitedROM > 0 || painDays >= totalLogs * 0.4) {
    supportedRating = 10;
    rationale.push('Some limitation of motion and/or frequent pain documented');
  }

  // Evidence gaps
  if (totalLogs < 10) {
    evidenceGaps.push('Consider documenting more symptom occurrences (at least 10 entries recommended)');
  }

  if (!relevantLogs.some(log => log.notes?.toLowerCase().includes('degrees') || log.notes?.toLowerCase().includes('°'))) {
    evidenceGaps.push('Consider measuring and documenting range of motion in degrees');
  }

  if (!relevantLogs.some(log => log.notes?.toLowerCase().includes('brace') || log.notes?.toLowerCase().includes('assistive'))) {
    evidenceGaps.push('Document any use of ankle braces or assistive devices');
  }

  return {
    hasData: true,
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      painDays,
      limitedROM,
      flareUps
    }
  };
};

/**
 * Analyze hip/thigh symptoms and determine VA rating
 */
export const analyzeHipThigh = (logs, profileId) => {
  if (!logs || logs.length === 0) {
    return {
      hasData: false,
      supportedRating: null,
      rationale: [],
      evidenceGaps: [],
      metrics: {}
    };
  }

  // Filter logs for this profile and hip-related symptoms
  const relevantLogs = logs.filter(log =>
      log.profileId === profileId &&
      (log.symptoms?.some(s =>
          s.toLowerCase().includes('hip') ||
          s.toLowerCase().includes('thigh') ||
          s.toLowerCase().includes('groin') ||
          s.toLowerCase().includes('trochanteric')
      ) || log.linkedConditions?.includes('hip'))
  );

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      supportedRating: null,
      rationale: [],
      evidenceGaps: ['No hip or thigh-related symptom logs found'],
      metrics: {}
    };
  }

  // Calculate metrics
  const totalLogs = relevantLogs.length;
  const painDays = relevantLogs.filter(log =>
      log.symptoms?.some(s => s.toLowerCase().includes('pain'))
  ).length;

  const limitedROM = relevantLogs.filter(log =>
      log.symptoms?.some(s =>
          s.toLowerCase().includes('stiff') ||
          s.toLowerCase().includes('limited') ||
          s.toLowerCase().includes('cannot') ||
          s.toLowerCase().includes('difficult')
      )
  ).length;

  const assistiveDevice = relevantLogs.filter(log =>
      log.notes?.toLowerCase().includes('crutch') ||
      log.notes?.toLowerCase().includes('cane') ||
      log.notes?.toLowerCase().includes('walker')
  ).length;

  // Determine rating based on documented symptoms
  let supportedRating = 0;
  const rationale = [];
  const evidenceGaps = [];

  // Check for severe limitation requiring crutches (70-90%)
  if (assistiveDevice >= totalLogs * 0.5) {
    supportedRating = 70;
    rationale.push('Frequent use of assistive devices documented (crutches/cane)');
  }
  // Check for frozen hip (60%)
  else if (relevantLogs.some(log => log.symptoms?.some(s => s.toLowerCase().includes('frozen')))) {
    supportedRating = 60;
    rationale.push('Documentation shows hip is frozen in position');
  }
  // Check for severe motion limitation (40%)
  else if (limitedROM >= totalLogs * 0.7) {
    supportedRating = 40;
    rationale.push('Severe limitation of motion documented (70%+ of logs)');
  }
  // Check for moderate limitation (30%)
  else if (limitedROM >= totalLogs * 0.5) {
    supportedRating = 30;
    rationale.push('Moderate limitation of motion documented (50%+ of logs)');
  }
  // Check for some limitation (20%)
  else if (limitedROM >= totalLogs * 0.3) {
    supportedRating = 20;
    rationale.push('Regular limitation of motion documented (30%+ of logs)');
  }
  // Check for mild limitation (10%)
  else if (limitedROM > 0 || painDays >= totalLogs * 0.4) {
    supportedRating = 10;
    rationale.push('Some limitation of motion and/or frequent pain documented');
  }

  // Evidence gaps
  if (totalLogs < 10) {
    evidenceGaps.push('Consider documenting more symptom occurrences (at least 10 entries recommended)');
  }

  if (!relevantLogs.some(log => log.notes?.toLowerCase().includes('degrees') || log.notes?.toLowerCase().includes('°'))) {
    evidenceGaps.push('Consider measuring and documenting range of motion in degrees (flexion, extension, abduction, rotation)');
  }

  if (!relevantLogs.some(log => log.notes?.toLowerCase().includes('stairs') || log.notes?.toLowerCase().includes('walking'))) {
    evidenceGaps.push('Document impact on daily activities (stairs, walking distance, sitting, standing)');
  }

  return {
    hasData: true,
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs,
      painDays,
      limitedROM,
      assistiveDevice
    }
  };
};