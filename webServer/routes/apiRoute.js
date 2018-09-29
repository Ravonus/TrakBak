
var url = require('url');



    var routeType = (req, res) => {
     
      if(Object.keys(req.body).length === 0) {
        req.body = req.query;
      }
      modelName.create(
      req.body,
     { passwordHash: false }, (err, data) => {

        if(err) return apiError({ res: res, type: Object.keys( err )[0], statusCode: 500 })

          return  res.status(200).send(Object.assign({ created: true }, data._doc));
        
 
      })

    }

  




module.exports = routeType;
