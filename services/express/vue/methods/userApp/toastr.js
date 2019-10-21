object = {
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
}