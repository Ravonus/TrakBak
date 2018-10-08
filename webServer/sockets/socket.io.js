//sockets
const config = require('../../config/config'),
policies = require('../routes/policies/policies');
let sockets = [];




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

      // config.controllers.controllerNames.forEach((model) => {
      //       createSocket(socket, 'testRoute')
      // })

      require('../../config/routeConfig')((obj, files) => {
       // console.log(files)
        Object.keys(obj).forEach( (configName) => {
          files.forEach( (file) => {
              var name = file.split('.')[0];
        
              //else logic if main authentication not set.
                console.log(obj)
              

          })
          // console.log(config.controllers.controllerNames)
       //   console.log(obj[configName].policies)
          if(!socket._events.testRoute){
          createSocket(socket, 'testRoute')
          }
        })

      });

      // createSocket(socket, 'testRoute')

      var i;
      for (i = 0; i < sockets.length; i++) {
        sockets[i](socket)
      }

    });




  }
}