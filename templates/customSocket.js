//var socket = io('https://cp.clikbak.com');
// var socket = io('http://localhost:2022z');
var socket = io('{{server}}');
var clikbakSocket = '{{serverBack}}';

function closeChip(click, type) {

  var socketId = $(event.target).parent().parent().parent().children()[1].innerText;
  console.log(socketId);
  var chipArr = [];
  $(event.target).parent().parent().find('i').each(function (key, icon) {
    if (event.target.id !== icon.id && icon.id !== '') {

      chipArr.push(icon.id.slice(5));

    }
  });

  socket.emit('socketUpdate', {
    jwt: localStorage.clikbak,
    type: type,
    data: chipArr,
    socketId: socketId,
    closeChip: true
  });

}

function addChip() {

  


  var socketId = $('#addDomain').find('input.addSocket')[0].id;
  console.log(socketId);
  var chipArr = $($('#addDomain').find('select')[0]).val();
  var type = $($('#addDomain').find('select')[0]).find('option')[0].value;


  console.log(chipArr);

  socket.emit('socketUpdate', {
    jwt: localStorage.clikbak,
    type: type,
    data: chipArr,
    socketId: socketId
  });

}

function scriptScriptsDone(data) {

  var viewScripts = $('#viewScripts')[0].cloneNode(true);
  viewScripts.style = '';



  data.scripts.forEach(function (script) {

    var scriptCard = $('#scriptCard')[0].cloneNode(true);
    $(scriptCard).css('display', '');
    //  $(scriptCard).find('div')[1].innerText = script.scriptName;
    //var client = new XMLHttpRequest();



    // client.open('GET', '/js/'+clikbak.user._id+'/'+script.scriptName+'.js');

    // var foundObj = {}
    // client.onreadystatechange = function () {
    //   if(client.responseText) {
    //   if(!foundObj[client.responseText]) {

    //     foundObj[client.responseText] = true;
    if (script.sockets && script.sockets.length > 0) {
      console.log(scripts.sockets)
      console.log(script);
      checkSocketType(scriptCard, script.scriptName, script.sockets);
    }

    //   }

    //     // The result can be accessed through the `m`-variable.


    // }

    // }
    // client.send();
    $(viewScripts).append(scriptCard);
  })
  $('#mainId').empty();
  $(document).find('main')[0].className = '';
  $('#floatButton').css('display', '');
  $($('#floatButton').find('a')[0]).off();
  $($('#floatButton').find('a')[0]).on("click", createScript);
  $('#mainId').append(viewScripts);
}

//function to view/Edit/Remove scripts.

window.autoscripts = function autoscripts() {


  if (!$('#mainId').find('#viewScripts')[0]) {

    socket.emit('viewScripts', {
      jwt: localStorage.clikbak,
    });


  }
}

function updateScript() {
  console.log('ran');
  socket.emit('saveScript', {
    jwt: localStorage.clikbak,
    id: clikbak.user._id,
    regEx: $('#viewScriptRegEx').val(),
    text: $('#codeWrapper').find('textarea').val(),
    script: $('#viewScriptTitle').text()
  });

}

function createDomain() {

  socket.emit('createDomain', {
    jwt: localStorage.clikbak,
    object: { name: $('#domainName').val() }
  })
};

function createLP() {

  socket.emit('createLP', {
    jwt: localStorage.clikbak,
    object: { name: $('#LPName').val(), path: $('#fullPathName').val() }
  })
};

function me() {

  socket.emit('me', {
    jwt: localStorage.clikbak,
  });

};

function selectClikbakSocket() {
  socket.emit('selectClikbakSocket', {
    jwt: localStorage.clikbak,
  });
}

function createSocket() {

  var socketObj = {}

  var form = $('#newSocketModal').find('.createSocket');
  socketObj.name = form[0].value;
  socketObj.domains = $(form[3]).val();
  socketObj.paths = $(form[5]).val();
  socketObj.postbacks = $(form[7]).val();
  if ($(form[9]).val() !== null) {
    socketObj.type = $(form[9]).val();
  } else {
    socketObj.type = 'clikbak'
  }
  socket.emit('socketCreate', {
    jwt: localStorage.clikbak,
    object: socketObj
  });

}

function selectSocket(pages, row) {
  socket.emit('selectSocket', {
    jwt: localStorage.clikbak,
    pages: pages,
    row: row
  });
}

