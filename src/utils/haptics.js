// src/utils/haptics.js
// ============================================================
// Haptic feedback utility for native iOS and Android.
// Silent no-ops on web/PWA — safe to call anywhere without
// platform checks at the call site.
//
// Uses same window.Capacitor.Plugins pattern as nativeExport.js
// — no caching, no dynamic imports, no initialization race.
// ============================================================

import { isNativePlatform } from './platformUtils';

const getHaptics = () => {
  if (!isNativePlatform()) return null;
  const cap = globalThis?.Capacitor || window?.Capacitor;
  return cap?.Plugins?.Haptics || null;
};

/**
 * Light impact — symptom card taps, checkbox toggles,
 * navigation taps, list item selections.
 */
export const hapticLight = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'LIGHT' }); } catch { /* silent */ }
};

/**
 * Medium impact — modal opens, section expansions,
 * restore complete, profile switches.
 */
export const hapticMedium = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'MEDIUM' }); } catch { /* silent */ }
};

/**
 * Heavy impact — panic key activation.
 */
export const hapticHeavy = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.impact({ style: 'HEAVY' }); } catch { /* silent */ }
};

/**
 * Success notification — log saved, export complete,
 * medication logged, backup saved, profile created.
 */
export const hapticSuccess = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'SUCCESS' }); } catch { /* silent */ }
};

/**
 * Warning notification — validation warnings,
 * partial success states.
 */
export const hapticWarning = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'WARNING' }); } catch { /* silent */ }
};

/**
 * Error notification — save failed, import failed,
 * validation errors.
 */
export const hapticError = async () => {
  const H = getHaptics();
  if (!H) return;
  try { await H.notification({ type: 'ERROR' }); } catch { /* silent */ }
};