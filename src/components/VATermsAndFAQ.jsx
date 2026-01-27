// ============================================
// VATermsAndFAQ.jsx
// VA Terms, Definitions & Frequently Asked Questions Guide
// Educational reference for veterans navigating the claims process
// ============================================

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Info, AlertTriangle } from 'lucide-react';

// ============================================
// VA ACRONYMS & TERMS DATA
// Source: VA resources, 38 CFR, howvadisabilityratingswork.com
// ============================================

const VA_TERMS = {
  // === A ===
  'A&A': {
    term: 'Aid and Attendance (SMC-L)',
    definition: 'SMC-L benefit for veterans who need regular aid and attendance due to SERVICE-CONNECTED conditions. NEEDS-BASED, NOT percentage-based. Per 38 U.S.C. § 1114(l), there is NO requirement for 100% rating. Qualifies if you cannot: dress/bathe, feed yourself, attend to wants of nature, adjust prosthetics, or protect yourself from daily hazards.',
    category: 'benefits',
  },
  'ACDUTRA': {
    term: 'Active Duty for Training',
    definition: 'Full-time duty in the Armed Forces performed by Reserves or National Guard members for training purposes.',
    category: 'service',
  },
  'AHI': {
    term: 'Apnea-Hypopnea Index',
    definition: 'The number of apnea and hypopnea events per hour of sleep, used to diagnose and rate sleep apnea severity. Mild: 5-15, Moderate: 15-30, Severe: 30+.',
    category: 'medical',
  },
  'ALS': {
    term: 'Amyotrophic Lateral Sclerosis',
    definition: 'Lou Gehrig\'s Disease. A progressive neurodegenerative disease. Presumptive for veterans with 90+ days of active service. Minimum 100% rating.',
    category: 'medical',
  },
  'AMA': {
    term: 'Appeals Modernization Act',
    definition: 'Law effective February 19, 2019 that created three review lanes for VA claim appeals: Supplemental Claim, Higher-Level Review, and Board Appeal.',
    category: 'legal',
  },
  'AOJ': {
    term: 'Agency of Original Jurisdiction',
    definition: 'The VA regional office that initially decided your claim. Appeals may be remanded back to the AOJ for additional development.',
    category: 'process',
  },

  // === B ===
  'BDD': {
    term: 'Benefits Delivery at Discharge',
    definition: 'Program allowing service members to file VA disability claims 180-90 days before separation.',
    category: 'process',
  },
  'BVA': {
    term: 'Board of Veterans Appeals',
    definition: 'The appellate body within VA that reviews benefit claim appeals and issues decisions on behalf of the Secretary of Veterans Affairs.',
    category: 'process',
  },
  'Bufkin': {
    term: 'Bufkin v. Collins (2025)',
    definition: 'Supreme Court decision (March 2025) limiting judicial review of VA evidence weighing. Courts now defer to VA\'s judgment on whether evidence is "balanced" for benefit-of-the-doubt purposes. Makes strong initial claims more critical than ever.',
    category: 'legal',
  },

  // === C ===
  'CAVC': {
    term: 'Court of Appeals for Veterans Claims',
    definition: 'Federal court that reviews BVA decisions. Veterans can appeal BVA denials to CAVC within 120 days of the decision.',
    category: 'legal',
  },
  'CFR': {
    term: 'Code of Federal Regulations',
    definition: 'The codification of federal regulations. Title 38 CFR contains VA regulations including the rating schedule (Part 4).',
    category: 'legal',
  },
  'C&P': {
    term: 'Compensation and Pension',
    definition: 'VA examination to evaluate the severity of your claimed conditions. Also called a "C&P exam" or "VA exam."',
    category: 'process',
  },
  'CUE': {
    term: 'Clear and Unmistakable Error',
    definition: 'An error in a prior final VA decision so obvious that reasonable minds could only conclude the original decision was wrong. Can reopen old claims.',
    category: 'legal',
  },

  // === D ===
  'DBQ': {
    term: 'Disability Benefits Questionnaire',
    definition: 'Standardized forms used by medical providers to document disability severity in VA-required format. Can be completed by private doctors.',
    category: 'process',
  },
  'DC': {
    term: 'Diagnostic Code',
    definition: 'Four-digit codes in 38 CFR Part 4 that identify specific medical conditions and their rating criteria.',
    category: 'rating',
  },
  'DIC': {
    term: 'Dependency and Indemnity Compensation',
    definition: 'Tax-free monthly benefit paid to eligible survivors of veterans who died from service-connected conditions or while on active duty.',
    category: 'benefits',
  },
  'DRO': {
    term: 'Decision Review Officer',
    definition: 'A senior VA employee who can review claims and make new decisions. DRO reviews were replaced by Higher-Level Reviews under AMA.',
    category: 'process',
  },
  'DTR': {
    term: 'Deep Tendon Reflexes',
    definition: 'Medical test measuring involuntary muscle responses. Used in neurological and musculoskeletal evaluations.',
    category: 'medical',
  },
  'DVA': {
    term: 'Department of Veterans Affairs',
    definition: 'The federal agency responsible for providing benefits and services to veterans. Technically more accurate than "VA."',
    category: 'general',
  },

  // === E ===
  'EAD': {
    term: 'Entry on Active Duty',
    definition: 'The date you began active military service.',
    category: 'service',
  },
  'ED': {
    term: 'Erectile Dysfunction',
    definition: 'Rated at 0% under DC 7522, but establishes service connection for potential SMC-K eligibility. Often secondary to diabetes, PTSD, or medications.',
    category: 'medical',
  },
  'ETS': {
    term: 'Expiration Term of Service',
    definition: 'Your discharge date - the point at which your term of service expires and you separate from the military.',
    category: 'service',
  },
  'EVR': {
    term: 'Eligibility Verification Report',
    definition: 'Annual report required for some VA pension benefits to verify continued eligibility.',
    category: 'process',
  },

  // === F ===
  'FDC': {
    term: 'Fully Developed Claim',
    definition: 'A claim submitted with all relevant evidence, potentially resulting in faster processing. VA\'s goal is 125 days for FDC decisions.',
    category: 'process',
  },
  'Favorable Finding': {
    term: 'Favorable Finding',
    definition: 'A determination by VA in your favor that becomes BINDING under 38 CFR § 3.104(c). Once VA makes a favorable finding (e.g., "veteran requires aid and attendance"), they cannot reverse it without clear and unmistakable error. Powerful tool if VA denies benefits despite their own favorable findings.',
    category: 'legal',
  },
  'FOIA': {
    term: 'Freedom of Information Act',
    definition: 'Federal law allowing you to request copies of your VA records and other government documents.',
    category: 'legal',
  },
  'FSAD': {
    term: 'Female Sexual Arousal Disorder',
    definition: 'Rated at 0% under DC 7632. May be secondary to PTSD, medications, or pelvic conditions. Review for SMC entitlement.',
    category: 'medical',
  },

  // === G ===
  'GAF': {
    term: 'Global Assessment of Functioning',
    definition: 'Outdated 0-100 scale for mental health severity. Replaced by WHODAS 2.0 but still appears in older records.',
    category: 'medical',
  },
  'GWS': {
    term: 'Gulf War Syndrome',
    definition: 'Medically unexplained chronic multi-symptom illness affecting Gulf War veterans. Presumptive conditions include fibromyalgia, CFS, and IBS.',
    category: 'medical',
  },

  // === H ===
  'HLR': {
    term: 'Higher-Level Review',
    definition: 'Appeal lane under AMA where a senior reviewer examines your claim for errors. No new evidence allowed. Decision within 125 days.',
    category: 'process',
  },
  'HTN': {
    term: 'Hypertension',
    definition: 'High blood pressure. Rated under DC 7101 based on diastolic and systolic readings. Common secondary condition.',
    category: 'medical',
  },

  // === I ===
  'IBS': {
    term: 'Irritable Bowel Syndrome',
    definition: 'Functional GI disorder rated under DC 7319. Presumptive for Gulf War veterans. Ratings range from 10-30%.',
    category: 'medical',
  },
  'IME': {
    term: 'Independent Medical Examination',
    definition: 'Medical examination by a doctor not affiliated with VA, often used to support claims or appeals.',
    category: 'medical',
  },
  'IMO': {
    term: 'Independent Medical Opinion',
    definition: 'Written medical opinion from a non-VA doctor establishing nexus or addressing medical questions. Also called a "nexus letter."',
    category: 'medical',
  },
  'ITF': {
    term: 'Intent to File',
    definition: 'Form that establishes an effective date up to one year before your actual claim submission. Protects your backpay.',
    category: 'process',
  },

  // === L ===
  'LHI': {
    term: 'Logistics Health Incorporated',
    definition: 'One of three VA contractors that conduct C&P examinations.',
    category: 'process',
  },
  'LOD': {
    term: 'Line of Duty',
    definition: 'Determination that an injury or illness occurred while performing military duties.',
    category: 'service',
  },

  // === M ===
  'MDD': {
    term: 'Major Depressive Disorder',
    definition: 'Mental health condition rated under the General Rating Formula for Mental Disorders (DC 9434). Common among veterans.',
    category: 'medical',
  },
  'MOS': {
    term: 'Military Occupational Specialty',
    definition: 'Your job code in the military. Important for establishing in-service events and noise exposure for hearing claims.',
    category: 'service',
  },
  'MST': {
    term: 'Military Sexual Trauma',
    definition: 'Sexual assault or harassment during military service. Special evidence rules apply - corroborating evidence not always required.',
    category: 'service',
  },
  'MUCMI': {
    term: 'Medically Unexplained Chronic Multisymptom Illness',
    definition: 'Conditions like fibromyalgia, CFS, and IBS that are presumptive for Gulf War veterans even without definitive diagnosis.',
    category: 'medical',
  },

  // === N ===
  'NOD': {
    term: 'Notice of Disagreement',
    definition: 'Form initiating an appeal of a VA decision. Under AMA, replaced by specific appeal lane forms (VA Form 20-0995, 20-0996, or 10182).',
    category: 'process',
  },
  'NSC': {
    term: 'Non-Service Connected',
    definition: 'A condition VA has determined is not related to military service. NSC conditions cannot be rated for compensation.',
    category: 'rating',
  },

  // === P ===
  'P&T': {
    term: 'Permanent and Total',
    definition: 'Designation indicating your disabilities are static (unlikely to improve). Provides additional benefits and protections from reduction.',
    category: 'rating',
  },
  'PACT': {
    term: 'Promise to Address Comprehensive Toxics Act',
    definition: '2022 law expanding presumptive conditions for toxic exposure including burn pits, Agent Orange, and radiation.',
    category: 'legal',
  },
  'PFT': {
    term: 'Pulmonary Function Test',
    definition: 'Breathing test measuring lung function. Results (FEV-1, FVC, DLCO) determine ratings for respiratory conditions.',
    category: 'medical',
  },
  'PMC': {
    term: 'Pension Management Center',
    definition: 'VA facilities that process pension claims.',
    category: 'process',
  },
  'POA': {
    term: 'Power of Attorney',
    definition: 'Legal authorization for a VSO, attorney, or claims agent to represent you before VA.',
    category: 'legal',
  },
  'POW': {
    term: 'Prisoner of War',
    definition: 'Special presumptive conditions apply to former POWs based on length of captivity.',
    category: 'service',
  },

  // === Q ===
  'QTC': {
    term: 'QTC Medical Services',
    definition: 'One of three VA contractors that conduct C&P examinations.',
    category: 'process',
  },

  // === R ===
  'RAD': {
    term: 'Release from Active Duty',
    definition: 'Your separation date from active military service.',
    category: 'service',
  },
  'RD': {
    term: 'Rating Decision',
    definition: 'Official VA document granting or denying service connection and assigning disability ratings.',
    category: 'process',
  },
  'RFE': {
    term: 'Routine Future Exam',
    definition: 'Scheduled re-examination to assess whether your condition has improved, worsened, or stabilized.',
    category: 'process',
  },
  'RO': {
    term: 'Regional Office',
    definition: 'VA facility that processes claims. Also called VARO (VA Regional Office).',
    category: 'process',
  },
  'ROM': {
    term: 'Range of Motion',
    definition: 'Measurement of joint movement in degrees. Critical for musculoskeletal ratings.',
    category: 'medical',
  },
  'RVSR': {
    term: 'Rating Veterans Service Representative',
    definition: 'VA employee who reviews evidence and assigns disability ratings.',
    category: 'process',
  },

  // === S ===
  'SC': {
    term: 'Service-Connected',
    definition: 'VA has determined your condition is related to military service, making it eligible for compensation.',
    category: 'rating',
  },
  'SMC': {
    term: 'Special Monthly Compensation',
    definition: 'Additional compensation beyond schedular ratings for severe disabilities like loss of limbs, blindness, or need for aid and attendance.',
    category: 'benefits',
  },
  'SMR': {
    term: 'Service Medical Records',
    definition: 'Medical records from your time in service. Critical evidence for establishing in-service events.',
    category: 'service',
  },
  'SOC': {
    term: 'Statement of the Case',
    definition: 'Document VA provides after you appeal, explaining the facts, law, and reasons for the decision.',
    category: 'process',
  },
  'SSOC': {
    term: 'Supplemental Statement of the Case',
    definition: 'Updated SOC issued when new evidence is added to an appeal.',
    category: 'process',
  },
  'STR': {
    term: 'Service Treatment Records',
    definition: 'Same as SMR - your medical records from military service.',
    category: 'service',
  },

  // === T ===
  'TBI': {
    term: 'Traumatic Brain Injury',
    definition: 'Rated under DC 8045 with residuals rated separately. Common from blast exposure, falls, or motor vehicle accidents.',
    category: 'medical',
  },
  'TDIU': {
    term: 'Total Disability Individual Unemployability',
    definition: 'Pays at the 100% rate when service-connected disabilities prevent substantially gainful employment, even if combined rating is less than 100%.',
    category: 'benefits',
  },

  // === V ===
  'VA': {
    term: 'Veterans Affairs',
    definition: 'Common shorthand for Department of Veterans Affairs (DVA).',
    category: 'general',
  },
  'VARO': {
    term: 'VA Regional Office',
    definition: 'Local VA office that processes claims and provides services.',
    category: 'process',
  },
  'VASRD': {
    term: 'VA Schedule for Rating Disabilities',
    definition: '38 CFR Part 4 - the rating schedule containing all diagnostic codes and rating criteria.',
    category: 'rating',
  },
  'VBA': {
    term: 'Veterans Benefits Administration',
    definition: 'The branch of VA that administers compensation, pension, education, and loan guaranty benefits.',
    category: 'general',
  },
  'VES': {
    term: 'Veterans Evaluation Services',
    definition: 'One of three VA contractors that conduct C&P examinations.',
    category: 'process',
  },
  'VHA': {
    term: 'Veterans Health Administration',
    definition: 'The branch of VA that provides healthcare services to veterans.',
    category: 'general',
  },
  'VSO': {
    term: 'Veterans Service Organization',
    definition: 'Organizations like DAV, VFW, American Legion that provide free claims assistance to veterans.',
    category: 'general',
  },

  // === W ===
  'WHODAS': {
    term: 'World Health Organization Disability Assessment Schedule',
    definition: 'Current assessment tool for mental health functioning, replacing the GAF scale.',
    category: 'medical',
  },
};

