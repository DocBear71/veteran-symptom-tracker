/* eslint-disable no-unused-vars */

// ============================================
// DIGESTIVE RATING CRITERIA
// ============================================
// Extracted from ratingCriteria.js as part of the
// Modular Body System Architecture refactor.
//
// Covers: IBS, GERD, GERD Complications, Ulcerative Colitis,
// Peptic Ulcer, Hemorrhoids, Diverticulitis, Cirrhosis,
// Gastritis, Pancreatitis, Biliary Tract, Hernia,
// Peritoneal Adhesions, Esophageal (Stricture/Spasm),
// Postgastrectomy, Intestinal Fistula, Sphincter Control,
// Rectal (Stricture/Prolapse), Anal Fistula, Pruritus Ani.
//
// Based on 38 CFR Part 4, § 4.114 (Digestive System)
//
// DISCLAIMER: For documentation guidance only.
// The VA makes all final rating determinations.

// ============================================
// SHARED HELPERS
// ============================================

const getLogSymptomId = (log) => {
  return log.symptomId || log.symptom || null;
};

const isWithinEvaluationPeriod = (timestamp, days) => {
  const logDate = new Date(timestamp);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return logDate >= cutoffDate;
};

// ============================================
// DIGESTIVE CONDITIONS (for CONDITIONS object)
// ============================================
export const DIGESTIVE_CONDITIONS = {
  IBS: {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    diagnosticCode: '7319',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['ibs-diarrhea', 'ibs-constipation', 'ibs-pain', 'ibs-bloating', 'ibs-urgency'],
  },
  GERD: {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease (GERD)',
    diagnosticCode: '7346',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['gerd-heartburn', 'gerd-regurgitation', 'gerd-chest-pain', 'gerd-difficulty-swallowing', 'gerd-nausea'],
  },
  GERD_COMPLICATIONS: {
    id: 'gerd-complications',
    name: 'GERD with Complications',
    diagnosticCode: '7346',
    cfrReference: '38 CFR 4.114',
    symptomIds: ['gerd-complication'],
  },
  ULCERATIVE_COLITIS: {
    id: 'ulcerative-colitis',
    name: 'Ulcerative Colitis / IBD',
    diagnosticCode: '7323/7326',
    cfrReference: '38 CFR 4.114',
    symptomIds: [ 'uc-diarrhea', 'uc-rectal-bleeding', 'uc-abdominal-pain', 'uc-urgency', 'uc-incontinence', 'uc-fever', 'uc-hospitalization',
    ],
  },
  PEPTIC_ULCER: {
    id: 'peptic-ulcer',
    name: 'Peptic Ulcer Disease',
    diagnosticCode: '7304',
    cfrReference: '38 CFR 4.114',
    symptomIds: [ 'ulcer-abdominal-pain', 'ulcer-nausea', 'ulcer-vomiting', 'ulcer-hematemesis', 'ulcer-melena', 'ulcer-hospitalization',
    ],
  },
  DIVERTICULITIS: {
    id: 'diverticulitis',
    name: 'Diverticulitis',
    diagnosticCode: '7327',
    cfrReference: '38 CFR 4.114',
    symptomIds: [ 'divert-abdominal-pain', 'divert-fever', 'divert-flare', 'divert-hospitalization', 'divert-complication',
    ],
  },
  CIRRHOSIS: {
    id: 'cirrhosis',
    name: 'Cirrhosis of the Liver',
    diagnosticCode: '7312',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'cirrhosis-fatigue', 'cirrhosis-ascites', 'cirrhosis-edema', 'cirrhosis-jaundice',
      'cirrhosis-encephalopathy', 'cirrhosis-variceal-bleed', 'cirrhosis-sbp', 'cirrhosis-coagulopathy',
      'cirrhosis-splenomegaly', 'cirrhosis-anorexia', 'cirrhosis-malaise', 'cirrhosis-abdominal-pain',
      'cirrhosis-itching', 'cirrhosis-hospitalization',
    ],
  },
  GASTRITIS: {
    id: 'gastritis',
    name: 'Gastritis, Chronic',
    diagnosticCode: '7307',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'gastritis-abdominal-pain', 'gastritis-nausea', 'gastritis-vomiting', 'gastritis-bloating',
      'gastritis-indigestion', 'gastritis-hematemesis', 'gastritis-melena', 'gastritis-hospitalization',
    ],
  },
  PANCREATITIS: {
    id: 'pancreatitis',
    name: 'Pancreatitis, Chronic',
    diagnosticCode: '7347',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'pancreatitis-abdominal-pain', 'pancreatitis-back-pain', 'pancreatitis-nausea', 'pancreatitis-vomiting',
      'pancreatitis-maldigestion', 'pancreatitis-weight-loss', 'pancreatitis-enzyme-use',
      'pancreatitis-dietary-restriction', 'pancreatitis-tube-feeding', 'pancreatitis-cyst',
      'pancreatitis-hospitalization',
    ],
  },
  BILIARY_TRACT: {
    id: 'biliary-tract',
    name: 'Chronic Biliary Tract Disease',
    diagnosticCode: '7314',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'biliary-ruq-pain', 'biliary-nausea', 'biliary-vomiting', 'biliary-jaundice',
      'biliary-fever', 'biliary-dilation', 'biliary-attack',
    ],
  },
  HERNIA: {
    id: 'hernia',
    name: 'Hernia',
    diagnosticCode: '7338',
    cfrReference: '38 CFR 4.114',
    description: 'Includes inguinal, femoral, umbilical, ventral, incisional, and other hernias (not hiatal)',
    symptomIds: [
      'hernia-groin-bulge', 'hernia-abdominal-bulge', 'hernia-umbilical-bulge',
      'hernia-pain-bending', 'hernia-pain-adl', 'hernia-pain-walking', 'hernia-pain-stairs',
      'hernia-pain-straining', 'hernia-pain-standing', 'hernia-reducible', 'hernia-irreducible',
      'hernia-truss-required', 'hernia-size-small', 'hernia-size-medium', 'hernia-size-large',
      'hernia-recurrent', 'hernia-post-surgical', 'hernia-strangulation-risk', 'hernia-functional-limitation'
    ],
  },
  PERITONEAL_ADHESIONS: {
    id: 'peritoneal-adhesions',
    name: 'Peritoneal Adhesions',
    diagnosticCode: '7301',
    cfrReference: '38 CFR 4.114',
    description: 'Adhesions of peritoneum due to surgery, trauma, disease, or infection',
    symptomIds: [
      'pa-abdominal-pain', 'pa-nausea', 'pa-vomiting', 'pa-colic', 'pa-constipation',
      'pa-diarrhea', 'pa-distension', 'pa-obstruction-partial', 'pa-obstruction-complete',
      'pa-hospitalization', 'pa-dietary-modification', 'pa-tpn-required', 'pa-post-surgical',
      'pa-post-trauma', 'pa-inflammatory', 'pa-recurrent', 'pa-inoperable'
    ],
  },
  ESOPHAGEAL_STRICTURE: {
    id: 'esophageal-stricture',
    name: 'Esophageal Stricture',
    diagnosticCode: '7203',
    cfrReference: '38 CFR 4.114',
    description: 'Narrowing of the esophagus causing swallowing difficulties',
    symptomIds: [
      'es-dysphagia-solids', 'es-dysphagia-liquids', 'es-dysphagia-pills', 'es-food-impaction',
      'es-regurgitation', 'es-aspiration', 'es-weight-loss', 'es-undernutrition',
      'es-dilatation', 'es-dilatation-steroids', 'es-stent', 'es-peg-tube',
      'es-daily-medication', 'es-recurrent', 'es-refractory'
    ],
  },
  ESOPHAGEAL_SPASM: {
    id: 'esophageal-spasm',
    name: 'Esophageal Spasm/Motility Disorder',
    diagnosticCode: '7204',
    cfrReference: '38 CFR 4.114',
    description: 'Esophageal motility disorders including achalasia, diffuse spasm, nutcracker esophagus',
    symptomIds: [
      'esp-chest-pain', 'esp-dysphagia', 'esp-food-sticking', 'esp-regurgitation',
      'esp-heartburn', 'esp-triggered-hot-cold', 'esp-triggered-stress', 'esp-nocturnal',
      'esp-weight-loss', 'esp-achalasia'
    ],
  },
  POSTGASTRECTOMY: {
    id: 'postgastrectomy',
    name: 'Postgastrectomy Syndrome',
    diagnosticCode: '7308',
    cfrReference: '38 CFR 4.114',
    description: 'Chronic complications following stomach surgery including dumping syndrome',
    symptomIds: [
      'pgs-dumping-early', 'pgs-dumping-late', 'pgs-nausea', 'pgs-vomiting', 'pgs-vomiting-daily',
      'pgs-diarrhea', 'pgs-diarrhea-explosive', 'pgs-syncope', 'pgs-sweating',
      'pgs-abdominal-pain', 'pgs-dietary-modification', 'pgs-medication',
      'pgs-tpn', 'pgs-tube-feeding', 'pgs-weight-loss'
    ],
  },
  INTESTINAL_FISTULA: {
    id: 'intestinal-fistula',
    name: 'Intestinal Fistula',
    diagnosticCode: '7330',
    cfrReference: '38 CFR 4.114',
    description: 'External fistula of the intestine',
    symptomIds: [
      'if-drainage-minimal', 'if-drainage-moderate', 'if-drainage-heavy', 'if-fecal-discharge',
      'if-persistent-drainage', 'if-skin-irritation', 'if-infection', 'if-pain',
      'if-enteral-nutrition', 'if-tpn', 'if-low-bmi', 'if-very-low-bmi',
      'if-post-surgical', 'if-post-radiation', 'if-post-trauma'
    ],
  },
  SPHINCTER_CONTROL: {
    id: 'sphincter-control',
    name: 'Rectum and Anus, Impairment of Sphincter Control',
    diagnosticCode: '7332',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      // Incontinence levels
      'sphincter-complete-loss', 'sphincter-frequent-loss', 'sphincter-occasional-loss', 'sphincter-rare-loss',
      'sphincter-incontinence-solids', 'sphincter-incontinence-liquids', 'sphincter-incontinence-gas',
      // Frequency
      'sphincter-daily-episodes', 'sphincter-weekly-episodes', 'sphincter-monthly-episodes',
      // Management
      'sphincter-pad-use-daily', 'sphincter-pad-use-weekly', 'sphincter-pad-use-monthly',
      'sphincter-bowel-program', 'sphincter-digital-stimulation', 'sphincter-medication',
      'sphincter-special-diet', 'sphincter-surgery-needed',
      // Retention
      'sphincter-retention', 'sphincter-constipation-severe',
      // Impact
      'sphincter-social-limitation', 'sphincter-work-limitation', 'sphincter-hygiene-issues',
    ],
    bodySystem: 'digestive',
  },
  RECTAL_STRICTURE: {
    id: 'rectal-stricture',
    name: 'Rectum and Anus, Stricture',
    diagnosticCode: '7333',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'stricture-complete-obstruction', 'stricture-severe', 'stricture-moderate', 'stricture-mild',
      'stricture-pain-defecation', 'stricture-straining', 'stricture-incomplete-evacuation',
      'stricture-dietary-management', 'stricture-dilation-needed',
      'dyssynergia', 'anismus', 'pelvic-floor-dysfunction',
    ],
    bodySystem: 'digestive',
  },
  RECTAL_PROLAPSE: {
    id: 'rectal-prolapse',
    name: 'Rectum, Prolapse',
    diagnosticCode: '7334',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'prolapse-persistent-irreducible', 'prolapse-manual-reduction-needed', 'prolapse-spontaneous-reduction',
      'prolapse-with-bowel-movement', 'prolapse-with-exertion', 'prolapse-at-rest',
      'prolapse-pain', 'prolapse-bleeding', 'prolapse-mucus-discharge',
      'prolapse-surgery-history', 'prolapse-not-repairable',
    ],
    bodySystem: 'digestive',
  },
  ANAL_FISTULA: {
    id: 'anal-fistula',
    name: 'Fistula in Ano (Anorectal Fistula/Abscess)',
    diagnosticCode: '7335',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'fistula-multiple-constant', 'fistula-one-two', 'fistula-single',
      'fistula-abscess', 'fistula-drainage', 'fistula-pain',
      'fistula-refractory', 'fistula-surgery-history', 'fistula-recurrent',
    ],
    bodySystem: 'digestive',
  },
  HEMORRHOIDS: {
    id: 'hemorrhoids',
    name: 'Hemorrhoids, External or Internal',
    diagnosticCode: '7336',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'hemorrhoid-persistent-bleeding', 'hemorrhoid-anemia', 'hemorrhoid-prolapsed',
      'hemorrhoid-thrombosed', 'hemorrhoid-pain', 'hemorrhoid-itching',
      'hemorrhoid-bleeding', 'hemorrhoid-prolapse', 'hemorrhoid-thrombosis',
      'hemorrhoid-internal', 'hemorrhoid-external',
    ],
    bodySystem: 'digestive',
  },
  PRURITUS_ANI: {
    id: 'pruritus-ani',
    name: 'Pruritus Ani (Anal Itching)',
    diagnosticCode: '7337',
    cfrReference: '38 CFR 4.114',
    symptomIds: [
      'pruritus-ani-bleeding', 'pruritus-ani-excoriation', 'pruritus-ani-itching',
    ],
    bodySystem: 'digestive',
  },
};

// ============================================
// DIGESTIVE RATING CRITERIA & ANALYZE FUNCTIONS
// ============================================

