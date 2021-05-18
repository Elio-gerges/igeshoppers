package com.shoppers.shoppers.activities;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.GridView;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.adapters.GridViewProductAdapter;
import com.shoppers.shoppers.models.Product;
import com.shoppers.shoppers.models.Subcategory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import api.APIRequest;
import api.APIStrategy;
import utils.Constants;
import utils.PreferenceUtils;
import utils.Utilities;

public class SubcategoryActivity extends AppCompatActivity {

    private static final String TAG = "CategoryActivity";
    private GridView gridView;
    private TextView lblCategoryName;
    private ImageButton btnBack;

    private String id;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_subcategory);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        this.btnBack = findViewById(R.id.btnBack);
        this.gridView = findViewById(R.id.lstProductsByCategory);
        this.lblCategoryName = findViewById(R.id.lblCategoryName);

        this.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        this.lblCategoryName.setText(getIntent().getStringExtra("Category_name"));
        this.id = getIntent().getStringExtra("Category_id");

        getAPIData();
    }

    private ArrayList<Product> getProductList() {
        ArrayList<Product> dummyProducts = new ArrayList<>();
        dummyProducts.add(new Product("Product 1", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 2", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 3", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 4", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 5", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 6", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 7", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 8", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Product 9", String.valueOf(R.drawable.prod)));
        return dummyProducts;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIData() {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject categoriesData = response.getJSONObject("productsData");
                    JSONArray list = categoriesData.getJSONArray("list");

                    ArrayList<Product> products = APIStrategy.getInstance().formatProduct(list);
                    if(products.size() > 0) {
                        inflateGridView(products);
                        findViewById(R.id.data_not_found).setVisibility(View.INVISIBLE);
                    } else {
                        findViewById(R.id.data_not_found).setVisibility(View.VISIBLE);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: " + error.getMessage());
                Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG).show();
            }
        };

        String url = getString(R.string.base_url) + "/products/subcategory/" + this.id;

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.API_TOKEN_NAME));

        try {
            APIRequest.getInstance(getApplicationContext()).sendRequest(
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

    private void inflateGridView(ArrayList<Product> products) {
        GridViewProductAdapter adapter = new GridViewProductAdapter(products, this);
        this.gridView.setAdapter(adapter);
    }
}