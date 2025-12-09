import React from 'react';


const PsoriasisRatingCard = () => {
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Psoriasis
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 7816 (38 CFR 4.118)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Psoriasis rated based on percentage of body or exposed areas covered by active lesions.
              Use "rule of nines" or palm method (palm = 1% of body surface).
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">60% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • 40% or more of entire body covered<br/>
                • OR 40% or more of exposed areas affected
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • 20-39% of entire body or exposed areas affected
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • 5-19% of entire body or exposed areas affected
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
              Measuring Body Coverage:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Palm method:</strong> Your palm (including fingers) = ~1% body surface</li>
              <li><strong>Exposed areas:</strong> Head, face, neck, hands</li>
              <li><strong>During flares:</strong> Estimate % covered by active lesions</li>
              <li><strong>Photos:</strong> Document extent and characteristics</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What to Track:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Percentage of body covered during flares</li>
              <li>• Location (especially exposed areas)</li>
              <li>• Frequency and duration of flare-ups</li>
              <li>• Characteristics (plaques, scales, bleeding)</li>
              <li>• Treatments used and effectiveness</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default PsoriasisRatingCard;