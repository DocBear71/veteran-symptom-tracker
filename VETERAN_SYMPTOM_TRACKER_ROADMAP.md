# Veteran Symptom Tracker - Comprehensive Roadmap

## Current Status (As of December 2024)

### Implemented Conditions: ~56 conditions

| Category | Implemented | DC Codes |
|----------|-------------|----------|
| **Mental Health** | 12 | PTSD (9411), MDD (9434), GAD (9400), Panic (9412), Bipolar (9432), Social Anxiety (9403), OCD (9404), Adjustment (9440), Dysthymia (9433), Unspecified Anxiety (9410/9413), Unspecified Depression (9435) |
| **Respiratory** | 7 | Asthma (6602), COPD (6604), Emphysema (6603), Chronic Bronchitis (6600), Sinusitis (6510-14), Rhinitis (6522), Sleep Apnea (6847) |
| **Cardiovascular** | 3 | Hypertension (7101), Raynaud's (7117), Varicose Veins (7120) |
| **Musculoskeletal** | 12 | Lumbosacral (5237), IVDS (5243), Knee (5257), Hip (5252-55), Shoulder (5201-03), Ankle (5271), Wrist (5215), Elbow (5206-07), Fibromyalgia (5025), Plantar Fasciitis (5276), Arthritis (5003) |
| **Neurological** | 5 | TBI (8045), Migraine (8100), Radiculopathy (8520), Peripheral Neuropathy, Insomnia (8108) |
| **Ear** | 2 | Meniere's (6205), Tinnitus (6260) |
| **Digestive** | 8 | IBS (7319), GERD (7346), Ulcerative Colitis (7323), Peptic Ulcer (7304), Hemorrhoids (7336), Diverticulitis (7327) |
| **Skin** | 4 | Eczema (7806), Psoriasis (7816), Scars (7804-05), Urticaria (7825) |
| **Endocrine** | 2 | Diabetes (7913), Hypothyroidism (7903) |
| **Other** | 3 | CFS (6354), TMJ (9905), Hearing Loss (6100) |

### Current App Features
✅ Symptom logging with condition-specific fields (migraine, pain, sleep, PTSD)
✅ Cascading category/symptom dropdown (just implemented)
✅ Rating Evidence analysis for ~35 conditions
✅ Blood pressure & glucose measurements
✅ Pulmonary Function Tests (FEV1, FVC, DLCO)
✅ PDF/CSV export with VA Claim Package
✅ Multi-profile support (Veteran, General Health, Caregiver)
✅ Medication tracking
✅ Appointment tracking
✅ Dark mode
✅ PWA with notifications
✅ Quick Log for chronic symptoms

---

## Remaining VA Diagnostic Codes (Trackable)

### High Priority (Common VA Claims)

#### Tier 1: Very Common (~25 conditions)
| DC | Condition | Body System | Priority |
|----|-----------|-------------|----------|
| **7900** | Hyperthyroidism/Graves' | Endocrine | ⭐⭐⭐ |
| **5017** | Gout | Musculoskeletal | ⭐⭐⭐ |
| **7122** | Cold Injury Residuals | Cardiovascular | ⭐⭐⭐ |
| **7005** | CAD/Ischemic Heart Disease | Cardiovascular | ⭐⭐⭐ |
| **8018** | Multiple Sclerosis | Neurological | ⭐⭐⭐ |
| **8910-14** | Epilepsy (all types) | Neurological | ⭐⭐⭐ |
| **7354** | Hepatitis C | Digestive | ⭐⭐⭐ |
| **6319** | Lyme Disease | Infectious | ⭐⭐⭐ |
| **7527** | Prostate Conditions | Genitourinary | ⭐⭐⭐ |
| **7512** | Chronic Cystitis/UTI | Genitourinary | ⭐⭐⭐ |
| **7522** | Erectile Dysfunction | Genitourinary | ⭐⭐⭐ |
| **6351** | HIV-Related Illness | Infectious | ⭐⭐⭐ |
| **6040** | Diabetic Retinopathy | Eye | ⭐⭐⭐ |
| **6012/6013** | Glaucoma | Eye | ⭐⭐⭐ |
| **5019** | Bursitis | Musculoskeletal | ⭐⭐⭐ |
| **5024** | Tendinitis/Tenosynovitis | Musculoskeletal | ⭐⭐⭐ |
| **7338/7339** | Inguinal/Ventral Hernia | Digestive | ⭐⭐⭐ |
| **7720** | Iron Deficiency Anemia | Hematologic | ⭐⭐⭐ |
| **7828/7829** | Acne/Chloracne | Skin | ⭐⭐⭐ |
| **6204** | Peripheral Vestibular Disorders | Ear | ⭐⭐⭐ |
| **7348** | Pancreatitis | Digestive | ⭐⭐ |
| **7542** | Neurogenic Bladder | Genitourinary | ⭐⭐ |
| **7332** | Sphincter Impairment | Digestive | ⭐⭐ |
| **7714** | Sickle Cell Anemia | Hematologic | ⭐⭐ |
| **7307** | Gastritis | Digestive | ⭐⭐ |

