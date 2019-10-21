'use strict';

var userApp = new Vue({
  el: '#userApp',
  data: { 
  vueCustom: [],
  crudScripts: {
    vueCustom: (options, data) => {
      if (options.type === 'vueCustom') {
        userApp.vueCustom = data;
        userApp.backupArr = data;
      }
      
    }
  }
,
  backupDocs: {

  },
  docs: {
    saveTrue: [],
    data: {}
  }
,
  regPage: 0,
  regPageSelect: ['accountSelect', 'nameSelect', 'addressSelect'],
  loginPage: 'login',
  registrationForm: {
      account:'',
      email:'',
      password:'',
      persons: {
        firstName:'',
        lastName:'',
        bio:'',
        address:'',
        city:'',
        zip:'',
        state:''
      }
  }
,
  uploadCategorySubImg: false,
  uploadCategoryImg: false,
  showUrl: '',
  singleObj: false,
  mainTableHead: [],
  rowNumber: 0,
  files: [],
  toastrs: {},
  tables: {},
  formUrls: {
    userLogin: {
      url: '/auth/login',
      type: 'login',
      redirect: '/'
    },
    registrationForm: {
      url: '/auth/registration',
      type: 'registration',
      redirect: '/'
    }
  },
  user: '',
  saveProfileButton: false,
  renderLoad: (rowName, keyName) => {
    function render(data, type, row) {

      if (data && typeof data === 'string') return data;

      if (row && row[rowName] && Array.isArray(row[rowName]) && row[rowName].length > 0) {

        if (row[rowName].length === 1) {

          row[rowName] = row[rowName][0][keyName];
          return row[rowName];
        }
        let newArray = '';
        row[rowName].forEach((obj, index) => {

          newArray += `${obj[keyName]}, `;

          if (index === row[rowName].length - 1) {
            newArray = newArray.slice(0, -2);
          }

        });

        return row[rowName] = newArray;

      } else if (row && row[rowName]) {

        return row[rowName] = 'None';

      } else return;

    }

    return eval(render)

  }
,
    lists: {},
    nav: {
        links: [],
        page: 'dashboard',
        subPage: '',
        sub: {},
        lastPage: 'dashboardNav',
        pageSetup: {
            dashboard: {
                header: 'lg'
            },
            forums: {
                header: 'sm',
                categories: true,
                vueSetup: () => {
                    userApp.crud('GET', '/api/categories?populate=topics&deep={"topics":["logo","img"]}&topics=notEmpty&enabled=true', {
                        type: 'vueCustom'
                    });
                }
            },
            rules: {
                header: 'sm'
            },
            watch: {
                header: 'sm',
                watch: true,
                vueSetup: () => {
                    if(!userApp.noCrud)
                    userApp.crud('GET', '/watch/_all?api=true', {
                        type: 'vueCustom'
                    });
                }
            },
            myProfile: {
                header: 'md'
            },
            editProfile: {
                header: 'md'
            },
            settings: {
                header: 'md'
            },

            users: {
                header: 'md',
                name: 'showUsers',

                prefix: 'api',
                lists: [{
                    name: 'test',
                    keys: ['name']
                },{
                    name: 'groups',
                    keys: ['name']
                }, {
                    name: 'navigations',
                    keys: ['name']
                }]
            },
            groups: {
                key: 'name',
                header: 'md',
                name: 'showGroups',
                lists: [{
                    name: 'users',
                    keys: ['account']
                }, {
                    name: 'navigations',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            categories: {
                header: 'md',
                name: 'showCategories',
                lists: [{
                    name: 'topics',
                    keys: ['name'],
                    urlAdd: '&category=isEmpty'
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            topics: {
                header: 'md',
                name: 'showCategories',
                lists: [{
                    name: 'categories',
                    keys: ['name']
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            videos: {
                header: 'md',
                name: 'showVideos',
                lists: [{
                    name: 'categories',
                    keys: ['name']
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            
        },
        switch: (page) => {
            switch (page) {
                case 'editProfile':
                    userApp.nav.subPage = 'Edit Profile';
                    break;
                case 'myProfile':
                    userApp.nav.subPage = 'My Profile';
                    break;
                case 'settings':
                    userApp.nav.subPage = 'My Settings';
                    break;
                case 'users':

                    userApp.mainTableHead = [{
                        name: "ID"
                    }, {
                        name: "Account"
                    }, {
                        name: "Email"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Groups"
                    }];

                    var url = `/api/users?count=t&or=t&populate=groups`;
                    var columns = [{
                            "data": "_id",
                            "name": "ID",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "account",
                            "name": "account",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "email",
                            "name": "email",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "groups.name",
                            "name": "groups",
                            render: userApp.renderLoad('groups', 'name')
                        },
                    ]

                    Vue.nextTick(() => {
                        
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                    
                        userApp.lists.groupsList_fast = {url: "/api/groups", key: "name", urlAdd: "", _all: true, fast:true};
                    
                    });


                    break;

                case 'groups':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Users"
                    }];

                    url = `/api/groups?count=t&or=t&populate=users`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "users.account",
                            "name": "Users",

                            render: userApp.renderLoad('users', 'account')
                        },
                    ]
                   
                    Vue.nextTick(() => {
                        
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                        $('#tableCard').hammer({taps:2}).bind("tap", (ev) => {
                            console.log(ev)
                            userApp.handler(ev);

                        });
                    
                    });

                    break;

                case 'categories':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Topics"
                    }];

                    url = `/api/categories?count=t&or=t&populate=topics`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "topics.name",
                            "name": "Topics",

                            render: userApp.renderLoad('topics', 'name')
                        },

                    ];

                    Vue.nextTick(() => userApp.dataTableFunc(page, 'mainDataTable', url, columns));

                    break;

                case 'topics':

                    userApp.fileNameCheck('uploadCategorySubImg');
                    userApp.fileNameCheck('uploadCategoryImg');

                    
                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Category"
                    }];

                    url = `/api/topics?count=t&or=t&populate=category`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"

                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "category.name",
                            "name": "Category",
                            "defaultContent": "<i>Not set</i>",

                            render: userApp.renderLoad('category', 'name')
                        },
                    ]

                    Vue.nextTick(() => userApp.dataTableFunc(page, 'mainDataTable', url, columns));

                    break;

                case 'videos':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Description"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Groups"
                    }];

                    url = `/watch/_all?count=t&or=t&populate=category&api=true`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "description",
                            "name": "Description",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "groups.name",
                            "name": "Groups",
                            "defaultContent": "<i>Not set</i>",

                            render: userApp.renderLoad('groups', 'name')
                        },
                    ]

                    Vue.nextTick(() => {
                        
                        console.log('vidoes mans');
                        $('#selectVideo').selectpicker();
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                        
                    });

                    break;

                default:
                    break;
            }
        }
    }
