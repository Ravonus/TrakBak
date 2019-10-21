object = {
  socketJoinRoom: (obj) => {
    socket.emit('joinRoom', obj);
  }
}