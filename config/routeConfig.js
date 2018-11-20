const fs = require("fs");
var configs = {}


module.exports = (done) => {



config.controllers.controllerNames.forEach((name) => {

})

    var dirLength = fs.readdirSync(__dirname).length;
    var lastIndex = 0;
    var lastFiles = {};
    var configs = {};
    fs.readdirSync(__dirname).forEach(function(file, indexFirst) {

        if(!file.split('.')[1]) 
        var model = file;
        if(config.controllers[model]){

            fs.readdir(`${__dirname}/${model}`, (err, files) => {
                lastFiles = files;

    
            
            files.forEach(function(file, index) {
                lastIndex = index;
                if(file !== 'environments'){

                   
                

                fs.readFile(`${__dirname}/${model}/${file}`, 'utf8', function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    content = JSON.parse(data);

                    if(!configs[model]) {
                        configs[model] = {};
                        
                    }

                    configs[model][file.split('.')[0]] = content;
                
                    checkEnd(indexFirst, index, files, dirLength, configs);
                });

            }
         
            });

        });
        } else {

            dirLength--;

          
        }

        function checkEnd(indexFirst, index, files, dirLength, configs) {

            if (index === files.length - 1 && indexFirst === dirLength - 1) { 

                
                exportRun(configs, files);
            }
        
        }

      });



      function exportRun(obj, files) {

           done(obj, files);
      }
    
    }

    
//module.exports = configs;