,
  push: {
    showButton: false
  },
  vimeoAPI: {}
,
  tempRooms: {},
  clickMenu: [],
  clickMenuOptions: {
    noTop: false,
  },
  clickMenuObj: {},
  menuObj: {}
 },

  watch: {

  },
  methods: { 
  crud(type, url, options, data) {

    var globalOptions = options;

    let jsonCheck = false;

    try {

      JSON.parse(data);
      jsonCheck = true;

    } catch (e) {
      jsonCheck = false;
    }


    function ajax(type, url, options, data) {

      $.ajax({
        type,
        url,
        data,
        processData: options.processData ? false : undefined,
        contentType: options.contentType ? options.contentType : options.contentType === false ? false : 'application/json',
        beforeSend: function (x) {
          if (x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
          }
        },
        success: function (data) {

          let options = globalOptions;

          if (runFunc && runFunc === 'me') {
            plmApp.crud('GET', '/api/me', {
              type: 'me'
            });
          }

          data = JSON.parse(data);

          if (options.files && options.files.length > 0) {

            options.files.forEach((file, index) => {
              let id = file.id;
              let el = $(`#${id}`)[0];
              let doc = el.getAttribute("data-doc");
              let column = el.getAttribute("data-column");
              userApp.fileUpload(options.files[index], JSON.stringify({
                [doc]: data._id,
                target: column
              }), {
                method: "POST",
                action: "files/upload"
              });
            });

          }

          if (!options) options = {};

          userApp.crudScripts.vueCustom(options, data);

          if (options.type === 'vueObject') {
            userApp[options.name] = data;
          }

          if (options.type === 'videoDelete') {
            let index = $($(options.event.target).parents()[2]).index();
            userApp.vueCustom[index] = undefined;
            userApp.vueCustom = userApp.vueCustom.filter(function (element) {
              return element !== undefined;
            });
            $(options.event.target).parents()[1].classList.remove("flipped");
          }

          if (options.type === 'vueList') {

            let selected = [];

            $($(`#${options.name}`).selectpicker().parents()[0]).find('.dropdown-menu .show li.selected .text').each((index, li) => {

              selected.push({
                name: $(li).text()
              });
            });

            userApp.lists[options.name].data = selected.length > 0 ? [...selected, ...data] : data;
            userApp.$forceUpdate();
            Vue.nextTick(function () {
              $(`#${options.name}`).selectpicker("refresh");
            });

          }

          if (options.type === 'fastList') {

            var el = $('#' + options.name);
            var oldValues = [];

            $.each(el[0].options, function (index, option) {
              oldValues.push(option.value);
            });

            data.forEach(function (item) {

              if (!oldValues.includes(item._id)) {
                el.append($("<option></option>")
                  .attr("value", item._id)
                  .text(item.name));
              }

            });

            el.selectpicker('refresh');

          }

          if (options.type === 'docCreate') {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: `${options.name.capitalize().plural(true)} has been created.`,
              showConfirmButton: false,
              timer: 1500
            });

            if (options.modal) $(`#${options.modal}`).modal('hide');

            userApp.docs.data[options.name].form = {

            };
            userApp.tables[options.name].draw();

            let vueForm = userApp.docs.data[userApp.nav.page].create;

            Object.keys(vueForm).forEach((key) => {

              if (typeof vueForm[key] === 'object' && !Array.isArray(vueForm[key])) {
                vueForm[key] = {};
              } else {
                delete vueForm[key];
              }

            });

            $(`#${options.name}Create select`).each((index, value) => {

              $(`#${value.id}`).selectpicker('val', '');

            });

            $(`#${options.name}Create input`).each((index, value) => {

              value.value = '';

            });

          }

          if (options.type === 'docUpdate') {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: `${options.name.capitalize().plural(true)} has been updated.`,
              showConfirmButton: false,
              timer: 1500
            });

            if (options.modal) $(`#${options.modal}`).modal('hide');
            userApp.docs.data[options.name].form = {

            };
            userApp.tables[options.name].draw();

          }

          if (options.type === 'objDelete') {
            Swal.fire({
              title: 'Deleted!',
              text: 'The item has been deleted.',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false
            });

            userApp.tables[options.name].draw();

          }

          if (options.type === 'vueWrite') {

            userApp[options.vueObject ? options.vueObject : 'mainTable'] = data;

          }

          if (options && options.type === 'login') {
            plmApp.setCookie('jwt', data.token, 1);
            //    if (options.redirect) window.location.replace(options.redirect);
          }

          if (options && options.type === 'me') {

            let navigations = data.navigations;
            delete data.navigations;

            data.groups.forEach((group, index) => {
              navigations = [...navigations, ...group.navigations];
              delete data.groups[index].navigations;

            });

            navigations = navigations.filter((navigation, index, self) =>
              index === self.findIndex((t) => (
                t._id === navigation._id
              ))
            );

            userApp.nav.links = navigations;
            userApp.user = data;
            userApp.userCheck = JSON.parse(JSON.stringify(data));
            userApp.checkObj('user', 'userCheck', 'saveProfileButton');

            if (options.redirect) window.location.replace(options.redirect);

          }

        },
        error: function (err) {

        }
      });

    }

    let runFunc = false;

    if (options.formData) {
      var form = new FormData();
      jQuery.each(data, function (i, file) {
        form.append('file-' + i, file);
        if (i === data.length - 1) {
          if (options.objects) {
            form.append('objects', options.objects);
          }
          ajax(type, url, options, form);
        }
      });

    }

    if (!jsonCheck && data && typeof data === 'string' && data.includes(':')) {
      var splitArr = data.split(':');
      runFunc = splitArr[1];
      data = splitArr[0];
    }

    if (typeof options === 'string') options = {
      [options]: true
    };

    if (options && options.form) data = $(`#${data}`).serializeArray();

    let dataObj = {};
    if (data && typeof data === 'object' && Array.isArray(data))
      data.forEach((obj, index) => {


        dataObj[obj.name] = obj.value;

        if (index === data.length - 1) {
          data = dataObj;

          if (type.toLowerCase() === 'post' || type.toLowerCase() === 'put') data = JSON.stringify(data);

          ajax(type, url, options, data);

        }

      });

    else if (typeof data === 'string') {
      ajax(type, url, options, data);
    }

    if (type.toLowerCase() === 'get' || type.toLowerCase() === 'delete') ajax(type, url, options);

  }
