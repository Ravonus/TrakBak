object = {
  dataTableFunc: (name, id, url, columns) => {

    if (!userApp.docs.data[name]) userApp.docs.data[name] = {};
    if (!userApp.docs.data[name].create) userApp.docs.data[name].create = {};
    if (userApp.nav.page === 'users' || userApp.nav.page === 'groups' || userApp.nav.page === 'categories' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.groups = [];
    if (userApp.nav.page === 'categories' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.topics = [];
    if (userApp.nav.page === 'users' && !userApp.docs.data[name].create.persons) userApp.docs.data[name].create.persons = {};
    userApp.mainTableHead.push({
      name: ''
    });

    columns.push({
      data: "actions",
      mData: "actions",
      name: "actions",
      sName: "actions"
    });

    //columns[4].data = 'groups';
    // columns[4].mData = 'groups';


    userApp.tables[name] = $(`#${id}`).DataTable({

      // dom: "Bflrtipb",
      //  dom: 'Bfrtip',
      serverSide: true,
      processing: true,
      responsive: true,
      colReorder: true,
      autoWidth: false,
      bDestroy: true,

      ajax: {
        type: "GET",
        url,
        dataSrc: function (doc) {


          //Make your callback here.

          if (name === 'users') {

            console.log(doc.data);

            doc.data.forEach((documents, index) => {

              let groups = '';
              let ids = [];

              doc.data[index].groups.forEach((element, index2) => {

                ids.push(element._id);

                if (index2 + 1 !== doc.data[index].groups.length)
                  groups += element.name + ', ';
                else
                  groups += element.name;

              });

              console.log(groups);



              doc.data[index].groups = {
                name: groups,
                ids: ids
              };



              // userApp.docs[name][index].groups = documents.groups;
            });

          }

          userApp.docs[name] = doc.data;

          return doc.data;
        }
      },
      buttons: [{
        text: 'Reload',
        action: function (e, dt, node, config) {
          dt.ajax.reload();
        }
      }],
      fixedColumns: true,
      columns: columns,
      columnDefs: [{
        "className": "text-right",
        "targets": columns.length - 1,
        defaultContent: `<a onClick="userApp.openModal(event, 'show${userApp.capFirstLetter(name)}', '${name}')" class="waves-effect waves-dark btn btn-round btn-info btn-icon btn-sm"><i class="fas fa-user-edit"></i></a>
        <a class="waves-effect waves-dark btn btn-round btn-primary btn-icon btn-sm remove"><i class="far fa-hand-pointer"></i></a>
        <a onClick="userApp.showSwal(event, 'areYouSure', '${name}')" class="waves-effect waves-dark btn btn-round btn-danger btn-icon btn-sm remove"><i class="fas fa-trash-alt"></i></a>`
      }],
      select: {
        style: 'os',
        selector: 'td:first-child'
      },
      fnCreatedRow: (nRow, doc) => {


        if (name === 'users') {



          userApp.docs[name].forEach((documents, index) => {
            console.log(documents.groups);
            //    userApp.docs[name][index].groups = documents.groups;
          });

        }

        $(nRow).attr('id', doc._id);
      }
    });

    function capitalizeFLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

    function myCallbackFunction(updatedCell, updatedRow, oldValue) {




      
      var vueName = this.vueTable;
      var value = updatedCell[0][0] ? updatedCell.data() : $(updatedCell).children()[0].value;
      var column = updatedCell[0][0] ? updatedCell[0][0].column : $(updatedCell[0]).data('dt-column');
    //  var otherTable = $($(updatedCell).parents()[4]).DataTable();
      var key = updatedCell.context ? updatedCell.context[0].aoColumns[column].data : otherTable.context[0].aoColumns[column].data;
      var rowNumber = otherTable !== undefined ? updatedRow[0][0] : $(updatedCell).data('dt-column');
      var objId = updatedCell.context ? updatedRow.context[0].aoData[rowNumber].nTr.id : otherTable.context[0].aoData[rowNumber].nTr.id;


      if(!updatedCell[0][0]) {
        //<span class="dtr-title">Groups</span>
        //<span class="dtr-data">administrator, memeber, video-mods, video-member</span>
        console.log(otherTable.context[0].aoColumns[column]);

        $(updatedCell).empty();

        $(updatedCell).append('<span class="dtr-title">' + capitalizeFLetter(key) + ' </span>');
        $(updatedCell).append('<span class="dtr-data"> '+ value+'</span>');

      }

      let json = JSON.stringify({
        [key]: value
      });
      let where = JSON.stringify({
        _id: objId
      });

      let dataTable = JSON.stringify({
        sid: socket.id,
        col: column,
        row: rowNumber,
        dataTableName: name
      });

      if (name === 'users')
        userApp.crud('PUT', `/api/${vueName}?where=${where}&dataTable=${dataTable}`, {}, json);
      else
        userApp.crud('PUT', `/${vueName}/all?where=${where}&dataTable=${dataTable}`, {}, json);
    }

    

    userApp.tables[name].MakeCellsEditable({
      "onUpdate": myCallbackFunction,
      "vueTable": name,
      "columns": ['account', 'description', 'email', 'groups.name', 'permissions'],
      "inputCss": 'my-input-class',
      "allowNulls": {
        "columns": ['groups.name'],
        "errorClass": 'my-error'
      },
      "confirmationButton": {
        "confirmCss": 'my-confirm-class',
        "cancelCss": 'my-cancel-class'
      },
      "inputTypes": [{
          "column": 'account',
          "type": "text-confirm",

        },
        {
          "column": 'email',
          "type": "text-confirm"
        },
        {
          "column": 'description',
          "type": "textarea-confirm"
        },
        {
          "column": 'permissions',
          "type": "text-confirm"
        },
        {
          "column": 'groups.name',
          "type": "list"

        }

      ]
    });

  },
  dataTableEdit: (e) => {
    console.log('fook', e.target);
  }
}