export const IBS_CRITERIA = {
  diagnosticCode: '7319',
  condition: 'Irritable Bowel Syndrome',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7319',

  ratings: [
    {
      percent: 30,
      summary: 'Severe symptoms with diarrhea or alternating diarrhea and constipation, with frequent episodes of bowel disturbance and abdominal distress',
      criteria: {
        frequentEpisodes: true,
        severity: 'severe',
        bowelDisturbance: true,
        abdominalDistress: true,
      },
      criteriaDescription: [
        'Diarrhea, or alternating diarrhea and constipation',
        'Frequent episodes (multiple times per week)',
        'Bowel disturbance is persistent',
        'Associated abdominal distress',
      ],
      evidenceNeeded: [
        'Log diarrhea episodes multiple times per week',
        'Document alternating patterns if applicable',
        'Track abdominal pain/distress frequency',
        'Note impact on daily activities',
      ],
    },
    {
      percent: 10,
      summary: 'Moderate symptoms with disturbances of bowel function with occasional episodes',
      criteria: {
        occasionalEpisodes: true,
        severity: 'moderate',
        bowelDisturbance: true,
      },
      criteriaDescription: [
        'Disturbances of bowel function',
        'Occasional episodes (less frequent than severe)',
        'Moderate impact on daily life',
      ],
      evidenceNeeded: [
        'Log bowel disturbance episodes regularly',
        'Document frequency (at least weekly)',
        'Track associated symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Mild symptoms that are diet-controlled',
      criteria: {
        mildSymptoms: true,
        dietControlled: true,
      },
      criteriaDescription: [
        'Symptoms controlled with diet modifications',
        'Minimal impact on daily activities',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    frequentEpisodes: {
      term: 'Frequent Episodes',
      definition: 'Episodes occurring multiple times per week on a regular basis. Not isolated or rare occurrences.',
      examples: [
        '3-4 diarrhea episodes per week',
        'Daily alternating constipation/diarrhea',
        'Multiple bowel disturbances weekly',
      ],
    },
    diarrhea: {
      term: 'Diarrhea',
      definition: 'Loose or watery stools occurring frequently. For IBS rating, this must be a persistent pattern, not isolated incidents.',
      examples: [
        'Loose stools 3+ times daily',
        'Urgent bowel movements',
        'Inability to control bowel movements',
      ],
    },
    abdominalDistress: {
      term: 'Abdominal Distress',
      definition: 'Pain, cramping, bloating, or discomfort in the abdomen associated with bowel disturbances.',
      examples: [
        'Cramping before bowel movements',
        'Persistent bloating',
        'Abdominal pain relieved by bowel movement',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged IBS symptoms. VA rating requires documented diagnosis and pattern of symptoms over time. Continue gastroenterology care and maintain symptom diary for claim support.',
};

// ============================================
// GERD RATING CRITERIA (DC 7346)
// ============================================

export const GERD_CRITERIA = {
  diagnosticCode: '7346',
  condition: 'Gastroesophageal Reflux Disease (GERD)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7346',

  ratings: [
    {
      percent: 60,
      summary: 'Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia; or other symptom combinations productive of severe impairment of health',
      criteria: {
        pain: true,
        vomiting: true,
        weightLoss: true,
        bleeding: true, // hematemesis or melena
        anemia: true,
        severeImpairment: true,
      },
      criteriaDescription: [
        'Persistent pain',
        'Frequent vomiting',
        'Material weight loss documented',
        'Evidence of bleeding (hematemesis or melena)',
        'Moderate anemia present',
        'Severe impairment of overall health',
      ],
      evidenceNeeded: [
        'Medical documentation of weight loss',
        'Evidence of bleeding complications',
        'Lab results showing anemia',
        'Frequent symptom logging',
        'Documentation of treatment failure',
      ],
    },
    {
      percent: 30,
      summary: 'Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation, accompanied by substernal or arm or shoulder pain, productive of considerable impairment of health',
      criteria: {
        persistentSymptoms: true,
        dysphagia: true,
        pyrosis: true,
        regurgitation: true,
        chestPain: true,
        considerableImpairment: true,
      },
      criteriaDescription: [
        'Persistently recurrent epigastric distress',
        'Dysphagia (difficulty swallowing)',
        'Pyrosis (heartburn)',
        'Regurgitation',
        'Substernal, arm, or shoulder pain',
        'Considerable impairment of health',
      ],
      evidenceNeeded: [
        'Frequent heartburn episodes logged',
        'Document difficulty swallowing',
        'Track regurgitation frequency',
        'Note chest/shoulder pain',
        'Show persistent pattern over months',
      ],
    },
    {
      percent: 10,
      summary: 'Two or more of the symptoms for the 30% evaluation of less severity',
      criteria: {
        multipleSymptoms: true,
        lessSevere: true,
        minSymptoms: 2,
      },
      criteriaDescription: [
        'Two or more symptoms present',
        'Less severe than 30% criteria',
        'May include heartburn, regurgitation, dysphagia',
      ],
      evidenceNeeded: [
        'Log at least 2 different GERD symptoms regularly',
        'Document frequency and severity',
        'Show consistent pattern',
      ],
    },
    {
      percent: 0,
      summary: 'Symptoms controlled by medication',
      criteria: {
        controlled: true,
        onMedication: true,
      },
      criteriaDescription: [
        'Symptoms managed with medication',
        'Minimal breakthrough symptoms',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    pyrosis: {
      term: 'Pyrosis (Heartburn)',
      definition: 'Burning sensation in the chest or throat caused by stomach acid refluxing into the esophagus. A hallmark symptom of GERD.',
      examples: [
        'Burning sensation behind breastbone',
        'Sour or bitter taste in mouth',
        'Worsens when lying down or bending over',
      ],
    },
    dysphagia: {
      term: 'Dysphagia',
      definition: 'Difficulty swallowing. Can be a symptom of esophageal damage from chronic GERD.',
      examples: [
        'Food feels stuck in throat or chest',
        'Painful swallowing',
        'Difficulty swallowing solids or liquids',
      ],
    },
    regurgitation: {
      term: 'Regurgitation',
      definition: 'Backflow of stomach contents into the throat or mouth. Different from vomiting as it occurs without nausea or retching.',
      examples: [
        'Sour liquid coming up into throat',
        'Undigested food returning to mouth',
        'Occurs especially when lying down',
      ],
    },
    hematemesis: {
      term: 'Hematemesis',
      definition: 'Vomiting blood, indicating bleeding in the upper gastrointestinal tract. This is a serious complication requiring medical attention.',
      examples: [
        'Vomiting bright red blood',
        'Vomiting "coffee ground" material',
        'Requires emergency evaluation',
      ],
    },
    melena: {
      term: 'Melena',
      definition: 'Black, tarry stools indicating upper GI bleeding. Blood has been digested, turning it black.',
      examples: [
        'Black, sticky stools',
        'Tar-like appearance',
        'Indicates significant bleeding',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged GERD symptoms. Higher ratings (30-60%) require medical documentation of complications and examination findings. Continue gastroenterology care and medication compliance.',
};

// ============================================
// MENIERE'S DISEASE RATING CRITERIA (DC 6205)
// ============================================

export const GERD_COMPLICATIONS_CRITERIA = {
  description: 'GERD with complications rated based on severity and treatment required',
  levels: [
    {
      rating: '60%',
      criteria: [
        'Severe symptoms with Barrett\'s esophagus',
        'Or stricture requiring dilation every 2-3 months',
        'Significant weight loss, malnutrition'
      ]
    },
    {
      rating: '30%',
      criteria: [
        'Persistently recurrent symptoms with documented pathology',
        'Hiatal hernia or stricture with occasional dilation',
        'Daily medication required despite treatment'
      ]
    },
    {
      rating: '10%',
      criteria: [
        'Symptoms controlled with continuous medication',
        'Mild to moderate pathology (esophagitis, small hiatal hernia)'
      ]
    },
    {
      rating: '0%',
      criteria: ['GERD complications documented but symptoms controlled']
    }
  ],
  notes: [
    'Requires documentation of complications via endoscopy',
    'Barrett\'s esophagus is pre-cancerous condition',
    'Frequency of dilation procedures indicates severity',
    'Weight loss/malnutrition elevates rating'
  ]
};

// ============================================
// PHASE 6 CRITERIA OBJECTS - GI CONDITIONS
// ============================================

export const ULCERATIVE_COLITIS_CRITERIA = {
  diagnosticCode: '7323/7326',
  condition: 'Ulcerative Colitis / Inflammatory Bowel Disease',
  cfrReference: '38 CFR 4.114, Diagnostic Codes 7323/7326',

  ratings: [
    {
      percent: 100,
      summary: 'Severe IBD unresponsive to treatment, hospitalization 1+/year, inability to work OR 6+ diarrhea/day, 6+ rectal bleeding/day, rectal incontinence',
      criteria: {
        hospitalizationsPerYear: 1,
        unresponsiveToTreatment: true,
        diarrheaPerDay: 6,
        rectalBleedingPerDay: 6,
        rectalIncontinence: true,
      },
      criteriaDescription: [
        'Severe inflammatory bowel disease unresponsive to treatment, AND',
        'Requires hospitalization at least once per year, AND',
        'Results in inability to work OR characterized by recurrent abdominal pain with at least two of:',
        '- Six or more episodes per day of diarrhea',
        '- Six or more episodes per day of rectal bleeding',
        '- Recurrent episodes of rectal incontinence',
        '- Recurrent abdominal distension',
      ],
      evidenceNeeded: [
        'Documentation of treatment failure with multiple medications',
        'Hospital admission records',
        'Daily symptom frequency logs',
        'Work impact documentation',
      ],
    },
    {
      percent: 60,
      summary: 'Moderate IBD managed with immunosuppressants/biologics, 4-5 diarrhea episodes/day, intermittent fever/tachycardia/anemia',
      criteria: {
        immunosuppressantUse: true,
        diarrheaPerDay: [4, 5],
        intermittentToxicity: true,
      },
      criteriaDescription: [
        'Moderate inflammatory bowel disease managed on outpatient basis with immunosuppressants or other biologic agents, AND',
        'Characterized by recurrent abdominal pain, four to five daily episodes of diarrhea, AND',
        'Intermittent signs of toxicity such as fever, tachycardia, or anemia',
      ],
      evidenceNeeded: [
        'Prescription records for immunosuppressants or biologics',
        'Daily diarrhea frequency logs',
        'Documentation of fever, heart rate, or anemia episodes',
      ],
    },
    {
      percent: 30,
      summary: 'Mild-moderate IBD managed with oral/topical agents (not immunosuppressants), 3 or less diarrhea/day, minimal toxicity',
      criteria: {
        oralTopicalAgents: true,
        diarrheaPerDay: [0, 3],
        minimalToxicity: true,
      },
      criteriaDescription: [
        'Mild to moderate inflammatory bowel disease managed with oral and topical agents (other than immunosuppressants or biologics), AND',
        'Characterized by recurrent abdominal pain with three or less daily episodes of diarrhea, AND',
        'Minimal signs of toxicity such as fever, tachycardia, or anemia',
      ],
      evidenceNeeded: [
        'Prescription records for oral/topical medications',
        'Symptom frequency logs',
        'Medical records showing treatment approach',
      ],
    },
    {
      percent: 10,
      summary: 'Minimal-mild IBD managed with oral/topical agents, 3 or less diarrhea/day, no systemic toxicity',
      criteria: {
        oralTopicalAgents: true,
        diarrheaPerDay: [0, 3],
        noToxicity: true,
      },
      criteriaDescription: [
        'Minimal to mild symptomatic inflammatory bowel disease managed with oral or topical agents, AND',
        'Characterized by recurrent abdominal pain with three or less daily episodes of diarrhea, AND',
        'No signs of systemic toxicity',
      ],
      evidenceNeeded: [
        'Symptom frequency logs',
        'Medication records',
      ],
    },
  ],

  definitions: {
    ibd: {
      term: 'Inflammatory Bowel Disease (IBD)',
      definition: 'Chronic inflammation of the digestive tract, including ulcerative colitis (affects colon) and Crohn\'s disease (can affect any part of GI tract).',
      examples: [
        'Ulcerative colitis - inflammation limited to colon',
        'Crohn\'s disease - can affect entire GI tract',
        'Diagnosis confirmed by endoscopy or radiologic studies',
      ],
    },
    systemicToxicity: {
      term: 'Signs of Systemic Toxicity',
      definition: 'Fever, tachycardia (rapid heart rate), or anemia indicating the disease is affecting the whole body, not just the GI tract.',
      examples: [
        'Fever above 100.4°F during flares',
        'Heart rate above 100 bpm',
        'Low hemoglobin/anemia',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged IBD symptoms. VA rating requires diagnosis confirmed by endoscopy or radiologic studies. Continue gastroenterology care and maintain detailed symptom diary.',
};

export const PEPTIC_ULCER_CRITERIA = {
  diagnosticCode: '7304',
  condition: 'Peptic Ulcer Disease',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7304',

  ratings: [
    {
      percent: 100,
      summary: 'Post-operative for perforation or hemorrhage (for 3 months)',
      criteria: {
        postOperative: true,
        perforationOrHemorrhage: true,
      },
      criteriaDescription: [
        'Post-operative status for perforation or hemorrhage',
        'This 100% rating continues for 3 months after surgery',
        'After 3 months, rate on residuals by VA examination',
      ],
      evidenceNeeded: [
        'Surgical records showing perforation or hemorrhage repair',
        'Hospital admission records',
      ],
    },
    {
      percent: 60,
      summary: 'Continuous pain, intermittent vomiting, hematemesis/melena with anemia, hospitalization 1+/year',
      criteria: {
        continuousPain: true,
        intermittentVomiting: true,
        bleeding: true,
        anemia: true,
        hospitalizationsPerYear: 1,
      },
      criteriaDescription: [
        'Continuous abdominal pain with intermittent vomiting',
        'Recurrent hematemesis (vomiting blood) or melena (tarry stools)',
        'Manifestations of anemia',
        'Requires hospitalization at least once in the past 12 months',
      ],
      evidenceNeeded: [
        'Daily pain logs',
        'Documentation of vomiting episodes',
        'Lab work showing anemia',
        'Hospital admission records',
      ],
    },
    {
      percent: 40,
      summary: 'Episodes (pain/nausea/vomiting) lasting 3+ consecutive days, 4+ times/year, daily medication',
      criteria: {
        episodeDuration: 3,
        episodesPerYear: 4,
        dailyMedication: true,
      },
      criteriaDescription: [
        'Episodes of abdominal pain, nausea, or vomiting that:',
        '- Last for at least three consecutive days in duration',
        '- Occur four or more times in the past 12 months',
        '- Are managed by daily prescribed medication',
      ],
      evidenceNeeded: [
        'Symptom logs showing episode duration and frequency',
        'Prescription records for daily medication',
      ],
    },
    {
      percent: 20,
      summary: 'Episodes lasting 3+ consecutive days, 3 times or less/year, daily medication',
      criteria: {
        episodeDuration: 3,
        episodesPerYear: [1, 3],
        dailyMedication: true,
      },
      criteriaDescription: [
        'Episodes of abdominal pain, nausea, or vomiting that:',
        '- Last for at least three consecutive days in duration',
        '- Occur three times or less in the past 12 months',
        '- Are managed by daily prescribed medication',
      ],
      evidenceNeeded: [
        'Symptom logs showing episode duration and frequency',
        'Prescription records for daily medication',
      ],
    },
    {
      percent: 0,
      summary: 'History documented by endoscopy or imaging only',
      criteria: {
        historyOnly: true,
      },
      criteriaDescription: [
        'History of peptic ulcer disease documented by endoscopy or diagnostic imaging studies',
        'Currently asymptomatic or well-controlled',
      ],
      evidenceNeeded: [
        'Endoscopy or imaging records',
      ],
    },
  ],

  definitions: {
    hematemesis: {
      term: 'Hematemesis',
      definition: 'Vomiting blood. Can be bright red or look like coffee grounds. Indicates upper GI bleeding.',
      examples: [
        'Vomiting bright red blood',
        'Vomiting material that looks like coffee grounds',
      ],
    },
    melena: {
      term: 'Melena',
      definition: 'Black, tarry stools caused by digested blood from upper GI bleeding.',
      examples: [
        'Black, sticky, tar-like stools',
        'Strong, foul odor',
        'Indicates bleeding in stomach or upper intestine',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged peptic ulcer symptoms. VA rating requires documentation by endoscopy or diagnostic imaging. Continue GI care and maintain detailed symptom diary.',
};

export const HEMORRHOID_CRITERIA = {
  diagnosticCode: '7336',
  condition: 'Hemorrhoids',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7336',

  ratings: [
    {
      percent: 20,
      summary: 'Persistent bleeding with anemia, OR continuously prolapsed with 3+ thrombosis episodes/year',
      criteria: {
        persistentBleeding: true,
        anemia: true,
        continuouslyProlapsed: true,
        thrombosisPerYear: 3,
      },
      criteriaDescription: [
        'Internal or external hemorrhoids with persistent bleeding and anemia, OR',
        'Continuously prolapsed internal hemorrhoids with three or more episodes per year of thrombosis',
      ],
      evidenceNeeded: [
        'Bleeding frequency logs',
        'Lab work showing anemia',
        'Documentation of prolapse',
        'Thrombosis episode documentation',
      ],
    },
    {
      percent: 10,
      summary: 'Prolapsed with 2 or less thrombosis/year, OR external with 3+ thrombosis/year',
      criteria: {
        prolapsedWithThrombosis: [1, 2],
        externalWithThrombosis: 3,
      },
      criteriaDescription: [
        'Prolapsed internal hemorrhoids with two or less episodes per year of thrombosis, OR',
        'External hemorrhoids with three or more episodes per year of thrombosis',
      ],
      evidenceNeeded: [
        'Thrombosis episode logs',
        'Documentation of hemorrhoid type (internal/external)',
      ],
    },
  ],

  definitions: {
    thrombosis: {
      term: 'Hemorrhoid Thrombosis',
      definition: 'Blood clot forming in a hemorrhoid, causing severe pain, swelling, and a hard lump near the anus.',
      examples: [
        'Sudden severe pain',
        'Hard, painful lump',
        'May require medical intervention',
      ],
    },
    prolapse: {
      term: 'Prolapsed Hemorrhoids',
      definition: 'Internal hemorrhoids that have stretched and protrude outside the anus.',
      examples: [
        'Tissue protruding during bowel movements',
        'May retract on own or require manual reduction',
        'Continuously prolapsed = always protruding',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged hemorrhoid symptoms. Document bleeding frequency, thrombosis episodes, and prolapse status for VA claims.',
};

export const DIVERTICULITIS_CRITERIA = {
  diagnosticCode: '7327',
  condition: 'Diverticulitis',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7327',

  ratings: [
    {
      percent: 30,
      summary: 'Hospitalization 1+/year for abdominal distress, fever, leukocytosis WITH complications',
      criteria: {
        hospitalizationsPerYear: 1,
        withComplications: true,
      },
      criteriaDescription: [
        'Diverticular disease requiring hospitalization for abdominal distress, fever, and leukocytosis (elevated white blood cells) one or more times in the past 12 months, AND',
        'With at least one of the following complications:',
        '- Hemorrhage',
        '- Obstruction',
        '- Abscess',
        '- Peritonitis',
        '- Perforation',
      ],
      evidenceNeeded: [
        'Hospital admission records',
        'Lab work showing leukocytosis',
        'Imaging or surgical records documenting complications',
      ],
    },
    {
      percent: 20,
      summary: 'Hospitalization 1+/year for abdominal distress, fever, leukocytosis WITHOUT complications',
      criteria: {
        hospitalizationsPerYear: 1,
        withoutComplications: true,
      },
      criteriaDescription: [
        'Diverticular disease requiring hospitalization for abdominal distress, fever, and leukocytosis one or more times in the past 12 months',
        'Without associated hemorrhage, obstruction, abscess, peritonitis, or perforation',
      ],
      evidenceNeeded: [
        'Hospital admission records',
        'Lab work showing leukocytosis',
        'Medical records confirming no complications',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic or managed by diet/medication',
      criteria: {
        asymptomatic: true,
        managedConservatively: true,
      },
      criteriaDescription: [
        'Asymptomatic diverticulosis, OR',
        'Symptomatic diverticulitis that is managed by diet and medication',
      ],
      evidenceNeeded: [],
    },
  ],

  definitions: {
    diverticulitis: {
      term: 'Diverticulitis',
      definition: 'Inflammation or infection of small pouches (diverticula) that form in the walls of the intestine, usually the colon.',
      examples: [
        'Abdominal pain, usually left lower quadrant',
        'Fever and chills',
        'Nausea and vomiting',
        'Changes in bowel habits',
      ],
    },
    complications: {
      term: 'Diverticulitis Complications',
      definition: 'Serious conditions resulting from diverticulitis that typically require hospitalization.',
      examples: [
        'Abscess - pocket of pus',
        'Perforation - hole in intestinal wall',
        'Peritonitis - infection of abdominal lining',
        'Obstruction - blocked intestine',
        'Fistula - abnormal connection between organs',
      ],
    },
  },

  disclaimer: 'This analysis is based on logged diverticulitis symptoms. The key rating distinction is hospitalization with or without complications. Maintain records of all flare-ups and hospital visits.',
};

// ============================================
// PHASE 7 CRITERIA OBJECTS - COMMON CONDITIONS
// ============================================

export const CIRRHOSIS_CRITERIA = {
  diagnosticCode: '7312',
  condition: 'Cirrhosis of the Liver',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7312',

  note: 'Cirrhosis is rated based on MELD score when available, or on symptomatology. Biochemical studies, imaging, or biopsy must confirm liver dysfunction.',

  ratings: [
    {
      percent: 100,
      summary: 'MELD >=15 OR daily debilitating symptoms with major complication',
      criteriaDescription: [
        'Liver disease with MELD score >=15, OR',
        'Continuous daily debilitating symptoms with generalized weakness AND at least one of:',
        '- Ascites (fluid in abdomen)',
        '- History of spontaneous bacterial peritonitis',
        '- Hepatic encephalopathy',
        '- Variceal hemorrhage',
        '- Coagulopathy',
        '- Portal gastropathy',
        '- Hepatopulmonary or hepatorenal syndrome',
      ],
      evidenceNeeded: [
        'MELD score calculation from lab values',
        'Documentation of major complications',
        'Hospitalization records',
        'Daily symptom logs',
      ],
    },
    {
      percent: 60,
      summary: 'MELD 12-14 OR daily fatigue with variceal bleed/encephalopathy in past year',
      criteriaDescription: [
        'Liver disease with MELD score 12-14, OR',
        'Daily fatigue AND at least one episode in past year of:',
        '- Variceal hemorrhage, OR',
        '- Portal gastropathy or hepatic encephalopathy',
      ],
      evidenceNeeded: [
        'MELD score documentation',
        'Episode documentation with dates',
        'Hospital/ER records',
      ],
    },
    {
      percent: 30,
      summary: 'MELD 10-11 OR portal hypertension signs with symptoms',
      criteriaDescription: [
        'Liver disease with MELD score 10-11, OR',
        'Signs of portal hypertension (splenomegaly or ascites) AND either:',
        '- Weakness, anorexia, abdominal pain, or malaise',
      ],
      evidenceNeeded: [
        'MELD score or imaging showing portal hypertension',
        'Symptom logs documenting weakness/anorexia/pain/malaise',
      ],
    },
    {
      percent: 10,
      summary: 'MELD 7-9 OR symptoms (anorexia, weakness, pain, malaise)',
      criteriaDescription: [
        'Liver disease with MELD score 7-9, OR',
        'Evidence of anorexia, weakness, abdominal pain, or malaise',
      ],
      evidenceNeeded: [
        'Lab values for MELD calculation',
        'Symptom logs',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic with history of liver disease',
      criteriaDescription: [
        'History of liver disease, currently asymptomatic',
        'No active symptoms or complications',
      ],
      evidenceNeeded: [
        'Medical records confirming diagnosis',
      ],
    },
  ],

  definitions: {
    meld: {
      term: 'MELD Score',
      definition: 'Model for End-Stage Liver Disease score. Calculated from bilirubin, INR, creatinine, and sodium. Higher scores indicate more severe liver disease.',
    },
    ascites: {
      term: 'Ascites',
      definition: 'Accumulation of fluid in the abdominal cavity, often causing abdominal swelling and discomfort.',
    },
    hepaticEncephalopathy: {
      term: 'Hepatic Encephalopathy',
      definition: 'Brain dysfunction caused by liver failure. Symptoms include confusion, altered consciousness, personality changes.',
    },
    varicealHemorrhage: {
      term: 'Variceal Hemorrhage',
      definition: 'Bleeding from enlarged veins (varices) in the esophagus or stomach due to portal hypertension.',
    },
  },

  importantNotes: [
    'MELD score is the primary rating factor when available',
    'Without MELD score, rate based on symptomatology per Note (3)',
    'Hepatocellular carcinoma with cirrhosis is rated under DC 7343 instead',
    'Lab confirmation of liver dysfunction required (hyponatremia, thrombocytopenia, coagulopathy)',
  ],

  disclaimer: 'This analysis is based on logged cirrhosis symptoms and any MELD scores recorded. VA rating requires confirmed diagnosis and documented complications. Continue hepatology care and track all symptoms and lab values.',
};

// ============================================
// PHASE 10: GASTRITIS (DC 7307) - Rates as DC 7304
// ============================================

export const GASTRITIS_CRITERIA = {
  diagnosticCode: '7307',
  condition: 'Gastritis, Chronic',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7307',

  note: 'Chronic gastritis is rated as peptic ulcer disease (DC 7304). This includes H. pylori infection, drug-induced gastritis, Zollinger-Ellison syndrome, and portal-hypertensive gastropathy.',

  ratings: [
    {
      percent: 60,
      summary: 'Continuous pain, intermittent vomiting, bleeding with anemia, hospitalization 1+/year',
      criteriaDescription: [
        'Continuous abdominal pain with intermittent vomiting',
        'Recurrent hematemesis (vomiting blood) or melena (tarry stools)',
        'Manifestations of anemia',
        'Requires hospitalization at least once in the past 12 months',
      ],
      evidenceNeeded: [
        'Daily pain logs',
        'Documentation of vomiting episodes',
        'Lab work showing anemia',
        'Hospital admission records',
      ],
    },
    {
      percent: 40,
      summary: 'Episodes lasting 3+ days, 4+ times/year, daily medication',
      criteriaDescription: [
        'Episodes of abdominal pain, nausea, or vomiting that:',
        '- Last for at least three consecutive days',
        '- Occur four or more times in the past 12 months',
        '- Are managed by daily prescribed medication',
      ],
      evidenceNeeded: [
        'Symptom logs showing episode duration and frequency',
        'Prescription records for daily medication (PPIs, H2 blockers)',
      ],
    },
    {
      percent: 20,
      summary: 'Episodes lasting 3+ days, 1-3 times/year, daily medication',
      criteriaDescription: [
        'Episodes of abdominal pain, nausea, or vomiting that:',
        '- Last for at least three consecutive days',
        '- Occur one to three times in the past 12 months',
        '- Are managed by daily prescribed medication',
      ],
      evidenceNeeded: [
        'Symptom logs showing episode duration and frequency',
        'Prescription records for daily medication',
      ],
    },
    {
      percent: 0,
      summary: 'History documented, currently asymptomatic',
      criteriaDescription: [
        'History of gastritis documented by endoscopy or diagnostic imaging',
        'Currently asymptomatic or well-controlled',
      ],
      evidenceNeeded: [
        'Endoscopy or imaging records showing gastritis',
      ],
    },
  ],

  definitions: {
    chronicGastritis: {
      term: 'Chronic Gastritis',
      definition: 'Long-term inflammation of the stomach lining. Can be caused by H. pylori, NSAIDs, alcohol, or autoimmune conditions.',
    },
  },

  importantNotes: [
    'Gastritis is rated using peptic ulcer disease criteria (DC 7304)',
    'Includes H. pylori infection, drug-induced gastritis, Zollinger-Ellison syndrome',
    'Episode duration (3+ consecutive days) is key for compensable rating',
    'Daily medication requirement must be documented',
  ],

  disclaimer: 'This analysis is based on logged gastritis symptoms. VA requires documented diagnosis and pattern of episodes. Track symptom episodes with duration and medication use.',
};

// ============================================
// PHASE 10: CHRONIC PANCREATITIS (DC 7347)
// ============================================

export const PANCREATITIS_CRITERIA = {
  diagnosticCode: '7347',
  condition: 'Pancreatitis, Chronic',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7347',

  note: 'Chronic pancreatitis is rated based on pain episodes, hospitalizations, and maldigestion/malabsorption requiring dietary restriction and enzyme supplementation.',

  ratings: [
    {
      percent: 100,
      summary: 'Daily pain requiring 3+ hospitalizations/year, physician pain management, maldigestion requiring enzymes',
      criteriaDescription: [
        'Daily episodes of abdominal or mid-back pain requiring:',
        '- Three or more hospitalizations per year, AND',
        '- Pain management by a physician, AND',
        '- Maldigestion and malabsorption requiring dietary restriction and pancreatic enzyme supplementation',
      ],
      evidenceNeeded: [
        'Hospital admission records (3+ per year)',
        'Pain management documentation',
        'Prescription for pancreatic enzymes',
        'Dietary restriction documentation',
      ],
    },
    {
      percent: 60,
      summary: '3+ pain episodes/year with 1+ hospitalization for complications or tube feeding',
      criteriaDescription: [
        'Three or more episodes of abdominal or mid-back pain per year, AND',
        'At least one episode per year requiring hospitalization for:',
        '- Complications related to abdominal pain, OR',
        '- Complications of tube enteral feeding',
      ],
      evidenceNeeded: [
        'Pain episode logs (3+ per year)',
        'Hospital admission records',
        'Documentation of complications',
      ],
    },
    {
      percent: 30,
      summary: '1+ episode/year requiring ongoing outpatient treatment for pain or complications',
      criteriaDescription: [
        'At least one episode per year of abdominal or mid-back pain requiring:',
        '- Ongoing outpatient medical treatment for pain, OR',
        '- Treatment for digestive problems, OR',
        '- Management of complications (cyst, pseudocyst, obstruction, ascites)',
      ],
      evidenceNeeded: [
        'Pain episode documentation',
        'Outpatient treatment records',
        'Imaging showing complications if present',
      ],
    },
  ],

  definitions: {
    maldigestion: {
      term: 'Maldigestion',
      definition: 'Impaired breakdown of food in the digestive tract due to pancreatic enzyme deficiency.',
    },
    steatorrhea: {
      term: 'Steatorrhea',
      definition: 'Fatty, foul-smelling stools indicating fat malabsorption from pancreatic insufficiency.',
    },
    pseudocyst: {
      term: 'Pancreatic Pseudocyst',
      definition: 'Fluid collection enclosed by fibrous tissue, often developing after pancreatitis episodes.',
    },
  },

  importantNotes: [
    'Diagnostic studies must confirm that abdominal pain results from pancreatitis',
    'Diabetes from pancreatic insufficiency is rated separately under DC 7913',
    'Hospitalizations are key rating factor for higher percentages',
    'Enzyme supplementation requirement indicates maldigestion',
  ],

  disclaimer: 'This analysis is based on logged pancreatitis symptoms. VA requires confirmed diagnosis with imaging and pattern of pain episodes. Track all hospitalizations, treatments, and enzyme/dietary requirements.',
};

// ============================================
// PHASE 10: CHRONIC BILIARY TRACT DISEASE (DC 7314)
// ============================================

export const BILIARY_TRACT_CRITERIA = {
  diagnosticCode: '7314',
  condition: 'Chronic Biliary Tract Disease',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7314',

  note: 'Chronic biliary tract disease is rated based on frequency of clinically documented attacks. This includes cholangitis, biliary strictures, Sphincter of Oddi dysfunction, bile duct injury, and choledochal cyst.',

  ratings: [
    {
      percent: 30,
      summary: '3+ documented attacks with nausea/vomiting in past 12 months, OR stricture dilation required',
      criteriaDescription: [
        'Three or more clinically documented attacks of right upper quadrant pain with nausea and vomiting during the past 12 months, OR',
        'Requiring dilation of biliary tract strictures at least once during the past 12 months',
      ],
      evidenceNeeded: [
        'Medical documentation of 3+ attacks with symptoms',
        'OR procedure records for stricture dilation',
        'ER/urgent care visit records',
      ],
    },
    {
      percent: 10,
      summary: '1-2 documented attacks with nausea/vomiting in past 12 months',
      criteriaDescription: [
        'One or two clinically documented attacks of right upper quadrant pain with nausea and vomiting in the past 12 months',
      ],
      evidenceNeeded: [
        'Medical documentation of attacks',
        'ER/clinic visit records showing symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic, no documented attacks in past 12 months',
      criteriaDescription: [
        'Asymptomatic, without history of a clinically documented attack of right upper quadrant pain with nausea and vomiting in the past 12 months',
      ],
      evidenceNeeded: [
        'Medical records confirming diagnosis',
      ],
    },
  ],

  definitions: {
    ruqPain: {
      term: 'Right Upper Quadrant (RUQ) Pain',
      definition: 'Pain in the upper right area of the abdomen, typically associated with gallbladder or biliary tract issues.',
    },
    cholangitis: {
      term: 'Cholangitis',
      definition: 'Infection of the bile ducts, often presenting with fever, jaundice, and abdominal pain (Charcot triad).',
    },
    sphincterOfOddi: {
      term: 'Sphincter of Oddi Dysfunction',
      definition: 'Disorder affecting the valve controlling bile and pancreatic juice flow into the small intestine.',
    },
  },

  importantNotes: [
    'Attacks must be "clinically documented" - self-reported logs support but may need medical visit confirmation',
    'RUQ pain with nausea AND vomiting required for attack to count',
    'Stricture dilation procedure qualifies for 30% even without multiple attacks',
    'Includes cholangitis, strictures, Sphincter of Oddi dysfunction, bile duct injury, choledochal cyst',
  ],

  disclaimer: 'This analysis is based on logged biliary tract symptoms. VA requires clinically documented attacks. Seek medical evaluation during attacks to establish documentation.',
};

// ============================================
// PHASE 5A: HERNIA (DC 7338)
// ============================================

export const HERNIA_CRITERIA = {
  diagnosticCode: '7338',
  condition: 'Hernia',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7338',

  note: 'DC 7338 covers all hernia types including inguinal, femoral, umbilical, ventral, incisional, and other hernias (excluding hiatal). Ratings are based on hernia size, duration, repairability, and pain with specific activities.',

  ratings: [
    {
      percent: 100,
      summary: 'Irreparable hernia >=15cm for 12+ months with pain during 3+ activities',
      criteriaDescription: [
        'Irreparable hernia (new or recurrent) present for 12 months or more',
        'Size equal to 15 cm or greater in one dimension for 12+ months',
        'Pain when performing at least three of: (1) bending over, (2) ADLs, (3) walking, (4) climbing stairs',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia size >=15cm',
        'Documentation hernia is irreparable',
        'Symptom logs showing pain with 3+ activities',
        'Duration of 12+ months documented',
      ],
    },
    {
      percent: 60,
      summary: 'Irreparable hernia >=15cm for 12+ months with pain during 2 activities',
      criteriaDescription: [
        'Irreparable hernia (new or recurrent) present for 12 months or more',
        'Size equal to 15 cm or greater in one dimension for 12+ months',
        'Pain when performing two of: (1) bending over, (2) ADLs, (3) walking, (4) climbing stairs',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia size >=15cm',
        'Documentation hernia is irreparable',
        'Symptom logs showing pain with 2 activities',
        'Duration of 12+ months documented',
      ],
    },
    {
      percent: 30,
      summary: 'Irreparable hernia 3-15cm for 12+ months with pain during 2+ activities',
      criteriaDescription: [
        'Irreparable hernia (new or recurrent) present for 12 months or more',
        'Size equal to 3 cm or greater but less than 15 cm in one dimension for 12+ months',
        'Pain when performing at least two of: (1) bending over, (2) ADLs, (3) walking, (4) climbing stairs',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia size 3-15cm',
        'Documentation hernia is irreparable',
        'Symptom logs showing pain with 2+ activities',
        'Duration of 12+ months documented',
      ],
    },
    {
      percent: 20,
      summary: 'Irreparable hernia 3-15cm for 12+ months with pain during 1 activity',
      criteriaDescription: [
        'Irreparable hernia (new or recurrent) present for 12 months or more',
        'Size equal to 3 cm or greater but less than 15 cm in one dimension for 12+ months',
        'Pain when performing one of: (1) bending over, (2) ADLs, (3) walking, (4) climbing stairs',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia size 3-15cm',
        'Documentation hernia is irreparable',
        'Symptom logs showing pain with 1 activity',
        'Duration of 12+ months documented',
      ],
    },
    {
      percent: 10,
      summary: 'Irreparable hernia <3cm for 12+ months',
      criteriaDescription: [
        'Irreparable hernia (new or recurrent) present for 12 months or more',
        'Hernia size smaller than 3 cm',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia size <3cm',
        'Documentation hernia is irreparable',
        'Duration of 12+ months documented',
      ],
    },
    {
      percent: 0,
      summary: 'Asymptomatic hernia - present and repairable, or repaired',
      criteriaDescription: [
        'Asymptomatic hernia; present and repairable, or already repaired',
      ],
      evidenceNeeded: [
        'Medical documentation of hernia status',
        'Surgical records if repaired',
      ],
    },
  ],

  definitions: {
    irreparableHernia: {
      term: 'Irreparable Hernia',
      definition: 'A hernia that cannot be surgically repaired or has failed previous repair attempts.',
    },
    adls: {
      term: 'Activities of Daily Living (ADLs)',
      definition: 'Basic self-care activities including bathing, dressing, hygiene, and transfers.',
    },
    incarcerated: {
      term: 'Incarcerated Hernia',
      definition: 'A hernia that cannot be pushed back into place (irreducible), with tissue trapped outside the abdominal wall.',
    },
    strangulated: {
      term: 'Strangulated Hernia',
      definition: 'A hernia where blood supply to trapped tissue is cut off - a surgical emergency.',
    },
  },

  importantNotes: [
    'With two compensable inguinal hernias, evaluate the more severe first, then add 10% for the second (unless first is 100%)',
    'Any ADL (bathing, dressing, hygiene, transfers) counts as one activity',
    'Hernia must be present for 12+ months to qualify for compensable rating',
    'Hiatal hernias are rated separately under DC 7346',
  ],

  disclaimer: 'This analysis is based on logged hernia symptoms. VA ratings require medical documentation of hernia size and repairability status.',
};

// ============================================
// PHASE 5A: PERITONEAL ADHESIONS (DC 7301)
// ============================================

export const PERITONEAL_ADHESIONS_CRITERIA = {
  diagnosticCode: '7301',
  condition: 'Peritoneal Adhesions',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7301',

  note: 'Peritoneal adhesions are rated based on severity of obstruction, dietary modification requirements, hospitalization history, and associated symptoms. Adhesions may result from surgery, trauma, inflammatory disease (Crohn\'s, cholecystitis), or infection.',

  ratings: [
    {
      percent: 80,
      summary: 'Persistent partial obstruction - inoperable/refractory or requires TPN',
      criteriaDescription: [
        'Persistent partial bowel obstruction that is either inoperable and refractory to treatment, OR',
        'Requires total parenteral nutrition (TPN) for obstructive symptoms',
      ],
      evidenceNeeded: [
        'Medical documentation of persistent partial obstruction',
        'Documentation obstruction is inoperable or refractory',
        'TPN orders and administration records if applicable',
      ],
    },
    {
      percent: 50,
      summary: 'Symptomatic with hospitalization 1+/year, dietary modification, and GI symptoms',
      criteriaDescription: [
        'Symptomatic peritoneal adhesions persisting/recurring after surgery, trauma, or inflammatory disease',
        'Clinical evidence of recurrent obstruction requiring hospitalization at least once a year',
        'Medically-directed dietary modification (not TPN)',
        'At least one of: abdominal pain, nausea, vomiting, colic, constipation, or diarrhea',
      ],
      evidenceNeeded: [
        'Medical documentation of symptomatic adhesions',
        'Hospitalization records for obstruction (1+/year)',
        'Dietary modification orders from healthcare provider',
        'Symptom logs documenting GI symptoms',
      ],
    },
    {
      percent: 30,
      summary: 'Symptomatic with dietary modification and GI symptoms (no hospitalization required)',
      criteriaDescription: [
        'Symptomatic peritoneal adhesions persisting/recurring after surgery, trauma, or inflammatory disease',
        'Medically-directed dietary modification (not TPN)',
        'At least one of: abdominal pain, nausea, vomiting, colic, constipation, or diarrhea',
      ],
      evidenceNeeded: [
        'Medical documentation of symptomatic adhesions',
        'Dietary modification orders from healthcare provider',
        'Symptom logs documenting GI symptoms',
      ],
    },
    {
      percent: 10,
      summary: 'Symptomatic with GI symptoms only (no dietary modification)',
      criteriaDescription: [
        'Symptomatic peritoneal adhesions persisting/recurring after surgery, trauma, or inflammatory disease',
        'At least one of: abdominal pain, nausea, vomiting, colic, constipation, or diarrhea',
      ],
      evidenceNeeded: [
        'Medical documentation of symptomatic adhesions',
        'Symptom logs documenting GI symptoms',
      ],
    },
    {
      percent: 0,
      summary: 'History of adhesions, currently asymptomatic',
      criteriaDescription: [
        'History of peritoneal adhesions',
        'Currently asymptomatic',
      ],
      evidenceNeeded: [
        'Medical documentation confirming adhesion history',
      ],
    },
  ],

  definitions: {
    peritonealAdhesions: {
      term: 'Peritoneal Adhesions',
      definition: 'Bands of scar tissue that form between abdominal organs and tissues, often after surgery, causing organs to stick together.',
    },
    tpn: {
      term: 'Total Parenteral Nutrition (TPN)',
      definition: 'Intravenous feeding that bypasses the digestive system entirely, delivering nutrients directly into the bloodstream.',
    },
    partialObstruction: {
      term: 'Partial Bowel Obstruction',
      definition: 'Incomplete blockage of the intestine that restricts but does not completely stop the passage of contents.',
    },
    colic: {
      term: 'Colic',
      definition: 'Severe spasmodic abdominal pain caused by intestinal obstruction or spasm.',
    },
  },

  importantNotes: [
    'Adhesions must be "symptomatic" and confirmed by healthcare provider',
    'Can result from surgery, trauma, inflammatory disease (Crohn\'s, cholecystitis), or infection',
    'Dietary modification must be medically-directed (not self-imposed)',
    'Hospitalization requirement is "at least once a year" for 50% rating',
    'TPN requirement or inoperable status needed for 80% rating',
  ],

  disclaimer: 'This analysis is based on logged adhesion symptoms. VA ratings require medical documentation of adhesions and their cause.',
};


// ============================================
// PHASE 5B: ESOPHAGEAL STRICTURE (DC 7203)
// ============================================

export const ESOPHAGEAL_STRICTURE_CRITERIA = {
  diagnosticCode: '7203',
  condition: 'Esophageal Stricture',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7203',

  note: 'Esophageal stricture is rated based on severity of dysphagia, dilatation requirements, aspiration risk, and nutritional impact. Also used for rating DC 7204 (Esophageal Spasm/Motility Disorders).',

  ratings: [
    {
      percent: 80,
      summary: 'Refractory stricture with aspiration, undernutrition, and PEG tube',
      criteriaDescription: [
        'Recurrent or refractory stricture with aspiration',
        'Undernutrition requiring PEG tube',
      ],
      evidenceNeeded: [
        'Medical documentation of refractory stricture (cannot achieve target after 5+ dilatations)',
        'Documentation of aspiration events',
        'Nutritional assessment showing undernutrition',
        'PEG tube placement records',
      ],
    },
    {
      percent: 50,
      summary: 'Refractory stricture with dysphagia, aspiration, and undernutrition OR >=3 dilatations/year',
      criteriaDescription: [
        'Recurrent or refractory stricture with dysphagia, aspiration, and undernutrition, OR',
        'Requiring dilatation three or more times per 12-month period',
      ],
      evidenceNeeded: [
        'Medical documentation of stricture characteristics',
        'Documentation of aspiration and undernutrition, OR',
        'Procedure records showing 3+ dilatations per year',
      ],
    },
    {
      percent: 30,
      summary: 'Recurrent stricture with dysphagia requiring <=2 dilatations/year',
      criteriaDescription: [
        'Recurrent stricture with dysphagia',
        'Requiring dilatation two or fewer times per 12-month period',
      ],
      evidenceNeeded: [
        'Medical documentation of recurrent stricture',
        'Swallowing study or endoscopy findings',
        'Procedure records showing dilatation frequency',
      ],
    },
    {
      percent: 10,
      summary: 'Dysphagia controlled with daily medication',
      criteriaDescription: [
        'Dysphagia controlled by daily medication',
      ],
      evidenceNeeded: [
        'Medical documentation of dysphagia diagnosis',
        'Medication records showing daily treatment',
      ],
    },
    {
      percent: 0,
      summary: 'History of esophageal stricture, asymptomatic',
      criteriaDescription: [
        'History of esophageal stricture',
        'Currently asymptomatic without treatment',
      ],
      evidenceNeeded: [
        'Medical records confirming diagnosis history',
      ],
    },
  ],

  definitions: {
    recurrentStricture: {
      term: 'Recurrent Stricture',
      definition: 'A stricture that cannot maintain a target diameter of greater than 14mm for more than 4 weeks.',
    },
    refractoryStricture: {
      term: 'Refractory Stricture',
      definition: 'A stricture that cannot achieve a target diameter of 14mm after five dilation sessions at two-week intervals.',
    },
    dysphagia: {
      term: 'Dysphagia',
      definition: 'Difficulty swallowing food, liquids, or medications.',
    },
    pegTube: {
      term: 'PEG Tube',
      definition: 'Percutaneous endoscopic gastrostomy - a feeding tube placed through the abdominal wall into the stomach.',
    },
    aspiration: {
      term: 'Aspiration',
      definition: 'Entry of food, liquid, or secretions into the airway and lungs.',
    },
  },

  importantNotes: [
    'DC 7204 (Esophageal Spasm/Motility) is rated using DC 7203 criteria',
    'Includes achalasia, diffuse esophageal spasm, corkscrew esophagus, nutcracker esophagus',
    'Dilatation frequency is key differentiator between 30% and 50% ratings',
    'PEG tube requirement indicates severe nutritional compromise (80%)',
  ],

  disclaimer: 'This analysis is based on logged esophageal symptoms. VA ratings require medical documentation of stricture characteristics and treatment history.',
};

// ============================================
// PHASE 5B: POSTGASTRECTOMY SYNDROME (DC 7308)
// Rated as Chronic Complications of Upper GI Surgery (DC 7303)
// ============================================

export const POSTGASTRECTOMY_CRITERIA = {
  diagnosticCode: '7308',
  condition: 'Postgastrectomy Syndrome',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7308 (rated as DC 7303)',

  note: 'Postgastrectomy syndrome is rated under DC 7303 (Chronic Complications of Upper GI Surgery). Ratings are based on severity of dumping syndrome, nutritional requirements, and symptom frequency.',

  ratings: [
    {
      percent: 80,
      summary: 'Requires TPN or tube feeding for 30+ days during 12-month period',
      criteriaDescription: [
        'Chronic complications requiring total parenteral nutrition (TPN) or tube feeding',
        'Nutritional support required for a period of 30 or more consecutive days during a 12-month period',
      ],
      evidenceNeeded: [
        'TPN or tube feeding orders and administration records',
        'Documentation of 30+ consecutive days of nutritional support',
        'Medical records showing chronic post-surgical complications',
      ],
    },
    {
      percent: 50,
      summary: 'Daily vomiting OR 6+ watery BMs/day OR explosive unpredictable BMs',
      criteriaDescription: [
        'Chronic complications with daily vomiting despite dietary modification, OR',
        'Six or more watery bowel movements per day despite dietary modification, OR',
        'Explosive, unpredictable bowel movements that interfere with daily activities',
      ],
      evidenceNeeded: [
        'Symptom logs documenting daily vomiting frequency',
        'Documentation of watery bowel movement frequency (6+/day)',
        'Records of explosive/unpredictable bowel movements',
        'Evidence of dietary modification attempts',
      ],
    },
    {
      percent: 30,
      summary: 'Post-prandial syncope with sweating OR medication required for dumping',
      criteriaDescription: [
        'Chronic complications with post-prandial syncope associated with sweating, OR',
        'Requires medication for control of dumping syndrome',
      ],
      evidenceNeeded: [
        'Documentation of syncope/lightheadedness after meals',
        'Records of associated sweating episodes',
        'Medication records for dumping syndrome treatment',
      ],
    },
    {
      percent: 10,
      summary: 'Chronic symptoms controlled with dietary modification only',
      criteriaDescription: [
        'Chronic complications controlled by dietary modification alone',
        'No medication required for symptom control',
      ],
      evidenceNeeded: [
        'Documentation of chronic post-surgical symptoms',
        'Dietary modification plan from healthcare provider',
        'Symptom logs showing control with diet',
      ],
    },
    {
      percent: 0,
      summary: 'History of gastrectomy, asymptomatic',
      criteriaDescription: [
        'History of gastrectomy or gastric surgery',
        'Currently asymptomatic',
      ],
      evidenceNeeded: [
        'Surgical records confirming procedure',
      ],
    },
  ],

  definitions: {
    dumpingSyndrome: {
      term: 'Dumping Syndrome',
      definition: 'Rapid gastric emptying causing symptoms either early (within 30 minutes - cramping, diarrhea, sweating) or late (1-3 hours - hypoglycemia symptoms).',
    },
    postPrandialSyncope: {
      term: 'Post-Prandial Syncope',
      definition: 'Fainting or near-fainting that occurs after eating, often due to rapid blood sugar changes.',
    },
    tpn: {
      term: 'Total Parenteral Nutrition (TPN)',
      definition: 'Intravenous feeding that bypasses the digestive system entirely.',
    },
    tubFeeding: {
      term: 'Tube Feeding',
      definition: 'Enteral nutrition delivered via nasogastric, gastrostomy, or jejunostomy tube.',
    },
  },

  importantNotes: [
    'DC 7308 is rated under DC 7303 (Chronic Complications of Upper GI Surgery)',
    'Early dumping: symptoms within 30 min (cramping, diarrhea, sweating, dizziness)',
    'Late dumping: symptoms 1-3 hours after eating (weakness, sweating, shakiness)',
    'Dietary modification must be medically-directed and documented',
    '30 consecutive days of TPN/tube feeding required for 80% rating',
  ],

  disclaimer: 'This analysis is based on logged postgastrectomy symptoms. VA ratings require medical documentation of surgery and chronic complications.',
};

// ============================================
// PHASE 5B: INTESTINAL FISTULA (DC 7330)
// ============================================

export const INTESTINAL_FISTULA_CRITERIA = {
  diagnosticCode: '7330',
  condition: 'Intestinal Fistula',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7330',

  note: 'Intestinal fistula (external) is rated based on nutritional requirements, discharge amount, and BMI impact. Ratings consider TPN needs, drainage volume, and duration.',

  ratings: [
    {
      percent: 100,
      summary: 'Requires TPN for fistula-related symptoms',
      criteriaDescription: [
        'Intestinal fistula requiring total parenteral nutrition (TPN) for fistula-related symptoms',
      ],
      evidenceNeeded: [
        'Medical documentation of intestinal fistula',
        'TPN orders and administration records',
        'Documentation linking TPN to fistula symptoms',
      ],
    },
    {
      percent: 60,
      summary: 'Requires enteral nutrition OR heavy drainage (3+ bags/10+ pads daily) with low BMI',
      criteriaDescription: [
        'Requires enteral nutrition for fistula-related symptoms, OR',
        'Discharge filling 3+ ostomy bags (130cc sized) OR 10+ pads per day with BMI <16, OR',
        'Discharge filling 3+ ostomy bags OR 10+ pads per day with drainage 3+ months',
      ],
      evidenceNeeded: [
        'Enteral nutrition orders if applicable',
        'Daily drainage volume documentation',
        'BMI measurements if applicable',
        'Duration of drainage documentation',
      ],
    },
    {
      percent: 30,
      summary: 'Persistent drainage 1-3 months OR moderate drainage with low BMI',
      criteriaDescription: [
        'Discharge filling 3+ ostomy bags OR 10+ pads per day with BMI 16-18, OR',
        'Discharge filling 3+ ostomy bags OR 10+ pads per day with drainage 1-3 months, OR',
        'Discharge filling less than 3 bags OR 10 pads per day with BMI <16',
      ],
      evidenceNeeded: [
        'Daily drainage documentation',
        'BMI measurements',
        'Duration of fistula drainage',
      ],
    },
  ],

  definitions: {
    intestinalFistula: {
      term: 'Intestinal Fistula',
      definition: 'An abnormal connection between the intestine and the skin surface (external fistula) or another organ.',
    },
    enteralNutrition: {
      term: 'Enteral Nutrition',
      definition: 'Nutrition delivered directly to the stomach or intestine via feeding tube.',
    },
    tpn: {
      term: 'Total Parenteral Nutrition (TPN)',
      definition: 'Complete nutrition delivered intravenously, bypassing the digestive system.',
    },
    ostomyBag: {
      term: 'Ostomy Bag',
      definition: 'A pouching system used to collect waste; standard size referenced is 130cc.',
    },
  },

  importantNotes: [
    'TPN requirement for fistula symptoms qualifies for 100% rating',
    'Drainage volume measured by ostomy bags (130cc size) or pad changes',
    'BMI is a key factor in determining rating level',
    'Duration of drainage (1-3 months vs 3+ months) affects rating',
    'Both drainage amount AND either BMI or duration required for 60%/30%',
  ],

  disclaimer: 'This analysis is based on logged fistula symptoms. VA ratings require medical documentation of fistula, drainage measurements, and nutritional status.',
};

// ============================================
// PHASE 6A: ACNE CRITERIA (DC 7828)
// ============================================

export const SPHINCTER_CONTROL_CRITERIA = {
  diagnosticCode: '7332',
  condition: 'Rectum and Anus, Impairment of Sphincter Control',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7332',

  note: 'Complete or partial loss of sphincter control refers to the inability to retain or expel stool at an appropriate time and place. Rating considers both incontinence AND retention symptoms.',

  ratings: [
    {
      percent: 100,
      summary: 'Complete loss - not responsive to bowel program OR daily incontinence requiring pad changes 2+/day',
      criteria: {
        completeLoss: true,
        notResponsiveToBowelProgram: true,
        orDailyIncontinence: true,
      },
      criteriaDescription: [
        'Complete loss of sphincter control with incontinence or retention that is NOT responsive to physician-prescribed bowel program, AND requires either:',
        '- Surgery, OR',
        '- Digital stimulation, medication (beyond laxatives), AND special diet',
        'OR: Incontinence to solids and/or liquids 2+ times per DAY, requiring changing a pad 2+ times per DAY',
      ],
      evidenceNeeded: [
        'Documentation of complete sphincter control loss',
        'Records showing bowel program failure',
        'Daily incontinence diary',
        'Pad usage log (2+ changes daily)',
        'Medication and dietary modification records',
        'Colorectal surgery evaluation',
      ],
    },
    {
      percent: 60,
      summary: 'Complete/partial loss - partially responsive to bowel program OR weekly incontinence with pad use',
      criteria: {
        partiallyResponsive: true,
        orWeeklyIncontinence: true,
      },
      criteriaDescription: [
        'Complete or partial loss of sphincter control with incontinence or retention that is PARTIALLY responsive to physician-prescribed bowel program, AND requires either:',
        '- Surgery, OR',
        '- Digital stimulation, medication (beyond laxatives), AND special diet',
        'OR: Incontinence to solids and/or liquids 2+ times per WEEK, requiring wearing a pad 2+ times per WEEK',
      ],
      evidenceNeeded: [
        'Documentation of partial sphincter control',
        'Bowel program records showing partial response',
        'Weekly incontinence diary',
        'Pad usage documentation',
        'Treatment records',
      ],
    },
    {
      percent: 30,
      summary: 'Complete/partial loss - fully responsive to bowel program OR monthly incontinence with pad use',
      criteria: {
        fullyResponsive: true,
        requiresDigitalStimMedDiet: true,
        orMonthlyIncontinence: true,
      },
      criteriaDescription: [
        'Complete or partial loss of sphincter control with incontinence or retention that is FULLY responsive to physician-prescribed bowel program, AND requires:',
        '- Digital stimulation, medication (beyond laxatives), AND special diet',
        'OR: Incontinence to solids and/or liquids 2+ times per MONTH, requiring wearing a pad 2+ times per MONTH',
      ],
      evidenceNeeded: [
        'Bowel program documentation',
        'Medication records',
        'Diet modification records',
        'Monthly incontinence log',
      ],
    },
    {
      percent: 10,
      summary: 'Fully responsive to bowel program (med OR diet) OR incontinence at least once every 6 months',
      criteria: {
        fullyResponsive: true,
        requiresMedOrDiet: true,
        orRareIncontinence: true,
      },
      criteriaDescription: [
        'Complete or partial loss of sphincter control that is FULLY responsive to physician-prescribed bowel program, AND requires:',
        '- Medication (beyond laxatives) OR special diet',
        'OR: Incontinence to solids and/or liquids at least once every 6 months, requiring wearing a pad at least once every 6 months',
      ],
      evidenceNeeded: [
        'Bowel program records',
        'Medication or diet documentation',
        'Incontinence episodes documented',
      ],
    },
    {
      percent: 0,
      summary: 'History of sphincter control loss, currently asymptomatic',
      criteria: {
        historyOnly: true,
        currentlyAsymptomatic: true,
      },
      criteriaDescription: [
        'History of loss of sphincter control',
        'Currently asymptomatic (no current symptoms)',
      ],
      evidenceNeeded: [
        'Medical history documentation',
        'Current evaluation showing no symptoms',
      ],
    },
  ],

  definitions: {
    sphincterControl: {
      term: 'Sphincter Control',
      definition: 'The ability to retain or expel stool at an appropriate time and place. Loss can result in either incontinence (inability to hold) or retention (inability to expel).',
    },
    bowelProgram: {
      term: 'Physician-Prescribed Bowel Program',
      definition: 'A structured regimen prescribed by a doctor that may include scheduled toileting, digital stimulation, medications, and dietary modifications.',
    },
    digitalStimulation: {
      term: 'Digital Stimulation',
      definition: 'Manual stimulation of the rectum to trigger bowel movements, often used in neurogenic bowel dysfunction.',
    },
    incontinenceToSolids: {
      term: 'Incontinence to Solids',
      definition: 'Involuntary loss of solid stool (formed feces).',
    },
    incontinenceToLiquids: {
      term: 'Incontinence to Liquids',
      definition: 'Involuntary loss of liquid stool or diarrhea.',
    },
    fecalRetention: {
      term: 'Fecal Retention',
      definition: 'Inability to expel stool despite the urge, leading to constipation and impaction.',
    },
  },

  causesOfSphincterImpairment: [
    'Spinal cord injury',
    'Multiple sclerosis',
    'Diabetic neuropathy',
    'Surgical damage (hemorrhoidectomy, prostatectomy, etc.)',
    'Childbirth injury',
    'Rectal cancer treatment',
    'Inflammatory bowel disease',
    'Radiation therapy',
    'Stroke',
    'Parkinson\'s disease',
  ],

  importantNotes: [
    '"Beyond laxative use" means medications specifically for bowel control, not just OTC laxatives',
    'Both incontinence AND retention are covered under this code',
    'Rating is based on FREQUENCY of episodes AND management requirements',
    'Document pad usage with dates and frequency',
    'Bowel program must be physician-prescribed for rating purposes',
    'Can be secondary to spinal cord injury, MS, diabetes, or surgical complications',
  ],

  disclaimer: 'This analysis is based on logged sphincter control symptoms. VA ratings require documentation of incontinence frequency, bowel program compliance, and treatment requirements.',
};


// -----------------------------------------
// DC 7333: RECTAL STRICTURE
// -----------------------------------------

export const RECTAL_STRICTURE_CRITERIA = {
  diagnosticCode: '7333',
  condition: 'Rectum and Anus, Stricture',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7333',

  note: 'Conditions rated under this code include dyssynergic defecation (levator ani) and anismus (functional constipation). Evaluate an ostomy as Intestine, large, resection (DC 7329).',

  ratings: [
    {
      percent: 100,
      summary: 'Inability to open anus with inability to expel solid feces',
      criteria: {
        completeObstruction: true,
        cannotExpelSolidFeces: true,
      },
      criteriaDescription: [
        'Complete inability to open the anus',
        'Unable to expel solid feces',
        'May require colostomy or manual disimpaction',
      ],
      evidenceNeeded: [
        'Colorectal surgery evaluation',
        'Documentation of complete obstruction',
        'Imaging studies if performed',
        'Colostomy records if applicable',
      ],
    },
    {
      percent: 60,
      summary: 'Lumen reduction 50%+ with pain and straining during defecation',
      criteria: {
        lumenReduction: '>=50%',
        painDuringDefecation: true,
        strainingDuringDefecation: true,
      },
      criteriaDescription: [
        'Reduction of the rectal/anal lumen by 50% or more',
        'Pain during defecation',
        'Straining during defecation',
      ],
      evidenceNeeded: [
        'Endoscopy/imaging documenting stricture severity',
        'Pain documentation',
        'Defecation difficulty records',
      ],
    },
    {
      percent: 30,
      summary: 'Lumen reduction <50% with straining during defecation',
      criteria: {
        lumenReduction: '<50%',
        strainingDuringDefecation: true,
      },
      criteriaDescription: [
        'Reduction of the rectal/anal lumen by less than 50%',
        'Straining during defecation required',
      ],
      evidenceNeeded: [
        'Documentation of stricture',
        'Straining symptoms documented',
      ],
    },
    {
      percent: 10,
      summary: 'Luminal narrowing with or without straining, managed by dietary intervention',
      criteria: {
        luminalNarrowing: true,
        dietaryManagement: true,
      },
      criteriaDescription: [
        'Luminal narrowing present',
        'With or without straining',
        'Managed by dietary intervention (high fiber, stool softeners)',
      ],
      evidenceNeeded: [
        'Documentation of narrowing',
        'Dietary modification records',
      ],
    },
  ],

  definitions: {
    stricture: {
      term: 'Rectal/Anal Stricture',
      definition: 'Abnormal narrowing of the rectum or anal canal that impedes the passage of stool.',
    },
    dyssynergicDefecation: {
      term: 'Dyssynergic Defecation (Levator Ani Syndrome)',
      definition: 'A functional disorder where the pelvic floor muscles do not relax properly during defecation, causing difficulty expelling stool despite the urge.',
    },
    anismus: {
      term: 'Anismus (Functional Constipation)',
      definition: 'Paradoxical contraction or failure to relax the puborectalis and external anal sphincter during attempted defecation.',
    },
    lumenReduction: {
      term: 'Lumen Reduction',
      definition: 'Percentage decrease in the open diameter of the rectal/anal canal compared to normal.',
    },
  },

  importantNotes: [
    'Dyssynergic defecation and anismus are specifically included under this code',
    'If patient has ostomy, rate under DC 7329 (Large intestine resection)',
    'Strictures may result from surgery, radiation, inflammatory disease, or trauma',
    'Document lumen reduction percentage if measured',
    'Biofeedback therapy for pelvic floor dysfunction should be documented',
  ],

  disclaimer: 'This analysis is based on logged rectal stricture symptoms. VA ratings require documentation of stricture severity and functional impact.',
};


// -----------------------------------------
// DC 7334: RECTAL PROLAPSE
// -----------------------------------------

export const RECTAL_PROLAPSE_CRITERIA = {
  diagnosticCode: '7334',
  condition: 'Rectum, Prolapse',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7334',

  note: 'For repairable prolapse, continue 100% rating for 2 months post-repair, then evaluate residuals. Where sphincter control impairment is predominant, rate under DC 7332.',

  ratings: [
    {
      percent: 100,
      summary: 'Persistent irreducible prolapse (repairable or not)',
      criteria: {
        persistentProlapse: true,
        irreducible: true,
      },
      criteriaDescription: [
        'Persistent prolapse that cannot be pushed back in (irreducible)',
        'Prolapse remains outside the body',
        'May be repairable or unrepairable surgically',
      ],
      evidenceNeeded: [
        'Colorectal surgery evaluation',
        'Documentation of persistent irreducible prolapse',
        'Surgical assessment of repairability',
      ],
    },
    {
      percent: 50,
      summary: 'Manually reducible, not repairable, occurs at times OTHER than bowel movements/exertion',
      criteria: {
        manuallyReducible: true,
        notRepairable: true,
        occursSpontaneously: true,
      },
      criteriaDescription: [
        'Prolapse that can be manually pushed back in',
        'NOT surgically repairable',
        'Occurs at times OTHER than bowel movements, exertion, or Valsalva maneuver',
        'May occur spontaneously while standing, walking, etc.',
      ],
      evidenceNeeded: [
        'Documentation of prolapse occurring at rest or with minimal activity',
        'Surgical evaluation confirming not repairable',
        'Frequency and circumstances of prolapse',
      ],
    },
    {
      percent: 30,
      summary: 'Manually reducible, not repairable, occurs ONLY with bowel movements/exertion/Valsalva',
      criteria: {
        manuallyReducible: true,
        notRepairable: true,
        occursWithExertion: true,
      },
      criteriaDescription: [
        'Prolapse that can be manually pushed back in',
        'NOT surgically repairable',
        'Occurs ONLY after bowel movements, exertion, or while performing Valsalva maneuver',
      ],
      evidenceNeeded: [
        'Documentation of triggering events',
        'Surgical evaluation confirming not repairable',
      ],
    },
    {
      percent: 10,
      summary: 'Spontaneously reducible prolapse, not repairable',
      criteria: {
        spontaneouslyReducible: true,
        notRepairable: true,
      },
      criteriaDescription: [
        'Prolapse that reduces on its own (spontaneously)',
        'NOT surgically repairable',
        'Does not require manual reduction',
      ],
      evidenceNeeded: [
        'Documentation of prolapse episodes',
        'Confirmation that it self-reduces',
        'Surgical evaluation',
      ],
    },
  ],

  definitions: {
    prolapse: {
      term: 'Rectal Prolapse',
      definition: 'Protrusion of the rectum through the anus, where the rectal wall slides out of place.',
    },
    irreducible: {
      term: 'Irreducible Prolapse',
      definition: 'Prolapse that cannot be pushed back into the body, remaining outside.',
    },
    manuallyReducible: {
      term: 'Manually Reducible',
      definition: 'Prolapse that can be pushed back inside with gentle manual pressure.',
    },
    spontaneouslyReducible: {
      term: 'Spontaneously Reducible',
      definition: 'Prolapse that returns inside on its own without manual intervention.',
    },
    valsalvaManeuver: {
      term: 'Valsalva Maneuver',
      definition: 'Bearing down as if having a bowel movement, which increases intra-abdominal pressure.',
    },
  },

  importantNotes: [
    'After surgical repair, 100% continues for 2 months, then reassess residuals',
    'If sphincter control impairment is the main issue, rate under DC 7332 instead',
    '"Repairable" refers to surgical repairability, not whether repair was attempted',
    'Document WHEN prolapse occurs (spontaneous vs. with exertion)',
    'Full-thickness prolapse is more severe than mucosal prolapse',
  ],

  disclaimer: 'This analysis is based on logged rectal prolapse symptoms. VA ratings require colorectal surgery evaluation to determine repairability.',
};


// -----------------------------------------
// DC 7335: ANAL FISTULA
// -----------------------------------------

export const ANAL_FISTULA_CRITERIA = {
  diagnosticCode: '7335',
  condition: 'Fistula in Ano (Anorectal Fistula and Abscess)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7335',

  note: 'Rating based on number of fistulas, presence of abscesses, drainage, pain, and response to treatment.',

  ratings: [
    {
      percent: 60,
      summary: 'More than 2 constant/near-constant fistulas with abscesses, drainage, pain - refractory to treatment',
      criteria: {
        fistulasCount: '>2',
        constantOrNearConstant: true,
        withAbscesses: true,
        withDrainage: true,
        withPain: true,
        refractoryToTreatment: true,
      },
      criteriaDescription: [
        'More than two fistulas that are constant or near-constant',
        'Associated abscesses',
        'Ongoing drainage',
        'Associated pain',
        'Refractory (not responding) to medical and surgical treatment',
      ],
      evidenceNeeded: [
        'Documentation of multiple fistulas',
        'Treatment failure records',
        'Surgical history',
        'Ongoing symptoms despite treatment',
      ],
    },
    {
      percent: 40,
      summary: 'One or two simultaneous fistulas with abscess, drainage, and pain',
      criteria: {
        fistulasCount: '1-2',
        simultaneous: true,
        withAbscess: true,
        withDrainage: true,
        withPain: true,
      },
      criteriaDescription: [
        'One or two fistulas present at the same time',
        'Associated abscess(es)',
        'Drainage present',
        'Pain present',
      ],
      evidenceNeeded: [
        'Fistula documentation',
        'Abscess records',
        'Drainage documentation',
        'Pain records',
      ],
    },
    {
      percent: 20,
      summary: 'Two or more simultaneous fistulas with drainage and pain, but without abscesses',
      criteria: {
        fistulasCount: '>=2',
        simultaneous: true,
        withDrainage: true,
        withPain: true,
        withoutAbscesses: true,
      },
      criteriaDescription: [
        'Two or more fistulas present simultaneously',
        'Drainage present',
        'Pain present',
        'No abscesses',
      ],
      evidenceNeeded: [
        'Documentation of multiple fistulas',
        'Drainage and pain records',
        'No abscess confirmation',
      ],
    },
    {
      percent: 10,
      summary: 'One fistula with drainage and pain, but without abscess',
      criteria: {
        fistulasCount: '1',
        withDrainage: true,
        withPain: true,
        withoutAbscess: true,
      },
      criteriaDescription: [
        'Single fistula',
        'With drainage',
        'With pain',
        'No abscess',
      ],
      evidenceNeeded: [
        'Fistula documentation',
        'Drainage and pain records',
      ],
    },
  ],

  definitions: {
    fistulaInAno: {
      term: 'Fistula in Ano',
      definition: 'An abnormal tunnel connecting the anal canal or rectum to the skin near the anus.',
    },
    anorectalAbscess: {
      term: 'Anorectal Abscess',
      definition: 'A collection of pus in the tissue around the anus or rectum, often preceding fistula formation.',
    },
    refractoryToTreatment: {
      term: 'Refractory to Treatment',
      definition: 'Not responding to standard medical and surgical treatments; treatment-resistant.',
    },
  },

  importantNotes: [
    'Fistulas commonly develop from anorectal abscesses',
    'May be associated with Crohn\'s disease',
    'Document number of fistulas present simultaneously',
    'Document treatment history and response',
    'Recurrent fistulas should be documented with dates',
  ],

  disclaimer: 'This analysis is based on logged fistula symptoms. VA ratings require documentation of fistula count, associated symptoms, and treatment response.',
};


// -----------------------------------------
// DC 7336: HEMORRHOIDS
// -----------------------------------------

export const HEMORRHOIDS_CRITERIA = {
  diagnosticCode: '7336',
  condition: 'Hemorrhoids, External or Internal',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7336',

  note: 'Rating based on bleeding, anemia, prolapse, and thrombosis frequency.',

  ratings: [
    {
      percent: 20,
      summary: 'Persistent bleeding with anemia OR continuously prolapsed with 3+ thrombosis episodes/year',
      criteria: {
        persistentBleeding: true,
        withAnemia: true,
        orContinuouslyProlapsed: true,
        thrombosisEpisodes: '>=3/year',
      },
      criteriaDescription: [
        'Internal or external hemorrhoids with persistent bleeding AND anemia, OR',
        'Continuously prolapsed internal hemorrhoids with 3+ episodes per year of thrombosis',
      ],
      evidenceNeeded: [
        'Documentation of persistent bleeding',
        'Lab work showing anemia (hemoglobin/hematocrit)',
        'Thrombosis episode records with dates',
        'Colonoscopy/examination reports',
      ],
    },
    {
      percent: 10,
      summary: 'Prolapsed internal with ≤2 thrombosis/year OR external with 3+ thrombosis/year',
      criteria: {
        prolapsedInternal: true,
        thrombosisEpisodes: '<=2/year',
        orExternalWith3Plus: true,
      },
      criteriaDescription: [
        'Prolapsed internal hemorrhoids with 2 or fewer episodes per year of thrombosis, OR',
        'External hemorrhoids with 3+ episodes per year of thrombosis',
      ],
      evidenceNeeded: [
        'Documentation of prolapse',
        'Thrombosis episode records with dates',
        'Medical examination reports',
      ],
    },
    {
      percent: 0,
      summary: 'Mild or moderate hemorrhoids without significant complications',
      criteriaDescription: [
        'Hemorrhoids without persistent bleeding, anemia, or frequent thrombosis',
        'Non-prolapsing or minimal symptoms',
      ],
      evidenceNeeded: [
        'Medical documentation of hemorrhoids',
      ],
    },
  ],

  definitions: {
    internalHemorrhoids: {
      term: 'Internal Hemorrhoids',
      definition: 'Hemorrhoids inside the rectum that may prolapse (protrude) through the anus.',
    },
    externalHemorrhoids: {
      term: 'External Hemorrhoids',
      definition: 'Hemorrhoids under the skin around the anus.',
    },
    prolapsedHemorrhoids: {
      term: 'Prolapsed Hemorrhoids',
      definition: 'Internal hemorrhoids that have fallen through the anal opening.',
    },
    thrombosdHemorrhoids: {
      term: 'Thrombosed Hemorrhoids',
      definition: 'Hemorrhoids with blood clots, causing severe pain and swelling.',
    },
    hemorrhoidAnemia: {
      term: 'Hemorrhoid-Related Anemia',
      definition: 'Low red blood cell count due to chronic blood loss from hemorrhoids.',
    },
  },

  importantNotes: [
    'Document EACH thrombosis episode with dates',
    'Get lab work to confirm anemia if persistent bleeding',
    'Prolapse must be documented by medical examination',
    'Track bleeding frequency and amount',
    '"Continuously prolapsed" means always protruding',
  ],

  disclaimer: 'This analysis is based on logged hemorrhoid symptoms. VA ratings require documentation of bleeding, anemia, and thrombosis frequency.',
};


// -----------------------------------------
// DC 7337: PRURITUS ANI
// -----------------------------------------

export const PRURITUS_ANI_CRITERIA = {
  diagnosticCode: '7337',
  condition: 'Pruritus Ani (Anal Itching)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7337',

  note: 'Simple rating based on presence of bleeding or excoriation.',

  ratings: [
    {
      percent: 10,
      summary: 'With bleeding or excoriation',
      criteria: {
        withBleeding: true,
        orWithExcoriation: true,
      },
      criteriaDescription: [
        'Anal itching with bleeding from scratching, OR',
        'Anal itching with excoriation (skin breakdown/raw areas)',
      ],
      evidenceNeeded: [
        'Documentation of bleeding from scratching',
        'Examination showing excoriation',
        'Treatment records',
      ],
    },
    {
      percent: 0,
      summary: 'Without bleeding or excoriation',
      criteriaDescription: [
        'Anal itching without skin breakdown',
        'No bleeding from scratching',
      ],
      evidenceNeeded: [
        'Medical documentation of condition',
      ],
    },
  ],

  definitions: {
    pruritusAni: {
      term: 'Pruritus Ani',
      definition: 'Chronic itching of the skin around the anus.',
    },
    excoriation: {
      term: 'Excoriation',
      definition: 'Raw, abraded, or scratched skin from chronic itching.',
    },
  },

  importantNotes: [
    'Simple two-level rating: 10% with bleeding/excoriation, 0% without',
    'Document skin condition on examination',
    'May be secondary to other conditions (hemorrhoids, fistula, skin conditions)',
  ],

  disclaimer: 'This analysis is based on logged pruritus ani symptoms. VA ratings require examination documenting bleeding or excoriation.',
};

// -----------------------------------------
// DC 6313: AVITAMINOSIS (General Vitamin Deficiency)
// -----------------------------------------

export const ESOPHAGEAL_SPASM_CRITERIA = {
  diagnosticCode: '7204',
  condition: 'Esophageal Spasm (Diffuse Esophageal Spasm)',
  cfrReference: '38 CFR 4.114, Diagnostic Code 7204',

  note: 'Esophageal spasm is rated under the criteria for esophageal stricture/spasm based on dysphagia severity and nutritional impact.',

  ratings: [
    {
      percent: 80,
      summary: 'Only liquids permitted, marked impairment of general health',
      criteriaDescription: [
        'Severe dysphagia - only liquids can be swallowed',
        'Marked impairment of general health',
        'Significant weight loss',
      ],
      evidenceNeeded: [
        'Diagnosis of esophageal spasm (manometry)',
        'Documentation of liquid-only diet',
        'Weight records showing significant loss',
        'Nutritional status evaluation',
      ],
    },
    {
      percent: 50,
      summary: 'Severe dysphagia allowing only liquids, moderate impairment of health',
      criteriaDescription: [
        'Can only swallow liquids',
        'Moderate impairment of general health',
      ],
      evidenceNeeded: [
        'Esophageal manometry',
        'Dietary restrictions documented',
        'Weight and health records',
      ],
    },
    {
      percent: 30,
      summary: 'Moderate dysphagia with impaired nutrition',
      criteriaDescription: [
        'Difficulty swallowing solids',
        'Some impairment of nutrition',
        'Requires modified diet',
      ],
      evidenceNeeded: [
        'Diagnosis of esophageal spasm',
        'Dietary modification records',
        'Nutritional assessment',
      ],
    },
    {
      percent: 10,
      summary: 'Mild symptoms, no significant nutritional impairment',
      criteriaDescription: [
        'Intermittent dysphagia',
        'Chest pain with swallowing',
        'No significant weight loss',
      ],
      evidenceNeeded: [
        'Diagnosis of esophageal spasm',
        'Symptom documentation',
      ],
    },
  ],

  definitions: {
    esophagealSpasm: {
      term: 'Diffuse Esophageal Spasm',
      definition: 'Uncoordinated contractions of the esophagus causing dysphagia and chest pain.',
    },
    dysphagia: {
      term: 'Dysphagia',
      definition: 'Difficulty swallowing food or liquids.',
    },
    nutcrackerEsophagus: {
      term: 'Nutcracker Esophagus',
      definition: 'High-pressure esophageal contractions causing severe chest pain.',
    },
    manometry: {
      term: 'Esophageal Manometry',
      definition: 'Test measuring pressure and coordination of esophageal muscle contractions.',
    },
  },

  disclaimer: 'Esophageal spasm diagnosis requires manometry. Rate based on dysphagia severity and nutritional impact.',
};

// ============================================
// ESSENTIAL THROMBOCYTHEMIA CRITERIA (DC 7718)
// ============================================

export const analyzeIBSLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const ibsSymptoms = logs.filter(log =>
      DIGESTIVE_CONDITIONS.IBS.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (ibsSymptoms.length === 0) {
    return {
      condition: 'Irritable Bowel Syndrome',
      diagnosticCode: '7319',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No IBS symptoms logged in evaluation period',
        'Log diarrhea, constipation, or bowel disturbance episodes',
        'Document abdominal pain or discomfort',
        'Track frequency and severity of episodes',
      ],
      criteria: IBS_CRITERIA,
      disclaimer: IBS_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count episodes by type
  const diarrheaCount = ibsSymptoms.filter(s => getLogSymptomId(s) === 'ibs-diarrhea').length;
  const constipationCount = ibsSymptoms.filter(s => getLogSymptomId(s) === 'ibs-constipation').length;
  const painCount = ibsSymptoms.filter(s => getLogSymptomId(s) === 'ibs-pain').length;
  const bloatingCount = ibsSymptoms.filter(s => getLogSymptomId(s) === 'ibs-bloating').length;
  const urgencyCount = ibsSymptoms.filter(s => getLogSymptomId(s) === 'ibs-urgency').length;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = ibsSymptoms.length / weeksInPeriod;

  evidence.push(`${ibsSymptoms.length} IBS episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);

  if (diarrheaCount > 0) evidence.push(`${diarrheaCount} diarrhea episodes`);
  if (constipationCount > 0) evidence.push(`${constipationCount} constipation episodes`);
  if (painCount > 0) evidence.push(`${painCount} abdominal pain episodes`);

  // Check for alternating pattern
  const hasAlternating = diarrheaCount > 0 && constipationCount > 0;
  if (hasAlternating) {
    evidence.push('Alternating diarrhea and constipation pattern documented');
  }

  // Determine rating
  // 30%: Frequent episodes (3+ per week) with diarrhea/alternating + distress
  if (episodesPerWeek >= 3 && (diarrheaCount > 0 || hasAlternating) && painCount > 0) {
    supportedRating = '30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (meets "frequent" threshold)`,
        `${hasAlternating ? 'Alternating diarrhea/constipation' : 'Diarrhea episodes'} documented`,
        `Abdominal distress logged ${painCount} times`,
        'Meets criteria for severe IBS with frequent episodes'
    );
  }
  // 10%: Moderate symptoms, occasional episodes (1+ per week)
  else if (episodesPerWeek >= 1) {
    supportedRating = '10';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Meets criteria for moderate IBS with occasional episodes',
        'Bowel disturbance pattern established'
    );

    if (episodesPerWeek >= 2) {
      gaps.push(`Approaching 30% threshold - log more associated symptoms (pain, urgency)`);
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Less than once weekly - may be diet-controlled',
        'Does not meet frequency for service-connected rating'
    );
  }

  // Documentation gaps
  if (ibsSymptoms.length < 12) {
    gaps.push(`Only ${ibsSymptoms.length} episodes logged - aim for 12+ over 90 days for pattern`);
  }

  if (painCount === 0) {
    gaps.push('No abdominal pain episodes logged - document distress for higher rating');
  }

  if (diarrheaCount === 0 && constipationCount === 0) {
    gaps.push('Log specific diarrhea or constipation episodes, not just pain');
  }

  if (!hasAlternating && constipationCount === 0 && diarrheaCount > 0) {
    gaps.push('Consider logging constipation episodes if alternating pattern present');
  }

  return {
    condition: 'Irritable Bowel Syndrome',
    diagnosticCode: '7319',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: IBS_CRITERIA,
    disclaimer: IBS_CRITERIA.disclaimer,
  };
};


/**
 * Analyze GERD logs for VA rating
 * DC 7346 - Gastroesophageal Reflux Disease
 */

export const analyzeGERDLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 90 } = options;

  const gerdSymptoms = logs.filter(log =>
      DIGESTIVE_CONDITIONS.GERD.symptomIds.includes(getLogSymptomId(log)) &&
      isWithinEvaluationPeriod(log.timestamp, evaluationPeriodDays)
  );

  if (gerdSymptoms.length === 0) {
    return {
      condition: 'Gastroesophageal Reflux Disease (GERD)',
      diagnosticCode: '7346',
      hasData: false,
      supportedRating: null,
      ratingRationale: [],
      evidence: [],
      gaps: [
        'No GERD symptoms logged in evaluation period',
        'Log heartburn (pyrosis) episodes',
        'Document regurgitation frequency',
        'Track chest pain, difficulty swallowing if present',
      ],
      criteria: GERD_CRITERIA,
      disclaimer: GERD_CRITERIA.disclaimer,
    };
  }

  const evidence = [];
  const gaps = [];
  let supportedRating = 0;
  const ratingRationale = [];

  // Count symptoms by type
  const heartburnCount = gerdSymptoms.filter(s => getLogSymptomId(s) === 'gerd-heartburn').length;
  const regurgitationCount = gerdSymptoms.filter(s => getLogSymptomId(s) === 'gerd-regurgitation').length;
  const chestPainCount = gerdSymptoms.filter(s => getLogSymptomId(s) === 'gerd-chest-pain').length;
  const dysphagiaCount = gerdSymptoms.filter(s => getLogSymptomId(s) === 'gerd-difficulty-swallowing').length;
  const nauseaCount = gerdSymptoms.filter(s => getLogSymptomId(s) === 'gerd-nausea').length;

  // Count unique symptom types
  const uniqueSymptoms = new Set(gerdSymptoms.map(s => s.symptomId)).size;

  // Calculate weekly average
  const weeksInPeriod = evaluationPeriodDays / 7;
  const episodesPerWeek = gerdSymptoms.length / weeksInPeriod;

  evidence.push(`${gerdSymptoms.length} GERD episodes logged over ${evaluationPeriodDays} days`);
  evidence.push(`Average ${episodesPerWeek.toFixed(1)} episodes per week`);
  evidence.push(`${uniqueSymptoms} different symptom types documented`);

  if (heartburnCount > 0) evidence.push(`${heartburnCount} heartburn episodes`);
  if (regurgitationCount > 0) evidence.push(`${regurgitationCount} regurgitation episodes`);
  if (chestPainCount > 0) evidence.push(`${chestPainCount} chest pain episodes`);
  if (dysphagiaCount > 0) evidence.push(`${dysphagiaCount} difficulty swallowing episodes`);

  // Determine rating
  // 60%: Requires weight loss, bleeding, anemia documentation
  // (Cannot be determined from symptoms alone)

  // 30%: Persistent recurrent symptoms with dysphagia, pyrosis, regurgitation + chest pain
  if (episodesPerWeek >= 3 && heartburnCount > 0 && regurgitationCount > 0 &&
      (chestPainCount > 0 || dysphagiaCount > 0)) {
    supportedRating = '30';
    ratingRationale.push(
        `${episodesPerWeek.toFixed(1)} episodes per week (persistently recurrent)`,
        'Heartburn (pyrosis) documented',
        'Regurgitation documented',
        chestPainCount > 0 ? 'Chest pain episodes logged' : 'Dysphagia (difficulty swallowing) logged',
        'Meets criteria for considerable impairment'
    );
  }
  // 10%: Two or more symptoms, less severe
  else if (uniqueSymptoms >= 2) {
    supportedRating = '10';
    ratingRationale.push(
        `${uniqueSymptoms} different GERD symptoms documented`,
        `${episodesPerWeek.toFixed(1)} episodes per week`,
        'Meets criteria for 10% (two or more symptoms of less severity)'
    );

    if (episodesPerWeek >= 2 && heartburnCount > 0 && regurgitationCount > 0) {
      gaps.push('Close to 30% - log chest pain or dysphagia if present');
      gaps.push('Document persistence and frequency for higher rating');
    }
  }
  else {
    supportedRating = '0';
    ratingRationale.push(
        'Symptoms appear controlled or minimal',
        'May be managed with medication',
        'Does not meet frequency for higher rating'
    );
  }

  // Documentation gaps
  if (gerdSymptoms.length < 12) {
    gaps.push(`Only ${gerdSymptoms.length} episodes logged - aim for 12+ over 90 days`);
  }

  if (uniqueSymptoms < 2) {
    gaps.push('Log multiple symptom types for higher rating consideration');
  }

  if (heartburnCount === 0) {
    gaps.push('Heartburn (pyrosis) is hallmark GERD symptom - document if present');
  }

  if (dysphagiaCount > 0) {
    gaps.push('Difficulty swallowing documented - get endoscopy results for claim');
  }

  // 60% requires clinical documentation
  gaps.push('60% rating requires medical documentation of weight loss, bleeding, or anemia');

  return {
    condition: 'Gastroesophageal Reflux Disease (GERD)',
    diagnosticCode: '7346',
    hasData: true,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria: GERD_CRITERIA,
    disclaimer: GERD_CRITERIA.disclaimer,
  };
};


/**
 * Analyze Radiculopathy logs for VA rating
 * DC 8520 - Radiculopathy
 */

export const analyzeGERDComplicationsLogs = (logs, options = {}) => {
  const {
    evaluationPeriodDays = 90,
  } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate && getLogSymptomId(log) === 'gerd-complication';
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No GERD complication logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Log GERD complications if diagnosed'],
    };
  }

  // Check for serious complications
  const hasBarretts = relevantLogs.some(log =>
      log.gerdComplicationData?.complicationType === 'barretts'
  );

  const hasStricture = relevantLogs.some(log =>
      log.gerdComplicationData?.complicationType === 'stricture'
  );

  let supportedRating = 0;
  let ratingRationale = [];

  if (hasBarretts) {
    supportedRating = '60%';
    ratingRationale = [
      'Barrett\'s esophagus is serious pre-cancerous complication',
      'Requires regular monitoring and treatment',
    ];
  } else if (hasStricture) {
    supportedRating = '30%';
    ratingRationale = [
      'Esophageal stricture documented',
      'May require periodic dilation procedures',
    ];
  } else {
    supportedRating = '30%';
    ratingRationale = [
      'Documented GERD complications (hiatal hernia, esophagitis)',
      'Persistently recurrent symptoms despite treatment',
    ];
  }

  const gaps = [
    'CRITICAL: Obtain endoscopy reports documenting complications',
    'Document frequency of dilation procedures if applicable',
    'Track daily medication requirements',
    'Note any weight loss or nutritional issues',
    'Request biopsy results if Barrett\'s esophagus suspected',
  ];

  return {
    hasData: true,
    condition: 'GERD with Complications',
    diagnosticCode: '7346',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    evidence: {
      totalLogs: relevantLogs.length,
      hasBarretts,
      hasStricture,
    },
    gaps,
    criteria: GERD_COMPLICATIONS_CRITERIA,
    disclaimer: 'GERD complication ratings require endoscopy documentation and medical records.',
  };
};

/**
 * Analyze Ulcerative Colitis / IBD symptom logs
 */

export const analyzeUlcerativeColitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options; // Use 1 year for hospitalization tracking

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'uc-diarrhea', 'uc-rectal-bleeding', 'uc-abdominal-pain',
    'uc-urgency', 'uc-incontinence', 'uc-fever', 'uc-hospitalization'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No ulcerative colitis/IBD logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging IBD symptoms including diarrhea frequency, bleeding, and flares'],
    };
  }

  // Count symptom types
  const diarrheaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'uc-diarrhea');
  const bleedingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'uc-rectal-bleeding');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'uc-hospitalization');
  const incontinenceLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'uc-incontinence');
  const feverLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'uc-fever');

  const evidence = [];
  if (diarrheaLogs.length > 0) evidence.push(`${diarrheaLogs.length} diarrhea episodes logged`);
  if (bleedingLogs.length > 0) evidence.push(`${bleedingLogs.length} rectal bleeding episodes logged`);
  if (hospitalizationLogs.length > 0) evidence.push(`${hospitalizationLogs.length} hospitalizations in evaluation period`);
  if (incontinenceLogs.length > 0) evidence.push(`${incontinenceLogs.length} incontinence episodes logged`);
  if (feverLogs.length > 0) evidence.push(`${feverLogs.length} fever/systemic symptom episodes logged`);

  // Determine rating
  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Calculate daily averages
  const diarrheaPerDay = diarrheaLogs.length / evaluationPeriodDays;

  if (hospitalizationLogs.length >= 1 && (diarrheaPerDay >= 6 || bleedingLogs.length >= 180 || incontinenceLogs.length > 0)) {
    supportedRating = 100;
    ratingRationale = [
      'Hospitalization required in past year',
      'Severe symptoms: frequent diarrhea, bleeding, or incontinence',
      'Pattern consistent with 100% rating criteria',
    ];
  } else if (hospitalizationLogs.length >= 1 || (diarrheaPerDay >= 4 && feverLogs.length > 0)) {
    supportedRating = 60;
    ratingRationale = [
      'Moderate IBD with significant symptom burden',
      'May require immunosuppressant therapy',
    ];
    gaps.push('Document if immunosuppressants or biologics are prescribed');
  } else if (diarrheaLogs.length >= 30 || (relevantLogs.length >= 50 && feverLogs.length > 0)) {
    supportedRating = 30;
    ratingRationale = [
      'Mild-moderate IBD with regular symptoms',
      'Managed with oral/topical agents',
    ];
  } else {
    supportedRating = 10;
    ratingRationale = [
      'Minimal-mild IBD symptoms documented',
    ];
  }

  gaps.push('Document treatment regimen (oral agents, immunosuppressants, or biologics)');
  if (hospitalizationLogs.length === 0) {
    gaps.push('Log any hospitalizations for IBD flares');
  }

  return {
    hasData: true,
    condition: 'Ulcerative Colitis / IBD',
    diagnosticCode: '7323/7326',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: ULCERATIVE_COLITIS_CRITERIA,
    disclaimer: ULCERATIVE_COLITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Peptic Ulcer symptom logs
 */

export const analyzePepticUlcerLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'ulcer-abdominal-pain', 'ulcer-nausea', 'ulcer-vomiting',
    'ulcer-hematemesis', 'ulcer-melena', 'ulcer-hospitalization'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No peptic ulcer logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging peptic ulcer symptoms including pain episodes, nausea, and any bleeding'],
    };
  }

  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ulcer-abdominal-pain');
  const nauseaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ulcer-nausea');
  const vomitingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ulcer-vomiting');
  const bleedingLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'ulcer-hematemesis' || getLogSymptomId(log) === 'ulcer-melena'
  );
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'ulcer-hospitalization');

  const evidence = [];
  if (painLogs.length > 0) evidence.push(`${painLogs.length} abdominal pain episodes logged`);
  if (nauseaLogs.length > 0) evidence.push(`${nauseaLogs.length} nausea episodes logged`);
  if (vomitingLogs.length > 0) evidence.push(`${vomitingLogs.length} vomiting episodes logged`);
  if (bleedingLogs.length > 0) evidence.push(`${bleedingLogs.length} GI bleeding episodes (hematemesis/melena) logged`);
  if (hospitalizationLogs.length > 0) evidence.push(`${hospitalizationLogs.length} hospitalizations in evaluation period`);

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Estimate episodes (clusters of 3+ consecutive days)
  const totalSymptomDays = new Set(relevantLogs.map(log =>
      new Date(log.timestamp).toDateString()
  )).size;

  if (hospitalizationLogs.length >= 1 && bleedingLogs.length > 0) {
    supportedRating = 60;
    ratingRationale = [
      'Hospitalization with GI bleeding documented',
      'Consistent with severe peptic ulcer disease',
    ];
  } else if (painLogs.length >= 12 || totalSymptomDays >= 12) {
    supportedRating = 40;
    ratingRationale = [
      'Multiple symptom episodes documented',
      'Pattern suggests 4+ episodes per year lasting 3+ days',
    ];
    gaps.push('Confirm daily medication use for peptic ulcer');
  } else if (painLogs.length >= 3 || totalSymptomDays >= 9) {
    supportedRating = 20;
    ratingRationale = [
      'Symptom episodes documented',
      'Pattern suggests 1-3 episodes per year',
    ];
    gaps.push('Confirm daily medication use for peptic ulcer');
  } else {
    supportedRating = 0;
    ratingRationale = [
      'Symptoms logged but may not meet compensable criteria',
      'Document episode duration (must be 3+ consecutive days)',
    ];
  }

  if (bleedingLogs.length === 0) {
    gaps.push('Document any GI bleeding (vomiting blood or tarry stools)');
  }

  return {
    hasData: true,
    condition: 'Peptic Ulcer Disease',
    diagnosticCode: '7304',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: PEPTIC_ULCER_CRITERIA,
    disclaimer: PEPTIC_ULCER_CRITERIA.disclaimer,
  };
};



/**
 * Analyze Diverticulitis symptom logs
 */

export const analyzeHemorrhoidLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomIds = [
    'hemorrhoid-persistent-bleeding', 'hemorrhoid-anemia', 'hemorrhoid-prolapsed',
    'hemorrhoid-thrombosed', 'hemorrhoid-pain', 'hemorrhoid-itching',
    'hemorrhoid-bleeding', 'hemorrhoid-prolapse', 'hemorrhoid-thrombosis',
    'hemorrhoid-internal', 'hemorrhoid-external',
  ];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hemorrhoids',
      diagnosticCode: '7336',
      message: 'No hemorrhoid symptoms logged',
      criteria: HEMORRHOIDS_CRITERIA,
    };
  }

  const persistentBleeding = relevantLogs.filter(log => log.symptomId === 'hemorrhoid-persistent-bleeding');
  const anemiaLogs = relevantLogs.filter(log => log.symptomId === 'hemorrhoid-anemia');
  const prolapsedLogs = relevantLogs.filter(log => log.symptomId === 'hemorrhoid-prolapsed');
  const thrombosedLogs = relevantLogs.filter(log => log.symptomId === 'hemorrhoid-thrombosed');

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 20%: Persistent bleeding with anemia OR continuously prolapsed with 3+ thrombosis/year
  if ((persistentBleeding.length >= 3 && anemiaLogs.length > 0) || thrombosedLogs.length >= 3) {
    supportedRating = 20;
    if (persistentBleeding.length >= 3 && anemiaLogs.length > 0) {
      rationale.push('Persistent bleeding documented with anemia');
    }
    if (thrombosedLogs.length >= 3) {
      rationale.push(`${thrombosedLogs.length} thrombosis episodes documented (3+ supports 20%)`);
    }
    if (prolapsedLogs.length > 0) {
      rationale.push('Prolapsed hemorrhoids documented');
    }
  }
  // 10%: Prolapsed with <=2 thrombosis OR external with 3+ thrombosis
  else if ((prolapsedLogs.length > 0 && thrombosedLogs.length <= 2) || thrombosedLogs.length >= 3) {
    supportedRating = 10;
    if (prolapsedLogs.length > 0) {
      rationale.push('Prolapsed hemorrhoids documented');
    }
    if (thrombosedLogs.length > 0) {
      rationale.push(`${thrombosedLogs.length} thrombosis episode(s) documented`);
    }
  }
  // 0%: Mild symptoms
  else if (relevantLogs.length > 0) {
    supportedRating = 0;
    rationale.push('Hemorrhoid symptoms documented but below compensable threshold');
  }

  // Evidence gaps
  if (persistentBleeding.length > 0 && anemiaLogs.length === 0) {
    evidenceGaps.push('Get lab work to document anemia if bleeding is persistent');
  }
  if (thrombosedLogs.length > 0 && thrombosedLogs.length < 3) {
    evidenceGaps.push('Document all thrombosis episodes with dates (3+ per year supports higher rating)');
  }

  return {
    hasData: true,
    condition: 'Hemorrhoids',
    diagnosticCode: '7336',
    cfrReference: '38 CFR 4.114',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      bleedingLogs: persistentBleeding.length,
      anemiaDocumented: anemiaLogs.length > 0,
      prolapsedLogs: prolapsedLogs.length,
      thrombosisEpisodes: thrombosedLogs.length,
    },
    criteria: HEMORRHOIDS_CRITERIA,
  };
};

/**
 * Analyze Avitaminosis symptoms against VA rating criteria
 * DC 6313
 */

export const analyzeDiverticulitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'divert-abdominal-pain', 'divert-fever', 'divert-flare',
    'divert-hospitalization', 'divert-complication'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      message: 'No diverticulitis logs found',
      supportedRating: null,
      evidence: [],
      gaps: ['Start logging diverticulitis symptoms including flares, hospitalizations, and any complications'],
    };
  }

  const flareLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'divert-flare');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'divert-hospitalization');
  const complicationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'divert-complication');
  const feverLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'divert-fever');

  const evidence = [];
  if (flareLogs.length > 0) evidence.push(`${flareLogs.length} acute flares logged`);
  if (hospitalizationLogs.length > 0) evidence.push(`${hospitalizationLogs.length} hospitalizations logged`);
  if (complicationLogs.length > 0) evidence.push(`${complicationLogs.length} complications (bleeding/abscess/obstruction) logged`);
  if (feverLogs.length > 0) evidence.push(`${feverLogs.length} fever episodes logged`);

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (hospitalizationLogs.length >= 1 && complicationLogs.length >= 1) {
    supportedRating = 30;
    ratingRationale = [
      'Hospitalization with complications documented',
      'Meets criteria for 30% rating',
    ];
  } else if (hospitalizationLogs.length >= 1) {
    supportedRating = 20;
    ratingRationale = [
      'Hospitalization for diverticulitis documented',
      'Without documented complications (30% requires complications)',
    ];
    gaps.push('Document any complications: hemorrhage, obstruction, abscess, peritonitis, or perforation');
  } else if (flareLogs.length >= 1 || feverLogs.length >= 1) {
    supportedRating = 0;
    ratingRationale = [
      'Symptomatic diverticulitis managed conservatively',
      'Compensable rating requires hospitalization',
    ];
    gaps.push('Document any hospitalizations for acute flares');
  }

  return {
    hasData: true,
    condition: 'Diverticulitis',
    diagnosticCode: '7327',
    evaluationPeriodDays,
    supportedRating: supportedRating.toString(),
    ratingRationale,
    evidence,
    gaps,
    criteria: DIVERTICULITIS_CRITERIA,
    disclaimer: DIVERTICULITIS_CRITERIA.disclaimer,
  };
};