#### Tier 2: Moderately Common (~30 conditions)
| DC | Condition | Body System |
|----|-----------|-------------|
| **9431** | Cyclothymic Disorder | Mental Health |
| **9417** | Depersonalization/Derealization | Mental Health |
| **9421-23** | Somatic Symptom Disorders | Mental Health |
| **9520/9521** | Eating Disorders | Mental Health |
| **8004** | Parkinson's Disease | Neurological |
| **8025** | Myasthenia Gravis | Neurological |
| **8108** | Narcolepsy | Neurological |
| **6601** | Bronchiectasis | Respiratory |
| **6846** | Sarcoidosis | Respiratory |
| **6516** | Chronic Laryngitis | Respiratory |
| **7002** | Pericarditis | Cardiovascular |
| **7010/7011** | SVT/Ventricular Arrhythmias | Cardiovascular |
| **7020** | Cardiomyopathy | Cardiovascular |
| **7121** | Post-Phlebitic Syndrome | Cardiovascular |
| **7312** | Cirrhosis | Digestive |
| **7314** | Chronic Hepatitis | Digestive |
| **7508** | Kidney Stones | Genitourinary |
| **7530** | Chronic Renal Disease | Genitourinary |
| **7541** | Diabetic Nephropathy | Genitourinary |
| **7809** | Discoid Lupus | Skin |
| **7815** | Bullous Disorders | Skin |
| **7826** | Cutaneous Vasculitis | Skin |
| **7831** | Alopecia Areata | Skin |
| **7832** | Hyperhidrosis | Skin |
| **7906** | Thyroiditis | Endocrine |
| **7911** | Addison's Disease | Endocrine |
| **6000-6002** | Uveitis/Keratitis/Scleritis | Eye |
| **6017/6018** | Conjunctivitis | Eye |
| **6200/6201** | Otitis Media | Ear |
| **6210** | Chronic Otitis Externa | Ear |

#### Tier 3: Less Common (~40 conditions)
Additional peripheral nerve conditions (8510-8525), foot conditions (5277-5284), spine variants, various skin conditions, rare endocrine disorders, etc.

---

## Phase Roadmap to Completion

### Phase 1: App Infrastructure & UX (2-3 weeks)
**Goal:** Solidify foundation before adding more conditions

| Task | Priority | Complexity |
|------|----------|------------|
| Add condition-specific logging forms (like migraine) for: GI conditions, respiratory conditions, joint conditions | High | Medium |
| Implement "Flare-Up" tracking across all conditions | High | Low |
| Add ROM (Range of Motion) measurement type | High | Medium |
| Add symptom duration tracking | Medium | Low |
| Improve Quick Log to show recent symptoms | Medium | Low |
| Add symptom search/filter in logger | Medium | Low |
| Add "Copy last entry" feature for recurring symptoms | Low | Low |

**New Measurement Types Needed:**
- Range of Motion (degrees) - for joint conditions
- Pain scale with body location map
- Stool frequency/consistency (Bristol scale) - for GI
- Attack/Episode counter with duration

---

### Phase 2: High-Priority Conditions - Part A (2 weeks)
**Goal:** Add most common remaining conditions

| Condition | DC | Symptoms | Rating Card |
|-----------|-----|----------|-------------|
| Hyperthyroidism | 7900 | Weight loss, rapid heartbeat, anxiety, tremors, heat intolerance, sweating | GenericRatingCard |
| Gout | 5017 | Joint pain (acute attacks), swelling, redness, limited ROM | GenericRatingCard |
| Cold Injury Residuals | 7122 | Cold sensitivity, numbness, pain, color changes, tissue loss | New: ColdInjuryRatingCard |
| Epilepsy | 8910-14 | Seizures (major/minor), frequency, triggers, loss of consciousness | New: EpilepsyRatingCard |
| Bursitis | 5019 | Joint pain, swelling, limited ROM, tenderness | GenericJointRatingCard |
| Tendinitis | 5024 | Pain with movement, tenderness, swelling, weakness | GenericJointRatingCard |

