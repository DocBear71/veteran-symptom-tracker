import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import {
  registerServiceWorker,
  shouldShowReminder,
  markReminderShown,
  showNotification,
  getNotificationPermission,
  getReminderSettings,
} from './utils/notifications';

function App() {
  const [currentView, setCurrentView] = useState('log');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    registerServiceWorker();

    const checkReminders = () => {
      const settings = getReminderSettings();
      if (settings.enabled && getNotificationPermission() === 'granted') {
        if (shouldShowReminder()) {
          showNotification(
              'Symptom Reminder',
              "Don't forget to log your symptoms today!"
          );
          markReminderShown();
        }
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {currentView === 'log' && (
            <SymptomLogger onLogSaved={handleLogSaved} />
        )}
        {currentView === 'history' && (
            <SymptomHistory key={refreshKey} />
        )}
        {currentView === 'meds' && (
            <Medications key={refreshKey} />
        )}
        {currentView === 'trends' && (
            <Trends key={refreshKey} />
        )}
        {currentView === 'export' && (
            <ExportData key={refreshKey} />
        )}
        {currentView === 'settings' && (
            <Settings />
        )}
      </Layout>
  );
}

export default App;