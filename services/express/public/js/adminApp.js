'use strict';

var adminApp = new Vue({
    el: '#adminApp',
    data: {
        clickMenu: [],
        clickMenuObj: {},
        me: '',
        menuObj: {},
        tempRooms: {},
        modal: false,
        side: 0,
        navigation: "dashboard",
        tickets: [],
        mgSync: {},
        alerts: [],
        navColor: 'primary',
        forgotPassword: false,
        forms: {
            sendEmail: {
                recaptcha: {
                    on: 'display:none',
                    off: ''
                }
            }
        }

    },
    watch: {},
    methods: {
        navClick: (event) => {
            let classNames = event.target.className;

            var findClass = classNames.match(/nav-select-([^\s]+)/);
            adminApp.navColor = findClass[1];

            if (adminApp.lastPage) socketLeaveRoom({
                room: adminApp.lastPage,
                action: 'leave'
            });

            var id = event.target.id !== '' ? event.target.id : $(event.target).parent()[0].id;
            var lastNav = document.getElementById(adminApp.navigation);
            lastNav.classList.remove("active");
            adminApp.lastPage = id;
            adminApp.navigation = id;
            if (adminApp.lastPage) socketJoinRoom({
                room: id,
                action: 'join'
            });
            var currentNav = document.getElementById(id);
            currentNav.classList.add("active");
            adminApp.editor = '';

            function _cb() {

                if (adminApp.ticketTable && adminApp.ticketTable.context) {
                    adminApp.ticketTable.destroy();
                }

                if ($("#ticketTable")[0]) {


                    adminApp.clickMenu = [{
                            id: "id",
                            key: "ticket",
                            name: "Open Ticket",
                            modal: "showTicket"
                        },
                        {
                            id: "id",
                            name: "Select Ticket"
                        },
                        {
                            id: "id",
                            name: "Quick Reply"
                        },
                        {
                            id: "id",
                            name: "Delete Ticket"
                        }
                    ]

                    adminApp.ticketTable = $('#ticketTable').DataTable({
                        dom: "lrtip",
                        serverSide: true,
                        processing: true,
                        responsive: true,
                        colReorder: true,
                        autoWidth: false,
                        ajax: `/api/tickets?count=t&or=t&populate=owner messages categories`,
                        columns: [{
                                "data": "_id",
                                "name": "_id",
                                "width": "20%"
                            },
                            {
                                "data": "categories.name",
                                "width": "5%",
                                "name": "categories.name",
                                render: function (data, type, row) {
                                    if (row && row.categories && Array.isArray(row.categories) && row.categories.length > 0) {
                                        return row.categories = row.categories[0].name;
                                    } else if (row && row.categories) {
                                        return row.categories = 'None';
                                    } else {
                                        return;
                                    }
                                }
                            },
                            {
                                "data": "type",
                                "name": "type",
                                "width": "15%"
                            },
                            {
                                "data": "owner.account",
                                "name": "owner.account",
                                "width": "15%"
                            },
                            {
                                "data": "updatedAt",
                                "name": "updatedAt",
                                "width": "25%"
                            },
                            {
                                "data": "owner.email",
                                "name": "owner.email",
                                "width": "15%px"
                            }
                        ],

                        fnCreatedRow: (nRow, doc) => {

                            $(nRow).attr('id', doc._id);
                        },
                    });

                    $('#mainSearch').keyup(function () {
                        adminApp.ticketTable.search($(this).val()).draw();
                    })

                    if ($('#mainSearch').val()) $('#mainSearch').keyup();

                    adminApp.ticketTable.columns.adjust();

                    var pressTimer;
                    var upMouse;

                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                        $("#ticketTable").mouseout(function (event) {

                            if (!upMouse) {
                                adminApp.openedMenu = false;
                                $("#context-menu").removeClass("show").hide();

                                clearTimeout(pressTimer);
                            } else {

                                upMouse = false;
                                clearTimeout(pressTimer);

                            }
                            // Clear timeout
                            return false;
                        }).mouseover(function (event) {

                            // Set timeout

                            if (!upMouse)
                                pressTimer = window.setTimeout(function () {

                                    upMouse = true;
                                    let id = $(event.target).parent()[0].id;

                                    adminApp.clickMenu.forEach((menu, index) => {
                                        adminApp.clickMenu[index].id = id;
                                    });

                                    adminApp.openedMenu = true;
                                    var top = event.originalEvent.pageY - 10;
                                    var left = event.originalEvent.pageX - 90;

                                    $("#context-menu").css({
                                        display: "block",
                                        top: top,
                                        left: left
                                    }).addClass("show").on("click", function () {
                                        $("#context-menu").removeClass("show").hide();
                                    });


                                }, 1000);
                            return false;
                        });

                    }


                } else {

                    setTimeout(() => {
                        _cb();
                    }, 0);

                }

            }

            if (adminApp.navigation === 'tickets') _cb()

        },
        capitalizeFirstLetter: (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        ticketTable: () => {

        },
        tablePage: (event) => {

            let page = $('.paginate_button.page-item.active').children().data("dt-idx")
            let perPage = $('.custom-select').val()

            getApi(`/api/tickets?page=${page}&perPage=${perPage}&count=true`, 'table')
        },
        handler: (event) => {

            //do stuff
            let id = $(event.target).parent()[0].id;

            adminApp.clickMenu.forEach((menu, index) => {
                adminApp.clickMenu[index].id = id;
            });
            adminApp.openedMenu = true;
            var top = event.pageY - 10;
            var left = event.pageX - 90;
            $("#context-menu").css({
                display: "block",
                top: top,
                left: left
            }).addClass("show").on("click", function () {
                $("#context-menu").removeClass("show").hide();
            });

            event.preventDefault();
        },
        checkMenu: () => {
            if (adminApp.openedMenu) {
                adminApp.openedMenu = false;
                $("#context-menu").removeClass("show").hide();

            }
        },
        clickMenuFunction: (id, key, type, modal) => {

            if (type === 'message') {
                getApi(`/api/messages?${key}=${id}&populate=sender%20messages&perPage=0`, 'menuLoad');
                socketJoinRoom({
                    room: id,
                    action: 'join'
                });
            }


            adminApp.tempRooms[modal] = {
                id
            };
            adminApp.modal = true;
            adminApp.clickMenuObj.id = id;
            adminApp.$forceUpdate();

            if (modal) {
                $(`#${modal}`).modal('show');
            }

        },
        checkActiveMember: (id) => {
            if (!adminApp.menuObj.activeMembers) adminApp.menuObj.activeMembers = {};
            if (adminApp.menuObj.activeMembers[id]) return false;
            adminApp.menuObj.activeMembers[id] = true;
            return true;
        },

        sendMsg: (event) => {
            event.preventDefault();

            if ($('#ticketTextarea').val() === '') return;

            let body = {
                sender: adminApp.mgSync.user._id
            };

            if (adminApp.navigation === 'tickets') {

                body.ticket = adminApp.clickMenuObj.id;
                body.type = "ticket";
                body.text = $('#ticketTextarea').val();
            }

            body.socketInfo = {
                id: socket.id,
                script: 'socketPush',
                object: 'ticket'
            }

            postApi('/api/messages?populate=sender&perPage=0&excludes=-messages -groups -permissions', body, {
                'account': adminApp.mgSync.user,
                body: body
            });

        },
        checkAuth() {
            console.log('ran');
        },
        hideSide() {

            if (adminApp.side === 0) {

                $(".sidebar-fixed").css('display', 'none');
                $(".navbar, .page-footer, main").css('padding-left', '0px');

                adminApp.side = 1;

            } else {

                $(".sidebar-fixed").css('display', 'initial');
                $(".navbar, .page-footer, main").css('padding-left', '235px');

                adminApp.side = 0;

            }

        },
        ObjectId: (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
            s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

    },
    mounted: function () {
        this.$nextTick(function () {
            getApi('/api/me', 'me');
        })
    },

    end: {

    }
})