// ============================================
// KEY VA DEFINITIONS (Rating-Specific Terms)
// ============================================

const VA_DEFINITIONS = [
  {
    term: 'Prostrating',
    definition: 'An attack so severe you MUST lie down and stop ALL activity. This is THE key term for migraine ratings. If your migraines don\'t force you to lie down and cease activity, they may not meet VA\'s definition of "prostrating."',
    conditions: ['Migraines (DC 8100)'],
    importance: 'critical',
    tip: 'Always document: "Migraine was prostrating - had to lie down in dark room, unable to perform any activity for X hours."',
  },
  {
    term: 'Incapacitating Episode',
    definition: 'A period of acute signs and symptoms that requires bed rest prescribed by a physician and treatment by a physician. Key: must be PHYSICIAN-PRESCRIBED bed rest.',
    conditions: ['Intervertebral Disc Syndrome (DC 5243)', 'Eye Conditions', 'Skin Conditions'],
    importance: 'critical',
    tip: 'Get your doctor to document: "Patient requires bed rest for X days due to acute exacerbation."',
  },
  {
    term: 'Flare-up',
    definition: 'Temporary worsening of symptoms beyond baseline. VA must consider functional impairment during flare-ups when rating musculoskeletal conditions.',
    conditions: ['All musculoskeletal conditions'],
    importance: 'high',
    tip: 'Document flare frequency, duration, and additional functional loss: "During flares, ROM decreases by X degrees."',
  },
  {
    term: 'Functional Loss',
    definition: 'Loss of ability to perform normal movements due to pain, weakness, fatigability, incoordination, or other factors. Rated even if ROM is normal.',
    conditions: ['All musculoskeletal conditions'],
    importance: 'high',
    tip: 'DeLuca factors: pain on movement, weakened movement, excess fatigability, incoordination, swelling, deformity, atrophy.',
  },
  {
    term: 'Nexus',
    definition: 'Medical connection between your current condition and military service. Must be stated as "at least as likely as not" (50% or greater probability).',
    conditions: ['All conditions'],
    importance: 'critical',
    tip: 'A nexus letter should state: "It is at least as likely as not that [condition] is caused by/related to military service."',
  },
  {
    term: 'At Least as Likely as Not',
    definition: 'The legal standard for service connection - 50% or greater probability. Does NOT require certainty or "more likely than not."',
    conditions: ['All conditions'],
    importance: 'critical',
    tip: 'Avoid doctors who say "possibly" or "may be related" - these don\'t meet the standard.',
  },
  {
    term: 'Benefit of the Doubt',
    definition: 'When evidence is in approximate balance (50/50), VA must decide in the veteran\'s favor per 38 U.S.C. § 5107(b). HOWEVER: After the Supreme Court\'s Bufkin v. Collins decision (March 2025), this rule only applies if VA admits the evidence is balanced. If VA says one opinion is "more persuasive," courts usually cannot re-weigh it on appeal. VA is finding evidence "balanced" less and less often.',
    conditions: ['All conditions'],
    importance: 'critical',
    tip: 'Build your case so strong from the START that VA cannot reasonably say evidence isn\'t equal. Don\'t aim for "close enough" - the landscape has changed. Strong medical nexus letters, buddy statements, and documented real-world limitations are essential.',
  },
  {
    term: 'Substantially Gainful Employment',
    definition: 'Work that provides annual income above the poverty threshold. Key term for TDIU eligibility.',
    conditions: ['TDIU'],
    importance: 'high',
    tip: 'Marginal employment (sheltered workshop, family business, part-time below poverty) doesn\'t count against TDIU.',
  },
  {
    term: 'Analogous Rating',
    definition: 'When your condition doesn\'t have a specific diagnostic code, VA rates it under a closely related code with similar symptoms and functional impairment.',
    conditions: ['Unlisted conditions'],
    importance: 'medium',
    tip: 'Codes ending in "99" indicate analogous ratings (e.g., 8199-8100 = unlisted neurological rated as migraine).',
  },
  {
    term: 'Pyramiding',
    definition: 'Prohibited practice of rating the same symptoms under multiple diagnostic codes. Each symptom can only be compensated once.',
    conditions: ['All conditions'],
    importance: 'medium',
    tip: 'However, different manifestations of the same disease CAN be separately rated if they don\'t overlap.',
  },
  {
    term: 'Staged Ratings',
    definition: 'Different rating percentages assigned for different time periods when severity has changed over time.',
    conditions: ['All conditions'],
    importance: 'medium',
    tip: 'If your condition worsened, request staged ratings to capture the change.',
  },
  {
    term: 'Extraschedular Rating',
    definition: 'Rating outside the normal schedule when your disability picture is exceptional and not adequately captured by schedular criteria.',
    conditions: ['All conditions'],
    importance: 'medium',
    tip: 'Rare, but available when symptoms cause marked interference with employment beyond schedular criteria.',
  },
  {
    term: 'Favorable Finding',
    definition: 'A determination by VA in your favor that becomes legally BINDING under 38 CFR § 3.104(c). Once VA makes a favorable finding, they cannot reverse it without clear and unmistakable error. Example: If VA\'s Rating Decision states "veteran requires aid and attendance" but denies SMC-L for lack of 100% rating, the favorable finding that you NEED A&A is binding - they applied the law wrong.',
    conditions: ['SMC-L (Aid & Attendance)', 'All claims'],
    importance: 'critical',
    tip: 'Read your Rating Decision carefully for ANY favorable findings. If VA found facts in your favor but still denied benefits, those findings are BINDING and the denial may be a Board-grant scenario.',
  },
];

