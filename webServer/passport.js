const passport = require("passport"),
app = require('../app');

console.log(app);

app.use(passport.initialize());
app.use(passport.session());