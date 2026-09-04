// file: src/components/legal/TermsModal.jsx  v5
// Acceptance gate for Doc Bear's Symptom Vault.
//
// v5 -- rebuilt to counsel's recommended architecture.
//
// WHAT CHANGED FROM v4, AND WHY:
//
//  1. THE SCROLL GATE IS GONE. v4 required the user to scroll to the end of both
//     documents before the checkboxes unlocked. Counsel rejected that: the goal is
//     evidence of reasonable notice plus affirmative assent, not evidence that someone
//     dragged a scrollbar. Opening a document also no longer checks anything by itself.
//
//  2. THE DOCUMENTS ARE STILL INLINE AND STILL AVAILABLE BEFORE ACCEPTANCE. Counsel:
//     "'Read full Terms of Use' should actually open Section 23 before the user accepts,
//     without requiring acceptance to access it." Inline panels do that on web, Android,
//     and iOS alike, without depending on window.open() surviving a popup blocker or a
//     Capacitor WebView.
//
//  3. A THIRD CHECKBOX NOW CARRIES THE CONTRACTUAL ASSENT. This was counsel's
//     highest-priority item. The first two boxes acknowledge medical and VA matters;
//     neither actually said "I agree to the Terms of Use." The third does, and names the
//     arbitration agreement, the class action waiver, and the 30-day opt-out. Existing
//     users get wording that flags these as NEW.
//
//  4. LANGUAGE TIGHTENED where the summary claimed more than the contract does:
//       - "We are not liable for..."  ->  "To the maximum extent permitted by law, we
//         are not responsible for..."  (matches Section 20, which is not absolute)
//       - "nobody sees it"            ->  a statement about what Doc Bear Enterprises
//         receives, since a caregiver or anyone holding the device may well see it
//       - "your records are gone permanently" -> "we cannot recover it for you", which
//         is within our knowledge and makes no promise about Apple/Google/browser backups
//       - "the creator is not..."     ->  statements attach to Doc Bear Enterprises, LLC
//       - "not affiliated with the VA" -> "not affiliated with or endorsed by the
//         U.S. Department of Veterans Affairs (VA)", spelled out on first use
//
//  5. INDEMNIFICATION added to the "What changed" list. It is potentially adverse to the
//     user, so it is disclosed rather than omitted.
//
//  6. ACCEPTANCE DATE IS SHOWN SEPARATELY FROM THE DOCUMENT'S EFFECTIVE DATE, and the
//     arbitration opt-out window is stated as running 30 days from the user's own
//     acceptance. A user who first launches this build in December has until 30 days
//     after that December acceptance, not 30 days after the September effective date.
//
//  7. DOCUMENT HASHING. When a document panel is opened, the rendered text is hashed and
//     the hash is stored with the acceptance record, pinning what was actually on screen.
//     NOTE: a user who never opens a panel produces no hash, which is the honest record --
//     nothing beyond the summary and the link was displayed to them.
//
//  8. ABSOLUTE DATA-LOCATION CLAIMS REMOVED. Counsel's analysis: "we cannot see it,
//     cannot recover it, cannot share it" is fine, because "we" is Doc Bear Enterprises.
//     The unsafe statements were "everything you log stays on this device" and "nobody
//     backs it up", which could be false if iCloud Backup, Google backup, or a Capacitor
//     native backup configuration captures app-private data -- even though Doc Bear
//     never receives it. All such statements are now scoped to what the company does and
//     does not receive, which holds either way.
//
//     SEPARATE ACTION ITEM, not blocking this file: verify the native backup
//     configuration for the Android and iOS builds. It does not affect the accuracy of
//     this screen, but it does affect how the full Privacy Policy should describe where
//     data may reside.
//
// Usage:
//   const [showTerms, setShowTerms] = useState(() => {
//     migrateLegacyAcceptance();
//     return !hasAcceptedCurrentTerms();
//   });
//   const handleAcceptTerms = (details) => {
//     recordTermsAcceptance(details);
//     setShowTerms(false);
//   };
//   <TermsModal isOpen={showTerms} onAccept={handleAcceptTerms} />

import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, ChevronDown, FileText } from 'lucide-react';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';
import {
    COMPANY,
    CRISIS,
    LEGAL_EFFECTIVE_DATE,
    LEGAL_VERSION,
    ARBITRATION_OPT_OUT_DAYS,
    hasAcceptedAnyPriorTerms,
    hashDocumentText,
} from './legalMeta';

