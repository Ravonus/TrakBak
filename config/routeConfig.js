const fs = require("fs");

config.controllers.controllerNames.forEach((name) => {
    console.log(name.name)
})

module.exports = () => {
    console.log('test')
    fs.readdirSync(__dirname).forEach(function(file) {
        if(!file.split('.')[1])
        var model = file;
        if(config.controllers[model]){

            fs.readdirSync(`${__dirname}/${model}`).forEach(function(file) {

                console.log(file)
                
            });
        }
      });
    
}




  