,
  dataTableFunc: (name, id, url, columns) => {

    if (!userApp.docs.data[name]) userApp.docs.data[name] = {};
    if (!userApp.docs.data[name].create) userApp.docs.data[name].create = {};
    if (userApp.nav.page === 'users' || userApp.nav.page === 'groups' || userApp.nav.page === 'categories' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.groups = [];
    if (userApp.nav.page === 'categories' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.topics = [];
    if (userApp.nav.page === 'users' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.persons = {};
    userApp.mainTableHead.push({
      name: ''
    });

    columns.push({
      data: "actions",
      mData: "actions",
      name: "actions",
      sName: "actions"
    });

    //columns[4].data = 'groups';
    // columns[4].mData = 'groups';


    userApp.tables[name] = $(`#${id}`).DataTable({

      // dom: "Bflrtipb",
      //  dom: 'Bfrtip',
      serverSide: true,
      processing: true,
      responsive: true,
      colReorder: true,
      autoWidth: false,
      bDestroy: true,

      ajax: {
        type: "GET",
        url,
        dataSrc: function (doc) {


          //Make your callback here.

          if (name === 'users') {

            console.log(doc.data);

            doc.data.forEach((documents, index) => {

              let groups = '';
              let ids = [];

              doc.data[index].groups.forEach((element, index2) => {

                ids.push(element._id);

                if (index2 + 1 !== doc.data[index].groups.length)
                  groups += element.name + ', ';
                else
                  groups += element.name;

              });

              console.log(groups);



              doc.data[index].groups = {
                name: groups,
                ids: ids
              };



              // userApp.docs[name][index].groups = documents.groups;
            });

          }

          userApp.docs[name] = doc.data;

          return doc.data;
        }
      },
      buttons: [{
        text: 'Reload',
        action: function (e, dt, node, config) {
          dt.ajax.reload();
        }
      }],
      fixedColumns: true,
      columns: columns,
      columnDefs: [{
        "className": "text-right",
        "targets": columns.length - 1,
        defaultContent: `<a onClick="userApp.openModal(event, 'show${userApp.capFirstLetter(name)}', '${name}')" class="waves-effect waves-dark btn btn-round btn-info btn-icon btn-sm"><i class="fas fa-user-edit"></i></a>
        <a class="waves-effect waves-dark btn btn-round btn-primary btn-icon btn-sm remove"><i class="far fa-hand-pointer"></i></a>
        <a onClick="userApp.showSwal(event, 'areYouSure', '${name}')" class="waves-effect waves-dark btn btn-round btn-danger btn-icon btn-sm remove"><i class="fas fa-trash-alt"></i></a>`
      }],
      select: {
        style: 'os',
        selector: 'td:first-child'
      },
      fnCreatedRow: (nRow, doc) => {


        if (name === 'users') {



          userApp.docs[name].forEach((documents, index) => {
            console.log(documents.groups);
            //    userApp.docs[name][index].groups = documents.groups;
          });

        }

        $(nRow).attr('id', doc._id);
      }
    });

    function capitalizeFLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

    function myCallbackFunction(updatedCell, updatedRow, oldValue) {




      
      var vueName = this.vueTable;
      var value = updatedCell[0][0] ? updatedCell.data() : $(updatedCell).children()[0].value;
      var column = updatedCell[0][0] ? updatedCell[0][0].column : $(updatedCell[0]).data('dt-column');
    //  var otherTable = $($(updatedCell).parents()[4]).DataTable();
      var key = updatedCell.context ? updatedCell.context[0].aoColumns[column].data : otherTable.context[0].aoColumns[column].data;
      var rowNumber = otherTable !== undefined ? updatedRow[0][0] : $(updatedCell).data('dt-column');
      var objId = updatedCell.context ? updatedRow.context[0].aoData[rowNumber].nTr.id : otherTable.context[0].aoData[rowNumber].nTr.id;


      if(!updatedCell[0][0]) {
        //<span class="dtr-title">Groups</span>
        //<span class="dtr-data">administrator, memeber, video-mods, video-member</span>
        console.log(otherTable.context[0].aoColumns[column]);

        $(updatedCell).empty();

        $(updatedCell).append('<span class="dtr-title">' + capitalizeFLetter(key) + ' </span>');
        $(updatedCell).append('<span class="dtr-data"> '+ value+'</span>');

      }

      let json = JSON.stringify({
        [key]: value
      });
      let where = JSON.stringify({
        _id: objId
      });

      let dataTable = JSON.stringify({
        sid: socket.id,
        col: column,
        row: rowNumber,
        dataTableName: name
      });

      if (name === 'users')
        userApp.crud('PUT', `/api/${vueName}?where=${where}&dataTable=${dataTable}`, {}, json);
      else
        userApp.crud('PUT', `/${vueName}/all?where=${where}&dataTable=${dataTable}`, {}, json);
    }

    

    userApp.tables[name].MakeCellsEditable({
      "onUpdate": myCallbackFunction,
      "vueTable": name,
      "columns": ['account', 'description', 'email', 'groups.name', 'permissions'],
      "inputCss": 'my-input-class',
      "allowNulls": {
        "columns": ['groups.name'],
        "errorClass": 'my-error'
      },
      "confirmationButton": {
        "confirmCss": 'my-confirm-class',
        "cancelCss": 'my-cancel-class'
      },
      "inputTypes": [{
          "column": 'account',
          "type": "text-confirm",

        },
        {
          "column": 'email',
          "type": "text-confirm"
        },
        {
          "column": 'description',
          "type": "textarea-confirm"
        },
        {
          "column": 'permissions',
          "type": "text-confirm"
        },
        {
          "column": 'groups.name',
          "type": "list"

        }

      ]
    });

  },
  dataTableEdit: (e) => {
    console.log('fook', e.target);
  }
,
  createDoc: (name, e) => {

    event.preventDefault();

    let files = [];

    let content = $(e.target).parents()[2];

    let uploads = $(content).find('.custom-file-input');
    uploads.each( (index, el) => {
      let id = el.id;
      let uploadedFiles = $(`#${id}`)[0].files;
      uploadedFiles.id = id;
      files.push($(`#${id}`)[0].files);

    });

    var url = userApp.tables[name].context[0].ajax.url.split('?')[0];

    if (userApp.docs.data[name].create.persons && Object.keys(userApp.docs.data[name].create.persons).length === 0) delete userApp.docs.data[name].create.persons;
    if (userApp.docs.data[name].create.groups && userApp.docs.data[name].create.groups.length === 0) delete userApp.docs.data[name].create.groups;
    if (userApp.docs.data[name].create.navigations && userApp.docs.data[name].create.navigations.length === 0) delete userApp.docs.data[name].create.navigations;
    if (userApp.docs.data[name].create.users && userApp.docs.data[name].create.users.length === 0) delete userApp.docs.data[name].create.users;
    if (userApp.docs.data[name].create.videos && userApp.docs.data[name].create.videos.length === 0) delete userApp.docs.data[name].create.videos;
    userApp.crud('POST', url, {
      files,
      type: 'docCreate',
      name,
      modal: `create${userApp.capFirstLetter(name)}`
    }, JSON.stringify(userApp.docs.data[name].create));


  },
  saveDoc: (name, rowNumber, where) => {

    let dataTable = JSON.stringify({
      sid: socket.id,
      col: '_all',
      row: rowNumber,
      dataTableName: name
    });

    var url = userApp.tables[name].context[0].ajax.url.split('?')[0];

    if (userApp.docs.data[name].form && where) {
      userApp.crud('PUT', `${url}?where={"_id":"${where}"}&dataTable=${dataTable}`, {
        type: 'docUpdate',
        name,
        modal: `show${userApp.capFirstLetter(name)}`
      }, JSON.stringify(userApp.docs.data[name].form));

      userApp.tables[name].data(userApp.docs[name]);
      userApp.tables[name].draw();

    }

  },
  docsInput: (e, rowNumber, name, tableName) => {
    var value = e.target.value;
    userApp.docs.data[tableName][rowNumber].saveTrue = true;
    if (!userApp.docs.data[tableName].form) userApp.docs.data[tableName].form = {};
    userApp.docs.data[tableName].form[name] = value;
    userApp.$forceUpdate();

  }
,

  fileUpload: (e, objects, extra) => {

    let form, files;


    form = e.target ? $(e.target).parents()[1] : undefined;
    files = form ? $($(`#${form.id}`)[0][0]).prop('files') : e;

    console.log(form);

    userApp.crud(form ? form.method : extra.method, form ? form.action : extra.action, {
      type: 'fileUpload',
      formData: true,
      contentType: false,
      processData: true,
      objects: [objects ? objects : undefined]
    }, files);

  }

,
  focusOn: function (value) {
    app.$forceUpdate();
    app.lastValue = value;


  },

  focusOut: function (watch, newValue, target) {
    let id = $(target).parents()[1].id.substring(4);
    if (app.lastValue !== newValue) {
      jQPost('/dspPost', { table: app.dspTableName, body: { [watch.row]: newValue }, id: { [watch.idName]: id } })
    }

    watch.edit = false;
    app.$forceUpdate();

  },

  externalIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'external' });

  },

  internalIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'internal' });

  },

  localHostIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'local' });

  },
  logSelect: function (log) {
    lGet('/logs?type=' + log.target.value);
  },
  isOdd: function (num) {
    return num % 2;
  },

  updateConf: function (input) {
    if ($(input).data('last').toString() !== input.value.toString()) {

      var obj = { key: $(input).parents()[1].textContent, value: input.value, file: app.confFile };
      confPost('/dspConfPost', obj)

    }

  },
  remSession: function (value) {
    if (app.firstAsk) {
      app.reRun = app.remSession;
      app.reRunValue = value;
      app.firstAsk = false;
      $('#areYouSure').modal('show');
    } else {
      deleteItem('/dspDelete', { model: app.dspTableName, where: { accid: app.reRunValue } })
      $('#areYouSure').modal('hide');
    }

  },
  statisticSelect: function (exec) {
    dLGet('/dspstatistics?name=' + exec.target.value);
  }

