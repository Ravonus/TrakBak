
var url = require('url');



var routeType = (req, res) => {

  if (Object.keys(req.query).length === 0) {

    let url = req.url.split('/');

    modelName.remove.byId(url[2], (err, data) => {

      if (err) return apiError({ res: res, type: Object.keys(err)[0], statusCode: 500 })
      return res.status(200).send(data);
    });

  } else {

    modelName.remove.byFind(req.query, (err, data) => {

      if (err) return apiError({ res: res, type: Object.keys(err)[0], statusCode: 500 })
      return res.status(200).send(data);
    });

  }

}


module.exports = routeType;
