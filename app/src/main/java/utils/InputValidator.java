package utils;

import android.os.Build;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.RequiresApi;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class InputValidator {

    //Validates input

    private static InputValidator self;

    private InputValidator(){}

    public static InputValidator getInstance() {
        if(self == null) {
            self = new InputValidator();
        }

        return self;
    }

    public boolean validateIfEmpty(EditText t) {
        return t.getText().toString().equals("") || t.getText().toString().isEmpty();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public boolean validateDate(TextView t) throws ParseException {
        boolean valid = false;

        if(t.getText().toString().equals("Click to set Date of Birth")) {
            return valid;
        }

        Date input = new SimpleDateFormat("dd/MM/yyyy").parse(t.getText().toString());
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate now = LocalDate.now();
        Date current = new SimpleDateFormat("dd/MM/yyyy").parse(dtf.format(now));

        if(input.after(current)) {
            return valid;
        }

        return !valid;
    }

}
