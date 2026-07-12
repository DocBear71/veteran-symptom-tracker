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
export async function saveFileToDevice(base64Data, filename, mimeType = 'application/octet-stream') {
  const cap = globalThis?.Capacitor || window?.Capacitor;
  const FileSaver = cap?.Plugins?.FileSaver;
  const Filesystem = cap?.Plugins?.Filesystem;

  if (!FileSaver || !Filesystem) {
    throw new Error('Required plugins not available');
  }

  // Step 1: Write to temp file in CACHE to avoid passing large
  // data through the Android activity Bundle (1MB limit)
  const tempFilename = `temp_${Date.now()}_${filename}`;

  await Filesystem.writeFile({
    path: tempFilename,
    data: base64Data,
    directory: 'CACHE',
  });

  // Step 2: Get the absolute path of the temp file
  const { uri: tempUri } = await Filesystem.getUri({
    path: tempFilename,
    directory: 'CACHE',
  });

  // Convert content:// or file:// URI to actual file path
  // Capacitor returns file:///data/... style URIs on Android
  const tempPath = tempUri.replace('file://', '');

  // Step 3: Open native Save As dialog — only the path is passed,
  // not the data, so no Bundle overflow
  return await FileSaver.saveFile({
    filename,
    tempPath,
    mimeType,
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