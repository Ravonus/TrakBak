object = {
  showSwal: (e, type, name, options) => {
    var id = typeof e === 'string' ? e : $(e.target).parents()[2].id;
    var url = options && options.url ? options.url : userApp.tables[name].context[0].ajax.url.split('?')[0];
    if (type === 'areYouSure')
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {

          let send = userApp.nav.page === 'watch' ? `${url}/${id}` : `${url}?where={"_id":"${id}"}`;

          userApp.crud('DELETE', send, {
            event: options && options.event ? options.event : undefined,
            type: options && options.type ? options.type : 'objDelete',
            name
          });

        }
      });

  }
}