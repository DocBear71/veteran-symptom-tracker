/**
 * photoCapture.js — Doc Bear's Symptom Vault
 *
 * Capture, sanitize, compress, and store symptom photos.
 *
 * PRIVACY IS THE WHOLE POINT OF THIS FILE.
 *
 * A photo taken on a phone carries EXIF metadata, and that routinely includes
 * GPS coordinates accurate to a few meters — the Veteran's home address, in
 * practice. This app's promise is "100% local. No account. No ads." A photo
 * that silently carries the user's home coordinates into a PDF they email to a
 * VSO breaks that promise in a way they'd never see coming.
 *
 * So every image goes through a canvas re-encode before it is stored. Drawing
 * to a canvas and calling toBlob() produces pixels only — EXIF, GPS, device
 * make and model, and timestamps are all discarded as a side effect. There is
 * no code path in this module that stores an original file.
 *
 * The one thing we must preserve from EXIF is orientation. Phones record
 * portrait shots as landscape pixels plus a rotation flag; dropping that flag
 * without baking in the rotation turns every portrait photo sideways. That's
 * what `imageOrientation: 'from-image'` does below — rotate the pixels, then
 * throw the metadata away.
 */

// Camera plugin 8.1.0 replaced getPhoto with takePhoto / chooseFromGallery and
// removed CameraResultType and CameraSource. The old API still works but is
// slated for removal in a future major version.
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { getActiveProfileId } from './profiles';
import {
    photoPut,
    photoGet,
    photoGetByLogId,
    photoGetMetadataByProfile,
    photoDelete,
    photoDeleteByLogId,
    photoDeleteOrphans,
    photoTotalSize,
    photoCountByProfile,
} from './db';
import { trackPhotoUrl, releaseTrackedUrl, resetDeferCache } from './photoMemory';

// ─── Tuning ───────────────────────────────────────────────────────────────────

// Long edge of the stored image, in pixels. 1600 keeps a rash, a swollen
// joint, or a medication label clearly readable while landing most photos
// around 250-400 KB. Raising this is the single biggest lever on storage use.
const MAX_DIMENSION = 1600;

// JPEG quality for the stored image. 0.82 is the point where further
// reduction starts showing visible artifacts on skin tones, which matters
// when the photo is documenting a rash or discoloration.
const JPEG_QUALITY = 0.82;

// Thumbnails render in list views; they never need to be large.
const THUMB_DIMENSION = 240;
const THUMB_QUALITY = 0.7;

// Per-log cap. Three is enough to document a condition from more than one
// angle without a single log becoming a photo album.
export const MAX_PHOTOS_PER_LOG = 3;

// Reject anything implausibly large before decoding it. A 50 MB file is
// either not a photo or will blow up the decoder on a low-end device.
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// ─── Capture ──────────────────────────────────────────────────────────────────

/**
 * Open the camera or photo picker and return a raw Blob.
 *
 * Native: Capacitor Camera with CameraSource.Prompt, letting the user choose
 * between taking a photo and picking an existing one.
 *
 * Web: a hidden file input. The `capture` attribute is deliberately NOT set —
 * on desktop it does nothing, and on mobile web it would force the camera and
 * block picking an existing photo.
 *
 * @returns {Promise<Blob|null>} null when the user cancels
 */
/**
 * @param {'camera'|'gallery'} source - which to open on native.
 *   The plugin's old CameraSource.Prompt was removed in 8.1.0, so the caller
 *   now decides. On web both fall through to the same file input, which
 *   already lets the user pick either.
 */
export const capturePhoto = async (source = 'gallery') => {
    if (Capacitor.isNativePlatform()) {
        return captureNative(source);
    }
    return captureWeb();
};

