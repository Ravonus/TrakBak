object = {
  crud(type, url, options, data) {

    var globalOptions = options;

    let jsonCheck = false;

    try {

      JSON.parse(data);
      jsonCheck = true;

    } catch (e) {
      jsonCheck = false;
    }


    function ajax(type, url, options, data) {

      $.ajax({
        type,
        url,
        data,
        processData: options.processData ? false : undefined,
        contentType: options.contentType ? options.contentType : options.contentType === false ? false : 'application/json',
        beforeSend: function (x) {
          if (x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
          }
        },
        success: function (data) {

          let options = globalOptions;

          if (runFunc && runFunc === 'me') {
            plmApp.crud('GET', '/api/me', {
              type: 'me'
            });
          }

          data = JSON.parse(data);

          if (options.files && options.files.length > 0) {

            options.files.forEach((file, index) => {
              let id = file.id;
              let el = $(`#${id}`)[0];
              let doc = el.getAttribute("data-doc");
              let column = el.getAttribute("data-column");
              userApp.fileUpload(options.files[index], JSON.stringify({
                [doc]: data._id,
                target: column
              }), {
                method: "POST",
                action: "files/upload"
              });
            });

          }

          if (!options) options = {};

          userApp.crudScripts.vueCustom(options, data);

          if (options.type === 'vueObject') {
            userApp[options.name] = data;
          }

          if (options.type === 'videoDelete') {
            let index = $($(options.event.target).parents()[2]).index();
            userApp.vueCustom[index] = undefined;
            userApp.vueCustom = userApp.vueCustom.filter(function (element) {
              return element !== undefined;
            });
            $(options.event.target).parents()[1].classList.remove("flipped");
          }

          if (options.type === 'vueList') {

            let selected = [];

            $($(`#${options.name}`).selectpicker().parents()[0]).find('.dropdown-menu .show li.selected .text').each((index, li) => {

              selected.push({
                name: $(li).text()
              });
            });

            userApp.lists[options.name].data = selected.length > 0 ? [...selected, ...data] : data;
            userApp.$forceUpdate();
            Vue.nextTick(function () {
              $(`#${options.name}`).selectpicker("refresh");
            });

          }

          if (options.type === 'fastList') {

            var el = $('#' + options.name);
            var oldValues = [];

            $.each(el[0].options, function (index, option) {
              oldValues.push(option.value);
            });

            data.forEach(function (item) {

              if (!oldValues.includes(item._id)) {
                el.append($("<option></option>")
                  .attr("value", item._id)
                  .text(item.name));
              }

            });

            el.selectpicker('refresh');

          }

          if (options.type === 'docCreate') {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: `${options.name.capitalize().plural(true)} has been created.`,
              showConfirmButton: false,
              timer: 1500
            });

            if (options.modal) $(`#${options.modal}`).modal('hide');

            userApp.docs.data[options.name].form = {

            };
            userApp.tables[options.name].draw();

            let vueForm = userApp.docs.data[userApp.nav.page].create;

            Object.keys(vueForm).forEach((key) => {

              if (typeof vueForm[key] === 'object' && !Array.isArray(vueForm[key])) {
                vueForm[key] = {};
              } else {
                delete vueForm[key];
              }

            });

            $(`#${options.name}Create select`).each((index, value) => {

              $(`#${value.id}`).selectpicker('val', '');

            });

            $(`#${options.name}Create input`).each((index, value) => {

              value.value = '';

            });

          }

          if (options.type === 'docUpdate') {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: `${options.name.capitalize().plural(true)} has been updated.`,
              showConfirmButton: false,
              timer: 1500
            });

            if (options.modal) $(`#${options.modal}`).modal('hide');
            userApp.docs.data[options.name].form = {

            };
            userApp.tables[options.name].draw();

          }

          if (options.type === 'objDelete') {
            Swal.fire({
              title: 'Deleted!',
              text: 'The item has been deleted.',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false
            });

            userApp.tables[options.name].draw();

          }

          if (options.type === 'vueWrite') {

            userApp[options.vueObject ? options.vueObject : 'mainTable'] = data;

          }

          if (options && options.type === 'login') {
            plmApp.setCookie('jwt', data.token, 1);
            //    if (options.redirect) window.location.replace(options.redirect);
          }

          if (options && options.type === 'me') {

            let navigations = data.navigations;
            delete data.navigations;

            data.groups.forEach((group, index) => {
              navigations = [...navigations, ...group.navigations];
              delete data.groups[index].navigations;

            });

            navigations = navigations.filter((navigation, index, self) =>
              index === self.findIndex((t) => (
                t._id === navigation._id
              ))
            );

            userApp.nav.links = navigations;
            userApp.user = data;
            userApp.userCheck = JSON.parse(JSON.stringify(data));
            userApp.checkObj('user', 'userCheck', 'saveProfileButton');

            if (options.redirect) window.location.replace(options.redirect);

          }

        },
        error: function (err) {

        }
      });

    }

    let runFunc = false;

    if (options.formData) {
      var form = new FormData();
      jQuery.each(data, function (i, file) {
        form.append('file-' + i, file);
        if (i === data.length - 1) {
          if (options.objects) {
            form.append('objects', options.objects);
          }
          ajax(type, url, options, form);
        }
      });

    }

    if (!jsonCheck && data && typeof data === 'string' && data.includes(':')) {
      var splitArr = data.split(':');
      runFunc = splitArr[1];
      data = splitArr[0];
    }

    if (typeof options === 'string') options = {
      [options]: true
    };

    if (options && options.form) data = $(`#${data}`).serializeArray();

    let dataObj = {};
    if (data && typeof data === 'object' && Array.isArray(data))
      data.forEach((obj, index) => {


        dataObj[obj.name] = obj.value;

        if (index === data.length - 1) {
          data = dataObj;

          if (type.toLowerCase() === 'post' || type.toLowerCase() === 'put') data = JSON.stringify(data);

          ajax(type, url, options, data);

        }

      });

    else if (typeof data === 'string') {
      ajax(type, url, options, data);
    }

    if (type.toLowerCase() === 'get' || type.toLowerCase() === 'delete') ajax(type, url, options);

  }
}