,

  registration: (page) => {

    userApp.regPage = page;
    Vue.nextTick(function () {
      // container IS finished rendering to the DOM
      var input = document.getElementById(userApp.regPageSelect[page]);
      input.focus();
      input.select();
    });

  },
  loginPageSwap: (page) => {
    userApp.loginPage = page;
    if(page === 'register')  Vue.nextTick(function () {
      // container IS finished rendering to the DOM
      var input = document.getElementById('accountSelect');
      input.focus();
      input.select();
    });

  }

,

  capFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  sendForm: (obj, url, method, type, redirect) => {

    var object = userApp[obj];

    plmApp.crud(method, url, {
      type: type,
      redirect: redirect
    }, object);

  },
  sortByKey: (array, key) => {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },
  openModal: (e, id, tableName) => {

    console.log(id);

    userApp.$forceUpdate();
    var rowNumber = (typeof e === 'number') ? e : $($(e.target).parents()[2]).index();
    if (!userApp.docs.data[tableName]) userApp.docs.data[tableName] = {};
    if (!userApp.docs.data[tableName][rowNumber]) userApp.docs.data[tableName][rowNumber] = {};
    userApp.rowNumber = rowNumber;
    $(`#${id}`).modal('show');

  },

  selectPick: (array) => {

    console.log("MY ARRAY ");
    console.log(array);

    if (typeof array === 'string') array = [array];

    array.forEach((selectpick) => {

      $(`#${selectpick}`).selectpicker();
    });

    return true;
  },

  findAllList: (id, key) => {

    var list = userApp.lists[id];

    if(list.fast) {

      userApp.crud('GET', `${userApp.lists[id].url}?or=t&sort=name&${key}=${userApp.lists[id].urlAdd}`, {
        type: 'fastList',
        name: id
      });

    } else {

      userApp.crud('GET', `${userApp.lists[id].url}?or=t&sort=name&${key}=${userApp.lists[id].urlAdd}`, {
        type: 'vueList',
        name: id
      });

    }

    userApp.lists[id]._all = true;

  },
  setFormList: (e, page, list, type) => {
    var listID = e.target.id;
    console.log(listID);

    if (type === 'string' && $(`#${listID} option:selected`)[0]) {

      userApp.docs.data[page].create[list] = $(`#${listID} option:selected`)[0].id;
    } else {

      userApp.docs.data[page].create[list] = [];
      $(`#${listID} option:selected`).each((index, el) => {
        userApp.docs.data[page].create[list].push(el.id);
      });

    }

  },
  onCheck: (e, name) => {
    console.log('asd');
    console.log(e)
  },
  toggleClass: (id) => {
    $(`#${id}`).toggleClass('flipped');
  },
  noSpecial: (str) => {
    return str.replace(/[^A-Za-z0-9]+/gi, '');
  },
  fileNameCheck: (id) => {
    if ($(`#${id}`)[0] && $(`#${id}`)[0].files && $(`#${id}`)[0].files.length > 0) {
      userApp[id] = $(`#${id}`)[0].files[0].name;
      userApp.$forceUpdate();
      return $(`#${id}`)[0].files[0].name;
    } else {
      userApp[id] = false;
    }

  },
  customcallback: () => {
    console.log('test');
  },
  forceUpdate: (time) => {
    setTimeout(function () {
      userApp;
    }, time);
  },
  vModel: (e, update, secondary) => {

    console.log("RANz");


    if (secondary) {
      e.target.name = e.target.name.split('.')[1];
      userApp.docs.data[userApp.nav.page].create[secondary][e.target.name] = e.target.value;
    } else userApp.docs.data[userApp.nav.page].create[e.target.name] = e.target.value;

    if (update)
      userApp.$forceUpdate();

  },
  
  grabValue: (value) => {
    if(document.getElementById(value))
    return document.getElementById(value).value;
    else
    return false;
  }