/**
 * Analyze Hypothyroidism symptom logs
 */

export const analyzeCirrhosisLogs = (logs, measurements = [], options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'cirrhosis-fatigue', 'cirrhosis-ascites', 'cirrhosis-edema', 'cirrhosis-jaundice',
    'cirrhosis-encephalopathy', 'cirrhosis-variceal-bleed', 'cirrhosis-sbp', 'cirrhosis-coagulopathy',
    'cirrhosis-splenomegaly', 'cirrhosis-anorexia', 'cirrhosis-malaise', 'cirrhosis-abdominal-pain',
    'cirrhosis-itching', 'cirrhosis-hospitalization'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Cirrhosis of the Liver',
      diagnosticCode: '7312',
      message: 'No cirrhosis logs found',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging cirrhosis symptoms including fatigue, ascites, and complications'],
      metrics: { totalLogs: 0 },
    };
  }

  // Get MELD score from measurements
  const meldReadings = Array.isArray(measurements) ? measurements.filter(m =>
      m.measurementType === 'meld-score' && new Date(m.timestamp) >= cutoffDate
  ) : [];

  let latestMeld = null;
  if (meldReadings.length > 0) {
    const sorted = meldReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    latestMeld = sorted[0]?.values?.meld_score;
  }

  // Count specific symptoms
  const fatigueLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-fatigue');
  const ascitesLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-ascites');
  const encephalopathyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-encephalopathy');
  const varicealBleedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-variceal-bleed');
  const sbpLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-sbp');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-hospitalization');
  const anorexiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-anorexia');
  const malaiseLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-malaise');
  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-abdominal-pain');
  const splenomegalyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'cirrhosis-splenomegaly');

  const hasMajorComplication = encephalopathyLogs.length > 0 || varicealBleedLogs.length > 0 ||
      sbpLogs.length > 0 || ascitesLogs.length > 0;
  const hasPortalHypertensionSigns = ascitesLogs.length > 0 || splenomegalyLogs.length > 0;
  const hasMildSymptoms = anorexiaLogs.length > 0 || fatigueLogs.length > 0 ||
      malaiseLogs.length > 0 || painLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  // Determine rating based on MELD or symptoms
  if (latestMeld && latestMeld >= 15) {
    supportedRating = 100;
    ratingRationale = [`MELD score ${latestMeld} (>=15 supports 100%)`];
  } else if (hasMajorComplication && fatigueLogs.length >= 20) {
    supportedRating = 100;
    ratingRationale = ['Daily debilitating symptoms with major complication documented'];
    if (encephalopathyLogs.length > 0) ratingRationale.push('Hepatic encephalopathy documented');
    if (varicealBleedLogs.length > 0) ratingRationale.push('Variceal hemorrhage documented');
    if (sbpLogs.length > 0) ratingRationale.push('Spontaneous bacterial peritonitis documented');
    if (ascitesLogs.length > 0) ratingRationale.push('Ascites documented');
  } else if (latestMeld && latestMeld >= 12) {
    supportedRating = 60;
    ratingRationale = [`MELD score ${latestMeld} (12-14 supports 60%)`];
  } else if (fatigueLogs.length >= 10 && (varicealBleedLogs.length > 0 || encephalopathyLogs.length > 0)) {
    supportedRating = 60;
    ratingRationale = ['Daily fatigue with variceal hemorrhage or encephalopathy in past year'];
  } else if (latestMeld && latestMeld >= 10) {
    supportedRating = 30;
    ratingRationale = [`MELD score ${latestMeld} (10-11 supports 30%)`];
  } else if (hasPortalHypertensionSigns && hasMildSymptoms) {
    supportedRating = 30;
    ratingRationale = ['Portal hypertension signs with weakness/anorexia/pain/malaise'];
  } else if (latestMeld && latestMeld > 6) {
    supportedRating = 10;
    ratingRationale = [`MELD score ${latestMeld} (7-9 supports 10%)`];
  } else if (hasMildSymptoms) {
    supportedRating = 10;
    ratingRationale = ['Symptoms documented (anorexia, weakness, pain, or malaise)'];
  } else {
    ratingRationale = ['Cirrhosis symptoms documented', 'Document symptom severity for rating determination'];
  }

  // Documentation gaps
  if (!latestMeld) {
    gaps.push('Record MELD score from lab values for accurate rating');
  }
  if (ascitesLogs.length === 0) {
    gaps.push('Document ascites episodes if present');
  }
  if (encephalopathyLogs.length === 0 && hospitalizationLogs.length > 0) {
    gaps.push('Document hepatic encephalopathy episodes if experienced');
  }

  return {
    hasData: true,
    condition: 'Cirrhosis of the Liver',
    diagnosticCode: '7312',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      meldScore: latestMeld,
      fatigueLogs: fatigueLogs.length,
      ascitesLogs: ascitesLogs.length,
      encephalopathyLogs: encephalopathyLogs.length,
      varicealBleedLogs: varicealBleedLogs.length,
      hospitalizationLogs: hospitalizationLogs.length,
    },
    criteria: CIRRHOSIS_CRITERIA,
  };
};

