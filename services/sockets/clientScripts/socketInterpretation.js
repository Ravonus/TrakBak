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