// src/utils/haptics.js
// ============================================================
// Haptic feedback utility for native iOS and Android.
// All functions are silent no-ops on web/PWA — safe to call
// anywhere without platform checks at the call site.
//
// Uses the same globalThis/Capacitor plugin access pattern
// as nativeExport.js to prevent Vite build-time resolution.
// ============================================================

import { isNativePlatform } from './platformUtils';

// Cached plugin reference — loaded once on first call
let _haptics = null;

/**
 * Lazy-loads the Capacitor Haptics plugin.
 * Returns null on web — all callers must handle null gracefully.
 */
const getHaptics = async () => {
  if (!isNativePlatform()) return null;
  if (_haptics) return _haptics;
  try {
    const { Haptics } = await import('@capacitor/haptics');
    _haptics = Haptics;
    return _haptics;
  } catch {
    // Plugin not available (e.g. not synced yet) — fail silently
    return null;
  }
};

/**
 * Light impact — use for: quick log taps, checkbox toggles,
 * navigation taps, list item selections.
 */
export const hapticLight = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'LIGHT' }); } catch { /* silent */ }
};

/**
 * Medium impact — use for: modal opens, section expansions,
 * restore complete, profile switches.
 */
export const hapticMedium = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'MEDIUM' }); } catch { /* silent */ }
};

/**
 * Heavy impact — use for: panic key activation.
 */
export const hapticHeavy = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'HEAVY' }); } catch { /* silent */ }
};

/**
 * Success notification — use for: log saved, export complete,
 * medication logged, backup saved, profile created.
 */
export const hapticSuccess = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'SUCCESS' }); } catch { /* silent */ }
};

/**
 * Warning notification — use for: validation warnings,
 * partial success states.
 */
export const hapticWarning = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'WARNING' }); } catch { /* silent */ }
};

/**
 * Error notification — use for: save failed, import failed,
 * validation errors.
 */
export const hapticError = async () => {
  const H = await getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'ERROR' }); } catch { /* silent */ }
};