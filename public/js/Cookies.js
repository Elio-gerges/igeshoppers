'use strict';

// Cookies Controller
const COOKIES_CONTROLLER = (function () {
    const cookieStrings = {
        cookieUName: "shoppersbackofficeu",
        cookieUTName: "shoppersbackofficet",
        cookieUIName: "shoppersbackofficeui",
        cookieIsRememberMe: "shoppersbackofficeuisrememberme",
        cookieExpire: 355,
        cookieExpire1h: 0.041,
    };

    return {
        getCookieStrings: function() {
            return cookieStrings;
        },

        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        emptyCookie: function (cname) {
            document.cookie = cname + "=;";
        }
    }
})();