function signUp() {

  var formId;
  $('#offerNav > li > a').each(function (i) {

    if ($(this)[0].className.indexOf('active') !== -1) {
      formId = $(this).attr('formId');
    }

  });
  // console.log(formId);
  let form = $('#' + formId).serializeArray();
  //console.log(form);

  socket.emit('registration', {
    url: window.location.href,
    formId: formId,
    form: form,
  });
}

socket.on('createDomain', function (data) {

  console.log(data);
});

socket.on('createLP', function (data) {

  console.log(data);
});

socket.on('postData', function (data) {

  if (JSON.parse(data.msg).statusCode === 400) {
    var options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "showDuration": 500,
      "hideDuration": 1000,
      "onClose": function () {
        console.log('test');
      },
      "timeOut": 5000,
      "extendedTimeOut": 5000,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
    };

    if (typeof JSON.parse(data.msg).message !== 'object') {
      var error = JSON.parse(data.msg).message
    } else {
      var error = JSON.parse(data.msg).message[0].messages[0].id;
    }

    Command: toastr["error"](error, JSON.parse(data.msg).error, options)

  } else {
    var options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "showDuration": 500,
      "hideDuration": 1000,
      "timeOut": 5000,
      "extendedTimeOut": 5000,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
    Command: toastr["success"]('Please check email for verification.', 'Account Created', options);
    $('#paymentModal').modal('hide');
  }

});

if (window.location.href.indexOf('/auth/verify?') !== -1) {
  function getSecondPart(str) {
    return str.split('=')[1];
  }
  var key = getSecondPart(window.location.href);

  socket.emit('verify', {
    key: key
  });
  socket.on('verify', function (data) {

    console.log(data);
    //  window.location.href = '/'

  });
}

function login() {
  console.log($('#formLogin > div > input'));

  $('#formLogin > div > input').each(function (i) {

    var value = $(this).val();

  });

  let test = $('#formLogin');
  let form = $('#formLogin').serializeArray();

  socket.emit('login', {
    url: window.location.href,
    form: form
  });

}

function saveScript() {

  socket.emit('createScript', {
    jwt: localStorage.clikbak,
    template: { template: $($('#newScriptModal').find('.mdb-select.colorful-select.dropdown-primary')[1]).val(), name: $('#newScriptModal').find('input').val(), socketScripts: [$($('#newScriptModal').find('.mdb-select.colorful-select.dropdown-primary')[3]).val()], id: clikbak.user._id }
  });
}

socket.on('socketCreate', function (data) {

  console.log(data);
  socketObj = {};
  var form = $('#newSocketModal').find('.createSocket');
  socketObj.name = form[0].value;
  form[0].value = '';
  form[1].className = 'createSocket';
  var name = $(form).find(':input.select-dropdown');
  socketObj.domains = $(name)[0].value;
  $(form[3]).val('');
  socketObj.paths = $(name)[1].value
  $(form[5]).val('');
  socketObj.postbacks = $(name)[2].value
  $(form[7]).val('');
  //set table column as well
  $(form[9]).val('');


  $('#testTable').prepend('<tr role="row" class="appended"><td class=" select-checkbox" tabindex="0"><input type="checkbox" id="checkbox' + data + '"><label for="checkbox1" class="mr-2 label-table"></label></td><td>' + data + '</td><td>' + socketObj.name + '</td><td>' + socketObj.domains + '</td><td>' + socketObj.paths + '</td></tr>');
  var highlight = $('#testTable').find('.appended')[0]
  $('#mainId').find('#testTable').DataTable().ajax.reload();
  //perhaps create a better function for this - Make it a function that takes an integer (The integer is subtracted within the function.) After the time out it reruns same function - That function checks integer if its not 0 it keeps going until 0.
  // This will make it so only one highlight function is running at once - instead of increasing the time of each one.  This is a smaller function so not a huge deal but should be fixed.
  for (var i = 0; i < 10; i++) {

    if (i < 5) {
      if (i === 0) {
        var timer = 50;
        var highlighter = 0.1;
        var rgb = 'rgba(41, 218, 9, ' + highlighter + ')';
        $(highlight).css("background-color", rgb);
      } else {

        setTimeout(function () {

          highlighter = highlighter + 0.1
          var rgb = 'rgba(41, 218, 9, ' + highlighter + ')';
          $(highlight).css("background-color", rgb);

        }, timer);

        timer = timer + 50;

      }

    } else {

      setTimeout(function () {

        highlighter = highlighter - 0.1
        var rgb = 'rgba(41, 218, 9, ' + highlighter + ')';
        $(highlight).css("background-color", rgb);

      }, timer);

      timer = timer + 50;

    }
  }



  $("#newSocketModal").modal('toggle');

});


