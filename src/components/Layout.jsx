// Main layout wrapper with header and navigation
const Layout = ({ children, currentView, onNavigate }) => {
  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Veteran Symptom Tracker</h1>
            <p className="text-blue-200 text-sm">Track your daily symptoms</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-lg mx-auto flex">
            <button
                onClick={() => onNavigate('log')}
                className={`flex-1 py-3 text-center ${
                    currentView === 'log'
                        ? 'text-blue-900 border-t-2 border-blue-900 font-semibold'
                        : 'text-gray-500'
                }`}
            >
              <span className="block text-xl">➕</span>
              <span className="text-xs">Log</span>
            </button>
            <button
                onClick={() => onNavigate('history')}
                className={`flex-1 py-3 text-center ${
                    currentView === 'history'
                        ? 'text-blue-900 border-t-2 border-blue-900 font-semibold'
                        : 'text-gray-500'
                }`}
            >
              <span className="block text-xl">📋</span>
              <span className="text-xs">History</span>
            </button>
            <button
                onClick={() => onNavigate('trends')}
                className={`flex-1 py-3 text-center ${
                    currentView === 'trends'
                        ? 'text-blue-900 border-t-2 border-blue-900 font-semibold'
                        : 'text-gray-500'
                }`}
            >
              <span className="block text-xl">📈</span>
              <span className="text-xs">Trends</span>
            </button>
            <button
                onClick={() => onNavigate('export')}
                className={`flex-1 py-3 text-center ${
                    currentView === 'export'
                        ? 'text-blue-900 border-t-2 border-blue-900 font-semibold'
                        : 'text-gray-500'
                }`}
            >
              <span className="block text-xl">📤</span>
              <span className="text-xs">Export</span>
            </button>
            <button
                onClick={() => onNavigate('settings')}
                className={`flex-1 py-3 text-center ${
                    currentView === 'settings'
                        ? 'text-blue-900 border-t-2 border-blue-900 font-semibold'
                        : 'text-gray-500'
                }`}
            >
              <span className="block text-xl">⚙️</span>
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </nav>
      </div>
  );
};

export default Layout;