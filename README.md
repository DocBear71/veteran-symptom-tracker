# Doc Bear's Symptom Vault

A Progressive Web App designed to help Veterans document symptoms for VA disability claims. Track symptoms, correlate with VA rating criteria, and build comprehensive evidence for disability evaluations.

![Doc Bear Enterprises](public/icon-512.png)

**Version 2.0** | **185+ Conditions** | **240+ Diagnostic Codes** | **95%+ VA Coverage**

## 🎯 Purpose

Veterans navigating VA disability claims often struggle to document symptoms comprehensively. This app helps by:

- **Structured symptom logging** aligned with VA rating schedules
- **Evidence correlation** showing which ratings your documentation supports
- **Educational content** explaining what the VA looks for in each condition
- **Professional documentation** exportable for medical providers and claims
- **Privacy-first** - all data stored locally on your device

## ✨ Features

### Symptom Tracking
- **Quick Log** - Chronic symptoms for fast daily logging
- **Detailed tracking** with severity, duration, triggers, and impact notes
- **600+ individual symptoms** across 15 body systems
- **Condition-specific fields** for accurate documentation:
    - Migraine: prostrating attacks, duration, work impact
    - Sleep: hours slept, quality, interruptions, nightmares
    - PTSD: flashbacks, hypervigilance, triggers, avoidance
    - Pain: location, radiation, type, affected activities
    - And many more...

### Rating Evidence Analysis
Correlates your logged symptoms with official VA rating criteria from 38 CFR Part 4:

**Body System Coverage (v2.0):**

| Body System | Conditions | DC Codes |
|-------------|------------|----------|
| 🦴 **Musculoskeletal** | 28 | 5000-5299 |
| 🫁 **Respiratory** | 10 | 6000-6099 |
| 👁️ **Eye & Ear** | 12 | 6100-6299 |
| 🦠 **Infectious Diseases** | 12 | 6300-6399 |
| ❤️ **Cardiovascular** | 13 | 7000-7199 |
| 🫃 **Digestive** | 16 | 7200-7399 |
| 🫘 **Genitourinary** | 12 | 7500-7699 |
| 🩸 **Hemic & Lymphatic** | 16 | 7700-7799 |
| 🧴 **Skin** | 13 | 7800-7899 |
| 🦋 **Endocrine** | 10 | 7900-7999 |
| ⚡ **Neurological** | 38 | 8000-8999 |
| 🧠 **Mental Health** | 33 | 9200-9499 |
| 🦷 **Dental & Oral** | 5 | 9900-9999 |
| 📋 **Other** | 2 | Various |

Each analysis shows:
- Evidence summary with symptom frequency and metrics
- Supported rating percentage based on documentation
- **Understanding Your Rating** - Educational content explaining:
    - Evidence the VA looks for
    - What each rating level means in daily life
    - Documentation tips to strengthen your claim
    - Key medical/VA terminology
- Documentation gaps to address
- Official VA rating schedule for reference
- Crisis resources when severe symptoms detected

### Body System Navigation (New in v2.0)
- **Collapsible groups** organized by VA body system
- **Accordion behavior** - one group open at a time for easy navigation
- **Auto-scroll** - newly opened groups scroll into view
- **Condition counts** - see how many conditions you're tracking per system
- **Color-coded** - visual consistency throughout the app

### Standardized Rating Colors (New in v2.0)
Visual heat map showing rating severity at a glance:

