var plmApp = {

  checkFullPageBackgroundImage: function () {
    $page = $('.full-page');
    image_src = $page.data('image');

    if (image_src !== undefined) {
      image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
      $page.append(image_container);
    }
  },

  crud(type, url, options, data) {

    if (typeof options === 'string') options = {
      [options]: true
    };

    if (options.form) data = `#${data}`.serialize();

    if (type.toLowerCase() === 'post') data = JSON.stringify(data);

    $.ajax({
      type,
      url,
      data,
      contentType: 'application/json',
      beforeSend: function (x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/j-son;charset=UTF-8");
        }
      },
      success: function (data) {

        data = JSON.parse(data);
        if (options && options.type === 'login' || options && options.type === 'registration') {
          plmApp.setCookie('jwt', data.token, 1);
          if (options.redirect) window.location.replace(options.redirect);
        }

        if (options && options.type === 'me') {

     

          let navigations = data.navigations ? data.navigations : [];

          userApp.test = navigations;

          delete data.navigations;

          data.permissions = userApp.permArray(data.permissions);

          data.groups.forEach((group, index) => {

            data.permissions = Object.assign(data.permissions, userApp.permArray(group.permissions));
            if (!group.navigations || group.navigations === undefined) group.navigations = [];
   
            navigations = [...navigations, ...group.navigations];
            delete data.groups[index].navigations;

          });

          navigations = navigations.filter((navigation, index, self) =>
            index === self.findIndex((t) => (
              t._id === navigation._id
            ))
          );
 
          navigations.forEach(nav => {

            if (nav.type === 0) userApp.nav.links.push(nav);
            if (nav.type === 1) {
              userApp.nav.sub[nav._id] = nav;
            }

          });

          userApp.nav.links = userApp.sortByKey(userApp.nav.links, 'order');
          //      userApp.nav.links = navigations;
          let tmp = {};
          data.groups.forEach( doc => tmp[doc.name] = doc);
          data.groups = tmp;
          
          userApp.user = data;
          userApp.userCheck = JSON.parse(JSON.stringify(data));
          userApp.checkObj('user', 'userCheck', 'saveProfileButton');
          if (options.redirect) window.location.replace(options.redirect);

        }

      },
      error: function (err) {

      }
    });

  },
  setCookie(cname, cvalue, exdays) {

    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    // console.log(cname,cvalue,expires)
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    var end;
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
      end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  },
  navAlert(type, msg, options) {

    if (options) {
      toastr.options = options;
    }

    if (msg) {
      toastr[type](msg.text, msg.title);
    } else {
      toastr.error(type, 'Datatable error');
    }

  },
  waitForEl(selector, callback) {

    if (jQuery(selector).length) {
      callback();
    } else {
      setTimeout(function () {
        plmApp.waitForEl(selector, callback);
      }, 100);
    }
  }

};

$("#userLogin").submit(function (e) {

  var id = e.target.id;
  e.preventDefault();

  var paramObj = {};
  $.each($(`#${id}`).serializeArray(), function (_, kv) {
    paramObj[kv.name] = kv.value;
  });

  plmApp.crud('POST', userApp.formUrls[id].url, {
    type: userApp.formUrls[id].type,
    redirect: userApp.formUrls[id].redirect
  }, paramObj);

});

function playFile() {

  $(".player").not(this).each(function () {
      $(this).get(0).pause();
  });
  //this[$(this).get(0).paused ? "play" : "pause"]();
}

$(window).on('load', function () {

  $('.player').on("click", function() {
    playFile.call(this);
});

  var myCookie = plmApp.getCookie("jwt");

  if (myCookie) {
    plmApp.crud('GET', '/api/me', {
      type: 'me'
    });
  }
});


$(window).on('popstate', function() {//when back is clicked popstate event executes
  var arr = history.state.split('/');

  console.log(arr);

  if(arr[0] === 'watch' && arr.length === 1) {
    console.log("RAN")
    userApp.singleObj = false;
    userApp.vueCustom = userApp.backupArr;
 
  } else if(arr[0] === 'watch' && arr[1]) {

    userApp.vueCustom.forEach( (obj) => {
      if(obj.name === arr[1]) {
        userApp.singleObj = true;
        userApp.vueCustom = [obj];
      }
    });

  }
  });


  $('.myVideosComments').on('hidden.bs.collapse', function () {
    console.log("RAN");
  })