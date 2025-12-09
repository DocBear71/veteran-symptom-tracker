import React from 'react';
import { Activity } from 'lucide-react';


const HearingLossRatingCard = () => {
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hearing Loss
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 6100 (38 CFR 4.85)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Hearing loss ratings require <strong>pure-tone audiometry testing</strong> by an audiologist.
              Symptom tracking helps document functional impact but cannot determine rating percentage.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">100% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Bilateral loss averaging 55+ dB at 500, 1000, 2000 Hz<br/>
                • With additional loss at 3000, 4000 Hz
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20">
              <div className="font-bold text-gray-900 dark:text-white">60% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Bilateral loss averaging 45-54 dB at speech frequencies
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Bilateral loss averaging 35-44 dB at speech frequencies
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Bilateral loss averaging 26-34 dB at speech frequencies
              </div>
            </div>

            <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 dark:bg-gray-900/20">
              <div className="font-bold text-gray-900 dark:text-white">0% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Hearing loss present but below compensable levels
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Critical Documentation:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Pure-tone audiometry test (required for all ratings)</li>
              <li>✓ Speech recognition testing (Maryland CNC or similar)</li>
              <li>✓ Test both ears separately</li>
              <li>✓ Request copy of audiogram for records</li>
              <li>✓ Document functional impact (phone, conversations, TV, etc.)</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What to Track:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Difficulty hearing in specific situations</li>
              <li>• Which ear(s) affected (bilateral is higher rating)</li>
              <li>• Impact on work, social activities, safety</li>
              <li>• Use of hearing aids or assistive devices</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default HearingLossRatingCard;