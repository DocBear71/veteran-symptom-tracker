// src/utils/fileSaver.js
// ============================================================
// JS bridge for the custom Android FileSaverPlugin.
// Writes content to a Capacitor CACHE temp file first to avoid
// Android's TransactionTooLargeException (1MB Bundle limit),
// then passes only the file path to the native plugin which
// opens ACTION_CREATE_DOCUMENT "Save As" dialog.
// ============================================================

/**
 * Opens Android's native Save As dialog and writes the file
 * to the user-chosen location.
 *
 * @param {string} base64Data  - Base64-encoded file content
 * @param {string} filename    - Suggested filename
 * @param {string} mimeType    - MIME type e.g. 'application/json'
 */
export async function saveFileToDevice(content, filename, mimeType = 'application/octet-stream') {
  const cap = globalThis?.Capacitor || window?.Capacitor;
  const FileSaver = cap?.Plugins?.FileSaver;

  if (!FileSaver) {
    throw new Error('FileSaver plugin not available');
  }

  // Write content to cache in 512KB UTF-8 chunks via native plugin.
  // Avoids Filesystem.writeFile which passes the full payload across
  // Android's Binder IPC bridge (~1MB hard limit) causing a crash on
  // large backups. No base64 encoding — plain UTF-8 chunks only.
  const CHUNK_SIZE = 512 * 1024; // 512KB — safe under Binder limit
  const tempFilename = `temp_${Date.now()}_${filename}`;
  const totalChunks = Math.ceil(content.length / CHUNK_SIZE);

  let tempPath = null;
  for (let i = 0; i < totalChunks; i++) {
    const chunk = content.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const result = await FileSaver.writeFileChunk({
      filename: tempFilename,
      chunk,
      chunkIndex: i,
      totalChunks,
    });
    // Plugin returns absolute path on every chunk — capture it
    if (result?.path) tempPath = result.path;
  }

  if (!tempPath) {
    throw new Error('Failed to get temp file path after chunked write');
  }

  // Open native Save As dialog — passes only the file path, not content
  return await FileSaver.saveFile({
    filename,
    tempPath,
    mimeType,
  });
}

/**
 * Saves a PDF to device using chunked base64 binary writes.
 * jsPDF outputs base64 — we split it into chunks and decode
 * each one to bytes in Java, avoiding UTF-8 corruption of
 * binary data and staying under the Binder IPC limit.
 *
 * @param {string} base64Data - Raw base64 string (no data URI prefix)
 * @param {string} filename   - Suggested filename e.g. 'report.pdf'
 */
export async function savePDFToDevice(base64Data, filename) {
  const cap = globalThis?.Capacitor || window?.Capacitor;
  const FileSaver = cap?.Plugins?.FileSaver;

  if (!FileSaver) {
    throw new Error('FileSaver plugin not available');
  }

  // Split base64 string into ~256KB chunks (base64 chars, not bytes).
  // Each chunk decodes to ~192KB of binary — well under the Binder limit.
  // Must be a multiple of 4 to keep base64 block alignment intact.
  const CHUNK_SIZE = 256 * 1024; // 256KB of base64 chars per chunk
  const tempFilename = `temp_${Date.now()}_${filename}`;
  const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);

  let tempPath = null;
  for (let i = 0; i < totalChunks; i++) {
    const chunk = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const result = await FileSaver.writeFileChunkBinary({
      filename: tempFilename,
      chunk,
      chunkIndex: i,
      totalChunks,
    });
    if (result?.path) tempPath = result.path;
  }

  if (!tempPath) {
    throw new Error('Failed to get temp file path after chunked binary write');
  }

  // Open native Save As dialog — file path only, no data over the bridge
  return await FileSaver.saveFile({
    filename,
    tempPath,
    mimeType: 'application/pdf',
  });
}

/**
 * Opens Android's native file picker and reads the selected file.
 * Returns the file content as a string.
 *
 * @param {string} mimeType - MIME type filter e.g. 'application/json'
 * @returns {Promise<{content: string, uri: string}>}
 */
export async function openFileFromDevice(mimeType = 'application/octet-stream') {
  const cap = globalThis?.Capacitor || window?.Capacitor;
  const FilePicker = cap?.Plugins?.FilePicker;
  const FileSaver = cap?.Plugins?.FileSaver;

  if (!FilePicker) {
    throw new Error('FilePicker plugin not available');
  }

  // Step 1: Use file picker WITHOUT readData — just get the content:// URI.
  // Passing large file data through the JS bridge causes OOM on 48MB+ files.
  const result = await FilePicker.pickFiles({
    types: [mimeType],
    multiple: false,
    readData: false,
  });

  if (!result?.files?.length) {
    throw new Error('cancelled');
  }

  const uri = result.files[0].path;
  if (!uri) {
    throw new Error('Could not get file URI from picker');
  }

  // Step 2: Read file in 3MB chunks via native plugin to avoid OOM.
  // Each chunk is read from a cached copy of the file and returned
  // as plain UTF-8 — no base64 inflation, no single large allocation.
  if (FileSaver) {
    let content = '';
    let chunkIndex = 0;
    let done = false;

    while (!done) {
      const chunk = await FileSaver.readFileChunk({ uri, chunkIndex });
      content += chunk.text;
      done = chunk.done;
      chunkIndex++;
    }

    return { content, uri };
  }

  throw new Error('FileSaver plugin not available for reading');
}