// ============================================
// FREQUENTLY ASKED QUESTIONS
// ============================================

const FAQ_DATA = [
  {
    category: 'Claims Process',
    questions: [
      {
        question: 'How long does a VA claim take?',
        answer: 'Standard claims average 3-6 months. Fully Developed Claims (FDC) target 125 days. Complex claims or appeals can take 1-2+ years. Check va.gov for current processing times.',
      },
      {
        question: 'What is an Intent to File and why is it important?',
        answer: 'An Intent to File (ITF) establishes your effective date up to one year before you submit your actual claim. This protects your backpay. File an ITF immediately if you\'re not ready to submit a full claim.',
      },
      {
        question: 'Should I use a VSO or attorney?',
        answer: 'VSOs (DAV, VFW, American Legion) provide free assistance and are great for initial claims. Attorneys are helpful for complex appeals but charge fees (usually 20-33% of backpay). You can switch representatives at any time.',
      },
      {
        question: 'What happens at a C&P exam?',
        answer: 'The examiner reviews your records, asks about symptoms and history, and performs a physical examination. Be honest about your WORST days - don\'t minimize. The exam typically lasts 30-60 minutes per condition.',
      },
      {
        question: 'Can I submit private medical evidence?',
        answer: 'Yes! Private medical records, nexus letters, and DBQs completed by your own doctors are valid evidence. VA must consider all evidence submitted.',
      },
    ],
  },
  {
    category: 'Ratings & Compensation',
    questions: [
      {
        question: 'How is my combined rating calculated?',
        answer: 'VA uses "VA math" - ratings are combined, not added. Each rating reduces your remaining "efficiency." Example: 50% + 30% = 50% + (30% of remaining 50%) = 50% + 15% = 65%, rounded to 70%. Use a VA rating calculator for accuracy.',
      },
      {
        question: 'What is the bilateral factor?',
        answer: 'When you have the same or paired conditions affecting both sides of your body (both knees, both arms), VA adds 10% to the combined value of those conditions before combining with other ratings.',
      },
      {
        question: 'Can my rating be reduced?',
        answer: 'Yes, but protections exist. Ratings held 5+ years require sustained improvement. Ratings held 20+ years cannot be reduced unless fraud. P&T ratings are protected from routine re-examination.',
      },
      {
        question: 'What is TDIU and how do I qualify?',
        answer: 'TDIU pays at 100% when you can\'t work due to service-connected disabilities. Standard eligibility: one condition at 60%+ OR combined 70%+ with one at 40%+. Extraschedular TDIU possible if you don\'t meet these thresholds.',
      },
      {
        question: 'What additional benefits come with 100% rating?',
        answer: 'Depending on your situation: CHAMPVA for dependents, Chapter 35 education benefits, property tax exemptions (state-dependent), commissary/exchange access, Space-A travel, and more.',
      },
    ],
  },
  {
    category: 'Service Connection',
    questions: [
      {
        question: 'What are the three elements of service connection?',
        answer: '1) Current diagnosed disability, 2) In-service event, injury, or illness, 3) Medical nexus connecting #1 and #2. All three are required for direct service connection.',
      },
      {
        question: 'What is a secondary service connection?',
        answer: 'A condition caused OR aggravated by an already service-connected condition. Example: Sleep apnea secondary to PTSD, neuropathy secondary to diabetes. Requires medical nexus.',
      },
      {
        question: 'What are presumptive conditions?',
        answer: 'Conditions VA presumes are service-connected based on your service era/location. Examples: Agent Orange conditions for Vietnam vets, burn pit conditions for Gulf War vets, ALS for any veteran with 90+ days service.',
      },
      {
        question: 'My condition wasn\'t documented in service. Can I still claim it?',
        answer: 'Yes! You can establish service connection through lay statements, buddy statements, post-service medical records showing continuity, and medical opinions linking current condition to service.',
      },
      {
        question: 'What is aggravation?',
        answer: 'If a pre-existing condition was made permanently worse by military service, the aggravated portion is service-connected. VA must prove by clear and unmistakable evidence the condition pre-existed AND was not aggravated.',
      },
    ],
  },
  {
    category: 'Appeals',
    questions: [
      {
        question: 'What are my appeal options under AMA?',
        answer: 'Three lanes: 1) Supplemental Claim - submit new evidence, 2) Higher-Level Review - senior reviewer checks for errors (no new evidence), 3) Board Appeal - review by Veterans Law Judge with optional hearing.',
      },
      {
        question: 'How did Bufkin v. Collins (2025) change appeals?',
        answer: 'The Supreme Court ruled that courts cannot re-weigh evidence on appeal. If VA says one medical opinion is "more persuasive," courts usually defer to that judgment. The benefit-of-the-doubt rule only helps AFTER VA admits evidence is balanced - and they\'re doing that less often. This means: (1) Tougher appeals - you must prove VA clearly got it wrong, (2) Build rock-solid cases UP FRONT with thorough evidence, (3) Attack bad exams and legal errors (courts can still fix those), (4) Force VA to address ALL favorable evidence in your record.',
      },
      {
        question: 'How long do I have to appeal?',
        answer: 'One year from the date of your rating decision for most appeals. After one year, the decision becomes final (though you can still file a new claim or CUE motion).',
      },
      {
        question: 'What is the best appeal lane?',
        answer: 'Depends on your situation. Have new evidence? Supplemental Claim. Think VA made an error? Higher-Level Review. Want a judge to decide? Board Appeal. You can try multiple lanes sequentially.',
      },
      {
        question: 'What is a remand?',
        answer: 'When BVA or CAVC sends your case back to the Regional Office for additional development (usually to get more evidence or a new exam). Not a denial, but extends timeline.',
      },
    ],
  },
  {
    category: 'Special Monthly Compensation',
    questions: [
      {
        question: 'What is SMC-K?',
        answer: 'Additional monthly compensation for loss of use of a creative organ (ED, FSAD), loss of one hand/foot, deafness, blindness in one eye, or other specified anatomical losses. Can be combined with other ratings.',
      },
      {
        question: 'What is SMC-S (Housebound)?',
        answer: 'Paid when you have a single 100% disability PLUS additional disabilities combining to 60%+, OR when you\'re permanently housebound due to disabilities.',
      },
      {
        question: 'What is Aid and Attendance (SMC-L)?',
        answer: 'SMC-L is NEEDS-BASED, not percentage-based. Per 38 U.S.C. § 1114(l), 38 CFR § 3.350(b), and 38 CFR § 3.352(a), there is NO requirement for 100% rating, TDIU, or any specific percentage. SMC-L is awarded when SERVICE-CONNECTED conditions cause you to need regular aid and attendance of another person for: inability to dress/bathe, inability to feed oneself, inability to attend to wants of nature, adjusting prosthetics, or inability to protect oneself from daily hazards (including memory issues, medication mismanagement, getting lost).',
      },
      {
        question: 'VA denied my SMC-L saying I need 100% - is that correct?',
        answer: 'NO. This is a common VA error. The M21-1 manual says SMC-L "generally" requires 100%, but manuals do NOT override statutes or regulations. The law (38 U.S.C. § 1114(l)) has NO percentage requirement. If your Rating Decision contains a FAVORABLE FINDING that you need Aid & Attendance but still denies SMC-L due to percentage, that finding is BINDING under 38 CFR § 3.104(c). This is a textbook Board-grant scenario. Appeal it!',
      },
    ],
  },
  {
    category: 'Documentation Tips',
    questions: [
      {
        question: 'What should I document in my symptom logs?',
        answer: 'Frequency, severity, duration of symptoms. Impact on work and daily activities. What makes symptoms better/worse. Medications and their effectiveness. Specific functional limitations.',
      },
      {
        question: 'What is a buddy statement?',
        answer: 'Written statement from someone who witnessed your condition or its effects (spouse, fellow service member, coworker). Use VA Form 21-10210. Powerful evidence especially for mental health and pain conditions.',
      },
      {
        question: 'How do I get a nexus letter?',
        answer: 'Ask your treating physician, or hire a medical expert who reviews VA claims. Letter should state opinion "at least as likely as not," provide rationale, and cite medical literature if applicable.',
      },
      {
        question: 'Should I describe my worst days or average days?',
        answer: 'WORST days, but be honest. VA rates based on overall impairment including flare-ups. Minimizing symptoms leads to lower ratings. Document the full picture of how your condition affects you.',
      },
      {
        question: 'What should I do after a C&P exam?',
        answer: 'Write a detailed "after action" report IMMEDIATELY - even if you think it went well. Note: examiner\'s name, time spent, questions asked, tests performed, and anything they missed or got wrong. If the exam was rushed, lacked reasoning, or ignored symptoms, that\'s a duty-to-assist error you can challenge.',
      },
      {
        question: 'How do I build a strong initial claim?',
        answer: 'After Bufkin v. Collins (2025), building a rock-solid case UP FRONT is more important than ever. Include: (1) Complete medical records with diagnoses, (2) Strong nexus letter stating "at least as likely as not," (3) Buddy/lay statements from spouse, family, coworkers documenting real-world impact, (4) Documentation of functional limitations - not just diagnoses, (5) For TDIU: vocational expert opinion. Don\'t aim for "close enough" - make your evidence overwhelming.',
      },
    ],
  },
];

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const TERM_CATEGORIES = {
  all: { name: 'All Terms', icon: '📚', color: 'gray' },
  rating: { name: 'Rating & Compensation', icon: '📊', color: 'blue' },
  process: { name: 'Claims Process', icon: '📋', color: 'green' },
  medical: { name: 'Medical Terms', icon: '🏥', color: 'red' },
  benefits: { name: 'Benefits', icon: '💰', color: 'amber' },
  legal: { name: 'Legal & Appeals', icon: '⚖️', color: 'purple' },
  service: { name: 'Military Service', icon: '🎖️', color: 'cyan' },
  general: { name: 'General', icon: '📌', color: 'gray' },
};

