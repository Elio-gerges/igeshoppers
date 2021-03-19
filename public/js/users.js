'use strict';

let dummyData = [
    {
        picture: "",
        name: "john",
        email: "john@shoppers.com",
        status: 1,
        id: "3"
    },
    {
        picture: "",
        name: "jane",
        email: "jane@shoppers.com",
        status: 1,
        id: "2"
    },
    {
        picture: "",
        name: "doe",
        email: "doe@shoppers.com",
        status: 0,
        id: "1"
    }
]

// UI Controller
const User_UICONTROLLER = (function () {
    const DOMstrings = {
        usersList: '#usersList',
        userInformationHolder: '#userInformationHolder',
        btnCloseUserInformationHolder : '#btnCloseUserInformationHolder',
        animator: '.animator',
        btnAddUser: "#userListAdd",
        btnUserListRefresh: "#userListRefresh",

        datatable: '#datatable',
        userListExport: '#userListExport',
        fileUserProfilePicture: '#fileUserProfilePicture',

        // Form IDs
        frmUserDetails: "#frmUserDetails",
        imgUserProfilePicture: "#imgUserProfilePicture",
        txtFirstname: "#firstname",
        txtLastname: "#lastname",
        txtUsername: "#username",
        txtPassword: "#password",
        txtEmail: "#email",
        txtMobile: "#mobile",
        drpRole: "#role",
        drpStatus: "#status",
        btnSubmitUser: "#btnSubmitUser",

        passHolder: "#passHolder",

        columnsConfiguration: [
            {
                select: 0, 
                sortable: false,
            },
            {select: [1, 2], sortable: true},
            {
                select: 3, 
                sortable: true,
                render: function(data, cell, row) {
                    if (data == "true") {
                        return '<span class="dot"><i class="bg-success"></i>Active</span>';
                    } else {
                        return '<span class="dot"><i class="bg-danger"></i>Inactive</span>';
                    }
                }
            },
            { 
                select: 4, 
                sortable: false,
                render: function(data, cell, row) {
                    cell.setAttribute("user_id", data);
                    return `<i class="far fa-eye ${DOMstrings.animator.replace(".", "")}" user_id="${data}"></i>`;
                }
            },
        ],

        tableHeadings : [
            "Profile",
            "Full Name",
            "Email",
            "Status",
            ""
        ],

        tableLabels: {
            placeholder: "Search users...",
            perPage: "{select} users per page",
            noRows: "No users found",
            info: "Showing {start} to {end} of {rows} users",
        },

        tableLayout: {
            top: "{search}",
            bottom: "{select}{info}{pager}"
        },

        exportOptions : {
            filename: "Shoppers Back Office - Users List - " + COMMON_UICONTROLLER.getFormatDate(new Date()),
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

// User APP CONTROLLER
var UIUserModalController = (function(UICtrl, APICtrl, COMCtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();
    var toggled = false;

    var datatable = null;
    var selectedUserID = null;
    var selectedUserData = null;

    var setupEventListeners = function() {
        UICtrl.addEventToElement(getQS(DOM.btnCloseUserInformationHolder), 'click', hideUserInformation);
        UICtrl.addEventToElement(getQS(DOM.userListExport), 'click', exportData);
        UICtrl.addEventToElement(getQS(DOM.imgUserProfilePicture), 'click', () => { getQS(DOM.fileUserProfilePicture).click();});
        UICtrl.addEventToElement(getQS(DOM.fileUserProfilePicture), 'change', handleFileUserProfilePictureChange);
        UICtrl.addEventToElement(getQS(DOM.btnAddUser), 'click', showUserInformation);
        UICtrl.addEventToElement(getQS(DOM.btnUserListRefresh), 'click', getAPIData);

        getQS(DOM.btnSubmitUser).addEventListener('click', (e) => {
            e.preventDefault();
            if(selectedUserID && selectedUserData) {
                onUpdateData(e);
            } else {
                onAddData(e);
            }
        });
    };

    function handleFileUserProfilePictureChange() {
        getQS(DOM.imgUserProfilePicture).src = window.URL.createObjectURL(getQS(DOM.fileUserProfilePicture).files[0])
    }

    function handleRowClick() {
        document.querySelectorAll(DOM.animator).forEach(i => i.addEventListener('click', showUserInformation));
    }

    function showUserInformation(e) {
        if(!toggled) {
            toggled = true;
            UICtrl.toggleClass(getQS(DOM.usersList), 'col-12');
            UICtrl.toggleClass(getQS(DOM.usersList), 'col-8');
            setTimeout(() => {
                UICtrl.toggleClass(getQS(DOM.userInformationHolder), 'visible');
            }, 300);
        }

        if(e) {
            getQS(DOM.btnSubmitUser).value = "Update";
            selectedUserID = e.target.getAttribute("user_id");
            APICtrl.getUser(selectedUserID)
            .then(response => response.json())
            .then(result => {
                populateFormData(result.user);
                selectedUserData = result.user;
                changeFormFieldsStatus(true);
            })
            .catch(err => {
                console.log('Error: ', err )
            });
        }
    }

    function hideUserInformation() {
        toggled = false;
        selectedUserID = null;
        selectedUserData = null;
        getQS(DOM.btnSubmitUser).value = "Add";
        getQS(DOM.imgUserProfilePicture).src = "/imgs/img_usr/image001.png";
        changeFormFieldsStatus(false);
        getQS(DOM.frmUserDetails).reset();
        UICtrl.toggleClass(getQS(DOM.userInformationHolder), 'visible');
        setTimeout(() => {
            UICtrl.toggleClass(getQS(DOM.usersList), 'col-12');
            UICtrl.toggleClass(getQS(DOM.usersList), 'col-8');
        }, 200);
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

    function getFile(filePath) {
        return filePath.substr(filePath.lastIndexOf('\\') + 1);
    }

    function onAddData(e) {
        try {
            e.preventDefault();
            var form = getQS(DOM.frmUserDetails);
            var data = new FormData(form);

            var roleId = null;
            if((roleId = getQS(DOM.drpRole).value) !== "N/A") {
                data.append("roleId", roleId);
            } else {
                throw new Error("Role is not set.");
            }

            var status = null;
            if((status = getQS(DOM.drpStatus).value) !== "N/A") {
                data.append("status", (status === "active" ? true : false));
            } else {
                throw new Error("Status is not set.");
            }

            var file = getQS(DOM.fileUserProfilePicture);
            var fileValue = getFile(file.value);
            if(fileValue) {
                var fileExtension = fileValue.split('.')[1];

                if(fileExtension.toLowerCase() != "png" && fileExtension.toLowerCase() != "jpg") {
                    throw new Error("Image formats should be PNG or JPG");
                }
            }

            swal({
                title: "Are you sure?",
                text: "You are about to create a new User!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willUpdate) => {
                if (willUpdate) {
                    APICtrl.addUser(data)
                    .then(response => response.json())
                    .then(result => {
                        if(result.error) {
                            COMCtrl.showErrorMessage("Error!", result.error_message);
                            return ;
                        } else {
                            swal(`Here You Go! User added successfully!`, {
                                icon: "success",
                            });
                            hideUserInformation();
                            getAPIData();
                        }
                    })
                    .catch(err => {
                        COMCtrl.showErrorMessage("Error!", "Failed to Add User");
                        console.log('err @ Users.js', err);
                    });
                } else {
                  swal({
                    title: "Okay!",
                    text: "Adding User Discarded!"
                });
                }
            });
        } catch (error) {
            COMCtrl.showErrorMessage("Input Error!", error.message);
        }
    }

    function onUpdateData(e) {
        e.preventDefault();
        var newUser = {
            firstname: getQS(DOM.txtFirstname).value,
            lastname: getQS(DOM.txtLastname).value,
            email: getQS(DOM.txtEmail).value,
            mobile: getQS(DOM.txtMobile).value,
            status: (getQS(DOM.drpStatus).value === "active" ? true : false),
            roleId: getQS(DOM.drpRole).value
        }

        var changedData = COMCtrl.findChanges(newUser, selectedUserData);
        if(Object.keys(changedData).length === 0) {
            swal({
                title: "User Information are still the same!",
                text: "You haven't changed the information of this user!\nOperation to Update is not allowed!",
                icon: "warning",
            });
        } else {
            var fullname = `${selectedUserData.firstname} ${selectedUserData.lastname}`;
            var message = `You are attempting to change the information of ${fullname}!`;
            swal({
                title: "Are you sure?",
                text: message,
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willUpdate) => {
                if (willUpdate) {
                    APICtrl.updateUser(selectedUserID, changedData)
                    .then(response => response.json())
                    .then(result => {
                        if(result.error) {
                            COMCtrl.showErrorMessage("Error!", result.error_message);
                            return ;
                        } else {
                            swal(`Here You Go! User ${fullname} updated successfully!`, {
                                icon: "success",
                            });
                            hideUserInformation();
                            getAPIData();
                        }
                    })
                    .catch(err => {
                        COMCtrl.showErrorMessage("Error!", "Failed to Update User");
                    });
                } else {
                    swal({
                        title: "Okay!",
                        text: "Update Discarded!"
                    });
                }
              });
        }
    }

    function getAPIData() {
        APICtrl.getUsers()
        .then(response => response.json())
        .then(result => {
            loadDataTable(consumeData(result.usersData.list));
        })
        .catch(err => {
            COMCtrl.showErrorMessage("Error!", err);
        });
    }

    function consumeData(data) {
        let list = [];
        data.forEach(user => {
            list.push({
                picture: user.picture.replace("public", ""),
                name: user.firstname + " " + user.lastname,
                email: user.email,
                status: user.status,
                id: user._id,
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
        DOM.columnsConfiguration[0].render = (data, cell, row) => {
            return `<img src="${data}" alt="User image" class="profile_pic">`;
        }
        datatable = new simpleDatatables.DataTable(getQS(DOM.datatable), {
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

    function changeFormFieldsStatus(status) {
        if(typeof(status) != "boolean") {
            throw new Error("Status @ changeFormFieldsStatus shall be a boolean");
        }
        // var form = getQS(DOM.frmUserDetails);
        // for (var i=0; i<form.length-2; i++) {
        //     form[i].readOnly = status;
        //     form[i].disabled = status;
        // }

        getQS(DOM.fileUserProfilePicture).disabled = status;

        if(status === true) {
            getQS(DOM.passHolder).style.display = "none";
        } else {
            getQS(DOM.passHolder).style.display = "flex";
        }
    }

    function populateFormData(user) {
        getQS(DOM.txtFirstname).value = user.firstname;
        getQS(DOM.txtLastname).value = user.lastname;
        getQS(DOM.txtEmail).value = user.email;
        getQS(DOM.imgUserProfilePicture).src = user.picture.replace("public", "");
        if(user.mobile.charAt(0) === "+") {
            getQS(DOM.txtMobile).value = user.mobile;
        } else {
            getQS(DOM.txtMobile).value = "+" + user.mobile;
        }

        var role = document.getElementsByName('role');
        role.forEach(r => {
            if(r.value === user.roleId) {
                r.selected = true;
            }
        });

        var status = document.getElementsByName('status');
        status.forEach(s => {
            if(s.value === (user.status === true ? "active" : "inactive" )) {
                s.selected = true;
            }
        });
    }

    function exportData() {
        if(datatable) {
            datatable.export(DOM.exportOptions);
        }
    }

    function loadMeta() {
        APICtrl.getUserMeta()
        .then(response => response.json())
        .then(result => {
            loadRoleDrp(result.meta.userRole);
        })
        .catch(err => {
            COMCtrl.showErrorMessage("Error!", err);
        });
    }

    function loadRoleDrp(data) {
        var drp = getQS(DOM.drpRole);

        data.forEach(role => {
            if(role.status === true) {
                drp.insertAdjacentHTML('beforeend', `
                    <option name='role' value="${role._id}">${role.role}</option>
                `);
            }
        });
    }
 
    return {
        init: function() {
            COMCtrl.validateAccess();
            loadMeta();
            getAPIData();
            setupEventListeners();
        }
    };
 
})(User_UICONTROLLER, api, COMMON_UICONTROLLER);
 
window.addEventListener('load', function () {
    UIUserModalController.init(); 
});

/**
 * function generateImgFromCanvas() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
        '<em>I</em> like <span style="color:white; text-shadow:0 0 2px blue;">cheese</span>' +
        '</div>' +
        '</foreignObject>' +
        '</svg>';

        var DOMURL = window.URL || window.webkitURL || window;

        var svg = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
        });
        var url = DOMURL.createObjectURL(svg);

        document.getElementById("profile").src = url;

        return svg;
    }

    function uploadCanvas(dataURL) {
        // var blobBin = atob(dataURL);
        // var array = [];
        // for(var i = 0; i < blobBin.length; i++) {
        //     array.push(blobBin.charCodeAt(i));
        // }
        var file=new Blob([new Uint8Array(dataURL)], {type: 'image/png'});
        var formdata = new FormData();
        formdata.append("image", file);

        console.log('formdata', formdata);
      }
 */