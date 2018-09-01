var socket = io('{{server}}');
var clikbakSocket = '{{serverBack}}';

socket.on('connected', function (data) {
  console.log(data);
})


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