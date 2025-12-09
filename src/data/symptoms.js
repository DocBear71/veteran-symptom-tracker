// Common symptoms tracked for VA disability claims
// Organized by body system for easier navigation
export const symptomCategories = [
  {
    id: 'pain',
    name: 'Pain',
    symptoms: [
      { id: 'back-pain', name: 'Back Pain' },
      { id: 'neck-pain', name: 'Neck Pain' },
      { id: 'knee-pain', name: 'Knee Pain' },
      { id: 'shoulder-pain', name: 'Shoulder Pain' },
      { id: 'hip-pain', name: 'Hip Pain' },
      { id: 'headache', name: 'Headache (Tension/Other)' },
      { id: 'migraine', name: 'Migraine' },
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
  }
];

// Flatten all symptoms for easy lookup
export const allSymptoms = symptomCategories.flatMap(cat =>
    cat.symptoms.map(sym => ({ ...sym, category: cat.name }))
);