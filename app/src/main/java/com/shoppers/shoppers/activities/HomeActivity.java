package com.shoppers.shoppers.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.gauravk.bubblenavigation.BubbleNavigationConstraintView;
import com.gauravk.bubblenavigation.listener.BubbleNavigationChangeListener;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.adapters.PagerAdapter;
import com.shoppers.shoppers.fragments.HomeFragment;

import java.util.ArrayList;

import utils.Utilities;

public class HomeActivity extends AppCompatActivity {

    private ViewPager viewPager;
    private BubbleNavigationConstraintView bottomNavigation;
    private PagerAdapter pageAdapter;
    private ImageButton btnProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        bottomNavigation = findViewById(R.id.bottomNav);
        btnProfile = findViewById(R.id.btnProfile);
        viewPager = findViewById(R.id.pager);

        pageAdapter = new PagerAdapter(this, getSupportFragmentManager(), bottomNavigation.getChildCount());
        viewPager.setAdapter(pageAdapter);

        bottomNavigation.setNavigationChangeListener(new BubbleNavigationChangeListener() {
            @Override
            public void onNavigationChanged(View view, int position) {
                viewPager.setCurrentItem(position, true);
            }
        });

        btnProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(HomeActivity.this, ProfileActivity.class));
            }
        });
    }
}