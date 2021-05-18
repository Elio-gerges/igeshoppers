package api;

import android.content.Context;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.shoppers.shoppers.R;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class APIRequest {

    private static final String TAG = "SimpleRequestQueueFactory";
    private static APIRequest self;


    private static Context mcontext;
    private SimpleRequestQueueFactory factory;

    private APIRequest(Context context) {
        try {
            this.factory = SimpleRequestQueueFactory.getInstance(context);
            mcontext = context;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static APIRequest getInstance(Context context) {
        if(self == null) {
            self = new APIRequest(context);
        }

        return self;
    }

    public void sendRequest(int method,
                            String url,
                            JSONObject JSONRequest,
                            Response.Listener<org.json.JSONObject> listener,
                            Response.ErrorListener errorListener,
                            Map<String, String> requestParams) throws Exception {
        final JsonObjectRequest jsonObjectRequest =
                new JsonObjectRequest(method, url, null, listener, errorListener) {
                    @Override
                    public String getBodyContentType() {
                        return "application/json; charset=utf-8";
                    }

                    @Override
                    public byte[] getBody() {
                        try {
                            return JSONRequest == null ? null : JSONRequest.toString().getBytes("utf-8");
                        } catch (UnsupportedEncodingException uee) {
                            return null;
                        }
                    }

                    @Override
                    public Map<String, String> getHeaders() throws AuthFailureError {
                        Map<String, String> params = requestParams;

                        return params;
                    }
                };
        jsonObjectRequest.setRetryPolicy(new DefaultRetryPolicy(10000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        this.factory.getQueue().add(jsonObjectRequest);
    }
}
