const fs = require('fs'),
      path = require('path'),
      ip = require('ip'),
      config = require('../config/config'),
      tbServer = process.env.cbSocket || `${ip.address()}:${config.httpPort}`,
      tbServerBack = process.env.cbSocketBack || `http://${ip.address()}:${config.httpPort}`

templatePath = path.join(__dirname, '../templates'),
publicPath = path.join(__dirname, '../webServer/public/js');

//Read file - Replace all static variables with regex words - Place within public client folder. This function is used within the file loop. Used to look at template files and put correct URL for sockets and API within.
function processFile(myPath, file, word, replace) {

fs.readFile(templatePath + '/' + file, "utf8", function (err, data) {
  if (err) {
    throw err;
  }


  if (typeof word === 'object') {

    word.forEach((reg, index) => {

      var myRegEx = new RegExp(reg, 'g');

      data = data.replace(myRegEx, replace[index]);

    });

    fs.writeFile(myPath, data, function (err) {
      if (err) {
        return console.log(err);
      }

    });

  } else {

    var myRegEx = new RegExp(word, 'g');
    fs.writeFile(myPath, data.replace(myRegEx, replace), function (err) {
      if (err) {
        return console.log(err);
      }

    });

  }

});

}

// Loop through all the files in the template directory

fs.readdir(templatePath, function (err, files) {

if (err) {

  console.error("Could not list the directory.", err);

  process.exit(1);

}

files.forEach(function (file, index) {

  // Make one pass and make the file complete

  var fromPath = path.join(templatePath, file);

  var toPath = path.join(publicPath, file);

  fs.stat(fromPath, function (error, stat) {

    if (error) {

      console.error("Error stating file.", error);

      return;

    }

    processFile(toPath, file, ['{{serverBack}}', '{{serverBackz}}', '{{server}}', '{{serverS}}'], [tbServerBack, tbServerBack, tbServer, 'poops']);

  });

});

});