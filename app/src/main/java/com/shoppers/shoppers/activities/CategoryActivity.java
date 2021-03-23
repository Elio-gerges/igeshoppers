package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import com.shoppers.shoppers.R;

import utils.Utilities;

public class CategoryActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_category);

        Utilities.changeStatusBarColor(getWindow(), getResources());
    }
}