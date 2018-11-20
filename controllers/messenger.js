
const colors = require('colors');


let messages = require('../config/messages.json');

var message = {
  apiError: (obj) => {

    obj.res.status(obj.statusCode).send(messages[obj.type]);

  },
  sockets: async (model, type, msg) => {

      if (typeof(msg) === 'string') {
          return {err:messages[msg]};
      }
      if(msg.message) {
        var payload = messages.socketGenericError;
        payload.message = msg.message;
        return payload;
      }

      if(messages[model]) {

      } else {
        
        if(msg.value) {
          
        } else {
          
          if(msg.length && msg.length > 0) {
              var keys = Object.keys(msg[0].toObject());

              if(typeof(msg[0][keys[0]]) === 'object') {
                var keyTwo = Object.keys(msg[0][keys[0]].toObject());

                model = msg[0][keys[0]][keyTwo[0]]

              } else {
                model = msg[0][keys[0]]
              }
              
          }
        }
        var payload = messages.socketGenericSuccess
        payload.message = messages.socketGenericSuccess.message.replace(/{model}/gi,model).replace(/{type}/,type);
        payload.obj = msg;
        return  Object.assign(payload, msg)
      }

  },
  success: (message) => {

  },
  render: (obj) => {
    obj.res.render(obj.page, obj);
  },
  redirect: (obj) => {
    obj.res.redirect(obj.page);
  },
  clMessage: (obj) => {


    
    if(obj.close){
    process.exit(obj.error);
    }

  }
}

module.exports = message;