import { PenLine, BarChart3, History, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'log', label: 'Log', icon: PenLine },
    { id: 'evidence', label: 'Evidence', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'More', icon: Settings },
  ];

  return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800
                    border-t border-gray-200 dark:border-gray-700
                    md:hidden z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center w-full h-full
                         transition-colors ${
                        isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-2' : ''}`} />
                  <span className="text-xs mt-1">{tab.label}</span>
                </button>
            );
          })}
        </div>
      </nav>
  );
}