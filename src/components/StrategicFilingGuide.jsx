import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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
    return (
        <div className="pb-20 space-y-4">
            {/* Header with Back Button */}
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Strategic Filing Guide
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Beyond 100% — Structure, SMC & Protection
                    </p>
                </div>
            </div>

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
                    <div className="text-sm text-green-800 dark:text-green-300 space-y-2">
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

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
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