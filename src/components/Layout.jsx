import { useProfile } from '../hooks/useProfile';

// Main layout wrapper with header and navigation
const Layout = ({ children, currentView, onNavigate }) => {
  const { labels, features, isVeteran } = useProfile();

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-blue-900 dark:bg-gray-800 text-white shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">{labels.appTitle}</h1>
            <p className="text-blue-200 dark:text-gray-400 text-sm">{labels.appSubtitle}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6 pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-lg mx-auto flex">
            <NavButton
                icon="➕"
                label="Log"
                view="log"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📋"
                label="History"
                view="history"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="💊"
                label="Meds"
                view="meds"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📈"
                label="Trends"
                view="trends"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📤"
                label="Export"
                view="export"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="⚙️"
                label="Settings"
                view="settings"
                currentView={currentView}
                onNavigate={onNavigate}
            />
          </div>
        </nav>
      </div>
  );
};

// Navigation button component
const NavButton = ({ icon, label, view, currentView, onNavigate }) => {
  const isActive = currentView === view;

  return (
      <button
          onClick={() => onNavigate(view)}
          className={`flex-1 py-3 text-center transition-colors ${
              isActive
                  ? 'text-blue-900 dark:text-blue-400 border-t-2 border-blue-900 dark:border-blue-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
      >
        <span className="block text-lg">{icon}</span>
        <span className="text-xs">{label}</span>
      </button>
  );
};

export default Layout;