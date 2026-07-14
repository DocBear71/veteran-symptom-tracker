package com.docbearenterprises.symptomvault;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "FileSaver")
public class FileSaverPlugin extends Plugin {

    @PluginMethod
    public void saveFile(PluginCall call) {
        String filename = call.getString("filename");
        String tempPath = call.getString("tempPath"); // Path to temp file, not raw data
        String mimeType = call.getString("mimeType", "application/octet-stream");

        if (filename == null || tempPath == null) {
            call.reject("filename and tempPath are required");
            return;
        }

        // Store call for the activity result callback
        bridge.saveCall(call);

        // Launch Android's native Save As dialog
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, filename);

        startActivityForResult(call, intent, "handleSaveResult");
    }

    @PluginMethod
        public void openFile(PluginCall call) {
            String mimeType = call.getString("mimeType", "application/octet-stream");

            bridge.saveCall(call);

            // Launch Android's native file picker, starting in Downloads
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType(mimeType);

                    // Force start in the Downloads collection on Android 8+
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        Uri downloadsUri = android.provider.MediaStore.Downloads
                            .getContentUri(android.provider.MediaStore.VOLUME_EXTERNAL);
                        intent.putExtra(android.provider.DocumentsContract.EXTRA_INITIAL_URI,
                            downloadsUri);
                    }

                    startActivityForResult(call, intent, "handleOpenResult");
        }

        /**
             * Writes a chunk of base64-encoded binary data to a named temp file.
             * First chunk (chunkIndex=0) creates/overwrites the file.
             * Subsequent chunks append decoded bytes.
             * Used for binary files (PDF) where UTF-8 text chunking would corrupt data.
             *
             * Call params: { filename, chunk (base64), chunkIndex, totalChunks }
             */
            @PluginMethod
            public void writeFileChunkBinary(PluginCall call) {
                String filename  = call.getString("filename");
                String chunk     = call.getString("chunk");
                int chunkIndex   = call.getInt("chunkIndex", 0);
                int totalChunks  = call.getInt("totalChunks", 1);

                if (filename == null || chunk == null) {
                    call.reject("filename and chunk are required");
                    return;
                }

                try {
                    File cacheFile = new File(getActivity().getCacheDir(), filename);

                    // Decode base64 chunk to raw bytes
                    byte[] bytes = android.util.Base64.decode(chunk, android.util.Base64.DEFAULT);

                    // First chunk — create fresh file; subsequent chunks — append
                    FileOutputStream fos = new FileOutputStream(cacheFile, chunkIndex > 0);
                    fos.write(bytes);
                    fos.close();

                    JSObject ret = new JSObject();
                    ret.put("done", chunkIndex >= totalChunks - 1);
                    ret.put("path", cacheFile.getAbsolutePath());
                    call.resolve(ret);

                } catch (Exception e) {
                    call.reject("Failed to write binary chunk: " + e.getMessage());
                }
            }

        /**
             * Writes a chunk of UTF-8 text to a named temp file in app cache.
             * First chunk (chunkIndex=0) creates/overwrites the file.
             * Subsequent chunks append. Returns the absolute file path on last chunk.
             *
             * Call params: { filename, chunk, chunkIndex, totalChunks }
             */
            @PluginMethod
            public void writeFileChunk(PluginCall call) {
                String filename  = call.getString("filename");
                String chunk     = call.getString("chunk");
                int chunkIndex   = call.getInt("chunkIndex", 0);
                int totalChunks  = call.getInt("totalChunks", 1);

                if (filename == null || chunk == null) {
                    call.reject("filename and chunk are required");
                    return;
                }

                try {
                    File cacheFile = new File(getActivity().getCacheDir(), filename);

                    // First chunk — create fresh file
                    // Subsequent chunks — append
                    FileOutputStream fos = new FileOutputStream(cacheFile, chunkIndex > 0);
                    byte[] bytes = chunk.getBytes(StandardCharsets.UTF_8);
                    fos.write(bytes);
                    fos.close();

                    JSObject ret = new JSObject();
                    ret.put("done", chunkIndex >= totalChunks - 1);
                    ret.put("path", cacheFile.getAbsolutePath());
                    call.resolve(ret);

                } catch (Exception e) {
                    call.reject("Failed to write chunk: " + e.getMessage());
                }
            }

        /**
             * Copies a content:// URI file into app cache, then reads it back
             * in chunks, returning one chunk at a time as plain UTF-8 text.
             * Caller passes chunkIndex (0-based); returns { text, done, totalChunks }.
             * First call (chunkIndex=0) copies the file to cache.
             */
            @PluginMethod
            public void readFileChunk(PluginCall call) {
                String uriString = call.getString("uri");
                int chunkIndex = call.getInt("chunkIndex", 0);
                // 3MB chunks — small enough to pass through bridge safely
                int chunkSize = 3 * 1024 * 1024;

                if (uriString == null) {
                    call.reject("uri is required");
                    return;
                }

                try {
                    // Use a stable cache filename based on URI hash
                    String cacheFileName = "restore_" + Math.abs(uriString.hashCode()) + ".json";
                    File cacheFile = new File(getActivity().getCacheDir(), cacheFileName);

                    // On first chunk, copy from content:// URI to cache file
                    if (chunkIndex == 0) {
                        Uri uri = Uri.parse(uriString);
                        InputStream is = getActivity().getContentResolver().openInputStream(uri);
                        if (is == null) {
                            call.reject("Could not open file stream");
                            return;
                        }
                        OutputStream os = new java.io.FileOutputStream(cacheFile);
                        byte[] buffer = new byte[8192];
                        int bytesRead;
                        while ((bytesRead = is.read(buffer)) != -1) {
                            os.write(buffer, 0, bytesRead);
                        }
                        is.close();
                        os.close();
                    }

                    // Read the requested chunk from cache file
                    long fileSize = cacheFile.length();
                    int totalChunks = (int) Math.ceil((double) fileSize / chunkSize);
                    long offset = (long) chunkIndex * chunkSize;

                    if (offset >= fileSize) {
                        call.reject("Chunk index out of range");
                        return;
                    }

                    // Read chunk as bytes, convert to UTF-8 string
                    RandomAccessFile raf = new RandomAccessFile(cacheFile, "r");
                    raf.seek(offset);
                    int bytesToRead = (int) Math.min(chunkSize, fileSize - offset);
                    byte[] bytes = new byte[bytesToRead];
                    raf.readFully(bytes);
                    raf.close();

                    boolean done = (chunkIndex >= totalChunks - 1);

                    // Clean up cache file on last chunk
                    if (done) {
                        cacheFile.delete();
                    }

                    JSObject ret = new JSObject();
                    ret.put("text", new String(bytes, StandardCharsets.UTF_8));
                    ret.put("done", done);
                    ret.put("totalChunks", totalChunks);
                    ret.put("chunkIndex", chunkIndex);
                    call.resolve(ret);

                } catch (Exception e) {
                    call.reject("Failed to read chunk: " + e.getMessage());
                }
            }

        @ActivityCallback
        private void handleOpenResult(PluginCall call, ActivityResult result) {
            if (call == null) return;

            if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                Uri uri = result.getData().getData();
                if (uri == null) {
                    call.reject("No file URI returned");
                    return;
                }

                try {
                    // Read the selected file content
                    java.io.InputStream is = getActivity().getContentResolver()
                        .openInputStream(uri);
                    java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = is.read(buffer)) != -1) {
                        baos.write(buffer, 0, bytesRead);
                    }
                    is.close();

                    // Return content as base64 string
                    String base64 = android.util.Base64.encodeToString(
                        baos.toByteArray(), android.util.Base64.DEFAULT);

                    JSObject ret = new JSObject();
                    ret.put("data", base64);
                    ret.put("uri", uri.toString());
                    call.resolve(ret);

                } catch (Exception e) {
                    call.reject("Failed to read file: " + e.getMessage());
                }
            } else {
                call.reject("cancelled");
            }
        }

    @ActivityCallback
    private void handleSaveResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
            Uri uri = result.getData().getData();
            if (uri == null) {
                call.reject("No file URI returned");
                return;
            }

            String tempPath = call.getString("tempPath");
            if (tempPath == null) {
                call.reject("No temp file path");
                return;
            }

            try {
                // Read from temp file and write to user-chosen location
                File tempFile = new File(tempPath);
                FileInputStream fis = new FileInputStream(tempFile);
                OutputStream os = getActivity().getContentResolver()
                    .openOutputStream(uri, "wt");

                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }

                fis.close();
                os.close();

                // Clean up temp file
                tempFile.delete();

                JSObject ret = new JSObject();
                ret.put("uri", uri.toString());
                call.resolve(ret);

            } catch (Exception e) {
                call.reject("Failed to write file: " + e.getMessage());
            }
        } else {
            call.reject("cancelled");
        }
    }
}