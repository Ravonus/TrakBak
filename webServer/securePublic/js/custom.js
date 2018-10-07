//This auto feels backend server ip and port.
var clikbakSocket = '192.168.0.117:3003';
var trakbak = {};

//public table variable.
var t;

if(localStorage.trakbak) {

  trakbak = JSON.parse(localStorage.trakbak);

}


//Logout function
function logout() {
  localStorage.removeItem("trakbak");
  window.location.href = "/";
}

//Set cookie function

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


//Capital first letter of word
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}