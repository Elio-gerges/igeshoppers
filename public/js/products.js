'use strict';

let dummyData = [
    {
        picture: "/imgs/img_prod/image001.png",
        barcode: "123456",
        name: "Product 1",
        subcategory: "Subcategory 1",
        attribute: "Attribute 1",
        cost: 3.99,
        price: 8.99,
        qtt: 10,
        status: 1,
        idForView: "123456",
    },
    {
        picture: "/imgs/img_prod/image001.png",
        barcode: "789012",
        name: "Product 2",
        subcategory: "Subcategory 2",
        attribute: "Attribute 2",
        cost: 5.99,
        price: 11.99,
        qtt: 14,
        status: 1,
        idForView: "789012",
    },
    {
        picture: "/imgs/img_prod/image001.png",
        barcode: "345678",
        name: "Product 3",
        subcategory: "Subcategory 3",
        attribute: "Attribute 3",
        cost: 1.99,
        price: 8.99,
        qtt: 9,
        status: 1,
        idForView: "345678",
    },
]

// UI Controller
const Product_UICONTROLLER = (function () {
    const DOMstrings = {
        listProducts: '#listProducts',

        informationHolder: '#informationHolder',
        btnCloseInformationHolder : '#btnCloseInformationHolder',

        animator: '.animator',

        //Products
        btnAdd: "#listAdd",
        btnListRefresh: "#listRefresh",
        listExport: '#listExport',
        dtProduct: "#datatable",

        columnsConfiguration: [
            {
                select: 0, 
                sortable: false,
            },
            {select: [1, 2, 3, 4, 5, 6, 7], sortable: true},
            {
                select: 8, 
                sortable: true,
                render: function(data, cell, row) {
                    if (data == "true" || data == "1") {
                        return '<span class="dot"><i class="bg-success"></i>Active</span>';
                    } else {
                        return '<span class="dot"><i class="bg-danger"></i>Inactive</span>';
                    }
                }
            },
            { 
                select: 9, 
                sortable: false,
                render: function(data, cell, row) {
                    cell.setAttribute("product_id", data);
                    return `<i class="far fa-eye ${DOMstrings.animator.replace(".", "")}" product_id="${data}"></i>`;
                }
            },
        ],

        tableHeadings : [
            "Image",
            "Barcode",
            "Name",
            "Subcategory",
            "Attribute",
            "Cost",
            "Price",
            "Qtt In Stock",
            "Status",
            ""
        ],

        tableLabels: {
            placeholder: "Search products...",
            perPage: "{select} products per page",
            noRows: "No products found",
            info: "Showing {start} to {end} of {rows} products",
        },

        tableLayout: {
            top: "{search}",
            bottom: "{select}{info}{pager}"
        },

        exportOptions : {
            filename: "Shoppers Back Office - Products List - " + COMMON_UICONTROLLER.getFormatDate(new Date()),
            type: "csv", // "csv", "txt", "json" or "sql"
        
            download: true, // trigger download of file or return the string
            // skipColumn: [], // array of column indexes to skip
        
            // csv
            // lineDelimiter:  "\n", // line delimiter for csv type
            // columnDelimiter:  ",", // column delimiter for csv type
        
            // sql
            // tableName: "myTable", // SQL table name for sql type
        
            // json
            // replacer: null, // JSON.stringify's replacer parameter for json type
            // space: 4 // JSON.stringify's space parameter for json type
        },
        perPage: 10
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

// Products APP CONTROLLER
var UIProductsModalController = (function(UICtrl, APICtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();

    var datatable = null;
    var meta = null;

    var setupEventListeners = function() {
        UICtrl.addEventToElement(getQS(DOM.listExport), 'click', exportData);
        UICtrl.addEventToElement(getQS(DOM.btnAdd), 'click', () => window.location.replace('/product.html'));
        UICtrl.addEventToElement(getQS(DOM.btnListRefresh), 'click', getAPIData);
    };

    function handleRowClick() {
        document.querySelectorAll(DOM.animator)
        .forEach(i => i.addEventListener(
            'click', 
            (e) => window.location.replace(`/product.html?puid=${e.target.getAttribute("product_id")}`)
        ));
    }

    function getQS(el) {
        return document.querySelector(el);
    }

    function refactorData(data) {
        let d = [];

        // Loop over the objects to get the values
        for ( let i = 0; i < data.length; i++ ) {

            d[i] = [];

            for (let p in data[i]) {
                if( data[i].hasOwnProperty(p) ) {
                    d[i].push(data[i][p]);
                }
            }
        }

        return d;
    }

    function getAPIData() {
        APICtrl.getProducts()
        .then(response => response.json())
        .then(result => {
            loadDataTable(consumeData(result.productsData.list));
        })
        .catch(err => {
            COMMON_UICONTROLLER.showErrorMessage("Error!", err);
        });
        //loadDataTable();
    }

    function loadMeta() {
        APICtrl.getProductsMeta()
        .then(response => response.json())
        .then(result => {
            meta = result.meta;
            getAPIData();
        })
        .catch(err => {
            COMCtrl.showErrorMessage("Error!", err + "");
        });
    }

    function getNameofMetaByID(item, id) {
        var name = null;
        meta[item].forEach(element => {
            if(id == element.id) {
                name = element.name;
            }
        });

        return name;
    }

    function consumeData(data) {
        let list = [];
        data.forEach(product => {
            list.push({
                picture: product.image.replace("public", ""),
                barcode: product.barcode,
                name: product.name,
                subcategory: getNameofMetaByID("subcategories", product.subcategory_id),
                attribute: getNameofMetaByID("attributes", product.attribute_id),
                cost: product.inventory.cost,
                price: calculatePrice(product),
                qtt: product.inventory.stock_qtt,
                status: product.status ? 1 : 0,
                idForView: product._id,
            });
        });

        return refactorData(list);
    }

    const calculatePrice = (product) => {
        var inventory = product.inventory;
        var price = inventory.cost + (inventory.cost * (inventory.vat /100));
        price += price * (inventory.profit_margin/100);

        return price.toFixed(2);
    }

    function loadDataTable(data) {
        if(!data) {
            data = refactorData(dummyData);
        }
        if(datatable) {
            datatable.destroy();
        }
        let accurateData = {
            "headings": DOM.tableHeadings,
            "data": data
        }
        DOM.columnsConfiguration[0].render = (data, cell, row) => {
            return `<img src="${data}" alt="Product image" class="profile_pic">`;
        }
        datatable = new simpleDatatables.DataTable(getQS(DOM.dtProduct), {
            data: accurateData,
            columns: DOM.columnsConfiguration,
            paging: true,
            searchable: true,
            fixedHeight: true,
            sortable: true,
            perPage: DOM.perPage,
            labels: DOM.tableLabels,
            layout: DOM.tableLayout
        });
        ['datatable.init', 'datatable.update', 'datatable.page'].forEach(e => {
            datatable.on(e, function() {
                handleRowClick();
            });
        });
    }

    function exportData() {
        if(datatable) {
            datatable.export(DOM.exportOptions);
        }
    }
 
    return {
        init: function() {
            COMMON_UICONTROLLER.validateAccess();
            loadMeta();
            setupEventListeners();
        }
    };
 
})(Product_UICONTROLLER, api);
 
window.addEventListener('load', function () {
    UIProductsModalController.init(); 
});