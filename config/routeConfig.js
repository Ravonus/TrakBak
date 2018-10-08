const fs = require("fs");
var configs = {}


module.exports =  (done) => {
    

config.controllers.controllerNames.forEach((name) => {
    console.log(name.name)
})

    var dirLength = fs.readdirSync(__dirname).length;
    fs.readdirSync(__dirname).forEach(function(file, indexFirst) {
        
        if(!file.split('.')[1]) 
        var model = file;
        if(config.controllers[model]){

            fs.readdir(`${__dirname}/${model}`, (err, files) => {

    
            
            files.forEach(function(file, index) {

                if(file !== 'environments'){

                fs.readFile(`${__dirname}/${model}/${file}`, 'utf8', function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    content = JSON.parse(data);

                    configs[model] = content;
    
                    if (index === files.length - 1 && indexFirst === dirLength) { 
                      //  module.exports = 'cry fuck';
                      console.log('runnnn??',   fs.readdirSync(__dirname).length)
                        exportRun(configs, files);
                    }
                });

            }
                
            });

        });
        } else {
            dirLength--;
        }
      });



      function exportRun(obj, files) {
           done(obj, files);
      }
    
    }


 //   console.log(configs);
 //console.log(obj);


    
//module.exports = configs;