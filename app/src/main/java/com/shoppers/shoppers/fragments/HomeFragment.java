package com.shoppers.shoppers.fragments;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.util.SparseArray;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.SearchView;
import android.widget.Toast;

import com.google.android.gms.vision.CameraSource;
import com.google.android.gms.vision.Detector;
import com.google.android.gms.vision.barcode.Barcode;
import com.google.android.gms.vision.barcode.BarcodeDetector;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.BarcodeActivity;
import com.shoppers.shoppers.activities.HomeActivity;
import com.shoppers.shoppers.activities.ProfileActivity;
import com.shoppers.shoppers.adapters.RecycleViewCategoriesAdapter;
import com.shoppers.shoppers.adapters.RecycleViewProductAdapter;
import com.shoppers.shoppers.models.Product;

import java.io.IOException;
import java.util.ArrayList;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HomeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HomeFragment extends Fragment {

    private static final String TAG = "HomeFragment";
    private static Context mcontext;

    private ArrayList<String> dummyCategories;
    private ArrayList<Product> dummyProducts;

    private SwipeRefreshLayout swipeRefreshLayout;

    private SearchView searchView;

    private ImageButton scanBarcode;

    public HomeFragment() {
        // Required empty public constructor
    }

    public static HomeFragment newInstance(Context context) {
        HomeFragment fragment = new HomeFragment();
        mcontext = context;
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        initRecyclerView(view);
        initProductsLists(view);

        scanBarcode = view.findViewById(R.id.btnSearchByCamera);
        scanBarcode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(mcontext, BarcodeActivity.class));
            }
        });

        /*
         * Sets up a SwipeRefreshLayout.OnRefreshListener that is invoked when the user
         * performs a swipe-to-refresh gesture.
         */
        swipeRefreshLayout = view.findViewById(R.id.swiperefreshHome);
        swipeRefreshLayout.setOnRefreshListener(
                new SwipeRefreshLayout.OnRefreshListener() {
                    @Override
                    public void onRefresh() {
                        Log.d(TAG, "onRefresh called from SwipeRefreshLayout");

                        // This method performs the actual data-refresh operation.
                        // The method calls setRefreshing(false) when it's finished.
                        // myUpdateOperation();
                        // Simulating a refresh method
                        Thread refresh = new Thread() {

                            @Override
                            public void run() {
                                try {
                                    super.run();
                                    sleep(3000);  //Delay of 3 seconds
                                } catch (Exception e) {

                                } finally {
                                    swipeRefreshLayout.setRefreshing(false);
                                }
                            }
                        };
                        refresh.start();
                    }
                }
        );

        return view;
    }

    private void initRecyclerView(View view) {
        dummyCategories = new ArrayList<>();
        dummyCategories.add("Category 1");
        dummyCategories.add("Category 2");
        dummyCategories.add("Category 3");
        dummyCategories.add("Category 4");
        dummyCategories.add("Category 5");
        dummyCategories.add("Category 6");
        dummyCategories.add("Category 7");
        dummyCategories.add("Category 8");
        dummyCategories.add("Category 9");
        LinearLayoutManager linearLayoutManager =
                new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView = view.findViewById(R.id.lstCategories);
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setAdapter(new RecycleViewCategoriesAdapter(mcontext, dummyCategories));
    }

    private void initProductsLists(View view) {
        dummyProducts = new ArrayList<>();
        dummyProducts.add(new Product("Product 1", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 2", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 3", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 4", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 5", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 6", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 7", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 8", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 9", String.valueOf(R.drawable.prod)));

        LinearLayoutManager linearLayoutManager1 =
                new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView1 = view.findViewById(R.id.lstPopularProducts);
        recyclerView1.setLayoutManager(linearLayoutManager1);
        recyclerView1.setAdapter(new RecycleViewProductAdapter(mcontext, dummyProducts));

        LinearLayoutManager linearLayoutManager2 =
                new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView2 = view.findViewById(R.id.lstProductsNewArrivals);
        recyclerView2.setLayoutManager(linearLayoutManager2);
        recyclerView2.setAdapter(new RecycleViewProductAdapter(mcontext, dummyProducts));

        LinearLayoutManager linearLayoutManager3 =
                new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView3 = view.findViewById(R.id.lstProductsWithDeals);
        recyclerView3.setLayoutManager(linearLayoutManager3);
        recyclerView3.setAdapter(new RecycleViewProductAdapter(mcontext, dummyProducts));

        LinearLayoutManager linearLayoutManager4 =
                new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
        RecyclerView recyclerView4 = view.findViewById(R.id.lstRecommendedProducts);
        recyclerView4.setLayoutManager(linearLayoutManager4);
        recyclerView4.setAdapter(new RecycleViewProductAdapter(mcontext, dummyProducts));
    }
}