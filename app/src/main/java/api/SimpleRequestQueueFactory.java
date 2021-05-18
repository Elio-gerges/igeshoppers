package api;

import android.content.Context;
import android.util.Log;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class SimpleRequestQueueFactory {

    private static final String TAG = "SimpleRequestQueueFactory";
    private static SimpleRequestQueueFactory self;

    private RequestQueue queue;
    private static Context context;

    private SimpleRequestQueueFactory(Context context) {
        SimpleRequestQueueFactory.context = context;
        this.queue = Volley.newRequestQueue(context);
    }

    public static SimpleRequestQueueFactory getInstance(Context c) throws Exception {
        if(c == null) {
            throw new Exception("Context is null; Error - Context should not be null;");
        }

        if(self == null || context != c) {
            self = new SimpleRequestQueueFactory(c);
        }

        return self;
    }

    public RequestQueue getQueue() {
        return this.queue;
    }
}
