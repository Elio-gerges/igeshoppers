package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.shoppers.shoppers.R;

import utils.Utilities;

public class SplashActivity extends AppCompatActivity {

    // Animation variables:
    private Animation topAnim, bottomAnim;
    private ImageView imgLogo;
    private TextView lblLogo, lblSlogan;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // For removing the status bar
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        Utilities.changeStatusBarColor(getWindow(), getResources());
        setContentView(R.layout.activity_splash);

        // Animating:
        this.topAnim = AnimationUtils.loadAnimation(this, R.anim.top_animation);
        this.bottomAnim = AnimationUtils.loadAnimation(this, R.anim.bottom_animation);

        // Adding the hooks:
        this.imgLogo = findViewById(R.id.imgLogo);
        this.lblLogo = findViewById(R.id.lblLogo);
        this.lblSlogan = findViewById(R.id.lblSlogan);

        // Animating the hooks:
        this.imgLogo.setAnimation(this.topAnim);
        this.lblLogo.setAnimation(this.bottomAnim);
        this.lblSlogan.setAnimation(this.bottomAnim);

        // Authenticate user:
        // Here we will be authenticating the user's credentials
        //  According to the result (Found in shared preferences)
        //  We will redirect to Main activity (and get an api token)
        //  or Login/Register activity.
        // For now we will delay that process a bit.
        Thread welcomeThread = new Thread() {

            @Override
            public void run() {
                try {
                    super.run();
                    sleep(3000);  //Delay of 3 seconds
                } catch (Exception e) {
                    Toast.makeText(
                            getApplicationContext(),
                            "Error in Splash Thread: " + e.getMessage(),
                            Toast.LENGTH_SHORT)
                            .show();
                } finally {
                    Intent i = new Intent(SplashActivity.this, LoginActivity.class);
                    startActivity(i);
                    finish();
                }
            }
        };
        welcomeThread.start();
    }
}