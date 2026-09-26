/**
 * snomedMap.js — Doc Bear's Symptom Vault
 *
 * Translates SNOMED CT codes from a VA problem list into the app's internal
 * condition ids, so an imported diagnosis can drive a rating analyzer.
 *
 * ── HOW THESE CODES WERE OBTAINED, AND WHY IT MATTERS ────────────────────
 *
 * Every entry below was verified one of two ways:
 *   1. Read directly off a real VA Blue Button file, code next to condition
 *      name (marked BB).
 *   2. Looked up in the SNOMED CT Browser, United States Edition, release
 *      2026-09-01. Browser link: https://snomedbrowser.org/?perspective=full&conceptId1=404684003&edition=MAIN/SNOMEDCT-US/2026-09-01&release=&languages=en
 *
 * None were recalled from memory or taken from a generated list. That rule
 * exists because an earlier draft of this table was assembled without
 *ndividual verification and roughly HALF its codes were wrong — including
 * every one of the five time-limited conditions, which are the entries that
 * decide whether the app reports a rating percentage at all.
 *
 * A missing code costs a Veteran nothing: they link the condition by hand from
 * the Diagnoses tab and everything works. A wrong code silently attaches their
 * diagnosis to a condition they don't have. Nobody would catch it.
 *
 * So: do not add a code here unless you have seen it in the browser or in a
 * real file. Plausible is not verified.
 *
 * ── WHAT conditionKey ACTUALLY DOES ──────────────────────────────────────
 *
 * It is read by exactly one function: getDiagnosisDate() in storage.js. Its
 * only job is to supply a DATE to the time-limited analyzers. It never
 * supplies a rating — the analyzers still read logged symptoms for that. So a
 * mapping here cannot invent a disability; it can only answer "when was this
 * diagnosed."
 *
 * ── WHAT IS DELIBERATELY NOT MAPPED ──────────────────────────────────────
 *
 * Scars (DC 7800-7805): no general "scar" disorder concept exists, because a
 *   scar alone isn't a disorder. SNOMED has only specific ones (burn scar,
 *   acne scar). DC 7800-7805 rate by location, area and characteristics, not
 *   by diagnosis. Use the picker.
 *
 * Prostate conditions (DC 7527): "Disorder of prostate" (30281009) is a
 *   category spanning BPH, prostatitis AND prostate cancer. Cancer is DC 7528,
 *   a different rating entirely. Mapping the category would link a cancer
 *   diagnosis to the wrong analyzer.
 *
 * Joint groupings (shoulder, hip, ankle, wrist, elbow): these are app
 *   groupings covering DC ranges. SNOMED returns well over a thousand concepts
 *   for "ankle" alone and no single one represents the group. Use the picker.
 *
 * Asymptomatic HIV (91947003): DC 6351 is HIV-RELATED ILLNESS. Seropositivity
 *   without symptoms is not that, and linking it would imply a claim the
 *   Veteran isn't making.
 */

