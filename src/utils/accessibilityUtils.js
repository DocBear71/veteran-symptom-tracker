// ============================================
// ACCESSIBILITY UTILITIES
// Extracted from AccessibilitySettings.jsx for react-refresh compatibility
// ============================================

const STORAGE_KEY = 'symptomTracker_accessibility';

export const FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '14px', scale: 0.875 },
  { id: 'medium', label: 'Medium', value: '16px', scale: 1 },
  { id: 'large', label: 'Large', value: '18px', scale: 1.125 },
  { id: 'xl', label: 'Extra Large', value: '20px', scale: 1.25 },
];

export const DEFAULT_SETTINGS = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
};

export const getAccessibilitySettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading accessibility settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const saveAccessibilitySettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('accessibilityChanged', { detail: settings }));
    return true;
  } catch (error) {
    console.error('Error saving accessibility settings:', error);
    return false;
  }
};

export const applyAccessibilitySettings = (settings) => {
  const root = document.documentElement;

  const fontOption = FONT_SIZE_OPTIONS.find(f => f.id === settings.fontSize);
  if (fontOption) {
    root.style.setProperty('--base-font-size', fontOption.value);
    root.style.fontSize = fontOption.value;
  }

  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  if (settings.reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }

  if (settings.screenReaderOptimized) {
    root.classList.add('sr-optimized');
  } else {
    root.classList.remove('sr-optimized');
  }
};

export const initializeAccessibility = () => {
  const settings = getAccessibilitySettings();
  applyAccessibilitySettings(settings);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && !settings.reducedMotion) {
    const updatedSettings = { ...settings, reducedMotion: true };
    saveAccessibilitySettings(updatedSettings);
    applyAccessibilitySettings(updatedSettings);
  }

  return settings;
};