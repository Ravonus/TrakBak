const fs = require('fs'),
  path = require('path'),
  prettyjson = require('prettyjson'),
  requireFromString = require('require-from-string');
  _ = require('lodash'),
  config = require(path.join(__dirname, '../../', 'config/', 'config'));

  let policies = {}


config.controllers.controllerNames = []

let modelsDir = path.join(__dirname, '../', 'models/'),
  mongooseDir = path.join(__dirname, '../', 'mongooseCrud'),
  controllerDir = path.join(__dirname, 'Users');

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

            // fs.writeFile(`../../config/${modelFile.slice(0, -3)}/`, data, { flag: 'wx' }, function (err) {





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

                function getPolicies(done) {
                  var files = [];
                require("fs").readdirSync('./webServer/routes/policies/').forEach(function(file, index) {

                  if(file !== 'policies.js') {

                    files.push(file);
       
                  }

                  if(files.length-1 < index) {

                    done(files)
                  }
      
          
      
                
                });

              }
                
                if (!fs.existsSync(`./config/${modelFile.slice(0, -3)}/`)) {
                  
                  var dir = `./config/${modelFile.slice(0, -3)}/`
                  fs.mkdirSync(dir)
                  var str = {
                    "isAuthenticated" : {"groups":[],"permissions":[], "timing":"before", "active":  false}, policies: []
                  }
       
                  
        
                  getPolicies( (arr) => {
                    arr.forEach( (policy) => {
                      var policyName = policy.slice(0, -3);
                      str.policies.push({[policyName] : {"groups":[],"permissions":[], "timing":"before", "active":  false}})
                    })
                  })
                  fs.writeFileSync(`${dir}${file.slice(0, -3)}.json`,JSON.stringify(str, null, "\t") )
                } else if (!fs.existsSync(`./config/${modelFile.slice(0, -3)}/${file.slice(0, -3)}.json`)) {
                  var str = {
                    "isAuthenticated" : {"groups":[],"permissions":[], "timing":"before", "active":  false},
                    policies: []
                  }
                  getPolicies( (arr) => {
                    arr.forEach( (policy) => {
                      var policyName = policy.slice(0, -3);
                      str.policies.push({[policyName] : {"groups":[],"permissions":[], "timing":"before", "active":  false}})
                    })
                  })

                  fs.writeFileSync(`./config/${modelFile.slice(0, -3)}/${file.slice(0, -3)}.json`,JSON.stringify(str, null, "\t") )
                } else {

                  fs.readFile(`./config/${modelFile.slice(0, -3)}/${file.slice(0, -3)}.json`, 'utf8', function (err, data) {
                    if (err) throw err;
                    var obj = JSON.parse(data);
                  //  console.log('dattta', data)


                    var newPolicies = (policies, fileList) => {
                      var found = false;

                      function merge(arr, arr2, files, done) {

                        Array.prototype.clean = function(deleteValue) {
                          for (var i = 0; i < this.length; i++) {
                            if (this[i] == deleteValue) {         
                              this.splice(i, 1);
                              i--;
                            }
                          }
                          return this;
                        };

                        arr2.forEach( (policy, index) => {

                       
                          if(!JSON.stringify(files).includes(Object.keys(policy))){

                            found = true;

                        //    console.log('FOUND NOT', Object.keys(policy), index)

                         //   arr2[index] = undefined;
                       


         

                         delete arr2[index];



                         console.log(arr2[index])
                            var newArr = arr2;
                            arr2 = newArr

                        }

                        if(arr2.length <= index + 1) {
                         
                          secondLoop()
                        }

                      })

                      function secondLoop() {
                   //     console.log('newww arr', arr2)
                        arr.forEach((policy, index) => {

                         
                     
                      
                          if(!JSON.stringify(arr2).includes(Object.keys(policy))){

                            if(!JSON.stringify(files).includes(Object.keys(policy))) {}
            

                            found = true;
                         

                            arr2.push(policy)

                           
                          } 

                          if(arr.length <= index + 1) {
                            done(arr2.clean(null), found)
                          }
                        })
                      }

                        
                      }

   
                    
                

                  //   var newArr = Object.assign(policies, obj.policies);

                //  console.log(policies, ' FUCK THIS SHIT ', obj.policies)
                    merge(policies, obj.policies, fileList, (policy, found) => {

                  //    console.log('fucc', policy)
                  
                       obj.policies = policy;
                       if(found){

                        console.log('fouuund!!')
    
          
                        var options = {
                          noColor: true
                        };

                        var print_to_file = JSON.stringify(obj, null, "\t")
                       fs.writeFile(`./config/${modelFile.slice(0, -3)}/${file.slice(0, -3)}.json`, print_to_file, function(err) {
                        if(err) {
                          console.log(err);
                        } else {
                      //    console.log("JSON saved to " + outputFilename);
                        }
                    }); 

                       }
                     })

             //        obj.policies = newArr
                  //  obj.policies = merged
                //     console.log('opbbbj', obj)

                

             //   console.log('fuck man', newArr)
               
    

             

    

        
                    
                  //    fs.writeFileSync(`./config/${modelFile.slice(0, -3)}/${file.slice(0, -3)}.json`,JSON.stringify(obj) )               
                    }


                    
                    getPolicies( (arr) => {
                      var policiyArr = []

      
                   
                      arr.forEach( (policy, index) => {
                     
                 
                        policiyArr.push({[policy.substring(0, policy.length - 3)] : {"groups":[],"permissions":[], "timing":"before", "active":  false}})
                        
                        if(arr.length >= index + 1) {

                          newPolicies(policiyArr, arr);
                        }
                      })
      
                        // if(!JSON.stringify(arr).includes(Object.keys(policy))) {
                        // obj.policies.push({[arr[index]] : {"groups":[],"permissions":[], "timing":"before", "active":  false}})
                        // }


                  

                
  
                      //  if(index === 0) {
                   
                      //  } else {
                      //    newPol
                      //  }

                 
                     
                      
                  
   
                 


                          
                        
                  




                  })


                  })
                  
                }
  

                //  console.log(`../controllers/${capFirst(modelFile).slice(0, -3)}/${file}`);
                if (!config.controllers[capFirst(modelFile).slice(0, -3)]) {

                  config.controllers[capFirst(modelFile).slice(0, -3)] = {}
                  config.controllers[capFirst(modelFile).slice(0, -3)].api = {}


                } else if (!config.controllers[capFirst(modelFile).slice(0, -3)].api) {
                  config.controllers[capFirst(modelFile).slice(0, -3)].api = {}

                }

                config.controllers[capFirst(modelFile).slice(0, -3)][myFile.slice(0, -3)] = require(`../controllers/${capFirst(modelFile).slice(0, -3)}/${myFile}`)
                //     console.log(config.controllers);


                //   console.log(apiRoute.replace(/modelName/g, modelFile.slice(0, -3)).replace(/routeType/g, file.slice(0, -3)));


                //    console.log('myFIle!! ', config.controllers[capFirst(modelFile).slice(0, -3)]);


      
                  if(err) return err;

                  
                  config.controllers[capFirst(modelFile).slice(0, -3)].api[myFile.slice(0, -3)] = requireFromString(apiRoute.replace(/modelName/g, modelFile.slice(0, -3)).replace(/routeType/g, myFile.slice(0, -3)))

                  if (myFile.slice(0, -3) === 'create') {
                    var request = 'post'
                  }
                  if (myFile.slice(0, -3) === 'read') {
                    var request = 'get'
                  }
                  if (myFile.slice(0, -3) === 'remove') {
                    var request = 'delete'
                  }
                  if (myFile.slice(0, -3) === 'update') {
                    var request = 'put'
                  }
                  config.controllers.controllerNames.push({ name: (modelFile).slice(0, -3), type: myFile.slice(0, -3), request })
  
  
                  if (index === directories.length - 1 && indexTwo === files.length - 1) {
  
  
                    setTimeout(function () { global.trakbak.controllers = true; }, 0);
  
  
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



