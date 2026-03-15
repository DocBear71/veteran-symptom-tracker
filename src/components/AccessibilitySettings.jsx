/**
 * AccessibilitySettings.jsx
 *
 * Accessibility settings panel component for the Settings page.
 * Provides controls for:
 * - Font size adjustment
 * - High contrast mode
 * - Reduced motion preferences
 * - Screen reader optimizations
 *
 * V2.5 User Experience Improvements
 */

import { useState } from 'react';
import {
  Eye,
  Type,
  Minimize2,
  Volume2,
  Check,
  RotateCcw,
  Info
} from 'lucide-react';
import {
  FONT_SIZE_OPTIONS,
  DEFAULT_SETTINGS,
  getAccessibilitySettings,
  saveAccessibilitySettings,
  applyAccessibilitySettings,
} from '../utils/accessibilityUtils';

// ============================================
// MAIN COMPONENT
// ============================================
const AccessibilitySettings = ({ embedded = false }) => {
  const [settings, setSettings] = useState(() => {
    const loaded = getAccessibilitySettings();
    applyAccessibilitySettings(loaded);
    return loaded;
  });
  const [showSaved, setShowSaved] = useState(false);

  // Update setting handler
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveAccessibilitySettings(newSettings);
    applyAccessibilitySettings(newSettings);

    // Show saved indicator
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    saveAccessibilitySettings(DEFAULT_SETTINGS);
    applyAccessibilitySettings(DEFAULT_SETTINGS);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Get current font size option for preview
  const currentFontSize = FONT_SIZE_OPTIONS.find(f => f.id === settings.fontSize) || FONT_SIZE_OPTIONS[1];

  if (embedded) {
    return (
        <div className="p-4 space-y-6">
          {/* Saved indicator - floating */}
          {showSaved && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm justify-end">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
          )}

          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <label className="font-medium text-gray-900 dark:text-white">
                Text Size
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZE_OPTIONS.map((option) => (
                  <button
                      key={option.id}
                      onClick={() => updateSetting('fontSize', option.id)}
                      className={`px-3 py-2 rounded-lg border-2 transition-colors text-center ${
                          settings.fontSize === option.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-pressed={settings.fontSize === option.id}
                  >
                <span
                    className="block font-medium"
                    style={{ fontSize: `${14 * option.scale}px` }}
                >
                  Aa
                </span>
                    <span className="text-xs mt-1 block">{option.label}</span>
                  </button>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p
                  className="text-gray-700 dark:text-gray-300"
                  style={{ fontSize: currentFontSize.value }}
              >
                Preview: This is how text will appear throughout the app.
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="w-6 h-6 rounded border-2 border-black dark:border-white bg-white dark:bg-black" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  High Contrast Mode
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Increase contrast for better visibility
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.highContrast
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="Toggle high contrast mode"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Reduce Motion
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Minimize animations and transitions
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reducedMotion
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="Toggle reduced motion"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Screen Reader Optimizations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Screen Reader Optimized
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enhanced labels and focus indicators
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('screenReaderOptimized', !settings.screenReaderOptimized)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.screenReaderOptimized
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.screenReaderOptimized}
                aria-label="Toggle screen reader optimizations"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Tips for better accessibility:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>Use your device's built-in zoom for additional magnification</li>
                <li>Enable dark mode in appearance settings for reduced eye strain</li>
                <li>All interactive elements are keyboard accessible</li>
              </ul>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-2">
            <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to defaults
            </button>
          </div>
        </div>
    );
  }



  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Accessibility
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize your viewing experience
              </p>
            </div>
          </div>

          {/* Saved indicator */}
          {showSaved && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
          )}
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">

          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <label className="font-medium text-gray-900 dark:text-white">
                Text Size
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZE_OPTIONS.map((option) => (
                  <button
                      key={option.id}
                      onClick={() => updateSetting('fontSize', option.id)}
                      className={`px-3 py-2 rounded-lg border-2 transition-colors text-center ${
                          settings.fontSize === option.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-pressed={settings.fontSize === option.id}
                  >
                <span
                    className="block font-medium"
                    style={{ fontSize: `${14 * option.scale}px` }}
                >
                  Aa
                </span>
                    <span className="text-xs mt-1 block">{option.label}</span>
                  </button>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p
                  className="text-gray-700 dark:text-gray-300"
                  style={{ fontSize: currentFontSize.value }}
              >
                Preview: This is how text will appear throughout the app.
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="w-6 h-6 rounded border-2 border-black dark:border-white bg-white dark:bg-black" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  High Contrast Mode
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Increase contrast for better visibility
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.highContrast
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="Toggle high contrast mode"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Reduce Motion
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Minimize animations and transitions
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reducedMotion
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="Toggle reduced motion"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Screen Reader Optimizations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Screen Reader Optimized
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enhanced labels and focus indicators
                </p>
              </div>
            </div>

            <button
                onClick={() => updateSetting('screenReaderOptimized', !settings.screenReaderOptimized)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.screenReaderOptimized
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.screenReaderOptimized}
                aria-label="Toggle screen reader optimizations"
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Tips for better accessibility:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>Use your device's built-in zoom for additional magnification</li>
                <li>Enable dark mode in appearance settings for reduced eye strain</li>
                <li>All interactive elements are keyboard accessible</li>
              </ul>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-2">
            <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
  );
};

export default AccessibilitySettings;