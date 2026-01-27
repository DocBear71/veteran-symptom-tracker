import { useState } from 'react';
import { Shield, X, Check, Server, Database, Eye, Lock, Cloud, Bot } from 'lucide-react';

/**
 * PrivacyExplainer.jsx
 *
 * Comprehensive privacy transparency modal with 3 tabs:
 * 1. Overview - Quick visual summary of privacy features
 * 2. Technical Proof - Show the technical evidence (network calls, storage)
 * 3. For Skeptics - Address common concerns directly
 *
 * Builds trust by being radically transparent about data handling.
 * Competitive advantage: We're MORE private than Vet-Rate.org (they use GoatCounter analytics)
 */

export default function PrivacyExplainer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                      max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 dark:bg-green-700 px-6 py-4
                        flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">100% Private</h2>
                <p className="text-green-100 text-sm">Your data never leaves your device</p>
              </div>
            </div>
            <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-lg
                         hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                aria-label="Close privacy explainer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'technical', label: 'Technical Proof' },
              { id: 'skeptics', label: 'For Skeptics' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50
                                dark:bg-green-900/20 rounded-lg">
                      <Server className="w-5 h-5 text-green-600 dark:text-green-400
                                     flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          No Backend Server
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Static files only - nothing to hack
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50
                                dark:bg-green-900/20 rounded-lg">
                      <Database className="w-5 h-5 text-green-600 dark:text-green-400
                                       flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          No Database
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Your data stays in your browser
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50
                                dark:bg-green-900/20 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600 dark:text-green-400
                                  flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Zero Analytics
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          No tracking, no cookies, no fingerprinting
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50
                                dark:bg-green-900/20 rounded-lg">
                      <Lock className="w-5 h-5 text-green-600 dark:text-green-400
                                   flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          No AI Transmission
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          No cloud AI - everything stays local
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What Stays On YOUR Device:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        All symptom logs and history
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Service-connected conditions
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Medications and measurements
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        All settings and preferences
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Everything you type or create
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200
                              dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      💡 How We Compare
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Other VA tools may use analytics (GoatCounter), optional cloud features,
                      or AI data transmission. <strong>We don't.</strong> Your data exists ONLY
                      in your browser's localStorage. We can't see it even if we wanted to.
                    </p>
                  </div>
                </div>
            )}

            {activeTab === 'technical' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg
                              font-mono text-sm overflow-x-auto">
                    <pre>{`// Our entire stack:
Frontend: React + Vite     ✅
Backend:  None             ❌
Database: None             ❌
API Server: None           ❌
Analytics: None            ❌
AI Cloud: None             ❌

// Just static files served via Vercel
// Your browser does ALL the work`}</pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Network Requests You'll See:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left py-2 text-gray-600
                                       dark:text-gray-400 font-medium">Request</th>
                          <th className="text-left py-2 text-gray-600
                                       dark:text-gray-400 font-medium">Purpose</th>
                          <th className="text-left py-2 text-gray-600
                                       dark:text-gray-400 font-medium">Your Data?</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300">
                        <tr className="border-b dark:border-gray-700">
                          <td className="py-2 font-mono text-xs">*.vercel.app/assets/*</td>
                          <td className="py-2">App files (JS/CSS)</td>
                          <td className="py-2 text-green-600 dark:text-green-400 font-semibold">❌ No</td>
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                          <td className="py-2 font-mono text-xs">fonts.googleapis.com</td>
                          <td className="py-2">Font files</td>
                          <td className="py-2 text-green-600 dark:text-green-400 font-semibold">❌ No</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-xs">Anything else</td>
                          <td className="py-2 font-semibold">Should NOT exist</td>
                          <td className="py-2 text-red-600 dark:text-red-400 font-semibold">🚨 Report it!</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border
                              border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2
                               flex items-center gap-2">
                      <span>🔍</span>
                      Verify Yourself
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      Press <kbd className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800
                      rounded text-xs font-mono">F12</kbd> to open DevTools → Network tab →
                      Reload the page → See exactly what requests are made.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                      If you see anything suspicious, please report it immediately. We take
                      privacy seriously.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Where Your Data Lives:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3
                                font-mono text-xs">
                      <p className="text-gray-700 dark:text-gray-300 mb-1">
                        📍 localStorage keys:
                      </p>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400 ml-4">
                        <li>• symptomTracker_symptomLogs</li>
                        <li>• symptomTracker_chronicSymptoms</li>
                        <li>• symptomTracker_serviceConnected</li>
                        <li>• symptomTracker_userProfile</li>
                        <li>• symptomTracker_theme</li>
                      </ul>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-2 italic">
                        Open DevTools → Application → Local Storage to verify
                      </p>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'skeptics' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex
                               items-center gap-2 mb-2">
                      <span>❓</span>
                      "If it's free, I'm the product. Right?"
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Not here. That business model requires collecting your data to
                      sell or monetize. <strong>We can't sell what we don't have.</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is a passion project built by a Marine Corps veteran who
                      navigated the VA claims process himself. The goal is helping
                      veterans - not monetizing them.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex
                               items-center gap-2 mb-2">
                      <span>❓</span>
                      "What if there's a data breach?"
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Can't breach what doesn't exist.</strong> Traditional
                      breaches happen when companies store your data on servers. We have:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>❌ No user database</li>
                      <li>❌ No authentication server</li>
                      <li>❌ No API server processing data</li>
                      <li>❌ No logs of user activity</li>
                      <li>✅ Just static files (HTML/CSS/JS)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex
                               items-center gap-2 mb-2">
                      <span>❓</span>
                      "Why should I trust you?"
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Don't trust - verify.</strong> Use browser DevTools to
                      watch network traffic. Check localStorage to see your data.
                      Export your data anytime. You're in complete control.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Plus, we're open about our approach. Other tools may say they're
                      "privacy-first" while still using analytics (GoatCounter) or
                      optional cloud features. We don't play word games - we're radically
                      transparent.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex
                               items-center gap-2 mb-2">
                      <span>❓</span>
                      "What about future features?"
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll <strong>never</strong> add cloud storage, analytics, or AI
                      transmission without making it crystal clear and 100% optional.
                      The current architecture - localStorage only - is the foundation
                      we're committed to. Your data will always stay on your device
                      unless you explicitly export it.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200
                              dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2
                               flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Bottom Line
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      We're a veteran-built tool focused on helping you document symptoms
                      for VA claims. We make no money from your data, have no investors
                      demanding monetization, and have no technical infrastructure capable
                      of storing your information even if we wanted to. This isn't marketing
                      speak - it's architectural reality.
                    </p>
                  </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4
                        bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-500
                        dark:text-gray-400">
              <span>Doc Bear's Symptom Vault v3.0.0</span>
              <span>158,000+ lines of privacy-focused code</span>
            </div>
          </div>
        </div>
      </div>
  );
}