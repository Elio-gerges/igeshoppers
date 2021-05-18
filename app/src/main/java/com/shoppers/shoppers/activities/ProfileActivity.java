package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import com.shoppers.shoppers.R;

import utils.Utilities;

public class ProfileActivity extends AppCompatActivity {

    private ImageButton btnBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        this.btnBack = findViewById(R.id.btnBack);

        this.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
}