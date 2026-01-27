import React, { useState, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';

// ============================================
// PRESUMPTIVE CONDITIONS DATA
// Based on 38 CFR and PACT Act (2022)
// ============================================

const PRESUMPTIVE_DATA = {
  // ============================================
  // VIETNAM ERA - Agent Orange
  // ============================================
  vietnam: {
    id: 'vietnam',
    name: 'Vietnam Era - Agent Orange',
    icon: '🌿',
    color: 'green',
    dateRange: 'January 9, 1962 - May 7, 1975',
    description: 'Veterans who served in Vietnam, Thailand, Korea DMZ, or other locations where herbicides were used.',
    serviceLocations: [
      'Republic of Vietnam (including inland waterways)',
      'Thailand (U.S. military bases)',
      'Korean DMZ (April 1, 1968 - August 31, 1971)',
      'Johnston Atoll',
      'Laos',
      'Cambodia',
      'Guam',
      'American Samoa',
      'Former test/storage locations',
    ],
    exposureTypes: ['Agent Orange', 'Herbicide Agents', 'Dioxin'],

    conditions: {
      anyTime: {
        title: 'Conditions (may manifest at any time)',
        items: [
          { name: 'AL Amyloidosis', dc: 'Various' },
          { name: 'Bladder Cancer', dc: '7528' },
          { name: 'Chronic B-cell Leukemias', dc: '7703' },
          { name: 'Chloracne', dc: '7829', note: 'Must manifest within 1 year' },
          { name: 'Diabetes Mellitus Type 2', dc: '7913' },
          { name: 'High Blood Pressure (Hypertension)', dc: '7101', note: 'Added 2022' },
          { name: 'Hodgkin\'s Disease', dc: '7709' },
          { name: 'Hypothyroidism', dc: '7903', note: 'Added 2022' },
          { name: 'Ischemic Heart Disease', dc: '7005-7020' },
          { name: 'Monoclonal Gammopathy (MGUS)', dc: 'Various', note: 'Added 2022' },
          { name: 'Multiple Myeloma', dc: '7709' },
          { name: 'Non-Hodgkin\'s Lymphoma', dc: '7715' },
          { name: 'Parkinson\'s Disease', dc: '8004' },
          { name: 'Parkinsonism', dc: '8004', note: 'Added 2022' },
          { name: 'Peripheral Neuropathy (Early-Onset)', dc: '8520-8730', note: 'Must manifest within 1 year' },
          { name: 'Porphyria Cutanea Tarda', dc: '7815', note: 'Must manifest within 1 year' },
          { name: 'Prostate Cancer', dc: '7528' },
          { name: 'Respiratory Cancers (Lung, Bronchus, Larynx, Trachea)', dc: '6819-6820' },
          { name: 'Soft Tissue Sarcomas', dc: 'Various' },
        ],
      },
      withinOneYear: {
        title: 'Conditions (must manifest within 1 year of exposure)',
        items: [
          { name: 'Acute/Subacute Peripheral Neuropathy', dc: '8520-8730' },
          { name: 'Chloracne', dc: '7829' },
          { name: 'Porphyria Cutanea Tarda', dc: '7815' },
        ],
      },
    },

    proofRequired: 'Service records showing presence in qualifying location during qualifying period. VA presumes exposure for those who served in-country.',

    importantNotes: [
      'Blue Water Navy Veterans - PACT Act extended presumption to veterans who served offshore',
      'No minimum service duration required',
      'Conditions may appear decades after exposure',
      'Children of exposed veterans may be eligible for birth defect benefits',
    ],
  },

  // ============================================
  // GULF WAR ERA
  // ============================================
  gulfWar: {
    id: 'gulfWar',
    name: 'Gulf War Era',
    icon: '🏜️',
    color: 'amber',
    dateRange: 'August 2, 1990 - Present',
    description: 'Veterans who served in Southwest Asia and other qualifying locations during Gulf War Era.',
    serviceLocations: [
      'Iraq',
      'Kuwait',
      'Saudi Arabia',
      'Bahrain',
      'Qatar',
      'United Arab Emirates',
      'Oman',
      'Gulf of Aden',
      'Gulf of Oman',
      'Persian Gulf',
      'Arabian Sea',
      'Red Sea',
      'Afghanistan',
      'Israel',
      'Egypt',
      'Turkey',
      'Syria',
      'Jordan',
      'Djibouti',
      'Uzbekistan',
      'Yemen',
      'Lebanon',
      'Somalia',
    ],
    exposureTypes: ['Oil Well Fires', 'Burn Pits', 'Chemical Agents', 'Depleted Uranium', 'Infectious Diseases'],

    conditions: {
      chronicMultiSymptom: {
        title: 'Chronic Multi-Symptom Illness (MUCMI)',
        description: 'Medically unexplained chronic multi-symptom illness diagnosed conditions:',
        items: [
          { name: 'Chronic Fatigue Syndrome', dc: '6354' },
          { name: 'Fibromyalgia', dc: '5025' },
          { name: 'Functional Gastrointestinal Disorders', dc: '7319' },
          { name: 'IBS (Irritable Bowel Syndrome)', dc: '7319' },
          { name: 'Functional Dyspepsia', dc: '7399-7346' },
        ],
      },
      pactActRespiratory: {
        title: 'PACT Act Respiratory Conditions (2022)',
        description: 'Presumptive for burn pit exposure:',
        items: [
          { name: 'Asthma', dc: '6602', note: 'Diagnosed during or within 10 years of separation' },
          { name: 'Head Cancer (any type)', dc: 'Various' },
          { name: 'Neck Cancer (any type)', dc: 'Various' },
          { name: 'Respiratory Cancer (any type)', dc: '6819' },
          { name: 'Gastrointestinal Cancer (any type)', dc: 'Various' },
          { name: 'Reproductive Cancer (any type)', dc: 'Various' },
          { name: 'Lymphoma (any type)', dc: '7715' },
          { name: 'Lymphomatic Cancer (any type)', dc: 'Various' },
          { name: 'Kidney Cancer', dc: '7528' },
          { name: 'Brain Cancer', dc: 'Various' },
          { name: 'Melanoma', dc: '7833' },
          { name: 'Pancreatic Cancer', dc: 'Various' },
          { name: 'Chronic Bronchitis', dc: '6600' },
          { name: 'COPD', dc: '6604' },
          { name: 'Constrictive Bronchiolitis', dc: '6600' },
          { name: 'Emphysema', dc: '6603' },
          { name: 'Granulomatous Disease', dc: 'Various' },
          { name: 'Interstitial Lung Disease', dc: '6825' },
          { name: 'Pleuritis', dc: '6845' },
          { name: 'Pulmonary Fibrosis', dc: '6825' },
          { name: 'Sarcoidosis', dc: '6846' },
          { name: 'Chronic Rhinitis', dc: '6522' },
          { name: 'Chronic Sinusitis', dc: '6510-6514' },
          { name: 'Glioblastoma', dc: 'Various' },
          { name: 'Sleep Apnea', dc: '6847' },
        ],
      },
      infectiousDiseases: {
        title: 'Infectious Diseases (within 1 year of service)',
        items: [
          { name: 'Brucellosis', dc: '6314' },
          { name: 'Campylobacter jejuni', dc: '7399' },
          { name: 'Coxiella burnetii (Q Fever)', dc: '6314' },
          { name: 'Malaria', dc: '6304' },
          { name: 'Mycobacterium Tuberculosis', dc: '6310-6314' },
          { name: 'Nontyphoid Salmonella', dc: '7399' },
          { name: 'Shigella', dc: '7399' },
          { name: 'Visceral Leishmaniasis', dc: '6301' },
          { name: 'West Nile Virus', dc: '8099' },
        ],
      },
    },

    proofRequired: 'Service records showing deployment to qualifying location. For burn pit exposure claims, enrollment in Airborne Hazards and Open Burn Pit Registry is helpful but not required.',

    importantNotes: [
      'PACT Act (2022) significantly expanded presumptive conditions',
      'Toxic exposure screening now offered to all post-9/11 veterans',
      'No minimum deployment duration required for burn pit presumptives',
      'Undiagnosed illnesses with 10%+ disability may qualify',
    ],
  },

  // ============================================
  // CAMP LEJEUNE
  // ============================================
  campLejeune: {
    id: 'campLejeune',
    name: 'Camp Lejeune Water Contamination',
    icon: '💧',
    color: 'blue',
    dateRange: 'August 1, 1953 - December 31, 1987',
    description: 'Veterans and family members who resided at Camp Lejeune or MCAS New River for at least 30 days.',
    serviceLocations: [
      'Marine Corps Base Camp Lejeune, NC',
      'MCAS New River, NC',
    ],
    exposureTypes: ['Contaminated Water', 'TCE', 'PCE', 'Benzene', 'Vinyl Chloride'],

    conditions: {
      presumptive: {
        title: 'Presumptive Conditions (30+ days exposure)',
        items: [
          { name: 'Adult Leukemia', dc: '7703' },
          { name: 'Aplastic Anemia and Other Myelodysplastic Syndromes', dc: '7700' },
          { name: 'Bladder Cancer', dc: '7528' },
          { name: 'Kidney Cancer', dc: '7528' },
          { name: 'Liver Cancer', dc: '7312' },
          { name: 'Multiple Myeloma', dc: '7709' },
          { name: 'Non-Hodgkin\'s Lymphoma', dc: '7715' },
          { name: 'Parkinson\'s Disease', dc: '8004' },
        ],
      },
      sufficiently: {
        title: 'Conditions with Sufficient Evidence',
        description: 'Additional conditions where evidence supports connection:',
        items: [
          { name: 'Esophageal Cancer', dc: 'Various' },
          { name: 'Breast Cancer', dc: '7627' },
          { name: 'Lung Cancer', dc: '6819' },
          { name: 'Renal Toxicity', dc: '7502' },
          { name: 'Female Infertility', dc: '7699' },
          { name: 'Scleroderma', dc: '7810' },
          { name: 'Neurobehavioral Effects', dc: '8099' },
          { name: 'Miscarriage', dc: 'N/A' },
          { name: 'Hepatic Steatosis', dc: '7312' },
        ],
      },
    },

    proofRequired: 'Service records or other evidence showing residence at Camp Lejeune/MCAS New River for 30+ cumulative days during qualifying period.',

    importantNotes: [
      'Family members who lived on base are also eligible',
      'Camp Lejeune Justice Act (2022) allows civil lawsuits against government',
      'VA provides healthcare for 15+ conditions related to water contamination',
      'No filing deadline for VA disability benefits',
    ],
  },

  // ============================================
  // RADIATION EXPOSURE
  // ============================================
  radiation: {
    id: 'radiation',
    name: 'Radiation Exposure',
    icon: '☢️',
    color: 'yellow',
    dateRange: 'Various - depends on exposure type',
    description: 'Veterans exposed to ionizing radiation during military service.',
    serviceLocations: [
      'Hiroshima/Nagasaki occupation (WWII)',
      'Atmospheric nuclear testing sites',
      'Underground nuclear testing sites',
      'Nuclear submarine/vessel service',
      'Enewetak Atoll cleanup',
      'Nuclear weapons production facilities',
    ],
    exposureTypes: ['Ionizing Radiation', 'Nuclear Testing Fallout', 'Nuclear Weapons'],

    conditions: {
      presumptive: {
        title: 'Presumptive Radiogenic Cancers',
        description: 'Cancers presumed service-connected for radiation-exposed veterans:',
        items: [
          { name: 'All Forms of Leukemia (except CLL)', dc: '7703' },
          { name: 'Thyroid Cancer', dc: '7903' },
          { name: 'Breast Cancer', dc: '7627' },
          { name: 'Pharynx Cancer', dc: 'Various' },
          { name: 'Esophagus Cancer', dc: 'Various' },
          { name: 'Stomach Cancer', dc: 'Various' },
          { name: 'Small Intestine Cancer', dc: 'Various' },
          { name: 'Pancreas Cancer', dc: 'Various' },
          { name: 'Multiple Myeloma', dc: '7709' },
          { name: 'Lymphomas (except Hodgkin\'s)', dc: '7715' },
          { name: 'Bile Duct Cancer', dc: 'Various' },
          { name: 'Gall Bladder Cancer', dc: 'Various' },
          { name: 'Primary Liver Cancer', dc: '7312' },
          { name: 'Salivary Gland Cancer', dc: 'Various' },
          { name: 'Urinary Tract Cancer', dc: '7528' },
          { name: 'Brain Cancer', dc: 'Various' },
          { name: 'Bone Cancer', dc: 'Various' },
          { name: 'Lung Cancer', dc: '6819' },
          { name: 'Colon Cancer', dc: 'Various' },
          { name: 'Ovary Cancer', dc: '7619' },
          { name: 'Bronchiolo-Alveolar Carcinoma', dc: '6819' },
        ],
      },
    },

    proofRequired: 'Service records showing participation in radiation-risk activity. Dose estimates may be obtained from Department of Defense.',

    importantNotes: [
      'Dose reconstruction may be required for non-presumptive claims',
      'Some conditions eligible if manifesting within specific timeframe',
      'Atomic Veterans (participated in nuclear tests) have special presumptions',
      'RECA (Radiation Exposure Compensation Act) provides additional benefits',
    ],
  },

  // ============================================
  // FORMER PRISONER OF WAR
  // ============================================
  fpow: {
    id: 'fpow',
    name: 'Former Prisoner of War (FPOW)',
    icon: '⛓️',
    color: 'gray',
    dateRange: 'Any war or conflict',
    description: 'Veterans who were held as prisoners of war during active military service.',
    serviceLocations: ['Any - based on POW status, not location'],
    exposureTypes: ['Captivity', 'Forced Labor', 'Malnutrition', 'Torture', 'Inadequate Medical Care'],

    conditions: {
      anyDuration: {
        title: 'Conditions (any length of captivity)',
        items: [
          { name: 'Psychosis', dc: '9201-9211' },
          { name: 'Any Anxiety State', dc: '9400-9413' },
          { name: 'Dysthymic Disorder', dc: '9433' },
          { name: 'Organic Residuals of Frostbite', dc: '7122' },
          { name: 'Post-Traumatic Osteoarthritis', dc: '5003' },
          { name: 'Heart Disease/Hypertensive Vascular Disease', dc: '7000-7020' },
          { name: 'Stroke and Residuals', dc: '8007-8009' },
          { name: 'Osteoporosis (if PTSD is diagnosed)', dc: '5013' },
        ],
      },
      thirtyDays: {
        title: 'Conditions (30+ days captivity)',
        items: [
          { name: 'Avitaminosis', dc: '6313' },
          { name: 'Beriberi (including heart disease)', dc: '6314' },
          { name: 'Chronic Dysentery', dc: '7323' },
          { name: 'Helminthiasis', dc: '6320' },
          { name: 'Malnutrition (including optic atrophy)', dc: '6314' },
          { name: 'Pellagra', dc: '6315' },
          { name: 'Any Other Nutritional Deficiency', dc: 'Various' },
          { name: 'Irritable Bowel Syndrome', dc: '7319' },
          { name: 'Peptic Ulcer Disease', dc: '7304-7306' },
          { name: 'Peripheral Neuropathy', dc: '8520-8730' },
          { name: 'Cirrhosis of the Liver', dc: '7312' },
          { name: 'Osteoporosis', dc: '5013' },
        ],
      },
    },

    proofRequired: 'Service records documenting POW status. VA verifies through military records.',

    importantNotes: [
      'No minimum service duration for POW presumptions',
      'Conditions may manifest years or decades after captivity',
      'Special Monthly Compensation may apply for severe disabilities',
      'Former POWs eligible for VA healthcare priority group',
    ],
  },

  // ============================================
  // ONE YEAR POST-DISCHARGE
  // ============================================
  oneYear: {
    id: 'oneYear',
    name: 'One Year Post-Discharge Chronic Diseases',
    icon: '📅',
    color: 'purple',
    dateRange: 'Within 1 year of honorable discharge (varies for some conditions)',
    description: 'Chronic diseases presumed service-connected if manifesting to 10%+ within one year of discharge.',
    serviceLocations: ['Any - applies to all veterans with qualifying discharge'],
    exposureTypes: ['General Military Service'],

    conditions: {
      oneYear: {
        title: 'Chronic Diseases (must manifest within 1 year at 10%+)',
        items: [
          { name: 'Anemia (Primary)', dc: '7700' },
          { name: 'Arteriosclerosis', dc: '7100' },
          { name: 'Arthritis', dc: '5003-5010' },
          { name: 'Atrophy (Progressive Muscular)', dc: '5023' },
          { name: 'Brain Hemorrhage', dc: '8007' },
          { name: 'Brain Thrombosis', dc: '8008' },
          { name: 'Bronchiectasis', dc: '6601' },
          { name: 'Calculi of Kidney/Bladder/Gallbladder', dc: '7508-7509' },
          { name: 'Cardiovascular-Renal Disease', dc: '7101' },
          { name: 'Cirrhosis of Liver', dc: '7312' },
          { name: 'Coccidioidomycosis', dc: '6836' },
          { name: 'Diabetes Mellitus', dc: '7913' },
          { name: 'Encephalitis Lethargica Residuals', dc: '8000' },
          { name: 'Endocarditis', dc: '7000' },
          { name: 'Endocrinopathies', dc: '7900-7919' },
          { name: 'Epilepsies', dc: '8910-8914' },
          { name: 'Hansen\'s Disease (Leprosy)', dc: '6315', note: '3 years' },
          { name: 'Hodgkin\'s Disease', dc: '7709' },
          { name: 'Leukemia', dc: '7703' },
          { name: 'Lupus Erythematosus (Systemic)', dc: '6350' },
          { name: 'Myasthenia Gravis', dc: '8025' },
          { name: 'Myelitis', dc: '8012' },
          { name: 'Myocarditis', dc: '7000' },
          { name: 'Nephritis', dc: '7502' },
          { name: 'Organic Diseases of Nervous System', dc: '8000-8530' },
          { name: 'Osteitis Deformans (Paget\'s Disease)', dc: '5015' },
          { name: 'Osteomalacia', dc: '5014' },
          { name: 'Palsy (Bulbar)', dc: '8023' },
          { name: 'Paralysis Agitans (Parkinson\'s)', dc: '8004' },
          { name: 'Psychoses', dc: '9201-9211' },
          { name: 'Purpura (Idiopathic/Thrombocytopenic)', dc: '7705' },
          { name: 'Raynaud\'s Disease', dc: '7117' },
          { name: 'Sarcoidosis', dc: '6846' },
          { name: 'Scleroderma', dc: '7810' },
          { name: 'Sclerosis (Amyotrophic Lateral)', dc: '8017', note: 'Any time after 90 days service' },
          { name: 'Sclerosis (Multiple)', dc: '8018', note: '7 years' },
          { name: 'Syringomyelia', dc: '8024' },
          { name: 'Thromboangiitis Obliterans (Buerger\'s)', dc: '7115' },
          { name: 'Tuberculosis (Active)', dc: '6310-6314', note: '3 years' },
          { name: 'Tumors (Malignant)', dc: 'Various' },
          { name: 'Ulcers (Peptic)', dc: '7304-7306' },
        ],
      },
      extended: {
        title: 'Extended Presumptive Periods',
        items: [
          { name: 'Hansen\'s Disease (Leprosy)', dc: '6315', note: '3 years post-discharge' },
          { name: 'Tuberculosis (Active)', dc: '6310-6314', note: '3 years post-discharge' },
          { name: 'Multiple Sclerosis', dc: '8018', note: '7 years post-discharge' },
          { name: 'ALS (Lou Gehrig\'s Disease)', dc: '8017', note: 'Any time after 90 days active service' },
        ],
      },
    },

    proofRequired: 'Medical evidence showing condition manifested to compensable degree (10%+) within presumptive period after discharge.',

    importantNotes: [
      'Must have had qualifying active service (generally 90+ days)',
      'Condition must manifest to at least 10% disabling',
      'Discharge must be under conditions other than dishonorable',
      'Some conditions have extended presumptive periods (see above)',
    ],
  },

  // ============================================
  // COVID-19
  // ============================================
  covid: {
    id: 'covid',
    name: 'COVID-19 Long-Haul Complications',
    icon: '🦠',
    color: 'teal',
    dateRange: 'March 2020 - January 2024',
    description: 'Active duty members who were on duty 48+ hours and became ill during or within 14 days of service.',
    serviceLocations: ['Any - based on active duty status during pandemic'],
    exposureTypes: ['COVID-19 Infection', 'Long COVID Complications'],

    conditions: {
      ratable: {
        title: 'Ratable Long COVID Complications',
        items: [
          { name: 'Respiratory Conditions', dc: '6600-6847' },
          { name: 'Chronic Fatigue Syndrome', dc: '6354' },
          { name: 'Mental Health Conditions (Depression/Anxiety)', dc: '9400-9440' },
          { name: 'Headaches/Migraines', dc: '8100' },
          { name: 'Joint and Muscle Pain', dc: '5003/5025' },
          { name: 'Fibromyalgia', dc: '5025' },
          { name: 'Skin Rashes', dc: '7800-7833' },
          { name: 'Loss of Smell (Anosmia)', dc: '6275', note: '6+ months duration' },
          { name: 'Loss of Taste (Ageusia)', dc: '6276', note: '6+ months duration' },
          { name: 'Cognitive Impairment (Brain Fog)', dc: '8099-9326' },
          { name: 'Heart Conditions', dc: '7000-7020' },
          { name: 'Blood Clots/Vascular Issues', dc: '7111-7121' },
        ],
      },
    },

    proofRequired: 'Service records showing active duty during qualifying period, plus medical documentation of COVID-19 infection and resulting complications.',

    importantNotes: [
      'Must document COVID-19 diagnosis during or within 14 days of active duty',
      'Long COVID symptoms must persist for documentation to support claim',
      'Loss of smell/taste must persist 6+ months for rating',
      'Mental health secondaries (depression, anxiety) are common with Long COVID',
    ],
  },
};

// ============================================
// COMPONENT
// ============================================

const PresumptiveConditionsGuide = () => {
  const { profile } = useProfile();
  const [selectedEra, setSelectedEra] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  // Only show for veteran profiles
  const isVeteran = profile?.type === 'veteran' ||
      (profile?.type === 'caregiver' && profile?.caregiverType === 'veteran-caregiver');

  if (!isVeteran) {
    return null;
  }

  // Search functionality
  const filteredConditions = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results = [];

    Object.values(PRESUMPTIVE_DATA).forEach(era => {
      Object.values(era.conditions).forEach(category => {
        category.items?.forEach(item => {
          if (item.name.toLowerCase().includes(query) ||
              item.dc?.toLowerCase().includes(query)) {
            results.push({
              ...item,
              era: era.name,
              eraId: era.id,
              eraIcon: era.icon,
              category: category.title,
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        badge: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
      },
      amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-800 dark:text-amber-200',
        badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-200',
        badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-gray-800 dark:text-gray-200',
        badge: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-800 dark:text-purple-200',
        badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
      },
      teal: {
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-800 dark:text-teal-200',
        badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300',
      },
    };
    return colors[color] || colors.gray;
  };

  // Render search results
  const renderSearchResults = () => {
    if (!filteredConditions) return null;

    if (filteredConditions.length === 0) {
      return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No presumptive conditions found matching "{searchQuery}"</p>
          </div>
      );
    }

    return (
        <div className="space-y-2 mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Found {filteredConditions.length} matching conditions:
          </p>
          {filteredConditions.map((result, idx) => (
              <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{result.eraIcon}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{result.era}</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white text-left">{result.name}</p>
                    {result.note && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 text-left">⚠️ {result.note}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                DC {result.dc}
              </span>
                </div>
              </div>
          ))}
        </div>
    );
  };

  // Render era detail view
  const renderEraDetail = (era) => {
    const colors = getColorClasses(era.color);

    return (
        <div className="space-y-6">
          {/* Back button */}
          <button
              onClick={() => setSelectedEra(null)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Eras
          </button>

          {/* Era header */}
          <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{era.icon}</span>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${colors.text}`}>{era.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{era.dateRange}</p>
                <p className="mt-3 text-gray-700 dark:text-gray-300">{era.description}</p>
              </div>
            </div>
          </div>

          {/* Service Locations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>📍</span> Qualifying Service Locations
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.serviceLocations.map((location, idx) => (
                  <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                {location}
              </span>
              ))}
            </div>
          </div>

          {/* Exposure Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>⚠️</span> Exposure Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {era.exposureTypes.map((exposure, idx) => (
                  <span
                      key={idx}
                      className={`px-3 py-1 text-sm ${colors.badge} rounded-full`}
                  >
                {exposure}
              </span>
              ))}
            </div>
          </div>

          {/* Conditions by category */}
          {Object.entries(era.conditions).map(([categoryKey, category]) => (
              <div
                  key={categoryKey}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                    onClick={() => toggleSection(`${era.id}-${categoryKey}`)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                    {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {category.items?.length || 0} conditions
                </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                            expandedSections[`${era.id}-${categoryKey}`] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedSections[`${era.id}-${categoryKey}`] && (
                    <div className="p-4 space-y-2">
                      {category.items?.map((item, idx) => (
                          <div
                              key={idx}
                              className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <div className="flex-1 text-left">
                              <p className="text-gray-900 dark:text-white text-left">{item.name}</p>
                              {item.note && (
                                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 text-left">
                                    ⚠️ {item.note}
                                  </p>
                              )}
                            </div>
                            <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded flex-shrink-0">
          DC {item.dc}
        </span>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          ))}

          {/* Proof Required */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <span>📋</span> Evidence Required
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">{era.proofRequired}</p>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4 text-left">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
              <span>💡</span> Important Notes
            </h3>
            <ul className="space-y-2">
              {era.importantNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 text-left">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                    <span>{note}</span>
                  </li>
              ))}
            </ul>
          </div>
        </div>
    );
  };

  // Main render
  return (
      <div className="max-w-4xl mx-auto p-4 pb-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">🎖️</span>
            Presumptive Conditions Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Conditions the VA presumes are service-connected based on your service era and exposures.
            These conditions have a reduced burden of proof for service connection.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Search conditions or DC codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
                <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            )}
          </div>

          {renderSearchResults()}
        </div>

        {/* Era selection or detail view */}
        {!searchQuery && (
            selectedEra ? (
                renderEraDetail(PRESUMPTIVE_DATA[selectedEra])
            ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Your Service Era</h2>

                  {Object.values(PRESUMPTIVE_DATA).map(era => {
                    const colors = getColorClasses(era.color);
                    const totalConditions = Object.values(era.conditions).reduce(
                        (sum, cat) => sum + (cat.items?.length || 0), 0
                    );

                    return (
                        <button
                            key={era.id}
                            onClick={() => setSelectedEra(era.id)}
                            className={`w-full ${colors.bg} ${colors.border} border-2 rounded-xl p-4 text-left 
                            hover:shadow-md transition-all duration-200`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{era.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={`font-bold ${colors.text}`}>{era.name}</h3>
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{era.dateRange}</p>
                              <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium ${colors.badge} rounded-full`}>
                                {totalConditions} conditions
                              </span>
                            </div>
                          </div>
                        </button>
                    );
                  })}
                </div>
            )
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">⚖️ Legal Disclaimer</p>
          <p>
            This information is for educational purposes only and is based on 38 CFR and the PACT Act (2022).
            Presumptive conditions may change as regulations are updated. Always verify current eligibility
            criteria with the VA or a Veterans Service Organization (VSO). This tool does not constitute
            legal advice or guarantee benefits approval.
          </p>
        </div>
      </div>
  );
};

export default PresumptiveConditionsGuide;