/**
 * Analyze Gastritis symptom logs (DC 7307) - Rated as Peptic Ulcer DC 7304
 */

export const analyzeGastritisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'gastritis-abdominal-pain', 'gastritis-nausea', 'gastritis-vomiting', 'gastritis-bloating',
    'gastritis-indigestion', 'gastritis-hematemesis', 'gastritis-melena', 'gastritis-hospitalization'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Gastritis, Chronic',
      diagnosticCode: '7307',
      message: 'No gastritis logs found',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging gastritis symptoms including pain episodes, nausea, and any bleeding'],
      metrics: { totalLogs: 0 },
    };
  }

  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'gastritis-abdominal-pain');
  const nauseaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'gastritis-nausea');
  const vomitingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'gastritis-vomiting');
  const bleedingLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'gastritis-hematemesis' || getLogSymptomId(log) === 'gastritis-melena'
  );
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'gastritis-hospitalization');

  // Estimate episodes (clusters of symptoms)
  const totalSymptomDays = new Set(relevantLogs.map(log =>
      new Date(log.timestamp).toDateString()
  )).size;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (hospitalizationLogs.length >= 1 && bleedingLogs.length > 0) {
    supportedRating = 60;
    ratingRationale = [
      'Hospitalization with GI bleeding documented',
      'Consistent with severe gastritis (rated as peptic ulcer disease)',
    ];
  } else if (painLogs.length >= 12 || totalSymptomDays >= 12) {
    supportedRating = 40;
    ratingRationale = [
      'Multiple symptom episodes documented',
      'Pattern suggests 4+ episodes per year lasting 3+ days',
    ];
    gaps.push('Confirm daily medication use (PPI or H2 blocker)');
  } else if (painLogs.length >= 3 || totalSymptomDays >= 9) {
    supportedRating = 20;
    ratingRationale = [
      'Symptom episodes documented',
      'Pattern suggests 1-3 episodes per year',
    ];
    gaps.push('Confirm daily medication use for gastritis');
  } else {
    ratingRationale = [
      'Gastritis symptoms logged',
      'Document episode duration (must be 3+ consecutive days for compensable rating)',
    ];
  }

  if (bleedingLogs.length === 0) {
    gaps.push('Document any GI bleeding if present');
  }

  return {
    hasData: true,
    condition: 'Gastritis, Chronic',
    diagnosticCode: '7307',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      painLogs: painLogs.length,
      nauseaLogs: nauseaLogs.length,
      vomitingLogs: vomitingLogs.length,
      bleedingLogs: bleedingLogs.length,
      hospitalizationLogs: hospitalizationLogs.length,
      totalSymptomDays,
    },
    criteria: GASTRITIS_CRITERIA,
  };
};

