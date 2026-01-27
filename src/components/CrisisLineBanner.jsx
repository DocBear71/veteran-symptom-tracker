import { Phone, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

export default function CrisisLineBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
      <div className="bg-red-700 text-white px-4 py-2 text-sm flex items-center
                    justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium">Veterans Crisis Line:</span>
          <a href="tel:988" className="flex items-center gap-1 hover:underline">
            <Phone className="w-4 h-4" />
            Call 988, Press 1
          </a>
          <a href="sms:838255" className="flex items-center gap-1 hover:underline">
            <MessageSquare className="w-4 h-4" />
            Text 838255
          </a>
          <span className="text-red-200">Chat online 24/7</span>
        </div>
        <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-red-600 rounded"
            aria-label="Dismiss crisis line banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
  );
}