const captureNative = async (source) => {
    try {
        // Ask only for what we're about to use, and only if we don't already hold
        // it. Requesting every time is a poor experience, and on iOS repeated
        // prompts get suppressed entirely.
        const needed = source === 'camera' ? 'camera' : 'photos';
        const status = await Camera.checkPermissions();
        if (status[needed] !== 'granted') {
            const requested = await Camera.requestPermissions({ permissions: [needed] });
            if (requested[needed] === 'denied') {
                throw new Error('PERMISSION_DENIED');
            }
        }

        // Plugin 8.1.0+ API. resultType is gone — MediaResult always carries
        // webPath. quality is a first-pass compression; we re-encode anyway, but
        // it keeps the intermediate file smaller on the way in.
        let webPath;
        if (source === 'camera') {
            const result = await Camera.takePhoto({ quality: 90 });
            // takePhoto returns a MediaResult directly; tolerate a wrapped shape
            // in case a future version aligns it with chooseFromGallery.
            webPath = result?.webPath || result?.results?.[0]?.webPath;
        } else {
            const { results } = await Camera.chooseFromGallery({ quality: 90, limit: 1 });
            webPath = results?.[0]?.webPath;
        }

        if (!webPath) return null;

        const response = await fetch(webPath);
        return await response.blob();
    } catch (error) {
        if (String(error?.message) === 'PERMISSION_DENIED') throw error;

        // The plugin throws on user cancel. 8.1.0+ adds structured errors with an
        // OS-PLUG-CAMR-XXXX code alongside a human-readable message, so match on
        // the message text rather than a code we can't verify across versions.
        const message = String(error?.message || error);
        if (/cancel/i.test(message)) return null;

        console.error('❌ Native photo capture failed:', error?.code || '', error);
        throw error;
    }
};

const captureWeb = () => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        // There is no cancel event on file inputs. If the user dismisses the
        // picker, this listener never fires and the promise would hang forever,
        // so window focus doubles as the cancel signal.
        let settled = false;

        const cleanup = () => {
            window.removeEventListener('focus', onFocus);
            if (input.parentNode) input.parentNode.removeChild(input);
        };

        const onFocus = () => {
            // The change event fires after focus returns, so give it a moment
            // before concluding the user cancelled.
            setTimeout(() => {
                if (!settled) {
                    settled = true;
                    cleanup();
                    resolve(null);
                }
            }, 500);
        };

        input.addEventListener('change', () => {
            settled = true;
            const file = input.files?.[0] || null;
            cleanup();
            resolve(file);
        });

        document.body.appendChild(input);
        window.addEventListener('focus', onFocus);
        input.click();
    });
};

// ─── Processing ───────────────────────────────────────────────────────────────

/**
 * Decode, orient, strip metadata, downscale, and re-encode.
 *
 * Returns both the full-size image and a thumbnail, plus dimensions. The
 * returned blobs contain NO metadata of any kind — canvas re-encoding emits
 * pixel data only.
 *
 * @param {Blob} sourceBlob
 * @returns {Promise<{ blob: Blob, thumbBlob: Blob, width: number, height: number, size: number }>}
 */
export const processImage = async (sourceBlob) => {
    if (!sourceBlob) throw new Error('No image provided');

    if (sourceBlob.size > MAX_SOURCE_BYTES) {
        throw new Error(`Image is too large (${formatBytes(sourceBlob.size)}). Maximum is ${formatBytes(MAX_SOURCE_BYTES)}.`);
    }

    if (sourceBlob.type && !ACCEPTED_TYPES.includes(sourceBlob.type.toLowerCase())) {
        throw new Error(`Unsupported image type: ${sourceBlob.type}`);
    }

    // 'from-image' reads the EXIF orientation flag and bakes the rotation into
    // the decoded pixels. Everything downstream works in already-upright space,
    // and the flag itself is discarded with the rest of the metadata.
    let bitmap;
    try {
        bitmap = await createImageBitmap(sourceBlob, { imageOrientation: 'from-image' });
    } catch (error) {
        console.error('❌ Image decode failed:', error);
        throw new Error('That file could not be read as an image.');
    }

    try {
        const full = await renderToBlob(bitmap, MAX_DIMENSION, JPEG_QUALITY);
        const thumb = await renderToBlob(bitmap, THUMB_DIMENSION, THUMB_QUALITY);

        return {
            blob: full.blob,
            thumbBlob: thumb.blob,
            width: full.width,
            height: full.height,
            size: full.blob.size,
        };
    } finally {
        // Release the decoded bitmap immediately. A 12 MP photo is ~48 MB
        // decoded, and holding several of those is how a low-end Android device
        // gets killed by the OS mid-session.
        bitmap.close?.();
    }
};

