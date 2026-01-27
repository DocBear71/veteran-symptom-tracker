import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

/**
 * TermsModal.jsx
 *
 * First-visit modal that requires users to accept Terms of Use
 * before using the app. Blocks all app functionality until accepted.
 *
 * Key features:
 * - Non-dismissible (no X button, no clicking outside)
 * - Scrollable terms content
 * - Clear "I Understand & Accept" button
 * - Stores acceptance timestamp in localStorage
 *
 * Usage:
 *   <TermsModal isOpen={showTerms} onAccept={handleAcceptTerms} />
 */

export default function TermsModal({ isOpen, onAccept }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasReadMedical, setHasReadMedical] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
    ) < 10;

    if (isAtBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4
                    bg-black/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                      max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">Terms of Use</h2>
            <p className="text-blue-100 text-sm mt-1">
              Please read and accept before using Doc Bear's Symptom Vault
            </p>
          </div>

          {/* Critical Disclaimer Banner */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b-2 border-yellow-500
                        px-6 py-4 flex-shrink-0">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400
                                       flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                  ⚠️ Important Medical & Legal Disclaimer
                </p>
                <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2">
                  <p>
                    <strong>The creator of this app is NOT a medical doctor, licensed
                      healthcare provider, or medical professional.</strong> This app was
                    created by a veteran to help fellow veterans document their symptoms.
                  </p>
                  <p>
                    Doc Bear's Symptom Vault is a personal documentation tool only. It is
                    NOT a medical device, diagnostic tool, or substitute for professional
                    medical advice, diagnosis, or treatment.
                  </p>
                  <p>
                    <strong>Always seek the advice of your physician or other qualified
                      health provider</strong> with any questions you may have regarding a
                    medical condition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Terms Content */}
          <div
              className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-700
                       dark:text-gray-300"
              onScroll={handleScroll}
          >
            <div className="space-y-4">
              {/* Key Points Summary */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  By using this app, you understand and agree that:
                </h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>This app is for <strong>documentation purposes only</strong>,
                    not medical advice or diagnosis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>The creator is <strong>NOT a medical professional</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>For veterans: This app is <strong>NOT affiliated with the VA</strong>
                    and does not guarantee any disability rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>All data is stored <strong>locally on your device</strong> -
                    you are responsible for backups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>The app is provided <strong>"AS IS"</strong> with no warranties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>We are <strong>NOT liable</strong> for health outcomes, VA claim
                    results, or any decisions made using this app</span>
                  </li>
                </ul>
              </section>

              {/* Emergency Notice */}
              <section className="bg-red-50 dark:bg-red-900/20 border border-red-200
                                dark:border-red-800 rounded-lg p-4">
                <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
                  🚨 Medical Emergencies
                </p>
                <p className="text-red-600 dark:text-red-300 text-sm">
                  IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR,
                  GO TO THE EMERGENCY DEPARTMENT, OR CALL 911 IMMEDIATELY.
                  DO NOT RELY ON THIS APP FOR EMERGENCY MEDICAL NEEDS.
                </p>
              </section>

              {/* Veterans Crisis Line */}
              <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200
                                dark:border-blue-800 rounded-lg p-4">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  🎖️ Veterans Crisis Line
                </p>
                <div className="text-blue-600 dark:text-blue-300 text-sm space-y-1">
                  <p><strong>Call:</strong> 988 (then press 1)</p>
                  <p><strong>Text:</strong> 838255</p>
                  <p><strong>Chat:</strong> VeteransCrisisLine.net/chat</p>
                </div>
              </section>

              {/* Full Terms Link */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Full Terms of Use
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  The complete Terms of Use, Privacy Policy, and additional information
                  can be viewed at any time in the Settings menu.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  These terms are governed by the laws of the State of Iowa, United States.
                </p>
              </section>

              {/* Contact */}
              <section className="text-xs text-gray-500 dark:text-gray-400">
                <p><strong>Doc Bear Enterprises, LLC.</strong></p>
                <p>5249 N Park Pl NE, PMB 4011</p>
                <p>Cedar Rapids, IA 52402</p>
                <p>Email: privacy@docbear-ent.com</p>
              </section>

              {/* Scroll indicator */}
              {!hasScrolled && (
                  <div className="sticky bottom-0 left-0 right-0 flex justify-center
                                py-4 bg-gradient-to-t from-white dark:from-gray-800
                                via-white dark:via-gray-800 pointer-events-none">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full
                                  text-sm font-medium animate-bounce">
                      ↓ Scroll to continue ↓
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Footer with Accept Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4
                        bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            {/* Medical Disclaimer Checkbox */}
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input
                  type="checkbox"
                  checked={hasReadMedical}
                  onChange={(e) => setHasReadMedical(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded
                           focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I understand this app is <strong>NOT medical advice</strong> and the
                creator is <strong>NOT a medical professional</strong>
              </span>
            </label>

            <button
                onClick={onAccept}
                disabled={!hasScrolled || !hasReadMedical}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    hasScrolled && hasReadMedical
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              {!hasScrolled
                  ? 'Scroll to read terms first'
                  : !hasReadMedical
                      ? 'Check the box above to continue'
                      : 'I Understand & Accept'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Acceptance is stored locally on your device
            </p>
          </div>
        </div>
      </div>
  );
}