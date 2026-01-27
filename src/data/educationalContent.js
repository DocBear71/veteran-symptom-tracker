/**
 * educationalContent.js
 *
 * Educational content database for WhyTrackThis component.
 * Maps symptom IDs and categories to VA rating explanations.
 *
 * Structure:
 * - Specific symptom IDs (highest priority)
 * - Category fallbacks (prefixed with _category_)
 * - Default fallback
 */

export const educationalContent = {
  // ==========================================
  // HEADACHES & MIGRAINES (DC 8100)
  // ==========================================
  'migraine': {
    icon: '🤕',
    title: 'Why Track Migraine Details?',
    dcCode: 'DC 8100',
    text: 'The VA rates migraines on FREQUENCY of prostrating attacks, not just severity. Documenting "X prostrating migraines per month" over time is powerful evidence.',
    keyPoint: 'The 50% rating requires "very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability."',
    tip: 'Log EVERY migraine, even mild ones. The pattern over months matters more than one bad day.'
  },
  'headache': {
    icon: '🤕',
    title: 'Why Track Headache Details?',
    text: 'Non-migraine headaches may indicate other ratable conditions. Track frequency, triggers, and whether they affect your ability to work.',
    tip: 'If headaches are frequent, discuss with your doctor whether they might be migraines (rated differently).'
  },

  // ==========================================
  // PTSD SYMPTOMS (DC 9411)
  // ==========================================
  'ptsd-nightmare': {
    icon: '😰',
    title: 'Why Track Nightmares?',
    dcCode: 'DC 9411',
    text: 'Nightmare frequency is a key PTSD symptom. The VA looks at how often nightmares occur and their impact on sleep quality and daily functioning.',
    tip: 'Document what time you woke up, if you could return to sleep, and how you felt the next day.'
  },
  'ptsd-flashback': {
    icon: '🧠',
    title: 'Why Track Flashbacks?',
    dcCode: 'DC 9411',
    text: 'Flashback frequency and intensity demonstrate PTSD severity. Document triggers, duration, and what you had to stop doing.',
    tip: 'Note if flashbacks caused you to leave work, avoid activities, or isolate yourself.'
  },
  'ptsd-panic': {
    icon: '😨',
    title: 'Why Track PTSD Panic Attacks?',
    dcCode: 'DC 9411',
    text: 'Panic attack frequency directly affects your rating. Weekly attacks vs. monthly attacks can mean a significant rating difference.',
    keyPoint: 'Document physical symptoms (racing heart, sweating, shaking) - these distinguish panic attacks from general anxiety.',
    tip: 'Note what you were doing when it started and how long until you felt normal again.'
  },
  'ptsd-avoidance': {
    icon: '🚫',
    title: 'Why Track Avoidance?',
    dcCode: 'DC 9411',
    text: 'Avoidance behavior shows how PTSD limits your life. The VA considers "social and occupational impairment."',
    tip: 'Be specific: "Avoided grocery store due to crowds" is better than "felt anxious."'
  },
  'ptsd-hypervigilance': {
    icon: '👁️',
    title: 'Why Track Hypervigilance?',
    dcCode: 'DC 9411',
    text: 'Hypervigilance shows your nervous system is stuck in "threat mode." Document specific incidents and impact.',
    tip: 'Note situations that triggered heightened alertness and what you did in response.'
  },

  // ==========================================
  // GENERAL MENTAL HEALTH
  // ==========================================
  'anxiety': {
    icon: '😰',
    title: 'Why Track Anxiety?',
    dcCode: 'DC 9400',
    text: 'Anxiety disorders are rated on functional impairment. Document panic attacks, avoidance, and impact on work/relationships.',
    tip: 'Be specific about what you couldn\'t do because of anxiety.'
  },
  'depression': {
    icon: '😔',
    title: 'Why Track Depression?',
    dcCode: 'DC 9434',
    text: 'Depression is rated on occupational and social impairment. Document how symptoms affect your daily life.',
    keyPoint: 'Track days you couldn\'t get out of bed, missed work, or avoided social activities.',
    tip: 'Note both good and bad days - the overall pattern matters.'
  },
  'nightmares': {
    icon: '😰',
    title: 'Why Track Nightmares?',
    text: 'Nightmares can be symptoms of PTSD, anxiety, or sleep disorders. Track frequency to identify patterns.',
    tip: 'Note if nightmares woke you and whether you could return to sleep.'
  },
  'irritability': {
    icon: '😤',
    title: 'Why Track Irritability?',
    dcCode: 'DC 9411/9434',
    text: 'Irritability and anger are symptoms of PTSD, depression, and TBI. Document outbursts and their impact.',
    tip: 'Note what triggered the irritability and any consequences.'
  },
  'concentration': {
    icon: '🧠',
    title: 'Why Track Concentration Issues?',
    text: 'Difficulty concentrating can support ratings for PTSD, TBI, depression, or anxiety.',
    tip: 'Note work errors, reading difficulties, or forgotten tasks.'
  },
  'hypervigilance': {
    icon: '👁️',
    title: 'Why Track Hypervigilance?',
    dcCode: 'DC 9411',
    text: 'Hypervigilance is a key PTSD symptom showing your nervous system remains in threat mode.',
    tip: 'Document specific situations where you were unusually alert.'
  },
  'sleep-issues': {
    icon: '😴',
    title: 'Why Track Sleep Problems?',
    text: 'Sleep disturbance can be a symptom of PTSD, depression, anxiety, or a standalone condition.',
    tip: 'Track hours slept, times woken, and how you feel in the morning.'
  },

  // Depression symptoms
  'mdd-episode': {
    icon: '😔',
    title: 'Why Track Depressive Episodes?',
    dcCode: 'DC 9434',
    text: 'Episode frequency and duration are key. A "major" episode lasting weeks rates differently than brief low moods.',
    tip: 'Document missed work, social isolation, and self-care neglect during episodes.'
  },
  'mdd-anhedonia': {
    icon: '😶',
    title: 'Why Track Loss of Interest?',
    dcCode: 'DC 9434',
    text: 'Anhedonia (loss of interest/pleasure) is a core depression symptom.',
    tip: 'List specific hobbies or activities you\'ve abandoned.'
  },
  'mdd-hopelessness': {
    icon: '😔',
    title: 'Why Track Hopelessness?',
    dcCode: 'DC 9434',
    text: 'Persistent hopelessness indicates depression severity.',
    tip: 'Note how hopelessness affects your motivation and planning.'
  },

  // Anxiety symptoms
  'gad-worry': {
    icon: '😰',
    title: 'Why Track Excessive Worry?',
    dcCode: 'DC 9400',
    text: 'Excessive worry that\'s hard to control is a hallmark of GAD.',
    tip: 'Note how much time per day you spend worrying.'
  },
  'gad-restlessness': {
    icon: '😰',
    title: 'Why Track Restlessness?',
    dcCode: 'DC 9400',
    text: 'Restlessness and feeling "keyed up" are GAD symptoms.',
    tip: 'Note if restlessness interferes with sitting still or sleeping.'
  },
  'gad-muscle-tension': {
    icon: '💪',
    title: 'Why Track Muscle Tension?',
    dcCode: 'DC 9400',
    text: 'Chronic muscle tension often accompanies anxiety disorders.',
    tip: 'Note if tension causes pain or requires treatment.'
  },

  // Panic symptoms
  'panic-attack': {
    icon: '😨',
    title: 'Why Track Panic Attacks?',
    dcCode: 'DC 9412',
    text: 'Panic attack FREQUENCY is the key rating factor. Weekly attacks rate higher than monthly.',
    keyPoint: 'Document physical symptoms: racing heart, shortness of breath, chest pain, sweating.',
    tip: 'Note duration and what you had to stop doing.'
  },
  'panic-agoraphobia': {
    icon: '🏠',
    title: 'Why Track Agoraphobia?',
    dcCode: 'DC 9412',
    text: 'Agoraphobia shows functional impairment. Document avoided situations.',
    tip: 'List specific places you avoid due to panic fear.'
  },
  'panic-anticipatory-anxiety': {
    icon: '😰',
    title: 'Why Track Anticipatory Anxiety?',
    dcCode: 'DC 9412',
    text: 'Constant fear of the next panic attack is itself disabling.',
    tip: 'Note activities you avoid due to fear of having a panic attack.'
  },

  // Bipolar symptoms
  'bipolar-manic': {
    icon: '⚡',
    title: 'Why Track Manic Episodes?',
    dcCode: 'DC 9432',
    text: 'Manic episode frequency and severity affect rating. Document decreased sleep need, racing thoughts, impulsive behavior.',
    keyPoint: 'Note consequences: spending sprees, risky behavior, hospitalizations.',
    tip: 'Track sleep hours - significantly reduced sleep need is a key symptom.'
  },
  'bipolar-depressive': {
    icon: '😔',
    title: 'Why Track Depressive Episodes?',
    dcCode: 'DC 9432',
    text: 'Bipolar depressive episodes are rated similarly to major depression.',
    tip: 'Document how long episodes last and what activities were affected.'
  },
  'bipolar-mixed': {
    icon: '🔄',
    title: 'Why Track Mixed Episodes?',
    dcCode: 'DC 9432',
    text: 'Mixed episodes are particularly disabling. Document co-occurring symptoms.',
    tip: 'Note simultaneous high energy AND depressed mood.'
  },

  // OCD symptoms
  'ocd-obsessions': {
    icon: '🔁',
    title: 'Why Track Obsessive Thoughts?',
    dcCode: 'DC 9404',
    text: 'Intrusive, unwanted thoughts that cause distress are OCD obsessions.',
    tip: 'Document how much time per day obsessive thoughts occupy your mind.'
  },
  'ocd-compulsions': {
    icon: '🔁',
    title: 'Why Track Compulsions?',
    dcCode: 'DC 9404',
    text: 'Time spent on rituals directly affects rating. More than 1 hour/day is significant.',
    keyPoint: 'OCD ratings consider time occupied by symptoms and interference with routine.',
    tip: 'Track how long rituals take and what they prevent you from doing.'
  },
  'ocd-checking': {
    icon: '✅',
    title: 'Why Track Checking?',
    dcCode: 'DC 9404',
    text: 'Checking compulsions consume time and cause distress.',
    tip: 'Count how many times you check and how much time it takes daily.'
  },
  'ocd-contamination': {
    icon: '🧼',
    title: 'Why Track Contamination Fears?',
    dcCode: 'DC 9404',
    text: 'Contamination OCD involves excessive cleaning/washing.',
    tip: 'Document handwashing frequency and places you avoid.'
  },
  'ocd-time-spent': {
    icon: '⏱️',
    title: 'Why Track Ritual Time?',
    dcCode: 'DC 9404',
    text: 'Time spent on OCD rituals is a key rating factor.',
    keyPoint: 'The 50% rating requires rituals that interfere with routine.',
    tip: 'Use a timer to accurately track ritual duration.'
  },

  // ==========================================
  // PAIN CONDITIONS
  // ==========================================
  'back-pain': {
    icon: '⚡',
    title: 'Why Track Back Pain?',
    dcCode: 'DC 5235-5243',
    text: 'Back conditions are rated on range of motion AND incapacitating episodes.',
    keyPoint: '"Incapacitating episodes" requiring bed rest prescribed by a physician can add to your rating.',
    tip: 'Document what activities you cannot do during flares.'
  },
  'neck-pain': {
    icon: '⚡',
    title: 'Why Track Neck Pain?',
    dcCode: 'DC 5235-5243',
    text: 'Cervical spine conditions are rated on range of motion.',
    tip: 'Note if pain radiates to arms (radiculopathy) - this can be rated separately.'
  },
  'knee-pain': {
    icon: '🦵',
    title: 'Why Track Knee Pain?',
    dcCode: 'DC 5003/5260/5261',
    text: 'Knees can be rated for arthritis, limitation of flexion, AND limitation of extension.',
    keyPoint: 'Document instability (giving way) separately - DC 5257 rates instability.',
    tip: 'Track giving way episodes and activities that cause pain.'
  },
  'shoulder-pain': {
    icon: '💪',
    title: 'Why Track Shoulder Pain?',
    dcCode: 'DC 5200-5203',
    text: 'Shoulder conditions are rated on range of motion - how high can you raise your arm?',
    tip: 'Note if you can raise arm to shoulder level, above, or overhead.'
  },
  'hip-pain': {
    icon: '🦵',
    title: 'Why Track Hip Pain?',
    dcCode: 'DC 5250-5255',
    text: 'Hip ratings depend on range of motion - flexion, extension, rotation.',
    tip: 'Note difficulty with stairs, getting out of chairs, or putting on shoes.'
  },
  'joint-pain': {
    icon: '⚡',
    title: 'Why Track Joint Pain?',
    dcCode: 'DC 5003',
    text: 'Joint pain from arthritis is rated on X-ray findings AND functional limitation.',
    tip: 'Track which joints hurt and morning stiffness duration.'
  },
  'lower-back-pain': {
    icon: '⚡',
    title: 'Why Track Lower Back Pain?',
    dcCode: 'DC 5237',
    text: 'Lumbosacral strain is rated on forward flexion range.',
    tip: 'Note if pain radiates to legs (radiculopathy).'
  },

  // ==========================================
  // NEUROLOGICAL
  // ==========================================
  'tinnitus': {
    icon: '👂',
    title: 'Why Track Tinnitus?',
    dcCode: 'DC 6260',
    text: 'Tinnitus has a maximum 10% rating, but documenting severity helps establish SECONDARY conditions.',
    keyPoint: 'Tinnitus commonly causes sleep problems, concentration issues, and anxiety - all separately ratable.',
    tip: 'Track how tinnitus affects sleep, concentration, and mood.'
  },
  'dizziness': {
    icon: '😵',
    title: 'Why Track Dizziness?',
    dcCode: 'DC 6204',
    text: 'Vertigo and dizziness frequency directly affects rating.',
    keyPoint: 'Document if dizziness causes staggering - supports higher ratings.',
    tip: 'Note triggers, duration, and if you had to stop activities.'
  },
  'numbness': {
    icon: '🖐️',
    title: 'Why Track Numbness?',
    dcCode: 'DC 8510-8730',
    text: 'Peripheral nerve symptoms can be rated separately for each affected nerve.',
    tip: 'Map where numbness occurs - each nerve can be rated.'
  },
  'tremors': {
    icon: '🖐️',
    title: 'Why Track Tremors?',
    dcCode: 'DC 8004',
    text: 'Tremor severity affects rating. Document when tremors occur and activities affected.',
    tip: 'Note if tremors affect writing, eating, or holding objects.'
  },
  'memory': {
    icon: '🧠',
    title: 'Why Track Memory Problems?',
    text: 'Memory issues can support TBI, PTSD, or dementia ratings.',
    tip: 'Note missed appointments, forgotten names, and work errors.'
  },
  'seizure-major': {
    icon: '⚡',
    title: 'Why Track Major Seizures?',
    dcCode: 'DC 8910',
    text: 'Grand mal seizure FREQUENCY determines rating.',
    keyPoint: 'One major seizure per month = 80% rating.',
    tip: 'Note date, time, duration, witnesses, and recovery time.'
  },
  'seizure-minor': {
    icon: '⚡',
    title: 'Why Track Minor Seizures?',
    dcCode: 'DC 8911',
    text: 'Minor/absence seizures are rated on frequency.',
    tip: 'Note when others report you "spaced out."'
  },

  // ==========================================
  // RESPIRATORY (DC 6600-6847)
  // ==========================================
  'asthma-attack': {
    icon: '🫁',
    title: 'Why Track Asthma?',
    dcCode: 'DC 6602',
    text: 'Asthma is rated on FEV-1 test results AND medication requirements.',
    keyPoint: 'Intermittent inhaler = 10%. Daily inhaler = 30%. Daily + steroids = 60%.',
    tip: 'Document rescue inhaler uses and any oral steroid courses.'
  },
  'asthma-rescue-inhaler': {
    icon: '🫁',
    title: 'Why Track Inhaler Use?',
    dcCode: 'DC 6602',
    text: 'Rescue inhaler frequency is a key rating factor.',
    tip: 'Log every rescue inhaler use with date, time, and trigger.'
  },
  'copd-exacerbation': {
    icon: '🫁',
    title: 'Why Track COPD Flares?',
    dcCode: 'DC 6604',
    text: 'COPD exacerbations requiring antibiotics or steroids indicate severity.',
    tip: 'Note medications prescribed, ER visits, and hospitalizations.'
  },
  'copd-oxygen-use': {
    icon: '🫁',
    title: 'Why Track Oxygen Use?',
    dcCode: 'DC 6604',
    text: 'Requiring supplemental oxygen is a 100% rating for most respiratory conditions.',
    tip: 'Track when you use oxygen - continuous rates higher than activity-only.'
  },

  // ==========================================
  // DIGESTIVE/GI (DC 7200-7354)
  // ==========================================
  'gerd': {
    icon: '🔥',
    title: 'Why Track GERD?',
    dcCode: 'DC 7346',
    text: 'GERD ratings depend on symptoms despite medication.',
    tip: 'Document if symptoms occur despite taking medications.'
  },
  'gerd-heartburn': {
    icon: '🔥',
    title: 'Why Track Heartburn?',
    dcCode: 'DC 7346',
    text: 'Heartburn frequency affects rating. "Persistently recurrent" rates higher.',
    tip: 'Log every episode with severity and what helped.'
  },
  'ibs-diarrhea': {
    icon: '🚽',
    title: 'Why Track IBS?',
    dcCode: 'DC 7319',
    text: 'IBS is rated on frequency. "More or less constant abdominal distress" supports 30%.',
    keyPoint: 'As of May 2024, IBS minimum is 10% if service-connected.',
    tip: 'Track episodes per day, not just per week.'
  },
  'ibs-constipation': {
    icon: '🚽',
    title: 'Why Track Constipation?',
    dcCode: 'DC 7319',
    text: 'IBS-C should document constipation episodes and their impact.',
    tip: 'Note days without bowel movements and associated pain.'
  },
  'ibs-pain': {
    icon: '🚽',
    title: 'Why Track Abdominal Pain?',
    dcCode: 'DC 7319',
    text: 'Abdominal pain and distress are key IBS symptoms.',
    tip: 'Document pain severity, location, and activities prevented.'
  },
  'uc-diarrhea': {
    icon: '🚽',
    title: 'Why Track UC/IBD?',
    dcCode: 'DC 7323',
    text: 'Ulcerative colitis is rated on severity. Document bloody stools and hospitalizations.',
    tip: 'Track bowel movements per day.'
  },

  // ==========================================
  // SKIN (DC 7800-7833)
  // ==========================================
  'eczema-flare': {
    icon: '🩹',
    title: 'Why Track Skin Flares?',
    dcCode: 'DC 7806',
    text: 'Skin conditions are rated on body surface area AND treatment type.',
    keyPoint: 'Topical steroids = lower. Oral steroids/immunosuppressants = higher.',
    tip: 'Document percentage of body affected and treatments used.'
  },
  'psoriasis-flare': {
    icon: '🩹',
    title: 'Why Track Psoriasis?',
    dcCode: 'DC 7816',
    text: 'Psoriasis is rated on body area and treatment type.',
    tip: 'Take photos during flares for your records.'
  },
  'scar-pain': {
    icon: '🩹',
    title: 'Why Track Scar Pain?',
    dcCode: 'DC 7804',
    text: 'Painful scars can be rated separately from the underlying condition.',
    tip: 'Note if scars are unstable, painful, or limit movement.'
  },

  // ==========================================
  // CARDIOVASCULAR (DC 7000-7123)
  // ==========================================
  'chest-pressure': {
    icon: '❤️',
    title: 'Why Track Chest Symptoms?',
    dcCode: 'DC 7005',
    text: 'Heart conditions are rated on METs. Document what activity triggers symptoms.',
    tip: 'Note what you were doing when symptoms started.'
  },
  'palpitations': {
    icon: '💓',
    title: 'Why Track Palpitations?',
    dcCode: 'DC 7010-7011',
    text: 'Arrhythmias are rated on frequency and treatment requirements.',
    tip: 'Document episode duration and if you needed medical care.'
  },
  'high-blood-pressure': {
    icon: '💉',
    title: 'Why Track Blood Pressure?',
    dcCode: 'DC 7101',
    text: 'Hypertension ratings depend on readings and medication requirements.',
    tip: 'Log all readings with date, time, and symptoms.'
  },

  // ==========================================
  // DIABETES/ENDOCRINE
  // ==========================================
  'dm-hyperglycemia-episode': {
    icon: '🩸',
    title: 'Why Track Blood Sugar?',
    dcCode: 'DC 7913',
    text: 'Diabetes ratings depend on treatment and activity regulation.',
    keyPoint: '10%=diet. 20%=oral/insulin. 40%=insulin+restriction. 60%=+complications.',
    tip: 'Document hypoglycemic episodes requiring assistance.'
  },
  'dm-hypoglycemia-episode': {
    icon: '🩸',
    title: 'Why Track Low Blood Sugar?',
    dcCode: 'DC 7913',
    text: 'Hypoglycemic episodes requiring assistance indicate severity.',
    keyPoint: 'Episodes requiring hospital/assistance support 60%+ ratings.',
    tip: 'Note if you needed help, sugar/glucagon, or ER visit.'
  },
  'hypo-fatigue': {
    icon: '🦋',
    title: 'Why Track Thyroid Symptoms?',
    dcCode: 'DC 7903',
    text: 'Hypothyroidism is rated on symptoms present despite medication.',
    tip: 'Document ongoing symptoms while on thyroid medication.'
  },

  // ==========================================
  // TBI
  // ==========================================
  'tbi-memory': {
    icon: '🧠',
    title: 'Why Track TBI Memory?',
    dcCode: 'DC 8045',
    text: 'TBI is rated on cognitive, emotional/behavioral, and physical facets.',
    tip: 'Document specific memory failures and their impact.'
  },
  'tbi-concentration': {
    icon: '🧠',
    title: 'Why Track TBI Concentration?',
    dcCode: 'DC 8045',
    text: 'Difficulty concentrating affects the cognitive facet rating.',
    tip: 'Note tasks you can\'t complete or attention span issues.'
  },
  'tbi-headache': {
    icon: '🤕',
    title: 'Why Track Post-TBI Headaches?',
    dcCode: 'DC 8045',
    text: 'Post-traumatic headaches are a TBI residual.',
    keyPoint: 'Prostrating headaches are rated like migraines under DC 8100.',
    tip: 'Track frequency and whether headaches are prostrating.'
  },
  'tbi-mood': {
    icon: '😔',
    title: 'Why Track TBI Mood Changes?',
    dcCode: 'DC 8045',
    text: 'Emotional and behavioral changes are rated under the emotional facet.',
    tip: 'Document irritability, depression, or personality changes since TBI.'
  },

  // ==========================================
  // FIBROMYALGIA (DC 5025)
  // ==========================================
  'fibro-widespread-pain': {
    icon: '⚡',
    title: 'Why Track Fibromyalgia?',
    dcCode: 'DC 5025',
    text: 'Fibromyalgia is rated 10%, 20%, or 40% based on symptom constancy and therapy response.',
    keyPoint: '40% = widespread pain constant and refractory to therapy.',
    tip: 'Document which body quadrants have pain.'
  },
  'fibro-tender-points': {
    icon: '⚡',
    title: 'Why Track Tender Points?',
    dcCode: 'DC 5025',
    text: 'Tender point count helps establish fibromyalgia severity.',
    tip: 'Note specific tender points when active.'
  },
  'fibro-fatigue': {
    icon: '😴',
    title: 'Why Track Fibro Fatigue?',
    dcCode: 'DC 5025',
    text: 'Fatigue is a key fibromyalgia symptom for rating.',
    tip: 'Document how fatigue limits daily activities.'
  },

  // ==========================================
  // GENITOURINARY
  // ==========================================
  'urinary-frequency': {
    icon: '🚽',
    title: 'Why Track Urinary Frequency?',
    dcCode: 'DC 7512',
    text: 'Voiding dysfunction is rated on frequency.',
    keyPoint: 'Voiding 1-2 hours = 10%. Less than 1 hour = 20%.',
    tip: 'Track daytime voiding and nighttime awakenings.'
  },
  'urinary-incontinence': {
    icon: '🚽',
    title: 'Why Track Incontinence?',
    dcCode: 'DC 7512',
    text: 'Urinary incontinence is rated on absorbent material use.',
    tip: 'Document how many times daily you change pads.'
  },
  'nocturia': {
    icon: '🌙',
    title: 'Why Track Nocturia?',
    dcCode: 'DC 7512',
    text: 'Awakening to void 3-4 times/night supports 20%.',
    tip: 'Track exactly how many times you wake to urinate.'
  },
  'erectile-dysfunction': {
    icon: '⚕️',
    title: 'Why Track ED?',
    dcCode: 'DC 7522',
    text: 'ED from service-connected conditions qualifies for SMC-K.',
    keyPoint: 'SMC-K provides additional monthly compensation.',
    tip: 'Document if ED is related to medications or other SC conditions.'
  },

  // ==========================================
  // EYE/VISION
  // ==========================================
  'vision-loss': {
    icon: '👁️',
    title: 'Why Track Vision Loss?',
    dcCode: 'DC 6061-6079',
    text: 'Vision is rated on visual acuity and visual field loss.',
    tip: 'Keep copies of all eye exam results.'
  },
  'dry-eyes': {
    icon: '👁️',
    title: 'Why Track Dry Eyes?',
    dcCode: 'DC 6025',
    text: 'Chronic dry eye syndrome is rated on severity and treatment.',
    tip: 'Document eye drop frequency and prescription treatments.'
  },

  // ==========================================
  // HEARING
  // ==========================================
  'hearing-loss-noticed': {
    icon: '👂',
    title: 'Why Track Hearing?',
    dcCode: 'DC 6100',
    text: 'Hearing loss is rated based on audiometric testing.',
    tip: 'Note specific situations where hearing is difficult.'
  },
  'menieres-vertigo': {
    icon: '😵',
    title: 'Why Track Meniere\'s?',
    dcCode: 'DC 6205',
    text: 'Meniere\'s is rated on frequency of vertigo attacks.',
    keyPoint: 'Hearing impairment + attacks + tinnitus + cerebellar gait = 100%.',
    tip: 'Track vertigo duration and associated hearing changes.'
  },

  // ==========================================
  // CATEGORY FALLBACKS (prefix with _category_)
  // ==========================================
  '_category_headaches': {
    icon: '🤕',
    title: 'Why Track Headaches?',
    dcCode: 'DC 8100',
    text: 'Headache conditions are rated on frequency and severity. Prostrating headaches rate higher.',
    tip: 'Document whether headaches prevent normal activities.'
  },
  '_category_ptsd': {
    icon: '🧠',
    title: 'Why Track PTSD Symptoms?',
    dcCode: 'DC 9411',
    text: 'PTSD is rated on "occupational and social impairment." Frequency matters - daily vs weekly can mean 20-30% difference.',
    tip: 'Track how symptoms affect work, relationships, and daily activities.'
  },
  '_category_depression': {
    icon: '😔',
    title: 'Why Track Depression?',
    dcCode: 'DC 9434',
    text: 'Depression is rated on occupational and social impairment.',
    tip: 'Track missed work, social isolation, and self-care changes.'
  },
  '_category_anxiety': {
    icon: '😰',
    title: 'Why Track Anxiety?',
    dcCode: 'DC 9400',
    text: 'Anxiety is rated on functional impairment.',
    tip: 'Document panic attacks, avoidance, and impact on work.'
  },
  '_category_social-anxiety': {
    icon: '😰',
    title: 'Why Track Social Anxiety?',
    dcCode: 'DC 9403',
    text: 'Social anxiety is rated on social and occupational impairment.',
    tip: 'Document avoided situations and missed opportunities.'
  },
  '_category_ocd': {
    icon: '🔁',
    title: 'Why Track OCD?',
    dcCode: 'DC 9404',
    text: 'OCD is rated on time consumed by rituals. More than 1 hour/day is significant.',
    tip: 'Track time spent on obsessions and compulsions daily.'
  },
  '_category_panic': {
    icon: '😨',
    title: 'Why Track Panic?',
    dcCode: 'DC 9412',
    text: 'Panic disorder is rated on attack frequency and functional impact.',
    tip: 'Document every panic attack with physical symptoms.'
  },
  '_category_bipolar': {
    icon: '🔄',
    title: 'Why Track Bipolar?',
    dcCode: 'DC 9432',
    text: 'Bipolar is rated on impairment during manic and depressive episodes.',
    tip: 'Document both episode types with duration and consequences.'
  },
  '_category_mental-health': {
    icon: '🧠',
    title: 'Why Track Mental Health?',
    text: 'Mental health conditions are rated on work and social functioning.',
    tip: 'Track both good and bad days - the pattern matters.'
  },
  '_category_pain': {
    icon: '⚡',
    title: 'Why Track Pain?',
    text: 'Pain is rated on functional limitation, not just pain level.',
    keyPoint: 'Flare-ups/"incapacitating episodes" can add to spine ratings.',
    tip: 'Track duration of flares and activities you had to stop.'
  },
  '_category_neurological': {
    icon: '🧠',
    title: 'Why Track Neurological Symptoms?',
    text: 'Neurological conditions are rated on functional impact.',
    tip: 'Track if symptoms affect work or daily tasks.'
  },
  '_category_respiratory': {
    icon: '🫁',
    title: 'Why Track Respiratory Symptoms?',
    text: 'Respiratory conditions are rated on PFTs AND medication requirements.',
    tip: 'Document inhaler uses and breathing limitations.'
  },
  '_category_digestive': {
    icon: '🚽',
    title: 'Why Track Digestive Symptoms?',
    text: 'GI conditions are rated on frequency. "Constant" rates higher than "occasional."',
    tip: 'Track episodes per day/week - frequency is key.'
  },
  '_category_ibs': {
    icon: '🚽',
    title: 'Why Track IBS?',
    dcCode: 'DC 7319',
    text: 'IBS is rated on frequency. "Constant distress" supports 30%.',
    tip: 'Document episodes per day.'
  },
  '_category_gerd': {
    icon: '🔥',
    title: 'Why Track GERD?',
    dcCode: 'DC 7346',
    text: 'GERD is rated on symptom persistence despite medication.',
    tip: 'Document symptoms even when taking medications.'
  },
  '_category_ulcerative-colitis': {
    icon: '🚽',
    title: 'Why Track UC/IBD?',
    dcCode: 'DC 7323',
    text: 'Ulcerative colitis is rated on attack frequency and severity.',
    tip: 'Track bowel movements per day and systemic symptoms.'
  },
  '_category_skin': {
    icon: '🩹',
    title: 'Why Track Skin Symptoms?',
    text: 'Skin conditions are rated on body area AND treatment type.',
    tip: 'Document percentage affected and all treatments.'
  },
  '_category_cardiovascular': {
    icon: '❤️',
    title: 'Why Track Heart Symptoms?',
    text: 'Heart conditions are rated on METs and ejection fraction.',
    tip: 'Note if symptoms occur at rest vs. with activity.'
  },
  '_category_genitourinary': {
    icon: '🚽',
    title: 'Why Track Urinary Symptoms?',
    text: 'Voiding dysfunction is rated on frequency and incontinence.',
    tip: 'Document voiding frequency and pad use.'
  },
  '_category_eye-vision': {
    icon: '👁️',
    title: 'Why Track Vision?',
    text: 'Vision conditions are rated on visual acuity and field loss.',
    tip: 'Keep records of all eye exams.'
  },
  '_category_sleep-disorders': {
    icon: '😴',
    title: 'Why Track Sleep?',
    text: 'Sleep disorders are rated on symptoms and treatment.',
    tip: 'Track hours slept, awakenings, and daytime fatigue.'
  },
  '_category_tbi': {
    icon: '🧠',
    title: 'Why Track TBI Symptoms?',
    dcCode: 'DC 8045',
    text: 'TBI is rated on cognitive, emotional, and physical facets.',
    tip: 'Track memory, mood, and physical symptoms separately.'
  },
  '_category_fibromyalgia': {
    icon: '⚡',
    title: 'Why Track Fibromyalgia?',
    dcCode: 'DC 5025',
    text: 'Fibromyalgia ratings depend on symptom constancy and therapy response.',
    tip: 'Document widespread pain, tender points, and fatigue.'
  },
  '_category_chronic-fatigue': {
    icon: '😴',
    title: 'Why Track CFS?',
    dcCode: 'DC 6354',
    text: 'CFS is rated on debilitating fatigue that persists despite rest.',
    tip: 'Document fatigue severity and activity limitations.'
  },
  '_category_back-spine': {
    icon: '⚡',
    title: 'Why Track Spine Symptoms?',
    dcCode: 'DC 5235-5243',
    text: 'Spine conditions are rated on range of motion and incapacitating episodes.',
    keyPoint: 'Bed rest prescribed by physician can add to rating.',
    tip: 'Document flare-ups requiring bed rest.'
  },
  '_category_shoulder': {
    icon: '💪',
    title: 'Why Track Shoulder?',
    dcCode: 'DC 5200-5203',
    text: 'Shoulder ratings depend on arm motion limitation.',
    tip: 'Note if limitation is above, at, or below shoulder level.'
  },
  '_category_knee': {
    icon: '🦵',
    title: 'Why Track Knee?',
    dcCode: 'DC 5256-5263',
    text: 'Knees can be rated for instability, arthritis, and motion limitation.',
    tip: 'Track instability (giving way) separately from pain.'
  },
  '_category_hip': {
    icon: '🦵',
    title: 'Why Track Hip?',
    dcCode: 'DC 5250-5255',
    text: 'Hip conditions are rated on range of motion.',
    tip: 'Note difficulty with stairs and rising from chairs.'
  },
  '_category_ankle': {
    icon: '🦶',
    title: 'Why Track Ankle?',
    dcCode: 'DC 5270-5274',
    text: 'Ankle ratings depend on range of motion and stability.',
    tip: 'Track giving way episodes and limited motion.'
  },
  '_category_foot-ankle': {
    icon: '🦶',
    title: 'Why Track Foot/Ankle?',
    dcCode: 'DC 5276-5284',
    text: 'Foot conditions are rated on severity and functional impact.',
    tip: 'Document activities that cause pain.'
  },
  '_category_elbow': {
    icon: '💪',
    title: 'Why Track Elbow?',
    dcCode: 'DC 5205-5213',
    text: 'Elbow ratings depend on flexion, extension, and rotation.',
    tip: 'Note limitations in bending and rotating.'
  },
  '_category_wrist': {
    icon: '🖐️',
    title: 'Why Track Wrist?',
    dcCode: 'DC 5214-5215',
    text: 'Wrist conditions are rated on range of motion.',
    tip: 'Document limitations in wrist movement.'
  },
  '_category_dementia': {
    icon: '🧠',
    title: 'Why Track Cognitive Symptoms?',
    dcCode: 'DC 9326',
    text: 'Dementia is rated on memory, orientation, and daily functioning.',
    tip: 'Document memory lapses and ADL difficulties.'
  },
  '_category_diabetes-mellitus': {
    icon: '🩸',
    title: 'Why Track Diabetes?',
    dcCode: 'DC 7913',
    text: 'Diabetes ratings depend on treatment and activity regulation.',
    keyPoint: 'Insulin + regulation + complications = higher ratings.',
    tip: 'Track readings, insulin use, and hypoglycemic episodes.'
  },
  '_category_hypothyroidism': {
    icon: '🦋',
    title: 'Why Track Thyroid?',
    dcCode: 'DC 7903',
    text: 'Hypothyroidism is rated on symptoms despite treatment.',
    tip: 'Document ongoing fatigue and cold intolerance.'
  },
  '_category_hyperthyroidism': {
    icon: '🦋',
    title: 'Why Track Hyperthyroid?',
    dcCode: 'DC 7900',
    text: 'Hyperthyroidism is rated on symptoms and cardiac effects.',
    tip: 'Track heart rate, weight changes, and tremors.'
  },
  '_category_raynauds': {
    icon: '🖐️',
    title: 'Why Track Raynaud\'s?',
    dcCode: 'DC 7117',
    text: 'Raynaud\'s is rated on attack frequency and complications.',
    tip: 'Document color changes, numbness, and tissue damage.'
  },
  '_category_varicose-veins': {
    icon: '🦵',
    title: 'Why Track Varicose Veins?',
    dcCode: 'DC 7120',
    text: 'Varicose veins are rated on edema, skin changes, and ulceration.',
    tip: 'Document swelling, skin discoloration, and ulcers.'
  },
  '_category_ear-balance': {
    icon: '👂',
    title: 'Why Track Ear/Balance?',
    dcCode: 'DC 6204-6260',
    text: 'Vestibular conditions are rated on vertigo frequency.',
    tip: 'Track dizziness episodes and any staggering.'
  },
  '_category_hearing': {
    icon: '👂',
    title: 'Why Track Hearing?',
    dcCode: 'DC 6100',
    text: 'Hearing loss is rated on audiometric testing.',
    tip: 'Document situations where hearing is difficult.'
  },
  '_category_dental': {
    icon: '🦷',
    title: 'Why Track Dental?',
    dcCode: 'DC 9900-9916',
    text: 'Dental and TMJ conditions are rated on functional impact.',
    tip: 'Document jaw pain, limited opening, and chewing difficulties.'
  },
  '_category_dental-oral': {
    icon: '🦷',
    title: 'Why Track Oral Symptoms?',
    text: 'Oral conditions affect eating and speaking.',
    tip: 'Track chewing difficulties and pain episodes.'
  },
  '_category_gynecological': {
    icon: '⚕️',
    title: 'Why Track Gynecological?',
    dcCode: 'DC 7610-7632',
    text: 'Gynecological conditions are rated on symptoms and treatment.',
    tip: 'Document cycle irregularities and pain.'
  },
  '_category_infectious': {
    icon: '🦠',
    title: 'Why Track Infection Symptoms?',
    text: 'Infectious disease residuals are rated on ongoing symptoms.',
    tip: 'Document lingering symptoms after treatment.'
  },
  '_category_hemic-lymphatic': {
    icon: '🩸',
    title: 'Why Track Blood Disorders?',
    dcCode: 'DC 7700-7724',
    text: 'Blood disorders are rated on treatment and complications.',
    tip: 'Document transfusions and hospitalizations.'
  },
  '_category_immune': {
    icon: '🛡️',
    title: 'Why Track Immune Symptoms?',
    text: 'Immune disorders are rated on treatment and functional impact.',
    tip: 'Document flares and medication side effects.'
  },
  '_category_endocrine': {
    icon: '⚗️',
    title: 'Why Track Endocrine?',
    text: 'Endocrine conditions are rated on treatment and complications.',
    tip: 'Document medication changes and complications.'
  },
  '_category_arthritis': {
    icon: '🦴',
    title: 'Why Track Arthritis?',
    dcCode: 'DC 5003',
    text: 'Arthritis is rated on X-ray findings and functional limitation.',
    tip: 'Track joint pain, morning stiffness, and flare-ups.'
  },
  '_category_multi-joint-arthritis': {
    icon: '🦴',
    title: 'Why Track Multi-Joint Arthritis?',
    dcCode: 'DC 5002',
    text: 'Rheumatoid arthritis considers systemic symptoms and incapacitating episodes.',
    keyPoint: 'Incapacitating exacerbations can support higher ratings.',
    tip: 'Document affected joints and systemic symptoms.'
  },
  '_category_gout': {
    icon: '🦶',
    title: 'Why Track Gout?',
    dcCode: 'DC 5017',
    text: 'Gout is rated on attack frequency and joint damage.',
    tip: 'Document each attack with affected joint and treatment.'
  },
  '_category_als': {
    icon: '🧠',
    title: 'Why Track ALS?',
    dcCode: 'DC 8017',
    text: 'ALS receives minimum 100% rating. Documentation supports Aid & Attendance.',
    tip: 'Document progression of weakness and breathing difficulties.'
  },
  '_category_multiple-sclerosis': {
    icon: '🧠',
    title: 'Why Track MS?',
    dcCode: 'DC 8018',
    text: 'MS receives minimum 30% rating. Document relapses and residuals.',
    tip: 'Track each relapse, symptoms, and recovery time.'
  },
  '_category_parkinsons-disease': {
    icon: '🧠',
    title: 'Why Track Parkinson\'s?',
    dcCode: 'DC 8004',
    text: 'Parkinson\'s receives minimum 30% rating.',
    tip: 'Track tremor, rigidity, and bradykinesia progression.'
  },

  // ==========================================
  // DEFAULT FALLBACK
  // ==========================================
  '_default': {
    icon: '💡',
    title: 'Why Track This?',
    text: 'Consistent symptom documentation over time builds evidence for VA claims. The VA looks for patterns, frequency, and functional impact.',
    tip: 'Track how symptoms affect your daily life, work, and relationships.'
  }
};

