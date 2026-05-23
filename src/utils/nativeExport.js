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
export async function exportPDF(doc, filename) {
  if (isNativePlatform()) {
    try {
      // Access Capacitor plugins via globalThis to prevent Vite build-time resolution.
      // These plugins are registered on window.Capacitor.Plugins at runtime.
      const Filesystem = globalThis?.Capacitor?.Plugins?.Filesystem;
      const Share = globalThis?.Capacitor?.Plugins?.Share;

      if (!Filesystem || !Share) {
        throw new Error('Capacitor plugins not available');
      }

      const base64Data = doc.output('datauristring').split(',')[1];

      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: 'CACHE',
      });

      await Share.share({
        title: filename,
        url: writeResult.uri,
        dialogTitle: 'Save or share your report',
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
export async function exportTextFile(content, filename, mimeType = 'text/plain') {
  if (isNativePlatform()) {
    try {
      const Filesystem = globalThis?.Capacitor?.Plugins?.Filesystem;
      const Share = globalThis?.Capacitor?.Plugins?.Share;

      if (!Filesystem || !Share) {
        throw new Error('Capacitor plugins not available');
      }

      const base64Data = btoa(unescape(encodeURIComponent(content)));

      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: 'CACHE',
      });

      await Share.share({
        title: filename,
        url: writeResult.uri,
        dialogTitle: 'Save or share your file',
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
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}