/**
 * Draw a bitmap to a canvas at a bounded size and encode as JPEG.
 * This is the step that discards all metadata.
 */
const renderToBlob = (bitmap, maxDimension, quality) => {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // JPEG has no alpha channel. Without a white fill, transparent regions of a
    // source PNG encode as black.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                // Free the backing store before resolving. Some engines hold onto
                // canvas memory well past the last reference otherwise.
                canvas.width = 0;
                canvas.height = 0;
                if (blob) resolve({ blob, width, height });
                else reject(new Error('Image encoding failed'));
            },
            'image/jpeg',
            quality
        );
    });
};

// ─── Storage ──────────────────────────────────────────────────────────────────

/**
 * Capture, process, and store one photo against a symptom log.
 *
 * @param {string} logId
 * @param {object} [options]
 * @param {Blob}   [options.sourceBlob] - skip capture and use this blob
 * @param {string} [options.caption]
 * @returns {Promise<object|null>} the stored record, or null if cancelled
 */
export const addPhotoToLog = async (logId, options = {}) => {
    if (!logId) throw new Error('A log ID is required to attach a photo');

    const profileId = getActiveProfileId();
    if (!profileId) throw new Error('No active profile');

    const existing = await photoGetByLogId(logId);
    if (existing.length >= MAX_PHOTOS_PER_LOG) {
        throw new Error(`This entry already has the maximum of ${MAX_PHOTOS_PER_LOG} photos.`);
    }

    const sourceBlob = options.sourceBlob || await capturePhoto(options.source || 'gallery');
    if (!sourceBlob) return null; // user cancelled

    const processed = await processImage(sourceBlob);

    const record = {
        id: crypto.randomUUID(),
        logId,
        profileId,
        blob: processed.blob,
        thumbBlob: processed.thumbBlob,
        size: processed.size,
        width: processed.width,
        height: processed.height,
        mimeType: 'image/jpeg',
        caption: (options.caption || '').trim(),
        createdAt: new Date().toISOString(),
    };

    const ok = await photoPut(record);
    if (!ok) throw new Error('Failed to save the photo.');

    return record;
};

/**
 * Turn a stored Blob into a URL for an <img> tag.
 *
 * ⚠️ Every URL from this function MUST be passed to releasePhotoUrl() when the
 * image unmounts. Object URLs pin their blob in memory until revoked, so a
 * gallery that creates and forgets them leaks the full decoded size of every
 * photo the user scrolls past.
 */
// These delegate to photoMemory so every photo URL in the app is tracked and
// can be torn down on background. Calling URL.createObjectURL directly for a
// photo anywhere else would create an untracked leak.
export const createPhotoUrl = (blob) => trackPhotoUrl(blob);
export const releasePhotoUrl = (url) => releaseTrackedUrl(url);

export const getPhotosForLog = (logId) => photoGetByLogId(logId);

export const removePhoto = (photoId) => photoDelete(photoId);

export const removePhotosForLog = (logId) => photoDeleteByLogId(logId);

/**
 * Photo metadata for a set of logs, WITHOUT the image data.
 *
 * Returns the scalar fields only, so a caller can decide how many photos it's
 * about to handle before loading any of them. The PDF export uses this to size
 * its section, then fetches each image one at a time via loadPhotoRecord()
 * rather than holding every blob in memory at once — forty photos decoded
 * simultaneously is how a claim export kills the tab.
 *
 * @param {Array} logs - symptom logs (objects with .id)
 * @returns {Promise<Array>} metadata sorted oldest first
 */
export const getPhotoMetadataForLogs = async (logs, profileId = null) => {
    const id = profileId || getActiveProfileId();
    if (!id) return [];

    const wanted = new Set((logs || []).map(l => l?.id).filter(Boolean));
    if (wanted.size === 0) return [];

    const all = await photoGetMetadataByProfile(id);
    return all
        .filter(p => wanted.has(p.logId))
        .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
};

/**
 * Load one full photo record, image data included. Call per photo, use it,
 * let it go.
 */
export const loadPhotoRecord = (photoId) => photoGet(photoId);