export const SNOMED_TO_CONDITION = {

    // ══ TIME-LIMITED CONDITIONS ════════════════════════════════════════════
    // These are the reason this file exists. Their rating depends on time since
    // diagnosis, so without a date the analyzer declines to report a number.
    // Children are included because a Veteran with post-thyroidectomy
    // hypoparathyroidism has THAT on their problem list, not the parent.

    // Hypoparathyroidism — DC 7905, 100% for 3 months then residuals
    '36976004':         'hypoparathyroidism',   // parent
    '721287004':        'hypoparathyroidism',   // following procedure
    '190455009':        'hypoparathyroidism',   // post-surgical
    '1148695005':       'hypoparathyroidism',   // following excision of thyroid gland
    '717899005':        'hypoparathyroidism',   // after iodine thyroid ablation
    '359743001':        'hypoparathyroidism',   // postablative
    '717900000':        'hypoparathyroidism',   // after external beam radiotherapy
    '237654002':        'hypoparathyroidism',   // idiopathic
    '75316000':         'hypoparathyroidism',   // autoimmune
    // NOT 717893006 (Cataract due to idiopathic hypoparathyroidism) — its
    // SNOMED parent is Cataract. It's an eye condition rated in the 6000s.

    // Hyperthyroidism — DC 7900, 30% for 6 months then residuals
    '34486009':         'hyperthyroidism',      // parent
    '353295004':        'hyperthyroidism',      // Graves' disease
    '427970008':        'hyperthyroidism',      // subclinical
    '237510004':        'hyperthyroidism',      // iodine-induced thyrotoxicosis
    '62052002':         'hyperthyroidism',      // caused by amiodarone
    '27538003':         'hyperthyroidism',      // with Hashimoto disease (Hashitoxicosis)
    // 27538003 has two SNOMED parents, Hashimoto thyroiditis and
    // Hyperthyroidism. Mapped to hyperthyroidism because the thyrotoxic phase is
    // the active presentation and DC 7900 is what VA rates.

    // Hyperparathyroidism — DC 7904
    '66999008':         'hyperparathyroidism',  // parent
    '36348003':         'hyperparathyroidism',  // primary
    '91478007':         'hyperparathyroidism',  // secondary
    '78200003':         'hyperparathyroidism',  // tertiary

    // Diabetes insipidus — DC 7909
    // RENAMED in SNOMED: the concept is now "Arginine vasopressin-related
    // polyuria" with "Diabetes insipidus" kept as a synonym. A VA problem list
    // may still print the old term.
    '1296758008':       'diabetes-insipidus',   // parent (AVP-related polyuria)
    '45369008':         'diabetes-insipidus',   // AVP deficiency (central/cranial DI)
    '111395007':        'diabetes-insipidus',   // AVP resistance (nephrogenic DI)
    '77274005':         'diabetes-insipidus',   // idiopathic
    '13196008':         'diabetes-insipidus',   // secondary

    // Thyroiditis — DC 7906
    '82119001':         'thyroiditis',          // parent
    '21983002':         'thyroiditis',          // Hashimoto thyroiditis
    '45053005':         'thyroiditis',          // chronic
    '66944004':         'thyroiditis',          // autoimmune
    '38727009':         'thyroiditis',          // subacute
    '237541003':        'thyroiditis',          // silent (painless)
    '237539004':        'thyroiditis',          // drug-induced

    // ══ MENTAL HEALTH ══════════════════════════════════════════════════════
    '313182004':        'ptsd',                 // BB: Chronic Post-Traumatic Stress Disorder
    '18818009':         'major-depression',     // BB: Moderate recurrent major depression
    '21897009':         'generalized-anxiety',  // BB: GAD
    '371631005':        'panic-disorder',
    '13746004':         'bipolar',
    '193462001':        'insomnia',

    // ══ NEUROLOGICAL ═══════════════════════════════════════════════════════
    '37796009':         'migraine',
    '127295002':        'tbi',
    '60862001':         'tinnitus',
    '203082005':        'fibromyalgia',
    '127011001':        'peripheral-neuropathy', // BB: Sensory neuropathy due to diabetes
    '72274001':         'radiculopathy',         // Nerve root disorder
    '52702003':         'chronic-fatigue',

    // ══ MUSCULOSKELETAL ════════════════════════════════════════════════════
    '279039007':        'lumbosacral-strain',   // BB: Low Back Pain
    '26538006':         'intervertebral-disc',  // BB: Degeneration of lumbar intervertebral disc
    '76107001':         'spinal-stenosis',
    '112981000119107':  'degenerative-arthritis', // BB: Bilateral osteoarthritis of knees
    '250102002':        'knee-instability',     // Unstable knee (finding)
    '202882003':        'plantar-fasciitis',
    '11873911000119108':'plantar-fasciitis',    // bilateral — common, rated higher under DC 5276
    '90560007':         'gout',

    // ══ CARDIORESPIRATORY ══════════════════════════════════════════════════
    '73430006':         'sleep-apnea',          // BB
    '38341003':         'hypertension',         // BB
    '53741008':         'cad',                  // Coronary arteriosclerosis; synonym "Arteriosclerotic heart disease" = DC 7005
    '195967001':        'asthma',
    '13645005':         'copd',
    '70076002':         'rhinitis',
    '40055000':         'sinusitis',

    // ══ DIGESTIVE ══════════════════════════════════════════════════════════
    '235595009':        'gerd',
    '10743008':         'ibs',
    '64766004':         'ulcerative-colitis',
    '307496006':        'diverticulitis',
    '70153002':         'hemorrhoids',

    // ══ SKIN & ENDOCRINE ═══════════════════════════════════════════════════
    '44054006':         'diabetes',             // BB: Diabetes Mellitus Type 2
    '40930008':         'hypothyroidism',
    '9014002':          'psoriasis',
    '43116000':         'eczema',
    // NOT 703938007 (Inflammatory dermatosis) — broad parent covering psoriasis
    // and other conditions with their own DCs.

    // ══ GENITOURINARY ══════════════════════════════════════════════════════
    '95570007':         'kidney-stones',        // Kidney stone (singular in SNOMED)
    '860914002':        'erectile-dysfunction',

    // ══ DENTAL & VISUAL ════════════════════════════════════════════════════
    '15188001':         'hearing-loss',
    '41888000':         'tmj',                  // Temporomandibular joint disorder
    '25540007':         'tooth-loss',           // Tooth loss (finding)

    // ══ INFECTIOUS DISEASE ═════════════════════════════════════════════════
    '86406008':         'hiv-aids',             // HIV infection (parent)
    '81000119104':      'hiv-aids',             // symptomatic HIV — DC 6351 territory
    '80191000119101':   'hiv-aids',             // symptomatic HIV-1
    '50711007':         'hepatitis-c',          // Viral hepatitis type C
    '23502006':         'lyme-disease',
};

