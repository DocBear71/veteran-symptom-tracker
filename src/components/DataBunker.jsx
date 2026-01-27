import { Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function DataBunker() {
  const [lastBackup, setLastBackup] = useState(
      localStorage.getItem('lastBackupDate')
  );

  const handleExportBunker = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      appVersion: '2.0.0', // Update dynamically
      data: {
        symptomLogs: JSON.parse(localStorage.getItem('symptomLogs') || '[]'),
        chronicSymptoms: JSON.parse(localStorage.getItem('chronicSymptoms') || '[]'),
        serviceConnectedConditions: JSON.parse(
            localStorage.getItem('serviceConnectedConditions') || '[]'
        ),
        medications: JSON.parse(localStorage.getItem('medications') || '[]'),
        measurements: JSON.parse(localStorage.getItem('measurements') || '[]'),
        appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
        profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
        settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const now = new Date().toISOString();
    localStorage.setItem('lastBackupDate', now);
    setLastBackup(now);
  };

  const handleImportBunker = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate structure
        if (!imported.version || !imported.data) {
          throw new Error('Invalid backup file format');
        }

        // Confirm before overwriting
        if (!confirm('This will replace all your current data. Are you sure?')) {
          return;
        }

        // Restore each data type
        const { data } = imported;
        if (data.symptomLogs)
          localStorage.setItem('symptomLogs', JSON.stringify(data.symptomLogs));
        if (data.chronicSymptoms)
          localStorage.setItem('chronicSymptoms', JSON.stringify(data.chronicSymptoms));
        if (data.serviceConnectedConditions)
          localStorage.setItem('serviceConnectedConditions',
              JSON.stringify(data.serviceConnectedConditions));
        if (data.medications)
          localStorage.setItem('medications', JSON.stringify(data.medications));
        if (data.measurements)
          localStorage.setItem('measurements', JSON.stringify(data.measurements));
        if (data.appointments)
          localStorage.setItem('appointments', JSON.stringify(data.appointments));
        if (data.profile)
          localStorage.setItem('userProfile', JSON.stringify(data.profile));
        if (data.settings)
          localStorage.setItem('appSettings', JSON.stringify(data.settings));

        alert('Data restored successfully! The page will now reload.');
        window.location.reload();
      } catch (error) {
        alert('Error reading backup file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const daysSinceBackup = lastBackup
      ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
      : null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              The Bunker
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crash-proof backup system
            </p>
          </div>
        </div>

        {/* Warning if no recent backup */}
        {(daysSinceBackup === null || daysSinceBackup > 7) && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200
                        dark:border-amber-800 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400
                                       flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {daysSinceBackup === null
                        ? "You haven't created a backup yet!"
                        : `Last backup was ${daysSinceBackup} days ago`}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Your data only exists in this browser. Export a backup now!
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* Last backup info */}
        {lastBackup && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Last backup: {new Date(lastBackup).toLocaleDateString()} at{' '}
              {new Date(lastBackup).toLocaleTimeString()}
            </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
              onClick={handleExportBunker}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     bg-green-600 hover:bg-green-700 text-white rounded-lg
                     font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Save Backup
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                          bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                          font-medium cursor-pointer transition-colors">
            <Upload className="w-5 h-5" />
            Restore Backup
            <input
                type="file"
                accept=".json"
                onChange={handleImportBunker}
                className="hidden"
            />
          </label>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Save backup files to your computer, cloud storage, or USB drive
        </p>
      </div>
  );
}