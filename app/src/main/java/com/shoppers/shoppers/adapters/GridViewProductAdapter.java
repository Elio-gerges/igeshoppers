package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.cardview.widget.CardView;

import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.ProductActivity;
import com.shoppers.shoppers.models.Product;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class GridViewProductAdapter extends BaseAdapter {

    private final Context context;
    private ArrayList<Product> productList;

    public GridViewProductAdapter(ArrayList<Product> productList, Context context) {
        this.productList = productList;
        this.context = context;
    }

    @Override
    public int getCount() {
        return this.productList.size();
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
        View view =
                LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.layout_product, null);

        TextView lblProductName = view.findViewById(R.id.lblProductName);
        ImageView imgProduct = view.findViewById(R.id.imgProduct);
        lblProductName.setText(this.productList.get(position).getName());
        String url = context.getString(R.string.base_img_url) + this.productList.get(position).getImg();
        Picasso.get()
                .load(url)
                .into(imgProduct);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context.getApplicationContext(), ProductActivity.class);
                intent.putExtra("product_id", productList.get(position).getId());
                context.startActivity(intent);
            }
        });

        return view;
    }
}
