import { useState } from 'react';
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import ExportData from './components/ExportData';

function App() {
  const [currentView, setCurrentView] = useState('log');
  const [refreshKey, setRefreshKey] = useState(0);

  // Force history to refresh when new log is added
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
        {currentView === 'export' && (
            <ExportData key={refreshKey} />
        )}
      </Layout>
  );
}

export default App;