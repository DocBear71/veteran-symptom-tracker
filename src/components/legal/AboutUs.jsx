// file: src/components/legal/AboutUs.jsx  v3
// Doc Bear's Symptom Vault -- About Us
//
// v3 CHANGES (for attorney review):
//  - Company/contact details now come from legalMeta.js
//  - Updated feature inventory to match the current app
//  - Added a prominent "What this app is NOT" block so the marketing page carries the
//    same disclaimers as the Terms (a mismatch between marketing claims and legal terms
//    is a common consumer-protection exposure)
//  - Founder bio corrected and tightened: Ph.D. in Hospitality and Tourism Management,
//    explicitly NOT a medical or legal credential
//  - Removed the unqualified "Free to Use: Core features are free" wording, which implied
//    the existence of paid features. The app is entirely free.
//  - Removed the unsupported "200+ conditions" claim in favor of verifiable numbers
//
// ATTORNEY NOTE: search for "ATTORNEY REVIEW" comments below.

import React from 'react';
import { COMPANY, CRISIS } from './legalMeta';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    About {COMPANY.appName}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                    Privacy-first health documentation for veterans, caregivers, and everyone else
                </p>
            </div>

            {/* Mission Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4 mb-8 text-center">
                <p className="text-blue-800 dark:text-blue-300 font-bold">
                    🎖️ Built by a veteran, for veterans — and for anyone who needs to document their health journey.
                </p>
            </div>

            {/* What this app is NOT -- kept high on the page on purpose */}
            <section className="mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-5">
                    <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-3">
                        ⚠️ Before anything else — what this app is not
                    </h2>
                    <ul className="list-disc ml-6 space-y-2 text-yellow-700 dark:text-yellow-400 text-sm">
                        <li>
                            <strong>Not a medical device.</strong> It does not diagnose, treat, cure, or prevent
                            any medical condition. The creator is not a doctor or any kind of licensed healthcare
                            provider.
                        </li>
                        <li>
                            <strong>Not affiliated with the VA.</strong> No government agency endorses,
                            sponsors, or is connected to this app.
                        </li>
                        <li>
                            <strong>Not a claims service.</strong> The creator is not a VA-accredited attorney,
                            claims agent, or VSO representative. We never file claims, never represent anyone
                            before the VA, and never charge a fee for anything.
                        </li>
                        <li>
                            <strong>Not a rating.</strong> The app shows what your own documentation appears to
                            support when compared with published criteria. Only the VA decides ratings.
                        </li>
                        <li>
                            <strong>Not a monitoring service.</strong> Nobody reads your entries. The app cannot
                            help in a crisis or an emergency.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Our Mission */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="mb-4">
                    {COMPANY.appName} came out of a simple, frustrating problem: when it matters most —
                    during a C&amp;P exam, a claims review, or a fifteen-minute appointment — people cannot
                    reliably recall how often a symptom happened, how bad it got, or what it stopped them
                    from doing. Memory is a poor witness. A written record kept over months is a much better
                    one.
                </p>
                <p className="mb-3">Our mission is to provide a documentation tool that:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Helps veterans build consistent, contemporaneous records of their own symptoms</li>
                    <li>Shows how those records line up with published VA rating criteria from 38 CFR Part 4, so the veteran understands what is and is not documented</li>
                    <li>Supports caregivers tracking for a veteran, an aging parent, a spouse, or a child</li>
                    <li>Works just as well for anyone managing a chronic condition who simply wants a better record for their doctor</li>
                    <li>Keeps every bit of that data on the user's own device, never on our servers</li>
                </ul>
                <p>
                    The app does not tell anyone what to claim or how to argue a claim. It helps them write
                    down what actually happened, accurately and consistently, and take that record to the
                    people who can act on it.
                </p>
            </section>

            {/* What We Offer */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What the App Does</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📝 Symptom Tracking</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Log from a library of over 900 symptoms across 14 body systems, with severity,
                            duration, frequency, triggers, and functional impact. Quick Log handles chronic
                            symptoms in a couple of taps.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📊 Rating Evidence</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For veterans: see how your documented symptoms compare with VA rating criteria drawn
                            from 38 CFR Part 4, and what your record does and does not yet show.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💊 Medication Tracking</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track medications, dosages, adherence, side effects, and effectiveness, and see them
                            alongside your symptom patterns.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📈 Trends &amp; Patterns</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Charts of symptom frequency and severity over time, so patterns and triggers are
                            visible instead of remembered.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🧮 Claim Planning Tools</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            SMC analysis, combined rating and scenario calculators, a TDIU worksheet organized
                            around VA Form 21-8940, and a buddy statement drafting helper. All estimates for your
                            own planning — never determinations.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🩺 C&amp;P Exam Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Preparation guidance before the exam, and an After Action Report to capture what
                            happened while it is still fresh.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📄 Exports You Can Hand Over</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            PDF reports and evidence packages, CSV data, and full JSON backups — for your doctor,
                            your VSO, your attorney, or your own records.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">👥 Multi-Profile Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Caregivers can keep separate profiles for a veteran, a parent, a child, or anyone
                            else in their care, with each person's records kept apart.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📚 Plain-Language Reference</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Educational descriptions for more than 180 conditions, explanations of service
                            connection pathways, and references to landmark veterans law decisions — background
                            reading, not legal advice.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">♿ Built to Be Usable</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Adjustable font sizes, high contrast, reduced motion, dark mode, keyboard navigation,
                            and screen reader support, built toward WCAG 2.1 AA.
                        </p>
                    </div>
                </div>
                {/* ATTORNEY REVIEW: The counts above (900+ symptoms, 14 body systems, 180+ conditions)
              must stay accurate as the data files change. Consider deriving them from the data
              layer at build time rather than hard-coding, to avoid a stale marketing claim. */}
            </section>

            {/* Who We Serve */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who It's For</h2>
                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">🎖️ Veterans</h3>
                        <p className="text-green-700 dark:text-green-400 text-sm">
                            Keep a contemporaneous record of symptoms and their impact. Understand how that
                            record compares with published rating criteria. Walk into a C&amp;P exam or a
                            VSO appointment with something written down instead of trying to remember.
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-500 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">❤️ Caregivers</h3>
                        <p className="text-purple-700 dark:text-purple-400 text-sm">
                            Track for a veteran, an aging parent, a spouse, or a child with complex needs, and
                            bring a clear record to their care team. Please only track someone else with their
                            consent or your legal authority to do so.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🏥 Anyone Managing a Condition</h3>
                        <p className="text-blue-700 dark:text-blue-400 text-sm">
                            You do not have to be a veteran. Chronic pain, migraines, autoimmune conditions,
                            anything that fluctuates and is hard to describe in a short appointment — a written
                            record helps.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy First */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy First, Structurally</h2>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🔒</span>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">We never receive your health data</h3>
                    </div>
                    <p className="mb-4">
                        Most health apps promise to protect your data. We took a different approach:{' '}
                        <strong>we never receive it in the first place.</strong> There is no server to breach,
                        no database to subpoena, and no policy change that could later expose what you logged.
                    </p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>No accounts — no email, no phone number, no password, no identity</li>
                        <li>No cloud storage operated by us — the app stores your data locally on your device</li>
                        <li>No analytics, no advertising, no tracking SDKs, no ad identifier</li>
                        <li>No AI processing of your entries</li>
                        <li>No data sharing — we have nothing to share</li>
                        <li>Works fully offline, so you can log anywhere</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>The honest trade-off:</strong> because we hold nothing, we can restore
                            nothing. If your locally stored records are deleted or become unavailable,{' '}
                            {COMPANY.legalName} cannot recover them for you. Export a backup regularly and
                            keep it somewhere safe.
                        </p>
                    </div>
                </div>
            </section>

            {/* About the Founder */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Founder</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-left">
                    <p className="mb-4">
                        {COMPANY.appName} was created by <strong>Dr. Edward McKeown</strong>, a U.S. Marine
                        Corps veteran and the founder of {COMPANY.legalName}.
                    </p>
                    <p className="mb-4">
                        Dr. McKeown holds a Ph.D. in Hospitality and Tourism Management from Purdue University
                        and spent more than thirty years working in hospitality, food safety, and academia. He
                        is currently studying software and web application development at Kirkwood Community
                        College in Cedar Rapids, Iowa, where he is an active member of the veterans community.
                        He builds and maintains this application himself.
                    </p>
                    <div className="bg-white dark:bg-gray-800 border-l-4 border-yellow-600 rounded p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            To be explicit about the "Dr." and the "Doc Bear":
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            The doctorate is in hospitality and tourism management. It is{' '}
                            <strong>not a medical degree, not a nursing or clinical credential, and not a law
                                degree</strong>. Dr. McKeown is not a physician, not a licensed healthcare provider,
                            not an attorney, and not a VA-accredited claims agent or representative. "Doc Bear"
                            is a long-standing nickname associated with his cookbook series, not a clinical
                            title. Nothing in this app is medical or legal advice.
                        </p>
                    </div>
                    <p className="mb-4">
                        The app grew out of his own experience navigating the VA claims process, along with
                        feedback from other veterans and from people who work in and around the claims system.
                        It is the tool he wanted when he was trying to reconstruct months of symptoms from
                        memory.
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 italic">
                        Dr. McKeown is also the author of the "Doc Bear's Comfort Food Survival Guide" cookbook
                        series and works in food safety training and technology.
                    </p>
                </div>
            </section>

            {/* Our Commitment */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-xl">✅</span>
                            <span><strong>Free:</strong> the entire app, every feature, with no ads, no in-app purchases, and no subscriptions</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-xl">✅</span>
                            <span><strong>Private by design:</strong> we will not collect, store, or sell your health data, because the app is built so we never receive it</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-xl">✅</span>
                            <span><strong>Sourced:</strong> rating criteria are drawn from 38 CFR Part 4 and other public federal sources, and we point you to the primary text rather than asking you to take our word for it</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-xl">✅</span>
                            <span><strong>Honest about limits:</strong> we tell you what the app cannot do as plainly as what it can</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-xl">✅</span>
                            <span><strong>Maintained:</strong> updated as regulations change and as users report problems, though we cannot promise the app always reflects the current regulation — always verify against the source</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Crisis resources -- belongs on every public-facing page */}
            <section className="mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-5">
                    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3">
                        🎖️ If you need to talk to someone right now
                    </h2>
                    <div className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                        <p><strong>Veterans Crisis Line — Call:</strong> {CRISIS.veteransCrisisPhone}</p>
                        <p><strong>Text:</strong> {CRISIS.veteransCrisisText}</p>
                        <p><strong>Chat:</strong> {CRISIS.veteransCrisisChat}</p>
                        <p className="mt-2">
                            Available 24/7 to veterans, service members, Guard and Reserve members, and their
                            families and friends. You do not need to be enrolled in VA health care. For a medical
                            emergency, call {CRISIS.emergency}.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It's Built</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Progressive Web App:</strong> installable on any device, fully functional offline</li>
                    <li><strong>Native apps for Android and iOS:</strong> distributed through Google Play and the Apple App Store</li>
                    <li><strong>React and Vite:</strong> a fast, responsive interface</li>
                    <li><strong>Tailwind CSS:</strong> a clean, accessible design with light and dark modes</li>
                    <li><strong>Local device storage:</strong> your data, on your hardware, under your control</li>
                    <li><strong>Mobile-first:</strong> designed for a phone in a waiting room, not a desk</li>
                </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
                    <p className="font-semibold text-lg mb-4">{COMPANY.legalName}</p>
                    <p className="mb-2">{COMPANY.street}</p>
                    <p className="mb-4">{COMPANY.cityStateZip}</p>
                    <p className="mb-2">
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
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Please do not email us health records, symptom exports, or claim documents. We cannot
                        act on them and we would rather not hold them.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="mb-8">
                <div className="flex justify-center gap-8 flex-wrap">
                    <div className="text-center">
                        <div className="text-3xl mb-2">🎖️</div>
                        <div className="font-bold text-gray-900 dark:text-white">Honor Service</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Support those who served</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🔒</div>
                        <div className="font-bold text-gray-900 dark:text-white">Protect Privacy</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Your data, your device</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="font-bold text-gray-900 dark:text-white">Enable Documentation</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Write it down while it's true</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {COMPANY.appName} — Helping veterans document their journey. 🎖️
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                    Not a medical device. Not affiliated with the U.S. Department of Veterans Affairs.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;