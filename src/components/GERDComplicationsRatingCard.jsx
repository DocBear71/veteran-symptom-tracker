import React from 'react';
import { Activity } from 'lucide-react';


const GERDComplicationsRatingCard = ({ analysis, expanded, onToggle }) => {
    if (!analysis || !analysis.hasData) return null;
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            GERD with Complications
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 7346 (38 CFR 4.114)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              GERD with documented complications (hiatal hernia, Barrett's esophagus, stricture, esophagitis).
              Requires endoscopy documentation showing pathology.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">60% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Severe symptoms with Barrett's esophagus<br/>
                • OR stricture requiring dilation every 2-3 months<br/>
                • Significant weight loss or malnutrition
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Persistently recurrent symptoms with documented pathology<br/>
                • Hiatal hernia or stricture with occasional dilation<br/>
                • Daily medication required despite treatment
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Symptoms controlled with continuous medication<br/>
                • Mild to moderate pathology (esophagitis, small hiatal hernia)
              </div>
            </div>

            <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 dark:bg-gray-900/20">
              <div className="font-bold text-gray-900 dark:text-white">0% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Complications documented but symptoms controlled
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Critical Documentation:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Endoscopy reports showing complications</li>
              <li>✓ Biopsy results if Barrett's esophagus suspected</li>
              <li>✓ Frequency of dilation procedures (if applicable)</li>
              <li>✓ Daily medication requirements</li>
              <li>✓ Weight loss or nutritional issues</li>
              <li>✓ Difficulty swallowing (dysphagia)</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What to Track:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Type of complication (hiatal hernia, Barrett's, stricture)</li>
              <li>• Difficulty swallowing or food getting stuck</li>
              <li>• Severe heartburn despite medication</li>
              <li>• Weight changes</li>
              <li>• Treatment procedures required</li>
              <li>• Daily medication use</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>⚠️ Barrett's Esophagus:</strong> Pre-cancerous condition requiring regular monitoring.
              Request biopsy and surveillance schedule from your provider.
            </p>
          </div>
        </div>
      </div>
  );
};

export default GERDComplicationsRatingCard;