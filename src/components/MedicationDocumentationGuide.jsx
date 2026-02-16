import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getProfileType, PROFILE_TYPES } from '../utils/profile';

/**
 * MedicationDocumentationGuide Component
 *
 * Collapsible educational section explaining the importance of medication
 * effectiveness and side effects tracking under 38 CFR §4.10.
 *
 * Shows only for veteran profiles. Placed in the Medications tab to provide
 * context right where veterans are logging.
 *
 * Usage:
 *   <MedicationDocumentationGuide />
 */
export default function MedicationDocumentationGuide() {
  const [expanded, setExpanded] = useState(false);
  const profileType = getProfileType();

  // Only show for veteran profiles
  if (profileType !== PROFILE_TYPES.VETERAN) return null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <div className="text-left">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Why Track Effectiveness & Side Effects?
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                38 CFR §4.10 — How this data supports your VA claim
              </p>
            </div>
          </div>
          {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          )}
        </button>

        {expanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-blue-100 dark:border-blue-900">

              {/* What Changed */}
              <div className="pt-3">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  What Changed
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  38 CFR §4.10 requires VA to rate your disability based on your
                  <strong className="text-gray-900 dark:text-white"> actual functional impairment level while on medication</strong>.
                  If your medication reduces your symptoms, the VA rates you at the
                  controlled level — not at what your condition might be without treatment.
                </p>
              </div>

              {/* Why Effectiveness Tracking Matters */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <h5 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-1.5">
                  <span>✅</span> Effectiveness Tracking
                </h5>
                <p className="text-sm text-green-800 dark:text-green-300 mb-2 text-left">
                  When you log how well a medication controls your symptoms, you're
                  documenting your actual functional impairment — the exact standard
                  VA uses for rating.
                </p>
                <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="mt-0.5">•</span>
                    <span><strong>"No Relief"</strong> or <strong>"Slight Relief"</strong> shows medication isn't adequately controlling your condition</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="mt-0.5">•</span>
                    <span><strong>"Moderate"</strong> shows partial control — you still have significant impairment</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="mt-0.5">•</span>
                    <span>Consistent patterns over time build stronger evidence than single entries</span>
                  </p>
                </div>
              </div>

              {/* Why Side Effects Matter */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <h5 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                  <span>⚠️</span> Side Effects Documentation
                </h5>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-2 text-left">
                  Medication side effects can support <strong>secondary
                  service-connection claims</strong>. If a medication for your
                  service-connected condition causes new problems, those may be
                  ratable conditions themselves.
                </p>
                <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <p className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>GI problems from NSAIDs taken for service-connected pain</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Sexual dysfunction from antidepressants for service-connected PTSD</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    <span>Weight gain, drowsiness, or cognitive issues from prescribed medications</span>
                  </p>
                </div>
              </div>

              {/* Documentation Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
                  <span>💡</span> Documentation Tips
                </h5>
                <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1.5">
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="font-bold mt-0.5">1.</span>
                    <span><strong>Log every dose</strong> — consistency over weeks and months builds the strongest evidence</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="font-bold mt-0.5">2.</span>
                    <span><strong>Always rate effectiveness</strong> — even "Complete Relief" is useful data showing you need medication to function</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="font-bold mt-0.5">3.</span>
                    <span><strong>Note all side effects</strong> — tap every side effect you experience, even mild ones</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="font-bold mt-0.5">4.</span>
                    <span><strong>Use the "Taken For" field</strong> — connecting medications to specific conditions helps the Rating Evidence analysis</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-left">
                    <span className="font-bold mt-0.5">5.</span>
                    <span><strong>Report to your doctor</strong> — tell your provider about side effects so they're documented in your medical record too</span>
                  </p>
                </div>
              </div>

              {/* How This Appears in Your Export */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  How This Appears in Your Export
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your medication effectiveness and side effects data appears in three places:
                  the <strong>Medication Log</strong> section of your PDF/CSV export,
                  the <strong>Medication Effectiveness</strong> panel in each Rating
                  Evidence card, and linked to individual symptom entries when medications
                  are associated with symptoms.
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                This information is for educational purposes. It does not constitute
                legal or medical advice. Consult a Veterans Service Organization (VSO)
                or VA-accredited attorney for claim-specific guidance.
              </p>
            </div>
        )}
      </div>
  );
}