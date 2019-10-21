object = {
  vueCustom: [],
  crudScripts: {
    vueCustom: (options, data) => {
      if (options.type === 'vueCustom') {
        userApp.vueCustom = data;
        userApp.backupArr = data;
      }
      
    }
  }
}