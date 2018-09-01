//This auto feels backend server ip and port.
var clikbakSocket = '{{serverS}}';
var clikbakSocket = '{{serverBack}}';

//public table variable.
var t;

//Logout function
function logout() {
  localStorage.removeItem("clikbak");
  window.location.href = "/";

}

//Capital first letter of word
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}