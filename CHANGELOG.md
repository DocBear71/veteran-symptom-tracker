# Changelog

All notable changes to the Veteran Symptom Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.x.x] - Prior Releases

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
- Multi-profile support
- PWA with offline capabilities
- Dark mode support
- Mobile-first responsive design

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 2.0.0 | Dec 2024 | Educational content, body system grouping, color standardization |
| 1.x | 2024 | Phases 1-7 condition implementation |
| 0.x | 2024 | MVP development, core features |

---

*Maintained by Doc Bear Enterprises, LLC*