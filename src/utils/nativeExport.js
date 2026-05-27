// src/utils/nativeExport.js
// ============================================================
// Cross-platform file export utility.
//
// On web:    triggers browser download (existing behavior)
// On native: writes to app temp directory + triggers native
//            share sheet (iOS Files app, Android Downloads, etc.)
//
// jsPDF's doc.save() already works correctly on web.
// On iOS/Android we intercept before save() and use Capacitor.
// ============================================================

import { isNativePlatform } from './platformUtils';

/**
 * Export a jsPDF document natively or via browser download.
 *
 * @param {jsPDF} doc        - The jsPDF instance (already populated)
 * @param {string} filename  - Desired filename, e.g. 'report.pdf'
 */
export async function exportPDF(doc, filename, options = {}) {
  if (isNativePlatform()) {
    try {
      // Access Capacitor plugins via globalThis to prevent Vite build-time resolution.
      // These plugins are registered on window.Capacitor.Plugins at runtime.
      // Try both access patterns — Capacitor registers plugins differently
      // across versions and platforms
      const cap = globalThis?.Capacitor || window?.Capacitor;
      const Filesystem = cap?.Plugins?.Filesystem;
      const Share = cap?.Plugins?.Share;

      if (!Filesystem || !Share) {
        console.warn('Capacitor plugins not found, falling back to browser download');
        throw new Error('Capacitor plugins not available');
      }

      const base64Data = doc.output('datauristring').split(',')[1];

      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: 'CACHE',
      });

      // Always share via native share sheet.
      // On Android, user can choose Drive, Downloads app, etc.
      // 'Save to Device' just changes the dialog title to guide the user.
      await Share.share({
        title: filename,
        url: writeResult.uri,
        dialogTitle: options?.exportAction === 'save'
            ? 'Save your file — choose Downloads or Drive'
            : 'Share your report',
      });
    } catch (err) {
      console.error('Native PDF export failed, falling back to browser:', err);
      doc.save(filename);
    }
  } else {
    // Standard web behavior — unchanged
    doc.save(filename);
  }
}

/**
 * Export a text/JSON/CSV blob natively or via browser download.
 *
 * @param {string} content   - String content of the file
 * @param {string} filename  - Desired filename, e.g. 'backup.json'
 * @param {string} mimeType  - MIME type, e.g. 'application/json'
 */
export async function exportTextFile(content, filename, mimeType, options = {}) {
  if (isNativePlatform()) {
    try {
      const cap = globalThis?.Capacitor || window?.Capacitor;
      const Filesystem = cap?.Plugins?.Filesystem;
      const Share = cap?.Plugins?.Share;

      if (!Filesystem || !Share) {
        console.warn('Capacitor plugins not found, falling back to browser download');
        throw new Error('Capacitor plugins not available');
      }

      const base64Data = btoa(
          encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, (_, p1) =>
              String.fromCharCode(parseInt(p1, 16))
          )
      );

      // iOS: write to DOCUMENTS so files persist and can be restored.
      // Android: write to CACHE — share sheet handles saving to Downloads.
      const platform = cap?.getPlatform?.() ?? 'web';

      if (platform === 'android') {
        // Android: use custom FileSaver plugin to open native
        // "Save As" dialog (ACTION_CREATE_DOCUMENT) — true save to device
        try {
          const { saveFileToDevice } = await import('./fileSaver.js');
          await saveFileToDevice(base64Data, filename, mimeType);
          return;
        } catch (androidErr) {
          if (androidErr?.message === 'cancelled') return; // User cancelled — not an error
          console.warn('FileSaver plugin failed, falling back to share sheet:', androidErr);

          // Fallback: share sheet
          const writeResult = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: 'CACHE',
          });
          await Share.share({
            title: filename,
            url: writeResult.uri,
            dialogTitle: 'Save your backup file',
          });
          return;
        }
      }

      // iOS and Android fallback: use share sheet
      const directory = platform === 'ios' ? 'DOCUMENTS' : 'CACHE';
      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory,
      });

      await Share.share({
        title: filename,
        url: writeResult.uri,
        dialogTitle: options?.exportAction === 'save'
            ? 'Save your file — choose Downloads or Drive'
            : 'Share your file',
      });
    } catch (err) {
      console.error('Native file export failed, falling back to browser:', err);
      _browserDownload(content, filename, mimeType);
    }
  } else {
    _browserDownload(content, filename, mimeType);
  }
}

/**
 * Internal: standard browser anchor-click download (existing pattern).
 * Not exported — internal use only.
 */
function _browserDownload(content, filename, mimeType) {
  // Detect PWA standalone mode — blob anchor downloads don't work
  // in Android PWA standalone context, use showSaveFilePicker if available,
  // otherwise fall back to opening blob in new tab which triggers download
  const isPWA = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;

  const blob = new Blob([content], { type: mimeType });

  // Modern browsers (Chrome 86+) — File System Access API
  // Works in PWA and browser contexts
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: 'JSON Backup',
        accept: { [mimeType]: ['.json', '.csv', '.pdf'] },
      }],
    }).then(fileHandle => fileHandle.createWritable())
    .then(writable => {
      writable.write(blob);
      return writable.close();
    })
    .catch(err => {
      // User cancelled or error — fall through to blob download
      if (err.name !== 'AbortError') {
        _fallbackBlobDownload(blob, filename);
      }
    });
    return;
  }

  // PWA without File System Access API — open blob URL in new tab
  // Android will prompt to download when opened this way
  if (isPWA) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up after delay
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }

  // Standard browser — anchor click download
  _fallbackBlobDownload(blob, filename);
}

function _fallbackBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}