object = {
  handler: (event) => {

    if(userApp.clickMenuOptions.disabled) return;
    userApp.clickMenuOptions.noTop = false;
    userApp.checkMenu();
    let id = $(event.target).parent()[0].id;
    console.log(id);
    var tX = 215;
    var lX = 125;

    if ($('body')[0].clientWidth < 975) {
      lX -= 95;
    }

    if ($('body')[0].className !== 'sidebar-mini' && $('body')[0].clientWidth > 975) {
      lX += 175;
    }

    

    if (id && id !== 'mainDataTable_wrapper' && id !== 'tableCard' && id !== 'mainDataTable_paginate' && id !== 'mainDataTable_length') userApp.clickMenu.forEach((menu, index) => {

      var permArray = userApp.permArray(menu.permissions);
      var foundPerm = false;
      var newPermArray = JSON.parse(JSON.stringify(userApp.clickMenu));
      if (permArray && permArray !== 'Public')
        Object.keys(permArray).forEach((perm, index2) => {
          if (userApp.user.permissions[perm]) {

            foundPerm = true;
          }

          if (Object.keys(permArray).length - 1 === index2 && !foundPerm) {
            delete newPermArray[index];

          }

        });

      if (menu.groups && !foundPerm) {

        Object.keys(userApp.user.groups).forEach((key, index2) => {

          menu.groups.find((name) => {

            if (name.toLowerCase() === key.toLowerCase()) {

              foundPerm = true;
            }
          });

          if (userApp.user.groups.length - 1 === index2 && !foundPerm) {
            delete userApp.clickMenu[index];

            userApp.clickMenu = userApp.clickMenu.filter(Boolean);

          }

        });
      }

      if (userApp.clickMenu.length - 1 === index && newPermArray) {
        userApp.clickMenu = [...new Set(newPermArray)];

      }

      userApp.clickMenu = userApp.clickMenu.filter(Boolean);

      if (userApp.clickMenu[index])
        userApp.clickMenu[index].id = id;
    });
    else

      userApp.clickMenu.forEach((menu, index) => {

        userApp.clickMenuOptions.noTop = true;

      });

    userApp.openedMenu = true;
    var top = event.pageY;
    var left = event.pageX;
    $("#context-menu").css({
      display: "block",
      top: top - tX,
      left: left - lX
    }).addClass("show").on("click", function () {
      $("#context-menu").removeClass("show").hide();
    });

    event.preventDefault();
  },
  checkMenu: () => {
    if (userApp.openedMenu) {
      userApp.openedMenu = false;
      $("#context-menu").removeClass("show").hide();
    }
  },
  clickMenuFunction: (id, key, type, modal) => {

    console.log(id, key, type, modal)


    if(id === 'createVideos' || modal && modal.name === 'createVideos') $(`#selectVideo`).selectpicker();


    if (type === 'message') {
      getApi(`/api/messages?${key}=${id}&populate=sender%20messages&perPage=0`, 'menuLoad');
      socketJoinRoom({
        room: id,
        action: 'join'
      });
    }

    userApp.tempRooms[modal] = {
      id
    };
    userApp.modal = true;
    userApp.clickMenuObj.id = id;
    userApp.$forceUpdate();
    if (modal && type !== 'delete') userApp.openModal($(`#${id}`).index(), modal.name, key);
    if (type === 'delete') userApp.showSwal(id, modal.type, modal.name);

  }
}