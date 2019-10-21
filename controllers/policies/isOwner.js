'use strict';

module.exports = async (req, res) => {

  return new Promise((resolve, reject) => {
    let user = req.user;


    if (req.method === 'GET' && !req.user.groups.includes('5d016f5eee13b0dafc35c60e')) req.query = {
      _id: user._id
    }

    if (req.method === 'PUT' && !req.query.where && !req.body.where) {
      req.query.where = {
        _id: user._id
      };
    }

    console.log(req.user.groups)

    if (req.method === 'PUT' && req.query.where && !req.user.groups.includes('5d016f5eee13b0dafc35c60e') || req.method === 'PUT' && req.body.where && !req.user.groups.includes('5d016f5eee13b0dafc35c60e')) {
      try {
        if (req.body.where) {

          req.query.where = req.body.where;
          delete req.body.where;
        }
        req.query.where = JSON.parse(req.query.where);

        if (req.query.where.id) req.query.where._id = req.query.where.id;

        if (req.query.where._id && req.query.where._id !== user._id) {
          return reject({
            error: "This is not your account object."
          });
        }

      } catch (e) {

      }

      req.query.where._id = user._id;

    }

    if (req.method === 'PUT' && req.body.where && req.body.where._id && !req.user.groups.includes('5d016f5eee13b0dafc35c60e')) req.body.where = {
      id: user._id
    };

    else if (req.method === 'PUT' && req.query.where && req.user.groups.includes('5d016f5eee13b0dafc35c60e')) req.body.where = req.body.where = {
      _id: req.query.where
    };

    return resolve();
  });
}