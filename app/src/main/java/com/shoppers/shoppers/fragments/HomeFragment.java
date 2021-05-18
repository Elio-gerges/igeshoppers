package com.shoppers.shoppers.fragments;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.SearchView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.BarcodeActivity;
import com.shoppers.shoppers.activities.SubcategoryActivity;
import com.shoppers.shoppers.adapters.RecycleViewCategoriesAdapter;
import com.shoppers.shoppers.adapters.RecycleViewProductAdapter;
import com.shoppers.shoppers.models.Category;
import com.shoppers.shoppers.models.Product;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import api.APIRequest;
import api.APIStrategy;
import api.SimpleRequestQueueFactory;
import utils.Constants;
import utils.PreferenceUtils;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HomeFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HomeFragment extends Fragment {

    private static final String TAG = "HomeFragment";
    private static Context mcontext;

    private View view;

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

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_home, container, false);
//        initRecyclerView(view);
//        initProductsLists(view);
        getAPIData(view);
        this.view = view;
        getAPIDataFromCatalogById(view, "607ee0f8b40a4d425c7b42fc");
        getAPIDataFromCatalogById(view, "607ee112b40a4d425c7b42ff");
        getAPIDataFromCatalogById(view, "607ee13ab40a4d425c7b4302");
        getAPIDataFromCatalogById(view, "6074c1627003543ae0f4858d");
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
                        getAPIData(view);
                        getAPIDataFromCatalogById(view, "607ee0f8b40a4d425c7b42fc");
                        getAPIDataFromCatalogById(view, "607ee112b40a4d425c7b42ff");
                        getAPIDataFromCatalogById(view, "607ee13ab40a4d425c7b4302");
                        getAPIDataFromCatalogById(view, "6074c1627003543ae0f4858d");
                        swipeRefreshLayout.setRefreshing(false);
                    }
                }
        );

        Category[] views = {new Category("Most Popular", "", R.id.btnMostPopular),
                new Category("New Arrivals", "", R.id.btnNewArrivals),
                new Category("Hot Deals", "", R.id.btnHotDeals),
                new Category("Recommended For You", "", R.id.btnRecommendedForYou)};
        for (Category category : views) {
            view.findViewById(category.getViewId())
                .setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent categoryIntent = new Intent(getContext(), SubcategoryActivity.class);
                        categoryIntent.putExtra("Category", category.getName());
                        startActivity(categoryIntent);
                        Log.d(TAG, "onClick: Click on " + category.getName());
                    }
                });
        }



        return view;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onResume() {
        getAPIData(view);
        getAPIDataFromCatalogById(view, "607ee0f8b40a4d425c7b42fc");
        getAPIDataFromCatalogById(view, "607ee112b40a4d425c7b42ff");
        getAPIDataFromCatalogById(view, "607ee13ab40a4d425c7b4302");
        getAPIDataFromCatalogById(view, "6074c1627003543ae0f4858d");
        super.onResume();
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
//        recyclerView.setAdapter(new RecycleViewCategoriesAdapter(mcontext, dummyCategories));
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

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIData(View view) {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject categoriesData = response.getJSONObject("categoriesData");
                    JSONArray list = categoriesData.getJSONArray("list");

                    ArrayList<Category> categories = APIStrategy.getInstance().formatCategories(list);
                    LinearLayoutManager linearLayoutManager =
                            new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
                    RecyclerView recyclerView = view.findViewById(R.id.lstCategories);
                    recyclerView.setLayoutManager(linearLayoutManager);
                    recyclerView.setAdapter(new RecycleViewCategoriesAdapter(mcontext, categories));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: " + error);
                Toast.makeText(mcontext, error.getMessage(), Toast.LENGTH_LONG);
            }
        };

        String url = getString(R.string.base_url) + "/products/categories";

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getContext()).getValue(Constants.API_TOKEN_NAME));

        try {
            APIRequest.getInstance(mcontext).sendRequest(
                    Request.Method.GET,
                    url,
                    null,
                    jsonObjectListener,
                    errorListener,
                    headerParams
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIDataFromCatalogById(View view, String catalogId) {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject categoriesData = response.getJSONObject("productsData");
                    JSONArray list = categoriesData.getJSONArray("list");

                    ArrayList<Product> products = APIStrategy.getInstance().formatFewProduct(list);
                    LinearLayoutManager linearLayoutManager =
                            new LinearLayoutManager(mcontext, LinearLayoutManager.HORIZONTAL, false);
                    int ridOfRecyclerView = 0;
                    switch (catalogId) {
                        case "607ee0f8b40a4d425c7b42fc":
                            ridOfRecyclerView = R.id.lstPopularProducts;
                            break;
                        case "607ee112b40a4d425c7b42ff":
                            ridOfRecyclerView = R.id.lstProductsNewArrivals;
                            break;
                        case "607ee13ab40a4d425c7b4302":
                            ridOfRecyclerView = R.id.lstRecommendedProducts;
                            break;
                        case "6074c1627003543ae0f4858d":
                            ridOfRecyclerView = R.id.lstProductsWithDeals;
                            break;
                    }
                    RecyclerView recyclerView = view.findViewById(ridOfRecyclerView);
                    recyclerView.setLayoutManager(linearLayoutManager);
                    recyclerView.setAdapter(new RecycleViewProductAdapter(mcontext, products));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: " + error);
                Toast.makeText(mcontext, error.getMessage(), Toast.LENGTH_LONG);
            }
        };

        String url = getString(R.string.base_url) + "/products/catalog/" + catalogId;

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getContext()).getValue(Constants.API_TOKEN_NAME));

        try {
            APIRequest.getInstance(mcontext).sendRequest(
                    Request.Method.GET,
                    url,
                    null,
                    jsonObjectListener,
                    errorListener,
                    headerParams
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}