/**
 * caseLawReferences.js
 *
 * Key case law references for VA disability claims
 *
 * Sources:
 * - U.S. Court of Appeals for Veterans Claims (CAVC): https://www.uscourts.cavc.gov/opinions.php
 * - Veterans Law Library: http://www.veteranslawlibrary.com/case_law.htm
 * - Federal Circuit Court of Appeals
 *
 * Last Updated: January 2025
 */

/**
 * Landmark cases that apply broadly to VA claims
 */
export const LANDMARK_CASES = [
  {
    id: 'bufkin',
    name: 'Bufkin v. Collins',
    citation: 'Supreme Court (March 2025)',
    year: 2025,
    court: 'Supreme Court',
    category: 'general',

    holding: 'Courts generally cannot re-weigh evidence on appeal if VA determined one medical opinion was "more persuasive" than another. This limits the practical application of the benefit of the doubt doctrine.',

    significance: 'GAME CHANGER: This decision fundamentally changed how veterans must approach claims. If VA says their medical opinion is "more persuasive," courts will usually defer to that finding on appeal.',

    practicalApplication: 'Build your case STRONG from the start. Don\'t rely on "benefit of the doubt" - aim for evidence so compelling that VA cannot reasonably find against you. Get the best possible nexus letters and documentation upfront.',

    appliesTo: ['All claims'],

    keyQuote: 'The landscape has changed - veterans must build bulletproof cases from day one.',

    important: true,
    warning: true
  },

  {
    id: 'gilbert',
    name: 'Gilbert v. Derwinski',
    citation: '1 Vet. App. 49 (1990)',
    year: 1990,
    court: 'CAVC',
    category: 'general',

    holding: 'When there is an approximate balance of positive and negative evidence regarding any issue material to a claim, the benefit of the doubt shall be given to the claimant.',

    significance: 'Establishes the "benefit of the doubt" standard that applies to ALL VA claims. If evidence is roughly equal (50/50), the veteran wins.',

    practicalApplication: 'If the VA denies your claim saying the evidence is "not conclusive," remind them of Gilbert - you don\'t need to prove your case beyond doubt, just to equipoise.',

    appliesTo: ['All claims'],

    keyQuote: '"A veteran need only demonstrate that there is an approximate balance of positive and negative evidence in order to prevail."'
  },

  {
    id: 'caluza',
    name: 'Caluza v. Brown',
    citation: '7 Vet. App. 498 (1995)',
    year: 1995,
    court: 'CAVC',
    category: 'general',

    holding: 'Established the three elements required for service connection: (1) current disability, (2) in-service incurrence or aggravation, and (3) a nexus between the two.',

    significance: 'Defines the fundamental framework for proving service connection. Every direct service connection claim must address these three elements.',

    practicalApplication: 'Use this framework when preparing your claim. Ensure you have evidence addressing each of the three Caluza elements.',

    appliesTo: ['Direct service connection', 'All service connection claims'],

    keyQuote: '"Generally, to prove service connection, a claimant must submit (1) medical evidence of a current disability, (2) medical evidence, or in certain circumstances lay testimony, of in-service incurrence or aggravation of an injury or disease, and (3) medical evidence of a nexus between the current disability and the in-service disease or injury."'
  },

  {
    id: 'hickson',
    name: 'Hickson v. West',
    citation: '12 Vet. App. 247 (1999)',
    year: 1999,
    court: 'CAVC',
    category: 'general',

    holding: 'Reaffirmed and clarified the three-element test for service connection from Caluza.',

    significance: 'Provided additional clarity on what constitutes sufficient evidence for each element of service connection.',

    practicalApplication: 'Often cited alongside Caluza as the standard for service connection requirements.',

    appliesTo: ['Direct service connection']
  }
];

/**
 * Cases specific to mental health claims
 */
