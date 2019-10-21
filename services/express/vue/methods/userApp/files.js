objects = {

  fileUpload: (e, objects, extra) => {

    let form, files;


    form = e.target ? $(e.target).parents()[1] : undefined;
    files = form ? $($(`#${form.id}`)[0][0]).prop('files') : e;

    console.log(form);

    userApp.crud(form ? form.method : extra.method, form ? form.action : extra.action, {
      type: 'fileUpload',
      formData: true,
      contentType: false,
      processData: true,
      objects: [objects ? objects : undefined]
    }, files);

  }

}