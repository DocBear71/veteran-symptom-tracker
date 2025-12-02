import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';

const App = () => {
    const [currentView, setCurrentView] = useState('log');

    const renderView = () => {
        switch (currentView) {
            case 'log':
                return <SymptomLogger onLogSaved={() => {}} />;
            case 'history':
                return <SymptomHistory />;
            case 'meds':
                return <Medications />;
            case 'trends':
                return <Trends />;
            case 'export':
                return <ExportData />;
            case 'settings':
                return <Settings />;
            default:
                return <SymptomLogger onLogSaved={() => {}} />;
        }
    };

    return (
        <ThemeProvider>
            <Layout currentView={currentView} onNavigate={setCurrentView}>
                {renderView()}
            </Layout>
        </ThemeProvider>
    );
};

export default App;