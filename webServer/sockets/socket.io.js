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
      
        Object.keys(obj).forEach( (configName) => {
          // files.forEach( (file) => {
          //     var name = file.split('.')[0];
        
          //     //else logic if main authentication not set.
          //  //     console.log(obj[configName])
              

          // })

          Object.keys(obj[configName]).forEach( (policy) => {
            let policyObj = obj[configName][policy];
            
            if(policyObj.active || policyObj.active === undefined) {
            
              if(policyObj.isAuthenticated && policyObj.isAuthenticated.active || policyObj.isAuthenticated && policyObj.isAuthenticated.active === undefined) {
               
                  policyObj.policies.forEach( (policyLogic, index) => {
                      if(policyLogic[Object.keys(policyLogic)].active) {
                        console.log(true)
                      }
                  })
              } else {
                //just because authentication is set to not active - doesn't mean each route doesn't have auth policy attached (Check here)
              }
            }
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