/**
 * Convert a stored image Blob into a data URL for jsPDF.
 *
 * jsPDF's addImage needs a data URL or a typed array; it can't take a Blob.
 * The images are already JPEG from the capture pipeline, so this is a
 * transport conversion with no re-encoding.
 */
export const photoBlobToDataURL = (blob) => new Promise((resolve, reject) => {
    if (!blob) { reject(new Error('No image data')); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image data'));
    reader.readAsDataURL(blob);
});

/**
 * Remove photos orphaned by a restore.
 *
 * Pass the symptom logs that exist AFTER the restore completes. Photos
 * pointing at any other log are deleted.
 *
 * @param {Array} logs - restored symptom logs (objects with .id)
 * @param {string} [profileId]
 * @returns {Promise<number>}
 */
export const purgeOrphanedPhotos = async (logs, profileId = null) => {
  const id = profileId || getActiveProfileId();
  if (!id) return 0;

  const validLogIds = new Set(
      (logs || []).map(log => log?.id).filter(Boolean)
  );

  return photoDeleteOrphans(id, validLogIds);
};

// ─── Staging ──────────────────────────────────────────────────────────────────
//
// A photo is taken BEFORE the symptom log exists, so there's no logId to
// attach it to yet. These three functions hold processed photos in component
// state until the log is saved, then write them all at once.
//
// Processing happens at stage time rather than commit time on purpose: the
// expensive decode and re-encode runs while the user is still filling out the
// form, so tapping Save doesn't stall on three image encodes.

/**
 * Capture and process a photo WITHOUT writing it to IndexedDB.
 *
 * The returned object carries a thumbUrl for immediate preview. That URL MUST
 * be released — via releaseStagedPhotos() — or it pins its blob in memory.
 *
 * @returns {Promise<object|null>} null if the user cancelled
 */
export const stagePhoto = async (source = 'gallery') => {
    const sourceBlob = await capturePhoto(source);
    if (!sourceBlob) return null;

    const processed = await processImage(sourceBlob);

    return {
        tempId: crypto.randomUUID(),
        blob: processed.blob,
        thumbBlob: processed.thumbBlob,
        size: processed.size,
        width: processed.width,
        height: processed.height,
        caption: '',
        thumbUrl: createPhotoUrl(processed.thumbBlob),
    };
};

/**
 * Write staged photos against a now-existing log.
 *
 * Writes are sequential rather than Promise.all — three concurrent blob writes
 * on a low-end device is a worse failure mode than three quick ones, and a
 * partial success here still leaves the Veteran with most of their photos.
 *
 * @returns {Promise<number>} how many were stored
 */
export const commitStagedPhotos = async (logId, staged = []) => {
    if (!logId || staged.length === 0) return 0;

    const profileId = getActiveProfileId();
    if (!profileId) throw new Error('No active profile');

    let saved = 0;
    for (const item of staged) {
        const ok = await photoPut({
            id: item.tempId,
            logId,
            profileId,
            blob: item.blob,
            thumbBlob: item.thumbBlob,
            size: item.size,
            width: item.width,
            height: item.height,
            mimeType: 'image/jpeg',
            caption: (item.caption || '').trim(),
            createdAt: new Date().toISOString(),
        });
            if (ok) saved++;
      }
      // The library grew; the defer threshold may have flipped.
      if (saved > 0) resetDeferCache();
      return saved;
};

/**
 * Revoke preview URLs for staged photos. Call on removal, after commit, and
 * on unmount — every path where staged photos stop being displayed.
 */
export const releaseStagedPhotos = (staged = []) => {
    staged.forEach(item => releasePhotoUrl(item.thumbUrl));
};

/**
 * Storage summary for the active profile. Used by Settings and by the
 * backup-inclusion toggle so the Veteran sees the cost before opting in.
 */
export const getPhotoStorageSummary = async (profileId = null) => {
    const id = profileId || getActiveProfileId();
    if (!id) return { count: 0, bytes: 0, formatted: '0 B' };

    const [count, bytes] = await Promise.all([
        photoCountByProfile(id),
        photoTotalSize(id),
    ]);

    return { count, bytes, formatted: formatBytes(bytes) };
};

export const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};