,

  navClick: (e, pID, layer) => {

    if (userApp.singleObj)
      userApp.singleObj = false;

    if (userApp.noCrud)
      userApp.noCrud = false;

    var lastParent = document.getElementById(userApp.nav.lastPage);
    var page = e.target.getAttribute('name');
    var parent = document.getElementById(pID);
    var children;

    if (!layer) window.history.pushState(page, page, '/' + page);

    children = lastParent ? Array.from(lastParent.children) : [];

    if ($.fn.DataTable.isDataTable('#mainDataTable')) {

      if (userApp.tables[page] && userApp.tables[page].MakeCellsEditable) {

        console.log("PAGE " + userApp.tables[page])

        userApp.tables[page].MakeCellsEditable("destroy");

      } else if (userApp.tables[userApp.nav.lastPageName] && userApp.tables[userApp.nav.lastPageName].MakeCellsEditable) {

        userApp.tables[userApp.nav.lastPageName].MakeCellsEditable("destroy");

      }

      $('#mainDataTable').DataTable().destroy();
      $('#mainDataTableBody').empty();

      delete userApp.tables[page];

    }

    userApp.nav.page = page;

    userApp.socketJoinRoom({
      room: page,
      leaveLastRoom: true,
      action: 'join'
    });

    let pageSetup = userApp.nav.pageSetup[page] ? userApp.nav.pageSetup[page] : 'genericModal';

    if (pageSetup.categories || pageSetup.watch) {
      userApp.vueCustom = [];
      pageSetup.vueSetup();
    }

    if (pageSetup.lists) pageSetup.lists.forEach((list) => {

      let urlAdd = list.urlAdd ? list.urlAdd : '';

      let url = pageSetup.prefix ? `/${pageSetup.prefix}/${list.name}` : `/${list.name}`;
      console.log('MY URL', url)
      let key = list.keys[0];
      let name = `${list.name.toLowerCase()}List`;
      Vue.nextTick(function () {

        $(`#${name}`).selectpicker();

      });

      userApp.lists[name] = {
        url,
        key,
        urlAdd
      };

      //    userApp.crud('GET', url, {type:'vueList'});

    });

    userApp.checkMenu();
    userApp.clickMenu = [{
        id: "id",
        key: page,
        name: `Open ${page}`,
        groups: ["mods", "administrators", "members"],
        modal: pageSetup
      },
      {
        id: "id",
        name: `Select ${page}`,
        permissions: 1
      },
      {
        id: "id",
        type: "delete",
        name: `Delete ${page}`,
        permissions: 1,
        groups: ["mods", "administrator"],
        swal: {
          type: 'areYouSure',
          name: page
        }
      },
      {
        id: "id",
        divider: true,
        obj: page,
        groups: ["mods", "administrators"],
        name: `Create ${page}`,
        modal: {
          name: `create${userApp.capFirstLetter(page)}`
        }
      }
    ];



    userApp.nav.switch(page);

    if (children.length > 0)
      children.forEach((child) => {
        let activeSub = child.getElementsByClassName(`active`)[0];
        if (activeSub) activeSub.classList.remove('active');
      });

    var subMenu = document.getElementsByClassName(`${page}Sub`);

    if (subMenu[0])
      setTimeout(function () {
        subMenu[0].classList.add("active");
      }, 300);

    if (lastParent) lastParent.classList.remove("active");
    parent.classList.add("active");
    userApp.nav.lastPage = pID;
    userApp.nav.lastPageName = page;

    Vue.nextTick(function () {
      Vue.nextTick(function () {

        $('.bootstrap-switch').each(function () {
          let $this = $(this);
          userApp.docs.data[userApp.nav.page].create[$this[0].name] = $this[0].checked;

          let data_on_label = $this.data('on-label') || '';
          let data_off_label = $this.data('off-label') || '';
          if (!$this[0].className.includes("bootstrap-switch-wrapper"))
            $this.bootstrapSwitch({
              onText: data_on_label,
              offText: data_off_label
            });
        });
        $('.bootstrap-switch-wrapper').on('switchChange.bootstrapSwitch', function (e, state) {
          userApp.docs.data[userApp.nav.page].create[e.target.name] = state;

        });

      });

    });


  },
  checkObj: (obj, name, vue) => {

    if (JSON.stringify(userApp[obj]) !== JSON.stringify(userApp[name])) {
      userApp[vue] = true;

    } else {
      userApp[vue] = false;
    }

  }

