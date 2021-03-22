package com.shoppers.shoppers.adapters;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.shoppers.shoppers.R;

import java.util.ArrayList;

public class RecycleViewCategoriesAdapter extends RecyclerView.Adapter<RecycleViewCategoriesAdapter.ViewHolder> {

    private static final String TAG = "RecycleViewCategoriesAdapter";
    private ArrayList<String> categories;
    private Context context;

    public RecycleViewCategoriesAdapter(Context context, ArrayList<String> categories) {
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
        holder.lblCategory.setText(this.categories.get(position));

        holder.lblCategory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Intent categoryIntent = new Intent(context, CategoryActivity.class);
                // categoryIntent.putExtra("Category", categories.get(position));
                // context.startActivity(categoryIntent);
                Log.d(TAG, "onClick: Click on " + categories.get(position));
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
