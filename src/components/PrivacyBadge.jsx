import { Shield, Cloud, Bot } from 'lucide-react';

export default function PrivacyBadge({ compact = false }) {
  if (compact) {
    return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100
                      dark:bg-green-900/30 text-green-800 dark:text-green-300
                      rounded-full text-xs font-medium">
          <Shield className="w-3 h-3" />
          <span>Private</span>
        </div>
    );
  }

  return (
      <div className="flex items-center gap-3 px-3 py-2 bg-green-50
                    dark:bg-green-900/20 border border-green-200
                    dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-1 text-green-700 dark:text-green-400">
          <Cloud className="w-4 h-4" />
          <span className="text-xs">No Cloud</span>
        </div>
        <div className="flex items-center gap-1 text-green-700 dark:text-green-400">
          <Bot className="w-4 h-4" />
          <span className="text-xs">No AI</span>
        </div>
        <div className="flex items-center gap-1 text-green-700 dark:text-green-400">
          <Shield className="w-4 h-4" />
          <span className="text-xs">100% Local</span>
        </div>
      </div>
  );
}