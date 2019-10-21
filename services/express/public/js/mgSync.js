//import { setTimeout } from "timers";

let cpu = []
let memory = []

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
};

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

function truncateText(text, maxLength) {
 

    if (text.length > maxLength) {
        text = text.substr(0, maxLength) + '...';
    }
    return text;
}

function recaptchaCallback() {
 
    userApp.forms.sendEmail.recaptcha.off = 'display:none';
    userApp.forms.sendEmail.recaptcha.on = '';
   
}

function recaptchaCallbackDisconnect() {
  
    userApp.forms.sendEmail.recaptcha.off = '';
    userApp.forms.sendEmail.recaptcha.on = 'display:none';
}


function socketInterpreter(data) {

    if(data.options.vue) {

        if(adminApp.navigation === 'tickets') {
            adminApp.ticketTable.ajax.reload( null, false )
        }

        if(adminApp.menuObj && Array.isArray(adminApp.menuObj)) adminApp.menuObj.push(data.doc);
        adminApp.$forceUpdate();

        if(data.socket.id === socket.id) {
            $('#ticketTextarea').val('');
         //   $('.chat-message .ffscrollbar-c1').animate({scrollTop:$('.chat-message .ffscrollbar-c1')[0].scrollHeight}, 'slow');
        }

        $('.chat-message .ffscrollbar-c1').animate({scrollTop:$('.chat-message .ffscrollbar-c1')[0].scrollHeight}, 'slow');

    }
}

$(document).ready(function () {

    $(".modal").on("hidden.bs.modal", function () {
        
        if(adminApp && adminApp.tempRooms && adminApp.tempRooms[this.id]) {
            adminApp.menuObj.activeMembers = [];
            adminApp.modal = false;
            socketLeaveRoom({room:adminApp.tempRooms[this.id].id, action:'leave'});
            delete adminApp.tempRooms[this.id];
        }
    });

    window.recaptchaCallback = recaptchaCallback;
    window.recaptchaCallbackDisconnect = recaptchaCallbackDisconnect;

    $('.p-overflow').each(function (index, text) {
        text.innerText = truncateText(text.innerText, 300);
    });


    if (location.valueOf().search.includes('?rp=')) {
        var jwt = location.valueOf().search.substring(4);

        postApi('/auth/forgotPW', {
            jwt: jwt
        }, "rp")

    }

    if (location.valueOf().search === '?login=true') {
        $('#userModal').modal('show');
    }

    if (location.valueOf().search.includes('?verify=')) {

        var urlValues = location.valueOf().search.split('=');
        var jwt = urlValues[1].split('&')[0];
        var lookup = urlValues[2];

        getApi('/auth/verify/' + jwt + '?lookup=' + lookup, 'verify');

    };

    if (getCookie('jwt')) {
        getApi('/api/me', 'me');
    }

    (($) => {

        class Toggle {

            constructor(element, options) {

                this.defaults = {
                    icon: 'fa-eye'
                };

                this.options = this.assignOptions(options);

                this.$element = element;
                this.$button = $(`<button class="btn-toggle-pass" type="button" ><i class="fa ${this.options.icon}"></i></button>`);

                this.init();
            };

            assignOptions(options) {

                return $.extend({}, this.defaults, options);
            }

            init() {

                this._appendButton();
                this.bindEvents();
            }

            _appendButton() {
                this.$element.after(this.$button);
            }

            bindEvents() {

                this.$button.on('click touchstart', this.handleClick.bind(this));
            }

            handleClick() {

                let type = this.$element.attr('type');

                type = type === 'password' ? 'text' : 'password';

                this.$element.attr('type', type);
                this.$button.toggleClass('active');
            }
        }

        $.fn.togglePassword = function (options) {
            return this.each(function () {
                new Toggle($(this), options);
            });
        }

    })(jQuery);

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover({html:true})
        $('.viewPassword').togglePassword();
    })

    $('#areYouSure').on('hidden.bs.modal', function () {
        app.firstAsk = true;
    });

    var url = new URL(window.location.href);
    var search = url.searchParams.get("status");

    if (search === 'finished') {
        $($('button')[0]).html('<div class="loader justify-content-center"></div>')
        setTimeout(function () {
            window.location = "/";
        }, 10000);
    }

    $("#userLogin").submit(function (e) {
        e.preventDefault();


        var paramObj = {};
        $.each($('#userLogin').serializeArray(), function (_, kv) {
            paramObj[kv.name] = kv.value;
        });
        

        postApi('/auth/login', paramObj, 'login');
    });


})

$("#aPassword").password({
    eyeClass: "fa",
    eyeOpenClass: "fa-eye",
    eyeCloseClass: "fa-eye-slash",
    message: "keep your password security"
});


function setCookie(cname, cvalue, exdays) {
   
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function navAlert(type, msg, options) {
    if (options) {
        toastr.options = options;
    }

    if(msg) {
        toastr[type](msg.text, msg.title);
    } else {
        toastr['error'](type, 'Datatable error');
    }
    
}






