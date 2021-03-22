package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.shoppers.shoppers.R;

import utils.Utilities;

public class RegisterActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        findViewById(R.id.btnRegister)
            .setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(RegisterActivity.this, HomeActivity.class);
                    startActivity(i);
                    finish();
                }
            });
    }

    public void onLoginClick(View view) {
        startActivity(new Intent(this,LoginActivity.class));
        finish();
        overridePendingTransition(R.anim.slide_in_left, android.R.anim.slide_out_right);
    }
}