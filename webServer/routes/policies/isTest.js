module.exports = async (req, done) => {

  const sent = await email.send({to:"chadkoslovsky@gmail.com", subject:"testNode", html:"default", text:"default"})
  console.log(sent);

  setTimeout(function(){ done(null, 'fucc') }, 5000);

  
}