/**
 * Counsel's approved consent-screen wording.
 *
 * Note what this deliberately does NOT say. Earlier drafts claimed "everything you log
 * stays on this device" and "nobody backs it up". Both are absolute statements about
 * the whole world, and either could be false depending on how iCloud Backup, Google
 * backup, or a Capacitor native backup configuration treats app-private data. This
 * wording is scoped to what Doc Bear Enterprises does and does not receive, which is
 * accurate whichever way the platform behaves.
 */
const PRIVACY_SUMMARY =
    'Your health and symptom data is stored locally by the app. ' +
    'Doc Bear Enterprises does not receive it or maintain a backup and cannot access ' +
    'or recover it for you. You are responsible for maintaining any backups you wish to keep.';

/**
 * A collapsible panel holding one full legal document.
 *
 * Opening a panel does NOT satisfy any requirement and does not check any box. It
 * records that the document was displayed, and hashes what was displayed. That is
 * evidence of notice, which is what counsel asked for.
 */
function DocumentPanel({
                           panelId,
                           title,
                           hint,
                           isOpen,
                           onToggle,
                           onDisplayed,
                           openedAt,
                           onOpenFullPage,
                           children,
                       }) {
    const bodyRef = useRef(null);
    const wrapperRef = useRef(null);
    const reportedRef = useRef(false);

    useEffect(() => {
        if (!isOpen || reportedRef.current) return undefined;

        let cancelled = false;

        // Hash after paint, once the document has actually rendered
        const raf = window.requestAnimationFrame(() => {
            const text = bodyRef.current?.textContent || '';
            hashDocumentText(text).then(hash => {
                if (cancelled || reportedRef.current) return;
                reportedRef.current = true;
                onDisplayed({ at: new Date().toISOString(), hash });
            }).catch(() => {
                if (cancelled || reportedRef.current) return;
                reportedRef.current = true;
                onDisplayed({ at: new Date().toISOString(), hash: null });
            });
        });

        // Bring the newly opened panel into view. Guarded: scrollIntoView is absent in
        // some older WebViews and test environments, and a throw inside a timer is unhandled.
        const scrollTimer = window.setTimeout(() => {
            const el = wrapperRef.current;
            if (typeof el?.scrollIntoView === 'function') {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 60);

        return () => {
            cancelled = true;
            window.cancelAnimationFrame(raf);
            window.clearTimeout(scrollTimer);
        };
    }, [isOpen, onDisplayed]);

    // These documents carry their own table-of-contents anchors. Left alone they would
    // change the page URL and scroll the window. Keep the jump inside this panel.
    const handleAnchorClick = (e) => {
        const anchor = e.target.closest?.('a[href^="#"]');
        if (!anchor) return;
        e.preventDefault();
        const id = anchor.getAttribute('href').slice(1);
        if (!id) return;
        try {
            const selector = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
                ? `#${CSS.escape(id)}`
                : `[id="${id}"]`;
            const target = bodyRef.current?.querySelector(selector);
            if (typeof target?.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch {
            // A malformed anchor must never break the acceptance screen
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="border-2 border-blue-400 dark:border-blue-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`${panelId}-body`}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
            >
                <FileText aria-hidden="true" className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <span className="flex-1 min-w-0">
            <span className="block font-semibold text-gray-900 dark:text-white">{title}</span>
            <span className="block text-sm mt-0.5 text-gray-600 dark:text-gray-400">
              {openedAt ? 'Opened. Tap to close.' : hint}
            </span>
          </span>
                <ChevronDown
                    aria-hidden="true"
                    className={`flex-shrink-0 w-5 h-5 text-gray-400 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                    <div
                        id={`${panelId}-body`}
                        ref={bodyRef}
                        onClick={handleAnchorClick}
                        tabIndex={0}
                        className="max-h-[50vh] overflow-y-auto bg-white dark:bg-gray-900
                           text-[13px] leading-relaxed focus:outline-none
                           focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                        {children}
                    </div>

                    {onOpenFullPage && (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onOpenFullPage}
                                className="text-xs font-medium text-blue-700 dark:text-blue-300 underline
                                 hover:text-blue-900 dark:hover:text-blue-100"
                            >
                                Open this document in a full page instead
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TermsModal({ isOpen, onAccept, onViewFullTerms, onViewPrivacy }) {
    const [ack, setAck] = useState({ medical: null, va: null, terms: null });
    const [openPanel, setOpenPanel] = useState(null);
    const [displayed, setDisplayed] = useState({
        termsOpenedAt: null,
        termsDocumentHash: null,
        privacyAcknowledgedAt: null,
        privacyDocumentHash: null,
    });

    const headingRef = useRef(null);

    // Existing store users already accepted the December 2024 terms. Tell them the terms
    // changed rather than presenting this as a first run, and word the third
    // acknowledgement so the arbitration agreement is flagged as new.
    const isUpdate = useRef(hasAcceptedAnyPriorTerms()).current;

    useEffect(() => {
        if (!isOpen) return undefined;
        headingRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [isOpen]);

    const handleTermsDisplayed = useCallback(({ at, hash }) => {
        setDisplayed(prev => prev.termsOpenedAt
            ? prev
            : { ...prev, termsOpenedAt: at, termsDocumentHash: hash });
    }, []);

    const handlePrivacyDisplayed = useCallback(({ at, hash }) => {
        setDisplayed(prev => prev.privacyAcknowledgedAt
            ? prev
            : { ...prev, privacyAcknowledgedAt: at, privacyDocumentHash: hash });
    }, []);

    if (!isOpen) return null;

    const toggleAck = (key) => (e) =>
        setAck(prev => ({ ...prev, [key]: e.target.checked ? new Date().toISOString() : null }));

    const togglePanel = (id) => setOpenPanel(prev => (prev === id ? null : id));

    const checkedCount = [ack.medical, ack.va, ack.terms].filter(Boolean).length;
    const canAccept = checkedCount === 3;

    const buttonLabel = canAccept
        ? (isUpdate ? 'Accept Updated Terms & Continue' : 'Accept Terms & Continue')
        : `Check all three boxes above to continue (${checkedCount} of 3)`;

    const handleAccept = () => {
        const acceptedAt = new Date().toISOString();
        onAccept({
            acceptedAt,
            medicalAcknowledgedAt: ack.medical,
            vaAcknowledgedAt: ack.va,
            arbitrationAcknowledgedAt: ack.terms,
            termsOpenedAt: displayed.termsOpenedAt,
            termsDocumentHash: displayed.termsDocumentHash,
            privacyAcknowledgedAt: displayed.privacyAcknowledgedAt,
            privacyDocumentHash: displayed.privacyDocumentHash,
        });
    };

    const checkboxClass =
        'mt-1 w-4 h-4 flex-shrink-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-heading"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 flex-shrink-0">
                    <h2
                        id="terms-modal-heading"
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-2xl font-bold text-white outline-none"
                    >
                        {isUpdate ? 'Our Terms of Use Have Changed' : 'Terms of Use'}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                        {isUpdate
                            ? 'Please review and accept the updated terms to continue'
                            : `Please review and accept before using ${COMPANY.appName}`}
                    </p>
                    <p className="text-blue-200 text-xs mt-1">
                        Version {LEGAL_VERSION} · Published {LEGAL_EFFECTIVE_DATE}
                    </p>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="space-y-4">

                        {/* What changed -- returning users only. Arbitration first. */}
                        {isUpdate && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 -mx-2">
                                <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                                    What changed in this version
                                </p>
                                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc ml-5">
                                    <li>
                                        Added a <strong>dispute resolution and arbitration</strong> section, including
                                        an individual binding arbitration agreement and a class action waiver, with a{' '}
                                        <strong>{ARBITRATION_OPT_OUT_DAYS}-day right to opt out</strong>
                                    </li>
                                    <li>Added a <strong>limit on our liability</strong> to you</li>
                                    <li>
                                        Updated and expanded the <strong>indemnification</strong> provisions describing
                                        circumstances in which you may be responsible for certain claims involving your
                                        misuse of the Services
                                    </li>
                                    <li>Added specific disclaimers for the SMC, rating scenario, buddy statement, C&amp;P exam, and TDIU worksheet tools</li>
                                    <li>Added terms required by the Apple App Store and Google Play</li>
                                    <li>Expanded the privacy policy to cover app stores, exports, reminders, HIPAA, and state privacy rights</li>
                                </ul>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                    Your previous acceptance is still recorded on this device. Nothing about how
                                    your health data is handled has changed: the app still stores it locally, and{' '}
                                    {COMPANY.legalName} still does not receive it.
                                </p>
                            </div>
                        )}

                        {/* Medical & legal disclaimer */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 -mx-2">
                            <div className="flex items-start gap-3 text-left">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                                        ⚠️ Important Medical &amp; Legal Disclaimer
                                    </p>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
                                        <p>
                                            <strong>{COMPANY.appName} does not provide medical advice or professional
                                                healthcare services. {COMPANY.legalName} is not a healthcare provider, and the
                                                Services are not medical care.</strong> This app was created by a veteran to
                                            help fellow veterans and caregivers document symptoms.
                                        </p>
                                        <p>
                                            <strong>{COMPANY.appName} is not a medical device and does not diagnose,
                                                treat, cure, or prevent any medical condition.</strong> It is a personal
                                            documentation tool only, and it is not a substitute for professional medical
                                            advice, diagnosis, or treatment.
                                        </p>
                                        <p>
                                            <strong>Always seek the advice of your physician or other qualified health
                                                provider</strong> with any question you have about a medical condition.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key points summary */}
                        <section>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                By using this app, you understand and agree that:
                            </h3>
                            <ul className="space-y-2 ml-4 text-left">
                                {[
                                    <>This app is for <strong>documentation purposes only</strong>, not medical advice or diagnosis</>,
                                    <>{COMPANY.legalName} <strong>is not a healthcare provider</strong> and does not provide medical or healthcare services through the app</>,
                                    <>The app is <strong>not affiliated with or endorsed by the U.S. Department of Veterans Affairs (VA)</strong> and does not guarantee any disability rating or benefit</>,
                                    <>{COMPANY.legalName} is <strong>not a VA-accredited attorney, claims agent, or representative</strong>, does not represent you before the VA, does not file claims for you, and <strong>charges no fee</strong> of any kind</>,
                                    <>Rating information is drawn from 38 CFR Part 4 but <strong>may be outdated or incomplete</strong> — verify against the current regulation</>,
                                    <>Calculators and estimates are <strong>planning aids, not determinations</strong>. Only the VA decides eligibility, ratings, and benefits</>,
                                    <>Everything you record and submit must be <strong>truthful and accurate</strong></>,
                                    <>Your health and symptom data is <strong>stored locally by the app</strong>. {COMPANY.legalName} does not receive it or maintain a backup, and <strong>you are responsible for maintaining any backups you wish to keep</strong></>,
                                    <>If your locally stored records are deleted or become unavailable, <strong>{COMPANY.legalName} cannot recover them for you</strong></>,
                                    <>The app <strong>does not monitor you</strong> and cannot help in an emergency</>,
                                    <>The app is provided <strong>"AS IS"</strong> with no warranties</>,
                                    <><strong>To the maximum extent permitted by law</strong>, we are not responsible for health outcomes, VA claim results, lost locally stored data, or decisions made in reliance on the app</>,
                                    <>Disputes are resolved by <strong>individual binding arbitration</strong>, with a class action waiver and a {ARBITRATION_OPT_OUT_DAYS}-day opt-out right (full Terms, Section 23)</>,
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-blue-600 dark:text-blue-400 mt-1" aria-hidden="true">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Emergency */}
                        <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
                                🚨 Medical Emergencies
                            </p>
                            <p className="text-red-600 dark:text-red-300 text-sm">
                                IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR, GO TO THE
                                EMERGENCY DEPARTMENT, OR CALL {CRISIS.emergency} IMMEDIATELY. DO NOT RELY ON THIS
                                APP FOR EMERGENCY MEDICAL NEEDS.
                            </p>
                        </section>

                        {/* Veterans Crisis Line */}
                        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                                🎖️ Veterans Crisis Line
                            </p>
                            <div className="text-blue-600 dark:text-blue-300 text-sm space-y-1">
                                <p><strong>Call:</strong> {CRISIS.veteransCrisisPhone}</p>
                                <p><strong>Text:</strong> {CRISIS.veteransCrisisText}</p>
                                <p><strong>Chat:</strong> {CRISIS.veteransCrisisChat}</p>
                            </div>
                        </section>

                        {/* Privacy summary */}
                        <section>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Your privacy, briefly
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{PRIVACY_SUMMARY}</p>
                        </section>

                        {/* Full documents -- available now, before acceptance */}
                        <section className="pt-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Review the Terms of Use and Privacy Policy
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                Everything above is a summary. The full documents are below and you can read them
                                now, before you accept. Both remain available any time from the Settings menu.
                            </p>

                            <div className="space-y-3">
                                <DocumentPanel
                                    panelId="panel-terms"
                                    title="Terms of Use (full document)"
                                    hint="Includes Section 23, Dispute Resolution and Arbitration"
                                    isOpen={openPanel === 'terms'}
                                    onToggle={() => togglePanel('terms')}
                                    onDisplayed={handleTermsDisplayed}
                                    openedAt={displayed.termsOpenedAt}
                                    onOpenFullPage={onViewFullTerms}
                                >
                                    <TermsOfUse />
                                </DocumentPanel>

                                <DocumentPanel
                                    panelId="panel-privacy"
                                    title="Privacy Policy (full document)"
                                    hint="How your information is handled"
                                    isOpen={openPanel === 'privacy'}
                                    onToggle={() => togglePanel('privacy')}
                                    onDisplayed={handlePrivacyDisplayed}
                                    openedAt={displayed.privacyAcknowledgedAt}
                                    onOpenFullPage={onViewPrivacy}
                                >
                                    <PrivacyPolicy />
                                </DocumentPanel>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mt-3">
                                These terms are governed by the laws of the State of {COMPANY.governingState},
                                United States.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="text-xs text-gray-500 dark:text-gray-400">
                            <p><strong>{COMPANY.legalName}</strong></p>
                            <p>{COMPANY.street}</p>
                            <p>{COMPANY.cityStateZip}</p>
                            <p>Email: {COMPANY.privacyEmail}</p>
                        </section>
                    </div>
                </div>

                {/* Footer -- three acknowledgements */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 max-h-[45vh] overflow-y-auto">

                    {/* 1. Medical */}
                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(ack.medical)}
                            onChange={toggleAck('medical')}
                            className={checkboxClass}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                I understand this app is <strong>not medical advice</strong>, is{' '}
                            <strong>not a medical device</strong>, and {COMPANY.legalName}{' '}
                            <strong>does not provide medical or healthcare services</strong>.
              </span>
                    </label>

                    {/* 2. VA */}
                    <label className="flex items-start gap-3 mb-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(ack.va)}
                            onChange={toggleAck('va')}
                            className={checkboxClass}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                I understand this app is <strong>not affiliated with or endorsed by the
                U.S. Department of Veterans Affairs (VA)</strong>, {COMPANY.legalName}{' '}
                            <strong>does not represent me before the VA</strong>, and{' '}
                            <strong>only the VA determines eligibility, ratings, and benefits</strong>.
              </span>
                    </label>

                    {/* 3. Contractual assent to the Terms, naming arbitration */}
                    <label className="flex items-start gap-3 mb-4 cursor-pointer
                            bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400
                            dark:border-blue-600 rounded-lg p-3">
                        <input
                            type="checkbox"
                            checked={Boolean(ack.terms)}
                            onChange={toggleAck('terms')}
                            className={checkboxClass}
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                I have reviewed and <strong>agree to the {isUpdate ? 'updated ' : ''}Terms of
                Use</strong>, including the {isUpdate ? 'new ' : ''}<strong>individual binding
                arbitration agreement and class action waiver in Section 23</strong>. I understand
                that I may <strong>opt out of arbitration within {ARBITRATION_OPT_OUT_DAYS} days</strong>{' '}
                            after I accept these {isUpdate ? 'updated ' : ''}Terms without affecting my ability
                to use the app.
              </span>
                    </label>

                    <button
                        onClick={handleAccept}
                        disabled={!canAccept}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                            canAccept
                                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {buttonLabel}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Your acceptance is recorded on this device with today's date. Your{' '}
                        {ARBITRATION_OPT_OUT_DAYS}-day arbitration opt-out period runs from the date you
                        accept, not from the date the terms were published. Nothing is transmitted anywhere.
                    </p>
                </div>
            </div>
        </div>
    );
}