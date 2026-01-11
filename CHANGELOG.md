# Changelog

All notable changes to Doc Bear's Symptom Vault will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.0] - January 2025

### Added
- **Quick Actions Menu (FAB)** - Floating action button for quick access
    - Quick symptom logging from chronic symptoms
    - Quick medication "taken" logging
    - Navigate to full log form
    - Recent history shortcut
    - Auto-hides on Log and Settings views
    - Keyboard accessible (Escape to close)
    - Respects reduced motion preferences
- **Accessibility Settings** - Full accessibility controls panel
    - Font size adjustment (Small/Medium/Large/Extra Large)
    - High contrast mode toggle
    - Reduced motion toggle
    - Screen reader optimizations toggle
    - Live preview of font size changes
    - Settings persist to localStorage
    - Reset to defaults option
- **Collapsible Settings Sections** - Appearance and Accessibility now collapsible
- **CSS Accessibility Styles**
    - High contrast mode styles
    - Reduced motion support (@media and class-based)
    - Screen reader optimizations (focus indicators, skip links)
    - Touch target minimum sizes (44x44 for WCAG)
    - Error state styling

### Components Added
- `QuickActionsMenu.jsx` - Floating action button component
- `AccessibilitySettings.jsx` - Accessibility controls panel

### Changed
- Settings.jsx - Made Appearance and Accessibility sections collapsible
- index.css - Added accessibility CSS variables and styles
- App.jsx - Added QuickActionsMenu and accessibility initialization

### Accessibility
- WCAG 2.1 AA compliance improvements
- Enhanced focus indicators for screen reader users
- Minimum touch targets on mobile (44x44px)
- High contrast option for low vision users
- Reduced motion for vestibular disorders

---

## [2.4.0] - January 2025

### Status: Skipped (Already Complete)
Export functionality was already robust. Optional enhancements deferred.

### Already Implemented (Prior Versions)
- generatePDF() - Comprehensive symptom log PDF export
- generateCSV() - CSV export for spreadsheet analysis
- generateVAClaimPackagePDF() - Professional VA claim evidence package
- generateCombinedExport() - PDF + CSV combined export
- Date range filtering (7/30/60/90/180 days, year, custom)
- Condition filtering
- Chart exports (BP, Glucose, FEV1, HbA1c trends)
- Appointment history export
- Measurement data export

---

## [2.3.0] - January 2025

### Added
- **CaregiverProgramInfo.jsx** - PCAFC eligibility and benefits guide
    - Five navigation sections: Overview, Eligibility, ADLs, Benefits, How to Apply
    - Program eligibility requirements (Veteran and Caregiver)
    - Six ADL categories with icons, descriptions, and examples
    - Supervision/Protection/Instruction needs explained
    - Stipend levels with calculation explanations (Level 1/Level 2)
    - Benefits breakdown (Financial, Healthcare, Support Services)
    - Step-by-step application process with tips
    - External resources and contact information
    - October 2022 expansion notice (all service eras now eligible)
- **Settings Integration** - PCAFC section for caregiver profiles only
    - Card with program overview and benefit preview badges
    - Modal with full CaregiverProgramInfo component

### Components Added
- `CaregiverProgramInfo.jsx` - Complete PCAFC educational component

### Changed
- Settings.jsx - Added PCAFC section for caregiver profile users

---

## [2.2.0] - January 2025

### Added
- **Rating Enhancements System** - Enhanced rating cards with additional context
    - Key VA/BVA definitions for commonly misunderstood terms
    - Case law references supporting veteran claims
    - Documentation tips for each condition
    - Service connection methods (Direct, Secondary, Presumptive, Aggravation)
- **ServiceConnectionGuide.jsx** - Educational component for service connection
    - Four methods explained with examples
    - Tips for each connection type
    - Integration with Trends page
- **RatingEnhancementsDisplay.jsx** - Reusable enhancement display component
- **Data Files**
    - `serviceConnectionMethods.js` - Service connection types and guidance
    - `caseLawReferences.js` - 16+ landmark veterans law cases
    - `ratingEnhancements.js` - Condition-specific enhancements

### Case Law Added
- Bufkin v. Collins (March 2025) - Benefit of the doubt doctrine changes
- Gilbert v. Derwinski (1990) - Original benefit of the doubt
- Pierce v. Principi (2004) - Economic inadaptability for migraines
- Fountain v. McDonald (2015) - Tinnitus as organic disease
- Jandreau v. Nicholson (2007) - Lay evidence competency
- Clemons v. Shinseki (2009) - Psychiatric diagnosis scope
- Mauerhan v. Principi (2002) - Rating criteria as examples
- And 9 more landmark cases

### Updated Rating Cards
- MigraineRatingCard.jsx - Full enhancements
- SleepApneaRatingCard.jsx - Full enhancements
- PTSDRatingCard.jsx - Full enhancements
- MentalHealthRatingCard.jsx - Full enhancements
- HearingLossRatingCard.jsx - Full enhancements (includes Tinnitus)
- SpineRatingCard.jsx - Full enhancements
- Phase8BRatingCards (7 cards) - Full enhancements

