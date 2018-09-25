var socket = io('https://www.trakbak.tk:5001');
var trakbakSocket = 'https://www.trakbak.tk:5001';

function login() {

  socket.emit('login', {
    url: window.location.href,
    form: [loginApp.login,loginApp.password]
  });

}

socket.on('connected', function (data) {
  console.log('dawgs n shit on connect.');
})


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

socket.on('login', function (data) {

  var user = data.user;
  console.log(user.jwt);

  if (user.jwt) {

    console.log(user.jwt);
    
    setCookie('jwt', user.jwt, 30)
    var jwt = user.jwt;
    // Save data to sessionStorage
    localStorage.setItem('trakbak', jwt);

    // if (user.registrationKey !== null) {

    //   var options = {
    //     closeButton: true,
    //     preventDuplicates: true,
    //     positionClass: 'toast-top-full-width'

    //   }

    //   alerts('error', 'Email Verification', 'You still need to verify your email before you can access application.', options)

    // }
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

      },
      "timeOut": 5000,
      "extendedTimeOut": 5000,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
    };

   // var error = JSON.parse(data.msg);

   // Command: toastr["error"](error.message, error.error, options)

  }
});

