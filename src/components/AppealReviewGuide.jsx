// AppealReviewGuide.jsx
// HLR / Appeal & Decision Review Guide
// Card #9 in the C&P Resources hub
//
// Covers:
//   1. Decision Review Lane Selector (HLR vs Supplemental Claim vs Board Appeal)
//   2. HLR Argument Builder (5 error types)
//   3. Board Appeal guide (NOD, three dockets, BVA hearing prep)
//   4. Deadline tracker awareness
//
// Regulatory sources:
//   - 38 CFR § 3.103, § 3.2601
//   - VA.gov/decision-reviews/higher-level-review (March 2026)
//   - VA M21-1 guidance
//   - Doug Haynes (howvadisabilityratingswork.com) FAQ
//
// IMPORTANT: This tool provides educational guidance only. It does not
// constitute legal advice. Veterans should work with an accredited VSO,
// attorney, or claims agent before filing any appeal.

import React, { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const LANES = [
  {
    id: 'hlr',
    name: 'Higher-Level Review',
    abbr: 'HLR',
    form: 'VA Form 20-0996',
    formUrl: 'https://www.va.gov/forms/20-0996',
    deadline: '1 year from decision date',
    processingTime: '~125 days (4–5 months)',
    color: 'blue',
    icon: '🔍',
    tagline: 'Fix VA errors using evidence already in your file',
    bestWhen: [
      'VA missed favorable evidence already submitted',
      'Wrong rating criteria applied to documented symptoms',
      'Wrong effective date despite clear timeline in the record',
      'C&P exam was internally inconsistent or inadequate',
      'You have no new evidence to add',
    ],
    notFor: [
      'You have new evidence (new diagnosis, nexus letter, imaging)',
      'You already had an HLR or Board Appeal on this same issue',
      'Your claim is a contested claim',
    ],
    keyFact: 'You CANNOT submit new evidence. The reviewer looks only at what was already in your file.',
  },
  {
    id: 'supplemental',
    name: 'Supplemental Claim',
    abbr: 'SC',
    form: 'VA Form 20-0995',
    formUrl: 'https://www.va.gov/decision-reviews/supplemental-claim',
    deadline: '1 year to preserve effective date (can file anytime)',
    processingTime: '~125 days (varies)',
    color: 'green',
    icon: '📄',
    tagline: 'Add new and relevant evidence to change the decision',
    bestWhen: [
      'You have new evidence: updated imaging, nexus letter, buddy statements',
      'You received a new diagnosis after the denial',
      'You have new treatment records or private medical opinions',
      'Your condition has worsened and you have documentation',
    ],
    notFor: [
      'You only want to argue the VA made a legal error — use HLR',
      'Your "new" evidence is not relevant to the denied issue',
    ],
    keyFact: 'New evidence must be "new AND relevant" — not just new. A nexus letter is the most powerful new evidence for denied service connection.',
  },
  {
    id: 'board',
    name: 'Board Appeal',
    abbr: 'BVA',
    form: 'VA Form 10182',
    formUrl: 'https://www.va.gov/vaforms/va/pdf/VA10182.pdf',
    deadline: '1 year from decision date (NOD)',
    processingTime: '18–36 months average (2022 data)',
    color: 'purple',
    icon: '⚖️',
    tagline: 'Get a Veterans Law Judge to review your case',
    bestWhen: [
      'HLR and/or Supplemental Claim have already been exhausted',
      'You want a formal hearing before a Veterans Law Judge',
      'Your case involves complex legal or factual questions',
      'You disagree with the HLR decision',
    ],
    notFor: [
      'You want a fast resolution — Board Appeals take years',
      'You have new evidence and haven\'t tried a Supplemental Claim',
    ],
    keyFact: 'A large majority of Board Appeals are remanded back to the Regional Office for correction, not outright granted or denied.',
  },
];

const HLR_ARGUMENTS = [
  {
    id: 'missed-evidence',
    title: 'VA Overlooked Favorable Evidence',
    icon: '📂',
    description: 'The VA said something was missing, but it was already in your file.',
    details: 'This is one of the strongest HLR arguments. You point to the exact document, page, and date — then show how it supports the element the VA said was absent (current diagnosis, in-service event, nexus, severity).',
    exampleFrame: 'The VA said "no current diagnosis," but the VA treatment note dated [DATE] lists the diagnosis and ongoing medication on page [X] of the C-File.',
    whatToDocument: [
      'Exact document name and date in your C-File',
      'Which element the VA said was missing',
      'Page/section where the evidence appears',
      'Quote or summary of what the document says',
    ],
    regulatoryBasis: '38 CFR § 3.103 — VA duty to assist and consider all evidence of record',
  },
  {
    id: 'inadequate-exam',
    title: 'C&P Exam Was Inadequate',
    icon: '🏥',
    description: 'The C&P examiner\'s opinion was flawed, internally inconsistent, or ignored lay evidence.',
    details: 'You don\'t need a new exam to argue the existing one is flawed. Common problems: examiner ignored lay statements, used the wrong standard, gave conclusions with no reasoning, or contradicted themselves.',
    exampleFrame: 'The examiner noted flare-ups in the report, but then wrote "no functional loss" without explaining the contradiction. The VA adopted this inconsistent opinion.',
    whatToDocument: [
      'Exact quote from the exam showing the inconsistency',
      'Lay statements or treatment records the examiner ignored',
      'What reasoning the examiner failed to provide',
      'The standard the examiner should have applied',
    ],
    regulatoryBasis: 'Barr v. Nicholson, 21 Vet. App. 303 (2007) — inadequate exam must be remanded',
  },
  {
    id: 'wrong-criteria',
    title: 'Wrong Rating Criteria Applied',
    icon: '📊',
    description: 'Your symptoms clearly match a higher rating level, but the VA applied the wrong tier.',
    details: 'Ratings are rule-based. If your documented symptoms match a higher percentage under the rating schedule, you can point directly to the CFR language and show where your evidence meets it. Tight comparisons work better than frustration.',
    exampleFrame: 'The 30% criteria requires [X symptom]. The VA treatment record dated [DATE] documents [X symptom] on [Y occasions]. The VA applied 10% without explaining why 30% was rejected.',
    whatToDocument: [
      'Exact CFR language for the higher rating tier',
      'Evidence in your file showing you meet that tier',
      'What the VA\'s decision said about the higher tier',
      'What reasoning (if any) the VA gave for rejecting it',
    ],
    regulatoryBasis: '38 CFR Part 4 — VA Schedule for Rating Disabilities; 38 CFR § 4.7 — benefit of the doubt',
  },
  {
    id: 'wrong-date',
    title: 'Wrong Effective Date',
    icon: '📅',
    description: 'The VA assigned a later effective date than your claim history supports.',
    details: 'Effective date errors can be expensive — the difference between one date and another can be worth thousands in back pay. A senior reviewer can correct an effective date when the claim timeline already proves it.',
    exampleFrame: 'The VA assigned an effective date of [DATE B] based on a later exam, but the earlier claim dated [DATE A] and treatment records already showed entitlement to the benefit. The effective date should be [DATE A].',
    whatToDocument: [
      'Date of your original claim or intent to file',
      'Date of the first treatment record showing the condition',
      'What the VA used to set the effective date',
      'Why an earlier date is supported by the record',
    ],
    regulatoryBasis: '38 CFR § 3.400 — effective dates; 38 CFR § 3.155 — informal claims',
  },
  {
    id: 'duty-assist',
    title: 'Duty-to-Assist Error',
    icon: '⚠️',
    description: 'The VA failed to obtain federal records, order the right exam, or gather required evidence.',
    details: 'The VA has a legal duty to help you develop your claim. If they didn\'t get your STRs, ordered the wrong exam, failed to obtain VA treatment records, or didn\'t notify you of missing evidence — that\'s a duty-to-assist error. The HLR reviewer can flag this and send it back for correction.',
    exampleFrame: 'The decision references the separation exam, but that exam is not in the C-File. The VA had a duty to attempt to obtain it. This duty-to-assist error should be corrected before a final decision.',
    whatToDocument: [
      'What records the VA was supposed to get but didn\'t',
      'What exam should have been ordered',
      'Evidence that the VA was aware of the missing records',
      'How the missing evidence would affect the decision',
    ],
    regulatoryBasis: '38 CFR § 3.159 — duty to assist; 38 U.S.C. § 5103A',
  },
];

const BOARD_DOCKETS = [
  {
    id: 'direct',
    name: 'Direct Review',
    icon: '➡️',
    description: 'No new evidence, no hearing. A Veterans Law Judge reviews your existing file.',
    timeline: 'Fastest of the three dockets',
    bestFor: 'Clear legal errors where the record is complete',
    tradeoff: 'No opportunity to add evidence or testify',
  },
  {
    id: 'evidence',
    name: 'Evidence Submission',
    icon: '📎',
    description: 'You can submit new evidence within 90 days of filing the NOD, but no hearing.',
    timeline: 'Moderate — longer than Direct Review',
    bestFor: 'When you have new evidence but don\'t need to testify',
    tradeoff: 'New evidence window is limited; no in-person hearing',
  },
  {
    id: 'hearing',
    name: 'Hearing Request',
    icon: '🎤',
    description: 'Request a formal hearing before a Veterans Law Judge (VLJ) at the BVA.',
    timeline: 'Slowest — 18–36 months typical wait (2022 data)',
    bestFor: 'Complex cases, opportunity to testify, lay witnesses',
    tradeoff: 'Significant wait time; must prepare testimony and evidence',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
);

const DisclaimerBanner = () => (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">***</span>
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Educational Guidance Only — Not Legal Advice
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            This tool provides educational information about the VA appeals process based on publicly available
            regulations and guidance. It does not constitute legal advice. Work with an accredited VSO, attorney,
            or claims agent before filing any appeal. Every case is different.
          </p>
        </div>
      </div>
    </div>
);

const LaneCard = ({ lane, isSelected, onSelect }) => {
  const colorMap = {
    blue: {
      bg: isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800',
      border: isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700',
      badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      icon: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      title: isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white',
    },
    green: {
      bg: isSelected ? 'bg-green-50 dark:bg-green-900/30' : 'bg-white dark:bg-gray-800',
      border: isSelected ? 'border-green-500' : 'border-gray-200 dark:border-gray-700',
      badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      icon: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      title: isSelected ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white',
    },
    purple: {
      bg: isSelected ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-white dark:bg-gray-800',
      border: isSelected ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700',
      badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
      icon: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      title: isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white',
    },
  };
  const c = colorMap[lane.color];

  return (
      <button
          onClick={() => onSelect(lane.id === isSelected ? null : lane.id)}
          className={`text-left w-full p-4 rounded-lg border-2 transition-all ${c.bg} ${c.border}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center flex-shrink-0 text-xl`}>
            {lane.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`font-semibold ${c.title}`}>{lane.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{lane.form}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{lane.tagline}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Deadline: {lane.deadline} &nbsp;·&nbsp; Processing: {lane.processingTime}
            </p>
          </div>
          <span className="text-gray-400 dark:text-gray-500 text-lg flex-shrink-0">
          {isSelected === lane.id ? '▲' : '▼'}
        </span>
        </div>

        {isSelected === lane.id && (
            <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Key fact */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Key Rule</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{lane.keyFact}</p>
              </div>

              {/* Best when */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Use this lane when:</p>
                <ul className="space-y-1">
                  {lane.bestWhen.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                        {item}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Not for */}
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Not the right lane when:</p>
                <ul className="space-y-1">
                  {lane.notFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                        {item}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Form link */}
              <div className="flex items-center gap-2 pt-1">
                <a
                    href={lane.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-xs text-blue-600 dark:text-blue-400 underline"
                >
                  Get {lane.form} →
                </a>
              </div>
            </div>
        )}
      </button>
  );
};

const HLRArgumentCard = ({ arg, isExpanded, onToggle }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
          onClick={onToggle}
          className="w-full text-left p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start gap-3"
      >
        <span className="text-xl flex-shrink-0">{arg.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{arg.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{arg.description}</p>
        </div>
        <span className="text-gray-400 flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
          <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-800/50 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* How to use it */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">How to use this argument</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{arg.details}</p>
            </div>

            {/* Example framing */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Example framing (adapt to your facts)</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 italic">"{arg.exampleFrame}"</p>
            </div>

            {/* What to document */}
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">What to document in your argument</p>
              <ul className="space-y-1">
                {arg.whatToDocument.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                ))}
              </ul>
            </div>

            {/* Regulatory basis */}
            <div className="text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-600">
              Regulatory basis: {arg.regulatoryBasis}
            </div>
          </div>
      )}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AppealReviewGuide = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('lane-selector');
  const [selectedLane, setSelectedLane] = useState(null);
  const [expandedArg, setExpandedArg] = useState(null);
  const [expandedDocket, setExpandedDocket] = useState(null);

  const tabs = [
    { id: 'lane-selector', label: 'Choose Your Lane', icon: '🗺️' },
    { id: 'hlr-arguments', label: 'HLR Arguments', icon: '🔍' },
    { id: 'board-appeal', label: 'Board Appeal', icon: '⚖️' },
  ];

  return (
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-start gap-3">
            <span className="text-4xl">⚖️</span>
            <div>
              <h2 className="text-xl font-bold">Decision Review & Appeal Guide</h2>
              <p className="text-slate-300 dark:text-gray-400 text-sm mt-1">
                HLR · Supplemental Claim · Board Appeal
              </p>
              <p className="text-slate-400 dark:text-gray-500 text-xs mt-2">
                Based on 38 CFR § 3.103, VA.gov (March 2026), and VA appeals guidance
              </p>
            </div>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Deadline Alert */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⏰</span>
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                Critical Deadline: 1 Year from Decision Date
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                For HLR and Board Appeal, you generally have <strong>1 year from the date on your decision letter</strong> to
                file and preserve your effective date. Don't wait for the last month — if you miss the window,
                you lose the effective date and must start a new claim. Supplemental Claims can be filed anytime
                but filing within 1 year preserves your original effective date.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                      activeTab === tab.id
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
          ))}
        </div>

        {/* ── Tab: Lane Selector ── */}
        {activeTab === 'lane-selector' && (
            <div className="space-y-4">
              <SectionHeader
                  icon="🗺️"
                  title="Which Lane Is Right for You?"
                  subtitle="The Appeals Modernization Act (AMA) gives veterans three review lanes. Choosing correctly matters — picking the wrong one wastes time and may hurt your effective date."
              />

              {/* Quick decision helper */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Quick decision guide</p>
                <div className="space-y-2 text-left">
                  {[
                    { q: 'Do you have new evidence to submit?', a: 'Yes → Supplemental Claim', aNo: 'No → keep reading' },
                    { q: 'Did the VA make a clear factual or legal error using existing evidence?', a: 'Yes → Higher-Level Review (HLR)', aNo: 'No → keep reading' },
                    { q: 'Have you already tried HLR or SC on this issue?', a: 'Yes → Board Appeal', aNo: 'No → go back to first question' },
                  ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600 dark:text-gray-400">
                    {i + 1}
                  </span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{item.q}</p>
                          <p className="text-green-600 dark:text-green-400">{item.a}</p>
                          <p className="text-gray-400 dark:text-gray-500">{item.aNo}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Lane cards */}
              <div className="space-y-3">
                {LANES.map(lane => (
                    <LaneCard
                        key={lane.id}
                        lane={lane}
                        isSelected={selectedLane}
                        onSelect={setSelectedLane}
                    />
                ))}
              </div>

              {/* Cannot do after HLR note */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Important restriction:</strong> You cannot request an HLR after a previous HLR or Board Appeal
                  on the same issue. The VA will return your form without processing it. If HLR is closed on an issue,
                  your next options are Supplemental Claim (new evidence) or Board Appeal.
                </p>
              </div>
            </div>
        )}

        {/* ── Tab: HLR Arguments ── */}
        {activeTab === 'hlr-arguments' && (
            <div className="space-y-4">
              <SectionHeader
                  icon="🔍"
                  title="HLR Winning Arguments"
                  subtitle="Because you can't add new evidence, every HLR argument must be tied to what's already in your C-File. These are the five categories that senior reviewers can act on."
              />

              {/* Informal conference tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">📞</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      Request an Informal Conference
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      On VA Form 20-0996, you can request an informal conference with the senior reviewer.
                      This is not a formal hearing — you can't submit new evidence — but you can point the
                      reviewer to exactly where in the file the error is. Treat it like brief oral argument:
                      issue, what the record shows, what the VA got wrong. The VA will make two attempts
                      to contact you; missed calls mean they proceed without the conference.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                      Note: Requesting a conference may add time to processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* One-page argument tip */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  How to structure your written argument
                </p>
                <ol className="space-y-1 text-left">
                  {[
                    'State the issue clearly (e.g., "Service connection for migraines, denied [DATE]")',
                    'State what the VA decided and what the decision said',
                    'Point to the exact record that shows the error (document, date, page)',
                    'State what the VA should have decided and why',
                  ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-gray-500 flex-shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-left">
                  Keep it to one page per issue. Reviewers process many cases — the clearer your argument, the better.
                </p>
              </div>

              {/* Argument cards */}
              <div className="space-y-2">
                {HLR_ARGUMENTS.map(arg => (
                    <HLRArgumentCard
                        key={arg.id}
                        arg={arg}
                        isExpanded={expandedArg === arg.id}
                        onToggle={() => setExpandedArg(expandedArg === arg.id ? null : arg.id)}
                    />
                ))}
              </div>

              {/* What not to argue */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  What NOT to argue in an HLR
                </p>
                <ul className="space-y-1 text-left">
                  {[
                    '"I now have a new diagnosis" — this is a Supplemental Claim, not an HLR',
                    '"I got a new MRI/nexus letter" — new evidence means wrong lane',
                    '"I feel the decision was unfair" — you need a specific factual or legal error',
                    '"My condition has gotten worse" — this is a new/increased rating claim',
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                        <span className="flex-shrink-0 mt-0.5">✕</span>
                        {item}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Possible HLR outcomes</p>
                <div className="space-y-2 text-left">
                  {[
                    { icon: '✓', color: 'text-green-600 dark:text-green-400', label: 'Granted', desc: 'Reviewer disagrees with the prior decision and decides in your favor' },
                    { icon: '✕', color: 'text-red-500 dark:text-red-400', label: 'Denied', desc: 'Reviewer finds the prior decision was correct' },
                    { icon: '↩', color: 'text-amber-500 dark:text-amber-400', label: 'Duty-to-Assist Error', desc: 'Reviewer finds VA didn\'t properly develop the claim — sent back to RO for correction' },
                  ].map((outcome, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`font-bold flex-shrink-0 ${outcome.color}`}>{outcome.icon}</span>
                        <div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{outcome.label}: </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{outcome.desc}</span>
                        </div>
                      </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  If you disagree with the HLR decision: you can request a Board Appeal or file a Supplemental Claim
                  if you have new evidence. A new HLR on the same issue is not permitted.
                </p>
              </div>
            </div>
        )}

        {/* ── Tab: Board Appeal ── */}
        {activeTab === 'board-appeal' && (
            <div className="space-y-4">
              <SectionHeader
                  icon="⚖️"
                  title="Board of Veterans' Appeals (BVA)"
                  subtitle="A Notice of Disagreement (NOD) filed on VA Form 10182 starts the Board Appeal process. A Veterans Law Judge — not a VA rater — reviews your case."
              />

              {/* NOD basics */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notice of Disagreement (NOD) basics</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Form', value: 'VA Form 10182' },
                    { label: 'Deadline', value: '1 year from decision' },
                    { label: 'Avg wait (2022)', value: '18–36 months' },
                    { label: 'Decision by', value: 'Veterans Law Judge' },
                  ].map((item, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                      </div>
                  ))}
                </div>
                <a
                    href="https://www.va.gov/vaforms/va/pdf/VA10182.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 underline"
                >
                  Download VA Form 10182 →
                </a>
              </div>

              {/* Three dockets */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Choose your docket (you must select one when filing)
                </p>
                <div className="space-y-2">
                  {BOARD_DOCKETS.map(docket => (
                      <div key={docket.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedDocket(expandedDocket === docket.id ? null : docket.id)}
                            className="w-full text-left p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                        >
                          <span className="text-xl">{docket.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{docket.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{docket.description}</p>
                          </div>
                          <span className="text-gray-400">{expandedDocket === docket.id ? '▲' : '▼'}</span>
                        </button>
                        {expandedDocket === docket.id && (
                            <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-left">
                              <p className="text-xs"><span className="font-semibold text-gray-600 dark:text-gray-400">Timeline: </span><span className="text-gray-700 dark:text-gray-300">{docket.timeline}</span></p>
                              <p className="text-xs"><span className="font-semibold text-gray-600 dark:text-gray-400">Best for: </span><span className="text-gray-700 dark:text-gray-300">{docket.bestFor}</span></p>
                              <p className="text-xs"><span className="font-semibold text-gray-600 dark:text-gray-400">Trade-off: </span><span className="text-gray-700 dark:text-gray-300">{docket.tradeoff}</span></p>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
              </div>

              {/* Hearing prep */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Preparing for a BVA Hearing
                </p>
                <ul className="space-y-2 text-left">
                  {[
                    'Review your C-File (claims file) before the hearing — request a copy from your RO if you don\'t have it',
                    'Gather any new evidence if you\'re on the Evidence or Hearing docket (90-day window after NOD)',
                    'Prepare a brief written statement: issue → what the record shows → what you\'re asking for',
                    'You may bring witnesses who can testify about your condition\'s impact on daily life',
                    'The VLJ may ask questions — answer based on your worst days, not your best',
                    'You can make closing remarks at the end of the hearing',
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                        {item}
                      </li>
                  ))}
                </ul>
              </div>

              {/* After the hearing */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">After the BVA decision</p>
                <div className="space-y-2 text-left">
                  {[
                    { outcome: 'Granted', desc: 'Check the decision letter for rating %, effective date, and whether all issues were addressed' },
                    { outcome: 'Denied', desc: 'You can appeal to the U.S. Court of Appeals for Veterans Claims (CAVC) within 120 days' },
                    { outcome: 'Remanded', desc: 'A large majority of appeals are remanded back to the RO for correction — this is not a final denial' },
                  ].map((item, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.outcome}: </span>
                        <span className="text-gray-600 dark:text-gray-400">{item.desc}</span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Status check */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Check your appeal status</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Online: <a href="https://www.va.gov/claim-or-appeal-status" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">va.gov/claim-or-appeal-status</a>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Phone: 1-800-923-8387 (BVA status line)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Or contact your accredited VSO or representative</p>
                </div>
              </div>

              {/* BVA processing time note */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Processing time:</strong> In fiscal year 2020, the average BVA processing time was 336 days.
                  In 2022, the average wait from filing to decision ranged from 18–36 months depending on docket.
                  The Hearing docket typically takes longest. Plan accordingly and maintain your claim chain to
                  protect your effective date during the wait.
                </p>
              </div>
            </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Sources: 38 CFR § 3.103, § 3.2601 · VA.gov/decision-reviews (March 2026) ·
            howvadisabilityratingswork.com (Doug Haynes) · avardlaw.com (2026 HLR guide)<br/>
            Not legal advice — work with an accredited VSO, attorney, or claims agent
          </p>
        </div>
      </div>
  );
};

export default AppealReviewGuide;