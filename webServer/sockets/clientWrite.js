const fs = require('fs');
const file = './templates/customSocket.js';
let firstRun = false;
let secondRun = false;

module.exports = function (text) {

  const readFilePromise = (file, done) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', function read(err, text) {
        console.log(err)
        if (err) reject(err);
        resolve(text);
      });
    }).then(result => {
      done(result);
    }).catch(err => console.log(err))

  }

  readFilePromise(file, (customSocket) => {
    customSocket = `${customSocket.replace(/\/\/Don't edit after this line\. Edit inside of clients folder\.\/\/(.*)/s, '')}//Don't edit after this line. Edit inside of clients folder.//\n`;

    fs.readdirSync(__dirname + '/clients/').forEach(function (fileName, index) {

      readFilePromise('./webServer/sockets/clients/' + fileName, (result) => {

        const writeFilePromise = (file, text) => {

          return new Promise((resolve, reject) => {

            fs[fsPrefix](file, text, err => {
              if (err) reject(err);
              resolve("file created successfully with handcrafted Promise!");
            });
          });
        };
        var fsPrefix = 'appendFile';
        if (!firstRun) {

          fsPrefix = 'writeFile';
          firstRun = true;
        } else {
          customSocket = '';
        }

        writeFilePromise(
          file,
          `${customSocket}\n\r${result}`,

        )
          .then(result => require("../../controllers/templateLoop"))

          .catch(error => console.log(error));

      })
    })

  })

}