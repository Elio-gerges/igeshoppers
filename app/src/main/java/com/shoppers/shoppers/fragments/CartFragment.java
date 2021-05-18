package com.shoppers.shoppers.fragments;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.shoppers.shoppers.activities.BuyActivity;
import com.shoppers.shoppers.R;
import com.shoppers.shoppers.models.Product;
import com.squareup.picasso.Picasso;

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

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link CartFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CartFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String TAG = "CartFragment";

    // TODO: Rename and change types of parameters
    private static Context mcontext;
    private ListView listView;
    private TextView lblCartPrice;
    private Button btnBuyNow;

    public CartFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param context
     * @return A new instance of fragment CartFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static CartFragment newInstance(Context context) {
        CartFragment fragment = new CartFragment();
        mcontext = context;
        return fragment;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        getAPIData();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_cart, container, false);

        this.listView = view.findViewById(R.id.lstCartProducts);
        this.lblCartPrice = view.findViewById(R.id.lblCartPrice);
        this.btnBuyNow = view.findViewById(R.id.btnBuyNow);

        this.btnBuyNow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(mcontext, BuyActivity.class));
            }
        });

//        getAPIData();

        return view;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void getAPIData() {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {

            @Override
            public void onResponse(JSONObject response) {
                try {
                    if(!response.has("cart")) {
//                        Toast.makeText(getContext(), "No Products in cart yet!", Toast.LENGTH_SHORT).show();
                        listView.removeAllViewsInLayout();
                        getView().findViewById(R.id.data_not_found).setVisibility(View.VISIBLE);
                        return;
                    }
                    getView().findViewById(R.id.data_not_found).setVisibility(View.INVISIBLE);
                    JSONObject cartData = response.getJSONObject("cart");
                    JSONArray list = cartData.getJSONArray("products");
                    double price = Double.parseDouble(cartData.getString("price"));

                    ArrayList<Product> products = APIStrategy.getInstance().formatCartProduct(list);

                    Log.d(TAG, "onResponse: " + products.toString());

                    ProductAdapter productAdapter = new ProductAdapter(products);
                    listView.setAdapter(productAdapter);
                    listView.setDivider(null);

                    DecimalFormat numberFormat = new DecimalFormat("#.00");
                    price = Double.valueOf(numberFormat.format(price));
                    lblCartPrice.setText("$" + price);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: " + error.getMessage());
                Toast.makeText(getContext(), error.getMessage(), Toast.LENGTH_LONG);
            }
        };

        String url = getString(R.string.base_url) + "/carts/" +
                PreferenceUtils.getInstance(getContext()).getValue(Constants.KEY_CARTID);

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getContext()).getValue(Constants.API_TOKEN_NAME));

        try {
            APIRequest.getInstance(getContext()).sendRequest(
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
    @Override
    public void onResume() {
        getAPIData();
        super.onResume();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onStart() {
        getAPIData();
        super.onStart();
    }

    private class ProductAdapter extends BaseAdapter {

        private ArrayList<Product> products;

        public ProductAdapter(ArrayList<Product> products) {
            this.products = products;
        }
        @Override
        public int getCount() {
            return this.products.size();
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
            View listItemLayout = getLayoutInflater().inflate(R.layout.layout_product_cart, null);
            TextView lblProductName = listItemLayout.findViewById(R.id.lblProductName);
            TextView lblProductPrice = listItemLayout.findViewById(R.id.lblProductPrice);
            TextView lblProductQtt = listItemLayout.findViewById(R.id.lblProductQtt);
            ImageView imgProduct = listItemLayout.findViewById(R.id.imgProduct);
            lblProductName.setText(this.products.get(position).getName());
            DecimalFormat numberFormat = new DecimalFormat("#.00");
            Double price = Double.valueOf(numberFormat.format(this.products.get(position).getPrice()));
            lblProductPrice.setText("$" + price);
            lblProductQtt.setText(String.valueOf(this.products.get(position).getStockQtt()));
            String url = getString(R.string.base_img_url) + this.products.get(position).getImg();
            Picasso.get()
                    .load(url)
                    .into(imgProduct);
            return listItemLayout;
        }
    }
}