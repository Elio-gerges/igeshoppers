'use strict';

// UI Controller
const Login_UICONTROLLER = (function () {
    const DOMstrings = {
        // cookieUName: "shoppersbackofficeu",
        // cookieUTName: "shoppersbackofficet",
        // cookieUIName: "shoppersbackofficeui",
        // cookieExpire: 355,
        // cookieExpire1h: 0.041,
        
        btnLogin: "#btnLogin",

        txtUsername: "#username-input",
        txtPassword: "#password-input",

        chkRememberMe: "#flexCheckDefault"
    };

    return {
        getUIDOMStrings: function() {
            return DOMstrings;
        },

        toggleClass: function(elem, cls){
            elem.classList.toggle(cls);
        },

        addClass: function(elem, cls){
            if(!elem.classList.contains(cls))
                elem.classList.add(cls);   
        },
 
        removeClass: function(elem, cls){
            if(elem.classList.contains(cls))
                elem.classList.remove(cls);   
        },

        addEventToElement: function(elem, evnt, fnct, args) {
            elem.addEventListener(evnt, () => {
                fnct.apply(args);
            });
        },

        getQS: function (el) {
            return document.querySelector(el);
        }
    }
})();

// User APP CONTROLLER
var UIUserModalController = (function(UICtrl, APICtrl, CookiesCtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();
    var cookies = CookiesCtrl.getCookieStrings();

    var setupEventListeners = function() {
        UICtrl.getQS(DOM.btnLogin).addEventListener('click', (e) => {
            checkLogin(e);
        });
    };

    function checkLogin(e) {
        e.preventDefault();

        var u = UICtrl.getQS(DOM.txtUsername).value;

        if(!u) {
            swal({
                title: "Missing Field",
                text: "Username is required!",
                icon: "error",
                dangerMode: true,
            });
            return ;
        }

        var p = UICtrl.getQS(DOM.txtPassword).value;

        if(!p) {
            swal({
                title: "Missing Field",
                text: "Password is required!",
                icon: "error",
                dangerMode: true,
            });
            return ;
        }

        var r = UICtrl.getQS(DOM.chkRememberMe).checked;

        APICtrl.login(u, p, r)
        .then(response => response.json())
        .then(result => {
            if(result.error) {
                swal({
                    title: "Login Error",
                    text: result.error_message,
                    icon: "error",
                    dangerMode: true,
                });
            } else {
                CookiesCtrl.setCookie(cookies.cookieUName, u, cookies.cookieExpire);

                if(r) {
                    CookiesCtrl.setCookie(cookies.cookieUIName, result.emp_id, cookies.cookieExpire);
                    CookiesCtrl.setCookie(cookies.cookieUTName, result.auth_token, cookies.cookieExpire);
                    CookiesCtrl.setCookie(cookies.cookieIsRememberMe, true, cookies.cookieExpire);
                } else {
                    CookiesCtrl.emptyCookie(cookies.cookieUIName);
                    CookiesCtrl.emptyCookie(cookies.cookieUTName);
                    CookiesCtrl.setCookie(cookies.cookieUTName, result["auth_token"], cookies.cookieExpire1h);
                    CookiesCtrl.setCookie(cookies.cookieUIName, result["emp_id"], cookies.cookieExpire1h);
                }

                swal({
                    title: "Successful Login",
                    text: "You are being redirected!",
                    icon: "success",
                    dangerMode: true,
                });
                
                setTimeout(() => {
                    window.location.replace('/main.html');
                }, 2500);
            }
        })
        .catch(err => {
            swal({
                title: "Error",
                text: err,
                icon: "error",
                dangerMode: true,
            });
        });
    }
    
    function checkCookie() {
        var user = CookiesCtrl.getCookie(cookies.cookieUName);
        var token = CookiesCtrl.getCookie(cookies.cookieUTName);

        if(token) {
            APICtrl.validateUserToken(token)
            .then(response => response.json())
            .then(result => {
                if(result.valid) {
                    window.location.replace('./main.html');
                } else {
                    UICtrl.getQS(DOM.txtUsername).value = user;
                    UICtrl.getQS(DOM.chkRememberMe).checked = true;
                }
            });
        }
    }
 
    return {
        init: function() {
            checkCookie();
            setupEventListeners();
        }
    };
 
})(Login_UICONTROLLER, api, COOKIES_CONTROLLER);
 
window.addEventListener('load', function () {
    UIUserModalController.init(); 
});