/**
 * Analyze Chronic Pancreatitis symptom logs (DC 7347)
 */

export const analyzePancreatitisLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'pancreatitis-abdominal-pain', 'pancreatitis-back-pain', 'pancreatitis-nausea', 'pancreatitis-vomiting',
    'pancreatitis-maldigestion', 'pancreatitis-weight-loss', 'pancreatitis-enzyme-use',
    'pancreatitis-dietary-restriction', 'pancreatitis-tube-feeding', 'pancreatitis-cyst',
    'pancreatitis-hospitalization'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Pancreatitis, Chronic',
      diagnosticCode: '7347',
      message: 'No pancreatitis logs found',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging pancreatitis symptoms including pain episodes and hospitalizations'],
      metrics: { totalLogs: 0 },
    };
  }

  const painLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'pancreatitis-abdominal-pain' || getLogSymptomId(log) === 'pancreatitis-back-pain'
  );
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-hospitalization');
  const enzymeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-enzyme-use');
  const dietaryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-dietary-restriction');
  const tubeFeedingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-tube-feeding');
  const maldigestionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-maldigestion');
  const complicationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pancreatitis-cyst');

  // Count unique pain days to estimate episodes
  const painDays = new Set(painLogs.map(log => new Date(log.timestamp).toDateString())).size;
  const hasMaldigestion = maldigestionLogs.length > 0 || enzymeLogs.length > 0;
  const hasDietaryRestriction = dietaryLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (hospitalizationLogs.length >= 3 && hasMaldigestion && hasDietaryRestriction && painDays >= 30) {
    supportedRating = 100;
    ratingRationale = [
      `${hospitalizationLogs.length} hospitalizations in evaluation period (3+ required)`,
      'Maldigestion requiring enzyme supplementation documented',
      'Dietary restriction documented',
      'Daily pain pattern documented',
    ];
  } else if (painDays >= 10 && hospitalizationLogs.length >= 1) {
    supportedRating = 60;
    ratingRationale = [
      'Multiple pain episodes documented',
      `${hospitalizationLogs.length} hospitalization(s) for complications`,
    ];
    if (tubeFeedingLogs.length > 0) {
      ratingRationale.push('Tube feeding complications documented');
    }
  } else if (painDays >= 3 || complicationLogs.length > 0) {
    supportedRating = 30;
    ratingRationale = [
      'Pain episodes requiring ongoing treatment documented',
    ];
    if (complicationLogs.length > 0) {
      ratingRationale.push('Complications (cyst/pseudocyst) documented');
    }
  } else {
    ratingRationale = [
      'Pancreatitis symptoms documented',
      'Continue logging pain episodes and hospitalizations',
    ];
  }

  // Documentation gaps
  if (hospitalizationLogs.length === 0) {
    gaps.push('Document hospitalizations for pancreatitis if any');
  }
  if (!hasMaldigestion) {
    gaps.push('Document maldigestion symptoms and enzyme use if applicable');
  }
  if (!hasDietaryRestriction) {
    gaps.push('Document dietary restrictions if required');
  }

  return {
    hasData: true,
    condition: 'Pancreatitis, Chronic',
    diagnosticCode: '7347',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      painLogs: painLogs.length,
      painDays,
      hospitalizationLogs: hospitalizationLogs.length,
      enzymeLogs: enzymeLogs.length,
      hasMaldigestion,
      hasDietaryRestriction,
      complicationLogs: complicationLogs.length,
    },
    criteria: PANCREATITIS_CRITERIA,
  };
};

