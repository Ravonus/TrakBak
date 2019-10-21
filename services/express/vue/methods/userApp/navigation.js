object = {

  navClick: (e, pID, layer) => {

    if (userApp.singleObj)
      userApp.singleObj = false;

    if (userApp.noCrud)
      userApp.noCrud = false;

    var lastParent = document.getElementById(userApp.nav.lastPage);
    var page = e.target.getAttribute('name');
    var parent = document.getElementById(pID);
    var children;

    if (!layer) window.history.pushState(page, page, '/' + page);

    children = lastParent ? Array.from(lastParent.children) : [];

    if ($.fn.DataTable.isDataTable('#mainDataTable')) {

      if (userApp.tables[page] && userApp.tables[page].MakeCellsEditable) {

        console.log("PAGE " + userApp.tables[page])

        userApp.tables[page].MakeCellsEditable("destroy");

      } else if (userApp.tables[userApp.nav.lastPageName] && userApp.tables[userApp.nav.lastPageName].MakeCellsEditable) {

        userApp.tables[userApp.nav.lastPageName].MakeCellsEditable("destroy");

      }

      $('#mainDataTable').DataTable().destroy();
      $('#mainDataTableBody').empty();

      delete userApp.tables[page];

    }

    userApp.nav.page = page;

    userApp.socketJoinRoom({
      room: page,
      leaveLastRoom: true,
      action: 'join'
    });

    let pageSetup = userApp.nav.pageSetup[page] ? userApp.nav.pageSetup[page] : 'genericModal';

    if (pageSetup.categories || pageSetup.watch) {
      userApp.vueCustom = [];
      pageSetup.vueSetup();
    }

    if (pageSetup.lists) pageSetup.lists.forEach((list) => {

      let urlAdd = list.urlAdd ? list.urlAdd : '';

      let url = pageSetup.prefix ? `/${pageSetup.prefix}/${list.name}` : `/${list.name}`;
      console.log('MY URL', url)
      let key = list.keys[0];
      let name = `${list.name.toLowerCase()}List`;
      Vue.nextTick(function () {

        $(`#${name}`).selectpicker();

      });

      userApp.lists[name] = {
        url,
        key,
        urlAdd
      };

      //    userApp.crud('GET', url, {type:'vueList'});

    });

    userApp.checkMenu();
    userApp.clickMenu = [{
        id: "id",
        key: page,
        name: `Open ${page}`,
        groups: ["mods", "administrators", "members"],
        modal: pageSetup
      },
      {
        id: "id",
        name: `Select ${page}`,
        permissions: 1
      },
      {
        id: "id",
        type: "delete",
        name: `Delete ${page}`,
        permissions: 1,
        groups: ["mods", "administrator"],
        swal: {
          type: 'areYouSure',
          name: page
        }
      },
      {
        id: "id",
        divider: true,
        obj: page,
        groups: ["mods", "administrators"],
        name: `Create ${page}`,
        modal: {
          name: `create${userApp.capFirstLetter(page)}`
        }
      }
    ];



    userApp.nav.switch(page);

    if (children.length > 0)
      children.forEach((child) => {
        let activeSub = child.getElementsByClassName(`active`)[0];
        if (activeSub) activeSub.classList.remove('active');
      });

    var subMenu = document.getElementsByClassName(`${page}Sub`);

    if (subMenu[0])
      setTimeout(function () {
        subMenu[0].classList.add("active");
      }, 300);

    if (lastParent) lastParent.classList.remove("active");
    parent.classList.add("active");
    userApp.nav.lastPage = pID;
    userApp.nav.lastPageName = page;

    Vue.nextTick(function () {
      Vue.nextTick(function () {

        $('.bootstrap-switch').each(function () {
          let $this = $(this);
          userApp.docs.data[userApp.nav.page].create[$this[0].name] = $this[0].checked;

          let data_on_label = $this.data('on-label') || '';
          let data_off_label = $this.data('off-label') || '';
          if (!$this[0].className.includes("bootstrap-switch-wrapper"))
            $this.bootstrapSwitch({
              onText: data_on_label,
              offText: data_off_label
            });
        });
        $('.bootstrap-switch-wrapper').on('switchChange.bootstrapSwitch', function (e, state) {
          userApp.docs.data[userApp.nav.page].create[e.target.name] = state;

        });

      });

    });


  },
  checkObj: (obj, name, vue) => {

    if (JSON.stringify(userApp[obj]) !== JSON.stringify(userApp[name])) {
      userApp[vue] = true;

    } else {
      userApp[vue] = false;
    }

  }

}