/**
 * photoMemory.js — Doc Bear's Symptom Vault
 *
 * App-wide registry of live photo object URLs, with teardown on background.
 *
 * THE PROBLEM
 *
 * URL.createObjectURL() pins its Blob until revoked. Components revoke on
 * unmount, which covers navigation but NOT backgrounding: switching apps or
 * locking the screen unmounts nothing. A Veteran who scrolls History past
 * fifty thumbnails and then switches apps is holding every one of those blobs
 * at precisely the moment Android starts looking for memory to reclaim.
 *
 * So this module tracks every photo URL the app creates, revokes them all when
 * the page hides, and tells mounted components to rebuild when it returns.
 *
 * WHY visibilitychange RATHER THAN @capacitor/app
 *
 * It fires for both backgrounding and screen lock, behaves identically in the
 * Capacitor WebView and on web, and adds no dependency. @capacitor/app gives
 * finer-grained native lifecycle events, which we don't need for this.
 */

import { photoTotalSize } from './db';
import { getActiveProfileId } from './profiles';

// Above this many bytes of stored photos, thumbnails stop pre-loading on mount
// and load on tap instead. Scoped at 200 MB to match the background bitmap
// threshold; a Veteran below it gets the faster experience.
export const PHOTO_MEMORY_THRESHOLD_BYTES = 200 * 1024 * 1024;

// Live object URLs, app-wide.
const liveUrls = new Set();

// Components that want to know when their URLs were revoked out from under
// them. Each is called with no arguments on resume.
const resetSubscribers = new Set();

let initialized = false;

/**
 * Create a photo object URL and register it for teardown.
 * Use this instead of URL.createObjectURL for anything photo-related.
 */
export const trackPhotoUrl = (blob) => {
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    liveUrls.add(url);
    return url;
};

/**
 * Revoke one URL and stop tracking it. Safe to call on an already-revoked URL.
 */
export const releaseTrackedUrl = (url) => {
    if (!url) return;
    liveUrls.delete(url);
    URL.revokeObjectURL(url);
};

/**
 * Revoke every tracked URL. Called on background; also safe to call manually.
 * @returns {number} how many were released
 */
export const releaseAllPhotoUrls = () => {
    const count = liveUrls.size;
    liveUrls.forEach(url => URL.revokeObjectURL(url));
    liveUrls.clear();
    return count;
};

/**
 * Subscribe to "your URLs are gone, rebuild when convenient".
 *
 * Deliberately NOT called on hide — a component that rebuilt at that moment
 * would re-pin the memory we're trying to free. Subscribers fire on RESUME,
 * and the expectation is that they mark themselves stale rather than reload
 * immediately, so fifty strips don't hit IndexedDB the instant the app
 * returns.
 *
 * @returns {Function} unsubscribe
 */
export const subscribeToPhotoReset = (fn) => {
    resetSubscribers.add(fn);
    return () => resetSubscribers.delete(fn);
};

/**
 * Attach the visibility listener. Call once from main.jsx.
 */
export const initPhotoMemoryManagement = () => {
    if (initialized) return;
    initialized = true;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const released = releaseAllPhotoUrls();
            if (released > 0) {
                console.log(`🧹 Released ${released} photo URL${released === 1 ? '' : 's'} on background`);
            }
        } else {
            // Resume: tell components their images are broken now.
            resetSubscribers.forEach(fn => {
                try { fn(); } catch (e) { console.error('Photo reset subscriber failed:', e); }
            });
        }
    });
};

/**
 * Whether this profile's photo library is large enough to defer thumbnails.
 *
 * Cached after the first call — the total only changes when a photo is added
 * or removed, and being one photo stale here has no consequence.
 */
let deferCache = null;
export const shouldDeferThumbnails = async (profileId = null) => {
    if (deferCache !== null) return deferCache;
    try {
        const id = profileId || getActiveProfileId();
        if (!id) return false;
        const bytes = await photoTotalSize(id);
        deferCache = bytes > PHOTO_MEMORY_THRESHOLD_BYTES;
        return deferCache;
    } catch {
        return false;
    }
};

/** Invalidate the cache after adding or deleting photos. */
export const resetDeferCache = () => { deferCache = null; };