/**
 * Analyze Chronic Biliary Tract Disease symptom logs (DC 7314)
 */

export const analyzeBiliaryTractLogs = (logs, options = {}) => {
  const { evaluationPeriodDays = 365 } = options;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const symptomIds = [
    'biliary-ruq-pain', 'biliary-nausea', 'biliary-vomiting', 'biliary-jaundice',
    'biliary-fever', 'biliary-dilation', 'biliary-attack'
  ];

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Chronic Biliary Tract Disease',
      diagnosticCode: '7314',
      message: 'No biliary tract disease logs found',
      supportedRating: null,
      ratingRationale: [],
      gaps: ['Start logging biliary symptoms including RUQ pain attacks with nausea/vomiting'],
      metrics: { totalLogs: 0 },
    };
  }

  const ruqPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-ruq-pain');
  const nauseaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-nausea');
  const vomitingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-vomiting');
  const attackLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-attack');
  const dilationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-dilation');
  const feverLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'biliary-fever');

  // Count documented attacks (RUQ pain with nausea AND vomiting)
  // Estimate by looking at days with all three symptoms or explicit attack logs
  const attackDays = new Set(attackLogs.map(log => new Date(log.timestamp).toDateString())).size;
  const ruqPainDays = new Set(ruqPainLogs.map(log => new Date(log.timestamp).toDateString()));
  const nauseaDays = new Set(nauseaLogs.map(log => new Date(log.timestamp).toDateString()));
  const vomitingDays = new Set(vomitingLogs.map(log => new Date(log.timestamp).toDateString()));

  // Count days with RUQ pain + nausea + vomiting
  let symptomClusterDays = 0;
  ruqPainDays.forEach(day => {
    if (nauseaDays.has(day) && vomitingDays.has(day)) {
      symptomClusterDays++;
    }
  });

  const totalDocumentedAttacks = Math.max(attackDays, symptomClusterDays);
  const hasStrictureDilation = dilationLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  let gaps = [];

  if (totalDocumentedAttacks >= 3 || hasStrictureDilation) {
    supportedRating = 30;
    ratingRationale = [];
    if (totalDocumentedAttacks >= 3) {
      ratingRationale.push(`${totalDocumentedAttacks} documented attacks with RUQ pain, nausea, and vomiting`);
    }
    if (hasStrictureDilation) {
      ratingRationale.push('Biliary stricture dilation procedure documented');
    }
  } else if (totalDocumentedAttacks >= 1) {
    supportedRating = 10;
    ratingRationale = [
      `${totalDocumentedAttacks} documented attack(s) in evaluation period`,
      '1-2 attacks supports 10% rating',
    ];
  } else if (ruqPainLogs.length > 0) {
    ratingRationale = [
      'RUQ pain logged but full attack criteria not met',
      'Attack requires RUQ pain WITH nausea AND vomiting on same day',
    ];
    gaps.push('Log nausea and vomiting when they occur with RUQ pain');
  }

  // Documentation gaps
  if (totalDocumentedAttacks < 3 && !hasStrictureDilation) {
    gaps.push('Document attacks with medical visits for clinical confirmation');
  }
  if (feverLogs.length === 0 && totalDocumentedAttacks > 0) {
    gaps.push('Document fever/cholangitis episodes if present');
  }

  return {
    hasData: true,
    condition: 'Chronic Biliary Tract Disease',
    diagnosticCode: '7314',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      ruqPainLogs: ruqPainLogs.length,
      nauseaLogs: nauseaLogs.length,
      vomitingLogs: vomitingLogs.length,
      attackLogs: attackLogs.length,
      dilationLogs: dilationLogs.length,
      totalDocumentedAttacks,
      hasStrictureDilation,
    },
    criteria: BILIARY_TRACT_CRITERIA,
  };
};


// ============================================
// PHASE 5A: HERNIA ANALYSIS (DC 7338)
// ============================================

/**
 * Analyze Hernia symptom logs against VA rating criteria
 * DC 7338 - Rated by size, repairability, and pain with activities
 */

