// Common symptoms tracked for VA disability claims
// Organized by body system for easier navigation
export const symptomCategories = [
  {
    id: 'headaches',
    name: 'Headaches & Migraines',
    symptoms: [
      { id: 'migraine', name: 'Migraine' },
      { id: 'headache', name: 'Headache (Tension/Other)' },
    ]
  },
  {
    id: 'pain',
    name: 'Pain',
    symptoms: [
      { id: 'back-pain', name: 'Back Pain' },
      { id: 'neck-pain', name: 'Neck Pain' },
      { id: 'knee-pain', name: 'Knee Pain' },
      { id: 'shoulder-pain', name: 'Shoulder Pain' },
      { id: 'hip-pain', name: 'Hip Pain' },
      { id: 'joint-pain', name: 'Joint Pain (General)' },
    ]
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    symptoms: [
      { id: 'anxiety', name: 'Anxiety' },
      { id: 'depression', name: 'Depression' },
      { id: 'sleep-issues', name: 'Sleep Problems' },
      { id: 'nightmares', name: 'Nightmares' },
      { id: 'irritability', name: 'Irritability/Anger' },
      { id: 'concentration', name: 'Difficulty Concentrating' },
      { id: 'hypervigilance', name: 'Hypervigilance' },
    ]
  },
  {
    id: 'ptsd',
    name: 'PTSD Symptoms',
    symptoms: [
      { id: 'ptsd-nightmare', name: 'PTSD Nightmare' },
      { id: 'ptsd-flashback', name: 'PTSD Flashback' },
      { id: 'ptsd-panic', name: 'PTSD Panic Attack' },
      { id: 'ptsd-hypervigilance', name: 'PTSD Hypervigilance' },
      { id: 'ptsd-avoidance', name: 'PTSD Avoidance Behavior' },
    ]
  },
  {
    id: 'depression',
    name: 'Depression Symptoms',
    symptoms: [
      { id: 'depression', name: 'Depressed Mood' },
      { id: 'mdd-episode', name: 'Depressive Episode' },
      { id: 'mdd-anhedonia', name: 'Loss of Interest/Pleasure' },
      { id: 'mdd-hopelessness', name: 'Hopelessness' },
    ]
  },
  {
    id: 'anxiety',
    name: 'Anxiety Symptoms',
    symptoms: [
      { id: 'anxiety', name: 'General Anxiety' },
      { id: 'gad-worry', name: 'Excessive Worry' },
      { id: 'gad-restlessness', name: 'Restlessness' },
      { id: 'gad-muscle-tension', name: 'Muscle Tension' },
    ]
  },
  // Phase 3: Social Anxiety Disorder
  {
    id: 'social-anxiety',
    name: 'Social Anxiety Symptoms',
    symptoms: [
      { id: 'social-anxiety-fear', name: 'Social Anxiety - Fear of Social Situations' },
      { id: 'social-anxiety-avoidance', name: 'Social Anxiety - Avoidance of Social Events' },
      { id: 'social-anxiety-performance', name: 'Social Anxiety - Performance Anxiety' },
      { id: 'social-anxiety-physical', name: 'Social Anxiety - Physical Symptoms (Blushing/Sweating)' },
      { id: 'social-anxiety-anticipatory', name: 'Social Anxiety - Anticipatory Worry' },
    ]
  },
  // Phase 3: OCD
  {
    id: 'ocd',
    name: 'OCD Symptoms',
    symptoms: [
      { id: 'ocd-obsessions', name: 'OCD - Intrusive Thoughts/Obsessions' },
      { id: 'ocd-compulsions', name: 'OCD - Compulsive Behaviors/Rituals' },
      { id: 'ocd-checking', name: 'OCD - Checking Behaviors' },
      { id: 'ocd-contamination', name: 'OCD - Contamination Fears' },
      { id: 'ocd-time-spent', name: 'OCD - Significant Time Spent on Rituals' },
    ]
  },
  // Phase 3: Adjustment Disorder
  {
    id: 'adjustment-disorder',
    name: 'Adjustment Disorder Symptoms',
    symptoms: [
      { id: 'adjustment-depressed-mood', name: 'Adjustment Disorder - Depressed Mood' },
      { id: 'adjustment-anxiety', name: 'Adjustment Disorder - Anxiety' },
      { id: 'adjustment-mixed-emotions', name: 'Adjustment Disorder - Mixed Emotions'},
      { id: 'adjustment-disturbance-conduct', name: 'Adjustment Disorder - Behavioral Changes' },
      { id: 'adjustment-work-difficulty', name: 'Adjustment Disorder - Work/School Difficulty' },
      { id: 'adjustment-relationship-problems', name: 'Adjustment Disorder - Relationship Problems' },
      { id: 'adjustment-unspecified', name: 'Adjustment Disorder - Unspecified'}
    ]
  },
  {
    id: 'panic',
    name: 'Panic Disorder Symptoms',
    symptoms: [
      { id: 'panic-attack', name: 'Panic Attack' },
      { id: 'panic-agoraphobia', name: 'Agoraphobia' },
      { id: 'panic-anticipatory-anxiety', name: 'Anticipatory Anxiety' },
    ]
  },
  {
    id: 'bipolar',
    name: 'Bipolar Symptoms',
    symptoms: [
      { id: 'bipolar-manic', name: 'Manic Episode' },
      { id: 'bipolar-depressive', name: 'Depressive Episode' },
      { id: 'bipolar-mixed', name: 'Mixed Episode' },
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological',
    symptoms: [
      { id: 'tinnitus', name: 'Tinnitus (Ringing in Ears)' },
      { id: 'dizziness', name: 'Dizziness/Vertigo' },
      { id: 'numbness', name: 'Numbness/Tingling' },
      { id: 'tremors', name: 'Tremors' },
      { id: 'memory', name: 'Memory Problems' },
      { id: 'seizure-major', name: 'Seizure - Major (Grand Mal/Tonic-Clonic)' },
      { id: 'seizure-minor', name: 'Seizure - Minor (Petit Mal/Absence)' },
      { id: 'seizure-partial', name: 'Seizure - Partial/Focal' },
      { id: 'seizure-psychomotor', name: 'Seizure - Psychomotor' },
      { id: 'aura-pre-seizure', name: 'Aura/Warning Signs (Pre-Seizure)' },
    ]
  },
  // ============================================
// PHASE 1D: EPILEPSY EXPANSION SYMPTOMS
// DC 8912, 8913, 8914
// ============================================

// Jacksonian/Focal Epilepsy (DC 8912)
  {
    id: 'jacksonian-epilepsy',
    name: 'Jacksonian/Focal Epilepsy (DC 8912) Symptoms',
    symptoms: [
      { id: 'jack-focal-motor', name: 'Jacksonian - Focal Motor Seizure' },
      { id: 'jack-focal-sensory', name: 'Jacksonian - Focal Sensory Seizure' },
      { id: 'jack-march', name: 'Jacksonian - March (Spreading Motor Activity)' },
      { id: 'jack-unilateral-jerking', name: 'Jacksonian - Unilateral Jerking/Twitching' },
      { id: 'jack-tingling-numbness', name: 'Jacksonian - Focal Tingling/Numbness' },
      { id: 'jack-visual-disturbance', name: 'Jacksonian - Visual Disturbance (Focal)' },
      { id: 'jack-secondary-generalization', name: 'Jacksonian - Secondary Generalization' },
      { id: 'jack-preserved-awareness', name: 'Jacksonian - Seizure with Preserved Awareness' },
      { id: 'jack-impaired-awareness', name: 'Jacksonian - Seizure with Impaired Awareness' },
    ]
  },

// Diencephalic Epilepsy (DC 8913)
  {
    id: 'diencephalic-epilepsy',
    name: 'Diencephalic Epilepsy (DC 8913) Symptoms',
    symptoms: [
      { id: 'dien-autonomic-seizure', name: 'Diencephalic - Autonomic Seizure' },
      { id: 'dien-flushing', name: 'Diencephalic - Sudden Flushing' },
      { id: 'dien-sweating', name: 'Diencephalic - Profuse Sweating Episode' },
      { id: 'dien-blood-pressure', name: 'Diencephalic - Blood Pressure Changes' },
      { id: 'dien-heart-rate', name: 'Diencephalic - Heart Rate Changes' },
      { id: 'dien-pupil-changes', name: 'Diencephalic - Pupillary Changes' },
      { id: 'dien-temperature', name: 'Diencephalic - Temperature Dysregulation' },
      { id: 'dien-lacrimation', name: 'Diencephalic - Excessive Tearing/Salivation' },
      { id: 'dien-gi-symptoms', name: 'Diencephalic - GI Symptoms (Nausea/Vomiting)' },
      { id: 'dien-hypothalamic', name: 'Diencephalic - Hypothalamic Symptoms' },
    ]
  },

// Psychomotor Epilepsy (DC 8914)
  {
    id: 'psychomotor-epilepsy',
    name: 'Psychomotor Epilepsy (DC 8914) Symptoms',
    symptoms: [
      // Major-type symptoms (automatic states, convulsions with LOC)
      { id: 'psych-automatic-state', name: 'Psychomotor - Automatic State/Automatism' },
      { id: 'psych-convulsion-loc', name: 'Psychomotor - Convulsion with Loss of Consciousness' },
      { id: 'psych-prolonged-confusion', name: 'Psychomotor - Prolonged Post-ictal Confusion' },
      { id: 'psych-wandering', name: 'Psychomotor - Purposeless Wandering' },
      { id: 'psych-complex-behavior', name: 'Psychomotor - Complex Automatic Behavior' },
      // Minor-type symptoms (brief episodes)
      { id: 'psych-random-motor', name: 'Psychomotor - Brief Random Motor Movements' },
      { id: 'psych-hallucination', name: 'Psychomotor - Hallucinations (Brief)' },
      { id: 'psych-perceptual-illusion', name: 'Psychomotor - Perceptual Illusions' },
      { id: 'psych-deja-vu', name: 'Psychomotor - Déjà Vu/Jamais Vu Episodes' },
      { id: 'psych-thinking-abnormality', name: 'Psychomotor - Abnormalities of Thinking' },
      { id: 'psych-memory-disturbance', name: 'Psychomotor - Memory Disturbance (Episodic)' },
      { id: 'psych-mood-change', name: 'Psychomotor - Sudden Mood Changes' },
      { id: 'psych-autonomic', name: 'Psychomotor - Autonomic Disturbances' },
      { id: 'psych-lip-smacking', name: 'Psychomotor - Oral Automatisms (Lip Smacking/Chewing)' },
      { id: 'psych-hand-movements', name: 'Psychomotor - Repetitive Hand Movements' },
    ]
  },
  {
    id: 'hearing',
    name: 'Hearing Symptoms',
    symptoms: [
      { id: 'hearing-loss-noticed', name: 'Hearing Loss - Difficulty Hearing' },
    ]
  },
  {
    id: 'radiculopathy',
    name: 'Radiculopathy Symptoms',
    symptoms: [
      { id: 'radiculopathy-pain', name: 'Radiculopathy - Radiating Pain' },
      { id: 'radiculopathy-numbness', name: 'Radiculopathy - Numbness' },
      { id: 'radiculopathy-tingling', name: 'Radiculopathy - Tingling' },
      { id: 'radiculopathy-weakness', name: 'Radiculopathy - Weakness' },
      { id: 'radiculopathy-burning', name: 'Radiculopathy - Burning Sensation' },
    ]
  },
  {
    id: 'peripheral-neuropathy',
    name: 'Peripheral Neuropathy Symptoms',
    symptoms: [
      { id: 'pn-numbness', name: 'Peripheral Neuropathy - Numbness' },
      { id: 'pn-tingling', name: 'Peripheral Neuropathy - Tingling' },
      { id: 'pn-burning', name: 'Peripheral Neuropathy - Burning' },
      { id: 'pn-pain', name: 'Peripheral Neuropathy - Pain' },
      { id: 'pn-weakness', name: 'Peripheral Neuropathy - Weakness' },
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    symptoms: [
      { id: 'shortness-breath', name: 'Shortness of Breath' },
      { id: 'cough', name: 'Chronic Cough' },
      { id: 'wheezing', name: 'Wheezing' },
    ]
  },
  {
    id: 'asthma',
    name: 'Asthma Symptoms',
    symptoms: [
      { id: 'asthma-attack', name: 'Asthma - Attack/Exacerbation' },
      { id: 'asthma-wheezing', name: 'Asthma - Wheezing' },
      { id: 'asthma-shortness-breath', name: 'Asthma - Shortness of Breath' },
      { id: 'asthma-cough', name: 'Asthma - Cough' },
      { id: 'asthma-chest-tightness', name: 'Asthma - Chest Tightness' },
      { id: 'asthma-rescue-inhaler', name: 'Asthma - Rescue Inhaler Use' },
      { id: 'asthma-er-visit', name: 'Asthma - ER Visit' },
      { id: 'asthma-md-visit', name: 'Asthma - Physician Visit for Exacerbation' },
    ]
  },
  {
    id: 'copd',
    name: 'COPD Symptoms',
    symptoms: [
      { id: 'copd-shortness-breath', name: 'COPD - Shortness of Breath' },
      { id: 'copd-chronic-cough', name: 'COPD - Chronic Cough' },
      { id: 'copd-sputum', name: 'COPD - Sputum Production' },
      { id: 'copd-wheezing', name: 'COPD - Wheezing' },
      { id: 'copd-exacerbation', name: 'COPD - Exacerbation/Flare' },
      { id: 'copd-oxygen-use', name: 'COPD - Supplemental Oxygen Use' },
      { id: 'copd-er-visit', name: 'COPD - ER Visit' },
      { id: 'copd-hospitalization', name: 'COPD - Hospitalization' },
    ]
  },
  {
    id: 'chronic-bronchitis',
    name: 'Chronic Bronchitis Symptoms',
    symptoms: [
      { id: 'bronchitis-productive-cough', name: 'Bronchitis - Productive Cough' },
      { id: 'bronchitis-sputum', name: 'Bronchitis - Sputum Production' },
      { id: 'bronchitis-shortness-breath', name: 'Bronchitis - Shortness of Breath' },
      { id: 'bronchitis-chest-discomfort', name: 'Bronchitis - Chest Discomfort' },
      { id: 'bronchitis-exacerbation', name: 'Bronchitis - Acute Exacerbation' },
      { id: 'bronchitis-oxygen-use', name: 'Bronchitis - Supplemental Oxygen Use' },
    ]
  },
  {
    id: 'emphysema',
    name: 'Emphysema Symptoms',
    symptoms: [
      { id: 'emphysema-shortness-breath', name: 'Emphysema - Shortness of Breath' },
      { id: 'emphysema-barrel-chest', name: 'Emphysema - Barrel Chest/Hyperinflation' },
      { id: 'emphysema-wheezing', name: 'Emphysema - Wheezing' },
      { id: 'emphysema-fatigue', name: 'Emphysema - Fatigue/Exercise Intolerance' },
      { id: 'emphysema-oxygen-use', name: 'Emphysema - Supplemental Oxygen Use' },
      { id: 'emphysema-exacerbation', name: 'Emphysema - Exacerbation' },
    ]
  },
  {
    id: 'rhinitis',
    name: 'Rhinitis Symptoms',
    symptoms: [
      { id: 'rhinitis-congestion', name: 'Rhinitis - Nasal Congestion' },
      { id: 'rhinitis-drainage', name: 'Rhinitis - Post-Nasal Drainage' },
      { id: 'rhinitis-sneezing', name: 'Rhinitis - Sneezing' },
      { id: 'rhinitis-breathing', name: 'Rhinitis - Breathing Difficulty' },
    ]
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis Symptoms',
    symptoms: [
      { id: 'sinusitis-facial-pain', name: 'Sinusitis - Facial Pain' },
      { id: 'sinusitis-pressure', name: 'Sinusitis - Sinus Pressure' },
      { id: 'sinusitis-congestion', name: 'Sinusitis - Nasal Congestion' },
      { id: 'sinusitis-headache', name: 'Sinusitis - Sinus Headache' },
      { id: 'sinusitis-drainage', name: 'Sinusitis - Post-Nasal Drainage' },
    ]
  },
  {
    id: 'digestive',
    name: 'Digestive',
    symptoms: [
      { id: 'gerd', name: 'GERD/Acid Reflux' },
      { id: 'nausea', name: 'Nausea' },
      { id: 'ibs', name: 'IBS Symptoms' },
    ]
  },
  {
    id: 'ibs',
    name: 'IBS Symptoms',
    symptoms: [
      { id: 'ibs-diarrhea', name: 'IBS - Diarrhea' },
      { id: 'ibs-constipation', name: 'IBS - Constipation' },
      { id: 'ibs-pain', name: 'IBS - Abdominal Pain' },
      { id: 'ibs-bloating', name: 'IBS - Bloating' },
      { id: 'ibs-urgency', name: 'IBS - Urgency' },
    ]
  },
  {
    id: 'gerd',
    name: 'GERD Symptoms',
    symptoms: [
      { id: 'gerd-heartburn', name: 'GERD - Heartburn' },
      { id: 'gerd-regurgitation', name: 'GERD - Regurgitation' },
      { id: 'gerd-chest-pain', name: 'GERD - Chest Pain' },
      { id: 'gerd-difficulty-swallowing', name: 'GERD - Difficulty Swallowing' },
      { id: 'gerd-nausea', name: 'GERD - Nausea' },
    ]
  },
  {
    id: 'gerd-complications',
    name: 'GERD Complications',
    symptoms: [
      { id: 'gerd-complication', name: 'GERD - Complications' },
    ]
  },
  {
    id: 'ulcerative-colitis',
    name: 'Ulcerative Colitis / IBD Symptoms',
    symptoms: [
      { id: 'uc-diarrhea', name: 'UC/IBD - Diarrhea Episode' },
      { id: 'uc-rectal-bleeding', name: 'UC/IBD - Rectal Bleeding' },
      { id: 'uc-abdominal-pain', name: 'UC/IBD - Abdominal Pain' },
      { id: 'uc-urgency', name: 'UC/IBD - Bowel Urgency' },
      { id: 'uc-incontinence', name: 'UC/IBD - Fecal Incontinence' },
      { id: 'uc-fever', name: 'UC/IBD - Fever/Systemic Symptoms' },
      { id: 'uc-hospitalization', name: 'UC/IBD - Hospitalization' },
    ]
  },
  {
    id: 'peptic-ulcer',
    name: 'Peptic Ulcer Symptoms',
    symptoms: [
      { id: 'ulcer-abdominal-pain', name: 'Peptic Ulcer - Abdominal Pain' },
      { id: 'ulcer-nausea', name: 'Peptic Ulcer - Nausea' },
      { id: 'ulcer-vomiting', name: 'Peptic Ulcer - Vomiting' },
      { id: 'ulcer-hematemesis', name: 'Peptic Ulcer - Vomiting Blood' },
      { id: 'ulcer-melena', name: 'Peptic Ulcer - Tarry Stools (Melena)' },
      { id: 'ulcer-hospitalization', name: 'Peptic Ulcer - Hospitalization' },
    ]
  },
  {
    id: 'hemorrhoids',
    name: 'Hemorrhoid Symptoms',
    symptoms: [
      { id: 'hemorrhoid-bleeding', name: 'Hemorrhoids - Bleeding' },
      { id: 'hemorrhoid-prolapse', name: 'Hemorrhoids - Prolapse' },
      { id: 'hemorrhoid-thrombosis', name: 'Hemorrhoids - Thrombosis Episode' },
      { id: 'hemorrhoid-pain', name: 'Hemorrhoids - Pain' },
    ]
  },
  {
    id: 'diverticulitis',
    name: 'Diverticulitis Symptoms',
    symptoms: [
      { id: 'divert-abdominal-pain', name: 'Diverticulitis - Abdominal Pain' },
      { id: 'divert-fever', name: 'Diverticulitis - Fever' },
      { id: 'divert-flare', name: 'Diverticulitis - Acute Flare/Attack' },
      { id: 'divert-hospitalization', name: 'Diverticulitis - Hospitalization' },
      { id: 'divert-complication', name: 'Diverticulitis - Complication (bleeding/abscess/obstruction)' },
    ]
  },
  {
    id: 'fatigue',
    name: 'Fatigue & Energy',
    symptoms: [
      { id: 'fatigue', name: 'Fatigue' },
      { id: 'weakness', name: 'Weakness' },
      { id: 'low-energy', name: 'Low Energy' },
    ]
  },
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Syndrome Symptoms',
    symptoms: [
      { id: 'cfs-fatigue', name: 'CFS - Debilitating Fatigue' },
      { id: 'cfs-cognitive', name: 'CFS - Cognitive Impairment (Brain Fog)' },
      { id: 'cfs-sleep', name: 'CFS - Sleep Disturbance' },
      { id: 'cfs-pain', name: 'CFS - Chronic Pain' },
      { id: 'cfs-headache', name: 'CFS - Headache' },
    ]
  },
  {
    id: 'ear-balance',
    name: 'Ear & Balance Symptoms',
    symptoms: [
      { id: 'menieres-vertigo', name: "Meniere's - Vertigo Attack" },
      { id: 'menieres-tinnitus', name: "Meniere's - Tinnitus" },
      { id: 'menieres-hearing-loss', name: "Meniere's - Hearing Loss/Fullness" },
      { id: 'menieres-nausea', name: "Meniere's - Nausea/Vomiting" },
    ]
  },
  {
    id: 'sleep-disorders',
    name: 'Sleep Disorders',
    symptoms: [
      { id: 'insomnia-difficulty-falling-asleep', name: 'Insomnia - Difficulty Falling Asleep' },
      { id: 'insomnia-difficulty-staying-asleep', name: 'Insomnia - Difficulty Staying Asleep' },
      { id: 'insomnia-early-waking', name: 'Insomnia - Early Morning Waking' },
      { id: 'insomnia-fatigue', name: 'Insomnia - Daytime Fatigue' },
      { id: 'insomnia-irritability', name: 'Insomnia - Irritability' },
    ]
  },
  {
    id: 'tbi',
    name: 'TBI/Cognitive Symptoms',
    symptoms: [
      { id: 'tbi-memory', name: 'Memory Problems' },
      { id: 'tbi-concentration', name: 'Difficulty Concentrating' },
      { id: 'tbi-confusion', name: 'Confusion/Disorientation' },
      { id: 'tbi-headache', name: 'Post-TBI Headache' },
      { id: 'tbi-mood', name: 'Mood Changes' },
      { id: 'tbi-sleep', name: 'Sleep Disturbance (TBI)' },
    ]
  },
  {
    id: 'tbi-residuals',
    name: 'TBI Residual Symptoms',
    symptoms: [
      { id: 'tbi-cognitive', name: 'TBI - Cognitive Difficulties' },
      { id: 'tbi-emotional', name: 'TBI - Emotional/Behavioral Changes' },
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    symptoms: [
      { id: 'high-blood-pressure', name: 'High Blood Pressure' },
      { id: 'hypertension-headache', name: 'Hypertension Headache' },
      { id: 'chest-pressure', name: 'Chest Pressure/Tightness' },
      { id: 'palpitations', name: 'Heart Palpitations' },
    ]
  },
  {
    id: 'dental',
    name: 'Dental/TMJ Symptoms',
    symptoms: [
      { id: 'tmj-pain', name: 'TMJ - Jaw Pain' },
      { id: 'tmj-clicking', name: 'TMJ - Clicking/Popping' },
      { id: 'tmj-limited-opening', name: 'TMJ - Limited Jaw Opening' },
      { id: 'tmj-locking', name: 'TMJ - Jaw Locking' },
      { id: 'tmj-headache', name: 'TMJ - Related Headache' },
    ]
  },
  {
    id: 'foot-ankle',
    name: 'Foot & Ankle Symptoms',
    symptoms: [
      { id: 'pf-heel-pain', name: 'Plantar Fasciitis - Heel Pain' },
      { id: 'pf-arch-pain', name: 'Plantar Fasciitis - Arch Pain' },
      { id: 'pf-morning-pain', name: 'Plantar Fasciitis - Morning Pain' },
      { id: 'pf-stiffness', name: 'Plantar Fasciitis - Stiffness' },
      { id: 'pf-difficulty-walking', name: 'Plantar Fasciitis - Difficulty Walking' },
    ]
  },
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia Symptoms',
    symptoms: [
      { id: 'fibro-widespread-pain', name: 'Widespread Pain' },
      { id: 'fibro-tender-points', name: 'Tender Point Pain' },
      { id: 'fibro-fatigue', name: 'Fibromyalgia Fatigue' },
      { id: 'fibro-sleep', name: 'Sleep Disturbance' },
      { id: 'fibro-stiffness', name: 'Morning Stiffness' },
      { id: 'fibro-cognitive', name: 'Fibro Fog (Cognitive Issues)' },
    ]
  },
  {
    id: 'back-spine',
    name: 'Back & Spine',
    symptoms: [
      { id: 'lower-back-pain', name: 'Lower Back Pain' },
      { id: 'back-stiffness', name: 'Back Stiffness' },
      { id: 'back-spasm', name: 'Back Muscle Spasm' },
      { id: 'back-radicular', name: 'Radiating Pain (Sciatica)' },
      { id: 'back-numbness', name: 'Back-Related Numbness' },
      { id: 'disc-pain', name: 'Disc-Related Pain' },
    ]
  },
  {
    id: 'shoulder',
    name: 'Shoulder Symptoms',
    symptoms: [
      { id: 'shoulder-pain', name: 'Shoulder - Pain' },
      { id: 'shoulder-limited-rom', name: 'Shoulder - Limited Range of Motion' },
      { id: 'shoulder-instability', name: 'Shoulder - Instability' },
      { id: 'shoulder-weakness', name: 'Shoulder - Weakness' },
      { id: 'shoulder-stiffness', name: 'Shoulder - Stiffness' },
    ]
  },
  {
    id: 'hip',
    name: 'Hip Symptoms',
    symptoms: [
      { id: 'hip-pain', name: 'Hip - Pain' },
      { id: 'hip-limited-rom', name: 'Hip - Limited Range of Motion' },
      { id: 'hip-stiffness', name: 'Hip - Stiffness' },
      { id: 'hip-weakness', name: 'Hip - Weakness' },
      { id: 'hip-limping', name: 'Hip - Limping/Gait Disturbance' },
    ]
  },
  {
    id: 'knee',
    name: 'Knee Symptoms',
    symptoms: [
      { id: 'knee-instability', name: 'Knee Instability/Giving Way' },
      { id: 'knee-swelling', name: 'Knee Swelling' },
      { id: 'knee-stiffness', name: 'Knee Stiffness' },
      { id: 'knee-locking', name: 'Knee Locking/Catching' },
      { id: 'knee-pain', name: 'Knee Pain' },
    ]
  },
  {
    id: 'ankle',
    name: 'Ankle Symptoms',
    symptoms: [
      { id: 'ankle-pain', name: 'Ankle - Pain' },
      { id: 'ankle-limited-rom', name: 'Ankle - Limited Range of Motion' },
      { id: 'ankle-stiffness', name: 'Ankle - Stiffness' },
      { id: 'ankle-instability', name: 'Ankle - Instability/Giving Way' },
      { id: 'ankle-swelling', name: 'Ankle - Swelling' },
      { id: 'ankle-weakness', name: 'Ankle - Weakness' },
    ]
  },
  {
    id: 'wrist',
    name: 'Wrist Symptoms',
    symptoms: [
      { id: 'wrist-pain', name: 'Wrist - Pain' },
      { id: 'wrist-limited-rom', name: 'Wrist - Limited Range of Motion' },
      { id: 'wrist-stiffness', name: 'Wrist - Stiffness' },
      { id: 'wrist-weakness', name: 'Wrist - Weakness' },
      { id: 'wrist-numbness', name: 'Wrist - Numbness/Tingling' },
      { id: 'wrist-swelling', name: 'Wrist - Swelling' },
    ]
  },
  {
    id: 'elbow',
    name: 'Elbow Symptoms',
    symptoms: [
      { id: 'elbow-pain', name: 'Elbow - Pain' },
      { id: 'elbow-limited-flexion', name: 'Elbow - Limited Flexion (Bending)' },
      { id: 'elbow-limited-extension', name: 'Elbow - Limited Extension (Straightening)' },
      { id: 'elbow-stiffness', name: 'Elbow - Stiffness' },
      { id: 'elbow-weakness', name: 'Elbow - Weakness' },
      { id: 'elbow-instability', name: 'Elbow - Instability' },
    ]
  },
  {
    id: 'arthritis',
    name: 'Arthritis (Degenerative)',
    symptoms: [
      { id: 'arthritis-joint-pain', name: 'Arthritis - Joint Pain' },
      { id: 'arthritis-morning-stiffness', name: 'Arthritis - Morning Stiffness' },
      { id: 'arthritis-flare', name: 'Arthritis - Flare-Up/Exacerbation' },
      { id: 'arthritis-reduced-function', name: 'Arthritis - Reduced Joint Function' },
      { id: 'arthritis-swelling', name: 'Arthritis - Joint Swelling' },
      { id: 'arthritis-crepitus', name: 'Arthritis - Grinding/Crepitus' },
    ]
  },
  // ============================================
  // PHASE 4A: GOUT (DC 5017)
  // Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
  // ============================================
  {
    id: 'gout',
    name: 'Gout (DC 5017)',
    symptoms: [
      { id: 'gout-acute-attack', name: 'Gout - Acute Attack/Flare' },
      { id: 'gout-joint-pain', name: 'Gout - Joint Pain' },
      { id: 'gout-swelling', name: 'Gout - Joint Swelling/Inflammation' },
      { id: 'gout-redness', name: 'Gout - Redness/Warmth at Joint' },
      { id: 'gout-limited-motion', name: 'Gout - Limited Range of Motion' },
      { id: 'gout-tophi', name: 'Gout - Tophi (Urate Deposits)' },
      { id: 'gout-tenderness', name: 'Gout - Joint Tenderness' },
      { id: 'gout-functional-loss', name: 'Gout - Functional Loss During Attack' },
    ]
  },
  // ============================================
  // PHASE 4A: BURSITIS (DC 5019)
  // Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
  // ============================================
  {
    id: 'bursitis',
    name: 'Bursitis (DC 5019)',
    symptoms: [
      { id: 'bursitis-pain', name: 'Bursitis - Pain at Joint' },
      { id: 'bursitis-swelling', name: 'Bursitis - Swelling' },
      { id: 'bursitis-tenderness', name: 'Bursitis - Tenderness on Pressure' },
      { id: 'bursitis-limited-motion', name: 'Bursitis - Limited Range of Motion' },
      { id: 'bursitis-stiffness', name: 'Bursitis - Joint Stiffness' },
      { id: 'bursitis-warmth', name: 'Bursitis - Warmth at Joint' },
      { id: 'bursitis-flare', name: 'Bursitis - Flare-Up/Exacerbation' },
      { id: 'bursitis-functional-loss', name: 'Bursitis - Functional Loss' },
    ]
  },
  // ============================================
  // PHASE 4A: TENDINITIS/TENOSYNOVITIS (DC 5024)
  // Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
  // ============================================
  {
    id: 'tendinitis',
    name: 'Tendinitis/Tenosynovitis (DC 5024)',
    symptoms: [
      { id: 'tendinitis-pain', name: 'Tendinitis - Pain Along Tendon' },
      { id: 'tendinitis-swelling', name: 'Tendinitis - Swelling' },
      { id: 'tendinitis-tenderness', name: 'Tendinitis - Tenderness to Touch' },
      { id: 'tendinitis-limited-motion', name: 'Tendinitis - Limited Range of Motion' },
      { id: 'tendinitis-stiffness', name: 'Tendinitis - Stiffness' },
      { id: 'tendinitis-crepitus', name: 'Tendinitis - Crepitus/Clicking' },
      { id: 'tendinitis-weakness', name: 'Tendinitis - Weakness in Affected Area' },
      { id: 'tendinitis-flare', name: 'Tendinitis - Flare-Up/Exacerbation' },
      { id: 'tendinitis-functional-loss', name: 'Tendinitis - Functional Loss' },
    ]
  },
  // ============================================
  // PHASE 4B: MYOSITIS (DC 5021)
  // Rated as degenerative arthritis per 38 CFR 4.71a Note to DCs 5013-5024
  // ============================================
  {
    id: 'myositis',
    name: 'Myositis (DC 5021)',
    symptoms: [
      { id: 'myositis-muscle-pain', name: 'Myositis - Muscle Pain' },
      { id: 'myositis-weakness', name: 'Myositis - Muscle Weakness' },
      { id: 'myositis-tenderness', name: 'Myositis - Muscle Tenderness' },
      { id: 'myositis-swelling', name: 'Myositis - Muscle Swelling' },
      { id: 'myositis-stiffness', name: 'Myositis - Stiffness' },
      { id: 'myositis-fatigue', name: 'Myositis - Fatigue' },
      { id: 'myositis-limited-motion', name: 'Myositis - Limited Range of Motion' },
      { id: 'myositis-flare', name: 'Myositis - Flare-Up/Exacerbation' },
      { id: 'myositis-functional-loss', name: 'Myositis - Functional Loss' },
    ]
  },
  // ============================================
  // PHASE 4B: OSTEOMYELITIS (DC 5000)
  // Has its own unique rating schedule
  // ============================================
  {
    id: 'osteomyelitis',
    name: 'Osteomyelitis (DC 5000)',
    symptoms: [
      { id: 'osteo-bone-pain', name: 'Osteomyelitis - Bone Pain' },
      { id: 'osteo-fever', name: 'Osteomyelitis - Fever/Chills' },
      { id: 'osteo-swelling', name: 'Osteomyelitis - Swelling at Site' },
      { id: 'osteo-redness', name: 'Osteomyelitis - Redness/Warmth' },
      { id: 'osteo-drainage', name: 'Osteomyelitis - Draining Sinus/Wound' },
      { id: 'osteo-fatigue', name: 'Osteomyelitis - Fatigue/Malaise' },
      { id: 'osteo-weight-loss', name: 'Osteomyelitis - Weight Loss' },
      { id: 'osteo-limited-motion', name: 'Osteomyelitis - Limited Joint Motion' },
      { id: 'osteo-flare', name: 'Osteomyelitis - Active Infection Episode' },
      { id: 'osteo-constitutional', name: 'Osteomyelitis - Constitutional Symptoms' },
    ]
  },
  // ============================================
  // PHASE 4B: MULTI-JOINT ARTHRITIS (DC 5002)
  // Rheumatoid arthritis, psoriatic arthritis, spondyloarthropathies
  // Has its own unique rating schedule for active process
  // ============================================
  {
    id: 'multi-joint-arthritis',
    name: 'Multi-Joint Arthritis (DC 5002)',
    symptoms: [
      { id: 'mja-joint-pain', name: 'Multi-Joint Arthritis - Joint Pain' },
      { id: 'mja-joint-swelling', name: 'Multi-Joint Arthritis - Joint Swelling' },
      { id: 'mja-morning-stiffness', name: 'Multi-Joint Arthritis - Morning Stiffness' },
      { id: 'mja-fatigue', name: 'Multi-Joint Arthritis - Fatigue' },
      { id: 'mja-weight-loss', name: 'Multi-Joint Arthritis - Weight Loss' },
      { id: 'mja-anemia', name: 'Multi-Joint Arthritis - Anemia Symptoms' },
      { id: 'mja-fever', name: 'Multi-Joint Arthritis - Low-Grade Fever' },
      { id: 'mja-flare', name: 'Multi-Joint Arthritis - Flare-Up/Exacerbation' },
      { id: 'mja-incapacitating', name: 'Multi-Joint Arthritis - Incapacitating Episode' },
      { id: 'mja-functional-loss', name: 'Multi-Joint Arthritis - Functional Loss' },
      { id: 'mja-limited-motion', name: 'Multi-Joint Arthritis - Limited Range of Motion' },
    ]
  },
  // ============================================
  // PHASE 4C: SPINE EXPANSION
  // DC 5235, 5236, 5238, 5240, 5241
  // All rated under General Rating Formula for Diseases and Injuries of the Spine
  // ============================================

  // Vertebral Fracture or Dislocation (DC 5235)
  {
    id: 'vertebral-fracture',
    name: 'Vertebral Fracture/Dislocation (DC 5235)',
    symptoms: [
      { id: 'vfx-pain', name: 'Vertebral Fracture - Pain at Fracture Site' },
      { id: 'vfx-limited-flexion', name: 'Vertebral Fracture - Limited Forward Flexion' },
      { id: 'vfx-limited-extension', name: 'Vertebral Fracture - Limited Extension' },
      { id: 'vfx-stiffness', name: 'Vertebral Fracture - Spinal Stiffness' },
      { id: 'vfx-muscle-spasm', name: 'Vertebral Fracture - Muscle Spasm' },
      { id: 'vfx-radicular', name: 'Vertebral Fracture - Radiating Pain' },
      { id: 'vfx-numbness', name: 'Vertebral Fracture - Numbness/Tingling' },
      { id: 'vfx-height-loss', name: 'Vertebral Fracture - Height Loss (Compression)' },
      { id: 'vfx-kyphosis', name: 'Vertebral Fracture - Kyphosis (Hunched Posture)' },
      { id: 'vfx-functional-loss', name: 'Vertebral Fracture - Functional Loss' },
    ]
  },

  // Sacroiliac Injury and Weakness (DC 5236)
  {
    id: 'sacroiliac',
    name: 'Sacroiliac Injury/Weakness (DC 5236)',
    symptoms: [
      { id: 'si-pain', name: 'Sacroiliac - Pain in SI Joint/Low Back' },
      { id: 'si-buttock-pain', name: 'Sacroiliac - Buttock Pain' },
      { id: 'si-hip-pain', name: 'Sacroiliac - Hip Pain (Referred)' },
      { id: 'si-groin-pain', name: 'Sacroiliac - Groin Pain (Referred)' },
      { id: 'si-leg-pain', name: 'Sacroiliac - Leg Pain (Referred)' },
      { id: 'si-stiffness', name: 'Sacroiliac - Morning Stiffness' },
      { id: 'si-instability', name: 'Sacroiliac - Joint Instability/Shifting' },
      { id: 'si-difficulty-sitting', name: 'Sacroiliac - Difficulty Sitting' },
      { id: 'si-difficulty-standing', name: 'Sacroiliac - Difficulty Standing from Seated' },
      { id: 'si-difficulty-walking', name: 'Sacroiliac - Difficulty Walking' },
      { id: 'si-limited-flexion', name: 'Sacroiliac - Limited Forward Flexion' },
      { id: 'si-functional-loss', name: 'Sacroiliac - Functional Loss' },
    ]
  },

  // Spinal Stenosis (DC 5238)
  {
    id: 'spinal-stenosis',
    name: 'Spinal Stenosis (DC 5238)',
    symptoms: [
      { id: 'ss-back-pain', name: 'Spinal Stenosis - Back Pain' },
      { id: 'ss-leg-pain', name: 'Spinal Stenosis - Leg Pain (Neurogenic Claudication)' },
      { id: 'ss-leg-weakness', name: 'Spinal Stenosis - Leg Weakness' },
      { id: 'ss-numbness', name: 'Spinal Stenosis - Numbness/Tingling' },
      { id: 'ss-walking-difficulty', name: 'Spinal Stenosis - Difficulty Walking (Limited Distance)' },
      { id: 'ss-relief-sitting', name: 'Spinal Stenosis - Relief with Sitting/Bending Forward' },
      { id: 'ss-balance-problems', name: 'Spinal Stenosis - Balance Problems' },
      { id: 'ss-limited-flexion', name: 'Spinal Stenosis - Limited Forward Flexion' },
      { id: 'ss-limited-extension', name: 'Spinal Stenosis - Limited Extension' },
      { id: 'ss-bladder-bowel', name: 'Spinal Stenosis - Bladder/Bowel Changes' },
      { id: 'ss-functional-loss', name: 'Spinal Stenosis - Functional Loss' },
    ]
  },

  // Ankylosing Spondylitis (DC 5240)
  {
    id: 'ankylosing-spondylitis',
    name: 'Ankylosing Spondylitis (DC 5240)',
    symptoms: [
      { id: 'as-back-pain', name: 'Ankylosing Spondylitis - Inflammatory Back Pain' },
      { id: 'as-morning-stiffness', name: 'Ankylosing Spondylitis - Morning Stiffness (>30 min)' },
      { id: 'as-night-pain', name: 'Ankylosing Spondylitis - Night Pain/Awakening' },
      { id: 'as-limited-flexion', name: 'Ankylosing Spondylitis - Limited Forward Flexion' },
      { id: 'as-limited-extension', name: 'Ankylosing Spondylitis - Limited Extension' },
      { id: 'as-limited-lateral', name: 'Ankylosing Spondylitis - Limited Lateral Flexion' },
      { id: 'as-chest-expansion', name: 'Ankylosing Spondylitis - Reduced Chest Expansion' },
      { id: 'as-fatigue', name: 'Ankylosing Spondylitis - Fatigue' },
      { id: 'as-peripheral-joint', name: 'Ankylosing Spondylitis - Peripheral Joint Pain' },
      { id: 'as-enthesitis', name: 'Ankylosing Spondylitis - Enthesitis (Tendon/Ligament Pain)' },
      { id: 'as-flare', name: 'Ankylosing Spondylitis - Flare-Up/Exacerbation' },
      { id: 'as-fusion', name: 'Ankylosing Spondylitis - Spinal Fusion Symptoms' },
      { id: 'as-functional-loss', name: 'Ankylosing Spondylitis - Functional Loss' },
    ]
  },

  // Spinal Fusion (DC 5241) - Post-surgical
  {
    id: 'spinal-fusion',
    name: 'Spinal Fusion (DC 5241)',
    symptoms: [
      { id: 'sf-pain', name: 'Spinal Fusion - Pain at Fusion Site' },
      { id: 'sf-adjacent-pain', name: 'Spinal Fusion - Adjacent Segment Pain' },
      { id: 'sf-stiffness', name: 'Spinal Fusion - Stiffness/Reduced Mobility' },
      { id: 'sf-limited-flexion', name: 'Spinal Fusion - Limited Forward Flexion' },
      { id: 'sf-limited-extension', name: 'Spinal Fusion - Limited Extension' },
      { id: 'sf-limited-rotation', name: 'Spinal Fusion - Limited Rotation' },
      { id: 'sf-muscle-spasm', name: 'Spinal Fusion - Muscle Spasm' },
      { id: 'sf-radicular', name: 'Spinal Fusion - Radiating Pain' },
      { id: 'sf-numbness', name: 'Spinal Fusion - Numbness/Tingling' },
      { id: 'sf-hardware-pain', name: 'Spinal Fusion - Hardware-Related Pain' },
      { id: 'sf-functional-loss', name: 'Spinal Fusion - Functional Loss' },
    ]
  },
  {
    id: 'skin',
    name: 'Skin Conditions',
    symptoms: [
      { id: 'scar-pain', name: 'Scar - Pain or Tenderness' },
      { id: 'scar-limitation', name: 'Scar - Movement Limitation' },
      { id: 'scar-disfigurement', name: 'Scar - Disfigurement' },
      { id: 'psoriasis-flare', name: 'Psoriasis Flare-Up' },
      { id: 'eczema-flare', name: 'Eczema/Dermatitis Flare-Up' },
    ]
  },
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism Symptoms',
    symptoms: [
      { id: 'hypo-fatigue', name: 'Hypothyroidism - Fatigue' },
      { id: 'hypo-cold-intolerance', name: 'Hypothyroidism - Cold Intolerance' },
      { id: 'hypo-weight-gain', name: 'Hypothyroidism - Weight Gain' },
      { id: 'hypo-depression', name: 'Hypothyroidism - Depression/Mental Fog' },
      { id: 'hypo-muscle-weakness', name: 'Hypothyroidism - Muscle Weakness' },
      { id: 'hypo-constipation', name: 'Hypothyroidism - Constipation' },
      { id: 'hypo-dry-skin', name: 'Hypothyroidism - Dry Skin/Hair' },
    ]
  },
  {
    id: 'raynauds',
    name: "Raynaud's Symptoms",
    symptoms: [
      { id: 'raynauds-attack', name: "Raynaud's - Color Change Attack" },
      { id: 'raynauds-numbness', name: "Raynaud's - Numbness/Tingling" },
      { id: 'raynauds-pain', name: "Raynaud's - Pain During Attack" },
      { id: 'raynauds-ulcer', name: "Raynaud's - Digital Ulcer" },
      { id: 'raynauds-cold-trigger', name: "Raynaud's - Cold-Triggered Episode" },
    ]
  },
  {
    id: 'varicose-veins',
    name: 'Varicose Vein Symptoms',
    symptoms: [
      { id: 'varicose-aching', name: 'Varicose Veins - Aching/Fatigue' },
      { id: 'varicose-edema', name: 'Varicose Veins - Leg Swelling/Edema' },
      { id: 'varicose-pigmentation', name: 'Varicose Veins - Skin Discoloration' },
      { id: 'varicose-ulcer', name: 'Varicose Veins - Skin Ulcer' },
      { id: 'varicose-pain', name: 'Varicose Veins - Pain at Rest' },
    ]
  },
  {
    id: 'urticaria',
    name: 'Chronic Urticaria Symptoms',
    symptoms: [
      { id: 'urticaria-outbreak', name: 'Urticaria - Hives Outbreak' },
      { id: 'urticaria-itching', name: 'Urticaria - Severe Itching' },
      { id: 'urticaria-swelling', name: 'Urticaria - Angioedema/Swelling' },
      { id: 'urticaria-medication', name: 'Urticaria - Required Medication Use' },
    ]
  },
  // Phase 3: Genitourinary Conditions
  {
    id: 'genitourinary',
    name: 'Genitourinary & Kidney',
    symptoms: [
      // Kidney/Renal symptoms
      { id: 'kidney-stones', name: 'Kidney Stones/Pain Episodes' },
      { id: 'kidney-pain', name: 'Kidney Pain (Flank Pain)' },
      { id: 'blood-in-urine', name: 'Blood in Urine (Hematuria)' },
      { id: 'kidney-infection', name: 'Kidney Infection Symptoms' },
      { id: 'renal-swelling', name: 'Swelling (Edema)' },
      { id: 'renal-fatigue', name: 'Fatigue (Kidney-Related)' },
      { id: 'renal-nausea', name: 'Nausea/Vomiting (Kidney-Related)' },
      { id: 'decreased-urination', name: 'Decreased Urination' },
      { id: 'foamy-urine', name: 'Foamy/Bubbly Urine' },
      { id: 'high-blood-pressure', name: 'High Blood Pressure (Kidney-Related)' },
      // Bladder/Voiding symptoms
      { id: 'urinary-frequency', name: 'Urinary Frequency' },
      { id: 'urinary-urgency', name: 'Urinary Urgency' },
      { id: 'painful-urination', name: 'Painful Urination (Dysuria)' },
      { id: 'urinary-incontinence', name: 'Urinary Incontinence' },
      { id: 'urine-retention', name: 'Urinary Retention' },
      { id: 'weak-stream', name: 'Weak Urine Stream' },
      { id: 'hesitancy', name: 'Urinary Hesitancy' },
      { id: 'nocturia', name: 'Nocturia (Nighttime Urination)' },
      { id: 'bladder-pain', name: 'Bladder Pain/Pressure' },
      { id: 'recurrent-uti', name: 'Recurrent UTI/Bladder Infections' },
      { id: 'incomplete-emptying', name: 'Incomplete Bladder Emptying' },
      // Prostate symptoms
      { id: 'prostate-symptoms', name: 'Prostate Symptoms (General)' },
      { id: 'prostate-pain', name: 'Prostate Pain/Discomfort' },
      // Reproductive symptoms
      { id: 'erectile-dysfunction', name: 'Erectile Dysfunction' },
      { id: 'testicular-pain', name: 'Testicular Pain' },
      { id: 'genital-pain', name: 'Genital Pain (General)' },
      // Bowel/Sphincter symptoms
      { id: 'fecal-incontinence', name: 'Fecal Incontinence' },
      { id: 'bowel-urgency', name: 'Bowel Urgency' },
      { id: 'bowel-frequency', name: 'Bowel Frequency (Diarrhea)' },
    ]
  },
  // Phase 2: Eye & Vision Conditions
  {
    id: 'eye-vision',
    name: 'Eye & Vision',
    symptoms: [
      { id: 'vision-loss', name: 'Vision Loss/Blurriness' },
      { id: 'glaucoma-symptoms', name: 'Glaucoma Symptoms' },
      { id: 'diabetic-retinopathy', name: 'Diabetic Retinopathy Symptoms' },
      { id: 'macular-degeneration', name: 'Macular Degeneration' },
      { id: 'eye-pain', name: 'Eye Pain' },
      { id: 'light-sensitivity', name: 'Light Sensitivity (Photophobia)' },
      { id: 'double-vision', name: 'Double Vision (Diplopia)' },
      { id: 'floaters', name: 'Floaters/Spots in Vision' },
      { id: 'peripheral-vision-loss', name: 'Peripheral Vision Loss' },
      { id: 'color-vision-changes', name: 'Color Vision Changes' },
      { id: 'night-blindness', name: 'Night Blindness' },
      { id: 'dry-eyes', name: 'Dry Eyes' },
      { id: 'eye-strain', name: 'Eye Strain/Fatigue' },
    ]
  },
  // Phase 4: Gynecological Conditions
  {
    id: 'gynecological',
    name: 'Gynecological',
    symptoms: [
      // Menstrual/Cycle symptoms
      { id: 'heavy-menstrual-bleeding', name: 'Heavy Menstrual Bleeding (Menorrhagia)' },
      { id: 'irregular-periods', name: 'Irregular Periods' },
      { id: 'painful-periods', name: 'Painful Periods (Dysmenorrhea)' },
      { id: 'absent-periods', name: 'Absent Periods (Amenorrhea)' },
      { id: 'prolonged-bleeding', name: 'Prolonged Menstrual Bleeding' },
      { id: 'intermenstrual-bleeding', name: 'Spotting Between Periods' },
      { id: 'premenstrual-syndrome', name: 'Premenstrual Syndrome (PMS)' },
      // Pelvic pain
      { id: 'chronic-pelvic-pain', name: 'Chronic Pelvic Pain' },
      { id: 'dyspareunia', name: 'Painful Intercourse (Dyspareunia)' },
      { id: 'lower-abdominal-pain', name: 'Lower Abdominal Pain' },
      { id: 'pain-bowel-movement', name: 'Pain with Bowel Movements (Gynecologic)' },
      { id: 'pain-urination-gyn', name: 'Pain with Urination (Gynecologic)' },
      // Endometriosis specific
      { id: 'endometriosis-pain', name: 'Endometriosis Pain' },
      { id: 'endometriosis-bowel', name: 'Endometriosis Bowel Symptoms' },
      { id: 'endometriosis-bladder', name: 'Endometriosis Bladder Symptoms' },
      // Ovarian/PCOS symptoms
      { id: 'ovarian-cysts', name: 'Ovarian Cyst Pain' },
      { id: 'polycystic-ovaries', name: 'Polycystic Ovary Symptoms' },
      { id: 'ovulation-pain', name: 'Ovulation Pain (Mittelschmerz)' },
      { id: 'anovulation', name: 'Anovulation/Irregular Ovulation' },
      // Infection/inflammation
      { id: 'pid-symptoms', name: 'Pelvic Inflammatory Disease Symptoms' },
      { id: 'abnormal-discharge', name: 'Abnormal Vaginal Discharge' },
      { id: 'cervicitis', name: 'Cervicitis Symptoms' },
      { id: 'vulvovaginitis', name: 'Vulvovaginitis' },
      { id: 'vaginal-irritation', name: 'Vaginal Irritation/Burning' },
      // Prolapse symptoms
      { id: 'pelvic-pressure', name: 'Pelvic Pressure/Heaviness' },
      { id: 'vaginal-bulge', name: 'Vaginal Bulge/Protrusion' },
      { id: 'incomplete-bladder-emptying', name: 'Incomplete Bladder Emptying (Prolapse)' },
      { id: 'bowel-dysfunction-prolapse', name: 'Bowel Dysfunction (Prolapse)' },
      // Sexual/reproductive function
      { id: 'sexual-dysfunction', name: 'Sexual Dysfunction' },
      { id: 'decreased-libido', name: 'Decreased Sexual Desire' },
      { id: 'arousal-difficulty', name: 'Arousal Difficulty' },
      { id: 'infertility', name: 'Infertility Concerns' },
      // PCOS metabolic symptoms
      { id: 'hirsutism', name: 'Excess Hair Growth (Hirsutism)' },
      { id: 'hormonal-acne', name: 'Hormonal Acne' },
      { id: 'pcos-weight-changes', name: 'PCOS-Related Weight Changes' },
      // Other gynecological
      { id: 'breast-pain', name: 'Breast Pain/Tenderness' },
      { id: 'nipple-discharge', name: 'Nipple Discharge' },
      { id: 'uterine-cramping', name: 'Uterine Cramping' },
    ]
  },
  // Phase 5: Hemic/Lymphatic Conditions
  {
    id: 'hemic-lymphatic',
    name: 'Hemic/Lymphatic',
    symptoms: [
      // General blood disorder symptoms
      { id: 'fatigue-blood', name: 'Fatigue (Blood Disorder)' },
      { id: 'weakness-blood', name: 'Weakness/Low Energy' },
      { id: 'dizziness-anemia', name: 'Dizziness/Lightheadedness' },
      { id: 'shortness-breath-anemia', name: 'Shortness of Breath (Anemia)' },
      { id: 'pale-skin', name: 'Pale Skin/Pallor' },
      { id: 'cold-hands-feet', name: 'Cold Hands/Feet' },
      { id: 'chest-pain-anemia', name: 'Chest Pain (Anemia)' },
      { id: 'rapid-heartbeat', name: 'Rapid/Irregular Heartbeat' },
      { id: 'headache-anemia', name: 'Headaches (Anemia)' },

      // Bleeding/bruising symptoms
      { id: 'easy-bruising', name: 'Easy Bruising' },
      { id: 'prolonged-bleeding', name: 'Prolonged Bleeding from Cuts' },
      { id: 'nosebleeds-frequent', name: 'Frequent Nosebleeds' },
      { id: 'bleeding-gums', name: 'Bleeding Gums' },
      { id: 'petechiae', name: 'Petechiae (Small Red Spots)' },
      { id: 'heavy-menstrual-bleeding-blood', name: 'Heavy Menstrual Bleeding (Blood Disorder)' },
      { id: 'blood-in-urine', name: 'Blood in Urine' },
      { id: 'blood-in-stool', name: 'Blood in Stool' },

      // Infection/immune symptoms
      { id: 'frequent-infections', name: 'Frequent Infections' },
      { id: 'recurring-infections', name: 'Recurring Infections' },
      { id: 'slow-healing-wounds', name: 'Slow Healing Wounds' },
      { id: 'fever-unexplained', name: 'Unexplained Fever' },
      { id: 'night-sweats-blood', name: 'Night Sweats (Blood Disorder)' },
      { id: 'chills-blood', name: 'Chills (Blood Disorder)' },

      // Lymphatic/spleen symptoms
      { id: 'swollen-lymph-nodes', name: 'Swollen Lymph Nodes' },
      { id: 'enlarged-spleen', name: 'Enlarged Spleen/Splenomegaly' },
      { id: 'abdominal-fullness', name: 'Abdominal Fullness/Bloating' },
      { id: 'left-upper-quadrant-pain', name: 'Left Upper Quadrant Pain' },

      // Sickle cell specific
      { id: 'sickle-cell-crisis', name: 'Sickle Cell Pain Crisis' },
      { id: 'bone-pain-sickle', name: 'Bone Pain (Sickle Cell)' },
      { id: 'joint-pain-sickle', name: 'Joint Pain (Sickle Cell)' },
      { id: 'chest-pain-sickle', name: 'Chest Pain (Acute Chest Syndrome)' },
      { id: 'priapism', name: 'Priapism' },
      { id: 'vision-changes-sickle', name: 'Vision Changes (Sickle Cell)' },
      { id: 'leg-ulcers', name: 'Leg Ulcers' },

      // Polycythemia/thrombocytosis symptoms
      { id: 'itching-after-bathing', name: 'Itching After Warm Bath' },
      { id: 'burning-hands-feet', name: 'Burning Pain in Hands/Feet' },
      { id: 'redness-skin', name: 'Redness of Skin' },
      { id: 'blurred-vision-blood', name: 'Blurred Vision (Blood Disorder)' },
      { id: 'headache-polycythemia', name: 'Headaches (Polycythemia)' },
      { id: 'tinnitus-blood', name: 'Ringing in Ears (Blood Disorder)' },
      { id: 'blood-clots', name: 'Blood Clots/Thrombosis' },

      // Leukemia/lymphoma symptoms
      { id: 'unexplained-weight-loss', name: 'Unexplained Weight Loss' },
      { id: 'loss-appetite', name: 'Loss of Appetite' },
      { id: 'bone-pain-leukemia', name: 'Bone Pain (Leukemia)' },
      { id: 'abdominal-pain-blood', name: 'Abdominal Pain (Blood Disorder)' },

      // Treatment-related symptoms
      { id: 'nausea-chemo', name: 'Nausea (Chemotherapy)' },
      { id: 'vomiting-chemo', name: 'Vomiting (Chemotherapy)' },
      { id: 'mouth-sores', name: 'Mouth Sores/Mucositis' },
      { id: 'hair-loss', name: 'Hair Loss' },
      { id: 'neuropathy-chemo', name: 'Neuropathy (Chemotherapy)' },
      { id: 'fatigue-chemo', name: 'Fatigue (Chemotherapy)' },

      // B12/neurological symptoms
      { id: 'numbness-tingling-b12', name: 'Numbness/Tingling (B12 Deficiency)' },
      { id: 'difficulty-walking', name: 'Difficulty Walking/Balance Problems' },
      { id: 'memory-problems-b12', name: 'Memory Problems (B12 Deficiency)' },
      { id: 'confusion-b12', name: 'Confusion (B12 Deficiency)' },
      { id: 'tongue-problems', name: 'Sore/Smooth Tongue' },

      // Other blood disorder symptoms
      { id: 'jaundice', name: 'Jaundice/Yellow Skin' },
      { id: 'dark-urine', name: 'Dark Urine' },
      { id: 'enlarged-liver', name: 'Enlarged Liver/Hepatomegaly' },
      { id: 'cough-blood', name: 'Coughing Up Blood' },
    ]
  },
  // Phase 6: Infectious Diseases
  {
    id: 'hiv-aids',
    name: 'HIV/AIDS Symptoms',
    symptoms: [
      { id: 'hiv-opportunistic-infection', name: 'Opportunistic Infection Episode' },
      { id: 'hiv-night-sweats', name: 'Night Sweats (HIV-related)' },
      { id: 'hiv-persistent-fever', name: 'Persistent Fever' },
      { id: 'hiv-weight-loss', name: 'Unintentional Weight Loss' },
      { id: 'hiv-chronic-diarrhea', name: 'Chronic Diarrhea' },
      { id: 'hiv-oral-thrush', name: 'Oral Thrush/Candidiasis' },
      { id: 'hiv-skin-lesions', name: 'Skin Lesions (Kaposi\'s Sarcoma)' },
      { id: 'hiv-lymphadenopathy', name: 'Swollen Lymph Nodes' },
      { id: 'hiv-fatigue', name: 'Severe Fatigue (HIV-related)' },
      { id: 'hiv-cognitive-impairment', name: 'Memory/Concentration Problems' },
    ]
  },
  {
    id: 'hepatitis',
    name: 'Hepatitis Symptoms',
    symptoms: [
      { id: 'hep-jaundice', name: 'Jaundice (Yellowing)' },
      { id: 'hep-fatigue', name: 'Fatigue (Liver-related)' },
      { id: 'hep-abdominal-pain', name: 'Abdominal Pain (Right Upper)' },
      { id: 'hep-nausea', name: 'Nausea/Vomiting' },
      { id: 'hep-dark-urine', name: 'Dark Urine' },
      { id: 'hep-pale-stool', name: 'Pale/Clay-colored Stool' },
      { id: 'hep-ascites', name: 'Abdominal Swelling (Ascites)' },
      { id: 'hep-bruising', name: 'Easy Bruising/Bleeding' },
      { id: 'hep-confusion', name: 'Confusion (Hepatic Encephalopathy)' },
      { id: 'hep-spider-angiomas', name: 'Spider Angiomas (Skin)' },
    ]
  },
  {
    id: 'lyme-disease',
    name: 'Lyme Disease Symptoms',
    symptoms: [
      { id: 'lyme-rash', name: 'Bull\'s-Eye Rash (Erythema Migrans)' },
      { id: 'lyme-joint-pain', name: 'Joint Pain/Swelling' },
      { id: 'lyme-facial-palsy', name: 'Facial Palsy (Bell\'s Palsy)' },
      { id: 'lyme-heart-palpitations', name: 'Heart Palpitations' },
      { id: 'lyme-dizziness', name: 'Dizziness/Lightheadedness' },
      { id: 'lyme-memory-problems', name: 'Memory Problems' },
      { id: 'lyme-nerve-pain', name: 'Nerve Pain/Tingling' },
      { id: 'lyme-chronic-fatigue', name: 'Chronic Fatigue' },
      { id: 'lyme-headaches', name: 'Severe Headaches' },
      { id: 'lyme-muscle-aches', name: 'Muscle Aches' },
    ]
  },
  {
    id: 'malaria',
    name: 'Malaria Symptoms',
    symptoms: [
      { id: 'malaria-fever-spike', name: 'Fever Spike (Cyclical)' },
      { id: 'malaria-chills', name: 'Chills/Rigors' },
      { id: 'malaria-sweating', name: 'Profuse Sweating' },
      { id: 'malaria-headache', name: 'Severe Headache' },
      { id: 'malaria-nausea', name: 'Nausea/Vomiting' },
      { id: 'malaria-muscle-pain', name: 'Muscle Pain' },
      { id: 'malaria-fatigue', name: 'Extreme Fatigue' },
      { id: 'malaria-anemia', name: 'Anemia Symptoms' },
    ]
  },
  {
    id: 'gulf-war-infectious',
    name: 'Post-Infectious Syndromes',
    symptoms: [
      { id: 'post-inf-arthritis', name: 'Post-Infectious Arthritis' },
      { id: 'post-inf-gi-symptoms', name: 'Chronic GI Symptoms' },
      { id: 'post-inf-neurological', name: 'Neurological Symptoms' },
      { id: 'post-inf-chronic-weakness', name: 'Chronic Weakness' },
      { id: 'post-inf-joint-swelling', name: 'Reactive Joint Swelling' },
      { id: 'west-nile-weakness', name: 'West Nile - Muscle Weakness' },
      { id: 'west-nile-cognitive', name: 'West Nile - Cognitive Problems' },
    ]
  },
  {
    id: 'general-infectious',
    name: 'General Infectious Disease Symptoms',
    symptoms: [
      { id: 'inf-fever', name: 'Fever' },
      { id: 'inf-chills', name: 'Chills' },
      { id: 'inf-fatigue', name: 'Fatigue (Infection-related)' },
      { id: 'inf-body-aches', name: 'Body Aches' },
      { id: 'inf-night-sweats', name: 'Night Sweats' },
      { id: 'inf-weight-loss', name: 'Weight Loss' },
      { id: 'inf-swollen-lymph-nodes', name: 'Swollen Lymph Nodes' },
      { id: 'inf-rash', name: 'Rash' },
    ]
  },
  // Phase 6: Brucellosis
  {
    id: 'brucellosis',
    name: 'Brucellosis Symptoms',
    symptoms: [
      { id: 'brucellosis-fever', name: 'Brucellosis - Undulant Fever' },
      { id: 'brucellosis-night-sweats', name: 'Brucellosis - Night Sweats' },
      { id: 'brucellosis-fatigue', name: 'Brucellosis - Fatigue' },
      { id: 'brucellosis-joint-pain', name: 'Brucellosis - Joint Pain' },
      { id: 'brucellosis-muscle-aches', name: 'Brucellosis - Muscle Aches' },
      { id: 'brucellosis-headache', name: 'Brucellosis - Headache' },
      { id: 'brucellosis-back-pain', name: 'Brucellosis - Back Pain (Spondylitis)' },
      { id: 'brucellosis-weight-loss', name: 'Brucellosis - Weight Loss' },
      { id: 'brucellosis-depression', name: 'Brucellosis - Depression/Mood Changes' },
      { id: 'brucellosis-liver-spleen', name: 'Brucellosis - Liver/Spleen Enlargement' },
    ]
  },
  // Phase 6: Campylobacter jejuni
  {
    id: 'campylobacter',
    name: 'Campylobacter jejuni Symptoms',
    symptoms: [
      { id: 'campylobacter-diarrhea', name: 'Campylobacter - Diarrhea' },
      { id: 'campylobacter-abdominal-pain', name: 'Campylobacter - Abdominal Pain' },
      { id: 'campylobacter-fever', name: 'Campylobacter - Fever' },
      { id: 'campylobacter-nausea', name: 'Campylobacter - Nausea' },
      { id: 'campylobacter-vomiting', name: 'Campylobacter - Vomiting' },
      { id: 'campylobacter-bloody-stool', name: 'Campylobacter - Bloody Stool' },
      { id: 'campylobacter-fatigue', name: 'Campylobacter - Fatigue' },
      { id: 'campylobacter-joint-pain', name: 'Campylobacter - Joint Pain (Reactive Arthritis)' },
      { id: 'campylobacter-muscle-weakness', name: 'Campylobacter - Muscle Weakness' },
      { id: 'campylobacter-nerve-symptoms', name: 'Campylobacter - Nerve Symptoms (Numbness/Tingling)' },
    ]
  },
  // Phase 6: Q Fever
  {
    id: 'q-fever',
    name: 'Q Fever Symptoms',
    symptoms: [
      { id: 'q-fever-fever', name: 'Q Fever - Fever' },
      { id: 'q-fever-headache', name: 'Q Fever - Headache' },
      { id: 'q-fever-fatigue', name: 'Q Fever - Fatigue' },
      { id: 'q-fever-muscle-aches', name: 'Q Fever - Muscle Aches' },
      { id: 'q-fever-cough', name: 'Q Fever - Cough' },
      { id: 'q-fever-chest-pain', name: 'Q Fever - Chest Pain' },
      { id: 'q-fever-night-sweats', name: 'Q Fever - Night Sweats' },
      { id: 'q-fever-chills', name: 'Q Fever - Chills' },
      { id: 'q-fever-shortness-breath', name: 'Q Fever - Shortness of Breath' },
      { id: 'q-fever-joint-pain', name: 'Q Fever - Joint Pain' },
    ]
  },
  // Phase 6: Salmonella
  {
    id: 'salmonella',
    name: 'Nontyphoid Salmonella Symptoms',
    symptoms: [
      { id: 'salmonella-diarrhea', name: 'Salmonella - Diarrhea' },
      { id: 'salmonella-fever', name: 'Salmonella - Fever' },
      { id: 'salmonella-abdominal-cramps', name: 'Salmonella - Abdominal Cramps' },
      { id: 'salmonella-nausea', name: 'Salmonella - Nausea' },
      { id: 'salmonella-vomiting', name: 'Salmonella - Vomiting' },
      { id: 'salmonella-bloody-stool', name: 'Salmonella - Bloody Stool' },
      { id: 'salmonella-joint-pain', name: 'Salmonella - Joint Pain (Reactive Arthritis)' },
      { id: 'salmonella-bacteremia', name: 'Salmonella - Bacteremia/Sepsis' },
      { id: 'salmonella-dehydration', name: 'Salmonella - Dehydration' },
      { id: 'salmonella-fatigue', name: 'Salmonella - Fatigue' },
    ]
  },
  // Phase 6: Shigella
  {
    id: 'shigella',
    name: 'Shigella Symptoms',
    symptoms: [
      { id: 'shigella-diarrhea', name: 'Shigella - Diarrhea' },
      { id: 'shigella-bloody-stool', name: 'Shigella - Bloody Stool (Dysentery)' },
      { id: 'shigella-abdominal-cramps', name: 'Shigella - Abdominal Cramps' },
      { id: 'shigella-fever', name: 'Shigella - Fever' },
      { id: 'shigella-tenesmus', name: 'Shigella - Tenesmus (Painful Straining)' },
      { id: 'shigella-nausea', name: 'Shigella - Nausea' },
      { id: 'shigella-vomiting', name: 'Shigella - Vomiting' },
      { id: 'shigella-dehydration', name: 'Shigella - Dehydration' },
      { id: 'shigella-reactive-arthritis', name: 'Shigella - Reactive Arthritis' },
      { id: 'shigella-seizures', name: 'Shigella - Seizures' },
    ]
  },
  // Phase 6: West Nile Virus
  {
    id: 'west-nile',
    name: 'West Nile Virus Symptoms',
    symptoms: [
      { id: 'west-nile-fever', name: 'West Nile - Fever' },
      { id: 'west-nile-headache', name: 'West Nile - Headache' },
      { id: 'west-nile-body-aches', name: 'West Nile - Body Aches' },
      { id: 'west-nile-fatigue', name: 'West Nile - Fatigue' },
      { id: 'west-nile-weakness', name: 'West Nile - Muscle Weakness' },
      { id: 'west-nile-cognitive', name: 'West Nile - Cognitive Problems' },
      { id: 'west-nile-tremors', name: 'West Nile - Tremors' },
      { id: 'west-nile-vision-problems', name: 'West Nile - Vision Problems' },
      { id: 'west-nile-numbness', name: 'West Nile - Numbness/Tingling' },
      { id: 'west-nile-paralysis', name: 'West Nile - Paralysis (Acute Flaccid)' },
    ]
  },
  // Phase 6: Nontuberculous Mycobacterium
  {
    id: 'ntm',
    name: 'NTM (Nontuberculous Mycobacterium) Symptoms',
    symptoms: [
      { id: 'ntm-cough', name: 'NTM - Chronic Cough' },
      { id: 'ntm-sputum', name: 'NTM - Sputum Production' },
      { id: 'ntm-fatigue', name: 'NTM - Fatigue' },
      { id: 'ntm-fever', name: 'NTM - Fever' },
      { id: 'ntm-night-sweats', name: 'NTM - Night Sweats' },
      { id: 'ntm-weight-loss', name: 'NTM - Weight Loss' },
      { id: 'ntm-chest-pain', name: 'NTM - Chest Pain' },
      { id: 'ntm-shortness-breath', name: 'NTM - Shortness of Breath' },
      { id: 'ntm-hemoptysis', name: 'NTM - Hemoptysis (Coughing Blood)' },
      { id: 'ntm-lymph-nodes', name: 'NTM - Swollen Lymph Nodes' },
    ]
  },
  // Phase 7: Dental/Oral Conditions (DC 9900s)
  {
    id: 'dental-oral',
    name: 'Dental & Oral',
    symptoms: [
      // Jaw/TMJ symptoms (TMJ already exists, these are additional)
      { id: 'jaw-pain', name: 'Jaw Pain (Non-TMJ)' },
      { id: 'jaw-swelling', name: 'Jaw Swelling' },
      { id: 'jaw-stiffness', name: 'Jaw Stiffness' },
      { id: 'limited-mouth-opening', name: 'Limited Mouth Opening' },
      { id: 'jaw-deviation', name: 'Jaw Deviation/Misalignment' },

      // Bone/structural issues
      { id: 'bone-pain-jaw', name: 'Bone Pain (Jaw/Maxilla/Mandible)' },
      { id: 'jaw-infection', name: 'Jaw Infection Symptoms' },
      { id: 'osteomyelitis-symptoms', name: 'Osteomyelitis Symptoms' },
      { id: 'bone-exposure', name: 'Exposed Bone (Jaw)' },
      { id: 'jaw-drainage', name: 'Drainage from Jaw/Bone' },
      { id: 'jaw-instability', name: 'Jaw Instability/Movement' },
      { id: 'facial-asymmetry', name: 'Facial Asymmetry' },

      // Dental/tooth issues
      { id: 'tooth-loss-pain', name: 'Pain from Tooth Loss Site' },
      { id: 'missing-teeth', name: 'Missing Teeth (Document Count)' },
      { id: 'loose-teeth', name: 'Loose Teeth' },
      { id: 'tooth-sensitivity', name: 'Tooth Sensitivity' },
      { id: 'dental-abscess', name: 'Dental Abscess' },
      { id: 'gum-pain', name: 'Gum Pain' },
      { id: 'gum-bleeding', name: 'Bleeding Gums' },
      { id: 'gum-recession', name: 'Gum Recession' },

      // Palate issues
      { id: 'palate-pain', name: 'Hard Palate Pain' },
      { id: 'palate-ulcers', name: 'Palate Ulcers/Sores' },
      { id: 'palate-infection', name: 'Palate Infection' },

      // Mastication/eating difficulties
      { id: 'chewing-difficulty', name: 'Difficulty Chewing' },
      { id: 'chewing-pain', name: 'Pain with Chewing' },
      { id: 'bite-problems', name: 'Bite Alignment Problems' },
      { id: 'food-impaction', name: 'Food Impaction/Trapping' },
      { id: 'mastication-fatigue', name: 'Jaw Fatigue with Eating' },

      // Swallowing/tongue issues
      { id: 'swallowing-difficulty', name: 'Difficulty Swallowing (Dysphagia)' },
      { id: 'swallowing-pain', name: 'Painful Swallowing' },
      { id: 'tongue-pain', name: 'Tongue Pain' },
      { id: 'tongue-swelling', name: 'Tongue Swelling' },
      { id: 'tongue-lesions', name: 'Tongue Lesions/Ulcers' },
      { id: 'tongue-movement', name: 'Limited Tongue Movement' },

      // Oral tissue/mucosa
      { id: 'mouth-sores', name: 'Mouth Sores/Ulcers' },
      { id: 'oral-bleeding', name: 'Oral Bleeding' },
      { id: 'dry-mouth', name: 'Dry Mouth (Xerostomia)' },
      { id: 'oral-burning', name: 'Burning Mouth Sensation' },
      { id: 'oral-tissue-changes', name: 'Oral Tissue Changes/Lesions' },

      // Lip issues
      { id: 'lip-pain', name: 'Lip Pain' },
      { id: 'lip-swelling', name: 'Lip Swelling' },
      { id: 'lip-lesions', name: 'Lip Lesions/Cracks' },

      // Neoplasm/tumor symptoms
      { id: 'oral-mass', name: 'Oral Mass/Lump' },
      { id: 'oral-growth', name: 'Oral Growth/Tumor' },
      { id: 'tissue-thickening', name: 'Tissue Thickening (Oral)' },

      // Infection/inflammation
      { id: 'oral-infection', name: 'Oral Infection' },
      { id: 'oral-inflammation', name: 'Oral Inflammation' },
      { id: 'bad-taste', name: 'Persistent Bad Taste' },
      { id: 'halitosis', name: 'Halitosis (Bad Breath)' },

      // Speech/function
      { id: 'speech-difficulty', name: 'Speech Difficulty (Dental/Oral)' },
      { id: 'articulation-problems', name: 'Articulation Problems' },

      // Prosthetic issues
      { id: 'prosthesis-pain', name: 'Pain from Dental Prosthesis' },
      { id: 'prosthesis-fit', name: 'Ill-Fitting Prosthesis' },
      { id: 'prosthesis-sores', name: 'Sores from Prosthesis' },
    ]
  },
  // Phase 8A: Somatic Symptom Disorders
  {
    id: 'somatic-symptom-disorder',
    name: 'Somatic Symptom Disorder',
    symptoms: [
      { id: 'somatic-pain', name: 'Somatic - Chronic Pain Preoccupation' },
      { id: 'somatic-excessive-worry', name: 'Somatic - Excessive Worry About Health' },
      { id: 'somatic-multiple-symptoms', name: 'Somatic - Multiple Physical Symptoms' },
      { id: 'somatic-doctor-visits', name: 'Somatic - Frequent Doctor Visits' },
      { id: 'somatic-functional-impairment', name: 'Somatic - Functional Impairment from Symptoms' },
    ]
  },
  {
    id: 'illness-anxiety',
    name: 'Illness Anxiety Disorder',
    symptoms: [
      { id: 'illness-anxiety-fear', name: 'Illness Anxiety - Fear of Having Serious Illness' },
      { id: 'illness-anxiety-body-checking', name: 'Illness Anxiety - Excessive Body Checking' },
      { id: 'illness-anxiety-reassurance', name: 'Illness Anxiety - Reassurance Seeking' },
      { id: 'illness-anxiety-avoidance', name: 'Illness Anxiety - Medical Appointment Avoidance' },
      { id: 'illness-anxiety-distress', name: 'Illness Anxiety - High Anxiety About Health' },
    ]
  },
  // Phase 8A: Cyclothymic Disorder
  {
    id: 'cyclothymic',
    name: 'Cyclothymic Disorder Symptoms',
    symptoms: [
      { id: 'cyclothymic-hypomanic', name: 'Cyclothymic - Hypomanic Symptoms' },
      { id: 'cyclothymic-depressive', name: 'Cyclothymic - Depressive Symptoms' },
      { id: 'cyclothymic-mood-swing', name: 'Cyclothymic - Mood Swings' },
      { id: 'cyclothymic-irritability', name: 'Cyclothymic - Irritability' },
    ]
  },
  // Phase 8A: Depersonalization/Derealization
  {
    id: 'depersonalization',
    name: 'Depersonalization/Derealization Symptoms',
    symptoms: [
      { id: 'depersonalization-detachment', name: 'Depersonalization - Feeling Detached from Self' },
      { id: 'derealization-unreality', name: 'Derealization - Surroundings Feel Unreal' },
      { id: 'depersonalization-robot', name: 'Depersonalization - Feeling Like Robot/Autopilot' },
      { id: 'depersonalization-distress', name: 'Depersonalization - Distress from Episodes' },
    ]
  },
  // Phase 8A: Eating Disorders
  {
    id: 'anorexia-nervosa',
    name: 'Anorexia Nervosa Symptoms',
    symptoms: [
      { id: 'anorexia-restricted-eating', name: 'Anorexia - Restricted Food Intake' },
      { id: 'anorexia-weight-loss', name: 'Anorexia - Significant Weight Loss' },
      { id: 'anorexia-fear-weight-gain', name: 'Anorexia - Intense Fear of Weight Gain' },
      { id: 'anorexia-body-image', name: 'Anorexia - Distorted Body Image' },
      { id: 'anorexia-incapacitating-episode', name: 'Anorexia - Incapacitating Episode (Bed Rest Required)' },
      { id: 'anorexia-hospitalization', name: 'Anorexia - Hospitalization' },
    ]
  },
  {
    id: 'bulimia-nervosa',
    name: 'Bulimia Nervosa Symptoms',
    symptoms: [
      { id: 'bulimia-binge-eating', name: 'Bulimia - Binge Eating Episode' },
      { id: 'bulimia-purging', name: 'Bulimia - Purging (Vomiting)' },
      { id: 'bulimia-compensatory', name: 'Bulimia - Other Compensatory Behaviors' },
      { id: 'bulimia-body-image', name: 'Bulimia - Body Image Concerns' },
      { id: 'bulimia-incapacitating-episode', name: 'Bulimia - Incapacitating Episode (Bed Rest Required)' },
      { id: 'bulimia-hospitalization', name: 'Bulimia - Hospitalization' },
    ]
  },
  // PHASE 8B: ADDITIONAL MENTAL HEALTH CONDITIONS
  // Schizophrenia (DC 9201)
  {
    id: 'schizophrenia',
    name: 'Schizophrenia',
    symptoms: [
      { id: 'schizophrenia-hallucinations', name: 'Schizophrenia - Hallucinations', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-delusions', name: 'Schizophrenia - Delusions', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-disorganized-speech', name: 'Schizophrenia - Disorganized Speech', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-disorganized-behavior', name: 'Schizophrenia - Disorganized/Catatonic Behavior', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-negative-symptoms', name: 'Schizophrenia - Negative Symptoms', category: 'Schizophrenia Spectrum Symptoms' },
    ]
  },

  // Schizoaffective Disorder (DC 9202)
  {
    id: 'schizoaffective-disorder',
    name: 'Schizoaffective Disorder',
    symptoms: [
      { id: 'schizophrenia-hallucinations', name: 'Schizophrenia - Hallucinations', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-delusions', name: 'Schizophrenia - Delusions', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizoaffective-mood-episodes', name: 'Schizoaffective - Mood Episodes', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'psychotic-episode', name: 'Psychotic Episode', category: 'Schizophrenia Spectrum Symptoms' },
    ]
  },

  // Delusional Disorder (DC 9203)
  {
    id: 'delusional-disorder',
    name: 'Delusional Disorder',
    symptoms: [
      { id: 'schizophrenia-delusions', name: 'Schizophrenia - Delusions', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'psychotic-episode', name: 'Psychotic Episode', category: 'Schizophrenia Spectrum Symptoms' },
    ]
  },

  // Psychotic Disorder NOS (DC 9204)
  {
    id: 'psychotic-disorder-nos',
    name: 'Psychotic Disorder NOS',
    symptoms: [
      { id: 'psychotic-episode', name: 'Psychotic Episode', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-hallucinations', name: 'Schizophrenia - Hallucinations', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-delusions', name: 'Schizophrenia - Delusions', category: 'Schizophrenia Spectrum Symptoms' },
    ]
  },

  // Brief Psychotic Disorder (DC 9205)
  {
    id: 'brief-psychotic-disorder',
    name: 'Brief Psychotic Disorder',
    symptoms: [
      { id: 'brief-psychotic-episode', name: 'Brief Psychotic Episode (<1 month)', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-hallucinations', name: 'Schizophrenia - Hallucinations', category: 'Schizophrenia Spectrum Symptoms' },
      { id: 'schizophrenia-delusions', name: 'Schizophrenia - Delusions', category: 'Schizophrenia Spectrum Symptoms' },
    ]
  },

  // Binge Eating Disorder (DC 9520)
  {
    id: 'binge-eating-disorder',
    name: 'Binge Eating Disorder',
    symptoms: [
      { id: 'binge-eating-episode', name: 'Binge Eating - Episode', category: 'Binge Eating Disorder Symptoms' },
      { id: 'binge-eating-loss-of-control', name: 'Binge Eating - Loss of Control', category: 'Binge Eating Disorder Symptoms' },
      { id: 'binge-eating-distress', name: 'Binge Eating - Significant Distress', category: 'Binge Eating Disorder Symptoms' },
    ]
  },

  // Dissociative Identity Disorder (DC 9416)
  {
    id: 'dissociative-identity-disorder',
    name: 'Dissociative Identity Disorder',
    symptoms: [
      { id: 'dissociative-identity-switching', name: 'Dissociative Identity - Identity Switching', category: 'Dissociative Disorder Symptoms' },
      { id: 'dissociative-amnesia-episode', name: 'Dissociative Amnesia - Memory Gap', category: 'Dissociative Disorder Symptoms' },
      { id: 'dissociative-fugue', name: 'Dissociative - Fugue State', category: 'Dissociative Disorder Symptoms' },
      { id: 'dissociative-time-loss', name: 'Dissociative - Lost Time', category: 'Dissociative Disorder Symptoms' },
    ]
  },

  // Dissociative Amnesia (DC 9417) - shares symptoms with DID
  {
    id: 'dissociative-amnesia',
    name: 'Dissociative Amnesia',
    symptoms: [
      { id: 'dissociative-amnesia-episode', name: 'Dissociative Amnesia - Memory Gap', category: 'Dissociative Disorder Symptoms' },
      { id: 'dissociative-fugue', name: 'Dissociative - Fugue State', category: 'Dissociative Disorder Symptoms' },
      { id: 'dissociative-time-loss', name: 'Dissociative - Lost Time', category: 'Dissociative Disorder Symptoms' },
    ]
  },

  // Acute Stress Disorder (DC 9413)
  {
    id: 'acute-stress-disorder',
    name: 'Acute Stress Disorder',
    symptoms: [
      { id: 'acute-stress-intrusion', name: 'Acute Stress - Intrusive Memories', category: 'Acute Stress Disorder Symptoms' },
      { id: 'acute-stress-avoidance', name: 'Acute Stress - Avoidance', category: 'Acute Stress Disorder Symptoms' },
      { id: 'acute-stress-arousal', name: 'Acute Stress - Hyperarousal', category: 'Acute Stress Disorder Symptoms' },
      { id: 'acute-stress-dissociation', name: 'Acute Stress - Dissociative Symptoms', category: 'Acute Stress Disorder Symptoms' },
    ]
  },

  // Antisocial Personality Disorder (DC 9301)
  {
    id: 'antisocial-personality-disorder',
    name: 'Antisocial Personality Disorder',
    symptoms: [
      { id: 'personality-antisocial-behaviors', name: 'Antisocial Personality - Disregard for Others', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-occupational-impairment', name: 'Personality Disorder - Occupational Impairment', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-social-impairment', name: 'Personality Disorder - Social Impairment', category: 'Personality Disorder Symptoms' },
    ]
  },

  // Borderline Personality Disorder (DC 9301)
  {
    id: 'borderline-personality-disorder',
    name: 'Borderline Personality Disorder',
    symptoms: [
      { id: 'personality-borderline-instability', name: 'Borderline Personality - Emotional Instability', category: 'Personality Disorder Symptoms' },
      { id: 'personality-borderline-fear-abandonment', name: 'Borderline Personality - Fear of Abandonment', category: 'Personality Disorder Symptoms' },
      { id: 'personality-borderline-self-harm', name: 'Borderline Personality - Self-Harm/Suicidal Behavior', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-occupational-impairment', name: 'Personality Disorder - Occupational Impairment', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-social-impairment', name: 'Personality Disorder - Social Impairment', category: 'Personality Disorder Symptoms' },
    ]
  },

  // Narcissistic Personality Disorder (DC 9301)
  {
    id: 'narcissistic-personality-disorder',
    name: 'Narcissistic Personality Disorder',
    symptoms: [
      { id: 'personality-narcissistic-grandiosity', name: 'Narcissistic Personality - Grandiosity', category: 'Personality Disorder Symptoms' },
      { id: 'personality-narcissistic-lack-empathy', name: 'Narcissistic Personality - Lack of Empathy', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-occupational-impairment', name: 'Personality Disorder - Occupational Impairment', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-social-impairment', name: 'Personality Disorder - Social Impairment', category: 'Personality Disorder Symptoms' },
    ]
  },

  // Avoidant Personality Disorder (DC 9301)
  {
    id: 'avoidant-personality-disorder',
    name: 'Avoidant Personality Disorder',
    symptoms: [
      { id: 'personality-avoidant-social-inhibition', name: 'Avoidant Personality - Social Inhibition', category: 'Personality Disorder Symptoms' },
      { id: 'personality-avoidant-fear-rejection', name: 'Avoidant Personality - Fear of Rejection', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-occupational-impairment', name: 'Personality Disorder - Occupational Impairment', category: 'Personality Disorder Symptoms' },
      { id: 'personality-disorder-social-impairment', name: 'Personality Disorder - Social Impairment', category: 'Personality Disorder Symptoms' },
    ]
  },
  // Phase 9: Cardiovascular Conditions
  {
    id: 'heart-disease',
    name: 'Heart Disease Symptoms (General)',
    symptoms: [
      // Heart failure symptoms (used for METs-based ratings)
      { id: 'cardiac-breathlessness', name: 'Cardiac - Breathlessness/Dyspnea' },
      { id: 'cardiac-fatigue', name: 'Cardiac - Fatigue with Exertion' },
      { id: 'cardiac-angina', name: 'Cardiac - Chest Pain/Angina' },
      { id: 'cardiac-dizziness', name: 'Cardiac - Dizziness' },
      { id: 'cardiac-syncope', name: 'Cardiac - Syncope (Fainting)' },
      { id: 'cardiac-palpitations', name: 'Cardiac - Palpitations' },
      { id: 'cardiac-edema', name: 'Cardiac - Swelling/Edema (Ankles/Legs)' },
      { id: 'cardiac-orthopnea', name: 'Cardiac - Difficulty Breathing Lying Down' },
    ]
  },
  {
    id: 'cardiomyopathy',
    name: 'Cardiomyopathy Symptoms (DC 7020)',
    symptoms: [
      { id: 'cardiomyopathy-breathlessness', name: 'Cardiomyopathy - Breathlessness' },
      { id: 'cardiomyopathy-fatigue', name: 'Cardiomyopathy - Fatigue' },
      { id: 'cardiomyopathy-edema', name: 'Cardiomyopathy - Swelling/Edema' },
      { id: 'cardiomyopathy-palpitations', name: 'Cardiomyopathy - Palpitations' },
      { id: 'cardiomyopathy-chest-pain', name: 'Cardiomyopathy - Chest Discomfort' },
      { id: 'cardiomyopathy-dizziness', name: 'Cardiomyopathy - Dizziness/Lightheadedness' },
      { id: 'cardiomyopathy-syncope', name: 'Cardiomyopathy - Syncope (Fainting)' },
      { id: 'cardiomyopathy-activity-limitation', name: 'Cardiomyopathy - Activity Limitation' },
    ]
  },
  {
    id: 'arrhythmia',
    name: 'Arrhythmia Symptoms (DC 7010/7011)',
    symptoms: [
      // Supraventricular Tachycardia (SVT) - DC 7010
      { id: 'svt-episode', name: 'SVT - Episode (Rapid Heartbeat)' },
      { id: 'svt-treatment-iv', name: 'SVT - IV Medication Required' },
      { id: 'svt-treatment-cardioversion', name: 'SVT - Cardioversion Required' },
      { id: 'svt-treatment-ablation', name: 'SVT - Ablation Procedure' },
      { id: 'svt-vagal-maneuver', name: 'SVT - Vagal Maneuver Used' },
      { id: 'svt-oral-medication', name: 'SVT - Oral Medication for Control' },
      // Ventricular Arrhythmias - DC 7011
      { id: 'ventricular-arrhythmia-episode', name: 'Ventricular Arrhythmia - Episode' },
      { id: 'ventricular-arrhythmia-hospitalization', name: 'Ventricular Arrhythmia - Hospitalization' },
      { id: 'aicd-implant', name: 'AICD (Defibrillator) - Implanted' },
      { id: 'aicd-shock', name: 'AICD - Shock Delivered' },
      // General arrhythmia symptoms
      { id: 'arrhythmia-palpitations', name: 'Arrhythmia - Palpitations' },
      { id: 'arrhythmia-racing-heart', name: 'Arrhythmia - Racing Heart' },
      { id: 'arrhythmia-skipped-beats', name: 'Arrhythmia - Skipped/Irregular Beats' },
      { id: 'arrhythmia-dizziness', name: 'Arrhythmia - Dizziness' },
      { id: 'arrhythmia-syncope', name: 'Arrhythmia - Syncope (Fainting)' },
      { id: 'arrhythmia-chest-discomfort', name: 'Arrhythmia - Chest Discomfort' },
    ]
  },
  {
    id: 'pericarditis',
    name: 'Pericarditis Symptoms (DC 7002)',
    symptoms: [
      { id: 'pericarditis-chest-pain', name: 'Pericarditis - Sharp Chest Pain' },
      { id: 'pericarditis-pain-breathing', name: 'Pericarditis - Pain Worse with Breathing' },
      { id: 'pericarditis-pain-lying-down', name: 'Pericarditis - Pain Worse Lying Down' },
      { id: 'pericarditis-fever', name: 'Pericarditis - Fever' },
      { id: 'pericarditis-palpitations', name: 'Pericarditis - Palpitations' },
      { id: 'pericarditis-shortness-breath', name: 'Pericarditis - Shortness of Breath' },
      { id: 'pericarditis-active-infection', name: 'Pericarditis - Active Infection Period' },
      { id: 'pericarditis-effusion', name: 'Pericarditis - Pericardial Effusion' },
    ]
  },
  {
    id: 'post-phlebitic',
    name: 'Post-Phlebitic Syndrome (DC 7121)',
    symptoms: [
      { id: 'post-phlebitic-edema', name: 'Post-Phlebitic - Leg Swelling/Edema' },
      { id: 'post-phlebitic-pain', name: 'Post-Phlebitic - Leg Pain' },
      { id: 'post-phlebitic-aching', name: 'Post-Phlebitic - Aching/Fatigue' },
      { id: 'post-phlebitic-pigmentation', name: 'Post-Phlebitic - Skin Discoloration' },
      { id: 'post-phlebitic-eczema', name: 'Post-Phlebitic - Stasis Eczema' },
      { id: 'post-phlebitic-ulcer', name: 'Post-Phlebitic - Venous Ulcer' },
      { id: 'post-phlebitic-induration', name: 'Post-Phlebitic - Subcutaneous Induration' },
      { id: 'post-phlebitic-pain-rest', name: 'Post-Phlebitic - Pain at Rest' },
    ]
  },
  // Phase 2A: Coronary Artery Disease (DC 7005)
  {
    id: 'cad',
    name: 'Coronary Artery Disease (CAD) Symptoms (DC 7005)',
    symptoms: [
      { id: 'cad-angina-stable', name: 'CAD - Stable Angina (Predictable Chest Pain)' },
      { id: 'cad-angina-unstable', name: 'CAD - Unstable Angina (Unpredictable/Worsening)' },
      { id: 'cad-dyspnea-exertion', name: 'CAD - Shortness of Breath with Exertion' },
      { id: 'cad-dyspnea-rest', name: 'CAD - Shortness of Breath at Rest' },
      { id: 'cad-fatigue', name: 'CAD - Fatigue/Exercise Intolerance' },
      { id: 'cad-dizziness', name: 'CAD - Dizziness/Lightheadedness' },
      { id: 'cad-syncope', name: 'CAD - Syncope (Fainting)' },
      { id: 'cad-palpitations', name: 'CAD - Palpitations' },
      { id: 'cad-diaphoresis', name: 'CAD - Diaphoresis (Sweating with Exertion)' },
      { id: 'cad-nausea', name: 'CAD - Nausea with Chest Symptoms' },
      { id: 'cad-activity-limitation', name: 'CAD - Activity Limitation' },
      { id: 'cad-nitroglycerin-use', name: 'CAD - Nitroglycerin Use' },
      { id: 'cad-hospitalization', name: 'CAD - Hospitalization/ER Visit' },
    ]
  },
  // Phase 2A: Myocardial Infarction Residuals (DC 7006)
  {
    id: 'post-mi',
    name: 'Post-Myocardial Infarction Symptoms (DC 7006)',
    symptoms: [
      { id: 'post-mi-chest-pain', name: 'Post-MI - Chest Pain/Discomfort' },
      { id: 'post-mi-dyspnea-exertion', name: 'Post-MI - Shortness of Breath with Exertion' },
      { id: 'post-mi-dyspnea-rest', name: 'Post-MI - Shortness of Breath at Rest' },
      { id: 'post-mi-fatigue', name: 'Post-MI - Fatigue/Exercise Intolerance' },
      { id: 'post-mi-weakness', name: 'Post-MI - Weakness' },
      { id: 'post-mi-dizziness', name: 'Post-MI - Dizziness' },
      { id: 'post-mi-syncope', name: 'Post-MI - Syncope (Fainting)' },
      { id: 'post-mi-palpitations', name: 'Post-MI - Palpitations/Arrhythmia' },
      { id: 'post-mi-edema', name: 'Post-MI - Swelling/Edema' },
      { id: 'post-mi-activity-limitation', name: 'Post-MI - Activity Limitation' },
      { id: 'post-mi-anxiety', name: 'Post-MI - Cardiac Anxiety' },
      { id: 'post-mi-hospitalization', name: 'Post-MI - Hospitalization/ER Visit' },
    ]
  },
  // Phase 2A: Hypertensive Heart Disease (DC 7007)
  {
    id: 'hypertensive-heart',
    name: 'Hypertensive Heart Disease Symptoms (DC 7007)',
    symptoms: [
      { id: 'hhd-dyspnea-exertion', name: 'HHD - Shortness of Breath with Exertion' },
      { id: 'hhd-dyspnea-rest', name: 'HHD - Shortness of Breath at Rest' },
      { id: 'hhd-orthopnea', name: 'HHD - Difficulty Breathing Lying Down' },
      { id: 'hhd-pnd', name: 'HHD - Paroxysmal Nocturnal Dyspnea (Waking Breathless)' },
      { id: 'hhd-fatigue', name: 'HHD - Fatigue/Exercise Intolerance' },
      { id: 'hhd-edema', name: 'HHD - Swelling/Edema (Ankles/Legs)' },
      { id: 'hhd-weight-gain', name: 'HHD - Rapid Weight Gain (Fluid Retention)' },
      { id: 'hhd-chest-discomfort', name: 'HHD - Chest Discomfort/Pressure' },
      { id: 'hhd-palpitations', name: 'HHD - Palpitations' },
      { id: 'hhd-dizziness', name: 'HHD - Dizziness/Lightheadedness' },
      { id: 'hhd-syncope', name: 'HHD - Syncope (Fainting)' },
      { id: 'hhd-activity-limitation', name: 'HHD - Activity Limitation' },
      { id: 'hhd-hospitalization', name: 'HHD - Hospitalization for Heart Failure' },
    ]
  },
  // Phase 2B: Cold Injury Residuals (DC 7122)
  {
    id: 'cold-injury',
    name: 'Cold Injury Residuals (Frostbite) Symptoms (DC 7122)',
    symptoms: [
      { id: 'cold-injury-pain', name: 'Cold Injury - Pain/Arthralgia' },
      { id: 'cold-injury-numbness', name: 'Cold Injury - Numbness' },
      { id: 'cold-injury-cold-sensitivity', name: 'Cold Injury - Cold Sensitivity' },
      { id: 'cold-injury-tingling', name: 'Cold Injury - Tingling/Paresthesias' },
      { id: 'cold-injury-color-changes', name: 'Cold Injury - Color Changes (Pallor/Cyanosis/Redness)' },
      { id: 'cold-injury-tissue-loss', name: 'Cold Injury - Tissue Loss' },
      { id: 'cold-injury-nail-abnormalities', name: 'Cold Injury - Nail Abnormalities' },
      { id: 'cold-injury-impaired-sensation', name: 'Cold Injury - Locally Impaired Sensation' },
      { id: 'cold-injury-hyperhidrosis', name: 'Cold Injury - Hyperhidrosis (Excessive Sweating)' },
      { id: 'cold-injury-stiffness', name: 'Cold Injury - Joint Stiffness' },
      { id: 'cold-injury-swelling', name: 'Cold Injury - Swelling' },
      { id: 'cold-injury-xray-abnormality', name: 'Cold Injury - X-ray Abnormalities Documented' },
    ]
  },
  // Phase 2B: Arteriosclerosis Obliterans / Peripheral Arterial Disease (DC 7114)
  {
    id: 'peripheral-arterial-disease',
    name: 'Peripheral Arterial Disease (PAD) Symptoms (DC 7114)',
    symptoms: [
      { id: 'pad-claudication-mild', name: 'PAD - Claudication (Leg Pain Walking >100 yards)' },
      { id: 'pad-claudication-moderate', name: 'PAD - Claudication (Leg Pain Walking 25-100 yards)' },
      { id: 'pad-claudication-severe', name: 'PAD - Claudication (Leg Pain Walking <25 yards)' },
      { id: 'pad-rest-pain', name: 'PAD - Ischemic Rest Pain (Pain at Rest)' },
      { id: 'pad-coldness', name: 'PAD - Persistent Coldness of Extremity' },
      { id: 'pad-numbness', name: 'PAD - Numbness/Tingling' },
      { id: 'pad-trophic-thin-skin', name: 'PAD - Trophic Changes: Thin/Shiny Skin' },
      { id: 'pad-trophic-hair-loss', name: 'PAD - Trophic Changes: Hair Loss on Legs/Feet' },
      { id: 'pad-trophic-nail-changes', name: 'PAD - Trophic Changes: Dystrophic Nails' },
      { id: 'pad-diminished-pulses', name: 'PAD - Diminished Peripheral Pulses' },
      { id: 'pad-color-changes', name: 'PAD - Color Changes (Pallor/Dependent Rubor)' },
      { id: 'pad-ulceration', name: 'PAD - Ischemic Ulceration' },
      { id: 'pad-slow-healing', name: 'PAD - Slow Wound Healing' },
      { id: 'pad-gangrene', name: 'PAD - Gangrene/Tissue Necrosis' },
    ]
  },
  // Phase 10: Cirrhosis (DC 7312)
  {
    id: 'cirrhosis',
    name: 'Cirrhosis Symptoms',
    symptoms: [
      { id: 'cirrhosis-fatigue', name: 'Cirrhosis - Fatigue/Weakness' },
      { id: 'cirrhosis-ascites', name: 'Cirrhosis - Ascites (Abdominal Fluid)' },
      { id: 'cirrhosis-edema', name: 'Cirrhosis - Leg Swelling/Edema' },
      { id: 'cirrhosis-jaundice', name: 'Cirrhosis - Jaundice (Yellowing)' },
      { id: 'cirrhosis-encephalopathy', name: 'Cirrhosis - Hepatic Encephalopathy (Confusion)' },
      { id: 'cirrhosis-variceal-bleed', name: 'Cirrhosis - Variceal Hemorrhage' },
      { id: 'cirrhosis-sbp', name: 'Cirrhosis - Spontaneous Bacterial Peritonitis' },
      { id: 'cirrhosis-coagulopathy', name: 'Cirrhosis - Bleeding/Coagulopathy' },
      { id: 'cirrhosis-splenomegaly', name: 'Cirrhosis - Enlarged Spleen' },
      { id: 'cirrhosis-anorexia', name: 'Cirrhosis - Loss of Appetite' },
      { id: 'cirrhosis-malaise', name: 'Cirrhosis - Malaise' },
      { id: 'cirrhosis-abdominal-pain', name: 'Cirrhosis - Abdominal Pain' },
      { id: 'cirrhosis-itching', name: 'Cirrhosis - Pruritus (Itching)' },
      { id: 'cirrhosis-hospitalization', name: 'Cirrhosis - Hospitalization' },
    ]
  },
  // Phase 10: Gastritis (DC 7307) - Rates as Peptic Ulcer DC 7304
  {
    id: 'gastritis',
    name: 'Gastritis Symptoms',
    symptoms: [
      { id: 'gastritis-abdominal-pain', name: 'Gastritis - Abdominal Pain' },
      { id: 'gastritis-nausea', name: 'Gastritis - Nausea' },
      { id: 'gastritis-vomiting', name: 'Gastritis - Vomiting' },
      { id: 'gastritis-bloating', name: 'Gastritis - Bloating/Fullness' },
      { id: 'gastritis-indigestion', name: 'Gastritis - Indigestion' },
      { id: 'gastritis-hematemesis', name: 'Gastritis - Vomiting Blood' },
      { id: 'gastritis-melena', name: 'Gastritis - Tarry Stools (Melena)' },
      { id: 'gastritis-hospitalization', name: 'Gastritis - Hospitalization' },
    ]
  },
  // Phase 10: Chronic Pancreatitis (DC 7347)
  {
    id: 'pancreatitis',
    name: 'Pancreatitis Symptoms',
    symptoms: [
      { id: 'pancreatitis-abdominal-pain', name: 'Pancreatitis - Abdominal Pain' },
      { id: 'pancreatitis-back-pain', name: 'Pancreatitis - Mid-Back Pain' },
      { id: 'pancreatitis-nausea', name: 'Pancreatitis - Nausea' },
      { id: 'pancreatitis-vomiting', name: 'Pancreatitis - Vomiting' },
      { id: 'pancreatitis-maldigestion', name: 'Pancreatitis - Maldigestion/Steatorrhea' },
      { id: 'pancreatitis-weight-loss', name: 'Pancreatitis - Weight Loss' },
      { id: 'pancreatitis-enzyme-use', name: 'Pancreatitis - Enzyme Supplementation' },
      { id: 'pancreatitis-dietary-restriction', name: 'Pancreatitis - Dietary Restriction Required' },
      { id: 'pancreatitis-tube-feeding', name: 'Pancreatitis - Tube Feeding Required' },
      { id: 'pancreatitis-cyst', name: 'Pancreatitis - Cyst/Pseudocyst' },
      { id: 'pancreatitis-hospitalization', name: 'Pancreatitis - Hospitalization' },
    ]
  },
  // Phase 10: Chronic Biliary Tract Disease (DC 7314)
  {
    id: 'biliary-tract',
    name: 'Biliary Tract Disease Symptoms',
    symptoms: [
      { id: 'biliary-ruq-pain', name: 'Biliary - Right Upper Quadrant Pain' },
      { id: 'biliary-nausea', name: 'Biliary - Nausea' },
      { id: 'biliary-vomiting', name: 'Biliary - Vomiting' },
      { id: 'biliary-jaundice', name: 'Biliary - Jaundice' },
      { id: 'biliary-fever', name: 'Biliary - Fever/Cholangitis' },
      { id: 'biliary-dilation', name: 'Biliary - Stricture Dilation Procedure' },
      { id: 'biliary-attack', name: 'Biliary - Acute Attack Episode' },
    ]
  },
  // Phase 11: Bronchiectasis (DC 6601)
  {
    id: 'bronchiectasis',
    name: 'Bronchiectasis Symptoms',
    symptoms: [
      { id: 'bronchiectasis-cough', name: 'Bronchiectasis - Chronic Cough' },
      { id: 'bronchiectasis-sputum', name: 'Bronchiectasis - Daily Sputum Production' },
      { id: 'bronchiectasis-purulent-sputum', name: 'Bronchiectasis - Purulent Sputum' },
      { id: 'bronchiectasis-hemoptysis', name: 'Bronchiectasis - Hemoptysis (Blood in Sputum)' },
      { id: 'bronchiectasis-infection', name: 'Bronchiectasis - Respiratory Infection Episode' },
      { id: 'bronchiectasis-incapacitating', name: 'Bronchiectasis - Incapacitating Episode' },
      { id: 'bronchiectasis-antibiotic', name: 'Bronchiectasis - Antibiotic Course' },
      { id: 'bronchiectasis-shortness-breath', name: 'Bronchiectasis - Shortness of Breath' },
      { id: 'bronchiectasis-fatigue', name: 'Bronchiectasis - Fatigue' },
      { id: 'bronchiectasis-weight-loss', name: 'Bronchiectasis - Weight Loss' },
      { id: 'bronchiectasis-anorexia', name: 'Bronchiectasis - Loss of Appetite' },
    ]
  },
  // Phase 11: Pulmonary Fibrosis / Interstitial Lung Disease (DC 6825)
  {
    id: 'pulmonary-fibrosis',
    name: 'Pulmonary Fibrosis Symptoms',
    symptoms: [
      { id: 'pf-shortness-breath', name: 'Pulmonary Fibrosis - Shortness of Breath' },
      { id: 'pf-dry-cough', name: 'Pulmonary Fibrosis - Dry Cough' },
      { id: 'pf-fatigue', name: 'Pulmonary Fibrosis - Fatigue' },
      { id: 'pf-exercise-intolerance', name: 'Pulmonary Fibrosis - Exercise Intolerance' },
      { id: 'pf-oxygen-use', name: 'Pulmonary Fibrosis - Supplemental Oxygen Use' },
      { id: 'pf-clubbing', name: 'Pulmonary Fibrosis - Finger Clubbing' },
      { id: 'pf-weight-loss', name: 'Pulmonary Fibrosis - Unexplained Weight Loss' },
      { id: 'pf-chest-discomfort', name: 'Pulmonary Fibrosis - Chest Discomfort' },
      { id: 'pf-exacerbation', name: 'Pulmonary Fibrosis - Acute Exacerbation' },
      { id: 'pf-hospitalization', name: 'Pulmonary Fibrosis - Hospitalization' },
    ]
  },
  // Phase 11: Sarcoidosis (DC 6846)
  {
    id: 'sarcoidosis',
    name: 'Sarcoidosis Symptoms',
    symptoms: [
      { id: 'sarcoid-shortness-breath', name: 'Sarcoidosis - Shortness of Breath' },
      { id: 'sarcoid-cough', name: 'Sarcoidosis - Dry Cough' },
      { id: 'sarcoid-chest-pain', name: 'Sarcoidosis - Chest Pain/Discomfort' },
      { id: 'sarcoid-fatigue', name: 'Sarcoidosis - Fatigue' },
      { id: 'sarcoid-fever', name: 'Sarcoidosis - Fever' },
      { id: 'sarcoid-night-sweats', name: 'Sarcoidosis - Night Sweats' },
      { id: 'sarcoid-weight-loss', name: 'Sarcoidosis - Weight Loss' },
      { id: 'sarcoid-skin-lesions', name: 'Sarcoidosis - Skin Lesions/Rash' },
      { id: 'sarcoid-eye-symptoms', name: 'Sarcoidosis - Eye Symptoms (Uveitis)' },
      { id: 'sarcoid-joint-pain', name: 'Sarcoidosis - Joint Pain/Swelling' },
      { id: 'sarcoid-lymph-nodes', name: 'Sarcoidosis - Swollen Lymph Nodes' },
      { id: 'sarcoid-cardiac', name: 'Sarcoidosis - Cardiac Symptoms (Palpitations/Arrhythmia)' },
      { id: 'sarcoid-corticosteroid', name: 'Sarcoidosis - Corticosteroid Use' },
    ]
  },
  // ============================================
  // PHASE 1A: MAJOR NEUROLOGICAL CONDITIONS
  // ============================================
  // Multiple Sclerosis (DC 8018)
  {
    id: 'multiple-sclerosis',
    name: 'Multiple Sclerosis Symptoms',
    symptoms: [
      { id: 'ms-fatigue', name: 'MS - Fatigue (Lassitude)' },
      { id: 'ms-numbness-tingling', name: 'MS - Numbness/Tingling' },
      { id: 'ms-vision-problems', name: 'MS - Vision Problems (Optic Neuritis)' },
      { id: 'ms-double-vision', name: 'MS - Double Vision (Diplopia)' },
      { id: 'ms-muscle-weakness', name: 'MS - Muscle Weakness' },
      { id: 'ms-spasticity', name: 'MS - Spasticity/Muscle Stiffness' },
      { id: 'ms-balance-problems', name: 'MS - Balance Problems/Ataxia' },
      { id: 'ms-cognitive-fog', name: 'MS - Cognitive Fog/Difficulty Concentrating' },
      { id: 'ms-bladder-dysfunction', name: 'MS - Bladder Dysfunction' },
      { id: 'ms-bowel-dysfunction', name: 'MS - Bowel Dysfunction' },
      { id: 'ms-heat-sensitivity', name: 'MS - Heat Sensitivity (Uhthoff Phenomenon)' },
      { id: 'ms-lhermittes-sign', name: "MS - Lhermitte's Sign (Electric Shock Sensation)" },
      { id: 'ms-pain', name: 'MS - Pain (Neuropathic)' },
      { id: 'ms-tremor', name: 'MS - Tremor' },
      { id: 'ms-speech-difficulty', name: 'MS - Speech Difficulty (Dysarthria)' },
      { id: 'ms-swallowing-difficulty', name: 'MS - Swallowing Difficulty (Dysphagia)' },
      { id: 'ms-relapse', name: 'MS - Relapse/Exacerbation' },
      { id: 'ms-vertigo', name: 'MS - Vertigo/Dizziness' },
      { id: 'ms-depression', name: 'MS - Depression (MS-related)' },
      { id: 'ms-walking-difficulty', name: 'MS - Walking Difficulty/Gait Problems' },
    ]
  },
  // Parkinson's Disease (DC 8004)
  {
    id: 'parkinsons-disease',
    name: "Parkinson's Disease Symptoms",
    symptoms: [
      { id: 'pd-resting-tremor', name: "Parkinson's - Resting Tremor" },
      { id: 'pd-rigidity', name: "Parkinson's - Rigidity/Muscle Stiffness" },
      { id: 'pd-bradykinesia', name: "Parkinson's - Bradykinesia (Slow Movement)" },
      { id: 'pd-postural-instability', name: "Parkinson's - Postural Instability" },
      { id: 'pd-freezing-gait', name: "Parkinson's - Freezing of Gait" },
      { id: 'pd-shuffling-walk', name: "Parkinson's - Shuffling Walk" },
      { id: 'pd-masked-face', name: "Parkinson's - Masked Face (Hypomimia)" },
      { id: 'pd-soft-speech', name: "Parkinson's - Soft Speech (Hypophonia)" },
      { id: 'pd-micrographia', name: "Parkinson's - Small Handwriting (Micrographia)" },
      { id: 'pd-sleep-disturbance', name: "Parkinson's - Sleep Disturbance" },
      { id: 'pd-rem-sleep-disorder', name: "Parkinson's - REM Sleep Behavior Disorder" },
      { id: 'pd-depression', name: "Parkinson's - Depression" },
      { id: 'pd-anxiety', name: "Parkinson's - Anxiety" },
      { id: 'pd-cognitive-changes', name: "Parkinson's - Cognitive Changes" },
      { id: 'pd-constipation', name: "Parkinson's - Constipation" },
      { id: 'pd-urinary-problems', name: "Parkinson's - Urinary Problems" },
      { id: 'pd-swallowing-difficulty', name: "Parkinson's - Swallowing Difficulty" },
      { id: 'pd-drooling', name: "Parkinson's - Drooling (Sialorrhea)" },
      { id: 'pd-loss-smell', name: "Parkinson's - Loss of Smell (Anosmia)" },
      { id: 'pd-fatigue', name: "Parkinson's - Fatigue" },
      { id: 'pd-pain', name: "Parkinson's - Pain" },
      { id: 'pd-falls', name: "Parkinson's - Falls" },
      { id: 'pd-off-episodes', name: "Parkinson's - OFF Episodes (Medication Wearing Off)" },
      { id: 'pd-dyskinesia', name: "Parkinson's - Dyskinesia (Involuntary Movements)" },
    ]
  },
  // Myasthenia Gravis (DC 8025)
  {
    id: 'myasthenia-gravis',
    name: 'Myasthenia Gravis Symptoms',
    symptoms: [
      { id: 'mg-ptosis', name: 'Myasthenia Gravis - Ptosis (Drooping Eyelid)' },
      { id: 'mg-diplopia', name: 'Myasthenia Gravis - Diplopia (Double Vision)' },
      { id: 'mg-facial-weakness', name: 'Myasthenia Gravis - Facial Weakness' },
      { id: 'mg-difficulty-chewing', name: 'Myasthenia Gravis - Difficulty Chewing' },
      { id: 'mg-difficulty-swallowing', name: 'Myasthenia Gravis - Difficulty Swallowing' },
      { id: 'mg-slurred-speech', name: 'Myasthenia Gravis - Slurred Speech (Dysarthria)' },
      { id: 'mg-limb-weakness', name: 'Myasthenia Gravis - Limb Weakness' },
      { id: 'mg-neck-weakness', name: 'Myasthenia Gravis - Neck Weakness (Head Drop)' },
      { id: 'mg-respiratory-weakness', name: 'Myasthenia Gravis - Respiratory Weakness' },
      { id: 'mg-fatigue-activity', name: 'Myasthenia Gravis - Fatigue Worsening with Activity' },
      { id: 'mg-improvement-rest', name: 'Myasthenia Gravis - Improvement with Rest' },
      { id: 'mg-crisis', name: 'Myasthenia Gravis - Myasthenic Crisis' },
      { id: 'mg-hospitalization', name: 'Myasthenia Gravis - Hospitalization' },
      { id: 'mg-voice-fatigue', name: 'Myasthenia Gravis - Voice Fatigue' },
      { id: 'mg-arm-elevation-difficulty', name: 'Myasthenia Gravis - Difficulty Raising Arms' },
    ]
  },
  // ============================================
  // PHASE 1B: ADDITIONAL NEUROLOGICAL CONDITIONS
  // ============================================

  // Narcolepsy (DC 8108)
  {
    id: 'narcolepsy',
    name: 'Narcolepsy Symptoms',
    symptoms: [
      { id: 'narco-sleep-attack', name: 'Narcolepsy - Sleep Attack' },
      { id: 'narco-excessive-sleepiness', name: 'Narcolepsy - Excessive Daytime Sleepiness' },
      { id: 'narco-cataplexy', name: 'Narcolepsy - Cataplexy Episode' },
      { id: 'narco-sleep-paralysis', name: 'Narcolepsy - Sleep Paralysis' },
      { id: 'narco-hypnagogic-hallucination', name: 'Narcolepsy - Hypnagogic Hallucination' },
      { id: 'narco-hypnopompic-hallucination', name: 'Narcolepsy - Hypnopompic Hallucination' },
      { id: 'narco-disrupted-sleep', name: 'Narcolepsy - Disrupted Nighttime Sleep' },
      { id: 'narco-automatic-behavior', name: 'Narcolepsy - Automatic Behavior' },
      { id: 'narco-memory-problems', name: 'Narcolepsy - Memory Problems' },
      { id: 'narco-difficulty-concentrating', name: 'Narcolepsy - Difficulty Concentrating' },
      { id: 'narco-microsleep', name: 'Narcolepsy - Microsleep Episode' },
    ]
  },

  // ALS - Amyotrophic Lateral Sclerosis (DC 8017)
  {
    id: 'als',
    name: 'ALS (Amyotrophic Lateral Sclerosis) Symptoms',
    symptoms: [
      { id: 'als-muscle-weakness', name: 'ALS - Muscle Weakness' },
      { id: 'als-fasciculations', name: 'ALS - Fasciculations (Muscle Twitching)' },
      { id: 'als-muscle-cramps', name: 'ALS - Muscle Cramps' },
      { id: 'als-spasticity', name: 'ALS - Spasticity' },
      { id: 'als-difficulty-speaking', name: 'ALS - Difficulty Speaking (Dysarthria)' },
      { id: 'als-difficulty-swallowing', name: 'ALS - Difficulty Swallowing (Dysphagia)' },
      { id: 'als-respiratory-difficulty', name: 'ALS - Respiratory Difficulty' },
      { id: 'als-fatigue', name: 'ALS - Fatigue' },
      { id: 'als-muscle-atrophy', name: 'ALS - Muscle Atrophy' },
      { id: 'als-hand-weakness', name: 'ALS - Hand/Grip Weakness' },
      { id: 'als-foot-drop', name: 'ALS - Foot Drop' },
      { id: 'als-tripping-falling', name: 'ALS - Tripping/Falling' },
      { id: 'als-emotional-lability', name: 'ALS - Emotional Lability (PBA)' },
      { id: 'als-drooling', name: 'ALS - Drooling (Sialorrhea)' },
      { id: 'als-weight-loss', name: 'ALS - Weight Loss' },
    ]
  },

  // Syringomyelia (DC 8024)
  {
    id: 'syringomyelia',
    name: 'Syringomyelia Symptoms',
    symptoms: [
      { id: 'syring-pain', name: 'Syringomyelia - Pain (Burning/Aching)' },
      { id: 'syring-weakness', name: 'Syringomyelia - Muscle Weakness' },
      { id: 'syring-sensory-loss', name: 'Syringomyelia - Sensory Loss' },
      { id: 'syring-temp-insensitivity', name: 'Syringomyelia - Temperature Insensitivity' },
      { id: 'syring-pain-insensitivity', name: 'Syringomyelia - Pain Insensitivity' },
      { id: 'syring-muscle-wasting', name: 'Syringomyelia - Muscle Wasting' },
      { id: 'syring-stiffness', name: 'Syringomyelia - Stiffness' },
      { id: 'syring-headache', name: 'Syringomyelia - Headache' },
      { id: 'syring-numbness-tingling', name: 'Syringomyelia - Numbness/Tingling' },
      { id: 'syring-bowel-bladder', name: 'Syringomyelia - Bowel/Bladder Dysfunction' },
      { id: 'syring-scoliosis', name: 'Syringomyelia - Scoliosis' },
    ]
  },

  // Myelitis (DC 8010) - includes Transverse Myelitis
  {
    id: 'myelitis',
    name: 'Myelitis Symptoms',
    symptoms: [
      { id: 'myel-weakness', name: 'Myelitis - Weakness' },
      { id: 'myel-sensory-changes', name: 'Myelitis - Sensory Changes' },
      { id: 'myel-bladder-dysfunction', name: 'Myelitis - Bladder Dysfunction' },
      { id: 'myel-bowel-dysfunction', name: 'Myelitis - Bowel Dysfunction' },
      { id: 'myel-pain', name: 'Myelitis - Pain' },
      { id: 'myel-spasticity', name: 'Myelitis - Spasticity' },
      { id: 'myel-fatigue', name: 'Myelitis - Fatigue' },
      { id: 'myel-numbness', name: 'Myelitis - Numbness' },
      { id: 'myel-tingling', name: 'Myelitis - Tingling/Paresthesias' },
      { id: 'myel-band-sensation', name: 'Myelitis - Band-like Sensation' },
      { id: 'myel-sexual-dysfunction', name: 'Myelitis - Sexual Dysfunction' },
      { id: 'myel-paralysis', name: 'Myelitis - Paralysis' },
    ]
  },
  // ============================================
  // PHASE 1C: PERIPHERAL NERVE CONDITIONS
  // DC 8510-8530 (Paralysis), 8610-8630 (Neuritis), 8710-8730 (Neuralgia)
  // 38 CFR 4.124a - Diseases of the Peripheral Nerves
  // ============================================

  // UPPER EXTREMITY NERVES
  // ======================

  // Upper Radicular Group - C5-C6 (DC 8510/8610/8710)
  {
    id: 'upper-radicular-nerve',
    name: 'Upper Radicular Group (C5-C6) Nerve Symptoms',
    symptoms: [
      { id: 'uprn-shoulder-weakness', name: 'Upper Radicular - Shoulder Weakness' },
      { id: 'uprn-elbow-weakness', name: 'Upper Radicular - Elbow Weakness' },
      { id: 'uprn-shoulder-movement-loss', name: 'Upper Radicular - Loss of Shoulder Movement' },
      { id: 'uprn-elbow-movement-loss', name: 'Upper Radicular - Loss of Elbow Movement' },
      { id: 'uprn-numbness', name: 'Upper Radicular - Numbness (C5-C6 Distribution)' },
      { id: 'uprn-tingling', name: 'Upper Radicular - Tingling' },
      { id: 'uprn-pain', name: 'Upper Radicular - Pain' },
      { id: 'uprn-muscle-atrophy', name: 'Upper Radicular - Muscle Atrophy (Deltoid/Biceps)' },
      { id: 'uprn-reflex-loss', name: 'Upper Radicular - Reflex Loss (Biceps/Brachioradialis)' },
    ]
  },

  // Middle Radicular Group - C7 (DC 8511/8611/8711)
  {
    id: 'middle-radicular-nerve',
    name: 'Middle Radicular Group (C7) Nerve Symptoms',
    symptoms: [
      { id: 'mdrn-arm-weakness', name: 'Middle Radicular - Arm Weakness' },
      { id: 'mdrn-wrist-extension-weakness', name: 'Middle Radicular - Wrist Extension Weakness' },
      { id: 'mdrn-elbow-extension-weakness', name: 'Middle Radicular - Elbow Extension Weakness' },
      { id: 'mdrn-finger-extension-weakness', name: 'Middle Radicular - Finger Extension Weakness' },
      { id: 'mdrn-numbness', name: 'Middle Radicular - Numbness (C7 Distribution)' },
      { id: 'mdrn-tingling', name: 'Middle Radicular - Tingling' },
      { id: 'mdrn-pain', name: 'Middle Radicular - Pain' },
      { id: 'mdrn-muscle-atrophy', name: 'Middle Radicular - Muscle Atrophy (Triceps)' },
      { id: 'mdrn-reflex-loss', name: 'Middle Radicular - Reflex Loss (Triceps)' },
    ]
  },

  // Lower Radicular Group - C8-T1 (DC 8512/8612/8712)
  {
    id: 'lower-radicular-nerve',
    name: 'Lower Radicular Group (C8-T1) Nerve Symptoms',
    symptoms: [
      { id: 'lwrn-hand-weakness', name: 'Lower Radicular - Hand Weakness' },
      { id: 'lwrn-grip-weakness', name: 'Lower Radicular - Grip Weakness' },
      { id: 'lwrn-finger-flexion-weakness', name: 'Lower Radicular - Finger Flexion Weakness' },
      { id: 'lwrn-intrinsic-muscle-weakness', name: 'Lower Radicular - Intrinsic Hand Muscle Weakness' },
      { id: 'lwrn-numbness', name: 'Lower Radicular - Numbness (C8-T1 Distribution)' },
      { id: 'lwrn-tingling', name: 'Lower Radicular - Tingling' },
      { id: 'lwrn-pain', name: 'Lower Radicular - Pain' },
      { id: 'lwrn-muscle-atrophy', name: 'Lower Radicular - Muscle Atrophy (Hand Intrinsics)' },
      { id: 'lwrn-clumsiness', name: 'Lower Radicular - Fine Motor Clumsiness' },
    ]
  },

  // All Radicular Groups - Complete Brachial Plexus (DC 8513/8613/8713)
  {
    id: 'all-radicular-nerve',
    name: 'All Radicular Groups (Brachial Plexus) Nerve Symptoms',
    symptoms: [
      { id: 'alrn-complete-arm-paralysis', name: 'All Radicular - Complete Arm Paralysis' },
      { id: 'alrn-arm-weakness', name: 'All Radicular - Severe Arm Weakness' },
      { id: 'alrn-shoulder-weakness', name: 'All Radicular - Shoulder Weakness' },
      { id: 'alrn-elbow-weakness', name: 'All Radicular - Elbow Weakness' },
      { id: 'alrn-wrist-weakness', name: 'All Radicular - Wrist Weakness' },
      { id: 'alrn-hand-weakness', name: 'All Radicular - Hand Weakness' },
      { id: 'alrn-numbness', name: 'All Radicular - Numbness (Entire Arm)' },
      { id: 'alrn-tingling', name: 'All Radicular - Tingling' },
      { id: 'alrn-pain', name: 'All Radicular - Pain' },
      { id: 'alrn-muscle-atrophy', name: 'All Radicular - Muscle Atrophy' },
    ]
  },

  // Musculospiral (Radial) Nerve (DC 8514/8614/8714)
  {
    id: 'radial-nerve',
    name: 'Radial Nerve (Musculospiral) Symptoms',
    symptoms: [
      { id: 'radn-wrist-drop', name: 'Radial Nerve - Wrist Drop' },
      { id: 'radn-finger-drop', name: 'Radial Nerve - Finger Drop' },
      { id: 'radn-extension-weakness', name: 'Radial Nerve - Extension Weakness (Wrist/Fingers)' },
      { id: 'radn-supination-weakness', name: 'Radial Nerve - Supination Weakness' },
      { id: 'radn-thumb-extension-loss', name: 'Radial Nerve - Thumb Extension Loss' },
      { id: 'radn-grip-weakness', name: 'Radial Nerve - Grip Weakness' },
      { id: 'radn-numbness', name: 'Radial Nerve - Numbness (Dorsal Hand/Thumb)' },
      { id: 'radn-tingling', name: 'Radial Nerve - Tingling' },
      { id: 'radn-pain', name: 'Radial Nerve - Pain' },
      { id: 'radn-muscle-atrophy', name: 'Radial Nerve - Muscle Atrophy' },
    ]
  },

  // Median Nerve (DC 8515/8615/8715) - Carpal Tunnel
  {
    id: 'median-nerve',
    name: 'Median Nerve (Carpal Tunnel) Symptoms',
    symptoms: [
      { id: 'medn-numbness', name: 'Median Nerve - Numbness (Thumb/Index/Middle Fingers)' },
      { id: 'medn-tingling', name: 'Median Nerve - Tingling' },
      { id: 'medn-pain', name: 'Median Nerve - Pain' },
      { id: 'medn-night-symptoms', name: 'Median Nerve - Night Symptoms (Waking from Sleep)' },
      { id: 'medn-thenar-weakness', name: 'Median Nerve - Thenar Weakness (Thumb Base)' },
      { id: 'medn-thenar-atrophy', name: 'Median Nerve - Thenar Atrophy' },
      { id: 'medn-grip-weakness', name: 'Median Nerve - Grip Weakness' },
      { id: 'medn-dropping-objects', name: 'Median Nerve - Dropping Objects' },
      { id: 'medn-opposition-weakness', name: 'Median Nerve - Thumb Opposition Weakness' },
      { id: 'medn-pronation-weakness', name: 'Median Nerve - Pronation Weakness' },
      { id: 'medn-ape-hand', name: 'Median Nerve - Ape Hand Deformity' },
      { id: 'medn-trophic-changes', name: 'Median Nerve - Trophic Changes (Skin/Nail)' },
    ]
  },

  // Ulnar Nerve (DC 8516/8616/8716) - Cubital Tunnel
  {
    id: 'ulnar-nerve',
    name: 'Ulnar Nerve (Cubital Tunnel) Symptoms',
    symptoms: [
      { id: 'ulnn-numbness', name: 'Ulnar Nerve - Numbness (Ring/Little Fingers)' },
      { id: 'ulnn-tingling', name: 'Ulnar Nerve - Tingling' },
      { id: 'ulnn-pain', name: 'Ulnar Nerve - Pain' },
      { id: 'ulnn-elbow-pain', name: 'Ulnar Nerve - Elbow Pain (Funny Bone Area)' },
      { id: 'ulnn-grip-weakness', name: 'Ulnar Nerve - Grip Weakness' },
      { id: 'ulnn-pinch-weakness', name: 'Ulnar Nerve - Pinch Weakness' },
      { id: 'ulnn-finger-spread-weakness', name: 'Ulnar Nerve - Finger Spread Weakness' },
      { id: 'ulnn-claw-hand', name: 'Ulnar Nerve - Claw Hand Deformity' },
      { id: 'ulnn-interossei-atrophy', name: 'Ulnar Nerve - Interossei Muscle Atrophy' },
      { id: 'ulnn-hypothenar-atrophy', name: 'Ulnar Nerve - Hypothenar Atrophy' },
      { id: 'ulnn-thumb-adduction-weakness', name: 'Ulnar Nerve - Thumb Adduction Weakness' },
      { id: 'ulnn-wrist-flexion-weakness', name: 'Ulnar Nerve - Wrist Flexion Weakness' },
    ]
  },

  // Musculocutaneous Nerve (DC 8517/8617/8717)
  {
    id: 'musculocutaneous-nerve',
    name: 'Musculocutaneous Nerve Symptoms',
    symptoms: [
      { id: 'mscn-biceps-weakness', name: 'Musculocutaneous - Biceps Weakness' },
      { id: 'mscn-elbow-flexion-weakness', name: 'Musculocutaneous - Elbow Flexion Weakness' },
      { id: 'mscn-supination-weakness', name: 'Musculocutaneous - Forearm Supination Weakness' },
      { id: 'mscn-numbness', name: 'Musculocutaneous - Numbness (Lateral Forearm)' },
      { id: 'mscn-tingling', name: 'Musculocutaneous - Tingling' },
      { id: 'mscn-pain', name: 'Musculocutaneous - Pain' },
      { id: 'mscn-muscle-atrophy', name: 'Musculocutaneous - Muscle Atrophy (Biceps)' },
    ]
  },

  // Circumflex Nerve (DC 8518/8618/8718)
  {
    id: 'circumflex-nerve',
    name: 'Circumflex (Axillary) Nerve Symptoms',
    symptoms: [
      { id: 'crcn-shoulder-abduction-weakness', name: 'Circumflex - Shoulder Abduction Weakness' },
      { id: 'crcn-arm-raise-difficulty', name: 'Circumflex - Difficulty Raising Arm' },
      { id: 'crcn-external-rotation-weakness', name: 'Circumflex - External Rotation Weakness' },
      { id: 'crcn-deltoid-weakness', name: 'Circumflex - Deltoid Weakness' },
      { id: 'crcn-deltoid-atrophy', name: 'Circumflex - Deltoid Atrophy' },
      { id: 'crcn-numbness', name: 'Circumflex - Numbness (Lateral Shoulder)' },
      { id: 'crcn-tingling', name: 'Circumflex - Tingling' },
      { id: 'crcn-pain', name: 'Circumflex - Pain' },
    ]
  },

  // Long Thoracic Nerve (DC 8519/8619/8719)
  {
    id: 'long-thoracic-nerve',
    name: 'Long Thoracic Nerve Symptoms',
    symptoms: [
      { id: 'ltn-winged-scapula', name: 'Long Thoracic - Winged Scapula' },
      { id: 'ltn-arm-elevation-difficulty', name: 'Long Thoracic - Difficulty Raising Arm Above Shoulder' },
      { id: 'ltn-shoulder-weakness', name: 'Long Thoracic - Shoulder Weakness' },
      { id: 'ltn-pushing-difficulty', name: 'Long Thoracic - Difficulty Pushing' },
      { id: 'ltn-serratus-weakness', name: 'Long Thoracic - Serratus Anterior Weakness' },
      { id: 'ltn-pain', name: 'Long Thoracic - Pain' },
      { id: 'ltn-fatigue', name: 'Long Thoracic - Shoulder Fatigue' },
    ]
  },

  // LOWER EXTREMITY NERVES
  // ======================

  // Sciatic Nerve (DC 8520/8620/8720)
  {
    id: 'sciatic-nerve',
    name: 'Sciatic Nerve Symptoms',
    symptoms: [
      { id: 'scin-radiating-pain', name: 'Sciatic - Radiating Pain (Buttock to Leg)' },
      { id: 'scin-leg-weakness', name: 'Sciatic - Leg Weakness' },
      { id: 'scin-foot-drop', name: 'Sciatic - Foot Drop' },
      { id: 'scin-knee-flexion-weakness', name: 'Sciatic - Knee Flexion Weakness' },
      { id: 'scin-numbness', name: 'Sciatic - Numbness (Leg/Foot)' },
      { id: 'scin-tingling', name: 'Sciatic - Tingling' },
      { id: 'scin-burning', name: 'Sciatic - Burning Sensation' },
      { id: 'scin-muscle-atrophy', name: 'Sciatic - Muscle Atrophy (Leg)' },
      { id: 'scin-difficulty-walking', name: 'Sciatic - Difficulty Walking' },
      { id: 'scin-sitting-pain', name: 'Sciatic - Pain Worse with Sitting' },
    ]
  },

  // External Popliteal (Common Peroneal) Nerve (DC 8521/8621/8721)
  {
    id: 'common-peroneal-nerve',
    name: 'Common Peroneal Nerve Symptoms',
    symptoms: [
      { id: 'cpn-foot-drop', name: 'Common Peroneal - Foot Drop' },
      { id: 'cpn-dorsiflexion-weakness', name: 'Common Peroneal - Dorsiflexion Weakness' },
      { id: 'cpn-toe-extension-weakness', name: 'Common Peroneal - Toe Extension Weakness' },
      { id: 'cpn-eversion-weakness', name: 'Common Peroneal - Foot Eversion Weakness' },
      { id: 'cpn-steppage-gait', name: 'Common Peroneal - Steppage Gait' },
      { id: 'cpn-tripping', name: 'Common Peroneal - Tripping/Stumbling' },
      { id: 'cpn-numbness', name: 'Common Peroneal - Numbness (Dorsum of Foot)' },
      { id: 'cpn-tingling', name: 'Common Peroneal - Tingling' },
      { id: 'cpn-pain', name: 'Common Peroneal - Pain' },
      { id: 'cpn-muscle-atrophy', name: 'Common Peroneal - Muscle Atrophy (Anterior Leg)' },
    ]
  },

  // Superficial Peroneal Nerve (DC 8522/8622/8722)
  {
    id: 'superficial-peroneal-nerve',
    name: 'Superficial Peroneal Nerve Symptoms',
    symptoms: [
      { id: 'spn-eversion-weakness', name: 'Superficial Peroneal - Foot Eversion Weakness' },
      { id: 'spn-ankle-instability', name: 'Superficial Peroneal - Ankle Instability' },
      { id: 'spn-numbness', name: 'Superficial Peroneal - Numbness (Lower Leg/Dorsum Foot)' },
      { id: 'spn-tingling', name: 'Superficial Peroneal - Tingling' },
      { id: 'spn-pain', name: 'Superficial Peroneal - Pain' },
      { id: 'spn-muscle-atrophy', name: 'Superficial Peroneal - Muscle Atrophy (Peroneal)' },
    ]
  },

  // Deep Peroneal (Anterior Tibial) Nerve (DC 8523/8623/8723)
  {
    id: 'deep-peroneal-nerve',
    name: 'Deep Peroneal (Anterior Tibial) Nerve Symptoms',
    symptoms: [
      { id: 'dpn-dorsiflexion-loss', name: 'Deep Peroneal - Dorsiflexion Loss' },
      { id: 'dpn-toe-extension-weakness', name: 'Deep Peroneal - Toe Extension Weakness' },
      { id: 'dpn-foot-drop', name: 'Deep Peroneal - Foot Drop' },
      { id: 'dpn-numbness', name: 'Deep Peroneal - Numbness (Web Space 1st/2nd Toe)' },
      { id: 'dpn-tingling', name: 'Deep Peroneal - Tingling' },
      { id: 'dpn-pain', name: 'Deep Peroneal - Pain' },
      { id: 'dpn-muscle-atrophy', name: 'Deep Peroneal - Muscle Atrophy' },
    ]
  },

  // Internal Popliteal (Tibial) Nerve (DC 8524/8624/8724)
  {
    id: 'tibial-nerve',
    name: 'Tibial (Internal Popliteal) Nerve Symptoms',
    symptoms: [
      { id: 'tibn-plantar-flexion-weakness', name: 'Tibial - Plantar Flexion Weakness' },
      { id: 'tibn-toe-flexion-weakness', name: 'Tibial - Toe Flexion Weakness' },
      { id: 'tibn-foot-inversion-weakness', name: 'Tibial - Foot Inversion Weakness' },
      { id: 'tibn-calf-weakness', name: 'Tibial - Calf Weakness' },
      { id: 'tibn-difficulty-walking-tiptoe', name: 'Tibial - Difficulty Walking on Tiptoe' },
      { id: 'tibn-numbness', name: 'Tibial - Numbness (Sole of Foot)' },
      { id: 'tibn-tingling', name: 'Tibial - Tingling' },
      { id: 'tibn-burning', name: 'Tibial - Burning Pain' },
      { id: 'tibn-muscle-atrophy', name: 'Tibial - Muscle Atrophy (Calf/Sole)' },
    ]
  },

  // Posterior Tibial Nerve (DC 8525/8625/8725)
  {
    id: 'posterior-tibial-nerve',
    name: 'Posterior Tibial Nerve Symptoms',
    symptoms: [
      { id: 'ptn-sole-paralysis', name: 'Posterior Tibial - Sole of Foot Paralysis' },
      { id: 'ptn-toe-flexion-weakness', name: 'Posterior Tibial - Toe Flexion Weakness' },
      { id: 'ptn-foot-adduction-weakness', name: 'Posterior Tibial - Foot Adduction Weakness' },
      { id: 'ptn-numbness', name: 'Posterior Tibial - Numbness (Sole)' },
      { id: 'ptn-tingling', name: 'Posterior Tibial - Tingling' },
      { id: 'ptn-burning', name: 'Posterior Tibial - Burning Pain (Causalgic)' },
      { id: 'ptn-tarsal-tunnel', name: 'Posterior Tibial - Tarsal Tunnel Symptoms' },
      { id: 'ptn-muscle-atrophy', name: 'Posterior Tibial - Muscle Atrophy' },
    ]
  },

  // Anterior Crural (Femoral) Nerve (DC 8526/8626/8726)
  {
    id: 'femoral-nerve',
    name: 'Femoral (Anterior Crural) Nerve Symptoms',
    symptoms: [
      { id: 'femn-quadriceps-weakness', name: 'Femoral - Quadriceps Weakness' },
      { id: 'femn-knee-extension-weakness', name: 'Femoral - Knee Extension Weakness' },
      { id: 'femn-knee-buckling', name: 'Femoral - Knee Buckling/Giving Way' },
      { id: 'femn-difficulty-stairs', name: 'Femoral - Difficulty with Stairs' },
      { id: 'femn-difficulty-rising', name: 'Femoral - Difficulty Rising from Chair' },
      { id: 'femn-numbness', name: 'Femoral - Numbness (Anterior Thigh/Medial Leg)' },
      { id: 'femn-tingling', name: 'Femoral - Tingling' },
      { id: 'femn-pain', name: 'Femoral - Pain' },
      { id: 'femn-muscle-atrophy', name: 'Femoral - Muscle Atrophy (Quadriceps)' },
    ]
  },

  // Internal Saphenous Nerve (DC 8527/8627/8727)
  {
    id: 'saphenous-nerve',
    name: 'Saphenous Nerve Symptoms',
    symptoms: [
      { id: 'sapn-numbness', name: 'Saphenous - Numbness (Medial Leg/Ankle)' },
      { id: 'sapn-tingling', name: 'Saphenous - Tingling' },
      { id: 'sapn-pain', name: 'Saphenous - Pain (Medial Knee to Ankle)' },
      { id: 'sapn-burning', name: 'Saphenous - Burning Sensation' },
      { id: 'sapn-hypersensitivity', name: 'Saphenous - Hypersensitivity to Touch' },
    ]
  },

  // Obturator Nerve (DC 8528/8628/8728)
  {
    id: 'obturator-nerve',
    name: 'Obturator Nerve Symptoms',
    symptoms: [
      { id: 'obtn-thigh-adduction-weakness', name: 'Obturator - Thigh Adduction Weakness' },
      { id: 'obtn-groin-pain', name: 'Obturator - Groin Pain' },
      { id: 'obtn-medial-thigh-pain', name: 'Obturator - Medial Thigh Pain' },
      { id: 'obtn-numbness', name: 'Obturator - Numbness (Medial Thigh)' },
      { id: 'obtn-tingling', name: 'Obturator - Tingling' },
      { id: 'obtn-gait-instability', name: 'Obturator - Gait Instability' },
      { id: 'obtn-muscle-atrophy', name: 'Obturator - Muscle Atrophy (Adductors)' },
    ]
  },

  // External Cutaneous Nerve of Thigh (DC 8529/8629/8729) - Meralgia Paresthetica
  {
    id: 'lateral-femoral-cutaneous-nerve',
    name: 'Lateral Femoral Cutaneous Nerve (Meralgia Paresthetica) Symptoms',
    symptoms: [
      { id: 'lfcn-numbness', name: 'Lateral Femoral Cutaneous - Numbness (Outer Thigh)' },
      { id: 'lfcn-tingling', name: 'Lateral Femoral Cutaneous - Tingling' },
      { id: 'lfcn-burning', name: 'Lateral Femoral Cutaneous - Burning Pain' },
      { id: 'lfcn-hypersensitivity', name: 'Lateral Femoral Cutaneous - Hypersensitivity' },
      { id: 'lfcn-pain-standing', name: 'Lateral Femoral Cutaneous - Pain Worse with Standing' },
      { id: 'lfcn-pain-walking', name: 'Lateral Femoral Cutaneous - Pain Worse with Walking' },
    ]
  },

  // Ilio-inguinal Nerve (DC 8530/8630/8730)
  {
    id: 'ilioinguinal-nerve',
    name: 'Ilio-inguinal Nerve Symptoms',
    symptoms: [
      { id: 'iin-groin-numbness', name: 'Ilio-inguinal - Groin Numbness' },
      { id: 'iin-genital-numbness', name: 'Ilio-inguinal - Genital Area Numbness' },
      { id: 'iin-inner-thigh-numbness', name: 'Ilio-inguinal - Inner Thigh Numbness' },
      { id: 'iin-groin-pain', name: 'Ilio-inguinal - Groin Pain' },
      { id: 'iin-burning', name: 'Ilio-inguinal - Burning Sensation' },
      { id: 'iin-hypersensitivity', name: 'Ilio-inguinal - Hypersensitivity' },
      { id: 'iin-pain-movement', name: 'Ilio-inguinal - Pain with Movement/Coughing' },
    ]
  },
// ============================================
  // PHASE 3A: ENDOCRINE - THYROID & PARATHYROID
  // ============================================

  // Hyperthyroidism/Graves' Disease (DC 7900)
  {
    id: 'hyperthyroidism',
    name: 'Hyperthyroidism/Graves\' Disease Symptoms',
    symptoms: [
      { id: 'hyper-weight-loss', name: 'Hyperthyroidism - Unintentional Weight Loss' },
      { id: 'hyper-rapid-heartbeat', name: 'Hyperthyroidism - Rapid/Irregular Heartbeat' },
      { id: 'hyper-tremor', name: 'Hyperthyroidism - Tremor (Hands/Fingers)' },
      { id: 'hyper-heat-intolerance', name: 'Hyperthyroidism - Heat Intolerance' },
      { id: 'hyper-sweating', name: 'Hyperthyroidism - Excessive Sweating' },
      { id: 'hyper-anxiety', name: 'Hyperthyroidism - Anxiety/Nervousness' },
      { id: 'hyper-irritability', name: 'Hyperthyroidism - Irritability' },
      { id: 'hyper-fatigue', name: 'Hyperthyroidism - Fatigue' },
      { id: 'hyper-muscle-weakness', name: 'Hyperthyroidism - Muscle Weakness' },
      { id: 'hyper-sleep-difficulty', name: 'Hyperthyroidism - Difficulty Sleeping' },
      { id: 'hyper-appetite-increase', name: 'Hyperthyroidism - Increased Appetite' },
      { id: 'hyper-bowel-changes', name: 'Hyperthyroidism - Frequent Bowel Movements' },
      // Graves' specific eye symptoms
      { id: 'graves-eye-bulging', name: 'Graves\' - Eye Bulging (Exophthalmos)' },
      { id: 'graves-eye-irritation', name: 'Graves\' - Eye Irritation/Grittiness' },
      { id: 'graves-double-vision', name: 'Graves\' - Double Vision (Diplopia)' },
      { id: 'graves-eye-pain', name: 'Graves\' - Eye Pain/Pressure' },
      { id: 'graves-light-sensitivity', name: 'Graves\' - Light Sensitivity' },
    ]
  },

  // Thyroiditis (DC 7906) - uses hyperthyroid or hypothyroid symptoms
  {
    id: 'thyroiditis',
    name: 'Thyroiditis Symptoms',
    symptoms: [
      { id: 'thyroiditis-neck-pain', name: 'Thyroiditis - Neck Pain/Tenderness' },
      { id: 'thyroiditis-swelling', name: 'Thyroiditis - Thyroid Swelling' },
      { id: 'thyroiditis-difficulty-swallowing', name: 'Thyroiditis - Difficulty Swallowing' },
      { id: 'thyroiditis-hyper-phase', name: 'Thyroiditis - Hyperthyroid Phase Symptoms' },
      { id: 'thyroiditis-hypo-phase', name: 'Thyroiditis - Hypothyroid Phase Symptoms' },
      { id: 'thyroiditis-fatigue', name: 'Thyroiditis - Fatigue' },
    ]
  },

  // Hyperparathyroidism (DC 7904)
  {
    id: 'hyperparathyroidism',
    name: 'Hyperparathyroidism Symptoms',
    symptoms: [
      { id: 'hpth-fatigue', name: 'Hyperparathyroidism - Fatigue' },
      { id: 'hpth-bone-pain', name: 'Hyperparathyroidism - Bone Pain' },
      { id: 'hpth-kidney-stones', name: 'Hyperparathyroidism - Kidney Stones' },
      { id: 'hpth-abdominal-pain', name: 'Hyperparathyroidism - Abdominal Pain' },
      { id: 'hpth-nausea', name: 'Hyperparathyroidism - Nausea' },
      { id: 'hpth-constipation', name: 'Hyperparathyroidism - Constipation' },
      { id: 'hpth-confusion', name: 'Hyperparathyroidism - Confusion/Brain Fog' },
      { id: 'hpth-depression', name: 'Hyperparathyroidism - Depression' },
      { id: 'hpth-muscle-weakness', name: 'Hyperparathyroidism - Muscle Weakness' },
      { id: 'hpth-excessive-thirst', name: 'Hyperparathyroidism - Excessive Thirst' },
      { id: 'hpth-frequent-urination', name: 'Hyperparathyroidism - Frequent Urination' },
      { id: 'hpth-anorexia', name: 'Hyperparathyroidism - Loss of Appetite' },
      { id: 'hpth-fracture', name: 'Hyperparathyroidism - Fragility Fracture' },
    ]
  },

  // Hypoparathyroidism (DC 7905)
  {
    id: 'hypoparathyroidism',
    name: 'Hypoparathyroidism Symptoms',
    symptoms: [
      { id: 'hopth-muscle-cramps', name: 'Hypoparathyroidism - Muscle Cramps' },
      { id: 'hopth-tingling', name: 'Hypoparathyroidism - Tingling (Fingers/Toes/Lips)' },
      { id: 'hopth-muscle-spasms', name: 'Hypoparathyroidism - Muscle Spasms (Tetany)' },
      { id: 'hopth-fatigue', name: 'Hypoparathyroidism - Fatigue' },
      { id: 'hopth-dry-skin', name: 'Hypoparathyroidism - Dry Skin' },
      { id: 'hopth-brittle-nails', name: 'Hypoparathyroidism - Brittle Nails' },
      { id: 'hopth-hair-loss', name: 'Hypoparathyroidism - Hair Loss' },
      { id: 'hopth-seizures', name: 'Hypoparathyroidism - Seizures' },
      { id: 'hopth-depression', name: 'Hypoparathyroidism - Depression' },
      { id: 'hopth-anxiety', name: 'Hypoparathyroidism - Anxiety' },
      { id: 'hopth-memory-problems', name: 'Hypoparathyroidism - Memory Problems' },
      { id: 'hopth-cataracts', name: 'Hypoparathyroidism - Cataracts' },
    ]
  },
// ============================================
// PHASE 3B: ADRENAL & PITUITARY CONDITIONS
// ============================================

// Addison's Disease (Adrenocortical Insufficiency) - DC 7911
  {
    id: 'addisons-disease',
    name: "Addison's Disease Symptoms",
    symptoms: [
      { id: 'addisons-crisis', name: "Addison's Disease - Adrenal Crisis", description: 'Rapid onset vascular collapse with shock, severe weakness, confusion' },
      { id: 'addisons-episode', name: "Addison's Disease - Episode", description: 'Less severe event: nausea, weakness, orthostatic hypotension, malaise' },
      { id: 'addisons-fatigue', name: "Addison's Disease - Fatigue", description: 'Persistent exhaustion and lack of energy' },
      { id: 'addisons-weight-loss', name: "Addison's Disease - Weight Loss", description: 'Unintentional weight loss' },
      { id: 'addisons-hypotension', name: "Addison's Disease - Low Blood Pressure", description: 'Chronic low blood pressure or orthostatic hypotension' },
      { id: 'addisons-hyperpigmentation', name: "Addison's Disease - Skin Darkening", description: 'Hyperpigmentation, especially in skin creases, scars, gums' },
      { id: 'addisons-salt-craving', name: "Addison's Disease - Salt Craving", description: 'Intense craving for salty foods' },
      { id: 'addisons-nausea', name: "Addison's Disease - Nausea/Vomiting", description: 'Nausea, vomiting, or loss of appetite' },
      { id: 'addisons-abdominal-pain', name: "Addison's Disease - Abdominal Pain", description: 'Abdominal pain, often with diarrhea' },
      { id: 'addisons-muscle-weakness', name: "Addison's Disease - Muscle Weakness", description: 'Generalized muscle weakness' },
      { id: 'addisons-muscle-pain', name: "Addison's Disease - Muscle/Joint Pain", description: 'Muscle aches or joint pain' },
      { id: 'addisons-irritability', name: "Addison's Disease - Irritability", description: 'Mood changes, irritability, or depression' },
      { id: 'addisons-dizziness', name: "Addison's Disease - Dizziness", description: 'Dizziness or lightheadedness, especially when standing' },
      { id: 'addisons-hypoglycemia', name: "Addison's Disease - Low Blood Sugar", description: 'Hypoglycemia symptoms: shakiness, sweating, confusion' },
      { id: 'addisons-dehydration', name: "Addison's Disease - Dehydration", description: 'Signs of dehydration despite adequate fluid intake' },
    ],
  },

// Cushing's Syndrome - DC 7907
  {
    id: 'cushings-syndrome',
    name: "Cushing's Syndrome Symptoms",
    symptoms: [
      { id: 'cushings-weight-gain', name: "Cushing's Syndrome - Central Weight Gain", description: 'Weight gain concentrated in face, neck, trunk, abdomen' },
      { id: 'cushings-moon-face', name: "Cushing's Syndrome - Moon Face", description: 'Round, full face (moon facies)' },
      { id: 'cushings-buffalo-hump', name: "Cushing's Syndrome - Buffalo Hump", description: 'Fat accumulation between shoulders (dorsocervical fat pad)' },
      { id: 'cushings-striae', name: "Cushing's Syndrome - Stretch Marks", description: 'Purple or pink stretch marks (striae) on abdomen, thighs, arms' },
      { id: 'cushings-thin-skin', name: "Cushing's Syndrome - Thin/Fragile Skin", description: 'Thin skin that bruises easily, slow wound healing' },
      { id: 'cushings-bruising', name: "Cushing's Syndrome - Easy Bruising", description: 'Bruises appearing with minimal or no trauma' },
      { id: 'cushings-muscle-weakness', name: "Cushing's Syndrome - Proximal Muscle Weakness", description: 'Weakness in upper arms and thighs, difficulty rising from chair or climbing stairs' },
      { id: 'cushings-muscle-wasting', name: "Cushing's Syndrome - Muscle Wasting", description: 'Loss of muscle mass in arms and legs' },
      { id: 'cushings-fatigue', name: "Cushing's Syndrome - Fatigue", description: 'Persistent tiredness and lack of energy' },
      { id: 'cushings-hypertension', name: "Cushing's Syndrome - High Blood Pressure", description: 'Elevated blood pressure' },
      { id: 'cushings-glucose', name: "Cushing's Syndrome - Glucose Intolerance", description: 'High blood sugar or diabetes symptoms' },
      { id: 'cushings-osteoporosis', name: "Cushing's Syndrome - Bone Loss", description: 'Osteoporosis symptoms, fractures, bone pain' },
      { id: 'cushings-mood', name: "Cushing's Syndrome - Mood Changes", description: 'Depression, anxiety, irritability, or cognitive difficulties' },
      { id: 'cushings-insomnia', name: "Cushing's Syndrome - Sleep Problems", description: 'Difficulty sleeping or insomnia' },
      { id: 'cushings-infections', name: "Cushing's Syndrome - Frequent Infections", description: 'Increased susceptibility to infections' },
      { id: 'cushings-acne', name: "Cushing's Syndrome - Acne", description: 'Acne or facial flushing' },
      { id: 'cushings-hirsutism', name: "Cushing's Syndrome - Excess Hair Growth", description: 'Excess facial or body hair (women)' },
      { id: 'cushings-menstrual', name: "Cushing's Syndrome - Menstrual Irregularity", description: 'Irregular or absent menstrual periods' },
      { id: 'cushings-erectile', name: "Cushing's Syndrome - Erectile Dysfunction", description: 'Decreased libido or erectile dysfunction (men)' },
    ],
  },

// Diabetes Insipidus - DC 7909
  {
    id: 'diabetes-insipidus',
    name: 'Diabetes Insipidus Symptoms',
    symptoms: [
      { id: 'di-polyuria', name: 'Diabetes Insipidus - Excessive Urination', description: 'Producing large volumes of dilute urine (polyuria)' },
      { id: 'di-polydipsia', name: 'Diabetes Insipidus - Excessive Thirst', description: 'Intense thirst requiring frequent drinking (polydipsia)' },
      { id: 'di-nocturia', name: 'Diabetes Insipidus - Nighttime Urination', description: 'Waking frequently at night to urinate (nocturia)' },
      { id: 'di-dehydration', name: 'Diabetes Insipidus - Dehydration', description: 'Signs of dehydration: dry mouth, dry skin, fatigue' },
      { id: 'di-fatigue', name: 'Diabetes Insipidus - Fatigue', description: 'Tiredness from fluid/electrolyte imbalance or sleep disruption' },
      { id: 'di-dizziness', name: 'Diabetes Insipidus - Dizziness', description: 'Lightheadedness or dizziness from dehydration' },
      { id: 'di-headache', name: 'Diabetes Insipidus - Headache', description: 'Headaches related to dehydration or electrolyte imbalance' },
      { id: 'di-muscle-cramps', name: 'Diabetes Insipidus - Muscle Cramps', description: 'Muscle cramps from electrolyte imbalance' },
      { id: 'di-constipation', name: 'Diabetes Insipidus - Constipation', description: 'Constipation due to chronic dehydration' },
      { id: 'di-weight-loss', name: 'Diabetes Insipidus - Weight Loss', description: 'Weight loss from excessive fluid loss' },
    ],
  },

// Hyperaldosteronism (Conn's Syndrome) - DC 7917
  {
    id: 'hyperaldosteronism',
    name: 'Hyperaldosteronism Symptoms',
    symptoms: [
      { id: 'haldo-hypertension', name: 'Hyperaldosteronism - High Blood Pressure', description: 'Resistant hypertension, often difficult to control' },
      { id: 'haldo-muscle-weakness', name: 'Hyperaldosteronism - Muscle Weakness', description: 'Generalized muscle weakness from low potassium' },
      { id: 'haldo-muscle-cramps', name: 'Hyperaldosteronism - Muscle Cramps/Spasms', description: 'Muscle cramps or spasms from hypokalemia' },
      { id: 'haldo-fatigue', name: 'Hyperaldosteronism - Fatigue', description: 'Persistent fatigue and tiredness' },
      { id: 'haldo-headaches', name: 'Hyperaldosteronism - Headaches', description: 'Frequent headaches, often from hypertension' },
      { id: 'haldo-polyuria', name: 'Hyperaldosteronism - Frequent Urination', description: 'Increased urination, especially at night' },
      { id: 'haldo-polydipsia', name: 'Hyperaldosteronism - Increased Thirst', description: 'Excessive thirst' },
      { id: 'haldo-numbness', name: 'Hyperaldosteronism - Numbness/Tingling', description: 'Numbness or tingling from electrolyte imbalance' },
      { id: 'haldo-palpitations', name: 'Hyperaldosteronism - Heart Palpitations', description: 'Irregular heartbeat or palpitations from hypokalemia' },
      { id: 'haldo-constipation', name: 'Hyperaldosteronism - Constipation', description: 'Constipation from low potassium affecting gut motility' },
      { id: 'haldo-mood', name: 'Hyperaldosteronism - Mood Changes', description: 'Anxiety, irritability, or mood swings' },
    ],
  },

  // ============================================
  // PHASE 4D: FOOT CONDITIONS
  // ============================================

  // Weak Foot - DC 5277
  {
    id: 'weak-foot',
    name: 'Weak Foot (DC 5277)',
    symptoms: [
      { id: 'wf-muscle-atrophy', name: 'Weak Foot - Muscle Atrophy', description: 'Visible wasting or thinning of foot muscles' },
      { id: 'wf-weakness', name: 'Weak Foot - Generalized Weakness', description: 'Difficulty with foot/toe movements, pushing off while walking' },
      { id: 'wf-circulation-problems', name: 'Weak Foot - Circulation Problems', description: 'Cold feet, color changes, delayed capillary refill' },
      { id: 'wf-numbness', name: 'Weak Foot - Numbness/Tingling', description: 'Sensory changes in feet from disturbed circulation' },
      { id: 'wf-fatigue', name: 'Weak Foot - Foot Fatigue', description: 'Feet tire quickly with standing or walking' },
      { id: 'wf-instability', name: 'Weak Foot - Instability', description: 'Feeling of foot giving way or lack of control' },
      { id: 'wf-balance-difficulty', name: 'Weak Foot - Balance Difficulty', description: 'Difficulty maintaining balance due to foot weakness' },
      { id: 'wf-gait-changes', name: 'Weak Foot - Gait Changes', description: 'Altered walking pattern due to weakness' },
      { id: 'wf-cramping', name: 'Weak Foot - Cramping', description: 'Frequent cramping in foot muscles' },
      { id: 'wf-functional-loss', name: 'Weak Foot - Functional Loss', description: 'Unable to perform activities requiring foot strength' },
    ],
  },

  // Claw Foot (Pes Cavus) - DC 5278
  {
    id: 'claw-foot',
    name: 'Claw Foot/Pes Cavus (DC 5278)',
    symptoms: [
      { id: 'cf-high-arch', name: 'Claw Foot - High Arch', description: 'Abnormally high arch that does not flatten with weight bearing' },
      { id: 'cf-hammer-toes', name: 'Claw Foot - Hammer Toes', description: 'Toes bent at middle joint in claw-like position' },
      { id: 'cf-toe-dorsiflexion', name: 'Claw Foot - Toe Dorsiflexion', description: 'Great toe or all toes tending to bend upward' },
      { id: 'cf-plantar-fascia', name: 'Claw Foot - Shortened Plantar Fascia', description: 'Tight, contracted plantar fascia contributing to high arch' },
      { id: 'cf-dropped-forefoot', name: 'Claw Foot - Dropped Forefoot', description: 'Forefoot positioned lower than hindfoot' },
      { id: 'cf-callosities', name: 'Claw Foot - Painful Callosities', description: 'Painful calluses from abnormal pressure distribution' },
      { id: 'cf-metatarsal-tenderness', name: 'Claw Foot - Metatarsal Head Tenderness', description: 'Pain and tenderness under ball of foot' },
      { id: 'cf-varus-deformity', name: 'Claw Foot - Varus Deformity', description: 'Inward tilting of heel (hindfoot varus)' },
      { id: 'cf-ankle-dorsiflexion-limited', name: 'Claw Foot - Limited Ankle Dorsiflexion', description: 'Reduced ability to flex ankle upward' },
      { id: 'cf-shoe-fitting', name: 'Claw Foot - Shoe Fitting Problems', description: 'Difficulty finding shoes that fit properly' },
      { id: 'cf-instability', name: 'Claw Foot - Ankle Instability', description: 'Frequent ankle sprains or feeling of instability' },
      { id: 'cf-functional-loss', name: 'Claw Foot - Functional Loss', description: 'Walking or standing limitations due to deformity' },
    ],
  },

  // Metatarsalgia (Morton's Disease) - DC 5279
  {
    id: 'metatarsalgia',
    name: 'Metatarsalgia/Morton\'s Disease (DC 5279)',
    symptoms: [
      { id: 'mt-ball-foot-pain', name: 'Metatarsalgia - Ball of Foot Pain', description: 'Sharp, aching, or burning pain in ball of foot' },
      { id: 'mt-numbness-toes', name: 'Metatarsalgia - Toe Numbness', description: 'Numbness or tingling in toes, especially 3rd and 4th' },
      { id: 'mt-burning', name: 'Metatarsalgia - Burning Sensation', description: 'Burning sensation in ball of foot or between toes' },
      { id: 'mt-shooting-pain', name: 'Metatarsalgia - Shooting Pain', description: 'Sharp shooting pain into toes (Morton\'s neuroma)' },
      { id: 'mt-walking-pain', name: 'Metatarsalgia - Pain with Walking', description: 'Pain increases with walking, especially barefoot' },
      { id: 'mt-standing-pain', name: 'Metatarsalgia - Pain with Standing', description: 'Pain worsens with prolonged standing' },
      { id: 'mt-pebble-feeling', name: 'Metatarsalgia - Pebble in Shoe Feeling', description: 'Sensation of walking on a pebble or marble' },
      { id: 'mt-relief-rest', name: 'Metatarsalgia - Relief with Rest', description: 'Pain improves when sitting or removing shoes' },
      { id: 'mt-swelling', name: 'Metatarsalgia - Forefoot Swelling', description: 'Swelling in ball of foot area' },
      { id: 'mt-functional-loss', name: 'Metatarsalgia - Functional Loss', description: 'Unable to walk or stand for extended periods' },
    ],
  },

  // Hallux Valgus (Bunion) - DC 5280
  {
    id: 'hallux-valgus',
    name: 'Hallux Valgus/Bunion (DC 5280)',
    symptoms: [
      { id: 'hv-bunion-pain', name: 'Hallux Valgus - Bunion Pain', description: 'Pain at base of big toe joint (MTP joint)' },
      { id: 'hv-deformity', name: 'Hallux Valgus - Visible Deformity', description: 'Big toe angling toward other toes, bump on side' },
      { id: 'hv-redness', name: 'Hallux Valgus - Redness/Inflammation', description: 'Redness and swelling over bunion area' },
      { id: 'hv-callus', name: 'Hallux Valgus - Callus Formation', description: 'Calluses where big toe and second toe overlap' },
      { id: 'hv-shoe-pain', name: 'Hallux Valgus - Pain with Shoes', description: 'Pain worsens with enclosed or narrow shoes' },
      { id: 'hv-limited-motion', name: 'Hallux Valgus - Limited Big Toe Motion', description: 'Reduced range of motion in big toe joint' },
      { id: 'hv-progressive', name: 'Hallux Valgus - Progressive Worsening', description: 'Deformity or pain gradually worsening over time' },
      { id: 'hv-second-toe', name: 'Hallux Valgus - Second Toe Problems', description: 'Second toe being pushed out of position' },
      { id: 'hv-post-surgical', name: 'Hallux Valgus - Post-Surgical Residuals', description: 'Ongoing symptoms after bunion surgery (resection)' },
      { id: 'hv-functional-loss', name: 'Hallux Valgus - Functional Loss', description: 'Walking limitations due to bunion severity' },
    ],
  },

  // Hallux Rigidus - DC 5281
  {
    id: 'hallux-rigidus',
    name: 'Hallux Rigidus (DC 5281)',
    symptoms: [
      { id: 'hr-toe-stiffness', name: 'Hallux Rigidus - Big Toe Stiffness', description: 'Stiffness in big toe joint, especially in morning' },
      { id: 'hr-toe-pain', name: 'Hallux Rigidus - Big Toe Pain', description: 'Pain in big toe joint during activity' },
      { id: 'hr-limited-motion', name: 'Hallux Rigidus - Limited Dorsiflexion', description: 'Cannot bend big toe upward normally' },
      { id: 'hr-bone-spur', name: 'Hallux Rigidus - Bone Spur', description: 'Bump on top of big toe joint from bone spur' },
      { id: 'hr-walking-pain', name: 'Hallux Rigidus - Pain with Walking', description: 'Pain when pushing off while walking' },
      { id: 'hr-swelling', name: 'Hallux Rigidus - Joint Swelling', description: 'Swelling around big toe joint' },
      { id: 'hr-grinding', name: 'Hallux Rigidus - Grinding Sensation', description: 'Crepitus or grinding feeling in joint' },
      { id: 'hr-cold-weather', name: 'Hallux Rigidus - Weather Sensitivity', description: 'Pain worsens in cold or damp weather' },
      { id: 'hr-shoe-difficulty', name: 'Hallux Rigidus - Shoe Difficulty', description: 'Difficulty wearing shoes with heels or stiff soles' },
      { id: 'hr-functional-loss', name: 'Hallux Rigidus - Functional Loss', description: 'Significant walking limitations due to rigid toe' },
    ],
  },
  // ========== PHASE 5A: DIGESTIVE SYSTEM - HERNIA & STRUCTURAL ==========

  // Hernia (Inguinal, Ventral, Femoral, Umbilical, Incisional) - DC 7338
  {
    id: 'hernia',
    name: 'Hernia (DC 7338)',
    symptoms: [
      { id: 'hernia-groin-bulge', name: 'Hernia - Groin Bulge', description: 'Visible or palpable bulge in groin area (inguinal hernia)' },
      { id: 'hernia-abdominal-bulge', name: 'Hernia - Abdominal Bulge', description: 'Visible or palpable bulge in abdominal wall (ventral/incisional hernia)' },
      { id: 'hernia-umbilical-bulge', name: 'Hernia - Umbilical Bulge', description: 'Bulge at or near the navel (umbilical hernia)' },
      { id: 'hernia-pain-bending', name: 'Hernia - Pain with Bending', description: 'Pain when bending over' },
      { id: 'hernia-pain-adl', name: 'Hernia - Pain with ADLs', description: 'Pain during activities of daily living (bathing, dressing, hygiene, transfers)' },
      { id: 'hernia-pain-walking', name: 'Hernia - Pain with Walking', description: 'Pain when walking' },
      { id: 'hernia-pain-stairs', name: 'Hernia - Pain with Climbing Stairs', description: 'Pain when climbing stairs' },
      { id: 'hernia-pain-straining', name: 'Hernia - Pain with Straining', description: 'Pain when coughing, sneezing, or lifting' },
      { id: 'hernia-pain-standing', name: 'Hernia - Pain with Standing', description: 'Pain worsens with prolonged standing' },
      { id: 'hernia-reducible', name: 'Hernia - Reducible', description: 'Hernia can be pushed back in when lying down' },
      { id: 'hernia-irreducible', name: 'Hernia - Irreducible/Incarcerated', description: 'Hernia cannot be pushed back in, trapped outside abdominal wall' },
      { id: 'hernia-truss-required', name: 'Hernia - Truss/Support Required', description: 'Requires wearing a truss or supportive belt' },
      { id: 'hernia-size-small', name: 'Hernia - Size <3cm', description: 'Hernia measures less than 3 cm in largest dimension' },
      { id: 'hernia-size-medium', name: 'Hernia - Size 3-15cm', description: 'Hernia measures 3 to 15 cm in largest dimension' },
      { id: 'hernia-size-large', name: 'Hernia - Size ≥15cm', description: 'Hernia measures 15 cm or greater in largest dimension' },
      { id: 'hernia-recurrent', name: 'Hernia - Recurrent', description: 'Hernia has returned after previous repair' },
      { id: 'hernia-post-surgical', name: 'Hernia - Post-Surgical/Incisional', description: 'Hernia developed at site of previous surgical incision' },
      { id: 'hernia-strangulation-risk', name: 'Hernia - Strangulation Symptoms', description: 'Severe pain, nausea, vomiting suggesting possible strangulation' },
      { id: 'hernia-functional-limitation', name: 'Hernia - Functional Limitation', description: 'Unable to work or perform normal activities due to hernia' },
    ],
  },

  // Peritoneal Adhesions - DC 7301
  {
    id: 'peritoneal-adhesions',
    name: 'Peritoneal Adhesions (DC 7301)',
    symptoms: [
      { id: 'pa-abdominal-pain', name: 'Adhesions - Abdominal Pain', description: 'Abdominal pain from adhesions' },
      { id: 'pa-nausea', name: 'Adhesions - Nausea', description: 'Nausea related to adhesions' },
      { id: 'pa-vomiting', name: 'Adhesions - Vomiting', description: 'Vomiting from adhesion-related obstruction' },
      { id: 'pa-colic', name: 'Adhesions - Colic/Cramping', description: 'Colicky or cramping abdominal pain' },
      { id: 'pa-constipation', name: 'Adhesions - Constipation', description: 'Constipation from partial obstruction' },
      { id: 'pa-diarrhea', name: 'Adhesions - Diarrhea', description: 'Diarrhea related to adhesions' },
      { id: 'pa-distension', name: 'Adhesions - Abdominal Distension', description: 'Bloating and abdominal distension' },
      { id: 'pa-obstruction-partial', name: 'Adhesions - Partial Obstruction', description: 'Signs of partial bowel obstruction' },
      { id: 'pa-obstruction-complete', name: 'Adhesions - Complete Obstruction', description: 'Signs of complete bowel obstruction requiring emergency care' },
      { id: 'pa-hospitalization', name: 'Adhesions - Hospitalization Required', description: 'Required hospitalization for obstruction management' },
      { id: 'pa-dietary-modification', name: 'Adhesions - Dietary Modification', description: 'Medically-directed dietary changes required' },
      { id: 'pa-tpn-required', name: 'Adhesions - TPN Required', description: 'Requires total parenteral nutrition' },
      { id: 'pa-post-surgical', name: 'Adhesions - Post-Surgical', description: 'Adhesions developed after abdominal surgery' },
      { id: 'pa-post-trauma', name: 'Adhesions - Post-Trauma', description: 'Adhesions developed after abdominal trauma' },
      { id: 'pa-inflammatory', name: 'Adhesions - Inflammatory Disease Related', description: 'Adhesions from chronic cholecystitis, Crohn\'s, or infection' },
      { id: 'pa-recurrent', name: 'Adhesions - Recurrent Episodes', description: 'Recurring symptomatic episodes' },
      { id: 'pa-inoperable', name: 'Adhesions - Inoperable', description: 'Adhesions deemed inoperable or refractory to treatment' },
    ],
  },
  // ========== PHASE 5B: DIGESTIVE SYSTEM - ESOPHAGEAL & POST-SURGICAL ==========
  // Esophageal Stricture - DC 7203
  {
    id: 'esophageal-stricture',
    name: 'Esophageal Stricture (DC 7203)',
    symptoms: [
      { id: 'es-dysphagia-solids', name: 'Stricture - Difficulty Swallowing Solids', description: 'Difficulty swallowing solid foods' },
      { id: 'es-dysphagia-liquids', name: 'Stricture - Difficulty Swallowing Liquids', description: 'Difficulty swallowing liquids' },
      { id: 'es-dysphagia-pills', name: 'Stricture - Difficulty Swallowing Pills', description: 'Difficulty swallowing medications' },
      { id: 'es-food-impaction', name: 'Stricture - Food Impaction', description: 'Food getting stuck in esophagus' },
      { id: 'es-regurgitation', name: 'Stricture - Regurgitation', description: 'Food coming back up after swallowing' },
      { id: 'es-aspiration', name: 'Stricture - Aspiration', description: 'Food or liquid entering airway, causing coughing/choking' },
      { id: 'es-weight-loss', name: 'Stricture - Weight Loss', description: 'Weight loss due to difficulty eating' },
      { id: 'es-undernutrition', name: 'Stricture - Undernutrition', description: 'Malnutrition from inadequate food intake' },
      { id: 'es-dilatation', name: 'Stricture - Dilatation Procedure', description: 'Required esophageal dilatation procedure' },
      { id: 'es-dilatation-steroids', name: 'Stricture - Dilatation with Steroids', description: 'Dilatation requiring steroid injection' },
      { id: 'es-stent', name: 'Stricture - Esophageal Stent', description: 'Required esophageal stent placement' },
      { id: 'es-peg-tube', name: 'Stricture - PEG Tube Required', description: 'Requires percutaneous feeding tube' },
      { id: 'es-daily-medication', name: 'Stricture - Daily Medication Required', description: 'Requires daily medication to control dysphagia' },
      { id: 'es-recurrent', name: 'Stricture - Recurrent Stricture', description: 'Stricture returns after treatment' },
      { id: 'es-refractory', name: 'Stricture - Refractory Stricture', description: 'Stricture not responding to dilatation (5+ sessions)' },
    ],
  },
  // Esophageal Spasm/Motility Disorder - DC 7204
  {
    id: 'esophageal-spasm',
    name: 'Esophageal Spasm/Motility (DC 7204)',
    symptoms: [
      { id: 'esp-chest-pain', name: 'Esophageal Spasm - Chest Pain', description: 'Chest pain from esophageal spasm (may mimic cardiac pain)' },
      { id: 'esp-dysphagia', name: 'Esophageal Spasm - Difficulty Swallowing', description: 'Intermittent difficulty swallowing' },
      { id: 'esp-food-sticking', name: 'Esophageal Spasm - Food Sticking Sensation', description: 'Sensation of food sticking in chest' },
      { id: 'esp-regurgitation', name: 'Esophageal Spasm - Regurgitation', description: 'Food coming back up due to spasm' },
      { id: 'esp-heartburn', name: 'Esophageal Spasm - Heartburn', description: 'Burning sensation associated with spasms' },
      { id: 'esp-triggered-hot-cold', name: 'Esophageal Spasm - Hot/Cold Triggered', description: 'Spasms triggered by hot or cold foods/drinks' },
      { id: 'esp-triggered-stress', name: 'Esophageal Spasm - Stress Triggered', description: 'Spasms triggered by stress or anxiety' },
      { id: 'esp-nocturnal', name: 'Esophageal Spasm - Nocturnal Episodes', description: 'Spasms occurring at night' },
      { id: 'esp-weight-loss', name: 'Esophageal Spasm - Weight Loss', description: 'Weight loss from eating difficulty' },
      { id: 'esp-achalasia', name: 'Esophageal Spasm - Achalasia Symptoms', description: 'Lower esophageal sphincter not relaxing properly' },
    ],
  },
  // Postgastrectomy Syndrome - DC 7308 (rates as DC 7303)
  {
    id: 'postgastrectomy',
    name: 'Postgastrectomy Syndrome (DC 7308)',
    symptoms: [
      { id: 'pgs-dumping-early', name: 'Postgastrectomy - Early Dumping', description: 'Symptoms within 30 min of eating: cramping, diarrhea, sweating, dizziness' },
      { id: 'pgs-dumping-late', name: 'Postgastrectomy - Late Dumping', description: 'Symptoms 1-3 hours after eating: weakness, sweating, shakiness (hypoglycemia)' },
      { id: 'pgs-nausea', name: 'Postgastrectomy - Nausea', description: 'Nausea after eating' },
      { id: 'pgs-vomiting', name: 'Postgastrectomy - Vomiting', description: 'Vomiting after meals' },
      { id: 'pgs-vomiting-daily', name: 'Postgastrectomy - Daily Vomiting', description: 'Vomiting daily despite dietary modification' },
      { id: 'pgs-diarrhea', name: 'Postgastrectomy - Diarrhea', description: 'Frequent loose or watery stools' },
      { id: 'pgs-diarrhea-explosive', name: 'Postgastrectomy - Explosive Diarrhea', description: 'Explosive, unpredictable bowel movements' },
      { id: 'pgs-syncope', name: 'Postgastrectomy - Syncope/Lightheadedness', description: 'Post-meal lightheadedness or fainting' },
      { id: 'pgs-sweating', name: 'Postgastrectomy - Post-Meal Sweating', description: 'Excessive sweating after eating' },
      { id: 'pgs-abdominal-pain', name: 'Postgastrectomy - Abdominal Pain/Discomfort', description: 'Pain or discomfort within an hour of eating' },
      { id: 'pgs-dietary-modification', name: 'Postgastrectomy - Dietary Modification Required', description: 'Requires ongoing dietary changes' },
      { id: 'pgs-medication', name: 'Postgastrectomy - Medication Required', description: 'Requires medication for dumping syndrome' },
      { id: 'pgs-tpn', name: 'Postgastrectomy - TPN Required', description: 'Requires total parenteral nutrition' },
      { id: 'pgs-tube-feeding', name: 'Postgastrectomy - Tube Feeding Required', description: 'Requires tube feeding for nutrition' },
      { id: 'pgs-weight-loss', name: 'Postgastrectomy - Weight Loss', description: 'Significant weight loss from malabsorption' },
    ],
  },
  // Intestinal Fistula - DC 7330
  {
    id: 'intestinal-fistula',
    name: 'Intestinal Fistula (DC 7330)',
    symptoms: [
      { id: 'if-drainage-minimal', name: 'Fistula - Minimal Drainage', description: 'Small amount of fistula drainage' },
      { id: 'if-drainage-moderate', name: 'Fistula - Moderate Drainage', description: 'Moderate drainage requiring pad changes' },
      { id: 'if-drainage-heavy', name: 'Fistula - Heavy Drainage', description: 'Heavy drainage (3+ ostomy bags or 10+ pad changes daily)' },
      { id: 'if-fecal-discharge', name: 'Fistula - Fecal Discharge', description: 'Fecal material draining from fistula' },
      { id: 'if-persistent-drainage', name: 'Fistula - Persistent Drainage', description: 'Drainage persisting for extended period' },
      { id: 'if-skin-irritation', name: 'Fistula - Skin Irritation', description: 'Skin breakdown or irritation around fistula site' },
      { id: 'if-infection', name: 'Fistula - Infection', description: 'Signs of infection at fistula site' },
      { id: 'if-pain', name: 'Fistula - Pain at Site', description: 'Pain at fistula location' },
      { id: 'if-enteral-nutrition', name: 'Fistula - Enteral Nutrition Required', description: 'Requires enteral (tube) feeding support' },
      { id: 'if-tpn', name: 'Fistula - TPN Required', description: 'Requires total parenteral nutrition' },
      { id: 'if-low-bmi', name: 'Fistula - Low BMI (<18)', description: 'BMI below 18 due to fistula' },
      { id: 'if-very-low-bmi', name: 'Fistula - Very Low BMI (<16)', description: 'BMI below 16 due to fistula' },
      { id: 'if-post-surgical', name: 'Fistula - Post-Surgical', description: 'Fistula developed after surgery' },
      { id: 'if-post-radiation', name: 'Fistula - Post-Radiation', description: 'Fistula from radiation therapy' },
      { id: 'if-post-trauma', name: 'Fistula - Post-Trauma', description: 'Fistula from abdominal trauma' },
    ],
  },

];

// Helper function to determine if a category is a "child" of another
const getParentCategory = (categoryName) => {
  const name = categoryName.toLowerCase();

  // Map child categories to their parent keywords
  if (name.includes('gerd') && name.includes('complication')) return 'gerd';
  if (name.includes('tbi') && name.includes('residual')) return 'tbi';
  if (name.includes('ptsd')) return 'ptsd';
  if (name.includes('depression')) return 'depression';
  if (name.includes('anxiety') && name.includes('symptoms')) return 'anxiety';
  if (name.includes('social anxiety')) return 'social-anxiety';
  if (name.includes('ocd')) return 'ocd';
  if (name.includes('adjustment')) return 'adjustment';
  if (name.includes('panic')) return 'panic';
  if (name.includes('bipolar')) return 'bipolar';
  if (name.includes('ibs')) return 'ibs';
  if (name.includes('chronic fatigue')) return 'fatigue';
  if (name.includes('radiculopathy')) return 'radiculopathy';
  if (name.includes('peripheral neuropathy')) return 'neuropathy';
  if (name.includes('asthma')) return 'asthma';
  if (name.includes('copd')) return 'copd';
  if (name.includes('bronchitis')) return 'chronic-bronchitis';
  if (name.includes('emphysema')) return 'emphysema';
  if (name.includes('bronchiectasis')) return 'bronchiectasis';
  if (name.includes('pulmonary fibrosis') || name.includes('interstitial')) return 'pulmonary-fibrosis';
  if (name.includes('sarcoidosis')) return 'sarcoidosis';
  if (name.includes('rhinitis')) return 'rhinitis';
  if (name.includes('sinusitis')) return 'sinusitis';
  if (name.includes('gynecological')) return 'gynecological';
  if (name.includes('endometriosis')) return 'gynecological';
  if (name.includes('pcos')) return 'gynecological';
  if (name.includes('menstrual')) return 'gynecological';
  if (name.includes('hemic-lymphatic')) return 'hemic-lymphatic';
  if (name.includes('anemia')) return 'hemic-lymphatic';
  if (name.includes('blood')) return 'hemic-lymphatic';
  if (name.includes('leukemia')) return 'hemic-lymphatic';
  if (name.includes('lymphoma')) return 'hemic-lymphatic';
  if (name.includes('dental')) return 'dental-oral';
  if (name.includes('oral')) return 'dental-oral';
  if (name.includes('jaw')) return 'dental-oral';
  if (name.includes('tooth')) return 'dental-oral';
  if (name.includes('teeth')) return 'dental-oral';
  if (name.includes('palate')) return 'dental-oral';
  if (name.includes('hiv') || name.includes('aids')) return 'general-infectious';
  if (name.includes('hepatitis')) return 'general-infectious';
  if (name.includes('lyme')) return 'general-infectious';
  if (name.includes('malaria')) return 'general-infectious';
  if (name.includes('gulf war') || name.includes('post-infectious')) return 'general-infectious';
  if (name.includes('q fever') || name.includes('west nile')) return 'general-infectious';
  if (name.includes('somatic')) return 'somatic-symptom-disorder';
  if (name.includes('illness-anxiety')) return 'illness-anxiety';
  if (name.includes('cyclothymic')) return 'cyclothymic';
  if (name.includes('depersonalization') || name.includes('derealization')) return 'depersonalization';
  if (name.includes('anorexia')) return 'anorexia-nervosa';
  if (name.includes('bulimia')) return 'bulimia-nervosa';
  if (name.includes('cardiomyopathy')) return 'heart-disease';
  if (name.includes('arrhythmia') || name.includes('svt') || name.includes('tachycardia')) return 'heart-disease';
  if (name.includes('pericarditis')) return 'heart-disease';
  if (name.includes('cad') || name.includes('coronary artery')) return 'heart-disease';
  if (name.includes('post-mi') || name.includes('myocardial infarction')) return 'heart-disease';
  if (name.includes('hhd') || name.includes('hypertensive heart')) return 'heart-disease';
  if (name.includes('post-phlebitic')) return 'varicose-veins';
  if (name.includes('cold injury') || name.includes('frostbite')) return 'vascular';
  if (name.includes('peripheral arterial') || name.includes('pad')) return 'vascular';
  if (name.includes('cirrhosis')) return 'cirrhosis';
  if (name.includes('gastritis')) return 'gastritis';
  if (name.includes('pancreatitis')) return 'pancreatitis';
  if (name.includes('biliary')) return 'biliary-tract';
  if (name.includes('multiple sclerosis') || name.includes(' ms ')) return 'multiple-sclerosis';
  if (name.includes('parkinson')) return 'parkinsons-disease';
  if (name.includes('myasthenia')) return 'myasthenia-gravis';
  if (name.includes('narcolepsy')) return 'narcolepsy';
  if (name.includes('als') || name.includes('amyotrophic')) return 'als';
  if (name.includes('syringomyelia')) return 'syringomyelia';
  if (name.includes('myelitis')) return 'myelitis';
  if (name.includes('hyperthyroidism') || name.includes('graves')) return 'endocrine';
  if (name.includes('thyroiditis')) return 'endocrine';
  if (name.includes('hyperparathyroidism')) return 'endocrine';
  if (name.includes('hypoparathyroidism')) return 'endocrine';
  if (name.includes('hypothyroidism')) return 'endocrine';
  if (name.includes('addisons') || name.includes('adrenal')) return 'endocrine';
  if (name.includes('cushings') || name.includes('cushing')) return 'endocrine';
  if (name.includes('diabetes insipidus')) return 'endocrine';
  if (name.includes('hyperaldosteronism') || name.includes('aldosterone')) return 'endocrine';
  if (name.includes('upper radicular')) return 'peripheral-nerve';
  if (name.includes('middle radicular')) return 'peripheral-nerve';
  if (name.includes('lower radicular')) return 'peripheral-nerve';
  if (name.includes('all radicular') || name.includes('brachial plexus')) return 'peripheral-nerve';
  if (name.includes('radial nerve') || name.includes('musculospiral')) return 'peripheral-nerve';
  if (name.includes('median nerve') || name.includes('carpal tunnel')) return 'peripheral-nerve';
  if (name.includes('ulnar nerve') || name.includes('cubital tunnel')) return 'peripheral-nerve';
  if (name.includes('musculocutaneous nerve')) return 'peripheral-nerve';
  if (name.includes('circumflex') || name.includes('axillary')) return 'peripheral-nerve';
  if (name.includes('long thoracic')) return 'peripheral-nerve';
  if (name.includes('sciatic nerve')) return 'peripheral-nerve';
  if (name.includes('peroneal')) return 'peripheral-nerve';
  if (name.includes('tibial nerve') || name.includes('internal popliteal')) return 'peripheral-nerve';
  if (name.includes('posterior tibial')) return 'peripheral-nerve';
  if (name.includes('femoral nerve') || name.includes('anterior crural')) return 'peripheral-nerve';
  if (name.includes('saphenous')) return 'peripheral-nerve';
  if (name.includes('obturator')) return 'peripheral-nerve';
  if (name.includes('lateral femoral cutaneous') || name.includes('meralgia')) return 'peripheral-nerve';
  if (name.includes('ilio-inguinal') || name.includes('ilioinguinal')) return 'peripheral-nerve';
  if (name.includes('jacksonian') || name.includes('focal epilepsy')) return 'epilepsy';
  if (name.includes('diencephalic')) return 'epilepsy';
  if (name.includes('psychomotor epilepsy')) return 'epilepsy';
  if (name.includes('gout')) return 'musculoskeletal';
  if (name.includes('bursitis')) return 'musculoskeletal';
  if (name.includes('tendinitis') || name.includes('tenosynovitis')) return 'musculoskeletal';
  if (name.includes('arthritis')) return 'musculoskeletal';
  if (name.includes('myositis')) return 'musculoskeletal';
  if (name.includes('osteomyelitis')) return 'musculoskeletal';
  if (name.includes('vertebral fracture')) return 'spine';
  if (name.includes('sacroiliac')) return 'spine';
  if (name.includes('spinal stenosis')) return 'spine';
  if (name.includes('ankylosing spondylitis')) return 'spine';
  if (name.includes('spinal fusion')) return 'spine';
  if (name.includes('weak foot')) return 'foot-ankle';
  if (name.includes('claw foot') || name.includes('pes cavus')) return 'foot-ankle';
  if (name.includes('metatarsalgia') || name.includes('morton')) return 'foot-ankle';
  if (name.includes('hallux valgus') || name.includes('bunion')) return 'foot-ankle';
  if (name.includes('hallux rigidus')) return 'foot-ankle';
  if (name.includes('hernia')) return 'digestive';
  if (name.includes('peritoneal adhesions') || name.includes('adhesions')) return 'digestive';
  if (name.includes('esophageal stricture') || name.includes('stricture')) return 'digestive';
  if (name.includes('esophageal spasm') || name.includes('motility')) return 'digestive';
  if (name.includes('postgastrectomy') || name.includes('dumping')) return 'digestive';
  if (name.includes('intestinal fistula') || name.includes('fistula')) return 'digestive';
  return null; // No parent, this is a standalone category
};

// Sort categories alphabetically but keep related items together
const sortedCategories = [...symptomCategories].sort((a, b) => {
  const aParent = getParentCategory(a.name);
  const bParent = getParentCategory(b.name);

  // If both have same parent, maintain original order
  if (aParent === bParent && aParent !== null) {
    return 0;
  }

  // If 'a' is parent of 'b', a comes first
  if (a.name.toLowerCase().includes(bParent)) {
    return -1;
  }

  // If 'b' is parent of 'a', b comes first
  if (b.name.toLowerCase().includes(aParent)) {
    return 1;
  }

  // Otherwise, sort alphabetically
  return a.name.localeCompare(b.name);
});

// Export sorted categories for use in dropdowns
export const sortedSymptomCategories = sortedCategories;

// Flatten all symptoms for easy lookup
export const allSymptoms = symptomCategories.flatMap(cat =>
    cat.symptoms.map(sym => ({ ...sym, category: cat.name }))
);