| Rating | Color | Severity |
|--------|-------|----------|
| **100%** | ![#ef4444](https://img.shields.io/badge/-%20-ef4444) Red | Total disability |
| **90%** | ![#f43f5e](https://img.shields.io/badge/-%20-f43f5e) Rose | Near-total |
| **80%** | ![#f97316](https://img.shields.io/badge/-%20-f97316) Orange | Very severe |
| **70%** | ![#f59e0b](https://img.shields.io/badge/-%20-f59e0b) Amber | Severe |
| **60%** | ![#eab308](https://img.shields.io/badge/-%20-eab308) Yellow | Moderately severe |
| **50%** | ![#84cc16](https://img.shields.io/badge/-%20-84cc16) Lime | Moderate-high |
| **40%** | ![#22c55e](https://img.shields.io/badge/-%20-22c55e) Green | Moderate |
| **30%** | ![#14b8a6](https://img.shields.io/badge/-%20-14b8a6) Teal | Mild-moderate |
| **20%** | ![#06b6d4](https://img.shields.io/badge/-%20-06b6d4) Cyan | Mild |
| **10%** | ![#3b82f6](https://img.shields.io/badge/-%20-3b82f6) Blue | Minimal |
| **0%** | ![#64748b](https://img.shields.io/badge/-%20-64748b) Slate | Non-compensable |

*Colors progress from cool (blue) to warm (red) as disability severity increases.*


### Safety Features
- **Crisis detection** - Automatic detection of severe mental health symptoms
- **Veterans Crisis Line** info prominently displayed (988 → 1)
- **Professional evaluation emphasis** - Clear disclaimers about medical guidance

### Data Management
- **Export to PDF/CSV** with professional formatting
- **Backup/restore** your complete symptom history
- **Medication tracking** with effectiveness correlation
- **Appointment logging** with discussion notes
- **Multi-profile support** for caregivers managing multiple veterans
- **Complete data deletion** when needed

### Progressive Web App
- **Install on any device** (mobile, tablet, desktop)
- **Offline functionality** - works without internet
- **Daily reminders** - configurable notification times
- **Dark mode** - easier on the eyes

## 🚀 Getting Started

### Quick Start (No Installation)
Visit the deployed app: [veteran-symptom-tracker.vercel.app](https://veteran-symptom-tracker.vercel.app)

Click "Install" in your browser to add to your home screen.

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/veteran-symptom-tracker.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Installation

### Mobile (iOS/Android)
1. Open the app in your browser
2. Look for "Add to Home Screen" or "Install" prompt
3. Tap to install - app works offline

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or: Menu → Install Doc Bear's Symptom Vault
3. App opens in its own window

## 🔒 Privacy & Data

**Your data stays on YOUR device:**
- No server uploads - everything stored locally
- No tracking or analytics
- No account required
- Export anytime, delete anytime

**Data Storage:**
- Browser localStorage (survives app updates)
- Manual backup recommended before major updates
- Export to PDF/CSV for external records

## 📊 Using Rating Evidence

### How It Works
1. Log symptoms consistently (daily/weekly recommended)
2. Include detailed notes about functional impact
3. Navigate to "Trends" tab → Rating Evidence section
4. Expand body system groups to find your conditions
5. Review analysis and educational content
6. Address documentation gaps shown

### Understanding Your Rating (New in v2.0)
Each condition now includes educational content:
- **Evidence Requirements** - What the VA specifically looks for
- **Rating Level Meanings** - Real-world impact at each percentage
- **Documentation Tips** - How to strengthen your claim
- **Terminology** - Key medical and VA terms explained

### Tips for Strong Documentation
✅ Log consistently over 3+ months  
✅ Include functional impact (work, relationships, daily tasks)  
✅ Note medication effectiveness  
✅ Document flare-ups and triggers  
✅ Track objective measurements when applicable  
✅ Connect symptoms to service (in notes)  
✅ Review "Understanding Your Rating" for each condition

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: Workbox + Web App Manifest
- **Charts**: Recharts
- **Export**: jsPDF + PapaParse
- **Deployment**: Vercel

## 📖 VA Rating Criteria Reference

All conditions are rated according to **38 CFR Part 4 - Schedule for Rating Disabilities**.

**Mental Health Conditions** use the General Rating Formula (38 CFR 4.130):
- **100%** - Total occupational and social impairment
- **70%** - Deficiencies in most areas (work, school, family, mood)
- **50%** - Reduced reliability and productivity
- **30%** - Occasional decrease in work efficiency
- **10%** - Mild or transient symptoms, or medication-controlled
- **0%** - Diagnosed but symptoms not severe enough to interfere

**Physical Conditions** have unique criteria based on:
- Frequency of symptoms/episodes
- Functional limitations
- Treatment requirements
- Objective measurements (where applicable)

See Rating Evidence tab for condition-specific criteria.

## 📈 Version History

### Version 2.0 (December 2024)
- ✨ 185+ conditions with full rating analysis
- 📚 Educational content for 170+ conditions
- 🗂️ Body system grouping with accordion navigation
- 🎨 Standardized 10% increment color scheme
- 🐛 45+ bug fixes and improvements
- 📊 95%+ VA diagnostic code coverage

### Version 1.x (2024)
- Core symptom tracking functionality
- Initial rating evidence analysis
- PDF/CSV export
- PWA capabilities

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 🤝 Contributing

This project was built by a Veteran for Veterans. Contributions welcome:

- **Feedback** - Open an issue with suggestions
- **New conditions** - Submit PR with rating criteria from 38 CFR Part 4
- **Bug reports** - Detailed reports help us fix faster
- **Documentation** - Help improve guides and explanations

## ⚠️ Important Disclaimers

**This app is for documentation purposes only:**
- Not a substitute for medical care
- Not a VA claims filing tool
- VA makes final rating determinations
- Seek professional help for mental health concerns

**Crisis Resources:**
- Veterans Crisis Line: **988 → 1**
- Text: **838255**
- Chat: **VeteransCrisisLine.net/chat**

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

Built with input from:
- VA-accredited claims representatives
- Clinical psychotherapists
- Caregivers supporting veterans
- Veterans navigating the claims process
- Fellow developers in the veteran community

---

**Doc Bear Enterprises, LLC** - *Helping Veterans document their journey*

**Version 2.0** | December 2024

For questions or support: [Create an issue](https://github.com/yourusername/veteran-symptom-tracker/issues)