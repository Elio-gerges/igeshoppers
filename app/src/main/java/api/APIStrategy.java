package api;

import android.util.Log;

import com.shoppers.shoppers.models.Category;
import com.shoppers.shoppers.models.Product;
import com.shoppers.shoppers.models.Subcategory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import utils.Utilities;

public class APIStrategy {

    private static final String TAG = "APIStrategy";
    private static APIStrategy self;

    public APIStrategy() {}

    public static APIStrategy getInstance() {
        if(self == null) {
            self = new APIStrategy();
        }

        return self;
    }

    public ArrayList<Category> formatCategories(JSONArray list) throws JSONException {

        ArrayList<Category> categoriesList = new ArrayList<>();
        for (int i = 0; i < list.length(); i++) {
            JSONObject category = list.getJSONObject(i);
            if(category.getBoolean("status")) {
                categoriesList.add(new Category(category.getString("name"), category.getString("_id")));
            }
        }

        return categoriesList;
    }

    public ArrayList<Subcategory> formatSubcategories(JSONArray list) throws JSONException {

        ArrayList<Subcategory> subcategoriesList = new ArrayList<>();
        for (int i = 0; i < list.length(); i++) {
            JSONObject subcategory = list.getJSONObject(i);
            if(subcategory.getBoolean("status")) {
                subcategoriesList.add(new Subcategory(subcategory.getString("name"), subcategory.getString("_id")));
            }
        }

        return subcategoriesList;
    }

    public ArrayList<Product> formatProduct(JSONArray list) throws JSONException {

        ArrayList<Product> productsList = new ArrayList<>();
        for (int i = 0; i < list.length(); i++) {
            JSONObject product = list.getJSONObject(i);
            if(product.getBoolean("status")) {
                productsList.add(
                        new Product(
                                product.getString("_id"),
                                product.getString("name"),
                                product.getString("image")));
            }
        }

        return productsList;
    }

    public ArrayList<Product> formatCartProduct(JSONArray list) throws JSONException {

        ArrayList<Product> productsList = new ArrayList<>();
        for (int i = 0; i < list.length(); i++) {
            JSONObject product = list.getJSONObject(i);
            //(String id, String name, String img, double price, double qtt
            productsList.add(
                    new Product(
                            product.getString("_id"),
                            product.getString("name"),
                            product.getString("img"),
                            Double.valueOf(product.getString("price")),
                            Double.valueOf(product.getString("qtt"))
                    )
            );
        }

        return productsList;
    }

    public ArrayList<Product> formatFewProduct(JSONArray list) throws JSONException {

        ArrayList<Product> productsList = new ArrayList<>();
        for (int i = 0; i < list.length(); i++) {
            JSONObject product = list.getJSONObject(i);
            //(String id, String name, String img, double price, double qtt
            if(product.getBoolean("status")) {
                productsList.add(
                        new Product(
                                product.getString("_id"),
                                product.getString("name"),
                                product.getString("image"),
                                Utilities.calculatePrice(product),
                                1
                        )
                );
            }
        }

        return productsList;
    }
}
