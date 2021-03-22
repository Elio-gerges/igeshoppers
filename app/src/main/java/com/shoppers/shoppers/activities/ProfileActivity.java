package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.shoppers.shoppers.R;

import utils.Utilities;

public class ProfileActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Utilities.changeStatusBarColor(getWindow(), getResources());
    }
}