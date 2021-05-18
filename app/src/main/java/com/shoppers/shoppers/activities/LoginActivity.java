package com.shoppers.shoppers.activities;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;

import com.shoppers.shoppers.R;

import utils.Constants;
import utils.PreferenceUtils;
import utils.Utilities;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        findViewById(R.id.btnLogin)
            .setOnClickListener(new View.OnClickListener() {
                @RequiresApi(api = Build.VERSION_CODES.O)
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(LoginActivity.this, HomeActivity.class);
                    PreferenceUtils.getInstance(getApplicationContext()).saveUserID("607cbbb71c507c3e7460707e");
                    PreferenceUtils.getInstance(getApplicationContext())
                            .saveKeyValue(Constants.API_TOKEN_NAME,
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNjNWNhMGQxZm" +
                                            "FjNTA2MjVjM2JmZWEiLCJpYXQiOjE2MTU2ODQxMDMsImV4cCI6MTY0Nj" +
                                            "c4ODEwM30.NqoJDxP2_ATnriCknNo2MgU6z_R37bBJn0dcBy25V24");
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