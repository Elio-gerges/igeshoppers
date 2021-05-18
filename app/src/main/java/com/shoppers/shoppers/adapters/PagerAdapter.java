package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentStatePagerAdapter;

import com.shoppers.shoppers.fragments.CartFragment;
import com.shoppers.shoppers.fragments.HomeFragment;
import com.shoppers.shoppers.fragments.OrdersFragment;
import com.shoppers.shoppers.fragments.WishlistFragment;

public class PagerAdapter extends FragmentStatePagerAdapter {

    private int mTabs;
    private Context context;

    public PagerAdapter(Context context, FragmentManager fragmentManager, int tabs) {
        super(fragmentManager);
        this.mTabs = tabs;
        this.context = context;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        Log.d("getItem", "position: " + position);
        switch (position) {
            case 0:
                return HomeFragment.newInstance(this.context);
            case 1:
                return CartFragment.newInstance(this.context);
//            case 2:
//                return new OrdersFragment();
//            case 3:
//                return new WishlistFragment();
            default:
                return null;
        }
    }

    @Override
    public int getCount() {
        return mTabs;
    }
}