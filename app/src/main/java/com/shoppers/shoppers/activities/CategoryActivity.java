package com.shoppers.shoppers.activities;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.adapters.RecycleViewCategoriesAdapter;
import com.shoppers.shoppers.models.Category;
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

public class CategoryActivity extends AppCompatActivity {

    private static final String TAG = "CategoryActivity";
    private ImageButton btnBack;
    private TextView lblCategoryName;
    private ListView listView;
    private String id;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_category);

        Utilities.changeStatusBarColor(getWindow(), getResources());

        this.btnBack = findViewById(R.id.btnBack);
        this.listView = findViewById(R.id.lstSubcategoriesByCategory);
        this.lblCategoryName = findViewById(R.id.lblCategoryName);

        this.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        this.lblCategoryName.setText(getIntent().getStringExtra("Category_name"));
        this.id = getIntent().getStringExtra("Category_id");

        if(getIntent().getStringExtra("fromCatalog") == null) {
            getAPIData();
        } else {

        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIData() {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject categoriesData = response.getJSONObject("subcategoriesData");
                    JSONArray list = categoriesData.getJSONArray("list");

                    ArrayList<Subcategory> subcategories = APIStrategy.getInstance().formatSubcategories(list);
                    if(subcategories.size() > 0) {
                        SubcategoryAdapter subcategoryAdapter = new SubcategoryAdapter(subcategories);
                        listView.setAdapter(subcategoryAdapter);
                        listView.setDivider(null);
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

        String url = getString(R.string.base_url) + "/products/category/" + this.id;

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

    private class SubcategoryAdapter extends BaseAdapter {

        private ArrayList<Subcategory> subcategories;

        public SubcategoryAdapter(ArrayList<Subcategory> subcategories) {
            this.subcategories = subcategories;
        }
        @Override
        public int getCount() {
            return this.subcategories.size();
        }

        @Override
        public Object getItem(int position) {
            return null;
        }

        @Override
        public long getItemId(int position) {
            return 0;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View listItemLayout = getLayoutInflater().inflate(R.layout.layout_subcategory, null);
            TextView lblSubcategory = listItemLayout.findViewById(R.id.lblSubcategory);
            lblSubcategory.setText(this.subcategories.get(position).getName());
            listItemLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent subcategoryIntent = new Intent(getApplicationContext(), SubcategoryActivity.class);
                    subcategoryIntent.putExtra("Category_id", subcategories.get(position).getId());
                    subcategoryIntent.putExtra("Category_name", subcategories.get(position).getName());
                    startActivity(subcategoryIntent);
                }
            });
            return listItemLayout;
        }
    }
}