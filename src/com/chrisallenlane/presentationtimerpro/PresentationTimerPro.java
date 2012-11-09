package com.chrisallenlane.presentationtimerpro;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;
import android.view.WindowManager;
import android.view.Window;
import android.view.View;

public class PresentationTimerPro extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // prevent the screen from sleeping
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // load the webview
        super.loadUrl("file:///android_asset/www/index.html");

        // prevent long-clicks from selecting text
        super.appView.setOnLongClickListener(new View.OnLongClickListener() {
            public boolean onLongClick(View v) {
                return true;
            }
        });
    }
}