export const analyzeHerniaLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = DIGESTIVE_CONDITIONS.HERNIA.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Hernia',
      diagnosticCode: '7338',
      message: 'No hernia symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms
  const painBendingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-bending');
  const painAdlLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-adl');
  const painWalkingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-walking');
  const painStairsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-stairs');
  const painStrainingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-straining');
  const painStandingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-pain-standing');

  const reducibleLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-reducible');
  const irreducibleLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-irreducible');

  const sizeSmallLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-size-small');
  const sizeMediumLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-size-medium');
  const sizeLargeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-size-large');

  const trussLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-truss-required');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-recurrent');
  const postSurgicalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-post-surgical');
  const strangulationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-strangulation-risk');
  const functionalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'hernia-functional-limitation');

  const bulgeLogs = relevantLogs.filter(log =>
      ['hernia-groin-bulge', 'hernia-abdominal-bulge', 'hernia-umbilical-bulge'].includes(getLogSymptomId(log))
  );

  // Determine hernia characteristics
  const isIrreducible = irreducibleLogs.length > 0;
  const isLargeSize = sizeLargeLogs.length > 0; // >=15cm
  const isMediumSize = sizeMediumLogs.length > 0; // 3-15cm
  const isSmallSize = sizeSmallLogs.length > 0 && !isMediumSize && !isLargeSize; // <3cm

  // Count pain activities (the 4 specific activities VA considers)
  let painActivitiesCount = 0;
  const painActivities = [];

  if (painBendingLogs.length > 0) {
    painActivitiesCount++;
    painActivities.push('bending over');
  }
  if (painAdlLogs.length > 0) {
    painActivitiesCount++;
    painActivities.push('ADLs');
  }
  if (painWalkingLogs.length > 0) {
    painActivitiesCount++;
    painActivities.push('walking');
  }
  if (painStairsLogs.length > 0) {
    painActivitiesCount++;
    painActivities.push('climbing stairs');
  }

  // Calculate total pain logs for severity tracking
  const totalPainLogs = painBendingLogs.length + painAdlLogs.length + painWalkingLogs.length +
      painStairsLogs.length + painStrainingLogs.length + painStandingLogs.length;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  // Note: VA requires 12+ months duration which we can't verify from logs alone
  // We document current status and note duration requirement

  if (isIrreducible || irreducibleLogs.length > 0 || recurrentLogs.length > 0) {
    // Irreparable/recurrent hernia pathway
    if (isLargeSize && painActivitiesCount >= 3) {
      supportedRating = 100;
      ratingRationale = [
        `Hernia size >=15cm documented`,
        `Pain with ${painActivitiesCount} activities: ${painActivities.join(', ')}`,
        'Irreducible/irreparable hernia documented',
        'Note: VA requires 12+ months duration - ensure medical documentation',
      ];
    } else if (isLargeSize && painActivitiesCount >= 2) {
      supportedRating = 60;
      ratingRationale = [
        `Hernia size >=15cm documented`,
        `Pain with ${painActivitiesCount} activities: ${painActivities.join(', ')}`,
        'Irreducible/irreparable hernia documented',
        'Note: VA requires 12+ months duration - ensure medical documentation',
      ];
    } else if (isMediumSize && painActivitiesCount >= 2) {
      supportedRating = 30;
      ratingRationale = [
        `Hernia size 3-15cm documented`,
        `Pain with ${painActivitiesCount} activities: ${painActivities.join(', ')}`,
        'Irreducible/irreparable hernia documented',
      ];
    } else if (isMediumSize && painActivitiesCount >= 1) {
      supportedRating = 20;
      ratingRationale = [
        `Hernia size 3-15cm documented`,
        `Pain with ${painActivitiesCount} activity: ${painActivities.join(', ')}`,
        'Irreducible/irreparable hernia documented',
      ];
    } else if (isSmallSize || (!isLargeSize && !isMediumSize)) {
      supportedRating = 10;
      ratingRationale = [
        'Irreducible/irreparable hernia documented',
        isSmallSize ? 'Hernia size <3cm documented' : 'Document hernia size for accurate rating',
      ];
    }
  } else if (reducibleLogs.length > 0 || bulgeLogs.length > 0) {
    // Reducible/repairable hernia - typically 0% unless symptomatic
    supportedRating = 0;
    ratingRationale = [
      'Hernia present but appears reducible/repairable',
      'Asymptomatic repairable hernias rated at 0%',
      `${totalPainLogs} pain episodes logged - document if hernia becomes irreparable`,
    ];
  }

  // Documentation gaps
  if (!isLargeSize && !isMediumSize && !isSmallSize) {
    gaps.push('Document hernia size (measured in cm) for accurate rating');
  }
  if (irreducibleLogs.length === 0 && reducibleLogs.length === 0) {
    gaps.push('Document whether hernia is reducible or irreducible');
  }
  if (painActivitiesCount < 3 && (isLargeSize || isMediumSize)) {
    gaps.push(`Log pain with specific activities: bending, ADLs, walking, stairs (${3 - painActivitiesCount} more types needed for higher rating)`);
  }
  if (supportedRating > 0) {
    gaps.push('Obtain medical documentation confirming hernia is irreparable and duration of 12+ months');
  }
  if (strangulationLogs.length > 0) {
    gaps.push('URGENT: Strangulation symptoms logged - seek immediate medical attention');
  }

  return {
    hasData: true,
    condition: 'Hernia',
    diagnosticCode: '7338',
    cfrReference: '38 CFR 4.114',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      bulgeLogs: bulgeLogs.length,
      totalPainLogs,
      painActivitiesCount,
      painActivities,
      irreducibleLogs: irreducibleLogs.length,
      reducibleLogs: reducibleLogs.length,
      sizeLargeLogs: sizeLargeLogs.length,
      sizeMediumLogs: sizeMediumLogs.length,
      sizeSmallLogs: sizeSmallLogs.length,
      trussLogs: trussLogs.length,
      recurrentLogs: recurrentLogs.length,
      strangulationLogs: strangulationLogs.length,
      functionalLogs: functionalLogs.length,
    },
    criteria: HERNIA_CRITERIA,
  };
};

// ============================================
// PHASE 5A: PERITONEAL ADHESIONS ANALYSIS (DC 7301)
// ============================================

/**
 * Analyze Peritoneal Adhesions symptom logs against VA rating criteria
 * DC 7301 - Rated by obstruction severity, dietary modification, and symptoms
 */

export const analyzePeritonealAdhesionsLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = DIGESTIVE_CONDITIONS.PERITONEAL_ADHESIONS.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Peritoneal Adhesions',
      diagnosticCode: '7301',
      message: 'No peritoneal adhesion symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms
  const abdominalPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-abdominal-pain');
  const nauseaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-nausea');
  const vomitingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-vomiting');
  const colicLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-colic');
  const constipationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-constipation');
  const diarrheaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-diarrhea');
  const distensionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-distension');

  const partialObstructionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-obstruction-partial');
  const completeObstructionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-obstruction-complete');
  const hospitalizationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-hospitalization');
  const dietaryModLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-dietary-modification');
  const tpnLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-tpn-required');
  const inoperableLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-inoperable');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pa-recurrent');

  const causeLogs = relevantLogs.filter(log =>
      ['pa-post-surgical', 'pa-post-trauma', 'pa-inflammatory'].includes(getLogSymptomId(log))
  );

  // Count GI symptoms (the 6 symptoms VA considers)
  let giSymptomsCount = 0;
  const giSymptoms = [];

  if (abdominalPainLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('abdominal pain');
  }
  if (nauseaLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('nausea');
  }
  if (vomitingLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('vomiting');
  }
  if (colicLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('colic');
  }
  if (constipationLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('constipation');
  }
  if (diarrheaLogs.length > 0) {
    giSymptomsCount++;
    giSymptoms.push('diarrhea');
  }

  const hasTPN = tpnLogs.length > 0;
  const hasInoperableObstruction = inoperableLogs.length > 0 || (partialObstructionLogs.length > 0 && inoperableLogs.length > 0);
  const hasPersistentObstruction = partialObstructionLogs.length >= 3 || completeObstructionLogs.length > 0;
  const hasHospitalization = hospitalizationLogs.length > 0;
  const hasDietaryModification = dietaryModLogs.length > 0;
  const hasGISymptoms = giSymptomsCount > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  if (hasTPN || (hasPersistentObstruction && hasInoperableObstruction)) {
    supportedRating = 80;
    ratingRationale = [
      hasTPN ? 'Total parenteral nutrition (TPN) required' : 'Persistent partial obstruction - inoperable/refractory',
      `${partialObstructionLogs.length + completeObstructionLogs.length} obstruction episodes documented`,
    ];
  } else if (hasHospitalization && hasDietaryModification && hasGISymptoms) {
    supportedRating = 50;
    ratingRationale = [
      `Hospitalization required (${hospitalizationLogs.length} episodes logged)`,
      'Medically-directed dietary modification documented',
      `GI symptoms present: ${giSymptoms.join(', ')}`,
    ];
  } else if (hasDietaryModification && hasGISymptoms) {
    supportedRating = 30;
    ratingRationale = [
      'Medically-directed dietary modification documented',
      `GI symptoms present: ${giSymptoms.join(', ')}`,
    ];
  } else if (hasGISymptoms) {
    supportedRating = 10;
    ratingRationale = [
      'Symptomatic adhesions with GI symptoms',
      `Symptoms documented: ${giSymptoms.join(', ')}`,
    ];
  }

  // Add cause information to rationale if available
  if (causeLogs.length > 0 && supportedRating > 0) {
    const causes = [];
    if (relevantLogs.some(log => getLogSymptomId(log) === 'pa-post-surgical')) causes.push('post-surgical');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'pa-post-trauma')) causes.push('post-trauma');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'pa-inflammatory')) causes.push('inflammatory disease');
    ratingRationale.push(`Adhesion cause: ${causes.join(', ')}`);
  }

  // Documentation gaps
  if (causeLogs.length === 0) {
    gaps.push('Document cause of adhesions (surgery, trauma, or inflammatory disease)');
  }
  if (!hasDietaryModification && supportedRating < 50) {
    gaps.push('Document if medically-directed dietary modification is required');
  }
  if (!hasHospitalization && supportedRating < 80) {
    gaps.push('Document any hospitalizations for obstruction episodes');
  }
  if (giSymptomsCount === 0) {
    gaps.push('Log specific GI symptoms: pain, nausea, vomiting, colic, constipation, diarrhea');
  }
  if (completeObstructionLogs.length > 0) {
    gaps.push('Complete obstruction episodes require emergency documentation');
  }

  return {
    hasData: true,
    condition: 'Peritoneal Adhesions',
    diagnosticCode: '7301',
    cfrReference: '38 CFR 4.114',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      abdominalPainLogs: abdominalPainLogs.length,
      nauseaLogs: nauseaLogs.length,
      vomitingLogs: vomitingLogs.length,
      colicLogs: colicLogs.length,
      constipationLogs: constipationLogs.length,
      diarrheaLogs: diarrheaLogs.length,
      distensionLogs: distensionLogs.length,
      giSymptomsCount,
      giSymptoms,
      partialObstructionLogs: partialObstructionLogs.length,
      completeObstructionLogs: completeObstructionLogs.length,
      hospitalizationLogs: hospitalizationLogs.length,
      dietaryModLogs: dietaryModLogs.length,
      tpnLogs: tpnLogs.length,
      inoperableLogs: inoperableLogs.length,
      recurrentLogs: recurrentLogs.length,
    },
    criteria: PERITONEAL_ADHESIONS_CRITERIA,
  };
};

// ============================================
// PHASE 5B: ESOPHAGEAL STRICTURE ANALYSIS (DC 7203)
// Also used for DC 7204 (Esophageal Spasm/Motility)
// ============================================

/**
 * Analyze Esophageal Stricture/Spasm symptom logs against VA rating criteria
 * DC 7203 - Rated by dysphagia severity, dilatation frequency, aspiration, nutritional impact
 * DC 7204 - Esophageal Spasm/Motility rated using DC 7203 criteria
 */

export const analyzeEsophagealLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;

  // Combine symptom IDs from both DC 7203 and DC 7204
  const strictureSymptomIds = DIGESTIVE_CONDITIONS.ESOPHAGEAL_STRICTURE.symptomIds;
  const spasmSymptomIds = DIGESTIVE_CONDITIONS.ESOPHAGEAL_SPASM.symptomIds;
  const allSymptomIds = [...strictureSymptomIds, ...spasmSymptomIds];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && allSymptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Esophageal Stricture/Spasm',
      diagnosticCode: '7203/7204',
      message: 'No esophageal symptoms logged in evaluation period',
    };
  }

  // Categorize stricture symptoms
  const dysphagiaSolidsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-dysphagia-solids');
  const dysphagiaLiquidsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-dysphagia-liquids');
  const dysphagiaPillsLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-dysphagia-pills');
  const foodImpactionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-food-impaction');
  const regurgitationLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'es-regurgitation' || getLogSymptomId(log) === 'esp-regurgitation'
  );
  const aspirationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-aspiration');
  const weightLossLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'es-weight-loss' || getLogSymptomId(log) === 'esp-weight-loss'
  );
  const undernutritionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-undernutrition');
  const dilatationLogs = relevantLogs.filter(log =>
      getLogSymptomId(log) === 'es-dilatation' || getLogSymptomId(log) === 'es-dilatation-steroids'
  );
  const stentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-stent');
  const pegTubeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-peg-tube');
  const dailyMedLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-daily-medication');
  const recurrentLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-recurrent');
  const refractoryLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'es-refractory');

  // Categorize spasm symptoms
  const spasmChestPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'esp-chest-pain');
  const spasmDysphagiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'esp-dysphagia');
  const achalasiaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'esp-achalasia');

  // Calculate totals
  const totalDysphagiaLogs = dysphagiaSolidsLogs.length + dysphagiaLiquidsLogs.length +
      dysphagiaPillsLogs.length + spasmDysphagiaLogs.length;
  const hasDysphagia = totalDysphagiaLogs > 0;
  const hasAspiration = aspirationLogs.length > 0;
  const hasUndernutrition = undernutritionLogs.length > 0 || weightLossLogs.length >= 3;
  const hasPEGTube = pegTubeLogs.length > 0;
  const hasRefractory = refractoryLogs.length > 0;
  const hasRecurrent = recurrentLogs.length > 0;
  const dilatationCount = dilatationLogs.length;
  const hasDailyMedication = dailyMedLogs.length > 0;

  // Determine if this is stricture or spasm
  const isStrictureRelated = strictureSymptomIds.some(id =>
      relevantLogs.some(log => getLogSymptomId(log) === id)
  );
  const isSpasmRelated = spasmSymptomIds.some(id =>
      relevantLogs.some(log => getLogSymptomId(log) === id)
  );

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  if ((hasRefractory || hasRecurrent) && hasAspiration && hasUndernutrition && hasPEGTube) {
    supportedRating = 80;
    ratingRationale = [
      'Refractory/recurrent stricture documented',
      'Aspiration documented',
      'Undernutrition present',
      'PEG tube required',
    ];
  } else if ((hasRefractory || hasRecurrent) && hasDysphagia && hasAspiration && hasUndernutrition) {
    supportedRating = 50;
    ratingRationale = [
      'Refractory/recurrent stricture with dysphagia',
      'Aspiration documented',
      'Undernutrition present',
    ];
  } else if (dilatationCount >= 3) {
    supportedRating = 50;
    ratingRationale = [
      `${dilatationCount} dilatation procedures documented (>=3/year criteria met)`,
    ];
  } else if (hasRecurrent && hasDysphagia && dilatationCount > 0 && dilatationCount <= 2) {
    supportedRating = 30;
    ratingRationale = [
      'Recurrent stricture with dysphagia',
      `${dilatationCount} dilatation(s) documented (<=2/year)`,
    ];
  } else if (hasDysphagia && hasDailyMedication) {
    supportedRating = 10;
    ratingRationale = [
      'Dysphagia present',
      'Daily medication required for control',
    ];
  } else if (hasDysphagia || isSpasmRelated) {
    supportedRating = 10;
    ratingRationale = [
      hasDysphagia ? `Dysphagia documented (${totalDysphagiaLogs} episodes)` : 'Esophageal spasm symptoms documented',
      'Document daily medication use if applicable for confirmed 10% rating',
    ];
  }

  // Add condition type to rationale
  if (supportedRating > 0) {
    if (isStrictureRelated && isSpasmRelated) {
      ratingRationale.push('Symptoms include both stricture and motility disorder');
    } else if (isSpasmRelated && !isStrictureRelated) {
      ratingRationale.push('DC 7204 (Esophageal Spasm) rated using DC 7203 criteria');
    }
  }

  // Documentation gaps
  if (!hasRecurrent && !hasRefractory && supportedRating < 50) {
    gaps.push('Document if stricture is recurrent or refractory for higher rating consideration');
  }
  if (dilatationCount === 0 && hasDysphagia) {
    gaps.push('Document dilatation procedures if performed');
  }
  if (!hasAspiration && supportedRating >= 30) {
    gaps.push('Document aspiration episodes if occurring');
  }
  if (!hasDailyMedication && supportedRating < 30) {
    gaps.push('Document daily medication use for dysphagia if applicable');
  }
  if (aspirationLogs.length > 0) {
    gaps.push('Aspiration documented - ensure pulmonary evaluation is current');
  }

  return {
    hasData: true,
    condition: 'Esophageal Stricture/Spasm',
    diagnosticCode: '7203/7204',
    cfrReference: '38 CFR 4.114',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      totalDysphagiaLogs,
      dysphagiaSolidsLogs: dysphagiaSolidsLogs.length,
      dysphagiaLiquidsLogs: dysphagiaLiquidsLogs.length,
      foodImpactionLogs: foodImpactionLogs.length,
      aspirationLogs: aspirationLogs.length,
      weightLossLogs: weightLossLogs.length,
      undernutritionLogs: undernutritionLogs.length,
      dilatationCount,
      pegTubeLogs: pegTubeLogs.length,
      dailyMedLogs: dailyMedLogs.length,
      recurrentLogs: recurrentLogs.length,
      refractoryLogs: refractoryLogs.length,
      spasmChestPainLogs: spasmChestPainLogs.length,
      achalasiaLogs: achalasiaLogs.length,
      isStrictureRelated,
      isSpasmRelated,
    },
    criteria: ESOPHAGEAL_STRICTURE_CRITERIA,
  };
};

// ============================================
// PHASE 5B: POSTGASTRECTOMY SYNDROME ANALYSIS (DC 7308)
// Rated as DC 7303 (Chronic Complications of Upper GI Surgery)
// ============================================

/**
 * Analyze Postgastrectomy Syndrome symptom logs against VA rating criteria
 * DC 7308 - Rated using DC 7303 criteria
 */

export const analyzePostgastrectomyLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = DIGESTIVE_CONDITIONS.POSTGASTRECTOMY.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Postgastrectomy Syndrome',
      diagnosticCode: '7308',
      message: 'No postgastrectomy symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms
  const dumpingEarlyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-dumping-early');
  const dumpingLateLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-dumping-late');
  const nauseaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-nausea');
  const vomitingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-vomiting');
  const vomitingDailyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-vomiting-daily');
  const diarrheaLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-diarrhea');
  const diarrheaExplosiveLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-diarrhea-explosive');
  const syncopeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-syncope');
  const sweatingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-sweating');
  const abdominalPainLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-abdominal-pain');
  const dietaryModLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-dietary-modification');
  const medicationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-medication');
  const tpnLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-tpn');
  const tubeFeedingLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-tube-feeding');
  const weightLossLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'pgs-weight-loss');

  // Determine key indicators
  const hasTPN = tpnLogs.length > 0;
  const hasTubeFeeding = tubeFeedingLogs.length > 0;
  const hasDailyVomiting = vomitingDailyLogs.length > 0 || vomitingLogs.length >= 20; // Approximate daily
  const hasExplosiveDiarrhea = diarrheaExplosiveLogs.length > 0;
  const hasFrequentWateryBMs = diarrheaLogs.length >= 15; // Approximating 6+/day frequency
  const hasSyncopeWithSweating = syncopeLogs.length > 0 && sweatingLogs.length > 0;
  const hasMedication = medicationLogs.length > 0;
  const hasDietaryModification = dietaryModLogs.length > 0;
  const hasDumpingSyndrome = dumpingEarlyLogs.length > 0 || dumpingLateLogs.length > 0;

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria (DC 7303)
  if (hasTPN || hasTubeFeeding) {
    supportedRating = 80;
    ratingRationale = [
      hasTPN ? 'Total parenteral nutrition (TPN) required' : 'Tube feeding required',
      'Note: VA requires 30+ consecutive days during 12-month period',
    ];
  } else if (hasDailyVomiting) {
    supportedRating = 50;
    ratingRationale = [
      'Daily vomiting despite dietary modification',
      `${vomitingLogs.length + vomitingDailyLogs.length} vomiting episodes documented`,
    ];
  } else if (hasFrequentWateryBMs || hasExplosiveDiarrhea) {
    supportedRating = 50;
    ratingRationale = hasExplosiveDiarrhea
        ? ['Explosive, unpredictable bowel movements documented']
        : [`Frequent watery bowel movements (${diarrheaLogs.length} episodes documented)`];
  } else if (hasSyncopeWithSweating) {
    supportedRating = 30;
    ratingRationale = [
      'Post-prandial syncope/lightheadedness documented',
      'Associated sweating episodes documented',
    ];
  } else if (hasMedication && hasDumpingSyndrome) {
    supportedRating = 30;
    ratingRationale = [
      'Dumping syndrome documented',
      'Medication required for control',
    ];
  } else if (hasDietaryModification && (hasDumpingSyndrome || nauseaLogs.length > 0 || diarrheaLogs.length > 0)) {
    supportedRating = 10;
    ratingRationale = [
      'Chronic symptoms present',
      'Controlled with dietary modification',
    ];
  } else if (hasDumpingSyndrome || nauseaLogs.length > 0 || vomitingLogs.length > 0) {
    supportedRating = 10;
    ratingRationale = [
      'Postgastrectomy symptoms documented',
      'Document dietary modification plan for confirmed rating',
    ];
  }

  // Documentation gaps
  if (!hasDietaryModification && supportedRating <= 30) {
    gaps.push('Document medically-directed dietary modification if in use');
  }
  if (!hasMedication && hasDumpingSyndrome && supportedRating < 50) {
    gaps.push('Document medication use for dumping syndrome if applicable');
  }
  if (hasTPN || hasTubeFeeding) {
    gaps.push('Document 30+ consecutive days of TPN/tube feeding for 80% rating confirmation');
  }
  if (syncopeLogs.length > 0 && sweatingLogs.length === 0) {
    gaps.push('Document sweating with syncope episodes for 30% rating');
  }
  if (diarrheaLogs.length > 0 && !hasExplosiveDiarrhea) {
    gaps.push('Document if bowel movements are explosive/unpredictable for higher rating');
  }

  return {
    hasData: true,
    condition: 'Postgastrectomy Syndrome',
    diagnosticCode: '7308',
    cfrReference: '38 CFR 4.114 (rated as DC 7303)',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      dumpingEarlyLogs: dumpingEarlyLogs.length,
      dumpingLateLogs: dumpingLateLogs.length,
      nauseaLogs: nauseaLogs.length,
      vomitingLogs: vomitingLogs.length,
      vomitingDailyLogs: vomitingDailyLogs.length,
      diarrheaLogs: diarrheaLogs.length,
      diarrheaExplosiveLogs: diarrheaExplosiveLogs.length,
      syncopeLogs: syncopeLogs.length,
      sweatingLogs: sweatingLogs.length,
      abdominalPainLogs: abdominalPainLogs.length,
      dietaryModLogs: dietaryModLogs.length,
      medicationLogs: medicationLogs.length,
      tpnLogs: tpnLogs.length,
      tubeFeedingLogs: tubeFeedingLogs.length,
      weightLossLogs: weightLossLogs.length,
    },
    criteria: POSTGASTRECTOMY_CRITERIA,
  };
};

// ============================================
// PHASE 5B: INTESTINAL FISTULA ANALYSIS (DC 7330)
// ============================================

/**
 * Analyze Intestinal Fistula symptom logs against VA rating criteria
 * DC 7330 - Rated by TPN needs, drainage amount, BMI, and duration
 */

export const analyzeIntestinalFistulaLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.days || 365;
  const symptomIds = DIGESTIVE_CONDITIONS.INTESTINAL_FISTULA.symptomIds;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const symptomId = getLogSymptomId(log);
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Intestinal Fistula',
      diagnosticCode: '7330',
      message: 'No intestinal fistula symptoms logged in evaluation period',
    };
  }

  // Categorize symptoms
  const drainageMinimalLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-drainage-minimal');
  const drainageModerateLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-drainage-moderate');
  const drainageHeavyLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-drainage-heavy');
  const fecalDischargeLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-fecal-discharge');
  const persistentDrainageLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-persistent-drainage');
  const skinIrritationLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-skin-irritation');
  const infectionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-infection');
  const painLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-pain');
  const enteralNutritionLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-enteral-nutrition');
  const tpnLogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-tpn');
  const lowBMILogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-low-bmi');
  const veryLowBMILogs = relevantLogs.filter(log => getLogSymptomId(log) === 'if-very-low-bmi');

  const causeLogs = relevantLogs.filter(log =>
      ['if-post-surgical', 'if-post-radiation', 'if-post-trauma'].includes(getLogSymptomId(log))
  );

  // Determine key indicators
  const hasTPN = tpnLogs.length > 0;
  const hasEnteralNutrition = enteralNutritionLogs.length > 0;
  const hasHeavyDrainage = drainageHeavyLogs.length > 0;
  const hasModerateDrainage = drainageModerateLogs.length > 0;
  const hasMinimalDrainage = drainageMinimalLogs.length > 0;
  const hasVeryLowBMI = veryLowBMILogs.length > 0; // BMI < 16
  const hasLowBMI = lowBMILogs.length > 0; // BMI 16-18
  const hasPersistentDrainage = persistentDrainageLogs.length > 0;

  // Estimate drainage duration based on log frequency
  const drainageDurationMonths = persistentDrainageLogs.length >= 3 ? '3+' :
      persistentDrainageLogs.length >= 1 ? '1-3' : '<1';

  let supportedRating = 0;
  let ratingRationale = [];
  const gaps = [];

  // Determine rating based on VA criteria
  if (hasTPN) {
    supportedRating = 100;
    ratingRationale = [
      'Total parenteral nutrition (TPN) required for fistula-related symptoms',
    ];
  } else if (hasEnteralNutrition) {
    supportedRating = 60;
    ratingRationale = [
      'Enteral nutrition required for fistula-related symptoms',
    ];
  } else if (hasHeavyDrainage && hasVeryLowBMI) {
    supportedRating = 60;
    ratingRationale = [
      'Heavy drainage documented (3+ bags or 10+ pads/day)',
      'BMI < 16 documented',
    ];
  } else if (hasHeavyDrainage && drainageDurationMonths === '3+') {
    supportedRating = 60;
    ratingRationale = [
      'Heavy drainage documented (3+ bags or 10+ pads/day)',
      'Drainage persisting 3+ months',
    ];
  } else if (hasHeavyDrainage && hasLowBMI) {
    supportedRating = 30;
    ratingRationale = [
      'Heavy drainage documented (3+ bags or 10+ pads/day)',
      'BMI 16-18 documented',
    ];
  } else if (hasHeavyDrainage && (drainageDurationMonths === '1-3')) {
    supportedRating = 30;
    ratingRationale = [
      'Heavy drainage documented (3+ bags or 10+ pads/day)',
      'Drainage persisting 1-3 months',
    ];
  } else if ((hasModerateDrainage || hasMinimalDrainage) && hasVeryLowBMI) {
    supportedRating = 30;
    ratingRationale = [
      'Fistula drainage documented',
      'BMI < 16 documented',
    ];
  } else if (hasModerateDrainage || hasMinimalDrainage || fecalDischargeLogs.length > 0) {
    // Has fistula symptoms but doesn't meet higher criteria
    supportedRating = 30;
    ratingRationale = [
      'Intestinal fistula with drainage documented',
      'Document drainage volume and BMI for accurate rating',
    ];
  }

  // Add cause to rationale if documented
  if (causeLogs.length > 0 && supportedRating > 0) {
    const causes = [];
    if (relevantLogs.some(log => getLogSymptomId(log) === 'if-post-surgical')) causes.push('post-surgical');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'if-post-radiation')) causes.push('post-radiation');
    if (relevantLogs.some(log => getLogSymptomId(log) === 'if-post-trauma')) causes.push('post-trauma');
    ratingRationale.push(`Fistula cause: ${causes.join(', ')}`);
  }

  // Documentation gaps
  if (!hasHeavyDrainage && !hasModerateDrainage && !hasMinimalDrainage) {
    gaps.push('Document drainage amount (bags/day or pad changes) for accurate rating');
  }
  if (!hasVeryLowBMI && !hasLowBMI) {
    gaps.push('Document BMI if below 18 - affects rating level');
  }
  if (!hasPersistentDrainage && supportedRating < 60) {
    gaps.push('Document drainage duration (1-3 months vs 3+ months)');
  }
  if (causeLogs.length === 0) {
    gaps.push('Document fistula cause (surgical, radiation, trauma)');
  }
  if (infectionLogs.length > 0) {
    gaps.push('Infection documented - ensure appropriate medical follow-up');
  }

  return {
    hasData: true,
    condition: 'Intestinal Fistula',
    diagnosticCode: '7330',
    cfrReference: '38 CFR 4.114',
    evaluationPeriodDays,
    supportedRating,
    ratingRationale,
    gaps,
    metrics: {
      totalLogs: relevantLogs.length,
      drainageMinimalLogs: drainageMinimalLogs.length,
      drainageModerateLogs: drainageModerateLogs.length,
      drainageHeavyLogs: drainageHeavyLogs.length,
      fecalDischargeLogs: fecalDischargeLogs.length,
      persistentDrainageLogs: persistentDrainageLogs.length,
      skinIrritationLogs: skinIrritationLogs.length,
      infectionLogs: infectionLogs.length,
      painLogs: painLogs.length,
      enteralNutritionLogs: enteralNutritionLogs.length,
      tpnLogs: tpnLogs.length,
      lowBMILogs: lowBMILogs.length,
      veryLowBMILogs: veryLowBMILogs.length,
      drainageDurationMonths,
    },
    criteria: INTESTINAL_FISTULA_CRITERIA,
  };
};

// ============================================
// ANALYSIS FUNCTIONS - ACNE (DC 7828)
// Phase 6A - Rated by depth and extent of involvement
// ============================================

/**
 * Analyze Acne symptom logs against VA rating criteria
 * DC 7828 - Rated based on deep vs superficial acne and extent
 */

export const analyzeEsophagealSpasmLogs = (logs, _options = {}) => {
  const symptomIds = [
    'dysphagia', 'chest-pain-swallowing', 'esophageal-spasm',
    'difficulty-swallowing', 'food-sticking'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('esophag') ||
        log.notes?.toLowerCase().includes('swallow');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Esophageal Spasm',
      diagnosticCode: '7204',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for severity indicators
  const liquidOnlyDiet = validLogs.some(log =>
      log.notes?.toLowerCase().includes('liquid only') ||
      log.notes?.toLowerCase().includes('liquids only') ||
      log.notes?.toLowerCase().includes('cannot eat solid')
  );

  const severeHealthImpact = validLogs.some(log =>
      log.notes?.toLowerCase().includes('weight loss') ||
      log.notes?.toLowerCase().includes('malnutrition') ||
      log.notes?.toLowerCase().includes('marked impairment')
  );

  const moderateDysphagia = validLogs.some(log =>
      log.severity === 'severe' ||
      log.notes?.toLowerCase().includes('modified diet') ||
      log.notes?.toLowerCase().includes('soft food')
  );

  let supportedRating = 0;
  let rationale = '';

  if (liquidOnlyDiet && severeHealthImpact) {
    supportedRating = 80;
    rationale = 'Evidence suggests liquid-only diet with marked health impairment.';
  } else if (liquidOnlyDiet) {
    supportedRating = 50;
    rationale = 'Evidence suggests severe dysphagia allowing only liquids.';
  } else if (moderateDysphagia) {
    supportedRating = 30;
    rationale = 'Evidence suggests moderate dysphagia with dietary modifications.';
  } else if (validLogs.length > 0) {
    supportedRating = 10;
    rationale = 'Evidence suggests mild/intermittent symptoms.';
  }

  return {
    condition: 'Esophageal Spasm',
    diagnosticCode: '7204',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: ESOPHAGEAL_SPASM_CRITERIA,
    recommendations: [
      'Document dysphagia episodes with severity',
      'Track dietary restrictions (liquid vs soft vs regular)',
      'Record weight changes',
      'Get esophageal manometry results',
    ],
  };
};

/**
 * Analyzes Rectal Prolapse logs (DC 7334)
 */

export const analyzeSphincterControlLogs = (logs, options = {}) => {
  const evaluationPeriodDays = options.evaluationPeriodDays || 365;
  const symptomIds = [
    'sphincter-complete-loss', 'sphincter-frequent-loss', 'sphincter-occasional-loss', 'sphincter-rare-loss',
    'sphincter-incontinence-solids', 'sphincter-incontinence-liquids', 'sphincter-incontinence-gas',
    'sphincter-daily-episodes', 'sphincter-weekly-episodes', 'sphincter-monthly-episodes',
    'sphincter-pad-use-daily', 'sphincter-pad-use-weekly', 'sphincter-pad-use-monthly',
    'sphincter-bowel-program', 'sphincter-digital-stimulation', 'sphincter-medication',
    'sphincter-special-diet', 'sphincter-surgery-needed',
    'sphincter-retention', 'sphincter-constipation-severe',
    'sphincter-social-limitation', 'sphincter-work-limitation', 'sphincter-hygiene-issues',
  ];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - evaluationPeriodDays);

  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp || log.occurredAt);
    const symptomId = log.symptomId || log.symptom;
    return logDate >= cutoffDate && symptomId && symptomIds.includes(symptomId);
  });

  if (relevantLogs.length === 0) {
    return {
      hasData: false,
      condition: 'Sphincter Control Impairment',
      diagnosticCode: '7332',
      message: 'No sphincter control symptoms logged',
      criteria: SPHINCTER_CONTROL_CRITERIA,
    };
  }

  // Categorize symptoms
  const completeLoss = relevantLogs.some(log => log.symptomId === 'sphincter-complete-loss');
  const frequentLoss = relevantLogs.some(log => log.symptomId === 'sphincter-frequent-loss');
  const occasionalLoss = relevantLogs.some(log => log.symptomId === 'sphincter-occasional-loss');

  const dailyEpisodes = relevantLogs.filter(log => log.symptomId === 'sphincter-daily-episodes');
  const weeklyEpisodes = relevantLogs.filter(log => log.symptomId === 'sphincter-weekly-episodes');
  const monthlyEpisodes = relevantLogs.filter(log => log.symptomId === 'sphincter-monthly-episodes');

  const padDaily = relevantLogs.some(log => log.symptomId === 'sphincter-pad-use-daily');
  const padWeekly = relevantLogs.some(log => log.symptomId === 'sphincter-pad-use-weekly');
  const padMonthly = relevantLogs.some(log => log.symptomId === 'sphincter-pad-use-monthly');

  const onBowelProgram = relevantLogs.some(log => log.symptomId === 'sphincter-bowel-program');
  const digitalStim = relevantLogs.some(log => log.symptomId === 'sphincter-digital-stimulation');
  const medication = relevantLogs.some(log => log.symptomId === 'sphincter-medication');
  const specialDiet = relevantLogs.some(log => log.symptomId === 'sphincter-special-diet');
  const surgeryNeeded = relevantLogs.some(log => log.symptomId === 'sphincter-surgery-needed');

  let supportedRating = 0;
  let rationale = [];
  let evidenceGaps = [];

  // 100%: Daily episodes with daily pad changes OR complete loss not responsive to bowel program
  if ((dailyEpisodes.length > 0 && padDaily) || (completeLoss && !onBowelProgram)) {
    supportedRating = 100;
    if (dailyEpisodes.length > 0 && padDaily) {
      rationale.push('Daily incontinence episodes requiring pad changes 2+ times per day');
    }
    if (completeLoss) {
      rationale.push('Complete loss of sphincter control documented');
      if (!onBowelProgram) rationale.push('Not responsive to bowel program');
    }
    if (surgeryNeeded) rationale.push('Surgical intervention recommended');
  }
  // 60%: Weekly episodes OR partially responsive to bowel program
  else if (weeklyEpisodes.length > 0 || (frequentLoss && padWeekly)) {
    supportedRating = 60;
    if (weeklyEpisodes.length > 0) {
      rationale.push('Incontinence episodes 2+ times per week');
    }
    if (padWeekly) rationale.push('Pad use required 2+ times per week');
    if (onBowelProgram) rationale.push('On physician-prescribed bowel program');
  }
  // 30%: Monthly episodes OR fully responsive with digital stim + med + diet
  else if (monthlyEpisodes.length > 0 || (onBowelProgram && digitalStim && medication && specialDiet)) {
    supportedRating = 30;
    if (monthlyEpisodes.length > 0) {
      rationale.push('Incontinence episodes 2+ times per month');
    }
    if (padMonthly) rationale.push('Pad use required 2+ times per month');
    if (digitalStim && medication && specialDiet) {
      rationale.push('Requires digital stimulation, medication, AND special diet');
    }
  }
  // 10%: Rare episodes OR fully responsive with med OR diet
  else if (occasionalLoss || medication || specialDiet) {
    supportedRating = 10;
    if (occasionalLoss) rationale.push('Occasional sphincter control issues');
    if (medication) rationale.push('Requires medication for bowel control');
    if (specialDiet) rationale.push('Requires special diet for bowel control');
  }

  // Evidence gaps
  if (!onBowelProgram && supportedRating > 0) {
    evidenceGaps.push('Document physician-prescribed bowel program if following one');
  }
  if (dailyEpisodes.length === 0 && weeklyEpisodes.length === 0 && monthlyEpisodes.length === 0) {
    evidenceGaps.push('Log incontinence episodes with frequency (daily/weekly/monthly)');
  }
  if (!padDaily && !padWeekly && !padMonthly) {
    evidenceGaps.push('Document pad usage frequency if applicable');
  }

  return {
    hasData: true,
    condition: 'Sphincter Control Impairment',
    diagnosticCode: '7332',
    cfrReference: '38 CFR 4.114',
    supportedRating,
    rationale,
    evidenceGaps,
    metrics: {
      totalLogs: relevantLogs.length,
      dailyEpisodes: dailyEpisodes.length,
      weeklyEpisodes: weeklyEpisodes.length,
      monthlyEpisodes: monthlyEpisodes.length,
      onBowelProgram,
      requiresDigitalStim: digitalStim,
      requiresMedication: medication,
      requiresSpecialDiet: specialDiet,
    },
    criteria: SPHINCTER_CONTROL_CRITERIA,
  };
};

/**
 * Analyze Hemorrhoids symptoms against VA rating criteria
 * DC 7336
 */

export const analyzeRectalProlapseLogs = (logs, _options = {}) => {
  const symptomIds = [
    'rectal-prolapse', 'rectal-protrusion', 'bowel-protrusion'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('prolapse') ||
        log.notes?.toLowerCase().includes('protrusion');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Rectal Prolapse',
      diagnosticCode: '7334',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check severity
  const severeConstantProlapse = validLogs.some(log =>
      log.notes?.toLowerCase().includes('constant') ||
      log.notes?.toLowerCase().includes('persistent') ||
      log.notes?.toLowerCase().includes('cannot reduce')
  );

  const moderateProlapse = validLogs.some(log =>
      log.notes?.toLowerCase().includes('frequent') ||
      log.severity === 'severe' ||
      log.severity === 'moderate'
  );

  let supportedRating = 0;
  let rationale = '';

  if (severeConstantProlapse) {
    supportedRating = 50;
    rationale = 'Evidence suggests severe, persistent prolapse.';
  } else if (moderateProlapse) {
    supportedRating = 30;
    rationale = 'Evidence suggests moderate prolapse requiring frequent reduction.';
  } else if (validLogs.length > 0) {
    supportedRating = 10;
    rationale = 'Evidence suggests mild/occasional prolapse.';
  }

  return {
    condition: 'Rectal Prolapse',
    diagnosticCode: '7334',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: RECTAL_PROLAPSE_CRITERIA,
    recommendations: [
      'Document frequency of prolapse episodes',
      'Note whether manual reduction is required',
      'Track any fecal incontinence (may be rated separately)',
      'Get colorectal surgery evaluation',
    ],
  };
};

/**
 * Analyzes Rectal Stricture logs (DC 7333)
 */

export const analyzeRectalStrictureLogs = (logs, _options = {}) => {
  const symptomIds = [
    'rectal-stricture', 'anal-stricture', 'bowel-obstruction',
    'difficulty-defecating', 'narrow-stool'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('stricture') ||
        log.notes?.toLowerCase().includes('narrowing');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Rectal Stricture',
      diagnosticCode: '7333',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for colostomy requirement
  const requiresColostomy = validLogs.some(log =>
      log.notes?.toLowerCase().includes('colostomy') ||
      log.notes?.toLowerCase().includes('ostomy')
  );

  const greatReduction = validLogs.some(log =>
      log.notes?.toLowerCase().includes('great reduction') ||
      log.notes?.toLowerCase().includes('severe narrowing') ||
      log.notes?.toLowerCase().includes('marked reduction')
  );

  const moderateReduction = validLogs.some(log =>
      log.notes?.toLowerCase().includes('moderate') ||
      log.severity === 'moderate' ||
      log.severity === 'severe'
  );

  let supportedRating = 0;
  let rationale = '';

  if (requiresColostomy) {
    supportedRating = 100;
    rationale = 'Stricture requiring colostomy.';
  } else if (greatReduction) {
    supportedRating = 50;
    rationale = 'Evidence suggests great reduction of lumen.';
  } else if (moderateReduction) {
    supportedRating = 30;
    rationale = 'Evidence suggests moderate reduction of lumen.';
  } else if (validLogs.length > 0) {
    supportedRating = 10;
    rationale = 'Evidence suggests mild stricture.';
  }

  return {
    condition: 'Rectal Stricture',
    diagnosticCode: '7333',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: RECTAL_STRICTURE_CRITERIA,
    recommendations: [
      'Document bowel movement difficulty',
      'Get colonoscopy/imaging showing stricture',
      'Track any dilation procedures',
      'Note impact on daily activities',
    ],
  };
};

/**
 * Analyzes Anal Fistula logs (DC 7335)
 */

export const analyzeAnalFistulaLogs = (logs, _options = {}) => {
  const symptomIds = [
    'anal-fistula', 'perianal-fistula', 'fistula-drainage',
    'perianal-abscess', 'anal-abscess'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('fistula') ||
        log.notes?.toLowerCase().includes('abscess');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Anal Fistula',
      diagnosticCode: '7335',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check for constant drainage
  const constantDrainage = validLogs.some(log =>
      log.notes?.toLowerCase().includes('constant') ||
      log.notes?.toLowerCase().includes('continuous') ||
      log.notes?.toLowerCase().includes('persistent drainage')
  );

  const frequentDrainage = validLogs.some(log =>
      log.notes?.toLowerCase().includes('frequent') ||
      log.severity === 'severe' ||
      log.severity === 'moderate'
  );

  let supportedRating = 0;
  let rationale = '';

  if (constantDrainage) {
    supportedRating = 30;
    rationale = 'Evidence suggests constant or frequently recurring fistula with drainage.';
  } else if (frequentDrainage) {
    supportedRating = 10;
    rationale = 'Evidence suggests occasional fistula symptoms.';
  } else if (validLogs.length > 0) {
    supportedRating = 0;
    rationale = 'Healed or minimal symptoms documented.';
  }

  return {
    condition: 'Anal Fistula',
    diagnosticCode: '7335',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: ANAL_FISTULA_CRITERIA,
    recommendations: [
      'Document drainage frequency and amount',
      'Track any surgical repairs',
      'Note recurrence after treatment',
      'Get colorectal surgery evaluation',
    ],
  };
};

/**
 * Analyzes Pruritus Ani logs (DC 7337)
 */

export const analyzePruritusAniLogs = (logs, _options = {}) => {
  const symptomIds = [
    'pruritus-ani', 'anal-itching', 'perianal-itching', 'rectal-itching'
  ];

  const validLogs = logs.filter(log => {
    const symptomId = log.symptomId || log.symptom;
    return symptomIds.includes(symptomId) ||
        log.notes?.toLowerCase().includes('anal itch') ||
        log.notes?.toLowerCase().includes('rectal itch');
  });

  if (validLogs.length === 0) {
    return {
      condition: 'Pruritus Ani',
      diagnosticCode: '7337',
      supportedRating: 0,
      rationale: 'No relevant symptoms logged.',
      evidenceStrength: 'none',
      recommendations: ['Log symptoms when they occur to build evidence.'],
    };
  }

  // Check severity - max rating is 10%
  const persistentSymptoms = validLogs.length >= 5 || validLogs.some(log =>
      log.notes?.toLowerCase().includes('persistent') ||
      log.notes?.toLowerCase().includes('constant') ||
      log.severity === 'severe' ||
      log.severity === 'moderate'
  );

  let supportedRating = 0;
  let rationale = '';

  if (persistentSymptoms) {
    supportedRating = 10;
    rationale = 'Evidence suggests persistent pruritus ani symptoms.';
  } else {
    supportedRating = 0;
    rationale = 'Mild or infrequent symptoms documented.';
  }

  return {
    condition: 'Pruritus Ani',
    diagnosticCode: '7337',
    supportedRating,
    rationale,
    totalLogs: validLogs.length,
    evidenceStrength: validLogs.length >= 10 ? 'strong' : validLogs.length >= 5 ? 'moderate' : 'developing',
    criteriaReference: PRURITUS_ANI_CRITERIA,
    recommendations: [
      'Document frequency and severity of itching',
      'Note any treatments used',
      'Track impact on sleep and daily activities',
    ],
    note: 'Maximum rating for pruritus ani is 10%.',
  };
};