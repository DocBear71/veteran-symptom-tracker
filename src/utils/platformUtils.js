// src/utils/platformUtils.js
// ============================================================
// Platform detection and native capability routing.
// Keeps web behavior identical while enabling Capacitor
// features when running as a native iOS or Android app.
// ============================================================

/**
 * Returns true when running inside a Capacitor native shell
 * (iOS or Android app). False on web/PWA.
 */
export function isNativePlatform() {
  return (
      typeof window !== 'undefined' &&
      window.Capacitor !== undefined &&
      window.Capacitor.isNativePlatform?.() === true
  );
}

/**
 * Returns 'ios', 'android', or 'web'
 */
export function getPlatform() {
  if (typeof window === 'undefined') return 'web';
  if (!window.Capacitor) return 'web';
  return window.Capacitor.getPlatform?.() ?? 'web';
}

/**
 * Opens a URL.
 * - Web/PWA: opens in a new tab (standard behavior)
 * - iOS/Android: opens in Capacitor's in-app browser so Apple
 *   doesn't see navigation away from the app shell
 *
 * Usage: openExternalLink('https://www.va.gov/...')
 */
export async function openExternalLink(url) {
  if (!url) return;

  if (isNativePlatform()) {
    try {
      // Use globalThis to prevent Vite from resolving this at build time.
      // Capacitor attaches plugins to window — access directly when available.
      const Browser = globalThis?.Capacitor?.Plugins?.Browser;
      if (Browser?.open) {
        await Browser.open({ url, presentationStyle: 'popover' });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.warn('Capacitor Browser plugin not available, falling back:', err);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}