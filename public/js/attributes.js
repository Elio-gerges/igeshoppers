'use strict';

let dummyData = [
    {
        name: "Product 1",
        description: "Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long ",
        status: 1,
        id: "",
    },
    {
        name: "Product 1",
        description: "Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long ",
        status: 1,
        id: "",
    },
    {
        name: "Product 1",
        description: "Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long Something very long ",
        status: 1,
        id: "",
    },
]

// UI Controller
const Attribute_UICONTROLLER = (function () {
    const DOMstrings = {
        list: '#listAttributes',

        informationHolder: '#cardAttributeInfo',
        btnCloseInformationHolder : '#btnCloseAttributeInformationHolder',

        frmDetails: "#frmAttributeDetails",

        btnSubmit: "#btnSubmit",
        txtDescription: "#description",
        txtName: "#name",
        drpStatus: "#status",

        animator: '.animator',

        btnAdd: "#listAdd",
        btnListRefresh: "#listRefresh",
        listExport: '#listExport',
        dtProduct: "#datatable",

        columnsConfiguration: [
            {
                select: [0, 1], 
                sortable: true,
            },
            {
                select: 1,
                render: function(data, cell, row) {
                    cell.style.width = "80%";
                    return data;
                }
            },
            {
                select: 2, 
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
                select: 3, 
                sortable: false,
                render: function(data, cell, row) {
                    cell.setAttribute("attribute_id", data);
                    return `<i class="far fa-eye ${DOMstrings.animator.replace(".", "")}" attribute_id="${data}"></i>`;
                }
            },
        ],

        tableHeadings : [
            "Name",
            "Description",
            "Status",
            ""
        ],

        tableLabels: {
            placeholder: "Search attributes...",
            perPage: "{select} attributes per page",
            noRows: "No attributes found",
            info: "Showing {start} to {end} of {rows} attributes",
        },

        tableLayout: {
            top: "{search}",
            bottom: "{select}{info}{pager}"
        },

        exportOptions : {
            filename: "Shoppers Back Office - Attributes List - " + COMMON_UICONTROLLER.getFormatDate(new Date()),
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

// Attributes APP CONTROLLER
var UIAttributesModalController = (function(UICtrl, APICtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();

    var datatable = null;
    var selectedID = null;
    var selectedData = null;
    var toggled = false;

    var setupEventListeners = function() {
        UICtrl.addEventToElement(getQS(DOM.listExport), 'click', exportData);
        UICtrl.addEventToElement(getQS(DOM.btnAdd), 'click', showInformation);
        UICtrl.addEventToElement(getQS(DOM.btnCloseInformationHolder), 'click', hideInformation);
        UICtrl.addEventToElement(getQS(DOM.btnListRefresh), 'click', getAPIData);

        getQS(DOM.btnSubmit).addEventListener('click', (e) => {
            e.preventDefault();
            if(selectedID && selectedData) {
                onUpdateData(e);
            } else {
                onAddData(e);
            }
        });
    };

    function handleRowClick() {
        document.querySelectorAll(DOM.animator).forEach(i => i.addEventListener('click', showInformation));
    }

    function getFormData() {
        if(getQS(DOM.txtName).value == "") {
            throw new Error("Name is a required field.");
        }
        
        if(getQS(DOM.drpStatus).value == "N/A") {
            throw new Error("Status is a required field.");
        }

        if(getQS(DOM.txtDescription).value == "") {
            throw new Error("Description is a required field.");
        }

        return {
            name: getQS(DOM.txtName).value,
            description: getQS(DOM.txtDescription).value,
            status: (getQS(DOM.drpStatus).value === "active" ? true : false)
        };
    }

    function onAddData(e) {
        try {
            e.preventDefault();
            var data = getFormData();
            swal({
                title: "Are you sure?",
                text: "You are about to create a new Attribute!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willUpdate) => {
                if (willUpdate) {
                    APICtrl.addAttribute(data)
                    .then(response => response.json())
                    .then(result => {
                        if(result.error) {
                            COMMON_UICONTROLLER.showErrorMessage("Error!", result.error_message);
                            return ;
                        } else {
                            swal(`Here You Go! Attribute added successfully!`, {
                                icon: "success",
                            });
                            hideInformation();
                            getAPIData();
                        }
                    })
                    .catch(err => {
                        COMMON_UICONTROLLER.showErrorMessage("Error!", "Failed to Add Attribute");
                        console.log('err @ Attributes.js', err);
                    });
                } else {
                  swal({
                    title: "Okay!",
                    text: "Adding Attribute Discarded!"
                });
                }
            });
        } catch (error) {
            COMMON_UICONTROLLER.showErrorMessage("Add Error!", error.message);
        }
    }

    function onUpdateData(e) {
        try {
            e.preventDefault();
            var newAttribute = getFormData();

            var changedData = COMMON_UICONTROLLER.findChanges(newAttribute, selectedData);
            if(Object.keys(changedData).length === 0) {
                swal({
                    title: "Attribute Information are still the same!",
                    text: "You haven't changed the information of this Attribute!\nOperation to Update is not allowed!",
                    icon: "warning",
                });
            } else {
                var message = `You are attempting to change the information of the Attribute: ${selectedData.name}!`;
                swal({
                    title: "Are you sure?",
                    text: message,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willUpdate) => {
                    if (willUpdate) {
                        APICtrl.updateAttribute(selectedID, changedData)
                        .then(response => response.json())
                        .then(result => {
                            if(result.error) {
                                COMMON_UICONTROLLER.showErrorMessage("Error!", result.error_message);
                                return ;
                            } else {
                                swal(`Here You Go! Attribute ${selectedData.name} updated successfully!`, {
                                    icon: "success",
                                });
                                hideInformation();
                                getAPIData();
                            }
                        })
                        .catch(err => {
                            COMMON_UICONTROLLER.showErrorMessage("Error!", "Failed to Update Attribute");
                        });
                    } else {
                        swal({
                            title: "Okay!",
                            text: "Update Discarded!"
                        });
                    }
                });
            }
        } catch (error) {
            COMMON_UICONTROLLER.showErrorMessage("Update Error!", error.message);
        }
    }

    function showInformation(e) {
        if(!toggled) {
            toggled = true;
            UICtrl.toggleClass(getQS(DOM.list), 'col-12');
            UICtrl.toggleClass(getQS(DOM.list), 'col-8');
            setTimeout(() => {
                UICtrl.toggleClass(getQS(DOM.informationHolder), 'visible');
            }, 300);
        }

        if(e) {
            getQS(DOM.btnSubmit).value = "Update";
            selectedID = e.target.getAttribute("attribute_id");
            APICtrl.getAttribute(selectedID)
            .then(response => response.json())
            .then(result => {
                populateFormData(result.attribute);
                selectedData = result.attribute;
                changeFormFieldsStatus(false);
            })
            .catch(err => {
                console.log('Error: ', err );
            });
        }
    }

    function changeFormFieldsStatus(status) {
        if(typeof(status) != "boolean") {
            throw new Error("Status @ changeFormFieldsStatus shall be a boolean");
        }
        var form = getQS(DOM.frmDetails);
        for (var i=0; i<form.length-2; i++) {
            form[i].readOnly = status;
            form[i].disabled = status;
        }
    }

    function hideInformation() {
        toggled = false;
        selectedID = null;
        selectedData = null;
        getQS(DOM.btnSubmit).value = "Add";
        changeFormFieldsStatus(false);
        getQS(DOM.frmDetails).reset();
        UICtrl.toggleClass(getQS(DOM.informationHolder), 'visible');
        setTimeout(() => {
            UICtrl.toggleClass(getQS(DOM.list), 'col-12');
            UICtrl.toggleClass(getQS(DOM.list), 'col-8');
        }, 200);
    }

    function populateFormData(attribute) {
        getQS(DOM.txtName).value = attribute.name;
        getQS(DOM.txtDescription).value = attribute.description;
        var status = document.getElementsByName('status');
        status.forEach(s => {
            if(s.value === (attribute.status === true ? "active" : "inactive" )) {
                s.selected = true;
            }
        });
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
        APICtrl.getAttributes()
        .then(response => response.json())
        .then(result => {
            loadDataTable(consumeData(result.attributesData.list));
        })
        .catch(err => {
            COMMON_UICONTROLLER.showErrorMessage("Error!", err);
        });
    }

    function consumeData(data) {
        let list = [];
        data.forEach(attribute => {
            list.push({
                name: attribute.name,
                description: attribute.description,
                status: attribute.status ? 1 : 0,
                id: attribute._id,
            });
        });

        return refactorData(list);
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
            getAPIData();
            setupEventListeners();
        }
    };
 
})(Attribute_UICONTROLLER, api);
 
window.addEventListener('load', function () {
    UIAttributesModalController.init(); 
});