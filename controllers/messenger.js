

let messages = {
  noToken: { auth: false, message: 'No token provided. Please make sure x-access-token is set in headers. Also don\'t forget the actual token.' },
  badToken: { auth: false, message: 'Incorrect token key. Please check token and try again.' },
  'name.username': { created: false, message: 'Sorry, that username is already taken.' },
  passwordHash: { created: false, message: 'Password is a required field' }
};

var message = {
  apiError: (obj) => {

    obj.res.status(obj.statusCode).send(messages[obj.type]);

  },
  success: (message) => {

  },
  render: (obj) => {
    obj.res.render(obj.page);
  }
}

module.exports = message;