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
  try {
    const cap = (typeof window !== 'undefined' && window.Capacitor)
        || globalThis?.Capacitor;
    if (!cap) return false;

    // Capacitor v3+ preferred method
    if (typeof cap.isNativePlatform === 'function') {
      return cap.isNativePlatform();
    }
    // Capacitor v2 fallback
    if (typeof cap.platform === 'string') {
      return cap.platform !== 'web';
    }
    // Last resort — Filesystem plugin only exists in native shell
    return !!(cap.Plugins?.Filesystem);
  } catch {
    return false;
  }
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