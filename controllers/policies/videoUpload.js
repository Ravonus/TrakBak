const express = require('express'),
  resumable = require('../resumable/resumable-node')('/tmp/resumable.js/'),
  app = express(),
  fs = require('fs'),
  crypto = require('crypto');

module.exports = (req, res) => {

  return new Promise(async (resolve, reject) => {



      let path = req.params.path,
        identifier = req.query.identifier,
        play = req.query.play,
        filename = req.params.path,
        body = req.body;

        

      if (req.query.db) req.skipDB = true;

      if(req.query.api) return resolve();

      if(req.files)
      if (Object.keys(req.files).length === 0 && req.method === 'POST' && !req.body.url) reject({
        err: "file is requireds."
      });


      if(req.method === 'POST' && body.url) {



        return resolve();
      }

      // if (req.method === 'GET') {

      //   console.log("FUDGE")

      //   req.query.filename

      //   if (!req.query.filename) {
      //     return res.status(500).end('query parameter missing');
      //   }
      //   res.end(
      //     crypto.createHash('md5')
      //     .update(req.query.filename)
      //     .digest('hex')
      //   );
      // }

      if (play && req.method === 'GET') {

        console.log("RUNNING");

        console.log(req.query)

        if (!req.query.id && !req.query.filename) {
          return res.status(500).end('query parameter missing');
        }

        
        filePath = req.query.filename ? `./Video/${req.query.filename}` : `./Video/${await m_models.Videos.m_read({query:{_id:req.query.id},type:'findById'}).then( (data) => data.services.local.name)}`;
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {

          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;

          const file = fs.createReadStream(filePath, {
            start,
            end
          });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(200, head);
          fs.createReadStream(filePath).pipe(res);
        }

        return;
        //res end here
      }


      // Handle uploads through Resumable.js
      if (path === 'upload' && req.method === 'POST') {

        resumable.post(req, function (status, filename, original_filename, identifier) {
          req.custom = status;
          return resolve(status);
          //      res.send(status);
        });
      }

      // Handle status checks on chunks through Resumable.js
      if (path === 'upload' && req.method === 'GET') {

        resumable.get(req, function (status, filename, original_filename, identifier) {
          req.custom = status;
          return resolve((status == 'found' ? 200 : 404), status);
          //    res.send((status == 'found' ? 200 : 404), status);
        });
      }

      if (path === 'download' && identifier && req.method === 'GET') {

        resumable.resumable().write(req.params.identifier, res);
      }

      delete req.query.db;
      delete req.query.identifier;
      delete req.query.resumableChunkNumber;
      delete req.query.resumableChunkSize;
      delete req.query.resumableCurrentChunkSize;
      delete req.query.resumableTotalSize;
      delete req.query.resumableType;
      delete req.query.resumableIdentifier;
      delete req.query.resumableFilename;
      delete req.query.resumableRelativePath;
      delete req.query.resumableTotalChunks;

      if (req.files && req.files.file)

        JSON.stringify(req.query.services = {
          "local": {
            originalFilename: `${req.files.file.originalFilename.split('.').slice(0, -1).join('.')}.mp4`,
            name: `${req.files.file.originalFilename.split('.').slice(0, -1).join('.')}.mp4`,
          }
        });

      req.body = req.query;

      return resolve();

    }

  );
};