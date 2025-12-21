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
  if (name.includes('post-phlebitic')) return 'varicose-veins';
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