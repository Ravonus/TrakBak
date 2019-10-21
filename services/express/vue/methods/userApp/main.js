object = {

  capFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  sendForm: (obj, url, method, type, redirect) => {

    var object = userApp[obj];

    plmApp.crud(method, url, {
      type: type,
      redirect: redirect
    }, object);

  },
  sortByKey: (array, key) => {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },
  openModal: (e, id, tableName) => {

    console.log(id);

    userApp.$forceUpdate();
    var rowNumber = (typeof e === 'number') ? e : $($(e.target).parents()[2]).index();
    if (!userApp.docs.data[tableName]) userApp.docs.data[tableName] = {};
    if (!userApp.docs.data[tableName][rowNumber]) userApp.docs.data[tableName][rowNumber] = {};
    userApp.rowNumber = rowNumber;
    $(`#${id}`).modal('show');

  },

  selectPick: (array) => {

    console.log("MY ARRAY ");
    console.log(array);

    if (typeof array === 'string') array = [array];

    array.forEach((selectpick) => {

      $(`#${selectpick}`).selectpicker();
    });

    return true;
  },

  findAllList: (id, key) => {

    var list = userApp.lists[id];

    if(list.fast) {

      userApp.crud('GET', `${userApp.lists[id].url}?or=t&sort=name&${key}=${userApp.lists[id].urlAdd}`, {
        type: 'fastList',
        name: id
      });

    } else {

      userApp.crud('GET', `${userApp.lists[id].url}?or=t&sort=name&${key}=${userApp.lists[id].urlAdd}`, {
        type: 'vueList',
        name: id
      });

    }

    userApp.lists[id]._all = true;

  },
  setFormList: (e, page, list, type) => {
    var listID = e.target.id;
    console.log(listID);

    if (type === 'string' && $(`#${listID} option:selected`)[0]) {

      userApp.docs.data[page].create[list] = $(`#${listID} option:selected`)[0].id;
    } else {

      userApp.docs.data[page].create[list] = [];
      $(`#${listID} option:selected`).each((index, el) => {
        userApp.docs.data[page].create[list].push(el.id);
      });

    }

  },
  onCheck: (e, name) => {
    console.log('asd');
    console.log(e)
  },
  toggleClass: (id) => {
    $(`#${id}`).toggleClass('flipped');
  },
  noSpecial: (str) => {
    return str.replace(/[^A-Za-z0-9]+/gi, '');
  },
  fileNameCheck: (id) => {
    if ($(`#${id}`)[0] && $(`#${id}`)[0].files && $(`#${id}`)[0].files.length > 0) {
      userApp[id] = $(`#${id}`)[0].files[0].name;
      userApp.$forceUpdate();
      return $(`#${id}`)[0].files[0].name;
    } else {
      userApp[id] = false;
    }

  },
  customcallback: () => {
    console.log('test');
  },
  forceUpdate: (time) => {
    setTimeout(function () {
      userApp;
    }, time);
  },
  vModel: (e, update, secondary) => {

    console.log("RANz");


    if (secondary) {
      e.target.name = e.target.name.split('.')[1];
      userApp.docs.data[userApp.nav.page].create[secondary][e.target.name] = e.target.value;
    } else userApp.docs.data[userApp.nav.page].create[e.target.name] = e.target.value;

    if (update)
      userApp.$forceUpdate();

  },
  
  grabValue: (value) => {
    if(document.getElementById(value))
    return document.getElementById(value).value;
    else
    return false;
  }
}