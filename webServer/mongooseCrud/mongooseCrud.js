const fs = require('fs'),
  path = require('path'),
  requireFromString = require('require-from-string'),
  config = require(path.join(__dirname, '../../', 'config/', 'config'));

  config.controllers.controllerNames = []

let modelsDir = path.join(__dirname, '../', 'models/'),
  mongooseDir = path.join(__dirname,  '../', 'mongooseCrud'),
  controllerDir = path.join(__dirname,  'Users');

  config.controllers.api = {};

//load config functions into scope for this script. (After this you can access the functions as if they were created here.)
//config.functions.scopeFunctions(config);

// Loop through all the files in models directory
fs.readdir(modelsDir, function (err, files) {

  
  var directories = files;
  
  if (err) {
    return clMessage({ name: 'models', type: 'dirDoesNotExist', path: err.path, close: false, error: err });
  }
  //foreach files loop (reads each file and does logic for each one the same)
  files.forEach((file, index) => {
    var modelFile = file;

    fs.readFile(path.join(__dirname, '../../', 'webServer/routes/', 'apiRoute.js'), 'utf8', function (err, apiRoute) {



    
    //if file has .js for file extension
    if (file !== 'mongooseCrus.js' && file.substring(file.length - 3) == ".js") {
    
      //save modelFile to file so next readdir can access this variable
  
      // Lopp through all files within mongooseCrud
      fs.readdir(mongooseDir, function (err, files) {
        if (err) {

          return clMessage({ name: 'mongooseCrud', type: 'dirDoesNotExist', path: err.path, close: true, error: err });
        }
        //foreach files loop (reads each file and does logic for each one the same)
        files.forEach((file, indexTwo) => {
          
          //if file has .js for file extension
          if (file !== 'mongooseCrud.js' && file.substring(file.length - 3) == ".js") {
   
            //Create controller directory if it does not exist
            if (!fs.existsSync('./webServer/controllers/' + capFirst(modelFile).slice(0, -3))) {
              var dir = './webServer/controllers/' + capFirst(modelFile).slice(0, -3);
            //  console.log(dir);
              fs.mkdirSync(dir);
            }

            if (!fs.existsSync('./webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file)) {
              var myFile = file
              var filePath = './webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file.slice(0, -3);
            //  console.log(path.join(__dirname, '../../', 'mongooseCrud/' + file));

              fs.readFile(path.join(__dirname, '../../', 'webServer/mongooseCrud/' + file), 'utf8', function (err, data) {
                if (err) throw err;

                var content = data.replace(/modelName/g, capFirst(modelFile).slice(0, -3));

                fs.writeFile('./webServer/controllers/' + capFirst(modelFile).slice(0, -3) + '/' + file, content, function (err) {
                  if (err) {
                    return console.log(err);
                  }
                  config.controllers[capFirst(modelFile).slice(0, -3)] = require(`../controllers/${capFirst(modelFile).slice(0, -3)}/${file}`)
                  

                  finished()
                });

              });

            } else {
              
              var myFile = file;
              finished()
            }
            function finished() {
            //  console.log(`../controllers/${capFirst(modelFile).slice(0, -3)}/${file}`);
              if(!config.controllers[capFirst(modelFile).slice(0, -3)] ) {
                
              config.controllers[capFirst(modelFile).slice(0, -3)]  = {}
              config.controllers[capFirst(modelFile).slice(0, -3)].api = {}
          
              
              } else if(!config.controllers[capFirst(modelFile).slice(0, -3)].api) {
                config.controllers[capFirst(modelFile).slice(0, -3)].api = {}
            
              }
             
              config.controllers[capFirst(modelFile).slice(0, -3)][myFile.slice(0, -3)] = require(`../controllers/${capFirst(modelFile).slice(0, -3)}/${myFile}`)
         //     console.log(config.controllers);


           //   console.log(apiRoute.replace(/modelName/g, modelFile.slice(0, -3)).replace(/routeType/g, file.slice(0, -3)));
 
           
       //    console.log('myFIle!! ', config.controllers[capFirst(modelFile).slice(0, -3)]);
              config.controllers[capFirst(modelFile).slice(0, -3)].api[myFile.slice(0, -3)] = requireFromString(apiRoute.replace(/modelName/g, modelFile.slice(0, -3)).replace(/routeType/g, myFile.slice(0, -3)))

              if(myFile.slice(0, -3) === 'create') {
                var request = 'post'
              }
              if(myFile.slice(0, -3) === 'read') {
                var request = 'get'
              }
              if(myFile.slice(0, -3) === 'remove') {
                var request = 'delete'
              }
              if(myFile.slice(0, -3) === 'update') {
                var request = 'put'
              }
              config.controllers.controllerNames.push({name:(modelFile).slice(0, -3), type:myFile.slice(0, -3), request})

           
              if(index === directories.length - 1 && indexTwo === files.length - 1) {

                
                setTimeout(function () {  global.trakbak.controllers = true;  }, 0);
              

              }
         
            }

          } else {
        //    index--
          //  files.length--
          }
        })
        

      });
       
    }
  });
  })

})



