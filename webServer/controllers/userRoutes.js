const cookie = require('cookie'),
      DB = require('../mongoose');

module.exports = {
  createUser: (req, res) => {

    let createUser = new DB.User ({
      _id: new DB.mongoose.Types.ObjectId(),
      name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName
      },
      biography: 'Postman post request.',
      password: req.body.password
    });
    
    createUser.save(function(err) {
      if (err) res.status(400).send(err);
      res.status(200).send(req.body);
    
    });

  },
  getUser: (req, res, next) => {

  },
  updateUser: (req, res, next) => {

  }
}