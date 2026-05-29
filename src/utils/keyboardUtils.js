// src/utils/keyboardUtils.js
// ============================================================
// Keyboard handling for native iOS/Android.
// Scroll focused inputs into view when keyboard appears and
// fire custom events that Layout.jsx uses to hide the bottom
// nav (prevents the nav from floating above the keyboard).
//
// Safe to import on web — all calls are no-ops if Capacitor
// keyboard plugin is not present.
// ============================================================

import { isNativePlatform } from './platformUtils';

let _listenersAttached = false;

/**
 * Initialize keyboard listeners.
 * Call once on app startup (in main.jsx or App.jsx useEffect).
 * Idempotent — safe to call multiple times.
 */
export const initKeyboardHandling = () => {
  if (!isNativePlatform()) return;
  if (_listenersAttached) return;
  _listenersAttached = true;

  const cap = globalThis?.Capacitor || window?.Capacitor;
  const Keyboard = cap?.Plugins?.Keyboard;
  if (!Keyboard) return;

  // When keyboard opens — scroll focused element into view,
  // fire event so Layout can hide bottom nav
  Keyboard.addListener('keyboardWillShow', (info) => {
    window.dispatchEvent(new CustomEvent('vaultKeyboardShow', {
      detail: { height: info.keyboardHeight }
    }));

    // Give the DOM a moment to reflow before scrolling
    setTimeout(() => {
      const el = document.activeElement;
      if (el && el !== document.body) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  });

  // When keyboard closes — fire event so Layout restores bottom nav
  Keyboard.addListener('keyboardWillHide', () => {
    window.dispatchEvent(new CustomEvent('vaultKeyboardHide'));
  });
};

/**
 * Programmatically dismiss the keyboard.
 * Useful for "Done" buttons and form submissions.
 */
export const dismissKeyboard = () => {
  if (!isNativePlatform()) return;
  const cap = globalThis?.Capacitor || window?.Capacitor;
  cap?.Plugins?.Keyboard?.hide?.();
};