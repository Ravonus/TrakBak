module.exports = (req, done) => {
  if(req.userObj){
  done(null, req.userObj);
  } else {
    done('notAuthenticated')
  }
}
