var socket = io('10.0.0.85:3002');
var trakbakSocket = '10.0.0.85:3002';
var trakbak = {};

socket.on('connected', function (data) {
  console.log('dawgs n shit on connects.');
});

socket.on('me', function (data) {
  if (!JSON.parse(data.msg).error) {

    trakbak.user = JSON.parse(data.msg);
    checkRegistration();
    sideNav();
    //  selectSocket(['domains', 'paths', 'postbacks']);
  } else {

    localStorage.removeItem("trakbak");
    window.location.href = "/";

  }
});

//Don't edit after this line. Edit inside of clients folder.//

function login() {

  socket.emit('login', {
    url: window.location.href,
    form: [loginApp.login,loginApp.password]
  });

};

socket.on('login', function (data) {

  console.log(data)

  var user = data.user;
 
  if (user && user.jwt) {

    setCookie('jwt', user.jwt, 30)
    var jwt = user.jwt;
    // Save data to sessionStorage
    localStorage.setItem('trakbak', JSON.stringify( {user: data.user}));

    window.location.href = '/';
  } else {

    console.log(data)

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

      },
      "timeOut": 5000,
      "extendedTimeOut": 5000,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
    };

  }
});function GroupsRead(data) {
      console.log(data)
    socket.emit('GroupsRead', 
      {data:data}
    );
  
    };
   socket.on('GroupsRead', function (data) {console.log(data)})
   function GroupsRead(data) {
      console.log(data)
    socket.emit('GroupsRead', 
      {data:data}
    );
  
    };
   socket.on('GroupsRead', function (data) {console.log(data)})
   