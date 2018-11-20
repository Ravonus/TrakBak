function socketInterpreter(socketMessage) {

  if(socketMessage.message) {
      messenger(socketMessage);
  }

  if(socketMessage.obj) {

  }

  if(socketMessage.vue) {

  }
  
  console.log(socketMessage)
}