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
      const cap = globalThis?.Capacitor || window?.Capacitor;
      const platform = cap?.getPlatform?.() ?? 'web';

      const base64Data = doc.output('datauristring').split(',')[1];

      if (platform === 'android') {
        // Android: route through FileSaverPlugin ACTION_CREATE_DOCUMENT.
        // Filesystem.writeFile passes the full base64 payload over the
        // Binder IPC bridge — crashes on PDFs larger than ~750KB encoded.
        // savePDFToDevice writes in ~256KB base64 chunks, decoded to bytes
        // in Java, so binary integrity is preserved and no size limit hit.
        try {
          const { savePDFToDevice } = await import('./fileSaver.js');
          await savePDFToDevice(base64Data, filename);
          return;
        } catch (androidErr) {
          if (androidErr?.message === 'cancelled') return;
          console.warn('FileSaver PDF failed, falling back to share sheet:', androidErr);
          // Fall through to share sheet below
        }
      }

      // iOS: write to CACHE and share via native share sheet → Files app
      const Filesystem = cap?.Plugins?.Filesystem;
      const Share = cap?.Plugins?.Share;

      if (!Filesystem || !Share) {
        console.warn('Capacitor plugins not found, falling back to browser download');
        throw new Error('Capacitor plugins not available');
      }

      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: 'CACHE',
      });

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
    // jsPDF's doc.save() uses <a download>, which iOS Safari ignores.
    // Route the PDF bytes through the same cross-browser save/share path
    // used for text files so iOS/Android web get a real file.
    const pdfBlob = doc.output('blob');
    return await _browserDownload(pdfBlob, filename, 'application/pdf');
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
        // "Save As" dialog (ACTION_CREATE_DOCUMENT) — true save to device.
        // Pass raw content string — saveFileToDevice handles chunked writing
        // internally. base64Data is not used on this path.
        try {
          const { saveFileToDevice } = await import('./fileSaver.js');
          await saveFileToDevice(content, filename, mimeType);
          return { success: true };
        } catch (androidErr) {
          if (androidErr?.message === 'cancelled') return { success: false, cancelled: true }; // User cancelled
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
          return { success: true };
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
      return { success: true };
    } catch (err) {
      console.error('Native file export failed, falling back to browser:', err);
      return await _browserDownload(content, filename, mimeType);
    }
  } else {
    return await _browserDownload(content, filename, mimeType);
  }
}

/**
 * Internal: standard browser anchor-click download (existing pattern).
 * Not exported — internal use only.
 */
async function _browserDownload(content, filename, mimeType) {
  // Detect PWA standalone mode — blob anchor downloads don't work reliably
  // in Android PWA standalone context.
  const isPWA = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;

  // If content is already a Blob (e.g. from jsPDF doc.output('blob')),
  // don't rewrap it — double-wrapping loses the MIME type on Android Chrome
  // and causes SecTrashProvider to append .json to the filename.
  // On Android Chrome, application/pdf blobs get intercepted by SecTrashProvider
  // which appends .json to the filename. Using application/octet-stream forces
  // the download through com.android.providers.media instead, while the .pdf
  // extension in the filename still tells the OS how to open it.
  const isAndroidChrome = /Android/.test(navigator.userAgent)
      && /Chrome/.test(navigator.userAgent)
      && !/wv/.test(navigator.userAgent);

  const effectiveMime = (isAndroidChrome && mimeType === 'application/pdf')
      ? 'application/octet-stream'
      : mimeType;

  const blob = content instanceof Blob
      ? (effectiveMime !== mimeType ? new Blob([content], { type: effectiveMime }) : content)
      : new Blob([content], { type: effectiveMime });

  // Desktop Chrome/Edge — File System Access API "Save As" dialog
  if (window.showSaveFilePicker) {
    try {
      // Build the accept map based on the actual file type being saved.
      // Samsung One UI 8.5 appends .json if the accept map lists multiple
      // extensions or uses a generic MIME — must be exact 1:1 mapping.
      const acceptMap = mimeType === 'application/pdf'
          ? { 'application/pdf': ['.pdf'] }
          : mimeType === 'text/csv'
              ? { 'text/csv': ['.csv'] }
              : { 'application/json': ['.json'] };

      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: mimeType === 'application/pdf' ? 'PDF Document'
              : mimeType === 'text/csv' ? 'CSV Spreadsheet'
                  : 'JSON Backup',
          accept: acceptMap,
        }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { success: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, cancelled: true }; // user closed the Save dialog
      }
      // any other error — fall through to the paths below
    }
  }

  const shareFile = new File([content], filename, { type: effectiveMime });
  if (!isAndroidChrome && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
    try {
      await navigator.share({ files: [shareFile], title: filename });
      return { success: true };
    } catch (err) {
      if (err && err.name === 'AbortError') {
        return { success: false, cancelled: true }; // user dismissed the share sheet
      }
      // any other share error — fall through to legacy paths
    }
  }

  // PWA without File System Access API — open blob URL in new tab
  if (isPWA) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return { success: true };
  }

  // Standard browser — anchor click download
  _fallbackBlobDownload(blob, filename);
  return { success: true };
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