package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.shoppers.shoppers.R;
import com.shoppers.shoppers.activities.CategoryActivity;
import com.shoppers.shoppers.activities.SubcategoryActivity;
import com.shoppers.shoppers.models.Category;

import java.util.ArrayList;

public class RecycleViewCategoriesAdapter extends RecyclerView.Adapter<RecycleViewCategoriesAdapter.ViewHolder> {

    private static final String TAG = "RecycleViewCategoriesAdapter";
    private ArrayList<Category> categories;
    private Context context;

    public RecycleViewCategoriesAdapter(Context context, ArrayList<Category> categories) {
        this.categories = categories;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view =
                LayoutInflater.from(parent.getContext())
                .inflate(R.layout.layout_categories_list, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.lblCategory.setText(this.categories.get(position).getName());

        holder.lblCategory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                 Intent categoryIntent = new Intent(context, CategoryActivity.class);
                 categoryIntent.putExtra("Category_id", categories.get(position).getId());
                categoryIntent.putExtra("Category_name", categories.get(position).getName());
                 context.startActivity(categoryIntent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return this.categories.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private TextView lblCategory;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            lblCategory = itemView.findViewById(R.id.lblCategory);
        }
    }
}
