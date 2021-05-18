package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.ProductActivity;
import com.shoppers.shoppers.models.Product;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import api.APIRequest;
import utils.Constants;
import utils.PreferenceUtils;

public class RecycleViewProductAdapter extends RecyclerView.Adapter<RecycleViewProductAdapter.ViewHolder> {

    private static final String TAG = "RecycleViewProductAdapter";
    private ArrayList<Product> products;
    private Context context;

    public RecycleViewProductAdapter(Context context, ArrayList<Product> products) {
        this.products = products;
        this.context = context;
    }

    @NonNull
    @Override
    public RecycleViewProductAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view =
                LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.layout_product, parent, false);
        return new RecycleViewProductAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecycleViewProductAdapter.ViewHolder holder, int position) {
        holder.lblProductName.setText(this.products.get(position).getName());
        String url = context.getString(R.string.base_img_url) + this.products.get(position).getImg();
        Picasso.get()
                .load(url)
                .into(holder.imgProduct);

        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, ProductActivity.class);
                intent.putExtra("product_id", products.get(position).getId());
                context.startActivity(intent);
            }
        });

        holder.btnAddToCart.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onClick(View v) {
                try {
                    holder.addToCart(products.get(position));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return this.products.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private TextView lblProductName;
        private ImageView imgProduct;
        private CardView cardView;
        private Button btnAddToCart;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            lblProductName = itemView.findViewById(R.id.lblProductName);
            imgProduct = itemView.findViewById(R.id.imgProduct);
            cardView = itemView.findViewById(R.id.productCard);
            btnAddToCart = itemView.findViewById(R.id.btnAddToCart);
        }

        @RequiresApi(api = Build.VERSION_CODES.O)
        public void addToCart(Product mProduct) throws JSONException {
            Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {
                @RequiresApi(api = Build.VERSION_CODES.O)
                @Override
                public void onResponse(JSONObject response) {
                    Toast.makeText(context, "Product added to cart!", Toast.LENGTH_LONG).show();
                    try {
                        if(response.getString("cart_id") != null) {
                            PreferenceUtils.getInstance(context)
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
                    Toast.makeText(context, error.getMessage(), Toast.LENGTH_LONG).show();
                }
            };

            String url = "";
            int method = 1;

            Map<String, String> headerParams = new HashMap<String, String>();
            headerParams.put("auth-token", PreferenceUtils.getInstance(context).getValue(Constants.API_TOKEN_NAME));

            JSONObject requestBody = new JSONObject();
            JSONArray products = new JSONArray();

            JSONObject product = new JSONObject();

            product.put("product_id", mProduct.getId());
            product.put("price", mProduct.getPrice());
            product.put("name", mProduct.getName());
            product.put("img", mProduct.getImg());
            product.put("qtt", 1);
            products.put(product);

            Log.d(TAG, "addToCart: " + PreferenceUtils.getInstance(context).getValue(Constants.KEY_CARTID));

            if(PreferenceUtils.getInstance(context).getValue(Constants.KEY_CARTID) == null) {
                url = context.getString(R.string.base_url) + "/carts";
                method = Request.Method.POST;

                requestBody.put("shopper_id", PreferenceUtils.getInstance(context).getUserID());
                requestBody.put("products", products);
            } else {
                url = context.getString(R.string.base_url) + "/carts/add/product/" + PreferenceUtils.getInstance(context).getValue(Constants.KEY_CARTID);
                method = Request.Method.PUT;
                requestBody.put("products", products);
            }

            try {
                APIRequest.getInstance(context).sendRequest(
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
    }
}