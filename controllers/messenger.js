
const colors = require('colors');


let messages = {
  noToken: { auth: false, message: 'No token provided. Please make sure x-access-token is set in headers. Also don\'t forget the actual token.' },
  badToken: { auth: false, message: 'Incorrect token key. Please check token and try again.' },
  'name.username': { created: false, message: 'Sorry, that username is already taken.' },
  notAuthenticated: {auth: false, message: 'You are not logged in. This request requires suthentication.'},
  loginError: { auth: false, message: 'There was a probleming Logging in. Please check Username and Password.' },
  passwordHash: { created: false, message: 'Password is a required field' },
  dirDoesNotExist: {message:'Directory'.white+':'.yellow + 'NAME'.grey+ ' Does not exist within'.red+' path'.white+':'.yellow+'PATH\n\r'.grey},
  fucc: 'fuccc you got an error'
};

var message = {
  apiError: (obj) => {

    obj.res.status(obj.statusCode).send(messages[obj.type]);

  },
  success: (message) => {

  },
  render: (obj) => {
    obj.res.render(obj.page);
  },
  redirect: (obj) => {
    obj.res.redirect(obj.page);
  },
  clMessage: (obj) => {


    console.log(messages[obj.type].message.replace('PATH', obj.path).replace('NAME', obj.name))
    if(obj.close){
    process.exit(obj.error);
    }

  }
}

module.exports = message;