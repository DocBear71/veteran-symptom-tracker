# Veteran Symptom Tracker

A Progressive Web App designed to help Veterans document symptoms for VA disability claims. Track symptoms, correlate with VA rating criteria, and build comprehensive evidence for disability evaluations.

![Doc Bear Enterprises](public/icon512.png)

## 🎯 Purpose

Veterans navigating VA disability claims often struggle to document symptoms comprehensively. This app helps by:

- **Structured symptom logging** aligned with VA rating schedules
- **Evidence correlation** showing which ratings your documentation supports
- **Professional documentation** exportable for medical providers and claims
- **Privacy-first** - all data stored locally on your device

## ✨ Features

### Symptom Tracking
- **Quick Log** - Favorite symptoms for fast daily logging
- **Detailed tracking** with severity, duration, triggers, and impact notes
- **Condition-specific fields**:
    - Migraine: prostrating attacks, duration, work impact
    - Sleep: hours slept, quality, interruptions, nightmares
    - PTSD: flashbacks, hypervigilance, triggers, avoidance
    - Pain: location, radiation, type, affected activities

### Rating Evidence Analysis
Correlates your logged symptoms with official VA rating criteria:

**Currently Supported Conditions:**
- 🤕 **Migraine (DC 8100)** - Prostrating attack frequency
- 😴 **Sleep Apnea (DC 6847)** - Treatment status & effectiveness
- 🧠 **PTSD (DC 9411)** - General Rating Formula for Mental Disorders
- 😔 **Major Depressive Disorder (DC 9434)** - General Rating Formula
- 😰 **Generalized Anxiety Disorder (DC 9400)** - General Rating Formula
- 😱 **Panic Disorder (DC 9412)** - General Rating Formula
- 🎭 **Bipolar Disorder (DC 9432)** - General Rating Formula

Each analysis shows:
- Evidence summary with symptom frequency
- Supported rating percentage based on documentation
- Documentation gaps to strengthen your claim
- Official VA rating schedule for reference
- Crisis resources when severe symptoms detected

### Safety Features
- **Crisis detection** - Automatic detection of severe mental health symptoms
- **Veterans Crisis Line** info prominently displayed (988 → 1)
- **Professional evaluation emphasis** - Clear disclaimers about medical guidance

### Data Management
- **Export to PDF/CSV** with professional formatting
- **Backup/restore** your complete symptom history
- **Medication tracking** with effectiveness correlation
- **Appointment logging** with discussion notes
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
2. Or: Menu → Install Veteran Symptom Tracker
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
3. Navigate to "Rating Evidence" tab
4. Review analysis for each condition
5. Address documentation gaps shown

### Understanding Ratings

**Mental Health Conditions** (PTSD, Depression, Anxiety, Bipolar):
- Based on **functional impairment**, not symptom count
- Focus on work/social impact in notes
- Panic frequency >1/week is key threshold for 50%+
- Professional evaluation always required

**Physical Conditions**:
- Migraine: prostrating attacks per month
- Sleep Apnea: treatment type and effectiveness

### Tips for Strong Documentation
✅ Log consistently over 3+ months  
✅ Include functional impact (work, relationships, daily tasks)  
✅ Note medication effectiveness  
✅ Document flare-ups and triggers  
✅ Connect symptoms to service (in notes)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: Workbox + Web App Manifest
- **Charts**: Recharts
- **Export**: jsPDF + PapaParse
- **Deployment**: Vercel

## 📖 VA Rating Criteria Reference

All mental health conditions use the **General Rating Formula for Mental Disorders** (38 CFR 4.130):

- **100%** - Total occupational and social impairment
- **70%** - Deficiencies in most areas (work, school, family, mood)
- **50%** - Reduced reliability and productivity
- **30%** - Occasional decrease in work efficiency
- **10%** - Mild or transient symptoms, or medication-controlled
- **0%** - Diagnosed but symptoms not severe enough to interfere

Physical conditions have unique criteria - see Rating Evidence tab for details.

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
- Mental health professionals
- Veterans navigating the claims process
- Fellow developers in the veteran community

---

**Doc Bear Enterprises, LLC** - *Helping Veterans document their journey*

For questions or support: [Create an issue](https://github.com/yourusername/veteran-symptom-tracker/issues)