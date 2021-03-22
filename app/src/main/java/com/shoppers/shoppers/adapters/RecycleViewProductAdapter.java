package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.ProductActivity;
import com.shoppers.shoppers.activities.ProfileActivity;
import com.shoppers.shoppers.models.Product;

import java.util.ArrayList;

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
                        .inflate(R.layout.layout_product_recyclerview, parent, false);
        return new RecycleViewProductAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecycleViewProductAdapter.ViewHolder holder, int position) {
        holder.lblProductName.setText(this.products.get(position).getName());
        holder.imgProduct.setImageResource(Integer.valueOf(this.products.get(position).getImg()));

        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                context.startActivity(new Intent(context, ProductActivity.class));
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

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            lblProductName = itemView.findViewById(R.id.lblProductName);
            imgProduct = itemView.findViewById(R.id.imgProduct);
            cardView = itemView.findViewById(R.id.productCard);
        }
    }
}