

function messenger(msgPayload, options) {

  var toastrOptions = {

    "closeButton": true, // true/false
    "debug": false, // true/false
    "newestOnTop": false, // true/false
    "progressBar": false, // true/false
    "positionClass": "toast-top-right", // toast-top-right / toast-top-left / toast-bottom-right / toast-bottom-left
    "preventDuplicates": false,    // true/false
    "onclick": null,
    "showDuration": "300", // in milliseconds
    "hideDuration": "1000", // in milliseconds
    "timeOut": "5000", // in milliseconds
    "extendedTimeOut": "1000", // in milliseconds
  }

  if(options) {
    toastrOptions = Object.assign(toastrOptions, options);
  }

  console.log(msgPayload);
  console.log(toastr);
  toastr[msgPayload.flag](msgPayload.message);

}