// ============================================
// CATEGORY MAPPING
// Maps category IDs to educational content keys
// ============================================
export const categoryMapping = {
  // Mental Health
  'headaches': '_category_headaches',
  'pain': '_category_pain',
  'mental-health': '_category_mental-health',
  'ptsd': '_category_ptsd',
  'depression': '_category_depression',
  'anxiety': '_category_anxiety',
  'social-anxiety': '_category_social-anxiety',
  'ocd': '_category_ocd',
  'adjustment-disorder': '_category_depression',
  'panic': '_category_panic',
  'bipolar': '_category_bipolar',
  'dementia': '_category_dementia',
  'acute-stress-disorder': '_category_ptsd',
  'cyclothymic': '_category_bipolar',
  'schizoaffective-disorder': '_category_mental-health',
  'schizophrenia': '_category_mental-health',
  'delusional-disorder': '_category_mental-health',
  'brief-psychotic-disorder': '_category_mental-health',
  'psychotic-disorder-nos': '_category_mental-health',
  'dissociative-amnesia': '_category_mental-health',
  'dissociative-identity-disorder': '_category_mental-health',
  'depersonalization': '_category_mental-health',
  'somatic-symptom-disorder': '_category_mental-health',
  'illness-anxiety': '_category_anxiety',
  'anorexia-nervosa': '_category_mental-health',
  'bulimia-nervosa': '_category_mental-health',
  'binge-eating-disorder': '_category_mental-health',
  'antisocial-personality-disorder': '_category_mental-health',
  'borderline-personality-disorder': '_category_mental-health',
  'narcissistic-personality-disorder': '_category_mental-health',
  'avoidant-personality-disorder': '_category_mental-health',

  // Sleep
  'sleep-disorders': '_category_sleep-disorders',
  'narcolepsy': '_category_sleep-disorders',

  // Neurological
  'neurological': '_category_neurological',
  'tbi': '_category_tbi',
  'tbi-residuals': '_category_tbi',
  'als': '_category_als',
  'multiple-sclerosis': '_category_multiple-sclerosis',
  'parkinsons-disease': '_category_parkinsons-disease',
  'myelitis': '_category_neurological',
  'syringomyelia': '_category_neurological',
  'jacksonian-epilepsy': '_category_neurological',
  'psychomotor-epilepsy': '_category_neurological',
  'diencephalic-epilepsy': '_category_neurological',
  'myasthenia-gravis': '_category_neurological',

  // Peripheral Nerves
  'radiculopathy': '_category_neurological',
  'peripheral-neuropathy': '_category_neurological',
  'sciatic-nerve': '_category_neurological',
  'femoral-nerve': '_category_neurological',
  'median-nerve': '_category_neurological',
  'ulnar-nerve': '_category_neurological',
  'radial-nerve': '_category_neurological',
  'common-peroneal-nerve': '_category_neurological',
  'tibial-nerve': '_category_neurological',

  // Musculoskeletal
  'back-spine': '_category_back-spine',
  'shoulder': '_category_shoulder',
  'knee': '_category_knee',
  'hip': '_category_hip',
  'ankle': '_category_ankle',
  'foot-ankle': '_category_foot-ankle',
  'elbow': '_category_elbow',
  'wrist': '_category_wrist',
  'thigh': '_category_pain',
  'achilles': '_category_pain',
  'fibromyalgia': '_category_fibromyalgia',
  'arthritis': '_category_arthritis',
  'multi-joint-arthritis': '_category_multi-joint-arthritis',
  'gout': '_category_gout',
  'bursitis': '_category_arthritis',
  'tendinitis': '_category_pain',
  'myositis': '_category_pain',
  'osteomyelitis': '_category_pain',
  'sacroiliac': '_category_back-spine',
  'spinal-stenosis': '_category_back-spine',
  'spinal-fusion': '_category_back-spine',
  'ankylosing-spondylitis': '_category_back-spine',
  'vertebral-fracture': '_category_back-spine',
  'hallux-valgus': '_category_foot-ankle',
  'hallux-rigidus': '_category_foot-ankle',
  'claw-foot': '_category_foot-ankle',
  'metatarsalgia': '_category_foot-ankle',
  'weak-foot': '_category_foot-ankle',

  // Respiratory
  'respiratory': '_category_respiratory',
  'asthma': '_category_respiratory',
  'copd': '_category_respiratory',
  'chronic-bronchitis': '_category_respiratory',
  'emphysema': '_category_respiratory',
  'bronchiectasis': '_category_respiratory',
  'pulmonary-fibrosis': '_category_respiratory',
  'tuberculosis-active': '_category_respiratory',
  'tuberculosis-inactive': '_category_respiratory',
  'sarcoidosis': '_category_respiratory',
  'rhinitis': '_category_respiratory',
  'sinusitis': '_category_respiratory',
  'deviated-septum': '_category_respiratory',
  'nose-loss': '_category_respiratory',
  'chronic-laryngitis': '_category_respiratory',
  'aphonia': '_category_respiratory',
  'laryngeal-stenosis': '_category_respiratory',
  'pharynx-injury': '_category_respiratory',

  // GI/Digestive
  'digestive': '_category_digestive',
  'ibs': '_category_ibs',
  'gerd': '_category_gerd',
  'gerd-complications': '_category_gerd',
  'ulcerative-colitis': '_category_ulcerative-colitis',
  'peptic-ulcer': '_category_digestive',
  'diverticulitis': '_category_digestive',
  'gastritis': '_category_digestive',
  'pancreatitis': '_category_digestive',
  'cirrhosis': '_category_digestive',
  'hepatitis': '_category_digestive',
  'biliary-tract': '_category_digestive',
  'hernia': '_category_digestive',
  'hemorrhoids': '_category_digestive',
  'anal-fistula': '_category_digestive',
  'intestinal-fistula': '_category_digestive',
  'rectal-prolapse': '_category_digestive',
  'rectal-stricture': '_category_digestive',
  'peritoneal-adhesions': '_category_digestive',
  'postgastrectomy': '_category_digestive',
  'esophageal-stricture': '_category_digestive',
  'esophageal-spasm': '_category_digestive',
  'pruritus-ani': '_category_digestive',
  'sphincter-control': '_category_digestive',
  'pelvic-floor-dysfunction': '_category_digestive',

  // Skin
  'skin': '_category_skin',
  'dermatophytosis': '_category_skin',
  'skin-infections': '_category_skin',
  'bullous-disorders': '_category_skin',
  'discoid-lupus': '_category_skin',
  'acne': '_category_skin',
  'chloracne': '_category_skin',
  'alopecia-areata': '_category_skin',
  'hyperhidrosis': '_category_skin',
  'cutaneous-vasculitis': '_category_skin',
  'urticaria': '_category_skin',

  // Cardiovascular
  'cardiovascular': '_category_cardiovascular',
  'heart-disease': '_category_cardiovascular',
  'cad': '_category_cardiovascular',
  'cardiomyopathy': '_category_cardiovascular',
  'hypertensive-heart': '_category_cardiovascular',
  'arrhythmia': '_category_cardiovascular',
  'post-mi': '_category_cardiovascular',
  'pericarditis': '_category_cardiovascular',
  'peripheral-arterial-disease': '_category_cardiovascular',
  'varicose-veins': '_category_varicose-veins',
  'post-phlebitic': '_category_cardiovascular',
  'raynauds': '_category_raynauds',
  'cold-injury': '_category_cardiovascular',

  // Genitourinary
  'genitourinary': '_category_genitourinary',
  'penis-conditions': '_category_genitourinary',
  'testis-conditions': '_category_genitourinary',

  // Eye/Vision
  'eye-vision': '_category_eye-vision',
  'chronic-conjunctivitis': '_category_eye-vision',
  'keratitis': '_category_eye-vision',
  'uveitis': '_category_eye-vision',
  'scleritis': '_category_eye-vision',

  // Ear/Hearing
  'ear-balance': '_category_ear-balance',
  'hearing': '_category_hearing',
  'peripheral-vestibular': '_category_ear-balance',
  'chronic-otitis-externa': '_category_hearing',
  'chronic-suppurative-otitis-media': '_category_hearing',
  'chronic-nonsuppurative-otitis-media': '_category_hearing',

  // Dental
  'dental': '_category_dental',
  'dental-oral': '_category_dental-oral',

  // Endocrine
  'endocrine': '_category_endocrine',
  'diabetes-mellitus': '_category_diabetes-mellitus',
  'hypothyroidism': '_category_hypothyroidism',
  'hyperthyroidism': '_category_hyperthyroidism',
  'diabetes-insipidus': '_category_endocrine',
  'hyperparathyroidism': '_category_endocrine',
  'hypoparathyroidism': '_category_endocrine',
  'hyperaldosteronism': '_category_endocrine',
  'cushings-syndrome': '_category_endocrine',
  'addisons-disease': '_category_endocrine',
  'thyroiditis': '_category_endocrine',

  // Gynecological
  'gynecological': '_category_gynecological',

  // Infectious
  'infectious': '_category_infectious',
  'general-infectious': '_category_infectious',
  'gulf-war-infectious': '_category_infectious',
  'hiv-aids': '_category_infectious',
  'lyme-disease': '_category_infectious',
  'malaria': '_category_infectious',
  'brucellosis': '_category_infectious',
  'campylobacter': '_category_infectious',
  'salmonella': '_category_infectious',
  'shigella': '_category_infectious',
  'west-nile': '_category_infectious',
  'q-fever': '_category_infectious',
  'ntm': '_category_infectious',
  'syphilis': '_category_infectious',
  'neurosyphilis': '_category_infectious',

  // Blood/Lymphatic
  'hemic-lymphatic': '_category_hemic-lymphatic',

  // Immune
  'immune': '_category_immune',
  'systemic-lupus': '_category_immune',

  // Fatigue
  'fatigue': '_category_chronic-fatigue',
  'chronic-fatigue': '_category_chronic-fatigue',

  // Loss of smell/taste
  'loss-of-smell': '_category_neurological',
  'loss-of-taste': '_category_neurological',
};