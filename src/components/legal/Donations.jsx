// file: src/components/legal/Donations.jsx v4 - Doc Bear's Symptom Vault Donations page
// UPDATED: PayPal replaced with a Stripe Payment Link (one-time, donor picks amount)
// NOTE: Footer hides the Support Us link on iOS (App Store Guideline 3.1.1)

import React from 'react';

// Stripe Payment Link. Stripe redirects to /thank-you after payment.
const STRIPE_DONATION_URL = 'https://donate.stripe.com/eVq5kEf5Xbtp0kDgaH0kE00';

const Donations = () => {
  return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-left">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Support Our Mission
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us continue building tools for veterans and their caregivers
          </p>
        </div>

        {/* Mission Banner - Centered */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-6 mb-8 text-center">
          <span className="text-4xl mb-4 block">🎖️</span>
          <p className="text-blue-800 dark:text-blue-300 font-bold text-lg mb-2">
            Doc Bear's Symptom Vault is free for all users
          </p>
          <p className="text-blue-700 dark:text-blue-400">
            Your donations help us maintain the app, add new features, and keep it free for veterans who need it most.
          </p>
        </div>

        {/* How Donations Help */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Your Donation Helps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">💻 Development & Maintenance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keeping the app updated, fixing bugs, and ensuring compatibility with new devices and browsers.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">📋 New Conditions & Features</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adding more VA diagnostic codes, rating criteria, and features based on veteran feedback.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">🔒 Privacy & Security</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ensuring your data remains private and secure on your device with ongoing security updates.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">📱 Web, Android & iOS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keeping the web, Android, and iOS apps updated together, so the app works the same wherever you use it.
              </p>
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ways to Support</h2>

          {/* Stripe - Primary */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-400 dark:border-indigo-700 rounded-lg p-6 mb-4 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" aria-hidden="true">💳</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Donate by Card</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Make a one-time donation through Stripe's secure checkout. Accepts major credit and debit cards, plus Apple Pay or Google Pay where your device supports it.
            </p>
            <a
                href={STRIPE_DONATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Donate now (opens Stripe checkout in a new tab)"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg transition-colors text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Donate Now
            </a>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              You choose the amount. Payments are processed by Stripe, and Doc Bear Enterprises, LLC never sees your card number.
            </p>
          </div>

          {/* Other Ways to Help */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-700 rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💌</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Other Ways to Help</h3>
            </div>
            <ul className="list-disc ml-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li><strong>Share the app</strong> with fellow veterans and caregivers</li>
              <li><strong>Leave feedback</strong> to help us improve</li>
              <li><strong>Report bugs</strong> so we can fix them</li>
              <li><strong>Suggest features</strong> that would help veterans</li>
              <li><strong>Tell your VSO</strong> about this documentation tool</li>
            </ul>
          </div>
        </section>

        {/* Transparency */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Promise</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-left">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>100% goes to development:</strong> All donations support app development and maintenance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Always free for veterans:</strong> Core features will always be free</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Privacy protected:</strong> We will never sell data or use aggressive ads</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <span><strong>Veteran-owned:</strong> Doc Bear Enterprises is a veteran-owned small business</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Tax Information */}
        <section className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg p-4 text-left">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm">
              <strong>Note:</strong> Doc Bear Enterprises, LLC is a for-profit company. Donations are not tax-deductible as charitable contributions. We appreciate your support in helping us serve the veteran community.
            </p>
          </div>
        </section>

        {/* Thank You - Centered */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center">
          <span className="text-4xl mb-4 block">🙏</span>
          <p className="text-xl text-blue-800 dark:text-blue-300 font-bold mb-2">
            Thank You for Your Support
          </p>
          <p className="text-blue-700 dark:text-blue-400">
            Every contribution, whether financial or through feedback and sharing, helps us serve more veterans and their families.
          </p>
        </div>

        {/* Contact for Corporate/Bulk */}
        <section className="mt-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Corporate or Bulk Donations</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              For larger donations or corporate sponsorships, please contact us directly:
            </p>
            <a
                href="mailto:edward@docbear-ent.com"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              edward@docbear-ent.com
            </a>
          </div>
        </section>

        {/* Footer - Centered */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Doc Bear's Symptom Vault — Built with ❤️ for veterans. 🎖️
          </p>
        </div>
      </div>
  );
};

export default Donations;