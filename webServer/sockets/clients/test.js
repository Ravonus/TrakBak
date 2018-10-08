function testRoute() {

  socket.emit('testRoute', {
    url: 'testURL',
    form: 'da form'
  });

};

socket.on('testRoute', function (data) {

console.log(data)

});