,
  settings: (type) => {
    if (type === 'video') {

      userApp.crud('GET', 'vimeo/grab', {
        type: 'vueObject',
        name: 'vimeoAPI'
      });

    }
  },
  settingsSaveCheck: (e, name, vueObj) => {
    let value = e.target.value;
    if (userApp[vueObj][name] !== value) {
      if (!userApp.push[vueObj]) userApp.push[vueObj] = {};
      userApp.push[vueObj][name] = value;
    } else if (userApp.push[vueObj] && userApp.push[vueObj][name]) {
      delete userApp.push[vueObj][name];
    }

    let found = false;
    let push = userApp.push;
    let pushArray = Object.keys(push);

    pushArray.forEach((docs) => {
      console.log(Object.keys(push[docs]).length);
      if (docs !== 'showButton' && Object.keys(push[docs]).length > 0) found = true;

    });

    if (found) {
      push.showButton = true;
    } else push.showButton = false;

  },
  saveSettings: () => {

    if(userApp.push && userApp.push.vimeoAPI && Object.keys(userApp.push.vimeoAPI).length > 0) userApp.crud('POST', 'vimeo/setup', {
      type: 'vueObject',
      name: 'vimeoAPI'
    }, JSON.stringify(Object.assign(userApp.vimeoAPI, userApp.push.vimeoAPI)));
  }
