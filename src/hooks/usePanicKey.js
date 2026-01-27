/**
 * usePanicKey.js
 *
 * Safety feature: Quick exit from the app.
 * - Desktop: Triple-tap Escape key within 1 second
 * - Mobile: Triple-tap anywhere on screen within 1 second
 *
 * Redirects to a neutral site (default: Google) to protect privacy.
 *
 * Usage:
 *   import usePanicKey from '../hooks/usePanicKey';
 *
 *   function Layout() {
 *     usePanicKey(); // Uses default redirect to Google
 *     // or
 *     usePanicKey('https://www.weather.com'); // Custom redirect
 *   }
 */

import { useEffect, useRef } from 'react';

export default function usePanicKey(redirectUrl = 'https://www.google.com') {
  const escapeCountRef = useRef(0);
  const tapCountRef = useRef(0);
  const escapeTimerRef = useRef(null);
  const tapTimerRef = useRef(null);
  const lastTapTimeRef = useRef(0);

  useEffect(() => {
    // ============================================
    // DESKTOP: Triple-tap Escape key
    // ============================================
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        escapeCountRef.current++;

        // Clear existing timer
        if (escapeTimerRef.current) {
          clearTimeout(escapeTimerRef.current);
        }

        // Check if we've hit 3 taps
        if (escapeCountRef.current >= 3) {
          // Exit immediately
          window.location.href = redirectUrl;
          return;
        }

        // Reset counter after 1 second of no taps
        escapeTimerRef.current = setTimeout(() => {
          escapeCountRef.current = 0;
        }, 1000);
      }
    };

    // ============================================
    // MOBILE: Triple-tap anywhere on screen
    // ============================================
    const handleTouchStart = (e) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTimeRef.current;

      // If taps are within 500ms of each other, count them
      if (timeSinceLastTap < 500) {
        tapCountRef.current++;
      } else {
        // Too slow, reset counter
        tapCountRef.current = 1;
      }

      lastTapTimeRef.current = now;

      // Clear existing timer
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }

      // Check if we've hit 3 taps
      if (tapCountRef.current >= 3) {
        // Exit immediately
        window.location.href = redirectUrl;
        return;
      }

      // Reset counter after 1 second of no taps
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 1000);
    };

    // ============================================
    // ALTERNATIVE: Click handler for desktop testing
    // Only counts rapid clicks (not normal navigation)
    // ============================================
    let clickCount = 0;
    let clickTimer = null;
    let lastClickTime = 0;

    const handleClick = (e) => {
      // Ignore clicks on interactive elements (buttons, links, inputs)
      const tagName = e.target.tagName.toLowerCase();
      const isInteractive = ['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tagName) ||
          e.target.closest('button') ||
          e.target.closest('a') ||
          e.target.closest('input') ||
          e.target.closest('select');

      if (isInteractive) {
        return; // Don't count clicks on interactive elements
      }

      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;

      // If clicks are within 400ms of each other, count them
      if (timeSinceLastClick < 400) {
        clickCount++;
      } else {
        clickCount = 1;
      }

      lastClickTime = now;

      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      // Check if we've hit 3 rapid clicks
      if (clickCount >= 3) {
        window.location.href = redirectUrl;
        return;
      }

      // Reset counter after 1 second
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    // Uncomment below if you want triple-click to work on desktop too
    // window.addEventListener('click', handleClick);

    // Log initialization (remove in production if desired)
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ Panic key initialized:');
      console.log('   Desktop: Triple-tap Escape key');
      console.log('   Mobile: Triple-tap anywhere on screen');
    }

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      // window.removeEventListener('click', handleClick);

      if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [redirectUrl]);
}

/**
 * Optional: Hook that returns panic trigger function
 * Use this if you want to add a manual panic button
 */
export function usePanicTrigger(redirectUrl = 'https://www.google.com') {
  const triggerPanic = () => {
    window.location.href = redirectUrl;
  };

  return triggerPanic;
}