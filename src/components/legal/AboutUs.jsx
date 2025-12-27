// file: src/components/legal/AboutUs.jsx v2 - Doc Bear's Symptom Vault About Us page
// About page for the privacy-first health tracking application
// FIXED: Left-justified text, correct service branch (Marine Corps)

import React from 'react';

const AboutUs = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About Doc Bear's Symptom Vault
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 italic">
            Privacy-first health tracking for veterans and everyone
          </p>
        </div>

        {/* Mission Banner - Centered */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-800 dark:text-blue-300 font-bold">
            🎖️ Built by a Veteran, for Veterans — and for everyone who needs to track their health journey.
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="mb-4">
            Doc Bear's Symptom Vault was born from a simple but powerful need: helping veterans document their symptoms in a way that actually matters for VA disability claims. Too many veterans struggle to remember and articulate the frequency, severity, and impact of their service-connected conditions when it matters most — during C&P exams and claims reviews.
          </p>
          <p className="mb-4">
            Our mission is to provide a comprehensive, privacy-first health tracking tool that:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li>Helps veterans build strong, evidence-based documentation for VA claims</li>
            <li>Correlates symptoms with official VA rating criteria from 38 CFR Part 4</li>
            <li>Serves caregivers supporting veterans, elderly parents, or children with special needs</li>
            <li>Provides general health tracking for anyone managing chronic conditions</li>
            <li>Keeps ALL data private and secure on your device — never on our servers</li>
          </ul>
        </section>

        {/* What We Offer */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📝 Symptom Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Log symptoms with severity, duration, triggers, and functional impact. Quick log chronic symptoms for fast daily documentation.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📊 Rating Evidence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For veterans: see how your documented symptoms align with VA rating criteria for 185+ conditions.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💊 Medication Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track medications, dosages, and effectiveness. Log adherence and correlate with symptom patterns.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📈 Trends & Patterns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize symptom trends over time. Identify patterns and triggers to share with your healthcare team.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📄 Professional Exports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate PDF and CSV reports to share with doctors, VSOs, attorneys, or your care team.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">👥 Multi-Profile Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Caregivers can manage multiple profiles — for veterans, elderly parents, children, or anyone in their care.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who We Serve</h2>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">🎖️ Veterans</h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                Document symptoms aligned with 38 CFR Part 4 rating criteria. Build evidence for initial claims, increases, and appeals. Prepare for C&P exams with comprehensive symptom history.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-500 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">❤️ Caregivers</h3>
              <p className="text-purple-700 dark:text-purple-400 text-sm">
                Track symptoms for veterans, elderly parents, children with special needs, or anyone who needs help managing their health. Share reports with their care teams.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🏥 General Health Users</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Anyone managing chronic conditions, tracking symptoms for doctor visits, or wanting to understand their health patterns over time.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy First */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy First</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔒</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Data Stays on YOUR Device</h3>
            </div>
            <p className="mb-4">
              We built Doc Bear's Symptom Vault with a fundamentally different approach: <strong>your health data never leaves your device</strong>.
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>No accounts required — no email, no phone number, no personal information</li>
              <li>No cloud storage — everything stays in your browser's local storage</li>
              <li>No tracking — we don't know who you are or what you log</li>
              <li>No data sharing — we have nothing to share because we never see your data</li>
              <li>Works offline — because your data is local, you can use the app anywhere</li>
            </ul>
          </div>
        </section>

        {/* About the Founder */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Founder</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-left">
            <p className="mb-4">
              Doc Bear's Symptom Vault was created by <strong>Dr. Edward McKeown</strong>, a U.S. Marine Corps veteran and founder of Doc Bear Enterprises, LLC.
            </p>
            <p className="mb-4">
              Dr. McKeown served in the U.S. Marine Corps and later earned his doctorate while working in hospitality management and food safety. His experience navigating the VA claims process firsthand — combined with feedback from fellow veterans, VA claims representatives, and clinical therapists — inspired the creation of this app.
            </p>
            <p className="mb-4">
              As an active member of Kirkwood's Veterans' Association and a longtime advocate for veteran support, Dr. McKeown understands the challenges veterans face when documenting symptoms for disability claims. This app represents his commitment to helping fellow veterans and their caregivers.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 italic">
              Dr. McKeown is also known for his "Doc Bear's Comfort Food Survival Guide" cookbook series and his work in food safety training and technology solutions.
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
                <span><strong>Free to Use:</strong> Core features are free for all users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Privacy Protected:</strong> We will never collect, store, or sell your health data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Evidence-Based:</strong> Rating criteria from official VA sources (38 CFR Part 4)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Continuously Improved:</strong> Regular updates based on user feedback and VA regulation changes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Veteran Focused:</strong> Built with input from veterans, VSOs, and healthcare providers</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Built with Modern Technology</h2>
          <p className="mb-4">
            Doc Bear's Symptom Vault is built using cutting-edge web technologies to ensure fast, reliable performance across all devices:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Progressive Web App (PWA):</strong> Install on any device, works offline</li>
            <li><strong>React + Vite:</strong> Fast, responsive user interface</li>
            <li><strong>Tailwind CSS:</strong> Clean, accessible design with dark mode support</li>
            <li><strong>Local Storage:</strong> Secure, private data storage on your device</li>
            <li><strong>Mobile-First:</strong> Optimized for phones and tablets</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
            <p className="font-semibold text-lg mb-4">Doc Bear Enterprises, LLC.</p>
            <p className="mb-2">5249 N Park Pl NE, PMB 4011</p>
            <p className="mb-4">Cedar Rapids, IA 52402</p>
            <p className="mb-2">
              Email: <a href="mailto:privacy@docbear-ent.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@docbear-ent.com</a>
            </p>
            <p>
              Website: <a href="https://www.docbear-ent.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.docbear-ent.com</a>
            </p>
          </div>
        </section>

        {/* Values - Centered */}
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
              <div className="text-sm text-gray-600 dark:text-gray-400">Your data, your control</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-bold text-gray-900 dark:text-white">Enable Documentation</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Build your evidence</div>
            </div>
          </div>
        </section>

        {/* Footer - Centered */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Doc Bear's Symptom Vault — Helping veterans document their journey. 🎖️
          </p>
        </div>
      </div>
  );
};

export default AboutUs;