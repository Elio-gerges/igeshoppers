package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.shoppers.shoppers.R;

import utils.Utilities;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        findViewById(R.id.btnLogin)
            .setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(LoginActivity.this, HomeActivity.class);
                    startActivity(i);
                    finish();
                }
            });
    }

    public void onRegisterClick(View View) {
        startActivity(new Intent(this, RegisterActivity.class));
        finish();
        overridePendingTransition(R.anim.slide_in_right, R.anim.stay);
    }
}