//sockets
const config = require('./../config/config');

module.exports = {

  socket: (io) => {

    let activeClients = {};

    //sockets

    io.on('connection', (socket) => {

      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });

      socket.on('login', (data) => {

        config.functions.postRequest('nojwt', 'http://localhost:3002/user/login', { username: data.form[0], password: data.form[1] }, function (data) {

          var obj = JSON.parse(data);

          if (obj.user) {

            var cookie = require('cookie-signature');

            //create siganture for jwt cookie - push via sockets and have client save cookie.
            var signature = cookie.sign(config.functions.jwtScramble(obj.user._id, obj.user.jwt), config.cookieSecret);

            obj.user.jwt = signature;

            socket.emit('login', obj);
          } else {
            socket.emit('login', obj);
          }
        });


      });

    });

  }
}