const api = (function (CookiesCtrl) {

    const baseUrl = 'http://localhost:4000/api/'; //API URL

    const cookies = CookiesCtrl.getCookieStrings();

    const config = {
        headers: {
            //'content-type' : 'application/json'
            'auth-token': CookiesCtrl.getCookie(cookies.cookieUTName)
        }
    };

    function login(username, password, rememberme) {
        var url = baseUrl + 'user/login';
        var data = {
            "username": username,
            "password": password,
            "rememberme": rememberme
        };

        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);

        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function getUser(id) {
        var url = baseUrl + 'user/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getUsers() {
        var url = baseUrl + 'user/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getUserMeta() {
        var url = baseUrl + 'user/meta';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addUser(data) {
        var url = baseUrl + 'user';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        
        return fetch(url, {method: 'POST', body:data, ...config});
    }

    function updateUser(id, data) {
        var url = baseUrl + 'user/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    function validateUserToken() {
        var url = baseUrl + 'user/validate';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getSelf() {
        var id = CookiesCtrl.getCookie(cookies.cookieUIName);
        var url = baseUrl + 'user/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getProducts() {
        var url = baseUrl + 'product/products/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getProduct(id) {
        var url = baseUrl + 'product/products/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addProduct(data) {
        var url = baseUrl + 'product/products';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        
        return fetch(url, {method: 'POST', body:data, ...config});
    }

    function updateProduct(id, data) {
        var url = baseUrl + 'product/products/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        // config.headers["content-type"] = 'application/json';
        // setTimeout(() => {
        //     config.headers["content-type"] = '';
        // }, 5000);
        return fetch(url, {method: 'PUT', body:data, ...config});
    }

    function getProductsMeta() {
        var url = baseUrl + 'product/products/meta';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getCategories() {
        var url = baseUrl + 'product/categories/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getCategory(id) {
        var url = baseUrl + 'product/categories/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addCategory(data) {
        var url = baseUrl + 'product/categories/';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function updateCategory(id, data) {
        var url = baseUrl + 'product/categories/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    function getBrands() {
        var url = baseUrl + 'product/brands/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getBrand(id) {
        var url = baseUrl + 'product/brands/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addBrand(data) {
        var url = baseUrl + 'product/brands/';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function updateBrand(id, data) {
        var url = baseUrl + 'product/brands/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    function getAttributes() {
        var url = baseUrl + 'product/attributes/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getAttribute(id) {
        var url = baseUrl + 'product/attributes/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addAttribute(data) {
        var url = baseUrl + 'product/attributes/';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function updateAttribute(id, data) {
        var url = baseUrl + 'product/attributes/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    function getSubcategories() {
        var url = baseUrl + 'product/subcategories/all';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function getSubcategory(id) {
        var url = baseUrl + 'product/subcategories/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);

        return fetch(url, {method: 'GET', ...config});
    }

    function addSubcategory(data) {
        var url = baseUrl + 'product/subcategories/';
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function updateSubcategory(id, data) {
        var url = baseUrl + 'product/subcategories/' + id;
        config.headers["auth-token"] = CookiesCtrl.getCookie(cookies.cookieUTName);
        config.headers["content-type"] = 'application/json';
        setTimeout(() => {
            config.headers["content-type"] = '';
        }, 5000);
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    return {
        login,
        getUser,
        getUsers,
        addUser,
        updateUser,
        getUserMeta,
        validateUserToken,
        getSelf,
        getProducts,
        getProduct,
        addProduct,
        updateProduct,
        getProductsMeta,
        getCategories,
        getCategory,
        addCategory,
        updateCategory,
        getBrands,
        getBrand,
        addBrand,
        updateBrand,
        getAttributes,
        getAttribute,
        addAttribute,
        updateAttribute,
        getSubcategories,
        getSubcategory,
        addSubcategory,
        updateSubcategory,
    };
})(COOKIES_CONTROLLER);