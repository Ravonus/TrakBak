objects = {
  createDoc: (name, e) => {

    event.preventDefault();

    let files = [];

    let content = $(e.target).parents()[2];

    let uploads = $(content).find('.custom-file-input');
    uploads.each( (index, el) => {
      let id = el.id;
      let uploadedFiles = $(`#${id}`)[0].files;
      uploadedFiles.id = id;
      files.push($(`#${id}`)[0].files);

    });

    var url = userApp.tables[name].context[0].ajax.url.split('?')[0];

    if (userApp.docs.data[name].create.persons && Object.keys(userApp.docs.data[name].create.persons).length === 0) delete userApp.docs.data[name].create.persons;
    if (userApp.docs.data[name].create.groups && userApp.docs.data[name].create.groups.length === 0) delete userApp.docs.data[name].create.groups;
    if (userApp.docs.data[name].create.navigations && userApp.docs.data[name].create.navigations.length === 0) delete userApp.docs.data[name].create.navigations;
    if (userApp.docs.data[name].create.users && userApp.docs.data[name].create.users.length === 0) delete userApp.docs.data[name].create.users;
    if (userApp.docs.data[name].create.videos && userApp.docs.data[name].create.videos.length === 0) delete userApp.docs.data[name].create.videos;
    userApp.crud('POST', url, {
      files,
      type: 'docCreate',
      name,
      modal: `create${userApp.capFirstLetter(name)}`
    }, JSON.stringify(userApp.docs.data[name].create));


  },
  saveDoc: (name, rowNumber, where) => {

    let dataTable = JSON.stringify({
      sid: socket.id,
      col: '_all',
      row: rowNumber,
      dataTableName: name
    });

    var url = userApp.tables[name].context[0].ajax.url.split('?')[0];

    if (userApp.docs.data[name].form && where) {
      userApp.crud('PUT', `${url}?where={"_id":"${where}"}&dataTable=${dataTable}`, {
        type: 'docUpdate',
        name,
        modal: `show${userApp.capFirstLetter(name)}`
      }, JSON.stringify(userApp.docs.data[name].form));

      userApp.tables[name].data(userApp.docs[name]);
      userApp.tables[name].draw();

    }

  },
  docsInput: (e, rowNumber, name, tableName) => {
    var value = e.target.value;
    userApp.docs.data[tableName][rowNumber].saveTrue = true;
    if (!userApp.docs.data[tableName].form) userApp.docs.data[tableName].form = {};
    userApp.docs.data[tableName].form[name] = value;
    userApp.$forceUpdate();

  }
}