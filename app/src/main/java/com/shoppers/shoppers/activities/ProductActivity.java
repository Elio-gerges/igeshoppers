
package com.shoppers.shoppers.activities;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonRequest;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.adapters.RecycleViewProductAdapter;
import com.shoppers.shoppers.models.Product;
import com.shoppers.shoppers.models.Subcategory;
import com.squareup.picasso.Picasso;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import api.APIRequest;
import api.APIStrategy;
import utils.Constants;
import utils.PreferenceUtils;
import utils.Utilities;

public class ProductActivity extends AppCompatActivity {

    private static final String TAG = "ProductActivity";
    private ImageButton btnBack, btnShare;
    private ArrayList<Product> dummyProducts;
    private String id;
    private String img;
    private String name;
    private String attributeId;
    private double price;

    private TextView lblBarcode;
    private TextView lblProductName;
    private TextView lblProductPrice;
    private TextView txtDescription;
    private ImageView imgProduct;

    private ImageButton btnPlus;
    private ImageButton btnMinus;
    private EditText txtQtt;
    private Button btnAdd;

    @RequiresApi(api = Build.VERSION_CODES.O)
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

        this.txtDescription = findViewById(R.id.txtDescription);
        this.lblBarcode = findViewById(R.id.lblBarcode);
        this.lblProductName = findViewById(R.id.lblProductName);
        this.lblProductPrice = findViewById(R.id.lblProductPrice);
        this.imgProduct = findViewById(R.id.imgProduct);

        this.btnPlus = findViewById(R.id.btnPlus);
        this.btnMinus = findViewById(R.id.btnMinus);
        this.btnAdd = findViewById(R.id.btnAdd);
        this.txtQtt = findViewById(R.id.txtQtt);

        this.btnPlus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int initVal = Integer.parseInt(txtQtt.getText().toString());
                txtQtt.setText(String.valueOf(initVal + 1));
            }
        });

        this.btnMinus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int initVal = Integer.parseInt(txtQtt.getText().toString());
                if(initVal > 0) {
                    txtQtt.setText(String.valueOf(initVal - 1));
                }
            }
        });

        this.btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    addToCart();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        this.id = getIntent().getStringExtra("product_id");

        getAPIData();

//        initProductsLists(findViewById(R.id.recyclerMoreLikeThis));
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIData() {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject product = response.getJSONObject("productData");

                    txtDescription.setText(product.getString("description"));
                    lblBarcode.setText(product.getString("barcode"));
                    lblProductName.setText(product.getString("name"));
                    attributeId = product.getString("attribute_id");
                    getAPIDataByAttribute(findViewById(R.id.recyclerMoreLikeThis), attributeId);

                    price = Utilities.calculatePrice(product);
                    DecimalFormat numberFormat = new DecimalFormat("#.00");
                    price = Double.valueOf(numberFormat.format(price));
                    lblProductPrice.setText("$" + price);
                    img = product.getString("image");
                    name = product.getString("name");

                    String url = getString(R.string.base_img_url) + product.getString("image");
                    Picasso.get()
                            .load(url)
                            .into(imgProduct);

                    btnShare.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            Intent sendIntent = new Intent();
                            sendIntent.setAction(Intent.ACTION_SEND);
                            try {
                                sendIntent.putExtra(Intent.EXTRA_TEXT,
                                        "Look at this product " +
                                                product.getString("name") +
                                                " on Shoppers app.");
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            sendIntent.setType("text/plain");

                            Intent shareIntent = Intent.createChooser(sendIntent, "Share Product");
                            startActivity(shareIntent);
                        }
                    });
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

        String url = getString(R.string.base_url) + "/products/detail/" + this.id;

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
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIDataByAttribute(RecyclerView recyclerView, String attibuteId) {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject productsData = response.getJSONObject("productsData");
                    JSONArray list = productsData.getJSONArray("list");

                    ArrayList<Product> productsList = APIStrategy.getInstance().formatProduct(list);

                    LinearLayoutManager linearLayoutManager =
                            new LinearLayoutManager(getApplicationContext(), LinearLayoutManager.HORIZONTAL, false);
                    recyclerView.setLayoutManager(linearLayoutManager);
                    recyclerView.setAdapter(new RecycleViewProductAdapter(recyclerView.getContext(), productsList));
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

        String url = getString(R.string.base_url) + "/products/attribute/" + attibuteId;

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

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void addToCart() throws JSONException {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Toast.makeText(getApplicationContext(), "Product added to cart!", Toast.LENGTH_LONG).show();
                try {
                    if(response.getString("cart_id") != null) {
                        PreferenceUtils.getInstance(getApplicationContext())
                                .saveKeyValue(Constants.KEY_CARTID, response.getString("cart_id"));
                    }
                } catch (JSONException e) {
                    Log.d(TAG, "onResponse: Did PUT.");
                }
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG).show();
            }
        };

        String url = "";
        int method = 1;

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.API_TOKEN_NAME));

        JSONObject requestBody = new JSONObject();
        JSONArray products = new JSONArray();

        JSONObject product = new JSONObject();

        product.put("product_id", id);
        product.put("price", price);
        product.put("name", name);
        product.put("img", img);
        product.put("qtt", Integer.valueOf(txtQtt.getText().toString()));
        products.put(product);

        Log.d(TAG, "addToCart: " + PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.KEY_CARTID));

        if(PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.KEY_CARTID) == null) {
            url = getString(R.string.base_url) + "/carts";
            method = Request.Method.POST;

            requestBody.put("shopper_id", PreferenceUtils.getInstance(getApplicationContext()).getUserID());
            requestBody.put("products", products);
        } else {
            url = getString(R.string.base_url) + "/carts/add/product/" + PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.KEY_CARTID);
            method = Request.Method.PUT;
            requestBody.put("products", products);
        }

        try {
            APIRequest.getInstance(getApplicationContext()).sendRequest(
                    method,
                    url,
                    requestBody,
                    jsonObjectListener,
                    errorListener,
                    headerParams
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initProductsLists(RecyclerView recyclerView) {
        dummyProducts = new ArrayList<>();
        dummyProducts.add(new Product("Inner Product 1", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 2", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 3", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 4", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 5", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 6", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 7", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 8", String.valueOf(R.drawable.prod)));
        dummyProducts.add(new Product("Inner Product 9", String.valueOf(R.drawable.prod)));

        Log.d(TAG, "initProductsLists: added the dummy products");

        LinearLayoutManager linearLayoutManager =
                new LinearLayoutManager(getApplicationContext(), LinearLayoutManager.HORIZONTAL, false);
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setAdapter(new RecycleViewProductAdapter(recyclerView.getContext(), dummyProducts));
    }
}