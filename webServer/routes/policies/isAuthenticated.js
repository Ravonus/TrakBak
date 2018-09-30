

let isAuthenticated = (done) => {

  setTimeout(function(){ return done(null,'still should be 5 seconds'); }, 5000);

}

module.exports = isAuthenticated;