export const MENTAL_HEALTH_CASES = [
  {
    id: 'clemons',
    name: 'Clemons v. Shinseki',
    citation: '23 Vet. App. 1 (2009)',
    year: 2009,
    court: 'CAVC',
    category: 'mentalHealth',

    holding: 'When a veteran files a claim for a specific psychiatric disorder, the VA must consider whether the evidence supports any psychiatric disorder.',

    significance: 'Veterans don\'t need to correctly diagnose themselves. If you claim PTSD but have depression, the VA should still consider depression.',

    practicalApplication: 'If denied for one mental health condition, the VA should have considered all mental health diagnoses shown in the record.',

    appliesTo: ['PTSD', 'Depression', 'Anxiety', 'All mental health conditions'],

    keyQuote: '"A claimant does not file a claim to receive benefits only for a particular diagnosis, but for the affliction his mental condition, whatever that is, causes him."'
  },

  {
    id: 'mauerhan',
    name: 'Mauerhan v. Principi',
    citation: '16 Vet. App. 436 (2002)',
    year: 2002,
    court: 'CAVC',
    category: 'mentalHealth',

    holding: 'The symptoms listed in the rating criteria for mental disorders are examples, not an exhaustive list. A veteran does not need to demonstrate all listed symptoms to qualify for a rating.',

    significance: 'The VA cannot deny a higher rating just because you don\'t have every symptom listed. The focus should be on overall level of impairment.',

    practicalApplication: 'If denied a higher mental health rating because you "don\'t have symptom X," cite Mauerhan - the listed symptoms are examples only.',

    appliesTo: ['PTSD', 'Depression', 'Anxiety', 'All mental health conditions'],

    keyQuote: '"The use of the term \'such as\' in 38 C.F.R. § 4.130 demonstrates that the symptoms after that phrase are not intended to constitute an exhaustive list."'
  },

  {
    id: 'mittleider',
    name: 'Mittleider v. West',
    citation: '11 Vet. App. 181 (1998)',
    year: 1998,
    court: 'CAVC',
    category: 'mentalHealth',

    holding: 'When it is not possible to separate the effects of a service-connected condition from a non-service-connected condition, all symptoms must be attributed to the service-connected condition.',

    significance: 'If you have multiple mental health conditions and symptoms overlap, the VA should attribute all symptoms to your service-connected condition.',

    practicalApplication: 'Useful when VA tries to say some symptoms are from a non-service-connected condition. If they can\'t be separated, they go to the SC condition.',

    appliesTo: ['PTSD', 'All mental health conditions', 'Overlapping conditions']
  }
];

/**
 * Cases specific to tinnitus and hearing loss
 */
export const HEARING_CASES = [
  {
    id: 'fountain',
    name: 'Fountain v. McDonald',
    citation: '27 Vet. App. 258 (2015)',
    year: 2015,
    court: 'CAVC',
    category: 'hearing',

    holding: 'Tinnitus is a "chronic disease" under 38 C.F.R. § 3.309(a) as an "organic disease of the nervous system."',

    significance: 'Tinnitus qualifies for presumptive service connection if it manifests to a compensable degree within one year of discharge.',

    practicalApplication: 'If you had noise exposure in service and developed tinnitus within a year of discharge, you may not need a nexus letter.',

    appliesTo: ['Tinnitus (DC 6260)'],

    keyQuote: '"Tinnitus is a type of organic disease of the nervous system."'
  },

  {
    id: 'jandreau',
    name: 'Jandreau v. Nicholson',
    citation: '492 F.3d 1372 (Fed. Cir. 2007)',
    year: 2007,
    court: 'Federal Circuit',
    category: 'hearing',

    holding: 'Lay evidence (veteran testimony) is competent to establish a diagnosis when: (1) a layperson is competent to identify the medical condition, (2) the layperson is reporting a contemporaneous medical diagnosis, or (3) lay testimony describing symptoms supports a later diagnosis.',

    significance: 'Veterans ARE competent to diagnose tinnitus (ringing in ears) themselves - no medical expert needed for the diagnosis itself.',

    practicalApplication: 'Your own statement that you have ringing in your ears IS competent evidence of tinnitus. The VA cannot require a doctor to diagnose it.',

    appliesTo: ['Tinnitus', 'Other conditions veterans can self-identify'],

    keyQuote: '"Lay evidence can be competent and sufficient to establish a diagnosis of a condition when... a layperson is competent to identify the medical condition."'
  }
];

/**
 * Cases specific to migraine headaches
 */
