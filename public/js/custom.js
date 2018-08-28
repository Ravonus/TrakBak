//This auto feels backend server ip and port.
var clikbakSocket = 'http://192.168.0.169:1338';

//public table variable.
var t;

//Logout function
function logout() {
  localStorage.removeItem("clikbak");
  window.location.href = "/";

}

//Capital first letter of word
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//create ajax datatable. Requires URL, Array of columns and data, page.
function tableCreate(url, columns, page) {

  var t = $(page).find('#testTable').DataTable({
    columns,
    autoWidth: false,
    select: true,
    bAutoWidth: false,
    lengthMenu: false,
    columnDefs: [{
      width: "1%",
      orderable: false,
      searchable: false,
      data: null,
      defaultContent: '<input type="checkbox" id="checkbox"><label for="checkbox" class="mr-2 label-table"></label>',
      className: 'select-checkbox',
      targets: 0,
      render: function () {
        i = 0;
        $('#testTable').find(":checkbox").each(function (index, check) {
          $(check).next().attr('for', 'checkbox' + i)

          check.id = 'checkbox' + i;
          i++;
        })

      }
    },
    {
      orderable: false,

      targets: [0]
    },
    {
      width: "15%",
      targets: [1]
    }
    ],

    select: {
      style: 'os',
      selector: 'td:first-child'
    },
    order: [[1, 'asc']],
    colReorder: true,
    responsive: {

    },
    colReorder: {
      fixedColumnsLeft: 1,
      realtime: true
    },
    // This is the server processing and ajax request. (It uses public API call which then uses an encrypted version of your JWT token. The server has the key and unencrypts string and checks. This is why the method is public instead of just sending token... I dont want client to extract token key.)
    processing: true,
    serverSide: true,
    ajax: {
      url: url,
      type: 'GET'
    }
  });

  return t;

}

//destroy select fields.
function selectDestroy() {

  selectSocket(['domains', 'paths', 'postbacks']);
  $("#newSocketModal").modal('toggle');

}

var hideNav = function () {
  $('#mainNav').collapse('hide');
}


