

module.exports = exports = function fileExists(schema, options) {

  schema.post('validate', async function (doc, next) {

    // let files = await m_models.Files.m_read({query:{fileName:doc.fileName}});

    // if(files && files.length > 0) {
    //   doc.symlink = true;
    // }
    next();
  });
  
};