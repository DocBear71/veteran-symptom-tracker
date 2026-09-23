/**
 * LogPhotoStrip.jsx — Doc Bear's Symptom Vault
 *
 * Renders the photos attached to one symptom log as a thumbnail strip, with a
 * tap-to-enlarge viewer.
 *
 * OBJECT URL LIFECYCLE IS THE WHOLE PROBLEM HERE.
 *
 * URL.createObjectURL() pins its Blob in memory until the URL is revoked.
 * History can render hundreds of log cards, so a strip that creates URLs and
 * forgets them would hold every thumbnail the user has ever scrolled past for
 * the life of the session. Worse, the full-size viewer holds images roughly
 * ten times larger.
 *
 * So: every URL created here is revoked on unmount, and the viewer revokes its
 * full-size URL the moment it closes rather than waiting for unmount. The
 * `urlsRef` pattern is deliberate — state would go stale inside the cleanup
 * closure and revoke the wrong set.
 */

import { useState, useEffect, useRef } from 'react';
import { getPhotosForLog, createPhotoUrl, releasePhotoUrl } from '../utils/photoCapture';

const LogPhotoStrip = ({ logId, photoCount = 0 }) => {
    const [thumbs, setThumbs] = useState([]);
    const [viewing, setViewing] = useState(null); // { url, width, height, caption }
    const [loading, setLoading] = useState(false);

    // Holds the URLs we've created so cleanup can revoke exactly those.
    const urlsRef = useRef([]);

    useEffect(() => {
        // The parent only mounts this component for logs that have photos, but
        // guard anyway so a count of 0 never triggers a pointless IDB read.
        if (!logId || photoCount === 0) return;

        let cancelled = false;
        setLoading(true);

        (async () => {
            try {
                const records = await getPhotosForLog(logId);
                if (cancelled) return;

                const built = records.map(record => {
                    const url = createPhotoUrl(record.thumbBlob);
                    urlsRef.current.push(url);
                    return {
                        id: record.id,
                        url,
                        caption: record.caption || '',
                        // Kept so the viewer can fetch the full blob without a second
                        // round trip through getPhotosForLog.
                        fullBlob: record.blob,
                        width: record.width,
                        height: record.height,
                    };
                });

                setThumbs(built);
            } catch (error) {
                console.error(`❌ Failed to load photos for log "${logId}":`, error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
            urlsRef.current.forEach(releasePhotoUrl);
            urlsRef.current = [];
        };
    }, [logId, photoCount]);

    const handleOpen = (thumb) => {
        // Create the full-size URL only on open. Building these up front would
        // mean holding the full image for every photo on screen.
        const url = createPhotoUrl(thumb.fullBlob);
        setViewing({ url, caption: thumb.caption, width: thumb.width, height: thumb.height });
    };

    const handleClose = () => {
        if (viewing?.url) releasePhotoUrl(viewing.url);
        setViewing(null);
    };

    // Escape closes the viewer, and the revoke runs on unmount too in case the
    // whole card disappears while the viewer is open.
    useEffect(() => {
        if (!viewing) return;

        const onKey = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            window.removeEventListener('keydown', onKey);
            if (viewing?.url) releasePhotoUrl(viewing.url);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewing]);

    if (photoCount === 0) return null;

    return (
        <>
            <div className="flex flex-wrap gap-2 mt-2">
                {loading && thumbs.length === 0 && (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
                )}

                {thumbs.map(thumb => (
                    <button
                        key={thumb.id}
                        type="button"
                        onClick={() => handleOpen(thumb)}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                        aria-label={thumb.caption || 'View attached photo full size'}
                    >
                        <img
                            src={thumb.url}
                            alt={thumb.caption || 'Photo attached to this entry'}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {viewing && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Photo viewer"
                    onClick={handleClose}
                >
                    {/* stopPropagation so clicking the image itself doesn't close it */}
                    <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={viewing.url}
                            alt={viewing.caption || 'Attached photo'}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        {viewing.caption && (
                            <p className="text-sm text-white text-center mt-2">{viewing.caption}</p>
                        )}
                        <p className="text-xs text-gray-400 text-center mt-1">
                            {viewing.width} × {viewing.height}
                        </p>
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Close photo viewer"
                            className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-gray-900 text-xl font-bold leading-none shadow-lg"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogPhotoStrip;