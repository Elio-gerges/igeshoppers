'use strict';

// Common UI Controller
const COMMON_UICONTROLLER = (function (api) {
    const DOMstrings = {
        btnThemeSwitcher: '#themeSwitcher',
        btnMenuToggler: '#menuToggler',

        btnLogout: "#btnLogout",

        imgUser: '#userAvatar',
    };

    const COLORStrings = {
        primaryColor: '#4834d4',
        warningColor: '#f0932b',
        successColor: '#6ab04c',
        dangerColor: '#eb4d4b',
    }

    const THEMEStrings = {
        themeCookieName: 'theme',
        themeDark: 'dark',
        themeLight: 'light',
    }

    return {
        getUIDOMStrings: function() {
            return DOMstrings;
        },

        getUICOLORStrings: function() {
            return COLORStrings;
        },

        getUITHEMEStrings: function() {
            return THEMEStrings;
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

        getFormatDate: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            return [month, day, year].join('-');
        },

        getQS: function (el) {
            return document.querySelector(el);
        },

        validateAccess: function () {
            return api.validateUserToken()
            .then(response => response.json())
            .then(result => {
                if(!result.valid) {
                    window.location.replace('./index.html');
                }
            })
            .catch(err => {
                console.log('err', err);
            });
        },

        findChanges: function (newest, oldest) {
            var keys = Object.keys(newest);
            var data = {};
    
            keys.forEach(key => {
                if(newest[key] !== oldest[key]) {
                    data[key] = newest[key];
                }
            });
            
            return data;
        },

        showErrorMessage: function(alertTitle, alertMessage) {
            swal({
                title: alertTitle,
                text: alertMessage,
                icon: "error",
                dangerMode: true,
            });
        }
    }
})(api);

// GLOBAL APP CONTROLLER
var UIModalController = (function(UICtrl, CookieCtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();
    var cookies = CookieCtrl.getCookieStrings();
    var themes = UICtrl.getUITHEMEStrings();
    var body = null;

    var setupEventListeners = function() {

        window.onclick = function(event) {
            openCloseDropdown(event);
        }

        UICtrl.addEventToElement(document.querySelector(DOM.btnMenuToggler), 'click', collapseSidebar);
        UICtrl.addEventToElement(document.querySelector(DOM.btnThemeSwitcher), 'click', switchTheme);
        UICtrl.addEventToElement(document.querySelector(DOM.btnLogout), 'click', logout);
    };

    function loadTheme() {
        //var theme = getCookie(themeCookieName); 
        //TODO: Can be used if we want to allow the 
        //TODO:    the user to save is preference.

        //Using daytime to determine theme
        var theme = getDatetimeTheme();
        body.classList.add(theme === "" ? themeLight : theme);
    }

    function getDatetimeTheme() {
        let hours = new Date().getHours();
        let isDayTime = hours > 6 && hours < 18;
        if(isDayTime) {
            return themes.themeLight;
        }
        return themes.themeDark;
    }

    function closeAllDropdown() {
        var dropdowns = document.getElementsByClassName('dropdown-expand');
        for (var i = 0; i < dropdowns.length; i++) {
            //.classList.remove();
            UICtrl.removeClass(dropdowns[i], 'dropdown-expand');
        }
    }

    function openCloseDropdown(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            // 
            // Close dropdown when click out of dropdown menu
            // 
            closeAllDropdown();
        } else {
            var toggle = event.target.dataset.toggle;
            var content = document.getElementById(toggle);
            if (content.classList.contains('dropdown-expand')) {
                closeAllDropdown();
            } else {
                closeAllDropdown();
                content.classList.add('dropdown-expand');
            }
        }
    }

    function switchTheme() {
        if (body.classList.contains(themes.themeLight)) {
            body.classList.remove(themes.themeLight);
            body.classList.add(themes.themeDark);
            //TODO: Remove in case of cookies
            //setCookie(themeCookieName, themeDark);
        } else {
            body.classList.remove(themes.themeDark);
            body.classList.add(themes.themeLight);
            //TODO: Remove in case of cookies
            //setCookie(themeCookieName, themeLight);
        }
    }

    function collapseSidebar() {
        UICtrl.toggleClass(body, 'sidebar-expand');
    }

    function loadPersonalDetails() {
        api.getSelf()
        .then(response => response.json())
        .then(result => {
            UICtrl.getQS(DOM.imgUser).src = result.user.picture.replace("public", "");
        });
    }

    function logout() {
        if(CookieCtrl.getCookie(cookies.cookieIsRememberMe))
        window.location.replace('./index.html');
    }
 
    return {
        init: function() {
            body = document.body;
            loadTheme();
            loadPersonalDetails();
            setupEventListeners();
        }
    };
 
})(COMMON_UICONTROLLER, COOKIES_CONTROLLER);
 
window.addEventListener('DOMContentLoaded', function () {
    UIModalController.init(); 
});