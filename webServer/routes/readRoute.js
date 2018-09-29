
var url = require('url');

var routeType = (req, res) => {

  if (Object.keys(req.body).length === 0) {
    req.body = req.query;
    console.log(req.body);
  }

  modelName.read.find(req.body, { passwordHash: false },
    (err, obj) => {
      console.log('ran')
      console.log(err);
      if (err) return apiError({ res: res, type: Object.keys(err)[0], statusCode: 500 })
      return res.status(200).send(obj);

      // console.log('Script Start Took: ', Date.now() - startTime + ' ms');
    });

}

module.exports = routeType;
