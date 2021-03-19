'use strict';

// UI Controller
const Product_UICONTROLLER = (function () {
    const DOMstrings = {

        // Form IDs
        fileProfilePicture: '#fileProfilePicture',
        frmDetails: "#frmDetails",
        imgProfilePicture: "#imgProfilePicture",

        btnSubmit: "#btnSubmit",

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
    }
})();

// User APP CONTROLLER
var UIUserModalController = (function(UICtrl, APICtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();

    var selectedID = null;
    var selectedData = null;

    var setupEventListeners = function() {
        UICtrl.addEventToElement(getQS(DOM.imgProfilePicture), 'click', () => { getQS(DOM.fileProfilePicture).click();});
        UICtrl.addEventToElement(getQS(DOM.fileProfilePicture), 'change', handleFileProfilePictureChange);
        
        getQS(DOM.btnSubmit).addEventListener('click', (e) => {
            e.preventDefault();
            var result = getData(getQS(DOM.frmDetails));
            if(result != -1 ) {
                if(!selectedID) {
                    onAddData(e, result);
                } else {
                    onUpdateData(e, result);
                }
            }
        });
    };

    function getData(form) {
        try {
            var product =  {
                name: form.elements["name"].value,
                subcategory_id: form.elements["subcategory_id"].value,
                brand_id: form.elements["brand_id"].value,
                attribute_id: form.elements["attribute_id"].value,
                description: form.elements["description"].value,
                barcode: form.elements["barcode"].value,
                nutritionfacts: {
                    servings_per_container: form.elements["servings_per_container"].value,
                    serving_size: parseInt(form.elements["serving_size"].value),
                    calories: parseInt(form.elements["calories"].value),
                    total_fat: parseInt(form.elements["total_fat"].value),
                    total_fat_percentage: parseInt(form.elements["total_fat_percentage"].value),
                    saturated_fat: parseInt(form.elements["saturated_fat"].value),
                    saturated_fat_percentage: parseInt(form.elements["saturated_fat_percentage"].value),
                    trans_fat: parseInt(form.elements["trans_fat"].value),
                    cholesterol: parseInt(form.elements["cholesterol"].value),
                    cholesterol_percentage: parseInt(form.elements["cholesterol_percentage"].value),
                    soduim: parseInt(form.elements["soduim"].value),
                    soduim_percentage: parseInt(form.elements["soduim_percentage"].value),
                    carbohydrates: parseInt(form.elements["carbohydrates"].value),
                    carbohydrates_percentage: parseInt(form.elements["carbohydrates_percentage"].value),
                    fibers: parseInt(form.elements["fibers"].value),
                    fibers_percentage: parseInt(form.elements["fibers_percentage"].value),
                    total_sugar: parseInt(form.elements["total_sugar"].value),
                    added_sugar: parseInt(form.elements["added_sugar"].value),
                    added_sugar_percentage: parseInt(form.elements["added_sugar_percentage"].value),
                    protein: parseInt(form.elements["protein"].value),
                    vitamin_d: parseInt(form.elements["vitamin_d"].value),
                    vitamin_d_percentage: parseInt(form.elements["vitamin_d_percentage"].value),
                    calcium: parseInt(form.elements["calcium"].value),
                    calcium_percentage: parseInt(form.elements["calcium_percentage"].value),
                    iron: parseInt(form.elements["iron"].value),
                    iron_percentage: parseInt(form.elements["iron_percentage"].value),
                    potassium: parseInt(form.elements["potassium"].value),
                    potassium_percentage: parseInt(form.elements["potassium_percentage"].value),
                },
                volume: {
                    width: parseInt(form.elements["width"].value),
                    height: parseInt(form.elements["height"].value),
                    depth: parseInt(form.elements["depth"].value),
                },
                inventory: {
                    stock_qtt: parseInt(form.elements["stock_qtt"].value),
                    cost: parseInt(form.elements["cost"].value),
                    vat: parseInt(form.elements["vat"].value),
                    profit_margin: parseInt(form.elements["profit_margin"].value),
                    min_stock_level: parseInt(form.elements["min_stock_level"].value),
                },
                status: form.elements["status"].value == "active" ? true : false,
            };

            ["barcode", "name", "description"]
            .forEach(key => {
                if (!product[key] || product[key] == "") {
                    throw new Error(`${capitalize(removeUnderScores(key))} is required.`);
                }
            });

            ['subcategory_id', 'brand_id', 'status', 'attribute_id']
            .forEach(n => {
                if(form.elements[n].value == "N/A") {
                    var name = "";
                    switch(n) {
                        case "subcategory_id":
                            name = "Subcategory";
                            break;
                        case "brand_id":
                            name = "Brand";
                            break;
                        case "attribute_id":
                            name = "Attribute";
                            break;
                        case "status":
                            name = "Status";
                            break;
                        default:
                            throw new Error('Conception Error! @ Product JS in getData func!');
                    }
                    throw new Error(`${name} is required.`);
                }
            });

            var file = getQS(DOM.fileProfilePicture);
            var fileValue = getFile(file.value);
            if(fileValue) {
                var fileExtension = fileValue.split('.')[1];

                if(fileExtension.toLowerCase() != "png" && fileExtension.toLowerCase() != "jpg") {
                    throw new Error("Image formats should be PNG or JPG");
                }
            }

            validateRequired(product.nutritionfacts);
            validateRequired(product.inventory);
            validateRequired(product.volume);

            return product;

        } catch (error) {
            COMMON_UICONTROLLER.showErrorMessage(error);
            return -1;
        }
    }

    function getFile(filePath) {
        return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }

    function validateRequired(data) {
        var keys = Object.keys(data);
        keys.forEach(key => {
            if (key == "servings_per_container") {
                if (((data[key] + "") == "")) {
                    throw new Error(`${capitalize(removeUnderScores(key.replace("percentage", "%")))} is required.`);
                }
            } else {
                if (((data[key] + "") == "") || isNaN(data[key])) {
                    throw new Error(`${capitalize(removeUnderScores(key.replace("percentage", "%")))} is required.`);
                }
            }
        });
    }

    function removeUnderScores(data) {
        while (data.indexOf("_") != -1) {
            data = data.replace("_", " ");
        }

        return data;
    }

    function capitalize(string) {
        const words = string.split(" ");
        var phrase = "";

        for (let i = 0; i < words.length; i++) {
            phrase += " " + words[i][0].toUpperCase() + words[i].substr(1);
        }

        return phrase;
    }

    function validateFormData(data) {
        var formData = new FormData();
        formData.append("nutritionfacts", JSON.stringify(data.nutritionfacts));
        formData.append("inventory", JSON.stringify(data.inventory));
        formData.append("volume", JSON.stringify(data.volume));
        formData.append("image", getQS(DOM.fileProfilePicture).files[0]);
        formData.append("name", data.name);
        formData.append("status", data.status);
        formData.append("subcategory_id", data.subcategory_id);
        formData.append("brand_id", data.brand_id);
        formData.append("attribute_id", data.attribute_id);
        formData.append("description", data.description);
        formData.append("barcode", data.barcode);

        return formData;
    }

    function handleFileProfilePictureChange() {
        getQS(DOM.imgProfilePicture).src = window.URL.createObjectURL(getQS(DOM.fileProfilePicture).files[0])
    }

    function getQS(el) {
        return document.querySelector(el);
    }

    function onAddData(e, result) {
        try {
            e.preventDefault();
            var data = validateFormData(result);
            swal({
                title: "Are you sure?",
                text: "You are about to create a new Product!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willUpdate) => {
                if (willUpdate) {
                    APICtrl.addProduct(data)
                    .then(response => response.json())
                    .then(result => {
                        if(result.error) {
                            COMMON_UICONTROLLER.showErrorMessage("Error!", result.error_message);
                            return ;
                        } else {
                            swal(`Here You Go! Product added successfully!`, {
                                icon: "success",
                            });
                            setTimeout(() => {window.location.replace('./products.html')}, 1500);
                        }
                    })
                    .catch(err => {
                        COMMON_UICONTROLLER.showErrorMessage("Error!", "Failed to Add Product");
                        console.log('err @ Product.js', err);
                    });
                } else {
                  swal({
                    title: "Okay!",
                    text: "Adding Product Discarded!"
                });
                }
            });
        } catch (error) {
            COMMON_UICONTROLLER.showErrorMessage("Input Error!", error.message);
        }
    }

    function onUpdateData(e, result) {
        e.preventDefault();
        var data = validateFormData(result);
        swal({
            title: "Are you sure?",
            text: `You are about to update a the Product: ${selectedData.name}!`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willUpdate) => {
            if (willUpdate) {
                APICtrl.updateProduct(selectedID, data)
                .then(response => response.json())
                .then(result => {
                    if(result.error) {
                        COMMON_UICONTROLLER.showErrorMessage("Error!", result.error_message);
                        return ;
                    } else {
                        swal(`Here You Go! Product ${selectedData.name} updated successfully!`, {
                            icon: "success",
                        });
                        setTimeout(() => {window.location.replace('./products.html')}, 1500);
                    }
                })
                .catch(err => {
                    COMMON_UICONTROLLER.showErrorMessage("Error!", "Failed to Update Product");
                });
            } else {
                swal({
                    title: "Okay!",
                    text: "Update Discarded!"
                });
            }
        });
    }

    function getAPIData() {
        var puid = new URLSearchParams(window.location.search).get("puid");
        if(puid) {
            selectedID = puid;
            APICtrl.getProduct(puid)
            .then(response => response.json())
            .then(result => {
                populateFormData(result.product);
                selectedData = result.product;
                getQS(DOM.btnSubmit).value = "Update";
            })
            .catch(err => {
                COMMON_UICONTROLLER.showErrorMessage("Error!", err);
            });
        }
    }

    function selectOption(array, parentElement, childNode) {
        for (var i=0; i<array.length; i++) {
            if(array[i].value === parentElement[childNode]) {
                array[i].selected = true;
            }
        }
    }

    function populateFormData(product) {
        var form = getQS(DOM.frmDetails);
        form.elements["name"].value = product["name"];
        var subcategories = form.elements["subcategory_id"].options;
        var brands = form.elements["brand_id"];
        var status = form.elements["status"];
        var attributes = form.elements["attribute_id"];
        selectOption(subcategories, product, "subcategory_id");
        selectOption(brands, product, "brand_id");
        selectOption(attributes, product, "attribute_id");
        for (var i=0; i<status.length; i++) {
            if(status[i].value === (product.status == 1 ? "active" : "inactive")) {
                status[i].selected = true;
            }
        }
        form.elements["description"].value = product["description"];
        form.elements["barcode"].value = product["barcode"];

        getQS(DOM.imgProfilePicture).src = product["image"].replace("public", "");
        getQS(DOM.fileProfilePicture).disabled = true;

        form.elements["servings_per_container"].value = product["nutritionfacts"]["servings_per_container"];
        form.elements["serving_size"].value = product["nutritionfacts"]["serving_size"];
        form.elements["calories"].value = product["nutritionfacts"]["calories"];
        form.elements["total_fat"].value = product["nutritionfacts"]["total_fat"];
        form.elements["total_fat_percentage"].value = product["nutritionfacts"]["total_fat_percentage"];
        form.elements["saturated_fat"].value = product["nutritionfacts"]["saturated_fat"];
        form.elements["saturated_fat_percentage"].value = product["nutritionfacts"]["saturated_fat_percentage"];
        form.elements["trans_fat"].value = product["nutritionfacts"]["trans_fat"];
        form.elements["cholesterol"].value = product["nutritionfacts"]["cholesterol"];
        form.elements["cholesterol_percentage"].value = product["nutritionfacts"]["cholesterol_percentage"];
        form.elements["soduim"].value = product["nutritionfacts"]["soduim"];
        form.elements["soduim_percentage"].value = product["nutritionfacts"]["soduim_percentage"];
        form.elements["carbohydrates"].value = product["nutritionfacts"]["carbohydrates"];
        form.elements["carbohydrates_percentage"].value = product["nutritionfacts"]["carbohydrates_percentage"];
        form.elements["fibers"].value = product["nutritionfacts"]["fibers"];
        form.elements["fibers_percentage"].value = product["nutritionfacts"]["fibers_percentage"];
        form.elements["total_sugar"].value = product["nutritionfacts"]["total_sugar"];
        form.elements["added_sugar"].value = product["nutritionfacts"]["added_sugar"];
        form.elements["added_sugar_percentage"].value = product["nutritionfacts"]["added_sugar_percentage"];
        form.elements["protein"].value = product["nutritionfacts"]["protein"];
        form.elements["vitamin_d"].value = product["nutritionfacts"]["vitamin_d"];
        form.elements["vitamin_d_percentage"].value = product["nutritionfacts"]["vitamin_d_percentage"];
        form.elements["calcium"].value = product["nutritionfacts"]["calcium"];
        form.elements["calcium_percentage"].value = product["nutritionfacts"]["calcium_percentage"];
        form.elements["iron"].value = product["nutritionfacts"]["iron"];
        form.elements["iron_percentage"].value = product["nutritionfacts"]["iron_percentage"];
        form.elements["potassium"].value = product["nutritionfacts"]["potassium"];
        form.elements["potassium_percentage"].value = product["nutritionfacts"]["potassium_percentage"];
        form.elements["width"].value = product["volume"]["width"];
        form.elements["height"].value = product["volume"]["height"];
        form.elements["depth"].value = product["volume"]["depth"];
        form.elements["stock_qtt"].value = product["inventory"]["stock_qtt"];
        form.elements["cost"].value = product["inventory"]["cost"];
        form.elements["vat"].value = product["inventory"]["vat"];
        form.elements["profit_margin"].value = product["inventory"]["profit_margin"];
        form.elements["min_stock_level"].value = product["inventory"]["min_stock_level"];
    }

    function populateMetaData(meta) {
        var form = getQS(DOM.frmDetails);
        var drpSubcategories = form.elements["subcategory_id"];
        meta["subcategories"].forEach(subcategory => {
            if(subcategory.status === true) {
                drpSubcategories.insertAdjacentHTML('beforeend', `
                    <option name='subcategory' value="${subcategory.id}">${subcategory.name}</option>
                `);
            }
        });
        var drpBrands = form.elements["brand_id"];
        meta["brands"].forEach(brand => {
            if(brand.status === true) {
                drpBrands.insertAdjacentHTML('beforeend', `
                    <option name='brand' value="${brand.id}">${brand.name}</option>
                `);
            }
        });
        var drpAttributes = form.elements["attribute_id"];
        meta["attributes"].forEach(attribute => {
            if(attribute.status === true) {
                drpAttributes.insertAdjacentHTML('beforeend', `
                    <option name='attribute' value="${attribute.id}">${attribute.name}</option>
                `);
            }
        });
    }

    function loadMeta() {
        APICtrl.getProductsMeta()
        .then(response => response.json())
            .then(result => {
                populateMetaData(result.meta);
                getAPIData();
            })
            .catch(err => {
                COMMON_UICONTROLLER.showErrorMessage("Error!", err);
            });
    }
 
    return {
        init: function() {
            loadMeta();
            setupEventListeners();
        }
    };
 
})(Product_UICONTROLLER, api);
 
window.addEventListener('load', function () {
    UIUserModalController.init(); 
});