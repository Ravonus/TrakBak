module.exports = (req, done) => {

  console.log(req, 'dizzz req')
//this checks if the userObj was set by the server. If it has it means authentication cookies are present and jwt token has been verified. If this is failing while logged in make sure you make the authentication policy available to the route.
  if(Object.keys(req.userObj)[0] !== '0'){
    console.log('FUCK YOU, BUT YOU CAN STAY')
    console.log(Object.keys(req.userObj)[0] )
  
   done(null, req.userObj);
  } else {
    console.log('FUCK YOU GET OUT')
    done('notAuthenticated')
  }
}
