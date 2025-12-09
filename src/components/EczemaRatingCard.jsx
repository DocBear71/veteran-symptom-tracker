import React from 'react';
import { Activity } from 'lucide-react';


const EczemaRatingCard = ({ analysis, expanded, onToggle }) => {
    if (!analysis || !analysis.hasData) return null;
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Eczema / Dermatitis
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 7806 (38 CFR 4.118)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Eczema/dermatitis rated based on extent of body coverage and frequency of flares.
              Includes atopic dermatitis, contact dermatitis, and seborrheic dermatitis.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">60% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • More than 40% of body or exposed areas affected<br/>
                • Characteristic lesions with intense itching
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • 20-40% of body or exposed areas affected
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • 5-20% of body or exposed areas affected<br/>
                • With frequent flare-ups
              </div>
            </div>

            <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 dark:bg-gray-900/20">
              <div className="font-bold text-gray-900 dark:text-white">0% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Less than 5% of body affected
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Critical Documentation:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Estimate % of body affected during flares</li>
              <li>✓ Document intense itching and sleep disruption</li>
              <li>✓ Track frequency and duration of flares</li>
              <li>✓ Note exposed area involvement (face, neck, hands)</li>
              <li>✓ Photograph affected areas during active flares</li>
              <li>✓ Record treatments and their effectiveness</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What to Track:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Type of dermatitis (if diagnosed)</li>
              <li>• Body areas affected</li>
              <li>• Intensity of itching (especially nighttime)</li>
              <li>• Oozing, crusting, or secondary infections</li>
              <li>• Impact on work and social activities</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default EczemaRatingCard;