socket.on('selectClikbakSocket', function (data) {

  $($('#basicSelect').find('.mdb-select')[1]).empty();
  $($('#basicSelect').find('.mdb-select')[1]).prepend('<option value="" disabled selected>Pick socket</option>');

  console.log(JSON.parse(data.msg))

  JSON.parse(data.msg).forEach(function (socket) {
    $($('#basicSelect').find('.mdb-select')[1]).append('<option value="' + socket._id + '">' + socket.name + '</option>');
  })

  $('#basicSelect').css('display', '');


  $('.mdb-select').material_select('destroy');
  $('.mdb-select').material_select();
});

socket.on('selectSocket', function (data) {

  $('.mdb-select.colorful-select.dropdown-primary.sockets').material_select('destroy');

  var x = 0;
  var current2;
  var select = $('#newSocketModal').find('select.mdb-select.colorful-select.dropdown-primary.sockets');

  var select2 = $('#addDomain').find('select.mdb-select.colorful-select.dropdown-primary.sockets');

  // $('.mdb-select.colorful-select.dropdown-primary.sockets').material_select('destroy');
  if (data !== null) {

    Object.keys(data).forEach(function (key) {

      var current = select[x][0].value;


      if (select2[x]) {
        current2 = select2[x][0].value;
      }

      var i = 0;

      if (data[current]) {
        // $(select[x]).empty();
        $(select[x]).find('option:not(:first)').remove();
        data[current].forEach(function (line) {


          //    $(':input.select-dropdown')[0].value
          $(select[x]).append('<option name="' + line.name + '" id="' + line.name + '"value="' + line.id + '">' + line.name + '</option>');

        });
      }

      if (data[current2]) {

        //  $(select2[x]).empty();
        $(select2[x]).find('option:not(:first)').remove();

        data[current2].forEach(function (line) {


          //    $(':input.select-dropdown')[0].value
          $(select2[x]).append('<option name="' + line.name + '" id="' + line.name + '"value="' + line.id + '">' + line.name + '</option>');

        });
      }

      $(select[x]).append('<button class="btn-save btn btn-primary btn-sm">Save</button>');
      $(select2[x]).append('<button class="btn-save btn btn-primary btn-sm">Save</button>');
      x++;
      selectFinish(current2, data.row);
    });
  }

  function selectFinish(type, row) {

    if (x === Object.keys(data).length) {



      $(document).ready(function () {

        $('.mdb-select.colorful-select.dropdown-primary.sockets').material_select('');

        if (type && row) {

          $('#viewScheduleHtml');

          $('#row-2').find('.td-domains div').each(function (index, div) { console.log(div) })

          $('#' + row).find('.td-' + type + ' div').each(function (index, div) {

            try {

              $($('#addDomain').find('.select-dropdown li:contains("' + div.innerText.trim() + '")')[0]).trigger('click');
              

            } catch (e) {

            }

          });
          $('#addDomain').modal('toggle');
        }

      });

    }
  }
});

socket.on('socketUpdate', function (data) {

  console.log(data);

  if(!data) {
  $('#mainId').find('#testTable').DataTable().ajax.reload();
  }
  $('#addDomain').modal('hide');
});

socket.on('me', function (data) {
  if (!JSON.parse(data.msg).error) {

    clikbak.user = JSON.parse(data.msg);
    checkRegistration();
    sideNav();
    //  selectSocket(['domains', 'paths', 'postbacks']);
  } else {

    localStorage.removeItem("clikbak");
    window.location.href = "/";

  }
});

socket.on('viewScripts', function (data) {

  scriptScriptsDone(data);

});

socket.on('login', function (data) {

  if (JSON.parse(data.msg).jwt) {

    var jwt = JSON.parse(data.msg).jwt;
    var user = JSON.parse(data.msg).user;
    // Save data to sessionStorage
    localStorage.setItem('clikbak', JSON.parse(data.msg).jwt);

    if (JSON.parse(data.msg).user.registrationKey !== null) {

      var options = {
        closeButton: true,
        preventDuplicates: true,
        positionClass: 'toast-top-full-width'

      }

      alerts('error', 'Email Verification', 'You still need to verify your email before you can access application.', options)

    }
    window.location.href = '/';
  } else {

    var options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "showDuration": 500,
      "hideDuration": 1000,
      "onClose": function () {
        console.log('test');
      },
      "timeOut": 5000,
      "extendedTimeOut": 5000,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
    };

    var error = JSON.parse(data.msg);

    Command: toastr["error"](error.message, error.error, options)

  }
});