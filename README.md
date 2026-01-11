# Doc Bear's Symptom Vault

A Progressive Web App designed to help Veterans document symptoms for VA disability claims. Track symptoms, correlate with VA rating criteria, and build comprehensive evidence for disability evaluations.

![Doc Bear Enterprises](public/icon-512.png)

**Version 2.5** | **185+ Conditions** | **240+ Diagnostic Codes** | **95%+ VA Coverage**

---

## 🎯 Purpose

Veterans navigating VA disability claims often struggle to document symptoms comprehensively. This app helps by:

- **Structured symptom logging** aligned with VA rating schedules
- **Evidence correlation** showing which ratings your documentation supports
- **Educational content** explaining what the VA looks for in each condition
- **Case law references** citing landmark decisions that support claims
- **Professional documentation** exportable for medical providers and claims
- **Privacy-first** - all data stored locally on your device

---

## ✨ Features

### Symptom Tracking
- **Quick Log** - Chronic symptoms for fast daily logging
- **Quick Actions Menu** (NEW in v2.5) - Floating button for one-tap logging from any screen
- **Detailed tracking** with severity, duration, triggers, and impact notes
- **960+ individual symptoms** across 14 body systems
- **Condition-specific fields** for accurate documentation:
    - Migraine: prostrating attacks, duration, work impact
    - Sleep: hours slept, quality, interruptions, nightmares
    - PTSD: flashbacks, hypervigilance, triggers, avoidance
    - Pain: location, radiation, type, affected activities
    - And many more...

### Rating Evidence Analysis
Correlates your logged symptoms with official VA rating criteria from 38 CFR Part 4:

**Body System Coverage (v2.5):**

| Body System                | Conditions | DC Codes  |
|----------------------------|------------|-----------|
| 🦴 **Musculoskeletal**     | 28         | 5000-5299 |
| 🫁 **Respiratory**         | 10         | 6000-6099 |
| 👁️ **Eye & Ear**          | 12         | 6100-6299 |
| 🦠 **Infectious Diseases** | 12         | 6300-6399 |
| ❤️ **Cardiovascular**      | 13         | 7000-7199 |
| 🫃 **Digestive**           | 16         | 7200-7399 |
| 🫘 **Genitourinary**       | 12         | 7500-7699 |
| 🩸 **Hemic & Lymphatic**   | 16         | 7700-7799 |
| 🧴 **Skin**                | 13         | 7800-7899 |
| 🦋 **Endocrine**           | 10         | 7900-7999 |
| ⚡ **Neurological**         | 38         | 8000-8999 |
| 🧠 **Mental Health**       | 33         | 9200-9499 |
| 🦷 **Dental & Oral**       | 5          | 9900-9999 |
| 📋 **Other/ADL**           | 10+        | Various   |

Each analysis shows:
- Evidence summary with symptom frequency and metrics
- Supported rating percentage based on documentation
- **Understanding Your Rating** - Educational content explaining:
    - Evidence the VA looks for
    - What each rating level means in daily life
    - Documentation tips to strengthen your claim
    - Key medical/VA terminology
- **Rating Enhancements** (NEW in v2.2):
    - Key VA/BVA definitions
    - Relevant case law citations
    - Service connection methods
- Documentation gaps to address
- Official VA rating schedule for reference
- Crisis resources when severe symptoms detected

### Service Connection Guide (New in v2.2)
Educational content on four methods of establishing service connection:
- **Direct Service Connection** - Injury/illness during service
- **Secondary Service Connection** - Caused by existing SC condition
- **Presumptive Service Connection** - Exposure-based presumptions
- **Aggravation** - Pre-existing condition worsened by service

### Case Law Integration (New in v2.2)
16+ landmark veterans law cases integrated throughout the app:
- **Bufkin v. Collins (2025)** - Benefit of the doubt changes
- **Gilbert v. Derwinski (1990)** - Original benefit of the doubt
- **Pierce v. Principi (2004)** - Migraine economic inadaptability
- **Fountain v. McDonald (2015)** - Tinnitus as organic disease
- And many more...

### Caregiver Support (New in v2.3)
**PCAFC Guide** for caregiver profile users:
- Program eligibility requirements
- ADL (Activities of Daily Living) tracking
- Stipend level information
- Benefits breakdown
- Application process guidance

### Accessibility Features (New in v2.5)
Full accessibility controls for inclusive design:
- **Font Size Adjustment** - Small to Extra Large
- **High Contrast Mode** - Enhanced visibility
- **Reduced Motion** - Minimize animations
- **Screen Reader Optimized** - Enhanced focus indicators
- **WCAG 2.1 AA Compliance**

### Body System Navigation
- **Collapsible groups** organized by VA body system
- **Accordion behavior** - one group open at a time for easy navigation
- **Auto-scroll** - newly opened groups scroll into view
- **Condition counts** - see how many conditions you're tracking per system
- **Color-coded** - visual consistency throughout the app

