module.exports = (req, done) => {
console.log(req.userObj);

setTimeout(function(){ done(null, 'fucc') }, 10000);
  
}
