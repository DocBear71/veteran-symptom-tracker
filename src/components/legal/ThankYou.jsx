// file: src/components/legal/ThankYou.jsx v1 - Doc Bear's Symptom Vault Thank You page
// Displayed after successful PayPal donation
// Can be accessed directly via URL or shown in modal

import React from 'react';

const ThankYou = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎖️</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Support!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your generosity helps us serve veterans and their families
          </p>
        </div>

        {/* Confirmation Banner */}
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 mb-8 text-center">
          <span className="text-4xl mb-3 block">✅</span>
          <p className="text-green-800 dark:text-green-300 font-bold text-xl mb-2">
            Donation Received!
          </p>
          <p className="text-green-700 dark:text-green-400">
            Your contribution has been successfully processed. You should receive a confirmation email from PayPal shortly.
          </p>
        </div>

        {/* What Your Donation Supports */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            What Your Donation Supports
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💻</span>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Continued Development</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Adding new conditions, improving features, and keeping the app running smoothly.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎖️</span>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Veteran Support</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Helping more veterans document their symptoms for VA disability claims.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔒</span>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Privacy & Security</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Maintaining our commitment to keeping your health data private and secure.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📱</span>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Platform Growth</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Working toward native mobile apps for Android and iOS.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Message */}
        <section className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-700 rounded-lg p-6 text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">A Personal Note</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              As a Marine Corps veteran who has navigated the VA claims process myself, I know how challenging it can be to document symptoms consistently. Your support helps me continue building the tool I wish I had during my own journey.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Every donation, no matter the size, makes a real difference. It tells me that this work matters and encourages me to keep improving the app for our veteran community.
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Semper Fi, and thank you for your support.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
              — Dr. Edward McKeown, Founder
            </p>
          </div>
        </section>

        {/* What's Next */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            What's Next?
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <span>Check your email for a receipt from PayPal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📝</span>
                <span>Continue tracking your symptoms in the app</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📣</span>
                <span>Share Doc Bear's Symptom Vault with fellow veterans who might benefit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💬</span>
                <span>Send us feedback at <a href="mailto:privacy@docbear-ent.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@docbear-ent.com</a></span>
              </li>
            </ul>
          </div>
        </section>

        {/* Share the App */}
        <section className="mb-8">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-400 dark:border-purple-700 rounded-lg p-6 text-center">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 text-lg mb-2">
              Help Us Reach More Veterans
            </h3>
            <p className="text-purple-700 dark:text-purple-400 mb-4">
              Know a veteran who could use this app? Share it with them!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                  href="https://www.docbear-ent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Visit Our Website
              </a>
            </div>
          </div>
        </section>

        {/* Return to App */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to continue tracking your symptoms?
          </p>
          <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Return to Symptom Vault
          </a>
        </div>

        {/* Footer - Centered */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Doc Bear's Symptom Vault — Built with ❤️ by a veteran, for veterans. 🎖️
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} Doc Bear Enterprises, LLC. All rights reserved.
          </p>
        </div>
      </div>
  );
};

export default ThankYou;