//wait for document ready - Below wil be window functions (Sub navigation names can be set to true - When done so they will run a windows.function of that subnav name.)
$(document).ready(function () {

  //check dropdown change

  $($('#newScriptModal').find('.mdb-select.colorful-select.dropdown-primary')).on('change', function (event) {

    if (event.target.value === 'basic') {
      selectClikbakSocket();
      // $('#newScriptModal').find('.modal-body').append($('#basicSelect')[0]);

    }
  });

  //domains subnaviation function (This function is to View/Edit/Remove domains)

  window.domains = function domains() {
    if (!$('#mainId').find('#viewDomainHtml')[0]) {
      $('#mainId').empty();
      $(document).find('main')[0].className = '';
      $('#floatButton').css('display', '');
      $($('#floatButton').find('a')[0]).off();
      $($('#floatButton').find('a')[0]).on("click", createDomainModal);
      var page = $('#viewDomainHtml')[0].cloneNode(true);
      page.style = '';
      $('#mainId').append(page);

      //create datatable - With api request function. Local function will check jwt/user ID and make sure they are correct user. If so it pulls multuple objects. You will see data types set on columns. Objects match data via these object types.

      var columns = [
        { "name": "checkbox", responsivePriority: -1, data: "checkbox" },
        { "name": "name", responsivePriority: 1, data: "domain" },
      ];
      var url = clikbakSocket + '/domains?user=' + clikbak.user._id + '&jwt=' + clikbak.jwt;
      t = tableCreate(url, columns, page);

      t.on('order.dt search.dt row-reorder', function (e, settings, details) {

        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          i++;
          if (i === 1) {
          }

        });
        tDone(t);
      }).draw();

      t.on('column-reorder', function (e, settings, details) {
        tDone(t);
      }).draw();

      function tDone() {

        $('#viewDomainHtml table tr').each(function (index, td) {

          if ($(td).find('.sorting_1').text()) {
            $.fn.editable.defaults.mode = 'inline';
            $.fn.editable.defaults.ajaxOptions = { type: "PUT" };

            var headers = {
              'Authorization': clikbak.jwt,
              "Content-Type": "application/json",
            };

            var a = $('<a>' + $(td).find('.sorting_1').text() + '</a>');
            $(td).find('.sorting_1').html(a);

            //another public API call 
            var url = clikbakSocket + '/domains/' + td.id + '?jwt=' + clikbak.jwt;
            $(a).editable({
              type: 'text',
              beforeSend: function (xhr) {
                // setting a timeout
                $.ajax($.extend(this, {
                  data: JSON.stringify({ name: $('.editable-input').find('input')[0].value })
                }
                ));
              },
              url: url,
              headers: headers,
              pk: 1,
              title: 'Enter Name',
              success: function () { console.log('Success!'); }
            });

          }

        });

      }

    };

  }

  //subnavigation langingpages (This function is to View/Edit/Remove Landing pages)

  window.landingpages = function landingpages() {
    if (!$('#mainId').find('#viewLPHtml')[0]) {
      $('#mainId').empty();
      $(document).find('main')[0].className = '';
      $('#floatButton').css('display', '');
      $($('#floatButton').find('a')[0]).off();
      $($('#floatButton').find('a')[0]).on("click", createLPModal);

      var page = $('#viewLPHtml')[0].cloneNode(true);

      page.style = '';

      $('#mainId').append(page);

      var columns = [
        { "name": "checkbox", responsivePriority: -1, data: "checkbox" },
        { "name": "name", responsivePriority: 1, data: "name" },
        { "name": "path", responsivePriority: 2, data: "path" }
      ];

      var url = clikbakSocket + '/paths?user=' + clikbak.user._id + '&jwt=' + clikbak.jwt;

      // check tableCreate function above line 20.
      t = tableCreate(url, columns, page);

    };

  }

  //subnavigation callbacks (This function is to view/create and edit callbacks)

  window.callbacks = function callbacks() {
    if (!$('#mainId').find('#viewCallbacksHtml')[0]) {
      $('#mainId').empty();
      $(document).find('main')[0].className = '';
      $('#floatButton').css('display', '');
      var page = $('#viewCallbacksHtml')[0].cloneNode(true);
      page.style = '';
      $('#mainId').append(page);

      var columns = [
        { "name": "checkbox", responsivePriority: -1, data: "checkbox" },
        { "name": "name", responsivePriority: 1, data: "name" }
      ];

      var url = clikbakSocket + '/postbacks?user=' + clikbak.user._id + '&jwt=' + clikbak.jwt;

      // check tableCreate function above line 20.
      t = tableCreate(url, columns, page);

    };

  }

  //sockets subnaviation function (This function is to View/Edit/Remove sockets)

  window.sockets = function sockets(msg) {
    // selectSocket(['domains', 'paths', 'postbacks']);
    if (!$('#mainId').find('#viewScheduleHtml')[0]) {
      $('#mainId').empty();
      $(document).find('main')[0].className = '';
      $('#floatButton').css('display', '');
      $($('#floatButton').find('a')[0]).off();
      $($('#floatButton').find('a')[0]).on("click", selectDestroy);

      var viewScheduleHtml = $('#viewScheduleHtml')[0].cloneNode(true);

      viewScheduleHtml.style = '';

      $('#mainId').append(viewScheduleHtml);

      t = $(viewScheduleHtml).find('#testTable').DataTable({
        "columns": [
          { "name": "checkbox", responsivePriority: -1 },
          { "name": "id", responsivePriority: 2 },
          { "name": "name", responsivePriority: 0 },
          { "name": "domains", responsivePriority: 3, className: "td-domains" },
          { "name": "paths", responsivePriority: 4, className: "td-paths" }
        ],
        autoWidth: false,
        select: true,
        bAutoWidth: false,
        lengthMenu: false,
        columnDefs: [{
          width: "1%",
          orderable: false,
          searchable: false,
          data: null,
          defaultContent: '<input type="checkbox" id="checkbox"><label for="checkbox" class="mr-2 label-table"></label>',
          className: 'select-checkbox',
          targets: 0,
          render: function () {

            i = 0;
            $('#testTable').find(":checkbox").each(function (index, check) {
              $(check).next().attr('for', 'checkbox' + i)

              check.id = 'checkbox' + i;
              i++;
            })

          }
        },
        {
          orderable: false,

          targets: [0, 3, 4]
        },
        {
          width: "15%",
          targets: [1, 3, 4]
        },
        {
          width: "5%",
          targets: 2
        }
        ],

        select: {
          style: 'os',
          selector: 'td:first-child'
        },
        order: [[1, 'asc']],
        colReorder: false,
        colReorder: {
          fixedColumnsLeft: 1,
          realtime: true
        },
        processing: true,
        serverSide: true,
        ajax: {
          url: clikbakSocket + '/sockets?user=' + clikbak.user._id + '&jwt=' + clikbak.jwt,
          type: 'GET'
        }
      });

      t.on('order.dt search.dt row-reorder', function (e, settings, details) {

        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          i++;
          if (i === 1) {

            // $(cell).parent().parent().append('<tr role="row" class="addSocket"><td </td><td <label for="newSocketName">Socket name</label> <input type="text" id="newSocketName" class="form-control"></td><td>socketOn4</td><td>clikbak.com,localhost</td><td>/landingpage/test</td></tr>')
          }
          console.log($(cell).parent());
          $(cell).parent()[0].id = 'row-' + i;
          cell.innerHTML = '<input type="checkbox" id="checkbox' + i + '"><label for="checkbox' + i + '" class="mr-2 label-table"></label>';



        });
        tDone(t);
      }).draw();

      t.on('column-reorder', function (e, settings, details) {
        tDone(t);
      }).draw();

    }

  }

  function tDone(t) {

    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.ajaxOptions = { type: "PUT" };
    //$.fn.editableform.buttons = 

    var body = $('#testTable').find('tbody');


    $(body).find('tr').each(function (index, tr) {


      var x = 0;


      $(tr).find('td').each(function (key, td) {

        if (x === 2) {

          var headers = {
            'Authorization': clikbak.jwt,
            "Content-Type": "application/json",
          };


          var a = $('<a>' + td.innerText + '</a>');
          $(td).html(a);
          var url = clikbakSocket + '/sockets/' + $(td).prev()[0].innerText + '?jwt=' + clikbak.jwt;
          $(a).editable({
            type: 'text',
            beforeSend: function (xhr) {
              // setting a timeout
              $.ajax($.extend(this, {
                data: JSON.stringify({ name: $('.editable-input').find('input')[0].value })
              }
              ));
            },
            url: url,
            headers: headers,
            pk: 1,
            title: 'Enter Name',
            success: function () { console.log('Success!'); }
          });

        }

        if (x === 3) {

          var array = td.innerText.split(',');

          var text = '';

          array.forEach(function (tag) {

            var arr = tag.split(':');
            if (arr[1] !== undefined) {

              text += '<div class="chip blue darken-1 white-text">' + arr[0] + '<i class="close fa fa-times" id="chip-' + arr[1] + '"onclick="closeChip(this, \'domains\')"></i></div>'
            }

          });

          text += '<button id="domains" type="button" class="btn btn-outline-blue btn-rounded btn-sm px-2 waves-effect waves-dark" onclick="socketUpdateModal(this)" ><i class="fa fa-plus mt-0"></i></button>'

          $(td).html(text);

        }

        if (x === 4) {

          var array = td.innerText.split(',');

          var text = '';

          array.forEach(function (tag) {

            var arr = tag.split(':');

            if (arr[1] !== undefined) {

              text += '<div class="chip blue darken-1 white-text">' + arr[0] + '<i class="close fa fa-times" id="chip-' + arr[1] + '"onclick="closeChip(this, \'paths\')"></i></div>'

            }

          });

          text += '<button type="button" id="paths" class="btn btn-outline-blue btn-rounded btn-sm px-2 waves-effect waves-dark" onclick="socketUpdateModal(this)" ><i class="fa fa-plus mt-0"></i></button>'

          $(td).html(text);
        }
        x++;

      });


    });

    t.on('row-reorder', function (e, diff, edit) {
      var result = 'Reorder started on row: ' + edit.triggerRow.data()[1] + '<br>';

      for (var i = 0, ien = diff.length; i < ien; i++) {
        var rowData = table.row(diff[i].node).data();

        result += rowData[1] + ' updated to be in position ' +
          diff[i].newData + ' (was ' + diff[i].oldData + ')<br>';
      }

      $('#result').html('Event result:<br>' + result);
    });

  }

});

