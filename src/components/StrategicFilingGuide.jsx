import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

/**
 * StrategicFilingGuide Component
 *
 * Full-page educational guide for veterans at or near 100% rating.
 * Explains when and why to file additional claims, SMC structure,
 * reduction protection, DIC strategy, and ancillary benefits.
 *
 * Navigated to from Settings via onNavigate('strategic-filing')
 *
 * Props:
 *   onBack (function) - Returns to previous view (Settings)
 */

// Collapsible section component
const GuideSection = ({ title, icon, children, defaultOpen = false, accentColor = 'blue' }) => {
    const [expanded, setExpanded] = useState(defaultOpen);

    const colorMap = {
        blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
        green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
        amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
        purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
        red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
        cyan: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
        orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    };

    const headerColor = colorMap[accentColor] || colorMap.blue;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className={`w-full px-4 py-3 flex items-center justify-between border-l-4 ${headerColor} hover:opacity-90 transition-opacity`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm text-left">
                        {title}
                    </h3>
                </div>
                {expanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
            </button>
            {expanded && (
                <div className="px-4 pb-4 pt-2 space-y-3">
                    {children}
                </div>
            )}
        </div>
    );
};

// Example scenario card
const ExampleCard = ({ scenario, details }) => (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 border-l-4 border-gray-300 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Example:
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {scenario}
        </p>
        {details && (
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                {details}
            </p>
        )}
    </div>
);

export default function StrategicFilingGuide({ onBack }) {

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const usableWidth = pageWidth - margin * 2;
    let y = 18;

    const addPageIfNeeded = (space = 20) => {
      if (y + space > 275) { doc.addPage(); y = 18; }
    };

    const sectionHeader = (title, rgb) => {
      addPageIfNeeded(14);
      doc.setFillColor(...rgb);
      doc.roundedRect(margin, y, usableWidth, 8, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin + 3, y + 5.5);
      y += 12;
      doc.setTextColor(40);
      doc.setFont(undefined, 'normal');
    };

    const bodyText = (text, indent = 0) => {
      addPageIfNeeded(10);
      doc.setFontSize(8.5);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, usableWidth - indent - 2);
      doc.text(lines, margin + indent, y);
      y += lines.length * 4.5 + 2;
    };

    const bulletItem = (text) => {
      addPageIfNeeded(8);
      doc.setFontSize(8.5);
      doc.text('•', margin + 2, y);
      const lines = doc.splitTextToSize(text, usableWidth - 10);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.5 + 1;
    };

    const exampleBox = (text) => {
      addPageIfNeeded(18);
      doc.setFillColor(245, 245, 245);
      doc.setDrawColor(200);
      const lines = doc.splitTextToSize(`Example: ${text}`, usableWidth - 8);
      const boxH = lines.length * 4.5 + 6;
      doc.roundedRect(margin, y, usableWidth, boxH, 1, 1, 'FD');
      doc.setFontSize(8);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(80);
      doc.text(lines, margin + 4, y + 4.5);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(40);
      y += boxH + 4;
    };

    // ── Header ──
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text('STRATEGIC FILING GUIDE', pageWidth / 2, 11, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Beyond 100% — Structure, SMC & Long-Term Protection', pageWidth / 2, 19, { align: 'center' });
    y = 32;

    doc.setTextColor(40);
    doc.setFontSize(8.5);
    bodyText('Being at 100% is not the ceiling. The real ceiling is proper SMC structure, reduction protection, and long-term benefits for you and your family.');
    y += 3;

    // ── P&T ──
    sectionHeader('FIRST — CHECK IF YOU\'RE P&T', [22, 101, 52]);
    bodyText('If you\'re 100% schedular or TDIU, you may already be Permanent & Total (P&T). Every claim opens the file — filing when P&T should be strategic.');
    bodyText('To verify P&T status:');
    bulletItem('Check your decision letter — if Chapter 35 (DEA) is granted, you\'re likely P&T.');
    bulletItem('VA.gov => Benefits => Download Benefit Letters => Benefit Summary and Service Verification Letter.');
    bulletItem('Look for: "You are considered to be totally and permanently disabled solely due to your service-connected disabilities."');
    bodyText('P&T also unlocks Chapter 35 DEA (dependent education) and possibly CHAMPVA for dependents.');
    y += 3;

    // ── SMC-S1 ──
    sectionHeader('SMC-S1 — STATUTORY HOUSEBOUND', [109, 40, 217]);
    bodyText('If one condition is rated 100% AND other conditions combine to 60%+, you may qualify for SMC-S1 — pays above the regular 100% rate.');
    exampleBox('Veteran is 100% for PTSD. Also has 40% back, 30% migraines, and 20% radiculopathy. Those combine to 60%+. May qualify for SMC-S1.');
    bodyText('Commonly missed: If TDIU is based on one single condition and other conditions combine to 60%+, that may also qualify (Bradley v. Peake / Buie v. Shinseki).');
    y += 3;

    // ── SMC Ladder ──
    sectionHeader('SMC LADDER — L, M, N AND BEYOND', [30, 58, 138]);
    bodyText('For loss of use or Aid & Attendance needs, higher SMC levels provide significantly more monthly compensation. SMC levels increase with:');
    bulletItem('Loss of use of extremities (hands, feet)');
    bulletItem('Blindness or severe visual impairment');
    bulletItem('Need for regular Aid & Attendance');
    bulletItem('Being permanently bedridden');
    exampleBox('Veteran is 100% for cancer but later develops neuropathy causing loss of use of both feet. Could qualify for SMC-L or higher — thousands more per month.');
    y += 3;

    // ── Reduction Protection ──
    sectionHeader('REDUCTION PROTECTION', [180, 120, 20]);
    bodyText('A 100% rating built on a single condition is vulnerable. If VA proposes a reduction, a thin structure offers little protection. Establishing secondary conditions creates a safety net.');
    exampleBox('Veteran is 100% solely on one mental health rating. VA proposes reduction. No other significant ratings in place. Strong secondary conditions could have protected this veteran\'s combined rating.');
    y += 3;

    // ── SMC-K ──
    sectionHeader('SMC-K — ADDITIONAL MONTHLY COMPENSATION', [22, 101, 52]);
    bodyText('SMC-K is additive — paid on top of your existing rate. Does not change your percentage. Common qualifying conditions:');
    bulletItem('Erectile dysfunction (DC 7522) — secondary to service-connected condition or medication');
    bulletItem('Female sexual arousal disorder (DC 7632)');
    bulletItem('Loss of use of one hand or one foot');
    exampleBox('Veteran is 100% for heart disease. Develops ED secondary to blood pressure medication. Qualifies for SMC-K — additional monthly pay on top of 100%.');
    y += 3;

    // ── DIC ──
    sectionHeader('DIC STRATEGY — PROTECTING YOUR FAMILY', [185, 28, 28]);
    bodyText('Dependency and Indemnity Compensation (DIC) provides monthly benefits to surviving spouses. Strategic filing while alive protects your family\'s eligibility.');
    exampleBox('Veteran is 100% PTSD. Has heart disease related to service but never claims it. Passes away from heart disease. Surviving spouse\'s DIC path becomes significantly harder.');
    bodyText('The 10-Year Rule: A condition rated for 10+ continuous years generally cannot be severed. Long service-connection history protects DIC eligibility for survivors.');
    y += 3;

    // ── Ancillary ──
    sectionHeader('ANCILLARY BENEFITS', [8, 145, 178]);
    bodyText('Specific conditions unlock benefits beyond monthly compensation. These require the right condition to be service-connected:');
    bulletItem('Automobile allowance and adaptive equipment grant');
    bulletItem('Specially Adapted Housing (SAH) / Special Home Adaptation (SHA) grants');
    bulletItem('Expanded caregiver program eligibility');
    bulletItem('Dental treatment and clothing allowance');
    y += 3;

    // ── Strategic vs Reactive ──
    sectionHeader('STRATEGIC VS. REACTIVE FILING', [180, 90, 20]);
    bodyText('Every claim opens the file. The question is not "Can I file?" — it\'s "What does this accomplish long term?"');
    bulletItem('Strategic: Filing for SMC-S1 when you have the structure to support it');
    bulletItem('Strategic: Secondary conditions for reduction protection');
    bulletItem('Strategic: Conditions that unlock ancillary benefits or protect DIC');
    bulletItem('Risky: Filing without understanding impact on existing rating structure');

    // ── Footer ──
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
          `Strategic Filing Guide — Page ${i} of ${pageCount} — Doc Bear's Symptom Vault — Educational purposes only, not legal advice`,
          pageWidth / 2,
          doc.internal.pageSize.height - 8,
          { align: 'center' }
      );
    }

    doc.save(`Strategic-Filing-Guide-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
        <div className="pb-20 space-y-4">
            {/* Header with Back Button */}
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-500 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 text-white relative">
            <div className="text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                <span>🎯</span>
                Strategic Filing Guide
              </h2>
              <p className="text-amber-100 dark:text-gray-300 text-sm mt-1">
                Beyond 100% — Structure, SMC & Protection
              </p>
            </div>
          </div>

          {/* Export Button */}
          <button
              onClick={exportToPDF}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            📄 Export Guide to PDF
          </button>

            {/* Key Message Banner */}
            <div className="bg-blue-900 dark:bg-blue-800 rounded-lg p-4 text-white">
                <p className="text-sm font-medium mb-2">
                    Being 100% is not the ceiling.
                </p>
                <p className="text-sm opacity-90">
                    The real ceiling is proper SMC structure, reduction protection, and
                    long-term benefits for you and your family. At 100%, you stop chasing
                    numbers and start building strategic structure.
                </p>
            </div>

            {/* Check P&T Status First */}
            <GuideSection
                title="First — Check if You're P&T"
                icon="🔍"
                accentColor="green"
                defaultOpen={true}
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    If you're 100% schedular or TDIU, you may already be
                    <strong> Permanent & Total (P&T)</strong> and not realize it.
                    This matters because filing new claims when you're P&T should be
                    strategic, not casual — every claim opens the file.
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                        Two Ways to Check:
                    </h4>
                    <div className="text-sm text-green-800 dark:text-green-300 space-y-2 text-left">
                        <p className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">1.</span>
                            <span>
                <strong>Decision letter</strong> — If Chapter 35 (DEA) is
                granted, that's usually a sign you're P&T.
              </span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">2.</span>
                            <span>
                <strong>VA.gov</strong> → Benefits and Healthcare → Records →
                Download VA Benefit Letters → View Letters → Benefit Summary
                and Service Verification Letter.
              </span>
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-green-400 dark:border-green-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Look for this line:
                    </p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mt-1 italic">
                        "You are considered to be totally and permanently disabled solely
                        due to your service-connected disabilities."
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        If it says YES — you're P&T.
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>P&T Benefits:</strong> P&T conveys additional benefits for
                        dependents including Chapter 35 Dependent Education Assistance (DEA)
                        and possibly dependent medical coverage (CHAMPVA).
                    </p>
                </div>
            </GuideSection>

            {/* SMC-S1 Statutory Housebound */}
            <GuideSection
                title="SMC-S1 — Statutory Housebound"
                icon="🏠"
                accentColor="purple"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    If <strong>one condition is rated 100%</strong> and your
                    <strong> other conditions combine to 60% or more</strong>, you may
                    qualify for SMC-S1 (statutory housebound). This pays above the
                    regular 100% rate.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% for PTSD alone. They also have 40% back, 30% migraines, and 20% radiculopathy. Those combine to 60%+."
                    details="That may qualify for SMC-S1 — which many veterans miss entirely."
                />

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                        Commonly Missed Scenario:
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Veteran is 100% TDIU based on multiple conditions. If one single
                        condition actually supports TDIU alone, filing to establish that
                        could create SMC-S1 entitlement. That's a strategic filing — not
                        chasing percentage but chasing proper structure.
                    </p>
                </div>
            </GuideSection>

            {/* SMC Ladder */}
            <GuideSection
                title="SMC Ladder — L, M, N and Beyond"
                icon="📈"
                accentColor="blue"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    For veterans with <strong>loss of use</strong> or who need
                    <strong> Aid & Attendance</strong>, higher SMC levels (L, M, N)
                    provide significantly more monthly compensation — but only if the
                    conditions are claimed and properly structured.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% for cancer but later develops severe neuropathy causing loss of use of both feet."
                    details="That's no longer just '100%.' That could qualify for SMC-L or higher — thousands more per month — but only if it's claimed and structured properly."
                />

                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">SMC levels increase with:</p>
                    <p className="flex items-start gap-1.5 mt-1"><span>•</span><span>Loss of use of extremities</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Blindness or severe visual impairment</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Need for regular Aid & Attendance</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Being permanently bedridden</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Combinations of the above</span></p>
                </div>
            </GuideSection>

            {/* Reduction Protection */}
            <GuideSection
                title="Reduction Protection — Strengthen Your Structure"
                icon="🛡️"
                accentColor="amber"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    If your 100% rating rests on a <strong>single condition</strong>,
                    a future VA reduction proposal could drop you below 100%. Establishing
                    additional service-connected conditions creates a structural safety net.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% based solely on one mental health rating. If VA proposes a reduction and there are no other significant ratings in place, they could drop below 100%."
                    details="But if that veteran had already established strong secondary conditions, the overall combined rating may protect them from falling below 100%. Structure matters."
                />

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>Tip:</strong> The Secondary Conditions Guide in this app
                        can help identify potential secondary claims that strengthen your
                        overall rating structure.
                    </p>
                </div>
            </GuideSection>

            {/* SMC-K */}
            <GuideSection
                title="SMC-K — Additional Monthly Compensation"
                icon="💰"
                accentColor="green"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    SMC-K provides <strong>additional monthly compensation</strong> on top
                    of your existing rating for specific conditions like erectile
                    dysfunction, loss of use of a creative organ, or loss of use of
                    one hand or foot. It doesn't change your percentage but increases
                    total payment.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% for heart disease. Develops erectile dysfunction secondary to medication."
                    details="That's SMC-K — additional monthly compensation. It doesn't change the 100%, but it increases the total benefit."
                />

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                        <strong>Documentation tip:</strong> Tracking medication side effects
                        in this app (like sexual dysfunction from antidepressants) builds
                        evidence for secondary conditions that may trigger SMC-K.
                    </p>
                </div>
            </GuideSection>

            {/* DIC Strategy */}
            <GuideSection
                title="DIC Strategy — Protecting Your Family"
                icon="👨‍👩‍👧‍👦"
                accentColor="red"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Dependency and Indemnity Compensation (DIC)</strong> provides
                    monthly benefits to surviving spouses and dependents. Strategic filing
                    while alive can protect your family's eligibility.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% PTSD. Also has heart disease related to service but never claims it. If the veteran passes away from heart disease and it wasn't service-connected, the surviving spouse's DIC path becomes much harder."
                    details="Strategic filing can protect the family, not just the veteran."
                />

                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-800 dark:text-red-300">
                        <strong>The 10-Year Rule:</strong> If a veteran is rated for a
                        condition for 10+ continuous years, it generally cannot be reduced.
                        This applies to DIC eligibility as well — conditions with long
                        service-connection history provide stronger protection for survivors.
                    </p>
                </div>
            </GuideSection>

            {/* Ancillary Benefits */}
            <GuideSection
                title="Ancillary Benefits — Auto, Housing & More"
                icon="🏗️"
                accentColor="cyan"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Certain service-connected conditions unlock <strong>additional
                    benefits beyond monthly compensation</strong>. These don't happen
                    automatically — they require the right condition to be service-connected.
                </p>

                <ExampleCard
                    scenario="Veteran is 100% but later loses use of a foot. That loss of use (SMC-K) could qualify for automobile grant, specially adapted housing, higher SMC, and expanded caregiver eligibility."
                    details="These benefits require the specific condition to be service-connected and properly documented."
                />

                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Potential ancillary benefits include:</p>
                    <p className="flex items-start gap-1.5 mt-1"><span>•</span><span>Automobile allowance and adaptive equipment grant</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Specially Adapted Housing (SAH) grant</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Special Home Adaptation (SHA) grant</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Expanded caregiver program eligibility</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Dental treatment eligibility</span></p>
                    <p className="flex items-start gap-1.5"><span>•</span><span>Clothing allowance</span></p>
                </div>
            </GuideSection>

            {/* The Other Side — Caution */}
            <GuideSection
                title="The Other Side — File Strategically"
                icon="⚖️"
                accentColor="orange"
            >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Every claim opens the file. Filing just to chase percentages without
                    a strategy can backfire.
                </p>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-900 dark:text-orange-200 font-medium mb-2">
                        The real question isn't "Can I file?"
                    </p>
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                        It's <strong>"What does this accomplish long term?"</strong>
                    </p>
                    <p className="text-sm text-orange-800 dark:text-orange-300 mt-2">
                        At 100%, you stop chasing numbers. You start building structure
                        and protection. That's the difference between reactive filing
                        and strategic filing.
                    </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                    <p className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span><strong>Strategic:</strong> Filing for SMC-S1 when you have the structure to support it</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span><strong>Strategic:</strong> Establishing secondary conditions for reduction protection</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span><strong>Strategic:</strong> Claiming conditions that unlock ancillary benefits</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span><strong>Strategic:</strong> Service-connecting conditions for DIC protection</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">✗</span>
                        <span><strong>Risky:</strong> Filing claims without understanding how they affect your existing structure</span>
                    </p>
                </div>
            </GuideSection>

            {/* Call to Action */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Contact your VSO, Agent, or Attorney if you have questions.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    And please — do not let anyone tell you that you cannot file.
                    This is <strong>your</strong> claim.
                </p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">
                This guide is for educational purposes only and does not constitute
                legal or medical advice. Every veteran's situation is different.
                Consult a VA-accredited Veterans Service Organization (VSO), claims
                agent, or attorney for guidance specific to your claims.
            </p>
        </div>
    );
}