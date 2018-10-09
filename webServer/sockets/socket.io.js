//sockets
const config = require('../../config/config'),
policies = require('../routes/policies/policies');
let sockets = [];
let activeClients = {};

global.sockets = {};



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


  

    

   

    io.on('connection', (socket) => {
      

      activeClients[socket.id] = {};
    

    socket.handshake.headers.cookies  = {};
    if(socket.handshake.headers.cookie ){
      activeClients[socket.id].cookie = socket.handshake.headers.cookie;

    socket.handshake.headers.cookie.split(/\s*;\s*/).forEach(function(pair) {
    pair = pair.split(/\s*=\s*/);
    socket.handshake.headers.cookies[pair[0]] = pair.splice(1).join('=');
    });

    isAuthenticated(socket.handshake.headers, (err, data) => {
        
      activeClients[socket.id].user = data;
  })

  } else {
    console.log('ran')
    console.log(activeClients[socket.id].user)
  }

    



      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });

      // config.controllers.controllerNames.forEach((model) => {
      //       createSocket(socket, 'testRoute')
      // })
      if(Object.keys(global.sockets).length === 0) {
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
                createSocket(socket, configName+capFirst(policy))
                  policyObj.policies.forEach( (policyLogic) => {

                      if(policyLogic[Object.keys(policyLogic)].active) {
                        console.log('testzz')
                        console.log(activeClients[socket.id].user)

                       
                        if(!global.sockets[configName]) {
                          global.sockets[configName] = {};
                          global.sockets[configName][policy] = []
                        }
      
                        global.sockets[configName][policy].push(policyLogic);
                        
                    
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

    } else {
      console.log('dis be it')
      console.log(global.sockets)
    }

      // createSocket(socket, 'testRoute')

      var i;
      for (i = 0; i < sockets.length; i++) {
        sockets[i](socket)
      }

    });




  }
}