### Safety Features
- **Crisis detection** - Automatic detection of severe mental health symptoms
- **Veterans Crisis Line** info prominently displayed (988 → 1)
- **Professional evaluation emphasis** - Clear disclaimers about medical guidance

### Data Management
- **Export to PDF/CSV** with professional formatting
- **VA Claim Package PDF** - Complete evidence package for claims
- **Backup/restore** your complete symptom history
- **Medication tracking** with effectiveness correlation
- **Appointment logging** with discussion notes
- **Multi-profile support** for caregivers managing multiple veterans
- **Complete data deletion** when needed

### Additional Tools
- **Rating Scenario Calculator** - Estimate combined ratings
- **SMC Calculator** - Special Monthly Compensation eligibility
- **Secondary Conditions Guide** - Discover related conditions to claim
- **Presumptive Conditions Guide** - Exposure-based presumptions
- **MOS Noise Exposure Lookup** - Tinnitus/hearing loss support
- **C&P Exam Prep** - Checklist and resources
- **Buddy Statement Generator** - Create supporting statements

### Progressive Web App
- **Install on any device** (mobile, tablet, desktop)
- **Offline functionality** - works without internet
- **Daily reminders** - configurable notification times
- **Dark mode** - easier on the eyes

---

## 🚀 Getting Started

### Quick Start (No Installation)
Visit the deployed app: [veteran-symptom-tracker.vercel.app](https://veteran-symptom-tracker.vercel.app)

Click "Install" in your browser to add to your home screen.

### Local Development

```bash
# Clone the repository
git clone https://github.com/DocBear71/veteran-symptom-tracker.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Installation

### Mobile (iOS/Android)
1. Open the app in your browser
2. Look for "Add to Home Screen" or "Install" prompt
3. Tap to install - app works offline

### Desktop (Chrome/Edge)
1. Click the installation icon in the address bar
2. Or: Menu → Install Doc Bear's Symptom Vault
3. App opens in its own window

---

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

---

## 📊 Using Rating Evidence

### How It Works
1. Log symptoms consistently (daily/weekly recommended)
2. Include detailed notes about functional impact
3. Navigate to "Trends" tab → Rating Evidence section
4. Expand body system groups to find your conditions
5. Review analysis and educational content
6. Address documentation gaps shown

### Tips for Strong Documentation
✅ Log consistently over 3+ months  
✅ Include functional impact (work, relationships, daily tasks)  
✅ Note medication effectiveness  
✅ Document flare-ups and triggers  
✅ Track objective measurements when applicable  
✅ Connect symptoms to service (in notes)  
✅ Review case law references for your conditions  
✅ Understand service connection methods

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: Workbox + Web App Manifest
- **Charts**: Recharts
- **Export**: jsPDF + PapaParse
- **Deployment**: Vercel

---

## 📈 Version History

### Version 2.5 (January 2025)
- ✨ Quick Actions Menu (floating action button)
- ♿ Full accessibility settings (font size, contrast, motion)
- 🎯 WCAG 2.1 AA compliance improvements
- 🔧 Collapsible settings sections

### Version 2.3 (January 2025)
- 👨‍👩‍👧 PCAFC Caregiver Program Guide
- 📋 ADL tracking integration

### Version 2.2 (January 2025)
- ⚖️ Case law integration (16+ landmark cases)
- 📚 Service Connection Guide
- 🔍 Rating Enhancements system
- ⚠️ Bufkin v. Collins warning integration

### Version 2.0 (December 2024)
- ✨ 185+ conditions with full rating analysis
- 📚 Educational content for 170+ conditions
- 🗂️ Body system grouping with accordion navigation
- 🎨 Standardized 10% increment color scheme
- 📊 95%+ VA diagnostic code coverage

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## 🤝 Contributing

This project was built by a Veteran for Veterans. Contributions welcome:

- **Feedback** - Open an issue with suggestions
- **Bug reports** - Detailed reports help us fix faster
- **Documentation** - Help improve guides and explanations

---

## ⚠️ Important Disclaimers

**This app is for documentation purposes only:**
- Not a substitute for medical care
- Not a VA claims filing tool
- VA makes final rating determinations
- Seek professional help for mental health concerns

**Important Legal Notice (Bufkin v. Collins, March 2025):**
The "benefit of the doubt" doctrine has changed. Veterans must now build comprehensive evidence from the start - close evidence is no longer sufficient.

**Crisis Resources:**
- Veterans Crisis Line: **988 → Press 1**
- Text: **838255**
- Chat: **VeteransCrisisLine.net/chat**

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Acknowledgments

Built with input from:
- VA-accredited claims representatives
- Clinical psychotherapists
- Caregivers supporting veterans
- Veterans navigating the claims process
- Fellow developers in the veteran community

---

**Doc Bear Enterprises, LLC** - *Helping Veterans document their journey*

**Version 2.5** | January 2025

For questions or support: [Create an issue](https://github.com/DocBear71/veteran-symptom-tracker/issues)