//functions

function deleteSocket() {

  var toDelete = [];

  $('#viewScheduleHtml').find('input:checkbox').each(function (index, check) {

    if (check.checked) {
      toDelete.push($($('#viewScheduleHtml').find('input:checkbox')[1]).parent().next()[0].innerText);
    }

  });

  var url = clikbakSocket + '/sockets/' + toDelete[0] + '?jwt=' + clikbak.jwt;

  $.ajax({
    url: url,
    type: 'delete',
    data: JSON.stringify({ delete: toDelete.shift() }),
    success: function (data) {
      $('#mainId').find('#testTable').DataTable().ajax.reload();
      $('#confirmDelete').modal('toggle');
    }
  });



}

function socketUpdateModal(click) {

  console.log($(click));
  // $($('#addDomain').find('.select-dropdown, li:contains("clikbak.com"),li:contains("minepocket.com")')).trigger('click');
  var type = $(click)[0].id;
  console.log('this is test')
  console.log(type);
  $('#addDomain').find('input.addSocket')[0].id = $($(click).parent().parent().children()[1]).text();
  var select = $('#addDomain').find('.select-wrapper.mdb-select.colorful-select.dropdown-primary.sockets.createSocket option:first')[0];
  select.value = type;
  select.innerText = capFirst(type);
  $('#addDomain').find('h5')[0].innerText = 'Add ' + capFirst(type).slice(0, -1);
  $('#addDomain').find('label')[0].innerText = capFirst(type).slice(0, -1) + ' Name'

  if (type === 'domains') {

    $('#addDomain').find('div')[7].style = 'display: none;'

  } else {

    $('#addDomain').find('div')[7].style = ''

  }

  selectSocket([type], $(click).parent().parent()[0].id);

  $($(click).parent()).find('div').each(function (index, div) {

    // $($('#addDomain').find('.select-dropdown, li:contains("'+div.innerText.trim()+'")')).trigger('click');

  });

}