export const MIGRAINE_CASES = [
  {
    id: 'pierce',
    name: 'Pierce v. Principi',
    citation: '18 Vet. App. 440 (2004)',
    year: 2004,
    court: 'CAVC',
    category: 'migraines',

    holding: '"Economic inadaptability" for the 50% migraine rating can mean either "producing" or "capable of producing" economic inadaptability. Current employment does not preclude a 50% rating.',

    significance: 'Being currently employed does NOT prevent you from getting a 50% migraine rating if your migraines are capable of causing economic problems.',

    practicalApplication: 'If denied 50% because "you\'re still working," cite Pierce. The standard is whether migraines are CAPABLE of causing economic inadaptability.',

    appliesTo: ['Migraines (DC 8100)'],

    keyQuote: '"Nothing in DC 8100 requires that the claimant be completely unable to work in order to qualify for a 50% rating."'
  }
];

/**
 * Cases related to secondary service connection
 */
export const SECONDARY_CASES = [
  {
    id: 'allen',
    name: 'Allen v. Brown',
    citation: '7 Vet. App. 439 (1995)',
    year: 1995,
    court: 'CAVC',
    category: 'secondary',

    holding: 'Secondary service connection may be established for a disability that is aggravated (made worse) by a service-connected condition, not just caused by it.',

    significance: 'You can get service connection for conditions that existed before but were made worse by a service-connected condition.',

    practicalApplication: 'If a service-connected condition is aggravating another condition (even a pre-existing one), you can claim it as secondary.',

    appliesTo: ['Secondary service connection', 'Aggravation claims']
  }
];

/**
 * Cases related to examinations and duty to assist
 */
export const EXAMINATION_CASES = [
  {
    id: 'mclendon',
    name: 'McLendon v. Nicholson',
    citation: '20 Vet. App. 79 (2006)',
    year: 2006,
    court: 'CAVC',
    category: 'examination',

    holding: 'VA must provide a medical examination when: (1) there is competent evidence of current disability or persistent symptoms, (2) evidence of an in-service event, (3) indication the disability MAY be associated with service, and (4) insufficient competent medical evidence to decide the claim.',

    significance: 'Sets a LOW threshold for when VA must provide an examination. The evidence need only "indicate" a possible connection.',

    practicalApplication: 'If VA denies your claim without an exam, and you meet these criteria, they may have violated their duty to assist.',

    appliesTo: ['All claims requiring examination'],

    keyQuote: '"The threshold for finding a link between current disability and service is low."'
  }
];

/**
 * Cases related to ratings and evaluations
 */
export const RATING_CASES = [
  {
    id: 'deluca',
    name: 'DeLuca v. Brown',
    citation: '8 Vet. App. 202 (1995)',
    year: 1995,
    court: 'CAVC',
    category: 'rating',

    holding: 'When rating musculoskeletal disabilities, VA must consider functional loss due to pain, weakness, fatigability, and incoordination, and these factors must be addressed in the examination.',

    significance: 'Range of motion alone doesn\'t tell the whole story. Pain and other functional limitations must be considered.',

    practicalApplication: 'If your exam only measured range of motion without considering pain on movement, weakness, flare-ups, etc., it may be inadequate.',

    appliesTo: ['Musculoskeletal conditions', 'Joint conditions', 'Back conditions'],

    keyQuote: '"It is essential that the examination... adequately portray functional loss."'
  },

  {
    id: 'mitchell',
    name: 'Mitchell v. Shinseki',
    citation: '25 Vet. App. 32 (2011)',
    year: 2011,
    court: 'CAVC',
    category: 'rating',

    holding: 'VA must also consider functional loss during flare-ups, not just at the time of examination.',

    significance: 'Your condition on exam day may not reflect your worst days. VA must consider flare-up symptoms.',

    practicalApplication: 'Document your flare-ups and their severity. Tell the examiner about your worst days, not just how you feel today.',

    appliesTo: ['Musculoskeletal conditions', 'Any condition with flare-ups']
  },

  {
    id: 'sharp',
    name: 'Sharp v. Shulkin',
    citation: '29 Vet. App. 26 (2017)',
    year: 2017,
    court: 'CAVC',
    category: 'rating',

    holding: 'Examiners must attempt to estimate functional loss during flare-ups, even if the veteran is not experiencing one at the time of the exam.',

    significance: 'The examiner cannot simply say "unable to determine without speculation." They must make an effort to estimate.',

    practicalApplication: 'If examiner refused to estimate flare-up impact, the exam may be inadequate. Keep a symptom diary showing flare-up frequency and severity.',

    appliesTo: ['Musculoskeletal conditions', 'Any condition with flare-ups']
  }
];

