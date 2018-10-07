//sockets
const config = require('../../config/config'),
policies = require('../routes/policies/policies');
routes = require('../../config/routeConfig');
let sockets = [];

config.controllers.controllerNames.forEach((model) => {
  console.log(model.name, model.request)
})
// setup socket scripts. Loops through sockets and sets an array up. Socket.io does a for loop to load each connection.


//console.log(User.api.read.toString());
//console.log(policies);

require("fs").readdirSync(__dirname).forEach(function (file) {
  if (file !== 'socket.io.js' && file !== 'clientWrite.js' && file !== 'clients') {

    sockets.push(require(`./${file}`));
  }

});


module.exports = {

  socket: (io) => {

    let activeClients = {};

    io.on('connection', (socket) => {

      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });

      var i;
      for (i = 0; i < sockets.length; i++) {
        sockets[i](socket)
      }

    });

  }
}