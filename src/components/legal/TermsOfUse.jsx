// file: src/components/legal/TermsOfUse.jsx  v4
// Doc Bear's Symptom Vault -- Terms of Use
//
// v4 CHANGES (for attorney review):
//  - Effective date and version now come from legalMeta.js
//  - Added: Apple App Store minimum EULA terms (required for iOS distribution)
//  - Added: Google Play distribution terms and required medical device disclaimer
//  - Added: per-tool disclaimers for SMC Calculator, Rating Scenario Calculator,
//           Buddy Statement Generator, C&P Exam Prep, After Action Report,
//           TDIU 21-8940 worksheet, and payment rate tables
//  - Added: explicit no-fee / no-representation / no-accreditation statement
//           addressing 38 U.S.C. 5901 et seq. and state claims-consultant laws
//  - Added: caregiver authorization terms
//  - Added: arbitration clause with class action waiver, small claims carve-out,
//           and a 30-day opt-out right
//  - Added: accessibility commitment, third-party/open source notice, feedback license
//  - Expanded: prohibited activities, fraud warning, limitation of liability cap
//
// ATTORNEY NOTE: search for "ATTORNEY REVIEW" comments below for open questions.

import React from 'react';
import { COMPANY, CRISIS, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from './legalMeta';

const TermsOfUse = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    TERMS OF USE
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    <strong>Last updated {LEGAL_EFFECTIVE_DATE}</strong>
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    Document version {LEGAL_VERSION}
                </p>
            </div>

            {/* Master Disclaimer Banner */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mb-8">
                <p className="text-yellow-800 dark:text-yellow-300 font-bold text-center">
                    ⚠️ Important Medical &amp; Legal Disclaimer ⚠️
                </p>
                <div className="text-yellow-700 dark:text-yellow-400 text-sm mt-3 space-y-2 text-left">
                    <p>
                        <strong>The creator of this app is not a medical doctor, licensed healthcare
                            provider, or medical professional.</strong> This app was created by a veteran to help
                        fellow veterans, caregivers, and others document their symptoms.
                    </p>
                    <p>
                        <strong>The creator is also not a VA-accredited attorney, claims agent, or Veterans
                            Service Organization representative</strong>, and this app does not represent you
                        before the U.S. Department of Veterans Affairs.
                    </p>
                    <p>
                        {COMPANY.appName} is a personal documentation tool. It is <strong>not a medical
                        device</strong> and <strong>does not diagnose, treat, cure, or prevent any medical
                        condition</strong>.
                    </p>
                    <p>
                        <strong>Always seek the advice of your physician or other qualified health
                            provider</strong> with any questions you may have regarding a medical condition. Never
                        disregard professional medical advice or delay seeking it because of something you
                        read or recorded in this app.
                    </p>
                </div>
            </div>

            {/* Agreement */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AGREEMENT TO OUR LEGAL TERMS</h2>
                <p className="mb-4">
                    We are <strong>{COMPANY.legalName}</strong> ("<strong>Company</strong>,"
                    "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), an Iowa limited
                    liability company located at {COMPANY.street}, {COMPANY.cityStateZip}.
                </p>
                <p className="mb-4">
                    We operate the {COMPANY.appName} application (the "<strong>App</strong>"), the websites{' '}
                    {COMPANY.appWebsiteLabel} and {COMPANY.websiteLabel}, and any related products and
                    services that link to these legal terms (the "<strong>Legal Terms</strong>")
                    (collectively, the "<strong>Services</strong>").
                </p>
                <p className="mb-4">
                    {COMPANY.appName} is a personal health documentation tool that helps users record
                    symptoms, medications, appointments, and measurements over time. For veterans, it
                    additionally shows how recorded entries compare to VA disability rating criteria drawn
                    from 38 CFR Part 4, and helps organize that documentation for the veteran's own use.
                </p>
                <p className="mb-4">
                    You can contact us by email at <strong>{COMPANY.privacyEmail}</strong> or by mail at{' '}
                    {COMPANY.street}, {COMPANY.cityStateZip}.
                </p>
                <p className="mb-4">
                    These Legal Terms constitute a legally binding agreement between you, whether personally
                    or on behalf of an entity ("<strong>you</strong>"), and {COMPANY.legalName}, concerning
                    your access to and use of the Services. By using the Services, or by tapping "I
                    Understand &amp; Accept" in the App, you agree to these Legal Terms.
                </p>
                <p className="font-semibold mb-4">
                    IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, YOU ARE EXPRESSLY PROHIBITED FROM
                    USING THE SERVICES AND MUST DISCONTINUE USE IMMEDIATELY.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-500 rounded p-4">
                    <p className="text-sm">
                        <strong>Please read Sections 20 (Limitation of Liability) and 23 (Dispute Resolution
                            and Arbitration) carefully.</strong> They limit our liability to you and require most
                        disputes to be resolved by individual binding arbitration rather than in court or
                        through a class action. Section 23 includes a 30-day right to opt out of arbitration.
                    </p>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">TABLE OF CONTENTS</h2>
                <div className="space-y-2 text-blue-600 dark:text-blue-400">
                    <div><a href="#services" className="hover:underline">1. OUR SERVICES</a></div>
                    <div><a href="#medical-disclaimer" className="hover:underline">2. MEDICAL DISCLAIMER</a></div>
                    <div><a href="#va-disclaimer" className="hover:underline">3. VA CLAIMS DISCLAIMER</a></div>
                    <div><a href="#no-representation" className="hover:underline">4. NO REPRESENTATION, NO ACCREDITATION, NO FEES</a></div>
                    <div><a href="#tool-disclaimers" className="hover:underline">5. SPECIFIC TOOL DISCLAIMERS</a></div>
                    <div><a href="#no-professional-relationship" className="hover:underline">6. NO PROFESSIONAL RELATIONSHIP</a></div>
                    <div><a href="#crisis" className="hover:underline">7. EMERGENCIES AND CRISIS RESOURCES</a></div>
                    <div><a href="#eligibility" className="hover:underline">8. ELIGIBILITY AND USER REPRESENTATIONS</a></div>
                    <div><a href="#caregivers" className="hover:underline">9. CAREGIVER AND THIRD-PARTY PROFILES</a></div>
                    <div><a href="#data-ownership" className="hover:underline">10. DATA OWNERSHIP, STORAGE, AND BACKUPS</a></div>
                    <div><a href="#exports" className="hover:underline">11. EXPORTS AND GENERATED DOCUMENTS</a></div>
                    <div><a href="#prohibited" className="hover:underline">12. PROHIBITED ACTIVITIES</a></div>
                    <div><a href="#ip" className="hover:underline">13. INTELLECTUAL PROPERTY AND LICENSE</a></div>
                    <div><a href="#feedback" className="hover:underline">14. FEEDBACK</a></div>
                    <div><a href="#app-stores" className="hover:underline">15. APP STORE TERMS (APPLE AND GOOGLE)</a></div>
                    <div><a href="#third-party" className="hover:underline">16. THIRD-PARTY SERVICES AND OPEN SOURCE</a></div>
                    <div><a href="#accessibility" className="hover:underline">17. ACCESSIBILITY</a></div>
                    <div><a href="#modifications" className="hover:underline">18. MODIFICATIONS, INTERRUPTIONS, AND TERMINATION</a></div>
                    <div><a href="#disclaimer" className="hover:underline">19. DISCLAIMER OF WARRANTIES</a></div>
                    <div><a href="#liability" className="hover:underline">20. LIMITATION OF LIABILITY</a></div>
                    <div><a href="#indemnification" className="hover:underline">21. INDEMNIFICATION</a></div>
                    <div><a href="#governing-law" className="hover:underline">22. GOVERNING LAW</a></div>
                    <div><a href="#disputes" className="hover:underline">23. DISPUTE RESOLUTION AND ARBITRATION</a></div>
                    <div><a href="#misc" className="hover:underline">24. MISCELLANEOUS</a></div>
                    <div><a href="#contact" className="hover:underline">25. CONTACT US</a></div>
                </div>
            </section>

            {/* 1. Our Services */}
            <section id="services" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. OUR SERVICES</h2>
                <p className="mb-3">{COMPANY.appName} provides the following documentation features:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Symptom logging across a library of more than 900 symptoms organized into 14 body systems, with severity, duration, frequency, triggers, functional impact, and notes</li>
                    <li>Quick Log for chronic and recurring symptoms, plus the ability to create custom symptoms</li>
                    <li>Medication tracking, including dosage, adherence, side effects, and effectiveness over time</li>
                    <li>Appointment records and appointment notes</li>
                    <li>Health measurements such as blood pressure, blood glucose, and weight</li>
                    <li>Activities of Daily Living (ADL) logging</li>
                    <li>Symptom history, trend charts, and pattern visualization</li>
                    <li>Educational descriptions for more than 180 conditions, plain-language explanations of VA rules, service connection pathways, and references to landmark veterans law decisions</li>
                    <li>Rating evidence views that compare your logged entries to VA rating criteria drawn from 38 CFR Part 4</li>
                    <li>Special Monthly Compensation (SMC) analysis and calculator</li>
                    <li>Rating scenario and combined rating calculators</li>
                    <li>Buddy Statement Generator (lay statement drafting assistance)</li>
                    <li>C&amp;P exam preparation guidance and post-exam After Action Report</li>
                    <li>TDIU worksheet organized around VA Form 21-8940</li>
                    <li>Informational guide to the Program of Comprehensive Assistance for Family Caregivers (PCAFC)</li>
                    <li>Multi-profile support for caregivers</li>
                    <li>PDF, CSV, and JSON export, plus JSON backup and restore</li>
                    <li>Optional local reminders</li>
                    <li>Accessibility settings, including font size, high contrast, reduced motion, and dark mode</li>
                </ul>
                <p>
                    The Services operate as a Progressive Web App and as native applications for Android and
                    iOS. All data is stored locally on your device. The Services are provided free of charge
                    and contain no advertising, no in-app purchases, and no subscriptions.
                </p>
            </section>

            {/* 2. Medical Disclaimer */}
            <section id="medical-disclaimer" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. MEDICAL DISCLAIMER</h2>
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-4 text-left">
                    <p className="text-red-800 dark:text-red-300 font-bold mb-3">⚠️ IMPORTANT — PLEASE READ CAREFULLY</p>
                    <div className="text-red-700 dark:text-red-400 space-y-3">
                        <p>
                            <strong>THE CREATOR OF THIS APP IS NOT A MEDICAL DOCTOR, LICENSED PHYSICIAN, NURSE,
                                PHYSICIAN ASSISTANT, THERAPIST, PSYCHOLOGIST, PHARMACIST, OR HEALTHCARE PROVIDER OF
                                ANY KIND.</strong> The creator is a veteran who built this tool to help fellow
                            veterans, caregivers, and others document their health symptoms.
                        </p>
                        <p className="font-semibold">{COMPANY.appName} is NOT:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>A medical device, and it is not cleared, approved, or regulated by the U.S. Food and Drug Administration or any comparable authority</li>
                            <li>A diagnostic tool capable of identifying diseases or conditions</li>
                            <li>A substitute for professional medical advice, diagnosis, or treatment</li>
                            <li>A replacement for consultation with a qualified healthcare provider</li>
                            <li>A tool for making medical or medication decisions</li>
                            <li>An emergency response, monitoring, or crisis intervention tool</li>
                            <li>A source of clinical guidance, treatment recommendations, or drug information</li>
                        </ul>
                    </div>
                </div>

                <p className="mb-3">
                    <strong>The information and features provided by this app exist for personal
                        documentation only.</strong> The app:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>Does not provide medical diagnoses.</strong> Only a licensed healthcare provider can diagnose a medical condition. Selecting a condition name in the app is a labeling and organizing choice you make for your own records; it is not a diagnosis and does not mean you have that condition.</li>
                    <li><strong>Does not offer medical advice.</strong> Educational content about conditions is general background information, not treatment guidance for you.</li>
                    <li><strong>Does not replace your doctor.</strong> Discuss all health concerns with a qualified medical professional.</li>
                    <li><strong>Does not monitor you.</strong> No one reviews your entries. Logging a severe symptom does not alert anyone, and no one will contact you.</li>
                    <li><strong>Does not guarantee accuracy.</strong> Content may contain errors, may be incomplete, and may become outdated.</li>
                    <li><strong>Does not create a doctor-patient relationship.</strong></li>
                </ul>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your responsibilities:</h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Consult a qualified healthcare professional for medical advice</li>
                        <li>Do not start, stop, or change any medication or treatment based on anything in this app</li>
                        <li>Do not delay seeking care because your symptoms look manageable in a chart</li>
                        <li>Seek immediate medical attention for any health emergency</li>
                        <li>Verify health information with your provider</li>
                        <li>Understand that symptom tracking is personal record-keeping, not medical guidance</li>
                    </ul>
                </div>

                <p className="font-semibold text-red-700 dark:text-red-400">
                    IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR, GO TO THE EMERGENCY
                    DEPARTMENT, OR CALL {CRISIS.emergency} IMMEDIATELY. DO NOT RELY ON THIS APP FOR EMERGENCY
                    MEDICAL NEEDS.
                </p>
            </section>

            {/* 3. VA Claims Disclaimer */}
            <section id="va-disclaimer" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. VA CLAIMS DISCLAIMER</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4 text-left">
                    <p className="text-blue-800 dark:text-blue-300 font-bold">FOR VETERANS USING THE APP</p>
                </div>
                <p className="mb-3">
                    The VA rating evidence features are provided for informational and personal documentation
                    purposes only:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>The app is <strong>not affiliated with, endorsed by, sponsored by, or connected to</strong> the U.S. Department of Veterans Affairs or any other government agency, and no such affiliation should be inferred from any name, term, citation, or reference used in the app</li>
                    <li>The app <strong>does not rate you.</strong> It shows what level of documentation your own entries appear to support when compared to published criteria. That is not a rating, a prediction, or an entitlement</li>
                    <li>Rating analysis <strong>does not guarantee</strong> any specific VA disability rating, effective date, or benefit</li>
                    <li>The app <strong>does not submit</strong> claims, upload evidence, or communicate with the VA on your behalf</li>
                    <li><strong>All rating and benefit determinations are made solely by the VA</strong>, based on the entire record including medical evidence the app has no access to</li>
                    <li>Documentation from this app should <strong>supplement, not replace</strong>, medical evidence and professional guidance</li>
                    <li>Rating criteria, diagnostic codes, and payment rates <strong>change without notice.</strong> The app may not reflect the current regulation, the current rate table, or the current VA interpretation at the time you use it</li>
                    <li>Self-reported symptom logs are <strong>lay evidence.</strong> They can be probative, but they are weighed by VA adjudicators alongside medical evidence and are not a substitute for clinical documentation, diagnostic testing, or a nexus opinion</li>
                </ul>
                <p className="mb-4">
                    <strong>We strongly recommend working with a VA-accredited Veterans Service Organization
                        representative, claims agent, or attorney.</strong> These services are available at no
                    cost through VSOs, and accredited representatives can be verified through the VA Office
                    of General Counsel accreditation search.
                </p>
            </section>

            {/* 4. No Representation */}
            <section id="no-representation" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. NO REPRESENTATION, NO ACCREDITATION, NO FEES</h2>
                <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-600 rounded p-4 mb-4">
                    <p className="mb-3">
                        Federal law governs who may prepare, present, or prosecute a claim for benefits before
                        the U.S. Department of Veterans Affairs, and who may charge a fee for doing so. See
                        38 U.S.C. §§ 5901–5905 and 38 C.F.R. §§ 14.626–14.637. A number of states have also
                        enacted laws regulating unaccredited VA claims consultants.
                    </p>
                    <p className="font-semibold mb-2">To be unambiguous about what this app is:</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>{COMPANY.legalName} and its creator are <strong>not accredited</strong> by the VA as an attorney, claims agent, or representative</li>
                        <li>We <strong>do not represent</strong> you or anyone else before the VA</li>
                        <li>We <strong>do not prepare, present, or prosecute</strong> claims for you. You use the app yourself, on your own device, to organize your own records</li>
                        <li>We <strong>charge no fee of any kind</strong> — not for the app, not for any feature, not for any document it generates, and not contingent on any claim outcome. The app is free</li>
                        <li>We <strong>do not advise you</strong> on what to claim, when to file, how to argue a claim, or whether to appeal</li>
                        <li>We <strong>never ask for</strong> your VA.gov credentials, your VA file number, or your Social Security number, and you should not enter them</li>
                    </ul>
                </div>
                <p className="mb-4">
                    The app is self-help software, comparable to a notebook or a spreadsheet with a helpful
                    structure. You remain solely responsible for what you file with the VA and for the
                    accuracy of everything in it.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-300 text-sm">
                        <strong>Beware of "claim sharks."</strong> If anyone offers to increase your rating in
                        exchange for a percentage of your back pay or a large up-front fee, verify their VA
                        accreditation before signing anything. Accredited VSO representatives assist at no
                        charge. This app is not affiliated with any claims consulting business, and no one
                        should ever charge you for using it or for a document you generated with it.
                    </p>
                </div>
                {/* ATTORNEY REVIEW: Please confirm this framing is sufficient given 38 U.S.C. 5901 and the
              recent wave of state claims-consultant statutes (CA SB 694 eff. 1/1/2027; ME, NY, VA,
              MS). Key facts: the app is free, does not file, does not advise on claim strategy, and
              is used by the veteran on their own device. Advise whether any state requires a
              registration or a specific notice even for free self-help software. */}
            </section>

            {/* 5. Tool-specific disclaimers */}
            <section id="tool-disclaimers" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. SPECIFIC TOOL DISCLAIMERS</h2>
                <p className="mb-4">
                    Several features warrant their own warnings. Each is offered as an organizing aid, not as
                    an authoritative output.
                </p>

                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rating Evidence and rating criteria content</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Criteria summaries are our plain-language restatements of 38 CFR Part 4 and are not
                            the regulation itself. They may be condensed, simplified, out of date, or wrong. The
                            controlling text is the current Code of Federal Regulations, together with VA
                            adjudication manuals and case law. Always verify against the primary source.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SMC Calculator and Rating Scenario Calculator</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Special Monthly Compensation eligibility under 38 CFR §§ 3.350 and 3.352 and
                            38 U.S.C. § 1114 is complex and fact-specific. Combined ratings use VA's combined
                            ratings table and rounding rules, which do not work like ordinary addition. Any
                            figure the app displays is an <strong>estimate for your own planning</strong>, not a
                            determination of eligibility or of any amount payable. Compensation rate tables built
                            into the app reflect a particular rate year and <strong>become outdated when rates
                            change</strong>. Confirm all figures with the VA or an accredited representative.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Buddy Statement Generator</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            This tool produces a <strong>draft in your own words, for you or your witness to
                            review and correct</strong>. It is not a sworn statement until the person signing it
                            has read it, confirmed that every fact is true from their own knowledge, and signed
                            it. Never sign or submit a generated statement you have not verified. A statement
                            submitted to the VA is a statement to the federal government.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">C&amp;P Exam Prep and After Action Report</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Preparation guidance is general information about what examinations commonly cover.
                            It is <strong>not coaching on what to say</strong>, and you should answer every
                            examiner's question truthfully and completely, describing your worst days as well as
                            your better ones, without exaggeration. The After Action Report is your personal
                            recollection of an exam; it is not an official record, has no standing with the VA on
                            its own, and does not replace a copy of the examiner's report or DBQ.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">TDIU worksheet (VA Form 21-8940)</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            The worksheet helps you gather information before you complete VA's official forms.
                            It is <strong>not a VA form, is not accepted by the VA, and cannot be filed</strong>.
                            You must complete and submit the current official VA Form 21-8940, and typically VA
                            Form 21-4192, through VA's own channels.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PCAFC and benefits guides</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Information about caregiver programs, CHAMPVA, and related benefits is general
                            educational content that changes with regulation and policy. Eligibility is
                            determined solely by the VA. Verify current requirements with the VA before relying
                            on any of it.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Case law and regulatory references</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            References to court decisions, statutes, and regulations are provided for orientation
                            only. They are not legal research, may be superseded, and may not apply to your
                            situation. This is not legal advice.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. No Professional Relationship */}
            <section id="no-professional-relationship" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. NO PROFESSIONAL RELATIONSHIP</h2>
                <p className="mb-3">
                    <strong>Use of this app does not create any professional relationship between you and{' '}
                        {COMPANY.legalName} or its creator.</strong> Specifically:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>No doctor-patient relationship.</strong> No medical, nursing, therapeutic, counseling, or other healthcare relationship is created</li>
                    <li><strong>No attorney-client relationship.</strong> No legal relationship is created, including when you use VA claims-related features, and nothing you enter into the app is protected by attorney-client privilege</li>
                    <li><strong>No representative or agent relationship.</strong> We do not act for you before the VA or any other body</li>
                    <li><strong>No fiduciary duty.</strong> We owe you no fiduciary obligation regarding your health, your benefits, or your decisions</li>
                    <li><strong>No professional advice.</strong> Nothing in the app constitutes medical, legal, financial, tax, or vocational advice</li>
                </ul>
                <p>
                    Information in the app is general and is not tailored to your conditions or
                    circumstances. Always seek personalized advice from qualified professionals.
                </p>
            </section>

            {/* 7. Crisis */}
            <section id="crisis" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. EMERGENCIES AND CRISIS RESOURCES</h2>
                <p className="mb-4">
                    This app cannot help in an emergency. It does not monitor your entries, does not detect
                    crisis, and does not alert anyone.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-4">
                    <p className="font-bold text-red-800 dark:text-red-300 mb-2">🚨 Medical emergency</p>
                    <p className="text-red-700 dark:text-red-400 text-sm">
                        Call {CRISIS.emergency} or go to your nearest emergency department immediately.
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">🎖️ Veterans Crisis Line</p>
                    <div className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                        <p><strong>Call:</strong> {CRISIS.veteransCrisisPhone}</p>
                        <p><strong>Text:</strong> {CRISIS.veteransCrisisText}</p>
                        <p><strong>Chat:</strong> {CRISIS.veteransCrisisChat}</p>
                        <p className="mt-2">
                            Available 24/7 to veterans, service members, National Guard and Reserve members, and
                            their family members and friends. You do not need to be enrolled in VA health care.
                        </p>
                    </div>
                </div>
            </section>

            {/* 8. Eligibility */}
            <section id="eligibility" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. ELIGIBILITY AND USER REPRESENTATIONS</h2>
                <p className="mb-3">By using the Services, you represent and warrant that:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>You are at least 18 years old, or you are a minor with the permission and supervision of a parent or legal guardian who has accepted these Legal Terms on your behalf</li>
                    <li>You have the legal capacity to agree to these Legal Terms</li>
                    <li>You will not use the Services for any illegal or unauthorized purpose</li>
                    <li>Your use will not violate any applicable law or regulation</li>
                    <li>You understand this app is for documentation only and is not a medical device</li>
                    <li>You understand the creator is not a medical professional and is not VA-accredited</li>
                    <li>You will not rely on this app as a substitute for professional medical, legal, or claims advice</li>
                    <li>If you track symptoms for another person, you have that person's consent or the legal authority to do so</li>
                    <li>You understand that VA rating information in the app is for reference only and guarantees no rating decision or benefit</li>
                    <li>Everything you record and everything you submit to the VA or any other party is truthful and accurate to the best of your knowledge</li>
                    <li>You are solely responsible for backing up your data</li>
                </ul>
                <p>
                    You are not permitted to use the Services if you are located in a country subject to a
                    U.S. government embargo or designated as a terrorist-supporting country, or if you are
                    listed on any U.S. government list of prohibited or restricted parties.
                </p>
            </section>

            {/* 9. Caregivers */}
            <section id="caregivers" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. CAREGIVER AND THIRD-PARTY PROFILES</h2>
                <p className="mb-3">
                    If you create a profile to track another person's health, you agree that:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>You have their informed consent, or legal authority such as parental authority, guardianship, conservatorship, or a healthcare power of attorney</li>
                    <li>You will handle their information responsibly and will not disclose it beyond what your role requires or they have authorized</li>
                    <li>You will remove their data from your device if your authority ends or they ask you to</li>
                    <li>You accept full responsibility for that data on your device, including its accuracy and its security</li>
                    <li>We have no relationship with that person, no way to contact them, and no ability to act on any request they make about data stored on your device</li>
                </ul>
                <p>
                    You agree to indemnify us against any claim brought by a person whose information you
                    recorded without adequate consent or authority.
                </p>
            </section>

            {/* 10. Data Ownership */}
            <section id="data-ownership" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. DATA OWNERSHIP, STORAGE, AND BACKUPS</h2>
                <p className="mb-4">
                    <strong>Your data is yours.</strong> All health data you enter is stored locally on your
                    device and belongs to you. We claim no ownership of your symptom logs, notes, statements,
                    or personal health information, and we grant ourselves no license to them.
                </p>
                <p className="mb-3">We do not:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Collect or store your health data on any server</li>
                    <li>Have any ability to view, modify, recover, or delete your data</li>
                    <li>Back up your data for you</li>
                    <li>Sync or transfer your data between devices</li>
                    <li>Have any way to restore data you lose</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                        You are solely responsible for your backups.
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        Local storage can be cleared by you, by your browser, by your operating system, by
                        another user of your device, or by an app or device failure — sometimes without
                        warning. <strong>If your locally stored records are deleted or become unavailable,{' '}
                        {COMPANY.legalName} cannot recover them for you.</strong> Export a JSON backup
                        regularly and keep it somewhere safe. Years of documentation can disappear in one
                        tap on "clear browsing data."
                    </p>
                </div>
                <p className="mb-3">You are solely responsible for:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Maintaining current backups through the Export feature</li>
                    <li>Protecting physical and software access to your device</li>
                    <li>The accuracy and truthfulness of everything you enter</li>
                    <li>How you store, transmit, and share exported reports</li>
                    <li>Verifying any figure, criterion, or statement before you rely on it</li>
                </ul>
            </section>

            {/* 11. Exports */}
            <section id="exports" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. EXPORTS AND GENERATED DOCUMENTS</h2>
                <p className="mb-4">
                    Documents the app generates — PDF reports, claim evidence packages, buddy statement
                    drafts, worksheets, CSV files, and JSON backups — are produced on your device from data
                    you entered. <strong>They are your documents and your responsibility.</strong>
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Generated documents are <strong>not VA documents</strong>, are not official records, and carry no authority of their own</li>
                    <li>They are <strong>not encrypted</strong> and can be read by anyone who obtains the file</li>
                    <li>You must <strong>read and verify</strong> any document before signing, submitting, or relying on it</li>
                    <li>We are not responsible for what a document contains, how it is formatted, whether a recipient accepts it, or how it is interpreted</li>
                    <li>Once a file leaves the app, it is outside our control entirely</li>
                </ul>
                <p>
                    The app does not review your entries for accuracy, internal consistency, or plausibility.
                    If you record something inaccurately, the export will faithfully reproduce the
                    inaccuracy.
                </p>
            </section>

            {/* 12. Prohibited */}
            <section id="prohibited" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. PROHIBITED ACTIVITIES</h2>
                <p className="mb-3">
                    You may not use the Services for any purpose other than that for which we make them
                    available. You agree not to:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>Create false or misleading documentation</strong>, including fabricating symptoms, backdating entries, or exaggerating severity or frequency</li>
                    <li><strong>Commit or attempt fraud</strong> against the VA, an insurer, an employer, a court, or any other person or entity</li>
                    <li>Present app-generated content as a medical record, a clinical opinion, a VA document, or a document from an accredited representative</li>
                    <li>Represent that the app provides medical advice, diagnosis, or a VA rating determination</li>
                    <li>Claim or imply that the app, its creator, or {COMPANY.legalName} is affiliated with, endorsed by, or accredited by the VA or any government agency</li>
                    <li>Charge any other person a fee for using the app, for documents generated with it, or for assistance based on it, in a manner that would constitute unaccredited practice before the VA</li>
                    <li>Use the Services to track another person without consent or legal authority</li>
                    <li>Bypass, disable, or interfere with security or access controls</li>
                    <li>Reverse engineer, decompile, or disassemble the Services, except to the extent that restriction is prohibited by applicable law</li>
                    <li>Copy, modify, redistribute, sublicense, sell, or create derivative works from the Services or its content databases</li>
                    <li>Use automated systems to scrape, harvest, or extract the app's condition, symptom, or criteria data</li>
                    <li>Upload malicious code or otherwise damage, overburden, or impair the Services</li>
                    <li>Remove, obscure, or alter any copyright, trademark, or disclaimer notice</li>
                </ul>
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-300 font-semibold mb-2">A serious warning about accuracy</p>
                    <p className="text-red-700 dark:text-red-400 text-sm">
                        Knowingly submitting false statements or fraudulent evidence to the VA is a federal
                        offense and can result in loss of benefits, an obligation to repay everything received,
                        fines, and imprisonment. This app makes it easy to produce professional-looking
                        documentation. That is useful only if every word of it is true. Record what actually
                        happened, including the days you felt fine.
                    </p>
                </div>
            </section>

            {/* 13. IP */}
            <section id="ip" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. INTELLECTUAL PROPERTY AND LICENSE</h2>
                <p className="mb-4">
                    Unless otherwise indicated, the Services are our proprietary property. All source code,
                    databases, functionality, software, designs, text, graphics, and compilations of
                    information in the Services (the "Content"), and the trademarks, service marks, names,
                    and logos contained in them (the "Marks"), are owned or controlled by us or licensed to
                    us and are protected by copyright, trademark, and other laws.
                </p>
                <p className="mb-4">
                    Subject to your compliance with these Legal Terms, we grant you a limited,
                    non-exclusive, non-transferable, non-sublicensable, revocable license to install and use
                    one copy of the App on each device you own or control, for your personal,
                    non-commercial use. This license does not permit redistribution, resale, or use of our
                    Content to build a competing product.
                </p>
                <p className="mb-4">
                    <strong>Government works.</strong> Statutes, regulations, VA forms, and federal court
                    decisions cited in the app are works of the United States government and are not subject
                    to our copyright. Our selection, arrangement, summaries, and explanatory text are
                    original works and are protected.
                </p>
                <p>
                    <strong>Your content remains yours.</strong> We claim no ownership of and no license to
                    any symptom log, note, statement, or document you create. It never reaches us.
                </p>
            </section>

            {/* 14. Feedback */}
            <section id="feedback" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">14. FEEDBACK</h2>
                <p>
                    If you send us suggestions, feature ideas, bug reports, or other feedback, you grant us a
                    perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate
                    that feedback into the Services without any obligation of compensation, attribution, or
                    confidentiality. Please do not include any health information or personal details of
                    other people in feedback you send us.
                </p>
            </section>

            {/* 15. App Stores */}
            <section id="app-stores" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">15. APP STORE TERMS (APPLE AND GOOGLE)</h2>
                <p className="mb-4">
                    The following applies if you obtained the App from a third-party application marketplace
                    (each, an "App Provider"). Your use of the App must also comply with the App Provider's
                    applicable terms of service.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 mt-4">A. Apple App Store</h3>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>Acknowledgement.</strong> These Legal Terms are concluded between you and {COMPANY.legalName} only, and not with Apple Inc. ("Apple"). {COMPANY.legalName}, not Apple, is solely responsible for the App and its content.</li>
                    <li><strong>Scope of license.</strong> The license granted to you for the App is a non-transferable license to use the App on any Apple-branded product that you own or control, as permitted by the Usage Rules in the Apple Media Services Terms and Conditions, except that the App may be accessed and used by other accounts associated with you via Family Sharing or volume purchasing.</li>
                    <li><strong>Maintenance and support.</strong> {COMPANY.legalName} is solely responsible for providing any maintenance and support services for the App. Apple has no obligation whatsoever to furnish any maintenance or support services.</li>
                    <li><strong>Warranty.</strong> {COMPANY.legalName} is solely responsible for any product warranties, whether express or implied by law, to the extent not effectively disclaimed. In the event of any failure of the App to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price (if any) for the App. To the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the App, and any other claims, losses, liabilities, damages, costs, or expenses attributable to any failure to conform to any warranty will be {COMPANY.legalName}'s sole responsibility.</li>
                    <li><strong>Product claims.</strong> {COMPANY.legalName}, not Apple, is responsible for addressing any claims by you or any third party relating to the App or your possession and use of it, including product liability claims, any claim that the App fails to conform to any applicable legal or regulatory requirement, and claims arising under consumer protection, privacy, or similar legislation, including in connection with the App's use of the HealthKit or HomeKit frameworks if applicable.</li>
                    <li><strong>Intellectual property rights.</strong> In the event of any third-party claim that the App or your possession and use of it infringes that third party's intellectual property rights, {COMPANY.legalName}, not Apple, will be solely responsible for the investigation, defense, settlement, and discharge of that claim.</li>
                    <li><strong>Legal compliance.</strong> You represent and warrant that you are not located in a country subject to a U.S. government embargo or designated by the U.S. government as a terrorist-supporting country, and that you are not listed on any U.S. government list of prohibited or restricted parties.</li>
                    <li><strong>Developer name and address.</strong> Questions, complaints, and claims regarding the App should be directed to {COMPANY.legalName}, {COMPANY.street}, {COMPANY.cityStateZip}, {COMPANY.privacyEmail}.</li>
                    <li><strong>Third-party terms.</strong> You must comply with applicable third-party terms of agreement when using the App.</li>
                    <li><strong>Third-party beneficiary.</strong> Apple and Apple's subsidiaries are third-party beneficiaries of these Legal Terms, and upon your acceptance of these Legal Terms, Apple will have the right (and will be deemed to have accepted the right) to enforce these Legal Terms against you as a third-party beneficiary.</li>
                </ul>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 mt-4">B. Google Play</h3>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>These Legal Terms are between you and {COMPANY.legalName} only, and not with Google LLC ("Google"). Google is not responsible for the App or its content.</li>
                    <li>Your use of the App must comply with the Google Play Terms of Service then in effect.</li>
                    <li>Google is a third-party beneficiary of these Legal Terms and may enforce them against you.</li>
                    <li>Google is solely a provider of the marketplace from which you obtained the App and has no obligation to provide maintenance or support.</li>
                    <li>As required by Google Play's health app policies: <strong>this app is not a medical device and does not diagnose, treat, cure, or prevent any medical condition.</strong> Consult a qualified healthcare professional for medical advice, diagnosis, or treatment.</li>
                </ul>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Because the App is free, no refund of a purchase price is applicable. Refunds, where a
                    store offers them, are handled under that store's policies, not by us.
                </p>
            </section>

            {/* 16. Third party */}
            <section id="third-party" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">16. THIRD-PARTY SERVICES AND OPEN SOURCE</h2>
                <p className="mb-4">
                    The App is built using third-party open source software components, each licensed under
                    its own terms. Those components run on your device as part of the App and do not
                    transmit your data.
                </p>
                <p className="mb-4">
                    The Services may contain links to third-party websites, including VA.gov, the eCFR, and
                    crisis resources. We provide these for convenience. We do not control them, do not
                    endorse their content, and are not responsible for their accuracy, availability,
                    practices, or privacy policies. Your use of a linked site is governed by that site's
                    terms.
                </p>
                <p>
                    If you use your device's share sheet, printing, or file-saving functions to move an
                    export out of the App, the receiving application or service is a third party operating
                    under its own terms.
                </p>
            </section>

            {/* 17. Accessibility */}
            <section id="accessibility" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">17. ACCESSIBILITY</h2>
                <p className="mb-4">
                    We are committed to making the Services usable by people with disabilities and build
                    toward WCAG 2.1 Level AA. The App offers adjustable font sizes, high contrast mode,
                    reduced motion, light and dark themes, keyboard navigation, and screen reader support.
                </p>
                <p>
                    If you encounter an accessibility barrier, contact us at{' '}
                    <strong>{COMPANY.privacyEmail}</strong> with a description of the problem and the
                    assistive technology you use. We will work to remedy it and will try to provide the
                    information another way in the meantime.
                </p>
            </section>

            {/* 18. Modifications */}
            <section id="modifications" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">18. MODIFICATIONS, INTERRUPTIONS, AND TERMINATION</h2>
                <p className="mb-4">
                    We may change, modify, suspend, or remove any part of the Services at any time, for any
                    reason, at our sole discretion and without notice or liability to you. We may also
                    discontinue the Services entirely. We are under no obligation to update any content,
                    criteria, or rate table.
                </p>
                <p className="mb-4">
                    We cannot guarantee the Services will be available at all times. Because the App runs
                    locally and works offline, most features continue to function without connectivity, but
                    updates and web-based access require a connection.
                </p>
                <p className="mb-4">
                    <strong>Termination by you:</strong> stop using the Services at any time. Deleting the
                    app does not necessarily delete your locally stored data, and keeping your data does not
                    keep you bound to anything. Use Delete All Data in Settings if you want the data gone.
                </p>
                <p>
                    <strong>Termination by us:</strong> these Legal Terms remain in effect while you use the
                    Services. We may deny access to the Services for any breach of these Legal Terms. Because
                    there are no accounts, this is generally limited to blocking access to web-hosted
                    resources. Sections concerning intellectual property, disclaimers, limitation of
                    liability, indemnification, governing law, and dispute resolution survive termination.
                </p>
            </section>

            {/* 19. Disclaimer */}
            <section id="disclaimer" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">19. DISCLAIMER OF WARRANTIES</h2>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="uppercase font-semibold mb-4">
                        THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS, FREE OF CHARGE. YOU AGREE
                        THAT YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY
                        LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND
                        YOUR USE OF THEM, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                        PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="mb-4">
                        WE MAKE NO WARRANTY OR REPRESENTATION ABOUT THE ACCURACY, CURRENCY, OR COMPLETENESS OF
                        THE SERVICES' CONTENT, INCLUDING ANY MEDICAL, LEGAL, REGULATORY, OR VA RATING
                        INFORMATION, AND WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>ERRORS, MISTAKES, OMISSIONS, OR INACCURACIES OF CONTENT AND MATERIALS, INCLUDING OUTDATED REGULATIONS, DIAGNOSTIC CODES, OR COMPENSATION RATES</li>
                        <li>PERSONAL INJURY, DEATH, OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO OR USE OF THE SERVICES</li>
                        <li>LOSS, CORRUPTION, OR DELETION OF DATA STORED ON YOUR DEVICE, FROM ANY CAUSE</li>
                        <li>UNAUTHORIZED ACCESS TO YOUR DEVICE OR TO ANY FILE YOU EXPORTED FROM THE SERVICES</li>
                        <li>INTERRUPTION OR CESSATION OF THE SERVICES</li>
                        <li>BUGS, VIRUSES, OR OTHER HARMFUL CODE TRANSMITTED THROUGH THE SERVICES BY ANY THIRD PARTY</li>
                        <li>ANY DECISION, ACTION, OR OMISSION BY YOU, A HEALTHCARE PROVIDER, THE VA, A COURT, OR ANY OTHER PARTY BASED ON CONTENT FROM THE SERVICES</li>
                    </ul>
                </div>
                <p className="font-semibold mb-4">
                    THE SERVICES ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR MEDICAL
                    CONDITION. THE CREATOR IS NOT A MEDICAL PROFESSIONAL, AND THIS APP DOES NOT PROVIDE
                    MEDICAL ADVICE. THE CREATOR IS NOT VA-ACCREDITED, AND THIS APP DOES NOT PROVIDE CLAIMS
                    REPRESENTATION OR LEGAL ADVICE.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Some jurisdictions do not allow the exclusion of certain warranties, so some of the above
                    exclusions may not apply to you. In that case, such warranties are limited to the minimum
                    duration and scope permitted by law.
                </p>
            </section>

            {/* 20. Liability */}
            <section id="liability" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">20. LIMITATION OF LIABILITY</h2>
                <p className="uppercase mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE OR OUR MEMBERS, MANAGERS,
                    OFFICERS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY
                    DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES,
                    INCLUDING LOST PROFITS, LOST REVENUE, LOSS OF DATA, LOSS OF BENEFITS, OR LOSS OF GOODWILL,
                    ARISING FROM OR RELATING TO YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE
                    POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="uppercase mb-4">
                    WE SPECIFICALLY DISCLAIM ANY LIABILITY FOR HEALTH OUTCOMES, MEDICAL DECISIONS, DELAYED OR
                    FOREGONE MEDICAL CARE, VA CLAIM OUTCOMES, DENIED OR REDUCED BENEFITS, EFFECTIVE DATES,
                    OVERPAYMENT DEMANDS, LOST OR DELETED DATA, OR ANY OTHER CONSEQUENCE ARISING FROM YOUR USE
                    OF OR RELIANCE ON THE SERVICES. YOU ASSUME ALL RISK ASSOCIATED WITH YOUR USE OF THE APP
                    AND ANY DECISION MADE BASED ON INFORMATION DISPLAYED IN IT.
                </p>
                <p className="mb-4">
                    <strong>Aggregate cap.</strong> Notwithstanding anything to the contrary, our total
                    aggregate liability to you for all claims arising out of or relating to the Services will
                    not exceed the greater of (a) the total amount you paid us for the Services in the twelve
                    months preceding the claim, which for a free application is zero dollars ($0.00), or
                    (b) one hundred U.S. dollars ($100.00).
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Some jurisdictions do not allow the exclusion or limitation of certain damages, including
                    for death or personal injury caused by negligence, fraud, or fraudulent
                    misrepresentation. In those jurisdictions, our liability is limited to the smallest extent
                    permitted by law, and nothing in these Legal Terms limits any liability that cannot
                    lawfully be limited.
                </p>
                {/* ATTORNEY REVIEW: Please confirm the $100 / $0 cap is enforceable and appropriate for a
              free health-adjacent app under Iowa law and in consumer-protective jurisdictions,
              and whether it should be raised. */}
            </section>

            {/* 21. Indemnification */}
            <section id="indemnification" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">21. INDEMNIFICATION</h2>
                <p>
                    You agree to defend, indemnify, and hold harmless {COMPANY.legalName}, its subsidiaries,
                    affiliates, and their respective officers, members, managers, agents, partners, and
                    employees, from and against any loss, damage, liability, claim, or demand, including
                    reasonable attorneys' fees and expenses, made by any third party arising out of or
                    relating to: (1) your use of the Services; (2) your breach of these Legal Terms; (3) any
                    breach of your representations and warranties; (4) your violation of the rights of a
                    third party, including intellectual property and privacy rights; (5) any health-related
                    decision or outcome resulting from your use of the Services; (6) any VA claim decision,
                    overpayment, or other outcome related to documentation created using the Services;
                    (7) any statement, document, or export you submitted to the VA or any other party;
                    (8) your tracking of another person's health information without adequate consent or
                    legal authority. We reserve the right, at your expense, to assume the exclusive defense
                    and control of any matter for which you are required to indemnify us, and you agree to
                    cooperate with our defense of such claims.
                </p>
            </section>

            {/* 22. Governing law */}
            <section id="governing-law" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">22. GOVERNING LAW</h2>
                <p>
                    These Legal Terms and any dispute arising out of them are governed by the laws of the
                    State of {COMPANY.governingState}, United States, without regard to its conflict of law
                    principles. Subject to the arbitration provisions in Section 23, you and{' '}
                    {COMPANY.legalName} irrevocably consent that the state and federal courts located in Linn
                    County, Iowa will have exclusive jurisdiction to resolve any dispute arising in connection
                    with these Legal Terms. The United Nations Convention on Contracts for the International
                    Sale of Goods does not apply.
                </p>
            </section>

            {/* 23. Disputes */}
            <section id="disputes" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">23. DISPUTE RESOLUTION AND ARBITRATION</h2>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                        PLEASE READ THIS SECTION CAREFULLY. It requires most disputes to be resolved by
                        individual binding arbitration instead of in court, waives your right to a jury trial,
                        and waives your right to participate in a class action. You may opt out of arbitration
                        within 30 days, as described below, without affecting any other part of these terms.
                    </p>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">A. Informal resolution first</h3>
                <p className="mb-4">
                    Before filing anything, you agree to contact us at <strong>{COMPANY.privacyEmail}</strong>{' '}
                    with a written description of the dispute and the relief you seek, and to attempt to
                    resolve it informally for at least thirty (30) days. Most problems are fixable this way.
                </p>
                <p className="mb-4">
                    During the required informal-resolution period, any applicable statute of limitations or
                    other filing deadline will be tolled to the extent permitted by applicable law.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">B. Binding individual arbitration</h3>
                <p className="mb-4">
                    If informal resolution fails, any dispute, claim, or controversy arising out of or
                    relating to the Services or these Legal Terms will be resolved by final and binding
                    arbitration administered by the American Arbitration Association under its Consumer
                    Arbitration Rules, rather than in court. The arbitration will be conducted by a single
                    arbitrator. It will take place in Linn County, Iowa, or, at your election, by telephone,
                    videoconference, or on documents only. The arbitrator's award may be entered in any court
                    of competent jurisdiction. The Federal Arbitration Act governs the interpretation and
                    enforcement of this provision.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">C. Class action waiver</h3>
                <p className="mb-4 uppercase">
                    YOU AND {COMPANY.legalName.toUpperCase()} AGREE THAT EACH MAY BRING CLAIMS AGAINST THE
                    OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
                    PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR
                    MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS OR PRESIDE OVER ANY FORM OF
                    REPRESENTATIVE PROCEEDING.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">D. Exceptions</h3>
                <p className="mb-4">
                    Either party may bring an individual action in small claims court for any claim within
                    that court's jurisdiction. Either party may also seek injunctive or equitable relief in
                    court for actual or threatened infringement or misuse of intellectual property rights.
                    Nothing in this section prevents you from reporting a concern to a government agency.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">E. Your right to opt out</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-sm">
                        <strong>You may opt out of this arbitration agreement.</strong> Send an email to{' '}
                        <strong>{COMPANY.privacyEmail}</strong> with the subject line "Arbitration Opt-Out"
                        within thirty (30) days of the date you first accept these Legal Terms, stating your
                        name and that you decline arbitration. Opting out has no effect on your ability to use
                        the Services and does not affect any other provision of these Legal Terms. If you opt
                        out, disputes will be resolved in the courts identified in Section 22.
                    </p>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">F. Severability</h3>
                <p className="mb-2">
                    If any portion of this arbitration agreement is found unenforceable as to a particular
                    claim or request for relief, that portion will be severed to the minimum extent
                    necessary, and the remaining portions will remain in effect to the fullest extent
                    permitted by law.
                </p>
                <p>
                    If the prohibition against class, collective, or representative arbitration is found
                    unenforceable with respect to a particular claim or request for relief, that claim or
                    request for relief will proceed in a court of competent jurisdiction rather than in
                    class, collective, or representative arbitration. If the requirement to arbitrate in
                    subsection B is found unenforceable in its entirety, the dispute will be resolved as
                    provided in Section 22.
                </p>
                {/* COUNSEL, resolved: the one-year contractual limitations period that previously sat
              here as subsection H has been DELETED in its entirety and deliberately NOT replaced.
              Otherwise-applicable statutory limitation periods govern. The tolling sentence in
              subsection A above was broadened to cover "any applicable statute of limitations or
              other filing deadline" per counsel's instruction. Subsections renumbered A-F. */}
            </section>

            {/* 24. Misc */}
            <section id="misc" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">24. MISCELLANEOUS</h2>
                <p className="mb-4">
                    These Legal Terms, together with our Privacy Policy and any operating rules we post,
                    constitute the entire agreement between you and us regarding the Services and supersede
                    all prior agreements on that subject. Our failure to exercise or enforce any right or
                    provision does not waive it. These Legal Terms operate to the fullest extent permitted by
                    law. We may assign our rights and obligations at any time, including in connection with a
                    merger, acquisition, or sale of assets; you may not assign yours without our written
                    consent. If any provision is held unlawful, void, or unenforceable, it is severed and the
                    remaining provisions stay in effect. No joint venture, partnership, employment, or agency
                    relationship is created between you and us. These Legal Terms will not be construed
                    against us by virtue of having drafted them. You waive any defense based on the
                    electronic form of these Legal Terms or the absence of signatures.
                </p>
                <p>
                    <strong>Notices.</strong> We may provide notice to you by posting in the App or on our
                    website. You may provide notice to us at the address or email in Section 25.
                </p>
            </section>

            {/* 25. Contact */}
            <section id="contact" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">25. CONTACT US</h2>
                <p className="mb-4">
                    To resolve a complaint regarding the Services, or to receive further information about
                    using the Services, contact us at:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                    <p className="font-semibold">{COMPANY.legalName}</p>
                    <p>{COMPANY.street}</p>
                    <p>{COMPANY.cityStateZip}</p>
                    <p>{COMPANY.country}</p>
                    <p className="mt-2">
                        Email:{' '}
                        <a href={`mailto:${COMPANY.privacyEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            {COMPANY.privacyEmail}
                        </a>
                    </p>
                    <p>
                        Website:{' '}
                        <a href={COMPANY.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            {COMPANY.websiteLabel}
                        </a>
                    </p>
                </div>
            </section>

            {/* Footer */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {COMPANY.appName} — A documentation tool created by a veteran, for veterans. Not medical
                    advice. Not affiliated with the VA. 📋
                </p>
            </div>
        </div>
    );
};

export default TermsOfUse;