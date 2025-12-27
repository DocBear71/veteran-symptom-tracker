// file: src/components/legal/Contact.jsx v2 - Doc Bear's Symptom Vault Contact page
// Simple contact page with email link
// FIXED: Left-justified text for better readability

import React from 'react';

const Contact = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We'd love to hear from you
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Email */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📧</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Us</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For questions, feedback, or support inquiries:
            </p>
            <a
                href="mailto:privacy@docbear-ent.com"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              privacy@docbear-ent.com
            </a>
          </div>

          {/* Response Time */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⏱️</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Response Time</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We typically respond to inquiries within <strong>1-2 business days</strong>.
              During high-volume periods, responses may take up to 5 business days.
            </p>
          </div>
        </div>

        {/* What We Can Help With */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Can Help With</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Feature Suggestions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Have an idea for a new feature or improvement? We'd love to hear your suggestions.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🐛 Bug Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found something not working correctly? Let us know so we can fix it.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">❓ General Questions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Questions about how to use the app, privacy concerns, or anything else.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🤝 Partnership Inquiries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interested in partnering with us? VSOs and veteran organizations welcome.
              </p>
            </div>
          </div>
        </section>

        {/* What We Cannot Help With */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Cannot Help With</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 text-left">
            <p className="text-yellow-800 dark:text-yellow-300 mb-4">
              Please note that we are <strong>not affiliated with the VA</strong> and cannot provide:
            </p>
            <ul className="list-disc ml-6 text-yellow-700 dark:text-yellow-400 space-y-2">
              <li>Medical advice or diagnoses</li>
              <li>Assistance filing VA claims</li>
              <li>Information about your VA claim status</li>
              <li>Legal advice regarding disability claims</li>
              <li>Access to VA systems or records</li>
            </ul>
            <p className="mt-4 text-yellow-800 dark:text-yellow-300">
              For VA-related assistance, please contact your local <strong>Veterans Service Organization (VSO)</strong> or the VA directly.
            </p>
          </div>
        </section>

        {/* Crisis Resources */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Crisis Resources</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg p-6 text-left">
            <p className="text-red-800 dark:text-red-300 font-semibold mb-4">
              If you are in crisis or need immediate support:
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-bold text-red-800 dark:text-red-300">Veterans Crisis Line</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">988, Press 1</p>
              </div>
              <div>
                <p className="font-bold text-red-800 dark:text-red-300">Text</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">838255</p>
              </div>
              <div>
                <p className="font-bold text-red-800 dark:text-red-300">Chat</p>
                <a
                    href="https://www.veteranscrisisline.net/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 dark:text-red-400 hover:underline"
                >
                  VeteransCrisisLine.net/chat
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mailing Address */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mailing Address</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
            <p className="font-semibold text-gray-900 dark:text-white">Doc Bear Enterprises, LLC.</p>
            <p className="text-gray-600 dark:text-gray-400">5249 N Park Pl NE, PMB 4011</p>
            <p className="text-gray-600 dark:text-gray-400">Cedar Rapids, IA 52402</p>
            <p className="text-gray-600 dark:text-gray-400">United States</p>
          </div>
        </section>

        {/* Feedback Appreciated */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center">
          <p className="text-lg text-blue-800 dark:text-blue-300 mb-2">
            Your feedback helps us improve Doc Bear's Symptom Vault for veterans everywhere.
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Thank you for being part of our community! 🎖️
          </p>
        </div>

        {/* Footer - Centered */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Doc Bear's Symptom Vault — We're here to help. 💬
          </p>
        </div>
      </div>
  );
};

export default Contact;