'use strict';

//import { setTimeout } from "timers";

let cpu = []
let memory = []

function graphDump(dump) {
    cpu = [];
    memory = [];
    app.dspCpu = [];
    app.dspMemory = [];
    let object = JSON.parse(dump);

    Object.keys(object).forEach(function (stat, index) {
        let cpuStat, memoryStat;
        if (object[stat].averageCpu) {
            cpuStat = object[stat].averageCpu;
            cpu.push(object[stat].timestamp + ',' + cpuStat + ',');
        }

        if (object[stat].cpu) {

            cpuStat = object[stat].cpu;
            cpu.push(object[stat].timestamp + ',' + cpuStat + ',');

        }

        if (object[stat].memory) {

            memoryStat = object[stat].memory;
            memory.push(object[stat].timestamp + ',' + memoryStat + ',');

        }


        if (object[stat].averageMemory) {

            memoryStat = object[stat].averageMemory;
            memory.push(object[stat].timestamp + ',' + memoryStat + ',');

        }

        //  memory.push(object[stat].timestamp + ',' + memoryStat);
        if (index === Object.keys(object).length - 1) {
            app.dspCpu = cpu;
            app.dspMemory = memory;
            loadDspGraphs()

        }
    });

}
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
};

function loadDspGraphs() {
    if ($('.plot-container.plotly')[0]) {
        Plotly.purge($('#dspStats')[0]);
    }


    var selectorOptions = {
        buttons: [{
            step: 'minute',
            stepmode: 'todate',
            count: 1,
            label: '1m'
        }, {
            step: 'minute',
            stepmode: 'todate',
            count: 15,
            label: '15m'
        },
        {
            step: 'minute',
            stepmode: 'todate',
            count: 30,
            label: '30m'
        },
        {
            step: 'hour',
            stepmode: 'todate',
            count: 1,
            label: '1h'
        }, {
            step: 'hour',
            stepmode: 'todate',
            count: 12,
            label: '12h'
        }, {
            step: 'day',
            stepmode: 'todate',
            count: 1,
            label: '1d'
        }, {
            step: 'week',
            stepmode: 'todate',
            count: 1,
            label: '1w'
        }, {
            step: 'week',
            stepmode: 'todate',
            count: 4,
            label: '4w'
        }, {
            step: 'all',
        }],
    };

    var data = [prepData(app.dspCpu)[0], prepData2(app.dspMemory)[0]];
    var layout = {
        title: 'DPS Executables CPU and Memory Usage.',
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            title: 'CPU Usage'
        },
        yaxis2: {
            autorange: 'reversed',
            showgrid: false,
            title: 'Memory Usage',
            titlefont: { color: 'rgb(148, 103, 189)' },
            line: { color: 'rgb(55, 128, 191)' },
            overlaying: 'y',
            side: 'right'
        }
    };

    Plotly.plot($('#dspStats')[0], data, layout, { responsive: true });


    function prepData(rawData) {
        var x = [];
        var y = [];

        rawData.forEach(function (datum, i) {
            let xy = datum.split(',');
            let dx = xy[0];
            let dy = xy[1];

            if (dx && dy) {
                x.push(new Date(Number(dx)));
                y.push(dy);
            }
        });

        return [{
            type: 'scatter',
            x: x,
            y: y
        }];
    }

    function prepData2(rawData) {
        var x = [];
        var y = [];

        rawData.forEach(function (datum, i) {
            let xy = datum.split(',');
            let dx = xy[0];
            let dy = xy[1];
            if (dx && dy) {
                x.push(new Date(Number(dx)));
                y.push(bytesToSize(dy));
            }
        });

        return [{
            type: 'scatter',
            yaxis: 'y2',
            x: x,
            y: y
        }];
    }

}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
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


$(document).ready(function () {

    if (location.valueOf().search.includes('?rp=')) {
        var jwt = location.valueOf().search.substring(4);
        console.log(jwt);
        postApi('/auth/forgotPW', {jwt:jwt}, "rp")
        
    }

    if (location.valueOf().search === '?login=true') {
        $('#userModal').modal('show');
    }

    if (location.valueOf().search.includes('?verify=')) {

        var urlValues = location.valueOf().search.split('=');
        var jwt = urlValues[1].split('&')[0];
        var lookup = urlValues[2];
        
        getApi('/auth/verify/'+jwt+'?lookup='+lookup, 'verify');

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
        $('.viewPassword').togglePassword();
    })

    $('#areYouSure').on('hidden.bs.modal', function () {
        app.firstAsk = true;
    });

    var url = new URL(window.location.href);
    var search = url.searchParams.get("status");

    if (search === 'finished') {
        $($('button')[0]).html('<div class="loader justify-content-center"></div>')
        setTimeout(function () { window.location = "/"; }, 10000);
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



// function createAdmin(e) {

// var formData = JSON.stringify($("#createAdmin").serializeArray());

// $.ajax({
//     type: "POST",
//     url: "/createAdmin",
//     data: formData,
//     success: function(){},
//     dataType: "json",
//     contentType : "application/json"
//   });

// }

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

    toastr[type](msg.text, msg.title);
}