,
  showSwal: (e, type, name, options) => {
    var id = typeof e === 'string' ? e : $(e.target).parents()[2].id;
    var url = options && options.url ? options.url : userApp.tables[name].context[0].ajax.url.split('?')[0];
    if (type === 'areYouSure')
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {

          let send = userApp.nav.page === 'watch' ? `${url}/${id}` : `${url}?where={"_id":"${id}"}`;

          userApp.crud('DELETE', send, {
            event: options && options.event ? options.event : undefined,
            type: options && options.type ? options.type : 'objDelete',
            name
          });

        }
      });

  }
,
  socketJoinRoom: (obj) => {
    socket.emit('joinRoom', obj);
  }
,
  handler: (event) => {

    if(userApp.clickMenuOptions.disabled) return;
    userApp.clickMenuOptions.noTop = false;
    userApp.checkMenu();
    let id = $(event.target).parent()[0].id;
    console.log(id);
    var tX = 215;
    var lX = 125;

    if ($('body')[0].clientWidth < 975) {
      lX -= 95;
    }

    if ($('body')[0].className !== 'sidebar-mini' && $('body')[0].clientWidth > 975) {
      lX += 175;
    }

    

    if (id && id !== 'mainDataTable_wrapper' && id !== 'tableCard' && id !== 'mainDataTable_paginate' && id !== 'mainDataTable_length') userApp.clickMenu.forEach((menu, index) => {

      var permArray = userApp.permArray(menu.permissions);
      var foundPerm = false;
      var newPermArray = JSON.parse(JSON.stringify(userApp.clickMenu));
      if (permArray && permArray !== 'Public')
        Object.keys(permArray).forEach((perm, index2) => {
          if (userApp.user.permissions[perm]) {

            foundPerm = true;
          }

          if (Object.keys(permArray).length - 1 === index2 && !foundPerm) {
            delete newPermArray[index];

          }

        });

      if (menu.groups && !foundPerm) {

        Object.keys(userApp.user.groups).forEach((key, index2) => {

          menu.groups.find((name) => {

            if (name.toLowerCase() === key.toLowerCase()) {

              foundPerm = true;
            }
          });

          if (userApp.user.groups.length - 1 === index2 && !foundPerm) {
            delete userApp.clickMenu[index];

            userApp.clickMenu = userApp.clickMenu.filter(Boolean);

          }

        });
      }

      if (userApp.clickMenu.length - 1 === index && newPermArray) {
        userApp.clickMenu = [...new Set(newPermArray)];

      }

      userApp.clickMenu = userApp.clickMenu.filter(Boolean);

      if (userApp.clickMenu[index])
        userApp.clickMenu[index].id = id;
    });
    else

      userApp.clickMenu.forEach((menu, index) => {

        userApp.clickMenuOptions.noTop = true;

      });

    userApp.openedMenu = true;
    var top = event.pageY;
    var left = event.pageX;
    $("#context-menu").css({
      display: "block",
      top: top - tX,
      left: left - lX
    }).addClass("show").on("click", function () {
      $("#context-menu").removeClass("show").hide();
    });

    event.preventDefault();
  },
  checkMenu: () => {
    if (userApp.openedMenu) {
      userApp.openedMenu = false;
      $("#context-menu").removeClass("show").hide();
    }
  },
  clickMenuFunction: (id, key, type, modal) => {

    console.log(id, key, type, modal)


    if(id === 'createVideos' || modal && modal.name === 'createVideos') $(`#selectVideo`).selectpicker();


    if (type === 'message') {
      getApi(`/api/messages?${key}=${id}&populate=sender%20messages&perPage=0`, 'menuLoad');
      socketJoinRoom({
        room: id,
        action: 'join'
      });
    }

    userApp.tempRooms[modal] = {
      id
    };
    userApp.modal = true;
    userApp.clickMenuObj.id = id;
    userApp.$forceUpdate();
    if (modal && type !== 'delete') userApp.openModal($(`#${id}`).index(), modal.name, key);
    if (type === 'delete') userApp.showSwal(id, modal.type, modal.name);

  }
