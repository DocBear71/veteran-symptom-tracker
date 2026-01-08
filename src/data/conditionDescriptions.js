/**
 * Condition Descriptions Data
 *
 * Centralized content for "Understanding Your Rating" sections in rating cards.
 * Each condition includes:
 * - evidenceLookingFor: What the VA specifically looks for in claims
 * - ratingLevelMeanings: Plain-language explanations of each rating level
 * - documentationTips: Practical advice for logging and documentation
 * - keyTerms: Important VA terminology definitions (optional)
 *
 * Usage: Import and pass diagnosticCode to getConditionDescription()
 */

// =============================================================================
// PTSD - DC 9411
// =============================================================================
const PTSD_DESCRIPTION = {
  diagnosticCode: '9411',
  conditionName: 'PTSD',

  evidenceLookingFor: [
    'Documented stressor event connected to military service',
    'Current diagnosis of PTSD from a qualified mental health professional',
    'Specific symptoms: nightmares, flashbacks, intrusive thoughts, hypervigilance',
    'Evidence of avoidance behaviors (avoiding people, places, or situations)',
    'Impact on occupational functioning (work problems, missed days, conflicts)',
    'Impact on social relationships (isolation, difficulty maintaining relationships)',
    'Treatment history including therapy sessions and medication compliance',
    'Buddy statements from family, friends, or coworkers describing behavioral changes',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Diagnosis exists but symptoms are controlled',
      realWorld: 'Symptoms are minimal or well-managed with treatment. You can work and maintain relationships without significant difficulty.',
    },
    {
      percent: 10,
      meaning: 'Mild symptoms with occasional impact',
      realWorld: 'You experience symptoms during high stress periods. Work performance is slightly affected occasionally. You might need medication to stay stable.',
    },
    {
      percent: 30,
      meaning: 'Occasional decrease in work efficiency',
      realWorld: 'Symptoms cause noticeable work problems several times a month. You may have difficulty with complex tasks during flare-ups. Sleep disturbances affect your energy.',
    },
    {
      percent: 50,
      meaning: 'Reduced reliability and productivity',
      realWorld: 'You struggle to maintain consistent work performance. Panic attacks, memory problems, or mood disturbances occur weekly. Relationships are strained.',
    },
    {
      percent: 70,
      meaning: 'Serious occupational and social impairment',
      realWorld: 'You have major difficulty keeping jobs or maintaining them. Suicidal thoughts may occur. You may neglect personal hygiene or have obsessional rituals.',
    },
    {
      percent: 100,
      meaning: 'Total occupational and social impairment',
      realWorld: 'You cannot work or maintain any relationships. You may experience persistent danger to yourself or others, disorientation, or memory loss for basic information.',
    },
  ],

  documentationTips: [
    'Log every nightmare, flashback, and intrusive thought - note what triggered it',
    'Document avoidance: "Couldn\'t go to the grocery store due to crowds"',
    'Track sleep quality and how many hours you actually sleep',
    'Note work impacts: missed days, conflicts with coworkers, difficulty concentrating',
    'Record relationship problems: arguments, isolation, cancelled plans',
    'Keep a list of triggers and your reactions to them',
    'Document hypervigilance episodes: checking locks, scanning for exits, startle responses',
    'Note medication side effects and whether symptoms are controlled',
  ],

  keyTerms: {
    'Stressor': 'The traumatic event that caused PTSD - must be verified or consistent with military service',
    'Hypervigilance': 'Being constantly on guard, scanning for threats, difficulty relaxing',
    'Avoidance': 'Staying away from reminders of trauma - people, places, conversations, activities',
    'Intrusive thoughts': 'Unwanted memories or thoughts about the trauma that interrupt daily life',
    'Occupational impairment': 'How PTSD affects your ability to work and earn a living',
    'Social impairment': 'How PTSD affects your relationships with family, friends, and community',
  },
};

// =============================================================================
// MIGRAINE - DC 8100
// =============================================================================
const MIGRAINE_DESCRIPTION = {
  diagnosticCode: '8100',
  conditionName: 'Migraine Headaches',

  evidenceLookingFor: [
    'Diagnosis of migraine headaches from a physician',
    'Documentation of PROSTRATING attacks (attacks that force you to stop activity and lie down)',
    'Frequency of prostrating attacks per month',
    'Duration of each attack',
    'Treatment attempts and their effectiveness',
    'Impact on employment - missed work days, reduced productivity',
    'Associated symptoms: nausea, vomiting, light/sound sensitivity, aura',
    'Evidence of economic inadaptability for 50% rating',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less frequent, non-prostrating attacks',
      realWorld: 'You have migraines but they don\'t force you to stop what you\'re doing. You can work through them with medication.',
    },
    {
      percent: 10,
      meaning: 'Prostrating attacks averaging 1 per 2 months',
      realWorld: 'About every other month, you have a migraine severe enough to force you to lie down and stop all activity.',
    },
    {
      percent: 30,
      meaning: 'Prostrating attacks averaging 1 per month',
      realWorld: 'Monthly, you have at least one migraine that completely stops you from functioning. You miss work or events regularly.',
    },
    {
      percent: 50,
      meaning: 'Very frequent, prolonged, prostrating attacks causing severe economic inadaptability',
      realWorld: 'Migraines are so frequent and severe that you struggle to maintain employment. Attacks last many hours and medication doesn\'t help.',
    },
  ],

  documentationTips: [
    'ALWAYS note if an attack was "prostrating" - meaning you HAD to lie down',
    'Record exact duration: "Started 2pm, ended 8pm = 6 hours"',
    'Document what you couldn\'t do: "Missed work," "Couldn\'t pick up kids"',
    'Track associated symptoms: nausea, vomiting, light sensitivity, aura',
    'Note medications taken and whether they helped',
    'Log work impacts: missed days, left early, reduced productivity',
    'Record prolonged attacks (4+ hours) separately - these are significant',
    'Use the "flare-up" checkbox for prostrating attacks',
  ],

  keyTerms: {
    'Prostrating': 'An attack so severe you MUST lie down and stop ALL activity - this is the key VA term',
    'Prolonged attack': 'A prostrating migraine lasting 4 or more hours despite treatment',
    'Economic inadaptability': 'Migraines are so severe/frequent they prevent you from keeping a job',
    'Aura': 'Visual disturbances, numbness, or other warning signs before a migraine',
    'Characteristic prostrating attacks': 'The VA\'s specific language - must document attacks meeting this criteria',
  },
};

// =============================================================================
// SLEEP APNEA - DC 6847
// =============================================================================
const SLEEP_APNEA_DESCRIPTION = {
  diagnosticCode: '6847',
  conditionName: 'Sleep Apnea',

  evidenceLookingFor: [
    'Sleep study (polysomnography) confirming diagnosis',
    'Apnea-Hypopnea Index (AHI) score from sleep study',
    'Prescription for CPAP, BiPAP, or other breathing device',
    'Documentation of consistent device usage (compliance data)',
    'Evidence of daytime hypersomnolence (excessive daytime sleepiness)',
    'Impact on daily functioning despite treatment',
    'For higher ratings: evidence of chronic respiratory failure or need for tracheostomy',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Asymptomatic but with documented sleep disorder',
      realWorld: 'You have a diagnosis but no significant symptoms. Sleep study was borderline or symptoms resolved.',
    },
    {
      percent: 30,
      meaning: 'Persistent daytime hypersomnolence',
      realWorld: 'Even without a breathing device, you experience excessive daytime sleepiness that affects your daily life. You may fall asleep during activities.',
    },
    {
      percent: 50,
      meaning: 'Requires use of breathing assistance device (CPAP/BiPAP)',
      realWorld: 'You MUST use a CPAP, BiPAP, or similar device to sleep. This is the most common rating for veterans with sleep apnea.',
    },
    {
      percent: 100,
      meaning: 'Chronic respiratory failure with CO2 retention, cor pulmonale, or requires tracheostomy',
      realWorld: 'Your sleep apnea has caused serious complications - heart problems from low oxygen, need for surgical airway, or chronic respiratory failure.',
    },
  ],

  documentationTips: [
    'Keep copies of ALL sleep study results showing your AHI score',
    'Download and save CPAP compliance data monthly (most machines track this)',
    'Log nights when you couldn\'t use your device and why',
    'Document daytime sleepiness: "Nearly fell asleep driving," "Dozed off at work"',
    'Track nightly sleep quality even with device use',
    'Note device issues: mask leaks, pressure problems, equipment failures',
    'Document impact on work: difficulty staying alert, safety concerns',
    'Record any complications: weight gain, mood changes, morning headaches',
  ],

  keyTerms: {
    'CPAP': 'Continuous Positive Airway Pressure - the most common treatment device',
    'BiPAP': 'Bilevel Positive Airway Pressure - uses two pressure levels, often for more severe cases',
    'AHI': 'Apnea-Hypopnea Index - measures severity (5-15 mild, 15-30 moderate, 30+ severe)',
    'Hypersomnolence': 'Excessive daytime sleepiness despite adequate sleep - key VA term',
    'Cor pulmonale': 'Right-sided heart failure from chronic low oxygen - indicates 100% rating',
    'Compliance': 'How many hours per night you use your device - VA may request this data',
  },
};

// =============================================================================
// SPINE CONDITIONS (General Rating Formula) - DC 5235-5243
// =============================================================================
const SPINE_DESCRIPTION = {
  diagnosticCode: '5235-5243',
  conditionName: 'Spine Conditions',

  evidenceLookingFor: [
    'Range of motion measurements (forward flexion is most important)',
    'Combined range of motion of the thoracolumbar or cervical spine',
    'Evidence of muscle spasm or guarding severe enough to cause abnormal gait or spinal contour',
    'Documentation of incapacitating episodes (prescribed bed rest by physician)',
    'Imaging studies: X-rays, MRI, CT scans showing condition',
    'Evidence of associated neurological abnormalities (radiculopathy)',
    'Impact of pain on functional use, especially during flare-ups',
    'DeLuca factors: pain, weakness, fatigability, incoordination',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Forward flexion greater than 60° but not greater than 85°, OR combined ROM greater than 120° but not greater than 235°',
      realWorld: 'You can bend forward mostly normally but with some limitation. Daily activities are affected but manageable.',
    },
    {
      percent: 20,
      meaning: 'Forward flexion greater than 30° but not greater than 60°, OR combined ROM not greater than 120°, OR muscle spasm/guarding causing abnormal gait or contour',
      realWorld: 'Bending is significantly limited - you can\'t touch your knees easily. Your posture may be affected. Getting dressed or tying shoes is difficult.',
    },
    {
      percent: 40,
      meaning: 'Forward flexion 30° or less, OR favorable ankylosis of entire thoracolumbar spine',
      realWorld: 'Severe limitation - you can barely bend forward at all. Most activities requiring bending are very difficult or impossible.',
    },
    {
      percent: 50,
      meaning: 'Unfavorable ankylosis of entire thoracolumbar spine',
      realWorld: 'Your spine is fused in a position that makes it difficult to look forward or maintain balance. Daily activities are severely impacted.',
    },
    {
      percent: 100,
      meaning: 'Unfavorable ankylosis of entire spine',
      realWorld: 'Both your neck and back are fused in unfavorable positions. You cannot look straight ahead and have severe functional limitations.',
    },
  ],

  documentationTips: [
    'Record your range of motion during flare-ups vs normal days',
    'Document what activities you can\'t do: "Can\'t bend to tie shoes," "Can\'t turn head to check blind spot"',
    'Track days when pain prevents normal activity',
    'Note any prescribed bed rest - these are "incapacitating episodes"',
    'Document radiating pain to legs/arms (may qualify for separate radiculopathy rating)',
    'Log use of assistive devices: cane, back brace, TENS unit',
    'Note how pain increases after repetitive motion or prolonged positions',
    'Record medication usage and effectiveness',
  ],

  keyTerms: {
    'Forward flexion': 'Bending forward at the waist - measured in degrees, most important measurement',
    'Combined ROM': 'Total of all movements added together (flexion + extension + lateral + rotation)',
    'Ankylosis': 'Fusion or immobility of a joint - favorable means functional position, unfavorable means problematic position',
    'Incapacitating episodes': 'Periods requiring BED REST PRESCRIBED BY A PHYSICIAN - not just days you stayed in bed',
    'Radiculopathy': 'Nerve pain radiating to arms or legs - can be rated separately from spine condition',
    'DeLuca factors': 'Additional functional loss from pain, weakness, fatigability, incoordination during flare-ups',
    'Guarding': 'Muscle tightness to protect the spine - may cause abnormal posture or gait',
  },
};

// =============================================================================
// DEPRESSION (Major Depressive Disorder) - DC 9434
// =============================================================================
const DEPRESSION_DESCRIPTION = {
  diagnosticCode: '9434',
  conditionName: 'Major Depressive Disorder',

  evidenceLookingFor: [
    'Current diagnosis from qualified mental health professional',
    'Treatment history: therapy, medications, hospitalizations',
    'Specific symptoms: depressed mood, sleep disturbance, fatigue, concentration problems',
    'Evidence of suicidal ideation or attempts (if applicable)',
    'Impact on occupational functioning (work performance, missed days)',
    'Impact on social functioning (relationships, isolation, withdrawal)',
    'Frequency and duration of depressive episodes',
    'Buddy statements describing observable changes in behavior',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Diagnosis exists but symptoms controlled',
      realWorld: 'You have a diagnosis but medication or therapy keeps symptoms minimal. You function normally day-to-day.',
    },
    {
      percent: 10,
      meaning: 'Mild or transient symptoms',
      realWorld: 'Symptoms appear during stressful times but you can usually push through. Work and relationships are minimally affected.',
    },
    {
      percent: 30,
      meaning: 'Occasional decrease in work efficiency',
      realWorld: 'Depression noticeably affects your work or relationships several times a month. You have difficulty concentrating or completing tasks during episodes.',
    },
    {
      percent: 50,
      meaning: 'Reduced reliability and productivity',
      realWorld: 'You struggle with consistent performance at work. You may have flattened affect, difficulty making decisions, or regular mood disturbances.',
    },
    {
      percent: 70,
      meaning: 'Serious occupational and social impairment',
      realWorld: 'Depression significantly impairs your ability to work. You may have suicidal thoughts, neglect hygiene, or have severe difficulty in relationships.',
    },
    {
      percent: 100,
      meaning: 'Total occupational and social impairment',
      realWorld: 'You cannot work or maintain relationships due to depression. You may be a persistent danger to yourself.',
    },
  ],

  documentationTips: [
    'Track daily mood on a scale - note patterns over time',
    'Document sleep problems: insomnia, oversleeping, nightmares',
    'Log days when you couldn\'t get out of bed or complete basic tasks',
    'Note missed work days and reasons',
    'Record social withdrawal: "Cancelled plans," "Avoided family gathering"',
    'Document changes in appetite and weight',
    'Track concentration problems: difficulty reading, making decisions, remembering',
    'Note any suicidal thoughts (when they occur, intensity, any actions)',
    'Record medication changes and side effects',
  ],

  keyTerms: {
    'Occupational impairment': 'How depression affects your ability to work and maintain employment',
    'Social impairment': 'How depression affects relationships with family, friends, and community',
    'Flattened affect': 'Reduced emotional expression - showing little emotion in face or voice',
    'Anhedonia': 'Loss of interest or pleasure in activities you used to enjoy',
    'Psychomotor retardation': 'Slowed thinking, speaking, or physical movements',
    'Suicidal ideation': 'Thoughts of suicide - passive ("wish I wasn\'t here") to active (planning)',
  },
};

// =============================================================================
// GENERALIZED ANXIETY DISORDER - DC 9400
// =============================================================================
const ANXIETY_DESCRIPTION = {
  diagnosticCode: '9400',
  conditionName: 'Generalized Anxiety Disorder',

  evidenceLookingFor: [
    'Current diagnosis from qualified mental health professional',
    'Documentation of excessive worry about multiple areas of life',
    'Physical symptoms: restlessness, muscle tension, sleep disturbance, fatigue',
    'Evidence of panic attacks (frequency, severity, triggers)',
    'Impact on occupational functioning',
    'Impact on social relationships',
    'Treatment history: therapy type, medications, response to treatment',
    'Duration of symptoms (GAD requires 6+ months of symptoms)',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Diagnosis exists but symptoms controlled',
      realWorld: 'Anxiety is well-managed with treatment. You can handle daily stress without significant problems.',
    },
    {
      percent: 10,
      meaning: 'Mild or transient symptoms',
      realWorld: 'You experience anxiety during stressful periods but can function. Medication helps manage symptoms.',
    },
    {
      percent: 30,
      meaning: 'Occasional decrease in work efficiency',
      realWorld: 'Anxiety causes noticeable work problems several times a month. You may avoid certain tasks or situations.',
    },
    {
      percent: 50,
      meaning: 'Reduced reliability and productivity',
      realWorld: 'Panic attacks or chronic worry significantly affect work. You have difficulty with decisions and may have ritualistic behaviors.',
    },
    {
      percent: 70,
      meaning: 'Serious occupational and social impairment',
      realWorld: 'Anxiety severely limits your ability to work or socialize. You may have near-continuous panic or obsessional rituals.',
    },
    {
      percent: 100,
      meaning: 'Total occupational and social impairment',
      realWorld: 'Anxiety is so severe you cannot work or maintain any relationships. You may be in persistent danger to yourself.',
    },
  ],

  documentationTips: [
    'Track panic attacks: when, where, duration, symptoms, triggers',
    'Document physical symptoms: racing heart, sweating, trembling, shortness of breath',
    'Log avoidance behaviors: situations, places, or activities you avoid',
    'Note work impacts: difficulty concentrating, missed deadlines, conflicts',
    'Record sleep problems: difficulty falling asleep, staying asleep, nightmares',
    'Document worry episodes: what you worried about, how long, how intense',
    'Track medication effectiveness and side effects',
    'Note social impacts: cancelled plans, difficulty in conversations, isolation',
  ],

  keyTerms: {
    'Panic attack': 'Sudden intense fear with physical symptoms - racing heart, sweating, feeling of doom',
    'Hypervigilance': 'Constantly on guard, scanning for threats, difficulty relaxing',
    'Avoidance': 'Staying away from situations, places, or activities that trigger anxiety',
    'Obsessional rituals': 'Repetitive behaviors done to reduce anxiety (checking, counting, etc.)',
    'Occupational impairment': 'How anxiety affects your ability to work',
    'Social impairment': 'How anxiety affects your relationships',
    'GAD': 'Generalized Anxiety Disorder - excessive worry about multiple areas lasting 6+ months',
  },
};

// =============================================================================
// TBI RESIDUALS - DC 8045
// =============================================================================
const TBI_DESCRIPTION = {
  diagnosticCode: '8045',
  conditionName: 'Traumatic Brain Injury Residuals',

  evidenceLookingFor: [
    'Documentation of in-service head injury or blast exposure',
    'Medical diagnosis of TBI with severity level (mild, moderate, severe)',
    'Cognitive symptoms: memory problems, concentration, judgment issues',
    'Emotional/behavioral symptoms: irritability, impulsivity, mood changes',
    'Physical symptoms: headaches, dizziness, balance problems, light sensitivity',
    'Neuropsychological testing results',
    'Impact on work and daily functioning',
    'Evidence of worsening or stable symptoms over time',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'No residuals or symptoms resolved',
      realWorld: 'You had a TBI but have fully recovered with no ongoing symptoms affecting daily life.',
    },
    {
      percent: 10,
      meaning: 'Level 1 impairment in one or more facets',
      realWorld: 'Mild symptoms - occasional memory lapses, mild headaches, or slight concentration issues that minimally affect daily functioning.',
    },
    {
      percent: 40,
      meaning: 'Level 2 impairment in one or more facets',
      realWorld: 'Moderate symptoms - noticeable memory problems, regular headaches, mood changes that affect work and relationships.',
    },
    {
      percent: 70,
      meaning: 'Level 3 impairment in one or more facets',
      realWorld: 'Severe symptoms - significant cognitive deficits, frequent severe headaches, major personality changes affecting most areas of life.',
    },
    {
      percent: 100,
      meaning: 'Total impairment',
      realWorld: 'You cannot function independently due to TBI residuals. Require supervision for safety or daily activities.',
    },
  ],

  documentationTips: [
    'Track ALL symptoms daily - cognitive, emotional, and physical',
    'Document memory problems: "Forgot appointment," "Couldn\'t remember conversation"',
    'Log headaches with severity, duration, and triggers',
    'Note emotional changes: irritability episodes, mood swings, anxiety',
    'Record concentration issues: difficulty reading, following conversations',
    'Track balance problems and dizziness episodes',
    'Document light and noise sensitivity',
    'Note how symptoms affect work performance and relationships',
  ],

  keyTerms: {
    'Facets of TBI': 'VA rates TBI across 10 areas: memory, concentration, executive function, judgment, social interaction, orientation, motor activity, visual-spatial, communication, and consciousness',
    'Level 0-3': 'Severity levels for each facet - 0 is normal, 3 is severely impaired',
    'Subjective symptoms': 'Symptoms you report (headaches, dizziness) - rated separately under DC 8045',
    'Emotional/behavioral': 'Mood changes, irritability, impulsivity - can be rated under TBI or separate mental health code',
    'Neuropsychological testing': 'Formal cognitive testing that documents deficits objectively',
  },
};

// =============================================================================
// HYPERTENSION - DC 7101
// =============================================================================
const HYPERTENSION_DESCRIPTION = {
  diagnosticCode: '7101',
  conditionName: 'Hypertension',

  evidenceLookingFor: [
    'Blood pressure readings over time (multiple readings preferred)',
    'History of diastolic pressure predominantly 100 or more',
    'History of systolic pressure predominantly 160 or more',
    'Current blood pressure readings on medication',
    'Documentation of continuous medication requirement',
    'Evidence of complications (heart disease, kidney problems)',
    'Records showing blood pressure history before and after treatment',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Diastolic 100-109, OR systolic 160-199, OR continuous medication required for control',
      realWorld: 'Your blood pressure requires daily medication to stay controlled. Without medication, diastolic would be 100+ or systolic 160+.',
    },
    {
      percent: 20,
      meaning: 'Diastolic predominantly 110-119, OR systolic predominantly 200+',
      realWorld: 'Your blood pressure is harder to control. Even with medication, readings are elevated. You may need multiple medications.',
    },
    {
      percent: 40,
      meaning: 'Diastolic predominantly 120-129',
      realWorld: 'Severe hypertension requiring aggressive treatment. High risk for complications. Multiple medications typically required.',
    },
    {
      percent: 60,
      meaning: 'Diastolic predominantly 130+',
      realWorld: 'Dangerously high blood pressure despite treatment. Immediate health risk. May have end-organ damage.',
    },
  ],

  documentationTips: [
    'Take blood pressure at the same time daily - morning readings are important',
    'Record BOTH systolic (top) and diastolic (bottom) numbers',
    'Log readings taken at home AND at medical appointments',
    'Document all blood pressure medications and dosages',
    'Note if readings are taken before or after medication',
    'Track any symptoms: headaches, dizziness, chest discomfort',
    'Record any medication changes or additions',
    'Document readings during stressful periods - these matter too',
  ],

  keyTerms: {
    'Systolic': 'Top number - pressure when heart beats. 160+ is significant for VA ratings',
    'Diastolic': 'Bottom number - pressure between beats. 100+ is the key threshold for VA ratings',
    'Predominantly': 'VA looks at your overall pattern, not just one reading',
    'Continuous medication': 'Needing daily BP medication = automatic 10% minimum',
    'History': 'Past readings matter - even if controlled now, history of high readings counts',
  },
};

// =============================================================================
// HEARING LOSS - DC 6100
// =============================================================================
const HEARING_LOSS_DESCRIPTION = {
  diagnosticCode: '6100',
  conditionName: 'Hearing Loss',

  evidenceLookingFor: [
    'Audiometry test results (puretone threshold testing)',
    'Maryland CNC word recognition scores',
    'Evidence of in-service noise exposure (MOS, duty stations)',
    'Documentation of hearing difficulty in daily life',
    'Hearing aid prescription and usage',
    'Pattern of hearing loss (which frequencies affected)',
    'Evidence of exceptional hearing loss patterns (38 CFR 4.86)',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Hearing levels I-I (best in both ears)',
      realWorld: 'Mild hearing loss detected on testing but not severe enough for compensation under VA tables.',
    },
    {
      percent: 10,
      meaning: 'Varies by combination (e.g., II-IV, III-III)',
      realWorld: 'Noticeable hearing loss affecting conversations, especially in noisy environments. May benefit from hearing aids.',
    },
    {
      percent: 20,
      meaning: 'Moderate combinations on rating tables',
      realWorld: 'Significant hearing difficulty. Regularly miss parts of conversations. Hearing aids likely needed.',
    },
    {
      percent: 30,
      meaning: 'More severe combinations',
      realWorld: 'Substantial hearing loss affecting work and social situations. Difficulty even with hearing aids in some situations.',
    },
    {
      percent: 100,
      meaning: 'Level XI in both ears (profound loss)',
      realWorld: 'Profound deafness in both ears. Cannot understand speech even with amplification.',
    },
  ],

  documentationTips: [
    'Request copies of ALL audiograms from VA and private providers',
    'Document situations where you have difficulty hearing',
    'Note when you need to ask people to repeat themselves',
    'Track problems hearing in meetings, phone calls, conversations',
    'Document TV/radio volume levels compared to others',
    'Record difficulty hearing alarms, doorbells, traffic',
    'Note safety concerns from hearing loss',
    'Document impact on work - missed instructions, communication problems',
  ],

  keyTerms: {
    'Puretone threshold': 'Hearing test measuring softest sounds you can hear at different frequencies (pitches)',
    'Maryland CNC': 'Word recognition test - percentage of words you can correctly repeat',
    'Roman numerals (I-XI)': 'VA hearing levels based on test results - I is best, XI is worst',
    'Table VI/VIa': 'VA tables that convert test scores to hearing level numbers',
    'Table VII': 'VA table that converts hearing levels to disability percentage',
    'Exceptional patterns': 'Certain hearing loss patterns qualify for higher ratings under 38 CFR 4.86',
    'Tinnitus': 'Ringing in ears - rated separately at 10% under DC 6260',
  },
};

// =============================================================================
// DIABETES MELLITUS - DC 7913
// =============================================================================
const DIABETES_DESCRIPTION = {
  diagnosticCode: '7913',
  conditionName: 'Diabetes Mellitus',

  evidenceLookingFor: [
    'Diagnosis of diabetes mellitus (Type 1 or Type 2)',
    'Treatment regimen: diet only, oral medications, or insulin',
    'HbA1c levels showing glucose control over time',
    'Evidence of activity/diet regulation requirements',
    'Documentation of hypoglycemic episodes',
    'Hospitalizations related to diabetes',
    'Evidence of diabetic complications (neuropathy, retinopathy, nephropathy)',
    'Frequency of medical visits for diabetes management',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Manageable by restricted diet only',
      realWorld: 'You control diabetes through diet alone - no medications needed. Must follow dietary restrictions.',
    },
    {
      percent: 20,
      meaning: 'Requires insulin and restricted diet, OR oral medication and restricted diet',
      realWorld: 'You need daily medication or insulin plus dietary management. Regular monitoring required.',
    },
    {
      percent: 40,
      meaning: 'Requires insulin, restricted diet, and regulation of activities',
      realWorld: 'Diabetes significantly limits your activities. Must carefully plan exercise and meals around insulin.',
    },
    {
      percent: 60,
      meaning: 'Requires insulin, restricted diet, regulation of activities, with episodes of ketoacidosis or hypoglycemic reactions requiring 1-2 hospitalizations per year or twice monthly visits',
      realWorld: 'Difficult to control diabetes with frequent dangerous episodes requiring medical intervention.',
    },
    {
      percent: 100,
      meaning: 'Requires more than one daily insulin injection, restricted diet, regulation of activities, with episodes requiring 3+ hospitalizations per year or weekly visits plus progressive complications',
      realWorld: 'Severe, poorly controlled diabetes with frequent hospitalizations and progressive damage to other organs.',
    },
  ],

  documentationTips: [
    'Log blood glucose readings daily - note highs and lows',
    'Track HbA1c results over time (every 3 months)',
    'Document all diabetes medications and insulin doses',
    'Record hypoglycemic episodes: symptoms, severity, what you did',
    'Note activities you must avoid or modify due to diabetes',
    'Track dietary restrictions and meal planning requirements',
    'Document any ER visits or hospitalizations for diabetes',
    'Record complications: numbness in feet, vision changes, kidney issues',
  ],

  keyTerms: {
    'Regulation of activities': 'Having to limit physical activities to prevent blood sugar problems - key for 40%+ rating',
    'Hypoglycemic reaction': 'Dangerous low blood sugar episode - document every one',
    'Ketoacidosis': 'Dangerous high blood sugar emergency - usually requires hospitalization',
    'HbA1c': 'Blood test showing average glucose over 3 months - higher numbers = worse control',
    'Complications': 'Diabetes damage to other body parts - rated separately (neuropathy, retinopathy, etc.)',
    'Insulin-dependent': 'Needing insulin injections vs oral medications only',
  },
};

// =============================================================================
// RADICULOPATHY - DC 8520 (Sciatic) / 8510-8719 (Various nerves)
// =============================================================================
const RADICULOPATHY_DESCRIPTION = {
  diagnosticCode: '8520',
  conditionName: 'Radiculopathy',

  evidenceLookingFor: [
    'Diagnosis of radiculopathy with specific nerve root involvement',
    'EMG/nerve conduction study results',
    'MRI showing nerve compression or disc herniation',
    'Documentation of radiating pain patterns',
    'Evidence of numbness, tingling in specific distributions',
    'Muscle weakness or atrophy documentation',
    'Reflex changes noted in medical records',
    'Correlation with spine condition (secondary claim potential)',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Mild incomplete paralysis',
      realWorld: 'Intermittent radiating pain or numbness. Symptoms come and go. Minimal effect on strength or reflexes.',
    },
    {
      percent: 20,
      meaning: 'Moderate incomplete paralysis',
      realWorld: 'Regular radiating pain with noticeable numbness. Some weakness detectable. Daily activities affected.',
    },
    {
      percent: 40,
      meaning: 'Moderately severe incomplete paralysis',
      realWorld: 'Frequent severe radiating pain. Significant numbness and weakness. Difficulty with activities requiring affected limb.',
    },
    {
      percent: 60,
      meaning: 'Severe incomplete paralysis with marked muscle atrophy',
      realWorld: 'Constant symptoms with visible muscle wasting. Major functional limitations. May need assistive devices.',
    },
    {
      percent: 80,
      meaning: 'Complete paralysis (for major nerves like sciatic)',
      realWorld: 'Total loss of function in affected nerve distribution. Foot drop, inability to move affected muscles.',
    },
  ],

  documentationTips: [
    'Track radiating pain: where it starts, where it travels, severity',
    'Document numbness and tingling - be specific about location',
    'Note muscle weakness: "Can\'t lift leg as high," "Grip strength reduced"',
    'Record activities affected: walking distance, standing tolerance',
    'Log frequency of symptoms - constant vs intermittent',
    'Document what makes symptoms worse (sitting, standing, activities)',
    'Track any muscle wasting - compare limb sizes',
    'Note relationship to spine condition for secondary claim',
  ],

  keyTerms: {
    'Radiculopathy': 'Nerve root damage causing pain, numbness, or weakness radiating to arms or legs',
    'Incomplete paralysis': 'Partial nerve damage - some function remains (most common VA finding)',
    'Complete paralysis': 'Total loss of nerve function - rare but highest rating',
    'Sciatic nerve': 'Major nerve to leg - rated under DC 8520, most common lower extremity radiculopathy',
    'Dermatomal pattern': 'Specific area of skin served by one nerve root - helps identify which nerve is affected',
    'EMG/NCS': 'Nerve testing that objectively documents nerve damage severity',
    'Secondary condition': 'Radiculopathy often claimed as secondary to spine condition',
  },
};

// =============================================================================
// GERD / HIATAL HERNIA - DC 7346
// =============================================================================
const GERD_DESCRIPTION = {
  diagnosticCode: '7346',
  conditionName: 'GERD / Hiatal Hernia',

  evidenceLookingFor: [
    'Diagnosis of GERD, hiatal hernia, or esophageal reflux',
    'Endoscopy or imaging confirming condition',
    'Documentation of symptoms: heartburn, regurgitation, chest pain',
    'Evidence of dysphagia (difficulty swallowing)',
    'Weight loss documentation if applicable',
    'Anemia related to condition (if applicable)',
    'Treatment history: medications, dietary modifications, surgery',
    'Impact on daily activities and eating habits',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Two or more symptoms of less severity',
      realWorld: 'You have recurring heartburn and regurgitation but symptoms are manageable with medication. Occasional discomfort.',
    },
    {
      percent: 30,
      meaning: 'Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation with substernal/arm/shoulder pain, considerable impairment of health',
      realWorld: 'Frequent symptoms despite treatment. Difficulty swallowing, regular chest pain, and noticeably affected overall health.',
    },
    {
      percent: 60,
      meaning: 'Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia, or other symptom combinations productive of severe impairment of health',
      realWorld: 'Severe GERD causing significant weight loss, blood in vomit or stool, anemia. Major impact on quality of life.',
    },
  ],

  documentationTips: [
    'Log every reflux episode - note timing, severity, and what triggered it',
    'Document regurgitation events: "Food came back up after eating"',
    'Track difficulty swallowing - what foods, how often',
    'Record substernal (chest) pain episodes and arm/shoulder radiation',
    'Document weight changes - weigh weekly and track trends',
    'Note foods you must avoid and dietary restrictions',
    'Log sleep disruption from nighttime reflux',
    'Track medication usage and whether symptoms are controlled',
  ],

  keyTerms: {
    'Pyrosis': 'Medical term for heartburn - burning sensation in chest/throat',
    'Regurgitation': 'Food or acid coming back up into throat or mouth',
    'Dysphagia': 'Difficulty swallowing - key symptom for higher ratings',
    'Substernal pain': 'Pain behind the breastbone - can radiate to arm/shoulder',
    'Hematemesis': 'Blood in vomit - indicates severe condition',
    'Melena': 'Black, tarry stool indicating blood - sign of serious GERD complications',
    'Epigastric distress': 'Pain/discomfort in upper abdomen area',
  },
};

// =============================================================================
// ASTHMA - DC 6602
// =============================================================================
const ASTHMA_DESCRIPTION = {
  diagnosticCode: '6602',
  conditionName: 'Asthma',

  evidenceLookingFor: [
    'Pulmonary function test (PFT) results - FEV-1 and FEV-1/FVC',
    'Documentation of asthma attacks and frequency',
    'Medication requirements: inhalers, nebulizers, corticosteroids',
    'Emergency room visits or hospitalizations for asthma',
    'Evidence of daily or systemic corticosteroid use',
    'Impact on physical activities and exercise tolerance',
    'Triggers documented and avoidance measures',
    'Peak flow meter readings if available',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FEV-1 of 71-80% predicted, OR FEV-1/FVC of 71-80%, OR intermittent inhalational or oral bronchodilator therapy',
      realWorld: 'Mild asthma - occasional symptoms controlled with rescue inhaler. Minor limitation on activities.',
    },
    {
      percent: 30,
      meaning: 'FEV-1 of 56-70% predicted, OR FEV-1/FVC of 56-70%, OR daily inhalational or oral bronchodilator therapy, OR inhalational anti-inflammatory medication',
      realWorld: 'Moderate asthma requiring daily maintenance medications. Noticeable breathing limitations.',
    },
    {
      percent: 60,
      meaning: 'FEV-1 of 40-55% predicted, OR FEV-1/FVC of 40-55%, OR at least monthly visits for required care of exacerbations, OR intermittent (at least 3x/year) courses of systemic corticosteroids',
      realWorld: 'Significant asthma with frequent exacerbations requiring regular medical care or steroid bursts.',
    },
    {
      percent: 100,
      meaning: 'FEV-1 less than 40% predicted, OR FEV-1/FVC less than 40%, OR more than one attack per week with episodes of respiratory failure, OR requires daily use of systemic corticosteroids or immunosuppressive medications',
      realWorld: 'Severe asthma with very limited lung function. Frequent attacks, daily steroids, or respiratory failure episodes.',
    },
  ],

  documentationTips: [
    'Keep copies of ALL pulmonary function test (PFT) results',
    'Log every asthma attack: date, severity, duration, what you did',
    'Document all medications - daily controllers and rescue inhaler use',
    'Track how often you use your rescue inhaler each week',
    'Record any ER visits or hospitalizations for asthma',
    'Note physical activities limited by breathing problems',
    'Document steroid use: oral prednisone bursts, frequency, duration',
    'Track triggers and how they affect your daily life',
  ],

  keyTerms: {
    'FEV-1': 'Forced Expiratory Volume in 1 second - how much air you can blow out quickly. Lower % = worse asthma',
    'FEV-1/FVC': 'Ratio comparing FEV-1 to total lung capacity - key diagnostic measure',
    'Bronchodilator': 'Medication that opens airways - rescue inhalers like albuterol',
    'Corticosteroids': 'Anti-inflammatory steroids - inhaled (Flovent) or oral (prednisone). Systemic = pills/shots',
    'Exacerbation': 'Asthma flare-up or attack requiring extra treatment',
    'PFT': 'Pulmonary Function Test - breathing test that measures lung capacity',
  },
};

// =============================================================================
// ECZEMA / DERMATITIS - DC 7806
// =============================================================================
const ECZEMA_DESCRIPTION = {
  diagnosticCode: '7806',
  conditionName: 'Eczema / Dermatitis',

  evidenceLookingFor: [
    'Diagnosis of eczema, dermatitis, or atopic dermatitis',
    'Documentation of body surface area affected',
    'Evidence of exposed areas affected (face, neck, hands)',
    'Treatment history: topical steroids, immunosuppressants',
    'Photographs showing extent of condition during flares',
    'Evidence of systemic therapy if used',
    'Impact on daily activities and sleep',
    'Frequency and duration of flare-ups',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body or exposed areas, no more than topical therapy in past 12 months',
      realWorld: 'Minor eczema affecting small areas, controlled with over-the-counter creams.',
    },
    {
      percent: 10,
      meaning: 'At least 5% but less than 20% of body or exposed areas, OR intermittent systemic therapy such as corticosteroids or immunosuppressive drugs less than 6 weeks in past 12 months',
      realWorld: 'Moderate eczema covering noticeable areas, or requiring occasional prescription steroids.',
    },
    {
      percent: 30,
      meaning: '20-40% of body or exposed areas, OR systemic therapy 6+ weeks but not constant in past 12 months',
      realWorld: 'Significant eczema covering large areas or requiring regular steroid/immunosuppressant treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body or exposed areas, OR constant/near-constant systemic therapy in past 12 months',
      realWorld: 'Severe eczema covering most of body or requiring continuous systemic treatment.',
    },
  ],

  documentationTips: [
    'Estimate percentage of body affected - use body diagram if helpful',
    'Take photos during flare-ups showing extent of rash',
    'Document exposed areas separately: face, neck, hands',
    'Track all treatments: creams, ointments, oral medications',
    'Log systemic therapy: what medication, how long, how often',
    'Note symptoms: itching intensity, sleep disruption, bleeding/cracking',
    'Record work/activity limitations from skin condition',
    'Document infections or complications from scratching',
  ],

  keyTerms: {
    'Body surface area': 'Percentage of skin affected - palm of hand ≈ 1% of body',
    'Exposed areas': 'Face, neck, hands - areas not normally covered by clothing',
    'Topical therapy': 'Creams and ointments applied to skin',
    'Systemic therapy': 'Pills, shots, or infusions that work throughout body - key for higher ratings',
    'Corticosteroids': 'Steroid medications - topical (creams) or systemic (prednisone)',
    'Immunosuppressive drugs': 'Medications like methotrexate, cyclosporine - indicate severe condition',
  },
};

// =============================================================================
// IBS - IRRITABLE BOWEL SYNDROME - DC 7319
// =============================================================================
const IBS_DESCRIPTION = {
  diagnosticCode: '7319',
  conditionName: 'Irritable Bowel Syndrome',

  evidenceLookingFor: [
    'Diagnosis of IBS from gastroenterologist',
    'Documentation of bowel habit patterns (diarrhea, constipation, alternating)',
    'Frequency of episodes and symptoms',
    'Abdominal pain and distress documentation',
    'Impact on diet and eating habits',
    'Evidence of weight loss if applicable',
    'Treatment history and response',
    'Impact on work and daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Mild - disturbances of bowel function with occasional episodes of abdominal distress',
      realWorld: 'Occasional IBS symptoms that minimally affect daily life. Manageable with diet changes.',
    },
    {
      percent: 10,
      meaning: 'Moderate - frequent episodes of bowel disturbance with abdominal distress',
      realWorld: 'Regular IBS symptoms several times a week. Noticeable impact on activities and diet planning.',
    },
    {
      percent: 30,
      meaning: 'Severe - diarrhea or alternating diarrhea and constipation with more or less constant abdominal distress',
      realWorld: 'Near-constant symptoms. Daily planning around bathroom access. Significant quality of life impact.',
    },
  ],

  documentationTips: [
    'Track bowel movements daily: frequency, consistency, urgency',
    'Document diarrhea episodes: how many times per day, duration',
    'Log constipation: days without bowel movement, difficulty',
    'Record abdominal pain: location, severity, frequency',
    'Note bloating and gas episodes',
    'Track foods that trigger symptoms',
    'Document impact on work: bathroom breaks, missed work, accidents',
    'Log activities you avoid due to IBS (travel, events, etc.)',
  ],

  keyTerms: {
    'Bowel disturbance': 'Abnormal bowel patterns - diarrhea, constipation, or both',
    'Abdominal distress': 'Pain, cramping, bloating in the abdomen',
    'Alternating pattern': 'Switching between diarrhea and constipation - common in IBS',
    'Functional GI disorder': 'IBS is classified as functional - no structural cause found',
    'Frequency': 'How often symptoms occur - key factor in rating determination',
  },
};

// =============================================================================
// KNEE / JOINT CONDITIONS - DC 5003, 5010, 5256-5263
// =============================================================================
const JOINT_DESCRIPTION = {
  diagnosticCode: '5003',
  conditionName: 'Joint Conditions (Knee, Ankle, etc.)',

  evidenceLookingFor: [
    'Diagnosis of arthritis, degenerative joint disease, or specific joint condition',
    'Range of motion measurements (flexion and extension)',
    'X-ray or MRI evidence of joint damage',
    'Documentation of painful motion',
    'Evidence of instability, subluxation, or locking',
    'Functional limitations during flare-ups',
    'Use of assistive devices (brace, cane, etc.)',
    'Impact on walking, standing, and daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Painful motion or X-ray evidence with noncompensable limitation, OR slight instability',
      realWorld: 'Joint pain with movement. Some limitation but still functional. Occasional instability or giving way.',
    },
    {
      percent: 20,
      meaning: 'Moderate limitation of motion, OR moderate instability, OR dislocated cartilage with frequent locking/pain',
      realWorld: 'Noticeable limitation in bending or straightening. Regular episodes of giving way or locking.',
    },
    {
      percent: 30,
      meaning: 'Severe limitation of motion, OR severe instability',
      realWorld: 'Major difficulty with joint movement. Significant instability affecting walking and daily activities.',
    },
    {
      percent: 40,
      meaning: 'Extremely unfavorable ankylosis or severe impairment',
      realWorld: 'Joint is nearly frozen or extremely limited. Major functional impairment.',
    },
  ],

  documentationTips: [
    'Record range of motion: how far you can bend and straighten',
    'Document pain during movement: when it starts, severity',
    'Track instability episodes: "Knee gave out while walking"',
    'Note locking or catching sensations',
    'Log flare-ups: duration, additional limitations during flares',
    'Document use of braces, canes, or other supports',
    'Track walking tolerance: distance before pain stops you',
    'Note activities you can no longer do or must modify',
  ],

  keyTerms: {
    'Range of motion (ROM)': 'How far joint moves - measured in degrees. Flexion = bending, Extension = straightening',
    'Ankylosis': 'Joint is frozen/immobile - highest ratings',
    'Instability': 'Joint gives way or feels unstable - rated under DC 5257',
    'Subluxation': 'Partial dislocation - joint slips out of place',
    'Degenerative arthritis': 'Wear-and-tear arthritis - rated under DC 5003',
    'Painful motion': 'Pain during movement - can support rating even with full ROM',
    'DeLuca factors': 'Additional functional loss from pain, weakness, fatigability during flare-ups',
  },
};

// =============================================================================
// SINUSITIS - DC 6513/6514
// =============================================================================
const SINUSITIS_DESCRIPTION = {
  diagnosticCode: '6513',
  conditionName: 'Chronic Sinusitis',

  evidenceLookingFor: [
    'Diagnosis of chronic sinusitis (maxillary, frontal, ethmoid, etc.)',
    'CT scan or imaging showing sinus involvement',
    'Documentation of incapacitating episodes requiring bed rest/physician care',
    'Non-incapacitating episodes with symptoms',
    'Antibiotic treatment courses per year',
    'Evidence of headaches, pain, and purulent discharge',
    'Surgical history if applicable',
    'Impact on daily activities and work',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Detected by X-ray only',
      realWorld: 'Sinusitis shows on imaging but causes minimal or no symptoms.',
    },
    {
      percent: 10,
      meaning: 'One or two incapacitating episodes per year requiring prolonged antibiotic treatment, OR three to six non-incapacitating episodes per year with headaches, pain, and purulent discharge or crusting',
      realWorld: 'Occasional severe sinus infections requiring antibiotics, or regular episodes with noticeable symptoms.',
    },
    {
      percent: 30,
      meaning: 'Three or more incapacitating episodes per year requiring prolonged antibiotic treatment, OR more than six non-incapacitating episodes per year',
      realWorld: 'Frequent severe sinus infections or near-constant symptoms affecting quality of life.',
    },
    {
      percent: 50,
      meaning: 'Following radical surgery with chronic osteomyelitis, OR near-constant sinusitis with headaches, pain, tenderness, and purulent discharge after repeated surgeries',
      realWorld: 'Severe, treatment-resistant sinusitis despite surgery. Continuous symptoms affecting daily function.',
    },
  ],

  documentationTips: [
    'Track EVERY sinus infection episode - date, duration, severity',
    'Document incapacitating episodes: "Had to stay in bed," "Missed work"',
    'Log antibiotic prescriptions: medication name, duration, frequency',
    'Record symptoms: headache location/severity, facial pain, discharge color',
    'Note purulent (yellow/green) discharge vs clear drainage',
    'Track non-incapacitating episodes separately from severe ones',
    'Document medical visits for sinus treatment',
    'Keep copies of CT scans and imaging reports',
  ],

  keyTerms: {
    'Incapacitating episode': 'Sinus infection severe enough to require bed rest AND prolonged antibiotics (4+ weeks) - key for higher ratings',
    'Non-incapacitating episode': 'Sinus infection with symptoms but not requiring bed rest',
    'Purulent discharge': 'Yellow or green nasal discharge indicating infection',
    'Prolonged antibiotic treatment': 'Usually means 4-6 weeks of antibiotics',
    'Crusting': 'Dried discharge in nasal passages',
    'Osteomyelitis': 'Bone infection - rare but indicates severe chronic disease',
  },
};

// =============================================================================
// PLANTAR FASCIITIS / FLATFOOT - DC 5276/5284
// =============================================================================
const PLANTAR_FASCIITIS_DESCRIPTION = {
  diagnosticCode: '5276',
  conditionName: 'Plantar Fasciitis / Flatfoot',

  evidenceLookingFor: [
    'Diagnosis of plantar fasciitis, flatfoot (pes planus), or related foot condition',
    'Documentation of pain on use and manipulation',
    'Evidence of swelling, calluses, or characteristic deformities',
    'Use of orthotics or special footwear',
    'Impact on weight-bearing activities',
    'Bilateral vs unilateral involvement',
    'Treatment history: injections, physical therapy, surgery',
    'Functional limitations on standing and walking',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Mild - symptoms relieved by arch supports',
      realWorld: 'Foot pain that goes away with proper footwear or basic inserts.',
    },
    {
      percent: 10,
      meaning: 'Moderate - weight-bearing line over or medial to great toe, inward bowing of Achilles, pain on manipulation and use (unilateral)',
      realWorld: 'Regular foot pain with standing/walking. Visible arch flattening. Need for supportive footwear.',
    },
    {
      percent: 20,
      meaning: 'Moderate bilateral (both feet)',
      realWorld: 'Both feet affected with regular pain and visible deformity.',
    },
    {
      percent: 30,
      meaning: 'Severe - marked deformity, pain on manipulation/use, swelling, calluses, not improved by orthotics (unilateral)',
      realWorld: 'Significant foot problems with visible changes. Orthotics don\'t fully help. Major walking limitations.',
    },
    {
      percent: 50,
      meaning: 'Pronounced bilateral - extreme tenderness, marked deformity, not improved by orthotics',
      realWorld: 'Severe bilateral foot condition causing major disability. Extreme difficulty with any weight-bearing.',
    },
  ],

  documentationTips: [
    'Track "first step" morning pain - classic plantar fasciitis symptom',
    'Document pain severity throughout the day',
    'Log standing tolerance: how long before pain forces you to sit',
    'Record walking distance limitations',
    'Note orthotics/inserts used and whether they help',
    'Document any swelling, especially after activity',
    'Track activities you avoid due to foot pain',
    'Note if both feet affected (bilateral = higher rating)',
  ],

  keyTerms: {
    'Weight-bearing line': 'Where your weight falls on your foot when standing - medial shift indicates flatfoot',
    'Achilles bowing': 'Inward curve of Achilles tendon - sign of flatfoot',
    'Manipulation': 'Moving the foot - VA checks for pain during exam',
    'Orthotics': 'Custom or OTC shoe inserts - if they don\'t help, higher rating possible',
    'Bilateral': 'Both feet affected - doubles the rating for moderate/severe',
    'Pronation': 'Foot rolling inward - common with flatfoot',
  },
};

// =============================================================================
// SCARS - DC 7800-7805
// =============================================================================
const SCARS_DESCRIPTION = {
  diagnosticCode: '7800',
  conditionName: 'Scars',

  evidenceLookingFor: [
    'Location of scars (head/face/neck vs other areas)',
    'Size measurements in square centimeters or square inches',
    'Evidence of pain or tenderness on examination',
    'Unstable scars (frequent loss of skin covering)',
    'Disfigurement characteristics for head/face/neck scars',
    'Functional limitation caused by scar',
    'Photographs showing scar characteristics',
    'Treatment history and surgical records',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'One or two scars that are unstable or painful, OR deep nonlinear scar 6-12 sq in, OR superficial nonlinear scar 144+ sq in',
      realWorld: 'Scars that hurt regularly or break open, OR moderately large deep scars, OR very large superficial scars.',
    },
    {
      percent: 20,
      meaning: 'Three or four unstable or painful scars, OR deep nonlinear scar 12-72 sq in',
      realWorld: 'Multiple problem scars or large deep scars.',
    },
    {
      percent: 30,
      meaning: 'Five or more unstable or painful scars, OR deep nonlinear scar 72-144 sq in, OR head/face/neck with visible disfigurement',
      realWorld: 'Many painful/unstable scars, very large deep scars, or noticeable facial disfigurement.',
    },
    {
      percent: 80,
      meaning: 'Head/face/neck scars with gross distortion or asymmetry of features, OR six or more characteristics of disfigurement',
      realWorld: 'Severe facial disfigurement significantly affecting appearance.',
    },
  ],

  documentationTips: [
    'Measure each scar: length x width in inches or centimeters',
    'Calculate area: length × width = square inches/cm',
    'Document pain: constant vs intermittent, severity',
    'Note instability: how often skin breaks open, requires treatment',
    'Take clear photographs with ruler for scale',
    'For face/neck scars: document any asymmetry or distortion',
    'Note functional limitations: restricted movement, sensitivity',
    'Track if scars require ongoing treatment',
  ],

  keyTerms: {
    'Unstable scar': 'Scar that frequently loses its covering of skin - reopens, bleeds, scabs over',
    'Painful scar': 'Scar tender to touch or causes pain - even intermittent pain counts',
    'Deep scar': 'Scar associated with underlying tissue damage',
    'Superficial scar': 'Scar not associated with underlying tissue damage',
    'Linear scar': 'Thin, line-like scar (like from a surgical incision)',
    'Nonlinear scar': 'Wide, irregular, or spreading scar - rated by area',
    'Characteristics of disfigurement': 'Specific features VA counts for face/neck scars: color, texture, contour, etc.',
  },
};

// =============================================================================
// PERIPHERAL NEUROPATHY - DC 8521-8525
// =============================================================================
const PERIPHERAL_NEUROPATHY_DESCRIPTION = {
  diagnosticCode: '8521',
  conditionName: 'Peripheral Neuropathy',

  evidenceLookingFor: [
    'Diagnosis of peripheral neuropathy with specific nerves identified',
    'EMG/nerve conduction study results',
    'Documentation of sensory symptoms: numbness, tingling, burning',
    'Evidence of motor symptoms: weakness, muscle wasting',
    'Distribution of symptoms (which extremities/areas)',
    'Underlying cause if known (diabetes, toxic exposure, etc.)',
    'Impact on grip strength, balance, walking',
    'Medication and treatment history',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Mild incomplete paralysis',
      realWorld: 'Intermittent numbness or tingling. Minor sensory changes. Minimal functional impact.',
    },
    {
      percent: 20,
      meaning: 'Moderate incomplete paralysis',
      realWorld: 'Regular numbness affecting sensation. Some weakness. Difficulty with fine motor tasks.',
    },
    {
      percent: 30,
      meaning: 'Moderately severe incomplete paralysis',
      realWorld: 'Significant sensory loss. Noticeable weakness. Affects daily activities like gripping, walking.',
    },
    {
      percent: 40,
      meaning: 'Severe incomplete paralysis',
      realWorld: 'Major sensory and motor deficits. Muscle wasting visible. Significant functional limitations.',
    },
    {
      percent: 60,
      meaning: 'Complete paralysis (for major nerves)',
      realWorld: 'Total loss of function in affected nerve distribution. Severe disability.',
    },
  ],

  documentationTips: [
    'Track numbness: location, severity, how often it occurs',
    'Document tingling and burning sensations',
    'Note temperature sensitivity: feet feel cold, can\'t feel hot/cold',
    'Record weakness: difficulty gripping, dropping things, tripping',
    'Track balance problems and falls',
    'Document impact on walking and standing',
    'Note which extremities affected - rated separately per limb',
    'Keep copies of EMG/nerve conduction test results',
  ],

  keyTerms: {
    'Incomplete paralysis': 'Partial nerve damage - most common VA finding',
    'Complete paralysis': 'Total nerve function loss - highest rating',
    'Sensory neuropathy': 'Affects sensation - numbness, tingling, burning',
    'Motor neuropathy': 'Affects muscle strength and control',
    'EMG': 'Electromyography - test measuring muscle electrical activity',
    'Nerve conduction study': 'Test measuring how fast nerves transmit signals',
    'Bilateral': 'Both sides affected - each side rated separately',
  },
};

// =============================================================================
// RHINITIS - DC 6522
// =============================================================================
const RHINITIS_DESCRIPTION = {
  diagnosticCode: '6522',
  conditionName: 'Allergic/Vasomotor Rhinitis',

  evidenceLookingFor: [
    'Diagnosis of allergic rhinitis or vasomotor rhinitis',
    'Documentation of nasal obstruction (percentage and side affected)',
    'Evidence of nasal polyps if present',
    'Frequency and severity of symptoms',
    'Medication requirements: antihistamines, nasal steroids',
    'Allergy testing results if performed',
    'Impact on breathing, sleep, and daily activities',
    'Treatment history and response',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Without polyps but with greater than 50% obstruction of nasal passage on both sides OR complete obstruction on one side',
      realWorld: 'Significant nasal blockage affecting breathing. Regular congestion requiring medication.',
    },
    {
      percent: 30,
      meaning: 'With polyps',
      realWorld: 'Nasal polyps present, causing chronic obstruction. May require surgical intervention.',
    },
  ],

  documentationTips: [
    'Document nasal obstruction: which side(s), estimated percentage blocked',
    'Track breathing difficulty through nose vs mouth breathing',
    'Log medication use: antihistamines, nasal sprays, frequency',
    'Note sleep disruption from nasal congestion',
    'Document any polyps diagnosed by ENT',
    'Record allergy triggers and seasonal patterns',
    'Track frequency of symptoms: constant vs intermittent',
    'Note impact on smell and taste',
  ],

  keyTerms: {
    'Nasal obstruction': 'Blockage of nasal passages - key rating criteria',
    '50% obstruction': 'Half or more of nasal passage blocked - threshold for 10%',
    'Complete obstruction': 'Totally blocked on one side - also qualifies for 10%',
    'Nasal polyps': 'Growths in nasal passages - automatic 30% rating',
    'Allergic rhinitis': 'Caused by allergies - hay fever, dust, pet dander',
    'Vasomotor rhinitis': 'Non-allergic - triggered by irritants, temperature, etc.',
  },
};

// =============================================================================
// COPD - DC 6604
// =============================================================================
const COPD_DESCRIPTION = {
  diagnosticCode: '6604',
  conditionName: 'COPD (Chronic Obstructive Pulmonary Disease)',

  evidenceLookingFor: [
    'Pulmonary function test (PFT) results - FEV-1, FEV-1/FVC ratio, DLCO',
    'Diagnosis of COPD, chronic bronchitis, or emphysema',
    'Documentation of oxygen therapy requirements',
    'Evidence of cor pulmonale (right heart failure)',
    'Frequency of respiratory infections/exacerbations',
    'Exercise tolerance and functional limitations',
    'Smoking history and cessation efforts',
    'Medication requirements: inhalers, nebulizers, steroids',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FEV-1 of 71-80% predicted, OR FEV-1/FVC of 71-80%, OR DLCO of 66-80% predicted',
      realWorld: 'Mild COPD - some breathing limitation with exertion but manageable daily activities.',
    },
    {
      percent: 30,
      meaning: 'FEV-1 of 56-70% predicted, OR FEV-1/FVC of 56-70%, OR DLCO of 56-65% predicted',
      realWorld: 'Moderate COPD - noticeable shortness of breath with activity. Regular inhaler use needed.',
    },
    {
      percent: 60,
      meaning: 'FEV-1 of 40-55% predicted, OR FEV-1/FVC of 40-55%, OR DLCO of 40-55% predicted, OR maximum oxygen consumption 15-20 ml/kg/min',
      realWorld: 'Severe COPD - significant breathing limitations. May need oxygen with exertion.',
    },
    {
      percent: 100,
      meaning: 'FEV-1 less than 40%, OR FEV-1/FVC less than 40%, OR DLCO less than 40%, OR maximum exercise capacity less than 15 ml/kg/min, OR cor pulmonale, OR requires outpatient oxygen therapy',
      realWorld: 'Very severe COPD - severely limited. Requires continuous oxygen or has heart complications.',
    },
  ],

  documentationTips: [
    'Keep ALL pulmonary function test results - FEV-1 is critical',
    'Track oxygen saturation levels if you monitor at home',
    'Document shortness of breath: triggers, severity, frequency',
    'Log exacerbations requiring steroids or antibiotics',
    'Note walking distance before needing to rest',
    'Record stairs climbed before becoming winded',
    'Document oxygen use: flow rate, hours per day',
    'Track hospitalizations for COPD flare-ups',
  ],

  keyTerms: {
    'FEV-1': 'Forced Expiratory Volume in 1 second - main measure of airflow obstruction',
    'FEV-1/FVC ratio': 'Comparison of FEV-1 to total lung capacity - under 70% = obstruction',
    'DLCO': 'Diffusing capacity - how well oxygen passes from lungs to blood',
    'Cor pulmonale': 'Right-sided heart failure from lung disease - qualifies for 100%',
    'Oxygen therapy': 'Supplemental oxygen - if needed continuously, qualifies for 100%',
    'Post-bronchodilator': 'PFT results after using inhaler - this is what VA uses for rating',
  },
};

// =============================================================================
// SHOULDER CONDITIONS - DC 5200-5203
// =============================================================================
const SHOULDER_DESCRIPTION = {
  diagnosticCode: '5201',
  conditionName: 'Shoulder Conditions',

  evidenceLookingFor: [
    'Range of motion measurements (flexion, abduction)',
    'Documentation of dominant vs non-dominant arm',
    'X-ray or MRI findings',
    'Evidence of rotator cuff injury or arthritis',
    'Painful motion documentation',
    'Functional limitations with overhead activities',
    'History of dislocations or instability',
    'Use of sling or other supportive devices',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Arm limited to shoulder level (90°) - major/dominant arm, OR arm limited to midway between side and shoulder - minor arm',
      realWorld: 'Cannot raise arm above shoulder height. Difficulty reaching overhead shelves, cabinets.',
    },
    {
      percent: 30,
      meaning: 'Arm limited to shoulder level (90°) - minor arm, OR arm limited to midway between side and shoulder - major arm',
      realWorld: 'Significant shoulder limitation affecting daily activities. Depends on which arm and dominance.',
    },
    {
      percent: 40,
      meaning: 'Arm limited to 25° from side - major arm',
      realWorld: 'Severe limitation - can barely lift dominant arm away from body. Major functional impairment.',
    },
  ],

  documentationTips: [
    'Document which arm is affected AND which is your dominant arm',
    'Track range of motion: how high can you raise your arm?',
    'Note pain onset point: "Pain starts at 60 degrees"',
    'Log activities limited: reaching, lifting, dressing',
    'Document flare-ups with additional ROM loss',
    'Track pain severity and frequency',
    'Note if you use a sling or brace',
    'Record overhead activities you can no longer do',
  ],

  keyTerms: {
    'Major/dominant arm': 'Your dominant hand side - rated higher because more functional impact',
    'Minor arm': 'Non-dominant side - rated slightly lower',
    'Shoulder level': '90 degrees - arm straight out to side, parallel to ground',
    '25&deg; from side': 'Severe limitation - arm can barely move away from body',
    'Ankylosis': 'Frozen shoulder - joint completely immobile - highest ratings',
    'Impingement': 'Soft tissue caught in joint - causes pain with certain movements',
  },
};

// =============================================================================
// HIP CONDITIONS - DC 5250-5255
// =============================================================================
const HIP_DESCRIPTION = {
  diagnosticCode: '5252',
  conditionName: 'Hip Conditions',

  evidenceLookingFor: [
    'Range of motion measurements (flexion, extension, abduction)',
    'X-ray or MRI showing joint damage',
    'Documentation of painful motion',
    'Evidence of arthritis or degenerative changes',
    'Functional limitations with walking, standing, sitting',
    'Use of assistive devices (cane, walker)',
    'History of hip replacement if applicable',
    'Impact on gait and mobility',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Flexion limited to 45°, OR extension limited to 5°',
      realWorld: 'Noticeable hip stiffness. Difficulty with deep bending or straightening leg fully.',
    },
    {
      percent: 20,
      meaning: 'Flexion limited to 30°, OR limitation of abduction (cannot cross legs, toe-out more than 15°)',
      realWorld: 'Significant hip limitation. Cannot bend hip normally. Difficulty crossing legs.',
    },
    {
      percent: 30,
      meaning: 'Flexion limited to 20°, OR limitation of adduction (cannot cross legs)',
      realWorld: 'Severe hip limitation affecting walking, sitting, and most lower body activities.',
    },
    {
      percent: 40,
      meaning: 'Flexion limited to 10°',
      realWorld: 'Very severe - hip barely bends. Major difficulty with stairs, sitting, walking.',
    },
  ],

  documentationTips: [
    'Track hip flexion: how far can you bend your hip (bring knee to chest)?',
    'Note pain with different movements: walking, sitting, stairs',
    'Document walking distance before pain stops you',
    'Log use of cane, walker, or other aids',
    'Track morning stiffness duration',
    'Note difficulty getting in/out of car, chairs',
    'Document limping or altered gait',
    'Record activities you avoid due to hip pain',
  ],

  keyTerms: {
    'Flexion': 'Bending hip - bringing knee toward chest. Normal is 125°',
    'Extension': 'Straightening/moving leg backward. Normal is 0-30°',
    'Abduction': 'Moving leg outward, away from body',
    'Adduction': 'Moving leg inward, crossing over other leg',
    'Ankylosis': 'Hip joint frozen in one position - highest ratings',
    'Flail joint': 'Unstable joint with excessive movement - after failed replacement',
  },
};

// =============================================================================
// MENIERE'S DISEASE - DC 6205
// =============================================================================
const MENIERES_DESCRIPTION = {
  diagnosticCode: '6205',
  conditionName: "Meniere's Disease",

  evidenceLookingFor: [
    'Diagnosis of Meniere\'s disease from ENT specialist',
    'Documentation of vertigo attacks (frequency, duration)',
    'Evidence of hearing loss (audiometry)',
    'Tinnitus documentation',
    'Cerebellar gait disturbance if present',
    'Impact on balance and daily functioning',
    'Treatment history and response',
    'Frequency of attacks requiring bed rest',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Hearing impairment with vertigo less than once a month, with or without tinnitus',
      realWorld: 'Occasional vertigo attacks with hearing issues. Symptoms manageable most of the time.',
    },
    {
      percent: 60,
      meaning: 'Hearing impairment with attacks of vertigo and cerebellar gait occurring 1-4 times monthly, with or without tinnitus',
      realWorld: 'Regular vertigo attacks affecting balance and gait. Monthly episodes disrupt normal activities.',
    },
    {
      percent: 100,
      meaning: 'Hearing impairment with attacks of vertigo and cerebellar gait occurring more than once weekly, with or without tinnitus',
      realWorld: 'Frequent severe attacks - weekly or more. Major disability affecting all daily activities.',
    },
  ],

  documentationTips: [
    'Track EVERY vertigo attack: date, duration, severity',
    'Document what you were doing when attack occurred',
    'Note if attack caused falls or near-falls',
    'Record how long until you could function normally',
    'Track hearing changes - fluctuating hearing is common',
    'Document tinnitus: constant vs intermittent, severity',
    'Log days missed from work or activities',
    'Note any cerebellar gait issues: staggering, imbalance',
  ],

  keyTerms: {
    'Vertigo': 'Spinning sensation - room spinning or you spinning. Different from dizziness',
    'Cerebellar gait': 'Staggering, unsteady walking like being intoxicated - key for higher ratings',
    'Tinnitus': 'Ringing in ears - common with Meniere\'s, rated separately if not part of Meniere\'s',
    'Fluctuating hearing': 'Hearing that gets better and worse - characteristic of Meniere\'s',
    'Aural fullness': 'Feeling of pressure or fullness in ear',
    'Attack frequency': 'How often you have vertigo episodes - determines rating level',
  },
};

// =============================================================================
// EAR CONDITIONS - DC 6200, 6201, 6204, 6210
// =============================================================================
const EAR_CONDITIONS_DESCRIPTION = {
  diagnosticCode: '6204',
  conditionName: 'Ear Conditions (Vestibular, Otitis)',

  evidenceLookingFor: [
    'Diagnosis specifying type of ear condition',
    'Objective findings: nystagmus, abnormal vestibular testing',
    'Documentation of dizziness or vertigo episodes',
    'Evidence of discharge or drainage if applicable',
    'Hearing test results',
    'Treatment history: medications, procedures',
    'Impact on balance and daily activities',
    'Frequency and severity of symptoms',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Peripheral vestibular: occasional dizziness, OR chronic otitis media/externa meeting criteria',
      realWorld: 'Occasional balance issues or chronic ear infections requiring ongoing treatment.',
    },
    {
      percent: 30,
      meaning: 'Peripheral vestibular: dizziness AND occasional staggering',
      realWorld: 'Regular dizziness affecting balance. Episodes of unsteady walking.',
    },
  ],

  documentationTips: [
    'Track dizziness episodes: frequency, duration, triggers',
    'Document staggering or balance problems',
    'Note any ear discharge: color, frequency, amount',
    'Record treatments: ear drops, antibiotics, procedures',
    'Log impact on driving, work, daily activities',
    'Track hearing changes associated with condition',
    'Document falls or near-falls from balance issues',
    'Note if symptoms are constant vs episodic',
  ],

  keyTerms: {
    'Peripheral vestibular disorder': 'Inner ear balance problems causing dizziness - DC 6204',
    'Suppurative otitis media': 'Middle ear infection with pus/drainage - DC 6200',
    'Otitis externa': 'Outer ear canal infection/inflammation - DC 6210',
    'Nystagmus': 'Involuntary eye movements - objective sign of vestibular problem',
    'Staggering': 'Unsteady, lurching walk - key for 30% vestibular rating',
    'Aural polyp': 'Growth in ear canal from chronic infection',
  },
};

// =============================================================================
// CORONARY ARTERY DISEASE - DC 7005
// =============================================================================
const CAD_DESCRIPTION = {
  diagnosticCode: '7005',
  conditionName: 'Coronary Artery Disease',

  evidenceLookingFor: [
    'Diagnosis of CAD, ischemic heart disease, or angina',
    'Cardiac workload capacity in METs (metabolic equivalents)',
    'Stress test or exercise tolerance testing results',
    'Echocardiogram showing ejection fraction',
    'Evidence of heart attack history (myocardial infarction)',
    'Angiography or catheterization results',
    'Documentation of angina frequency and triggers',
    'Medication requirements and treatment history',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Workload of greater than 7 METs but not greater than 10 METs with dyspnea, fatigue, angina, dizziness, or syncope, OR continuous medication required',
      realWorld: 'Mild heart disease controlled with medication. Can do most activities but some limitations with heavy exertion.',
    },
    {
      percent: 30,
      meaning: 'Workload of greater than 5 METs but not greater than 7 METs with dyspnea, fatigue, angina, dizziness, or syncope, OR evidence of cardiac hypertrophy or dilatation on testing',
      realWorld: 'Moderate heart disease. Limited with moderate activities. Heart showing signs of strain.',
    },
    {
      percent: 60,
      meaning: 'More than one episode of acute congestive heart failure in past year, OR workload of greater than 3 METs but not greater than 5 METs with dyspnea, fatigue, angina, dizziness, or syncope, OR left ventricular dysfunction with ejection fraction of 30-50%',
      realWorld: 'Significant heart disease limiting most activities. History of heart failure or substantially reduced heart function.',
    },
    {
      percent: 100,
      meaning: 'Chronic congestive heart failure, OR workload of 3 METs or less with dyspnea, fatigue, angina, dizziness, or syncope, OR left ventricular dysfunction with ejection fraction less than 30%',
      realWorld: 'Severe heart disease. Cannot perform basic activities without symptoms. Severely reduced heart function.',
    },
  ],

  documentationTips: [
    'Keep ALL cardiac test results: stress tests, echocardiograms, catheterizations',
    'Track METs level from stress testing - this is key for rating',
    'Document angina episodes: triggers, frequency, severity',
    'Record ejection fraction from echocardiograms',
    'Log activities that cause shortness of breath or chest pain',
    'Track hospitalizations for heart-related issues',
    'Document all heart medications and dosages',
    'Note lifestyle limitations from heart condition',
  ],

  keyTerms: {
    'METs': 'Metabolic Equivalents - measure of energy/exertion. 1 MET = sitting quietly. 10 METs = running',
    'Ejection fraction': 'Percentage of blood pumped out with each heartbeat. Normal is 55-70%. Lower = worse',
    'Angina': 'Chest pain from reduced blood flow to heart',
    'Congestive heart failure': 'Heart cannot pump blood effectively - fluid builds up',
    'Cardiac hypertrophy': 'Enlarged/thickened heart muscle from strain',
    'Left ventricular dysfunction': 'Left side of heart not pumping properly',
  },
};

// =============================================================================
// SEIZURE DISORDERS / EPILEPSY - DC 8910/8911
// =============================================================================
const SEIZURE_DESCRIPTION = {
  diagnosticCode: '8910',
  conditionName: 'Epilepsy / Seizure Disorder',

  evidenceLookingFor: [
    'Diagnosis of epilepsy or seizure disorder from neurologist',
    'EEG results and findings',
    'Documentation of seizure types (grand mal vs petit mal)',
    'Seizure frequency and duration',
    'Witnesses to seizure events if available',
    'Medication history and effectiveness',
    'Impact on driving, work, daily activities',
    'Evidence of seizure-related injuries',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Confirmed diagnosis with history of seizures (major or minor)',
      realWorld: 'Diagnosed epilepsy with documented seizure history. May be controlled with medication.',
    },
    {
      percent: 20,
      meaning: 'At least 1 major seizure in last 2 years, OR at least 2 minor seizures in last 6 months',
      realWorld: 'Occasional breakthrough seizures despite treatment.',
    },
    {
      percent: 40,
      meaning: 'At least 1 major seizure in last 6 months, OR averaging 2+ minor seizures weekly, OR at least 5-8 minor seizures weekly',
      realWorld: 'Regular seizure activity affecting daily life. May have driving restrictions.',
    },
    {
      percent: 60,
      meaning: 'Averaging at least 1 major seizure in 4 months over last year, OR 9-10 minor seizures weekly',
      realWorld: 'Frequent seizures significantly impacting independence and activities.',
    },
    {
      percent: 80,
      meaning: 'Averaging at least 1 major seizure in 3 months over last year, OR more than 10 minor seizures weekly',
      realWorld: 'Very frequent seizures causing major disability.',
    },
    {
      percent: 100,
      meaning: 'Averaging at least 1 major seizure monthly over last year',
      realWorld: 'Monthly or more frequent major seizures. Unable to work or function independently.',
    },
  ],

  documentationTips: [
    'Keep a seizure diary: date, time, type, duration of EVERY seizure',
    'Note warning signs (aura) before seizures',
    'Document what happens during seizure: convulsions, loss of consciousness, confusion',
    'Record recovery time after each seizure',
    'Track medications and any missed doses',
    'Note witnesses who observed seizures',
    'Document injuries from seizures: falls, tongue biting',
    'Log impact on driving, work, activities',
  ],

  keyTerms: {
    'Major seizure (grand mal)': 'Generalized tonic-clonic seizure with convulsions and loss of consciousness',
    'Minor seizure (petit mal)': 'Absence seizures, partial seizures, psychomotor seizures',
    'Aura': 'Warning sensation before seizure - visual, smell, taste, or feeling',
    'Postictal state': 'Confusion/fatigue after seizure - important to document duration',
    'Breakthrough seizure': 'Seizure occurring despite taking medications',
    'Status epilepticus': 'Prolonged or repeated seizures - medical emergency',
  },
};

// =============================================================================
// CHRONIC FATIGUE SYNDROME - DC 6354
// =============================================================================
const CHRONIC_FATIGUE_DESCRIPTION = {
  diagnosticCode: '6354',
  conditionName: 'Chronic Fatigue Syndrome',

  evidenceLookingFor: [
    'Diagnosis of chronic fatigue syndrome (CFS/ME)',
    'Documentation of debilitating fatigue lasting 6+ months',
    'Evidence of cognitive impairment (brain fog)',
    'New-onset headaches documentation',
    'Muscle and joint pain without swelling',
    'Sleep disturbance not relieved by rest',
    'Post-exertional malaise lasting 24+ hours',
    'Exclusion of other conditions causing fatigue',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Signs and symptoms that wax and wane but result in periods of incapacitation of at least 1 but less than 2 weeks total during past 12 months, OR symptoms controlled by continuous medication',
      realWorld: 'Manageable CFS with occasional bad periods. Medication helps control symptoms.',
    },
    {
      percent: 20,
      meaning: 'Signs and symptoms that are nearly constant and restrict routine daily activities by less than 25% of pre-illness level, OR require periods of incapacitation of 2 to less than 4 weeks total during past 12 months',
      realWorld: 'Constant symptoms limiting some daily activities. Several weeks of severe episodes yearly.',
    },
    {
      percent: 40,
      meaning: 'Signs and symptoms that are nearly constant and restrict routine daily activities to 50-75% of pre-illness level, OR require periods of incapacitation of 4 to 6 weeks total during past 12 months',
      realWorld: 'Significant daily limitations. Month or more of incapacitating episodes yearly.',
    },
    {
      percent: 60,
      meaning: 'Signs and symptoms that are nearly constant and restrict routine daily activities to less than 50% of pre-illness level, OR require periods of incapacitation of more than 6 weeks total during past 12 months',
      realWorld: 'Major daily limitations. More than 6 weeks of severe episodes yearly.',
    },
    {
      percent: 100,
      meaning: 'Signs and symptoms that are nearly constant and so severe as to restrict routine daily activities almost completely and occasionally preclude self-care',
      realWorld: 'Bedridden or nearly so. Cannot perform basic self-care activities without help.',
    },
  ],

  documentationTips: [
    'Track daily energy levels on a scale',
    'Document crash/flare days when you cannot function',
    'Log post-exertional malaise: what triggered it, how long it lasted',
    'Note cognitive symptoms: memory problems, difficulty concentrating',
    'Record sleep patterns and quality',
    'Document activities you can no longer do compared to before illness',
    'Track incapacitating episodes requiring bed rest',
    'Keep records of all treatments tried and response',
  ],

  keyTerms: {
    'Post-exertional malaise (PEM)': 'Worsening of symptoms after physical or mental exertion - hallmark of CFS',
    'Incapacitation': 'Periods requiring bed rest and treatment - track total weeks per year',
    'Brain fog': 'Cognitive dysfunction - difficulty thinking, concentrating, remembering',
    'Crash/flare': 'Period of severely worsened symptoms',
    'Baseline': 'Your typical energy/function level when not in a crash',
    'Pre-illness level': 'How you functioned before CFS - used for comparison',
  },
};

// =============================================================================
// KIDNEY/RENAL CONDITIONS - DC 7507-7531
// =============================================================================
const KIDNEY_DESCRIPTION = {
  diagnosticCode: '7531',
  conditionName: 'Kidney/Renal Conditions',

  evidenceLookingFor: [
    'Diagnosis of chronic kidney disease with stage/GFR',
    'Lab results: creatinine, BUN, GFR over time',
    'Evidence of dialysis if applicable',
    'Kidney function test trends',
    'Documentation of symptoms: fatigue, swelling, urinary changes',
    'Treatment history and medications',
    'Impact on diet and lifestyle',
    'Hospitalization records for kidney issues',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Kidney condition present but function essentially normal',
      realWorld: 'Early stage kidney disease detected on labs but not causing significant problems.',
    },
    {
      percent: 30,
      meaning: 'Albumin constant or recurring with hyaline and granular casts or red blood cells, OR transient or slight edema or hypertension',
      realWorld: 'Kidney damage causing protein in urine, swelling, or blood pressure issues.',
    },
    {
      percent: 60,
      meaning: 'Constant albuminuria with some edema, OR definite decrease in kidney function, OR hypertension at least 40% disabling',
      realWorld: 'Moderate kidney impairment with noticeable symptoms and lab abnormalities.',
    },
    {
      percent: 80,
      meaning: 'Persistent edema and albuminuria with BUN 40-80mg%, OR creatinine 4-8mg%, OR generalized poor health characterized by lethargy, weakness, anorexia, weight loss, or limitation of exertion',
      realWorld: 'Significant kidney failure affecting overall health. May be approaching dialysis.',
    },
    {
      percent: 100,
      meaning: 'Requiring regular dialysis, OR precluding more than sedentary activity from residuals such as systemic arteriopathy and others',
      realWorld: 'End-stage kidney disease requiring dialysis or severely limiting all activity.',
    },
  ],

  documentationTips: [
    'Keep ALL kidney function lab results: creatinine, BUN, GFR, urinalysis',
    'Track GFR trends over time - declining GFR is significant',
    'Document swelling (edema): location, severity, frequency',
    'Log urinary symptoms: frequency, color changes, output',
    'Track fatigue and energy levels',
    'Document dietary restrictions: low sodium, low potassium, protein limits',
    'Record blood pressure readings',
    'Note dialysis schedule if applicable',
  ],

  keyTerms: {
    'GFR': 'Glomerular Filtration Rate - main measure of kidney function. Lower = worse',
    'Creatinine': 'Waste product filtered by kidneys - higher levels indicate worse function',
    'BUN': 'Blood Urea Nitrogen - another kidney function marker',
    'Albuminuria': 'Protein in urine - sign of kidney damage',
    'Edema': 'Swelling from fluid retention - common in kidney disease',
    'Dialysis': 'Machine filtering blood when kidneys fail - qualifies for 100%',
  },
};

// =============================================================================
// ARRHYTHMIA - DC 7010/7011/7017
// =============================================================================
const ARRHYTHMIA_DESCRIPTION = {
  diagnosticCode: '7010',
  conditionName: 'Cardiac Arrhythmia',

  evidenceLookingFor: [
    'Diagnosis of specific arrhythmia type (afib, SVT, ventricular arrhythmia)',
    'EKG/ECG recordings documenting arrhythmia',
    'Holter monitor or event monitor results',
    'Evidence of pacemaker or defibrillator if applicable',
    'Medication requirements for rhythm control',
    'Frequency of arrhythmia episodes',
    'Symptoms: palpitations, dizziness, syncope, fatigue',
    'Impact on exercise tolerance and daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Permanent atrial fibrillation (lone), OR 1-4 episodes of paroxysmal atrial fibrillation or SVT per year documented by ECG or Holter monitor',
      realWorld: 'Occasional arrhythmia episodes or controlled permanent afib.',
    },
    {
      percent: 30,
      meaning: 'Paroxysmal atrial fibrillation or SVT with more than 4 episodes per year documented by ECG or Holter monitor',
      realWorld: 'Frequent arrhythmia episodes - more than quarterly.',
    },
    {
      percent: 60,
      meaning: 'Ventricular arrhythmias, OR paroxysmal arrhythmias preventing workload greater than 3 METs',
      realWorld: 'Serious arrhythmia significantly limiting physical activity.',
    },
    {
      percent: 100,
      meaning: 'Sustained ventricular arrhythmias, OR chronic congestive heart failure, OR workload 3 METs or less, OR requires continuous medication or pacemaker, OR ejection fraction less than 30%',
      realWorld: 'Severe arrhythmia with major heart damage or requiring device/constant medication.',
    },
  ],

  documentationTips: [
    'Keep all EKG and monitor recordings showing arrhythmia',
    'Track arrhythmia episodes: date, duration, symptoms',
    'Document palpitations and their severity',
    'Note syncope (fainting) or near-syncope episodes',
    'Record all cardiac medications',
    'Log activities limited by arrhythmia',
    'Document pacemaker/defibrillator if present',
    'Track ER visits or hospitalizations for arrhythmia',
  ],

  keyTerms: {
    'Atrial fibrillation': 'Irregular, rapid heart rhythm from upper chambers - most common arrhythmia',
    'Paroxysmal': 'Comes and goes - episodes start and stop on their own',
    'SVT': 'Supraventricular tachycardia - rapid heart rate from above ventricles',
    'Ventricular arrhythmia': 'Irregular rhythm from lower chambers - more serious',
    'Pacemaker': 'Device to maintain heart rhythm - indicates significant arrhythmia',
    'Syncope': 'Fainting from inadequate blood flow to brain',
  },
};

// =============================================================================
// CARDIOMYOPATHY - DC 7015/7020
// =============================================================================
const CARDIOMYOPATHY_DESCRIPTION = {
  diagnosticCode: '7020',
  conditionName: 'Cardiomyopathy',

  evidenceLookingFor: [
    'Diagnosis of cardiomyopathy (dilated, hypertrophic, restrictive)',
    'Echocardiogram showing heart structure and function',
    'Ejection fraction measurements',
    'Exercise tolerance testing with METs level',
    'Evidence of heart failure symptoms',
    'Treatment history: medications, devices, transplant evaluation',
    'Functional limitations documentation',
    'Hospitalization records',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Workload greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope, OR continuous medication required',
      realWorld: 'Mild cardiomyopathy managed with medication. Some limitation with heavy exertion.',
    },
    {
      percent: 30,
      meaning: 'Workload of greater than 5 METs but not greater than 7 METs results in symptoms, OR evidence of cardiac hypertrophy or dilatation',
      realWorld: 'Moderate cardiomyopathy with structural heart changes. Limited with moderate activity.',
    },
    {
      percent: 60,
      meaning: 'More than one episode of acute congestive heart failure in past year, OR workload greater than 3 but not greater than 5 METs results in symptoms, OR ejection fraction 30-50%',
      realWorld: 'Significant cardiomyopathy with heart failure episodes or substantially reduced heart function.',
    },
    {
      percent: 100,
      meaning: 'Chronic congestive heart failure, OR workload 3 METs or less results in symptoms, OR ejection fraction less than 30%',
      realWorld: 'Severe cardiomyopathy. Severely limited. May be candidate for transplant or VAD.',
    },
  ],

  documentationTips: [
    'Keep all echocardiogram reports with ejection fraction',
    'Track METs level from exercise testing',
    'Document heart failure symptoms: shortness of breath, swelling, fatigue',
    'Log daily weight - sudden gain indicates fluid retention',
    'Record activities that cause symptoms',
    'Track hospitalizations for heart failure',
    'Document all heart medications',
    'Note any devices: ICD, pacemaker, LVAD',
  ],

  keyTerms: {
    'Cardiomyopathy': 'Disease of heart muscle affecting pumping ability',
    'Dilated cardiomyopathy': 'Heart chambers enlarged and weakened',
    'Hypertrophic cardiomyopathy': 'Heart muscle abnormally thick',
    'Ejection fraction': 'Percentage of blood pumped per beat - key measure. Under 30% = 100% rating',
    'LVAD': 'Left Ventricular Assist Device - mechanical pump helping heart',
    'CHF': 'Congestive Heart Failure - heart cannot pump adequately',
  },
};

// =============================================================================
// FIBROMYALGIA - DC 5025
// =============================================================================
const FIBROMYALGIA_DESCRIPTION = {
  diagnosticCode: '5025',
  conditionName: 'Fibromyalgia',

  evidenceLookingFor: [
    'Diagnosis of fibromyalgia from rheumatologist or qualified provider',
    'Documentation of widespread musculoskeletal pain',
    'Evidence of tender points or widespread pain index',
    'Fatigue and sleep disturbance documentation',
    'Cognitive symptoms (fibro fog)',
    'Treatment history and medication effectiveness',
    'Impact on activities and function',
    'Duration of symptoms (chronic, episodic)',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Symptoms that require continuous medication for control',
      realWorld: 'Fibromyalgia managed with daily medication. Some ongoing symptoms but functional.',
    },
    {
      percent: 20,
      meaning: 'Symptoms that are episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but that are present more than one-third of the time',
      realWorld: 'Frequent flare-ups. Symptoms present most of the time. Stress worsens symptoms.',
    },
    {
      percent: 40,
      meaning: 'Symptoms that are constant or nearly so, and refractory to therapy',
      realWorld: 'Near-constant symptoms despite treatment. Significant impact on daily life.',
    },
  ],

  documentationTips: [
    'Track pain levels daily - note good days and bad days',
    'Document flare-up triggers: stress, weather, activity',
    'Log sleep quality and quantity',
    'Track fatigue levels throughout the day',
    'Note cognitive symptoms: memory, concentration problems',
    'Record all medications tried and their effectiveness',
    'Document impact on work, household tasks, activities',
    'Track tender points during flares',
  ],

  keyTerms: {
    'Widespread pain': 'Pain in multiple body areas - above and below waist, both sides',
    'Tender points': 'Specific body locations that hurt when pressed - traditional diagnostic criteria',
    'Fibro fog': 'Cognitive dysfunction - difficulty thinking, memory problems',
    'Refractory': 'Not responding to treatment - key for 40% rating',
    'Exacerbation/flare': 'Period of worsened symptoms',
    'Central sensitization': 'Nervous system amplifies pain signals - underlying mechanism',
  },
};

// =============================================================================
// TINNITUS - DC 6260
// =============================================================================
const TINNITUS_DESCRIPTION = {
  diagnosticCode: '6260',
  conditionName: 'Tinnitus',

  evidenceLookingFor: [
    'Diagnosis of tinnitus (ringing, buzzing, or other sound in ears)',
    'Evidence of service connection: noise exposure, head injury, etc.',
    'Audiological examination documenting tinnitus',
    'Description of sound: type, pitch, loudness',
    'Whether symptoms are constant or intermittent',
    'Impact on concentration, sleep, daily life',
    'Associated hearing loss if present',
    'Treatment attempts: maskers, therapy, medication',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Recurrent tinnitus',
      realWorld: 'Ongoing ringing in ears - this is the maximum rating for tinnitus. It\'s a flat 10% regardless of severity or whether one or both ears are affected.',
    },
  ],

  documentationTips: [
    'Document when tinnitus started and likely cause',
    'Describe the sound: ringing, buzzing, roaring, hissing',
    'Note if constant or intermittent',
    'Track impact on sleep - difficulty falling/staying asleep',
    'Document concentration problems from tinnitus',
    'Log situations where tinnitus is worse',
    'Note if tinnitus is in one ear, both ears, or seems to be in head',
    'Document any relationship to hearing loss',
  ],

  keyTerms: {
    'Recurrent': 'Tinnitus that comes back repeatedly - qualifies for rating',
    'Subjective tinnitus': 'Only you can hear it - most common type',
    'Objective tinnitus': 'Doctor can hear it too - rare',
    'Masking': 'Using background noise to cover tinnitus',
    'Maximum schedular rating': 'Tinnitus max is 10% - cannot get higher under this code alone',
    'Secondary conditions': 'Mental health issues from tinnitus may be rated separately',
  },
};

// =============================================================================
// CIRRHOSIS - DC 7312
// =============================================================================
const CIRRHOSIS_DESCRIPTION = {
  diagnosticCode: '7312',
  conditionName: 'Cirrhosis of the Liver',

  evidenceLookingFor: [
    'Diagnosis of cirrhosis with underlying cause',
    'Liver function tests: AST, ALT, bilirubin, albumin',
    'Evidence of portal hypertension',
    'Documentation of ascites, varices, or encephalopathy',
    'Imaging showing liver damage',
    'Liver biopsy results if performed',
    'Treatment history and response',
    'Impact on nutrition and daily function',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Symptoms such as weakness, anorexia, abdominal pain, and malaise with minor weight loss',
      realWorld: 'Early cirrhosis with mild symptoms. Some fatigue and digestive issues.',
    },
    {
      percent: 30,
      meaning: 'Portal hypertension and splenomegaly with weakness, anorexia, abdominal pain, malaise, and at least minor weight loss',
      realWorld: 'Moderate cirrhosis with portal hypertension. Noticeable symptoms affecting daily life.',
    },
    {
      percent: 50,
      meaning: 'History of one episode of ascites, hepatic encephalopathy, or hemorrhage from varices or portal gastropathy',
      realWorld: 'Significant complications have occurred. History of fluid buildup, confusion, or bleeding.',
    },
    {
      percent: 70,
      meaning: 'History of two or more episodes of ascites, hepatic encephalopathy, or hemorrhage from varices or portal gastropathy, but with periods of remission between attacks',
      realWorld: 'Multiple serious complications with some recovery periods between.',
    },
    {
      percent: 100,
      meaning: 'Generalized weakness, substantial weight loss, and persistent jaundice, OR ascites, hepatic encephalopathy, or hemorrhage unresponsive to treatment',
      realWorld: 'End-stage liver disease. Severe symptoms not responding to treatment.',
    },
  ],

  documentationTips: [
    'Keep all liver function test results over time',
    'Document episodes of ascites: when, how much fluid drained',
    'Track hepatic encephalopathy episodes: confusion, disorientation',
    'Log any bleeding episodes from varices',
    'Record weight changes - both loss and fluid-related gain',
    'Document jaundice episodes',
    'Track fatigue and energy levels',
    'Note dietary restrictions and their impact',
  ],

  keyTerms: {
    'Portal hypertension': 'High pressure in liver blood vessels - causes many complications',
    'Ascites': 'Fluid buildup in abdomen - often requires drainage',
    'Hepatic encephalopathy': 'Confusion/mental changes from liver not filtering toxins',
    'Varices': 'Enlarged veins that can bleed - esophageal varices are dangerous',
    'Jaundice': 'Yellow skin/eyes from bilirubin buildup',
    'Splenomegaly': 'Enlarged spleen - common with portal hypertension',
  },
};

// =============================================================================
// HEPATITIS - DC 7345/7354
// =============================================================================
const HEPATITIS_DESCRIPTION = {
  diagnosticCode: '7345',
  conditionName: 'Hepatitis B/C',

  evidenceLookingFor: [
    'Diagnosis of chronic hepatitis B or C',
    'Viral load testing results',
    'Liver function tests over time',
    'Liver biopsy or FibroScan results',
    'Treatment history: antivirals, interferon',
    'Evidence of fatigue, malaise, dietary issues',
    'Documentation of incapacitating episodes',
    'Progression to cirrhosis if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Nonsymptomatic',
      realWorld: 'Hepatitis present on labs but no symptoms affecting daily life.',
    },
    {
      percent: 10,
      meaning: 'Intermittent fatigue, malaise, and anorexia, OR incapacitating episodes having a total duration of at least 1 week but less than 2 weeks during past 12 months',
      realWorld: 'Occasional symptoms. About a week of severe episodes per year.',
    },
    {
      percent: 20,
      meaning: 'Daily fatigue, malaise, and anorexia (without weight loss or hepatomegaly) requiring dietary restriction or continuous medication, OR incapacitating episodes 2-4 weeks total during past 12 months',
      realWorld: 'Daily symptoms requiring diet changes or medication. 2-4 weeks of severe episodes yearly.',
    },
    {
      percent: 40,
      meaning: 'Daily fatigue, malaise, and anorexia with minor weight loss and hepatomegaly, OR incapacitating episodes 4-6 weeks total during past 12 months',
      realWorld: 'Daily symptoms with weight loss and enlarged liver. 1-1.5 months of severe episodes yearly.',
    },
    {
      percent: 60,
      meaning: 'Daily fatigue, malaise, and anorexia with substantial weight loss or other indication of malnutrition, and hepatomegaly, OR incapacitating episodes more than 6 weeks total during past 12 months',
      realWorld: 'Significant daily symptoms with malnutrition. More than 6 weeks of severe episodes yearly.',
    },
    {
      percent: 100,
      meaning: 'Near-constant debilitating symptoms such as fatigue, malaise, nausea, vomiting, anorexia, arthralgia, and right upper quadrant pain',
      realWorld: 'Constant severe symptoms preventing normal activities.',
    },
  ],

  documentationTips: [
    'Keep all viral load test results',
    'Track liver enzyme levels over time',
    'Document daily symptoms: fatigue severity, appetite, nausea',
    'Log incapacitating episodes requiring bed rest',
    'Record weight changes',
    'Track treatment side effects if on antivirals',
    'Document dietary restrictions',
    'Note work/activity limitations',
  ],

  keyTerms: {
    'Viral load': 'Amount of virus in blood - used to track disease and treatment',
    'Incapacitating episode': 'Period requiring bed rest and treatment by physician',
    'Hepatomegaly': 'Enlarged liver',
    'Sustained virologic response': 'Virus undetectable after treatment - potential cure',
    'Fibrosis': 'Scarring of liver - measured by biopsy or FibroScan',
    'Anorexia': 'Loss of appetite - not the eating disorder',
  },
};

// =============================================================================
// ANEMIA - DC 7700/7714/7716
// =============================================================================
const ANEMIA_DESCRIPTION = {
  diagnosticCode: '7700',
  conditionName: 'Anemia',

  evidenceLookingFor: [
    'Diagnosis specifying type of anemia',
    'Hemoglobin and hematocrit levels over time',
    'Evidence of underlying cause',
    'Documentation of symptoms: fatigue, weakness, shortness of breath',
    'Transfusion requirements if applicable',
    'Treatment history: iron, B12, erythropoietin',
    'Impact on activity level and daily function',
    'Evidence of complications',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Hemoglobin 10gm/100ml or more with no symptoms',
      realWorld: 'Mild anemia on labs but not causing noticeable problems.',
    },
    {
      percent: 10,
      meaning: 'Hemoglobin 10gm/100ml or less with findings such as weakness, easy fatigability, or headaches',
      realWorld: 'Anemia causing fatigue, weakness, or headaches.',
    },
    {
      percent: 30,
      meaning: 'Hemoglobin 8gm/100ml or less with findings such as weakness, easy fatigability, headaches, lightheadedness, or shortness of breath',
      realWorld: 'Moderate anemia with multiple symptoms including breathing issues.',
    },
    {
      percent: 70,
      meaning: 'Hemoglobin 7gm/100ml or less with findings such as dyspnea on mild exertion, cardiomegaly, tachycardia, or syncope',
      realWorld: 'Severe anemia affecting heart function. Shortness of breath with minimal activity.',
    },
    {
      percent: 100,
      meaning: 'Hemoglobin 5gm/100ml or less with findings including high output heart failure or dyspnea at rest',
      realWorld: 'Critical anemia requiring frequent transfusions. Short of breath even at rest.',
    },
  ],

  documentationTips: [
    'Keep all CBC results showing hemoglobin/hematocrit',
    'Track hemoglobin levels over time - trends matter',
    'Document fatigue: severity, impact on activities',
    'Note shortness of breath: with exertion vs at rest',
    'Log any transfusions received',
    'Track iron, B12, or other supplement use',
    'Document dizziness or lightheadedness episodes',
    'Record heart-related symptoms: palpitations, rapid heart rate',
  ],

  keyTerms: {
    'Hemoglobin': 'Protein in red blood cells that carries oxygen - key measure for rating',
    'Hematocrit': 'Percentage of blood that is red blood cells',
    'Iron deficiency anemia': 'Most common type - from low iron',
    'Pernicious anemia': 'From B12 deficiency - rated under DC 7700',
    'Hemolytic anemia': 'Red blood cells destroyed faster than made',
    'Transfusion': 'Receiving blood products - indicates severe anemia',
  },
};

// =============================================================================
// PROSTATE CONDITIONS - DC 7527/7528
// =============================================================================
const PROSTATE_DESCRIPTION = {
  diagnosticCode: '7527',
  conditionName: 'Prostate Conditions',

  evidenceLookingFor: [
    'Diagnosis of prostate condition: BPH, prostatitis, or cancer residuals',
    'PSA levels over time',
    'Urinary symptoms documentation',
    'Evidence of treatment: medications, TURP, radiation',
    'Voiding dysfunction if present',
    'Urinary tract infections frequency',
    'Impact on quality of life',
    'Evidence of incontinence if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Prostate condition present with no significant symptoms',
      realWorld: 'Diagnosed condition but minimal impact on daily life.',
    },
    {
      percent: 10,
      meaning: 'Daytime voiding interval 2-3 hours, OR awakening to void 2 times per night',
      realWorld: 'Frequent urination during day or getting up twice at night.',
    },
    {
      percent: 20,
      meaning: 'Daytime voiding interval 1-2 hours, OR awakening to void 3-4 times per night, OR requires wearing absorbent materials',
      realWorld: 'Very frequent urination or mild incontinence requiring pads.',
    },
    {
      percent: 40,
      meaning: 'Daytime voiding interval less than 1 hour, OR awakening to void 5 or more times per night, OR requires use of appliance or wearing of absorbent materials changed more than 4 times per day',
      realWorld: 'Severe urinary frequency or significant incontinence.',
    },
    {
      percent: 60,
      meaning: 'Continual urine leakage, post-surgical urinary diversion, urinary incontinence requiring use of appliance or wearing of absorbent materials changed more than 4 times per day',
      realWorld: 'Constant incontinence or urinary diversion (urostomy).',
    },
  ],

  documentationTips: [
    'Track daytime voiding frequency',
    'Log nighttime awakenings to urinate',
    'Document incontinence: frequency, amount, pad usage',
    'Record PSA levels if monitored',
    'Track UTI occurrences',
    'Note urgency episodes',
    'Document medications and their effectiveness',
    'Log impact on sleep and daily activities',
  ],

  keyTerms: {
    'BPH': 'Benign Prostatic Hyperplasia - enlarged prostate causing urinary symptoms',
    'Voiding dysfunction': 'Problems with urination - basis for rating',
    'Nocturia': 'Waking at night to urinate',
    'Urinary frequency': 'Needing to urinate more often than normal',
    'Urinary incontinence': 'Involuntary urine leakage',
    'TURP': 'Transurethral Resection of Prostate - surgical treatment',
  },
};

// =============================================================================
// HYPOTHYROIDISM - DC 7903
// =============================================================================
const HYPOTHYROIDISM_DESCRIPTION = {
  diagnosticCode: '7903',
  conditionName: 'Hypothyroidism',

  evidenceLookingFor: [
    'Diagnosis of hypothyroidism with lab confirmation',
    'TSH and T4 levels over time',
    'Documentation of symptoms despite treatment',
    'Evidence of mental sluggishness or cognitive issues',
    'Weight changes documentation',
    'Cold intolerance',
    'Medication requirements and dosage adjustments',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Fatigability, or continuous medication required for control',
      realWorld: 'Hypothyroidism controlled with daily medication. Some residual fatigue.',
    },
    {
      percent: 30,
      meaning: 'Fatigability, constipation, and mental sluggishness',
      realWorld: 'Symptoms persist despite medication. Noticeable cognitive and digestive issues.',
    },
    {
      percent: 60,
      meaning: 'Muscular weakness, mental disturbance, and weight gain',
      realWorld: 'Significant symptoms affecting strength, cognition, and metabolism.',
    },
    {
      percent: 100,
      meaning: 'Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance, bradycardia, and sleepiness including myxedema',
      realWorld: 'Severe hypothyroidism with multiple system involvement. Myxedema crisis risk.',
    },
  ],

  documentationTips: [
    'Keep all thyroid lab results: TSH, T4, T3',
    'Track symptoms even while on medication',
    'Document fatigue: severity, impact on activities',
    'Note cognitive symptoms: memory, concentration, mental fog',
    'Record weight changes',
    'Track cold intolerance episodes',
    'Document medication dosage adjustments',
    'Log constipation and other GI symptoms',
  ],

  keyTerms: {
    'TSH': 'Thyroid Stimulating Hormone - high TSH indicates hypothyroidism',
    'T4/T3': 'Thyroid hormones - low levels confirm hypothyroidism',
    'Myxedema': 'Severe hypothyroidism - medical emergency',
    'Mental sluggishness': 'Slow thinking, difficulty concentrating - key symptom',
    'Bradycardia': 'Slow heart rate - can occur with severe hypothyroidism',
    'Fatigability': 'Tendency to become tired easily',
  },
};

// =============================================================================
// HYPERTHYROIDISM - DC 7900
// =============================================================================
const HYPERTHYROIDISM_DESCRIPTION = {
  diagnosticCode: '7900',
  conditionName: 'Hyperthyroidism',

  evidenceLookingFor: [
    'Diagnosis of hyperthyroidism (Graves disease, toxic nodule, etc.)',
    'TSH and thyroid hormone levels',
    'Documentation of symptoms: tremor, weight loss, rapid heart rate',
    'Evidence of eye involvement if present',
    'Treatment history: medications, RAI, surgery',
    'Impact on daily functioning',
    'Heart-related complications if present',
    'Emotional/psychiatric symptoms',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Tachycardia, tremor, and continuous medication required for control',
      realWorld: 'Hyperthyroidism controlled with medication. Some residual symptoms.',
    },
    {
      percent: 30,
      meaning: 'Tachycardia, tremor, and increased pulse pressure or blood pressure',
      realWorld: 'Symptoms affecting cardiovascular system despite treatment.',
    },
    {
      percent: 60,
      meaning: 'Emotional instability, tachycardia, fatigability, and increased pulse pressure or blood pressure',
      realWorld: 'Significant symptoms including mood issues and cardiac effects.',
    },
    {
      percent: 100,
      meaning: 'Thyroid enlargement, tachycardia, eye involvement, muscular weakness, loss of weight, and sympathetic nervous system, cardiovascular, or gastrointestinal symptoms',
      realWorld: 'Severe hyperthyroidism with multiple organ involvement. Thyroid storm risk.',
    },
  ],

  documentationTips: [
    'Keep all thyroid lab results',
    'Track heart rate - resting and with activity',
    'Document tremor: severity, impact on fine motor tasks',
    'Record weight changes',
    'Note eye symptoms: bulging, dryness, double vision',
    'Track emotional symptoms: anxiety, irritability',
    'Document heat intolerance',
    'Log GI symptoms: diarrhea, increased appetite',
  ],

  keyTerms: {
    'Graves disease': 'Autoimmune cause of hyperthyroidism - most common cause',
    'Tachycardia': 'Rapid heart rate - common symptom',
    'Thyroid storm': 'Severe hyperthyroidism - medical emergency',
    'RAI': 'Radioactive Iodine - treatment that destroys thyroid tissue',
    'Exophthalmos': 'Bulging eyes - specific to Graves disease',
    'Tremor': 'Fine shaking, especially in hands',
  },
};

// =============================================================================
// LUPUS (SLE) - DC 6350
// =============================================================================
const LUPUS_DESCRIPTION = {
  diagnosticCode: '6350',
  conditionName: 'Systemic Lupus Erythematosus (Lupus)',

  evidenceLookingFor: [
    'Diagnosis of SLE with supporting labs (ANA, anti-dsDNA)',
    'Documentation of organ system involvement',
    'Evidence of flares and remissions',
    'Skin manifestations (rash, photosensitivity)',
    'Joint involvement',
    'Kidney, heart, or lung involvement if present',
    'Treatment history: steroids, immunosuppressants',
    'Functional limitations documentation',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Exacerbations once or twice a year or symptomatic during past 2 years',
      realWorld: 'Occasional flares. Periods of remission between episodes.',
    },
    {
      percent: 60,
      meaning: 'Exacerbations lasting a week or more, 2-3 times per year',
      realWorld: 'Regular flares lasting at least a week, occurring several times yearly.',
    },
    {
      percent: 100,
      meaning: 'Acute with frequent exacerbations producing severe impairment of health',
      realWorld: 'Frequent severe flares causing major health problems.',
    },
  ],

  documentationTips: [
    'Keep lupus lab results: ANA, complement levels, anti-dsDNA',
    'Track flares: start date, duration, symptoms, severity',
    'Document rash occurrences and sun sensitivity',
    'Log joint pain and swelling',
    'Track fatigue levels',
    'Note kidney function if affected',
    'Document medications: steroids, immunosuppressants',
    'Record impact on daily activities during flares',
  ],

  keyTerms: {
    'Flare/exacerbation': 'Period of active disease with worsened symptoms',
    'Remission': 'Period of minimal or no disease activity',
    'ANA': 'Antinuclear Antibody - screening test for lupus',
    'Photosensitivity': 'Abnormal reaction to sun exposure',
    'Malar rash': 'Butterfly-shaped rash across cheeks and nose',
    'Lupus nephritis': 'Kidney involvement - can be serious complication',
  },
};

// =============================================================================
// RHEUMATOID ARTHRITIS - DC 5002
// =============================================================================
const RHEUMATOID_ARTHRITIS_DESCRIPTION = {
  diagnosticCode: '5002',
  conditionName: 'Rheumatoid Arthritis',

  evidenceLookingFor: [
    'Diagnosis of RA by rheumatologist',
    'Rheumatoid factor and anti-CCP antibody results',
    'Documentation of joint involvement',
    'Evidence of constitutional symptoms: weight loss, anemia, fever',
    'X-rays or imaging showing joint damage',
    'Treatment history: DMARDs, biologics, steroids',
    'Functional limitations',
    'Extra-articular manifestations if present',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'One or two exacerbations a year in a well-established diagnosis',
      realWorld: 'Occasional flares with periods of good control. Established RA diagnosis.',
    },
    {
      percent: 40,
      meaning: 'Symptom combinations productive of definite impairment of health objectively supported by examination findings or incapacitating exacerbations occurring 3 or more times a year',
      realWorld: 'Regular flares affecting health. Three or more incapacitating episodes yearly.',
    },
    {
      percent: 60,
      meaning: 'Weight loss and anemia productive of severe impairment of health or severely incapacitating exacerbations occurring 4 or more times yearly or a lesser number over prolonged periods',
      realWorld: 'Severe RA with systemic effects. Frequent or prolonged incapacitating episodes.',
    },
    {
      percent: 100,
      meaning: 'Constitutional manifestations with totally incapacitating episodes',
      realWorld: 'Completely disabling RA. Unable to function during episodes.',
    },
  ],

  documentationTips: [
    'Keep RA lab results: RF, anti-CCP, ESR, CRP',
    'Track flares: which joints, duration, severity',
    'Document morning stiffness: how long it lasts',
    'Log joint swelling and tenderness',
    'Track weight changes',
    'Note fatigue and general malaise',
    'Document all medications and response',
    'Record functional limitations: grip strength, walking, dressing',
  ],

  keyTerms: {
    'Rheumatoid factor': 'Blood test for RA - positive in most cases',
    'Anti-CCP': 'More specific blood test for RA',
    'DMARDs': 'Disease-Modifying Anti-Rheumatic Drugs - slow disease progression',
    'Biologics': 'Newer RA medications targeting specific immune pathways',
    'Constitutional symptoms': 'Systemic symptoms: fever, weight loss, fatigue',
    'Incapacitating exacerbation': 'Flare requiring bed rest and treatment',
  },
};

// =============================================================================
// VOIDING DYSFUNCTION - DC 7512/7527/7542/7518
// =============================================================================
const VOIDING_DYSFUNCTION_DESCRIPTION = {
  diagnosticCode: '7527',
  conditionName: 'Voiding Dysfunction',

  evidenceLookingFor: [
    'Documentation of urinary symptoms: frequency, urgency, incontinence',
    'Voiding diary showing frequency and timing',
    'Evidence of pad or absorbent material usage',
    'Catheterization requirements if applicable',
    'Nighttime voiding frequency (nocturia)',
    'Urodynamic testing results if available',
    'Treatment history and response',
    'Impact on daily activities and sleep',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Voiding interval 1-2 hours daytime, OR awakening 3-4 times at night, OR wearing absorbent materials',
      realWorld: 'Frequent urination significantly affecting daily routine. May need pads for protection.',
    },
    {
      percent: 40,
      meaning: 'Voiding interval less than 1 hour daytime, OR awakening 5+ times at night, OR absorbent materials changed more than 4 times daily',
      realWorld: 'Very frequent urination dominating daily life. Significant incontinence requiring frequent pad changes.',
    },
    {
      percent: 60,
      meaning: 'Continual urine leakage, post-surgical urinary diversion, urinary incontinence requiring appliance or absorbent materials changed more than 4 times daily',
      realWorld: 'Constant leakage or urostomy. Cannot control urination at all.',
    },
  ],

  documentationTips: [
    'Keep a voiding diary: record every bathroom trip with time',
    'Track daytime voiding interval (time between bathroom trips)',
    'Count nighttime awakenings to urinate',
    'Document pad usage: type, how many per day, when changed',
    'Note urgency episodes and any accidents',
    'Record fluid intake patterns',
    'Track impact on work, travel, social activities',
    'Document any catheter use',
  ],

  keyTerms: {
    'Voiding interval': 'Time between urination - shorter interval = higher rating',
    'Nocturia': 'Waking at night to urinate - counted separately from daytime',
    'Incontinence': 'Involuntary urine leakage',
    'Absorbent materials': 'Pads, adult diapers, or other protective garments',
    'Urinary diversion': 'Surgical rerouting of urine (urostomy)',
    'Appliance': 'External collection device for urine',
  },
};

// =============================================================================
// SPHINCTER IMPAIRMENT - DC 7332/7333
// =============================================================================
const SPHINCTER_DESCRIPTION = {
  diagnosticCode: '7332',
  conditionName: 'Anal/Rectal Sphincter Impairment',

  evidenceLookingFor: [
    'Diagnosis of fecal incontinence or sphincter damage',
    'Documentation of bowel control problems',
    'Frequency of accidents or leakage',
    'Pad or protective garment usage',
    'Cause of sphincter damage (surgery, injury, childbirth)',
    'Treatment history',
    'Impact on daily activities',
    'Colostomy if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Healed or slight condition without leakage',
      realWorld: 'Minor sphincter issue that has healed or causes no functional problems.',
    },
    {
      percent: 10,
      meaning: 'Constant slight or occasional moderate leakage',
      realWorld: 'Some leakage - either constant minor or occasional more significant episodes.',
    },
    {
      percent: 30,
      meaning: 'Occasional involuntary bowel movements necessitating wearing of pad',
      realWorld: 'Accidents happen often enough to require wearing protective pads.',
    },
    {
      percent: 60,
      meaning: 'Extensive leakage and fairly frequent involuntary bowel movements',
      realWorld: 'Significant loss of bowel control. Frequent accidents affecting daily life.',
    },
    {
      percent: 100,
      meaning: 'Complete loss of sphincter control',
      realWorld: 'No bowel control at all. Total incontinence.',
    },
  ],

  documentationTips: [
    'Track bowel accidents: frequency, circumstances',
    'Document leakage episodes: severity, when they occur',
    'Record pad usage: type, how many per day',
    'Note foods or situations that trigger problems',
    'Track impact on work and social activities',
    'Document any colostomy care if applicable',
    'Record medications used for bowel control',
    'Note any surgical history affecting sphincter',
  ],

  keyTerms: {
    'Sphincter': 'Muscle controlling bowel movements',
    'Fecal incontinence': 'Inability to control bowel movements',
    'Leakage': 'Involuntary passage of stool - can be slight or extensive',
    'Colostomy': 'Surgical opening for bowel - rated at 100%',
    'Rectocele': 'Prolapse that can affect bowel control',
  },
};

// =============================================================================
// PERITONEAL ADHESIONS - DC 7301
// =============================================================================
const PERITONEAL_ADHESIONS_DESCRIPTION = {
  diagnosticCode: '7301',
  conditionName: 'Peritoneal Adhesions',

  evidenceLookingFor: [
    'Diagnosis of abdominal adhesions (usually post-surgical)',
    'Documentation of bowel obstruction episodes',
    'Evidence of pain and GI symptoms',
    'Imaging showing adhesions if available',
    'Surgical history',
    'Diet modifications required',
    'Hospitalization records for obstruction',
    'Impact on nutrition and daily function',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Mild - pulling pain on attempting work or aggravated by movements with episodes of colic pain, nausea, constipation or diarrhea',
      realWorld: 'Occasional discomfort with activity. Some GI symptoms but manageable.',
    },
    {
      percent: 10,
      meaning: 'Moderate - pulling pain on attempting work or aggravated by movements with episodes of colic pain, nausea, constipation or diarrhea, OR occasional episodes of partial obstruction',
      realWorld: 'Regular pain with activity. Occasional partial bowel blockages.',
    },
    {
      percent: 30,
      meaning: 'Moderately severe - partial obstruction manifested by delayed motility of barium meal and target intestinal contents',
      realWorld: 'Frequent partial obstructions documented on testing. Significant GI dysfunction.',
    },
    {
      percent: 50,
      meaning: 'Severe - definite partial obstruction with frequent and prolonged episodes of severe colic distension, nausea or vomiting, following severe peritonitis, ruptured appendix, etc.',
      realWorld: 'Frequent severe obstructions requiring medical attention. Severe symptoms.',
    },
  ],

  documentationTips: [
    'Track episodes of abdominal pain and cramping',
    'Document nausea, vomiting, and constipation episodes',
    'Note any bowel obstruction episodes requiring ER/hospital',
    'Record dietary modifications needed',
    'Log activities that trigger pain',
    'Keep records of imaging studies',
    'Document surgical history that caused adhesions',
    'Track weight and nutritional status',
  ],

  keyTerms: {
    'Adhesions': 'Scar tissue bands connecting organs - usually from surgery',
    'Partial obstruction': 'Bowel partially blocked - causes pain, nausea, constipation',
    'Complete obstruction': 'Bowel fully blocked - medical emergency',
    'Colic pain': 'Cramping abdominal pain that comes and goes',
    'Peritonitis': 'Abdominal infection that often causes adhesions',
  },
};

// =============================================================================
// ESOPHAGEAL CONDITIONS - DC 7203/7204/7205
// =============================================================================
const ESOPHAGEAL_DESCRIPTION = {
  diagnosticCode: '7203',
  conditionName: 'Esophageal Conditions',

  evidenceLookingFor: [
    'Diagnosis of esophageal stricture, spasm, or diverticulum',
    'Endoscopy or barium swallow results',
    'Documentation of swallowing difficulty (dysphagia)',
    'Evidence of aspiration if present',
    'Weight loss documentation',
    'Dietary modifications required',
    'Treatment history: dilations, surgery',
    'Impact on nutrition and eating',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Moderate stricture or spasm - swallowing difficulty with some foods',
      realWorld: 'Difficulty swallowing certain foods. Must modify diet but can eat.',
    },
    {
      percent: 50,
      meaning: 'Severe stricture - permits liquids only',
      realWorld: 'Can only swallow liquids. Solid foods cause choking or blockage.',
    },
    {
      percent: 80,
      meaning: 'Stricture permitting passage of liquids only with marked impairment of general health',
      realWorld: 'Liquid diet only and health significantly affected. Malnutrition likely.',
    },
  ],

  documentationTips: [
    'Track foods you can and cannot swallow',
    'Document choking or aspiration episodes',
    'Record weight changes',
    'Note any dilations or procedures needed',
    'Log dietary modifications',
    'Track nutritional supplement use',
    'Document any feeding tube use if applicable',
    'Record time needed to eat meals',
  ],

  keyTerms: {
    'Dysphagia': 'Difficulty swallowing - key symptom',
    'Stricture': 'Narrowing of esophagus',
    'Diverticulum': 'Pouch in esophageal wall that can trap food',
    'Aspiration': 'Food/liquid going into lungs - dangerous complication',
    'Dilation': 'Procedure to stretch narrowed esophagus',
  },
};

// =============================================================================
// INTESTINAL RESECTION - DC 7329
// =============================================================================
const INTESTINAL_RESECTION_DESCRIPTION = {
  diagnosticCode: '7329',
  conditionName: 'Intestinal Resection (Short Bowel)',

  evidenceLookingFor: [
    'Surgical records showing bowel resection',
    'Amount of bowel removed',
    'Documentation of malabsorption symptoms',
    'Diarrhea frequency and severity',
    'Weight and nutritional status',
    'Vitamin/mineral deficiencies',
    'TPN or special nutrition if required',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Slight symptoms OR obvious interference with absorption and nutrition manifested by impairment of health',
      realWorld: 'Some digestive issues from surgery. May have nutritional deficiencies.',
    },
    {
      percent: 40,
      meaning: 'Definite interference with absorption and nutrition manifested by impairment of health and weight loss',
      realWorld: 'Significant malabsorption causing health problems and weight loss.',
    },
    {
      percent: 60,
      meaning: 'Marked interference with absorption and nutrition manifested by severe impairment of health',
      realWorld: 'Severe malabsorption. Major nutritional deficiencies. Poor health status.',
    },
  ],

  documentationTips: [
    'Keep surgical records showing how much bowel removed',
    'Track bowel movements: frequency, consistency',
    'Document diarrhea episodes',
    'Record weight regularly',
    'Track vitamin and mineral levels',
    'Note special diet requirements',
    'Document any TPN or tube feeding',
    'Log supplements taken',
  ],

  keyTerms: {
    'Short bowel syndrome': 'Condition after significant bowel removal',
    'Malabsorption': 'Inability to properly absorb nutrients',
    'TPN': 'Total Parenteral Nutrition - IV feeding',
    'Steatorrhea': 'Fatty stools from fat malabsorption',
  },
};

// =============================================================================
// INTESTINAL FISTULA - DC 7330
// =============================================================================
const INTESTINAL_FISTULA_DESCRIPTION = {
  diagnosticCode: '7330',
  conditionName: 'Intestinal Fistula',

  evidenceLookingFor: [
    'Diagnosis of intestinal fistula with location',
    'Documentation of drainage/discharge',
    'Imaging confirming fistula',
    'Treatment history',
    'Impact on nutrition',
    'Skin care requirements',
    'Need for appliance or dressings',
    'Surgical options explored',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Slight infrequent fecal discharge',
      realWorld: 'Occasional drainage from fistula. Manageable with dressings.',
    },
    {
      percent: 60,
      meaning: 'Constant or frequent fecal discharge',
      realWorld: 'Regular drainage requiring constant attention and management.',
    },
    {
      percent: 100,
      meaning: 'Copious and frequent, not controlled by appliance',
      realWorld: 'Heavy drainage that cannot be controlled. Severe impact on life.',
    },
  ],

  documentationTips: [
    'Track drainage: frequency, amount, consistency',
    'Document dressing/appliance changes per day',
    'Record skin condition around fistula',
    'Note odor and its impact on social situations',
    'Track nutritional status',
    'Document treatments tried',
    'Log impact on activities and work',
    'Keep records of any surgeries',
  ],

  keyTerms: {
    'Fistula': 'Abnormal connection between intestine and skin or other organ',
    'Enterocutaneous': 'Fistula from bowel to skin',
    'Appliance': 'Collection bag for drainage',
    'Fecal discharge': 'Bowel contents draining through fistula',
  },
};

// =============================================================================
// ULCERATIVE COLITIS / CROHN'S - DC 7323
// =============================================================================
const COLITIS_DESCRIPTION = {
  diagnosticCode: '7323',
  conditionName: "Ulcerative Colitis / Crohn's Disease",

  evidenceLookingFor: [
    'Diagnosis of ulcerative colitis or Crohn\'s disease',
    'Colonoscopy or imaging findings',
    'Documentation of flare frequency and severity',
    'Bowel movement frequency during flares',
    'Evidence of malnutrition or weight loss',
    'Medication history: steroids, biologics, immunosuppressants',
    'Surgical history if applicable',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Moderate - infrequent exacerbations',
      realWorld: 'Occasional flares that are manageable. Periods of remission between.',
    },
    {
      percent: 30,
      meaning: 'Moderately severe - frequent exacerbations',
      realWorld: 'Frequent flares affecting quality of life. May require regular medication.',
    },
    {
      percent: 60,
      meaning: 'Severe - numerous attacks yearly and malnutrition, health only fair during remissions',
      realWorld: 'Many flares per year. Nutritional problems. Not fully well even between flares.',
    },
    {
      percent: 100,
      meaning: 'Pronounced - resulting in marked malnutrition, anemia, and general debility, OR with serious complications',
      realWorld: 'Severe disease causing major health problems. May have serious complications.',
    },
  ],

  documentationTips: [
    'Track flares: start date, duration, severity',
    'Document bowel movements during flares: frequency, blood, urgency',
    'Record weight changes',
    'Log all medications and response',
    'Note hospitalizations for flares',
    'Track lab results: hemoglobin, albumin, inflammatory markers',
    'Document diet restrictions',
    'Record impact on work and activities',
  ],

  keyTerms: {
    'Flare/exacerbation': 'Period of active disease with increased symptoms',
    'Remission': 'Period of minimal or no symptoms',
    'Biologics': 'Medications like Humira, Remicade that target specific immune pathways',
    'Fistula': 'Abnormal connection - complication of Crohn\'s',
    'Colectomy': 'Surgical removal of colon - may result in ostomy',
  },
};

// =============================================================================
// HIV - DC 6351
// =============================================================================
const HIV_DESCRIPTION = {
  diagnosticCode: '6351',
  conditionName: 'HIV/AIDS',

  evidenceLookingFor: [
    'Diagnosis of HIV infection',
    'CD4 counts over time',
    'Viral load results',
    'Evidence of opportunistic infections',
    'AIDS-defining conditions if present',
    'Medication regimen (ART)',
    'Constitutional symptoms: weight loss, fatigue, fevers',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Asymptomatic following initial infection',
      realWorld: 'HIV positive but no symptoms. Well controlled on medication.',
    },
    {
      percent: 10,
      meaning: 'Following development of HIV-related constitutional symptoms, T4 cell count 200 or more and target 500',
      realWorld: 'Some HIV symptoms have developed. CD4 count still reasonable.',
    },
    {
      percent: 30,
      meaning: 'Recurrent constitutional symptoms, intermittent diarrhea, and requiring approved medication, OR minimum rating with T4 cell count less than 200',
      realWorld: 'Recurring symptoms requiring treatment. CD4 below 200 is AIDS-defining.',
    },
    {
      percent: 60,
      meaning: 'Refractory constitutional symptoms, diarrhea, and pathological weight loss, OR minimum rating following AIDS-related opportunistic infection or neoplasm',
      realWorld: 'Symptoms not responding to treatment. Has had AIDS-defining illness.',
    },
    {
      percent: 100,
      meaning: 'AIDS with recurrent opportunistic infections or Kaposi\'s sarcoma, OR minimum rating following AIDS-related opportunistic infection or neoplasm',
      realWorld: 'Active AIDS with serious complications. Recurrent opportunistic infections.',
    },
  ],

  documentationTips: [
    'Keep ALL CD4 count and viral load results',
    'Document any opportunistic infections',
    'Track constitutional symptoms: fevers, night sweats, weight loss',
    'Log diarrhea episodes if present',
    'Record all HIV medications (ART regimen)',
    'Note medication side effects',
    'Track energy levels and functional status',
    'Document hospitalizations',
  ],

  keyTerms: {
    'CD4 count': 'Measure of immune function. Below 200 = AIDS. Higher is better',
    'Viral load': 'Amount of HIV in blood. "Undetectable" is goal of treatment',
    'ART': 'Antiretroviral Therapy - HIV medications',
    'Opportunistic infection': 'Infections that occur due to weakened immune system',
    'AIDS-defining illness': 'Specific conditions that indicate AIDS (PCP, KS, certain cancers)',
  },
};

// =============================================================================
// MALARIA - DC 6310 (Residuals)
// =============================================================================
const MALARIA_DESCRIPTION = {
  diagnosticCode: '6310',
  conditionName: 'Malaria Residuals',

  evidenceLookingFor: [
    'History of malaria infection',
    'Documentation of relapses',
    'Evidence of organ damage from malaria',
    'Liver or spleen involvement',
    'Anemia if present',
    'Current symptom documentation',
    'Treatment history',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Residuals such as liver or spleen damage - rate under affected organ',
      realWorld: 'Malaria resolved but left organ damage. Rate the specific organ affected.',
    },
    {
      percent: 100,
      meaning: 'Active disease (during active infection)',
      realWorld: 'Active malaria infection with symptoms.',
    },
  ],

  documentationTips: [
    'Keep records of malaria diagnosis and treatment',
    'Document any relapses',
    'Track residual symptoms',
    'Note any organ damage from malaria',
    'Keep liver function tests if affected',
    'Document anemia if present',
    'Track fatigue and functional limitations',
  ],

  keyTerms: {
    'Relapse': 'Return of malaria symptoms from dormant parasites',
    'Plasmodium': 'Parasite that causes malaria',
    'Residuals': 'Lasting effects after infection resolves',
    'Splenomegaly': 'Enlarged spleen - can occur with malaria',
  },
};

// =============================================================================
// BRUCELLOSIS - DC 6311
// =============================================================================
const BRUCELLOSIS_DESCRIPTION = {
  diagnosticCode: '6311',
  conditionName: 'Brucellosis',

  evidenceLookingFor: [
    'Diagnosis of brucellosis (blood tests, cultures)',
    'Documentation of symptoms: fever, sweats, fatigue, joint pain',
    'Evidence of chronic infection if present',
    'Organ involvement (spine, heart, etc.)',
    'Treatment history and response',
    'Impact on daily functioning',
    'Evidence of relapses',
    'Occupational exposure history',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Residuals - rate under specific organ affected',
      realWorld: 'Infection resolved but left residual problems in specific organs.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'Active brucellosis with ongoing symptoms.',
    },
  ],

  documentationTips: [
    'Keep all diagnostic test results',
    'Document fever patterns and night sweats',
    'Track joint pain and swelling',
    'Note fatigue and malaise',
    'Record any organ involvement',
    'Document treatment courses',
    'Track relapses if they occur',
    'Note source of exposure (occupational, travel)',
  ],

  keyTerms: {
    'Undulant fever': 'Classic fever pattern of brucellosis - comes and goes',
    'Chronic brucellosis': 'Infection lasting more than 1 year',
    'Spondylitis': 'Spine infection - complication of brucellosis',
    'Relapse': 'Return of infection after treatment',
  },
};

// =============================================================================
// INFECTIOUS ARTHRITIS - DC 5009
// =============================================================================
const INFECTIOUS_ARTHRITIS_DESCRIPTION = {
  diagnosticCode: '5009',
  conditionName: 'Infectious/Septic Arthritis',

  evidenceLookingFor: [
    'Diagnosis of septic or infectious arthritis',
    'Joint fluid analysis results',
    'Identification of causative organism',
    'Joints affected',
    'Treatment history: antibiotics, drainage',
    'Residual joint damage',
    'Current functional limitations',
    'Imaging showing joint changes',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals under limitation of motion for affected joints',
      realWorld: 'Infection resolved. Rate based on remaining joint damage and limitation.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'Active joint infection requiring treatment.',
    },
  ],

  documentationTips: [
    'Keep records of infection diagnosis and treatment',
    'Document which joints were affected',
    'Track range of motion in affected joints',
    'Note any chronic pain or stiffness',
    'Document imaging showing joint damage',
    'Record functional limitations',
    'Track any ongoing arthritis symptoms',
    'Note if prosthetic joint was required',
  ],

  keyTerms: {
    'Septic arthritis': 'Joint infection - medical emergency',
    'Residuals': 'Lasting joint damage after infection resolves',
    'Limitation of motion': 'How residuals are rated - based on joint affected',
    'Osteomyelitis': 'Bone infection that can accompany joint infection',
  },
};

// =============================================================================
// MULTIPLE SCLEROSIS - DC 8018
// =============================================================================
const MS_DESCRIPTION = {
  diagnosticCode: '8018',
  conditionName: 'Multiple Sclerosis',

  evidenceLookingFor: [
    'Diagnosis of MS from neurologist with MRI confirmation',
    'Documentation of relapses/exacerbations',
    'Evidence of neurological deficits: vision, mobility, sensation',
    'Bladder/bowel dysfunction if present',
    'Cognitive symptoms documentation',
    'Treatment history: DMTs, steroids',
    'Functional limitations',
    'Progression pattern (relapsing-remitting vs progressive)',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Minimum rating during active disease process',
      realWorld: 'Active MS with documented disease activity. This is the floor during active disease.',
    },
    {
      percent: 100,
      meaning: 'Pronounced muscular weakness, sensory disturbances, tract involvement',
      realWorld: 'Severe MS with major neurological deficits affecting multiple systems.',
    },
  ],

  documentationTips: [
    'Keep records of ALL relapses: date, symptoms, duration, treatment',
    'Document new or worsening symptoms',
    'Track mobility: walking distance, assistive devices needed',
    'Note vision problems: optic neuritis episodes, visual changes',
    'Record bladder/bowel issues',
    'Track fatigue levels - major MS symptom',
    'Document cognitive symptoms: memory, concentration',
    'Keep MRI reports showing lesion activity',
  ],

  keyTerms: {
    'Relapse/exacerbation': 'New or worsening symptoms lasting 24+ hours',
    'Remission': 'Period of stable or improved symptoms',
    'DMT': 'Disease Modifying Therapy - medications to slow MS progression',
    'Lesions': 'Areas of damage in brain/spinal cord seen on MRI',
    'EDSS': 'Expanded Disability Status Scale - measures MS disability',
    'Optic neuritis': 'Inflammation of optic nerve - common MS symptom',
  },
};

// =============================================================================
// PARKINSON'S DISEASE - DC 8004
// =============================================================================
const PARKINSONS_DESCRIPTION = {
  diagnosticCode: '8004',
  conditionName: "Parkinson's Disease",

  evidenceLookingFor: [
    'Diagnosis of Parkinson\'s from neurologist',
    'Documentation of motor symptoms: tremor, rigidity, bradykinesia',
    'Gait and balance problems',
    'Non-motor symptoms: cognitive, mood, sleep',
    'Medication effectiveness and wearing-off',
    'Impact on daily activities',
    'Speech and swallowing issues if present',
    'Progression of symptoms over time',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Minimum rating',
      realWorld: 'Parkinson\'s diagnosis with documented symptoms. Floor rating for the condition.',
    },
    {
      percent: 100,
      meaning: 'Complete disability with need for regular assistance',
      realWorld: 'Severe Parkinson\'s requiring constant help with daily activities.',
    },
  ],

  documentationTips: [
    'Track tremor: which limbs, severity, when it occurs',
    'Document stiffness/rigidity and its impact',
    'Note slowness of movement (bradykinesia)',
    'Track gait problems: shuffling, freezing, falls',
    'Document "on" and "off" times with medication',
    'Record speech changes',
    'Track swallowing difficulties',
    'Note cognitive changes: memory, thinking speed',
  ],

  keyTerms: {
    'Tremor': 'Shaking, usually at rest - classic PD symptom',
    'Bradykinesia': 'Slowness of movement',
    'Rigidity': 'Muscle stiffness',
    'Postural instability': 'Balance problems, risk of falls',
    'Freezing': 'Suddenly unable to move, especially when walking',
    'Wearing off': 'Medication effectiveness decreasing before next dose',
  },
};

// =============================================================================
// ALS (AMYOTROPHIC LATERAL SCLEROSIS) - DC 8017
// =============================================================================
const ALS_DESCRIPTION = {
  diagnosticCode: '8017',
  conditionName: 'ALS (Lou Gehrig\'s Disease)',

  evidenceLookingFor: [
    'Diagnosis of ALS from neurologist',
    'EMG/nerve conduction studies',
    'Documentation of progressive weakness',
    'Bulbar symptoms: speech, swallowing',
    'Respiratory function tests',
    'Functional status documentation',
    'Assistive device requirements',
    'Rate of progression',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'ALS diagnosis',
      realWorld: 'ALS is automatically rated at 100% due to its progressive, fatal nature.',
    },
  ],

  documentationTips: [
    'Keep all diagnostic test results',
    'Document weakness progression: which muscles, timeline',
    'Track speech changes',
    'Note swallowing difficulties',
    'Record breathing symptoms and pulmonary function',
    'Document assistive devices needed',
    'Track weight changes',
    'Note any feeding tube or ventilator use',
  ],

  keyTerms: {
    'Motor neuron disease': 'Category ALS belongs to - affects nerve cells controlling muscles',
    'Bulbar symptoms': 'Affecting speech and swallowing',
    'Fasciculations': 'Muscle twitching - common in ALS',
    'FVC': 'Forced Vital Capacity - respiratory measure tracked in ALS',
    'PEG tube': 'Feeding tube often needed as swallowing worsens',
  },
};

// =============================================================================
// MYASTHENIA GRAVIS - DC 8025
// =============================================================================
const MYASTHENIA_DESCRIPTION = {
  diagnosticCode: '8025',
  conditionName: 'Myasthenia Gravis',

  evidenceLookingFor: [
    'Diagnosis of myasthenia gravis with antibody testing',
    'Documentation of muscle weakness pattern',
    'Ptosis (drooping eyelid) and diplopia (double vision)',
    'Bulbar symptoms if present',
    'Response to treatment',
    'Myasthenic crises history',
    'Thymectomy if performed',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Minimum rating',
      realWorld: 'Myasthenia gravis diagnosis with symptoms. Floor rating for the condition.',
    },
    {
      percent: 60,
      meaning: 'Moderately severe symptoms',
      realWorld: 'Significant weakness affecting daily activities despite treatment.',
    },
    {
      percent: 100,
      meaning: 'Severe generalized weakness requiring assistance',
      realWorld: 'Severe MG with major weakness. May have frequent crises.',
    },
  ],

  documentationTips: [
    'Track muscle weakness: which muscles, time of day, fatigue pattern',
    'Document eyelid drooping and double vision',
    'Note speech and swallowing difficulties',
    'Track breathing symptoms',
    'Record medication effectiveness',
    'Document any myasthenic crises (ER visits, hospitalizations)',
    'Note activities limited by weakness',
    'Track fatigue pattern throughout day',
  ],

  keyTerms: {
    'Ptosis': 'Drooping eyelid - classic MG symptom',
    'Diplopia': 'Double vision',
    'Fatigable weakness': 'Weakness that worsens with use - hallmark of MG',
    'Myasthenic crisis': 'Severe weakness affecting breathing - emergency',
    'Thymectomy': 'Thymus removal - can help some MG patients',
    'Acetylcholine receptor antibodies': 'Blood test confirming MG',
  },
};

// =============================================================================
// THYROIDITIS - DC 7904/7905
// =============================================================================
const THYROIDITIS_DESCRIPTION = {
  diagnosticCode: '7904',
  conditionName: 'Thyroiditis',

  evidenceLookingFor: [
    'Diagnosis of thyroiditis (Hashimoto\'s, subacute, etc.)',
    'Thyroid function tests over time',
    'Thyroid antibody levels',
    'Documentation of symptoms',
    'Ultrasound or imaging if performed',
    'Treatment requirements',
    'Whether condition caused hypo- or hyperthyroidism',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on resulting thyroid dysfunction',
      realWorld: 'Thyroiditis itself is rated based on whether it causes hypothyroidism or hyperthyroidism.',
    },
  ],

  documentationTips: [
    'Keep all thyroid lab results',
    'Track symptoms: fatigue, weight changes, temperature sensitivity',
    'Document any thyroid pain (subacute thyroiditis)',
    'Note medication requirements',
    'Track antibody levels if Hashimoto\'s',
    'Document progression to hypothyroidism',
    'Record energy levels and functional status',
  ],

  keyTerms: {
    'Hashimoto\'s thyroiditis': 'Autoimmune thyroiditis - most common cause of hypothyroidism',
    'Subacute thyroiditis': 'Painful thyroid inflammation, often after viral illness',
    'Thyroid antibodies': 'TPO and thyroglobulin antibodies indicate autoimmune thyroiditis',
    'Goiter': 'Enlarged thyroid gland',
  },
};

// =============================================================================
// ADDISON'S DISEASE - DC 7911
// =============================================================================
const ADDISONS_DESCRIPTION = {
  diagnosticCode: '7911',
  conditionName: "Addison's Disease (Adrenal Insufficiency)",

  evidenceLookingFor: [
    'Diagnosis of adrenal insufficiency',
    'ACTH stimulation test results',
    'Cortisol levels',
    'Documentation of symptoms: fatigue, weakness, weight loss',
    'Evidence of adrenal crises if occurred',
    'Steroid replacement requirements',
    'Electrolyte abnormalities',
    'Impact on daily functioning',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Requiring continuous medication for control',
      realWorld: 'Addison\'s controlled with daily steroid replacement.',
    },
    {
      percent: 40,
      meaning: 'Fatigability, weakness, anorexia, malaise, weight loss',
      realWorld: 'Symptoms persist despite medication. Noticeable impact on functioning.',
    },
    {
      percent: 60,
      meaning: 'Four or more adrenal crises in past year',
      realWorld: 'Frequent adrenal crises requiring emergency treatment.',
    },
  ],

  documentationTips: [
    'Keep records of cortisol and ACTH levels',
    'Document steroid doses and any adjustments',
    'Track fatigue and weakness levels',
    'Record any adrenal crises: triggers, treatment needed',
    'Note weight changes',
    'Track salt cravings and blood pressure',
    'Document skin darkening if present',
    'Log sick day steroid adjustments',
  ],

  keyTerms: {
    'Adrenal insufficiency': 'Adrenal glands don\'t produce enough hormones',
    'Cortisol': 'Stress hormone that must be replaced',
    'Adrenal crisis': 'Life-threatening emergency from cortisol deficiency',
    'ACTH stimulation test': 'Diagnostic test for adrenal function',
    'Stress dosing': 'Increasing steroids during illness or stress',
  },
};

// =============================================================================
// CUSHING'S SYNDROME - DC 7907
// =============================================================================
const CUSHINGS_DESCRIPTION = {
  diagnosticCode: '7907',
  conditionName: "Cushing's Syndrome",

  evidenceLookingFor: [
    'Diagnosis of Cushing\'s syndrome/disease',
    'Cortisol level testing (24-hour urine, salivary, blood)',
    'ACTH levels',
    'Imaging showing pituitary or adrenal tumor if applicable',
    'Documentation of symptoms: weight gain, moon face, striae',
    'Treatment history: surgery, medication',
    'Complications: diabetes, osteoporosis, hypertension',
    'Current functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Cushingoid appearance with mild symptoms',
      realWorld: 'Characteristic appearance with manageable symptoms.',
    },
    {
      percent: 60,
      meaning: 'Moderate symptoms with complications',
      realWorld: 'Noticeable symptoms plus complications like diabetes or hypertension.',
    },
    {
      percent: 100,
      meaning: 'Severe symptoms with serious complications',
      realWorld: 'Severe Cushing\'s with major health problems.',
    },
  ],

  documentationTips: [
    'Keep all cortisol test results',
    'Document physical changes: weight, face shape, skin',
    'Track blood sugar levels',
    'Record blood pressure',
    'Note muscle weakness and fatigue',
    'Document mood changes',
    'Track bone density if tested',
    'Record surgical history if applicable',
  ],

  keyTerms: {
    'Cushing\'s disease': 'Specifically from pituitary tumor producing ACTH',
    'Cushing\'s syndrome': 'Excess cortisol from any cause',
    'Moon face': 'Rounded face from fat redistribution',
    'Buffalo hump': 'Fat pad on upper back',
    'Striae': 'Purple stretch marks - characteristic sign',
  },
};

// =============================================================================
// SICKLE CELL DISEASE - DC 7702
// =============================================================================
const SICKLE_CELL_DESCRIPTION = {
  diagnosticCode: '7702',
  conditionName: 'Sickle Cell Disease',

  evidenceLookingFor: [
    'Diagnosis of sickle cell disease (not trait)',
    'Documentation of pain crises',
    'Hemoglobin levels',
    'Evidence of organ damage: spleen, kidneys, lungs',
    'Hospitalizations for crises',
    'Transfusion requirements',
    'Treatment history: hydroxyurea, etc.',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Asymptomatic, established case in remission',
      realWorld: 'Known sickle cell but currently well without crises.',
    },
    {
      percent: 30,
      meaning: 'Painful crises not requiring narcotic medications',
      realWorld: 'Occasional crises manageable without strong pain medication.',
    },
    {
      percent: 60,
      meaning: 'Painful crises requiring narcotic medications',
      realWorld: 'Regular crises needing strong pain medication for control.',
    },
    {
      percent: 100,
      meaning: 'Frequent hospitalizations and transfusions',
      realWorld: 'Severe disease with repeated hospital stays and blood transfusions.',
    },
  ],

  documentationTips: [
    'Track pain crises: frequency, duration, severity, treatment needed',
    'Document hospitalizations for crises',
    'Record hemoglobin levels',
    'Note transfusions received',
    'Track organ complications',
    'Document medications and effectiveness',
    'Record days missed from work/activities',
    'Note triggers for crises',
  ],

  keyTerms: {
    'Pain crisis': 'Episode of severe pain from sickled cells blocking blood flow',
    'Acute chest syndrome': 'Serious lung complication - can be life-threatening',
    'Hemolysis': 'Breakdown of red blood cells causing anemia',
    'Hydroxyurea': 'Medication that reduces crises frequency',
    'Aplastic crisis': 'Sudden drop in red blood cell production',
  },
};

// =============================================================================
// LEUKEMIA - DC 7703
// =============================================================================
const LEUKEMIA_DESCRIPTION = {
  diagnosticCode: '7703',
  conditionName: 'Leukemia',

  evidenceLookingFor: [
    'Diagnosis of leukemia with type specified',
    'Bone marrow biopsy results',
    'CBC showing abnormal counts',
    'Treatment history: chemotherapy, transplant',
    'Current disease status: remission, active',
    'Transfusion requirements',
    'Infection history',
    'Functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'Active disease or during treatment',
      realWorld: 'Active leukemia or undergoing chemotherapy/treatment.',
    },
    {
      percent: 0,
      meaning: 'In remission - rate residuals',
      realWorld: 'If in stable remission, rate any lasting effects separately.',
    },
  ],

  documentationTips: [
    'Keep all bone marrow biopsy results',
    'Track blood counts over time',
    'Document treatment received',
    'Note transfusions needed',
    'Record infections and hospitalizations',
    'Track fatigue and functional status',
    'Document remission status',
    'Keep records of any lasting side effects',
  ],

  keyTerms: {
    'Acute leukemia': 'Fast-growing - requires immediate treatment',
    'Chronic leukemia': 'Slower-growing - may be monitored initially',
    'Remission': 'No evidence of disease after treatment',
    'Bone marrow transplant': 'Treatment option for some leukemias',
    'Cytopenia': 'Low blood cell counts',
  },
};

// =============================================================================
// POLYCYTHEMIA VERA - DC 7704
// =============================================================================
const POLYCYTHEMIA_DESCRIPTION = {
  diagnosticCode: '7704',
  conditionName: 'Polycythemia Vera',

  evidenceLookingFor: [
    'Diagnosis of polycythemia vera',
    'Hemoglobin/hematocrit levels',
    'JAK2 mutation testing',
    'Phlebotomy requirements',
    'Medication treatment (hydroxyurea)',
    'Evidence of complications: clots, bleeding',
    'Symptom documentation',
    'Current functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 40,
      meaning: 'Requiring phlebotomy 4+ times yearly',
      realWorld: 'Needs regular blood removal to control condition.',
    },
    {
      percent: 100,
      meaning: 'During treatment phase for myeloid metaplasia',
      realWorld: 'Progression to more serious phase requiring intensive treatment.',
    },
  ],

  documentationTips: [
    'Track hemoglobin/hematocrit levels',
    'Record phlebotomy frequency and dates',
    'Document medications used',
    'Note symptoms: headache, dizziness, itching',
    'Track any blood clot events',
    'Record bleeding episodes',
    'Document spleen enlargement if present',
    'Note fatigue and functional limitations',
  ],

  keyTerms: {
    'Polycythemia': 'Too many red blood cells - makes blood thick',
    'Phlebotomy': 'Blood removal - main treatment to reduce cell count',
    'JAK2 mutation': 'Genetic marker found in most PV cases',
    'Thrombosis': 'Blood clots - main complication risk',
    'Myelofibrosis': 'Possible progression - bone marrow scarring',
  },
};

// =============================================================================
// THROMBOCYTOPENIA - DC 7705
// =============================================================================
const THROMBOCYTOPENIA_DESCRIPTION = {
  diagnosticCode: '7705',
  conditionName: 'Immune Thrombocytopenia (ITP)',

  evidenceLookingFor: [
    'Diagnosis of immune thrombocytopenia',
    'Platelet counts over time',
    'Bleeding episodes documentation',
    'Treatment history: steroids, IVIG, splenectomy',
    'Transfusion requirements',
    'Bruising documentation',
    'Impact on activities',
    'Current treatment requirements',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Stable platelet count without treatment',
      realWorld: 'ITP in remission without need for ongoing treatment.',
    },
    {
      percent: 30,
      meaning: 'Requiring continuous treatment to maintain platelet count',
      realWorld: 'Needs ongoing medication to keep platelets at safe level.',
    },
    {
      percent: 70,
      meaning: 'Platelet count below 20,000 with significant bleeding risk',
      realWorld: 'Very low platelets despite treatment. High bleeding risk.',
    },
    {
      percent: 100,
      meaning: 'Life-threatening bleeding episodes',
      realWorld: 'Severe bleeding events requiring emergency treatment.',
    },
  ],

  documentationTips: [
    'Track platelet counts over time',
    'Document bleeding episodes: nosebleeds, gum bleeding, bruising',
    'Record all treatments and response',
    'Note any transfusions',
    'Track bruising: size, frequency, triggers',
    'Document activity restrictions',
    'Keep records of hospitalizations',
    'Note any splenectomy',
  ],

  keyTerms: {
    'Platelet count': 'Normal is 150,000-400,000. Below 100,000 is low',
    'ITP': 'Immune Thrombocytopenia - immune system destroys platelets',
    'IVIG': 'Intravenous immunoglobulin - treatment option',
    'Splenectomy': 'Spleen removal - can help some ITP patients',
    'Petechiae': 'Tiny red dots from bleeding under skin',
  },
};

// =============================================================================
// HODGKIN'S LYMPHOMA - DC 7706
// =============================================================================
const HODGKINS_DESCRIPTION = {
  diagnosticCode: '7706',
  conditionName: "Hodgkin's Lymphoma",

  evidenceLookingFor: [
    'Diagnosis of Hodgkin\'s lymphoma with biopsy',
    'Staging at diagnosis',
    'Treatment history: chemotherapy, radiation',
    'Current disease status',
    'PET/CT scan results',
    'Evidence of remission or active disease',
    'Treatment side effects/residuals',
    'Functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'Active disease or during treatment',
      realWorld: 'Active Hodgkin\'s or undergoing chemotherapy/radiation.',
    },
    {
      percent: 0,
      meaning: 'In remission - rate residuals',
      realWorld: 'If in stable remission, rate any lasting effects separately.',
    },
  ],

  documentationTips: [
    'Keep biopsy and staging reports',
    'Document all treatment received',
    'Track scan results showing disease status',
    'Record remission date',
    'Note ongoing symptoms or side effects',
    'Document fatigue and functional limitations',
    'Track any secondary conditions from treatment',
    'Keep records of follow-up monitoring',
  ],

  keyTerms: {
    'Reed-Sternberg cells': 'Characteristic cells that define Hodgkin\'s',
    'Staging': 'How far disease has spread (I-IV)',
    'Remission': 'No evidence of disease',
    'B symptoms': 'Fever, night sweats, weight loss - affect prognosis',
    'PET scan': 'Imaging to detect active disease',
  },
};

// =============================================================================
// NON-HODGKIN'S LYMPHOMA - DC 7715
// =============================================================================
const NON_HODGKINS_DESCRIPTION = {
  diagnosticCode: '7715',
  conditionName: "Non-Hodgkin's Lymphoma",

  evidenceLookingFor: [
    'Diagnosis of NHL with specific subtype',
    'Biopsy results',
    'Staging information',
    'Treatment history',
    'Current disease status',
    'Scan results',
    'Evidence of remission or progression',
    'Functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'Active disease or during treatment',
      realWorld: 'Active NHL or undergoing treatment.',
    },
    {
      percent: 0,
      meaning: 'In remission - rate residuals',
      realWorld: 'If in stable remission, rate any lasting effects.',
    },
  ],

  documentationTips: [
    'Keep biopsy showing NHL subtype',
    'Document staging at diagnosis',
    'Track all treatments',
    'Record scan results',
    'Note remission status and date',
    'Document ongoing symptoms',
    'Track any treatment side effects',
    'Keep follow-up records',
  ],

  keyTerms: {
    'NHL subtypes': 'Many types - some aggressive, some slow-growing (indolent)',
    'Indolent lymphoma': 'Slow-growing - may be watched initially',
    'Aggressive lymphoma': 'Fast-growing - needs immediate treatment',
    'CHOP': 'Common chemotherapy regimen for NHL',
    'Rituximab': 'Targeted therapy used in many NHL treatments',
  },
};

// =============================================================================
// MULTIPLE MYELOMA - DC 7709
// =============================================================================
const MYELOMA_DESCRIPTION = {
  diagnosticCode: '7709',
  conditionName: 'Multiple Myeloma',

  evidenceLookingFor: [
    'Diagnosis of multiple myeloma',
    'Bone marrow biopsy results',
    'M-protein levels (SPEP/UPEP)',
    'Evidence of CRAB criteria: Calcium, Renal, Anemia, Bone',
    'Skeletal survey or imaging showing bone lesions',
    'Treatment history',
    'Current disease status',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'Active disease or during treatment',
      realWorld: 'Active myeloma or undergoing chemotherapy/stem cell transplant.',
    },
    {
      percent: 0,
      meaning: 'In remission - rate residuals',
      realWorld: 'If in stable remission, rate bone damage, kidney issues, etc. separately.',
    },
  ],

  documentationTips: [
    'Keep bone marrow biopsy results',
    'Track M-protein levels',
    'Document bone lesions and fractures',
    'Record calcium levels',
    'Track kidney function',
    'Note anemia and blood counts',
    'Document pain levels and locations',
    'Keep treatment records',
  ],

  keyTerms: {
    'M-protein': 'Abnormal protein produced by myeloma cells - tracked to monitor disease',
    'CRAB criteria': 'Calcium elevation, Renal failure, Anemia, Bone lesions',
    'Lytic lesions': 'Holes in bones from myeloma',
    'Stem cell transplant': 'Treatment option for eligible patients',
    'Light chains': 'Part of M-protein - tracked in some patients',
  },
};

// =============================================================================
// EMPHYSEMA - DC 6603
// =============================================================================
const EMPHYSEMA_DESCRIPTION = {
  diagnosticCode: '6603',
  conditionName: 'Emphysema',

  evidenceLookingFor: [
    'Diagnosis of emphysema/COPD',
    'Pulmonary function tests: FEV-1, FVC, DLCO',
    'Chest imaging showing emphysematous changes',
    'Oxygen requirements if applicable',
    'Exercise tolerance documentation',
    'Respiratory symptoms: dyspnea, cough',
    'Smoking history',
    'Treatment history and response',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FEV-1 71-80% predicted, OR FEV-1/FVC 71-80%, OR DLCO 66-80%',
      realWorld: 'Mild emphysema with some breathing limitation during exertion.',
    },
    {
      percent: 30,
      meaning: 'FEV-1 56-70% predicted, OR FEV-1/FVC 56-70%, OR DLCO 56-65%',
      realWorld: 'Moderate emphysema. Noticeable shortness of breath with activity.',
    },
    {
      percent: 60,
      meaning: 'FEV-1 40-55% predicted, OR FEV-1/FVC 40-55%, OR DLCO 40-55%',
      realWorld: 'Severe emphysema. Significant breathing limitation. May need oxygen with activity.',
    },
    {
      percent: 100,
      meaning: 'FEV-1 less than 40%, OR FEV-1/FVC less than 40%, OR DLCO less than 40%, OR cor pulmonale, OR requires oxygen therapy',
      realWorld: 'Very severe emphysema. Requires continuous oxygen or has heart complications.',
    },
  ],

  documentationTips: [
    'Keep ALL pulmonary function test results',
    'Track oxygen saturation levels',
    'Document shortness of breath triggers and severity',
    'Log walking distance before needing to rest',
    'Record exacerbations requiring steroids or antibiotics',
    'Track oxygen use: flow rate, hours per day',
    'Document impact on daily activities',
    'Note any hospitalizations for breathing problems',
  ],

  keyTerms: {
    'FEV-1': 'Forced Expiratory Volume - key measure of airflow obstruction',
    'DLCO': 'Diffusion capacity - how well oxygen transfers to blood',
    'Cor pulmonale': 'Right heart failure from lung disease - qualifies for 100%',
    'Oxygen therapy': 'Supplemental oxygen - if continuous, qualifies for 100%',
    'Alpha-1 antitrypsin': 'Genetic cause of emphysema in some patients',
  },
};

// =============================================================================
// BRONCHIECTASIS - DC 6601
// =============================================================================
const BRONCHIECTASIS_DESCRIPTION = {
  diagnosticCode: '6601',
  conditionName: 'Bronchiectasis',

  evidenceLookingFor: [
    'Diagnosis of bronchiectasis on CT scan',
    'Pulmonary function tests',
    'Documentation of chronic cough and sputum production',
    'Infection frequency',
    'Antibiotic requirements',
    'Hospitalization records',
    'Impact on daily functioning',
    'Treatment regimen',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Intermittent productive cough with acute infection requiring antibiotics 1-2 times yearly',
      realWorld: 'Occasional flare-ups needing antibiotics once or twice a year.',
    },
    {
      percent: 30,
      meaning: 'Daily productive cough with acute infections requiring antibiotics 4-6 times yearly',
      realWorld: 'Daily symptoms with frequent infections needing regular antibiotic courses.',
    },
    {
      percent: 60,
      meaning: 'Near-constant productive cough with recurrent acute infections requiring antibiotics almost continuously',
      realWorld: 'Constant cough and nearly continuous infections. Almost always on antibiotics.',
    },
    {
      percent: 100,
      meaning: 'Pronounced symptoms with extensive fibrosis, cor pulmonale, or requiring oxygen',
      realWorld: 'Severe disease with lung damage, heart complications, or oxygen dependence.',
    },
  ],

  documentationTips: [
    'Track daily sputum production: amount, color',
    'Document antibiotic courses: frequency, duration',
    'Log hospitalizations for lung infections',
    'Keep CT scans showing bronchiectasis',
    'Record pulmonary function test results',
    'Track daily cough and its impact',
    'Document airway clearance regimen',
    'Note oxygen use if applicable',
  ],

  keyTerms: {
    'Bronchiectasis': 'Permanent widening of airways causing mucus buildup and infections',
    'Productive cough': 'Cough bringing up sputum/phlegm',
    'Exacerbation': 'Worsening requiring antibiotics or hospitalization',
    'Airway clearance': 'Techniques to help clear mucus (vest therapy, chest PT)',
  },
};

// =============================================================================
// CHRONIC BRONCHITIS - DC 6600
// =============================================================================
const BRONCHITIS_DESCRIPTION = {
  diagnosticCode: '6600',
  conditionName: 'Chronic Bronchitis',

  evidenceLookingFor: [
    'Diagnosis of chronic bronchitis',
    'Pulmonary function tests',
    'Documentation of chronic productive cough',
    'Evidence of cough for 3+ months for 2+ consecutive years',
    'Infection and exacerbation frequency',
    'Treatment requirements',
    'Smoking history if applicable',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FEV-1 71-80% predicted, OR FEV-1/FVC 71-80%',
      realWorld: 'Mild chronic bronchitis with some airflow limitation.',
    },
    {
      percent: 30,
      meaning: 'FEV-1 56-70% predicted, OR FEV-1/FVC 56-70%',
      realWorld: 'Moderate chronic bronchitis affecting breathing.',
    },
    {
      percent: 60,
      meaning: 'FEV-1 40-55% predicted, OR FEV-1/FVC 40-55%',
      realWorld: 'Severe chronic bronchitis with significant breathing limitation.',
    },
    {
      percent: 100,
      meaning: 'FEV-1 less than 40%, OR requires oxygen therapy',
      realWorld: 'Very severe disease requiring continuous oxygen.',
    },
  ],

  documentationTips: [
    'Document chronic cough: daily occurrence, duration',
    'Track sputum production',
    'Keep pulmonary function tests',
    'Record exacerbations and treatments',
    'Log antibiotic courses',
    'Track impact on activities',
    'Document oxygen requirements if any',
    'Note smoking cessation efforts',
  ],

  keyTerms: {
    'Chronic bronchitis': 'Productive cough for 3+ months in 2+ consecutive years',
    'FEV-1': 'Forced Expiratory Volume - measures airflow obstruction',
    'Exacerbation': 'Worsening of symptoms requiring treatment',
    'COPD': 'Chronic bronchitis is part of COPD spectrum',
  },
};

// =============================================================================
// SARCOIDOSIS - DC 6824/6825
// =============================================================================
const SARCOIDOSIS_DESCRIPTION = {
  diagnosticCode: '6846',
  conditionName: 'Sarcoidosis',

  evidenceLookingFor: [
    'Diagnosis of sarcoidosis with biopsy confirmation',
    'Documentation of organ involvement',
    'Pulmonary function tests if lungs involved',
    'Imaging showing granulomas',
    'Treatment history: steroids, immunosuppressants',
    'Evidence of stable, progressive, or active disease',
    'Functional limitations',
    'Extra-pulmonary manifestations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Chronic hilar adenopathy, stable without symptoms',
      realWorld: 'Sarcoidosis present on imaging but not causing problems.',
    },
    {
      percent: 30,
      meaning: 'Pulmonary involvement with persistent symptoms requiring chronic low-dose or intermittent corticosteroids',
      realWorld: 'Lung involvement needing ongoing steroid treatment.',
    },
    {
      percent: 60,
      meaning: 'Pulmonary involvement requiring systemic high dose corticosteroids for control',
      realWorld: 'Active lung disease needing high-dose steroids.',
    },
    {
      percent: 100,
      meaning: 'Cor pulmonale, cardiac involvement, or progressive pulmonary disease despite treatment',
      realWorld: 'Severe disease affecting heart or progressing despite treatment.',
    },
  ],

  documentationTips: [
    'Keep biopsy results confirming sarcoidosis',
    'Document which organs are affected',
    'Track pulmonary function if lungs involved',
    'Record steroid doses and duration',
    'Note disease activity: stable vs progressive',
    'Track symptoms: cough, fatigue, skin lesions',
    'Document eye exams if eyes involved',
    'Keep imaging showing disease extent',
  ],

  keyTerms: {
    'Granulomas': 'Clusters of immune cells - hallmark of sarcoidosis',
    'Hilar adenopathy': 'Enlarged lymph nodes in chest - common finding',
    'L&Ouml;fgren syndrome': 'Acute sarcoidosis with good prognosis',
    'Extra-pulmonary': 'Sarcoidosis affecting organs other than lungs',
  },
};

// =============================================================================
// PULMONARY FIBROSIS - DC 6731
// =============================================================================
const PULMONARY_FIBROSIS_DESCRIPTION = {
  diagnosticCode: '6731',
  conditionName: 'Pulmonary Fibrosis',

  evidenceLookingFor: [
    'Diagnosis of pulmonary fibrosis (IPF or other type)',
    'High-resolution CT showing fibrosis pattern',
    'Pulmonary function tests: FVC, DLCO',
    'Oxygen requirements',
    'Six-minute walk test results',
    'Treatment history',
    'Progression documentation',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FVC 75-80% predicted, OR DLCO 66-80%',
      realWorld: 'Mild fibrosis with some reduction in lung capacity.',
    },
    {
      percent: 30,
      meaning: 'FVC 65-74% predicted, OR DLCO 56-65%',
      realWorld: 'Moderate fibrosis affecting breathing.',
    },
    {
      percent: 60,
      meaning: 'FVC 50-64% predicted, OR DLCO 40-55%',
      realWorld: 'Severe fibrosis with significant breathing limitation.',
    },
    {
      percent: 100,
      meaning: 'FVC less than 50%, OR DLCO less than 40%, OR requires oxygen therapy, OR cor pulmonale',
      realWorld: 'Very severe fibrosis. Oxygen dependent or heart complications.',
    },
  ],

  documentationTips: [
    'Keep ALL pulmonary function tests - track trends',
    'Document oxygen requirements',
    'Track walking distance and exercise tolerance',
    'Keep CT scans showing progression',
    'Record cough and breathing symptoms',
    'Note any medications tried',
    'Document impact on daily activities',
    'Track weight changes',
  ],

  keyTerms: {
    'IPF': 'Idiopathic Pulmonary Fibrosis - most common type, cause unknown',
    'FVC': 'Forced Vital Capacity - measures total lung volume',
    'DLCO': 'Diffusion capacity - key measure in fibrosis',
    'Honeycombing': 'CT pattern indicating advanced fibrosis',
    'UIP pattern': 'Usual Interstitial Pneumonia - CT pattern of IPF',
  },
};

// =============================================================================
// PSORIASIS - DC 7816
// =============================================================================
const PSORIASIS_DESCRIPTION = {
  diagnosticCode: '7816',
  conditionName: 'Psoriasis',

  evidenceLookingFor: [
    'Diagnosis of psoriasis',
    'Documentation of body surface area affected',
    'Evidence of exposed areas involvement (face, neck, hands)',
    'Treatment history: topical, systemic, biologics',
    'Photographs during flares',
    'Impact on daily functioning',
    'Associated psoriatic arthritis if present',
    'Frequency and severity of flares',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body affected, no more than topical therapy required',
      realWorld: 'Minimal psoriasis controlled with creams and ointments.',
    },
    {
      percent: 10,
      meaning: 'At least 5% but less than 20% of body, OR systemic therapy needed intermittently',
      realWorld: 'Moderate psoriasis or requiring occasional systemic treatment.',
    },
    {
      percent: 30,
      meaning: '20-40% of body affected, OR systemic therapy required for 6+ weeks in past 12 months',
      realWorld: 'Significant psoriasis requiring regular systemic treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body affected, OR constant/near-constant systemic therapy required',
      realWorld: 'Severe, widespread psoriasis requiring constant systemic treatment.',
    },
  ],

  documentationTips: [
    'Estimate body surface area affected (palm = 1%)',
    'Take photos during flares showing extent',
    'Document face, neck, and hand involvement',
    'Track all treatments: topical, pills, injections',
    'Note duration of systemic therapy',
    'Record flare frequency and triggers',
    'Document impact on work and social life',
    'Track any joint symptoms (psoriatic arthritis)',
  ],

  keyTerms: {
    'Body surface area (BSA)': 'Percentage of skin affected - your palm = about 1%',
    'Exposed areas': 'Face, neck, hands - visible areas weighted more heavily',
    'Systemic therapy': 'Pills, injections, or biologics (not just creams)',
    'Biologics': 'Injectable medications like Humira, Enbrel, Stelara',
    'Psoriatic arthritis': 'Joint inflammation that can accompany psoriasis',
  },
};

// =============================================================================
// HYPERHIDROSIS - DC 7832
// =============================================================================
const HYPERHIDROSIS_DESCRIPTION = {
  diagnosticCode: '7832',
  conditionName: 'Hyperhidrosis (Excessive Sweating)',

  evidenceLookingFor: [
    'Diagnosis of hyperhidrosis',
    'Documentation of affected areas',
    'Evidence this is not due to other medical condition',
    'Impact on daily activities and work',
    'Treatment history',
    'Frequency: constant vs situational',
    'Need to change clothing multiple times daily',
    'Psychological impact',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Able to handle paper or tools after drying hands',
      realWorld: 'Sweating present but manageable. Can function with minor accommodations.',
    },
    {
      percent: 30,
      meaning: 'Unable to handle paper or tools because of moisture',
      realWorld: 'Sweating severe enough to interfere with handling objects.',
    },
  ],

  documentationTips: [
    'Document which areas are affected (palms, feet, underarms)',
    'Track frequency: constant or triggered by stress/heat',
    'Note how many times you change clothes daily',
    'Document impact on work tasks',
    'Track treatments tried and effectiveness',
    'Note impact on social situations',
    'Document if sweating affects grip/handling objects',
    'Keep records of any procedures (Botox, surgery)',
  ],

  keyTerms: {
    'Primary hyperhidrosis': 'Excessive sweating not caused by other condition',
    'Secondary hyperhidrosis': 'Sweating due to underlying condition or medication',
    'Focal hyperhidrosis': 'Affecting specific areas (palms, soles, underarms)',
    'Iontophoresis': 'Treatment using electrical current',
  },
};

// =============================================================================
// ALOPECIA - DC 7831
// =============================================================================
const ALOPECIA_DESCRIPTION = {
  diagnosticCode: '7831',
  conditionName: 'Alopecia Areata',

  evidenceLookingFor: [
    'Diagnosis of alopecia areata',
    'Documentation of hair loss extent',
    'Evidence of loss on head vs body',
    'Loss of eyebrows/eyelashes if applicable',
    'Treatment history',
    'Pattern: patchy vs total',
    'Photographs showing extent',
    'Impact on daily life',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Loss of hair limited to scalp and face',
      realWorld: 'Hair loss on head and face only.',
    },
    {
      percent: 10,
      meaning: 'Loss of all body hair',
      realWorld: 'Complete loss of hair on entire body (alopecia universalis).',
    },
  ],

  documentationTips: [
    'Document which areas have hair loss',
    'Take photographs showing extent',
    'Note if eyebrows/eyelashes affected',
    'Track any regrowth periods',
    'Document treatments tried',
    'Note if hair loss is total body (universalis)',
    'Record psychological impact',
    'Track progression over time',
  ],

  keyTerms: {
    'Alopecia areata': 'Patchy hair loss - autoimmune condition',
    'Alopecia totalis': 'Complete scalp hair loss',
    'Alopecia universalis': 'Complete body hair loss - 10% rating',
    'Autoimmune': 'Immune system attacks hair follicles',
  },
};

// =============================================================================
// CHLORACNE/ACNE - DC 7829
// =============================================================================
const CHLORACNE_DESCRIPTION = {
  diagnosticCode: '7829',
  conditionName: 'Chloracne',

  evidenceLookingFor: [
    'Diagnosis of chloracne',
    'Documentation of dioxin/herbicide exposure (Agent Orange)',
    'Extent of skin involvement',
    'Location of lesions',
    'Scarring documentation',
    'Treatment history',
    'Photographs',
    'Impact on appearance and function',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Superficial acne affecting less than 40% of face/neck, OR other than face/neck',
      realWorld: 'Mild chloracne not extensively affecting visible areas.',
    },
    {
      percent: 10,
      meaning: 'Deep acne affecting less than 40% of face/neck, OR deep acne other than face/neck',
      realWorld: 'Deep lesions but not extensively affecting face/neck.',
    },
    {
      percent: 30,
      meaning: 'Deep acne affecting 40% or more of face/neck',
      realWorld: 'Extensive deep lesions on visible face/neck areas.',
    },
  ],

  documentationTips: [
    'Document herbicide exposure history',
    'Take photographs of affected areas',
    'Note which areas of body affected',
    'Measure percentage of face/neck involved',
    'Document depth: superficial vs deep cysts',
    'Track scarring',
    'Record treatments tried',
    'Note if condition appeared within year of exposure',
  ],

  keyTerms: {
    'Chloracne': 'Acne-like condition from dioxin exposure',
    'Agent Orange': 'Herbicide used in Vietnam containing dioxin',
    'Presumptive condition': 'VA presumes service connection for Vietnam vets',
    'Deep acne': 'Cystic lesions, not just surface pimples',
  },
};

// =============================================================================
// SKIN INFECTIONS - DC 7820
// =============================================================================
const SKIN_INFECTIONS_DESCRIPTION = {
  diagnosticCode: '7820',
  conditionName: 'Skin Infections (Fungal, Bacterial)',

  evidenceLookingFor: [
    'Diagnosis of chronic skin infection',
    'Type of infection (fungal, bacterial)',
    'Body areas affected',
    'Treatment requirements',
    'Recurrence frequency',
    'Response to treatment',
    'Impact on daily activities',
    'Photographs if available',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body, topical therapy only',
      realWorld: 'Minor skin infection controlled with topical treatment.',
    },
    {
      percent: 10,
      meaning: '5-20% of body, OR intermittent systemic therapy',
      realWorld: 'Moderate infection sometimes needing oral medication.',
    },
    {
      percent: 30,
      meaning: '20-40% of body, OR systemic therapy 6+ weeks/year',
      realWorld: 'Significant infection requiring regular systemic treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body, OR constant systemic therapy',
      realWorld: 'Severe, widespread infection needing constant treatment.',
    },
  ],

  documentationTips: [
    'Document type of infection',
    'Estimate body surface area affected',
    'Track recurrence frequency',
    'Log all treatments: topical and oral',
    'Take photographs during flares',
    'Document systemic therapy duration',
    'Note impact on work and activities',
    'Record any cultures done',
  ],

  keyTerms: {
    'Dermatophytosis': 'Fungal skin infection (ringworm, athlete\'s foot)',
    'Tinea': 'Medical term for fungal skin infections',
    'Systemic therapy': 'Oral medications (not just creams)',
    'Body surface area': 'Percentage of skin affected',
  },
};

// =============================================================================
// GLAUCOMA - DC 6061
// =============================================================================
const GLAUCOMA_DESCRIPTION = {
  diagnosticCode: '6013',
  conditionName: 'Glaucoma',

  evidenceLookingFor: [
    'Diagnosis of glaucoma with type specified',
    'Intraocular pressure measurements',
    'Visual field testing results',
    'Optic nerve evaluation',
    'Treatment: drops, laser, surgery',
    'Visual acuity measurements',
    'Progression documentation',
    'Impact on daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Continuous medication required for control',
      realWorld: 'Glaucoma controlled with daily eye drops.',
    },
    {
      percent: 0,
      meaning: 'Rate based on visual impairment',
      realWorld: 'If vision affected, rate based on visual acuity and field loss.',
    },
  ],

  documentationTips: [
    'Keep all intraocular pressure readings',
    'Document visual field test results',
    'Track visual acuity changes',
    'Record all medications used',
    'Note any surgical procedures',
    'Document progression of visual field loss',
    'Track impact on driving, reading, activities',
    'Keep records of optic nerve changes',
  ],

  keyTerms: {
    'Intraocular pressure': 'Pressure inside the eye - elevated in glaucoma',
    'Visual field': 'Peripheral vision - glaucoma causes gradual loss',
    'Optic nerve cupping': 'Damage to optic nerve seen in glaucoma',
    'Open-angle glaucoma': 'Most common type - gradual vision loss',
    'Angle-closure glaucoma': 'Less common - can cause sudden symptoms',
  },
};

// =============================================================================
// VISUAL ACUITY - DC 6066
// =============================================================================
const VISUAL_ACUITY_DESCRIPTION = {
  diagnosticCode: '6066',
  conditionName: 'Visual Impairment (Acuity)',

  evidenceLookingFor: [
    'Best corrected visual acuity measurements',
    'Both eyes tested separately',
    'Cause of vision loss documented',
    'Progression documentation if applicable',
    'Impact on daily activities',
    'Ability to read, drive, work',
    'Treatment history',
    'Low vision aids if used',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: '20/40 or better in both eyes',
      realWorld: 'Vision correctable to near-normal with glasses.',
    },
    {
      percent: 10,
      meaning: '20/50 in one eye, 20/40 or better in other',
      realWorld: 'Mild vision impairment in one eye.',
    },
    {
      percent: 30,
      meaning: '20/100 in one eye, 20/40 in other, OR 20/70 in both eyes',
      realWorld: 'Moderate vision impairment affecting function.',
    },
    {
      percent: 100,
      meaning: '5/200 or worse in both eyes, OR blindness',
      realWorld: 'Legal blindness or near-total vision loss.',
    },
  ],

  documentationTips: [
    'Get visual acuity tested with BEST correction (glasses/contacts)',
    'Document vision in each eye separately',
    'Track changes over time',
    'Note cause of vision loss',
    'Document impact on reading, driving',
    'Record any magnification aids used',
    'Track progression if degenerative condition',
    'Note any surgical treatments',
  ],

  keyTerms: {
    'Visual acuity': 'Sharpness of vision - measured as 20/XX',
    'Best corrected': 'Vision with optimal glasses or contacts - this is what VA rates',
    '20/20': 'Normal vision',
    '20/200': 'Legal blindness threshold',
    'Snellen chart': 'Standard eye chart for testing acuity',
  },
};

// =============================================================================
// VISUAL FIELD - DC 6080
// =============================================================================
const VISUAL_FIELD_DESCRIPTION = {
  diagnosticCode: '6080',
  conditionName: 'Visual Field Loss',

  evidenceLookingFor: [
    'Visual field testing results (Goldmann or automated)',
    'Cause of field loss documented',
    'Both eyes tested',
    'Degree of contraction documented',
    'Impact on daily activities',
    'Progression if applicable',
    'Treatment history',
    'Ability to navigate, drive',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Unilateral scotoma, OR concentric contraction to 46-60 degrees',
      realWorld: 'Blind spot in one eye or mild peripheral vision loss.',
    },
    {
      percent: 30,
      meaning: 'Concentric contraction to 16-30 degrees bilaterally',
      realWorld: 'Significant tunnel vision affecting navigation.',
    },
    {
      percent: 50,
      meaning: 'Concentric contraction to 6-15 degrees bilaterally',
      realWorld: 'Severe tunnel vision. Major impact on mobility.',
    },
    {
      percent: 100,
      meaning: 'Concentric contraction to 5 degrees or less bilaterally',
      realWorld: 'Nearly total peripheral vision loss. Functionally blind for navigation.',
    },
  ],

  documentationTips: [
    'Keep all visual field test results',
    'Document remaining field in degrees',
    'Note cause of field loss',
    'Track progression over time',
    'Document impact on driving, navigation',
    'Note any blind spots (scotomas)',
    'Record accidents or near-misses from vision loss',
    'Document compensatory strategies used',
  ],

  keyTerms: {
    'Visual field': 'Peripheral or side vision',
    'Concentric contraction': 'Tunnel vision - field narrowed equally all around',
    'Scotoma': 'Blind spot within visual field',
    'Degrees': 'Measurement of remaining field - normal is about 180 degrees',
    'Hemianopia': 'Loss of half of visual field',
  },
};

// =============================================================================
// VARICOSE VEINS - DC 7120
// =============================================================================
const VARICOSE_VEINS_DESCRIPTION = {
  diagnosticCode: '7120',
  conditionName: 'Varicose Veins',

  evidenceLookingFor: [
    'Diagnosis of varicose veins',
    'Documentation of symptoms: pain, swelling, edema',
    'Evidence of skin changes or ulceration',
    'Treatment history: compression, procedures',
    'Venous duplex ultrasound results',
    'Elevation requirements',
    'Impact on standing and walking',
    'Photographs if available',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Asymptomatic palpable or visible varicose veins',
      realWorld: 'Visible varicose veins but no symptoms.',
    },
    {
      percent: 10,
      meaning: 'Intermittent edema of extremity or aching/fatigue after standing, compression hosiery helps',
      realWorld: 'Occasional swelling or discomfort relieved by compression.',
    },
    {
      percent: 20,
      meaning: 'Persistent edema incompletely relieved by elevation, OR stasis pigmentation or eczema',
      realWorld: 'Constant swelling not fully helped by elevation. Skin changes present.',
    },
    {
      percent: 40,
      meaning: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration',
      realWorld: 'Significant edema, skin changes, and occasional skin breakdown.',
    },
    {
      percent: 60,
      meaning: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration',
      realWorld: 'Severe venous disease with chronic non-healing ulcers.',
    },
    {
      percent: 100,
      meaning: 'Massive board-like edema with constant pain at rest',
      realWorld: 'Severe, disabling venous disease with extreme swelling and pain.',
    },
  ],

  documentationTips: [
    'Document swelling: when it occurs, severity',
    'Track aching and fatigue with standing',
    'Note skin changes: discoloration, thickening',
    'Document any ulcers: size, healing time',
    'Record compression stocking use',
    'Track elevation requirements',
    'Note impact on work requiring standing',
    'Take photographs of legs',
  ],

  keyTerms: {
    'Edema': 'Swelling from fluid accumulation',
    'Stasis pigmentation': 'Brown discoloration from blood pooling',
    'Venous eczema': 'Skin irritation from poor circulation',
    'Venous ulcer': 'Open wound from venous insufficiency',
    'Compression hosiery': 'Support stockings to reduce swelling',
  },
};

// =============================================================================
// POST-PHLEBITIC SYNDROME - DC 7121
// =============================================================================
const POST_PHLEBITIC_DESCRIPTION = {
  diagnosticCode: '7121',
  conditionName: 'Post-Phlebitic Syndrome (Post-Thrombotic)',

  evidenceLookingFor: [
    'History of deep vein thrombosis (DVT)',
    'Documentation of residual symptoms',
    'Evidence of chronic venous insufficiency',
    'Swelling documentation',
    'Skin changes or ulceration',
    'Compression therapy requirements',
    'Anticoagulation if ongoing',
    'Impact on daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Intermittent edema or aching after standing, relieved by elevation or compression',
      realWorld: 'Occasional symptoms managed with elevation and compression.',
    },
    {
      percent: 20,
      meaning: 'Persistent edema incompletely relieved by elevation, OR stasis pigmentation',
      realWorld: 'Constant swelling and/or skin discoloration.',
    },
    {
      percent: 40,
      meaning: 'Persistent edema and stasis pigmentation with or without intermittent ulceration',
      realWorld: 'Significant swelling, skin changes, and occasional ulcers.',
    },
    {
      percent: 60,
      meaning: 'Persistent edema or subcutaneous induration, stasis pigmentation, and persistent ulceration',
      realWorld: 'Severe post-phlebitic syndrome with chronic ulcers.',
    },
    {
      percent: 100,
      meaning: 'Massive board-like edema with constant pain at rest',
      realWorld: 'Extreme, disabling post-phlebitic syndrome.',
    },
  ],

  documentationTips: [
    'Keep records of original DVT',
    'Document ongoing leg symptoms',
    'Track swelling patterns',
    'Note skin changes: color, texture',
    'Document any ulcers',
    'Record compression use',
    'Track anticoagulation if on blood thinners',
    'Note impact on standing tolerance',
  ],

  keyTerms: {
    'Post-phlebitic syndrome': 'Chronic symptoms after DVT damages vein valves',
    'DVT': 'Deep Vein Thrombosis - blood clot in deep veins',
    'Chronic venous insufficiency': 'Poor blood return from legs',
    'Stasis': 'Blood pooling in legs',
  },
};

// =============================================================================
// PERIPHERAL ARTERY DISEASE - DC 7114
// =============================================================================
const ARTERIOSCLEROSIS_DESCRIPTION = {
  diagnosticCode: '7114',
  conditionName: 'Peripheral Artery Disease (PAD)',

  evidenceLookingFor: [
    'Diagnosis of peripheral arterial disease',
    'Ankle-brachial index (ABI) measurements',
    'Claudication distance documentation',
    'Evidence of trophic changes',
    'Angiography or imaging results',
    'Treatment history: medication, procedures',
    'Impact on walking and daily activities',
    'Surgical history: bypass, stent, amputation',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Claudication on walking more than 100 yards, OR ABI of 0.9 or less',
      realWorld: 'Leg pain limits walking distance. Reduced blood flow on testing.',
    },
    {
      percent: 40,
      meaning: 'Claudication on walking 25-100 yards, OR ABI of 0.7 or less',
      realWorld: 'Significant claudication. Can only walk short distances.',
    },
    {
      percent: 60,
      meaning: 'Claudication on walking less than 25 yards, OR ABI of 0.5 or less, OR ischemic limb pain at rest',
      realWorld: 'Severe PAD. Very limited walking or pain even at rest.',
    },
    {
      percent: 100,
      meaning: 'Ischemic limb pain at rest, OR ulceration or gangrene',
      realWorld: 'Critical limb ischemia. Tissue loss or constant pain. High amputation risk.',
    },
  ],

  documentationTips: [
    'Document walking distance before leg pain',
    'Track ABI measurements',
    'Note rest pain if present',
    'Document any ulcers or tissue changes',
    'Keep angiogram or imaging results',
    'Record any procedures: angioplasty, stent, bypass',
    'Track impact on daily activities',
    'Note trophic changes: hair loss, shiny skin, cool temperature',
  ],

  keyTerms: {
    'Claudication': 'Leg pain with walking that improves with rest',
    'ABI': 'Ankle-Brachial Index - blood pressure ratio indicating PAD severity',
    'Critical limb ischemia': 'Severe PAD with rest pain or tissue loss',
    'Trophic changes': 'Skin/nail changes from poor blood supply',
    'Gangrene': 'Tissue death from lack of blood flow',
  },
};

// =============================================================================
// DISCOID LUPUS ERYTHEMATOSUS - DC 7809
// =============================================================================
const DISCOID_LUPUS_DESCRIPTION = {
  diagnosticCode: '7809',
  conditionName: 'Discoid Lupus Erythematosus',

  evidenceLookingFor: [
    'Diagnosis of discoid lupus (skin lupus)',
    'Biopsy confirmation if available',
    'Documentation of affected body areas',
    'Percentage of body surface area involved',
    'Evidence of scarring or disfigurement',
    'Treatment requirements: topical vs systemic',
    'Photographs showing extent',
    'Impact on daily life',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body, topical therapy only',
      realWorld: 'Minor discoid lupus controlled with creams.',
    },
    {
      percent: 10,
      meaning: '5-20% of body, OR intermittent systemic therapy',
      realWorld: 'Moderate involvement or occasional need for pills.',
    },
    {
      percent: 30,
      meaning: '20-40% of body, OR systemic therapy 6+ weeks/year',
      realWorld: 'Significant involvement needing regular systemic treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body, OR constant systemic therapy',
      realWorld: 'Extensive disease requiring constant systemic treatment.',
    },
  ],

  documentationTips: [
    'Estimate body surface area affected',
    'Take photographs during flares',
    'Document facial involvement specifically',
    'Track scarring and hair loss in affected areas',
    'Record all treatments: topical and systemic',
    'Note sun sensitivity and triggers',
    'Document impact on appearance',
    'Track if progressed to systemic lupus',
  ],

  keyTerms: {
    'Discoid lupus': 'Lupus affecting only skin, not internal organs',
    'Body surface area': 'Percentage of skin affected - palm = 1%',
    'Systemic therapy': 'Pills or injections, not just creams',
    'Scarring alopecia': 'Permanent hair loss from scalp lesions',
  },
};

// =============================================================================
// BULLOUS DISORDERS - DC 7815
// =============================================================================
const BULLOUS_DESCRIPTION = {
  diagnosticCode: '7815',
  conditionName: 'Bullous Disorders (Pemphigus, Pemphigoid)',

  evidenceLookingFor: [
    'Diagnosis of bullous disorder with type specified',
    'Biopsy and immunofluorescence results',
    'Documentation of blister extent',
    'Percentage of body affected',
    'Oral/mucosal involvement if present',
    'Treatment requirements',
    'Hospitalization records if severe',
    'Impact on eating, daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body, topical therapy only',
      realWorld: 'Minimal blistering controlled with topical treatment.',
    },
    {
      percent: 10,
      meaning: '5-20% of body, OR intermittent systemic therapy',
      realWorld: 'Moderate blistering or occasional systemic treatment needed.',
    },
    {
      percent: 30,
      meaning: '20-40% of body, OR systemic therapy 6+ weeks/year',
      realWorld: 'Significant blistering requiring regular systemic treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body, OR constant systemic therapy',
      realWorld: 'Extensive blistering needing constant immunosuppression.',
    },
  ],

  documentationTips: [
    'Document blister locations and extent',
    'Take photographs during flares',
    'Note oral/mucosal involvement',
    'Track healing time for blisters',
    'Record all medications: steroids, immunosuppressants',
    'Document infections from open blisters',
    'Note impact on eating if mouth involved',
    'Track hospitalizations',
  ],

  keyTerms: {
    'Pemphigus': 'Autoimmune blistering - blisters within skin layers',
    'Pemphigoid': 'Autoimmune blistering - blisters below skin surface',
    'Bullae': 'Large blisters',
    'Nikolsky sign': 'Skin peels with light rubbing - indicates pemphigus',
  },
};

// =============================================================================
// CUTANEOUS VASCULITIS - DC 7826
// =============================================================================
const CUTANEOUS_VASCULITIS_DESCRIPTION = {
  diagnosticCode: '7826',
  conditionName: 'Primary Cutaneous Vasculitis',

  evidenceLookingFor: [
    'Diagnosis of cutaneous vasculitis',
    'Biopsy showing vessel inflammation',
    'Documentation of skin findings: purpura, ulcers',
    'Percentage of body affected',
    'Evidence of systemic involvement or isolated to skin',
    'Treatment requirements',
    'Recurrence frequency',
    'Underlying cause if identified',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body, topical therapy only',
      realWorld: 'Minor skin vasculitis controlled topically.',
    },
    {
      percent: 10,
      meaning: '5-20% of body, OR intermittent systemic therapy',
      realWorld: 'Moderate involvement or occasional systemic treatment.',
    },
    {
      percent: 30,
      meaning: '20-40% of body, OR systemic therapy 6+ weeks/year',
      realWorld: 'Significant vasculitis requiring regular systemic treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body, OR constant systemic therapy',
      realWorld: 'Extensive vasculitis needing constant immunosuppression.',
    },
  ],

  documentationTips: [
    'Document skin lesions: location, type, extent',
    'Take photographs showing purpura or ulcers',
    'Track flare frequency',
    'Note any triggers identified',
    'Record all treatments',
    'Document healing of ulcers',
    'Note if associated with systemic disease',
    'Keep biopsy results',
  ],

  keyTerms: {
    'Vasculitis': 'Inflammation of blood vessels',
    'Purpura': 'Purple spots from bleeding under skin',
    'Palpable purpura': 'Raised purple spots - classic sign',
    'Leukocytoclastic vasculitis': 'Common type seen on biopsy',
  },
};

// =============================================================================
// DERMATOPHYTOSIS - DC 7813
// =============================================================================
const DERMATOPHYTOSIS_DESCRIPTION = {
  diagnosticCode: '7813',
  conditionName: 'Dermatophytosis (Fungal Skin Infection)',

  evidenceLookingFor: [
    'Diagnosis of dermatophytosis/tinea',
    'Type and location (tinea pedis, corporis, etc.)',
    'Culture or KOH prep confirmation if available',
    'Percentage of body affected',
    'Treatment requirements: topical vs oral',
    'Recurrence frequency',
    'Impact on daily activities',
    'Nail involvement if present',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Less than 5% of body, topical therapy only',
      realWorld: 'Minor fungal infection controlled with antifungal creams.',
    },
    {
      percent: 10,
      meaning: '5-20% of body, OR intermittent systemic therapy',
      realWorld: 'Moderate infection or occasionally needing oral antifungals.',
    },
    {
      percent: 30,
      meaning: '20-40% of body, OR systemic therapy 6+ weeks/year',
      realWorld: 'Significant infection requiring regular oral treatment.',
    },
    {
      percent: 60,
      meaning: 'More than 40% of body, OR constant systemic therapy',
      realWorld: 'Extensive fungal infection needing constant oral medication.',
    },
  ],

  documentationTips: [
    'Document affected areas',
    'Note type: athlete\'s foot, jock itch, ringworm, etc.',
    'Track recurrence frequency',
    'Record all treatments used',
    'Document nail involvement (onychomycosis)',
    'Note impact on activities',
    'Take photographs',
    'Track duration of oral antifungal courses',
  ],

  keyTerms: {
    'Tinea': 'Medical term for dermatophyte fungal infections',
    'Tinea pedis': 'Athlete\'s foot',
    'Tinea corporis': 'Ringworm on body',
    'Onychomycosis': 'Fungal nail infection',
    'KOH prep': 'Test to confirm fungal infection',
  },
};

// =============================================================================
// UVEITIS - DC 6000
// =============================================================================
const UVEITIS_DESCRIPTION = {
  diagnosticCode: '6000',
  conditionName: 'Uveitis',

  evidenceLookingFor: [
    'Diagnosis of uveitis with type specified',
    'Ophthalmology examination records',
    'Flare frequency and severity',
    'Visual acuity measurements',
    'Treatment requirements: drops, injections, systemic',
    'Evidence of complications: glaucoma, cataracts',
    'Underlying cause if identified',
    'Impact on vision and daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'With active pathology, continuous medication required',
      realWorld: 'Active uveitis needing ongoing treatment to control inflammation.',
    },
    {
      percent: 0,
      meaning: 'Rate based on visual impairment if inactive',
      realWorld: 'If uveitis is quiet, rate any residual vision loss separately.',
    },
  ],

  documentationTips: [
    'Track flare frequency and duration',
    'Document visual acuity during and between flares',
    'Record all medications: drops, injections, pills',
    'Note any complications that developed',
    'Keep ophthalmology exam records',
    'Document impact on driving, reading, work',
    'Track underlying cause if identified',
    'Note if anterior, intermediate, posterior, or panuveitis',
  ],

  keyTerms: {
    'Uveitis': 'Inflammation inside the eye',
    'Anterior uveitis': 'Front of eye - most common, best prognosis',
    'Posterior uveitis': 'Back of eye - more serious',
    'Panuveitis': 'Entire uveal tract involved',
    'Flare': 'Period of active inflammation',
  },
};

// =============================================================================
// KERATITIS - DC 6001
// =============================================================================
const KERATITIS_DESCRIPTION = {
  diagnosticCode: '6001',
  conditionName: 'Keratitis',

  evidenceLookingFor: [
    'Diagnosis of keratitis with type specified',
    'Ophthalmology examination records',
    'Evidence of corneal scarring or damage',
    'Visual acuity measurements',
    'Treatment requirements',
    'Recurrence frequency if chronic',
    'Underlying cause (HSV, bacterial, etc.)',
    'Impact on vision',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'With active pathology, continuous medication required',
      realWorld: 'Active keratitis needing ongoing treatment.',
    },
    {
      percent: 0,
      meaning: 'Rate based on visual impairment if inactive',
      realWorld: 'If healed, rate any residual vision loss from scarring.',
    },
  ],

  documentationTips: [
    'Document type of keratitis',
    'Track episodes if recurrent (especially HSV)',
    'Record visual acuity',
    'Note corneal scarring',
    'Document all treatments',
    'Track prophylactic medication if used',
    'Keep ophthalmology records',
    'Note impact on vision',
  ],

  keyTerms: {
    'Keratitis': 'Inflammation of cornea',
    'Corneal ulcer': 'Open sore on cornea - serious',
    'HSV keratitis': 'Herpes simplex virus causing recurrent keratitis',
    'Corneal scarring': 'Permanent clouding affecting vision',
  },
};

// =============================================================================
// SCLERITIS - DC 6002
// =============================================================================
const SCLERITIS_DESCRIPTION = {
  diagnosticCode: '6002',
  conditionName: 'Scleritis',

  evidenceLookingFor: [
    'Diagnosis of scleritis',
    'Ophthalmology examination records',
    'Evidence of pain and redness',
    'Type: anterior vs posterior, diffuse vs nodular',
    'Treatment requirements',
    'Associated systemic disease if present',
    'Visual acuity measurements',
    'Complications if any',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'With active pathology, continuous medication required',
      realWorld: 'Active scleritis needing ongoing treatment.',
    },
    {
      percent: 0,
      meaning: 'Rate based on visual impairment if inactive',
      realWorld: 'If resolved, rate any residual vision problems.',
    },
  ],

  documentationTips: [
    'Document episodes of scleritis',
    'Track pain severity',
    'Record treatments: NSAIDs, steroids, immunosuppressants',
    'Note associated systemic diseases (RA, vasculitis)',
    'Keep ophthalmology records',
    'Document visual acuity',
    'Track recurrences',
    'Note scleral thinning if present',
  ],

  keyTerms: {
    'Scleritis': 'Inflammation of white part of eye (sclera)',
    'Episcleritis': 'Milder surface inflammation - different from scleritis',
    'Necrotizing scleritis': 'Severe form with tissue destruction',
    'Scleral thinning': 'Complication from chronic inflammation',
  },
};

// =============================================================================
// CHRONIC CONJUNCTIVITIS - DC 6018
// =============================================================================
const CONJUNCTIVITIS_DESCRIPTION = {
  diagnosticCode: '6018',
  conditionName: 'Chronic Conjunctivitis',

  evidenceLookingFor: [
    'Diagnosis of chronic conjunctivitis',
    'Documentation of persistent symptoms',
    'Treatment requirements',
    'Type: allergic, bacterial, viral, dry eye related',
    'Frequency of flares',
    'Impact on daily activities',
    'Ophthalmology records',
    'Associated conditions',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'With active pathology, continuous medication required',
      realWorld: 'Ongoing conjunctivitis needing constant treatment.',
    },
    {
      percent: 0,
      meaning: 'Rate based on visual impairment if any',
      realWorld: 'If controlled or resolved, rate residual vision issues.',
    },
  ],

  documentationTips: [
    'Document chronicity - symptoms lasting 4+ weeks',
    'Track flare frequency',
    'Record all treatments used',
    'Note triggers if allergic',
    'Document impact on vision',
    'Keep records of eye exams',
    'Note any scarring if severe',
    'Track days affected',
  ],

  keyTerms: {
    'Chronic conjunctivitis': 'Pink eye lasting more than 4 weeks',
    'Allergic conjunctivitis': 'From allergies - itching prominent',
    'Giant papillary conjunctivitis': 'Often from contact lenses',
    'Dry eye': 'Can cause chronic conjunctival irritation',
  },
};

// =============================================================================
// VALVULAR HEART DISEASE - DC 7000-7004
// =============================================================================
const VALVULAR_HEART_DESCRIPTION = {
  diagnosticCode: '7000',
  conditionName: 'Valvular Heart Disease',

  evidenceLookingFor: [
    'Diagnosis of specific valve disorder',
    'Echocardiogram showing valve function',
    'Ejection fraction if available',
    'METs level from exercise testing',
    'Symptoms: dyspnea, fatigue, chest pain',
    'Treatment: medications, valve repair/replacement',
    'Evidence of heart failure if present',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Workload greater than 7 METs but not greater than 10 METs with symptoms, OR continuous medication required',
      realWorld: 'Mild valve disease controlled with medication. Some limitation with heavy exertion.',
    },
    {
      percent: 30,
      meaning: 'Workload greater than 5 METs but not greater than 7 METs with symptoms, OR cardiac hypertrophy/dilatation on testing',
      realWorld: 'Moderate valve disease. Limited with moderate activity. Heart showing strain.',
    },
    {
      percent: 60,
      meaning: 'More than one episode of CHF in past year, OR workload greater than 3 but not greater than 5 METs with symptoms, OR ejection fraction 30-50%',
      realWorld: 'Significant valve disease with heart failure episodes or reduced function.',
    },
    {
      percent: 100,
      meaning: 'Chronic CHF, OR workload 3 METs or less with symptoms, OR ejection fraction less than 30%',
      realWorld: 'Severe valve disease. Unable to perform basic activities. Severely reduced heart function.',
    },
  ],

  documentationTips: [
    'Keep all echocardiogram reports',
    'Track ejection fraction over time',
    'Document symptoms: shortness of breath, fatigue, swelling',
    'Record METs level from stress testing',
    'Note any valve repair or replacement surgery',
    'Track hospitalizations for heart failure',
    'Document all cardiac medications',
    'Log activities that cause symptoms',
  ],

  keyTerms: {
    'Stenosis': 'Valve too narrow - restricts blood flow',
    'Regurgitation': 'Valve leaks - blood flows backward',
    'Ejection fraction': 'Percentage of blood pumped per beat',
    'METs': 'Metabolic equivalents - measure of exercise capacity',
    'Valve replacement': 'Mechanical or bioprosthetic valve surgery',
  },
};

// =============================================================================
// HYPERTENSIVE HEART DISEASE - DC 7007
// =============================================================================
const HYPERTENSIVE_HEART_DESCRIPTION = {
  diagnosticCode: '7007',
  conditionName: 'Hypertensive Heart Disease',

  evidenceLookingFor: [
    'Diagnosis of hypertensive heart disease',
    'Evidence of heart changes from hypertension',
    'Echocardiogram showing LVH or dysfunction',
    'METs level from exercise testing',
    'Blood pressure history',
    'Heart failure symptoms if present',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Workload greater than 7 METs but not greater than 10 METs with symptoms, OR continuous medication required',
      realWorld: 'Heart affected by hypertension but controlled with medication.',
    },
    {
      percent: 30,
      meaning: 'Workload greater than 5 METs but not greater than 7 METs with symptoms, OR cardiac hypertrophy/dilatation',
      realWorld: 'Heart thickened or enlarged from hypertension. Moderate limitation.',
    },
    {
      percent: 60,
      meaning: 'More than one episode of CHF in past year, OR workload greater than 3 but not greater than 5 METs with symptoms, OR ejection fraction 30-50%',
      realWorld: 'Significant heart damage from hypertension with heart failure episodes.',
    },
    {
      percent: 100,
      meaning: 'Chronic CHF, OR workload 3 METs or less with symptoms, OR ejection fraction less than 30%',
      realWorld: 'Severe hypertensive heart disease. Major disability.',
    },
  ],

  documentationTips: [
    'Keep echocardiograms showing heart changes',
    'Document blood pressure history',
    'Track ejection fraction',
    'Record heart failure symptoms',
    'Note exercise limitations',
    'Document all cardiac medications',
    'Track hospitalizations',
    'Log METs from stress testing',
  ],

  keyTerms: {
    'LVH': 'Left Ventricular Hypertrophy - thickened heart muscle from hypertension',
    'Diastolic dysfunction': 'Heart doesn\'t relax properly - early sign',
    'Hypertensive cardiomyopathy': 'Heart muscle disease from chronic hypertension',
    'Target organ damage': 'Heart is major target of uncontrolled hypertension',
  },
};

// =============================================================================
// PERICARDITIS - DC 7002/7003
// =============================================================================
const PERICARDITIS_DESCRIPTION = {
  diagnosticCode: '7002',
  conditionName: 'Pericarditis / Pericardial Adhesions',

  evidenceLookingFor: [
    'Diagnosis of pericarditis or pericardial disease',
    'Echocardiogram showing pericardial involvement',
    'Evidence of constrictive pericarditis if present',
    'Documentation of symptoms',
    'Treatment history',
    'Recurrence frequency',
    'Exercise capacity',
    'Impact on daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'History of pericarditis with continuous medication required',
      realWorld: 'Pericarditis requiring ongoing medication for control.',
    },
    {
      percent: 30,
      meaning: 'Evidence of pericardial thickening or constriction affecting heart function',
      realWorld: 'Pericardial changes affecting how well heart pumps.',
    },
    {
      percent: 60,
      meaning: 'Chronic constrictive pericarditis with moderate heart failure symptoms',
      realWorld: 'Significant constriction limiting heart function.',
    },
    {
      percent: 100,
      meaning: 'Severe constrictive pericarditis with chronic heart failure',
      realWorld: 'Severe pericardial disease causing major heart failure.',
    },
  ],

  documentationTips: [
    'Track pericarditis episodes',
    'Document chest pain and other symptoms',
    'Keep echocardiograms and CT/MRI',
    'Record all treatments: NSAIDs, colchicine, steroids',
    'Note any pericardiocentesis or surgery',
    'Track exercise tolerance',
    'Document recurrences',
    'Note if progressed to constrictive disease',
  ],

  keyTerms: {
    'Pericarditis': 'Inflammation of sac around heart',
    'Pericardial effusion': 'Fluid around heart',
    'Constrictive pericarditis': 'Scarred pericardium restricts heart filling',
    'Pericardiocentesis': 'Draining fluid from around heart',
    'Recurrent pericarditis': 'Repeated episodes - common problem',
  },
};

// =============================================================================
// GASTRITIS / DUODENITIS - DC 7307/7308
// =============================================================================
const GASTRITIS_DESCRIPTION = {
  diagnosticCode: '7307',
  conditionName: 'Gastritis / Duodenitis',

  evidenceLookingFor: [
    'Diagnosis of gastritis or duodenitis',
    'Endoscopy results if performed',
    'H. pylori testing',
    'Documentation of symptoms',
    'Treatment requirements',
    'Diet modifications',
    'Impact on nutrition and weight',
    'Recurrence frequency',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Mild - recurring symptoms once or twice yearly',
      realWorld: 'Occasional gastritis flares, a couple times per year.',
    },
    {
      percent: 30,
      meaning: 'Moderate - recurring episodes of severe symptoms 2-3 times yearly averaging 10+ days, OR continuous moderate symptoms',
      realWorld: 'Regular significant flares or constant moderate symptoms.',
    },
    {
      percent: 60,
      meaning: 'Severe - pain only partially relieved by standard therapy, periodic vomiting, recurrent hematemesis or melena, weight loss, anemia',
      realWorld: 'Severe symptoms not well controlled. Bleeding, weight loss, or anemia.',
    },
  ],

  documentationTips: [
    'Track symptom episodes: frequency, duration, severity',
    'Document pain patterns and triggers',
    'Note all medications used',
    'Record dietary modifications',
    'Track weight changes',
    'Document any bleeding episodes',
    'Keep endoscopy reports',
    'Note H. pylori treatment if applicable',
  ],

  keyTerms: {
    'Gastritis': 'Inflammation of stomach lining',
    'Duodenitis': 'Inflammation of first part of small intestine',
    'H. pylori': 'Bacteria causing many cases - can be treated',
    'Hematemesis': 'Vomiting blood',
    'Melena': 'Black tarry stools from GI bleeding',
  },
};

// =============================================================================
// PANCREATITIS - DC 7347
// =============================================================================
const PANCREATITIS_DESCRIPTION = {
  diagnosticCode: '7347',
  conditionName: 'Pancreatitis',

  evidenceLookingFor: [
    'Diagnosis of acute or chronic pancreatitis',
    'Imaging: CT, MRI, or ultrasound',
    'Lipase/amylase levels',
    'Documentation of attacks',
    'Evidence of pancreatic insufficiency',
    'Diabetes development if applicable',
    'Treatment history',
    'Hospitalizations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'At least one attack of pancreatitis in past year',
      realWorld: 'Occasional pancreatitis attacks, at least yearly.',
    },
    {
      percent: 30,
      meaning: 'Two or more attacks of pancreatitis in past year requiring hospitalization',
      realWorld: 'Multiple attacks requiring hospital stays.',
    },
    {
      percent: 60,
      meaning: 'Frequent attacks with malnutrition, severe pain unrelieved by medication',
      realWorld: 'Frequent severe attacks causing malnutrition and uncontrolled pain.',
    },
    {
      percent: 100,
      meaning: 'Frequently recurring disabling attacks with poor health, complete inability to function',
      realWorld: 'Constant disabling disease preventing normal function.',
    },
  ],

  documentationTips: [
    'Track every pancreatitis attack: date, duration, severity',
    'Document hospitalizations',
    'Record lipase/amylase during attacks',
    'Note triggers if identified (alcohol, gallstones)',
    'Track weight and nutritional status',
    'Document enzyme supplement use',
    'Note diabetes development if occurred',
    'Track pain medication requirements',
  ],

  keyTerms: {
    'Acute pancreatitis': 'Sudden attack - can be severe',
    'Chronic pancreatitis': 'Ongoing damage and inflammation',
    'Pancreatic insufficiency': 'Pancreas can\'t make enough enzymes',
    'Pseudocyst': 'Fluid collection that can develop',
    'Lipase/amylase': 'Enzymes elevated during attacks',
  },
};

// =============================================================================
// BILIARY TRACT CONDITIONS - DC 7314/7315/7318
// =============================================================================
const BILIARY_DESCRIPTION = {
  diagnosticCode: '7314',
  conditionName: 'Biliary Tract Conditions (Cholecystitis, Cholelithiasis)',

  evidenceLookingFor: [
    'Diagnosis of gallbladder or biliary disease',
    'Imaging showing gallstones or biliary abnormalities',
    'Documentation of attacks',
    'Surgical history if cholecystectomy performed',
    'Post-cholecystectomy symptoms if applicable',
    'Treatment requirements',
    'Dietary restrictions',
    'Impact on daily life',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Asymptomatic after cholecystectomy',
      realWorld: 'Gallbladder removed with no ongoing symptoms.',
    },
    {
      percent: 10,
      meaning: 'Mild symptoms with diet management',
      realWorld: 'Occasional symptoms controlled with diet.',
    },
    {
      percent: 30,
      meaning: 'Recurrent attacks of biliary colic',
      realWorld: 'Regular gallbladder attacks with significant pain.',
    },
  ],

  documentationTips: [
    'Document biliary attacks: frequency, severity',
    'Keep imaging showing gallstones or changes',
    'Record surgical history',
    'Track post-surgical symptoms if present',
    'Note dietary triggers',
    'Document pain patterns',
    'Record ER visits or hospitalizations',
    'Track medications used',
  ],

  keyTerms: {
    'Cholecystitis': 'Gallbladder inflammation',
    'Cholelithiasis': 'Gallstones',
    'Biliary colic': 'Pain from gallstone blocking bile duct',
    'Cholecystectomy': 'Gallbladder removal surgery',
    'Post-cholecystectomy syndrome': 'Continued symptoms after removal',
  },
};

// =============================================================================
// HEMORRHOIDS - DC 7336
// =============================================================================
const HEMORRHOIDS_DESCRIPTION = {
  diagnosticCode: '7336',
  conditionName: 'Hemorrhoids',

  evidenceLookingFor: [
    'Diagnosis of hemorrhoids (internal, external, or both)',
    'Documentation of symptoms: bleeding, pain, prolapse',
    'Treatment history: conservative, procedures, surgery',
    'Evidence of anemia from chronic bleeding',
    'Frequency of flares',
    'Impact on daily activities',
    'Surgical interventions if performed',
    'Current severity',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Mild or moderate, external or internal',
      realWorld: 'Hemorrhoids present but not causing major problems.',
    },
    {
      percent: 10,
      meaning: 'Large or thrombotic, irreducible, with excessive redundant tissue evidencing frequent recurrences',
      realWorld: 'Significant hemorrhoids that frequently flare and don\'t reduce.',
    },
    {
      percent: 20,
      meaning: 'With persistent bleeding and secondary anemia, OR with fissures',
      realWorld: 'Chronic bleeding causing anemia, or associated anal fissures.',
    },
  ],

  documentationTips: [
    'Document type: internal, external, mixed',
    'Track bleeding frequency and amount',
    'Note prolapse and reducibility',
    'Record treatments: creams, banding, surgery',
    'Track hemoglobin if frequent bleeding',
    'Document pain and impact on sitting',
    'Note any fissures',
    'Log flare frequency',
  ],

  keyTerms: {
    'Internal hemorrhoids': 'Inside rectum - often bleed but less painful',
    'External hemorrhoids': 'Under skin around anus - can be very painful',
    'Thrombosed hemorrhoid': 'Blood clot in hemorrhoid - severe pain',
    'Prolapsed': 'Internal hemorrhoid pushed outside',
    'Reducible': 'Can be pushed back inside',
  },
};

// =============================================================================
// HERNIA - DC 7338/7339/7340
// =============================================================================
const HERNIA_DESCRIPTION = {
  diagnosticCode: '7338',
  conditionName: 'Hernia (Inguinal, Ventral, Femoral)',

  evidenceLookingFor: [
    'Diagnosis of hernia with type and location',
    'Physical exam findings',
    'Imaging if performed',
    'Surgical repair history',
    'Recurrence if applicable',
    'Use of truss or belt support',
    'Symptoms: pain, bulging',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Small reducible hernia, OR healed without true hernia protrusion',
      realWorld: 'Small hernia that stays reduced, or well-healed repair.',
    },
    {
      percent: 10,
      meaning: 'Post-operative recurrent, readily reducible, well supported by truss or belt',
      realWorld: 'Hernia came back after surgery but manageable with support.',
    },
    {
      percent: 30,
      meaning: 'Small, not well supported by truss, OR not readily reducible',
      realWorld: 'Hernia that doesn\'t stay reduced or isn\'t controlled by support.',
    },
    {
      percent: 60,
      meaning: 'Large, not well supported, not readily reducible, OR inoperable',
      realWorld: 'Large hernia that cannot be controlled or operated on.',
    },
  ],

  documentationTips: [
    'Document hernia location and size',
    'Note if reducible or not',
    'Track surgical repairs and recurrences',
    'Document truss/belt use and effectiveness',
    'Record symptoms: pain, bulging, limitations',
    'Note activities that worsen symptoms',
    'Document any incarceration episodes',
    'Track impact on work and lifting',
  ],

  keyTerms: {
    'Reducible': 'Can be pushed back into place',
    'Incarcerated': 'Trapped and cannot be reduced - urgent',
    'Strangulated': 'Blood supply cut off - emergency',
    'Recurrent': 'Came back after surgical repair',
    'Truss': 'Supportive device to hold hernia in place',
  },
};

// =============================================================================
// FEMALE REPRODUCTIVE CONDITIONS - DC 7610-7614
// =============================================================================
const FEMALE_REPRODUCTIVE_DESCRIPTION = {
  diagnosticCode: '7612',
  conditionName: 'Female Reproductive Conditions',

  evidenceLookingFor: [
    'Diagnosis of specific condition',
    'Surgical history: hysterectomy, oophorectomy',
    'Documentation of symptoms',
    'Treatment requirements',
    'Impact on fertility if applicable',
    'Hormone therapy if used',
    'Pelvic exam findings',
    'Imaging results',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Symptoms not requiring continuous treatment',
      realWorld: 'Condition present but not requiring ongoing treatment.',
    },
    {
      percent: 10,
      meaning: 'Symptoms requiring continuous treatment',
      realWorld: 'Ongoing treatment needed to control symptoms.',
    },
    {
      percent: 30,
      meaning: 'Symptoms not controlled by continuous treatment',
      realWorld: 'Symptoms persist despite ongoing treatment.',
    },
  ],

  documentationTips: [
    'Document specific diagnosis',
    'Track symptoms: pain, bleeding, discharge',
    'Record all treatments',
    'Note surgical procedures',
    'Document hormone therapy if used',
    'Track impact on daily activities',
    'Record menstrual irregularities',
    'Note fertility concerns if applicable',
  ],

  keyTerms: {
    'Vulvovaginitis': 'Inflammation of vulva/vagina',
    'Cervicitis': 'Inflammation of cervix',
    'Salpingitis': 'Inflammation of fallopian tubes',
    'Oophoritis': 'Inflammation of ovaries',
    'PID': 'Pelvic Inflammatory Disease',
  },
};

// =============================================================================
// ENDOMETRIOSIS - DC 7615
// =============================================================================
const ENDOMETRIOSIS_DESCRIPTION = {
  diagnosticCode: '7615',
  conditionName: 'Endometriosis',

  evidenceLookingFor: [
    'Diagnosis of endometriosis (surgical confirmation ideal)',
    'Documentation of pelvic pain',
    'Menstrual symptoms',
    'Evidence of bowel/bladder involvement if present',
    'Treatment history: hormonal, surgical',
    'Impact on fertility',
    'Imaging showing endometriomas',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Pelvic pain or heavy/irregular bleeding requiring continuous treatment',
      realWorld: 'Endometriosis controlled with ongoing hormone therapy or other treatment.',
    },
    {
      percent: 30,
      meaning: 'Pelvic pain or heavy/irregular bleeding not controlled by treatment',
      realWorld: 'Symptoms persist despite treatment. Significant impact on quality of life.',
    },
    {
      percent: 50,
      meaning: 'Lesions involving bowel or bladder confirmed by laparoscopy, pelvic pain or heavy/irregular bleeding not controlled by treatment',
      realWorld: 'Deep infiltrating endometriosis affecting bowel/bladder with uncontrolled symptoms.',
    },
  ],

  documentationTips: [
    'Document pelvic pain: timing, severity, relation to cycle',
    'Track menstrual patterns',
    'Record all treatments: hormonal, surgical',
    'Note laparoscopy findings',
    'Document impact on daily activities',
    'Track pain medication use',
    'Note bowel/bladder symptoms if present',
    'Record fertility concerns',
  ],

  keyTerms: {
    'Endometriosis': 'Uterine lining tissue growing outside uterus',
    'Endometrioma': 'Cyst on ovary from endometriosis',
    'Deep infiltrating': 'Endometriosis invading bowel, bladder, etc.',
    'Dysmenorrhea': 'Painful periods',
    'Dyspareunia': 'Pain with intercourse',
  },
};

// =============================================================================
// ERECTILE DYSFUNCTION - DC 7522
// =============================================================================
const ERECTILE_DYSFUNCTION_DESCRIPTION = {
  diagnosticCode: '7522',
  conditionName: 'Erectile Dysfunction',

  evidenceLookingFor: [
    'Diagnosis of erectile dysfunction',
    'Underlying cause documented',
    'Evidence of anatomical deformity if present',
    'Treatment history: medications, devices, implants',
    'Response to treatment',
    'Associated conditions (diabetes, vascular disease)',
    'Impact on quality of life',
    'Urological evaluation',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Erectile dysfunction alone without deformity',
      realWorld: 'ED without physical deformity. May qualify for Special Monthly Compensation.',
    },
    {
      percent: 20,
      meaning: 'Deformity of penis with loss of erectile power',
      realWorld: 'Physical deformity plus inability to achieve erection.',
    },
  ],

  documentationTips: [
    'Document diagnosis and cause',
    'Record treatments tried and response',
    'Note underlying conditions contributing',
    'Document any deformity if present',
    'Track medication effectiveness',
    'Note if related to service-connected condition',
    'Document urological evaluations',
    'Request SMC evaluation',
  ],

  keyTerms: {
    'Erectile dysfunction': 'Inability to achieve/maintain erection',
    'SMC-K': 'Special Monthly Compensation for loss of use of creative organ',
    'Deformity': 'Physical abnormality - required for schedular rating',
    'Loss of erectile power': 'Complete inability, not just partial',
  },
};

// =============================================================================
// GOUT - DC 5017
// =============================================================================
const GOUT_DESCRIPTION = {
  diagnosticCode: '5017',
  conditionName: 'Gout',

  evidenceLookingFor: [
    'Diagnosis of gout with uric acid levels',
    'Joint aspiration showing crystals if performed',
    'Documentation of acute attacks',
    'Evidence of chronic gouty arthritis',
    'Treatment history: colchicine, allopurinol',
    'Impact on joints and function',
    'Tophaceous deposits if present',
    'Frequency of flares',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'One or two exacerbations a year in a well-established diagnosis',
      realWorld: 'Occasional gout flares, once or twice yearly.',
    },
    {
      percent: 40,
      meaning: 'Symptom combinations productive of definite impairment of health, OR 3+ incapacitating exacerbations yearly',
      realWorld: 'Multiple severe flares yearly affecting overall health.',
    },
    {
      percent: 60,
      meaning: 'Severe impairment of health, OR severely incapacitating exacerbations 4+ times yearly, OR lesser number over prolonged periods',
      realWorld: 'Frequent severe flares causing major health impact.',
    },
    {
      percent: 100,
      meaning: 'Constitutional manifestations with totally incapacitating episodes',
      realWorld: 'Constant disabling gout preventing normal function.',
    },
  ],

  documentationTips: [
    'Track every gout attack: date, joints affected, duration',
    'Document uric acid levels',
    'Record all medications',
    'Note dietary triggers',
    'Track joint damage progression',
    'Document tophi if present',
    'Log days unable to work or function',
    'Note chronic joint symptoms between attacks',
  ],

  keyTerms: {
    'Gout': 'Inflammatory arthritis from uric acid crystals',
    'Hyperuricemia': 'High uric acid level',
    'Tophi': 'Uric acid deposits under skin or in joints',
    'Podagra': 'Gout attack in big toe - classic presentation',
    'Colchicine': 'Medication for acute attacks',
    'Allopurinol': 'Medication to lower uric acid',
  },
};

// =============================================================================
// TENDINITIS / TENOSYNOVITIS - DC 5024
// =============================================================================
const TENDINITIS_DESCRIPTION = {
  diagnosticCode: '5024',
  conditionName: 'Tendinitis / Tenosynovitis',

  evidenceLookingFor: [
    'Diagnosis of tendinitis or tenosynovitis',
    'Location of affected tendon(s)',
    'Imaging if performed (MRI, ultrasound)',
    'Documentation of symptoms',
    'Treatment history',
    'Impact on function and motion',
    'Chronicity documentation',
    'Work-related aggravation if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on limitation of motion of affected part',
      realWorld: 'Tendinitis is rated based on how it limits the affected joint\'s motion.',
    },
  ],

  documentationTips: [
    'Document which tendon(s) affected',
    'Track pain with specific movements',
    'Record range of motion limitations',
    'Note treatments: rest, PT, injections',
    'Document impact on work activities',
    'Track flare-ups',
    'Note if chronic or recurring',
    'Record grip strength if hand affected',
  ],

  keyTerms: {
    'Tendinitis': 'Tendon inflammation',
    'Tenosynovitis': 'Inflammation of tendon sheath',
    'De Quervain\'s': 'Thumb side wrist tendinitis',
    'Lateral epicondylitis': 'Tennis elbow',
    'Medial epicondylitis': 'Golfer\'s elbow',
    'Rate under limitation of motion': 'Use affected joint\'s rating criteria',
  },
};

// =============================================================================
// BURSITIS - DC 5019
// =============================================================================
const BURSITIS_DESCRIPTION = {
  diagnosticCode: '5019',
  conditionName: 'Bursitis',

  evidenceLookingFor: [
    'Diagnosis of bursitis with location',
    'Imaging showing bursitis if performed',
    'Documentation of symptoms',
    'Treatment history: rest, injections, aspiration',
    'Impact on joint function and motion',
    'Recurrence frequency',
    'Underlying cause if identified',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on limitation of motion of affected part',
      realWorld: 'Bursitis is rated based on how it limits the affected joint\'s motion.',
    },
  ],

  documentationTips: [
    'Document which bursa affected',
    'Track pain and swelling',
    'Record range of motion limitations',
    'Note treatments: rest, ice, injections',
    'Track recurrence frequency',
    'Document impact on activities',
    'Note occupational factors',
    'Record aspiration if performed',
  ],

  keyTerms: {
    'Bursitis': 'Inflammation of bursa (fluid-filled cushioning sac)',
    'Bursa': 'Sac that reduces friction between tissues',
    'Prepatellar bursitis': 'Housemaid\'s knee',
    'Olecranon bursitis': 'Elbow bursitis',
    'Trochanteric bursitis': 'Hip bursitis',
    'Rate under limitation of motion': 'Use affected joint\'s rating criteria',
  },
};

// =============================================================================
// CARPAL TUNNEL SYNDROME - DC 8515/8516
// =============================================================================
const CARPAL_TUNNEL_DESCRIPTION = {
  diagnosticCode: '8515',
  conditionName: 'Carpal Tunnel Syndrome',

  evidenceLookingFor: [
    'Diagnosis of carpal tunnel syndrome',
    'Nerve conduction study/EMG results',
    'Documentation of which hand(s) affected',
    'Dominant vs non-dominant hand',
    'Symptoms: numbness, tingling, weakness',
    'Treatment history: splints, injections, surgery',
    'Impact on grip strength and fine motor tasks',
    'Occupational impact',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Mild incomplete paralysis',
      realWorld: 'Mild symptoms - occasional numbness/tingling, minimal weakness.',
    },
    {
      percent: 20,
      meaning: 'Moderate incomplete paralysis (minor hand) OR 30% for major hand',
      realWorld: 'Noticeable symptoms affecting hand use. Some weakness and sensory loss.',
    },
    {
      percent: 40,
      meaning: 'Severe incomplete paralysis (minor hand) OR 50% for major hand',
      realWorld: 'Significant weakness and sensory loss. Major impact on hand function.',
    },
    {
      percent: 60,
      meaning: 'Complete paralysis (minor hand) OR 70% for major hand',
      realWorld: 'Complete median nerve dysfunction. Unable to use thumb properly.',
    },
  ],

  documentationTips: [
    'Get nerve conduction study - key diagnostic test',
    'Document which hand is dominant',
    'Track numbness and tingling: frequency, severity',
    'Note weakness: dropping objects, grip problems',
    'Record night symptoms - classic for CTS',
    'Document treatments: splints, injections, surgery',
    'Track impact on work tasks',
    'Note Tinel\'s and Phalen\'s test results',
  ],

  keyTerms: {
    'Median nerve': 'Nerve affected in carpal tunnel - controls thumb and first 3 fingers',
    'Major/dominant hand': 'Your dominant hand - rated higher',
    'Minor hand': 'Non-dominant hand - rated slightly lower',
    'Incomplete paralysis': 'Nerve damaged but not completely non-functional',
    'Thenar atrophy': 'Wasting of thumb muscles - indicates severe CTS',
    'Nerve conduction study': 'Electrical test measuring nerve function',
  },
};

// =============================================================================
// DISFIGUREMENT OF HEAD/FACE/NECK - DC 7800
// =============================================================================
const DISFIGUREMENT_DESCRIPTION = {
  diagnosticCode: '7800',
  conditionName: 'Disfigurement of Head, Face, or Neck',

  evidenceLookingFor: [
    'Photographs of disfigurement',
    'Documentation of scar characteristics',
    'Measurements: length, width, area',
    'Evidence of tissue loss',
    'Visible or palpable tissue loss',
    'Gross distortion or asymmetry of features',
    'Number of characteristics of disfigurement present',
    'Impact on appearance and function',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'One characteristic of disfigurement',
      realWorld: 'One qualifying characteristic present (see key terms).',
    },
    {
      percent: 30,
      meaning: 'Two or three characteristics of disfigurement',
      realWorld: 'Multiple characteristics present. Noticeable disfigurement.',
    },
    {
      percent: 50,
      meaning: 'Four or five characteristics of disfigurement',
      realWorld: 'Significant disfigurement with multiple characteristics.',
    },
    {
      percent: 80,
      meaning: 'Six or more characteristics, OR gross distortion/asymmetry of two or more features',
      realWorld: 'Severe disfigurement causing major visible asymmetry or distortion.',
    },
  ],

  documentationTips: [
    'Take clear photographs from multiple angles',
    'Measure all scars: length, width in cm/inches',
    'Document skin color changes',
    'Note any missing tissue',
    'Record texture changes: elevated, depressed',
    'Document adherent scars (stuck to underlying tissue)',
    'Note impact on facial expression if applicable',
    'Count which characteristics of disfigurement are present',
  ],

  keyTerms: {
    'Characteristics of disfigurement': '8 specific criteria: scar 5+ inches, scar 1/4+ inch wide, surface contour elevated/depressed, scar adherent, skin hypo/hyperpigmented (6+ sq in), abnormal skin texture (6+ sq in), missing underlying tissue (6+ sq in), distorted/asymmetric features',
    'Gross distortion': 'Severe asymmetry of nose, chin, forehead, eyes, ears, cheeks, lips',
    'Adherent scar': 'Scar stuck to underlying tissue, doesn\'t move freely',
    'Tissue loss': 'Missing soft tissue under skin',
  },
};

// =============================================================================
// OSTEOMYELITIS - DC 5000
// =============================================================================
const OSTEOMYELITIS_DESCRIPTION = {
  diagnosticCode: '5000',
  conditionName: 'Osteomyelitis',

  evidenceLookingFor: [
    'Diagnosis of osteomyelitis with location',
    'Imaging showing bone infection',
    'Culture results identifying organism',
    'Evidence of active vs inactive disease',
    'History of drainage or surgery',
    'Antibiotic treatment history',
    'Evidence of constitutional symptoms',
    'Impact on affected limb/area function',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Inactive, following repeated episodes, without evidence of active infection in past 5 years',
      realWorld: 'History of osteomyelitis but inactive for 5+ years.',
    },
    {
      percent: 20,
      meaning: 'Inactive, with discharging sinus or other evidence of active infection within past 5 years',
      realWorld: 'Currently inactive but was active within past 5 years.',
    },
    {
      percent: 60,
      meaning: 'Recurrent, with definite involucrum or sequestrum, OR with draining sinus within past 5 years',
      realWorld: 'Recurring bone infection with dead bone or ongoing drainage.',
    },
    {
      percent: 100,
      meaning: 'Active, with constitutional symptoms',
      realWorld: 'Active bone infection with systemic symptoms (fever, weight loss, etc.).',
    },
  ],

  documentationTips: [
    'Keep all imaging showing bone infection',
    'Document culture results',
    'Track episodes of active infection',
    'Record all antibiotic courses',
    'Note any drainage - active or history',
    'Document surgical debridements',
    'Track constitutional symptoms during active disease',
    'Note impact on limb function',
  ],

  keyTerms: {
    'Osteomyelitis': 'Bone infection',
    'Sequestrum': 'Dead bone fragment from infection',
    'Involucrum': 'New bone formed around infected area',
    'Draining sinus': 'Tract allowing pus to drain from bone to skin',
    'Constitutional symptoms': 'Fever, chills, weight loss, fatigue',
  },
};

// =============================================================================
// MYOSITIS - DC 5021
// =============================================================================
const MYOSITIS_DESCRIPTION = {
  diagnosticCode: '5021',
  conditionName: 'Myositis',

  evidenceLookingFor: [
    'Diagnosis of myositis (polymyositis, dermatomyositis, etc.)',
    'Muscle enzyme levels (CK, aldolase)',
    'EMG results',
    'Muscle biopsy if performed',
    'Documentation of muscle weakness',
    'Skin findings if dermatomyositis',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on limitation of motion of affected part, as degenerative arthritis',
      realWorld: 'Rate based on how myositis affects joint/limb function.',
    },
  ],

  documentationTips: [
    'Track muscle enzyme levels over time',
    'Document which muscle groups affected',
    'Record strength testing results',
    'Note treatments: steroids, immunosuppressants',
    'Track functional limitations: climbing stairs, rising from chair',
    'Document skin rash if dermatomyositis',
    'Note swallowing difficulties if present',
    'Record impact on daily activities',
  ],

  keyTerms: {
    'Myositis': 'Muscle inflammation',
    'Polymyositis': 'Inflammatory muscle disease',
    'Dermatomyositis': 'Myositis with skin involvement',
    'CK': 'Creatine Kinase - muscle enzyme elevated in myositis',
    'Proximal weakness': 'Weakness in shoulders and hips - classic pattern',
  },
};

// =============================================================================
// SYNOVITIS - DC 5020
// =============================================================================
const SYNOVITIS_DESCRIPTION = {
  diagnosticCode: '5020',
  conditionName: 'Synovitis',

  evidenceLookingFor: [
    'Diagnosis of synovitis with location',
    'Imaging showing synovial inflammation',
    'Joint fluid analysis if performed',
    'Documentation of affected joints',
    'Treatment history',
    'Impact on joint function and motion',
    'Underlying cause if identified',
    'Recurrence frequency',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on limitation of motion of affected part, as degenerative arthritis',
      realWorld: 'Rate based on how synovitis limits the affected joint\'s motion.',
    },
  ],

  documentationTips: [
    'Document which joints affected',
    'Track swelling episodes',
    'Record range of motion limitations',
    'Note treatments: NSAIDs, injections',
    'Document underlying cause if found',
    'Track impact on daily activities',
    'Note if chronic or recurring',
    'Record imaging showing synovitis',
  ],

  keyTerms: {
    'Synovitis': 'Inflammation of synovial membrane lining joints',
    'Synovium': 'Tissue lining joints that produces joint fluid',
    'Effusion': 'Excess fluid in joint from inflammation',
    'Villonodular synovitis': 'Specific type causing growths in synovium',
  },
};

// =============================================================================
// LYMPHEDEMA - DC 8540
// =============================================================================
const LYMPHEDEMA_DESCRIPTION = {
  diagnosticCode: '8540',
  conditionName: 'Lymphedema',

  evidenceLookingFor: [
    'Diagnosis of lymphedema with location',
    'Cause: surgery, radiation, infection, etc.',
    'Documentation of swelling severity',
    'Measurements of affected limb',
    'Evidence of skin changes',
    'Treatment: compression, therapy, pumps',
    'Infections (cellulitis) if recurrent',
    'Impact on function',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Lymphedema of extremity, asymptomatic',
      realWorld: 'Minimal swelling without functional impact.',
    },
    {
      percent: 10,
      meaning: 'Lymphedema with mild edema, controlled with compression',
      realWorld: 'Swelling controlled with compression garments.',
    },
    {
      percent: 30,
      meaning: 'Persistent edema, elevation only partially effective',
      realWorld: 'Constant swelling not fully relieved by elevation.',
    },
    {
      percent: 60,
      meaning: 'Persistent edema with stasis dermatitis, ulceration, or cellulitis',
      realWorld: 'Severe swelling with skin breakdown or infections.',
    },
  ],

  documentationTips: [
    'Measure limb circumference regularly',
    'Document swelling patterns',
    'Track compression garment use',
    'Note skin changes: thickening, hardening',
    'Record cellulitis episodes',
    'Document lymphedema therapy',
    'Track impact on limb function',
    'Note cause: post-surgical, radiation, etc.',
  ],

  keyTerms: {
    'Lymphedema': 'Swelling from lymphatic system blockage',
    'Primary lymphedema': 'Born with lymphatic abnormality',
    'Secondary lymphedema': 'From surgery, radiation, infection, etc.',
    'Cellulitis': 'Skin infection - common complication',
    'Complete decongestive therapy': 'Specialized lymphedema treatment',
  },
};

// =============================================================================
// WEST NILE VIRUS - DC 6315
// =============================================================================
const WEST_NILE_DESCRIPTION = {
  diagnosticCode: '6315',
  conditionName: 'West Nile Virus',

  evidenceLookingFor: [
    'Diagnosis of West Nile virus infection',
    'Serological testing results',
    'Documentation of neurological involvement if present',
    'Residual symptoms',
    'Treatment history',
    'Functional limitations from residuals',
    'Evidence of encephalitis or meningitis if occurred',
    'Current symptom status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Residuals - rate based on specific organ affected',
      realWorld: 'After acute infection, rate any lasting neurological or other damage.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'During active West Nile infection.',
    },
  ],

  documentationTips: [
    'Keep diagnostic test results',
    'Document acute illness severity',
    'Track any neurological symptoms',
    'Note residual fatigue, weakness',
    'Document cognitive changes if present',
    'Record functional limitations',
    'Note muscle weakness if persists',
    'Track recovery progress',
  ],

  keyTerms: {
    'West Nile fever': 'Milder form - flu-like symptoms',
    'West Nile neuroinvasive': 'Severe form affecting brain/spinal cord',
    'Encephalitis': 'Brain inflammation',
    'Meningitis': 'Inflammation of brain/spinal cord membranes',
    'Residuals': 'Lasting effects after acute infection',
  },
};

// =============================================================================
// CAMPYLOBACTER - DC 6316
// =============================================================================
const CAMPYLOBACTER_DESCRIPTION = {
  diagnosticCode: '6316',
  conditionName: 'Campylobacter Infection',

  evidenceLookingFor: [
    'Diagnosis of campylobacter infection',
    'Stool culture results',
    'Documentation of GI symptoms',
    'Evidence of reactive arthritis if developed',
    'Evidence of Guillain-Barré if developed',
    'Residual symptoms',
    'Treatment history',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on specific condition',
      realWorld: 'After acute infection, rate any lasting GI, joint, or neurological problems.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'During active campylobacter infection.',
    },
  ],

  documentationTips: [
    'Keep diagnostic culture results',
    'Document acute illness',
    'Track any reactive arthritis',
    'Note neurological symptoms (Guillain-Barré)',
    'Document ongoing GI symptoms',
    'Record functional limitations',
    'Track post-infectious IBS if developed',
  ],

  keyTerms: {
    'Campylobacter': 'Bacterial infection causing gastroenteritis',
    'Reactive arthritis': 'Joint inflammation triggered by infection',
    'Guillain-Barr&#233; syndrome': 'Nerve damage that can follow campylobacter',
    'Post-infectious IBS': 'IBS developing after GI infection',
  },
};

// =============================================================================
// SHIGELLA - DC 6317
// =============================================================================
const SHIGELLA_DESCRIPTION = {
  diagnosticCode: '6317',
  conditionName: 'Shigella Infection',

  evidenceLookingFor: [
    'Diagnosis of shigellosis',
    'Stool culture results',
    'Documentation of bloody diarrhea',
    'Complications if present',
    'Treatment history',
    'Residual GI symptoms',
    'Evidence of reactive arthritis if developed',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on specific condition',
      realWorld: 'After acute infection, rate any lasting GI or joint problems.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'During active shigella infection.',
    },
  ],

  documentationTips: [
    'Keep diagnostic culture results',
    'Document acute illness severity',
    'Track any complications',
    'Note reactive arthritis if developed',
    'Document ongoing GI symptoms',
    'Record antibiotic treatment',
    'Track recovery',
  ],

  keyTerms: {
    'Shigellosis': 'Dysentery caused by Shigella bacteria',
    'Bloody diarrhea': 'Classic symptom of shigellosis',
    'Reactive arthritis': 'Can develop after shigella infection',
    'HUS': 'Hemolytic Uremic Syndrome - rare complication',
  },
};

// =============================================================================
// SALMONELLA - DC 6318
// =============================================================================
const SALMONELLA_DESCRIPTION = {
  diagnosticCode: '6318',
  conditionName: 'Salmonella Infection',

  evidenceLookingFor: [
    'Diagnosis of salmonellosis',
    'Stool or blood culture results',
    'Documentation of GI symptoms',
    'Evidence of bacteremia if occurred',
    'Complications if present',
    'Treatment history',
    'Residual symptoms',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on specific condition',
      realWorld: 'After acute infection, rate any lasting effects.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'During active salmonella infection.',
    },
  ],

  documentationTips: [
    'Keep diagnostic culture results',
    'Document acute illness',
    'Track any complications',
    'Note reactive arthritis if developed',
    'Document ongoing GI symptoms',
    'Record treatment',
    'Track carrier state if applicable',
  ],

  keyTerms: {
    'Salmonellosis': 'Infection with Salmonella bacteria',
    'Bacteremia': 'Bacteria in bloodstream - serious',
    'Typhoid': 'Severe form caused by Salmonella typhi',
    'Carrier state': 'Ongoing shedding of bacteria after recovery',
  },
};

// =============================================================================
// Q FEVER - DC 6319
// =============================================================================
const Q_FEVER_DESCRIPTION = {
  diagnosticCode: '6319',
  conditionName: 'Q Fever',

  evidenceLookingFor: [
    'Diagnosis of Q fever',
    'Serological testing results',
    'Documentation of acute vs chronic',
    'Evidence of endocarditis if chronic',
    'Exposure history (livestock, military)',
    'Treatment history',
    'Residual symptoms',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on specific condition',
      realWorld: 'After acute infection, rate any lasting fatigue or organ damage.',
    },
    {
      percent: 100,
      meaning: 'Active infection OR chronic Q fever',
      realWorld: 'During active or chronic Q fever requiring treatment.',
    },
  ],

  documentationTips: [
    'Keep serological test results',
    'Document acute vs chronic disease',
    'Note exposure circumstances',
    'Track fatigue and other symptoms',
    'Document cardiac involvement if present',
    'Record treatment duration',
    'Note military deployment if relevant',
    'Track post-Q fever fatigue syndrome',
  ],

  keyTerms: {
    'Q fever': 'Infection with Coxiella burnetii',
    'Acute Q fever': 'Self-limited flu-like illness',
    'Chronic Q fever': 'Persistent infection, often affecting heart valves',
    'Q fever endocarditis': 'Heart valve infection - serious',
    'Post-Q fever fatigue': 'Chronic fatigue after acute infection',
  },
};

// =============================================================================
// LYME DISEASE - DC 6320
// =============================================================================
const LYME_DISEASE_DESCRIPTION = {
  diagnosticCode: '6320',
  conditionName: 'Lyme Disease',

  evidenceLookingFor: [
    'Diagnosis of Lyme disease',
    'Serological testing (ELISA, Western blot)',
    'Documentation of tick bite or rash',
    'Evidence of disseminated disease',
    'Joint, neurological, or cardiac involvement',
    'Treatment history',
    'Residual symptoms',
    'Post-treatment Lyme disease syndrome if present',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on specific condition',
      realWorld: 'Rate any lasting joint, neurological, or cardiac problems from Lyme.',
    },
    {
      percent: 100,
      meaning: 'Active infection',
      realWorld: 'During active Lyme disease requiring treatment.',
    },
  ],

  documentationTips: [
    'Keep all Lyme test results',
    'Document erythema migrans rash if present',
    'Track joint symptoms (Lyme arthritis)',
    'Note neurological symptoms: facial palsy, neuropathy',
    'Document cardiac involvement if present',
    'Record all antibiotic treatments',
    'Track persistent symptoms after treatment',
    'Note tick exposure history',
  ],

  keyTerms: {
    'Lyme disease': 'Infection with Borrelia burgdorferi from tick bite',
    'Erythema migrans': 'Bull\'s-eye rash - classic early sign',
    'Lyme arthritis': 'Joint inflammation, often knee',
    'Neuroborreliosis': 'Nervous system Lyme disease',
    'Post-treatment Lyme disease syndrome': 'Persistent symptoms after treatment',
  },
};

// =============================================================================
// NONTUBERCULOUS MYCOBACTERIAL INFECTION - DC 6326
// =============================================================================
const NTM_DESCRIPTION = {
  diagnosticCode: '6326',
  conditionName: 'Nontuberculous Mycobacterial Infection (NTM)',

  evidenceLookingFor: [
    'Diagnosis of NTM infection',
    'Culture results identifying species',
    'Imaging showing lung involvement',
    'Pulmonary function tests',
    'Treatment regimen and duration',
    'Evidence of other organ involvement',
    'Residual lung damage',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate residuals based on organ affected',
      realWorld: 'After treatment, rate any lasting lung damage or other residuals.',
    },
    {
      percent: 100,
      meaning: 'Active disease requiring treatment',
      realWorld: 'During active NTM infection requiring multi-drug therapy.',
    },
  ],

  documentationTips: [
    'Keep all culture results',
    'Track species identified',
    'Document lung involvement on CT',
    'Record pulmonary function tests',
    'Track treatment regimen (usually 12-18 months)',
    'Note medication side effects',
    'Document sputum conversion',
    'Track residual lung function',
  ],

  keyTerms: {
    'NTM': 'Nontuberculous Mycobacteria - environmental bacteria',
    'MAC': 'Mycobacterium Avium Complex - most common NTM',
    'Bronchiectasis': 'Lung damage often associated with NTM',
    'Sputum conversion': 'Cultures becoming negative - goal of treatment',
  },
};

// =============================================================================
// INFERTILITY (MALE) - DC 7631
// =============================================================================
const INFERTILITY_DESCRIPTION = {
  diagnosticCode: '7631',
  conditionName: 'Infertility',

  evidenceLookingFor: [
    'Diagnosis of infertility with cause',
    'Semen analysis results',
    'Hormone levels if relevant',
    'Evidence of anatomical abnormality',
    'Surgical history affecting fertility',
    'Treatment history',
    'Evidence of service connection',
    'SMC consideration',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate underlying cause; may qualify for SMC-K',
      realWorld: 'Rate the condition causing infertility. Special Monthly Compensation may apply.',
    },
  ],

  documentationTips: [
    'Document cause of infertility',
    'Keep semen analysis results',
    'Record hormone levels',
    'Note any surgeries affecting fertility',
    'Document service-connected cause',
    'Request SMC-K evaluation',
    'Track treatment attempts',
  ],

  keyTerms: {
    'Azoospermia': 'No sperm in semen',
    'Oligospermia': 'Low sperm count',
    'SMC-K': 'Special Monthly Compensation for loss of use of creative organ',
    'Varicocele': 'Enlarged veins in scrotum - can cause infertility',
  },
};

// =============================================================================
// PELVIC ORGAN PROLAPSE - DC 7617
// =============================================================================
const PELVIC_PROLAPSE_DESCRIPTION = {
  diagnosticCode: '7617',
  conditionName: 'Pelvic Organ Prolapse',

  evidenceLookingFor: [
    'Diagnosis of pelvic organ prolapse with type',
    'Degree/stage of prolapse',
    'Symptoms: pressure, bulging, urinary/bowel symptoms',
    'Treatment: pessary, surgery',
    'Impact on daily activities',
    'Associated urinary or bowel dysfunction',
    'Surgical history',
    'Current symptom status',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Symptomatic prolapse requiring treatment',
      realWorld: 'Prolapse causing symptoms and needing pessary or other treatment.',
    },
    {
      percent: 30,
      meaning: 'Prolapse not controlled by treatment',
      realWorld: 'Significant prolapse despite treatment. Major symptoms.',
    },
  ],

  documentationTips: [
    'Document type: cystocele, rectocele, uterine',
    'Record stage/degree of prolapse',
    'Track symptoms: bulging, pressure',
    'Note urinary symptoms',
    'Document bowel symptoms',
    'Record pessary use',
    'Document surgical repairs',
    'Track impact on activities',
  ],

  keyTerms: {
    'Cystocele': 'Bladder prolapse into vagina',
    'Rectocele': 'Rectum prolapse into vagina',
    'Uterine prolapse': 'Uterus descending into vagina',
    'Pessary': 'Device inserted to support prolapsed organs',
    'Staging': 'Degree of descent - higher stage = more severe',
  },
};

// =============================================================================
// OVARY REMOVAL - DC 7619
// =============================================================================
const OVARY_REMOVAL_DESCRIPTION = {
  diagnosticCode: '7619',
  conditionName: 'Ovary Removal (Oophorectomy)',

  evidenceLookingFor: [
    'Surgical records of oophorectomy',
    'Unilateral vs bilateral removal',
    'Reason for surgery',
    'Hormone therapy if used',
    'Symptoms of hormone deficiency',
    'Impact on fertility',
    'Menopausal symptoms if applicable',
    'Current symptom status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Removal of one ovary, asymptomatic',
      realWorld: 'One ovary removed, no ongoing symptoms.',
    },
    {
      percent: 30,
      meaning: 'Removal of both ovaries (bilateral oophorectomy)',
      realWorld: 'Both ovaries removed - surgical menopause.',
    },
  ],

  documentationTips: [
    'Keep surgical records',
    'Document unilateral vs bilateral',
    'Track menopausal symptoms',
    'Note hormone replacement use',
    'Document impact on fertility',
    'Record hot flashes, mood changes',
    'Note osteoporosis risk',
    'Track quality of life impact',
  ],

  keyTerms: {
    'Oophorectomy': 'Surgical removal of ovary',
    'Bilateral': 'Both ovaries removed',
    'Unilateral': 'One ovary removed',
    'Surgical menopause': 'Immediate menopause from bilateral oophorectomy',
    'HRT': 'Hormone Replacement Therapy',
  },
};

// =============================================================================
// UTERUS REMOVAL - DC 7620
// =============================================================================
const UTERUS_REMOVAL_DESCRIPTION = {
  diagnosticCode: '7620',
  conditionName: 'Uterus Removal (Hysterectomy)',

  evidenceLookingFor: [
    'Surgical records of hysterectomy',
    'Type: total vs partial, with or without ovaries',
    'Reason for surgery',
    'Current symptoms',
    'Complications if any',
    'Impact on function',
    'Hormone therapy if ovaries removed',
    'Quality of life impact',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Removal of uterus including corpus',
      realWorld: 'Uterus removed. Rate higher if ovaries also removed.',
    },
  ],

  documentationTips: [
    'Keep surgical records',
    'Document type of hysterectomy',
    'Note if ovaries removed too',
    'Track residual symptoms',
    'Document complications',
    'Note bladder/bowel changes',
    'Record hormone therapy if used',
    'Track quality of life',
  ],

  keyTerms: {
    'Total hysterectomy': 'Removal of uterus and cervix',
    'Partial hysterectomy': 'Uterus removed, cervix left',
    'TAH-BSO': 'Total Abdominal Hysterectomy with Bilateral Salpingo-Oophorectomy',
    'Laparoscopic': 'Minimally invasive approach',
  },
};

// =============================================================================
// BREAST SURGERY - DC 7626/7627/7628
// =============================================================================
const BREAST_SURGERY_DESCRIPTION = {
  diagnosticCode: '7626',
  conditionName: 'Breast Surgery (Mastectomy)',

  evidenceLookingFor: [
    'Surgical records',
    'Type: lumpectomy vs mastectomy',
    'Unilateral vs bilateral',
    'Reason for surgery',
    'Reconstruction if performed',
    'Lymphedema if present',
    'Impact on function and appearance',
    'Prosthesis use',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Simple mastectomy - removal of all breast tissue (one side)',
      realWorld: 'Complete breast removal on one side.',
    },
    {
      percent: 40,
      meaning: 'Simple mastectomy - bilateral',
      realWorld: 'Complete breast removal on both sides.',
    },
    {
      percent: 50,
      meaning: 'Modified radical mastectomy',
      realWorld: 'Breast removal with lymph node dissection.',
    },
    {
      percent: 80,
      meaning: 'Radical mastectomy - bilateral OR following treatment for breast cancer',
      realWorld: 'Extensive bilateral surgery or related to cancer treatment.',
    },
  ],

  documentationTips: [
    'Keep all surgical records',
    'Document type of surgery',
    'Note lymph node involvement',
    'Track lymphedema if present',
    'Document reconstruction',
    'Note prosthesis use',
    'Record range of motion limitations',
    'Document psychological impact',
  ],

  keyTerms: {
    'Lumpectomy': 'Removal of tumor and margin only',
    'Simple mastectomy': 'All breast tissue removed',
    'Modified radical': 'Breast and axillary lymph nodes removed',
    'Radical mastectomy': 'Breast, nodes, and chest muscle removed',
    'Reconstruction': 'Rebuilding breast after mastectomy',
  },
};

// =============================================================================
// TMJ (TEMPOROMANDIBULAR JOINT) - DC 9905
// =============================================================================
const TMJ_DESCRIPTION = {
  diagnosticCode: '9905',
  conditionName: 'Temporomandibular Joint Disorder (TMJ)',

  evidenceLookingFor: [
    'Diagnosis of TMJ disorder',
    'Documentation of jaw opening limitation',
    'Evidence of lateral excursion limitation',
    'Imaging: X-ray, CT, or MRI of jaw',
    'Pain documentation',
    'Clicking, popping, or locking episodes',
    'Treatment history: splints, PT, surgery',
    'Impact on eating and speaking',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Inter-incisal range 31-40mm, OR lateral excursion 0-4mm',
      realWorld: 'Mild TMJ - some limitation opening mouth or moving jaw side to side.',
    },
    {
      percent: 20,
      meaning: 'Inter-incisal range 21-30mm',
      realWorld: 'Moderate TMJ - noticeable difficulty opening mouth wide.',
    },
    {
      percent: 30,
      meaning: 'Inter-incisal range 11-20mm',
      realWorld: 'Significant TMJ - major limitation opening mouth. Affects eating.',
    },
    {
      percent: 40,
      meaning: 'Inter-incisal range 0-10mm',
      realWorld: 'Severe TMJ - barely able to open mouth. Major functional impairment.',
    },
  ],

  documentationTips: [
    'Measure jaw opening: distance between upper and lower front teeth',
    'Document lateral movement (side to side)',
    'Track pain: location, severity, triggers',
    'Note clicking, popping, or locking',
    'Record foods you cannot eat due to TMJ',
    'Document treatments: splints, injections, PT',
    'Track headaches related to TMJ',
    'Note impact on speaking',
  ],

  keyTerms: {
    'Inter-incisal range': 'How far you can open your mouth - measured in mm',
    'Lateral excursion': 'How far jaw moves side to side',
    'TMD': 'Temporomandibular Disorder - same as TMJ',
    'Bruxism': 'Teeth grinding - often associated with TMJ',
    'Occlusal splint': 'Mouth guard for TMJ treatment',
  },
};

// =============================================================================
// TOOTH LOSS - DC 9913
// =============================================================================
const TOOTH_LOSS_DESCRIPTION = {
  diagnosticCode: '9913',
  conditionName: 'Tooth Loss',

  evidenceLookingFor: [
    'Documentation of teeth lost',
    'Cause of tooth loss (service-connected)',
    'Which teeth are missing',
    'Whether teeth can be replaced by denture',
    'Masticatory (chewing) surface lost',
    'Impact on eating',
    'Dental records',
    'Current dental status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Loss of teeth replaceable by denture',
      realWorld: 'Missing teeth that can be replaced with dentures.',
    },
    {
      percent: 10,
      meaning: 'All upper OR all lower teeth missing',
      realWorld: 'Complete loss of upper or lower teeth.',
    },
    {
      percent: 20,
      meaning: 'All upper AND all lower teeth missing',
      realWorld: 'Complete loss of all teeth.',
    },
    {
      percent: 40,
      meaning: 'Loss of masticatory surface not restorable by denture',
      realWorld: 'Cannot restore chewing function even with dentures.',
    },
  ],

  documentationTips: [
    'Get complete dental records',
    'Document which teeth are missing',
    'Note cause of each tooth loss',
    'Record whether dentures are possible',
    'Document chewing difficulties',
    'Note dietary restrictions from tooth loss',
    'Track bone loss if present',
    'Document failed dental work',
  ],

  keyTerms: {
    'Masticatory surface': 'Chewing surface of teeth',
    'Restorable': 'Can be replaced with dentures or implants',
    'Edentulous': 'Having no teeth',
    'Dental prosthesis': 'Dentures, bridges, implants',
  },
};

// =============================================================================
// COLD INJURY RESIDUALS - DC 7122
// =============================================================================
const COLD_INJURY_DESCRIPTION = {
  diagnosticCode: '7122',
  conditionName: 'Cold Injury Residuals (Frostbite)',

  evidenceLookingFor: [
    'History of cold injury/frostbite',
    'Documentation of affected body parts',
    'Evidence of residual symptoms',
    'Cold sensitivity',
    'Tissue loss or amputation if occurred',
    'Numbness, tingling, or pain',
    'Color changes in affected areas',
    'Nail abnormalities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Arthralgia or other pain, numbness, or cold sensitivity',
      realWorld: 'Residual pain, numbness, or cold sensitivity in affected area.',
    },
    {
      percent: 20,
      meaning: 'Arthralgia or other pain, numbness, or cold sensitivity PLUS tissue loss, nail abnormalities, color changes, locally impaired sensation, hyperhidrosis, or X-ray abnormalities',
      realWorld: 'Pain/numbness plus visible changes or tissue damage.',
    },
    {
      percent: 30,
      meaning: 'Arthralgia or other pain, numbness, or cold sensitivity PLUS two or more of: tissue loss, nail abnormalities, color changes, locally impaired sensation, hyperhidrosis, X-ray abnormalities',
      realWorld: 'Pain/numbness plus multiple types of visible damage.',
    },
  ],

  documentationTips: [
    'Document original cold injury event',
    'List all affected body parts (each rated separately)',
    'Track cold sensitivity: triggers, severity',
    'Note numbness and tingling',
    'Document color changes in cold',
    'Record nail changes',
    'Note any tissue loss',
    'Track pain patterns',
  ],

  keyTerms: {
    'Cold injury': 'Frostbite or immersion foot',
    'Chilblains': 'Milder form of cold injury',
    'Cold sensitivity': 'Pain or discomfort with cold exposure',
    'Each affected part rated separately': 'Each hand, foot rated individually',
    'Raynaud\'s phenomenon': 'Color changes from cold - white, blue, red',
  },
};

// =============================================================================
// NARCOLEPSY - DC 8108
// =============================================================================
const NARCOLEPSY_DESCRIPTION = {
  diagnosticCode: '8108',
  conditionName: 'Narcolepsy',

  evidenceLookingFor: [
    'Diagnosis of narcolepsy from sleep specialist',
    'Sleep study (polysomnography) results',
    'Multiple Sleep Latency Test (MSLT) results',
    'Documentation of cataplexy if present',
    'Frequency of sleep attacks',
    'Medication requirements',
    'Impact on driving, work, daily activities',
    'Sleep paralysis or hallucinations if present',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Mild narcolepsy with infrequent sleep attacks',
      realWorld: 'Occasional sleep attacks, managed with medication.',
    },
    {
      percent: 30,
      meaning: 'Moderate narcolepsy with daily sleep attacks',
      realWorld: 'Daily sleep attacks affecting work and activities.',
    },
    {
      percent: 60,
      meaning: 'Severe narcolepsy with frequent attacks and cataplexy',
      realWorld: 'Frequent attacks plus cataplexy. Major life impact.',
    },
    {
      percent: 80,
      meaning: 'Profound narcolepsy, near-continuous drowsiness',
      realWorld: 'Near-constant drowsiness. Unable to maintain wakefulness.',
    },
  ],

  documentationTips: [
    'Keep sleep study results',
    'Track sleep attacks: frequency, triggers, duration',
    'Document cataplexy episodes',
    'Note medications and effectiveness',
    'Track impact on driving (usually restricted)',
    'Document work limitations',
    'Note sleep paralysis or hallucinations',
    'Record accidents or near-accidents from sleepiness',
  ],

  keyTerms: {
    'Narcolepsy': 'Neurological disorder causing sudden sleep attacks',
    'Cataplexy': 'Sudden muscle weakness triggered by emotion - key symptom',
    'MSLT': 'Multiple Sleep Latency Test - diagnostic test showing how fast you fall asleep',
    'Sleep paralysis': 'Unable to move when falling asleep or waking',
    'Hypnagogic hallucinations': 'Vivid hallucinations at sleep onset',
  },
};

// =============================================================================
// SYRINGOMYELIA - DC 8024
// =============================================================================
const SYRINGOMYELIA_DESCRIPTION = {
  diagnosticCode: '8024',
  conditionName: 'Syringomyelia',

  evidenceLookingFor: [
    'Diagnosis of syringomyelia on MRI',
    'Documentation of symptoms',
    'Evidence of sensory loss pattern',
    'Weakness documentation',
    'Pain documentation',
    'Associated Chiari malformation if present',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Minimum rating for syringomyelia',
      realWorld: 'Diagnosed syringomyelia with symptoms. Floor rating for condition.',
    },
    {
      percent: 60,
      meaning: 'Moderate disability',
      realWorld: 'Significant symptoms affecting daily function.',
    },
    {
      percent: 100,
      meaning: 'Severe disability with pronounced muscle atrophy and sensory loss',
      realWorld: 'Major neurological deficits from syrinx.',
    },
  ],

  documentationTips: [
    'Keep MRI reports showing syrinx',
    'Document sensory loss: location, type',
    'Track weakness and muscle wasting',
    'Note pain: location, severity',
    'Document cape-like sensory loss if present',
    'Track progression on serial MRIs',
    'Note associated conditions (Chiari)',
    'Record functional limitations',
  ],

  keyTerms: {
    'Syringomyelia': 'Fluid-filled cavity (syrinx) in spinal cord',
    'Syrinx': 'The cavity itself',
    'Cape-like sensory loss': 'Loss of pain/temperature sensation over shoulders/arms',
    'Chiari malformation': 'Brain abnormality often associated with syringomyelia',
    'Dissociated sensory loss': 'Lose pain/temperature but keep touch/position sense',
  },
};

// =============================================================================
// MYELITIS - DC 8023
// =============================================================================
const MYELITIS_DESCRIPTION = {
  diagnosticCode: '8023',
  conditionName: 'Myelitis (Spinal Cord Inflammation)',

  evidenceLookingFor: [
    'Diagnosis of myelitis (transverse myelitis, etc.)',
    'MRI showing spinal cord inflammation',
    'Documentation of neurological deficits',
    'Sensory level documentation',
    'Motor weakness',
    'Bladder/bowel dysfunction',
    'Treatment history',
    'Recovery or residual deficits',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Minimum rating for myelitis',
      realWorld: 'Myelitis with residual neurological symptoms.',
    },
    {
      percent: 100,
      meaning: 'Severe residuals with paralysis',
      realWorld: 'Significant paralysis or other major deficits from myelitis.',
    },
  ],

  documentationTips: [
    'Keep MRI showing inflammation',
    'Document sensory level',
    'Track motor strength',
    'Note bladder/bowel function',
    'Document walking ability',
    'Track recovery progress',
    'Note residual deficits',
    'Record assistive device use',
  ],

  keyTerms: {
    'Transverse myelitis': 'Inflammation across width of spinal cord',
    'Sensory level': 'Point below which sensation is abnormal',
    'Paraparesis': 'Weakness of both legs',
    'Paraplegia': 'Paralysis of both legs',
    'Neurogenic bladder': 'Bladder dysfunction from nerve damage',
  },
};

// =============================================================================
// INSOMNIA - DC 7199
// =============================================================================
const INSOMNIA_DESCRIPTION = {
  diagnosticCode: '7199',
  conditionName: 'Insomnia',

  evidenceLookingFor: [
    'Diagnosis of chronic insomnia',
    'Sleep study if performed',
    'Documentation of sleep patterns',
    'Duration of sleep problems',
    'Treatment history',
    'Impact on daytime function',
    'Associated conditions',
    'Medication requirements',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on underlying condition or analogous code',
      realWorld: 'Insomnia rated by analogy - often to mental health codes if significant impairment.',
    },
    {
      percent: 10,
      meaning: 'Chronic insomnia requiring medication',
      realWorld: 'Ongoing insomnia needing sleep medication.',
    },
  ],

  documentationTips: [
    'Track sleep patterns: time to fall asleep, awakenings',
    'Document total sleep time',
    'Note daytime fatigue and impairment',
    'Record all sleep medications tried',
    'Track sleep hygiene measures',
    'Document impact on work and function',
    'Note associated conditions (PTSD, depression)',
    'Keep sleep study results if done',
  ],

  keyTerms: {
    'Chronic insomnia': 'Sleep problems 3+ nights/week for 3+ months',
    'Sleep onset insomnia': 'Trouble falling asleep',
    'Sleep maintenance insomnia': 'Trouble staying asleep',
    'Sleep efficiency': 'Percentage of time in bed actually sleeping',
    'Analogous rating': 'Rating by comparison to similar listed condition',
  },
};

// =============================================================================
// KIDNEY STONES - DC 7502
// =============================================================================
const KIDNEY_STONES_DESCRIPTION = {
  diagnosticCode: '7508',
  conditionName: 'Kidney Stones (Nephrolithiasis)',

  evidenceLookingFor: [
    'Diagnosis of kidney stones',
    'Imaging showing stones',
    'Documentation of stone episodes',
    'Treatment: medical, lithotripsy, surgery',
    'Recurrence frequency',
    'Complications: infections, obstruction',
    'Preventive measures',
    'Impact on kidney function',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Occasional attacks of colic with infection (pyonephrosis) requiring catheter drainage',
      realWorld: 'Periodic stone episodes with infection needing intervention.',
    },
    {
      percent: 20,
      meaning: 'Frequent attacks of colic requiring catheter drainage',
      realWorld: 'Frequent stone episodes requiring drainage procedures.',
    },
    {
      percent: 30,
      meaning: 'Frequent attacks of colic, infection, and kidney function impairment',
      realWorld: 'Regular attacks with infection and declining kidney function.',
    },
  ],

  documentationTips: [
    'Track every stone episode: date, severity, treatment',
    'Keep imaging showing stones',
    'Document procedures: lithotripsy, stents, surgery',
    'Record infections associated with stones',
    'Track kidney function over time',
    'Note preventive measures (diet, medications)',
    'Document ER visits and hospitalizations',
    'Record stone analysis if done',
  ],

  keyTerms: {
    'Nephrolithiasis': 'Kidney stones',
    'Renal colic': 'Severe pain from stone passing',
    'Lithotripsy': 'Breaking up stones with shock waves',
    'Ureteral stent': 'Tube placed to help stone pass',
    'Pyonephrosis': 'Infected kidney with obstruction',
  },
};

// =============================================================================
// URETHRAL STRICTURE - DC 7519
// =============================================================================
const URETHRAL_STRICTURE_DESCRIPTION = {
  diagnosticCode: '7519',
  conditionName: 'Urethral Stricture',

  evidenceLookingFor: [
    'Diagnosis of urethral stricture',
    'Imaging or cystoscopy showing stricture',
    'Urinary symptoms documentation',
    'Treatment: dilation, surgery',
    'Recurrence history',
    'Impact on urination',
    'Cause of stricture',
    'Current management',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on voiding dysfunction',
      realWorld: 'Rate based on how stricture affects urination frequency/incontinence.',
    },
  ],

  documentationTips: [
    'Document urinary symptoms',
    'Track dilations or procedures needed',
    'Note recurrence frequency',
    'Record voiding difficulties',
    'Document cause (infection, injury, catheter)',
    'Track flow rate if measured',
    'Note retention episodes',
    'Record surgical interventions',
  ],

  keyTerms: {
    'Urethral stricture': 'Narrowing of urethra',
    'Dilation': 'Stretching stricture open',
    'Urethroplasty': 'Surgical repair of stricture',
    'Voiding dysfunction': 'How stricture rated - by urinary symptoms',
  },
};

// =============================================================================
// CHRONIC CYSTITIS - DC 7512
// =============================================================================
const CHRONIC_CYSTITIS_DESCRIPTION = {
  diagnosticCode: '7512',
  conditionName: 'Chronic Cystitis / Interstitial Cystitis',

  evidenceLookingFor: [
    'Diagnosis of chronic or interstitial cystitis',
    'Cystoscopy findings if performed',
    'Documentation of urinary symptoms',
    'Frequency of UTIs if recurrent',
    'Treatment history',
    'Bladder pain documentation',
    'Impact on quality of life',
    'Voiding diary',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Daytime voiding interval 2-3 hours, OR awakening 2 times/night',
      realWorld: 'Frequent urination but manageable.',
    },
    {
      percent: 20,
      meaning: 'Daytime voiding interval 1-2 hours, OR awakening 3-4 times/night',
      realWorld: 'Very frequent urination significantly affecting daily life.',
    },
    {
      percent: 40,
      meaning: 'Daytime voiding interval less than 1 hour, OR awakening 5+ times/night',
      realWorld: 'Severe urinary frequency dominating daily life.',
    },
    {
      percent: 60,
      meaning: 'Continual urine leakage or urinary diversion',
      realWorld: 'Constant symptoms or surgical urinary diversion.',
    },
  ],

  documentationTips: [
    'Keep a voiding diary: times and amounts',
    'Track daytime voiding frequency',
    'Count nighttime awakenings',
    'Document bladder pain',
    'Note UTI frequency if recurrent',
    'Record all treatments tried',
    'Track dietary triggers',
    'Document impact on work and sleep',
  ],

  keyTerms: {
    'Interstitial cystitis': 'Chronic bladder pain syndrome',
    'IC/BPS': 'Interstitial Cystitis/Bladder Pain Syndrome',
    'Hunner\'s lesions': 'Ulcers seen in some IC patients',
    'Voiding dysfunction': 'Basis for rating - urinary frequency and incontinence',
  },
};

// =============================================================================
// DEVIATED SEPTUM - DC 6502
// =============================================================================
const DEVIATED_SEPTUM_DESCRIPTION = {
  diagnosticCode: '6502',
  conditionName: 'Deviated Nasal Septum',

  evidenceLookingFor: [
    'Diagnosis of deviated septum',
    'Documentation of obstruction degree',
    'Imaging or exam findings',
    'Symptoms: breathing difficulty, congestion',
    'Treatment history: medical, surgical',
    'Associated conditions: sinusitis, sleep issues',
    'Impact on breathing and quality of life',
    'Surgical repair history if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Traumatic only, no obstruction',
      realWorld: 'Deviation present but not blocking airflow.',
    },
    {
      percent: 10,
      meaning: '50% obstruction of nasal passage on both sides OR complete obstruction on one side',
      realWorld: 'Significant nasal obstruction affecting breathing.',
    },
  ],

  documentationTips: [
    'Document degree of obstruction',
    'Note which side(s) affected',
    'Track breathing difficulties',
    'Record sleep disruption',
    'Document treatments tried',
    'Note if septoplasty performed',
    'Track associated sinusitis',
    'Document impact on exercise/activities',
  ],

  keyTerms: {
    'Deviated septum': 'Crooked cartilage dividing nasal passages',
    'Septoplasty': 'Surgery to straighten septum',
    'Nasal obstruction': 'Blockage affecting breathing',
    'Turbinate hypertrophy': 'Enlarged nasal structures often with deviated septum',
  },
};

// =============================================================================
// LARYNGITIS - DC 6516/6519/6520
// =============================================================================
const LARYNGITIS_DESCRIPTION = {
  diagnosticCode: '6516',
  conditionName: 'Laryngitis / Voice Disorders',

  evidenceLookingFor: [
    'Diagnosis of chronic laryngitis or voice disorder',
    'Laryngoscopy findings',
    'Documentation of hoarseness',
    'Evidence of vocal cord damage',
    'Treatment history',
    'Impact on speech and communication',
    'Cause: reflux, overuse, injury',
    'Current voice status',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Hoarseness with inflammation of cords or mucous membrane',
      realWorld: 'Chronic hoarseness from vocal cord inflammation.',
    },
    {
      percent: 30,
      meaning: 'Hoarseness with thickening or nodules of cords or mucous membrane',
      realWorld: 'Hoarseness with structural changes to vocal cords.',
    },
    {
      percent: 60,
      meaning: 'Aphonia (complete voice loss)',
      realWorld: 'Unable to speak above a whisper. Complete voice loss.',
    },
    {
      percent: 100,
      meaning: 'Constant inability to speak above whisper',
      realWorld: 'Permanent, total voice loss.',
    },
  ],

  documentationTips: [
    'Document voice quality changes',
    'Keep laryngoscopy reports',
    'Note triggers for hoarseness',
    'Track treatments: speech therapy, surgery',
    'Document impact on work if voice-dependent job',
    'Note underlying cause',
    'Record any vocal cord paralysis',
    'Track progression or improvement',
  ],

  keyTerms: {
    'Laryngitis': 'Inflammation of voice box',
    'Aphonia': 'Complete loss of voice',
    'Dysphonia': 'Difficulty producing voice/hoarseness',
    'Vocal cord nodules': 'Growths on vocal cords causing hoarseness',
    'Vocal cord paralysis': 'Nerve damage preventing cord movement',
  },
};

// ADD BEFORE IT:
// =============================================================================
// ANKLE CONDITIONS - DC 5270-5274
// =============================================================================
const ANKLE_DESCRIPTION = {
  diagnosticCode: '5271',
  conditionName: 'Ankle Conditions',

  evidenceLookingFor: [
    'Diagnosis of ankle condition',
    'Range of motion measurements',
    'Imaging: X-ray, MRI',
    'Evidence of instability if present',
    'Documentation of pain with motion',
    'Functional limitations',
    'Treatment history',
    'Impact on walking and standing',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Moderate limitation of motion',
      realWorld: 'Noticeable ankle stiffness affecting movement.',
    },
    {
      percent: 20,
      meaning: 'Marked limitation of motion',
      realWorld: 'Significant ankle limitation affecting walking and activities.',
    },
    {
      percent: 30,
      meaning: 'Ankylosis in plantar flexion less than 30 degrees',
      realWorld: 'Ankle fused or frozen in downward position.',
    },
    {
      percent: 40,
      meaning: 'Ankylosis in plantar flexion 30-40 degrees OR dorsiflexion 0-10 degrees',
      realWorld: 'Ankle fused in poor position affecting gait.',
    },
  ],

  documentationTips: [
    'Document range of motion: dorsiflexion and plantar flexion',
    'Note pain with motion',
    'Track instability episodes',
    'Document assistive device use',
    'Record impact on walking distance',
    'Note swelling patterns',
    'Track flare-ups',
    'Document work limitations',
  ],

  keyTerms: {
    'Dorsiflexion': 'Moving foot upward - normal about 20 degrees',
    'Plantar flexion': 'Pointing foot down - normal about 45 degrees',
    'Ankylosis': 'Joint fused or frozen',
    'Instability': 'Ankle gives way or feels loose',
  },
};

// =============================================================================
// FLATFOOT (PES PLANUS) - DC 5276
// =============================================================================
const FLATFOOT_DESCRIPTION = {
  diagnosticCode: '5276',
  conditionName: 'Flatfoot (Pes Planus)',

  evidenceLookingFor: [
    'Diagnosis of pes planus/flatfoot',
    'Documentation of bilateral vs unilateral',
    'Evidence of pain on manipulation',
    'Swelling documentation',
    'Callus formation',
    'Weight-bearing vs non-weight-bearing arch',
    'Treatment: orthotics, surgery',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Mild - symptoms relieved by built-up shoe or arch support',
      realWorld: 'Flatfoot controlled with shoe inserts.',
    },
    {
      percent: 10,
      meaning: 'Moderate - weight-bearing line over or medial to great toe, inward bowing of Achilles, pain on manipulation (bilateral)',
      realWorld: 'Visible deformity with pain. Orthotics help but don\'t eliminate symptoms.',
    },
    {
      percent: 30,
      meaning: 'Severe - objective evidence of marked deformity, accentuated pain on manipulation, swelling on use, characteristic callosities (bilateral)',
      realWorld: 'Significant deformity with constant pain, swelling, and calluses.',
    },
    {
      percent: 50,
      meaning: 'Pronounced - marked pronation, extreme tenderness, marked inward displacement, severe spasm of Achilles not improved by orthotics (bilateral)',
      realWorld: 'Severe flatfoot not helped by any conservative treatment.',
    },
  ],

  documentationTips: [
    'Document bilateral vs unilateral',
    'Note arch appearance weight-bearing vs non-weight-bearing',
    'Track pain on use and manipulation',
    'Document swelling patterns',
    'Note callus locations',
    'Record orthotic use and effectiveness',
    'Track walking limitations',
    'Document Achilles tendon alignment',
  ],

  keyTerms: {
    'Pes planus': 'Medical term for flatfoot',
    'Pronation': 'Foot rolling inward',
    'Weight-bearing line': 'Line from ankle showing foot alignment',
    'Characteristic callosities': 'Calluses in specific locations from flatfoot',
  },
};

// =============================================================================
// WEAK FOOT - DC 5277
// =============================================================================
const WEAK_FOOT_DESCRIPTION = {
  diagnosticCode: '5277',
  conditionName: 'Weak Foot',

  evidenceLookingFor: [
    'Diagnosis of weak foot condition',
    'Documentation of bilateral vs unilateral',
    'Evidence of muscle weakness',
    'Functional limitations',
    'Treatment history',
    'Impact on walking and standing',
    'Associated conditions',
    'Assistive device requirements',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Bilateral weak foot',
      realWorld: 'Weakness in both feet affecting function.',
    },
  ],

  documentationTips: [
    'Document weakness pattern',
    'Track impact on walking',
    'Note fatigue with standing',
    'Record shoe wear patterns',
    'Document assistive devices',
    'Track any falls',
    'Note underlying cause',
    'Record treatment response',
  ],

  keyTerms: {
    'Weak foot': 'Generalized foot weakness affecting function',
    'Bilateral': 'Both feet affected',
    'Muscle atrophy': 'Wasting of foot muscles',
  },
};

// =============================================================================
// CLAW FOOT (PES CAVUS) - DC 5278
// =============================================================================
const CLAW_FOOT_DESCRIPTION = {
  diagnosticCode: '5278',
  conditionName: 'Claw Foot (Pes Cavus)',

  evidenceLookingFor: [
    'Diagnosis of pes cavus/claw foot',
    'Documentation of toe deformities',
    'Evidence of high arch',
    'Painful callosities',
    'Dropped forefoot',
    'Shortened plantar fascia',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Great toe dorsiflexed, some limitation of dorsiflexion at ankle, definite tenderness under metatarsal heads (bilateral)',
      realWorld: 'High arch with toe changes and tenderness.',
    },
    {
      percent: 20,
      meaning: 'All toes tending to dorsiflexion, limitation of dorsiflexion at ankle, shortened plantar fascia, marked tenderness under metatarsal heads (bilateral)',
      realWorld: 'More significant deformity affecting all toes.',
    },
    {
      percent: 30,
      meaning: 'All toes hammer toes, very painful callosities, marked contraction of plantar fascia, dropped forefoot, all toes dorsiflexed (bilateral)',
      realWorld: 'Severe claw foot with painful calluses and significant deformity.',
    },
    {
      percent: 50,
      meaning: 'Marked contraction of plantar fascia with dropped forefoot, all toes hammer toes, very painful callosities, marked varus deformity (bilateral)',
      realWorld: 'Severe bilateral claw foot with major deformity.',
    },
  ],

  documentationTips: [
    'Document toe positions',
    'Note arch height',
    'Track callus locations and pain',
    'Document ankle motion',
    'Record plantar fascia tightness',
    'Note shoe fitting difficulties',
    'Track walking limitations',
    'Document treatment response',
  ],

  keyTerms: {
    'Pes cavus': 'High arched foot - opposite of flatfoot',
    'Hammer toes': 'Toes bent at middle joint',
    'Dropped forefoot': 'Front of foot lower than normal',
    'Varus deformity': 'Foot turned inward',
  },
};

// =============================================================================
// METATARSALGIA - DC 5279
// =============================================================================
const METATARSALGIA_DESCRIPTION = {
  diagnosticCode: '5279',
  conditionName: 'Metatarsalgia (Morton\'s Disease)',

  evidenceLookingFor: [
    'Diagnosis of metatarsalgia or Morton\'s neuroma',
    'Documentation of pain location',
    'Imaging if performed',
    'Evidence of neuroma if present',
    'Treatment history: orthotics, injections, surgery',
    'Impact on walking and standing',
    'Bilateral vs unilateral',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Metatarsalgia, anterior (Morton\'s disease), unilateral or bilateral',
      realWorld: 'Pain in ball of foot affecting walking.',
    },
  ],

  documentationTips: [
    'Document pain location precisely',
    'Track activities that worsen pain',
    'Note numbness or tingling',
    'Record orthotic use',
    'Document injection treatments',
    'Track surgical interventions',
    'Note shoe modifications needed',
    'Record impact on standing tolerance',
  ],

  keyTerms: {
    'Metatarsalgia': 'Pain in ball of foot (metatarsal area)',
    'Morton\'s neuroma': 'Nerve thickening between metatarsals',
    'Anterior metatarsalgia': 'Pain in front part of foot',
  },
};

// =============================================================================
// HALLUX VALGUS (BUNION) - DC 5280
// =============================================================================
const HALLUX_VALGUS_DESCRIPTION = {
  diagnosticCode: '5280',
  conditionName: 'Hallux Valgus (Bunion)',

  evidenceLookingFor: [
    'Diagnosis of hallux valgus',
    'X-ray showing degree of deviation',
    'Documentation of pain',
    'Evidence of surgical resection if performed',
    'Functional limitations',
    'Shoe fitting difficulties',
    'Treatment history',
    'Impact on walking',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Operated with resection of metatarsal head, OR severe if equivalent to amputation of great toe',
      realWorld: 'Bunion surgery removing part of bone, or severe bunion equivalent to losing toe function.',
    },
  ],

  documentationTips: [
    'Document angle of deviation on X-ray',
    'Track pain severity',
    'Note shoe fitting problems',
    'Record surgical procedures',
    'Document post-surgical status',
    'Track walking limitations',
    'Note any numbness',
    'Record impact on activities',
  ],

  keyTerms: {
    'Hallux valgus': 'Big toe angled toward other toes - bunion',
    'Bunion': 'Bony bump at base of big toe',
    'Metatarsal head resection': 'Surgery removing part of toe bone',
    'Bunionectomy': 'Bunion removal surgery',
  },
};

// =============================================================================
// HALLUX RIGIDUS - DC 5281
// =============================================================================
const HALLUX_RIGIDUS_DESCRIPTION = {
  diagnosticCode: '5281',
  conditionName: 'Hallux Rigidus (Stiff Big Toe)',

  evidenceLookingFor: [
    'Diagnosis of hallux rigidus',
    'Documentation of big toe stiffness',
    'Range of motion measurements',
    'X-ray showing arthritis',
    'Pain documentation',
    'Treatment history',
    'Impact on walking and push-off',
    'Surgical history if applicable',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Severe hallux rigidus, unilateral',
      realWorld: 'Severe stiffness of big toe affecting walking.',
    },
  ],

  documentationTips: [
    'Document range of motion of big toe',
    'Note pain with motion',
    'Track impact on walking gait',
    'Record treatments tried',
    'Document bone spur formation',
    'Note surgical interventions',
    'Track shoe modifications needed',
    'Record push-off difficulties',
  ],

  keyTerms: {
    'Hallux rigidus': 'Stiff big toe from arthritis',
    'Dorsiflexion': 'Bending toe upward - limited in hallux rigidus',
    'Cheilectomy': 'Surgery to remove bone spurs',
    'Fusion': 'Surgery to permanently stiffen joint',
  },
};

// =============================================================================
// HAMMER TOE - DC 5282
// =============================================================================
const HAMMER_TOE_DESCRIPTION = {
  diagnosticCode: '5282',
  conditionName: 'Hammer Toe',

  evidenceLookingFor: [
    'Diagnosis of hammer toe(s)',
    'Documentation of which toes affected',
    'Evidence of fixed vs flexible deformity',
    'Pain and callus documentation',
    'Treatment history',
    'Surgical history if applicable',
    'Impact on shoe fitting',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Single hammer toe',
      realWorld: 'One toe with hammer deformity - noncompensable unless causing other issues.',
    },
    {
      percent: 10,
      meaning: 'All toes unilateral without claw foot',
      realWorld: 'All toes on one foot have hammer deformity.',
    },
  ],

  documentationTips: [
    'Document which toes affected',
    'Note if deformity is fixed or flexible',
    'Track callus formation',
    'Record pain levels',
    'Document shoe fitting issues',
    'Note surgical repairs',
    'Track walking impact',
    'Record corn formation',
  ],

  keyTerms: {
    'Hammer toe': 'Toe bent at middle joint',
    'Mallet toe': 'Toe bent at end joint',
    'Claw toe': 'Toe bent at both joints',
    'Fixed deformity': 'Cannot be straightened',
    'Flexible deformity': 'Can be manually straightened',
  },
};

// =============================================================================
// MALUNION/NONUNION TARSAL/METATARSAL - DC 5283
// =============================================================================
const MALUNION_TARSAL_DESCRIPTION = {
  diagnosticCode: '5283',
  conditionName: 'Malunion/Nonunion of Tarsal or Metatarsal Bones',

  evidenceLookingFor: [
    'History of tarsal or metatarsal fracture',
    'X-ray showing malunion or nonunion',
    'Documentation of pain and deformity',
    'Impact on weight bearing',
    'Treatment history',
    'Surgical interventions if any',
    'Functional limitations',
    'Assistive device requirements',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Moderate malunion or nonunion',
      realWorld: 'Moderate deformity or non-healing fracture affecting foot function.',
    },
    {
      percent: 20,
      meaning: 'Moderately severe malunion or nonunion',
      realWorld: 'More significant deformity or non-healing causing notable disability.',
    },
    {
      percent: 30,
      meaning: 'Severe malunion or nonunion',
      realWorld: 'Severe deformity or non-healing with major impact on function.',
    },
  ],

  documentationTips: [
    'Keep X-rays showing malunion/nonunion',
    'Document original fracture',
    'Track pain with weight bearing',
    'Note deformity visible',
    'Record gait abnormalities',
    'Document surgical attempts',
    'Track assistive device use',
    'Note impact on activities',
  ],

  keyTerms: {
    'Malunion': 'Bone healed in wrong position',
    'Nonunion': 'Bone failed to heal together',
    'Tarsal bones': 'Bones of hindfoot and midfoot',
    'Metatarsal bones': 'Long bones of forefoot',
  },
};

// =============================================================================
// ELBOW CONDITIONS - DC 5206-5212
// =============================================================================
const ELBOW_DESCRIPTION = {
  diagnosticCode: '5206',
  conditionName: 'Elbow Conditions',

  evidenceLookingFor: [
    'Diagnosis of elbow condition',
    'Range of motion: flexion and extension',
    'Documentation of dominant vs non-dominant arm',
    'Imaging results',
    'Evidence of instability',
    'Pain documentation',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Flexion limited to 110 degrees',
      realWorld: 'Minor flexion limitation.',
    },
    {
      percent: 10,
      meaning: 'Flexion limited to 100 degrees, OR extension limited to 45-60 degrees',
      realWorld: 'Mild elbow limitation.',
    },
    {
      percent: 20,
      meaning: 'Flexion limited to 90 degrees (major), OR extension limited to 75 degrees',
      realWorld: 'Moderate elbow limitation affecting function.',
    },
    {
      percent: 30,
      meaning: 'Flexion limited to 70 degrees (major), OR extension limited to 90 degrees',
      realWorld: 'Significant elbow limitation.',
    },
    {
      percent: 40,
      meaning: 'Flexion limited to 55 degrees (major), OR extension limited to 100 degrees',
      realWorld: 'Severe elbow limitation.',
    },
    {
      percent: 50,
      meaning: 'Flexion limited to 45 degrees (major), OR extension limited to 110 degrees',
      realWorld: 'Very severe limitation - elbow nearly straight or nearly fixed bent.',
    },
  ],

  documentationTips: [
    'Document flexion and extension in degrees',
    'Note which arm is dominant',
    'Track pain with motion',
    'Document pronation/supination if affected',
    'Record treatments tried',
    'Note surgical history',
    'Track impact on daily activities',
    'Document carrying limitations',
  ],

  keyTerms: {
    'Flexion': 'Bending elbow - normal about 145 degrees',
    'Extension': 'Straightening elbow - normal 0 degrees',
    'Major extremity': 'Dominant arm - rated higher',
    'Minor extremity': 'Non-dominant arm',
    'Ankylosis': 'Elbow fused/frozen',
  },
};

// =============================================================================
// WRIST CONDITIONS - DC 5213-5215
// =============================================================================
const WRIST_DESCRIPTION = {
  diagnosticCode: '5215',
  conditionName: 'Wrist Conditions',

  evidenceLookingFor: [
    'Diagnosis of wrist condition',
    'Range of motion measurements',
    'Documentation of dominant vs non-dominant',
    'Imaging results',
    'Pain documentation',
    'Grip strength if affected',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Dorsiflexion less than 15 degrees, OR palmar flexion limited in line with forearm',
      realWorld: 'Limited wrist motion affecting hand use.',
    },
    {
      percent: 20,
      meaning: 'Ankylosis favorable angle (20-30 degrees dorsiflexion) - minor hand',
      realWorld: 'Wrist fused in functional position (non-dominant).',
    },
    {
      percent: 30,
      meaning: 'Ankylosis favorable angle - major hand, OR unfavorable any other position - minor hand',
      realWorld: 'Wrist fused (dominant), or fused in poor position (non-dominant).',
    },
    {
      percent: 40,
      meaning: 'Ankylosis unfavorable - major hand',
      realWorld: 'Wrist fused in poor position (dominant hand).',
    },
  ],

  documentationTips: [
    'Document dorsiflexion and palmar flexion',
    'Note radial and ulnar deviation',
    'Record which hand is dominant',
    'Track grip strength',
    'Document pain with motion',
    'Note surgical history',
    'Track impact on daily tasks',
    'Record fine motor difficulties',
  ],

  keyTerms: {
    'Dorsiflexion': 'Bending wrist back - normal about 70 degrees',
    'Palmar flexion': 'Bending wrist forward - normal about 80 degrees',
    'Ankylosis': 'Wrist fused/frozen',
    'Favorable angle': 'Fused in position that allows some hand function',
  },
};

// =============================================================================
// FINGER CONDITIONS - DC 5216-5227
// =============================================================================
const FINGER_DESCRIPTION = {
  diagnosticCode: '5226',
  conditionName: 'Finger Conditions (Ankylosis)',

  evidenceLookingFor: [
    'Diagnosis of finger condition',
    'Which finger(s) affected',
    'Documentation of dominant vs non-dominant hand',
    'Range of motion of affected fingers',
    'Evidence of ankylosis if present',
    'Imaging results',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Ankylosis of index, long, ring, or little finger (various positions)',
      realWorld: 'One finger fused/frozen affecting hand function.',
    },
    {
      percent: 20,
      meaning: 'Ankylosis of two fingers (various combinations)',
      realWorld: 'Two fingers fused affecting grip.',
    },
    {
      percent: 30,
      meaning: 'Ankylosis of three fingers (various combinations) - minor hand',
      realWorld: 'Three fingers fused - significant hand impairment.',
    },
    {
      percent: 40,
      meaning: 'Ankylosis of four fingers - minor hand',
      realWorld: 'Four fingers fused - major hand impairment.',
    },
  ],

  documentationTips: [
    'Document which fingers affected',
    'Note dominant vs non-dominant hand',
    'Record range of motion each joint',
    'Track grip strength',
    'Document pain levels',
    'Note triggering if present',
    'Record surgical history',
    'Track impact on daily tasks',
  ],

  keyTerms: {
    'Ankylosis': 'Joint fused/frozen in position',
    'Favorable position': 'Fused in useful position for function',
    'Unfavorable position': 'Fused in position limiting function',
    'MCP, PIP, DIP': 'The three joints of each finger',
  },
};

// =============================================================================
// THUMB CONDITIONS - DC 5228
// =============================================================================
const THUMB_DESCRIPTION = {
  diagnosticCode: '5228',
  conditionName: 'Thumb Conditions',

  evidenceLookingFor: [
    'Diagnosis of thumb condition',
    'Documentation of dominant vs non-dominant hand',
    'Range of motion measurements',
    'Gap between thumb and fingers',
    'Imaging results',
    'Treatment history',
    'Impact on grip and pinch',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Limitation of motion with gap of 1-2 inches between thumb pad and fingers',
      realWorld: 'Can\'t fully close thumb to fingers - affects pinch grip.',
    },
    {
      percent: 20,
      meaning: 'Limitation of motion with gap of more than 2 inches between thumb pad and fingers',
      realWorld: 'Significant limitation - major impact on grip and pinch.',
    },
  ],

  documentationTips: [
    'Measure gap between thumb and fingers',
    'Document which hand is dominant',
    'Track opposition ability',
    'Record pinch strength',
    'Note pain with use',
    'Document treatments tried',
    'Track impact on daily tasks',
    'Note surgical history',
  ],

  keyTerms: {
    'Opposition': 'Touching thumb to fingertips - key thumb function',
    'Thenar muscles': 'Muscles at base of thumb',
    'CMC joint': 'Carpometacarpal joint - base of thumb',
    'Gap measurement': 'Distance thumb pad can\'t reach fingers',
  },
};

// =============================================================================
// FINGER LIMITATION OF MOTION - DC 5229-5230
// =============================================================================
const FINGER_LIMITATION_DESCRIPTION = {
  diagnosticCode: '5229',
  conditionName: 'Finger Limitation of Motion',

  evidenceLookingFor: [
    'Diagnosis of finger condition',
    'Which finger(s) affected',
    'Range of motion measurements',
    'Gap between fingertip and palm',
    'Documentation of dominant hand',
    'Pain documentation',
    'Treatment history',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Index or long finger: gap less than 1 inch',
      realWorld: 'Minor limitation of index or middle finger.',
    },
    {
      percent: 10,
      meaning: 'Index or long finger: gap of 1 inch or more',
      realWorld: 'Can\'t fully close index or middle finger to palm.',
    },
    {
      percent: 0,
      meaning: 'Ring or little finger: any limitation',
      realWorld: 'Ring/pinky limitation is noncompensable unless severe.',
    },
  ],

  documentationTips: [
    'Measure gap from fingertip to palm crease',
    'Document each joint range of motion',
    'Note which fingers affected',
    'Record dominant hand',
    'Track pain with motion',
    'Document triggering if present',
    'Note grip limitations',
    'Record impact on daily activities',
  ],

  keyTerms: {
    'Gap measurement': 'Distance fingertip can\'t reach palm',
    'Flexion': 'Bending finger to make fist',
    'Extension': 'Straightening finger',
    'Trigger finger': 'Finger catching/locking with motion',
  },
};

// =============================================================================
// MAXILLA MALUNION - DC 9900
// =============================================================================
const MAXILLA_MALUNION_DESCRIPTION = {
  diagnosticCode: '9900',
  conditionName: 'Maxilla Malunion/Nonunion',

  evidenceLookingFor: [
    'History of maxillary fracture',
    'Imaging showing malunion or nonunion',
    'Documentation of displacement',
    'Impact on bite/occlusion',
    'Facial deformity if present',
    'Treatment history',
    'Impact on eating',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Slight displacement',
      realWorld: 'Minor malunion not affecting function.',
    },
    {
      percent: 10,
      meaning: 'Moderate displacement',
      realWorld: 'Noticeable malunion affecting bite.',
    },
    {
      percent: 30,
      meaning: 'Severe displacement',
      realWorld: 'Significant malunion causing major functional problems.',
    },
  ],

  documentationTips: [
    'Keep imaging showing malunion',
    'Document bite problems',
    'Note facial asymmetry',
    'Track eating difficulties',
    'Record dental impacts',
    'Document surgical history',
    'Note speech effects if any',
    'Track pain levels',
  ],

  keyTerms: {
    'Maxilla': 'Upper jaw bone',
    'Malunion': 'Healed in wrong position',
    'Malocclusion': 'Bite doesn\'t align properly',
    'Displacement': 'Degree bone is out of position',
  },
};

// =============================================================================
// MANDIBLE MALUNION/NONUNION - DC 9901-9909
// =============================================================================
const MANDIBLE_MALUNION_DESCRIPTION = {
  diagnosticCode: '9901',
  conditionName: 'Mandible Malunion',

  evidenceLookingFor: [
    'History of mandibular fracture',
    'Imaging showing malunion',
    'Documentation of displacement degree',
    'Impact on bite/occlusion',
    'TMJ involvement if present',
    'Treatment history',
    'Impact on eating and speaking',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Slight displacement',
      realWorld: 'Minor malunion without significant functional impact.',
    },
    {
      percent: 10,
      meaning: 'Moderate displacement',
      realWorld: 'Noticeable malunion affecting jaw function.',
    },
    {
      percent: 20,
      meaning: 'Severe displacement',
      realWorld: 'Significant malunion causing major problems.',
    },
  ],

  documentationTips: [
    'Keep imaging of malunion',
    'Document bite alignment',
    'Note jaw opening limitations',
    'Track eating difficulties',
    'Record speech problems',
    'Document surgical history',
    'Note TMJ symptoms',
    'Track pain levels',
  ],

  keyTerms: {
    'Mandible': 'Lower jaw bone',
    'Malunion': 'Healed in wrong position',
    'Motion loss': 'Often rated separately under TMJ criteria',
  },
};

// =============================================================================
// MANDIBLE NONUNION - DC 9906-9909
// =============================================================================
const MANDIBLE_NONUNION_DESCRIPTION = {
  diagnosticCode: '9906',
  conditionName: 'Mandible Nonunion',

  evidenceLookingFor: [
    'History of mandibular fracture',
    'Imaging showing nonunion',
    'Evidence of bone loss if present',
    'Documentation of instability',
    'Treatment history',
    'Surgical attempts at repair',
    'Impact on eating and speaking',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Nonunion without bone loss',
      realWorld: 'Jaw fracture didn\'t heal but bone present.',
    },
    {
      percent: 50,
      meaning: 'Nonunion with bone loss requiring plate/prosthesis',
      realWorld: 'Nonunion with bone missing - needs hardware.',
    },
    {
      percent: 70,
      meaning: 'Severe nonunion with bone loss',
      realWorld: 'Severe nonunion with significant bone loss.',
    },
    {
      percent: 100,
      meaning: 'Nonunion with severe bone loss not correctable',
      realWorld: 'Total jaw instability that cannot be surgically fixed.',
    },
  ],

  documentationTips: [
    'Document nonunion on imaging',
    'Note bone loss if present',
    'Track jaw stability',
    'Record surgical repairs attempted',
    'Document eating limitations',
    'Note speech difficulties',
    'Track prosthesis/hardware if present',
    'Record functional status',
  ],

  keyTerms: {
    'Nonunion': 'Fracture failed to heal',
    'Bone loss': 'Missing bone segment',
    'Pseudoarthrosis': 'False joint at fracture site',
  },
};

// =============================================================================
// HARD PALATE LOSS - DC 9911-9912
// =============================================================================
const HARD_PALATE_DESCRIPTION = {
  diagnosticCode: '9911',
  conditionName: 'Hard Palate Loss',

  evidenceLookingFor: [
    'Documentation of palate loss',
    'Cause: trauma, surgery, disease',
    'Size of defect',
    'Impact on speech',
    'Impact on eating',
    'Prosthesis use if applicable',
    'Treatment history',
    'Current functional status',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Loss of half or more of hard palate',
      realWorld: 'Significant palate loss affecting speech and eating.',
    },
  ],

  documentationTips: [
    'Document size of defect',
    'Note cause of loss',
    'Track speech difficulties',
    'Record eating/drinking problems',
    'Document prosthesis use',
    'Note nasal regurgitation',
    'Track surgical repairs',
    'Record quality of life impact',
  ],

  keyTerms: {
    'Hard palate': 'Bony roof of mouth',
    'Oronasal fistula': 'Opening between mouth and nose',
    'Obturator': 'Prosthesis to cover palate defect',
    'Velopharyngeal insufficiency': 'Air escaping through nose during speech',
  },
};

// =============================================================================
// BENIGN ORAL NEOPLASM - DC 9914
// =============================================================================
const BENIGN_NEOPLASM_DESCRIPTION = {
  diagnosticCode: '9914',
  conditionName: 'Benign Oral Neoplasm',

  evidenceLookingFor: [
    'Diagnosis of benign oral tumor',
    'Biopsy results',
    'Location and size',
    'Treatment history: surgery, radiation',
    'Residual effects',
    'Impact on speech or eating',
    'Recurrence if any',
    'Current status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on residuals - impairment of mastication, speech, etc.',
      realWorld: 'Rate any lasting effects on chewing, speaking, or appearance.',
    },
  ],

  documentationTips: [
    'Keep biopsy showing benign',
    'Document surgical treatment',
    'Note residual defects',
    'Track speech changes',
    'Record eating difficulties',
    'Document disfigurement if any',
    'Note recurrence',
    'Track follow-up care',
  ],

  keyTerms: {
    'Benign neoplasm': 'Non-cancerous tumor',
    'Residuals': 'Lasting effects after treatment',
    'Rate by analogy': 'Rate based on similar listed conditions',
  },
};

// =============================================================================
// MALIGNANT ORAL NEOPLASM - DC 9915
// =============================================================================
const MALIGNANT_NEOPLASM_DESCRIPTION = {
  diagnosticCode: '9915',
  conditionName: 'Malignant Oral Neoplasm (Oral Cancer)',

  evidenceLookingFor: [
    'Diagnosis of oral cancer',
    'Biopsy and staging',
    'Treatment: surgery, radiation, chemotherapy',
    'Current disease status',
    'Residual effects',
    'Impact on speech, eating, appearance',
    'Reconstructive surgery if performed',
    'Follow-up documentation',
  ],

  ratingLevelMeanings: [
    {
      percent: 100,
      meaning: 'Active malignancy or during treatment',
      realWorld: 'Active oral cancer or undergoing treatment.',
    },
    {
      percent: 0,
      meaning: 'In remission - rate residuals',
      realWorld: 'After successful treatment, rate lasting effects.',
    },
  ],

  documentationTips: [
    'Keep all pathology reports',
    'Document staging',
    'Track treatment received',
    'Note remission status',
    'Document residual defects',
    'Record speech difficulties',
    'Note eating limitations',
    'Track reconstructive procedures',
  ],

  keyTerms: {
    'Malignant neoplasm': 'Cancer',
    'Staging': 'How advanced the cancer is',
    'Remission': 'No evidence of active cancer',
    'Residuals': 'Lasting effects - disfigurement, speech problems, etc.',
  },
};

// =============================================================================
// BLADDER INJURY - DC 7517
// =============================================================================
const BLADDER_INJURY_DESCRIPTION = {
  diagnosticCode: '7517',
  conditionName: 'Bladder Injury Residuals',

  evidenceLookingFor: [
    'History of bladder injury or surgery',
    'Documentation of residual symptoms',
    'Voiding dysfunction if present',
    'Incontinence documentation',
    'Treatment requirements',
    'Impact on daily activities',
    'Urological evaluations',
    'Current bladder function',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate as voiding dysfunction',
      realWorld: 'Bladder injury residuals rated based on urinary frequency or incontinence.',
    },
  ],

  documentationTips: [
    'Document original injury',
    'Track voiding frequency',
    'Note incontinence episodes',
    'Record pad usage if needed',
    'Document surgical repairs',
    'Track catheter use if applicable',
    'Note impact on activities',
    'Keep urological records',
  ],

  keyTerms: {
    'Voiding dysfunction': 'Basis for rating bladder injury residuals',
    'Neurogenic bladder': 'Nerve damage affecting bladder control',
    'Cystectomy': 'Bladder removal - rated higher',
  },
};

// =============================================================================
// URETHRAL FISTULA - DC 7520
// =============================================================================
const URETHRAL_FISTULA_DESCRIPTION = {
  diagnosticCode: '7520',
  conditionName: 'Urethral Fistula',

  evidenceLookingFor: [
    'Diagnosis of urethral fistula',
    'Location and size of fistula',
    'Documentation of urinary leakage',
    'Treatment history',
    'Surgical repairs attempted',
    'Current status',
    'Impact on urination',
    'Skin care requirements',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Urethral fistula requiring use of appliance or diaper',
      realWorld: 'Fistula causing leakage needing protective garments.',
    },
  ],

  documentationTips: [
    'Document fistula location',
    'Track leakage severity',
    'Note appliance/diaper use',
    'Record surgical repairs',
    'Document skin breakdown if present',
    'Track impact on activities',
    'Note hygiene requirements',
    'Keep surgical records',
  ],

  keyTerms: {
    'Urethral fistula': 'Abnormal opening from urethra to skin or other structure',
    'Urethrocutaneous fistula': 'Opening from urethra to skin',
    'Appliance': 'Collection device for urine',
  },
};

// =============================================================================
// CHRONIC EPIDIDYMITIS - DC 7525
// =============================================================================
const CHRONIC_EPIDIDYMITIS_DESCRIPTION = {
  diagnosticCode: '7525',
  conditionName: 'Chronic Epididymitis',

  evidenceLookingFor: [
    'Diagnosis of chronic epididymitis',
    'Documentation of recurrent episodes',
    'Evidence of chronic pain',
    'Treatment history',
    'Impact on daily activities',
    'Urological evaluations',
    'Cause if identified',
    'Current symptom status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate as urinary tract infection - 10% rating',
      realWorld: 'Chronic epididymitis rated by analogy to UTI at 10%.',
    },
  ],

  documentationTips: [
    'Track episodes: frequency, duration',
    'Document pain levels',
    'Note swelling and tenderness',
    'Record antibiotic courses',
    'Track impact on work/activities',
    'Document any surgeries',
    'Note underlying cause if found',
    'Keep urological records',
  ],

  keyTerms: {
    'Epididymitis': 'Inflammation of epididymis (tube behind testicle)',
    'Chronic': 'Lasting more than 6 weeks or recurring',
    'Orchitis': 'Testicular inflammation - may occur with epididymitis',
  },
};

// =============================================================================
// URINARY TRACT INFECTION (CHRONIC) - DC 7529
// =============================================================================
const URINARY_TRACT_INFECTION_DESCRIPTION = {
  diagnosticCode: '7529',
  conditionName: 'Chronic Urinary Tract Infection',

  evidenceLookingFor: [
    'Documentation of recurrent UTIs',
    'Urine culture results',
    'Frequency of infections',
    'Treatment requirements',
    'Prophylactic antibiotic use',
    'Underlying cause if identified',
    'Impact on daily life',
    'Complications if any',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Recurrent symptomatic infection requiring drainage/frequent hospitalization (greater than 2x yearly), and/or continuous intensive management',
      realWorld: 'Frequent UTIs requiring significant medical intervention.',
    },
    {
      percent: 30,
      meaning: 'Recurrent symptomatic infection requiring drainage/frequent hospitalization (greater than 2x yearly), and/or continuous intensive management, with poor renal function',
      realWorld: 'Frequent UTIs plus kidney function decline.',
    },
  ],

  documentationTips: [
    'Track every UTI: date, culture results, treatment',
    'Document hospitalizations',
    'Note prophylactic antibiotics if used',
    'Record catheter use if applicable',
    'Track kidney function tests',
    'Document underlying cause',
    'Note antibiotic resistance patterns',
    'Keep all urology records',
  ],

  keyTerms: {
    'Recurrent UTI': 'Two or more infections in 6 months, or 3+ in a year',
    'Prophylactic antibiotics': 'Daily low-dose antibiotics to prevent infections',
    'Complicated UTI': 'UTI with structural abnormality or other factors',
  },
};

// =============================================================================
// SACROILIAC CONDITIONS - DC 5293/5294
// =============================================================================
const SACROILIAC_DESCRIPTION = {
  diagnosticCode: '5294',
  conditionName: 'Sacroiliac Injury/Weakness',

  evidenceLookingFor: [
    'Diagnosis of sacroiliac joint dysfunction',
    'Imaging showing SI joint abnormality',
    'Documentation of pain pattern',
    'Physical exam findings',
    'Treatment history',
    'Impact on sitting, standing, walking',
    'Response to SI joint injections',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate under lumbosacral strain criteria (DC 5237)',
      realWorld: 'SI joint conditions rated using spine rating criteria.',
    },
  ],

  documentationTips: [
    'Document SI joint pain location',
    'Note aggravating activities',
    'Track response to injections',
    'Record physical therapy',
    'Document sitting/standing tolerance',
    'Note sleep disruption',
    'Track medication use',
    'Keep imaging records',
  ],

  keyTerms: {
    'Sacroiliac joint': 'Joint connecting spine to pelvis',
    'SI joint dysfunction': 'Abnormal movement or inflammation of SI joint',
    'Sacroiliitis': 'Inflammation of SI joint',
    'Rate under spine criteria': 'Uses same rating schedule as low back',
  },
};

// =============================================================================
// NOSE/PHARYNX LOSS - DC 6504
// =============================================================================
const NOSE_LOSS_DESCRIPTION = {
  diagnosticCode: '6504',
  conditionName: 'Nose Loss (Partial or Total)',

  evidenceLookingFor: [
    'Documentation of nose loss',
    'Cause: trauma, surgery, disease',
    'Extent of loss',
    'Impact on breathing',
    'Disfigurement documentation',
    'Prosthesis use if applicable',
    'Treatment history',
    'Photographs',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Loss of part of nose exposing both nasal passages',
      realWorld: 'Significant nose loss with both passages visible.',
    },
    {
      percent: 50,
      meaning: 'Loss of nose',
      realWorld: 'Complete or near-complete loss of nose.',
    },
  ],

  documentationTips: [
    'Document extent of loss',
    'Take photographs',
    'Note breathing difficulties',
    'Record prosthesis use',
    'Document cause of loss',
    'Track reconstructive surgeries',
    'Note disfigurement impact',
    'Record quality of life effects',
  ],

  keyTerms: {
    'Nasal prosthesis': 'Artificial nose',
    'Rhinectomy': 'Surgical removal of nose',
    'Disfigurement': 'Also rated under DC 7800 if applicable',
  },
};

// =============================================================================
// LARYNX STENOSIS - DC 6516
// =============================================================================
const LARYNX_STENOSIS_DESCRIPTION = {
  diagnosticCode: '6516',
  conditionName: 'Larynx Stenosis',

  evidenceLookingFor: [
    'Diagnosis of laryngeal stenosis',
    'Laryngoscopy showing narrowing',
    'Documentation of breathing difficulty',
    'Voice changes',
    'Cause: intubation, trauma, surgery',
    'Treatment history',
    'Tracheostomy if required',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'FEV-1 of 71-80% predicted, OR FEV-1/FVC of 71-80%',
      realWorld: 'Mild stenosis with some airflow limitation.',
    },
    {
      percent: 30,
      meaning: 'FEV-1 of 56-70% predicted, OR FEV-1/FVC of 56-70%',
      realWorld: 'Moderate stenosis affecting breathing.',
    },
    {
      percent: 60,
      meaning: 'FEV-1 of 40-55% predicted, OR FEV-1/FVC of 40-55%',
      realWorld: 'Severe stenosis with significant breathing difficulty.',
    },
    {
      percent: 100,
      meaning: 'FEV-1 less than 40%, OR permanent tracheostomy',
      realWorld: 'Very severe stenosis or permanent breathing tube.',
    },
  ],

  documentationTips: [
    'Keep laryngoscopy reports',
    'Document pulmonary function tests',
    'Track breathing difficulties',
    'Note voice changes',
    'Record dilations or surgeries',
    'Document tracheostomy if present',
    'Track exercise tolerance',
    'Note stridor or noisy breathing',
  ],

  keyTerms: {
    'Laryngeal stenosis': 'Narrowing of voice box/airway',
    'Subglottic stenosis': 'Narrowing below vocal cords',
    'Tracheostomy': 'Breathing tube through neck',
    'Stridor': 'Noisy breathing from narrowed airway',
  },
};

// =============================================================================
// APHONIA - DC 6519
// =============================================================================
const APHONIA_DESCRIPTION = {
  diagnosticCode: '6519',
  conditionName: 'Aphonia (Complete Voice Loss)',

  evidenceLookingFor: [
    'Diagnosis of aphonia',
    'Laryngoscopy findings',
    'Cause of voice loss',
    'Duration of aphonia',
    'Treatment attempts',
    'Impact on communication',
    'Work limitations',
    'Current voice status',
  ],

  ratingLevelMeanings: [
    {
      percent: 60,
      meaning: 'Constant inability to speak above a whisper',
      realWorld: 'Unable to produce voice - can only whisper.',
    },
    {
      percent: 100,
      meaning: 'Constant inability to communicate by speech',
      realWorld: 'Complete inability to speak at all.',
    },
  ],

  documentationTips: [
    'Document cause of aphonia',
    'Keep laryngoscopy reports',
    'Note duration of voice loss',
    'Track treatments tried',
    'Document impact on work',
    'Note alternative communication methods',
    'Record speech therapy attempts',
    'Track any voice recovery',
  ],

  keyTerms: {
    'Aphonia': 'Complete loss of voice',
    'Dysphonia': 'Partial voice impairment - hoarseness',
    'Vocal cord paralysis': 'Common cause of aphonia',
    'Laryngectomy': 'Voice box removal - causes aphonia',
  },
};

// =============================================================================
// CHRONIC PHARYNGITIS - DC 6521
// =============================================================================
const PHARYNGITIS_DESCRIPTION = {
  diagnosticCode: '6521',
  conditionName: 'Chronic Pharyngitis',

  evidenceLookingFor: [
    'Diagnosis of chronic pharyngitis',
    'Documentation of persistent symptoms',
    'Examination findings',
    'Treatment history',
    'Underlying cause if identified',
    'Impact on swallowing',
    'Duration of condition',
    'Current symptom status',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Rate based on symptoms - usually noncompensable',
      realWorld: 'Chronic sore throat typically rated 0% unless causing other problems.',
    },
  ],

  documentationTips: [
    'Document duration of symptoms',
    'Track sore throat frequency',
    'Note swallowing difficulties',
    'Record treatments tried',
    'Document underlying cause',
    'Note reflux if contributing',
    'Track throat cultures',
    'Record ENT evaluations',
  ],

  keyTerms: {
    'Pharyngitis': 'Inflammation of throat/pharynx',
    'Chronic': 'Lasting more than 3 months',
    'Laryngopharyngeal reflux': 'Acid reflux affecting throat',
    'Post-nasal drip': 'Common cause of chronic pharyngitis',
  },
};

// ADD BEFORE IT:
// =============================================================================
// HYPERALDOSTERONISM - DC 7909
// =============================================================================
const HYPERALDOSTERONISM_DESCRIPTION = {
  diagnosticCode: '7909',
  conditionName: 'Hyperaldosteronism',

  evidenceLookingFor: [
    'Diagnosis of primary or secondary hyperaldosteronism',
    'Aldosterone and renin levels',
    'Documentation of hypertension',
    'Potassium levels (hypokalemia)',
    'Imaging: CT/MRI of adrenal glands',
    'Treatment: medications, surgery',
    'Evidence of adrenal adenoma if present',
    'Impact on blood pressure control',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Requiring continuous medication for control',
      realWorld: 'Hyperaldosteronism managed with ongoing medication.',
    },
    {
      percent: 60,
      meaning: 'Requiring medication and with episodic symptoms',
      realWorld: 'Despite medication, experiencing breakthrough symptoms.',
    },
    {
      percent: 100,
      meaning: 'Crisis episodes or poor control despite treatment',
      realWorld: 'Severe hyperaldosteronism with uncontrolled symptoms.',
    },
  ],

  documentationTips: [
    'Keep aldosterone and renin level results',
    'Track potassium levels',
    'Document blood pressure readings',
    'Record all medications',
    'Keep imaging of adrenal glands',
    'Note surgical history if applicable',
    'Track symptoms: muscle weakness, fatigue',
    'Document medication adjustments',
  ],

  keyTerms: {
    'Primary hyperaldosteronism': 'Conn\'s syndrome - adrenal gland overproducing aldosterone',
    'Secondary hyperaldosteronism': 'Overproduction due to another condition',
    'Aldosterone': 'Hormone regulating sodium and potassium',
    'Hypokalemia': 'Low potassium - common finding',
    'Adrenal adenoma': 'Benign tumor often causing primary hyperaldosteronism',
  },
};

// =============================================================================
// POSTGASTRECTOMY SYNDROME - DC 7310/7311
// =============================================================================
const POSTGASTRECTOMY_DESCRIPTION = {
  diagnosticCode: '7310',
  conditionName: 'Postgastrectomy Syndrome',

  evidenceLookingFor: [
    'History of gastrectomy or gastric surgery',
    'Documentation of dumping syndrome symptoms',
    'Evidence of malnutrition or weight loss',
    'Diarrhea documentation',
    'Hypoglycemic episodes',
    'Dietary modifications required',
    'Vitamin/mineral deficiencies',
    'Impact on eating and nutrition',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'Mild - infrequent episodes of epigastric distress with characteristic mild circulatory symptoms, OR continuous mild symptoms',
      realWorld: 'Occasional symptoms after eating. Mild dumping syndrome.',
    },
    {
      percent: 40,
      meaning: 'Moderate - less frequent episodes of epigastric distress with nausea, sweating, circulatory disturbance after meals but with diarrhea and weight loss',
      realWorld: 'Regular symptoms after eating with weight loss and diarrhea.',
    },
    {
      percent: 60,
      meaning: 'Severe - associated with nausea, sweating, circulatory disturbance after meals, diarrhea, hypoglycemic symptoms, and weight loss with malnutrition and anemia',
      realWorld: 'Severe symptoms including low blood sugar episodes, significant weight loss, and anemia.',
    },
  ],

  documentationTips: [
    'Document original gastric surgery',
    'Track symptoms after eating: timing, severity',
    'Note dumping episodes',
    'Record weight changes',
    'Document diarrhea frequency',
    'Track hypoglycemic episodes',
    'Keep lab results: hemoglobin, B12, iron',
    'Note dietary modifications needed',
  ],

  keyTerms: {
    'Dumping syndrome': 'Rapid gastric emptying causing symptoms after eating',
    'Early dumping': 'Symptoms within 30 minutes of eating',
    'Late dumping': 'Hypoglycemia 1-3 hours after eating',
    'Gastrectomy': 'Surgical removal of part or all of stomach',
    'Malabsorption': 'Poor nutrient absorption after gastric surgery',
  },
};

// =============================================================================
// MULTI-JOINT ARTHRITIS - DC 5002 (Enhanced description)
// =============================================================================
const MULTI_JOINT_ARTHRITIS_DESCRIPTION = {
  diagnosticCode: '5002',
  conditionName: 'Multi-Joint Arthritis (Rheumatoid/Inflammatory)',

  evidenceLookingFor: [
    'Diagnosis of rheumatoid or inflammatory arthritis',
    'Documentation of joints affected',
    'Rheumatoid factor and anti-CCP antibody results',
    'Inflammatory markers: ESR, CRP',
    'X-rays showing joint damage',
    'Treatment history: DMARDs, biologics',
    'Evidence of systemic symptoms',
    'Functional limitations',
  ],

  ratingLevelMeanings: [
    {
      percent: 20,
      meaning: 'One or two exacerbations a year in a well-established diagnosis',
      realWorld: 'Occasional flares, generally well-controlled.',
    },
    {
      percent: 40,
      meaning: 'Symptom combinations productive of definite impairment of health, OR 3+ incapacitating exacerbations yearly',
      realWorld: 'Regular flares affecting overall health. Multiple incapacitating episodes.',
    },
    {
      percent: 60,
      meaning: 'Weight loss and anemia with severely incapacitating exacerbations 4+ times yearly, OR lesser number over prolonged periods',
      realWorld: 'Severe disease with weight loss, anemia, and frequent major flares.',
    },
    {
      percent: 100,
      meaning: 'Constitutional manifestations with active joint involvement, totally incapacitating',
      realWorld: 'Constant severe disease preventing normal function.',
    },
  ],

  documentationTips: [
    'List ALL joints affected',
    'Track flare frequency and duration',
    'Document morning stiffness duration',
    'Keep RF and anti-CCP results',
    'Track inflammatory markers',
    'Record all medications',
    'Document X-ray changes over time',
    'Note systemic symptoms: fatigue, fever',
  ],

  keyTerms: {
    'Rheumatoid factor': 'Blood test for RA - can be positive or negative',
    'Anti-CCP': 'More specific blood test for RA',
    'DMARDs': 'Disease-modifying drugs like methotrexate',
    'Biologics': 'Injectable medications targeting specific immune pathways',
    'Incapacitating exacerbation': 'Flare requiring bed rest or unable to work',
    'Active joint involvement': 'Ongoing inflammation in joints',
  },
};

// =============================================================================
// EPILEPSY (EXPANDED) - DC 8910-8914
// =============================================================================
const EPILEPSY_DESCRIPTION = {
  diagnosticCode: '8910',
  conditionName: 'Epilepsy / Seizure Disorders',

  evidenceLookingFor: [
    'Diagnosis of epilepsy with seizure type',
    'EEG results',
    'MRI of brain',
    'Documentation of seizure frequency',
    'Seizure diary or log',
    'Medication history and levels',
    'Witnesses to seizures',
    'Impact on driving, work, daily activities',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Confirmed diagnosis of epilepsy with history of seizures',
      realWorld: 'Established epilepsy, currently controlled or rare seizures.',
    },
    {
      percent: 20,
      meaning: 'At least 1 major seizure in last 2 years, OR at least 2 minor seizures in last 6 months',
      realWorld: 'Occasional breakthrough seizures despite treatment.',
    },
    {
      percent: 40,
      meaning: 'At least 1 major seizure in last 6 months, OR 2+ minor seizures weekly',
      realWorld: 'More frequent seizures - significant impact on daily life.',
    },
    {
      percent: 60,
      meaning: 'Averaging at least 1 major seizure in 4 months over last year, OR 9-10 minor seizures weekly',
      realWorld: 'Frequent major seizures despite treatment.',
    },
    {
      percent: 80,
      meaning: 'Averaging at least 1 major seizure in 3 months over last year, OR more than 10 minor seizures weekly',
      realWorld: 'Very frequent seizures significantly limiting function.',
    },
    {
      percent: 100,
      meaning: 'Averaging at least 1 major seizure per month over last year',
      realWorld: 'Monthly or more frequent major seizures. Poorly controlled epilepsy.',
    },
  ],

  documentationTips: [
    'Keep detailed seizure diary: date, time, type, duration, recovery',
    'Document witnesses to seizures',
    'Track all medications and blood levels',
    'Keep EEG and MRI results',
    'Note triggers if identified',
    'Document injuries from seizures',
    'Track driving restrictions',
    'Record work limitations',
  ],

  keyTerms: {
    'Major seizure (grand mal/tonic-clonic)': 'Loss of consciousness with convulsions',
    'Minor seizure (petit mal/absence)': 'Brief loss of awareness without falling',
    'Partial seizure': 'Starts in one brain area - may or may not spread',
    'Intractable epilepsy': 'Not controlled by 2+ medications',
    'Status epilepticus': 'Prolonged seizure - medical emergency',
    'Postictal': 'Recovery period after seizure',
  },
};

// ============================================
// STD/SYPHILIS CONDITION DESCRIPTIONS
// For addition to conditionDescriptions.js
// ============================================

// =============================================================================
// SYPHILIS (BASE) - DC 6310
// =============================================================================
export const SYPHILIS_DESCRIPTION = {
  diagnosticCode: '6310',
  conditionName: 'Syphilis and Other Treponemal Infections',

  evidenceLookingFor: [
    'Positive syphilis serology (RPR, VDRL, or treponemal-specific test)',
    'In-service diagnosis or treatment records',
    'Documentation of disease stage at diagnosis',
    'Treatment records (antibiotic therapy)',
    'Follow-up testing showing titer levels',
    'Evaluation for complications (neurological, cardiac, ocular)',
    'CSF analysis if neurosyphilis suspected',
    'Cardiology evaluation if cardiac symptoms present',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Inactive/treated syphilis without complications',
      realWorld: 'You had syphilis that was treated. No active disease and no residual complications. Establishes service connection for potential future complications.',
    },
  ],

  documentationTips: [
    'Keep all STI testing records from service',
    'Document any neurological symptoms (headaches, vision changes, gait problems)',
    'Document any cardiac symptoms (chest pain, shortness of breath)',
    'Track cognitive changes or memory problems',
    'Note any unusual pains, especially "lightning" stabbing pains',
    'Get evaluated by neurology if ANY neurological symptoms',
    'Get evaluated by cardiology if ANY cardiac symptoms',
    'Request CSF analysis if neurosyphilis is suspected',
  ],

  keyTerms: {
    'Treponema pallidum': 'The bacterium that causes syphilis',
    'RPR/VDRL': 'Screening blood tests for syphilis',
    'Treponemal test': 'Confirmatory test (FTA-ABS, TP-PA)',
    'Tertiary syphilis': 'Late-stage syphilis affecting organs',
    'Neurosyphilis': 'Syphilis infection of the nervous system',
    'Latent syphilis': 'Infected but without symptoms',
  },
};

// =============================================================================
// CEREBROSPINAL SYPHILIS - DC 8013
// =============================================================================
export const CEREBROSPINAL_SYPHILIS_DESCRIPTION = {
  diagnosticCode: '8013',
  conditionName: 'Cerebrospinal Syphilis',

  evidenceLookingFor: [
    'Positive CSF-VDRL or CSF treponemal test',
    'Lumbar puncture results',
    'MRI/CT showing CNS involvement',
    'Neurology evaluation documenting deficits',
    'Documentation of seizures if present',
    'Vision evaluation (ophthalmology)',
    'Cognitive/neuropsychological testing',
    'Treatment records (IV penicillin)',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Minimum rating with ascertainable residuals',
      realWorld: 'Mild residual symptoms like occasional headaches, fatigue, or minor cognitive issues that are clearly from the infection.',
    },
    {
      percent: 30,
      meaning: 'Moderate neurological symptoms',
      realWorld: 'Regular symptoms affecting daily life - frequent headaches, controlled seizures, or mild cognitive impairment.',
    },
    {
      percent: 60,
      meaning: 'Moderately severe symptoms',
      realWorld: 'Significant neurological problems - frequent seizures despite medication, notable paralysis, or moderate cognitive decline.',
    },
    {
      percent: 100,
      meaning: 'Severe neurological impairment',
      realWorld: 'Major neurological devastation - uncontrolled seizures, severe paralysis, blindness, or severe dementia.',
    },
  ],

  documentationTips: [
    'Get lumbar puncture (spinal tap) to confirm CNS infection',
    'Document ALL neurological symptoms in detail',
    'Keep seizure diary if you have convulsions',
    'Get formal neuropsychological testing for cognitive symptoms',
    'Track vision changes with ophthalmology',
    'Document how symptoms affect work and daily activities',
    'Note any paralysis or weakness with specific locations',
    'Keep records of all treatments and their effectiveness',
  ],

  keyTerms: {
    'CSF': 'Cerebrospinal fluid - tested via lumbar puncture',
    'CNS': 'Central nervous system (brain and spinal cord)',
    'General paresis': 'Progressive dementia from neurosyphilis',
    'Meningitis': 'Infection of brain/spinal cord coverings',
  },
};

// =============================================================================
// MENINGOVASCULAR SYPHILIS - DC 8014
// =============================================================================
export const MENINGOVASCULAR_SYPHILIS_DESCRIPTION = {
  diagnosticCode: '8014',
  conditionName: 'Meningovascular Syphilis',

  evidenceLookingFor: [
    'Positive CSF testing',
    'MRI/CT showing vascular changes or stroke',
    'Angiography showing vessel inflammation',
    'Documentation of stroke-like episodes',
    'Neurology evaluation',
    'Timeline of symptom progression',
    'Treatment records',
    'Functional assessment',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Minimal residuals',
      realWorld: 'Minor lingering symptoms - mild headaches or fatigue after treatment.',
    },
    {
      percent: 30,
      meaning: 'Moderate symptoms',
      realWorld: 'Noticeable deficits that affect daily life but are manageable.',
    },
    {
      percent: 60,
      meaning: 'Moderately severe symptoms',
      realWorld: 'Recurrent stroke-like episodes or significant permanent deficits from previous strokes.',
    },
    {
      percent: 100,
      meaning: 'Severe impairment',
      realWorld: 'Major stroke with permanent severe deficits - paralysis, severe cognitive impairment, or blindness.',
    },
  ],

  documentationTips: [
    'Document any "mini-stroke" or TIA episodes',
    'Get brain imaging (MRI/CT) to show vascular changes',
    'Track ALL neurological symptoms',
    'Note recovery timeline after any stroke-like episodes',
    'Document permanent deficits from past strokes',
    'Keep records of any hospitalization',
    'Track impact on work and daily activities',
  ],

  keyTerms: {
    'Meningovascular': 'Affecting brain coverings and blood vessels',
    'Vasculitis': 'Inflammation of blood vessels',
    'TIA': 'Transient ischemic attack (mini-stroke)',
    'Cerebrovascular accident': 'Stroke',
  },
};

// =============================================================================
// TABES DORSALIS - DC 8015
// =============================================================================
export const TABES_DORSALIS_DESCRIPTION = {
  diagnosticCode: '8015',
  conditionName: 'Tabes Dorsalis',

  evidenceLookingFor: [
    'Positive syphilis serology with neurological symptoms',
    'CSF analysis (may be positive or negative in burned-out tabes)',
    'Neurological examination documenting characteristic findings',
    'Gait analysis showing ataxia',
    'Sensory examination showing loss of position sense',
    'Documentation of lightning pains',
    'Bladder/bowel function assessment',
    'X-rays showing Charcot joints if present',
  ],

  ratingLevelMeanings: [
    {
      percent: 30,
      meaning: 'Moderate symptoms (minimum rating)',
      realWorld: 'You have noticeable gait problems, occasional lightning pains, or decreased sensation. You can still walk but have to concentrate. This is the MINIMUM rating for tabes dorsalis.',
    },
    {
      percent: 60,
      meaning: 'Moderately severe symptoms',
      realWorld: 'Significant gait disturbance requiring a cane or walker. Frequent severe lightning pains. Marked sensory loss. May have bladder or bowel issues.',
    },
    {
      percent: 100,
      meaning: 'Severe impairment',
      realWorld: 'Cannot walk without assistance. Constant severe lightning pains requiring strong medication. Complete sensory loss in legs. Severe bladder/bowel dysfunction or Charcot joints.',
    },
  ],

  documentationTips: [
    'ALWAYS document "lightning pains" using that exact VA term',
    'Describe gait problems in detail - do you need assistance?',
    'Note if you have positive Romberg sign (unsteady with eyes closed)',
    'Document any falls due to balance problems',
    'Track bladder issues (urgency, hesitancy, incontinence)',
    'Track bowel issues if present',
    'Note any joint problems (Charcot joints)',
    'Document impact on ability to work and perform daily activities',
    'Get formal gait analysis if possible',
  ],

  keyTerms: {
    'Lightning pains': 'Brief, severe, shooting/stabbing pains - THE key symptom',
    'Ataxia': 'Uncoordinated, unsteady gait',
    'Romberg sign': 'Falling/swaying when standing with eyes closed',
    'Proprioception': 'Sense of body position - lost in tabes',
    'Charcot joint': 'Joint destruction from loss of protective sensation',
    'Dorsal columns': 'Spinal cord pathways damaged in tabes',
  },
};

// =============================================================================
// SYPHILITIC DEMENTIA - DC 9301
// =============================================================================
export const SYPHILITIC_DEMENTIA_DESCRIPTION = {
  diagnosticCode: '9301',
  conditionName: 'Dementia Associated with CNS Syphilis (General Paresis)',

  evidenceLookingFor: [
    'Positive syphilis serology',
    'CSF analysis showing infection',
    'Neuropsychological testing documenting cognitive decline',
    'Psychiatric evaluation',
    'Brain imaging (MRI/CT)',
    'Documentation of functional impairment',
    'Timeline showing progressive decline',
    'Witness statements about behavioral changes',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Diagnosed but no symptoms',
      realWorld: 'History of neurosyphilis but no current cognitive or psychiatric symptoms.',
    },
    {
      percent: 10,
      meaning: 'Mild symptoms controlled by medication',
      realWorld: 'Minor symptoms that are well-controlled. Minimal impact on work or social life.',
    },
    {
      percent: 30,
      meaning: 'Occasional decrease in work efficiency',
      realWorld: 'Depressed mood, mild memory problems, or sleep issues. Can still work but with some difficulty.',
    },
    {
      percent: 50,
      meaning: 'Reduced reliability and productivity',
      realWorld: 'Significant memory problems, difficulty understanding complex tasks, mood disturbances. Work performance notably affected.',
    },
    {
      percent: 70,
      meaning: 'Deficiencies in most areas',
      realWorld: 'Severe memory and cognitive problems. May have confusion, poor hygiene, or difficulty with relationships. Cannot work most jobs.',
    },
    {
      percent: 100,
      meaning: 'Total occupational and social impairment',
      realWorld: 'Severe dementia. Cannot care for self. May not recognize family. Needs constant supervision.',
    },
  ],

  documentationTips: [
    'Get formal neuropsychological testing',
    'Document memory problems with specific examples',
    'Have family/friends write buddy statements about changes they\'ve noticed',
    'Track personality or behavioral changes',
    'Document ability to handle finances, medications, daily tasks',
    'Note any hallucinations or delusions',
    'Keep psychiatric treatment records',
    'Document impact on work - why you can\'t work or struggle to work',
  ],

  keyTerms: {
    'General paresis': 'Progressive dementia from neurosyphilis - same as DC 9301',
    'Dementia paralytica': 'Another name for syphilitic dementia',
    'Cognitive decline': 'Worsening memory, reasoning, and thinking',
    'Executive function': 'Planning, organizing, decision-making abilities',
  },
};

// =============================================================================
// SYPHILITIC HEART DISEASE - DC 7004
// =============================================================================
export const SYPHILITIC_HEART_DISEASE_DESCRIPTION = {
  diagnosticCode: '7004',
  conditionName: 'Syphilitic Heart Disease',

  evidenceLookingFor: [
    'Echocardiogram showing aortic involvement or valve disease',
    'CT/MRI angiography showing aortitis',
    'Positive syphilis serology with cardiac findings',
    'Exercise stress test with METs measurement',
    'Ejection fraction measurement',
    'Documentation of CHF episodes',
    'Cardiology evaluation establishing nexus to syphilis',
    'Treatment records',
  ],

  ratingLevelMeanings: [
    {
      percent: 10,
      meaning: 'Workload 7-10 METs causes symptoms, or continuous medication',
      realWorld: 'You have symptoms (shortness of breath, fatigue, chest pain) with moderate activity like climbing stairs. Or you need daily medication to control the condition.',
    },
    {
      percent: 30,
      meaning: 'Workload 5-7 METs causes symptoms, or cardiac changes on testing',
      realWorld: 'Symptoms with routine activities like walking briskly. Tests show your heart is enlarged or working harder than normal.',
    },
    {
      percent: 60,
      meaning: 'Workload 3-5 METs causes symptoms, or EF 30-50%, or CHF episodes',
      realWorld: 'Symptoms with light activity like slow walking or light housework. Your heart is pumping less efficiently. You may have had heart failure episodes.',
    },
    {
      percent: 100,
      meaning: 'Chronic CHF, or workload ≤3 METs, or EF <30%',
      realWorld: 'Severe heart disease. Symptoms at rest or minimal activity. Chronic heart failure. Your heart pumps very poorly. May need assistance with daily activities.',
    },
  ],

  documentationTips: [
    'Get echocardiogram to measure ejection fraction',
    'Get stress test with METs measurement',
    'Document ALL symptoms: chest pain, shortness of breath, fatigue, dizziness',
    'Track CHF episodes - note dates, hospitalizations',
    'Keep records of all cardiac medications',
    'Have cardiologist write nexus opinion linking heart disease to syphilis',
    'Document functional limitations - what can\'t you do?',
    'Note impact on work and daily activities',
  ],

  keyTerms: {
    'METs': 'Metabolic equivalents - measure of exercise capacity',
    'Ejection fraction': 'Percentage of blood pumped per heartbeat (normal 55-70%)',
    'Aortitis': 'Inflammation of the aorta - classic syphilitic finding',
    'Aortic regurgitation': 'Leaky aortic valve from syphilis damage',
    'CHF': 'Congestive heart failure',
  },
};


// =============================================================================
// GENERIC CONDITION (For GenericRatingCard)
// =============================================================================
const GENERIC_CONDITION_DESCRIPTION = {
  diagnosticCode: '0000',
  conditionName: 'General VA Rating Information',

  evidenceLookingFor: [
    'Diagnosis of your specific condition',
    'Medical records documenting symptoms',
    'Treatment history',
    'Functional limitations',
    'Impact on work and daily activities',
    'Frequency and severity of symptoms',
    'Objective test results when applicable',
    'Statements from family, friends, or coworkers',
  ],

  ratingLevelMeanings: [
    {
      percent: 0,
      meaning: 'Condition exists but causes no functional impairment',
      realWorld: 'Diagnosed but not currently affecting your life.',
    },
    {
      percent: 10,
      meaning: 'Mild impairment',
      realWorld: 'Some symptoms present with minor impact on function.',
    },
    {
      percent: 30,
      meaning: 'Moderate impairment',
      realWorld: 'Noticeable symptoms affecting daily activities.',
    },
    {
      percent: 50,
      meaning: 'Moderately severe impairment',
      realWorld: 'Significant symptoms with substantial functional limitations.',
    },
    {
      percent: 70,
      meaning: 'Severe impairment',
      realWorld: 'Major symptoms causing serious limitations.',
    },
    {
      percent: 100,
      meaning: 'Total impairment',
      realWorld: 'Condition prevents most normal activities.',
    },
  ],

  documentationTips: [
    'Document symptoms consistently over time',
    'Track frequency, duration, and severity',
    'Note what makes symptoms better or worse',
    'Record impact on work, chores, hobbies',
    'Keep all medical records and test results',
    'Get buddy statements from witnesses',
    'Document flare-ups when they happen',
    'Track all treatments and their effectiveness',
  ],

  keyTerms: {
    'Service connection': 'VA acknowledges condition is related to military service',
    'Rating percentage': 'Degree of disability from 0-100%',
    'Schedular rating': 'Rating based on VA\'s rating schedule criteria',
    'Extraschedular': 'Rating outside normal schedule for unusual cases',
    'TDIU': 'Total Disability Individual Unemployability - 100% for inability to work',
  },
};

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

/**
 * All condition descriptions indexed by diagnostic code
 */
const CONDITION_DESCRIPTIONS = {
  '9411': PTSD_DESCRIPTION,
  '8100': MIGRAINE_DESCRIPTION,
  '6847': SLEEP_APNEA_DESCRIPTION,
  // Spine conditions share the same description
  '5235': SPINE_DESCRIPTION,
  '5236': SPINE_DESCRIPTION,
  '5237': SPINE_DESCRIPTION,
  '5238': SPINE_DESCRIPTION,
  '5239': SPINE_DESCRIPTION,
  '5240': SPINE_DESCRIPTION,
  '5241': SPINE_DESCRIPTION,
  '5242': SPINE_DESCRIPTION,
  '5243': SPINE_DESCRIPTION,
  '9434': DEPRESSION_DESCRIPTION,
  '9400': ANXIETY_DESCRIPTION,
  // Batch 2: Additional high-impact conditions
  '8045': TBI_DESCRIPTION,
  '7101': HYPERTENSION_DESCRIPTION,
  '6100': HEARING_LOSS_DESCRIPTION,
  '7913': DIABETES_DESCRIPTION,
  '8520': RADICULOPATHY_DESCRIPTION,
  // Additional radiculopathy codes (different nerves use same description)
  '8510': RADICULOPATHY_DESCRIPTION,
  '8515': CARPAL_TUNNEL_DESCRIPTION,
  '8620': RADICULOPATHY_DESCRIPTION,
  '8720': RADICULOPATHY_DESCRIPTION,
  // Batch 3: More common conditions
  '7346': GERD_DESCRIPTION,
  '6602': ASTHMA_DESCRIPTION,
  '7806': ECZEMA_DESCRIPTION,
  '7319': IBS_DESCRIPTION,
  // Knee and joint conditions
  '5003': JOINT_DESCRIPTION,
  '5010': JOINT_DESCRIPTION,
  '5256': JOINT_DESCRIPTION,
  '5257': JOINT_DESCRIPTION,
  '5258': JOINT_DESCRIPTION,
  '5259': JOINT_DESCRIPTION,
  '5260': JOINT_DESCRIPTION,
  '5261': JOINT_DESCRIPTION,
  '5262': JOINT_DESCRIPTION,
  '5263': JOINT_DESCRIPTION,
  // Batch 4: Additional conditions
  '6513': SINUSITIS_DESCRIPTION,
  '6514': SINUSITIS_DESCRIPTION,
  '5276': PLANTAR_FASCIITIS_DESCRIPTION,
  '5284': PLANTAR_FASCIITIS_DESCRIPTION,
  '7800': SCARS_DESCRIPTION,
  '7801': SCARS_DESCRIPTION,
  '7802': SCARS_DESCRIPTION,
  '7804': SCARS_DESCRIPTION,
  '7805': SCARS_DESCRIPTION,
  '8521': PERIPHERAL_NEUROPATHY_DESCRIPTION,
  '8522': PERIPHERAL_NEUROPATHY_DESCRIPTION,
  '8523': PERIPHERAL_NEUROPATHY_DESCRIPTION,
  '8524': PERIPHERAL_NEUROPATHY_DESCRIPTION,
  '8525': PERIPHERAL_NEUROPATHY_DESCRIPTION,
  '6522': RHINITIS_DESCRIPTION,
  // Batch 5: More conditions
  '6604': COPD_DESCRIPTION,
  '5200': SHOULDER_DESCRIPTION,
  '5201': SHOULDER_DESCRIPTION,
  '5202': SHOULDER_DESCRIPTION,
  '5203': SHOULDER_DESCRIPTION,
  '5250': HIP_DESCRIPTION,
  '5251': HIP_DESCRIPTION,
  '5252': HIP_DESCRIPTION,
  '5253': HIP_DESCRIPTION,
  '5254': HIP_DESCRIPTION,
  '5255': HIP_DESCRIPTION,
  '6205': MENIERES_DESCRIPTION,
  '6204': EAR_CONDITIONS_DESCRIPTION,
  '6200': EAR_CONDITIONS_DESCRIPTION,
  '6210': EAR_CONDITIONS_DESCRIPTION,
  '6201': EAR_CONDITIONS_DESCRIPTION,
  // Batch 6: Cardiac, Neurological, and more
  '7005': CAD_DESCRIPTION,
  '7006': CAD_DESCRIPTION, // Post-MI uses same criteria
  '8910': SEIZURE_DESCRIPTION,
  '8911': SEIZURE_DESCRIPTION,
  '6354': CHRONIC_FATIGUE_DESCRIPTION,
  '7507': KIDNEY_DESCRIPTION,
  '7508': KIDNEY_DESCRIPTION,
  '7509': KIDNEY_DESCRIPTION,
  '7510': KIDNEY_DESCRIPTION,
  '7531': KIDNEY_DESCRIPTION,
  '7017': ARRHYTHMIA_DESCRIPTION,
  '7010': ARRHYTHMIA_DESCRIPTION,
  '7011': ARRHYTHMIA_DESCRIPTION,
  '7015': CARDIOMYOPATHY_DESCRIPTION,
  '7020': CARDIOMYOPATHY_DESCRIPTION,
  '5025': FIBROMYALGIA_DESCRIPTION,
  '6260': TINNITUS_DESCRIPTION,
  // Batch 7: Liver, Blood, Prostate, Thyroid conditions
  '7312': CIRRHOSIS_DESCRIPTION,
  '7345': HEPATITIS_DESCRIPTION,
  '7354': HEPATITIS_DESCRIPTION,
  '7700': ANEMIA_DESCRIPTION,
  '7716': ANEMIA_DESCRIPTION,
  '7714': ANEMIA_DESCRIPTION,
  '7528': PROSTATE_DESCRIPTION,
  '7903': HYPOTHYROIDISM_DESCRIPTION,
  '7900': HYPERTHYROIDISM_DESCRIPTION,
  '6350': LUPUS_DESCRIPTION,
  '5002': RHEUMATOID_ARTHRITIS_DESCRIPTION,
  // Batch 8: Voiding, GI, Infectious, more conditions
  '7527': VOIDING_DYSFUNCTION_DESCRIPTION,
  '7542': VOIDING_DYSFUNCTION_DESCRIPTION,
  '7512': VOIDING_DYSFUNCTION_DESCRIPTION,
  '7518': VOIDING_DYSFUNCTION_DESCRIPTION,
  '7332': SPHINCTER_DESCRIPTION,
  '7333': SPHINCTER_DESCRIPTION,
  '7301': PERITONEAL_ADHESIONS_DESCRIPTION,
  '7203': ESOPHAGEAL_DESCRIPTION,
  '7204': ESOPHAGEAL_DESCRIPTION,
  '7205': ESOPHAGEAL_DESCRIPTION,
  '7329': INTESTINAL_RESECTION_DESCRIPTION,
  '7330': INTESTINAL_FISTULA_DESCRIPTION,
  '7323': COLITIS_DESCRIPTION,
  '6351': HIV_DESCRIPTION,
  '6304': MALARIA_DESCRIPTION,
  '6311': BRUCELLOSIS_DESCRIPTION,
  '5009': INFECTIOUS_ARTHRITIS_DESCRIPTION,
  // Batch 9: More neurological, endocrine, blood disorders
  '8018': MS_DESCRIPTION,
  '8019': MS_DESCRIPTION,
  '8004': PARKINSONS_DESCRIPTION,
  '8017': ALS_DESCRIPTION,
  '8025': MYASTHENIA_DESCRIPTION,
  '7904': THYROIDITIS_DESCRIPTION,
  '7905': THYROIDITIS_DESCRIPTION,
  '7911': ADDISONS_DESCRIPTION,
  '7907': CUSHINGS_DESCRIPTION,
  '7702': SICKLE_CELL_DESCRIPTION,
  '7703': LEUKEMIA_DESCRIPTION,
  '7704': POLYCYTHEMIA_DESCRIPTION,
  '7705': THROMBOCYTOPENIA_DESCRIPTION,
  '7706': HODGKINS_DESCRIPTION,
  '7715': NON_HODGKINS_DESCRIPTION,
  '7709': MYELOMA_DESCRIPTION,
  // Batch 10: Respiratory, skin, eye, and misc conditions
  '6603': EMPHYSEMA_DESCRIPTION,
  '6601': BRONCHIECTASIS_DESCRIPTION,
  '6600': BRONCHITIS_DESCRIPTION,
  '6824': SARCOIDOSIS_DESCRIPTION,
  '6825': SARCOIDOSIS_DESCRIPTION,
  '6731': PULMONARY_FIBROSIS_DESCRIPTION,
  '7817': PSORIASIS_DESCRIPTION,
  '7824': HYPERHIDROSIS_DESCRIPTION,
  '7831': ALOPECIA_DESCRIPTION,
  '7829': CHLORACNE_DESCRIPTION,
  '7820': SKIN_INFECTIONS_DESCRIPTION,
  '6061': GLAUCOMA_DESCRIPTION,
  '6066': VISUAL_ACUITY_DESCRIPTION,
  '6080': VISUAL_FIELD_DESCRIPTION,
  '7120': VARICOSE_VEINS_DESCRIPTION,
  '7121': POST_PHLEBITIC_DESCRIPTION,
  '7114': ARTERIOSCLEROSIS_DESCRIPTION,
  // GeneralSkinRatingCard DC codes
  '7809': DISCOID_LUPUS_DESCRIPTION,
  '7815': BULLOUS_DESCRIPTION,
  '7826': CUTANEOUS_VASCULITIS_DESCRIPTION,
  '7813': DERMATOPHYTOSIS_DESCRIPTION,
  // GeneralEyeRatingCard DC codes
  '6000': UVEITIS_DESCRIPTION,
  '6001': KERATITIS_DESCRIPTION,
  '6002': SCLERITIS_DESCRIPTION,
  '6018': CONJUNCTIVITIS_DESCRIPTION,
  // Batch 11: Cardiac, GI, endocrine, and misc conditions
  '7000': VALVULAR_HEART_DESCRIPTION,
  '7001': VALVULAR_HEART_DESCRIPTION,
  '7007': HYPERTENSIVE_HEART_DESCRIPTION,
  '7008': HYPERTENSIVE_HEART_DESCRIPTION,
  '7002': PERICARDITIS_DESCRIPTION,
  '7003': PERICARDITIS_DESCRIPTION,
  '7307': GASTRITIS_DESCRIPTION,
  '7308': GASTRITIS_DESCRIPTION,
  '7347': PANCREATITIS_DESCRIPTION,
  '7314': BILIARY_DESCRIPTION,
  '7315': BILIARY_DESCRIPTION,
  '7318': BILIARY_DESCRIPTION,
  '7336': HEMORRHOIDS_DESCRIPTION,
  '7338': HERNIA_DESCRIPTION,
  '7339': HERNIA_DESCRIPTION,
  '7340': HERNIA_DESCRIPTION,
  '7610': FEMALE_REPRODUCTIVE_DESCRIPTION,
  '7611': FEMALE_REPRODUCTIVE_DESCRIPTION,
  '7612': FEMALE_REPRODUCTIVE_DESCRIPTION,
  '7613': FEMALE_REPRODUCTIVE_DESCRIPTION,
  '7614': FEMALE_REPRODUCTIVE_DESCRIPTION,
  '7615': ENDOMETRIOSIS_DESCRIPTION,
  '7522': ERECTILE_DYSFUNCTION_DESCRIPTION,
  '7523': ERECTILE_DYSFUNCTION_DESCRIPTION,
  '7524': ERECTILE_DYSFUNCTION_DESCRIPTION,
  '5017': GOUT_DESCRIPTION,
  '5024': TENDINITIS_DESCRIPTION,
  '5019': BURSITIS_DESCRIPTION,
  // Batch 12: Remaining neurological, infectious, and misc conditions
  '8046': TBI_DESCRIPTION,
  '5000': OSTEOMYELITIS_DESCRIPTION,
  '5021': MYOSITIS_DESCRIPTION,
  '5020': SYNOVITIS_DESCRIPTION,
  '8540': LYMPHEDEMA_DESCRIPTION,
  '6315': WEST_NILE_DESCRIPTION,
  '6316': CAMPYLOBACTER_DESCRIPTION,
  '6317': SHIGELLA_DESCRIPTION,
  '6318': SALMONELLA_DESCRIPTION,
  '6319': Q_FEVER_DESCRIPTION,
  '6320': LYME_DISEASE_DESCRIPTION,
  '6326': NTM_DESCRIPTION,
  '7631': INFERTILITY_DESCRIPTION,
  '7617': PELVIC_PROLAPSE_DESCRIPTION,
  '7619': OVARY_REMOVAL_DESCRIPTION,
  '7620': UTERUS_REMOVAL_DESCRIPTION,
  '7626': BREAST_SURGERY_DESCRIPTION,
  '7627': BREAST_SURGERY_DESCRIPTION,
  '7628': BREAST_SURGERY_DESCRIPTION,
  // Batch 13: TMJ, dental, cold injury, narcolepsy, and remaining conditions
  '9905': TMJ_DESCRIPTION,
  '9904': TMJ_DESCRIPTION,
  '9903': TMJ_DESCRIPTION,
  '9913': TOOTH_LOSS_DESCRIPTION,
  '7122': COLD_INJURY_DESCRIPTION,
  '8108': NARCOLEPSY_DESCRIPTION,
  '8024': SYRINGOMYELIA_DESCRIPTION,
  '8023': MYELITIS_DESCRIPTION,
  '7199': INSOMNIA_DESCRIPTION,
  '7502': KIDNEY_STONES_DESCRIPTION,
  '7517': BLADDER_INJURY_DESCRIPTION,
  '7519': VOIDING_DYSFUNCTION_DESCRIPTION,
  '7520': URETHRAL_FISTULA_DESCRIPTION,
  '7525': CHRONIC_EPIDIDYMITIS_DESCRIPTION,
  '7529': URINARY_TRACT_INFECTION_DESCRIPTION,
  '5293': SACROILIAC_DESCRIPTION,
  '5294': SACROILIAC_DESCRIPTION,
  '6502': DEVIATED_SEPTUM_DESCRIPTION,
  '6504': NOSE_LOSS_DESCRIPTION,
  '6520': LARYNGITIS_DESCRIPTION,
  '6516': LARYNX_STENOSIS_DESCRIPTION,
  '6519': APHONIA_DESCRIPTION,
  '6521': PHARYNGITIS_DESCRIPTION,
  // Batch 14: Remaining musculoskeletal, oral, and misc conditions
  '5270': ANKLE_DESCRIPTION,
  '5271': ANKLE_DESCRIPTION,
  '5272': ANKLE_DESCRIPTION,
  '5273': ANKLE_DESCRIPTION,
  '5274': ANKLE_DESCRIPTION,
  '5275': FLATFOOT_DESCRIPTION,
  '5277': WEAK_FOOT_DESCRIPTION,
  '5278': CLAW_FOOT_DESCRIPTION,
  '5279': METATARSALGIA_DESCRIPTION,
  '5280': HALLUX_VALGUS_DESCRIPTION,
  '5281': HALLUX_RIGIDUS_DESCRIPTION,
  '5282': HAMMER_TOE_DESCRIPTION,
  '5283': MALUNION_TARSAL_DESCRIPTION,
  '5206': ELBOW_DESCRIPTION,
  '5207': ELBOW_DESCRIPTION,
  '5208': ELBOW_DESCRIPTION,
  '5209': ELBOW_DESCRIPTION,
  '5210': ELBOW_DESCRIPTION,
  '5211': ELBOW_DESCRIPTION,
  '5212': ELBOW_DESCRIPTION,
  '5213': WRIST_DESCRIPTION,
  '5214': WRIST_DESCRIPTION,
  '5215': WRIST_DESCRIPTION,
  '5216': FINGER_DESCRIPTION,
  '5217': FINGER_DESCRIPTION,
  '5218': FINGER_DESCRIPTION,
  '5219': FINGER_DESCRIPTION,
  '5220': FINGER_DESCRIPTION,
  '5221': FINGER_DESCRIPTION,
  '5222': FINGER_DESCRIPTION,
  '5223': FINGER_DESCRIPTION,
  '5224': FINGER_DESCRIPTION,
  '5225': FINGER_DESCRIPTION,
  '5226': FINGER_DESCRIPTION,
  '5227': FINGER_DESCRIPTION,
  '5228': THUMB_DESCRIPTION,
  '5229': FINGER_LIMITATION_DESCRIPTION,
  '5230': FINGER_LIMITATION_DESCRIPTION,
  '9900': MAXILLA_MALUNION_DESCRIPTION,
  '9901': MANDIBLE_MALUNION_DESCRIPTION,
  '9902': MANDIBLE_MALUNION_DESCRIPTION,
  '9906': MANDIBLE_NONUNION_DESCRIPTION,
  '9907': MANDIBLE_NONUNION_DESCRIPTION,
  '9908': MANDIBLE_NONUNION_DESCRIPTION,
  '9909': MANDIBLE_NONUNION_DESCRIPTION,
  '9911': HARD_PALATE_DESCRIPTION,
  '9912': HARD_PALATE_DESCRIPTION,
  '9914': BENIGN_NEOPLASM_DESCRIPTION,
  '9915': MALIGNANT_NEOPLASM_DESCRIPTION,
  // Batch 15: Final remaining conditions
  '8914': EPILEPSY_DESCRIPTION,
  '8912': EPILEPSY_DESCRIPTION,
  '8913': EPILEPSY_DESCRIPTION,
  '7917': HYPERALDOSTERONISM_DESCRIPTION,
  '7310': POSTGASTRECTOMY_DESCRIPTION,
  '7311': POSTGASTRECTOMY_DESCRIPTION,
  '0000': GENERIC_CONDITION_DESCRIPTION,
  '6310': SYPHILIS_DESCRIPTION,
  '8013': CEREBROSPINAL_SYPHILIS_DESCRIPTION,
  '8014': MENINGOVASCULAR_SYPHILIS_DESCRIPTION,
  '8015': TABES_DORSALIS_DESCRIPTION,
  '9301': SYPHILITIC_DEMENTIA_DESCRIPTION,
  '7004': SYPHILITIC_HEART_DISEASE_DESCRIPTION,
};

/**
 * Get condition description by diagnostic code
 * @param {string} diagnosticCode - The VA diagnostic code (e.g., '9411', '8100')
 * @returns {Object|null} - The condition description object or null if not found
 */
export const getConditionDescription = (diagnosticCode) => {
  if (!diagnosticCode) return null;
  // Normalize the code (remove any whitespace, handle both string and number)
  const normalizedCode = String(diagnosticCode).trim();
  return CONDITION_DESCRIPTIONS[normalizedCode] || null;
};

/**
 * Check if a condition has enhanced description content
 * @param {string} diagnosticCode - The VA diagnostic code
 * @returns {boolean} - True if description exists
 */
export const hasConditionDescription = (diagnosticCode) => {
  if (!diagnosticCode) return false;
  const normalizedCode = String(diagnosticCode).trim();
  return normalizedCode in CONDITION_DESCRIPTIONS;
};

/**
 * Get all available diagnostic codes with descriptions
 * @returns {string[]} - Array of diagnostic codes
 */
export const getAvailableCodes = () => {
  return Object.keys(CONDITION_DESCRIPTIONS);
};

// Named exports for direct import if needed
export {
  PTSD_DESCRIPTION,
  MIGRAINE_DESCRIPTION,
  SLEEP_APNEA_DESCRIPTION,
  SPINE_DESCRIPTION,
  DEPRESSION_DESCRIPTION,
  ANXIETY_DESCRIPTION,
  TBI_DESCRIPTION,
  HYPERTENSION_DESCRIPTION,
  HEARING_LOSS_DESCRIPTION,
  DIABETES_DESCRIPTION,
  RADICULOPATHY_DESCRIPTION,
  GERD_DESCRIPTION,
  ASTHMA_DESCRIPTION,
  ECZEMA_DESCRIPTION,
  IBS_DESCRIPTION,
  JOINT_DESCRIPTION,
  SINUSITIS_DESCRIPTION,
  PLANTAR_FASCIITIS_DESCRIPTION,
  SCARS_DESCRIPTION,
  PERIPHERAL_NEUROPATHY_DESCRIPTION,
  RHINITIS_DESCRIPTION,
  COPD_DESCRIPTION,
  SHOULDER_DESCRIPTION,
  HIP_DESCRIPTION,
  MENIERES_DESCRIPTION,
  EAR_CONDITIONS_DESCRIPTION,
  CAD_DESCRIPTION,
  SEIZURE_DESCRIPTION,
  CHRONIC_FATIGUE_DESCRIPTION,
  KIDNEY_DESCRIPTION,
  ARRHYTHMIA_DESCRIPTION,
  CARDIOMYOPATHY_DESCRIPTION,
  FIBROMYALGIA_DESCRIPTION,
  TINNITUS_DESCRIPTION,
  CIRRHOSIS_DESCRIPTION,
  HEPATITIS_DESCRIPTION,
  ANEMIA_DESCRIPTION,
  PROSTATE_DESCRIPTION,
  HYPOTHYROIDISM_DESCRIPTION,
  HYPERTHYROIDISM_DESCRIPTION,
  LUPUS_DESCRIPTION,
  RHEUMATOID_ARTHRITIS_DESCRIPTION,
  VOIDING_DYSFUNCTION_DESCRIPTION,
  SPHINCTER_DESCRIPTION,
  PERITONEAL_ADHESIONS_DESCRIPTION,
  ESOPHAGEAL_DESCRIPTION,
  INTESTINAL_RESECTION_DESCRIPTION,
  INTESTINAL_FISTULA_DESCRIPTION,
  COLITIS_DESCRIPTION,
  HIV_DESCRIPTION,
  MALARIA_DESCRIPTION,
  BRUCELLOSIS_DESCRIPTION,
  INFECTIOUS_ARTHRITIS_DESCRIPTION,
  MS_DESCRIPTION,
  PARKINSONS_DESCRIPTION,
  ALS_DESCRIPTION,
  MYASTHENIA_DESCRIPTION,
  THYROIDITIS_DESCRIPTION,
  ADDISONS_DESCRIPTION,
  CUSHINGS_DESCRIPTION,
  SICKLE_CELL_DESCRIPTION,
  LEUKEMIA_DESCRIPTION,
  POLYCYTHEMIA_DESCRIPTION,
  THROMBOCYTOPENIA_DESCRIPTION,
  HODGKINS_DESCRIPTION,
  NON_HODGKINS_DESCRIPTION,
  MYELOMA_DESCRIPTION,
  EMPHYSEMA_DESCRIPTION,
  BRONCHIECTASIS_DESCRIPTION,
  BRONCHITIS_DESCRIPTION,
  SARCOIDOSIS_DESCRIPTION,
  PULMONARY_FIBROSIS_DESCRIPTION,
  PSORIASIS_DESCRIPTION,
  HYPERHIDROSIS_DESCRIPTION,
  ALOPECIA_DESCRIPTION,
  CHLORACNE_DESCRIPTION,
  SKIN_INFECTIONS_DESCRIPTION,
  GLAUCOMA_DESCRIPTION,
  VISUAL_ACUITY_DESCRIPTION,
  VISUAL_FIELD_DESCRIPTION,
  VARICOSE_VEINS_DESCRIPTION,
  POST_PHLEBITIC_DESCRIPTION,
  ARTERIOSCLEROSIS_DESCRIPTION,
  DISCOID_LUPUS_DESCRIPTION,
  BULLOUS_DESCRIPTION,
  CUTANEOUS_VASCULITIS_DESCRIPTION,
  DERMATOPHYTOSIS_DESCRIPTION,
  UVEITIS_DESCRIPTION,
  KERATITIS_DESCRIPTION,
  SCLERITIS_DESCRIPTION,
  CONJUNCTIVITIS_DESCRIPTION,
  VALVULAR_HEART_DESCRIPTION,
  HYPERTENSIVE_HEART_DESCRIPTION,
  PERICARDITIS_DESCRIPTION,
  GASTRITIS_DESCRIPTION,
  PANCREATITIS_DESCRIPTION,
  BILIARY_DESCRIPTION,
  HEMORRHOIDS_DESCRIPTION,
  HERNIA_DESCRIPTION,
  FEMALE_REPRODUCTIVE_DESCRIPTION,
  ENDOMETRIOSIS_DESCRIPTION,
  ERECTILE_DYSFUNCTION_DESCRIPTION,
  GOUT_DESCRIPTION,
  TENDINITIS_DESCRIPTION,
  BURSITIS_DESCRIPTION,
  CARPAL_TUNNEL_DESCRIPTION,
  OSTEOMYELITIS_DESCRIPTION,
  MYOSITIS_DESCRIPTION,
  SYNOVITIS_DESCRIPTION,
  LYMPHEDEMA_DESCRIPTION,
  WEST_NILE_DESCRIPTION,
  CAMPYLOBACTER_DESCRIPTION,
  SHIGELLA_DESCRIPTION,
  SALMONELLA_DESCRIPTION,
  Q_FEVER_DESCRIPTION,
  LYME_DISEASE_DESCRIPTION,
  NTM_DESCRIPTION,
  INFERTILITY_DESCRIPTION,
  PELVIC_PROLAPSE_DESCRIPTION,
  OVARY_REMOVAL_DESCRIPTION,
  UTERUS_REMOVAL_DESCRIPTION,
  BREAST_SURGERY_DESCRIPTION,
  TMJ_DESCRIPTION,
  TOOTH_LOSS_DESCRIPTION,
  COLD_INJURY_DESCRIPTION,
  NARCOLEPSY_DESCRIPTION,
  SYRINGOMYELIA_DESCRIPTION,
  MYELITIS_DESCRIPTION,
  INSOMNIA_DESCRIPTION,
  KIDNEY_STONES_DESCRIPTION,
  URETHRAL_STRICTURE_DESCRIPTION,
  CHRONIC_CYSTITIS_DESCRIPTION,
  DEVIATED_SEPTUM_DESCRIPTION,
  LARYNGITIS_DESCRIPTION,
  BLADDER_INJURY_DESCRIPTION,
  URETHRAL_FISTULA_DESCRIPTION,
  CHRONIC_EPIDIDYMITIS_DESCRIPTION,
  URINARY_TRACT_INFECTION_DESCRIPTION,
  SACROILIAC_DESCRIPTION,
  NOSE_LOSS_DESCRIPTION,
  LARYNX_STENOSIS_DESCRIPTION,
  APHONIA_DESCRIPTION,
  PHARYNGITIS_DESCRIPTION,
  ANKLE_DESCRIPTION,
  FLATFOOT_DESCRIPTION,
  WEAK_FOOT_DESCRIPTION,
  CLAW_FOOT_DESCRIPTION,
  METATARSALGIA_DESCRIPTION,
  HALLUX_VALGUS_DESCRIPTION,
  HALLUX_RIGIDUS_DESCRIPTION,
  HAMMER_TOE_DESCRIPTION,
  MALUNION_TARSAL_DESCRIPTION,
  ELBOW_DESCRIPTION,
  WRIST_DESCRIPTION,
  FINGER_DESCRIPTION,
  THUMB_DESCRIPTION,
  FINGER_LIMITATION_DESCRIPTION,
  MAXILLA_MALUNION_DESCRIPTION,
  MANDIBLE_MALUNION_DESCRIPTION,
  MANDIBLE_NONUNION_DESCRIPTION,
  HARD_PALATE_DESCRIPTION,
  BENIGN_NEOPLASM_DESCRIPTION,
  MALIGNANT_NEOPLASM_DESCRIPTION,
  HYPERALDOSTERONISM_DESCRIPTION,
  POSTGASTRECTOMY_DESCRIPTION,
  MULTI_JOINT_ARTHRITIS_DESCRIPTION,
  EPILEPSY_DESCRIPTION,
  GENERIC_CONDITION_DESCRIPTION,
  CONDITION_DESCRIPTIONS,
};

export default CONDITION_DESCRIPTIONS;