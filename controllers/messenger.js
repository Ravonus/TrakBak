
const colors = require('colors');


let messages = require('../config/messages.json');

var message = {
  apiError: (obj) => {

    obj.res.status(obj.statusCode).send(messages[obj.type]);

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