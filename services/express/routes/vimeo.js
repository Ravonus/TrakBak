'use strict';

const fs = require('fs'),
  path = require('path');

const configFile = path.join(__dirname, '../../../', 'config', 'vimeo.json');

function vimeoTest(res, body) {
  return Functions.vimeo({
    method: 'GET',
    path: '/tutorial'
  }, body).then((data) => data).catch(e => JSON.parse(e.toString().slice(7)));
}

module.exports = {

  route: async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let path = req.params.path;
    let body = req.body;
    
    if (path === 'setup' && req.method === 'POST') {
      if (!body.cid) return res.send({
        err: "You must specify client ID in order to run setup."
      }).status(404);

      if (!body.secret) return res.send({
        err: "You must specify vimeo secret in order to run setup."
      }).status(404);

      if (!body.token) return res.send({
        err: "You must specify vimeo token in order to run setup."
      }).status(404);

      let test = await vimeoTest(res, body);

      if (test.error) return res.status(404).send(test);

      config.vimeo = body;
      fs.writeFileSync(configFile, JSON.stringify(body, null, 4));

      return res.send(JSON.stringify(body));

    }

    if (path === 'test' && req.method === 'GET') {

      let test = await vimeoTest(res);
      if (test.error) return res.status(404).send(test);

      return res.send(test);
    }

    if (path === 'grab' && req.method === 'GET') {

      let test = await vimeoTest(res);
      if (test.error) return res.status(404).send(test);

      return res.send({
        cid: config.vimeo.cid,
        secret: config.vimeo.secret,
        token: config.vimeo.token
      });
    }

    res.statusCode = 404;
    return res.send({
      err: "There was an error with your vimeo request."
    });

  },
  type: 'all',
  path: '/vimeo/:path',
  permissions: 1,
  groups: ['administrators', 'video_mod']
};