import React from 'react';
import { Activity } from 'lucide-react';


const ScarsRatingCard = ({ analysis, expanded, onToggle }) => {
    if (!analysis || !analysis.hasData) return null;
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scars (Disfiguring)
          </h2>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 7800-7805 (38 CFR 4.118)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Scars must be measured in <strong>square centimeters</strong>. Scars on exposed areas
              (head, face, neck, hands) are rated higher than scars on covered body areas.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">80% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Head/face/neck: Deep scars causing gross distortion<br/>
                • Extremely disfiguring or unsightly
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20">
              <div className="font-bold text-gray-900 dark:text-white">50% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Head/face/neck: 144+ square cm of scarring<br/>
                • Unstable or painful scars over large areas
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Head/face/neck: 72-143 square cm<br/>
                • One characteristic causing moderate disfigurement
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Head/face/neck: 6-71 square cm<br/>
                • Other body areas: 144+ square cm
              </div>
            </div>

            <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 dark:bg-gray-900/20">
              <div className="font-bold text-gray-900 dark:text-white">0% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Scarring present but below compensable levels
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Critical Documentation:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Have provider measure scars in square centimeters</li>
              <li>✓ Document exact location of each scar</li>
              <li>✓ Note characteristics: raised, keloid, unstable, painful</li>
              <li>✓ Photograph scars (include ruler for scale)</li>
              <li>✓ Document functional limitations from scars</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Measurement Tip:
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              1 square inch = 6.45 square cm. A 2" x 2" scar = approximately 26 square cm.
              Measure length × width for rectangular scars.
            </p>
          </div>
        </div>
      </div>
  );
};

export default ScarsRatingCard;