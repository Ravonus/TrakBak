var socket = io("http://64.37.22.151:1338");
  let apiPostCategories = (data) => {
    socket.emit('apiPostCategories', data);

  }
  let apiGetCategories = (data) => {
    socket.emit('apiGetCategories', data);

  }
  let apiPutCategories = (data) => {
    socket.emit('apiPutCategories', data);

  }
  let apiPostComments = (data) => {
    socket.emit('apiPostComments', data);

  }
  let apiGetComments = (data) => {
    socket.emit('apiGetComments', data);

  }
  let apiPutComments = (data) => {
    socket.emit('apiPutComments', data);

  }
  let apiPostCounts = (data) => {
    socket.emit('apiPostCounts', data);

  }
  let apiGetCounts = (data) => {
    socket.emit('apiGetCounts', data);

  }
  let apiPutCounts = (data) => {
    socket.emit('apiPutCounts', data);

  }
  let apiDeleteCounts = (data) => {
    socket.emit('apiDeleteCounts', data);

  }
  let filesPostFiles = (data) => {
    socket.emit('filesPostFiles', data);

  }
  let filesGetFiles = (data) => {
    socket.emit('filesGetFiles', data);

  }
  let filesPutFiles = (data) => {
    socket.emit('filesPutFiles', data);

  }
  let apiPostGroups = (data) => {
    socket.emit('apiPostGroups', data);

  }
  let apiGetGroups = (data) => {
    socket.emit('apiGetGroups', data);

  }
  let apiPutGroups = (data) => {
    socket.emit('apiPutGroups', data);

  }
  let apiDeleteGroups = (data) => {
    socket.emit('apiDeleteGroups', data);

  }
  let apiPostMessages = (data) => {
    socket.emit('apiPostMessages', data);

  }
  let apiGetMessages = (data) => {
    socket.emit('apiGetMessages', data);

  }
  let apiPutMessages = (data) => {
    socket.emit('apiPutMessages', data);

  }
  let apiDeleteMessages = (data) => {
    socket.emit('apiDeleteMessages', data);

  }
  let apiPostNavigations = (data) => {
    socket.emit('apiPostNavigations', data);

  }
  let apiGetNavigations = (data) => {
    socket.emit('apiGetNavigations', data);

  }
  let apiPutNavigations = (data) => {
    socket.emit('apiPutNavigations', data);

  }
  let apiDeleteNavigations = (data) => {
    socket.emit('apiDeleteNavigations', data);

  }
  let apiPostNotifications = (data) => {
    socket.emit('apiPostNotifications', data);

  }
  let apiGetNotifications = (data) => {
    socket.emit('apiGetNotifications', data);

  }
  let apiPutNotifications = (data) => {
    socket.emit('apiPutNotifications', data);

  }
  let apiDeleteNotifications = (data) => {
    socket.emit('apiDeleteNotifications', data);

  }
  let apiPostPermissions = (data) => {
    socket.emit('apiPostPermissions', data);

  }
  let apiGetPermissions = (data) => {
    socket.emit('apiGetPermissions', data);

  }
  let apiPutPermissions = (data) => {
    socket.emit('apiPutPermissions', data);

  }
  let apiPostPosts = (data) => {
    socket.emit('apiPostPosts', data);

  }
  let apiGetPosts = (data) => {
    socket.emit('apiGetPosts', data);

  }
  let apiPutPosts = (data) => {
    socket.emit('apiPutPosts', data);

  }
  let apiPostReplies = (data) => {
    socket.emit('apiPostReplies', data);

  }
  let apiGetReplies = (data) => {
    socket.emit('apiGetReplies', data);

  }
  let apiPutReplies = (data) => {
    socket.emit('apiPutReplies', data);

  }
  let apiPostTickets = (data) => {
    socket.emit('apiPostTickets', data);

  }
  let apiGetTickets = (data) => {
    socket.emit('apiGetTickets', data);

  }
  let apiPutTickets = (data) => {
    socket.emit('apiPutTickets', data);

  }
  let apiDeleteTickets = (data) => {
    socket.emit('apiDeleteTickets', data);

  }
  let apiPostTopics = (data) => {
    socket.emit('apiPostTopics', data);

  }
  let apiGetTopics = (data) => {
    socket.emit('apiGetTopics', data);

  }
  let apiPutTopics = (data) => {
    socket.emit('apiPutTopics', data);

  }
  let apiPostUsers = (data) => {
    socket.emit('apiPostUsers', data);

  }
  let apiGetUsers = (data) => {
    socket.emit('apiGetUsers', data);

  }
  let apiPutUsers = (data) => {
    socket.emit('apiPutUsers', data);

  }
  let watchPostVideos = (data) => {
    socket.emit('watchPostVideos', data);

  }
  let watchGetVideos = (data) => {
    socket.emit('watchGetVideos', data);

  }
  let watchPutVideos = (data) => {
    socket.emit('watchPutVideos', data);

  }
  let watchDeleteVideos = (data) => {
    socket.emit('watchDeleteVideos', data);

  }
socket.on('connected', function (data) {
   console.log('Welcome to my portfolioz.');
 });
socket.on('socketInterpretation', function (data) {

  console.log(data);

  userApp.vueCustom = data;

  if (data.type && data.on) {

    var html = `<div id="loader" class="lds-toastr">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
     </div>`;

    if (data.type === "mp4Convert" && data.on === 'start')  
    userApp.toastr('success', html, 'Video conversion', {id:data.filename, extendedTimeOut:0, timeOut:0});


   

    if (data.type === "mp4Convert" && data.on === 'end') userApp.toastrs[data.filename].fadeOut();

    return;

  }

  let dataTable = userApp.tables[data.dataTable.dataTableName];
  if (dataTable) {
    let tableId = dataTable.context[0].nTable.id;
    let columnName = Object.keys(data.values)[0];
    let row;
    let value = data.values[columnName];

    let columns = dataTable.context[0].aoColumns;

    columns.forEach((column, index) => {

      if (columnName === column.data)
        columnName = index;
    });

    $(`#${tableId} tr`).each((index, tr) => {

      if (tr.id === data.dataTable.objId) row = index - 1;
    });

    dataTable.cell({
      row: row,
      column: columnName
    }).data(value);


    //dataTable.cell({row:row, column:columnName}).context[0].aoData[0][columnName] = value;

    //$($(`#${data.dataTable.objId} td`)[columnName]).text(value);

  }




});

// Don't Edit above this line -->