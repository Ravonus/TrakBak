const fs = require('fs'),
  config = require('../../config/config'),
  path = require('path');

let modelsDir = path.join(__dirname, '../', 'models/'),
  mongooseDir = path.join(__dirname, '../', 'mongooseCrum'),
  controllerDir = path.join(__dirname, '../', 'Users');

//load config functions into scope for this script. (After this you can access the functions as if they were created here.)
let functions = config.functions;
let message = config.message;

function scopeFunction(func) {
  Object.keys(func).forEach(function (key) {
    global[key] = func[key];
  });
}

scopeFunction(functions);
scopeFunction(message);

// Loop through all the files in models directory
fs.readdir(modelsDir, function (err, files) {
  if (err) {
    return clMessage({ name: 'models', type: 'dirDoesNotExist', path: err.path, close: false, error: err });
  }
  //foreach files loop (reads each file and does logic for each one the same)
  files.forEach((file) => {
    //if file has .js for file extension
    if (file.substring(file.length - 3) == ".js") {
      //save modelFile to file so next readdir can access this variable
      let modelFile = file;
      // Lopp through all files within mongooseCrum
      fs.readdir(mongooseDir, function (err, files) {
        if (err) {
          return clMessage({ name: 'mongooseCrum', type: 'dirDoesNotExist', path: err.path, close: false, error: err });
        }
        //foreach files loop (reads each file and does logic for each one the same)
        files.forEach((file) => {
          //if file has .js for file extension
          if (file.substring(file.length - 3) == ".js") {
            //Create controller directory if it does not exist
            if (!fs.existsSync('./webServer/controllers/' + capFirst(modelFile).slice(0, -3))) {
              var dir = './webServer/controllers/' + capFirst(modelFile).slice(0, -3);
              console.log(dir);
              fs.mkdirSync(dir);
            }

            if (!fs.existsSync('./webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file)) {
              var filePath = './webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file.slice(0, -3);
              console.log(path.join(__dirname, '../../', 'mongooseCrum/' + file));

              fs.readFile(path.join(__dirname, '../../', 'webServer/mongooseCrum/' + file), 'utf8', function (err, data) {
                if (err) throw err;

                var content = data.replace(/modelName/g, capFirst(modelFile).slice(0, -3));

                fs.writeFile('./webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file, content, function (err) {
                  if (err) {
                    return console.log(err);
                  }

                  console.log(`Controller ${capFirst(file).slice(0, -3)} created for model ${capFirst(modelFile).slice(0, -3)}.`);
                });

              });

            }

          }
        })

      });

    }
  })

});