/**
 * All cases combined for easy searching
 */
export const ALL_CASES = [
  ...LANDMARK_CASES,
  ...MENTAL_HEALTH_CASES,
  ...HEARING_CASES,
  ...MIGRAINE_CASES,
  ...SECONDARY_CASES,
  ...EXAMINATION_CASES,
  ...RATING_CASES
];

/**
 * Case categories for filtering
 */
export const CASE_CATEGORIES = {
  general: {
    name: 'General / Foundational',
    description: 'Landmark cases that apply to all VA claims',
    cases: LANDMARK_CASES
  },
  mentalHealth: {
    name: 'Mental Health',
    description: 'Cases specific to PTSD, depression, anxiety, and other mental health conditions',
    cases: MENTAL_HEALTH_CASES
  },
  hearing: {
    name: 'Hearing / Tinnitus',
    description: 'Cases related to hearing loss and tinnitus claims',
    cases: HEARING_CASES
  },
  migraines: {
    name: 'Migraines / Headaches',
    description: 'Cases specific to migraine headache ratings',
    cases: MIGRAINE_CASES
  },
  secondary: {
    name: 'Secondary Connection',
    description: 'Cases related to secondary service connection',
    cases: SECONDARY_CASES
  },
  examination: {
    name: 'Examinations / Duty to Assist',
    description: 'Cases about VA examination requirements',
    cases: EXAMINATION_CASES
  },
  rating: {
    name: 'Rating Criteria',
    description: 'Cases about how conditions should be evaluated',
    cases: RATING_CASES
  }
};

/**
 * Get cases applicable to a specific condition
 */
export const getCasesForCondition = (conditionType) => {
  const conditionMap = {
    'migraine': [...LANDMARK_CASES, ...MIGRAINE_CASES],
    'ptsd': [...LANDMARK_CASES, ...MENTAL_HEALTH_CASES],
    'depression': [...LANDMARK_CASES, ...MENTAL_HEALTH_CASES],
    'anxiety': [...LANDMARK_CASES, ...MENTAL_HEALTH_CASES],
    'mentalHealth': [...LANDMARK_CASES, ...MENTAL_HEALTH_CASES],
    'tinnitus': [...LANDMARK_CASES, ...HEARING_CASES],
    'hearingLoss': [...LANDMARK_CASES, ...HEARING_CASES],
    'back': [...LANDMARK_CASES, ...RATING_CASES],
    'knee': [...LANDMARK_CASES, ...RATING_CASES],
    'hip': [...LANDMARK_CASES, ...RATING_CASES],
    'shoulder': [...LANDMARK_CASES, ...RATING_CASES],
    'musculoskeletal': [...LANDMARK_CASES, ...RATING_CASES],
    'secondary': [...LANDMARK_CASES, ...SECONDARY_CASES]
  };

  return conditionMap[conditionType] || LANDMARK_CASES;
};

/**
 * Get a specific case by ID
 */
export const getCaseById = (caseId) => {
  return ALL_CASES.find(c => c.id === caseId);
};

/**
 * External legal resources
 */
export const LEGAL_RESOURCES = {
  cavc: {
    name: 'U.S. Court of Appeals for Veterans Claims',
    url: 'https://www.uscourts.cavc.gov/opinions.php',
    description: 'Official court opinions from 2000 to present, plus archived decisions'
  },
  veteransLawLibrary: {
    name: 'Veterans Law Library',
    url: 'http://www.veteranslawlibrary.com/case_law.htm',
    description: 'Searchable database of veterans case law'
  },
  cfr: {
    name: '38 CFR - VA Regulations',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4',
    description: 'Official Code of Federal Regulations for VA benefits'
  },
  m21: {
    name: 'M21-1 Adjudication Manual',
    url: 'https://www.knowva.ebenefits.va.gov/',
    description: 'VA internal procedures manual for claims adjudication'
  }
};

export default ALL_CASES;