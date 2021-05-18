package utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.shoppers.shoppers.R;

public class PreferenceUtils {

    private static PreferenceUtils self;
    private Context context;

    private PreferenceUtils(Context context) {
        this.context = context;
    }

    public static PreferenceUtils getInstance(Context context) {
        if(self == null) {
            self = new PreferenceUtils(context);
        }

        return self;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public boolean saveUserID(String userid) {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString(Constants.KEY_USERID, AES.getInstance(context).encrypt(userid));
            editor.apply();
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public boolean saveKeyValue(String key, String value) {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString(key, AES.getInstance(context).encrypt(value));
            editor.apply();
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getUserID() {
        String toReturn = null;
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            toReturn = sharedPref.getString(Constants.KEY_USERID, null);
            toReturn = AES.getInstance(context).decrypt(toReturn);
        } catch (Exception e) {
            return null;
        }
        return toReturn;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getValue(String key) {
        String toReturn = null;
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            toReturn = sharedPref.getString(key, null);
            toReturn = AES.getInstance(context).decrypt(toReturn);
        } catch (Exception e) {
            return null;
        }
        return toReturn;
    }

    public boolean removeValue(String key) {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.remove(key);
            editor.apply();
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public boolean removeUserID() {
        try {
            SharedPreferences sharedPref = context.getSharedPreferences(
                    context.getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.remove(Constants.KEY_USERID);
            editor.apply();
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public boolean clearAll() {
        try {
            context.deleteSharedPreferences(context.getString(R.string.preference_file_key));
        } catch (Exception e) {
            return false;
        }
        return true;
    }

}
