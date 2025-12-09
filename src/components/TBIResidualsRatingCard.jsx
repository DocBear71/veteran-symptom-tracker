import React from 'react';
import { Activity } from 'lucide-react';


const TBIResidualsRatingCard = () => {
  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Residuals of TBI
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Diagnostic Code:</strong> 8045-1 (38 CFR 4.124a)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              TBI residuals include ongoing cognitive, emotional, and physical symptoms after brain injury.
              Often rated the same as main TBI rating. Separate from diagnosed mental health conditions.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">VA Rating Levels:</h3>

            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20">
              <div className="font-bold text-gray-900 dark:text-white">100% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Total occupational and social impairment<br/>
                • Unable to perform activities of daily living
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20">
              <div className="font-bold text-gray-900 dark:text-white">70% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Occupational and social impairment in most areas<br/>
                • Memory loss, impaired judgment, severe mood disturbance
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="font-bold text-gray-900 dark:text-white">50% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Occupational and social impairment with reduced reliability<br/>
                • Memory problems, difficulty concentrating, mood issues
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20">
              <div className="font-bold text-gray-900 dark:text-white">30% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Occasional decrease in work efficiency<br/>
                • Mild memory loss, attention difficulties
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20">
              <div className="font-bold text-gray-900 dark:text-white">10% Rating</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                • Mild residual symptoms<br/>
                • Occasional cognitive or emotional difficulties
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Critical Documentation:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Neuropsychological testing (objective cognitive assessment)</li>
              <li>✓ Document specific functional impacts (work, relationships, daily tasks)</li>
              <li>✓ Track medication use for residual symptoms</li>
              <li>✓ Separate from diagnosed PTSD, depression, anxiety</li>
              <li>✓ Note changes from pre-injury baseline</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What to Track:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Memory problems (short-term, long-term)</li>
              <li>• Difficulty concentrating or multitasking</li>
              <li>• Confusion or disorientation</li>
              <li>• Emotional changes (irritability, mood swings)</li>
              <li>• Impact on work performance</li>
              <li>• Social withdrawal or relationship issues</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default TBIResidualsRatingCard;