/**
 * Conditions whose rating depends on time since diagnosis.
 *
 * Without a diagnosis date the analyzer must decline to report a number rather
 * than fall back to the initial-period figure. That fallback is the bug this
 * whole feature exists to fix: before the Diagnoses tab, every Veteran who
 * logged hypoparathyroidism symptoms got 100% in their claim package
 * regardless of whether they were diagnosed last month or a decade ago, and
 * that number flowed into the estimated combined rating.
 */
export const TIME_LIMITED_CONDITIONS = {
    'hypoparathyroidism':  { months: 3, initialRating: 100, dc: '7905' },
    'hyperthyroidism':     { months: 6, initialRating: 30,  dc: '7900' },
    // Without myxedema. The myxedema 100% runs from crisis stabilization,
    // not diagnosis, so it can't be keyed off this table.
    'hypothyroidism':      { months: 6, initialRating: 30,  dc: '7903' },
    'diabetes-insipidus':  { months: 3, initialRating: 30,  dc: '7909' },
    'thyroiditis':         { months: 6, initialRating: 30,  dc: '7906' },
    // DC 7907 note: "The evaluations specifically indicated under this
    // diagnostic code shall continue for six months following initial
    // diagnosis." Tiered 30/60/100 by symptoms, so initialRating is a label
    // here; it's only ever displayed, never used as a number.
    'cushings-syndrome':   { months: 6, initialRating: '30 to 100', dc: '7907' },
    // hyperparathyroidism is deliberately NOT here. DC 7904's 100% runs "for
    // six months from date of discharge following surgery", not from
    // diagnosis. The old entry here (60% for 6 months) matched nothing in the
    // CFR and was being shown on the Diagnoses tab.
};

/** The app's condition id for a SNOMED code, or null. */
export const conditionKeyForSnomed = (snomedCode) => {
    if (!snomedCode) return null;
    return SNOMED_TO_CONDITION[String(snomedCode).trim()] || null;
};

/** Whether this condition's rating depends on time since diagnosis. */
export const isTimeLimited = (conditionKey) =>
    !!conditionKey && !!TIME_LIMITED_CONDITIONS[conditionKey];

/** The time-limit details, or null. */
export const getTimeLimitInfo = (conditionKey) =>
    conditionKey ? (TIME_LIMITED_CONDITIONS[conditionKey] || null) : null;