function findJavaScript(scriptName, regEx, _callback) {


  var client = new XMLHttpRequest();

  client.open('GET', '/js/' + clikbak.user._id + '/' + scriptName + '.js');

  var foundObj = {}
  client.onreadystatechange = function () {
    if (client.responseText) {
      if (!foundObj[client.responseText]) {

        foundObj[client.responseText] = true;
        if ((m = regEx.exec(client.responseText)) !== null) {

          _callback(m[0]);

        } else {

          _callback();

        }


      }

      // The result can be accessed through the `m`-variable.
    }

  }
  client.send();

}



function javascriptModal(type, script) {

  function replaceScript(foundFunction, regEx) {
    $('.CodeFlask__pre').empty();
    $('.CodeFlask__textarea').empty();
    $('.CodeFlask__textarea').append(foundFunction);
    var flask = new CodeFlask;
    flask.run('#codeWrapper', { language: 'javascript' })
    $('#viewScriptRegEx').val(regEx);
    $('#viewScriptTitle').text(script);
    $('#javascriptModal').modal('toggle');
  }

  if (type.indexOf('socketClikBak') !== -1) {

    if (type.indexOf('-connect') !== -1) {

    }

    if (type.indexOf('-post') !== -1) {
      var regEx = /socket.on\('socketClikBak'[^}]+}\);/i;

      findJavaScript(script, regEx, function (foundFunction) {

        if (foundFunction) {
          replaceScript(foundFunction, "socket.on\('socketClikBak'[^}]+}\);");

        } else {

        }



      });
      return;
    }

    if (type.indexOf('-disconnect') !== -1) {

    }

    if (type.indexOf('-test') !== -1) {

      var regEx = /socket.on\('socketClikBakTest'[^}]+}\);/i;

      findJavaScript(script, regEx, function (foundFunction) {

        if (foundFunction) {
          replaceScript(foundFunction, "socket.on\('socketClikBakTest'[^}]+}\);");

        } else {

        }



      });
      return;
    }


    $('#editScriptModal').modal('toggle');
    return;
  }

  if (type.indexOf('socketParams') !== -1) {

    $('#javascriptModal').modal('toggle');
    return;
  }

}

