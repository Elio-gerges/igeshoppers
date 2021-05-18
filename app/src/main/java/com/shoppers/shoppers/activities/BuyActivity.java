package com.shoppers.shoppers.activities;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.shoppers.shoppers.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import api.APIRequest;
import utils.Constants;
import utils.PreferenceUtils;
import utils.Utilities;

public class BuyActivity extends AppCompatActivity {

    private static final int LOCATION_CODE = 102;
    private Location mlocation;
    private FusedLocationProviderClient fusedLocationProviderClient;
    private ImageButton btnBack;
    private Button btnBuy;
    private EditText txtStreet, txtBuilding, txtCity, txtProvince, txtDay, txtMonth, txtYear, txtCvv, txtCardHolder;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_buy);
        Utilities.changeStatusBarColor(getWindow(), getResources());

        if(PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.KEY_CARTID) == null) {
            Toast.makeText(getApplicationContext(), "Cart is empty!", Toast.LENGTH_LONG).show();
            finish();
        }

//        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
//        fetchLastLocation();

        this.btnBack = this.findViewById(R.id.btnBack);

        this.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        this.btnBuy = findViewById(R.id.btnBuyNow);
        this.btnBuy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    createOrder();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        this.txtBuilding = findViewById(R.id.txtBuilding);
        this.txtCity = findViewById(R.id.txtCity);
        this.txtProvince = findViewById(R.id.txtProvince);
        this.txtStreet = findViewById(R.id.txtStreet);
        this.txtDay = findViewById(R.id.txtDay);
        this.txtMonth = findViewById(R.id.txtMonth);
        this.txtYear = findViewById(R.id.txtYear);
        this.txtCvv = findViewById(R.id.txtCVV);
        this.txtCardHolder = findViewById(R.id.txtCardHolder);

    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createOrder() throws JSONException {
        Response.Listener<JSONObject> jsonObjectListener = new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Toast.makeText(getApplicationContext(), "Order created successfully!", Toast.LENGTH_LONG).show();
                PreferenceUtils.getInstance(getApplicationContext()).removeValue(Constants.KEY_CARTID);
                finish();
            }
        };

        Response.ErrorListener errorListener = new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG).show();
            }
        };

        Map<String, String> headerParams = new HashMap<String, String>();
        headerParams.put("auth-token", PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.API_TOKEN_NAME));

        JSONObject requestBody = new JSONObject();

        JSONObject address = new JSONObject();

        requestBody.put("paid", true);
        address.put("long", "");
        address.put("lat", "");
        address.put("Street", this.txtStreet.getText().toString());
        address.put("building", this.txtBuilding.getText().toString());
        address.put("city", this.txtCity.getText().toString());
        address.put("province", this.txtProvince.getText().toString());
        requestBody.put("address", address);
        String url = getString(R.string.base_url) + "/orders/fromCart/" + PreferenceUtils.getInstance(getApplicationContext()).getValue(Constants.KEY_CARTID);
        int method = Request.Method.POST;

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

//    private void fetchLastLocation() {
//        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(this, new String[]
//                    {Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_CODE);
//            return;
//        }
//        Task<Location> task = fusedLocationProviderClient.getLastLocation();
//        task.addOnSuccessListener(new OnSuccessListener<Location>() {
//            @Override
//            public void onSuccess(Location location) {
//                if(location != null) {
//                    mlocation = location;
//                    Log.d("Location TAG", "onSuccess: long: " + mlocation.getLongitude() + ", lat: " + mlocation.getLatitude());
//                    SupportMapFragment supportMapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.google_map);
//                    supportMapFragment.getMapAsync(BuyActivity.this);
//                }
//            }
//        });
//    }

//    @Override
//    public void onMapReady(GoogleMap googleMap) {
//        LatLng latLng = new LatLng(mlocation.getLatitude(), mlocation.getLongitude());
//        Log.d("Location TAG", "onSuccess: long: " + latLng.longitude + ", lat: " + latLng.latitude);
//    }
//
//    @Override
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
//        switch (requestCode) {
//            case LOCATION_CODE:
//                if(grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    fetchLastLocation();
//                }
//                break;
//        }
//    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}