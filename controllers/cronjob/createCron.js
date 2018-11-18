'user strict';
const moment = require('moment');
var functionTypes = {};
const { saveCrons } = require('../../webServer/services/redis');
//const CircularJSON = require('circular-json');
// require("json-circular-stringify");

require("fs").readdirSync(__dirname + '/functions/').forEach(function (file) {
  if (file !== 'socket.io.js' && file !== 'clientWrite.js' && file !== 'clients') {

    functionTypes[file.replace('.js', '')] = require(`${__dirname}/functions/${file}`)

  }

});


//time, type, info, options, name

function onDelete(name) {
  //  console.log(crons[name]);
  delete crons[name];
  //   delete crons[name];
}

function onComplete(cron) {

  var cronCompleted = new Promise(
    function (resolve, reject) {

      (function waitForCron(count = -1) {
        count++
        if (count > 600) {
          return reject({ err: { message: 'Count for loop too high. Is it going forever?' } });
        }
        if (crons[cron]) return resolve(crons[cron]);
        setTimeout(waitForCron, 100);
      })();

    }





  );

  var finishPromise = () => {
    cronCompleted
      .then((cronTabs) => {
      // console.log(cronTabs);

        //  const json = JSON.stringify(crons[cron]);
        var jsons = {};
      //   Object.keys(cronTabs).forEach((cronJob) => {
      //  //   console.log(cronTabs[cronJob]);
      //     jsons.push(JSON.stringify(cronTabs[cronJob]));
          
      //   })

        Object.keys(cronTabs.cronTime).forEach( (cronTime) => {
            console.log(cronTabs.cronTime[cronTime])
            jsons[cronTime] = cronTabs.cronTime[cronTime];
        })
        var cronObj = { runOnce: cronTabs.runOnce, running: cronTabs.running, cronTime:jsons, cronName:cronTabs.cronName, createTime:cronTabs.createTime, fireOnce:cronTabs.fireOnce};
        console.log(cronObj);
        console.log(JSON.stringify(cronObj));
        saveCrons(JSON.stringify(cronObj));
      })
      .catch((err) => {
        console.log(err);
      });
  };

 // finishPromise();

  // console.log('FUCK', cron);
  // if(cron && crons[cron]){
  // console.log('DIZ CRON',crons[cron])

  // //  const json = JSON.stringify(crons[cron]);
  //   Object.keys(crons[cron]).forEach( (cronJob) => {
  //       console.log(crons[cron][cronJob]);
  //   })


  //  // saveCrons(json);
  // }
}



module.exports = (name, options) => {
  // if(!options.fireOnce) {

  //   onComplete = null;
  // }


  if (options.type === 'clearCache') {

  }


  const CronJob = require('cron').CronJob;

  crons[name] = Object.assign(new CronJob(options.runTime, function () {


    if (typeof (this.cronTime.source) === 'string' || moment(this.cronTime.source).valueOf() < Date.now()) {

      switch (options.type.name) {
        case 'clearCache':

          functionTypes.clearCache(options.type.id, options.type.key);
          break;
        default:
          console.log('default')
      }



      if (options.fireOnce || this.fireOnce) {

        this.stop();
        onDelete(name, options, this);

      }


      //const json = JSON.stringify(this);
      // saveCrons(json);

    }
  }, onComplete(name), true, options.timezone, null, options.runOnInit), { 'cronName': name, createTime: Date.now() });


  crons[name].fireOnce = options.fireOnce;


};