function createDomainModal() {

  $('#createDomainModal').modal('toggle');

}

function createLPModal() {

  $('#createLPModal').modal('toggle');

}

function checkSocketType(scriptCard, script, sockets) {

  if (sockets.length > 0) {



    sockets.forEach(function (socket) {
      if (socket.type === 'clikbak') {
        console.log(socket)
        // const regex = /socket.on\('socketClikBak'[^}]+}\);/i;
        // if ((m = regex.exec(script)) !== null) {
        var row = $(scriptCard).find('.row.scriptRow');
        row.append('<div class="col-4 col-lg-3 mx-auto my-5 waves-effect waves-ping" onclick="javascriptModal(\'socketClikBak-connect\',\'' + script + '\')"><i class="fa fa-plug fa-4x" aria-hidden="true"></i></div>');
        row.append('<div class="col-4 col-lg-3 mx-auto my-5 waves-effect waves-ping" onclick="javascriptModal(\'socketClikBak-post\',\'' + script + '\')"><i class="fa fa-hand-o-left fa-4x" aria-hidden="true"></i></div>');
        row.append('<div class="col-4 col-lg-3 mx-auto my-5 waves-effect waves-ping" onclick="javascriptModal(\'socketClikBak-disconnect\',\'' + script + '\')"><i class="fa fa-level-down fa-4x" aria-hidden="true"></i></div>');
        row.append('<div class="col-4 col-lg-3 mx-auto my-5 waves-effect waves-ping" onclick="javascriptModal(\'socketClikBak-test\',\'' + script + '\')"><i class="fa fa-book fa-4x" aria-hidden="true"></i></div>');
        // console.log(m[0]);

        // }
      }

    })
  }




}

function createScript() {
  $("#newScriptModal").modal('toggle');
}

function sideNav() {


  var mainKey;
  Object.keys(clikbak.user.navigation).forEach(function (key) {
    mainKey = key;
    if (clikbak.user.navigation[mainKey].enabled) {

      Object.keys(clikbak.user.navigation[mainKey].navigation).forEach(function (key) {
        var subKey = key;
        //    var cbLi = $('#cbLi')[0].cloneNode(true);
        var cbLi = $('#cbLi')[0].cloneNode(true);
        $(cbLi).html('<a class="collapsible-header waves-effect arrow-r"><i class="fa fa-tachometer"></i>' + subKey + '<i class="fa fa-angle-down rotate-icon"></i></a><div class="collapsible-body" style="display: none;"><ul></ul></div>')
        cbLi.id = key;

        Object.keys(clikbak.user.navigation[mainKey].navigation[subKey]).forEach(function (key) {
          if (clikbak.user.navigation[mainKey].navigation[subKey][key]) {
            //      console.log(key);
            //   var cbLiSub = $('#cbLiSub')[0].cloneNode(true);
            var cbLiSub = $('#cbLiSub')[0].cloneNode(true);
            cbLiSub.style = "";
            $(cbLiSub).html('<a class="waves-effect __web-inspector-hide-shortcut__">' + key + '</a>');
            $(cbLiSub).click(function (e) {
              key = key.replace(/\s/g, '');
              var msg = 'no way' + key;
              window[key](msg);
            });
            //   console.log(cbLiSub);
            //     console.log($(cbLi).find('ul')[0]);

            $(cbLi).find('ul')[0].append(cbLiSub);


          }
        });
        cbLi.style = "";


        $('#cbSideNav').append(cbLi);


      });
    }
  });
  $('#cbSideNav').collapsible();

}


