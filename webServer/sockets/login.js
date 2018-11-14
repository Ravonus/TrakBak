

module.exports = (socket) => {

  socket.on('login', (data) => {

  
    console.log(data,'fucc you');

    if(config.serverName) {

    } else {
      
    }

    console.log(config.functions.postRequest)
    
    config.functions.postRequest('nojwt', `/user/login`, { username: data.form[0], password: data.form[1] }, function (data) {

 
      console.log('fuck diz')

      var obj = JSON.parse(data);

      if (obj.user) {

      

        var cookie = require('cookie-signature');

        //create siganture for jwt cookie - push via sockets and have client save cookie.
        var signature = cookie.sign(config.functions.jwtScramble(obj.user._id, obj.user.jwt), config.cookieSecret);

        obj.user.jwt = signature;

        socket.emit('login', obj);

      } else {
        console.log('diz fucker ran');
        socket.emit('login', obj);

      }
    });

  });



}


