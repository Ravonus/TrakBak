const fs = require('fs');

module.exports =  (javascript) => {

  fs.appendFile(`./templates/customSocket.js`, javascript, (err, data) => { });

}