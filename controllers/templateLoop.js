const fs = require('fs'),
  path = require('path'),
  ip = require('ip'),
  config = require('../config/config'),
  // UglifyJS = require('uglify-js'),
  templatePath = path.join(__dirname, '../templates');


//Read file function - Replace all static variables with regex words - Place within public client folder. This function is used within the file loop. Used to look at template files and put correct URL for sockets and API within.
processFile = (myPath, file, word, replace) => {
  

  //read file that was pushed to function. Look at where templates are located.
  fs.readFile(templatePath + '/' + file, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    //checks to see if word is an array. Wods are going to be searched for and replaced in our template.
    if (typeof word === 'object') {
      //does foreach loop for each word in array.
      word.forEach((reg, index) => {

        var myRegEx = new RegExp(reg, 'g');
        // replaces the world with the correct variable through the page.
        // We should also get a minified application and do that here as well.
        data = data.replace(myRegEx, replace[index]);

        // Using Google Closure Compiler

      });

      // data = UglifyJS.minify(data);
//data.code
      // writes to custom javascript folder within Webserver. So public can view server

      fs.writeFile(myPath, data, (err) => {
        if (err) {
          return console.log(err);
        }

      });

    } else {
      //does same thing as above but not within loop.

      // data = UglifyJS.minify(data);
      var myRegEx = new RegExp(word, 'g');
      fs.writeFile(myPath, data.replace(myRegEx, replace), (err) => {
        if (err) {
          return console.log(err);
        }

      });

    }

  });

}

var publicPathSecure = path.join(__dirname, '../webServer/securePublic/js'),
  tbServerSecure = process.env.cbSocket || `${ip.address()}:${config.httpsPort}`,
  tbServerBackSecure = process.env.cbSocketBack || `${ip.address()}:${config.httpsPort}`;

var publicPath = path.join(__dirname, '../webServer/public/js'),
  tbServer = process.env.cbSocket || `${ip.address()}:${config.httpPort}`,
  tbServerBack = process.env.cbSocketBack || `${ip.address()}:${config.httpPort}`;

// Loop through all the files in the template directory

fs.readdir(templatePath, (err, files) => {

  if (err) {

    console.error("Could not list the directory.", err);

    process.exit(1);

  }

  //loops through files and runs above function.
  files.forEach((file, index) => {


    // Make one pass and make the file complete

    var fromPath = path.join(templatePath, file);

    var toPath = path.join(publicPath, file);
    var toPathSecure = path.join(publicPathSecure, file);
    fs.stat(fromPath, (error, stat) => {

      if (error) {

        console.error("Error stating file.", error);

        return;

      }

      processFile(toPath, file, ['{{serverBack}}',  '{{serverBack}}', '{{server}}'], [tbServerBack, tbServerBack, tbServer]);
      processFile(toPathSecure, file, ['{{serverBack}}',  '{{serverBack}}', '{{server}}'], [tbServerBackSecure, tbServerBackSecure, tbServerSecure]);
    });

  });

});

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive('./tmp/');