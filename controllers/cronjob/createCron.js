'user strict';
const moment = require('moment');
var functionTypes = {};
const { saveCrons } = require('../../webServer/services/redis');
const  CircularJSON = require('circular-json');

var crons = {};

require("fs").readdirSync(__dirname+'/functions/').forEach(async function (file) {
  if (file !== 'socket.io.js' && file !== 'clientWrite.js' && file !== 'clients') {

    functionTypes[file.replace('.js','')] = require(`${__dirname}/functions/${file}`)

  }

});


//time, type, info, options, name

function onDelete(name) {
//  console.log(crons[name]);
  delete crons[name];
 //   delete crons[name];
}

function onComplete(cron) {

  if(cron){
   // console.log(crons[cron])
    console.log(cron);
    const json = crons[cron];
    console.log(json)
    saveCrons(json);
  }
}



module.exports = async (name, options) => {
// if(!options.fireOnce) {

//   onComplete = null;
// }


if(options.type === 'clearCache') {

}

var wrapper = { };
wrapper[test];
const CronJob = require('cron').CronJob;
crons[name] = await Object.assign(new CronJob(options.runTime, function() {


  if(typeof(this.cronTime.source) === 'string' || moment(this.cronTime.source).valueOf() < Date.now()) {

    switch(options.type.name) {
      case 'clearCache':

          functionTypes.clearCache(options.type.id, options.type.key);
          break;
      default:
          console.log('default')
    }
  


  if(options.fireOnce || this.fireOnce) {

    this.stop();
    onDelete(name, options, this);

  }


  //const json = JSON.stringify(this);
  // saveCrons(json);
  
  }
},onComplete(name), true, options.timezone, null, options.runOnInit),{'cronName':name});

  
  crons[name].fireOnce = options.fireOnce;


};