//sockets
const config = require('../../config/config'),
  mongoose = require('mongoose'),
  policies = require('../routes/policies/policies');

let sockets = [];
let activeClients = {};

global.sockets = {};
var socketAdded = [];
// setup socket scripts. Loops through sockets and sets an array up. Socket.io does a for loop to load each connection.


let policyObject = [];

require('./clientWrite')(() => {


  require("fs").readdirSync(__dirname).forEach(function (file) {
    if (file !== 'socket.io.js' && file !== 'clientWrite.js' && file !== 'clients') {

      sockets.push(require(`./${file}`));

    }

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

                if (policy[Object.keys(policy)].sockets !== undefined && !policy[Object.keys(policy)].sockets) {

                  delete policyObj.policies[index];
                }
              })
            }

            let routeName = `${configName.toLowerCase()}${capFirst(route)}`


            obj[configName][route].name = configName;
            obj[configName][route].route = route;
            console.log('test', socketAdded)
            if(!socketAdded.includes(routeName)){
              socketAdded.push(routeName);
            policyObject.push(obj[configName][route]);

            clientSocket(`function ${routeName}(data) {
         t0 = performance.now();
        socket.emit('${routeName}', 
          {data:data}
        );
      
        };
       socket.on('${routeName}', function (data) {
         socketInterpreter(data);
         var t1 = performance.now();
         console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

        })
       `);
      }


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

          if(!data) {
            mongoose.Query.prototype.clientID = 'rando clientid';
          } else {
            mongoose.Query.prototype.clientID = data._id.toString();
  

            
          }

         

   

          policyObject.forEach((policyObj) => {

            var options = {};

            if (policyObj.groups && policyObj.groups.length !== 0) {
              options.groups = policyObj.groups;
            }

            if (policyObj.permissions && policyObj.permissions !== 0) {
              options.permissions = policyObj.permissions;
            }
            
            createSocket(socket, policyObj.name.toLowerCase() + capFirst(policyObj.route), policyObj, activeClients[socket.id].user, policies, options)

          });


        })

      } else {
        policyObject.forEach((policyObj) => {


          createSocket(socket, policyObj.name.toLowerCase() + capFirst(policyObj.route), policyObj, policies, {})
        });

      }

      socket.emit('connected', { connected: 'true' });




      var i;
      for (i = 0; i < sockets.length; i++) {

        sockets[i](socket)
      }

    });

  }
}