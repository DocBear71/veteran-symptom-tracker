// file: src/components/legal/TermsOfUse.jsx v3 - Doc Bear's Symptom Vault Terms of Use
// Terms for privacy-first health tracking application
// UPDATED: Enhanced medical and legal disclaimers

import React from 'react';

const TermsOfUse = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            TERMS OF USE
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Last updated December 26, 2024</strong>
          </p>
        </div>

        {/* Important Notice Banner - Centered */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 dark:text-yellow-300 font-bold text-center">
            ⚠️ Important Medical & Legal Disclaimer ⚠️
          </p>
          <div className="text-yellow-700 dark:text-yellow-400 text-sm mt-3 space-y-2 text-left">
            <p>
              <strong>The creator of this app is NOT a medical doctor, licensed healthcare provider, or medical professional.</strong> This app was created by a veteran to help fellow veterans document their symptoms.
            </p>
            <p>
              Doc Bear's Symptom Vault is a personal documentation tool only. It is NOT a medical device, diagnostic tool, or substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>Always seek the advice of your physician or other qualified health provider</strong> with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have documented in this app.
            </p>
          </div>
        </div>

        {/* Agreement */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AGREEMENT TO OUR LEGAL TERMS</h2>
          <p className="mb-4">
            We are <strong>Doc Bear Enterprises, LLC.</strong> ("<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>").
          </p>
          <p className="mb-4">
            We operate the Doc Bear's Symptom Vault application (the "<strong>App</strong>"), as well as any other related products and services that refer or link to these legal terms (the "<strong>Legal Terms</strong>") (collectively, the "<strong>Services</strong>").
          </p>
          <p className="mb-4">
            Doc Bear's Symptom Vault is a health documentation tool designed to help users track symptoms, medications, and health conditions. For veterans, the app provides additional features to correlate symptoms with VA disability rating criteria.
          </p>
          <p className="mb-4">
            You can contact us by email at <strong>privacy@docbear-ent.com</strong> or by mail to 5249 N Park Pl NE, PMB 4011, Cedar Rapids, IA 52402.
          </p>
          <p className="mb-4">
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("<strong>you</strong>"), and Doc Bear Enterprises, LLC., concerning your access to and use of the Services.
          </p>
          <p className="font-semibold">
            IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
        </section>

        {/* Table of Contents */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">TABLE OF CONTENTS</h2>
          <div className="space-y-2 text-blue-600 dark:text-blue-400">
            <div><a href="#services" className="hover:underline">1. OUR SERVICES</a></div>
            <div><a href="#medical-disclaimer" className="hover:underline">2. MEDICAL DISCLAIMER</a></div>
            <div><a href="#va-disclaimer" className="hover:underline">3. VA CLAIMS DISCLAIMER</a></div>
            <div><a href="#no-professional-relationship" className="hover:underline">4. NO PROFESSIONAL RELATIONSHIP</a></div>
            <div><a href="#ip" className="hover:underline">5. INTELLECTUAL PROPERTY RIGHTS</a></div>
            <div><a href="#user-reps" className="hover:underline">6. USER REPRESENTATIONS</a></div>
            <div><a href="#prohibited" className="hover:underline">7. PROHIBITED ACTIVITIES</a></div>
            <div><a href="#data-ownership" className="hover:underline">8. DATA OWNERSHIP AND STORAGE</a></div>
            <div><a href="#management" className="hover:underline">9. SERVICES MANAGEMENT</a></div>
            <div><a href="#term" className="hover:underline">10. TERM AND TERMINATION</a></div>
            <div><a href="#modifications" className="hover:underline">11. MODIFICATIONS AND INTERRUPTIONS</a></div>
            <div><a href="#governing-law" className="hover:underline">12. GOVERNING LAW</a></div>
            <div><a href="#disputes" className="hover:underline">13. DISPUTE RESOLUTION</a></div>
            <div><a href="#disclaimer" className="hover:underline">14. DISCLAIMER</a></div>
            <div><a href="#liability" className="hover:underline">15. LIMITATIONS OF LIABILITY</a></div>
            <div><a href="#indemnification" className="hover:underline">16. INDEMNIFICATION</a></div>
            <div><a href="#misc" className="hover:underline">17. MISCELLANEOUS</a></div>
            <div><a href="#contact" className="hover:underline">18. CONTACT US</a></div>
          </div>
        </section>

        {/* Section 1: Our Services */}
        <section id="services" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. OUR SERVICES</h2>
          <p className="mb-4">
            Doc Bear's Symptom Vault provides health documentation and tracking features including:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Symptom logging with severity, duration, and impact tracking</li>
            <li>Medication management and effectiveness tracking</li>
            <li>Appointment scheduling and notes</li>
            <li>Health measurements (blood pressure, glucose, etc.)</li>
            <li>Trend analysis and symptom pattern visualization</li>
            <li>PDF and CSV export capabilities</li>
            <li>VA rating criteria correlation (for veteran profiles)</li>
            <li>Multi-profile support for caregivers</li>
          </ul>
          <p>
            The app operates as a Progressive Web App (PWA) and stores all data locally on your device using browser local storage.
          </p>
        </section>

        {/* Section 2: Medical Disclaimer - ENHANCED */}
        <section id="medical-disclaimer" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. MEDICAL DISCLAIMER</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-4 text-left">
            <p className="text-red-800 dark:text-red-300 font-bold mb-3">⚠️ IMPORTANT - PLEASE READ CAREFULLY</p>
            <div className="text-red-700 dark:text-red-400 space-y-3">
              <p>
                <strong>THE CREATOR OF THIS APP IS NOT A MEDICAL DOCTOR, LICENSED PHYSICIAN, NURSE, HEALTHCARE PROVIDER, OR MEDICAL PROFESSIONAL OF ANY KIND.</strong> The creator is a veteran who built this tool to help fellow veterans and others document their health symptoms.
              </p>
              <p>
                Doc Bear's Symptom Vault is NOT:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>A medical device regulated by the FDA or any other regulatory body</li>
                <li>A diagnostic tool capable of identifying diseases or conditions</li>
                <li>A substitute for professional medical advice, diagnosis, or treatment</li>
                <li>A replacement for consultation with qualified healthcare providers</li>
                <li>A tool for making medical decisions</li>
                <li>An emergency response or crisis intervention tool</li>
              </ul>
            </div>
          </div>

          <p className="mb-4">
            <strong>The information and features provided by this app are for personal documentation purposes only.</strong> The app:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>Does NOT provide medical diagnoses</strong> — only licensed healthcare providers can diagnose medical conditions</li>
            <li><strong>Does NOT offer medical advice</strong> — information displayed is for documentation, not treatment recommendations</li>
            <li><strong>Does NOT replace your doctor</strong> — all health concerns should be discussed with qualified medical professionals</li>
            <li><strong>Does NOT guarantee accuracy</strong> — while we strive for accuracy, we make no warranties about the correctness of any health-related analysis or information</li>
            <li><strong>Does NOT create a doctor-patient relationship</strong> — using this app does not establish any professional healthcare relationship</li>
          </ul>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Responsibilities:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Always consult with qualified healthcare professionals for medical advice</li>
              <li>Do not rely solely on this app for health-related decisions</li>
              <li>Seek immediate medical attention for any health emergency</li>
              <li>Verify all health information with your healthcare provider</li>
              <li>Understand that symptom tracking is for personal records, not medical guidance</li>
            </ul>
          </div>

          <p className="font-semibold text-red-700 dark:text-red-400">
            IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR, GO TO THE EMERGENCY DEPARTMENT, OR CALL 911 IMMEDIATELY. DO NOT RELY ON THIS APP FOR EMERGENCY MEDICAL NEEDS.
          </p>
        </section>

        {/* Section 3: VA Claims Disclaimer */}
        <section id="va-disclaimer" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. VA CLAIMS DISCLAIMER</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4 text-left">
            <p className="text-blue-800 dark:text-blue-300 font-bold mb-2">FOR VETERANS USING THE APP</p>
          </div>
          <p className="mb-4">
            The VA rating evidence analysis and documentation features are provided for informational and documentation purposes only:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>The app is <strong>NOT affiliated with</strong> the U.S. Department of Veterans Affairs</li>
            <li>The creator is <strong>NOT a VA-accredited claims agent, attorney, or representative</strong></li>
            <li>Rating analysis <strong>does NOT guarantee</strong> any specific VA disability rating</li>
            <li>The app <strong>does NOT submit</strong> claims or communicate with the VA on your behalf</li>
            <li>All rating determinations are made <strong>solely by the VA</strong></li>
            <li>Documentation from this app should <strong>supplement, not replace</strong> professional guidance</li>
            <li>Rating criteria may <strong>change without notice</strong> and the app may not reflect current regulations</li>
          </ul>
          <p className="mb-4">
            We strongly recommend working with VA-accredited claims agents, attorneys, or Veterans Service Organizations (VSOs) for assistance with disability claims. Rating criteria referenced in the app are based on 38 CFR Part 4 but may not reflect the most current regulations or interpretations.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left">
            <p className="font-semibold mb-2">Crisis Resources:</p>
            <p>Veterans Crisis Line: <strong>988</strong> (then press 1)</p>
            <p>Text: <strong>838255</strong></p>
            <p>Chat: <strong>VeteransCrisisLine.net/chat</strong></p>
          </div>
        </section>

        {/* Section 4: No Professional Relationship - NEW */}
        <section id="no-professional-relationship" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. NO PROFESSIONAL RELATIONSHIP</h2>
          <p className="mb-4">
            <strong>Use of this app does not create any professional relationship between you and Doc Bear Enterprises, LLC, or its creator.</strong> Specifically:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>No Doctor-Patient Relationship:</strong> No medical, healthcare, or therapeutic relationship is created by using this app</li>
            <li><strong>No Attorney-Client Relationship:</strong> No legal relationship is created, even when using VA claims-related features</li>
            <li><strong>No Fiduciary Duty:</strong> We have no fiduciary duty or obligation to you regarding your health or claims decisions</li>
            <li><strong>No Professional Advice:</strong> Nothing in this app constitutes professional medical, legal, or financial advice</li>
          </ul>
          <p className="mb-4">
            The information provided through the app is general in nature and is not tailored to your specific medical conditions, circumstances, or needs. You should always seek personalized advice from qualified professionals.
          </p>
        </section>

        {/* Section 5: IP */}
        <section id="ip" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. INTELLECTUAL PROPERTY RIGHTS</h2>
          <p className="mb-4">
            Unless otherwise indicated, the Services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Services (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
          </p>
          <p className="mb-4">
            The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
          </p>
          <p>
            Your health data and documentation that you create using the Services belongs to you. We do not claim ownership of any symptom logs, notes, or personal health information you enter into the app.
          </p>
        </section>

        {/* Section 6: User Representations */}
        <section id="user-reps" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. USER REPRESENTATIONS</h2>
          <p className="mb-4">
            By using the Services, you represent and warrant that:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>You have the legal capacity to agree to these Legal Terms</li>
            <li>You are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services</li>
            <li>You will not use the Services for any illegal or unauthorized purpose</li>
            <li>Your use of the Services will not violate any applicable law or regulation</li>
            <li>You understand this app is for documentation purposes only and is NOT a medical device</li>
            <li>You understand the creator is NOT a medical professional</li>
            <li>You will not rely on this app as a substitute for professional medical advice</li>
            <li>If tracking symptoms for another person, you have appropriate authorization to do so</li>
            <li>You understand that VA rating information is for reference only and does not guarantee any rating decision</li>
          </ul>
        </section>

        {/* Section 7: Prohibited Activities */}
        <section id="prohibited" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. PROHIBITED ACTIVITIES</h2>
          <p className="mb-4">
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          <p className="mb-4">
            As a user of the Services, you agree NOT to:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Attempt to bypass any security measures of the Services</li>
            <li>Reverse engineer, decompile, or disassemble any portion of the Services</li>
            <li>Use the Services to generate false or misleading medical documentation</li>
            <li>Use the Services to commit fraud against the VA or any other entity</li>
            <li>Represent that this app provides medical advice or diagnosis</li>
            <li>Distribute the app in a manner that misrepresents its purpose or capabilities</li>
            <li>Use the Services in any manner that could damage or impair the Services</li>
          </ul>
        </section>

        {/* Section 8: Data Ownership */}
        <section id="data-ownership" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. DATA OWNERSHIP AND STORAGE</h2>
          <p className="mb-4">
            <strong>Your Data, Your Control:</strong> All health data you enter into the Services is stored locally on your device and belongs to you.
          </p>
          <p className="mb-4">
            We do not:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Collect or store your health data on any servers</li>
            <li>Have access to view, modify, or delete your data</li>
            <li>Back up your data (you are responsible for your own backups)</li>
            <li>Transfer your data between devices (you must export/import manually)</li>
          </ul>
          <p className="mb-4">
            <strong>Your Responsibility:</strong> You are solely responsible for:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Maintaining backups of your data through the Export feature</li>
            <li>Protecting access to your device</li>
            <li>The accuracy of information you enter</li>
            <li>Appropriate sharing of exported reports</li>
          </ul>
        </section>

        {/* Section 9: Management */}
        <section id="management" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. SERVICES MANAGEMENT</h2>
          <p className="mb-4">
            We reserve the right, but not the obligation, to:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Monitor the Services for violations of these Legal Terms</li>
            <li>Take appropriate legal action against anyone who violates the law or these Legal Terms</li>
            <li>Refuse, restrict access to, or disable the Services or any portion thereof</li>
            <li>Remove or disable any content that is objectionable or in violation of these Legal Terms</li>
            <li>Otherwise manage the Services in a manner designed to protect our rights and property</li>
          </ul>
        </section>

        {/* Section 10: Term and Termination */}
        <section id="term" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. TERM AND TERMINATION</h2>
          <p className="mb-4">
            These Legal Terms shall remain in full force and effect while you use the Services. You may stop using the Services at any time by simply ceasing to access them.
          </p>
          <p className="mb-4">
            Because your data is stored locally, discontinuing use of the Services does not automatically delete your data. You may delete your data using the Settings menu within the app.
          </p>
        </section>

        {/* Section 11: Modifications */}
        <section id="modifications" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. MODIFICATIONS AND INTERRUPTIONS</h2>
          <p className="mb-4">
            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Services without notice at any time.
          </p>
          <p className="mb-4">
            We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors.
          </p>
          <p>
            Because the app functions offline using local storage, many features will continue to work even without an internet connection. However, updates and certain features may require connectivity.
          </p>
        </section>

        {/* Section 12: Governing Law */}
        <section id="governing-law" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. GOVERNING LAW</h2>
          <p>
            These Legal Terms shall be governed by and defined following the laws of the State of Iowa, United States. Doc Bear Enterprises, LLC. and yourself irrevocably consent that the courts of Iowa shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
          </p>
        </section>

        {/* Section 13: Dispute Resolution */}
        <section id="disputes" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. DISPUTE RESOLUTION</h2>
          <p className="mb-4">
            <strong>Informal Negotiations:</strong> To expedite resolution and control the cost of any dispute, controversy, or claim, the Parties agree to first attempt to negotiate any dispute informally for at least thirty (30) days before initiating arbitration.
          </p>
          <p className="mb-4">
            <strong>Binding Arbitration:</strong> If the Parties are unable to resolve a dispute through informal negotiations, the dispute shall be finally and exclusively resolved by binding arbitration in accordance with the American Arbitration Association rules.
          </p>
        </section>

        {/* Section 14: Disclaimer */}
        <section id="disclaimer" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">14. DISCLAIMER</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="uppercase font-semibold mb-4">
              THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-4">
              WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS</li>
              <li>PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES</li>
              <li>UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN</li>
              <li>INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES</li>
              <li>BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES</li>
              <li>ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT</li>
            </ul>
          </div>
          <p className="font-semibold">
            THE SERVICES ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR MEDICAL CONDITION. THE CREATOR IS NOT A MEDICAL PROFESSIONAL AND THIS APP DOES NOT PROVIDE MEDICAL ADVICE.
          </p>
        </section>

        {/* Section 15: Liability */}
        <section id="liability" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">15. LIMITATIONS OF LIABILITY</h2>
          <p className="uppercase mb-4">
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p className="uppercase">
            WE SPECIFICALLY DISCLAIM ANY LIABILITY FOR HEALTH OUTCOMES, MEDICAL DECISIONS, VA CLAIM RESULTS, OR ANY OTHER CONSEQUENCES ARISING FROM YOUR USE OF OR RELIANCE ON THE SERVICES. YOU ASSUME ALL RISK ASSOCIATED WITH YOUR USE OF THE APP AND ANY DECISIONS MADE BASED ON INFORMATION DISPLAYED THEREIN.
          </p>
        </section>

        {/* Section 16: Indemnification */}
        <section id="indemnification" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">16. INDEMNIFICATION</h2>
          <p>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; (5) any health-related decisions or outcomes resulting from your use of the Services; (6) any VA claims decisions or outcomes related to documentation created using the Services.
          </p>
        </section>

        {/* Section 17: Misc */}
        <section id="misc" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">17. MISCELLANEOUS</h2>
          <p>
            These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. If any provision of these Legal Terms is deemed unlawful, void, or unenforceable, that provision is deemed severable and does not affect the validity of remaining provisions.
          </p>
        </section>

        {/* Section 18: Contact */}
        <section id="contact" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">18. CONTACT US</h2>
          <p className="mb-4">
            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
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
            Doc Bear's Symptom Vault - A documentation tool created by a veteran for veterans. Not medical advice. 📋
          </p>
        </div>
      </div>
  );
};

export default TermsOfUse;