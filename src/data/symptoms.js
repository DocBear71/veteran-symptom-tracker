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
    // Phase 3: Social Anxiety Disorder (DC 9403)
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
    // Phase 3: OCD (DC 9404)
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
    // Phase 3: Adjustment Disorder (DC 9440)
    {
        id: 'adjustment-disorder',
        name: 'Adjustment Disorder Symptoms',
        symptoms: [
            { id: 'adjustment-depressed-mood', name: 'Adjustment Disorder - Depressed Mood' },
            { id: 'adjustment-anxiety', name: 'Adjustment Disorder - Anxiety' },
            { id: 'adjustment-disturbance-conduct', name: 'Adjustment Disorder - Behavioral Changes' },
            { id: 'adjustment-work-difficulty', name: 'Adjustment Disorder - Work/School Difficulty' },
            { id: 'adjustment-relationship-problems', name: 'Adjustment Disorder - Relationship Problems' },
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
    if (name.includes('rhinitis')) return 'rhinitis';
    if (name.includes('sinusitis')) return 'sinusitis';

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