### Important Notice
- **Bufkin v. Collins Warning** - Added throughout application
    - March 2025 case fundamentally changed "benefit of the doubt"
    - Veterans must now build bulletproof cases from start
    - Close evidence no longer sufficient

---

## [2.0.0] - December 2024

### Added
- **UnderstandingYourRating Component** - Educational content for all rating cards
    - Evidence requirements for each condition
    - Rating level meanings with functional impact descriptions
    - Documentation tips for strengthening claims
    - Medical/VA terminology definitions
- **ConditionGroup Component** - Collapsible body system sections
    - 14 body system categories ordered by DC code
    - Accordion behavior (one group open at a time)
    - Auto-scroll to newly opened groups
    - Dynamic condition counts per group
- **conditionDescriptions.js** - Database of 170+ condition descriptions covering 240+ DC codes
- **Centralized Rating Color Functions**
    - `getRatingRowColor()` - Background colors for rating rows
    - `getRatingTextColor()` - Text colors for rating displays
    - 10% increment color scheme (heat map style)
    - Range rating support ("10-30%" displays correctly)
- **CSS Body System Theming** - Rating cards inherit group accent colors
- **Summary Card** - Shows total conditions with logged data across all systems

### Changed
- **RatingEvidence.jsx** - Reorganized with body system grouping
- **getRatingColorClass()** - Updated to 10% increment scheme
- **85+ Rating Cards** - Integrated UnderstandingYourRating component
- **Color scheme** - Standardized across all rating cards

### Fixed
- 45 rating cards with undefined `numericRating` variable
- Range rating color display (e.g., "10-30%")
- DC 8515 mapping (median nerve vs radiculopathy conflict)
- DC 8516 clarification (ulnar nerve, not carpal tunnel)
- Duplicate DC 8045 mapping removed
- DC 7800 consolidated under scars description

### Documentation
- Created RELEASE_NOTES_V2.md
- Updated VETERAN_SYMPTOM_TRACKER_ROADMAP_V2.md with Phase 8 completion
- Added comprehensive code comments

---

## [1.x.x] - Prior Releases (2024)

### Phases 1-7 Implementation
- **Phase 1**: Neurological conditions (MS, Parkinson's, Myasthenia Gravis, etc.)
- **Phase 2**: Cardiovascular conditions (CAD, Post-MI, Hypertensive Heart, etc.)
- **Phase 3**: Endocrine conditions (Thyroid, Parathyroid, Adrenal, etc.)
- **Phase 4**: Musculoskeletal expansion (Spine, Foot conditions, etc.)
- **Phase 5**: Digestive conditions (Hernia, Esophageal, etc.)
- **Phase 6**: Skin conditions (Acne, Alopecia, etc.)
- **Phase 7**: Eye & Ear conditions (Uveitis, Vestibular, etc.)

### Core Features
- Symptom logging with severity tracking
- VA-aligned rating analysis
- PDF/CSV export functionality
- Multi-profile support (Veteran, General Health, Caregiver)
- PWA with offline capabilities
- Dark mode support
- Mobile-first responsive design
- Medication tracking
- Appointment tracking
- Quick Log for chronic symptoms
- Service-Connected Conditions tracking
- SMC Calculator (all levels K-T)
- Secondary Conditions Guide
- Presumptive Conditions Guide
- MOS Noise Exposure Lookup
- C&P Exam Prep tools
- Buddy Statement Generator
- Rating Scenario Calculator

---

## Version History Summary

| Version | Date     | Highlights                                                       |
|---------|----------|------------------------------------------------------------------|
| 2.5.0   | Jan 2025 | Quick Actions Menu, Accessibility Settings, WCAG 2.1 AA          |
| 2.4.0   | Jan 2025 | Skipped (export already complete)                                |
| 2.3.0   | Jan 2025 | PCAFC Caregiver Program Guide                                    |
| 2.2.0   | Jan 2025 | Rating Enhancements, Case Law, Service Connection Guide          |
| 2.0.0   | Dec 2024 | Educational content, body system grouping, color standardization |
| 1.x     | 2024     | Phases 1-7 condition implementation                              |
| 0.x     | 2024     | MVP development, core features                                   |

---

## Roadmap Status

| Phase                    | Version | Status                        |
|--------------------------|---------|-------------------------------|
| V2.2 Rating Enhancements | 2.2.0   | ✅ Complete                    |
| V2.3 Caregiver Program   | 2.3.0   | ✅ Complete                    |
| V2.4 Export Enhancements | 2.4.0   | ⏭️ Skipped (already complete) |
| V2.5 User Experience     | 2.5.0   | ✅ Complete                    |
| V3.0 Mobile Apps         | -       | 🔲 Not Started                |
| V3.1 Cloud Sync          | -       | 🔲 Not Started                |
| V3.2 AI Analytics        | -       | 🔲 Not Started                |

---

*Maintained by Doc Bear Enterprises, LLC*