package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;
import com.shoppers.shoppers.R;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import utils.Utilities;

public class ProductActivity extends AppCompatActivity {

    private ImageButton btnBack, btnShare;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        this.btnBack = findViewById(R.id.btnBack);
        this.btnShare = findViewById(R.id.btnShare);

        this.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        this.btnShare.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, "This is my text to send.");
                sendIntent.setType("text/plain");

                Intent shareIntent = Intent.createChooser(sendIntent, "Share Product");
                startActivity(shareIntent);
            }
        });
    }
}