// ============================================
// COMPONENT
// ============================================

const VATermsAndFAQ = ({ embedded = false }) => {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms', 'definitions', 'faq'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQCategory, setExpandedFAQCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [expandedDefinition, setExpandedDefinition] = useState(null);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = Object.entries(VA_TERMS);

    if (selectedCategory !== 'all') {
      terms = terms.filter(([_, data]) => data.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(([acronym, data]) =>
          acronym.toLowerCase().includes(query) ||
          data.term.toLowerCase().includes(query) ||
          data.definition.toLowerCase().includes(query)
      );
    }

    return terms.sort((a, b) => a[0].localeCompare(b[0]));
  }, [searchQuery, selectedCategory]);

  // Filter definitions based on search
  const filteredDefinitions = useMemo(() => {
    if (!searchQuery.trim()) return VA_DEFINITIONS;

    const query = searchQuery.toLowerCase();
    return VA_DEFINITIONS.filter(def =>
        def.term.toLowerCase().includes(query) ||
        def.definition.toLowerCase().includes(query) ||
        def.conditions.some(c => c.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Filter FAQ based on search
  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;

    const query = searchQuery.toLowerCase();
    return FAQ_DATA.map(category => ({
      ...category,
      questions: category.questions.filter(q =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      ),
    })).filter(category => category.questions.length > 0);
  }, [searchQuery]);

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  return (
      <div className="max-w-4xl mx-auto p-4 pb-1">
        {/* Header */}
        {!embedded && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">📖</span>
            VA Terms, Definitions & FAQ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Essential terminology and answers for navigating the VA disability claims process.
          </p>
        </div>
        )}

        {/* Tab Navigation - Grid layout for mobile */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  activeTab === 'terms'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Acronyms &</span> Terms
          </button>
          <button
              onClick={() => setActiveTab('definitions')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  activeTab === 'definitions'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            Definitions
          </button>
          <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  activeTab === 'faq'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            FAQ
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder={
                  activeTab === 'terms' ? 'Search acronyms or terms...' :
                      activeTab === 'definitions' ? 'Search definitions...' :
                          'Search questions...'
                }
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
                  ✕
                </button>
            )}
          </div>
        </div>

        {/* === ACRONYMS & TERMS TAB === */}
        {activeTab === 'terms' && (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(TERM_CATEGORIES).map(([key, cat]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                ))}
              </div>

              {/* Terms Count */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing {filteredTerms.length} of {Object.keys(VA_TERMS).length} terms
              </p>

              {/* Terms List */}
              <div className="space-y-2">
                {filteredTerms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No terms found matching "{searchQuery}"
                    </div>
                ) : (
                    filteredTerms.map(([acronym, data]) => (
                        <div
                            key={acronym}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                          <div className="flex items-start gap-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-mono font-bold text-sm rounded flex-shrink-0">
                      {acronym}
                    </span>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900 dark:text-white text-left">
                                {data.term}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                                {data.definition}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </>
        )}

        {/* === KEY DEFINITIONS TAB === */}
        {activeTab === 'definitions' && (
            <>
              {/* Info Banner */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800 dark:text-purple-300 text-left">
                    <strong>Why These Matter:</strong> These terms have specific VA meanings that directly affect your rating.
                    Using them correctly in your documentation can make the difference between approval and denial.
                  </div>
                </div>
              </div>

              {/* Definitions List */}
              <div className="space-y-3">
                {filteredDefinitions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No definitions found matching "{searchQuery}"
                    </div>
                ) : (
                    filteredDefinitions.map((def, idx) => (
                        <div
                            key={idx}
                            className={`rounded-lg border overflow-hidden ${getImportanceColor(def.importance)}`}
                        >
                          <button
                              onClick={() => setExpandedDefinition(expandedDefinition === idx ? null : idx)}
                              className="w-full px-4 py-3 flex items-start justify-between text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-lg">{def.term}</span>
                              {def.importance === 'critical' && (
                                  <div className="mt-1">
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-medium">
                            CRITICAL
                          </span>
                                  </div>
                              )}
                            </div>
                            {expandedDefinition === idx ? (
                                <ChevronUp className="w-5 h-5 flex-shrink-0 ml-2 mt-1" />
                            ) : (
                                <ChevronDown className="w-5 h-5 flex-shrink-0 ml-2 mt-1" />
                            )}
                          </button>

                          {expandedDefinition === idx && (
                              <div className="px-4 pb-4 space-y-3">
                                <p className="text-left">{def.definition}</p>

                                <div>
                                  <span className="text-xs font-medium uppercase opacity-75">Applies to:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {def.conditions.map((cond, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs">
                              {cond}
                            </span>
                                    ))}
                                  </div>
                                </div>

                                {def.tip && (
                                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded text-left">
                                      <span className="text-xs font-bold uppercase">💡 Pro Tip:</span>
                                      <p className="text-sm mt-1">{def.tip}</p>
                                    </div>
                                )}
                              </div>
                          )}
                        </div>
                    ))
                )}
              </div>
            </>
        )}

        {/* === FAQ TAB === */}
        {activeTab === 'faq' && (
            <div className="space-y-4">
              {filteredFAQ.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No questions found matching "{searchQuery}"
                  </div>
              ) : (
                  filteredFAQ.map((category, catIdx) => (
                      <div
                          key={catIdx}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {/* Category Header */}
                        <button
                            onClick={() => setExpandedFAQCategory(expandedFAQCategory === catIdx ? null : catIdx)}
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                            {category.category}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full whitespace-nowrap">
                      {category.questions.length} questions
                    </span>
                            {expandedFAQCategory === catIdx ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Questions */}
                        {expandedFAQCategory === catIdx && (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {category.questions.map((q, qIdx) => {
                                const questionKey = `${catIdx}-${qIdx}`;
                                return (
                                    <div key={qIdx}>
                                      <button
                                          onClick={() => setExpandedQuestion(expandedQuestion === questionKey ? null : questionKey)}
                                          className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                      >
                            <span className="font-medium text-gray-900 dark:text-white pr-4">
                              {q.question}
                            </span>
                                        {expandedQuestion === questionKey ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        )}
                                      </button>

                                      {expandedQuestion === questionKey && (
                                          <div className="px-4 pb-4">
                                            <p className="text-gray-600 dark:text-gray-400 text-left bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                              {q.answer}
                                            </p>
                                          </div>
                                      )}
                                    </div>
                                );
                              })}
                            </div>
                        )}
                      </div>
                  ))
              )}
            </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">⚖️ Disclaimer</p>
          <p className="text-left">
            This information is for educational purposes only and does not constitute legal or medical advice.
            VA regulations and policies change frequently. Always verify current requirements with the VA,
            a Veterans Service Organization (VSO), or an accredited attorney. For official information,
            visit <span className="text-blue-600 dark:text-blue-400">va.gov</span>.
          </p>
        </div>
      </div>
  );
};

export default VATermsAndFAQ;