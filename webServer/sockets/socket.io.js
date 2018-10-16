//sockets
const config = require('../../config/config'),
  policies = require('../routes/policies/policies');

let sockets = [];
let activeClients = {};

global.sockets = {};

// setup socket scripts. Loops through sockets and sets an array up. Socket.io does a for loop to load each connection.


let policyObject = [];

require('./clientWrite')(() => {


  require("fs").readdirSync(__dirname).forEach(function (file) {
    if (file !== 'socket.io.js' && file !== 'clientWrite.js' && file !== 'clients') {

      sockets.push(require(`./${file}`));
    }
    capFirst
  });


  require('../../config/routeConfig')((obj, files) => {

    Object.keys(obj).forEach((configName, index) => {

      Object.keys(obj[configName]).forEach((route) => {
        let policyObj = obj[configName][route];
        if (typeof policyObj === 'object') {
          obj[configName].route = route;

          if (policyObj.sockets) {

            if (policyObj.isAuthenticated && policyObj.isAuthenticated.sockets === false) {

              delete policyObj.isAuthenticated;
            }

            if (policyObj.policies) {

              policyObj.policies.forEach((policy, index) => {

                if (!policy[Object.keys(policy)].sockets) {
                  delete policyObj.policies[index];
                }
              })
            }

            let routeName = `${configName.toLowerCase()}${capFirst(route)}`

      
            obj[configName][route].name = configName;
            obj[configName][route].route = route;
            policyObject.push(obj[configName][route]);
            clientSocket(`function ${routeName}(data) {
          console.log(data)
        socket.emit('${routeName}', 
          {data:data}
        );
      
        };
       socket.on('${routeName}', function (data) {console.log(data)})
       `);



          } else {
            //need to check sepearte polices to make sure socket is not defined(Top is global check)
          }
        }
      });

    })
  })



})


require("../../controllers/templateLoop");
//require("../../controllers/templateLoop");

module.exports = {

  socket: (io) => {

    io.on('connection', (socket) => {

      var t0 = new Date().getTime();

      activeClients[socket.id] = {};

      socket.handshake.headers.cookies = {};
      if (socket.handshake.headers.cookie) {
        activeClients[socket.id].cookie = socket.handshake.headers.cookie;

        socket.handshake.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
          pair = pair.split(/\s*=\s*/);
          socket.handshake.headers.cookies[pair[0]] = pair.splice(1).join('=');
        });

        isAuthenticated(socket.handshake.headers, (err, data) => {

          activeClients[socket.id].user = data;

          policyObject.forEach((policyObj) => {

            createSocket(socket, policyObj.name.toLowerCase() + capFirst(policyObj.route),  policyObj, activeClients[socket.id].user)
   
        });
  

        })

      } else {
        createSocket(socket, policyObj.name.toLowerCase() + capFirst(policyObj.route),  policyObj, {})
      }



      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });

  


      // var i;
      // for (i = 0; i < sockets.length; i++) {
      //   sockets[i](socket)
      // }

    });

  }
}