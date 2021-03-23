package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;
import com.shoppers.shoppers.R;

import android.os.Bundle;

import utils.Utilities;

public class ProductActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product);

        Utilities.changeStatusBarColor(getWindow(), getResources());
    }
}