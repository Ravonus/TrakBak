socket.on('joinRoom', function (obj, options) {

                socketInterpreter(obj, options);
            });
    
            function socketJoinRoom(obj) {
                socket.emit('joinRoom', obj);
              }socket.on('leaveRoom', function (obj, options) {

                socketInterpreter(obj, options);
            });
    
            function socketLeaveRoom(obj) {
                socket.emit('leaveRoom', obj);
              }socket.on('socketPush', function (obj, options) {

                socketInterpreter(obj, options);
            });
    
            function socketSocketPush(obj) {
                socket.emit('socketPush', obj);
              }socket.on('sendInfo', function (obj, options) {

                socketInterpreter(obj, options);
            });
    
            function socketSendInfo(obj) {
                socket.emit('sendInfo', obj);
              }socket.on('test', function (obj, options) {

                socketInterpreter(obj, options);
            });
    
            function socketGetTest(obj) {
                socket.emit('test', obj);
              }