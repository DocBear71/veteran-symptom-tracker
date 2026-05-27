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
import java.io.OutputStream;

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