,
  toastr: (type, msg, title, options) => {

    let tOptions = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "onHidden": () => delete userApp.toastrs[options.id],
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.options = options ? Object.assign(tOptions, options) : tOptions;


    userApp.toastrs[options.id] = toastr[type](msg, title);
    
   
  }
,
  permArray: (num) => {
    if (!num) return "Public";
    var binaries = num.toString(2);
    var binaryArray = {};
    for (let i = 1; i <= binaries.length; i++) {

      var binary = binaries.substr(binaries.length - i);
      var boolean = binary.charAt(0);

      if (Number(boolean)) {

        var number = '1'.padEnd(i, '0');

        binaryArray[parseInt(number, 2)] = true;

      }

      if (i === binaries.length) {

        return binaryArray;

      }
    }

    return binaryArray;

  }
,

  closeVideoComments:(id) => {

    var arr = $('#vcomments-'+id).attr('class').split(" ");

    if(arr.length === 3 && arr[2] === 'show') {
      console.log("CLICK")
    $('#vcomments-'+id).siblings()[4].click();

    }
  },

  createCommentScript: (name, count) => {

    if (!count) count = 0;

    if ($('#vcomments-' + name)[0]) {
      var el = $('#vcomments-' + name);
      var card = $(el.parents()[2]);


      if (!$._data( el[0], "events" )) {
        //execute it
        $('#vcomments-' + name).on('hide.bs.collapse', function () {

          var height = card.height() - el.height();
          
          card.css('cssText', 'height: ' + height + 'px !important;');


        });

        $('#vcomments-' + name).on('show.bs.collapse', function () {

          var height = card.height() + el.height();

          card.css('cssText', 'height: ' + height + 'px !important;');
          console.log("HOW");
        });


      }

    }

    else if (count < 100)

      setTimeout(function () {
        count++;
        userApp.createCommentScript(name, count);
      }, 0);




    return;

  },

  videoCommentSize: (e) => {




    // if (!userApp.growVideo) {
    //   var el = $(e.target);

    //   userApp.growVideo = true;

    //   var card = $(el.parents()[2]);

    //   var comments = $(el.data('target'));

    //   var commentClasses = comments.attr("class").split(" ");

    //   var height = commentClasses.length === 4 && commentClasses[3] === 'show' ? card.height() - el.height() : card.height() + el.height();

    //   card.css('cssText', 'height: ' + height + 'px !important;');

    // }



  },

  videoClick: (e) => {

    e.preventDefault();

    var text = e.target.innerText;

    if (Array.isArray(userApp.vueCustom)) {

      userApp.backupArr = userApp.vueCustom;

      userApp.vueCustom.forEach(obj => {

        if (obj.name === text) {

          userApp.vueCustom = [obj];
          userApp.singleObj = true;

          window.history.pushState('watch/' + text, text, '/watch/' + text);

        }

      });

    }


  },

  checkVideo: (id) => {
    if ($(`#${id}`)[0]) return false;
    return true;
  },
  videoDoc: (id) => {
    userApp.files = $(`#${id}`)[0].files[0];
    if (userApp.docs.data.videos.create.groups && userApp.docs.data.videos.create.groups.length === 0) delete userApp.docs.data.videos.create.groups;
    userApp.filePush = jQuery.param(userApp.docs.data.videos.create);
    r.addFile($(`#${id}`)[0].files[0]);
  },
  videoUrl: () => {

    console.log(userApp.docs.data.videos.create);

    if ($('#selectVideo').val() === 'Vimeo') userApp.docs.data.videos.create = Object.assign(userApp.docs.data.videos.create, {
      services: {
        type: {
          web: 'Vimeo'
        }
      }
    });

    if ($('#selectVideo').val() === 'YouTube') {

      if (userApp.docs.data.videos.create.url)

        userApp.docs.data.videos.create = Object.assign(userApp.docs.data.videos.create, {
          services: {
            type: {
              web: 'YouTube'
            }
          }
        });


    }

    userApp.crud('POST', `/videos/all`, {
      type: 'docCreate',
      name: 'videos',
      modal: 'createVideos'
    }, JSON.stringify(userApp.docs.data.videos.create));


  },
  playTick: (id) => {
    Vue.nextTick(function () {
      $(`#${id}`).on("click play", function () {
        playFile.call(this);
      });

    });

  }
 },
  mounted: function() {
    Vue.nextTick( function() {



    



    })


  },

  directive: ('$model', {
    bind: function (el, binding, vnode) {
      el.oninput = () => (vnode.context[binding.expression] = el.value);
    }
  }),

  created: () => {
    $("#loader").css("display", "none");

    if($('socketRequest')[0]) {

  
      Vue.nextTick( () => {


        setTimeout(function(){
          console.log("RAN")
          $('.myVideosComments').on('hidden.bs.collapse', function () {
            console.log("RANz");
          })
      }, 0);


        var page = $('socketRequest').data('page');
        var data = $('socketRequest').data('objs');

        if(data.length === 1) 
          userApp.singleObj = true;
          else
          userApp.singleObj = false;
        

        userApp.vueCustom = data;
        userApp.backupArr = data;
        userApp.noCrud = true;
        userApp.nav.page = page;
        userApp.$forceUpdate();
        console.log("SOCKET REQUEST GUI");
        $('socketRequest').remove()
     //   videosGetVideos({query:{}})
      });

    }

  },

  end: {

  }
})