**New symptoms: ~35**
**New analysis functions: 6**

---

### Phase 3: High-Priority Conditions - Part B (2 weeks)
**Goal:** Continue high-priority additions

| Condition | DC | Focus |
|-----------|-----|-------|
| Coronary Artery Disease | 7005 | METs-based rating, chest pain, shortness of breath |
| Hepatitis C | 7354 | Fatigue, weight loss, joint pain, liver symptoms |
| Prostate Conditions | 7527 | Urinary frequency/urgency, nocturia, weak stream |
| Chronic Cystitis | 7512 | Urinary frequency, urgency, pain, incontinence |
| Erectile Dysfunction | 7522 | Simple tracking - requires medical documentation |
| Hernias | 7338/7339 | Pain, protrusion, need for support |

**New symptoms: ~30**
**New measurement types:** METs capacity

---

### Phase 4: Eye & Ear Expansion (1-2 weeks)
**Goal:** Complete sensory condition coverage

| Condition | DC | Notes |
|-----------|-----|-------|
| Diabetic Retinopathy | 6040 | Links to Diabetes condition |
| Glaucoma | 6012/6013 | Vision changes, eye pressure symptoms |
| Conjunctivitis | 6017/6018 | Eye redness, discharge, irritation |
| Uveitis | 6000 | Eye pain, light sensitivity, vision changes |
| Peripheral Vestibular | 6204 | Vertigo, imbalance (similar to Meniere's) |
| Otitis Media | 6200/6201 | Ear pain, drainage, hearing changes |
| Otitis Externa | 6210 | Ear canal pain, itching, drainage |

**New symptoms: ~25**

---

### Phase 5: Neurological Expansion (2 weeks)
**Goal:** Add complex neurological conditions

| Condition | DC | Notes |
|-----------|-----|-------|
| Multiple Sclerosis | 8018 | Fatigue, numbness, vision issues, cognitive, mobility |
| Parkinson's Disease | 8004 | Tremors, rigidity, bradykinesia, balance |
| Myasthenia Gravis | 8025 | Muscle weakness, fatigue, drooping eyelids, difficulty swallowing |
| Narcolepsy | 8108 | Sleep attacks, cataplexy, hallucinations |
| Peripheral Nerve Conditions | 8510-8525 | Upper/lower radicular groups - expand radiculopathy |

**New symptoms: ~40**
**New Rating Cards:** MSRatingCard, ParkinsonsRatingCard

---

### Phase 6: Genitourinary System (1-2 weeks)
**Goal:** Add kidney, bladder, reproductive conditions

| Condition | DC | Notes |
|-----------|-----|-------|
| Kidney Stones | 7508 | Pain episodes, frequency, passing stones |
| Chronic Renal Disease | 7530 | Fatigue, swelling, urinary changes |
| Diabetic Nephropathy | 7541 | Links to Diabetes |
| Neurogenic Bladder | 7542 | Incontinence, retention, frequency |
| Sphincter Impairment | 7332 | Incontinence tracking |

**New symptoms: ~20**
**New measurement types:** eGFR, Creatinine (lab values)

---

### Phase 7: Hematologic & Skin Expansion (1-2 weeks)
**Goal:** Blood disorders and remaining skin conditions

| Condition | DC | Notes |
|-----------|-----|-------|
| Iron Deficiency Anemia | 7720 | Fatigue, weakness, shortness of breath |
| Sickle Cell Anemia | 7714 | Pain crises, fatigue, infections |
| Acne/Chloracne | 7828/7829 | Important for Agent Orange claims |
| Alopecia Areata | 7831 | Hair loss patterns |
| Hyperhidrosis | 7832 | Excessive sweating |
| Discoid Lupus | 7809 | Skin lesions, scarring |

**New symptoms: ~25**

---

### Phase 8: Mental Health Completion (1 week)
**Goal:** Complete mental health coverage

| Condition | DC | Notes |
|-----------|-----|-------|
| Cyclothymic Disorder | 9431 | Uses General Rating Formula |
| Somatic Symptom Disorder | 9421-23 | Uses General Rating Formula |
| Eating Disorders | 9520/9521 | Anorexia/Bulimia |
| Depersonalization | 9417 | Uses General Rating Formula |

**New symptoms: ~15**
**All use existing General Rating Formula**

---

### Phase 9: Cardiovascular Completion (1-2 weeks)
**Goal:** Heart conditions and vascular issues

| Condition | DC | Notes |
|-----------|-----|-------|
| Cardiomyopathy | 7020 | METs-based, ejection fraction |
| SVT/Arrhythmias | 7010/7011 | Episode tracking, medication |
| Pericarditis | 7002 | Chest pain, pericardial effusion |
| Post-Phlebitic Syndrome | 7121 | Similar to varicose veins |

**New symptoms: ~15**
**New measurement types:** Ejection Fraction

---

### Phase 10: Digestive Completion (1 week)
**Goal:** Remaining GI conditions

| Condition | DC | Notes |
|-----------|-----|-------|
| Cirrhosis | 7312 | Liver function, complications |
| Chronic Hepatitis | 7314 | Fatigue, liver symptoms |
| Gastritis | 7307 | Similar to peptic ulcer |
| Pancreatitis | 7348 | Abdominal pain, episodes |

**New symptoms: ~15**

---

### Phase 11: Endocrine Completion (1 week)
**Goal:** Remaining thyroid/adrenal conditions

| Condition | DC | Notes |
|-----------|-----|-------|
| Thyroiditis | 7906 | Thyroid symptoms |
| Addison's Disease | 7911 | Fatigue, weight loss, low BP |
| Cushing's Syndrome | 7907 | Weight gain, skin changes |
| Hyperparathyroidism | 7904 | Bone pain, kidney stones |

**New symptoms: ~20**

---

### Phase 12: Polish & Optimization (2 weeks)
**Goal:** Refine and optimize the complete system

| Task | Priority |
|------|----------|
| Performance optimization for large datasets | High |
| Comprehensive testing across all conditions | High |
| Export template improvements | Medium |
| Add condition grouping/related conditions feature | Medium |
| Implement "suggested conditions" based on symptoms | Medium |
| Add secondary condition tracking (e.g., diabetes → neuropathy) | Medium |
| User feedback integration | Ongoing |

---

## Summary Statistics

| Metric | Current | After All Phases |
|--------|---------|------------------|
| **Total Conditions** | ~56 | ~150+ |
| **Symptom Categories** | 52 | ~100 |
| **Individual Symptoms** | ~320 | ~600+ |
| **Rating Cards** | 35 | ~50 (reusing Generic) |
| **Measurement Types** | 4 | 8+ |
| **VA DC Coverage** | ~35% | ~90%+ |

---

## Recommended Priority Order

1. **Phase 1** - Infrastructure (essential for scaling)
2. **Phase 2** - High-priority Part A (biggest user impact)
3. **Phase 3** - High-priority Part B
4. **Phase 5** - Neurological (MS, Parkinson's are high-visibility)
5. **Phase 4** - Eye & Ear
6. **Phase 6** - Genitourinary
7. **Phase 8** - Mental Health completion (low effort, high value)
8. **Phase 7** - Hematologic & Skin
9. **Phase 9** - Cardiovascular
10. **Phase 10** - Digestive
11. **Phase 11** - Endocrine
12. **Phase 12** - Polish

---

## App Feature Backlog (Non-Condition)

### High Priority
- [ ] Condition-specific logging forms for new condition types
- [ ] ROM measurement integration with joint conditions
- [ ] Flare-up tracking with duration
- [ ] Symptom correlation analysis (which symptoms occur together)
- [ ] Rating Evidence summary dashboard

### Medium Priority
- [ ] Secondary/related condition linking
- [ ] "Smart" symptom suggestions based on logged history
- [ ] Comparison view (this month vs. last month)
- [ ] Provider visit preparation report
- [ ] Buddy statement template generator

### Low Priority
- [ ] Voice logging
- [ ] Photo attachment for visible symptoms
- [ ] Integration with Apple Health / Google Fit
- [ ] Barcode scanning for medications

---

## File Structure After Completion

```
src/
├── components/
│   ├── RatingCards/
│   │   ├── GenericRatingCard.jsx (handles ~80% of conditions)
│   │   ├── GenericJointRatingCard.jsx
│   │   ├── MigraineRatingCard.jsx
│   │   ├── EpilepsyRatingCard.jsx
│   │   ├── MSRatingCard.jsx
│   │   ├── CardiacRatingCard.jsx (METs-based)
│   │   └── ... (condition-specific as needed)
│   └── ...
├── data/
│   ├── symptoms.js (~100 categories)
│   ├── measurementTypes.js (8+ types)
│   └── symptomDefinitions.js
└── utils/
    ├── ratingCriteria.js (~15,000 lines)
    └── ...
```

---

*Document created: December 2024*
*Next review: After Phase 2 completion*
