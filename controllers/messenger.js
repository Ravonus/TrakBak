
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
          var payload = {}

          payload.message = messages.socketGenericSuccess
          payload.type = type;

  
          payload.msg = msg;
          
          if(msg.length && msg.length > 0 ) {
            if(Object.keys(msg[0])[0] === '$__'){
              var keys = Object.keys(msg[0].toObject());
            } else {
              var keys = Object.keys(msg[0]);
            }

              if(typeof(msg[0][keys[0]]) === 'object') {
          
                if(Object.keys(msg[0][keys[0]])[0] === "$init"){
                var keyTwo = Object.keys(msg[0][keys[0]].toObject());
                } else {
                  var keyTwo = Object.keys(msg[0][keys[0]]);
                }

       
                payload.model = msg[0][keys[0]][keyTwo[0]]
                payload.message = messages.socketGenericSuccess.message.replace(/{model}/g,payload.model).replace(/{type}/g,type);

              } else {
              payload.model = msg[0][keys[0]]
              payload.message = messages.socketGenericSuccess.message.replace(/{model}/g,payload.model).replace(/{type}/g,type);
              console.log('FUCK', payload.model)
              }



              
          } else {
            var name = Object.keys(msg)
            
              console.log('DIZ IS NAME', name);
              if(typeof(msg[name[0]]) === 'object') {
                console.log('RAN FAG')
                  payload.model = msg[name[0]][Object.keys(msg[name[0]])]
                } else {
                  console.log('fuck you', msg[name[0]])
                  payload.model = msg[name[0]];
                }
                  
                  payload.message = messages.socketGenericSuccess.message.replace(/{model}/g,payload.model).replace(/{type}/g,type);
              
        
          }
        }
        if(msg[0] && msg[0].cached || msg.cached) {

           payload.flag = 'info'
        } else {
          payload.flag = messages.socketGenericSuccess.flag;
        }
        return  payload;
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