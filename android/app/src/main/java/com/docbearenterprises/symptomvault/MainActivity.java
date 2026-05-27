package com.docbearenterprises.symptomvault;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        // Register our custom FileSaver plugin before the bridge initializes
        registerPlugin(FileSaverPlugin.class);
        super.onCreate(savedInstanceState);
    }
}