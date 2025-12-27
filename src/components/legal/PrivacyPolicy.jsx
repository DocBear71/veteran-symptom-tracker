// file: src/components/legal/PrivacyPolicy.jsx v2 - Doc Bear's Symptom Vault Privacy Policy
// Privacy-first health tracking application with local storage only
// FIXED: Left-justified text for better readability

import React from 'react';

const PrivacyPolicy = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            PRIVACY POLICY
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last updated December 26, 2024</strong>
          </p>
        </div>

        {/* Privacy First Banner - Centered */}
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-8 text-center">
          <p className="text-green-800 dark:text-green-300 font-bold">
            🔒 Your Data Stays on YOUR Device - We Never See It 🔒
          </p>
          <p className="text-green-700 dark:text-green-400 text-sm mt-2">
            Doc Bear's Symptom Vault is designed with privacy as the foundation. All health data is stored locally on your device and is never transmitted to our servers.
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="mb-4">
            This Privacy Notice for <strong>Doc Bear Enterprises, LLC.</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Use our Doc Bear's Symptom Vault application for tracking health symptoms and conditions</li>
            <li>Visit our website or any website of ours that links to this Privacy Notice</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
          <p className="mb-4">
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <strong>privacy@docbear-ent.com</strong>.
          </p>
        </section>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">SUMMARY OF KEY POINTS</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 text-left">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">What personal information do we process?</p>
              <p className="text-gray-600 dark:text-gray-400">
                Doc Bear's Symptom Vault stores all health data locally on your device. We do not collect, transmit, or store your symptom logs, medical information, or health data on any servers.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Do we process any sensitive personal information?</p>
              <p className="text-gray-600 dark:text-gray-400">
                We do not process any sensitive personal information. All health-related data remains on your device under your control.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Do we collect any information from third parties?</p>
              <p className="text-gray-600 dark:text-gray-400">
                No. We do not collect any information from third parties.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">How do we keep your information safe?</p>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is stored in your browser's local storage and never leaves your device. You have complete control over your data, including the ability to export or delete it at any time.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">What are your privacy rights?</p>
              <p className="text-gray-600 dark:text-gray-400">
                You have full control over your data. You can view, export, or delete your data at any time directly within the application.
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">TABLE OF CONTENTS</h2>
          <div className="space-y-2 text-blue-600 dark:text-blue-400">
            <div><a href="#local-storage" className="hover:underline">1. LOCAL DATA STORAGE</a></div>
            <div><a href="#info-collect" className="hover:underline">2. WHAT INFORMATION DO WE COLLECT?</a></div>
            <div><a href="#info-use" className="hover:underline">3. HOW DO WE PROCESS YOUR INFORMATION?</a></div>
            <div><a href="#info-share" className="hover:underline">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></div>
            <div><a href="#cookies" className="hover:underline">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></div>
            <div><a href="#data-retention" className="hover:underline">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a></div>
            <div><a href="#data-safety" className="hover:underline">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></div>
            <div><a href="#minors" className="hover:underline">8. DO WE COLLECT INFORMATION FROM MINORS?</a></div>
            <div><a href="#rights" className="hover:underline">9. WHAT ARE YOUR PRIVACY RIGHTS?</a></div>
            <div><a href="#updates" className="hover:underline">10. DO WE MAKE UPDATES TO THIS NOTICE?</a></div>
            <div><a href="#contact" className="hover:underline">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></div>
          </div>
        </section>

        {/* Section 1: Local Storage */}
        <section id="local-storage" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. LOCAL DATA STORAGE</h2>
          <p className="mb-4">
            <strong>Doc Bear's Symptom Vault is designed with a privacy-first architecture.</strong> All of your health data, symptom logs, medications, appointments, and personal information is stored exclusively in your web browser's local storage on your device.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What this means for you:</h3>
            <ul className="list-disc ml-6 text-blue-800 dark:text-blue-400 space-y-2">
              <li>Your health data never leaves your device</li>
              <li>We cannot access, view, or analyze your symptom logs</li>
              <li>No account or login is required</li>
              <li>You can use the app completely offline</li>
              <li>You control when and how to export or delete your data</li>
              <li>Clearing your browser data will remove all app data</li>
            </ul>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <strong>Important:</strong> Because your data is stored locally, if you clear your browser's storage, use a different browser, or use a different device, your data will not transfer automatically. We recommend using the Export feature regularly to back up your data.
          </p>
        </section>

        {/* Section 2: Information Collection */}
        <section id="info-collect" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. WHAT INFORMATION DO WE COLLECT?</h2>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Information stored locally on your device:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Profile information (name, profile type)</li>
            <li>Symptom logs and severity ratings</li>
            <li>Medication tracking data</li>
            <li>Appointment records</li>
            <li>Health measurements (blood pressure, glucose, etc.)</li>
            <li>App preferences and settings</li>
          </ul>
          <p className="mb-4 font-semibold">
            This information is stored ONLY on your device and is never transmitted to us.
          </p>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Information we may collect from the website:</h3>
          <p className="mb-4">
            When you visit our website (not the app), we may collect minimal information through standard web server logs, which may include:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
          </ul>
          <p>
            This information is used solely for website analytics and security purposes and is not connected to any health data you store in the app.
          </p>
        </section>

        {/* Section 3: Information Processing */}
        <section id="info-use" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p className="mb-4">
            <strong>We do not process your health information.</strong> All processing of symptom data, rating analysis, and health tracking occurs entirely within your browser on your device.
          </p>
          <p className="mb-4">
            The app processes your locally-stored data to:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Display symptom trends and patterns</li>
            <li>Generate rating evidence analysis (for veteran profiles)</li>
            <li>Create PDF and CSV exports</li>
            <li>Provide medication effectiveness tracking</li>
            <li>Show appointment history</li>
          </ul>
          <p>
            All of this processing happens on your device. None of this data is transmitted to any server.
          </p>
        </section>

        {/* Section 4: Information Sharing */}
        <section id="info-share" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p className="mb-4">
            <strong>We do not share your health information because we do not have access to it.</strong>
          </p>
          <p className="mb-4">
            You may choose to share your data by:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Exporting PDF or CSV reports to share with healthcare providers, VSOs, or attorneys</li>
            <li>Manually copying or sharing information from the app</li>
          </ul>
          <p>
            Any sharing of your health data is entirely at your discretion and under your control.
          </p>
        </section>

        {/* Section 5: Cookies */}
        <section id="cookies" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p className="mb-4">
            The Doc Bear's Symptom Vault application does not use cookies for tracking or analytics. The app uses browser local storage solely for storing your health data and app preferences.
          </p>
          <p className="mb-4">
            Our website may use minimal cookies for:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Essential site functionality</li>
            <li>Anonymous, aggregated analytics</li>
          </ul>
        </section>

        {/* Section 6: Data Retention */}
        <section id="data-retention" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p className="mb-4">
            Your health data is stored in your browser's local storage until you choose to delete it. We do not have any copies of your data and therefore cannot retain it.
          </p>
          <p className="mb-4">
            <strong>Your data may be removed if:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>You manually delete it using the app's "Delete All Data" feature</li>
            <li>You clear your browser's local storage or site data</li>
            <li>You uninstall the Progressive Web App</li>
            <li>Your browser's automatic data cleanup removes old data</li>
          </ul>
          <p className="text-yellow-600 dark:text-yellow-400">
            <strong>Recommendation:</strong> Regularly export your data to maintain backups.
          </p>
        </section>

        {/* Section 7: Data Safety */}
        <section id="data-safety" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p className="mb-4">
            Your data security is protected through our privacy-first architecture:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>Local storage only:</strong> Data never leaves your device</li>
            <li><strong>No transmission:</strong> No data is sent over the internet</li>
            <li><strong>No servers:</strong> We have no servers storing your health data</li>
            <li><strong>Your control:</strong> You manage all data access and deletion</li>
          </ul>
          <p className="mb-4">
            <strong>Your responsibilities for data security:</strong>
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Secure your device with a password or biometric lock</li>
            <li>Be cautious about who has access to your device</li>
            <li>Consider the security of exported PDF/CSV files</li>
            <li>Regularly back up your data using the Export feature</li>
          </ul>
        </section>

        {/* Section 8: Minors */}
        <section id="minors" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p className="mb-4">
            We do not knowingly collect data from children under 13 years of age. The application may be used by caregivers to track symptoms for minors, but this data remains on the caregiver's device and is not collected by us.
          </p>
          <p className="mb-4">
            If a parent or guardian becomes aware that their child has provided personal information to us (through website contact forms or other means), please contact us at <strong>privacy@docbear-ent.com</strong> and we will take steps to remove such information.
          </p>
        </section>

        {/* Section 9: Rights */}
        <section id="rights" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p className="mb-4">
            Because your data is stored locally on your device, you have complete control:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>Access:</strong> View all your data anytime within the app</li>
            <li><strong>Export:</strong> Download your data as PDF or CSV files</li>
            <li><strong>Delete:</strong> Remove any or all data using the Settings menu</li>
            <li><strong>Portability:</strong> Export your data to use elsewhere</li>
          </ul>
          <p className="mb-4">
            For any questions about your privacy rights or data handling, please contact us at <strong>privacy@docbear-ent.com</strong>.
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Special Rights for Veterans and Service Members</h3>
          <p>
            We are committed to supporting veterans and their families. If you have any concerns about how this app handles information related to VA claims or service-connected conditions, please contact us for clarification.
          </p>
        </section>

        {/* Section 10: Updates */}
        <section id="updates" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p className="mb-4">
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Last updated" date at the top of this notice. We encourage you to review this Privacy Notice periodically.
          </p>
        </section>

        {/* Section 11: Contact */}
        <section id="contact" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p className="mb-4">
            If you have questions or comments about this notice, you may email us at <strong>privacy@docbear-ent.com</strong> or contact us by post at:
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
            <p className="font-semibold">Doc Bear Enterprises, LLC.</p>
            <p>5249 N Park Pl NE, PMB 4011</p>
            <p>Cedar Rapids, IA 52402</p>
            <p>United States</p>
            <p className="mt-2">
              Email: <a href="mailto:privacy@docbear-ent.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@docbear-ent.com</a>
            </p>
            <p>
              Website: <a href="https://www.docbear-ent.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.docbear-ent.com</a>
            </p>
          </div>
        </section>

        {/* Footer - Centered */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Doc Bear's Symptom Vault - Privacy-first health tracking for veterans and everyone. 🔒
          </p>
        </div>
      </div>
  );
};

export default PrivacyPolicy;