//check to see if Email still needs to be registered
var checkRegistration = function () {
  console.log(clikbak.user);
  if (clikbak.user.registrationKey !== null) {

    var options = {
      closeButton: true,
      preventDuplicates: true,
      positionClass: 'toast-top-full-width'
    }

    alerts('error', 'Email Verification', 'You still need to verify your email before you can access application.', options)

  }
}

//This is function for alerts


var alerts = function (type, name, msg, options) {

  if (!options) {
    options = {}
  }


  if (!options.closeButton) {
    options.closeButton = undefined;
  }
  if (!options.debug) {
    options.debug = undefined;
  }
  if (!options.newestOnTop) {
    options.newestOnTop = undefined;
  }
  if (!options.progressBar) {
    options.progressBar = undefined;
  }
  if (!options.positionClass) {
    options.positionClass = undefined;
  }
  if (!options.preventDuplicates) {
    options.preventDuplicates = undefined;
  }
  if (!options.onclick) {
    options.onclick = undefined;
  }
  if (!options.showDuration) {
    options.showDuration = undefined;
  }
  if (!options.hideDuration) {
    options.hideDuration = undefined;
  }
  if (!options.timeOut) {
    options.timeOut = undefined;
  }
  if (!options.extendedTimeOut) {
    options.extendedTimeOut = undefined;
  }
  if (!options.showEasing) {
    options.showEasing = undefined;
  }
  if (!options.hideEasing) {
    options.hideEasing = undefined;
  }
  if (!options.showMethod) {
    options.showMethod = undefined;
  }
  if (!options.hideMethod) {
    options.hideMethod = undefined;
  }


  toastr.options = {
    "closeButton": options.closeButton,
    "debug": options.debug,
    "newestOnTop": options.newestOnTop,
    "progressBar": options.progressBar,
    "positionClass": options.positionClass,
    "preventDuplicates": options.preventDuplicates,
    "onclick": options.onclick,
    "showDuration": options.showDuration,
    "hideDuration": options.hideDuration,
    "timeOut": options.timeOut,
    "extendedTimeOut": options.extendedTimeOut,
    "showEasing": options.showEasing,
    "hideEasing": options.hideEasing,
    "showMethod": options.showMethod,
    "hideMethod": options.hideMethod
  }

  Command: toastr[type](msg, name);

  if (!options) {
    options = {};
  }
}

//registration Script

var registration = function (username, email, password) {

  $.ajax({
    type: 'POST',
    url: 'https://localhost:2021/auth/local/register',
    data: {
      username: username,
      email: email,
      password: password
    },
    done: function (auth) {
      console.log('Well done!');
      console.log('User profile', auth.user);
      console.log('User token', auth.jwt);
    },
    fail: function (error) {
      console.log('An error occurred:', error);
    }
  });

}

var clikbak = {}
if (localStorage.getItem('clikbak')) {
  clikbakSession = localStorage.getItem('clikbak');
  me();


  clikbak.jwt = clikbakSession;
  // clikbak.user = JSON.parse(clikbakSession).user;
  console.log(clikbak.jwt);
}

//logged in
if (clikbak && clikbak.jwt) {

  document.cookie = "jwt=" + clikbak.jwt;

  //keep at top because visual.
  $('#cpHeader').css('display', '');


  //check if home page
  if (window.location.pathname === "/") {

  } else {

    //redirect keep at end so logic can finish.
    window.location.href = '/';

  }

  //not logged in
} else {

  //check if home page if so redirect.
  if (window.location.pathname === "/") {

    window.location.href = '/login';

  }

}


