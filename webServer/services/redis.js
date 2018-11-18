const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const CircularJSON = require('circular-json');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

console.log(client);

client.hget = util.promisify(client.hget);
client.hset = util.promisify(client.hset);
const CronJob = require('cron').CronJob;
const exec = mongoose.Query.prototype.exec;
const moment = require('moment');




// client.hgetall('crons', (err, data) => {
//   console.log(data);
// });





mongoose.Query.prototype.cache = function (cache, id) {
  this.clientID = id;
  if (cache) {
    this.useCache = true;

    //  console.log('THISSS', this.clientID);
  }

  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }


  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));


  // see if we have a vlaue for 'key' in redis.


  const cacheValue = await client.hget(JSON.stringify(this.clientID).replace(/"/g, ''), key);

  // If we do, return that.


  if (cacheValue && JSON.parse(cacheValue).length > 0) {

    // console.log(crons[this.clientID + key]);
    var cron = crons[this.clientID + key];





    if (cron) {
      var time = moment(moment(cron.cronTime.source).format()).unix()*1000;
      if ( time > Date.now()) {
        var compare = Date.now() + 30000;
 
      //  console.log(time)

   //     crons[this.clientID + key].cronTime.source = moment(compare).parseZone();
   const CronTime = require('cron').CronTime;
   var time = new CronTime(new Date(compare));
      //  crons[this.clientID + key].setTime(CronJob.time(new Date(compare)));
      
        crons[this.clientID + key].setTime(time);
        crons[this.clientID + key].start();
     //   console.log( crons[this.clientID + key].cronTime.source );
      } else {
        crons[this.clientID + key].stop();
        delete crons[this.clientID + key];
      }
        const doc = JSON.parse(cacheValue);


        return Array.isArray(doc)
          ? doc.map(d => new this.model(d))
          : new this.model(doc);
      
    }
  }



  // if (cacheValue) {


  //   const doc =  JSON.parse(cacheValue);

  //  // this.model
  // //  this.model = doc;

  //   await doc.map((d, index) => {


  //   new this.model(d)

  //   if(doc.map.length === index) {

  //    return this


  //   }



  // });



  // //return exec.apply(this, arguments)
  // return Array.isArray(doc) 
  // ? doc.map(d => {
  //   console.log(this.model(d))
  //   new this.model(d)}
  // )
  // : new this.model(doc);

  // }

  // Otherwise, issue the query and store the result in redis.



  const result = await exec.apply(this, arguments);

  client.hset(JSON.stringify(this.clientID).replace(/"/g, ''), key, JSON.stringify(result));

  createCron(this.clientID + key, { timezone: 'America/Denver', runTime: new Date(Date.now() + 60000), runOnInit: false, fireOnce: true, type: { name: 'clearCache', id: this.clientID, key: key } });

  return result;
}

module.exports = {
  clearHash(hashKey) {
    var string = JSON.stringify(hashKey).replace(/\"/g, "");
    client.del(string);

  },
  clearKey(id, key) {
    console.log('ID', id, 'KEY', key)
    client.hdel(JSON.stringify(id).replace(/"/g, ''), key, (err, data) => {
        console.log(err);
    });
  },
  saveCrons(cron) {
    if (cron) {
//      console.log(cron)
      client.hset('crons', Date.now().toString(), JSON.stringify(cron));
    }
  },
  restoreCrons:() => { 

    client.hgetall('crons', (err, cronss) => {
      // console.log('FUCK')
      console.log(cronss);
       if(cronss) {
       Object.keys(cronss).forEach( (cron) => {
     
      //   console.log('diz be cron', JSON.parse(cronss[cron]))
         cronObj = JSON.parse(JSON.parse(cronss[cron]));
         
         //console.log(cron, JSON.parse(crons[cron]));
        // var obj = JSON.parse(JSON.parse(crons[cron]));
        // console.log(obj)
       //  new CronJob(obj.cronTime, obj.onTick, obj.onComplete, obj.start, obj.timezone, obj.context, obj.runOnInit, obj.unrefTimeout);
      //   console.log(obj)
       //new CronJob(JSON.parse(cronss[cron]));
        
        var id = cronObj.cronName.split('{')[0];
        var key = cronObj.cronName.match(/\{(.*?)\}/)[0];
        
       // console.log('ID: ',id, 'KEYL', JSON.stringify(key), typeof(JSON.stringify(key)))
        key = JSON.stringify(key);

        
       createCron(cronObj.cronName, { timezone: cronObj.cronTime.zone, runTime: moment(cronObj.cronTime.source), runOnInit: false, fireOnce: cronObj.runOnce, type: { name: 'clearCache', id: id, key:key } });
     
     
     
     
       })
     
     }
     
     
     })
   
  }
};