// file: src/components/legal/PrivacyPolicy.jsx  v3
// Doc Bear's Symptom Vault -- Privacy Policy
//
// v3 CHANGES (for attorney review):
//  - Effective date and version now come from legalMeta.js (single source of truth)
//  - Added: platform app store disclosures (Apple App Store / Google Play)
//  - Added: HIPAA clarification (we are not a covered entity or business associate)
//  - Added: US state privacy rights, incl. Washington My Health My Data Act,
//           Nevada SB 370, CCPA/CPRA and other comprehensive state laws
//  - Added: GDPR / UK GDPR / international users section
//  - Added: local notifications and reminders disclosure
//  - Added: JSON backup/restore, file import and share-sheet disclosure
//  - Added: accessibility statement
//  - Added: FTC Health Breach Notification Rule position
//  - Updated: full current feature inventory
//
// ATTORNEY NOTE: search for "ATTORNEY REVIEW" comments below for open questions.

import React from 'react';
import { COMPANY, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION } from './legalMeta';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    PRIVACY POLICY
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    <strong>Last updated {LEGAL_EFFECTIVE_DATE}</strong>
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    Document version {LEGAL_VERSION}
                </p>
            </div>

            {/* Privacy First Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-8 text-center">
                <p className="text-green-800 dark:text-green-300 font-bold">
                    🔒 Your Health Data Is Stored Locally — We Never Receive It 🔒
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm mt-2">
                    {COMPANY.appName} has no user accounts, no servers that store health data, no
                    analytics inside the app, and no artificial intelligence processing of your entries.
                    Your health and symptom data is stored locally by the app. {COMPANY.legalName} does
                    not receive it, maintain a server-side copy of it, or have access to your device or
                    any device backup maintained by your operating-system or backup provider. We cannot
                    access or recover your locally stored records for you.
                </p>
            </div>

            {/* Introduction */}
            <section className="mb-8">
                <p className="mb-4">
                    This Privacy Policy for <strong>{COMPANY.legalName}</strong> ("<strong>we</strong>,"
                    "<strong>us</strong>," or "<strong>our</strong>") describes how and why we might access,
                    collect, store, use, and/or share ("<strong>process</strong>") information when you use
                    our services ("<strong>Services</strong>"), including when you:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>
                        Use the {COMPANY.appName} application, whether as an installed Progressive Web App
                        (PWA), through a web browser, or as a native application downloaded from the Apple
                        App Store or Google Play
                    </li>
                    <li>Visit {COMPANY.appWebsiteLabel}, {COMPANY.websiteLabel}, or any website of ours that links to this Privacy Policy</li>
                    <li>Contact us by email or engage with us in other related ways</li>
                </ul>
                <p className="mb-4">
                    <strong>Questions or concerns?</strong> Reading this Privacy Policy will help you
                    understand your privacy rights and choices. If you do not agree with our policies and
                    practices, please do not use our Services. If you still have questions, contact us at{' '}
                    <strong>{COMPANY.privacyEmail}</strong>.
                </p>
            </section>

            {/* Summary */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">SUMMARY OF KEY POINTS</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 text-left">
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">What personal information do we process?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            None from within the app. {COMPANY.appName} stores all health data locally on your
                            device. We do not collect, transmit, or store your symptom logs, medications,
                            appointments, measurements, service-connection details, or any other health
                            information on any server we control.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Do we process sensitive personal information?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            We do not receive or process it. The app is designed so that health information —
                            which is sensitive personal information under many laws — never reaches us in the
                            first place.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Do you need an account?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            No. There is no sign-up, no login, no email address, and no password. We have no way
                            to identify you as a user of the app.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Do we collect information from third parties?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            No. We do not buy, license, or receive personal information about you from data
                            brokers, advertising networks, or any other third party.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Do we sell or share your information?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            No. We do not sell personal information, share it for cross-context behavioral
                            advertising, or use it for targeted advertising. We have never done so and have no
                            mechanism to do so.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">What about the app stores?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you install the app from the Apple App Store or Google Play, those companies
                            process download and device information under their own privacy policies. We
                            receive only aggregate, anonymous install and crash statistics from them, never
                            your health data.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">What are your privacy rights?</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            You have complete, immediate control. You can view, export, correct, or permanently
                            delete all of your data yourself from inside the app, without asking us and without
                            waiting for us.
                        </p>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">TABLE OF CONTENTS</h2>
                <div className="space-y-2 text-blue-600 dark:text-blue-400">
                    <div><a href="#local-storage" className="hover:underline">1. LOCAL DATA STORAGE — HOW THE APP IS BUILT</a></div>
                    <div><a href="#info-collect" className="hover:underline">2. WHAT INFORMATION IS INVOLVED?</a></div>
                    <div><a href="#app-stores" className="hover:underline">3. APP STORES AND MOBILE PLATFORMS</a></div>
                    <div><a href="#info-use" className="hover:underline">4. HOW IS YOUR INFORMATION PROCESSED?</a></div>
                    <div><a href="#notifications" className="hover:underline">5. REMINDERS AND NOTIFICATIONS</a></div>
                    <div><a href="#info-share" className="hover:underline">6. WHEN AND WITH WHOM IS INFORMATION SHARED?</a></div>
                    <div><a href="#exports" className="hover:underline">7. EXPORTS, BACKUPS, AND FILES YOU CREATE</a></div>
                    <div><a href="#cookies" className="hover:underline">8. COOKIES AND TRACKING TECHNOLOGIES</a></div>
                    <div><a href="#data-retention" className="hover:underline">9. HOW LONG IS YOUR INFORMATION KEPT?</a></div>
                    <div><a href="#data-safety" className="hover:underline">10. HOW IS YOUR INFORMATION KEPT SAFE?</a></div>
                    <div><a href="#hipaa" className="hover:underline">11. HIPAA AND HEALTH INFORMATION LAWS</a></div>
                    <div><a href="#minors" className="hover:underline">12. CHILDREN AND MINORS</a></div>
                    <div><a href="#caregivers" className="hover:underline">13. CAREGIVERS AND THIRD-PARTY PROFILES</a></div>
                    <div><a href="#veterans" className="hover:underline">14. VETERANS AND SERVICE MEMBERS</a></div>
                    <div><a href="#us-rights" className="hover:underline">15. UNITED STATES PRIVACY RIGHTS</a></div>
                    <div><a href="#intl" className="hover:underline">16. INTERNATIONAL USERS (GDPR / UK GDPR / CANADA)</a></div>
                    <div><a href="#accessibility" className="hover:underline">17. ACCESSIBILITY</a></div>
                    <div><a href="#breach" className="hover:underline">18. BREACH NOTIFICATION</a></div>
                    <div><a href="#updates" className="hover:underline">19. UPDATES TO THIS POLICY</a></div>
                    <div><a href="#contact" className="hover:underline">20. HOW TO CONTACT US</a></div>
                </div>
            </section>

            {/* 1. Local Storage */}
            <section id="local-storage" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. LOCAL DATA STORAGE — HOW THE APP IS BUILT</h2>
                <p className="mb-4">
                    <strong>{COMPANY.appName} is built with a privacy-first, offline-first architecture.</strong>{' '}
                    All of your health data — symptom logs, medications, appointments, measurements,
                    service-connection information, notes, worksheets, saved reports, profiles, and settings
                    — is stored exclusively in your device's browser storage (commonly called
                    "localStorage") or, in the native mobile applications, in the equivalent app-private
                    storage on that device.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 text-left">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What this means for you:</h3>
                    <ul className="list-disc ml-6 text-blue-800 dark:text-blue-400 space-y-2">
                        <li>The app does not transmit your health data to us. It leaves your device only if you export or share it yourself, or if your operating system includes app data in a device backup you have enabled</li>
                        <li>We cannot access, view, analyze, or recover your entries — not even if you ask us to</li>
                        <li>No account, email address, phone number, or login is required or possible</li>
                        <li>The app works fully offline once installed</li>
                        <li>You control when and how to export, back up, or delete your data</li>
                        <li>There is no advertising, no ad identifier, and no third-party tracking inside the app</li>
                        <li>No artificial intelligence or machine learning service processes your entries</li>
                    </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                        <strong>Important — the trade-off of local storage:</strong> Because your data lives
                        only on your device, it does not travel with you. If you clear your browser storage or
                        site data, switch browsers, switch devices, use a private/incognito window, or
                        uninstall the app, <strong>your data will be permanently lost and we cannot restore
                        it</strong>. Some browsers also clear storage automatically after periods of inactivity
                        or under storage pressure. Use the Export and Backup features regularly, and keep those
                        backup files somewhere safe.
                    </p>
                </div>
            </section>

            {/* 2. Information Collected */}
            <section id="info-collect" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. WHAT INFORMATION IS INVOLVED?</h2>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    A. Information you enter, stored only on your device
                </h3>
                <p className="mb-3">
                    You may choose to enter any of the following. All of it is stored locally by the app,
                    and {COMPANY.legalName} never receives it.
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-1">
                    <li>Profile information (display name, patient name, profile type, date of birth if you choose to add one, and whether the profile is a veteran, caregiver, or general-health profile)</li>
                    <li>Symptom logs, including severity, duration, frequency, triggers, functional impact, and free-text notes</li>
                    <li>Quick Log entries for chronic and recurring symptoms, and any custom symptoms you create</li>
                    <li>Medication names, dosages, schedules, adherence, side effects, and effectiveness ratings</li>
                    <li>Appointment records, provider names, and appointment notes</li>
                    <li>Health measurements such as blood pressure, blood glucose, weight, and similar self-recorded values</li>
                    <li>Activities of Daily Living (ADL) entries used by the Special Monthly Compensation tools</li>
                    <li>Service-connected condition lists, claimed conditions, and current or expected disability ratings you record for reference</li>
                    <li>Buddy statement drafts, C&amp;P exam preparation notes, C&amp;P exam After Action Reports, and TDIU (VA Form 21-8940) worksheet content</li>
                    <li>App preferences and settings, including theme, accessibility settings, reminder times, and dismissed notices</li>
                    <li>Your record that you accepted these legal terms, including the version and timestamp</li>
                </ul>
                <p className="mb-6 font-semibold">
                    None of the above is transmitted to us, and we have no technical ability to retrieve it.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    B. Information our websites may collect
                </h3>
                <p className="mb-3">
                    When you visit our marketing or legal websites (as distinct from using the app), our
                    hosting provider may record standard web server information, which can include:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-1">
                    <li>IP address (which may be truncated or anonymized)</li>
                    <li>Browser type, version, and operating system</li>
                    <li>Pages requested, time and date of the request, and time spent on the page</li>
                    <li>Referring website or link</li>
                </ul>
                <p className="mb-4">
                    This information is used only to operate the site, diagnose technical problems, and
                    protect against abuse. It is never combined with, and cannot be connected to, any health
                    data you store in the app — because we never receive that health data.
                </p>
                {/* ATTORNEY REVIEW: If any web analytics product is added to the marketing site later
              (Google Analytics, Plausible, Fathom, etc.), this section and Section 8 must be
              updated, and a cookie banner may be required for EU/UK visitors. */}

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    C. Information you send us directly
                </h3>
                <p>
                    If you email us for support, to report a bug, or to give feedback, we receive whatever
                    you choose to put in that email — including your email address and any details you
                    describe. <strong>Please do not email us your health records, symptom exports, or claim
                    documents.</strong> We do not need them and we do not want to hold them. We retain
                    support correspondence only as long as needed to resolve your issue and to maintain a
                    basic record of the request.
                </p>
            </section>

            {/* 3. App Stores */}
            <section id="app-stores" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. APP STORES AND MOBILE PLATFORMS</h2>
                <p className="mb-4">
                    {COMPANY.appName} is available as an installable web app and is distributed through the
                    Apple App Store and Google Play. When you download or install through a store:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>
                        <strong>The store, not us, handles the transaction.</strong> Apple Inc. and Google LLC
                        process your download under their own privacy policies and terms, which we do not
                        control.
                    </li>
                    <li>
                        <strong>We may receive aggregate statistics from the stores</strong> — such as total
                        installs, uninstalls, crash reports, ratings, country-level breakdowns, and device or
                        operating system version counts. These are aggregated and anonymized by the store
                        platform. They tell us nothing about who you are or what you have logged.
                    </li>
                    <li>
                        <strong>The app requests no advertising identifier</strong> and contains no
                        advertising, analytics, or tracking software development kits (SDKs).
                    </li>
                    <li>
                        <strong>The app is free.</strong> There are no in-app purchases, subscriptions, or
                        paid tiers, so no payment information is ever collected by us or by the stores on our
                        behalf.
                    </li>
                    <li>
                        <strong>Device backups.</strong> If you have enabled iCloud Backup, Google One backup,
                        or a similar device-level backup service, your operating system may include this app's
                        local data in that backup. That backup is between you and Apple or Google under their
                        terms; we are not a party to it and cannot access it. You can usually exclude an app
                        from device backup in your operating system settings.
                    </li>
                </ul>
                <p>
                    Consistent with Google Play's health app requirements and Apple's App Store guidelines,
                    we state plainly: <strong>{COMPANY.appName} is not a medical device and does not
                    diagnose, treat, cure, or prevent any medical condition.</strong> Always consult a
                    qualified healthcare professional for medical advice, diagnosis, or treatment.
                </p>
            </section>

            {/* 4. Processing */}
            <section id="info-use" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. HOW IS YOUR INFORMATION PROCESSED?</h2>
                <p className="mb-4">
                    <strong>We do not process your health information.</strong> Every calculation, analysis,
                    chart, and document the app produces is computed by code running inside your own browser
                    or app, using only the data already stored on your device.
                </p>
                <p className="mb-3">The app processes your locally stored data on your device in order to:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Display symptom history, trends, frequency counts, and pattern charts</li>
                    <li>Compare your logged entries against VA rating criteria drawn from 38 CFR Part 4, and show what level of documentation your entries appear to support</li>
                    <li>Run the Special Monthly Compensation (SMC), rating scenario, and combined-rating calculators</li>
                    <li>Generate buddy statement drafts, C&amp;P exam preparation checklists, After Action Reports, and TDIU worksheet content</li>
                    <li>Produce PDF, CSV, and JSON exports</li>
                    <li>Track medication adherence and effectiveness over time</li>
                    <li>Schedule local reminders at times you choose</li>
                </ul>
                <p>
                    All of this happens on your device. No entry, calculation, or generated document is
                    transmitted to any server we operate.
                </p>
            </section>

            {/* 5. Notifications */}
            <section id="notifications" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. REMINDERS AND NOTIFICATIONS</h2>
                <p className="mb-4">
                    The app can remind you to log your symptoms at times you set. If you enable reminders:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Your device or browser will ask for notification permission. You may decline, and the rest of the app works normally if you do.</li>
                    <li>Reminders are scheduled and delivered <strong>locally by your device</strong>. We operate no push notification server and send you nothing.</li>
                    <li>Reminder text is generic (for example, a prompt to log today's symptoms) and does not contain any health details, so it does not expose information on a lock screen.</li>
                    <li>Your reminder times are stored on your device with your other settings.</li>
                    <li>You can turn reminders off at any time in Settings, or revoke notification permission in your browser or operating system settings.</li>
                </ul>
            </section>

            {/* 6. Sharing */}
            <section id="info-share" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. WHEN AND WITH WHOM IS INFORMATION SHARED?</h2>
                <p className="mb-4">
                    <strong>We do not share your health information, because we do not have it.</strong> We
                    do not sell personal information, share it for cross-context behavioral advertising, or
                    disclose it for targeted advertising or any other purpose.
                </p>
                <p className="mb-3">
                    The only way your health data leaves your device is if <em>you</em> choose to move it:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Exporting a PDF, CSV, or JSON file and saving it to your device</li>
                    <li>Using your device's share sheet to email, message, or upload an export to a service of your choosing</li>
                    <li>Printing an export, or handing a copy to a healthcare provider, VSO, accredited claims agent, or attorney</li>
                </ul>
                <p className="mb-4">
                    Once an export leaves the app, it is an ordinary file under your control, and this
                    Privacy Policy no longer governs it. If you upload it to a cloud drive, email service, or
                    messaging app, that provider's terms and privacy policy apply to the copy you sent.
                    Consider whether the recipient and the channel are appropriate for medical information.
                </p>
                <p>
                    <strong>Legal process:</strong> We cannot produce your health data in response to a
                    subpoena, warrant, court order, or government demand, because we do not possess it. If we
                    receive such a demand relating to a user of the app, we will respond that we hold no such
                    records, and we will seek to notify the affected person where we are legally permitted
                    and practically able to do so.
                </p>
            </section>

            {/* 7. Exports and backups */}
            <section id="exports" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. EXPORTS, BACKUPS, AND FILES YOU CREATE</h2>
                <p className="mb-4">
                    The app can create several kinds of files, all generated on your device and saved
                    wherever you direct them:
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>PDF reports</strong> — including symptom history reports, VA claim evidence packages, C&amp;P exam After Action Reports, and the TDIU (VA Form 21-8940) worksheet</li>
                    <li><strong>CSV exports</strong> — tabular symptom, medication, and appointment data for use in a spreadsheet</li>
                    <li><strong>JSON backups</strong> — a complete copy of your app data, which you can later import to restore or to move to another device</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                        <strong>These files are not encrypted.</strong> A PDF, CSV, or JSON export is readable
                        by anyone who obtains it. They typically contain detailed health information and may
                        contain your name. Store them somewhere protected, be careful where you email or upload
                        them, and delete them from shared or public computers when you are finished.
                    </p>
                </div>
                <p>
                    <strong>Importing a backup file replaces or merges with the data currently on your
                        device.</strong> Only import files you created yourself. The app cannot verify who
                    produced a backup file or whether its contents were altered.
                </p>
            </section>

            {/* 8. Cookies */}
            <section id="cookies" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. COOKIES AND TRACKING TECHNOLOGIES</h2>
                <p className="mb-4">
                    <strong>The application uses no cookies for tracking, advertising, or analytics.</strong>{' '}
                    It uses browser local storage solely to hold your data and preferences on your own
                    device, and a service worker to cache the application files so it can run offline. A
                    service worker caches program code, not your health entries, and does not report anything
                    back to us.
                </p>
                <p className="mb-4">
                    Our websites use only cookies strictly necessary for the site to function and for basic
                    security. We do not use advertising cookies, cross-site trackers, social media pixels, or
                    session replay tools.
                </p>
                <p>
                    <strong>Do Not Track and Global Privacy Control:</strong> Because we do not track users
                    across sites or over time, and do not sell or share personal information, there is no
                    tracking behavior for a browser signal to disable. We nonetheless honor Global Privacy
                    Control signals where they apply.
                </p>
            </section>

            {/* 9. Retention */}
            <section id="data-retention" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. HOW LONG IS YOUR INFORMATION KEPT?</h2>
                <p className="mb-4">
                    Your health data remains in your device's storage until you or your device removes it. We
                    retain no copies and therefore have no retention period to disclose for health data.
                </p>
                <p className="mb-3"><strong>Your locally stored data may be removed if:</strong></p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>You delete individual records, a profile, or use the "Delete All Data" function in Settings</li>
                    <li>You clear your browser's storage, site data, cache, or history for this site</li>
                    <li>You uninstall the app or remove the installed PWA</li>
                    <li>Your browser automatically evicts stored data due to storage pressure or long inactivity</li>
                    <li>You use a private, incognito, or guest browsing session, where data may be discarded when the session ends</li>
                    <li>Another person with access to your device deletes it</li>
                </ul>
                <p className="text-yellow-700 dark:text-yellow-400">
                    <strong>Deletion is permanent and immediate.</strong> There is no trash, no undo, and no
                    server-side copy for us to restore. Export a backup before deleting anything you may want
                    later.
                </p>
                <p className="mt-4">
                    Website server logs, where generated, are retained for a limited period for security and
                    troubleshooting and then deleted or anonymized. Support emails are retained only as long
                    as needed to handle the request.
                </p>
            </section>

            {/* 10. Security */}
            <section id="data-safety" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. HOW IS YOUR INFORMATION KEPT SAFE?</h2>
                <p className="mb-3">Our security model is structural rather than procedural:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>No collection:</strong> data we never receive cannot be breached from our side</li>
                    <li><strong>No accounts:</strong> there are no credentials to steal, phish, or reuse</li>
                    <li><strong>No transmission:</strong> health data is not sent over the network by the app</li>
                    <li><strong>No health data servers:</strong> we operate no database of user health information</li>
                    <li><strong>Encrypted delivery:</strong> the app and website are served over HTTPS</li>
                </ul>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="font-semibold mb-2">Because your data lives on your device, its security depends largely on you:</p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Lock your device with a strong passcode, PIN, or biometric lock</li>
                        <li>Keep your operating system and browser updated</li>
                        <li>Be aware that anyone who can unlock your device can open the app and read everything in it — the app has no separate password</li>
                        <li>Avoid using the app on shared, public, or work-managed devices where others may have access</li>
                        <li>Treat exported PDF, CSV, and JSON files as sensitive documents</li>
                        <li>Export backups regularly and store them securely</li>
                    </ul>
                </div>
                {/* ATTORNEY REVIEW: The app currently has no in-app PIN/biometric lock. If one is added,
              this section and the Terms should be revised to describe it accurately. */}
                <p>
                    No method of electronic storage is completely secure. We cannot guarantee that a
                    determined attacker with physical or software access to your device could not read data
                    stored there.
                </p>
            </section>

            {/* 11. HIPAA */}
            <section id="hipaa" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. HIPAA AND HEALTH INFORMATION LAWS</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                        We are not a HIPAA covered entity or business associate.
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                        The Health Insurance Portability and Accountability Act (HIPAA) applies to health
                        plans, healthcare clearinghouses, most healthcare providers, and their business
                        associates. {COMPANY.legalName} is none of these. We are a software publisher, we do
                        not provide healthcare, and we do not act on behalf of any covered entity.
                    </p>
                </div>
                <p className="mb-4">
                    Health information you record for yourself in an app you control is generally not
                    protected health information under HIPAA, and HIPAA's protections do not attach to it.
                    In this app that distinction has limited practical effect, because we never receive your
                    information at all — but you should understand the difference, especially when you export
                    a report and send it somewhere else.
                </p>
                <p>
                    Records held by the U.S. Department of Veterans Affairs, the Veterans Health
                    Administration, or your own providers remain governed by HIPAA, the Privacy Act, and
                    other applicable law in their hands. Nothing in this app changes your rights with respect
                    to those records.
                </p>
            </section>

            {/* 12. Minors */}
            <section id="minors" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. CHILDREN AND MINORS</h2>
                <p className="mb-4">
                    The Services are not directed to children under 13, and we do not knowingly collect
                    personal information from anyone, of any age, through the app — because the app collects
                    nothing.
                </p>
                <p className="mb-4">
                    A parent, guardian, or caregiver may use the app to track a child's symptoms. In that
                    case the child's information is stored on the adult's device, under that adult's control,
                    and is never transmitted to us. The adult is responsible for the appropriateness and
                    security of that use.
                </p>
                <p>
                    If you believe a child has provided personal information to us directly — for example
                    through a website contact form or an email — contact us at{' '}
                    <strong>{COMPANY.privacyEmail}</strong> and we will delete it promptly.
                </p>
            </section>

            {/* 13. Caregivers */}
            <section id="caregivers" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. CAREGIVERS AND THIRD-PARTY PROFILES</h2>
                <p className="mb-4">
                    The app supports multiple profiles so that a caregiver can track symptoms for a veteran,
                    an aging parent, a spouse, a child, or another person in their care.
                </p>
                <p className="mb-3">If you create a profile for another person, you are responsible for:</p>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>Having that person's consent, or the legal authority to act for them (such as a power of attorney, guardianship, or parental authority)</li>
                    <li>Handling their health information as carefully as you would want yours handled</li>
                    <li>Deciding what to share, with whom, and when</li>
                    <li>Removing their data from your device if your caregiving role ends or they ask you to</li>
                </ul>
                <p>
                    We have no relationship with the person being tracked, no way to contact them, and no
                    ability to honor a request from them about data held on your device. Those requests must
                    go to you.
                </p>
            </section>

            {/* 14. Veterans */}
            <section id="veterans" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">14. VETERANS AND SERVICE MEMBERS</h2>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                            <strong>We are not affiliated with, endorsed by, or connected to the U.S. Department
                                of Veterans Affairs</strong> or any other government agency.
                        </li>
                        <li>
                            <strong>Nothing you enter is transmitted to the VA.</strong> The app does not file
                            claims, submit evidence, upload to VA.gov, or communicate with the VA in any way.
                        </li>
                        <li>
                            <strong>We do not have and cannot obtain your VA records</strong>, claim status, or
                            rating decisions.
                        </li>
                        <li>
                            <strong>Using this app has no effect on your claim</strong> unless you personally
                            choose to submit an export you generated with it.
                        </li>
                    </ul>
                </div>
                <p>
                    Documenting your symptoms consistently over time is a personal record-keeping practice.
                    What you do with that record is entirely your decision. If you have questions about how
                    evidence is used in a claim, speak with a VA-accredited Veterans Service Organization
                    representative, claims agent, or attorney.
                </p>
            </section>

            {/* 15. US Privacy Rights */}
            <section id="us-rights" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">15. UNITED STATES PRIVACY RIGHTS</h2>
                <p className="mb-4">
                    Many U.S. states have enacted comprehensive privacy laws — including California,
                    Colorado, Connecticut, Virginia, Utah, Texas, Oregon, Montana, and others — and several
                    have laws written specifically for health data. The practical answer under all of them is
                    the same here: <strong>we hold no personal information about you to access, correct,
                    delete, port, or restrict.</strong>
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Exercising your rights, immediately</h3>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li><strong>Right to know / access:</strong> open the app; everything we could theoretically hold is already in front of you</li>
                    <li><strong>Right to correct:</strong> edit any entry directly</li>
                    <li><strong>Right to delete:</strong> use Delete All Data in Settings, or clear the app's storage</li>
                    <li><strong>Right to portability:</strong> use the JSON, CSV, or PDF export functions</li>
                    <li><strong>Right to opt out of sale, sharing, targeted advertising, and profiling:</strong> there is nothing to opt out of; we do none of these</li>
                    <li><strong>Right to limit use of sensitive personal information:</strong> we do not receive sensitive personal information</li>
                    <li><strong>Right to non-discrimination:</strong> the app is free and identical for everyone</li>
                </ul>
                <p className="mb-4">
                    If you would like written confirmation of any of the above for your own records, email{' '}
                    <strong>{COMPANY.privacyEmail}</strong> and we will respond within the period required by
                    your state's law. Because we cannot identify you as a user, our response will confirm
                    that we hold no personal information associated with app usage rather than produce
                    records.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Washington My Health My Data Act and similar consumer health data laws
                </h3>
                <p className="mb-4">
                    Washington's My Health My Data Act, Nevada's SB 370, and comparable laws regulate the
                    collection, sharing, and sale of consumer health data. {COMPANY.legalName} does not
                    collect, process, share, or sell consumer health data through the app. We do not use it
                    for advertising, do not disclose it to affiliates or processors, and operate no
                    geofencing around any healthcare facility. Because your health data is never collected by
                    us, no consent, authorization, or separate consumer health data privacy policy is
                    required for us to obtain it, and there is no such data for us to delete on request.
                </p>
                {/* ATTORNEY REVIEW: MHMDA §4(1)(b) requires a regulated entity to publish a separate,
              distinct "Consumer Health Data Privacy Policy" link on its homepage. Our position is
              that we are not a regulated entity because we collect no consumer health data. Please
              confirm, and advise whether to publish a short standalone MHMDA statement anyway as a
              defensive measure. */}

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">California residents</h3>
                <p className="mb-2">
                    Under the CCPA as amended by the CPRA, we disclose that in the preceding twelve months we
                    have <strong>not</strong> collected any category of personal information through the
                    application, have <strong>not</strong> sold or shared personal information, and have{' '}
                    <strong>not</strong> disclosed personal information for a business purpose. We do not use
                    or disclose sensitive personal information for purposes requiring a right to limit. You
                    may designate an authorized agent to make a request on your behalf; the response will be
                    the same.
                </p>
                <p>
                    California's "Shine the Light" law (Civil Code § 1798.83) permits residents to request
                    information about disclosure of personal information to third parties for direct
                    marketing. We make no such disclosures.
                </p>
            </section>

            {/* 16. International */}
            <section id="intl" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">16. INTERNATIONAL USERS (GDPR / UK GDPR / CANADA)</h2>
                <p className="mb-4">
                    {COMPANY.legalName} is based in the United States. The app can be used from anywhere,
                    and because it operates entirely on your device, using it does not transfer your health
                    data across any border.
                </p>
                <p className="mb-3">
                    For visitors in the European Economic Area, United Kingdom, or Switzerland: to the extent
                    the GDPR or UK GDPR applies to our limited website processing, our lawful bases are our
                    legitimate interests in operating and securing our website (Article 6(1)(f)) and, where
                    applicable, your consent. We do not process special category health data under Article 9,
                    because we do not receive any.
                </p>
                <ul className="list-disc ml-6 mb-4 space-y-1">
                    <li>You have rights of access, rectification, erasure, restriction, portability, and objection</li>
                    <li>You may lodge a complaint with your national supervisory authority or, in the UK, the Information Commissioner's Office</li>
                    <li>We have not appointed an EU or UK representative, on the basis that our processing of EEA/UK personal data is occasional and limited to website server logs</li>
                </ul>
                {/* ATTORNEY REVIEW: Please confirm the Article 27 representative exemption analysis before
              the app is listed in EU/UK storefronts, and advise whether a cookie consent banner is
              needed for the marketing site. */}
                <p>
                    For users in Canada, our practices are intended to be consistent with PIPEDA. Because we
                    collect no personal information through the app, no consent for collection, use, or
                    disclosure is sought or required.
                </p>
            </section>

            {/* 17. Accessibility */}
            <section id="accessibility" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">17. ACCESSIBILITY</h2>
                <p className="mb-4">
                    We build toward the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. The app
                    includes adjustable font sizing, a high contrast mode, a reduced motion setting, dark and
                    light themes, keyboard navigation, and semantic markup intended to work with screen
                    readers. Your accessibility settings are stored on your device with your other
                    preferences and are not transmitted anywhere.
                </p>
                <p>
                    Accessibility is an ongoing effort and some areas of the app may not yet fully conform.
                    If you encounter a barrier, please tell us at <strong>{COMPANY.privacyEmail}</strong> and
                    describe the problem and the assistive technology you use. We will work to address it and
                    will offer an alternative way to get the information in the meantime.
                </p>
            </section>

            {/* 18. Breach Notification */}
            <section id="breach" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">18. BREACH NOTIFICATION</h2>
                <p className="mb-4">
                    Because we store no user health data, a compromise of our systems could not expose your
                    symptom logs, medications, or claim documentation. There is no server-side copy to lose.
                </p>
                <p className="mb-4">
                    If we nonetheless became aware of a security incident affecting any information we do
                    hold — such as support email correspondence or website server logs — we would notify
                    affected individuals and regulators as required by applicable state breach notification
                    laws and, if applicable, the FTC Health Breach Notification Rule.
                </p>
                <p>
                    If your <em>device</em> is lost, stolen, or accessed by someone else, the data stored on
                    it may be exposed. We cannot remotely wipe, lock, or recover it. Use your device
                    manufacturer's find-my-device and remote-erase tools, and change any credentials that may
                    have been exposed.
                </p>
            </section>

            {/* 19. Updates */}
            <section id="updates" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">19. UPDATES TO THIS POLICY</h2>
                <p className="mb-4">
                    We may update this Privacy Policy from time to time. The revised version will be marked
                    with an updated "Last updated" date and version number at the top of this page and will
                    take effect as soon as it is posted.
                </p>
                <p>
                    If we make a material change — particularly any change that would cause information to be
                    collected or transmitted where it previously was not — we will present the updated terms
                    in the app and ask you to review and accept them before you continue. We encourage you to
                    review this policy periodically.
                </p>
            </section>

            {/* 20. Contact */}
            <section id="contact" className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">20. HOW TO CONTACT US</h2>
                <p className="mb-4">
                    If you have questions or comments about this policy, or wish to exercise a privacy right,
                    you may email us at <strong>{COMPANY.privacyEmail}</strong> or write to us at:
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
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Please do not send health records, symptom exports, or claim documents by email. We
                    cannot act on them and do not wish to hold them.
                </p>
            </section>

            {/* Footer */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {COMPANY.appName} — Privacy-first health tracking for veterans and everyone. 🔒
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;