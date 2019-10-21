'use strict';

const path = require('path'),
  createSymlink = require('create-symlink'),
  fs = require('fs'),
  promisify = require('util').promisify;

const saveDir = path.join(__dirname, '../../files');

module.exports = async (req, res) => {

  return new Promise(async (resolve, reject) => {

    let bodies = [];
    let pathType = req.params.pathType;

    if (pathType === 'upload' && req.files && req.method === 'PUT' || req.method === 'POST') {

      let fileBody = {};

      if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }

      //let file = req.files.sampleFile;
      let object = req.body.objects ? JSON.parse(req.body.objects) : undefined;

      await Functions.asyncForEach(Object.keys(req.files), async (key) => {
        
        let file = req.files[key];
        let extension = file.name.split('.')[1].toLowerCase();
        fileBody.name = file.name.split('.')[0];
        fileBody.fileName = `${file.md5}.${(object.target === 'img' || object.target === 'logo' || object.target === 'avatar') ? 'png' : extension}`;
        fileBody.mimetype = (object.target === 'img' || object.target === 'logo' || object.target === 'avatar') ? 'image/png' : file.mimetype;
        //  fileBody.buffer = file.data;  //Uncomment to save buffer to database.
        fileBody.size = file.size;
        fileBody.directory = Object.keys(object)[0] === 'Users' ? saveDir.replace(appRoot, '') + `/profiles/${req.user.account}` : saveDir.replace(appRoot, '');
        fileBody.objects = {
          [object[Object.keys(object)[0]]]: {
            target: Object.keys(object)[1] ? object[Object.keys(object)[1]] : undefined,
            ref: Object.keys(object)[0]
          }
        };

        let foundFile = await m_models.Files.m_read({
          query: {
            fileName: fileBody.fileName,
            symlink: false
          },
          type: 'findOne'
        });

        // foundFile && Object.keys(object)[0] !== 'Users' && foundFile.directory !== saveDir


        if (foundFile && Object.keys(object)[0] === 'Users' && foundFile.objects && !foundFile.objects[req.user._id]) {
          fileBody.symlink = true;
        } else if (foundFile && Object.keys(object)[0] !== 'Users' && foundFile.directory !== saveDir) {

          // fileBody = {};
          // //TODO: delete old file here/and DB object.
          // reject({
          //   err: 'File already exists'
          // });
        } else if (foundFile && Object.keys(object)[0] !== 'Users' && foundFile.directory === saveDir) {


          // fileBody = {};
          // //TODO: delete old file here/and DB object.
          // reject({
          //   err: 'File already exists'
          // });
        } else if (foundFile) {
          fileBody = {};
          //TODO: delete old file here/and DB object.
          reject({
            err: 'File already exists'
          });
        }

        if (Object.keys(fileBody).length > 0)
          bodies.push(fileBody);

        let dirSave = `${Object.keys(object)[0] === 'Users' ? `${saveDir}/profiles/${req.user.account}` : saveDir}`;
        let dirSaveFile = `${Object.keys(object)[0] === 'Users' ? `${saveDir}/profiles/${req.user.account}` : saveDir}/${fileBody.fileName}`;
        if (!fs.existsSync(dirSave)) await fs.mkdirSync(dirSave);
        if (Object.keys(fileBody).length > 0 && !fileBody.symlink) {
          file.mv = promisify(file.mv);
          if (Object.keys(object)[0])
            await file.mv(dirSaveFile).catch(e => reject({
              err: "Could not save the file to server."
            }));


          if (object.target === 'img')
            Functions.resize(dirSaveFile, 'png', {
              w: 781,
              h: 521,
              crop: true
            });
          else if (object.target === 'logo')
            Functions.resize(dirSaveFile, 'png', {
              w: 100,
              h: 100,
              crop: true
            });
          else if (object.target === 'avatar')
            Functions.resize(dirSaveFile, 'png', {
              w: 400,
              h: 400,
              crop: true
            });
        } else {

          if (Object.keys(fileBody).length > 0)
            createSymlink(`${appRoot}${foundFile.directory}/${foundFile.fileName}`, dirSaveFile).then((doc) => {
              fs.realpathSync(dirSave);
            });


        }

      });

      req.body = bodies.length > 0 ? bodies : fileBody;

      return resolve();

    }

    if (pathType === 'find' && req.method === 'GET') {

      return resolve();

    }

    return reject({
      error: "Could not fulfil your file request."
    });

  });

};